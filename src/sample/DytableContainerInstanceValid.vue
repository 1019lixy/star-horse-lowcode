<template>
  <el-scrollbar>
    <!--    <dytable-item :dataForm="formData" :item="dataItem"  :formInfo="{}" />-->
    <star-horse-form :fieldList="{fieldList:fieldList}" labelPosition="top"/>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import piniaInstance from "@/store";
import {useDesignFormStore} from "@/store/DesignForm";
import {onMounted, ref} from "vue";
import {analysisComps} from "@/api/form_utils";
import {StarHorseForm} from "@/components/comp";

let designForm = useDesignFormStore(piniaInstance);
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
const fieldList = [{
  "fieldName": "",
  "dytableList": [[{
    "label": "Html组件",
    "fieldName": "html2",
    "type": "html",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh8b2f5c84-b037-41f2-baa6-7c35bcf9ebdb",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "rowNums": 1,
      "columnNums": 1,
      "staticData": true,
      "textContent": "<p style=\"text-align: center;\"><span style=\"font-size: 19px;\">四川华平通讯设备有限公司</span></p><p style=\"text-align: center;\"><span style=\"font-size: 19px;\">SMT首件确认表</span></p>",
      "colHeight": "117px",
      "colWidth": "43px",
      "colspan": 12,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "label": "静态文本",
    "fieldName": "text13",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idshdc1638f0-135f-4d46-8b5a-5d83c0f41575",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "基本信息",
      "colWidth": "43px",
      "colspan": 1,
      "rowspan": 4,
      "cellVisible": true
    }
  }, {
    "label": "线别",
    "fieldName": "xianbie",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh8ec80e87-e88f-4c97-805d-c96019ada3f8",
    "preps": {
      "clearable": true,
      "placeholder": "请输入线别",
      "rules": [],
      "maxLength": 255,
      "colWidth": "39px",
      "colspan": 4,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "日期/班别",
    "fieldName": "riqibanbie",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh65a619f1-cbba-4b37-81a3-35e1625074ea",
    "preps": {
      "clearable": true,
      "placeholder": "请输入日期/班别",
      "rules": [],
      "maxLength": 255,
      "colspan": 3,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "生产工单号",
    "fieldName": "scgd",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh6b1ca9c9-4852-4531-8853-3d47fc176b7d",
    "preps": {
      "clearable": true,
      "placeholder": "请输入生产工单号",
      "rules": [],
      "maxLength": 255,
      "colspan": 4,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "label": "产品名称",
    "fieldName": "cpmc",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh5f62a6a8-9cc7-4f52-9e21-0fd39b415e91",
    "preps": {
      "clearable": true,
      "placeholder": "请输入产品名称",
      "rules": [],
      "maxLength": 255,
      "colWidth": "39px",
      "colspan": 4,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "软件版本",
    "fieldName": "rjbb",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh9727bfe0-830d-4c61-94cb-9315c8de8a9b",
    "preps": {
      "clearable": true,
      "placeholder": "请输入软件版本",
      "rules": [],
      "maxLength": 255,
      "colspan": 3,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "BOM",
    "fieldName": "bom",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh89a24631-d0bf-430a-b4ce-749605fb6c70",
    "preps": {
      "clearable": true,
      "placeholder": "请输入BOM",
      "rules": [],
      "maxLength": 255,
      "colspan": 4,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "label": "批量/样本数",
    "fieldName": "plybs",
    "type": "number",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh8ebdd884-7b35-4e1f-b8a6-49fe4d3b6ba3",
    "preps": {
      "clearable": true,
      "placeholder": "请输入批量/样本数",
      "step": 1,
      "rules": [],
      "maxLength": 10,
      "colWidth": "39px",
      "colspan": 4,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "PCB版本/周期",
    "fieldName": "pcbbbzq",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh9f4ddc78-2d90-4917-8895-612cecc0f885",
    "preps": {
      "clearable": true,
      "placeholder": "请输入PCB版本/周期",
      "rules": [],
      "maxLength": 255,
      "colspan": 3,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "类别",
    "fieldName": "leibie",
    "type": "radio",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idshc1bd2d32-5113-406b-a20c-f28cb41ec033",
    "preps": {
      "clearable": true,
      "placeholder": "请输入单行文本框",
      "rules": [],
      "maxLength": 255,
      "dataSource": "data",
      "analysisType": "func",
      "values": [{"name": "有铅", "value": "youqian", "xh": 1}, {
        "name": "无铅",
        "value": "wuqian",
        "xh": 2
      }, {"name": "混合工艺", "value": "hhgy", "xh": 3}],
      "valuesDefaultValue": [{}],
      "hideLabel": true,
      "colspan": 4,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "label": "首件类型",
    "fieldName": "shoujianleixing",
    "type": "radio",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idshb8f4512a-e6f9-4078-a21e-8e00d289f7df",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "dataSource": "data",
      "analysisType": "func",
      "values": [{"name": "每班首检", "value": "mbsj", "xh": 1}, {
        "name": "重大工艺更改",
        "value": "zdgygg",
        "xh": 2
      }, {"name": "转线（机型）", "value": "zxjx", "xh": 3}, {
        "name": "新机型试产",
        "value": "xjxsc",
        "xh": 4
      }, {"name": "软件变更", "value": "rjbg", "xh": 5}, {
        "name": "返工",
        "value": "fangong",
        "xh": 6
      }, {"name": "调机（印刷、贴片）", "value": "tjystp", "xh": 7}, {
        "name": "机台设备程序变更",
        "value": "jtsbcxbg",
        "xh": 8
      }, {"name": "回流曲线变更", "value": "hlqxbg", "xh": 9}, {
        "name": "物料变更（主/辅料）",
        "value": "wlbgzfl",
        "xh": 10
      }, {"name": "设计变更", "value": "sjbg", "xh": 11}],
      "valuesDefaultValue": [{}],
      "colHeight": "64px",
      "colWidth": "43px",
      "colspan": 11,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": true}
  }], [{
    "label": "静态文本",
    "fieldName": "text17",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idshf5f1b938-4b40-482b-af9c-1c10e53f27be",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "检验及分析内容",
      "colWidth": "43px",
      "colspan": 1,
      "rowspan": 28,
      "cellVisible": true
    }
  }, {
    "label": "静态文本",
    "fieldName": "text18",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh2b00ee97-5e42-4303-8594-020779470d53",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "胶纸板首检确认",
      "colWidth": "39px",
      "colspan": 1,
      "rowspan": 6,
      "cellVisible": true
    }
  }, {
    "label": "静态文本",
    "fieldName": "text19",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh7420055c-a15f-48f0-8a51-4afca4d42057",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "检验项目",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text20",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh9d9fab64-5490-4da2-8640-159f15ac0f02",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "起始时间",
      "appCompVisible": true,
      "labelFor": ["qssj1", "qssj70", "qssj71", "qssj72", "qssj73", "qssj74", "qssj75", "qssj76", "qssj77", "qssj78", "qssj79", "qssj80", "qssj81", "qssj82", "qssj83", "qssj84", "qssj85", "qssj86", "qssj87", "qssj88", "qssj89", "qssj90", "qssj91", "qssj92", "qssj93", "qssj94", "qssj95"],
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text21",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh84e6658f-d537-4eb1-af96-599051921934",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "数据记录",
      "labelFor": ["sjjl96", "sjjl97", "sjjl98", "sjjl99", "sjjl100", "sjjl101", "sjjl102", "sjjl103", "sjjl104", "sjjl105", "sjjl106", "sjjl107", "sjjl108", "sjjl109", "sjjl110", "sjjl111", "sjjl112", "sjjl113", "sjjl114", "sjjl115", "sjjl116", "sjjl117", "sjjl118", "sjjl119", "sjjl120", "sjjl121"],
      "appCompVisible": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text22",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsha3e9a2de-a5aa-4246-8137-c758272ec7da",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "异常原因/对策",
      "appCompVisible": true,
      "labelFor": ["ycyydc1", "ycyydc122", "ycyydc123", "ycyydc124", "ycyydc125", "ycyydc126", "ycyydc127", "ycyydc128", "ycyydc129", "ycyydc130", "ycyydc131", "ycyydc132", "ycyydc133", "ycyydc134", "ycyydc135", "ycyydc136", "ycyydc137", "ycyydc138", "ycyydc139", "ycyydc140", "ycyydc141", "ycyydc142", "ycyydc143", "ycyydc144", "ycyydc145", "ycyydc146", "ycyydc147"],
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人",
    "fieldName": "text23",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsha232a70e-81d7-4d64-a637-b47f9b0a579c",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "确认人",
      "appCompVisible": true,
      "labelFor": ["qurenren1", "qurenren148", "qurenren149", "qurenren150", "qurenren151", "qurenren152", "qurenren153", "qurenren154", "qurenren155", "qurenren156", "qurenren157", "qurenren158", "qurenren159", "qurenren160", "qurenren161", "qurenren162", "qurenren163", "qurenren164", "qurenren165", "qurenren166", "qurenren167", "qurenren168", "qurenren169", "qurenren170", "qurenren171", "qurenren172", "qurenren173"],
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text24",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh6469eddd-f23d-4b3d-adfd-2744173935ad",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "根据生产计划核对机型配置信息（生产/工程/品质）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器",
    "fieldName": "qssj1",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh791e3f89-8c33-409c-952f-b06b514efd8b",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录",
    "fieldName": "sjjl1",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh8035d585-3798-45ec-b201-816ac485f136",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策",
    "fieldName": "ycyydc1",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh44db429a-edfa-4305-abaf-4c056bc6966e",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人",
    "fieldName": "qurenren1",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh62aad525-229b-4f94-be26-9f4ce59ad3d8",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text25",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idshb84d6c98-3be6-4b91-bcdb-c564bcc7c258",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "PCB检查（PCB外观、丝印、版本等）（生产/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj70",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shbfd62986-c8c9-47c1-9748-f2fde2e682d8",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl96",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shc152bd1f-2392-4cac-85c0-a8147651e4b1",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc122",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh01bb15d1-f322-40da-812b-9f69afc3ce8c",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren148",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh4fa967e9-a1f6-4593-a8e6-102117c20eef",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text26",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh24fbad63-9c18-45cc-9827-cc0545e2d00c",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "物料核对（物料编码、描述、规格与BOM是否一致及阻容件相关参数等）（生产/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj71",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh3a44265b-5bd1-4468-957f-39639f425983",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl97",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shdf917f61-7386-4e65-909b-2a9a6fd1c93b",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc123",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh64a501a2-4e4d-42c1-8407-211d04c2f208",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren149",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shcd402b68-8de0-4135-a732-97f7839f7f44",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text27",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idshc069e605-e7c5-47ce-ad44-92b8a694d827",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "贴片程序及版本核对（工程/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj72",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shdc624d94-e019-4115-848f-8575fe3d4950",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl98",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh6f033bb4-6e40-4b84-8f4c-3e1be1ef62f0",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc124",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh46a0ee49-6b8a-44fe-a7f3-a624511972e0",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren150",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sha1b50626-41ef-47be-83bb-966c5a76d6a5",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text28",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idshd945da96-1021-4049-b418-da63b861a701",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "极性方向确认，注意结构件位置和方向（生产/工程/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj73",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shfca5ef0f-1394-4b4c-951f-81d7a3ef2236",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl99",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh91a45080-9977-4dd6-b5a1-0947395dbed3",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc125",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sha444f6ee-1c82-49c3-a108-ff32e815b733",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren151",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh7ea37f66-b1e7-455b-981d-a5e4ee18ea73",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text33",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh9067dc5f-72b1-4c73-bf49-8c30328b4469",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "贴片段首件确认",
      "colWidth": "39px",
      "colspan": 1,
      "rowspan": 13,
      "cellVisible": true
    }
  }, {
    "label": "静态文本",
    "fieldName": "text34",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh9548e053-b64a-4e8e-a122-a0b700772f31",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "锡膏型号（生产/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj74",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh68c318a6-a613-4020-99ff-1123dc701f36",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl100",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shfc970858-e7c7-4d77-806b-e33191188291",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc126",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh9df1a97c-0db3-40e1-9eca-9162397f68b7",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren152",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh62a3218d-ead6-47a0-9980-753a80744a39",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text35",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idshed3c63de-8588-4100-8ab7-c6a8a3efbbb2",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "印刷参数确认（需记载数据由工程/品质填写）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj75",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shffc5973d-3b0f-4f45-a012-0afe386a9bd4",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl101",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shb77fd7dd-9a1e-4c9a-8c70-1666202b3581",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc127",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh5d4fbaba-ec4e-47d5-b418-9149b5f3ce60",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren153",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh0218bbde-f216-4d9e-a5a0-b92b57cb14b1",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text36",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh253c9f5a-5f68-4c87-a82b-b7b074f872b6",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "锡膏厚度测试（需记数据由品质填写）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj76",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh4262be46-3d9f-4d5d-b609-7c7dbbe5ff76",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl102",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh818f0773-3c97-40a4-9e5d-395681434f46",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc128",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh66254ee5-27dc-40e0-8eb3-762a27423212",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren154",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh9d090543-0f41-4bfd-bfca-89e726f6d3d5",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text37",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh8ea5f176-0327-4270-8030-9d65511799fa",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "贴片程序及版本核对（工程/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj77",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh1323ac93-98ce-4345-bc95-fa633c19a3df",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl103",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh83a90c20-d8c1-4511-b487-b1fe1a68f2b7",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc129",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh5c4d1dbb-167d-414d-a7d6-fedcec14cc01",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren155",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shcd8abb86-dadc-4f54-ab5f-63667419d21b",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text38",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh31a1c469-24b9-4224-b1e6-9eb50451856e",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "物料核对（物料编码、描述、规格与BOM是否一致及阻容件相关参数等）（生产/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj78",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh40359459-cac3-4167-9dee-c0b047885f58",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl104",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh86cd8b0a-e292-4608-94b7-86187bbc3c42",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc130",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh05ebabf8-6e51-49ad-8dfc-fef6094f3fd5",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren156",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shb6d7f60a-b20e-4258-8ae6-b2284e0402f0",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text39",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh2e85e15f-558e-4f1d-8871-2ee2ba0d1a4b",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "极性方向确认，注意结构件位置和方向（生产/工程/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj79",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh80967fd5-0c33-4658-9056-93e060e52d40",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl105",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh5f941e99-8e1b-4a45-aded-3d7606371333",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc131",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh65a752da-8f24-45a7-a179-df2c37831a3d",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren157",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh3369ec66-ee7a-45b5-bdc0-cd93fd30869d",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text40",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh54899edd-2294-4266-9270-21faa37498f1",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "参照样板确认（品质/工程确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj80",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh7fa09de5-e2d9-4309-b657-2a819bf64014",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl106",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shf7f67eac-0073-4c5d-9a6a-c899348d4bbf",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc132",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh9066dd7e-8fa0-46c8-a71e-3a0c2f71844f",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren158",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh74004d2d-2960-411a-9c65-42d048b0af40",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text41",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh50f2691d-b68a-41a8-a91b-0f6a29aebb54",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "炉前X-Ray/AOI检查（工程确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj81",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shfdd8c0ef-a1c7-412d-b812-ba727f56c5a9",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl107",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh32042028-d931-4247-9b56-bb56a06b8b3f",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc133",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shdb0728d5-7cd5-4b89-991c-060d5d692e55",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren159",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh0f25d235-e0ef-4ad6-854b-c1d86da6e77e",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text42",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh6e6b28ed-7f95-4868-8b4b-144a9c6d2299",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "回流曲线测试（需记录回流程序，工程确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj82",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shf3946eb4-f8ae-422c-bcae-4ef348fc45c6",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl108",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh5d11a9c4-adbe-4d9a-ad16-9d5506754e5c",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc134",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shf47dc3cc-b383-4696-aac7-aa05234b310d",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren160",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sha022fd0a-a9ae-4823-9543-04933a77fa32",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text43",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh90e6566f-abc7-4b39-a815-0eeff5fcbc7d",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "炉后X-Ray/AOI检查（生产/工程/品质）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj83",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh78d56966-3480-4bef-b74f-2e68fa3e04aa",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl109",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shb758f060-4de1-4c6d-9875-2a950446538b",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc135",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh796f6172-58ab-4b74-b7a2-63211cea97bd",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren161",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh4fa465a1-3174-46fa-8fb7-3d11e50468f1",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text44",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsha450ae99-170b-47b7-a6ba-426c392fafd3",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "USB和耳机的插孔底部锡凸出高度≤0.4mm（品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj84",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh56fb6867-287b-48ea-8ff6-878811998131",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl110",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh78f539c3-24d9-43f5-844b-012fce2c8fa1",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc136",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shaaccd5a9-38cd-49d1-af39-fa30b114121b",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren162",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh7b7350b9-8bfb-4d8c-82fb-13f23fb4087d",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text45",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh1858f680-0e47-4cb4-944e-c611720691c8",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "分板尺寸和外观检查（生产/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj85",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh961daf6f-1054-44a5-a5b1-34f8dd15760a",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl111",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh17875aca-e6eb-4378-8b2a-271bc8aa963e",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc137",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shb7cada83-11db-494c-b0f6-2fe51c2b9d0d",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren163",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "she9d51714-e616-48ab-8512-b959f7ce366e",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text46",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh9e905484-d021-4119-9a7a-a8fc6d599c78",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "条码贴纸/镭雕SN确认（品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj86",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh4c021d5a-00e9-46a8-a9a3-62285c3786ac",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl112",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh5b6493f7-6ddc-4612-908e-e423a98a4e85",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc138",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shf0290eb8-9d63-41f7-9d01-d4ac63a05c3c",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren164",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh5c86f6b1-4baa-4a36-bc9d-90a16cff0338",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text47",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh61f65660-8e51-4f0d-a4fa-9312eac05aaa",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "测试段首件确认",
      "colWidth": "39px",
      "colspan": 1,
      "rowspan": 9,
      "cellVisible": true
    }
  }, {
    "label": "静态文本",
    "fieldName": "text48",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh62005284-3106-4723-84a0-a0da551fa55a",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "测试各工序工程需检查测试夹具所有物料有无避空到位（工程确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj87",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shb3e0e502-e988-4732-9817-38502fb9e386",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl113",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh4b6ae212-6c38-4727-9066-8922725f6d3f",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc139",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shc0d500b7-5bf7-402f-aded-382f2d39fd42",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren165",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh42385e1d-cef9-4fa5-81e0-cad6c4a21ded",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text49",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh040950de-9039-4761-94eb-80fa7d36c7b2",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "下载（烧录）测试软件版本确认（工程/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj88",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh8d2be8c3-e0c3-4358-a8ca-f8869767155c",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl114",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh01ea8345-b5af-4b4f-9b21-9c9d37b56a47",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc140",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh65f50921-3409-4b9e-91b0-e6e7ad105fb4",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren166",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh12633a4f-f210-45d3-8393-a3405ceefd81",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text50",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idshaca82d9d-7e33-4062-830d-5d550dc272c2",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "开检测试脚本及工具（工程/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj89",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh23426ddb-9753-49e9-9f4a-1155d599d55c",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl115",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh3d2ae7bb-e982-42c4-bf69-7a729e613c0a",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc141",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shdde6cec8-86d9-44d7-8df7-38a14551b221",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren167",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh04e059dd-c0ed-4368-8d50-9f9a2354e268",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text51",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh5b59da20-71f0-42e4-8b59-4a39561bfac5",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "校准测试配置文件、脚本及工具（工程/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj90",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shc5ddaaa6-771b-4d42-a956-c656fe6a624e",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl116",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh8ebb8f06-e64c-4721-8ab4-e9b564906360",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc142",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh4c3f391a-f064-4705-bf11-f60458e424df",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren168",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh81a42d96-999c-49f6-96f4-6bc881132dfe",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text52",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh2d6c8054-b2b6-4b46-9d77-6f54ebbf5706",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "综测测试脚本（工程/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj91",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh78261f90-6a40-4b92-9a4f-dfb0697f6346",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl117",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shc1a7de8c-ba97-468f-b345-5779695e0e9a",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc143",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh13454452-9f48-46e0-8cbf-1ee7c4137120",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren169",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shfd2f2d46-9e9b-46de-884a-291421f9670b",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text53",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh4b1bacd3-ecbe-46ad-b947-5017824a5078",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "传导测试脚本（工程/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj92",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shbc2c55a0-8a37-406f-b264-0f7f97147bda",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl118",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "she290cde9-259d-458c-b386-4c693adab389",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc144",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh0fee1f9e-0095-441c-9bc4-b5cb8c9262fc",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren170",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh62693c56-8a99-4662-a2e3-be8fae620050",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text54",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh4d0d0900-7080-4400-b038-9ab234764c8c",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "功能测试脚本（工程/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj93",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shcb93a647-e076-44c9-939a-d2ffc45a6d85",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl119",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sha3fe7676-3b79-44a6-a39c-975739f21854",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc145",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh573e990c-e16b-4a59-a97f-a6e655a483a9",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren171",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh11037c49-3f92-4378-9fcd-46c02e063376",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text55",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsha0b43aff-4e42-4c9f-945b-9a8d9d8d92ff",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "暗电流测试脚本（工程/品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj94",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "shf6280be4-494e-4ef7-814b-9fad72cbdfba",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl120",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh2244c170-bc58-4e89-b9e6-0f3368d87850",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc146",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh9a35ff98-36f1-43cb-80f0-df14a06d1ab7",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren172",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh9b8dae07-95d6-42bd-aa7a-16fd3f6ffe68",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "43px", "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "colWidth": "39px", "cellVisible": false}
  }, {
    "label": "静态文本",
    "fieldName": "text56",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh1184f382-2866-499c-81af-babebdad6706",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "外观检查：检查 弹片、屏蔽盖、BTB、LED、光感、SIM卡盖子是否有焊接不良，BTB、LED、光感等目视无法看清焊接情况的器件需要CCD检验；板边小料是否有损件。（品质确认）",
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "时间选择器(复制)",
    "fieldName": "qssj95",
    "type": "time-picker",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh1ce70ac3-2e76-48d8-bd6b-6e224daf5b3f",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "isRange": true,
      "rowNums": 1,
      "columnNums": 1,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "数据记录(复制)",
    "fieldName": "sjjl121",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh6912d07b-aa2a-438a-b8bb-cd764c244d06",
    "preps": {
      "clearable": true,
      "placeholder": "请输入数据记录(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "异常原因/对策(复制)",
    "fieldName": "ycyydc147",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh9e41c5fe-0355-44b7-adbe-a8e691403b14",
    "preps": {
      "clearable": true,
      "placeholder": "请输入异常原因/对策(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "确认人(复制)",
    "fieldName": "qurenren173",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "sh9643383c-72a4-4764-8a99-40cbbfd191bb",
    "preps": {
      "clearable": true,
      "placeholder": "请输入确认人(复制)",
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "colspan": 2,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "label": "静态文本",
    "fieldName": "text57",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idshb10e953e-146a-4982-ad79-93dd2ded16cb",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "判定结果",
      "appCompVisible": true,
      "labelFor": ["pandingjieguo"],
      "colWidth": "43px",
      "colspan": 1,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "label": "判定结果",
    "fieldName": "pandingjieguo",
    "type": "radio",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh4cce6e71-6f73-4f28-83c3-69c5fe064d80",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "hideLabel": true,
      "dataSource": "data",
      "analysisType": "func",
      "values": [{"name": "A:合格，可以生产", "value": "A", "xh": 1}, {
        "name": "B:不合格，暂停生产",
        "value": "B",
        "xh": 2
      }],
      "valuesDefaultValue": [{}],
      "colWidth": "39px",
      "colspan": 11,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "label": "静态文本",
    "fieldName": "text59",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idshb923795e-4c4c-46a0-b306-eba0cd78f0fa",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "备注",
      "labelFor": ["beizhu"],
      "appCompVisible": true,
      "colWidth": "43px",
      "colspan": 1,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "label": "多行文本框",
    "fieldName": "beizhu",
    "type": "textarea",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh07998ce6-e7cc-4679-96d7-b591e7324bae",
    "preps": {
      "clearable": true,
      "placeholder": "请输入多行文本框",
      "rules": [],
      "maxLength": 1000,
      "hideLabel": true,
      "colWidth": "39px",
      "colspan": 11,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }], [{
    "label": "静态文本",
    "fieldName": "text61",
    "type": "text",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idshe5eda564-e00b-4c46-9466-05e36799b453",
    "preps": {
      "clearable": true,
      "rules": [],
      "maxLength": 255,
      "staticData": true,
      "textContent": "会签",
      "colWidth": "43px",
      "colspan": 1,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "label": "生产部",
    "fieldName": "shengchanbu",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idshd383cded-414d-45ab-85db-247ce22fe5e4",
    "preps": {
      "clearable": true,
      "placeholder": "请输入生产部",
      "rules": [],
      "maxLength": 255,
      "colWidth": "39px",
      "colspan": 4,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "工程部",
    "fieldName": "gongchengbu",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idsh362bdd94-9a12-4720-beb1-d1ede38bd093",
    "preps": {
      "clearable": true,
      "placeholder": "请输入工程部",
      "rules": [],
      "maxLength": 255,
      "colspan": 3,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "label": "质量部",
    "fieldName": "zhiliangbu",
    "type": "input",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "id": "Idshcaf244ea-3342-48fa-acf4-b6da4a6e029b",
    "preps": {
      "clearable": true,
      "placeholder": "请输入质量部",
      "rules": [],
      "maxLength": 255,
      "colspan": 4,
      "rowspan": 1,
      "cellVisible": true
    }
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }, {
    "type": "empty",
    "viewVisible": true,
    "formVisible": false,
    "preps": {"colspan": 1, "rowspan": 1, "cellVisible": false}
  }]]
}];
onMounted(() => {
  // const result = analysisCompDatas(fields);
  // console.log(JSON.stringify(result.fieldList));
  dataItem.value["fieldList"] = fieldList;

});
</script>

<style lang="scss" scoped></style>
