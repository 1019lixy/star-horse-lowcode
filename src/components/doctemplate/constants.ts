/**
 * 文档模板常量定义
 */
import { i18n } from "@/lang";
import type { DocTemplate, DocTemplateCategoryPreset, DocVariable, DocVariableType } from "./types";

/** 分类预设 */
export const DOC_CATEGORY_PRESETS: DocTemplateCategoryPreset[] = [
    { value: "contract", label: i18n("doctemplate.category.contract") },
    { value: "proposal", label: i18n("doctemplate.category.proposal") },
    { value: "report", label: i18n("doctemplate.category.report") },
    { value: "notice", label: i18n("doctemplate.category.notice") },
    { value: "letter", label: i18n("doctemplate.category.letter") },
    { value: "custom", label: i18n("doctemplate.category.custom") },
];

/** 变量类型预设 */
export const DOC_VARIABLE_TYPE_PRESETS: { value: DocVariableType; label: string }[] = [
    { value: "string", label: i18n("doctemplate.varType.string") },
    { value: "number", label: i18n("doctemplate.varType.number") },
    { value: "date", label: i18n("doctemplate.varType.date") },
    { value: "boolean", label: i18n("doctemplate.varType.boolean") },
    { value: "select", label: i18n("doctemplate.varType.select") },
    { value: "richtext", label: i18n("doctemplate.varType.richtext") },
    { value: "image", label: i18n("doctemplate.varType.image") },
    { value: "table", label: i18n("doctemplate.varType.table") },
];

/** 创建变量 */
export const createVariable = (overrides: Partial<DocVariable> = {}): DocVariable => ({
    id: `var_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: `var${Math.floor(Math.random() * 1000)}`,
    label: i18n("doctemplate.variable.newVar"),
    type: "string",
    required: false,
    ...overrides,
});

/** 创建模板 */
export const createTemplate = (overrides: Partial<DocTemplate> = {}): DocTemplate => ({
    id: `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: i18n("doctemplate.template.new"),
    content: `<h1>${i18n("doctemplate.template.titlePlaceholder")}</h1>\n<p>${i18n("doctemplate.template.contentPlaceholder")}</p>`,
    variables: [],
    category: "custom",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
});

/** 默认模板内容示例 */
export const SAMPLE_TEMPLATE_CONTENT = `<h1>${i18n("doctemplate.sample.title")}</h1>
<p>${i18n("doctemplate.sample.partyA")}: \${partyA}</p>
<p>${i18n("doctemplate.sample.partyB")}: \${partyB}</p>
<p>${i18n("doctemplate.sample.amount")}: \${amount}</p>
<p>${i18n("doctemplate.sample.date")}: \${signDate}</p>`;

/** 工具栏按钮 */
export const DOC_TOOLBAR_BUTTONS = [
    "headerSelect", "|",
    "bold", "italic", "underline", "through", "|",
    "color", "bgColor", "|",
    "bulletedList", "numberedList", "|",
    "insertLink", "insertImage", "insertTable", "|",
    "insertVariable", "|",
    "undo", "redo",
];

/** 替换变量占位符 */
export const renderTemplateContent = (content: string, values: Record<string, any>): string => {
    return content.replace(/\$\{(\w+)\}/g, (match, varName) => {
        const val = values[varName];
        if (val === undefined || val === null) return match;
        if (typeof val === "string" && val.startsWith("data:")) {
            return `<img src="${val}" style="max-width:100%;"/>`;
        }
        return String(val);
    });
};
