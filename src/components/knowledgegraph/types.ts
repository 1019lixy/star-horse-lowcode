/**
 * 知识图谱模块 - 类型定义
 *
 * 节点 + 边 + 查询 + 模板
 */

/** 知识图谱节点类型 */
export type KgNodeType =
  "person" | "company" | "project" | "location" | "event" | "custom";

/** 知识图谱关系类型 */
export type KgEdgeType =
  | "founder"
  | "employee"
  | "investor"
  | "partner"
  | "customer"
  | "location"
  | "participant"
  | "custom";

/** 布局类型 */
export type KgLayoutType = "force" | "circle" | "grid";

/** 查询方向 */
export type KgDirection = "out" | "in" | "both";

/** 查询运算符 */
export type KgOperator =
  | "eq"
  | "ne"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "contains"
  | "startsWith"
  | "endsWith";

/** 节点位置 */
export interface KgPoint {
  x: number;
  y: number;
}

/** 节点速度（力导向用） */
export interface KgVelocity {
  vx: number;
  vy: number;
}

/** 知识图谱节点 */
export interface KgNode {
  id: string;
  /** 节点类型 */
  type: KgNodeType | string;
  /** 显示标签 */
  label: string;
  /** X 坐标 */
  x: number;
  /** Y 坐标 */
  y: number;
  /** 节点大小（半径） */
  radius?: number;
  /** 颜色（覆盖类型默认色） */
  color?: string;
  /** 业务属性 */
  properties?: Record<string, any>;
  /** 是否可见 */
  visible?: boolean;
  /** 是否折叠（隐藏邻居） */
  collapsed?: boolean;
  /** 速度（力布局内部使用） */
  vx?: number;
  vy?: number;
  /** 是否固定（不参与力布局） */
  fixed?: boolean;
}

/** 知识图谱边 */
export interface KgEdge {
  id: string;
  /** 源节点 ID */
  source: string;
  /** 目标节点 ID */
  target: string;
  /** 关系类型 */
  type: KgEdgeType | string;
  /** 标签 */
  label?: string;
  /** 业务属性 */
  properties?: Record<string, any>;
  /** 是否可见 */
  visible?: boolean;
  /** 权重 */
  weight?: number;
}

/** 知识图谱数据 */
export interface KgGraph {
  id: string;
  name: string;
  nodes: KgNode[];
  edges: KgEdge[];
}

/** 画布视口 */
export interface KgViewport {
  /** 缩放 */
  zoom: number;
  /** 平移 X */
  panX: number;
  /** 平移 Y */
  panY: number;
}

/** 节点类型预设 */
export interface KgNodeTypePreset {
  type: string;
  /** i18n 标签 key */
  labelKey: string;
  /** 默认颜色 */
  color: string;
  /** 默认半径 */
  radius: number;
  /** 图标 */
  icon?: string;
}

/** 关系类型预设 */
export interface KgEdgeTypePreset {
  type: string;
  /** i18n 标签 key */
  labelKey: string;
  /** 默认颜色 */
  color: string;
  /** 是否有向 */
  directed: boolean;
}

/** 运算符预设 */
export interface KgOperatorPreset {
  value: KgOperator;
  /** i18n 标签 key */
  labelKey: string;
}

/** 布局预设 */
export interface KgLayoutPreset {
  value: KgLayoutType;
  /** i18n 标签 key */
  labelKey: string;
}

/** 查询条件 */
export interface KgQueryCondition {
  id: string;
  /** 属性名 */
  property: string;
  /** 运算符 */
  operator: KgOperator;
  /** 比较值 */
  value: string;
}

/** 查询步骤 */
export interface KgQueryStep {
  id: string;
  /** 节点类型 */
  nodeType: string;
  /** 关系方向 */
  direction: KgDirection;
  /** 关系类型 */
  edgeType: string;
  /** 属性条件 */
  conditions: KgQueryCondition[];
}

/** 完整查询 */
export interface KgQuery {
  /** 起始节点类型 */
  startNodeType: string;
  /** 起始节点条件 */
  startConditions: KgQueryCondition[];
  /** 查询步骤 */
  steps: KgQueryStep[];
}

/** 查询结果项 */
export interface KgQueryResultItem {
  /** 路径节点 ID */
  path: string[];
  /** 匹配的节点 */
  nodes: KgNode[];
  /** 匹配的边 */
  edges: KgEdge[];
}

/** 查询模板 */
export interface KgQueryTemplate {
  id: string;
  /** 模板名称 */
  name: string;
  /** 创建时间 */
  createdAt: number;
  /** 查询内容 */
  query: KgQuery;
}

/** 力导向布局选项 */
export interface KgForceLayoutOptions {
  /** 理想距离 */
  linkDistance?: number;
  /** 斥力强度 */
  repulsion?: number;
  /** 弹簧强度 */
  springStrength?: number;
  /** 中心引力强度 */
  centerStrength?: number;
  /** 阻尼 */
  damping?: number;
  /** 迭代次数 */
  iterations?: number;
  /** 中心点 */
  center?: KgPoint;
}

/** 力布局节点状态 */
export interface KgForceNode extends KgNode {
  vx: number;
  vy: number;
}

/** 图谱查看器状态 */
export interface KgViewerState {
  graph: KgGraph;
  viewport: KgViewport;
  /** 当前布局类型 */
  layout: KgLayoutType;
  /** 选中节点 ID */
  selectedNodeId: string | null;
  /** 选中边 ID */
  selectedEdgeId: string | null;
  /** 高亮节点 ID 集合 */
  highlightNodeIds: string[];
  /** 高亮路径（最短路径结果） */
  pathNodeIds: string[];
  /** 搜索关键字 */
  searchKeyword: string;
  /** 力布局是否运行中 */
  layoutRunning: boolean;
  /** 折叠节点 ID 集合 */
  collapsedNodeIds: string[];
  /** 路径查询起点 */
  pathFromId: string | null;
  /** 路径查询终点 */
  pathToId: string | null;
}

/** 查询构建器状态 */
export interface KgQueryBuilderState {
  query: KgQuery;
  /** 查询结果 */
  results: KgQueryResultItem[];
  /** 已执行标记 */
  executed: boolean;
  /** 模板列表 */
  templates: KgQueryTemplate[];
}
