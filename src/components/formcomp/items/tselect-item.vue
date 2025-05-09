<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-tree-select
        :fid="field.preps['name']"
        :readonly="field.preps['readonly'] == 'Y'"
        :show-checkbox="field.preps['showCheckbox'] == 'Y'"
        :check-strictly="field.preps['checkStrictly'] == 'Y'"
        :clearable="field.preps['clearable'] == 'Y'"
        :disabled="checkIsDisabled(props)"
        :collapse-tags="field.preps['collapseTags'] == 'Y'"
        :collapse-tags-tooltip="field.preps['collapseTagsTooltip'] == 'Y'"
        :default-first-option="field.preps['defaultFirstOption'] == 'Y'"
        :default-expand-all="true"
        :props="{
        label: field.preps['props']?.label || 'name',
        value: field.preps['props']?.value || 'value',
        children: field.preps['props']?.children || 'children',
        disabled: field.preps['props']?.disabled || 'disabled',
        isLeaf: field.preps['props']?.isLeaf || 'isLeaf',
        class: field.preps['props']?.class || 'class'
      }"
        :filterable="field.preps['filterable'] == 'Y'"
        :filter-node-method="filterNodeMethod"
        :multiple="field.preps['multiple'] == 'Y'"
        :multiple-limit="field.preps['multipleLimit']"
        :placeholder="field.preps['placeholder'] || '请选择' + (field.preps['label'] || '')"
        :size="formInfo?.size || field?.preps['size'] || 'default'"
        :data="field.preps['values'] || formData[field.preps['name'] + 'OptionList']"
        :tag-type="field.preps['tagType']"
        :render-content="renderContent"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.preps['name']]"
    >
    </el-tree-select>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, shallowRef} from 'vue';
import {dictData, loadData} from '@/api/star_horse_utils.ts';
import {error} from '@/utils/message.ts';
import {SelectOption} from '@/components/types/SearchProps';
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
  if (props.field.preps['showCode'] == 'Y') {
    let codeName = props.field.preps.props?.code || props.field.preps.props?.value || 'value';
    return `${data.data[labelName]}(${data.data['code'] || data.data[codeName] || ''})`;
  }
  return data.data[labelName];
};
/**
 * 动态获取数据
 */
const initData = async () => {
  let temp = props.field.preps;
  let dataSource = temp['dataSource'];
  let urlOrDictName = temp['urlOrDictName'];
  let queryParams = temp['queryParams'];
  if (dataSource == 'url') {
    let requestParams = [] as any;
    queryParams?.forEach((item: any) => {
      if (!item.name) {
        return;
      }
      requestParams.push({
        propertyName: item.name,
        value: item.value,
        operation: item.matchType
      });
    });
    let url = temp['preinterfaceUrl'] + temp['interfaceUrl'];
    let params = {
      url: url,
      httpMethod: temp.httpMethod || 'POST',
      dataType: temp.dataType || 'JSON',
      searchInfo: {
        fieldList: requestParams
      }
    };
    url = '/system-config/redirect/execute';
    let validResult = await loadData(url, params);
    if (validResult.error) {
      error(validResult.error);
    } else {
      let reDataList: SelectOption[] = [];
      validResult.data.forEach((item: any) => {
        reDataList.push({name: item[temp['selectLabel']], value: item[temp['selectValue']]});
      });
      props.field.preps['values'] = reDataList;
    }
  } else if (dataSource == 'dict') {
    let dicts = await dictData(urlOrDictName);
    if (Object.keys(dicts).length == 0) {
      error('数据字典可能未配置');
    } else {
      props.field.preps['values'] = dicts;
    }
  }
};
onMounted(() => {
  initData();
  actionName.value = props.field.preps?.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});
</script>
<style scoped></style>
