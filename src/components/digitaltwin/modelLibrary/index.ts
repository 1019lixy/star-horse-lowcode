/**
 * 数字孪生 - 模型库聚合导出
 *
 * 汇总所有分类的模型预设 + 提供查找/分类辅助函数
 */
import type { DtModelCategory, DtModelPreset } from "../types";
import { DT_INDUSTRIAL_MODELS } from "./IndustrialModels";
import { DT_LOGISTICS_MODELS } from "./LogisticsModels";
import { DT_INFRASTRUCTURE_MODELS } from "./InfrastructureModels";
import { DT_DATACENTER_MODELS } from "./DataCenterModels";
import { DT_ENERGY_MODELS } from "./EnergyModels";
import { DT_DECORATIVE_MODELS } from "./DecorativeModels";

export * from "./IndustrialModels";
export * from "./LogisticsModels";
export * from "./InfrastructureModels";
export * from "./DataCenterModels";
export * from "./EnergyModels";
export * from "./DecorativeModels";

/** 全部模型预设 */
export const DT_ALL_MODELS: DtModelPreset[] = [
  ...DT_INDUSTRIAL_MODELS,
  ...DT_LOGISTICS_MODELS,
  ...DT_INFRASTRUCTURE_MODELS,
  ...DT_DATACENTER_MODELS,
  ...DT_ENERGY_MODELS,
  ...DT_DECORATIVE_MODELS,
];

/** 按模型类型查找预设 */
export const dtFindModelPreset = (type: string): DtModelPreset | undefined =>
  DT_ALL_MODELS.find((m) => m.type === type);

/** 模型分类列表（用于组件库面板分组展示） */
export const DT_MODEL_CATEGORIES: DtModelCategory[] = [
  {
    key: "digitaltwin.library.category.industrial",
    modelTypes: DT_INDUSTRIAL_MODELS.map((m) => m.type),
  },
  {
    key: "digitaltwin.library.category.logistics",
    modelTypes: DT_LOGISTICS_MODELS.map((m) => m.type),
  },
  {
    key: "digitaltwin.library.category.infrastructure",
    modelTypes: DT_INFRASTRUCTURE_MODELS.map((m) => m.type),
  },
  {
    key: "digitaltwin.library.category.datacenter",
    modelTypes: DT_DATACENTER_MODELS.map((m) => m.type),
  },
  {
    key: "digitaltwin.library.category.energy",
    modelTypes: DT_ENERGY_MODELS.map((m) => m.type),
  },
  {
    key: "digitaltwin.library.category.decorative",
    modelTypes: DT_DECORATIVE_MODELS.map((m) => m.type),
  },
];
