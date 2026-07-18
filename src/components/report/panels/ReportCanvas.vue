<script setup lang="ts" name="ReportCanvas">
/**
 * 报表设计器 - 中央画布（电子表格网格）
 * 职责：渲染行列网格、单元格选中、行列调整、双击编辑
 */
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import { colToLetter, toAddress } from "../CellUtils";
import type { UseReportDesignerReturn } from "../composables/useReportDesigner";

const props = defineProps<{
    designer: UseReportDesignerReturn;
}>();

const template = computed(() => props.designer.state.template);
const selectedAddresses = computed(() => props.designer.state.selectedAddresses);
const editingAddress = computed(() => props.designer.state.editingAddress);
const showFormula = computed(() => props.designer.state.showFormula);

const cellStyle = (addr: string): Record<string, any> => {
    const cell = template.value.cells[addr];
    if (!cell?.style) return {};
    const s = cell.style;
    const style: Record<string, any> = {};
    if (s.fontFamily) style.fontFamily = s.fontFamily;
    if (s.fontSize) style.fontSize = s.fontSize + "pt";
    if (s.fontWeight) style.fontWeight = s.fontWeight;
    if (s.fontStyle) style.fontStyle = s.fontStyle;
    if (s.color) style.color = s.color;
    if (s.backgroundColor) style.backgroundColor = s.backgroundColor;
    if (s.textAlign) style.textAlign = s.textAlign;
    if (s.verticalAlign) style.verticalAlign = s.verticalAlign;
    if (s.border && s.border !== "none") {
        const bs = `${s.borderWidth || 1}px solid ${s.borderColor || "#000"}`;
        if (s.border === "all") style.border = bs;
        else style[`border-${s.border}`] = bs;
    }
    return style;
};

const cellDisplay = (addr: string): string => {
    const cell = template.value.cells[addr];
    if (!cell) return "";
    if (showFormula.value && cell.formula) return cell.formula.expression;
    return cell.value ?? "";
};

const isSelected = (addr: string): boolean => selectedAddresses.value.includes(addr);

const handleCellClick = (e: MouseEvent, addr: string) => {
    if (e.shiftKey && selectedAddresses.value.length) {
        const last = selectedAddresses.value[selectedAddresses.value.length - 1];
        props.designer.selectRange(last, addr);
    } else {
        props.designer.selectCell(addr, e.ctrlKey || e.metaKey);
    }
};

const handleCellDoubleClick = (addr: string) => {
    if (props.designer.state.readonly) return;
    props.designer.state.editingAddress = addr;
};

const handleInput = (e: Event, addr: string) => {
    const val = (e.target as HTMLInputElement).value;
    props.designer.setCellValue(addr, val);
};

const handleBlur = () => {
    props.designer.state.editingAddress = null;
    props.designer.pushHistory();
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedAddresses.value.length) return;
    const current = selectedAddresses.value[selectedAddresses.value.length - 1];
    const match = current.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) return;
    const col = match[1];
    const row = parseInt(match[2], 10);
    let target = "";
    switch (e.key) {
        case "ArrowUp":
            if (row > 1) target = `${col}${row - 1}`;
            break;
        case "ArrowDown":
            if (row < template.value.rowCount) target = `${col}${row + 1}`;
            break;
        case "ArrowLeft": {
            const colNum = col.charCodeAt(0) - 64;
            if (colNum > 1) target = `${colToLetter(colNum - 1)}${row}`;
            break;
        }
        case "ArrowRight": {
            const colNum = col.charCodeAt(0) - 64;
            if (colNum < template.value.colCount) target = `${colToLetter(colNum + 1)}${row}`;
            break;
        }
        case "Delete":
        case "Backspace":
            props.designer.deleteCells();
            e.preventDefault();
            return;
        default:
            return;
    }
    if (target) {
        props.designer.selectCell(target);
        e.preventDefault();
    }
};

// 拖选状态
const dragStart = ref<string | null>(null);
const dragEnd = ref<string | null>(null);

const handleMouseDown = (e: MouseEvent, addr: string) => {
    if (e.button !== 0) return;
    dragStart.value = addr;
    dragEnd.value = addr;
    props.designer.selectCell(addr);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
};

const onMouseMove = (e: MouseEvent) => {
    if (!dragStart.value) return;
    const target = (e.target as HTMLElement)?.closest("td")?.getAttribute("data-addr");
    if (target && target !== dragEnd.value) {
        dragEnd.value = target;
        props.designer.selectRange(dragStart.value, target);
    }
};

const onMouseUp = () => {
    dragStart.value = null;
    dragEnd.value = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
};

// 行列调整
const resizing = ref<{ type: "row" | "col"; index: number; startPos: number; startSize: number } | null>(null);

const startResize = (e: MouseEvent, type: "row" | "col", index: number, currentSize: number) => {
    e.stopPropagation();
    resizing.value = {
        type,
        index,
        startPos: type === "row" ? e.clientY : e.clientX,
        startSize: currentSize,
    };
    window.addEventListener("mousemove", onResizeMove);
    window.addEventListener("mouseup", onResizeUp);
};

const onResizeMove = (e: MouseEvent) => {
    if (!resizing.value) return;
    const delta = (resizing.value.type === "row" ? e.clientY : e.clientX) - resizing.value.startPos;
    const newSize = Math.max(15, resizing.value.startSize + delta);
    if (resizing.value.type === "row") {
        props.designer.setRowHeight(resizing.value.index, newSize);
    } else {
        props.designer.setColWidth(resizing.value.index, newSize);
    }
};

const onResizeUp = () => {
    resizing.value = null;
    window.removeEventListener("mousemove", onResizeMove);
    window.removeEventListener("mouseup", onResizeUp);
};

// 行列右键菜单
const contextMenu = ref<{ visible: boolean; x: number; y: number; type: "row" | "col" | "cell"; index: number; addr: string }>({
    visible: false,
    x: 0,
    y: 0,
    type: "cell",
    index: 0,
    addr: "",
});

const handleContextMenu = (e: MouseEvent, type: "row" | "col" | "cell", index: number, addr: string = "") => {
    e.preventDefault();
    contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, type, index, addr };
};

const closeContextMenu = () => {
    contextMenu.value.visible = false;
};

const handleInsertRow = () => {
    props.designer.insertRow(contextMenu.value.index);
    closeContextMenu();
};
const handleInsertCol = () => {
    props.designer.insertCol(contextMenu.value.index);
    closeContextMenu();
};
const handleDeleteRow = () => {
    props.designer.deleteRow(contextMenu.value.index);
    closeContextMenu();
};
const handleDeleteCol = () => {
    props.designer.deleteCol(contextMenu.value.index);
    closeContextMenu();
};

// 行列表头
const colHeaders = computed(() =>
    Array.from({ length: template.value.colCount }, (_, i) => colToLetter(i + 1)),
);
const rowHeaders = computed(() =>
    Array.from({ length: template.value.rowCount }, (_, i) => i + 1),
);
</script>

<template>
    <div class="report-canvas-wrapper" @click="closeContextMenu" tabindex="0" @keydown="handleKeyDown">
        <div class="report-canvas" @click.self="designer.clearSelection()">
            <table class="report-grid">
                <colgroup>
                    <col style="width: 36px"/>
                    <col
                        v-for="c in template.columns"
                        :key="c.index"
                        :style="{ width: c.width + 'px' }"
                    />
                </colgroup>
                <thead>
                    <tr>
                        <th class="corner"></th>
                        <th
                            v-for="ch in colHeaders"
                            :key="ch"
                            class="col-header"
                            @contextmenu="handleContextMenu($event, 'col', colHeaders.indexOf(ch) + 1)"
                        >
                            {{ ch }}
                            <div
                                class="resize-handle resize-col"
                                @mousedown="startResize($event, 'col', colHeaders.indexOf(ch) + 1, template.columns[colHeaders.indexOf(ch)].width)"
                            ></div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in rowHeaders" :key="r">
                        <th
                            class="row-header"
                            @contextmenu="handleContextMenu($event, 'row', r)"
                        >
                            {{ r }}
                            <div
                                class="resize-handle resize-row"
                                @mousedown="startResize($event, 'row', r, template.rows[r-1].height)"
                            ></div>
                        </th>
                        <td
                            v-for="c in colHeaders"
                            :key="c + r"
                            :data-addr="c + r"
                            class="report-cell"
                            :class="{ selected: isSelected(c + r) }"
                            :style="cellStyle(c + r)"
                            @click="handleCellClick($event, c + r)"
                            @dblclick="handleCellDoubleClick(c + r)"
                            @mousedown="handleMouseDown($event, c + r)"
                            @contextmenu="handleContextMenu($event, 'cell', r, c + r)"
                        >
                            <input
                                v-if="editingAddress === c + r"
                                :value="cellDisplay(c + r)"
                                @input="handleInput($event, c + r)"
                                @blur="handleBlur"
                                @keydown.enter="handleBlur"
                                class="cell-input"
                                ref="inputRef"
                                autofocus
                            />
                            <span v-else class="cell-text">{{ cellDisplay(c + r) }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 右键菜单 -->
        <div
            v-if="contextMenu.visible"
            class="context-menu"
            :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
        >
            <template v-if="contextMenu.type === 'row'">
                <div class="menu-item" @click="handleInsertRow">{{ i18n('report.canvas.insertRow') }}</div>
                <div class="menu-item" @click="handleDeleteRow">{{ i18n('report.canvas.deleteRow') }}</div>
            </template>
            <template v-else-if="contextMenu.type === 'col'">
                <div class="menu-item" @click="handleInsertCol">{{ i18n('report.canvas.insertCol') }}</div>
                <div class="menu-item" @click="handleDeleteCol">{{ i18n('report.canvas.deleteCol') }}</div>
            </template>
            <template v-else>
                <div class="menu-item" @click="designer.copyCells()">{{ i18n('report.toolbar.copy') }}</div>
                <div class="menu-item" @click="designer.deleteCells()">{{ i18n('report.toolbar.delete') }}</div>
                <div class="menu-divider"></div>
                <div class="menu-item" @click="designer.mergeCells()">{{ i18n('report.toolbar.merge') }}</div>
                <div class="menu-item" @click="designer.unmergeCells()">{{ i18n('report.toolbar.unmerge') }}</div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.report-canvas-wrapper {
    flex: 1;
    overflow: auto;
    background: #FFFFFF;
    position: relative;
    outline: none;

    .report-canvas {
        display: inline-block;
        min-width: 100%;
    }
}

.report-grid {
    border-collapse: collapse;
    table-layout: fixed;
    font-family: 'Microsoft YaHei', sans-serif;
    font-size: 11pt;

    .corner {
        width: 36px;
        height: 24px;
        background: #F5F5F5;
        border: 1px solid #DDD;
        position: sticky;
        top: 0;
        left: 0;
        z-index: 2;
    }

    .col-header {
        min-width: 60px;
        height: 24px;
        background: #F5F5F5;
        border: 1px solid #DDD;
        text-align: center;
        font-weight: normal;
        color: #666;
        position: sticky;
        top: 0;
        z-index: 1;
        position: relative;
    }

    .row-header {
        width: 36px;
        background: #F5F5F5;
        border: 1px solid #DDD;
        text-align: center;
        font-weight: normal;
        color: #666;
        position: sticky;
        left: 0;
        z-index: 1;
        position: relative;
    }

    .report-cell {
        border: 1px solid #E0E0E0;
        padding: 2px 4px;
        height: 28px;
        cursor: cell;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;

        &:hover {
            background: rgba(64, 158, 255, 0.05);
        }

        &.selected {
            background: rgba(64, 158, 255, 0.15);
            outline: 2px solid var(--el-color-primary);
            outline-offset: -2px;
        }

        .cell-text {
            display: block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .cell-input {
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            padding: 0;
            background: transparent;
            font: inherit;
            color: inherit;
        }
    }

    .resize-handle {
        position: absolute;
        background: transparent;

        &.resize-col {
            right: -2px;
            top: 0;
            bottom: 0;
            width: 4px;
            cursor: col-resize;

            &:hover {
                background: var(--el-color-primary);
            }
        }

        &.resize-row {
            bottom: -2px;
            left: 0;
            right: 0;
            height: 4px;
            cursor: row-resize;

            &:hover {
                background: var(--el-color-primary);
            }
        }
    }
}

.context-menu {
    position: fixed;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    min-width: 120px;
    padding: 4px 0;

    .menu-item {
        padding: 6px 16px;
        cursor: pointer;
        font-size: 13px;

        &:hover {
            background: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
        }
    }

    .menu-divider {
        height: 1px;
        background: var(--el-border-color-lighter);
        margin: 4px 0;
    }
}
</style>
