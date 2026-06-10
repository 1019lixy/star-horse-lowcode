import { ref, toRaw, type Ref, type ShallowRef } from "vue";
import * as monaco from "monaco-editor";

const pendingRequests = new Map<number, { resolve: (v: any) => void; reject: (r: any) => void }>();
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
    sendLspNotification("initialized", {});
    const editor = toRaw(editorInstance.value);
    const text = editor?.getValue() || "";
    sendLspNotification("textDocument/didOpen", {
      textDocument: { uri: getDocumentUri(), languageId: currentLang.value, version: 0, text },
    });
  };

  // ===== 消息处理 =====
  const mapSeverity = (s: number) =>
    s === 1 ? monaco.MarkerSeverity.Error
    : s === 2 ? monaco.MarkerSeverity.Warning
    : s === 3 ? monaco.MarkerSeverity.Info
    : monaco.MarkerSeverity.Hint;

  const mapCompletionKind = (k: number): monaco.languages.CompletionItemKind => {
    const m: Record<number, monaco.languages.CompletionItemKind> = {
      1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10,
      11: 11, 12: 12, 13: 13, 14: 14, 15: 27, 16: 16, 17: 17, 18: 18,
      19: 19, 20: 20, 21: 21, 22: 22, 23: 23, 24: 24, 25: 25,
    };
    return m[k] || 1;
  };

  const handleLspMessage = (msg: any) => {
    // server-to-client 请求
    if (msg.id != null && msg.method) {
      if (msg.method === "workspace/configuration")
        sendLspResponse(msg.id, (msg.params?.items || []).map(() => ({})));
      else if (msg.method === "workspace/applyEdit")
        sendLspResponse(msg.id, { applied: true });
      else if (msg.method === "window/showMessageRequest")
        sendLspResponse(msg.id, msg.params?.actions?.[0] || null);
      else sendLspResponse(msg.id, null);
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
    if (!lspWs || lspWs.readyState !== WebSocket.OPEN || !lspInitialized) return undefined;
    try {
      const result = await sendLspRequest("textDocument/completion", {
        textDocument: { uri: getDocumentUri() },
        position: { line: position.lineNumber - 1, character: position.column - 1 },
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
    ["java", "csharp", "cpp"].forEach(lang => {
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
    lspReconnectTimer = setTimeout(() => connectLsp(lang), LSP_RECONNECT_DELAY * lspReconnectAttempts);
  };

  const connectLsp = (lang: string) => {
    if (!lspServerUrl.value) return;
    clearReconnectTimer();
    if (lspWs) {
      lspWs.onclose = null;
      lspWs.close();
      lspWs = null;
    }
    lspInitialized = false;
    pendingRequests.clear();
    try {
      lspWs = new WebSocket(`${lspServerUrl.value.replace(/\/+$/, "")}/lsp/${lang}`);
    } catch {
      lspWs = null;
      scheduleReconnect(lang);
      return;
    }
    lspWs.onopen = () => {
      lspReconnectAttempts = 0;
      lspConnected.value = true;
      initializeLsp();
    };
    lspWs.onmessage = (ev) => {
      try { handleLspMessage(JSON.parse(ev.data)); } catch {}
    };
    lspWs.onclose = (ev) => {
      lspConnected.value = false;
      lspInitialized = false;
      if (ev.code !== 1000) scheduleReconnect(lang);
    };
    lspWs.onerror = () => { lspConnected.value = false; };
  };

  const disconnectLsp = () => {
    clearReconnectTimer();
    if (lspInitTimer) {
      clearTimeout(lspInitTimer);
      lspInitTimer = null;
    }
    lspReconnectAttempts = LSP_MAX_RECONNECT_ATTEMPTS;
    if (lspWs) {
      lspWs.onclose = null;
      lspWs.close();
      lspWs = null;
    }
    lspConnected.value = false;
    lspInitialized = false;
    pendingRequests.clear();
  };

  /** 通知LSP文档内容变化 */
  const notifyDidOpen = () => {
    if (!lspWs || lspWs.readyState !== WebSocket.OPEN || !lspInitialized) return;
    const editor = toRaw(editorInstance.value);
    const text = editor?.getValue() || "";
    documentVersion = 0;
    sendLspNotification("textDocument/didOpen", {
      textDocument: { uri: getDocumentUri(), languageId: currentLang.value, version: 0, text },
    });
  };

  const notifyDidChange = () => {
    if (!lspWs || lspWs.readyState !== WebSocket.OPEN || !lspInitialized) return;
    const editor = toRaw(editorInstance.value);
    if (!editor) return;
    documentVersion++;
    sendLspNotification("textDocument/didChange", {
      textDocument: { uri: getDocumentUri(), version: documentVersion },
      contentChanges: [{ text: editor.getValue() }],
    });
  };

  return {
    lspConnected,
    connectLsp,
    disconnectLsp,
    registerProviders,
    notifyDidOpen,
    notifyDidChange,
  };
}
