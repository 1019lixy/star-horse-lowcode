<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <MdEditor
        v-model="formData[field.preps['name']]"
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
import {onMounted, onUpdated} from 'vue';
import {allAction} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';
import 'md-editor-v3/lib/style.css';

const props = defineProps({
  isDesign: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  bareFlag: {
    type: Boolean,
    default: false
  }, isSearch: {
    type: Boolean,
    default: false
  },
  field: {
    type: Object,
    default: {}
  },
  parentField: {
    type: Object,
    default: {}
  },
  formInfo: {
    type: Object,
    default: {}
  }
});
const emits = defineEmits(['selfFunc', 'selectItem']);
const formData = defineModel("formData");

const itemAction = () => {
  allAction(props, emits, formData, 'change');
};
const init = async () => {
};
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
