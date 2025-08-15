<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <MdEditor
      v-model="formData[field.fieldName]"
      :theme="'light'"
      :language="'zh-CN'"
      :previewTheme="'default'"
      :codeTheme="'github'"
       v-bind="prepsFilter(field.preps)"
      class="markdown-editor"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts" name="markdown">
import { onMounted, onUpdated, 
 } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import {prepsFilter} from "@/components/formcomp/utils/ItemRelationEventUtils";
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
