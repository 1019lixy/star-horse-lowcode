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
        :options="areaData"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {nextTick, onMounted, shallowRef} from 'vue';
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
  allAction(props, emits, formData, prep);
};
const initData = async () => {
  await nextTick();
  props.field.preps['values'] = await compDynamicData(props.field.preps);
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
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
</style>
