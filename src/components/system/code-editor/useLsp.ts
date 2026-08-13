import { ref, type Ref, type ShallowRef, toRaw } from "vue";
import * as monaco from "monaco-editor";

/** 支持LSP的语言列表 */
const LSP_LANGUAGES = new Set(["java", "csharp", "cpp"]);

/** 语言 -> 默认文件扩展名 */
const LANG_EXTENSIONS: Record<string, string> = {
  java: ".java",
  csharp: ".cs",
  cpp: ".cpp",
};

const pendingRequests = new Map<
  number,
  { resolve: (v: any) => void; reject: (r: any) => void }
>();
const LSP_MAX_RECONNECT_ATTEMPTS = 10;
const LSP_RECONNECT_DELAY = 3000;
const LSP_INIT_TIMEOUT = 60000;

export function useLsp(
  lspServerUrl: Ref<string>,
  editorInstance: ShallowRef<monaco.editor.IStandaloneCodeEditor | undefined>,
  currentLang: Ref<string>,
  getDocumentUri: () => string,
) {
  const lspConnected = ref(false);

  let lspWs: WebSocket | null = null;
  let lspInitialized = false;
  let lspRequestId = 100;
  let documentVersion = 0;
  let lspReconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let lspReconnectAttempts = 0;
  let lspInitTimer: ReturnType<typeof setTimeout> | null = null;
  let keywordProvidersRegistered = false;

  // 当前文档在工作空间中的相对路径（用于文件同步API）
  let currentDocRelativePath = "";
  // 当前文档的完整URI（用于LSP协议）
  let currentDocUri = "";
  // 当前工作空间根URI
  let workspaceRootUri = "";
  // 文件同步防抖定时器
  let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  // ===== 判断是否需要LSP =====
  const isLspLanguage = (lang: string) => LSP_LANGUAGES.has(lang);

  // ===== 文件同步到后端工作空间 =====
  const syncFileToWorkspace = async (relativePath: string, content: string) => {
    if (!lspServerUrl.value || !currentLang.value) return;
    const lang = currentLang.value;
    try {
      const baseUrl = lspServerUrl.value.replace(/\/+$/, "");
      // 从 ws://host:port/language-server/lsp/java 提取 http 基础URL
      const httpBase = baseUrl.replace(/^ws/, "http");
      const url = `${httpBase}/api/lsp/workspace/${lang}/sync`;
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: relativePath, content }),
      });
    } catch (e) {
      console.warn("[LSP] File sync failed:", e);
    }
  };

  // ===== 计算文档URI和相对路径 =====
  const computeDocInfo = (
    lang: string,
    fileName: string,
  ): { uri: string; relativePath: string } => {
    if (!workspaceRootUri) {
      // 工作空间还没初始化，用默认路径
      const defaultWorkspace = `file:///D:/lsp-workspace/${lang}`;
      workspaceRootUri = defaultWorkspace;
    }

    let relativePath: string;
    if (lang === "java") {
      // Java: Maven标准路径 src/main/java/com/example/demo/FileName.java
      const nameWithoutExt = fileName.replace(/\.java$/, "");
      const packagePath = nameWithoutExt.split(".").join("/");
      relativePath = `src/main/java/${packagePath}.java`;
    } else {
      relativePath = fileName;
    }

    const uri = `${workspaceRootUri.replace(/\/+$/, "")}/${relativePath}`;
    return { uri, relativePath };
  };

  // ===== 发送消息 =====
  const sendLspRequest = (method: string, params: any): Promise<any> =>
    new Promise((resolve, reject) => {
      if (!lspWs || lspWs.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket not open"));
        return;
      }
      const id = ++lspRequestId;
      pendingRequests.set(id, { resolve, reject });
      lspWs!.send(JSON.stringify({ jsonrpc: "2.0", id, method, params }));
      setTimeout(() => {
        if (pendingRequests.has(id)) {
          pendingRequests.delete(id);
          reject(new Error(`LSP timeout: ${method}`));
        }
      }, 10000);
    });

  const sendLspNotification = (method: string, params: any) => {
    if (lspWs?.readyState === WebSocket.OPEN)
      lspWs.send(JSON.stringify({ jsonrpc: "2.0", method, params }));
  };

  const sendLspResponse = (id: number, result: any) => {
    if (lspWs?.readyState === WebSocket.OPEN)
      lspWs.send(JSON.stringify({ jsonrpc: "2.0", id, result }));
  };

  // ===== 初始化 =====
  const initializeLsp = () => {
    if (lspInitialized) return;
    if (lspInitTimer) clearTimeout(lspInitTimer);
    lspInitTimer = setTimeout(() => {
      if (!lspInitialized) console.warn("[LSP] Init timeout");
    }, LSP_INIT_TIMEOUT);
  };

  const handleInitializeResponse = (result: any) => {
    if (lspInitialized) return;
    lspInitialized = true;
    if (lspInitTimer) {
      clearTimeout(lspInitTimer);
      lspInitTimer = null;
    }

    // 保存工作空间根URI
    if (result.rootUri) {
      workspaceRootUri = result.rootUri.replace(/\/+$/, "");
    }

    console.log("[LSP] Initialized, rootUri=" + workspaceRootUri);

    // 发送initialized通知
    sendLspNotification("initialized", {});

    // 打开当前文档
    openCurrentDocument();
  };

  // ===== 打开当前文档 =====
  const openCurrentDocument = () => {
    const editor = toRaw(editorInstance.value);
    const text = editor?.getValue() || "";
    const lang = currentLang.value;
    const fileName =
      getDocumentUri().split("/").pop() ||
      `untitled${LANG_EXTENSIONS[lang] || ".txt"}`;

    const { uri, relativePath } = computeDocInfo(lang, fileName);
    currentDocUri = uri;
    currentDocRelativePath = relativePath;

    console.log(`[LSP] Opening document: ${uri} (relative: ${relativePath})`);

    // 先同步文件到后端工作空间，再发送didOpen
    syncFileToWorkspace(relativePath, text).then(() => {
      documentVersion = 0;
      sendLspNotification("textDocument/didOpen", {
        textDocument: { uri, languageId: lang, version: 0, text },
      });
    });
  };

  // ===== 消息处理 =====
  const mapSeverity = (s: number) =>
    s === 1
      ? monaco.MarkerSeverity.Error
      : s === 2
        ? monaco.MarkerSeverity.Warning
        : s === 3
          ? monaco.MarkerSeverity.Info
          : monaco.MarkerSeverity.Hint;

  const mapCompletionKind = (
    k: number,
  ): monaco.languages.CompletionItemKind => {
    const m: Record<number, monaco.languages.CompletionItemKind> = {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
      11: 11,
      12: 12,
      13: 13,
      14: 14,
      15: 27,
      16: 16,
      17: 17,
      18: 18,
      19: 19,
      20: 20,
      21: 21,
      22: 22,
      23: 23,
      24: 24,
      25: 25,
    };
    return m[k] || 1;
  };

  const handleLspMessage = (msg: any) => {
    // server-to-client 请求
    if (msg.id != null && msg.method) {
      if (msg.method === "workspace/configuration") {
        const items = (msg.params?.items || []).map((item: any) => {
          const section = item.section || "";
          if (section === "java") {
            return {
              import: { maven: { enabled: true }, gradle: { enabled: false } },
              project: { sourcePaths: ["src/main/java", "src/test/java"] },
            };
          }
          return {};
        });
        sendLspResponse(msg.id, items);
      } else if (msg.method === "workspace/applyEdit") {
        sendLspResponse(msg.id, { applied: true });
      } else if (msg.method === "window/showMessageRequest") {
        sendLspResponse(msg.id, msg.params?.actions?.[0] || null);
      } else {
        sendLspResponse(msg.id, null);
      }
      if (
        msg.method === "client/registerCapability" &&
        msg.params?.registrations
      ) {
        console.log(
          "[LSP] Registered capabilities:",
          msg.params.registrations.map((r: any) => r.method),
        );
      }
      return;
    }
    // 响应
    if (msg.id != null) {
      const p = pendingRequests.get(msg.id);
      if (p) {
        pendingRequests.delete(msg.id);
        msg.error ? p.reject(msg.error) : p.resolve(msg.result);
        return;
      }
      if (!lspInitialized && msg.result?.capabilities) {
        handleInitializeResponse(msg.result);
        return;
      }
      return;
    }
    // 通知
    if (msg.method === "textDocument/publishDiagnostics") {
      const editor = toRaw(editorInstance.value);
      const m = editor?.getModel();
      if (!m) return;
      const markers = (msg.params?.diagnostics || []).map((d: any) => ({
        severity: mapSeverity(d.severity),
        message: d.message,
        startLineNumber: d.range.start.line + 1,
        startColumn: d.range.start.character + 1,
        endLineNumber: d.range.end.line + 1,
        endColumn: d.range.end.character + 1,
      }));
      monaco.editor.setModelMarkers(m, currentLang.value, markers);
    }
  };

  // ===== 补全 =====
  const requestCompletion = async (
    textModel: monaco.editor.ITextModel,
    position: monaco.Position,
  ): Promise<monaco.languages.CompletionList | undefined> => {
    if (!lspWs || lspWs.readyState !== WebSocket.OPEN || !lspInitialized)
      return undefined;
    if (!currentDocUri) return undefined;
    try {
      const result = await sendLspRequest("textDocument/completion", {
        textDocument: { uri: currentDocUri },
        position: {
          line: position.lineNumber - 1,
          character: position.column - 1,
        },
      });
      if (!result) return undefined;
      const items = result.items || result || [];
      const word = textModel.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: items.map((item: any, i: number) => ({
          label: item.label,
          kind: mapCompletionKind(item.kind),
          insertText: item.insertText || item.label,
          detail: item.detail || "",
          documentation: item.documentation?.value || item.documentation || "",
          sortText: item.sortText || String(i).padStart(5, "0"),
          filterText: item.filterText || item.label,
          range,
        })),
        incomplete: result.isIncomplete || false,
      };
    } catch {
      return undefined;
    }
  };

  const registerProviders = () => {
    if (keywordProvidersRegistered) return;
    keywordProvidersRegistered = true;
    ["java", "csharp", "cpp"].forEach((lang) => {
      monaco.languages.registerCompletionItemProvider(lang, {
        triggerCharacters: [".", "(", ":", ">", " ", "@"],
        provideCompletionItems: async (model, pos) => {
          const lsp = await requestCompletion(model, pos);
          if (lsp && lsp.suggestions.length > 0) return lsp;
          return { suggestions: [], incomplete: false };
        },
      });
    });
  };

  // ===== 连接管理 =====
  const clearReconnectTimer = () => {
    if (lspReconnectTimer) {
      clearTimeout(lspReconnectTimer);
      lspReconnectTimer = null;
    }
  };

  const scheduleReconnect = (lang: string) => {
    if (lspReconnectAttempts >= LSP_MAX_RECONNECT_ATTEMPTS) return;
    lspReconnectAttempts++;
    lspReconnectTimer = setTimeout(
      () => connectLsp(lang),
      LSP_RECONNECT_DELAY * lspReconnectAttempts,
    );
  };

  const connectLsp = (lang: string) => {
    // 只对支持LSP的语言连接
    if (!isLspLanguage(lang)) {
      console.log(
        `[LSP] Language '${lang}' does not require LSP, skipping connection`,
      );
      return;
    }
    if (!lspServerUrl.value) return;

    clearReconnectTimer();
    if (lspWs) {
      lspWs.onclose = null;
      lspWs.close();
      lspWs = null;
    }
    lspInitialized = false;
    workspaceRootUri = "";
    pendingRequests.clear();

    try {
      lspWs = new WebSocket(
        `${lspServerUrl.value.replace(/\/+$/, "")}/lsp/${lang}`,
      );
    } catch {
      lspWs = null;
      scheduleReconnect(lang);
      return;
    }
    lspWs.onopen = () => {
      lspReconnectAttempts = 0;
      lspConnected.value = true;
      console.log(`[LSP] Connected: ${lang}`);
      initializeLsp();
    };
    lspWs.onmessage = (ev) => {
      try {
        handleLspMessage(JSON.parse(ev.data));
      } catch {}
    };
    lspWs.onclose = (ev) => {
      lspConnected.value = false;
      lspInitialized = false;
      workspaceRootUri = "";
      if (ev.code !== 1000) scheduleReconnect(lang);
    };
    lspWs.onerror = () => {
      lspConnected.value = false;
    };
  };

  const disconnectLsp = () => {
    clearReconnectTimer();
    if (lspInitTimer) {
      clearTimeout(lspInitTimer);
      lspInitTimer = null;
    }
    if (syncDebounceTimer) {
      clearTimeout(syncDebounceTimer);
      syncDebounceTimer = null;
    }
    lspReconnectAttempts = LSP_MAX_RECONNECT_ATTEMPTS;
    if (lspWs) {
      lspWs.onclose = null;
      lspWs.close();
      lspWs = null;
    }
    lspConnected.value = false;
    lspInitialized = false;
    workspaceRootUri = "";
    pendingRequests.clear();
  };

  /** 通知LSP文档打开（切换标签页时调用） */
  const notifyDidOpen = () => {
    if (!lspWs || lspWs.readyState !== WebSocket.OPEN || !lspInitialized)
      return;
    // 只有LSP语言才发送
    if (!isLspLanguage(currentLang.value)) return;
    openCurrentDocument();
  };

  /** 通知LSP文档内容变化（输入时调用） */
  const notifyDidChange = () => {
    if (!lspWs || lspWs.readyState !== WebSocket.OPEN || !lspInitialized)
      return;
    if (!isLspLanguage(currentLang.value)) return;
    if (!currentDocUri) return;

    const editor = toRaw(editorInstance.value);
    if (!editor) return;
    const text = editor.getValue();
    documentVersion++;
    sendLspNotification("textDocument/didChange", {
      textDocument: { uri: currentDocUri, version: documentVersion },
      contentChanges: [{ text }],
    });

    // 防抖同步文件到后端工作空间（1秒后）
    if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(() => {
      if (currentDocRelativePath) {
        syncFileToWorkspace(currentDocRelativePath, text);
      }
    }, 1000);
  };

  /** 根据当前文件语言自动切换LSP连接 */
  const switchLanguage = (lang: string) => {
    if (!isLspLanguage(lang)) {
      // 当前语言不需要LSP，断开连接
      if (lspWs) {
        disconnectLsp();
      }
      return;
    }
    if (!lspServerUrl.value) return;
    // 如果已连接相同语言，不需要重连
    if (lspWs && lspWs.readyState === WebSocket.OPEN && lspInitialized) {
      // 同语言只重新打开文档
      openCurrentDocument();
      return;
    }
    // 不同语言或未连接，重新连接
    connectLsp(lang);
  };

  return {
    lspConnected,
    connectLsp,
    disconnectLsp,
    registerProviders,
    notifyDidOpen,
    notifyDidChange,
    isLspLanguage,
    switchLanguage,
  };
}
