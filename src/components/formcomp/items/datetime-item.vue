<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :formItem="field"
    :parentField="parentField"
  >
    <el-date-picker
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      v-bind="field.preps"
      :format="field.preps?.format || 'YYYY-MM-DD HH:mm:ss'"
      :value-format="field.preps?.valueFormat"
      date-format="YYYY-MM-DD"
      time-format="HH:mm"
      v-on="getDynamicEvents(props, itemAction)"
      @change="itemAction('change')"
      v-model="formData[field.fieldName]"
    ></el-date-picker>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { onBeforeMount, onMounted, PropType, shallowRef } from "vue";
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
const disabledDate = shallowRef<any>([]);
const itemAction = (prep: any) => {
  if (prep == "change" && props.field.preps["type"]?.includes("range")) {
    let val = formData.value[props.field.fieldName];
    if (props.field.preps["needSplitName"]) {
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
  disabledDate.value = props.field.preps["disabledDate"]?.split(";") || [];
  delete props.field.preps["disabledDate"];
});
onMounted(() => {
  //后面增加判断规则
  props.field.preps["disabledDate"] = (date: Date) => {
    console.log(disabledDate.value, date.getDate());
    return disabledDate.value.includes(date.getDate().toString());
  };
  initCompCallEvent(props, emits, formData);
});
</script>
<style lang="scss" scoped>
:deep(.el-input) {
  width: unset !important;
}
</style>
