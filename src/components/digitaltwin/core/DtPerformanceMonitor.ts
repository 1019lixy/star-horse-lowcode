/**
 * 数字孪生 - 性能监控
 *
 * 职责：
 *  - FPS/FrameTime/DrawCall/三角面/几何体/纹理/Program 统计
 *  - 历史记录（最近 N 帧）
 *  - 阈值告警回调
 *  - 自动降级：FPS 低于阈值时降 pixelRatio / 关阴影 / 提示降 LOD
 *
 * 注：基于 renderer.info（每帧重置）与 performance.now() 计算 FPS。
 *     jsHeapSize 仅 Chromium 系列支持（performance.memory）。
 */

import type { DtEngine } from "./DtEngine";
import type { DtPerformanceStats, DtPerformanceThreshold } from "../types";

const PERF_MEMORY_KEY = "memory";
const DEFAULT_HISTORY_SIZE = 60;

export class DtPerformanceMonitor {
    /** 当前快照 */
    readonly stats: DtPerformanceStats;
    /** 历史快照（最近 N 帧） */
    readonly history: DtPerformanceStats[] = [];

    private readonly engine: DtEngine;
    private readonly historySize: number;
    private threshold: DtPerformanceThreshold = { minFps: 30 };
    private readonly statsCallbacks: Array<(s: DtPerformanceStats) => void> = [];
    private readonly thresholdCallbacks: Array<(s: DtPerformanceStats) => void> = [];
    private autoDegradeEnabled = false;
    private degraded = false;

    /** 帧时间累积器 */
    private frameCount = 0;
    private fpsAccumTime = 0;
    private lastFrameTime = 0;
    /** 每秒回调一次 statsCallbacks */
    private statsReportInterval = 1000;
    private lastStatsReport = 0;

    constructor(engine: DtEngine, historySize = DEFAULT_HISTORY_SIZE) {
        this.engine = engine;
        this.historySize = historySize;
        this.stats = this.createEmptyStats();
        this.lastFrameTime = performance.now();
        this.lastStatsReport = this.lastFrameTime;
    }

    /* ----------------------- 配置 ----------------------- */

    /** 设置阈值（超出触发 onThresholdExceeded 与自动降级） */
    setThreshold(t: DtPerformanceThreshold): void {
        this.threshold = { ...t };
    }

    /** 启用/禁用自动降级 */
    enableAutoDegrade(enabled: boolean): void {
        this.autoDegradeEnabled = enabled;
        if (!enabled) this.degraded = false;
    }

    /* ----------------------- 回调 ----------------------- */

    /** 注册性能回调（约每秒一次） */
    onStats(cb: (stats: DtPerformanceStats) => void): () => void {
        this.statsCallbacks.push(cb);
        return () => {
            const idx = this.statsCallbacks.indexOf(cb);
            if (idx >= 0) this.statsCallbacks.splice(idx, 1);
        };
    }

    /** 注册超阈值回调 */
    onThresholdExceeded(cb: (stats: DtPerformanceStats) => void): () => void {
        this.thresholdCallbacks.push(cb);
        return () => {
            const idx = this.thresholdCallbacks.indexOf(cb);
            if (idx >= 0) this.thresholdCallbacks.splice(idx, 1);
        };
    }

    /* ----------------------- 每帧调用（由 DtEngine 渲染循环触发） ----------------------- */

    /** 每帧开始调用 */
    beginFrame(): void {
        // 占位：可在此处插入 GPU timer query（需扩展）
    }

    /** 每帧结束调用，更新统计 */
    endFrame(): void {
        const now = performance.now();
        const delta = now - this.lastFrameTime;
        this.lastFrameTime = now;
        this.frameCount++;
        this.fpsAccumTime += delta;

        // 累计 1 秒或更久，刷新 FPS
        if (now - this.lastStatsReport >= this.statsReportInterval) {
            const fps = (this.frameCount * 1000) / this.fpsAccumTime;
            const frameTime = this.fpsAccumTime / Math.max(1, this.frameCount);
            const renderer = this.engine.renderer;
            const info = renderer.info;
            const memory = (performance as unknown as Record<string, unknown>)[PERF_MEMORY_KEY] as
                | { usedJSHeapSize?: number }
                | undefined;
            this.stats.fps = Math.round(fps);
            this.stats.frameTime = Math.round(frameTime * 100) / 100;
            this.stats.drawCalls = info.render.calls;
            this.stats.triangles = info.render.triangles;
            this.stats.geometries = info.memory.geometries;
            this.stats.textures = info.memory.textures;
            this.stats.programs = info.programs?.length ?? 0;
            this.stats.instancedMeshes = this.countInstancedMeshes();
            this.stats.jsHeapSize = memory?.usedJSHeapSize;
            this.stats.timestamp = now;

            // 推入历史
            this.history.push({ ...this.stats });
            if (this.history.length > this.historySize) {
                this.history.shift();
            }

            // 重置累加器
            this.frameCount = 0;
            this.fpsAccumTime = 0;
            this.lastStatsReport = now;

            // 触发回调
            for (const cb of this.statsCallbacks) cb(this.stats);

            // 阈值检测
            this.checkThreshold();
        }
    }

    /* ----------------------- 内部工具 ----------------------- */

    private createEmptyStats(): DtPerformanceStats {
        return {
            fps: 0,
            frameTime: 0,
            drawCalls: 0,
            triangles: 0,
            geometries: 0,
            textures: 0,
            programs: 0,
            instancedMeshes: 0,
            jsHeapSize: undefined,
            timestamp: performance.now(),
        };
    }

    private countInstancedMeshes(): number {
        let count = 0;
        this.engine.sceneManager.traverse((node) => {
            if (node.instanced) count++;
        });
        return count;
    }

    private checkThreshold(): void {
        const s = this.stats;
        const t = this.threshold;
        let exceeded = false;
        if (t.minFps !== undefined && s.fps < t.minFps) exceeded = true;
        if (t.maxFrameTime !== undefined && s.frameTime > t.maxFrameTime) exceeded = true;
        if (t.maxTriangles !== undefined && s.triangles > t.maxTriangles) exceeded = true;
        if (t.maxDrawCalls !== undefined && s.drawCalls > t.maxDrawCalls) exceeded = true;

        if (exceeded) {
            for (const cb of this.thresholdCallbacks) cb(s);
            if (this.autoDegradeEnabled && !this.degraded) {
                this.applyAutoDegrade();
            }
        } else if (this.autoDegradeEnabled && this.degraded && s.fps > (t.minFps ?? 30) + 15) {
            // 性能恢复后尝试升级（保守：仅恢复 pixelRatio）
            this.restorePixelRatio();
        }
    }

    /** 自动降级：依次降 pixelRatio → 关阴影 → 降 LOD（占位） */
    private applyAutoDegrade(): void {
        const renderer = this.engine.renderer;
        const currentDpr = renderer.getPixelRatio();
        if (currentDpr > 1) {
            renderer.setPixelRatio(Math.max(1, currentDpr - 0.5));
            this.degraded = true;
            console.warn(
                `[DtPerformanceMonitor] auto-degrade: pixelRatio ${currentDpr} → ${renderer.getPixelRatio()}`,
            );
            return;
        }
        // 已是最低 pixelRatio，关闭阴影
        if (this.engine.lightingRig) {
            this.engine.lightingRig.setShadowsEnabled(false);
            this.degraded = true;
            console.warn("[DtPerformanceMonitor] auto-degrade: shadows disabled");
        }
    }

    private restorePixelRatio(): void {
        const targetDpr = Math.min(
            window.devicePixelRatio,
            this.engine.options.maxPixelRatio ?? 2,
        );
        this.engine.renderer.setPixelRatio(targetDpr);
        this.degraded = false;
        console.warn(`[DtPerformanceMonitor] restore pixelRatio to ${targetDpr}`);
    }

    dispose(): void {
        this.statsCallbacks.length = 0;
        this.thresholdCallbacks.length = 0;
        this.history.length = 0;
    }
}
