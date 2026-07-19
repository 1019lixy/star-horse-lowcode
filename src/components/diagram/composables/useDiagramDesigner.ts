/**
 * 通用图编辑器 - 状态管理
 */

import { computed, reactive } from "vue";
import { DEFAULT_CANVAS, MAX_HISTORY, createNode } from "../constants";
import type { DiagramData, DiagramDesignerState, DiagramEdge, DiagramNode, NodeTypePreset } from "../types";

const createInitialDiagram = (): DiagramData => ({
    id: `dg_${Date.now()}`,
    name: "",
    nodes: [],
    edges: [],
    layers: [
        {
            id: "layer_default",
            name: "Default",
            visible: true,
            locked: false,
            nodeIds: [],
            edgeIds: [],
        },
    ],
    activeLayerId: "layer_default",
    canvas: { ...DEFAULT_CANVAS },
});

const createInitialState = (diagram?: Partial<DiagramData>): DiagramDesignerState => {
    const dg = { ...createInitialDiagram(), ...diagram };
    return {
        diagram: dg,
        selectedNodeIds: [],
        selectedEdgeIds: [],
        history: [JSON.parse(JSON.stringify(dg))],
        historyIndex: 0,
        readonly: false,
        tool: "select",
        connecting: null,
        clipboard: [],
    };
};

export function useDiagramDesigner(initial?: Partial<DiagramData>) {
    const state = reactive<DiagramDesignerState>(createInitialState(initial));

    const selectedNodes = computed<DiagramNode[]>(() =>
        state.diagram.nodes.filter((n) => state.selectedNodeIds.includes(n.id)),
    );
    const selectedNode = computed<DiagramNode | null>(() =>
        selectedNodes.value.length === 1 ? selectedNodes.value[0] : null,
    );
    const selectedEdges = computed<DiagramEdge[]>(() =>
        state.diagram.edges.filter((e) => state.selectedEdgeIds.includes(e.id)),
    );

    const selectNode = (id: string | null, multi = false) => {
        if (id === null) {
            state.selectedNodeIds = [];
            return;
        }
        if (multi) {
            const idx = state.selectedNodeIds.indexOf(id);
            if (idx >= 0) state.selectedNodeIds.splice(idx, 1);
            else state.selectedNodeIds.push(id);
        } else {
            state.selectedNodeIds = [id];
            state.selectedEdgeIds = [];
        }
    };

    const selectEdge = (id: string | null, multi = false) => {
        if (id === null) {
            state.selectedEdgeIds = [];
            return;
        }
        if (multi) {
            const idx = state.selectedEdgeIds.indexOf(id);
            if (idx >= 0) state.selectedEdgeIds.splice(idx, 1);
            else state.selectedEdgeIds.push(id);
        } else {
            state.selectedEdgeIds = [id];
            state.selectedNodeIds = [];
        }
    };

    const clearSelection = () => {
        state.selectedNodeIds = [];
        state.selectedEdgeIds = [];
    };

    const addNode = (preset: NodeTypePreset, x: number, y: number): DiagramNode => {
        const node = createNode(preset, x, y);
        state.diagram.nodes.push(node);
        const layer = state.diagram.layers.find((l) => l.id === state.diagram.activeLayerId);
        layer?.nodeIds.push(node.id);
        state.selectedNodeIds = [node.id];
        pushHistory();
        return node;
    };

    const updateNode = (id: string, patch: Partial<DiagramNode>) => {
        const node = state.diagram.nodes.find((n) => n.id === id);
        if (!node) return;
        Object.assign(node, patch);
    };

    const updateNodeStyle = (id: string, patch: Record<string, any>) => {
        const node = state.diagram.nodes.find((n) => n.id === id);
        if (!node) return;
        node.style = { ...(node.style || {}), ...patch };
    };

    const deleteNodes = (ids: string[] = state.selectedNodeIds) => {
        if (ids.length === 0) return;
        state.diagram.nodes = state.diagram.nodes.filter((n) => !ids.includes(n.id));
        state.diagram.edges = state.diagram.edges.filter((e) => !ids.includes(e.source) && !ids.includes(e.target));
        state.diagram.layers.forEach((l) => {
            l.nodeIds = l.nodeIds.filter((id) => !ids.includes(id));
            l.edgeIds = l.edgeIds.filter((id) => state.diagram.edges.find((e) => e.id === id));
        });
        state.selectedNodeIds = state.selectedNodeIds.filter((id) => !ids.includes(id));
        pushHistory();
    };

    const removeNode = (id: string) => {
        deleteNodes([id]);
    };

    const addEdge = (edge: Omit<DiagramEdge, "id">): DiagramEdge => {
        const newEdge: DiagramEdge = {
            ...edge,
            id: `edge_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        };
        state.diagram.edges.push(newEdge);
        const layer = state.diagram.layers.find((l) => l.id === state.diagram.activeLayerId);
        layer?.edgeIds.push(newEdge.id);
        pushHistory();
        return newEdge;
    };

    const updateEdge = (id: string, patch: Partial<DiagramEdge>) => {
        const edge = state.diagram.edges.find((e) => e.id === id);
        if (!edge) return;
        Object.assign(edge, patch);
    };

    const deleteEdges = (ids: string[] = state.selectedEdgeIds) => {
        if (ids.length === 0) return;
        state.diagram.edges = state.diagram.edges.filter((e) => !ids.includes(e.id));
        state.diagram.layers.forEach((l) => {
            l.edgeIds = l.edgeIds.filter((id) => !ids.includes(id));
        });
        state.selectedEdgeIds = state.selectedEdgeIds.filter((id) => !ids.includes(id));
        pushHistory();
    };

    const removeEdge = (id: string) => {
        deleteEdges([id]);
    };

    // 全选
    const selectAll = () => {
        state.selectedNodeIds = state.diagram.nodes.map((n) => n.id);
        state.selectedEdgeIds = [];
    };

    // 移动节点
    const moveNode = (id: string, dx: number, dy: number) => {
        const node = state.diagram.nodes.find((n) => n.id === id);
        if (!node || node.locked) return;
        node.x = snapValue(node.x + dx);
        node.y = snapValue(node.y + dy);
    };

    // 复制/粘贴
    const copySelected = () => {
        const nodes = selectedNodes.value;
        if (nodes.length === 0 && selectedEdges.value.length === 0) return;
        state.clipboard = JSON.parse(JSON.stringify(nodes));
    };

    const paste = () => {
        if (state.clipboard.length === 0) return;
        const offset = 20;
        const newNodeIds: Record<string, string> = {};
        state.selectedNodeIds = [];
        for (const clipNode of state.clipboard) {
            const newId = `node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            newNodeIds[clipNode.id] = newId;
            const node: DiagramNode = {
                ...clipNode,
                id: newId,
                x: clipNode.x + offset,
                y: clipNode.y + offset,
            };
            state.diagram.nodes.push(node);
            const layer = state.diagram.layers.find((l) => l.id === state.diagram.activeLayerId);
            layer?.nodeIds.push(node.id);
            state.selectedNodeIds.push(node.id);
        }
        pushHistory();
    };

    // 置顶/置底
    const bringToFront = (id: string) => {
        const idx = state.diagram.nodes.findIndex((n) => n.id === id);
        if (idx < 0) return;
        const [node] = state.diagram.nodes.splice(idx, 1);
        state.diagram.nodes.push(node);
        pushHistory();
    };

    const sendToBack = (id: string) => {
        const idx = state.diagram.nodes.findIndex((n) => n.id === id);
        if (idx < 0) return;
        const [node] = state.diagram.nodes.splice(idx, 1);
        state.diagram.nodes.unshift(node);
        pushHistory();
    };

    // 历史
    const pushHistory = () => {
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push(JSON.parse(JSON.stringify(state.diagram)));
        if (state.history.length > MAX_HISTORY) {
            state.history.shift();
        } else {
            state.historyIndex++;
        }
    };

    const undo = () => {
        if (state.historyIndex <= 0) return;
        state.historyIndex--;
        state.diagram = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        clearSelection();
    };

    const redo = () => {
        if (state.historyIndex >= state.history.length - 1) return;
        state.historyIndex++;
        state.diagram = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        clearSelection();
    };

    const canUndo = computed(() => state.historyIndex > 0);
    const canRedo = computed(() => state.historyIndex < state.history.length - 1);

    // 工具
    const setTool = (tool: typeof state.tool) => {
        state.tool = tool;
    };

    // 画布
    const setZoom = (zoom: number) => {
        state.diagram.canvas.zoom = Math.max(0.2, Math.min(4, zoom));
    };
    const zoomIn = () => setZoom(state.diagram.canvas.zoom + 0.1);
    const zoomOut = () => setZoom(state.diagram.canvas.zoom - 0.1);
    const zoomReset = () => {
        setZoom(1);
        state.diagram.canvas.panX = 0;
        state.diagram.canvas.panY = 0;
    };
    const setPan = (x: number, y: number) => {
        state.diagram.canvas.panX = x;
        state.diagram.canvas.panY = y;
    };
    const toggleGrid = () => {
        state.diagram.canvas.showGrid = !state.diagram.canvas.showGrid;
    };
    const toggleSnap = () => {
        state.diagram.canvas.snap = !state.diagram.canvas.snap;
    };

    // 模板
    const loadDiagram = (dg: DiagramData) => {
        state.diagram = JSON.parse(JSON.stringify(dg));
        clearSelection();
        state.history = [JSON.parse(JSON.stringify(state.diagram))];
        state.historyIndex = 0;
    };

    const getDiagram = (): DiagramData => JSON.parse(JSON.stringify(state.diagram));

    const clearDiagram = () => {
        state.diagram.nodes = [];
        state.diagram.edges = [];
        state.diagram.layers.forEach((l) => {
            l.nodeIds = [];
            l.edgeIds = [];
        });
        clearSelection();
        pushHistory();
    };

    const snapValue = (v: number): number => {
        if (!state.diagram.canvas.snap) return v;
        return Math.round(v / state.diagram.canvas.snapThreshold) * state.diagram.canvas.snapThreshold;
    };

    // 适应画布
    const fitView = () => {
        if (state.diagram.nodes.length === 0) {
            zoomReset();
            return;
        }
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const n of state.diagram.nodes) {
            minX = Math.min(minX, n.x);
            minY = Math.min(minY, n.y);
            maxX = Math.max(maxX, n.x + n.width);
            maxY = Math.max(maxY, n.y + n.height);
        }
        const padding = 50;
        minX -= padding;
        minY -= padding;
        maxX += padding;
        maxY += padding;
        const contentW = maxX - minX;
        const contentH = maxY - minY;
        if (contentW <= 0 || contentH <= 0) return;
        const zoom = Math.min(800 / contentW, 600 / contentH, 2);
        setZoom(zoom);
        state.diagram.canvas.panX = -minX * zoom;
        state.diagram.canvas.panY = -minY * zoom;
    };

    return {
        state,
        selectedNodes,
        selectedNode,
        selectedEdges,
        selectNode,
        selectEdge,
        clearSelection,
        addNode,
        updateNode,
        updateNodeStyle,
        deleteNodes,
        removeNode,
        addEdge,
        updateEdge,
        deleteEdges,
        removeEdge,
        selectAll,
        moveNode,
        copySelected,
        paste,
        bringToFront,
        sendToBack,
        undo,
        redo,
        canUndo,
        canRedo,
        pushHistory,
        setTool,
        setZoom,
        zoomIn,
        zoomOut,
        zoomReset,
        setPan,
        toggleGrid,
        toggleSnap,
        fitView,
        loadDiagram,
        getDiagram,
        clearDiagram,
        snapValue,
    };
}

export type UseDiagramDesignerReturn = ReturnType<typeof useDiagramDesigner>;
