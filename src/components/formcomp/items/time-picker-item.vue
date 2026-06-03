<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-time-picker
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      v-bind="prepsFilter(field.preps)"
      :is-range="isRange"
      :range-separator="field.preps?.rangeSeparator || i18n('api.to')"
      :format="field.preps?.format || 'HH:mm:ss'"
      :value-format="field.preps?.valueFormat || 'HH:mm:ss'"
      v-on="getDynamicEvents(props, itemAction)"
      @change="itemAction('change')"
      v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted } from "vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";
import { i18n } from "@/lang";

import { ItemPreps } from "@/components/types/ItemPreps";
import { normalizeDateModel } from "@/api/date_utils";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

// 判断是否为范围选择：preps.isRange / preps.type 含 timerange
const isRange = computed(() => {
  if (props.field.preps?.isRange) return true;
  const subType = props.field.preps?.type || props.field.type;
  return subType === "timerange";
});

// 规范化时间值的辅助函数
function normalizeTimeValue(val: any): any {
  if (!val) return val;
  const vf = props.field.preps?.valueFormat || "HH:mm:ss";
  const subType = isRange.value ? "timerange" : "time-picker";
  return normalizeDateModel(val, subType, vf);
}

const itemAction = (prep: string) => {
  allAction(props, emits, formData, prep);
};

onBeforeMount(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }

  // 规范化初始数据：将 ISO 字符串 / 纯时间字符串转为 value-format 字符串
  const name = props.field.fieldName;
  if (formData.value?.[name] !== undefined) {
    formData.value[name] = normalizeTimeValue(formData.value[name]);
  }
});

onMounted(() => {
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style lang="scss" scoped>
.el-time-picker,
.el-date-editor {
  width: unset;
}
</style>
