/**
 * 知识图谱查询构建器 - 状态管理
 *
 * query / addStep / removeStep / runQuery / saveTemplate / loadTemplate
 */

import { reactive, ref } from "vue";
import {
    createKgCondition,
    createKgQuery,
    createKgStep,
    kgGenId,
} from "../constants";
import type {
    KgEdge,
    KgGraph,
    KgNode,
    KgQuery,
    KgQueryCondition,
    KgQueryResultItem,
    KgQueryStep,
    KgQueryTemplate,
} from "../types";

const createInitialBuilderState = (query?: Partial<KgQuery>) => ({
    query: { ...createKgQuery(), ...query } as KgQuery,
    results: [] as KgQueryResultItem[],
    executed: false,
    templates: [] as KgQueryTemplate[],
});

/** 单条件求值 */
const evalCondition = (value: any, operator: string, target: string): boolean => {
    if (value == null) return false;
    const s = String(value);
    switch (operator) {
        case "eq":
            return s === target;
        case "ne":
            return s !== target;
        case "gt":
            return Number(s) > Number(target);
        case "lt":
            return Number(s) < Number(target);
        case "gte":
            return Number(s) >= Number(target);
        case "lte":
            return Number(s) <= Number(target);
        case "contains":
            return s.includes(target);
        case "startsWith":
            return s.startsWith(target);
        case "endsWith":
            return s.endsWith(target);
        default:
            return false;
    }
};

/** 节点是否满足条件集合 */
const matchAllConditions = (node: KgNode, conditions: KgQueryCondition[]): boolean => {
    if (!conditions || conditions.length === 0) return true;
    return conditions.every((c) => {
        if (!c.property) return true;
        const val = node.properties?.[c.property];
        return evalCondition(val, c.operator, c.value);
    });
};

export function useGraphQueryBuilder(initial?: Partial<KgQuery>) {
    const state = reactive(createInitialBuilderState(initial));
    const lastError = ref<string | null>(null);

    /** 设置起始节点类型 */
    const setStartNodeType = (type: string) => {
        state.query.startNodeType = type;
    };

    /** 添加起始条件 */
    const addStartCondition = () => {
        state.query.startConditions.push(createKgCondition());
    };

    /** 删除起始条件 */
    const removeStartCondition = (id: string) => {
        const idx = state.query.startConditions.findIndex((c) => c.id === id);
        if (idx >= 0) state.query.startConditions.splice(idx, 1);
    };

    /** 更新起始条件 */
    const updateStartCondition = (id: string, patch: Partial<KgQueryCondition>) => {
        const c = state.query.startConditions.find((cc) => cc.id === id);
        if (c) Object.assign(c, patch);
    };

    /** 添加步骤 */
    const addStep = () => {
        state.query.steps.push(createKgStep());
    };

    /** 删除步骤 */
    const removeStep = (id: string) => {
        const idx = state.query.steps.findIndex((s) => s.id === id);
        if (idx >= 0) state.query.steps.splice(idx, 1);
        if (state.query.steps.length === 0) {
            state.query.steps.push(createKgStep());
        }
    };

    /** 更新步骤 */
    const updateStep = (id: string, patch: Partial<KgQueryStep>) => {
        const s = state.query.steps.find((ss) => ss.id === id);
        if (s) Object.assign(s, patch);
    };

    /** 步骤添加条件 */
    const addStepCondition = (stepId: string) => {
        const s = state.query.steps.find((ss) => ss.id === stepId);
        if (s) s.conditions.push(createKgCondition());
    };

    /** 步骤删除条件 */
    const removeStepCondition = (stepId: string, condId: string) => {
        const s = state.query.steps.find((ss) => ss.id === stepId);
        if (!s) return;
        const idx = s.conditions.findIndex((c) => c.id === condId);
        if (idx >= 0) s.conditions.splice(idx, 1);
    };

    /** 步骤更新条件 */
    const updateStepCondition = (stepId: string, condId: string, patch: Partial<KgQueryCondition>) => {
        const s = state.query.steps.find((ss) => ss.id === stepId);
        if (!s) return;
        const c = s.conditions.find((cc) => cc.id === condId);
        if (c) Object.assign(c, patch);
    };

    /** 清空查询 */
    const clearQuery = () => {
        state.query = createKgQuery();
        state.results = [];
        state.executed = false;
        lastError.value = null;
    };

    /** 校验查询是否合法 */
    const validate = (): boolean => {
        if (!state.query.startNodeType) {
            lastError.value = "invalidQuery";
            return false;
        }
        lastError.value = null;
        return true;
    };

    /**
     * 执行查询
     * 简化策略：从图中找出所有匹配起始节点类型 + 起始条件的节点作为起点；
     * 然后按步骤依次通过关系扩展，每步过滤满足步骤条件的节点；
     * 返回每条完整路径作为一个结果项。
     */
    const runQuery = (graph: KgGraph): KgQueryResultItem[] => {
        if (!validate()) {
            state.executed = false;
            state.results = [];
            return [];
        }
        const q = state.query;
        const startNodes = graph.nodes.filter(
            (n) => n.type === q.startNodeType && matchAllConditions(n, q.startConditions),
        );
        const results: KgQueryResultItem[] = [];

        const buildAdj = (dir: string, edgeType: string) => {
            const map = new Map<string, string[]>();
            graph.edges.forEach((e) => {
                if (edgeType && e.type !== edgeType) return;
                if (dir === "out" || dir === "both") {
                    if (!map.has(e.source)) map.set(e.source, []);
                    map.get(e.source)!.push(e.target);
                }
                if (dir === "in" || dir === "both") {
                    if (!map.has(e.target)) map.set(e.target, []);
                    map.get(e.target)!.push(e.source);
                }
            });
            return map;
        };

        const adjList = q.steps.map((s) => buildAdj(s.direction, s.edgeType));

        const dfs = (currentNode: KgNode, stepIdx: number, path: string[], matchedNodes: KgNode[], matchedEdges: KgEdge[]) => {
            if (stepIdx >= q.steps.length) {
                results.push({
                    path: path.slice(),
                    nodes: matchedNodes.slice(),
                    edges: matchedEdges.slice(),
                });
                return;
            }
            const step = q.steps[stepIdx];
            const adj = adjList[stepIdx];
            const nextIds = adj.get(currentNode.id) ?? [];
            for (const nextId of nextIds) {
                if (path.includes(nextId)) continue; // 简单防环
                const nextNode = graph.nodes.find((n) => n.id === nextId);
                if (!nextNode) continue;
                if (nextNode.type !== step.nodeType) continue;
                if (!matchAllConditions(nextNode, step.conditions)) continue;
                const edge = graph.edges.find(
                    (e) =>
                        ((e.source === currentNode.id && e.target === nextId) ||
                            (e.target === currentNode.id && e.source === nextId)) &&
                        (!step.edgeType || e.type === step.edgeType),
                );
                matchedNodes.push(nextNode);
                if (edge) matchedEdges.push(edge);
                path.push(nextId);
                dfs(nextNode, stepIdx + 1, path, matchedNodes, matchedEdges);
                path.pop();
                matchedNodes.pop();
                if (edge) matchedEdges.pop();
            }
        };

        startNodes.forEach((sn) => {
            dfs(sn, 0, [sn.id], [sn], []);
        });

        state.results = results;
        state.executed = true;
        return results;
    };

    /** 保存为模板 */
    const saveTemplate = (name: string): KgQueryTemplate => {
        const tpl: KgQueryTemplate = {
            id: kgGenId("tpl"),
            name,
            createdAt: Date.now(),
            query: JSON.parse(JSON.stringify(state.query)),
        };
        state.templates.push(tpl);
        return tpl;
    };

    /** 加载模板 */
    const loadTemplate = (id: string): boolean => {
        const tpl = state.templates.find((t) => t.id === id);
        if (!tpl) return false;
        state.query = JSON.parse(JSON.stringify(tpl.query));
        state.executed = false;
        state.results = [];
        return true;
    };

    /** 删除模板 */
    const deleteTemplate = (id: string): boolean => {
        const idx = state.templates.findIndex((t) => t.id === id);
        if (idx < 0) return false;
        state.templates.splice(idx, 1);
        return true;
    };

    /** 预填模板（外部初始化用） */
    const setTemplates = (list: KgQueryTemplate[]) => {
        state.templates = JSON.parse(JSON.stringify(list));
    };

    /** 设置查询（外部覆盖） */
    const setQuery = (query: KgQuery) => {
        state.query = JSON.parse(JSON.stringify(query));
        state.executed = false;
        state.results = [];
    };

    return {
        state,
        lastError,
        setStartNodeType,
        addStartCondition,
        removeStartCondition,
        updateStartCondition,
        addStep,
        removeStep,
        updateStep,
        addStepCondition,
        removeStepCondition,
        updateStepCondition,
        clearQuery,
        validate,
        runQuery,
        saveTemplate,
        loadTemplate,
        deleteTemplate,
        setTemplates,
        setQuery,
    };
}

export type UseGraphQueryBuilderReturn = ReturnType<typeof useGraphQueryBuilder>;
