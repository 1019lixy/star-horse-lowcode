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
import {computed, nextTick, onBeforeMount, onMounted, ref, watch} from "vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {getDynamicEvents} from "@/api/system";
import {i18n} from "@/lang";

import {ItemPreps} from "@/components/types/ItemPreps";

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

// 目标 value-format
const valueFormat = computed(() => props.field.preps?.valueFormat || "HH:mm:ss");

/**
 * 规范化 el-time-picker 的值
 * el-time-picker v-model 为 value-format 格式的字符串（默认 "HH:mm:ss"）
 * 支持：纯时间字符串、ISO 字符串、数组（范围）、JSON 字符串数组
 */
function normalizeTimePickerValue(val: any): any {
  if (!val || val === "undefined" || val === "-") return val;
  const vf = valueFormat.value;
  // 数组 → 逐项规范化（范围选择）
  if (Array.isArray(val)) {
    return val.map((v: any) => normalizeTimePickerSingle(v, vf));
  }

  // JSON 字符串数组
  if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.map((v: any) => normalizeTimePickerSingle(v, vf));
      }
    } catch { /* not JSON */
    }
  }

  return normalizeTimePickerSingle(val, vf);
}

/**
 * 规范化单个时间值 → 匹配目标 value-format
 * 支持：纯时间字符串、ISO 字符串、带时区偏移的日期时间字符串
 */
function normalizeTimePickerSingle(val: any, vf: string): any {
  if (!val || val === "undefined" || val === "-") return val;
  if (typeof val !== "string") return val;
  // 已经匹配目标格式 → 直接返回
  if (vf === "HH:mm:ss" && /^\d{1,2}:\d{2}:\d{2}$/.test(val)) return val;
  if (vf === "HH:mm" && /^\d{1,2}:\d{2}$/.test(val)) return val;

  // "HH:mm:ss" 格式但目标是 "HH:mm" → 截取
  if (vf === "HH:mm" && /^\d{1,2}:\d{2}:\d{2}$/.test(val)) return val.substring(0, 5);

  // 带时区偏移的日期时间 "1970-01-01 08:11:01+08" / "1970-01-01 08:11:01+08:00"
  const tzMatch = val.match(/^\d{4}-\d{2}-\d{2}\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (tzMatch) {
    const h = tzMatch[1];
    const m = tzMatch[2];
    const s = tzMatch[3] || "00";
    if (vf === "HH:mm") return h + ":" + m;
    return h + ":" + m + ":" + s;
  }

  // ISO 字符串 "2026-06-09T16:00:00.000Z" → 直接提取 UTC 时间部分（避免时区偏移）
  const isoMatch = val.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
  if (isoMatch) {
    const h = isoMatch[4];
    const m = isoMatch[5];
    const s = isoMatch[6];
    if (vf === "HH:mm") return h + ":" + m;
    return h + ":" + m + ":" + s;
  }

  return val;
}

const itemAction = (prep: string) => {
  allAction(props, emits, formData, prep);
};

onBeforeMount(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
});

onMounted(() => {
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
const closeWatch = ref<() => void>();
// 持久化 watch：后端数据异步到达时自动格式化，无论何时到达都能正确处理
closeWatch.value = watch(
    () => formData.value?.[props.field.fieldName],
    (val) => {
      if (props.source == 1) {
        closeWatch.value?.();
        return;
      }
      if (val != null && val !== "") {
        const name = props.field.fieldName;
        const normalized = normalizeTimePickerValue(val);
        // 幂等保护：仅当格式化结果与原值不同时写回，防止无限循环
        if (Array.isArray(normalized)) {
          if (!Array.isArray(val) || normalized.length !== val.length || normalized.some((v: any, i: number) => v !== val[i])) {
            formData.value[name] = normalized;
            closeWatch.value?.();
          }
        } else if (normalized !== val) {
          formData.value[name] = normalized;
          closeWatch.value?.();
        }
      }
    },
    {immediate: true}
);
</script>
<style lang="scss" scoped>
.el-time-picker,
.el-date-editor {
  width: unset;
}
</style>
