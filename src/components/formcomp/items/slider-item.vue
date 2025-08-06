<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :formItem="field"
    :parentField="parentField"
  >
    <el-slider
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      v-bind="field.preps"
      :step="field.preps?.step ?? 1"
      @change="itemAction"
      v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {ModelRef, nextTick, onMounted, PropType} from "vue";
import {
  allAction,
  checkIsDisabled,
} from "@/components/formcomp/utils/ItemRelationEventUtils";

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
const formData: ModelRef<any> = defineModel("formData");
const itemAction = () => {
  allAction(props, emits, formData, "change");
};
onMounted(() => {
  nextTick(() => {
    allAction(props, emits, formData, "change", true);
  });
});
</script>
<style scoped></style>
