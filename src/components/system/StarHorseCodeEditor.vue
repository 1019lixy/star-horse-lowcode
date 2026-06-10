<script setup lang="ts" name="StarHorseCodeEditor">
import { nextTick, onMounted, onBeforeUnmount, PropType, ref, shallowRef, watch, toRaw, computed } from "vue";
import * as monaco from "monaco-editor";
import type { FileNode, TabInfo, MenuItemDef } from "./code-editor/types";
import { detectLanguage } from "./code-editor/constants";
import { applyThemeVars } from "./code-editor/theme";
import { useLsp } from "./code-editor/useLsp";
import { useFileTree } from "./code-editor/useFileTree";
import { useFileApi } from "./code-editor/useFileApi";
import MenuBar from "./code-editor/MenuBar.vue";
import ActivityBar from "./code-editor/ActivityBar.vue";
import TabBar from "./code-editor/TabBar.vue";
import StatusBar from "./code-editor/StatusBar.vue";
import FileTreeNode from "./code-editor/FileTreeNode.vue";
import ContextMenu from "./code-editor/ContextMenu.vue";
import type { ContextMenuItem } from "./code-editor/ContextMenu.vue";

// ==================== Props & Emits ====================
const props = defineProps({
  files: { type: Array as PropType<FileNode[]>, default: () => [] },
  menuItems: { type: Array as PropType<MenuItemDef[]>, default: () => [] },
  theme: { type: String, default: "vs-dark" },
  readOnly: { type: Boolean, default: false },
  lspServerUrl: { type: String, default: "" },
  loadUrl: { type: String, default: "" },
  saveUrl: { type: String, default: "" },
  /** 模块ID，传入后自动从服务器加载该模块的代码 */
  moduleId: { type: String, default: "" },
  /** 加载时的附加参数，如 { moduleId: "xxx", version: "1.0" } */
  loadParams: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
  /** 保存时的附加参数，保存body = { files: tree, ...saveParams } */
  saveParams: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
  fontSize: { type: Number, default: 14 },
  minimap: { type: Boolean, default: true },
  showActivityBar: { type: Boolean, default: true },
  showExplorer: { type: Boolean, default: true },
  showStatusBar: { type: Boolean, default: true },
  boxHeight: { type: String, default: "100%" },
});
const emit = defineEmits([
  "file-open", "file-save", "file-close", "file-create", "file-delete",
  "file-rename", "folder-create", "menu-action", "change",
  "lspConnected", "lspDisconnected", "tree-change",
  "load-complete", "save-complete", "drop",
]);

// ==================== IDE State ====================
const ideRoot = ref<HTMLElement>();
const editorContainer = ref<HTMLElement>();
const editorInstance = shallowRef<monaco.editor.IStandaloneCodeEditor>();
const openTabs = ref<TabInfo[]>([]);
const activeTabId = ref("");
const sidebarVisible = ref(true);
const activePanel = ref("explorer");
const currentTheme = ref(props.theme);
const cursorLine = ref(1);
const cursorCol = ref(1);
const expandedFolders = ref<Set<string>>(new Set());
const sidebarWidth = ref(220);
const monacoModels = new Map<string, monaco.editor.ITextModel>();
const fileInputRef = ref<HTMLInputElement>();
const dirInputRef = ref<HTMLInputElement>();

// ==================== File Tree (内部管理) ====================
const fileTree = useFileTree(props.files);
const editingNodeId = ref<string | null>(null);

// ==================== File API (后端集成) ====================
const fileApi = useFileApi(props.loadUrl, props.saveUrl);

// ==================== Drag & Drop ====================
const draggingId = ref<string | null>(null);
const dropTargetId = ref<string | null>(null);

// ==================== Context Menu ====================
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuItems = ref<ContextMenuItem[]>([]);
const contextMenuTargetId = ref<string | null>(null);

// ==================== Computed ====================
const activeTab = computed(() => openTabs.value.find(t => t.id === activeTabId.value));
const activeFile = computed(() => fileTree.findNode(activeTabId.value));
const currentLang = computed(() => activeTab.value?.language || "plaintext");

// ==================== LSP ====================
const lspServerUrlRef = computed(() => props.lspServerUrl);
const getDocumentUri = () => {
  const name = activeTab.value?.name || "untitled.txt";
  return `file:///workspace/${name}`;
};
const lsp = useLsp(lspServerUrlRef, editorInstance, currentLang, getDocumentUri);

// ==================== 标签页管理 ====================
const openFile = (file: FileNode) => {
  if (file.type === "folder") {
    toggleFolder(file.id);
    return;
  }
  if (!openTabs.value.find(t => t.id === file.id)) {
    openTabs.value.push({
      id: file.id,
      name: file.name,
      language: file.language || detectLanguage(file.name),
      modified: false,
    });
  }
  activeTabId.value = file.id;
  emit("file-open", file);
};

const closeTab = (tabId: string) => {
  const idx = openTabs.value.findIndex(t => t.id === tabId);
  if (idx === -1) return;
  openTabs.value.splice(idx, 1);
  const model = monacoModels.get(tabId);
  if (model) { model.dispose(); monacoModels.delete(tabId); }
  emit("file-close", { id: tabId });
  if (activeTabId.value === tabId) {
    activeTabId.value = openTabs.value.length > 0
      ? openTabs.value[Math.min(idx, openTabs.value.length - 1)].id
      : "";
  }
};

const switchTab = (tabId: string) => { activeTabId.value = tabId; };

const toggleFolder = (id: string) => {
  const s = new Set(expandedFolders.value);
  s.has(id) ? s.delete(id) : s.add(id);
  expandedFolders.value = s;
};

// ==================== Monaco 模型管理 ====================
const getOrCreateModel = (file: FileNode): monaco.editor.ITextModel => {
  let model = monacoModels.get(file.id);
  if (!model) {
    const lang = file.language || detectLanguage(file.name);
    model = monaco.editor.createModel(file.content || "", lang);
    monacoModels.set(file.id, model);
  }
  return model;
};

const syncActiveFile = async () => {
  const editor = toRaw(editorInstance.value);
  if (!editor) return;
  const file = activeFile.value;
  if (file) {
    const model = getOrCreateModel(file);
    editor.setModel(model);
    lsp.notifyDidOpen();
  } else {
    const emptyModel = monaco.editor.createModel("", "plaintext");
    editor.setModel(emptyModel);
  }
};

// ==================== 文件树 CRUD ====================
const handleNewFile = (parentId: string | null = null) => {
  if (parentId) {
    const s = new Set(expandedFolders.value);
    s.add(parentId);
    expandedFolders.value = s;
  }
  const id = fileTree.createFile(parentId);
  editingNodeId.value = id;
};

const handleNewFolder = (parentId: string | null = null) => {
  if (parentId) {
    const s = new Set(expandedFolders.value);
    s.add(parentId);
    expandedFolders.value = s;
  }
  const id = fileTree.createFolder(parentId);
  editingNodeId.value = id;
};

const handleRename = (nodeId: string) => {
  editingNodeId.value = nodeId;
};

const handleDelete = (nodeId: string) => {
  const node = fileTree.findNode(nodeId);
  if (!node) return;
  const msg = node.type === "folder"
    ? `确定删除文件夹 "${node.name}" 及其所有内容？`
    : `确定删除文件 "${node.name}"？`;
  if (!confirm(msg)) return;
  // 关闭受影响的标签页
  const affected = new Set<string>();
  const collectIds = (n: FileNode) => {
    affected.add(n.id);
    n.children?.forEach(collectIds);
  };
  collectIds(node);
  openTabs.value.filter(t => affected.has(t.id)).forEach(t => closeTab(t.id));
  fileTree.deleteNode(nodeId);
  emit("file-delete", { id: nodeId });
  emit("tree-change", fileTree.tree.value);
};

const handleEditConfirm = (id: string, newName: string) => {
  if (!newName.trim()) {
    editingNodeId.value = null;
    fileTree.cancelCreate(id);
    return;
  }
  const node = fileTree.findNode(id);
  if (!node) { editingNodeId.value = null; return; }
  const isPending = node.name === "untitled.txt" || node.name === "新建文件夹"
    || node.name.startsWith("untitled-") || node.name.startsWith("新建文件夹-");
  if (isPending) {
    fileTree.confirmCreate(id, newName);
    if (node.type === "file") {
      openFile(node);
      emit("file-create", { id, name: newName });
    } else {
      emit("folder-create", { id, name: newName });
    }
  } else {
    fileTree.renameNode(id, newName);
    // 更新标签页名称
    const tab = openTabs.value.find(t => t.id === id);
    if (tab) { tab.name = newName; tab.language = node.language || detectLanguage(newName); }
    // 更新 Monaco 模型语言
    const model = monacoModels.get(id);
    if (model && node.language) monaco.editor.setModelLanguage(model, node.language);
    emit("file-rename", { id, name: newName });
  }
  editingNodeId.value = null;
  emit("tree-change", fileTree.tree.value);
};

const handleEditCancel = (id: string) => {
  editingNodeId.value = null;
  const node = fileTree.findNode(id);
  const isPending = node && (node.name === "untitled.txt" || node.name === "新建文件夹"
    || node.name.startsWith("untitled-") || node.name.startsWith("新建文件夹-"));
  if (isPending) fileTree.cancelCreate(id);
};

// ==================== 右键菜单 ====================
const handleTreeContextMenu = (node: FileNode, e: MouseEvent) => {
  contextMenuTargetId.value = node.id;
  contextMenuPosition.value = { x: e.clientX, y: e.clientY };
  if (node.type === "folder") {
    contextMenuItems.value = [
      { label: "新建文件", action: "ctx-new-file" },
      { label: "新建文件夹", action: "ctx-new-folder" },
      { divider: true, label: "" },
      { label: "重命名", action: "ctx-rename" },
      { divider: true, label: "" },
      { label: "删除", action: "ctx-delete", danger: true },
    ];
  } else {
    contextMenuItems.value = [
      { label: "打开", action: "ctx-open" },
      { divider: true, label: "" },
      { label: "新建文件", action: "ctx-new-file-sibling" },
      { label: "新建文件夹", action: "ctx-new-folder-sibling" },
      { divider: true, label: "" },
      { label: "重命名", action: "ctx-rename" },
      { divider: true, label: "" },
      { label: "删除", action: "ctx-delete", danger: true },
    ];
  }
  contextMenuVisible.value = true;
};

const handleSidebarContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  contextMenuTargetId.value = null;
  contextMenuPosition.value = { x: e.clientX, y: e.clientY };
  contextMenuItems.value = [
    { label: "新建文件", action: "ctx-new-file" },
    { label: "新建文件夹", action: "ctx-new-folder" },
  ];
  contextMenuVisible.value = true;
};

const handleContextMenuAction = (action: string) => {
  const targetId = contextMenuTargetId.value;
  const targetNode = targetId ? fileTree.findNode(targetId) : null;
  const siblingParentId = targetId ? fileTree.findParent(targetId)?.id || null : null;

  switch (action) {
    case "ctx-new-file": handleNewFile(targetNode?.type === "folder" ? targetId : null); break;
    case "ctx-new-folder": handleNewFolder(targetNode?.type === "folder" ? targetId : null); break;
    case "ctx-new-file-sibling": handleNewFile(siblingParentId); break;
    case "ctx-new-folder-sibling": handleNewFolder(siblingParentId); break;
    case "ctx-rename": if (targetId) handleRename(targetId); break;
    case "ctx-delete": if (targetId) handleDelete(targetId); break;
    case "ctx-open": if (targetNode) openFile(targetNode); break;
  }
  contextMenuVisible.value = false;
};

// ==================== 菜单定义（中文） ====================
const defaultMenus: MenuItemDef[] = [
  {
    label: "文件",
    children: [
      { label: "新建文件", action: "new-file", shortcut: "Ctrl+N" },
      { label: "新建文件夹", action: "new-folder" },
      { divider: true, label: "" },
      { label: "打开文件...", action: "open-file", shortcut: "Ctrl+O" },
      { label: "打开目录...", action: "open-directory" },
      { label: "从服务器加载", action: "load-server" },
      { divider: true, label: "" },
      { label: "保存", action: "save", shortcut: "Ctrl+S" },
      { label: "全部保存", action: "save-all", shortcut: "Ctrl+Shift+S" },
      { label: "保存到服务器", action: "save-server" },
      { divider: true, label: "" },
      { label: "关闭标签", action: "close-tab", shortcut: "Ctrl+W" },
      { label: "关闭全部", action: "close-all" },
    ],
  },
  {
    label: "编辑",
    children: [
      { label: "撤销", action: "undo", shortcut: "Ctrl+Z" },
      { label: "重做", action: "redo", shortcut: "Ctrl+Shift+Z" },
      { divider: true, label: "" },
      { label: "剪切", action: "cut", shortcut: "Ctrl+X" },
      { label: "复制", action: "copy", shortcut: "Ctrl+C" },
      { label: "粘贴", action: "paste", shortcut: "Ctrl+V" },
      { divider: true, label: "" },
      { label: "查找", action: "find", shortcut: "Ctrl+F" },
      { label: "替换", action: "replace", shortcut: "Ctrl+H" },
      { divider: true, label: "" },
      { label: "全选", action: "select-all", shortcut: "Ctrl+A" },
    ],
  },
  {
    label: "视图",
    children: [
      { label: "切换侧边栏", action: "toggle-sidebar", shortcut: "Ctrl+B" },
      { label: "切换小地图", action: "toggle-minimap" },
      { divider: true, label: "" },
      { label: "放大", action: "zoom-in", shortcut: "Ctrl+=" },
      { label: "缩小", action: "zoom-out", shortcut: "Ctrl+-" },
      { label: "重置缩放", action: "zoom-reset", shortcut: "Ctrl+0" },
    ],
  },
];

const mergedMenus = computed(() => {
  if (props.menuItems.length > 0) return [...defaultMenus, ...props.menuItems];
  return defaultMenus;
});

// ==================== 菜单动作处理 ====================
const handleMenuAction = (item: MenuItemDef) => {
  if (!item.action) return;
  const editor = toRaw(editorInstance.value);
  switch (item.action) {
    case "new-file": handleNewFile(null); break;
    case "new-folder": handleNewFolder(null); break;
    case "open-file": fileInputRef.value?.click(); break;
    case "open-directory": dirInputRef.value?.click(); break;
    case "load-server": loadFromServer(); break;
    case "save":
      if (activeTabId.value) {
        const content = editor?.getValue() || "";
        fileTree.updateFileContent(activeTabId.value, content);
        const tab = openTabs.value.find(t => t.id === activeTabId.value);
        if (tab) tab.modified = false;
        emit("file-save", { id: activeTabId.value, content });
      }
      break;
    case "save-all":
      openTabs.value.forEach(t => {
        const model = monacoModels.get(t.id);
        if (model) {
          const content = model.getValue();
          fileTree.updateFileContent(t.id, content);
          t.modified = false;
          emit("file-save", { id: t.id, content });
        }
      });
      break;
    case "save-server":
      saveToServer();
      break;
    case "close-tab": if (activeTabId.value) closeTab(activeTabId.value); break;
    case "close-all": [...openTabs.value].forEach(t => closeTab(t.id)); break;
    case "undo": editor?.trigger("menu", "undo", null); break;
    case "redo": editor?.trigger("menu", "redo", null); break;
    case "cut": editor?.trigger("menu", "editor.action.clipboardCutAction", null); break;
    case "copy": editor?.trigger("menu", "editor.action.clipboardCopyAction", null); break;
    case "paste": editor?.trigger("menu", "editor.action.clipboardPasteAction", null); break;
    case "find": editor?.trigger("menu", "actions.find", null); break;
    case "replace": editor?.trigger("menu", "editor.action.startFindReplaceAction", null); break;
    case "select-all": editor?.trigger("menu", "editor.action.selectAll", null); break;
    case "toggle-sidebar": sidebarVisible.value = !sidebarVisible.value; break;
    case "toggle-minimap": {
      const cur = editor?.getOption(monaco.editor.EditorOption.minimap);
      editor?.updateOptions({ minimap: { enabled: !cur?.enabled } });
      break;
    }
    case "zoom-in": {
      const s = editor?.getOption(monaco.editor.EditorOption.fontSize) || 14;
      editor?.updateOptions({ fontSize: s + 1 });
      break;
    }
    case "zoom-out": {
      const s = editor?.getOption(monaco.editor.EditorOption.fontSize) || 14;
      editor?.updateOptions({ fontSize: Math.max(8, s - 1) });
      break;
    }
    case "zoom-reset": editor?.updateOptions({ fontSize: props.fontSize }); break;
    default: emit("menu-action", item.action);
  }
};

// ==================== 文件输入处理 ====================
const handleFileInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;
  Array.from(input.files).forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = () => {
      const id = fileTree.createFile(null, file.name);
      fileTree.updateFileContent(id, reader.result as string);
      const node = fileTree.findNode(id);
      if (node) openFile(node);
    };
    reader.readAsText(file);
  });
  input.value = "";
};

const handleDirInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;
  const fileList = Array.from(input.files);
  const root: Record<string, any> = {};
  fileList.forEach(file => {
    const path = (file as any).webkitRelativePath || file.name;
    const parts = path.split("/");
    let current = root;
    parts.forEach((part: string, i: number) => {
      if (!current[part]) current[part] = i === parts.length - 1 ? { __file: file } : {};
      current = current[part];
    });
  });
  const buildTree = (obj: Record<string, any>, parentId: string | null): void => {
    for (const [name, value] of Object.entries(obj)) {
      if (value.__file) {
        const file = value.__file as File;
        const id = fileTree.createFile(parentId, name);
        const reader = new FileReader();
        reader.onload = () => fileTree.updateFileContent(id, reader.result as string);
        reader.readAsText(file);
      } else {
        const id = fileTree.createFolder(parentId, name);
        buildTree(value, id);
      }
    }
  };
  buildTree(root, null);
  emit("tree-change", fileTree.tree.value);
  input.value = "";
};

// ==================== 键盘快捷键 ====================
const handleKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey) {
    const key = e.key.toLowerCase();
    if (key === "s") { e.preventDefault(); handleMenuAction({ label: "", action: "save" }); }
    else if (key === "b") { e.preventDefault(); sidebarVisible.value = !sidebarVisible.value; }
    else if (key === "w") { e.preventDefault(); if (activeTabId.value) closeTab(activeTabId.value); }
    else if (key === "o") { e.preventDefault(); fileInputRef.value?.click(); }
    else if (key === "n") { e.preventDefault(); handleNewFile(null); }
  }
};

// ==================== 侧边栏拖拽调整宽度 ====================
let isResizing = false;
const onResizeStart = (e: MouseEvent) => {
  isResizing = true;
  const startX = e.clientX;
  const startW = sidebarWidth.value;
  const onMove = (ev: MouseEvent) => {
    if (!isResizing) return;
    sidebarWidth.value = Math.max(120, Math.min(500, startW + ev.clientX - startX));
  };
  const onUp = () => {
    isResizing = false;
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
  };
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
};

// ==================== 活动栏面板切换 ====================
const handleTogglePanel = (panel: string) => {
  if (activePanel.value === panel && sidebarVisible.value) {
    sidebarVisible.value = false;
  } else {
    activePanel.value = panel;
    sidebarVisible.value = true;
  }
};

// ==================== 主题切换（全局） ====================
const switchTheme = (themeValue: string) => {
  currentTheme.value = themeValue;
  monaco.editor.setTheme(themeValue);
  if (ideRoot.value) applyThemeVars(ideRoot.value, themeValue);
};

// ==================== 拖拽处理 ====================
const handleDragStart = (id: string) => {
  draggingId.value = id;
};

const handleDragEnd = () => {
  draggingId.value = null;
  dropTargetId.value = null;
};

const handleDrop = (sourceId: string, targetFolderId: string) => {
  const moved = fileTree.moveNode(sourceId, targetFolderId);
  if (moved) {
    // 自动展开目标文件夹
    const s = new Set(expandedFolders.value);
    s.add(targetFolderId);
    expandedFolders.value = s;
    emit("drop", { sourceId, targetFolderId });
    emit("tree-change", fileTree.tree.value);
  }
  draggingId.value = null;
  dropTargetId.value = null;
};

// ==================== 从后端加载 ====================
const loadFromServer = async (params?: Record<string, any>) => {
  // 合并参数: moduleId + loadParams + 手动传入的 params
  const mergedParams: Record<string, any> = { ...props.loadParams, ...params };
  if (props.moduleId) mergedParams.moduleId = props.moduleId;
  const nodes = await fileApi.loadFromServer(
    Object.keys(mergedParams).length > 0 ? mergedParams : undefined,
  );
  if (nodes.length > 0) {
    fileTree.replaceTree(nodes);
    [...openTabs.value].forEach(t => closeTab(t.id));
    const first = fileTree.findFirstFile();
    if (first) openFile(first);
    emit("load-complete", nodes);
    emit("tree-change", fileTree.tree.value);
  }
};

/** 加载指定模块的代码（便捷方法） */
const loadModule = async (moduleId: string) => {
  const params: Record<string, any> = { ...props.loadParams, moduleId };
  const nodes = await fileApi.loadFromServer(params);
  if (nodes.length > 0) {
    fileTree.replaceTree(nodes);
    [...openTabs.value].forEach(t => closeTab(t.id));
    const first = fileTree.findFirstFile();
    if (first) openFile(first);
    emit("load-complete", nodes);
    emit("tree-change", fileTree.tree.value);
  }
};

// ==================== 保存到后端 ====================
const saveToServer = async () => {
  openTabs.value.forEach(t => {
    const model = monacoModels.get(t.id);
    if (model) {
      fileTree.updateFileContent(t.id, model.getValue());
      t.modified = false;
    }
  });
  const mergedParams: Record<string, any> = { ...props.saveParams };
  if (props.moduleId) mergedParams.moduleId = props.moduleId;
  const ok = await fileApi.saveToServer(
    fileTree.tree.value,
    Object.keys(mergedParams).length > 0 ? mergedParams : undefined,
  );
  if (ok) {
    emit("save-complete", fileTree.tree.value);
  }
  return ok;
};

// ==================== 排序 ====================
const sortedTree = computed(() => {
  const sortNodes = (nodes: FileNode[]): FileNode[] =>
    [...nodes].sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  return sortNodes(fileTree.tree.value);
});

// ==================== 初始化编辑器 ====================
const initEditor = async () => {
  await nextTick();
  if (!editorContainer.value) return;
  if (editorInstance.value) {
    toRaw(editorInstance.value).dispose();
    editorInstance.value = undefined;
  }
  lsp.registerProviders();
  const editor = monaco.editor.create(editorContainer.value, {
    value: "",
    language: "plaintext",
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

  editor.onDidChangeCursorPosition((e) => {
    cursorLine.value = e.position.lineNumber;
    cursorCol.value = e.position.column;
  });

  editor.onDidChangeModelContent(() => {
    const tab = openTabs.value.find(t => t.id === activeTabId.value);
    if (tab) tab.modified = true;
    emit("change", editor.getValue());
    lsp.notifyDidChange();
  });

  // 打开初始文件
  const first = fileTree.findFirstFile();
  if (first) openFile(first);
  if (props.lspServerUrl) lsp.connectLsp(currentLang.value);
};

// ==================== Watchers ====================
watch(activeTabId, () => { nextTick(() => syncActiveFile()); });

watch(() => props.files, (val) => {
  if (val.length > 0 && fileTree.tree.value.length === 0) {
    fileTree.addNodes(JSON.parse(JSON.stringify(val)));
    nextTick(() => {
      const first = fileTree.findFirstFile();
      if (first) openFile(first);
    });
  }
}, { deep: true });

// moduleId 变化时自动重新加载
watch(() => props.moduleId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadModule(newId);
  }
});

// ==================== Expose ====================
const getValue = () => toRaw(editorInstance.value)?.getValue() || "";
const setValue = (v: string) => { const e = toRaw(editorInstance.value); if (e) e.setValue(v); };
const getEditor = () => toRaw(editorInstance.value);
defineExpose({
  editor: editorInstance,
  fileTree,
  fileApi,
  openFile,
  closeFile: (id: string) => closeTab(id),
  getValue,
  setValue,
  getEditor,
  connectLsp: lsp.connectLsp,
  disconnectLsp: lsp.disconnectLsp,
  createFile: (parentId?: string) => handleNewFile(parentId || null),
  createFolder: (parentId?: string) => handleNewFolder(parentId || null),
  deleteFile: (id: string) => handleDelete(id),
  renameFile: (id: string) => handleRename(id),
  loadFromServer,
  loadModule,
  saveToServer,
});

// ==================== 生命周期 ====================
onMounted(() => {
  initEditor();
  document.addEventListener("keydown", handleKeydown);
  if (ideRoot.value) applyThemeVars(ideRoot.value, currentTheme.value);
  // 如果配置了loadUrl，自动从后端加载
  if (props.loadUrl) {
    loadFromServer();
  }
});

onBeforeUnmount(() => {
  lsp.disconnectLsp();
  document.removeEventListener("keydown", handleKeydown);
  monacoModels.forEach(m => m.dispose());
  monacoModels.clear();
  toRaw(editorInstance.value)?.dispose();
});
</script>

<template>
  <div ref="ideRoot" class="sh-ide" :style="{ height: boxHeight }">
    <!-- 隐藏的文件输入框 -->
    <input ref="fileInputRef" type="file" multiple style="display:none" @change="handleFileInput" />
    <input ref="dirInputRef" type="file" webkitdirectory style="display:none" @change="handleDirInput" />

    <!-- 右键菜单 -->
    <ContextMenu
      v-if="contextMenuVisible"
      :items="contextMenuItems"
      :position="contextMenuPosition"
      @action="handleContextMenuAction"
      @close="contextMenuVisible = false"
    />

    <!-- 菜单栏 -->
    <MenuBar
      :menus="mergedMenus"
      :current-theme="currentTheme"
      @action="handleMenuAction"
      @switch-theme="switchTheme"
    />

    <!-- 主体区域 -->
    <div class="sh-ide-body">
      <!-- 活动栏 -->
      <ActivityBar
        v-if="showActivityBar"
        :active-panel="activePanel"
        :sidebar-visible="sidebarVisible"
        @toggle-panel="handleTogglePanel"
      />

      <!-- 侧边栏 / 资源管理器 -->
      <div
        v-if="sidebarVisible && showExplorer"
        class="sh-ide-sidebar"
        :style="{ width: sidebarWidth + 'px' }"
      >
        <div class="sidebar-header">
          <span class="sidebar-title">
            {{ activePanel === 'explorer' ? '资源管理器' : activePanel === 'search' ? '搜索' : '设置' }}
          </span>
          <template v-if="activePanel === 'explorer'">
            <button class="sidebar-btn" title="新建文件" @click="handleNewFile(null)">📄+</button>
            <button class="sidebar-btn" title="新建文件夹" @click="handleNewFolder(null)">📁+</button>
          </template>
        </div>
        <div class="sidebar-content" @contextmenu="handleSidebarContextMenu">
          <!-- 资源管理器面板 -->
          <template v-if="activePanel === 'explorer'">
            <template v-if="sortedTree.length > 0">
              <FileTreeNode
                v-for="node in sortedTree"
                :key="node.id"
                :node="node"
                :depth="0"
                :expanded="expandedFolders"
                :active-id="activeTabId"
                :editing-node-id="editingNodeId"
                :dragging-id="draggingId"
                :drop-target-id="dropTargetId"
                @toggle="toggleFolder"
                @select="openFile"
                @contextmenu="handleTreeContextMenu"
                @edit-confirm="handleEditConfirm"
                @edit-cancel="handleEditCancel"
                @drag-start="handleDragStart"
                @drag-end="handleDragEnd"
                @drop="handleDrop"
              />
            </template>
            <div v-else class="sidebar-empty">
              <p>暂无文件</p>
              <button class="sidebar-action-btn" @click="handleNewFile(null)">📄 新建文件</button>
              <button class="sidebar-action-btn" @click="handleNewFolder(null)">📁 新建文件夹</button>
              <p class="sidebar-hint">或通过菜单 "打开文件" / "打开目录"</p>
            </div>
          </template>
          <!-- 搜索面板 -->
          <template v-else-if="activePanel === 'search'">
            <div class="sidebar-empty">
              <p>搜索功能</p>
              <p class="sidebar-hint">在编辑器中使用 Ctrl+F 搜索内容</p>
            </div>
          </template>
          <!-- 设置面板 -->
          <template v-else>
            <div class="sidebar-empty">
              <p>编辑器设置</p>
              <p class="sidebar-hint">字体大小: {{ fontSize }}px</p>
            </div>
          </template>
        </div>
        <div class="sidebar-resize" @mousedown="onResizeStart" />
      </div>

      <!-- 编辑器区域 -->
      <div class="sh-ide-editor">
        <!-- 标签栏 -->
        <TabBar
          v-if="openTabs.length > 0"
          :tabs="openTabs"
          :active-id="activeTabId"
          @switch="switchTab"
          @close="closeTab"
        />
        <!-- 面包屑 -->
        <div v-if="activeTab" class="sh-ide-breadcrumb">
          <span>{{ activeTab.name }}</span>
          <span class="breadcrumb-lang">{{ activeTab.language }}</span>
        </div>
        <!-- Monaco 编辑器 -->
        <div ref="editorContainer" class="sh-ide-monaco" />
        <!-- 欢迎页 -->
        <div v-if="openTabs.length === 0" class="sh-ide-welcome">
          <div class="welcome-icon">⌨️</div>
          <h2>星马代码编辑器</h2>
          <p>右键资源管理器新建文件，或通过菜单打开</p>
          <div class="welcome-actions">
            <button class="welcome-btn" @click="handleNewFile(null)">📄 新建文件</button>
            <button class="welcome-btn" @click="handleNewFolder(null)">📁 新建文件夹</button>
            <button class="welcome-btn" @click="fileInputRef?.click()">📂 打开文件</button>
            <button class="welcome-btn" @click="dirInputRef?.click()">📁 打开目录</button>
          </div>
          <div class="welcome-shortcuts">
            <div><kbd>Ctrl+N</kbd> 新建文件</div>
            <div><kbd>Ctrl+O</kbd> 打开文件</div>
            <div><kbd>Ctrl+S</kbd> 保存</div>
            <div><kbd>Ctrl+B</kbd> 切换侧边栏</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 状态栏 -->
    <StatusBar
      v-if="showStatusBar"
      :cursor-line="cursorLine"
      :cursor-col="cursorCol"
      :language="currentLang"
      :lsp-connected="lsp.lspConnected.value"
      :show-lsp="!!lspServerUrl"
      :loading="fileApi.loading.value"
      :saving="fileApi.saving.value"
    />
  </div>
</template>

<style lang="scss" scoped>
.sh-ide {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ide-border, #3c3c3c);
  border-radius: 4px;
  overflow: hidden;
  background: var(--ide-bg, #1e1e1e);
  color: var(--ide-fg, #cccccc);
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 13px;
}
.sh-ide-body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.sh-ide-sidebar {
  position: relative;
  background: var(--ide-sidebar-bg, #252526);
  border-right: 1px solid var(--ide-border, #3c3c3c);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}
.sidebar-header {
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--ide-fg-dim, #858585);
  text-transform: uppercase;
  border-bottom: 1px solid var(--ide-border, #3c3c3c);
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.sidebar-title { flex: 1; }
.sidebar-btn {
  background: none;
  border: none;
  color: var(--ide-fg-dim, #858585);
  cursor: pointer;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
  line-height: 1;
  &:hover { background: var(--ide-bg-hover, #2a2d2e); color: var(--ide-fg, #ccc); }
}
.sidebar-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 0;
}
.sidebar-empty {
  padding: 16px;
  color: var(--ide-fg-dim, #858585);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  p { margin: 0; }
}
.sidebar-action-btn {
  background: var(--ide-bg-hover, #2a2d2e);
  border: 1px solid var(--ide-border, #3c3c3c);
  color: var(--ide-fg, #ccc);
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  width: 100%;
  max-width: 160px;
  &:hover { background: var(--ide-accent, #007acc); border-color: var(--ide-accent, #007acc); }
}
.sidebar-hint { font-size: 12px; font-style: italic; opacity: 0.7; }
.sidebar-resize {
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 4px;
  cursor: col-resize;
  z-index: 10;
  &:hover { background: var(--ide-accent, #007acc); }
}
.sh-ide-editor {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
.sh-ide-breadcrumb {
  padding: 2px 16px;
  font-size: 12px;
  color: var(--ide-fg-dim, #858585);
  background: var(--ide-bg, #1e1e1e);
  border-bottom: 1px solid var(--ide-border, #3c3c3c);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.breadcrumb-lang { font-size: 11px; opacity: 0.6; }
.sh-ide-monaco { flex: 1; min-height: 0; }
.sh-ide-welcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--ide-welcome-fg, #858585);
  text-align: center;
  gap: 8px;
}
.welcome-icon { font-size: 64px; margin-bottom: 8px; }
.sh-ide-welcome h2 { color: var(--ide-fg, #cccccc); font-weight: 400; margin: 0; }
.sh-ide-welcome p { margin: 0; }
.welcome-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin: 12px 0;
}
.welcome-btn {
  background: var(--ide-bg-hover, #2a2d2e);
  border: 1px solid var(--ide-border, #3c3c3c);
  color: var(--ide-fg, #ccc);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  &:hover { background: var(--ide-accent, #007acc); border-color: var(--ide-accent, #007acc); }
}
.welcome-shortcuts {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}
.welcome-shortcuts kbd {
  background: var(--ide-bg-tertiary, #2d2d2d);
  border: 1px solid var(--ide-border, #3c3c3c);
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 12px;
  margin-right: 8px;
}
</style>
