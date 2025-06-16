<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-tree-select
        :fid="field.fieldName"
        :disabled="checkIsDisabled(props)"
        :default-expand-all="true"
        v-bind="field.preps"
        :filter-node-method="filterNodeMethod"
        :render-content="renderContent"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.fieldName]"
    >
    </el-tree-select>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, PropType, shallowRef, watch} from 'vue';
import {compDynamicData} from '@/api/star_horse_utils';
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
  allAction(props, emits, formData, prep);
};
const filterNodeMethod = (value: any, data: any) => {
  let name: any = props.field.preps['props']?.label || 'label';
  return data[name].includes(value);
};
const renderContent = (_h: Function, data: any) => {
  let labelName = props.field.preps.props?.label || 'label';
  if (props.field.preps['showCode']) {
    let codeName = props.field.preps.props?.code || props.field.preps.props?.value || 'value';
    return `${data.data[labelName]}(${data.data['code'] || data.data[codeName] || ''})`;
  }
  return data.data[labelName];
};
/**
 * 动态获取数据
 */
const initData = async () => {
  const dataa = await compDynamicData(props.field);
  if (dataa?.length) {
    props.field.preps['data'] = dataa;
  }
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {}
  }
  props.field.preps['remote'] = props.field.preps['remote'] || props.field.preps['dataSource'] == 'url';
  props.field.preps['filterable'] = true;
  props.field.preps['collapseTags'] = true;
  props.field.preps['props'] = props.field.preps['props'] || {
    label: 'name',
    value: 'value'
  };
  initData();
  actionName.value = props.field.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});
watch(() => formData.value[props.field.fieldName + "OptionList"], (val) => {
  if (val?.length > 0) {
    props.field.preps['data'] = val;
  }
}, {
  immediate: true,
});
</script>
<style scoped></style>
