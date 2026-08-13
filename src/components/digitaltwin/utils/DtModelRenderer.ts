/**
 * 数字孪生 - 复合模型渲染器
 *
 * 将 DtModelInstance 按 preset parts 渲染为多个基础几何体
 * 复用 DtEntityRenderer 的 dtDrawCube/dtDrawCylinder/dtDrawPlane/dtDrawSphere
 */
import { dtFindModelPreset } from "../modelLibrary";
import {
  dtDrawCube,
  dtDrawCylinder,
  dtDrawEntityLabel,
  dtDrawHighlight,
  dtDrawPlane,
  dtDrawSphere,
  type DtRenderContext,
} from "./DtEntityRenderer";
import { dtEntityBoundingBox } from "./DtProjection";
import type { DtEntity, DtModelInstance, DtModelPart } from "../types";

/** 根据 part 构造临时 entity 用于复用基础渲染器 */
const buildPartEntity = (
  instance: DtModelInstance,
  part: DtModelPart,
): DtEntity => {
  return {
    id: `${instance.id}_${part.id}`,
    type: part.type,
    name: "",
    position: {
      x: instance.position.x + part.offset.x,
      y: instance.position.y + part.offset.y,
      z: instance.position.z + part.offset.z,
    },
    size: { ...part.size },
    color: part.color ?? instance.color,
    status: instance.status,
    visible: instance.visible,
  };
};

/** 渲染模型实例（按 parts 依次绘制） */
export const dtDrawModelInstance = (
  instance: DtModelInstance,
  rc: DtRenderContext,
): void => {
  if (instance.visible === false) return;
  const preset = dtFindModelPreset(instance.modelType);
  if (!preset) {
    return;
  }
  dtDrawModelInstanceWithParts(instance, preset.parts, rc);
};

/** 渲染模型实例（使用指定部件列表，用于动画覆盖） */
export const dtDrawModelInstanceWithParts = (
  instance: DtModelInstance,
  parts: DtModelPart[],
  rc: DtRenderContext,
): void => {
  if (instance.visible === false) return;
  for (const part of parts) {
    const partEntity = buildPartEntity(instance, part);
    switch (part.type) {
      case "cube":
        dtDrawCube(partEntity, rc);
        break;
      case "cylinder":
        dtDrawCylinder(partEntity, rc);
        break;
      case "plane":
        dtDrawPlane(partEntity, rc);
        break;
      case "sphere":
        dtDrawSphere(partEntity, rc);
        break;
      default:
        break;
    }
  }
  // 绘制模型标签（位于包围盒顶部）
  dtDrawEntityLabel(instance, rc);
  // 选中高亮
  if (rc.selectedId === instance.id) {
    dtDrawModelInstanceHighlight(instance, rc);
  }
};

/** 模型实例高亮：基于 preset.defaultSize 计算包围盒 */
export const dtDrawModelInstanceHighlight = (
  instance: DtModelInstance,
  rc: DtRenderContext,
): void => {
  const { ctx, camera } = rc;
  const preset = dtFindModelPreset(instance.modelType);
  if (!preset) return;
  const bboxEntity: DtEntity = {
    id: `${instance.id}_bbox`,
    type: "cube",
    name: "",
    position: { ...instance.position },
    size: { ...preset.defaultSize },
    color: instance.color,
    status: instance.status,
    visible: true,
  };
  const bbox = dtEntityBoundingBox(bboxEntity, camera);
  if (!bbox) return;
  const pad = 6;
  ctx.save();
  ctx.strokeStyle = "#FAAD14";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(
    bbox.minX - pad,
    bbox.minY - pad,
    bbox.maxX - bbox.minX + pad * 2,
    bbox.maxY - bbox.minY + pad * 2,
  );
  ctx.restore();
};

/** 统一绘制实体：检测是否为 DtModelInstance */
export const dtDrawEntityOrModel = (
  entity: DtEntity,
  rc: DtRenderContext,
): void => {
  if (entity.visible === false) return;
  if ((entity as DtModelInstance).modelType) {
    dtDrawModelInstance(entity as DtModelInstance, rc);
  } else {
    switch (entity.type) {
      case "cube":
        dtDrawCube(entity, rc);
        break;
      case "cylinder":
        dtDrawCylinder(entity, rc);
        break;
      case "plane":
        dtDrawPlane(entity, rc);
        break;
      case "sphere":
        dtDrawSphere(entity, rc);
        break;
      default:
        break;
    }
    dtDrawEntityLabel(entity, rc);
    if (rc.selectedId === entity.id) {
      dtDrawHighlight(entity, rc);
    }
  }
};
