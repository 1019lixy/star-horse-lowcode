<script setup lang="ts" name="DtSceneCanvas">
/**
 * 数字孪生 - 中央 Canvas 3D 场景画布（核心组件）
 *
 * 职责：渲染循环 / 鼠标交互（拖拽旋转、滚轮缩放、平移）/ 点击拾取 / 高亮选中
 * 注：本组件承担渲染循环 + 多种鼠标交互 + 拾取算法，行数较多（合理超 350 行）
 *
 * @deprecated v3.2 起数字孪生改用 Three.js WebGL2 引擎（见 panels/DtSceneViewport.vue）。
 *     本组件基于 Canvas 2D 等距投影，仅作向后兼容保留，将在 v4.0 移除。
 *     新代码请使用 DtSceneViewport + DigitalTwinDesigner。
 */
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { i18n } from "@/lang";
import { DT_DEFAULT_COLORS, DT_GRID_DIVISIONS, DT_GRID_SIZE } from "../constants";
import { dtDepthSort, dtEntityBoundingBox, dtProjectPoint } from "../utils/DtProjection";
import { dtDrawEntity, type DtRenderContext } from "../utils/DtEntityRenderer";
import { dtDrawModelInstanceWithParts } from "../utils/DtModelRenderer";
import { dtAnimatePart } from "../utils/DtModelAnimator";
import { dtFindModelPreset } from "../modelLibrary";
import type { DtEntity, DtModelInstance } from "../types";
import type { UseDigitalTwinCameraReturn } from "../composables/useDigitalTwinCamera";
import type { UseDigitalTwinDesignerReturn } from "../composables/useDigitalTwinDesigner";
import type { UseDigitalTwinAnimationReturn } from "../composables/useDigitalTwinAnimation";

const props = defineProps<{
    designer: UseDigitalTwinDesignerReturn;
    camera: UseDigitalTwinCameraReturn;
    /** 动画循环 composable（可选，未传则不应用动画） */
    animation?: UseDigitalTwinAnimationReturn;
}>();

const emit = defineEmits<{
    (e: "select-entity", id: string | null): void;
}>();

const wrapperRef = shallowRef<HTMLElement | null>(null);
const canvasRef = shallowRef<HTMLCanvasElement | null>(null);
const canvasWidth = ref(800);
const canvasHeight = ref(600);

const designer = props.designer;
const camera = props.camera;

const entities = computed(() => designer.state.scene.entities);
const selectedId = computed(() => designer.state.selectedEntityId);
// 触发响应式刷新（模拟运行时 sensorData 变化也会触发重绘）
const simTick = computed(() => designer.state.simRunning);

let rafId: number | null = null;
let resizeObserver: ResizeObserver | null = null;

/** 主渲染函数 */
const render = (): void => {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvasWidth.value;
    const h = canvasHeight.value;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // 清空 + 背景
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#FAFAFA";
    ctx.fillRect(0, 0, w, h);

    // 居中相机平移基准
    const basePanX = w / 2;
    const basePanY = h / 2;
    const cam = camera.camera;
    // 临时相机：把 panX/panY 作为相对中心的偏移
    const renderCam = {
        ...cam,
        panX: basePanX + cam.panX,
        panY: basePanY + cam.panY,
    };

    // 绘制网格
    drawGridWithCam(ctx, renderCam);

    // 动画状态（用于模型实例部件变换）
    const animState = props.animation?.state.value;

    // 深度排序后绘制实体（区分普通实体与模型实例）
    const sorted = dtDepthSort(entities.value, renderCam);
    const rc: DtRenderContext = { ctx, camera: renderCam, selectedId: selectedId.value };
    sorted.forEach((e) => {
        const inst = e as DtModelInstance;
        if (inst.modelType) {
            drawModelInstanceWithAnimation(inst, rc, animState);
        } else {
            dtDrawEntity(e, rc);
        }
    });

    // 空场景提示
    if (entities.value.length === 0) {
        ctx.save();
        ctx.fillStyle = "#8C8C8C";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(i18n("digitaltwin.scene.empty"), w / 2, h / 2);
        ctx.restore();
    }
};

/** 绘制带动画的模型实例 */
const drawModelInstanceWithAnimation = (
    instance: DtModelInstance,
    rc: DtRenderContext,
    animState: { elapsed: number } | undefined,
): void => {
    if (instance.visible === false) return;
    const preset = dtFindModelPreset(instance.modelType);
    if (!preset) return;
    const animation = instance.animation ?? preset.defaultAnimation;
    if (animation && animState && animation.partId) {
        const targetPart = preset.parts.find((p) => p.id === animation.partId);
        if (targetPart) {
            const animatedPart = dtAnimatePart(targetPart, animation, animState);
            const tempParts = preset.parts.map((p) => (p.id === animation.partId ? animatedPart : p));
            dtDrawModelInstanceWithParts(instance, tempParts, rc);
            return;
        }
    }
    dtDrawModelInstanceWithParts(instance, preset.parts, rc);
};

/** 用指定相机绘制网格（避免修改全局） */
const drawGridWithCam = (ctx: CanvasRenderingContext2D, cam: typeof camera.camera): void => {
    const divs = DT_GRID_DIVISIONS;
    const size = DT_GRID_SIZE;
    const half = (divs * size) / 2;
    ctx.save();
    ctx.strokeStyle = DT_DEFAULT_COLORS.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= divs; i++) {
        const p = -half + i * size;
        const a = dtProjectPoint({ x: p, y: 0, z: -half }, cam);
        const b = dtProjectPoint({ x: p, y: 0, z: half }, cam);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        const c = dtProjectPoint({ x: -half, y: 0, z: p }, cam);
        const d = dtProjectPoint({ x: half, y: 0, z: p }, cam);
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
    }
    ctx.restore();
};

/** 渲染循环 */
const loop = (): void => {
    render();
    rafId = window.requestAnimationFrame(loop);
};

/** 更新画布尺寸 */
const updateSize = (): void => {
    if (!wrapperRef.value) return;
    const rect = wrapperRef.value.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
        canvasWidth.value = Math.floor(rect.width);
        canvasHeight.value = Math.floor(rect.height);
    }
};

// ============== 鼠标交互 ==============
const dragging = ref<{ startX: number; startY: number; lastX: number; lastY: number; mode: "rotate" | "pan" } | null>(null);
const movedDuringDrag = ref(false);

const getMousePos = (e: MouseEvent): { x: number; y: number } => {
    const rect = wrapperRef.value?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
};

/** 拾取：返回点击命中的实体（按深度倒序，命中第一个） */
const pickEntity = (x: number, y: number): DtEntity | null => {
    const basePanX = canvasWidth.value / 2;
    const basePanY = canvasHeight.value / 2;
    const cam = camera.camera;
    const renderCam = {
        ...cam,
        panX: basePanX + cam.panX,
        panY: basePanY + cam.panY,
    };
    const sorted = dtDepthSort(entities.value, renderCam);
    for (const e of sorted) {
        // 模型实例：用 preset.defaultSize 构造 cube 包围盒
        const inst = e as DtModelInstance;
        if (inst.modelType) {
            const preset = dtFindModelPreset(inst.modelType);
            if (!preset) continue;
            const bboxEntity: DtEntity = {
                id: `${inst.id}_bbox`,
                type: "cube",
                name: "",
                position: { ...inst.position },
                size: { ...preset.defaultSize },
                color: inst.color,
                status: inst.status,
                visible: true,
            };
            const bbox = dtEntityBoundingBox(bboxEntity, renderCam);
            if (!bbox) continue;
            if (x >= bbox.minX && x <= bbox.maxX && y >= bbox.minY && y <= bbox.maxY) {
                return e;
            }
            continue;
        }
        const bbox = dtEntityBoundingBox(e, renderCam);
        if (!bbox) continue;
        if (x >= bbox.minX && x <= bbox.maxX && y >= bbox.minY && y <= bbox.maxY) {
            return e;
        }
    }
    return null;
};

const onMouseDown = (e: MouseEvent): void => {
    if (e.button !== 0 && e.button !== 1 && e.button !== 2) return;
    e.preventDefault();
    const pos = getMousePos(e);
    // 右键或中键：平移；左键：旋转
    const mode = e.button === 0 ? "rotate" : "pan";
    dragging.value = { startX: pos.x, startY: pos.y, lastX: pos.x, lastY: pos.y, mode };
    movedDuringDrag.value = false;
};

const onMouseMove = (e: MouseEvent): void => {
    if (!dragging.value) return;
    const pos = getMousePos(e);
    const dx = pos.x - dragging.value.lastX;
    const dy = pos.y - dragging.value.lastY;
    if (Math.abs(pos.x - dragging.value.startX) > 3 || Math.abs(pos.y - dragging.value.startY) > 3) {
        movedDuringDrag.value = true;
    }
    if (dragging.value.mode === "rotate") {
        camera.rotate(dx * 0.5, -dy * 0.5);
    } else {
        camera.pan(dx, dy);
    }
    dragging.value.lastX = pos.x;
    dragging.value.lastY = pos.y;
};

const onMouseUp = (e: MouseEvent): void => {
    const wasDragging = dragging.value;
    dragging.value = null;
    if (!wasDragging) return;
    // 如果没有移动过，视为点击拾取
    if (!movedDuringDrag.value && e.button === 0) {
        const pos = getMousePos(e);
        const hit = pickEntity(pos.x, pos.y);
        if (hit) {
            designer.selectEntity(hit.id);
            emit("select-entity", hit.id);
        } else {
            designer.selectEntity(null);
            emit("select-entity", null);
        }
    }
};

const onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    if (e.deltaY < 0) camera.zoomIn();
    else camera.zoomOut();
};

const onContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
};

// ============== 生命周期 ==============
onMounted(() => {
    updateSize();
    resizeObserver = new ResizeObserver(() => updateSize());
    if (wrapperRef.value) resizeObserver.observe(wrapperRef.value);
    loop();
});

onBeforeUnmount(() => {
    if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
    }
    resizeObserver?.disconnect();
    resizeObserver = null;
});

// 暴露刷新方法
defineExpose({
    render,
    pickEntity,
});

// 监听 simTick 触发响应式（仅用于让 watch 知道需要重绘，实际渲染循环已持续运行）
watch(simTick, () => {
    /* 渲染循环已处理 */
});
</script>

<template>
    <div
        class="dt-canvas-wrapper"
        ref="wrapperRef"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @wheel="onWheel"
        @contextmenu="onContextMenu"
    >
        <canvas ref="canvasRef" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }" />
        <div class="dt-hint">{{ i18n("digitaltwin.scene.hint") }}</div>
    </div>
</template>

<style lang="scss" scoped>
.dt-canvas-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: #FAFAFA;
    cursor: grab;

    &:active {
        cursor: grabbing;
    }

    canvas {
        display: block;
    }

    .dt-hint {
        position: absolute;
        left: 12px;
        bottom: 12px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
        background: rgba(255, 255, 255, 0.7);
        padding: 4px 8px;
        border-radius: 4px;
        pointer-events: none;
    }
}
</style>
