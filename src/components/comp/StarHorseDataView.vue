<script setup lang="ts" name="StarHorseDataView">
import {ApiUrls} from "@/components/types/ApiUrls";
import {inject, nextTick, onMounted, PropType, ref, watch} from "vue";
import {DialogProps} from "@/components/types/DialogProps";
import {formFieldMapping, isJson} from "@/api/star_horse_utils";
import {loadById} from "@/api/star_horse_apis";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";

const dataForm = ref<any>({});
const props = defineProps({
  compUrl: {type: Object as PropType<ApiUrls>},
  objectName: {type: String},
  subFormFlag: {type: String, default: "N"},
  formSize: {type: String, default: "default"},
  labelPosition: {type: String, default: "left"},
  batchName: {type: String, default: "batchDataList"},
  batchFieldName: {type: String, default: "batchFieldList"},
  fieldList: {type: Object, required: true},
  globalCondition: {type: Object},
  outerData: {type: Object},
  dynamicForm: {type: Boolean, default: false},
  primaryKey: {
    type: [String, Object] as PropType<string | any>,
    default: "id",
  },
  dataFormat: {type: Function, default: null},
  //是不是要用查看视图的接口
  useViewUrl: {type: Boolean, default: false},
  slotType: {type: String, default: "normal"},
});
const emits = defineEmits(["dataLoaded"]);
const dialogProps = inject<DialogProps>("dialogProps");
const source = ref<number>(3);

onMounted(() => {
  if (dialogProps?.ids) {
    loadData();
  }
});
const loadData = async () => {
  await nextTick();
  let id = Array.isArray(dialogProps?.ids)
      ? dialogProps.ids[0]
      : dialogProps?.ids;
  if (!props.compUrl) {
    return;
  }
  let objData;
  let params = props.globalCondition || {};
  const url = props.useViewUrl ? props.compUrl?.loadByIdForViewUrl : props.compUrl?.loadByIdUrl;
  //如果是Json 对象
  if (isJson(id)) {
    params = {...params, ...id};
    objData = await loadById(url, "", params);
  } else {
    objData = await loadById(url, id, params);
  }
  let data = formFieldMapping(props.fieldList);
  dataForm.value = objData;
  //如果是动态表单
  if (props.dynamicForm) {
    for (let i in params) {
      let temp = params[i];
      if (!temp.subTabFlag) {
        dataForm.value[temp.tableName] = [objData];
      }
    }
  }
  let mapping = data.mappingFields;
  if (mapping) {
    for (let index in mapping) {
      let temp = mapping[index];
      dataForm.value[temp.name] = dataForm.value[temp.alias];
    }
  }
  await nextTick(() => {
    emits("dataLoaded", objData, true);
  });
};
const setData = (data: any) => {
  dataForm.value = data;
};
//更新外面传进来的数据
watch(
    () => props.outerData,
    (val: any) => {
      if (val) {
        Object.assign(dataForm.value, val);
      }
    },
    {immediate: true, deep: false},
);
watch(
    () => dialogProps?.ids,
    (val) => {
      if (val != -2) {
        if (!val || val == -1) {
          dataForm.value = {};
        } else {
          source.value = 3;
          loadData();
        }
      }
    },
    {
      // immediate: true,
      deep: true,
    },
);
defineExpose({
  setData,
});
</script>
<template>

  <el-scrollbar height="100%">
    <el-form
        :model="dataForm"
        :size="formSize"
        :scroll-to-error="true"
        :scroll-into-view-options="true"
        :inline-message="false"
        :status-icon="true"
        :label-position="labelPosition"
        require-asterisk-position="right"
        label-width="auto"
        class="data-form"
        ref="starHorseFormRef"
        v-if="slotType!='user'"
    >
      <star-horse-form-item
          :primaryKey="primaryKey"
          :compUrl="compUrl"
          :fieldList="fieldList"
          :compSize="formSize"
          v-model:dataForm="dataForm"
          :source="source"
          :batchName="batchName"
          :commonFormat="dataFormat"
          :batchFieldName="batchFieldName"
      />
      <slot name="ext" :dataForm="dataForm"></slot>
    </el-form>
    <slot name="user" :dataForm="dataForm"></slot>
  </el-scrollbar>
</template>
<style lang="scss" scoped></style>
