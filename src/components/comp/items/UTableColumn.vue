<script setup lang="ts">
import { Config } from "@/api/settings";
import { batchFieldDefaultValues } from "@/api/star_horse_utils";
import { computed, PropType } from "vue";
import { compKey } from "@/api/system";

const props = defineProps({
  item: { type: Object as PropType<any>, required: true },
  rules: { type: Object },
  staticColumn: { type: String, default: "Y" },
  size: { type: String, default: "default" },
  subTableName: { type: String, default: "subDataList" },
  primaryKey: { type: [String, Object] as PropType<string | any> },
  source: { type: Number, default: 1 },
  commonFormat: {
    type: Function,
    default: () => {},
  },
});
const _compKey = compKey;
const exclusionFields: string[] = ["divider", "button", "usercomp"];

const batchContainers = computed(() => {
  const item: any = props.item;
  return Array.isArray(item?.containerFields)
    ? item.containerFields.filter((c: any) => c?.containerType === "table")
    : [];
});
</script>

<template>
  <el-table-column
    :prop="item.fieldName"
    :label="item.label"
    sortable
    :min-width="item.minWidth || Config.defaultColumnWidth + 'px'"
    v-if="item.formVisible && !exclusionFields.includes(item.type)"
  >
    <template #default="scope">
      <template v-if="batchContainers.length > 0">
        <star-horse-form-list
          v-for="sitem in batchContainers"
          :key="_compKey(sitem, sitem.subTablePrimaryKey)"
          style="min-height: 100px; width: 100% !important"
          v-model:dataForm="scope.row"
          :apiEndpoints="sitem.preps?.apiEndpoints"
          :primaryKey="sitem['primaryKey']"
          :subTableName="sitem['subTableName']"
          :initRows="sitem.preps?.initRows"
          :subFlag="true"
          :size="size"
          :source="source"
          :staticColumn="sitem.staticColumn ?? 'Y'"
          :defaultValues="batchFieldDefaultValues(sitem, scope.row)"
          :field-list="sitem['fieldList']"
          :rules="sitem['rules'] || rules"
        />
      </template>
      <template v-else>
        <sh-table-list-column
          :primaryKey="primaryKey"
          :subTableName="subTableName"
          :dataForm="scope.row"
          :size="size"
          :source="source"
          :rules="rules"
          :staticColumn="staticColumn"
          :item="item"
          :index="scope.$index"
        />
      </template>
    </template>
  </el-table-column>
</template>

<style scoped lang="scss"></style>
