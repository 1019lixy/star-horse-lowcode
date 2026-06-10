<script setup lang="ts" name="StarHorseCodeEditor">
import { nextTick, onMounted, onBeforeUnmount, PropType, ref, shallowRef, watch, toRaw } from "vue";
import * as monaco from "monaco-editor";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import { i18n } from "@/lang";

const model = defineModel("value", { default: "" });

const props = defineProps({
  language: { type: String, default: "java" },
  theme: { type: String, default: "vs-dark" },
  readOnly: { type: Boolean, default: false },
  boxHeight: { type: String, default: "100%" },
  lspServerUrl: { type: String, default: "" },
  filePath: { type: String, default: "" },
  btnList: { type: Object as PropType<Array<any>>, default: () => [] },
  helpMsg: { type: String },
  minimap: { type: Boolean, default: true },
  fontSize: { type: Number, default: 14 },
  autoSaveDelay: { type: Number, default: 0 },
});

const emit = defineEmits(["change", "lspConnected", "lspDisconnected"]);

// ==================== 语言定义 ====================
const languages = ref([
  { name: "Java", value: "java" },
  { name: "C#", value: "csharp" },
  { name: "C++", value: "cpp" },
  { name: "JavaScript", value: "javascript" },
  { name: "TypeScript", value: "typescript" },
  { name: "Python", value: "python" },
  { name: "Go", value: "go" },
  { name: "SQL", value: "sql" },
  { name: "JSON", value: "json" },
  { name: "YAML", value: "yaml" },
  { name: "XML", value: "xml" },
  { name: "HTML", value: "html" },
  { name: "CSS", value: "css" },
  { name: "Markdown", value: "markdown" },
]);

const themes = ref([
  { name: "VS Dark", value: "vs-dark" },
  { name: "VS Light", value: "vs" },
  { name: "HC Black", value: "hc-black" },
]);

// ==================== 状态 ====================
const editorContainer = ref<HTMLElement>();
const editorInstance = shallowRef<monaco.editor.IStandaloneCodeEditor>();
const currentLang = ref(props.language);
const currentTheme = ref(props.theme);
const lspConnected = ref(false);

// LSP 相关
let lspWs: WebSocket | null = null;
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;
let lastInternalValue: string | null = null;
let keywordProvidersRegistered = false;
let lspInitialized = false;
let lspRequestId = 100; // 从100开始，避免和后端initialize请求的id=1冲突
let documentVersion = 0;
let workspaceRootUri = ""; // 从initialize响应中获取的工作空间根URI
let lspReconnectTimer: ReturnType<typeof setTimeout> | null = null;
let lspReconnectAttempts = 0;
let lspInitTimer: ReturnType<typeof setTimeout> | null = null;
const LSP_MAX_RECONNECT_ATTEMPTS = 10;
const LSP_RECONNECT_DELAY = 3000; // 3秒
const LSP_INIT_TIMEOUT = 60000; // 60秒超时
const pendingRequests = new Map<number, { resolve: (value: any) => void; reject: (reason: any) => void }>();

// ==================== LSP 请求/通知发送 ====================
const sendLspRequest = (method: string, params: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!lspWs || lspWs.readyState !== WebSocket.OPEN) {
      reject(new Error("WebSocket not open"));
      return;
    }
    const id = ++lspRequestId;
    const msg = { jsonrpc: "2.0", id, method, params };
    pendingRequests.set(id, { resolve, reject });
    lspWs!.send(JSON.stringify(msg));
    // 超时处理
    setTimeout(() => {
      if (pendingRequests.has(id)) {
        pendingRequests.delete(id);
        reject(new Error(`LSP request timeout: ${method}`));
      }
    }, 10000);
  });
};

const sendLspNotification = (method: string, params: any) => {
  if (!lspWs || lspWs.readyState !== WebSocket.OPEN) return;
  lspWs.send(JSON.stringify({ jsonrpc: "2.0", method, params }));
};

const sendLspResponse = (id: number, result: any) => {
  if (!lspWs || lspWs.readyState !== WebSocket.OPEN) return;
  lspWs.send(JSON.stringify({ jsonrpc: "2.0", id, result }));
};

// ==================== 获取文档URI ====================
const getDocumentUri = () => {
  // 文档URI必须在工作空间根目录下，Language Server才能提供补全
  // workspaceRootUri 格式: file:///D:/lsp-workspace/java
  if (workspaceRootUri) {
    const fileName = props.filePath
      ? props.filePath.replace(/^\/+/, "") // 去掉开头的斜杠
      : `src/untitled.${getFileExtension(currentLang.value)}`;
    return `${workspaceRootUri}/${fileName}`;
  }
  // fallback: 如果还没收到initialize响应，使用临时路径
  return `file:///tmp/workspace/src/untitled.${getFileExtension(currentLang.value)}`;
};

const getFileExtension = (lang: string): string => {
  const extMap: Record<string, string> = {
    java: "java", csharp: "cs", cpp: "cpp", javascript: "js",
    typescript: "ts", python: "py", go: "go", sql: "sql",
    json: "json", yaml: "yml", xml: "xml", html: "html",
    css: "css", markdown: "md",
  };
  return extMap[lang] || "txt";
};

// ==================== LSP 初始化 ====================
const initializeLsp = async () => {
  if (lspInitialized) return;

  // 后端在WebSocket连接建立时已发送initialize请求到Language Server
  // 前端需要等待后端返回initialize响应后，发送initialized通知和didOpen
  console.log("[LSP] Waiting for initialize response from backend...");

  // 设置超时：JDT.LS首次启动可能需要30-60秒
  if (lspInitTimer) clearTimeout(lspInitTimer);
  lspInitTimer = setTimeout(() => {
    if (!lspInitialized) {
      console.warn(`[LSP] Initialize timeout (${LSP_INIT_TIMEOUT / 1000}s), Language Server可能仍在启动中，请等待后端日志出现 ServiceReady`);
    }
  }, LSP_INIT_TIMEOUT);
};

/**
 * 处理后端转发的initialize响应
 * 后端在连接建立后会发送initialize请求到Language Server，
 * 然后将响应转发回前端，前端收到后发送initialized和didOpen
 */
const handleInitializeResponse = (result: any) => {
  if (lspInitialized) return;
  lspInitialized = true;

  // 清除初始化超时定时器
  if (lspInitTimer) {
    clearTimeout(lspInitTimer);
    lspInitTimer = null;
  }

  // 保存工作空间根URI，用于构建文档URI
  // 后端sendInitialize中rootUri格式: file:///D:/lsp-workspace/java
  if (result.rootUri) {
    workspaceRootUri = result.rootUri.replace(/\/+$/, "");
  } else {
    // 如果响应中没有rootUri，从后端配置推断
    workspaceRootUri = "file:///D:/lsp-workspace/" + currentLang.value;
  }

  console.log("[LSP] Received initialize response, rootUri=" + workspaceRootUri + ", sending initialized + didOpen");

  // 发送 initialized 通知
  sendLspNotification("initialized", {});

  // 发送 textDocument/didOpen 通知
  const editor = toRaw(editorInstance.value);
  const text = editor?.getValue() || model.value || "";
  documentVersion = 0;
  const docUri = getDocumentUri();
  console.log("[LSP] Opening document: " + docUri);
  sendLspNotification("textDocument/didOpen", {
    textDocument: {
      uri: docUri,
      languageId: currentLang.value,
      version: documentVersion,
      text,
    },
  });
};

// ==================== LSP 连接 ====================
const connectLsp = (lang: string) => {
  if (!props.lspServerUrl) return;
  // 清理旧连接和重连定时器
  clearReconnectTimer();
  if (lspWs) {
    lspWs.onclose = null; // 防止触发重连
    lspWs.close();
    lspWs = null;
  }
  lspInitialized = false;
  workspaceRootUri = "";
  pendingRequests.clear();

  try {
    const baseUrl = props.lspServerUrl.replace(/\/+$/, "");
    const wsUrl = `${baseUrl}/lsp/${lang}`;
    console.log(`[LSP] Connecting to: ${wsUrl} (attempt ${lspReconnectAttempts + 1})`);
    lspWs = new WebSocket(wsUrl);
  } catch (e) {
    console.error("[LSP] WebSocket创建失败:", e);
    lspWs = null;
    scheduleReconnect(lang);
    return;
  }

  lspWs.onopen = () => {
    lspReconnectAttempts = 0; // 连接成功，重置重连计数
    lspConnected.value = true;
    emit("lspConnected");
    console.log(`[LSP] Connected: ${lang}`);
    // 测试WebSocket是否双向通信
    console.log("[LSP] Sending test ping...");
    lspWs!.send(JSON.stringify({ jsonrpc: "2.0", method: "lsp/ping", params: {} }));
    initializeLsp();
  };

  lspWs.onmessage = (event) => {
    // 先打印原始数据，确保onmessage确实被触发
    console.log(`[LSP] <- raw data, length=${event.data?.length}, preview=${String(event.data).substring(0, 100)}`);
    try {
      const msg = JSON.parse(event.data);
      const hasId = msg.id !== undefined && msg.id !== null;
      const hasMethod = !!msg.method;
      const hasResult = !!msg.result;
      const hasCapabilities = !!msg.result?.capabilities;
      console.log(`[LSP] <- msg: id=${msg.id}, method=${msg.method || "none"}, hasResult=${hasResult}, hasCapabilities=${hasCapabilities}, lspInitialized=${lspInitialized}`);
      handleLspMessage(msg);
    } catch (e) {
      console.warn("[LSP] Failed to parse message:", e);
    }
  };

  lspWs.onclose = (event) => {
    lspConnected.value = false;
    lspInitialized = false;
    workspaceRootUri = "";
    emit("lspDisconnected");
    console.log(`[LSP] Disconnected: ${lang}, code=${event.code}, reason=${event.reason}`);
    // 非正常关闭时自动重连
    if (event.code !== 1000) {
      scheduleReconnect(lang);
    }
  };

  lspWs.onerror = () => {
    console.warn(`[LSP] Connection failed: ${lang}`);
    lspConnected.value = false;
  };
};

const clearReconnectTimer = () => {
  if (lspReconnectTimer) {
    clearTimeout(lspReconnectTimer);
    lspReconnectTimer = null;
  }
};

const scheduleReconnect = (lang: string) => {
  if (lspReconnectAttempts >= LSP_MAX_RECONNECT_ATTEMPTS) {
    console.log(`[LSP] Max reconnect attempts (${LSP_MAX_RECONNECT_ATTEMPTS}) reached, giving up`);
    return;
  }
  lspReconnectAttempts++;
  const delay = LSP_RECONNECT_DELAY * lspReconnectAttempts; // 递增延迟
  console.log(`[LSP] Reconnecting in ${delay}ms (attempt ${lspReconnectAttempts}/${LSP_MAX_RECONNECT_ATTEMPTS})...`);
  lspReconnectTimer = setTimeout(() => {
    connectLsp(lang);
  }, delay);
};

const disconnectLsp = () => {
  clearReconnectTimer();
  if (lspInitTimer) {
    clearTimeout(lspInitTimer);
    lspInitTimer = null;
  }
  lspReconnectAttempts = LSP_MAX_RECONNECT_ATTEMPTS; // 阻止重连
  if (lspWs) {
    lspWs.onclose = null; // 防止触发重连
    lspWs.close();
    lspWs = null;
  }
  lspConnected.value = false;
  lspInitialized = false;
  workspaceRootUri = "";
  pendingRequests.clear();
};

// ==================== LSP 消息处理 ====================
const handleLspMessage = (msg: any) => {
  // 处理 server-to-client 请求（有id和method，Language Server要求客户端响应）
  if (msg.id !== undefined && msg.id !== null && msg.method) {
    console.log(`[LSP] Server request: method=${msg.method}, id=${msg.id}`);

    if (msg.method === "workspace/configuration") {
      // workspace/configuration 需要返回配置数组，每个元素对应一个section
      const items = (msg.params?.items || []).map((item: any) => {
        const section = item.section || "";
        // 为Java项目提供基本配置
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
      // workspace/applyEdit 需要返回 applied: true
      sendLspResponse(msg.id, { applied: true });
    } else if (msg.method === "window/showMessageRequest") {
      // window/showMessageRequest 需要返回选择项，默认选第一个
      const actions = msg.params?.actions || [];
      sendLspResponse(msg.id, actions.length > 0 ? { title: actions[0].title } : null);
    } else {
      // 其他请求（client/registerCapability等）回复空结果
      sendLspResponse(msg.id, null);
    }

    if (msg.method === "client/registerCapability" && msg.params?.registrations) {
      console.log("[LSP] Registered capabilities:", msg.params.registrations.map((r: any) => r.method));
    }
    return;
  }

  // 处理响应（有id但没有method，是对前端请求的响应）
  if (msg.id !== undefined && msg.id !== null) {
    const pending = pendingRequests.get(msg.id);
    if (pending) {
      pendingRequests.delete(msg.id);
      if (msg.error) {
        pending.reject(msg.error);
      } else {
        pending.resolve(msg.result);
      }
      return;
    }

    // 后端转发的initialize响应
    if (!lspInitialized && msg.result && msg.result.capabilities) {
      console.log("[LSP] Received initialize response from backend:", msg.result);
      handleInitializeResponse(msg.result);
      return;
    }

    // 其他未匹配的响应，忽略
    return;
  }

  // 处理通知（没有id，有method）
  if (msg.method === "textDocument/publishDiagnostics") {
    const editor = toRaw(editorInstance.value);
    if (!editor) return;
    const editorModel = editor.getModel();
    if (!editorModel) return;

    const diagnostics = msg.params?.diagnostics || [];
    const markers: monaco.editor.IMarkerData[] = diagnostics.map((d: any) => ({
      severity: mapSeverity(d.severity),
      message: d.message,
      startLineNumber: d.range.start.line + 1,
      startColumn: d.range.start.character + 1,
      endLineNumber: d.range.end.line + 1,
      endColumn: d.range.end.character + 1,
    }));
    monaco.editor.setModelMarkers(editorModel, currentLang.value, markers);
  } else if (msg.method) {
    // 其他通知（language/status, window/logMessage等）
    if (msg.method === "language/status") {
      console.log(`[LSP] Status: ${msg.params?.type} - ${msg.params?.message}`);
    }
  }
};

const mapSeverity = (severity: number): monaco.MarkerSeverity => {
  switch (severity) {
    case 1: return monaco.MarkerSeverity.Error;
    case 2: return monaco.MarkerSeverity.Warning;
    case 3: return monaco.MarkerSeverity.Info;
    case 4: return monaco.MarkerSeverity.Hint;
    default: return monaco.MarkerSeverity.Info;
  }
};

// ==================== LSP 补全请求 ====================
const requestCompletion = async (
  textModel: monaco.editor.ITextModel,
  position: monaco.Position
): Promise<monaco.languages.CompletionList | undefined> => {
  if (!lspWs || lspWs.readyState !== WebSocket.OPEN || !lspInitialized) {
    return undefined;
  }

  try {
    console.log(`[LSP] Requesting completion: uri=${getDocumentUri()}, line=${position.lineNumber - 1}, char=${position.column - 1}`);
    const result = await sendLspRequest("textDocument/completion", {
      textDocument: { uri: getDocumentUri() },
      position: {
        line: position.lineNumber - 1,
        character: position.column - 1,
      },
    });

    console.log("[LSP] Completion result:", result ? `items=${(result.items || result || []).length}` : "null");
    if (!result) return undefined;

    const items = result.items || result || [];
    const word = textModel.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };

    const suggestions: monaco.languages.CompletionItem[] = items.map((item: any, index: number) => ({
      label: item.label,
      kind: mapCompletionItemKind(item.kind),
      insertText: item.insertText || item.label,
      detail: item.detail || "",
      documentation: item.documentation?.value || item.documentation || "",
      sortText: item.sortText || String(index).padStart(5, "0"),
      filterText: item.filterText || item.label,
      range,
    }));

    return {
      suggestions,
      incomplete: result.isIncomplete || false,
    };
  } catch (e) {
    console.warn("[LSP] Completion request failed:", e);
    return undefined;
  }
};

const mapCompletionItemKind = (kind: number): monaco.languages.CompletionItemKind => {
  const map: Record<number, monaco.languages.CompletionItemKind> = {
    1: monaco.languages.CompletionItemKind.Text,
    2: monaco.languages.CompletionItemKind.Method,
    3: monaco.languages.CompletionItemKind.Function,
    4: monaco.languages.CompletionItemKind.Constructor,
    5: monaco.languages.CompletionItemKind.Field,
    6: monaco.languages.CompletionItemKind.Variable,
    7: monaco.languages.CompletionItemKind.Class,
    8: monaco.languages.CompletionItemKind.Interface,
    9: monaco.languages.CompletionItemKind.Module,
    10: monaco.languages.CompletionItemKind.Property,
    11: monaco.languages.CompletionItemKind.Unit,
    12: monaco.languages.CompletionItemKind.Value,
    13: monaco.languages.CompletionItemKind.Enum,
    14: monaco.languages.CompletionItemKind.Keyword,
    15: monaco.languages.CompletionItemKind.Snippet,
    16: monaco.languages.CompletionItemKind.Color,
    17: monaco.languages.CompletionItemKind.File,
    18: monaco.languages.CompletionItemKind.Reference,
    19: monaco.languages.CompletionItemKind.Folder,
    20: monaco.languages.CompletionItemKind.EnumMember,
    21: monaco.languages.CompletionItemKind.Constant,
    22: monaco.languages.CompletionItemKind.Struct,
    23: monaco.languages.CompletionItemKind.Event,
    24: monaco.languages.CompletionItemKind.Operator,
    25: monaco.languages.CompletionItemKind.TypeParameter,
  };
  return map[kind] || monaco.languages.CompletionItemKind.Text;
};

// ==================== 注册补全提供者 ====================
const registerKeywordProviders = () => {
  if (keywordProvidersRegistered) return;
  keywordProvidersRegistered = true;

  // Java: 关键词 + LSP补全
  monaco.languages.registerCompletionItemProvider("java", {
    triggerCharacters: [".", " ", "(", "@"],
    provideCompletionItems: async (textModel, position) => {
      // 先尝试LSP补全
      const lspResult = await requestCompletion(textModel, position);
      const word = textModel.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      // LSP有结果时优先使用LSP结果
      if (lspResult && lspResult.suggestions.length > 0) {
        // 补充关键词（LSP没返回的）
        const lspLabels = new Set(lspResult.suggestions.map(s => s.label));
        const keywordSuggestions = JAVA_KEYWORDS
          .filter(kw => !lspLabels.has(kw))
          .map(kw => ({
            label: kw,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: kw,
            range,
          }));
        return {
          suggestions: [...lspResult.suggestions, ...keywordSuggestions],
          incomplete: lspResult.incomplete,
        };
      }

      // LSP无结果时回退到关键词
      return {
        suggestions: JAVA_KEYWORDS.map(kw => ({
          label: kw,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: kw,
          range,
        })),
      };
    },
  });

  // C#: 关键词 + LSP补全
  monaco.languages.registerCompletionItemProvider("csharp", {
    triggerCharacters: [".", " ", "("],
    provideCompletionItems: async (textModel, position) => {
      const lspResult = await requestCompletion(textModel, position);
      const word = textModel.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      if (lspResult && lspResult.suggestions.length > 0) {
        const lspLabels = new Set(lspResult.suggestions.map(s => s.label));
        const keywordSuggestions = CSHARP_KEYWORDS
          .filter(kw => !lspLabels.has(kw))
          .map(kw => ({
            label: kw,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: kw,
            range,
          }));
        return {
          suggestions: [...lspResult.suggestions, ...keywordSuggestions],
          incomplete: lspResult.incomplete,
        };
      }

      return {
        suggestions: CSHARP_KEYWORDS.map(kw => ({
          label: kw,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: kw,
          range,
        })),
      };
    },
  });

  // C++: 关键词 + LSP补全
  monaco.languages.registerCompletionItemProvider("cpp", {
    triggerCharacters: [".", " ", ":", ">", "("],
    provideCompletionItems: async (textModel, position) => {
      const lspResult = await requestCompletion(textModel, position);
      const word = textModel.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      if (lspResult && lspResult.suggestions.length > 0) {
        const lspLabels = new Set(lspResult.suggestions.map(s => s.label));
        const keywordSuggestions = CPP_KEYWORDS
          .filter(kw => !lspLabels.has(kw))
          .map(kw => ({
            label: kw,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: kw,
            range,
          }));
        return {
          suggestions: [...lspResult.suggestions, ...keywordSuggestions],
          incomplete: lspResult.incomplete,
        };
      }

      return {
        suggestions: CPP_KEYWORDS.map(kw => ({
          label: kw,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: kw,
          range,
        })),
      };
    },
  });
};

// ==================== 初始化编辑器 ====================
const initEditor = async () => {
  await nextTick();
  if (!editorContainer.value) return;

  if (editorInstance.value) {
    toRaw(editorInstance.value).dispose();
    editorInstance.value = undefined;
  }

  registerKeywordProviders();

  const editor = monaco.editor.create(editorContainer.value, {
    value: model.value || "",
    language: currentLang.value,
    theme: currentTheme.value,
    readOnly: props.readOnly,
    fontSize: props.fontSize,
    minimap: { enabled: props.minimap },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: "on",
    tabSize: 4,
    insertSpaces: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: "on",
    quickSuggestions: true,
    parameterHints: { enabled: true },
    folding: true,
    foldingStrategy: "indentation",
    showFoldingControls: "mouseover",
    bracketPairColorization: { enabled: true },
    guides: { bracketPairs: true, indentation: true },
    renderWhitespace: "selection",
    cursorBlinking: "smooth",
    smoothScrolling: true,
    mouseWheelZoom: true,
  });

  editorInstance.value = editor;
  lastInternalValue = model.value || "";

  // 监听内容变化
  editor.onDidChangeModelContent(() => {
    const newVal = toRaw(editor).getValue();
    lastInternalValue = newVal;
    model.value = newVal;
    emit("change", newVal);

    // 通知LSP文档变更
    if (lspWs && lspWs.readyState === WebSocket.OPEN && lspInitialized) {
      documentVersion++;
      sendLspNotification("textDocument/didChange", {
        textDocument: {
          uri: getDocumentUri(),
          version: documentVersion,
        },
        contentChanges: [{ text: newVal }],
      });
    }

    if (props.autoSaveDelay > 0) {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(() => {
        sendLspNotification("textDocument/didSave", {
          textDocument: { uri: getDocumentUri() },
        });
      }, props.autoSaveDelay);
    }
  });

  // 连接LSP
  if (props.lspServerUrl) {
    connectLsp(currentLang.value);
  }
};

// ==================== 切换语言 ====================
const switchLang = (lang: string) => {
  currentLang.value = lang;
  const editor = toRaw(editorInstance.value);
  if (editor) {
    const editorModel = editor.getModel();
    if (editorModel) {
      monaco.editor.setModelLanguage(editorModel, lang);
    }
  }
  if (props.lspServerUrl) {
    connectLsp(lang);
  }
};

// ==================== 切换主题 ====================
const switchTheme = (theme: string) => {
  currentTheme.value = theme;
  monaco.editor.setTheme(theme);
};

// ==================== 暴露方法 ====================
const setValue = (val: string) => {
  const editor = toRaw(editorInstance.value);
  if (editor && val !== editor.getValue()) {
    lastInternalValue = val;
    editor.setValue(val);
  }
};

const getValue = () => {
  const editor = toRaw(editorInstance.value);
  return editor?.getValue() || "";
};

const getEditor = () => {
  return toRaw(editorInstance.value);
};

defineExpose({
  editor: editorInstance,
  setValue,
  getValue,
  getEditor,
  connectLsp,
  disconnectLsp,
});

// ==================== 生命周期 ====================
onMounted(() => {
  initEditor();
});

onBeforeUnmount(() => {
  disconnectLsp();
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  const editor = toRaw(editorInstance.value);
  if (editor) {
    editor.dispose();
  }
});

watch(
  () => model.value,
  (newVal) => {
    if (lastInternalValue === newVal) return;
    const editor = toRaw(editorInstance.value);
    if (editor && newVal !== editor.getValue()) {
      lastInternalValue = newVal;
      editor.setValue(newVal || "");
    }
  }
);

// ==================== 关键词列表 ====================
const JAVA_KEYWORDS = [
  "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
  "class", "const", "continue", "default", "do", "double", "else", "enum",
  "extends", "final", "finally", "float", "for", "goto", "if", "implements",
  "import", "instanceof", "int", "interface", "long", "native", "new", "package",
  "private", "protected", "public", "return", "short", "static", "strictfp",
  "super", "switch", "synchronized", "this", "throw", "throws", "transient",
  "try", "void", "volatile", "while",
  "String", "Integer", "Long", "Double", "Float", "Boolean", "Object", "List",
  "Map", "Set", "ArrayList", "HashMap", "HashSet", "LinkedList", "TreeMap",
  "Optional", "Stream", "Collectors", "System", "Math", "Arrays", "Collections",
  "Override", "Deprecated", "SuppressWarnings", "FunctionalInterface",
  "Runnable", "Callable", "CompletableFuture", "Thread",
  "Exception", "RuntimeException", "NullPointerException", "IllegalArgumentException",
  "HttpServletRequest", "HttpServletResponse", "RestController", "GetMapping",
  "PostMapping", "PutMapping", "DeleteMapping", "Autowired", "Service", "Component",
  "Repository", "Configuration", "Bean", "Value", "RequestParam", "PathVariable",
  "RequestBody", "ResponseBody", "Entity", "Table", "Column", "Id", "Mapper",
];

const CSHARP_KEYWORDS = [
  "abstract", "as", "base", "bool", "break", "byte", "case", "catch", "char",
  "checked", "class", "const", "continue", "decimal", "default", "delegate",
  "do", "double", "else", "enum", "event", "explicit", "extern", "false",
  "finally", "fixed", "float", "for", "foreach", "goto", "if", "implicit",
  "in", "int", "interface", "internal", "is", "lock", "long", "namespace",
  "new", "null", "object", "operator", "out", "override", "params", "private",
  "protected", "public", "readonly", "ref", "return", "sbyte", "sealed",
  "short", "sizeof", "stackalloc", "static", "string", "struct", "switch",
  "this", "throw", "true", "try", "typeof", "uint", "ulong", "unchecked",
  "unsafe", "ushort", "using", "virtual", "void", "volatile", "while",
  "Console", "String", "Integer", "Boolean", "List", "Dictionary", "HashSet",
  "Task", "Thread", "HttpClient", "DateTime", "Guid", "StringBuilder",
  "IEnumerable", "IQueryable", "ActionResult", "Controller", "ApiController",
  "HttpGet", "HttpPost", "Route", "FromBody", "Authorize", "AllowAnonymous",
  "DbContext", "DbSet", "Table", "Column", "Key", "Required", "MaxLength",
  "IConfiguration", "ILogger", "IServiceCollection", "IHostBuilder",
  "var", "dynamic", "async", "await", "yield", "record", "init", "with",
  "notnull", "unmanaged", "nint", "nuint", "required", "file", "scoped",
];

const CPP_KEYWORDS = [
  "alignas", "alignof", "and", "and_eq", "asm", "auto", "bitand", "bitor",
  "bool", "break", "case", "catch", "char", "char8_t", "char16_t", "char32_t",
  "class", "compl", "concept", "const", "consteval", "constexpr", "constinit",
  "const_cast", "continue", "co_await", "co_return", "co_yield", "decltype",
  "default", "delete", "do", "double", "dynamic_cast", "else", "enum",
  "explicit", "export", "extern", "false", "float", "for", "friend", "goto",
  "if", "inline", "int", "long", "mutable", "namespace", "new", "noexcept",
  "not", "not_eq", "nullptr", "operator", "or", "or_eq", "private",
  "protected", "public", "register", "reinterpret_cast", "requires", "return",
  "short", "signed", "sizeof", "static", "static_assert", "static_cast",
  "struct", "switch", "template", "this", "thread_local", "throw", "true",
  "try", "typedef", "typeid", "typename", "union", "unsigned", "using",
  "virtual", "void", "volatile", "wchar_t", "while", "xor", "xor_eq",
  "std", "cout", "cin", "endl", "string", "vector", "map", "set", "unordered_map",
  "unordered_set", "list", "deque", "queue", "stack", "pair", "tuple",
  "shared_ptr", "unique_ptr", "weak_ptr", "make_shared", "make_unique",
  "algorithm", "sort", "find", "begin", "end", "size", "empty", "push_back",
  "emplace_back", "front", "back", "iterator", "const_iterator",
  "iostream", "fstream", "sstream", "memory", "functional", "thread",
  "mutex", "lock_guard", "unique_lock", "condition_variable", "future",
  "promise", "async", "chrono", "ratio",
];
</script>

<template>
  <div class="sh-code-editor flex flex-col h-full">
    <!-- 工具栏 -->
    <div class="sh-code-editor-toolbar flex items-center h-[36px] px-2 border-b border-[var(--sh-border,#333)]">
      <el-menu
        mode="horizontal"
        :ellipsis="false"
        v-if="btnList?.length > 0"
        style="height: 100%; flex: 1"
      >
        <template v-for="(item, index) in btnList">
          <template v-if="item.children?.length > 0">
            <el-sub-menu :index="'1_' + index">
              <template #title>
                <el-tooltip :content="item.label" effect="dark" placement="bottom">
                  <star-horse-icon :icon-class="item.icon" size="24px" style="color: var(--star-horse-style)" />
                </el-tooltip>
              </template>
              <el-menu-item
                v-for="(sitem, sindex) in item.children"
                :disabled="sitem.disabled?.value === true"
                :index="'2_' + sindex"
                @click="sitem.actions"
              >
                <star-horse-icon :icon-class="sitem.icon" size="24px" style="color: var(--star-horse-style)" />
                {{ sitem.label }}
              </el-menu-item>
            </el-sub-menu>
          </template>
          <el-menu-item v-else :disabled="item.disabled?.value === true" :index="'1_' + index" @click="item.actions">
            <el-tooltip :content="item.label" effect="dark" placement="bottom">
              <star-horse-icon :icon-class="item.icon" size="24px" style="color: var(--star-horse-style)" />
            </el-tooltip>
          </el-menu-item>
        </template>
      </el-menu>

      <div class="flex items-center gap-3 ml-auto">
        <!-- LSP状态指示 -->
        <el-tooltip v-if="lspServerUrl" :content="lspConnected ? 'LSP已连接' : 'LSP未连接'" effect="dark">
          <span class="lsp-status" :class="{ connected: lspConnected, disconnected: !lspConnected }" />
        </el-tooltip>
        <!-- 主题切换 -->
        <el-dropdown>
          <span class="cursor-pointer text-xs opacity-70 hover:opacity-100">
            {{ i18n("item.theme") }} ▼
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="t in themes" :key="t.value" @click="switchTheme(t.value)">
                {{ t.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- 语言切换 -->
        <el-dropdown>
          <span class="cursor-pointer text-xs opacity-70 hover:opacity-100">
            {{ languages.find(l => l.value === currentLang)?.name || currentLang }} ▼
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="l in languages" :key="l.value" @click="switchLang(l.value)">
                {{ l.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 编辑器容器 -->
    <div ref="editorContainer" class="flex-1 min-h-0" :style="{ height: boxHeight }" />
  </div>
</template>

<style lang="scss" scoped>
.sh-code-editor {
  border: 1px solid var(--sh-border, #333);
  border-radius: 4px;
  overflow: hidden;
  background: var(--sh-bg, #1e1e1e);

  .sh-code-editor-toolbar {
    background: var(--sh-toolbar-bg, #252526);
    border-bottom: 1px solid var(--sh-border, #333);
    user-select: none;
  }

  .lsp-status {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 4px;

    &.connected {
      background: #52c41a;
      box-shadow: 0 0 4px #52c41a;
    }

    &.disconnected {
      background: #ff4d4f;
    }
  }
}
</style>
