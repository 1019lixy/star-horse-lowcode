/**
 * 数字孪生 - 引擎生命周期 composable
 *
 * 职责：
 *  - 创建/初始化 DtEngine 实例
 *  - 通过 provide/inject 向下传递引擎
 *  - onBeforeUnmount 自动 dispose
 *  - 暴露 ready/error 响应式状态
 *
 * 使用示例：
 *   const { engine, ready, init } = useDtEngine({ shadowMapEnabled: true });
 *   onMounted(async () => {
 *     if (canvasRef.value && containerRef.value) {
 *       await init(canvasRef.value, containerRef.value);
 *     }
 *   });
 *   provide(DtEngineKey, engine);
 */

import {
    ref,
    shallowRef,
    onBeforeUnmount,
    inject,
    provide,
    type InjectionKey,
    type Ref,
    type ShallowRef,
} from "vue";
import { DtEngine } from "../core/DtEngine";
import type { DtEngineOptions } from "../types";

/** 引擎注入 key */
export const DtEngineKey: InjectionKey<ShallowRef<DtEngine | null>> = Symbol("DtEngine");

export interface UseDtEngineOptions
    extends Omit<Partial<DtEngineOptions>, "canvas" | "container"> {}

export interface UseDtEngineReturn {
    /** 引擎实例（响应式，初始化前为 null） */
    engine: ShallowRef<DtEngine | null>;
    /** 是否就绪 */
    ready: Ref<boolean>;
    /** 初始化错误 */
    error: Ref<Error | null>;
    /** 初始化引擎 */
    init: (canvas: HTMLCanvasElement, container: HTMLElement) => Promise<void>;
    /** 手动销毁 */
    dispose: () => void;
}

/**
 * 创建并管理 DtEngine 实例
 * @param options 引擎选项（不含 canvas/container，由 init 时传入）
 */
export function useDtEngine(options?: UseDtEngineOptions): UseDtEngineReturn {
    const engine = shallowRef<DtEngine | null>(null);
    const ready = ref(false);
    const error = ref<Error | null>(null);

    const init = async (canvas: HTMLCanvasElement, container: HTMLElement) => {
        try {
            error.value = null;
            // 若已存在实例，先释放
            if (engine.value) {
                engine.value.dispose();
                engine.value = null;
                ready.value = false;
            }
            const e = new DtEngine({
                canvas,
                container,
                ...options,
            });
            await e.init();
            engine.value = e;
            ready.value = true;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
            // eslint-disable-next-line no-console
            console.error("[useDtEngine] init failed:", err);
        }
    };

    const dispose = () => {
        if (engine.value) {
            engine.value.dispose();
            engine.value = null;
            ready.value = false;
        }
    };

    onBeforeUnmount(() => {
        dispose();
    });

    return { engine, ready, error, init, dispose };
}

/**
 * 注入引擎实例（子组件使用）
 */
export function useDtEngineInject(): ShallowRef<DtEngine | null> {
    return inject(DtEngineKey, shallowRef<DtEngine | null>(null));
}

/**
 * 在根组件中 provide 引擎实例
 */
export function provideDtEngine(engine: ShallowRef<DtEngine | null>): void {
    provide(DtEngineKey, engine);
}
