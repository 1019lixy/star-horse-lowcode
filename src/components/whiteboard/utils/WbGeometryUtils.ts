/**
 * 白板组件 - 几何工具
 *
 * 命中检测、包围盒、路径转换、形状 path
 * 注意：函数统一以 wb 前缀命名，避免与 diagram/constants.getShapePath 等冲突
 */

import type {PenElement, ShapeElement, TextElement, WbBoundingBox, WhiteboardElement,} from "../types";

/** 两点距离平方 */
export const wbDistanceSq = (x1: number, y1: number, x2: number, y2: number): number => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
};

/** 两点距离 */
export const wbDistance = (x1: number, y1: number, x2: number, y2: number): number =>
    Math.sqrt(wbDistanceSq(x1, y1, x2, y2));

/** 点到线段距离 */
export const wbPointToSegment = (
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
): number => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return wbDistance(px, py, x1, y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const cx = x1 + t * dx;
    const cy = y1 + t * dy;
    return wbDistance(px, py, cx, cy);
};

/** 点在矩形内（含阈值） */
export const wbPointInRect = (
    px: number,
    py: number,
    x: number,
    y: number,
    w: number,
    h: number,
    tol = 0,
): boolean =>
    px >= x - tol && px <= x + w + tol && py >= y - tol && py <= y + h + tol;

/** 点在椭圆内 */
export const wbPointInEllipse = (
    px: number,
    py: number,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    tol = 0,
): boolean => {
    const nx = (px - cx) / (rx + tol);
    const ny = (py - cy) / (ry + tol);
    return nx * nx + ny * ny <= 1;
};

/** 点在三角形内（重心坐标法） */
export const wbPointInTriangle = (
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
): boolean => {
    const d1 = (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
    const d2 = (px - x3) * (y2 - y3) - (x2 - x3) * (py - y3);
    const d3 = (px - x1) * (y3 - y1) - (x3 - x1) * (py - y1);
    const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
    const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
    return !(hasNeg && hasPos);
};

/** 点在菱形内 */
export const wbPointInDiamond = (
    px: number,
    py: number,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
): boolean => {
    const dx = Math.abs(px - cx) / rx;
    const dy = Math.abs(py - cy) / ry;
    return dx + dy <= 1;
};

/**
 * 将点数组转为 SVG path d 字符串
 * M 起点 -> L 后续点（点数 < 2 时返回空）
 */
export const wbPointsToPath = (points: { x: number; y: number }[]): string => {
    if (!points || points.length === 0) return "";
    if (points.length === 1) {
        const p = points[0];
        return `M${p.x},${p.y} L${p.x + 0.01},${p.y + 0.01}`;
    }
    let d = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        d += ` L${points[i].x},${points[i].y}`;
    }
    return d;
};

/**
 * 生成带箭头的 path
 * 起点 -> 终点 + 末端三角形
 */
export const wbArrowPath = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    arrowSize = 12,
): string => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const a1 = angle + Math.PI - Math.PI / 7;
    const a2 = angle + Math.PI + Math.PI / 7;
    const ax1 = x2 + arrowSize * Math.cos(a1);
    const ay1 = y2 + arrowSize * Math.sin(a1);
    const ax2 = x2 + arrowSize * Math.cos(a2);
    const ay2 = y2 + arrowSize * Math.sin(a2);
    return `M${x1},${y1} L${x2},${y2} M${ax1},${ay1} L${x2},${y2} L${ax2},${ay2}`;
};

/** 生成形状 path（相对坐标 0,0 起） */
export const wbShapePath = (
    shape: string,
    w: number,
    h: number,
): string => {
    switch (shape) {
        case "rect":
            return `M0,0 L${w},0 L${w},${h} L0,${h} Z`;
        case "circle": {
            const cx = w / 2;
            const cy = h / 2;
            const rx = w / 2;
            const ry = h / 2;
            return `M${cx - rx},${cy} A${rx},${ry} 0 1,0 ${cx + rx},${cy} A${rx},${ry} 0 1,0 ${cx - rx},${cy} Z`;
        }
        case "triangle":
            return `M${w / 2},0 L${w},${h} L0,${h} Z`;
        case "diamond":
            return `M${w / 2},0 L${w},${h / 2} L${w / 2},${h} L0,${h / 2} Z`;
        case "arrow":
            return `M0,${h / 3} L${w * 0.65},${h / 3} L${w * 0.65},0 L${w},${h / 2} L${w * 0.65},${h} L${w * 0.65},${(h * 2) / 3} Z`;
        default:
            return `M0,0 L${w},0 L${w},${h} L0,${h} Z`;
    }
};

/** 计算元素的轴对齐包围盒 */
export const wbGetBoundingBox = (el: WhiteboardElement): WbBoundingBox => {
    switch (el.type) {
        case "pen": {
            const pts = (el as PenElement).points;
            if (!pts || pts.length === 0) return {x: 0, y: 0, width: 0, height: 0};
            let minX = pts[0].x;
            let minY = pts[0].y;
            let maxX = pts[0].x;
            let maxY = pts[0].y;
            for (let i = 1; i < pts.length; i++) {
                if (pts[i].x < minX) minX = pts[i].x;
                if (pts[i].y < minY) minY = pts[i].y;
                if (pts[i].x > maxX) maxX = pts[i].x;
                if (pts[i].y > maxY) maxY = pts[i].y;
            }
            return {x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY)};
        }
        case "shape": {
            const s = el as ShapeElement;
            return {x: s.x, y: s.y, width: s.width, height: s.height};
        }
        case "line": {
            const l: any = el;
            const minX = Math.min(l.x1, l.x2);
            const minY = Math.min(l.y1, l.y2);
            const maxX = Math.max(l.x1, l.x2);
            const maxY = Math.max(l.y1, l.y2);
            return {x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY)};
        }
        case "text": {
            const t = el as TextElement;
            return {x: t.x, y: t.y, width: t.width, height: t.height};
        }
        default:
            return {x: 0, y: 0, width: 0, height: 0};
    }
};

/** 命中检测：判断点是否在元素内（含阈值） */
export const wbHitTest = (
    el: WhiteboardElement,
    px: number,
    py: number,
    tol = 4,
): boolean => {
    switch (el.type) {
        case "pen": {
            const pts = (el as PenElement).points;
            if (!pts || pts.length < 2) return false;
            const threshold = Math.max(tol, (el as PenElement).strokeWidth / 2 + 2);
            for (let i = 1; i < pts.length; i++) {
                if (wbPointToSegment(px, py, pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y) <= threshold) {
                    return true;
                }
            }
            return false;
        }
        case "shape": {
            const s = el as ShapeElement;
            switch (s.shape) {
                case "rect":
                    return wbPointInRect(px, py, s.x, s.y, s.width, s.height, tol);
                case "circle":
                    return wbPointInEllipse(
                        px,
                        py,
                        s.x + s.width / 2,
                        s.y + s.height / 2,
                        s.width / 2,
                        s.height / 2,
                        tol,
                    );
                case "triangle":
                    return wbPointInTriangle(
                        px,
                        py,
                        s.x + s.width / 2,
                        s.y,
                        s.x + s.width,
                        s.y + s.height,
                        s.x,
                        s.y + s.height,
                    );
                case "diamond":
                    return wbPointInDiamond(
                        px,
                        py,
                        s.x + s.width / 2,
                        s.y + s.height / 2,
                        s.width / 2,
                        s.height / 2,
                    );
                case "arrow":
                    return wbPointInRect(px, py, s.x, s.y, s.width, s.height, tol);
                default:
                    return false;
            }
        }
        case "line": {
            const l: any = el;
            const threshold = Math.max(tol, l.strokeWidth / 2 + 2);
            return wbPointToSegment(px, py, l.x1, l.y1, l.x2, l.y2) <= threshold;
        }
        case "text": {
            const t = el as TextElement;
            return wbPointInRect(px, py, t.x, t.y, t.width, t.height, tol);
        }
        default:
            return false;
    }
};

/** 判断元素与矩形相交（用于框选） */
export const wbElementIntersectsRect = (
    el: WhiteboardElement,
    rect: WbBoundingBox,
): boolean => {
    const box = wbGetBoundingBox(el);
    if (box.width === 0 || box.height === 0) return false;
    return (
        box.x < rect.x + rect.width &&
        box.x + box.width > rect.x &&
        box.y < rect.y + rect.height &&
        box.y + box.height > rect.y
    );
};

/** 矩形扩展（增加边距） */
export const wbExpandBox = (
    box: WbBoundingBox,
    padding: number,
): WbBoundingBox => ({
    x: box.x - padding,
    y: box.y - padding,
    width: box.width + padding * 2,
    height: box.height + padding * 2,
});

/** 合并两个包围盒 */
export const wbUnionBox = (
    a: WbBoundingBox,
    b: WbBoundingBox,
): WbBoundingBox => {
    if (a.width === 0 || a.height === 0) return {...b};
    if (b.width === 0 || b.height === 0) return {...a};
    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);
    const x2 = Math.max(a.x + a.width, b.x + b.width);
    const y2 = Math.max(a.y + a.height, b.y + b.height);
    return {x, y, width: x2 - x, height: y2 - y};
};
