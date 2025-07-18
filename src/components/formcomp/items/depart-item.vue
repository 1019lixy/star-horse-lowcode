<template>
  <starhorse-form-item
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :formItem="field"
    :parentField="parentField"
  >
    该组件未实现
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { PropType } from "vue";

defineProps({
  isDesign: {
    type: Boolean,
    default: false,
  },
  disabled: {
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
// const formData = defineModel("formData");
</script>
<style scoped></style>
