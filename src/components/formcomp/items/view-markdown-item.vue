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
      ref="markdownEditor"
      class="markdown-editor"
      v-html="markdown.render(formData[field.fieldName] || '')"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts" name="view-markdown">
import { nextTick, onMounted, onUpdated, ref } from "vue";
import MarkdownIt from "markdown-it";

import { ItemPreps } from "@/components/types/ItemPreps";
withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

let markdownEditor = ref();
let markdown = ref<InstanceType<typeof MarkdownIt> | null>(null);
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
