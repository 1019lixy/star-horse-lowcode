import { onBeforeUnmount } from "vue";

/**
 * 双击检测 composable（替代桌面端 @dblclick，移动端无双击事件）
 *
 * 移动端"双击"= 300ms 内两次 touchend/click。
 * 与桌面端 @dblclick 并存：PC 端仍可绑 @dblclick，移动端用本 composable。
 *
 * 用法：
 *   const { onPointerTap } = useDoubleTap({
 *     onDoubleTap: (e: PointerEvent) => { /* 进入编辑等 *\/ },
 *     interval: 300,
 *     moveTolerance: 10,
 *   });
 *   // 模板：<div @pointerup="onPointerTap">
 *
 * 设计要点：
 * - 监听 pointerup（touch/pen/mouse 统一）
 * - 两次 up 间隔 < interval 且位移 < moveTolerance 视为双击
 * - 单击不拦截，仍可正常触发 @click
 */
export interface DoubleTapOptions {
  /** 双击触发回调 */
  onDoubleTap: (e: PointerEvent) => void;
  /** 两次点击最大间隔 ms，默认 300 */
  interval?: number;
  /** 两次点击最大位移 px，默认 10 */
  moveTolerance?: number;
}

export function useDoubleTap(options: DoubleTapOptions) {
  const { onDoubleTap, interval = 300, moveTolerance = 10 } = options;

  let lastUpTime = 0;
  let lastX = 0;
  let lastY = 0;

  const onPointerTap = (e: PointerEvent) => {
    const now = Date.now();
    const dx = Math.abs(e.clientX - lastX);
    const dy = Math.abs(e.clientY - lastY);
    if (
      now - lastUpTime < interval &&
      dx <= moveTolerance &&
      dy <= moveTolerance
    ) {
      // 双击触发
      onDoubleTap(e);
      lastUpTime = 0; // 重置，防止三击误判为双击
    } else {
      lastUpTime = now;
      lastX = e.clientX;
      lastY = e.clientY;
    }
  };

  onBeforeUnmount(() => {
    lastUpTime = 0;
  });

  return { onPointerTap };
}
