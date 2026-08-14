<script setup lang="ts">
import {checkVisible, labelVisibleCheck, loadProp, validMsg,} from "@/api/form_utils";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {computed, ModelRef, onMounted, ref} from "vue";
import StarHorseItem from "@/components/comp/StarHorseItem.vue";
import {FieldInfo} from "@/components/types";

const props = withDefaults(defineProps<ContainerPreps>(), {
  // 数据索引
  dataIndex: -1,
  // 父节点名称
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  subTableName: "subDataList",

  compSize: "default",
  source: 1,
});
const dataForm: ModelRef<any> = defineModel("dataForm");
const dytableData = computed(() => {
  const item: any = props.item;
  return item?.containerType == "dytable" ? item?.containerFields?.[0]?.fieldList : [];
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
// 计算表格的列结构
const columnStructure = computed(() => {
  if (!dytableData.value?.length) return [];

  const rows = dytableData.value;
  // 找到最大列数的行
  let maxColsRow = rows[0];
  let columns = maxColsRow.length;
  const colStructure = [];
  for (let i = 0; i < columns; i++) {
    colStructure.push({
      width: checkItem(maxColsRow[i]).preps?.colWidth || "100%",
    });
  }
  return colStructure;
});

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

// 列宽调整相关状态
const resizingColIndex = ref(-1);
const startX = ref(0);
const startWidth = ref(0);
// 新增拖拽辅助线DOM
let resizeLine: HTMLElement | null = null;
// 处理列宽调整开始
const handleColResizeStart = (
    e: MouseEvent,
    row: FieldInfo[],
    index: number,
) => {
  e.preventDefault();
  const leftCols = row?.slice(0, index) ?? [];
  const hideCell =
      leftCols.filter((item) => !item.preps?.cellVisible)?.length || 0;
  resizingColIndex.value = row ? index - hideCell + 1 : index;
  startX.value = e.clientX;
  document.body.style.userSelect = "none";
  const colElement = (e.target as HTMLElement).parentElement as HTMLElement;
  // console.log("colElement",e, colElement);
  startWidth.value = colElement.offsetWidth;
  // 创建跟随鼠标的垂直线
  resizeLine = document.createElement("div");
  const handleHalf = 3; // 手柄宽度一半，用来居中
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

// 处理列宽调整移动
const handleColResizeMove = (e: MouseEvent) => {
  if (resizingColIndex.value === -1 || !resizeLine) return;
  const handleHalf = 3;
  // 线条跟随鼠标，居中对齐分割位置
  resizeLine.style.left = `${e.clientX - handleHalf}px`;
  const delta = e.clientX - startX.value;
  const newWidth = Math.max(20, startWidth.value + delta);
  const newWidthStr = `${newWidth}px`;
  // 更新所有行中对应列的宽度
  // props.item.dytableList?.forEach((row: any) => {
  const row = dytableData.value[0];
  const cell = row[resizingColIndex.value];
  if (!cell) return;
  if (!cell.preps) cell.preps = {};
  cell.preps.colWidth = newWidthStr;
  // });
};

// 处理列宽调整结束
const handleColResizeEnd = () => {
  resizingColIndex.value = -1;
  // 删除跟随线条
  if (resizeLine) {
    document.body.removeChild(resizeLine);
    resizeLine = null;
  }
  document.body.style.userSelect = "";
  document.removeEventListener("mousemove", handleColResizeMove);
  document.removeEventListener("mouseup", handleColResizeEnd);
};
</script>

<template>
  <template v-if="dytableData.length > 0">
    <table
        ref="containerTableRef"
        :style="{
        width: item.preps?.tableWidth || (item.preps?.styles?.width ?? '100%'),
        height: item.preps?.styles?.height ?? '100%',
        overflow: item.preps?.styles?.overflow ?? 'auto',
      }"
        :border="item.preps?.border ?? undefined"
        :cellpadding="item.preps?.cellpadding ?? undefined"
        :cellspacing="item.preps?.cellspacing ?? undefined"
        class="dynamic-table instance-table"
        :class="{ 'striped-table': item.preps?.striped }"
    >
      <!-- 隐藏的表头行，用于保持列结构和宽度 -->
      <thead v-if="dytableData.length > 0 && item.preps?.showHeader !== false">
      <tr v-if="item.preps?.showLineNumber" class="hidden-header">
        <td style="width: 30px; height: 10px; visibility: visible">NO.</td>
        <td
            v-for="(col, index) in columnStructure"
            :key="index"
            :style="{
              width: col.width || '100%',
              height: '10px',
              padding: '2px',
              border: '1px solid rgba(247,250,250,1)',
              visibility: 'visible',
            }"
            class="dy-cell no-cell"
        >
          {{ index + 1 }}
          <div
              v-if="item.preps?.allowResize"
              class="col-resize-handle"
              :title="'拖动改变宽度' + index"
              @mousedown="(e) => handleColResizeStart(e, null, index)"
          />
        </td>
      </tr>
      <tr v-else class="hidden-header">
        <td
            v-for="(col, index) in columnStructure"
            :key="index"
            :style="{
              width: col.width || '100%',
              height: item.preps?.allowResize ? '10px' : '0',
              padding: '0',
              border: '1px',
              background: 'rgba(247,250,250,0.8)',
              visibility: 'hidden',
            }"
        >
          <div
              v-if="item.preps?.allowResize"
              class="col-resize-handle"
              :title="'拖动改变宽度' + index"
              @mousedown="(e) => handleColResizeStart(e, null, index)"
          />
        </td>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(row, rowIndex) in dytableData"
          :key="rowIndex"
          class="dy-tr"
      >
        <td class="dy-cell no-cell" v-if="item.preps?.showLineNumber">
          {{ Number(rowIndex) + 1 }}
        </td>
        <template v-for="(sitem, colIndex) in row">
          <td
              v-if="checkItem(sitem)?.preps?.cellVisible"
              :key="colIndex * rowIndex"
              :colspan="checkItem(sitem)?.preps?.colspan || 1"
              :rowspan="checkItem(sitem)?.preps?.rowspan || 1"
              :class="{
                'title-style': checkItem(sitem)?.preps?.labelFlag == 'Y',
              }"
              :style="{
                width: checkItem(sitem)?.preps?.colWidth || '100%',
                minHeight: checkItem(sitem)?.preps?.colHeight || rowHeight,
                'text-align': checkItem(sitem)?.preps?.textAlign ?? 'left',
                'white-space': sitem.staticData !== true ? 'nowrap' : 'unset',
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
                    class="flex w-full flex-1 my-5"
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
            <!--            <div
                        class="col-resize-handle"
                        :title="'拖动改变宽度'+colIndex"
                        @mousedown="(e) => handleColResizeStart(e, row,colIndex)"
                    />-->
          </td>
        </template>
      </tr>
      </tbody>
    </table>
  </template>
</template>

<style scoped lang="scss">
.no-cell {
  border: 1px solid var(--star-horse-style);
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
  visibility: visible;

  &:hover {
    opacity: 1;
  }
}

.hidden-header {
  visibility: hidden;
  position: relative;
}

.hidden-header td {
  position: relative;
}

.hidden-header:hover .col-resize-handle {
  opacity: 1;
  background: var(--star-horse-style);
}

.title-style {
  font-weight: 700;
  background: #f5f7fa;
  color: #606266;
}

table {
  display: table;
  border-collapse: separate;
  box-sizing: border-box;
  text-indent: initial;
  unicode-bidi: isolate;
  table-layout: fixed;
  border-spacing: 0;
  border-color: gray;
}

tr {
  display: table-row;
  vertical-align: inherit;
  unicode-bidi: isolate;
  border-color: inherit;
}

.instance-table tbody {
  /*  width: inherit;
    height: inherit;*/

  td {
    line-height: 35px;
    border: 1px solid #ebeef5;
    min-height: 35px;
    padding: 1px;

    :deep(.el-form-item--default) {
      margin-bottom: 0 !important;
    }

    :deep(.el-form-item--large) {
      margin-bottom: 0 !important;
    }

    :deep(.el-form-item--small) {
      margin-bottom: 0 !important;
    }

    :deep(.el-form-item) {
      margin-bottom: 0 !important;
    }

    :deep(.el-form-item__error) {
      top: 0 !important;
      transform: translateY(-10%);
    }
  }
}

.striped-table tbody tr:nth-child(even) {
  background: #fafafa;
}
</style>
