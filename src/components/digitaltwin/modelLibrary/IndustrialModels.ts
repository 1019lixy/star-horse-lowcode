/**
 * 数字孪生 - 工业设备模型库
 *
 * 包含：泵 / 阀门 / 储罐 / 换热器 / 反应釜 / 压缩机 / 锅炉 / 冷却塔
 * 每个模型由多个基础几何体（parts）组合而成
 */
import type { DtModelPreset } from "../types";

/** 泵 Pump：底座 + 泵体 + 电机 + 进水口 + 出水口 */
const DT_PUMP_PRESET: DtModelPreset = {
    type: "pump",
    labelKey: "digitaltwin.model.pump",
    categoryKey: "digitaltwin.library.category.industrial",
    icon: "Cpu",
    defaultColor: "#1890FF",
    defaultSize: { width: 80, height: 80, depth: 80, radius: 0 },
    defaultAnimation: { type: "rotation", partId: "motor", axis: "y", speed: 180 },
    parts: [
        { id: "base", type: "cube", offset: { x: 0, y: 0, z: 0 }, size: { width: 70, height: 10, depth: 70, radius: 0 }, color: "#595959", labelKey: "digitaltwin.part.base" },
        { id: "body", type: "cylinder", offset: { x: -10, y: 10, z: 0 }, size: { width: 0, height: 40, depth: 0, radius: 22 }, color: "#1890FF", labelKey: "digitaltwin.part.body" },
        { id: "motor", type: "cube", offset: { x: 25, y: 15, z: 0 }, size: { width: 30, height: 30, depth: 30, radius: 0 }, color: "#722ED1", labelKey: "digitaltwin.part.motor", animatable: true },
        { id: "inlet", type: "cylinder", offset: { x: -35, y: 20, z: 0 }, size: { width: 0, height: 20, depth: 0, radius: 8 }, color: "#13C2C2", labelKey: "digitaltwin.part.inlet" },
        { id: "outlet", type: "cylinder", offset: { x: -10, y: 50, z: 0 }, size: { width: 0, height: 20, depth: 0, radius: 8 }, color: "#13C2C2", labelKey: "digitaltwin.part.outlet" },
    ],
    parameters: [
        { name: "capacity", labelKey: "digitaltwin.param.capacity", type: "number", default: 50, unitKey: "digitaltwin.property.unit.cubic" },
        { name: "power", labelKey: "digitaltwin.param.power", type: "number", default: 15, unitKey: "digitaltwin.property.unit.kilowatt" },
    ],
    sensorMetrics: ["temperature", "pressure", "speed"],
};

/** 阀门 Valve：阀体 + 阀杆 + 手轮 + 左管口 + 右管口 */
const DT_VALVE_PRESET: DtModelPreset = {
    type: "valve",
    labelKey: "digitaltwin.model.valve",
    categoryKey: "digitaltwin.library.category.industrial",
    icon: "Switch",
    defaultColor: "#52C41A",
    defaultSize: { width: 80, height: 80, depth: 60, radius: 0 },
    defaultAnimation: { type: "rotation", partId: "wheel", axis: "y", speed: 90 },
    parts: [
        { id: "body", type: "cube", offset: { x: 0, y: 0, z: 0 }, size: { width: 50, height: 40, depth: 40, radius: 0 }, color: "#52C41A", labelKey: "digitaltwin.part.body" },
        { id: "stem", type: "cylinder", offset: { x: 0, y: 40, z: 0 }, size: { width: 0, height: 25, depth: 0, radius: 5 }, color: "#8C8C8C", labelKey: "digitaltwin.part.stem" },
        { id: "wheel", type: "cylinder", offset: { x: 0, y: 65, z: 0 }, size: { width: 0, height: 8, depth: 0, radius: 18 }, color: "#FAAD14", labelKey: "digitaltwin.part.wheel", animatable: true },
        { id: "leftPort", type: "cylinder", offset: { x: -35, y: 20, z: 0 }, size: { width: 0, height: 20, depth: 0, radius: 12 }, color: "#1890FF", labelKey: "digitaltwin.part.inlet" },
        { id: "rightPort", type: "cylinder", offset: { x: 35, y: 20, z: 0 }, size: { width: 0, height: 20, depth: 0, radius: 12 }, color: "#1890FF", labelKey: "digitaltwin.part.outlet" },
    ],
    parameters: [
        { name: "diameter", labelKey: "digitaltwin.param.diameter", type: "number", default: 100, unitKey: "digitaltwin.property.unit.millimeter" },
        { name: "valveType", labelKey: "digitaltwin.param.type", type: "select", default: "manual", options: [{ label: "manual", value: "manual" }, { label: "auto", value: "auto" }] },
    ],
    sensorMetrics: ["pressure"],
};

/** 储罐 Tank：罐体 + 顶盖 + 4 支腿 + 进料口 + 出料口 */
const DT_TANK_PRESET: DtModelPreset = {
    type: "tank",
    labelKey: "digitaltwin.model.tank",
    categoryKey: "digitaltwin.library.category.industrial",
    icon: "Coin",
    defaultColor: "#13C2C2",
    defaultSize: { width: 80, height: 120, depth: 80, radius: 0 },
    defaultAnimation: { type: "color", partId: "body", frequency: 0.5 },
    parts: [
        { id: "body", type: "cylinder", offset: { x: 0, y: 15, z: 0 }, size: { width: 0, height: 80, depth: 0, radius: 30 }, color: "#13C2C2", labelKey: "digitaltwin.part.body", animatable: true },
        { id: "top", type: "sphere", offset: { x: 0, y: 95, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 30 }, color: "#722ED1", labelKey: "digitaltwin.part.top" },
        { id: "leg1", type: "cylinder", offset: { x: -22, y: 0, z: -22 }, size: { width: 0, height: 15, depth: 0, radius: 4 }, color: "#595959", labelKey: "digitaltwin.part.legs" },
        { id: "leg2", type: "cylinder", offset: { x: 22, y: 0, z: -22 }, size: { width: 0, height: 15, depth: 0, radius: 4 }, color: "#595959" },
        { id: "leg3", type: "cylinder", offset: { x: -22, y: 0, z: 22 }, size: { width: 0, height: 15, depth: 0, radius: 4 }, color: "#595959" },
        { id: "leg4", type: "cylinder", offset: { x: 22, y: 0, z: 22 }, size: { width: 0, height: 15, depth: 0, radius: 4 }, color: "#595959" },
        { id: "inlet", type: "cylinder", offset: { x: 0, y: 95, z: 0 }, size: { width: 0, height: 15, depth: 0, radius: 6 }, color: "#1890FF", labelKey: "digitaltwin.part.inlet" },
        { id: "outlet", type: "cylinder", offset: { x: 0, y: 15, z: 30 }, size: { width: 0, height: 15, depth: 0, radius: 6 }, color: "#52C41A", labelKey: "digitaltwin.part.outlet" },
    ],
    parameters: [
        { name: "capacity", labelKey: "digitaltwin.param.capacity", type: "number", default: 50, unitKey: "digitaltwin.property.unit.cubic" },
        { name: "level", labelKey: "digitaltwin.param.level", type: "number", default: 60, unitKey: "digitaltwin.property.unit.percent" },
    ],
    sensorMetrics: ["pressure", "efficiency"],
};

/** 换热器 HeatExchanger：外壳 + 两端封头 + 4 接管 */
const DT_HEAT_EXCHANGER_PRESET: DtModelPreset = {
    type: "heatExchanger",
    labelKey: "digitaltwin.model.heatExchanger",
    categoryKey: "digitaltwin.library.category.industrial",
    icon: "Connection",
    defaultColor: "#FAAD14",
    defaultSize: { width: 140, height: 60, depth: 60, radius: 0 },
    parts: [
        { id: "shell", type: "cylinder", offset: { x: 0, y: 30, z: 0 }, size: { width: 0, height: 50, depth: 0, radius: 22 }, color: "#FAAD14", labelKey: "digitaltwin.part.body" },
        { id: "head1", type: "sphere", offset: { x: -50, y: 30, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 22 }, color: "#F5222D", labelKey: "digitaltwin.part.top" },
        { id: "head2", type: "sphere", offset: { x: 50, y: 30, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 22 }, color: "#F5222D" },
        { id: "nozzle1", type: "cylinder", offset: { x: -50, y: 60, z: 0 }, size: { width: 0, height: 20, depth: 0, radius: 8 }, color: "#1890FF", labelKey: "digitaltwin.part.inlet" },
        { id: "nozzle2", type: "cylinder", offset: { x: 50, y: 60, z: 0 }, size: { width: 0, height: 20, depth: 0, radius: 8 }, color: "#52C41A", labelKey: "digitaltwin.part.outlet" },
        { id: "nozzle3", type: "cylinder", offset: { x: 0, y: 60, z: -22 }, size: { width: 0, height: 20, depth: 0, radius: 6 }, color: "#13C2C2" },
        { id: "nozzle4", type: "cylinder", offset: { x: 0, y: 60, z: 22 }, size: { width: 0, height: 20, depth: 0, radius: 6 }, color: "#13C2C2" },
        { id: "support1", type: "cube", offset: { x: -35, y: 0, z: 0 }, size: { width: 10, height: 30, depth: 20, radius: 0 }, color: "#595959", labelKey: "digitaltwin.part.base" },
        { id: "support2", type: "cube", offset: { x: 35, y: 0, z: 0 }, size: { width: 10, height: 30, depth: 20, radius: 0 }, color: "#595959" },
    ],
    parameters: [
        { name: "area", labelKey: "digitaltwin.param.area", type: "number", default: 20, unitKey: "digitaltwin.property.unit.squareMeter" },
    ],
    sensorMetrics: ["temperature", "efficiency"],
};

/** 反应釜 Reactor：罐体 + 顶盖 + 搅拌轴 + 搅拌叶片 + 4 支腿 */
const DT_REACTOR_PRESET: DtModelPreset = {
    type: "reactor",
    labelKey: "digitaltwin.model.reactor",
    categoryKey: "digitaltwin.library.category.industrial",
    icon: "MagicStick",
    defaultColor: "#722ED1",
    defaultSize: { width: 80, height: 140, depth: 80, radius: 0 },
    defaultAnimation: { type: "rotation", partId: "blade1", axis: "y", speed: 360 },
    parts: [
        { id: "body", type: "cylinder", offset: { x: 0, y: 15, z: 0 }, size: { width: 0, height: 90, depth: 0, radius: 30 }, color: "#722ED1", labelKey: "digitaltwin.part.body" },
        { id: "top", type: "sphere", offset: { x: 0, y: 105, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 30 }, color: "#1890FF", labelKey: "digitaltwin.part.top" },
        { id: "shaft", type: "cylinder", offset: { x: 0, y: 30, z: 0 }, size: { width: 0, height: 80, depth: 0, radius: 3 }, color: "#8C8C8C", labelKey: "digitaltwin.part.stem" },
        { id: "blade1", type: "cube", offset: { x: 0, y: 40, z: 0 }, size: { width: 50, height: 4, depth: 6, radius: 0 }, color: "#FAAD14", labelKey: "digitaltwin.part.blades", animatable: true },
        { id: "blade2", type: "cube", offset: { x: 0, y: 60, z: 0 }, size: { width: 6, height: 4, depth: 50, radius: 0 }, color: "#FAAD14" },
        { id: "leg1", type: "cylinder", offset: { x: -25, y: 0, z: -25 }, size: { width: 0, height: 15, depth: 0, radius: 4 }, color: "#595959", labelKey: "digitaltwin.part.legs" },
        { id: "leg2", type: "cylinder", offset: { x: 25, y: 0, z: -25 }, size: { width: 0, height: 15, depth: 0, radius: 4 }, color: "#595959" },
        { id: "leg3", type: "cylinder", offset: { x: -25, y: 0, z: 25 }, size: { width: 0, height: 15, depth: 0, radius: 4 }, color: "#595959" },
        { id: "leg4", type: "cylinder", offset: { x: 25, y: 0, z: 25 }, size: { width: 0, height: 15, depth: 0, radius: 4 }, color: "#595959" },
    ],
    parameters: [
        { name: "volume", labelKey: "digitaltwin.param.volume", type: "number", default: 500, unitKey: "digitaltwin.property.unit.liter" },
        { name: "rpm", labelKey: "digitaltwin.param.rpm", type: "number", default: 60, unitKey: "digitaltwin.property.unit.rpm" },
    ],
    sensorMetrics: ["temperature", "pressure", "speed"],
};

/** 压缩机 Compressor：底座 + 机体 + 电机 + 进排气口 */
const DT_COMPRESSOR_PRESET: DtModelPreset = {
    type: "compressor",
    labelKey: "digitaltwin.model.compressor",
    categoryKey: "digitaltwin.library.category.industrial",
    icon: "Promotion",
    defaultColor: "#F5222D",
    defaultSize: { width: 100, height: 70, depth: 70, radius: 0 },
    defaultAnimation: { type: "rotation", partId: "motor", axis: "y", speed: 1440 },
    parts: [
        { id: "base", type: "cube", offset: { x: 0, y: 0, z: 0 }, size: { width: 90, height: 10, depth: 70, radius: 0 }, color: "#595959", labelKey: "digitaltwin.part.base" },
        { id: "body", type: "cube", offset: { x: -15, y: 10, z: 0 }, size: { width: 45, height: 50, depth: 50, radius: 0 }, color: "#F5222D", labelKey: "digitaltwin.part.body" },
        { id: "motor", type: "cube", offset: { x: 30, y: 15, z: 0 }, size: { width: 30, height: 40, depth: 40, radius: 0 }, color: "#722ED1", labelKey: "digitaltwin.part.motor", animatable: true },
        { id: "intake", type: "cylinder", offset: { x: -50, y: 30, z: 0 }, size: { width: 0, height: 25, depth: 0, radius: 10 }, color: "#13C2C2", labelKey: "digitaltwin.part.inlet" },
        { id: "exhaust", type: "cylinder", offset: { x: -15, y: 60, z: 0 }, size: { width: 0, height: 20, depth: 0, radius: 10 }, color: "#FAAD14", labelKey: "digitaltwin.part.outlet" },
    ],
    parameters: [
        { name: "power", labelKey: "digitaltwin.param.power", type: "number", default: 75, unitKey: "digitaltwin.property.unit.kilowatt" },
    ],
    sensorMetrics: ["temperature", "pressure", "speed"],
};

/** 锅炉 Boiler：筒体 + 顶盖 + 底座 + 烟囱 */
const DT_BOILER_PRESET: DtModelPreset = {
    type: "boiler",
    labelKey: "digitaltwin.model.boiler",
    categoryKey: "digitaltwin.library.category.industrial",
    icon: "Histogram",
    defaultColor: "#FA8C16",
    defaultSize: { width: 80, height: 130, depth: 80, radius: 0 },
    parts: [
        { id: "base", type: "cube", offset: { x: 0, y: 0, z: 0 }, size: { width: 70, height: 10, depth: 70, radius: 0 }, color: "#595959", labelKey: "digitaltwin.part.base" },
        { id: "shell", type: "cylinder", offset: { x: 0, y: 10, z: 0 }, size: { width: 0, height: 90, depth: 0, radius: 30 }, color: "#FA8C16", labelKey: "digitaltwin.part.body" },
        { id: "top", type: "sphere", offset: { x: 0, y: 100, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 30 }, color: "#F5222D", labelKey: "digitaltwin.part.top" },
        { id: "chimney", type: "cylinder", offset: { x: 20, y: 100, z: 0 }, size: { width: 0, height: 30, depth: 0, radius: 6 }, color: "#595959", labelKey: "digitaltwin.part.outlet" },
    ],
    parameters: [
        { name: "capacity", labelKey: "digitaltwin.param.capacity", type: "number", default: 10, unitKey: "digitaltwin.property.unit.tonPerHour" },
    ],
    sensorMetrics: ["temperature", "pressure"],
};

/** 冷却塔 CoolingTower：底座 + 塔体 + 顶盖 + 风机 */
const DT_COOLING_TOWER_PRESET: DtModelPreset = {
    type: "coolingTower",
    labelKey: "digitaltwin.model.coolingTower",
    categoryKey: "digitaltwin.library.category.industrial",
    icon: "Umbrella",
    defaultColor: "#13C2C2",
    defaultSize: { width: 80, height: 110, depth: 80, radius: 0 },
    defaultAnimation: { type: "rotation", partId: "fan", axis: "y", speed: 720 },
    parts: [
        { id: "base", type: "cube", offset: { x: 0, y: 0, z: 0 }, size: { width: 70, height: 10, depth: 70, radius: 0 }, color: "#595959", labelKey: "digitaltwin.part.base" },
        { id: "shell", type: "cylinder", offset: { x: 0, y: 10, z: 0 }, size: { width: 0, height: 70, depth: 0, radius: 30 }, color: "#13C2C2", labelKey: "digitaltwin.part.body" },
        { id: "top", type: "sphere", offset: { x: 0, y: 80, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 25 }, color: "#722ED1", labelKey: "digitaltwin.part.top" },
        { id: "fan", type: "cylinder", offset: { x: 0, y: 80, z: 0 }, size: { width: 0, height: 8, depth: 0, radius: 22 }, color: "#FAAD14", labelKey: "digitaltwin.part.fan", animatable: true },
    ],
    parameters: [
        { name: "capacity", labelKey: "digitaltwin.param.capacity", type: "number", default: 100, unitKey: "digitaltwin.property.unit.cubic" },
    ],
    sensorMetrics: ["temperature", "efficiency"],
};

/** 工业设备模型列表 */
export const DT_INDUSTRIAL_MODELS: DtModelPreset[] = [
    DT_PUMP_PRESET,
    DT_VALVE_PRESET,
    DT_TANK_PRESET,
    DT_HEAT_EXCHANGER_PRESET,
    DT_REACTOR_PRESET,
    DT_COMPRESSOR_PRESET,
    DT_BOILER_PRESET,
    DT_COOLING_TOWER_PRESET,
];
