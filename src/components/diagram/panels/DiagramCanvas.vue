<script setup lang="ts" name="DiagramCanvas">
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { i18n } from "@/lang";
import { getPortPosition, getShapePath } from "../constants";
import type { DiagramNode, DiagramEdge, NodeTypePreset } from "../types";
import type { UseDiagramDesignerReturn } from "../composables/useDiagramDesigner";

const props = defineProps<{
    designer: UseDiagramDesignerReturn;
}>();

const canvasRef = ref<HTMLElement>();

const nodes = computed(() => props.designer.state.diagram.nodes);
const edges = computed(() => props.designer.state.diagram.edges);
const canvas = computed(() => props.designer.state.diagram.canvas);
const selectedNodeIds = computed(() => props.designer.state.selectedNodeIds);
const selectedEdgeIds = computed(() => props.designer.state.selectedEdgeIds);

const svgWidth = ref(1000);
const svgHeight = ref(700);

const updateSize = () => {
    if (!canvasRef.value) return;
    const rect = canvasRef.value.getBoundingClientRect();
    svgWidth.value = rect.width;
    svgHeight.value = rect.height;
};

// 屏幕坐标 → SVG 坐标
const screenToSvg = (clientX: number, clientY: number): { x: number; y: number } => {
    if (!canvasRef.value) return { x: 0, y: 0 };
    const rect = canvasRef.value.getBoundingClientRect();
    return {
        x: (clientX - rect.left - canvas.value.panX) / canvas.value.zoom,
        y: (clientY - rect.top - canvas.value.panY) / canvas.value.zoom,
    };
};

// ======================== 拖放添加节点 ========================
const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer?.getData("diagram-node-type");
    if (!type) return;
    const preset = (window as any).__diagramDragPreset;
    if (preset && canvasRef.value) {
        const pos = screenToSvg(e.clientX, e.clientY);
        props.designer.addNode(preset as NodeTypePreset, props.designer.snapValue(pos.x), props.designer.snapValue(pos.y));
        (window as any).__diagramDragPreset = null;
    }
};

const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
};

// ======================== 节点点击 ========================
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
    contextMenu.value = { visible: false, x: 0, y: 0, items: [] };
};

// ======================== 节点拖动 ========================
const dragging = ref<{ id: string; startX: number; startY: number; origX: number; origY: number; moved: boolean } | null>(null);

const startNodeDrag = (e: MouseEvent, node: DiagramNode) => {
    if (props.designer.state.readonly || node.locked) return;
    // 不再限制只有 select 工具才能拖动，但连线模式下如果点在端口上则不拖动节点
    if (connecting.value) return;
    // 如果点击的是端口，不拖拽节点
    if ((e.target as Element).closest(".node-port")) return;
    if (!selectedNodeIds.value.includes(node.id)) {
        props.designer.selectNode(node.id);
    }
    dragging.value = {
        id: node.id,
        startX: e.clientX,
        startY: e.clientY,
        origX: node.x,
        origY: node.y,
        moved: false,
    };
    window.addEventListener("mousemove", onNodeMouseMove);
    window.addEventListener("mouseup", onNodeMouseUp);
};

const onNodeMouseMove = (e: MouseEvent) => {
    if (!dragging.value) return;
    const dx = (e.clientX - dragging.value.startX) / canvas.value.zoom;
    const dy = (e.clientY - dragging.value.startY) / canvas.value.zoom;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) dragging.value.moved = true;
    const newX = props.designer.snapValue(dragging.value.origX + dx);
    const newY = props.designer.snapValue(dragging.value.origY + dy);
    props.designer.updateNode(dragging.value.id, { x: newX, y: newY });
};

const onNodeMouseUp = () => {
    if (dragging.value?.moved) props.designer.pushHistory();
    dragging.value = null;
    window.removeEventListener("mousemove", onNodeMouseMove);
    window.removeEventListener("mouseup", onNodeMouseUp);
};

// ======================== 画布平移 ========================
const panning = ref<{ startX: number; startY: number; origPanX: number; origPanY: number } | null>(null);

const startPan = (e: MouseEvent) => {
    // 中键、alt+左键、或 pan 工具模式
    if (props.designer.state.tool !== "pan" && e.button !== 1 && !e.altKey) return;
    if (e.button === 0 && props.designer.state.tool !== "pan" && !e.altKey) return;
    e.preventDefault();
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

// ======================== 缩放滚轮 ========================
const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    props.designer.setZoom(canvas.value.zoom + delta);
};

// ======================== 连线拖拽 ========================
const connecting = ref<{ fromNodeId: string; fromPortId: string; toX: number; toY: number } | null>(null);
const hoveredNodeId = ref<string | null>(null);

const startConnect = (e: MouseEvent, node: DiagramNode, portId: string) => {
    if (props.designer.state.readonly) return;
    e.stopPropagation();
    e.preventDefault();
    const port = getPortPosition(node, portId);
    connecting.value = { fromNodeId: node.id, fromPortId: portId, toX: port.x, toY: port.y };
    window.addEventListener("mousemove", onConnectMove);
    window.addEventListener("mouseup", onConnectUp);
};

const onConnectMove = (e: MouseEvent) => {
    if (!connecting.value) return;
    const pos = screenToSvg(e.clientX, e.clientY);
    connecting.value.toX = pos.x;
    connecting.value.toY = pos.y;
};

const onConnectUp = (e: MouseEvent) => {
    if (connecting.value) {
        const target = (e.target as HTMLElement)?.closest("[data-node-id]")?.getAttribute("data-node-id")
            || (e.target as HTMLElement)?.closest("[data-port-node-id]")?.getAttribute("data-port-node-id");
        if (target && target !== connecting.value.fromNodeId) {
            // 自动判断目标端口
            const targetNode = nodes.value.find((n) => n.id === target);
            const targetPort = targetNode?.ports?.find((p) => p.position === "left")?.id || "left";
            props.designer.addEdge({
                source: connecting.value.fromNodeId,
                sourcePort: connecting.value.fromPortId,
                target,
                targetPort,
                type: "curve",
            });
        }
    }
    connecting.value = null;
    window.removeEventListener("mousemove", onConnectMove);
    window.removeEventListener("mouseup", onConnectUp);
};

// ======================== 计算边的路径 ========================
const edgePath = (edge: DiagramEdge): string => {
    const source = nodes.value.find((n) => n.id === edge.source);
    const target = nodes.value.find((n) => n.id === edge.target);
    if (!source || !target) return "";
    const sp = getPortPosition(source, edge.sourcePort || "right");
    const tp = getPortPosition(target, edge.targetPort || "left");
    switch (edge.type) {
        case "straight":
            return `M${sp.x},${sp.y} L${tp.x},${tp.y}`;
        case "curve": {
            const dx = tp.x - sp.x;
            const cx1 = sp.x + dx * 0.5;
            const cy1 = sp.y;
            const cx2 = tp.x - dx * 0.5;
            const cy2 = tp.y;
            return `M${sp.x},${sp.y} C${cx1},${cy1} ${cx2},${cy2} ${tp.x},${tp.y}`;
        }
        case "polyline":
            return `M${sp.x},${sp.y} L${(sp.x + tp.x) / 2},${sp.y} L${(sp.x + tp.x) / 2},${tp.y} L${tp.x},${tp.y}`;
        case "orthogonal":
        default: {
            const midX = (sp.x + tp.x) / 2;
            return `M${sp.x},${sp.y} L${midX},${sp.y} L${midX},${tp.y} L${tp.x},${tp.y}`;
        }
    }
};

// 箭头终点
const getEdgeArrow = (edge: DiagramEdge): string => {
    const target = nodes.value.find((n) => n.id === edge.target);
    if (!target) return "";
    const tp = getPortPosition(target, edge.targetPort || "left");
    const size = 8;
    return `M${tp.x},${tp.y} L${tp.x - size},${tp.y - size / 2} L${tp.x - size},${tp.y + size / 2} Z`;
};

// ======================== 连线临时预览路径 ========================
const connectingPathData = computed(() => {
    if (!connecting.value) return "";
    const c = connecting.value;
    const source = nodes.value.find((n) => n.id === c.fromNodeId);
    if (!source) return "";
    const sp = getPortPosition(source, c.fromPortId);
    const dx = c.toX - sp.x;
    const cx1 = sp.x + dx * 0.5;
    const cx2 = c.toX - dx * 0.5;
    return `M${sp.x},${sp.y} C${cx1},${sp.y} ${cx2},${c.toY} ${c.toX},${c.toY}`;
});

// ======================== 节点形状渲染 ========================
const nodeShapePath = (node: DiagramNode): string => {
    return getShapePath(node.shape, 0, 0, node.width, node.height);
};

const nodeText = (node: DiagramNode): { x: number; y: number } => {
    return { x: node.width / 2, y: node.height / 2 };
};

const isSelected = (node: DiagramNode): boolean => selectedNodeIds.value.includes(node.id);
const isEdgeSelected = (edgeId: string): boolean => selectedEdgeIds.value.includes(edgeId);

// ======================== 端口位置（相对节点坐标） ========================
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

// ======================== 框选 ========================
const boxSelect = ref<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
const isBoxSelecting = ref(false);

const boxSelectRect = computed(() => {
    if (!boxSelect.value) return null;
    const b = boxSelect.value;
    const x = Math.min(b.startX, b.endX);
    const y = Math.min(b.startY, b.endY);
    const w = Math.abs(b.endX - b.startX);
    const h = Math.abs(b.endY - b.startY);
    return { x, y, w, h };
});

const handleCanvasMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return;
    if (props.designer.state.tool === "pan") return;
    // 如果是在 alt 平移，不框选
    if (e.altKey) return;
    // 框选只在 select 工具模式下生效，且点击的是空白区域
    const target = e.target as HTMLElement;
    if (target.closest("[data-node-id]") || target.closest("[data-edge-id]")) return;

    const pos = screenToSvg(e.clientX, e.clientY);
    boxSelect.value = { startX: pos.x, startY: pos.y, endX: pos.x, endY: pos.y };
    isBoxSelecting.value = true;
    window.addEventListener("mousemove", onBoxSelectMove);
    window.addEventListener("mouseup", onBoxSelectUp);
};

const onBoxSelectMove = (e: MouseEvent) => {
    if (!boxSelect.value || !isBoxSelecting.value) return;
    const pos = screenToSvg(e.clientX, e.clientY);
    boxSelect.value.endX = pos.x;
    boxSelect.value.endY = pos.y;
};

const onBoxSelectUp = (e: MouseEvent) => {
    if (boxSelect.value && isBoxSelecting.value) {
        const rect = boxSelectRect.value;
        if (rect && rect.w > 5 && rect.h > 5) {
            // 选中框内的所有节点
            const selected: string[] = [];
            for (const node of nodes.value) {
                const nx = node.x;
                const ny = node.y;
                const nw = node.width;
                const nh = node.height;
                if (nx + nw > rect.x && nx < rect.x + rect.w && ny + nh > rect.y && ny < rect.y + rect.h) {
                    selected.push(node.id);
                }
            }
            if (selected.length > 0) {
                props.designer.state.selectedNodeIds = selected;
                props.designer.state.selectedEdgeIds = [];
            } else {
                props.designer.clearSelection();
            }
        }
    }
    boxSelect.value = null;
    isBoxSelecting.value = false;
    window.removeEventListener("mousemove", onBoxSelectMove);
    window.removeEventListener("mouseup", onBoxSelectUp);
};

// ======================== 右键菜单 ========================
interface ContextMenuItem {
    label: string;
    shortcut?: string;
    handler: () => void;
    divider?: boolean;
}

const contextMenu = ref<{ visible: boolean; x: number; y: number; items: ContextMenuItem[] }>({
    visible: false,
    x: 0,
    y: 0,
    items: [],
});

const hideContextMenu = () => {
    contextMenu.value.visible = false;
};

const showCanvasContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const items: ContextMenuItem[] = [
        { label: i18n("diagram.context.selectAll"), shortcut: "Ctrl+A", handler: () => { props.designer.selectAll(); hideContextMenu(); } },
        { label: i18n("diagram.context.paste"), shortcut: "Ctrl+V", handler: () => { props.designer.paste(); hideContextMenu(); } },
        { label: i18n("diagram.context.fitView"), handler: () => { props.designer.fitView(); hideContextMenu(); } },
    ];
    contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, items };
};

const showNodeContextMenu = (e: MouseEvent, node: DiagramNode) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedNodeIds.value.includes(node.id)) {
        props.designer.selectNode(node.id);
    }
    const items: ContextMenuItem[] = [
        { label: i18n("diagram.context.copy"), shortcut: "Ctrl+C", handler: () => { props.designer.copySelected(); hideContextMenu(); } },
        { label: i18n("diagram.context.paste"), shortcut: "Ctrl+V", handler: () => { props.designer.paste(); hideContextMenu(); } },
        { label: i18n("diagram.context.delete"), shortcut: "Delete", handler: () => { props.designer.deleteNodes(); hideContextMenu(); } },
        { label: i18n("diagram.context.bringToFront"), handler: () => { props.designer.bringToFront(node.id); hideContextMenu(); } },
        { label: i18n("diagram.context.sendToBack"), handler: () => { props.designer.sendToBack(node.id); hideContextMenu(); } },
    ];
    contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, items };
};

const showEdgeContextMenu = (e: MouseEvent, edge: DiagramEdge) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedEdgeIds.value.includes(edge.id)) {
        props.designer.selectEdge(edge.id);
    }
    const items: ContextMenuItem[] = [
        { label: i18n("diagram.context.delete"), shortcut: "Delete", handler: () => { props.designer.removeEdge(edge.id); hideContextMenu(); } },
    ];
    contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, items };
};

// ======================== 快捷键 ========================
const isInputFocused = () => {
    const el = document.activeElement;
    return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || (el as HTMLElement).contentEditable === "true");
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (isInputFocused()) return;

    // Delete / Backspace
    if ((e.key === "Delete" || e.key === "Backspace") && !isInputFocused()) {
        if (props.designer.state.selectedNodeIds.length > 0) {
            props.designer.deleteNodes();
        } else if (props.designer.state.selectedEdgeIds.length > 0) {
            props.designer.deleteEdges();
        }
        e.preventDefault();
        return;
    }

    // Ctrl+Z → 撤销
    if (e.ctrlKey && !e.shiftKey && e.key === "z") {
        props.designer.undo();
        e.preventDefault();
        return;
    }

    // Ctrl+Y / Ctrl+Shift+Z → 重做
    if ((e.ctrlKey && e.key === "y") || (e.ctrlKey && e.shiftKey && e.key === "z")) {
        props.designer.redo();
        e.preventDefault();
        return;
    }

    // Ctrl+A → 全选
    if (e.ctrlKey && e.key === "a") {
        props.designer.selectAll();
        e.preventDefault();
        return;
    }

    // Ctrl+C → 复制
    if (e.ctrlKey && e.key === "c") {
        props.designer.copySelected();
        e.preventDefault();
        return;
    }

    // Ctrl+V → 粘贴
    if (e.ctrlKey && e.key === "v") {
        props.designer.paste();
        e.preventDefault();
        return;
    }

    // Escape → 取消选中/取消连线
    if (e.key === "Escape") {
        if (connecting.value) {
            connecting.value = null;
        } else {
            props.designer.selectNode(null);
            props.designer.selectEdge(null);
        }
        hideContextMenu();
        return;
    }

    // 方向键 → 移动选中节点
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        const ids = props.designer.state.selectedNodeIds;
        if (ids.length === 0) return;
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        for (const nid of ids) {
            props.designer.moveNode(nid, dx, dy);
        }
        e.preventDefault();
        return;
    }
};

// ======================== 网格 ========================
const gridSize = computed(() => canvas.value.gridSize);

// ======================== 生命周期 ========================
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
    document.addEventListener("keydown", handleKeyDown);
    nextTick(updateSize);
    resizeObserver = new ResizeObserver(() => {
        updateSize();
    });
    if (canvasRef.value) resizeObserver.observe(canvasRef.value);
});

onBeforeUnmount(() => {
    document.removeEventListener("keydown", handleKeyDown);
    if (resizeObserver) resizeObserver.disconnect();
});
</script>

<template>
    <div
        class="diagram-canvas-wrapper"
        ref="canvasRef"
        @click="handleCanvasClick"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @mousedown="handleCanvasMouseDown"
        @mousedown.middle="startPan"
        @contextmenu="showCanvasContextMenu"
    >
        <svg
            :width="svgWidth"
            :height="svgHeight"
            :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
            preserveAspectRatio="xMinYMin meet"
            :style="{ background: canvas.backgroundColor, cursor: designer.state.tool === 'pan' ? 'grab' : (isBoxSelecting ? 'crosshair' : 'default') }"
            @wheel="handleWheel"
        >
            <!-- defs 在 g 外面，pattern 不受 scale 影响 -->
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
            <!-- 网格背景在 g 外面，用全屏 rect，不受 zoom/pan 影响 -->
            <rect
                v-if="canvas.showGrid"
                x="0"
                y="0"
                :width="svgWidth"
                :height="svgHeight"
                fill="url(#diagram-grid)"
            />

            <g :transform="`translate(${canvas.panX}, ${canvas.panY}) scale(${canvas.zoom})`">

            <!-- 边 -->
            <g class="edges-layer">
                <g v-for="edge in edges" :key="edge.id" :data-edge-id="edge.id">
                    <!-- 不可见的热区路径（宽 stroke，方便点击） -->
                    <path
                        :d="edgePath(edge)"
                        fill="none"
                        stroke="transparent"
                        stroke-width="12"
                        style="cursor: pointer"
                        @click.stop="(e) => handleEdgeClick(e, edge.id)"
                        @contextmenu.stop="(e) => showEdgeContextMenu(e, edge)"
                    />
                    <!-- 可见的边 -->
                    <path
                        :d="edgePath(edge)"
                        fill="none"
                        :stroke="isEdgeSelected(edge.id) ? '#409EFF' : (edge.style?.stroke || '#666')"
                        :stroke-width="isEdgeSelected(edge.id) ? 2.5 : (edge.style?.strokeWidth || 1.5)"
                        :stroke-dasharray="edge.style?.lineStyle === 'dashed' ? '6 3' : edge.style?.lineStyle === 'dotted' ? '2 2' : 'none'"
                        class="edge-path"
                        style="pointer-events: none"
                    />
                    <!-- 箭头 -->
                    <path
                        :d="getEdgeArrow(edge)"
                        :fill="isEdgeSelected(edge.id) ? '#409EFF' : (edge.style?.stroke || '#666')"
                        style="pointer-events: none"
                    />
                    <!-- 边标签 -->
                    <text
                        v-if="edge.label"
                        :x="(getPortPosition(nodes.find(n => n.id === edge.source)!, edge.sourcePort || 'right').x + getPortPosition(nodes.find(n => n.id === edge.target)!, edge.targetPort || 'left').x) / 2"
                        :y="(getPortPosition(nodes.find(n => n.id === edge.source)!, edge.sourcePort || 'right').y + getPortPosition(nodes.find(n => n.id === edge.target)!, edge.targetPort || 'left').y) / 2 - 6"
                        :fill="edge.style?.textColor || '#333'"
                        :font-size="edge.style?.fontSize || 12"
                        text-anchor="middle"
                        style="pointer-events: none"
                    >
                        {{ edge.label }}
                    </text>
                    <!-- 选中边端点手柄 -->
                    <template v-if="isEdgeSelected(edge.id)">
                        <circle
                            :cx="getPortPosition(nodes.find(n => n.id === edge.source)!, edge.sourcePort || 'right').x"
                            :cy="getPortPosition(nodes.find(n => n.id === edge.source)!, edge.sourcePort || 'right').y"
                            r="4" fill="#409EFF" stroke="#fff" stroke-width="1.5"
                        />
                        <circle
                            :cx="getPortPosition(nodes.find(n => n.id === edge.target)!, edge.targetPort || 'left').x"
                            :cy="getPortPosition(nodes.find(n => n.id === edge.target)!, edge.targetPort || 'left').y"
                            r="4" fill="#409EFF" stroke="#fff" stroke-width="1.5"
                        />
                    </template>
                </g>
            </g>

            <!-- 连线临时预览 -->
            <path
                v-if="connecting && connectingPathData"
                :d="connectingPathData"
                stroke="#409EFF"
                stroke-width="2"
                stroke-dasharray="6 3"
                fill="none"
                style="pointer-events: none"
            />

            <!-- 节点 -->
            <g
                v-for="node in nodes"
                :key="node.id"
                :transform="`translate(${node.x},${node.y})`"
                :data-node-id="node.id"
                :class="{ 'node-selected': isSelected(node), 'node-locked': node.locked }"
                @click.stop="(e) => handleNodeClick(e, node)"
                @mousedown.stop="(e) => startNodeDrag(e, node)"
                @contextmenu.stop="(e) => showNodeContextMenu(e, node)"
                @mouseenter="hoveredNodeId = node.id"
                @mouseleave="hoveredNodeId = null"
            >
                <!-- 形状 -->
                <path
                    v-if="node.shape !== 'image' && node.shape !== 'text'"
                    :d="nodeShapePath(node)"
                    :fill="node.style?.fill || '#FFFFFF'"
                    :stroke="isSelected(node) ? '#409EFF' : (node.style?.stroke || '#333')"
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
                    style="pointer-events: none"
                >
                    {{ node.text }}
                </text>
                <!-- 端口 - 始终显示 -->
                <template v-if="node.ports">
                    <g
                        v-for="port in node.ports"
                        :key="port.id"
                        :data-port-node-id="node.id"
                        class="node-port"
                    >
                        <circle
                            :cx="portRelativePos(node, port.id).x"
                            :cy="portRelativePos(node, port.id).y"
                            r="4"
                            fill="#409EFF"
                            stroke="#FFFFFF"
                            stroke-width="1.5"
                            class="port-circle"
                            @mousedown.stop="(e) => startConnect(e, node, port.id)"
                        />
                    </g>
                </template>
            </g>

            <!-- 框选矩形 -->
            <rect
                v-if="boxSelectRect && isBoxSelecting"
                :x="boxSelectRect.x"
                :y="boxSelectRect.y"
                :width="boxSelectRect.w"
                :height="boxSelectRect.h"
                fill="rgba(64, 158, 255, 0.1)"
                stroke="#409EFF"
                stroke-width="1"
                stroke-dasharray="4 2"
                style="pointer-events: none"
            />
            </g>
        </svg>

        <!-- 右键菜单 -->
        <div
            v-if="contextMenu.visible"
            class="context-menu"
            :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
            @click.stop
        >
            <template v-for="(item, idx) in contextMenu.items" :key="idx">
                <div class="menu-item" @click="item.handler">
                    <span class="menu-label">{{ item.label }}</span>
                    <span class="menu-shortcut" v-if="item.shortcut">{{ item.shortcut }}</span>
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.diagram-canvas-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    background: #F5F5F5;

    svg {
        width: 100%;
        height: 100%;
        display: block;
    }

    :deep(.node-selected) {
        filter: drop-shadow(0 0 4px rgba(64, 158, 255, 0.5));
    }

    :deep(.edge-selected) {
        stroke: #409EFF !important;
        stroke-width: 3 !important;
    }

    :deep(.node-port) {
        .port-circle {
            cursor: crosshair;
            opacity: 0.3;
            transition: opacity 0.15s;
        }

        &:hover .port-circle {
            opacity: 1;
        }
    }

    :deep(.node-selected) .node-port .port-circle,
    g:hover > g[data-node-id] .node-port .port-circle {
        opacity: 0.7;
    }
}

.context-menu {
    position: fixed;
    z-index: 9999;
    background: var(--el-bg-color-overlay, #fff);
    border: 1px solid var(--el-border-color-lighter, #ddd);
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 4px 0;
    min-width: 160px;

    .menu-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 16px;
        cursor: pointer;
        font-size: 13px;
        color: var(--el-text-color-regular, #333);
        white-space: nowrap;
        transition: background 0.15s;

        &:hover {
            background: var(--el-fill-color-light, #f5f7fa);
        }

        .menu-label {
            flex: 1;
        }

        .menu-shortcut {
            margin-left: 24px;
            color: var(--el-text-color-secondary, #999);
            font-size: 12px;
        }
    }
}
</style>
