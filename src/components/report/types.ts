/**
 * 单元格报表设计器 - 类型定义
 *
 * 借鉴 FineReport / 润乾报表概念：单元格 + 表达式 + 数据集 + 分组扩展
 */

/** 单元格数据类型 */
export type CellDataType =
  | "text"
  | "number"
  | "date"
  | "datetime"
  | "currency"
  | "percent"
  | "formula"
  | "image"
  | "barcode";

/** 单元格扩展方向（FineReport 风格：纵向/横向/不扩展） */
export type CellExpandDirection = "none" | "vertical" | "horizontal";

/** 单元格对齐 */
export type CellAlign = "left" | "center" | "right";

/** 单元格垂直对齐 */
export type CellVerticalAlign = "top" | "middle" | "bottom";

/** 单元格边框位置 */
export type BorderPosition =
  "top" | "right" | "bottom" | "left" | "all" | "none";

/** 单元格表达式类型 */
export type CellFormulaType =
  | "static" // 静态文本
  | "dataset" // 数据集字段 ${ds.field}
  | "cellRef" // 单元格引用 =A1+B2
  | "aggregate" // 聚合 =SUM(A1:A10) =AVG =COUNT =MAX =MIN
  | "function" // 函数 =IF() =CONCAT() =DATE()
  | "expression"; // 复合表达式

/** 单元格样式 */
export interface CellStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  color?: string;
  backgroundColor?: string;
  textAlign?: CellAlign;
  verticalAlign?: CellVerticalAlign;
  border?: BorderPosition;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  /** 文本格式化（数字/日期格式串） */
  format?: string;
  /** 是否自动换行 */
  wrap?: boolean;
  /** 缩进 */
  indent?: number;
}

/** 单元格坐标（行 1-based，列 A-based 字母） */
export interface CellCoordinate {
  /** 行号，1-based */
  row: number;
  /** 列号，1-based */
  col: number;
}

/** 单元格表达式配置 */
export interface CellFormula {
  type: CellFormulaType;
  /** 表达式原文 */
  expression: string;
  /** 数据集引用（type=dataset 时） */
  datasetName?: string;
  /** 字段名（type=dataset 时） */
  fieldName?: string;
  /** 聚合函数（type=aggregate 时） */
  aggregateFunc?: "SUM" | "AVG" | "COUNT" | "MAX" | "MIN" | "COUNT_DISTINCT";
  /** 聚合范围（单元格区域，如 "A1:A10"） */
  aggregateRange?: string;
}

/** 单元格定义 */
export interface ReportCell {
  /** 单元格地址 A1 */
  address: string;
  row: number;
  col: number;
  /** 行跨度（合并单元格） */
  rowSpan: number;
  /** 列跨度 */
  colSpan: number;
  /** 单元格值（运行时） */
  value?: any;
  /** 表达式配置 */
  formula?: CellFormula;
  /** 样式 */
  style?: CellStyle;
  /** 是否锁定 */
  locked?: boolean;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 扩展方向 */
  expandDirection?: CellExpandDirection;
  /** 分组字段（用于分组报表） */
  groupField?: string;
  /** 条件格式规则 */
  conditionalFormat?: ConditionalFormatRule[];
  /** 数据格式 */
  dataType?: CellDataType;
}

/** 条件格式规则 */
export interface ConditionalFormatRule {
  /** 规则 ID */
  id: string;
  /** 条件表达式 */
  condition: string;
  /** 满足条件时应用的样式 */
  style: Partial<CellStyle>;
}

/** 行定义 */
export interface ReportRow {
  /** 行号 */
  index: number;
  /** 行高（px） */
  height: number;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 行类型 */
  type?: "header" | "data" | "footer" | "title";
  /** 重复模式（打印时） */
  repeat?: "none" | "everyPage" | "firstPage";
}

/** 列定义 */
export interface ReportColumn {
  /** 列号 */
  index: number;
  /** 列宽（px） */
  width: number;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 是否自动调整宽度 */
  autoWidth?: boolean;
}

/** 数据集字段 */
export interface DatasetField {
  name: string;
  label: string;
  type: "string" | "number" | "date" | "datetime" | "boolean";
}

/** 数据集定义 */
export interface ReportDataset {
  id: string;
  name: string;
  type: "sql" | "api" | "static" | "json";
  /** SQL 语句 */
  sql?: string;
  /** API URL */
  apiUrl?: string;
  /** 静态数据 */
  data?: any[];
  /** 字段列表 */
  fields: DatasetField[];
  /** 参数配置 */
  params?: Array<{ name: string; defaultValue?: any }>;
}

/** 报表参数 */
export interface ReportParameter {
  name: string;
  label: string;
  type: "string" | "number" | "date" | "datetime" | "boolean" | "select";
  /** 默认值 */
  defaultValue?: any;
  /** 选项（type=select 时） */
  options?: Array<{ label: string; value: any }>;
  /** 是否必填 */
  required?: boolean;
}

/** 报表纸张 */
export interface ReportPaper {
  name: string;
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
  margin: [number, number, number, number];
  /** 是否显示网格线 */
  showGrid?: boolean;
}

/** 报表定义 */
export interface ReportTemplate {
  id: string;
  name: string;
  code: string;
  category?: string;
  description?: string;
  /** 行数 */
  rowCount: number;
  /** 列数 */
  colCount: number;
  /** 默认行高 */
  defaultRowHeight: number;
  /** 默认列宽 */
  defaultColWidth: number;
  /** 单元格（稀疏存储，按地址索引） */
  cells: Record<string, ReportCell>;
  /** 行配置 */
  rows: ReportRow[];
  /** 列配置 */
  columns: ReportColumn[];
  /** 数据集列表 */
  datasets: ReportDataset[];
  /** 参数列表 */
  parameters: ReportParameter[];
  /** 纸张 */
  paper: ReportPaper;
  /** 页眉 */
  header?: ReportCell[];
  /** 页脚 */
  footer?: ReportCell[];
  /** 创建时间 */
  createTime?: number;
  updateTime?: number;
  version?: number;
}

/** 设计器状态 */
export interface ReportDesignerState {
  template: ReportTemplate;
  /** 选中单元格地址列表 */
  selectedAddresses: string[];
  /** 复制剪贴板 */
  clipboard: ReportCell[];
  /** 历史记录 */
  history: ReportTemplate[];
  historyIndex: number;
  /** 缩放 */
  zoom: number;
  /** 是否显示网格 */
  showGrid: boolean;
  /** 是否显示公式 */
  showFormula: boolean;
  /** 是否只读 */
  readonly: boolean;
  /** 当前编辑单元格地址 */
  editingAddress: string | null;
}

/** 渲染上下文 */
export interface ReportRenderContext {
  /** 参数值 */
  params: Record<string, any>;
  /** 数据集数据 */
  datasets: Record<string, any[]>;
  /** 当前页码 */
  pageNumber: number;
  /** 总页数 */
  pageCount: number;
  /** 操作员 */
  operator: string;
  /** 渲染时间 */
  renderTime: number;
}
