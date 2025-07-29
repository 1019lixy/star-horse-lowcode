<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :formItem="field"
    :parentField="parentField"
  >
    <el-autocomplete
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      :fetch-suggestions="querySearch"
      v-bind="field.preps"
      v-on="getDynamicEvents(props, itemAction)"
      v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { onMounted, PropType, watch } from "vue";
import {
  compDynamicData,
  createFilter,
  dynamicUrlOperation,
} from "@/api/star_horse_utils";
import { SearchParams } from "@/components/types/Params";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";

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
/**
 * 动态获取数据
 */
const initData = async () => {
  const data = await compDynamicData(props.field);
  if (data?.length) {
    props.field.preps["values"] = data;
  }
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  initData();
  initCompCallEvent(props, emits, formData);
});
const querySearch = async (queryString: string, cb: (arg: any) => void) => {
  let temp = props.field.preps;
  let dataSource = temp["dataSource"];
  if (dataSource == "url") {
    let searchParams: SearchParams[] = [];
    searchParams.push({
      propertyName: temp["selectLabel"],
      value: queryString,
      operation: "lk",
    });
    temp["values"] = await dynamicUrlOperation(temp, searchParams);
    cb(temp["values"]);
  } else {
    const results = queryString
      ? temp["values"].filter(createFilter(queryString))
      : temp["values"];
    cb(results);
  }
};
watch(
  () => formData.value[props.field.fieldName + "OptionList"],
  (val) => {
    if (val?.length > 0) {
      props.field.preps["data"] = val;
    }
  },
  { immediate: true },
);
</script>
<style scoped></style>
