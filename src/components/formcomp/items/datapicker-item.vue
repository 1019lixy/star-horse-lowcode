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
const emits = defineEmits(["userAction", "selectItem"]);
const formData = defineModel<any>("formData");
const pickerData = ref<any>([]);
const preps = computed(() => {
  const temp = props.field.preps ?? {};
  let preps = { ...temp };
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
  // 兼容 apiDataSource 嵌套结构：映射 optionField → displayName/displayValue
  // 旧扁平结构（displayName/displayValue 或 prop.label/prop.value）不受影响
  const apiDs = temp?.apiDataSource;
  if (apiDs?.optionField) {
    const of = apiDs.optionField;
    if (of.labelField || of.displayField) {
      preps.displayName = of.labelField || of.displayField;
    }
    if (of.valueField) {
      preps.displayValue = of.valueField;
    }
  }
  return preps;
});
// 独立透传 apiDataSource（prepsFilter 会删除对象类型属性，故不走 v-bind）
const apiDataSource = computed(() => props.field.preps?.apiDataSource);
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
      :api-data-source="apiDataSource"
      :disabled="checkIsDisabled(props)"
      @update:selectedData="(data) => itemAction('change')"
      @selectedData="(data) => itemAction('change')"
    />
  </starhorse-form-item>
</template>
<style lang="scss" scoped></style>
