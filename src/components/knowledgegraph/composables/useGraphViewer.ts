/**
 * 知识图谱查看器 - 状态管理
 *
 * graph / viewport / selectedNode / highlightNodes / path / search / collapse
 */

import { computed, reactive, ref } from "vue";
import {
    KG_DEFAULT_VIEWPORT,
    KG_ZOOM_MAX,
    KG_ZOOM_MIN,
    kgDefaultLayoutType,
} from "../constants";
import { kgBfsShortestPath, kgFindNeighborEdges, kgFindNeighbors } from "../utils/KgGraphAlgorithms";
import { kgCircleLayout, kgForceLayout, kgGridLayout } from "../utils/KgGraphLayout";
import type {
    KgGraph,
    KgLayoutType,
    KgNode,
    KgPoint,
    KgViewport,
} from "../types";

const createInitialViewerState = (graph?: Partial<KgGraph>) => ({
    graph: {
        id: `kg_${Date.now()}`,
        name: "",
        nodes: [],
        edges: [],
        ...graph,
    } as KgGraph,
    viewport: { ...KG_DEFAULT_VIEWPORT } as KgViewport,
    layout: kgDefaultLayoutType,
    selectedNodeId: null as string | null,
    selectedEdgeId: null as string | null,
    highlightNodeIds: [] as string[],
    pathNodeIds: [] as string[],
    searchKeyword: "",
    layoutRunning: false,
    collapsedNodeIds: [] as string[],
    pathFromId: null as string | null,
    pathToId: null as string | null,
});

export function useGraphViewer(initial?: Partial<KgGraph>) {
    const state = reactive(createInitialViewerState(initial));

    // 触发响应式刷新的计数器（用于 force 动画时强制重渲染）
    const tickCount = ref(0);

    const selectedNode = computed<KgNode | null>(() =>
        state.selectedNodeId
            ? state.graph.nodes.find((n) => n.id === state.selectedNodeId) ?? null
            : null,
    );

    const visibleNodes = computed(() =>
        state.graph.nodes.filter((n) => n.visible !== false),
    );

    const visibleEdges = computed(() =>
        state.graph.edges.filter(
            (e) =>
                e.visible !== false &&
                state.graph.nodes.find((n) => n.id === e.source && n.visible !== false) &&
                state.graph.nodes.find((n) => n.id === e.target && n.visible !== false),
        ),
    );

    const stats = computed(() => ({
        total: state.graph.nodes.length,
        visible: visibleNodes.value.length,
        selected: state.selectedNodeId ? 1 : 0,
        edges: state.graph.edges.length,
    }));

    /** 选中节点 */
    const selectNode = (id: string | null) => {
        state.selectedNodeId = id;
        if (id) state.selectedEdgeId = null;
    };

    /** 选中边 */
    const selectEdge = (id: string | null) => {
        state.selectedEdgeId = id;
        if (id) state.selectedNodeId = null;
    };

    /** 高亮节点集合 */
    const setHighlight = (ids: string[]) => {
        state.highlightNodeIds = ids;
    };

    /** 清空高亮 */
    const clearHighlight = () => {
        state.highlightNodeIds = [];
        state.pathNodeIds = [];
    };

    /** 设置搜索关键字，并高亮匹配节点 */
    const setSearch = (keyword: string) => {
        state.searchKeyword = keyword;
        if (!keyword.trim()) {
            state.highlightNodeIds = state.pathNodeIds.slice();
            return;
        }
        const lower = keyword.toLowerCase();
        state.highlightNodeIds = state.graph.nodes
            .filter(
                (n) =>
                    n.label.toLowerCase().includes(lower) ||
                    String(n.id).toLowerCase().includes(lower) ||
                    JSON.stringify(n.properties || {})
                        .toLowerCase()
                        .includes(lower),
            )
            .map((n) => n.id);
    };

    /** 计算最短路径 */
    const findPath = (fromId: string, toId: string): string[] => {
        const path = kgBfsShortestPath(state.graph, fromId, toId);
        state.pathNodeIds = path;
        state.highlightNodeIds = path.slice();
        return path;
    };

    /** 设置路径起终点 */
    const setPathEndpoints = (fromId: string | null, toId: string | null) => {
        state.pathFromId = fromId;
        state.pathToId = toId;
    };

    /** 展开邻居（取消折叠） */
    const expandNeighbors = (nodeId: string) => {
        const idx = state.collapsedNodeIds.indexOf(nodeId);
        if (idx >= 0) state.collapsedNodeIds.splice(idx, 1);
        const node = state.graph.nodes.find((n) => n.id === nodeId);
        if (node) node.collapsed = false;
    };

    /** 折叠邻居 */
    const collapseNeighbors = (nodeId: string) => {
        if (!state.collapsedNodeIds.includes(nodeId)) {
            state.collapsedNodeIds.push(nodeId);
        }
        const node = state.graph.nodes.find((n) => n.id === nodeId);
        if (node) node.collapsed = true;
    };

    /** 切换折叠状态 */
    const toggleCollapse = (nodeId: string) => {
        if (state.collapsedNodeIds.includes(nodeId)) {
            expandNeighbors(nodeId);
        } else {
            collapseNeighbors(nodeId);
        }
    };

    /** 获取邻居（用于详情面板） */
    const getNeighbors = (nodeId: string) => kgFindNeighbors(state.graph, nodeId);
    const getNeighborEdges = (nodeId: string) => kgFindNeighborEdges(state.graph, nodeId);

    /** 缩放 */
    const setZoom = (zoom: number) => {
        state.viewport.zoom = Math.max(KG_ZOOM_MIN, Math.min(KG_ZOOM_MAX, zoom));
    };
    const zoomIn = () => setZoom(state.viewport.zoom + 0.1);
    const zoomOut = () => setZoom(state.viewport.zoom - 0.1);
    const zoomReset = () => {
        setZoom(1);
        state.viewport.panX = 0;
        state.viewport.panY = 0;
    };
    const fitView = () => {
        if (state.graph.nodes.length === 0) {
            zoomReset();
            return;
        }
        const minX = Math.min(...state.graph.nodes.map((n) => n.x));
        const maxX = Math.max(...state.graph.nodes.map((n) => n.x));
        const minY = Math.min(...state.graph.nodes.map((n) => n.y));
        const maxY = Math.max(...state.graph.nodes.map((n) => n.y));
        const padding = 80;
        const w = maxX - minX + padding * 2;
        const h = maxY - minY + padding * 2;
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const viewW = 1000;
        const viewH = 700;
        const zoom = Math.max(KG_ZOOM_MIN, Math.min(KG_ZOOM_MAX, Math.min(viewW / w, viewH / h)));
        setZoom(zoom);
        state.viewport.panX = viewW / 2 - cx * zoom;
        state.viewport.panY = viewH / 2 - cy * zoom;
    };
    const setPan = (x: number, y: number) => {
        state.viewport.panX = x;
        state.viewport.panY = y;
    };

    /** 设置布局类型 */
    const setLayout = (layout: KgLayoutType) => {
        state.layout = layout;
    };

    /** 应用布局 */
    const applyLayout = (center: KgPoint = { x: 500, y: 350 }) => {
        const nodes = state.graph.nodes;
        let positions: Map<string, KgPoint>;
        if (state.layout === "circle") {
            positions = kgCircleLayout(nodes, { centerX: center.x, centerY: center.y, radius: 260 });
        } else if (state.layout === "grid") {
            positions = kgGridLayout(nodes, { startX: 80, startY: 80, cellWidth: 160, cellHeight: 120 });
        } else {
            positions = kgForceLayout(nodes, state.graph.edges, { center, iterations: 300 });
        }
        nodes.forEach((n) => {
            const p = positions.get(n.id);
            if (p) {
                n.x = p.x;
                n.y = p.y;
            }
        });
        tickCount.value++;
    };

    /** 节点拖拽：更新位置 */
    const dragNode = (id: string, x: number, y: number) => {
        const node = state.graph.nodes.find((n) => n.id === id);
        if (node) {
            node.x = x;
            node.y = y;
            tickCount.value++;
        }
    };

    /** 加载图谱 */
    const loadGraph = (graph: KgGraph) => {
        state.graph = JSON.parse(JSON.stringify(graph));
        state.selectedNodeId = null;
        state.selectedEdgeId = null;
        state.highlightNodeIds = [];
        state.pathNodeIds = [];
        state.collapsedNodeIds = [];
        state.searchKeyword = "";
        tickCount.value++;
    };

    /** 获取当前图谱 */
    const getGraph = (): KgGraph => JSON.parse(JSON.stringify(state.graph));

    /** 强制刷新 */
    const forceTick = () => {
        tickCount.value++;
    };

    return {
        state,
        tickCount,
        selectedNode,
        visibleNodes,
        visibleEdges,
        stats,
        selectNode,
        selectEdge,
        setHighlight,
        clearHighlight,
        setSearch,
        findPath,
        setPathEndpoints,
        expandNeighbors,
        collapseNeighbors,
        toggleCollapse,
        getNeighbors,
        getNeighborEdges,
        setZoom,
        zoomIn,
        zoomOut,
        zoomReset,
        fitView,
        setPan,
        setLayout,
        applyLayout,
        dragNode,
        loadGraph,
        getGraph,
        forceTick,
    };
}

export type UseGraphViewerReturn = ReturnType<typeof useGraphViewer>;
