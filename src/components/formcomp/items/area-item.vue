<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-cascader
        :fid="field.fieldName"
        v-bind="field.preps"
        :disabled="checkIsDisabled(props)"
        v-on:[field.actionName]="itemAction(field.actionName)"
        
        
        
        v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {nextTick, onMounted, PropType, shallowRef, watch} from 'vue';
import {compDynamicData} from '@/api/star_horse_utils';
import areaData from '@/api/pcas-code.json';
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
const initData = async () => {
  if (!props.field.preps) {
    props.field.preps = {}
  }
  if (props.field.preps.user) {
    const data = await compDynamicData(props.field);
    if (data?.length) {
      props.field.preps['options'] = data;
    }
  } else {
    props.field.preps['props'] = {
      label: 'name',
      value:"code"
    };
    props.field.preps['options'] = areaData;
  }

  await nextTick();
  let data: any = formData.value[props.field.fieldName];
  if (data) {
    formData.value[props.field.fieldName] = JSON.parse(data);
  } else {
    //解决加载慢问题，导致数据没法回显
    setTimeout(() => {
      let data: any = formData.value[props.field.fieldName];
      formData.value[props.field.fieldName] = data ? JSON.parse(data) : [];
    }, 200);
  }
};
onMounted(() => {
  initData();
  actionName.value = props.field.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});
watch(() => formData.value[props.field.fieldName + "OptionList"], (val) => {
  if (val?.length > 0) {
    props.field.preps['options'] = val;
  }
}, {
  immediate: true,
});
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
</style>
