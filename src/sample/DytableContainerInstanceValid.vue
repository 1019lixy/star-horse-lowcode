<template>
  <el-scrollbar>
    <!--    <dytable-item :dataForm="formData" :item="dataItem"  :formInfo="{}" />-->
    <star-horse-form :fieldList="fieldList" labelPosition="top"/>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {analysisComps} from "@/api/form_utils";
import {StarHorseForm} from "@/components/comp";
import {getDesignFormStore} from "@/store/StoreManager";

let designForm = getDesignFormStore();
const formData = ref<any>({});
const dataItem = ref<any>({
  fieldList: []
});
const fields = [
  {
    "id": "Idsh653677fa-0216-41fa-aa08-9c2a0e32fd70",
    "preps": {
      "id": "Idsh653677fa-0216-41fa-aa08-9c2a0e32fd70",
      "label": "动态表格",
      "itemNameLabel": "动态表格",
      "name": "dytable1",
      "elements": [
        {
          "id": "shbc1f657c-401a-4db3-a1aa-72e6ea59c0d8",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh0e40be0c-08f5-4281-8067-d893feffaacb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 12,
              "items": [
                {
                  "id": "Idsh8b2f5c84-b037-41f2-baa6-7c35bcf9ebdb",
                  "preps": {
                    "id": "Idsh8b2f5c84-b037-41f2-baa6-7c35bcf9ebdb",
                    "label": "Html组件",
                    "itemNameLabel": "Html组件",
                    "name": "html2",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "elements": [
                      {
                        "id": "shd7bc6ed6-b019-43f7-a5d3-f9e0431c95d8",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh6fac1cf2-f0a0-41a5-8236-2f7558ca848a",
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
                    "staticData": true,
                    "textContent": "<p style=\"text-align: center;\"><span style=\"font-size: 19px;\">四川华平通讯设备有限公司</span></p><p style=\"text-align: center;\"><span style=\"font-size: 19px;\">SMT首件确认表</span></p>"
                  },
                  "compType": "formItem",
                  "fieldName": "html2",
                  "itemType": "html",
                  "label": "Html组件",
                  "type": "html"
                }
              ],
              "cellVisible": true,
              "colHeight": "117px",
              "colWidth": "43px"
            },
            {
              "id": "shabe7e5c9-5a22-452a-b8b3-045a5b348f5b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "shaf3c76b4-87b8-4908-9c02-5fa7e9cde95e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh32d9e1a8-004e-4a68-ba08-d9c832f98ba1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh6d2349d9-f092-4636-8f98-779576bc2538",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh7a30c3ba-fa95-4977-98ce-20997b6160e9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh2799fc61-f655-4cf8-acff-66f7058b1997",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh91da8107-4f18-40a4-8632-bc22906d4c1b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shd06de100-ee31-4126-a0f8-52e3727a5bb4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh1cd2a17a-a0c5-47a0-bfdf-12af9650afcf",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh8ac50f30-0f74-4f08-8811-b83dffe9ebd5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh448ea754-7b2d-493e-813a-6ccc0866cb6a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh74d017ed-b675-4d1a-8c2e-8a81d015e2b4",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh8ecd9e1e-5a16-4fab-a1f1-bafe53e4d053",
              "colIndex": 1,
              "rowspan": 4,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshdc1638f0-135f-4d46-8b5a-5d83c0f41575",
                  "preps": {
                    "id": "Idshdc1638f0-135f-4d46-8b5a-5d83c0f41575",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text13",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "placeholder": "",
                    "staticData": true,
                    "textContent": "基本信息"
                  },
                  "compType": "formItem",
                  "fieldName": "text13",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true,
              "colWidth": "43px"
            },
            {
              "id": "sh9c439420-4e76-4a19-b5d0-eaeaf519ce03",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idsh8ec80e87-e88f-4c97-805d-c96019ada3f8",
                  "preps": {
                    "id": "Idsh8ec80e87-e88f-4c97-805d-c96019ada3f8",
                    "label": "线别",
                    "itemNameLabel": "单行文本框",
                    "name": "xianbie",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入线别",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "xianbie",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true,
              "colWidth": "39px"
            },
            {
              "id": "sh232ab696-d43f-4bcd-8150-fdeeddd17368",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "she2467ca1-b1d5-4cb5-bcfc-cd3317c1e032",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh263010f1-003a-46cb-8ee5-34dc624b4e19",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sha552f21e-008b-481e-9498-bfe00b8dac33",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh65a619f1-cbba-4b37-81a3-35e1625074ea",
                  "preps": {
                    "id": "Idsh65a619f1-cbba-4b37-81a3-35e1625074ea",
                    "label": "日期/班别",
                    "itemNameLabel": "单行文本框",
                    "name": "riqibanbie",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入日期/班别",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "riqibanbie",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh49a3e540-fa70-4d8c-aeb3-5799a41f1b99",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shb71dba1e-137f-404c-98dd-255762bd7f93",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh311ab125-b246-4735-a015-73d14eb3132e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idsh6b1ca9c9-4852-4531-8853-3d47fc176b7d",
                  "preps": {
                    "id": "Idsh6b1ca9c9-4852-4531-8853-3d47fc176b7d",
                    "label": "生产工单号",
                    "itemNameLabel": "单行文本框",
                    "name": "scgd",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入生产工单号",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "scgd",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shd1769dd4-e01c-4ceb-a528-67da01a7c620",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "she3afbab8-5f00-4e3f-b717-29d0ff9e9236",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shd50e58a0-36cc-4cf1-905e-1025ddc91fc0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh5190c444-77b5-4a69-9ec2-099d6ece8337",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh3efc6501-30bd-4095-abd7-f8ac27816f31",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh61c5bb36-bf61-466a-a943-60dbf069f185",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idsh5f62a6a8-9cc7-4f52-9e21-0fd39b415e91",
                  "preps": {
                    "id": "Idsh5f62a6a8-9cc7-4f52-9e21-0fd39b415e91",
                    "label": "产品名称",
                    "itemNameLabel": "单行文本框",
                    "name": "cpmc",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入产品名称",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "cpmc",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true,
              "colWidth": "39px"
            },
            {
              "id": "shb3463cf8-3505-4465-81c9-58812efcbdad",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh8ca7801f-d722-4f0d-a54c-5f088d19dd89",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shf909c3b5-7882-486f-af4a-ca07f267eb9f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh1dbb1872-bc38-4b57-8c54-fbdb43551b5d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh9727bfe0-830d-4c61-94cb-9315c8de8a9b",
                  "preps": {
                    "id": "Idsh9727bfe0-830d-4c61-94cb-9315c8de8a9b",
                    "label": "软件版本",
                    "itemNameLabel": "单行文本框",
                    "name": "rjbb",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入软件版本",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "rjbb",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh7949cc4c-c6ea-485c-8e57-cbdf232042c7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh83d9ce6d-fe59-46a0-b4b1-2023bc06c71d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh5bea1d45-8ff0-4a08-9753-52cbc2e2190a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idsh89a24631-d0bf-430a-b4ce-749605fb6c70",
                  "preps": {
                    "id": "Idsh89a24631-d0bf-430a-b4ce-749605fb6c70",
                    "label": "BOM",
                    "itemNameLabel": "单行文本框",
                    "name": "bom",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入BOM",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "bom",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh9bca2b53-d731-44ac-9f1b-738dc01e4dc8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "she350643f-72ff-46dd-9b6c-46a5e2c661d1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "she36ea2db-fe75-430c-b18c-29ccb3ee5632",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh68867619-89d8-45e0-b45c-ac6ed321f223",
          "colIndex": 1,
          "columns": [
            {
              "id": "shd2b41b6d-97af-4e87-8f42-547ff65e279e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh88f97cb9-95b6-40b0-94e2-86c801bcd2ff",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idsh8ebdd884-7b35-4e1f-b8a6-49fe4d3b6ba3",
                  "preps": {
                    "id": "Idsh8ebdd884-7b35-4e1f-b8a6-49fe4d3b6ba3",
                    "itemNameLabel": "数字输入框",
                    "name": "plybs",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入批量/样本数",
                    "step": 1,
                    "min": 0,
                    "precision": 0,
                    "rules": [],
                    "maxLength": 10,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "批量/样本数"
                  },
                  "compType": "formItem",
                  "fieldName": "plybs",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "cellVisible": true,
              "colWidth": "39px"
            },
            {
              "id": "sh52963159-96c6-4894-af9d-038b6b275658",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shc8db3bbd-0f93-406b-bc0e-9771e0955db6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh028e237a-41d6-48bf-a15d-b78ef8c7e6e6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh4d80d065-4f74-45ba-a63a-fc14b10cafc9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh9f4ddc78-2d90-4917-8895-612cecc0f885",
                  "preps": {
                    "id": "Idsh9f4ddc78-2d90-4917-8895-612cecc0f885",
                    "label": "PCB版本/周期",
                    "itemNameLabel": "单行文本框",
                    "name": "pcbbbzq",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入PCB版本/周期",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "pcbbbzq",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh078048bd-9c43-43fa-917e-fe960684f432",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sha2a48d52-0340-403f-8a4a-40e3a58da668",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh043eb6ab-e71a-4292-8a56-51b89d42c393",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idshc1bd2d32-5113-406b-a20c-f28cb41ec033",
                  "preps": {
                    "id": "Idshc1bd2d32-5113-406b-a20c-f28cb41ec033",
                    "label": "类别",
                    "itemNameLabel": "单选框",
                    "name": "leibie",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入单行文本框",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "有铅",
                        "value": "youqian",
                        "xh": 1
                      },
                      {
                        "name": "无铅",
                        "value": "wuqian",
                        "xh": 2
                      },
                      {
                        "name": "混合工艺",
                        "value": "hhgy",
                        "xh": 3
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ],
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "leibie",
                  "itemType": "radio",
                  "label": "单行文本框",
                  "type": "radio"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh77279b4b-b1a2-4381-a2e9-3b4bcd50bc34",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh00dcb6ef-d9db-4916-9eef-1704358eca77",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shee35bf6f-927d-456a-bced-42d4192a24a6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "she0065be6-d6bf-4d3f-99be-aa78c7773844",
          "colIndex": 1,
          "columns": [
            {
              "id": "shbcb73c71-01bf-4f89-879a-fbdd0ca9f542",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 11,
              "items": [
                {
                  "id": "Idshb8f4512a-e6f9-4078-a21e-8e00d289f7df",
                  "preps": {
                    "id": "Idshb8f4512a-e6f9-4078-a21e-8e00d289f7df",
                    "label": "首件类型",
                    "itemNameLabel": "单选框",
                    "name": "shoujianleixing",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "每班首检",
                        "value": "mbsj",
                        "xh": 1
                      },
                      {
                        "name": "重大工艺更改",
                        "value": "zdgygg",
                        "xh": 2
                      },
                      {
                        "name": "转线（机型）",
                        "value": "zxjx",
                        "xh": 3
                      },
                      {
                        "name": "新机型试产",
                        "value": "xjxsc",
                        "xh": 4
                      },
                      {
                        "name": "软件变更",
                        "value": "rjbg",
                        "xh": 5
                      },
                      {
                        "name": "返工",
                        "value": "fangong",
                        "xh": 6
                      },
                      {
                        "name": "调机（印刷、贴片）",
                        "value": "tjystp",
                        "xh": 7
                      },
                      {
                        "name": "机台设备程序变更",
                        "value": "jtsbcxbg",
                        "xh": 8
                      },
                      {
                        "name": "回流曲线变更",
                        "value": "hlqxbg",
                        "xh": 9
                      },
                      {
                        "name": "物料变更（主/辅料）",
                        "value": "wlbgzfl",
                        "xh": 10
                      },
                      {
                        "name": "设计变更",
                        "value": "sjbg",
                        "xh": 11
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "shoujianleixing",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ],
              "cellVisible": true,
              "colHeight": "64px",
              "colWidth": "43px"
            },
            {
              "id": "sh45d9f465-439c-4d8a-a9e8-72141ce59383",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh9f01a224-5fde-4cfb-becc-f8ba57f2a599",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh4c7f901e-45a8-4094-95ec-880487a3e9a6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh9bf2a9e0-df46-40a4-accb-0e8c548ec109",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh59ea26e0-6f41-4cd1-adcf-b2237712f3c5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh67585611-d93b-44cc-8cf2-7ce4e8984424",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shb459621c-4df0-4b05-9a50-07d9c96fc3b4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh7c9ea915-6260-40b7-a7d9-981e89e1c286",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shefb28f8c-937f-4b3c-b626-6861be8a537e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sha7d7d5ce-951d-4ff5-852c-3e5574d48990",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh0f939f6e-7fdb-4531-88f9-dd8a7530f242",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": true
            }
          ]
        },
        {
          "id": "shf0752a60-67f0-47f2-890a-b04cf51102ae",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh16d47bca-0d3f-4f62-9f79-4962f5bd0514",
              "colIndex": 1,
              "rowspan": 28,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshf5f1b938-4b40-482b-af9c-1c10e53f27be",
                  "preps": {
                    "id": "Idshf5f1b938-4b40-482b-af9c-1c10e53f27be",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text17",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "检验及分析内容"
                  },
                  "compType": "formItem",
                  "fieldName": "text17",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true,
              "colWidth": "43px"
            },
            {
              "id": "sh8f1f31f3-1420-4095-ac14-e9c7c82915f0",
              "colIndex": 1,
              "rowspan": 6,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh2b00ee97-5e42-4303-8594-020779470d53",
                  "preps": {
                    "id": "Idsh2b00ee97-5e42-4303-8594-020779470d53",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text18",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "胶纸板首检确认"
                  },
                  "compType": "formItem",
                  "fieldName": "text18",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true,
              "colWidth": "39px"
            },
            {
              "id": "shd7f7c35d-1c62-401b-ae97-f8eb0886676f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh7420055c-a15f-48f0-8a51-4afca4d42057",
                  "preps": {
                    "id": "Idsh7420055c-a15f-48f0-8a51-4afca4d42057",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text19",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "检验项目"
                  },
                  "compType": "formItem",
                  "fieldName": "text19",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sha45485a1-044a-418b-aadd-a59d4151cc98",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh889808e4-5302-4e94-9100-f61fbf5e9786",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh9d9fab64-5490-4da2-8640-159f15ac0f02",
                  "preps": {
                    "id": "Idsh9d9fab64-5490-4da2-8640-159f15ac0f02",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text20",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "起始时间",
                    "appCompVisible": true,
                    "labelFor": [
                      "qssj1",
                      "qssj70",
                      "qssj71",
                      "qssj72",
                      "qssj73",
                      "qssj74",
                      "qssj75",
                      "qssj76",
                      "qssj77",
                      "qssj78",
                      "qssj79",
                      "qssj80",
                      "qssj81",
                      "qssj82",
                      "qssj83",
                      "qssj84",
                      "qssj85",
                      "qssj86",
                      "qssj87",
                      "qssj88",
                      "qssj89",
                      "qssj90",
                      "qssj91",
                      "qssj92",
                      "qssj93",
                      "qssj94",
                      "qssj95"
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "text20",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh73087feb-46a8-40ee-bfea-9bd40621aff4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh1db26fed-3d67-4529-b250-25eaf3729fe6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh84e6658f-d537-4eb1-af96-599051921934",
                  "preps": {
                    "id": "Idsh84e6658f-d537-4eb1-af96-599051921934",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text21",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "数据记录",
                    "labelFor": [
                      "sjjl96",
                      "sjjl97",
                      "sjjl98",
                      "sjjl99",
                      "sjjl100",
                      "sjjl101",
                      "sjjl102",
                      "sjjl103",
                      "sjjl104",
                      "sjjl105",
                      "sjjl106",
                      "sjjl107",
                      "sjjl108",
                      "sjjl109",
                      "sjjl110",
                      "sjjl111",
                      "sjjl112",
                      "sjjl113",
                      "sjjl114",
                      "sjjl115",
                      "sjjl116",
                      "sjjl117",
                      "sjjl118",
                      "sjjl119",
                      "sjjl120",
                      "sjjl121"
                    ],
                    "appCompVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "text21",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh6910e550-c205-44ac-b0b4-8f29e8f6e49e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh7d928dac-17de-4ffd-b385-a0034be45725",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsha3e9a2de-a5aa-4246-8137-c758272ec7da",
                  "preps": {
                    "id": "Idsha3e9a2de-a5aa-4246-8137-c758272ec7da",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text22",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "异常原因/对策",
                    "placeholder": "",
                    "appCompVisible": true,
                    "labelFor": [
                      "ycyydc1",
                      "ycyydc122",
                      "ycyydc123",
                      "ycyydc124",
                      "ycyydc125",
                      "ycyydc126",
                      "ycyydc127",
                      "ycyydc128",
                      "ycyydc129",
                      "ycyydc130",
                      "ycyydc131",
                      "ycyydc132",
                      "ycyydc133",
                      "ycyydc134",
                      "ycyydc135",
                      "ycyydc136",
                      "ycyydc137",
                      "ycyydc138",
                      "ycyydc139",
                      "ycyydc140",
                      "ycyydc141",
                      "ycyydc142",
                      "ycyydc143",
                      "ycyydc144",
                      "ycyydc145",
                      "ycyydc146",
                      "ycyydc147"
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "text22",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shd0c710ac-a9f9-4659-b1ea-40f13713e8d7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh49716cd1-1438-45e2-aaba-f648eb719980",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsha232a70e-81d7-4d64-a637-b47f9b0a579c",
                  "preps": {
                    "id": "Idsha232a70e-81d7-4d64-a637-b47f9b0a579c",
                    "label": "确认人",
                    "itemNameLabel": "静态文本",
                    "name": "text23",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "确认人",
                    "placeholder": "",
                    "appCompVisible": true,
                    "labelFor": [
                      "qurenren1",
                      "qurenren148",
                      "qurenren149",
                      "qurenren150",
                      "qurenren151",
                      "qurenren152",
                      "qurenren153",
                      "qurenren154",
                      "qurenren155",
                      "qurenren156",
                      "qurenren157",
                      "qurenren158",
                      "qurenren159",
                      "qurenren160",
                      "qurenren161",
                      "qurenren162",
                      "qurenren163",
                      "qurenren164",
                      "qurenren165",
                      "qurenren166",
                      "qurenren167",
                      "qurenren168",
                      "qurenren169",
                      "qurenren170",
                      "qurenren171",
                      "qurenren172",
                      "qurenren173"
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "text23",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh92adc644-2180-42f2-9590-022d74d654d3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shb0db970e-1949-4ac6-a44b-45b586f91f8f",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh459b2685-470e-425e-a541-45a63b28e6a7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh1b10d2ff-a512-4cf1-ae15-3b74f3ccb975",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh7e17af2f-4636-45eb-90a2-9828219b4e2d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh6469eddd-f23d-4b3d-adfd-2744173935ad",
                  "preps": {
                    "id": "Idsh6469eddd-f23d-4b3d-adfd-2744173935ad",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text24",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "根据生产计划核对机型配置信息（生产/工程/品质）"
                  },
                  "compType": "formItem",
                  "fieldName": "text24",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "she11841dd-73e9-407b-ac03-82445c9be2b7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh0da974b5-bfd8-4bb8-96c3-d6d332ea2ea0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh791e3f89-8c33-409c-952f-b06b514efd8b",
                  "preps": {
                    "id": "Idsh791e3f89-8c33-409c-952f-b06b514efd8b",
                    "label": "时间选择器",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj1",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj1",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh16ce9013-2c4d-42e1-94ac-9071932de2b5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shdf0939ab-102a-4b1c-bec4-35f5cde4ee8b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh8035d585-3798-45ec-b201-816ac485f136",
                  "preps": {
                    "id": "Idsh8035d585-3798-45ec-b201-816ac485f136",
                    "label": "数据记录",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl1"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl1",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh7136278d-fc27-46d7-a18a-e348a7476c8d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh912f735a-4a4b-4a18-ab0a-a72a62b03f6a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh44db429a-edfa-4305-abaf-4c056bc6966e",
                  "preps": {
                    "id": "Idsh44db429a-edfa-4305-abaf-4c056bc6966e",
                    "label": "异常原因/对策",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc1",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc1",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh7bc019be-46c9-4956-9f9b-5381d808db14",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh2630ec23-433b-44ac-bdcd-0cff7d94f2cc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh62aad525-229b-4f94-be26-9f4ce59ad3d8",
                  "preps": {
                    "id": "Idsh62aad525-229b-4f94-be26-9f4ce59ad3d8",
                    "label": "确认人",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren1",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren1",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh0a30b8b7-2af4-4ddf-a7ac-89de4321d7c1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shaab9d2f7-b80b-4534-aea2-f89a420a46a1",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh2772dc6a-ac86-40f1-b652-4a97a255f10a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh61e09e71-b464-471b-82cd-bc9bac81c425",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh3b73c1fe-398f-4ff4-89ee-9711267cc8d3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idshb84d6c98-3be6-4b91-bcdb-c564bcc7c258",
                  "preps": {
                    "id": "Idshb84d6c98-3be6-4b91-bcdb-c564bcc7c258",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text25",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "PCB检查（PCB外观、丝印、版本等）（生产/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text25",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh9f493aae-b42e-4f50-8d2d-062c73233904",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh09b0416d-a963-4673-aaa4-9f68a46e0f6a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shbfd62986-c8c9-47c1-9748-f2fde2e682d8",
                  "preps": {
                    "id": "shbfd62986-c8c9-47c1-9748-f2fde2e682d8",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj70",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj70",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sha427adfb-6028-47c4-b663-08ddaab4f781",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh359d778f-4827-41d5-94d8-07c5b75bde38",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shc152bd1f-2392-4cac-85c0-a8147651e4b1",
                  "preps": {
                    "id": "shc152bd1f-2392-4cac-85c0-a8147651e4b1",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl96"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl96",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh2b3d8aee-1442-4449-ba3c-f703177b9261",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shbbea45b0-2d31-4473-9ce5-17a6eca033ab",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh01bb15d1-f322-40da-812b-9f69afc3ce8c",
                  "preps": {
                    "id": "sh01bb15d1-f322-40da-812b-9f69afc3ce8c",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc122",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc122",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh5c87488b-8a2e-4261-a2dd-d83c662dc0a9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh65c9aed9-3ec8-4a3f-a687-ca298d9d9ac5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh4fa967e9-a1f6-4593-a8e6-102117c20eef",
                  "preps": {
                    "id": "sh4fa967e9-a1f6-4593-a8e6-102117c20eef",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren148",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren148",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shffeaf084-b486-4b29-b953-8a22fd8509d7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shb96facb3-2217-475d-beaa-c2e741a22755",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh41e7db46-d7dd-48a7-983f-3cc41baaf0fb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh722643f6-6a96-46e9-b00a-fb80f7fe28e5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh530b6fff-57c6-4150-9754-f3576c4158ca",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh24fbad63-9c18-45cc-9827-cc0545e2d00c",
                  "preps": {
                    "id": "Idsh24fbad63-9c18-45cc-9827-cc0545e2d00c",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text26",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "物料核对（物料编码、描述、规格与BOM是否一致及阻容件相关参数等）（生产/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text26",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh3cad9c38-472a-4fba-82e7-ebfcedc418e3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh56f943de-6426-4dc2-8743-e2eae63c96d5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh3a44265b-5bd1-4468-957f-39639f425983",
                  "preps": {
                    "id": "sh3a44265b-5bd1-4468-957f-39639f425983",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj71",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj71",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shcb932798-cbee-42cf-8ed9-508e505c1fea",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shf5dc6d9e-1d81-4ea2-b5ec-faecd666e4dc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shdf917f61-7386-4e65-909b-2a9a6fd1c93b",
                  "preps": {
                    "id": "shdf917f61-7386-4e65-909b-2a9a6fd1c93b",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl97"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl97",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shd2f4b083-b576-4dc9-867f-7ce7d447d8d6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh1f9cd28f-13ef-4150-b66a-3723bc1c9d01",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh64a501a2-4e4d-42c1-8407-211d04c2f208",
                  "preps": {
                    "id": "sh64a501a2-4e4d-42c1-8407-211d04c2f208",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc123",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc123",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shd4aa59cf-f04f-4c6a-93b4-a7f456566901",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh14f45372-143c-4060-a20a-7472ea2c32ff",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shcd402b68-8de0-4135-a732-97f7839f7f44",
                  "preps": {
                    "id": "shcd402b68-8de0-4135-a732-97f7839f7f44",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren149",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren149",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shd179ff3e-ad1f-43ee-b73b-6a978af9c93e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh4e161400-75a8-49a7-8244-22c0d4741d6c",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh16e59f98-5c1a-453a-b1f2-23ce3438e490",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "shf8bf8ff4-3667-4a57-a9c6-fac2c9e595f5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "shdb64de33-a4c9-4d91-aa20-329463fa4972",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idshc069e605-e7c5-47ce-ad44-92b8a694d827",
                  "preps": {
                    "id": "Idshc069e605-e7c5-47ce-ad44-92b8a694d827",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text27",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "贴片程序及版本核对（工程/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text27",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh0498a224-2b50-4f71-bad2-15252d957738",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sheebc2275-6265-40dc-af4f-22a69ac0735c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shdc624d94-e019-4115-848f-8575fe3d4950",
                  "preps": {
                    "id": "shdc624d94-e019-4115-848f-8575fe3d4950",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj72",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj72",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shc9d4b7a6-2b16-47d9-b811-29be5d314e5c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh72263f34-5139-4cf7-8c7c-e174678d0168",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh6f033bb4-6e40-4b84-8f4c-3e1be1ef62f0",
                  "preps": {
                    "id": "sh6f033bb4-6e40-4b84-8f4c-3e1be1ef62f0",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl98"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl98",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh9d154ccf-d6f8-47ae-8483-8c8fba3e4241",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shc9454f17-98c6-46f8-9dd1-b0253f34e1f1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh46a0ee49-6b8a-44fe-a7f3-a624511972e0",
                  "preps": {
                    "id": "sh46a0ee49-6b8a-44fe-a7f3-a624511972e0",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc124",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc124",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh3e9bfaf6-ae17-4ff5-b02c-8a076825eb6c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh18d3947d-01ec-4ac0-96a0-56e89d9060f0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sha1b50626-41ef-47be-83bb-966c5a76d6a5",
                  "preps": {
                    "id": "sha1b50626-41ef-47be-83bb-966c5a76d6a5",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren150",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren150",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh2b109839-12b4-49ea-8b01-b7e8516610ee",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh758300e4-b74d-4f29-9b06-85e14ebf8c18",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh0ec4859e-955d-4cce-8009-8821aa22f1a1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "shca4c5a1d-fc0f-4c4a-a3d1-e436ae07f47f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "shbc812983-3f09-4114-ab3c-5a749b29f824",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idshd945da96-1021-4049-b418-da63b861a701",
                  "preps": {
                    "id": "Idshd945da96-1021-4049-b418-da63b861a701",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text28",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "极性方向确认，注意结构件位置和方向（生产/工程/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text28",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh6edfb494-17cb-4d72-9c6b-a8cc22ca52f6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shb30c5b16-2253-4d9b-a40c-be53c04ed2f2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shfca5ef0f-1394-4b4c-951f-81d7a3ef2236",
                  "preps": {
                    "id": "shfca5ef0f-1394-4b4c-951f-81d7a3ef2236",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj73",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj73",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shfbcd6caf-8628-4f25-9fae-97f541c212a3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh460e58b9-4d9a-445a-a8a5-5a3647dde4dd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh91a45080-9977-4dd6-b5a1-0947395dbed3",
                  "preps": {
                    "id": "sh91a45080-9977-4dd6-b5a1-0947395dbed3",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl99"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl99",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh54876a03-b8ed-4851-87a4-1e3a45e631d2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh21c68d06-3feb-4bdc-85ae-90ec0b350c6d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sha444f6ee-1c82-49c3-a108-ff32e815b733",
                  "preps": {
                    "id": "sha444f6ee-1c82-49c3-a108-ff32e815b733",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc125",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc125",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh650e52f2-c8b8-4b13-b0bf-4c37628d8fab",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh721d6302-0082-4f12-a9f2-a2694a46e582",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh7ea37f66-b1e7-455b-981d-a5e4ee18ea73",
                  "preps": {
                    "id": "sh7ea37f66-b1e7-455b-981d-a5e4ee18ea73",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren151",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren151",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh6fceb8fe-cd32-4291-adad-075ebb1a6383",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh3005e10f-9e9f-4b46-9025-45b5e6a98885",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh8a72f909-2f4d-4878-8084-2d79a0fdb1ca",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh646adb47-50e4-4e4b-b94b-804e8f76e1d2",
              "colIndex": 1,
              "rowspan": 13,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh9067dc5f-72b1-4c73-bf49-8c30328b4469",
                  "preps": {
                    "id": "Idsh9067dc5f-72b1-4c73-bf49-8c30328b4469",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text33",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "贴片段首件确认"
                  },
                  "compType": "formItem",
                  "fieldName": "text33",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true,
              "colWidth": "39px"
            },
            {
              "id": "sh6a1e489e-8267-45b3-a97e-e36f022e07f4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh9548e053-b64a-4e8e-a122-a0b700772f31",
                  "preps": {
                    "id": "Idsh9548e053-b64a-4e8e-a122-a0b700772f31",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text34",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "锡膏型号（生产/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text34",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh0ec81852-c1ca-4ddd-a572-62a72cdc996b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh8b6e6dd7-2137-4cbd-a024-bc696549886a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh68c318a6-a613-4020-99ff-1123dc701f36",
                  "preps": {
                    "id": "sh68c318a6-a613-4020-99ff-1123dc701f36",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj74",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj74",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh38675a6f-9e58-48d5-968c-c5e660d60257",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shd454f024-cbc0-4bf6-a8a6-e6a15e64a631",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shfc970858-e7c7-4d77-806b-e33191188291",
                  "preps": {
                    "id": "shfc970858-e7c7-4d77-806b-e33191188291",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl100"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl100",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sha5710156-b9d6-473b-a4ee-d97361b9ec04",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh1e45b19b-46c0-411a-960a-177e52eef098",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh9df1a97c-0db3-40e1-9eca-9162397f68b7",
                  "preps": {
                    "id": "sh9df1a97c-0db3-40e1-9eca-9162397f68b7",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc126",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc126",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shb8355296-1486-4d6c-8d9b-9cc3f3a0b1ff",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh740b3f95-4de6-474b-8d87-16757f2d2f67",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh62a3218d-ead6-47a0-9980-753a80744a39",
                  "preps": {
                    "id": "sh62a3218d-ead6-47a0-9980-753a80744a39",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren152",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren152",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shd31a4fd1-13dd-4438-b770-863d791af1e1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh82dea86e-d020-4ef6-b929-f4140ea80f48",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh32e66c55-0ae8-4ab7-8dec-91391f6cc4d9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh2878c0ce-6a48-4954-9cab-f5182622ff55",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "shacc9ac77-27f9-42d5-933d-7c24969c47e8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idshed3c63de-8588-4100-8ab7-c6a8a3efbbb2",
                  "preps": {
                    "id": "Idshed3c63de-8588-4100-8ab7-c6a8a3efbbb2",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text35",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "印刷参数确认（需记载数据由工程/品质填写）"
                  },
                  "compType": "formItem",
                  "fieldName": "text35",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh07076a1f-d00d-4ad5-8cba-9508f9b61e56",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shf7434364-a47c-434c-890a-a820edb2f776",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shffc5973d-3b0f-4f45-a012-0afe386a9bd4",
                  "preps": {
                    "id": "shffc5973d-3b0f-4f45-a012-0afe386a9bd4",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj75",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj75",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh1c48d153-c311-412b-83ef-7aa06c26f66a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh5d602127-3ebf-4d5a-b42c-51136761e900",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shb77fd7dd-9a1e-4c9a-8c70-1666202b3581",
                  "preps": {
                    "id": "shb77fd7dd-9a1e-4c9a-8c70-1666202b3581",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl101"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl101",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh7e8bff1e-11d7-4e1a-8386-583b04314072",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "she2b66b3c-e215-4145-bd4f-ae1f8a08c04b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh5d4fbaba-ec4e-47d5-b418-9149b5f3ce60",
                  "preps": {
                    "id": "sh5d4fbaba-ec4e-47d5-b418-9149b5f3ce60",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc127",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc127",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh79df9864-a19d-4a62-95bc-d873451e7f31",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh5ca52571-c85d-4383-afce-b9e683d9523a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh0218bbde-f216-4d9e-a5a0-b92b57cb14b1",
                  "preps": {
                    "id": "sh0218bbde-f216-4d9e-a5a0-b92b57cb14b1",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren153",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren153",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shbb84f1cc-af71-41e9-a430-6e502938787c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "she87dd396-4367-4c14-a71b-713c601fc305",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh040b50b7-ec28-43a7-9302-8b97626f6920",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh645204ff-350f-454e-bf76-7fcd6575e36a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh50fdddb9-0f84-4d4b-922e-f2ed2f7abbfc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh253c9f5a-5f68-4c87-a82b-b7b074f872b6",
                  "preps": {
                    "id": "Idsh253c9f5a-5f68-4c87-a82b-b7b074f872b6",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text36",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "锡膏厚度测试（需记数据由品质填写）"
                  },
                  "compType": "formItem",
                  "fieldName": "text36",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shdea435b6-cd1f-49a5-93c1-4cb5d7c3b474",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shbdc09c7e-7335-4322-bb26-7abba4c73a4f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh4262be46-3d9f-4d5d-b609-7c7dbbe5ff76",
                  "preps": {
                    "id": "sh4262be46-3d9f-4d5d-b609-7c7dbbe5ff76",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj76",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj76",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shc4fd5f5b-ecba-49e8-8daa-1a97c21e604d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh314e925f-e6be-4c97-93c3-67b5c7d0b844",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh818f0773-3c97-40a4-9e5d-395681434f46",
                  "preps": {
                    "id": "sh818f0773-3c97-40a4-9e5d-395681434f46",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl102"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl102",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shc87ed1ac-207c-43a6-aa70-665815af39a5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh1e91824d-8e66-47fd-a1a0-7cfcc986d2d1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh66254ee5-27dc-40e0-8eb3-762a27423212",
                  "preps": {
                    "id": "sh66254ee5-27dc-40e0-8eb3-762a27423212",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc128",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc128",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sha45112b9-1e14-4a64-a588-e43eb7305d77",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "she8b82766-2ad4-4d00-915e-967f04c8472f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh9d090543-0f41-4bfd-bfca-89e726f6d3d5",
                  "preps": {
                    "id": "sh9d090543-0f41-4bfd-bfca-89e726f6d3d5",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren154",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren154",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh6e8d736f-2ac2-4a73-891e-855458a6de17",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh43163a52-2991-428e-a8ee-de9c70a687b5",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh964b0d5b-f4f6-4f9a-ba67-1d1980c336ab",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh5c9e8f2a-f274-4899-b29a-06c68f8d469d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh4e6084c6-dbc1-4f32-ac13-d39d1e4124da",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh8ea5f176-0327-4270-8030-9d65511799fa",
                  "preps": {
                    "id": "Idsh8ea5f176-0327-4270-8030-9d65511799fa",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text37",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "贴片程序及版本核对（工程/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text37",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sheb37d2ba-4d43-479f-b471-576fee039b51",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shaa67123e-e3dc-4e9a-bb9b-845f194e3b32",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh1323ac93-98ce-4345-bc95-fa633c19a3df",
                  "preps": {
                    "id": "sh1323ac93-98ce-4345-bc95-fa633c19a3df",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj77",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj77",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh2c8bc5ac-0a1c-4572-bf60-e25c6f3b26b8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh4f7147f8-4249-46f2-b5fe-160fbae52216",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh83a90c20-d8c1-4511-b487-b1fe1a68f2b7",
                  "preps": {
                    "id": "sh83a90c20-d8c1-4511-b487-b1fe1a68f2b7",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl103"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl103",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh9ddaec68-fa0d-496a-a83a-fd5e547a1a83",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shad10bfa4-3afb-4351-a816-d719fd6a7f3a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh5c4d1dbb-167d-414d-a7d6-fedcec14cc01",
                  "preps": {
                    "id": "sh5c4d1dbb-167d-414d-a7d6-fedcec14cc01",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc129",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc129",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh9a8089a9-5fcd-4647-a119-ad84a7d9d5b6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shacc093d4-40b3-41c1-9e95-3ac5f0ce5d42",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shcd8abb86-dadc-4f54-ab5f-63667419d21b",
                  "preps": {
                    "id": "shcd8abb86-dadc-4f54-ab5f-63667419d21b",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren155",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren155",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shfc1562e7-0157-4779-a38f-404670c4ac21",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shcd862277-6bf8-4c55-a4f0-faffabd3ea8e",
          "colIndex": 1,
          "columns": [
            {
              "id": "shd4af2dec-41c6-4995-9deb-c6dbcfe12a70",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh40cc712c-5465-49c9-b928-8047decc40fa",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh191302b5-38f7-439e-bc03-9f383e0cac1a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh31a1c469-24b9-4224-b1e6-9eb50451856e",
                  "preps": {
                    "id": "Idsh31a1c469-24b9-4224-b1e6-9eb50451856e",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text38",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "物料核对（物料编码、描述、规格与BOM是否一致及阻容件相关参数等）（生产/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text38",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh03e3a0a0-272e-42fb-a53b-6e67e8bc5064",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh7dfbeb45-4201-4c30-af84-70ed2c6ae42b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh40359459-cac3-4167-9dee-c0b047885f58",
                  "preps": {
                    "id": "sh40359459-cac3-4167-9dee-c0b047885f58",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj78",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj78",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shd0dc5a4f-bcd6-41a9-aa95-2d17eef759ec",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh79671476-dc77-4b33-a017-8f3099c97e92",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh86cd8b0a-e292-4608-94b7-86187bbc3c42",
                  "preps": {
                    "id": "sh86cd8b0a-e292-4608-94b7-86187bbc3c42",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl104"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl104",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh7c0f9273-1165-481e-84da-12be026fb7e2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh5e68305c-fedc-459c-bc0b-b964546269eb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh05ebabf8-6e51-49ad-8dfc-fef6094f3fd5",
                  "preps": {
                    "id": "sh05ebabf8-6e51-49ad-8dfc-fef6094f3fd5",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc130",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc130",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh8fd257b4-b125-494e-a87d-50da317ba60b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shc4c9e0e3-b952-4aa8-aa79-da5d5d965db0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shb6d7f60a-b20e-4258-8ae6-b2284e0402f0",
                  "preps": {
                    "id": "shb6d7f60a-b20e-4258-8ae6-b2284e0402f0",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren156",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren156",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shd6f43118-eb9e-4ae2-b34a-6438392d3e1e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "she1799a80-5a29-4d8a-92ef-4fcd8c57b858",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh8f6f22fe-5b7c-4e9d-9da8-bdc00d6ef6f3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh9d0505f2-504e-478a-95f5-ceb4a4f62947",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh942969a6-9b3b-4be8-b439-5d77b29e5bb3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh2e85e15f-558e-4f1d-8871-2ee2ba0d1a4b",
                  "preps": {
                    "id": "Idsh2e85e15f-558e-4f1d-8871-2ee2ba0d1a4b",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text39",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "极性方向确认，注意结构件位置和方向（生产/工程/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text39",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh1be70842-9b96-40eb-8139-9af90ec3c3f1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh12c5158c-0e21-4fcc-bfd4-9a74dda5a498",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh80967fd5-0c33-4658-9056-93e060e52d40",
                  "preps": {
                    "id": "sh80967fd5-0c33-4658-9056-93e060e52d40",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj79",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj79",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "she1c2283e-e403-40d0-b475-413cccadbb36",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shbf31633a-cd5d-49ed-830e-c1eddbcc11ab",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh5f941e99-8e1b-4a45-aded-3d7606371333",
                  "preps": {
                    "id": "sh5f941e99-8e1b-4a45-aded-3d7606371333",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl105"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl105",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh63dc9990-0761-49d4-a3b8-90e670a060d9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh316fabad-9e4e-4ac7-acbe-9a34e583d0dc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh65a752da-8f24-45a7-a179-df2c37831a3d",
                  "preps": {
                    "id": "sh65a752da-8f24-45a7-a179-df2c37831a3d",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc131",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc131",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shb12b52b4-fb70-4eee-92f3-d0ed6fdec8f4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "she962203c-6c93-4fe2-9b08-aea6ffd64304",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh3369ec66-ee7a-45b5-bdc0-cd93fd30869d",
                  "preps": {
                    "id": "sh3369ec66-ee7a-45b5-bdc0-cd93fd30869d",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren157",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren157",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shda183edc-be70-4472-b4d9-9341b8a7cce8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "she3dd2319-a9eb-40f5-b489-4a37295e492e",
          "colIndex": 1,
          "columns": [
            {
              "id": "she66f7f38-c843-4eb4-b780-b6bfb635f65b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh77118114-f511-4882-bf67-dda1eee8192c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh6f3d301f-01e0-43ae-af71-3bdfffd9c857",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh54899edd-2294-4266-9270-21faa37498f1",
                  "preps": {
                    "id": "Idsh54899edd-2294-4266-9270-21faa37498f1",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text40",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "参照样板确认（品质/工程确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text40",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh879a8193-33b7-4e0e-b5a6-3b88cf020cf0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shcb2981d3-b29e-4674-a6e0-15d590d9ef42",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh7fa09de5-e2d9-4309-b657-2a819bf64014",
                  "preps": {
                    "id": "sh7fa09de5-e2d9-4309-b657-2a819bf64014",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj80",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj80",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shd02a6e4e-5b11-4f57-ba17-0d775e0bb467",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shaa4968e4-e6a8-4cb1-9ac1-87f47cfaa166",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shf7f67eac-0073-4c5d-9a6a-c899348d4bbf",
                  "preps": {
                    "id": "shf7f67eac-0073-4c5d-9a6a-c899348d4bbf",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl106"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl106",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shd0a3249e-9f03-49d1-b2cd-c0750de79b93",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shef5733c0-fbf2-4d28-b190-695161924174",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh9066dd7e-8fa0-46c8-a71e-3a0c2f71844f",
                  "preps": {
                    "id": "sh9066dd7e-8fa0-46c8-a71e-3a0c2f71844f",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc132",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc132",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh09feb046-0f81-4715-bd1c-952da339a531",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shaa5d9418-d87c-4950-8bbc-a6bbb84287d3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh74004d2d-2960-411a-9c65-42d048b0af40",
                  "preps": {
                    "id": "sh74004d2d-2960-411a-9c65-42d048b0af40",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren158",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren158",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sheb64b154-3cc4-4fb7-ab62-fd5eb39d63ca",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh13bd0e50-4b9e-4afa-8441-8a6d70e3d887",
          "colIndex": 1,
          "columns": [
            {
              "id": "she7945177-19b4-423b-96c8-62963c243592",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh3f690015-0101-4ea9-adce-41a4595dd46f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sha7c1bc8d-bb56-4334-9e11-313218cbabf1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh50f2691d-b68a-41a8-a91b-0f6a29aebb54",
                  "preps": {
                    "id": "Idsh50f2691d-b68a-41a8-a91b-0f6a29aebb54",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text41",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "炉前X-Ray/AOI检查（工程确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text41",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sha11bd2ff-de0e-4fe3-9628-0b1458e23916",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shaabd2136-7ee3-49d7-b30f-e2b018d0809d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shfdd8c0ef-a1c7-412d-b812-ba727f56c5a9",
                  "preps": {
                    "id": "shfdd8c0ef-a1c7-412d-b812-ba727f56c5a9",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj81",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj81",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh9dbe86ff-dc57-4b42-a43e-7bdea56ea93c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh16e17fb3-b6ba-4dcf-822f-b51245faf1aa",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh32042028-d931-4247-9b56-bb56a06b8b3f",
                  "preps": {
                    "id": "sh32042028-d931-4247-9b56-bb56a06b8b3f",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl107"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl107",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh6e2ee421-2307-4bb6-b7f3-8c5751d0489a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shd9e33f23-8748-4551-a1f7-973ea1ac6874",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shdb0728d5-7cd5-4b89-991c-060d5d692e55",
                  "preps": {
                    "id": "shdb0728d5-7cd5-4b89-991c-060d5d692e55",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc133",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc133",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh0586ab1b-3bc1-48f3-9211-5fd8087e30ab",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shed2d1e4a-e1eb-4292-b17a-98628dcb357b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh0f25d235-e0ef-4ad6-854b-c1d86da6e77e",
                  "preps": {
                    "id": "sh0f25d235-e0ef-4ad6-854b-c1d86da6e77e",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren159",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren159",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shabfdb24e-195c-488f-a603-02eb649cba38",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shb176209c-3a06-42b3-a9a8-8100aac7bed8",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh7a95e8b0-a9ba-4c56-9d29-4b8d50908556",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "shc5a25a2f-6f43-484b-9c7f-c752ee11600b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "shce713356-04d3-4fde-a27e-2d920d874a6a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh6e6b28ed-7f95-4868-8b4b-144a9c6d2299",
                  "preps": {
                    "id": "Idsh6e6b28ed-7f95-4868-8b4b-144a9c6d2299",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text42",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "回流曲线测试（需记录回流程序，工程确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text42",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh68f5d835-54ed-4151-9626-3baf5537ecc5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh5a21cfe7-7542-4c3e-b230-714844d8d994",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shf3946eb4-f8ae-422c-bcae-4ef348fc45c6",
                  "preps": {
                    "id": "shf3946eb4-f8ae-422c-bcae-4ef348fc45c6",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj82",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj82",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh63deaaa1-d5fd-4e62-9ea0-9e5a7ff0ceba",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh4b02c0aa-5c23-492e-90a9-a22b18857bce",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh5d11a9c4-adbe-4d9a-ad16-9d5506754e5c",
                  "preps": {
                    "id": "sh5d11a9c4-adbe-4d9a-ad16-9d5506754e5c",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl108"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl108",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shef22c840-f09d-4846-8076-c67f58188228",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shce61c6cf-a495-43d5-8a38-b57027515309",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shf47dc3cc-b383-4696-aac7-aa05234b310d",
                  "preps": {
                    "id": "shf47dc3cc-b383-4696-aac7-aa05234b310d",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc134",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc134",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh3922c4f5-0d18-4048-8b40-add8eea2a9b1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh0045aa88-e4b5-4fe1-b6d9-405fca6841b6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sha022fd0a-a9ae-4823-9543-04933a77fa32",
                  "preps": {
                    "id": "sha022fd0a-a9ae-4823-9543-04933a77fa32",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren160",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren160",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh9534fc03-6a62-4011-8a66-809f1c011931",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh7758a233-081a-4e96-91f9-e814f365576e",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh781f9eee-e91d-40ed-972e-330cf448e8be",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh09b9762e-565a-4a77-904f-9113daafe73c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh02e57016-c833-4f3c-81a5-467db2418ae6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh90e6566f-abc7-4b39-a815-0eeff5fcbc7d",
                  "preps": {
                    "id": "Idsh90e6566f-abc7-4b39-a815-0eeff5fcbc7d",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text43",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "炉后X-Ray/AOI检查（生产/工程/品质）"
                  },
                  "compType": "formItem",
                  "fieldName": "text43",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh6a29b3b2-00e8-4332-9fa2-b2f2a918bceb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh208a5bc5-8f66-4562-bf69-eac6b7069c2f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh78d56966-3480-4bef-b74f-2e68fa3e04aa",
                  "preps": {
                    "id": "sh78d56966-3480-4bef-b74f-2e68fa3e04aa",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj83",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj83",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shf763d79c-a68a-48ea-b54b-309ad9081345",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh21a83b2a-ead0-4aff-ab39-1ca47cbc88b6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shb758f060-4de1-4c6d-9875-2a950446538b",
                  "preps": {
                    "id": "shb758f060-4de1-4c6d-9875-2a950446538b",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl109"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl109",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh14039774-e853-4c56-9e52-9a439d9db055",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shfd9608f6-9718-48ae-881b-bc10ac0be2da",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh796f6172-58ab-4b74-b7a2-63211cea97bd",
                  "preps": {
                    "id": "sh796f6172-58ab-4b74-b7a2-63211cea97bd",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc135",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc135",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sheb6967ee-386d-401c-969f-f0b1f11649d8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shf7e0b067-a16a-453f-b0c7-7bd9827e5630",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh4fa465a1-3174-46fa-8fb7-3d11e50468f1",
                  "preps": {
                    "id": "sh4fa465a1-3174-46fa-8fb7-3d11e50468f1",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren161",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren161",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "she8b714d8-a3f0-4271-bafd-53c54c09f778",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh47a1196d-719b-47d6-bf09-eeb35c57989f",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh7b70b6ac-fdaa-414f-90d8-01dd0afa86a4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "shdb30d105-5f4a-4cf8-80e1-f0967374bc4d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh535b1d94-ae4e-48f0-9319-cbc923f3c3ba",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsha450ae99-170b-47b7-a6ba-426c392fafd3",
                  "preps": {
                    "id": "Idsha450ae99-170b-47b7-a6ba-426c392fafd3",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text44",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "USB和耳机的插孔底部锡凸出高度≤0.4mm（品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text44",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shfe11a6d0-b4c8-416a-a2f5-daec4f9512b7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh44ba38a0-10e5-43c8-81bf-f69bd2f9a6e0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh56fb6867-287b-48ea-8ff6-878811998131",
                  "preps": {
                    "id": "sh56fb6867-287b-48ea-8ff6-878811998131",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj84",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj84",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh9d4ca72b-3860-48d0-88d5-bf235744c468",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh59a4f310-9732-4dc0-ac91-1703babb5dd1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh78f539c3-24d9-43f5-844b-012fce2c8fa1",
                  "preps": {
                    "id": "sh78f539c3-24d9-43f5-844b-012fce2c8fa1",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl110"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl110",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shc42d85b3-ac38-4a53-87bb-6f2bb7a25761",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh6e78f018-ae79-463c-ac47-a39587204cb2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shaaccd5a9-38cd-49d1-af39-fa30b114121b",
                  "preps": {
                    "id": "shaaccd5a9-38cd-49d1-af39-fa30b114121b",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc136",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc136",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shc9f34bc0-7ad5-4ea5-b6dc-2b9abcd3cb8d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shbb675a17-0b79-47e5-9e71-7cea2ae76681",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh7b7350b9-8bfb-4d8c-82fb-13f23fb4087d",
                  "preps": {
                    "id": "sh7b7350b9-8bfb-4d8c-82fb-13f23fb4087d",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren162",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren162",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh997944bd-1cf1-4828-91c9-9102653fbe42",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shf61cf146-9127-427b-92de-13a8589f9d38",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh56826910-879d-4123-b415-d75c821d07dc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh89ed9f97-952d-4827-8434-4e0623471f15",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh3acdba67-830e-449a-895b-e3443ea0f3c9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh1858f680-0e47-4cb4-944e-c611720691c8",
                  "preps": {
                    "id": "Idsh1858f680-0e47-4cb4-944e-c611720691c8",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text45",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "分板尺寸和外观检查（生产/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text45",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh3afcc990-2533-47dd-86d4-9e3f3f0619eb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh9f381a9d-4203-422f-a21b-3ec8a87b514e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh961daf6f-1054-44a5-a5b1-34f8dd15760a",
                  "preps": {
                    "id": "sh961daf6f-1054-44a5-a5b1-34f8dd15760a",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj85",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj85",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh484e5030-fc36-43a2-ab63-65cbb4821a77",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shd0189efa-1d0c-4f1c-9ec2-6843339dfd87",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh17875aca-e6eb-4378-8b2a-271bc8aa963e",
                  "preps": {
                    "id": "sh17875aca-e6eb-4378-8b2a-271bc8aa963e",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl111"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl111",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh6b18749a-cb1c-4ab6-ab5b-0f96b9371cd4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh97befc37-db52-4ceb-be1c-12386980bd1b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shb7cada83-11db-494c-b0f6-2fe51c2b9d0d",
                  "preps": {
                    "id": "shb7cada83-11db-494c-b0f6-2fe51c2b9d0d",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc137",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc137",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh9fa125ce-a499-443e-97c5-a9ea308ec228",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh76756224-4e27-4692-8209-60df88e676bf",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "she9d51714-e616-48ab-8512-b959f7ce366e",
                  "preps": {
                    "id": "she9d51714-e616-48ab-8512-b959f7ce366e",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren163",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren163",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh7e6fc654-fc62-4a00-93dd-521dffd4c6b3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shbf355442-8cab-4516-a2b0-1f058a6d0a60",
          "colIndex": 1,
          "columns": [
            {
              "id": "shd16d8379-8d82-4885-b986-97984dd39755",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh18df92c2-bb29-490b-af5d-cff603dc6e21",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh23c52957-b939-4e02-8781-d7e0a9509f8c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh9e905484-d021-4119-9a7a-a8fc6d599c78",
                  "preps": {
                    "id": "Idsh9e905484-d021-4119-9a7a-a8fc6d599c78",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text46",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "条码贴纸/镭雕SN确认（品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text46",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shf3bf4041-183f-4725-9ac1-b1b18bcab3b8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh7c6a7c91-ea25-457d-8f60-523f660d7211",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh4c021d5a-00e9-46a8-a9a3-62285c3786ac",
                  "preps": {
                    "id": "sh4c021d5a-00e9-46a8-a9a3-62285c3786ac",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj86",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj86",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "she770f66d-f7e9-4808-854a-f0087e5fa162",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh6f6c64e2-8a64-4d17-897e-67d976e245cf",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh5b6493f7-6ddc-4612-908e-e423a98a4e85",
                  "preps": {
                    "id": "sh5b6493f7-6ddc-4612-908e-e423a98a4e85",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl112"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl112",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh593ed7b4-4615-4d4f-9131-7e7202b611e8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh03eaf64a-552a-44ce-9066-b9c151cb6705",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shf0290eb8-9d63-41f7-9d01-d4ac63a05c3c",
                  "preps": {
                    "id": "shf0290eb8-9d63-41f7-9d01-d4ac63a05c3c",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc138",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc138",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh4c65b826-be0c-4c11-9816-dc518dfdced1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shbf2ec958-d16e-44f3-b431-03d1dd7b839a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh5c86f6b1-4baa-4a36-bc9d-90a16cff0338",
                  "preps": {
                    "id": "sh5c86f6b1-4baa-4a36-bc9d-90a16cff0338",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren164",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren164",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh5d9024bd-19d3-461e-bac4-d1bec5e72142",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "she87905de-955f-479e-aa67-0e2d81943844",
          "colIndex": 1,
          "columns": [
            {
              "id": "shcf428b7b-b528-4751-ae94-5a60cc1203de",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh2342fc0b-9f6d-496f-933c-26a6459604b2",
              "colIndex": 1,
              "rowspan": 9,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh61f65660-8e51-4f0d-a4fa-9312eac05aaa",
                  "preps": {
                    "id": "Idsh61f65660-8e51-4f0d-a4fa-9312eac05aaa",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text47",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "测试段首件确认"
                  },
                  "compType": "formItem",
                  "fieldName": "text47",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true,
              "colWidth": "39px"
            },
            {
              "id": "sh24414cc3-7e03-405e-b702-7350b2f0fafc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh62005284-3106-4723-84a0-a0da551fa55a",
                  "preps": {
                    "id": "Idsh62005284-3106-4723-84a0-a0da551fa55a",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text48",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "测试各工序工程需检查测试夹具所有物料有无避空到位（工程确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text48",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh32019a97-74b3-4ba5-ae00-0b09b519e3d2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh87c4d11c-23cd-4470-802f-818f6a8ca519",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shb3e0e502-e988-4732-9817-38502fb9e386",
                  "preps": {
                    "id": "shb3e0e502-e988-4732-9817-38502fb9e386",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj87",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj87",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh969bae73-f9ce-4a16-9fe1-5f8dc2bd698f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh0fd832e4-e7c2-46fd-97d4-2490c4fdfea4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh4b6ae212-6c38-4727-9066-8922725f6d3f",
                  "preps": {
                    "id": "sh4b6ae212-6c38-4727-9066-8922725f6d3f",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl113"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl113",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shf3545c03-ed3c-462b-8030-f322d3f27063",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh1df16faf-10be-48ef-8a6d-3d29ffa57596",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shc0d500b7-5bf7-402f-aded-382f2d39fd42",
                  "preps": {
                    "id": "shc0d500b7-5bf7-402f-aded-382f2d39fd42",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc139",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc139",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shf1912939-f85f-40e2-95e9-e5711a13d6db",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh79132da6-abec-45e7-a18a-92f85ae7d2d5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh42385e1d-cef9-4fa5-81e0-cad6c4a21ded",
                  "preps": {
                    "id": "sh42385e1d-cef9-4fa5-81e0-cad6c4a21ded",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren165",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren165",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh8dd1d6d4-c93b-4bd3-8c59-096c49f71b60",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shb9fadf93-f660-46f4-904f-65d1938ba571",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh16f708e9-3714-4849-b461-92231b31f2ec",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh4b46577f-ceab-4363-8fae-4f81098b8209",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh048d420b-43b6-41d8-88db-f7b479465730",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh040950de-9039-4761-94eb-80fa7d36c7b2",
                  "preps": {
                    "id": "Idsh040950de-9039-4761-94eb-80fa7d36c7b2",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text49",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "下载（烧录）测试软件版本确认（工程/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text49",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sheb23dbc3-5341-47d6-8e70-108702fd833a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh365785d7-9e79-4de1-b89c-5f16e5e58a7a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh8d2be8c3-e0c3-4358-a8ca-f8869767155c",
                  "preps": {
                    "id": "sh8d2be8c3-e0c3-4358-a8ca-f8869767155c",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj88",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj88",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh748ce3dd-a686-44cd-a91d-4736ea3bc408",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh1e05668e-5a39-4a0a-8cee-0c80d3c3b272",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh01ea8345-b5af-4b4f-9b21-9c9d37b56a47",
                  "preps": {
                    "id": "sh01ea8345-b5af-4b4f-9b21-9c9d37b56a47",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl114"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl114",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh66bd3432-29ea-4cf2-bac4-a34964a5ba28",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh1c0628ce-ea82-4973-917a-261cbb2f970c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh65f50921-3409-4b9e-91b0-e6e7ad105fb4",
                  "preps": {
                    "id": "sh65f50921-3409-4b9e-91b0-e6e7ad105fb4",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc140",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc140",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sha281ba7b-86d2-4ff7-9c4d-0cb3cd74d51e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh15ceac1c-74f6-4c56-b2a1-266dc6c2c48a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh12633a4f-f210-45d3-8393-a3405ceefd81",
                  "preps": {
                    "id": "sh12633a4f-f210-45d3-8393-a3405ceefd81",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren166",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren166",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shcbd69c6c-5285-4c5d-8bcc-95977ce3925d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shb4abfd93-6354-477e-9910-b70334605636",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh70b991b2-6d8b-4c8b-a8eb-a15348592043",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh91c16bb7-dd0e-4a10-8aba-94d5e45eac90",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh204533a6-df8d-4db0-9bb3-d33b3b071251",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idshaca82d9d-7e33-4062-830d-5d550dc272c2",
                  "preps": {
                    "id": "Idshaca82d9d-7e33-4062-830d-5d550dc272c2",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text50",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "开检测试脚本及工具（工程/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text50",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shb92235c1-6104-41f0-9091-c6dcf49f8871",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh9e6e6ecc-83c6-458a-85c2-3959c1b5de9b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh23426ddb-9753-49e9-9f4a-1155d599d55c",
                  "preps": {
                    "id": "sh23426ddb-9753-49e9-9f4a-1155d599d55c",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj89",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj89",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh6c361384-e8e4-4d9b-82fd-69f800bd9284",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh05cf0a89-e721-43ce-a286-f7fadca0d01b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh3d2ae7bb-e982-42c4-bf69-7a729e613c0a",
                  "preps": {
                    "id": "sh3d2ae7bb-e982-42c4-bf69-7a729e613c0a",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl115"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl115",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shcfc2e78a-73ba-4cc7-86a0-101e82b6f263",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh1611b0f6-196e-478e-af4e-60e91516d7c5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shdde6cec8-86d9-44d7-8df7-38a14551b221",
                  "preps": {
                    "id": "shdde6cec8-86d9-44d7-8df7-38a14551b221",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc141",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc141",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh1ea43a4b-5891-4ae9-ba86-80bea2933437",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shc9c18af8-373f-4f7a-8e0b-2d53ea2782b1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh04e059dd-c0ed-4368-8d50-9f9a2354e268",
                  "preps": {
                    "id": "sh04e059dd-c0ed-4368-8d50-9f9a2354e268",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren167",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren167",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shc80e317a-a0c6-4ff9-b77f-fa0cc21fcae2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh034fde57-050b-4ef7-819f-782f4961136e",
          "colIndex": 1,
          "columns": [
            {
              "id": "shb7949a9a-8fff-4ad2-9bc8-1b0a09e3bcc6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "shb4f408a3-c15d-4bc1-af48-5ace71eb7676",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh4f25fc5e-3cc7-421b-b37a-28b46914e8b8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh5b59da20-71f0-42e4-8b59-4a39561bfac5",
                  "preps": {
                    "id": "Idsh5b59da20-71f0-42e4-8b59-4a39561bfac5",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text51",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "校准测试配置文件、脚本及工具（工程/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text51",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh2a018de4-1479-4e8d-a525-f8747263cbbe",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "she8d65d7d-2856-4a42-b538-288120b01445",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shc5ddaaa6-771b-4d42-a956-c656fe6a624e",
                  "preps": {
                    "id": "shc5ddaaa6-771b-4d42-a956-c656fe6a624e",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj90",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj90",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh7ad883cf-e4ec-4738-9aa2-5be8ff417254",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shf752e3c6-803c-4240-bc8e-99e215686a88",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh8ebb8f06-e64c-4721-8ab4-e9b564906360",
                  "preps": {
                    "id": "sh8ebb8f06-e64c-4721-8ab4-e9b564906360",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl116"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl116",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh7acb5f6b-0d99-4ce7-864a-6eeb328b3a99",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh35a53bff-9ba0-46b3-a4bf-30c7b1bca16f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh4c3f391a-f064-4705-bf11-f60458e424df",
                  "preps": {
                    "id": "sh4c3f391a-f064-4705-bf11-f60458e424df",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc142",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc142",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sha4699d46-6c33-4619-84f3-c01534f4ee2b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh6c979f6c-48a9-49b0-9b4f-f1b0c6e23494",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh81a42d96-999c-49f6-96f4-6bc881132dfe",
                  "preps": {
                    "id": "sh81a42d96-999c-49f6-96f4-6bc881132dfe",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren168",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren168",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh572cfa50-8f35-41f6-aba9-6884c7a72c8d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh5699e9d3-b32e-400a-9dd7-e1f9b19bf8b7",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh0d9fe5b9-5a54-462e-af25-920016f585ce",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "shcf092d1d-f650-4759-8664-8552af320db0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh2ad0c0d2-f80e-4945-b74a-66b696e13424",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh2d6c8054-b2b6-4b46-9d77-6f54ebbf5706",
                  "preps": {
                    "id": "Idsh2d6c8054-b2b6-4b46-9d77-6f54ebbf5706",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text52",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "综测测试脚本（工程/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text52",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh79d1d4ad-e481-49ab-aaf6-2c1e75d50a3e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh705a7f91-0c81-4558-8194-dfd50048cf44",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh78261f90-6a40-4b92-9a4f-dfb0697f6346",
                  "preps": {
                    "id": "sh78261f90-6a40-4b92-9a4f-dfb0697f6346",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj91",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj91",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shf4228ac7-cf02-4f0b-9643-6a9682690ccb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh7f2eeb1b-dd0d-44f4-b147-5f5a503f2621",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shc1a7de8c-ba97-468f-b345-5779695e0e9a",
                  "preps": {
                    "id": "shc1a7de8c-ba97-468f-b345-5779695e0e9a",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl117"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl117",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shf4a9424d-dca1-400b-9e34-b20bed460d81",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shc1c8088c-6027-4822-84bd-556a33b5543b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh13454452-9f48-46e0-8cbf-1ee7c4137120",
                  "preps": {
                    "id": "sh13454452-9f48-46e0-8cbf-1ee7c4137120",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc143",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc143",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shd6e7854c-f42f-45e0-9d70-daa2e28bc008",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shf262ab9d-4ea1-4fc2-a7cc-a79e34b144b5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shfd2f2d46-9e9b-46de-884a-291421f9670b",
                  "preps": {
                    "id": "shfd2f2d46-9e9b-46de-884a-291421f9670b",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren169",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren169",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh5b28a5ca-9943-49cf-b2be-8c71c94fd432",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shd95bd88c-e07f-438c-a256-beb6611ebf44",
          "colIndex": 1,
          "columns": [
            {
              "id": "shae3c4916-4e25-46a1-8f48-ffff24e408f2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh937be3a3-ac9b-47c8-9faf-78f7738377bf",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh194425e8-362f-48a0-bd7b-76c8127b4c1a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh4b1bacd3-ecbe-46ad-b947-5017824a5078",
                  "preps": {
                    "id": "Idsh4b1bacd3-ecbe-46ad-b947-5017824a5078",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text53",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "传导测试脚本（工程/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text53",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh461b6e59-2be1-45a0-bd33-b97ba9123eb6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shf57fa670-44d4-4890-99a4-3709d9854eb1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shbc2c55a0-8a37-406f-b264-0f7f97147bda",
                  "preps": {
                    "id": "shbc2c55a0-8a37-406f-b264-0f7f97147bda",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj92",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj92",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh6be5ade0-0435-4e44-8e3d-19d3b7be0f31",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh301fd584-94f1-4162-b9da-9049e1686cc5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "she290cde9-259d-458c-b386-4c693adab389",
                  "preps": {
                    "id": "she290cde9-259d-458c-b386-4c693adab389",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl118"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl118",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh993eca44-238a-489f-84e4-402dd3d0965d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh9ecda5ac-6cfe-4b08-81c5-bbf1339114fc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh0fee1f9e-0095-441c-9bc4-b5cb8c9262fc",
                  "preps": {
                    "id": "sh0fee1f9e-0095-441c-9bc4-b5cb8c9262fc",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc144",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc144",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh755e47b6-9265-4d3e-b0e3-cb96c2a3312d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shd511d471-edbe-4428-a974-462ab54b9e5d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh62693c56-8a99-4662-a2e3-be8fae620050",
                  "preps": {
                    "id": "sh62693c56-8a99-4662-a2e3-be8fae620050",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren170",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren170",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh8ac47459-f9df-4436-921a-b29401e0e689",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh676c0d24-6626-4bd3-99a1-2fb992a56c16",
          "colIndex": 1,
          "columns": [
            {
              "id": "shc3aa2a5b-1d5a-40bb-8c1a-f647a8ce6412",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "shab8435c3-fe46-4a4b-aabf-2aac90a4abcf",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "shbdd46655-849e-44f7-b172-73ddca59e1fa",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh4d0d0900-7080-4400-b038-9ab234764c8c",
                  "preps": {
                    "id": "Idsh4d0d0900-7080-4400-b038-9ab234764c8c",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text54",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "功能测试脚本（工程/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text54",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh7a5ff0c6-9a4e-40cf-adce-c2b979ed0155",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh6c44b8a6-72f0-4a4e-9356-190a1c54d6ba",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shcb93a647-e076-44c9-939a-d2ffc45a6d85",
                  "preps": {
                    "id": "shcb93a647-e076-44c9-939a-d2ffc45a6d85",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj93",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj93",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh49891007-17be-4513-b6a4-9fa994d99e00",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh8cff9609-2814-459c-945c-31f3155bb7f7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sha3fe7676-3b79-44a6-a39c-975739f21854",
                  "preps": {
                    "id": "sha3fe7676-3b79-44a6-a39c-975739f21854",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl119"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl119",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shb6434ad2-cc7d-44d3-a070-488d55a49af8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shd6091323-d5ed-45a1-b3cd-23fe5c8acd8d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh573e990c-e16b-4a59-a97f-a6e655a483a9",
                  "preps": {
                    "id": "sh573e990c-e16b-4a59-a97f-a6e655a483a9",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc145",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc145",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shd59fb8d5-aee9-43a8-a7ff-dc8e6115b7f9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh5b437f49-6f2c-4f19-8d47-3c94d6efa01a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh11037c49-3f92-4378-9fcd-46c02e063376",
                  "preps": {
                    "id": "sh11037c49-3f92-4378-9fcd-46c02e063376",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren171",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren171",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shc82f8ece-69d0-41a0-a7ea-e59d425e60ae",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shcb59d0d8-4762-4e18-a279-d3b52f5bb649",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh26a624cf-1a8c-4091-ba62-f656d85690e2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "shd5e1dc9e-97a8-49f4-9ed3-87d059059ae8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh735cba3d-fa3b-43c9-ba5c-affa44645f86",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsha0b43aff-4e42-4c9f-945b-9a8d9d8d92ff",
                  "preps": {
                    "id": "Idsha0b43aff-4e42-4c9f-945b-9a8d9d8d92ff",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text55",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "暗电流测试脚本（工程/品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text55",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh0a724c5e-136a-470c-9a6c-6917a858274b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh6f804b45-b48e-4845-bedc-576f9303490f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "shf6280be4-494e-4ef7-814b-9fad72cbdfba",
                  "preps": {
                    "id": "shf6280be4-494e-4ef7-814b-9fad72cbdfba",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj94",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj94",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh32cfb18d-a3f3-4ffe-b3be-7283be2175f1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh19d97211-cddb-40c5-8775-74207c726a79",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh2244c170-bc58-4e89-b9e6-0f3368d87850",
                  "preps": {
                    "id": "sh2244c170-bc58-4e89-b9e6-0f3368d87850",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl120"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl120",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh17a6e1b8-69ca-418e-b84c-b72fd11df186",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh7e4079d0-cdda-48da-a1a9-9901c12ebea4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh9a35ff98-36f1-43cb-80f0-df14a06d1ab7",
                  "preps": {
                    "id": "sh9a35ff98-36f1-43cb-80f0-df14a06d1ab7",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc146",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc146",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh83e90a3f-d956-4105-ad3e-39350eb15b05",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "she3f3b15e-bdec-445a-aa31-465696f5daad",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh9b8dae07-95d6-42bd-aa7a-16fd3f6ffe68",
                  "preps": {
                    "id": "sh9b8dae07-95d6-42bd-aa7a-16fd3f6ffe68",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren172",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren172",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh33251931-1a53-44bb-bf81-957cc09879f8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh1bc389e1-aa52-4e3c-b1c7-3fcdf94d4827",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh6d7dbba5-b89a-42f1-b1ff-93780518b7da",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "43px"
            },
            {
              "id": "sh388b75ae-6556-40dd-9b37-240fc711bf2e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "39px"
            },
            {
              "id": "sh057fd37f-3747-4989-aa31-4e2875f7b2fc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh1184f382-2866-499c-81af-babebdad6706",
                  "preps": {
                    "id": "Idsh1184f382-2866-499c-81af-babebdad6706",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text56",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "外观检查：检查 弹片、屏蔽盖、BTB、LED、光感、SIM卡盖子是否有焊接不良，BTB、LED、光感等目视无法看清焊接情况的器件需要CCD检验；板边小料是否有损件。（品质确认）"
                  },
                  "compType": "formItem",
                  "fieldName": "text56",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shfd21f56b-1edc-4e45-b8ef-e7f5dea52561",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shc1d71605-226d-4f6e-ab69-e10e254f8bbf",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh1ce70ac3-2e76-48d8-bd6b-6e224daf5b3f",
                  "preps": {
                    "id": "sh1ce70ac3-2e76-48d8-bd6b-6e224daf5b3f",
                    "label": "时间选择器(复制)",
                    "itemNameLabel": "时间选择器",
                    "name": "qssj95",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "isRange": true,
                    "elements": [
                      {
                        "id": "sh350330bd-ef6e-4685-bf04-5d93ee70c2b5",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh0ca67972-659f-49f8-ba4b-9e86fe8297c3",
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
                  "fieldName": "qssj95",
                  "itemType": "time-picker",
                  "label": "时间选择器",
                  "type": "time-picker"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh670a4b8e-7535-49a4-a721-045a9f0010c3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shf95b0e1c-fd8f-4b01-844f-55930696988f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh6912d07b-aa2a-438a-b8bb-cd764c244d06",
                  "preps": {
                    "id": "sh6912d07b-aa2a-438a-b8bb-cd764c244d06",
                    "label": "数据记录(复制)",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数据记录(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "sjjl121"
                  },
                  "compType": "formItem",
                  "fieldName": "sjjl121",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh34c28cac-72ac-473a-9b9f-16895e22fb5e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh81c4a337-80d3-4bfa-a0e2-fdd55b4acbee",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh9e41c5fe-0355-44b7-adbe-a8e691403b14",
                  "preps": {
                    "id": "sh9e41c5fe-0355-44b7-adbe-a8e691403b14",
                    "label": "异常原因/对策(复制)",
                    "itemNameLabel": "多行文本框",
                    "name": "ycyydc147",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入异常原因/对策(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "ycyydc147",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shb8efbde6-f02d-4a49-a82a-0af7b3125ef6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "she47367c2-9524-4f5f-b6a7-bf24db58399f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "sh9643383c-72a4-4764-8a99-40cbbfd191bb",
                  "preps": {
                    "id": "sh9643383c-72a4-4764-8a99-40cbbfd191bb",
                    "label": "确认人(复制)",
                    "itemNameLabel": "单行文本框",
                    "name": "qurenren173",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认人(复制)",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "qurenren173",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh9076865a-c9fa-44d5-a7ef-48a27f4d0154",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shcdad5e31-5041-448a-839c-0e6f40a6cc9d",
          "colIndex": 1,
          "columns": [
            {
              "id": "shdf1fc531-f0e6-4c67-8d15-f32a8c302961",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshb10e953e-146a-4982-ad79-93dd2ded16cb",
                  "preps": {
                    "id": "Idshb10e953e-146a-4982-ad79-93dd2ded16cb",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text57",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "判定结果",
                    "appCompVisible": true,
                    "labelFor": [
                      "pandingjieguo"
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "text57",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true,
              "colWidth": "43px"
            },
            {
              "id": "sh845ec944-d9a8-44c7-9eb1-12a4c1abbe28",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 11,
              "items": [
                {
                  "id": "Idsh4cce6e71-6f73-4f28-83c3-69c5fe064d80",
                  "preps": {
                    "id": "Idsh4cce6e71-6f73-4f28-83c3-69c5fe064d80",
                    "label": "判定结果",
                    "itemNameLabel": "单选框",
                    "name": "pandingjieguo",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "A:合格，可以生产",
                        "value": "A",
                        "xh": 1
                      },
                      {
                        "name": "B:不合格，暂停生产",
                        "value": "B",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ],
                    "placeholder": ""
                  },
                  "compType": "formItem",
                  "fieldName": "pandingjieguo",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ],
              "cellVisible": true,
              "colWidth": "39px"
            },
            {
              "id": "shc21d42af-88e9-45fa-bd5b-79d16ee7e434",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shef0cf56a-d3ac-4aae-85ae-e57f6d00d01c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sha17254c3-227a-426c-ae77-a6eb8fcc3694",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shc0e0502f-d14f-4978-9345-accdc5851446",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shc7d2d804-f6bf-443d-ab02-3912f69333c5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh86612c54-59db-475c-9343-1d2424ddbf91",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh5e2d7577-3765-4d76-963b-bec64fb7140e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh064ee448-2277-4a77-b2ad-75362b846b4e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh1b366377-0fe4-4fcf-9f4a-9c6c465c1371",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh2dadcc56-fe5d-4577-abf4-db44de38ecf4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh20f34127-74f4-484c-9e2e-2148b173ac1e",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh2490789e-3f5b-4cff-8abb-cce0727630b5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshb923795e-4c4c-46a0-b306-eba0cd78f0fa",
                  "preps": {
                    "id": "Idshb923795e-4c4c-46a0-b306-eba0cd78f0fa",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text59",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "备注",
                    "placeholder": "",
                    "labelFor": [
                      "beizhu"
                    ],
                    "appCompVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "text59",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true,
              "colWidth": "43px"
            },
            {
              "id": "sh45a727e6-7ff9-4cf1-aaf9-23ffad7a52a9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 11,
              "items": [
                {
                  "id": "Idsh07998ce6-e7cc-4679-96d7-b591e7324bae",
                  "preps": {
                    "id": "Idsh07998ce6-e7cc-4679-96d7-b591e7324bae",
                    "label": "多行文本框",
                    "itemNameLabel": "多行文本框",
                    "name": "beizhu",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入多行文本框",
                    "rules": [],
                    "maxLength": 1000,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "beizhu",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true,
              "colWidth": "39px"
            },
            {
              "id": "sh8681e97d-9d46-4b16-a1c5-dbcdb1bd3673",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh7f363b33-04f3-4956-bc64-05162f8e0e31",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh5c88274f-b1a2-416d-91da-a25ecc4984ee",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh9b7081d1-b60c-439a-8964-f7181c8c9795",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh0873274d-c4d0-4f2a-a7e5-c045ed0bd76d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh46dc268a-083c-4b7a-bdf5-8c4e68f16ccc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shdddd8563-afa3-4652-bfd8-f057a2d6837c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shf9fb32b4-2f10-4f72-972a-cfdb71f33e45",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sha9e4ef39-e23b-48f2-9b42-16c5bdbe07b1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh34f29989-5f90-4075-af98-26204ad3495c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh447f6bf2-f771-4f6d-9b8f-a6135113fd2c",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh54bc8b25-7ce3-4808-9f67-2a6e4209c249",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshe5eda564-e00b-4c46-9466-05e36799b453",
                  "preps": {
                    "id": "Idshe5eda564-e00b-4c46-9466-05e36799b453",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text61",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "placeholder": "",
                    "staticData": true,
                    "textContent": "会签"
                  },
                  "compType": "formItem",
                  "fieldName": "text61",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true,
              "colWidth": "43px"
            },
            {
              "id": "shb73e9e2f-605c-4f85-b3cf-3ff4612cb992",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idshd383cded-414d-45ab-85db-247ce22fe5e4",
                  "preps": {
                    "id": "Idshd383cded-414d-45ab-85db-247ce22fe5e4",
                    "itemNameLabel": "单行文本框",
                    "name": "shengchanbu",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入生产部",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "生产部"
                  },
                  "compType": "formItem",
                  "fieldName": "shengchanbu",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true,
              "colWidth": "39px"
            },
            {
              "id": "sh028f60b0-4e77-48be-bca3-c53308166fcf",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh1fad6ed7-e097-4701-9047-ae1e86cbfb3f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh18e02231-b0c2-4233-a96d-63dadb239ad2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh90f9537c-4304-4234-b50d-ef717653d752",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh362bdd94-9a12-4720-beb1-d1ede38bd093",
                  "preps": {
                    "id": "Idsh362bdd94-9a12-4720-beb1-d1ede38bd093",
                    "label": "工程部",
                    "itemNameLabel": "单行文本框",
                    "name": "gongchengbu",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入工程部",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "gongchengbu",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh43529726-8726-480f-8988-7e19faa1369a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sha675592a-9047-43ce-b6bd-c6ab1a5ccecc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shd43183a4-0c4f-4dcb-bee7-acc0468fcd49",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idshcaf244ea-3342-48fa-acf4-b6da4a6e029b",
                  "preps": {
                    "id": "Idshcaf244ea-3342-48fa-acf4-b6da4a6e029b",
                    "label": "质量部",
                    "itemNameLabel": "单行文本框",
                    "name": "zhiliangbu",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入质量部",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "zhiliangbu",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh102188b3-3996-4ba5-b03b-a121e8eef935",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shb664ef6e-1e70-403b-94dc-74202992ebc1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh3c15eae2-a4f7-4f4a-bce5-5271afac500f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        }
      ],
      "rules": [],
      "maxLength": 255,
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true,
      "rowNums": 36,
      "columnNums": 12
    },
    "compType": "container",
    "fieldName": "dytable1",
    "itemType": "dytable",
    "rowNums": 1,
    "columnNums": 1,
    "type": "dytable"
  }
];
const fieldList = {
  "fieldList" : [ {
    "dytableList" : [
        [ {
      "label" : "Html组件",
      "fieldName" : "html2",
      "type" : "html",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "rowNums" : 1,
        "textContent" : "<p style=\"text-align: center;\"><span style=\"font-size: 19px;\">惠州朵唯通信设备有限公司</span></p><p style=\"text-align: center;\"><span style=\"font-size: 19px;\">异常反馈单</span></p>",
        "label" : "Html组件",
        "colspan" : 5,
        "viewVisible" : true,
        "itemNameLabel" : "Html组件",
        "readonly" : false,
        "formVisible" : true,
        "elements" : [ {
          "id" : "sh4e7f9873-960c-4fbe-bfda-febc1108da17",
          "colIndex" : 1,
          "columns" : [ {
            "id" : "she2d30714-d681-48e8-be06-c4e1093f765a",
            "colIndex" : 1,
            "rowspan" : 1,
            "colspan" : 1,
            "items" : [ ],
            "cellVisible" : true
          } ]
        } ],
        "rowspan" : 3,
        "name" : "html2",
        "id" : "shdb288f86-bede-4d0a-b634-27be9280f3bb",
        "columnNums" : 1,
        "staticData" : true,
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "shc7e0f485-5f98-4a78-bbfe-a666bb539c2e"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "sh7a933260-3369-4bdf-82be-3718674e2030"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh3a0a7cbe-18c3-41ac-b891-178bee5f4baa"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "sh29a99eca-3da8-433a-8e8c-d88209e83375"
      }
    }, {
      "label" : "静态文本",
      "fieldName" : "text3",
      "type" : "text",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "colWidth" : "185px",
        "textContent" : "批准",
        "label" : "静态文本",
        "colspan" : 1,
        "viewVisible" : true,
        "itemNameLabel" : "静态文本",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "text3",
        "appCompVisible" : true,
        "id" : "sh272263b2-64ee-49e0-8f03-081f4befe3ea",
        "staticData" : true,
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "label" : "静态文本",
      "fieldName" : "text4",
      "type" : "text",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "textContent" : "审核",
        "label" : "静态文本",
        "colspan" : 1,
        "viewVisible" : true,
        "itemNameLabel" : "静态文本",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "text4",
        "appCompVisible" : true,
        "id" : "sh623fdb70-b314-4ab8-8243-6004f382c6b8",
        "staticData" : true,
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "label" : "静态文本",
      "fieldName" : "text5",
      "type" : "text",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "textContent" : "作成",
        "label" : "静态文本",
        "colspan" : 1,
        "viewVisible" : true,
        "itemNameLabel" : "静态文本",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "text5",
        "appCompVisible" : true,
        "id" : "sh78e007ac-fa43-4cf9-81e9-80e527dddcc1",
        "staticData" : true,
        "maxLength" : 255,
        "listVisible" : true
      }
    } ], [ {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh5eb69288-c3df-4ef0-9242-6ec52e0ecb84"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh0b41f4fe-b1cd-439a-8188-f21af057b9d7"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "sh93fcd205-ced0-4372-9ef7-df4da5fd99d8"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh7c931d88-4db2-4f2e-9f90-4ec5a2c1fca3"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "sh947310d0-1d41-4d19-b30f-9edf3ab0abd0"
      }
    }, {
      "label" : "批准",
      "fieldName" : "pizhun",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "rowNums" : 1,
        "colWidth" : "185px",
        "label" : "批准",
        "colspan" : 1,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "elements" : [ {
          "id" : "sh92de17dc-2c75-438a-ae0d-f75fc78efec2",
          "colIndex" : 1,
          "columns" : [ {
            "id" : "sh4a57cafb-8301-4737-909d-c53c44d945c9",
            "colIndex" : 1,
            "rowspan" : 1,
            "colspan" : 1,
            "items" : [ ],
            "cellVisible" : true
          } ]
        } ],
        "rowspan" : 1,
        "name" : "pizhun",
        "id" : "shac0fc43c-9515-4c7c-bc72-8e8befb155e9",
        "placeholder" : "请输入批准",
        "columnNums" : 1,
        "maxLength" : 255,
        "listVisible" : true,
        "hideLabel" : true
      }
    }, {
      "label" : "审核",
      "fieldName" : "shenhe",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "审核",
        "colspan" : 1,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "shenhe",
        "id" : "sh0d1abe78-a0b2-48fe-a2ab-b6f429816a06",
        "placeholder" : "请输入审核",
        "maxLength" : 255,
        "listVisible" : true,
        "hideLabel" : true
      }
    }, {
      "label" : "作成",
      "fieldName" : "zuocheng",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "作成",
        "colspan" : 1,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "zuocheng",
        "id" : "sh7aa26678-4e58-4cde-8359-3ac1383a1544",
        "placeholder" : "请输入作成",
        "maxLength" : 255,
        "listVisible" : true,
        "hideLabel" : true
      }
    } ], [ {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "shfe7b5fcd-6fd5-4c15-9a70-2e480840c0db"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh5c19db94-7757-4caa-a69b-2fe01c7bfe0e"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "sh3b94e38d-6cef-4799-96b8-a560ec3632d3"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh7e9e2682-e41b-439d-a266-4e3bb649f211"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "shaf566f28-16df-43bb-ab5c-b175b24b4387"
      }
    }, {
      "label" : "批准时间",
      "fieldName" : "pizhunshijian",
      "type" : "datetime",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "colWidth" : "185px",
        "label" : "批准时间",
        "type" : "datetime",
        "colspan" : 1,
        "viewVisible" : true,
        "itemNameLabel" : "日期选择器",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "pizhunshijian",
        "id" : "sh5513989e-d01d-493f-919c-5ce15a262d75",
        "placeholder" : "请选择批准时间",
        "maxLength" : 255,
        "listVisible" : true,
        "hideLabel" : true
      }
    }, {
      "label" : "审核时间",
      "fieldName" : "shenheshijian",
      "type" : "datetime",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "审核时间",
        "type" : "datetime",
        "colspan" : 1,
        "viewVisible" : true,
        "itemNameLabel" : "日期选择器",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "shenheshijian",
        "id" : "sh1d77c0c8-7df2-46e8-addc-e6c8db504da0",
        "placeholder" : "请选择审核时间",
        "maxLength" : 255,
        "listVisible" : true,
        "hideLabel" : true
      }
    }, {
      "label" : "作成时间",
      "fieldName" : "zuochengshijian",
      "type" : "datetime",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "作成时间",
        "type" : "datetime",
        "colspan" : 1,
        "viewVisible" : true,
        "itemNameLabel" : "日期选择器",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "zuochengshijian",
        "id" : "sh9a8987c4-1106-4ec6-b5a9-28b741a710f8",
        "placeholder" : "请选择作成时间",
        "maxLength" : 255,
        "listVisible" : true,
        "hideLabel" : true
      }
    } ], [ {
      "label" : "TO",
      "fieldName" : "formTo",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "TO",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "formTo",
        "id" : "sh828e9be4-d111-4f6c-82a3-21a12d7865d9",
        "placeholder" : "请输入TO",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh0a470bc8-3c23-4e47-9b8c-74c32b35710c"
      }
    }, {
      "label" : "CC",
      "fieldName" : "chaosong",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "colWidth" : "186px",
        "label" : "CC",
        "colspan" : 4,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "chaosong",
        "id" : "shb043dcff-f307-4ca0-9396-bde2709450f4",
        "placeholder" : "请输入CC",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sheedb2b29-ac3c-44d5-b426-746b4b7713b7"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "sh353e8cc7-6ee1-4a1c-87df-9cc955d0899d"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "shab30f31b-a4f0-4e97-b3d9-b3bab137ec43"
      }
    }, {
      "label" : "编号",
      "fieldName" : "bianhao",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "searchVisible" : true,
        "cellVisible" : true,
        "label" : "编号",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "defaultVisible" : true,
        "rowspan" : 1,
        "name" : "bianhao",
        "id" : "sh43355758-0f59-4c58-999e-dba032b13c41",
        "placeholder" : "请输入编号",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh5faa898a-9c79-4037-bb4a-264cd445cc41"
      }
    } ], [ {
      "label" : "机型",
      "fieldName" : "jixing",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "searchVisible" : true,
        "cellVisible" : true,
        "label" : "机型",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "defaultVisible" : true,
        "rowspan" : 1,
        "name" : "jixing",
        "id" : "sh95fde466-3c98-482b-9617-8cf5a49ca10e",
        "placeholder" : "请输入机型",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "shf763f014-36a8-444a-867d-c849d23b619e"
      }
    }, {
      "label" : "生产批号",
      "fieldName" : "shengchanpihao",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "searchVisible" : true,
        "cellVisible" : true,
        "colWidth" : "186px",
        "label" : "生产批号",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "defaultVisible" : true,
        "rowspan" : 1,
        "name" : "shengchanpihao",
        "id" : "shc89eabf2-6ddf-42d1-afbc-a2c6d3abf689",
        "placeholder" : "请输入生产批号",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh821a62f7-a584-46e2-9d29-9eb7fab9b97c"
      }
    }, {
      "label" : "批量",
      "fieldName" : "piliang",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "colWidth" : "172px",
        "label" : "批量",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "piliang",
        "id" : "she382caae-53b3-4193-bb40-978526db89c1",
        "placeholder" : "请输入批量",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "sh117b2e3d-2bf3-4aa4-869d-ace763c9c34e"
      }
    }, {
      "label" : "发生时间",
      "fieldName" : "fashengshijian",
      "type" : "datetime",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "发生时间",
        "type" : "datetime",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "日期选择器",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "fashengshijian",
        "id" : "sh7802503a-0fab-4a79-b7ab-bf7e132e8470",
        "placeholder" : "请输入发生时间",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh6babbacc-d725-4e67-9954-2c7b23329008"
      }
    } ], [ {
      "label" : "投入数",
      "fieldName" : "tourushu",
      "type" : "number",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "precision" : 0,
        "label" : "投入数",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "数字输入框",
        "min" : 0,
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "tourushu",
        "step" : 1,
        "id" : "sh041b920a-8e1b-40ca-be27-c7cd0759eba3",
        "placeholder" : "请输入投入数",
        "maxLength" : 10,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh683180c3-f982-4a25-99e7-539622d295f2"
      }
    }, {
      "label" : "不良数",
      "fieldName" : "buliangshu",
      "type" : "number",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "precision" : 0,
        "colWidth" : "186px",
        "label" : "不良数",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "数字输入框",
        "min" : 0,
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "buliangshu",
        "step" : 1,
        "id" : "sh1776fa92-fbe5-439c-890b-57041f83a636",
        "placeholder" : "请输入不良数",
        "maxLength" : 10,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh7cc5abbb-12c2-494e-9955-096f3a787df1"
      }
    }, {
      "label" : "不良率",
      "fieldName" : "bulianglv",
      "type" : "number",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "precision" : 0,
        "colWidth" : "172px",
        "label" : "不良率",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "数字输入框",
        "min" : 0,
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "bulianglv",
        "step" : 1,
        "id" : "sh207680a2-2a3b-471e-84da-55d82b3c122a",
        "placeholder" : "请输入不良率",
        "maxLength" : 10,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "sh22ece42f-810b-4807-922e-74ec1458eb79"
      }
    }, {
      "label" : "反馈时间",
      "fieldName" : "fankuishijian",
      "type" : "datetime",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "反馈时间",
        "type" : "datetime",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "日期选择器",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "fankuishijian",
        "id" : "sh7ae3cc32-3cba-4e10-82f9-6edae73fd632",
        "placeholder" : "请选择反馈时间",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh6714b888-c066-479c-a4f1-1df4379ca055"
      }
    } ], [ {
      "label" : "异常内容描述",
      "fieldName" : "ycnrms",
      "type" : "textarea",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "异常内容描述",
        "colspan" : 6,
        "colHeight" : "127px",
        "viewVisible" : true,
        "itemNameLabel" : "多行文本框",
        "readonly" : false,
        "formVisible" : true,
        "labelPosition" : "top",
        "rowspan" : 1,
        "name" : "ycnrms",
        "id" : "shebddaed2-9e1b-4283-874c-fab336375418",
        "placeholder" : "请输入异常内容描述",
        "maxLength" : 1000,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : "175px",
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh2ab8a344-756b-4c44-b0d9-cf1a06aaab6a"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "sh794ff7dc-655a-4ed2-b765-3166980aa20e"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "shd0543201-7e7b-49e2-931e-1e0eb664852c"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "she64847d9-1b73-4268-9aa7-3166c89ddaba"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "sh42376ceb-9bbe-4dbc-8eb1-2fb548e70319"
      }
    }, {
      "label" : "静态文本",
      "fieldName" : "text24",
      "type" : "text",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "textContent" : "开出部门",
        "label" : "静态文本",
        "colspan" : 1,
        "viewVisible" : true,
        "itemNameLabel" : "静态文本",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "text24",
        "id" : "sh86605876-ebf5-43cf-a6ad-5718d93f9505",
        "staticData" : true,
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "label" : "开出部门",
      "fieldName" : "kaichubumen",
      "type" : "radio",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "values" : [ {
          "name" : "IPQC",
          "value" : "ipqc"
        }, {
          "name" : "FQC",
          "value" : "fqc"
        }, {
          "name" : "工程",
          "value" : "gongcheng"
        }, {
          "name" : "产线",
          "value" : "chanxian"
        }, {
          "name" : "其它",
          "value" : "qita"
        } ],
        "label" : "开出部门",
        "colspan" : 1,
        "viewVisible" : true,
        "itemNameLabel" : "单选框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "kaichubumen",
        "valuesDefaultValue" : [ { } ],
        "id" : "sh31195e04-1718-41cb-9a13-cd2ec14856e8",
        "dataSource" : "data",
        "analysisType" : "func",
        "maxLength" : 255,
        "listVisible" : true,
        "hideLabel" : true
      }
    } ], [ {
      "label" : "根本原因分析（工程填写）",
      "fieldName" : "gbyyfxgctx",
      "type" : "textarea",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "根本原因分析（工程填写）",
        "colspan" : 6,
        "colHeight" : "171px",
        "viewVisible" : true,
        "itemNameLabel" : "多行文本框",
        "readonly" : false,
        "formVisible" : true,
        "labelPosition" : "top",
        "rowspan" : 3,
        "name" : "gbyyfxgctx",
        "id" : "sh23b6a0c8-c148-401c-ab9e-23394df58d95",
        "placeholder" : "请输入根本原因分析（工程填写）",
        "maxLength" : 1000,
        "listVisible" : true
      }
    }, {
      "label" : "责任判定",
      "fieldName" : "zherenpanding",
      "type" : "radio",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "values" : [ {
          "name" : "设计不良",
          "value" : "sjbl"
        }, {
          "name" : "物料不良",
          "value" : "wlbl"
        }, {
          "name" : "制程不良",
          "value" : "zcbl"
        }, {
          "name" : "其它",
          "value" : "qita"
        } ],
        "label" : "责任判定",
        "colspan" : 6,
        "colHeight" : "171px",
        "viewVisible" : true,
        "itemNameLabel" : "单选框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 3,
        "name" : "zherenpanding",
        "valuesDefaultValue" : [ { } ],
        "id" : "sh23b6a0c8-c148-401c-ab9e-23394df58d95",
        "dataSource" : "data",
        "analysisType" : "func",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh668f8c13-c792-4d9c-99df-920fa78d32bb"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "shf91186c9-ba49-4bc5-a2aa-4ab579d6925c"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh8ec832fc-aa46-41f2-9f2c-724b1d577a1f"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "sh1253077b-1150-426a-9972-8161beb8bf02"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "sha46ec3f1-f24e-4eab-bb26-bafa185e4f05"
      }
    }, {
      "label" : "分析人",
      "fieldName" : "fenxiren",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "分析人",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "fenxiren",
        "id" : "sha9a88708-4bba-4e88-9788-934624e31f5d",
        "placeholder" : "请输入分析人",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh3820890f-eb8e-4185-8f8e-0b86ebdcce6f"
      }
    } ], [ {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh8b7418bf-af2d-486e-a397-3ce4bde1d683"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "shf224a7d3-2251-48a9-9f79-e1526b366426"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "shd2561a4a-fb4c-4d6d-a1b5-5cdec59d246b"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh06ffb16f-1cf8-45ab-be9b-7293139e9982"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "sha69fe1cf-4739-4dfa-ad21-365d24d444f9"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "sh5a964a88-417b-4646-9e93-8100875a7c0b"
      }
    }, {
      "label" : "QE确认",
      "fieldName" : "qequeren",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "QE确认",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "qequeren",
        "id" : "sh1a647fd5-536b-4255-9d3e-262e02b8e106",
        "placeholder" : "请输入QE确认",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh27dfdf22-bad5-4c85-b69e-f039ade668af"
      }
    } ], [ {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh9e472243-dfd3-4292-9d56-2d98eb90f976"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh0e306f16-caa0-491c-8fcb-47e644ba468c"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "sh133a94d2-e77f-4202-abfb-67d602ba2b6e"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh62f55c02-1edf-4d46-bdc4-8b81f9d7383f"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "sh633c06c3-b905-46f2-b4b5-b6751e638dce"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "sh6b877e82-7bba-445b-b843-e124a1288d00"
      }
    }, {
      "label" : "工程经理",
      "fieldName" : "gongchengjingli",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "工程经理",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "gongchengjingli",
        "id" : "sh49253a3a-9b4d-477c-b2c9-a2e797102ad0",
        "placeholder" : "请输入工程经理",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh49b08e2b-2452-4ef2-b65e-1ef17300aaca"
      }
    } ], [ {
      "label" : "临时措施（责任部门填写）",
      "fieldName" : "lscszrbmtx",
      "type" : "textarea",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "临时措施（责任部门填写）",
        "colspan" : 6,
        "colHeight" : "125px",
        "viewVisible" : true,
        "itemNameLabel" : "多行文本框",
        "readonly" : false,
        "formVisible" : true,
        "labelPosition" : "top",
        "rowspan" : 2,
        "name" : "lscszrbmtx",
        "id" : "shf1f22cd1-a43d-48c4-9e1a-5ddde5ff51db",
        "placeholder" : "请输入临时措施（责任部门填写）",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sha07ede78-1db2-4d55-bff1-7ce92ba46a45"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "shbeec7cf3-6133-42d1-a0bf-cbc24e3814b8"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sha29bc3b9-86a3-41e8-9d5c-357b9ee622dc"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "shb5e6e210-89cb-4fa0-a4fe-c22bbed8a974"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "she135b82a-1a4f-42cf-82a5-ce47bf5814c2"
      }
    }, {
      "label" : "制订人",
      "fieldName" : "zhidingren",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "制订人",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "zhidingren",
        "id" : "sh956c7896-4cbc-4a84-ac6f-867f41c1309d",
        "placeholder" : "请输入制订人",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh248ee88e-74c8-440f-9116-9c873100baae"
      }
    } ], [ {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "she3a78973-404b-4571-b808-70ebee92b36e"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh5ef1c601-603b-4530-b988-6b397fae57e9"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "sh448e381d-9022-4492-b232-a75c791a8220"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh681332af-d3c9-4312-b84e-38354b86dbf1"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "sh78d1e926-c6b8-44f7-9457-05de399144cd"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "shc2ffa945-11d9-44e9-a07b-a202aa39273d"
      }
    }, {
      "label" : "制定时间",
      "fieldName" : "shidingshijian",
      "type" : "datetime",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "制定时间",
        "type" : "datetime",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "日期选择器",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "shidingshijian",
        "id" : "sh932221c7-eb17-4722-a8c4-c2b72fe4807a",
        "placeholder" : "请输入制定时间",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh125efa33-85c4-452d-8ff3-20077b562165"
      }
    } ], [ {
      "label" : "静态文本",
      "fieldName" : "text34",
      "type" : "text",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "textContent" : "不良排查",
        "label" : "静态文本",
        "colspan" : 1,
        "viewVisible" : true,
        "itemNameLabel" : "静态文本",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 2,
        "name" : "text34",
        "id" : "sh9679151e-ecfa-47d1-a3b5-5145605290fb",
        "staticData" : true,
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "label" : "1.原材料",
      "fieldName" : "yuancailiao",
      "type" : "radio",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "values" : [ {
          "name" : "需要",
          "value" : "xuyao"
        }, {
          "name" : "不需要",
          "value" : "buxuyao"
        } ],
        "label" : "1.原材料",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单选框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "yuancailiao",
        "valuesDefaultValue" : [ { } ],
        "id" : "shccb2fe0d-3b8f-42a5-80a9-e9b6939f5138",
        "dataSource" : "data",
        "analysisType" : "func",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "sh129eeb8f-eefd-46a3-9e06-57e68d4df8a7"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : true,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh23b4c925-dd12-4e4a-a000-a28811654d06"
      }
    }, {
      "label" : "2.在制半成品",
      "fieldName" : "zzbcp",
      "type" : "radio",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "values" : [ {
          "name" : "需要",
          "value" : "xuyao"
        }, {
          "name" : "不需要",
          "value" : "buxuyao"
        } ],
        "colWidth" : "172px",
        "label" : "2.在制半成品",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单选框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "zzbcp",
        "valuesDefaultValue" : [ { } ],
        "id" : "shfeb9c678-5b89-4706-b05a-4a80cdc5fbda",
        "dataSource" : "data",
        "analysisType" : "func",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "shbd0362a4-8e3d-4185-b6a7-4415fccc6436"
      }
    }, {
      "label" : "排查人员",
      "fieldName" : "paicharenyuan",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "排查人员",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 2,
        "name" : "paicharenyuan",
        "id" : "sh35329b71-f884-4640-b668-9077092ecff3",
        "placeholder" : "请输入排查人员",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh794c2235-f1eb-4e1d-a1c7-f18ba1d7d060"
      }
    } ], [ {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh55381a5c-f311-4cee-9dea-1ad6c6aeba06"
      }
    }, {
      "label" : " 3.成品库存",
      "fieldName" : "chengpinkucun",
      "type" : "radio",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "values" : [ {
          "name" : "需要",
          "value" : "xuyao"
        }, {
          "name" : "不需要",
          "value" : "buxuyao"
        } ],
        "label" : " 3.成品库存",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单选框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "chengpinkucun",
        "valuesDefaultValue" : [ { } ],
        "id" : "shf0dc5955-36d1-4841-a0f9-94b2e137ab46",
        "dataSource" : "data",
        "analysisType" : "func",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "shd81d41e6-4bb9-4efc-9789-b683f69db7b0"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : true,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh5333dc9a-6a9e-456c-ba61-488232840b24"
      }
    }, {
      "label" : "4.已出货品",
      "fieldName" : "yichuhuopin",
      "type" : "radio",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "values" : [ {
          "name" : "需要",
          "value" : "xuyao"
        }, {
          "name" : "不需要",
          "value" : "buxuyao"
        } ],
        "colWidth" : "172px",
        "label" : "4.已出货品",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单选框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "yichuhuopin",
        "valuesDefaultValue" : [ { } ],
        "id" : "shb47c7d86-8bea-4fbd-b221-489d84928ddc",
        "dataSource" : "data",
        "analysisType" : "func",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "shcdd8eec4-bc51-446d-a4a6-ed01d33d06e4"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "shca78dd7a-7c05-4606-aeae-0348f2ce1cd1"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sha4ba0889-fd31-4716-ba63-856d1be9473c"
      }
    } ], [ {
      "label" : "长期预防措施",
      "fieldName" : "cqyfcs",
      "type" : "textarea",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "长期预防措施",
        "colspan" : 6,
        "colHeight" : "150px",
        "viewVisible" : true,
        "itemNameLabel" : "多行文本框",
        "readonly" : false,
        "formVisible" : true,
        "labelPosition" : "top",
        "rowspan" : 3,
        "name" : "cqyfcs",
        "id" : "sh22a619c6-91e0-4649-8998-815428aae05d",
        "placeholder" : "请输入长期预防措施",
        "maxLength" : 1000,
        "listVisible" : true
      }
    }, {
      "label" : "标准化",
      "fieldName" : "biaozhunhua",
      "type" : "radio",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "values" : [ {
          "name" : "作业标准修订",
          "value" : "zybzxd"
        }, {
          "name" : "图纸修订",
          "value" : "tuzhixiuding"
        }, {
          "name" : "研发/技术更改，ECN号",
          "value" : "yf_jsgg"
        }, {
          "name" : "其它",
          "value" : "other"
        } ],
        "label" : "标准化",
        "colspan" : 6,
        "colHeight" : "150px",
        "viewVisible" : true,
        "itemNameLabel" : "单选框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 3,
        "name" : "biaozhunhua",
        "valuesDefaultValue" : [ { } ],
        "id" : "sh22a619c6-91e0-4649-8998-815428aae05d",
        "dataSource" : "data",
        "analysisType" : "func",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sha2e3ced8-0536-4192-8de9-dbaf05c013d3"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "shb5aab7b9-aba4-48cb-9ba4-e1129957e9f6"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh34dc4b22-b49a-40c8-9598-035303aec955"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "sh3cb69fd3-9131-4731-bf65-c714783b2b70"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "sh1be28d0c-9b55-476b-bc8a-f7ccad45394e"
      }
    }, {
      "label" : "制定人",
      "fieldName" : "zhidingren2",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "制定人",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "zhidingren2",
        "id" : "sh0372f8a5-6433-4ad4-9179-6c78088862b0",
        "placeholder" : "请输入制定人",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh8d092de1-f85f-4bee-a1d3-5db9c592f657"
      }
    } ], [ {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh738066ac-354c-454c-91cc-733032a42616"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh668fb4b3-a8f3-4bf4-9537-9f1f0adb9a9d"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "sh1f39de72-5407-42fe-a8c5-9ec8dea6e499"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh6bfa5e24-fee6-4700-94a2-7c26a688cb67"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "shc14367c4-3100-47af-b128-3f200add452f"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "sh472e8495-25b0-47ce-9e82-9af0f39f443d"
      }
    }, {
      "label" : "制定时间",
      "fieldName" : "zhidingshijian2",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "制定时间",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "zhidingshijian2",
        "id" : "sh632737a0-4027-48a7-a957-d2c69e009fa1",
        "placeholder" : "请输入制定时间",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh39038907-7910-450b-b310-5d3a5f31f39a"
      }
    } ], [ {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh274b3b0f-b8e8-4505-bfa4-e17439a730ee"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sha2d1e056-3d00-4745-9ca1-b7316b0d02b3"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "sh5d94c329-4d8a-4ad0-8257-3a2ae8dca156"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh965d04aa-e053-4be1-8109-f83dfbf43e83"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "sh6d3c66e4-5159-4fd8-8ffa-eb578fce1362"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "sh257dc298-1c62-44c4-afa0-f4f9cffbe8bf"
      }
    }, {
      "label" : "部门经理",
      "fieldName" : "bumenjingli",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "部门经理",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "bumenjingli",
        "id" : "sh0475571e-5528-44f4-8d1f-dbf6c8fc56e5",
        "placeholder" : "请输入部门经理",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "she016ec37-483d-4d7c-a2f4-8b6e531dc3b9"
      }
    } ], [ {
      "label" : "Html组件",
      "fieldName" : "html46",
      "type" : "html",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "rowNums" : 1,
        "textContent" : "<p style=\"text-align: left;\">改善措施效果确认</p>",
        "label" : "Html组件",
        "colspan" : 6,
        "colHeight" : "51px",
        "viewVisible" : true,
        "itemNameLabel" : "Html组件",
        "readonly" : false,
        "formVisible" : true,
        "elements" : [ {
          "id" : "sh252b242f-43c2-4951-acbf-57444753e1d9",
          "colIndex" : 1,
          "columns" : [ {
            "id" : "she33c19e0-72d4-4839-abf9-23b6efeb50bc",
            "colIndex" : 1,
            "rowspan" : 1,
            "colspan" : 1,
            "items" : [ ],
            "cellVisible" : true
          } ]
        } ],
        "rowspan" : 1,
        "name" : "html46",
        "styles" : {
          "alignItems" : "start"
        },
        "id" : "sh633d02b5-feb9-4199-a178-694b9e728e5c",
        "staticData" : true,
        "columnNums" : 1,
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh5d5ea5b2-75d3-4e98-95c6-d0adca9fffba"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "sh6b94572c-9178-4f0c-9327-de1e5c631122"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh6fa1a213-e1b4-4301-8b4d-3e2ac6518bab"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "shf2ad8beb-1ac8-44cf-94f3-ac5989cccd0e"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "shf6243353-da9e-47ba-bdf6-6105255d3ecb"
      }
    }, {
      "label" : "QE确认",
      "fieldName" : "qequeren2",
      "type" : "input",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "QE确认",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "单行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 2,
        "name" : "qequeren2",
        "id" : "sh47aad720-f646-4501-8f21-238910723e9a",
        "placeholder" : "请输入QE确认",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "shdc3847c7-5498-43c8-b33d-73932eaa8ce1"
      }
    } ], [ {
      "label" : "跟踪时段",
      "fieldName" : "gzsd",
      "type" : "datetime",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "format" : "HH",
        "valueFormat" : "HH",
        "label" : "跟踪时段",
        "type" : "datetime",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "日期选择器",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "gzsd",
        "id" : "she671b08e-b043-48b7-90fd-27ae5034dbc4",
        "placeholder" : "请选择跟踪时段",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh37b90368-a9db-4397-80c4-ed9340f39783"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "sh05dec99e-908d-4f1c-b25a-23eb7586d71d"
      }
    }, {
      "label" : "投入数",
      "fieldName" : "tourushu2",
      "type" : "number",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "precision" : 0,
        "colWidth" : "62px",
        "label" : "投入数",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "数字输入框",
        "min" : 0,
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "tourushu2",
        "step" : "1",
        "id" : "sh961e5ee0-4540-4e7a-a3f8-8c8bf0e63fef",
        "placeholder" : "请输入投入数",
        "controlsPosition" : "right",
        "maxLength" : 10,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "shee4406a9-b8a7-4357-b73f-7148ca6d7ceb"
      }
    }, {
      "label" : "不良数",
      "fieldName" : "buliangshu2",
      "type" : "number",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "precision" : 0,
        "colWidth" : "185px",
        "label" : "不良数",
        "colspan" : 1,
        "viewVisible" : true,
        "itemNameLabel" : "数字输入框",
        "min" : 0,
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "buliangshu2",
        "step" : "1",
        "id" : "shfd71552a-672f-4ad4-a6c0-d8e7fc025fa0",
        "placeholder" : "请输入不良数",
        "controlsPosition" : "right",
        "maxLength" : 10,
        "listVisible" : true
      }
    }, {
      "label" : "不良率",
      "fieldName" : "bulianglv2",
      "type" : "number",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : false,
        "precision" : 0,
        "label" : "不良率",
        "colspan" : 1,
        "viewVisible" : true,
        "itemNameLabel" : "数字输入框",
        "min" : 0,
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "bulianglv2",
        "step" : "1",
        "id" : "sh9c050143-3467-48cd-a0f2-3cb0ed729672",
        "placeholder" : "请输入不良率",
        "maxLength" : 10,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh702863b5-024a-4465-9877-a5e946dbb17f"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : true,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "she20f4648-48a1-4755-b05d-f8788913833b"
      }
    } ], [ {
      "label" : "判定",
      "fieldName" : "panding",
      "type" : "radio",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "values" : [ {
          "name" : "措施有效，可继续生产，进一步跟进效果",
          "value" : "ok"
        }, {
          "name" : "措施无效，需停线整改",
          "value" : "ng"
        } ],
        "label" : "判定",
        "colspan" : 6,
        "viewVisible" : true,
        "itemNameLabel" : "单选框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "panding",
        "valuesDefaultValue" : [ { } ],
        "id" : "shc983efcb-8281-44eb-8164-ff36da17c67f",
        "dataSource" : "data",
        "analysisType" : "func",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "shbbfebb9d-0a1f-436e-abb7-d3435183d89a"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "sh01bf9637-700e-4439-8985-29f19ad3ebf3"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "sh89a423e5-3e6e-44eb-8ed4-41076409e24c"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "sh0e493591-732e-41c8-a0a5-b5b9fa0668e0"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "sh1d38f053-a4e0-4fdf-a3f8-b81d1f048d6f"
      }
    }, {
      "label" : "确认时间",
      "fieldName" : "qurenshijian2",
      "type" : "datetime",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "确认时间",
        "type" : "datetime",
        "colspan" : 2,
        "viewVisible" : true,
        "itemNameLabel" : "日期选择器",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 2,
        "name" : "qurenshijian2",
        "id" : "sh5935a9a0-a5ce-4365-9d81-c1f3f92a305b",
        "placeholder" : "请选择确认时间",
        "maxLength" : 255,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh88b0147f-85d4-43f0-a995-e62d0b42e432"
      }
    } ], [ {
      "label" : "备注",
      "fieldName" : "formRemark",
      "type" : "textarea",
      "required" : false,
      "formVisible" : true,
      "listVisible" : true,
      "defaultValue" : false,
      "preps" : {
        "clearable" : true,
        "cellVisible" : true,
        "label" : "备注",
        "colspan" : 6,
        "colHeight" : "92px",
        "viewVisible" : true,
        "itemNameLabel" : "多行文本框",
        "readonly" : false,
        "formVisible" : true,
        "rowspan" : 1,
        "name" : "formRemark",
        "id" : "shfb90bfe2-43e0-4bb6-8438-48caf9e01b04",
        "placeholder" : "请输入备注",
        "maxLength" : 1000,
        "listVisible" : true
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh094b9943-dce2-4542-9dbf-2662fd0a93bb"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "186px",
        "id" : "sh55089891-c9c7-4d64-88b3-3528673f3755"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "62px",
        "id" : "shf92e141d-ea64-4f6e-a6b3-b00fee385cd1"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "172px",
        "id" : "sh36acbb54-ce72-4a3c-b1a8-86bb40db7fa4"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : "185px",
        "id" : "sh22c73a55-dc1a-449d-affc-00cd69c681ed"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh75c310b4-fb14-4ea5-af4e-ce368fa11ee8"
      }
    }, {
      "type" : "empty",
      "formVisible" : false,
      "viewVisible" : true,
      "preps" : {
        "colspan" : 1,
        "colHeight" : null,
        "cellVisible" : false,
        "rowspan" : 1,
        "colWidth" : null,
        "id" : "sh026540d9-47c2-4a8e-b5f7-d04cdbe936cf"
      }
    } ] ]
  }, {
    "label" : "角色Id",
    "fieldName" : "createdRoleId",
    "type" : "input",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "创建人",
    "fieldName" : "createdBy",
    "type" : "input",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "修改人",
    "fieldName" : "updatedBy",
    "type" : "input",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "版本号",
    "fieldName" : "version",
    "type" : "number",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "是否删除",
    "fieldName" : "isDel",
    "type" : "number",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "数据编号",
    "fieldName" : "dataNo",
    "type" : "input",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "状态",
    "fieldName" : "statusCode",
    "type" : "select",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : {
      "urlOrDictName" : "common",
      "name" : "statusCode",
      "dataSource" : "dict"
    },
    "commonFlag" : "Y"
  }, {
    "label" : "状态名称",
    "fieldName" : "statusName",
    "type" : "input",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "国际编码",
    "fieldName" : "local",
    "type" : "input",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "备注",
    "fieldName" : "remark",
    "type" : "textarea",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "租户",
    "fieldName" : "tenantId",
    "type" : "select",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  } ],
  "batchFieldList" : [ ],
  "userTableFuncs" : [ ],
  "dynamicFormas" : [ {
    "id" : "Idsh8e6b6691-6f32-432b-8d83-3e8614460389",
    "preps" : {
      "id" : "Idsh8e6b6691-6f32-432b-8d83-3e8614460389",
      "label" : "动态表格",
      "itemNameLabel" : "动态表格",
      "name" : "dytable1",
      "elements" : [ {
        "id" : "sha3d3beb8-790b-4fe4-941a-a2cdd0e85449",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "shdb288f86-bede-4d0a-b634-27be9280f3bb",
          "colIndex" : 1,
          "rowspan" : 3,
          "colspan" : 5,
          "items" : [ {
            "id" : "Idsh197ec804-3f1f-4afd-9971-fd17319a81e0",
            "preps" : {
              "id" : "shdb288f86-bede-4d0a-b634-27be9280f3bb",
              "label" : "Html组件",
              "itemNameLabel" : "Html组件",
              "name" : "html2",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "elements" : [ {
                "id" : "sh4e7f9873-960c-4fbe-bfda-febc1108da17",
                "colIndex" : 1,
                "columns" : [ {
                  "id" : "she2d30714-d681-48e8-be06-c4e1093f765a",
                  "colIndex" : 1,
                  "rowspan" : 1,
                  "colspan" : 1,
                  "items" : [ ],
                  "cellVisible" : true
                } ]
              } ],
              "rowNums" : 1,
              "columnNums" : 1,
              "staticData" : true,
              "textContent" : "<p style=\"text-align: center;\"><span style=\"font-size: 19px;\">惠州朵唯通信设备有限公司</span></p><p style=\"text-align: center;\"><span style=\"font-size: 19px;\">异常反馈单</span></p>",
              "colspan" : 5,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 3,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "html2",
            "itemType" : "html",
            "label" : "Html组件",
            "type" : "html",
            "priority" : 1
          } ],
          "cellVisible" : true
        }, {
          "id" : "shc7e0f485-5f98-4a78-bbfe-a666bb539c2e",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "sh7a933260-3369-4bdf-82be-3718674e2030",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "sh3a0a7cbe-18c3-41ac-b891-178bee5f4baa",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "sh29a99eca-3da8-433a-8e8c-d88209e83375",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "172px"
        }, {
          "id" : "sh272263b2-64ee-49e0-8f03-081f4befe3ea",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh18795e21-bcbd-44e7-9b45-3d57737b91ca",
            "preps" : {
              "id" : "sh272263b2-64ee-49e0-8f03-081f4befe3ea",
              "label" : "静态文本",
              "itemNameLabel" : "静态文本",
              "name" : "text3",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "staticData" : true,
              "textContent" : "批准",
              "appCompVisible" : true,
              "colspan" : 1,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : "185px"
            },
            "compType" : "formItem",
            "fieldName" : "text3",
            "itemType" : "text",
            "label" : "静态文本",
            "type" : "text",
            "priority" : 2
          } ],
          "colWidth" : "185px"
        }, {
          "id" : "sh623fdb70-b314-4ab8-8243-6004f382c6b8",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idshc1d7bf99-1c2f-4ec2-94a3-137197276301",
            "preps" : {
              "id" : "sh623fdb70-b314-4ab8-8243-6004f382c6b8",
              "label" : "静态文本",
              "itemNameLabel" : "静态文本",
              "name" : "text4",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "staticData" : true,
              "textContent" : "审核",
              "appCompVisible" : true,
              "colspan" : 1,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "text4",
            "itemType" : "text",
            "label" : "静态文本",
            "type" : "text",
            "priority" : 3
          } ]
        }, {
          "id" : "sh78e007ac-fa43-4cf9-81e9-80e527dddcc1",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh6a11f58c-1779-4e81-9014-442c54236ca5",
            "preps" : {
              "id" : "sh78e007ac-fa43-4cf9-81e9-80e527dddcc1",
              "label" : "静态文本",
              "itemNameLabel" : "静态文本",
              "name" : "text5",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "staticData" : true,
              "textContent" : "作成",
              "appCompVisible" : true,
              "colspan" : 1,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "text5",
            "itemType" : "text",
            "label" : "静态文本",
            "type" : "text",
            "priority" : 4
          } ]
        } ]
      }, {
        "id" : "she082dce0-ceed-49d3-92e8-ad0bd92be377",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "sh5eb69288-c3df-4ef0-9242-6ec52e0ecb84",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        }, {
          "id" : "sh0b41f4fe-b1cd-439a-8188-f21af057b9d7",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "sh93fcd205-ced0-4372-9ef7-df4da5fd99d8",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "sh7c931d88-4db2-4f2e-9f90-4ec5a2c1fca3",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "sh947310d0-1d41-4d19-b30f-9edf3ab0abd0",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "172px"
        }, {
          "id" : "shac0fc43c-9515-4c7c-bc72-8e8befb155e9",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idshdc09b85c-e7af-4326-a796-89dd8c2ebf84",
            "preps" : {
              "id" : "shac0fc43c-9515-4c7c-bc72-8e8befb155e9",
              "itemNameLabel" : "单行文本框",
              "name" : "pizhun",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入批准",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "hideLabel" : true,
              "label" : "批准",
              "elements" : [ {
                "id" : "sh92de17dc-2c75-438a-ae0d-f75fc78efec2",
                "colIndex" : 1,
                "columns" : [ {
                  "id" : "sh4a57cafb-8301-4737-909d-c53c44d945c9",
                  "colIndex" : 1,
                  "rowspan" : 1,
                  "colspan" : 1,
                  "items" : [ ],
                  "cellVisible" : true
                } ]
              } ],
              "rowNums" : 1,
              "columnNums" : 1,
              "colspan" : 1,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : "185px"
            },
            "compType" : "formItem",
            "fieldName" : "pizhun",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 5
          } ],
          "colWidth" : "185px"
        }, {
          "id" : "sh0d1abe78-a0b2-48fe-a2ab-b6f429816a06",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idshd1928ea5-97ef-439e-9ac4-692cd604db99",
            "preps" : {
              "id" : "sh0d1abe78-a0b2-48fe-a2ab-b6f429816a06",
              "itemNameLabel" : "单行文本框",
              "name" : "shenhe",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入审核",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "hideLabel" : true,
              "label" : "审核",
              "colspan" : 1,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "shenhe",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 6
          } ]
        }, {
          "id" : "sh7aa26678-4e58-4cde-8359-3ac1383a1544",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idshfea92049-d199-465f-9a31-3497d3424203",
            "preps" : {
              "id" : "sh7aa26678-4e58-4cde-8359-3ac1383a1544",
              "label" : "作成",
              "itemNameLabel" : "单行文本框",
              "name" : "zuocheng",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入作成",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "hideLabel" : true,
              "colspan" : 1,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "zuocheng",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 7
          } ]
        } ]
      }, {
        "id" : "shaba7621d-826f-441f-9750-4f5258ca67ef",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "shfe7b5fcd-6fd5-4c15-9a70-2e480840c0db",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        }, {
          "id" : "sh5c19db94-7757-4caa-a69b-2fe01c7bfe0e",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "sh3b94e38d-6cef-4799-96b8-a560ec3632d3",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "sh7e9e2682-e41b-439d-a266-4e3bb649f211",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "shaf566f28-16df-43bb-ab5c-b175b24b4387",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "172px"
        }, {
          "id" : "sh5513989e-d01d-493f-919c-5ce15a262d75",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsha1f24d10-1703-463f-ba45-0d8dfbe6f95c",
            "preps" : {
              "id" : "sh5513989e-d01d-493f-919c-5ce15a262d75",
              "label" : "批准时间",
              "itemNameLabel" : "日期选择器",
              "name" : "pizhunshijian",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请选择批准时间",
              "type" : "datetime",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "hideLabel" : true,
              "colspan" : 1,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : "185px"
            },
            "compType" : "formItem",
            "fieldName" : "pizhunshijian",
            "itemType" : "datetime",
            "label" : "日期选择器",
            "type" : "datetime",
            "priority" : 8
          } ],
          "colWidth" : "185px"
        }, {
          "id" : "sh1d77c0c8-7df2-46e8-addc-e6c8db504da0",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh467b8801-0c3b-4293-aada-7df4dc4c90b0",
            "preps" : {
              "id" : "sh1d77c0c8-7df2-46e8-addc-e6c8db504da0",
              "itemNameLabel" : "日期选择器",
              "name" : "shenheshijian",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请选择审核时间",
              "type" : "datetime",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "hideLabel" : true,
              "label" : "审核时间",
              "colspan" : 1,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "shenheshijian",
            "itemType" : "datetime",
            "label" : "日期选择器",
            "type" : "datetime",
            "priority" : 9
          } ]
        }, {
          "id" : "sh9a8987c4-1106-4ec6-b5a9-28b741a710f8",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh35ad4ebf-7fde-4b80-ab3a-5442e495d493",
            "preps" : {
              "id" : "sh9a8987c4-1106-4ec6-b5a9-28b741a710f8",
              "itemNameLabel" : "日期选择器",
              "name" : "zuochengshijian",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请选择作成时间",
              "type" : "datetime",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "hideLabel" : true,
              "label" : "作成时间",
              "colspan" : 1,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "zuochengshijian",
            "itemType" : "datetime",
            "label" : "日期选择器",
            "type" : "datetime",
            "priority" : 10
          } ]
        } ]
      }, {
        "id" : "sh24548c33-eb3a-4dd4-9a42-482ed1a39f65",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "sh828e9be4-d111-4f6c-82a3-21a12d7865d9",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "items" : [ {
            "id" : "Idsh454a068f-ef1f-422d-84b9-fcbe5d7710d4",
            "preps" : {
              "id" : "sh828e9be4-d111-4f6c-82a3-21a12d7865d9",
              "label" : "TO",
              "itemNameLabel" : "单行文本框",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入TO",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "name" : "formTo",
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "formTo",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 11
          } ],
          "cellVisible" : true
        }, {
          "id" : "sh0a470bc8-3c23-4e47-9b8c-74c32b35710c",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "shb043dcff-f307-4ca0-9396-bde2709450f4",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 4,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsha18deb8e-30a7-4b6c-9bc8-7695a6860322",
            "preps" : {
              "id" : "shb043dcff-f307-4ca0-9396-bde2709450f4",
              "label" : "CC",
              "itemNameLabel" : "单行文本框",
              "name" : "chaosong",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入CC",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "colspan" : 4,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : "186px"
            },
            "compType" : "formItem",
            "fieldName" : "chaosong",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 12
          } ],
          "colWidth" : "186px"
        }, {
          "id" : "sheedb2b29-ac3c-44d5-b426-746b4b7713b7",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "sh353e8cc7-6ee1-4a1c-87df-9cc955d0899d",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "172px"
        }, {
          "id" : "shab30f31b-a4f0-4e97-b3d9-b3bab137ec43",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "sh43355758-0f59-4c58-999e-dba032b13c41",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsheab30e19-eef4-4cce-93f4-c5355d15ccf6",
            "preps" : {
              "id" : "sh43355758-0f59-4c58-999e-dba032b13c41",
              "itemNameLabel" : "单行文本框",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入编号",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "编号",
              "name" : "bianhao",
              "searchVisible" : true,
              "defaultVisible" : true,
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "bianhao",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 13
          } ]
        }, {
          "id" : "sh5faa898a-9c79-4037-bb4a-264cd445cc41",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        } ]
      }, {
        "id" : "shf469f1fc-5e41-4696-976d-59e91d5b2595",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "sh95fde466-3c98-482b-9617-8cf5a49ca10e",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "items" : [ {
            "id" : "Idsh361a5101-3f66-43ce-844e-f817beef4e5a",
            "preps" : {
              "id" : "sh95fde466-3c98-482b-9617-8cf5a49ca10e",
              "label" : "机型",
              "itemNameLabel" : "单行文本框",
              "name" : "jixing",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入机型",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "searchVisible" : true,
              "defaultVisible" : true,
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "jixing",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 14
          } ],
          "cellVisible" : true
        }, {
          "id" : "shf763f014-36a8-444a-867d-c849d23b619e",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "shc89eabf2-6ddf-42d1-afbc-a2c6d3abf689",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh1b8f16d6-98cc-4b7b-beb8-4aa9ff371a44",
            "preps" : {
              "id" : "shc89eabf2-6ddf-42d1-afbc-a2c6d3abf689",
              "itemNameLabel" : "单行文本框",
              "name" : "shengchanpihao",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入生产批号",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "生产批号",
              "searchVisible" : true,
              "defaultVisible" : true,
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : "186px"
            },
            "compType" : "formItem",
            "fieldName" : "shengchanpihao",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 15
          } ],
          "colWidth" : "186px"
        }, {
          "id" : "sh821a62f7-a584-46e2-9d29-9eb7fab9b97c",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "she382caae-53b3-4193-bb40-978526db89c1",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh8bb371fe-713b-4279-890b-fb832bd5aa01",
            "preps" : {
              "id" : "she382caae-53b3-4193-bb40-978526db89c1",
              "label" : "批量",
              "itemNameLabel" : "单行文本框",
              "name" : "piliang",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入批量",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : "172px"
            },
            "compType" : "formItem",
            "fieldName" : "piliang",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 16
          } ],
          "colWidth" : "172px"
        }, {
          "id" : "sh117b2e3d-2bf3-4aa4-869d-ace763c9c34e",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "sh7802503a-0fab-4a79-b7ab-bf7e132e8470",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh686baee1-d03b-45c5-98d8-8312bf92eb8a",
            "preps" : {
              "id" : "sh7802503a-0fab-4a79-b7ab-bf7e132e8470",
              "itemNameLabel" : "日期选择器",
              "name" : "fashengshijian",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入发生时间",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "发生时间",
              "type" : "datetime",
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "fashengshijian",
            "itemType" : "datetime",
            "label" : "单行文本框",
            "type" : "datetime",
            "priority" : 17
          } ]
        }, {
          "id" : "sh6babbacc-d725-4e67-9954-2c7b23329008",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        } ]
      }, {
        "id" : "sh27993272-8ddb-47ca-a125-cc31c52bc021",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "sh041b920a-8e1b-40ca-be27-c7cd0759eba3",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "items" : [ {
            "id" : "Idsh9bc552ab-1c2f-4464-bee8-9bfe27403dee",
            "preps" : {
              "id" : "sh041b920a-8e1b-40ca-be27-c7cd0759eba3",
              "itemNameLabel" : "数字输入框",
              "name" : "tourushu",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入投入数",
              "step" : 1,
              "min" : 0,
              "precision" : 0,
              "rules" : [ ],
              "maxLength" : 10,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "投入数",
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "tourushu",
            "itemType" : "number",
            "label" : "数字输入框",
            "type" : "number",
            "priority" : 18
          } ],
          "cellVisible" : true
        }, {
          "id" : "sh683180c3-f982-4a25-99e7-539622d295f2",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "sh1776fa92-fbe5-439c-890b-57041f83a636",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idshaa73789d-c3fc-406c-a6d0-845abadaeb28",
            "preps" : {
              "id" : "sh1776fa92-fbe5-439c-890b-57041f83a636",
              "label" : "不良数",
              "itemNameLabel" : "数字输入框",
              "name" : "buliangshu",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入不良数",
              "step" : 1,
              "min" : 0,
              "precision" : 0,
              "rules" : [ ],
              "maxLength" : 10,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : "186px"
            },
            "compType" : "formItem",
            "fieldName" : "buliangshu",
            "itemType" : "number",
            "label" : "数字输入框",
            "type" : "number",
            "priority" : 19
          } ],
          "colWidth" : "186px"
        }, {
          "id" : "sh7cc5abbb-12c2-494e-9955-096f3a787df1",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "sh207680a2-2a3b-471e-84da-55d82b3c122a",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idshfff326d9-04b3-473f-9b8d-40dff3e8a005",
            "preps" : {
              "id" : "sh207680a2-2a3b-471e-84da-55d82b3c122a",
              "itemNameLabel" : "数字输入框",
              "name" : "bulianglv",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入不良率",
              "step" : 1,
              "min" : 0,
              "precision" : 0,
              "rules" : [ ],
              "maxLength" : 10,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "不良率",
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : "172px"
            },
            "compType" : "formItem",
            "fieldName" : "bulianglv",
            "itemType" : "number",
            "label" : "数字输入框",
            "type" : "number",
            "priority" : 20
          } ],
          "colWidth" : "172px"
        }, {
          "id" : "sh22ece42f-810b-4807-922e-74ec1458eb79",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "sh7ae3cc32-3cba-4e10-82f9-6edae73fd632",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh26a933ab-59c1-4e70-85ce-2aea9a392c46",
            "preps" : {
              "id" : "sh7ae3cc32-3cba-4e10-82f9-6edae73fd632",
              "label" : "反馈时间",
              "itemNameLabel" : "日期选择器",
              "name" : "fankuishijian",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请选择反馈时间",
              "type" : "datetime",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "fankuishijian",
            "itemType" : "datetime",
            "label" : "日期选择器",
            "type" : "datetime",
            "priority" : 21
          } ]
        }, {
          "id" : "sh6714b888-c066-479c-a4f1-1df4379ca055",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        } ]
      }, {
        "id" : "shf7e93c59-c2b1-4484-bbd7-d319ff3789c0",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "shebddaed2-9e1b-4283-874c-fab336375418",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 6,
          "items" : [ {
            "id" : "Idsh2f50ee3f-9ca9-49e3-9d16-278e9780ea23",
            "preps" : {
              "id" : "shebddaed2-9e1b-4283-874c-fab336375418",
              "label" : "异常内容描述",
              "itemNameLabel" : "多行文本框",
              "name" : "ycnrms",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入异常内容描述",
              "rules" : [ ],
              "maxLength" : 1000,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "labelPosition" : "top",
              "colspan" : 6,
              "colHeight" : "127px",
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "ycnrms",
            "itemType" : "textarea",
            "label" : "多行文本框",
            "type" : "textarea",
            "priority" : 22
          } ],
          "cellVisible" : true,
          "colHeight" : "127px"
        }, {
          "id" : "sh2ab8a344-756b-4c44-b0d9-cf1a06aaab6a",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colHeight" : "175px"
        }, {
          "id" : "sh794ff7dc-655a-4ed2-b765-3166980aa20e",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "shd0543201-7e7b-49e2-931e-1e0eb664852c",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "she64847d9-1b73-4268-9aa7-3166c89ddaba",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "172px"
        }, {
          "id" : "sh42376ceb-9bbe-4dbc-8eb1-2fb548e70319",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "sh86605876-ebf5-43cf-a6ad-5718d93f9505",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idshab1be8da-f314-4070-8958-dfd16cf606a4",
            "preps" : {
              "id" : "sh86605876-ebf5-43cf-a6ad-5718d93f9505",
              "label" : "静态文本",
              "itemNameLabel" : "静态文本",
              "name" : "text24",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "placeholder" : "",
              "staticData" : true,
              "textContent" : "开出部门",
              "colspan" : 1,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "text24",
            "itemType" : "text",
            "label" : "静态文本",
            "type" : "text",
            "priority" : 23
          } ]
        }, {
          "id" : "sh31195e04-1718-41cb-9a13-cd2ec14856e8",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh747f2743-61ea-4fe2-9a74-daa676b53df9",
            "preps" : {
              "id" : "sh31195e04-1718-41cb-9a13-cd2ec14856e8",
              "label" : "开出部门",
              "itemNameLabel" : "单选框",
              "name" : "kaichubumen",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "hideLabel" : true,
              "dataSource" : "data",
              "analysisType" : "func",
              "values" : [ {
                "name" : "IPQC",
                "value" : "ipqc"
              }, {
                "name" : "FQC",
                "value" : "fqc"
              }, {
                "name" : "工程",
                "value" : "gongcheng"
              }, {
                "name" : "产线",
                "value" : "chanxian"
              }, {
                "name" : "其它",
                "value" : "qita"
              } ],
              "valuesDefaultValue" : [ { } ],
              "colspan" : 1,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "kaichubumen",
            "itemType" : "radio",
            "label" : "单选框",
            "type" : "radio",
            "priority" : 24
          } ]
        } ]
      }, {
        "id" : "sh2517487a-e38d-4d19-b52e-17aa9eb1c8d2",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "sh23b6a0c8-c148-401c-ab9e-23394df58d95",
          "colIndex" : 1,
          "rowspan" : 3,
          "colspan" : 6,
          "items" : [ {
            "id" : "Idsh52d0e7f7-1c03-45cb-95bb-01f102af62f0",
            "preps" : {
              "id" : "sh23b6a0c8-c148-401c-ab9e-23394df58d95",
              "label" : "根本原因分析（工程填写）",
              "itemNameLabel" : "多行文本框",
              "name" : "gbyyfxgctx",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入根本原因分析（工程填写）",
              "rules" : [ ],
              "maxLength" : 1000,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "labelPosition" : "top",
              "colspan" : 6,
              "colHeight" : "171px",
              "cellVisible" : true,
              "rowspan" : 3,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "gbyyfxgctx",
            "itemType" : "textarea",
            "label" : "多行文本框",
            "type" : "textarea",
            "priority" : 25
          }, {
            "id" : "Idsh0dbc8c98-b7d3-4e01-90f9-fe571acfbafb",
            "preps" : {
              "id" : "sh23b6a0c8-c148-401c-ab9e-23394df58d95",
              "label" : "责任判定",
              "itemNameLabel" : "单选框",
              "name" : "zherenpanding",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "dataSource" : "data",
              "analysisType" : "func",
              "values" : [ {
                "name" : "设计不良",
                "value" : "sjbl"
              }, {
                "name" : "物料不良",
                "value" : "wlbl"
              }, {
                "name" : "制程不良",
                "value" : "zcbl"
              }, {
                "name" : "其它",
                "value" : "qita"
              } ],
              "valuesDefaultValue" : [ { } ],
              "colspan" : 6,
              "colHeight" : "171px",
              "cellVisible" : true,
              "rowspan" : 3,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "zherenpanding",
            "itemType" : "radio",
            "label" : "单选框",
            "type" : "radio",
            "priority" : 26
          } ],
          "cellVisible" : true,
          "colHeight" : "171px"
        }, {
          "id" : "sh668f8c13-c792-4d9c-99df-920fa78d32bb",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "shf91186c9-ba49-4bc5-a2aa-4ab579d6925c",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "sh8ec832fc-aa46-41f2-9f2c-724b1d577a1f",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "sh1253077b-1150-426a-9972-8161beb8bf02",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "172px"
        }, {
          "id" : "sha46ec3f1-f24e-4eab-bb26-bafa185e4f05",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "sha9a88708-4bba-4e88-9788-934624e31f5d",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idshb7f55085-8729-4c68-92e9-7bc5bc380eae",
            "preps" : {
              "id" : "sha9a88708-4bba-4e88-9788-934624e31f5d",
              "label" : "分析人",
              "itemNameLabel" : "单行文本框",
              "name" : "fenxiren",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入分析人",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "fenxiren",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 27
          } ]
        }, {
          "id" : "sh3820890f-eb8e-4185-8f8e-0b86ebdcce6f",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        } ]
      }, {
        "id" : "shdec8f71c-deaa-4233-8a4a-12205eed82ad",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "sh8b7418bf-af2d-486e-a397-3ce4bde1d683",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        }, {
          "id" : "shf224a7d3-2251-48a9-9f79-e1526b366426",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "shd2561a4a-fb4c-4d6d-a1b5-5cdec59d246b",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "sh06ffb16f-1cf8-45ab-be9b-7293139e9982",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "sha69fe1cf-4739-4dfa-ad21-365d24d444f9",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "172px"
        }, {
          "id" : "sh5a964a88-417b-4646-9e93-8100875a7c0b",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "sh1a647fd5-536b-4255-9d3e-262e02b8e106",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idshba0ce742-cf0f-4d61-8b8c-8576c88f3956",
            "preps" : {
              "id" : "sh1a647fd5-536b-4255-9d3e-262e02b8e106",
              "label" : "QE确认",
              "itemNameLabel" : "单行文本框",
              "name" : "qequeren",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入QE确认",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "qequeren",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 28
          } ]
        }, {
          "id" : "sh27dfdf22-bad5-4c85-b69e-f039ade668af",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        } ]
      }, {
        "id" : "sha93e5a22-84f0-4770-94cb-32fdc72d5a4f",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "sh9e472243-dfd3-4292-9d56-2d98eb90f976",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        }, {
          "id" : "sh0e306f16-caa0-491c-8fcb-47e644ba468c",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "sh133a94d2-e77f-4202-abfb-67d602ba2b6e",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "sh62f55c02-1edf-4d46-bdc4-8b81f9d7383f",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "sh633c06c3-b905-46f2-b4b5-b6751e638dce",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "172px"
        }, {
          "id" : "sh6b877e82-7bba-445b-b843-e124a1288d00",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "sh49253a3a-9b4d-477c-b2c9-a2e797102ad0",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh11501c13-abc1-4881-9a55-82c80bff3519",
            "preps" : {
              "id" : "sh49253a3a-9b4d-477c-b2c9-a2e797102ad0",
              "label" : "工程经理",
              "itemNameLabel" : "单行文本框",
              "name" : "gongchengjingli",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入工程经理",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "gongchengjingli",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 29
          } ]
        }, {
          "id" : "sh49b08e2b-2452-4ef2-b65e-1ef17300aaca",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        } ]
      }, {
        "id" : "shc417b1b7-cde4-411e-be90-9a85f7a871be",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "shf1f22cd1-a43d-48c4-9e1a-5ddde5ff51db",
          "colIndex" : 1,
          "rowspan" : 2,
          "colspan" : 6,
          "items" : [ {
            "id" : "Idsh08e3b3c0-6422-40d1-b07f-ea0d615d4bc3",
            "preps" : {
              "id" : "shf1f22cd1-a43d-48c4-9e1a-5ddde5ff51db",
              "label" : "临时措施（责任部门填写）",
              "itemNameLabel" : "多行文本框",
              "name" : "lscszrbmtx",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入临时措施（责任部门填写）",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "labelPosition" : "top",
              "colspan" : 6,
              "colHeight" : "125px",
              "cellVisible" : true,
              "rowspan" : 2,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "lscszrbmtx",
            "itemType" : "textarea",
            "label" : "多行文本框",
            "type" : "textarea",
            "priority" : 30
          } ],
          "cellVisible" : true,
          "colHeight" : "125px"
        }, {
          "id" : "sha07ede78-1db2-4d55-bff1-7ce92ba46a45",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "shbeec7cf3-6133-42d1-a0bf-cbc24e3814b8",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "sha29bc3b9-86a3-41e8-9d5c-357b9ee622dc",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "shb5e6e210-89cb-4fa0-a4fe-c22bbed8a974",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "172px"
        }, {
          "id" : "she135b82a-1a4f-42cf-82a5-ce47bf5814c2",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "sh956c7896-4cbc-4a84-ac6f-867f41c1309d",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idshd7ace679-1f85-4143-9d8d-90603569f2cf",
            "preps" : {
              "id" : "sh956c7896-4cbc-4a84-ac6f-867f41c1309d",
              "label" : "制订人",
              "itemNameLabel" : "单行文本框",
              "name" : "zhidingren",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入制订人",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "zhidingren",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 31
          } ]
        }, {
          "id" : "sh248ee88e-74c8-440f-9116-9c873100baae",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        } ]
      }, {
        "id" : "shc0bedc35-3dc0-4c0e-9bc3-8a8fb6d326a7",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "she3a78973-404b-4571-b808-70ebee92b36e",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        }, {
          "id" : "sh5ef1c601-603b-4530-b988-6b397fae57e9",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "sh448e381d-9022-4492-b232-a75c791a8220",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "sh681332af-d3c9-4312-b84e-38354b86dbf1",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "sh78d1e926-c6b8-44f7-9457-05de399144cd",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "172px"
        }, {
          "id" : "shc2ffa945-11d9-44e9-a07b-a202aa39273d",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "sh932221c7-eb17-4722-a8c4-c2b72fe4807a",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh1723dc19-e0d3-4312-8d22-a5d60505cead",
            "preps" : {
              "id" : "sh932221c7-eb17-4722-a8c4-c2b72fe4807a",
              "itemNameLabel" : "日期选择器",
              "name" : "shidingshijian",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入制定时间",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "制定时间",
              "type" : "datetime",
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "shidingshijian",
            "itemType" : "datetime",
            "label" : "单行文本框",
            "type" : "datetime",
            "priority" : 32
          } ]
        }, {
          "id" : "sh125efa33-85c4-452d-8ff3-20077b562165",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        } ]
      }, {
        "id" : "sh88437ddd-330b-44ba-b653-d50f459f1d50",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "sh9679151e-ecfa-47d1-a3b5-5145605290fb",
          "colIndex" : 1,
          "rowspan" : 2,
          "colspan" : 1,
          "items" : [ {
            "id" : "Idsh65e6d328-d099-4138-82be-309c594144fb",
            "preps" : {
              "id" : "sh9679151e-ecfa-47d1-a3b5-5145605290fb",
              "label" : "静态文本",
              "itemNameLabel" : "静态文本",
              "name" : "text34",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "staticData" : true,
              "textContent" : "不良排查",
              "colspan" : 1,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 2,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "text34",
            "itemType" : "text",
            "label" : "静态文本",
            "type" : "text",
            "priority" : 33
          } ],
          "cellVisible" : true
        }, {
          "id" : "shccb2fe0d-3b8f-42a5-80a9-e9b6939f5138",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh3a09a128-facd-4e3a-8cc9-69dcbc8a3d6b",
            "preps" : {
              "id" : "shccb2fe0d-3b8f-42a5-80a9-e9b6939f5138",
              "label" : "1.原材料",
              "itemNameLabel" : "单选框",
              "name" : "yuancailiao",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "placeholder" : "",
              "dataSource" : "data",
              "analysisType" : "func",
              "values" : [ {
                "name" : "需要",
                "value" : "xuyao"
              }, {
                "name" : "不需要",
                "value" : "buxuyao"
              } ],
              "valuesDefaultValue" : [ { } ],
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "yuancailiao",
            "itemType" : "radio",
            "label" : "单选框",
            "type" : "radio",
            "priority" : 34
          } ]
        }, {
          "id" : "sh129eeb8f-eefd-46a3-9e06-57e68d4df8a7",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "sh23b4c925-dd12-4e4a-a000-a28811654d06",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : true,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "shfeb9c678-5b89-4706-b05a-4a80cdc5fbda",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh344c9455-7660-471f-8733-244d5cde96e7",
            "preps" : {
              "id" : "shfeb9c678-5b89-4706-b05a-4a80cdc5fbda",
              "label" : "2.在制半成品",
              "itemNameLabel" : "单选框",
              "name" : "zzbcp",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "dataSource" : "data",
              "analysisType" : "func",
              "values" : [ {
                "name" : "需要",
                "value" : "xuyao"
              }, {
                "name" : "不需要",
                "value" : "buxuyao"
              } ],
              "valuesDefaultValue" : [ { } ],
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : "172px"
            },
            "compType" : "formItem",
            "fieldName" : "zzbcp",
            "itemType" : "radio",
            "label" : "单选框",
            "type" : "radio",
            "priority" : 35
          } ],
          "colWidth" : "172px"
        }, {
          "id" : "shbd0362a4-8e3d-4185-b6a7-4415fccc6436",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "sh35329b71-f884-4640-b668-9077092ecff3",
          "colIndex" : 1,
          "rowspan" : 2,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh154e253b-2d9a-4854-a71f-c46ba041b89b",
            "preps" : {
              "id" : "sh35329b71-f884-4640-b668-9077092ecff3",
              "itemNameLabel" : "单行文本框",
              "name" : "paicharenyuan",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入排查人员",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "排查人员",
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 2,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "paicharenyuan",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 36
          } ]
        }, {
          "id" : "sh794c2235-f1eb-4e1d-a1c7-f18ba1d7d060",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        } ]
      }, {
        "id" : "shd1641dc0-9106-4568-931f-f7e520dad164",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "sh55381a5c-f311-4cee-9dea-1ad6c6aeba06",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        }, {
          "id" : "shf0dc5955-36d1-4841-a0f9-94b2e137ab46",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idshb437f53a-1e5e-484f-afaa-aa67b2d2340a",
            "preps" : {
              "id" : "shf0dc5955-36d1-4841-a0f9-94b2e137ab46",
              "label" : " 3.成品库存",
              "itemNameLabel" : "单选框",
              "name" : "chengpinkucun",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "dataSource" : "data",
              "analysisType" : "func",
              "values" : [ {
                "name" : "需要",
                "value" : "xuyao"
              }, {
                "name" : "不需要",
                "value" : "buxuyao"
              } ],
              "valuesDefaultValue" : [ { } ],
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "chengpinkucun",
            "itemType" : "radio",
            "label" : "单选框",
            "type" : "radio",
            "priority" : 37
          } ]
        }, {
          "id" : "shd81d41e6-4bb9-4efc-9789-b683f69db7b0",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "sh5333dc9a-6a9e-456c-ba61-488232840b24",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : true,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "shb47c7d86-8bea-4fbd-b221-489d84928ddc",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh09ba73f5-003a-44ac-80dc-7ebe1cb3824a",
            "preps" : {
              "id" : "shb47c7d86-8bea-4fbd-b221-489d84928ddc",
              "label" : "4.已出货品",
              "itemNameLabel" : "单选框",
              "name" : "yichuhuopin",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "dataSource" : "data",
              "analysisType" : "func",
              "values" : [ {
                "name" : "需要",
                "value" : "xuyao"
              }, {
                "name" : "不需要",
                "value" : "buxuyao"
              } ],
              "valuesDefaultValue" : [ { } ],
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : "172px"
            },
            "compType" : "formItem",
            "fieldName" : "yichuhuopin",
            "itemType" : "radio",
            "label" : "单选框",
            "type" : "radio",
            "priority" : 38
          } ],
          "colWidth" : "172px"
        }, {
          "id" : "shcdd8eec4-bc51-446d-a4a6-ed01d33d06e4",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "shca78dd7a-7c05-4606-aeae-0348f2ce1cd1",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "sha4ba0889-fd31-4716-ba63-856d1be9473c",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        } ]
      }, {
        "id" : "sha9fc18fa-6fa1-4996-b776-59e9ae4c87b0",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "sh22a619c6-91e0-4649-8998-815428aae05d",
          "colIndex" : 1,
          "rowspan" : 3,
          "colspan" : 6,
          "items" : [ {
            "id" : "Idsh5cdfe3cf-0aaa-4220-8f3f-588da962d07f",
            "preps" : {
              "id" : "sh22a619c6-91e0-4649-8998-815428aae05d",
              "label" : "长期预防措施",
              "itemNameLabel" : "多行文本框",
              "name" : "cqyfcs",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入长期预防措施",
              "rules" : [ ],
              "maxLength" : 1000,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "labelPosition" : "top",
              "colspan" : 6,
              "colHeight" : "150px",
              "cellVisible" : true,
              "rowspan" : 3,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "cqyfcs",
            "itemType" : "textarea",
            "label" : "多行文本框",
            "type" : "textarea",
            "priority" : 39
          }, {
            "id" : "Idshe6b1d024-6ab9-4b11-a1eb-47d68a703c82",
            "preps" : {
              "id" : "sh22a619c6-91e0-4649-8998-815428aae05d",
              "label" : "标准化",
              "itemNameLabel" : "单选框",
              "name" : "biaozhunhua",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "placeholder" : "",
              "dataSource" : "data",
              "analysisType" : "func",
              "values" : [ {
                "name" : "作业标准修订",
                "value" : "zybzxd"
              }, {
                "name" : "图纸修订",
                "value" : "tuzhixiuding"
              }, {
                "name" : "研发/技术更改，ECN号",
                "value" : "yf_jsgg"
              }, {
                "name" : "其它",
                "value" : "other"
              } ],
              "valuesDefaultValue" : [ { } ],
              "colspan" : 6,
              "colHeight" : "150px",
              "cellVisible" : true,
              "rowspan" : 3,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "biaozhunhua",
            "itemType" : "radio",
            "label" : "单选框",
            "type" : "radio",
            "priority" : 40
          } ],
          "cellVisible" : true,
          "colHeight" : "150px"
        }, {
          "id" : "sha2e3ced8-0536-4192-8de9-dbaf05c013d3",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "shb5aab7b9-aba4-48cb-9ba4-e1129957e9f6",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "sh34dc4b22-b49a-40c8-9598-035303aec955",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "sh3cb69fd3-9131-4731-bf65-c714783b2b70",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "172px"
        }, {
          "id" : "sh1be28d0c-9b55-476b-bc8a-f7ccad45394e",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "sh0372f8a5-6433-4ad4-9179-6c78088862b0",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh2f96a796-d79c-4555-aac1-e029f164b463",
            "preps" : {
              "id" : "sh0372f8a5-6433-4ad4-9179-6c78088862b0",
              "label" : "制定人",
              "itemNameLabel" : "单行文本框",
              "name" : "zhidingren2",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入制定人",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "zhidingren2",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 41
          } ]
        }, {
          "id" : "sh8d092de1-f85f-4bee-a1d3-5db9c592f657",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        } ]
      }, {
        "id" : "shcfd0cfcc-53b6-4d00-b609-bf22d3ffcb3d",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "sh738066ac-354c-454c-91cc-733032a42616",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        }, {
          "id" : "sh668fb4b3-a8f3-4bf4-9537-9f1f0adb9a9d",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "sh1f39de72-5407-42fe-a8c5-9ec8dea6e499",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "sh6bfa5e24-fee6-4700-94a2-7c26a688cb67",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "shc14367c4-3100-47af-b128-3f200add452f",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "172px"
        }, {
          "id" : "sh472e8495-25b0-47ce-9e82-9af0f39f443d",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "sh632737a0-4027-48a7-a957-d2c69e009fa1",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idshe3b28106-4dac-40ef-889d-770b227928fa",
            "preps" : {
              "id" : "sh632737a0-4027-48a7-a957-d2c69e009fa1",
              "itemNameLabel" : "单行文本框",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入制定时间",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "制定时间",
              "name" : "zhidingshijian2",
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "zhidingshijian2",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 42
          } ]
        }, {
          "id" : "sh39038907-7910-450b-b310-5d3a5f31f39a",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        } ]
      }, {
        "id" : "shefc46ca0-0cf7-463d-a012-accc956197b5",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "sh274b3b0f-b8e8-4505-bfa4-e17439a730ee",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        }, {
          "id" : "sha2d1e056-3d00-4745-9ca1-b7316b0d02b3",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "sh5d94c329-4d8a-4ad0-8257-3a2ae8dca156",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "sh965d04aa-e053-4be1-8109-f83dfbf43e83",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "sh6d3c66e4-5159-4fd8-8ffa-eb578fce1362",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "172px"
        }, {
          "id" : "sh257dc298-1c62-44c4-afa0-f4f9cffbe8bf",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "sh0475571e-5528-44f4-8d1f-dbf6c8fc56e5",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh92d3692e-9214-4998-be14-9cab4572388c",
            "preps" : {
              "id" : "sh0475571e-5528-44f4-8d1f-dbf6c8fc56e5",
              "itemNameLabel" : "单行文本框",
              "name" : "bumenjingli",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入部门经理",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "部门经理",
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "bumenjingli",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 43
          } ]
        }, {
          "id" : "she016ec37-483d-4d7c-a2f4-8b6e531dc3b9",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        } ]
      }, {
        "id" : "sh2a7f79cf-659c-44ab-81b3-769d0a2f35eb",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "sh633d02b5-feb9-4199-a178-694b9e728e5c",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 6,
          "items" : [ {
            "id" : "Idsha650e633-4423-4791-ae89-c8c5f905babd",
            "preps" : {
              "id" : "sh633d02b5-feb9-4199-a178-694b9e728e5c",
              "label" : "Html组件",
              "itemNameLabel" : "Html组件",
              "name" : "html46",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "placeholder" : "",
              "staticData" : true,
              "textContent" : "<p style=\"text-align: left;\">改善措施效果确认</p>",
              "elements" : [ {
                "id" : "sh252b242f-43c2-4951-acbf-57444753e1d9",
                "colIndex" : 1,
                "columns" : [ {
                  "id" : "she33c19e0-72d4-4839-abf9-23b6efeb50bc",
                  "colIndex" : 1,
                  "rowspan" : 1,
                  "colspan" : 1,
                  "items" : [ ],
                  "cellVisible" : true
                } ]
              } ],
              "rowNums" : 1,
              "columnNums" : 1,
              "styles" : {
                "alignItems" : "start"
              },
              "colspan" : 6,
              "colHeight" : "51px",
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "html46",
            "itemType" : "html",
            "label" : "Html组件",
            "type" : "html",
            "priority" : 44
          } ],
          "cellVisible" : true,
          "colHeight" : "51px"
        }, {
          "id" : "sh5d5ea5b2-75d3-4e98-95c6-d0adca9fffba",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        }, {
          "id" : "sh6b94572c-9178-4f0c-9327-de1e5c631122",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "186px"
        }, {
          "id" : "sh6fa1a213-e1b4-4301-8b4d-3e2ac6518bab",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "62px"
        }, {
          "id" : "shf2ad8beb-1ac8-44cf-94f3-ac5989cccd0e",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "172px"
        }, {
          "id" : "shf6243353-da9e-47ba-bdf6-6105255d3ecb",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ],
          "colWidth" : "185px"
        }, {
          "id" : "sh47aad720-f646-4501-8f21-238910723e9a",
          "colIndex" : 1,
          "rowspan" : 2,
          "colspan" : 2,
          "cellVisible" : true,
          "items" : [ {
            "id" : "Idsh4f89e059-926c-4e6e-933b-64585ed5e1c0",
            "preps" : {
              "id" : "sh47aad720-f646-4501-8f21-238910723e9a",
              "label" : "QE确认",
              "itemNameLabel" : "单行文本框",
              "name" : "qequeren2",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入QE确认",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 2,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "qequeren2",
            "itemType" : "input",
            "label" : "单行文本框",
            "type" : "input",
            "priority" : 45
          } ]
        }, {
          "id" : "shdc3847c7-5498-43c8-b33d-73932eaa8ce1",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "cellVisible" : false,
          "items" : [ ]
        } ]
      }, {
        "id" : "shb2f71d9b-268d-4c0a-b680-25fd89cb278a",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "she671b08e-b043-48b7-90fd-27ae5034dbc4",
          "colspan" : 2,
          "rowspan" : 1,
          "items" : [ {
            "id" : "Idsh03692c12-5f4e-47eb-8f41-1ad8e309ce72",
            "preps" : {
              "id" : "she671b08e-b043-48b7-90fd-27ae5034dbc4",
              "itemNameLabel" : "日期选择器",
              "name" : "gzsd",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请选择跟踪时段",
              "type" : "datetime",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "跟踪时段",
              "format" : "HH",
              "valueFormat" : "HH",
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "gzsd",
            "itemType" : "datetime",
            "label" : "日期选择器",
            "type" : "datetime",
            "priority" : 46
          } ],
          "cellVisible" : true
        }, {
          "id" : "sh37b90368-a9db-4397-80c4-ed9340f39783",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        }, {
          "id" : "sh05dec99e-908d-4f1c-b25a-23eb7586d71d",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false,
          "colWidth" : "186px"
        }, {
          "id" : "sh961e5ee0-4540-4e7a-a3f8-8c8bf0e63fef",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 2,
          "items" : [ {
            "id" : "Idsh247c25aa-4c24-40d5-a693-0841e1f878a4",
            "preps" : {
              "id" : "sh961e5ee0-4540-4e7a-a3f8-8c8bf0e63fef",
              "itemNameLabel" : "数字输入框",
              "name" : "tourushu2",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入投入数",
              "step" : "1",
              "min" : 0,
              "precision" : 0,
              "rules" : [ ],
              "maxLength" : 10,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "投入数",
              "controlsPosition" : "right",
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : "62px"
            },
            "compType" : "formItem",
            "fieldName" : "tourushu2",
            "itemType" : "number",
            "label" : "数字输入框",
            "type" : "number",
            "priority" : 47
          } ],
          "cellVisible" : true,
          "colWidth" : "62px"
        }, {
          "id" : "shee4406a9-b8a7-4357-b73f-7148ca6d7ceb",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false,
          "colWidth" : "172px"
        }, {
          "id" : "shfd71552a-672f-4ad4-a6c0-d8e7fc025fa0",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ {
            "id" : "Idsh1b77618b-4d79-4ef9-b080-2e53c16d44ee",
            "preps" : {
              "id" : "shfd71552a-672f-4ad4-a6c0-d8e7fc025fa0",
              "itemNameLabel" : "数字输入框",
              "name" : "buliangshu2",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入不良数",
              "step" : "1",
              "min" : 0,
              "precision" : 0,
              "rules" : [ ],
              "maxLength" : 10,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "不良数",
              "controlsPosition" : "right",
              "colspan" : 1,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : "185px"
            },
            "compType" : "formItem",
            "fieldName" : "buliangshu2",
            "itemType" : "number",
            "label" : "数字输入框",
            "type" : "number",
            "priority" : 48
          } ],
          "cellVisible" : true,
          "colWidth" : "185px"
        }, {
          "id" : "sh9c050143-3467-48cd-a0f2-3cb0ed729672",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ {
            "id" : "Idsha6fbc01c-27a9-474e-8d2e-f188e4cbc6f4",
            "preps" : {
              "id" : "sh9c050143-3467-48cd-a0f2-3cb0ed729672",
              "itemNameLabel" : "数字输入框",
              "name" : "bulianglv2",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入不良率",
              "step" : "1",
              "min" : 0,
              "precision" : 0,
              "rules" : [ ],
              "maxLength" : 10,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "不良率",
              "colspan" : 1,
              "colHeight" : null,
              "cellVisible" : false,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "bulianglv2",
            "itemType" : "number",
            "label" : "数字输入框",
            "type" : "number",
            "priority" : 49
          } ],
          "cellVisible" : false
        }, {
          "id" : "sh702863b5-024a-4465-9877-a5e946dbb17f",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        }, {
          "id" : "she20f4648-48a1-4755-b05d-f8788913833b",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : true
        } ]
      }, {
        "id" : "shd809ccc9-41b0-4774-9f94-e66bda3ae65a",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "shc983efcb-8281-44eb-8164-ff36da17c67f",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 6,
          "items" : [ {
            "id" : "Idshb6473bb0-8b0c-4ec7-bc26-e2d674bf5e37",
            "preps" : {
              "id" : "shc983efcb-8281-44eb-8164-ff36da17c67f",
              "label" : "判定",
              "itemNameLabel" : "单选框",
              "name" : "panding",
              "clearable" : true,
              "readonly" : false,
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "step" : "",
              "placeholder" : "",
              "dataSource" : "data",
              "analysisType" : "func",
              "values" : [ {
                "name" : "措施有效，可继续生产，进一步跟进效果",
                "value" : "ok"
              }, {
                "name" : "措施无效，需停线整改",
                "value" : "ng"
              } ],
              "valuesDefaultValue" : [ { } ],
              "colspan" : 6,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "panding",
            "itemType" : "radio",
            "label" : "单选框",
            "type" : "radio",
            "priority" : 50
          } ],
          "cellVisible" : true
        }, {
          "id" : "shbbfebb9d-0a1f-436e-abb7-d3435183d89a",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        }, {
          "id" : "sh01bf9637-700e-4439-8985-29f19ad3ebf3",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false,
          "colWidth" : "186px"
        }, {
          "id" : "sh89a423e5-3e6e-44eb-8ed4-41076409e24c",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false,
          "colWidth" : "62px"
        }, {
          "id" : "sh0e493591-732e-41c8-a0a5-b5b9fa0668e0",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false,
          "colWidth" : "172px"
        }, {
          "id" : "sh1d38f053-a4e0-4fdf-a3f8-b81d1f048d6f",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false,
          "colWidth" : "185px"
        }, {
          "id" : "sh5935a9a0-a5ce-4365-9d81-c1f3f92a305b",
          "colIndex" : 1,
          "rowspan" : 2,
          "colspan" : 2,
          "items" : [ {
            "id" : "Idsh97cc1aad-ad64-4c46-823b-794be7c621e0",
            "preps" : {
              "id" : "sh5935a9a0-a5ce-4365-9d81-c1f3f92a305b",
              "itemNameLabel" : "日期选择器",
              "name" : "qurenshijian2",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请选择确认时间",
              "type" : "datetime",
              "rules" : [ ],
              "maxLength" : 255,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "确认时间",
              "colspan" : 2,
              "colHeight" : null,
              "cellVisible" : true,
              "rowspan" : 2,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "qurenshijian2",
            "itemType" : "datetime",
            "label" : "日期选择器",
            "type" : "datetime",
            "priority" : 51
          } ],
          "cellVisible" : true
        }, {
          "id" : "sh88b0147f-85d4-43f0-a995-e62d0b42e432",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        } ]
      }, {
        "id" : "shfc472521-e63d-4df1-b2dc-bce6cdf20e78",
        "colIndex" : 1,
        "columns" : [ {
          "id" : "shfb90bfe2-43e0-4bb6-8438-48caf9e01b04",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 6,
          "items" : [ {
            "id" : "Idsh26f35c22-cd27-445d-9b46-c28a8b257531",
            "preps" : {
              "id" : "shfb90bfe2-43e0-4bb6-8438-48caf9e01b04",
              "itemNameLabel" : "多行文本框",
              "name" : "formRemark",
              "clearable" : true,
              "readonly" : false,
              "placeholder" : "请输入备注",
              "rules" : [ ],
              "maxLength" : 1000,
              "formVisible" : true,
              "listVisible" : true,
              "viewVisible" : true,
              "label" : "备注",
              "colspan" : 6,
              "colHeight" : "92px",
              "cellVisible" : true,
              "rowspan" : 1,
              "colWidth" : null
            },
            "compType" : "formItem",
            "fieldName" : "formRemark",
            "itemType" : "textarea",
            "label" : "多行文本框",
            "type" : "textarea",
            "priority" : 52
          } ],
          "cellVisible" : true,
          "colHeight" : "92px"
        }, {
          "id" : "sh094b9943-dce2-4542-9dbf-2662fd0a93bb",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        }, {
          "id" : "sh55089891-c9c7-4d64-88b3-3528673f3755",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false,
          "colWidth" : "186px"
        }, {
          "id" : "shf92e141d-ea64-4f6e-a6b3-b00fee385cd1",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false,
          "colWidth" : "62px"
        }, {
          "id" : "sh36acbb54-ce72-4a3c-b1a8-86bb40db7fa4",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false,
          "colWidth" : "172px"
        }, {
          "id" : "sh22c73a55-dc1a-449d-affc-00cd69c681ed",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false,
          "colWidth" : "185px"
        }, {
          "id" : "sh75c310b4-fb14-4ea5-af4e-ce368fa11ee8",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        }, {
          "id" : "sh026540d9-47c2-4a8e-b5f7-d04cdbe936cf",
          "colIndex" : 1,
          "rowspan" : 1,
          "colspan" : 1,
          "items" : [ ],
          "cellVisible" : false
        } ]
      } ],
      "rules" : [ ],
      "maxLength" : 255,
      "formVisible" : true,
      "listVisible" : true,
      "viewVisible" : true,
      "rowNums" : 21,
      "columnNums" : 8,
      "placeholder" : ""
    },
    "compType" : "container",
    "fieldName" : "dytable1",
    "itemType" : "dytable",
    "rowNums" : 1,
    "columnNums" : 1,
    "type" : "dytable"
  } ],
  "orderBy" : [ {
    "fieldName" : "idExceptionFeedbacks",
    "orderBy" : "desc"
  } ],
  "batchName" : "batchDataList",
  "cellEditable" : false,
  "stopAutoLoad" : false
};
onMounted(() => {
  // const result = analysisCompDatas(fields);
  // console.log(JSON.stringify(result.fieldList));
  dataItem.value["fieldList"] = fieldList;

});
</script>

<style lang="scss" scoped></style>
