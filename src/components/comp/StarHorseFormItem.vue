<script setup lang="ts" name="StarHorseFormItem">
import {inject, ModelRef, PropType} from 'vue';
import {ApiUrls} from '@/components/types/ApiUrls';
import {DialogProps} from '@/components/types/DialogProps';
import {PageFieldInfo} from '@/components/types/PageFieldInfo';
import {Config} from '@/api/settings';

defineProps({
  compUrl: {type: Object as PropType<ApiUrls>},
  fieldList: {type: Object as PropType<PageFieldInfo | any>, required: true},
  objectName: {type: String},
  subFormFlag: {type: String, default: 'N'},
  // 数据索引
  dataIndex: {type: Number, default: -1},
  // 父节点名称
  propPrefix: {type: String, default: ''},
  batchName: {type: String, default: 'batchDataList'},
  batchFieldName: {type: String, default: 'batchFieldList'},
  primaryKey: {type: [String, Object] as PropType<string | any>},
  compSize: {type: String, default: Config.compSize},
  rules: {type: Object},
  isView: {type: Boolean, default: false},
  isEdit: {type: Boolean, default: true},
});
const dataForm: ModelRef<any> = defineModel('dataForm');
const dialogProps = inject<DialogProps>('dialogProps', {});
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
}
</script>
<template>
  <template v-for="(item,index) in fieldList.fieldList" :key="item.fieldName||'st_h'+index">
    <component
        :Key="item.fieldName||'st_h_comp'+index"
        :is="checkItemType(item)"
        :primary-key="primaryKey"
        :item="item"
        :rules="rules"
        :batchFieldName="batchFieldName"
        :batchName="batchName"
        :compSize="compSize"
        :compUrl="compUrl"
        :subFormFlag="subFormFlag"
        :isView="isView"
        :objectName="objectName"
        :dataIndex="dataIndex"
        :propPrefix="propPrefix"
        v-model:dataForm="dataForm"
        :parentPreps="fieldList.preps"
        :isEdit="!isEdit||!dialogProps?.ids || dialogProps?.ids == -1"
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
      :isView="isView"
      :objectName="objectName"
      :dataIndex="dataIndex"
      :propPrefix="propPrefix"
      v-model:dataForm="dataForm"
      :parentPreps="fieldList.preps"
      :isEdit="!isEdit||!dialogProps?.ids || dialogProps?.ids == -1"
  />
</template>
<style lang="scss" scoped></style>
