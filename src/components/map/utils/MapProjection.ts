/**
 * 地图坐标投影工具：经纬度 ↔ 像素坐标
 */
import type { LngLat, MapBounds } from "../types";

export interface Pixel {
  x: number;
  y: number;
}

/**
 * 将经纬度投影到像素坐标
 * @param lngLat 经纬度
 * @param bounds 边界范围 [lngMin, latMin, lngMax, latMax]
 * @param width 画布宽度
 * @param height 画布高度
 * @param padding 内边距（像素），避免贴边
 */
export const project = (
  lngLat: LngLat,
  bounds: MapBounds,
  width: number,
  height: number,
  padding = 0,
): Pixel => {
  const [lngMin, latMin, lngMax, latMax] = bounds;
  const w = width - padding * 2;
  const h = height - padding * 2;
  const x = padding + ((lngLat.lng - lngMin) / (lngMax - lngMin)) * w;
  // 纬度方向相反（北朝上）
  const y = padding + ((latMax - lngLat.lat) / (latMax - latMin)) * h;
  return { x, y };
};

/**
 * 将像素坐标反投影为经纬度
 */
export const unproject = (
  pixel: Pixel,
  bounds: MapBounds,
  width: number,
  height: number,
  padding = 0,
): LngLat => {
  const [lngMin, latMin, lngMax, latMax] = bounds;
  const w = width - padding * 2;
  const h = height - padding * 2;
  const lng = lngMin + ((pixel.x - padding) / w) * (lngMax - lngMin);
  const lat = latMax - ((pixel.y - padding) / h) * (latMax - latMin);
  return { lng, lat };
};

/**
 * 计算两点间地理距离（简化版，使用平面近似，适用于小范围）
 * 单位：公里
 */
export const distanceKm = (a: LngLat, b: LngLat): number => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

/**
 * 在两点间线性插值
 * @param t 0-1
 */
export const interpolate = (a: LngLat, b: LngLat, t: number): LngLat => ({
  lng: a.lng + (b.lng - a.lng) * t,
  lat: a.lat + (b.lat - a.lat) * t,
});

/**
 * 生成网格线坐标
 */
export const generateGridLines = (
  bounds: MapBounds,
  lngStep: number,
  latStep: number,
): { lngs: number[]; lats: number[] } => {
  const [lngMin, latMin, lngMax, latMax] = bounds;
  const lngs: number[] = [];
  const lats: number[] = [];
  for (
    let lng = Math.ceil(lngMin / lngStep) * lngStep;
    lng <= lngMax;
    lng += lngStep
  ) {
    lngs.push(lng);
  }
  for (
    let lat = Math.ceil(latMin / latStep) * latStep;
    lat <= latMax;
    lat += latStep
  ) {
    lats.push(lat);
  }
  return { lngs, lats };
};
