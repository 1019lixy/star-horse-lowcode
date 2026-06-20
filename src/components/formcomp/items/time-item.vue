<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-time-select
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      :start="field.preps?.start || '00:00'"
      :end="field.preps?.end || '24:00'"
      :step="field.preps?.step || '00:05'"
      v-bind="prepsFilter(field.preps)"
      v-on="getDynamicEvents(props, itemAction,formData)"
      @change="itemAction('change')"
      v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from "vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";

import { ItemPreps } from "@/components/types/ItemPreps";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const itemAction = (prep: string) => {
  allAction(props, emits, formData, prep);
};

/**
 * 规范化 el-time-select 的值
 * el-time-select v-model 为 "HH:mm" 格式字符串
 * 后端可能返回：纯时间字符串、ISO 字符串、带时区偏移的日期时间字符串
 */
function normalizeTimeSelectValue(val: any): any {
  if (!val || typeof val !== "string") return val;

  // 已是 "HH:mm" 格式 → 直接返回
  if (/^\d{1,2}:\d{2}$/.test(val)) return val;

  // "HH:mm:ss" 格式 → 截取前5位
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(val)) return val.substring(0, 5);

  // 带时区偏移的日期时间 "1970-01-01 08:11:01+08" → 提取时间部分
  const tzMatch = val.match(/^\d{4}-\d{2}-\d{2}\s+(\d{1,2}):(\d{2})/);
  if (tzMatch) {
    return tzMatch[1] + ":" + tzMatch[2];
  }

  // ISO 字符串 "2026-06-09T16:00:00.000Z" → 提取时间部分
  const isoMatch = val.match(/T(\d{2}):(\d{2})/);
  if (isoMatch) {
    return isoMatch[1] + ":" + isoMatch[2];
  }

  return val;
}

onMounted(() => {
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
const closeWatch = ref<()=>void>();
// 持久化 watch：后端数据异步到达时自动格式化，无论何时到达都能正确处理
closeWatch.value =watch(
  () => formData.value?.[props.field.fieldName],
  (val) => {
    if(props.source == 1){
      closeWatch.value?.();
      return;
    }
    if (val != null && val !== "") {
      const name = props.field.fieldName;
      const normalized = normalizeTimeSelectValue(val);
      // time-select 值始终为字符串，直接比较即可
      if (normalized !== val) {
        formData.value[name] = normalized;
        closeWatch.value?.();
      }
    }
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.el-time-picker,
.el-date-editor {
  width: unset;
}
</style>
