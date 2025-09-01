<template>
  {{ areaFormRef?.getFormData() }}
  <star-horse-dialog
    :dialogVisible="dataRelationDialogVisible"
    :title="'数据联动策略配置'"
    :isBatch="false"
    @merge="dataRelationMerge"
    @closeAction="closeAction"
    @resetForm="dataRelationReset"
    :selfFunc="true"
  >
    <star-horse-form
      :outerFormData="formProps"
      primary-key=""
      ref="areaFormRef"
      :fieldList="tableFieldList"
    />
  </star-horse-dialog>
  <el-button @click="editData">Test</el-button>
</template>

<script lang="ts" setup>
import { searchMatchList } from "@/api/star_horse_utils";
import { PageFieldInfo } from "@/components/types/PageFieldInfo";
import { SelectOption } from "@/components/types/SearchProps";
import { nextTick, reactive, ref } from "vue";
import WebUrlComp from "./WebUrlComp.vue";

const areaFormRef = ref();
const dataRelationDialogVisible = ref<boolean>(false);
const formData = ref<any>({
  showArrow: true,
  placeholder: "请选择选择器1",
  multipleLimit: null,
  filterable: true,
  collapseTags: true,
  collapseTagsTooltip: true,
  id: "Idshb9d78cef-2edd-4e48-be68-f6ffec734983",
  label: "选择器1",
  itemNameLabel: "选择器",
  name: "select2",
  clearable: true,
  readonly: false,
  remote: false,
  maxLength: 255,
  rules: [],
  formVisible: true,
  listVisible: true,
  viewVisible: true,
  starHorseBtnName: "dataRelation",
  dataRelation: {
    actionName: "change",
    relationDetails: [
      {
        matchType: "eq",
        matchFieldName: "select2",
        controlCondition: "asParamDataLinkage",
        params: {
          httpMethod: "POST",
          protocol: "http",
          queryParams: [],
          env: "-dev",
          host: "system-config",
          interfaceUrl: "system-config/system/dictinfo/getAllByCondition",
          starHorseBtnName: "sh2563a6cb-f7b3-4e13-a133-31d5e229254c",
          selectLabel: "dictName",
          selectValue: "dictCode",
        },
        dataSourceDivider: "数据源",
        relationFields: ["select1"],
        xh: 1,
      },
      {
        matchType: "eq",
        matchFieldName: "select2",
        params: {},
        controlCondition: "eqDisable",
        relationFields: ["select1"],
        matchFieldValue: ["test"],
        xh: 2,
      },
    ],
    relationDetailsDefaultValue: [{}],
    showArrow: true,
    placeholder: "请选择选择器1",
    multipleLimit: null,
    filterable: true,
    collapseTags: true,
    collapseTagsTooltip: true,
    id: "Idshb9d78cef-2edd-4e48-be68-f6ffec734983",
    label: "选择器1",
    itemNameLabel: "选择器",
    name: "select2",
    clearable: true,
    readonly: false,
    remote: false,
    maxLength: 255,
    rules: [],
    formVisible: true,
    listVisible: true,
    viewVisible: true,
    starHorseBtnName: "dataRelation",
  },
  dataSource: "data",
  analysisType: "func",
  httpMethod: "POST",
  protocol: "http",
  values: [
    { name: "Test", value: "battery", xh: 1 },
    { name: "Test-visible", value: "visible", xh: 2, starHorseEditing: "no" },
  ],
});

const editData = async () => {
  dataRelationDialogVisible.value = true;
  let temp = formData.value["dataRelation"] ?? {};
  console.log(temp);
  await nextTick(() => {
    temp && areaFormRef.value?.setFormData(temp);
  });
};
const dataRelationMerge = async () => {
  let flag: boolean = false;
  let formRef = areaFormRef?.value?.$refs.starHorseFormRef;
  await formRef.validate((res: boolean) => {
    flag = res;
  });
  if (!flag) {
    return;
  }
  formData.value["dataRelation"] = areaFormRef?.value.getFormData().value;
  // console.log(JSON.stringify({ ...formData.value }));
  closeAction();
};
const closeAction = () => {
  dataRelationDialogVisible.value = false;
};
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
                      matchFieldValue: [
                        "eqConditionDataLinkage",
                        "asParamDataLinkage",
                      ],
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
                      staticDatas: "input",
                    },
                    {
                      matchType: "eq",
                      controlCondition: "eqRequired",
                      relationFields: ["matchFieldValue"],
                      matchFieldValue: [
                        "eqDisable",
                        "eqVisible",
                        "eqEditable",
                        "eqRequired",
                        "eqHide",
                        "eqConditionDataLinkage",
                        "asParamDataLinkage",
                      ],
                    },
                    {
                      matchType: "eq",
                      controlCondition: "eqRequired",
                      relationFields: ["matchFieldName"],
                      matchFieldValue: ["asParamDataLinkage"],
                    },
                  ],
                },
              },
            },
            [
              {
                label: "被控制属性",
                fieldName: "relationFields",
                type: "tselect",
                required: false,
                formVisible: true,
                listVisible: true,
                preps: {
                  data: [
                    {
                      label: "字段1",
                      value: "field1",
                    },
                    {
                      label: "字段2",
                      value: "field2",
                    },
                  ],
                  multiple: true,
                  checkStrictly: true,
                },
              },

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
            ],
            [
              {
                label: "参数名",
                fieldName: "matchFieldName",
                type: "input",
                required: false,

                formVisible: true,
                listVisible: true,
              },
              {
                label: "参数",
                fieldName: "matchFieldValue",
                type: "select",
                required: false,
                helpMsg:
                  "1、如果是作为查询条件，则填写参数名称；\n2、如果是等于某个值，则填写具体的值；",
                formVisible: true,
                listVisible: true,
                preps: {
                  values: [
                    {
                      label: "参数1",
                      value: "param1",
                    },
                    {
                      label: "参数2",
                      value: "param2",
                    },
                  ],
                },
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
                batchName: "params",
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
