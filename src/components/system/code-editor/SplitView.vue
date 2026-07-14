<script setup lang="ts">
import { computed, ref } from "vue";
import type { SplitNode, TabInfo } from "./types";
import EditorPane from "./EditorPane.vue";

/**
 * 递归分屏视图：渲染 SplitNode 树。
 * 叶子节点 -> EditorPane
 * 容器节点 -> 两个 SplitView（水平或垂直排列）+ 分隔条（可拖拽调整比例）
 */
const props = defineProps<{
  node: SplitNode;
  /** 当前活动组ID（用于高亮活动 pane） */
  activeGroupId: string;
  /** 所有组的 tabs 数据 */
  groups: Record<string, { id: string; tabs: TabInfo[]; activeTabId: string }>;
  /** 各组的活动 tab 对应的面包屑路径 */
  breadcrumbPaths: Record<string, string>;
  /** 各组的活动 tab 对应的语言 */
  languageLabels: Record<string, string>;
  /** 各组能否编译 */
  canCompileMap: Record<string, boolean>;
  /** 各组能否运行 */
  canRunMap: Record<string, boolean>;
  theme: string;
}>();

const emit = defineEmits<{
  compile: [groupId: string];
  run: [groupId: string];
}>();

// 分隔条拖拽状态
const isResizing = ref(false);
const containerRef = ref<HTMLElement>();

/** 容器节点才有两个子节点 */
const isContainer = computed(
  () => !!props.node.direction && !!props.node.children,
);

const directionClass = computed(() =>
  props.node.direction === "horizontal" ? "split-horizontal" : "split-vertical",
);

/** 第一个子节点占比（百分比） */
const firstSizePercent = computed(() => {
  const size = props.node.size ?? 0.5;
  return Math.max(10, Math.min(90, size * 100));
});

/** 拖拽分隔条调整比例 */
const onResizeStart = (e: MouseEvent) => {
  if (!isContainer.value || !containerRef.value) return;
  e.preventDefault();
  isResizing.value = true;
  const rect = containerRef.value.getBoundingClientRect();
  const startX = e.clientX;
  const startY = e.clientY;
  const startSize = props.node.size ?? 0.5;

  const onMove = (ev: MouseEvent) => {
    if (!isResizing.value) return;
    let newSize: number;
    if (props.node.direction === "horizontal") {
      const delta = ev.clientX - startX;
      newSize = startSize + delta / rect.width;
    } else {
      const delta = ev.clientY - startY;
      newSize = startSize + delta / rect.height;
    }
    props.node.size = Math.max(0.1, Math.min(0.9, newSize));
  };
  const onUp = () => {
    isResizing.value = false;
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };
  document.body.style.cursor =
    props.node.direction === "horizontal" ? "col-resize" : "row-resize";
  document.body.style.userSelect = "none";
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
};
</script>

<template>
  <div
    v-if="isContainer"
    ref="containerRef"
    class="split-container"
    :class="directionClass"
  >
    <div
      class="split-child split-child-first"
      :style="
        directionClass === 'split-horizontal'
          ? { width: firstSizePercent + '%' }
          : { height: firstSizePercent + '%' }
      "
    >
      <SplitView
        :node="node.children![0]"
        :active-group-id="activeGroupId"
        :groups="groups"
        :breadcrumb-paths="breadcrumbPaths"
        :language-labels="languageLabels"
        :can-compile-map="canCompileMap"
        :can-run-map="canRunMap"
        :theme="theme"
        @compile="(gid: string) => emit('compile', gid)"
        @run="(gid: string) => emit('run', gid)"
      />
    </div>
    <div
      class="split-resizer"
      :class="directionClass === 'split-horizontal' ? 'resizer-h' : 'resizer-v'"
      @mousedown="onResizeStart"
    />
    <div class="split-child split-child-second">
      <SplitView
        :node="node.children![1]"
        :active-group-id="activeGroupId"
        :groups="groups"
        :breadcrumb-paths="breadcrumbPaths"
        :language-labels="languageLabels"
        :can-compile-map="canCompileMap"
        :can-run-map="canRunMap"
        :theme="theme"
        @compile="(gid: string) => emit('compile', gid)"
        @run="(gid: string) => emit('run', gid)"
      />
    </div>
  </div>
  <EditorPane
    v-else
    :group-id="node.groupId!"
    :tabs="groups[node.groupId!]?.tabs || []"
    :active-tab-id="groups[node.groupId!]?.activeTabId || ''"
    :is-active="node.groupId === activeGroupId"
    :theme="theme"
    :breadcrumb-path="breadcrumbPaths[node.groupId!] || ''"
    :language-label="languageLabels[node.groupId!] || 'plaintext'"
    :can-compile="canCompileMap[node.groupId!] || false"
    :can-run="canRunMap[node.groupId!] || false"
    @compile="emit('compile', node.groupId!)"
    @run="emit('run', node.groupId!)"
  />
</template>

<style lang="scss" scoped>
.split-container {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  position: relative;
  overflow: hidden;

  &.split-horizontal {
    flex-direction: row;
  }
  &.split-vertical {
    flex-direction: column;
  }
}

.split-child {
  display: flex;
  min-width: 0;
  min-height: 0;
  overflow: hidden;

  .split-horizontal & {
    height: 100%;
  }
  .split-vertical & {
    width: 100%;
  }
}

.split-child-first {
  flex: 0 0 auto;
}

.split-child-second {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.split-resizer {
  flex-shrink: 0;
  background: var(--ide-border, #3c3c3c);
  position: relative;
  z-index: 5;
  transition: background 0.15s ease;

  &.resizer-h {
    width: 4px;
    cursor: col-resize;
    height: 100%;
    &:hover {
      background: var(--ide-accent, #007acc);
    }
  }
  &.resizer-v {
    height: 4px;
    cursor: row-resize;
    width: 100%;
    &:hover {
      background: var(--ide-accent, #007acc);
    }
  }
}

.split-resizer::after {
  content: "";
  position: absolute;
  // 扩大点击区域，方便鼠标抓取
  background: transparent;
  z-index: 1;
}

.resizer-h::after {
  top: 0;
  bottom: 0;
  left: -3px;
  right: -3px;
}

.resizer-v::after {
  left: 0;
  right: 0;
  top: -3px;
  bottom: -3px;
}
</style>
