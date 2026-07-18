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
