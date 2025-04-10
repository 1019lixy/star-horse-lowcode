<template>
  <starhorse-form-item
    :isDesign="context.attrs['isDesign']"
    :bareFlag="context.attrs['bareFlag']"
    :form-item="field"
    :parentField="parentField"
  >
    <MdEditor
      v-model="context.attrs['formData'][field.preps['name']]"
      :theme="field.preps['theme'] || 'light'"
      :language="field.preps['language'] || 'zh-CN'"
      :previewTheme="field.preps['previewTheme'] || 'default'"
      :codeTheme="field.preps['codeTheme'] || 'github'"
      :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label']"
      class="markdown-editor"
    />
  </starhorse-form-item>
</template>
<script lang="ts" name="markdown">
  import { defineComponent, onMounted, onUpdated, ref, shallowRef } from "vue";
  import { allAction } from "@/components/formcomp/utils/ItemRelationEventUtils.ts";
  import { MdEditor } from "md-editor-v3";
  import "md-editor-v3/lib/style.css";

  export default defineComponent({
    components: { MdEditor },
    setup(_props, context) {
      const parentField = context.attrs["parentField"];

      const field = context.attrs["field"] as any;
      let formItem = shallowRef({ label: "input", required: false });
      let dataField = shallowRef("");
      let defaultLeftToolBar = shallowRef<string>(
        "undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code"
      );
      let defaultRightToolBar = shallowRef<string>("preview toc sync-scroll fullscreen");
      let markdownEditor = ref();
      const itemAction = () => {
        allAction(context, "change");
      };
      const init = async () => {};
      onMounted(() => {
        init();
      });
      onUpdated(() => {
        init();
      });
      return {
        parentField,
        context,
        field,
        formItem,
        dataField,
        markdownEditor,
        itemAction,
        defaultLeftToolBar,
        defaultRightToolBar
      };
    }
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
