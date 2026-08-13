import { onBeforeUnmount, ref } from "vue";

/**
 * 双指捏合缩放 composable
 *
 * 监听目标元素上的双指 touch 事件，计算两指距离变化触发缩放。
 * 与 @wheel 缩并存：PC 端用 wheel，移动端用 pinch。
 *
 * 用法：
 *   const { pinchHandlers, scale } = usePinchZoom({
 *     onZoom: (factor, midPoint) => { /* factor>1 放大，<1 缩小 *\/ },
 *     minScale: 0.2,
 *     maxScale: 5,
 *   });
 *   // 模板：<canvas @touchstart="pinchHandlers.onTouchStart" @touchmove="pinchHandlers.onTouchMove" @touchend="pinchHandlers.onTouchEnd" style="touch-action: none">
 *
 * 注意：目标元素需设置 `touch-action: none` 防止浏览器默认手势
 */
export interface PinchZoomOptions {
  /** 缩放回调，factor 为相对上次的缩放比例（>1 放大，<1 缩小），midPoint 为两指中点坐标 */
  onZoom?: (factor: number, midPoint: { x: number; y: number }) => void;
  /** 最小缩放倍率（仅约束内部 scale 状态，onZoom 仍会被调用） */
  minScale?: number;
  /** 最大缩放倍率 */
  maxScale?: number;
}

export function usePinchZoom(options: PinchZoomOptions = {}) {
  const { onZoom, minScale = 0.2, maxScale = 5 } = options;

  const scale = ref(1);
  let lastDist = 0;
  let active = false;

  const getTouchDistance = (t1: Touch, t2: Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.hypot(dx, dy);
  };

  const getMidPoint = (t1: Touch, t2: Touch) => ({
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  });

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 2) return;
    active = true;
    lastDist = getTouchDistance(e.touches[0], e.touches[1]);
    // 阻止浏览器默认双指手势（如缩放页面）
    if (e.cancelable) e.preventDefault();
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!active || e.touches.length !== 2) return;
    if (e.cancelable) e.preventDefault();
    const dist = getTouchDistance(e.touches[0], e.touches[1]);
    if (lastDist > 0) {
      const factor = dist / lastDist;
      let next = scale.value * factor;
      // 约束到 min/max
      next = Math.min(maxScale, Math.max(minScale, next));
      const actualFactor = next / scale.value;
      if (actualFactor !== 1 && onZoom) {
        onZoom(actualFactor, getMidPoint(e.touches[0], e.touches[1]));
      }
      scale.value = next;
    }
    lastDist = dist;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (e.touches.length < 2) {
      active = false;
      lastDist = 0;
    }
  };

  /** 手动重置缩放（如画布重置时） */
  const resetScale = (v = 1) => {
    scale.value = v;
  };

  onBeforeUnmount(() => {
    active = false;
  });

  return {
    scale,
    pinchHandlers: { onTouchStart, onTouchMove, onTouchEnd },
    resetScale,
  };
}
