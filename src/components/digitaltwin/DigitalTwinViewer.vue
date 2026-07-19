<script setup lang="ts" name="DigitalTwinViewer">
/**
 * 数字孪生查看器 - 主组件
 *
 * 工具栏 + 实体列表 + 画布 + 属性面板 + 图例 + 弹窗
 *
 * @deprecated v3.2 起请使用 DigitalTwinDesigner（基于 Three.js WebGL2 + DtSceneViewport）。
 *     本组件基于 Canvas 2D 等距投影，仅作向后兼容保留，将在 v4.0 移除。
 */
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { i18n } from "@/lang";
import { ElMessage } from "element-plus";
import DtToolbar from "./panels/DtToolbar.vue";
import DtSceneCanvas from "./panels/DtSceneCanvas.vue";
import DtEntityListPanel from "./panels/DtEntityListPanel.vue";
import DtPropertyPanel from "./panels/DtPropertyPanel.vue";
import DtLegendPanel from "./panels/DtLegendPanel.vue";
import DtEntityDialog from "./dialogs/DtEntityDialog.vue";
import { useDigitalTwinDesigner } from "./composables/useDigitalTwinDesigner";
import { useDigitalTwinCamera } from "./composables/useDigitalTwinCamera";
import { useDigitalTwinTelemetry } from "./composables/useDigitalTwinTelemetry";
import type { DtEntity, DtScene, DtViewPreset } from "./types";

const props = defineProps<{
    scene?: DtScene;
    autoSim?: boolean;
}>();

const emit = defineEmits<{
    (e: "select-entity", id: string | null): void;
}>();

const designer = useDigitalTwinDesigner(props.scene ? { ...props.scene } : undefined);
const camera = useDigitalTwinCamera();
const telemetry = useDigitalTwinTelemetry();

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

// 视角切换
const handleViewChange = (preset: DtViewPreset): void => {
    camera.applyViewPreset(preset);
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

// 画布选中实体
const handleSelectEntity = (id: string | null): void => {
    // designer.selectEntity 已在 canvas 内调用
    emit("select-entity", id);
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
});
</script>

<template>
    <div class="digital-twin-viewer">
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
                <dt-scene-canvas
                    :designer="designer"
                    :camera="camera"
                    @select-entity="handleSelectEntity"
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
.digital-twin-viewer {
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
