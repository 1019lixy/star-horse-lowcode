/**
 * 数字孪生相机 - 状态管理
 *
 * yaw / pitch / zoom / panX / panY / applyViewPreset / rotate / zoomIn / zoomOut / pan
 */

import { reactive } from "vue";
import {
    DT_DEFAULT_CAMERA,
    DT_PITCH_MAX,
    DT_PITCH_MIN,
    DT_VIEW_PRESETS,
    DT_ZOOM_MAX,
    DT_ZOOM_MIN,
} from "../constants";
import type { DtCamera, DtViewPreset } from "../types";

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function useDigitalTwinCamera(initial?: Partial<DtCamera>) {
    const camera = reactive<DtCamera>({ ...DT_DEFAULT_CAMERA, ...initial });

    /** 应用视角预设 */
    const applyViewPreset = (preset: DtViewPreset): void => {
        const item = DT_VIEW_PRESETS.find((p) => p.preset === preset);
        if (!item) return;
        camera.yaw = item.camera.yaw;
        camera.pitch = item.camera.pitch;
    };

    /** 旋转（限制 pitch 在 [0, 90]） */
    const rotate = (dyaw: number, dpitch: number): void => {
        camera.yaw = (camera.yaw + dyaw) % 360;
        if (camera.yaw < 0) camera.yaw += 360;
        camera.pitch = clamp(camera.pitch + dpitch, DT_PITCH_MIN, DT_PITCH_MAX);
    };

    /** 设置缩放（限制在 [0.3, 3]） */
    const setZoom = (zoom: number): void => {
        camera.zoom = clamp(zoom, DT_ZOOM_MIN, DT_ZOOM_MAX);
    };

    const zoomIn = (): void => setZoom(camera.zoom + 0.1);
    const zoomOut = (): void => setZoom(camera.zoom - 0.1);

    /** 平移 */
    const pan = (dx: number, dy: number): void => {
        camera.panX += dx;
        camera.panY += dy;
    };

    /** 设置相机参数 */
    const setCamera = (patch: Partial<DtCamera>): void => {
        Object.assign(camera, patch);
    };

    /** 重置相机到默认 */
    const reset = (): void => {
        camera.yaw = DT_DEFAULT_CAMERA.yaw;
        camera.pitch = DT_DEFAULT_CAMERA.pitch;
        camera.zoom = DT_DEFAULT_CAMERA.zoom;
        camera.panX = DT_DEFAULT_CAMERA.panX;
        camera.panY = DT_DEFAULT_CAMERA.panY;
    };

    return {
        camera,
        applyViewPreset,
        rotate,
        setZoom,
        zoomIn,
        zoomOut,
        pan,
        setCamera,
        reset,
    };
}

export type UseDigitalTwinCameraReturn = ReturnType<typeof useDigitalTwinCamera>;
