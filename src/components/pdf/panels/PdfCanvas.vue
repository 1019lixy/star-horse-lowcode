<script setup lang="ts" name="PdfCanvas">
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import type { PdfDesigner } from "../composables/usePdfDesigner";
import { MM_TO_PX } from "../constants";
import { renderElement } from "../renderers/PdfHtmlRenderer";
import type { PdfElement } from "../types";

const props = defineProps<{
    designer: PdfDesigner;
    readonly?: boolean;
}>();

/** 缩放比例（80% 显示） */
const scale = ref(0.8);

const pageWidthPx = computed(() => props.designer.state.page.width * MM_TO_PX * scale.value);
const pageHeightPx = computed(() => props.designer.state.page.height * MM_TO_PX * scale.value);
const marginTopPx = computed(() => props.designer.state.page.marginTop * MM_TO_PX * scale.value);
const marginLeftPx = computed(() => props.designer.state.page.marginLeft * MM_TO_PX * scale.value);

/** 拖拽状态 */
const dragState = ref<{
    elementId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    mode: "move" | "resize";
} | null>(null);

/** 处理画布点击空白 */
const handleCanvasClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
        props.designer.selectElement(null);
    }
};

/** 元素点击 */
const handleElementClick = (e: MouseEvent, el: PdfElement) => {
    e.stopPropagation();
    props.designer.selectElement(el.id);
};

/** 元素拖拽开始 */
const handleElementMouseDown = (e: MouseEvent, el: PdfElement, mode: "move" | "resize" = "move") => {
    if (props.readonly) return;
    e.stopPropagation();
    e.preventDefault();
    props.designer.selectElement(el.id);
    dragState.value = {
        elementId: el.id,
        startX: e.clientX,
        startY: e.clientY,
        origX: el.x,
        origY: el.y,
        mode,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
};

const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.value) return;
    const dx = (e.clientX - dragState.value.startX) / scale.value / MM_TO_PX;
    const dy = (e.clientY - dragState.value.startY) / scale.value / MM_TO_PX;
    const el = props.designer.state.elements.find((e) => e.id === dragState.value!.elementId);
    if (!el) return;
    if (dragState.value.mode === "move") {
        el.x = Math.max(0, dragState.value.origX + dx);
        el.y = Math.max(0, dragState.value.origY + dy);
    } else if (dragState.value.mode === "resize") {
        el.width = Math.max(10, dragState.value.origX + dx);
        el.height = Math.max(10, dragState.value.origY + dy);
    }
};

const handleMouseUp = () => {
    if (dragState.value) {
        // 触发历史记录
        props.designer.moveElement(dragState.value.elementId, 0, 0);
    }
    dragState.value = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
};

/** 拖拽放置 */
const handleDrop = (e: DragEvent) => {
    if (props.readonly) return;
    e.preventDefault();
    const type = (window as any).__pdfDragType;
    if (!type) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left - marginLeftPx.value) / scale.value / MM_TO_PX;
    const y = (e.clientY - rect.top - marginTopPx.value) / scale.value / MM_TO_PX;
    props.designer.addElement(type, { x, y });
    (window as any).__pdfDragType = null;
};

/** 渲染元素 HTML */
const renderEl = (el: PdfElement) => renderElement(el);
</script>

<template>
    <div class="pdf-canvas">
        <div class="canvas-scroll">
            <div
                class="pdf-page"
                :style="{
                    width: `${pageWidthPx}px`,
                    height: `${pageHeightPx}px`,
                    paddingTop: `${marginTopPx}px`,
                    paddingLeft: `${marginLeftPx}px`,
                    paddingRight: `${designer.state.page.marginRight * MM_TO_PX * scale}px`,
                    paddingBottom: `${designer.state.page.marginBottom * MM_TO_PX * scale}px`,
                    background: designer.state.page.background || '#FFFFFF'
                }"
                @click="handleCanvasClick"
                @dragover="(e) => e.preventDefault()"
                @drop="handleDrop"
            >
                <div class="elements-layer" :style="{ width: '100%', height: '100%', position: 'relative', transform: `scale(${scale})`, transformOrigin: 'top left' }">
                    <div
                        v-for="el in designer.state.elements"
                        :key="el.id"
                        class="element-wrapper"
                        :class="{ selected: el.id === designer.selectedElementId }"
                        @click="(e) => handleElementClick(e, el)"
                        @mousedown="(e) => handleElementMouseDown(e, el, 'move')"
                        v-html="renderEl(el)"
                    />
                </div>
            </div>
        </div>
        <div class="scale-tip">
            {{ i18n("pdf.canvas.scale") }}: {{ Math.round(scale * 100) }}%
        </div>
    </div>
</template>

<style lang="scss" scoped>
.pdf-canvas {
    flex: 1;
    overflow: auto;
    background: var(--el-bg-color-page);
    display: flex;
    flex-direction: column;
    position: relative;

    .canvas-scroll {
        flex: 1;
        overflow: auto;
        padding: 16px;
        display: flex;
        justify-content: center;
    }

    .pdf-page {
        position: relative;
        background: #FFFFFF;
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        flex-shrink: 0;

        .elements-layer {
            .element-wrapper {
                cursor: move;
                outline: 1px solid transparent;

                &:hover {
                    outline: 1px dashed var(--el-color-primary);
                }

                &.selected {
                    outline: 2px solid var(--el-color-primary);
                }

                :deep(> div) {
                    pointer-events: none;
                }
            }
        }
    }

    .scale-tip {
        position: absolute;
        bottom: 8px;
        right: 16px;
        background: var(--el-bg-color);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
}
</style>
