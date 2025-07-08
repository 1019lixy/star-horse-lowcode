<script setup lang="ts">
import { ModelRef, onMounted, PropType } from 'vue';
import { ApiUrls } from '@/components/types/ApiUrls';
import { PageFieldInfo } from '@/components/types/PageFieldInfo';
import { loadProp, validMsg } from '@/api/form_utils';
import { Config } from '@/api/settings';
import { compKey } from "@/api/system";

defineProps({
  compUrl: { type: Object as PropType<ApiUrls> },
  item: { type: Object as PropType<PageFieldInfo | any>, required: true },
  objectName: { type: String },
  // 数据索引
  dataIndex: { type: Number, default: -1 },
  // 父节点名称
  propPrefix: { type: String, default: '' },
  parentPreps: { type: Object, default: {} },
  subFormFlag: { type: String, default: 'N' },
  batchName: { type: String, default: 'batchDataList' },
  batchFieldName: { type: String, default: 'batchFieldList' },
  primaryKey: { type: [String, Object] as PropType<string | any> },
  rules: { type: Object },
  compSize: { type: String, default: Config.compSize },
  source: { type: Number, default: 1 },
});
const dataForm: ModelRef<any> = defineModel('dataForm');
const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.dytableList?.length > 0">
    <table ref="containerTableRef" :class="{ 'dynamic-table': true, 'instance-table': true }">
      <tbody>
        <tr v-for="(row, rowIndex) in item.dytableList" :key="compKey(row, rowIndex)" class="dy-tr">
          <td v-for="(sitem, colIndex) in row" :key="compKey(sitem, colIndex)" :colspan="sitem.preps?.colspan || 1"
            :rowspan="sitem.preps?.rowspan || 1" :class="{ 'title-style': sitem.preps?.labelFlag == 'Y' }" :style="{
              width: sitem.preps?.colWidth + '% !important' || '',
              height: sitem.preps?.colHeight + '% !important' || '',
              'text-align': sitem.preps?.textAlign ?? 'left',
              'white-space': 'nowrap',
              'word-break': !!sitem.preps?.wordBreak ? 'break-all' : 'keep-all'
            }">
            <el-form-item :size="compSize" :label="sitem.label" :required="sitem.required"
              style="width: 100%;height: 100%" :prop="loadProp(propPrefix, sitem.fieldName, -1, -1)"
              :labelPosition="parentPreps?.labelPosition" :rules="validMsg(sitem, dataForm)"
              v-if="sitem.formVisible && sitem.label && sitem.preps?.labelFlag != 'Y'">
              <star-horse-item :primaryKey="primaryKey" :compSize="compSize" v-model:dataForm="dataForm" :item="sitem"
                :dataIndex="dataIndex" :source="source" />
            </el-form-item>
            <star-horse-item v-else-if="sitem.formVisible || sitem.viewVisible" :compSize="compSize"
              :primaryKey="primaryKey" v-model:dataForm="dataForm" :item="sitem" style="width: 100%;height: 100%"
              :dataIndex="dataIndex" :source="source" />
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
    line-height: 40px;
    border: 1px solid #ebeef5;
    height: 40px;
    padding: 0 10px 0 0;
  }
}
</style>
