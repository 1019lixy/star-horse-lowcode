<script setup lang="ts" name="PdfCanvas">
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import type { PdfDesigner } from "../composables/usePdfDesigner";
import { MM_TO_PX } from "../constants";
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
    origWidth: number;
    origHeight: number;
    origLeft: number;
    origTop: number;
    mode: string;
} | null>(null);

/** 辅助线 */
const guideLines = ref<{ horizontal: number[]; vertical: number[] }>({ horizontal: [], vertical: [] });

/** 当前选中元素 ID */
const selectedElementId = computed(() => props.designer.selectedElementId.value);

/** 判断是否文本类型 */
const isTextType = (type: string): boolean => ["text", "heading", "paragraph", "date"].includes(type);

/** 获取元素内容样式 */
const getContentStyle = (el: PdfElement) => {
    const font = (el as any).font || {};
    return {
        fontFamily: font.family || "Microsoft YaHei",
        fontSize: `${(font.size || 12) * scale.value}px`,
        fontWeight: font.weight || "normal",
        fontStyle: font.style || "normal",
        color: font.color || "#000",
        textAlign: (el as any).align || "left",
        lineHeight: "1.5",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        boxSizing: "border-box" as const,
        padding: "2px",
    };
};

/** 处理画布点击空白 */
const handleCanvasClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
        props.designer.selectElement(null);
        guideLines.value = { horizontal: [], vertical: [] };
    }
};

/** 元素点击 */
const handleElementClick = (e: MouseEvent, el: PdfElement) => {
    e.stopPropagation();
    props.designer.selectElement(el.id);
    updateGuideLines(el);
};

/** 更新辅助线（选中元素时显示中心线） */
const updateGuideLines = (el: PdfElement) => {
    const cx = el.x + el.width / 2;
    const cy = el.y + el.height / 2;
    guideLines.value = {
        horizontal: [cy],
        vertical: [cx],
    };
};

/** 元素拖拽/resize 开始 */
const handleElementMouseDown = (e: MouseEvent, el: PdfElement, mode: string = "move") => {
    if (props.readonly) return;
    e.stopPropagation();
    e.preventDefault();
    props.designer.selectElement(el.id);
    updateGuideLines(el);
    dragState.value = {
        elementId: el.id,
        startX: e.clientX,
        startY: e.clientY,
        origX: el.x,
        origY: el.y,
        origWidth: el.width,
        origHeight: el.height,
        origLeft: el.x,
        origTop: el.y,
        mode,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
};

const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.value) return;
    const dx = (e.clientX - dragState.value.startX) / scale.value / MM_TO_PX;
    const dy = (e.clientY - dragState.value.startY) / scale.value / MM_TO_PX;
    const el = props.designer.state.elements.find((item) => item.id === dragState.value!.elementId);
    if (!el) return;

    const mode = dragState.value.mode;
    if (mode === "move") {
        el.x = Math.max(0, dragState.value.origX + dx);
        el.y = Math.max(0, dragState.value.origY + dy);
    } else if (mode.startsWith("resize-")) {
        const dir = mode.slice(7); // tl/tr/bl/br/tc/bc/ml/mr
        const orig = dragState.value;
        if (dir.includes("r")) {
            el.width = Math.max(10, orig.origWidth + dx);
        }
        if (dir.includes("l")) {
            const newWidth = orig.origWidth - dx;
            if (newWidth >= 10) {
                el.x = orig.origLeft + dx;
                el.width = newWidth;
            }
        }
        if (dir.includes("b")) {
            el.height = Math.max(10, orig.origHeight + dy);
        }
        if (dir.includes("t")) {
            const newHeight = orig.origHeight - dy;
            if (newHeight >= 10) {
                el.y = orig.origTop + dy;
                el.height = newHeight;
            }
        }
    }
    updateGuideLines(el);
};

const handleMouseUp = () => {
    if (dragState.value) {
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
                <div class="elements-layer" :style="{ width: '100%', height: '100%', position: 'relative' }">
                    <!-- 辅助线 -->
                    <template v-if="selectedElementId">
                        <div
                            v-for="hLine in guideLines.horizontal"
                            :key="'h-' + hLine"
                            class="guide-line horizontal"
                            :style="{ top: `${hLine * MM_TO_PX * scale}px` }"
                        />
                        <div
                            v-for="vLine in guideLines.vertical"
                            :key="'v-' + vLine"
                            class="guide-line vertical"
                            :style="{ left: `${vLine * MM_TO_PX * scale}px` }"
                        />
                    </template>

                    <!-- 元素渲染 -->
                    <div
                        v-for="el in designer.state.elements"
                        :key="el.id"
                        class="element-wrapper"
                        :class="{ selected: el.id === selectedElementId }"
                        :style="{
                            position: 'absolute',
                            left: `${el.x * MM_TO_PX * scale}px`,
                            top: `${el.y * MM_TO_PX * scale}px`,
                            width: `${el.width * MM_TO_PX * scale}px`,
                            height: `${el.height * MM_TO_PX * scale}px`,
                            transform: `rotate(${el.rotation || 0}deg)`,
                            zIndex: el.zIndex ?? 0,
                        }"
                        @click="(e) => handleElementClick(e, el)"
                        @mousedown="(e) => handleElementMouseDown(e, el, 'move')"
                    >
                        <!-- 元素内容 -->
                        <div class="element-content" :style="getContentStyle(el)">
                            <!-- 文本类型 -->
                            <template v-if="isTextType(el.type)">
                                <span v-if="el.type === 'heading'" :style="{ fontSize: '18px', fontWeight: 'bold' }">{{ (el as any).text || i18n('pdf.element.text') }}</span>
                                <span v-else>{{ (el as any).text || i18n('pdf.element.text') }}</span>
                            </template>
                            <!-- 图片类型 -->
                            <template v-else-if="el.type === 'image' || el.type === 'signature'">
                                <img v-if="(el as any).src" :src="(el as any).src" style="width:100%;height:100%;object-fit:contain"/>
                                <span v-else class="placeholder">[{{ el.type === 'signature' ? 'Signature' : 'Image' }}]</span>
                            </template>
                            <!-- 表格类型 -->
                            <template v-else-if="el.type === 'table'">
                                <table style="border-collapse:collapse;width:100%;font-size:12px">
                                    <thead>
                                        <tr>
                                            <th v-for="(col, ci) in ((el as any).columns || [])"
                                                :key="ci"
                                                :style="{ border: '1px solid #ddd', padding: '4px', background: '#f5f7fa', textAlign: col.align || 'center', width: `${col.width * MM_TO_PX}px` }"
                                            >{{ col.label }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td v-for="(col, ci) in ((el as any).columns || [])"
                                                :key="ci"
                                                :style="{ border: '1px solid #ddd', padding: '4px', textAlign: col.align || 'center' }"
                                            >&nbsp;</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </template>
                            <!-- 分割线 -->
                            <template v-else-if="el.type === 'divider'">
                                <div :style="{ borderTop: `${(el as any).thickness || 1}px ${(el as any).style || 'solid'} ${(el as any).color || '#000'}`, width: '100%', marginTop: '50%' }"></div>
                            </template>
                            <!-- 条码 -->
                            <template v-else-if="el.type === 'barcode'">
                                <span style="font-family:'Courier New';letter-spacing:2px;font-size:14px">{{ (el as any).value || '' }}</span>
                            </template>
                            <!-- 二维码 -->
                            <template v-else-if="el.type === 'qrcode'">
                                <svg viewBox="0 0 100 100" width="100%" height="100%">
                                    <rect width="100" height="100" fill="#fff"/>
                                    <rect x="0" y="0" width="30" height="30" fill="#000"/>
                                    <rect x="70" y="0" width="30" height="30" fill="#000"/>
                                    <rect x="0" y="70" width="30" height="30" fill="#000"/>
                                    <rect x="30" y="30" width="10" height="10" fill="#000"/>
                                    <rect x="45" y="45" width="10" height="10" fill="#000"/>
                                </svg>
                            </template>
                            <!-- 复选框 -->
                            <template v-else-if="el.type === 'checkbox'">
                                <div style="display:flex;align-items:center;gap:4px">
                                    <div style="width:14px;height:14px;border:1px solid #333;display:flex;align-items:center;justify-content:center">{{ (el as any).checked ? '✓' : '' }}</div>
                                    <span v-if="(el as any).label">{{ (el as any).label }}</span>
                                </div>
                            </template>
                            <!-- 分页符 -->
                            <template v-else-if="el.type === 'pageBreak'">
                                <span style="color:#999;font-size:11px">--- Page Break ---</span>
                            </template>
                        </div>

                        <!-- Resize 手柄（选中时显示 8 个控制点） -->
                        <template v-if="el.id === selectedElementId && !readonly">
                            <div class="resize-handle top-left" @mousedown.stop="(e) => handleElementMouseDown(e, el, 'resize-tl')"/>
                            <div class="resize-handle top-right" @mousedown.stop="(e) => handleElementMouseDown(e, el, 'resize-tr')"/>
                            <div class="resize-handle bottom-left" @mousedown.stop="(e) => handleElementMouseDown(e, el, 'resize-bl')"/>
                            <div class="resize-handle bottom-right" @mousedown.stop="(e) => handleElementMouseDown(e, el, 'resize-br')"/>
                            <div class="resize-handle top-center" @mousedown.stop="(e) => handleElementMouseDown(e, el, 'resize-tc')"/>
                            <div class="resize-handle bottom-center" @mousedown.stop="(e) => handleElementMouseDown(e, el, 'resize-bc')"/>
                            <div class="resize-handle middle-left" @mousedown.stop="(e) => handleElementMouseDown(e, el, 'resize-ml')"/>
                            <div class="resize-handle middle-right" @mousedown.stop="(e) => handleElementMouseDown(e, el, 'resize-mr')"/>
                        </template>
                    </div>
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
    width: 100%;
    height: 100%;
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
                box-sizing: border-box;

                &:hover {
                    outline: 1px dashed var(--el-color-primary);
                }

                &.selected {
                    outline: 2px solid var(--el-color-primary);
                }

                .element-content {
                    pointer-events: none;
                    word-break: break-all;
                    white-space: pre-wrap;

                    .placeholder {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        height: 100%;
                        color: #999;
                        font-size: 11px;
                        border: 1px dashed #ccc;
                    }
                }
            }
        }
    }

    .guide-line {
        position: absolute;
        pointer-events: none;
        z-index: 9999;

        &.horizontal {
            left: 0;
            right: 0;
            height: 1px;
            background: rgba(64, 158, 255, 0.5);
            border-top: 1px dashed var(--el-color-primary);
        }

        &.vertical {
            top: 0;
            bottom: 0;
            width: 1px;
            background: rgba(64, 158, 255, 0.5);
            border-left: 1px dashed var(--el-color-primary);
        }
    }

    .resize-handle {
        position: absolute;
        width: 8px;
        height: 8px;
        background: var(--el-color-primary);
        border: 1px solid #fff;
        border-radius: 50%;
        z-index: 10;

        &.top-left { top: -4px; left: -4px; cursor: nwse-resize; }
        &.top-right { top: -4px; right: -4px; cursor: nesw-resize; }
        &.bottom-left { bottom: -4px; left: -4px; cursor: nesw-resize; }
        &.bottom-right { bottom: -4px; right: -4px; cursor: nwse-resize; }
        &.top-center { top: -4px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
        &.bottom-center { bottom: -4px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
        &.middle-left { top: 50%; left: -4px; transform: translateY(-50%); cursor: ew-resize; }
        &.middle-right { top: 50%; right: -4px; transform: translateY(-50%); cursor: ew-resize; }
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
