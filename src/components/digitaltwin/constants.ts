/**
 * 数字孪生模块 - 常量定义
 *
 * 实体类型预设 / 状态预设 / 视角预设 / 默认颜色 / 工厂函数
 */

import type {
    DtCamera,
    DtEntity,
    DtEntityType,
    DtEntityTypePreset,
    DtSensorData,
    DtSize3D,
    DtStatusPreset,
    DtViewPresetItem,
    DtViewPreset3D,
    DtViewportMode,
    DtLightingPreset,
    DtShadowQuality,
    DtRenderMode,
} from "./types";

/** 实体类型预设 */
export const DT_ENTITY_TYPE_PRESETS: DtEntityTypePreset[] = [
    {
        type: "cube",
        labelKey: "digitaltwin.type.cube",
        color: "#1890FF",
        defaultSize: { width: 60, height: 60, depth: 60, radius: 0 },
    },
    {
        type: "cylinder",
        labelKey: "digitaltwin.type.cylinder",
        color: "#722ED1",
        defaultSize: { width: 0, height: 80, depth: 0, radius: 30 },
    },
    {
        type: "plane",
        labelKey: "digitaltwin.type.plane",
        color: "#8C8C8C",
        defaultSize: { width: 200, height: 0, depth: 200, radius: 0 },
    },
    {
        type: "sphere",
        labelKey: "digitaltwin.type.sphere",
        color: "#13C2C2",
        defaultSize: { width: 0, height: 0, depth: 0, radius: 25 },
    },
];

/** 状态预设 */
export const DT_STATUS_PRESETS: DtStatusPreset[] = [
    {
        status: "normal",
        labelKey: "digitaltwin.status.normal",
        colorLabelKey: "digitaltwin.status.normal.color",
        color: "#52C41A",
    },
    {
        status: "warning",
        labelKey: "digitaltwin.status.warning",
        colorLabelKey: "digitaltwin.status.warning.color",
        color: "#FAAD14",
    },
    {
        status: "alarm",
        labelKey: "digitaltwin.status.alarm",
        colorLabelKey: "digitaltwin.status.alarm.color",
        color: "#F5222D",
    },
    {
        status: "offline",
        labelKey: "digitaltwin.status.offline",
        colorLabelKey: "digitaltwin.status.offline.color",
        color: "#8C8C8C",
    },
];

/** 视角预设 */
export const DT_VIEW_PRESETS: DtViewPresetItem[] = [
    { preset: "top", labelKey: "digitaltwin.toolbar.view.top", camera: { yaw: 0, pitch: 90 } },
    { preset: "front", labelKey: "digitaltwin.toolbar.view.front", camera: { yaw: 0, pitch: 0 } },
    { preset: "side", labelKey: "digitaltwin.toolbar.view.side", camera: { yaw: 90, pitch: 0 } },
    { preset: "iso", labelKey: "digitaltwin.toolbar.view.iso", camera: { yaw: 45, pitch: 30 } },
];

/** 默认颜色（未指定状态时） */
export const DT_DEFAULT_COLORS = {
    cube: "#1890FF",
    cylinder: "#722ED1",
    plane: "#8C8C8C",
    sphere: "#13C2C2",
    highlight: "#FAAD14",
    grid: "#E8E8E8",
    axisX: "#F5222D",
    axisY: "#52C41A",
    axisZ: "#1890FF",
};

/** 默认相机 */
export const DT_DEFAULT_CAMERA: DtCamera = {
    yaw: 45,
    pitch: 30,
    zoom: 1,
    panX: 0,
    panY: 0,
};

/** 缩放上下限 */
export const DT_ZOOM_MIN = 0.3;
export const DT_ZOOM_MAX = 3;

/** pitch 上下限（度） */
export const DT_PITCH_MIN = 0;
export const DT_PITCH_MAX = 90;

/** 投影基础缩放 */
export const DT_PROJECTION_SCALE = 1;

/** 默认模拟间隔（ms） */
export const DT_DEFAULT_SIM_INTERVAL = 1000;

/** 网格大小 */
export const DT_GRID_SIZE = 50;
export const DT_GRID_DIVISIONS = 10;

/** 工具：取得类型预设 */
export const dtGetEntityTypePreset = (type: string): DtEntityTypePreset | undefined =>
    DT_ENTITY_TYPE_PRESETS.find((p) => p.type === type);

/** 工具：取得状态预设 */
export const dtGetStatusPreset = (status: string): DtStatusPreset | undefined =>
    DT_STATUS_PRESETS.find((p) => p.status === status);

/** 工具：根据状态取得颜色（离线实体用灰色，否则用实体自身颜色） */
export const dtGetEntityColor = (entity: DtEntity): string => {
    if (entity.status === "offline") {
        return dtGetStatusPreset("offline")?.color ?? "#8C8C8C";
    }
    return entity.color;
};

/** 生成唯一 ID */
export const dtGenId = (prefix: string): string =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

/** 根据类型生成默认传感器数据 */
export const dtCreateSensorData = (type: DtEntityType | string): DtSensorData => {
    const rand = (min: number, max: number) =>
        Math.round((min + Math.random() * (max - min)) * 100) / 100;
    switch (type) {
        case "cube":
            return {
                temperature: { labelKey: "digitaltwin.property.metric.temperature", unitKey: "digitaltwin.property.unit.celsius", value: rand(40, 80) },
                speed: { labelKey: "digitaltwin.property.metric.speed", unitKey: "digitaltwin.property.unit.rpm", value: rand(1000, 3000) },
                power: { labelKey: "digitaltwin.property.metric.power", unitKey: "digitaltwin.property.unit.watt", value: rand(500, 2000) },
            };
        case "cylinder":
            return {
                pressure: { labelKey: "digitaltwin.property.metric.pressure", unitKey: "digitaltwin.property.unit.pascal", value: rand(100, 500) },
                efficiency: { labelKey: "digitaltwin.property.metric.efficiency", unitKey: "digitaltwin.property.unit.percent", value: rand(60, 95) },
            };
        case "sphere":
            return {
                temperature: { labelKey: "digitaltwin.property.metric.temperature", unitKey: "digitaltwin.property.unit.celsius", value: rand(20, 60) },
            };
        default:
            return {};
    }
};

/** 默认尺寸（按类型） */
export const dtDefaultSize = (type: DtEntityType | string): DtSize3D => {
    const preset = dtGetEntityTypePreset(type);
    const ds = preset?.defaultSize ?? {};
    return {
        width: ds.width ?? 0,
        height: ds.height ?? 0,
        depth: ds.depth ?? 0,
        radius: ds.radius ?? 0,
    };
};

/** 创建实体 */
export const createDtEntity = (
    type: DtEntityType | string,
    name: string,
    position = { x: 0, y: 0, z: 0 },
    size?: Partial<DtSize3D>,
    color?: string,
    status: DtEntity["status"] = "normal",
    properties?: Record<string, any>,
): DtEntity => {
    const preset = dtGetEntityTypePreset(type);
    const baseSize = dtDefaultSize(type);
    return {
        id: dtGenId("dt"),
        type,
        name,
        position: { ...position },
        size: { ...baseSize, ...size },
        color: color ?? preset?.color ?? "#8C8C8C",
        status,
        properties: properties ? { ...properties } : {},
        sensorData: dtCreateSensorData(type),
        visible: true,
    };
};

/* ============================================================
 *  v3.2 企业级 3D 引擎层常量
 *
 *  与 DtEngine 构造函数 defaults / DtCameraRig.PRESET_SPHERICAL /
 *  DtLightingRig 预设对齐，便于外部统一引用与覆盖。
 * ============================================================ */

/** 引擎默认配置（与 DtEngine 构造函数 defaults 对齐，便于外部预设） */
export const DT_DEFAULT_ENGINE_OPTIONS: {
    antialias: boolean;
    maxPixelRatio: number;
    shadowMapEnabled: boolean;
    enablePostProcessing: boolean;
    renderMode: DtRenderMode;
    background: number;
    assetBase: string;
    fov: number;
    near: number;
    far: number;
} = {
    antialias: true,
    maxPixelRatio: 2,
    shadowMapEnabled: true,
    enablePostProcessing: false,
    renderMode: "always",
    background: 0x1e1e1e,
    assetBase: "/assets/",
    fov: 50,
    near: 0.1,
    far: 5000,
};

/** 3D 视角预设列表（与 DtCameraRig.PRESET_SPHERICAL 对齐） */
export const DT_VIEW_PRESETS_3D: Array<{
    value: DtViewPreset3D;
    labelKey: string;
}> = [
    { value: "top", labelKey: "digitaltwin.viewport.preset.top" },
    { value: "front", labelKey: "digitaltwin.viewport.preset.front" },
    { value: "side", labelKey: "digitaltwin.viewport.preset.side" },
    { value: "iso", labelKey: "digitaltwin.viewport.preset.iso" },
    { value: "back", labelKey: "digitaltwin.viewport.preset.back" },
    { value: "bottom", labelKey: "digitaltwin.viewport.preset.bottom" },
];

/** 视口交互模式列表 */
export const DT_VIEWPORT_MODES: Array<{
    value: DtViewportMode;
    labelKey: string;
}> = [
    { value: "view", labelKey: "digitaltwin.viewport.mode.view" },
    { value: "edit", labelKey: "digitaltwin.viewport.mode.edit" },
    { value: "measure", labelKey: "digitaltwin.viewport.mode.measure" },
    { value: "annotation", labelKey: "digitaltwin.viewport.mode.annotation" },
    { value: "inspection", labelKey: "digitaltwin.viewport.mode.inspection" },
];

/** 光照预设列表 */
export const DT_LIGHTING_PRESETS: Array<{
    value: DtLightingPreset;
    labelKey: string;
}> = [
    { value: "day", labelKey: "digitaltwin.lighting.preset.day" },
    { value: "dusk", labelKey: "digitaltwin.lighting.preset.dusk" },
    { value: "night", labelKey: "digitaltwin.lighting.preset.night" },
    { value: "industrial", labelKey: "digitaltwin.lighting.preset.industrial" },
    { value: "studio", labelKey: "digitaltwin.lighting.preset.studio" },
];

/** 阴影质量选项 */
export const DT_SHADOW_QUALITY_OPTIONS: Array<{
    value: DtShadowQuality;
    labelKey: string;
    mapSize: number;
}> = [
    { value: "low", labelKey: "digitaltwin.shadow.quality.low", mapSize: 1024 },
    { value: "medium", labelKey: "digitaltwin.shadow.quality.medium", mapSize: 2048 },
    { value: "high", labelKey: "digitaltwin.shadow.quality.high", mapSize: 4096 },
];

/** 性能阈值默认配置（FPS<30 触发自动降级） */
export const DT_DEFAULT_PERFORMANCE_THRESHOLD = {
    minFps: 30,
    maxTriangles: 2_000_000,
    maxDrawCalls: 5000,
    maxFrameTime: 33, // ms（约 30fps）
};

/** 旧 DtEntity status → 颜色映射（DtSceneViewport 兼容映射复用） */
export const DT_STATUS_COLOR_MAP: Record<string, string> = {
    normal: "#52C41A",
    warning: "#FAAD14",
    alarm: "#F5222D",
    offline: "#8C8C8C",
};
