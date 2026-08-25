/**
 * 前端规则流程执行器（策略注册表架构）
 *
 * 核心设计：基于数据结构约定执行，而非基于节点类型 case when。
 * - 执行器主循环零 switch/case，通过策略列表 find(match) 分发
 * - 每个策略通过 match(data) 检测数据结构约定（鸭子类型），不依赖节点类型名
 * - 节点叫什么名字不重要，只要数据结构满足某个约定就按约定执行
 * - 内置策略作为默认集，可通过 extraStrategies 注入自定义策略（优先匹配）
 *
 * 支持的数据结构约定：
 *   data.triggerEvent 存在  → 开始节点（走第一条出边）
 *   data.endType 存在       → 结束节点（终止流程）
 *   data.conditions 是数组  → 条件判断（走满足/不满足边）
 *   data.branches 是数组    → 分支路由（匹配分支条件）
 *   data.actions 是数组     → 动作执行（执行每个动作）
 *   data.assignments 是数组 → 变量赋值
 *   data.scriptContent 是字符串 → 脚本执行
 *   data.url 是字符串       → HTTP 调用
 *
 * context 中的控制指令以前缀键表达：
 *   __visible_fieldName / __required_fieldName / __readonly_fieldName / __disabled_fieldName / __options_fieldName
 * 非 __ 前缀键视为字段赋值。
 */

interface FlowNode {
    id: string;
    type: string;
    data: any;
}

interface FlowEdge {
    source: string;
    target: string;
    label?: string;
}

/** 解析节点真实类型：generic 包装时取 data.__nodeType，否则取 type */
const resolveNodeType = (node: FlowNode): string =>
    node.type === "generic"
        ? (node.data?.__nodeType || "generic")
        : (node.type || "");

// ==================== 条件求值 ====================

const toNum = (v: any): number => {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
        const n = parseFloat(v);
        return isNaN(n) ? 0 : n;
    }
    return 0;
};

const compareValues = (left: any, operator: string, right: any): boolean => {
    switch (operator) {
        case "EQ":
        case "=":
        case "==":
            return String(left) === String(right);
        case "NEQ":
        case "NE":
        case "!=":
        case "<>":
            return String(left) !== String(right);
        case "GT":
        case ">":
            return toNum(left) > toNum(right);
        case "GTE":
        case ">=":
            return toNum(left) >= toNum(right);
        case "LT":
        case "<":
            return toNum(left) < toNum(right);
        case "LTE":
        case "<=":
            return toNum(left) <= toNum(right);
        case "CONTAINS":
            if (typeof right === "string")
                return String(right).includes(String(left));
            if (Array.isArray(right))
                return right.some((r) => String(r) === String(left));
            return false;
        case "NOT_CONTAINS":
            if (typeof right === "string")
                return !String(right).includes(String(left));
            if (Array.isArray(right))
                return !right.some((r) => String(r) === String(left));
            return true;
        case "IN":
            if (Array.isArray(right))
                return right.some((r) => String(r) === String(left));
            if (typeof right === "string")
                return String(right)
                    .split(",")
                    .map((s) => s.trim())
                    .includes(String(left));
            return false;
        case "NOT_IN":
            if (Array.isArray(right))
                return !right.some((r) => String(r) === String(left));
            if (typeof right === "string")
                return !String(right)
                    .split(",")
                    .map((s) => s.trim())
                    .includes(String(left));
            return true;
        case "IS_NULL":
        case "NULL":
            return left === null || left === undefined || left === "";
        case "IS_NOT_NULL":
        case "NOT_NULL":
            return left !== null && left !== undefined && left !== "";
        case "STARTS_WITH":
            return (
                typeof left === "string" &&
                typeof right === "string" &&
                left.startsWith(right)
            );
        case "ENDS_WITH":
            return (
                typeof left === "string" &&
                typeof right === "string" &&
                left.endsWith(right)
            );
        case "BETWEEN": {
            const parts = String(right).split(/[-,]/);
            if (parts.length >= 2) {
                return toNum(left) >= toNum(parts[0]) && toNum(left) <= toNum(parts[1]);
            }
            return false;
        }
        default:
            return false;
    }
};

const evaluateConditions = (
    conditions: any[],
    logic: string,
    context: any,
): boolean => {
    if (!conditions || conditions.length === 0) return true;
    const results = conditions.map((cond) => {
        const fieldValue = context[cond.fieldName];
        const targetValue = cond.value;
        return compareValues(fieldValue, cond.operator, targetValue);
    });
    return logic === "OR" ? results.some((r) => r) : results.every((r) => r);
};

// ==================== 表达式求值 ====================

const resolveContextPath = (context: any, path: string): any => {
    const segs = path.split(".");
    let cur = context;
    for (const s of segs) {
        if (cur == null) return undefined;
        cur = cur[s];
    }
    return cur;
};

const evaluateExpression = (expr: string, context: any): any => {
    if (!expr) return "";
    let resolved = expr.replace(/\$\{([^}]+)\}/g, (_, k) => {
        const v = resolveContextPath(context, k.trim());
        return v === undefined || v === null ? "" : String(v);
    });
    if (/^[\w\s+\-*/%().,:'"<>=!&|?]+$/.test(resolved)) {
        try {
            const keys = Object.keys(context).filter((k) =>
                /^[$A-Z_a-z][$\w]*$/.test(k),
            );
            const vals = keys.map((k) => context[k]);
            const fn = new Function(...keys, `"use strict"; return (${resolved});`);
            return fn(...vals);
        } catch {
            // fallthrough
        }
    }
    return resolved;
};

// ==================== 动作执行 ====================

const parseConstValue = (val: any): any => {
    if (typeof val !== "string") return val;
    const trimmed = val.trim();
    if (
        (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
        (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
        try {
            return JSON.parse(trimmed);
        } catch {
            /* ignore */
        }
    }
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
    if (trimmed === "true") return true;
    if (trimmed === "false") return false;
    return val;
};

const executeAction = (action: any, context: any): void => {
    const target = action.targetField;
    if (!target) return;

    switch (action.actionType) {
        case "SET_VALUE": {
            let value = action.actionValue ?? action.value;
            const vt = action.actionValueType ?? action.valueType ?? "CONSTANT";
            if (vt === "EXPRESSION") {
                value = evaluateExpression(String(value), context);
            } else if (vt === "VARIABLE") {
                value = resolveContextPath(context, String(value));
            } else {
                value = parseConstValue(value);
            }
            context[target] = value;
            break;
        }
        case "CLEAR_VALUE":
            context[target] = "";
            break;
        case "SHOW_FIELD":
        case "SHOW":
            context[`__visible_${target}`] = true;
            break;
        case "HIDE_FIELD":
        case "HIDE":
            context[`__visible_${target}`] = false;
            break;
        case "SET_ENABLED":
        case "ENABLE":
            context[`__disabled_${target}`] = false;
            break;
        case "SET_DISABLED":
        case "DISABLE":
            context[`__disabled_${target}`] = true;
            break;
        case "SET_REQUIRED":
            context[`__required_${target}`] = true;
            break;
        case "SET_OPTIONAL":
            context[`__required_${target}`] = false;
            break;
        case "SET_READONLY":
            context[`__readonly_${target}`] = true;
            break;
        case "SET_EDITABLE":
            context[`__readonly_${target}`] = false;
            break;
        default:
            break;
    }
};

// ==================== 边查找工具 ====================

const isTrueLabel = (label?: string): boolean => {
    if (!label) return true;
    const l = label.toLowerCase();
    return (
        l === "是" ||
        l === "true" ||
        l === "y" ||
        l.includes("满足") ||
        l.includes("✓") ||
        l.includes("yes")
    );
};

const isFalseLabel = (label?: string): boolean => {
    if (!label) return false;
    const l = label.toLowerCase();
    return (
        l === "否" ||
        l === "false" ||
        l === "n" ||
        l.includes("不满足") ||
        l.includes("✗") ||
        l.includes("no")
    );
};

const findNextNodeId = (outEdges: FlowEdge[]): string | null => {
    return outEdges.length > 0 ? outEdges[0].target : null;
};

// ==================== HTTP 调用 ====================

export type HttpCallHandler = (
    url: string,
    method: string,
    body: any,
) => Promise<any>;

/** 解析模板字符串中的 ${var} 占位符 */
const resolveTemplate = (template: string, context: any): string => {
    return template.replace(/\$\{([^}]+)\}/g, (_, k) => {
        const v = resolveContextPath(context, k.trim());
        return v === undefined || v === null ? "" : String(v);
    });
};

/** 深度解析对象中的模板字符串 */
const resolveBody = (body: any, context: any): any => {
    if (typeof body === "string") return resolveTemplate(body, context);
    if (Array.isArray(body))
        return body.map((item) => resolveBody(item, context));
    if (body && typeof body === "object") {
        const result: Record<string, any> = {};
        for (const [k, v] of Object.entries(body)) {
            result[k] = resolveBody(v, context);
        }
        return result;
    }
    return body;
};

// ==================== 策略注册表架构 ====================

/** 策略执行后的下一步指引 */
export interface NextStep {
    nextNodeId: string | null;
}

/** 策略执行可用的工具函数（纯函数，无副作用） */
export interface ExecutionHelpers {
    evaluateConditions: (conditions: any[], logic: string, context: any) => boolean;
    evaluateExpression: (expr: string, context: any) => any;
    resolveTemplate: (template: string, context: any) => string;
    resolveContextPath: (context: any, path: string) => any;
    resolveBody: (body: any, context: any) => any;
    parseConstValue: (val: any) => any;
    executeAction: (action: any, context: any) => void;
    findNextNodeId: (outEdges: FlowEdge[]) => string | null;
    isTrueLabel: (label?: string) => boolean;
    isFalseLabel: (label?: string) => boolean;
    httpCallHandler?: HttpCallHandler;
}

/**
 * 执行策略：基于数据结构约定匹配，不基于节点类型名。
 * - match: 检测节点数据结构是否匹配本策略（鸭子类型）
 * - execute: 执行节点逻辑，返回下一步指引
 */
export interface ExecutionStrategy {
    /** 策略名（调试/日志用） */
    name: string;
    /** 检测数据结构是否匹配本策略 */
    match: (node: FlowNode, data: any) => boolean;
    /** 执行节点逻辑，返回下一步指引 */
    execute: (
        node: FlowNode,
        data: any,
        context: any,
        outEdges: FlowEdge[],
        helpers: ExecutionHelpers,
    ) => Promise<NextStep> | NextStep;
}

/** 构造内置策略可用的 helpers */
const createHelpers = (httpCallHandler?: HttpCallHandler): ExecutionHelpers => ({
    evaluateConditions,
    evaluateExpression,
    resolveTemplate,
    resolveContextPath,
    resolveBody,
    parseConstValue,
    executeAction,
    findNextNodeId,
    isTrueLabel,
    isFalseLabel,
    httpCallHandler,
});

// ==================== 内置策略（基于数据结构约定） ====================

/** 结束节点策略：data.endType 存在 → 终止流程 */
const endStrategy: ExecutionStrategy = {
    name: "end",
    match: (_node, data) => !!data.endType,
    execute: async () => ({nextNodeId: null}),
};

/** 条件判断策略：data.conditions 是数组 → 条件求值，走满足/不满足边 */
const conditionStrategy: ExecutionStrategy = {
    name: "condition",
    match: (_node, data) => Array.isArray(data.conditions),
    execute: (_node, data, context, outEdges, helpers) => {
        const conditions = data.conditions || [];
        const logic = data.logic || "AND";
        const passed = helpers.evaluateConditions(conditions, logic, context);
        if (passed) {
            const trueEdge =
                outEdges.find((e) => helpers.isTrueLabel(e.label)) || outEdges[0];
            return {nextNodeId: trueEdge ? trueEdge.target : null};
        }
        const falseEdge = outEdges.find((e) => helpers.isFalseLabel(e.label));
        if (falseEdge) {
            return {nextNodeId: falseEdge.target};
        }
        return {
            nextNodeId: outEdges.length > 1 ? outEdges[1].target : null,
        };
    },
};

/** 分支路由策略：data.branches 是数组 → 匹配分支条件 */
const gatewayStrategy: ExecutionStrategy = {
    name: "gateway",
    match: (_node, data) => Array.isArray(data.branches),
    execute: (_node, data, context, outEdges, helpers) => {
        const branches = data.branches;
        let defaultTarget: string | null = null;
        for (const edge of outEdges) {
            const label = edge.label;
            if (branches && label) {
                const branch = Array.isArray(branches)
                    ? branches.find((b: any) => b.label === label)
                    : null;
                if (branch) {
                    const branchConditions = branch.conditions;
                    const branchLogic = branch.logic || "AND";
                    if (
                        Array.isArray(branchConditions) &&
                        branchConditions.length > 0
                    ) {
                        if (
                            helpers.evaluateConditions(branchConditions, branchLogic, context)
                        ) {
                            return {nextNodeId: edge.target};
                        }
                    } else if (branch.condition) {
                        const condStr = branch.condition;
                        if (condStr.toLowerCase() === "default") {
                            defaultTarget = edge.target;
                            continue;
                        }
                        try {
                            const result = helpers.evaluateExpression(condStr, context);
                            if (result === true || String(result) === "true") {
                                return {nextNodeId: edge.target};
                            }
                        } catch {
                            /* ignore */
                        }
                    }
                }
            } else if (defaultTarget === null) {
                defaultTarget = edge.target;
            }
        }
        return {nextNodeId: defaultTarget ?? helpers.findNextNodeId(outEdges)};
    },
};

/** 动作执行策略：data.actions 是数组 → 执行每个动作 */
const actionStrategy: ExecutionStrategy = {
    name: "action",
    match: (_node, data) => Array.isArray(data.actions),
    execute: (_node, data, context, outEdges, helpers) => {
        const actions = data.actions;
        if (Array.isArray(actions)) {
            for (const action of actions) {
                helpers.executeAction(action, context);
            }
        }
        return {nextNodeId: helpers.findNextNodeId(outEdges)};
    },
};

/** 变量赋值策略：data.assignments 是数组 → 变量赋值 */
const variableAssignStrategy: ExecutionStrategy = {
    name: "variable-assign",
    match: (_node, data) => Array.isArray(data.assignments),
    execute: (_node, data, context, outEdges, helpers) => {
        const assignments = data.assignments;
        if (Array.isArray(assignments)) {
            for (const assign of assignments) {
                const varName = assign.variableName;
                if (!varName) continue;
                let value = assign.value;
                const vt = assign.valueType || "CONSTANT";
                if (vt === "VARIABLE" && value != null) {
                    value = helpers.resolveContextPath(context, String(value));
                } else if (vt === "EXPRESSION" && value != null) {
                    try {
                        value = helpers.evaluateExpression(String(value), context);
                    } catch {
                        /* ignore */
                    }
                } else if (vt === "CONSTANT") {
                    value = helpers.parseConstValue(value);
                }
                context[varName] = value;
            }
        }
        return {nextNodeId: helpers.findNextNodeId(outEdges)};
    },
};

/** 脚本执行策略：data.scriptContent 是字符串 → 执行脚本 */
const scriptStrategy: ExecutionStrategy = {
    name: "script",
    match: (_node, data) =>
        typeof data.scriptContent === "string" && !!data.scriptContent,
    execute: (_node, data, context, outEdges, helpers) => {
        const scriptContent = data.scriptContent || data.script || "";
        if (scriptContent && typeof scriptContent === "string") {
            try {
                const keys = Object.keys(context).filter((k) =>
                    /^[$A-Z_a-z][$\w]*$/.test(k),
                );
                const vals = keys.map((k) => context[k]);
                const fn = new Function(...keys, `"use strict"; ${scriptContent}`);
                fn(...vals);
            } catch (err) {
                console.error("[RuleFlowExecutor] script 执行失败:", err);
            }
        }
        return {nextNodeId: helpers.findNextNodeId(outEdges)};
    },
};

/** HTTP 调用策略：data.url 是字符串 → 发起 HTTP 请求 */
const httpCallStrategy: ExecutionStrategy = {
    name: "http-call",
    match: (_node, data) => typeof data.url === "string" && !!data.url,
    execute: async (_node, data, context, outEdges, helpers) => {
        const autoLoad = data.autoLoad !== false;
        const triggerEvent = context.__trigger_event;

        if (!autoLoad && triggerEvent === "ON_LOAD") {
            return {nextNodeId: helpers.findNextNodeId(outEdges)};
        }

        const url = data.url ? helpers.resolveTemplate(data.url, context) : "";
        const method = (data.httpMethod || data.method || "GET").toUpperCase();
        const body = data.body ? helpers.resolveBody(data.body, context) : {};
        const responseVar = data.responseVar;
        const dataPath = data.dataPath || "data";
        const fieldMappings = data.fieldMappings;
        const httpCallHandler = helpers.httpCallHandler;

        if (httpCallHandler && url) {
            try {
                const response = await httpCallHandler(url, method, body);
                if (responseVar) {
                    context[responseVar] = response;
                }
                if (Array.isArray(fieldMappings) && fieldMappings.length > 0) {
                    const responseData = helpers.resolveContextPath(response, dataPath);
                    for (const mapping of fieldMappings) {
                        if (!mapping.sourceField || !mapping.distField) continue;
                        const val = helpers.resolveContextPath(responseData, mapping.sourceField);
                        if (val !== undefined) {
                            context[mapping.distField] = val;
                        }
                    }
                }
            } catch {
                if (responseVar) {
                    context[responseVar] = context[responseVar] ?? [];
                }
            }
        } else if (responseVar) {
            context[responseVar] = {simulated: true};
        }
        return {nextNodeId: helpers.findNextNodeId(outEdges)};
    },
};

/**
 * 内置策略列表（按优先级排序，第一个匹配的胜出）
 * 顺序说明：end 优先于其他，避免结束节点被误匹配为其他类型
 */
const builtinStrategies: ExecutionStrategy[] = [
    endStrategy,
    conditionStrategy,
    gatewayStrategy,
    actionStrategy,
    variableAssignStrategy,
    scriptStrategy,
    httpCallStrategy,
];

// ==================== 主执行函数 ====================

/**
 * 执行单个规则流程
 * @param flowContent JSON 字符串（包含 nodes 和 edges）
 * @param inputContext 输入上下文（formData 的副本）
 * @param httpCallHandler 可选 HTTP 调用处理器，用于 http-call 节点发起真实 API 请求
 * @param extraStrategies 可选自定义执行策略（优先于内置策略匹配）
 * @returns 修改后的 context（包含控制指令键）
 */
export const executeFlow = async (
    flowContent: string,
    inputContext: Record<string, any>,
    httpCallHandler?: HttpCallHandler,
    extraStrategies?: ExecutionStrategy[],
): Promise<Record<string, any>> => {
    const context = {...inputContext};

    let flow: { nodes: FlowNode[]; edges: FlowEdge[] };
    try {
        flow = JSON.parse(flowContent);
    } catch {
        return context;
    }

    const {nodes, edges} = flow;
    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) return context;

    const nodeMap = new Map<string, FlowNode>();
    let startNode: FlowNode | null = null;
    for (const node of nodes) {
        nodeMap.set(node.id, node);
        if (node.data?.triggerEvent || resolveNodeType(node) === "start") {
            startNode = node;
        }
    }
    if (!startNode) return context;

    const edgeMap = new Map<string, FlowEdge[]>();
    if (edges && Array.isArray(edges)) {
        for (const edge of edges) {
            if (!edgeMap.has(edge.source)) edgeMap.set(edge.source, []);
            edgeMap.get(edge.source)!.push(edge);
        }
    }

    const helpers = createHelpers(httpCallHandler);
    const strategies = extraStrategies
        ? [...extraStrategies, ...builtinStrategies]
        : builtinStrategies;

    let currentNodeId: string | null = startNode.id;
    let safetyCounter = 0;
    const maxIterations = 100;

    while (currentNodeId && safetyCounter < maxIterations) {
        safetyCounter++;
        const node = nodeMap.get(currentNodeId);
        if (!node) break;

        const data = node.data || {};
        const outEdges = edgeMap.get(node.id) || [];

        const strategy = strategies.find((s) => s.match(node, data));
        if (!strategy) {
            currentNodeId = findNextNodeId(outEdges);
            continue;
        }

        const result = await strategy.execute(node, data, context, outEdges, helpers);
        currentNodeId = result.nextNodeId;
    }

    return context;
};

/**
 * 执行多个规则流程，合并结果
 * @param flowContents flowContent 字符串数组
 * @param inputContext 输入上下文
 * @param httpCallHandler 可选 HTTP 调用处理器
 * @param extraStrategies 可选自定义执行策略（优先于内置策略匹配）
 * @returns 合并后的 delta（只包含控制指令和显式赋值，不包含原始 formData 键）
 */
export const executeFlows = async (
    flowContents: string[],
    inputContext: Record<string, any>,
    httpCallHandler?: HttpCallHandler,
    extraStrategies?: ExecutionStrategy[],
): Promise<Record<string, any>> => {
    let context = {...inputContext};
    for (const fc of flowContents) {
        context = await executeFlow(fc, context, httpCallHandler, extraStrategies);
    }
    const delta: Record<string, any> = {};
    for (const [key, val] of Object.entries(context)) {
        if (key.startsWith("__")) {
            delta[key] = val;
        } else if (
            !Object.prototype.hasOwnProperty.call(inputContext, key) ||
            inputContext[key] !== val
        ) {
            delta[key] = val;
        }
    }
    return delta;
};
