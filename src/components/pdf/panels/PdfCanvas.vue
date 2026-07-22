<script setup lang="ts" name="PdfCanvas">
import { computed, ref, nextTick, onMounted, onBeforeUnmount } from "vue";
import { i18n } from "@/lang";
import { ShSvgIcon } from "@/components/shared";
import type { PdfDesigner } from "../composables/usePdfDesigner";
import { MM_TO_PX } from "../constants";
import type { PdfElement } from "../types";

const props = defineProps<{
    designer: PdfDesigner;
    readonly?: boolean;
}>();

/** 缩放比例 */
const scale = ref(0.8);

/** 标尺宽度（像素） */
const RULER_SIZE = 24;

const pageWidthPx = computed(() => props.designer.state.page.width * MM_TO_PX * scale.value);
const pageHeightPx = computed(() => props.designer.state.page.height * MM_TO_PX * scale.value);
const marginTopPx = computed(() => props.designer.state.page.marginTop * MM_TO_PX * scale.value);
const marginLeftPx = computed(() => props.designer.state.page.marginLeft * MM_TO_PX * scale.value);
const marginRightPx = computed(() => props.designer.state.page.marginRight * MM_TO_PX * scale.value);
const marginBottomPx = computed(() => props.designer.state.page.marginBottom * MM_TO_PX * scale.value);

/** 内容区域尺寸 */
const contentWidthPx = computed(() => pageWidthPx.value - marginLeftPx.value - marginRightPx.value);
const contentHeightPx = computed(() => pageHeightPx.value - marginTopPx.value - marginBottomPx.value);

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
    moved: boolean;
} | null>(null);

/** 辅助线 */
const guideLines = ref<{ horizontal: number[]; vertical: number[] }>({ horizontal: [], vertical: [] });

/** 选中元素 ID 列表 */
const selectedElementIds = computed(() => props.designer.selectedElementIds.value);

/** 框选状态 */
const boxSelect = ref<{ startX: number; startY: number; endX: number; endY: number } | null>(null);

/** 右键菜单 */
const contextMenu = ref<{
    visible: boolean;
    x: number;
    y: number;
    items: { key: string; label: string; icon: string; divider?: boolean; disabled?: boolean }[];
}>({ visible: false, x: 0, y: 0, items: [] });

/** 滚动偏移 */
const scrollLeft = ref(0);
const scrollTop = ref(0);

const canvasRef = ref<HTMLElement | null>(null);

/* ── 原地编辑 ── */
const editingId = ref<string | null>(null);
const editText = ref("");
const editRef = ref<HTMLDivElement | null>(null);

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

/** 对齐吸附阈值（mm） */
const SNAP_THRESHOLD = 2;

/** 计算吸附辅助线 */
const computeSnapGuides = (el: PdfElement) => {
    const page = props.designer.state.page;
    const contentW = page.width - page.marginLeft - page.marginRight;
    const contentH = page.height - page.marginTop - page.marginBottom;

    const hLines: number[] = [];
    const vLines: number[] = [];

    const pageFeatures = {
        v: [0, page.marginLeft, page.marginLeft + contentW / 2, page.width - page.marginRight, page.width],
        h: [0, page.marginTop, page.marginTop + contentH / 2, page.height - page.marginBottom, page.height],
    };

    const elCx = el.x + el.width / 2;
    const elCy = el.y + el.height / 2;
    const elVFeatures = [el.x, elCx, el.x + el.width];
    const elHFeatures = [el.y, elCy, el.y + el.height];

    for (const ef of elVFeatures) {
        for (const pf of pageFeatures.v) {
            if (Math.abs(ef - pf) < SNAP_THRESHOLD) vLines.push(pf);
        }
    }
    for (const ef of elHFeatures) {
        for (const pf of pageFeatures.h) {
            if (Math.abs(ef - pf) < SNAP_THRESHOLD) hLines.push(pf);
        }
    }

    for (const other of props.designer.state.elements) {
        if (other.id === el.id) continue;
        const oCx = other.x + other.width / 2;
        const oCy = other.y + other.height / 2;
        const oVFeatures = [other.x, oCx, other.x + other.width];
        const oHFeatures = [other.y, oCy, other.y + other.height];

        for (const ef of elVFeatures) {
            for (const of_ of oVFeatures) {
                if (Math.abs(ef - of_) < SNAP_THRESHOLD) vLines.push(of_);
            }
        }
        for (const ef of elHFeatures) {
            for (const of_ of oHFeatures) {
                if (Math.abs(ef - of_) < SNAP_THRESHOLD) hLines.push(of_);
            }
        }
    }

    guideLines.value = {
        horizontal: [...new Set(hLines.map(l => Math.round(l * 10) / 10))],
        vertical: [...new Set(vLines.map(l => Math.round(l * 10) / 10))],
    };
};

/** 处理画布点击空白 */
const handleCanvasClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
        props.designer.clearSelection();
        guideLines.value = { horizontal: [], vertical: [] };
        editingId.value = null;
    }
    contextMenu.value.visible = false;
};

/** 元素点击 */
const handleElementClick = (e: MouseEvent, el: PdfElement) => {
    e.stopPropagation();
    props.designer.selectElement(el.id, e.ctrlKey || e.metaKey);
    contextMenu.value.visible = false;
};

/** 双击原地编辑文本 */
const handleElementDblClick = (e: MouseEvent, el: PdfElement) => {
    if (props.readonly) return;
    e.stopPropagation();
    if (!isTextType(el.type)) return;
    editingId.value = el.id;
    editText.value = (el as any).text || "";
    nextTick(() => {
        if (editRef.value) {
            editRef.value.focus();
            // 全选
            const range = document.createRange();
            range.selectNodeContents(editRef.value);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
    });
};

/** 原地编辑完成 */
const finishEditing = () => {
    if (!editingId.value) return;
    const el = props.designer.state.elements.find(e => e.id === editingId.value);
    if (el && isTextType(el.type)) {
        const newText = editRef.value?.innerText ?? editText.value;
        if ((el as any).text !== newText) {
            props.designer.pushHistory();
            (el as any).text = newText;
        }
    }
    editingId.value = null;
};

/** 编辑时按键处理 */
const handleEditKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
        finishEditing();
    } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        finishEditing();
    }
    e.stopPropagation();
};

/** 元素拖拽/resize 开始 */
const handleElementMouseDown = (e: MouseEvent, el: PdfElement, mode: string = "move") => {
    if (props.readonly) return;
    if (editingId.value === el.id) return; // 编辑中不拖拽
    e.stopPropagation();
    e.preventDefault();
    if (!selectedElementIds.value.includes(el.id)) {
        props.designer.selectElement(el.id, e.ctrlKey || e.metaKey);
    }
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
        moved: false,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
};

const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.value) return;
    const dx = (e.clientX - dragState.value.startX) / scale.value / MM_TO_PX;
    const dy = (e.clientY - dragState.value.startY) / scale.value / MM_TO_PX;
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) dragState.value.moved = true;
    const el = props.designer.state.elements.find((item) => item.id === dragState.value!.elementId);
    if (!el) return;
    const mode = dragState.value.mode;
    if (mode === "move") {
        let newX = dragState.value.origX + dx;
        let newY = dragState.value.origY + dy;
        const page = props.designer.state.page;
        const contentW = page.width - page.marginLeft - page.marginRight;
        const contentH = page.height - page.marginTop - page.marginBottom;
        const snapPoints = {
            v: [page.marginLeft, page.marginLeft + contentW / 2, page.width - page.marginRight],
            h: [page.marginTop, page.marginTop + contentH / 2, page.height - page.marginBottom],
        };
        const elCx = newX + el.width / 2;
        const elCy = newY + el.height / 2;
        for (const sp of snapPoints.v) {
            if (Math.abs(newX - sp) < SNAP_THRESHOLD) { newX = sp; break; }
            if (Math.abs(elCx - sp) < SNAP_THRESHOLD) { newX = sp - el.width / 2; break; }
            if (Math.abs(newX + el.width - sp) < SNAP_THRESHOLD) { newX = sp - el.width; break; }
        }
        for (const sp of snapPoints.h) {
            if (Math.abs(newY - sp) < SNAP_THRESHOLD) { newY = sp; break; }
            if (Math.abs(elCy - sp) < SNAP_THRESHOLD) { newY = sp - el.height / 2; break; }
            if (Math.abs(newY + el.height - sp) < SNAP_THRESHOLD) { newY = sp - el.height; break; }
        }
        el.x = newX;
        el.y = newY;
    } else if (mode.startsWith("resize-")) {
        const dir = mode.slice(7);
        const orig = dragState.value;
        if (dir.includes("r")) el.width = Math.max(10, orig.origWidth + dx);
        if (dir.includes("l")) { const nw = orig.origWidth - dx; if (nw >= 10) { el.x = orig.origLeft + dx; el.width = nw; } }
        if (dir.includes("b")) el.height = Math.max(10, orig.origHeight + dy);
        if (dir.includes("t")) { const nh = orig.origHeight - dy; if (nh >= 10) { el.y = orig.origTop + dy; el.height = nh; } }
    }
    computeSnapGuides(el);
};

const handleMouseUp = () => {
    if (dragState.value?.moved) props.designer.pushHistory();
    guideLines.value = { horizontal: [], vertical: [] };
    dragState.value = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
};

/** 拖拽放置（从元素面板拖入画布） */
const handleDrop = (e: DragEvent) => {
    if (props.readonly) return;
    e.preventDefault();
    const type = (window as any).__pdfDragType;
    if (!type) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left - marginLeftPx.value) / scale.value / MM_TO_PX;
    const y = (e.clientY - rect.top - marginTopPx.value) / scale.value / MM_TO_PX;
    // addElement 内部已自动选中
    props.designer.addElement(type, { x, y });
    (window as any).__pdfDragType = null;
};

// ======================== 框选 ========================
const handleCanvasMouseDown = (e: MouseEvent) => {
    if (props.readonly || e.button !== 0) return;
    if (editingId.value) { finishEditing(); return; }
    const tgt = e.target as HTMLElement;
    if (!tgt.classList.contains("pdf-page") && !tgt.classList.contains("elements-layer") && e.currentTarget !== e.target) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    boxSelect.value = { startX: e.clientX - rect.left, startY: e.clientY - rect.top, endX: e.clientX - rect.left, endY: e.clientY - rect.top };
    document.addEventListener("mousemove", handleBoxSelectMove);
    document.addEventListener("mouseup", handleBoxSelectUp);
};

const handleBoxSelectMove = (e: MouseEvent) => {
    if (!boxSelect.value) return;
    const rect = (e.currentTarget as HTMLElement)?.getBoundingClientRect?.();
    if (!rect) return;
    boxSelect.value.endX = e.clientX - rect.left;
    boxSelect.value.endY = e.clientY - rect.top;
};

const handleBoxSelectUp = () => {
    if (boxSelect.value) {
        const bs = boxSelect.value;
        const minX = Math.min(bs.startX, bs.endX) / scale.value / MM_TO_PX;
        const minY = Math.min(bs.startY, bs.endY) / scale.value / MM_TO_PX;
        const maxX = Math.max(bs.startX, bs.endX) / scale.value / MM_TO_PX;
        const maxY = Math.max(bs.startY, bs.endY) / scale.value / MM_TO_PX;
        if (maxX - minX > 2 || maxY - minY > 2) {
            const ids: string[] = [];
            for (const el of props.designer.state.elements) {
                if (el.x >= minX && el.y >= minY && el.x + el.width <= maxX && el.y + el.height <= maxY) ids.push(el.id);
            }
            if (ids.length > 0) props.designer.selectedElementIds.value = ids;
        }
    }
    boxSelect.value = null;
    document.removeEventListener("mousemove", handleBoxSelectMove);
    document.removeEventListener("mouseup", handleBoxSelectUp);
};

const boxSelectStyle = computed(() => {
    if (!boxSelect.value) return { display: "none" };
    const bs = boxSelect.value;
    return { left: `${Math.min(bs.startX, bs.endX)}px`, top: `${Math.min(bs.startY, bs.endY)}px`, width: `${Math.abs(bs.endX - bs.startX)}px`, height: `${Math.abs(bs.endY - bs.startY)}px` };
});

// ======================== 右键菜单 ========================
const handleElementContextMenu = (e: MouseEvent, el: PdfElement) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedElementIds.value.includes(el.id)) props.designer.selectElement(el.id);
    contextMenu.value = {
        visible: true, x: e.clientX, y: e.clientY,
        items: [
            { key: "copy", label: i18n("pdf.context.copy"), icon: "copy" },
            { key: "cut", label: i18n("pdf.context.cut"), icon: "cut" },
            { key: "paste", label: i18n("pdf.context.paste"), icon: "paste", disabled: props.designer.clipboard.length === 0 },
            { key: "duplicate", label: i18n("pdf.context.duplicate"), icon: "duplicate" },
            { key: "delete", label: i18n("pdf.context.delete"), icon: "delete" },
            { key: "d1", label: "", icon: "", divider: true },
            { key: "bringToFront", label: i18n("pdf.context.bringToFront"), icon: "ctx-bringFront" },
            { key: "sendToBack", label: i18n("pdf.context.sendToBack"), icon: "ctx-sendBack" },
            { key: "d2", label: "", icon: "", divider: true },
            { key: "alignLeft", label: i18n("pdf.context.alignLeft"), icon: "align-left", disabled: props.designer.selectedCount < 2 },
            { key: "alignCenter", label: i18n("pdf.context.alignCenter"), icon: "align-center", disabled: props.designer.selectedCount < 2 },
            { key: "alignRight", label: i18n("pdf.context.alignRight"), icon: "align-right", disabled: props.designer.selectedCount < 2 },
            { key: "alignTop", label: i18n("pdf.context.alignTop"), icon: "align-top", disabled: props.designer.selectedCount < 2 },
            { key: "alignMiddle", label: i18n("pdf.context.alignMiddle"), icon: "align-middle", disabled: props.designer.selectedCount < 2 },
            { key: "alignBottom", label: i18n("pdf.context.alignBottom"), icon: "align-bottom", disabled: props.designer.selectedCount < 2 },
        ],
    };
};

const handleCanvasContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    contextMenu.value = {
        visible: true, x: e.clientX, y: e.clientY,
        items: [
            { key: "paste", label: i18n("pdf.context.paste"), icon: "paste", disabled: props.designer.clipboard.length === 0 },
            { key: "selectAll", label: i18n("pdf.context.selectAll"), icon: "selectAll" },
        ],
    };
};

const handleContextAction = (key: string) => {
    contextMenu.value.visible = false;
    const d = props.designer;
    const selId = d.selectedElementId.value;
    switch (key) {
        case "copy": d.copySelected(); break;
        case "cut": d.cutSelected(); break;
        case "paste": d.pasteElements(); break;
        case "duplicate": if (selId) d.duplicateElement(selId); break;
        case "delete": d.deleteSelected(); break;
        case "bringToFront": if (selId) d.bringToFront(selId); break;
        case "sendToBack": if (selId) d.sendToBack(selId); break;
        case "alignLeft": d.alignElements("left"); break;
        case "alignCenter": d.alignElements("center"); break;
        case "alignRight": d.alignElements("right"); break;
        case "alignTop": d.alignElements("top"); break;
        case "alignMiddle": d.alignElements("middle"); break;
        case "alignBottom": d.alignElements("bottom"); break;
        case "selectAll": d.selectAll(); break;
    }
};

// ======================== 键盘快捷键 ========================
const isInputFocused = (): boolean => {
    const el = document.activeElement;
    if (!el) return false;
    const tag = (el as HTMLElement).tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (el as HTMLElement).isContentEditable;
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (props.readonly || isInputFocused()) return;
    if (editingId.value) return;
    const ctrl = e.ctrlKey || e.metaKey;
    if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); props.designer.deleteSelected(); }
    else if (ctrl && e.key === "z" && !e.shiftKey) { e.preventDefault(); props.designer.undo(); }
    else if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); props.designer.redo(); }
    else if (ctrl && e.key === "c") { e.preventDefault(); props.designer.copySelected(); }
    else if (ctrl && e.key === "x") { e.preventDefault(); props.designer.cutSelected(); }
    else if (ctrl && e.key === "v") { e.preventDefault(); props.designer.pasteElements(); }
    else if (ctrl && e.key === "a") { e.preventDefault(); props.designer.selectAll(); }
    else if (ctrl && e.key === "d") { e.preventDefault(); const id = props.designer.selectedElementId.value; if (id) props.designer.duplicateElement(id); }
    else if (e.key === "Escape") { props.designer.clearSelection(); editingId.value = null; }
    else if (e.key === "ArrowLeft") { e.preventDefault(); props.designer.moveSelectedBy(e.shiftKey ? -10 : -1, 0); }
    else if (e.key === "ArrowRight") { e.preventDefault(); props.designer.moveSelectedBy(e.shiftKey ? 10 : 1, 0); }
    else if (e.key === "ArrowUp") { e.preventDefault(); props.designer.moveSelectedBy(0, e.shiftKey ? -10 : -1); }
    else if (e.key === "ArrowDown") { e.preventDefault(); props.designer.moveSelectedBy(0, e.shiftKey ? 10 : 1); }
};

/** 标尺刻度 */
const rulerHTicks = computed(() => {
    const page = props.designer.state.page;
    const ticks: { x: number; h: number; label?: string }[] = [];
    for (let mm = 0; mm <= page.width; mm++) {
        const x = mm * MM_TO_PX * scale.value;
        let h = 4;
        let label: string | undefined;
        if (mm % 10 === 0) { h = RULER_SIZE - 4; label = `${mm}`; }
        else if (mm % 5 === 0) { h = 10; }
        ticks.push({ x, h, label });
    }
    return ticks;
});

const rulerVTicks = computed(() => {
    const page = props.designer.state.page;
    const ticks: { y: number; h: number; label?: string }[] = [];
    for (let mm = 0; mm <= page.height; mm++) {
        const y = mm * MM_TO_PX * scale.value;
        let h = 4;
        let label: string | undefined;
        if (mm % 10 === 0) { h = RULER_SIZE - 4; label = `${mm}`; }
        else if (mm % 5 === 0) { h = 10; }
        ticks.push({ y, h, label });
    }
    return ticks;
});

const handleScroll = (e: Event) => {
    const target = e.currentTarget as HTMLElement;
    scrollLeft.value = target.scrollLeft;
    scrollTop.value = target.scrollTop;
};

/** 获取元素类型标签 */
const getTypeLabel = (el: PdfElement): string => {
    const labels: Record<string, string> = {
        text: i18n("pdf.element.text"),
        heading: i18n("pdf.element.heading"),
        paragraph: i18n("pdf.element.paragraph"),
        image: i18n("pdf.element.image"),
        table: i18n("pdf.element.table"),
        divider: i18n("pdf.element.divider"),
        barcode: i18n("pdf.element.barcode"),
        qrcode: i18n("pdf.element.qrcode"),
        signature: i18n("pdf.element.signature"),
        checkbox: i18n("pdf.element.checkbox"),
        date: i18n("pdf.element.date"),
        pageBreak: i18n("pdf.element.pageBreak"),
    };
    return labels[el.type] || el.type;
};

onMounted(() => { document.addEventListener("keydown", handleKeyDown); });
onBeforeUnmount(() => { document.removeEventListener("keydown", handleKeyDown); });
</script>

<template>
    <div class="pdf-canvas" @mousedown="handleCanvasMouseDown">
        <!-- 标尺区域 -->
        <div class="ruler-corner" :style="{ width: `${RULER_SIZE}px`, height: `${RULER_SIZE}px` }"></div>
        <div class="ruler-h" :style="{ height: `${RULER_SIZE}px`, left: `${RULER_SIZE}px` }">
            <svg :width="pageWidthPx + 40" :height="RULER_SIZE" class="ruler-svg-h"
                :style="{ transform: `translateX(${-(scrollLeft - 16)}px)` }"
            >
                <line v-for="(tick, idx) in rulerHTicks" :key="idx"
                    :x1="tick.x + 20" :y1="0" :x2="tick.x + 20" :y2="tick.h"
                    stroke="var(--el-text-color-secondary)" stroke-width="0.5"
                />
                <text v-for="(tick, idx) in rulerHTicks.filter(t => t.label)" :key="'l' + idx"
                    :x="tick.x! + 20" :y="RULER_SIZE - 2"
                    font-size="9" fill="var(--el-text-color-secondary)" text-anchor="middle"
                >{{ tick.label }}</text>
            </svg>
        </div>
        <div class="ruler-v" :style="{ width: `${RULER_SIZE}px`, top: `${RULER_SIZE}px` }">
            <svg :width="RULER_SIZE" :height="pageHeightPx + 40" class="ruler-svg-v"
                :style="{ transform: `translateY(${-(scrollTop - 16)}px)` }"
            >
                <line v-for="(tick, idx) in rulerVTicks" :key="idx"
                    :x1="0" :y1="tick.y + 20" :x2="tick.h" :y2="tick.y + 20"
                    stroke="var(--el-text-color-secondary)" stroke-width="0.5"
                />
                <text v-for="(tick, idx) in rulerVTicks.filter(t => t.label)" :key="'l' + idx"
                    :x="RULER_SIZE - 2" :y="tick.y! + 20 + 3"
                    font-size="9" fill="var(--el-text-color-secondary)" text-anchor="end"
                >{{ tick.label }}</text>
            </svg>
        </div>

        <div class="canvas-scroll" :style="{ marginTop: `${RULER_SIZE}px`, marginLeft: `${RULER_SIZE}px` }"
            @scroll="handleScroll"
            ref="canvasRef"
        >
            <div
                class="pdf-page"
                :style="{
                    width: `${pageWidthPx}px`,
                    height: `${pageHeightPx}px`,
                    background: designer.state.page.background || '#FFFFFF'
                }"
                @click="handleCanvasClick"
                @contextmenu="handleCanvasContextMenu"
                @dragover="(e) => e.preventDefault()"
                @drop="handleDrop"
            >
                <!-- 页边距可视化遮罩 -->
                <div class="margin-overlay" :style="{
                    top: `${marginTopPx}px`,
                    left: `${marginLeftPx}px`,
                    right: `${marginRightPx}px`,
                    bottom: `${marginBottomPx}px`,
                }">
                    <div class="elements-layer" :style="{ width: '100%', height: '100%', position: 'relative' }">
                        <!-- 辅助线 -->
                        <template v-if="dragState && (guideLines.horizontal.length || guideLines.vertical.length)">
                            <div v-for="hLine in guideLines.horizontal" :key="'h-' + hLine" class="guide-line horizontal" :style="{ top: `${hLine * MM_TO_PX * scale}px` }" />
                            <div v-for="vLine in guideLines.vertical" :key="'v-' + vLine" class="guide-line vertical" :style="{ left: `${vLine * MM_TO_PX * scale}px` }" />
                        </template>
                        <!-- 元素渲染 -->
                        <div
                            v-for="el in designer.state.elements"
                            :key="el.id"
                            class="element-wrapper"
                            :class="{
                                selected: selectedElementIds.includes(el.id),
                                editing: editingId === el.id,
                            }"
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
                            @dblclick="(e) => handleElementDblClick(e, el)"
                            @mousedown="(e) => handleElementMouseDown(e, el, 'move')"
                            @contextmenu="(e) => handleElementContextMenu(e, el)"
                        >
                            <!-- 原地编辑模式（文本类元素） -->
                            <div
                                v-if="editingId === el.id && isTextType(el.type)"
                                class="element-edit"
                                ref="editRef"
                                contenteditable="true"
                                :style="getContentStyle(el)"
                                @blur="finishEditing"
                                @keydown="handleEditKeyDown"
                                v-text="(el as any).text || ''"
                            />
                            <!-- 正常渲染 -->
                            <template v-else>
                                <div class="element-content" :style="getContentStyle(el)">
                                    <template v-if="isTextType(el.type)">
                                        <span v-if="el.type === 'heading'" :style="{ fontSize: '18px', fontWeight: 'bold' }">{{ (el as any).text || getTypeLabel(el) }}</span>
                                        <span v-else>{{ (el as any).text || getTypeLabel(el) }}</span>
                                    </template>
                                    <template v-else-if="el.type === 'image' || el.type === 'signature'">
                                        <img v-if="(el as any).src" :src="(el as any).src" style="width:100%;height:100%;object-fit:contain"/>
                                        <div v-else class="placeholder">
                                            <span>{{ getTypeLabel(el) }}</span>
                                        </div>
                                    </template>
                                    <template v-else-if="el.type === 'table'">
                                        <table style="border-collapse:collapse;width:100%;font-size:12px">
                                            <thead><tr><th v-for="(col, ci) in ((el as any).columns || [])" :key="ci" :style="{ border: '1px solid #ddd', padding: '4px', background: '#f5f7fa', textAlign: col.align || 'center', width: `${col.width * MM_TO_PX}px` }">{{ col.label }}</th></tr></thead>
                                            <tbody><tr><td v-for="(col, ci) in ((el as any).columns || [])" :key="ci" :style="{ border: '1px solid #ddd', padding: '4px', textAlign: col.align || 'center' }">&nbsp;</td></tr></tbody>
                                        </table>
                                    </template>
                                    <template v-else-if="el.type === 'divider'">
                                        <div :style="{ borderTop: `${(el as any).thickness || 1}px ${(el as any).style || 'solid'} ${(el as any).color || '#000'}`, width: '100%', marginTop: '50%' }"></div>
                                    </template>
                                    <template v-else-if="el.type === 'barcode'">
                                        <div class="barcode-display">
                                            <div class="barcode-bars">
                                                <span v-for="(_, bi) in 20" :key="bi" :style="{ display: 'inline-block', width: bi % 2 === 0 ? '3px' : '1px', height: '100%', background: '#000' }"></span>
                                            </div>
                                            <span style="font-family:'Courier New';font-size:11px;text-align:center;display:block">{{ (el as any).value || '1234567890' }}</span>
                                        </div>
                                    </template>
                                    <template v-else-if="el.type === 'qrcode'">
                                        <svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#fff"/><rect x="0" y="0" width="30" height="30" fill="#000"/><rect x="70" y="0" width="30" height="30" fill="#000"/><rect x="0" y="70" width="30" height="30" fill="#000"/><rect x="30" y="30" width="10" height="10" fill="#000"/><rect x="45" y="45" width="10" height="10" fill="#000"/></svg>
                                    </template>
                                    <template v-else-if="el.type === 'checkbox'">
                                        <div style="display:flex;align-items:center;gap:4px"><div style="width:14px;height:14px;border:1px solid #333;display:flex;align-items:center;justify-content:center">{{ (el as any).checked ? '✓' : '' }}</div><span v-if="(el as any).label">{{ (el as any).label }}</span></div>
                                    </template>
                                    <template v-else-if="el.type === 'pageBreak'">
                                        <div class="pagebreak-line">
                                            <span>--- {{ getTypeLabel(el) }} ---</span>
                                        </div>
                                    </template>
                                </div>
                                <!-- 类型标签（选中时显示） -->
                                <div v-if="selectedElementIds.includes(el.id)" class="element-type-tag">
                                    {{ getTypeLabel(el) }}
                                </div>
                            </template>
                            <!-- Resize 手柄 -->
                            <template v-if="selectedElementIds.includes(el.id) && !readonly && editingId !== el.id">
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
                        <!-- 框选矩形 -->
                        <div v-if="boxSelect" class="box-select-rect" :style="boxSelectStyle" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 右键菜单 -->
        <div v-if="contextMenu.visible" class="context-menu" :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }">
            <template v-for="(item, idx) in contextMenu.items" :key="idx">
                <div v-if="item.divider" class="ctx-divider" />
                <div v-else class="ctx-item" :class="{ disabled: item.disabled }" @click="!item.disabled && handleContextAction(item.key)">
                    <ShSvgIcon :name="item.icon" size="14px" />
                    <span class="ctx-label">{{ item.label }}</span>
                </div>
            </template>
        </div>
        <div class="scale-tip">{{ i18n("pdf.canvas.scale") }}: {{ Math.round(scale * 100) }}%</div>
    </div>
</template>

<style lang="scss" scoped>
.pdf-canvas {
    width: 100%; height: 100%; overflow: hidden; background: var(--el-bg-color-page);
    display: flex; flex-wrap: wrap; position: relative;

    .ruler-corner {
        background: var(--el-bg-color);
        border-right: 1px solid var(--el-border-color-lighter);
        border-bottom: 1px solid var(--el-border-color-lighter);
        z-index: 10; flex-shrink: 0;
    }
    .ruler-h {
        position: absolute; top: 0; right: 0;
        background: var(--el-bg-color);
        border-bottom: 1px solid var(--el-border-color-lighter);
        z-index: 10; overflow: hidden;
    }
    .ruler-v {
        position: absolute; left: 0; bottom: 0;
        background: var(--el-bg-color);
        border-right: 1px solid var(--el-border-color-lighter);
        z-index: 10; overflow: hidden;
    }
    .ruler-svg-h, .ruler-svg-v { display: block; }

    .canvas-scroll {
        flex: 1; overflow: auto; padding: 16px; display: flex; justify-content: center; align-items: flex-start;
    }
    .pdf-page {
        position: relative; background: #FFFFFF; box-shadow: 0 2px 12px rgba(0,0,0,0.1); flex-shrink: 0;

        .margin-overlay {
            position: absolute;
            border: 1px dashed rgba(64, 158, 255, 0.3);
            box-shadow: inset 0 0 0 9999px rgba(0, 0, 0, 0.015);
        }

        .elements-layer {
            .element-wrapper {
                cursor: move; outline: 1px solid transparent; box-sizing: border-box;
                &:hover { outline: 1px dashed var(--el-color-primary); }
                &.selected { outline: 2px solid var(--el-color-primary); }
                &.editing { outline: 2px solid var(--el-color-success); }

                .element-content {
                    pointer-events: none; word-break: break-all; white-space: pre-wrap;
                    .placeholder {
                        display: flex; flex-direction: column; align-items: center; justify-content: center;
                        width: 100%; height: 100%; color: var(--el-text-color-secondary);
                        font-size: 12px; border: 1px dashed var(--el-border-color); border-radius: 2px;
                        gap: 4px;
                    }
                    .barcode-display {
                        width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;
                        .barcode-bars { display: flex; height: 60%; width: 100%; }
                    }
                    .pagebreak-line {
                        width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
                        color: var(--el-text-color-placeholder); font-size: 11px;
                        border-top: 1px dashed var(--el-border-color);
                    }
                }

                .element-edit {
                    width: 100%; height: 100%;
                    outline: none; word-break: break-all; white-space: pre-wrap;
                    cursor: text; background: rgba(255, 255, 255, 0.9);
                    border: 1px solid var(--el-color-success);
                    box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.2);
                    border-radius: 2px;
                }

                .element-type-tag {
                    position: absolute; top: -18px; left: 0;
                    background: var(--el-color-primary); color: #fff;
                    font-size: 10px; padding: 1px 6px; border-radius: 2px 2px 0 0;
                    white-space: nowrap; pointer-events: none;
                }
            }
        }
    }
    .guide-line { position: absolute; pointer-events: none; z-index: 9999;
        &.horizontal { left: 0; right: 0; height: 1px; background: rgba(64,158,255,0.6); }
        &.vertical { top: 0; bottom: 0; width: 1px; background: rgba(64,158,255,0.6); }
    }
    .resize-handle {
        position: absolute; width: 8px; height: 8px; background: var(--el-color-primary);
        border: 1px solid #fff; border-radius: 50%; z-index: 10;
        &.top-left { top: -4px; left: -4px; cursor: nwse-resize; }
        &.top-right { top: -4px; right: -4px; cursor: nesw-resize; }
        &.bottom-left { bottom: -4px; left: -4px; cursor: nesw-resize; }
        &.bottom-right { bottom: -4px; right: -4px; cursor: nwse-resize; }
        &.top-center { top: -4px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
        &.bottom-center { bottom: -4px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
        &.middle-left { top: 50%; left: -4px; transform: translateY(-50%); cursor: ew-resize; }
        &.middle-right { top: 50%; right: -4px; transform: translateY(-50%); cursor: ew-resize; }
    }
    .box-select-rect {
        position: absolute; border: 1px dashed var(--el-color-primary);
        background: rgba(64,158,255,0.08); pointer-events: none; z-index: 9998;
    }
    .context-menu {
        position: fixed; z-index: 10000; background: var(--el-bg-color-overlay);
        border: 1px solid var(--el-border-color-lighter); border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12); padding: 4px 0; min-width: 160px;
        .ctx-item {
            display: flex; align-items: center; gap: 8px; padding: 6px 12px;
            cursor: pointer; font-size: 13px; color: var(--el-text-color-regular); transition: background 0.15s;
            &:hover { background: var(--el-fill-color-light); }
            &.disabled { opacity: 0.4; cursor: not-allowed; }
            .ctx-label { flex: 1; }
        }
        .ctx-divider { height: 1px; margin: 4px 8px; background: var(--el-border-color-lighter); }
    }
    .scale-tip {
        position: absolute; bottom: 8px; right: 16px; background: var(--el-bg-color);
        padding: 4px 8px; border-radius: 4px; font-size: 12px; color: var(--el-text-color-secondary);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
}
</style>
