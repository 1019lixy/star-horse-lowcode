<script setup lang="ts">
import {computed, ModelRef, onMounted, PropType} from "vue";
import {FieldInfo} from "@/components/types/PageFieldInfo";
import {compKey} from "@/api/system";

const props = defineProps({
  item: {type: Array as PropType<Array<FieldInfo> | any>, required: true},
  commonFormat: {type: Function, required: true},
  compSize:{type:String,default:"default"},
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
    let hasMergeCol = row.find((col: any) => col.preps?.colspan > 1);
    if (hasMergeCol && row.length > 1) {
      hasMergeColFlag = true;
      return false;
    }
  });
  if (!hasMergeColFlag) {
    maxColsRow = props.item.dytableList.reduce((maxRow: any, row: any) => {
      return (row?.length || 0) > (maxRow?.length || 0) ? row : maxRow;
    }, props.item.dytableList[0]);
  } else {
    maxColsRow = props.item.dytableList.reduce((maxRow: any, row: any) => {
      const hasMergeCol = row.find((col: any) => col.preps?.colspan > 1);
      if (hasMergeCol && row && row.length >= (maxRow?.length || 0)) {
        return row;
      }
      return maxRow;
    }, props.item.dytableList[0]);
  }
  let totalCols = 0;
  // 构建列结构，包含宽度信息
  const colStructure = maxColsRow.map((sitem: any, index: number) => {
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
    return {width};
  });
  const addCol = Math.abs(maxColsRow.length - totalCols);
  for (let i = 0; i < addCol; i++) {
    colStructure.push({width: "100%"});
  }
  return colStructure;
});
const dataFormat = (item: any) => {
  let name = item["hideName"] || item["fieldName"];
  let val = "";
  try {
    val = dataForm.value?.[name];
    return props.commonFormat(name, val, dataForm.value);
  } catch (e) {
    return val || "--";
  }
};
const init = () => {
};
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
        class="dynamic-table "
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
          :key="compKey(row, rowIndex)"
          class="dy-tr"
      >
        <td
            v-for="(sitem, colIndex) in row"
            :key="compKey(sitem, colIndex)"
            :colspan="sitem.preps?.colspan || 1"
            :rowspan="sitem.preps?.rowspan || 1"
            :class="{ 'title-style': sitem.preps?.labelFlag == 'Y' }"
            :style="{
              border: '1px solid var(--star-horse-border—color',
              width: sitem.preps?.colWidth || 'auto',
              height: sitem.preps?.colHeight || rowHeight,
              'text-align': sitem.preps?.textAlign ?? 'left',
              'white-space': 'nowrap',
              'word-break': !!sitem.preps?.wordBreak ? 'break-all' : 'keep-all',
            }"
        >
          <div class=" w-full h-full  overflow-hidden" v-if="sitem.type=='html'||sitem.type=='text'">
            <star-horse-item
                :compSize="compSize"
                v-model:dataForm="dataForm"
                :item="sitem"
                :dataIndex="1"
                :source="5"
            />
          </div>
          <div
              class=" h-full w-full item"
              v-else-if="sitem.formVisible || sitem.listVisible || sitem.viewVisible"
          >
            <label v-if="!sitem.preps?.hideLabel&&sitem.label">{{ sitem.label }} :</label>
            <div :class="{content:!sitem.preps?.hideLabel}">
              <pre v-if="sitem.type == 'textarea' || sitem.type == 'markdown'">{{
                  dataFormat(sitem)
                }}</pre>
              <el-tooltip :content="dataFormat(sitem)" v-else>
                {{ dataFormat(sitem) }}
              </el-tooltip>
            </div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </template>
</template>

<style scoped lang="scss">
.instance-table {
  margin-top: 5px;

  td {
    line-height: 40px;
    height: 40px;
    padding: 0 10px 0 0;
  }
}
</style>
