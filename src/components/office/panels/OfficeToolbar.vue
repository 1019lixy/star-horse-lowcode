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
</script>

<template>
    <div class="office-toolbar">
        <div class="toolbar-group">
            <el-button  type="primary" @click="emit('new')">
                <el-icon><Plus/></el-icon>
                {{ i18n("office.toolbar.new") }}
            </el-button>
            <el-button  @click="emit('save')">
                <el-icon><Select/></el-icon>
                {{ i18n("office.toolbar.save") }}
            </el-button>
            <el-button  @click="emit('export')">
                <el-icon><Download/></el-icon>
                {{ i18n("office.toolbar.export") }}
            </el-button>
        </div>
        <div class="toolbar-divider"></div>
        <div class="toolbar-group">
            <el-button  :disabled="!canUndo" @click="emit('undo')">
                <el-icon><Back/></el-icon>
                {{ i18n("office.toolbar.undo") }}
            </el-button>
            <el-button  :disabled="!canRedo" @click="emit('redo')">
                <el-icon><Right/></el-icon>
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

<script lang="ts">
import { Back, Download, Plus, Right, Select } from "@element-plus/icons-vue";
export default { components: { Plus, Select, Download, Back, Right } };
</script>

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
</style>
