<script setup lang="ts" name="StarHorseCodeEditor">
import {computed, nextTick, onBeforeUnmount, onMounted, PropType, ref, shallowRef, toRaw, watch} from "vue";
import * as monaco from "monaco-editor";
import type {FileNode, MenuItemDef, TabInfo} from "./code-editor/types";
import {detectLanguage, COMPILABLE_LANGUAGES, RUNNABLE_LANGUAGES, DEFAULT_TEMPLATES, deriveJavaPackage, deriveClassName, getFileExt, type IdeApiConfig} from "./code-editor/constants";

const IDE_THEMES = [
  { value: "vs", name: "Light" },
  { value: "vs-dark", name: "Dark" },
  { value: "hc-black", name: "High Contrast" },
];
import {applyThemeVars} from "./code-editor/theme";
import {useLsp} from "./code-editor/useLsp";
import {useFileTree} from "./code-editor/useFileTree";
import {useFileApi} from "./code-editor/useFileApi";
import {getRequest, postRequest} from "@/api/star_horse_apis";
import {error as errorMsg, operationConfirm, success, warning} from "@/utils/message";
import {i18n} from "@/lang/index";
import MenuBar from "./code-editor/MenuBar.vue";
import ActivityBar from "./code-editor/ActivityBar.vue";
import TabBar from "./code-editor/TabBar.vue";
import StatusBar from "./code-editor/StatusBar.vue";
import FileTreeNode from "./code-editor/FileTreeNode.vue";
import type {ContextMenuItem} from "./code-editor/ContextMenu.vue";
import ContextMenu from "./code-editor/ContextMenu.vue";
import ConsolePanel from "./code-editor/ConsolePanel.vue";
import type {ConsoleLine} from "./code-editor/ConsolePanel.vue";

// ==================== Props & Emits ====================
const props = defineProps({
  files: {type: Array as PropType<FileNode[]>, default: () => []},
  menuItems: {type: Array as PropType<MenuItemDef[]>, default: () => []},
  theme: {type: String, default: "vs"},
  readOnly: {type: Boolean, default: false},
  lspServerUrl: {type: String, default: ""},
  /** API接口配置对象，统一管理所有后端接口地址 */
  api: {type: Object as PropType<IdeApiConfig>, default: () => ({})},
  /** @deprecated 使用 api.loadUrl 代替 */
  loadUrl: {type: String, default: ""},
  /** @deprecated 使用 api.saveUrl 代替 */
  saveUrl: {type: String, default: ""},
  /** @deprecated 使用 api.createModuleUrl 代替 */
  moduleListUrl: {type: String, default: ""},
  /** @deprecated 使用 api.createModuleUrl 代替 */
  createModuleUrl: {type: String, default: ""},
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
  /** @deprecated 使用 api.compileUrl 代替 */
  compileUrl: {type: String, default: ""},
  /** @deprecated 使用 api.runUrl 代替 */
  runUrl: {type: String, default: ""},
});
const emit = defineEmits([
  "file-open", "file-save", "file-close", "file-create", "file-delete",
  "file-rename", "folder-create", "menu-action", "change",
  "lspConnected", "lspDisconnected", "tree-change",
  "load-complete", "save-complete", "drop",
  "compile", "run",
]);

// ==================== 兼容旧 props 的 API 解析 ====================
const resolvedApi = computed<IdeApiConfig>(() => ({
  loadUrl: props.api.loadUrl || props.loadUrl,
  saveUrl: props.api.saveUrl || props.saveUrl,
  compileUrl: props.api.compileUrl || props.compileUrl,
  runUrl: props.api.runUrl || props.runUrl,
  templateUrl: props.api.templateUrl,
  templateLoadUrl: props.api.templateLoadUrl,
  compileRegisterUrl: props.api.compileRegisterUrl,
  unregisterUrl: props.api.unregisterUrl,
  unregisterAllUrl: props.api.unregisterAllUrl,
  registeredListUrl: props.api.registeredListUrl,
  sourceCodeUrl: props.api.sourceCodeUrl,
  draftSaveUrl: props.api.draftSaveUrl,
  draftListUrl: props.api.draftListUrl,
  draftSourceUrl: props.api.draftSourceUrl,
  healthCheckUrl: props.api.healthCheckUrl,
  executeUrl: props.api.executeUrl,
  createModuleUrl: props.api.createModuleUrl || props.createModuleUrl,
}));

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
/** 跟踪已修改的文件ID（编辑过但未保存的） */
const modifiedFiles = ref<Set<string>>(new Set());

// ==================== 可配置设置（运行时） ====================
const currentFontSize = ref(props.fontSize);
const currentMinimap = ref(props.minimap);
const currentWordWrap = ref<"on" | "off">("on");
const currentTabSize = ref(4);
const searchQuery = ref("");
const searchResults = ref<{idCodeFile: string; name: string; line: number; text: string; path: string}[]>([]);

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
const openSearchResult = (result: {idCodeFile: string; line: number}) => {
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
interface ModuleItem {
  idCodeModule: string;
  name: string;
  description?: string;

  [key: string]: any;
}

type DialogMode = "load" | "save";

const moduleDialogVisible = ref(false);
const moduleDialogMode = ref<DialogMode>("load");
const moduleList = ref<ModuleItem[]>([]);
const selectedModuleId = ref("");
const moduleListLoading = ref(false);
const moduleSearchKeyword = ref("");
const moduleDialogLoading = ref(false);

/** 新建模块表单 */
const showCreateForm = ref(false);
const newModuleName = ref("");
const newModuleDesc = ref("");

/** 过滤后的模块列表 */
const filteredModuleList = computed(() => {
  const kw = moduleSearchKeyword.value.trim().toLowerCase();
  if (!kw) return moduleList.value;
  return moduleList.value.filter(
      (m) => m.name.toLowerCase().includes(kw) || (m.description || "").toLowerCase().includes(kw),
  );
});

/** 弹窗标题 */
const moduleDialogTitle = computed(() => {
  return moduleDialogMode.value === "load" ? i18n("ide.module.selectLoad") : i18n("ide.module.selectSave");
});

/** 获取模块列表 */
const fetchModuleList = async (): Promise<ModuleItem[]> => {
  if (!resolvedApi.value.createModuleUrl && !resolvedApi.value.loadUrl) return [];
  moduleListLoading.value = true;
  try {
    const res: any = await getRequest(resolvedApi.value.loadUrl || resolvedApi.value.createModuleUrl!);
    const data = res?.data;
    if (data?.code === 0 && Array.isArray(data?.data)) {
      return data.data as ModuleItem[];
    }
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    warning(data?.cnMessage || i18n("ide.module.fetchFailed"));
    return [];
  } catch (err: any) {
    errorMsg(err?.message || i18n("ide.load.requestError"));
    return [];
  } finally {
    moduleListLoading.value = false;
  }
};

/** 打开模块弹窗 */
const openModuleDialog = async (mode: DialogMode = "load") => {
  moduleDialogMode.value = mode;
  moduleSearchKeyword.value = "";
  selectedModuleId.value = "";
  showCreateForm.value = false;
  newModuleName.value = "";
  newModuleDesc.value = "";
  moduleList.value = await fetchModuleList();
  if (moduleList.value.length === 0 && !resolvedApi.value.loadUrl) {
    // 没有配置 moduleListUrl，直接走无参加载
    if (mode === "load") doLoadFromServer();
    return;
  }
  moduleDialogVisible.value = true;
};

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

/** 取消模块选择 */
const cancelModuleDialog = () => {
  moduleDialogVisible.value = false;
  selectedModuleId.value = "";
  showCreateForm.value = false;
};

/** 创建新模块并保存 */
const createModuleAndSave = async () => {
  if (!newModuleName.value.trim()) {
    warning(i18n("ide.module.enterName"));
    return;
  }
  if (!resolvedApi.value.createModuleUrl) {
    warning(i18n("ide.module.noCreateUrl"));
    return;
  }
  moduleDialogLoading.value = true;
  try {
    const res: any = await postRequest(resolvedApi.value.createModuleUrl!, {
      name: newModuleName.value.trim(),
      description: newModuleDesc.value.trim(),
    });
    const data = res?.data;
    if (data?.code === 0 && data?.data) {
      const newModule = data.data as ModuleItem;
      // 使用新创建的模块 ID 保存代码
      showCreateForm.value = false;
      moduleDialogVisible.value = false;
      success(i18n("ide.module.createSuccess"));
      await doSaveToServer({item: newModule.idCodeModule, moduleName: newModule.name});
    } else {
      warning(data?.cnMessage || i18n("ide.module.createFailed"));
    }
  } catch (err: any) {
    errorMsg(err?.message || i18n("ide.save.requestError"));
  } finally {
    moduleDialogLoading.value = false;
  }
};

/** 切换显示新建模块表单 */
const toggleCreateForm = () => {
  showCreateForm.value = !showCreateForm.value;
  if (showCreateForm.value) {
    newModuleName.value = "";
    newModuleDesc.value = "";
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
const lspServerUrlRef = computed(() => props.lspServerUrl);
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

// ==================== 菜单定义 ====================
const defaultMenus: MenuItemDef[] = [
  {
    label: i18n("ide.menu.file"),
    children: [
      {label: i18n("ide.menu.file.newFile"), action: "new-file", shortcut: "Ctrl+N"},
      {label: i18n("ide.menu.file.newFolder"), action: "new-folder"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.file.openFile"), action: "open-file", shortcut: "Ctrl+O"},
      {label: i18n("ide.menu.file.openDirectory"), action: "open-directory"},
      {label: i18n("ide.menu.file.loadServer"), action: "load-server"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.file.save"), action: "save", shortcut: "Ctrl+S"},
      {label: i18n("ide.menu.file.saveAll"), action: "save-all", shortcut: "Ctrl+Shift+S"},
      {label: i18n("ide.menu.file.saveServer"), action: "save-server"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.file.closeTab"), action: "close-tab", shortcut: "Ctrl+W"},
      {label: i18n("ide.menu.file.closeAll"), action: "close-all"},
    ],
  },
  {
    label: i18n("ide.menu.edit"),
    children: [
      {label: i18n("ide.menu.edit.undo"), action: "undo", shortcut: "Ctrl+Z"},
      {label: i18n("ide.menu.edit.redo"), action: "redo", shortcut: "Ctrl+Shift+Z"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.edit.cut"), action: "cut", shortcut: "Ctrl+X"},
      {label: i18n("ide.menu.edit.copy"), action: "copy", shortcut: "Ctrl+C"},
      {label: i18n("ide.menu.edit.paste"), action: "paste", shortcut: "Ctrl+V"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.edit.find"), action: "find", shortcut: "Ctrl+F"},
      {label: i18n("ide.menu.edit.replace"), action: "replace", shortcut: "Ctrl+H"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.edit.selectAll"), action: "select-all", shortcut: "Ctrl+A"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.edit.formatDocument"), action: "format-document", shortcut: "Shift+Alt+F"},
    ],
  },
  {
    label: i18n("ide.menu.build"),
    children: [
      {label: i18n("ide.menu.build.compile"), action: "compile", shortcut: "Ctrl+Shift+B"},
      {label: i18n("ide.menu.build.compileRegister"), action: "compile-register"},
      {label: i18n("ide.menu.build.run"), action: "run", shortcut: "Ctrl+F5"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.build.draftSave"), action: "draft-save"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.build.unregisterAll"), action: "unregister-all"},
      {label: i18n("ide.menu.build.healthCheck"), action: "health-check"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.build.console"), action: "toggle-console", shortcut: "Ctrl+`"},
    ],
  },
  {
    label: i18n("ide.menu.view"),
    children: [
      {label: i18n("ide.menu.view.toggleSidebar"), action: "toggle-sidebar", shortcut: "Ctrl+B"},
      {label: i18n("ide.menu.view.toggleMinimap"), action: "toggle-minimap"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.view.zoomIn"), action: "zoom-in", shortcut: "Ctrl+="},
      {label: i18n("ide.menu.view.zoomOut"), action: "zoom-out", shortcut: "Ctrl+-"},
      {label: i18n("ide.menu.view.zoomReset"), action: "zoom-reset", shortcut: "Ctrl+0"},
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
  const { clientX: x, clientY: y } = e;
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
  // Shift+Alt+F 格式化
  if (e.shiftKey && e.altKey && e.key.toLowerCase() === "f") {
    e.preventDefault();
    editor?.getAction("editor.action.formatDocument")?.run();
    return;
  }
  // Ctrl+` 切换控制台
  if ((e.ctrlKey || e.metaKey) && e.key === "`") {
    e.preventDefault();
    consoleVisible.value = !consoleVisible.value;
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
const handleCompactDropSelect = (sourceId: string, targetNodeId: string, chain: { id: string; name: string }[], position: { x: number; y: number }) => {
  const items: ContextMenuItem[] = [];
  // 添加中间目录选项
  for (const ancestor of chain) {
    items.push({ label: i18n("ide.drop.moveTo", ancestor.name), action: `compact-drop::${ancestor.id}` });
  }
  // 添加最底层目录选项
  const targetNode = fileTree.findNode(targetNodeId);
  if (targetNode) {
    items.push({ label: i18n("ide.drop.moveTo", targetNode.name), action: `compact-drop::${targetNodeId}` });
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
  if (resolvedApi.value.loadUrl) {
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
/** 内部执行保存（带参数） */
const doSaveToServer = async (params?: Record<string, any>) => {
  if (!resolvedApi.value.saveUrl) {
    warning(i18n("ide.save.noUrl"));
    return false;
  }
  openTabs.value.forEach(t => {
    const model = monacoModels.get(t.id);
    if (model) {
      fileTree.updateFileContent(t.id, model.getValue());
      t.modified = false;
    }
  });
  // 清除所有修改标记
  modifiedFiles.value = new Set();
  const mergedParams: Record<string, any> = {...props.saveParams, ...params};
  if (props.moduleId) mergedParams.moduleId = props.moduleId;
  const ok = await fileApi.saveToServer(
      fileTree.tree.value,
      Object.keys(mergedParams).length > 0 ? mergedParams : undefined,
  );
  if (ok) {
    success(i18n("ide.save.success"));
    emit("save-complete", fileTree.tree.value);
  } else {
    warning(fileApi.lastError.value || i18n("ide.save.failed"));
  }
  return ok;
};

/** 保存到服务器（公共方法），如果配置了 moduleListUrl 则弹窗选择模块 */
const saveToServer = async () => {
  if (resolvedApi.value.loadUrl) {
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
  const process = (nodes: FileNode[], parentLabel = "", parentChain: { id: string; name: string }[] = []): FileNode[] => {
    const result: FileNode[] = [];
    for (const node of sortNodes(nodes)) {
      if (node.type === "folder" && node.children?.length === 1 && node.children[0].type === "folder") {
        const child = node.children[0];
        const combinedLabel = parentLabel ? parentLabel + "/" + node.name : node.name;
        const newChain = [...parentChain, { id: node.idCodeFile, name: node.name }];
        labels.set(child.idCodeFile, combinedLabel + "/" + child.name);
        chains.set(child.idCodeFile, newChain);
        result.push(...process([child], combinedLabel, newChain));
      } else {
        if (node.children) {
          result.push({ ...node, children: process(node.children) });
        } else {
          result.push(node);
        }
      }
    }
    return result;
  };
  return { nodes: process(nodes), labels, chains };
};

const compactResult = computed(() => compactAndSort(fileTree.tree.value));
const sortedTree = computed(() => compactResult.value.nodes);
const compactLabels = computed(() => compactResult.value.labels);
const compactChains = computed(() => compactResult.value.chains);

// ==================== 控制台 ====================
const consoleVisible = ref(false);
const consoleLines = ref<ConsoleLine[]>([]);
const consoleBusy = ref(false);

/** 当前活动文件是否支持编译或运行 */
const canBuildActive = computed(() => {
  if (!activeTab.value) return false;
  const lang = activeTab.value.language;
  return COMPILABLE_LANGUAGES.has(lang) || RUNNABLE_LANGUAGES.has(lang);
});

const now = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
};

const appendConsole = (type: ConsoleLine["type"], text: string) => {
  consoleLines.value.push({ type, text, time: now() });
};

const clearConsole = () => {
  consoleLines.value = [];
};

/** 获取当前活动文件的源码 */
const getActiveSourceCode = (): string | null => {
  if (!activeTabId.value) return null;
  return fileTree.getFileContent(activeTabId.value) || null;
};

/** 获取当前活动文件的语言 */
const getActiveLanguage = (): string => {
  if (!activeTabId.value) return "";
  const node = fileTree.findNode(activeTabId.value);
  return node?.language || detectLanguage(node?.name || "");
};

/** 获取当前活动文件名 */
const getActiveFileName = (): string => {
  if (!activeTabId.value) return "";
  const node = fileTree.findNode(activeTabId.value);
  return node?.name || "";
};

// ==================== 编译 ====================
const doCompile = async () => {
  const url = resolvedApi.value.compileUrl;
  if (!url) {
    warning(i18n("ide.console.noCompileUrl"));
    return;
  }
  const sourceCode = getActiveSourceCode();
  if (!sourceCode) {
    warning(i18n("ide.console.noActiveFile"));
    return;
  }
  consoleVisible.value = true;
  consoleBusy.value = true;
  appendConsole("info", i18n("ide.console.compileStart", getActiveFileName()));
  try {
    const res = await postRequest(url, {
      sourceCode,
      language: getActiveLanguage(),
      fileName: getActiveFileName(),
    });
    if (res?.data?.success || res?.data?.code === 200) {
      const result = res.data.data || res.data;
      if (result.success) {
        appendConsole("success", i18n("ide.console.compileSuccess"));
        if (result.fullClassName) appendConsole("info", `  class: ${result.fullClassName}`);
        if (result.beanName) appendConsole("info", `  bean: ${result.beanName}`);
      } else {
        appendConsole("error", i18n("ide.console.compileFail"));
        if (result.errorMessage) appendConsole("error", result.errorMessage);
      }
    } else {
      const msg = res?.data?.msg || res?.data?.message || i18n("ide.console.compileFail");
      appendConsole("error", `${i18n("ide.console.compileFail")}: ${msg}`);
    }
  } catch (e: any) {
    appendConsole("error", `${i18n("ide.console.compileFail")}: ${e.message || e}`);
  } finally {
    consoleBusy.value = false;
  }
  emit("compile", fileTree.findNode(activeTabId.value!));
};

// ==================== 运行 ====================
const doRun = async () => {
  const url = resolvedApi.value.runUrl;
  if (!url) {
    warning(i18n("ide.console.noRunUrl"));
    return;
  }
  const sourceCode = getActiveSourceCode();
  if (!sourceCode) {
    warning(i18n("ide.console.noActiveFile"));
    return;
  }
  consoleVisible.value = true;
  consoleBusy.value = true;
  appendConsole("info", i18n("ide.console.runStart", getActiveFileName()));
  try {
    const res = await postRequest(url, {
      sourceCode,
      language: getActiveLanguage(),
      fileName: getActiveFileName(),
      codeId: activeTabId.value,
    });
    if (res?.data?.success || res?.data?.code === 200) {
      const result = res.data.data || res.data;
      if (result.success) {
        appendConsole("success", i18n("ide.console.runSuccess"));
        if (result.result !== undefined && result.result !== null) {
          appendConsole("info", `  ${i18n("ide.console.result")}: ${JSON.stringify(result.result)}`);
        }
      } else {
        appendConsole("error", i18n("ide.console.runFail"));
        if (result.errorMessage) appendConsole("error", result.errorMessage);
      }
    } else {
      const msg = res?.data?.msg || res?.data?.message || i18n("ide.console.runFail");
      appendConsole("error", `${i18n("ide.console.runFail")}: ${msg}`);
    }
  } catch (e: any) {
    appendConsole("error", `${i18n("ide.console.runFail")}: ${e.message || e}`);
  } finally {
    consoleBusy.value = false;
  }
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
  if (props.lspServerUrl) lsp.connectLsp(currentLang.value);
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
});

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
      :class="{ 'ide-drop-zone': fileDragOver }"
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
            {{
              activePanel === 'explorer' ? i18n('ide.sidebar.explorer') : activePanel === 'search' ? i18n('ide.sidebar.search') : i18n('ide.sidebar.settings')
            }}
          </span>
          <template v-if="activePanel === 'explorer'">
            <button class="sidebar-btn" :title="i18n('ide.ctx.newFile')" @click="handleNewFile(null)">📄+</button>
            <button class="sidebar-btn" :title="i18n('ide.ctx.newFolder')" @click="handleNewFolder(null)">📁+</button>
          </template>
          <button class="sidebar-btn sidebar-close-btn" :title="i18n('ide.sidebar.hideHint')" @click="sidebarVisible = false">✕</button>
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
                <span v-if="searchQuery" class="search-clear" @click="searchQuery = ''; searchResults = []">&times;</span>
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
                <select class="setting-select" :value="currentTheme" @change="switchTheme(($event.target as HTMLSelectElement).value)">
                  <option v-for="t in IDE_THEMES" :key="t.value" :value="t.value">{{ t.name }}</option>
                </select>
              </div>
              <!-- 字体大小 -->
              <div class="setting-group">
                <label class="setting-label">{{ i18n('ide.settings.fontSize') }}</label>
                <div class="setting-number">
                  <button class="setting-btn" @click="currentFontSize = Math.max(10, currentFontSize - 1); applyEditorSettings()">−</button>
                  <span class="setting-value">{{ currentFontSize }}px</span>
                  <button class="setting-btn" @click="currentFontSize = Math.min(28, currentFontSize + 1); applyEditorSettings()">+</button>
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
                  >{{ size }}</button>
                </div>
              </div>
              <!-- 自动换行 -->
              <div class="setting-group">
                <label class="setting-label">自动换行</label>
                <label class="setting-toggle">
                  <input type="checkbox" :checked="currentWordWrap === 'on'" @change="currentWordWrap = currentWordWrap === 'on' ? 'off' : 'on'; applyEditorSettings()"/>
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <!-- 小地图 -->
              <div class="setting-group">
                <label class="setting-label">小地图</label>
                <label class="setting-toggle">
                  <input type="checkbox" :checked="currentMinimap" @change="currentMinimap = !currentMinimap; applyEditorSettings()"/>
                  <span class="toggle-slider"></span>
                </label>
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
            <button v-if="COMPILABLE_LANGUAGES.has(activeTab.language)" class="breadcrumb-btn compile-btn" :title="i18n('ide.menu.build.compile')" :disabled="consoleBusy" @click="doCompile">▶</button>
            <button v-if="RUNNABLE_LANGUAGES.has(activeTab.language)" class="breadcrumb-btn run-btn" :title="i18n('ide.menu.build.run')" :disabled="consoleBusy" @click="doRun">►</button>
          </div>
        </div>
        <!-- Monaco 编辑器 -->
        <div ref="editorContainer" class="sh-ide-monaco" v-show="openTabs.length > 0"/>
        <!-- 欢迎页 -->
        <div v-if="openTabs.length === 0" class="sh-ide-welcome">
          <div class="welcome-icon">
            <svg viewBox="0 0 100 100" width="80" height="80" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
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
        :show-lsp="!!lspServerUrl"
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
                :key="item.id"
                class="sh-module-item"
                :class="{ active: selectedModuleId === item.id }"
                @click="selectedModuleId = item.id; showCreateForm = false"
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
  </div>
</template>

<style lang="scss" scoped>
.sh-ide {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ide-border, #3c3c3c);
  border-radius: 4px;
  overflow: hidden;
  background: var(--ide-bg, #1e1e1e);
  color: var(--ide-fg, #cccccc);
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 13px;

  &.ide-drop-zone {
    border-color: var(--ide-accent, #007acc);
    box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--ide-accent, #007acc) 25%, transparent);
  }
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

.sidebar-title {
  flex: 1;
}

.sidebar-btn {
  background: none;
  border: none;
  color: var(--ide-fg-dim, #858585);
  cursor: pointer;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
  line-height: 1;

  &:hover {
    background: var(--ide-bg-hover, #2a2d2e);
    color: var(--ide-fg, #ccc);
  }
}

.sidebar-close-btn {
  font-size: 14px;
  padding: 2px 5px;
  opacity: 0.6;

  &:hover {
    opacity: 1;
    color: var(--ide-fg, #ccc);
  }
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

  p {
    margin: 0;
  }
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

  &:hover {
    background: var(--ide-accent, #007acc);
    border-color: var(--ide-accent, #007acc);
  }
}

.sidebar-hint {
  font-size: 12px;
  font-style: italic;
  opacity: 0.7;
}

// ==================== 搜索面板样式 ====================
.sidebar-search {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.search-input-wrap {
  padding: 8px;
  position: relative;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  padding: 6px 28px 6px 10px;
  background: var(--ide-bg, #1e1e1e);
  border: 1px solid var(--ide-border, #3c3c3c);
  border-radius: 4px;
  color: var(--ide-fg, #ccc);
  font-size: 13px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: var(--ide-accent, #007acc);
  }

  &::placeholder {
    color: var(--ide-fg-dim, #858585);
  }
}

.search-clear {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--ide-fg-dim, #858585);
  font-size: 16px;
  line-height: 1;

  &:hover {
    color: var(--ide-fg, #ccc);
  }
}

.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 0 4px;
}

.search-empty {
  padding: 16px;
  text-align: center;
  color: var(--ide-fg-dim, #858585);
  font-size: 12px;
}

.search-result-item {
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 2px;

  &:hover {
    background: var(--ide-bg-hover, #2a2d2e);
  }
}

.search-result-file {
  color: var(--ide-fg, #ccc);
  display: flex;
  align-items: center;
  gap: 4px;
}

.search-result-icon {
  font-size: 11px;
}

.search-result-line {
  color: var(--ide-accent, #007acc);
  font-size: 11px;
}

.search-result-text {
  color: var(--ide-fg-dim, #858585);
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
  padding-left: 18px;
}

.search-result-path {
  color: var(--ide-fg-dim, #858585);
  font-size: 10px;
  opacity: 0.6;
  padding-left: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-count {
  padding: 6px 8px;
  font-size: 11px;
  color: var(--ide-fg-dim, #858585);
  text-align: center;
  border-top: 1px solid var(--ide-border, #3c3c3c);
  margin-top: 4px;
}

// ==================== 设置面板样式 ====================
.sidebar-settings {
  padding: 8px;
}

.setting-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px;
  border-bottom: 1px solid var(--ide-border, #3c3c3c);

  &:last-child {
    border-bottom: none;
  }
}

.setting-label {
  font-size: 12px;
  color: var(--ide-fg, #ccc);
  flex-shrink: 0;
}

.setting-select {
  background: var(--ide-bg, #1e1e1e);
  border: 1px solid var(--ide-border, #3c3c3c);
  color: var(--ide-fg, #ccc);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--ide-accent, #007acc);
  }
}

.setting-number {
  display: flex;
  align-items: center;
  gap: 4px;
}

.setting-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ide-bg-hover, #2a2d2e);
  border: 1px solid var(--ide-border, #3c3c3c);
  color: var(--ide-fg, #ccc);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;

  &:hover {
    background: var(--ide-accent, #007acc);
    border-color: var(--ide-accent, #007acc);
  }
}

.setting-value {
  min-width: 36px;
  text-align: center;
  font-size: 12px;
  color: var(--ide-fg, #ccc);
}

.setting-tabs {
  display: flex;
  gap: 2px;
}

.setting-tab-btn {
  width: 28px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ide-bg-hover, #2a2d2e);
  border: 1px solid var(--ide-border, #3c3c3c);
  color: var(--ide-fg, #ccc);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &.active {
    background: var(--ide-accent, #007acc);
    border-color: var(--ide-accent, #007acc);
    color: #fff;
  }

  &:hover:not(.active) {
    border-color: var(--ide-accent, #007acc);
  }
}

.setting-toggle {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  cursor: pointer;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background: var(--ide-bg-hover, #2a2d2e);
  border: 1px solid var(--ide-border, #3c3c3c);
  border-radius: 10px;
  transition: 0.2s;

  &::before {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    left: 2px;
    top: 2px;
    background: var(--ide-fg-dim, #858585);
    border-radius: 50%;
    transition: 0.2s;
  }
}

.setting-toggle input:checked + .toggle-slider {
  background: var(--ide-accent, #007acc);
  border-color: var(--ide-accent, #007acc);

  &::before {
    transform: translateX(16px);
    background: #fff;
  }
}

.sidebar-resize {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  z-index: 10;

  &:hover {
    background: var(--ide-accent, #007acc);
  }
}

.sh-ide-editor {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.editor-drop-overlay {
  position: absolute;
  inset: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--ide-accent, #007acc) 12%, transparent);
  border: 2px dashed var(--ide-accent, #007acc);
  border-radius: 8px;
  color: var(--ide-accent, #007acc);
  font-size: 18px;
  font-weight: 500;
  z-index: 50;
  pointer-events: none;
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

.breadcrumb-path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ide-fg, #cccccc);
}

.breadcrumb-lang {
  font-size: 11px;
  opacity: 0.6;
  flex-shrink: 0;
}

.breadcrumb-actions {
  margin-left: auto;
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.breadcrumb-btn {
  background: none;
  border: 1px solid var(--ide-border, #3c3c3c);
  color: var(--ide-fg, #cccccc);
  cursor: pointer;
  font-size: 12px;
  padding: 1px 8px;
  border-radius: 3px;
  line-height: 1.4;
}
.breadcrumb-btn:hover:not(:disabled) {
  background: var(--ide-hover, #2a2d2e);
}
.breadcrumb-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.compile-btn {
  color: var(--ide-accent, #007acc);
  border-color: var(--ide-accent, #007acc);
}
.run-btn {
  color: #89d185;
  border-color: #89d185;
}

.sh-ide-monaco {
  flex: 1;
  min-height: 0;
}

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

.welcome-icon {
  margin-bottom: 12px;
  opacity: 0.5;
  color: var(--ide-fg-dim, #858585);
}

.sh-ide-welcome h2 {
  color: var(--ide-fg, #cccccc);
  font-weight: 400;
  margin: 0;
}

.sh-ide-welcome p {
  margin: 0;
}

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

  &:hover {
    background: var(--ide-accent, #007acc);
    border-color: var(--ide-accent, #007acc);
  }
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

/* ==================== 模块弹窗（scoped，跟随主题变量） ==================== */
.sh-module-dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
}

.sh-module-dialog {
  background: var(--ide-bg-secondary, #252526);
  border: 1px solid var(--ide-border, #3c3c3c);
  border-radius: 6px;
  width: 480px;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px var(--ide-dropdown-shadow, rgba(0, 0, 0, 0.4));
  color: var(--ide-fg, #cccccc);
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.sh-module-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--ide-border, #3c3c3c);
  flex-shrink: 0;
}

.sh-module-dialog-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ide-fg, #cccccc);
}

.sh-module-dialog-close {
  background: none;
  border: none;
  color: var(--ide-fg-dim, #858585);
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;

  &:hover {
    color: var(--ide-fg, #cccccc);
  }
}

.sh-module-dialog-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
}

.sh-module-search {
  margin-bottom: 10px;
  flex-shrink: 0;
}

.sh-module-search-input {
  width: 100%;
  padding: 7px 10px;
  background: var(--ide-bg-input, #3c3c3c);
  border: 1px solid var(--ide-border, #5a5a5a);
  border-radius: 4px;
  color: var(--ide-fg, #cccccc);
  font-size: 13px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: var(--ide-accent, #007acc);
  }

  &::placeholder {
    color: var(--ide-fg-dim, #858585);
  }
}

.sh-module-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ide-fg-dim, #858585);
  font-size: 13px;
  min-height: 120px;
}

.sh-module-list {
  flex: 1;
  overflow-y: auto;
  border: 1px solid var(--ide-border, #3c3c3c);
  border-radius: 4px;
  background: var(--ide-bg, #1e1e1e);
}

.sh-module-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--ide-bg-tertiary, #2d2d2d);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--ide-bg-hover, #2a2d2e);
  }

  &.active {
    background: #094771;
    border-color: #094771;

    .sh-module-item-name {
      color: #ffffff;
    }

    .sh-module-item-desc {
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

.sh-module-item-name {
  font-size: 13px;
  color: var(--ide-fg, #cccccc);
  font-weight: 500;
}

.sh-module-item-desc {
  font-size: 12px;
  color: var(--ide-fg-dim, #858585);
  margin-top: 2px;
}

.sh-module-empty {
  padding: 24px 12px;
  text-align: center;
  color: var(--ide-fg-dim, #858585);
  font-size: 13px;
}

.sh-module-create-section {
  margin-top: 10px;
  border-top: 1px solid var(--ide-border, #3c3c3c);
  padding-top: 10px;
  flex-shrink: 0;
}

.sh-module-toggle-create {
  background: none;
  border: none;
  color: var(--ide-accent, #007acc);
  cursor: pointer;
  font-size: 13px;
  padding: 4px 0;

  &:hover {
    color: var(--ide-accent-hover, #1a8cdb);
    text-decoration: underline;
  }
}

.sh-module-create-form {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sh-module-create-input {
  width: 100%;
  padding: 7px 10px;
  background: var(--ide-bg-input, #3c3c3c);
  border: 1px solid var(--ide-border, #5a5a5a);
  border-radius: 4px;
  color: var(--ide-fg, #cccccc);
  font-size: 13px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: var(--ide-accent, #007acc);
  }

  &::placeholder {
    color: var(--ide-fg-dim, #858585);
  }
}

.sh-module-btn-create {
  align-self: flex-start;
  padding: 6px 20px;
}

.sh-module-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--ide-border, #3c3c3c);
  flex-shrink: 0;
}

.sh-module-btn {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid var(--ide-border, #3c3c3c);
  transition: background 0.15s;
}

.sh-module-btn-cancel {
  background: var(--ide-bg-tertiary, #3c3c3c);
  color: var(--ide-fg, #cccccc);

  &:hover {
    background: var(--ide-bg-hover, #505050);
  }
}

.sh-module-btn-confirm {
  background: var(--ide-accent, #007acc);
  border-color: var(--ide-accent, #007acc);
  color: #ffffff;

  &:hover:not(:disabled) {
    background: var(--ide-accent-hover, #1a8cdb);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
