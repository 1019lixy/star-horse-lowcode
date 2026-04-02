<template>
  <el-scrollbar>
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
  test: "1-2-1",
});
const dataItem = ref<any>({});
const fields = [
  {
    "id": "Idsh78550cb2-d528-4381-951d-edf26bc95f08",
    "preps": {
      "id": "Idsh78550cb2-d528-4381-951d-edf26bc95f08",
      "label": "动态表格",
      "itemNameLabel": "动态表格",
      "name": "dytable1",
      "elements": [
        {
          "id": "sh94007b10-7bc2-4974-a9a2-438e97f9c4d5",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh849efea6-6317-4edc-a027-d67d465a6aa1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 12,
              "items": [
                {
                  "id": "Idshf2211a3d-179b-435c-9a99-1ae331823d6f",
                  "preps": {
                    "id": "Idshf2211a3d-179b-435c-9a99-1ae331823d6f",
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
                        "id": "sh368ad305-d0fa-4c43-9ec4-0a602f688139",
                        "colIndex": 1,
                        "columns": [
                          {
                            "id": "sh212d7823-5336-44ef-8a40-7d79f432fa3c",
                            "colIndex": 1,
                            "rowspan": 1,
                            "colspan": 1,
                            "items": []
                          }
                        ]
                      }
                    ],
                    "rowNums": 1,
                    "columnNums": 1,
                    "hideLabel": true,
                    "staticData": true,
                    "textContent": "<p style=\"text-align: center;\"><span style=\"font-size: 19px;\">惠州朵唯通信设备有限公司</span></p><p style=\"text-align: center;\"><span style=\"font-size: 19px;\">返工通知书</span></p>"
                  },
                  "compType": "formItem",
                  "fieldName": "html2",
                  "itemType": "html",
                  "label": "Html组件",
                  "type": "html"
                }
              ],
              "colHeight": "108px",
              "colWidth": "38px"
            }
          ]
        },
        {
          "id": "sh5daf5af0-85dd-4190-81b3-c7aa8b39d5c1",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh1a2a15d7-e403-473f-84d6-5179a3ea3fe7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 10,
              "items": [
                {
                  "id": "Idsh4b4f8028-eb1c-443e-b302-6762223de3c2",
                  "preps": {
                    "id": "Idsh4b4f8028-eb1c-443e-b302-6762223de3c2",
                    "label": "单选框",
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
                        "value": "cust_return",
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
              "colWidth": "38px"
            },
            {
              "id": "sh9217dfd4-ce7f-4cea-ade1-303306584ef9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh4b87a6a6-846f-4b90-8ee6-b16ce1c62d7a",
                  "preps": {
                    "id": "Idsh4b87a6a6-846f-4b90-8ee6-b16ce1c62d7a",
                    "itemNameLabel": "单行文本框",
                    "name": "input4",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入编号",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "编号"
                  },
                  "compType": "formItem",
                  "fieldName": "input4",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "86px"
            }
          ]
        },
        {
          "id": "shf7ad0217-16e9-4ce1-9a28-dd30eba9b53a",
          "colIndex": 1,
          "columns": [
            {
              "id": "shd6694c1d-f5f3-448a-8791-36d6bd64ea34",
              "colIndex": 1,
              "rowspan": 5,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh157e7cff-d89d-423e-8851-ca565789dda0",
                  "preps": {
                    "id": "Idsh157e7cff-d89d-423e-8851-ca565789dda0",
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
                    "hideLabel": true,
                    "staticData": true,
                    "textContent": "部品信息"
                  },
                  "compType": "formItem",
                  "fieldName": "text5",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "38px"
            },
            {
              "id": "sh83aa878d-db2e-414e-9491-76b402903089",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idshdbc85d34-ce4f-4bae-883f-9a3d2ca365fe",
                  "preps": {
                    "id": "Idshdbc85d34-ce4f-4bae-883f-9a3d2ca365fe",
                    "label": "机型",
                    "itemNameLabel": "单行文本框",
                    "name": "deviceType",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入机型",
                    "rules": [],
                    "maxLength": 100,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "deviceType",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "86px"
            },
            {
              "id": "sh379b37b4-c19f-4b01-b7f1-9ad55cee8453",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh4aa9f0cd-28c7-4afb-8dc2-a05a33cc13c4",
                  "preps": {
                    "id": "Idsh4aa9f0cd-28c7-4afb-8dc2-a05a33cc13c4",
                    "label": "线别",
                    "itemNameLabel": "单行文本框",
                    "name": "lineName",
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
                  "fieldName": "lineName",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "88px"
            },
            {
              "id": "sh725d7aa3-044a-438f-abd0-2ad3259eb0ec",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh06d9cabf-17d3-40bf-b5ec-e110b1f1cfe5",
                  "preps": {
                    "id": "Idsh06d9cabf-17d3-40bf-b5ec-e110b1f1cfe5",
                    "label": "LOT NO.",
                    "itemNameLabel": "单行文本框",
                    "name": "lotNo",
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
                  "fieldName": "lotNo",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "80px"
            },
            {
              "id": "sh0b0ddf06-d0a5-4595-a302-fa8465e1cd62",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh1d9b64bc-2678-407e-81e7-222aeac99db1",
                  "preps": {
                    "id": "Idsh1d9b64bc-2678-407e-81e7-222aeac99db1",
                    "itemNameLabel": "数字输入框",
                    "name": "nums",
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
                    "label": "数量"
                  },
                  "compType": "formItem",
                  "fieldName": "nums",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "colWidth": "74px"
            }
          ]
        },
        {
          "id": "sh523a5e02-533f-4980-8dd4-e58022a6c93c",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh2cab1f6d-a12b-43dd-8844-4a629998c045",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idsh5d393f28-7ac7-4c16-806c-9b0d3969b4ad",
                  "preps": {
                    "id": "Idsh5d393f28-7ac7-4c16-806c-9b0d3969b4ad",
                    "itemNameLabel": "单行文本框",
                    "name": "itemCode",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入物料编码",
                    "rules": [],
                    "maxLength": 100,
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
              ],
              "colWidth": "38px"
            },
            {
              "id": "shb7ce7e38-cb5f-4ed8-9ab9-4558cecba8a7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh21ae7666-1356-43ed-b5c4-fdd66407099b",
                  "preps": {
                    "id": "Idsh21ae7666-1356-43ed-b5c4-fdd66407099b",
                    "label": "抽样数",
                    "itemNameLabel": "数字输入框",
                    "name": "sampleNums",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入抽样数",
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
                  "fieldName": "sampleNums",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "colWidth": "86px"
            },
            {
              "id": "shd57f1ac2-d212-4785-bf1e-4f5ec01532b2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh64233040-1794-4222-974a-ececb1593b2b",
                  "preps": {
                    "id": "Idsh64233040-1794-4222-974a-ececb1593b2b",
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
                    "viewVisible": true,
                    "label": "不良数"
                  },
                  "compType": "formItem",
                  "fieldName": "ngNums",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "colWidth": "88px"
            },
            {
              "id": "sh95893c60-4818-4f4e-8655-5e795c3e0ec8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh3134de9c-2ad4-47a5-8bda-e3d3abd7230e",
                  "preps": {
                    "id": "Idsh3134de9c-2ad4-47a5-8bda-e3d3abd7230e",
                    "label": "不良率",
                    "itemNameLabel": "数字输入框",
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
                    "viewVisible": true,
                    "name": "ngPercent"
                  },
                  "compType": "formItem",
                  "fieldName": "ngPercent",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "colWidth": "80px"
            }
          ]
        },
        {
          "id": "sh8a86efa1-ba3e-49c2-94d3-b16783c1ed08",
          "colIndex": 1,
          "columns": [
            {
              "id": "shb1e366af-dc70-414e-9e77-29a66fc162e3",
              "colIndex": 1,
              "rowspan": 3,
              "colspan": 9,
              "items": [
                {
                  "id": "Idsh5869cb89-451d-437b-81eb-16dc6f5ceb93",
                  "preps": {
                    "id": "Idsh5869cb89-451d-437b-81eb-16dc6f5ceb93",
                    "itemNameLabel": "多行文本框",
                    "name": "ngContent",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入不良内容",
                    "rules": [],
                    "maxLength": 1000,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "不良内容",
                    "labelPosition": "top"
                  },
                  "compType": "formItem",
                  "fieldName": "ngContent",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                },
                {
                  "id": "Idsh785668a6-b63a-4bd3-a699-37780b1ebdf3",
                  "preps": {
                    "id": "Idsh785668a6-b63a-4bd3-a699-37780b1ebdf3",
                    "label": "处置方式",
                    "itemNameLabel": "单选框",
                    "name": "repairType",
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
                        "value": "special_search",
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
                  "fieldName": "repairType",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ],
              "colWidth": "38px"
            },
            {
              "id": "sh4f40ddaa-1060-46b8-93d3-6ccb8dd4eda8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idshb3d628af-774e-4ed2-a820-24d35963a805",
                  "preps": {
                    "id": "Idshb3d628af-774e-4ed2-a820-24d35963a805",
                    "label": "开出人",
                    "itemNameLabel": "静态文本",
                    "name": "operator",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "operator",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "86px"
            }
          ]
        },
        {
          "id": "sh96261944-e86d-45e0-a7f9-ed0eeec5d779",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh6ba3215c-9123-4b9e-ab2e-dcffeadec933",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh25fc4e2a-b4df-4f34-9a03-a97f4e97a57d",
                  "preps": {
                    "id": "Idsh25fc4e2a-b4df-4f34-9a03-a97f4e97a57d",
                    "label": "审核",
                    "itemNameLabel": "静态文本",
                    "name": "audit",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "audit",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "38px"
            }
          ]
        },
        {
          "id": "shf56f8828-1e67-4f7d-87e6-b728fa68f5e9",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh7f244229-380b-4141-93cd-73934fb5bca1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idshd81d3f0a-ab6f-4aab-bd93-bea38ea678e8",
                  "preps": {
                    "id": "Idshd81d3f0a-ab6f-4aab-bd93-bea38ea678e8",
                    "label": "批准",
                    "itemNameLabel": "静态文本",
                    "name": "agree",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "agree",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "38px"
            },
          ]
        },
        {
          "id": "sh8bd2852f-3b48-49bd-916d-c7d516404a8a",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh5935d870-1fe7-4ffc-a69b-364f7390effc",
              "colIndex": 1,
              "rowspan": 2,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh1a961faf-eec9-42b3-bf80-06c1bc0165e0",
                  "preps": {
                    "id": "Idsh1a961faf-eec9-42b3-bf80-06c1bc0165e0",
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
                    "hideLabel": true,
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
              "colWidth": "38px"
            },
            {
              "id": "sh473f0626-8d3e-48a4-ad1c-f79d02c281fa",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 6,
              "items": [
                {
                  "id": "Idsh2dd31f2c-5905-42c2-a0b1-ec3c92420578",
                  "preps": {
                    "id": "Idsh2dd31f2c-5905-42c2-a0b1-ec3c92420578",
                    "label": "发生原因",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入发生原因",
                    "rules": [],
                    "maxLength": 1000,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "name": "eventReason",
                    "labelPosition": "top"
                  },
                  "compType": "formItem",
                  "fieldName": "eventReason",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                },
                {
                  "id": "Idsh80e6c8f0-c237-428d-b562-8e3d93f73d10",
                  "preps": {
                    "id": "Idsh80e6c8f0-c237-428d-b562-8e3d93f73d10",
                    "itemNameLabel": "多行文本框",
                    "name": "outReason",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入流程原因",
                    "rules": [],
                    "maxLength": 1000,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "流程原因",
                    "labelPosition": "top"
                  },
                  "compType": "formItem",
                  "fieldName": "outReason",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "colWidth": "86px",
              "colHeight": "248.6666717529297px"
            },
            {
              "id": "sha750c307-5787-4fa1-a0eb-c95f76b24d7a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "items": [
                {
                  "id": "Idsh8b9ef3e9-7c78-4f84-ad64-631b2bf76341",
                  "preps": {
                    "id": "Idsh8b9ef3e9-7c78-4f84-ad64-631b2bf76341",
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
                    "label": "临时对策",
                    "labelPosition": "top"
                  },
                  "compType": "formItem",
                  "fieldName": "tempPolicy",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                },
                {
                  "id": "Idsh23c744ee-43d4-48b4-ac63-dc9dec2daf9f",
                  "preps": {
                    "id": "Idsh23c744ee-43d4-48b4-ac63-dc9dec2daf9f",
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
                    "label": "长期对策",
                    "labelPosition": "top"
                  },
                  "compType": "formItem",
                  "fieldName": "forEverPolicy",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "colWidth": "88px"
            }
          ]
        },

        {
          "id": "sh740c2056-cd9a-4152-998b-210ac77ae03c",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh0a980d2b-a1e0-4803-9b55-30def7a0d8c3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh87937c31-3d98-478a-b67c-42062ba9e65a",
                  "preps": {
                    "id": "Idsh87937c31-3d98-478a-b67c-42062ba9e65a",
                    "itemNameLabel": "单行文本框",
                    "name": "confirmReason",
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
                  "fieldName": "confirmReason",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "38px"
            },
            {
              "id": "sh44199b42-f9d4-49c4-b19b-222cc1ccf9bd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh4c457603-e722-45bd-b531-916e8218a207",
                  "preps": {
                    "id": "Idsh4c457603-e722-45bd-b531-916e8218a207",
                    "label": "作成",
                    "itemNameLabel": "单行文本框",
                    "name": "creatorReson",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入作成",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "creatorReson",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "86px"
            },
            {
              "id": "sh85e1cabc-634e-41b8-ad37-a43e72384c50",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idshb96434ac-46f0-4b9c-b8f8-6d34ba739f31",
                  "preps": {
                    "id": "Idshb96434ac-46f0-4b9c-b8f8-6d34ba739f31",
                    "itemNameLabel": "单行文本框",
                    "name": "confirmPolicy",
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
                  "fieldName": "confirmPolicy",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "88px"
            },
            {
              "id": "sh3106c473-26ae-46be-ae3c-5ddb5b439cdd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsha5647563-a4c8-44e6-a2c2-e823229d0616",
                  "preps": {
                    "id": "Idsha5647563-a4c8-44e6-a2c2-e823229d0616",
                    "itemNameLabel": "单行文本框",
                    "name": "creatorPolicy",
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
                  "fieldName": "creatorPolicy",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "80px"
            }
          ]
        },
        {
          "id": "shd5176dc0-d8e2-4442-8100-05b046b7b742",
          "colIndex": 1,
          "columns": [
            {
              "id": "shffc4c4fd-11ac-43b1-9013-ee1c65846c76",
              "colIndex": 1,
              "rowspan": 2,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh5aa72a0f-fdd3-4987-91b4-5c8a9ca2bd58",
                  "preps": {
                    "id": "Idsh5aa72a0f-fdd3-4987-91b4-5c8a9ca2bd58",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text30",
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
                  "fieldName": "text30",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "38px"
            },
            {
              "id": "shd92b3bfc-be91-4e5e-8af0-cccc57b91235",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 11,
              "items": [
                {
                  "id": "Idsh807b6fdf-7b08-4482-8c7e-c5510abee807",
                  "preps": {
                    "id": "Idsh807b6fdf-7b08-4482-8c7e-c5510abee807",
                    "label": "1.返工/处置流程及注意事项（技术员制订）",
                    "itemNameLabel": "多行文本框",
                    "name": "flowAndWarningItems",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入1.返工/处置流程及注意事项（技术员制订）",
                    "rules": [],
                    "maxLength": 1000,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "labelPosition": "top"
                  },
                  "compType": "formItem",
                  "fieldName": "flowAndWarningItems",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                },
                {
                  "id": "Idsh8d845084-5f88-4c5c-97b9-8335ad518477",
                  "preps": {
                    "id": "Idsh8d845084-5f88-4c5c-97b9-8335ad518477",
                    "label": "2.返工注意事项",
                    "itemNameLabel": "多行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入2.返工注意事项",
                    "rules": [],
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "name": "warningItems",
                    "maxLength": 1000,
                    "labelPosition": "top"
                  },
                  "compType": "formItem",
                  "fieldName": "warningItems",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "colWidth": "86px",
              "colHeight": "219px"
            }
          ]
        },
        {
          "id": "shcb6a381f-dc4d-409f-b90a-9472178383a0",
          "colIndex": 1,
          "columns": [
            {
              "id": "shbf0a0b89-d287-4979-ac9d-5e16c7803c9d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "items": [
                {
                  "id": "Idsh71523301-8f11-44f5-bdf5-f4c05ef28d97",
                  "preps": {
                    "id": "Idsh71523301-8f11-44f5-bdf5-f4c05ef28d97",
                    "label": "工程审批",
                    "itemNameLabel": "单行文本框",
                    "name": "projectAudit",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入工程审批",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "projectAudit",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "38px"
            },
            {
              "id": "sh8e5be248-3d0b-4743-85f8-aa85a11e8784",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh786b769f-baeb-4f47-b2df-4b7cf5876a5a",
                  "preps": {
                    "id": "Idsh786b769f-baeb-4f47-b2df-4b7cf5876a5a",
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
              "colWidth": "86px"
            },
            {
              "id": "sh9062692f-97bd-4be2-8561-c73ddd280f9f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh96064216-b444-411f-b1e0-0c496a112ca7",
                  "preps": {
                    "id": "Idsh96064216-b444-411f-b1e0-0c496a112ca7",
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
                    "name": "dispositionCreator"
                  },
                  "compType": "formItem",
                  "fieldName": "dispositionCreator",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "88px"
            }
          ]
        },
        {
          "id": "shdc63f525-d772-4180-9faa-a3a6e76614e7",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh88d162ec-7572-423a-bd3d-76e76110bd85",
              "colIndex": 1,
              "rowspan": 4,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh367a905a-4589-416b-bd2a-588bc0076119",
                  "preps": {
                    "id": "Idsh367a905a-4589-416b-bd2a-588bc0076119",
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
                    "textContent": "处置结果"
                  },
                  "compType": "formItem",
                  "fieldName": "text34",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "38px"
            },
            {
              "id": "she23af617-8445-4a94-af09-e9b031e5793e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 8,
              "items": [
                {
                  "id": "Idsh649c6083-19e0-45e2-96d8-45bc5c16284b",
                  "preps": {
                    "id": "Idsh649c6083-19e0-45e2-96d8-45bc5c16284b",
                    "label": "处置时间",
                    "itemNameLabel": "日期选择器",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请选择日期选择器",
                    "type": "datetimerange",
                    "disabledDate": "(e20) => t16.value.includes(e20.getDate().toString())",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "format": "YYYY-MM-DD HH:mm:ss",
                    "valueFormat": "YYYY-MM-DD HH:mm:ss",
                    "startPlaceholder": "请选择开始日期",
                    "endPlaceholder": "请选择结束日期",
                    "name": "operationTime"
                  },
                  "compType": "formItem",
                  "fieldName": "operationTime",
                  "itemType": "datetime",
                  "label": "日期选择器",
                  "type": "datetime"
                }
              ],
              "colWidth": "86px"
            },
            {
              "id": "sh41dec64e-d8ee-4105-8c23-3eb4bbea0084",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idshed7af836-106a-4f27-82f8-459e43b04bbf",
                  "preps": {
                    "id": "Idshed7af836-106a-4f27-82f8-459e43b04bbf",
                    "itemNameLabel": "单行文本框",
                    "name": "operationDepart",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入线别和班次",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "label": "处置部门"
                  },
                  "compType": "formItem",
                  "fieldName": "operationDepart",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "88px"
            }
          ]
        },
        {
          "id": "sh34add431-f905-468d-a553-87e699a9e3b9",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh8c527394-2747-4fab-a911-577079e8d4d8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshb109baa2-39fd-4ab3-9161-3ff75f0f457f",
                  "preps": {
                    "id": "Idshb109baa2-39fd-4ab3-9161-3ff75f0f457f",
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
                    "placeholder": "",
                    "staticData": true,
                    "textContent": "返工总数pcs"
                  },
                  "compType": "formItem",
                  "fieldName": "text37",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "38px"
            },
            {
              "id": "sh60edc34e-8437-4e43-a233-87f26f665343",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshda7669f3-a072-442c-8550-c03b3c1370fd",
                  "preps": {
                    "id": "Idshda7669f3-a072-442c-8550-c03b3c1370fd",
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
                    "textContent": "良品pcs"
                  },
                  "compType": "formItem",
                  "fieldName": "text38",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "86px"
            },
            {
              "id": "sha20ef2b6-8017-4ee7-8e8c-31a03a3283e1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh7556599e-1f9b-4870-9d76-75b6bea0ee8b",
                  "preps": {
                    "id": "Idsh7556599e-1f9b-4870-9d76-75b6bea0ee8b",
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
                    "textContent": "不良品pcs"
                  },
                  "compType": "formItem",
                  "fieldName": "text39",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "88px"
            },
            {
              "id": "sh2e805c1b-1271-4400-aa1a-be8afbded4d4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh074b8b72-dbab-4fd7-92c7-001c5bb67f0b",
                  "preps": {
                    "id": "Idsh074b8b72-dbab-4fd7-92c7-001c5bb67f0b",
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
                    "textContent": "不良率%"
                  },
                  "compType": "formItem",
                  "fieldName": "text40",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "80px"
            },
            {
              "id": "shb78c8b68-e4e5-4125-9045-ad8567137bcd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshcc918da7-8ef3-470d-a211-fe9677308de1",
                  "preps": {
                    "id": "Idshcc918da7-8ef3-470d-a211-fe9677308de1",
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
                    "textContent": "工时(小时)"
                  },
                  "compType": "formItem",
                  "fieldName": "text41",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "74px"
            },
            {
              "id": "shf31bf233-28da-4941-9d98-f5f9207d71bd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh7f67a204-cfe5-4e55-b547-5e44dc070c3b",
                  "preps": {
                    "id": "Idsh7f67a204-cfe5-4e55-b547-5e44dc070c3b",
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
                    "textContent": "人数"
                  },
                  "compType": "formItem",
                  "fieldName": "text42",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "79px"
            },
            {
              "id": "sh6da6d7ce-45fe-48a0-a079-e948f81d8210",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh2493bf80-c34f-4b8c-a3a2-32655cdb14db",
                  "preps": {
                    "id": "Idsh2493bf80-c34f-4b8c-a3a2-32655cdb14db",
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
                    "textContent": "班线"
                  },
                  "compType": "formItem",
                  "fieldName": "text43",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "62px"
            },
            {
              "id": "shabe352d2-f6ee-4f87-a022-e50166544199",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsha01bf413-9f00-4fbc-b5fe-1f0d2f12e32c",
                  "preps": {
                    "id": "Idsha01bf413-9f00-4fbc-b5fe-1f0d2f12e32c",
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
                    "placeholder": "",
                    "staticData": true,
                    "textContent": "选别不良内容及数量pcs  "
                  },
                  "compType": "formItem",
                  "fieldName": "text51",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "91px"
            }
          ]
        },
        {
          "id": "she868772e-9e3e-4990-90af-8f5ff9a55d45",
          "colIndex": 1,
          "columns": [
            {
              "id": "shc21677ff-daad-4337-a91c-e9a8cde63c80",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshbc17cc7b-47a0-45f2-8e74-95b877407670",
                  "preps": {
                    "id": "Idshbc17cc7b-47a0-45f2-8e74-95b877407670",
                    "label": "数字输入框",
                    "itemNameLabel": "数字输入框",
                    "name": "number44",
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
                  "fieldName": "number44",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "colWidth": "38px"
            },
            {
              "id": "sha007bc0f-f782-4639-ab05-677e814e905a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsha07578db-a031-4bf8-a809-66794aa28e6d",
                  "preps": {
                    "id": "Idsha07578db-a031-4bf8-a809-66794aa28e6d",
                    "label": "数字输入框",
                    "itemNameLabel": "数字输入框",
                    "name": "number45",
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
                  "fieldName": "number45",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "colWidth": "86px"
            },
            {
              "id": "sh949083cc-a061-4b4e-91e8-9cf19334e922",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh42f89c86-3cde-4a37-abc4-106931aee421",
                  "preps": {
                    "id": "Idsh42f89c86-3cde-4a37-abc4-106931aee421",
                    "label": "数字输入框",
                    "itemNameLabel": "数字输入框",
                    "name": "number46",
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
                  "fieldName": "number46",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "colWidth": "88px"
            },
            {
              "id": "shaba6c030-b359-4380-b393-2be5a690a4f7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh8278b95f-8285-49b7-9933-4701e0b06b3e",
                  "preps": {
                    "id": "Idsh8278b95f-8285-49b7-9933-4701e0b06b3e",
                    "label": "数字输入框",
                    "itemNameLabel": "数字输入框",
                    "name": "number47",
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
                  "fieldName": "number47",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "colWidth": "80px"
            },
            {
              "id": "sh3e577c98-5ac3-4641-9c7c-c40592e0d497",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshc48c5d61-3633-4bd3-98ff-1f4468f4058c",
                  "preps": {
                    "id": "Idshc48c5d61-3633-4bd3-98ff-1f4468f4058c",
                    "label": "数字输入框",
                    "itemNameLabel": "数字输入框",
                    "name": "number48",
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
                  "fieldName": "number48",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "colWidth": "74px"
            },
            {
              "id": "sha2cde87f-b107-4d9f-b1ba-7aefa6a94e1b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [
                {
                  "id": "Idshb32ffa87-00db-4f3a-b914-1993cffe4ed1",
                  "preps": {
                    "id": "Idshb32ffa87-00db-4f3a-b914-1993cffe4ed1",
                    "label": "数字输入框",
                    "itemNameLabel": "数字输入框",
                    "name": "number49",
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
                  "fieldName": "number49",
                  "itemType": "number",
                  "label": "数字输入框",
                  "type": "number"
                }
              ],
              "colWidth": "79px"
            },
            {
              "id": "sh7b0574b8-943e-4f16-86a9-833479123373",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idsh61e643ae-35bd-4706-864c-5fcc4ea2eab5",
                  "preps": {
                    "id": "Idsh61e643ae-35bd-4706-864c-5fcc4ea2eab5",
                    "label": "单行文本框",
                    "itemNameLabel": "单行文本框",
                    "name": "input50",
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
                  "fieldName": "input50",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "62px"
            },
            {
              "id": "sha1eeceaa-45e6-4f12-a146-45a59c360f7d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idshb09b62f8-d0a7-44ac-8022-2374b6be7f34",
                  "preps": {
                    "id": "Idshb09b62f8-d0a7-44ac-8022-2374b6be7f34",
                    "label": "单行文本框",
                    "itemNameLabel": "单行文本框",
                    "name": "input52",
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
                  "fieldName": "input52",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "91px"
            }
          ]
        },
        {
          "id": "sh050884c6-7be6-4e89-845c-57560452c2ef",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh1ef1792a-d5c1-40ed-abd4-afad90df27e0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 8,
              "items": [
                {
                  "id": "Idshe04e4f38-6f58-4f2b-a6f8-b70ce7df98df",
                  "preps": {
                    "id": "Idshe04e4f38-6f58-4f2b-a6f8-b70ce7df98df",
                    "itemNameLabel": "单行文本框",
                    "name": "resultCreator",
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
                  "fieldName": "resultCreator",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "38px"
            },
            {
              "id": "shbe0fb130-6a47-42de-ad21-93cfee9ab1ff",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh833d923e-df51-481e-a489-6f1f67a65b3c",
                  "preps": {
                    "id": "Idsh833d923e-df51-481e-a489-6f1f67a65b3c",
                    "itemNameLabel": "单行文本框",
                    "name": "resultAudit",
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
                  "fieldName": "resultAudit",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "91px"
            }
          ]
        },
        {
          "id": "sh5e659adb-0f2e-448a-9b97-758e7510b072",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh7485e02b-81f6-4efb-9d24-ec518c546c31",
              "colIndex": 1,
              "rowspan": 3,
              "colspan": 1,
              "items": [
                {
                  "id": "Idsh57a3cd8c-87ec-4ce0-8445-42007ab9dd53",
                  "preps": {
                    "id": "Idsh57a3cd8c-87ec-4ce0-8445-42007ab9dd53",
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
                    "placeholder": "",
                    "staticData": true,
                    "textContent": "检验结果"
                  },
                  "compType": "formItem",
                  "fieldName": "text55",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "38px"
            },
            {
              "id": "shae2c0215-1606-4465-8f0e-6bc8e8435f14",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "items": [
                {
                  "id": "Idshee58e36a-9483-4ef6-91c7-770d66dc21b3",
                  "preps": {
                    "id": "Idshee58e36a-9483-4ef6-91c7-770d66dc21b3",
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
                    "textContent": "一次检验结果"
                  },
                  "compType": "formItem",
                  "fieldName": "text56",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "86px"
            },
            {
              "id": "shb63778a2-90fb-40f8-b8e5-ac1a2191ea92",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "items": [
                {
                  "id": "Idshc282729f-e537-4acd-ae41-ddbf992771cf",
                  "preps": {
                    "id": "Idshc282729f-e537-4acd-ae41-ddbf992771cf",
                    "label": "检验日期",
                    "itemNameLabel": "日期选择器",
                    "name": "checkDateOne",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请选择检验日期",
                    "type": "datetime",
                    "disabledDate": "(e20) => t16.value.includes(e20.getDate().toString())",
                    "rules": [],
                    "maxLength": 255,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true
                  },
                  "compType": "formItem",
                  "fieldName": "checkDateOne",
                  "itemType": "datetime",
                  "label": "日期选择器",
                  "type": "datetime"
                }
              ],
              "colWidth": "80px"
            },
            {
              "id": "sh89b82ccd-3546-474d-a0b5-251ac039c10d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idsh7d0b68c7-c5bc-459c-91cd-85752ecd7745",
                  "preps": {
                    "id": "Idsh7d0b68c7-c5bc-459c-91cd-85752ecd7745",
                    "label": "检验结果",
                    "itemNameLabel": "单选框",
                    "name": "checkFirstResult",
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
                  "fieldName": "checkFirstResult",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ],
              "colWidth": "145px"
            }
          ]
        },
        {
          "columns": [
            {
              "id": "sha6050161-b959-4a94-b167-b2b7e3c3cdab",
              "colspan": 2,
              "rowspan": 1,
              "items": [
                {
                  "id": "Idsh077d7e9f-5e7c-43e3-befd-d10cc1c06d0e",
                  "preps": {
                    "id": "Idsh077d7e9f-5e7c-43e3-befd-d10cc1c06d0e",
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
                    "textContent": "二次检验结果"
                  },
                  "compType": "formItem",
                  "fieldName": "text57",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ]
            },
            {
              "id": "sh030d3810-bac5-4768-a041-c08b840ed9d9",
              "colspan": 5,
              "rowspan": 1,
              "items": [
                {
                  "id": "Idsh4fa0a092-829c-4f7a-b42c-5297f70978e9",
                  "preps": {
                    "id": "Idsh4fa0a092-829c-4f7a-b42c-5297f70978e9",
                    "itemNameLabel": "日期选择器",
                    "name": "checkDateTwo",
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
                  "fieldName": "checkDateTwo",
                  "itemType": "datetime",
                  "label": "日期选择器",
                  "type": "datetime"
                }
              ]
            },
            {
              "id": "sh8da65f19-28d5-410c-8fd9-5817ef75dd36",
              "colspan": 4,
              "rowspan": 1,
              "items": [
                {
                  "id": "Idsh2a9e2d5e-95b6-4e4a-824c-15df3d10f921",
                  "preps": {
                    "id": "Idsh2a9e2d5e-95b6-4e4a-824c-15df3d10f921",
                    "label": "检验结果",
                    "itemNameLabel": "单选框",
                    "name": "checkResultTwo",
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
                  "fieldName": "checkResultTwo",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            }
          ]
        },
        {
          "id": "sh07af3695-b36c-4a86-a641-a6f4d1ddaf8b",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh0f168357-d0b7-469e-93e7-5c52e0417459",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 7,
              "items": [
                {
                  "id": "Idsha9232f22-4432-4a3d-ba63-09449673a85c",
                  "preps": {
                    "id": "Idsha9232f22-4432-4a3d-ba63-09449673a85c",
                    "label": "检验员",
                    "itemNameLabel": "单行文本框",
                    "name": "inspector",
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
                  "fieldName": "inspector",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "86px"
            },
            {
              "id": "shf7c8fb49-44d0-47b4-9273-eddf6693041f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 4,
              "items": [
                {
                  "id": "Idsh9fc5579a-5f3b-49d4-a8d9-fbd4f09cba52",
                  "preps": {
                    "id": "Idsh9fc5579a-5f3b-49d4-a8d9-fbd4f09cba52",
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
              "colWidth": "145px"
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
onMounted(() => {
  const result = analysisCompDatas(fields);
  dataItem.value = result.fieldList[0];
  console.log("xxx",result);
});
</script>

<style lang="scss" scoped></style>
