<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :formItem="field"
    :parentField="parentField"
  >
    <el-cascader
      :fid="field.fieldName"
      v-bind="field.preps"
      :disabled="checkIsDisabled(props)"
      v-on="getDynamicEvents(props, itemAction)"
      v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {nextTick, onMounted, PropType, watch} from "vue";
import {compDynamicData, isJson} from "@/api/star_horse_utils";
import {allAction, checkIsDisabled, initCompCallEvent,} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {getDynamicEvents} from "@/api/system";

const props = defineProps({
  isDesign: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showFormItem: {
    type: Boolean,
    default: false,
  },
  bareFlag: {
    type: Boolean,
    default: false,
  },
  isSearch: {
    type: Boolean,
    default: false,
  },
  field: {
    type: Object as PropType<any>,
    required: true,
  },
  parentField: {
    type: Object as PropType<any>,
  },
  formInfo: {
    type: Object as PropType<any>,
  },
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const initData = async () => {
  await nextTick();
  const dataa = await compDynamicData(props.field);
  if (dataa?.length) {
    props.field.preps["options"] = dataa;
  }
  let data: any = formData.value[props.field.fieldName];
  if (isJson(data)) {
    formData.value[props.field.fieldName] = JSON.parse(data);
  } else {
    //解决加载慢问题，导致数据没法回显
    setTimeout(() => {
      let data: any = formData.value[props.field.fieldName];
      formData.value[props.field.fieldName] = isJson(data)
        ? JSON.parse(data)
        : [];
    }, 200);
  }
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  props.field.preps["props"] = {
    label: "name",
    multiple: props.field?.multiple,
    checkStrictly: true,
  };
  initData();
  initCompCallEvent(props,emits,formData);
});
watch(
  () => formData.value[props.field.fieldName + "OptionList"],
  (val) => {
    if (val?.length > 0) {
      props.field.preps["options"] = val;
    }
  },
  {
    immediate: true,
  },
);
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
</style>
