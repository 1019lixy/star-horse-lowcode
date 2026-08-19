/**
 * 数字孪生 - 3D 投影工具
 *
 * 等距投影 + 旋转矩阵 + 深度排序（画家算法）
 * 纯数学计算，不依赖 Canvas
 *
 * @deprecated v3.2 起数字孪生改用 Three.js WebGL2 引擎（见 core/DtEngine.ts）。
 *     本模块基于 Canvas 2D 等距投影，仅作向后兼容保留，将在 v4.0 移除。
 *     新代码请使用 DtSceneViewport + DtEngine。
 */

import { DT_PROJECTION_SCALE } from "../constants";
import type { DtCamera, DtEntity, DtPoint3D, DtProjectedPoint } from "../types";

const DEG2RAD = Math.PI / 180;

/**
 * 绕 Y 轴旋转（yaw）
 * x' = x*cos(yaw) + z*sin(yaw)
 * z' = -x*sin(yaw) + z*cos(yaw)
 * y 不变
 */
export const dtRotateY = (p: DtPoint3D, yawDeg: number): DtPoint3D => {
  const r = yawDeg * DEG2RAD;
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  return {
    x: p.x * cos + p.z * sin,
    y: p.y,
    z: -p.x * sin + p.z * cos,
  };
};

/**
 * 绕 X 轴旋转（pitch）
 * y' = y*cos(pitch) - z*sin(pitch)
 * z' = y*sin(pitch) + z*cos(pitch)
 * x 不变
 */
export const dtRotateX = (p: DtPoint3D, pitchDeg: number): DtPoint3D => {
  const r = pitchDeg * DEG2RAD;
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  return {
    x: p.x,
    y: p.y * cos - p.z * sin,
    z: p.y * sin + p.z * cos,
  };
};

/** 旋转矩阵组合：先绕 Y 轴再绕 X 轴 */
export const dtRotationMatrix = (p: DtPoint3D, camera: DtCamera): DtPoint3D => {
  const p1 = dtRotateY(p, camera.yaw);
  return dtRotateX(p1, camera.pitch);
};

/**
 * 3D 点 → 2D 屏幕坐标（等距投影）
 *
 * 投影公式：
 *   sx = (x - z) * cos(30°) * scale + panX
 *   sy = (x + z) * sin(30°) * scale - y * scale + panY
 *
 * 先应用旋转矩阵，再做透视投影
 */
export const dtProjectPoint = (
  p: DtPoint3D,
  camera: DtCamera,
): DtProjectedPoint => {
  const rotated = dtRotationMatrix(p, camera);
  const scale = DT_PROJECTION_SCALE * camera.zoom;
  const isoCos = Math.cos(30 * DEG2RAD);
  const isoSin = Math.sin(30 * DEG2RAD);
  const sx = (rotated.x - rotated.z) * isoCos * scale + camera.panX;
  const sy =
    (rotated.x + rotated.z) * isoSin * scale - rotated.y * scale + camera.panY;
  // 深度：旋转后 z 越大表示越远
  const depth = rotated.z;
  return { x: sx, y: sy, depth };
};

/**
 * 计算实体中心点（用于深度排序）
 */
export const dtEntityCenter = (entity: DtEntity): DtPoint3D => {
  const { position, size, type } = entity;
  if (type === "cube" || type === "plane") {
    return {
      x: position.x,
      y: position.y + size.height / 2,
      z: position.z,
    };
  }
  if (type === "cylinder") {
    return {
      x: position.x,
      y: position.y + size.height / 2,
      z: position.z,
    };
  }
  // sphere
  return { x: position.x, y: position.y, z: position.z };
};

/**
 * 投影实体中心点
 */
export const dtProjectEntity = (
  entity: DtEntity,
  camera: DtCamera,
): DtProjectedPoint => {
  const center = dtEntityCenter(entity);
  return dtProjectPoint(center, camera);
};

/**
 * 画家算法深度排序：按实体中心深度从远到近排序（z 大的先绘制）
 *
 * @param entities 待排序实体
 * @param camera 相机
 * @returns 排序后的新数组（不修改原数组）
 */
export const dtDepthSort = (
  entities: DtEntity[],
  camera: DtCamera,
): DtEntity[] => {
  return entities
    .map((e) => ({ e, depth: dtProjectEntity(e, camera).depth }))
    .sort((a, b) => b.depth - a.depth)
    .map((item) => item.e);
};

/**
 * 取得立方体 8 个顶点（用于绘制与拾取）
 *
 * position 表示底面中心，顶点按下列索引返回：
 *   0: 底前左  1: 底前右  2: 底后右  3: 底后左
 *   4: 顶前左  5: 顶前右  6: 顶后右  7: 顶后左
 */
export const dtCubeVertices = (entity: DtEntity): DtPoint3D[] => {
  const { position, size } = entity;
  const w = size.width / 2;
  const h = size.height;
  const d = size.depth / 2;
  const x = position.x;
  const y = position.y;
  const z = position.z;
  return [
    { x: x - w, y, z: z + d }, // 0 底前左
    { x: x + w, y, z: z + d }, // 1 底前右
    { x: x + w, y, z: z - d }, // 2 底后右
    { x: x - w, y, z: z - d }, // 3 底后左
    { x: x - w, y: y + h, z: z + d }, // 4 顶前左
    { x: x + w, y: y + h, z: z + d }, // 5 顶前右
    { x: x + w, y: y + h, z: z - d }, // 6 顶后右
    { x: x - w, y: y + h, z: z - d }, // 7 顶后左
  ];
};

/**
 * 取得平面 4 个顶点（XZ 平面）
 */
export const dtPlaneVertices = (entity: DtEntity): DtPoint3D[] => {
  const { position, size } = entity;
  const w = size.width / 2;
  const d = size.depth / 2;
  const x = position.x;
  const y = position.y;
  const z = position.z;
  return [
    { x: x - w, y, z: z + d },
    { x: x + w, y, z: z + d },
    { x: x + w, y, z: z - d },
    { x: x - w, y, z: z - d },
  ];
};

/** 颜色调亮 / 调暗（factor > 1 调亮，< 1 调暗） */
export const dtShadeColor = (color: string, factor: number): string => {
  const hex = color.replace("#", "");
  if (hex.length !== 6) return color;
  const r = Math.min(255, Math.round(parseInt(hex.slice(0, 2), 16) * factor));
  const g = Math.min(255, Math.round(parseInt(hex.slice(2, 4), 16) * factor));
  const b = Math.min(255, Math.round(parseInt(hex.slice(4, 6), 16) * factor));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

/** 计算实体 2D 投影后的包围盒（用于拾取） */
export const dtEntityBoundingBox = (
  entity: DtEntity,
  camera: DtCamera,
): { minX: number; minY: number; maxX: number; maxY: number } | null => {
  let pts: DtPoint3D[];
  if (entity.type === "cube") {
    pts = dtCubeVertices(entity);
  } else if (entity.type === "plane") {
    pts = dtPlaneVertices(entity);
  } else if (entity.type === "cylinder") {
    const r = entity.size.radius;
    pts = [
      { x: entity.position.x - r, y: entity.position.y, z: entity.position.z },
      { x: entity.position.x + r, y: entity.position.y, z: entity.position.z },
      { x: entity.position.x, y: entity.position.y, z: entity.position.z - r },
      { x: entity.position.x, y: entity.position.y, z: entity.position.z + r },
      {
        x: entity.position.x - r,
        y: entity.position.y + entity.size.height,
        z: entity.position.z,
      },
      {
        x: entity.position.x + r,
        y: entity.position.y + entity.size.height,
        z: entity.position.z,
      },
    ];
  } else if (entity.type === "sphere") {
    const r = entity.size.radius;
    pts = [
      { x: entity.position.x - r, y: entity.position.y, z: entity.position.z },
      { x: entity.position.x + r, y: entity.position.y, z: entity.position.z },
      { x: entity.position.x, y: entity.position.y - r, z: entity.position.z },
      { x: entity.position.x, y: entity.position.y + r, z: entity.position.z },
      { x: entity.position.x, y: entity.position.y, z: entity.position.z - r },
      { x: entity.position.x, y: entity.position.y, z: entity.position.z + r },
    ];
  } else {
    return null;
  }
  const projected = pts.map((p) => dtProjectPoint(p, camera));
  const xs = projected.map((p) => p.x);
  const ys = projected.map((p) => p.y);
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
};
