/**
 * 知识图谱 - 图算法
 *
 * BFS 最短路径 / 邻居 / 子图 / 连通分量
 */

import type {KgEdge, KgGraph, KgNode} from "../types";

/** 构建邻接表（无向，便于 BFS） */
export const kgBuildAdjacency = (graph: KgGraph): Map<string, string[]> => {
    const map = new Map<string, string[]>();
    graph.nodes.forEach((n) => map.set(n.id, []));
    graph.edges.forEach((e) => {
        if (e.source === e.target) return;
        if (!map.has(e.source)) map.set(e.source, []);
        if (!map.has(e.target)) map.set(e.target, []);
        map.get(e.source)!.push(e.target);
        map.get(e.target)!.push(e.source);
    });
    return map;
};

/**
 * BFS 求最短路径（节点 ID 序列）
 * @returns 节点 ID 数组；无路径返回空数组
 */
export const kgBfsShortestPath = (
    graph: KgGraph,
    fromId: string,
    toId: string,
): string[] => {
    if (!graph.nodes.find((n) => n.id === fromId)) return [];
    if (!graph.nodes.find((n) => n.id === toId)) return [];
    if (fromId === toId) return [fromId];
    const adj = kgBuildAdjacency(graph);
    const visited = new Set<string>([fromId]);
    const prev = new Map<string, string | null>();
    prev.set(fromId, null);
    const queue: string[] = [fromId];
    while (queue.length > 0) {
        const cur = queue.shift()!;
        if (cur === toId) {
            const path: string[] = [];
            let p: string | null | undefined = toId;
            while (p != null) {
                path.unshift(p);
                p = prev.get(p) ?? null;
            }
            return path;
        }
        const neighbors = adj.get(cur) ?? [];
        for (const nb of neighbors) {
            if (visited.has(nb)) continue;
            visited.add(nb);
            prev.set(nb, cur);
            queue.push(nb);
        }
    }
    return [];
};

/** 获取节点邻居（直接相邻节点，无向） */
export const kgFindNeighbors = (graph: KgGraph, nodeId: string): KgNode[] => {
    const ids = new Set<string>();
    graph.edges.forEach((e) => {
        if (e.source === nodeId) ids.add(e.target);
        else if (e.target === nodeId) ids.add(e.source);
    });
    ids.delete(nodeId);
    return graph.nodes.filter((n) => ids.has(n.id));
};

/** 获取节点邻居边 */
export const kgFindNeighborEdges = (graph: KgGraph, nodeId: string): KgEdge[] =>
    graph.edges.filter((e) => e.source === nodeId || e.target === nodeId);

/** 提取子图（根据节点 ID 集合，包含两端都在集合内的边） */
export const kgSubgraph = (
    graph: KgGraph,
    nodeIds: string[],
    includeEdges = true,
): KgGraph => {
    const idSet = new Set(nodeIds);
    const nodes = graph.nodes.filter((n) => idSet.has(n.id));
    const edges = includeEdges
        ? graph.edges.filter((e) => idSet.has(e.source) && idSet.has(e.target))
        : [];
    return {
        id: `sub_${graph.id}`,
        name: graph.name,
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
    };
};

/** 求连通分量（每个分量返回节点 ID 数组） */
export const kgConnectedComponents = (graph: KgGraph): string[][] => {
    const adj = kgBuildAdjacency(graph);
    const visited = new Set<string>();
    const components: string[][] = [];
    graph.nodes.forEach((n) => {
        if (visited.has(n.id)) return;
        const comp: string[] = [];
        const queue: string[] = [n.id];
        visited.add(n.id);
        while (queue.length > 0) {
            const cur = queue.shift()!;
            comp.push(cur);
            (adj.get(cur) ?? []).forEach((nb) => {
                if (!visited.has(nb)) {
                    visited.add(nb);
                    queue.push(nb);
                }
            });
        }
        components.push(comp);
    });
    return components;
};

/** 计算节点度数 */
export const kgNodeDegree = (graph: KgGraph, nodeId: string): number =>
    graph.edges.filter((e) => e.source === nodeId || e.target === nodeId).length;
