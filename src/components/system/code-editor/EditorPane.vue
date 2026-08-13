<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toRaw,
  watch,
} from "vue";
import * as monaco from "monaco-editor";
import type { DropZone, SplitSide, TabDragPayload, TabInfo } from "./types";
import { getFileIcon } from "./constants";
import { i18n } from "@/lang/index";

interface EditorPaneApi {
  // Tab actions
  switchTab: (gid: string, tabId: string) => void;
  closeTab: (gid: string, tabId: string) => void;
  contextmenuTab: (gid: string, tabId: string, e: MouseEvent) => void;
  closeOthers: (gid: string, tabId: string) => void;
  // Split actions
  split: (gid: string, side: SplitSide, tabId?: string) => void;
  closeGroup: (gid: string) => void;
  canCloseGroup: (gid: string) => boolean;
  moveTabToGroup: (gid: string, tabId: string, dir: "next" | "prev") => void;
  // Editor lifecycle
  editorReady: (
    gid: string,
    editor: monaco.editor.IStandaloneCodeEditor,
  ) => void;
  editorFocus: (gid: string) => void;
  editorDispose: (gid: string) => void;
  editorCursorChange: (gid: string, line: number, col: number) => void;
  editorContentChange: (gid: string, tabId: string, content: string) => void;
  // Drop handling
  handleDrop: (toGid: string, payload: TabDragPayload, zone: DropZone) => void;
  // Model access
  getModel: (tabId: string) => monaco.editor.ITextModel | undefined;
  // Settings
  applySettings: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  /** 当前是否有 tab 正在被拖拽（用于显示 drop zones） */
  draggingTab: () => TabDragPayload | null;
  /** 设置拖拽状态（拖拽开始/结束时调用） */
  setDraggingTab: (payload: TabDragPayload | null) => void;
}

const props = defineProps<{
  groupId: string;
  tabs: TabInfo[];
  activeTabId: string;
  theme: string;
  isActive: boolean;
  breadcrumbPath: string;
  canCompile: boolean;
  canRun: boolean;
  languageLabel: string;
}>();

const emit = defineEmits<{
  compile: [];
  run: [];
}>();

const api = inject<EditorPaneApi>("editorPaneApi")!;

const editorContainer = ref<HTMLElement>();
const editorInstance = shallowRef<monaco.editor.IStandaloneCodeEditor>();

// 拖拽状态：当有 tab 被拖拽时，显示 drop zones
// draggingTab 是全局共享状态（来自 api），currentDropZone 是本 pane 的当前放置区域
const currentDropZone = ref<DropZone | null>(null);
/** 当前是否有任意 tab 被拖拽 */
const isDragging = computed(() => !!api.draggingTab());

// ============== 工具 ==============
/** 检测哪些 tab 存在同名冲突，需要显示路径 */
const needsPath = computed(() => {
  const counts = new Map<string, number>();
  for (const tab of props.tabs) {
    counts.set(tab.name, (counts.get(tab.name) || 0) + 1);
  }
  return counts;
});

const shouldShowPath = (tab: TabInfo) => {
  return (needsPath.value.get(tab.name) || 0) > 1 && !!tab.path;
};

const activeTab = computed(
  () => props.tabs.find((t) => t.id === props.activeTabId) || null,
);

const hasTabs = computed(() => props.tabs.length > 0);
/** 当前组是否可以关闭（非最后一组） */
const canClose = computed(() => api.canCloseGroup(props.groupId));

// ============== 编辑器初始化 ==============
const initEditor = async () => {
  await nextTick();
  if (!editorContainer.value) return;
  if (editorInstance.value) {
    toRaw(editorInstance.value).dispose();
    editorInstance.value = undefined;
  }
  const editor = monaco.editor.create(editorContainer.value, {
    value: "",
    language: "plaintext",
    theme: props.theme,
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
  api.applySettings(editor);
  api.editorReady(props.groupId, editor);

  editor.onDidChangeCursorPosition((e) => {
    api.editorCursorChange(
      props.groupId,
      e.position.lineNumber,
      e.position.column,
    );
  });

  editor.onDidChangeModelContent(() => {
    if (props.activeTabId) {
      api.editorContentChange(
        props.groupId,
        props.activeTabId,
        editor.getValue(),
      );
    }
  });

  editor.onDidFocusEditorText(() => {
    api.editorFocus(props.groupId);
  });

  // 同步当前 tab 的 model
  syncActiveModel();
};

/** 同步当前激活 tab 的 model 到编辑器 */
const syncActiveModel = () => {
  const editor = toRaw(editorInstance.value);
  if (!editor) return;
  if (props.activeTabId) {
    const model = api.getModel(props.activeTabId);
    if (model) {
      editor.setModel(model);
    } else {
      const empty = monaco.editor.createModel("", "plaintext");
      editor.setModel(empty);
    }
  } else {
    const empty = monaco.editor.createModel("", "plaintext");
    editor.setModel(empty);
  }
};

// ============== 事件处理 ==============
const handleSwitch = (tabId: string) => {
  api.switchTab(props.groupId, tabId);
};

const handleClose = (tabId: string) => {
  api.closeTab(props.groupId, tabId);
};

const handleContextmenu = (tabId: string, e: MouseEvent) => {
  e.preventDefault();
  api.contextmenuTab(props.groupId, tabId, e);
};

const handleSplit = (side: SplitSide) => {
  api.split(props.groupId, side, props.activeTabId);
};

const handleCloseGroup = () => {
  api.closeGroup(props.groupId);
};

// ============== Tab 拖拽 ==============
const onTabDragStart = (e: DragEvent, tabId: string) => {
  if (!e.dataTransfer) return;
  const payload: TabDragPayload = {
    type: "tab",
    fromGroupId: props.groupId,
    tabId,
  };
  e.dataTransfer.setData("application/json", JSON.stringify(payload));
  e.dataTransfer.effectAllowed = "move";
  // 设置全局拖拽状态（所有 pane 都能看到）
  api.setDraggingTab(payload);
  // 拖拽时给一个透明的拖拽影像
  const ghost = document.createElement("div");
  ghost.style.position = "absolute";
  ghost.style.top = "-9999px";
  ghost.style.padding = "4px 12px";
  ghost.style.background = "var(--ide-dropdown-bg, #252526)";
  ghost.style.color = "var(--ide-fg, #ccc)";
  ghost.style.border = "1px solid var(--ide-border, #3c3c3c)";
  ghost.style.borderRadius = "4px";
  ghost.style.fontSize = "12px";
  const tab = props.tabs.find((t) => t.id === tabId);
  ghost.textContent = (tab && getFileIcon(tab.name)) + " " + (tab?.name || "");
  document.body.appendChild(ghost);
  e.dataTransfer.setDragImage(ghost, 0, 0);
  setTimeout(() => document.body.removeChild(ghost), 0);
};

const onTabDragEnd = () => {
  api.setDraggingTab(null);
  currentDropZone.value = null;
};

// ============== Drop zone 计算 ==============
const DROP_EDGE_SIZE = 60; // px，边缘触发分屏的宽度

const computeDropZone = (e: DragEvent): DropZone => {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const w = rect.width;
  const h = rect.height;
  const edgeX = Math.min(x, w - x);
  const edgeY = Math.min(y, h - y);
  // 优先判断水平/垂直方向上更靠近哪个边
  if (edgeX < edgeY) {
    // 水平方向更靠近边缘
    if (x < DROP_EDGE_SIZE) return "left";
    if (x > w - DROP_EDGE_SIZE) return "right";
  } else {
    if (y < DROP_EDGE_SIZE) return "top";
    if (y > h - DROP_EDGE_SIZE) return "bottom";
  }
  return "center";
};

const onPaneDragOver = (e: DragEvent) => {
  // 仅处理 tab 拖拽
  if (!e.dataTransfer) return;
  // 检查 dataTransfer 是否有我们的 payload
  // 注意：dragover 时无法读取 dataTransfer 数据（浏览器限制），用 draggingPayload 状态判断
  if (!api.draggingTab()) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  currentDropZone.value = computeDropZone(e);
};

const onPaneDragLeave = (e: DragEvent) => {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const { clientX: x, clientY: y } = e;
  if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
    currentDropZone.value = null;
  }
};

const onPaneDrop = (e: DragEvent) => {
  e.preventDefault();
  const zone = currentDropZone.value || computeDropZone(e);
  currentDropZone.value = null;
  let payload: TabDragPayload | null = null;
  try {
    const raw = e.dataTransfer?.getData("application/json");
    if (raw) payload = JSON.parse(raw) as TabDragPayload;
  } catch {}
  if (!payload) payload = api.draggingTab();
  if (!payload) return;
  api.handleDrop(props.groupId, payload, zone);
};

// ============== Watchers ==============
watch(
  () => props.activeTabId,
  () => {
    nextTick(() => syncActiveModel());
  },
);

watch(
  () => props.theme,
  (val) => {
    monaco.editor.setTheme(val);
  },
);

watch(
  () => props.isActive,
  (val) => {
    // 非活动组时降低视觉强调
    if (val && editorContainer.value) {
      editorContainer.value.classList.add("pane-active");
      editorContainer.value.classList.remove("pane-inactive");
    } else if (editorContainer.value) {
      editorContainer.value.classList.remove("pane-active");
      editorContainer.value.classList.add("pane-inactive");
    }
  },
);

// ============== 生命周期 ==============
onMounted(() => {
  initEditor();
});

onBeforeUnmount(() => {
  api.editorDispose(props.groupId);
  toRaw(editorInstance.value)?.dispose();
  editorInstance.value = undefined;
});
</script>

<template>
  <div
    class="sh-editor-pane"
    :class="{
      'pane-active': isActive,
      'pane-inactive': !isActive,
    }"
    @dragover="onPaneDragOver"
    @dragleave="onPaneDragLeave"
    @drop="onPaneDrop"
  >
    <!-- 标签栏（始终渲染，含操作按钮） -->
    <div class="pane-tabbar">
      <div v-if="tabs.length > 0" class="pane-tabs-scroll">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          class="pane-tab"
          :class="{ active: tab.id === activeTabId }"
          draggable="true"
          @click="handleSwitch(tab.id)"
          @contextmenu="handleContextmenu(tab.id, $event)"
          @dragstart="onTabDragStart($event, tab.id)"
          @dragend="onTabDragEnd"
        >
          <span class="tab-icon">{{ getFileIcon(tab.name) }}</span>
          <span class="tab-name">
            {{ tab.name }}
            <span v-if="shouldShowPath(tab)" class="tab-path">{{
              tab.path
            }}</span>
          </span>
          <span v-if="tab.modified" class="tab-modified">●</span>
          <span class="tab-close" @click.stop="handleClose(tab.id)">×</span>
        </div>
      </div>
      <!-- 组操作按钮 -->
      <div class="pane-tabbar-actions">
        <button
          class="pane-action-btn"
          :title="i18n('ide.ctx.splitRight')"
          @click="handleSplit('right')"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path
              d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25V2.75A1.75 1.75 0 0 0 14.25 1H1.75zm0 1.5h5.375v11H1.75a.25.25 0 0 1-.25-.25V2.75a.25.25 0 0 1 .25-.25zm6.875 11v-11h5.625a.25.25 0 0 1 .25.25v10.5a.25.25 0 0 1-.25.25H8.625z"
            />
          </svg>
        </button>
        <button
          v-if="canClose"
          class="pane-action-btn"
          :title="i18n('ide.ctx.closeGroup')"
          @click="handleCloseGroup"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 面包屑 -->
    <div v-if="activeTab" class="pane-breadcrumb">
      <span class="breadcrumb-path">{{ breadcrumbPath }}</span>
      <span class="breadcrumb-lang">{{ languageLabel }}</span>
      <div v-if="canCompile || canRun" class="breadcrumb-actions">
        <button
          v-if="canCompile"
          class="breadcrumb-btn compile-btn"
          :title="i18n('ide.menu.build.compile')"
          @click="emit('compile')"
        >
          ▶
        </button>
        <button
          v-if="canRun"
          class="breadcrumb-btn run-btn"
          :title="i18n('ide.menu.build.run')"
          @click="emit('run')"
        >
          ►
        </button>
      </div>
    </div>

    <!-- Monaco 编辑器容器 -->
    <div ref="editorContainer" class="pane-monaco" v-show="hasTabs" />

    <!-- 拖拽 drop zones 覆盖层 -->
    <template v-if="isDragging && currentDropZone">
      <div v-if="currentDropZone === 'left'" class="drop-overlay drop-left">
        <span>{{ i18n("ide.split.dropLeft") }}</span>
      </div>
      <div v-if="currentDropZone === 'right'" class="drop-overlay drop-right">
        <span>{{ i18n("ide.split.dropRight") }}</span>
      </div>
      <div v-if="currentDropZone === 'top'" class="drop-overlay drop-top">
        <span>{{ i18n("ide.split.dropTop") }}</span>
      </div>
      <div v-if="currentDropZone === 'bottom'" class="drop-overlay drop-bottom">
        <span>{{ i18n("ide.split.dropBottom") }}</span>
      </div>
      <div v-if="currentDropZone === 'center'" class="drop-overlay drop-center">
        <span>{{ i18n("ide.split.dropCenter") }}</span>
      </div>
    </template>

    <!-- 空状态 -->
    <div v-if="!hasTabs" class="pane-empty">
      <div class="pane-empty-icon">
        <svg
          viewBox="0 0 100 100"
          width="60"
          height="60"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="30,25 15,50 30,75" />
          <polyline points="70,25 85,50 70,75" />
          <line x1="55" y1="20" x2="45" y2="80" />
        </svg>
      </div>
      <p>{{ i18n("ide.welcome.hint") }}</p>
      <div class="pane-empty-actions">
        <button class="pane-action-link" @click="handleSplit('right')">
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="currentColor"
            style="vertical-align: middle; margin-right: 4px"
          >
            <path
              d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25V2.75A1.75 1.75 0 0 0 14.25 1H1.75zm0 1.5h5.375v11H1.75a.25.25 0 0 1-.25-.25V2.75a.25.25 0 0 1 .25-.25zm6.875 11v-11h5.625a.25.25 0 0 1 .25.25v10.5a.25.25 0 0 1-.25.25H8.625z"
            />
          </svg>
          {{ i18n("ide.ctx.splitRight") }}
        </button>
        <button
          v-if="canClose"
          class="pane-action-link"
          @click="handleCloseGroup"
        >
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="currentColor"
            style="vertical-align: middle; margin-right: 4px"
          >
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
          {{ i18n("ide.ctx.closeGroup") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sh-editor-pane {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
  position: relative;
  overflow: hidden;
  background: var(--ide-bg, #1e1e1e);
  outline: none;

  &.pane-inactive {
    .pane-tabbar {
      opacity: 0.7;
    }

    .pane-breadcrumb {
      opacity: 0.7;
    }
  }
}

.pane-tabbar {
  display: flex;
  align-items: center;
  background: var(--ide-bg-tertiary, #2d2d2d);
  border-bottom: 1px solid var(--ide-border, #3c3c3c);
  flex-shrink: 0;
  height: 35px;
}

.pane-tabs-scroll {
  display: flex;
  flex: 1;
  overflow-x: auto;
  height: 100%;

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--ide-scrollbar, #4e4e4e);
    border-radius: 2px;
  }
}

.pane-tab {
  display: flex;
  align-items: center;
  padding: 0 12px;
  min-width: 100px;
  max-width: 240px;
  height: 100%;
  cursor: pointer;
  background: var(--ide-tab-inactive-bg, #2d2d2d);
  border-right: 1px solid var(--ide-border, #3c3c3c);
  font-size: 12.5px;
  white-space: nowrap;
  user-select: none;
  position: relative;
  color: var(--ide-fg, #ccc);

  &.active {
    background: var(--ide-tab-active-bg, #1e1e1e);
    border-top: 2px solid var(--ide-accent, #007acc);
  }

  &:hover {
    background: var(--ide-bg-hover, #2a2d2e);
  }

  // 拖拽视觉反馈
  &[draggable="true"] {
    cursor: grab;
  }

  &[draggable="true"]:active {
    cursor: grabbing;
  }
}

.tab-icon {
  margin-right: 4px;
  font-size: 13px;
  flex-shrink: 0;
}

.tab-name {
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.tab-path {
  font-size: 11px;
  color: var(--ide-fg-dim, #858585);
  opacity: 0.7;
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.tab-modified {
  color: var(--ide-modified-dot, #e2c08d);
  margin-left: 4px;
  font-size: 10px;
  flex-shrink: 0;
}

.tab-close {
  margin-left: 6px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-size: 16px;
  opacity: 0;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.pane-tab:hover .tab-close,
.pane-tab.active .tab-close {
  opacity: 0.7;
}

.pane-tabbar-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 4px;
  flex-shrink: 0;
}

.pane-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--ide-fg-dim, #858585);
  cursor: pointer;
  border-radius: 3px;

  &:hover {
    background: var(--ide-bg-hover, #2a2d2e);
    color: var(--ide-fg, #ccc);
  }
}

.pane-breadcrumb {
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

.compile-btn {
  color: var(--ide-accent, #007acc);
  border-color: var(--ide-accent, #007acc);
}

.run-btn {
  color: #89d185;
  border-color: #89d185;
}

.pane-monaco {
  flex: 1;
  min-height: 0;
}

.pane-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--ide-fg-dim, #858585);
  text-align: center;
  gap: 8px;
  pointer-events: none;

  .pane-empty-actions {
    pointer-events: auto;
    display: flex;
    gap: 8px;
  }
}

.pane-empty-icon {
  margin-bottom: 8px;
  opacity: 0.4;
  color: var(--ide-fg-dim, #858585);
}

.pane-empty p {
  margin: 0;
  font-size: 13px;
}

.pane-action-link {
  background: none;
  border: 1px solid var(--ide-border, #3c3c3c);
  color: var(--ide-fg, #ccc);
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: var(--ide-bg-hover, #2a2d2e);
    border-color: var(--ide-accent, #007acc);
    color: var(--ide-accent, #007acc);
  }
}

// ============ Drop zones ============
.drop-overlay {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--ide-accent, #007acc) 18%, transparent);
  border: 2px solid var(--ide-accent, #007acc);
  color: var(--ide-accent, #007acc);
  font-size: 12px;
  font-weight: 500;
  z-index: 20;
  pointer-events: none;
  border-radius: 4px;
  transition: all 0.1s ease;
}

.drop-left {
  left: 4px;
  top: 4px;
  bottom: 4px;
  width: calc(50% - 6px);
}

.drop-right {
  right: 4px;
  top: 4px;
  bottom: 4px;
  width: calc(50% - 6px);
}

.drop-top {
  left: 4px;
  right: 4px;
  top: 4px;
  height: calc(50% - 6px);
}

.drop-bottom {
  left: 4px;
  right: 4px;
  bottom: 4px;
  height: calc(50% - 6px);
}

.drop-center {
  left: 25%;
  right: 25%;
  top: 25%;
  bottom: 25%;
}
</style>
