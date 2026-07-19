import { Check, Delete, Download, FolderOpened, QuestionFilled, Select, TrendCharts } from "@element-plus/icons-vue";
import type { PivotData } from "@/components/pivot";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * 透视分析 Demo 示例数据
 *
 * 30 条销售记录（华东/华南/华北/西南 × 产品A/B/C × 1-3月），5 个字段。
 */
export const SAMPLE_PIVOT: PivotData = {
    name: "销售数据透视分析",
    records: [
        { region: "华东", product: "产品A", month: "1月", amount: 12500, quantity: 50 },
        { region: "华东", product: "产品A", month: "2月", amount: 15200, quantity: 61 },
        { region: "华东", product: "产品A", month: "3月", amount: 18900, quantity: 75 },
        { region: "华东", product: "产品B", month: "1月", amount: 8800, quantity: 32 },
        { region: "华东", product: "产品B", month: "2月", amount: 9600, quantity: 35 },
        { region: "华东", product: "产品B", month: "3月", amount: 11200, quantity: 41 },
        { region: "华东", product: "产品C", month: "1月", amount: 6300, quantity: 18 },
        { region: "华东", product: "产品C", month: "2月", amount: 7100, quantity: 21 },
        { region: "华东", product: "产品C", month: "3月", amount: 8400, quantity: 24 },
        { region: "华南", product: "产品A", month: "1月", amount: 10800, quantity: 43 },
        { region: "华南", product: "产品A", month: "2月", amount: 13400, quantity: 53 },
        { region: "华南", product: "产品A", month: "3月", amount: 16100, quantity: 64 },
        { region: "华南", product: "产品B", month: "1月", amount: 7200, quantity: 26 },
        { region: "华南", product: "产品B", month: "2月", amount: 8500, quantity: 31 },
        { region: "华南", product: "产品B", month: "3月", amount: 9900, quantity: 36 },
        { region: "华南", product: "产品C", month: "1月", amount: 5400, quantity: 15 },
        { region: "华南", product: "产品C", month: "2月", amount: 6200, quantity: 18 },
        { region: "华南", product: "产品C", month: "3月", amount: 7300, quantity: 21 },
        { region: "华北", product: "产品A", month: "1月", amount: 9600, quantity: 38 },
        { region: "华北", product: "产品A", month: "2月", amount: 11800, quantity: 47 },
        { region: "华北", product: "产品A", month: "3月", amount: 14200, quantity: 56 },
        { region: "华北", product: "产品B", month: "1月", amount: 6500, quantity: 23 },
        { region: "华北", product: "产品B", month: "2月", amount: 7800, quantity: 28 },
        { region: "华北", product: "产品B", month: "3月", amount: 9100, quantity: 33 },
        { region: "华北", product: "产品C", month: "1月", amount: 4800, quantity: 14 },
        { region: "华北", product: "产品C", month: "2月", amount: 5600, quantity: 16 },
        { region: "华北", product: "产品C", month: "3月", amount: 6700, quantity: 19 },
        { region: "西南", product: "产品A", month: "1月", amount: 7400, quantity: 29 },
        { region: "西南", product: "产品B", month: "2月", amount: 5200, quantity: 19 },
        { region: "西南", product: "产品C", month: "3月", amount: 3900, quantity: 11 },
    ],
    fields: [
        { name: "region", label: "区域", type: "string" },
        { name: "product", label: "产品", type: "string" },
        { name: "month", label: "月份", type: "string" },
        { name: "amount", label: "销售额", type: "number", aggregation: "sum", format: "¥#,##0.00" },
        { name: "quantity", label: "销量", type: "number", aggregation: "sum", format: "#,##0" },
    ],
    config: {
        rows: ["region"],
        columns: ["product"],
        values: ["amount"],
        filters: [],
        sorts: [],
        showTotal: true,
        showRowSubtotal: true,
        showColSubtotal: true,
        numberFormat: "¥#,##0.00",
    },
};

/**
 * PivotDemo 主操作（左侧）
 *
 * demo 级操作，不重复底层 PivotToolbar 的字段拖拽/聚合配置等功能。
 */
export const PIVOT_ACTIONS: ShDemoAction[] = [
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.pivot.toolbar.loadSample", group: "data" },
    { key: "clear", icon: Delete, labelKey: "advanced.pivot.toolbar.clear", type: "danger", group: "data" },
    { key: "exportJson", icon: Download, tooltipKey: "advanced.pivot.toolbar.exportJson", iconOnly: true, group: "data" },
    { key: "save", icon: Check, labelKey: "advanced.pivot.toolbar.save", type: "primary" },
];

/**
 * PivotDemo 次要操作（右侧）
 *
 * toggleChart/toggleTotal 控制 PivotTable 内部视图，因底层不监听 props，点击后提示用户在底层工具栏操作。
 */
export const PIVOT_SECONDARY: ShDemoAction[] = [
    { key: "toggleChart", icon: TrendCharts, tooltipKey: "advanced.pivot.toolbar.toggleChart", iconOnly: true },
    { key: "toggleTotal", icon: Select, tooltipKey: "advanced.pivot.toolbar.toggleTotal", iconOnly: true, active: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.pivot.toolbar.help", iconOnly: true },
];
