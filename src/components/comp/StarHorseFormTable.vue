<script setup lang="ts" name="StarHorseFormItem">
import {batchFieldDefaultValues} from "@/api/star_horse_utils";
import {ModelRef, ref} from "vue";
import StarHorseFormList from "@/components/comp/StarHorseFormList.vue";

withDefaults(defineProps<{
  item: any,
  rules?: any,
  initRows?: number,
  size?: string,
  source?: number,
  enableSubNode?: boolean,
  commonFormat?: Function,
  dialogType?:"dialog"|"drawer"
}>(), {
  initRows: 0,
  size: "default",
  source: 1,
  enableSubNode: false,
  commonFormat: () => {
  },
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
      :title="item['title']"
      :size="size"
      :dialogType="dialogType"
      :enableSubNode="enableSubNode"
      :commonFormat="commonFormat"
      @addRow="addRow"
      @removeRow="removeRow"
      v-if="!item['disVisible']"
      :helpMsg="item['helpMsg']"
      :staticColumn="item.staticColumn ?? 'Y'"
      :importInfo="item['importInfo']"
      :defaultValues="batchFieldDefaultValues(item, dataForm)"
      ref="currentTableRef"
      :fieldList="item['fieldList']"
      :source="source"
      :rules="item['rules'] || rules"
  />
</template>
<style lang="scss" scoped></style>
