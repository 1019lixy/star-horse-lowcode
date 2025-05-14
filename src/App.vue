<template>
 <!--  {{ dataForm }}
  <el-input v-model="dataForm.txt1"/>
  -----------------
  <barcode-item
      :formData="dataForm"
      :field="{
        preps: {
          name: 'txt1'
        }
      }"/> -->
      <test/>
    <star-horse-form :fieldList="formField"/>
</template>
<script lang="ts" setup>
import {reactive, ref} from "vue";
import {PageFieldInfo} from "@/components/types";
import QrcodeItem from "@/components/formcomp/items/qrcode-item.vue";
import test from "@/components/test.vue";
const dataForm = ref<any>({})
const formField = reactive<PageFieldInfo>( {
  "fieldList": [
    [
      {
        "label": "组件名称",
        "fieldName": "itemName",
        "type": "input",
        "required": true,
        "formVisible": true,
        "listVisible": true,
        "preps": {
          "clearable": "N",
          "controls": "yes",
          "searchVisible": "Y",
          "viewShow": "Y",
          "autocomplete": "N",
          "editDisabled": "N",
          "label": "组件名称",
          "uniqueValid": "N",
          "required": "Y",
          "size": "small",
          "readonly": "N",
          "formVisible": "Y",
          "showWordLimit": "no",
          "name": "itemName",
          "disabled": "N",
          "id": "persistId19",
          "maxLength": 100,
          "listVisible": "Y",
          "hideLabel": "N"
        },
        "comment": ""
      },
      {
        "label": "组件编码",
        "fieldName": "itemType",
        "type": "input",
        "required": true,
        "formVisible": true,
        "listVisible": true,
        "preps": {
          "clearable": "no",
          "controls": "yes",
          "searchVisible": "Y",
          "viewShow": "Y",
          "autocomplete": "off",
          "editDisabled": "N",
          "label": "组件编码",
          "uniqueValid": "N",
          "required": "Y",
          "size": "small",
          "readonly": "no",
          "formVisible": "Y",
          "name": "itemType",
          "disabled": "no",
          "id": "persistId20",
          "maxLength": 100,
          "listVisible": "Y",
          "hideLabel": "N"
        },
        "comment": ""
      }
    ],
    [
      {
        "label": "组件分类",
        "fieldName": "category",
        "type": "select",
        "required": true,
        "formVisible": true,
        "listVisible": true,
        "preps": {
          "viewShow": "Y",
          "values": [
            {
              "name": "容器",
              "value": "2"
            },
            {
              "name": "表单组件",
              "value": "1"
            },
            {
              "name": "自定义组件",
              "value": "3"
            }
          ],
          "remote": "N",
          "reserveKeyword": "Y",
          "required": "Y",
          "collapseTags": "N",
          "allowCreate": "N",
          "automaticDropdown": "N",
          "readonly": "N",
          "formVisible": "Y",
          "valueType": "number",
          "tagType": "info",
          "disabled": "N",
          "id": "Id61",
          "valueKey": "value",
          "listVisible": "Y",
          "preinterfaceUrl": "http://",
          "hideLabel": "N",
          "filterable": "N",
          "clearable": "N",
          "searchVisible": "Y",
          "loadingText": "Loading",
          "requestType": "POST",
          "autocomplete": "N",
          "multipleLimit": 0,
          "multiple": "N",
          "editDisabled": "N",
          "label": "组件分类",
          "loading": "N",
          "uniqueValid": "N",
          "noDataText": "No data",
          "itemNameLabel": "选择器",
          "size": "small",
          "defaultFirstOption": "N",
          "collapseTagsTooltip": "N",
          "effect": "light",
          "name": "category",
          "fitInputWidth": "N",
          "noMatchText": "No matching data",
          "placement": "bottom-start",
          "dataSource": "data",
          "maxLength": 100
        },
        "comment": ""
      },
      {
        "label": "元素排序",
        "fieldName": "dataSort",
        "type": "number",
        "required": false,
        "formVisible": true,
        "listVisible": true,
        "preps": {
          "clearable": "N",
          "controls": "Y",
          "searchVisible": "N",
          "viewShow": "Y",
          "precision": 0,
          "editDisabled": "N",
          "label": "元素排序",
          "uniqueValid": "N",
          "required": "N",
          "size": "small",
          "readonly": "N",
          "formVisible": "Y",
          "name": "dataSort",
          "disabled": "N",
          "id": "persistId34",
          "maxLength": 5,
          "listVisible": "Y",
          "hideLabel": "N"
        },
        "comment": ""
      },
      {
        "label": "图标",
        "fieldName": "itemIcon",
        "type": "icon",
        "required": false,
        "formVisible": true,
        "listVisible": true,
        "preps": {
          "clearable": "Y",
          "searchVisible": "N",
          "editDisabled": "N",
          "label": "图标",
          "uniqueValid": "N",
          "required": "N",
          "viewVisible": "Y",
          "prototypeDisplay": "N",
          "itemNameLabel": "图标",
          "readonly": "N",
          "formVisible": "Y",
          "iconType": "user",
          "name": "itemIcon",
          "disabled": "N",
          "id": "Idsh290557d4-239e-4414-b2a0-ef04f7a69340",
          "maxLength": 100,
          "listPrototypeDisplay": "N",
          "listVisible": "Y",
          "hideLabel": "N"
        }
      }
    ],
    [
      {
        "label": "备注",
        "fieldName": "remark",
        "type": "textarea",
        "required": false,
        "formVisible": true,
        "listVisible": true,
        "preps": {
          "minlength": 0,
          "clearable": "Y",
          "searchVisible": "N",
          "viewShow": "Y",
          "autocomplete": "N",
          "editDisabled": "N",
          "label": "备注",
          "rows": 2,
          "uniqueValid": "N",
          "required": "N",
          "min": 0,
          "itemNameLabel": "多行文本框",
          "readonly": "N",
          "formVisible": "Y",
          "showWordLimit": "N",
          "name": "remark",
          "resize": "none",
          "inputStyle": "{}",
          "disabled": "N",
          "id": "Id9eae1a23-06b5-4e30-9737-32654066e7fb",
          "maxLength": 2000,
          "autosize": "N",
          "listVisible": "Y",
          "hideLabel": "N"
        }
      }
    ],
    {
      "batchFieldList": [
        {
          "batchName": "sysDynamicFormFields",
          "title": "动态列表",
          "fieldList": [
            {
              "label": "标签名称",
              "fieldName": "label",
              "type": "input",
              "required": true,
              "formVisible": true,
              "listVisible": false,
              "preps": {
                "clearable": "N",
                "controls": "yes",
                "searchVisible": "N",
                "viewShow": "Y",
                "autocomplete": "N",
                "editDisabled": "N",
                "label": "标签名称",
                "uniqueValid": "N",
                "required": "Y",
                "formVisible": "Y",
                "name": "label",
                "disabled": "no",
                "id": "persistId38",
                "maxLength": 100,
                "listVisible": "N",
                "hideLabel": "N"
              },
              "comment": ""
            },
            {
              "label": "属性名",
              "fieldName": "fieldName",
              "type": "input",
              "required": true,
              "formVisible": true,
              "listVisible": false,
              "preps": {
                "minlength": 0,
                "clearable": "no",
                "searchVisible": "N",
                "viewShow": "Y",
                "autocomplete": "off",
                "editDisabled": "N",
                "label": "属性名",
                "rows": 2,
                "uniqueValid": "N",
                "required": "Y",
                "formatter": "(/** @type {any} */ value) => {                console.log(value);            }",
                "min": 0,
                "readonly": "no",
                "size": "small",
                "formVisible": "Y",
                "showWordLimit": "no",
                "name": "fieldName",
                "resize": "none",
                "disabled": "no",
                "id": "Id59",
                "maxLength": 100,
                "listVisible": "N",
                "hideLabel": "N"
              },
              "comment": ""
            },
            {
              "label": "属性类别",
              "fieldName": "fieldType",
              "type": "select",
              "required": true,
              "formVisible": true,
              "listVisible": false,
              "defaultValue": "input",
              "preps": {
                "defaultValue": "input",
                "values": [
                  {
                    "name": "开关",
                    "value": "switch"
                  },
                  {
                    "name": "下拉框",
                    "value": "select"
                  },
                  {
                    "name": "单选框",
                    "value": "radio"
                  },
                  {
                    "name": "多选框",
                    "value": "checkbox"
                  },
                  {
                    "name": "按钮",
                    "value": "button"
                  },
                  {
                    "name": "输入框",
                    "value": "input"
                  },
                  {
                    "name": "JSON",
                    "value": "json"
                  }
                ],
                "remote": "N",
                "reserveKeyword": "Y",
                "required": "Y",
                "autoUpload": "N",
                "collapseTags": "N",
                "allowCreate": "N",
                "automaticDropdown": "N",
                "readonly": "N",
                "formVisible": "Y",
                "valueType": "string",
                "tagType": "info",
                "disabled": "N",
                "id": "Id62",
                "drag": "N",
                "valueKey": "value",
                "listVisible": "N",
                "preinterfaceUrl": "http://",
                "hideLabel": "N",
                "filterable": "N",
                "clearable": "N",
                "searchVisible": "N",
                "loadingText": "Loading",
                "requestType": "POST",
                "autocomplete": "N",
                "multipleLimit": 0,
                "multiple": "N",
                "editDisabled": "N",
                "label": "属性类别",
                "loading": "N",
                "noDataText": "No data",
                "itemNameLabel": "选择器",
                "size": "small",
                "defaultFirstOption": "N",
                "collapseTagsTooltip": "N",
                "effect": "light",
                "name": "fieldType",
                "fitInputWidth": "N",
                "noMatchText": "No matching data",
                "placement": "bottom-start",
                "dataSource": "data",
                "maxLength": 100
              },
              "comment": ""
            },
            {
              "label": "是否必须 ",
              "fieldName": "required",
              "type": "switch",
              "required": false,
              "formVisible": true,
              "listVisible": false,
              "defaultValue": "N",
              "preps": {
                "clearable": "N",
                "controls": "yes",
                "searchVisible": "N",
                "autocomplete": "N",
                "defaultValue": "N",
                "editDisabled": "N",
                "validateEvent": "N",
                "label": "是否必须 ",
                "uniqueValid": "N",
                "required": "N",
                "viewVisible": "Y",
                "prototypeDisplay": "N",
                "itemNameLabel": "开关",
                "size": "small",
                "readonly": "N",
                "formVisible": "Y",
                "showWordLimit": "N",
                "name": "required",
                "disabled": "N",
                "id": "persistId41",
                "maxLength": 20,
                "listPrototypeDisplay": "N",
                "listVisible": "N",
                "hideLabel": "N"
              },
              "comment": ""
            },
            {
              "label": "备选值",
              "fieldName": "selectValues",
              "type": "input",
              "required": false,
              "formVisible": true,
              "listVisible": false,
              "preps": {
                "clearable": "no",
                "controls": "yes",
                "searchVisible": "N",
                "size": "small",
                "formVisible": "Y",
                "name": "selectValues",
                "disabled": "no",
                "id": "persistId42",
                "label": "备选值",
                "required": "N",
                "maxLength": 100,
                "listVisible": "N"
              },
              "comment": ""
            },
            {
              "label": "属性分类",
              "fieldName": "category",
              "type": "select",
              "required": true,
              "formVisible": true,
              "listVisible": false,
              "defaultValue": "1",
              "preps": {
                "defaultValue": "1",
                "values": [
                  {
                    "name": "基础属性",
                    "value": "1"
                  },
                  {
                    "name": "高级属性",
                    "value": "2"
                  }
                ],
                "remote": "N",
                "reserveKeyword": "Y",
                "required": "Y",
                "collapseTags": "N",
                "allowCreate": "N",
                "automaticDropdown": "N",
                "readonly": "N",
                "formVisible": "Y",
                "valueType": "number",
                "tagType": "info",
                "disabled": "N",
                "id": "Id63",
                "valueKey": "value",
                "listVisible": "N",
                "preinterfaceUrl": "http://",
                "filterable": "N",
                "clearable": "N",
                "searchVisible": "N",
                "loadingText": "Loading",
                "requestType": "POST",
                "autocomplete": "N",
                "multipleLimit": 0,
                "multiple": "N",
                "label": "属性分类",
                "loading": "N",
                "noDataText": "No data",
                "itemNameLabel": "选择器",
                "size": "small",
                "defaultFirstOption": "N",
                "collapseTagsTooltip": "N",
                "effect": "light",
                "name": "category",
                "fitInputWidth": "N",
                "noMatchText": "No matching data",
                "placement": "bottom-start",
                "dataSource": "data",
                "maxLength": 100
              },
              "comment": ""
            },
            {
              "label": "属性排序",
              "fieldName": "dataSort",
              "type": "number",
              "required": false,
              "formVisible": true,
              "listVisible": false,
              "preps": {
                "clearable": "no",
                "controls": "Y",
                "searchVisible": "N",
                "viewShow": "Y",
                "precision": 0,
                "editDisabled": "N",
                "label": "属性排序",
                "uniqueValid": "N",
                "required": "N",
                "formVisible": "Y",
                "name": "dataSort",
                "disabled": "no",
                "id": "persistId56",
                "maxLength": 5,
                "listVisible": "N",
                "hideLabel": "N"
              },
              "comment": ""
            },
            {
              "label": "父节点",
              "fieldName": "parentId",
              "type": "input",
              "required": false,
              "formVisible": true,
              "listVisible": true,
              "preps": {
                "minlength": 0,
                "viewShow": "Y",
                "required": "N",
                "prototypeDisplay": "N",
                "min": 0,
                "readonly": "N",
                "formVisible": "Y",
                "showWordLimit": "N",
                "disabled": "N",
                "id": "Ideb93acad-5eec-4aa4-872b-a088482243ec",
                "listVisible": "Y",
                "hideLabel": "N",
                "clearable": "Y",
                "searchVisible": "N",
                "autocomplete": "N",
                "editDisabled": "N",
                "label": "父节点",
                "rows": 2,
                "uniqueValid": "N",
                "viewVisible": "Y",
                "itemNameLabel": "单行文本框",
                "name": "parentId",
                "resize": "none",
                "maxLength": 100,
                "listPrototypeDisplay": "N"
              }
            },
            {
              "label": "默认值",
              "fieldName": "defaultValues",
              "type": "input",
              "required": false,
              "formVisible": true,
              "listVisible": false,
              "preps": {
                "clearable": "N",
                "controls": "yes",
                "searchVisible": "N",
                "viewShow": "Y",
                "autocomplete": "N",
                "editDisabled": "N",
                "label": "默认值",
                "uniqueValid": "N",
                "required": "N",
                "size": "small",
                "readonly": "N",
                "formVisible": "Y",
                "showWordLimit": "N",
                "name": "defaultValues",
                "disabled": "no",
                "id": "persistId43",
                "maxLength": 100,
                "listVisible": "N",
                "hideLabel": "N"
              },
              "comment": ""
            },
            {
              "label": "提示信息",
              "fieldName": "remark",
              "type": "textarea",
              "required": false,
              "formVisible": true,
              "listVisible": false,
              "preps": {
                "minlength": 0,
                "clearable": "Y",
                "searchVisible": "N",
                "viewShow": "Y",
                "autocomplete": "N",
                "editDisabled": "N",
                "label": "提示信息",
                "rows": 2,
                "uniqueValid": "N",
                "required": "N",
                "min": 0,
                "itemNameLabel": "多行文本框",
                "readonly": "N",
                "formVisible": "Y",
                "showWordLimit": "N",
                "name": "remark",
                "resize": "none",
                "inputStyle": "{}",
                "disabled": "N",
                "id": "Id653935e7-3553-46ee-a995-185a33881e84",
                "maxLength": 2000,
                "autosize": "N",
                "listVisible": "N",
                "hideLabel": "N"
              }
            }
          ],
          "subFormFlag": "Y"
        }
      ]
    }
  ],
  "batchFieldList": [],
  "userTableFuncs": [],
  "dynamicFormas": [
    {
      "id": "box35",
      "compType": "container",
      "itemType": "box",
      "preps": {
        "id": "box35",
        "formVisible": "N",
        "gutter": 0,
        "justify": "start",
        "readonly": "N",
        "required": "N",
        "searchVisible": "N",
        "size": "small",
        "listVisible": "N",
        "tag": "div",
        "label": "栅格",
        "name": "box",
        "elements": [
          {
            "rowIndex": 1,
            "columns": [
              {
                "colIndex": 1,
                "colspan": 12,
                "items": [
                  {
                    "id": "persistId19",
                    "preps": {
                      "clearable": "N",
                      "comment": "",
                      "controls": "yes",
                      "required": "Y",
                      "controlsPosition": "",
                      "disabled": "N",
                      "formVisible": "Y",
                      "placeholder": "",
                      "id": "persistId19",
                      "label": "组件名称",
                      "name": "itemName",
                      "size": "small",
                      "searchVisible": "Y",
                      "listVisible": "Y",
                      "showWordLimit": "no",
                      "readonly": "N",
                      "autocomplete": "N",
                      "viewShow": "Y",
                      "hideLabel": "N",
                      "editDisabled": "N",
                      "uniqueValid": "N",
                      "maxLength": 100
                    },
                    "itemType": "input",
                    "compType": "formItem",
                    "priority": 1
                  }
                ],
                "xh": 1
              },
              {
                "colIndex": 2,
                "colspan": 12,
                "items": [
                  {
                    "id": "persistId20",
                    "preps": {
                      "clearable": "no",
                      "comment": "",
                      "controls": "yes",
                      "required": "Y",
                      "controlsPosition": "",
                      "disabled": "no",
                      "formVisible": "Y",
                      "placeholder": "",
                      "id": "persistId20",
                      "label": "组件编码",
                      "name": "itemType",
                      "size": "small",
                      "readonly": "no",
                      "autocomplete": "off",
                      "listVisible": "Y",
                      "searchVisible": "Y",
                      "viewShow": "Y",
                      "hideLabel": "N",
                      "editDisabled": "N",
                      "uniqueValid": "N",
                      "maxLength": 100
                    },
                    "itemType": "input",
                    "compType": "formItem",
                    "priority": 2
                  }
                ],
                "xh": 2
              }
            ],
            "xh": 1
          },
          {
            "rowIndex": 2,
            "columns": [
              {
                "colIndex": 1,
                "colspan": 8,
                "items": [
                  {
                    "id": "Id61",
                    "preps": {
                      "name": "category",
                      "label": "组件分类",
                      "placeholder": "",
                      "dataSource": "data",
                      "multipleLimit": 0,
                      "required": "Y",
                      "noMatchText": "No matching data",
                      "valueType": "number",
                      "formVisible": "Y",
                      "remoteMethod": "",
                      "searchVisible": "Y",
                      "listVisible": "Y",
                      "remote": "N",
                      "multiple": "N",
                      "loading": "N",
                      "reserveKeyword": "Y",
                      "clearable": "N",
                      "noDataText": "No data",
                      "filterable": "N",
                      "collapseTags": "N",
                      "allowCreate": "N",
                      "size": "small",
                      "defaultFirstOption": "N",
                      "collapseTagsTooltip": "N",
                      "automaticDropdown": "N",
                      "tagType": "info",
                      "placement": "bottom-start",
                      "valueKey": "value",
                      "readonly": "N",
                      "disabled": "N",
                      "filterMethod": "",
                      "loadingText": "Loading",
                      "autocomplete": "N",
                      "fitInputWidth": "N",
                      "popperClass": "",
                      "effect": "light",
                      "comment": "",
                      "id": "Id61",
                      "itemNameLabel": "选择器",
                      "values": [
                        {
                          "name": "容器",
                          "value": "2"
                        },
                        {
                          "name": "表单组件",
                          "value": "1"
                        },
                        {
                          "name": "自定义组件",
                          "value": "3"
                        }
                      ],
                      "preinterfaceUrl": "http://",
                      "requestType": "POST",
                      "viewShow": "Y",
                      "hideLabel": "N",
                      "editDisabled": "N",
                      "uniqueValid": "N",
                      "maxLength": 100
                    },
                    "compType": "formItem",
                    "itemType": "select",
                    "priority": 3
                  }
                ],
                "xh": 1
              },
              {
                "colIndex": 2,
                "colspan": 8,
                "items": [
                  {
                    "id": "persistId34",
                    "preps": {
                      "clearable": "N",
                      "comment": "",
                      "controls": "Y",
                      "required": "N",
                      "controlsPosition": "",
                      "disabled": "N",
                      "formVisible": "Y",
                      "placeholder": "",
                      "id": "persistId34",
                      "label": "元素排序",
                      "name": "dataSort",
                      "size": "small",
                      "listVisible": "Y",
                      "searchVisible": "N",
                      "viewShow": "Y",
                      "hideLabel": "N",
                      "editDisabled": "N",
                      "uniqueValid": "N",
                      "readonly": "N",
                      "maxLength": 5,
                      "precision": 0
                    },
                    "itemType": "number",
                    "compType": "formItem",
                    "priority": 4
                  }
                ],
                "xh": 2
              },
              {
                "items": [
                  {
                    "id": "Idsh290557d4-239e-4414-b2a0-ef04f7a69340",
                    "preps": {
                      "iconType": "user",
                      "id": "Idsh290557d4-239e-4414-b2a0-ef04f7a69340",
                      "label": "图标",
                      "itemNameLabel": "图标",
                      "name": "itemIcon",
                      "maxLength": 100,
                      "rules": [],
                      "formVisible": "Y",
                      "searchVisible": "N",
                      "listVisible": "Y",
                      "viewVisible": "Y",
                      "hideLabel": "N",
                      "required": "N",
                      "disabled": "N",
                      "editDisabled": "N",
                      "clearable": "Y",
                      "readonly": "N",
                      "prototypeDisplay": "N",
                      "listPrototypeDisplay": "N",
                      "uniqueValid": "N"
                    },
                    "compType": "formItem",
                    "itemType": "icon",
                    "priority": 5
                  }
                ],
                "colspan": 8,
                "_uuid": "shc395ae6e-4793-4513-a888-4bda21eb0966",
                "xh": 3
              }
            ],
            "xh": 2
          },
          {
            "columns": [
              {
                "_uuid": "1dfd1d8b-9347-4c90-aecc-37cf4fb2e411",
                "colspan": 24,
                "rowspan": 1,
                "items": [
                  {
                    "id": "Id9eae1a23-06b5-4e30-9737-32654066e7fb",
                    "preps": {
                      "placeholder": "",
                      "rows": 2,
                      "minlength": 0,
                      "min": 0,
                      "max": null,
                      "resize": "none",
                      "maxLength": 2000,
                      "prefixIcon": "",
                      "suffixIcon": "",
                      "showWordLimit": "N",
                      "clearable": "Y",
                      "readonly": "N",
                      "formatter": "",
                      "autocomplete": "N",
                      "autosize": "N",
                      "inputStyle": "{}",
                      "id": "Id9eae1a23-06b5-4e30-9737-32654066e7fb",
                      "label": "备注",
                      "itemNameLabel": "多行文本框",
                      "name": "remark",
                      "formVisible": "Y",
                      "searchVisible": "N",
                      "listVisible": "Y",
                      "viewShow": "Y",
                      "hideLabel": "N",
                      "required": "N",
                      "disabled": "N",
                      "editDisabled": "N",
                      "uniqueValid": "N"
                    },
                    "compType": "formItem",
                    "itemType": "textarea",
                    "priority": 6
                  }
                ],
                "xh": 1
              }
            ],
            "xh": 3
          }
        ],
        "clearable": "N",
        "showWordLimit": "N",
        "disabled": "N",
        "autocomplete": "N",
        "editDisabled": "N",
        "autoUpload": "N",
        "hideLabel": "N",
        "multiple": "N",
        "drag": "N",
        "starHorseBtnName": "rows",
        "maxLength": 100,
        "rules": [],
        "viewVisible": "Y",
        "prototypeDisplay": "N",
        "uniqueValid": "N",
        "headerFlag": "N",
        "round": "N",
        "disableTransitions": "N",
        "hit": "N",
        "listPrototypeDisplay": "N"
      }
    },
    {
      "id": "table58",
      "compType": "container",
      "itemType": "table",
      "preps": {
        "id": "table58",
        "align": "top",
        "batchFieldName": "sysDynamicFormFields",
        "columns": 10,
        "comment": "",
        "formVisible": "no",
        "readonly": "no",
        "required": "no",
        "searchVisible": "no",
        "size": "small",
        "listVisible": "no",
        "label": "动态列表",
        "templateDownFlag": "N",
        "importFlag": "N",
        "name": "table",
        "elements": [
          {
            "colIndex": 1,
            "items": [
              {
                "id": "persistId38",
                "preps": {
                  "clearable": "N",
                  "comment": "",
                  "controls": "yes",
                  "required": "Y",
                  "controlsPosition": "",
                  "disabled": "no",
                  "formVisible": "Y",
                  "placeholder": "",
                  "id": "persistId38",
                  "label": "标签名称",
                  "name": "label",
                  "searchVisible": "N",
                  "listVisible": "N",
                  "viewShow": "Y",
                  "hideLabel": "N",
                  "editDisabled": "N",
                  "uniqueValid": "N",
                  "autocomplete": "N",
                  "maxLength": 100
                },
                "itemType": "input",
                "compType": "formItem",
                "priority": 7
              }
            ]
          },
          {
            "colIndex": 2,
            "items": [
              {
                "id": "Id59",
                "preps": {
                  "name": "fieldName",
                  "placeholder": "",
                  "label": "属性名",
                  "required": "Y",
                  "prefixIcon": "",
                  "minlength": 0,
                  "formVisible": "Y",
                  "searchVisible": "N",
                  "rows": 2,
                  "listVisible": "N",
                  "maxLength": 100,
                  "showWordLimit": "no",
                  "min": 0,
                  "readonly": "no",
                  "disabled": "no",
                  "max": null,
                  "clearable": "no",
                  "formatter": "(/** @type {any} */ value) => {                console.log(value);            }",
                  "size": "small",
                  "suffixIcon": "",
                  "resize": "none",
                  "autocomplete": "off",
                  "comment": "",
                  "id": "Id59",
                  "viewShow": "Y",
                  "hideLabel": "N",
                  "editDisabled": "N",
                  "uniqueValid": "N"
                },
                "compType": "formItem",
                "itemType": "input",
                "priority": 8
              }
            ]
          },
          {
            "colIndex": 3,
            "items": [
              {
                "id": "Id62",
                "preps": {
                  "name": "fieldType",
                  "label": "属性类别",
                  "placeholder": "",
                  "dataSource": "data",
                  "multipleLimit": 0,
                  "required": "Y",
                  "noMatchText": "No matching data",
                  "valueType": "string",
                  "formVisible": "Y",
                  "remoteMethod": "",
                  "searchVisible": "N",
                  "listVisible": "N",
                  "remote": "N",
                  "multiple": "N",
                  "loading": "N",
                  "reserveKeyword": "Y",
                  "clearable": "N",
                  "noDataText": "No data",
                  "filterable": "N",
                  "collapseTags": "N",
                  "allowCreate": "N",
                  "size": "small",
                  "defaultFirstOption": "N",
                  "collapseTagsTooltip": "N",
                  "automaticDropdown": "N",
                  "tagType": "info",
                  "placement": "bottom-start",
                  "valueKey": "value",
                  "readonly": "N",
                  "disabled": "N",
                  "filterMethod": "",
                  "loadingText": "Loading",
                  "autocomplete": "N",
                  "fitInputWidth": "N",
                  "popperClass": "",
                  "effect": "light",
                  "comment": "",
                  "id": "Id62",
                  "itemNameLabel": "选择器",
                  "values": [
                    {
                      "name": "开关",
                      "value": "switch"
                    },
                    {
                      "name": "下拉框",
                      "value": "select"
                    },
                    {
                      "name": "单选框",
                      "value": "radio"
                    },
                    {
                      "name": "多选框",
                      "value": "checkbox"
                    },
                    {
                      "name": "按钮",
                      "value": "button"
                    },
                    {
                      "name": "输入框",
                      "value": "input"
                    },
                    {
                      "name": "JSON",
                      "value": "json"
                    }
                  ],
                  "preinterfaceUrl": "http://",
                  "requestType": "POST",
                  "defaultValue": "input",
                  "editDisabled": "N",
                  "autoUpload": "N",
                  "hideLabel": "N",
                  "drag": "N",
                  "maxLength": 100
                },
                "compType": "formItem",
                "itemType": "select",
                "priority": 9
              }
            ]
          },
          {
            "colIndex": 4,
            "items": [
              {
                "id": "persistId41",
                "preps": {
                  "clearable": "N",
                  "comment": "",
                  "controls": "yes",
                  "required": "N",
                  "controlsPosition": "",
                  "disabled": "N",
                  "formVisible": "Y",
                  "placeholder": "",
                  "id": "persistId41",
                  "label": "是否必须 ",
                  "name": "required",
                  "size": "small",
                  "readonly": "N",
                  "autocomplete": "N",
                  "searchVisible": "N",
                  "listVisible": "N",
                  "showWordLimit": "N",
                  "maxLength": 20,
                  "rules": [],
                  "viewVisible": "Y",
                  "hideLabel": "N",
                  "editDisabled": "N",
                  "prototypeDisplay": "N",
                  "listPrototypeDisplay": "N",
                  "uniqueValid": "N",
                  "itemNameLabel": "开关",
                  "validateEvent": "N",
                  "defaultValue": "N"
                },
                "itemType": "switch",
                "compType": "formItem",
                "priority": 10
              }
            ]
          },
          {
            "colIndex": 5,
            "items": [
              {
                "id": "persistId42",
                "preps": {
                  "clearable": "no",
                  "comment": "",
                  "controls": "yes",
                  "required": "N",
                  "controlsPosition": "",
                  "disabled": "no",
                  "formVisible": "Y",
                  "placeholder": "",
                  "id": "persistId42",
                  "label": "备选值",
                  "name": "selectValues",
                  "size": "small",
                  "searchVisible": "N",
                  "listVisible": "N",
                  "maxLength": 100
                },
                "itemType": "input",
                "compType": "formItem",
                "priority": 11
              }
            ]
          },
          {
            "colIndex": 6,
            "items": [
              {
                "id": "Id63",
                "preps": {
                  "name": "category",
                  "label": "属性分类",
                  "placeholder": "",
                  "dataSource": "data",
                  "multipleLimit": 0,
                  "required": "Y",
                  "noMatchText": "No matching data",
                  "valueType": "number",
                  "formVisible": "Y",
                  "remoteMethod": "",
                  "searchVisible": "N",
                  "listVisible": "N",
                  "remote": "N",
                  "multiple": "N",
                  "loading": "N",
                  "reserveKeyword": "Y",
                  "clearable": "N",
                  "noDataText": "No data",
                  "filterable": "N",
                  "collapseTags": "N",
                  "allowCreate": "N",
                  "size": "small",
                  "defaultFirstOption": "N",
                  "collapseTagsTooltip": "N",
                  "automaticDropdown": "N",
                  "tagType": "info",
                  "placement": "bottom-start",
                  "valueKey": "value",
                  "readonly": "N",
                  "disabled": "N",
                  "filterMethod": "",
                  "loadingText": "Loading",
                  "autocomplete": "N",
                  "fitInputWidth": "N",
                  "popperClass": "",
                  "effect": "light",
                  "comment": "",
                  "id": "Id63",
                  "itemNameLabel": "选择器",
                  "values": [
                    {
                      "name": "基础属性",
                      "value": "1"
                    },
                    {
                      "name": "高级属性",
                      "value": "2"
                    }
                  ],
                  "preinterfaceUrl": "http://",
                  "requestType": "POST",
                  "defaultValue": "1",
                  "maxLength": 100
                },
                "compType": "formItem",
                "itemType": "select",
                "priority": 12
              }
            ]
          },
          {
            "colIndex": 7,
            "items": [
              {
                "id": "persistId56",
                "preps": {
                  "clearable": "no",
                  "comment": "",
                  "controls": "Y",
                  "required": "N",
                  "controlsPosition": "",
                  "disabled": "no",
                  "formVisible": "Y",
                  "placeholder": "",
                  "id": "persistId56",
                  "label": "属性排序",
                  "name": "dataSort",
                  "searchVisible": "N",
                  "listVisible": "N",
                  "viewShow": "Y",
                  "hideLabel": "N",
                  "editDisabled": "N",
                  "uniqueValid": "N",
                  "maxLength": 5,
                  "precision": 0
                },
                "itemType": "number",
                "compType": "formItem",
                "priority": 13
              }
            ]
          },
          {
            "colIndex": 8,
            "items": [
              {
                "id": "Ideb93acad-5eec-4aa4-872b-a088482243ec",
                "preps": {
                  "placeholder": "",
                  "prefixIcon": "",
                  "minlength": 0,
                  "rows": 2,
                  "showWordLimit": "N",
                  "maxLength": 100,
                  "readonly": "N",
                  "min": 0,
                  "max": null,
                  "clearable": "Y",
                  "formatter": "",
                  "suffixIcon": "",
                  "resize": "none",
                  "autocomplete": "N",
                  "id": "Ideb93acad-5eec-4aa4-872b-a088482243ec",
                  "label": "父节点",
                  "itemNameLabel": "单行文本框",
                  "name": "parentId",
                  "formVisible": "Y",
                  "searchVisible": "N",
                  "listVisible": "Y",
                  "viewShow": "Y",
                  "hideLabel": "N",
                  "required": "N",
                  "disabled": "N",
                  "editDisabled": "N",
                  "uniqueValid": "N",
                  "rules": [],
                  "viewVisible": "Y",
                  "prototypeDisplay": "N",
                  "listPrototypeDisplay": "N"
                },
                "compType": "formItem",
                "itemType": "input",
                "priority": 14
              }
            ]
          },
          {
            "colIndex": 9,
            "items": [
              {
                "id": "persistId43",
                "preps": {
                  "clearable": "N",
                  "comment": "",
                  "controls": "yes",
                  "required": "N",
                  "controlsPosition": "",
                  "disabled": "no",
                  "formVisible": "Y",
                  "placeholder": "",
                  "id": "persistId43",
                  "label": "默认值",
                  "name": "defaultValues",
                  "searchVisible": "N",
                  "listVisible": "N",
                  "size": "small",
                  "viewShow": "Y",
                  "hideLabel": "N",
                  "editDisabled": "N",
                  "uniqueValid": "N",
                  "showWordLimit": "N",
                  "readonly": "N",
                  "autocomplete": "N",
                  "maxLength": 100
                },
                "itemType": "input",
                "compType": "formItem",
                "priority": 15
              }
            ]
          },
          {
            "colIndex": 10,
            "items": [
              {
                "id": "Id653935e7-3553-46ee-a995-185a33881e84",
                "preps": {
                  "placeholder": "",
                  "rows": 2,
                  "minlength": 0,
                  "min": 0,
                  "max": null,
                  "resize": "none",
                  "maxLength": 2000,
                  "prefixIcon": "",
                  "suffixIcon": "",
                  "showWordLimit": "N",
                  "clearable": "Y",
                  "readonly": "N",
                  "formatter": "",
                  "autocomplete": "N",
                  "autosize": "N",
                  "inputStyle": "{}",
                  "id": "Id653935e7-3553-46ee-a995-185a33881e84",
                  "label": "提示信息",
                  "itemNameLabel": "多行文本框",
                  "name": "remark",
                  "formVisible": "Y",
                  "searchVisible": "N",
                  "listVisible": "N",
                  "viewShow": "Y",
                  "hideLabel": "N",
                  "required": "N",
                  "disabled": "N",
                  "editDisabled": "N",
                  "uniqueValid": "N"
                },
                "compType": "formItem",
                "itemType": "textarea",
                "priority": 16
              }
            ]
          }
        ],
        "subFormFlag": "Y",
        "primaryKeyName": "idFormFields"
      }
    }
  ],
  "orderBy": [
    {
      "fieldName": "category",
      "ascOrDesc": "asc",
      "priority": 1
    },
    {
      "fieldName": "dataSort",
      "priority": 2
    }
  ],
  "batchName": "batchDataList",
  "tableCellEditabled": false,
  "stopAutoLoad": false
});
</script>
<style lang="scss">
#app {
  height: 100%;
}
</style>
