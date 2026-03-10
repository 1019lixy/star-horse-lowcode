<template>
  <EditDataDialog
    v-model="editorDialogVisible"
    :disabled="checkIsDisabled(props)"
    :initial-content="formData[field.fieldName]"
    @confirm="handleContentConfirm"
  />
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-input
      @dblclick.stop="maxEdit"
      :disabled="checkIsDisabled(props)"
      :fid="field.fieldName"
      v-bind="prepsFilter(field.preps)"
      type="textarea"
      :style="field.preps?.styles"
      v-on="getDynamicEvents(props, itemAction)"
      v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { nextTick, onMounted, shallowRef } from "vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import EditDataDialog from "@/components/formcomp/utils/EditDataDialog.vue";
import { getDynamicEvents } from "@/api/system";

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
const editorDialogVisible = shallowRef(false);
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const maxEdit = () => {
  if (!props.field.preps?.readonly && !props.field.preps?.disabled && !props.field.disabled) {
    editorDialogVisible.value = true;
  }
};
const handleContentConfirm = (newContent: string) => {
  formData.value[props.field.fieldName] = newContent;
};
onMounted(() => {
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style scoped>
:deep(.el-textarea__inner) {
  height: 100% !important;
}
</style>
