<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-autocomplete
        :fid="field.preps['name']"
        :clearable="field.preps['clearable'] == 'Y'"
        :disabled="checkIsDisabled(props)"
        :readonly="field.preps['readonly'] == 'Y'"
        :fetch-suggestions="querySearch"
        :fit-input-width="field.preps['fitInputWidth'] == 'Y'"
        :aria-label="field.preps['label']"
        :hide-loading="false"
        :size="formInfo?.size || field?.preps['size'] || 'default'"
        :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label']"
        :placement="field.preps['placement'] || 'bottom-start'"
        :teleported="field.preps['teleported'] == 'Y'"
        :trigger-on-focus="field.preps['triggerOnFocus'] == 'Y'"
        :value-key="field.preps['valueKey'] || 'value'"
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
/**
 * 动态获取数据
 */
const initData = async () => {
  props.field.preps['values'] = await compDynamicData(props.field.preps);
};
onMounted(() => {
  initData();
  actionName.value = props.field.preps?.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});
const querySearch = async (queryString: string, cb: (arg: any) => void) => {
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
    cb(temp['values']);
  } else {
    const results = queryString ? temp['values'].filter(createFilter(queryString)) : temp['values'];
    cb(results);
  }
};

</script>
<style scoped></style>
