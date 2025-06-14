<script setup lang="ts">
import {ModelRef, onMounted, PropType, ref} from 'vue';
import {FieldInfo} from '@/components/types/PageFieldInfo';

defineProps({
  item: {type: Array as PropType<Array<FieldInfo> | any>, required: true},
  commonFormat: {type: Function, required: true}
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
  <template v-if="item.tabList?.length > 0">
    <el-tabs v-model="item.fieldName" type="border-card" class="view-tab">
      <template v-for="(tabItem, key) in item.tabList" :key="tabItem.tabName||key">
        <view-tab-panel-item
            :item="tabItem"
            :commonFormat="commonFormat"
            :dataKey="key"
            parentType="tab"
            v-model:dataForm="dataForm"
        />
      </template>
    </el-tabs>
  </template>
  <template v-else-if="item.batchFieldList?.length > 0">
    <template v-if="item.batchFieldList.length > 1 && (!item.displayStyle || item.displayStyle == 'tab')">
      <el-tabs v-model="normalTabList">
        <template v-for="(sitem, key) in item.batchFieldList" :key="sitem.tabName||key">
          <view-tab-panel-item
              :item="sitem"
              :commonFormat="commonFormat"
              :dataKey="key"
              parentType="batch"
              v-model:dataForm="dataForm"
          />
        </template>
      </el-tabs>
    </template>
    <template v-else v-for="(sitem, key) in item.batchFieldList" :key="sitem.tabName||key">
      <star-horse-data-view-table
          v-if="Object.keys(sitem).length > 0"
          :item="sitem"
          :commonFormat="commonFormat"
          :batchName="sitem['batchName']"
          v-model:dataForm="dataForm"
      />
    </template>
  </template>
</template>

<style scoped lang="scss">
.view-tab {
  margin-top: 5px;
}
</style>
