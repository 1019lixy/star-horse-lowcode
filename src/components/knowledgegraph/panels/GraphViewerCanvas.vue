<script setup lang="ts" name="GraphViewerCanvas">
/**
 * 知识图谱画布 - 核心交互组件
 *
 * 职责：SVG 渲染 / 节点拖拽 / 缩放平移 / 力布局动画 / 选中 / 双击展开 / 高亮
 * 注：本组件承担多种交互逻辑，行数较多（合理超 350 行）
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { i18n } from "@/lang";
import { ElMessage } from "element-plus";
import {
  KG_HIGHLIGHT_COLOR,
  KG_PATH_COLOR,
  KG_SEARCH_COLOR,
  KG_SELECTED_COLOR,
  kgGetEdgeColor,
  kgGetNodeColor,
  kgGetNodeRadius,
} from "../constants";
import type { KgEdge, KgNode } from "../types";
import type { UseGraphViewerReturn } from "../composables/useGraphViewer";
import type { UseForceLayoutReturn } from "../composables/useForceLayout";

const props = defineProps<{
  viewer: UseGraphViewerReturn;
  force?: UseForceLayoutReturn;
}>();

const wrapperRef = ref<HTMLElement>();
const svgWidth = ref(1000);
const svgHeight = ref(700);

const viewer = props.viewer;
const forceLayout = props.force;

const updateSize = () => {
  if (!wrapperRef.value) return;
  const rect = wrapperRef.value.getBoundingClientRect();
  svgWidth.value = rect.width;
  svgHeight.value = rect.height;
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  updateSize();
  resizeObserver = new ResizeObserver(() => updateSize());
  if (wrapperRef.value) resizeObserver.observe(wrapperRef.value);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
});
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  removeDragListeners();
  removePanListeners();
});

const nodes = computed(() => viewer.state.graph.nodes);
const edges = computed(() => viewer.state.graph.edges);
const viewport = computed(() => viewer.state.viewport);
const highlightIds = computed(() => new Set(viewer.state.highlightNodeIds));
const pathIds = computed(() => new Set(viewer.state.pathNodeIds));
const collapsedIds = computed(() => new Set(viewer.state.collapsedNodeIds));

// 触发响应式刷新（force 动画期间 tickCount 也会变）
void viewer.tickCount;

// ============== 坐标转换 ==============
const toCanvasPoint = (clientX: number, clientY: number) => {
  const rect = wrapperRef.value?.getBoundingClientRect();
  if (!rect) return { x: 0, y: 0 };
  return {
    x: (clientX - rect.left - viewport.value.panX) / viewport.value.zoom,
    y: (clientY - rect.top - viewport.value.panY) / viewport.value.zoom,
  };
};

// ============== 节点显示状态 ==============
const isSelected = (node: KgNode) => viewer.state.selectedNodeId === node.id;
const isHighlighted = (node: KgNode) => highlightIds.value.has(node.id);
const isOnPath = (node: KgNode) => pathIds.value.has(node.id);
const isCollapsed = (node: KgNode) => collapsedIds.value.has(node.id);

const nodeFill = (node: KgNode): string => {
  if (isOnPath(node)) return KG_PATH_COLOR;
  if (isSelected(node)) return KG_SELECTED_COLOR;
  if (viewer.state.searchKeyword && isHighlighted(node)) return KG_SEARCH_COLOR;
  return kgGetNodeColor(node);
};

const nodeStroke = (node: KgNode): string => {
  if (isOnPath(node) || isSelected(node)) return "#FFFFFF";
  if (isHighlighted(node)) return KG_HIGHLIGHT_COLOR;
  return "#FFFFFF";
};

const nodeStrokeWidth = (node: KgNode): number => {
  if (isOnPath(node) || isSelected(node)) return 3;
  if (isHighlighted(node)) return 2;
  return 1.5;
};

const nodeOpacity = (node: KgNode): number => {
  if (viewer.state.searchKeyword && !isHighlighted(node)) return 0.25;
  if (viewer.state.pathNodeIds.length > 0 && !isOnPath(node)) return 0.25;
  return 1;
};

const edgeOpacity = (edge: KgEdge): number => {
  if (viewer.state.pathNodeIds.length > 0) {
    const onPath =
      pathIds.value.has(edge.source) && pathIds.value.has(edge.target);
    return onPath ? 1 : 0.1;
  }
  if (viewer.state.searchKeyword) {
    const involved =
      highlightIds.value.has(edge.source) ||
      highlightIds.value.has(edge.target);
    return involved ? 0.8 : 0.1;
  }
  return 0.8;
};

const edgeMid = (edge: KgEdge): { x: number; y: number } => {
  const s = nodes.value.find((n) => n.id === edge.source);
  const t = nodes.value.find((n) => n.id === edge.target);
  if (!s || !t) return { x: 0, y: 0 };
  return { x: (s.x + t.x) / 2, y: (s.y + t.y) / 2 };
};

// ============== 节点点击 / 双击 ==============
const handleNodeClick = (e: MouseEvent, node: KgNode) => {
  e.stopPropagation();
  viewer.selectNode(node.id);
};

const handleNodeDblClick = (e: MouseEvent, node: KgNode) => {
  e.stopPropagation();
  viewer.toggleCollapse(node.id);
  if (forceLayout && forceLayout.running.value) {
    // 切换折叠后重新启动布局以重排
  }
};

const handleEdgeClick = (e: MouseEvent, edge: KgEdge) => {
  e.stopPropagation();
  viewer.selectEdge(edge.id);
};

const handleCanvasClick = () => {
  viewer.selectNode(null);
  viewer.selectEdge(null);
};

// ============== 节点拖拽 ==============
const dragging = ref<{
  id: string;
  startClientX: number;
  startClientY: number;
  origX: number;
  origY: number;
} | null>(null);

const startNodeDrag = (e: MouseEvent, node: KgNode) => {
  if (e.button !== 0) return;
  e.stopPropagation();
  if (forceLayout) forceLayout.setFixed(node.id, true);
  dragging.value = {
    id: node.id,
    startClientX: e.clientX,
    startClientY: e.clientY,
    origX: node.x,
    origY: node.y,
  };
  window.addEventListener("mousemove", onDragMove);
  window.addEventListener("mouseup", onDragUp);
};

const onDragMove = (e: MouseEvent) => {
  if (!dragging.value) return;
  const dx = (e.clientX - dragging.value.startClientX) / viewport.value.zoom;
  const dy = (e.clientY - dragging.value.startClientY) / viewport.value.zoom;
  const newX = dragging.value.origX + dx;
  const newY = dragging.value.origY + dy;
  viewer.dragNode(dragging.value.id, newX, newY);
  if (forceLayout) forceLayout.setNodePosition(dragging.value.id, newX, newY);
};

const onDragUp = () => {
  if (dragging.value) {
    if (forceLayout) {
      // 释放后允许节点继续参与布局（如果是力导向）
      if (viewer.state.layout === "force") {
        forceLayout.setFixed(dragging.value.id, false);
      }
    }
  }
  dragging.value = null;
  removeDragListeners();
};

const removeDragListeners = () => {
  window.removeEventListener("mousemove", onDragMove);
  window.removeEventListener("mouseup", onDragUp);
};

// ============== 平移 ==============
const spacePressed = ref(false);
const panning = ref<{
  startX: number;
  startY: number;
  origPanX: number;
  origPanY: number;
} | null>(null);

const onKeyDown = (e: KeyboardEvent) => {
  if (e.code === "Space" && !isEditableTarget(e.target)) {
    spacePressed.value = true;
  }
};
const onKeyUp = (e: KeyboardEvent) => {
  if (e.code === "Space") spacePressed.value = false;
};

const isEditableTarget = (t: EventTarget | null): boolean => {
  if (!t) return false;
  const el = t as HTMLElement;
  const tag = el.tagName?.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    el.isContentEditable
  );
};

const startPan = (e: MouseEvent) => {
  if (e.button !== 0 && e.button !== 1) return;
  if (!spacePressed.value && e.button !== 1 && !e.altKey) return;
  e.preventDefault();
  panning.value = {
    startX: e.clientX,
    startY: e.clientY,
    origPanX: viewport.value.panX,
    origPanY: viewport.value.panY,
  };
  window.addEventListener("mousemove", onPanMove);
  window.addEventListener("mouseup", onPanUp);
};

const onPanMove = (e: MouseEvent) => {
  if (!panning.value) return;
  viewer.setPan(
    panning.value.origPanX + (e.clientX - panning.value.startX),
    panning.value.origPanY + (e.clientY - panning.value.startY),
  );
};

const onPanUp = () => {
  panning.value = null;
  removePanListeners();
};

const removePanListeners = () => {
  window.removeEventListener("mousemove", onPanMove);
  window.removeEventListener("mouseup", onPanUp);
};

// ============== 滚轮缩放 ==============
const handleWheel = (e: WheelEvent) => {
  if (!e.ctrlKey && !e.metaKey && !spacePressed.value) return;
  e.preventDefault();
  if (e.deltaY < 0) viewer.zoomIn();
  else viewer.zoomOut();
};

// ============== 力布局启停 ==============
const toggleForce = () => {
  if (!forceLayout) return;
  if (forceLayout.running.value) {
    forceLayout.stop();
  } else {
    forceLayout.start({ iterations: 200 });
  }
};

const runLayoutOnce = () => {
  viewer.applyLayout({ x: svgWidth.value / 2, y: svgHeight.value / 2 });
};

// ============== 路径查询 ==============
const handleRunPath = () => {
  const fromId = viewer.state.pathFromId;
  const toId = viewer.state.pathToId;
  if (!fromId || !toId) {
    ElMessage.warning(i18n("knowledgegraph.message.invalidQuery"));
    return;
  }
  const path = viewer.findPath(fromId, toId);
  if (path.length === 0) {
    ElMessage.info(i18n("knowledgegraph.viewer.noPath"));
  }
};

// 暴露给父组件使用（路径查询面板）
defineExpose({
  runLayoutOnce,
  toggleForce,
  handleRunPath,
});

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
  refresh:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M3.51 15a9 9 0 012.12-9.36L12 3M20.49 9a9 9 0 01-2.12 9.36L12 21"/></svg>',
  videoPlay:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  videoPause:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
};
</script>

<template>
  <div
    class="kg-canvas-wrapper"
    ref="wrapperRef"
    :class="{ panning: spacePressed }"
    @click="handleCanvasClick"
    @mousedown="startPan"
    @wheel="handleWheel"
  >
    <svg
      :width="svgWidth"
      :height="svgHeight"
      :style="{
        background: '#FAFAFA',
        cursor: spacePressed ? 'grab' : 'default',
      }"
    >
      <defs>
        <marker
          id="kg-arrow-default"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#8C8C8C" />
        </marker>
        <marker
          id="kg-arrow-highlight"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" :fill="KG_PATH_COLOR" />
        </marker>
      </defs>

      <g
        :transform="`translate(${viewport.panX},${viewport.panY}) scale(${viewport.zoom})`"
      >
        <!-- 边 -->
        <g class="edges-layer">
          <line
            v-for="edge in edges"
            :key="edge.id"
            :x1="nodes.find((n) => n.id === edge.source)?.x ?? 0"
            :y1="nodes.find((n) => n.id === edge.source)?.y ?? 0"
            :x2="nodes.find((n) => n.id === edge.target)?.x ?? 0"
            :y2="nodes.find((n) => n.id === edge.target)?.y ?? 0"
            :stroke="kgGetEdgeColor(edge)"
            :stroke-width="1.5"
            :stroke-opacity="edgeOpacity(edge)"
            :marker-end="
              pathIds.has(edge.source) && pathIds.has(edge.target)
                ? 'url(#kg-arrow-highlight)'
                : 'url(#kg-arrow-default)'
            "
            @click="(e) => handleEdgeClick(e, edge)"
          />
          <text
            v-for="edge in edges.filter((e) => e.label)"
            :key="'label-' + edge.id"
            :x="edgeMid(edge).x"
            :y="edgeMid(edge).y"
            :font-size="10"
            :fill="kgGetEdgeColor(edge)"
            :opacity="edgeOpacity(edge)"
            text-anchor="middle"
            pointer-events="none"
            style="paint-order: stroke; stroke: #ffffff; stroke-width: 3px"
          >
            {{ edge.label }}
          </text>
        </g>

        <!-- 节点 -->
        <g class="nodes-layer">
          <g
            v-for="node in nodes"
            :key="node.id"
            :transform="`translate(${node.x},${node.y})`"
            :data-node-id="node.id"
            :opacity="nodeOpacity(node)"
            @click="(e) => handleNodeClick(e, node)"
            @dblclick="(e) => handleNodeDblClick(e, node)"
            @mousedown="(e) => startNodeDrag(e, node)"
          >
            <circle
              :r="kgGetNodeRadius(node)"
              :fill="nodeFill(node)"
              :stroke="nodeStroke(node)"
              :stroke-width="nodeStrokeWidth(node)"
            />
            <text
              :y="kgGetNodeRadius(node) + 14"
              :font-size="11"
              fill="#333333"
              text-anchor="middle"
              pointer-events="none"
              style="paint-order: stroke; stroke: #ffffff; stroke-width: 3px"
            >
              {{ node.label }}
            </text>
            <!-- 折叠标记 -->
            <text
              v-if="isCollapsed(node)"
              :y="4"
              :font-size="14"
              fill="#FFFFFF"
              text-anchor="middle"
              pointer-events="none"
              font-weight="bold"
            >
              +
            </text>
          </g>
        </g>
      </g>
    </svg>

    <!-- 浮动操作条 -->
    <div class="floating-actions">
      <el-button-group>
        <el-button
          @click="runLayoutOnce"
          :title="i18n('knowledgegraph.viewer.reset')"
        >
          <span class="svg-icon" v-html="icons.refresh"></span>
        </el-button>
        <el-button
          :type="
            forceLayout && forceLayout.running.value ? 'primary' : 'default'
          "
          @click="toggleForce"
          v-if="forceLayout"
        >
          <span
            class="svg-icon"
            v-html="
              forceLayout && !forceLayout.running.value
                ? icons.videoPlay
                : icons.videoPause
            "
          ></span>
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.kg-canvas-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #fafafa;

  &.panning {
    cursor: grab;
  }

  svg {
    display: block;
  }

  .floating-actions {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: flex;
    gap: 8px;
  }
}

.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  margin-right: 4px;
}

.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
