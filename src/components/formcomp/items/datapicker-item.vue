<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";

import { StarHorseDataSelector } from "@/components/comp";
import { ItemPreps } from "@/components/types/ItemPreps";
import { SearchParams } from "@/components/types";

defineOptions({
  name: "DataPickerItem",
});

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel<any>("formData");
const pickerData = ref<any>([]);
const preps = computed(() => {
  const temp = props.field.preps ?? {};
  let preps = { ...temp };
  if (preps.dataSource !== "url") {
    delete preps.urlOrDictName;
  } else {
    preps.dataUrl = preps.urlOrDictName;
    delete preps.urlOrDictName;
  }
  const requestParams: SearchParams[] = [];
  const queryParams = temp?.queryParams;
  queryParams?.forEach((item: any) => {
    if (!item.name && !item.propertyName) {
      return;
    }
    requestParams.push({
      propertyName: item.name ?? item.propertyName,
      value: item.value || "",
      operation: item.matchType,
    });
  });
  preps.params = requestParams;
  return preps;
});
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }

  props.field.preps["filterable"] = true;
  props.field.preps["collapseTags"] = true;
  const tempProps = props.field.preps["prop"];
  if (tempProps) {
    props.field.preps["displayName"] = tempProps.label || "name";
    props.field.preps["displayValue"] = tempProps.value || "value";
  }
  // 支持 label+code 显示模式
  if (!props.field.preps["displayMode"]) {
    props.field.preps["displayMode"] = "label";
  }
  // APP 端启用层级分类筛选
  if (props.field.preps["enableHierarchy"] === undefined) {
    props.field.preps["enableHierarchy"] = true;
  }
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
watch(
  () => formData.value[props.field.fieldName],
  (val) => {
    if (val) {
      // 优化数组转换逻辑
      pickerData.value = props.field.preps?.multiple
        ? Array.isArray(val)
          ? val
          : [val]
        : val
          ? [val]
          : [];
    }
  },
  { immediate: true, deep: true },
);
watch(
  () => pickerData.value,
  (val) => {
    if (props.field.preps?.multiple) {
      formData.value[props.field.fieldName] = val;
    } else {
      formData.value[props.field.fieldName] = Array.isArray(val) ? val[0] : val;
    }
  },
  { deep: true },
);
</script>
<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <!--里面用的el-input-tag -->
    <star-horse-data-selector
      v-model="pickerData"
      v-bind="prepsFilter(preps)"
      :disabled="checkIsDisabled(props)"
      @update:selectedData="(data) => itemAction('change')"
      @selectedData="(data) => itemAction('change')"
    />
  </starhorse-form-item>
</template>
<style lang="scss" scoped></style>
