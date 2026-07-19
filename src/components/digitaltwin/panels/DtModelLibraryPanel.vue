<script setup lang="ts" name="DtModelLibraryPanel">
/**
 * 数字孪生 - 组件库面板
 *
 * 顶部搜索 + 按分类折叠面板 + 模型卡片
 * 点击卡片 → emit('add-model', preset.type)
 */
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import { DT_ALL_MODELS, DT_MODEL_CATEGORIES } from "../modelLibrary";
import { dtGetModelIcon } from "../modelLibrary/DtModelIcons";
import type { DtModelCategoryKey, DtModelPreset } from "../types";

const emit = defineEmits<{
    (e: "add-model", modelType: string): void;
}>();

const keyword = ref("");

/** 按关键字过滤模型 */
const filteredModels = computed<DtModelPreset[]>(() => {
    const kw = keyword.value.trim().toLowerCase();
    if (!kw) return DT_ALL_MODELS;
    return DT_ALL_MODELS.filter((m) => {
        const label = i18n(m.labelKey as any).toLowerCase();
        return label.includes(kw) || m.type.toLowerCase().includes(kw);
    });
});

/** 按分类分组（应用关键字过滤） */
const groupedModels = computed(() => {
    return DT_MODEL_CATEGORIES.map((cat) => ({
        ...cat,
        models: filteredModels.value.filter((m) => m.categoryKey === cat.key),
    })).filter((g) => g.models.length > 0);
});

/** 当前展开的分类 */
const activeNames = ref<string[]>(
    DT_MODEL_CATEGORIES.map((c) => c.key as string),
);

const handleClickModel = (model: DtModelPreset): void => {
    emit("add-model", model.type);
};

const categoryLabel = (key: DtModelCategoryKey | string): string => i18n(key as any);

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>'
};
</script>

<template>
    <div class="dt-model-library">
        <div class="panel-header">
            <span class="panel-title">{{ i18n("digitaltwin.library.title") }}</span>
        </div>
        <div class="search-bar">
            <el-input
                v-model="keyword"
                :placeholder="i18n('digitaltwin.library.search')"
                clearable
                size="small"
            >
                <template #prefix>
                    <span class="svg-icon" v-html="icons.search"></span>
                </template>
            </el-input>
        </div>
        <div class="library-body">
            <template v-if="groupedModels.length === 0">
                <div class="empty-text">{{ i18n("digitaltwin.library.empty") }}</div>
            </template>
            <el-collapse v-else v-model="activeNames">
                <el-collapse-item
                    v-for="group in groupedModels"
                    :key="group.key"
                    :name="group.key as string"
                >
                    <template #title>
                        <span class="group-title">{{ categoryLabel(group.key) }}</span>
                        <span class="group-count">({{ group.models.length }})</span>
                    </template>
                    <div class="model-grid">
                        <div
                            v-for="model in group.models"
                            :key="model.type"
                            class="model-card"
                            :title="i18n(model.labelKey as any)"
                            @click="handleClickModel(model)"
                        >
                            <div
                                class="model-icon"
                                :style="{ color: model.defaultColor }"
                                v-html="dtGetModelIcon(model.type)"
                            />
                            <span class="model-label">{{ i18n(model.labelKey as any) }}</span>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.dt-model-library {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .panel-header {
        padding: 8px 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        .panel-title {
            font-size: 13px;
            font-weight: 600;
        }
    }

    .search-bar {
        padding: 8px 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);
    }

    .library-body {
        flex: 1;
        overflow: auto;
        padding: 0 4px;
    }

    .empty-text {
        padding: 24px 12px;
        text-align: center;
        color: var(--el-text-color-secondary);
        font-size: 12px;
    }

    .group-title {
        font-size: 12px;
        font-weight: 600;
        margin-right: 4px;
    }

    .group-count {
        font-size: 11px;
        color: var(--el-text-color-secondary);
    }

    .model-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
        padding: 4px 8px 8px;
    }

    .model-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 4px;
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.15s;

        &:hover {
            border-color: var(--el-color-primary);
            background: var(--el-color-primary-light-9);
        }

        .model-icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;

            :deep(svg) {
                width: 28px;
                height: 28px;
            }
        }

        .model-label {
            font-size: 11px;
            text-align: center;
            color: var(--el-text-color-primary);
            line-height: 1.2;
        }
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
