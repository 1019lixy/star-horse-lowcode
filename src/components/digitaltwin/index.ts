/**
 * 数字孪生模块 - 主导出
 */
export { default as DigitalTwinViewer } from "./DigitalTwinViewer.vue";
export { default as DtToolbar } from "./panels/DtToolbar.vue";
export { default as DtSceneCanvas } from "./panels/DtSceneCanvas.vue";
export { default as DtEntityListPanel } from "./panels/DtEntityListPanel.vue";
export { default as DtPropertyPanel } from "./panels/DtPropertyPanel.vue";
export { default as DtLegendPanel } from "./panels/DtLegendPanel.vue";
export { default as DtEntityDialog } from "./dialogs/DtEntityDialog.vue";

export { useDigitalTwinDesigner } from "./composables/useDigitalTwinDesigner";
export { useDigitalTwinCamera } from "./composables/useDigitalTwinCamera";
export { useDigitalTwinTelemetry } from "./composables/useDigitalTwinTelemetry";

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
    dtGetEntityTypePreset,
    dtGetStatusPreset,
    dtGetEntityColor,
    dtGenId,
    dtCreateSensorData,
    dtDefaultSize,
    createDtEntity,
} from "./constants";

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

export {
    dtDrawCube,
    dtDrawCylinder,
    dtDrawPlane,
    dtDrawSphere,
    dtDrawEntityLabel,
    dtDrawHighlight,
    dtDrawEntity,
} from "./utils/DtEntityRenderer";

export type * from "./types";
