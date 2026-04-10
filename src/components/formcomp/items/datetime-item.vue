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
        :format="field.preps?.format || 'YYYY-MM-DD HH:mm:ss'"
        :value-format="field.preps?.valueFormat"
        date-format="YYYY-MM-DD"
        time-format="HH:mm"
        v-on="getDynamicEvents(props, itemAction)"
        @change="itemAction('change')"
        v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {nextTick, onBeforeMount, onMounted, shallowRef} from "vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {getDynamicEvents} from "@/api/system";

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
const disabledDate = shallowRef<any>([]);
const itemAction = (prep: any) => {
  if (prep == "change" && props.field.preps?.type?.includes("range")) {
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
  props.field.preps["type"] =
      props.field.preps["type"] || props.field.type || "date";
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
