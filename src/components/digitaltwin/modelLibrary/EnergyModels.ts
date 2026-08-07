/**
 * 数字孪生 - 能源设备模型库
 *
 * 包含：太阳能板 / 风力发电机 / 变压器 / 配电柜
 */
import type {DtModelPreset} from "../types";

/** 太阳能板 SolarPanel：面板 + 支架 + 立柱 */
const DT_SOLAR_PANEL_PRESET: DtModelPreset = {
    type: "solarPanel",
    labelKey: "digitaltwin.model.solarPanel",
    categoryKey: "digitaltwin.library.category.energy",
    icon: "Sunny",
    defaultColor: "#1890FF",
    defaultSize: {width: 100, height: 60, depth: 80, radius: 0},
    parts: [
        {
            id: "panel",
            type: "cube",
            offset: {x: 0, y: 50, z: 0},
            size: {width: 100, height: 4, depth: 70, radius: 0},
            color: "#1890FF",
            labelKey: "digitaltwin.part.panel"
        },
        {
            id: "support1",
            type: "cube",
            offset: {x: -40, y: 25, z: -25},
            size: {width: 4, height: 25, depth: 4, radius: 0},
            color: "#595959",
            labelKey: "digitaltwin.part.support"
        },
        {
            id: "support2",
            type: "cube",
            offset: {x: 40, y: 25, z: -25},
            size: {width: 4, height: 25, depth: 4, radius: 0},
            color: "#595959"
        },
        {
            id: "pillar",
            type: "cylinder",
            offset: {x: 0, y: 0, z: 0},
            size: {width: 0, height: 25, depth: 0, radius: 5},
            color: "#262626",
            labelKey: "digitaltwin.part.frame"
        },
    ],
    parameters: [
        {
            name: "power",
            labelKey: "digitaltwin.param.power",
            type: "number",
            default: 5,
            unitKey: "digitaltwin.property.unit.kilowatt"
        },
        {
            name: "angle",
            labelKey: "digitaltwin.param.angle",
            type: "number",
            default: 30,
            unitKey: "digitaltwin.property.unit.degree"
        },
    ],
    sensorMetrics: ["efficiency"],
};

/** 风力发电机 WindTurbine：塔筒 + 机舱 + 轮毂 + 3 叶片 */
const DT_WIND_TURBINE_PRESET: DtModelPreset = {
    type: "windTurbine",
    labelKey: "digitaltwin.model.windTurbine",
    categoryKey: "digitaltwin.library.category.energy",
    icon: "MagicStick",
    defaultColor: "#FFFFFF",
    defaultSize: {width: 120, height: 200, depth: 60, radius: 0},
    defaultAnimation: {type: "rotation", partId: "blade1", axis: "z", speed: 360},
    parts: [
        {
            id: "tower",
            type: "cylinder",
            offset: {x: 0, y: 0, z: 0},
            size: {width: 0, height: 150, depth: 0, radius: 8},
            color: "#F0F0F0",
            labelKey: "digitaltwin.part.tower"
        },
        {
            id: "nacelle",
            type: "cube",
            offset: {x: 0, y: 150, z: 0},
            size: {width: 30, height: 15, depth: 15, radius: 0},
            color: "#8C8C8C",
            labelKey: "digitaltwin.part.nacelle"
        },
        {
            id: "hub",
            type: "cylinder",
            offset: {x: 20, y: 157, z: 0},
            size: {width: 0, height: 8, depth: 0, radius: 5},
            color: "#595959",
            labelKey: "digitaltwin.part.hub"
        },
        {
            id: "blade1",
            type: "cube",
            offset: {x: 25, y: 157, z: 0},
            size: {width: 60, height: 4, depth: 8, radius: 0},
            color: "#FFFFFF",
            labelKey: "digitaltwin.part.blades",
            animatable: true
        },
        {
            id: "blade2",
            type: "cube",
            offset: {x: 25, y: 157, z: 0},
            size: {width: 60, height: 4, depth: 8, radius: 0},
            color: "#FFFFFF"
        },
        {
            id: "blade3",
            type: "cube",
            offset: {x: 25, y: 157, z: 0},
            size: {width: 60, height: 4, depth: 8, radius: 0},
            color: "#FFFFFF"
        },
    ],
    parameters: [
        {
            name: "power",
            labelKey: "digitaltwin.param.power",
            type: "number",
            default: 2,
            unitKey: "digitaltwin.property.unit.megawatt"
        },
        {
            name: "height",
            labelKey: "digitaltwin.param.height",
            type: "number",
            default: 80,
            unitKey: "digitaltwin.property.unit.meter"
        },
    ],
    sensorMetrics: ["speed", "efficiency"],
};

/** 变压器 Transformer：本体 + 8 散热片 + 3 套管 */
const DT_TRANSFORMER_PRESET: DtModelPreset = {
    type: "transformer",
    labelKey: "digitaltwin.model.transformer",
    categoryKey: "digitaltwin.library.category.energy",
    icon: "Lightning",
    defaultColor: "#722ED1",
    defaultSize: {width: 120, height: 80, depth: 80, radius: 0},
    parts: [
        {
            id: "body",
            type: "cube",
            offset: {x: 0, y: 0, z: 0},
            size: {width: 100, height: 60, depth: 60, radius: 0},
            color: "#722ED1",
            labelKey: "digitaltwin.part.body"
        },
        ...Array.from({length: 8}, (_, i) => ({
            id: `radiator${i + 1}`,
            type: "cube" as const,
            offset: {x: i < 4 ? -55 : 55, y: 10, z: -22 + (i % 4) * 15},
            size: {width: 10, height: 40, depth: 8, radius: 0},
            color: "#8C8C8C",
            labelKey: "digitaltwin.part.radiator",
        })),
        {
            id: "bushing1",
            type: "cylinder",
            offset: {x: -30, y: 60, z: 0},
            size: {width: 0, height: 25, depth: 0, radius: 6},
            color: "#595959",
            labelKey: "digitaltwin.part.bushings"
        },
        {
            id: "bushing2",
            type: "cylinder",
            offset: {x: 0, y: 60, z: 0},
            size: {width: 0, height: 25, depth: 0, radius: 6},
            color: "#595959"
        },
        {
            id: "bushing3",
            type: "cylinder",
            offset: {x: 30, y: 60, z: 0},
            size: {width: 0, height: 25, depth: 0, radius: 6},
            color: "#595959"
        },
    ],
    parameters: [
        {
            name: "capacity",
            labelKey: "digitaltwin.param.capacity",
            type: "number",
            default: 1000,
            unitKey: "digitaltwin.property.unit.kva"
        },
    ],
    sensorMetrics: ["temperature", "efficiency"],
};

/** 配电柜 DistributionBox：柜体 + 多开关 + 指示灯 */
const DT_DISTRIBUTION_BOX_PRESET: DtModelPreset = {
    type: "distributionBox",
    labelKey: "digitaltwin.model.distributionBox",
    categoryKey: "digitaltwin.library.category.energy",
    icon: "Operation",
    defaultColor: "#1890FF",
    defaultSize: {width: 60, height: 120, depth: 40, radius: 0},
    defaultAnimation: {type: "blink", partId: "led1", frequency: 1.5},
    parts: [
        {
            id: "cabinet",
            type: "cube",
            offset: {x: 0, y: 0, z: 0},
            size: {width: 60, height: 120, depth: 40, radius: 0},
            color: "#1890FF",
            labelKey: "digitaltwin.part.cabinet"
        },
        ...Array.from({length: 6}, (_, i) => ({
            id: `switch${i + 1}`,
            type: "cube" as const,
            offset: {x: -15 + (i % 3) * 15, y: 30 + Math.floor(i / 3) * 30, z: 20},
            size: {width: 10, height: 8, depth: 4, radius: 0},
            color: "#52C41A",
            labelKey: "digitaltwin.part.body",
        })),
        {
            id: "led1",
            type: "sphere",
            offset: {x: 20, y: 110, z: 20},
            size: {width: 0, height: 0, depth: 0, radius: 3},
            color: "#F5222D",
            labelKey: "digitaltwin.part.led",
            animatable: true
        },
        {
            id: "led2",
            type: "sphere",
            offset: {x: 20, y: 100, z: 20},
            size: {width: 0, height: 0, depth: 0, radius: 3},
            color: "#52C41A",
            labelKey: "digitaltwin.part.led"
        },
    ],
    parameters: [
        {
            name: "capacity",
            labelKey: "digitaltwin.param.capacity",
            type: "number",
            default: 200,
            unitKey: "digitaltwin.property.unit.kva"
        },
    ],
    sensorMetrics: ["temperature"],
};

/** 能源设备模型列表 */
export const DT_ENERGY_MODELS: DtModelPreset[] = [
    DT_SOLAR_PANEL_PRESET,
    DT_WIND_TURBINE_PRESET,
    DT_TRANSFORMER_PRESET,
    DT_DISTRIBUTION_BOX_PRESET,
];
