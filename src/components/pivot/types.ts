/**
 * 透视分析类型定义
 */

/** 聚合方式 */
export type PivotAggregation =
  "sum" | "count" | "avg" | "min" | "max" | "distinct";

/** 图表类型 */
export type PivotChartType =
  "bar" | "line" | "area" | "pie" | "radar" | "scatter";

/** 字段角色 */
export type PivotFieldRole = "row" | "column" | "value" | "filter";

/** 字段类型 */
export type PivotFieldType = "string" | "number" | "date";

/** 数据字段定义 */
export interface PivotField {
  /** 字段名 */
  name: string;
  /** 显示名 */
  label: string;
  /** 类型 */
  type: PivotFieldType;
  /** 聚合方式（仅 value 角色） */
  aggregation?: PivotAggregation;
  /** 数字格式化模板 */
  format?: string;
}

/** 数据记录 */
export type PivotRecord = Record<string, any>;

/** 过滤条件 */
export interface PivotFilter {
  field: string;
  operator:
    | "eq"
    | "neq"
    | "in"
    | "notIn"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "between"
    | "contains";
  value: any;
}

/** 排序规则 */
export interface PivotSort {
  field: string;
  direction: "asc" | "desc";
}

/** 透视配置 */
export interface PivotConfig {
  /** 行字段 */
  rows: string[];
  /** 列字段 */
  columns: string[];
  /** 值字段 */
  values: string[];
  /** 过滤条件 */
  filters: PivotFilter[];
  /** 排序 */
  sorts: PivotSort[];
  /** 是否显示合计 */
  showTotal: boolean;
  /** 是否显示行小计 */
  showRowSubtotal: boolean;
  /** 是否显示列小计 */
  showColSubtotal: boolean;
  /** 数字格式 */
  numberFormat: string;
}

/** 透视数据 */
export interface PivotData {
  /** 原始数据 */
  records: PivotRecord[];
  /** 字段定义 */
  fields: PivotField[];
  /** 配置 */
  config: PivotConfig;
  /** 名称 */
  name: string;
}

/** 透视单元格 */
export interface PivotCell {
  rowKey: string;
  colKey: string;
  value: number | string | null;
  raw: PivotRecord[];
}

/** 透视表结果 */
export interface PivotTableResult {
  rowHeaders: string[][];
  colHeaders: string[][];
  cells: PivotCell[][];
  rowTotals: (number | string | null)[];
  colTotals: (number | string | null)[];
  grandTotal: number | string | null;
}

/** 图表系列 */
export interface PivotChartSeries {
  name: string;
  data: (number | null)[];
}

/** 图表结果 */
export interface PivotChartResult {
  categories: string[];
  series: PivotChartSeries[];
  chartType: PivotChartType;
}

/** 聚合函数预设 */
export interface PivotAggregationPreset {
  value: PivotAggregation;
  label: string;
}

/** 图表类型预设 */
export interface PivotChartTypePreset {
  value: PivotChartType;
  label: string;
  icon: string;
}
