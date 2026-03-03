<script setup lang="ts">
import { loadProp, validMsg } from "@/api/form_utils";
import { ContainerPreps } from "@/components/types/ItemPreps";
import { ModelRef, onMounted } from "vue";

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
      :class="{
        'dynamic-table': true,
        'instance-table': true,
      }"
    >
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
              width: sitem.preps?.colWidth || 'unset',
              height: sitem.preps?.colHeight || 'unset',
              'text-align': sitem.preps?.textAlign ?? 'left',
              'white-space': 'nowrap',
              'word-break': !!sitem.preps?.wordBreak ? 'break-all' : 'keep-all',
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
                  sitem.formVisible &&
                  sitem.label &&
                  sitem.preps?.labelFlag != 'Y'
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
                v-else-if="sitem.formVisible || sitem.viewVisible"
                :compSize="compSize"
                :primaryKey="primaryKey"
                v-model:dataForm="dataForm"
                :item="sitem"
                class="h-full w-full"
                :dataIndex="dataIndex"
                :source="source"
              />
            </template>
            <template v-else>
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
