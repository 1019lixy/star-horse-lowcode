<script setup lang="ts" name="ShTableListColumn">
import { createDatetime } from "@/api/date_utils";
import { parseListData, validMsg } from "@/api/form_utils";
import { Config } from "@/api/settings";
import { PropType } from "vue";
import { i18n } from "@/lang";

const props = defineProps({
  dataForm: { type: Object, required: true },
  index: { type: Object, required: true },
  item: { type: Object as PropType<any>, required: true },
  staticColumn: { type: String, default: "Y" },
  primaryKey: { type: [String, Object] as PropType<string | any> },
  batchName: { type: String, default: "batchDataList" },
  rules: { type: Object },
  size: { type: String, default: "default" },
  source: { type: Number, default: 1 },
});
const dataFormat = (val: any) => {
  const type: string = props.item.type;
  if (val) {
    if (type == "date" || type == "datetime") {
      return createDatetime(val);
    }
    if (type == "switch") {
      return val === true || val == "1" || val == "Y"
        ? i18n("common.yes")
        : i18n("common.no");
    }
    if (
      type == "select" ||
      type == "radio" ||
      type == "checkbox" ||
      type == "cascader" ||
      type == "tselect"
    ) {
      return parseListData(props.item, val);
    }
    return val;
  }
  return "--";
};
</script>
<template>
  <template v-if="staticColumn == 'Y'">
    {{ dataFormat(dataForm[item.fieldName]) }}
  </template>
  <el-form-item
    v-else
    :size="size"
    :rules="validMsg(item, dataForm)"
    :prop="`${batchName}.${index}.${item.fieldName}`"
  >
    <star-horse-item
      :primaryKey="primaryKey"
      :compSize="size"
      :batchName="batchName"
      :item="item"
      :data-form="dataForm"
      :source="source"
    />
  </el-form-item>
</template>
<style scoped></style>
