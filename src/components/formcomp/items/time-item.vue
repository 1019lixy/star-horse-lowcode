<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-time-select
        :fid="field.preps['name']"
        :arrow-control="field.preps['arrowControl'] == 'Y'"
        :clearable="field.preps['clearable'] == 'Y'"
        :disabled="checkIsDisabled(props)"
        :start="field.preps['start'] || '00:00'"
        :end="field.preps['end'] || '24:00'"
        :step="field.preps['end'] || '00:05'"
        :editable="field.preps['editable'] == 'Y'"
        :end-placeholder="field.preps['endPlaceholder'] || '请选择结束' + field.preps['label']"
        :format="field.preps['format'] || 'HH:mm'"
        :value-format="field.preps['valueFormat'] || 'HH:mm'"
        :is-range="field.preps['isRange'] == 'Y'"
        :placeholder="field.preps['placeholder'] || '请选择' + field.preps['label']"
        :range-separator="field.preps['rangeSeparator']"
        :readonly="field.preps['readonly'] == 'Y'"
        :size="formInfo?.size || field?.preps['size'] || 'small'"
        :start-placeholder="field.preps['startPlaceholder'] || '请选择开始' + field.preps['label']"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.preps['name']]"
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

let actionName = shallowRef('normal');
const itemAction = (prep: string) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  actionName.value = props.field.preps?.actionName || 'normal';
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
