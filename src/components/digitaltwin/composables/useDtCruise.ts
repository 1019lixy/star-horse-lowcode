/**
 * 数字孪生 - 相机自动巡航漫游路径
 *
 * - 基于 requestAnimationFrame 平滑插值相机 position + target
 * - 支持 loop / once 模式
 * - 支持 stayMs 停留 + transitionMs 过渡
 * - 与 useDigitalTwinCamera 联动：暂停时手动控制不冲突
 * - 路径变化时通过 onUpdate 回调通知（用于绘制路径预览线）
 */
import {computed, type ComputedRef, onUnmounted, ref, shallowRef, type ShallowRef} from "vue";
import type {DtCruisePath, DtCruiseWaypoint} from "../types";

export interface UseDtCruiseOptions {
    /** 路径变化时回调（用于绘制预览线） */
    onPathChange?: (path: DtCruisePath | null) => void;
    /** 当前航点变化时回调（高亮路径上当前点） */
    onWaypointChange?: (index: number, waypoint: DtCruiseWaypoint) => void;
    /** 相机位置/朝向更新回调（核心驱动函数） */
    onCameraUpdate: (pos: { x: number; y: number; z: number }, target: { x: number; y: number; z: number }) => void;
    /** 完成回调 */
    onComplete?: () => void;
}

export interface UseDtCruiseReturn {
    /** 当前路径 */
    currentPath: ShallowRef<DtCruisePath | null>;
    /** 是否正在巡航 */
    isCruising: ReturnType<typeof ref<boolean>>;
    /** 当前航点 index */
    currentWaypointIndex: ReturnType<typeof ref<number>>;
    /** 进度 0-1 */
    progress: ReturnType<typeof ref<number>>;
    /** 总航点数 */
    totalWaypoints: ComputedRef<number>;
    /** 加载路径并立即开始 */
    start: (path: DtCruisePath) => void;
    /** 暂停（保留当前位置） */
    pause: () => void;
    /** 继续 */
    resume: () => void;
    /** 停止（恢复到巡航前状态由调用方负责） */
    stop: () => void;
    /** 跳转到指定航点 */
    jumpTo: (index: number) => void;
}

export function useDtCruise(options: UseDtCruiseOptions): UseDtCruiseReturn {
    const currentPath = shallowRef<DtCruisePath | null>(null);
    const isCruising = ref(false);
    const currentWaypointIndex = ref(0);
    const progress = ref(0);

    let rafId: number | null = null;
    let startTime = 0;
    let pauseElapsed = 0;
    let phase: "transition" | "stay" = "transition";
    let fromPos = {x: 0, y: 0, z: 0};
    let fromTarget = {x: 0, y: 0, z: 0};

    const totalWaypoints = computed(() => currentPath.value?.waypoints.length ?? 0);

    const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

    /** 缓动函数：ease-in-out */
    const easeInOut = (t: number): number => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    const tick = (ts: number): void => {
        const path = currentPath.value;
        if (!path || !isCruising.value) return;

        if (startTime === 0) startTime = ts;
        const elapsed = ts - startTime + pauseElapsed;
        const wp = path.waypoints[currentWaypointIndex.value];
        if (!wp) {
            stopInternal();
            return;
        }

        const transitionMs = wp.transitionMs ?? 3000;
        const stayMs = wp.stayMs ?? 1500;

        if (phase === "transition") {
            const t = Math.min(1, elapsed / transitionMs);
            const eased = easeInOut(t);
            progress.value = t;
            const targetPos = {
                x: lerp(fromPos.x, wp.position.x, eased),
                y: lerp(fromPos.y, wp.position.y, eased),
                z: lerp(fromPos.z, wp.position.z, eased),
            };
            const targetLookAt = {
                x: lerp(fromTarget.x, wp.target.x, eased),
                y: lerp(fromTarget.y, wp.target.y, eased),
                z: lerp(fromTarget.z, wp.target.z, eased),
            };
            options.onCameraUpdate(targetPos, targetLookAt);

            if (t >= 1) {
                phase = "stay";
                startTime = ts;
                pauseElapsed = 0;
            }
        } else {
            // stay 阶段：保持位置不变
            progress.value = 1;
            options.onCameraUpdate(wp.position, wp.target);

            if (elapsed >= stayMs) {
                // 进入下一航点
                const nextIndex = currentWaypointIndex.value + 1;
                if (nextIndex >= path.waypoints.length) {
                    if (path.loop) {
                        currentWaypointIndex.value = 0;
                    } else {
                        stopInternal();
                        options.onComplete?.();
                        return;
                    }
                } else {
                    currentWaypointIndex.value = nextIndex;
                }
                const nextWp = path.waypoints[currentWaypointIndex.value];
                options.onWaypointChange?.(currentWaypointIndex.value, nextWp);
                fromPos = {...wp.position};
                fromTarget = {...wp.target};
                phase = "transition";
                startTime = ts;
                pauseElapsed = 0;
                progress.value = 0;
            }
        }

        rafId = requestAnimationFrame(tick);
    };

    const start = (path: DtCruisePath): void => {
        if (!path.waypoints.length) return;
        stopInternal();
        currentPath.value = path;
        currentWaypointIndex.value = 0;
        progress.value = 0;
        phase = "transition";
        startTime = 0;
        pauseElapsed = 0;
        // 起始位置取相机当前位置（由调用方在第一次 tick 前传入）
        // 这里简单取第一个航点作为起点
        const first = path.waypoints[0];
        fromPos = {...first.position};
        fromTarget = {...first.target};
        isCruising.value = true;
        options.onPathChange?.(path);
        options.onWaypointChange?.(0, first);
        rafId = requestAnimationFrame(tick);
    };

    const pause = (): void => {
        if (!isCruising.value) return;
        isCruising.value = false;
        if (rafId !== null) {
            pauseElapsed += performance.now() - startTime;
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };

    const resume = (): void => {
        if (isCruising.value || !currentPath.value) return;
        isCruising.value = true;
        startTime = performance.now();
        rafId = requestAnimationFrame(tick);
    };

    const stopInternal = (): void => {
        isCruising.value = false;
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        startTime = 0;
        pauseElapsed = 0;
    };

    const stop = (): void => {
        stopInternal();
        currentPath.value = null;
        currentWaypointIndex.value = 0;
        progress.value = 0;
        options.onPathChange?.(null);
    };

    const jumpTo = (index: number): void => {
        const path = currentPath.value;
        if (!path || index < 0 || index >= path.waypoints.length) return;
        currentWaypointIndex.value = index;
        const wp = path.waypoints[index];
        fromPos = {...wp.position};
        fromTarget = {...wp.target};
        phase = "transition";
        startTime = 0;
        pauseElapsed = 0;
        progress.value = 0;
        options.onWaypointChange?.(index, wp);
        if (!isCruising.value) {
            isCruising.value = true;
            rafId = requestAnimationFrame(tick);
        }
    };

    onUnmounted(() => {
        stopInternal();
    });

    return {
        currentPath,
        isCruising,
        currentWaypointIndex,
        progress,
        totalWaypoints,
        start,
        pause,
        resume,
        stop,
        jumpTo,
    };
}
