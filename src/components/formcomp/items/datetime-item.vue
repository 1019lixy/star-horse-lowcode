<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-date-picker
        :fid="field.preps['name']"
        :clear-icon="field.preps['clearIcon']"
        :clearable="field.preps['clearable'] == 'Y'"
        :default-time="field.preps['defaultTime']"
        :default-value="field.preps['defaultValue'] || new Date()"
        :disabled="checkIsDisabled(props)"
        :editable="field.preps['editable'] == 'Y'"
        :end-placeholder="field.preps['endPlaceholder'] || '请选择结束日期'"
        :format="field.preps['format'] || 'YYYY-MM-DD HH:mm:ss'"
        :value-format="field.preps['valueFormat']"
        date-format="YYYY-MM-DD"
        time-format="HH:mm"
        :type="field.preps['type']"
        :placeholder="field.preps['placeholder'] || '请选择' + field.preps['label']"
        :range-separator="field.preps['rangeSeparator']"
        :readonly="field.preps['readonly'] == 'Y'"
        :size="formInfo?.size || field?.preps['size'] || 'default'"
        :start-placeholder="field.preps['startPlaceholder'] || '请选择开始日期'"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.preps['name']]"
    ></el-date-picker>
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
const itemAction = (prep: any) => {
  if (prep == 'change' && props.field.preps['type']?.includes('range')) {
    let val = formData.value[props.field.preps['name']];
    if (props.field.preps['needSplitName'] == 'Y') {
      formData.value[props.field.preps['name'] + 'Start'] = val[0];
      formData.value[props.field.preps['name'] + 'End'] = val[1];
    }
  }
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
:deep(.el-input) {
  width: unset !important;
}
</style>
