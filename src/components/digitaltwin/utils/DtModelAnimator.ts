/**
 * 数字孪生 - 动画系统
 *
 * 根据动画类型计算部件变换（offset / color），返回新部件供渲染器使用
 * 旋转动画在 Canvas 2D 简化场景下表现为颜色相位变化（实际几何旋转需要扩展渲染器）
 */
import type { DtAnimation, DtModelPart, DtPoint3D } from "../types";

export interface DtAnimationState {
  /** 累计时间（ms） */
  elapsed: number;
}

/** 应用动画到部件，返回变换后的部件副本（不修改原部件） */
export const dtAnimatePart = (
  part: DtModelPart,
  animation: DtAnimation,
  state: DtAnimationState,
): DtModelPart => {
  const t = state.elapsed / 1000;
  switch (animation.type) {
    case "rotation": {
      // 简化：通过相位调整颜色明暗模拟旋转
      const speed = animation.speed ?? 180;
      const phase = (Math.sin(t * (speed / 360) * Math.PI * 2) + 1) / 2;
      const originalColor = part.color ?? "#8C8C8C";
      const shaded = dtShadeHex(originalColor, 0.7 + phase * 0.5);
      return { ...part, color: shaded };
    }
    case "translation": {
      const axis = animation.translateAxis ?? "y";
      const range = animation.range ?? 10;
      const speed = animation.translateSpeed ?? 1;
      const offset = (Math.sin(t * speed * Math.PI * 2) * range) / 2;
      return {
        ...part,
        offset: {
          ...part.offset,
          [axis]: part.offset[axis] + offset,
        } as DtPoint3D,
      };
    }
    case "blink": {
      const freq = animation.frequency ?? 1;
      const visible = Math.sin(t * freq * Math.PI * 2) > 0;
      return { ...part, color: visible ? part.color : "#333333" };
    }
    case "color": {
      // 颜色循环：在原色和告警色间过渡
      const freq = animation.frequency ?? 0.5;
      const phase = (Math.sin(t * freq * Math.PI * 2) + 1) / 2;
      const originalColor = part.color ?? "#13C2C2";
      return { ...part, color: dtBlendHex(originalColor, "#FAAD14", phase) };
    }
    default:
      return part;
  }
};

/** 更新动画状态（累加时间） */
export const dtUpdateAnimationState = (
  state: DtAnimationState,
  deltaMs: number,
): DtAnimationState => ({
  elapsed: state.elapsed + deltaMs,
});

/** 16 进制颜色明暗调整（factor>1 调亮，<1 调暗） */
const dtShadeHex = (color: string, factor: number): string => {
  const hex = color.replace("#", "");
  if (hex.length !== 6) return color;
  const r = Math.min(255, Math.round(parseInt(hex.slice(0, 2), 16) * factor));
  const g = Math.min(255, Math.round(parseInt(hex.slice(2, 4), 16) * factor));
  const b = Math.min(255, Math.round(parseInt(hex.slice(4, 6), 16) * factor));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

/** 两种 16 进制颜色按比例混合（t=0 返回 c1, t=1 返回 c2） */
const dtBlendHex = (c1: string, c2: string, t: number): string => {
  const h1 = c1.replace("#", "");
  const h2 = c2.replace("#", "");
  if (h1.length !== 6 || h2.length !== 6) return c1;
  const r1 = parseInt(h1.slice(0, 2), 16);
  const g1 = parseInt(h1.slice(2, 4), 16);
  const b1 = parseInt(h1.slice(4, 6), 16);
  const r2 = parseInt(h2.slice(0, 2), 16);
  const g2 = parseInt(h2.slice(2, 4), 16);
  const b2 = parseInt(h2.slice(4, 6), 16);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};
