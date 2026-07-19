<script setup lang="ts" name="GraphViewerToolbar">
import { computed } from "vue";
import { i18n } from "@/lang";
import { KG_LAYOUT_PRESETS } from "../constants";
import type { UseGraphViewerReturn } from "../composables/useGraphViewer";

const props = defineProps<{
    viewer: UseGraphViewerReturn;
}>();

const searchKeyword = computed({
    get: () => props.viewer.state.searchKeyword,
    set: (v: string) => props.viewer.setSearch(v),
});

const layout = computed({
    get: () => props.viewer.state.layout,
    set: (v: any) => {
        props.viewer.setLayout(v);
        props.viewer.applyLayout();
    },
});

const stats = computed(() => props.viewer.stats.value);

const handleReset = () => {
    props.viewer.zoomReset();
    props.viewer.applyLayout();
};

const handleFit = () => props.viewer.fitView();
const handleZoomIn = () => props.viewer.zoomIn();
const handleZoomOut = () => props.viewer.zoomOut();

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
    zoomIn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>',
    zoomOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M8 11h6"/></svg>',
    fullScreen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M3.51 15a9 9 0 012.12-9.36L12 3M20.49 9a9 9 0 01-2.12 9.36L12 21"/></svg>'
};
</script>

<template>
    <div class="kg-toolbar">
        <div class="toolbar-left">
            <span class="title">{{ i18n("knowledgegraph.viewer.title") }}</span>
            <el-divider direction="vertical" />
            <span class="stat-item">{{ i18n("knowledgegraph.viewer.stats.total") }}: {{ stats.total }}</span>
            <span class="stat-item">{{ i18n("knowledgegraph.viewer.stats.visible") }}: {{ stats.visible }}</span>
            <span class="stat-item">{{ i18n("knowledgegraph.viewer.stats.selected") }}: {{ stats.selected }}</span>
            <span class="stat-item">{{ i18n("knowledgegraph.viewer.edges") }}: {{ stats.edges }}</span>
        </div>
        <div class="toolbar-right">
            <el-select
                v-model="layout"

                style="width: 110px"
                :placeholder="i18n('knowledgegraph.viewer.layout')"
            >
                <el-option
                    v-for="opt in KG_LAYOUT_PRESETS"
                    :key="opt.value"
                    :label="i18n(opt.labelKey)"
                    :value="opt.value"
                />
            </el-select>
            <el-input
                v-model="searchKeyword"

                style="width: 180px"
                clearable
                :placeholder="i18n('knowledgegraph.viewer.searchPlaceholder')"
            >
                <template #prefix>
                    <span class="svg-icon" v-html="icons.search"></span>
                </template>
            </el-input>
            <el-button-group>
                <el-button  @click="handleZoomIn" :title="i18n('knowledgegraph.viewer.zoomIn')">
                    <span class="svg-icon" v-html="icons.zoomIn"></span>
                </el-button>
                <el-button  @click="handleZoomOut" :title="i18n('knowledgegraph.viewer.zoomOut')">
                    <span class="svg-icon" v-html="icons.zoomOut"></span>
                </el-button>
                <el-button  @click="handleFit" :title="i18n('knowledgegraph.viewer.fit')">
                    <span class="svg-icon" v-html="icons.fullScreen"></span>
                </el-button>
                <el-button  @click="handleReset" :title="i18n('knowledgegraph.viewer.reset')">
                    <span class="svg-icon" v-html="icons.refresh"></span>
                </el-button>
            </el-button-group>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.kg-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color);
    gap: 12px;
    flex-shrink: 0;

    .toolbar-left {
        display: flex;
        align-items: center;
        gap: 8px;

        .title {
            font-weight: 600;
            font-size: 14px;
        }

        .stat-item {
            font-size: 12px;
            color: var(--el-text-color-secondary);
        }
    }

    .toolbar-right {
        display: flex;
        align-items: center;
        gap: 8px;
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
