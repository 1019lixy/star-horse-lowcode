<script setup lang="ts">
import {ModelRef, onMounted, PropType, ref} from 'vue';
import {FieldInfo} from '@/components/types/PageFieldInfo';

defineProps({
  item: {type: Array as PropType<Array<FieldInfo> | any>, required: true},
  commonFormat: {type: Function, required: true},
  dataKey: {type: Number, default: 0},
  parentType: {type: String, default: ''}
});
const dataForm: ModelRef<any> = defineModel('dataForm');
const normalTabList = ref<string>('tab0');
const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>

  <el-tab-pane
      v-if="Object.keys(item).length > 0"
      :label="item.title || item.tabName"
      :name="item.tabName || dataKey"
  >
    <template v-if="(parentType=='tab'&&item.tableFlag!='Y')||item.formFlag=='Y'">
      <star-horse-data-view-items
          :objectName="item.objectName"
          :subFormFlag="item.subFormFlag"
          v-model:dataForm="dataForm[item.objectName]"
          :commonFormat="commonFormat"
          primaryKey="id"
          :fieldList="{
              ...item
            }"
      />
    </template>
    <star-horse-data-view-table
        v-else-if="parentType=='batch'||item.tableFlag=='Y'"
        :batchName="item['batchName']"
        :commonFormat="commonFormat"
        :item="item"
        v-model:dataForm="dataForm"
    />
  </el-tab-pane>
</template>

<style scoped lang="scss">
.view-tab {
  margin-top: 5px;
}
</style>
