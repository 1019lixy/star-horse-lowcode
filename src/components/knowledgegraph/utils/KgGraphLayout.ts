/**
 * 知识图谱 - 布局算法
 *
 * 力导向 / 环形 / 网格
 * 纯函数：输入节点和边，输出带新坐标的节点位置映射
 */

import { KG_DEFAULT_FORCE_OPTIONS } from "../constants";
import type { KgEdge, KgForceLayoutOptions, KgNode, KgPoint } from "../types";

/**
 * 力导向布局（迭代 N 次返回最终位置）
 * - 节点斥力（库仑）：F = repulsion / d²
 * - 边引力（胡克）：F = (d - linkDistance) * springStrength
 * - 中心引力：F = (center - pos) * centerStrength
 */
export const kgForceLayout = (
  nodes: KgNode[],
  edges: KgEdge[],
  options?: KgForceLayoutOptions,
): Map<string, KgPoint> => {
  const opts: Required<KgForceLayoutOptions> = {
    ...KG_DEFAULT_FORCE_OPTIONS,
    ...options,
  };
  const result = new Map<string, KgPoint>();
  if (nodes.length === 0) return result;

  // 工作副本（避免修改原数组）
  const positions: Array<{
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    fixed: boolean;
  }> = nodes.map((n) => ({
    id: n.id,
    x: n.x ?? Math.random() * 200,
    y: n.y ?? Math.random() * 200,
    vx: 0,
    vy: 0,
    fixed: !!n.fixed,
  }));
  const posMap = new Map(positions.map((p) => [p.id, p]));

  for (let iter = 0; iter < opts.iterations; iter++) {
    // 1. 节点斥力
    for (let i = 0; i < positions.length; i++) {
      const a = positions[i];
      for (let j = i + 1; j < positions.length; j++) {
        const b = positions[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let distSq = dx * dx + dy * dy;
        if (distSq < 0.01) {
          dx = Math.random() - 0.5;
          dy = Math.random() - 0.5;
          distSq = dx * dx + dy * dy + 0.01;
        }
        const dist = Math.sqrt(distSq);
        const force = opts.repulsion / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        if (!a.fixed) {
          a.vx += fx;
          a.vy += fy;
        }
        if (!b.fixed) {
          b.vx -= fx;
          b.vy -= fy;
        }
      }
    }

    // 2. 边引力
    for (const e of edges) {
      const a = posMap.get(e.source);
      const b = posMap.get(e.target);
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const diff = dist - opts.linkDistance;
      const force = diff * opts.springStrength;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      if (!a.fixed) {
        a.vx += fx;
        a.vy += fy;
      }
      if (!b.fixed) {
        b.vx -= fx;
        b.vy -= fy;
      }
    }

    // 3. 中心引力 + 速度衰减 + 位置更新
    for (const p of positions) {
      if (p.fixed) continue;
      const cxForce = (opts.center.x - p.x) * opts.centerStrength;
      const cyForce = (opts.center.y - p.y) * opts.centerStrength;
      p.vx = (p.vx + cxForce) * opts.damping;
      p.vy = (p.vy + cyForce) * opts.damping;
      // 限制单步最大位移，避免抖动飞出
      const maxStep = 50;
      const stepX = Math.max(-maxStep, Math.min(maxStep, p.vx));
      const stepY = Math.max(-maxStep, Math.min(maxStep, p.vy));
      p.x += stepX;
      p.y += stepY;
    }
  }

  positions.forEach((p) => {
    result.set(p.id, { x: p.x, y: p.y });
  });
  return result;
};

/** 单步力布局（用于动画） */
export const kgForceStep = (
  positions: Array<{
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    fixed?: boolean;
  }>,
  edges: KgEdge[],
  options?: KgForceLayoutOptions,
): void => {
  const opts: Required<KgForceLayoutOptions> = {
    ...KG_DEFAULT_FORCE_OPTIONS,
    ...options,
  };
  const posMap = new Map(positions.map((p) => [p.id, p]));

  // 1. 节点斥力
  for (let i = 0; i < positions.length; i++) {
    const a = positions[i];
    for (let j = i + 1; j < positions.length; j++) {
      const b = positions[j];
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      let distSq = dx * dx + dy * dy;
      if (distSq < 0.01) {
        dx = Math.random() - 0.5;
        dy = Math.random() - 0.5;
        distSq = dx * dx + dy * dy + 0.01;
      }
      const dist = Math.sqrt(distSq);
      const force = opts.repulsion / distSq;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      if (!a.fixed) {
        a.vx += fx;
        a.vy += fy;
      }
      if (!b.fixed) {
        b.vx -= fx;
        b.vy -= fy;
      }
    }
  }

  // 2. 边引力
  for (const e of edges) {
    const a = posMap.get(e.source);
    const b = posMap.get(e.target);
    if (!a || !b) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
    const diff = dist - opts.linkDistance;
    const force = diff * opts.springStrength;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;
    if (!a.fixed) {
      a.vx += fx;
      a.vy += fy;
    }
    if (!b.fixed) {
      b.vx -= fx;
      b.vy -= fy;
    }
  }

  // 3. 中心引力 + 衰减 + 位移
  for (const p of positions) {
    if (p.fixed) continue;
    const cxForce = (opts.center.x - p.x) * opts.centerStrength;
    const cyForce = (opts.center.y - p.y) * opts.centerStrength;
    p.vx = (p.vx + cxForce) * opts.damping;
    p.vy = (p.vy + cyForce) * opts.damping;
    const maxStep = 30;
    p.x += Math.max(-maxStep, Math.min(maxStep, p.vx));
    p.y += Math.max(-maxStep, Math.min(maxStep, p.vy));
  }
};

/** 环形布局 */
export const kgCircleLayout = (
  nodes: KgNode[],
  options?: { centerX?: number; centerY?: number; radius?: number },
): Map<string, KgPoint> => {
  const result = new Map<string, KgPoint>();
  const cx = options?.centerX ?? 500;
  const cy = options?.centerY ?? 350;
  const r = options?.radius ?? 250;
  const n = nodes.length;
  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / Math.max(1, n) - Math.PI / 2;
    result.set(node.id, {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });
  });
  return result;
};

/** 网格布局 */
export const kgGridLayout = (
  nodes: KgNode[],
  options?: {
    startX?: number;
    startY?: number;
    cellWidth?: number;
    cellHeight?: number;
    columns?: number;
  },
): Map<string, KgPoint> => {
  const result = new Map<string, KgPoint>();
  const startX = options?.startX ?? 100;
  const startY = options?.startY ?? 100;
  const cw = options?.cellWidth ?? 150;
  const ch = options?.cellHeight ?? 120;
  const cols =
    options?.columns ?? Math.max(1, Math.ceil(Math.sqrt(nodes.length)));
  nodes.forEach((node, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    result.set(node.id, {
      x: startX + col * cw,
      y: startY + row * ch,
    });
  });
  return result;
};

/** 应用布局到节点（返回新节点数组，不修改原数组） */
export const kgApplyLayout = (
  nodes: KgNode[],
  positions: Map<string, KgPoint>,
): KgNode[] =>
  nodes.map((n) => {
    const p = positions.get(n.id);
    return p ? { ...n, x: p.x, y: p.y } : n;
  });
