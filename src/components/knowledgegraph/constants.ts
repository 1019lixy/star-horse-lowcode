/**
 * 知识图谱模块 - 常量定义
 *
 * 节点类型预设 / 关系类型预设 / 运算符 / 布局 / 工厂函数
 */

import type {
    KgEdge,
    KgEdgeTypePreset,
    KgForceLayoutOptions,
    KgLayoutPreset,
    KgLayoutType,
    KgNode,
    KgNodeTypePreset,
    KgOperator,
    KgOperatorPreset,
    KgQuery,
    KgQueryCondition,
    KgQueryStep,
} from "./types";

/** 节点类型预设 */
export const KG_NODE_TYPE_PRESETS: KgNodeTypePreset[] = [
    {type: "person", labelKey: "knowledgegraph.nodeType.person", color: "#1890FF", radius: 22},
    {type: "company", labelKey: "knowledgegraph.nodeType.company", color: "#52C41A", radius: 26},
    {type: "project", labelKey: "knowledgegraph.nodeType.project", color: "#722ED1", radius: 22},
    {type: "location", labelKey: "knowledgegraph.nodeType.location", color: "#FA8C16", radius: 20},
    {type: "event", labelKey: "knowledgegraph.nodeType.event", color: "#EB2F96", radius: 20},
];

/** 关系类型预设 */
export const KG_EDGE_TYPE_PRESETS: KgEdgeTypePreset[] = [
    {type: "founder", labelKey: "knowledgegraph.edgeType.founder", color: "#1890FF", directed: true},
    {type: "employee", labelKey: "knowledgegraph.edgeType.employee", color: "#52C41A", directed: true},
    {type: "investor", labelKey: "knowledgegraph.edgeType.investor", color: "#FA541C", directed: true},
    {type: "partner", labelKey: "knowledgegraph.edgeType.partner", color: "#13C2C2", directed: false},
    {type: "customer", labelKey: "knowledgegraph.edgeType.customer", color: "#FAAD14", directed: true},
    {type: "location", labelKey: "knowledgegraph.edgeType.location", color: "#FA8C16", directed: true},
    {type: "participant", labelKey: "knowledgegraph.edgeType.participant", color: "#722ED1", directed: true},
];

/** 运算符预设 */
export const KG_OPERATOR_PRESETS: KgOperatorPreset[] = [
    {value: "eq", labelKey: "knowledgegraph.query.operator.eq"},
    {value: "ne", labelKey: "knowledgegraph.query.operator.ne"},
    {value: "gt", labelKey: "knowledgegraph.query.operator.gt"},
    {value: "lt", labelKey: "knowledgegraph.query.operator.lt"},
    {value: "gte", labelKey: "knowledgegraph.query.operator.gte"},
    {value: "lte", labelKey: "knowledgegraph.query.operator.lte"},
    {value: "contains", labelKey: "knowledgegraph.query.operator.contains"},
    {value: "startsWith", labelKey: "knowledgegraph.query.operator.startsWith"},
    {value: "endsWith", labelKey: "knowledgegraph.query.operator.endsWith"},
];

/** 布局预设 */
export const KG_LAYOUT_PRESETS: KgLayoutPreset[] = [
    {value: "force", labelKey: "knowledgegraph.viewer.layout.force"},
    {value: "circle", labelKey: "knowledgegraph.viewer.layout.circle"},
    {value: "grid", labelKey: "knowledgegraph.viewer.layout.grid"},
];

/** 默认力布局参数 */
export const KG_DEFAULT_FORCE_OPTIONS: Required<KgForceLayoutOptions> = {
    linkDistance: 120,
    repulsion: 6000,
    springStrength: 0.05,
    centerStrength: 0.02,
    damping: 0.85,
    iterations: 300,
    center: {x: 500, y: 350},
};

/** 默认视口 */
export const KG_DEFAULT_VIEWPORT = {
    zoom: 1,
    panX: 0,
    panY: 0,
};

/** 缩放上下限 */
export const KG_ZOOM_MIN = 0.2;
export const KG_ZOOM_MAX = 4;

/** 高亮颜色 */
export const KG_HIGHLIGHT_COLOR = "#F5222D";
export const KG_PATH_COLOR = "#FA541C";
export const KG_SELECTED_COLOR = "#1890FF";
export const KG_SEARCH_COLOR = "#FAAD14";

/** 工具：根据节点类型取得预设 */
export const kgGetNodeTypePreset = (type: string): KgNodeTypePreset | undefined =>
    KG_NODE_TYPE_PRESETS.find((p) => p.type === type);

/** 工具：根据关系类型取得预设 */
export const kgGetEdgeTypePreset = (type: string): KgEdgeTypePreset | undefined =>
    KG_EDGE_TYPE_PRESETS.find((p) => p.type === type);

/** 工具：根据节点类型取得颜色 */
export const kgGetNodeColor = (node: KgNode): string => {
    if (node.color) return node.color;
    return kgGetNodeTypePreset(node.type)?.color ?? "#8C8C8C";
};

/** 工具：根据节点类型取得半径 */
export const kgGetNodeRadius = (node: KgNode): number => {
    if (node.radius != null) return node.radius;
    return kgGetNodeTypePreset(node.type)?.radius ?? 20;
};

/** 工具：根据关系类型取得颜色 */
export const kgGetEdgeColor = (edge: KgEdge): string => {
    if (edge.properties?.color) return String(edge.properties.color);
    return kgGetEdgeTypePreset(edge.type)?.color ?? "#8C8C8C";
};

/** 生成唯一 ID */
export const kgGenId = (prefix: string): string =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

/** 创建节点 */
export const createKgNode = (
    type: string,
    label: string,
    x = 0,
    y = 0,
    properties?: Record<string, any>,
): KgNode => ({
    id: kgGenId("node"),
    type,
    label,
    x,
    y,
    radius: kgGetNodeTypePreset(type)?.radius ?? 20,
    color: kgGetNodeTypePreset(type)?.color,
    properties: properties ? {...properties} : {},
    visible: true,
    collapsed: false,
    vx: 0,
    vy: 0,
    fixed: false,
});

/** 创建边 */
export const createKgEdge = (
    source: string,
    target: string,
    type: string,
    label?: string,
    properties?: Record<string, any>,
): KgEdge => ({
    id: kgGenId("edge"),
    source,
    target,
    type,
    label,
    properties: properties ? {...properties} : {},
    visible: true,
    weight: 1,
});

/** 创建查询条件 */
export const createKgCondition = (
    property = "",
    operator: KgOperator = "eq",
    value = "",
): KgQueryCondition => ({
    id: kgGenId("cond"),
    property,
    operator,
    value,
});

/** 创建查询步骤 */
export const createKgStep = (
    nodeType = KG_NODE_TYPE_PRESETS[0].type,
    direction: "out" | "in" | "both" = "out",
    edgeType = KG_EDGE_TYPE_PRESETS[0].type,
): KgQueryStep => ({
    id: kgGenId("step"),
    nodeType,
    direction,
    edgeType,
    conditions: [],
});

/** 创建空查询 */
export const createKgQuery = (): KgQuery => ({
    startNodeType: KG_NODE_TYPE_PRESETS[0].type,
    startConditions: [],
    steps: [createKgStep()],
});

/** 默认布局选项 */
export const kgDefaultLayoutType: KgLayoutType = "force";
