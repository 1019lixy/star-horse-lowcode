<template>
  <el-scrollbar>
    <star-horse-data-view :dataForm="formData" :fieldList="dataItem" :formInfo="{}"/>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import piniaInstance from "@/store";
import {useDesignFormStore} from "@/store/DesignForm";
import {onMounted, ref} from "vue";
import {analysisCompDatas} from "@/api/form_utils";
import {StarHorseDataView} from "@/components/comp";

let designForm = useDesignFormStore(piniaInstance);
const formData = ref<any>({
  test: "1-2-1",
});
const dataItem = ref<any>({});
const fields = [{
  "id": "Idsh8e6b6691-6f32-432b-8d83-3e8614460389",
  "preps": {
    "id": "Idsh8e6b6691-6f32-432b-8d83-3e8614460389",
    "label": "动态表格",
    "itemNameLabel": "动态表格",
    "name": "dytable1",
    "elements": [
      {
        "id": "sha3d3beb8-790b-4fe4-941a-a2cdd0e85449",
        "colIndex": 1,
        "columns": [
          {
            "id": "shdb288f86-bede-4d0a-b634-27be9280f3bb",
            "colIndex": 1,
            "rowspan": 3,
            "colspan": 5,
            "items": [
              {
                "id": "Idsh197ec804-3f1f-4afd-9971-fd17319a81e0",
                "preps": {
                  "id": "Idsh197ec804-3f1f-4afd-9971-fd17319a81e0",
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
                      "id": "sh4e7f9873-960c-4fbe-bfda-febc1108da17",
                      "colIndex": 1,
                      "columns": [
                        {
                          "id": "she2d30714-d681-48e8-be06-c4e1093f765a",
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
                  "textContent": "<p style=\"text-align: center;\"><span style=\"font-size: 19px;\">惠州朵唯通信设备有限公司</span></p><p style=\"text-align: center;\"><span style=\"font-size: 19px;\">异常反馈单</span></p>"
                },
                "compType": "formItem",
                "fieldName": "html2",
                "itemType": "html",
                "label": "Html组件",
                "type": "html"
              }
            ],
            "cellVisible": true
          },
          {
            "id": "shc7e0f485-5f98-4a78-bbfe-a666bb539c2e",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "sh7a933260-3369-4bdf-82be-3718674e2030",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "sh3a0a7cbe-18c3-41ac-b891-178bee5f4baa",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "sh29a99eca-3da8-433a-8e8c-d88209e83375",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "172px"
          },
          {
            "id": "sh272263b2-64ee-49e0-8f03-081f4befe3ea",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh18795e21-bcbd-44e7-9b45-3d57737b91ca",
                "preps": {
                  "id": "Idsh18795e21-bcbd-44e7-9b45-3d57737b91ca",
                  "label": "静态文本",
                  "itemNameLabel": "静态文本",
                  "name": "text3",
                  "clearable": true,
                  "readonly": false,
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "staticData": true,
                  "textContent": "批准"
                },
                "compType": "formItem",
                "fieldName": "text3",
                "itemType": "text",
                "label": "静态文本",
                "type": "text"
              }
            ],
            "colWidth": "185px"
          },
          {
            "id": "sh623fdb70-b314-4ab8-8243-6004f382c6b8",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": true,
            "items": [
              {
                "id": "Idshc1d7bf99-1c2f-4ec2-94a3-137197276301",
                "preps": {
                  "id": "Idshc1d7bf99-1c2f-4ec2-94a3-137197276301",
                  "label": "静态文本",
                  "itemNameLabel": "静态文本",
                  "name": "text4",
                  "clearable": true,
                  "readonly": false,
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "staticData": true,
                  "textContent": "审核"
                },
                "compType": "formItem",
                "fieldName": "text4",
                "itemType": "text",
                "label": "静态文本",
                "type": "text"
              }
            ]
          },
          {
            "id": "sh78e007ac-fa43-4cf9-81e9-80e527dddcc1",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh6a11f58c-1779-4e81-9014-442c54236ca5",
                "preps": {
                  "id": "Idsh6a11f58c-1779-4e81-9014-442c54236ca5",
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
                  "textContent": "作成"
                },
                "compType": "formItem",
                "fieldName": "text5",
                "itemType": "text",
                "label": "静态文本",
                "type": "text"
              }
            ]
          }
        ]
      },
      {
        "id": "she082dce0-ceed-49d3-92e8-ad0bd92be377",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh5eb69288-c3df-4ef0-9242-6ec52e0ecb84",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false
          },
          {
            "id": "sh0b41f4fe-b1cd-439a-8188-f21af057b9d7",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "sh93fcd205-ced0-4372-9ef7-df4da5fd99d8",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "sh7c931d88-4db2-4f2e-9f90-4ec5a2c1fca3",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "sh947310d0-1d41-4d19-b30f-9edf3ab0abd0",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "172px"
          },
          {
            "id": "shac0fc43c-9515-4c7c-bc72-8e8befb155e9",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": true,
            "items": [
              {
                "id": "Idshdc09b85c-e7af-4326-a796-89dd8c2ebf84",
                "preps": {
                  "id": "Idshdc09b85c-e7af-4326-a796-89dd8c2ebf84",
                  "label": "单行文本框",
                  "itemNameLabel": "单行文本框",
                  "name": "pizhun",
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
                "fieldName": "pizhun",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ],
            "colWidth": "185px"
          },
          {
            "id": "sh0d1abe78-a0b2-48fe-a2ab-b6f429816a06",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": true,
            "items": [
              {
                "id": "Idshd1928ea5-97ef-439e-9ac4-692cd604db99",
                "preps": {
                  "id": "Idshd1928ea5-97ef-439e-9ac4-692cd604db99",
                  "label": "单行文本框",
                  "itemNameLabel": "单行文本框",
                  "name": "shenhe",
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
                "fieldName": "shenhe",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "sh7aa26678-4e58-4cde-8359-3ac1383a1544",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": true,
            "items": [
              {
                "id": "Idshfea92049-d199-465f-9a31-3497d3424203",
                "preps": {
                  "id": "Idshfea92049-d199-465f-9a31-3497d3424203",
                  "label": "单行文本框",
                  "itemNameLabel": "单行文本框",
                  "name": "zuocheng",
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
                "fieldName": "zuocheng",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          }
        ]
      },
      {
        "id": "shaba7621d-826f-441f-9750-4f5258ca67ef",
        "colIndex": 1,
        "columns": [
          {
            "id": "shfe7b5fcd-6fd5-4c15-9a70-2e480840c0db",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false
          },
          {
            "id": "sh5c19db94-7757-4caa-a69b-2fe01c7bfe0e",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "sh3b94e38d-6cef-4799-96b8-a560ec3632d3",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "sh7e9e2682-e41b-439d-a266-4e3bb649f211",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "shaf566f28-16df-43bb-ab5c-b175b24b4387",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "172px"
          },
          {
            "id": "sh5513989e-d01d-493f-919c-5ce15a262d75",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsha1f24d10-1703-463f-ba45-0d8dfbe6f95c",
                "preps": {
                  "id": "Idsha1f24d10-1703-463f-ba45-0d8dfbe6f95c",
                  "label": "日期选择器",
                  "itemNameLabel": "日期选择器",
                  "name": "pizhunshijian",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请选择日期选择器",
                  "type": "datetime",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "hideLabel": true
                },
                "compType": "formItem",
                "fieldName": "pizhunshijian",
                "itemType": "datetime",
                "label": "日期选择器",
                "type": "datetime"
              }
            ],
            "colWidth": "185px"
          },
          {
            "id": "sh1d77c0c8-7df2-46e8-addc-e6c8db504da0",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh467b8801-0c3b-4293-aada-7df4dc4c90b0",
                "preps": {
                  "id": "Idsh467b8801-0c3b-4293-aada-7df4dc4c90b0",
                  "label": "日期选择器",
                  "itemNameLabel": "日期选择器",
                  "name": "shenheshijian",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请选择日期选择器",
                  "type": "datetime",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "hideLabel": true
                },
                "compType": "formItem",
                "fieldName": "shenheshijian",
                "itemType": "datetime",
                "label": "日期选择器",
                "type": "datetime"
              }
            ]
          },
          {
            "id": "sh9a8987c4-1106-4ec6-b5a9-28b741a710f8",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh35ad4ebf-7fde-4b80-ab3a-5442e495d493",
                "preps": {
                  "id": "Idsh35ad4ebf-7fde-4b80-ab3a-5442e495d493",
                  "label": "日期选择器",
                  "itemNameLabel": "日期选择器",
                  "name": "zuochengshijian",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请选择日期选择器",
                  "type": "datetime",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "hideLabel": true
                },
                "compType": "formItem",
                "fieldName": "zuochengshijian",
                "itemType": "datetime",
                "label": "日期选择器",
                "type": "datetime"
              }
            ]
          }
        ]
      },
      {
        "id": "sh24548c33-eb3a-4dd4-9a42-482ed1a39f65",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh828e9be4-d111-4f6c-82a3-21a12d7865d9",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "items": [
              {
                "id": "Idsh454a068f-ef1f-422d-84b9-fcbe5d7710d4",
                "preps": {
                  "id": "Idsh454a068f-ef1f-422d-84b9-fcbe5d7710d4",
                  "label": "TO",
                  "itemNameLabel": "单行文本框",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入TO",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "name": "formTo"
                },
                "compType": "formItem",
                "fieldName": "formTo",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ],
            "cellVisible": true
          },
          {
            "id": "sh0a470bc8-3c23-4e47-9b8c-74c32b35710c",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "shb043dcff-f307-4ca0-9396-bde2709450f4",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 4,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsha18deb8e-30a7-4b6c-9bc8-7695a6860322",
                "preps": {
                  "id": "Idsha18deb8e-30a7-4b6c-9bc8-7695a6860322",
                  "label": "CC",
                  "itemNameLabel": "单行文本框",
                  "name": "chaosong",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入CC",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true
                },
                "compType": "formItem",
                "fieldName": "chaosong",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ],
            "colWidth": "186px"
          },
          {
            "id": "sheedb2b29-ac3c-44d5-b426-746b4b7713b7",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "sh353e8cc7-6ee1-4a1c-87df-9cc955d0899d",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "172px"
          },
          {
            "id": "shab30f31b-a4f0-4e97-b3d9-b3bab137ec43",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "sh43355758-0f59-4c58-999e-dba032b13c41",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsheab30e19-eef4-4cce-93f4-c5355d15ccf6",
                "preps": {
                  "id": "Idsheab30e19-eef4-4cce-93f4-c5355d15ccf6",
                  "itemNameLabel": "单行文本框",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入编号",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "编号",
                  "name": "bianhao"
                },
                "compType": "formItem",
                "fieldName": "bianhao",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "sh5faa898a-9c79-4037-bb4a-264cd445cc41",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          }
        ]
      },
      {
        "id": "shf469f1fc-5e41-4696-976d-59e91d5b2595",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh95fde466-3c98-482b-9617-8cf5a49ca10e",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "items": [
              {
                "id": "Idsh361a5101-3f66-43ce-844e-f817beef4e5a",
                "preps": {
                  "id": "Idsh361a5101-3f66-43ce-844e-f817beef4e5a",
                  "label": "机型",
                  "itemNameLabel": "单行文本框",
                  "name": "jixing",
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
                "fieldName": "jixing",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ],
            "cellVisible": true
          },
          {
            "id": "shf763f014-36a8-444a-867d-c849d23b619e",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "shc89eabf2-6ddf-42d1-afbc-a2c6d3abf689",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh1b8f16d6-98cc-4b7b-beb8-4aa9ff371a44",
                "preps": {
                  "id": "Idsh1b8f16d6-98cc-4b7b-beb8-4aa9ff371a44",
                  "itemNameLabel": "单行文本框",
                  "name": "shengchanpihao",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入生产批号",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "生产批号"
                },
                "compType": "formItem",
                "fieldName": "shengchanpihao",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ],
            "colWidth": "186px"
          },
          {
            "id": "sh821a62f7-a584-46e2-9d29-9eb7fab9b97c",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "she382caae-53b3-4193-bb40-978526db89c1",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh8bb371fe-713b-4279-890b-fb832bd5aa01",
                "preps": {
                  "id": "Idsh8bb371fe-713b-4279-890b-fb832bd5aa01",
                  "label": "批量",
                  "itemNameLabel": "单行文本框",
                  "name": "piliang",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入批量",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true
                },
                "compType": "formItem",
                "fieldName": "piliang",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ],
            "colWidth": "172px"
          },
          {
            "id": "sh117b2e3d-2bf3-4aa4-869d-ace763c9c34e",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "sh7802503a-0fab-4a79-b7ab-bf7e132e8470",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh686baee1-d03b-45c5-98d8-8312bf92eb8a",
                "preps": {
                  "id": "Idsh686baee1-d03b-45c5-98d8-8312bf92eb8a",
                  "itemNameLabel": "日期选择器",
                  "name": "fashengshijian",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入发生时间",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "发生时间",
                  "type": "datetime"
                },
                "compType": "formItem",
                "fieldName": "fashengshijian",
                "itemType": "datetime",
                "label": "单行文本框",
                "type": "datetime"
              }
            ]
          },
          {
            "id": "sh6babbacc-d725-4e67-9954-2c7b23329008",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          }
        ]
      },
      {
        "id": "sh27993272-8ddb-47ca-a125-cc31c52bc021",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh041b920a-8e1b-40ca-be27-c7cd0759eba3",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "items": [
              {
                "id": "Idsh9bc552ab-1c2f-4464-bee8-9bfe27403dee",
                "preps": {
                  "id": "Idsh9bc552ab-1c2f-4464-bee8-9bfe27403dee",
                  "itemNameLabel": "数字输入框",
                  "name": "tourushu",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入投入数",
                  "step": 1,
                  "min": 0,
                  "precision": 0,
                  "rules": [],
                  "maxLength": 10,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "投入数"
                },
                "compType": "formItem",
                "fieldName": "tourushu",
                "itemType": "number",
                "label": "数字输入框",
                "type": "number"
              }
            ],
            "cellVisible": true
          },
          {
            "id": "sh683180c3-f982-4a25-99e7-539622d295f2",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "sh1776fa92-fbe5-439c-890b-57041f83a636",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idshaa73789d-c3fc-406c-a6d0-845abadaeb28",
                "preps": {
                  "id": "Idshaa73789d-c3fc-406c-a6d0-845abadaeb28",
                  "label": "不良数",
                  "itemNameLabel": "数字输入框",
                  "name": "buliangshu",
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
                "fieldName": "buliangshu",
                "itemType": "number",
                "label": "数字输入框",
                "type": "number"
              }
            ],
            "colWidth": "186px"
          },
          {
            "id": "sh7cc5abbb-12c2-494e-9955-096f3a787df1",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "sh207680a2-2a3b-471e-84da-55d82b3c122a",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idshfff326d9-04b3-473f-9b8d-40dff3e8a005",
                "preps": {
                  "id": "Idshfff326d9-04b3-473f-9b8d-40dff3e8a005",
                  "itemNameLabel": "数字输入框",
                  "name": "bulianglv",
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
                  "label": "不良率"
                },
                "compType": "formItem",
                "fieldName": "bulianglv",
                "itemType": "number",
                "label": "数字输入框",
                "type": "number"
              }
            ],
            "colWidth": "172px"
          },
          {
            "id": "sh22ece42f-810b-4807-922e-74ec1458eb79",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "sh7ae3cc32-3cba-4e10-82f9-6edae73fd632",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh26a933ab-59c1-4e70-85ce-2aea9a392c46",
                "preps": {
                  "id": "Idsh26a933ab-59c1-4e70-85ce-2aea9a392c46",
                  "label": "反馈时间",
                  "itemNameLabel": "日期选择器",
                  "name": "fankuishijian",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请选择反馈时间",
                  "type": "datetime",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true
                },
                "compType": "formItem",
                "fieldName": "fankuishijian",
                "itemType": "datetime",
                "label": "日期选择器",
                "type": "datetime"
              }
            ]
          },
          {
            "id": "sh6714b888-c066-479c-a4f1-1df4379ca055",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          }
        ]
      },
      {
        "id": "shf7e93c59-c2b1-4484-bbd7-d319ff3789c0",
        "colIndex": 1,
        "columns": [
          {
            "id": "shebddaed2-9e1b-4283-874c-fab336375418",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 6,
            "items": [
              {
                "id": "Idsh2f50ee3f-9ca9-49e3-9d16-278e9780ea23",
                "preps": {
                  "id": "Idsh2f50ee3f-9ca9-49e3-9d16-278e9780ea23",
                  "label": "异常内容描述",
                  "itemNameLabel": "多行文本框",
                  "name": "ycnrms",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入异常内容描述",
                  "rules": [],
                  "maxLength": 1000,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "labelPosition": "top"
                },
                "compType": "formItem",
                "fieldName": "ycnrms",
                "itemType": "textarea",
                "label": "多行文本框",
                "type": "textarea"
              }
            ],
            "cellVisible": true,
            "colHeight": "127px"
          },
          {
            "id": "sh2ab8a344-756b-4c44-b0d9-cf1a06aaab6a",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colHeight": "175px"
          },
          {
            "id": "sh794ff7dc-655a-4ed2-b765-3166980aa20e",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "shd0543201-7e7b-49e2-931e-1e0eb664852c",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "she64847d9-1b73-4268-9aa7-3166c89ddaba",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "172px"
          },
          {
            "id": "sh42376ceb-9bbe-4dbc-8eb1-2fb548e70319",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "sh86605876-ebf5-43cf-a6ad-5718d93f9505",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": true,
            "items": [
              {
                "id": "Idshab1be8da-f314-4070-8958-dfd16cf606a4",
                "preps": {
                  "id": "Idshab1be8da-f314-4070-8958-dfd16cf606a4",
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
                  "placeholder": "",
                  "staticData": true,
                  "textContent": "开出部门"
                },
                "compType": "formItem",
                "fieldName": "text24",
                "itemType": "text",
                "label": "静态文本",
                "type": "text"
              }
            ]
          },
          {
            "id": "sh31195e04-1718-41cb-9a13-cd2ec14856e8",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh747f2743-61ea-4fe2-9a74-daa676b53df9",
                "preps": {
                  "id": "Idsh747f2743-61ea-4fe2-9a74-daa676b53df9",
                  "label": "单选框",
                  "itemNameLabel": "单选框",
                  "name": "kaichubumen",
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
                      "name": "IPQC",
                      "value": "ipqc",
                      "xh": 1
                    },
                    {
                      "name": "FQC",
                      "value": "fqc",
                      "xh": 2
                    },
                    {
                      "name": "工程",
                      "value": "gongcheng",
                      "xh": 3
                    },
                    {
                      "name": "产线",
                      "value": "chanxian",
                      "xh": 4
                    },
                    {
                      "name": "其它",
                      "value": "qita",
                      "xh": 5
                    }
                  ],
                  "valuesDefaultValue": [
                    {}
                  ]
                },
                "compType": "formItem",
                "fieldName": "kaichubumen",
                "itemType": "radio",
                "label": "单选框",
                "type": "radio"
              }
            ]
          }
        ]
      },
      {
        "id": "sh2517487a-e38d-4d19-b52e-17aa9eb1c8d2",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh23b6a0c8-c148-401c-ab9e-23394df58d95",
            "colIndex": 1,
            "rowspan": 3,
            "colspan": 6,
            "items": [
              {
                "id": "Idsh52d0e7f7-1c03-45cb-95bb-01f102af62f0",
                "preps": {
                  "id": "Idsh52d0e7f7-1c03-45cb-95bb-01f102af62f0",
                  "label": "根本原因分析（工程填写）",
                  "itemNameLabel": "多行文本框",
                  "name": "gbyyfxgctx",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入根本原因分析（工程填写）",
                  "rules": [],
                  "maxLength": 1000,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "labelPosition": "top"
                },
                "compType": "formItem",
                "fieldName": "gbyyfxgctx",
                "itemType": "textarea",
                "label": "多行文本框",
                "type": "textarea"
              },
              {
                "id": "Idsh0dbc8c98-b7d3-4e01-90f9-fe571acfbafb",
                "preps": {
                  "id": "Idsh0dbc8c98-b7d3-4e01-90f9-fe571acfbafb",
                  "label": "责任判定",
                  "itemNameLabel": "单选框",
                  "name": "zherenpanding",
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
                      "name": "设计不良",
                      "value": "sjbl",
                      "xh": 1
                    },
                    {
                      "name": "物料不良",
                      "value": "wlbl",
                      "xh": 2
                    },
                    {
                      "name": "制程不良",
                      "value": "zcbl",
                      "xh": 3
                    },
                    {
                      "name": "其它",
                      "value": "qita",
                      "xh": 4
                    }
                  ],
                  "valuesDefaultValue": [
                    {}
                  ]
                },
                "compType": "formItem",
                "fieldName": "zherenpanding",
                "itemType": "radio",
                "label": "单选框",
                "type": "radio"
              }
            ],
            "cellVisible": true,
            "colHeight": "171px"
          },
          {
            "id": "sh668f8c13-c792-4d9c-99df-920fa78d32bb",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "shf91186c9-ba49-4bc5-a2aa-4ab579d6925c",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "sh8ec832fc-aa46-41f2-9f2c-724b1d577a1f",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "sh1253077b-1150-426a-9972-8161beb8bf02",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "172px"
          },
          {
            "id": "sha46ec3f1-f24e-4eab-bb26-bafa185e4f05",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "sha9a88708-4bba-4e88-9788-934624e31f5d",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idshb7f55085-8729-4c68-92e9-7bc5bc380eae",
                "preps": {
                  "id": "Idshb7f55085-8729-4c68-92e9-7bc5bc380eae",
                  "label": "分析人",
                  "itemNameLabel": "单行文本框",
                  "name": "fenxiren",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入分析人",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true
                },
                "compType": "formItem",
                "fieldName": "fenxiren",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "sh3820890f-eb8e-4185-8f8e-0b86ebdcce6f",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          }
        ]
      },
      {
        "id": "shdec8f71c-deaa-4233-8a4a-12205eed82ad",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh8b7418bf-af2d-486e-a397-3ce4bde1d683",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false
          },
          {
            "id": "shf224a7d3-2251-48a9-9f79-e1526b366426",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "shd2561a4a-fb4c-4d6d-a1b5-5cdec59d246b",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "sh06ffb16f-1cf8-45ab-be9b-7293139e9982",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "sha69fe1cf-4739-4dfa-ad21-365d24d444f9",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "172px"
          },
          {
            "id": "sh5a964a88-417b-4646-9e93-8100875a7c0b",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "sh1a647fd5-536b-4255-9d3e-262e02b8e106",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idshba0ce742-cf0f-4d61-8b8c-8576c88f3956",
                "preps": {
                  "id": "Idshba0ce742-cf0f-4d61-8b8c-8576c88f3956",
                  "label": "QE确认",
                  "itemNameLabel": "单行文本框",
                  "name": "qequeren",
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
                "fieldName": "qequeren",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "sh27dfdf22-bad5-4c85-b69e-f039ade668af",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          }
        ]
      },
      {
        "id": "sha93e5a22-84f0-4770-94cb-32fdc72d5a4f",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh9e472243-dfd3-4292-9d56-2d98eb90f976",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false
          },
          {
            "id": "sh0e306f16-caa0-491c-8fcb-47e644ba468c",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "sh133a94d2-e77f-4202-abfb-67d602ba2b6e",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "sh62f55c02-1edf-4d46-bdc4-8b81f9d7383f",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "sh633c06c3-b905-46f2-b4b5-b6751e638dce",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "172px"
          },
          {
            "id": "sh6b877e82-7bba-445b-b843-e124a1288d00",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "sh49253a3a-9b4d-477c-b2c9-a2e797102ad0",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh11501c13-abc1-4881-9a55-82c80bff3519",
                "preps": {
                  "id": "Idsh11501c13-abc1-4881-9a55-82c80bff3519",
                  "label": "工程经理",
                  "itemNameLabel": "单行文本框",
                  "name": "gongchengjingli",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入工程经理",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true
                },
                "compType": "formItem",
                "fieldName": "gongchengjingli",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "sh49b08e2b-2452-4ef2-b65e-1ef17300aaca",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          }
        ]
      },
      {
        "id": "shc417b1b7-cde4-411e-be90-9a85f7a871be",
        "colIndex": 1,
        "columns": [
          {
            "id": "shf1f22cd1-a43d-48c4-9e1a-5ddde5ff51db",
            "colIndex": 1,
            "rowspan": 2,
            "colspan": 6,
            "items": [
              {
                "id": "Idsh08e3b3c0-6422-40d1-b07f-ea0d615d4bc3",
                "preps": {
                  "id": "Idsh08e3b3c0-6422-40d1-b07f-ea0d615d4bc3",
                  "label": "临时措施（责任部门填写）",
                  "itemNameLabel": "多行文本框",
                  "name": "lscszrbmtx",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入临时措施（责任部门填写）",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "labelPosition": "top"
                },
                "compType": "formItem",
                "fieldName": "lscszrbmtx",
                "itemType": "textarea",
                "label": "多行文本框",
                "type": "textarea"
              }
            ],
            "cellVisible": true,
            "colHeight": "125px"
          },
          {
            "id": "sha07ede78-1db2-4d55-bff1-7ce92ba46a45",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "shbeec7cf3-6133-42d1-a0bf-cbc24e3814b8",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "sha29bc3b9-86a3-41e8-9d5c-357b9ee622dc",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "shb5e6e210-89cb-4fa0-a4fe-c22bbed8a974",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "172px"
          },
          {
            "id": "she135b82a-1a4f-42cf-82a5-ce47bf5814c2",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "sh956c7896-4cbc-4a84-ac6f-867f41c1309d",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idshd7ace679-1f85-4143-9d8d-90603569f2cf",
                "preps": {
                  "id": "Idshd7ace679-1f85-4143-9d8d-90603569f2cf",
                  "label": "制订人",
                  "itemNameLabel": "单行文本框",
                  "name": "zhidingren",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入制订人",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true
                },
                "compType": "formItem",
                "fieldName": "zhidingren",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "sh248ee88e-74c8-440f-9116-9c873100baae",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          }
        ]
      },
      {
        "id": "shc0bedc35-3dc0-4c0e-9bc3-8a8fb6d326a7",
        "colIndex": 1,
        "columns": [
          {
            "id": "she3a78973-404b-4571-b808-70ebee92b36e",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false
          },
          {
            "id": "sh5ef1c601-603b-4530-b988-6b397fae57e9",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "sh448e381d-9022-4492-b232-a75c791a8220",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "sh681332af-d3c9-4312-b84e-38354b86dbf1",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "sh78d1e926-c6b8-44f7-9457-05de399144cd",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "172px"
          },
          {
            "id": "shc2ffa945-11d9-44e9-a07b-a202aa39273d",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "sh932221c7-eb17-4722-a8c4-c2b72fe4807a",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh1723dc19-e0d3-4312-8d22-a5d60505cead",
                "preps": {
                  "id": "Idsh1723dc19-e0d3-4312-8d22-a5d60505cead",
                  "itemNameLabel": "日期选择器",
                  "name": "shidingshijian",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入制定时间",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "制定时间",
                  "type": "datetime"
                },
                "compType": "formItem",
                "fieldName": "shidingshijian",
                "itemType": "datetime",
                "label": "单行文本框",
                "type": "datetime"
              }
            ]
          },
          {
            "id": "sh125efa33-85c4-452d-8ff3-20077b562165",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          }
        ]
      },
      {
        "id": "sh88437ddd-330b-44ba-b653-d50f459f1d50",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh9679151e-ecfa-47d1-a3b5-5145605290fb",
            "colIndex": 1,
            "rowspan": 2,
            "colspan": 1,
            "items": [
              {
                "id": "Idsh65e6d328-d099-4138-82be-309c594144fb",
                "preps": {
                  "id": "Idsh65e6d328-d099-4138-82be-309c594144fb",
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
                  "textContent": "不良排查"
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
            "id": "shccb2fe0d-3b8f-42a5-80a9-e9b6939f5138",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh3a09a128-facd-4e3a-8cc9-69dcbc8a3d6b",
                "preps": {
                  "id": "Idsh3a09a128-facd-4e3a-8cc9-69dcbc8a3d6b",
                  "label": "1.原材料",
                  "itemNameLabel": "单选框",
                  "name": "yuancailiao",
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
                      "name": "需要",
                      "value": "xuyao",
                      "xh": 1
                    },
                    {
                      "name": "不需要",
                      "value": "buxuyao",
                      "xh": 2
                    }
                  ],
                  "valuesDefaultValue": [
                    {}
                  ]
                },
                "compType": "formItem",
                "fieldName": "yuancailiao",
                "itemType": "radio",
                "label": "单选框",
                "type": "radio"
              }
            ]
          },
          {
            "id": "sh129eeb8f-eefd-46a3-9e06-57e68d4df8a7",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "sh23b4c925-dd12-4e4a-a000-a28811654d06",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": true,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "shfeb9c678-5b89-4706-b05a-4a80cdc5fbda",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh344c9455-7660-471f-8733-244d5cde96e7",
                "preps": {
                  "id": "Idsh344c9455-7660-471f-8733-244d5cde96e7",
                  "label": "2.在制半成品",
                  "itemNameLabel": "单选框",
                  "name": "zzbcp",
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
                      "name": "需要",
                      "value": "xuyao",
                      "xh": 1
                    },
                    {
                      "name": "不需要",
                      "value": "buxuyao",
                      "xh": 2
                    }
                  ],
                  "valuesDefaultValue": [
                    {}
                  ]
                },
                "compType": "formItem",
                "fieldName": "zzbcp",
                "itemType": "radio",
                "label": "单选框",
                "type": "radio"
              }
            ],
            "colWidth": "172px"
          },
          {
            "id": "shbd0362a4-8e3d-4185-b6a7-4415fccc6436",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "sh35329b71-f884-4640-b668-9077092ecff3",
            "colIndex": 1,
            "rowspan": 2,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh154e253b-2d9a-4854-a71f-c46ba041b89b",
                "preps": {
                  "id": "Idsh154e253b-2d9a-4854-a71f-c46ba041b89b",
                  "itemNameLabel": "单行文本框",
                  "name": "paicharenyuan",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入排查人员",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "排查人员"
                },
                "compType": "formItem",
                "fieldName": "paicharenyuan",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "sh794c2235-f1eb-4e1d-a1c7-f18ba1d7d060",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          }
        ]
      },
      {
        "id": "shd1641dc0-9106-4568-931f-f7e520dad164",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh55381a5c-f311-4cee-9dea-1ad6c6aeba06",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false
          },
          {
            "id": "shf0dc5955-36d1-4841-a0f9-94b2e137ab46",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idshb437f53a-1e5e-484f-afaa-aa67b2d2340a",
                "preps": {
                  "id": "Idshb437f53a-1e5e-484f-afaa-aa67b2d2340a",
                  "label": " 3.成品库存",
                  "itemNameLabel": "单选框",
                  "name": "chengpinkucun",
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
                      "name": "需要",
                      "value": "xuyao",
                      "xh": 1
                    },
                    {
                      "name": "不需要",
                      "value": "buxuyao",
                      "xh": 2
                    }
                  ],
                  "valuesDefaultValue": [
                    {}
                  ]
                },
                "compType": "formItem",
                "fieldName": "chengpinkucun",
                "itemType": "radio",
                "label": "单选框",
                "type": "radio"
              }
            ]
          },
          {
            "id": "shd81d41e6-4bb9-4efc-9789-b683f69db7b0",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "sh5333dc9a-6a9e-456c-ba61-488232840b24",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": true,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "shb47c7d86-8bea-4fbd-b221-489d84928ddc",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh09ba73f5-003a-44ac-80dc-7ebe1cb3824a",
                "preps": {
                  "id": "Idsh09ba73f5-003a-44ac-80dc-7ebe1cb3824a",
                  "label": "4.已出货品",
                  "itemNameLabel": "单选框",
                  "name": "yichuhuopin",
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
                      "name": "需要",
                      "value": "xuyao",
                      "xh": 1
                    },
                    {
                      "name": "不需要",
                      "value": "buxuyao",
                      "xh": 2
                    }
                  ],
                  "valuesDefaultValue": [
                    {}
                  ]
                },
                "compType": "formItem",
                "fieldName": "yichuhuopin",
                "itemType": "radio",
                "label": "单选框",
                "type": "radio"
              }
            ],
            "colWidth": "172px"
          },
          {
            "id": "shcdd8eec4-bc51-446d-a4a6-ed01d33d06e4",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "shca78dd7a-7c05-4606-aeae-0348f2ce1cd1",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "sha4ba0889-fd31-4716-ba63-856d1be9473c",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          }
        ]
      },
      {
        "id": "sha9fc18fa-6fa1-4996-b776-59e9ae4c87b0",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh22a619c6-91e0-4649-8998-815428aae05d",
            "colIndex": 1,
            "rowspan": 3,
            "colspan": 6,
            "items": [
              {
                "id": "Idsh5cdfe3cf-0aaa-4220-8f3f-588da962d07f",
                "preps": {
                  "id": "Idsh5cdfe3cf-0aaa-4220-8f3f-588da962d07f",
                  "label": "长期预防措施",
                  "itemNameLabel": "多行文本框",
                  "name": "cqyfcs",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入长期预防措施",
                  "rules": [],
                  "maxLength": 1000,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "labelPosition": "top"
                },
                "compType": "formItem",
                "fieldName": "cqyfcs",
                "itemType": "textarea",
                "label": "多行文本框",
                "type": "textarea"
              },
              {
                "id": "Idshe6b1d024-6ab9-4b11-a1eb-47d68a703c82",
                "preps": {
                  "id": "Idshe6b1d024-6ab9-4b11-a1eb-47d68a703c82",
                  "label": "标准化",
                  "itemNameLabel": "单选框",
                  "name": "biaozhunhua",
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
                      "name": "作业标准修订",
                      "value": "zybzxd",
                      "xh": 1
                    },
                    {
                      "name": "图纸修订",
                      "value": "tuzhixiuding",
                      "xh": 2
                    },
                    {
                      "name": "研发/技术更改，ECN号",
                      "value": "yf_jsgg",
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
                "fieldName": "biaozhunhua",
                "itemType": "radio",
                "label": "单选框",
                "type": "radio"
              }
            ],
            "cellVisible": true,
            "colHeight": "150px"
          },
          {
            "id": "sha2e3ced8-0536-4192-8de9-dbaf05c013d3",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "shb5aab7b9-aba4-48cb-9ba4-e1129957e9f6",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "sh34dc4b22-b49a-40c8-9598-035303aec955",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "sh3cb69fd3-9131-4731-bf65-c714783b2b70",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "172px"
          },
          {
            "id": "sh1be28d0c-9b55-476b-bc8a-f7ccad45394e",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "sh0372f8a5-6433-4ad4-9179-6c78088862b0",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh2f96a796-d79c-4555-aac1-e029f164b463",
                "preps": {
                  "id": "Idsh2f96a796-d79c-4555-aac1-e029f164b463",
                  "label": "制定人",
                  "itemNameLabel": "单行文本框",
                  "name": "zhidingren2",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入制定人",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true
                },
                "compType": "formItem",
                "fieldName": "zhidingren2",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "sh8d092de1-f85f-4bee-a1d3-5db9c592f657",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          }
        ]
      },
      {
        "id": "shcfd0cfcc-53b6-4d00-b609-bf22d3ffcb3d",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh738066ac-354c-454c-91cc-733032a42616",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false
          },
          {
            "id": "sh668fb4b3-a8f3-4bf4-9537-9f1f0adb9a9d",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "sh1f39de72-5407-42fe-a8c5-9ec8dea6e499",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "sh6bfa5e24-fee6-4700-94a2-7c26a688cb67",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "shc14367c4-3100-47af-b128-3f200add452f",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "172px"
          },
          {
            "id": "sh472e8495-25b0-47ce-9e82-9af0f39f443d",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "sh632737a0-4027-48a7-a957-d2c69e009fa1",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idshe3b28106-4dac-40ef-889d-770b227928fa",
                "preps": {
                  "id": "Idshe3b28106-4dac-40ef-889d-770b227928fa",
                  "itemNameLabel": "单行文本框",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入制定时间",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "制定时间",
                  "name": "zhidingshijian2"
                },
                "compType": "formItem",
                "fieldName": "zhidingshijian2",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "sh39038907-7910-450b-b310-5d3a5f31f39a",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          }
        ]
      },
      {
        "id": "shefc46ca0-0cf7-463d-a012-accc956197b5",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh274b3b0f-b8e8-4505-bfa4-e17439a730ee",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false
          },
          {
            "id": "sha2d1e056-3d00-4745-9ca1-b7316b0d02b3",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "sh5d94c329-4d8a-4ad0-8257-3a2ae8dca156",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "sh965d04aa-e053-4be1-8109-f83dfbf43e83",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "sh6d3c66e4-5159-4fd8-8ffa-eb578fce1362",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "172px"
          },
          {
            "id": "sh257dc298-1c62-44c4-afa0-f4f9cffbe8bf",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "sh0475571e-5528-44f4-8d1f-dbf6c8fc56e5",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh92d3692e-9214-4998-be14-9cab4572388c",
                "preps": {
                  "id": "Idsh92d3692e-9214-4998-be14-9cab4572388c",
                  "itemNameLabel": "单行文本框",
                  "name": "bumenjingli",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入部门经理",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "部门经理"
                },
                "compType": "formItem",
                "fieldName": "bumenjingli",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "she016ec37-483d-4d7c-a2f4-8b6e531dc3b9",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          }
        ]
      },
      {
        "id": "sh2a7f79cf-659c-44ab-81b3-769d0a2f35eb",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh633d02b5-feb9-4199-a178-694b9e728e5c",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 6,
            "items": [
              {
                "id": "Idsha650e633-4423-4791-ae89-c8c5f905babd",
                "preps": {
                  "id": "Idsha650e633-4423-4791-ae89-c8c5f905babd",
                  "label": "Html组件",
                  "itemNameLabel": "Html组件",
                  "name": "html46",
                  "clearable": true,
                  "readonly": false,
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "placeholder": "",
                  "staticData": true,
                  "textContent": "<p style=\"text-align: left;\">改善措施效果确认</p>",
                  "elements": [
                    {
                      "id": "sh252b242f-43c2-4951-acbf-57444753e1d9",
                      "colIndex": 1,
                      "columns": [
                        {
                          "id": "she33c19e0-72d4-4839-abf9-23b6efeb50bc",
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
                  "styles": {
                    "alignItems": "start"
                  }
                },
                "compType": "formItem",
                "fieldName": "html46",
                "itemType": "html",
                "label": "Html组件",
                "type": "html"
              }
            ],
            "cellVisible": true,
            "colHeight": "51px"
          },
          {
            "id": "sh5d5ea5b2-75d3-4e98-95c6-d0adca9fffba",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          },
          {
            "id": "sh6b94572c-9178-4f0c-9327-de1e5c631122",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "186px"
          },
          {
            "id": "sh6fa1a213-e1b4-4301-8b4d-3e2ac6518bab",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "62px"
          },
          {
            "id": "shf2ad8beb-1ac8-44cf-94f3-ac5989cccd0e",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "172px"
          },
          {
            "id": "shf6243353-da9e-47ba-bdf6-6105255d3ecb",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": [],
            "colWidth": "185px"
          },
          {
            "id": "sh47aad720-f646-4501-8f21-238910723e9a",
            "colIndex": 1,
            "rowspan": 2,
            "colspan": 2,
            "cellVisible": true,
            "items": [
              {
                "id": "Idsh4f89e059-926c-4e6e-933b-64585ed5e1c0",
                "preps": {
                  "id": "Idsh4f89e059-926c-4e6e-933b-64585ed5e1c0",
                  "label": "QE确认",
                  "itemNameLabel": "单行文本框",
                  "name": "qequeren2",
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
                "fieldName": "qequeren2",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "shdc3847c7-5498-43c8-b33d-73932eaa8ce1",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "cellVisible": false,
            "items": []
          }
        ]
      },
      {
        "id": "shb2f71d9b-268d-4c0a-b680-25fd89cb278a",
        "colIndex": 1,
        "columns": [
          {
            "id": "she671b08e-b043-48b7-90fd-27ae5034dbc4",
            "colspan": 2,
            "rowspan": 1,
            "items": [
              {
                "id": "Idsh03692c12-5f4e-47eb-8f41-1ad8e309ce72",
                "preps": {
                  "id": "Idsh03692c12-5f4e-47eb-8f41-1ad8e309ce72",
                  "itemNameLabel": "日期选择器",
                  "name": "gzsd",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请选择跟踪时段",
                  "type": "datetime",
                  "disabledDate": "(e20) => t16.value.includes(e20.getDate().toString())",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "跟踪时段",
                  "format": "HH",
                  "valueFormat": "HH"
                },
                "compType": "formItem",
                "fieldName": "gzsd",
                "itemType": "datetime",
                "label": "日期选择器",
                "type": "datetime"
              }
            ],
            "cellVisible": true
          },
          {
            "id": "sh37b90368-a9db-4397-80c4-ed9340f39783",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false
          },

          {
            "id": "sh961e5ee0-4540-4e7a-a3f8-8c8bf0e63fef",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "items": [
              {
                "id": "Idsh247c25aa-4c24-40d5-a693-0841e1f878a4",
                "preps": {
                  "id": "Idsh247c25aa-4c24-40d5-a693-0841e1f878a4",
                  "itemNameLabel": "数字输入框",
                  "name": "tourushu2",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入投入数",
                  "step": "1",
                  "min": 0,
                  "precision": 0,
                  "rules": [],
                  "maxLength": 10,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "投入数",
                  "controlsPosition": "right"
                },
                "compType": "formItem",
                "fieldName": "tourushu2",
                "itemType": "number",
                "label": "数字输入框",
                "type": "number"
              }
            ],
            "cellVisible": true,
            "colWidth": "62px"
          },
          {
            "id": "shee4406a9-b8a7-4357-b73f-7148ca6d7ceb",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false,
            "colWidth": "172px"
          },
          {
            "id": "shfd71552a-672f-4ad4-a6c0-d8e7fc025fa0",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [
              {
                "id": "Idsh1b77618b-4d79-4ef9-b080-2e53c16d44ee",
                "preps": {
                  "id": "Idsh1b77618b-4d79-4ef9-b080-2e53c16d44ee",
                  "itemNameLabel": "数字输入框",
                  "name": "buliangshu2",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入不良数",
                  "step": "1",
                  "min": 0,
                  "precision": 0,
                  "rules": [],
                  "maxLength": 10,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "不良数",
                  "controlsPosition": "right"
                },
                "compType": "formItem",
                "fieldName": "buliangshu2",
                "itemType": "number",
                "label": "数字输入框",
                "type": "number"
              }
            ],
            "cellVisible": true,
            "colWidth": "185px"
          },
          {
            "id": "sh9c050143-3467-48cd-a0f2-3cb0ed729672",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [
              {
                "id": "Idsha6fbc01c-27a9-474e-8d2e-f188e4cbc6f4",
                "preps": {
                  "id": "Idsha6fbc01c-27a9-474e-8d2e-f188e4cbc6f4",
                  "itemNameLabel": "数字输入框",
                  "name": "bulianglv2",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入不良率",
                  "step": "1",
                  "min": 0,
                  "precision": 0,
                  "rules": [],
                  "maxLength": 10,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "不良率"
                },
                "compType": "formItem",
                "fieldName": "bulianglv2",
                "itemType": "number",
                "label": "数字输入框",
                "type": "number"
              }
            ],
            "cellVisible": true
          },
          {
            "id": "sh05dec99e-908d-4f1c-b25a-23eb7586d71d",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false,
            "colWidth": "186px"
          },
          {
            "id": "she20f4648-48a1-4755-b05d-f8788913833b",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false
          }
        ]
      },
      {
        "id": "shd809ccc9-41b0-4774-9f94-e66bda3ae65a",
        "colIndex": 1,
        "columns": [
          {
            "id": "shc983efcb-8281-44eb-8164-ff36da17c67f",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 6,
            "items": [
              {
                "id": "Idshb6473bb0-8b0c-4ec7-bc26-e2d674bf5e37",
                "preps": {
                  "id": "Idshb6473bb0-8b0c-4ec7-bc26-e2d674bf5e37",
                  "label": "单选框",
                  "itemNameLabel": "单选框",
                  "name": "radio54",
                  "clearable": true,
                  "readonly": false,
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "step": "",
                  "placeholder": "",
                  "dataSource": "data",
                  "analysisType": "func",
                  "values": [
                    {
                      "name": "措施有效，可继续生产，进一步跟进效果",
                      "value": "ok",
                      "xh": 1
                    },
                    {
                      "name": "措施无效，需停线整改",
                      "value": "ng",
                      "xh": 2
                    }
                  ],
                  "valuesDefaultValue": [
                    {}
                  ]
                },
                "compType": "formItem",
                "fieldName": "radio54",
                "itemType": "radio",
                "label": "单选框",
                "type": "radio"
              }
            ],
            "cellVisible": true
          },
          {
            "id": "shbbfebb9d-0a1f-436e-abb7-d3435183d89a",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false
          },
          {
            "id": "sh01bf9637-700e-4439-8985-29f19ad3ebf3",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false,
            "colWidth": "186px"
          },
          {
            "id": "sh89a423e5-3e6e-44eb-8ed4-41076409e24c",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false,
            "colWidth": "62px"
          },
          {
            "id": "sh0e493591-732e-41c8-a0a5-b5b9fa0668e0",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false,
            "colWidth": "172px"
          },
          {
            "id": "sh1d38f053-a4e0-4fdf-a3f8-b81d1f048d6f",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false,
            "colWidth": "185px"
          },
          {
            "id": "sh5935a9a0-a5ce-4365-9d81-c1f3f92a305b",
            "colIndex": 1,
            "rowspan": 2,
            "colspan": 2,
            "items": [
              {
                "id": "Idsh97cc1aad-ad64-4c46-823b-794be7c621e0",
                "preps": {
                  "id": "Idsh97cc1aad-ad64-4c46-823b-794be7c621e0",
                  "itemNameLabel": "日期选择器",
                  "name": "qurenshijian2",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请选择确认时间",
                  "type": "datetime",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "确认时间"
                },
                "compType": "formItem",
                "fieldName": "qurenshijian2",
                "itemType": "datetime",
                "label": "日期选择器",
                "type": "datetime"
              }
            ],
            "cellVisible": true
          },
          {
            "id": "sh88b0147f-85d4-43f0-a995-e62d0b42e432",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false
          }
        ]
      },
      {
        "id": "shfc472521-e63d-4df1-b2dc-bce6cdf20e78",
        "colIndex": 1,
        "columns": [
          {
            "id": "shfb90bfe2-43e0-4bb6-8438-48caf9e01b04",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 6,
            "items": [
              {
                "id": "Idsh26f35c22-cd27-445d-9b46-c28a8b257531",
                "preps": {
                  "id": "Idsh26f35c22-cd27-445d-9b46-c28a8b257531",
                  "itemNameLabel": "多行文本框",
                  "name": "formRemark",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入备注",
                  "rules": [],
                  "maxLength": 1000,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "备注"
                },
                "compType": "formItem",
                "fieldName": "formRemark",
                "itemType": "textarea",
                "label": "多行文本框",
                "type": "textarea"
              }
            ],
            "cellVisible": true,
            "colHeight": "92px"
          },
          {
            "id": "sh094b9943-dce2-4542-9dbf-2662fd0a93bb",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false
          },
          {
            "id": "sh55089891-c9c7-4d64-88b3-3528673f3755",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false,
            "colWidth": "186px"
          },
          {
            "id": "shf92e141d-ea64-4f6e-a6b3-b00fee385cd1",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false,
            "colWidth": "62px"
          },
          {
            "id": "sh36acbb54-ce72-4a3c-b1a8-86bb40db7fa4",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false,
            "colWidth": "172px"
          },
          {
            "id": "sh22c73a55-dc1a-449d-affc-00cd69c681ed",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false,
            "colWidth": "185px"
          },
          {
            "id": "sh75c310b4-fb14-4ea5-af4e-ce368fa11ee8",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "cellVisible": false
          },
          {
            "id": "sh026540d9-47c2-4a8e-b5f7-d04cdbe936cf",
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
    "rowNums": 21,
    "columnNums": 8,
    "placeholder": ""
  },
  "compType": "container",
  "fieldName": "dytable1",
  "itemType": "dytable",
  "rowNums": 1,
  "columnNums": 1,
  "type": "dytable"
}];
onMounted(() => {
  const result = analysisCompDatas(fields);
  dataItem.value = result;
  console.log("xxx", result);
});
</script>

<style lang="scss" scoped></style>
