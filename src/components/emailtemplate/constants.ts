/**
 * 邮件模板常量
 */
import {i18n} from "@/lang";
import type {EmailCategoryPreset, EmailTemplate, EmailVariable, EmailVariableType} from "./types";

/** 变量类型预设 */
export const EMAIL_VARIABLE_TYPE_PRESETS: { value: EmailVariableType; label: string }[] = [
    {value: "string", label: i18n("emailtemplate.varType.string")},
    {value: "number", label: i18n("emailtemplate.varType.number")},
    {value: "date", label: i18n("emailtemplate.varType.date")},
    {value: "boolean", label: i18n("emailtemplate.varType.boolean")},
    {value: "select", label: i18n("emailtemplate.varType.select")},
];

/** 分类预设 */
export const EMAIL_CATEGORY_PRESETS: EmailCategoryPreset[] = [
    {value: "notification", label: i18n("emailtemplate.category.notification")},
    {value: "verification", label: i18n("emailtemplate.category.verification")},
    {value: "marketing", label: i18n("emailtemplate.category.marketing")},
    {value: "welcome", label: i18n("emailtemplate.category.welcome")},
    {value: "reset", label: i18n("emailtemplate.category.reset")},
    {value: "custom", label: i18n("emailtemplate.category.custom")},
];

/** 默认模板内容 */
export const DEFAULT_EMAIL_CONTENT = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
<h2 style="color:#409EFF;">${i18n("emailtemplate.template.titlePlaceholder")}</h2>
<p>${i18n("emailtemplate.template.greeting")} \${userName},</p>
<p>\${content}</p>
<hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>
<p style="color:#999;font-size:12px;">${i18n("emailtemplate.template.footer")}</p>
</div>`;

/** 创建变量 */
export const createEmailVariable = (overrides: Partial<EmailVariable> = {}): EmailVariable => ({
    id: `var_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: `var${Math.floor(Math.random() * 1000)}`,
    label: i18n("emailtemplate.variable.newVar"),
    ...overrides,
});

/** 创建模板 */
export const createEmailTemplate = (overrides: Partial<EmailTemplate> = {}): EmailTemplate => ({
    id: `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: i18n("emailtemplate.template.new"),
    subject: i18n("emailtemplate.template.subjectPlaceholder"),
    content: DEFAULT_EMAIL_CONTENT,
    textContent: "",
    variables: [],
    attachments: [],
    category: "custom",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
});

/** 工具栏按钮 */
export const EMAIL_TOOLBAR_BUTTONS = [
    "headerSelect", "|",
    "bold", "italic", "underline", "|",
    "color", "bgColor", "|",
    "bulletedList", "numberedList", "|",
    "insertLink", "insertImage", "|",
    "undo", "redo",
];

/** 替换变量 */
export const renderEmailContent = (content: string, values: Record<string, any>): string => {
    return content.replace(/\$\{(\w+)\}/g, (match, varName) => {
        const val = values[varName];
        return val === undefined || val === null ? match : String(val);
    });
};
