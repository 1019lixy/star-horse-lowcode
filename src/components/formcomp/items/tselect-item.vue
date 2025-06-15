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
import {onMounted, shallowRef} from 'vue';
import {dictData, loadData} from '@/api/star_horse_utils';
import {error} from '@/utils/message';
import {SelectOption} from '@/components/types/SearchProps';
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
      props.field.preps['data'] = reDataList;
    }
  } else if (dataSource == 'dict') {
    let dicts = await dictData(urlOrDictName);
    if (Object.keys(dicts).length == 0) {
      error('数据字典可能未配置');
    } else {
      props.field.preps['data'] = dicts;
    }
  }
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {}
  }
  props.field.preps['remote'] = props.field.preps['remote'] || props.field.preps['dataSource'] == 'url';
  props.field.preps['filterable'] = true;
  props.field.preps['collapseTags'] = true;
  props.field.preps['data'] = props.field?.optionList;
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
</script>
<style scoped></style>
