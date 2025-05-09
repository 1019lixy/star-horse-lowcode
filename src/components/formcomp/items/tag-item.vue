<script setup lang="ts">
import {allAction} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

const props = defineProps({
  isDesign: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  bareFlag: {
    type: Boolean,
    default: false
  }, isSearch: {
    type: Boolean,
    default: false
  },
  field: {
    type: Object,
    default: {}
  },
  parentField: {
    type: Object,
    default: {}
  },
  formInfo: {
    type: Object,
    default: {}
  },
  callBack: {
    type: Function,
  }
});
const emits = defineEmits(['selfFunc', 'selectItem']);
const formData = defineModel("formData");
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const tagType = (val: any) => {
  let tagMap = props.field?.preps?.tagMap;
  if (tagMap && Object.keys(tagMap).length > 0) {
    return tagMap[val] || 'primary';
  }
  return props.field?.preps?.tagType || 'primary';
};
</script>
<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-tag
        :type="tagType(formData[field.preps['name']])"
        :disable-transitions="field?.preps?.disableTransitions == 'Y'"
        :hit="field?.preps?.hit == 'Y'"
        :color="field?.preps?.color"
        :effect="field?.preps?.effect || 'light'"
        :round="field?.preps?.round == 'Y'"
        :size="formInfo?.size || field?.preps?.size || 'default'"
        @click="itemAction('click')"
    >
      {{
        (callBack && callBack()) ||
        formData[field.preps["name"]] ||
        field.preps["placeholder"] ||
        "请赋值" + field.preps["label"]
      }}
    </el-tag>
  </starhorse-form-item>
</template>
<style lang="scss" scoped>
</style>
