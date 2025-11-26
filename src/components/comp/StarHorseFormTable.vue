<script setup lang="ts" name="StarHorseFormItem">
import { Config } from "@/api/settings";
import { batchFieldDefaultValues } from "@/api/star_horse_utils";
import { ModelRef, PropType, ref } from "vue";

defineProps({
  item: { type: Object as PropType<any>, required: true },
  rules: { type: Object },
  initRows: { type: Number, default: 0 },
  size: { type: String, default: "default" },
  source: { type: Number, default: 1 },
});
const emits = defineEmits(["addRow", "removeRow"]);
const dataForm: ModelRef<any> = defineModel("dataForm");
const currentTableRef = ref();
/**
 * 列表添加行数据
 * @param row
 */
const addRow = (row: any) => {
  emits("addRow", row);
};
/**
 * 列表删除行数据
 * @param row
 */
const removeRow = (row: any) => {
  emits("removeRow", row);
};
</script>
<template>
  <star-horse-form-list
    style="min-height: 100px"
    v-model:dataForm="dataForm"
    :compUrl="item['compUrl']"
    :primaryKey="item['primaryKey']"
    :batchName="item['batchName']"
    :initRows="item['initRows']"
    :batchUrl="item['batchUrl']"
    :title="item['title']"
    :size="size"
    @addRow="addRow"
    @removeRow="removeRow"
    v-if="!item['disVisible']"
    :helpMsg="item['helpMsg']"
    :staticColumn="item.staticColumn ?? 'Y'"
    :downloadTemplateUrl="item['downloadTemplateUrl']"
    :importInfo="item['importInfo']"
    :defaultValues="batchFieldDefaultValues(item, dataForm)"
    ref="currentTableRef"
    :fieldList="item['fieldList']"
    :source="source"
    :rules="item['rules'] || rules"
  />
</template>
<style lang="scss" scoped></style>
