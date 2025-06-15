<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-switch
        :fid="field.fieldName"
        :disabled="checkIsDisabled(props)"
        v-bind="field.preps"
        @change="itemAction('change')"
        v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, shallowRef} from 'vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils';

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
  }
});
const emits = defineEmits(['selfFunc', 'selectItem']);
const formData = defineModel("formData");

let actionName = shallowRef('change');
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  if(!props.field.preps){
    props.field.preps={}
  }
  props.field.preps['activeText'] = props.field.preps['activeText'] || '是';
  props.field.preps['inactiveText'] = props.field.preps['inactiveText'] || '否';
  props.field.preps['activeValue'] = props.field.preps['activeValue'] || 'Y';
  props.field.preps['inactiveValue'] = props.field.preps['inactiveValue'] || 'N';
  actionName.value = props.field.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, false);
  }
});
</script>
<style scoped></style>
