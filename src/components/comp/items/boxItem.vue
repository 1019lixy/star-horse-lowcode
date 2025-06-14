<script setup lang="ts">
import {onMounted, PropType} from 'vue';
import {ApiUrls} from '@/components/types/ApiUrls';
import {FieldInfo} from '@/components/types/PageFieldInfo';
import {checkVisible, loadProp, validMsg} from '@/api/form_utils';
import {Config} from '@/api/settings';

const props = defineProps({
  compUrl: {type: Object as PropType<ApiUrls>},
  item: {type: Array as PropType<any>, required: true},
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
  isView: {type: Boolean, default: false},
  isEdit: {type: Boolean, default: false}
});
const dataForm = defineModel('dataForm');

const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <el-row v-if="Array.isArray(item)" :gutter="10">
    <template v-for="(sitem,index) in item" :key="sitem.fieldName||index">
      <el-col
          :span="sitem.colspan || sitem.preps?.colspan || 24 / item.length"
          v-if="sitem.type != 'button' && sitem.type != 'usercomp'"
      >
        <el-form-item
            :size="compSize"
            :label="sitem.preps?.hideLabel == 'Y' ? '' : sitem.label"
            :required="sitem.required"
            :prop="loadProp(propPrefix,sitem.fieldName,-1,-1)"
            :labelPosition="parentPreps?.labelPosition"
            :rules="validMsg(sitem, dataForm)"
            v-if="(sitem.formVisible && sitem.label && sitem.preps?.headerFlag != 'Y')||checkVisible(sitem,dataForm)"
        >
          <star-horse-item
              :primaryKey="primaryKey"
              :compSize="compSize"
              v-model:dataForm="dataForm"
              :item="sitem"
              :dataIndex="dataIndex"
              :isEdit="isEdit"
          />
        </el-form-item>
        <star-horse-item
            v-else-if="sitem.viewVisible||checkVisible(sitem,dataForm)"
            :compSize="compSize"
            :primaryKey="primaryKey"
            v-model:dataForm="dataForm"
            :item="sitem"
            :dataIndex="dataIndex"
            :isEdit="isEdit"
        />
      </el-col>
      <el-col :span="sitem.colspan || sitem.preps?.colspan || 24 / item.length" v-else>
        <star-horse-item
            :primaryKey="primaryKey"
            :compSize="compSize"
            v-model:dataForm="dataForm"
            :item="sitem"
            :dataIndex="dataIndex"
            :isEdit="isEdit"
        />
      </el-col>
    </template>
  </el-row>
</template>

<style scoped lang="scss"></style>
