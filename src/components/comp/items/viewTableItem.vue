<script setup lang="ts">
import {ModelRef, onMounted, PropType, ref} from 'vue';
import {PageFieldInfo} from '@/components/types/PageFieldInfo';

const props = defineProps({
  item: {type: Object as PropType<PageFieldInfo | any>, required: true},
  batchFieldName: {type: String, default: 'batchFieldList'},
  commonFormat: {type: Function, required: true}
});
const dataForm: ModelRef<any> = defineModel('dataForm');
let tabModel = ref<string>('');
const init = () => {
  if (props.item && props.item[props.batchFieldName]?.length > 1) {
    tabModel.value = props.item[props.batchFieldName][0].tabName;
  }
};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item[batchFieldName]?.length > 1 && (!item.displayStyle || item.displayStyle == 'tab')">
    <el-tabs v-model="tabModel">
      <template v-for="(sitem, key) in item.batchFieldList" :key="sitem.tabName||key">
        <el-tab-pane
            v-if="Object.keys(sitem).length > 0"
            :label="sitem['title']"
            :name="sitem.tabName || 'tab' + key"
            :disabled="sitem.disabled"
        >
          <star-horse-data-view-table
              :commonFormat="commonFormat"
              :item="sitem"
              :batchName="sitem['batchName']"
              v-model:dataForm="dataForm"
          />
        </el-tab-pane>
      </template>
    </el-tabs>
  </template>
  <template v-else v-for="(temp,key) in item[batchFieldName]" :key="temp.tabName||key">
    <star-horse-data-view-table
        v-if="Object.keys(temp).length > 0"
        :item="temp"
        :commonFormat="commonFormat"
        v-model:dataForm="dataForm"
        :batchName="temp['batchName']"
    />
  </template>
</template>

<style scoped lang="scss">
:deep(.el-table__cell) {
  padding: 0;
}

:deep(th.el-table__cell:first-child) {
  padding: 5px 0;
}
</style>
