<script setup lang="ts">
import {allAction, checkIsDisabled, prepsFilter,} from "@/components/formcomp/utils/ItemRelationEventUtils";

import {ItemPreps} from "@/components/types/ItemPreps";
import {StarHorseIcon} from "@/components/comp";
import {getDynamicEvents} from "@/api/system";

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
    return tagMap[val] || "info";
  }
  return props.field?.preps?.tagType || "info";
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
    <el-input-tag
        :disabled="checkIsDisabled(props)"
        v-bind="prepsFilter(field.preps)"
        :tagType="tagType(formData[field.fieldName])"
        v-on="getDynamicEvents(props, itemAction, formData)"
        v-model="formData[field.fieldName]"
    >
      <template #prefix>
        <star-horse-icon
            :icon-class="field.preps?.prefixIcon"
            v-if="field.preps?.prefixIcon"
        />
        <span v-if="field.preps?.prefix">{{ field.preps?.prefix }}</span>
      </template>
      <template #suffix>
        <star-horse-icon
            :icon-class="field.preps?.suffixIcon"
            v-if="field.preps?.suffixIcon"
        />
        <span v-if="field.preps?.suffix">{{ field.preps?.suffix }}</span>
      </template>
    </el-input-tag>
  </starhorse-form-item>
</template>
<style lang="scss" scoped></style>
