<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-rate
      :fid="field.fieldName"
      v-bind="prepsFilter(field.preps)"
      :disabled="checkIsDisabled(props)"
      @change="itemAction"
      v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { nextTick, onMounted } from "vue";
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
const emits = defineEmits(["userAction", "selectItem"]);
const formData = defineModel("formData");

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
