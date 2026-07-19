/**
 * 数字孪生 - 引擎主类
 *
 * 职责：
 *  - WebGLRenderer 创建与配置（WebGL2 优先，失败降级 WebGL1）
 *  - 渲染循环（requestAnimationFrame）
 *  - 子系统集成（SceneManager / CameraRig / LightingRig / PerformanceMonitor）
 *  - 生命周期管理（init / dispose）
 *  - resize 处理（DPR 与画布尺寸）
 *  - 渲染模式（always 持续 / on-demand 按需）
 *  - webglcontextlost / restored 降级恢复
 *  - 渲染前/后回调（供交互层、性能监控使用）
 *
 * 对外只暴露最小 API，外部不应直接操作 Three.js renderer。
 */

import {
    WebGLRenderer,
    Color,
    PCFSoftShadowMap,
    Clock,
} from "three";
import type { Scene, Camera } from "three";
import { DtSceneManager } from "./DtSceneManager";
import { DtCameraRig } from "./DtCameraRig";
import { DtLightingRig } from "./DtLightingRig";
import { DtPerformanceMonitor } from "./DtPerformanceMonitor";
import type {
    DtEngineOptions,
    DtRenderMode,
} from "../types";

/** 引擎状态 */
export type DtEngineStatus = "uninitialized" | "ready" | "disposed" | "context-lost";

export class DtEngine {
    /** 渲染器（只读，外部不应直接操作） */
    readonly renderer: WebGLRenderer;
    /** 场景管理器 */
    readonly sceneManager: DtSceneManager;
    /** 相机系统 */
    readonly cameraRig: DtCameraRig;
    /** 光照系统 */
    readonly lightingRig: DtLightingRig;
    /** 性能监控 */
    readonly performance: DtPerformanceMonitor;

    /** 引擎配置（只读副本） */
    readonly options: Required<
        Omit<DtEngineOptions, "canvas" | "container">
    > & Pick<DtEngineOptions, "canvas" | "container">;

    /** DOM 元素（用于 OrbitControls 等监听） */
    readonly domElement: HTMLElement;

    /** 当前状态 */
    status: DtEngineStatus = "uninitialized";

    /** 渲染前/后回调列表 */
    private readonly beforeRenderCallbacks: Array<(delta: number) => void> = [];
    private readonly afterRenderCallbacks: Array<(delta: number) => void> = [];

    /** 渲染循环句柄 */
    private rafHandle: number | null = null;
    /** 时钟（计算 delta） */
    private readonly clock = new Clock(false);
    /** 渲染模式 */
    private renderMode: DtRenderMode = "always";
    /** on-demand 模式下，是否需要下一帧重渲 */
    private dirty = true;
    /** 是否暂停 */
    private paused = false;
    /** 上下文丢失恢复回调列表 */
    private readonly contextLostCallbacks: Array<() => void> = [];

    constructor(opts: DtEngineOptions) {
        this.options = {
            canvas: opts.canvas,
            container: opts.container,
            fallbackToWebGL1: opts.fallbackToWebGL1 ?? true,
            antialias: opts.antialias ?? true,
            maxPixelRatio: opts.maxPixelRatio ?? 2,
            shadowMapEnabled: opts.shadowMapEnabled ?? true,
            enablePostProcessing: opts.enablePostProcessing ?? false,
            renderMode: opts.renderMode ?? "always",
            background: opts.background ?? 0x1e1e1e,
            assetBase: opts.assetBase ?? "/assets/",
            fov: opts.fov ?? 50,
            near: opts.near ?? 0.1,
            far: opts.far ?? 5000,
        };
        this.domElement = opts.container;
        this.renderMode = this.options.renderMode;

        // 创建 WebGLRenderer（WebGL2 优先）
        this.renderer = this.createRenderer(opts.canvas);
        this.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, this.options.maxPixelRatio),
        );
        this.renderer.setSize(opts.container.clientWidth, opts.container.clientHeight, false);
        this.renderer.setClearColor(new Color(this.options.background), 1);
        if (this.options.shadowMapEnabled) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = PCFSoftShadowMap;
        }

        // 创建子系统（顺序：SceneManager → CameraRig → LightingRig → PerformanceMonitor）
        this.sceneManager = new DtSceneManager(this);
        this.cameraRig = new DtCameraRig(this);
        // 应用初始 FOV/near/far
        this.cameraRig.camera.fov = this.options.fov;
        this.cameraRig.camera.near = this.options.near;
        this.cameraRig.camera.far = this.options.far;
        this.cameraRig.camera.updateProjectionMatrix();
        this.cameraRig.resize(
            opts.container.clientWidth,
            opts.container.clientHeight,
        );
        this.lightingRig = new DtLightingRig(this);
        this.performance = new DtPerformanceMonitor(this);
    }

    /* ----------------------- 生命周期 ----------------------- */

    /** 初始化所有子系统并启动渲染循环 */
    async init(): Promise<void> {
        if (this.status === "ready") return;
        // 挂载光照组到当前场景
        this.sceneManager.current.add(this.lightingRig.group);
        // 应用默认光照预设
        this.lightingRig.init();
        // 初始化相机控制器（动态 import OrbitControls）
        await this.cameraRig.init();
        // 监听 WebGL 上下文丢失
        const canvas = this.options.canvas;
        canvas.addEventListener("webglcontextlost", this.handleContextLost);
        canvas.addEventListener("webglcontextrestored", this.handleContextRestored);
        // 启动渲染循环
        this.status = "ready";
        this.dirty = true;
        this.clock.start();
        this.startLoop();
    }

    /** 释放所有 Three.js 资源 */
    dispose(): void {
        this.stopLoop();
        this.cameraRig.dispose();
        this.lightingRig.dispose();
        this.performance.dispose();
        this.sceneManager.dispose();
        this.beforeRenderCallbacks.length = 0;
        this.afterRenderCallbacks.length = 0;
        this.contextLostCallbacks.length = 0;
        const canvas = this.options.canvas;
        canvas.removeEventListener("webglcontextlost", this.handleContextLost);
        canvas.removeEventListener("webglcontextrestored", this.handleContextRestored);
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.status = "disposed";
    }

    /* ----------------------- 渲染循环 ----------------------- */

    /** 启动渲染循环 */
    private startLoop(): void {
        if (this.rafHandle !== null) return;
        const tick = () => {
            if (this.status !== "ready") return;
            this.rafHandle = requestAnimationFrame(tick);
            if (this.paused) return;
            const delta = this.clock.getDelta();
            // on-demand 模式：若不脏则跳过本帧渲染
            if (this.renderMode === "on-demand" && !this.dirty) {
                // 仍需更新 controls damping（避免视觉延迟）
                this.cameraRig.update();
                return;
            }
            this.dirty = false;
            this.renderFrame(delta);
        };
        this.rafHandle = requestAnimationFrame(tick);
    }

    /** 停止渲染循环 */
    private stopLoop(): void {
        if (this.rafHandle !== null) {
            cancelAnimationFrame(this.rafHandle);
            this.rafHandle = null;
        }
        this.clock.stop();
    }

    /** 渲染一帧 */
    private renderFrame(delta: number): void {
        this.performance.beginFrame();
        // 渲染前回调
        for (const cb of this.beforeRenderCallbacks) cb(delta);
        // 相机更新（damping）
        this.cameraRig.update();
        // 渲染
        const scene: Scene = this.sceneManager.current;
        const camera: Camera = this.cameraRig.active;
        this.renderer.render(scene, camera);
        // 渲染后回调
        for (const cb of this.afterRenderCallbacks) cb(delta);
        // 性能统计
        this.performance.endFrame();
    }

    /** 手动触发一次渲染（on-demand 模式由外部触发） */
    renderOnce(): void {
        if (this.status !== "ready") return;
        const delta = this.clock.getDelta();
        this.renderFrame(delta);
    }

    /** 暂停渲染循环 */
    pause(): void {
        this.paused = true;
    }

    /** 恢复渲染循环 */
    resume(): void {
        this.paused = false;
        this.dirty = true;
    }

    /** 标记需要重渲（on-demand 模式触发下一帧） */
    requestRender(): void {
        this.dirty = true;
    }

    /** 设置渲染模式 */
    setRenderMode(mode: DtRenderMode): void {
        this.renderMode = mode;
        if (mode === "always") this.dirty = true;
    }

    /* ----------------------- resize ----------------------- */

    /** 容器尺寸变化时调用 */
    resize(width: number, height: number): void {
        const w = Math.max(1, width);
        const h = Math.max(1, height);
        this.renderer.setSize(w, h, false);
        this.cameraRig.resize(w, h);
        this.dirty = true;
    }

    /* ----------------------- 回调注册 ----------------------- */

    /** 注册渲染前回调（返回取消注册函数） */
    onBeforeRender(cb: (delta: number) => void): () => void {
        this.beforeRenderCallbacks.push(cb);
        return () => {
            const idx = this.beforeRenderCallbacks.indexOf(cb);
            if (idx >= 0) this.beforeRenderCallbacks.splice(idx, 1);
        };
    }

    /** 注册渲染后回调 */
    onAfterRender(cb: (delta: number) => void): () => void {
        this.afterRenderCallbacks.push(cb);
        return () => {
            const idx = this.afterRenderCallbacks.indexOf(cb);
            if (idx >= 0) this.afterRenderCallbacks.splice(idx, 1);
        };
    }

    /** 注册 WebGL 上下文丢失后恢复回调 */
    onContextRestored(cb: () => void): () => void {
        this.contextLostCallbacks.push(cb);
        return () => {
            const idx = this.contextLostCallbacks.indexOf(cb);
            if (idx >= 0) this.contextLostCallbacks.splice(idx, 1);
        };
    }

    /* ----------------------- 内部工具 ----------------------- */

    /** 创建 WebGLRenderer（WebGL2 优先，失败降级 WebGL1） */
    private createRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
        const opts: ConstructorParameters<typeof WebGLRenderer>[0] = {
            canvas,
            antialias: this.options.antialias,
            alpha: false,
            stencil: false,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true, // 截图需要
        };
        try {
            // 尝试 WebGL2
            const renderer = new WebGLRenderer({
                ...opts,
                context:
                    canvas.getContext("webgl2", {
                        antialias: this.options.antialias,
                        alpha: false,
                        stencil: false,
                        preserveDrawingBuffer: true,
                        powerPreference: "high-performance",
                    }) ?? undefined,
            });
            return renderer;
        } catch (err) {
            if (!this.options.fallbackToWebGL1) throw err;
            console.warn("[DtEngine] WebGL2 init failed, fallback to WebGL1:", err);
            return new WebGLRenderer(opts);
        }
    }

    /** WebGL 上下文丢失 */
    private handleContextLost = (event: Event): void => {
        event.preventDefault();
        this.status = "context-lost";
        this.stopLoop();
        console.warn("[DtEngine] WebGL context lost");
    };

    /** WebGL 上下文恢复 */
    private handleContextRestored = (): void => {
        console.info("[DtEngine] WebGL context restored");
        this.status = "ready";
        this.dirty = true;
        // 重新应用渲染状态
        if (this.options.shadowMapEnabled) {
            this.renderer.shadowMap.enabled = true;
        }
        this.renderer.setClearColor(new Color(this.options.background), 1);
        // 通知外部重建资源（如纹理、几何体）
        for (const cb of this.contextLostCallbacks) cb();
        this.startLoop();
    };
}
