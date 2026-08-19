<script setup lang="ts" name="EtlCanvas">
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import type { EtlDesignerState } from "../composables/useEtlDesigner";
import {
  findPreset,
  NODE_HEIGHT,
  NODE_WIDTH,
  STATUS_COLORS,
} from "../constants";
import type { EtlNode } from "../types";

const props = defineProps<{
  designer: EtlDesignerState;
}>();

const emit = defineEmits<{
  (e: "drop-node", type: string, x: number, y: number): void;
}>();

const canvasRef = ref<HTMLElement | null>(null);
const canvasWidth = ref(1200);
const canvasHeight = ref(700);
const offset = ref({ x: 0, y: 0 });
const scale = ref(1);

/** 拖拽中的节点 */
const draggingNode = ref<{
  id: string;
  offsetX: number;
  offsetY: number;
} | null>(null);

/** 节点像素坐标（含缩放和偏移） */
const nodeStyle = (node: EtlNode) => ({
  left: `${node.x * scale.value + offset.value.x}px`,
  top: `${node.y * scale.value + offset.value.y}px`,
  width: `${NODE_WIDTH}px`,
  height: `${NODE_HEIGHT}px`,
});

/** 边路径 */
const edgePaths = computed(() => {
  return props.designer.state.edges
    .map((edge) => {
      const source = props.designer.state.nodes.find(
        (n) => n.id === edge.source,
      );
      const target = props.designer.state.nodes.find(
        (n) => n.id === edge.target,
      );
      if (!source || !target) return null;
      const sx = source.x + NODE_WIDTH / 2;
      const sy = source.y + NODE_HEIGHT;
      const tx = target.x + NODE_WIDTH / 2;
      const ty = target.y;
      const midY = (sy + ty) / 2;
      return {
        id: edge.id,
        d: `M ${sx},${sy} C ${sx},${midY} ${tx},${midY} ${tx},${ty}`,
        source,
        target,
      };
    })
    .filter(Boolean);
});

const handleNodeMouseDown = (e: MouseEvent, node: EtlNode) => {
  if (e.button !== 0) return;
  e.stopPropagation();
  props.designer.selectNode(node.id);
  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;
  const mouseX = (e.clientX - rect.left - offset.value.x) / scale.value;
  const mouseY = (e.clientY - rect.top - offset.value.y) / scale.value;
  draggingNode.value = {
    id: node.id,
    offsetX: mouseX - node.x,
    offsetY: mouseY - node.y,
  };
};

const handleCanvasMouseMove = (e: MouseEvent) => {
  if (!draggingNode.value) return;
  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;
  const mouseX = (e.clientX - rect.left - offset.value.x) / scale.value;
  const mouseY = (e.clientY - rect.top - offset.value.y) / scale.value;
  const x = mouseX - draggingNode.value.offsetX;
  const y = mouseY - draggingNode.value.offsetY;
  props.designer.moveNode(
    draggingNode.value.id,
    Math.max(0, x),
    Math.max(0, y),
  );
};

const handleCanvasMouseUp = () => {
  draggingNode.value = null;
};

const handleOutputPortMouseDown = (e: MouseEvent, node: EtlNode) => {
  e.stopPropagation();
  props.designer.startConnect(node.id);
};

const handleNodeMouseUp = (node: EtlNode) => {
  if (
    props.designer.connectingFrom.value &&
    props.designer.connectingFrom.value !== node.id
  ) {
    props.designer.finishConnect(node.id);
  }
};

const handleCanvasClick = (e: MouseEvent) => {
  if (
    e.target === e.currentTarget ||
    (e.target as HTMLElement).classList.contains("etl-canvas-inner")
  ) {
    props.designer.selectNode(null);
    props.designer.cancelConnect();
  }
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  const type = e.dataTransfer?.getData("etl-node-type");
  if (!type) return;
  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;
  const x = (e.clientX - rect.left - offset.value.x) / scale.value;
  const y = (e.clientY - rect.top - offset.value.y) / scale.value;
  emit(
    "drop-node",
    type,
    Math.max(0, x - NODE_WIDTH / 2),
    Math.max(0, y - NODE_HEIGHT / 2),
  );
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const handleZoomIn = () => {
  scale.value = Math.min(2, scale.value + 0.1);
};

const handleZoomOut = () => {
  scale.value = Math.max(0.5, scale.value - 0.1);
};

const handleZoomReset = () => {
  scale.value = 1;
  offset.value = { x: 0, y: 0 };
};

const getNodeColor = (node: EtlNode): string => {
  const preset = findPreset(node.type);
  return preset?.color ?? "#909399";
};

const getStatusColor = (node: EtlNode): string => {
  return STATUS_COLORS[node.status ?? "idle"];
};

/** 内联 SVG 图标映射（替代 Element Plus 图标，减少依赖） */
const svgIconMap: Record<string, string> = {
  Coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h4.5a1.5 1.5 0 010 3H9h4.5a1.5 1.5 0 010 3H9"/></svg>',
  Link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>',
  Document:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/><polyline points="14 2 14 8 20 8"/></svg>',
  Files:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 2v6h6M2 8a2 2 0 012-2h8l4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8z"/><path d="M6 2h8l4 4v2"/></svg>',
  Tickets:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 9a3 3 0 013-3h14a3 3 0 013 3M2 9v6a3 3 0 003 3h14a3 3 0 003-3V9M2 9a3 3 0 003 3h0a3 3 0 003-3M9 3v4M15 3v4M9 17v4M15 17v4"/></svg>',
  Filter:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  Operation:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  Connection:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>',
  DataAnalysis:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  Sort: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h12M3 18h6"/></svg>',
  CopyDocument:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="2" width="12" height="16" rx="2"/><path d="M4 6h12v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"/></svg>',
  MagicStick:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M12.2 11.8L11 13M12.2 6.2L11 5M15 9l-6.5 6.5"/></svg>',
  Promotion:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
  Merge:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v6l4 4 4-4V3M12 13v8M4 7h4M16 7h4"/></svg>',
  Share:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>',
  zoomIn:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>',
  zoomOut:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M8 11h6"/></svg>',
};
</script>

<template>
  <div class="etl-canvas-wrapper">
    <div class="canvas-toolbar">
      <el-button text @click="handleZoomOut"
        ><span class="svg-icon" v-html="svgIconMap.zoomOut"></span
      ></el-button>
      <span class="zoom-text">{{ Math.round(scale * 100) }}%</span>
      <el-button text @click="handleZoomIn"
        ><span class="svg-icon" v-html="svgIconMap.zoomIn"></span
      ></el-button>
      <el-button text @click="handleZoomReset">{{
        i18n("etl.canvas.reset")
      }}</el-button>
    </div>
    <div
      ref="canvasRef"
      class="etl-canvas"
      @mousemove="handleCanvasMouseMove"
      @mouseup="handleCanvasMouseUp"
      @click="handleCanvasClick"
      @drop="handleDrop"
      @dragover="handleDragOver"
    >
      <div
        class="etl-canvas-inner"
        :style="{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }"
      >
        <svg class="edges-layer" :width="canvasWidth" :height="canvasHeight">
          <path
            v-for="ep in edgePaths"
            :key="ep!.id"
            :d="ep!.d"
            fill="none"
            stroke="var(--el-text-color-secondary)"
            stroke-width="2"
            :class="{ selected: designer.selectedEdgeId.value === ep!.id }"
            @click.stop="designer.selectEdge(ep!.id)"
          />
        </svg>
        <div
          v-for="node in designer.state.nodes"
          :key="node.id"
          class="etl-node"
          :class="{
            selected: designer.selectedNodeId.value === node.id,
            running: node.status === 'running',
            'has-error': node.status === 'error',
          }"
          :style="nodeStyle(node)"
          @mousedown="handleNodeMouseDown($event, node)"
          @mouseup="handleNodeMouseUp(node)"
        >
          <div
            class="node-header"
            :style="{ backgroundColor: getNodeColor(node) }"
          >
            <span
              class="svg-icon node-icon"
              v-html="svgIconMap[findPreset(node.type)?.icon || 'Document']"
            ></span>
            <span class="node-name">{{ node.name }}</span>
          </div>
          <div class="node-body">
            <div class="node-status">
              <span
                class="status-dot"
                :style="{ backgroundColor: getStatusColor(node) }"
              />
              <span class="status-text">
                {{
                  node.status === "running"
                    ? i18n("etl.status.running")
                    : node.status === "success"
                      ? i18n("etl.status.success")
                      : node.status === "error"
                        ? i18n("etl.status.error")
                        : i18n("etl.status.idle")
                }}
              </span>
              <span v-if="node.rowCount !== undefined" class="row-count">
                {{ node.rowCount }} {{ i18n("etl.unit.records") }}
              </span>
            </div>
          </div>
          <!-- 输入端口 -->
          <div
            class="port port-input"
            v-if="findPreset(node.type)?.inputs !== 0"
            :style="{ left: `${NODE_WIDTH / 2 - 5}px`, top: '-5px' }"
          />
          <!-- 输出端口 -->
          <div
            class="port port-output"
            v-if="findPreset(node.type)?.outputs !== 0"
            :style="{
              left: `${NODE_WIDTH / 2 - 5}px`,
              top: `${NODE_HEIGHT - 5}px`,
            }"
            @mousedown="handleOutputPortMouseDown($event, node)"
          />
        </div>
      </div>
      <div class="empty-tip" v-if="designer.state.nodes.length === 0">
        {{ i18n("etl.canvas.empty") }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.etl-canvas-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--el-fill-color-lighter);
  position: relative;

  .canvas-toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-lighter);

    .zoom-text {
      font-size: 12px;
      min-width: 40px;
      text-align: center;
    }
  }

  .etl-canvas {
    flex: 1;
    overflow: auto;
    position: relative;

    .etl-canvas-inner {
      position: relative;

      .edges-layer {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;

        path {
          cursor: pointer;
          pointer-events: stroke;
          transition: stroke 0.2s;

          &:hover {
            stroke: var(--el-color-primary);
            stroke-width: 3;
          }

          &.selected {
            stroke: var(--el-color-primary);
            stroke-width: 3;
          }
        }
      }
    }

    .etl-node {
      position: absolute;
      background: var(--el-bg-color);
      border: 2px solid var(--el-border-color);
      border-radius: 6px;
      overflow: visible;
      cursor: move;
      user-select: none;
      transition:
        border-color 0.2s,
        box-shadow 0.2s;

      &:hover {
        border-color: var(--el-color-primary-light-5);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      &.selected {
        border-color: var(--el-color-primary);
        box-shadow: 0 0 0 2px var(--el-color-primary-light-7);
      }

      &.running {
        border-color: var(--el-color-primary);
        animation: pulse 1.2s ease-in-out infinite;
      }

      &.has-error {
        border-color: var(--el-color-danger);
      }

      @keyframes pulse {
        0%,
        100% {
          box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4);
        }
        50% {
          box-shadow: 0 0 0 6px rgba(64, 158, 255, 0);
        }
      }

      .node-header {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 4px 4px 0 0;
        color: #fff;

        .node-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }

        .node-name {
          font-size: 12px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .node-body {
        padding: 4px 8px;

        .node-status {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--el-text-color-secondary);

          .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
          }

          .row-count {
            margin-left: auto;
            color: var(--el-text-color-regular);
          }
        }
      }

      .port {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #fff;
        border: 2px solid var(--el-color-primary);
        cursor: crosshair;

        &.port-output:hover {
          background: var(--el-color-primary);
          transform: scale(1.3);
        }
      }
    }
  }

  .empty-tip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--el-text-color-placeholder);
    font-size: 14px;
    pointer-events: none;
  }
}

.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
}

.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
