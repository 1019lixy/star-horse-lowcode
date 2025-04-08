<script setup lang="ts">
import {onMounted, PropType} from "vue";
import {ApiUrls} from "@/components/types/ApiUrls";
import {FieldInfo} from "@/components/types/PageFieldInfo";
import {checkVisible, loadProp, validMsg} from "@/api/form_utils.ts";
import {ModelRef} from "vue";
import {Config} from "@/api/settings.ts";

const props = defineProps({
  compUrl: {type: Object as PropType<ApiUrls>},
  item: {type: Object as PropType<FieldInfo|any>, required: true},
  objectName: {type: String},
  // 数据索引
  dataIndex: {type: Number, default: -1},
  // 父节点名称
  propPrefix: { type: String,default:"" },
  parentPreps: {type: Object, default: {}},
  subFormFlag: {type: String, default: "N"},
  batchName: {type: String, default: "batchDataList"},
  batchFieldName: {type: String, default: "batchFieldList"},
  primaryKey: {type: [String, Object] as PropType<string | any>,required:true},
  rules: {type: Object},
  compSize: {type: String, default: Config.compSize},
  isView: {type: Boolean, default: false},
  isEdit: {type: Boolean, default: false}
});
const dataForm: ModelRef<any> = defineModel("dataForm");
const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <star-horse-item
      v-if="item.type == 'comp' || item.type == 'button'"
      :primaryKey="primaryKey"
      v-model:dataForm="dataForm"
      :item="item"
      :dataIndex="dataIndex"
      :bareFlag="true"
      :compSize="compSize"
      :isEdit="isEdit"
  />

  <el-form-item
      :size="compSize"
      :label="item.preps?.hideLabel == 'Y' ? '' : item.label"
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
        :isEdit="isEdit"
    />
  </el-form-item>
</template>

<style scoped lang="scss"></style>
