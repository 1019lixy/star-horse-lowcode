<script setup lang="ts" name="StarHorseDataViewObject">
import {ModelRef, PropType} from 'vue';
import {PageFieldInfo} from '@/components/types/PageFieldInfo';
import {commonParseCodeToName} from '@/api/star_horse_utils';

const props = defineProps({
    // compUrl: {type: Object as PropType<ApiUrls>},
    fieldList: { type: Object as PropType<PageFieldInfo>, required: true },
    objectName: { type: String },
    subFormFlag: { type: String, default: 'N' },
    batchName: { type: String, default: 'batchDataList' },
    batchFieldName: { type: String, default: 'batchFieldList' },
    primaryKey: {type: [String, Object] as PropType<string | any>},
    commonFormat: { type: Function, required: true }
  });
  const dataForm: ModelRef<any> = defineModel('dataForm');

  const itemCommonFormat = (name: string, cellValue: any, row: any) => {
    cellValue = commonParseCodeToName(name, cellValue);
    if (name == 'isDel') {
      return cellValue == 1 ? '是' : '否';
    }
    return null == props.commonFormat ? cellValue : props.commonFormat(name, cellValue, row);
  };

</script>
<template>
  <template v-for="item in fieldList.fieldList">
    <view-box-item :item="item" v-model:dataForm="dataForm" :commonFormat="itemCommonFormat" />
    <view-tab-item :item="item" v-model:dataForm="dataForm" :commonFormat="itemCommonFormat" />
    <view-card-item :item="item" v-model:dataForm="dataForm" :commonFormat="itemCommonFormat" />
    <view-collapse-item :item="item" v-model:dataForm="dataForm" :commonFormat="itemCommonFormat" />
    <view-dytable-item :item="item" v-model:dataForm="dataForm" :commonFormat="itemCommonFormat" />
    <view-other-item :item="item" v-model:dataForm="dataForm" :commonFormat="itemCommonFormat" />
  </template>
  <view-table-item
    :item="fieldList"
    :batch-field-name="batchFieldName"
    v-model:dataForm="dataForm"
    :commonFormat="itemCommonFormat"
  />
  <div class="view-footer"></div>
</template>
<style lang="scss" scoped>
  .view-footer {
    height: 30px;
  }
</style>
