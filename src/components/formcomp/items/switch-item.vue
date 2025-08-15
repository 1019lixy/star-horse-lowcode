<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-switch
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
       v-bind="prepsFilter(field.preps)"
      v-on="getDynamicEvents(props, itemAction)"
      v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { getDynamicEvents } from "@/api/system";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,prepsFilter
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { nextTick, onMounted } from "vue";

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
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  props.field.preps["activeText"] = props.field.preps["activeText"] ?? "是";
  props.field.preps["inactiveText"] = props.field.preps["inactiveText"] ?? "否";
  props.field.preps["activeValue"] = props.field.preps["activeValue"] ?? true;
  props.field.preps["inactiveValue"] =
    props.field.preps["inactiveValue"] ?? false;
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style scoped></style>
