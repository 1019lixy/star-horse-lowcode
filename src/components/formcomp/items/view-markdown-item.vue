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
      ref="markdownEditor"
      class="markdown-editor"
      v-html="markdown.render(formData[field.fieldName] || '')"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts" name="view-markdown">
import { nextTick, onMounted, onUpdated, ref, PropType } from "vue";
import MarkdownIt from "markdown-it";

defineProps({
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

let markdownEditor = ref();
let markdown = ref<MarkdownIt>(null);
const init = async () => {
  await nextTick(() => {
    if (!markdown.value && markdownEditor.value) {
      markdown.value = new MarkdownIt(markdownEditor.value, {});
    }
  });
};
onMounted(() => {
  init();
});
onUpdated(() => {
  init();
});
</script>
<style lang="scss" scoped>
.markdown-editor {
  width: 100% !important;
  min-height: 400px !important;
}
</style>
