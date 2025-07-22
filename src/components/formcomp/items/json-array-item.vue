<template>
  <base-json-item
    :isDesign="isDesign"
    :disabled="disabled"
    :showFormItem="showFormItem"
    :field="field"
    @selectItem="itemAction"
    :formInfo="formInfo"
    v-model:formData="formData"
    @selfFunc="itemAction"
    :parentField="parentField"
    dataType="array"
  />
</template>
<script setup lang="ts">
import { onMounted, PropType, shallowRef } from "vue";
import { allAction } from "@/components/formcomp/utils/ItemRelationEventUtils";

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
let actionName = shallowRef("normal");
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};

onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  actionName.value = props.field.actionName || "normal";
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});
</script>
<style lang="scss" scoped></style>
