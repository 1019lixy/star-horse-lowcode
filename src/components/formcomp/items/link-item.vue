<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-link
      v-bind="prepsFilter(field.preps)"
      :disabled="checkIsDisabled(props)"
      :type="field.preps?.linkType || 'primary'"
      :underline="field.preps?.underline ?? false"
      :href="computedHref"
      :target="field.preps?.target || '_blank'"
      @click="itemAction('click')"
    >
      {{ computedText }}
    </el-link>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {
  allAction,
  checkIsDisabled,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { ItemPreps } from "@/components/types/ItemPreps";
import { computed } from "vue";

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

const computedHref = computed(() => {
  return (
    formData.value?.[props.field.fieldName] || props.field.preps?.href || ""
  );
});

const computedText = computed(() => {
  return (
    props.field.preps?.linkText ||
    formData.value?.[props.field.fieldName] ||
    props.field.preps?.href ||
    ""
  );
});
</script>
<style lang="scss" scoped></style>
