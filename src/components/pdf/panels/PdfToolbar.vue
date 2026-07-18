<script setup lang="ts" name="PdfToolbar">
import { i18n } from "@/lang";
import type { PdfDesigner } from "../composables/usePdfDesigner";
import { PDF_PAPER_PRESETS } from "../constants";

defineProps<{
    designer: PdfDesigner;
    readonly?: boolean;
}>();

const emit = defineEmits<{
    (e: "save"): void;
    (e: "preview"): void;
}>();
</script>

<template>
    <div class="pdf-toolbar">
        <div class="left-group">
            <el-button-group>
                <el-button  :disabled="readonly" @click="designer.undo()">
                    <el-icon><Back/></el-icon>
                </el-button>
                <el-button  :disabled="readonly" @click="designer.redo()">
                    <el-icon><Right/></el-icon>
                </el-button>
            </el-button-group>

            <el-button

                :disabled="readonly || !designer.selectedElementId"
                @click="designer.selectedElementId && designer.duplicateElement(designer.selectedElementId)"
            >
                <el-icon><CopyDocument/></el-icon>
                {{ i18n("pdf.btn.copy") }}
            </el-button>
            <el-button

                :disabled="readonly || !designer.selectedElementId"
                @click="designer.selectedElementId && designer.removeElement(designer.selectedElementId)"
            >
                <el-icon><Delete/></el-icon>
                {{ i18n("pdf.btn.delete") }}
            </el-button>
        </div>

        <div class="right-group">
            <span class="label">{{ i18n("pdf.label.paper") }}:</span>
            <el-select
                :model-value="`${designer.state.page.width}x${designer.state.page.height}`"

                style="width: 120px"
                @update:model-value="(v: string) => {
                    const preset = PDF_PAPER_PRESETS.find(p => `${p.width}x${p.height}` === v);
                    if (preset) designer.updatePage({ width: preset.width, height: preset.height });
                }"
            >
                <el-option
                    v-for="opt in PDF_PAPER_PRESETS"
                    :key="opt.label"
                    :label="opt.label"
                    :value="`${opt.width}x${opt.height}`"
                />
            </el-select>

            <el-button  @click="emit('preview')">
                <el-icon><View/></el-icon>
                {{ i18n("pdf.btn.preview") }}
            </el-button>

            <el-button  type="primary" :disabled="readonly" @click="emit('save')">
                <el-icon><Check/></el-icon>
                {{ i18n("dialog.save") }}
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Back, Right, CopyDocument, Delete, View, Check } from "@element-plus/icons-vue";
export default { components: { Back, Right, CopyDocument, Delete, View, Check } };
</script>

<style lang="scss" scoped>
.pdf-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color);
    flex-wrap: wrap;
    gap: 8px;

    .left-group,
    .right-group {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .label {
        font-size: 12px;
        color: var(--el-text-color-secondary);
    }
}
</style>
