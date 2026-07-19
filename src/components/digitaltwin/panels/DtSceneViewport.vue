<script setup lang="ts" name="DtSceneViewport">
/**
 * 数字孪生 - 3D 视口（替换 DtSceneCanvas.vue）
 *
 * 职责：
 *  - Three.js WebGLRenderer 宿主
 *  - useDtEngine 引擎生命周期 + provide/inject
 *  - ResizeObserver 监听容器尺寸
 *  - 鼠标事件转发（按视口模式：view/edit/measure/annotation/inspection）
 *  - 视口模式切换 UI
 *  - 视角预设按钮（top/front/side/iso）
 *  - 性能 HUD 浮层
 *  - 旧 DtEntity[] 兼容映射为 Three.js Mesh
 *  - WebGL 不可用降级提示
 *
 * 注：鼠标事件用 requestAnimationFrame 节流（项目约定）。
 */
import {
    onBeforeUnmount,
    onMounted,
    ref,
    shallowRef,
    watch,
    computed,
    provide,
} from "vue";
import { i18n } from "@/lang";
import {
    BoxGeometry,
    CylinderGeometry,
    PlaneGeometry,
    SphereGeometry,
    MeshStandardMaterial,
    Mesh,
    Group,
    Color,
    GridHelper,
    AxesHelper,
    Raycaster,
    Vector2,
} from "three";
import type { Object3D } from "three";
import { useDtEngine, DtEngineKey } from "../composables/useDtEngine";
import { useDtScene } from "../composables/useDtScene";
import type {
    DtViewportMode,
    DtViewPreset3D,
    DtEntity,
    DtScene as DtLegacyScene,
} from "../types";
import DtPerformanceHud from "./DtPerformanceHud.vue";

const props = withDefaults(
    defineProps<{
        /** 旧版 entities 兼容（接收 DtScene 或 DtEntity[]，自动映射为 Three.js Mesh） */
        scene?: DtLegacyScene;
        entities?: DtEntity[];
        /** 初始视口模式 */
        mode?: DtViewportMode;
        /** 初始视角预设 */
        viewPreset?: DtViewPreset3D;
        /** 是否显示性能 HUD */
        showHud?: boolean;
        /** 是否启用阴影 */
        shadowMapEnabled?: boolean;
        /** 是否显示网格 */
        showGrid?: boolean;
        /** 是否显示坐标轴 */
        showAxes?: boolean;
    }>(),
    {
        scene: undefined,
        entities: undefined,
        mode: "view",
        viewPreset: "iso",
        showHud: true,
        shadowMapEnabled: true,
        showGrid: true,
        showAxes: true,
    },
);

const emit = defineEmits<{
    (e: "ready"): void;
    (e: "error", err: Error): void;
    (e: "select-node", path: string | null): void;
    /** 旧版兼容：选中实体 ID */
    (e: "select-entity", id: string | null): void;
}>();

/* ----------------------- 引擎与场景 ----------------------- */
const canvasRef = shallowRef<HTMLCanvasElement | null>(null);
const containerRef = shallowRef<HTMLDivElement | null>(null);
const webglAvailable = ref(true);
const webglError = ref<string | null>(null);

const { engine, ready, error, init } = useDtEngine({
    shadowMapEnabled: props.shadowMapEnabled,
    renderMode: "always",
});
provide(DtEngineKey, engine);

const sceneApi = useDtScene(engine);

/* ----------------------- 视口状态 ----------------------- */
const currentMode = ref<DtViewportMode>(props.mode);
const currentPreset = ref<DtViewPreset3D>(props.viewPreset);
const fps = ref(0);
const hoverNodePath = ref<string | null>(null);

const modeList: Array<{ value: DtViewportMode; labelKey: string; icon: string }> = [
    { value: "view", labelKey: "digitaltwin.viewport.mode.view", icon: "📷" },
    { value: "edit", labelKey: "digitaltwin.viewport.mode.edit", icon: "✋" },
    { value: "measure", labelKey: "digitaltwin.viewport.mode.measure", icon: "📏" },
    { value: "annotation", labelKey: "digitaltwin.viewport.mode.annotation", icon: "🏷" },
    { value: "inspection", labelKey: "digitaltwin.viewport.mode.inspection", icon: "🛰" },
];

const presetList: Array<{ value: DtViewPreset3D; labelKey: string }> = [
    { value: "top", labelKey: "digitaltwin.viewport.preset.top" },
    { value: "front", labelKey: "digitaltwin.viewport.preset.front" },
    { value: "side", labelKey: "digitaltwin.viewport.preset.side" },
    { value: "iso", labelKey: "digitaltwin.viewport.preset.iso" },
];

/* ----------------------- 鼠标事件 rAF 节流 ----------------------- */
let pendingMouseEvent: MouseEvent | null = null;
let rafScheduled = false;
const raycaster = new Raycaster();
const ndc = new Vector2();

const scheduleMouseEvent = (e: MouseEvent) => {
    pendingMouseEvent = e;
    if (!rafScheduled) {
        rafScheduled = true;
        requestAnimationFrame(() => {
            rafScheduled = false;
            if (pendingMouseEvent) {
                handleMouseHover(pendingMouseEvent);
                pendingMouseEvent = null;
            }
        });
    }
};

const handleMouseHover = (e: MouseEvent) => {
    const inst = engine.value;
    const canvas = canvasRef.value;
    if (!inst || !canvas) return;
    // 仅 view 模式做悬停拾取
    if (currentMode.value !== "view" && currentMode.value !== "edit") return;
    const rect = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, inst.cameraRig.camera);
    const intersects = raycaster.intersectObjects(
        inst.sceneManager.currentRoot.children,
        true,
    );
    // 跳过辅助物体（GridHelper/AxesHelper）
    const hit = intersects.find(
        (i) =>
            !(i.object instanceof GridHelper) &&
            !(i.object instanceof AxesHelper) &&
            !(i.object instanceof Group),
    );
    if (hit) {
        const path = findNodePath(inst.sceneManager.currentRoot, hit.object);
        hoverNodePath.value = path;
        canvas.style.cursor = currentMode.value === "view" ? "pointer" : "default";
    } else {
        hoverNodePath.value = null;
        canvas.style.cursor = currentMode.value === "view" ? "grab" : "default";
    }
};

const handleCanvasClick = (e: MouseEvent) => {
    const inst = engine.value;
    const canvas = canvasRef.value;
    if (!inst || !canvas) return;
    if (currentMode.value !== "view" && currentMode.value !== "edit") return;
    const rect = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, inst.cameraRig.camera);
    const intersects = raycaster.intersectObjects(
        inst.sceneManager.currentRoot.children,
        true,
    );
    const hit = intersects.find(
        (i) =>
            !(i.object instanceof GridHelper) &&
            !(i.object instanceof AxesHelper) &&
            !(i.object instanceof Group),
    );
    if (hit) {
        const path = findNodePath(inst.sceneManager.currentRoot, hit.object);
        if (path) {
            sceneApi.selectNode(path, e.ctrlKey || e.metaKey);
            emit("select-node", path);
            // 旧版兼容：通过 userData.entityId 派发
            const entityId = hit.object.userData?.entityId as string | undefined;
            if (entityId) emit("select-entity", entityId);
        }
    } else {
        sceneApi.selectNode(null);
        emit("select-node", null);
        emit("select-entity", null);
    }
};

/** 由 Object3D 向上回溯到 currentRoot 下的直接子节点 path */
const findNodePath = (root: Object3D, target: Object3D): string | null => {
    let cur: Object3D | null = target;
    while (cur && cur.parent && cur.parent !== root) {
        cur = cur.parent;
    }
    if (!cur) return null;
    return cur.name || cur.uuid;
};

/* ----------------------- 视口操作 ----------------------- */
const handleModeChange = (m: DtViewportMode) => {
    currentMode.value = m;
    // 切换模式时通知引擎（edit 模式后续接入 Gizmo）
    // 本批次仅 view 模式完整，其他模式预留
};

const handlePresetChange = async (p: DtViewPreset3D) => {
    currentPreset.value = p;
    if (engine.value) {
        await engine.value.cameraRig.applyPreset(p);
    }
};

const handleReset = async () => {
    if (engine.value) {
        await engine.value.cameraRig.applyPreset(props.viewPreset);
    }
};

/* ----------------------- 旧 entities 兼容映射 ----------------------- */
const STATUS_COLOR_MAP: Record<string, string> = {
    normal: "#52C41A",
    warning: "#FAAD14",
    alarm: "#F5222D",
    offline: "#8C8C8C",
};

const entityToObject3D = (entity: DtEntity): Object3D => {
    let geometry: BoxGeometry | CylinderGeometry | PlaneGeometry | SphereGeometry;
    const size = entity.size;
    switch (entity.type) {
        case "cube":
            geometry = new BoxGeometry(size.width, size.height || 1, size.depth);
            break;
        case "cylinder":
            geometry = new CylinderGeometry(size.radius, size.radius, size.height, 32);
            break;
        case "plane":
            geometry = new PlaneGeometry(size.width, size.depth, 1, 1);
            break;
        case "sphere":
            geometry = new SphereGeometry(size.radius, 32, 16);
            break;
        default:
            geometry = new BoxGeometry(size.width || 50, size.height || 50, size.depth || 50);
    }
    // 状态颜色优先于实体颜色
    const color = entity.status !== "normal"
        ? STATUS_COLOR_MAP[entity.status] ?? entity.color
        : entity.color;
    const material = new MeshStandardMaterial({
        color: new Color(color),
        metalness: 0.3,
        roughness: 0.6,
        emissive: entity.status === "alarm" ? new Color("#F5222D") : new Color("#000000"),
        emissiveIntensity: entity.status === "alarm" ? 0.4 : 0,
    });
    const mesh = new Mesh(geometry, material);
    mesh.name = entity.id;
    mesh.position.set(entity.position.x, entity.position.y + (entity.type === "cube" ? (size.height || 0) / 2 : 0), entity.position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.entityId = entity.id;
    mesh.userData.entityName = entity.name;
    mesh.userData.status = entity.status;
    if (entity.type === "plane") {
        mesh.rotation.x = -Math.PI / 2;
    }
    return mesh;
};

const syncEntitiesToScene = (entities: DtEntity[]) => {
    const inst = engine.value;
    if (!inst) return;
    // 清空 currentRoot 下除辅助物体外的所有节点
    const toRemove: Object3D[] = [];
    for (const child of inst.sceneManager.currentRoot.children) {
        if (!(child instanceof GridHelper) && !(child instanceof AxesHelper)) {
            toRemove.push(child);
        }
    }
    for (const child of toRemove) {
        inst.sceneManager.currentRoot.remove(child);
    }
    // 重新添加
    for (const entity of entities) {
        if (entity.visible === false) continue;
        const obj = entityToObject3D(entity);
        inst.sceneManager.addObject3D(obj, entity.name || entity.id);
    }
    inst.sceneManager.markDirty();
    // 应用初始视角
    inst.cameraRig.applyPreset(props.viewPreset).catch(() => void 0);
};

/* ----------------------- 辅助物体 ----------------------- */
let gridHelper: GridHelper | null = null;
let axesHelper: AxesHelper | null = null;

const setupHelpers = () => {
    const inst = engine.value;
    if (!inst) return;
    if (props.showGrid && !gridHelper) {
        gridHelper = new GridHelper(1000, 50, 0x444444, 0x2a2a2a);
        gridHelper.name = "grid_helper";
        inst.sceneManager.currentRoot.add(gridHelper);
    }
    if (props.showAxes && !axesHelper) {
        axesHelper = new AxesHelper(100);
        axesHelper.name = "axes_helper";
        inst.sceneManager.currentRoot.add(axesHelper);
    }
};

/* ----------------------- ResizeObserver ----------------------- */
let resizeObserver: ResizeObserver | null = null;

const handleResize = () => {
    const inst = engine.value;
    const container = containerRef.value;
    if (!inst || !container) return;
    const { width, height } = container.getBoundingClientRect();
    if (width > 0 && height > 0) {
        inst.resize(width, height);
    }
};

/* ----------------------- WebGL 检测 ----------------------- */
const checkWebGL = (): boolean => {
    try {
        const canvas = document.createElement("canvas");
        return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
        return false;
    }
};

/* ----------------------- 生命周期 ----------------------- */
onMounted(async () => {
    // 检测 WebGL
    if (!checkWebGL()) {
        webglAvailable.value = false;
        webglError.value = i18n("digitaltwin.viewport.webglUnavailable" as any);
        return;
    }
    if (!canvasRef.value || !containerRef.value) return;
    try {
        await init(canvasRef.value, containerRef.value);
        if (!engine.value) return;
        // 挂载辅助物体
        setupHelpers();
        // 同步旧 entities 兼容
        const legacyEntities = props.entities ?? props.scene?.entities;
        if (legacyEntities && legacyEntities.length > 0) {
            syncEntitiesToScene(legacyEntities);
        }
        // 性能 HUD
        if (props.showHud) {
            engine.value.performance.onStats((s) => {
                fps.value = s.fps;
            });
        }
        // 应用初始视角
        await engine.value.cameraRig.applyPreset(props.viewPreset);
        // ResizeObserver
        resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(containerRef.value);
        emit("ready");
    } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        webglError.value = e.message;
        emit("error", e);
    }
});

onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    resizeObserver = null;
    gridHelper = null;
    axesHelper = null;
});

/* ----------------------- watch ----------------------- */
watch(error, (e) => {
    if (e) emit("error", e);
});

// entities 变化重新映射
watch(
    () => props.entities ?? props.scene?.entities,
    (entities) => {
        if (entities && engine.value) {
            syncEntitiesToScene(entities);
        }
    },
    { deep: false },
);

const cursor = computed(() => {
    if (currentMode.value === "view") return hoverNodePath.value ? "pointer" : "grab";
    return "default";
});

/** 应用视角预设（供父组件通过 ref 调用，同步 3D 视口） */
const applyPreset = async (p: DtViewPreset3D): Promise<void> => {
    currentPreset.value = p;
    if (engine.value) {
        await engine.value.cameraRig.applyPreset(p);
    }
};

defineExpose({
    engine,
    sceneApi,
    ready,
    syncEntitiesToScene,
    applyPreset,
});
</script>

<template>
    <div class="dt-viewport" ref="containerRef">
        <!-- WebGL 不可用降级 -->
        <div v-if="!webglAvailable" class="dt-viewport-fallback">
            <el-icon :size="48"><Warning /></el-icon>
            <p class="dt-fallback-title">{{ i18n("digitaltwin.viewport.webglUnavailable" as any) }}</p>
            <p class="dt-fallback-desc">{{ webglError }}</p>
        </div>

        <template v-else>
            <canvas ref="canvasRef" class="dt-canvas" :style="{ cursor }" @click="handleCanvasClick" @mousemove="scheduleMouseEvent" />

            <!-- 顶部浮动工具栏 -->
            <div class="dt-viewport-toolbar">
                <el-button-group size="small">
                    <el-button
                        v-for="m in modeList"
                        :key="m.value"
                        :type="currentMode === m.value ? 'primary' : 'default'"
                        :title="i18n(m.labelKey as any)"
                        @click="handleModeChange(m.value)"
                    >
                        <span class="dt-mode-icon">{{ m.icon }}</span>
                    </el-button>
                </el-button-group>

                <el-divider direction="vertical" />

                <el-button-group size="small">
                    <el-button
                        v-for="p in presetList"
                        :key="p.value"
                        :type="currentPreset === p.value ? 'info' : 'default'"
                        :title="i18n(p.labelKey as any)"
                        @click="handlePresetChange(p.value)"
                    >
                        {{ i18n(p.labelKey as any) }}
                    </el-button>
                </el-button-group>

                <el-divider direction="vertical" />

                <el-button size="small" :title="i18n('digitaltwin.viewport.reset' as any)" @click="handleReset">
                    <el-icon><Refresh /></el-icon>
                </el-button>
            </div>

            <!-- 性能 HUD -->
            <DtPerformanceHud v-if="showHud && ready" :engine="engine" :fps="fps" />

            <!-- 底部提示 -->
            <div class="dt-viewport-hint">
                <span v-if="currentMode === 'view'">
                    {{ i18n("digitaltwin.viewport.hint.view" as any) }}
                </span>
                <span v-else-if="currentMode === 'edit'">
                    {{ i18n("digitaltwin.viewport.hint.edit" as any) }}
                </span>
                <span v-else-if="currentMode === 'measure'">
                    {{ i18n("digitaltwin.viewport.hint.measure" as any) }}
                </span>
                <span v-else-if="currentMode === 'annotation'">
                    {{ i18n("digitaltwin.viewport.hint.annotation" as any) }}
                </span>
                <span v-else-if="currentMode === 'inspection'">
                    {{ i18n("digitaltwin.viewport.hint.inspection" as any) }}
                </span>
                <el-divider direction="vertical" />
                <span class="dt-hint-hover" v-if="hoverNodePath">
                    {{ i18n("digitaltwin.viewport.hover" as any) }}: {{ hoverNodePath }}
                </span>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { Warning, Refresh } from "@element-plus/icons-vue";
export default { components: { Warning, Refresh } };
</script>

<style lang="scss" scoped>
.dt-viewport {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #1e1e1e;
    border-radius: 4px;
}

.dt-canvas {
    display: block;
    width: 100%;
    height: 100%;
    outline: none;
}

.dt-viewport-fallback {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-secondary);
    gap: 12px;

    .dt-fallback-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
    }

    .dt-fallback-desc {
        font-size: 12px;
        margin: 0;
        max-width: 360px;
        text-align: center;
    }
}

.dt-viewport-toolbar {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: rgba(30, 30, 30, 0.7);
    backdrop-filter: blur(8px);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 10;

    .dt-mode-icon {
        font-size: 14px;
        line-height: 1;
    }

    :deep(.el-divider--vertical) {
        border-color: rgba(255, 255, 255, 0.15);
        margin: 0 2px;
    }
}

.dt-viewport-hint {
    position: absolute;
    bottom: 12px;
    left: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.65);
    background: rgba(30, 30, 30, 0.7);
    backdrop-filter: blur(8px);
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    z-index: 10;
    pointer-events: none;

    .dt-hint-hover {
        color: rgba(255, 255, 255, 0.9);
        font-family: monospace;
    }

    :deep(.el-divider--vertical) {
        border-color: rgba(255, 255, 255, 0.15);
        margin: 0 2px;
    }
}
</style>
