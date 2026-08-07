/**
 * TSPL 渲染器（TSC Printer Programming Language）
 *
 * 职责：将 PrintElement[] 渲染为 TSPL/TSPL2 指令字符串
 * 适用于 TSC / TTP 系列标签打印机
 *
 * 关键命令：
 *   SIZE 标签尺寸
 *   GAP 标签间距
 *   CLS 清空缓冲区
 *   TEXT 文本
 *   BARCODE 条码
 *   QRCODE 二维码
 *   BAR 直线
 *   BOX 矩形
 *   CIRCLE 圆
 *   PRINT 打印
 */

import type {PrintElement, PrintRenderContext, PrintTemplate,} from "../types";

/** TSPL 默认单位为 dot，203 DPI */
const DPI = 203;
const DOTS_PER_MM = DPI / 25.4;

const mmToDot = (mm: number): number => Math.round(mm * DOTS_PER_MM);

/** 字号 pt → dot */
const ptToDot = (pt: number = 12): number => Math.max(1, Math.round(pt * DOTS_PER_MM / 72 * 2));

/** 求值绑定值 */
const evalBinding = (el: PrintElement, ctx: PrintRenderContext): string => {
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
            for (const p of parts) val = val?.[p];
            break;
        }
        case "system":
            val = evalSystemVar(b.systemVar || "", ctx);
            break;
        case "formula":
            val = "";
            break;
    }
    if (val === null || val === undefined || val === "") return b.emptyText ?? "";
    return String(val);
};

const evalSystemVar = (varName: string, ctx: PrintRenderContext): string => {
    const now = new Date(ctx.renderTime);
    const pad = (n: number) => String(n).padStart(2, "0");
    switch (varName) {
        case "currentDate":
            return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        case "currentTime":
            return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        case "currentDateTime":
            return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
        case "pageNumber":
            return String(ctx.pageNumber);
        case "pageCount":
            return String(ctx.pageCount);
        case "operator":
            return ctx.operator;
        case "tenantName":
            return ctx.tenantName;
        default:
            return "";
    }
};

/** 渲染单个元素 */
const renderElement = (el: PrintElement, ctx: PrintRenderContext): string => {
    if (el.visible === false) return "";
    const x = mmToDot(el.x || 0);
    const y = mmToDot(el.y || 0);
    const w = mmToDot(el.width || 0);
    const h = mmToDot(el.height || 0);
    const style = el.style || {};
    const fontHeight = ptToDot(style.fontSize);
    const fontWidth = Math.max(1, Math.round(fontHeight * 0.6));

    switch (el.type) {
        case "text": {
            const val = evalBinding(el, ctx);
            // TEXT x,y,"font",fontHeight,fontWidth,"content"
            // 字体 1 = Scalable font (TSPL2)
            return `TEXT ${x},${y},"1",0,${fontHeight},${fontWidth},"${val}"`;
        }
        case "datetime":
        case "counter": {
            const val = evalBinding(el, ctx);
            return `TEXT ${x},${y},"1",0,${fontHeight},${fontWidth},"${val}"`;
        }
        case "barcode": {
            const b: any = el;
            const val = evalBinding(el, ctx);
            const barHeight = mmToDot(b.height || 30);
            const moduleWidth = b.moduleWidth || 2;
            // BARCODE x,y,"symbology",height,humanReadable,rotation,narrow,wide,"content"
            const symMap: Record<string, string> = {
                CODE128: "128",
                CODE39: "39",
                EAN13: "EAN13",
                EAN8: "EAN8",
                UPC_A: "UPCA",
                UPC_E: "UPCE",
                ITF14: "ITF14",
                MSI: "MSI",
            };
            const sym = symMap[b.symbology] || "128";
            const hr = b.displayText ? 1 : 0;
            return `BARCODE ${x},${y},"${sym}",${barHeight},${hr},0,${moduleWidth},${moduleWidth * 2},"${val}"`;
        }
        case "qrcode": {
            const val = evalBinding(el, ctx);
            const q: any = el;
            const cellWidth = Math.max(1, Math.round(mmToDot(el.width || 40) / 25));
            // QRCODE x,y,ECC,cellWidth,rotation,"content"
            return `QRCODE ${x},${y},"${q.errorCorrectionLevel || "M"}",${cellWidth},0,"${val}"`;
        }
        case "image": {
            // TSPL 图像需 BITMAP 指令，这里占位
            return `BOX ${x},${y},${w},${h},2`;
        }
        case "line": {
            const l: any = el;
            const thickness = Math.max(1, Math.round(l.strokeWidth));
            // BAR x,y,width,thickness
            return `BAR ${x},${y},${w},${thickness}`;
        }
        case "rect": {
            const r: any = el;
            const t = Math.max(1, Math.round(r.strokeWidth));
            // BOX x,y,width,height,thickness,radius
            return `BOX ${x},${y},${w},${h},${t},${r.radius || 0}`;
        }
        case "ellipse": {
            const e: any = el;
            const t = Math.max(1, Math.round(e.strokeWidth));
            // ELLIPSE x,y,width,height,thickness
            return `ELLIPSE ${x},${y},${w},${h},${t}`;
        }
        case "table": {
            const t: any = el;
            const rows = (ctx.data[t.dataField] as any[]) || [];
            const rowHeightDot = mmToDot(t.rowHeight || 5);
            const parts: string[] = [];
            let yOffset = 0;
            if (t.showHeader) {
                let xOffset = 0;
                for (const col of t.columns) {
                    parts.push(`TEXT ${x + xOffset},${y + yOffset},"1",0,${fontHeight},${fontWidth},"${col.title}"`);
                    xOffset += mmToDot(col.width);
                }
                yOffset += rowHeightDot;
            }
            for (const row of rows) {
                let xOffset = 0;
                for (const col of t.columns) {
                    parts.push(`TEXT ${x + xOffset},${y + yOffset},"1",0,${fontHeight},${fontWidth},"${row[col.field] ?? ""}"`);
                    xOffset += mmToDot(col.width);
                }
                yOffset += rowHeightDot;
            }
            return parts.join("\n");
        }
        default:
            return "";
    }
};

/** 渲染整页 TSPL */
export const renderTspl = (template: PrintTemplate, ctx: PrintRenderContext): string => {
    const {paper} = template;
    const widthMm = paper.width;
    const heightMm = paper.height;

    const parts: string[] = [];
    parts.push(`SIZE ${widthMm} mm,${heightMm} mm`);
    parts.push("GAP 2 mm,0 mm");
    parts.push("DIRECTION 1,0");
    parts.push("CLS");

    for (const el of template.elements) {
        const tspl = renderElement(el, ctx);
        if (tspl) parts.push(tspl);
    }

    parts.push(`PRINT ${ctx.pageCount || 1},${ctx.pageCount || 1}`);
    return parts.join("\n");
};
