<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-select
        :fid="field.preps['name']"
        :readonly="field.preps['readonly'] == 'Y'"
        :automatic-dropdown="field.preps['automaticDropdown'] == 'Y'"
        :clearable="field.preps['clearable'] == 'Y'"
        :collapse-tags="field.preps['collapseTags'] == 'Y'"
        :collapse-tags-tooltip="field.preps['collapseTagsTooltip'] == 'Y'"
        :default-first-option="field.preps['defaultFirstOption'] == 'Y'"
        :disabled="checkIsDisabled(props)"
        :filterable="field.preps['filterable'] == 'Y' || field.preps['allowCreate'] == 'Y'"
        :multiple="field.preps['multiple'] == 'Y'"
        :remote="field.preps['remote'] == 'Y' || field.preps['dataSource'] == 'url'"
        :remote-show-suffix="field.preps['remoteShowSuffix'] == 'Y'"
        :remote-method="remoteMethod"
        :allow-create="field.preps['allowCreate'] == 'Y'"
        :multiple-limit="field.preps['multipleLimit']"
        :placeholder="field.preps['placeholder'] || '请选择' + field.preps['label']"
        :size="formInfo?.size || field?.preps['size'] || 'default'"
        :tag-type="field.preps['tagType']"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.preps['name']]"
    >
      <el-option
          :disabled="'Y' == items['disabled']"
          :label="items[field.preps?.props?.label || 'name']"
          :value="items[field.preps?.props?.value || 'value']"
          v-for="items in field.preps['values'] || formData[field.preps['name'] + 'OptionList']"
      />
    </el-select>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, shallowRef} from 'vue';
import {compDynamicData, createFilter, dynamicUrlOperation} from '@/api/star_horse_utils.ts';
import {SearchParams} from '@/components/types/Params';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

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
let formItem = shallowRef({label: 'input', required: false});
let dataField = shallowRef('');
let actionName = shallowRef('change');
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
/**
 * 动态获取数据
 */
const initData = async () => {
  props.field.preps['values'] = await compDynamicData(props.field.preps);
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
  initData();
  actionName.value = props.field.preps?.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, !props.field.preps['needInitLink']);
  }
});

</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
