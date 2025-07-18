<template>
  <starhorse-form-item
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :formItem="field"
    :parentField="parentField"
  >
    <MdEditor
      v-model="formData[field.fieldName]"
      :theme="'light'"
      :language="'zh-CN'"
      :previewTheme="'default'"
      :codeTheme="'github'"
      v-bind="field.preps"
      class="markdown-editor"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts" name="markdown">
import { onMounted, onUpdated, PropType } from "vue";
import "md-editor-v3/lib/style.css";

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
const formData = defineModel("formData");

const init = async () => {};
onMounted(() => {
  init();
});
onUpdated(() => {
  init();
});
</script>
<style lang="scss" scoped>
.v-md-editor {
  width: 100% !important;
  min-height: 400px !important;

  :deep(.vditor-toolbar) {
    padding-left: unset !important;
  }
}
</style>
