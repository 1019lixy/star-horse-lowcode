/**
 * 数字孪生 - 数据中心模型库
 *
 * 包含：机柜 / 服务器 / UPS / 精密空调
 */
import type { DtModelPreset } from "../types";

/** 机柜 Rack：柜体 + 10 服务器 + 10 指示灯 */
const DT_SERVER_RACK_PRESET: DtModelPreset = {
  type: "serverRack",
  labelKey: "digitaltwin.model.serverRack",
  categoryKey: "digitaltwin.library.category.datacenter",
  icon: "Box",
  defaultColor: "#1890FF",
  defaultSize: { width: 60, height: 200, depth: 80, radius: 0 },
  defaultAnimation: { type: "blink", partId: "led1", frequency: 2 },
  parts: [
    {
      id: "cabinet",
      type: "cube",
      offset: { x: 0, y: 0, z: 0 },
      size: { width: 60, height: 200, depth: 80, radius: 0 },
      color: "#262626",
      labelKey: "digitaltwin.part.cabinet",
    },
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `server${i + 1}`,
      type: "cube" as const,
      offset: { x: 0, y: 10 + i * 18, z: 5 },
      size: { width: 50, height: 12, depth: 70, radius: 0 },
      color: "#595959",
      labelKey: "digitaltwin.part.body",
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `led${i + 1}`,
      type: "cube" as const,
      offset: { x: 20, y: 16 + i * 18, z: 40 },
      size: { width: 3, height: 3, depth: 3, radius: 0 },
      color: "#52C41A",
      labelKey: "digitaltwin.part.led",
      animatable: i === 0,
    })),
  ],
  parameters: [
    {
      name: "units",
      labelKey: "digitaltwin.param.units",
      type: "number",
      default: 42,
    },
  ],
  sensorMetrics: ["temperature", "efficiency"],
};

/** 服务器 Server：机身 + 面板 + 指示灯×2 */
const DT_SERVER_PRESET: DtModelPreset = {
  type: "server",
  labelKey: "digitaltwin.model.server",
  categoryKey: "digitaltwin.library.category.datacenter",
  icon: "Monitor",
  defaultColor: "#595959",
  defaultSize: { width: 60, height: 12, depth: 80, radius: 0 },
  parts: [
    {
      id: "body",
      type: "cube",
      offset: { x: 0, y: 0, z: 0 },
      size: { width: 60, height: 12, depth: 80, radius: 0 },
      color: "#595959",
      labelKey: "digitaltwin.part.body",
    },
    {
      id: "panel",
      type: "cube",
      offset: { x: 0, y: 6, z: 40 },
      size: { width: 50, height: 8, depth: 2, radius: 0 },
      color: "#262626",
      labelKey: "digitaltwin.part.screen",
    },
    {
      id: "led1",
      type: "cube",
      offset: { x: -20, y: 11, z: 40 },
      size: { width: 3, height: 2, depth: 2, radius: 0 },
      color: "#52C41A",
      labelKey: "digitaltwin.part.led",
      animatable: true,
    },
    {
      id: "led2",
      type: "cube",
      offset: { x: -15, y: 11, z: 40 },
      size: { width: 3, height: 2, depth: 2, radius: 0 },
      color: "#1890FF",
      labelKey: "digitaltwin.part.led",
    },
  ],
  parameters: [
    {
      name: "power",
      labelKey: "digitaltwin.param.power",
      type: "number",
      default: 500,
      unitKey: "digitaltwin.property.unit.watt",
    },
  ],
  sensorMetrics: ["temperature"],
};

/** UPS：柜体 + 电池组 + 显示屏 */
const DT_UPS_PRESET: DtModelPreset = {
  type: "ups",
  labelKey: "digitaltwin.model.ups",
  categoryKey: "digitaltwin.library.category.datacenter",
  icon: "Lightning",
  defaultColor: "#FAAD14",
  defaultSize: { width: 80, height: 120, depth: 60, radius: 0 },
  parts: [
    {
      id: "cabinet",
      type: "cube",
      offset: { x: 0, y: 0, z: 0 },
      size: { width: 80, height: 120, depth: 60, radius: 0 },
      color: "#FAAD14",
      labelKey: "digitaltwin.part.cabinet",
    },
    {
      id: "battery1",
      type: "cube",
      offset: { x: -25, y: 20, z: 0 },
      size: { width: 20, height: 60, depth: 40, radius: 0 },
      color: "#262626",
      labelKey: "digitaltwin.part.body",
    },
    {
      id: "battery2",
      type: "cube",
      offset: { x: -5, y: 20, z: 0 },
      size: { width: 20, height: 60, depth: 40, radius: 0 },
      color: "#262626",
    },
    {
      id: "battery3",
      type: "cube",
      offset: { x: 15, y: 20, z: 0 },
      size: { width: 20, height: 60, depth: 40, radius: 0 },
      color: "#262626",
    },
    {
      id: "battery4",
      type: "cube",
      offset: { x: 35, y: 20, z: 0 },
      size: { width: 20, height: 60, depth: 40, radius: 0 },
      color: "#262626",
    },
    {
      id: "screen",
      type: "cube",
      offset: { x: 0, y: 100, z: 30 },
      size: { width: 50, height: 15, depth: 2, radius: 0 },
      color: "#1890FF",
      labelKey: "digitaltwin.part.screen",
    },
  ],
  parameters: [
    {
      name: "capacity",
      labelKey: "digitaltwin.param.capacity",
      type: "number",
      default: 10,
      unitKey: "digitaltwin.property.unit.kva",
    },
  ],
  sensorMetrics: ["temperature", "efficiency"],
};

/** 精密空调 CRAC：柜体 + 风扇×2 + 显示屏 */
const DT_CRAC_PRESET: DtModelPreset = {
  type: "crac",
  labelKey: "digitaltwin.model.crac",
  categoryKey: "digitaltwin.library.category.datacenter",
  icon: "Cloudy",
  defaultColor: "#1890FF",
  defaultSize: { width: 80, height: 180, depth: 80, radius: 0 },
  defaultAnimation: { type: "rotation", partId: "fan1", axis: "y", speed: 720 },
  parts: [
    {
      id: "cabinet",
      type: "cube",
      offset: { x: 0, y: 0, z: 0 },
      size: { width: 80, height: 180, depth: 80, radius: 0 },
      color: "#1890FF",
      labelKey: "digitaltwin.part.cabinet",
    },
    {
      id: "fan1",
      type: "cylinder",
      offset: { x: -20, y: 140, z: 40 },
      size: { width: 0, height: 8, depth: 0, radius: 25 },
      color: "#8C8C8C",
      labelKey: "digitaltwin.part.fan",
      animatable: true,
    },
    {
      id: "fan2",
      type: "cylinder",
      offset: { x: 20, y: 140, z: 40 },
      size: { width: 0, height: 8, depth: 0, radius: 25 },
      color: "#8C8C8C",
      labelKey: "digitaltwin.part.fan",
    },
    {
      id: "screen",
      type: "cube",
      offset: { x: 0, y: 80, z: 40 },
      size: { width: 40, height: 15, depth: 2, radius: 0 },
      color: "#52C41A",
      labelKey: "digitaltwin.part.screen",
    },
  ],
  parameters: [
    {
      name: "power",
      labelKey: "digitaltwin.param.power",
      type: "number",
      default: 30,
      unitKey: "digitaltwin.property.unit.kilowatt",
    },
  ],
  sensorMetrics: ["temperature", "efficiency"],
};

/** 数据中心模型列表 */
export const DT_DATACENTER_MODELS: DtModelPreset[] = [
  DT_SERVER_RACK_PRESET,
  DT_SERVER_PRESET,
  DT_UPS_PRESET,
  DT_CRAC_PRESET,
];
