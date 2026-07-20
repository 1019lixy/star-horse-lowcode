<script setup lang="ts" name="DigitalTwinDesigner">
/**
 * 数字孪生设计器 - 企业级主壳（v3.3）
 *
 * 替换 DigitalTwinViewer.vue 作为新入口。
 *
 * 架构：
 *   DtToolbar（顶部，8 按钮组） + el-splitter 三栏：
 *     左：DtEntityListPanel（实体列表）
 *     中：DtSceneViewport（3D 视口，含 Gizmo/框选/右键） + 浮动 DtLegendPanel
 *     右：DtPropertyPanel（属性面板）
 *   弹窗：DtEntityDialog（实体编辑） + DtCustomComponentDialog（自定义组件）
 *   右键菜单：DtContextMenu（场景级 + 实体级）
 *   文件 IO：导入/导出 JSON
 *   全局快捷键：Ctrl+Z/Y/S/D + Delete + Escape
 *   预览模式：隐藏面板，仅显示视口
 *
 * 复用 composables：
 *   useDigitalTwinDesigner（场景/实体状态 + undo/redo + import/export）
 *   useDigitalTwinCamera（旧 Canvas 2D 相机，仅供 DtToolbar 兼容）
 *   useDigitalTwinTelemetry（模拟数据生成）
 */
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { i18n } from "@/lang";
import { ElMessage, ElMessageBox } from "element-plus";
import DtToolbar from "./panels/DtToolbar.vue";
import DtSceneViewport from "./panels/DtSceneViewport.vue";
import DtEntityListPanel from "./panels/DtEntityListPanel.vue";
import DtModelLibraryPanel from "./panels/DtModelLibraryPanel.vue";
import DtPropertyPanel from "./panels/DtPropertyPanel.vue";
import DtLegendPanel from "./panels/DtLegendPanel.vue";
import DtContextMenu from "./panels/DtContextMenu.vue";
import type { DtContextMenuItem } from "./panels/DtContextMenu.vue";
import DtEntityDialog from "./dialogs/DtEntityDialog.vue";
import DtCustomComponentDialog from "./dialogs/DtCustomComponentDialog.vue";
import DtAlarmCenterPanel from "./panels/DtAlarmCenterPanel.vue";
import DtVideoMonitorPanel from "./panels/DtVideoMonitorPanel.vue";
import DtCruisePanel from "./panels/DtCruisePanel.vue";
import { ShSvgIcon } from "@/components/shared";
import { useDigitalTwinDesigner } from "./composables/useDigitalTwinDesigner";
import { useDigitalTwinCamera } from "./composables/useDigitalTwinCamera";
import { useDigitalTwinTelemetry } from "./composables/useDigitalTwinTelemetry";
import { useDtCruise } from "./composables/useDtCruise";
import { useDtAlarmStream } from "./composables/useDtAlarmStream";
import { useDtVideoMonitor } from "./composables/useDtVideoMonitor";
import { createDtEntity, dtCreateModelInstance, DT_CRUISE_PATH_PRESETS, DT_CAMERA_PRESETS, DT_ALARM_EVENT_PRESETS } from "./constants";
import { dtFindModelPreset } from "./modelLibrary";
import { importIfcFile, IFC_FILE_EXTENSIONS } from "./utils/DtIfcLoader";
import type { DtEntity, DtEntityType, DtPoint3D, DtScene, DtSize3D, DtViewPreset, DtModelPreset, DtCruisePath } from "./types";

const props = defineProps<{
    /** 旧版场景兼容（entities 自动映射为 Three.js Mesh） */
    scene?: DtScene;
    /** 自动开启模拟 */
    autoSim?: boolean;
}>();

const emit = defineEmits<{
    (e: "select-entity", id: string | null): void;
    (e: "ready"): void;
    (e: "save-scene", scene: DtScene): void;
}>();

const designer = useDigitalTwinDesigner(props.scene ? { ...props.scene } : undefined);
const camera = useDigitalTwinCamera();
const telemetry = useDigitalTwinTelemetry();

// 视口 ref
const viewportRef = ref<InstanceType<typeof DtSceneViewport> | null>(null);

// 编辑/预览状态
const editMode = ref(false);
const transformMode = ref<"translate" | "rotate" | "scale">("translate");
const previewMode = ref(false);
// 性能 HUD：默认关闭（按需开启，避免占用画面）
const hudVisible = ref(false);
// 图例：默认隐藏
const legendVisible = ref(false);
// 告警中心 / 视频监控 / 巡航面板：默认隐藏
const alarmCenterVisible = ref(false);
const videoMonitorVisible = ref(false);
const cruisePanelVisible = ref(false);
// 左侧面板当前激活的 Tab：entities（实体列表）/ library（组件库）
const activeLeftTab = ref<"entities" | "library">("entities");

/* ----------------------- 企业级运营功能 composables ----------------------- */
const alarmStream = useDtAlarmStream({
    onNewAlarm: () => {
        // 新告警到达时自动打开告警中心（首次）
        if (!alarmCenterVisible.value) {
            alarmCenterVisible.value = true;
        }
    },
});
const videoMonitor = useDtVideoMonitor();
const cruise = useDtCruise({
    onCameraUpdate: (pos, target) => {
        // 通过 viewport ref 更新相机位置
        viewportRef.value?.flyTo?.(pos, target, 0);
    },
});

// 初始化预设数据（告警 + 摄像头）
const initOperationData = (): void => {
    // 加载预设告警
    DT_ALARM_EVENT_PRESETS.forEach((a) => alarmStream.push(a));
    // 加载预设摄像头
    DT_CAMERA_PRESETS.forEach((c) => videoMonitor.addCamera(c));
};

// 绑定预设告警的 entityId（基于当前场景实体名匹配）
const bindAlarmEntities = (): void => {
    const events = alarmStream.events.value;
    const entities = designer.state.scene.entities;
    events.forEach((e) => {
        if (!e.entityId && e.entityName) {
            const matched = entities.find((en) => en.name === e.entityName);
            if (matched) e.entityId = matched.id;
        }
    });
};

// IFC 导入处理
const ifcInputRef = ref<HTMLInputElement | null>(null);
const handleImportIfc = (): void => {
    if (!ifcInputRef.value) return;
    ifcInputRef.value.click();
};
const handleIfcFileSelected = async (e: Event): Promise<void> => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!IFC_FILE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))) {
        ElMessage.error(i18n("digitaltwin.ifc.invalidFormat"));
        return;
    }
    try {
        const result = await importIfcFile(file, {
            onProgress: (p) => {
                ElMessage.info(`${p.stage} ${p.percent}%`);
            },
        });
        result.entities.forEach((en) => designer.addEntity(en));
        ElMessage.success(i18n("digitaltwin.ifc.importSuccess").replace("{count}", String(result.totalElements)).replace("{ms}", String(result.elapsedMs)));
        if (result.warnings.length) {
            // eslint-disable-next-line no-console
            console.warn("IFC warnings:", result.warnings);
        }
    } catch (err) {
        ElMessage.error(`${i18n("digitaltwin.ifc.importFailed")}: ${(err as Error).message}`);
    }
    input.value = "";
};

// 巡航启动 handler
const handleStartCruise = (pathId: string): void => {
    const path = DT_CRUISE_PATH_PRESETS.find((p) => p.id === pathId);
    if (!path) return;
    const cloned: DtCruisePath = JSON.parse(JSON.stringify(path));
    cruise.start(cloned);
};
const handleJumpWaypoint = (pathId: string, wpIndex: number): void => {
    const path = cruise.currentPath.value;
    if (path && path.id === pathId) {
        cruise.jumpTo(wpIndex);
    } else {
        handleStartCruise(pathId);
        setTimeout(() => cruise.jumpTo(wpIndex), 100);
    }
};

// 告警/摄像头联动定位
const handleLocateEntity = (entityId: string): void => {
    designer.selectEntity(entityId);
    const en = designer.state.scene.entities.find((e) => e.id === entityId);
    if (en) {
        viewportRef.value?.flyTo?.(
            { x: en.position.x + 100, y: en.position.y + 80, z: en.position.z + 100 },
            { x: en.position.x, y: en.position.y, z: en.position.z },
            1500,
        );
    }
};
const handleLocateCamera = (cameraId: string): void => {
    const cam = videoMonitor.cameras.value.find((c) => c.id === cameraId);
    if (!cam) return;
    viewportRef.value?.flyTo?.(
        { x: cam.position.x + 50, y: cam.position.y + 30, z: cam.position.z + 50 },
        { x: cam.position.x, y: cam.position.y, z: cam.position.z },
        1500,
    );
};

// 弹窗状态
const dialogVisible = ref(false);
const editingEntityId = ref<string | null>(null);
const editingSourceEntity = ref<DtEntity | null>(null);
const customComponentDialogVisible = ref(false);

// 文件导入 input
const fileInputRef = ref<HTMLInputElement | null>(null);

// 右键菜单状态
const contextMenu = reactive({
    visible: false,
    x: 0,
    y: 0,
    entityId: null as string | null,
});

const simRunning = computed(() => telemetry.simRunning.value);

const lockedEntityIds = computed(() =>
    designer.state.scene.entities.filter((e) => e.locked).map((e) => e.id),
);

const selectedEntity = computed(() => designer.selectedEntity.value);

// 加载场景
watch(
    () => props.scene,
    (s) => {
        if (s) designer.loadScene(s);
    },
    { deep: false },
);

// 选中变化通知父组件
watch(
    () => designer.state.selectedEntityId,
    (id) => emit("select-entity", id),
);

/* ----------------------- 视角切换 ----------------------- */
const handleViewChange = (preset: DtViewPreset): void => {
    camera.applyViewPreset(preset);
    const viewport = viewportRef.value;
    if (viewport && typeof viewport.applyPreset === "function") {
        viewport.applyPreset(preset as any).catch(() => void 0);
    }
};

/* ----------------------- 模拟切换 ----------------------- */
const handleToggleSim = (): void => {
    if (telemetry.simRunning.value) {
        telemetry.stopSim();
        designer.setSimRunning(false);
        ElMessage.info(i18n("digitaltwin.message.simStopped"));
    } else {
        telemetry.startSim(() => designer.state.scene.entities);
        designer.setSimRunning(true);
        ElMessage.success(i18n("digitaltwin.message.simStarted"));
    }
};

/* ----------------------- 实体编辑 ----------------------- */
const handleAddEntity = (): void => {
    editingEntityId.value = null;
    editingSourceEntity.value = null;
    dialogVisible.value = true;
};

const handleEditEntity = (id: string): void => {
    const entity = designer.state.scene.entities.find((e) => e.id === id);
    if (!entity) return;
    editingEntityId.value = id;
    editingSourceEntity.value = entity;
    dialogVisible.value = true;
};

const handleDialogSubmit = (entity: DtEntity, isNew: boolean): void => {
    if (isNew) {
        designer.addEntity(entity);
        ElMessage.success(i18n("digitaltwin.message.added"));
    } else {
        designer.updateEntity(entity.id, entity);
        ElMessage.success(i18n("digitaltwin.message.updated"));
    }
};

/* ----------------------- 视口选中 ----------------------- */
const handleSelectEntity = (id: string | null): void => {
    if (id !== designer.state.selectedEntityId) {
        designer.selectEntity(id);
    }
    emit("select-entity", id);
};

const handleSelectNode = (path: string | null): void => {
    if (!path) return;
    const viewport = viewportRef.value;
    const engine = viewport?.engine?.value;
    if (!engine) return;
    const node = engine.sceneManager.findByPath(path);
    const entityId = node?.object3D?.userData?.entityId as string | undefined;
    if (entityId && entityId !== designer.state.selectedEntityId) {
        designer.selectEntity(entityId);
        emit("select-entity", entityId);
    }
};

/* ----------------------- 视口变换事件 ----------------------- */
const handleEntityTransform = (entityId: string, position: DtPoint3D, size: DtSize3D): void => {
    // 实时更新（不进历史栈）
    designer.updateEntity(entityId, { position, size });
};

const handleEntityTransformEnd = (entityId: string): void => {
    // 拖拽结束，提交历史
    designer.commitUpdate();
};

const handleBoxSelect = (entityIds: string[]): void => {
    if (entityIds.length === 0) {
        designer.selectEntity(null);
    } else {
        designer.selectEntity(entityIds[0]);
        if (entityIds.length > 1) {
            ElMessage.info(i18n("digitaltwin.message.boxSelected").replace("{0}", String(entityIds.length)));
        }
    }
};

/* ----------------------- 右键菜单 ----------------------- */
const handleContextMenu = (x: number, y: number, entityId: string | null): void => {
    contextMenu.x = x;
    contextMenu.y = y;
    contextMenu.entityId = entityId;
    contextMenu.visible = true;
};

const canvasMenuItems = computed<DtContextMenuItem[]>(() => [
    { label: i18n("digitaltwin.contextMenu.new"), action: "new", icon: "newScene", shortcut: "Ctrl+N" },
    { divider: true },
    { label: i18n("digitaltwin.contextMenu.undo"), action: "undo", icon: "backward", shortcut: "Ctrl+Z", disabled: !designer.canUndo.value },
    { label: i18n("digitaltwin.contextMenu.redo"), action: "redo", icon: "forward", shortcut: "Ctrl+Y", disabled: !designer.canRedo.value },
    { divider: true },
    { label: i18n("digitaltwin.contextMenu.preview"), action: "preview", icon: "eye" },
    { label: i18n("digitaltwin.contextMenu.import"), action: "import", icon: "import" },
    { label: i18n("digitaltwin.contextMenu.export"), action: "export", icon: "export" },
    { divider: true },
    { label: i18n("digitaltwin.contextMenu.customComponent"), action: "customComponent", icon: "component" },
    { label: i18n("digitaltwin.contextMenu.save"), action: "save", icon: "save", shortcut: "Ctrl+S" },
]);

const entityMenuItems = computed<DtContextMenuItem[]>(() => [
    { label: i18n("digitaltwin.contextMenu.duplicate"), action: "duplicate", icon: "plus", shortcut: "Ctrl+D" },
    { label: i18n("digitaltwin.contextMenu.delete"), action: "delete", icon: "delete", shortcut: "Delete", danger: true },
    { divider: true },
    { label: i18n("digitaltwin.contextMenu.bringFront"), action: "bringFront", icon: "forward" },
    { label: i18n("digitaltwin.contextMenu.sendBack"), action: "sendBack", icon: "backward" },
]);

const handleContextMenuAction = (action: string): void => {
    contextMenu.visible = false;
    const entityId = contextMenu.entityId;
    switch (action) {
        case "new": handleNewScene(); break;
        case "undo": designer.undo(); break;
        case "redo": designer.redo(); break;
        case "preview": handleTogglePreview(); break;
        case "import": handleImportScene(); break;
        case "export": handleExportScene(); break;
        case "customComponent": handleOpenCustomComponent(); break;
        case "save": handleSaveScene(); break;
        case "duplicate":
            if (entityId) designer.duplicateEntity(entityId);
            break;
        case "delete":
            if (entityId) designer.removeEntity(entityId);
            break;
        case "bringFront":
            if (entityId) designer.moveEntityUp(entityId);
            break;
        case "sendBack":
            if (entityId) designer.moveEntityDown(entityId);
            break;
    }
};

/* ----------------------- 场景操作 ----------------------- */
const handleNewScene = (): void => {
    ElMessageBox.confirm(i18n("digitaltwin.message.confirmNew"), i18n("digitaltwin.contextMenu.new"), { type: "warning" })
        .then(() => {
            designer.newScene();
            ElMessage.success(i18n("digitaltwin.message.sceneCleared"));
        })
        .catch(() => {});
};

const handleImportScene = (): void => {
    fileInputRef.value?.click();
};

const handleFileImport = (e: Event): void => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        try {
            designer.importSceneJson(String(reader.result));
        } catch {
            ElMessage.error(i18n("digitaltwin.message.invalidSceneFile"));
        }
    };
    reader.readAsText(file);
    input.value = "";
};

const handleExportScene = (): void => {
    const json = designer.exportSceneJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${designer.state.scene.name || "digital-twin-scene"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    ElMessage.success(i18n("digitaltwin.message.sceneExported"));
};

const handleSaveScene = (): void => {
    const scene = designer.saveScene();
    emit("save-scene", scene);
    ElMessage.success(i18n("digitaltwin.message.sceneSaved"));
};

/* ----------------------- 预览模式 ----------------------- */
const handleTogglePreview = (): void => {
    previewMode.value = !previewMode.value;
    if (previewMode.value) editMode.value = false;
};

/* ----------------------- 性能 HUD 开关 ----------------------- */
const handleToggleHud = (): void => {
    hudVisible.value = !hudVisible.value;
};

/* ----------------------- 自定义组件 ----------------------- */
const handleOpenCustomComponent = (): void => {
    customComponentDialogVisible.value = true;
};

const handleAddCustomComponent = (preset: DtModelPreset): void => {
    const partType = (preset.parts[0]?.type || "cube") as DtEntityType;
    const entity = createDtEntity(partType, preset.labelKey || "Custom");
    entity.size = { ...preset.defaultSize };
    entity.color = preset.defaultColor;
    entity.customComponentType = preset.type;
    designer.addEntity(entity);
    ElMessage.success(i18n("digitaltwin.message.added"));
};

/* ----------------------- 视口模式同步 ----------------------- */
const handleViewportModeChange = (mode: string): void => {
    // 视口切换到 edit 时自动启用编辑模式，其他模式关闭
    editMode.value = mode === "edit";
};

/* ----------------------- 变换模式 ----------------------- */
const handleTransformModeChange = (mode: "translate" | "rotate" | "scale"): void => {
    transformMode.value = mode;
    editMode.value = true;
};

/* ----------------------- 面板快捷打开 ----------------------- */
const handleOpenLibrary = (): void => {
    // 切换左侧面板到组件库 Tab
    activeLeftTab.value = "library";
};

/* ----------------------- 从组件库添加模型 ----------------------- */
const handleAddModel = (modelType: string): void => {
    const preset = dtFindModelPreset(modelType);
    if (!preset) {
        ElMessage.warning(`Unknown model type: ${modelType}`);
        return;
    }
    // 计算放置位置：当前选中实体位置 + 偏移，或场景中心
    const selEntity = designer.selectedEntity.value;
    const baseX = selEntity ? selEntity.position.x + 80 : 0;
    const baseZ = selEntity ? selEntity.position.z + 80 : 0;
    // 使用 dtCreateModelInstance 创建复合模型实体
    const label = i18n(preset.labelKey as any);
    const entity = dtCreateModelInstance(
        modelType,
        `${label}_${designer.state.scene.entities.filter((e) => (e as any).modelType === modelType).length + 1}`,
        { x: baseX, y: 0, z: baseZ },
        "normal",
        preset.defaultAnimation,
    );
    // 应用 preset 默认尺寸
    entity.size = { ...preset.defaultSize };
    entity.color = preset.defaultColor;
    designer.addEntity(entity);
    designer.selectEntity(entity.id);
    ElMessage.success(i18n("digitaltwin.message.added"));
};

/* ----------------------- 视口就绪/错误 ----------------------- */
const handleViewportReady = (): void => {
    emit("ready");
};

const handleViewportError = (err: Error): void => {
    ElMessage.error(err.message || String(err));
};

/* ----------------------- 全局键盘快捷键 ----------------------- */
const handleKeyDown = (e: KeyboardEvent): void => {
    // 预览模式仅响应 Escape
    if (previewMode.value) {
        if (e.key === "Escape") handleTogglePreview();
        return;
    }
    const ctrl = e.ctrlKey || e.metaKey;
    const target = e.target as HTMLElement;
    const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

    if (ctrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        designer.undo();
    } else if ((ctrl && e.key === "y") || (ctrl && e.shiftKey && e.key === "Z")) {
        e.preventDefault();
        designer.redo();
    } else if (ctrl && e.key === "s") {
        e.preventDefault();
        handleSaveScene();
    } else if (ctrl && e.key === "d" && !isInput) {
        e.preventDefault();
        if (designer.state.selectedEntityId) designer.duplicateEntity(designer.state.selectedEntityId);
    } else if (e.key === "Delete" && !isInput) {
        if (designer.state.selectedEntityId) designer.removeEntity(designer.state.selectedEntityId);
    } else if (e.key === "Escape" && !isInput) {
        if (contextMenu.visible) contextMenu.visible = false;
        else designer.selectEntity(null);
    }
};

onMounted(() => {
    document.addEventListener("keydown", handleKeyDown);
    // 初始化运营数据（告警 + 摄像头）
    initOperationData();
    // 绑定预设告警到当前场景实体
    nextTick(() => bindAlarmEntities());
});

onBeforeUnmount(() => {
    document.removeEventListener("keydown", handleKeyDown);
    telemetry.stopSim();
});

/* ----------------------- 自动开启模拟 ----------------------- */
watch(
    () => props.autoSim,
    (auto) => {
        if (auto && !telemetry.simRunning.value) {
            telemetry.startSim(() => designer.state.scene.entities);
            designer.setSimRunning(true);
        }
    },
    { immediate: true },
);

defineExpose({
    designer,
    camera,
    telemetry,
    viewportRef,
});
</script>

<template>
    <div class="digital-twin-designer" :class="{ 'preview-mode': previewMode }">
        <dt-toolbar
            :camera="camera"
            :sim-running="simRunning"
            :can-undo="designer.canUndo.value"
            :can-redo="designer.canRedo.value"
            :edit-mode="editMode"
            :transform-mode="transformMode"
            :preview-mode="previewMode"
            :hud-visible="hudVisible"
            :legend-visible="legendVisible"
            :alarm-center-visible="alarmCenterVisible"
            :video-monitor-visible="videoMonitorVisible"
            :cruise-panel-visible="cruisePanelVisible"
            :unread-alarm-count="alarmStream.activeCount.value"
            :online-camera-count="videoMonitor.onlineCount.value"
            :total-camera-count="videoMonitor.totalCount.value"
            @view-change="handleViewChange"
            @toggle-sim="handleToggleSim"
            @add-entity="handleAddEntity"
            @open-library="handleOpenLibrary"
            @new-scene="handleNewScene"
            @import-scene="handleImportScene"
            @export-scene="handleExportScene"
            @save-scene="handleSaveScene"
            @undo="designer.undo"
            @redo="designer.redo"
            @toggle-preview="handleTogglePreview"
            @toggle-edit="editMode = !editMode"
            @toggle-legend="legendVisible = !legendVisible"
            @toggle-hud="handleToggleHud"
            @toggle-alarm-center="alarmCenterVisible = !alarmCenterVisible"
            @toggle-video-monitor="videoMonitorVisible = !videoMonitorVisible"
            @toggle-cruise-panel="cruisePanelVisible = !cruisePanelVisible"
            @import-ifc="handleImportIfc"
            @open-custom-component="handleOpenCustomComponent"
            @transform-mode-change="handleTransformModeChange"
        />
        <!-- IFC 隐藏文件输入 -->
        <input
            ref="ifcInputRef"
            type="file"
            :accept="IFC_FILE_EXTENSIONS.join(',')"
            style="display:none"
            @change="handleIfcFileSelected"
        />
        <!-- 浮动面板：告警中心 / 视频监控 / 巡航 -->
        <DtAlarmCenterPanel
            v-if="alarmCenterVisible"
            :alarm-stream="alarmStream"
            floating
            @locate-entity="handleLocateEntity"
            @close="alarmCenterVisible = false"
        />
        <DtVideoMonitorPanel
            v-if="videoMonitorVisible"
            :video-monitor="videoMonitor"
            floating
            @locate-camera="handleLocateCamera"
            @close="videoMonitorVisible = false"
        />
        <DtCruisePanel
            v-if="cruisePanelVisible"
            :cruise="cruise"
            :available-paths="DT_CRUISE_PATH_PRESETS"
            floating
            @start-path="handleStartCruise"
            @jump-waypoint="handleJumpWaypoint"
            @close="cruisePanelVisible = false"
        />

        <el-splitter v-if="!previewMode" class="viewer-body" layout="horizontal">
            <el-splitter-panel size="280px" min="220px" max="440px">
                <div class="left-panel-wrapper">
                    <el-tabs v-model="activeLeftTab" class="left-tabs">
                        <el-tab-pane name="entities">
                            <template #label>
                                <span class="tab-label">
                                    <ShSvgIcon name="list" size="14px" />
                                    {{ i18n("digitaltwin.entity.title") }}
                                </span>
                            </template>
                            <dt-entity-list-panel
                                :designer="designer"
                                @add-entity="handleAddEntity"
                                @edit-entity="handleEditEntity"
                            />
                        </el-tab-pane>
                        <el-tab-pane name="library">
                            <template #label>
                                <span class="tab-label">
                                    <ShSvgIcon name="component" size="14px" />
                                    {{ i18n("digitaltwin.toolbar.library") }}
                                </span>
                            </template>
                            <dt-model-library-panel @add-model="handleAddModel" />
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-splitter-panel>
            <el-splitter-panel>
                <div class="canvas-area">
                    <dt-scene-viewport
                        ref="viewportRef"
                        :scene="designer.state.scene"
                        :show-hud="hudVisible"
                        :show-grid="true"
                        :show-axes="true"
                        :mode="editMode ? 'edit' : 'view'"
                        :edit-mode="editMode"
                        :locked-ids="lockedEntityIds"
                        :transform-mode="transformMode"
                        :selected-entity-id="designer.state.selectedEntityId"
                        @ready="handleViewportReady"
                        @error="handleViewportError"
                        @select-entity="handleSelectEntity"
                        @select-node="handleSelectNode"
                        @entity-transform="handleEntityTransform"
                        @entity-transform-end="handleEntityTransformEnd"
                        @box-select="handleBoxSelect"
                        @mode-change="handleViewportModeChange"
                        @context-menu="handleContextMenu"
                    />
                    <!-- 浮动图例（absolute 定位，默认隐藏） -->
                    <dt-legend-panel v-if="legendVisible" :designer="designer" class="floating-legend" />
                </div>
            </el-splitter-panel>
            <el-splitter-panel size="300px" min="220px" max="440px">
                <dt-property-panel :designer="designer" :telemetry="telemetry" />
            </el-splitter-panel>
        </el-splitter>

        <!-- 预览模式：仅显示视口 -->
        <div v-else class="preview-canvas">
            <dt-scene-viewport
                ref="viewportRef"
                :scene="designer.state.scene"
                :show-hud="false"
                :show-grid="false"
                :show-axes="false"
                mode="view"
                :edit-mode="false"
            />
            <el-button class="exit-preview-btn" type="primary" @click="handleTogglePreview">
                <ShSvgIcon name="eyeOff" />
                {{ i18n("digitaltwin.toolbar.previewExit") }}
            </el-button>
        </div>

        <!-- 右键菜单 -->
        <DtContextMenu
            v-if="contextMenu.visible"
            :items="contextMenu.entityId ? entityMenuItems : canvasMenuItems"
            :position="{ x: contextMenu.x, y: contextMenu.y }"
            @action="handleContextMenuAction"
            @close="contextMenu.visible = false"
        />

        <!-- 弹窗 -->
        <dt-entity-dialog
            v-model:visible="dialogVisible"
            :entity-id="editingEntityId"
            :source-entity="editingSourceEntity"
            @submit="handleDialogSubmit"
        />
        <DtCustomComponentDialog
            v-model:visible="customComponentDialogVisible"
            :selected-entity="selectedEntity"
            @add-custom-component="handleAddCustomComponent"
        />

        <!-- 隐藏文件输入（用于导入） -->
        <input ref="fileInputRef" type="file" accept=".json" style="display:none" @change="handleFileImport" />
    </div>
</template>

<style lang="scss" scoped>
.digital-twin-designer {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--el-bg-color-page);
    overflow: hidden;

    .viewer-body {
        flex: 1;
        overflow: hidden;
        display: flex;

        :deep(.el-splitter) {
            width: 100%;
            height: 100%;
        }
    }

    .canvas-area {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .left-panel-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background: var(--el-bg-color);
        border-right: 1px solid var(--el-border-color-lighter);
    }

    .left-tabs {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        :deep(.el-tabs__header) {
            margin: 0;
            padding: 0 8px;
            flex-shrink: 0;
        }

        :deep(.el-tabs__content) {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        :deep(.el-tab-pane) {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .tab-label {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
        }
    }

    .floating-legend {
        position: absolute;
        bottom: 12px;
        right: 12px;
        z-index: 5;
        max-height: 40%;
        overflow: auto;
        background: rgba(30, 30, 30, 0.85);
        backdrop-filter: blur(8px);
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
}

.preview-canvas {
    flex: 1;
    position: relative;
    overflow: hidden;

    .exit-preview-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 10;
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }
}
</style>
