<script setup lang="ts">
import {PropType} from "vue";
import {allAction} from "@/components/formcomp/utils/ItemRelationEventUtils";

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
  callBack: {
    type: Function,
  },
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
    :formItem="field"
    :parentField="parentField"
  >
    <el-tag
      v-bind="field.preps"
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
