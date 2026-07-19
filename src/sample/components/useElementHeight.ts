import { onMounted, onUnmounted, ref, type Ref } from "vue";

/**
 * 使用 ResizeObserver 动态追踪元素高度
 *
 * 用于 Map/Iot 等多组件 Demo：子组件需要 :height 像素值用于内部 SVG/Canvas 坐标投影，
 * 不能简单用 height:100%。本 composable 监听容器元素高度变化，返回响应式像素值。
 *
 * @param target 目标元素 ref
 * @param options.defaultHeight 初始默认高度（observer 触发前）
 * @param options.offset 偏移量（如扣除 el-tabs header 高度）
 */
export function useElementHeight(
    target: Ref<HTMLElement | null>,
    options: { defaultHeight?: number; offset?: number } = {},
): Ref<number> {
    const { defaultHeight = 400, offset = 0 } = options;
    const height = ref(defaultHeight);
    let observer: ResizeObserver | null = null;

    const update = (): void => {
        if (!target.value) return;
        height.value = Math.max(100, target.value.clientHeight - offset);
    };

    onMounted(() => {
        if (!target.value) return;
        update();
        observer = new ResizeObserver(update);
        observer.observe(target.value);
    });

    onUnmounted(() => {
        observer?.disconnect();
        observer = null;
    });

    return height;
}
