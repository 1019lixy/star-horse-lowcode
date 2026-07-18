/**
 * 数字孪生模块 - 类型定义
 *
 * 3D 实体 / 场景 / 相机 / 传感器 / 视角预设
 */

/** 实体类型 */
export type DtEntityType = "cube" | "cylinder" | "plane" | "sphere";

/** 实体状态 */
export type DtEntityStatus = "normal" | "warning" | "alarm" | "offline";

/** 视角预设 */
export type DtViewPreset = "top" | "front" | "side" | "iso";

/** 3D 点 */
export interface DtPoint3D {
    x: number;
    y: number;
    z: number;
}

/** 3D 尺寸（不同类型实体使用不同字段） */
export interface DtSize3D {
    /** 立方体/平面：宽度；圆柱/球体：半径相关 */
    width: number;
    /** 立方体/圆柱：高度 */
    height: number;
    /** 立方体/平面：深度 */
    depth: number;
    /** 圆柱/球体：半径 */
    radius: number;
}

/** 传感器数据项 */
export interface DtSensorMetric {
    /** i18n 标签 key */
    labelKey: string;
    /** 单位 i18n key */
    unitKey: string;
    /** 数值 */
    value: number;
}

/** 实体传感器数据集合 */
export type DtSensorData = Record<string, DtSensorMetric>;

/** 3D 实体 */
export interface DtEntity {
    id: string;
    /** 实体类型 */
    type: DtEntityType | string;
    /** 名称 */
    name: string;
    /** 位置 */
    position: DtPoint3D;
    /** 尺寸 */
    size: DtSize3D;
    /** 颜色 */
    color: string;
    /** 状态 */
    status: DtEntityStatus;
    /** 自定义属性 */
    properties?: Record<string, any>;
    /** 传感器数据 */
    sensorData?: DtSensorData;
    /** 是否可见 */
    visible?: boolean;
}

/** 相机状态 */
export interface DtCamera {
    /** 绕 Y 轴旋转角（度） */
    yaw: number;
    /** 绕 X 轴旋转角（度） */
    pitch: number;
    /** 缩放 */
    zoom: number;
    /** 平移 X */
    panX: number;
    /** 平移 Y */
    panY: number;
}

/** 场景 */
export interface DtScene {
    id: string;
    name: string;
    entities: DtEntity[];
}

/** 实体类型预设 */
export interface DtEntityTypePreset {
    type: DtEntityType;
    /** i18n 标签 key */
    labelKey: string;
    /** 默认颜色 */
    color: string;
    /** 默认尺寸 */
    defaultSize: Partial<DtSize3D>;
}

/** 状态预设 */
export interface DtStatusPreset {
    status: DtEntityStatus;
    /** i18n 标签 key */
    labelKey: string;
    /** i18n 颜色描述 key */
    colorLabelKey: string;
    /** 颜色 */
    color: string;
}

/** 视角预设项 */
export interface DtViewPresetItem {
    preset: DtViewPreset;
    /** i18n 标签 key */
    labelKey: string;
    /** 对应相机参数 */
    camera: Pick<DtCamera, "yaw" | "pitch">;
}

/** 投影后的 2D 点（含深度） */
export interface DtProjectedPoint {
    x: number;
    y: number;
    /** 深度（用于画家算法排序） */
    depth: number;
}

/** 设计器状态 */
export interface DtDesignerState {
    scene: DtScene;
    camera: DtCamera;
    /** 选中实体 ID */
    selectedEntityId: string | null;
    /** 是否正在模拟 */
    simRunning: boolean;
    /** 状态筛选 */
    statusFilter: DtEntityStatus | "all";
}

/** 实体统计 */
export interface DtEntityStats {
    total: number;
    normal: number;
    warning: number;
    alarm: number;
    offline: number;
}
