<script setup lang="ts" name="ShTableListColumn">
  import { inject } from 'vue';
  import { DialogProps } from '@/components/types/DialogProps';
  import { Config } from '@/api/settings.ts';
  import { validMsg } from '@/api/form_utils.ts';
  import {PropType} from 'vue';
  defineProps({
    dataForm: { type: Object, required: true },
    index: { type: Object, required: true },
    item: { type: Object, required: true },
    staticColumn: { type: String, default: 'N' },
    primaryKey: {type: [String, Object] as PropType<string | any>},
    batchName: { type: String, default: 'batchDataList' },
    rules: { type: Object },
    size: { type: String, default: Config.compSize }
  });
  const dialogProps = inject<DialogProps>('dialogProps');
</script>
<template>
  <template v-if="staticColumn == 'Y'">
    {{ dataForm[item.fieldName] }}
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
      :isEdit="dialogProps?.ids && dialogProps?.ids != -1"
    />
  </el-form-item>
</template>
<style scoped></style>
