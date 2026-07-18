<script setup lang="ts" name="EtlCanvas">
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import type { EtlDesignerState } from "../composables/useEtlDesigner";
import { findPreset, NODE_HEIGHT, NODE_WIDTH, STATUS_COLORS } from "../constants";
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
const draggingNode = ref<{ id: string; offsetX: number; offsetY: number } | null>(null);

/** 节点像素坐标（含缩放和偏移） */
const nodeStyle = (node: EtlNode) => ({
    left: `${node.x * scale.value + offset.value.x}px`,
    top: `${node.y * scale.value + offset.value.y}px`,
    width: `${NODE_WIDTH}px`,
    height: `${NODE_HEIGHT}px`,
});

/** 边路径 */
const edgePaths = computed(() => {
    return props.designer.state.edges.map((edge) => {
        const source = props.designer.state.nodes.find((n) => n.id === edge.source);
        const target = props.designer.state.nodes.find((n) => n.id === edge.target);
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
    }).filter(Boolean);
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
    props.designer.moveNode(draggingNode.value.id, Math.max(0, x), Math.max(0, y));
};

const handleCanvasMouseUp = () => {
    draggingNode.value = null;
};

const handleOutputPortMouseDown = (e: MouseEvent, node: EtlNode) => {
    e.stopPropagation();
    props.designer.startConnect(node.id);
};

const handleNodeMouseUp = (node: EtlNode) => {
    if (props.designer.connectingFrom.value && props.designer.connectingFrom.value !== node.id) {
        props.designer.finishConnect(node.id);
    }
};

const handleCanvasClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("etl-canvas-inner")) {
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
    emit("drop-node", type, Math.max(0, x - NODE_WIDTH / 2), Math.max(0, y - NODE_HEIGHT / 2));
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
</script>

<template>
    <div class="etl-canvas-wrapper">
        <div class="canvas-toolbar">
            <el-button  text @click="handleZoomOut"><el-icon><ZoomOut/></el-icon></el-button>
            <span class="zoom-text">{{ Math.round(scale * 100) }}%</span>
            <el-button  text @click="handleZoomIn"><el-icon><ZoomIn/></el-icon></el-button>
            <el-button  text @click="handleZoomReset">{{ i18n("etl.canvas.reset") }}</el-button>
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
            <div class="etl-canvas-inner" :style="{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }">
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
                    <div class="node-header" :style="{ backgroundColor: getNodeColor(node) }">
                        <el-icon class="node-icon"><component :is="findPreset(node.type)?.icon"/></el-icon>
                        <span class="node-name">{{ node.name }}</span>
                    </div>
                    <div class="node-body">
                        <div class="node-status">
                            <span class="status-dot" :style="{ backgroundColor: getStatusColor(node) }"/>
                            <span class="status-text">
                                {{ node.status === 'running' ? i18n('etl.status.running') :
                                   node.status === 'success' ? i18n('etl.status.success') :
                                   node.status === 'error' ? i18n('etl.status.error') :
                                   i18n('etl.status.idle') }}
                            </span>
                            <span v-if="node.rowCount !== undefined" class="row-count">
                                {{ node.rowCount }} {{ i18n('etl.unit.records') }}
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
                        :style="{ left: `${NODE_WIDTH / 2 - 5}px`, top: `${NODE_HEIGHT - 5}px` }"
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

<script lang="ts">
import { ZoomIn, ZoomOut } from "@element-plus/icons-vue";
export default { components: { ZoomIn, ZoomOut } };
</script>

<style lang="scss" scoped>
.etl-canvas-wrapper {
    flex: 1;
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
            transition: border-color 0.2s, box-shadow 0.2s;

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
                0%, 100% { box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4); }
                50% { box-shadow: 0 0 0 6px rgba(64, 158, 255, 0); }
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
</style>
