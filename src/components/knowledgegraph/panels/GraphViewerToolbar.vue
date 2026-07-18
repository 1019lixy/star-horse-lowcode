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
                    <el-icon><Search /></el-icon>
                </template>
            </el-input>
            <el-button-group>
                <el-button  @click="handleZoomIn" :title="i18n('knowledgegraph.viewer.zoomIn')">
                    <el-icon><ZoomIn /></el-icon>
                </el-button>
                <el-button  @click="handleZoomOut" :title="i18n('knowledgegraph.viewer.zoomOut')">
                    <el-icon><ZoomOut /></el-icon>
                </el-button>
                <el-button  @click="handleFit" :title="i18n('knowledgegraph.viewer.fit')">
                    <el-icon><FullScreen /></el-icon>
                </el-button>
                <el-button  @click="handleReset" :title="i18n('knowledgegraph.viewer.reset')">
                    <el-icon><Refresh /></el-icon>
                </el-button>
            </el-button-group>
        </div>
    </div>
</template>

<script lang="ts">
import { Search, ZoomIn, ZoomOut, FullScreen, Refresh } from "@element-plus/icons-vue";
export default { components: { Search, ZoomIn, ZoomOut, FullScreen, Refresh } };
</script>

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
</style>
