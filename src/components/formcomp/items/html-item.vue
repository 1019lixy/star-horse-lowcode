<script setup lang="ts">
import {computed, onMounted} from "vue";

import {ItemPreps} from "@/components/types/ItemPreps";
import JSON5 from "json5";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const styles = computed(() => {
  const style = props.field.preps?.styles;
  if (!style) return {};
  if (typeof style == "string") {
    return JSON5.parse(style);
  }
  return style;
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

onMounted(() => {
  formData.value[props.field.fieldName] =
      formData.value[props.field.fieldName] || props.field.preps?.content;
});
</script>
<template>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <div
        class="user_html"
        :style="styles"
        v-html="
        field.preps?.staticData
          ? field.preps?.textContent
          : formData[field.fieldName]
      "
    />
  </starhorse-form-item>
</template>
<style lang="scss" scoped></style>
