<script setup lang="ts">
import {ModelRef, onMounted, PropType} from 'vue';
import {ApiUrls} from '@/components/types/ApiUrls';
import {FieldInfo} from '@/components/types/PageFieldInfo';
import {checkVisible, loadProp, validMsg} from '@/api/form_utils';
import {Config} from '@/api/settings';

const props = defineProps({
  compUrl: {type: Object as PropType<ApiUrls>},
  item: {type: Object as PropType<FieldInfo | any>, required: true},
  objectName: {type: String},
  // 数据索引
  dataIndex: {type: Number, default: -1},
  // 父节点名称
  propPrefix: {type: String, default: ''},
  parentPreps: {type: Object, default: {}},
  subFormFlag: {type: String, default: 'N'},
  batchName: {type: String, default: 'batchDataList'},
  batchFieldName: {type: String, default: 'batchFieldList'},
  primaryKey: {type: [String, Object] as PropType<string | any>},
  rules: {type: Object},
  compSize: {type: String, default: Config.compSize},
  source:{type:Number,default:1},
});
const dataForm: ModelRef<any> = defineModel('dataForm');
const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.type == 'usercomp' || item.type == 'button'">
    <star-horse-item
        v-if="checkVisible(item,dataForm)"
        :primaryKey="primaryKey"
        v-model:dataForm="dataForm"
        :item="item"
        :dataIndex="dataIndex"
        :bareFlag="true"
        :compSize="compSize"
        :source="source"
    />
  </template>
  <el-form-item
      :size="compSize"
      :label="item.preps?.hideLabel  ? '' : item.label"
      :required="item.required"
      :rules="validMsg(item, dataForm)"
      :prop="loadProp(propPrefix,item.fieldName,-1,-1)"
      :label-position="parentPreps?.labelPosition"
      v-else-if="checkVisible(item,dataForm)"
  >
    <star-horse-item
        :primaryKey="primaryKey"
        :compSize="compSize"
        v-model:dataForm="dataForm"
        :item="item"
        :dataIndex="dataIndex"
        :source="source"
    />
  </el-form-item>
</template>

<style scoped lang="scss"></style>
