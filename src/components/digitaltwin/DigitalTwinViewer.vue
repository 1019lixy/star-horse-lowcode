<script setup lang="ts" name="DigitalTwinViewer">
/**
 * 数字孪生查看器 - 主组件
 *
 * 三栏布局：工具栏 + 左侧 tabs（组件库/场景层级/实体列表）+ 中央画布 + 右侧属性/图例 + 弹窗
 */
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { i18n } from "@/lang";
import { ElMessage } from "element-plus";
import DtToolbar from "./panels/DtToolbar.vue";
import DtSceneCanvas from "./panels/DtSceneCanvas.vue";
import DtEntityListPanel from "./panels/DtEntityListPanel.vue";
import DtPropertyPanel from "./panels/DtPropertyPanel.vue";
import DtLegendPanel from "./panels/DtLegendPanel.vue";
import DtModelLibraryPanel from "./panels/DtModelLibraryPanel.vue";
import DtSceneTreePanel from "./panels/DtSceneTreePanel.vue";
import DtEntityDialog from "./dialogs/DtEntityDialog.vue";
import DtBindingDialog from "./dialogs/DtBindingDialog.vue";
import DtTemplateDialog from "./dialogs/DtTemplateDialog.vue";
import { useDigitalTwinDesigner } from "./composables/useDigitalTwinDesigner";
import { useDigitalTwinCamera } from "./composables/useDigitalTwinCamera";
import { useDigitalTwinTelemetry } from "./composables/useDigitalTwinTelemetry";
import { useDigitalTwinAnimation } from "./composables/useDigitalTwinAnimation";
import { DT_SCENE_TEMPLATES, dtGenId } from "./constants";
import { dtFindModelPreset } from "./modelLibrary";
import type { DtEntity, DtScene, DtSceneNode, DtSceneTemplate, DtViewPreset, DtModelInstance, DtDataBinding } from "./types";

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
const animation = useDigitalTwinAnimation();

// 左侧 tabs
const leftActiveTab = ref<"library" | "hierarchy" | "entities">("library");

// 弹窗状态
const dialogVisible = ref(false);
const editingEntityId = ref<string | null>(null);
const editingSourceEntity = ref<DtEntity | null>(null);

const bindingDialogVisible = ref(false);
const editingBindingId = ref<string | null>(null);
const editingBinding = ref<DtDataBinding | null>(null);
const editingBindingEntityId = ref<string>("");

const templateDialogVisible = ref(false);

// 场景层级根节点（从模板加载或独立维护）
const sceneNodes = ref<DtSceneNode[]>([]);

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
        animation.stop();
        designer.setSimRunning(false);
        ElMessage.info(i18n("digitaltwin.message.simStopped"));
    } else {
        telemetry.startSim(() => designer.state.scene.entities);
        animation.start();
        designer.setSimRunning(true);
        ElMessage.success(i18n("digitaltwin.message.simStarted"));
    }
};

// 打开组件库
const handleOpenLibrary = (): void => {
    leftActiveTab.value = "library";
};
// 打开场景层级
const handleOpenHierarchy = (): void => {
    leftActiveTab.value = "hierarchy";
};
// 打开模板弹窗
const handleOpenTemplate = (): void => {
    templateDialogVisible.value = true;
};

// 新增实体（基础几何体）
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

// 添加模型（从组件库）
const handleAddModel = (modelType: string): void => {
    const preset = dtFindModelPreset(modelType);
    if (!preset) return;
    // 构造模型实例（位置默认在原点附近）
    const instance: DtModelInstance = {
        id: dtGenId("model"),
        type: modelType,
        name: i18n(preset.labelKey as any),
        position: { x: 0, y: 0, z: 0 },
        size: { ...preset.defaultSize },
        color: preset.defaultColor,
        status: "normal",
        properties: {},
        sensorData: {},
        visible: true,
        modelType,
        parameterValues: {},
        animation: preset.defaultAnimation,
    };
    designer.addEntity(instance);
    ElMessage.success(i18n("digitaltwin.message.modelAdded"));
};

// 画布选中实体
const handleSelectEntity = (id: string | null): void => {
    emit("select-entity", id);
};

// 编辑绑定
const handleEditBinding = (entityId: string, binding: DtDataBinding | null): void => {
    editingBindingEntityId.value = entityId;
    editingBindingId.value = binding?.id ?? null;
    editingBinding.value = binding;
    bindingDialogVisible.value = true;
};

// 绑定弹窗提交
const handleBindingSubmit = (binding: DtDataBinding, isNew: boolean): void => {
    const entity = designer.state.scene.entities.find((e) => e.id === editingBindingEntityId.value);
    if (!entity) return;
    const inst = entity as DtModelInstance;
    if (!inst.bindings) inst.bindings = [];
    if (isNew) {
        inst.bindings.push(binding);
    } else {
        const idx = inst.bindings.findIndex((b) => b.id === binding.id);
        if (idx >= 0) inst.bindings[idx] = binding;
    }
    ElMessage.success(i18n("digitaltwin.message.bindingSaved"));
};

// 应用模板
const handleApplyTemplate = (template: DtSceneTemplate): void => {
    const newScene: DtScene = {
        id: `dt_scene_${Date.now()}`,
        name: i18n(template.labelKey as any),
        entities: JSON.parse(JSON.stringify(template.entities)),
    };
    // 同步层级
    if (template.hierarchy) {
        sceneNodes.value = [JSON.parse(JSON.stringify(template.hierarchy))];
        // 关联实体 ID（按名称匹配）
        linkEntityIds(sceneNodes.value, newScene.entities);
    } else {
        sceneNodes.value = [];
    }
    designer.loadScene(newScene);
    // 应用模板默认相机
    if (template.camera) {
        camera.setCamera(template.camera);
    }
    // 自动启动模拟与动画
    if (props.autoSim && !telemetry.simRunning.value) {
        telemetry.startSim(() => designer.state.scene.entities);
        animation.start();
        designer.setSimRunning(true);
    }
};

/** 将场景层级中 equipment 节点的 entityId 与 entities 中的实体 id 关联（按 name 匹配） */
const linkEntityIds = (nodes: DtSceneNode[], entities: DtEntity[]): void => {
    const traverse = (node: DtSceneNode): void => {
        if (node.type === "equipment" && node.name) {
            const match = entities.find((e) => e.name === node.name);
            if (match) node.entityId = match.id;
        }
        node.children?.forEach(traverse);
    };
    nodes.forEach(traverse);
};

// 自动开启模拟
watch(
    () => props.autoSim,
    (auto) => {
        if (auto && !telemetry.simRunning.value) {
            telemetry.startSim(() => designer.state.scene.entities);
            animation.start();
            designer.setSimRunning(true);
        }
    },
    { immediate: true },
);

// 当外部传入 scene 时，同步层级（如果是模板场景）
watch(
    () => props.scene,
    (s) => {
        if (s && s.entities.length > 0) {
            // 检测是否为模板场景：通过实体 name 匹配模板
            const matchedTemplate = DT_SCENE_TEMPLATES.find((t) =>
                t.entities.some((te) => s.entities.some((se) => se.name === te.name)),
            );
            if (matchedTemplate?.hierarchy) {
                sceneNodes.value = [JSON.parse(JSON.stringify(matchedTemplate.hierarchy))];
                linkEntityIds(sceneNodes.value, s.entities);
            }
        }
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    telemetry.stopSim();
    animation.stop();
});

defineExpose({
    designer,
    camera,
    telemetry,
    animation,
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
            @open-library="handleOpenLibrary"
            @open-hierarchy="handleOpenHierarchy"
            @open-template="handleOpenTemplate"
        />
        <el-splitter class="viewer-body" direction="horizontal">
            <!-- 左侧 Tabs：组件库 / 场景层级 / 实体列表 -->
            <el-splitter-panel size="240px" min="180px" max="380px">
                <div class="left-panel">
                    <el-tabs v-model="leftActiveTab" class="left-tabs">
                        <el-tab-pane :label="i18n('digitaltwin.toolbar.library')" name="library">
                            <dt-model-library-panel @add-model="handleAddModel" />
                        </el-tab-pane>
                        <el-tab-pane :label="i18n('digitaltwin.toolbar.hierarchy')" name="hierarchy">
                            <dt-scene-tree-panel
                                :nodes="sceneNodes"
                                @select-entity="handleSelectEntity"
                            />
                        </el-tab-pane>
                        <el-tab-pane :label="i18n('digitaltwin.entity.title')" name="entities">
                            <dt-entity-list-panel
                                :designer="designer"
                                @add-entity="handleAddEntity"
                                @edit-entity="handleEditEntity"
                            />
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-splitter-panel>

            <el-splitter-panel>
                <div class="canvas-area">
                    <dt-scene-canvas
                        :designer="designer"
                        :camera="camera"
                        :animation="animation"
                        @select-entity="handleSelectEntity"
                    />
                    <dt-legend-panel :designer="designer" />
                </div>
            </el-splitter-panel>
            <el-splitter-panel size="260px" min="200px" max="420px">
                <dt-property-panel
                    :designer="designer"
                    :telemetry="telemetry"
                    @edit-binding="handleEditBinding"
                />
            </el-splitter-panel>
        </el-splitter>

        <dt-entity-dialog
            v-model:visible="dialogVisible"
            :entity-id="editingEntityId"
            :source-entity="editingSourceEntity"
            @submit="handleDialogSubmit"
        />
        <dt-binding-dialog
            v-model:visible="bindingDialogVisible"
            :binding-id="editingBindingId"
            :source-binding="editingBinding"
            :entity-id="editingBindingEntityId"
            @submit="handleBindingSubmit"
        />
        <dt-template-dialog
            v-model:visible="templateDialogVisible"
            @apply-template="handleApplyTemplate"
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
        overflow: hidden;
    }

    .left-panel {
        width: 100%;
        height: 100%;
        border-right: 1px solid var(--el-border-color-lighter);
        background: var(--el-bg-color);
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .left-tabs {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;

            :deep(.el-tabs__header) {
                margin: 0;
                padding: 0 8px;
            }

            :deep(.el-tabs__content) {
                flex: 1;
                overflow: hidden;
            }

            :deep(.el-tab-pane) {
                height: 100%;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
        }
    }

    .canvas-area {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
}
</style>
