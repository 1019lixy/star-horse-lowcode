/**
 * PDF 常量定义
 */
import { i18n } from "@/lang";
import type { PdfElementType, PdfElementTypePreset, PdfFont, PdfPage, PdfTemplate } from "./types";

/** 默认页面（A4，单位 mm） */
export const DEFAULT_PDF_PAGE: PdfPage = {
    width: 210,
    height: 297,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
};

/** 默认字体 */
export const DEFAULT_PDF_FONT: PdfFont = {
    family: "Microsoft YaHei",
    size: 12,
    weight: "normal",
    style: "normal",
    color: "#000000",
};

/** MM 转 PX（96 DPI） */
export const MM_TO_PX = 3.7795275591;

/** 元素类型预设 */
export const PDF_ELEMENT_TYPE_PRESETS: PdfElementTypePreset[] = [
    { type: "heading", label: i18n("pdf.element.heading"), icon: "heading" },
    { type: "text", label: i18n("pdf.element.text"), icon: "text" },
    { type: "paragraph", label: i18n("pdf.element.paragraph"), icon: "paragraph" },
    { type: "image", label: i18n("pdf.element.image"), icon: "image" },
    { type: "table", label: i18n("pdf.element.table"), icon: "table" },
    { type: "divider", label: i18n("pdf.element.divider"), icon: "divider" },
    { type: "pageBreak", label: i18n("pdf.element.pageBreak"), icon: "pageBreak" },
    { type: "barcode", label: i18n("pdf.element.barcode"), icon: "barcode" },
    { type: "qrcode", label: i18n("pdf.element.qrcode"), icon: "qrcode" },
    { type: "signature", label: i18n("pdf.element.signature"), icon: "signature" },
    { type: "checkbox", label: i18n("pdf.element.checkbox"), icon: "checkbox" },
    { type: "date", label: i18n("pdf.element.date"), icon: "date" },
];

/** 字体族预设 */
export const PDF_FONT_FAMILY_PRESETS = [
    "Microsoft YaHei",
    "SimSun",
    "SimHei",
    "KaiTi",
    "Arial",
    "Times New Roman",
    "Courier New",
];

/** 纸张预设 */
export const PDF_PAPER_PRESETS = [
    { label: i18n("pdf.paper.a4"), width: 210, height: 297 },
    { label: i18n("pdf.paper.a3"), width: 297, height: 420 },
    { label: i18n("pdf.paper.a5"), width: 148, height: 210 },
    { label: i18n("pdf.paper.letter"), width: 215.9, height: 279.4 },
    { label: i18n("pdf.paper.legal"), width: 215.9, height: 355.6 },
];

/** 创建空模板 */
export const createTemplate = (overrides: Partial<PdfTemplate> = {}): PdfTemplate => ({
    name: i18n("pdf.template.new"),
    page: { ...DEFAULT_PDF_PAGE },
    elements: [],
    ...overrides,
});

/** 创建元素工厂 */
export const createElement = (type: PdfElementType, overrides: Partial<any> = {}) => {
    const id = pdf__;
    const base = {
        id,
        x: 20,
        y: 20,
        width: 100,
        height: 30,
        rotation: 0,
        zIndex: 0,
    };
    switch (type) {
        case "heading":
            return {
                ...base,
                type,
                text: i18n("pdf.element.heading"),
                font: { ...DEFAULT_PDF_FONT, size: 18, weight: "bold" as const },
                align: "left" as const,
                ...overrides,
            };
        case "text":
            return {
                ...base,
                type,
                text: i18n("pdf.element.text"),
                font: { ...DEFAULT_PDF_FONT },
                align: "left" as const,
                ...overrides,
            };
        case "paragraph":
            return {
                ...base,
                type,
                text: i18n("pdf.element.paragraph"),
                font: { ...DEFAULT_PDF_FONT },
                align: "left" as const,
                height: 60,
                ...overrides,
            };
        case "image":
            return {
                ...base,
                type,
                src: "",
                fit: "contain" as const,
                height: 80,
                ...overrides,
            };
        case "table":
            return {
                ...base,
                type,
                columns: [
                    { field: "col1", label: i18n("pdf.table.column1"), width: 50, align: "left" as const },
                    { field: "col2", label: i18n("pdf.table.column2"), width: 50, align: "left" as const },
                ],
                headerBgColor: "#F5F7FA",
                borderColor: "#DCDFE6",
                height: 60,
                width: 150,
                ...overrides,
            };
        case "divider":
            return {
                ...base,
                type,
                color: "#000000",
                thickness: 1,
                style: "solid" as const,
                height: 1,
                width: 170,
                ...overrides,
            };
        case "pageBreak":
            return { ...base, type, height: 5, width: 170, ...overrides };
        case "barcode":
            return {
                ...base,
                type,
                value: "1234567890",
                format: "CODE128" as const,
                height: 40,
                width: 100,
                ...overrides,
            };
        case "qrcode":
            return {
                ...base,
                type,
                value: "https://example.com",
                format: "QR" as const,
                height: 60,
                width: 60,
                ...overrides,
            };
        case "signature":
            return {
                ...base,
                type,
                src: "",
                fit: "contain" as const,
                height: 40,
                width: 100,
                ...overrides,
            };
        case "checkbox":
            return {
                ...base,
                type,
                label: i18n("pdf.element.checkbox"),
                checked: false,
                height: 16,
                width: 16,
                ...overrides,
            };
        case "date":
            return {
                ...base,
                type,
                text: new Date().toISOString().slice(0, 10),
                font: { ...DEFAULT_PDF_FONT },
                align: "left" as const,
                dataField: "currentDate",
                ...overrides,
            };
        default:
            return { ...base, type, ...overrides };
    }
};