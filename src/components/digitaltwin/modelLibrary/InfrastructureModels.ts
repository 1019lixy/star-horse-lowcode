/**
 * 数字孪生 - 基础设施模型库
 *
 * 包含：厂房 / 管道 / 照明灯 / 围栏
 */
import type { DtModelPreset } from "../types";

/** 厂房 Workshop：4 墙体 + 屋顶 + 门 + 窗 */
const DT_WORKSHOP_PRESET: DtModelPreset = {
    type: "workshop",
    labelKey: "digitaltwin.model.workshop",
    categoryKey: "digitaltwin.library.category.infrastructure",
    icon: "House",
    defaultColor: "#8C8C8C",
    defaultSize: { width: 200, height: 100, depth: 160, radius: 0 },
    parts: [
        { id: "wallBack", type: "cube", offset: { x: 0, y: 0, z: -80 }, size: { width: 200, height: 100, depth: 4, radius: 0 }, color: "#D9D9D9", labelKey: "digitaltwin.part.frame" },
        { id: "wallLeft", type: "cube", offset: { x: -100, y: 0, z: 0 }, size: { width: 4, height: 100, depth: 160, radius: 0 }, color: "#D9D9D9" },
        { id: "wallRight", type: "cube", offset: { x: 100, y: 0, z: 0 }, size: { width: 4, height: 100, depth: 160, radius: 0 }, color: "#D9D9D9" },
        { id: "door", type: "cube", offset: { x: 0, y: 0, z: 80 }, size: { width: 40, height: 60, depth: 4, radius: 0 }, color: "#595959", labelKey: "digitaltwin.part.body" },
        { id: "roof", type: "plane", offset: { x: 0, y: 100, z: 0 }, size: { width: 200, height: 0, depth: 160, radius: 0 }, color: "#595959", labelKey: "digitaltwin.part.top" },
        { id: "window1", type: "cube", offset: { x: -60, y: 50, z: 80 }, size: { width: 20, height: 20, depth: 2, radius: 0 }, color: "#1890FF", labelKey: "digitaltwin.part.screen" },
        { id: "window2", type: "cube", offset: { x: 60, y: 50, z: 80 }, size: { width: 20, height: 20, depth: 2, radius: 0 }, color: "#1890FF" },
    ],
    parameters: [
        { name: "area", labelKey: "digitaltwin.param.area", type: "number", default: 1000, unitKey: "digitaltwin.property.unit.squareMeter" },
    ],
};

/** 管道 Pipeline：直管 + 法兰×2 */
const DT_PIPELINE_PRESET: DtModelPreset = {
    type: "pipeline",
    labelKey: "digitaltwin.model.pipeline",
    categoryKey: "digitaltwin.library.category.infrastructure",
    icon: "Connection",
    defaultColor: "#1890FF",
    defaultSize: { width: 100, height: 20, depth: 20, radius: 0 },
    parts: [
        { id: "pipe", type: "cylinder", offset: { x: 0, y: 10, z: 0 }, size: { width: 0, height: 80, depth: 0, radius: 10 }, color: "#1890FF", labelKey: "digitaltwin.part.body" },
        { id: "flange1", type: "cube", offset: { x: -45, y: 5, z: 0 }, size: { width: 10, height: 20, depth: 20, radius: 0 }, color: "#595959", labelKey: "digitaltwin.part.frame" },
        { id: "flange2", type: "cube", offset: { x: 45, y: 5, z: 0 }, size: { width: 10, height: 20, depth: 20, radius: 0 }, color: "#595959" },
    ],
    parameters: [
        { name: "length", labelKey: "digitaltwin.param.length", type: "number", default: 5, unitKey: "digitaltwin.property.unit.meter" },
        { name: "diameter", labelKey: "digitaltwin.param.diameter", type: "number", default: 100, unitKey: "digitaltwin.property.unit.millimeter" },
    ],
};

/** 照明灯 Lamp：灯杆 + 灯罩 + 灯泡 */
const DT_LAMP_PRESET: DtModelPreset = {
    type: "lamp",
    labelKey: "digitaltwin.model.lamp",
    categoryKey: "digitaltwin.library.category.infrastructure",
    icon: "Sunny",
    defaultColor: "#FAAD14",
    defaultSize: { width: 30, height: 100, depth: 30, radius: 0 },
    parts: [
        { id: "pole", type: "cylinder", offset: { x: 0, y: 0, z: 0 }, size: { width: 0, height: 80, depth: 0, radius: 4 }, color: "#595959", labelKey: "digitaltwin.part.frame" },
        { id: "shade", type: "cube", offset: { x: 0, y: 80, z: 0 }, size: { width: 25, height: 8, depth: 25, radius: 0 }, color: "#8C8C8C", labelKey: "digitaltwin.part.body" },
        { id: "bulb", type: "sphere", offset: { x: 0, y: 88, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 8 }, color: "#FAAD14", labelKey: "digitaltwin.part.led" },
    ],
    parameters: [
        { name: "power", labelKey: "digitaltwin.param.power", type: "number", default: 100, unitKey: "digitaltwin.property.unit.watt" },
    ],
};

/** 围栏 Fence：立柱×N + 横杆×N */
const DT_FENCE_PRESET: DtModelPreset = {
    type: "fence",
    labelKey: "digitaltwin.model.fence",
    categoryKey: "digitaltwin.library.category.infrastructure",
    icon: "Operation",
    defaultColor: "#52C41A",
    defaultSize: { width: 120, height: 50, depth: 4, radius: 0 },
    parts: [
        { id: "post1", type: "cylinder", offset: { x: -50, y: 0, z: 0 }, size: { width: 0, height: 50, depth: 0, radius: 3 }, color: "#595959", labelKey: "digitaltwin.part.frame" },
        { id: "post2", type: "cylinder", offset: { x: -17, y: 0, z: 0 }, size: { width: 0, height: 50, depth: 0, radius: 3 }, color: "#595959" },
        { id: "post3", type: "cylinder", offset: { x: 17, y: 0, z: 0 }, size: { width: 0, height: 50, depth: 0, radius: 3 }, color: "#595959" },
        { id: "post4", type: "cylinder", offset: { x: 50, y: 0, z: 0 }, size: { width: 0, height: 50, depth: 0, radius: 3 }, color: "#595959" },
        { id: "bar1", type: "cube", offset: { x: 0, y: 10, z: 0 }, size: { width: 110, height: 3, depth: 3, radius: 0 }, color: "#52C41A", labelKey: "digitaltwin.part.frame" },
        { id: "bar2", type: "cube", offset: { x: 0, y: 40, z: 0 }, size: { width: 110, height: 3, depth: 3, radius: 0 }, color: "#52C41A" },
    ],
    parameters: [
        { name: "length", labelKey: "digitaltwin.param.length", type: "number", default: 5, unitKey: "digitaltwin.property.unit.meter" },
    ],
};

/** 基础设施模型列表 */
export const DT_INFRASTRUCTURE_MODELS: DtModelPreset[] = [
    DT_WORKSHOP_PRESET,
    DT_PIPELINE_PRESET,
    DT_LAMP_PRESET,
    DT_FENCE_PRESET,
];
