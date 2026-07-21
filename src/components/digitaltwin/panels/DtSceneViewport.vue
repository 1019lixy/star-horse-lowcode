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
 *  - 编辑模式：TransformControls Gizmo（移动/旋转/缩放）
 *  - Shift+ 拖拽框选多个实体
 *  - 右键上下文菜单
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
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { SelectionBox } from "three/examples/jsm/interactive/SelectionBox.js";
import { SelectionHelper } from "three/examples/jsm/interactive/SelectionHelper.js";
import { useDtEngine, DtEngineKey } from "../composables/useDtEngine";
import { useDtScene } from "../composables/useDtScene";
import { dtFindModelPreset } from "../modelLibrary";
import type { DtModelInstance, DtModelPart } from "../types";
import type {
    DtViewportMode,
    DtViewPreset3D,
    DtEntity,
    DtScene as DtLegacyScene,
    DtPoint3D,
    DtSize3D,
} from "../types";
import DtPerformanceHud from "./DtPerformanceHud.vue";
import { ShSvgIcon } from "@/components/shared";

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
        /** 编辑模式（启用 Gizmo + 框选） */
        editMode?: boolean;
        /** 锁定的实体 ID 列表（锁定后不可拾取/拖拽） */
        lockedIds?: string[];
        /** 当前变换模式 */
        transformMode?: "translate" | "rotate" | "scale";
        /** 当前选中的实体 ID（用于 Gizmo 附加同步） */
        selectedEntityId?: string | null;
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
        editMode: false,
        lockedIds: () => [],
        transformMode: "translate",
        selectedEntityId: null,
    },
);

const emit = defineEmits<{
    (e: "ready"): void;
    (e: "error", err: Error): void;
    (e: "select-node", path: string | null): void;
    /** 旧版兼容：选中实体 ID */
    (e: "select-entity", id: string | null): void;
    /** 视口模式切换 */
    (e: "mode-change", mode: DtViewportMode): void;
    /** Gizmo 拖拽中（实时派发 position/size 变化，不进历史栈） */
    (e: "entity-transform", entityId: string, position: DtPoint3D, size: DtSize3D): void;
    /** Gizmo 拖拽结束（派发以触发 pushHistory） */
    (e: "entity-transform-end", entityId: string): void;
    /** 框选完成（返回框中的实体 ID 列表） */
    (e: "box-select", entityIds: string[]): void;
    /** 右键菜单（x/y 为屏幕坐标，entityId 为 null 表示空白处右键） */
    (e: "context-menu", x: number, y: number, entityId: string | null): void;
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
    { value: "view", labelKey: "digitaltwin.viewport.mode.view", icon: "modeView" },
    { value: "edit", labelKey: "digitaltwin.viewport.mode.edit", icon: "modeEdit" },
    { value: "measure", labelKey: "digitaltwin.viewport.mode.measure", icon: "modeMeasure" },
    { value: "annotation", labelKey: "digitaltwin.viewport.mode.annotation", icon: "modeAnnotate" },
    { value: "inspection", labelKey: "digitaltwin.viewport.mode.inspection", icon: "modeInspect" },
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
    // 框选进行中不处理 hover
    if (selectionBox) return;
    const inst = engine.value;
    const canvas = canvasRef.value;
    if (!inst || !canvas) return;
    // 仅 view/edit 模式做悬停拾取
    if (currentMode.value !== "view" && currentMode.value !== "edit") return;
    const rect = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, inst.cameraRig.camera);
    const intersects = raycaster.intersectObjects(
        inst.sceneManager.root.children,
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
        const path = findNodePath(inst.sceneManager.root, hit.object);
        hoverNodePath.value = path;
        canvas.style.cursor = currentMode.value === "view" ? "pointer" : "default";
    } else {
        hoverNodePath.value = null;
        canvas.style.cursor = currentMode.value === "view" ? "grab" : "default";
    }
};

const handleCanvasClick = (e: MouseEvent) => {
    // 框选刚结束的 click 不触发选中
    if (justFinishedBoxSelect) {
        justFinishedBoxSelect = false;
        return;
    }
    // Gizmo 拖拽刚结束的 click 不触发选中（防止清除选中导致 Gizmo detach）
    if (justFinishedTransform) {
        justFinishedTransform = false;
        return;
    }
    const inst = engine.value;
    const canvas = canvasRef.value;
    if (!inst || !canvas) return;
    if (currentMode.value !== "view" && currentMode.value !== "edit") return;
    const rect = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, inst.cameraRig.camera);
    const intersects = raycaster.intersectObjects(
        inst.sceneManager.root.children,
        true,
    );
    const hit = intersects.find(
        (i) =>
            !(i.object instanceof GridHelper) &&
            !(i.object instanceof AxesHelper) &&
            !(i.object instanceof Group),
    );
    if (hit) {
        const path = findNodePath(inst.sceneManager.root, hit.object);
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
    // edit 模式启用 Gizmo；其他模式分离
    if (m === "edit") {
        // 不依赖 props.editMode（父组件可能尚未同步），有选中实体即附加
        if (props.selectedEntityId) {
            attachTransformToSelected(props.selectedEntityId);
        }
    } else {
        detachTransform();
    }
    emit("mode-change", m);
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

/* ----------------------- TransformControls（Gizmo） ----------------------- */
let transformControls: TransformControls | null = null;
/** 拖拽中标志：用于跳过 entities 变化触发的全量重建，避免 Gizmo 被 detach */
let isTransforming = false;
/** Gizmo 拖拽刚结束标志：阻止紧随的 click 事件清除选中（类似 justFinishedBoxSelect） */
let justFinishedTransform = false;

const setupTransformControls = (): void => {
    const inst = engine.value;
    if (!inst || transformControls) return;
    try {
        transformControls = new TransformControls(inst.cameraRig.camera, inst.renderer.domElement);
        // 拖拽时禁用相机轨道
        transformControls.addEventListener("dragging-changed", (event: { value: boolean }) => {
            const orbit = inst.cameraRig.orbitControls;
            if (orbit) orbit.enabled = !event.value;
        });
        // 拖拽中实时派发位置/尺寸变化
        transformControls.addEventListener("objectChange", () => {
            isTransforming = true;
            const obj = transformControls?.object;
            if (!obj) return;
            const entityId = obj.userData?.entityId as string | undefined;
            if (!entityId) return;
            const position: DtPoint3D = { x: obj.position.x, y: obj.position.y, z: obj.position.z };
            const size = extractSizeFromObject(obj);
            emit("entity-transform", entityId, position, size);
        });
        // 拖拽结束（mouseUp）派发 entity-transform-end 以触发 pushHistory
        transformControls.addEventListener("mouseUp", () => {
            const obj = transformControls?.object;
            const entityId = obj?.userData?.entityId as string | undefined;
            if (entityId) emit("entity-transform-end", entityId);
            // 标记阻止紧随的 click 事件，防止清除选中导致 Gizmo detach
            justFinishedTransform = true;
            setTimeout(() => { justFinishedTransform = false; }, 150);
            // 拖拽结束后允许重建，使状态持久化并重新附加 Gizmo
            isTransforming = false;
            const entities = props.entities ?? props.scene?.entities ?? [];
            syncEntitiesToScene(entities);
        });
        // Three.js 0.180+ TransformControls 继承 Controls，需通过 getHelper() 添加到场景
        const helper = transformControls.getHelper();
        helper.name = "transform_controls_helper";
        inst.sceneManager.current.add(helper);
        // 注册渲染前回调，确保 Gizmo 每帧更新位置
        inst.onBeforeRender(() => {
            if (transformControls && transformControls.object) {
                transformControls.updateMatrixWorld();
            }
        });
        // eslint-disable-next-line no-console
        console.log("[DtSceneViewport] TransformControls initialized, helper added to scene");
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[DtSceneViewport] TransformControls init failed:", err);
        transformControls = null;
    }
};

/** 从 Object3D 提取 size（Group 从 userData.size，Mesh 从 geometry.parameters） */
const extractSizeFromObject = (obj: Object3D): DtSize3D => {
    // Group（复合模型）优先从 userData 拿保存的 size
    const userDataSize = obj.userData?.size as DtSize3D | undefined;
    if (userDataSize) {
        return { ...userDataSize };
    }
    const mesh = obj as Mesh;
    const geo = mesh.geometry;
    if (geo instanceof BoxGeometry) {
        return { width: geo.parameters.width, height: geo.parameters.height, depth: geo.parameters.depth, radius: 0 };
    }
    if (geo instanceof CylinderGeometry) {
        return { width: 0, height: geo.parameters.height, depth: 0, radius: geo.parameters.radiusTop };
    }
    if (geo instanceof PlaneGeometry) {
        return { width: geo.parameters.width, height: 0, depth: geo.parameters.height, radius: 0 };
    }
    if (geo instanceof SphereGeometry) {
        return { width: 0, height: 0, depth: 0, radius: geo.parameters.radius };
    }
    return { width: 0, height: 0, depth: 0, radius: 0 };
};

/** 附加 Gizmo 到指定实体 */
const attachTransformToSelected = (entityId: string | null): void => {
    if (!transformControls || !engine.value) {
        // eslint-disable-next-line no-console
        console.warn("[DtSceneViewport] attachTransform: transformControls or engine not ready", {
            hasTransformControls: !!transformControls,
            hasEngine: !!engine.value,
        });
        return;
    }
    // 仅在编辑模式（currentMode === edit 或 props.editMode）时附加
    const editActive = currentMode.value === "edit" || props.editMode;
    if (!entityId || !editActive) {
        transformControls.detach();
        return;
    }
    // 锁定实体不附加
    if (props.lockedIds.includes(entityId)) {
        transformControls.detach();
        return;
    }
    const root = engine.value.sceneManager.root;
    let target: Object3D | null = null;
    let candidateCount = 0;
    root.traverse((obj) => {
        if (obj.userData?.entityId === entityId) {
            candidateCount++;
            // 优先选 Group（复合模型根），其次 Mesh
            if (!target || (target instanceof Mesh && obj instanceof Group)) {
                target = obj;
            }
        }
    });
    if (target) {
        transformControls.attach(target);
        transformControls.setMode(props.transformMode);
        // eslint-disable-next-line no-console
        console.log("[DtSceneViewport] attachTransform: SUCCESS", {
            entityId,
            targetType: target instanceof Group ? "Group" : "Mesh",
            candidateCount,
            position: { x: target.position.x, y: target.position.y, z: target.position.z },
            visible: target.visible,
        });
    } else {
        transformControls.detach();
        // eslint-disable-next-line no-console
        console.warn("[DtSceneViewport] attachTransform: target not found", { entityId });
    }
};

/** 设置变换模式 */
const setTransformMode = (mode: "translate" | "rotate" | "scale"): void => {
    if (transformControls) transformControls.setMode(mode);
};

/** 分离 Gizmo */
const detachTransform = (): void => {
    transformControls?.detach();
};

/* ----------------------- Shift+ 拖拽框选 ----------------------- */
let selectionBox: SelectionBox | null = null;
let selectionHelper: SelectionHelper | null = null;
let justFinishedBoxSelect = false;

const handleCanvasMouseDown = (e: MouseEvent): void => {
    if (!props.editMode) return;
    // 仅 Shift+左键触发框选
    if (e.button !== 0 || !e.shiftKey) return;
    const inst = engine.value;
    if (!inst) return;
    // Gizmo 拖拽中则不触发框选
    if (transformControls?.dragging) return;

    selectionBox = new SelectionBox(inst.cameraRig.camera, inst.sceneManager.current);
    selectionHelper = new SelectionHelper(selectionBox, inst.renderer, "dt-box-select-helper");
    const rect = inst.renderer.domElement.getBoundingClientRect();
    selectionBox.startPoint.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
        0.5,
    );
    selectionBox.endPoint.copy(selectionBox.startPoint);
    selectionBox.select();
};

const handleCanvasMouseMove = (e: MouseEvent): void => {
    if (!selectionBox || !selectionHelper) return;
    const inst = engine.value;
    if (!inst) return;
    const rect = inst.renderer.domElement.getBoundingClientRect();
    selectionBox.endPoint.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
        0.5,
    );
    // 重新计算选中集
    const start = (selectionBox as any).selectionStart;
    if (start) selectionBox.startPoint.copy(start);
    selectionBox.select();
    // 仅保留有 userData.entityId 的对象（排除辅助物体）
    const entityIds = selectionBox.collection
        .filter((obj: Object3D) => obj.userData?.entityId && !props.lockedIds.includes(obj.userData.entityId))
        .map((obj: Object3D) => obj.userData.entityId as string);
    // 去重
    emit("box-select", [...new Set(entityIds)]);
};

const handleCanvasMouseUp = (): void => {
    if (selectionHelper) {
        selectionHelper.dispose();
        selectionHelper = null;
    }
    if (selectionBox) {
        selectionBox = null;
        justFinishedBoxSelect = true;
        // 短暂保留标记以阻止后续 click 事件
        setTimeout(() => { justFinishedBoxSelect = false; }, 100);
    }
};

/** canvas mousemove 统一入口：同时处理框选移动和 rAF 节流 hover */
const handleMouseMove = (e: MouseEvent): void => {
    handleCanvasMouseMove(e);
    scheduleMouseEvent(e);
};

/* ----------------------- 右键上下文菜单 ----------------------- */
const handleContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    const inst = engine.value;
    const canvas = canvasRef.value;
    if (!inst || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, inst.cameraRig.camera);
    const intersects = raycaster.intersectObjects(inst.sceneManager.root.children, true);
    const hit = intersects.find(
        (i) =>
            !(i.object instanceof GridHelper) &&
            !(i.object instanceof AxesHelper) &&
            !(i.object instanceof Group),
    );
    let entityId: string | null = null;
    if (hit) {
        entityId = (hit.object.userData?.entityId as string) ?? null;
        if (entityId && props.selectedEntityId !== entityId) {
            // 右键实体时自动选中它
            emit("select-entity", entityId);
        }
    }
    emit("context-menu", e.clientX, e.clientY, entityId);
};

/* ----------------------- 旧 entities 兼容映射 ----------------------- */
const STATUS_COLOR_MAP: Record<string, string> = {
    normal: "#52C41A",
    warning: "#FAAD14",
    alarm: "#F5222D",
    offline: "#8C8C8C",
};

/** 状态色覆盖（warning/alarm/offline 优先于 part 颜色，normal 用 part 原色） */
const resolvePartColor = (part: DtModelPart, fallback: string, status: DtEntity["status"]): string => {
    if (status === "offline") return STATUS_COLOR_MAP.offline;
    if (status === "alarm") return STATUS_COLOR_MAP.alarm;
    if (status === "warning") return STATUS_COLOR_MAP.warning;
    return part.color ?? fallback;
};

/** 构造单个 part 的 Mesh（cube/cylinder/plane/sphere） */
const buildPartMesh = (part: DtModelPart, fallbackColor: string, status: DtEntity["status"], entityId: string): Mesh => {
    const size = part.size;
    let geometry: BoxGeometry | CylinderGeometry | PlaneGeometry | SphereGeometry;
    switch (part.type) {
        case "cube":
            geometry = new BoxGeometry(
                Math.max(0.1, size.width),
                Math.max(0.1, size.height),
                Math.max(0.1, size.depth),
            );
            break;
        case "cylinder":
            geometry = new CylinderGeometry(
                Math.max(0.1, size.radius),
                Math.max(0.1, size.radius),
                Math.max(0.1, size.height),
                32,
            );
            break;
        case "plane":
            geometry = new PlaneGeometry(Math.max(0.1, size.width), Math.max(0.1, size.depth), 1, 1);
            break;
        case "sphere":
            geometry = new SphereGeometry(Math.max(0.1, size.radius), 32, 16);
            break;
        default:
            geometry = new BoxGeometry(1, 1, 1);
    }
    const color = resolvePartColor(part, fallbackColor, status);
    const material = new MeshStandardMaterial({
        color: new Color(color),
        metalness: 0.35,
        roughness: 0.55,
        emissive: status === "alarm" ? new Color(color) : new Color("#000000"),
        emissiveIntensity: status === "alarm" ? 0.25 : 0,
        transparent: part.type === "plane" && status === "normal" ? false : false,
    });
    const mesh = new Mesh(geometry, material);
    mesh.name = part.id;
    mesh.position.set(part.offset.x, part.offset.y, part.offset.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    // 关键：每个 part 都设置 entityId，保证 raycast 任意子 mesh 都能选中根实体
    mesh.userData.entityId = entityId;
    mesh.userData.partId = part.id;
    mesh.userData.animatable = part.animatable === true;
    if (part.type === "plane") {
        mesh.rotation.x = -Math.PI / 2;
    }
    return mesh;
};

/** 渲染单个 part 的几何体（用于在原 entityToObject3D 的基础类型分支） */
const buildPrimitiveMesh = (entity: DtEntity): Mesh => {
    const size = entity.size;
    let geometry: BoxGeometry | CylinderGeometry | PlaneGeometry | SphereGeometry;
    switch (entity.type) {
        case "cube":
            geometry = new BoxGeometry(
                Math.max(0.1, size.width),
                Math.max(0.1, size.height || 1),
                Math.max(0.1, size.depth),
            );
            break;
        case "cylinder":
            geometry = new CylinderGeometry(
                Math.max(0.1, size.radius),
                Math.max(0.1, size.radius),
                Math.max(0.1, size.height),
                32,
            );
            break;
        case "plane":
            geometry = new PlaneGeometry(Math.max(0.1, size.width), Math.max(0.1, size.depth), 1, 1);
            break;
        case "sphere":
            geometry = new SphereGeometry(Math.max(0.1, size.radius), 32, 16);
            break;
        default:
            geometry = new BoxGeometry(
                Math.max(0.1, size.width || 50),
                Math.max(0.1, size.height || 50),
                Math.max(0.1, size.depth || 50),
            );
    }
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
    mesh.position.set(
        entity.position.x,
        entity.position.y + (entity.type === "cube" ? (size.height || 0) / 2 : 0),
        entity.position.z,
    );
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

/**
 * 将 DtEntity 转为 Three.js Object3D：
 *  - 若实体为 DtModelInstance（带 modelType 字段）→ 按 preset.parts 组合 Group
 *  - 否则按基础几何体创建单一 Mesh
 *  返回的 Object3D.userData.entityId 始终等于 entity.id，保证 Raycaster/Gizmo 正确。
 */
const entityToObject3D = (entity: DtEntity): Object3D => {
    const modelInstance = entity as DtModelInstance;
    if (modelInstance.modelType) {
        const preset = dtFindModelPreset(modelInstance.modelType);
        if (preset && preset.parts && preset.parts.length > 0) {
            const group = new Group();
            group.name = entity.id;
            group.position.set(entity.position.x, entity.position.y, entity.position.z);
            group.userData.entityId = entity.id;
            group.userData.entityName = entity.name;
            group.userData.modelType = modelInstance.modelType;
            group.userData.status = entity.status;
            // 保存原始 size，便于 TransformControls 缩放回填
            group.userData.size = { ...entity.size };
            group.userData.defaultSize = { ...preset.defaultSize };
            // 标记为可动画根（用于后续动画系统查找 part 子 mesh）
            group.userData.animatableRoot = true;
            // 依次构造 part mesh 加入 group
            for (const part of preset.parts) {
                const mesh = buildPartMesh(part, preset.defaultColor, entity.status, entity.id);
                mesh.userData.modelType = modelInstance.modelType;
                group.add(mesh);
            }
            // 标记阴影
            group.traverse((o) => {
                if (o instanceof Mesh) {
                    o.castShadow = true;
                    o.receiveShadow = true;
                }
            });
            return group;
        }
        // 未找到 preset → fallback 为基础几何体
    }
    return buildPrimitiveMesh(entity);
};

const syncEntitiesToScene = (entities: DtEntity[]) => {
    const inst = engine.value;
    if (!inst) return;
    // 拖拽过程中禁止全量重建，否则 TransformControls 会被 detach 导致无法移动
    if (isTransforming) return;
    // 清空 currentRoot 下除辅助物体外的所有节点
    const root = inst.sceneManager.root;
    const toRemove: Object3D[] = [];
    for (const child of root.children) {
        if (!(child instanceof GridHelper) && !(child instanceof AxesHelper)) {
            toRemove.push(child);
        }
    }
    for (const child of toRemove) {
        root.remove(child);
    }
    // 重新添加
    for (const entity of entities) {
        if (entity.visible === false) continue;
        const obj = entityToObject3D(entity);
        inst.sceneManager.addObject3D(obj, entity.name || entity.id);
    }
    inst.sceneManager.markDirty();
    // 同步后重新附加 Gizmo 到当前选中
    if (props.editMode && props.selectedEntityId) {
        attachTransformToSelected(props.selectedEntityId);
    }
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
        inst.sceneManager.root.add(gridHelper);
    }
    if (props.showAxes && !axesHelper) {
        axesHelper = new AxesHelper(100);
        axesHelper.name = "axes_helper";
        inst.sceneManager.root.add(axesHelper);
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
        webglError.value = i18n("digitaltwin.viewport.webglUnavailable");
        return;
    }
    if (!canvasRef.value || !containerRef.value) return;
    try {
        await init(canvasRef.value, containerRef.value);
        if (!engine.value) return;
        // 初始化后立即 resize 一次，确保容器尺寸生效（el-splitter 可能延迟分配高度）
        handleResize();
        // 挂载辅助物体
        setupHelpers();
        // 设置 TransformControls
        setupTransformControls();
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
    transformControls?.dispose();
    transformControls = null;
    gridHelper = null;
    axesHelper = null;
    selectionHelper?.dispose();
    selectionHelper = null;
    selectionBox = null;
});

/* ----------------------- watch ----------------------- */
watch(error, (e) => {
    if (e) emit("error", e);
});

// entities 变化重新映射（deep:true 是必须的，因为 addEntity 用 push 不替换引用）
watch(
    () => props.entities ?? props.scene?.entities,
    (entities) => {
        if (entities && engine.value) {
            syncEntitiesToScene(entities);
        }
    },
    { deep: true },
);

// editMode 变化
watch(
    () => props.editMode,
    (m) => {
        if (!m) detachTransform();
        else if (props.selectedEntityId) attachTransformToSelected(props.selectedEntityId);
    },
);

// transformMode 变化
watch(
    () => props.transformMode,
    (m) => setTransformMode(m),
);

// selectedEntityId 变化 → 同步 Gizmo 附加
watch(
    () => props.selectedEntityId,
    (id) => attachTransformToSelected(id),
);

// lockedIds 变化 → 重新评估 Gizmo
watch(
    () => props.lockedIds,
    () => attachTransformToSelected(props.selectedEntityId),
    { deep: true },
);

const cursor = computed(() => {
    if (props.editMode) return "default";
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

/**
 * 飞行到指定位置（巡航/告警定位用）
 * @param pos 相机位置
 * @param target 相机看向的目标点
 * @param durationMs 过渡时长（0=立即）
 */
const flyTo = (pos: { x: number; y: number; z: number }, target: { x: number; y: number; z: number }, durationMs = 1500): void => {
    const rig = engine.value?.cameraRig;
    const cam = rig?.camera;
    if (!cam || !rig) return;
    const controls = rig.orbitControls;
    if (durationMs <= 0) {
        cam.position.set(pos.x, pos.y, pos.z);
        if (controls) {
            controls.target.set(target.x, target.y, target.z);
            controls.update();
        } else {
            cam.lookAt(target.x, target.y, target.z);
        }
        return;
    }
    const startPos = { x: cam.position.x, y: cam.position.y, z: cam.position.z };
    const startTarget = controls
        ? { x: controls.target.x, y: controls.target.y, z: controls.target.z }
        : { x: 0, y: 0, z: 0 };
    const startTime = performance.now();
    const animate = (ts: number): void => {
        const t = Math.min(1, (ts - startTime) / durationMs);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        cam.position.set(
            startPos.x + (pos.x - startPos.x) * eased,
            startPos.y + (pos.y - startPos.y) * eased,
            startPos.z + (pos.z - startPos.z) * eased,
        );
        if (controls) {
            controls.target.set(
                startTarget.x + (target.x - startTarget.x) * eased,
                startTarget.y + (target.y - startTarget.y) * eased,
                startTarget.z + (target.z - startTarget.z) * eased,
            );
            controls.update();
        } else {
            cam.lookAt(target.x, target.y, target.z);
        }
        if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
};

defineExpose({
    engine,
    sceneApi,
    ready,
    syncEntitiesToScene,
    applyPreset,
    setTransformMode,
    attachTransformToSelected,
    detachTransform,
    flyTo,
});
</script>

<template>
    <div class="dt-viewport" ref="containerRef">
        <!-- WebGL 不可用降级 -->
        <div v-if="!webglAvailable" class="dt-viewport-fallback">
            <el-icon :size="48"><Warning /></el-icon>
            <p class="dt-fallback-title">{{ i18n("digitaltwin.viewport.webglUnavailable") }}</p>
            <p class="dt-fallback-desc">{{ webglError }}</p>
        </div>

        <template v-else>
            <canvas
                ref="canvasRef"
                class="dt-canvas"
                :style="{ cursor }"
                @click="handleCanvasClick"
                @mousemove="handleMouseMove"
                @mousedown="handleCanvasMouseDown"
                @mouseup="handleCanvasMouseUp"
                @contextmenu.prevent="handleContextMenu"
            />

            <!-- 顶部浮动：仅视口模式切换（视角/重置在 DtToolbar） -->
            <div class="dt-viewport-toolbar">
                <el-button-group size="small">
                    <el-button
                        v-for="m in modeList"
                        :key="m.value"
                        :type="currentMode === m.value ? 'primary' : 'default'"
                        :title="i18n(m.labelKey as any)"
                        @click="handleModeChange(m.value)"
                    >
                        <ShSvgIcon :name="m.icon" size="14px" />
                        <span class="dt-mode-label">{{ i18n(m.labelKey as any) }}</span>
                    </el-button>
                </el-button-group>
            </div>

            <!-- 性能 HUD -->
            <DtPerformanceHud v-if="showHud && ready" :engine="engine" :fps="fps" />

            <!-- 底部提示 -->
            <div class="dt-viewport-hint">
                <span v-if="currentMode === 'view'">
                    {{ i18n("digitaltwin.viewport.hint.view") }}
                </span>
                <span v-else-if="currentMode === 'edit'">
                    {{ i18n("digitaltwin.viewport.hint.edit") }}
                </span>
                <span v-else-if="currentMode === 'measure'">
                    {{ i18n("digitaltwin.viewport.hint.measure") }}
                </span>
                <span v-else-if="currentMode === 'annotation'">
                    {{ i18n("digitaltwin.viewport.hint.annotation") }}
                </span>
                <span v-else-if="currentMode === 'inspection'">
                    {{ i18n("digitaltwin.viewport.hint.inspection") }}
                </span>
                <el-divider direction="vertical" />
                <span class="dt-hint-hover" v-if="hoverNodePath">
                    {{ i18n("digitaltwin.viewport.hover") }}: {{ hoverNodePath }}
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

    .dt-mode-label {
        margin-left: 4px;
        font-size: 12px;
        line-height: 1;
    }

    :deep(.el-button) {
        display: inline-flex;
        align-items: center;
        padding: 0 10px;
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

/* Shift+ 拖拽框选辅助框 */
:deep(.dt-box-select-helper) {
    position: absolute;
    border: 1px solid #409eff;
    background-color: rgba(64, 158, 255, 0.2);
    pointer-events: none;
    z-index: 20;
}
</style>
