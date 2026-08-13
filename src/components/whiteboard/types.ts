/**
 * 白板组件 - 类型定义
 *
 * 元素类型：pen / shape / line / text
 * 支持选择、拖拽、缩放、旋转、撤销/重做、导出
 */

/** 白板工具 */
export type WhiteboardTool =
  | "select" // 选择
  | "pan" // 平移
  | "pen" // 自由画笔
  | "eraser" // 橡皮擦
  | "line" // 直线
  | "rect" // 矩形
  | "circle" // 圆形
  | "triangle" // 三角形
  | "diamond" // 菱形
  | "arrow" // 箭头
  | "text"; // 文本

/** 形状子类型（用于 shape 元素） */
export type WhiteboardShapeType =
  "rect" | "circle" | "triangle" | "diamond" | "arrow";

/** 元素基础属性 */
export interface WbBaseElement {
  id: string;
  /** 元素类型 */
  type: "pen" | "shape" | "line" | "text";
  /** 旋转角度（度，0-360） */
  rotation?: number;
  /** 透明度 0-1 */
  opacity?: number;
  /** 是否锁定 */
  locked?: boolean;
  /** 是否可见 */
  visible?: boolean;
  /** 名称（图层显示用） */
  name?: string;
}

/** 点 */
export interface WbPoint {
  x: number;
  y: number;
}

/** 画笔元素（自由曲线） */
export interface PenElement extends WbBaseElement {
  type: "pen";
  /** 路径点数组 */
  points: WbPoint[];
  /** 描边色 */
  stroke: string;
  /** 线宽 */
  strokeWidth: number;
}

/** 形状元素（矩形/圆形/三角形/菱形/箭头） */
export interface ShapeElement extends WbBaseElement {
  type: "shape";
  /** 形状子类型 */
  shape: WhiteboardShapeType;
  /** X 坐标（左上角） */
  x: number;
  /** Y 坐标（左上角） */
  y: number;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 描边色 */
  stroke: string;
  /** 填充色，"transparent" 表示透明 */
  fill: string;
  /** 线宽 */
  strokeWidth: number;
}

/** 直线元素 */
export interface LineElement extends WbBaseElement {
  type: "line";
  /** 起点 */
  x1: number;
  y1: number;
  /** 终点 */
  x2: number;
  y2: number;
  /** 描边色 */
  stroke: string;
  /** 线宽 */
  strokeWidth: number;
}

/** 箭头元素（带箭头的线段） */
export interface ArrowElement extends WbBaseElement {
  type: "line";
  /** 子类型：箭头 */
  arrow: true;
  /** 起点 */
  x1: number;
  y1: number;
  /** 终点 */
  x2: number;
  y2: number;
  /** 描边色 */
  stroke: string;
  /** 线宽 */
  strokeWidth: number;
}

/** 文本元素 */
export interface TextElement extends WbBaseElement {
  type: "text";
  /** X 坐标（左上角） */
  x: number;
  /** Y 坐标（左上角） */
  y: number;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 文本内容 */
  text: string;
  /** 字号 */
  fontSize: number;
  /** 文字颜色 */
  color: string;
  /** 字重 */
  fontWeight?: "normal" | "bold";
  /** 对齐方式 */
  textAlign?: "left" | "center" | "right";
}

/** 白板元素联合类型 */
export type WhiteboardElement =
  PenElement | ShapeElement | LineElement | ArrowElement | TextElement;

/** 画布配置 */
export interface WbCanvasConfig {
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
  /** 背景色 */
  backgroundColor: string;
}

/** 包围盒 */
export interface WbBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 工具预设 */
export interface WbToolPreset {
  tool: WhiteboardTool;
  /** 图标 CSS class（sh-xxx） */
  icon: string;
  /** i18n key */
  labelKey: string;
}

/** 形状预设 */
export interface WbShapePreset {
  shape: WhiteboardShapeType;
  /** i18n key */
  labelKey: string;
  /** 默认宽 */
  width: number;
  /** 默认高 */
  height: number;
}

/** 颜色预设 */
export interface WbColorPreset {
  label: string;
  value: string;
}

/** 线宽预设 */
export interface WbLineWidthPreset {
  label: string;
  value: number;
}

/** 导出格式 */
export type WbExportFormat = "png" | "svg" | "json";

/** 白板状态 */
export interface WhiteboardState {
  /** 元素列表（按 z-order 升序，越后越在上层） */
  elements: WhiteboardElement[];
  /** 选中元素 ID 列表 */
  selectedIds: string[];
  /** 当前工具 */
  tool: WhiteboardTool;
  /** 当前描边色 */
  stroke: string;
  /** 当前填充色 */
  fill: string;
  /** 当前线宽 */
  strokeWidth: number;
  /** 当前透明度 */
  opacity: number;
  /** 当前字号 */
  fontSize: number;
  /** 画布配置 */
  canvas: WbCanvasConfig;
  /** 是否只读 */
  readonly: boolean;
}
