<script setup lang="ts" name="DtToolbar">
/**
 * 数字孪生 - 顶部工具栏（企业级 v3.1）
 *
 * 布局：左（标题+核心操作） | 中（编辑+变换） | 右（视图+辅助）
 * - 全部按钮统一 size="small"
 * - 相关按钮用 el-button-group 聚合
 * - 不常用功能收拢到下拉菜单
 * - 去除 flex:1 占位，改用自然流+右侧固定组
 */
import { i18n } from "@/lang";
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { ShSvgIcon } from "@/components/shared";
import { DT_VIEW_PRESETS } from "../constants";
import type { DtViewPreset } from "../types";
import type { UseDigitalTwinCameraReturn } from "../composables/useDigitalTwinCamera";

const props = defineProps<{
    camera: UseDigitalTwinCameraReturn;
    simRunning: boolean;
    canUndo: boolean;
    canRedo: boolean;
    editMode: boolean;
    transformMode: "translate" | "rotate" | "scale";
    previewMode: boolean;
    hudVisible: boolean;
    legendVisible: boolean;
    alarmCenterVisible?: boolean;
    videoMonitorVisible?: boolean;
    cruisePanelVisible?: boolean;
    unreadAlarmCount?: number;
    onlineCameraCount?: number;
    totalCameraCount?: number;
}>();

const emit = defineEmits<{
    (e: "view-change", preset: DtViewPreset): void;
    (e: "toggle-sim"): void;
    (e: "add-entity"): void;
    (e: "open-library"): void;
    (e: "new-scene"): void;
    (e: "import-scene"): void;
    (e: "export-scene"): void;
    (e: "save-scene"): void;
    (e: "undo"): void;
    (e: "redo"): void;
    (e: "toggle-preview"): void;
    (e: "toggle-edit"): void;
    (e: "toggle-legend"): void;
    (e: "transform-mode-change", mode: "translate" | "rotate" | "scale"): void;
    (e: "toggle-hud"): void;
    (e: "toggle-alarm-center"): void;
    (e: "toggle-video-monitor"): void;
    (e: "toggle-cruise-panel"): void;
    (e: "import-ifc"): void;
}>();

const handleViewChange = (preset: DtViewPreset): void => {
    ElMessage.info(i18n("digitaltwin.message.viewChanged"));
    emit("view-change", preset);
};

const handleReset = (): void => {
    props.camera.reset();
};

const handleTransformMode = (mode: "translate" | "rotate" | "scale"): void => {
    emit("transform-mode-change", mode);
};
</script>

<template>
    <div class="dt-toolbar">
        <!-- 左侧：标题 + 文件操作 -->
        <div class="dt-toolbar-left">
            <span class="dt-title">{{ i18n("digitaltwin.title") }}</span>

            <el-button-group>
                <el-button size="small" :title="i18n('digitaltwin.toolbar.new')" @click="emit('new-scene')">
                    <ShSvgIcon name="newScene" />
                </el-button>
                <el-button size="small" :title="i18n('digitaltwin.toolbar.import')" @click="emit('import-scene')">
                    <ShSvgIcon name="import" />
                </el-button>
                <el-button size="small" :title="i18n('digitaltwin.toolbar.export')" @click="emit('export-scene')">
                    <ShSvgIcon name="export" />
                </el-button>
                <el-button size="small" :title="i18n('digitaltwin.toolbar.save')" @click="emit('save-scene')">
                    <ShSvgIcon name="save" />
                </el-button>
            </el-button-group>

            <el-button-group>
                <el-button size="small" :disabled="!canUndo" :title="i18n('digitaltwin.toolbar.undo')" @click="emit('undo')">
                    <ShSvgIcon name="backward" />
                </el-button>
                <el-button size="small" :disabled="!canRedo" :title="i18n('digitaltwin.toolbar.redo')" @click="emit('redo')">
                    <ShSvgIcon name="forward" />
                </el-button>
            </el-button-group>
        </div>

        <!-- 中间：编辑 + 变换 + 添加 -->
        <div class="dt-toolbar-center">
            <el-button-group>
                <el-button
                    size="small"
                    :type="editMode ? 'primary' : 'default'"
                    :title="i18n('digitaltwin.toolbar.edit')"
                    @click="emit('toggle-edit')"
                >
                    <ShSvgIcon name="edit" />
                    {{ i18n("digitaltwin.toolbar.edit") }}
                </el-button>
                <el-button
                    size="small"
                    :type="editMode && transformMode === 'translate' ? 'primary' : 'default'"
                    :disabled="!editMode"
                    :title="i18n('digitaltwin.toolbar.transformMove')"
                    @click="handleTransformMode('translate')"
                >
                    <ShSvgIcon name="gizmoMove" />
                </el-button>
                <el-button
                    size="small"
                    :type="editMode && transformMode === 'rotate' ? 'primary' : 'default'"
                    :disabled="!editMode"
                    :title="i18n('digitaltwin.toolbar.transformRotate')"
                    @click="handleTransformMode('rotate')"
                >
                    <ShSvgIcon name="gizmoRotate" />
                </el-button>
                <el-button
                    size="small"
                    :type="editMode && transformMode === 'scale' ? 'primary' : 'default'"
                    :disabled="!editMode"
                    :title="i18n('digitaltwin.toolbar.transformScale')"
                    @click="handleTransformMode('scale')"
                >
                    <ShSvgIcon name="gizmoScale" />
                </el-button>
            </el-button-group>

            <el-button-group>
                <el-button size="small" type="primary" @click="emit('add-entity')">
                    <ShSvgIcon name="plus" />
                    {{ i18n("digitaltwin.toolbar.addEntity") }}
                </el-button>
                <el-button size="small" @click="emit('open-library')">
                    <ShSvgIcon name="component" />
                    {{ i18n("digitaltwin.toolbar.library") }}
                </el-button>
            </el-button-group>
        </div>

        <!-- 右侧：视角 + 模拟 + 运营 + 预览 -->
        <div class="dt-toolbar-right">
            <el-dropdown size="small" trigger="click" :title="i18n('digitaltwin.toolbar.view')">
                <el-button size="small">
                    <ShSvgIcon name="eye" />
                    {{ i18n("digitaltwin.toolbar.view") }}
                    <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item
                            v-for="v in DT_VIEW_PRESETS"
                            :key="v.preset"
                            @click="handleViewChange(v.preset)"
                        >
                            {{ i18n(v.labelKey as any) }}
                        </el-dropdown-item>
                        <el-dropdown-item divided @click="handleReset">
                            {{ i18n("digitaltwin.toolbar.reset") }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>

            <el-button
                size="small"
                :type="simRunning ? 'warning' : 'success'"
                @click="emit('toggle-sim')"
            >
                <ShSvgIcon :name="simRunning ? 'videoPause' : 'videoPlay'" />
                {{ simRunning ? i18n("digitaltwin.toolbar.pauseSim") : i18n("digitaltwin.toolbar.playSim") }}
            </el-button>

            <el-dropdown size="small" trigger="click">
                <el-button size="small">
                    <ShSvgIcon name="monitor" />
                    {{ i18n("digitaltwin.toolbar.ops") }}
                    <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="emit('toggle-cruise-panel')">
                            <ShSvgIcon name="route" style="margin-right:6px" />
                            {{ i18n("digitaltwin.toolbar.cruise") }}
                        </el-dropdown-item>
                        <el-dropdown-item @click="emit('toggle-alarm-center')">
                            <span style="display:inline-flex;align-items:center;">
                                <ShSvgIcon name="alarm" style="margin-right:6px" />
                                {{ i18n("digitaltwin.toolbar.alarm") }}
                                <el-badge v-if="unreadAlarmCount" :value="unreadAlarmCount" :max="99" style="margin-left:6px" />
                            </span>
                        </el-dropdown-item>
                        <el-dropdown-item @click="emit('toggle-video-monitor')">
                            <ShSvgIcon name="camera" style="margin-right:6px" />
                            {{ i18n("digitaltwin.toolbar.video") }}
                            <span v-if="totalCameraCount" style="font-size:10px;color:var(--el-text-color-secondary);margin-left:4px;">
                                ({{ onlineCameraCount ?? 0 }}/{{ totalCameraCount }})
                            </span>
                        </el-dropdown-item>
                        <el-dropdown-item divided @click="emit('import-ifc')">
                            <ShSvgIcon name="files" style="margin-right:6px" />
                            {{ i18n("digitaltwin.toolbar.ifc") }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>

            <el-button-group>
                <el-button
                    size="small"
                    :type="legendVisible ? 'info' : 'default'"
                    :title="i18n('digitaltwin.toolbar.legendTip')"
                    @click="emit('toggle-legend')"
                >
                    <ShSvgIcon name="legend" />
                    {{ i18n("digitaltwin.toolbar.legend") }}
                </el-button>
                <el-button
                    size="small"
                    :type="hudVisible ? 'info' : 'default'"
                    :title="i18n('digitaltwin.toolbar.hudTip')"
                    @click="emit('toggle-hud')"
                >
                    <ShSvgIcon name="monitor" />
                    {{ i18n("digitaltwin.toolbar.hud") }}
                </el-button>
                <el-button
                    size="small"
                    :type="previewMode ? 'info' : 'default'"
                    @click="emit('toggle-preview')"
                >
                    <ShSvgIcon :name="previewMode ? 'eyeOff' : 'eye'" />
                    {{ previewMode ? i18n("digitaltwin.toolbar.previewExit") : i18n("digitaltwin.toolbar.preview") }}
                </el-button>
            </el-button-group>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dt-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 12px;
    background: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;
    min-height: 40px;

    .dt-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        white-space: nowrap;
    }

    .dt-toolbar-left,
    .dt-toolbar-center,
    .dt-toolbar-right {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .dt-toolbar-left {
        flex-shrink: 0;
    }

    .dt-toolbar-center {
        flex: 1;
        justify-content: center;
    }

    .dt-toolbar-right {
        flex-shrink: 0;
    }

    :deep(.el-button) {
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }
}
</style>
