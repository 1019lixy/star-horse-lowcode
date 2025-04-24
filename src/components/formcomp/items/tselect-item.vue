<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-tree-select
        :fid="field.preps['name']"
        :readonly="field.preps['readonly'] == 'Y'"
        :show-checkbox="field.preps['showCheckbox'] == 'Y'"
        :check-strictly="field.preps['checkStrictly'] == 'Y'"
        :clearable="field.preps['clearable'] == 'Y'"
        :disabled="checkIsDisabled(context)"
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
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        :data="field.preps['values'] || context.attrs['formData'][field.preps['name'] + 'OptionList']"
        :tag-type="field.preps['tagType']"
        :render-content="renderContent"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="context.attrs['formData'][field.preps['name']]"
    >
    </el-tree-select>
  </starhorse-form-item>
</template>
<script lang="ts">
import {defineComponent, onMounted, shallowRef} from 'vue';
import {dictData, loadData} from '@/api/star_horse_utils.ts';
import {error} from '@/utils/message.ts';
import {SelectOption} from '@/components/types/SearchProps';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

export default defineComponent({
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs['parentField'];

    const field = context.attrs['field'] as any;
    let formItem = shallowRef({label: 'input', required: false});
    let dataField = shallowRef('');
    let actionName = shallowRef('normal');
    const itemAction = (prep: any) => {
      allAction(context, prep);
    };
    const filterNodeMethod = (value: any, data: any) => {
      let name: any = field.preps['props']?.label || 'label';
      return data[name].includes(value);
    };
    const renderContent = (_h: Function, data: any) => {
      let labelName = field.preps.props?.label || 'label';
      if (field.preps['showCode'] == 'Y') {
        let codeName = field.preps.props?.code || field.preps.props?.value || 'value';
        return `${data.data[labelName]}(${data.data['code'] || data.data[codeName] || ''})`;
      }
      return data.data[labelName];
    };
    /**
     * 动态获取数据
     */
    const initData = async () => {
      let temp = field.preps;
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
          field.preps['values'] = reDataList;
        }
      } else if (dataSource == 'dict') {
        let dicts = await dictData(urlOrDictName);
        if (Object.keys(dicts).length == 0) {
          error('数据字典可能未配置');
        } else {
          field.preps['values'] = dicts;
        }
      }
    };
    onMounted(() => {
      initData();
      actionName.value = field.preps?.actionName || 'normal';
      if (!context.attrs['isSearch']) {
        allAction(context, actionName.value, true);
      }
    });
    return {
      parentField,
      context,
      field,
      formItem,
      dataField,
      itemAction,
      filterNodeMethod,
      actionName,
      renderContent
    };
  }
});
</script>
<style scoped></style>
