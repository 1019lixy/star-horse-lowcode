<script setup lang="ts">
import { ModelRef, onMounted, PropType } from 'vue';
import { FieldInfo } from '@/components/types/PageFieldInfo';
import { compKey } from "@/api/system";

const props = defineProps({
  item: { type: Array as PropType<Array<FieldInfo> | any>, required: true },
  commonFormat: { type: Function, required: true }
});
const dataForm: ModelRef<any> = defineModel('dataForm');
const dataFormat = (item: any) => {
  let name = item['hideName'] || item['fieldName'];
  let val = dataForm.value[name];
  try {
    return props.commonFormat(name, val, dataForm.value);
  } catch (e) {
    return val || '--';
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
    <table ref="containerTableRef" :class="{ 'dynamic-table': true, 'instance-table': true }">
      <tbody>
        <tr v-for="(row, rowIndex) in item.dytableList" :key="compKey(row, rowIndex)" class="dy-tr">
          <td v-for="(sitem, colIndex) in row" :key="compKey(sitem, colIndex)" :colspan="sitem.preps?.colspan || 1"
            :rowspan="sitem.preps?.rowspan || 1" :style="{
              width: sitem.preps?.colWidth + '% !important' || '',
              height: sitem.preps?.colHeight + '% !important' || '',
              'word-break': !!sitem.preps?.wordBreak ? 'break-all' : 'normal'
            }">
            <div class="item" v-if="sitem.formVisible || sitem.listVisible || sitem.viewVisible">
              <label>{{ sitem.label }} :</label>
              <div class="content">
                <el-tooltip :content="dataFormat(sitem)">
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
