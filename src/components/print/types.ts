/**
 * 打印模板设计器 - 类型定义
 *
 * 涵盖：元素、模板、数据源、纸张、渲染输出等核心类型
 * 设计原则：单一职责，所有类型在此集中定义，组件按需引用
 */

/** 元素类型枚举 */
export type PrintElementType =
    | "text"
    | "barcode"
    | "qrcode"
    | "image"
    | "line"
    | "rect"
    | "ellipse"
    | "table"
    | "datetime"
    | "counter"
    | "shape";

/** 数据绑定来源 */
export type PrintDataBindSource =
    | "static" // 静态文本
    | "field" // 数据字段
    | "formula" // 公式
    | "system"; // 系统变量（日期、页码、操作员等）

/** 系统变量枚举 */
export type PrintSystemVar =
    | "currentDate"
    | "currentTime"
    | "currentDateTime"
    | "pageNumber"
    | "pageCount"
    | "operator"
    | "printerName"
    | "templateName"
    | "tenantName";

/** 条码码制 */
export type BarcodeSymbology =
    | "CODE128"
    | "CODE39"
    | "EAN13"
    | "EAN8"
    | "UPC_A"
    | "UPC_E"
    | "ITF14"
    | "MSI";

/** 渲染输出目标 */
export type PrintRenderTarget = "html" | "pdf" | "zpl" | "tspl";

/** 长度单位 */
export type PrintUnit = "mm" | "px" | "pt";

/** 纸张方向 */
export type PaperOrientation = "portrait" | "landscape";

/** 文本对齐 */
export type PrintTextAlign = "left" | "center" | "right";

/** 文本垂直对齐 */
export type PrintVerticalAlign = "top" | "middle" | "bottom";

/** 字体粗细 */
export type PrintFontWeight =
    | "normal"
    | "bold"
    | "lighter"
    | "bolder"
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900;

/** 元素数据绑定 */
export interface PrintDataBinding {
    source: PrintDataBindSource;
    /** 字段名（source=field 时生效） */
    fieldName?: string;
    /** 公式表达式（source=formula 时生效，复用 FormulaEngine 语法） */
    formula?: string;
    /** 系统变量（source=system 时生效） */
    systemVar?: PrintSystemVar;
    /** 静态值（source=static 时生效） */
    staticValue?: string;
    /** 数据格式化（日期/数字格式串） */
    format?: string;
    /** 空值替换文本 */
    emptyText?: string;
}

/** 元素基础属性 */
export interface PrintElementBase {
    /** 元素唯一 ID */
    id: string;
    /** 元素类型 */
    type: PrintElementType;
    /** 元素名称（图层显示用） */
    name: string;
    /** X 坐标（单位：mm） */
    x: number;
    /** Y 坐标（单位：mm） */
    y: number;
    /** 宽度（单位：mm） */
    width: number;
    /** 高度（单位：mm） */
    height: number;
    /** 旋转角度（0-359） */
    rotation?: number;
    /** 是否锁定 */
    locked?: boolean;
    /** 是否可见 */
    visible?: boolean;
    /** 透明度 0-1 */
    opacity?: number;
    /** Z 层级 */
    zIndex?: number;
    /** 数据绑定 */
    dataBinding?: PrintDataBinding;
    /** 自定义样式（透传到渲染器） */
    style?: PrintElementStyle;
}

/** 元素样式 */
export interface PrintElementStyle {
    /** 字体族 */
    fontFamily?: string;
    /** 字号（pt） */
    fontSize?: number;
    /** 字重 */
    fontWeight?: PrintFontWeight;
    /** 字体颜色 */
    color?: string;
    /** 背景色 */
    backgroundColor?: string;
    /** 文本水平对齐 */
    textAlign?: PrintTextAlign;
    /** 文本垂直对齐 */
    verticalAlign?: PrintVerticalAlign;
    /** 行高（倍数） */
    lineHeight?: number;
    /** 字间距（px） */
    letterSpacing?: number;
    /** 是否斜体 */
    italic?: boolean;
    /** 是否下划线 */
    underline?: boolean;
    /** 是否删除线 */
    lineThrough?: boolean;
    /** 是否自动换行 */
    wordWrap?: boolean;
    /** 是否溢出隐藏 */
    overflowHidden?: boolean;
    /** 边框（css border 字符串） */
    border?: string;
    /** 圆角 */
    borderRadius?: number;
    /** 内边距 */
    padding?: number | [number, number, number, number];
}

/** 文本元素 */
export interface PrintTextElement extends PrintElementBase {
    type: "text";
}

/** 日期时间元素 */
export interface PrintDateTimeElement extends PrintElementBase {
    type: "datetime";
    /** 日期格式 */
    dateFormat: string;
}

/** 计数器元素（页码/序号） */
export interface PrintCounterElement extends PrintElementBase {
    type: "counter";
    /** 起始值 */
    startValue: number;
    /** 步长 */
    step: number;
    /** 是否每页重置 */
    resetPerPage: boolean;
}

/** 条码元素 */
export interface PrintBarcodeElement extends PrintElementBase {
    type: "barcode";
    /** 码制 */
    symbology: BarcodeSymbology;
    /** 是否显示文本 */
    displayText: boolean;
    /** 条码颜色 */
    barColor: string;
    /** 背景色 */
    bgColor: string;
    /** 模块宽度（px） */
    moduleWidth: number;
    /** 高度（px） */
    barHeight: number;
}

/** 二维码元素 */
export interface PrintQrcodeElement extends PrintElementBase {
    type: "qrcode";
    /** 纠错等级 L/M/Q/H */
    errorCorrectionLevel: "L" | "M" | "Q" | "H";
    /** 颜色 */
    color: string;
    /** 背景色 */
    bgColor: string;
    /** 边距 */
    margin: number;
}

/** 图片元素 */
export interface PrintImageElement extends PrintElementBase {
    type: "image";
    /** 图片 URL 或 base64 */
    src: string;
    /** 适配模式 */
    fitMode: "fill" | "contain" | "cover" | "none";
}

/** 直线元素 */
export interface PrintLineElement extends PrintElementBase {
    type: "line";
    /** 线宽 */
    strokeWidth: number;
    /** 线型 */
    lineStyle: "solid" | "dashed" | "dotted";
    /** 颜色 */
    color: string;
}

/** 矩形元素 */
export interface PrintRectElement extends PrintElementBase {
    type: "rect";
    /** 边框宽度 */
    strokeWidth: number;
    /** 边框颜色 */
    strokeColor: string;
    /** 填充色 */
    fillColor: string;
    /** 圆角 */
    radius: number;
}

/** 椭圆元素 */
export interface PrintEllipseElement extends PrintElementBase {
    type: "ellipse";
    strokeWidth: number;
    strokeColor: string;
    fillColor: string;
}

/** 表格列定义 */
export interface PrintTableColumn {
    /** 字段名 */
    field: string;
    /** 列标题 */
    title: string;
    /** 列宽（mm） */
    width: number;
    /** 对齐方式 */
    align: PrintTextAlign;
    /** 数据格式化 */
    format?: string;
    /** 是否合计 */
    summary?: boolean;
    /** 合计类型 */
    summaryType?: "sum" | "avg" | "count" | "max" | "min";
}

/** 表格元素 */
export interface PrintTableElement extends PrintElementBase {
    type: "table";
    /** 列定义 */
    columns: PrintTableColumn[];
    /** 数据集字段名（绑定到模板数据源中的某个数组字段） */
    dataField: string;
    /** 是否显示表头 */
    showHeader: boolean;
    /** 是否显示边框 */
    showBorder: boolean;
    /** 行高（mm） */
    rowHeight: number;
    /** 表头背景色 */
    headerBgColor: string;
}

/** 联合元素类型 */
export type PrintElement =
    | PrintTextElement
    | PrintDateTimeElement
    | PrintCounterElement
    | PrintBarcodeElement
    | PrintQrcodeElement
    | PrintImageElement
    | PrintLineElement
    | PrintRectElement
    | PrintEllipseElement
    | PrintTableElement;

/** 纸张定义 */
export interface PrintPaper {
    /** 纸张名称 */
    name: string;
    /** 宽度（mm） */
    width: number;
    /** 高度（mm） */
    height: number;
    /** 方向 */
    orientation: PaperOrientation;
    /** 边距（mm）：[上, 右, 下, 左] */
    margin: [number, number, number, number];
    /** 是否自定义尺寸 */
    custom?: boolean;
}

/** 数据字段定义 */
export interface PrintDataField {
    /** 字段名 */
    name: string;
    /** 字段标签 */
    label: string;
    /** 字段类型 */
    type: "string" | "number" | "date" | "boolean" | "object" | "array";
    /** 示例值 */
    sample?: any;
    /** 子字段（type=array/object 时） */
    children?: PrintDataField[];
}

/** 数据源定义 */
export interface PrintDataSource {
    /** 数据源 ID */
    id: string;
    /** 名称 */
    name: string;
    /** 类型 */
    type: "static" | "api" | "sql" | "form";
    /** API URL */
    apiUrl?: string;
    /** SQL 语句 */
    sql?: string;
    /** 表单 ID */
    formId?: string;
    /** 静态数据 */
    staticData?: any;
    /** 字段列表 */
    fields: PrintDataField[];
}

/** 打印模板 */
export interface PrintTemplate {
    /** 模板 ID */
    id: string;
    /** 模板名称 */
    name: string;
    /** 模板编码 */
    code: string;
    /** 分类 */
    category?: string;
    /** 描述 */
    description?: string;
    /** 纸张配置 */
    paper: PrintPaper;
    /** 元素列表 */
    elements: PrintElement[];
    /** 数据源列表 */
    dataSources: PrintDataSource[];
    /** 创建时间 */
    createTime?: number;
    /** 更新时间 */
    updateTime?: number;
    /** 创建人 */
    creator?: string;
    /** 版本号 */
    version?: number;
}

/** 设计器状态 */
export interface PrintDesignerState {
    /** 当前模板 */
    template: PrintTemplate;
    /** 选中元素 ID 列表 */
    selectedIds: string[];
    /** 复制剪贴板 */
    clipboard: PrintElement[];
    /** 历史记录 */
    history: PrintTemplate[];
    /** 历史指针 */
    historyIndex: number;
    /** 缩放比例 */
    zoom: number;
    /** 是否显示标尺 */
    showRuler: boolean;
    /** 是否显示网格 */
    showGrid: boolean;
    /** 是否吸附 */
    snap: boolean;
    /** 吸附阈值（mm） */
    snapThreshold: number;
    /** 是否只读 */
    readonly: boolean;
}

/** 渲染上下文（运行时数据 + 系统变量） */
export interface PrintRenderContext {
    /** 当前页码 */
    pageNumber: number;
    /** 总页数 */
    pageCount: number;
    /** 操作员 */
    operator: string;
    /** 打印机名称 */
    printerName: string;
    /** 租户名 */
    tenantName: string;
    /** 模板数据（按数据源 ID 索引） */
    data: Record<string, any>;
    /** 渲染时间戳 */
    renderTime: number;
}
