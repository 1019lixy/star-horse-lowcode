<script setup lang="ts">
import { PropType } from 'vue';
import { ApiUrls } from '@/components/types/ApiUrls';
import { Config } from '@/api/settings';
import { compKey } from "@/api/system";

defineProps({
  //url地址
  compUrl: { type: Object as PropType<ApiUrls>, required: true },
  //列名
  fieldList: { type: Object, required: true },
  //格式化方法
  dataFormat: { type: Function, default: null },
  //是否显示排序
  sortable: { type: Boolean, default: true },
  //是否显示批量属性
  showBatchField: { type: Boolean, default: false },
  compSize: { type: String, default: Config.compSize },
  //全局配置，动态页面使用
  globalConfig: { type: Object as PropType<any>, required: false },
  //是否动态页面
  isDynamic: { type: Boolean, default: false }
});
</script>
<template>
  <template v-for="(item, index) in fieldList?.fieldList" :key="compKey(item,index)">
    <template v-if="Array.isArray(item)">
      <star-horse-table-column :data-format="dataFormat" :cellEditable="fieldList['cellEditable']" :item="sitem"
        :globalConfig="globalConfig" :isDynamic="isDynamic" :sortable="sortable" :compSize="compSize" :compUrl="compUrl"
        :key="compKey(sitem, key)" v-for="(sitem, key) in item" />
    </template>
    <template v-else-if="item.tabList?.length > 0">
      <template v-for="(tabItems, key) in item.tabList" :key="compKey(tabItems,key)">
        <star-horse-table-column :data-format="dataFormat" :cellEditable="fieldList['cellEditable']" :item="sitem"
          :globalConfig="globalConfig" :isDynamic="isDynamic" :sortable="sortable" :compSize="compSize"
          :compUrl="compUrl" :key="compKey(sitem, skey)" v-for="(sitem, skey) in tabItems.fieldList" />
      </template>
    </template>
    <template v-else-if="item.dytableList?.length > 0">
      <template v-for="(tabItems, key) in item.dytableList" :key="compKey(tabItems,key)">
        <star-horse-table-column :data-format="dataFormat" :cellEditable="fieldList['cellEditable']" :item="sitem"
          :globalConfig="globalConfig" :isDynamic="isDynamic" :sortable="sortable" :compSize="compSize"
          :compUrl="compUrl" :key="compKey(sitem, skey)" v-for="(sitem, skey) in tabItems" />
      </template>
    </template>
    <template v-else-if="item.batchFieldList?.length > 0">
      <template v-for="(batchItems, key) in item.batchFieldList" :key="compKey(batchItems,key)">
        <star-horse-table-column :data-format="dataFormat" :cellEditable="fieldList['cellEditable']" :item="sitem"
          :globalConfig="globalConfig" :isDynamic="isDynamic" :sortable="sortable" :compSize="compSize"
          :compUrl="compUrl" :key="compKey(sitem, skey)" v-for="(sitem, skey) in batchItems.fieldList" />
      </template>
    </template>
    <star-horse-table-column v-else :compUrl="compUrl" :cellEditable="fieldList['cellEditable']"
      :globalConfig="globalConfig" :isDynamic="isDynamic" :data-format="dataFormat" :sortable="sortable"
      :compSize="compSize" :item="item" />
  </template>
  <template v-if="showBatchField" v-for="item in fieldList['batchFieldList']" :key="compKey(item,item.batchName)">
    <star-horse-table-column :data-format="dataFormat" :compSize="compSize" :globalConfig="globalConfig"
      :isDynamic="isDynamic" :sortable="sortable" :item="item" />
  </template>
</template>

<style scoped lang="scss"></style>
