/**
 * 打印模板设计器 - 常量定义
 *
 * 集中管理：纸张预设、默认元素、字体、颜色等
 */

import { i18n } from "@/lang";
import type {
    BarcodeSymbology,
    PrintDataField,
    PrintElement,
    PrintPaper,
    PrintSystemVar,
} from "./types";

/** 预设纸张 */
export const PRESET_PAPERS: PrintPaper[] = [
    {
        name: "A4",
        width: 210,
        height: 297,
        orientation: "portrait",
        margin: [10, 10, 10, 10],
    },
    {
        name: "A5",
        width: 148,
        height: 210,
        orientation: "portrait",
        margin: [8, 8, 8, 8],
    },
    {
        name: "B5",
        width: 176,
        height: 250,
        orientation: "portrait",
        margin: [10, 10, 10, 10],
    },
    {
        name: "Letter",
        width: 216,
        height: 279,
        orientation: "portrait",
        margin: [10, 10, 10, 10],
    },
    {
        name: "Legal",
        width: 216,
        height: 356,
        orientation: "portrait",
        margin: [10, 10, 10, 10],
    },
    {
        name: "Receipt58",
        width: 58,
        height: 100,
        orientation: "portrait",
        margin: [2, 2, 2, 2],
    },
    {
        name: "Receipt80",
        width: 80,
        height: 100,
        orientation: "portrait",
        margin: [3, 3, 3, 3],
    },
    {
        name: "Label40x30",
        width: 40,
        height: 30,
        orientation: "landscape",
        margin: [1, 1, 1, 1],
    },
    {
        name: "Label60x40",
        width: 60,
        height: 40,
        orientation: "landscape",
        margin: [1, 1, 1, 1],
    },
    {
        name: "Label100x100",
        width: 100,
        height: 100,
        orientation: "portrait",
        margin: [2, 2, 2, 2],
    },
];

/** 默认纸张 */
export const DEFAULT_PAPER: PrintPaper = PRESET_PAPERS[0];

/** 默认字体族 */
export const DEFAULT_FONT_FAMILY = "Microsoft YaHei";

/** 字号预设 */
export const FONT_SIZE_PRESETS = [6, 8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

/** 常用颜色 */
export const COLOR_PRESETS = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#FF8C00",
    "#FFD700",
    "#008000",
    "#0000FF",
    "#4B0082",
    "#EE82EE",
    "#A9A9A9",
    "#808080",
    "#404040",
];

/** 条码码制选项 */
export const BARCODE_SYMBOLOGY_OPTIONS: Array<{
    label: string;
    value: BarcodeSymbology;
}> = [
    { label: "CODE128", value: "CODE128" },
    { label: "CODE39", value: "CODE39" },
    { label: "EAN13", value: "EAN13" },
    { label: "EAN8", value: "EAN8" },
    { label: "UPC-A", value: "UPC_A" },
    { label: "UPC-E", value: "UPC_E" },
    { label: "ITF14", value: "ITF14" },
    { label: "MSI", value: "MSI" },
];

/** 系统变量选项 */
export const SYSTEM_VAR_OPTIONS: Array<{
    label: string;
    value: PrintSystemVar;
}> = [
    { label: i18n("print.sysVar.currentDate"), value: "currentDate" },
    { label: i18n("print.sysVar.currentTime"), value: "currentTime" },
    { label: i18n("print.sysVar.currentDateTime"), value: "currentDateTime" },
    { label: i18n("print.sysVar.pageNumber"), value: "pageNumber" },
    { label: i18n("print.sysVar.pageCount"), value: "pageCount" },
    { label: i18n("print.sysVar.operator"), value: "operator" },
    { label: i18n("print.sysVar.printerName"), value: "printerName" },
    { label: i18n("print.sysVar.templateName"), value: "templateName" },
    { label: i18n("print.sysVar.tenantName"), value: "tenantName" },
];

/** 系统变量格式化（日期类） */
export const SYSTEM_VAR_DATE_FORMAT: Record<string, string> = {
    currentDate: "YYYY-MM-DD",
    currentTime: "HH:mm:ss",
    currentDateTime: "YYYY-MM-DD HH:mm:ss",
};

/** 默认数据字段（用于演示） */
export const DEFAULT_DATA_FIELDS: PrintDataField[] = [
    { name: "title", label: i18n("print.field.title"), type: "string", sample: "示例标题" },
    { name: "code", label: i18n("print.field.code"), type: "string", sample: "SN20260718001" },
    { name: "name", label: i18n("print.field.name"), type: "string", sample: "示例名称" },
    { name: "price", label: i18n("print.field.price"), type: "number", sample: 99.5 },
    { name: "qty", label: i18n("print.field.qty"), type: "number", sample: 10 },
    { name: "amount", label: i18n("print.field.amount"), type: "number", sample: 995 },
    { name: "date", label: i18n("print.field.date"), type: "date", sample: "2026-07-18" },
    {
        name: "items",
        label: i18n("print.field.items"),
        type: "array",
        children: [
            { name: "sku", label: "SKU", type: "string", sample: "SKU001" },
            { name: "name", label: i18n("print.field.name"), type: "string", sample: "商品名" },
            { name: "qty", label: i18n("print.field.qty"), type: "number", sample: 1 },
            { name: "price", label: i18n("print.field.price"), type: "number", sample: 10 },
        ],
    },
];

/** 创建默认文本元素 */
export const createTextElement = (overrides: Partial<PrintElement> = {}): PrintElement => ({
    id: `text_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: "text",
    name: i18n("print.element.text"),
    x: 10,
    y: 10,
    width: 60,
    height: 10,
    dataBinding: { source: "static", staticValue: i18n("print.element.text") },
    style: {
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: 12,
        color: "#000000",
        textAlign: "left",
        verticalAlign: "middle",
    },
    ...overrides,
} as PrintElement);

/** 创建默认条码元素 */
export const createBarcodeElement = (
    overrides: Partial<PrintElement> = {},
): PrintElement => ({
    id: `barcode_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: "barcode",
    name: i18n("print.element.barcode"),
    x: 10,
    y: 30,
    width: 80,
    height: 30,
    dataBinding: { source: "field", fieldName: "code" },
    ...({
        symbology: "CODE128",
        displayText: true,
        barColor: "#000000",
        bgColor: "#FFFFFF",
        moduleWidth: 2,
        barHeight: 60,
    } as any),
    ...overrides,
} as PrintElement);

/** 创建默认二维码元素 */
export const createQrcodeElement = (
    overrides: Partial<PrintElement> = {},
): PrintElement => ({
    id: `qrcode_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: "qrcode",
    name: i18n("print.element.qrcode"),
    x: 10,
    y: 70,
    width: 40,
    height: 40,
    dataBinding: { source: "field", fieldName: "code" },
    ...({
        errorCorrectionLevel: "M",
        color: "#000000",
        bgColor: "#FFFFFF",
        margin: 2,
    } as any),
    ...overrides,
} as PrintElement);

/** 创建默认图片元素 */
export const createImageElement = (
    overrides: Partial<PrintElement> = {},
): PrintElement => ({
    id: `image_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: "image",
    name: i18n("print.element.image"),
    x: 10,
    y: 120,
    width: 50,
    height: 30,
    ...({ src: "", fitMode: "contain" } as any),
    ...overrides,
} as PrintElement);

/** 创建默认直线元素 */
export const createLineElement = (overrides: Partial<PrintElement> = {}): PrintElement => ({
    id: `line_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: "line",
    name: i18n("print.element.line"),
    x: 10,
    y: 160,
    width: 100,
    height: 0,
    ...({
        strokeWidth: 1,
        lineStyle: "solid",
        color: "#000000",
    } as any),
    ...overrides,
} as PrintElement);

/** 创建默认矩形元素 */
export const createRectElement = (overrides: Partial<PrintElement> = {}): PrintElement => ({
    id: `rect_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: "rect",
    name: i18n("print.element.rect"),
    x: 10,
    y: 170,
    width: 60,
    height: 30,
    ...({
        strokeWidth: 1,
        strokeColor: "#000000",
        fillColor: "transparent",
        radius: 0,
    } as any),
    ...overrides,
} as PrintElement);

/** 创建默认日期时间元素 */
export const createDateTimeElement = (
    overrides: Partial<PrintElement> = {},
): PrintElement => ({
    id: `datetime_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: "datetime",
    name: i18n("print.element.datetime"),
    x: 10,
    y: 210,
    width: 60,
    height: 10,
    dataBinding: { source: "system", systemVar: "currentDateTime" },
    ...({
        dateFormat: "YYYY-MM-DD HH:mm:ss",
    } as any),
    style: {
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: 12,
        color: "#000000",
        textAlign: "left",
    },
    ...overrides,
} as PrintElement);

/** 创建默认计数器元素 */
export const createCounterElement = (
    overrides: Partial<PrintElement> = {},
): PrintElement => ({
    id: `counter_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: "counter",
    name: i18n("print.element.counter"),
    x: 10,
    y: 230,
    width: 30,
    height: 10,
    dataBinding: { source: "system", systemVar: "pageNumber" },
    ...({
        startValue: 1,
        step: 1,
        resetPerPage: true,
    } as any),
    style: {
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: 12,
        color: "#000000",
        textAlign: "center",
    },
    ...overrides,
} as PrintElement);

/** 创建默认表格元素 */
export const createTableElement = (
    overrides: Partial<PrintElement> = {},
): PrintElement => ({
    id: `table_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: "table",
    name: i18n("print.element.table"),
    x: 10,
    y: 250,
    width: 150,
    height: 60,
    dataBinding: { source: "field", fieldName: "items" },
    ...({
        columns: [
            { field: "sku", title: "SKU", width: 40, align: "left" },
            { field: "name", title: i18n("print.field.name"), width: 60, align: "left" },
            { field: "qty", title: i18n("print.field.qty"), width: 25, align: "right" },
            { field: "price", title: i18n("print.field.price"), width: 25, align: "right" },
        ],
        dataField: "items",
        showHeader: true,
        showBorder: true,
        rowHeight: 8,
        headerBgColor: "#F5F5F5",
    } as any),
    ...overrides,
} as PrintElement);

/** 元素工厂函数映射 */
export const ELEMENT_FACTORIES: Record<string, (overrides?: Partial<PrintElement>) => PrintElement> = {
    text: createTextElement,
    barcode: createBarcodeElement,
    qrcode: createQrcodeElement,
    image: createImageElement,
    line: createLineElement,
    rect: createRectElement,
    datetime: createDateTimeElement,
    counter: createCounterElement,
    table: createTableElement,
};

/** MM 转 PX 比例（96 DPI：1mm ≈ 3.7795px） */
export const MM_TO_PX = 3.7795275591;

/** PX 转 MM 比例 */
export const PX_TO_MM = 1 / MM_TO_PX;

/** MM 转 PT 比例（1pt = 1/72 inch, 1 inch = 25.4mm） */
export const MM_TO_PT = 72 / 25.4;

/** PT 转 MM 比例 */
export const PT_TO_MM = 25.4 / 72;

/** 默认缩放 */
export const DEFAULT_ZOOM = 1;

/** 缩放范围 */
export const ZOOM_RANGE = { min: 0.25, max: 4 };

/** 缩放步进 */
export const ZOOM_STEP = 0.1;

/** 默认吸附阈值 */
export const DEFAULT_SNAP_THRESHOLD = 1;

/** 历史记录最大长度 */
export const MAX_HISTORY_SIZE = 50;
