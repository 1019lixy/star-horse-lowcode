<script setup lang="ts">
import {
  allAction,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";

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
const tagType = (val: any) => {
  let tagMap = props.field?.preps?.tagMap;
  if (tagMap && Object.keys(tagMap).length > 0) {
    return tagMap[val] || "primary";
  }
  return props.field?.preps?.tagType || "primary";
};
</script>
<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-tag
      v-bind="prepsFilter(field.preps)"
      :type="tagType(formData[field.fieldName])"
      @click="itemAction('click')"
      class="relative"
    >
      {{
        (callBack && callBack()) ||
        formData[field.fieldName] ||
        field.preps?.placeholder ||
        "请赋值" + field.label
      }}
    </el-tag>
  </starhorse-form-item>
</template>
<style lang="scss" scoped></style>
