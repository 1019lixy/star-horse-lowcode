/**
 * IoT 监控常量、预设、示例数据与工厂函数（i18n 化）
 */
import {i18n} from "@/lang";
import type {
    IotAlarm,
    IotAlarmLevel,
    IotChartSeries,
    IotDevice,
    IotDeviceStatus,
    IotDeviceType,
    IotDeviceTypePreset,
    IotMetric,
    IotTopologyEdge,
    IotTopologyNode,
} from "./types";

/** 设备类型预设表 */
export const DEVICE_TYPE_PRESETS: IotDeviceTypePreset[] = [
    {type: "gateway", label: i18n("iot.deviceType.gateway"), icon: "Connection", color: "#409EFF"},
    {type: "controller", label: i18n("iot.deviceType.controller"), icon: "Cpu", color: "#67C23A"},
    {type: "sensor", label: i18n("iot.deviceType.sensor"), icon: "Odometer", color: "#E6A23C"},
    {type: "actuator", label: i18n("iot.deviceType.actuator"), icon: "Switch", color: "#909399"},
    {type: "camera", label: i18n("iot.deviceType.camera"), icon: "VideoCamera", color: "#9C27B0"},
];

/** 设备状态颜色映射 */
export const IOT_STATUS_COLORS: Record<IotDeviceStatus, string> = {
    online: "#67C23A",
    offline: "#909399",
    warning: "#E6A23C",
    error: "#F56C6C",
    maintenance: "#9C27B0",
};

/** 设备状态标签映射 */
export const STATUS_LABELS: Record<IotDeviceStatus, string> = {
    online: i18n("iot.deviceStatus.online"),
    offline: i18n("iot.deviceStatus.offline"),
    warning: i18n("iot.deviceStatus.warning"),
    error: i18n("iot.deviceStatus.error"),
    maintenance: i18n("iot.deviceStatus.maintenance"),
};

/** 告警级别颜色映射 */
export const ALARM_LEVEL_COLORS: Record<IotAlarmLevel, string> = {
    info: "#909399",
    warning: "#E6A23C",
    error: "#F56C6C",
    critical: "#B71C1C",
};

/** 告警级别标签映射 */
export const ALARM_LEVEL_LABELS: Record<IotAlarmLevel, string> = {
    info: i18n("iot.alarmLevel.info"),
    warning: i18n("iot.alarmLevel.warning"),
    error: i18n("iot.alarmLevel.error"),
    critical: i18n("iot.alarmLevel.critical"),
};

/** 按类型查找预设 */
export const findDevicePreset = (type: IotDeviceType): IotDeviceTypePreset | undefined =>
    DEVICE_TYPE_PRESETS.find((p) => p.type === type);

/** 创建指标 */
export const createMetric = (overrides: Partial<IotMetric> = {}): IotMetric => ({
    name: overrides.name ?? i18n("iot.device.metrics"),
    value: overrides.value ?? 0,
    unit: overrides.unit ?? "",
    timestamp: overrides.timestamp ?? Date.now(),
});

/** 创建设备 */
export const createDevice = (overrides: Partial<IotDevice> = {}): IotDevice => ({
    id: overrides.id ?? `dev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: overrides.name ?? i18n("iot.device.name"),
    type: overrides.type ?? "sensor",
    status: overrides.status ?? "online",
    parentId: overrides.parentId ?? null,
    properties: overrides.properties ?? {},
    metrics: overrides.metrics ?? [],
    lastSeen: overrides.lastSeen ?? Date.now(),
    location: overrides.location ?? "",
});

/** 创建告警 */
export const createAlarm = (overrides: Partial<IotAlarm> = {}): IotAlarm => ({
    id: overrides.id ?? `alm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    deviceId: overrides.deviceId ?? "",
    deviceName: overrides.deviceName ?? "",
    level: overrides.level ?? "info",
    message: overrides.message ?? "",
    timestamp: overrides.timestamp ?? Date.now(),
    acknowledged: overrides.acknowledged ?? false,
    resolved: overrides.resolved ?? false,
});

/** 拓扑节点尺寸 */
export const TOPOLOGY_NODE_WIDTH = 120;
export const TOPOLOGY_NODE_HEIGHT = 56;
/** 布局水平间距 */
export const LAYOUT_H_GAP = 40;
/** 布局垂直间距 */
export const LAYOUT_V_GAP = 100;
/** 布局左边距 */
export const LAYOUT_MARGIN_X = 80;
/** 布局上边距 */
export const LAYOUT_MARGIN_Y = 60;

/**
 * 自动布局拓扑：基于 parentId 构建树形分层布局
 * - 同一深度水平排列
 * - 父节点居中对齐到子节点区间
 */
export const autoLayoutTopology = (devices: IotDevice[]): IotTopologyNode[] => {
    if (devices.length === 0) return [];

    // 1. 构建 parent -> children 映射
    const childrenMap = new Map<string | null, IotDevice[]>();
    for (const d of devices) {
        const key = d.parentId ?? null;
        if (!childrenMap.has(key)) childrenMap.set(key, []);
        childrenMap.get(key)!.push(d);
    }

    // 2. 计算每个节点的深度（BFS）
    const depthMap = new Map<string, number>();
    const roots = childrenMap.get(null) ?? [];
    let maxDepth = 0;
    const queue: Array<{ device: IotDevice; depth: number }> = roots.map((d) => ({device: d, depth: 0}));
    while (queue.length > 0) {
        const {device, depth} = queue.shift()!;
        depthMap.set(device.id, depth);
        maxDepth = Math.max(maxDepth, depth);
        const kids = childrenMap.get(device.id) ?? [];
        for (const k of kids) queue.push({device: k, depth: depth + 1});
    }

    // 3. 自底向上分配叶子序号，计算每个节点占据的横向槽位
    // 叶子节点按出现顺序获得一个槽位，父节点槽位为子节点槽位的中点
    const slotMap = new Map<string, number>();
    let nextSlot = 0;

    const assignSlots = (device: IotDevice): number => {
        const kids = childrenMap.get(device.id) ?? [];
        if (kids.length === 0) {
            const slot = nextSlot++;
            slotMap.set(device.id, slot);
            return slot;
        }
        const childSlots = kids.map(assignSlots);
        const center = (childSlots[0] + childSlots[childSlots.length - 1]) / 2;
        slotMap.set(device.id, center);
        return center;
    };
    for (const r of roots) assignSlots(r);

    // 4. 计算实际坐标
    const nodes: IotTopologyNode[] = devices.map((device) => {
        const depth = depthMap.get(device.id) ?? 0;
        const slot = slotMap.get(device.id) ?? 0;
        return {
            device,
            x: LAYOUT_MARGIN_X + slot * (TOPOLOGY_NODE_WIDTH + LAYOUT_H_GAP),
            y: LAYOUT_MARGIN_Y + depth * (TOPOLOGY_NODE_HEIGHT + LAYOUT_V_GAP),
        };
    });
    return nodes;
};

/** 根据设备列表构建拓扑连线 */
export const buildTopologyEdges = (devices: IotDevice[]): IotTopologyEdge[] => {
    const edges: IotTopologyEdge[] = [];
    for (const d of devices) {
        if (d.parentId) {
            const parent = devices.find((p) => p.id === d.parentId);
            edges.push({
                source: d.parentId,
                target: d.id,
                label: parent ? `${parent.name} → ${d.name}` : "",
            });
        }
    }
    return edges;
};

/** 计算拓扑视图所需尺寸 */
export const computeTopologySize = (nodes: IotTopologyNode[]): { width: number; height: number } => {
    if (nodes.length === 0) return {width: 600, height: 400};
    let maxX = 0;
    let maxY = 0;
    for (const n of nodes) {
        maxX = Math.max(maxX, n.x + TOPOLOGY_NODE_WIDTH);
        maxY = Math.max(maxY, n.y + TOPOLOGY_NODE_HEIGHT);
    }
    return {
        width: maxX + LAYOUT_MARGIN_X,
        height: maxY + LAYOUT_MARGIN_Y,
    };
};

/** 生成示例时序数据 */
const generateSeries = (
    name: string,
    color: string,
    base: number,
    amplitude: number,
    points = 30,
): IotChartSeries => {
    const data = [];
    const now = Date.now();
    for (let i = points - 1; i >= 0; i--) {
        const ts = now - i * 5000;
        const wave = Math.sin(i / 3) * amplitude;
        const noise = (Math.random() - 0.5) * amplitude * 0.4;
        data.push({timestamp: ts, value: Number((base + wave + noise).toFixed(2))});
    }
    return {name, color, data, visible: true};
};

/** 示例时序数据（温度/湿度/压力） */
export const SAMPLE_METRICS: IotChartSeries[] = [
    generateSeries(i18n("iot.chart.series") + "-T", "#F56C6C", 25, 6),
    generateSeries(i18n("iot.chart.series") + "-H", "#409EFF", 60, 12),
    generateSeries(i18n("iot.chart.series") + "-P", "#67C23A", 101, 2),
];

/** 示例设备（1 网关 → 3 控制器 → 传感器/摄像头/执行器） */
export const SAMPLE_DEVICES: IotDevice[] = [
    createDevice({
        id: "gw-001",
        name: "EdgeGateway-A1",
        type: "gateway",
        status: "online",
        parentId: null,
        location: "数据中心-A栋",
        lastSeen: Date.now() - 2000,
        properties: {vendor: "StarHorse", model: "EG-200", firmware: "v2.4.1", ip: "10.0.0.1"},
        metrics: [
            createMetric({name: "CPU", value: 42, unit: "%"}),
            createMetric({name: "Memory", value: 68, unit: "%"}),
            createMetric({name: "Throughput", value: 1280, unit: "KB/s"}),
        ],
    }),
    createDevice({
        id: "ctrl-001",
        name: "Controller-车间1",
        type: "controller",
        status: "online",
        parentId: "gw-001",
        location: "车间1-主控柜",
        lastSeen: Date.now() - 3000,
        properties: {model: "PLC-1200", channels: 16, protocol: "Modbus-TCP"},
        metrics: [
            createMetric({name: "CPU", value: 35, unit: "%"}),
            createMetric({name: "Temperature", value: 38, unit: "℃"}),
        ],
    }),
    createDevice({
        id: "ctrl-002",
        name: "Controller-车间2",
        type: "controller",
        status: "online",
        parentId: "gw-001",
        location: "车间2-主控柜",
        lastSeen: Date.now() - 4000,
        properties: {model: "PLC-1200", channels: 12, protocol: "Modbus-TCP"},
        metrics: [
            createMetric({name: "CPU", value: 28, unit: "%"}),
            createMetric({name: "Temperature", value: 36, unit: "℃"}),
        ],
    }),
    createDevice({
        id: "ctrl-003",
        name: "Controller-车间3",
        type: "controller",
        status: "error",
        parentId: "gw-001",
        location: "车间3-主控柜",
        lastSeen: Date.now() - 600000,
        properties: {model: "PLC-1500", channels: 20, protocol: "OPC-UA"},
        metrics: [
            createMetric({name: "CPU", value: 0, unit: "%"}),
            createMetric({name: "Temperature", value: 0, unit: "℃"}),
        ],
    }),
    createDevice({
        id: "sensor-001",
        name: "温湿度传感器-S1",
        type: "sensor",
        status: "online",
        parentId: "ctrl-001",
        location: "车间1-工位A",
        lastSeen: Date.now() - 1000,
        properties: {model: "TH-100", battery: 87, range: "-20~80℃"},
        metrics: [
            createMetric({name: "Temperature", value: 24.5, unit: "℃"}),
            createMetric({name: "Humidity", value: 58, unit: "%"}),
        ],
    }),
    createDevice({
        id: "sensor-002",
        name: "温湿度传感器-S2",
        type: "sensor",
        status: "warning",
        parentId: "ctrl-001",
        location: "车间1-工位B",
        lastSeen: Date.now() - 5000,
        properties: {model: "TH-100", battery: 21, range: "-20~80℃"},
        metrics: [
            createMetric({name: "Temperature", value: 31.2, unit: "℃"}),
            createMetric({name: "Humidity", value: 72, unit: "%"}),
        ],
    }),
    createDevice({
        id: "camera-001",
        name: "摄像头-C1",
        type: "camera",
        status: "online",
        parentId: "ctrl-001",
        location: "车间1-入口",
        lastSeen: Date.now() - 500,
        properties: {resolution: "1080P", fps: 25, model: "CAM-IR"},
        metrics: [
            createMetric({name: "Bitrate", value: 4096, unit: "Kbps"}),
            createMetric({name: "FPS", value: 25, unit: "fps"}),
        ],
    }),
    createDevice({
        id: "sensor-003",
        name: "压力传感器-S3",
        type: "sensor",
        status: "online",
        parentId: "ctrl-002",
        location: "车间2-管道",
        lastSeen: Date.now() - 2000,
        properties: {model: "PS-200", range: "0~10MPa"},
        metrics: [
            createMetric({name: "Pressure", value: 1.02, unit: "MPa"}),
        ],
    }),
    createDevice({
        id: "actuator-001",
        name: "电磁阀-V1",
        type: "actuator",
        status: "online",
        parentId: "ctrl-002",
        location: "车间2-阀门",
        lastSeen: Date.now() - 1500,
        properties: {model: "VL-50", type: "电磁阀", state: "OPEN"},
        metrics: [
            createMetric({name: "State", value: "OPEN", unit: ""}),
        ],
    }),
    createDevice({
        id: "camera-002",
        name: "摄像头-C2",
        type: "camera",
        status: "maintenance",
        parentId: "ctrl-003",
        location: "车间3-出口",
        lastSeen: Date.now() - 7200000,
        properties: {resolution: "720P", fps: 0, model: "CAM-IR"},
        metrics: [
            createMetric({name: "Bitrate", value: 0, unit: "Kbps"}),
        ],
    }),
];

/** 示例告警 */
export const SAMPLE_ALARMS: IotAlarm[] = [
    createAlarm({
        id: "alm-001",
        deviceId: "ctrl-003",
        deviceName: "Controller-车间3",
        level: "critical",
        message: "控制器离线，通讯中断超过 10 分钟",
        timestamp: Date.now() - 600000,
        acknowledged: false,
        resolved: false,
    }),
    createAlarm({
        id: "alm-002",
        deviceId: "sensor-002",
        deviceName: "温湿度传感器-S2",
        level: "warning",
        message: "温度超过阈值（31.2℃ > 30℃）",
        timestamp: Date.now() - 300000,
        acknowledged: false,
        resolved: false,
    }),
    createAlarm({
        id: "alm-003",
        deviceId: "sensor-002",
        deviceName: "温湿度传感器-S2",
        level: "warning",
        message: "电池电量低（21%）",
        timestamp: Date.now() - 200000,
        acknowledged: true,
        resolved: false,
    }),
    createAlarm({
        id: "alm-004",
        deviceId: "camera-002",
        deviceName: "摄像头-C2",
        level: "error",
        message: "视频流中断",
        timestamp: Date.now() - 7200000,
        acknowledged: true,
        resolved: false,
    }),
    createAlarm({
        id: "alm-005",
        deviceId: "gw-001",
        deviceName: "EdgeGateway-A1",
        level: "info",
        message: "网关固件可升级到 v2.5.0",
        timestamp: Date.now() - 86400000,
        acknowledged: true,
        resolved: true,
    }),
    createAlarm({
        id: "alm-006",
        deviceId: "ctrl-001",
        deviceName: "Controller-车间1",
        level: "error",
        message: "Modbus 通讯重试 3 次失败",
        timestamp: Date.now() - 120000,
        acknowledged: false,
        resolved: false,
    }),
];
