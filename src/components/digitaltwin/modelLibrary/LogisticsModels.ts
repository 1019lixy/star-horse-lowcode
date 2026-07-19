/**
 * 数字孪生 - 物流设备模型库
 *
 * 包含：传送带 / 堆垛机 / AGV / 货架
 */
import type { DtModelPreset } from "../types";

/** 传送带 Conveyor：框架 + 皮带 + 6 滚筒 + 2 支腿 */
const DT_CONVEYOR_PRESET: DtModelPreset = {
    type: "conveyor",
    labelKey: "digitaltwin.model.conveyor",
    categoryKey: "digitaltwin.library.category.logistics",
    icon: "Right",
    defaultColor: "#1890FF",
    defaultSize: { width: 200, height: 40, depth: 50, radius: 0 },
    defaultAnimation: { type: "rotation", partId: "roller1", axis: "x", speed: 360 },
    parts: [
        { id: "frame", type: "cube", offset: { x: 0, y: 20, z: 0 }, size: { width: 200, height: 6, depth: 40, radius: 0 }, color: "#595959", labelKey: "digitaltwin.part.frame" },
        { id: "belt", type: "cube", offset: { x: 0, y: 27, z: 0 }, size: { width: 190, height: 2, depth: 30, radius: 0 }, color: "#262626", labelKey: "digitaltwin.part.belt" },
        { id: "roller1", type: "cylinder", offset: { x: -80, y: 26, z: 0 }, size: { width: 0, height: 30, depth: 0, radius: 8 }, color: "#8C8C8C", labelKey: "digitaltwin.part.rollers", animatable: true },
        { id: "roller2", type: "cylinder", offset: { x: -48, y: 26, z: 0 }, size: { width: 0, height: 30, depth: 0, radius: 8 }, color: "#8C8C8C" },
        { id: "roller3", type: "cylinder", offset: { x: -16, y: 26, z: 0 }, size: { width: 0, height: 30, depth: 0, radius: 8 }, color: "#8C8C8C" },
        { id: "roller4", type: "cylinder", offset: { x: 16, y: 26, z: 0 }, size: { width: 0, height: 30, depth: 0, radius: 8 }, color: "#8C8C8C" },
        { id: "roller5", type: "cylinder", offset: { x: 48, y: 26, z: 0 }, size: { width: 0, height: 30, depth: 0, radius: 8 }, color: "#8C8C8C" },
        { id: "roller6", type: "cylinder", offset: { x: 80, y: 26, z: 0 }, size: { width: 0, height: 30, depth: 0, radius: 8 }, color: "#8C8C8C" },
        { id: "leg1", type: "cube", offset: { x: -80, y: 0, z: 0 }, size: { width: 6, height: 20, depth: 30, radius: 0 }, color: "#595959", labelKey: "digitaltwin.part.legs" },
        { id: "leg2", type: "cube", offset: { x: 80, y: 0, z: 0 }, size: { width: 6, height: 20, depth: 30, radius: 0 }, color: "#595959" },
    ],
    parameters: [
        { name: "length", labelKey: "digitaltwin.param.length", type: "number", default: 5, unitKey: "digitaltwin.property.unit.meter" },
        { name: "speed", labelKey: "digitaltwin.param.speed", type: "number", default: 1.5, unitKey: "digitaltwin.property.unit.meterPerSecond" },
    ],
    sensorMetrics: ["speed", "efficiency"],
};

/** 堆垛机 Stacker：立柱 + 横梁 + 货叉 + 载货台 */
const DT_STACKER_PRESET: DtModelPreset = {
    type: "stacker",
    labelKey: "digitaltwin.model.stacker",
    categoryKey: "digitaltwin.library.category.logistics",
    icon: "Rank",
    defaultColor: "#FAAD14",
    defaultSize: { width: 60, height: 200, depth: 60, radius: 0 },
    defaultAnimation: { type: "translation", partId: "carrier", translateAxis: "y", range: 120, translateSpeed: 0.5 },
    parts: [
        { id: "pillar", type: "cube", offset: { x: 0, y: 0, z: 0 }, size: { width: 10, height: 200, depth: 10, radius: 0 }, color: "#FAAD14", labelKey: "digitaltwin.part.frame" },
        { id: "beam", type: "cube", offset: { x: 20, y: 195, z: 0 }, size: { width: 50, height: 6, depth: 10, radius: 0 }, color: "#595959", labelKey: "digitaltwin.part.frame" },
        { id: "carrier", type: "cube", offset: { x: 25, y: 100, z: 0 }, size: { width: 30, height: 15, depth: 30, radius: 0 }, color: "#1890FF", labelKey: "digitaltwin.part.body", animatable: true },
        { id: "fork", type: "cube", offset: { x: 45, y: 92, z: 0 }, size: { width: 25, height: 4, depth: 25, radius: 0 }, color: "#8C8C8C", labelKey: "digitaltwin.part.frame" },
        { id: "base", type: "cube", offset: { x: 0, y: 0, z: 0 }, size: { width: 30, height: 8, depth: 30, radius: 0 }, color: "#262626", labelKey: "digitaltwin.part.base" },
    ],
    parameters: [
        { name: "height", labelKey: "digitaltwin.param.height", type: "number", default: 10, unitKey: "digitaltwin.property.unit.meter" },
    ],
    sensorMetrics: ["speed"],
};

/** AGV：车体 + 4 轮子 + 货架 */
const DT_AGV_PRESET: DtModelPreset = {
    type: "agv",
    labelKey: "digitaltwin.model.agv",
    categoryKey: "digitaltwin.library.category.logistics",
    icon: "Position",
    defaultColor: "#722ED1",
    defaultSize: { width: 80, height: 60, depth: 80, radius: 0 },
    defaultAnimation: { type: "translation", partId: "body", translateAxis: "x", range: 50, translateSpeed: 0.3 },
    parts: [
        { id: "body", type: "cube", offset: { x: 0, y: 15, z: 0 }, size: { width: 60, height: 20, depth: 60, radius: 0 }, color: "#722ED1", labelKey: "digitaltwin.part.body", animatable: true },
        { id: "wheel1", type: "cylinder", offset: { x: -25, y: 5, z: -25 }, size: { width: 0, height: 8, depth: 0, radius: 8 }, color: "#262626", labelKey: "digitaltwin.part.rollers" },
        { id: "wheel2", type: "cylinder", offset: { x: 25, y: 5, z: -25 }, size: { width: 0, height: 8, depth: 0, radius: 8 }, color: "#262626" },
        { id: "wheel3", type: "cylinder", offset: { x: -25, y: 5, z: 25 }, size: { width: 0, height: 8, depth: 0, radius: 8 }, color: "#262626" },
        { id: "wheel4", type: "cylinder", offset: { x: 25, y: 5, z: 25 }, size: { width: 0, height: 8, depth: 0, radius: 8 }, color: "#262626" },
        { id: "shelf", type: "cube", offset: { x: 0, y: 35, z: 0 }, size: { width: 50, height: 25, depth: 50, radius: 0 }, color: "#1890FF", labelKey: "digitaltwin.part.frame" },
    ],
    parameters: [
        { name: "speed", labelKey: "digitaltwin.param.speed", type: "number", default: 1.0, unitKey: "digitaltwin.property.unit.meterPerSecond" },
    ],
    sensorMetrics: ["speed", "efficiency"],
};

/** 货架 Rack：4 立柱 + 多层横梁 + 货物 */
const DT_RACK_SHELF_PRESET: DtModelPreset = {
    type: "rackShelf",
    labelKey: "digitaltwin.model.rack.shelf",
    categoryKey: "digitaltwin.library.category.logistics",
    icon: "Grid",
    defaultColor: "#FA8C16",
    defaultSize: { width: 120, height: 120, depth: 50, radius: 0 },
    parts: [
        { id: "pillar1", type: "cube", offset: { x: -55, y: 0, z: -20 }, size: { width: 6, height: 120, depth: 6, radius: 0 }, color: "#FA8C16", labelKey: "digitaltwin.part.frame" },
        { id: "pillar2", type: "cube", offset: { x: 55, y: 0, z: -20 }, size: { width: 6, height: 120, depth: 6, radius: 0 }, color: "#FA8C16" },
        { id: "pillar3", type: "cube", offset: { x: -55, y: 0, z: 20 }, size: { width: 6, height: 120, depth: 6, radius: 0 }, color: "#FA8C16" },
        { id: "pillar4", type: "cube", offset: { x: 55, y: 0, z: 20 }, size: { width: 6, height: 120, depth: 6, radius: 0 }, color: "#FA8C16" },
        { id: "beam1", type: "cube", offset: { x: 0, y: 30, z: 0 }, size: { width: 120, height: 4, depth: 50, radius: 0 }, color: "#595959", labelKey: "digitaltwin.part.frame" },
        { id: "beam2", type: "cube", offset: { x: 0, y: 60, z: 0 }, size: { width: 120, height: 4, depth: 50, radius: 0 }, color: "#595959" },
        { id: "beam3", type: "cube", offset: { x: 0, y: 90, z: 0 }, size: { width: 120, height: 4, depth: 50, radius: 0 }, color: "#595959" },
        { id: "cargo1", type: "cube", offset: { x: 0, y: 34, z: 0 }, size: { width: 40, height: 25, depth: 40, radius: 0 }, color: "#52C41A", labelKey: "digitaltwin.part.body" },
        { id: "cargo2", type: "cube", offset: { x: -40, y: 64, z: 0 }, size: { width: 30, height: 22, depth: 40, radius: 0 }, color: "#1890FF" },
    ],
    parameters: [
        { name: "layers", labelKey: "digitaltwin.param.layers", type: "number", default: 3 },
    ],
};

/** 物流设备模型列表 */
export const DT_LOGISTICS_MODELS: DtModelPreset[] = [
    DT_CONVEYOR_PRESET,
    DT_STACKER_PRESET,
    DT_AGV_PRESET,
    DT_RACK_SHELF_PRESET,
];
