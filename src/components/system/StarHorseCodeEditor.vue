<script setup lang="ts" name="StarHorseCodeEditor">
import {computed, nextTick, onBeforeUnmount, onMounted, PropType, ref, shallowRef, toRaw, toRef, watch} from "vue";
import * as monaco from "monaco-editor";
import "@/components/system/code-editor/styles/editor.scss";
import type {FileNode, MenuItemDef, TabInfo} from "./code-editor/types";
import {
  COMPILABLE_LANGUAGES,
  DEFAULT_TEMPLATES,
  deriveClassName,
  deriveJavaPackage,
  detectLanguage,
  type IdeApiConfig,
  RUNNABLE_LANGUAGES
} from "./code-editor/constants";
import {applyThemeVars, getThemeByValue} from "./code-editor/theme";
import {useLsp} from "./code-editor/useLsp";
import {useFileTree} from "./code-editor/useFileTree";
import {useFileApi, type ConflictCheckResult, type ConflictFile, type SaveResult} from "./code-editor/useFileApi";
import {useConsole} from "./code-editor/useConsole";
import {useModuleDialog} from "./code-editor/useModuleDialog";
import {useIdeActions} from "./code-editor/useIdeActions";
import {useApiConfig} from "./code-editor/useApiConfig";
import {operationConfirm, success, warning} from "@/utils/message";
import {i18n} from "@/lang/index";
import MenuBar from "./code-editor/MenuBar.vue";
import ActivityBar from "./code-editor/ActivityBar.vue";
import TabBar from "./code-editor/TabBar.vue";
import StatusBar from "./code-editor/StatusBar.vue";
import FileTreeNode from "./code-editor/FileTreeNode.vue";
import type {ContextMenuItem} from "./code-editor/ContextMenu.vue";
import ContextMenu from "./code-editor/ContextMenu.vue";
import ConsolePanel from "./code-editor/ConsolePanel.vue";
import ApiConfigDialog from "./code-editor/ApiConfigDialog.vue";
import StarHorseDiffEditor from "./StarHorseDiffEditor.vue";

const IDE_THEMES = [
  {value: "vs", name: "Light"},
  {value: "vs-dark", name: "Dark"},
  {value: "hc-black", name: "High Contrast"},
];

// ==================== Props & Emits ====================
const props = defineProps({
  files: {type: Array as PropType<FileNode[]>, default: () => []},
  menuItems: {type: Array as PropType<MenuItemDef[]>, default: () => []},
  theme: {type: String, default: "vs"},
  readOnly: {type: Boolean, default: false},
  /** API接口配置对象，统一管理所有后端接口地址 */
  api: {type: Object as PropType<IdeApiConfig>, default: () => ({})},
  /** 模块ID，传入后自动从服务器加载该模块的代码 */
  moduleId: {type: String, default: ""},
  /** 加载时的附加参数 */
  loadParams: {type: Object as PropType<Record<string, any>>, default: () => ({})},
  /** 保存时的附加参数 */
  saveParams: {type: Object as PropType<Record<string, any>>, default: () => ({})},
  fontSize: {type: Number, default: 14},
  minimap: {type: Boolean, default: true},
  showActivityBar: {type: Boolean, default: true},
  showExplorer: {type: Boolean, default: true},
  showStatusBar: {type: Boolean, default: true},
  boxHeight: {type: String, default: "100%"},
});
const emit = defineEmits([
  "file-open", "file-save", "file-close", "file-create", "file-delete",
  "file-rename", "folder-create", "menu-action", "change",
  "lspConnected", "lspDisconnected", "tree-change",
  "load-complete", "save-complete", "drop",
  "compile", "run",
]);

const {localConfig, resolvedApi, resetConfig,updateConfig} = useApiConfig(toRef(props.api));
// ==================== IDE State ====================
const ideRoot = ref<HTMLElement>();
const editorContainer = ref<HTMLElement>();
const editorInstance = shallowRef<monaco.editor.IStandaloneCodeEditor>();
const openTabs = ref<TabInfo[]>([]);
const activeTabId = ref("");
const sidebarVisible = ref(true);
const activePanel = ref("explorer");
const currentTheme = ref(props.theme);
const themeVars = computed(() => getThemeByValue(currentTheme.value).vars);
const cursorLine = ref(1);
const cursorCol = ref(1);
const expandedFolders = ref<Set<string>>(new Set());
const sidebarWidth = ref(240);
const monacoModels = new Map<string, monaco.editor.ITextModel>();
const fileInputRef = ref<HTMLInputElement>();
const dirInputRef = ref<HTMLInputElement>();
/** 跟踪已修改的文件ID（编辑过但未保存的） */
const modifiedFiles = ref<Set<string>>(new Set());
/** API配置弹窗 */
const apiConfigDialogVisible = ref(false);

// ==================== 冲突解决 ====================
const diffEditorVisible = ref(false);
const diffOriginal = ref("");
const diffModified = ref("");
const diffLanguage = ref("plaintext");
const diffTitle = ref("");
const diffOriginalLabel = ref("");
const diffModifiedLabel = ref("");
const diffConflictMode = ref(false);
const diffConflictMarkers = ref<any[]>([]);
/** 后端返回的冲突信息（用于解决后 force commit） */
const pendingConflictInfo = ref<ConflictCheckResult | null>(null);
/** 当前正在解决冲突的文件索引 */
const currentConflictFileIndex = ref(0);
/** 冲突文件列表 */
const conflictFiles = ref<ConflictFile[]>([]);
/** 保存时的附加参数（用于冲突解决后重试） */
const pendingSaveParams = ref<Record<string, any>>({});

// ==================== 先拉取再提交 ====================
interface PreSaveDiffFile {
  path: string;
  language: string;
  serverContent: string;
  localContent: string;
  resolvedContent?: string;
  id: string;
}

/** 当前 diff 是否为先拉取再提交的审阅模式 */
const isPreSaveReview = ref(false);
/** 先拉取后检测到的变更文件列表 */
const preSaveDiffFiles = ref<PreSaveDiffFile[]>([]);
/** 当前审阅的文件索引 */
const currentDiffFileIndex = ref(0);

// ==================== 可配置设置（运行时） ====================
const currentFontSize = ref(props.fontSize);
const currentMinimap = ref(props.minimap);
const currentWordWrap = ref<"on" | "off">("on");
const currentTabSize = ref(4);
const searchQuery = ref("");
const searchResults = ref<{ idCodeFile: string; name: string; line: number; text: string; path: string }[]>([]);

/** 搜索文件内容 */
const doSearch = (query: string) => {
  if (!query.trim()) {
    searchResults.value = [];
    return;
  }
  const results: typeof searchResults.value = [];
  const q = query.toLowerCase();
  const searchNodes = (nodes: FileNode[]) => {
    for (const node of nodes) {
      if (node.type === "file" && node.content) {
        const lines = node.content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].toLowerCase().includes(q)) {
            const path = fileTree.getNodePath(node.idCodeFile);
            results.push({
              idCodeFile: node.idCodeFile,
              name: node.name,
              line: i + 1,
              text: lines[i].trim().slice(0, 120),
              path: path.slice(0, -1).join("/"),
            });
            if (results.length >= 50) return; // 限制结果数量
          }
        }
      }
      if (node.children) searchNodes(node.children);
    }
  };
  searchNodes(fileTree.tree.value);
  searchResults.value = results;
};

/** 点击搜索结果 */
const openSearchResult = (result: { idCodeFile: string; line: number }) => {
  const node = fileTree.findNode(result.idCodeFile);
  if (node) {
    openFile(node);
    nextTick(() => {
      const editor = toRaw(editorInstance.value);
      if (editor) {
        editor.revealLineInCenter(result.line);
        editor.setPosition({lineNumber: result.line, column: 1});
        editor.focus();
      }
    });
  }
};

/** 应用编辑器设置 */
const applyEditorSettings = () => {
  const editor = toRaw(editorInstance.value);
  if (editor) {
    editor.updateOptions({
      fontSize: currentFontSize.value,
      minimap: {enabled: currentMinimap.value},
      wordWrap: currentWordWrap.value,
      tabSize: currentTabSize.value,
    });
  }
};

// ==================== File Tree (内部管理) ====================
const fileTree = useFileTree(props.files);
const editingNodeId = ref<string | null>(null);

// ==================== File API (后端集成) ====================
const fileApi = useFileApi(resolvedApi.value.loadUrl, resolvedApi.value.saveUrl);

// ==================== 模块选择弹窗（加载/保存共用） ====================
const {
  moduleDialogVisible, moduleDialogMode, selectedModuleId,
  moduleListLoading, moduleSearchKeyword, moduleDialogLoading,
  showCreateForm, newModuleName, newModuleDesc,
  filteredModuleList, moduleDialogTitle,
  openModuleDialog, cancelModuleDialog, toggleCreateForm, createModuleAndSave,
} = useModuleDialog(resolvedApi);

/** 弹窗确认（加载模式） */
const confirmModuleLoad = () => {
  if (!selectedModuleId.value) {
    warning(i18n("ide.module.selectOne"));
    return;
  }
  moduleDialogVisible.value = false;
  doLoadFromServer({item: selectedModuleId.value});
};

/** 弹窗确认（保存模式） */
const confirmModuleSave = async () => {
  if (!selectedModuleId.value) {
    warning(i18n("ide.module.selectOne"));
    return;
  }
  moduleDialogVisible.value = false;
  await doSaveToServer({moduleId: selectedModuleId.value});
};

/** 弹窗确认按钮统一入口 */
const confirmModuleAction = () => {
  if (moduleDialogMode.value === "load") {
    confirmModuleLoad();
  } else {
    confirmModuleSave();
  }
};


// ==================== Drag & Drop ====================
const draggingId = ref<string | null>(null);
const dropTargetId = ref<string | null>(null);

// ==================== Context Menu ====================
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({x: 0, y: 0});
const contextMenuItems = ref<ContextMenuItem[]>([]);
const contextMenuTargetId = ref<string | null>(null);

// ==================== Computed ====================
const activeTab = computed(() => openTabs.value.find(t => t.id === activeTabId.value));
const activeFile = computed(() => fileTree.findNode(activeTabId.value));
const currentLang = computed(() => activeTab.value?.language || "plaintext");
/** 面包屑路径：显示文件完整路径（含父目录） */
const breadcrumbPath = computed(() => {
  if (!activeTabId.value) return "";
  const path = fileTree.getNodePath(activeTabId.value);
  return path.join(" / ");
});

// ==================== LSP ====================
const lspServerUrlRef = computed(() => props.api?.lspServerUrl);
const getDocumentUri = () => {
  const name = activeTab.value?.name || "untitled.txt";
  return `file:///workspace/${name}`;
};
const lsp = useLsp(lspServerUrlRef, editorInstance, currentLang, getDocumentUri);

// ==================== 标签页管理 ====================

/** 刷新所有打开标签页的路径信息（用于同名文件区分） */
const refreshTabPaths = () => {
  for (const tab of openTabs.value) {
    tab.path = fileTree.getParentPath(tab.id);
  }
};

const openFile = (file: FileNode) => {
  if (file.type === "folder") {
    toggleFolder(file.idCodeFile);
    return;
  }
  if (!openTabs.value.find(t => t.id === file.idCodeFile)) {
    openTabs.value.push({
      id: file.idCodeFile,
      name: file.name,
      language: file.language || detectLanguage(file.name),
      modified: false,
      path: fileTree.getParentPath(file.idCodeFile),
    });
    // 刷新所有标签页路径，以便同名文件能正确区分
    refreshTabPaths();
  }
  activeTabId.value = file.idCodeFile;
  emit("file-open", file);
};

const closeTab = (tabId: string) => {
  const idx = openTabs.value.findIndex(t => t.id === tabId);
  if (idx === -1) return;
  openTabs.value.splice(idx, 1);
  const model = monacoModels.get(tabId);
  if (model) {
    model.dispose();
    monacoModels.delete(tabId);
  }
  emit("file-close", {id: tabId});
  if (activeTabId.value === tabId) {
    activeTabId.value = openTabs.value.length > 0
        ? openTabs.value[Math.min(idx, openTabs.value.length - 1)].id
        : "";
  }
};

const switchTab = (tabId: string) => {
  activeTabId.value = tabId;
};

const toggleFolder = (id: string) => {
  const s = new Set(expandedFolders.value);
  s.has(id) ? s.delete(id) : s.add(id);
  expandedFolders.value = s;
};

// ==================== Monaco 模型管理 ====================
const getOrCreateModel = (file: FileNode): monaco.editor.ITextModel => {
  let model = monacoModels.get(file.idCodeFile);
  if (!model) {
    const lang = file.language || detectLanguage(file.name);
    model = monaco.editor.createModel(file.content || "", lang);
    monacoModels.set(file.idCodeFile, model);
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
    // 根据当前文件语言自动切换LSP连接
    const lang = file.language || detectLanguage(file.name);
    lsp.switchLanguage(lang);
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
  editingNodeId.value = fileTree.createFile(parentId);
};

const handleNewFolder = (parentId: string | null = null) => {
  if (parentId) {
    const s = new Set(expandedFolders.value);
    s.add(parentId);
    expandedFolders.value = s;
  }
  editingNodeId.value = fileTree.createFolder(parentId);
};

const handleRename = (nodeId: string) => {
  editingNodeId.value = nodeId;
};

const handleDelete = async (nodeId: string) => {
  const node = fileTree.findNode(nodeId);
  if (!node) return;
  const msg = node.type === "folder"
      ? (i18n("ide.confirmDeleteFolder") as any)(node.name)
      : (i18n("ide.confirmDeleteFile") as any)(node.name);
  const confirmFlag: boolean = await operationConfirm(msg);
  if (!confirmFlag) {
    return;
  }
  // 关闭受影响的标签页
  const affected = new Set<string>();
  const collectIds = (n: FileNode) => {
    affected.add(n.idCodeFile);
    n.children?.forEach(collectIds);
  };
  collectIds(node);
  openTabs.value.filter(t => affected.has(t.id)).forEach(t => closeTab(t.id));
  fileTree.deleteNode(nodeId);
  emit("file-delete", {id: nodeId});
  emit("tree-change", fileTree.tree.value);
};

/** 防止 Enter 确认后 blur 又触发 cancel */
const editConfirming = ref(false);

const handleEditConfirm = (id: string, newName: string) => {
  editConfirming.value = true;
  if (!newName.trim()) {
    editingNodeId.value = null;
    fileTree.cancelCreate(id);
    editConfirming.value = false;
    return;
  }
  const node = fileTree.findNode(id);
  if (!node) {
    editingNodeId.value = null;
    editConfirming.value = false;
    return;
  }
  const isPending = node.name === "untitled.txt" || node.name === i18n("ide.newFolder")
      || node.name.startsWith("untitled-") || node.name.startsWith(i18n("ide.newFolder") + "-");
  if (isPending) {
    const ok = fileTree.confirmCreate(id, newName);
    if (!ok) {
      // 重名了，不关闭编辑框，提示用户
      warning(i18n("ide.nameExists", newName));
      editConfirming.value = false;
      return;
    }
    if (node.type === "file") {
      openFile(node);
      // 自动生成模板内容
      const lang = detectLanguage(newName);
      const className = deriveClassName(newName);
      const filePath = fileTree.getNodePath(node.idCodeFile).join("/");
      const packageName = lang === "java" ? deriveJavaPackage(filePath) : "";
      const templateFn = DEFAULT_TEMPLATES[lang];
      if (templateFn) {
        const content = templateFn(className, packageName);
        fileTree.updateFileContent(node.idCodeFile, content);
        // 更新Monaco模型内容
        const model = monacoModels.get(node.idCodeFile);
        if (model) {
          model.setValue(content);
        }
      }
      emit("file-create", {id, name: newName});
    } else {
      emit("folder-create", {id, name: newName});
    }
  } else {
    const ok = fileTree.renameNode(id, newName);
    if (!ok) {
      warning(i18n("ide.nameExists", newName));
      editConfirming.value = false;
      return;
    }
    // 更新标签页名称和路径
    const tab = openTabs.value.find(t => t.id === id);
    if (tab) {
      tab.name = newName;
      tab.language = node.language || detectLanguage(newName);
    }
    refreshTabPaths();
    // 更新 Monaco 模型语言
    const model = monacoModels.get(id);
    if (model && node.language) monaco.editor.setModelLanguage(model, node.language);
    emit("file-rename", {id, name: newName});
  }
  editingNodeId.value = null;
  emit("tree-change", fileTree.tree.value);
  editConfirming.value = false;
};

const handleEditCancel = (id: string) => {
  if (editConfirming.value) return; // Enter 已确认，忽略 blur 触发的 cancel
  editingNodeId.value = null;
  const node = fileTree.findNode(id);
  const isPending = node && (node.name === "untitled.txt" || node.name === i18n("ide.newFolder")
      || node.name.startsWith("untitled-") || node.name.startsWith(i18n("ide.newFolder") + "-"));
  if (isPending) fileTree.cancelCreate(id);
};

// ==================== 右键菜单 ====================
const handleTreeContextMenu = (node: FileNode, e: MouseEvent) => {
  contextMenuTargetId.value = node.idCodeFile;
  contextMenuPosition.value = {x: e.clientX, y: e.clientY};
  const chain = compactChains.value.get(node.idCodeFile) || [];

  if (node.type === "folder") {
    const items: ContextMenuItem[] = [
      {label: i18n("ide.ctx.newFile"), action: "ctx-new-file"},
      {label: i18n("ide.ctx.newFolder"), action: "ctx-new-folder"},
    ];
    // 紧凑目录：添加中间层级的新建选项
    for (const ancestor of chain) {
      items.push({divider: true, label: ""});
      items.push({label: i18n("ide.ctx.newFileIn", ancestor.name), action: `ctx-new-file-in::${ancestor.id}`});
      items.push({label: i18n("ide.ctx.newFolderIn", ancestor.name), action: `ctx-new-folder-in::${ancestor.id}`});
    }
    items.push({divider: true, label: ""});
    items.push({label: i18n("ide.ctx.rename"), action: "ctx-rename"});
    items.push({divider: true, label: ""});
    items.push({label: i18n("ide.ctx.delete"), action: "ctx-delete", danger: true});
    contextMenuItems.value = items;
  } else {
    const lang = node.language || detectLanguage(node.name);
    const canCompile = COMPILABLE_LANGUAGES.has(lang);
    const canRun = RUNNABLE_LANGUAGES.has(lang);
    const items: ContextMenuItem[] = [
      {label: i18n("ide.ctx.open"), action: "ctx-open"},
    ];
    if (canCompile) {
      items.push({divider: true, label: ""});
      items.push({label: i18n("ide.ctx.compile"), action: "ctx-compile"});
    }
    if (canRun) {
      items.push({label: i18n("ide.ctx.run"), action: "ctx-run"});
    }
    items.push({divider: true, label: ""});
    items.push({label: i18n("ide.ctx.newFile"), action: "ctx-new-file-sibling"});
    items.push({label: i18n("ide.ctx.newFolder"), action: "ctx-new-folder-sibling"});
    items.push({divider: true, label: ""});
    items.push({label: i18n("ide.ctx.rename"), action: "ctx-rename"});
    items.push({divider: true, label: ""});
    items.push({label: i18n("ide.ctx.delete"), action: "ctx-delete", danger: true});
    contextMenuItems.value = items;
  }
  contextMenuVisible.value = true;
};

const handleSidebarContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  contextMenuTargetId.value = null;
  contextMenuPosition.value = {x: e.clientX, y: e.clientY};
  contextMenuItems.value = [
    {label: i18n("ide.ctx.newFile"), action: "ctx-new-file"},
    {label: i18n("ide.ctx.newFolder"), action: "ctx-new-folder"},
  ];
  contextMenuVisible.value = true;
};

const handleContextMenuAction = (action: string) => {
  const targetId = contextMenuTargetId.value;
  const targetNode = targetId ? fileTree.findNode(targetId) : null;
  const siblingParentId = targetId ? fileTree.findParent(targetId)?.idCodeFile || null : null;

  // 紧凑目录中间层级操作：ctx-new-file-in::parentId / ctx-new-folder-in::parentId
  if (action.startsWith("ctx-new-file-in::")) {
    const parentId = action.split("::")[1];
    handleNewFile(parentId);
    contextMenuVisible.value = false;
    return;
  }
  if (action.startsWith("ctx-new-folder-in::")) {
    const parentId = action.split("::")[1];
    handleNewFolder(parentId);
    contextMenuVisible.value = false;
    return;
  }
  // 紧凑目录拖拽选择：compact-drop::targetFolderId
  if (action.startsWith("compact-drop::")) {
    const targetFolderId = action.split("::")[1];
    if (compactDropSourceId.value && targetFolderId) {
      handleDrop(compactDropSourceId.value, targetFolderId);
    }
    compactDropSourceId.value = null;
    contextMenuVisible.value = false;
    return;
  }

  switch (action) {
    case "ctx-new-file":
      handleNewFile(targetNode?.type === "folder" ? targetId : null);
      break;
    case "ctx-new-folder":
      handleNewFolder(targetNode?.type === "folder" ? targetId : null);
      break;
    case "ctx-new-file-sibling":
      handleNewFile(siblingParentId);
      break;
    case "ctx-new-folder-sibling":
      handleNewFolder(siblingParentId);
      break;
    case "ctx-rename":
      if (targetId) handleRename(targetId);
      break;
    case "ctx-delete":
      if (targetId) handleDelete(targetId);
      break;
    case "ctx-open":
      if (targetNode) openFile(targetNode);
      break;
    case "ctx-compile":
      doCompile();
      break;
    case "ctx-run":
      doRun();
      break;
  }
  contextMenuVisible.value = false;
};


// ==================== 菜单动作处理 ====================
const handleMenuAction = (item: MenuItemDef) => {
  if (!item.action) return;
  const editor = toRaw(editorInstance.value);
  switch (item.action) {
    case "new-file":
      handleNewFile(null);
      break;
    case "new-folder":
      handleNewFolder(null);
      break;
    case "open-file":
      fileInputRef.value?.click();
      break;
    case "open-directory":
      dirInputRef.value?.click();
      break;
    case "load-server":
      loadFromServer();
      break;
    case "save":
      if (activeTabId.value) {
        const content = editor?.getValue() || "";
        fileTree.updateFileContent(activeTabId.value, content);
        const tab = openTabs.value.find(t => t.id === activeTabId.value);
        if (tab) tab.modified = false;
        // 清除修改标记
        const ms = new Set(modifiedFiles.value);
        ms.delete(activeTabId.value);
        modifiedFiles.value = ms;
        emit("file-save", {id: activeTabId.value, content});
      }
      break;
    case "save-all":
      openTabs.value.forEach(t => {
        const model = monacoModels.get(t.id);
        if (model) {
          const content = model.getValue();
          fileTree.updateFileContent(t.id, content);
          t.modified = false;
          emit("file-save", {id: t.id, content});
        }
      });
      // 清除所有修改标记
      modifiedFiles.value = new Set();
      break;
    case "save-server":
      saveToServer();
      break;
    case "close-tab":
      if (activeTabId.value) closeTab(activeTabId.value);
      break;
    case "close-all":
      [...openTabs.value].forEach(t => closeTab(t.id));
      break;
    case "undo":
      editor?.trigger("menu", "undo", null);
      break;
    case "redo":
      editor?.trigger("menu", "redo", null);
      break;
    case "cut":
      editor?.trigger("menu", "editor.action.clipboardCutAction", null);
      break;
    case "copy":
      editor?.trigger("menu", "editor.action.clipboardCopyAction", null);
      break;
    case "paste":
      editor?.trigger("menu", "editor.action.clipboardPasteAction", null);
      break;
    case "find":
      editor?.trigger("menu", "actions.find", null);
      break;
    case "replace":
      editor?.trigger("menu", "editor.action.startFindReplaceAction", null);
      break;
    case "select-all":
      editor?.trigger("menu", "editor.action.selectAll", null);
      break;
    case "format-document":
      editor?.getAction("editor.action.formatDocument")?.run();
      break;
    case "toggle-console":
      consoleVisible.value = !consoleVisible.value;
      break;
    case "toggle-sidebar":
      sidebarVisible.value = !sidebarVisible.value;
      break;
    case "toggle-minimap": {
      const cur = editor?.getOption(monaco.editor.EditorOption.minimap);
      editor?.updateOptions({minimap: {enabled: !cur?.enabled}});
      break;
    }
    case "zoom-in": {
      const s = editor?.getOption(monaco.editor.EditorOption.fontSize) || 14;
      editor?.updateOptions({fontSize: s + 1});
      break;
    }
    case "zoom-out": {
      const s = editor?.getOption(monaco.editor.EditorOption.fontSize) || 14;
      editor?.updateOptions({fontSize: Math.max(8, s - 1)});
      break;
    }
    case "zoom-reset":
      editor?.updateOptions({fontSize: props.fontSize});
      break;
    case "compile": {
      doCompile();
      break;
    }
    case "run": {
      doRun();
      break;
    }
    case "compile-register": {
      ideActions.doCompileRegister();
      break;
    }
    case "unregister-all": {
      ideActions.doUnregisterAll();
      break;
    }
    case "health-check": {
      ideActions.doHealthCheck();
      break;
    }
    case "draft-save": {
      ideActions.doSaveDraft();
      break;
    }
    case "diff-editor": {
      // 对比当前文件与原始版本
      const currentContent = editor?.getValue() || "";
      const tab = activeTab.value;
      const originalContent = tab?.originalContent || "";
      openDiffEditor({
        original: originalContent || currentContent,
        modified: currentContent,
        language: tab?.language || "plaintext",
        title: i18n("diff.title") + (tab?.name ? " - " + tab.name : ""),
        originalLabel: i18n("diff.original"),
        modifiedLabel: i18n("diff.modified"),
      });
      break;
    }
    case "resolve-conflict": {
      // 解决冲突：对比服务器版本和本地版本
      if (activeTab.value) {
        const localContent = editor?.getValue() || "";
        const serverContent = activeTab.value.serverContent || "";
        if (localContent.includes("<<<<<<<") || serverContent) {
          resolveConflict(serverContent || localContent, localContent, activeTab.value.language || "plaintext");
        } else {
          warning(i18n("ide.diff.noConflict"));
        }
      }
      break;
    }
    default:
      emit("menu-action", item.action);
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
      if (!current[part]) current[part] = i === parts.length - 1 ? {__file: file} : {};
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

// ==================== 外部文件拖入 ====================
const fileDragOver = ref(false);

const handleEditorDragOver = (e: DragEvent) => {
  // 只接受来自外部的文件（不是树节点内部拖拽）
  if (e.dataTransfer?.types?.includes("Files")) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    fileDragOver.value = true;
  }
};

const handleEditorDragLeave = (e: DragEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const {clientX: x, clientY: y} = e;
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    fileDragOver.value = false;
  }
};

const handleExternalDrop = (e: DragEvent) => {
  e.preventDefault();
  fileDragOver.value = false;
  const files = e.dataTransfer?.files;
  if (!files?.length) return;
  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const id = fileTree.createFile(null, file.name);
      fileTree.updateFileContent(id, reader.result as string);
      const node = fileTree.findNode(id);
      if (node) openFile(node);
    };
    reader.readAsText(file);
  });
  emit("tree-change", fileTree.tree.value);
};

// ==================== 键盘快捷键 ====================
const handleKeydown = (e: KeyboardEvent) => {
  const editor = toRaw(editorInstance.value);
  // Shift+Alt+F 格式化
  if (e.shiftKey && e.altKey && e.key.toLowerCase() === "f") {
    e.preventDefault();
    editor?.getAction("editor.action.formatDocument")?.run();
    return;
  }
  // Ctrl+` 切换控制台
  if ((e.ctrlKey || e.metaKey) && e.key === "`") {
    e.preventDefault();
    toggleConsole();
    return;
  }
  if (e.ctrlKey || e.metaKey) {
    const key = e.key.toLowerCase();
    if (key === "s") {
      e.preventDefault();
      handleMenuAction({label: "", action: "save"});
    } else if (key === "b") {
      e.preventDefault();
      sidebarVisible.value = !sidebarVisible.value;
    } else if (key === "w") {
      e.preventDefault();
      if (activeTabId.value) closeTab(activeTabId.value);
    } else if (key === "o") {
      e.preventDefault();
      fileInputRef.value?.click();
    } else if (key === "n") {
      e.preventDefault();
      handleNewFile(null);
    } else if (e.shiftKey && key === "d") {
      e.preventDefault();
      handleMenuAction({label: "", action: "diff-editor"});
    }
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
    refreshTabPaths();
    emit("drop", {sourceId, targetFolderId});
    emit("tree-change", fileTree.tree.value);
  } else {
    // moveNode 失败：可能是重名或循环引用
    const node = fileTree.findNode(sourceId);
    if (node && fileTree.hasDuplicateName(targetFolderId, node.name, sourceId)) {
      warning(i18n("ide.moveNameExists", node.name));
    }
  }
  draggingId.value = null;
  dropTargetId.value = null;
};

/** 紧凑目录拖拽选择：弹出菜单让用户选择放到哪个中间目录 */
const handleCompactDropSelect = (sourceId: string, targetNodeId: string, chain: {
  id: string;
  name: string
}[], position: { x: number; y: number }) => {
  const items: ContextMenuItem[] = [];
  // 添加中间目录选项
  for (const ancestor of chain) {
    items.push({label: i18n("ide.drop.moveTo", ancestor.name), action: `compact-drop::${ancestor.id}`});
  }
  // 添加最底层目录选项
  const targetNode = fileTree.findNode(targetNodeId);
  if (targetNode) {
    items.push({label: i18n("ide.drop.moveTo", targetNode.name), action: `compact-drop::${targetNodeId}`});
  }
  compactDropSourceId.value = sourceId;
  contextMenuItems.value = items;
  contextMenuPosition.value = position;
  contextMenuVisible.value = true;
};

/** 紧凑目录拖拽的源文件ID */
const compactDropSourceId = ref<string | null>(null);

// ==================== 从后端加载 ====================
/** 递归收集所有文件夹ID（用于自动展开） */
const collectFolderIds = (nodes: FileNode[], ids: Set<string>) => {
  for (const node of nodes) {
    if (node.type === "folder") {
      ids.add(node.idCodeFile);
      if (node.children) collectFolderIds(node.children, ids);
    }
  }
};

/** 内部执行加载（带参数） */
const doLoadFromServer = async (params?: Record<string, any>) => {
  if (!resolvedApi.value.loadUrl) {
    warning(i18n("ide.load.noUrl"));
    return;
  }
  // 合并参数: moduleId + loadParams + 手动传入的 params
  const mergedParams: Record<string, any> = {...props.loadParams, ...params};
  if (props.moduleId) mergedParams.item = props.moduleId;
  const nodes = await fileApi.loadFromServer(
      Object.keys(mergedParams).length > 0 ? mergedParams : undefined,
  );
  if (nodes.length > 0) {
    fileTree.replaceTree(nodes);
    // 自动展开所有文件夹，让用户看到完整目录结构
    const allFolderIds = new Set<string>();
    collectFolderIds(nodes, allFolderIds);
    expandedFolders.value = allFolderIds;
    [...openTabs.value].forEach(t => closeTab(t.id));
    const first = fileTree.findFirstFile();
    if (first) openFile(first);
    success(i18n("ide.load.success"));
    emit("load-complete", nodes);
    emit("tree-change", fileTree.tree.value);
  } else {
    if (fileApi.lastError.value) {
      warning(fileApi.lastError.value);
    }
  }
};

/** 从服务器加载（公共方法），如果配置了 moduleListUrl 则弹窗选择模块 */
const loadFromServer = async (params?: Record<string, any>) => {
  if (params && Object.keys(params).length > 0) {
    // 直接带参数加载，不弹窗
    await doLoadFromServer(params);
    return;
  }
  if (resolvedApi.value.moduleListUrl) {
    // 弹出模块选择弹窗
    await openModuleDialog();
  } else {
    // 没有 moduleListUrl，直接加载
    await doLoadFromServer();
  }
};

/** 加载指定模块的代码（便捷方法） */
const loadModule = async (moduleId: string) => {
  await doLoadFromServer({moduleId});
};

// ==================== 保存到后端 ====================
/** 内部执行保存（带参数）- 先拉取再提交流程 */
const doSaveToServer = async (params?: Record<string, any>) => {
  if (!resolvedApi.value.saveUrl) {
    warning(i18n("ide.save.noUrl"));
    return false;
  }

  // 1. 同步所有标签页内容到文件树
  openTabs.value.forEach(t => {
    const model = monacoModels.get(t.id);
    if (model) {
      fileTree.updateFileContent(t.id, model.getValue());
      t.modified = false;
    }
  });
  modifiedFiles.value = new Set();

  // 准备保存参数
  const mergedParams: Record<string, any> = {...props.saveParams, ...params};
  if (props.moduleId) mergedParams.moduleId = props.moduleId;
  if (fileApi.baseCommitId.value) {
    mergedParams.baseCommitId = fileApi.baseCommitId.value;
  }
  pendingSaveParams.value = mergedParams;

  // 2. 如果配置了 loadUrl，先拉取最新版本做对比（pull-before-push）
  if (resolvedApi.value.loadUrl) {
    success(i18n("ide.save.fetchingLatest"));

    // 构建加载参数（与 doLoadFromServer 保持一致）
    const loadParams: Record<string, any> = {...props.loadParams};
    if (props.moduleId) loadParams.item = props.moduleId;

    const latest = await fileApi.fetchLatest(
      Object.keys(loadParams).length > 0 ? loadParams : undefined,
    );

    // 如果成功拉取到服务端版本，进行文件对比
    if (latest.tree.length > 0) {
      const localFiles = fileTree.collectAllFiles();
      const serverFiles = fileTree.collectAllFiles(latest.tree);

      // 构建服务端文件 Map（按路径索引）
      const serverMap = new Map<string, { content: string; language: string }>();
      serverFiles.forEach(f => serverMap.set(f.path, { content: f.content, language: f.language }));

      // 找出有差异的文件
      const changedFiles: PreSaveDiffFile[] = [];
      for (const local of localFiles) {
        const server = serverMap.get(local.path);
        const serverContent = server?.content || "";
        if (local.content !== serverContent) {
          changedFiles.push({
            path: local.path,
            language: local.language,
            serverContent,
            localContent: local.content,
            id: local.id,
          });
        }
      }

      // 如果没有任何变更，直接提交（快速路径）
      if (changedFiles.length === 0) {
        warning(i18n("ide.save.noChanges"));
        return false;
      }

      // 有变更 -> 进入先审阅再提交流程
      isPreSaveReview.value = true;
      preSaveDiffFiles.value = changedFiles;
      currentDiffFileIndex.value = 0;

      // 更新 baseCommitId 为最新
      if (latest.commitId) {
        fileApi.baseCommitId.value = latest.commitId;
        pendingSaveParams.value = { ...mergedParams, baseCommitId: latest.commitId };
      }

      // 打开第一个变更文件的 diff
      openPreSaveDiffFile(0);
      return false;
    }
    // 拉取失败或为空 -> 回退到直接保存模式
  }

  // 3. 直接保存（无 loadUrl 或拉取失败时的回退路径）
  const result: SaveResult = await fileApi.saveToServer(
    fileTree.tree.value,
    Object.keys(mergedParams).length > 0 ? mergedParams : undefined,
  );

  if (result.success) {
    success(i18n("ide.save.success"));
    emit("save-complete", fileTree.tree.value);
    return true;
  }

  // 检测到冲突，打开冲突解决界面
  if (result.hasConflict && result.conflictInfo) {
    handleConflictDetected(result.conflictInfo);
    return false;
  }

  // 其他错误
  warning(result.error || fileApi.lastError.value || i18n("ide.save.failed"));
  return false;
};

/** 打开先审阅模式的 diff 文件 */
const openPreSaveDiffFile = (index: number) => {
  if (index < 0 || index >= preSaveDiffFiles.value.length) return;
  currentDiffFileIndex.value = index;
  const file = preSaveDiffFiles.value[index];

  openDiffEditor({
    original: file.serverContent,
    modified: file.localContent,
    language: file.language,
    title: `${i18n("diff.title")} - ${file.path} (${index + 1}/${preSaveDiffFiles.value.length})`,
    originalLabel: i18n("diff.serverVersion"),
    modifiedLabel: i18n("diff.localVersion"),
    conflictMode: false,
    conflictMarkers: [],
  });
};

/** 处理后端返回的冲突信息 */
const handleConflictDetected = (conflictInfo: ConflictCheckResult) => {
  pendingConflictInfo.value = conflictInfo;
  conflictFiles.value = conflictInfo.conflictFiles || [];
  currentConflictFileIndex.value = 0;

  if (conflictFiles.value.length === 0) {
    warning(i18n("ide.diff.noConflict"));
    return;
  }

  // 显示冲突提示消息
  const fileCount = conflictFiles.value.length;
  const commitCount = conflictInfo.divergedCommits;
  warning(i18n("ide.save.conflictDetected", fileCount, commitCount));

  // 打开第一个冲突文件的 Diff 编辑器
  openConflictFileByIndex(0);
};

/** 打开指定索引的冲突文件 */
const openConflictFileByIndex = (index: number) => {
  if (index < 0 || index >= conflictFiles.value.length) return;
  currentConflictFileIndex.value = index;
  const cf = conflictFiles.value[index];

  // 根据冲突类型决定展示内容
  // 原始侧 = 别人的版本（theirContent / 服务器最新版本）
  // 修改侧 = 我的版本（myContent / 本地编辑的版本）
  openDiffEditor({
    original: cf.theirContent || "",
    modified: cf.myContent || "",
    language: cf.language || "plaintext",
    title: `${i18n("diff.conflictTitle")} - ${cf.path} (${index + 1}/${conflictFiles.value.length})`,
    originalLabel: i18n("diff.serverVersion"),
    modifiedLabel: i18n("diff.localVersion"),
    conflictMode: cf.conflictType === "CONTENT",
    conflictMarkers: [],
  });
};

/** 强制提交（跳过冲突检测） */
const doForceCommit = async () => {
  if (!resolvedApi.value.saveUrl) return false;

  // 更新所有标签页内容到文件树
  openTabs.value.forEach(t => {
    const model = monacoModels.get(t.id);
    if (model) {
      fileTree.updateFileContent(t.id, model.getValue());
      t.modified = false;
    }
  });
  modifiedFiles.value = new Set();

  // 强制提交参数
  const forceParams: Record<string, any> = {
    ...pendingSaveParams.value,
    forceCommit: true,
  };

  const result: SaveResult = await fileApi.saveToServer(
      fileTree.tree.value,
      forceParams,
  );

  if (result.success) {
    success(i18n("ide.save.conflictResolvedSuccess"));
    pendingConflictInfo.value = null;
    conflictFiles.value = [];
    emit("save-complete", fileTree.tree.value);
    return true;
  }

  warning(result.error || fileApi.lastError.value || i18n("ide.save.failed"));
  return false;
};

/** 先审阅模式下跳过剩余审阅直接提交 */
const doPreSaveForceCommit = async () => {
  // 先把已审阅的文件内容更新到文件树（未审阅的保持本地版本）
  for (const file of preSaveDiffFiles.value) {
    if (file.resolvedContent !== undefined) {
      fileTree.updateFileContent(file.id, file.resolvedContent);
    }
  }

  diffEditorVisible.value = false;
  isPreSaveReview.value = false;
  success(i18n("ide.save.allFilesReviewed"));

  const commitParams: Record<string, any> = {
    ...pendingSaveParams.value,
    forceCommit: true,
  };

  const result: SaveResult = await fileApi.saveToServer(
    fileTree.tree.value,
    Object.keys(commitParams).length > 0 ? commitParams : undefined,
  );

  if (result.success) {
    success(i18n("ide.save.success"));
    preSaveDiffFiles.value = [];
    emit("save-complete", fileTree.tree.value);
    return true;
  }

  if (result.hasConflict && result.conflictInfo) {
    handleConflictDetected(result.conflictInfo);
    return false;
  }

  warning(result.error || fileApi.lastError.value || i18n("ide.save.failed"));
  return false;
};

/** 保存到服务器（公共方法），如果配置了 moduleListUrl 则弹窗选择模块 */
const saveToServer = async () => {
  if (resolvedApi.value.moduleListUrl) {
    // 弹出模块选择弹窗（保存模式）
    await openModuleDialog("save");
  } else {
    // 没有 moduleListUrl，直接保存
    await doSaveToServer();
  }
};

// ==================== 排序 + 紧凑目录 ====================
/** 递归排序：目录在前，文件在后，各自按名称排序 */
const sortNodes = (nodes: FileNode[]): FileNode[] => {
  const sorted = [...nodes].sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  for (const n of sorted) {
    if (n.children) n.children = sortNodes(n.children);
  }
  return sorted;
};

/** 紧凑目录：将只有一个子文件夹的文件夹合并显示，子节点提升到父级 */
const compactAndSort = (nodes: FileNode[]): {
  nodes: FileNode[];
  labels: Map<string, string>;
  chains: Map<string, { id: string; name: string }[]>;
} => {
  const labels = new Map<string, string>();
  const chains = new Map<string, { id: string; name: string }[]>();
  const process = (nodes: FileNode[], parentLabel = "", parentChain: {
    id: string;
    name: string
  }[] = []): FileNode[] => {
    const result: FileNode[] = [];
    for (const node of sortNodes(nodes)) {
      if (node.type === "folder" && node.children?.length === 1 && node.children[0].type === "folder") {
        const child = node.children[0];
        const combinedLabel = parentLabel ? parentLabel + "/" + node.name : node.name;
        const newChain = [...parentChain, {id: node.idCodeFile, name: node.name}];
        labels.set(child.idCodeFile, combinedLabel + "/" + child.name);
        chains.set(child.idCodeFile, newChain);
        result.push(...process([child], combinedLabel, newChain));
      } else {
        if (node.children) {
          result.push({...node, children: process(node.children)});
        } else {
          result.push(node);
        }
      }
    }
    return result;
  };
  return {nodes: process(nodes), labels, chains};
};

const compactResult = computed(() => compactAndSort(fileTree.tree.value));
const sortedTree = computed(() => compactResult.value.nodes);
const compactLabels = computed(() => compactResult.value.labels);
const compactChains = computed(() => compactResult.value.chains);

// ==================== 控制台 ====================
const {
  consoleVisible, consoleLines, consoleBusy,
  appendConsole, clearConsole, toggleConsole,
} = useConsole();

// ==================== 定位当前文件 ====================
const highlightedId = ref<string | null>(null);
let highlightTimer: ReturnType<typeof setTimeout> | null = null;

const locateActiveFile = () => {
  if (!activeTabId.value) return;
  // 展开所有祖先目录
  const ancestorIds = fileTree.getAncestorIds(activeTabId.value);
  const s = new Set(expandedFolders.value);
  for (const id of ancestorIds) s.add(id);
  expandedFolders.value = s;
  // 高亮目标节点
  highlightedId.value = activeTabId.value;
  if (highlightTimer) clearTimeout(highlightTimer);
  highlightTimer = setTimeout(() => {
    highlightedId.value = null;
  }, 2000);
  // 滚动到目标节点
  nextTick(() => {
    const el = document.querySelector(".locate-highlight") as HTMLElement;
    if (el) el.scrollIntoView({behavior: "smooth", block: "center"});
  });
};

/** 当前活动文件是否支持编译或运行 */
const canBuildActive = computed(() => {
  if (!activeTab.value) return false;
  const lang = activeTab.value.language;
  return COMPILABLE_LANGUAGES.has(lang) || RUNNABLE_LANGUAGES.has(lang);
});

// ==================== IDE Actions（编译/运行/编译注册/注销/草稿/健康检查） ====================
const ideActions = useIdeActions({
  resolvedApi,
  activeTabId,
  consoleVisible,
  consoleBusy,
  appendConsole,
  getFileContent: (id: string) => fileTree.getFileContent(id) || "",
  findNode: (id: string) => fileTree.findNode(id),
  detectLanguage,
});

/** 编译/运行前自动保存当前文件内容到文件树，确保发送给后端的是最新代码 */
const autoSaveCurrentFile = () => {
  if (!activeTabId.value) return;
  const editor = toRaw(editorInstance.value);
  if (!editor) return;
  const content = editor.getValue();
  fileTree.updateFileContent(activeTabId.value, content);
  // 清除修改标记
  const tab = openTabs.value.find(t => t.id === activeTabId.value);
  if (tab) tab.modified = false;
  const ms = new Set(modifiedFiles.value);
  ms.delete(activeTabId.value);
  modifiedFiles.value = ms;
};

const doCompile = async () => {
  autoSaveCurrentFile();
  await ideActions.doCompile();
  emit("compile", fileTree.findNode(activeTabId.value!));
};

const doRun = async () => {
  autoSaveCurrentFile();
  await ideActions.doRun();
  emit("run", fileTree.findNode(activeTabId.value!));
};

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
    minimap: {enabled: props.minimap},
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: "on",
    tabSize: 4,
    insertSpaces: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: "on",
    quickSuggestions: true,
    parameterHints: {enabled: true},
    folding: true,
    foldingStrategy: "indentation",
    showFoldingControls: "mouseover",
    bracketPairColorization: {enabled: true},
    guides: {bracketPairs: true, indentation: true},
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
    // 标记文件为已修改
    if (activeTabId.value) {
      const s = new Set(modifiedFiles.value);
      s.add(activeTabId.value);
      modifiedFiles.value = s;
    }
    emit("change", editor.getValue());
    lsp.notifyDidChange();
  });

  // 打开初始文件
  const first = fileTree.findFirstFile();
  if (first) openFile(first);
  if (props.api?.lspServerUrl) lsp.switchLanguage(currentLang.value);
};

// ==================== Watchers ====================
watch(activeTabId, () => {
  nextTick(() => syncActiveFile());
});

watch(() => props.files, (val) => {
  if (val.length > 0 && fileTree.tree.value.length === 0) {
    fileTree.addNodes(JSON.parse(JSON.stringify(val)));
    nextTick(() => {
      const first = fileTree.findFirstFile();
      if (first) openFile(first);
    });
  }
}, {deep: true});

// moduleId 变化时自动重新加载
watch(() => props.moduleId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadModule(newId);
  }
});

// ==================== Expose ====================
const getValue = () => toRaw(editorInstance.value)?.getValue() || "";
const setValue = (v: string) => {
  const e = toRaw(editorInstance.value);
  if (e) e.setValue(v);
};
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
  openDiffEditor,
  resolveConflict,
});

// ==================== 冲突解决方法 ====================
/** 打开Diff编辑器对比文本 */
function openDiffEditor(options: {
  original: string;
  modified: string;
  language?: string;
  title?: string;
  originalLabel?: string;
  modifiedLabel?: string;
  conflictMode?: boolean;
  conflictMarkers?: any[];
}) {
  diffOriginal.value = options.original;
  diffModified.value = options.modified;
  diffLanguage.value = options.language || "plaintext";
  diffTitle.value = options.title || "";
  diffOriginalLabel.value = options.originalLabel || "";
  diffModifiedLabel.value = options.modifiedLabel || "";
  diffConflictMode.value = options.conflictMode || false;
  diffConflictMarkers.value = options.conflictMarkers || [];
  diffEditorVisible.value = true;
}

/** 解决冲突（从后端返回冲突时调用） */
function resolveConflict(serverContent: string, localContent: string, language: string = "plaintext") {
  // 自动检测冲突标记
  const markers: { startLine: number; separatorLine: number; endLine: number; currentContent: string; incomingContent: string }[] = [];
  const lines = localContent.split("\n");
  let i = 0;
  while (i < lines.length) {
    if (lines[i].startsWith("<<<<<<<")) {
      const startLine = i;
      let separatorLine = -1;
      let endLine = -1;
      let j = i + 1;
      while (j < lines.length) {
        if (lines[j].startsWith("=======") && separatorLine === -1) separatorLine = j;
        else if (lines[j].startsWith(">>>>>>>")) { endLine = j; break; }
        j++;
      }
      if (separatorLine >= 0 && endLine >= 0) {
        markers.push({
          startLine,
          separatorLine,
          endLine,
          currentContent: lines.slice(startLine + 1, separatorLine).join("\n"),
          incomingContent: lines.slice(separatorLine + 1, endLine).join("\n"),
        });
      }
      i = endLine >= 0 ? endLine + 1 : lines.length;
    } else {
      i++;
    }
  }

  openDiffEditor({
    original: serverContent,
    modified: localContent,
    language,
    title: i18n("diff.conflictTitle"),
    originalLabel: i18n("diff.serverVersion"),
    modifiedLabel: i18n("diff.localVersion"),
    conflictMode: markers.length > 0,
    conflictMarkers: markers,
  });
}

/** Diff编辑器保存/解决回调 */
const handleDiffSave = async (result: string) => {
  const editor = toRaw(editorInstance.value);

  // 如果是先拉取再提交的审阅模式
  if (isPreSaveReview.value && preSaveDiffFiles.value.length > 0) {
    const file = preSaveDiffFiles.value[currentDiffFileIndex.value];
    if (file) {
      // 更新审阅后的内容
      file.resolvedContent = result;
      // 同时更新文件树中对应文件的内容
      fileTree.updateFileContent(file.id, result);

      // 检查是否还有更多变更文件
      const nextIndex = currentDiffFileIndex.value + 1;
      if (nextIndex < preSaveDiffFiles.value.length) {
        diffEditorVisible.value = false;
        await nextTick();
        openPreSaveDiffFile(nextIndex);
        return;
      }

      // 所有文件已审阅完毕，执行实际提交
      diffEditorVisible.value = false;
      isPreSaveReview.value = false;
      success(i18n("ide.save.allFilesReviewed"));

      // 使用 forceCommit 提交（用户已经审阅了所有变更）
      const commitParams: Record<string, any> = {
        ...pendingSaveParams.value,
        forceCommit: true,
      };

      const saveResult: SaveResult = await fileApi.saveToServer(
        fileTree.tree.value,
        Object.keys(commitParams).length > 0 ? commitParams : undefined,
      );

      if (saveResult.success) {
        success(i18n("ide.save.success"));
        preSaveDiffFiles.value = [];
        emit("save-complete", fileTree.tree.value);
        return;
      }

      // 如果仍然检测到冲突（服务端在审阅期间又有人提交了），走冲突解决流程
      if (saveResult.hasConflict && saveResult.conflictInfo) {
        handleConflictDetected(saveResult.conflictInfo);
        return;
      }

      warning(saveResult.error || fileApi.lastError.value || i18n("ide.save.failed"));
      return;
    }
  }

  // 如果是后端冲突解决流程
  if (pendingConflictInfo.value && conflictFiles.value.length > 0) {
    const cf = conflictFiles.value[currentConflictFileIndex.value];
    if (cf) {
      // 更新解决后的内容
      cf.resolvedContent = result;

      // 同时更新文件树中对应文件的内容
      const node = fileTree.findNodeByPath(cf.path);
      if (node) {
        fileTree.updateFileContent(node.idCodeFile, result);
      }

      // 检查是否还有更多冲突文件
      const nextIndex = currentConflictFileIndex.value + 1;
      if (nextIndex < conflictFiles.value.length) {
        diffEditorVisible.value = false;
        // 打开下一个冲突文件
        await nextTick();
        openConflictFileByIndex(nextIndex);
        return;
      }

      // 所有冲突文件已解决，执行强制提交
      diffEditorVisible.value = false;
      await doForceCommit();
      return;
    }
  }

  // 普通 diff 保存（非后端冲突流程）
  if (editor) {
    editor.setValue(result);
  }
  diffEditorVisible.value = false;
  emit("save-complete", { resolved: true, content: result });
};

const handleDiffClose = () => {
  diffEditorVisible.value = false;
  isPreSaveReview.value = false;
  preSaveDiffFiles.value = [];
};

// ==================== 生命周期 ====================
onMounted(() => {
  initEditor();
  document.addEventListener("keydown", handleKeydown);
  if (ideRoot.value) applyThemeVars(ideRoot.value, currentTheme.value);
  // 如果配置了loadUrl，自动从后端加载
  if (resolvedApi.value.loadUrl) {
    // 初始化时直接加载（不弹窗），弹窗仅在用户手动点击"从服务器加载"时触发
    // doLoadFromServer();
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
  <div
      ref="ideRoot"
      class="sh-ide"

      :style="{ height: boxHeight }"
      @dragover="handleEditorDragOver"
      @dragleave="handleEditorDragLeave"
      @drop="handleExternalDrop"
  >
    <!-- 拖放提示 (覆盖整个IDE) -->
    <div v-if="fileDragOver" class="editor-drop-overlay">📂 {{ i18n('ide.dropFilesHint') }}</div>
    <!-- 隐藏的文件输入框 -->
    <input ref="fileInputRef" type="file" multiple style="display:none" @change="handleFileInput"/>
    <input ref="dirInputRef" type="file" webkitdirectory style="display:none" @change="handleDirInput"/>

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
        :menus="menuItems"
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
            {{
              activePanel === 'explorer' ? i18n('ide.sidebar.explorer') : activePanel === 'search' ? i18n('ide.sidebar.search') : i18n('ide.sidebar.settings')
            }}
          </span>
          <template v-if="activePanel === 'explorer'">
            <button class="sidebar-btn" :title="i18n('ide.ctx.newFile')" @click="handleNewFile(null)">📄+</button>
            <button class="sidebar-btn" :title="i18n('ide.ctx.newFolder')" @click="handleNewFolder(null)">📁+</button>
            <button class="sidebar-btn" :title="i18n('ide.sidebar.locateFile')" @click="locateActiveFile">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <path
                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
          </template>
          <button class="sidebar-btn sidebar-close-btn" :title="i18n('ide.sidebar.hideHint')"
                  @click="sidebarVisible = false">✕
          </button>
        </div>
        <div class="sidebar-content" @contextmenu="handleSidebarContextMenu">
          <!-- 资源管理器面板 -->
          <template v-if="activePanel === 'explorer'">
            <template v-if="sortedTree.length > 0">
              <FileTreeNode
                  v-for="node in sortedTree"
                  :key="node.idCodeFile"
                  :node="node"
                  :depth="0"
                  :expanded="expandedFolders"
                  :active-id="activeTabId"
                  :editing-node-id="editingNodeId"
                  :dragging-id="draggingId"
                  :drop-target-id="dropTargetId"
                  :compact-hidden="undefined"
                  :compact-labels="compactLabels"
                  :compact-chains="compactChains"
                  :modified-files="modifiedFiles"
                  :highlighted-id="highlightedId"
                  @toggle="toggleFolder"
                  @select="openFile"
                  @contextmenu="handleTreeContextMenu"
                  @edit-confirm="handleEditConfirm"
                  @edit-cancel="handleEditCancel"
                  @drag-start="handleDragStart"
                  @drag-end="handleDragEnd"
                  @drop="handleDrop"
                  @compact-drop-select="handleCompactDropSelect"
              />
            </template>
            <div v-else class="sidebar-empty">
              <p>{{ i18n('ide.sidebar.noFiles') }}</p>
              <button class="sidebar-action-btn" @click="handleNewFile(null)">📄 {{
                  i18n('ide.welcome.newFile')
                }}
              </button>
              <button class="sidebar-action-btn" @click="handleNewFolder(null)">📁 {{
                  i18n('ide.welcome.newFolder')
                }}
              </button>
              <p class="sidebar-hint">{{ i18n('ide.sidebar.orViaMenu') }}</p>
            </div>
          </template>
          <!-- 搜索面板 -->
          <template v-else-if="activePanel === 'search'">
            <div class="sidebar-search">
              <div class="search-input-wrap">
                <input
                    v-model="searchQuery"
                    class="search-input"
                    :placeholder="i18n('ide.sidebar.searchPlaceholder')"
                    @input="doSearch(searchQuery)"
                />
                <span v-if="searchQuery" class="search-clear"
                      @click="searchQuery = ''; searchResults = []">&times;</span>
              </div>
              <div class="search-results">
                <div v-if="searchResults.length === 0 && searchQuery" class="search-empty">
                  {{ i18n('ide.sidebar.noResults') }}
                </div>
                <template v-for="(result, idx) in searchResults" :key="idx">
                  <div class="search-result-item" @click="openSearchResult(result)">
                    <div class="search-result-file">
                      <span class="search-result-icon">📄</span>
                      {{ result.name }}
                      <span class="search-result-line">:{{ result.line }}</span>
                    </div>
                    <div class="search-result-text">{{ result.text }}</div>
                    <div v-if="result.path" class="search-result-path">{{ result.path }}</div>
                  </div>
                </template>
                <div v-if="searchResults.length > 0" class="search-count">
                  {{ i18n('ide.sidebar.resultCount', searchResults.length) }}
                </div>
              </div>
            </div>
          </template>
          <!-- 设置面板 -->
          <template v-else>
            <div class="sidebar-settings">
              <!-- 主题 -->
              <div class="setting-group">
                <label class="setting-label">{{ i18n('ide.settings.theme') }}</label>
                <select class="setting-select" :value="currentTheme"
                        @change="switchTheme(($event.target as HTMLSelectElement).value)">
                  <option v-for="t in IDE_THEMES" :key="t.value" :value="t.value">{{ t.name }}</option>
                </select>
              </div>
              <!-- 字体大小 -->
              <div class="setting-group">
                <label class="setting-label">{{ i18n('ide.settings.fontSize') }}</label>
                <div class="setting-number">
                  <button class="setting-btn"
                          @click="currentFontSize = Math.max(10, currentFontSize - 1); applyEditorSettings()">−
                  </button>
                  <span class="setting-value">{{ currentFontSize }}px</span>
                  <button class="setting-btn"
                          @click="currentFontSize = Math.min(28, currentFontSize + 1); applyEditorSettings()">+
                  </button>
                </div>
              </div>
              <!-- Tab 大小 -->
              <div class="setting-group">
                <label class="setting-label">{{ i18n('ide.settings.tabSize') }}</label>
                <div class="setting-tabs">
                  <button
                      v-for="size in [2, 4, 8]"
                      :key="size"
                      class="setting-tab-btn"
                      :class="{ active: currentTabSize === size }"
                      @click="currentTabSize = size; applyEditorSettings()"
                  >{{ size }}
                  </button>
                </div>
              </div>
              <!-- 自动换行 -->
              <div class="setting-group">
                <label class="setting-label">自动换行</label>
                <label class="setting-toggle">
                  <input type="checkbox" :checked="currentWordWrap === 'on'"
                         @change="currentWordWrap = currentWordWrap === 'on' ? 'off' : 'on'; applyEditorSettings()"/>
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <!-- 小地图 -->
              <div class="setting-group">
                <label class="setting-label">小地图</label>
                <label class="setting-toggle">
                  <input type="checkbox" :checked="currentMinimap"
                         @change="currentMinimap = !currentMinimap; applyEditorSettings()"/>
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <!-- API 接口配置 -->
              <div class="setting-group setting-group-section">
                <button class="api-config-open-btn" @click="apiConfigDialogVisible = true">
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                    <path
                        d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                    <path
                        d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                  </svg>
                  API 接口配置
                </button>
              </div>
            </div>
          </template>
        </div>
        <div class="sidebar-resize" @mousedown="onResizeStart"/>
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
        <!-- 面包屑 + 操作按钮 -->
        <div v-if="activeTab" class="sh-ide-breadcrumb">
          <span class="breadcrumb-path">{{ breadcrumbPath }}</span>
          <span class="breadcrumb-lang">{{ activeTab.language }}</span>
          <div v-if="canBuildActive" class="breadcrumb-actions">
            <button v-if="COMPILABLE_LANGUAGES.has(activeTab.language)" class="breadcrumb-btn compile-btn"
                    :title="i18n('ide.menu.build.compile')" :disabled="consoleBusy" @click="doCompile">▶
            </button>
            <button v-if="RUNNABLE_LANGUAGES.has(activeTab.language)" class="breadcrumb-btn run-btn"
                    :title="i18n('ide.menu.build.run')" :disabled="consoleBusy" @click="doRun">►
            </button>
          </div>
        </div>
        <!-- Monaco 编辑器 -->
        <div ref="editorContainer" class="sh-ide-monaco" v-show="openTabs.length > 0"/>
        <!-- 欢迎页 -->
        <div v-if="openTabs.length === 0" class="sh-ide-welcome">
          <div class="welcome-icon">
            <svg viewBox="0 0 100 100" width="80" height="80" fill="none" stroke="currentColor" stroke-width="3"
                 stroke-linecap="round" stroke-linejoin="round">
              <polyline points="30,25 15,50 30,75"/>
              <polyline points="70,25 85,50 70,75"/>
              <line x1="55" y1="20" x2="45" y2="80"/>
            </svg>
          </div>
          <h2>{{ i18n('ide.welcome.title') }}</h2>
          <p>{{ i18n('ide.welcome.hint') }}</p>
          <div class="welcome-actions">
            <button class="welcome-btn" @click="handleNewFile(null)">📄 {{ i18n('ide.welcome.newFile') }}</button>
            <button class="welcome-btn" @click="handleNewFolder(null)">📁 {{ i18n('ide.welcome.newFolder') }}</button>
            <button class="welcome-btn" @click="fileInputRef?.click()">📂 {{ i18n('ide.welcome.openFile') }}</button>
            <button class="welcome-btn" @click="dirInputRef?.click()">📁 {{ i18n('ide.welcome.openDir') }}</button>
          </div>
          <div class="welcome-shortcuts">
            <div><kbd>Ctrl+N</kbd> {{ i18n('ide.welcome.shortcutNewFile') }}</div>
            <div><kbd>Ctrl+O</kbd> {{ i18n('ide.welcome.shortcutOpenFile') }}</div>
            <div><kbd>Ctrl+S</kbd> {{ i18n('ide.welcome.shortcutSave') }}</div>
            <div><kbd>Ctrl+B</kbd> {{ i18n('ide.welcome.shortcutToggleSidebar') }}</div>
          </div>
        </div>
        <!-- 控制台 -->
        <ConsolePanel
            v-model:visible="consoleVisible"
            :lines="consoleLines"
            :busy="consoleBusy"
            @clear="clearConsole"
        />
      </div>
    </div>

    <!-- 状态栏 -->
    <StatusBar
        v-if="showStatusBar"
        :cursor-line="cursorLine"
        :cursor-col="cursorCol"
        :language="currentLang"
        :lsp-connected="lsp.lspConnected.value"
        :show-lsp="!!api?.lspServerUrl"
        :loading="fileApi.loading.value"
        :saving="fileApi.saving.value"
        :console-visible="consoleVisible"
        @toggle-console="consoleVisible = !consoleVisible"
    />

    <!-- 模块选择弹窗（加载/保存共用） -->
    <div v-if="moduleDialogVisible" class="sh-module-dialog-overlay" @click.self="cancelModuleDialog">
      <div class="sh-module-dialog">
        <div class="sh-module-dialog-header">
          <span class="sh-module-dialog-title">{{ moduleDialogTitle }}</span>
          <button class="sh-module-dialog-close" @click="cancelModuleDialog">&times;</button>
        </div>
        <div class="sh-module-dialog-body">
          <!-- 搜索框 -->
          <div class="sh-module-search">
            <input
                v-model="moduleSearchKeyword"
                type="text"
                class="sh-module-search-input"
                :placeholder="i18n('ide.module.searchPlaceholder')"
                @keydown.enter="confirmModuleAction"
            />
          </div>
          <!-- 加载中 -->
          <div v-if="moduleListLoading" class="sh-module-loading">
            <span>{{ i18n('ide.status.loading') }}</span>
          </div>
          <!-- 模块列表 -->
          <div v-else class="sh-module-list">
            <div
                v-for="item in filteredModuleList"
                :key="item.idCodeModule"
                class="sh-module-item"
                :class="{ active: selectedModuleId === item.idCodeModule }"
                @click="selectedModuleId = item.idCodeModule; showCreateForm = false"
                @dblclick="confirmModuleAction"
            >
              <div class="sh-module-item-name">{{ item.name }}</div>
              <div v-if="item.description" class="sh-module-item-desc">{{ item.description }}</div>
            </div>
            <div v-if="filteredModuleList.length === 0 && !showCreateForm" class="sh-module-empty">
              {{ i18n('ide.module.noMatch') }}
            </div>
          </div>
          <!-- 新建模块表单（仅保存模式） -->
          <div v-if="moduleDialogMode === 'save' && resolvedApi.createModuleUrl" class="sh-module-create-section">
            <button class="sh-module-toggle-create" @click="toggleCreateForm">
              {{
                showCreateForm ? ('▾ ' + i18n('ide.module.collapseCreate')) : ('▸ ' + i18n('ide.module.toggleCreate'))
              }}
            </button>
            <div v-if="showCreateForm" class="sh-module-create-form">
              <input
                  v-model="newModuleName"
                  type="text"
                  class="sh-module-create-input"
                  :placeholder="i18n('ide.module.namePlaceholder')"
              />
              <input
                  v-model="newModuleDesc"
                  type="text"
                  class="sh-module-create-input"
                  :placeholder="i18n('ide.module.descPlaceholder')"
              />
              <button
                  class="sh-module-btn sh-module-btn-confirm sh-module-btn-create"
                  :disabled="!newModuleName.trim() || moduleDialogLoading"
                  @click="createModuleAndSave"
              >
                {{ moduleDialogLoading ? i18n('ide.module.creating') : i18n('ide.module.createAndSave') }}
              </button>
            </div>
          </div>
        </div>
        <div class="sh-module-dialog-footer">
          <button class="sh-module-btn sh-module-btn-cancel" @click="cancelModuleDialog">{{
              i18n('ide.module.cancel')
            }}
          </button>
          <button
              v-if="!showCreateForm"
              class="sh-module-btn sh-module-btn-confirm"
              :disabled="!selectedModuleId"
              @click="confirmModuleAction"
          >
            {{ moduleDialogMode === 'load' ? i18n('ide.module.confirmLoad') : i18n('ide.module.confirmSave') }}
          </button>
        </div>
      </div>
    </div>

    <!-- API配置弹窗 -->
    <ApiConfigDialog
        v-model:visible="apiConfigDialogVisible"
        :config="localConfig"
        :resolved-config="resolvedApi"
        :theme-vars="themeVars"
        @save="updateConfig"
        @reset="resetConfig"
    />

    <!-- Diff/冲突解决编辑器（独立弹层） -->
    <Teleport to="body">
      <Transition name="diff-fade">
        <div v-if="diffEditorVisible" class="sh-diff-dialog-overlay" @click.self="handleDiffClose">
          <div class="sh-diff-dialog" :class="{ 'sh-diff-dialog--dark': currentTheme === 'vs-dark' || currentTheme === 'hc-black' }">
            <!-- 弹窗头部 -->
            <div class="sh-diff-dialog__header">
              <div class="sh-diff-dialog__header-left">
                <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" class="sh-diff-dialog__icon">
                  <path d="M1.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V8a.5.5 0 0 0-1 0v5.5H2V2h5.5a.5.5 0 0 0 0-1h-6zm9 0a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .354-.854l-4-4A.5.5 0 0 0 10.5 1zM11 2.707 13.293 5H11V2.707z"/>
                  <path d="M4 6.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z"/>
                </svg>
                <span class="sh-diff-dialog__title">{{ diffTitle || i18n('diff.title') }}</span>
              </div>
              <div class="sh-diff-dialog__header-right">
                <!-- 先审阅模式的文件导航 -->
                <template v-if="isPreSaveReview && preSaveDiffFiles.length > 1">
                  <button
                    class="sh-diff-dialog__nav-btn"
                    :disabled="currentDiffFileIndex <= 0"
                    :title="i18n('ide.save.prevConflictFile')"
                    @click="openPreSaveDiffFile(currentDiffFileIndex - 1)"
                  >
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>
                  </button>
                  <span class="sh-diff-dialog__progress">
                    {{ i18n('ide.save.diffFileProgress', currentDiffFileIndex + 1, preSaveDiffFiles.length) }}
                  </span>
                  <button
                    class="sh-diff-dialog__nav-btn"
                    :disabled="currentDiffFileIndex >= preSaveDiffFiles.length - 1"
                    :title="i18n('ide.save.nextConflictFile')"
                    @click="openPreSaveDiffFile(currentDiffFileIndex + 1)"
                  >
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </button>
                  <span class="sh-diff-dialog__sep"/>
                </template>
                <!-- 冲突文件导航（仅在冲突解决模式下显示） -->
                <template v-if="conflictFiles.length > 1">
                  <button
                    class="sh-diff-dialog__nav-btn"
                    :disabled="currentConflictFileIndex <= 0"
                    :title="i18n('ide.save.prevConflictFile')"
                    @click="openConflictFileByIndex(currentConflictFileIndex - 1)"
                  >
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>
                  </button>
                  <span class="sh-diff-dialog__progress">
                    {{ i18n('ide.save.conflictProgress', currentConflictFileIndex + 1, conflictFiles.length) }}
                  </span>
                  <button
                    class="sh-diff-dialog__nav-btn"
                    :disabled="currentConflictFileIndex >= conflictFiles.length - 1"
                    :title="i18n('ide.save.nextConflictFile')"
                    @click="openConflictFileByIndex(currentConflictFileIndex + 1)"
                  >
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </button>
                  <span class="sh-diff-dialog__sep"/>
                </template>
                <!-- 强制提交按钮（冲突解决流程 或 先审阅流程中可见） -->
                <button
                  v-if="pendingConflictInfo || isPreSaveReview"
                  class="sh-diff-dialog__force-btn"
                  :title="i18n('ide.save.forceCommit')"
                  @click="isPreSaveReview ? doPreSaveForceCommit() : doForceCommit()"
                >
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                    <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                  </svg>
                  {{ i18n('ide.save.forceCommit') }}
                </button>
                <button class="sh-diff-dialog__close" :title="i18n('diff.close')" @click="handleDiffClose">
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              </div>
            </div>
            <!-- 冲突提示条 -->
            <div v-if="pendingConflictInfo" class="sh-diff-dialog__conflict-banner">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" class="sh-diff-dialog__warn-icon">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              <span class="sh-diff-dialog__conflict-text">
                {{ i18n('ide.save.conflictDetected', conflictFiles.length, pendingConflictInfo.divergedCommits) }}
              </span>
              <span v-if="pendingConflictInfo.suggestedAction" class="sh-diff-dialog__suggested-action">
                {{ pendingConflictInfo.suggestedAction === 'CONFLICT' ? '⚠️' : pendingConflictInfo.suggestedAction === 'MERGE' ? '🔀' : '⚡' }}
                {{ pendingConflictInfo.suggestedAction }}
              </span>
            </div>
            <!-- DiffEditor 主体 -->
            <div class="sh-diff-dialog__body">
              <StarHorseDiffEditor
                :original="diffOriginal"
                :modified="diffModified"
                :language="diffLanguage"
                :title="diffTitle"
                :original-label="diffOriginalLabel"
                :modified-label="diffModifiedLabel"
                :theme="currentTheme"
                :conflict-mode="diffConflictMode"
                :conflict-markers="diffConflictMarkers"
                height="100%"
                @save="handleDiffSave"
                @close="handleDiffClose"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
//@import "@/components/system/code-editor/styles/editor.scss";

/* ==================== Diff 弹窗 Overlay ==================== */
.sh-diff-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  padding: 24px;
}

.sh-diff-dialog {
  width: 90vw;
  max-width: 1400px;
  height: 85vh;
  max-height: 900px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;

  &--dark {
    background: #1e1e1e;
    border-color: #3c3c3c;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
    color: #ccc;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 48px;
    background: #f3f3f3;
    border-bottom: 1px solid #e0e0e0;
    flex-shrink: 0;

    .sh-diff-dialog--dark & {
      background: #252526;
      border-bottom-color: #3c3c3c;
    }
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  &__icon {
    flex-shrink: 0;
    opacity: 0.6;
    color: #007acc;

    .sh-diff-dialog--dark & {
      color: #4fc1ff;
    }
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #1e1e1e;

    .sh-diff-dialog--dark & {
      color: #ccc;
    }
  }

  &__header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &__nav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 1px solid transparent;
    border-radius: 4px;
    background: none;
    cursor: pointer;
    color: #666;
    transition: all 0.15s ease;

    .sh-diff-dialog--dark & {
      color: #858585;
    }

    &:hover:not(:disabled) {
      background: rgba(0, 122, 204, 0.1);
      color: #007acc;
      border-color: rgba(0, 122, 204, 0.3);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  &__progress {
    font-size: 12px;
    font-weight: 500;
    color: #666;
    white-space: nowrap;
    padding: 0 4px;

    .sh-diff-dialog--dark & {
      color: #858585;
    }
  }

  &__sep {
    width: 1px;
    height: 20px;
    background: #e0e0e0;

    .sh-diff-dialog--dark & {
      background: #3c3c3c;
    }
  }

  &__force-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid rgba(115, 201, 145, 0.4);
    background: rgba(115, 201, 145, 0.1);
    color: #2ea043;
    transition: all 0.15s ease;
    white-space: nowrap;

    .sh-diff-dialog--dark & {
      color: #73c991;
    }

    &:hover {
      background: rgba(115, 201, 145, 0.2);
      border-color: rgba(115, 201, 145, 0.6);
    }
  }

  &__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    background: none;
    cursor: pointer;
    color: #666;
    transition: all 0.15s ease;

    .sh-diff-dialog--dark & {
      color: #858585;
    }

    &:hover {
      background: rgba(241, 76, 76, 0.1);
      color: #f14c4c;
    }
  }

  &__conflict-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(255, 166, 0, 0.08);
    border-bottom: 1px solid rgba(255, 166, 0, 0.2);
    flex-shrink: 0;

    .sh-diff-dialog--dark & {
      background: rgba(204, 167, 0, 0.1);
      border-bottom-color: rgba(204, 167, 0, 0.3);
    }
  }

  &__warn-icon {
    color: #e5a00d;
    flex-shrink: 0;
  }

  &__conflict-text {
    font-size: 12px;
    color: #b38600;
    flex: 1;

    .sh-diff-dialog--dark & {
      color: #cca700;
    }
  }

  &__suggested-action {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 3px;
    background: rgba(204, 167, 0, 0.15);
    color: #b38600;
    white-space: nowrap;

    .sh-diff-dialog--dark & {
      background: rgba(204, 167, 0, 0.2);
      color: #cca700;
    }
  }

  &__body {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
}

/* ==================== Diff 弹窗过渡动画 ==================== */
.diff-fade-enter-active,
.diff-fade-leave-active {
  transition: opacity 0.2s ease;

  .sh-diff-dialog {
    transition: transform 0.2s ease, opacity 0.2s ease;
  }
}

.diff-fade-enter-from,
.diff-fade-leave-to {
  opacity: 0;

  .sh-diff-dialog {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
}
</style>
