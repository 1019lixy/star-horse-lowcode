<script setup lang="ts" name="StarHorseFormItem">
import {ModelRef, onMounted, PropType, ref} from 'vue';
import {batchFieldDefaultValues} from '@/api/star_horse_utils';
import {Config} from '@/api/settings';

defineProps({
    item: { type: Object as PropType<any>, required: true },
    rules: { type: Object },
    initRows: { type: Number, default: 0 },
    size: { type: String, default: Config.compSize }
  });
  const emits = defineEmits(['addRow', 'removeRow']);
  const dataForm: ModelRef<any> = defineModel('dataForm');
  const currentTableRef = ref();
  /**
   * 列表添加行数据
   * @param row
   */
  const addRow = (row: any) => {
    emits('addRow', row);
  };
  /**
   * 列表删除行数据
   * @param row
   */
  const removeRow = (row: any) => {
    emits('removeRow', row);
  };
  onMounted(() => {
    //console.log(dataForm);
  });
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
    v-if="Object.keys(item).includes('disVisible') ? item['disVisible'] : true"
    :helpMsg="item['helpMsg']"
    :staticColumn="item.staticData ?? 'Y'"
    :downloadTemplateUrl="item['downloadTemplateUrl']"
    :importInfo="item['importInfo']"
    :defaultValues="batchFieldDefaultValues(item,dataForm)"
    ref="currentTableRef"
    :fieldList="item['fieldList']"
    :rules="item['rules'] || rules"
  />
</template>
<style lang="scss" scoped></style>
