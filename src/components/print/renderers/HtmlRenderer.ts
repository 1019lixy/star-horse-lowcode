/**
 * HTML 渲染器
 *
 * 职责：将 PrintElement[] 渲染为 HTML 字符串 / 浏览器打印
 * 不依赖任何运行时框架，纯字符串拼接，便于服务端渲染
 */

import { MM_TO_PX } from "../constants";
import type {
    PrintElement,
    PrintPaper,
    PrintRenderContext,
    PrintTemplate,
} from "../types";

/** 求值数据绑定值 */
const evalBinding = (
    el: PrintElement,
    ctx: PrintRenderContext,
): string => {
    const b = el.dataBinding;
    if (!b) return "";
    let val: any = "";
    switch (b.source) {
        case "static":
            val = b.staticValue ?? "";
            break;
        case "field": {
            const parts = (b.fieldName || "").split(".");
            val = ctx.data;
            for (const p of parts) {
                val = val?.[p];
            }
            break;
        }
        case "system":
            val = evalSystemVar(b.systemVar || "", ctx, el);
            break;
        case "formula":
            // 公式交由 FormulaEngine 处理，这里仅占位（运行时注入）
            val = "";
            break;
    }
    if (val === null || val === undefined || val === "") {
        return b.emptyText ?? "";
    }
    return b.format ? formatValue(val, b.format) : String(val);
};

/** 求值系统变量 */
const evalSystemVar = (
    varName: string,
    ctx: PrintRenderContext,
    el: PrintElement,
): string => {
    const now = new Date(ctx.renderTime);
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    switch (varName) {
        case "currentDate":
            return dateStr;
        case "currentTime":
            return timeStr;
        case "currentDateTime":
            return `${dateStr} ${timeStr}`;
        case "pageNumber":
            return String(ctx.pageNumber);
        case "pageCount":
            return String(ctx.pageCount);
        case "operator":
            return ctx.operator;
        case "printerName":
            return ctx.printerName;
        case "templateName":
            return el.name;
        case "tenantName":
            return ctx.tenantName;
        default:
            return "";
    }
};

/** 格式化值 */
const formatValue = (val: any, format: string): string => {
    if (val instanceof Date || (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val))) {
        try {
            const d = val instanceof Date ? val : new Date(val);
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
    if (typeof val === "number") {
        if (format.includes(",")) {
            const parts = format.split(".");
            const decimals = parts[1]?.length || 0;
            return val.toLocaleString("zh-CN", {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            });
        }
        if (format.startsWith("0.")) {
            const decimals = format.length - 2;
            return val.toFixed(decimals);
        }
    }
    return String(val);
};

/** 转义 HTML */
const escapeHtml = (s: string): string => {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

/** mm 转 px */
const mmToPx = (mm: number): number => mm * MM_TO_PX;

/** 渲染元素样式 */
const renderStyle = (el: PrintElement): string => {
    const s = el.style || {};
    const parts: string[] = [];
    if (s.fontFamily) parts.push(`font-family:${s.fontFamily}`);
    if (s.fontSize) parts.push(`font-size:${s.fontSize}pt`);
    if (s.fontWeight) parts.push(`font-weight:${s.fontWeight}`);
    if (s.color) parts.push(`color:${s.color}`);
    if (s.backgroundColor) parts.push(`background-color:${s.backgroundColor}`);
    if (s.textAlign) parts.push(`text-align:${s.textAlign}`);
    if (s.verticalAlign) parts.push(`vertical-align:${s.verticalAlign}`);
    if (s.lineHeight) parts.push(`line-height:${s.lineHeight}`);
    if (s.letterSpacing) parts.push(`letter-spacing:${s.letterSpacing}px`);
    if (s.italic) parts.push("font-style:italic");
    if (s.underline) parts.push("text-decoration:underline");
    if (s.lineThrough) parts.push("text-decoration:line-through");
    if (s.border) parts.push(`border:${s.border}`);
    if (s.borderRadius) parts.push(`border-radius:${s.borderRadius}px`);
    if (s.padding !== undefined) {
        if (Array.isArray(s.padding)) {
            parts.push(`padding:${s.padding.map((p) => p + "px").join(" ")}`);
        } else {
            parts.push(`padding:${s.padding}px`);
        }
    }
    return parts.join(";");
};

/** 渲染单个元素 */
const renderElement = (el: PrintElement, ctx: PrintRenderContext): string => {
    if (el.visible === false) return "";
    const left = mmToPx(el.x || 0);
    const top = mmToPx(el.y || 0);
    const width = mmToPx(el.width || 0);
    const height = mmToPx(el.height || 0);
    const rotation = el.rotation || 0;
    const opacity = el.opacity ?? 1;
    const baseStyle = `position:absolute;left:${left}px;top:${top}px;width:${width}px;height:${height}px;opacity:${opacity};${rotation ? `transform:rotate(${rotation}deg);` : ""}`;
    const customStyle = renderStyle(el);

    switch (el.type) {
        case "text": {
            const text = escapeHtml(evalBinding(el, ctx));
            return `<div style="${baseStyle};${customStyle};display:flex;align-items:${el.style?.verticalAlign === "top" ? "flex-start" : el.style?.verticalAlign === "bottom" ? "flex-end" : "center"};${el.style?.wordWrap === false ? "white-space:nowrap;overflow:hidden;" : "word-break:break-all;"}">${text}</div>`;
        }
        case "datetime": {
            const dt: any = el;
            const val = evalSystemVar(dt.dataBinding?.systemVar || "currentDateTime", ctx, el);
            const formatted = dt.dateFormat ? formatValue(val, dt.dateFormat) : val;
            return `<div style="${baseStyle};${customStyle};display:flex;align-items:center;">${escapeHtml(formatted)}</div>`;
        }
        case "counter": {
            const c: any = el;
            let val = c.startValue + (ctx.pageNumber - 1) * c.step;
            if (c.resetPerPage) val = ctx.pageNumber;
            return `<div style="${baseStyle};${customStyle};display:flex;align-items:center;justify-content:center;">${val}</div>`;
        }
        case "barcode": {
            const b: any = el;
            const val = escapeHtml(evalBinding(el, ctx));
            return `<div style="${baseStyle};${customStyle};display:flex;flex-direction:column;align-items:center;justify-content:center;">
                <div style="font-family:'Libre Barcode 39',monospace;font-size:${b.barHeight}px;letter-spacing:${b.moduleWidth}px;color:${b.barColor};background:${b.bgColor};">${val}</div>
                ${b.displayText ? `<div style="font-size:10pt;text-align:center;">${val}</div>` : ""}
            </div>`;
        }
        case "qrcode": {
            const val = escapeHtml(evalBinding(el, ctx));
            const q: any = el;
            return `<div style="${baseStyle};display:flex;align-items:center;justify-content:center;background:${q.bgColor};">
                <img alt="QR" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'/>" style="width:100%;height:100%;" data-qrcode="${val}" data-ec="${q.errorCorrectionLevel}" data-color="${q.color}" />
            </div>`;
        }
        case "image": {
            const im: any = el;
            if (!im.src) {
                return `<div style="${baseStyle};border:1px dashed #ccc;display:flex;align-items:center;justify-content:center;color:#999;font-size:10pt;">[${el.name}]</div>`;
            }
            const fitMap: Record<string, string> = {
                fill: "width:100%;height:100%;",
                contain: "max-width:100%;max-height:100%;object-fit:contain;",
                cover: "width:100%;height:100%;object-fit:cover;",
                none: "",
            };
            return `<div style="${baseStyle};display:flex;align-items:center;justify-content:center;overflow:hidden;"><img src="${im.src}" style="${fitMap[im.fitMode] || ""}"/></div>`;
        }
        case "line": {
            const l: any = el;
            const dashMap: Record<string, string> = {
                solid: "solid",
                dashed: "dashed",
                dotted: "dotted",
            };
            return `<div style="${baseStyle};border-top:${l.strokeWidth}px ${dashMap[l.lineStyle] || "solid"} ${l.color};"></div>`;
        }
        case "rect": {
            const r: any = el;
            return `<div style="${baseStyle};border:${r.strokeWidth}px solid ${r.strokeColor};background-color:${r.fillColor === "transparent" ? "transparent" : r.fillColor};border-radius:${r.radius || 0}px;"></div>`;
        }
        case "ellipse": {
            const e: any = el;
            return `<div style="${baseStyle};border:${e.strokeWidth}px solid ${e.strokeColor};background-color:${e.fillColor === "transparent" ? "transparent" : e.fillColor};border-radius:50%;"></div>`;
        }
        case "table": {
            const t: any = el;
            const rows = (ctx.data[t.dataField] as any[]) || [];
            const headerBg = t.headerBgColor || "#F5F5F5";
            const border = t.showBorder ? "border:1px solid #000;" : "";
            const rowHeightPx = mmToPx(t.rowHeight);
            let html = `<div style="${baseStyle};${customStyle};overflow:hidden;${border}">`;
            if (t.showHeader) {
                html += `<div style="display:flex;background:${headerBg};border-bottom:1px solid #000;height:${rowHeightPx}px;">`;
                for (const col of t.columns) {
                    html += `<div style="width:${mmToPx(col.width)}px;padding:0 4px;display:flex;align-items:center;justify-content:${col.align === "right" ? "flex-end" : col.align === "center" ? "center" : "flex-start"};font-weight:bold;${t.showBorder ? "border-right:1px solid #000;" : ""}">${escapeHtml(col.title)}</div>`;
                }
                html += `</div>`;
            }
            for (const row of rows) {
                html += `<div style="display:flex;height:${rowHeightPx}px;${t.showBorder ? "border-bottom:1px solid #ccc;" : ""}">`;
                for (const col of t.columns) {
                    const cellVal = col.format ? formatValue(row[col.field], col.format) : String(row[col.field] ?? "");
                    html += `<div style="width:${mmToPx(col.width)}px;padding:0 4px;display:flex;align-items:center;justify-content:${col.align === "right" ? "flex-end" : col.align === "center" ? "center" : "flex-start"};${t.showBorder ? "border-right:1px solid #ccc;" : ""}">${escapeHtml(cellVal)}</div>`;
                }
                html += `</div>`;
            }
            // 合计行
            const summaryCols = t.columns.filter((c: any) => c.summary);
            if (summaryCols.length) {
                html += `<div style="display:flex;height:${rowHeightPx}px;background:${headerBg};border-top:1px solid #000;">`;
                for (const col of t.columns) {
                    let cellVal = "";
                    if (col.summary) {
                        const nums = rows.map((r) => Number(r[col.field] || 0));
                        switch (col.summaryType) {
                            case "sum":
                                cellVal = nums.reduce((a, b) => a + b, 0).toFixed(2);
                                break;
                            case "avg":
                                cellVal = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2) : "0";
                                break;
                            case "count":
                                cellVal = String(nums.length);
                                break;
                            case "max":
                                cellVal = nums.length ? Math.max(...nums).toFixed(2) : "0";
                                break;
                            case "min":
                                cellVal = nums.length ? Math.min(...nums).toFixed(2) : "0";
                                break;
                        }
                    }
                    html += `<div style="width:${mmToPx(col.width)}px;padding:0 4px;display:flex;align-items:center;justify-content:${col.align === "right" ? "flex-end" : col.align === "center" ? "center" : "flex-start"};font-weight:bold;">${escapeHtml(cellVal)}</div>`;
                }
                html += `</div>`;
            }
            html += `</div>`;
            return html;
        }
        default:
            return "";
    }
};

/** 渲染整页 HTML */
export const renderPageHtml = (
    template: PrintTemplate,
    ctx: PrintRenderContext,
): string => {
    const { paper } = template;
    const pageWidthPx = mmToPx(paper.width);
    const pageHeightPx = mmToPx(paper.height);
    const [mt, mr, mb, ml] = paper.margin;
    const marginTopPx = mmToPx(mt);
    const marginRightPx = mmToPx(mr);
    const marginBottomPx = mmToPx(mb);
    const marginLeftPx = mmToPx(ml);

    const elementsHtml = template.elements
        .map((el) => renderElement(el, ctx))
        .join("\n");

    return `<div class="print-page" style="
        position:relative;
        width:${pageWidthPx}px;
        height:${pageHeightPx}px;
        margin:0 auto;
        background:#FFFFFF;
        box-shadow:0 0 10px rgba(0,0,0,0.1);
        padding:${marginTopPx}px ${marginRightPx}px ${marginBottomPx}px ${marginLeftPx}px;
        box-sizing:border-box;
        overflow:hidden;
    ">
        <div style="position:relative;width:100%;height:100%;">
            ${elementsHtml}
        </div>
    </div>`;
};

/** 渲染完整打印 HTML（包含 @page 规则） */
export const renderPrintHtml = (
    template: PrintTemplate,
    ctx: PrintRenderContext,
): string => {
    const { paper } = template;
    const orientation = paper.orientation === "landscape" ? "landscape" : "portrait";
    const pageCtx: PrintRenderContext = { ...ctx, pageCount: ctx.pageCount || 1 };
    const pages: string[] = [];
    for (let i = 1; i <= pageCtx.pageCount; i++) {
        pages.push(renderPageHtml(template, { ...pageCtx, pageNumber: i }));
    }
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<title>${template.name || "Print"}</title>
<style>
@page {
    size: ${paper.width}mm ${paper.height}mm;
    margin: 0;
}
@media print {
    body { margin: 0; }
    .print-page { box-shadow: none; page-break-after: always; }
    .print-page:last-child { page-break-after: auto; }
}
body {
    margin: 0;
    padding: 20px;
    background: #EEEEEE;
    font-family: 'Microsoft YaHei', sans-serif;
}
.print-page {
    margin-bottom: 20px;
}
</style>
</head>
<body>
${pages.join("\n")}
</body>
</html>`;
};
