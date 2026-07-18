<script setup lang="ts" name="DtToolbar">
/**
 * 数字孪生 - 顶部工具栏
 *
 * 视角切换 / 旋转 / 缩放 / 重置 / 播放暂停模拟 / 新增实体
 */
import { i18n } from "@/lang";
import { ElMessage } from "element-plus";
import { DT_VIEW_PRESETS } from "../constants";
import type { DtViewPreset } from "../types";
import type { UseDigitalTwinCameraReturn } from "../composables/useDigitalTwinCamera";

const props = defineProps<{
    camera: UseDigitalTwinCameraReturn;
    simRunning: boolean;
}>();

const emit = defineEmits<{
    (e: "view-change", preset: DtViewPreset): void;
    (e: "toggle-sim"): void;
    (e: "add-entity"): void;
}>();

const handleViewChange = (preset: DtViewPreset): void => {
    ElMessage.info(i18n("digitaltwin.message.viewChanged"));
    emit("view-change", preset);
};

const handleReset = (): void => {
    props.camera.reset();
};

// 阻止未使用变量告警
void props;
</script>

<template>
    <div class="dt-toolbar">
        <span class="dt-title">{{ i18n("digitaltwin.title") }}</span>

        <el-divider direction="vertical" />

        <!-- 视角切换 -->
        <span class="dt-label">{{ i18n("digitaltwin.toolbar.view") }}:</span>
        <el-select
            :model-value="''"

            style="width: 100px"
            :placeholder="i18n('digitaltwin.toolbar.view')"
            @update:model-value="(v) => handleViewChange(v as DtViewPreset)"
        >
            <el-option
                v-for="v in DT_VIEW_PRESETS"
                :key="v.preset"
                :label="i18n(v.labelKey as any)"
                :value="v.preset"
            />
        </el-select>

        <el-button-group>
            <el-button  @click="camera.rotate(-15, 0)" :title="i18n('digitaltwin.toolbar.rotateLeft')">
                <el-icon><RefreshLeft /></el-icon>
            </el-button>
            <el-button  @click="camera.rotate(15, 0)" :title="i18n('digitaltwin.toolbar.rotateRight')">
                <el-icon><RefreshRight /></el-icon>
            </el-button>
            <el-button  @click="camera.zoomIn()" :title="i18n('digitaltwin.toolbar.zoomIn')">
                <el-icon><ZoomIn /></el-icon>
            </el-button>
            <el-button  @click="camera.zoomOut()" :title="i18n('digitaltwin.toolbar.zoomOut')">
                <el-icon><ZoomOut /></el-icon>
            </el-button>
            <el-button  @click="handleReset" :title="i18n('digitaltwin.toolbar.reset')">
                <el-icon><Refresh /></el-icon>
            </el-button>
        </el-button-group>

        <el-divider direction="vertical" />

        <!-- 模拟控制 -->
        <el-button

            :type="simRunning ? 'warning' : 'success'"
            @click="emit('toggle-sim')"
        >
            <el-icon>
                <VideoPlay v-if="!simRunning" />
                <VideoPause v-else />
            </el-icon>
            {{ simRunning ? i18n("digitaltwin.toolbar.pauseSim") : i18n("digitaltwin.toolbar.playSim") }}
        </el-button>

        <el-divider direction="vertical" />

        <el-button  type="primary" @click="emit('add-entity')">
            <el-icon><Plus /></el-icon>
            {{ i18n("digitaltwin.toolbar.addEntity") }}
        </el-button>
    </div>
</template>

<script lang="ts">
import { Plus, Refresh, RefreshLeft, RefreshRight, VideoPause, VideoPlay, ZoomIn, ZoomOut } from "@element-plus/icons-vue";
export default { components: { Plus, Refresh, RefreshLeft, RefreshRight, VideoPause, VideoPlay, ZoomIn, ZoomOut } };
</script>

<style lang="scss" scoped>
.dt-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;
    flex-wrap: wrap;

    .dt-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
    }

    .dt-label {
        font-size: 12px;
        color: var(--el-text-color-secondary);
    }
}
</style>
