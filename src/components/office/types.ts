/**
 * Office 文档编辑模块类型定义
 */

/** Office 文档类型 */
export type OfficeDocType = "word" | "excel" | "slide";

/** 文本对齐方式 */
export type OfficeTextAlign = "left" | "center" | "right" | "justify";

/** PowerPoint 形状类型 */
export type OfficeShapeType = "rect" | "circle" | "triangle" | "arrow";

/** 幻灯片元素类型 */
export type OfficeSlideElementType = "text" | "shape" | "image";

/** Word 段落 */
export interface WordParagraph {
    id: string;
    /** HTML 内容（富文本） */
    html: string;
}

/** Word 文档内容 */
export interface WordContent {
    /** HTML 富文本内容（contenteditable 内容） */
    html: string;
}

/** Excel 单元格 */
export interface ExcelCell {
    /** 行索引（0-based） */
    row: number;
    /** 列索引（0-based） */
    col: number;
    /** 原始值（字符串或数字） */
    value: string;
    /** 显示值（公式求值后） */
    display?: string;
    /** 是否为公式 */
    isFormula?: boolean;
    /** 合并的跨度（colspan） */
    colspan?: number;
    /** 合并的跨度（rowspan） */
    rowspan?: number;
    /** 是否被合并单元格覆盖（被其他单元格的 rowspan/colspan 遮盖） */
    covered?: boolean;
    /** 字体粗细 */
    bold?: boolean;
    /** 背景色 */
    bg?: string;
}

/** Excel 工作表 */
export interface ExcelSheet {
    id: string;
    name: string;
    /** 行数 */
    rows: number;
    /** 列数 */
    cols: number;
    /** 单元格列表 */
    cells: ExcelCell[];
    /** 列宽（按列索引） */
    colWidths?: number[];
    /** 行高（按行索引） */
    rowHeights?: number[];
}

/** Excel 文档内容 */
export interface ExcelContent {
    sheets: ExcelSheet[];
    /** 当前活动工作表 ID */
    activeSheetId?: string;
}

/** 幻灯片元素 */
export interface SlideElement {
    id: string;
    /** 元素类型 */
    type: OfficeSlideElementType;
    /** X 坐标 */
    x: number;
    /** Y 坐标 */
    y: number;
    /** 宽度 */
    width: number;
    /** 高度 */
    height: number;
    /** 文本内容（type=text 时） */
    text?: string;
    /** 字号 */
    fontSize?: number;
    /** 文字颜色 */
    color?: string;
    /** 形状类型（type=shape 时） */
    shape?: OfficeShapeType;
    /** 填充色 */
    fill?: string;
    /** 图片 URL（type=image 时） */
    src?: string;
    /** 旋转角度（度） */
    rotate?: number;
}

/** 幻灯片 */
export interface Slide {
    id: string;
    /** 元素列表 */
    elements: SlideElement[];
    /** 背景 */
    bg?: string;
}

/** 幻灯片文档内容 */
export interface SlideContent {
    slides: Slide[];
    /** 画布宽度 */
    canvasWidth: number;
    /** 画布高度 */
    canvasHeight: number;
}

/** Office 文档（联合结构，根据 type 决定 content 形态） */
export interface OfficeDocument {
    id: string;
    /** 文档名称 */
    name: string;
    /** 文档类型 */
    type: OfficeDocType;
    /** 创建时间（ISO 字符串） */
    createdAt: string;
    /** 更新时间（ISO 字符串） */
    updatedAt: string;
    /** Word 文档内容（type=word 时使用） */
    wordContent?: WordContent;
    /** Excel 文档内容（type=excel 时使用） */
    excelContent?: ExcelContent;
    /** 幻灯片文档内容（type=slide 时使用） */
    slideContent?: SlideContent;
}

/** 文档类型预设 */
export interface OfficeDocTypePreset {
    type: OfficeDocType;
    label: string;
    icon: string;
    color: string;
}

/** 字体预设 */
export interface OfficeFontPreset {
    value: string;
    label: string;
}

/** 字号预设 */
export interface OfficeFontSizePreset {
    value: number;
    label: string;
}

/** 文本对齐预设 */
export interface OfficeTextAlignPreset {
    value: OfficeTextAlign;
    label: string;
    icon: string;
}

/** 形状预设 */
export interface OfficeShapePreset {
    type: OfficeShapeType;
    label: string;
    icon: string;
}

/** 导出格式 */
export type OfficeExportFormat = "html" | "json" | "markdown";
