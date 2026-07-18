<script setup lang="ts" name="DiagramCanvas">
import { computed, ref } from "vue";
import { getPortPosition, getShapePath } from "../constants";
import type { DiagramNode, NodeTypePreset } from "../types";
import type { UseDiagramDesignerReturn } from "../composables/useDiagramDesigner";

const props = defineProps<{
    designer: UseDiagramDesignerReturn;
}>();

const svgRef = ref<SVGSVGElement>();
const canvasRef = ref<HTMLElement>();

const nodes = computed(() => props.designer.state.diagram.nodes);
const edges = computed(() => props.designer.state.diagram.edges);
const canvas = computed(() => props.designer.state.diagram.canvas);
const selectedNodeIds = computed(() => props.designer.state.selectedNodeIds);
const selectedEdgeIds = computed(() => props.designer.state.selectedEdgeIds);

const viewBox = computed(() => {
    return `${-canvas.value.panX / canvas.value.zoom} ${-canvas.value.panY / canvas.value.zoom} ${svgWidth.value / canvas.value.zoom} ${svgHeight.value / canvas.value.zoom}`;
});

const svgWidth = ref(1000);
const svgHeight = ref(700);

const updateSize = () => {
    if (!canvasRef.value) return;
    const rect = canvasRef.value.getBoundingClientRect();
    svgWidth.value = rect.width;
    svgHeight.value = rect.height;
};

const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer?.getData("diagram-node-type");
    if (!type) return;
    // 在 useDiagramDesigner 中通过 preset 添加，这里需要外部传入
    // 简化：通过事件通知父组件
    const preset = (window as any).__diagramDragPreset;
    if (preset && canvasRef.value) {
        const rect = canvasRef.value.getBoundingClientRect();
        const x = (e.clientX - rect.left - canvas.value.panX) / canvas.value.zoom;
        const y = (e.clientY - rect.top - canvas.value.panY) / canvas.value.zoom;
        props.designer.addNode(preset as NodeTypePreset, props.designer.snapValue(x), props.designer.snapValue(y));
        (window as any).__diagramDragPreset = null;
    }
};

const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
};

const handleNodeClick = (e: MouseEvent, node: DiagramNode) => {
    e.stopPropagation();
    props.designer.selectNode(node.id, e.ctrlKey || e.metaKey);
};

const handleEdgeClick = (e: MouseEvent, edgeId: string) => {
    e.stopPropagation();
    props.designer.selectEdge(edgeId, e.ctrlKey || e.metaKey);
};

const handleCanvasClick = () => {
    props.designer.clearSelection();
};

// 节点拖动
const dragging = ref<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

const startNodeDrag = (e: MouseEvent, node: DiagramNode) => {
    if (props.designer.state.readonly || node.locked) return;
    if (props.designer.state.tool !== "select") return;
    if (!selectedNodeIds.value.includes(node.id)) {
        props.designer.selectNode(node.id);
    }
    dragging.value = {
        id: node.id,
        startX: e.clientX,
        startY: e.clientY,
        origX: node.x,
        origY: node.y,
    };
    window.addEventListener("mousemove", onNodeMouseMove);
    window.addEventListener("mouseup", onNodeMouseUp);
};

const onNodeMouseMove = (e: MouseEvent) => {
    if (!dragging.value) return;
    const dx = (e.clientX - dragging.value.startX) / canvas.value.zoom;
    const dy = (e.clientY - dragging.value.startY) / canvas.value.zoom;
    const newX = props.designer.snapValue(dragging.value.origX + dx);
    const newY = props.designer.snapValue(dragging.value.origY + dy);
    props.designer.updateNode(dragging.value.id, { x: newX, y: newY });
};

const onNodeMouseUp = () => {
    if (dragging.value) props.designer.pushHistory();
    dragging.value = null;
    window.removeEventListener("mousemove", onNodeMouseMove);
    window.removeEventListener("mouseup", onNodeMouseUp);
};

// 画布平移
const panning = ref<{ startX: number; startY: number; origPanX: number; origPanY: number } | null>(null);

const startPan = (e: MouseEvent) => {
    if (props.designer.state.tool !== "pan" && !(e.button === 1 || e.altKey)) return;
    panning.value = {
        startX: e.clientX,
        startY: e.clientY,
        origPanX: canvas.value.panX,
        origPanY: canvas.value.panY,
    };
    window.addEventListener("mousemove", onPanMove);
    window.addEventListener("mouseup", onPanUp);
};

const onPanMove = (e: MouseEvent) => {
    if (!panning.value) return;
    const dx = e.clientX - panning.value.startX;
    const dy = e.clientY - panning.value.startY;
    props.designer.setPan(panning.value.origPanX + dx, panning.value.origPanY + dy);
};

const onPanUp = () => {
    panning.value = null;
    window.removeEventListener("mousemove", onPanMove);
    window.removeEventListener("mouseup", onPanUp);
};

// 缩放滚轮
const handleWheel = (e: WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    if (e.deltaY < 0) props.designer.zoomIn();
    else props.designer.zoomOut();
};

// 连线拖拽（从端口拖出）
const connecting = ref<{ fromNodeId: string; fromPortId: string; toX: number; toY: number } | null>(null);

const startConnect = (e: MouseEvent, node: DiagramNode, portId: string) => {
    if (props.designer.state.readonly) return;
    e.stopPropagation();
    const port = getPortPosition(node, portId);
    connecting.value = { fromNodeId: node.id, fromPortId, toX: port.x, toY: port.y };
    window.addEventListener("mousemove", onConnectMove);
    window.addEventListener("mouseup", onConnectUp);
};

const onConnectMove = (e: MouseEvent) => {
    if (!connecting.value || !canvasRef.value) return;
    const rect = canvasRef.value.getBoundingClientRect();
    connecting.value.toX = (e.clientX - rect.left - canvas.value.panX) / canvas.value.zoom;
    connecting.value.toY = (e.clientY - rect.top - canvas.value.panY) / canvas.value.zoom;
};

const onConnectUp = (e: MouseEvent) => {
    if (connecting.value) {
        const target = (e.target as HTMLElement)?.closest("[data-node-id]")?.getAttribute("data-node-id");
        if (target && target !== connecting.value.fromNodeId) {
            props.designer.addEdge({
                source: connecting.value.fromNodeId,
                sourcePort: connecting.value.fromPortId,
                target,
                type: "orthogonal",
            });
        }
    }
    connecting.value = null;
    window.removeEventListener("mousemove", onConnectMove);
    window.removeEventListener("mouseup", onConnectUp);
};

// 计算边的路径
const edgePath = (edge: typeof edges.value[0]): string => {
    const source = nodes.value.find((n) => n.id === edge.source);
    const target = nodes.value.find((n) => n.id === edge.target);
    if (!source || !target) return "";
    const sp = getPortPosition(source, edge.sourcePort || "right");
    const tp = getPortPosition(target, edge.targetPort || "left");
    switch (edge.type) {
        case "straight":
            return `M${sp.x},${sp.y} L${tp.x},${tp.y}`;
        case "curve":
            const mx = (sp.x + tp.x) / 2;
            return `M${sp.x},${sp.y} C${mx},${sp.y} ${mx},${tp.y} ${tp.x},${tp.y}`;
        case "polyline":
            return `M${sp.x},${sp.y} L${(sp.x + tp.x) / 2},${sp.y} L${(sp.x + tp.x) / 2},${tp.y} L${tp.x},${tp.y}`;
        case "orthogonal":
        default:
            const midX = (sp.x + tp.x) / 2;
            return `M${sp.x},${sp.y} L${midX},${sp.y} L${midX},${tp.y} L${tp.x},${tp.y}`;
    }
};

const connectingPath = computed(() => {
    if (!connecting.value) return "";
    const c = connecting.value;
    return `M${c.fromNodeId ? nodes.value.find((n) => n.id === c.fromNodeId) : null},${0} L${c.toX},${c.toY}`;
});

// 节点形状渲染
const nodeShapePath = (node: DiagramNode): string => {
    return getShapePath(node.shape, 0, 0, node.width, node.height);
};

const nodeText = (node: DiagramNode): { x: number; y: number } => {
    return { x: node.width / 2, y: node.height / 2 };
};

const isSelected = (node: DiagramNode): boolean => selectedNodeIds.value.includes(node.id);
const isEdgeSelected = (edgeId: string): boolean => selectedEdgeIds.value.includes(edgeId);

// 端口位置（相对节点坐标）
const portRelativePos = (node: DiagramNode, portId: string): { x: number; y: number } => {
    const port = node.ports?.find((p) => p.id === portId);
    if (!port) return { x: node.width / 2, y: node.height / 2 };
    switch (port.position) {
        case "top":
            return { x: node.width / 2, y: 0 };
        case "right":
            return { x: node.width, y: node.height / 2 };
        case "bottom":
            return { x: node.width / 2, y: node.height };
        case "left":
            return { x: 0, y: node.height / 2 };
        default:
            return { x: node.width / 2, y: node.height / 2 };
    }
};

// 网格 pattern
const gridSize = computed(() => canvas.value.gridSize);
</script>

<template>
    <div
        class="diagram-canvas-wrapper"
        ref="canvasRef"
        @click="handleCanvasClick"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @mousedown="startPan"
        @wheel="handleWheel"
    >
        <svg
            ref="svgRef"
            :viewBox="viewBox"
            :width="svgWidth"
            :height="svgHeight"
            preserveAspectRatio="xMinYMin meet"
            :style="{ background: canvas.backgroundColor, cursor: designer.state.tool === 'pan' ? 'grab' : 'default' }"
        >
            <!-- 网格 -->
            <defs v-if="canvas.showGrid">
                <pattern
                    id="diagram-grid"
                    :width="gridSize"
                    :height="gridSize"
                    patternUnits="userSpaceOnUse"
                >
                    <path :d="`M ${gridSize} 0 L 0 0 0 ${gridSize}`" fill="none" stroke="#E0E0E0" stroke-width="0.5"/>
                </pattern>
            </defs>
            <rect
                v-if="canvas.showGrid"
                x="-10000"
                y="-10000"
                width="20000"
                height="20000"
                fill="url(#diagram-grid)"
            />

            <!-- 边 -->
            <g class="edges-layer">
                <path
                    v-for="edge in edges"
                    :key="edge.id"
                    :d="edgePath(edge)"
                    :stroke="edge.style?.stroke || '#666'"
                    :stroke-width="edge.style?.strokeWidth || 2"
                    :stroke-dasharray="edge.style?.lineStyle === 'dashed' ? '5,5' : edge.style?.lineStyle === 'dotted' ? '2,2' : ''"
                    fill="none"
                    :class="{ 'edge-selected': isEdgeSelected(edge.id) }"
                    @click="(e) => handleEdgeClick(e, edge.id)"
                />
                <!-- 边标签 -->
                <text
                    v-for="edge in edges.filter(e => e.label)"
                    :key="'label-' + edge.id"
                    :x="(getPortPosition(nodes.find(n => n.id === edge.source) || nodes[0], edge.sourcePort || 'right').x + getPortPosition(nodes.find(n => n.id === edge.target) || nodes[0], edge.targetPort || 'left').x) / 2"
                    :y="(getPortPosition(nodes.find(n => n.id === edge.source) || nodes[0], edge.sourcePort || 'right').y + getPortPosition(nodes.find(n => n.id === edge.target) || nodes[0], edge.targetPort || 'left').y) / 2"
                    :fill="edge.style?.textColor || '#333'"
                    :font-size="edge.style?.fontSize || 12"
                    text-anchor="middle"
                >
                    {{ edge.label }}
                </text>
            </g>

            <!-- 连线临时预览 -->
            <path
                v-if="connecting && connectingPath"
                :d="`M${getPortPosition(nodes.find(n => n.id === connecting.fromNodeId) || nodes[0], connecting.fromPortId || 'right').x},${getPortPosition(nodes.find(n => n.id === connecting.fromNodeId) || nodes[0], connecting.fromPortId || 'right').y} L${connecting.toX},${connecting.toY}`"
                stroke="#1890FF"
                stroke-width="2"
                stroke-dasharray="5,5"
                fill="none"
            />

            <!-- 节点 -->
            <g
                v-for="node in nodes"
                :key="node.id"
                :transform="`translate(${node.x},${node.y})`"
                :data-node-id="node.id"
                :class="{ 'node-selected': isSelected(node), 'node-locked': node.locked }"
                @click="(e) => handleNodeClick(e, node)"
                @mousedown="(e) => startNodeDrag(e, node)"
            >
                <!-- 形状 -->
                <path
                    v-if="node.shape !== 'image' && node.shape !== 'text'"
                    :d="nodeShapePath(node)"
                    :fill="node.style?.fill || '#FFFFFF'"
                    :stroke="isSelected(node) ? '#1890FF' : (node.style?.stroke || '#333')"
                    :stroke-width="isSelected(node) ? 2 : (node.style?.strokeWidth || 1)"
                    :opacity="node.style?.opacity ?? 1"
                />
                <!-- 图片 -->
                <image
                    v-else-if="node.shape === 'image' && node.style?.image"
                    :href="node.style.image"
                    :width="node.width"
                    :height="node.height"
                    preserveAspectRatio="xMidYMid meet"
                />
                <rect
                    v-else-if="node.shape === 'image'"
                    :width="node.width"
                    :height="node.height"
                    fill="#F5F5F5"
                    stroke="#D9D9D9"
                    stroke-width="1"
                />
                <!-- 文本 -->
                <text
                    v-if="node.text"
                    :x="nodeText(node).x"
                    :y="nodeText(node).y"
                    :fill="node.style?.textColor || '#333'"
                    :font-size="node.style?.fontSize || 13"
                    :font-weight="node.style?.fontWeight || 'normal'"
                    text-anchor="middle"
                    dominant-baseline="middle"
                >
                    {{ node.text }}
                </text>
                <!-- 端口 -->
                <template v-if="node.ports && designer.state.tool === 'connect'">
                    <circle
                        v-for="port in node.ports"
                        :key="port.id"
                        :cx="portRelativePos(node, port.id).x"
                        :cy="portRelativePos(node, port.id).y"
                        r="5"
                        fill="#1890FF"
                        stroke="#FFFFFF"
                        stroke-width="2"
                        class="node-port"
                        @mousedown.stop="(e) => startConnect(e, node, port.id)"
                    />
                </template>
            </g>
        </svg>
    </div>
</template>

<style lang="scss" scoped>
.diagram-canvas-wrapper {
    flex: 1;
    overflow: hidden;
    position: relative;
    background: #F5F5F5;

    svg {
        width: 100%;
        height: 100%;
        display: block;
    }

    :deep(.node-selected) {
        filter: drop-shadow(0 0 4px rgba(24, 144, 255, 0.5));
    }

    :deep(.edge-selected) {
        stroke: #1890FF !important;
        stroke-width: 3 !important;
    }

    :deep(.node-port) {
        cursor: crosshair;
        opacity: 0.8;

        &:hover {
            opacity: 1;
            r: 7;
        }
    }
}
</style>
