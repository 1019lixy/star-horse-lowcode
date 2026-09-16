<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-progress
      v-bind="prepsFilter(field.preps)"
      :percentage="computedPercentage"
      :status="field.preps?.status"
      :stroke-width="field.preps?.strokeWidth || 6"
      :text-inside="field.preps?.textInside"
      :color="field.preps?.color"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {
  allAction,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { ItemPreps } from "@/components/types/ItemPreps";
import { computed } from "vue";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["userAction", "selectItem"]);
const formData = defineModel("formData");

const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};

const computedPercentage = computed(() => {
  const val = formData.value?.[props.field.fieldName];
  if (val === undefined || val === null || val === "") {
    return props.field.preps?.percentage ?? 0;
  }
  const num = Number(val);
  return isNaN(num) ? 0 : Math.min(100, Math.max(0, num));
});
</script>
<style lang="scss" scoped></style>
