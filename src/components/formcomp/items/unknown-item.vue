<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    未知组件。。。。。。。。。。。。。。。
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { ItemPreps } from "@/components/types/ItemPreps";

withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
// const formData = defineModel("formData");
</script>
<style scoped></style>
