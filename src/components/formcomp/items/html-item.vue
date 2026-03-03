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
      :style="field.preps?.styles"
      v-html="
        field.preps?.staticData
          ? field.preps?.textContent
          : formData[field.fieldName]
      "
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { onMounted } from "vue";

import { ItemPreps } from "@/components/types/ItemPreps";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

onMounted(() => {
  formData.value[props.field.fieldName] =
    formData.value[props.field.fieldName] || props.field.preps?.content;
});
</script>
<style lang="scss" scoped>
.user_html {
  width: 100%;
  min-height: 30px;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
