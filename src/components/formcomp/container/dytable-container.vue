<script setup lang="ts" name="dytable-container">
// 右键菜单组件
import {computed, PropType, ref} from "vue";
import DytableCol from "@/components/formcomp/container/dytable-col.vue";
import GroupContainer from "@/components/formcomp/container/group-container.vue";

let containerTableRef = ref(); // 强制刷新表格
const props = defineProps({
  parentField: {type: Object as PropType<any>},
  isDesign: {type: Boolean, default: false},
  showFormItem: {type: Boolean, default: false},
  disabled: {type: Boolean, default: false},
  formInfo: {type: Object as PropType<any>},
  field: {type: Object as PropType<any>},
});
const formData = defineModel("formData");

// 列宽调整相关状态
const resizingColIndex = ref(-1);
const startX = ref(0);
const startWidth = ref(0);

// 处理列宽调整开始
const handleColResizeStart = (e: MouseEvent, index: number) => {
  e.preventDefault();
  resizingColIndex.value = index;
  startX.value = e.clientX;
  const colElement = e.target.parentElement as HTMLElement;
  // console.log("colElement",e, colElement);
  startWidth.value = colElement.offsetWidth;

  document.addEventListener("mousemove", handleColResizeMove);
  document.addEventListener("mouseup", handleColResizeEnd);
};

// 处理列宽调整移动
const handleColResizeMove = (e: MouseEvent) => {
  if (resizingColIndex.value === -1) return;

  const delta = e.clientX - startX.value;
  const newWidth = Math.max(20, startWidth.value + delta);
  const newWidthStr = `${newWidth}px`;
  // console.log("resizingColIndex.value", resizingColIndex.value,newWidthStr);
  // 更新所有行中对应列的宽度
  const elements = props.field.preps.elements;
  elements?.forEach((row: any) => {
    if (row.columns && row.columns[resizingColIndex.value]) {
      row.columns[resizingColIndex.value].colWidth = newWidthStr;
      // console.log("resizingColIndex.value", resizingColIndex.value,newWidthStr,row.columns[resizingColIndex.value]);
    }
  });
};

// 处理列宽调整结束
const handleColResizeEnd = () => {
  resizingColIndex.value = -1;
  document.removeEventListener("mousemove", handleColResizeMove);
  document.removeEventListener("mouseup", handleColResizeEnd);
};

// 计算表格的列结构
const columnStructure = computed(() => {
  const elements: any = props.field.preps?.elements;
  if (!elements?.length) return [];
  // 找到最大列数的行
  let maxColsRow = elements[0];
  let columns = maxColsRow.columns.length;
  const colStructure =[];
  for (let i = 0; i < columns; i++) {
    colStructure.push({width: maxColsRow.columns[i].colWidth});
  }
  return colStructure;
});
/**
 * 动态计算列的索引
 * 计算当前列在原始表格布局中的真实索引（考虑跨行合并后的列位置）
 * @param rowIndex 当前行索引
 * @param colIndex 当前列在当前行中的索引
 * @param col 当前列的数据
 */
const getColIndex = (rowIndex: number, colIndex: number, col: any) => {
  const elements = props.field.preps.elements;

  if (rowIndex === 0) {
    return colIndex;
  }

  // 计算表格的总列数（考虑 colspan）
  let totalCols = 0;
  elements.forEach((row: any) => {
    if (row.columns) {
      let rowCols = 0;
      row.columns.forEach((c: any) => {
        rowCols += c.colspan || 1;
      });
      totalCols = Math.max(totalCols, rowCols);
    }
  });

  // 构建一个占用集合，记录哪些列位置被占用（使用 Set 去重）
  const occupied = new Set<number>();

  // 遍历前面所有行，找出占用的列位置
  for (let r = 0; r < rowIndex; r++) {
    const row = elements[r];
    if (!row.columns) continue;

    let colPos = 0;
    for (let c = 0; c < row.columns.length; c++) {
      const checkCol = row.columns[c];
      const colspan = checkCol.colspan || 1;
      const rowspan = checkCol.rowspan || 1;

      // 如果该单元格跨行且覆盖到当前行
      if (rowspan > 1 && r + rowspan > rowIndex) {
        // 标记该单元格占用的所有列位置
        for (let i = 0; i < colspan; i++) {
          occupied.add(colPos + i);
        }
      }

      colPos += colspan;
    }
  }

  // 现在需要重新构建当前行的完整列结构
  // 从第一行开始，模拟表格的完整布局
  const fullRowCols: boolean[] = new Array(totalCols).fill(false);

  // 标记被前面行跨行占用的位置
  for (let r = 0; r < rowIndex; r++) {
    const row = elements[r];
    if (!row.columns) continue;

    let colPos = 0;
    for (let c = 0; c < row.columns.length; c++) {
      const checkCol = row.columns[c];
      const colspan = checkCol.colspan || 1;
      const rowspan = checkCol.rowspan || 1;

      if (rowspan > 1 && r + rowspan > rowIndex) {
        for (let i = 0; i < colspan; i++) {
          fullRowCols[colPos + i] = true; // true 表示被占用
        }
      }

      colPos += colspan;
    }
  }

  // 现在找到第 colIndex 个未被占用的位置
  let currentColPosition = 0;
  for (let refColIdx = 0; refColIdx < totalCols; refColIdx++) {
    if (!fullRowCols[refColIdx]) {
      if (currentColPosition === colIndex) {
        // console.log('getColIndex:', {
        //   rowIndex,
        //   colIndex,
        //   totalCols,
        //   occupied: Array.from(occupied),
        //   fullRowCols,
        //   result: refColIdx
        // });
        return refColIdx;
      }
      currentColPosition++;
    }
  }

  // console.log('getColIndex fallback:', { rowIndex, colIndex, totalCols, occupied: Array.from(occupied) });
  return colIndex;
};
</script>
<template>
  <group-container
      class="star-horse-form-container"
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :parentField="parentField"
      :form-item="field"
  >
    <table ref="containerTableRef" class="dynamic-table">
      <!-- 隐藏的表头行，用于保持列结构和宽度 -->
      <thead v-if="field.preps.elements.length > 0">
      <tr class="hidden-header">
        <td
            v-for="(col, index) in columnStructure"
            :key="index"
            :colspan="col.colspan"
            :style="{
              width: col.width || '100%',
              height: '10px',
              padding: '0',
              border: '1px',
              background:'rgba(247,250,250,0.8)'
            }"
        >
          <div
              class="col-resize-handle"
              @mousedown="(e) => handleColResizeStart(e, index)"
          />
        </td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, rowIndex) in field.preps.elements" class="dy-tr">
        <template v-for="(td, colIndex) in row.columns">
          <dytable-col
              :field="td"
              v-if="td.cellVisible"
              :formInfo="formInfo"
              v-model:formData="formData"
              :isDesign="isDesign"
              :showFormItem="showFormItem"
              :disabled="disabled"
              :isFirstRow="rowIndex == 0"
              :parentField="field"
              :isLastRow="rowIndex == field.preps.elements.length - 1"
              :isFirstCol="colIndex == 0"
              :isLastCol="colIndex == row.columns.length - 1"
              :rowIndex="rowIndex"
              :colIndex="colIndex"
              :actionColIndex="getColIndex(rowIndex,colIndex,td)"
              class="dy-cell"
          />
        </template>
      </tr>
      </tbody>
    </table>
  </group-container>
</template>
<style lang="scss" scoped>
.dynamic-table {
  width: 100% !important;
  border-collapse: collapse;
}

.hidden-header {
  visibility: hidden;
  position: relative;
}

.hidden-header td {
  position: relative;
}

.col-resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -3px;
  width: 6px;
  cursor: col-resize;
  background: var(--star-horse-style);
  opacity: 0.5;
  transition: opacity 0.3s;
  z-index: 1000;
  visibility: visible;

  &:hover {
    opacity: 1;
  }
}

.hidden-header:hover .col-resize-handle {
  opacity: 0.5;
}
</style>
