/**
 * ZPL 渲染器（Zebra Programming Language）
 *
 * 职责：将 PrintElement[] 渲染为 ZPL II 指令字符串
 * 适用于 Zebra / Honeywell / TSC 等支持 ZPL 的打印机
 *
 * 参考文档：Zebra ZPL Programming Guide Volume 2
 * 关键命令：
 *   ^XA 开始 / ^XZ 结束
 *   ^LH 设置标签原点偏移
 *   ^PW 设置打印宽度
 *   ^FO 字段原点（X,Y）
 *   ^FD 字段数据 / ^FS 字段结束
 *   ^A 字体 ^CF 默认字体
 *   ^BY 条码默认参数
 *   ^BC CODE128 ^BQ 二维码
 */

import type { PrintElement, PrintRenderContext, PrintTemplate } from "../types";

/** DOT 转换：ZPL 默认 8 dots/mm (203 DPI)，部分机型 12 (300DPI) / 24 (600DPI) */
const DPI = 203;
const DOTS_PER_MM = DPI / 25.4;

/** mm 转 dot */
const mmToDot = (mm: number): number => Math.round(mm * DOTS_PER_MM);

/** 字号映射（pt → ZPL 字母字号） */
const fontSizeToZpl = (
  pt: number = 12,
): { font: string; height: number; width: number } => {
  // ZPL 内置字体 0-9，A=字体 0，常用 0/1/A-E
  // 简化：pt ≤ 8 → 字体 A，高度 = pt * 1.5；其余按比例
  const dot = Math.max(1, Math.round(((pt * DOTS_PER_MM) / 72) * 2));
  if (pt <= 8) return { font: "A", height: dot, width: Math.round(dot * 0.6) };
  if (pt <= 12) return { font: "B", height: dot, width: Math.round(dot * 0.6) };
  if (pt <= 16) return { font: "C", height: dot, width: Math.round(dot * 0.7) };
  if (pt <= 24) return { font: "D", height: dot, width: Math.round(dot * 0.8) };
  return { font: "E", height: dot, width: Math.round(dot * 0.9) };
};

/** 对齐映射 */
const alignToZpl = (align?: string): string => {
  // ^FB 块格式化对齐：0=左 1=居中 2=右 3=两端
  switch (align) {
    case "center":
      return "1";
    case "right":
      return "2";
    default:
      return "0";
  }
};

/** 求值绑定值（与 HtmlRenderer 相同逻辑，独立实现避免循环依赖） */
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

/** 转义 ZPL 特殊字符（^, ~, \） */
const escapeZpl = (s: string): string => {
  return String(s)
    .replace(/\^/g, "\\^")
    .replace(/~/g, "\\~")
    .replace(/\\/g, "\\\\");
};

/** 渲染单个元素为 ZPL 指令 */
const renderElement = (el: PrintElement, ctx: PrintRenderContext): string => {
  if (el.visible === false) return "";
  const x = mmToDot(el.x || 0);
  const y = mmToDot(el.y || 0);
  const style = el.style || {};
  const fontSpec = fontSizeToZpl(style.fontSize);
  const align = alignToZpl(style.textAlign);

  switch (el.type) {
    case "text": {
      const val = escapeZpl(evalBinding(el, ctx));
      const widthDot = mmToDot(el.width || 0);
      // 多行文本使用 ^FB（块格式化）
      return `^FO${x},${y}^A${fontSpec.font}N,${fontSpec.height},${fontSpec.width}^FB${widthDot},999,0,${align},0^FD${val}^FS`;
    }
    case "datetime": {
      const dt: any = el;
      const sysVar = dt.dataBinding?.systemVar || "currentDateTime";
      const val = escapeZpl(evalSystemVar(sysVar, ctx));
      return `^FO${x},${y}^A${fontSpec.font}N,${fontSpec.height},${fontSpec.width}^FD${val}^FS`;
    }
    case "counter": {
      const c: any = el;
      let val = c.startValue + (ctx.pageNumber - 1) * c.step;
      if (c.resetPerPage) val = ctx.pageNumber;
      return `^FO${x},${y}^A${fontSpec.font}N,${fontSpec.height},${fontSpec.width}^FB${mmToDot(el.width)},999,0,${align},0^FD${val}^FS`;
    }
    case "barcode": {
      const b: any = el;
      const val = escapeZpl(evalBinding(el, ctx));
      const heightDot = mmToDot(b.height || 30);
      // ^BY 模块宽度,宽窄比,高度
      const moduleWidth = b.moduleWidth || 2;
      const cmd =
        b.symbology === "CODE39"
          ? "B3"
          : b.symbology === "EAN13"
            ? "B2"
            : "BCN";
      const textMode = b.displayText ? "Y" : "N";
      return `^BY${moduleWidth},2,${heightDot}^FO${x},${y}^${cmd},${heightDot},${textMode}^FD${val}^FS`;
    }
    case "qrcode": {
      const val = escapeZpl(evalBinding(el, ctx));
      const q: any = el;
      // ^BQ 方向,模型,放大倍数,纠错,掩码
      const ecMap: Record<string, string> = { L: "L", M: "M", Q: "Q", H: "H" };
      const ec = ecMap[q.errorCorrectionLevel || "M"];
      const size = Math.max(1, Math.round(mmToDot(el.width || 40) / 10));
      // QR 模型 = 2 (标准 QR)
      return `^FO${x},${y}^BQN,2,${size},${ec},^FDMA,${val}^FS`;
    }
    case "image": {
      // ZPL 图像需要 ^GF（图形字段）二进制数据，这里仅占位
      // 真实场景由 Tauri 端将 base64 转 ZPL 图像指令
      return `^FO${x},${y}^GB${mmToDot(el.width || 0)},${mmToDot(el.height || 0)},2,B^FS`;
    }
    case "line": {
      const l: any = el;
      const widthDot = mmToDot(el.width || 0);
      const thickness = Math.max(1, Math.round(l.strokeWidth));
      // ^GB 图形框（用作直线）
      return `^FO${x},${y}^GB${widthDot},${thickness},${thickness},B,${thickness}^FS`;
    }
    case "rect": {
      const r: any = el;
      const w = mmToDot(el.width || 0);
      const h = mmToDot(el.height || 0);
      const t = Math.max(1, Math.round(r.strokeWidth));
      const color = r.strokeColor === "#FFFFFF" ? "W" : "B";
      return `^FO${x},${y}^GB${w},${h},${t},${color},${r.radius || 0}^FS`;
    }
    case "ellipse": {
      const e: any = el;
      const w = mmToDot(el.width || 0);
      const h = mmToDot(el.height || 0);
      const t = Math.max(1, Math.round(e.strokeWidth));
      // ^GE 椭圆
      return `^FO${x},${y}^GE${w},${h},${t},B^FS`;
    }
    case "table": {
      // ZPL 不原生支持表格，按行渲染文本
      const t: any = el;
      const rows = (ctx.data[t.dataField] as any[]) || [];
      const rowHeightDot = mmToDot(t.rowHeight || 5);
      let zpl = "";
      let yOffset = 0;
      if (t.showHeader) {
        let xOffset = 0;
        for (const col of t.columns) {
          zpl += `^FO${x + xOffset},${y + yOffset}^A${fontSpec.font}N,${fontSpec.height},${fontSpec.width}^FD${escapeZpl(col.title)}^FS`;
          xOffset += mmToDot(col.width);
        }
        yOffset += rowHeightDot;
      }
      for (const row of rows) {
        let xOffset = 0;
        for (const col of t.columns) {
          const cellVal = escapeZpl(String(row[col.field] ?? ""));
          zpl += `^FO${x + xOffset},${y + yOffset}^A${fontSpec.font}N,${fontSpec.height},${fontSpec.width}^FD${cellVal}^FS`;
          xOffset += mmToDot(col.width);
        }
        yOffset += rowHeightDot;
      }
      return zpl;
    }
    default:
      return "";
  }
};

/** 渲染整页 ZPL */
export const renderZpl = (
  template: PrintTemplate,
  ctx: PrintRenderContext,
): string => {
  const { paper } = template;
  const widthDot = mmToDot(paper.width);
  const [mt, , , ml] = paper.margin;

  const parts: string[] = [];
  parts.push("^XA"); // 开始
  parts.push(`^LH${mmToDot(ml)},${mmToDot(mt)}`); // 标签原点偏移
  parts.push(`^PW${widthDot}`); // 打印宽度

  // 元素
  for (const el of template.elements) {
    const zpl = renderElement(el, ctx);
    if (zpl) parts.push(zpl);
  }

  parts.push("^XZ"); // 结束
  return parts.join("\n");
};
