/**
 * wangEditor 变量插入工具
 *
 * 不依赖 wangEditor 的 Boot.registerMenu（时序难以保证），
 * 改为在外部 el-dropdown 中调用 insertVariableBadge 直接插入。
 *
 * Shared between DocumentTemplateDesigner and EmailTemplateDesigner.
 */
import type { IDomEditor } from "@wangeditor/editor";
import { i18n } from "@/lang";

/** SVG icon for the variable dropdown button */
export const VARIABLE_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>`;

/**
 * Insert a variable badge into the editor as a styled inline element.
 * Uses wangEditor's dangerouslyInsertHtml to render a visually distinct badge.
 */
export function insertVariableBadge(editor: IDomEditor, varName: string) {
    if (!editor || editor.isDisabled()) return;
    editor.restoreSelection();
    // Insert as a non-editable span badge. The data-var attribute stores the variable name
    // for later extraction. contenteditable="false" prevents accidental edits.
    const html = `<span class="tpl-variable-badge" contenteditable="false" data-var="${varName}">\${${varName}}</span>`;
    editor.dangerouslyInsertHtml(html);
}

/**
 * Extract all variable names from editor content (for validation/preview).
 */
export function extractVariablesFromHtml(html: string): string[] {
    const set = new Set<string>();
    // Match data-var="xxx"
    const re1 = /data-var="([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = re1.exec(html)) !== null) set.add(m[1]);
    // Match ${xxx} plain text (backward compatibility)
    const re2 = /\$\{(\w+)\}/g;
    while ((m = re2.exec(html)) !== null) set.add(m[1]);
    return [...set];
}

/**
 * CSS styles for the variable badge inside wangEditor content.
 * These should be injected into the editor's container via :deep() selector.
 */
export const VARIABLE_BADGE_STYLES = `
.tpl-variable-badge {
    display: inline-block;
    background: #ecf5ff;
    color: #409eff;
    border: 1px solid #d9ecff;
    border-radius: 4px;
    padding: 0 6px;
    margin: 0 2px;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.9em;
    line-height: 1.6;
    vertical-align: baseline;
    cursor: default;
    user-select: none;
    white-space: nowrap;
}
.tpl-variable-badge:hover {
    background: #d9ecff;
    border-color: #b3d8ff;
}
`;
