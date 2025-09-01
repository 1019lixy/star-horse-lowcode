<script setup lang="ts" name="StarHorseDataView">
import { ApiUrls } from "@/components/types/ApiUrls";
import { inject, nextTick, onMounted, PropType, ref, watch } from "vue";
import { DialogProps } from "@/components/types/DialogProps";
import { formFieldMapping, isJson, loadById } from "@/api/star_horse_utils";

const dataForm = ref<any>({});
const props = defineProps({
  compUrl: { type: Object as PropType<ApiUrls> },
  objectName: { type: String },
  subFormFlag: { type: String, default: "N" },
  fieldList: { type: Object, required: true },
  globalCondition: { type: Object },
  outerData: { type: Object },
  dynamicForm: { type: Boolean, default: false },
  primaryKey: {
    type: [String, Object] as PropType<string | any>,
    default: "id",
  },
  batchFieldName: { type: String, default: "batchFieldList" },
  dataFormat: { type: Function, default: null },
});
const emits = defineEmits(["dataLoaded"]);
const dialogProps = inject<DialogProps>("dialogProps");
watch(
  () => dialogProps?.ids,
  (val) => {
    if (val == -2) {
      console.log("nothing");
    } else if (!val || val == -1) {
      dataForm.value = {};
    } else {
      loadData();
    }
  },
  {
    // immediate: true,
    deep: true,
  },
);
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
  //如果是Json 对象
  if (isJson(id)) {
    params = { ...params, ...id };
    objData = await loadById(props.compUrl?.loadByIdForViewUrl!, "", params);
  } else {
    objData = await loadById(props.compUrl?.loadByIdForViewUrl!, id, params);
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
  { immediate: true, deep: false },
);
defineExpose({
  setData,
});
</script>
<template>
  <div class="flex h-full w-full flex-col">
    <star-horse-data-view-items
      :commonFormat="dataFormat"
      :field-list="fieldList"
      v-model:data-form="dataForm"
    />
  </div>
</template>
<style lang="scss" scoped></style>
