<template>
  <el-scrollbar>
    {{formData}}
    <dytable-item :dataForm="formData" :item="dataItem"  :formInfo="{}" />
  </el-scrollbar>
</template>

<script lang="ts" setup>
import piniaInstance from "@/store";
import { useDesignFormStore } from "@/store/DesignForm";
import { onMounted, ref } from "vue";
import DytableItem from "@/components/comp/items/dytableItem.vue";
import { analysisCompDatas } from "@/api/form_utils";

let designForm = useDesignFormStore(piniaInstance);
const formData = ref<any>({
});
const dataItem = ref<any>({});
const fields = [
  {
    "id": "Idsh341da812-46d1-489f-ae94-7a261d97b623",
    "preps": {
      "id": "Idsh341da812-46d1-489f-ae94-7a261d97b623",
      "label": "动态表格",
      "itemNameLabel": "动态表格",
      "name": "dytable1",
      "elements": [
        {
          "id": "sh4cca87b6-1c7e-4d9f-adeb-46329027da5d",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh56088469-bbca-4637-9539-ac852a12d1b0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 9,
              "items": [
                {
                  "id": "Idsh6b32b7be-4b1b-4939-8c49-add30692e5c8",
                  "preps": {
                    "id": "Idsh6b32b7be-4b1b-4939-8c49-add30692e5c8",
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
                        "id": "sh5ffd89c6-9eaa-445f-b2f7-7f17790b129b",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "she4d85a76-2431-45e7-a17b-9a6e3d623e5e",
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
                    "textContent": "<p style=\"text-align: center;\"><span style=\"font-size: 19px;\">惠州朵唯通信设备有限公司 </span></p><p style=\"text-align: center;\"><span style=\"font-size: 19px;\">返工通知书</span></p>",
                    "placeholder": ""
                  },
                  "compType": "formItem",
                  "fieldName": "html2",
                  "itemType": "html",
                  "label": "Html组件",
                  "type": "html"
                }
              ],
              "cellVisible": true,
              "colHeight": "122px",
              "colWidth": "44px"
            },
            {
              "id": "shadfe72d0-d32c-4ab0-8843-f288a3b31d6b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh8e9fa501-828e-4080-9d46-4806ec2d576f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shc7c2544a-3351-4a2f-8f3c-69ffd3eec465",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sha858f110-8de9-405f-8212-4dcbe60670ad",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh442827c4-4faa-44f4-9b03-8369f43226d7",
              "colspan": 1,
              "rowspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh88ef2add-904d-46c2-a182-876680bd34cd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shf24a0bbe-502a-485d-8618-6f1f0e76e112",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh501635b8-bcc5-40af-a79c-989a26f7e39f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            }
          ]
        },
        {
          "id": "sh5621a35b-dc9c-4995-a83e-b1d453293f4d",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh01541a52-f586-4c49-a02f-623cc9e2d1e7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 7,
              "items": [
                {
                  "id": "Idshd80b6321-80b1-47bd-a46d-f52479ee4e85",
                  "preps": {
                    "id": "Idshd80b6321-80b1-47bd-a46d-f52479ee4e85",
                    "label": "类别",
                    "itemNameLabel": "单选框",
                    "name": "radio3",
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
                        "name": "FQC检验不良",
                        "value": "fqc_ng",
                        "xh": 1
                      },
                      {
                        "name": "OQC检验不良",
                        "value": "oqc_ng",
                        "xh": 2
                      },
                      {
                        "name": "客退品",
                        "value": "customer_return",
                        "xh": 3
                      },
                      {
                        "name": "其它",
                        "value": "other",
                        "xh": 4
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "radio3",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ],
              "cellVisible": true,
              "colWidth": "44px"
            },
            {
              "id": "sh123ec19d-4df3-4f01-8bca-13b93a1f5823",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh70b7887d-0928-4333-8cd0-7bdd43f6d767",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shec0387fe-9ea8-4e13-a3ce-e55379f52e6a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh8c1890cc-67fd-441e-9870-1f3f8a43a467",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh92ad1ae0-7be9-42f1-a082-03506f6db46b",
              "colspan": 1,
              "rowspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh50bc5966-ce90-496b-a6a2-8b665e17b949",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh37a19f18-2a1d-4f5c-afa8-79e54e420095",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idshe549e143-4c8f-49ce-b868-ceac692cf800",
                  "preps": {
                    "id": "Idshe549e143-4c8f-49ce-b868-ceac692cf800",
                    "label": "编号",
                    "itemNameLabel": "单行文本框",
                    "name": "formNo",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入编号",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "formNo",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ]
            },
            {
              "id": "sh4940a9ba-acde-4c1d-ac06-b872d7ed6d87",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            }
          ]
        },
        {
          "id": "shfcbec140-fecc-48b7-afeb-0ffa9e37374f",
          "colIndex": 1,
          "columns": [
            {
              "id": "sha25c87dd-a815-40d3-88fb-2427710bfd4d",
              "colIndex": 1,
              "rowspan": 5,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh4a6401d8-04c8-437f-aa1f-9f7cbae49b29",
                  "preps": {
                    "id": "Idsh4a6401d8-04c8-437f-aa1f-9f7cbae49b29",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text5",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "产品信息"
                  },
                  "compType": "formItem",
                  "fieldName": "text5",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true,
              "colWidth": "44px"
            },
            {
              "id": "shb9361f56-3370-497d-81e9-20aaff665328",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh409dd3f7-f62b-488f-94a7-6fedefa18d54",
                  "preps": {
                    "id": "Idsh409dd3f7-f62b-488f-94a7-6fedefa18d54",
                    "label": "机型",
                    "itemNameLabel": "单行文本框",
                    "name": "deviceModel",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入机型",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "deviceModel",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ]
            },
            {
              "id": "sha207669e-1e74-45d7-87d8-8bd720d09f9c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh97db1da6-fd04-48a1-b96d-eec993943458",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh5a77a00d-a7b9-46fb-b90b-d404bfcf439f",
                  "preps": {
                    "id": "Idsh5a77a00d-a7b9-46fb-b90b-d404bfcf439f",
                    "itemNameLabel": "单行文本框",
                    "name": "lineName",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入线别",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "线别"
                  },
                  "compType": "formItem",
                  "fieldName": "lineName",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ]
            },
            {
              "id": "sh9555509f-412a-47d8-8e66-708c413c5f42",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh41e5ec1f-8e19-4609-ba3c-5d6c7e8f6f14",
              "colspan": 2,
              "rowspan": 1,
              "items": [
                {
                  "id": "Idsh23bca35c-cb1a-495a-b6db-ad3cc6e5661e",
                  "preps": {
                    "id": "Idsh23bca35c-cb1a-495a-b6db-ad3cc6e5661e",
                    "label": "LOT NO.",
                    "itemNameLabel": "单行文本框",
                    "name": "logNo",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入LOT NO.",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "logNo",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh89df86dd-9efb-4448-86c2-73aeb4ad5c74",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh3aaf7946-3b34-4913-9adc-4bb9f241d8d0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idshd4b2f772-c914-4178-b77c-0b51a29da4b9",
                  "preps": {
                    "id": "Idshd4b2f772-c914-4178-b77c-0b51a29da4b9",
                    "itemNameLabel": "数字输入框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数量",
                    "step": 1,
                    "min": 0,
                    "precision": 0,
                    "rules": [],
                    "maxLength": 10,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "数量",
                    "name": "totalNums"
                  },
                  "compType": "formItem",
                  "fieldName": "totalNums",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ]
            },
            {
              "id": "sh082c3a51-312f-41d9-bc38-be71d09fc8d3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            }
          ]
        },
        {
          "id": "sh8fc71511-a510-45d0-8fb7-8813b7635c38",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh1ccbeb46-3d59-4773-96fd-c679ad34feb8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "44px"
            },
            {
              "id": "sh158d9d5c-e929-4f43-9eac-375b454feb6a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idshd0dd79b2-6a8e-4efc-b09e-d683b674f0a6",
                  "preps": {
                    "id": "Idshd0dd79b2-6a8e-4efc-b09e-d683b674f0a6",
                    "itemNameLabel": "单行文本框",
                    "name": "itemCode",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入物料编码",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "物料编码"
                  },
                  "compType": "formItem",
                  "fieldName": "itemCode",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ]
            },
            {
              "id": "shb3303bbc-7550-4001-924a-fd98acfd3cf6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shf6467f6d-5129-464e-b167-b9dede7b561b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh3dca2834-66d1-46c3-a851-7a0ff5d7774a",
                  "preps": {
                    "id": "Idsh3dca2834-66d1-46c3-a851-7a0ff5d7774a",
                    "label": "抽样数",
                    "itemNameLabel": "数字输入框",
                    "name": "simpleNums",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入抽样数",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "step": 1,
                    "min": 0,
                    "precision": 0
                  },
                  "compType": "formItem",
                  "fieldName": "simpleNums",
                  "itemType": "number",
                  "label": "单行文本框",
                  "type": "number"
                }
              ]
            },
            {
              "id": "sh9b610541-bf6c-44c0-90fa-e487e8178e99",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh4f253223-009c-435f-a766-df41a17b5213",
              "colspan": 2,
              "rowspan": 1,
              "items": [
                {
                  "id": "Idsh2edf0345-d080-4939-8842-efa79a9257a7",
                  "preps": {
                    "id": "Idsh2edf0345-d080-4939-8842-efa79a9257a7",
                    "label": "不良数",
                    "itemNameLabel": "数字输入框",
                    "name": "ngNums",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入不良数",
                    "step": 1,
                    "min": 0,
                    "precision": 0,
                    "rules": [],
                    "maxLength": 10,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "ngNums",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shadb926b7-6f70-4bb9-92c5-fab4ac23662e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh2c53c942-cb90-44f1-a650-eb1effb47205",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idshf5844e43-79f1-4d09-a615-45f1a79d3656",
                  "preps": {
                    "id": "Idshf5844e43-79f1-4d09-a615-45f1a79d3656",
                    "label": "不良率",
                    "itemNameLabel": "数字输入框",
                    "name": "ngPercent",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入不良率",
                    "step": 1,
                    "min": 0,
                    "precision": 0,
                    "rules": [],
                    "maxLength": 10,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "ngPercent",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ]
            },
            {
              "id": "sh16f22a04-ec3e-46ca-9798-3748fa5b836a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            }
          ]
        },
        {
          "id": "sh3c360109-6646-46cb-bf35-4e637fa21037",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh77832131-37b0-4c24-a350-e868f9bcb6fe",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "44px"
            },
            {
              "id": "sha845a55a-f7d0-4333-bb16-a79ca71bc2b9",
              "colIndex": 1,
              "rowspan": 3,
              "colspan": 6,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idshe5411034-f0ad-4d4e-9c5e-ffb2ffdc6d3e",
                  "preps": {
                    "id": "Idshe5411034-f0ad-4d4e-9c5e-ffb2ffdc6d3e",
                    "label": "不良内容",
                    "itemNameLabel": "多行文本框",
                    "name": "ngContent",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入不良内容",
                    "rules": [],
                    "maxLength": 1000,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "ngContent",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                },
                {
                  "id": "Idsh1aa6bdbd-ac95-4129-b652-6896c87a358d",
                  "preps": {
                    "id": "Idsh1aa6bdbd-ac95-4129-b652-6896c87a358d",
                    "label": "处置方式",
                    "itemNameLabel": "单选框",
                    "name": "operationType",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "placeholder": "",
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "挑选",
                        "value": "select",
                        "xh": 1
                      },
                      {
                        "name": "返修",
                        "value": "repair",
                        "xh": 2
                      },
                      {
                        "name": "特采",
                        "value": "special_select",
                        "xh": 3
                      },
                      {
                        "name": "其它",
                        "value": "other",
                        "xh": 4
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "operationType",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh821f379b-f95c-4732-8594-0b3e38d9ca05",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shfe68ac89-419a-43e5-90a4-115cd658fe41",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh0f14c462-0642-42dc-929b-9320960b0598",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh886fa65d-3897-4b79-a46b-59d7aaf9d121",
              "colspan": 1,
              "rowspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh71dc17dd-68e7-4537-9319-f2e2b5a43e48",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh5836c532-3899-4d39-9f36-8cbfde27b0e6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh39a29a1f-1351-4901-a200-345b19f78583",
                  "preps": {
                    "id": "Idsh39a29a1f-1351-4901-a200-345b19f78583",
                    "label": "开出人",
                    "itemNameLabel": "单行文本框",
                    "name": "operator",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入开出人",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "operator",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ]
            },
            {
              "id": "sh811f46ed-86cb-45fa-9143-3c2de50b32f0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            }
          ]
        },
        {
          "id": "shf9ae6db8-5938-4d29-91ba-0136d0589f72",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh510c3bbe-0434-44f2-b06a-b5bddb3bd15a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "44px"
            },
            {
              "id": "sh0b9539c7-6666-4cff-aa5b-b8a29c573b04",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh99abc2a9-f6b4-41d3-b227-3ed55b8be680",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shb42fc758-f734-482e-9efe-c652945bee98",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh1cfe6739-5976-4160-85f1-cc7c76bcef96",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sha4f45ace-e31a-47fa-8789-5be1cbedbe00",
              "colspan": 1,
              "rowspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh3d53a089-67eb-41f6-ba53-ef9b3fd85bca",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh0a40ecbb-7d20-48bd-9bfa-844a33efe301",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh2bb6fa55-998c-4aad-839c-d041333b3e3b",
                  "preps": {
                    "id": "Idsh2bb6fa55-998c-4aad-839c-d041333b3e3b",
                    "label": "审核",
                    "itemNameLabel": "单行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入审核",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "name": "auditor"
                  },
                  "compType": "formItem",
                  "fieldName": "auditor",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ]
            },
            {
              "id": "sh0e3d62ca-d4d1-4cea-86e4-5284731dc0c5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            }
          ]
        },
        {
          "id": "sh72109a6e-deb3-4d73-99fd-ecdc0a503e9f",
          "colIndex": 1,
          "columns": [
            {
              "id": "sha0fb6644-64af-42f6-ae3d-1b0dcac9fce5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "44px"
            },
            {
              "id": "shebd7a59c-123d-4b75-952d-f6c3f6bcf32a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh1d51cb39-097d-40d9-8a5d-8d7d9b2a223a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh19620983-9be1-4a29-acbe-4b2d2cff39de",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh791adfdb-a53e-4ba9-b6f4-a98682552b4c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shee32b3ad-5d2a-4553-87e0-e45e3e4e99de",
              "colspan": 1,
              "rowspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shdbe99f79-988a-49e2-b4e6-c9d765f61bd8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh0f5ccbc2-972f-4750-beca-d70eea12884a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh2b4a44f9-f0b7-4463-8acc-0716f5b3e177",
                  "preps": {
                    "id": "Idsh2b4a44f9-f0b7-4463-8acc-0716f5b3e177",
                    "label": "批准",
                    "itemNameLabel": "单行文本框",
                    "name": "agree",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入批准",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "agree",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ]
            },
            {
              "id": "sha5f0253b-75f9-4f1f-a2b9-dbbd67b02fde",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            }
          ]
        },
        {
          "id": "sh8f6c56c2-2f0f-4782-8cbb-b8cfa6372d31",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh7a59d4ce-30b5-4ba8-a2d6-eadec79ba1c3",
              "colIndex": 1,
              "rowspan": 2,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshf9f97c02-57fb-480b-8c4b-faaa32dd2395",
                  "preps": {
                    "id": "Idshf9f97c02-57fb-480b-8c4b-faaa32dd2395",
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
                    "elements": [
                      {
                        "id": "sh089ca567-5b51-40cd-9c4d-0f89d3aaa0ef",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "shd36190ea-34f2-46be-9a20-9afc556a40ac",
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
                    "textContent": "原因分析对策"
                  },
                  "compType": "formItem",
                  "fieldName": "text19",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true,
              "colWidth": "44px"
            },
            {
              "id": "sheec79d01-1523-4c1a-b550-ce89eef67c2f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh327d48da-80ca-4763-a8d2-35cf17f1bc60",
                  "preps": {
                    "id": "Idsh327d48da-80ca-4763-a8d2-35cf17f1bc60",
                    "label": "发生原因",
                    "itemNameLabel": "多行文本框",
                    "name": "eventReason",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入发生原因",
                    "rules": [],
                    "maxLength": 1000,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "labelPosition": "top"
                  },
                  "compType": "formItem",
                  "fieldName": "eventReason",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                },
                {
                  "id": "Idsh7ece20e8-de13-4c7f-9cce-7914d2630d45",
                  "preps": {
                    "id": "Idsh7ece20e8-de13-4c7f-9cce-7914d2630d45",
                    "itemNameLabel": "多行文本框",
                    "name": "outReason",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入流出原因",
                    "rules": [],
                    "maxLength": 1000,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "labelPosition": "top",
                    "label": "流出原因"
                  },
                  "compType": "formItem",
                  "fieldName": "outReason",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "colHeight": "204px"
            },
            {
              "id": "shdd23e79b-e069-4a03-90ad-c4ee922cab7f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh293c075e-aac1-4781-aa3b-357ae629ffe4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh498557ac-02e7-4d97-9b1a-cd52f0d17b3e",
              "colspan": 1,
              "rowspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shf34a5bea-92c0-4a3f-9c3a-c6f1058918b6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idshc6d2e194-4359-4719-94fb-8c8f3972ecf1",
                  "preps": {
                    "id": "Idshc6d2e194-4359-4719-94fb-8c8f3972ecf1",
                    "itemNameLabel": "多行文本框",
                    "name": "tempPolicy",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入临时对策",
                    "rules": [],
                    "maxLength": 1000,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "labelPosition": "top",
                    "label": "临时对策"
                  },
                  "compType": "formItem",
                  "fieldName": "tempPolicy",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                },
                {
                  "id": "Idsh41546a9c-7907-41f5-936d-61514ff08b36",
                  "preps": {
                    "id": "Idsh41546a9c-7907-41f5-936d-61514ff08b36",
                    "label": "长期对策",
                    "itemNameLabel": "多行文本框",
                    "name": "forEverPolicy",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入长期对策",
                    "rules": [],
                    "maxLength": 1000,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "labelPosition": "top"
                  },
                  "compType": "formItem",
                  "fieldName": "forEverPolicy",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            },
            {
              "id": "sh25cf4e8e-efda-4eb9-b991-f0adcd420860",
              "colspan": 1,
              "rowspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh06b401d9-f812-459d-ac0d-4273ca68f6be",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shefb0e612-2abc-41a1-86e4-8dd8141359c0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shb1cfd1d0-8372-4517-9d7b-a7837ed473e2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": []
            }
          ]
        },
        {
          "id": "shacef7dc4-4730-48f0-b61d-deb56e05fc08",
          "colIndex": 1,
          "columns": [
            {
              "id": "shfff993fe-6bae-4d56-ab34-a6efde130d9e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh0685a549-f6ac-4f6e-859e-e4d12837d852",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idshe0a446d4-e06c-4a76-89af-8cd2b5c9ff8e",
                  "preps": {
                    "id": "Idshe0a446d4-e06c-4a76-89af-8cd2b5c9ff8e",
                    "itemNameLabel": "单行文本框",
                    "name": "reasonConfirm",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "确认"
                  },
                  "compType": "formItem",
                  "fieldName": "reasonConfirm",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shbcc208b2-eefa-4043-84fb-5b71b4e6f59d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shdc7d13bb-8efa-4440-a9b3-46964a615c65",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh1246b710-3951-4d36-bfe0-6f55cc3d6e86",
                  "preps": {
                    "id": "Idsh1246b710-3951-4d36-bfe0-6f55cc3d6e86",
                    "itemNameLabel": "单行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入作成",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "作成",
                    "name": "reasonOperator"
                  },
                  "compType": "formItem",
                  "fieldName": "reasonOperator",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shb5a89a2b-04be-47c7-8fff-5af21306c155",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh5135e5e5-ff10-4a81-9070-4a6809d94c47",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idshdd81ef46-53ef-40be-a406-52503a3574bf",
                  "preps": {
                    "id": "Idshdd81ef46-53ef-40be-a406-52503a3574bf",
                    "itemNameLabel": "单行文本框",
                    "name": "policyConfirm",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入确认",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "确认"
                  },
                  "compType": "formItem",
                  "fieldName": "policyConfirm",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh6692a9f6-69a1-4c7c-9e57-b7cda81983da",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "she6133fcb-2a53-4844-a427-5604751004fc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh20ad9121-e95b-4869-8b29-3240031b9e2d",
                  "preps": {
                    "id": "Idsh20ad9121-e95b-4869-8b29-3240031b9e2d",
                    "itemNameLabel": "单行文本框",
                    "name": "policyOperator",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入作成",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "作成"
                  },
                  "compType": "formItem",
                  "fieldName": "policyOperator",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shb035befc-006d-42f3-b358-f65d94395d78",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shd9089af8-45bd-4a9d-ad7b-168b5fa524b8",
          "colIndex": 1,
          "columns": [
            {
              "id": "shc1f1deaa-4022-4892-a61a-fdacfa09045e",
              "colIndex": 1,
              "rowspan": 2,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshf461d46d-bc14-4144-8a8d-a49fd68b53c0",
                  "preps": {
                    "id": "Idshf461d46d-bc14-4144-8a8d-a49fd68b53c0",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text29",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "placeholder": "",
                    "staticData": true,
                    "textContent": "处置要求"
                  },
                  "compType": "formItem",
                  "fieldName": "text29",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh953be4d4-f1d2-4e3e-9949-b0fc5ebf9ef9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 8,
              "items": [
                {
                  "id": "Idshe524ec6a-f243-4672-9209-21418440fb8d",
                  "preps": {
                    "id": "Idshe524ec6a-f243-4672-9209-21418440fb8d",
                    "label": "1.返工/处置流程及注意事项（技术员制订",
                    "itemNameLabel": "多行文本框",
                    "name": "reworkNoticeItems",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入1.返工/处置流程及注意事项（技术员制订",
                    "rules": [],
                    "maxLength": 1000,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "labelPosition": "top"
                  },
                  "compType": "formItem",
                  "fieldName": "reworkNoticeItems",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                },
                {
                  "id": "Idshd1d730f5-775b-488e-a9fb-99eec32a84be",
                  "preps": {
                    "id": "Idshd1d730f5-775b-488e-a9fb-99eec32a84be",
                    "label": "2.返工注意事项",
                    "itemNameLabel": "多行文本框",
                    "name": "reworkNoticeItem2",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入2.返工注意事项",
                    "rules": [],
                    "maxLength": 1000,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "labelPosition": "top"
                  },
                  "compType": "formItem",
                  "fieldName": "reworkNoticeItem2",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true,
              "colHeight": "197px"
            },
            {
              "id": "sha2d6299f-205f-4e7b-8378-5f22a2eddd86",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sha1915dc2-9dcf-41f2-a3e1-91c850ca9b86",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh19702d9c-d694-4d39-a069-1c903a63441e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh8e36485e-6dbe-4d57-bc84-396829e5947d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh090943c7-0bdf-415d-9787-9fdd141acc8d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh406451c5-ff7a-4d20-ae2f-7984b3e7d388",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh4efd7ea3-ec27-4ee7-9a2c-3450cf2183c4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh9796968e-bc9d-4f4e-960e-c5d8db55d730",
          "colIndex": 1,
          "columns": [
            {
              "id": "shb8d1147a-c50e-4737-8878-e937ca68af30",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh4b8de36a-037a-4e69-bc72-1dc9c8a99033",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh411aedea-c213-47a8-aadf-96e80fbdc9de",
                  "preps": {
                    "id": "Idsh411aedea-c213-47a8-aadf-96e80fbdc9de",
                    "itemNameLabel": "单行文本框",
                    "name": "projectAudit",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入工程审批",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "工程审批"
                  },
                  "compType": "formItem",
                  "fieldName": "projectAudit",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh4a7991fe-e00c-4b2b-aab5-aa139746e9d7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh36afcdbf-ae39-447e-bae1-772d09cecdd6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sha72b2fa2-0d86-40e5-905d-0e4fd94be291",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idshe053ea52-e0f0-4085-907a-325ad6393480",
                  "preps": {
                    "id": "Idshe053ea52-e0f0-4085-907a-325ad6393480",
                    "itemNameLabel": "单行文本框",
                    "name": "quantityConfirm",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入品质确认",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "品质确认"
                  },
                  "compType": "formItem",
                  "fieldName": "quantityConfirm",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh6c8d5ba7-e085-4a54-bd01-ebbbd6d3c804",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh07a50ef4-5751-4f87-98f1-c7fd2181dae9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh7b8c1743-8b93-4b16-856a-bbdf47df3479",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh63cf29e6-0ac8-44b9-a42e-62d9a5ebc2fe",
                  "preps": {
                    "id": "Idsh63cf29e6-0ac8-44b9-a42e-62d9a5ebc2fe",
                    "itemNameLabel": "单行文本框",
                    "name": "requirementOperator",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入作成",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "作成"
                  },
                  "compType": "formItem",
                  "fieldName": "requirementOperator",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shc3b38e52-285a-45c9-ad54-68f11d411f65",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh77e8a629-df08-44a8-a721-9a083286637f",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh10f64cbe-8ca1-462d-bc72-1b5e0f5ea7c7",
              "colIndex": 1,
              "rowspan": 4,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh8bae4b34-98d8-4a60-90fb-f8d119f871a3",
                  "preps": {
                    "id": "Idsh8bae4b34-98d8-4a60-90fb-f8d119f871a3",
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
                    "elements": [
                      {
                        "id": "shdba25e57-22cb-4d13-879b-e32732ce445f",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh796b2037-2fed-4f5b-a10c-7789a87031fd",
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
                    "textContent": "处置结果"
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
              "id": "sh8f58ea78-f852-49fa-b32c-73d7573e3d64",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 6,
              "items": [
                {
                  "id": "Idshf0f14fc2-4d8f-4ca8-bec9-1000249faf80",
                  "preps": {
                    "id": "Idshf0f14fc2-4d8f-4ca8-bec9-1000249faf80",
                    "label": "处置时间",
                    "itemNameLabel": "日期选择器",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请选择处置时间",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "type": "datetimerange",
                    "name": "closeTime",
                    "startPlaceholder": "请选择开始日期",
                    "endPlaceholder": "请选择结束日期",
                    "valueFormat": "YYYY-MM-DD HH:mm:ss",
                  },
                  "compType": "formItem",
                  "fieldName": "closeTime",
                  "itemType": "datetime",
                  "label": "日期选择器",
                  "type": "datetimerange"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh183a31af-68a6-4486-8adc-4f66755333be",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh69872966-969a-4feb-ac48-46994bc0ba88",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sha793a721-9ef7-4694-bea2-4f6d62edef94",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh5415dd31-54b0-4418-8dff-ff9abe3ff67d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh013c35c2-82f7-46b3-968c-8268e8c6787a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shdc5b74c2-f2ed-4822-ae9f-1f2e2302fbc3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh26835f81-c2ff-4a1f-a27b-7791803b7b27",
                  "preps": {
                    "id": "Idsh26835f81-c2ff-4a1f-a27b-7791803b7b27",
                    "label": "处置部门",
                    "itemNameLabel": "单行文本框",
                    "name": "closeDeptName",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入线别和班次",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "closeDeptName",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh05b05c99-8913-4b03-9262-c0b1ed5bbb86",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh777b49e3-785f-4188-bc84-4fb0d60056e5",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh5d771a8d-ee3b-4e50-a3ef-3e4142c428cd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh04a80ed5-559e-4d52-bfd3-7c26e05e7969",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh2bde12e9-d426-4d9d-a9e0-2f78d05ebe39",
                  "preps": {
                    "id": "Idsh2bde12e9-d426-4d9d-a9e0-2f78d05ebe39",
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
                    "placeholder": "",
                    "startPlaceholder": "",
                    "endPlaceholder": "",
                    "disabledDate": "",
                    "staticData": true,
                    "textContent": "返工总数pcs"
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
              "id": "sh34bce7c3-f8f2-4e2d-b798-51049285a450",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshe59010ae-e7a4-4da8-b85a-19fb935344b4",
                  "preps": {
                    "id": "Idshe59010ae-e7a4-4da8-b85a-19fb935344b4",
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
                    "textContent": "良品pcs"
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
              "id": "sh2cfa63e8-1486-4673-b330-bb31bc286cc6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh284efc86-4bc3-469d-ad98-a910009546c8",
                  "preps": {
                    "id": "Idsh284efc86-4bc3-469d-ad98-a910009546c8",
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
                    "textContent": "不良品pcs"
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
              "id": "sh41e015ce-f609-40a7-a248-dbd3c50198d9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh873e1add-0a31-49d1-8a9e-c183c2faa45c",
                  "preps": {
                    "id": "Idsh873e1add-0a31-49d1-8a9e-c183c2faa45c",
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
                    "textContent": "不良率%"
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
              "id": "she24cd78d-8c52-4c2f-877c-0e9d5da18017",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh7ee64edb-4d99-4a50-8a08-65a4d483d0e9",
                  "preps": {
                    "id": "Idsh7ee64edb-4d99-4a50-8a08-65a4d483d0e9",
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
                    "textContent": "工时(小时)"
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
              "id": "shef9ad700-5af0-42ec-8efa-83e43cfee15b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshf25af82b-d269-4e47-9098-f12e5288899d",
                  "preps": {
                    "id": "Idshf25af82b-d269-4e47-9098-f12e5288899d",
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
                    "textContent": "人数"
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
              "id": "sh364657f6-7651-4cfd-87a3-30b827f51dae",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh08f6581b-fbcb-4bdb-9780-a6fb2906c581",
                  "preps": {
                    "id": "Idsh08f6581b-fbcb-4bdb-9780-a6fb2906c581",
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
                    "textContent": "班线"
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
              "id": "sh9f6bb0ee-a017-46d4-af21-1876a8c0ebcb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh722880a8-2648-4fc4-8295-ab650a9a8bb9",
                  "preps": {
                    "id": "Idsh722880a8-2648-4fc4-8295-ab650a9a8bb9",
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
                    "textContent": "选别不良内容及数量pcs",
                    "step": "",
                    "placeholder": ""
                  },
                  "compType": "formItem",
                  "fieldName": "text45",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            }
          ]
        },
        {
          "id": "shfddbaac1-20af-432a-a3ee-4e73309a9f67",
          "colIndex": 1,
          "columns": [
            {
              "id": "shd110360d-b380-4d7d-be51-60504c060618",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh974e3584-556a-49ed-9514-d4d44bacbaa9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh5e9f4567-b3c6-4da4-921d-90d26255f0c9",
                  "preps": {
                    "id": "Idsh5e9f4567-b3c6-4da4-921d-90d26255f0c9",
                    "label": "数字输入框",
                    "itemNameLabel": "数字输入框",
                    "name": "reworkTotals",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数字输入框",
                    "step": "1",
                    "min": 0,
                    "precision": 0,
                    "rules": [],
                    "maxLength": 10,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "elements": [
                      {
                        "id": "she1994dde-2b6b-44a5-9053-378f6e45343c",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "she4f850f6-11fe-44de-9250-5c7317061a3a",
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
                    "controlsPosition": "right"
                  },
                  "compType": "formItem",
                  "fieldName": "reworkTotals",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh3141251f-247b-4783-93e8-dcbcded57171",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh14cc8811-a296-4337-a799-2808db2113a1",
                  "preps": {
                    "id": "Idsh14cc8811-a296-4337-a799-2808db2113a1",
                    "label": "数字输入框",
                    "itemNameLabel": "数字输入框",
                    "name": "okNums",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数字输入框",
                    "step": "1",
                    "min": 0,
                    "precision": 0,
                    "rules": [],
                    "maxLength": 10,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "controlsPosition": "right"
                  },
                  "compType": "formItem",
                  "fieldName": "okNums",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh4d165462-1405-439b-bf6b-021fba347ca2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh1793eead-585e-453d-8bbd-fd99939ddb78",
                  "preps": {
                    "id": "Idsh1793eead-585e-453d-8bbd-fd99939ddb78",
                    "label": "数字输入框",
                    "itemNameLabel": "数字输入框",
                    "name": "ngNums",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数字输入框",
                    "step": 1,
                    "min": 0,
                    "precision": 0,
                    "rules": [],
                    "maxLength": 10,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "controlsPosition": "right"
                  },
                  "compType": "formItem",
                  "fieldName": "ngNums",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh474d25cf-4c17-4fd8-94cb-c268db4f415b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh07712163-a0a3-4160-b382-9456ac79a081",
                  "preps": {
                    "id": "Idsh07712163-a0a3-4160-b382-9456ac79a081",
                    "label": "数字输入框",
                    "itemNameLabel": "数字输入框",
                    "name": "ngPercent",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数字输入框",
                    "step": 1,
                    "min": 0,
                    "precision": 0,
                    "rules": [],
                    "maxLength": 10,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "controlsPosition": "right"
                  },
                  "compType": "formItem",
                  "fieldName": "ngPercent",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh7dc6b1e7-5dcb-4591-b1f3-018b620eed24",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh3cc32efb-592f-4adb-b362-b3b7d550ed29",
                  "preps": {
                    "id": "Idsh3cc32efb-592f-4adb-b362-b3b7d550ed29",
                    "label": "数字输入框",
                    "itemNameLabel": "数字输入框",
                    "name": "workHours",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数字输入框",
                    "step": 1,
                    "min": 0,
                    "precision": 0,
                    "rules": [],
                    "maxLength": 10,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "controlsPosition": "right"
                  },
                  "compType": "formItem",
                  "fieldName": "workHours",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh3b7a276b-fc71-4d54-aeaa-e2416b6019a4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh80b22587-278b-4897-bfdf-54b8c6ea3321",
                  "preps": {
                    "id": "Idsh80b22587-278b-4897-bfdf-54b8c6ea3321",
                    "label": "数字输入框",
                    "itemNameLabel": "数字输入框",
                    "name": "persons",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入数字输入框",
                    "step": 1,
                    "min": 0,
                    "precision": 0,
                    "rules": [],
                    "maxLength": 10,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "controlsPosition": "right"
                  },
                  "compType": "formItem",
                  "fieldName": "persons",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh6ca3deb1-f659-4ad1-9942-238723eab960",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh1bc7c814-05e7-4954-a879-951f9d7f5cd7",
                  "preps": {
                    "id": "Idsh1bc7c814-05e7-4954-a879-951f9d7f5cd7",
                    "label": "单行文本框",
                    "itemNameLabel": "单行文本框",
                    "name": "workLine",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入单行文本框",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "workLine",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shcab5a441-0a9c-4327-8ff6-ec4c4ae77f5f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshb9fce37d-9b67-4cb7-84ec-3b3d0d06ceda",
                  "preps": {
                    "id": "Idshb9fce37d-9b67-4cb7-84ec-3b3d0d06ceda",
                    "label": "单行文本框",
                    "itemNameLabel": "单行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入单行文本框",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "hideLabel": true,
                    "name": "ngContentAndNums"
                  },
                  "compType": "formItem",
                  "fieldName": "ngContentAndNums",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            }
          ]
        },
        {
          "id": "sh540562ab-b0b5-45fd-89cd-a4380fc54679",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh4bca0d98-9d94-4591-9e88-d108517f2ff4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh9fcea46b-8430-4625-acdc-cfe1f70137d1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idsh217d84c2-383f-4616-a92e-1d0bbe008b3a",
                  "preps": {
                    "id": "Idsh217d84c2-383f-4616-a92e-1d0bbe008b3a",
                    "itemNameLabel": "单行文本框",
                    "name": "resultOperator",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入作成",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "作成"
                  },
                  "compType": "formItem",
                  "fieldName": "resultOperator",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh05f7fb62-abe9-4ea3-a49f-f3798f2005bc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "she71a755b-10fe-424f-9536-3d1a1b3a5e22",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh6d361b19-42da-433d-a8e1-5f00d18510a7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh2e238187-4e92-4d3c-b588-3f5de0c619f0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idsh1d239c13-ac0d-4373-843e-8bf8c8997ae5",
                  "preps": {
                    "id": "Idsh1d239c13-ac0d-4373-843e-8bf8c8997ae5",
                    "itemNameLabel": "单行文本框",
                    "name": "resultAuditor",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入审核",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "审核"
                  },
                  "compType": "formItem",
                  "fieldName": "resultAuditor",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh329bf95b-a950-47be-9ae1-7707e2720296",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shc8360550-1706-4aa8-b8a3-c9ca7d40699c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh69305ce6-4712-4851-95b8-0099e74baffd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shd5d53034-03ab-4c39-a532-3af103e688f4",
          "colIndex": 1,
          "columns": [
            {
              "id": "shf099d96c-7b52-44a6-bc56-d1b1adcc4862",
              "colIndex": 1,
              "rowspan": 3,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh2cb86c7a-2087-4b8f-a95a-24fc1aa7567b",
                  "preps": {
                    "id": "Idsh2cb86c7a-2087-4b8f-a95a-24fc1aa7567b",
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
                    "placeholder": "",
                    "staticData": true,
                    "textContent": "检验结果"
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
              "id": "sh8263f8cf-b1cd-42b9-91d2-ab3b75e9f109",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh622b0843-2316-4bb8-b68e-1580477da9f2",
                  "preps": {
                    "id": "Idsh622b0843-2316-4bb8-b68e-1580477da9f2",
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
                    "textContent": "一次检验结果"
                  },
                  "compType": "formItem",
                  "fieldName": "text57",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh29df46f1-a6a5-4b03-971c-1bf18a9ced4a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh8fcaea0a-31d0-48de-9552-4df65a295ba1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh8de8040f-9f31-4f48-919e-f5a18e4fdd24",
                  "preps": {
                    "id": "Idsh8de8040f-9f31-4f48-919e-f5a18e4fdd24",
                    "label": "检验日期",
                    "itemNameLabel": "日期选择器",
                    "name": "firstCheckTime",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请选择检验日期",
                    "type": "datetime",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "firstCheckTime",
                  "itemType": "datetime",
                  "label": "日期选择器",
                  "type": "datetime"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh788437cf-2349-427d-a831-bd11659aeab7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh29dbccb4-13fe-4fda-8114-f8f40a824fd5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shfa4ea33f-a344-4f5f-9e0d-a42f4e8a2c2d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh2bc5d2f1-73c1-4f41-8a1a-7430c7225bae",
                  "preps": {
                    "id": "Idsh2bc5d2f1-73c1-4f41-8a1a-7430c7225bae",
                    "label": "检验结果",
                    "itemNameLabel": "单选框",
                    "name": "firstCheckResult",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "placeholder": "",
                    "disabledDate": "",
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "合格",
                        "value": "ok",
                        "xh": 1
                      },
                      {
                        "name": "不合格",
                        "value": "ng",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "firstCheckResult",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh79b36bcb-d1cd-40e9-bcd9-b36b32f17a92",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shd907ad71-dcbd-42cc-94bf-69e8acf683ab",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "shbd672ba7-cad3-4613-b71b-334e0245a0da",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh8b46b044-547f-41d5-b47e-28cf49dae68f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sha29ca26b-5721-4e63-b59b-345cc81cf97b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh3c24dbee-5c79-4e6e-a875-ad7ebafe1385",
                  "preps": {
                    "id": "Idsh3c24dbee-5c79-4e6e-a875-ad7ebafe1385",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text58",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "staticData": true,
                    "textContent": "二次检验结果"
                  },
                  "compType": "formItem",
                  "fieldName": "text58",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh356ec478-671b-400e-a385-999bd9e4dfa8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh7c8f46d5-5987-491d-8656-9850790b7e09",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idshc018cd12-6491-4c5e-8b19-09b2b90c7aa3",
                  "preps": {
                    "id": "Idshc018cd12-6491-4c5e-8b19-09b2b90c7aa3",
                    "itemNameLabel": "日期选择器",
                    "name": "secondCheckTime",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请选择检验日期",
                    "type": "datetime",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "检验日期"
                  },
                  "compType": "formItem",
                  "fieldName": "secondCheckTime",
                  "itemType": "datetime",
                  "label": "日期选择器",
                  "type": "datetime"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shbb8f673d-53e7-474e-b71b-2247c09fc351",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "she1b042b7-9755-42e9-843d-0b0f56e6c1a9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "shcfba7e71-fb33-49b8-95ec-2b2263e5a3b0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh2593fcfc-d7bf-4b67-a62a-baa696190424",
                  "preps": {
                    "id": "Idsh2593fcfc-d7bf-4b67-a62a-baa696190424",
                    "label": "检验结果",
                    "itemNameLabel": "单选框",
                    "name": "secondCheckResult",
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
                        "name": "合格",
                        "value": "ok",
                        "xh": 1
                      },
                      {
                        "name": "不合格",
                        "value": "ng",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "secondCheckResult",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "shd8976d06-f4ab-448c-b84a-58153ef7008c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh62cadce0-b5ce-41fd-b4a9-11d792573bf0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            }
          ]
        },
        {
          "id": "sh6fc7f091-d79e-4e1f-9b91-01ae65fe7b9f",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh52d0e756-cbb0-4142-b12f-b6b53c0ca2fd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh0fa11826-5edd-449d-9b39-8c50a7100a48",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idsh7b4cb969-38a3-409b-bc7a-14d96a98c1e0",
                  "preps": {
                    "id": "Idsh7b4cb969-38a3-409b-bc7a-14d96a98c1e0",
                    "label": "检验员",
                    "itemNameLabel": "单行文本框",
                    "name": "checkOperator",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入检验员",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "checkOperator",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "she30d1202-7d35-4376-b755-b1d275730bb9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh7ccbb57b-e373-46d8-b4a8-d237b87cde9c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh0fa61463-f5f6-4cc9-870f-7c4e93a79373",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh3788e253-6423-4b29-a77a-2bf304ea022e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idsh63102a79-848c-4b9b-afd3-93f7ffb4c5ed",
                  "preps": {
                    "id": "Idsh63102a79-848c-4b9b-afd3-93f7ffb4c5ed",
                    "label": "QE确认",
                    "itemNameLabel": "单行文本框",
                    "name": "qeConfirm",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入QE确认",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "qeConfirm",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true
            },
            {
              "id": "sh4fab1e05-71e6-4622-a2b8-728f594d1dfe",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "she082c2cf-3542-43f1-9bee-0faf65c8d327",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false
            },
            {
              "id": "sh1ef8716c-32ca-45cc-8d68-d7750c48b9ea",
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
      "rowNums": 18,
      "columnNums": 9,
      "placeholder": ""
    },
    "compType": "container",
    "fieldName": "dytable1",
    "itemType": "dytable",
    "rowNums": 1,
    "columnNums": 1,
    "type": "dytable"
  }
];
onMounted(() => {
  const result = analysisCompDatas(fields);
  dataItem.value = result.fieldList[0];
  console.log("xxx",result);
});
</script>

<style lang="scss" scoped></style>
