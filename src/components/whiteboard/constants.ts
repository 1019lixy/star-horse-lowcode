/**
 * 白板组件 - 常量定义
 *
 * 工具/形状/颜色/线宽 预设
 * 注意：常量统一使用 WB_ 前缀，避免与其他模块冲突
 */

import { i18n } from "@/lang";
import type {
    WbColorPreset,
    WbLineWidthPreset,
    WbShapePreset,
    WbToolPreset,
    WhiteboardElement,
    WhiteboardShapeType,
    WhiteboardState,
    WhiteboardTool,
} from "./types";

/** 默认画布配置 */
export const WB_DEFAULT_CANVAS = {
    zoom: 1,
    panX: 0,
    panY: 0,
    showGrid: true,
    gridSize: 20,
    backgroundColor: "#FFFFFF",
};

/** 默认描边色 */
export const WB_DEFAULT_STROKE = "#1890FF";
/** 默认填充色 */
export const WB_DEFAULT_FILL = "transparent";
/** 默认线宽 */
export const WB_DEFAULT_STROKE_WIDTH = 2;
/** 默认透明度 */
export const WB_DEFAULT_OPACITY = 1;
/** 默认字号 */
export const WB_DEFAULT_FONT_SIZE = 16;

/** 历史最大长度 */
export const WB_MAX_HISTORY = 50;

/** 工具预设列表 */
export const WB_TOOL_PRESETS: WbToolPreset[] = [
    { tool: "select", icon: "sh-select", labelKey: "whiteboard.tool.select" },
    { tool: "pen", icon: "sh-edit", labelKey: "whiteboard.tool.pen" },
    { tool: "eraser", icon: "sh-delete", labelKey: "whiteboard.tool.eraser" },
    { tool: "line", icon: "sh-line_arrow", labelKey: "whiteboard.tool.line" },
    { tool: "rect", icon: "sh-rectangle", labelKey: "whiteboard.tool.rect" },
    { tool: "circle", icon: "sh-rectangle", labelKey: "whiteboard.tool.circle" },
    { tool: "triangle", icon: "sh-rectangle", labelKey: "whiteboard.tool.triangle" },
    { tool: "diamond", icon: "sh-rectangle", labelKey: "whiteboard.tool.diamond" },
    { tool: "arrow", icon: "sh-line_arrow", labelKey: "whiteboard.tool.arrow" },
    { tool: "text", icon: "sh-text", labelKey: "whiteboard.tool.text" },
];

/** 形状预设列表 */
export const WB_SHAPE_TYPE_PRESETS: WbShapePreset[] = [
    { shape: "rect", labelKey: "whiteboard.shape.rect", width: 120, height: 80 },
    { shape: "circle", labelKey: "whiteboard.shape.circle", width: 100, height: 100 },
    { shape: "triangle", labelKey: "whiteboard.shape.triangle", width: 100, height: 90 },
    { shape: "diamond", labelKey: "whiteboard.shape.diamond", width: 120, height: 90 },
    { shape: "arrow", labelKey: "whiteboard.shape.arrow", width: 140, height: 60 },
];

/** 颜色预设 */
export const WB_COLOR_PRESETS: WbColorPreset[] = [
    { label: i18n("whiteboard.color.transparent"), value: "transparent" },
    { label: "#000000", value: "#000000" },
    { label: "#FFFFFF", value: "#FFFFFF" },
    { label: "#1890FF", value: "#1890FF" },
    { label: "#52C41A", value: "#52C41A" },
    { label: "#FAAD14", value: "#FAAD14" },
    { label: "#F5222D", value: "#F5222D" },
    { label: "#722ED1", value: "#722ED1" },
    { label: "#13C2C2", value: "#13C2C2" },
    { label: "#EB2F96", value: "#EB2F96" },
    { label: "#8C8C8C", value: "#8C8C8C" },
];

/** 线宽预设 */
export const WB_LINE_WIDTH_PRESETS: WbLineWidthPreset[] = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "4", value: 4 },
    { label: "6", value: 6 },
    { label: "8", value: 8 },
    { label: "12", value: 12 },
];

/** 透明度预设 */
export const WB_OPACITY_PRESETS: WbLineWidthPreset[] = [
    { label: "100%", value: 1 },
    { label: "80%", value: 0.8 },
    { label: "60%", value: 0.6 },
    { label: "40%", value: 0.4 },
    { label: "20%", value: 0.2 },
];

/** 字号预设 */
export const WB_FONT_SIZE_PRESETS: WbLineWidthPreset[] = [
    { label: "12", value: 12 },
    { label: "14", value: 14 },
    { label: "16", value: 16 },
    { label: "18", value: 18 },
    { label: "20", value: 20 },
    { label: "24", value: 24 },
    { label: "28", value: 28 },
    { label: "32", value: 32 },
];

/** 生成元素 ID */
export const wbGenId = (prefix = "wb"): string =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

/** 创建画笔元素 */
export const createWbPenElement = (params: {
    points: { x: number; y: number }[];
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
}): WhiteboardElement => ({
    id: wbGenId("pen"),
    type: "pen",
    points: params.points,
    stroke: params.stroke ?? WB_DEFAULT_STROKE,
    strokeWidth: params.strokeWidth ?? WB_DEFAULT_STROKE_WIDTH,
    opacity: params.opacity ?? WB_DEFAULT_OPACITY,
    visible: true,
});

/** 创建形状元素 */
export const createWbShapeElement = (params: {
    shape: WhiteboardShapeType;
    x: number;
    y: number;
    width?: number;
    height?: number;
    stroke?: string;
    fill?: string;
    strokeWidth?: number;
    opacity?: number;
}): WhiteboardElement => ({
    id: wbGenId("shape"),
    type: "shape",
    shape: params.shape,
    x: params.x,
    y: params.y,
    width: params.width ?? 120,
    height: params.height ?? 80,
    stroke: params.stroke ?? WB_DEFAULT_STROKE,
    fill: params.fill ?? WB_DEFAULT_FILL,
    strokeWidth: params.strokeWidth ?? WB_DEFAULT_STROKE_WIDTH,
    opacity: params.opacity ?? WB_DEFAULT_OPACITY,
    visible: true,
});

/** 创建直线元素 */
export const createWbLineElement = (params: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    arrow?: boolean;
}): WhiteboardElement => ({
    id: wbGenId("line"),
    type: "line",
    arrow: params.arrow ? true : undefined,
    x1: params.x1,
    y1: params.y1,
    x2: params.x2,
    y2: params.y2,
    stroke: params.stroke ?? WB_DEFAULT_STROKE,
    strokeWidth: params.strokeWidth ?? WB_DEFAULT_STROKE_WIDTH,
    opacity: params.opacity ?? WB_DEFAULT_OPACITY,
    visible: true,
} as WhiteboardElement);

/** 创建文本元素 */
export const createWbTextElement = (params: {
    x: number;
    y: number;
    text?: string;
    width?: number;
    height?: number;
    color?: string;
    fontSize?: number;
    opacity?: number;
}): WhiteboardElement => ({
    id: wbGenId("text"),
    type: "text",
    x: params.x,
    y: params.y,
    width: params.width ?? 160,
    height: params.height ?? 32,
    text: params.text ?? i18n("whiteboard.text.default"),
    color: params.color ?? "#333333",
    fontSize: params.fontSize ?? WB_DEFAULT_FONT_SIZE,
    opacity: params.opacity ?? WB_DEFAULT_OPACITY,
    visible: true,
});

/** 统一元素工厂（按工具创建） */
export const createWbElement = (
    tool: WhiteboardTool,
    params: Record<string, any>,
): WhiteboardElement | null => {
    switch (tool) {
        case "pen":
            return createWbPenElement(params as any);
        case "rect":
        case "circle":
        case "triangle":
        case "diamond":
        case "arrow":
            return createWbShapeElement({ ...(params as any), shape: tool });
        case "line":
            return createWbLineElement(params as any);
        case "text":
            return createWbTextElement(params as any);
        default:
            return null;
    }
};

/** 创建初始状态 */
export const createWbInitialState = (
    initialElements?: WhiteboardElement[],
): WhiteboardState => ({
    elements: initialElements ? JSON.parse(JSON.stringify(initialElements)) : [],
    selectedIds: [],
    tool: "select",
    stroke: WB_DEFAULT_STROKE,
    fill: WB_DEFAULT_FILL,
    strokeWidth: WB_DEFAULT_STROKE_WIDTH,
    opacity: WB_DEFAULT_OPACITY,
    fontSize: WB_DEFAULT_FONT_SIZE,
    canvas: { ...WB_DEFAULT_CANVAS },
    readonly: false,
});

/** 工具的 i18n 标签 */
export const wbToolLabel = (tool: WhiteboardTool): string => {
    const preset = WB_TOOL_PRESETS.find((p) => p.tool === tool);
    return preset ? i18n(preset.labelKey as any) : tool;
};

/** 形状的 i18n 标签 */
export const wbShapeLabel = (shape: WhiteboardShapeType): string => {
    const preset = WB_SHAPE_TYPE_PRESETS.find((p) => p.shape === shape);
    return preset ? i18n(preset.labelKey as any) : shape;
};
