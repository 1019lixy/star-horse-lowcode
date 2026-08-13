<script setup lang="ts" name="StarHorseFormItem">
import { compKey } from "@/api/system";
import { ModelRef } from "vue";
import { ContainerPreps } from "../types/ItemPreps";
import { commonParseCodeToName } from "@/api/star_horse_utils";
import { i18n } from "@/lang";
import TableItem from "@/components/comp/items/tableItem.vue";

const props = withDefaults(defineProps<ContainerPreps>(), {
  // 数据索引
  dataIndex: -1,
  // 父节点名称
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  batchName: "batchDataList",
  compSize: "default",
  source: 1,
});
const emits = defineEmits(["addRow", "removeRow"]);
const dataForm: ModelRef<any> = defineModel("dataForm");
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
  // 优先判断 children，有 children 的非叶子节点返回 group-item
  if (
    item.children &&
    Array.isArray(item.children) &&
    item.children.length > 0
  ) {
    return "group-item";
  }
  // 第三类容器统一派发:有 containerType 则派发对应容器组件
  // 新增容器类型只需配置 containerType,无需修改此处
  if (item.containerType && item.containerFields?.length > 0) {
    const containerType =
      item.containerType === "batchTable" ? "table" : item.containerType;
    return `${containerType}-item`;
  }
  if (Array.isArray(item)) {
    return "box-item";
  } else if (item.appList?.length > 0) {
    return "app-item";
  } else {
    return "other-item";
  }
};
const addRow = (row: any) => {
  emits("addRow", row);
};
const removeRow = (row: any) => {
  emits("removeRow", row);
};
</script>
<template>
  <template v-for="(item, index) in fieldList?.fieldList">
    <component
      v-if="item"
      :key="compKey(item, index, true)"
      :is="checkItemType(item)"
      :primary-key="primaryKey"
      :item="item"
      :rules="rules"
      :batchName="batchName"
      :compSize="compSize"
      :dialogType="dialogType"
      :compUrl="compUrl"
      :subFormFlag="subFormFlag"
      :source="source"
      :objectName="objectName"
      :dataIndex="dataIndex"
      :propPrefix="propPrefix"
      :commonFormat="itemCommonFormat"
      v-model:dataForm="dataForm"
      :parentPreps="fieldList?.preps"
    />
  </template>
  <table-item
    v-if="fieldList?.containerFields?.length > 0"
    :primary-key="primaryKey"
    :item="fieldList"
    :rules="rules"
    :batchName="batchName"
    :compSize="compSize"
    :compUrl="compUrl"
    :subFormFlag="subFormFlag"
    :enableSubNode="enableSubNode"
    :source="source"
    :dialogType="dialogType"
    :commonFormat="itemCommonFormat"
    :objectName="objectName"
    :dataIndex="dataIndex"
    :propPrefix="propPrefix"
    v-model:dataForm="dataForm"
    @addRow="addRow"
    @removeRow="removeRow"
    :parentPreps="fieldList?.preps"
  />
</template>
<style lang="scss" scoped></style>
