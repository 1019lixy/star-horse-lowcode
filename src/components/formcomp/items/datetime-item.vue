<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-date-picker
        :fid="field.fieldName"
        :disabled="checkIsDisabled(props)"
        v-bind="field.preps"
        :format="field.preps?.format || 'YYYY-MM-DD HH:mm:ss'"
        :value-format="field.preps?.valueFormat"
        date-format="YYYY-MM-DD"
        time-format="HH:mm"
        :type="field.type"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.fieldName]"
    ></el-date-picker>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, PropType, shallowRef} from 'vue';
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
const itemAction = (prep: any) => {
  if (prep == 'change' && props.field.preps['type']?.includes('range')) {
    let val = formData.value[props.field.fieldName];
    if (props.field.preps['needSplitName']) {
      formData.value[props.field.fieldName + 'Start'] = val[0];
      formData.value[props.field.fieldName + 'End'] = val[1];
    }
  }
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
:deep(.el-input) {
  width: unset !important;
}
</style>
