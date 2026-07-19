/**
 * 数字孪生 - 相机系统
 *
 * 职责：
 *  - 轨道相机（OrbitControls）：旋转/缩放/平移
 *  - 第一人称/巡检模式：本批次仅预留接口，批次 5 实现
 *  - 预设视角（top/front/side/iso/back/bottom）
 *  - flyTo 平滑过渡动画（requestAnimationFrame + 缓动）
 *  - focusOn 节点聚焦（包围盒自动计算）
 *  - 状态持久化（getState/setState）
 *
 * 注：OrbitControls 走动态 import 避免首屏体积膨胀。
 */

import {
    PerspectiveCamera,
    OrthographicCamera,
    Vector3,
    MathUtils,
    Box3,
    Spherical,
} from "three";
import type { Camera } from "three";
import type { DtEngine } from "./DtEngine";
import type {
    DtCameraMode,
    DtCameraState,
    DtViewPreset3D,
} from "../types";

/** 预设视角对应的球坐标（distance 由场景包围盒动态计算） */
const PRESET_SPHERICAL: Record<DtViewPreset3D, { theta: number; phi: number }> = {
    top: { theta: 0, phi: 0.0001 },
    front: { theta: 0, phi: Math.PI / 2 },
    side: { theta: Math.PI / 2, phi: Math.PI / 2 },
    iso: { theta: Math.PI / 4, phi: Math.PI / 4 },
    back: { theta: Math.PI, phi: Math.PI / 2 },
    bottom: { theta: 0, phi: Math.PI - 0.0001 },
};

/** 缓动函数（ease-in-out-cubic） */
const easeInOutCubic = (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** 巡检路径动画回调签名（批次 5 实现） */
export type DtInspectionCallback = (
    position: Vector3,
    target: Vector3,
    progress: number,
) => void;

export class DtCameraRig {
    readonly camera: PerspectiveCamera;
    readonly orthoCamera: OrthographicCamera;
    /** 当前激活相机 */
    active: Camera;

    private readonly engine: DtEngine;
    private controls: import("three/examples/jsm/controls/OrbitControls.js").OrbitControls | null = null;
    private mode: DtCameraMode = "orbit";
    /** 当前 flyTo 动画句柄 */
    private flyHandle: number | null = null;
    /** 相机变化回调列表 */
    private readonly changeCallbacks: Array<(state: DtCameraState) => void> = [];
    /** 巡检回调（占位） */
    private inspectionCallback: DtInspectionCallback | null = null;

    constructor(engine: DtEngine) {
        this.engine = engine;
        this.camera = new PerspectiveCamera(50, 1, 0.1, 5000);
        this.camera.position.set(200, 150, 200);
        this.camera.lookAt(0, 0, 0);
        this.orthoCamera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 5000);
        this.active = this.camera;
    }

    /* ----------------------- 初始化与销毁 ----------------------- */

    /** 异步初始化 OrbitControls（动态 import） */
    async init(): Promise<void> {
        // Three.js 0.180+ 中 OrbitControls 为命名导出（非 default）
        const { OrbitControls } = await import(
            "three/examples/jsm/controls/OrbitControls.js"
        );
        this.controls = new OrbitControls(this.camera, this.engine.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.screenSpacePanning = true;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 3000;
        this.controls.maxPolarAngle = Math.PI - 0.05;
        this.controls.addEventListener("change", () => {
            this.emitChange();
            this.engine.requestRender();
        });
    }

    dispose(): void {
        this.stopFly();
        this.controls?.dispose();
        this.controls = null;
        this.changeCallbacks.length = 0;
        this.inspectionCallback = null;
    }

    /* ----------------------- 模式切换 ----------------------- */

    /** 当前模式 */
    getMode(): DtCameraMode {
        return this.mode;
    }

    /** 切换模式（orbit/first-person/inspection/fixed） */
    setMode(mode: DtCameraMode): void {
        if (this.mode === mode) return;
        this.mode = mode;
        // 本批次仅 orbit 完整实现，其他模式预留
        if (this.controls) {
            this.controls.enabled = mode === "orbit";
        }
        this.emitChange();
        this.engine.requestRender();
    }

    /* ----------------------- 视角预设 ----------------------- */

    /** 应用预设视角（带平滑过渡） */
    async applyPreset(preset: DtViewPreset3D, durationMs = 600): Promise<void> {
        const sceneManager = this.engine.sceneManager;
        const box = sceneManager.getSceneBoundingBox();
        if (box.isEmpty()) return;
        const center = new Vector3();
        box.getCenter(center);
        const size = new Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim * 1.8 + 10;
        const { theta, phi } = PRESET_SPHERICAL[preset];
        const targetPos = new Vector3(
            center.x + distance * Math.sin(phi) * Math.cos(theta),
            center.y + distance * Math.cos(phi),
            center.z + distance * Math.sin(phi) * Math.sin(theta),
        );
        await this.flyTo(
            [targetPos.x, targetPos.y, targetPos.z],
            [center.x, center.y, center.z],
            durationMs,
        );
    }

    /** 飞到指定位置（带平滑过渡） */
    flyTo(
        position: [number, number, number],
        target: [number, number, number],
        durationMs = 600,
    ): Promise<void> {
        return new Promise<void>((resolve) => {
            this.stopFly();
            const startPos = this.camera.position.clone();
            const startTarget = this.controls
                ? this.controls.target.clone()
                : new Vector3(0, 0, 0);
            const endPos = new Vector3(position[0], position[1], position[2]);
            const endTarget = new Vector3(target[0], target[1], target[2]);
            const startTime = performance.now();
            const tick = () => {
                const elapsed = performance.now() - startTime;
                const t = MathUtils.clamp(elapsed / durationMs, 0, 1);
                const e = easeInOutCubic(t);
                this.camera.position.lerpVectors(startPos, endPos, e);
                if (this.controls) {
                    this.controls.target.lerpVectors(startTarget, endTarget, e);
                    this.controls.update();
                } else {
                    this.camera.lookAt(endTarget);
                }
                this.engine.requestRender();
                if (t < 1) {
                    this.flyHandle = requestAnimationFrame(tick);
                } else {
                    this.flyHandle = null;
                    this.emitChange();
                    resolve();
                }
            };
            this.flyHandle = requestAnimationFrame(tick);
        });
    }

    /** 聚焦节点（自动包围盒计算） */
    async focusOn(nodePath: string, durationMs = 600): Promise<void> {
        const box = this.engine.sceneManager.getNodeBoundingBox(nodePath);
        if (!box || box.isEmpty()) return;
        const center = new Vector3();
        box.getCenter(center);
        const size = new Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z, 1);
        const distance = maxDim * 2.2 + 5;
        // 默认从 iso 方向聚焦
        const { theta, phi } = PRESET_SPHERICAL.iso;
        const targetPos = new Vector3(
            center.x + distance * Math.sin(phi) * Math.cos(theta),
            center.y + distance * Math.cos(phi),
            center.z + distance * Math.sin(phi) * Math.sin(theta),
        );
        await this.flyTo(
            [targetPos.x, targetPos.y, targetPos.z],
            [center.x, center.y, center.z],
            durationMs,
        );
    }

    /** 停止 flyTo 动画 */
    stopFly(): void {
        if (this.flyHandle !== null) {
            cancelAnimationFrame(this.flyHandle);
            this.flyHandle = null;
        }
    }

    /* ----------------------- 相机参数 ----------------------- */

    /** 设置 FOV（透视相机） */
    setFov(fov: number): void {
        this.camera.fov = fov;
        this.camera.updateProjectionMatrix();
        this.emitChange();
        this.engine.requestRender();
    }

    /** 处理 resize（透视相机宽高比 + 正交相机边界） */
    resize(width: number, height: number): void {
        this.camera.aspect = width / Math.max(1, height);
        this.camera.updateProjectionMatrix();
        const halfW = width / 2;
        const halfH = height / 2;
        this.orthoCamera.left = -halfW;
        this.orthoCamera.right = halfW;
        this.orthoCamera.top = halfH;
        this.orthoCamera.bottom = -halfH;
        this.orthoCamera.updateProjectionMatrix();
    }

    /** 切换为正交相机（2D 平面图视角） */
    useOrthographic(): void {
        this.active = this.orthoCamera;
        this.engine.requestRender();
    }

    /** 切换为透视相机（默认 3D） */
    usePerspective(): void {
        this.active = this.camera;
        this.engine.requestRender();
    }

    /** 由渲染循环调用：每帧 update damping */
    update(): void {
        if (this.controls && this.mode === "orbit") {
            this.controls.update();
        }
    }

    /* ----------------------- 巡检（占位，批次 5 实现） ----------------------- */

    /** 设置巡检回调（占位接口） */
    setInspectionCallback(cb: DtInspectionCallback | null): void {
        this.inspectionCallback = cb;
    }

    /* ----------------------- 状态持久化 ----------------------- */

    /** 获取当前相机状态（可持久化） */
    getState(): DtCameraState {
        return {
            mode: this.mode,
            position: [this.camera.position.x, this.camera.position.y, this.camera.position.z],
            target: this.controls
                ? [this.controls.target.x, this.controls.target.y, this.controls.target.z]
                : [0, 0, 0],
            fov: this.camera.fov,
            near: this.camera.near,
            far: this.camera.far,
        };
    }

    /** 恢复相机状态 */
    setState(state: Partial<DtCameraState>): void {
        if (state.position) {
            this.camera.position.set(state.position[0], state.position[1], state.position[2]);
        }
        if (state.target && this.controls) {
            this.controls.target.set(state.target[0], state.target[1], state.target[2]);
            this.controls.update();
        }
        if (state.fov !== undefined) {
            this.camera.fov = state.fov;
            this.camera.updateProjectionMatrix();
        }
        if (state.near !== undefined) this.camera.near = state.near;
        if (state.far !== undefined) this.camera.far = state.far;
        if (state.mode) this.setMode(state.mode);
        this.camera.lookAt(
            this.controls ? this.controls.target : new Vector3(0, 0, 0),
        );
        this.emitChange();
        this.engine.requestRender();
    }

    /* ----------------------- 回调 ----------------------- */

    /** 注册相机变化回调，返回取消注册函数 */
    onChange(cb: (state: DtCameraState) => void): () => void {
        this.changeCallbacks.push(cb);
        return () => {
            const idx = this.changeCallbacks.indexOf(cb);
            if (idx >= 0) this.changeCallbacks.splice(idx, 1);
        };
    }

    private emitChange(): void {
        const state = this.getState();
        for (const cb of this.changeCallbacks) {
            cb(state);
        }
    }
}

/** 工具：从球坐标生成相机位置 */
export const dtSphericalToPosition = (
    center: Vector3,
    radius: number,
    theta: number,
    phi: number,
): Vector3 =>
    new Vector3(
        center.x + radius * Math.sin(phi) * Math.cos(theta),
        center.y + radius * Math.cos(phi),
        center.z + radius * Math.sin(phi) * Math.sin(theta),
    );

/** 工具：从包围盒计算合适相机距离 */
export const dtBoxToDistance = (box: Box3, factor = 1.8): number => {
    if (box.isEmpty()) return 100;
    const size = new Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    return maxDim * factor + 10;
};

/** 工具：球坐标 ← 预设视角 */
export const dtPresetSpherical = (preset: DtViewPreset3D) =>
    PRESET_SPHERICAL[preset];
