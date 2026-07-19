/**
 * 数字孪生模块 - 主导出
 *
 * v3.2 起新增企业级 3D 引擎层导出（Three.js WebGL2）。
 * 旧版基于 Canvas 2D 的导出（DigitalTwinViewer / DtSceneCanvas / DtProjection / DtEntityRenderer）
 * 保留向后兼容，标记 @deprecated，新代码请使用 DigitalTwinDesigner + DtSceneViewport。
 */

/* ============================================================
 *  v3.2 企业级 3D 引擎层导出
 * ============================================================ */

/** 企业级主壳（替换旧 DigitalTwinViewer） */
export { default as DigitalTwinDesigner } from "./DigitalTwinDesigner.vue";
/** 3D 视口（替换旧 DtSceneCanvas） */
export { default as DtSceneViewport } from "./panels/DtSceneViewport.vue";
/** 性能 HUD 浮层 */
export { default as DtPerformanceHud } from "./panels/DtPerformanceHud.vue";

// 核心引擎层
export { DtEngine } from "./core/DtEngine";
export type { DtEngineStatus } from "./core/DtEngine";
export { DtSceneManager } from "./core/DtSceneManager";
export { DtCameraRig } from "./core/DtCameraRig";
export { DtLightingRig } from "./core/DtLightingRig";
export { DtPerformanceMonitor } from "./core/DtPerformanceMonitor";

// composables（新）
export { useDtEngine, DtEngineKey } from "./composables/useDtEngine";
export type { UseDtEngineOptions, UseDtEngineReturn } from "./composables/useDtEngine";
export { useDtScene } from "./composables/useDtScene";
export type { UseDtSceneReturn } from "./composables/useDtScene";

// v3.2 引擎层常量暂无（待引擎层完善后再导出）

/* ============================================================
 *  旧版导出（@deprecated，向后兼容保留）
 * ============================================================ */

/** @deprecated v3.2 起请使用 DigitalTwinDesigner，旧版基于 Canvas 2D */
export { default as DigitalTwinViewer } from "./DigitalTwinViewer.vue";
/** @deprecated v3.2 起请使用 DtSceneViewport，旧版基于 Canvas 2D */
export { default as DtSceneCanvas } from "./panels/DtSceneCanvas.vue";
export { default as DtToolbar } from "./panels/DtToolbar.vue";
export { default as DtEntityListPanel } from "./panels/DtEntityListPanel.vue";
export { default as DtPropertyPanel } from "./panels/DtPropertyPanel.vue";
export { default as DtLegendPanel } from "./panels/DtLegendPanel.vue";
export { default as DtModelLibraryPanel } from "./panels/DtModelLibraryPanel.vue";
export { default as DtSceneTreePanel } from "./panels/DtSceneTreePanel.vue";
export { default as DtEntityDialog } from "./dialogs/DtEntityDialog.vue";
export { default as DtBindingDialog } from "./dialogs/DtBindingDialog.vue";
export { default as DtTemplateDialog } from "./dialogs/DtTemplateDialog.vue";

export { useDigitalTwinDesigner } from "./composables/useDigitalTwinDesigner";
export { useDigitalTwinCamera } from "./composables/useDigitalTwinCamera";
export { useDigitalTwinTelemetry } from "./composables/useDigitalTwinTelemetry";
export { useDigitalTwinAnimation } from "./composables/useDigitalTwinAnimation";
export { useDigitalTwinBinding, createMockProvider } from "./composables/useDigitalTwinBinding";
export type { DtBindingProvider, UseDigitalTwinBindingReturn } from "./composables/useDigitalTwinBinding";
export type { UseDigitalTwinAnimationReturn } from "./composables/useDigitalTwinAnimation";

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

/** @deprecated v3.2 起改用 Three.js 原生投影，本模块基于 Canvas 2D 等距投影 */
export {
    dtRotateY,
    dtRotateX,
    dtRotationMatrix,
    dtProjectPoint,
    dtEntityCenter,
    dtProjectEntity,
    dtDepthSort,
    dtCubeVertices,
    dtPlaneVertices,
    dtShadeColor,
    dtEntityBoundingBox,
} from "./utils/DtProjection";

/** @deprecated v3.2 起改用 DtSceneViewport 内置 Three.js 渲染，本模块基于 Canvas 2D */
export {
    dtDrawCube,
    dtDrawCylinder,
    dtDrawPlane,
    dtDrawSphere,
    dtDrawEntityLabel,
    dtDrawHighlight,
    dtDrawEntity,
} from "./utils/DtEntityRenderer";

export {
    dtDrawModelInstance,
    dtDrawModelInstanceWithParts,
    dtDrawModelInstanceHighlight,
    dtDrawEntityOrModel,
} from "./utils/DtModelRenderer";

export {
    dtAnimatePart,
    dtUpdateAnimationState,
} from "./utils/DtModelAnimator";
export type { DtAnimationState } from "./utils/DtModelAnimator";

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

export type * from "./types";
