<script setup lang="ts" name="StarHorseFormItem">
import {inject, ModelRef, PropType} from 'vue';
import {ApiUrls} from '@/components/types/ApiUrls';
import {DialogProps} from '@/components/types/DialogProps';
import {PageFieldInfo} from '@/components/types/PageFieldInfo';
import {Config} from '@/api/settings';

defineProps({
  compUrl: {type: Object as PropType<ApiUrls>},
  fieldList: {type: Object as PropType<PageFieldInfo|any>, required: true},
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
</script>
<template>
  <template v-for="item in fieldList.fieldList">
    <box-item
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

    <tab-item
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

    <collapse-item
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
    <card-item
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
    <dytable-item
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
    <other-item
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
