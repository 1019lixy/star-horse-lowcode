/**
 * 数字孪生模块 - 主导出
 *
 * v4.0 TresJS 声明式架构重写
 *  - DtDesigner：新主壳（TresJS 声明式 3D 渲染）
 *  - DtViewport：新视口（@tresjs/core + @tresjs/cientos）
 *  - DtSceneTree：新场景树（el-tree 拖拽层级）
 *  - DtPropertyPanel：新属性面板（信号驱动）
 *  - dtApp：App 单例（对标 Astral3D App）
 *  - 信号系统：useAddSignal/useDispatchSignal（对标 Astral3D Hooks）
 *  - 命令系统：AddEntityCommand/SetPositionCommand 等（对标 Astral3D Commands）
 */

/* ============================================================
 *  v4.0 TresJS 声明式架构（主入口）
 * ============================================================ */

/** 数字孪生设计器主壳 */
export { default as DtDesigner } from "./DtDesigner.vue";
/** @deprecated 兼容旧引用，请使用 DtDesigner */
export { default as DigitalTwinDesigner } from "./DtDesigner.vue";
/** 3D 视口（TresJS 声明式） */
export { default as DtViewport } from "./panels/DtViewport.vue";
/** 场景树 */
export { default as DtSceneTree } from "./panels/DtSceneTree.vue";
/** 属性面板 */
export { default as DtPropertyPanel } from "./panels/DtPropertyPanel.vue";

// App 单例 + 信号系统
export { dtApp, DtApp } from "./core/DtApp";
export { dtSignals, SIGNAL_NAMES, useAddSignal, useDispatchSignal, useSetSignalActive } from "./core/DtSignals";
export type { SignalName } from "./core/DtSignals";

// 命令系统
export { Command } from "./core/commands";
export {
    AddEntityCommand,
    RemoveEntityCommand,
    SetPositionCommand,
    SetSizeCommand,
    SetValueCommand,
    MoveEntityCommand,
} from "./core/commands/commands";
export { DtHistory } from "./core/DtHistory";

/* ============================================================
 *  组件导出
 * ============================================================ */

export { default as DtContextMenu } from "./panels/DtContextMenu.vue";
export type { DtContextMenuItem } from "./panels/DtContextMenu.vue";
export { default as DtEntityDialog } from "./dialogs/DtEntityDialog.vue";
export { default as DtPerformanceHud } from "./panels/DtPerformanceHud.vue";

/* ============================================================
 *  常量与工具函数
 * ============================================================ */

export {
    DT_ENTITY_TYPE_PRESETS,
    DT_STATUS_PRESETS,
    DT_VIEW_PRESETS,
    DT_DEFAULT_COLORS,
    DT_DEFAULT_CAMERA,
    DT_ZOOM_MIN,
    DT_ZOOM_MAX,
    DT_PITCH_MIN,
    DT_PITCH_MAX,
    DT_PROJECTION_SCALE,
    DT_DEFAULT_SIM_INTERVAL,
    DT_GRID_SIZE,
    DT_GRID_DIVISIONS,
    DT_SCENE_TEMPLATES,
    dtGetEntityTypePreset,
    dtGetStatusPreset,
    dtGetEntityColor,
    dtGenId,
    dtCreateSensorData,
    dtDefaultSize,
    createDtEntity,
    dtCreateModelInstance,
} from "./constants";

// 模型库聚合导出
export {
    DT_ALL_MODELS,
    DT_INDUSTRIAL_MODELS,
    DT_LOGISTICS_MODELS,
    DT_INFRASTRUCTURE_MODELS,
    DT_DATACENTER_MODELS,
    DT_ENERGY_MODELS,
    DT_DECORATIVE_MODELS,
    DT_MODEL_CATEGORIES,
    dtFindModelPreset,
} from "./modelLibrary";

/* ============================================================
 *  composables
 * ============================================================ */

export { useDigitalTwinTelemetry } from "./composables/useDigitalTwinTelemetry";
export { useDigitalTwinAnimation } from "./composables/useDigitalTwinAnimation";
export type { UseDigitalTwinAnimationReturn } from "./composables/useDigitalTwinAnimation";

/* ============================================================
 *  企业级运营扩展
 * ============================================================ */

export { useDtCruise } from "./composables/useDtCruise";
export type { UseDtCruiseReturn, UseDtCruiseOptions } from "./composables/useDtCruise";
export { useDtAlarmStream } from "./composables/useDtAlarmStream";
export type { UseDtAlarmStreamReturn, DtAlarmFilter } from "./composables/useDtAlarmStream";
export { useDtVideoMonitor, genDefaultCamerasForScene } from "./composables/useDtVideoMonitor";
export type { UseDtVideoMonitorReturn } from "./composables/useDtVideoMonitor";
export { importIfcFile, IFC_FILE_EXTENSIONS } from "./utils/DtIfcLoader";
export type { DtIfcLoaderOptions, DtIfcLoaderProgress } from "./utils/DtIfcLoader";

export { default as DtAlarmCenterPanel } from "./panels/DtAlarmCenterPanel.vue";
export { default as DtVideoMonitorPanel } from "./panels/DtVideoMonitorPanel.vue";
export { default as DtCruisePanel } from "./panels/DtCruisePanel.vue";

export {
    DT_CRUISE_PATH_PRESETS,
    DT_CAMERA_PRESETS,
    DT_ALARM_EVENT_PRESETS,
} from "./constants";

/* ============================================================
 *  类型导出
 * ============================================================ */

export type * from "./types";
