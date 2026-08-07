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
import {nextTick, onMounted} from "vue";
import {allAction, initCompCallEvent,} from "@/components/formcomp/utils/ItemRelationEventUtils";

import {ItemPreps} from "@/components/types/ItemPreps";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};

onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style lang="scss" scoped></style>
