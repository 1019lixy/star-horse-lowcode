import {ref, onBeforeUnmount} from "vue";

/**
 * 统一指针拖拽 composable（PointerEvent 同时覆盖 mouse + touch + 笔）
 *
 * 设计要点：
 * 1. 在目标元素绑定 @pointerdown="onPointerDown"，move/up 自动绑定到 window
 *    避免指针移出元素后丢失事件
 * 2. 支持 threshold（移动超过阈值才算拖拽开始，防误触）
 * 3. 自动 setPointerCapture，确保拖拽过程持续接收事件
 * 4. 不替代右键/长按，仅处理"按住拖动"场景
 *
 * 用法：
 *   const { onPointerDown, isDragging } = usePointerDrag({
 *     onDown: (e) => { /* 返回 false 可取消拖拽 *\/ },
 *     onMove: (e, { dx, dy, startX, startY }) => { ... },
 *     onUp: (e) => { ... },
 *     threshold: 3,
 *   });
 *   // 模板：<canvas @pointerdown="onPointerDown" style="touch-action: none">
 *
 * 注意：目标元素需设置 `touch-action: none` 防止触屏拖拽时浏览器默认滚动
 */
export interface PointerDragOptions {
    /** pointerdown 时调用；返回 false 取消本次拖拽 */
    onDown?: (e: PointerEvent) => boolean | void;
    /** 拖拽移动时调用（超过 threshold 后才触发） */
    onMove?: (
        e: PointerEvent,
        delta: { dx: number; dy: number; startX: number; startY: number; lastX: number; lastY: number },
    ) => void;
    /** 拖拽结束时调用 */
    onUp?: (e: PointerEvent) => void;
    /** 触发拖拽的最小位移（px），默认 0 即 down 立即开始 */
    threshold?: number;
    /** 限定鼠标按键（0=左键，1=中键，2=右键）；touch/pen 不受限。默认 0 */
    button?: number;
}

export function usePointerDrag(options: PointerDragOptions = {}) {
    const {
        onDown,
        onMove,
        onUp,
        threshold = 0,
        button = 0,
    } = options;

    const isDragging = ref(false);
    let activePointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let pending = false; // threshold 待达标

    const cleanup = () => {
        if (activePointerId !== null) {
            window.removeEventListener("pointermove", onMoveHandler);
            window.removeEventListener("pointerup", onUpHandler);
            window.removeEventListener("pointercancel", onUpHandler);
        }
        activePointerId = null;
        isDragging.value = false;
        pending = false;
    };

    const onMoveHandler = (e: PointerEvent) => {
        if (activePointerId === null || e.pointerId !== activePointerId) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        // threshold 判定
        if (pending) {
            const distFromStart = Math.hypot(e.clientX - startX, e.clientY - startY);
            if (distFromStart < threshold) return;
            pending = false;
            isDragging.value = true;
        }

        if (onMove) {
            onMove(e, {dx, dy, startX, startY, lastX, lastY});
        }
        lastX = e.clientX;
        lastY = e.clientY;
    };

    const onUpHandler = (e: PointerEvent) => {
        if (activePointerId === null || e.pointerId !== activePointerId) return;
        const wasDragging = isDragging.value;
        if (wasDragging && onUp) {
            onUp(e);
        }
        cleanup();
    };

    /** 绑定到目标元素的 @pointerdown */
    const onPointerDown = (e: PointerEvent) => {
        // 鼠标按键过滤（touch/pen 的 button 始终为 0）
        if (e.pointerType === "mouse" && e.button !== button) return;

        // 若上次拖拽未清理（异常情况），先清理
        if (activePointerId !== null) cleanup();

        // onDown 回调，返回 false 取消
        if (onDown) {
            const ret = onDown(e);
            if (ret === false) return;
        }

        activePointerId = e.pointerId;
        startX = lastX = e.clientX;
        startY = lastY = e.clientY;
        pending = threshold > 0;
        if (!pending) {
            isDragging.value = true;
        }

        // setPointerCapture 确保持续接收事件
        try {
            (e.target as Element).setPointerCapture?.(e.pointerId);
        } catch {
            /* ignore */
        }

        window.addEventListener("pointermove", onMoveHandler, {passive: false});
        window.addEventListener("pointerup", onUpHandler);
        window.addEventListener("pointercancel", onUpHandler);
    };

    onBeforeUnmount(cleanup);

    return {
        isDragging,
        onPointerDown,
        /** 主动取消当前拖拽（外部调用） */
        cancel: cleanup,
    };
}
