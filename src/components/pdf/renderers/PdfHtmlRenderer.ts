/**
 * PDF HTML 渲染器
 * 单一职责：把模板渲染为 HTML 字符串，供打印或导出
 */
import { MM_TO_PX } from "../constants";
import type { PdfElement, PdfTemplate } from "../types";

/** 单元素样式生成 */
const buildElementStyle = (el: PdfElement): string => {
    const px = (mm: number) => `${mm * MM_TO_PX}px`;
    const style: string[] = [
        `position:absolute`,
        `left:${px(el.x)}`,
        `top:${px(el.y)}`,
        `width:${px(el.width)}`,
        `height:${px(el.height)}`,
        `transform:rotate(${el.rotation || 0}deg)`,
        `z-index:${el.zIndex ?? 0}`,
        `overflow:hidden`,
    ];
    return style.join(";");
};

/** 渲染文本类元素 */
const renderTextElement = (el: any): string => {
    const font = el.font || {};
    const style = [
        `font-family:${font.family || "Microsoft YaHei"}`,
        `font-size:${font.size || 12}px`,
        `font-weight:${font.weight || "normal"}`,
        `font-style:${font.style || "normal"}`,
        `color:${font.color || "#000000"}`,
        `text-align:${el.align || "left"}`,
        `line-height:1.5`,
        `white-space:pre-wrap`,
        `word-break:break-all`,
    ].join(";");
    return `<div style="${buildElementStyle(el)};${style}">${escapeHtml(el.text || "")}</div>`;
};

/** 渲染图片元素 */
const renderImageElement = (el: any): string => {
    if (!el.src) {
        return `<div style="${buildElementStyle(el)};border:1px dashed #ccc;display:flex;align-items:center;justify-content:center;color:#999;font-size:11px;">[${el.type === "signature" ? "Signature" : "Image"}]</div>`;
    }
    return `<div style="${buildElementStyle(el)};"><img src="${el.src}" style="width:100%;height:100%;object-fit:${el.fit || "contain"}"/></div>`;
};

/** 渲染表格元素 */
const renderTableElement = (el: any): string => {
    const cols = el.columns || [];
    const headStyle = `background:${el.headerBgColor || "#F5F7FA"};border:1px solid ${el.borderColor || "#DCDFE6"};padding:4px;font-weight:600;text-align:center;font-size:12px;`;
    const cellStyle = `border:1px solid ${el.borderColor || "#DCDFE6"};padding:4px;font-size:12px;`;
    const head = `<tr>${cols.map((c: any) => `<th style="${headStyle};width:${c.width * MM_TO_PX}px;text-align:${c.align}">${escapeHtml(c.label)}</th>`).join("")}</tr>`;
    const sampleRow = `<tr>${cols.map((c: any) => `<td style="${cellStyle};text-align:${c.align}">&nbsp;</td>`).join("")}</tr>`;
    return `<div style="${buildElementStyle(el)};"><table style="border-collapse:collapse;width:100%;"><thead>${head}</thead><tbody>${sampleRow}</tbody></table></div>`;
};

/** 渲染分割线 */
const renderDividerElement = (el: any): string => {
    const style = `border-top:${el.thickness || 1}px ${el.style || "solid"} ${el.color || "#000000"}`;
    return `<div style="${buildElementStyle(el)};${style}"></div>`;
};

/** 渲染分页符 */
const renderPageBreak = (el: PdfElement): string => {
    return `<div style="${buildElementStyle(el)};border:1px dashed #999;background:#F5F7FA;display:flex;align-items:center;justify-content:center;font-size:11px;color:#999;">PAGE BREAK</div>`;
};

/** 渲染条码（占位） */
const renderBarcode = (el: any): string => {
    return `<div style="${buildElementStyle(el)};background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Courier New';font-size:14px;letter-spacing:2px;">${escapeHtml(el.value || "")}</div>`;
};

/** 渲染二维码（占位，使用 SVG 简单图案） */
const renderQrcode = (el: any): string => {
    const size = Math.min(el.width, el.height) * MM_TO_PX;
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="100" height="100" fill="#FFFFFF"/>`;
    // 简化的 QR 占位图案
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 12; j++) {
            if ((i * 7 + j * 13 + (el.value || "").length) % 3 === 0) {
                svg += `<rect x="${i * 8 + 2}" y="${j * 8 + 2}" width="7" height="7" fill="#000000"/>`;
            }
        }
    }
    svg += `</svg>`;
    return `<div style="${buildElementStyle(el)};display:flex;align-items:center;justify-content:center;">${svg}</div>`;
};

/** 渲染复选框 */
const renderCheckbox = (el: any): string => {
    const checked = el.checked ? "✓" : "";
    return `<div style="${buildElementStyle(el)};display:flex;align-items:center;gap:6px;font-size:${el.font?.size || 12}px;">
        <div style="width:14px;height:14px;border:1px solid #333;display:flex;align-items:center;justify-content:center;">${checked}</div>
        ${el.label ? `<span>${escapeHtml(el.label)}</span>` : ""}
    </div>`;
};

/** HTML 转义 */
const escapeHtml = (text: string): string => {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

/** 渲染单个元素 */
export const renderElement = (el: PdfElement): string => {
    switch (el.type) {
        case "text":
        case "heading":
        case "paragraph":
        case "date":
            return renderTextElement(el);
        case "image":
        case "signature":
            return renderImageElement(el);
        case "table":
            return renderTableElement(el);
        case "divider":
            return renderDividerElement(el);
        case "pageBreak":
            return renderPageBreak(el);
        case "barcode":
            return renderBarcode(el);
        case "qrcode":
            return renderQrcode(el);
        case "checkbox":
            return renderCheckbox(el);
        default:
            return "";
    }
};

/** 渲染整个模板为 HTML */
export const renderTemplateToHtml = (template: PdfTemplate, data?: Record<string, any>): string => {
    const page = template.page;
    const pageWidthPx = page.width * MM_TO_PX;
    const pageHeightPx = page.height * MM_TO_PX;

    // 渲染元素，替换数据占位符
    const elementsHtml = template.elements
        .map((el) => {
            // 简单数据绑定替换
            const replaced: any = { ...el };
            if (data && (el as any).dataField) {
                const val = data[(el as any).dataField];
                if (val !== undefined) {
                    if ((el as any).text !== undefined) {
                        replaced.text = String(val);
                    }
                    if ((el as any).src !== undefined && typeof val === "string" && val.startsWith("data:")) {
                        replaced.src = val;
                    }
                }
            } else if (data && (el as any).text) {
                // 模板字符串替换 ${field}
                replaced.text = String((el as any).text).replace(/\$\{(\w+)\}/g, (_, k) => String(data[k] ?? ""));
            }
            return renderElement(replaced);
        })
        .join("");

    // 页眉
    const headerHtml = page.header
        ? `<div style="position:absolute;top:${page.marginTop * MM_TO_PX * 0.3}px;left:${page.marginLeft * MM_TO_PX}px;right:${page.marginRight * MM_TO_PX}px;text-align:${page.header.align};font-size:10px;color:#666;">${escapeHtml(page.header.text)}</div>`
        : "";

    // 页脚
    const footerHtml = page.footer
        ? `<div style="position:absolute;bottom:${page.marginBottom * MM_TO_PX * 0.3}px;left:${page.marginLeft * MM_TO_PX}px;right:${page.marginRight * MM_TO_PX}px;text-align:${page.footer.align};font-size:10px;color:#666;">${escapeHtml(page.footer.text)}</div>`
        : "";

    return `<div class="pdf-page" style="position:relative;width:${pageWidthPx}px;height:${pageHeightPx}px;background:${page.background || "#FFFFFF"};box-sizing:border-box;">
        ${headerHtml}
        ${elementsHtml}
        ${footerHtml}
    </div>`;
};

/** 渲染为可打印 HTML（含样式） */
export const renderPrintableHtml = (template: PdfTemplate, data?: Record<string, any>): string => {
    const content = renderTemplateToHtml(template, data);
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>${escapeHtml(template.name)}</title>
<style>
@page { size: ${template.page.width}mm ${template.page.height}mm; margin: 0; }
body { margin: 0; padding: 0; }
.pdf-page { page-break-after: always; }
.pdf-page:last-child { page-break-after: auto; }
@media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>
</head>
<body>${content}</body>
</html>`;
};
