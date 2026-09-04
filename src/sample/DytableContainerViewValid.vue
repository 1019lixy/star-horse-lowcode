<template>
  <el-scrollbar>
    <star-horse-form
      :dataForm="formData"
      :fieldList="dataItem"
      label-position="top"
      :formInfo="{}"
    />
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { analysisCompDatas, convertCompToAppComps } from "@/api/form_utils";
import {StarHorseForm} from "@/components/comp";

const formData = ref<any>({
  test: "1-2-1",
});
const dataItem = ref<any>({});
const fields = [
  {
    "id": "Idsh83fb47e1-7059-4362-88e6-912d53030e57",
    "preps": {
      "label": "步骤容器",
      "subFormFlag": "Y",
      "formVisible": "Y",
      "mapping": "1",
      "id": "Idsh83fb47e1-7059-4362-88e6-912d53030e57",
      "itemNameLabel": "步骤容器",
      "name": "fieldSh83Fb",
      "elements": [
        {
          "label": "异常信息",
          "subTablePrimaryKey": "step1",
          "subTableName": "step1",
          "subFormFlag": "N",
          "formVisible": "Y",
          "items": [
            {
              "id": "Idsh3210a0ed-3afd-48ac-930e-f659b80cbf5b",
              "preps": {
                "columns": null,
                "id": "Idsh3210a0ed-3afd-48ac-930e-f659b80cbf5b",
                "label": "动态表格",
                "itemNameLabel": "动态表格",
                "name": "fieldSh3210",
                "elements": [
                  {
                    "id": "sh52afbc11-8a0b-41d5-b088-90ab73e7327f",
                    "rowIndex": 1,
                    "columns": [
                      {
                        "id": "sh1cfe364d-fb10-4373-bc37-5cecb55958f9",
                        "cellVisible": true,
                        "colIndex": 1,
                        "items": [],
                        "colspan": 1,
                        "rowspan": 1,
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "单号",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh12356611-bf62-4bfa-8cb2-16c44d126cd7",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": []
                      },
                      {
                        "id": "sh33515bfc-5a76-4315-b752-bf50f39ef888",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh5c7e44e8-6fb4-4ce0-a158-65ba60616f45",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [],
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "单据类型",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "shcebd5ab9-0554-40f8-8167-34cbe21692b1",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idsh34b38f88-b41b-488e-a496-7eb6b48b818a",
                            "preps": {
                              "id": "Idsh34b38f88-b41b-488e-a496-7eb6b48b818a",
                              "label": "选择器",
                              "itemNameLabel": "选择器",
                              "name": "fieldSh34B3",
                              "clearable": true,
                              "readonly": false,
                              "filterable": true,
                              "collapseTags": true,
                              "collapseTagsTooltip": true,
                              "placeholder": "请选择选择器",
                              "remote": false,
                              "hideLabel": true,
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
                              "elements": [
                                {
                                  "id": "sh86ccf7a6-d660-4b5a-9bb9-f4fd597c598a",
                                  "colIndex": 1,
                                  "columns": [
                                    {
                                      "id": "sh163cdc4c-c425-4283-b40a-3e3b3320a7c4",
                                      "colIndex": 1,
                                      "rowspan": 1,
                                      "colspan": 1,
                                      "items": [],
                                      "cellVisible": true
                                    }
                                  ]
                                }
                              ],
                              "rowNums": 1,
                              "columnNums": 1,
                              "appCompVisible": false,
                              "appLabelVisible": false,
                              "appListVisible": false
                            },
                            "compType": "formItem",
                            "fieldName": "fieldSh34B3",
                            "itemType": "select",
                            "label": "选择器",
                            "type": "select"
                          }
                        ]
                      },
                      {
                        "id": "sh3e2889b6-3273-41f9-a933-a72ad1fdd74f",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh8d848d05-d786-407f-be75-7203def25498",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [],
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "发生时间",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh9c91050b-2e35-454c-a8f4-6e7087543aa3",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idsh1177e7a5-5168-4acf-96e5-b2a106d733f6",
                            "preps": {
                              "id": "Idsh1177e7a5-5168-4acf-96e5-b2a106d733f6",
                              "label": "日期选择器",
                              "itemNameLabel": "日期选择器",
                              "name": "fieldSh1177",
                              "clearable": true,
                              "readonly": false,
                              "type": "date",
                              "hideLabel": true,
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
                              }
                            },
                            "compType": "formItem",
                            "fieldName": "fieldSh1177",
                            "itemType": "date",
                            "label": "日期选择器",
                            "type": "date"
                          }
                        ]
                      },
                      {
                        "id": "sh3cf40f5f-60c5-4925-884f-b14eb564e15a",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      }
                    ]
                  },
                  {
                    "id": "sh3d70a215-df1f-427e-aefa-39c5d8482c84",
                    "colIndex": 1,
                    "columns": [
                      {
                        "id": "sh9ad366c4-0cb4-4dcc-b7b7-7da5cc111de6",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "items": [],
                        "cellVisible": true,
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "工厂地址",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "shf1c70f09-d049-4cc5-a238-b9a984d8dd5a",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idsh51e6933b-32eb-40f2-9c4e-c26eb89bb1e5",
                            "preps": {
                              "id": "Idsh51e6933b-32eb-40f2-9c4e-c26eb89bb1e5",
                              "label": "选择器",
                              "itemNameLabel": "选择器",
                              "name": "fieldSh51E6",
                              "clearable": true,
                              "readonly": false,
                              "filterable": true,
                              "collapseTags": true,
                              "collapseTagsTooltip": true,
                              "placeholder": "请选择选择器",
                              "remote": false,
                              "hideLabel": true,
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
                              }
                            },
                            "compType": "formItem",
                            "fieldName": "fieldSh51E6",
                            "itemType": "select",
                            "label": "选择器",
                            "type": "select"
                          }
                        ]
                      },
                      {
                        "id": "she01b5634-18f6-49db-897b-8d319fdbbde1",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh27c92630-9883-44a1-b70f-896896b2d8c9",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [],
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "线体",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh35f39d3d-cbdb-4753-94f7-d94ad122338a",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idsh51656782-d4ea-4ea2-b61b-e5df4a964a02",
                            "preps": {
                              "id": "Idsh51656782-d4ea-4ea2-b61b-e5df4a964a02",
                              "label": "选择器",
                              "itemNameLabel": "选择器",
                              "name": "fieldSh5165",
                              "clearable": true,
                              "readonly": false,
                              "filterable": true,
                              "collapseTags": true,
                              "collapseTagsTooltip": true,
                              "placeholder": "请选择选择器",
                              "remote": false,
                              "hideLabel": true,
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
                              "appCompVisible": false,
                              "appLabelVisible": false
                            },
                            "compType": "formItem",
                            "fieldName": "fieldSh5165",
                            "itemType": "select",
                            "label": "选择器",
                            "type": "select"
                          }
                        ]
                      },
                      {
                        "id": "shbebdc9d6-2a8a-425e-ab6c-be6ad261ccd0",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "shadb2f9b3-e195-45e3-a9ea-25b266ac7f58",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 3,
                        "cellVisible": true,
                        "items": [],
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh216133a1-0acf-436c-9e66-01515429b5de",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "shb77e44e2-d7b3-4a25-a6e2-211cefab8e2c",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      }
                    ]
                  },
                  {
                    "id": "sh9e270f57-6141-4fce-b0b8-ec67712a3eb4",
                    "colIndex": 1,
                    "columns": [
                      {
                        "id": "shdca36ef6-49e6-4061-8dcd-e394a3c9db8c",
                        "colIndex": 1,
                        "rowspan": 2,
                        "colspan": 1,
                        "items": [],
                        "cellVisible": true,
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "项目",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh902aaf6b-cc46-4068-82b9-8f32c9e14531",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [],
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "客户",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "shf9a1ed8b-dbef-4026-88df-9ef21a487055",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idsheb92c31d-f118-4232-a767-0969f59dbbc0",
                            "preps": {
                              "id": "Idsheb92c31d-f118-4232-a767-0969f59dbbc0",
                              "label": "选择器",
                              "itemNameLabel": "选择器",
                              "name": "fieldSheb92",
                              "clearable": true,
                              "readonly": false,
                              "filterable": true,
                              "collapseTags": true,
                              "collapseTagsTooltip": true,
                              "placeholder": "请选择选择器",
                              "remote": false,
                              "hideLabel": true,
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
                              }
                            },
                            "compType": "formItem",
                            "fieldName": "fieldSheb92",
                            "itemType": "select",
                            "label": "选择器",
                            "type": "select"
                          }
                        ]
                      },
                      {
                        "id": "sh63b56701-d169-4e56-bd54-4f98469f54a0",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "shc5cd6680-e0de-4700-9ca4-24ff5867ea8f",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [],
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "工单",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh276dbc4b-debf-4bc5-bc7d-f353e4786bf7",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idsh470dda02-f4b0-4646-9555-6eb9311abba4",
                            "preps": {
                              "id": "Idsh470dda02-f4b0-4646-9555-6eb9311abba4",
                              "label": "选择器",
                              "itemNameLabel": "选择器",
                              "name": "fieldSh470D",
                              "clearable": true,
                              "readonly": false,
                              "filterable": true,
                              "collapseTags": true,
                              "collapseTagsTooltip": true,
                              "placeholder": "请选择选择器",
                              "remote": false,
                              "hideLabel": true,
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
                              }
                            },
                            "compType": "formItem",
                            "fieldName": "fieldSh470D",
                            "itemType": "select",
                            "label": "选择器",
                            "type": "select"
                          }
                        ]
                      },
                      {
                        "id": "shce4b2b56-1c54-492e-8f60-189741977517",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sha2340505-bb71-4449-9e9e-0a85f578f750",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [],
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "投入数",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "shb5d02585-3898-45bd-bfd0-c98cda5d5706",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idsh1299cb29-a186-442d-b6d8-0d6075fc7a25",
                            "preps": {
                              "id": "Idsh1299cb29-a186-442d-b6d8-0d6075fc7a25",
                              "label": "数字输入框",
                              "itemNameLabel": "数字输入框",
                              "name": "fieldSh1299",
                              "clearable": true,
                              "readonly": false,
                              "placeholder": "请输入数字输入框",
                              "step": 1,
                              "min": 0,
                              "precision": 0,
                              "hideLabel": true,
                              "rules": [],
                              "maxLength": 10,
                              "formVisible": true,
                              "listVisible": true,
                              "viewVisible": true,
                              "formula": {
                                "enable": false,
                                "type": "calc",
                                "sourceFields": [],
                                "expression": ""
                              }
                            },
                            "compType": "formItem",
                            "fieldName": "fieldSh1299",
                            "itemType": "number",
                            "label": "数字输入框",
                            "type": "number"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "id": "sha1744aec-6b77-4fab-93c1-ab224e7608e3",
                    "colIndex": 1,
                    "columns": [
                      {
                        "id": "sh29443574-26d6-437c-add7-da118758e8c6",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "items": [],
                        "cellVisible": false
                      },
                      {
                        "id": "sh14dfd861-7e96-414e-a5af-5e56e84693cd",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [],
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "机型",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "shcae07f8b-7fc9-41b5-8be8-46b29605725b",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idsh6f5e5467-fd67-4a10-a0ef-41035c43a7f3",
                            "preps": {
                              "id": "Idsh6f5e5467-fd67-4a10-a0ef-41035c43a7f3",
                              "label": "选择器",
                              "itemNameLabel": "选择器",
                              "name": "fieldSh6F5E",
                              "clearable": true,
                              "readonly": false,
                              "filterable": true,
                              "collapseTags": true,
                              "collapseTagsTooltip": true,
                              "placeholder": "请选择选择器",
                              "remote": false,
                              "hideLabel": true,
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
                              }
                            },
                            "compType": "formItem",
                            "fieldName": "fieldSh6F5E",
                            "itemType": "select",
                            "label": "选择器",
                            "type": "select"
                          }
                        ]
                      },
                      {
                        "id": "sh8453b81a-6715-48a8-a37f-8614a6539e26",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "she7797d51-4334-4874-bab9-999baf8c1f02",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [],
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "班线",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sha1e0020f-b017-4ae3-9e0c-2e1e1633f236",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idsh8b8a815d-9cd2-4638-af69-f9ea61fcf80d",
                            "preps": {
                              "id": "Idsh8b8a815d-9cd2-4638-af69-f9ea61fcf80d",
                              "label": "选择器",
                              "itemNameLabel": "选择器",
                              "name": "fieldSh8B8A",
                              "clearable": true,
                              "readonly": false,
                              "filterable": true,
                              "collapseTags": true,
                              "collapseTagsTooltip": true,
                              "placeholder": "请选择选择器",
                              "remote": false,
                              "hideLabel": true,
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
                              }
                            },
                            "compType": "formItem",
                            "fieldName": "fieldSh8B8A",
                            "itemType": "select",
                            "label": "选择器",
                            "type": "select"
                          }
                        ]
                      },
                      {
                        "id": "shaaa51355-9a55-4f4f-b161-e73e446dccc2",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh656045ac-594f-4501-82e2-338dcfe63c2f",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [],
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "不良数",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "shc33b9f8f-b17b-4b4b-a4b6-29c3ca3832f0",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idsh0f1661e1-c6e0-4aa8-9b67-d1095cf2d910",
                            "preps": {
                              "id": "Idsh0f1661e1-c6e0-4aa8-9b67-d1095cf2d910",
                              "label": "数字输入框",
                              "itemNameLabel": "数字输入框",
                              "name": "fieldSh0F16",
                              "clearable": true,
                              "readonly": false,
                              "placeholder": "请输入数字输入框",
                              "step": 1,
                              "min": 0,
                              "precision": 0,
                              "hideLabel": true,
                              "rules": [],
                              "maxLength": 10,
                              "formVisible": true,
                              "listVisible": true,
                              "viewVisible": true,
                              "formula": {
                                "enable": false,
                                "type": "calc",
                                "sourceFields": [],
                                "expression": ""
                              }
                            },
                            "compType": "formItem",
                            "fieldName": "fieldSh0F16",
                            "itemType": "number",
                            "label": "数字输入框",
                            "type": "number"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "id": "sh6a82e9b4-7482-41b2-a118-b06f136b6a5c",
                    "colIndex": 1,
                    "columns": [
                      {
                        "id": "sh446072a3-6ca2-41cc-b1f9-66e2349ce8a7",
                        "colIndex": 1,
                        "rowspan": 2,
                        "colspan": 1,
                        "items": [],
                        "cellVisible": true,
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "问题",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "shd102a02e-2b4f-476b-b21b-248a1953a118",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 8,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idsh1d74a1b4-9445-4c5e-8cad-dd5ecad1ac14",
                            "preps": {
                              "id": "Idsh1d74a1b4-9445-4c5e-8cad-dd5ecad1ac14",
                              "label": "富文本编辑器",
                              "itemNameLabel": "富文本编辑器",
                              "name": "fieldSh1D74",
                              "clearable": true,
                              "readonly": false,
                              "hideLabel": true,
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
                              "elements": [
                                {
                                  "id": "shc7b35eb7-c7e9-4e60-810d-54b3a9f170eb",
                                  "colIndex": 1,
                                  "columns": [
                                    {
                                      "id": "sh072739ae-fa31-413a-a80f-df8acb355795",
                                      "colIndex": 1,
                                      "rowspan": 1,
                                      "colspan": 1,
                                      "items": [],
                                      "cellVisible": true
                                    }
                                  ]
                                }
                              ],
                              "rowNums": 1,
                              "columnNums": 1
                            },
                            "compType": "formItem",
                            "fieldName": "fieldSh1D74",
                            "itemType": "htmleditor",
                            "label": "富文本编辑器",
                            "type": "htmleditor"
                          }
                        ],
                        "colHeight": "204.6666717529297px",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "shc1034cda-a538-414f-8a76-caac26500fed",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "shfaaab972-3410-46b7-8048-4b4f9124745f",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "shb9986452-2b4b-4980-9d69-d4f066166de4",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "shc0e091b1-8891-40c2-8666-9f7e1b0f7eb0",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "shcd599895-543c-40fa-b4f6-54a445e39542",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh88500eb3-37f8-4fd4-842e-8963a22555a1",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh6463182a-7818-4ed6-b5d2-a6857e954f8f",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      }
                    ]
                  },
                  {
                    "id": "shabecb406-605c-4c3f-b2e1-cdb281f98f45",
                    "colIndex": 1,
                    "columns": [
                      {
                        "id": "shfd244668-5952-4788-9dd2-867acc1a1b6b",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "items": [],
                        "cellVisible": false
                      },
                      {
                        "id": "sh0321ccda-1a8b-4eb1-95d4-af19bae0755f",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 8,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idsh21196690-333a-4fed-9bdc-1d565bb779d8",
                            "preps": {
                              "id": "Idsh21196690-333a-4fed-9bdc-1d565bb779d8",
                              "label": "多行文本框",
                              "itemNameLabel": "多行文本框",
                              "name": "fieldSh2119",
                              "clearable": true,
                              "readonly": false,
                              "placeholder": "请输入多行文本框",
                              "hideLabel": true,
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
                              "appCompVisible": false,
                              "appLabelVisible": false
                            },
                            "compType": "formItem",
                            "fieldName": "fieldSh2119",
                            "itemType": "textarea",
                            "label": "多行文本框",
                            "type": "textarea"
                          }
                        ],
                        "colHeight": "151px",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh2b14e962-8f3f-4272-ac80-07a8a960efe8",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh4f6b507f-60d7-4273-add2-ff9057343303",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh46ed21cf-9b42-418c-a4b5-7ea9914a13d6",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh8d3e7bc6-a8fc-4513-9d30-a7c0312be16e",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "she939ce15-a82f-418c-9209-55b45697d55a",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "she677cebb-77e8-4506-9172-023516d8f5d4",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh3befcf1d-d518-46ea-b9a1-338213ee2174",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      }
                    ]
                  },
                  {
                    "id": "sh21c5ac49-4095-451a-9f86-daffe965c218",
                    "colIndex": 1,
                    "columns": [
                      {
                        "id": "shcb7863c1-28aa-4164-bf08-0c87a141b4d5",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "items": [],
                        "cellVisible": true,
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "提出人",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh7033b329-f78b-4b28-8a74-d1cee35917e9",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idshc9cc7614-7d75-43e8-8e74-97ab4676facc",
                            "preps": {
                              "id": "Idshc9cc7614-7d75-43e8-8e74-97ab4676facc",
                              "label": "数据选择器",
                              "itemNameLabel": "数据选择器",
                              "name": "fieldShc9Cc",
                              "clearable": true,
                              "readonly": false,
                              "hideLabel": true,
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
                              "filterable": true,
                              "collapseTags": true,
                              "displayMode": "label",
                              "enableHierarchy": true
                            },
                            "compType": "formItem",
                            "fieldName": "fieldShc9Cc",
                            "itemType": "datapicker",
                            "label": "数据选择器",
                            "type": "datapicker"
                          }
                        ]
                      },
                      {
                        "id": "sha8f1da01-c0ce-4af7-a305-f1d86c379009",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh5ca6aed3-9221-4cf7-a214-b2d4961fc7b5",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [],
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "TO",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh3eb7e911-fecb-44dc-b3c8-b0d9c1227515",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idshb21e6830-99a6-4ce1-8662-baa3d7d76ea0",
                            "preps": {
                              "id": "Idshb21e6830-99a6-4ce1-8662-baa3d7d76ea0",
                              "label": "数据选择器",
                              "itemNameLabel": "数据选择器",
                              "name": "fieldShb21E",
                              "clearable": true,
                              "readonly": false,
                              "filterable": true,
                              "collapseTags": true,
                              "displayMode": "label",
                              "enableHierarchy": true,
                              "hideLabel": true,
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
                              }
                            },
                            "compType": "formItem",
                            "fieldName": "fieldShb21E",
                            "itemType": "datapicker",
                            "label": "数据选择器",
                            "type": "datapicker"
                          }
                        ]
                      },
                      {
                        "id": "sh3fad3615-7587-4f4b-8875-5a0691b76ecb",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh7e2f12d8-0b42-43d5-aa85-8408549d2927",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [],
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "CC",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh47494914-e375-4d38-9e9a-35fbac71b49c",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idsh7c9f9ded-55d3-4755-8416-40c849ec45ae",
                            "preps": {
                              "id": "Idsh7c9f9ded-55d3-4755-8416-40c849ec45ae",
                              "label": "数据选择器",
                              "itemNameLabel": "数据选择器",
                              "name": "fieldSh7C9F",
                              "clearable": true,
                              "readonly": false,
                              "filterable": true,
                              "collapseTags": true,
                              "displayMode": "label",
                              "enableHierarchy": true,
                              "hideLabel": true,
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
                              "appCompVisible": false,
                              "appLabelVisible": false,
                              "userDefinePreps": {}
                            },
                            "compType": "formItem",
                            "fieldName": "fieldSh7C9F",
                            "itemType": "datapicker",
                            "label": "数据选择器",
                            "type": "datapicker"
                          }
                        ]
                      },
                      {
                        "id": "sh2fdb909d-58d5-4678-866b-be16a73f2fae",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      }
                    ]
                  }
                ],
                "rules": [],
                "maxLength": 255,
                "formVisible": true,
                "listVisible": true,
                "viewVisible": true,
                "rowNums": 7,
                "columnNums": 9,
                "appCompVisible": false,
                "appLabelVisible": false
              },
              "compType": "container",
              "fieldName": "fieldSh3210",
              "itemType": "dytable",
              "rowNums": 7,
              "columnNums": 9,
              "type": "dytable"
            }
          ],
          "sameForm": false,
          "showStepBar": true,
          "showNavButtons": true,
          "direction": "horizontal",
          "stepStyle": "process",
          "mustCompleteStep": true,
          "flowConfig": {
            "mode": "design",
            "flowFlag": "N",
            "paramFields": [],
            "assigneeType": "starter_pick",
            "assigneeField": "",
            "assigneeValue": [],
            "ccValue": [],
            "visibleScope": "prev_and_self",
            "rejectPolicy": "to_prev"
          }
        },
        {
          "label": "改善措施",
          "subTablePrimaryKey": "step2",
          "subTableName": "step2",
          "subFormFlag": "N",
          "items": [
            {
              "id": "Idshb03c1906-d133-45b5-be6c-98a2082fe281",
              "preps": {
                "columns": null,
                "id": "Idshb03c1906-d133-45b5-be6c-98a2082fe281",
                "label": "动态表格",
                "itemNameLabel": "动态表格",
                "name": "fieldShb03C",
                "elements": [
                  {
                    "id": "sh3806cc74-accb-4107-a658-8b73caaebec9",
                    "rowIndex": 1,
                    "columns": [
                      {
                        "id": "she885ac28-eb5e-4bed-beea-6b57f050a091",
                        "cellVisible": true,
                        "colIndex": 1,
                        "items": [],
                        "colspan": 1,
                        "rowspan": 1,
                        "colHeight": "118px",
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "长期措施",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh9ddf7fcb-e8fe-4d58-a368-27f1cbf0c89c",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 8,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idshb06c3788-33aa-4d7e-aa1b-1c193b3b7345",
                            "preps": {
                              "id": "Idshb06c3788-33aa-4d7e-aa1b-1c193b3b7345",
                              "label": "多行文本框",
                              "itemNameLabel": "多行文本框",
                              "name": "fieldShb06C",
                              "clearable": true,
                              "readonly": false,
                              "placeholder": "请输入多行文本框",
                              "hideLabel": true,
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
                              "elements": [
                                {
                                  "id": "sh3ca7600c-6333-4b93-a55a-e0709ecb880e",
                                  "colIndex": 1,
                                  "columns": [
                                    {
                                      "id": "sha99999c3-0756-4005-9588-8e9cc57f3da5",
                                      "colIndex": 1,
                                      "rowspan": 1,
                                      "colspan": 1,
                                      "items": [],
                                      "cellVisible": true
                                    }
                                  ]
                                }
                              ],
                              "rowNums": 1,
                              "columnNums": 1
                            },
                            "compType": "formItem",
                            "fieldName": "fieldShb06C",
                            "itemType": "textarea",
                            "label": "多行文本框",
                            "type": "textarea"
                          }
                        ],
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh25bc8bf9-a053-410c-b338-d26a3567d1f2",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "shca7d1280-7396-4117-b506-19647243a4ea",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "shdc3283d2-7ce7-4f2b-b822-5a37415fb594",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh4463e065-0393-43a7-8a94-b0f1009e8e78",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh24e7d75f-628f-4670-90b8-26940e0edbbb",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh8dda0e54-8c51-4fe2-8c29-eed70c21547a",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sha916f283-14d1-4753-9fd2-360eb4c9a336",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      }
                    ]
                  },
                  {
                    "id": "sh80d76de1-bbf3-4cc5-b332-178ce2169778",
                    "columns": [
                      {
                        "id": "sh816fdd93-8e35-449c-b3bd-4e214986b968",
                        "colspan": 1,
                        "rowspan": 1,
                        "items": [],
                        "cellVisible": true,
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "回复时间",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh6c9312aa-8573-4551-968b-9c050fd6dd88",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idshbfd99546-7653-48a7-a9be-c04616e1cdce",
                            "preps": {
                              "id": "Idshbfd99546-7653-48a7-a9be-c04616e1cdce",
                              "label": "日期选择器",
                              "itemNameLabel": "日期选择器",
                              "name": "fieldShbfd9",
                              "clearable": true,
                              "readonly": false,
                              "type": "date",
                              "hideLabel": true,
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
                              }
                            },
                            "compType": "formItem",
                            "fieldName": "fieldShbfd9",
                            "itemType": "date",
                            "label": "日期选择器",
                            "type": "date"
                          }
                        ]
                      },
                      {
                        "id": "sh080af7b6-6c8d-4e9c-88dc-9c0b88b2c368",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "shc98d5a38-1261-4a5a-8903-7c29f0699f09",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 6,
                        "cellVisible": true,
                        "items": [],
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh498d38c0-d5c2-4e9b-a253-a2219c12cbe5",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "shdeb185e1-1dd8-4d98-be6a-2bcbde0ccafa",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh1aee8812-9782-419a-9cad-73a222ce3a7b",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "shf4ce6d6f-926a-4fef-835c-6db104954859",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh8351c918-e1c7-4735-b175-8107cb188509",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      }
                    ]
                  },
                  {
                    "id": "sh40d8186e-748a-414e-9a55-2ea0dbc6aadd",
                    "columns": [
                      {
                        "id": "sh97d3e349-ed37-4f39-b6fa-5247fd02be4b",
                        "colspan": 1,
                        "rowspan": 1,
                        "items": [],
                        "cellVisible": true,
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "改善人",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh6c0274dd-f34c-4d6b-b281-32ef3a375ee3",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idsh5715b714-47b9-4006-895a-3c44531a4fb0",
                            "preps": {
                              "id": "Idsh5715b714-47b9-4006-895a-3c44531a4fb0",
                              "label": "数据选择器",
                              "itemNameLabel": "数据选择器",
                              "name": "fieldSh5715",
                              "clearable": true,
                              "readonly": false,
                              "filterable": true,
                              "collapseTags": true,
                              "displayMode": "label",
                              "enableHierarchy": true,
                              "hideLabel": true,
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
                              "elements": [
                                {
                                  "id": "sh48992a02-3ce4-4303-8a45-63a5a9d6f1a6",
                                  "colIndex": 1,
                                  "columns": [
                                    {
                                      "id": "sh4db36db5-0493-4eb4-b04c-e15173ddcd56",
                                      "colIndex": 1,
                                      "rowspan": 1,
                                      "colspan": 1,
                                      "items": [],
                                      "cellVisible": true
                                    }
                                  ]
                                }
                              ],
                              "rowNums": 1,
                              "columnNums": 1
                            },
                            "compType": "formItem",
                            "fieldName": "fieldSh5715",
                            "itemType": "datapicker",
                            "label": "数据选择器",
                            "type": "datapicker"
                          }
                        ]
                      },
                      {
                        "id": "sh246f9af5-2571-43ab-a758-17a66948ccce",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh66a907de-fc5d-4761-bd30-41d6027e5d36",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [],
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "TO",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh7ade2aef-da66-4f61-a626-a6962b85518e",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idshc4c3c334-3383-426d-a720-22291218d4f8",
                            "preps": {
                              "id": "Idshc4c3c334-3383-426d-a720-22291218d4f8",
                              "label": "数据选择器",
                              "itemNameLabel": "数据选择器",
                              "name": "fieldShc4C3",
                              "clearable": true,
                              "readonly": false,
                              "filterable": true,
                              "collapseTags": true,
                              "displayMode": "label",
                              "enableHierarchy": true,
                              "hideLabel": true,
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
                              }
                            },
                            "compType": "formItem",
                            "fieldName": "fieldShc4C3",
                            "itemType": "datapicker",
                            "label": "数据选择器",
                            "type": "datapicker"
                          }
                        ]
                      },
                      {
                        "id": "shd8d68f17-e969-4823-9cb0-769777533212",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      },
                      {
                        "id": "sh70ea486a-5265-4513-8016-2a1a20d61634",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": true,
                        "items": [],
                        "dataType": "text",
                        "staticData": true,
                        "visiblePlatform": "all",
                        "textContent": "CC",
                        "configRowType": "currentRow"
                      },
                      {
                        "id": "sh809abff7-61f9-4ba2-a6fa-10dc8b6af57a",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 2,
                        "cellVisible": true,
                        "items": [
                          {
                            "id": "Idshc8268ad8-7c8f-4261-8dd4-5667f9695070",
                            "preps": {
                              "id": "Idshc8268ad8-7c8f-4261-8dd4-5667f9695070",
                              "label": "数据选择器",
                              "itemNameLabel": "数据选择器",
                              "name": "fieldShc826",
                              "clearable": true,
                              "readonly": false,
                              "filterable": true,
                              "collapseTags": true,
                              "displayMode": "label",
                              "enableHierarchy": true,
                              "hideLabel": true,
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
                              }
                            },
                            "compType": "formItem",
                            "fieldName": "fieldShc826",
                            "itemType": "datapicker",
                            "label": "数据选择器",
                            "type": "datapicker"
                          }
                        ]
                      },
                      {
                        "id": "sha3d6a67c-d28e-4d2f-a94b-df7f9913d056",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "cellVisible": false,
                        "items": []
                      }
                    ]
                  }
                ],
                "rules": [],
                "maxLength": 255,
                "formVisible": true,
                "listVisible": true,
                "viewVisible": true,
                "rowNums": 3,
                "columnNums": 9
              },
              "compType": "container",
              "fieldName": "fieldShb03C",
              "itemType": "dytable",
              "rowNums": 3,
              "columnNums": 9,
              "type": "dytable"
            }
          ],
          "flowConfig": {
            "mode": "design",
            "flowFlag": "N",
            "paramFields": [],
            "assigneeType": "starter_pick",
            "assigneeField": "",
            "assigneeValue": [],
            "ccValue": [],
            "visibleScope": "prev_and_self",
            "rejectPolicy": "to_prev"
          },
          "formVisible": "N"
        },
        {
          "label": "效果确认(QE)",
          "subTablePrimaryKey": "step3",
          "subTableName": "step3",
          "subFormFlag": "N",
          "items": [
            {
              "id": "Idsh02caa8f7-8f6c-4b0f-9002-5fe7b2a5320f",
              "label": "效果",
              "fieldName": "fieldSh02Ca",
              "compType": "formItem",
              "itemType": "textarea",
              "preps": {
                "id": "Idsh02caa8f7-8f6c-4b0f-9002-5fe7b2a5320f",
                "listVisible": true,
                "formVisible": true,
                "hideLabel": false,
                "name": "fieldSh02Ca",
                "label": "效果",
                "itemNameLabel": "多行文本框",
                "clearable": true,
                "readonly": false,
                "placeholder": "请输入效果",
                "rules": [],
                "formula": {
                  "enable": false,
                  "type": "calc",
                  "sourceFields": [],
                  "expression": ""
                },
                "elements": [
                  {
                    "id": "sheaa8f2d5-6a55-4f1a-b45a-cc6a991ac474",
                    "colIndex": 1,
                    "columns": [
                      {
                        "id": "sh7da1a2dd-1342-4b80-a3e9-1e16aebf239a",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "items": [],
                        "cellVisible": true
                      }
                    ]
                  }
                ],
                "rowNums": 1,
                "columnNums": 1
              },
              "type": "textarea"
            },
            {
              "id": "Idsh4d6a56be-53f1-45be-aed5-78ac74c5c082",
              "label": "取人时间",
              "fieldName": "fieldSh4D6A",
              "compType": "formItem",
              "itemType": "date",
              "preps": {
                "id": "Idsh4d6a56be-53f1-45be-aed5-78ac74c5c082",
                "listVisible": true,
                "formVisible": true,
                "hideLabel": false,
                "name": "fieldSh4D6A",
                "label": "取人时间",
                "itemNameLabel": "日期选择器",
                "clearable": true,
                "readonly": false,
                "placeholder": "请输入取人时间",
                "rules": [],
                "formula": {
                  "enable": false,
                  "type": "calc",
                  "sourceFields": [],
                  "expression": ""
                },
                "elements": [
                  {
                    "id": "shb738b540-c9c3-4b9e-9504-be346d92c396",
                    "colIndex": 1,
                    "columns": [
                      {
                        "id": "sh350e2f4e-102a-4e4d-aef8-5fb83d19f9b1",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "items": [],
                        "cellVisible": true
                      }
                    ]
                  }
                ],
                "rowNums": 1,
                "columnNums": 1,
                "type": "date"
              },
              "type": "date"
            },
            {
              "id": "Idsh8bb37dc1-db7d-41fc-9a1c-50f33eb975e1",
              "label": "确认人",
              "fieldName": "fieldSh8Bb3",
              "compType": "formItem",
              "itemType": "datapicker",
              "preps": {
                "id": "Idsh8bb37dc1-db7d-41fc-9a1c-50f33eb975e1",
                "listVisible": true,
                "formVisible": true,
                "hideLabel": false,
                "name": "fieldSh8Bb3",
                "label": "确认人",
                "itemNameLabel": "数据选择器",
                "clearable": true,
                "readonly": false,
                "placeholder": "请输入确认人",
                "rules": [],
                "formula": {
                  "enable": false,
                  "type": "calc",
                  "sourceFields": [],
                  "expression": ""
                },
                "elements": [
                  {
                    "id": "sh3cdc431d-10db-4ef4-bbbb-c06fecdbc30b",
                    "colIndex": 1,
                    "columns": [
                      {
                        "id": "shc97ab0df-3dee-436f-99c8-51866c438273",
                        "colIndex": 1,
                        "rowspan": 1,
                        "colspan": 1,
                        "items": [],
                        "cellVisible": true
                      }
                    ]
                  }
                ],
                "rowNums": 1,
                "columnNums": 1,
                "filterable": true,
                "collapseTags": true,
                "displayMode": "label",
                "enableHierarchy": true
              },
              "type": "datapicker"
            }
          ],
          "flowConfig": {
            "mode": "design",
            "flowFlag": "N",
            "paramFields": [],
            "assigneeType": "starter_pick",
            "assigneeField": "",
            "assigneeValue": [],
            "ccValue": [],
            "visibleScope": "prev_and_self",
            "rejectPolicy": "to_prev"
          },
          "formVisible": "N"
        }
      ],
      "sameForm": true,
      "stepStyle": "flat",
      "mustCompleteStep": true,
      "showStepBar": false,
      "showNavButtons": false,
      "direction": "horizontal",
      "simple": false,
      "alignCenter": false,
      "finishStatus": "finish",
      "processStatus": "process",
      "rules": [],
      "finishIcon": "",
      "rowNums": 2,
      "columnNums": 1
    },
    "compType": "container",
    "fieldName": "fieldSh83Fb",
    "itemType": "step",
    "type": "step",
    "activeItemName": "step1",
    "priority": 1
  }
];
onMounted(() => {
  const result = analysisCompDatas(fields);
  dataItem.value = result;
  // let result2 = convertCompToAppComps(dataItem.value);
  // dataItem.value = result2;

  console.log("xxx", result.selectList);
});
</script>

<style lang="scss" scoped></style>
