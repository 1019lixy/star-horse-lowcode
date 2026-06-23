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
import {PageFieldInfo} from "@/components/types/PageFieldInfo";
import {SelectOption} from "@/components/types/SearchProps";
import {onMounted, ref} from "vue";
import {analysisCompDatas} from "@/api/form_utils";


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
  {name: "Change", value: "change"},
  {name: "Input", value: "input"},
];
const controlConditionList: SelectOption[] = [
  {name: "满足条件触发数据联动", value: "eqConditionDataLinkage"},
  {name: "数据作为参数触发数据联动", value: "asParamDataLinkage"},
  {name: "等于指定值时禁用被关联字段", value: "eqDisable"},
  {name: "等于指定值时可编辑被关联字段", value: "eqEditable"},
  {name: "等于指定值时隐藏被关联字段", value: "eqHide"},
  {name: "等于指定值时显示被关联字段", value: "eqVisible"},
  {name: "等于指定值时被关联字段必填", value: "eqRequired"},
  {name: "等于指定值时被关联字段赋予新值", value: "assignValue"},
  {name: "数据等于指定值时被关联字段改变字段类型", value: "changeType"},
  {name: "测试数据", value: "button_authority"},
];
const fieldType = ref<string>("input");
const fieldLinkVisible = ref<boolean>(false);
const dataList = [{
      "id": "Idsh9cea0550-5fba-4bf4-97ee-6ba9f21d9304", "preps": {
        "id": "Idsh9cea0550-5fba-4bf4-97ee-6ba9f21d9304",
        "label": "用户信息",
        "itemNameLabel": "单行文本框",
        "name": "userInfo",
        "clearable": true,
        "readonly": false,
        "placeholder": "请输入用户信息",
        "rules": [],
        "maxLength": 255,
        "formVisible": true,
        "listVisible": true,
        "viewVisible": true,
        "formula": {"enable": false, "type": "calc", "sourceFields": [], "expression": ""},
        "dataRelation": {
          "relationDetails": [], "actionName": "blur", "apiLinkage": {
            "proxyUrl": "/system-config/redirect/apiLinkage",
            "conditionFields": ["userInfo", "fieldShcad6"],
            "apiInfo": {
              "apiType": "thirdApi",
              "httpMethod": "POST",
              "protocol": "http",
              "dataType": "JSON",
              "headers": [{
                "valueType": "static",
                "paramName": "P-Auth",
                "paramValue": "u_Mjc2MWI1ZXZqYmI1azJhN3Y4bF4WNzU5ODEWMZ9ONTE5MzIxMTU4MjkyMjg20831",
                "xh": 1
              }],
              "requestParams": [{
                "valueType": "isolation",
                "paramName": "DataType",
                "paramValue": "${DataType}",
                "xh": 1
              }, {"valueType": "dynamic", "paramName": "Id", "paramValue": "${userInfo}", "xh": 2}, {
                "valueType": "static",
                "paramName": "typeid",
                "paramValue": "1",
                "xh": 3
              }, {"valueType": "static", "paramName": "wo", "paramValue": "", "xh": 4}],
              "responseTemplate": "result_data_list",
              "codePath": "code",
              "dataPath": "data",
              "url": "http://192.168.20.102:8092/tims",
              "successCode": "200"
            },
            "redirect": true,
            "httpMethod": "POST",
            "protocol": "http",
            "dataType": "JSON",
            "headers": [],
            "requestParams": [],
            "responseTemplate": "result_data_list",
            "codePath": "code",
            "dataPath": "data",
            "fieldMappings": [{
              "sourceField": "line",
              "distField": "address",
              "xh": 1,
              "starHorseEditing": "no"
            }, {"sourceField": "partdesc", "distField": "otherInfo", "xh": 2, "starHorseEditing": "no"}],
            "authInfo": {
              "apiType": "systemApi",
              "httpMethod": "POST",
              "protocol": "http",
              "dataType": "JSON",
              "headers": [],
              "requestParams": [],
              "responseTemplate": "result_data_list",
              "codePath": "code",
              "dataPath": "data"
            },
            "isolationConfig": {
              "isolationDetails": [{
                "isolationName": "330119242655466492",
                "paramName": "DataType",
                "isolationCode": "1",
                "xh": 1
              }, {
                "isolationName": "357139040828392444",
                "paramName": "DataType",
                "isolationCode": "2",
                "xh": 2
              }, {"isolationName": "default", "paramName": "DataType", "isolationCode": "1", "xh": 3}],
              "isolationType": "role"
            },
            "isolationDetails": [],
            "headersDefaultValue": [{"valueType": "static"}, {"valueType": "static"}],
            "requestParamsDefaultValue": [{"valueType": "static"}, {"valueType": "static"}],
            "fieldMappingsDefaultValue": [{}],
            "isolationDetailsDefaultValue": [{}]
          }
        }
      }, "compType": "formItem", "fieldName": "userInfo", "itemType": "input", "label": "单行文本框", "type": "input"
    }, {
      "id": "Idshcad62f7a-d330-4382-b8be-ea625d8c8349", "preps": {
        "id": "Idshcad62f7a-d330-4382-b8be-ea625d8c8349",
        "label": "数据选择",
        "itemNameLabel": "选择器",
        "name": "dataList",
        "clearable": true,
        "readonly": false,
        "filterable": true,
        "collapseTags": true,
        "collapseTagsTooltip": true,
        "placeholder": "请选择数据选择",
        "remote": true,
        "rules": [],
        "maxLength": 255,
        "formVisible": true,
        "listVisible": true,
        "viewVisible": true,
        "formula": {"enable": false, "type": "calc", "sourceFields": [], "expression": ""},
        "dataSource": "url",
        "apiDataSource": {
          "apiInfo": {
            "apiType": "systemApi",
            "httpMethod": "POST",
            "protocol": "http",
            "dataType": "JSON",
            "headers": [],
            "requestParams": [{"valueType": "static", "paramName": "dictType", "paramValue": "button_authority", "xh": 1}],
            "responseTemplate": "result_data_list",
            "codePath": "code",
            "dataPath": "data",
            "redirect": true,
            "serviceName": "system-config-dev",
            "interfaceName": "DictinfoController",
            "method": "getAllByCondition",
            "url": "http://172.26.224.1:8749/system-config/system/dictinfo/getAllByCondition"
          },
          "optionField": {"labelField": "dictName", "valueField": "dictCode"},
          "authInfo": {
            "apiType": "systemApi",
            "httpMethod": "GET",
            "protocol": "http",
            "dataType": "JSON",
            "headers": [],
            "requestParams": [],
            "responseTemplate": "result_data_list",
            "codePath": "code",
            "dataPath": "data"
          },
          "proxyUrl": "/system-config/redirect/apiLinkage",
          "conditionFields": ["fieldShcad6"]
        }
      }, "compType": "formItem", "fieldName": "dataList", "itemType": "select", "label": "选择器", "type": "select"
    }, {
      "id": "Idsh39a0864c-fe9c-44ab-a458-1ef51ed2b2ae",
      "preps": {
        "id": "Idsh39a0864c-fe9c-44ab-a458-1ef51ed2b2ae",
        "itemNameLabel": "单行文本框",
        "name": "address",
        "clearable": true,
        "readonly": false,
        "placeholder": "请输入地址",
        "rules": [],
        "maxLength": 255,
        "formVisible": true,
        "listVisible": true,
        "viewVisible": true,
        "formula": {"enable": false, "type": "calc", "sourceFields": [], "expression": ""},
        "label": "地址"
      },
      "compType": "formItem",
      "fieldName": "address",
      "itemType": "input",
      "label": "单行文本框",
      "type": "input"
    }, {
      "id": "Idshfec4bfca-19ba-44ed-8c8a-ba26ab3d9f79",
      "preps": {
        "id": "Idshfec4bfca-19ba-44ed-8c8a-ba26ab3d9f79",
        "label": "其他信息",
        "itemNameLabel": "单行文本框",
        "name": "otherInfo",
        "clearable": true,
        "readonly": false,
        "placeholder": "请输入其他信息",
        "rules": [],
        "maxLength": 255,
        "formVisible": true,
        "listVisible": true,
        "viewVisible": true,
        "formula": {"enable": false, "type": "calc", "sourceFields": [], "expression": ""}
      },
      "compType": "formItem",
      "fieldName": "otherInfo",
      "itemType": "input",
      "label": "单行文本框",
      "type": "input"
    }]
;
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
const tableFieldList = ref<PageFieldInfo>({
  fieldList: []
});
onMounted(() => {
  const result = analysisCompDatas(dataList);
  console.log(result);
  tableFieldList.value.fieldList = result.fieldList;
});
</script>

<style lang="scss" scoped></style>
