<script setup lang="ts" name="ExcelEditor">
import {computed, onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {i18n} from "@/lang";
import {ShSvgIcon} from "@/components/shared";
import {
  OFFICE_EXCEL_COL_WIDTH,
  OFFICE_EXCEL_MAX_COLS,
  OFFICE_EXCEL_MAX_ROWS,
  officeColIndexToLetter,
} from "../constants";
import {recalcSheet} from "../utils/OfficeFormulaUtils";
import type {ExcelCell, ExcelContent, ExcelSheet} from "../types";

const props = defineProps<{
  content: ExcelContent;
}>();

const emit = defineEmits<{
  (e: "update", content: ExcelContent): void;
}>();

/** 当前活动工作表 */
const activeSheet = computed<ExcelSheet | null>(() => {
  const id = props.content.activeSheetId;
  if (id) {
    const s = props.content.sheets.find((x) => x.id === id);
    if (s) return s;
  }
  return props.content.sheets[0] ?? null;
});

/** 选中的单元格（行,列） */
const selectedCell = ref<{ row: number; col: number } | null>(null);
/** 选区（合并场景） */
const rangeStart = ref<{ row: number; col: number } | null>(null);
const rangeEnd = ref<{ row: number; col: number } | null>(null);

/** 查找单元格 */
const findCell = (sheet: ExcelSheet, row: number, col: number): ExcelCell | undefined =>
    sheet.cells.find((c) => c.row === row && c.col === col);

/** 选区范围 */
const selectionRange = computed(() => {
  if (!selectedCell.value) return null;
  if (!rangeStart.value || !rangeEnd.value) {
    return {
      rMin: selectedCell.value.row,
      rMax: selectedCell.value.row,
      cMin: selectedCell.value.col,
      cMax: selectedCell.value.col
    };
  }
  return {
    rMin: Math.min(rangeStart.value.row, rangeEnd.value.row),
    rMax: Math.max(rangeStart.value.row, rangeEnd.value.row),
    cMin: Math.min(rangeStart.value.col, rangeEnd.value.col),
    cMax: Math.max(rangeStart.value.col, rangeEnd.value.col),
  };
});

/** 是否在选区内 */
const inSelection = (row: number, col: number): boolean => {
  const r = selectionRange.value;
  if (!r) return false;
  return row >= r.rMin && row <= r.rMax && col >= r.cMin && col <= r.cMax;
};

/** 单元格显示值 */
const displayValue = (sheet: ExcelSheet, row: number, col: number): string => {
  const c = findCell(sheet, row, col);
  if (!c) return "";
  if (c.isFormula) return c.display ?? "";
  return c.value;
};

/** 同步状态到父组件（深拷贝触发响应） */
const syncToParent = (sheet: ExcelSheet) => {
  const newContent: ExcelContent = {
    sheets: props.content.sheets.map((s) => (s.id === sheet.id ? {...s, cells: recalcSheet(s.cells)} : s)),
    activeSheetId: props.content.activeSheetId,
  };
  emit("update", newContent);
};

/** 设置单元格值 */
const setCellValue = (sheet: ExcelSheet, row: number, col: number, value: string) => {
  let c = findCell(sheet, row, col);
  if (!c) {
    c = {row, col, value};
    sheet.cells.push(c);
  } else {
    c.value = value;
  }
  c.isFormula = value.startsWith("=");
  syncToParent(sheet);
};

/** 选中单元格 */
const handleSelectCell = (row: number, col: number, e: MouseEvent) => {
  selectedCell.value = {row, col};
  if (e.shiftKey) {
    rangeEnd.value = {row, col};
  } else {
    rangeStart.value = {row, col};
    rangeEnd.value = {row, col};
  }
};

/** 单元格失焦提交 */
const handleCellBlur = (sheet: ExcelSheet, row: number, col: number, e: Event) => {
  const td = e.target as HTMLElement;
  const value = td.innerText ?? "";
  setCellValue(sheet, row, col, value);
};

/** 添加行 */
const addRow = () => {
  if (!activeSheet.value) return;
  const sheet = activeSheet.value;
  if (sheet.rows >= OFFICE_EXCEL_MAX_ROWS) return;
  sheet.rows += 1;
  syncToParent(sheet);
};

/** 添加列 */
const addColumn = () => {
  if (!activeSheet.value) return;
  const sheet = activeSheet.value;
  if (sheet.cols >= OFFICE_EXCEL_MAX_COLS) return;
  sheet.cols += 1;
  syncToParent(sheet);
};

/** 删除行 */
const removeRow = () => {
  if (!activeSheet.value || !selectedCell.value) {
    ElMessage.warning(i18n("office.excel.noSelection"));
    return;
  }
  const sheet = activeSheet.value;
  if (sheet.rows <= 1) return;
  const r = selectedCell.value.row;
  // 移除该行单元格，并将下方单元格 row-1
  sheet.cells = sheet.cells
      .filter((c) => c.row !== r)
      .map((c) => (c.row > r ? {...c, row: c.row - 1} : c));
  sheet.rows -= 1;
  selectedCell.value = null;
  rangeStart.value = null;
  rangeEnd.value = null;
  syncToParent(sheet);
};

/** 删除列 */
const removeColumn = () => {
  if (!activeSheet.value || !selectedCell.value) {
    ElMessage.warning(i18n("office.excel.noSelection"));
    return;
  }
  const sheet = activeSheet.value;
  if (sheet.cols <= 1) return;
  const c = selectedCell.value.col;
  sheet.cells = sheet.cells
      .filter((cell) => cell.col !== c)
      .map((cell) => (cell.col > c ? {...cell, col: cell.col - 1} : cell));
  sheet.cols -= 1;
  selectedCell.value = null;
  rangeStart.value = null;
  rangeEnd.value = null;
  syncToParent(sheet);
};

/** 合并单元格 */
const mergeCells = () => {
  if (!activeSheet.value || !selectionRange.value) {
    ElMessage.warning(i18n("office.excel.selectRange"));
    return;
  }
  const sheet = activeSheet.value;
  const r = selectionRange.value;
  const rowspan = r.rMax - r.rMin + 1;
  const colspan = r.cMax - r.cMin + 1;
  if (rowspan <= 1 && colspan <= 1) {
    ElMessage.warning(i18n("office.excel.cannotMerge"));
    return;
  }
  // 左上角单元格设置 colspan/rowspan，其他单元格标记 covered
  const tl = findCell(sheet, r.rMin, r.cMin) ?? {row: r.rMin, col: r.cMin, value: ""};
  tl.rowspan = rowspan;
  tl.colspan = colspan;
  if (!sheet.cells.includes(tl)) sheet.cells.push(tl);
  for (let row = r.rMin; row <= r.rMax; row++) {
    for (let col = r.cMin; col <= r.cMax; col++) {
      if (row === r.rMin && col === r.cMin) continue;
      let c = findCell(sheet, row, col);
      if (!c) {
        c = {row, col, value: ""};
        sheet.cells.push(c);
      }
      c.covered = true;
      c.rowspan = undefined;
      c.colspan = undefined;
    }
  }
  syncToParent(sheet);
};

/** 拆分单元格 */
const splitCells = () => {
  if (!activeSheet.value || !selectedCell.value) return;
  const sheet = activeSheet.value;
  const r = selectedCell.value.row;
  const c = selectedCell.value.col;
  const cell = findCell(sheet, r, c);
  if (!cell || (!cell.rowspan && !cell.colspan)) return;
  const rowspan = cell.rowspan ?? 1;
  const colspan = cell.colspan ?? 1;
  cell.rowspan = undefined;
  cell.colspan = undefined;
  for (let i = r; i < r + rowspan; i++) {
    for (let j = c; j < c + colspan; j++) {
      if (i === r && j === c) continue;
      const sub = findCell(sheet, i, j);
      if (sub) sub.covered = false;
    }
  }
  syncToParent(sheet);
};

/** 行号 */
const rowNumbers = computed(() => {
  if (!activeSheet.value) return [];
  return Array.from({length: activeSheet.value.rows}, (_, i) => i);
});
/** 列号 */
const colHeaders = computed(() => {
  if (!activeSheet.value) return [];
  return Array.from({length: activeSheet.value.cols}, (_, i) => i);
});

/** 挂载时重新计算公式（依赖 :key 切换文档时重新挂载） */
onMounted(() => {
  if (activeSheet.value) {
    activeSheet.value.cells = recalcSheet(activeSheet.value.cells);
  }
});
</script>

<template>
  <div class="excel-editor">
    <div class="excel-toolbar">
      <el-tooltip :content="i18n('office.excel.addRow')" :show-after="500">
        <el-button @click="addRow">
          <ShSvgIcon name="addRow" size="14px"/>
          {{ i18n("office.excel.addRow") }}
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('office.excel.addColumn')" :show-after="500">
        <el-button @click="addColumn">
          <ShSvgIcon name="addColumn" size="14px"/>
          {{ i18n("office.excel.addColumn") }}
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('office.excel.removeRow')" :show-after="500">
        <el-button type="danger" @click="removeRow">
          <ShSvgIcon name="removeRow" size="14px"/>
          {{ i18n("office.excel.removeRow") }}
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('office.excel.removeColumn')" :show-after="500">
        <el-button type="danger" @click="removeColumn">
          <ShSvgIcon name="removeColumn" size="14px"/>
          {{ i18n("office.excel.removeColumn") }}
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('office.excel.mergeCells')" :show-after="500">
        <el-button type="primary" @click="mergeCells">
          <ShSvgIcon name="cellMerge" size="14px"/>
          {{ i18n("office.excel.mergeCells") }}
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('office.excel.splitCells')" :show-after="500">
        <el-button @click="splitCells">
          <ShSvgIcon name="cellSplit" size="14px"/>
          {{ i18n("office.excel.splitCells") }}
        </el-button>
      </el-tooltip>
      <span v-if="selectedCell" class="cell-ref">
                {{ officeColIndexToLetter(selectedCell.col) }}{{ selectedCell.row + 1 }}
            </span>
    </div>
    <div class="excel-body">
      <table v-if="activeSheet" class="excel-table">
        <thead>
        <tr>
          <th class="corner"></th>
          <th v-for="col in colHeaders" :key="col" class="col-header">
            {{ officeColIndexToLetter(col) }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in rowNumbers" :key="row">
          <th class="row-header">{{ row + 1 }}</th>
          <td
              v-for="col in colHeaders"
              :key="col"
              class="cell"
              :class="{ selected: inSelection(row, col) }"
              :style="{ width: `${OFFICE_EXCEL_COL_WIDTH}px`, minWidth: `${OFFICE_EXCEL_COL_WIDTH}px` }"
              v-show="!findCell(activeSheet, row, col)?.covered"
              :colspan="findCell(activeSheet, row, col)?.colspan"
              :rowspan="findCell(activeSheet, row, col)?.rowspan"
              @mousedown="handleSelectCell(row, col, $event)"
          >
            <div
                class="cell-content"
                contenteditable="true"
                @blur="handleCellBlur(activeSheet, row, col, $event)"
                v-text="displayValue(activeSheet, row, col)"
            ></div>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-else class="empty">{{ i18n("office.docList.empty") }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {name: "ExcelEditor"};
</script>

<style lang="scss" scoped>
.excel-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;

  .excel-toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    background: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-wrap: wrap;

    .cell-ref {
      margin-left: auto;
      font-family: "Courier New", monospace;
      font-weight: 600;
      color: var(--el-color-primary);
    }
  }

  .excel-body {
    flex: 1;
    overflow: auto;
    padding: 8px;

    .excel-table {
      border-collapse: collapse;
      table-layout: fixed;

      th.corner {
        width: 40px;
        min-width: 40px;
      }

      th.col-header,
      th.row-header {
        background: var(--el-fill-color);
        border: 1px solid var(--el-border-color-lighter);
        padding: 4px;
        font-size: 12px;
        font-weight: 600;
        color: var(--el-text-color-secondary);
        text-align: center;
        height: 28px;
      }

      td.cell {
        border: 1px solid var(--el-border-color-lighter);
        padding: 0;
        position: relative;
        height: 28px;
        background: #fff;
        cursor: cell;

        &.selected {
          border: 2px solid var(--el-color-primary);
          z-index: 2;
        }

        .cell-content {
          width: 100%;
          height: 100%;
          padding: 2px 6px;
          outline: none;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          &:focus {
            background: #fffce0;
            outline: 1px solid var(--el-color-primary);
          }
        }
      }
    }

    .empty {
      text-align: center;
      color: var(--el-text-color-placeholder);
      padding: 24px;
    }
  }
}
</style>
