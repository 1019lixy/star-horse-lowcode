/**
 * 地图组件常量
 */
import type { HeatGradientStop, MapBounds, MapConfig, MapMarker } from "./types";

/** 默认边界范围（中国大致范围） */
export const DEFAULT_MAP_BOUNDS: MapBounds = [73.5, 18, 135, 53];

/** 默认地图配置 */
export const DEFAULT_MAP_CONFIG: MapConfig = {
    bounds: DEFAULT_MAP_BOUNDS,
    backgroundImage: "",
    readonly: false,
    showGrid: true,
    showScale: true,
};

/** 默认热力图渐变（蓝→绿→黄→红） */
export const DEFAULT_HEAT_GRADIENT: HeatGradientStop[] = [
    { offset: 0.0, color: "rgba(0,0,255,0)" },
    { offset: 0.2, color: "rgba(0,0,255,0.4)" },
    { offset: 0.4, color: "rgba(0,255,255,0.6)" },
    { offset: 0.6, color: "rgba(0,255,0,0.7)" },
    { offset: 0.8, color: "rgba(255,255,0,0.8)" },
    { offset: 1.0, color: "rgba(255,0,0,0.9)" },
];

/** 默认标记颜色 */
export const DEFAULT_MARKER_COLOR = "#F56C6C";

/** 默认轨迹颜色 */
export const DEFAULT_TRACK_COLOR = "#409EFF";
export const DEFAULT_TRAVELED_COLOR = "#67C23A";

/** 默认热力点半径（像素） */
export const DEFAULT_HEAT_RADIUS = 30;

/** 播放速度档位 */
export const TRACK_SPEED_PRESETS = [
    { value: 1, label: "1x" },
    { value: 2, label: "2x" },
    { value: 4, label: "4x" },
    { value: 8, label: "8x" },
    { value: 16, label: "16x" },
];

/** 工厂：创建标记 */
export const createMarker = (overrides: Partial<MapMarker> = {}): MapMarker => ({
    id: `mk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    lng: 116.4,
    lat: 39.9,
    label: "",
    color: DEFAULT_MARKER_COLOR,
    size: 12,
    ...overrides,
});

/** 解析 "lng,lat" 字符串 */
export const parseLngLat = (value: string): { lng: number; lat: number } | null => {
    if (!value || typeof value !== "string") return null;
    const parts = value.split(",").map((s) => parseFloat(s.trim()));
    if (parts.length !== 2 || parts.some(isNaN)) return null;
    return { lng: parts[0], lat: parts[1] };
};

/** 格式化为 "lng,lat" 字符串 */
export const formatLngLat = (lng: number, lat: number): string => `${lng.toFixed(6)},${lat.toFixed(6)}`;
