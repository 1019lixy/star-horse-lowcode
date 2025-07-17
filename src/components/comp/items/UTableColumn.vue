<script setup lang="ts">
import { Config } from '@/api/settings';
import { batchFieldDefaultValues } from '@/api/star_horse_utils';
import { PropType } from 'vue';
import { compKey } from "@/api/system";

defineProps({
  item: { type: Object as PropType<any>, required: true },
  rules: { type: Object },
  staticColumn: { type: String, default: 'Y' },
  size: { type: String, default: Config.compSize },
  batchName: { type: String, default: 'batchDataList' },
  primaryKey: { type: [String, Object] as PropType<string | any> },
  source: { type: Number, default: 1 },
});
const _compKey = compKey;
const exclusionFields: string[] = ['divider', 'button', 'usercomp'];
</script>

<template>
  <el-table-column :prop="item.fieldName" :label="item.label" sortable
    :min-width="item.minWidth || Config.defaultColumnWidth + 'px'"
    v-if="item.formVisible && !exclusionFields.includes(item.type)">
    <template #default="scope">
      <template v-if="item.batchFieldList?.length > 0">
        <star-horse-form-list v-for="(sitem) in item.batchFieldList" :key="_compKey(sitem, sitem.batchName)"
          style="min-height: 100px; width: 100% !important" v-model:dataForm="scope.row" :compUrl="sitem['compUrl']"
          :primaryKey="sitem['primaryKey']" :batchName="sitem['batchName']" :initRows="sitem['initRows']"
          :subFlag="true" :size="size" :source="source" :defaultValues="batchFieldDefaultValues(sitem, scope.row)"
          :field-list="sitem['fieldList']" :rules="sitem['rules'] || rules" />
      </template>
      <template v-else>
        <sh-table-list-column :primaryKey="primaryKey" :batchName="batchName" :dataForm="scope.row" :size="size"
          :source="source" :rules="rules" :staticColumn="staticColumn" :item="item" :index="scope.$index" />
      </template>
    </template>
  </el-table-column>
</template>

<style scoped lang="scss"></style>
