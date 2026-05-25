<script setup lang="ts">
import { PropType, computed } from "vue";
import { ApiUrls } from "@/components/types/ApiUrls";
import { compKey } from "@/api/system";
import {StarHorseTableColumn} from "@/components/comp";

const props = defineProps({
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
  compSize: { type: String, default: "default" },
  //全局配置，动态页面使用
  globalConfig: { type: Object as PropType<any>, required: false },
  //是否动态页面
  isDynamic: { type: Boolean, default: false },
  commonFormat: { type: Function, default: ()=>{} },
});

// Normalize different field list structures into a consistent format
const normalizedFieldList = computed(() => {
  const result: Array<any> = [];

  const processFieldList = (fieldList: any[], parentKey: string = "") => {
    if (!fieldList) return;

    for (const [index, item] of fieldList.entries()) {
      const key = `${parentKey}_${index}`;

      if (Array.isArray(item)) {
        processFieldList(item, `${key}_array`);
      } else if (item.tabList?.length > 0) {
        item.tabList.forEach((tabItems: any, tabIndex: number) => {
          processFieldList(tabItems.fieldList, `${key}_tab_${tabIndex}`);
        });
      } else if (item.cardList?.length > 0) {
        item.cardList.forEach((cardItems: any, cardIndex: number) => {
          processFieldList(cardItems.fieldList, `${key}_card_${cardIndex}`);
        });
      } else if (item.collapseList?.length > 0) {
        item.collapseList.forEach(
          (collapseItems: any, collapseIndex: number) => {
            processFieldList(
              collapseItems.fieldList,
              `${key}_collapse_${collapseIndex}`,
            );
          },
        );
      } else if (item.splitterList?.length > 0) {
        item.splitterList.forEach(
          (splitterItems: any, splitterIndex: number) => {
            processFieldList(
              splitterItems.fieldList,
              `${key}_splitter_${splitterIndex}`,
            );
          },
        );
      } else if (item.dytableList?.length > 0) {
        item.dytableList.forEach((tabItems: any, dytableIndex: number) => {
          processFieldList(
            Array.isArray(tabItems) ? tabItems : [tabItems],
            `${key}_dytable_${dytableIndex}`,
          );
        });
      } else if (item.batchFieldList?.length > 0) {
        item.batchFieldList.forEach((batchItems: any, batchIndex: number) => {
          processFieldList(batchItems.fieldList, `${key}_batch_${batchIndex}`);
        });
      } else {
        result.push({
          item,
          key: compKey(item, key),
        });
      }
    }
  };

  // Process main field list
  processFieldList(props.fieldList?.fieldList || [], "main");

  // Process batch field list if showBatchField is true
  if (props.showBatchField && props.fieldList?.batchFieldList) {
    props.fieldList?.batchFieldList?.forEach((item: any, index: number) => {
      if (item?.fieldList) {
        processFieldList(item.fieldList, `batch_${index}`);
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
      :sortable="sortable"
      :compSize="compSize"
      :item="field.item"
    />
  </template>
</template>

<style scoped lang="scss"></style>
