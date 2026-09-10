<script setup lang="ts">
import {checkVisible, labelVisibleCheck, loadProp, validMsg,} from "@/api/form_utils";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {computed, ModelRef, onMounted, ref} from "vue";
import StarHorseItem from "@/components/comp/StarHorseItem.vue";

const props = withDefaults(defineProps<ContainerPreps>(), {
  dataIndex: -1,
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  subTableName: "subDataList",
  compSize: "default",
  source: 1,
});
const dataForm: ModelRef<any> = defineModel("dataForm");
const gridtableData = computed(() => {
  const item: any = props.item;
  return item?.containerType == "gridtable"
      ? item?.containerFields?.[0]?.fieldList
      : [];
});
const rowHeight = computed(() => {
  if (props.compSize == "large") {
    return "45px";
  } else if (props.compSize == "small") {
    return "35px";
  } else {
    return "40px";
  }
});
const totalCols = computed(() => {
  if (!gridtableData.value?.length) return 1;
  return gridtableData.value[0]?.length || 1;
});
const hasCustomWidth = computed(() => {
  if (!gridtableData.value?.length) return false;
  const firstRow = gridtableData.value[0];
  return firstRow?.some((c: any) => checkItem(c)?.preps?.colWidth);
});
const gridTemplateColumns = computed(() => {
  if (hasCustomWidth.value) {
    if (!gridtableData.value?.length) return "";
    const firstRow = gridtableData.value[0];
    const parts: string[] = [];
    for (const col of firstRow) {
      parts.push(
          checkItem(col)?.preps?.colWidth || `calc(100% / ${totalCols.value})`,
      );
    }
    return parts.join(" ");
  }
  return `repeat(${totalCols.value}, 1fr)`;
});
const showLineNumber = computed(
    () => (props.item as any)?.preps?.showLineNumber ?? false,
);

const gridModel = computed(() => {
  const rows = gridtableData.value;
  if (!rows?.length) return [];
  const cols = totalCols.value;
  const occupied: boolean[][] = rows.map(() => new Array(cols).fill(false));
  const positions: number[][] = [];
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (!row) {
      positions.push([]);
      continue;
    }
    let colPos = 0;
    const rowPositions: number[] = [];
    for (let c = 0; c < row.length; c++) {
      const cell = checkItem(row[c]);
      const cs = cell?.preps?.colspan || 1;
      const rs = cell?.preps?.rowspan || 1;
      const isVisible = cell?.preps?.cellVisible !== false;
      if (!isVisible) {
        rowPositions.push(0);
        continue;
      }
      while (colPos < cols && occupied[r][colPos]) colPos++;
      rowPositions.push(colPos + 1);
      if (rs > 1) {
        for (let rr = r + 1; rr < Math.min(r + rs, rows.length); rr++) {
          for (let i = 0; i < cs && colPos + i < cols; i++) {
            occupied[rr][colPos + i] = true;
          }
        }
      }
      colPos += cs;
    }
    positions.push(rowPositions);
  }
  return positions;
});
const getGridPosition = (rowIndex: number, colIndex: number, cell: any) => {
  const colStart = gridModel.value[rowIndex]?.[colIndex] ?? 1;
  const colSpan = cell?.preps?.colspan || 1;
  const rowSpan = cell?.preps?.rowspan || 1;
  const offset = showLineNumber.value ? 1 : 0;
  return {
    gridColumn: `${colStart + offset} / span ${colSpan}`,
    gridRow: `${rowIndex + 1} / span ${rowSpan}`,
  };
};

const init = () => {
};
onMounted(() => {
  init();
});
const checkItem = (item: any) => {
  if (Array.isArray(item)) {
    return item[0];
  }
  return item;
};
const createArray = (item: any) => {
  if (Array.isArray(item)) {
    return item;
  }
  return [item];
};

const resizingColIndex = ref(-1);
const startX = ref(0);
const startWidth = ref(0);
let resizeLine: HTMLElement | null = null;
const handleColResizeStart = (e: MouseEvent, index: number) => {
  e.preventDefault();
  resizingColIndex.value = index;
  startX.value = e.clientX;
  document.body.style.userSelect = "none";
  const colElement = (e.target as HTMLElement).parentElement as HTMLElement;
  startWidth.value = colElement.offsetWidth;
  resizeLine = document.createElement("div");
  const handleHalf = 3;
  resizeLine.style.cssText = `
    position: fixed;
    top: 0;
    left: ${e.clientX - handleHalf}px;
    width: 4px;
    height: 100vh;
    background: #409eff;
    z-index: 9999;
    pointer-events: none;
  `;
  document.body.appendChild(resizeLine);
  document.addEventListener("mousemove", handleColResizeMove);
  document.addEventListener("mouseup", handleColResizeEnd);
};
const handleColResizeMove = (e: MouseEvent) => {
  if (resizingColIndex.value === -1 || !resizeLine) return;
  const handleHalf = 3;
  resizeLine.style.left = `${e.clientX - handleHalf}px`;
  const delta = e.clientX - startX.value;
  const newWidth = Math.max(20, startWidth.value + delta);
  const newWidthStr = `${newWidth}px`;
  const row = gridtableData.value[0];
  const cell = row?.[resizingColIndex.value];
  if (!cell) return;
  const checked = checkItem(cell);
  if (!checked.preps) checked.preps = {};
  checked.preps.colWidth = newWidthStr;
};
const handleColResizeEnd = () => {
  resizingColIndex.value = -1;
  if (resizeLine) {
    document.body.removeChild(resizeLine);
    resizeLine = null;
  }
  document.body.style.userSelect = "";
  document.removeEventListener("mousemove", handleColResizeMove);
  document.removeEventListener("mouseup", handleColResizeEnd);
};

const item = computed(() => props.item as any);
const wrapperStyle = computed(() => {
  const baseWidth =
      item.value?.preps?.tableWidth ||
      (item.value?.preps?.styles?.width ?? "100%");
  const style: Record<string, any> = {
    height: item.value?.preps?.styles?.height ?? "100%",
    overflow: item.value?.preps?.styles?.overflow ?? "auto",
  };
  if (hasCustomWidth.value) {
    style["minWidth"] = baseWidth;
    style["width"] = "fit-content";
  } else {
    style["width"] = baseWidth;
  }
  return style;
});
</script>

<template>
  <template v-if="gridtableData.length > 0">
    <div class="gridtable-wrapper" :style="wrapperStyle">
      <div
          v-if="showLineNumber && gridtableData.length > 0"
          class="gridtable-header"
          :style="{ gridTemplateColumns: `30px ${gridTemplateColumns}` }"
      >
        <div class="gridtable-header-cell no-cell"></div>
        <div
            v-for="(col, index) in gridtableData[0]"
            :key="index"
            class="gridtable-header-cell no-cell col-resize-container"
            :style="{ width: checkItem(col)?.preps?.colWidth || '100%' }"
        >
          {{ Number(index) + 1 }}
          <div
              v-if="item.preps?.allowResize"
              class="col-resize-handle"
              @mousedown="(e) => handleColResizeStart(e, Number(index))"
          />
        </div>
      </div>
      <div
          class="gridtable-body"
          :style="{
          gridTemplateColumns: showLineNumber
            ? `30px ${gridTemplateColumns}`
            : gridTemplateColumns,
        }"
      >
        <template v-for="(row, rowIndex) in gridtableData" :key="rowIndex">
          <div
              v-if="showLineNumber"
              class="gridtable-line-number no-cell"
              :style="{ gridColumn: '1', gridRow: `${Number(rowIndex) + 1}` }"
          >
            {{ Number(rowIndex) + 1 }}
          </div>
          <template v-for="(sitem, colIndex) in row" :key="Number(colIndex) * Number(rowIndex)">
            <div
                v-if="checkItem(sitem)?.preps?.cellVisible"
                class="gridtable-cell"
                :style="{
                width: checkItem(sitem)?.preps?.colWidth || '100%',
                minHeight: checkItem(sitem)?.preps?.colHeight || rowHeight,
                ...getGridPosition(Number(rowIndex), Number(colIndex), checkItem(sitem)),
                'text-align': checkItem(sitem)?.preps?.textAlign ?? 'left',
                'word-break': !!checkItem(sitem)?.preps?.wordBreak
                  ? 'break-all'
                  : 'normal',
                'text-overflow': 'ellipsis',
                position: 'relative',
              }"
            >
              <div
                  class="h-full w-full flex-1 p-2 items-center justify-center flex flex-col"
                  v-if="sitem.staticData === true"
                  v-html="sitem.preps?.textContent"
              />
              <template v-else v-for="tempData in createArray(sitem)">
                <template
                    v-if="
                    tempData.type != 'button' &&
                    tempData.type != 'usercomp' &&
                    !tempData.preps?.staticData
                  "
                >
                  <el-form-item
                      :size="compSize"
                      :label="labelVisibleCheck(tempData)"
                      class="flex w-full flex-1 h-full"
                      :prop="loadProp(propPrefix, tempData.fieldName, -1, -1)"
                      :labelPosition="
                      tempData.preps?.labelPosition ??
                      parentPreps?.labelPosition
                    "
                      :rules="validMsg(tempData, dataForm)"
                      v-if="
                      (tempData.formVisible &&
                        tempData.label &&
                        tempData.preps?.headerFlag != 'Y') ||
                      checkVisible(tempData, dataForm)
                    "
                  >
                    <star-horse-item
                        :primaryKey="primaryKey"
                        :compSize="compSize"
                        v-model:dataForm="dataForm"
                        :item="tempData"
                        :dataIndex="dataIndex"
                        :source="source"
                    />
                  </el-form-item>
                  <star-horse-item
                      v-else-if="
                      tempData.viewVisible || checkVisible(tempData, dataForm)
                    "
                      :compSize="compSize"
                      :primaryKey="primaryKey"
                      v-model:dataForm="dataForm"
                      :item="tempData"
                      class="flex w-full flex-1"
                      :dataIndex="dataIndex"
                      :source="source"
                  />
                </template>
                <template v-else-if="tempData.fieldName">
                  <star-horse-item
                      :primaryKey="primaryKey"
                      :compSize="compSize"
                      v-model:dataForm="dataForm"
                      :item="tempData"
                      :dataIndex="dataIndex"
                      :source="source"
                  />
                </template>
              </template>
            </div>
          </template>
        </template>
      </div>
    </div>
  </template>
</template>

<style scoped lang="scss">
:deep(.el-form-item__content) {
  height: 100% !important;
}

.no-cell {
  border: 1px solid var(--star-horse-style);
}

.gridtable-wrapper {
  border: 1px solid var(--star-horse-style);
}

.gridtable-header {
  display: grid;
  border-bottom: 1px solid var(--star-horse-style);
}

.gridtable-header-cell {
  padding: 2px 4px;
  text-align: center;
  font-size: 12px;
  border-right: 1px solid var(--star-horse-style);
  position: relative;
  min-height: 20px;
}

.gridtable-body {
  display: grid;
}

.gridtable-line-number {
  padding: 2px 4px;
  text-align: center;
  font-size: 12px;
  border-right: 1px solid var(--star-horse-style);
  border-bottom: 1px solid var(--star-horse-style);
  display: flex;
  align-items: center;
  justify-content: center;
}

.gridtable-cell {
  border: 1px solid #ebeef5;
  min-height: 35px;
  padding: 1px;

  :deep(.el-form-item--default),
  :deep(.el-form-item--large),
  :deep(.el-form-item--small),
  :deep(.el-form-item) {
    margin-bottom: 0 !important;
  }

  :deep(.el-form-item__error) {
    top: 0 !important;
    transform: translateY(-10%);
  }
}

.col-resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -3px;
  width: 6px;
  cursor: col-resize;
  background: var(--star-horse-style);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1000;

  &:hover {
    opacity: 1;
  }
}

.col-resize-container {
  position: relative;
}

.col-resize-container:hover .col-resize-handle {
  opacity: 1;
}
</style>
