import { Delete, Download, FolderOpened, QuestionFilled } from "@element-plus/icons-vue";
import type { MapBounds, TrackData, HeatPoint } from "@/components/map";
import type { ShDemoAction } from "../components/demoTypes";

/** 北京区域边界 [minLng, minLat, maxLng, maxLat] */
export const BEIJING_BOUNDS: MapBounds = [116.0, 39.5, 116.8, 40.2];

/** 坐标选点默认值 */
export const SAMPLE_FIELD_VALUE: string = "116.407400,39.904200";

/** 配送车辆轨迹示例（10 个点） */
export const SAMPLE_TRACKS: TrackData[] = [
    {
        id: "track_1",
        name: "配送车辆轨迹 - 京A12345",
        color: "#409EFF",
        traveledColor: "#67C23A",
        points: [
            { lng: 116.18, lat: 39.62, time: Date.parse("2026-07-18T08:00:00"), speed: 35 },
            { lng: 116.24, lat: 39.68, time: Date.parse("2026-07-18T08:20:00"), speed: 42 },
            { lng: 116.30, lat: 39.73, time: Date.parse("2026-07-18T08:40:00"), speed: 38 },
            { lng: 116.36, lat: 39.78, time: Date.parse("2026-07-18T09:00:00"), speed: 45 },
            { lng: 116.40, lat: 39.82, time: Date.parse("2026-07-18T09:20:00"), speed: 30 },
            { lng: 116.44, lat: 39.86, time: Date.parse("2026-07-18T09:40:00"), speed: 28 },
            { lng: 116.48, lat: 39.90, time: Date.parse("2026-07-18T10:00:00"), speed: 50 },
            { lng: 116.52, lat: 39.94, time: Date.parse("2026-07-18T10:20:00"), speed: 36 },
            { lng: 116.56, lat: 39.98, time: Date.parse("2026-07-18T10:40:00"), speed: 40 },
            { lng: 116.60, lat: 40.05, time: Date.parse("2026-07-18T11:00:00"), speed: 32 },
        ],
    },
];

/** 热力图示例点（20 个） */
export const SAMPLE_HEAT_POINTS: HeatPoint[] = [
    { lng: 116.20, lat: 39.65, weight: 0.3 },
    { lng: 116.25, lat: 39.70, weight: 0.5 },
    { lng: 116.30, lat: 39.75, weight: 0.8 },
    { lng: 116.35, lat: 39.78, weight: 0.6 },
    { lng: 116.38, lat: 39.80, weight: 0.9 },
    { lng: 116.40, lat: 39.82, weight: 1.0 },
    { lng: 116.42, lat: 39.85, weight: 0.7 },
    { lng: 116.45, lat: 39.88, weight: 0.85 },
    { lng: 116.48, lat: 39.90, weight: 0.95 },
    { lng: 116.50, lat: 39.92, weight: 0.65 },
    { lng: 116.52, lat: 39.95, weight: 0.55 },
    { lng: 116.55, lat: 39.98, weight: 0.4 },
    { lng: 116.58, lat: 40.00, weight: 0.75 },
    { lng: 116.60, lat: 40.05, weight: 0.5 },
    { lng: 116.22, lat: 39.85, weight: 0.45 },
    { lng: 116.28, lat: 39.90, weight: 0.6 },
    { lng: 116.33, lat: 39.93, weight: 0.7 },
    { lng: 116.46, lat: 39.75, weight: 0.35 },
    { lng: 116.50, lat: 39.80, weight: 0.5 },
    { lng: 116.15, lat: 39.75, weight: 0.25 },
];

/** 空数据 */
export const EMPTY_TRACKS: TrackData[] = [];
export const EMPTY_HEAT_POINTS: HeatPoint[] = [];

/**
 * MapDemo 主操作（左侧）
 */
export const MAP_ACTIONS: ShDemoAction[] = [
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.map.toolbar.loadSample", group: "data" },
    { key: "clear", icon: Delete, labelKey: "advanced.map.toolbar.clear", type: "danger", group: "data" },
    { key: "exportJson", icon: Download, tooltipKey: "advanced.map.toolbar.exportJson", iconOnly: true, group: "data" },
];

/**
 * MapDemo 次要操作（右侧）
 */
export const MAP_SECONDARY: ShDemoAction[] = [
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.map.toolbar.help", iconOnly: true },
];
