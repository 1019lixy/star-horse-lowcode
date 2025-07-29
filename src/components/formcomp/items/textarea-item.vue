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
    :formItem="field"
    :parentField="parentField"
  >
    <el-input
      @dblclick="maxEdit"
      :disabled="checkIsDisabled(props)"
      :fid="field.fieldName"
      v-bind="field.preps"
      type="textarea"
      v-on="getDynamicEvents(props, itemAction)"
      v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { onMounted, PropType, shallowRef } from "vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import EditDataDialog from "@/components/formcomp/utils/EditDataDialog.vue";
import { getDynamicEvents } from "@/api/system";

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
const editorDialogVisible = shallowRef(false);
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const maxEdit = () => {
  editorDialogVisible.value = true;
};
const handleContentConfirm = (newContent: string) => {
  formData.value[props.field.fieldName] = newContent;
};
onMounted(() => {
  initCompCallEvent(props, emits, formData);
});
</script>
<style scoped></style>
