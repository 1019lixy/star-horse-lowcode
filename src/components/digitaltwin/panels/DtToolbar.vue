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
    (e: "open-library"): void;
    (e: "open-hierarchy"): void;
    (e: "open-template"): void;
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

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
    refreshLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 012.12-9.36L12 3v0a9 9 0 010 18"/></svg>',
    refreshRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M20.49 9a9 9 0 01-2.12 9.36L12 21v0a9 9 0 010-18"/></svg>',
    zoomIn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>',
    zoomOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M8 11h6"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M3.51 15a9 9 0 012.12-9.36L12 3M20.49 9a9 9 0 01-2.12 9.36L12 21"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    connection: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>',
    files: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 2v6h6M2 8a2 2 0 012-2h8l4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8z"/><path d="M6 2h8l4 4v2"/></svg>',
    videoPlay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    videoPause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
};
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
                <span class="svg-icon" v-html="icons.refreshLeft"></span>
            </el-button>
            <el-button  @click="camera.rotate(15, 0)" :title="i18n('digitaltwin.toolbar.rotateRight')">
                <span class="svg-icon" v-html="icons.refreshRight"></span>
            </el-button>
            <el-button  @click="camera.zoomIn()" :title="i18n('digitaltwin.toolbar.zoomIn')">
                <span class="svg-icon" v-html="icons.zoomIn"></span>
            </el-button>
            <el-button  @click="camera.zoomOut()" :title="i18n('digitaltwin.toolbar.zoomOut')">
                <span class="svg-icon" v-html="icons.zoomOut"></span>
            </el-button>
            <el-button  @click="handleReset" :title="i18n('digitaltwin.toolbar.reset')">
                <span class="svg-icon" v-html="icons.refresh"></span>
            </el-button>
        </el-button-group>

        <el-divider direction="vertical" />

        <!-- 模拟控制 -->
        <el-button

            :type="simRunning ? 'warning' : 'success'"
            @click="emit('toggle-sim')"
        >
            <span class="svg-icon" v-html="simRunning ? icons.videoPause : icons.videoPlay"></span>
            {{ simRunning ? i18n("digitaltwin.toolbar.pauseSim") : i18n("digitaltwin.toolbar.playSim") }}
        </el-button>

        <el-divider direction="vertical" />

        <el-button  type="primary" @click="emit('add-entity')">
            <span class="svg-icon" v-html="icons.plus"></span>
            {{ i18n("digitaltwin.toolbar.addEntity") }}
        </el-button>

        <el-divider direction="vertical" />

        <el-button  @click="emit('open-library')">
            <span class="svg-icon" v-html="icons.box"></span>
            {{ i18n("digitaltwin.toolbar.library") }}
        </el-button>
        <el-button  @click="emit('open-hierarchy')">
            <span class="svg-icon" v-html="icons.connection"></span>
            {{ i18n("digitaltwin.toolbar.hierarchy") }}
        </el-button>
        <el-button  type="success" @click="emit('open-template')">
            <span class="svg-icon" v-html="icons.files"></span>
            {{ i18n("digitaltwin.toolbar.template") }}
        </el-button>
    </div>
</template>


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

.svg-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    margin-right: 4px;
}
.svg-icon :deep(svg) {
    width: 100%;
    height: 100%;
}
</style>
