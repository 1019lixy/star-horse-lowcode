<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <div
        ref="markdownEditor"
        class="markdown-editor"
        v-html="markdown.render(context.attrs['formData'][field.preps['name']] || '')"
    />
  </starhorse-form-item>
</template>
<script lang="ts" name="view-markdown">
import {defineComponent, onMounted, shallowRef, ref, nextTick, onUpdated} from "vue";
import MarkdownIt from "markdown-it";
import {checkIsDisabled} from "@/components/formcomp/utils/ItemRelationEventUtils.ts";

export default defineComponent({
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs["parentField"];

    const field = context.attrs["field"] as any;
    let formItem = shallowRef({label: "input", required: false});
    let dataField = shallowRef("");
    let markdownEditor = ref();
    let markdown = ref<MarkdownIt>(null);
    const itemAction = () => {
      context.emit("selfFunc");
    };
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
    return {parentField, context, field, formItem, dataField, markdown, markdownEditor, itemAction};
  }
});
</script>
<style lang="scss" scoped>
.markdown-editor {
  width: 100% !important;
  min-height: 400px !important;
}
</style>
