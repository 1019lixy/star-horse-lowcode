/**
 * 地图 GIS 组件类型定义
 */

/** 经纬度坐标 */
export interface LngLat {
    lng: number;
    lat: number;
}

/** 地图边界范围 [lngMin, latMin, lngMax, latMax] */
export type MapBounds = [number, number, number, number];

/** 地图标记 */
export interface MapMarker {
    id: string;
    lng: number;
    lat: number;
    label?: string;
    color?: string;
    icon?: string;
    /** 标记大小（像素） */
    size?: number;
}

/** 轨迹点 */
export interface TrackPoint {
    lng: number;
    lat: number;
    /** 时间戳（毫秒） */
    time?: number;
    /** 该点速度（可选，用于轨迹着色） */
    speed?: number;
    /** 该点附加信息 */
    info?: Record<string, any>;
}

/** 轨迹数据 */
export interface TrackData {
    id: string;
    name?: string;
    points: TrackPoint[];
    /** 轨迹线颜色 */
    color?: string;
    /** 是否已走过部分颜色 */
    traveledColor?: string;
}

/** 热力点 */
export interface HeatPoint {
    lng: number;
    lat: number;
    /** 权重 0-1 */
    weight: number;
}

/** 热力图渐变停止点 */
export interface HeatGradientStop {
    offset: number; // 0-1
    color: string;  // rgba(r,g,b,a)
}

/** 地图通用配置 */
export interface MapConfig {
    /** 边界范围 */
    bounds: MapBounds;
    /** 背景图 URL（可选，用于楼层平面图等） */
    backgroundImage?: string;
    /** 是否只读 */
    readonly: boolean;
    /** 是否显示坐标网格 */
    showGrid: boolean;
    /** 是否显示比例尺 */
    showScale: boolean;
}

/** 地图选点字段值（字符串形式，便于表单存储） */
export type MapFieldValue = string; // "lng,lat" 格式
