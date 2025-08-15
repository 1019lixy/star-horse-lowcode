<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-slider
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      v-bind="prepsFilter(field.preps)"
      :step="field.preps?.step ?? 1"
      @change="itemAction"
      v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { ModelRef, nextTick, onMounted } from "vue";
import {
  allAction,
  checkIsDisabled,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";

import { ItemPreps } from "@/components/types/ItemPreps";
const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData: ModelRef<any> = defineModel("formData");
const itemAction = () => {
  allAction(props, emits, formData, "change");
};
onMounted(() => {
  nextTick(() => {
    allAction(props, emits, formData, "change", true);
  });
});
</script>
<style scoped></style>
