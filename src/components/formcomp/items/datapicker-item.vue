<script setup lang="ts">
import { onMounted, PropType, ref, watch } from "vue";
import { allAction } from "@/components/formcomp/utils/ItemRelationEventUtils";
import { StarHorseDataSelector } from "@/components/comp";

defineOptions({
  name: "DataPickerItem",
});
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
const formData = defineModel<any>("formData");
const pickerData = ref<any>([]);
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {});
watch(
  () => formData.value[props.field.fieldName],
  (val) => {
    if (val) {
      // 优化数组转换逻辑
      pickerData.value = props.field.preps?.multiple
        ? Array.isArray(val)
          ? val
          : [val]
        : val !== undefined
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
      formData.value[props.field.fieldName] = val[0];
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
    :formItem="field"
    :parentField="parentField"
  >
    <!--里面用的el-input-tag -->
    <star-horse-data-selector
      v-model="pickerData"
      v-bind="field.preps"
      @update:selectedData="(data) => itemAction('change')"
      @selectedData="(data) => itemAction('change')"
    />
  </starhorse-form-item>
</template>
<style lang="scss" scoped></style>
