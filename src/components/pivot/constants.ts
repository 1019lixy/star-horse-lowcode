/**
 * 透视分析常量定义
 */
import { i18n } from "@/lang";
import type {
  PivotAggregation,
  PivotAggregationPreset,
  PivotChartTypePreset,
  PivotConfig,
  PivotField,
} from "./types";

/** 默认配置 */
export const DEFAULT_PIVOT_CONFIG: PivotConfig = {
  rows: [],
  columns: [],
  values: [],
  filters: [],
  sorts: [],
  showTotal: true,
  showRowSubtotal: true,
  showColSubtotal: true,
  numberFormat: "#,##0.00",
};

/** 聚合方式预设 */
export const PIVOT_AGGREGATION_PRESETS: PivotAggregationPreset[] = [
  { value: "sum", label: i18n("pivot.aggregation.sum") },
  { value: "count", label: i18n("pivot.aggregation.count") },
  { value: "avg", label: i18n("pivot.aggregation.avg") },
  { value: "min", label: i18n("pivot.aggregation.min") },
  { value: "max", label: i18n("pivot.aggregation.max") },
  { value: "distinct", label: i18n("pivot.aggregation.distinct") },
];

/** 图表类型预设 */
export const PIVOT_CHART_TYPE_PRESETS: PivotChartTypePreset[] = [
  { value: "bar", label: i18n("pivot.chart.bar"), icon: "Histogram" },
  { value: "line", label: i18n("pivot.chart.line"), icon: "TrendCharts" },
  { value: "area", label: i18n("pivot.chart.area"), icon: "AreaChart" },
  { value: "pie", label: i18n("pivot.chart.pie"), icon: "PieChart" },
  { value: "radar", label: i18n("pivot.chart.radar"), icon: "Rank" },
  {
    value: "scatter",
    label: i18n("pivot.chart.scatter"),
    icon: "DataAnalysis",
  },
];

/** 字段类型预设 */
export const PIVOT_FIELD_TYPE_PRESETS = [
  { value: "string", label: i18n("pivot.fieldType.string") },
  { value: "number", label: i18n("pivot.fieldType.number") },
  { value: "date", label: i18n("pivot.fieldType.date") },
];

/** 字段角色预设 */
export const PIVOT_FIELD_ROLE_PRESETS = [
  { value: "row", label: i18n("pivot.fieldRole.row") },
  { value: "column", label: i18n("pivot.fieldRole.column") },
  { value: "value", label: i18n("pivot.fieldRole.value") },
  { value: "filter", label: i18n("pivot.fieldRole.filter") },
];

/** 数字格式预设 */
export const PIVOT_NUMBER_FORMAT_PRESETS = [
  { value: "#,##0", label: i18n("pivot.format.integer") },
  { value: "#,##0.00", label: i18n("pivot.format.decimal2") },
  { value: "#,##0.0000", label: i18n("pivot.format.decimal4") },
  { value: "0.00%", label: i18n("pivot.format.percent") },
  { value: "¥#,##0.00", label: i18n("pivot.format.currency") },
  { value: "#,##0.00,,", label: i18n("pivot.format.million") },
];

/** 创建字段 */
export const createField = (
  overrides: Partial<PivotField> = {},
): PivotField => ({
  name: `field_${Date.now()}`,
  label: i18n("pivot.field.newField"),
  type: "string",
  aggregation: "sum",
  ...overrides,
});

/** 聚合函数表 */
export const AGGREGATORS: Record<
  PivotAggregation,
  (values: number[]) => number
> = {
  sum: (vals) => vals.reduce((a, b) => a + b, 0),
  count: (vals) => vals.length,
  avg: (vals) =>
    vals.length === 0 ? 0 : vals.reduce((a, b) => a + b, 0) / vals.length,
  min: (vals) => (vals.length === 0 ? 0 : Math.min(...vals)),
  max: (vals) => (vals.length === 0 ? 0 : Math.max(...vals)),
  distinct: (vals) => new Set(vals).size,
};

/** 图表颜色 */
export const PIVOT_CHART_COLORS = [
  "#5470C6",
  "#91CC75",
  "#FAC858",
  "#EE6666",
  "#73C0DE",
  "#3BA272",
  "#FC8452",
  "#9A60B4",
  "#EA7CCC",
  "#91CA8C",
];
