/**
 * 数字孪生 - Canvas 实体渲染器
 *
 * dtDrawCube / dtDrawCylinder / dtDrawPlane / dtDrawSphere / dtDrawEntity
 * 纯函数式绘制，依赖 CanvasRenderingContext2D
 *
 * @deprecated v3.2 起数字孪生改用 Three.js WebGL2 引擎（见 core/DtEngine.ts）。
 *     本模块基于 Canvas 2D 绘制，仅作向后兼容保留，将在 v4.0 移除。
 *     新代码请使用 DtSceneViewport + DtEngine。
 */

import {dtGetEntityColor} from "../constants";
import {dtCubeVertices, dtEntityBoundingBox, dtPlaneVertices, dtProjectPoint, dtShadeColor,} from "./DtProjection";
import type {DtCamera, DtEntity} from "../types";

export interface DtRenderContext {
    ctx: CanvasRenderingContext2D;
    camera: DtCamera;
    /** 选中实体 ID */
    selectedId: string | null;
}

/** 绘制立方体（3 个可见面 + 描边） */
export const dtDrawCube = (entity: DtEntity, rc: DtRenderContext): void => {
    const {ctx, camera} = rc;
    const verts3D = dtCubeVertices(entity);
    const pts = verts3D.map((p) => dtProjectPoint(p, camera));
    const baseColor = dtGetEntityColor(entity);

    // 三个可见面（顶面、前面、右面），按深度排序绘制
    // 顶面：4 5 6 7
    const top = [pts[4], pts[5], pts[6], pts[7]];
    // 前面：0 1 5 4
    const front = [pts[0], pts[1], pts[5], pts[4]];
    // 右面：1 2 6 5
    const right = [pts[1], pts[2], pts[6], pts[5]];

    // 三个面不同亮度（顶面亮、前面中、右面暗）
    const faces: { pts: typeof top; color: string }[] = [
        {pts: right, color: dtShadeColor(baseColor, 0.7)},
        {pts: front, color: dtShadeColor(baseColor, 0.85)},
        {pts: top, color: dtShadeColor(baseColor, 1.1)},
    ];

    faces.forEach((face) => {
        ctx.beginPath();
        ctx.moveTo(face.pts[0].x, face.pts[0].y);
        for (let i = 1; i < face.pts.length; i++) {
            ctx.lineTo(face.pts[i].x, face.pts[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = face.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
    });
};

/** 绘制圆柱（顶椭圆 + 底椭圆 + 侧面渐变） */
export const dtDrawCylinder = (entity: DtEntity, rc: DtRenderContext): void => {
    const {ctx, camera} = rc;
    const {position, size} = entity;
    const r = size.radius;
    const h = size.height;
    const baseColor = dtGetEntityColor(entity);

    const centerTop = dtProjectPoint({x: position.x, y: position.y + h, z: position.z}, camera);
    const centerBottom = dtProjectPoint({x: position.x, y: position.y, z: position.z}, camera);

    // 椭圆 y 半径（基于俯视角）= r * cos(pitch) * scale；x 半径 = r * scale
    const pitchRad = (camera.pitch * Math.PI) / 180;
    const scale = camera.zoom;
    const rx = r * scale;
    const ry = r * Math.abs(Math.cos(pitchRad)) * scale + 1;

    // 侧面渐变
    const grad = ctx.createLinearGradient(centerBottom.x - rx, 0, centerBottom.x + rx, 0);
    grad.addColorStop(0, dtShadeColor(baseColor, 0.6));
    grad.addColorStop(0.5, dtShadeColor(baseColor, 1.1));
    grad.addColorStop(1, dtShadeColor(baseColor, 0.6));

    // 侧面：从底椭圆两端连到顶椭圆两端
    ctx.beginPath();
    ctx.moveTo(centerBottom.x - rx, centerBottom.y);
    ctx.lineTo(centerTop.x - rx, centerTop.y);
    ctx.ellipse(centerTop.x, centerTop.y, rx, ry, 0, Math.PI, 0, false);
    ctx.lineTo(centerBottom.x + rx, centerBottom.y);
    ctx.ellipse(centerBottom.x, centerBottom.y, rx, ry, 0, 0, Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 顶面椭圆
    ctx.beginPath();
    ctx.ellipse(centerTop.x, centerTop.y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = dtShadeColor(baseColor, 1.15);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.stroke();
};

/** 绘制平面（4 顶点多边形） */
export const dtDrawPlane = (entity: DtEntity, rc: DtRenderContext): void => {
    const {ctx, camera} = rc;
    const verts3D = dtPlaneVertices(entity);
    const pts = verts3D.map((p) => dtProjectPoint(p, camera));
    const baseColor = dtGetEntityColor(entity);

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = dtShadeColor(baseColor, 0.5);
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
};

/** 绘制球体（圆形 + 径向渐变） */
export const dtDrawSphere = (entity: DtEntity, rc: DtRenderContext): void => {
    const {ctx, camera} = rc;
    const {position, size} = entity;
    const r = size.radius;
    const baseColor = dtGetEntityColor(entity);
    const center = dtProjectPoint(position, camera);
    const screenR = r * camera.zoom;

    const grad = ctx.createRadialGradient(
        center.x - screenR * 0.3,
        center.y - screenR * 0.3,
        screenR * 0.1,
        center.x,
        center.y,
        screenR,
    );
    grad.addColorStop(0, dtShadeColor(baseColor, 1.3));
    grad.addColorStop(0.5, baseColor);
    grad.addColorStop(1, dtShadeColor(baseColor, 0.5));

    ctx.beginPath();
    ctx.arc(center.x, center.y, screenR, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();
};

/** 绘制实体名称 */
export const dtDrawEntityLabel = (entity: DtEntity, rc: DtRenderContext): void => {
    const {ctx, camera} = rc;
    const center = dtProjectPoint(
        {x: entity.position.x, y: entity.position.y + (entity.size.height || entity.size.radius), z: entity.position.z},
        camera,
    );
    ctx.save();
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    // 白色描边背景
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.strokeText(entity.name, center.x, center.y - 4);
    ctx.fillStyle = "#333333";
    ctx.fillText(entity.name, center.x, center.y - 4);
    ctx.restore();
};

/** 绘制选中高亮（黄色虚线包围盒） */
export const dtDrawHighlight = (entity: DtEntity, rc: DtRenderContext): void => {
    const {ctx, camera} = rc;
    const bbox = dtEntityBoundingBox(entity, camera);
    if (!bbox) return;
    const pad = 6;
    ctx.save();
    ctx.strokeStyle = "#FAAD14";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(bbox.minX - pad, bbox.minY - pad, bbox.maxX - bbox.minX + pad * 2, bbox.maxY - bbox.minY + pad * 2);
    ctx.restore();
};

/** 统一绘制实体（按类型分发） */
export const dtDrawEntity = (entity: DtEntity, rc: DtRenderContext): void => {
    if (entity.visible === false) return;
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
};
