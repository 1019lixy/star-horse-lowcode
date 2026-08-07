/**
 * 文档模板常量定义
 */
import {i18n} from "@/lang";
import type {DocTemplate, DocTemplateCategoryPreset, DocVariable, DocVariableType} from "./types";

/** 分类预设（含对应模板骨架） */
export const DOC_CATEGORY_PRESETS: DocTemplateCategoryPreset[] = [
    {
        value: "contract",
        label: i18n("doctemplate.category.contract"),
        template: `<h1>${i18n("doctemplate.category.contract")}</h1><p>${i18n("doctemplate.sample.partyA")}: \${partyA}</p><p>${i18n("doctemplate.sample.partyB")}: \${partyB}</p><p>${i18n("doctemplate.sample.amount")}: \${amount}</p><p>${i18n("doctemplate.sample.date")}: \${signDate}</p><p>&nbsp;</p><h3>条款</h3><p>一、...</p><p>二、...</p>`,
    },
    {
        value: "proposal",
        label: i18n("doctemplate.category.proposal"),
        template: `<h1>${i18n("doctemplate.category.proposal")}</h1><p>项目名称：\${projectName}</p><p>提交日期：\${submitDate}</p><p>负责人：\${owner}</p><h3>一、项目概述</h3><p>...</p><h3>二、实施方案</h3><p>...</p><h3>三、预算</h3><p>...</p>`,
    },
    {
        value: "report",
        label: i18n("doctemplate.category.report"),
        template: `<h1>${i18n("doctemplate.category.report")}</h1><p>报告人：\${reporter}</p><p>日期：\${reportDate}</p><h3>一、工作进展</h3><p>...</p><h3>二、问题与风险</h3><p>...</p><h3>三、下步计划</h3><p>...</p>`,
    },
    {
        value: "notice",
        label: i18n("doctemplate.category.notice"),
        template: `<h1>${i18n("doctemplate.category.notice")}</h1><p>发布人：\${publisher}</p><p>日期：\${publishDate}</p><p>&nbsp;</p><p>...</p>`,
    },
    {
        value: "letter",
        label: i18n("doctemplate.category.letter"),
        template: `<h1>${i18n("doctemplate.category.letter")}</h1><p>收件人：\${recipient}</p><p>&nbsp;</p><p>尊敬的 \${recipient}：</p><p>&nbsp;</p><p>...</p><p>&nbsp;</p><p>此致</p><p>敬礼</p><p>\${sender}</p><p>\${sendDate}</p>`,
    },
    {value: "custom", label: i18n("doctemplate.category.custom")},
];

/** 变量类型预设 */
export const DOC_VARIABLE_TYPE_PRESETS: { value: DocVariableType; label: string }[] = [
    {value: "string", label: i18n("doctemplate.varType.string")},
    {value: "number", label: i18n("doctemplate.varType.number")},
    {value: "date", label: i18n("doctemplate.varType.date")},
    {value: "boolean", label: i18n("doctemplate.varType.boolean")},
    {value: "select", label: i18n("doctemplate.varType.select")},
    {value: "richtext", label: i18n("doctemplate.varType.richtext")},
    {value: "image", label: i18n("doctemplate.varType.image")},
    {value: "table", label: i18n("doctemplate.varType.table")},
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
