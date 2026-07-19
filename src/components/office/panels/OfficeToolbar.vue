<script setup lang="ts" name="OfficeToolbar">
import { i18n } from "@/lang";
import { OFFICE_DOC_TYPE_PRESETS } from "../constants";
import type { OfficeDocType } from "../types";

defineProps<{
    canUndo: boolean;
    canRedo: boolean;
    activeType: OfficeDocType | null;
}>();

const emit = defineEmits<{
    (e: "new"): void;
    (e: "save"): void;
    (e: "export"): void;
    (e: "undo"): void;
    (e: "redo"): void;
    (e: "switch-type", type: OfficeDocType): void;
}>();

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    select: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
};
</script>

<template>
    <div class="office-toolbar">
        <div class="toolbar-group">
            <el-button  type="primary" @click="emit('new')">
                <span class="svg-icon" v-html="icons.plus"></span>
                {{ i18n("office.toolbar.new") }}
            </el-button>
            <el-button  @click="emit('save')">
                <span class="svg-icon" v-html="icons.select"></span>
                {{ i18n("office.toolbar.save") }}
            </el-button>
            <el-button  @click="emit('export')">
                <span class="svg-icon" v-html="icons.download"></span>
                {{ i18n("office.toolbar.export") }}
            </el-button>
        </div>
        <div class="toolbar-divider"></div>
        <div class="toolbar-group">
            <el-button  :disabled="!canUndo" @click="emit('undo')">
                <span class="svg-icon" v-html="icons.back"></span>
                {{ i18n("office.toolbar.undo") }}
            </el-button>
            <el-button  :disabled="!canRedo" @click="emit('redo')">
                <span class="svg-icon" v-html="icons.right"></span>
                {{ i18n("office.toolbar.redo") }}
            </el-button>
        </div>
        <div class="toolbar-divider"></div>
        <div class="toolbar-group type-switch">
            <el-radio-group
                :model-value="activeType ?? 'word'"

                @change="(v: string | number | boolean | undefined) => emit('switch-type', v as OfficeDocType)"
            >
                <el-radio-button
                    v-for="p in OFFICE_DOC_TYPE_PRESETS"
                    :key="p.type"
                    :value="p.type"
                >
                    {{ p.label }}
                </el-radio-button>
            </el-radio-group>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.office-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-wrap: wrap;

    .toolbar-group {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .toolbar-divider {
        width: 1px;
        height: 20px;
        background: var(--el-border-color);
    }

    .type-switch {
        margin-left: auto;
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
