<script setup lang="ts" name="PdfElementPanel">
import { i18n } from "@/lang";
import type { PdfDesigner } from "../composables/usePdfDesigner";
import { PDF_ELEMENT_TYPE_PRESETS } from "../constants";
import type { PdfElementType } from "../types";

const props = defineProps<{
    designer: PdfDesigner;
    readonly?: boolean;
}>();

const handleAdd = (type: PdfElementType) => {
    if (props.readonly) return;
    props.designer.addElement(type);
};

const handleDragStart = (type: PdfElementType) => {
    (window as any).__pdfDragType = type;
};
</script>

<template>
    <div class="pdf-element-panel">
        <div class="panel-header">{{ i18n("pdf.elementPanel.title") }}</div>
        <div class="panel-body">
            <div class="element-grid">
                <div
                    v-for="preset in PDF_ELEMENT_TYPE_PRESETS"
                    :key="preset.type"
                    class="element-item"
                    :class="{ disabled: readonly }"
                    @click="handleAdd(preset.type)"
                    draggable="true"
                    @dragstart="() => handleDragStart(preset.type)"
                >
                    <el-icon class="icon">
                        <component :is="preset.icon"/>
                    </el-icon>
                    <span class="label">{{ preset.label }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.pdf-element-panel {
    width: 220px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--el-border-color);
    background: var(--el-bg-color);
    overflow: hidden;

    .panel-header {
        padding: 8px 12px;
        font-weight: 600;
        border-bottom: 1px solid var(--el-border-color);
    }

    .panel-body {
        flex: 1;
        overflow: auto;
        padding: 8px;
    }

    .element-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
    }

    .element-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 12px 8px;
        background: var(--el-fill-color-light);
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        font-size: 12px;
        transition: background 0.2s;

        &:hover {
            background: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
        }

        &.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .icon {
            font-size: 18px;
        }
    }
}
</style>
