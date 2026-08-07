/**
 * 知识图谱 - 力导向布局动画 composable
 *
 * 使用 requestAnimationFrame 循环驱动 kgForceStep
 */

import {onBeforeUnmount, ref, type Ref} from "vue";
import {KG_DEFAULT_FORCE_OPTIONS} from "../constants";
import {kgForceStep} from "../utils/KgGraphLayout";
import type {KgEdge, KgForceLayoutOptions, KgNode} from "../types";

interface ForceNodeState {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    fixed: boolean;
}

export function useForceLayout(nodesRef: Ref<KgNode[]>, edgesRef: Ref<KgEdge[]>) {
    const running = ref(false);
    const iteration = ref(0);
    let rafId: number | null = null;
    let workNodes: ForceNodeState[] = [];
    let options: Required<KgForceLayoutOptions> = {...KG_DEFAULT_FORCE_OPTIONS};
    let maxIterations = options.iterations;
    let onStepCb: (() => void) | null = null;

    /** 同步工作副本 */
    const syncWorkNodes = () => {
        const map = new Map(workNodes.map((n) => [n.id, n]));
        workNodes = nodesRef.value.map((n) => {
            const existing = map.get(n.id);
            return {
                id: n.id,
                x: n.x,
                y: n.y,
                vx: existing ? existing.vx : 0,
                vy: existing ? existing.vy : 0,
                fixed: !!n.fixed,
            };
        });
    };

    /** 把工作副本坐标写回原节点 */
    const writeBack = () => {
        const map = new Map(workNodes.map((n) => [n.id, n]));
        nodesRef.value.forEach((n) => {
            const w = map.get(n.id);
            if (w) {
                n.x = w.x;
                n.y = w.y;
                n.vx = w.vx;
                n.vy = w.vy;
            }
        });
    };

    const tick = () => {
        if (!running.value) return;
        kgForceStep(workNodes, edgesRef.value, options);
        writeBack();
        iteration.value++;
        onStepCb?.();
        if (iteration.value >= maxIterations) {
            stop();
            return;
        }
        rafId = requestAnimationFrame(tick);
    };

    /** 启动力布局动画 */
    const start = (opts?: Partial<KgForceLayoutOptions>) => {
        if (opts) {
            options = {...options, ...opts};
            if (opts.iterations != null) maxIterations = opts.iterations;
        }
        syncWorkNodes();
        iteration.value = 0;
        running.value = true;
        rafId = requestAnimationFrame(tick);
    };

    /** 停止 */
    const stop = () => {
        running.value = false;
        if (rafId != null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };

    /** 暂停（保留进度） */
    const pause = () => {
        running.value = false;
        if (rafId != null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };

    /** 继续 */
    const resume = () => {
        if (running.value) return;
        if (iteration.value >= maxIterations) return;
        running.value = true;
        rafId = requestAnimationFrame(tick);
    };

    /** 单步推进 */
    const step = () => {
        if (workNodes.length !== nodesRef.value.length) syncWorkNodes();
        kgForceStep(workNodes, edgesRef.value, options);
        writeBack();
        iteration.value++;
        onStepCb?.();
    };

    /** 重置（清零速度，重新同步） */
    const reset = () => {
        stop();
        iteration.value = 0;
        workNodes = [];
    };

    /** 固定/释放某个节点 */
    const setFixed = (nodeId: string, fixed: boolean) => {
        const w = workNodes.find((n) => n.id === nodeId);
        if (w) {
            w.fixed = fixed;
            if (fixed) {
                w.vx = 0;
                w.vy = 0;
            }
        }
        const n = nodesRef.value.find((nn) => nn.id === nodeId);
        if (n) n.fixed = fixed;
    };

    /** 直接更新某节点位置（拖拽时） */
    const setNodePosition = (nodeId: string, x: number, y: number) => {
        const w = workNodes.find((nn) => nn.id === nodeId);
        if (w) {
            w.x = x;
            w.y = y;
            w.vx = 0;
            w.vy = 0;
        }
        const n = nodesRef.value.find((nn) => nn.id === nodeId);
        if (n) {
            n.x = x;
            n.y = y;
        }
    };

    /** 注册每步回调 */
    const onStep = (cb: () => void) => {
        onStepCb = cb;
    };

    onBeforeUnmount(() => {
        stop();
    });

    return {
        running,
        iteration,
        start,
        stop,
        pause,
        resume,
        step,
        reset,
        setFixed,
        setNodePosition,
        onStep,
        syncWorkNodes,
    };
}

export type UseForceLayoutReturn = ReturnType<typeof useForceLayout>;
