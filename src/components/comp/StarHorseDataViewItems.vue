<script setup lang="ts" name="StarHorseDataViewObject">
import { ModelRef, PropType } from "vue";
import { PageFieldInfo } from "@/components/types/PageFieldInfo";
import { commonParseCodeToName } from "@/api/star_horse_utils";
import { compKey } from "@/api/system";
import { i18n } from "@/lang";

const props = defineProps({
  // compUrl: {type: Object as PropType<ApiUrls>},
  fieldList: { type: Object as PropType<PageFieldInfo>, required: true },
  objectName: { type: String },
  subFormFlag: { type: String, default: "N" },
  batchName: { type: String, default: "batchDataList" },
  batchFieldName: { type: String, default: "batchFieldList" },
  primaryKey: { type: [String, Object] as PropType<string | any> },
  commonFormat: { type: Function, required: true },
});
const dataForm: ModelRef<any> = defineModel("dataForm");
const _compKey = compKey;
const itemCommonFormat = (name: string, cellValue: any, row: any) => {
  cellValue = commonParseCodeToName(name, cellValue);
  if (name == "isDel") {
    return cellValue == 1 ? i18n("common.yes") : i18n("common.no");
  }
  return null == props.commonFormat
    ? cellValue
    : props.commonFormat(name, cellValue, row);
};
const checkItemType = (item: any) => {
  if (Array.isArray(item)) {
    return "view-box-item";
  } else if (item.cardList?.length > 0) {
    return "view-card-item";
  } else if (item.collapseList?.length > 0) {
    return "view-collapse-item";
  }else if (item.splitterList?.length > 0) {
    return "view-splitter-item";
  }  else if (item.tabList?.length > 0 || item.batchFieldList?.length > 0) {
    return "view-tab-item";
  } else if (item.dytableList?.length > 0) {
    return "view-dytable-item";
  } else {
    return "view-other-item";
  }
};
</script>
<template>
  <component
    v-for="item in fieldList?.fieldList"
    :key="_compKey(item, checkItemType(item))"
    :is="checkItemType(item)"
    :item="item"
    v-model:dataForm="dataForm"
    :commonFormat="itemCommonFormat"
  />
  <view-table-item
    :item="fieldList"
    :batch-field-name="batchFieldName"
    v-model:dataForm="dataForm"
    :commonFormat="itemCommonFormat"
  />
  <div class="h-[30px]"></div>
</template>
<style lang="scss" scoped></style>
