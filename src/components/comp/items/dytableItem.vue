<script setup lang="ts">
import {checkVisible, loadProp, validMsg} from "@/api/form_utils";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {computed, ModelRef, onMounted} from "vue";
import StarHorseItem from "@/components/comp/StarHorseItem.vue";

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
  if (!props.item?.dytableList?.length) return [];

  const rows=props.item.dytableList;
  // 找到最大列数的行
  let maxColsRow = props.item.dytableList[0];
  let columns = maxColsRow.length;
  const colStructure = [];
  for (let i = 0; i < columns; i++) {
    colStructure.push({width: checkItem(maxColsRow[i]).preps?.colWidth||"100%"});
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
        <template v-for="(sitem, colIndex) in row">
          <td
              v-if="checkItem(sitem).preps.cellVisible"
              :key="colIndex * rowIndex"
              :colspan="checkItem(sitem).preps?.colspan || 1"
              :rowspan="checkItem(sitem).preps?.rowspan || 1"
              :class="{ 'title-style': checkItem(sitem).preps?.labelFlag == 'Y' }"
              :style="{
              width: checkItem(sitem).preps?.colWidth || '100%',
              height: checkItem(sitem).preps?.colHeight || rowHeight,
              'text-align': checkItem(sitem).preps?.textAlign ?? 'left',
              'white-space': 'nowrap',
              'word-break': !!checkItem(sitem).preps?.wordBreak ? 'break-all' : 'normal',
              'text-overflow': 'ellipsis'
            }"
          >
            <template v-for="tempData in createArray(sitem)">
              <template
                  v-if="
                tempData.type != 'button' &&
                tempData.type != 'usercomp' &&
                !tempData.preps?.staticData
              "
              >
                <el-form-item
                    :size="compSize"
                    :label="tempData.preps?.hideLabel ? '' : tempData.label"
                    class="flex w-full flex-1 my-5"
                    :prop="loadProp(propPrefix, tempData.fieldName, -1, -1)"
                    :labelPosition="tempData.preps?.labelPosition??parentPreps?.labelPosition"
                    :rules="validMsg(tempData, dataForm)"
                    :commonFormat="commonFormat"
                    v-if="
                  (tempData.formVisible &&
                  tempData.label &&
                  tempData.preps?.headerFlag != 'Y')||
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
                    v-else-if="tempData.viewVisible || checkVisible(tempData, dataForm)"
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
          </td>
        </template>
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
