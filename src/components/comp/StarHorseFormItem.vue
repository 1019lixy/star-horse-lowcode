<script setup lang="ts" name="StarHorseFormItem">
import { Config } from "@/api/settings";
import { compKey } from "@/api/system";
import { ModelRef } from "vue";
import { ContainerPreps } from "../types/ItemPreps";
withDefaults(defineProps<ContainerPreps>(), {
  // 数据索引
  dataIndex: -1,
  // 父节点名称
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  batchName: "batchDataList",
  batchFieldName: "batchFieldList",
  compSize: Config.compSize,
  source: 1,
});
const dataForm: ModelRef<any> = defineModel("dataForm");
const checkItemType = (item: any) => {
  if (Array.isArray(item)) {
    return "box-item";
  } else if (item.cardList?.length > 0) {
    return "card-item";
  } else if (item.collapseList?.length > 0) {
    return "collapse-item";
  } else if (item.dytableList?.length > 0) {
    return "dytable-item";
  } else if (item.tabList?.length > 0 || item.batchFieldList?.length > 0) {
    return "tab-item";
  } else {
    return "other-item";
  }
};
</script>
<template>
  <template
    v-for="(item, index) in fieldList.fieldList"
    :key="compKey(item, index, false, 'form')"
  >
    <component
      :Key="compKey(item, index, true)"
      :is="checkItemType(item)"
      :primary-key="primaryKey"
      :item="item"
      :rules="rules"
      :batchFieldName="batchFieldName"
      :batchName="batchName"
      :compSize="compSize"
      :compUrl="compUrl"
      :subFormFlag="subFormFlag"
      :source="source"
      :objectName="objectName"
      :dataIndex="dataIndex"
      :propPrefix="propPrefix"
      v-model:dataForm="dataForm"
      :parentPreps="fieldList.preps"
    />
  </template>
  <table-item
    :primary-key="primaryKey"
    :item="fieldList"
    :rules="rules"
    :batchFieldName="batchFieldName"
    :batchName="batchName"
    :compSize="compSize"
    :compUrl="compUrl"
    :subFormFlag="subFormFlag"
    :source="source"
    :objectName="objectName"
    :dataIndex="dataIndex"
    :propPrefix="propPrefix"
    v-model:dataForm="dataForm"
    :parentPreps="fieldList.preps"
  />
</template>
<style lang="scss" scoped></style>
