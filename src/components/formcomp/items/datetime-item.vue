<template>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <el-date-picker
        :fid="field.fieldName"
        :disabled="checkIsDisabled(props)"
        v-bind="prepsFilter(field.preps)"
        :type="effectiveType"
        :format="field.preps?.format || displayFormat"
        :value-format="field.preps?.valueFormat || valueFormat"
        v-on="getDynamicEvents(props, itemAction)"
        @change="itemAction('change')"
        v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {computed, nextTick, onBeforeMount, onMounted, shallowRef} from "vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {getDynamicEvents} from "@/api/system";

import {ItemPreps} from "@/components/types/ItemPreps";
import {
  getDateValueFormat,
  getDateDisplayFormat,
  normalizeDateModel,
} from "@/api/date_utils";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const disabledDate = shallowRef<any>([]);

// 确定子类型：preps.type > field.type > "datetime"
const effectiveType = computed(() => {
  return props.field.preps?.type || props.field.type || "datetime";
});

// 根据 subType 推导 value-format 和 display format
const valueFormat = computed(() => getDateValueFormat(effectiveType.value));
const displayFormat = computed(() => getDateDisplayFormat(effectiveType.value));

const itemAction = (prep: any) => {
  if (prep == "change" && effectiveType.value?.includes("range")) {
    let val = formData.value[props.field.fieldName];
    if (props.field.preps?.needSplitName) {
      formData.value[props.field.fieldName + "Start"] = val[0];
      formData.value[props.field.fieldName + "End"] = val[1];
    }
  }
  allAction(props, emits, formData, prep);
};
onBeforeMount(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  // 设置 preps.type，兼容旧逻辑
  props.field.preps["type"] = effectiveType.value;

  // 规范化初始数据：将 ISO 字符串等转为 value-format 字符串
  const name = props.field.fieldName;
  if (formData.value?.[name] !== undefined) {
    const vf = props.field.preps?.valueFormat || valueFormat.value;
    formData.value[name] = normalizeDateModel(
        formData.value[name],
        effectiveType.value,
        vf,
    );
  }

  const disableDate = props.field.preps?.disableDate;
  if (typeof disableDate === "function") {
    disabledDate.value = disableDate() || [];
  } else if (typeof disableDate == "string") {
    disabledDate.value = disableDate.split(";") || [];
  }
  delete props.field.preps?.disabledDate;
});
onMounted(() => {
  //后面增加判断规则
  props.field.preps["disabledDate"] = (date: Date) => {
    return disabledDate.value.includes(date.getDate().toString());
  };
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style lang="scss" scoped>
:deep(.el-input) {
  width: unset !important;
}
</style>
