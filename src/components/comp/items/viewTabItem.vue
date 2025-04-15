<script setup lang="ts">
  import { onMounted, PropType, ref } from "vue";
  import { FieldInfo } from "@/components/types/PageFieldInfo";
  import { ModelRef } from "vue";

  defineProps({
    item: { type: Array as PropType<Array<FieldInfo>>, required: true },
    commonFormat: { type: Function, required: true }
  });
  const dataForm: ModelRef<any> = defineModel("dataForm");
  const normalTabList = ref<string>("tab0");
  const init = () => {};
  onMounted(() => {
    init();
  });
</script>

<template>
  <template v-if="item.tabList && item.tabList.length > 0">
    <el-tabs v-model="item.fieldName" type="border-card" class="view-tab">
      <template v-for="(tabItem, key) in item.tabList">
        <el-tab-pane
          v-if="Object.keys(tabItem).length > 0"
          :label="tabItem.title || tabItem.tabName"
          :name="tabItem.tabName || key"
        >
          <star-horse-data-view-items
            :objectName="tabItem.objectName"
            :subFormFlag="tabItem.subFormFlag"
            v-model:dataForm="dataForm[tabItem.objectName]"
            :commonFormat="commonFormat"
            primaryKey="id"
            :fieldList="{
              ...tabItem
            }"
          />
        </el-tab-pane>
      </template>
    </el-tabs>
  </template>
  <template v-else-if="item.batchFieldList && item.batchFieldList.length > 0">
    <template v-if="item.batchFieldList.length > 1 && (!item.displayStyle || item.displayStyle == 'tab')">
      <el-tabs v-model="normalTabList">
        <template v-for="(sitem, key) in item.batchFieldList">
          <el-tab-pane
            v-if="Object.keys(sitem).length > 0"
            :label="sitem['title']"
            :name="sitem.tabName || 'tab' + key"
            :disabled="sitem.disabled"
          >
            <star-horse-data-view-table
              :batchName="sitem['batchName']"
              :commonFormat="commonFormat"
              :item="sitem"
              v-model:dataForm="dataForm"
            />
          </el-tab-pane>
        </template>
      </el-tabs>
    </template>
    <template v-else v-for="(sitem, key) in item.batchFieldList">
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
