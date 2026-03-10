<script setup lang="ts">
import {checkVisible, loadProp, validMsg} from "@/api/form_utils";
import { ContainerPreps } from "@/components/types/ItemPreps";
import { ModelRef, onMounted, computed } from "vue";

const props = withDefaults(defineProps<ContainerPreps>(), {
  // 数据索引
  dataIndex: -1,
  // 父节点名称
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  batchName: "batchDataList",
  batchFieldName: "batchFieldList",
  compSize: "default",
  source: 1,
});
const dataForm: ModelRef<any> = defineModel("dataForm");
const rowHeight = computed(() => {
  if(props.compSize=="large"){
    return "45px";
  }else if(props.compSize=="small"){
    return "35px";
  }else{
    return "40px";
  }
});
// 计算表格的列结构
const columnStructure = computed(() => {
  if (!props.item?.dytableList?.length) return [];

  // 找到最大列数的行
  let maxColsRow = props.item.dytableList[0];
  // props.item.dytableList.forEach((row: any) => {
  //   if (row && row.length > maxColsRow.length) {
  //     maxColsRow = row;
  //   }
  // });
   let hasMergeColFlag = false;
  props.item.dytableList.forEach((row: any) => {
    let hasMergeCol= row.find((col: any) => col.preps?.colspan>1);
    if(hasMergeCol&&row.length>1) {
      hasMergeColFlag = true;
      return false;
    }
  });
  if(!hasMergeColFlag) {
    maxColsRow = props.item.dytableList.reduce((maxRow: any, row: any) => {
      return (row?.length || 0) > (maxRow?.length || 0) ? row : maxRow;
    }, props.item.dytableList[0]);
  }else{
     maxColsRow = props.item.dytableList.reduce((maxRow: any, row: any) => {
      const hasMergeCol= row.find((col: any) => col.preps?.colspan>1);
      if(hasMergeCol && row && row.length >= (maxRow?.length || 0)) {
        return row;
      }
      return maxRow;
    }, props.item.dytableList[0]);
  }
   let totalCols = 0;
  // 构建列结构，包含宽度信息
  const colStructure =  maxColsRow.map((sitem: any, index: number) => {
    // 从所有行中查找该列的宽度信息
    let width = sitem.preps?.colWidth;
    let colspan = sitem.preps?.colspan || 1;
    if (!width) {
      for (const row of props.item.dytableList) {
        if (row && row[index] && row[index].preps?.colWidth) {
          width = row[index].preps.colWidth;
          break;
        }
      }
    }
    totalCols += colspan;
    return { width };
  });
  const addCol = Math.abs(maxColsRow.length - totalCols);
  for (let i = 0; i < addCol; i++) {
    colStructure.push({ width: "100%" });
  }
  return colStructure;
});

const init = () => {};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.dytableList?.length > 0">
    <table
      ref="containerTableRef"
      :style="{
        width: item.preps?.styles?.width ?? '100%',
        height: item.preps?.styles?.height ?? '100%',
        overflow: item.preps?.styles?.overflow ?? 'auto',
      }"
      class="dynamic-table instance-table"
    >
      <!-- 隐藏的表头行，用于保持列结构和宽度 -->
      <thead v-if="item.dytableList?.length > 0">
        <tr class="hidden-header">
          <td
            v-for="(col, index) in columnStructure"
            :key="index"
            :style="{
              width: col.width || '100%',
              height: '1px',
              padding: '0',
              border: 'none',
              visibility: 'hidden'
            }"
          />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in item.dytableList"
          :key="rowIndex"
          class="dy-tr"
        >
          <td
            v-for="(sitem, colIndex) in row"
            :key="colIndex * rowIndex"
            :colspan="sitem.preps?.colspan || 1"
            :rowspan="sitem.preps?.rowspan || 1"
            :class="{ 'title-style': sitem.preps?.labelFlag == 'Y' }"
            :style="{
              width: sitem.preps?.colWidth || 'auto',
              height: sitem.preps?.colHeight || rowHeight,
              'text-align': sitem.preps?.textAlign ?? 'left',
              'white-space': 'nowrap',
              'word-break': !!sitem.preps?.wordBreak ? 'break-all' : 'keep-all',
              'text-overflow': 'ellipsis'
            }"
          >
            <template
              v-if="
                sitem.type != 'button' &&
                sitem.type != 'usercomp' &&
                !sitem.preps?.staticData
              "
            >
              <el-form-item
                :size="compSize"
                :label="sitem.preps?.hideLabel ? '' : sitem.label"
                class="h-full w-full"
                :prop="loadProp(propPrefix, sitem.fieldName, -1, -1)"
                :labelPosition="parentPreps?.labelPosition"
                :rules="validMsg(sitem, dataForm)"
                v-if="
                  (sitem.formVisible &&
                  sitem.label &&
                  sitem.preps?.headerFlag != 'Y')||
                  checkVisible(sitem, dataForm)
                "
              >
                <star-horse-item
                  :primaryKey="primaryKey"
                  :compSize="compSize"
                  v-model:dataForm="dataForm"
                  :item="sitem"
                  :dataIndex="dataIndex"
                  :source="source"
                />
              </el-form-item>
              <star-horse-item
                v-else-if="sitem.viewVisible || checkVisible(sitem, dataForm)"
                :compSize="compSize"
                :primaryKey="primaryKey"
                v-model:dataForm="dataForm"
                :item="sitem"
                class="h-full w-full"
                :dataIndex="dataIndex"
                :source="source"
              />
            </template>
            <template v-else-if="sitem.fieldName">
              <star-horse-item
                :primaryKey="primaryKey"
                :compSize="compSize"
                v-model:dataForm="dataForm"
                :item="sitem"
                :dataIndex="dataIndex"
                :source="source"
              />
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
</template>

<style scoped lang="scss">
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
  border-spacing: 0;
  border-color: gray;
}

tr {
  display: table-row;
  vertical-align: inherit;
  unicode-bidi: isolate;
  border-color: inherit;
}

.instance-table {
  /*  width: inherit;
    height: inherit;*/

  td {
    line-height: 35px;
    border: 1px solid #ebeef5;
    height: 35px;
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
</style>
