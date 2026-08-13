/**
 * 热力图渲染器（纯 Canvas 算法，无依赖）
 */
import type { HeatGradientStop, HeatPoint, MapBounds } from "../types";
import { project } from "./MapProjection";

/**
 * 渲染热力图到指定 Canvas
 * @param canvas 目标 canvas
 * @param points 热力点
 * @param bounds 边界范围
 * @param radius 半径（像素）
 * @param gradient 渐变停止点
 * @param backgroundOpacity 背景透明度
 */
export const renderHeatmap = (
  canvas: HTMLCanvasElement,
  points: HeatPoint[],
  bounds: MapBounds,
  radius = 30,
  gradient: HeatGradientStop[] = [],
  backgroundOpacity = 0.6,
): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  if (points.length === 0) return;

  // 1. 绘制每个热力点的径向渐变到临时 alpha 通道
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;

  for (const p of points) {
    const px = project({ lng: p.lng, lat: p.lat }, bounds, width, height);
    const w = Math.max(0.01, Math.min(1, p.weight));
    const r = Math.max(1, radius);
    const grad = tempCtx.createRadialGradient(px.x, px.y, 0, px.x, px.y, r);
    grad.addColorStop(0, `rgba(0,0,0,${w})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    tempCtx.fillStyle = grad;
    tempCtx.beginPath();
    tempCtx.arc(px.x, px.y, r, 0, Math.PI * 2);
    tempCtx.fill();
  }

  // 2. 读取 alpha 通道，按渐变着色
  const imageData = tempCtx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const stops = gradient.length > 0 ? gradient : DEFAULT_GRADIENT;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha === 0) continue;
    const t = alpha / 255;
    const color = pickGradientColor(stops, t);
    const rgba = parseRgba(color);
    data[i] = rgba.r;
    data[i + 1] = rgba.g;
    data[i + 2] = rgba.b;
    data[i + 3] = Math.round(rgba.a * 255 * backgroundOpacity);
  }
  ctx.putImageData(imageData, 0, 0);
};

const DEFAULT_GRADIENT: HeatGradientStop[] = [
  { offset: 0, color: "rgba(0,0,255,0)" },
  { offset: 0.25, color: "rgba(0,0,255,0.4)" },
  { offset: 0.5, color: "rgba(0,255,0,0.6)" },
  { offset: 0.75, color: "rgba(255,255,0,0.8)" },
  { offset: 1, color: "rgba(255,0,0,1)" },
];

const pickGradientColor = (stops: HeatGradientStop[], t: number): string => {
  if (stops.length === 0) return "rgba(255,0,0,1)";
  if (t <= stops[0].offset) return stops[0].color;
  if (t >= stops[stops.length - 1].offset) return stops[stops.length - 1].color;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (t >= a.offset && t <= b.offset) {
      const ratio = (t - a.offset) / (b.offset - a.offset || 1);
      const ca = parseRgba(a.color);
      const cb = parseRgba(b.color);
      return `rgba(${Math.round(ca.r + (cb.r - ca.r) * ratio)},${Math.round(
        ca.g + (cb.g - ca.g) * ratio,
      )},${Math.round(ca.b + (cb.b - ca.b) * ratio)},${ca.a + (cb.a - ca.a) * ratio})`;
    }
  }
  return stops[stops.length - 1].color;
};

const parseRgba = (
  color: string,
): { r: number; g: number; b: number; a: number } => {
  const m = color.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/,
  );
  if (m) {
    return {
      r: parseInt(m[1], 10),
      g: parseInt(m[2], 10),
      b: parseInt(m[3], 10),
      a: m[4] !== undefined ? parseFloat(m[4]) : 1,
    };
  }
  return { r: 255, g: 0, b: 0, a: 1 };
};
