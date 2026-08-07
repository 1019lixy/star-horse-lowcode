/**
 * 报表 HTML 渲染器
 *
 * 职责：将报表模板渲染为 HTML 表格字符串
 * 求值公式 + 应用样式 + 处理合并单元格
 */

import {evalFormula, type FormulaEvalContext} from "../ReportFormulaEngine";
import {toAddress} from "../CellUtils";
import type {ReportCell, ReportRenderContext, ReportTemplate} from "../types";

/** 渲染单元格样式 */
const renderStyle = (cell?: ReportCell): string => {
    if (!cell?.style) return "";
    const s = cell.style;
    const parts: string[] = [];
    if (s.fontFamily) parts.push(`font-family:${s.fontFamily}`);
    if (s.fontSize) parts.push(`font-size:${s.fontSize}pt`);
    if (s.fontWeight) parts.push(`font-weight:${s.fontWeight}`);
    if (s.fontStyle) parts.push(`font-style:${s.fontStyle}`);
    if (s.color) parts.push(`color:${s.color}`);
    if (s.backgroundColor) parts.push(`background-color:${s.backgroundColor}`);
    if (s.textAlign) parts.push(`text-align:${s.textAlign}`);
    if (s.verticalAlign) parts.push(`vertical-align:${s.verticalAlign}`);
    if (s.border && s.border !== "none") {
        const bs = `${s.borderWidth || 1}px solid ${s.borderColor || "#000"}`;
        if (s.border === "all") parts.push(`border:${bs}`);
        else parts.push(`border-${s.border}:${bs}`);
    }
    if (s.borderRadius) parts.push(`border-radius:${s.borderRadius}px`);
    if (s.wrap) parts.push("white-space:normal;word-break:break-all");
    else parts.push("white-space:nowrap;overflow:hidden");
    if (s.indent) parts.push(`padding-left:${s.indent}px`);
    return parts.join(";");
};

/** 格式化值 */
const formatValue = (val: any, format?: string): string => {
    if (val === null || val === undefined) return "";
    if (!format) return String(val);
    if (typeof val === "number") {
        if (format === "currency") return `¥${val.toFixed(2)}`;
        if (format === "percent") return `${(val * 100).toFixed(2)}%`;
        if (format.startsWith("0.")) {
            const decimals = format.length - 2;
            return val.toFixed(decimals);
        }
        if (format.includes(",")) {
            const decimals = format.split(".")[1]?.length || 0;
            return val.toLocaleString("zh-CN", {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            });
        }
    }
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) {
        try {
            const d = new Date(val);
            const pad = (n: number) => String(n).padStart(2, "0");
            return format
                .replace("YYYY", String(d.getFullYear()))
                .replace("MM", pad(d.getMonth() + 1))
                .replace("DD", pad(d.getDate()))
                .replace("HH", pad(d.getHours()))
                .replace("mm", pad(d.getMinutes()))
                .replace("ss", pad(d.getSeconds()));
        } catch {
            return String(val);
        }
    }
    return String(val);
};

/** 求值单元格 */
const evalCell = (cell: ReportCell, ctx: FormulaEvalContext): any => {
    if (!cell.formula) return cell.value ?? "";
    return evalFormula(cell.formula.expression, ctx);
};

/** 渲染报表 HTML */
export const renderReportHtml = (
    template: ReportTemplate,
    renderCtx: ReportRenderContext,
): string => {
    const cellValues = new Map<string, any>();
    const evalCtx: FormulaEvalContext = {
        cellValues,
        cells: template.cells,
        renderCtx,
    };

    // 第一遍：求值所有单元格
    for (let r = 1; r <= template.rowCount; r++) {
        for (let c = 1; c <= template.colCount; c++) {
            const addr = toAddress(r, c);
            const cell = template.cells[addr];
            if (cell) {
                const val = evalCell(cell, evalCtx);
                cellValues.set(addr, val);
            }
        }
    }

    // 第二遍：渲染 HTML
    const rows: string[] = [];
    for (let r = 1; r <= template.rowCount; r++) {
        const row = template.rows[r - 1];
        if (row?.hidden) continue;
        const cells: string[] = [];
        for (let c = 1; c <= template.colCount; c++) {
            const col = template.columns[c - 1];
            if (col?.hidden) continue;
            const addr = toAddress(r, c);
            const cell = template.cells[addr];
            // 跳过被合并的从属单元格
            if (cell && cell.row === r && cell.col === c) {
                const val = cellValues.get(addr);
                const formatted = formatValue(val, cell.style?.format);
                const style = renderStyle(cell);
                const rowSpan = cell.rowSpan > 1 ? ` rowspan="${cell.rowSpan}"` : "";
                const colSpan = cell.colSpan > 1 ? ` colspan="${cell.colSpan}"` : "";
                cells.push(`<td${rowSpan}${colSpan} style="${style}">${escapeHtml(formatted)}</td>`);
            } else if (!cell) {
                cells.push(`<td></td>`);
            }
            // 被合并的从属单元格不渲染
        }
        rows.push(`<tr style="height:${row?.height || template.defaultRowHeight}px">${cells.join("")}</tr>`);
    }

    return `<table class="report-table" border="0" cellspacing="0" cellpadding="2" style="border-collapse:collapse;font-family:'Microsoft YaHei',sans-serif;font-size:11pt;">
        <colgroup>
            ${template.columns.filter((c) => !c.hidden).map((c) => `<col style="width:${c.width}px"/>`).join("")}
        </colgroup>
        ${rows.join("\n")}
    </table>`;
};

/** 渲染完整打印 HTML */
export const renderReportPrintHtml = (
    template: ReportTemplate,
    renderCtx: ReportRenderContext,
): string => {
    const table = renderReportHtml(template, renderCtx);
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<title>${template.name || "Report"}</title>
<style>
@page {
    size: ${template.paper.width}mm ${template.paper.height}mm;
    margin: ${template.paper.margin[0]}mm ${template.paper.margin[1]}mm ${template.paper.margin[2]}mm ${template.paper.margin[3]}mm;
}
body { margin: 0; font-family: 'Microsoft YaHei', sans-serif; }
.report-table { width: 100%; }
.report-table td { border: 1px solid #000; padding: 4px; }
</style>
</head>
<body>
${table}
</body>
</html>`;
};

const escapeHtml = (s: string): string => {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};
