<script setup lang="ts" name="DigitalTwinDesigner">
/**
 * 数字孪生设计器 - 企业级主壳（v3.2）
 *
 * 替换 DigitalTwinViewer.vue 作为新入口。复用旧版工具栏/列表/属性/图例/弹窗，
 * 仅将中间画布替换为新 3D 视口（DtSceneViewport + Three.js WebGL2 引擎）。
 *
 * 架构：
 *   DtToolbar（顶部） + DtEntityListPanel（左） + DtSceneViewport（中，3D）
 *   + DtLegendPanel（中下） + DtPropertyPanel（右） + DtEntityDialog（弹窗）
 *
 * 复用 composables：
 *   useDigitalTwinDesigner（场景/实体状态）
 *   useDigitalTwinCamera（旧 Canvas 2D 相机，仅供 DtToolbar 兼容；3D 视口自带 Three.js 相机）
 *   useDigitalTwinTelemetry（模拟数据生成）
 *
 * 注：批次 1 内 DtToolbar 视角按钮与 3D 视口相机为两套独立系统，过渡状态。
 *     用户主要通过 DtSceneViewport 自带的视角预设按钮操作 3D 视口。
 *     批次 2 将统一相机系统。
 */
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { i18n } from "@/lang";
import { ElMessage } from "element-plus";
import DtToolbar from "./panels/DtToolbar.vue";
import DtSceneViewport from "./panels/DtSceneViewport.vue";
import DtEntityListPanel from "./panels/DtEntityListPanel.vue";
import DtPropertyPanel from "./panels/DtPropertyPanel.vue";
import DtLegendPanel from "./panels/DtLegendPanel.vue";
import DtEntityDialog from "./dialogs/DtEntityDialog.vue";
import { useDigitalTwinDesigner } from "./composables/useDigitalTwinDesigner";
import { useDigitalTwinCamera } from "./composables/useDigitalTwinCamera";
import { useDigitalTwinTelemetry } from "./composables/useDigitalTwinTelemetry";
import type { DtEntity, DtScene, DtViewPreset } from "./types";

const props = defineProps<{
    /** 旧版场景兼容（entities 自动映射为 Three.js Mesh） */
    scene?: DtScene;
    /** 自动开启模拟 */
    autoSim?: boolean;
}>();

const emit = defineEmits<{
    (e: "select-entity", id: string | null): void;
    (e: "ready"): void;
}>();

const designer = useDigitalTwinDesigner(props.scene ? { ...props.scene } : undefined);
const camera = useDigitalTwinCamera();
const telemetry = useDigitalTwinTelemetry();

// 视口 ref（用于调用视口方法，如同步视角预设）
const viewportRef = ref<InstanceType<typeof DtSceneViewport> | null>(null);

// 弹窗状态
const dialogVisible = ref(false);
const editingEntityId = ref<string | null>(null);
const editingSourceEntity = ref<DtEntity | null>(null);

const simRunning = computed(() => telemetry.simRunning.value);

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

// 视角切换（DtToolbar 触发，旧 Canvas 2D 相机兼容调用；同时尝试同步 3D 视口）
const handleViewChange = (preset: DtViewPreset): void => {
    // 旧 Canvas 2D 相机（保留兼容，不影响 3D 视口）
    camera.applyViewPreset(preset);
    // 同步 3D 视口（DtViewPreset 与 DtViewPreset3D 字面量重叠：top/front/side/iso）
    const viewport = viewportRef.value;
    if (viewport && typeof (viewport as any).applyPreset === "function") {
        (viewport as any).applyPreset(preset as any).catch(() => void 0);
    }
};

// 模拟切换
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

// 新增实体
const handleAddEntity = (): void => {
    editingEntityId.value = null;
    editingSourceEntity.value = null;
    dialogVisible.value = true;
};

// 编辑实体
const handleEditEntity = (id: string): void => {
    const entity = designer.state.scene.entities.find((e) => e.id === id);
    if (!entity) return;
    editingEntityId.value = id;
    editingSourceEntity.value = entity;
    dialogVisible.value = true;
};

// 弹窗提交
const handleDialogSubmit = (entity: DtEntity, isNew: boolean): void => {
    if (isNew) {
        designer.addEntity(entity);
        ElMessage.success(i18n("digitaltwin.message.added"));
    } else {
        designer.updateEntity(entity.id, entity);
        ElMessage.success(i18n("digitaltwin.message.updated"));
    }
};

// 视口选中实体（保持旧版兼容 emit 链）
const handleSelectEntity = (id: string | null): void => {
    if (id !== designer.state.selectedEntityId) {
        designer.selectEntity(id);
    }
    emit("select-entity", id);
};

// 视口选中节点（3D 视口派发，可选映射回 entity id）
const handleSelectNode = (path: string | null): void => {
    if (!path) {
        return;
    }
    // 通过视口 ref 取出 object3D.userData.entityId（兼容映射时已写入）
    const viewport = viewportRef.value as any;
    const engine = viewport?.engine?.value;
    if (!engine) return;
    const node = engine.sceneManager.findByPath(path);
    const entityId = node?.object3D?.userData?.entityId as string | undefined;
    if (entityId && entityId !== designer.state.selectedEntityId) {
        designer.selectEntity(entityId);
        emit("select-entity", entityId);
    }
};

// 视口就绪
const handleViewportReady = (): void => {
    emit("ready");
};

// 视口错误
const handleViewportError = (err: Error): void => {
    ElMessage.error(err.message || String(err));
};

// 自动开启模拟
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

onBeforeUnmount(() => {
    telemetry.stopSim();
});

defineExpose({
    designer,
    camera,
    telemetry,
    viewportRef,
});
</script>

<template>
    <div class="digital-twin-designer">
        <dt-toolbar
            :camera="camera"
            :sim-running="simRunning"
            @view-change="handleViewChange"
            @toggle-sim="handleToggleSim"
            @add-entity="handleAddEntity"
        />
        <div class="viewer-body">
            <dt-entity-list-panel
                :designer="designer"
                @add-entity="handleAddEntity"
                @edit-entity="handleEditEntity"
            />
            <div class="canvas-area">
                <dt-scene-viewport
                    ref="viewportRef"
                    :scene="designer.state.scene"
                    :show-hud="true"
                    :show-grid="true"
                    :show-axes="true"
                    :mode="'view'"
                    :view-preset="'iso'"
                    @ready="handleViewportReady"
                    @error="handleViewportError"
                    @select-entity="handleSelectEntity"
                    @select-node="handleSelectNode"
                />
                <dt-legend-panel :designer="designer" />
            </div>
            <dt-property-panel :designer="designer" :telemetry="telemetry" />
        </div>

        <dt-entity-dialog
            v-model:visible="dialogVisible"
            :entity-id="editingEntityId"
            :source-entity="editingSourceEntity"
            @submit="handleDialogSubmit"
        />
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
        display: flex;
        overflow: hidden;
    }

    .canvas-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
}
</style>
