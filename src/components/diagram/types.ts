/**
 * 通用图编辑器 - 类型定义
 *
 * 覆盖：流程图、网络拓扑、组织架构、UML、思维导图等场景
 * 节点 + 边 + 端口 + 图层 + 数据绑定
 */

/** 节点形状 */
export type NodeShape =
    | "rect" // 矩形（流程框）
    | "roundedRect" // 圆角矩形（开始/结束）
    | "circle" // 圆形
    | "ellipse" // 椭圆
    | "diamond" // 菱形（判断）
    | "parallelogram" // 平行四边形（输入/输出）
    | "hexagon" // 六边形（准备）
    | "triangle" // 三角形
    | "image" // 图片节点
    | "text" // 纯文本
    | "custom"; // 自定义 SVG

/** 边类型 */
export type EdgeType =
    | "straight" // 直线
    | "polyline" // 折线
    | "curve" // 曲线
    | "orthogonal"; // 正交线

/** 边箭头 */
export type EdgeArrow = "none" | "standard" | "block" | "diamond" | "open";

/** 端口位置 */
export type PortPosition = "top" | "right" | "bottom" | "left";

/** 数据类型 */
export type FieldType = "string" | "number" | "boolean" | "date" | "select";

/** 节点端口 */
export interface DiagramPort {
    id: string;
    /** 端口位置 */
    position: PortPosition;
    /** 是否输入端口 */
    input: boolean;
    /** 是否输出端口 */
    output: boolean;
    /** 标签 */
    label?: string;
}

/** 节点样式 */
export interface NodeStyle {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    /** 文字颜色 */
    textColor?: string;
    /** 字号 */
    fontSize?: number;
    /** 字重 */
    fontWeight?: "normal" | "bold";
    /** 圆角 */
    radius?: number;
    /** 透明度 */
    opacity?: number;
    /** 阴影 */
    shadow?: boolean;
    /** 图片 URL（shape=image 时） */
    image?: string;
}

/** 图节点 */
export interface DiagramNode {
    id: string;
    /** 节点类型（业务分类：流程/服务器/数据库/人员 等） */
    type: string;
    /** 形状 */
    shape: NodeShape;
    /** 显示文本 */
    text: string;
    /** X 坐标 */
    x: number;
    /** Y 坐标 */
    y: number;
    /** 宽度 */
    width: number;
    /** 高度 */
    height: number;
    /** 端口列表 */
    ports?: DiagramPort[];
    /** 样式 */
    style?: NodeStyle;
    /** 业务数据（自定义属性） */
    data?: Record<string, any>;
    /** 是否锁定 */
    locked?: boolean;
    /** 是否可见 */
    visible?: boolean;
    /** 旋转角度 */
    rotation?: number;
    /** 子节点（组织架构树/思维导图） */
    children?: string[];
}

/** 边样式 */
export interface EdgeStyle {
    stroke?: string;
    strokeWidth?: number;
    /** 线型 */
    lineStyle?: "solid" | "dashed" | "dotted";
    /** 文字颜色 */
    textColor?: string;
    /** 字号 */
    fontSize?: number;
    /** 起点箭头 */
    sourceArrow?: EdgeArrow;
    /** 终点箭头 */
    targetArrow?: EdgeArrow;
}

/** 图边 */
export interface DiagramEdge {
    id: string;
    /** 源节点 ID */
    source: string;
    /** 源端口 ID */
    sourcePort?: string;
    /** 目标节点 ID */
    target: string;
    /** 目标端口 ID */
    targetPort?: string;
    /** 边类型 */
    type: EdgeType;
    /** 标签 */
    label?: string;
    /** 路径点（折线/曲线的中间点） */
    waypoints?: Array<{ x: number; y: number }>;
    /** 样式 */
    style?: EdgeStyle;
    /** 业务数据 */
    data?: Record<string, any>;
}

/** 图层 */
export interface DiagramLayer {
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
    /** 节点 ID 列表 */
    nodeIds: string[];
    /** 边 ID 列表 */
    edgeIds: string[];
}

/** 画布配置 */
export interface DiagramCanvas {
    /** 缩放 */
    zoom: number;
    /** 平移 X */
    panX: number;
    /** 平移 Y */
    panY: number;
    /** 是否显示网格 */
    showGrid: boolean;
    /** 网格大小 */
    gridSize: number;
    /** 是否吸附 */
    snap: boolean;
    /** 吸附阈值 */
    snapThreshold: number;
    /** 背景色 */
    backgroundColor: string;
    /** 画布宽度（0=无限） */
    width: number;
    /** 画布高度（0=无限） */
    height: number;
}

/** 图定义 */
export interface DiagramData {
    id: string;
    name: string;
    /** 节点 */
    nodes: DiagramNode[];
    /** 边 */
    edges: DiagramEdge[];
    /** 图层 */
    layers: DiagramLayer[];
    /** 当前激活图层 */
    activeLayerId: string;
    /** 画布配置 */
    canvas: DiagramCanvas;
    /** 自定义属性 */
    metadata?: Record<string, any>;
}

/** 设计器状态 */
export interface DiagramDesignerState {
    diagram: DiagramData;
    /** 选中节点 ID */
    selectedNodeIds: string[];
    /** 选中边 ID */
    selectedEdgeIds: string[];
    /** 历史记录 */
    history: DiagramData[];
    historyIndex: number;
    /** 是否只读 */
    readonly: boolean;
    /** 当前工具 */
    tool: "select" | "pan" | "connect";
    /** 连接临时状态 */
    connecting: { fromNodeId: string; fromPortId?: string; toX: number; toY: number } | null;
    /** 剪贴板 */
    clipboard: DiagramNode[];
}

/** 节点类型预设（左侧面板） */
export interface NodeTypePreset {
    /** 类型标识 */
    type: string;
    /** 显示名 */
    label: string;
    /** 形状 */
    shape: NodeShape;
    /** 图标 */
    icon: string;
    /** 默认宽 */
    width: number;
    /** 默认高 */
    height: number;
    /** 默认文本 */
    defaultText: string;
    /** 默认样式 */
    style?: NodeStyle;
    /** 默认端口 */
    ports?: DiagramPort[];
    /** 分类 */
    category: string;
}
