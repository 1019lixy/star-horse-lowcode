/**
 * 通用图编辑器 - 常量定义
 *
 * 节点预设库（流程图 / 网络拓扑 / 组织架构 / UML 等）
 */

import { i18n } from "@/lang";
import type { NodeTypePreset, DiagramNode } from "./types";

/** 通用端口（四向） */
const DEFAULT_PORTS = [
    { id: "top", position: "top" as const, input: true, output: true },
    { id: "right", position: "right" as const, input: true, output: true },
    { id: "bottom", position: "bottom" as const, input: true, output: true },
    { id: "left", position: "left" as const, input: true, output: true },
];

/** 节点类型预设库 */
export const NODE_PRESETS: NodeTypePreset[] = [
    // ============ 流程图 ============
    {
        type: "flow-start",
        label: i18n("diagram.preset.flowStart"),
        shape: "roundedRect",
        icon: "play",
        width: 100,
        height: 40,
        defaultText: i18n("diagram.preset.flowStart"),
        category: i18n("diagram.category.flowchart"),
        style: { fill: "#52C41A", stroke: "#389E0D", textColor: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
        ports: DEFAULT_PORTS,
    },
    {
        type: "flow-end",
        label: i18n("diagram.preset.flowEnd"),
        shape: "roundedRect",
        icon: "s-stop",
        width: 100,
        height: 40,
        defaultText: i18n("diagram.preset.flowEnd"),
        category: i18n("diagram.category.flowchart"),
        style: { fill: "#F5222D", stroke: "#CF1322", textColor: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
        ports: DEFAULT_PORTS,
    },
    {
        type: "flow-process",
        label: i18n("diagram.preset.process"),
        shape: "rect",
        icon: "th",
        width: 120,
        height: 50,
        defaultText: i18n("diagram.preset.process"),
        category: i18n("diagram.category.flowchart"),
        style: { fill: "#1890FF", stroke: "#096DD9", textColor: "#FFFFFF", fontSize: 13 },
        ports: DEFAULT_PORTS,
    },
    {
        type: "flow-decision",
        label: i18n("diagram.preset.decision"),
        shape: "diamond",
        icon: "s-operation",
        width: 120,
        height: 80,
        defaultText: i18n("diagram.preset.decision"),
        category: i18n("diagram.category.flowchart"),
        style: { fill: "#FAAD14", stroke: "#D48806", textColor: "#FFFFFF", fontSize: 13 },
        ports: DEFAULT_PORTS,
    },
    {
        type: "flow-io",
        label: i18n("diagram.preset.io"),
        shape: "parallelogram",
        icon: "download",
        width: 120,
        height: 50,
        defaultText: i18n("diagram.preset.io"),
        category: i18n("diagram.category.flowchart"),
        style: { fill: "#13C2C2", stroke: "#08979C", textColor: "#FFFFFF", fontSize: 13 },
        ports: DEFAULT_PORTS,
    },
    // ============ 网络拓扑 ============
    {
        type: "net-server",
        label: i18n("diagram.preset.server"),
        shape: "rect",
        icon: "server",
        width: 80,
        height: 80,
        defaultText: i18n("diagram.preset.server"),
        category: i18n("diagram.category.network"),
        style: { fill: "#722ED1", stroke: "#531DAB", textColor: "#FFFFFF", fontSize: 12 },
        ports: DEFAULT_PORTS,
    },
    {
        type: "net-database",
        label: i18n("diagram.preset.database"),
        shape: "ellipse",
        icon: "data_db",
        width: 100,
        height: 60,
        defaultText: i18n("diagram.preset.database"),
        category: i18n("diagram.category.network"),
        style: { fill: "#EB2F96", stroke: "#C41D7F", textColor: "#FFFFFF", fontSize: 12 },
        ports: DEFAULT_PORTS,
    },
    {
        type: "net-firewall",
        label: i18n("diagram.preset.firewall"),
        shape: "rect",
        icon: "lock",
        width: 100,
        height: 50,
        defaultText: i18n("diagram.preset.firewall"),
        category: i18n("diagram.category.network"),
        style: { fill: "#FA541C", stroke: "#D4380D", textColor: "#FFFFFF", fontSize: 13 },
        ports: DEFAULT_PORTS,
    },
    {
        type: "net-cloud",
        label: i18n("diagram.preset.cloud"),
        shape: "ellipse",
        icon: "cloudy",
        width: 120,
        height: 80,
        defaultText: i18n("diagram.preset.cloud"),
        category: i18n("diagram.category.network"),
        style: { fill: "#1890FF", stroke: "#096DD9", textColor: "#FFFFFF", fontSize: 13 },
        ports: DEFAULT_PORTS,
    },
    // ============ 组织架构 ============
    {
        type: "org-dept",
        label: i18n("diagram.preset.department"),
        shape: "rect",
        icon: "tree",
        width: 140,
        height: 60,
        defaultText: i18n("diagram.preset.department"),
        category: i18n("diagram.category.organization"),
        style: { fill: "#1890FF", stroke: "#096DD9", textColor: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
        ports: DEFAULT_PORTS,
    },
    {
        type: "org-role",
        label: i18n("diagram.preset.role"),
        shape: "roundedRect",
        icon: "user",
        width: 100,
        height: 50,
        defaultText: i18n("diagram.preset.role"),
        category: i18n("diagram.category.organization"),
        style: { fill: "#52C41A", stroke: "#389E0D", textColor: "#FFFFFF", fontSize: 13 },
        ports: DEFAULT_PORTS,
    },
    {
        type: "org-person",
        label: i18n("diagram.preset.person"),
        shape: "circle",
        icon: "avatar",
        width: 60,
        height: 60,
        defaultText: i18n("diagram.preset.person"),
        category: i18n("diagram.category.organization"),
        style: { fill: "#FAAD14", stroke: "#D48806", textColor: "#FFFFFF", fontSize: 12 },
        ports: DEFAULT_PORTS,
    },
    // ============ 基础形状 ============
    {
        type: "basic-text",
        label: i18n("diagram.preset.text"),
        shape: "text",
        icon: "text",
        width: 100,
        height: 30,
        defaultText: i18n("diagram.preset.text"),
        category: i18n("diagram.category.basic"),
        style: { fill: "transparent", stroke: "transparent", textColor: "#000000", fontSize: 14 },
    },
    {
        type: "basic-image",
        label: i18n("diagram.preset.image"),
        shape: "image",
        icon: "image",
        width: 100,
        height: 100,
        defaultText: "",
        category: i18n("diagram.category.basic"),
        style: { fill: "#F5F5F5", stroke: "#D9D9D9", image: "" },
    },
];

/** 默认画布配置 */
export const DEFAULT_CANVAS = {
    zoom: 1,
    panX: 0,
    panY: 0,
    showGrid: true,
    gridSize: 10,
    snap: true,
    snapThreshold: 5,
    backgroundColor: "#FFFFFF",
    width: 0,
    height: 0,
};

/** 创建节点 */
export const createNode = (preset: NodeTypePreset, x: number, y: number): DiagramNode => {
    return {
        id: `node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        type: preset.type,
        shape: preset.shape,
        text: preset.defaultText,
        x,
        y,
        width: preset.width,
        height: preset.height,
        ports: preset.ports ? JSON.parse(JSON.stringify(preset.ports)) : [],
        style: preset.style ? { ...preset.style } : {},
        data: {},
    };
};

/** 预设分类列表 */
export const PRESET_CATEGORIES = Array.from(new Set(NODE_PRESETS.map((p) => p.category)));

/** 默认边样式 */
export const DEFAULT_EDGE_STYLE = {
    stroke: "#666666",
    strokeWidth: 2,
    lineStyle: "solid" as const,
    textColor: "#333333",
    fontSize: 12,
    sourceArrow: "none" as const,
    targetArrow: "standard" as const,
};

/** 形状 SVG path 生成 */
export const getShapePath = (shape: string, x: number, y: number, w: number, h: number): string => {
    switch (shape) {
        case "rect":
            return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
        case "roundedRect":
            const r = Math.min(10, w / 4, h / 4);
            return `M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;
        case "circle":
        case "ellipse": {
            const cx = x + w / 2;
            const cy = y + h / 2;
            const rx = w / 2;
            const ry = h / 2;
            return `M${cx - rx},${cy} A${rx},${ry} 0 1,0 ${cx + rx},${cy} A${rx},${ry} 0 1,0 ${cx - rx},${cy} Z`;
        }
        case "diamond":
            return `M${x + w / 2},${y} L${x + w},${y + h / 2} L${x + w / 2},${y + h} L${x},${y + h / 2} Z`;
        case "triangle":
            return `M${x + w / 2},${y} L${x + w},${y + h} L${x},${y + h} Z`;
        case "parallelogram": {
            const skew = 15;
            return `M${x + skew},${y} L${x + w},${y} L${x + w - skew},${y + h} L${x},${y + h} Z`;
        }
        case "hexagon": {
            const inset = w * 0.2;
            return `M${x + inset},${y} L${x + w - inset},${y} L${x + w},${y + h / 2} L${x + w - inset},${y + h} L${x + inset},${y + h} L${x},${y + h / 2} Z`;
        }
        default:
            return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
    }
};

/** 计算端口坐标 */
export const getPortPosition = (
    node: DiagramNode,
    portId: string,
): { x: number; y: number } => {
    const port = node.ports?.find((p) => p.id === portId);
    if (!port) return { x: node.x + node.width / 2, y: node.y + node.height / 2 };
    switch (port.position) {
        case "top":
            return { x: node.x + node.width / 2, y: node.y };
        case "right":
            return { x: node.x + node.width, y: node.y + node.height / 2 };
        case "bottom":
            return { x: node.x + node.width / 2, y: node.y + node.height };
        case "left":
            return { x: node.x, y: node.y + node.height / 2 };
        default:
            return { x: node.x + node.width / 2, y: node.y + node.height / 2 };
    }
};

/** 计算节点中心点 */
export const getNodeCenter = (node: DiagramNode): { x: number; y: number } => ({
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
});

/** 历史最大长度 */
export const MAX_HISTORY = 50;
