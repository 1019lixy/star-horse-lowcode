<script setup lang="ts" name="tableColumnItem">
import {computed, onMounted, PropType, watch} from "vue";
import {ApiUrls} from "@/components/types/ApiUrls";
import {compKey} from "@/api/system";
import {StarHorseTableColumn} from "@/components/comp";
import {PageFieldInfo} from "@/components/types";
import {processFieldList} from "@/api/form_utils";

const props = defineProps({
  //url地址
  compUrl: {type: Object as PropType<ApiUrls>, required: true},
  //列名
  fieldList: {type: Object as PropType<PageFieldInfo>, required: true},
  //格式化方法
  dataFormat: {type: Function, default: null},
  //是否显示排序
  sortable: {type: Boolean, default: true},
  //是否显示批量属性
  showBatchField: {type: Boolean, default: false},
  compSize: {type: String, default: "default"},
  //全局配置，动态页面使用
  globalConfig: {type: Object as PropType<any>, required: false},
  //是否动态页面
  isDynamic: {type: Boolean, default: false},
  commonFormat: {
    type: Function, default: () => {
    }
  },
  sourceName: {type: String, default: "main"},
});

// Normalize different field list structures into a consistent format
const normalizedFieldList = computed(() => {
  const result: Array<any> = [];
  const compFieldInfo = props.fieldList;
  // Process main field list
  processFieldList(compFieldInfo?.fieldList || [], props.sourceName,result);
  // Process batch field list if showBatchField is true
  if (props.showBatchField && compFieldInfo?.batchFieldList) {
    compFieldInfo?.batchFieldList?.forEach((item: any, index: number) => {
      if (item?.fieldList) {
        processFieldList(item.fieldList, `batch_${index}`,result);
      } else {
        result.push({
          item,
          key: compKey(item, `batch_${index}`),
        });
      }
    });
  }
  return result;
});
</script>

<template>
  <template v-for="field in normalizedFieldList" :key="field.key">
    <star-horse-table-column
        :compUrl="compUrl"
        :cellEditable="fieldList['cellEditable']"
        :globalConfig="globalConfig"
        :isDynamic="isDynamic"
        :data-format="dataFormat"
        :commonFormat="commonFormat"
        :showBatchField="showBatchField"
        :sortable="sortable"
        :compSize="compSize"
        :item="field.item"
    />
  </template>
</template>

<style scoped lang="scss"></style>
