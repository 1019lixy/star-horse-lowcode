<template>
  {{ areaFormRef?.getFormData() }}
  <star-horse-form ref="areaFormRef" :compUrl="{
    pageUrl:'xxx'
  }" :fieldList="tableFieldList" />

</template>

<script lang="ts" setup>
import { searchMatchList } from '@/api/star_horse_utils';
import { PageFieldInfo } from '@/components/types/PageFieldInfo';
import { SelectOption } from '@/components/types/SearchProps';
import { reactive, ref } from 'vue';
import WebUrlComp from './WebUrlComp.vue';
const areaFormRef = ref();
/**
 * 关联
 */
const fields: SelectOption[] = [];
const eventList: SelectOption[] = [
  { name: "Change", value: "change" },
  { name: "Input", value: "input" },
];
const controlConditionList: SelectOption[] = [
  { name: "满足条件触发数据联动", value: "eqConditionDataLinkage" },
  { name: "数据作为参数触发数据联动", value: "asParamDataLinkage" },
  { name: "等于指定值时禁用被关联字段", value: "eqDisable" },
  { name: "等于指定值时可编辑被关联字段", value: "eqEditable" },
  { name: "等于指定值时隐藏被关联字段", value: "eqHide" },
  { name: "等于指定值时显示被关联字段", value: "eqVisible" },
  { name: "等于指定值时被关联字段必填", value: "eqRequired" },
  { name: "等于指定值时被关联字段赋予新值", value: "assignValue" },
  { name: "数据等于指定值时被关联字段改变字段类型", value: "changeType" },
  { name: "测试数据", value: "button_authority" },
];
const fieldType = ref<string>("input");
const fieldLinkVisible = ref<boolean>(false);
// let matchType = ref<boolean>(false);
const tableFieldList = reactive<PageFieldInfo | any>({
  fieldList: [
    {
      label: "触发事件",
      fieldName: "actionName",
      type: "select",
      defaultValue: "change",
      required: true,
      formVisible: true,
      listVisible: true,
      preps: {
        values: eventList,
      },
    },
    {
      batchFieldList: [
        {
          staticData: "Y",
          subFormFlag: "Y",
          batchName: "relationDetails",
          fieldList: [
            [
              {
                label: "控制条件",
                fieldName: "controlCondition",
                type: "select",
                required: false,
                formVisible: true,
                listVisible: true,
                preps: {
                  values: controlConditionList,
                  dataRelation: {
                    actionName: "change",
                    relationDetails: [
                      {
                        matchType: "eq",
                        controlCondition: "eqVisible",
                        relationFields: ["params", "dataSourceDivider"],
                        matchFieldValue: ["eqConditionDataLinkage","asParamDataLinkage"]
                      },
                      {
                        matchType: "eq",
                        controlCondition: "eqVisible",
                        relationFields: ["dictinfo"],
                        matchFieldValue: "assignValue",
                      },
                      {
                        matchType: "eq",
                        controlCondition: "eqVisible",
                        relationFields: ["newValues"],
                        matchFieldValue: "changeType",
                        staticDatas: "input"
                      },
                      {
                          matchType: "eq",
                          controlCondition: "eqRequired",
                          relationFields: ["matchFieldValue"],
                          matchFieldValue: ["eqDisable","eqVisible","eqEditable","eqRequired","eqHide","eqConditionDataLinkage","asParamDataLinkage"]
                        },
                        {
                          matchType: "eq",
                          controlCondition: "eqRequired",
                          relationFields: ["matchFieldName"],
                          matchFieldValue: ["asParamDataLinkage"]
                        },
                    ],
                  },
                },
              },
              {
                label: "被控制属性",
                fieldName: "relationFields",
                type: "tselect",
                required: false,
                formVisible: true,
                listVisible: true,
                preps: {
                  data: fields,
                  multiple: true,
                  checkStrictly: true,
                },
              },
            ],
            [
              {
                label: "匹配条件",
                fieldName: "matchType",
                type: "select",
                defaultValue: "eq",
                required: false,
                disabled: "Y",
                formVisible: true,
                listVisible: true,
                preps: {
                  values: searchMatchList(),
                },
              },
              {
                label: "参数",
                fieldName: "matchFieldValue",
                type: fieldType,
                required: false,
                helpMsg:
                  "1、如果是作为查询条件，则填写参数名称；\n2、如果是等于某个值，则填写具体的值；",
                formVisible: true,
                listVisible: true,
              },
            ],
            {
              type: "divider",
              formVisible: false,
              fieldName: "dataSourceDivider",
              preps: {
                bareFlag: "Y",
                content: "数据源",
              },
            },
            {
              label: "赋新值",
              type: "input",
              fieldName: "dictinfo",
              formVisible: false,
              preps: {},
            },
            {
              label: "修改字段类型",
              type: "select",
              fieldName: "newValues",
              formVisible: false,
              preps: {},
            },
            {
              label: "联动数据源",
              type: "usercomp",
              fieldName: "params",
              formVisible: false,
              preps: {
                bareFlag: "Y",
                subFormFlag: true,
                batchName:"params",
                compName: WebUrlComp,
              },
            },
          ],
        },
      ],
    },
  ],
});
</script>

<style lang="scss" scoped></style>
