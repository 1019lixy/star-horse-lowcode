import { Check, Delete, Download, FolderOpened, QuestionFilled, VideoPause, VideoPlay } from "@element-plus/icons-vue";
import type { DtScene } from "@/components/digitaltwin";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * 工厂场景示例
 *
 * 8 个实体：地面（平面）+ 厂房（立方体-正常）+ 设备A（立方体-警告）+ 设备B（立方体-报警）
 * + 储罐1/2/3（圆柱-正常/警告/离线）+ 监测球（球体-正常）
 */
export const SAMPLE_DT_SCENE: DtScene = {
    id: "dt_factory_demo",
    name: "工厂场景",
    entities: [
        {
            id: "dt_ground",
            type: "plane",
            name: "工厂地面",
            position: { x: 0, y: 0, z: 0 },
            size: { width: 500, height: 0, depth: 500, radius: 0 },
            color: "#D9D9D9",
            status: "normal",
            properties: {},
            sensorData: {},
            visible: true,
        },
        {
            id: "dt_factory",
            type: "cube",
            name: "主厂房",
            position: { x: -120, y: 0, z: -80 },
            size: { width: 160, height: 100, depth: 120, radius: 0 },
            color: "#1890FF",
            status: "normal",
            properties: { area: "1200㎡" },
            sensorData: {
                temperature: { labelKey: "digitaltwin.property.metric.temperature", unitKey: "digitaltwin.property.unit.celsius", value: 45 },
                speed: { labelKey: "digitaltwin.property.metric.speed", unitKey: "digitaltwin.property.unit.rpm", value: 1500 },
                power: { labelKey: "digitaltwin.property.metric.power", unitKey: "digitaltwin.property.unit.watt", value: 1200 },
            },
            visible: true,
        },
        {
            id: "dt_device_a",
            type: "cube",
            name: "设备 A",
            position: { x: 80, y: 0, z: 60 },
            size: { width: 50, height: 60, depth: 50, radius: 0 },
            color: "#FAAD14",
            status: "warning",
            properties: { model: "DEV-A001" },
            sensorData: {
                temperature: { labelKey: "digitaltwin.property.metric.temperature", unitKey: "digitaltwin.property.unit.celsius", value: 72 },
                speed: { labelKey: "digitaltwin.property.metric.speed", unitKey: "digitaltwin.property.unit.rpm", value: 2400 },
                power: { labelKey: "digitaltwin.property.metric.power", unitKey: "digitaltwin.property.unit.watt", value: 1800 },
            },
            visible: true,
        },
        {
            id: "dt_device_b",
            type: "cube",
            name: "设备 B",
            position: { x: 160, y: 0, z: 60 },
            size: { width: 50, height: 60, depth: 50, radius: 0 },
            color: "#F5222D",
            status: "alarm",
            properties: { model: "DEV-B002" },
            sensorData: {
                temperature: { labelKey: "digitaltwin.property.metric.temperature", unitKey: "digitaltwin.property.unit.celsius", value: 88 },
                speed: { labelKey: "digitaltwin.property.metric.speed", unitKey: "digitaltwin.property.unit.rpm", value: 2900 },
                power: { labelKey: "digitaltwin.property.metric.power", unitKey: "digitaltwin.property.unit.watt", value: 1950 },
            },
            visible: true,
        },
        {
            id: "dt_tank_1",
            type: "cylinder",
            name: "储罐 1",
            position: { x: -180, y: 0, z: 100 },
            size: { width: 0, height: 90, depth: 0, radius: 30 },
            color: "#52C41A",
            status: "normal",
            properties: { capacity: "50m³" },
            sensorData: {
                pressure: { labelKey: "digitaltwin.property.metric.pressure", unitKey: "digitaltwin.property.unit.pascal", value: 220 },
                efficiency: { labelKey: "digitaltwin.property.metric.efficiency", unitKey: "digitaltwin.property.unit.percent", value: 88 },
            },
            visible: true,
        },
        {
            id: "dt_tank_2",
            type: "cylinder",
            name: "储罐 2",
            position: { x: -100, y: 0, z: 100 },
            size: { width: 0, height: 90, depth: 0, radius: 30 },
            color: "#FAAD14",
            status: "warning",
            properties: { capacity: "50m³" },
            sensorData: {
                pressure: { labelKey: "digitaltwin.property.metric.pressure", unitKey: "digitaltwin.property.unit.pascal", value: 380 },
                efficiency: { labelKey: "digitaltwin.property.metric.efficiency", unitKey: "digitaltwin.property.unit.percent", value: 72 },
            },
            visible: true,
        },
        {
            id: "dt_tank_3",
            type: "cylinder",
            name: "储罐 3",
            position: { x: -20, y: 0, z: 100 },
            size: { width: 0, height: 90, depth: 0, radius: 30 },
            color: "#722ED1",
            status: "offline",
            properties: { capacity: "50m³" },
            sensorData: {
                pressure: { labelKey: "digitaltwin.property.metric.pressure", unitKey: "digitaltwin.property.unit.pascal", value: 0 },
                efficiency: { labelKey: "digitaltwin.property.metric.efficiency", unitKey: "digitaltwin.property.unit.percent", value: 0 },
            },
            visible: true,
        },
        {
            id: "dt_decoration",
            type: "sphere",
            name: "监测球",
            position: { x: 200, y: 120, z: -100 },
            size: { width: 0, height: 0, depth: 0, radius: 20 },
            color: "#13C2C2",
            status: "normal",
            properties: { type: "环境监测" },
            sensorData: {
                temperature: { labelKey: "digitaltwin.property.metric.temperature", unitKey: "digitaltwin.property.unit.celsius", value: 28 },
            },
            visible: true,
        },
    ],
};

/** 空场景 */
export const EMPTY_DT_SCENE: DtScene = { id: "dt_empty", name: "空场景", entities: [] };

/**
 * DigitalTwinDemo 主操作（左侧）
 *
 * 底层 DigitalTwinDesigner 已有 DtToolbar（视角预设等），demo 工具栏管"数据生命周期+模拟开关"
 */
export const DT_ACTIONS: ShDemoAction[] = [
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.digitaltwin.toolbar.loadSample", group: "data" },
    { key: "clear", icon: Delete, labelKey: "advanced.digitaltwin.toolbar.clear", type: "danger", group: "data" },
    { key: "exportJson", icon: Download, tooltipKey: "advanced.digitaltwin.toolbar.exportJson", iconOnly: true, group: "data" },
    { key: "save", icon: Check, labelKey: "advanced.digitaltwin.toolbar.save", type: "primary" },
];

/**
 * DigitalTwinDemo 次要操作（右侧）
 *
 * toggleAutoSim 响应式切换图标：active 时 VideoPause，非 active 时 VideoPlay
 */
export const DT_SECONDARY: ShDemoAction[] = [
    { key: "toggleAutoSim", icon: VideoPlay, tooltipKey: "advanced.digitaltwin.toolbar.toggleAutoSim", iconOnly: true, active: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.digitaltwin.toolbar.help", iconOnly: true },
];

/** 根据模拟状态返回正确的图标 */
export function getAutoSimIcon(running: boolean): typeof VideoPlay {
    return running ? VideoPause : VideoPlay;
}
