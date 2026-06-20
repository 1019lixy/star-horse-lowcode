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
import {nextTick, onMounted, reactive, ref} from "vue";
import WebUrlComp from "./WebUrlComp.vue";
import {analysisCompDatas} from "@";

const areaFormRef = ref();
const dataRelationDialogVisible = ref<boolean>(false);
// const formData = ref<any>({
//   showArrow: true,
//   placeholder: "请选择选择器1",
//   multipleLimit: null,
//   filterable: true,
//   collapseTags: true,
//   collapseTagsTooltip: true,
//   id: "Idshb9d78cef-2edd-4e48-be68-f6ffec734983",
//   label: "选择器1",
//   itemNameLabel: "选择器",
//   name: "select2",
//   clearable: true,
//   readonly: false,
//   remote: false,
//   maxLength: 255,
//   rules: [],
//   formVisible: true,
//   listVisible: true,
//   viewVisible: true,
//   starHorseBtnName: "dataRelation",
//   dataRelation: {
//     actionName: "change",
//     relationDetails: [
//       {
//         matchType: "eq",
//         matchFieldName: "select2",
//         controlCondition: "asParamDataLinkage",
//         params: {
//           httpMethod: "POST",
//           protocol: "http",
//           queryParams: [],
//           env: "-dev",
//           host: "system-config",
//           interfaceUrl: "system-config/system/dictinfo/getAllByCondition",
//           starHorseBtnName: "sh2563a6cb-f7b3-4e13-a133-31d5e229254c",
//           selectLabel: "dictName",
//           selectValue: "dictCode",
//         },
//         dataSourceDivider: "数据源",
//         relationFields: ["select1"],
//         xh: 1,
//       },
//       {
//         matchType: "eq",
//         matchFieldName: "select2",
//         params: {},
//         controlCondition: "eqDisable",
//         relationFields: ["select1"],
//         matchFieldValue: ["test"],
//         xh: 2,
//       },
//     ],
//     relationDetailsDefaultValue: [{}],
//     showArrow: true,
//     placeholder: "请选择选择器1",
//     multipleLimit: null,
//     filterable: true,
//     collapseTags: true,
//     collapseTagsTooltip: true,
//     id: "Idshb9d78cef-2edd-4e48-be68-f6ffec734983",
//     label: "选择器1",
//     itemNameLabel: "选择器",
//     name: "select2",
//     clearable: true,
//     readonly: false,
//     remote: false,
//     maxLength: 255,
//     rules: [],
//     formVisible: true,
//     listVisible: true,
//     viewVisible: true,
//     starHorseBtnName: "dataRelation",
//   },
//   dataSource: "data",
//   analysisType: "func",
//   httpMethod: "POST",
//   protocol: "http",
//   values: [
//     { name: "Test", value: "battery", xh: 1 },
//     { name: "Test-visible", value: "visible", xh: 2, starHorseEditing: "no" },
//   ],
// });

const editData = async () => {
  dataRelationDialogVisible.value = true;
  // let temp = formData.value["dataRelation"] ?? {};
  // console.log(temp);
  // await nextTick(() => {
  //   temp && areaFormRef.value?.setFormData(temp);
  // });
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
  // formData.value["dataRelation"] = areaFormRef?.value.getFormData().value;
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
const dataList=[
  {
    "id": "Idsh3124fe7b-2c64-4974-b277-fac1d84be389",
    "preps": {
      "id": "Idsh3124fe7b-2c64-4974-b277-fac1d84be389",
      "itemNameLabel": "单行文本框",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入所属模块ID",
      "appCompVisible": false,
      "appLabelVisible": false,
      "rules": [],
      "maxLength": 100,
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true,
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "label": "所属模块ID",
      "name": "moduleId",
      "required": true,
      "searchVisible": true,
      "defaultVisible": true
    },
    "compType": "formItem",
    "fieldName": "moduleId",
    "itemType": "input",
    "label": "单行文本框",
    "type": "input",
    "priority": 1
  },
  {
    "id": "Idshfa69c6c3-bcf5-4913-869b-3012f84454ba",
    "preps": {
      "id": "Idshfa69c6c3-bcf5-4913-869b-3012f84454ba",
      "itemNameLabel": "单行文本框",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入完整路径",
      "rules": [],
      "maxLength": 1500,
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true,
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "label": "完整路径",
      "name": "filePath",
      "required": true,
      "hideLabel": false
    },
    "compType": "formItem",
    "fieldName": "filePath",
    "itemType": "input",
    "label": "单行文本框",
    "type": "input",
    "priority": 2
  },
  {
    "id": "Idsh71368af7-81f6-4820-817c-6d6ba68b978f",
    "preps": {
      "id": "Idsh71368af7-81f6-4820-817c-6d6ba68b978f",
      "itemNameLabel": "单行文本框",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入文件名",
      "rules": [],
      "maxLength": 200,
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true,
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "label": "文件名",
      "name": "fileName",
      "required": true,
      "searchVisible": true,
      "defaultVisible": true
    },
    "compType": "formItem",
    "fieldName": "fileName",
    "itemType": "input",
    "label": "单行文本框",
    "type": "input",
    "priority": 3
  },
  {
    "id": "Idshc04bd871-22f8-4df0-ba47-b0bed628336a",
    "preps": {
      "id": "Idshc04bd871-22f8-4df0-ba47-b0bed628336a",
      "itemNameLabel": "单行文本框",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入节点类型",
      "rules": [],
      "maxLength": 50,
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true,
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "label": "节点类型",
      "name": "nodeType",
      "defaultValue": "file",
      "required": true
    },
    "compType": "formItem",
    "fieldName": "nodeType",
    "itemType": "input",
    "label": "单行文本框",
    "type": "input",
    "priority": 4
  },
  {
    "id": "Idshab894a3f-b6dd-493c-b831-62b4dbd0bf08",
    "preps": {
      "id": "Idshab894a3f-b6dd-493c-b831-62b4dbd0bf08",
      "itemNameLabel": "单行文本框",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入文件内容",
      "rules": [],
      "maxLength": 4000,
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true,
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "label": "文件内容",
      "name": "content"
    },
    "compType": "formItem",
    "fieldName": "content",
    "itemType": "input",
    "label": "单行文本框",
    "type": "input",
    "priority": 5
  },
  {
    "id": "Idsh52e01cf7-6f75-49fb-b445-c6e27b7481e7",
    "preps": {
      "id": "Idsh52e01cf7-6f75-49fb-b445-c6e27b7481e7",
      "itemNameLabel": "单行文本框",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入语言类型",
      "rules": [],
      "maxLength": 100,
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true,
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "label": "语言类型",
      "name": "language",
      "required": true
    },
    "compType": "formItem",
    "fieldName": "language",
    "itemType": "input",
    "label": "单行文本框",
    "type": "input",
    "priority": 6
  },
  {
    "id": "Idsh28c4e630-7886-4253-8836-dc8376f185a8",
    "preps": {
      "dataRelation": {
        "actionName": "blur",
        "relationDetails": [
          {
            "matchType": "eq",
            "controlCondition": "loadDataLinkage",
            "params": {
              "redirect": true,
              "httpMethod": "POST",
              "protocol": "http",
              "queryParams": []
            },
            "dataSourceDivider": "数据源",
            "relationFields": [
              "moduleId"
            ],
            "matchFieldValue": [
              "abc"
            ],
            "xh": 1,
            "isWorking": false,
            "starHorseEditing": "no"
          }
        ],
        "relationDetailsDefaultValue": [
          {}
        ]
      },
      "id": "Idsh28c4e630-7886-4253-8836-dc8376f185a8",
      "itemNameLabel": "单行文本框",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入父目录路径",
      "rules": [],
      "maxLength": 255,
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true,
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "label": "父目录路径",
      "name": "parentPath",
      "required": true
    },
    "compType": "formItem",
    "fieldName": "parentPath",
    "itemType": "input",
    "label": "单行文本框",
    "type": "input",
    "priority": 7
  },
  {
    "id": "Idsh899e980f-9320-4b33-9684-bf22904e9b22",
    "preps": {
      "id": "Idsh899e980f-9320-4b33-9684-bf22904e9b22",
      "itemNameLabel": "数字输入框",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入排序号",
      "step": 1,
      "min": 0,
      "precision": 0,
      "rules": [],
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true,
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "label": "排序号",
      "name": "sortOrder",
      "maxLength": 10,
      "required": true
    },
    "compType": "formItem",
    "fieldName": "sortOrder",
    "itemType": "number",
    "label": "数字输入框",
    "type": "number",
    "priority": 8
  },
  {
    "id": "Idshf1c78d56-ce40-4429-85c1-7fe2848c879d",
    "preps": {
      "id": "Idshf1c78d56-ce40-4429-85c1-7fe2848c879d",
      "label": "选择器",
      "itemNameLabel": "选择器",
      "name": "field_validInfo",
      "clearable": true,
      "readonly": false,
      "filterable": true,
      "collapseTags": true,
      "collapseTagsTooltip": true,
      "placeholder": "请选择选择器",
      "rules": [],
      "maxLength": 255,
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true,
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "remote": false,
      "dataRelation": {
        "actionName": "change",
        "relationDetails": [
          {
            "matchType": "eq",
            "matchFieldName": "field_shf1c7",
            "controlCondition": "eqHide",
            "params": {
              "redirect": true,
              "httpMethod": "POST",
              "protocol": "http",
              "queryParams": []
            },
            "dataSourceDivider": "数据源",
            "relationFields": [
              "moduleId"
            ],
            "matchFieldValue": [
              "abc"
            ],
            "xh": 1,
            "isWorking": false,
            "starHorseEditing": "no"
          }
        ],
        "relationDetailsDefaultValue": [
          {}
        ]
      },
      "dataSource": "data",
      "analysisType": "func",
      "values": [
        {
          "name": "Abc",
          "value": "abc",
          "xh": 1,
          "starHorseEditing": "no"
        },
        {
          "name": "123",
          "value": "123",
          "xh": 2
        }
      ],
      "valuesDefaultValue": [
        {}
      ],
      "hideLabel": false,
      "searchVisible": false
    },
    "compType": "formItem",
    "fieldName": "field_validInfo",
    "itemType": "select",
    "label": "选择器",
    "type": "select"
  }
];
/*const tableFieldList = reactive<PageFieldInfo | any>({
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
});*/
const tableFieldList=ref<PageFieldInfo>({
  fieldList:[]
});
onMounted(()=>{
  const result = analysisCompDatas(dataList);
  console.log(result);
  tableFieldList.value.fieldList=result.fieldList;
});
</script>

<style lang="scss" scoped></style>
