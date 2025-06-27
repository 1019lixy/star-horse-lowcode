<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-time-select
        :fid="field.fieldName"

        :disabled="checkIsDisabled(props)"
        :start="field.preps?.start || '00:00'"
        :end="field.preps?.end|| '24:00'"
        :step="field.preps?.step || '00:05'"
        v-bind="field.preps"
        v-on:[field.actionName]="itemAction(field.actionName)"
        
        
        
        v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, shallowRef, PropType} from 'vue';
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
    type: Object as PropType<any>,
    required: true
  },
  parentField: {
    type: Object as PropType<any>,
  },
  formInfo: {
    type: Object as PropType<any>,
  }
});
const emits = defineEmits(['selfFunc', 'selectItem']);
const formData = defineModel("formData");

let actionName = shallowRef('normal');
const itemAction = (prep: string) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  actionName.value = props.field.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});
</script>
<style lang="scss" scoped>
.el-time-picker,
.el-date-editor {
  width: unset;
}
</style>
