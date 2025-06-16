<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-select
        :fid="field.fieldName"
        :disabled="checkIsDisabled(props)"
        v-bind="field.preps"
        :remote-method="remoteMethod"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.fieldName]"
    >
      <el-option
          :disabled="items['disabled']"
          :label="items[field.preps?.props?.label || 'name']"
          :value="items[field.preps?.props?.value || 'value']"
          :key="items[field.preps?.props?.value || 'value']"
          v-for="items in field.preps?.values"
      />
    </el-select>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, PropType, shallowRef, watch} from 'vue';
import {compDynamicData, createFilter, dynamicUrlOperation} from '@/api/star_horse_utils';
import {SearchParams} from '@/components/types/Params';
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
let actionName = shallowRef('change');
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
/**
 * 动态获取数据
 */
const initData = async () => {
  const dataa = await compDynamicData(props.field);
  if (dataa?.length) {
    props.field.preps['values'] = dataa;
  }
};
const remoteMethod = async (queryString: string) => {
  let temp = props.field.preps;
  let dataSource = temp['dataSource'];
  if (dataSource == 'url') {
    let searchParams: SearchParams[] = [];
    searchParams.push({
      propertyName: temp['selectLabel'],
      value: queryString,
      operation: 'lk'
    });
    temp['values'] = await dynamicUrlOperation(temp, searchParams);
  } else {
    temp['values'] = queryString ? temp['values']?.filter(createFilter(queryString)) : temp['values'];
  }
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {}
  }
  props.field.preps['remote'] = props.field.preps['remote'] || props.field.preps['dataSource'] == 'url';
  props.field.preps['filterable'] = true;
  props.field.preps['collapseTags'] = true;
  initData();
  actionName.value = props.field.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, !props.field.preps['needInitLink']);
  }

});
watch(() => formData.value[props.field.fieldName + "OptionList"], (val) => {
  if (val?.length > 0) {
    props.field.preps['values'] = val;
  }
}, {
  immediate: true,
})
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
