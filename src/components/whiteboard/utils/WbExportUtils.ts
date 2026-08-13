/**
 * 白板组件 - 导出工具
 *
 * 将白板元素序列化为独立 SVG / PNG / JSON
 */

import type { WhiteboardElement } from "../types";
import {
  wbArrowPath,
  wbGetBoundingBox,
  wbPointsToPath,
  wbShapePath,
  wbUnionBox,
} from "./WbGeometryUtils";

/** XML 转义 */
const wbXmlEscape = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** 单个元素转 SVG 字符串 */
export const wbElementToSvg = (el: WhiteboardElement): string => {
  const opacity = el.opacity ?? 1;
  switch (el.type) {
    case "pen": {
      const p = el as any;
      const d = wbPointsToPath(p.points);
      return `<path d="${d}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
    }
    case "shape": {
      const s = el as any;
      const d = wbShapePath(s.shape, s.width, s.height);
      const fill = s.fill === "transparent" ? "none" : s.fill;
      const transform = s.rotation
        ? ` transform="rotate(${s.rotation} ${s.width / 2} ${s.height / 2})"`
        : "";
      return `<g transform="translate(${s.x},${s.y})"${transform}><path d="${d}" stroke="${s.stroke}" stroke-width="${s.strokeWidth}" fill="${fill}" opacity="${opacity}"/></g>`;
    }
    case "line": {
      const l = el as any;
      if (l.arrow) {
        const d = wbArrowPath(l.x1, l.y1, l.x2, l.y2);
        return `<path d="${d}" stroke="${l.stroke}" stroke-width="${l.strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
      }
      return `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="${l.stroke}" stroke-width="${l.strokeWidth}" opacity="${opacity}"/>`;
    }
    case "text": {
      const t = el as any;
      const lines = String(t.text ?? "").split("\n");
      const anchor =
        t.textAlign === "center"
          ? "middle"
          : t.textAlign === "right"
            ? "end"
            : "start";
      const tx =
        t.textAlign === "center"
          ? t.x + t.width / 2
          : t.textAlign === "right"
            ? t.x + t.width
            : t.x;
      const content = lines
        .map(
          (line: string, i: number) =>
            `<tspan x="${tx}" dy="${i === 0 ? t.fontSize : t.fontSize * 1.2}">${wbXmlEscape(line)}</tspan>`,
        )
        .join("");
      return `<text x="${tx}" y="${t.y}" font-size="${t.fontSize}" fill="${t.color}" font-weight="${t.fontWeight || "normal"}" text-anchor="${anchor}" opacity="${opacity}">${content}</text>`;
    }
    default:
      return "";
  }
};

/** 计算所有元素的合并包围盒 */
export const wbGetElementsBounds = (elements: WhiteboardElement[]) => {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: 800, height: 600 };
  }
  let box = wbGetBoundingBox(elements[0]);
  for (let i = 1; i < elements.length; i++) {
    box = wbUnionBox(box, wbGetBoundingBox(elements[i]));
  }
  return {
    x: Math.floor(box.x - 20),
    y: Math.floor(box.y - 20),
    width: Math.ceil(box.width + 40),
    height: Math.ceil(box.height + 40),
  };
};

/** 元素列表转 SVG XML 字符串（独立可下载） */
export const wbToSvgXml = (
  elements: WhiteboardElement[],
  width?: number,
  height?: number,
  background = "#FFFFFF",
): string => {
  const bounds = wbGetElementsBounds(elements);
  const w = width ?? bounds.width;
  const h = height ?? bounds.height;
  const offsetX = width ? -bounds.x : 0;
  const offsetY = height ? -bounds.y : 0;
  const body = elements
    .filter((e) => e.visible !== false)
    .map((e) => {
      if (offsetX || offsetY) {
        return `<g transform="translate(${offsetX},${offsetY})">${wbElementToSvg(e)}</g>`;
      }
      return wbElementToSvg(e);
    })
    .join("\n  ");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${background}"/>${body ? "\n  " + body + "\n" : ""}</svg>`;
};

/** 元素列表转 JSON 字符串 */
export const wbToJson = (elements: WhiteboardElement[]): string =>
  JSON.stringify(elements, null, 2);

/** SVG XML 转 PNG Blob（异步） */
export const wbSvgXmlToPng = (
  svgXml: string,
  width: number,
  height: number,
  scale = 1,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([svgXml], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.floor(width * scale));
          canvas.height = Math.max(1, Math.floor(height * scale));
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            URL.revokeObjectURL(url);
            reject(new Error("canvas 2d context unavailable"));
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error("canvas toBlob failed"));
          }, "image/png");
        } catch (err) {
          URL.revokeObjectURL(url);
          reject(err);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("image load failed"));
      };
      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
};

/** 触发浏览器下载 Blob */
export const wbDownloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/** 触发文本下载 */
export const wbDownloadText = (
  text: string,
  filename: string,
  mime = "text/plain;charset=utf-8",
): void => {
  const blob = new Blob([text], { type: mime });
  wbDownloadBlob(blob, filename);
};
