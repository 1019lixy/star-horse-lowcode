/**
 * 数字孪生 - 动画循环管理
 *
 * 使用 requestAnimationFrame 维护全局动画状态（累计时间）
 * 渲染器在每帧从 state 读取 elapsed 用于计算部件变换
 */
import {onBeforeUnmount, ref} from "vue";
import {type DtAnimationState, dtUpdateAnimationState} from "../utils/DtModelAnimator";

/** 动画循环 composable */
export const useDigitalTwinAnimation = () => {
    const animating = ref(false);
    const state = ref<DtAnimationState>({elapsed: 0});
    let rafId: number | null = null;
    let lastTime = 0;

    /** 每帧回调 */
    const tick = (now: number): void => {
        if (!animating.value) return;
        const delta = lastTime ? now - lastTime : 0;
        lastTime = now;
        state.value = dtUpdateAnimationState(state.value, delta);
        rafId = window.requestAnimationFrame(tick);
    };

    /** 启动动画 */
    const start = (): void => {
        if (animating.value) return;
        animating.value = true;
        lastTime = 0;
        rafId = window.requestAnimationFrame(tick);
    };

    /** 停止动画 */
    const stop = (): void => {
        animating.value = false;
        if (rafId !== null) {
            window.cancelAnimationFrame(rafId);
            rafId = null;
        }
    };

    /** 重置动画时间 */
    const reset = (): void => {
        state.value = {elapsed: 0};
        lastTime = 0;
    };

    onBeforeUnmount(stop);

    return {
        animating,
        state,
        start,
        stop,
        reset,
    };
};

export type UseDigitalTwinAnimationReturn = ReturnType<typeof useDigitalTwinAnimation>;
