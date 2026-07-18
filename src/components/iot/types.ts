/**
 * IoT 监控模块类型定义
 */

/** 设备状态 */
export type IotDeviceStatus =
    | "online"
    | "offline"
    | "warning"
    | "error"
    | "maintenance";

/** 设备类型 */
export type IotDeviceType =
    | "gateway"
    | "sensor"
    | "actuator"
    | "controller"
    | "camera";

/** 告警级别 */
export type IotAlarmLevel = "info" | "warning" | "error" | "critical";

/** 设备指标 */
export interface IotMetric {
    name: string;
    value: number | string;
    unit: string;
    timestamp: number;
}

/** IoT 设备 */
export interface IotDevice {
    id: string;
    name: string;
    type: IotDeviceType;
    status: IotDeviceStatus;
    /** 父设备 ID（用于构建拓扑树） */
    parentId?: string | null;
    /** 设备属性 */
    properties: Record<string, any>;
    /** 实时指标列表 */
    metrics: IotMetric[];
    /** 最后在线时间 */
    lastSeen: number;
    /** 安装位置 */
    location: string;
}

/** 告警记录 */
export interface IotAlarm {
    id: string;
    deviceId: string;
    deviceName: string;
    level: IotAlarmLevel;
    message: string;
    timestamp: number;
    acknowledged: boolean;
    resolved: boolean;
}

/** 拓扑节点（设备 + 坐标） */
export interface IotTopologyNode {
    device: IotDevice;
    x: number;
    y: number;
}

/** 拓扑连线 */
export interface IotTopologyEdge {
    source: string;
    target: string;
    label?: string;
}

/** 时序数据点 */
export interface IotTimeSeriesPoint {
    timestamp: number;
    value: number;
}

/** 图表系列 */
export interface IotChartSeries {
    name: string;
    color: string;
    data: IotTimeSeriesPoint[];
    /** 是否可见 */
    visible?: boolean;
}

/** 图表配置 */
export interface IotChartConfig {
    title: string;
    unit: string;
    yMin?: number;
    yMax?: number;
    /** 刷新间隔（毫秒） */
    refreshInterval: number;
    /** 时间窗口显示的点数 */
    windowSize?: number;
}

/** 设备类型预设 */
export interface IotDeviceTypePreset {
    type: IotDeviceType;
    label: string;
    icon: string;
    color: string;
}

/** 告警统计 */
export interface IotAlarmStats {
    total: number;
    active: number;
    acknowledged: number;
    resolved: number;
    byLevel: Record<IotAlarmLevel, number>;
}
