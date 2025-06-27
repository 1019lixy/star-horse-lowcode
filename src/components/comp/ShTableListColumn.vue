<script setup lang="ts" name="ShTableListColumn">
import {inject, PropType} from 'vue';
import {DialogProps} from '@/components/types/DialogProps';
import {Config} from '@/api/settings';
import {parseListData, validMsg} from '@/api/form_utils';
import {createDatetime} from "@/api/date_utils";

const props = defineProps({
  dataForm: {type: Object, required: true},
  index: {type: Object, required: true},
  item: {type: Object as PropType<any>, required: true},
  staticColumn: {type: String, default: 'Y'},
  primaryKey: {type: [String, Object] as PropType<string | any>},
  batchName: {type: String, default: 'batchDataList'},
  rules: {type: Object},
  size: {type: String, default: Config.compSize},
  source:{type:Number,default:1},
});
const dataFormat = (val: any) => {
  const type: string = props.item.type;
  if (val) {
    if (type == 'date' || type == 'datetime') {
      return createDatetime(val);
    }
    if (type == "switch") {
      return val === true || val == '1' || val == "Y" ? "是" : "否";
    }
    if (type == "select" || type == "radio" || type == "checkbox" || type == "cascader" || type == "tselect") {
      return parseListData(props.item, val);
    }
    return val;
  }
  return "--";
};
</script>
<template>
  <template v-if="staticColumn == 'Y'">
    {{ dataFormat(dataForm[item.fieldName]) }}
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
        :source="source"
    />
  </el-form-item>
</template>
<style scoped></style>
