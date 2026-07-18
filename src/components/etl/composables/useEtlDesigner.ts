/**
 * ETL 管道设计器状态管理
 */
import { reactive, ref } from "vue";
import { createEdge, createEtlNode, createPipeline, findPreset, NODE_HEIGHT, NODE_WIDTH } from "../constants";
import type { EtlEdge, EtlNode, EtlPipeline, EtlNodeType } from "../types";

export const useEtlDesigner = (initial?: Partial<EtlPipeline>) => {
    const state = reactive<EtlPipeline>(createPipeline(initial ?? {}));
    const selectedNodeId = ref<string | null>(null);
    const selectedEdgeId = ref<string | null>(null);
    /** 连线拖拽起始节点 */
    const connectingFrom = ref<string | null>(null);

    const selectedNode = ref<EtlNode | null>(null);

    const selectNode = (id: string | null) => {
        selectedNodeId.value = id;
        selectedEdgeId.value = null;
        selectedNode.value = id ? state.nodes.find((n) => n.id === id) ?? null : null;
    };

    const selectEdge = (id: string | null) => {
        selectedEdgeId.value = id;
        selectedNodeId.value = null;
        selectedNode.value = null;
    };

    const addNode = (type: EtlNodeType, x = 100, y = 100): EtlNode => {
        const node = createEtlNode(type, x, y);
        state.nodes.push(node);
        selectNode(node.id);
        return node;
    };

    const updateNode = (id: string, updates: Partial<EtlNode>) => {
        const n = state.nodes.find((nn) => nn.id === id);
        if (!n) return;
        Object.assign(n, updates);
        state.updatedAt = new Date().toISOString();
    };

    const updateNodeConfig = (id: string, configUpdates: Record<string, any>) => {
        const n = state.nodes.find((nn) => nn.id === id);
        if (!n) return;
        Object.assign(n.config, configUpdates);
        state.updatedAt = new Date().toISOString();
    };

    const removeNode = (id: string) => {
        const idx = state.nodes.findIndex((n) => n.id === id);
        if (idx < 0) return;
        state.nodes.splice(idx, 1);
        // 删除关联的边
        const remainEdges: EtlEdge[] = [];
        for (const e of state.edges) {
            if (e.source !== id && e.target !== id) {
                remainEdges.push(e);
            }
        }
        state.edges.splice(0, state.edges.length, ...remainEdges);
        if (selectedNodeId.value === id) selectNode(null);
    };

    const addEdge = (source: string, target: string, sourcePort?: string, targetPort?: string): EtlEdge | null => {
        // 不允许自环
        if (source === target) return null;
        // 不允许重复
        if (state.edges.some((e) => e.source === source && e.target === target && (e.sourcePort ?? "") === (sourcePort ?? "") && (e.targetPort ?? "") === (targetPort ?? ""))) {
            return null;
        }
        // 目标节点必须是可输入的
        const targetNode = state.nodes.find((n) => n.id === target);
        if (!targetNode) return null;
        const targetPreset = findPreset(targetNode.type);
        if (targetPreset && targetPreset.inputs === 0) return null;
        // 源节点必须是可输出的
        const sourceNode = state.nodes.find((n) => n.id === source);
        if (!sourceNode) return null;
        const sourcePreset = findPreset(sourceNode.type);
        if (sourcePreset && sourcePreset.outputs === 0) return null;
        const edge = createEdge(source, target, sourcePort, targetPort);
        state.edges.push(edge);
        return edge;
    };

    const removeEdge = (id: string) => {
        const idx = state.edges.findIndex((e) => e.id === id);
        if (idx < 0) return;
        state.edges.splice(idx, 1);
        if (selectedEdgeId.value === id) selectEdge(null);
    };

    const moveNode = (id: string, x: number, y: number) => {
        const n = state.nodes.find((nn) => nn.id === id);
        if (!n) return;
        n.x = x;
        n.y = y;
    };

    const startConnect = (nodeId: string) => {
        connectingFrom.value = nodeId;
    };

    const finishConnect = (targetId: string): EtlEdge | null => {
        if (!connectingFrom.value) return null;
        const edge = addEdge(connectingFrom.value, targetId);
        connectingFrom.value = null;
        return edge;
    };

    const cancelConnect = () => {
        connectingFrom.value = null;
    };

    /** 获取节点的输入端口位置（顶部中央） */
    const getInputPortPos = (node: EtlNode) => ({
        x: node.x + NODE_WIDTH / 2,
        y: node.y,
    });

    /** 获取节点的输出端口位置（底部中央） */
    const getOutputPortPos = (node: EtlNode) => ({
        x: node.x + NODE_WIDTH / 2,
        y: node.y + NODE_HEIGHT,
    });

    /** 重置所有节点状态 */
    const resetStatus = () => {
        for (const n of state.nodes) {
            n.status = "idle";
            n.rowCount = undefined;
            n.error = undefined;
            n.duration = undefined;
        }
    };

    const loadData = (data: EtlPipeline) => {
        Object.assign(state, JSON.parse(JSON.stringify(data)));
        selectedNodeId.value = null;
        selectedEdgeId.value = null;
        selectedNode.value = null;
    };

    const getData = (): EtlPipeline => JSON.parse(JSON.stringify(state));

    return {
        state,
        selectedNodeId,
        selectedEdgeId,
        selectedNode,
        connectingFrom,
        selectNode,
        selectEdge,
        addNode,
        updateNode,
        updateNodeConfig,
        removeNode,
        addEdge,
        removeEdge,
        moveNode,
        startConnect,
        finishConnect,
        cancelConnect,
        getInputPortPos,
        getOutputPortPos,
        resetStatus,
        loadData,
        getData,
    };
};

export type EtlDesignerState = ReturnType<typeof useEtlDesigner>;
