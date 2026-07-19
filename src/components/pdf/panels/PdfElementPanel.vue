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

/** 获取元素类型图标 SVG */
const getElementIcon = (type: PdfElementType): string => {
    const icons: Record<string, string> = {
        heading: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16"/><path d="M18 4v16"/><path d="M6 12h12"/></svg>`,
        text: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>`,
        paragraph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"/><path d="M4 10h16"/><path d="M4 14h10"/><path d="M4 18h6"/></svg>`,
        image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
        table: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
        divider: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>`,
        pageBreak: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12" stroke-dasharray="3 3"/></svg>`,
        barcode: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="4" y2="20"/><line x1="7" y1="4" x2="7" y2="20"/><line x1="10" y1="4" x2="10" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="15" y1="4" x2="15" y2="20"/><line x1="18" y1="4" x2="18" y2="20"/><line x1="20" y1="4" x2="20" y2="20"/></svg>`,
        qrcode: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><rect x="19" y="14" width="2" height="2"/><rect x="14" y="19" width="2" height="2"/><rect x="19" y="19" width="2" height="2"/></svg>`,
        signature: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
        checkbox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>`,
        date: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    };
    return icons[type] || icons.text;
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
                    <span class="svg-icon" v-html="getElementIcon(preset.type)"></span>
                    <span class="label">{{ preset.label }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.pdf-element-panel {
    width: 100%;
    height: 100%;
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

        .svg-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;

            :deep(svg) {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
