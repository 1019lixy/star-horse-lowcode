<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :formItem="field"
    :parentField="parentField"
  >
    <div
      class="user_html"
      v-html="formData[field.fieldName] || field.preps?.content"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { onMounted, PropType } from "vue";

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
}
</style>
