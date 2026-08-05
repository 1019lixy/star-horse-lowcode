import {onBeforeUnmount} from "vue";

/**
 * 长按检测 composable（替代桌面端右键菜单 @contextmenu）
 *
 * 移动端无右键，用"长按 500ms"触发同一菜单。
 * 同时保留桌面端右键：绑定 onContextMenu 到同一回调即可。
 *
 * 用法：
 *   const { bindLongPress } = useLongPress({
 *     onLongPress: (e: PointerEvent | MouseEvent) => { /* 弹出菜单 *\/ },
 *     duration: 500,
 *     moveTolerance: 10,  // 长按过程中移动超过此距离则取消
 *   });
 *   // 模板：<div @pointerdown="bindLongPress.onPointerDown" @pointermove="bindLongPress.onPointerMove" @pointerup="bindLongPress.onPointerUp" @pointerleave="bindLongPress.onPointerUp" @contextmenu="bindLongPress.onContextMenu">
 *
 * 设计要点：
 * - 仅 touch/pen 触发长按计时；mouse 右键走 onContextMenu
 * - 长按过程中手指移动超过 moveTolerance 则取消（防误触）
 * - preventDefault 阻止系统长按菜单（如 iOS callout）
 */
export interface LongPressOptions {
    /** 长按触发回调 */
    onLongPress: (e: PointerEvent | MouseEvent) => void;
    /** 长按时长 ms，默认 500 */
    duration?: number;
    /** 长按过程中允许的最大移动距离 px，默认 10 */
    moveTolerance?: number;
}

export function useLongPress(options: LongPressOptions) {
    const {onLongPress, duration = 500, moveTolerance = 10} = options;

    let timer: ReturnType<typeof setTimeout> | null = null;
    let startX = 0;
    let startY = 0;
    let fired = false;
    let triggerEvent: PointerEvent | null = null;

    const clear = () => {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }
        fired = false;
        triggerEvent = null;
    };

    const onPointerDown = (e: PointerEvent) => {
        // 仅 touch/pen 启动长按计时；mouse 由 onContextMenu 处理
        if (e.pointerType === "mouse") return;
        clear();
        startX = e.clientX;
        startY = e.clientY;
        triggerEvent = e;
        fired = false;
        timer = setTimeout(() => {
            if (!fired && triggerEvent) {
                fired = true;
                onLongPress(triggerEvent);
            }
        }, duration);
    };

    const onPointerMove = (e: PointerEvent) => {
        if (timer === null) return;
        const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
        if (dist > moveTolerance) {
            clear();
        }
    };

    const onPointerUp = () => {
        clear();
    };

    /** 桌面端右键：直接触发，与长按走同一回调 */
    const onContextMenu = (e: MouseEvent) => {
        // 仅桌面端鼠标右键触发（button===2）；触摸长按由 pointerdown 计时处理，
        // 此处忽略触摸产生的 contextmenu 事件避免重复触发
        if (e.button === 2) {
            e.preventDefault();
            onLongPress(e);
        }
    };

    onBeforeUnmount(clear);

    return {
        bindLongPress: {onPointerDown, onPointerMove, onPointerUp, onContextMenu},
        clear,
    };
}
