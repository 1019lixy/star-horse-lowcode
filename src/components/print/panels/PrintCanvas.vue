<script setup lang="ts" name="PrintCanvas">
/**
 * 打印模板设计器 - 中央画布
 * 职责：渲染纸张、元素拖拽/选中、标尺、网格
 * 不处理属性编辑（由 PrintPropertyPanel 负责）
 */
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import { MM_TO_PX } from "../constants";
import type { PrintElement } from "../types";
import type { UsePrintDesignerReturn } from "../composables/usePrintDesigner";

const props = defineProps<{
    designer: UsePrintDesignerReturn;
}>();

const canvasRef = ref<HTMLElement>();

const paper = computed(() => props.designer.state.template.paper);
const elements = computed(() => props.designer.state.template.elements);
const zoom = computed(() => props.designer.state.zoom);
const selectedIds = computed(() => props.designer.state.selectedIds);

const paperWidthPx = computed(() => paper.value.width * MM_TO_PX * zoom.value);
const paperHeightPx = computed(() => paper.value.height * MM_TO_PX * zoom.value);
const marginTopPx = computed(() => paper.value.margin[0] * MM_TO_PX * zoom.value);
const marginLeftPx = computed(() => paper.value.margin[3] * MM_TO_PX * zoom.value);

const elementStyle = (el: PrintElement) => {
    return {
        position: "absolute" as const,
        left: `${el.x * MM_TO_PX * zoom.value}px`,
        top: `${el.y * MM_TO_PX * zoom.value}px`,
        width: `${el.width * MM_TO_PX * zoom.value}px`,
        height: `${el.height * MM_TO_PX * zoom.value}px`,
        transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
        opacity: el.opacity ?? 1,
    };
};

const isSelected = (el: PrintElement) => selectedIds.value.includes(el.id);

const handleClick = (e: MouseEvent, el: PrintElement) => {
    e.stopPropagation();
    props.designer.selectElement(el.id, e.ctrlKey || e.metaKey);
};

const handleCanvasClick = () => {
    props.designer.clearSelection();
};

const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer?.getData("print-element-type");
    if (!type || !canvasRef.value) return;
    const rect = canvasRef.value.getBoundingClientRect();
    const x = (e.clientX - rect.left - marginLeftPx.value) / (MM_TO_PX * zoom.value);
    const y = (e.clientY - rect.top - marginTopPx.value) / (MM_TO_PX * zoom.value);
    props.designer.addElement(type, {
        x: props.designer.snapValue(Math.max(0, x)),
        y: props.designer.snapValue(Math.max(0, y)),
    } as any);
};

const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
};

// 拖动元素
const dragging = ref<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

const startDrag = (e: MouseEvent, el: PrintElement) => {
    if (props.designer.state.readonly || el.locked) return;
    if (!isSelected(el)) {
        props.designer.selectElement(el.id);
    }
    dragging.value = {
        id: el.id,
        startX: e.clientX,
        startY: e.clientY,
        origX: el.x,
        origY: el.y,
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
};

const onMouseMove = (e: MouseEvent) => {
    if (!dragging.value) return;
    const dx = (e.clientX - dragging.value.startX) / (MM_TO_PX * zoom.value);
    const dy = (e.clientY - dragging.value.startY) / (MM_TO_PX * zoom.value);
    const newX = props.designer.snapValue(dragging.value.origX + dx);
    const newY = props.designer.snapValue(dragging.value.origY + dy);
    props.designer.updateElement(dragging.value.id, { x: newX, y: newY });
};

const onMouseUp = () => {
    if (dragging.value) {
        props.designer.pushHistory();
    }
    dragging.value = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
};

// 网格尺寸
const gridSizePx = computed(() => 5 * MM_TO_PX * zoom.value);

// 标尺刻度
const rulerTicks = computed(() => {
    const ticks: { pos: number; label: string }[] = [];
    const max = Math.max(paper.value.width, paper.value.height);
    for (let i = 0; i <= max; i += 10) {
        ticks.push({
            pos: i * MM_TO_PX * zoom.value,
            label: `${i}`,
        });
    }
    return ticks;
});

// 元素显示内容（用于画布上的预览）
const elementContent = (el: PrintElement): string => {
    const b = el.dataBinding;
    if (!b) return el.name;
    switch (b.source) {
        case "static":
            return b.staticValue || el.name;
        case "field":
            return `\${${b.fieldName}}`;
        case "formula":
            return `=${b.formula}`;
        case "system":
            return `{{${b.systemVar}}}`;
        default:
            return el.name;
    }
};
</script>

<template>
    <div class="print-canvas-wrapper">
        <!-- 水平标尺 -->
        <div class="ruler ruler-h" v-if="designer.state.showRuler">
            <div class="ruler-inner" :style="{ width: paperWidthPx + 'px' }">
                <div
                    v-for="tick in rulerTicks"
                    :key="tick.label"
                    class="ruler-tick"
                    :style="{ left: tick.pos + 'px' }"
                >
                    <span class="ruler-label">{{ tick.label }}</span>
                </div>
            </div>
        </div>
        <!-- 垂直标尺 -->
        <div class="ruler ruler-v" v-if="designer.state.showRuler">
            <div class="ruler-inner" :style="{ height: paperHeightPx + 'px' }">
                <div
                    v-for="tick in rulerTicks"
                    :key="tick.label"
                    class="ruler-tick"
                    :style="{ top: tick.pos + 'px' }"
                >
                    <span class="ruler-label">{{ tick.label }}</span>
                </div>
            </div>
        </div>

        <div class="canvas-scroll-area" ref="canvasRef" @click="handleCanvasClick">
            <div class="canvas-inner" :style="{ padding: '20px' }">
                <!-- 纸张容器 -->
                <div
                    class="paper"
                    :style="{
                        width: paperWidthPx + 'px',
                        height: paperHeightPx + 'px',
                        paddingTop: marginTopPx + 'px',
                        paddingLeft: marginLeftPx + 'px',
                    }"
                    @drop="handleDrop"
                    @dragover="handleDragOver"
                >
                    <!-- 网格背景 -->
                    <div
                        v-if="designer.state.showGrid"
                        class="grid-bg"
                        :style="{
                            backgroundSize: gridSizePx + 'px ' + gridSizePx + 'px',
                        }"
                    ></div>

                    <!-- 可绘制区域 -->
                    <div class="content-area">
                        <div
                            v-for="el in elements"
                            :key="el.id"
                            class="print-element"
                            :class="{
                                selected: isSelected(el),
                                locked: el.locked,
                            }"
                            :style="elementStyle(el)"
                            @click="(e) => handleClick(e, el)"
                            @mousedown="(e) => startDrag(e, el)"
                        >
                            <component
                                :is="el.type + '-preview'"
                                v-if="false"
                            />
                            <div class="element-content">
                                {{ elementContent(el) }}
                            </div>
                            <!-- 选中框 8 个调整点 -->
                            <template v-if="isSelected(el) && !designer.state.readonly">
                                <div class="resize-handle handle-nw"></div>
                                <div class="resize-handle handle-ne"></div>
                                <div class="resize-handle handle-sw"></div>
                                <div class="resize-handle handle-se"></div>
                                <div class="resize-handle handle-n"></div>
                                <div class="resize-handle handle-s"></div>
                                <div class="resize-handle handle-w"></div>
                                <div class="resize-handle handle-e"></div>
                            </template>
                        </div>
                    </div>

                    <!-- 纸张信息 -->
                    <div class="paper-info">
                        {{ paper.width }}mm × {{ paper.height }}mm · {{ paper.orientation === 'portrait' ? i18n('print.paper.portrait') : i18n('print.paper.landscape') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.print-canvas-wrapper {
    flex: 1;
    display: flex;
    position: relative;
    overflow: hidden;
    background: #E0E0E0;
}

.ruler {
    background: var(--el-bg-color);
    color: var(--el-text-color-secondary);
    font-size: 10px;
    position: absolute;
    z-index: 10;

    .ruler-inner {
        position: relative;
    }

    .ruler-tick {
        position: absolute;

        .ruler-label {
            font-size: 9px;
        }
    }
}

.ruler-h {
    top: 0;
    left: 20px;
    right: 0;
    height: 20px;
    border-bottom: 1px solid var(--el-border-color);

    .ruler-tick {
        .ruler-label {
            display: block;
            margin-left: 2px;
        }
    }
}

.ruler-v {
    top: 20px;
    left: 0;
    bottom: 0;
    width: 20px;
    border-right: 1px solid var(--el-border-color);

    .ruler-tick {
        .ruler-label {
            display: block;
            transform: rotate(-90deg);
            transform-origin: 0 0;
            margin-top: 12px;
            margin-left: 4px;
        }
    }
}

.canvas-scroll-area {
    flex: 1;
    overflow: auto;
    margin-top: 20px;
    margin-left: 20px;
}

.canvas-inner {
    min-width: 100%;
    min-height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
}

.paper {
    position: relative;
    background: #FFFFFF;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
    flex-shrink: 0;
    box-sizing: border-box;

    .grid-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image:
            linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
        pointer-events: none;
    }

    .content-area {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .print-element {
        border: 1px dashed transparent;
        cursor: move;
        box-sizing: border-box;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        &:hover {
            border-color: var(--el-color-primary-light-5);
        }

        &.selected {
            border-color: var(--el-color-primary);
            border-style: solid;
        }

        &.locked {
            cursor: not-allowed;
            opacity: 0.7;
        }

        .element-content {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: inherit;
            font-size: 12px;
            color: #333;
            padding: 2px;
            box-sizing: border-box;
        }

        .resize-handle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: var(--el-color-primary);
            border: 1px solid #FFFFFF;
            border-radius: 50%;
            z-index: 1;
        }

        .handle-nw { top: -4px; left: -4px; cursor: nwse-resize; }
        .handle-ne { top: -4px; right: -4px; cursor: nesw-resize; }
        .handle-sw { bottom: -4px; left: -4px; cursor: nesw-resize; }
        .handle-se { bottom: -4px; right: -4px; cursor: nwse-resize; }
        .handle-n { top: -4px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
        .handle-s { bottom: -4px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
        .handle-w { top: 50%; left: -4px; transform: translateY(-50%); cursor: ew-resize; }
        .handle-e { top: 50%; right: -4px; transform: translateY(-50%); cursor: ew-resize; }
    }

    .paper-info {
        position: absolute;
        bottom: -28px;
        left: 0;
        font-size: 11px;
        color: var(--el-text-color-secondary);
    }
}
</style>
