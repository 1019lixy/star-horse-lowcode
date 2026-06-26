<template>
  <el-scrollbar>
    <!--    <dytable-item :dataForm="formData" :item="dataItem"  :formInfo="{}" />-->
    <!--    {{starHorseFormRef?.getFormData()}}-->
        <star-horse-form :fieldList="dataItem" ref="starHorseFormRef"/>
<!--    <template v-for="data in formData">
      -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;<br>
      <template v-for="item in Object.entries(data)">
       {{item[0]}}: {{ testDateFormat(item) }}<br/>
      </template>
    </template>-->
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {analysisCompDatas, analysisComps} from "@/api/form_utils";
import {getDesignFormStore} from "@/store/StoreManager";
import {parseDateByType} from "@/api/date_utils";

let designForm = getDesignFormStore();
const testDateFormat = (item) => {
  const key = item[0];
  let type = key.split("field")?.[1]?.toLowerCase();
  if(type=="timepicker"){
    type="time";
  }
  console.log(type);
  return parseDateByType(item[1],type);
};
const formData = ref<any>([
  {
    "fieldMonth": "06",
    "fieldDaterange": [
      "2026-06-09T16:00:00.000Z",
      "2026-07-08T16:00:00.000Z"
    ],

    "fieldTime": "00:30:00",
    "fieldDatetime": "2026-06-23T16:00:00.000Z",
    "idValidDate": "387016432140944381",
    "fieldWeek": "2026-05-31T16:00:00.000Z",
    "fieldTimepicker": "17:24:43",
    "fieldDate": "2026-06-09T16:00:00.000Z",
    "fieldMonths": "[ \"06\", \"11\" ]",
    "fieldTimerange": "17:24:43",
    "fieldDates": [
      "2026-06-07T16:00:00.000Z",
      "2026-06-15T16:00:00.000Z",
      "2026-06-23T16:00:00.000Z"
    ],
    "fieldMonthrange": [
      "06",
      "07"
    ],
    "fieldYears": [
      "2020-12-31T16:00:00.000Z",
      "2024-12-31T16:00:00.000Z"
    ],
    "fieldYear": "2025-12-31T16:00:00.000Z",
    "fieldDatetimerange": [
      "2026-06-16T16:00:00.000Z",
      "2026-07-20T16:00:00.000Z"
    ],
    "fieldYearrange": [
      "2025-12-31T16:00:00.000Z",
      "2034-12-31T16:00:00.000Z"
    ]
  },
    {
      "fieldMonth": "2026-05-31T16:00:00.000Z",
      "fieldDaterange": [
        "2026-06-17T16:00:00.000Z",
        "2026-07-14T16:00:00.000Z"
      ],
      "remark": null,
      "idValidDateNew": "387073561648432125",
      "fieldTime": "00:30:00",
      "local": "zh_CN",
      "fieldDatetime": "2026-06-04T00:12:04.000Z",
      "statusName": "正常",
      "createdTime": "2026-06-04T00:12:26.471Z",
      "createdRoleId": null,
      "updatedTime": "2026-06-04T00:12:26.456Z",
      "updatedBy": "admin",
      "fieldWeek": "2026-05-31T16:00:00.000Z",
      "fieldTimepicker": "08:11:01",
      "fieldDate": "2026-06-09T16:00:00.000Z",
      "fieldMonths": [
        "2026-09-30T16:00:00.000Z",
        "2026-10-31T16:00:00.000Z",
        "2026-11-30T16:00:00.000Z"
      ],
      "version": 1,
      "fieldTimerange": "08:11:01",
      "createdBy": "admin",
      "fieldDates": [
        "2026-06-08T16:00:00.000Z",
        "2026-06-16T16:00:00.000Z",
        "2026-06-23T16:00:00.000Z"
      ],
      "fieldMonthrange": [
        "2026-05-31T16:00:00.000Z",
        "2027-05-31T16:00:00.000Z"
      ],
      "tenantId": "common",
      "fieldYears": [
        "2024-12-31T16:00:00.000Z",
        "2021-12-31T16:00:00.000Z"
      ],
      "dataNo": "No369880074226100",
      "fieldYear": "2025-12-31T16:00:00.000Z",
      "isDel": 0,
      "fieldDatetimerange": [
        "2026-06-16T16:00:00.000Z",
        "2026-07-14T16:00:00.000Z"
      ],
      "fieldYearrange": [
        "2025-12-31T16:00:00.000Z",
        "2034-12-31T16:00:00.000Z"
      ],
      "statusCode": "1"
    },{
    "fieldMonth": "2026-03-31T16:00:00.000Z",
    "fieldDaterange": [
      "2026-06-15T16:00:00.000Z",
      "2026-07-12T16:00:00.000Z"
    ],
    "remark": null,
    "idValidDateNew": "387073561648432125",
    "fieldTime": "00:30:00",
    "local": "zh_CN",
    "fieldDatetime": "2026-06-04T00:12:04.000Z",
    "statusName": "正常",
    "createdTime": "2026-06-04T00:12:26.471Z",
    "createdRoleId": null,
    "updatedTime": "2026-06-04T05:04:26.495Z",
    "updatedBy": "admin",
    "fieldWeek": "2026-05-17T16:00:00.000Z",

    "fieldDate": "2026-06-07T16:00:00.000Z",
    "fieldMonths": [
      "2026-07-31T16:00:00.000Z",
      "2026-08-31T16:00:00.000Z",
      "2026-09-30T16:00:00.000Z"
    ],
    "version": 3,
    "fieldTimepicker": "1970-01-01 08:11:01+08",
    "fieldTimerange": [
      "1970-01-01 13:03:21+08",
      "1970-01-01 14:03:21+08"
    ],
    "createdBy": "admin",
    "fieldDates": [
      "2026-06-06T16:00:00.000Z",
      "2026-06-14T16:00:00.000Z",
      "2026-06-21T16:00:00.000Z"
    ],
    "fieldMonthrange": [
      "2026-03-31T16:00:00.000Z",
      "2027-03-31T16:00:00.000Z"
    ],
    "tenantId": "common",
    "fieldYears": [
      "2022-12-31T16:00:00.000Z",
      "2019-12-31T16:00:00.000Z"
    ],
    "dataNo": "No369880074226100",
    "fieldYear": "2023-12-31T16:00:00.000Z",
    "isDel": 0,
    "fieldDatetimerange": [
      "2026-06-16T16:00:00.000Z",
      "2026-07-14T16:00:00.000Z"
    ],
    "fieldYearrange": [
      "2023-12-31T16:00:00.000Z",
      "2032-12-31T16:00:00.000Z"
    ],
    "statusCode": "1"
  }

]);
const starHorseFormRef = ref();
/**
 * date :'year' | 'years' |'month' | 'months' | 'date' | 'dates' | 'datetime' | 'week' |  'daterange' | 'monthrange' | 'yearrange'
 * datetime : 'datetime'   |'datetimerange'
 */
const dataItem = ref<any>({
  fieldList: [
    {
      label: "时间1", type: "time-picker", fieldName: "time", preps: {}
    },
    {
      label: "时间2", type: "time-picker", fieldName: "timerange", preps: {
        type: "timerange",
      }
    },
    {
      label: "日期时间1", type: "datetime", fieldName: "datetime", preps: {
        type: "datetime",
      }
    },
    {
      label: "日期时间2", type: "datetime", fieldName: "datetimerange", preps: {
        type: "datetimerange",
      }
    },
    {
      label: "日期1", type: "date", fieldName: "year", preps: {
        type: "year",
      }
    },
    {
      label: "日期2", type: "date", fieldName: "years", preps: {
        type: "years",
      }
    },
    {
      label: "日期3", type: "date", fieldName: "month", preps: {
        type: "month",
      }
    },
    {
      label: "日期4", type: "date", fieldName: "months", preps: {
        type: "months",
      }
    },
    {
      label: "日期5", type: "date", fieldName: "date", preps: {
        type: "date",
      }
    },
    {
      label: "日期6", type: "date", fieldName: "dates", preps: {
        type: "dates",
      }
    },

    {
      label: "日期8", type: "date", fieldName: "week", preps: {
        type: "week",
      }
    },

    {
      label: "日期10", type: "date", fieldName: "daterange", preps: {
        type: "daterange",
      }
    },
    {
      label: "日期closeTime", type: "date", fieldName: "closetime", preps: {
        type: "daterange",
      }
    },
    {
      label: "日期11", type: "date", fieldName: "monthrange", preps: {
        type: "monthrange",
      }
    },
    {
      label: "日期12", type: "date", fieldName: "yearrange", preps: {
        type: "yearrange",
      }
    },
  ]
});
const fields = [
  {
    "id": "Idshf33d1e90-f977-49c2-8757-43abbd93b495",
    "preps": {
      "id": "Idshf33d1e90-f977-49c2-8757-43abbd93b495",
      "label": "动态表格",
      "itemNameLabel": "动态表格",
      "name": "dytable1",
      "showLineNumber": true,
      "allowResize":true,
      "elements": [
        {
          "id": "sh375aabc0-c6a1-47c2-96cc-245dbeba8cc0",
          "colIndex": 1,
          "columns": [
            {
              "id": "she6667f13-4624-4729-8dda-d6b37ba67ff5",
              "colIndex": 1,
              "rowspan": 2,
              "colspan": 7,
              "items": [],
              "cellVisible": true,
              "dataType": "html",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "<p style=\"text-align: center;\"><span style=\"font-size: 19px;\">四川华平通讯设备有限公司 </span></p><p style=\"text-align: center;\"><span style=\"font-size: 19px;\">DIP IPQC巡查表 &nbsp;</span></p>",
              "colWidth": "56px"
            },
            {
              "id": "sh350e02d2-39d2-43d7-9c6b-a2dbba6b99fe",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh895b79fc-7e73-446a-9814-421ac36534ac",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shd430e4db-2de6-4333-b050-930b25b1cc66",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shafde7d5b-cd70-4b6d-ab1d-e28559991117",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh8a63152f-94f2-446f-9d37-9ac4c2636975",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh4e70b400-b5f9-461e-a65c-c87e4f064c8e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "76px"
            },
            {
              "id": "sh4b4c8614-875e-4877-9bdb-5e433a3475a2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "pc",
              "textContent": "批准"
            },
            {
              "id": "shffdd4358-14a3-4f2e-9487-36c26dde2609",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shdd309510-9b18-429e-8f70-3173c48972f9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "pc",
              "textContent": "审核"
            },
            {
              "id": "sha1b6b877-f909-427a-a3c9-3d67abc19471",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shfb8818cf-2ef4-4c45-8e21-d900eae6304b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "pc",
              "textContent": "作成"
            },
            {
              "id": "sh36e9fd7e-d24a-4e55-a60e-591024621dcc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh12d781e2-0416-4a58-9379-c4d38f8c75f1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            }
          ]
        },
        {
          "id": "sh9c029baa-8f7b-4b2a-bee3-fb54cfcf0d2a",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh51540eda-ee61-4356-be50-62dc3e01a578",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "shedb900bc-a39a-4e99-85b9-33b4a80aaac8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shcf07d0bd-b99c-44ae-8816-d81c65a7511c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shc883e9dc-b535-4d68-8282-693247d1e738",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh1c76b973-23cf-4091-ac37-be481d8ab1eb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh804c9c30-42af-426a-980e-1ad9d42bb3ae",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh5161b182-3a93-4ede-92d0-157a7a991724",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "76px"
            },
            {
              "id": "sh8e43570b-d965-4f18-ab6a-37289deea73a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh04b9d430-d7fe-4aad-951f-4b0a08218883",
                  "preps": {
                    "id": "Idsh04b9d430-d7fe-4aad-951f-4b0a08218883",
                    "label": "批准",
                    "itemNameLabel": "单行文本框",
                    "name": "pizhun",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入批准",
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
                    "appCompVisible": false,
                    "appLabelVisible": false,
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "pizhun",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ]
            },
            {
              "id": "sh817097e2-3a7f-4372-a276-464c594895fc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shbb4e4555-f4ad-460c-b3b7-9b5d90608899",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh618db1b5-f2bd-46a2-8cae-4b7279e711ef",
                  "preps": {
                    "id": "Idsh618db1b5-f2bd-46a2-8cae-4b7279e711ef",
                    "label": "审核",
                    "itemNameLabel": "单行文本框",
                    "name": "shenhe",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入审核",
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
                    "appCompVisible": false,
                    "appLabelVisible": false,
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
              "id": "sh172df483-afa5-41c2-9174-674b42dfb618",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shbb912fda-6033-4eee-b7eb-9f8f215d250b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh1f14f3a7-7f5e-44ee-8df2-dde024e9a6ea",
                  "preps": {
                    "id": "Idsh1f14f3a7-7f5e-44ee-8df2-dde024e9a6ea",
                    "label": "作成",
                    "itemNameLabel": "单行文本框",
                    "name": "zuocheng",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入作成",
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
                    "appCompVisible": false,
                    "appLabelVisible": false,
                    "hideLabel": true,
                    type: "daterange"
                  },
                  "compType": "formItem",
                  "fieldName": "zuocheng",
                  "itemType": "date",
                  "label": "单行文本框",
                  "type": "date"
                }
              ]
            },
            {
              "id": "sh43f8fe96-59a6-404c-a2ac-cce84c1f84ef",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh8a043dd4-3f4e-4a6d-903f-228dca515290",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            }
          ]
        },
        {
          "id": "shced5b68d-30c4-46b7-8131-934e6a9d2d3b",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh279097c9-66e5-4fee-b9ec-1be65214310c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "items": [
                {
                  "id": "Idsh2d20673e-cad2-4068-9498-5f3d97ef2443",
                  "preps": {
                    "id": "Idsh2d20673e-cad2-4068-9498-5f3d97ef2443",
                    "label": "工单",
                    "itemNameLabel": "单行文本框",
                    "name": "gongdan",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入工单",
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
                    }
                  },
                  "compType": "formItem",
                  "fieldName": "gongdan",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "cellVisible": true,
              "colWidth": "56px"
            },
            {
              "id": "sh86ccb793-d93d-4bc9-afa5-0754c9a75cda",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh841a086e-3163-4557-8b8e-b3fccce27adf",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sha5e0115e-8149-474c-af9d-1ee370bc84b9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh44e1ee0c-7e79-4c45-862a-d3f0b3238364",
                  "preps": {
                    "id": "Idsh44e1ee0c-7e79-4c45-862a-d3f0b3238364",
                    "label": "客户",
                    "itemNameLabel": "单行文本框",
                    "name": "kehu",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入客户",
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
                    }
                  },
                  "compType": "formItem",
                  "fieldName": "kehu",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "48px"
            },
            {
              "id": "sh03ad70d8-8021-4cd4-a4ac-bf211488344d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shf0d82ea1-8372-4e1f-8448-891ef2b97663",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shb8b24794-6f30-4036-912e-d142cd252366",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh558f5878-9e1a-4dbc-bcbe-9fb181b7f94d",
                  "preps": {
                    "id": "Idsh558f5878-9e1a-4dbc-bcbe-9fb181b7f94d",
                    "label": "机型",
                    "itemNameLabel": "单行文本框",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入机型",
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
                    "name": "jixing"
                  },
                  "compType": "formItem",
                  "fieldName": "jixing",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ],
              "colWidth": "76px"
            },
            {
              "id": "sh948986a1-e255-45ee-98a6-026f5494530b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh6f0badb3-ff82-4035-b0f3-326d2aae3c6c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh50dd5126-524a-4340-bab9-02cfe6f7e8cd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh804e7b47-5e52-4a58-b005-06ae4ffe009e",
                  "preps": {
                    "id": "Idsh804e7b47-5e52-4a58-b005-06ae4ffe009e",
                    "label": "生产日期",
                    "itemNameLabel": "日期选择器",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请选择生产日期",
                    "type": "datetime",
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
                    "name": "shengchanriq"
                  },
                  "compType": "formItem",
                  "fieldName": "shengchanriq",
                  "itemType": "datetime",
                  "label": "日期选择器",
                  "type": "datetime"
                }
              ]
            },
            {
              "id": "shb2ff8eca-8c75-4d4a-8cf0-8ea6a2d7d9df",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh1561aa20-2ecb-40dd-87eb-d0d7473679fc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idshbb183eb9-b92e-4e8a-98a6-ec7d075b1d5c",
                  "preps": {
                    "id": "Idshbb183eb9-b92e-4e8a-98a6-ec7d075b1d5c",
                    "label": "班/线别",
                    "itemNameLabel": "单行文本框",
                    "name": "banxianbie",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入班/线别",
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
                    }
                  },
                  "compType": "formItem",
                  "fieldName": "banxianbie",
                  "itemType": "input",
                  "label": "单行文本框",
                  "type": "input"
                }
              ]
            },
            {
              "id": "sh08d98942-31f9-4f97-8bbb-0bfba8dc5981",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh2a43b731-e745-4fdd-b574-173ef9d5e468",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            }
          ]
        },
        {
          "id": "sh976007e6-05ce-40ef-a443-47443610c6aa",
          "colIndex": 1,
          "columns": [
            {
              "id": "shca0d8380-d34f-4d61-b92c-110b9cb1dac3",
              "colIndex": 1,
              "rowspan": 2,
              "colspan": 1,
              "items": [],
              "cellVisible": true,
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "pc",
              "textContent": "项目",
              "colWidth": "56px"
            },
            {
              "id": "sh43df7d7f-504d-4380-9f36-fb3d947fc5a2",
              "colIndex": 1,
              "rowspan": 2,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "pc",
              "textContent": "检查内容"
            },
            {
              "id": "sh268fe532-f421-4a89-8e8e-411127aebebd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh18ae3e24-0bd2-4de3-87c5-33e23f113d16",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh30a50a70-db88-4113-b797-605ac2d2bf15",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh73835369-139e-4111-941e-7cd129da8d6a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh61233705-9792-4914-a69d-000841809ded",
              "colIndex": 1,
              "rowspan": 2,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "pc",
              "textContent": "稽核频率",
              "colWidth": "76px"
            },
            {
              "id": "sh648dbbf3-3473-450c-89ce-dbff512a8589",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 6,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "稽核结果"
            },
            {
              "id": "she0bd0394-41b7-4599-ae55-78c9f8309297",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shb66af7ba-209d-4957-aa91-c40d33502426",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh23cd50ad-10bc-4edf-b7a8-d1f2debb5e10",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh123ad4be-0d13-40fd-a338-4dfe77ca2eba",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh1ebb770d-cba3-4d1c-998d-b4984e6270db",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh61290a03-072b-4579-9e87-ca7cee5e7215",
              "colIndex": 1,
              "rowspan": 2,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "pc",
              "textContent": "备注"
            }
          ]
        },
        {
          "id": "sh79a5e679-f125-4e7a-af74-93e8d2364bd1",
          "colIndex": 1,
          "columns": [
            {
              "id": "shd388a99e-54d3-4bdd-a724-86b470507ae4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh2e1ce681-3f8d-4116-a7ad-ac63d9374a7b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh4a30a125-7c82-47f8-9a4e-1d9b6ef30bc6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shb0013428-460e-4f40-b899-4e513c3f4846",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh34d684e0-57a6-48a2-b50b-c3031565e5bb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sheb1095e8-34e1-40ec-a239-7cdad58b4b96",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh8d8409b3-02c4-41ad-a432-6fb87c116848",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "76px"
            },
            {
              "id": "sh2e293bef-a45b-482d-99b7-6487d7943deb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "pc",
              "textContent": "8:00-10:00\n20:00-22:00"
            },
            {
              "id": "sha06af7a2-bd7c-4a04-9f8b-9667bce447d2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "pc",
              "textContent": "10:00-12:00\n22:00-00:00"
            },
            {
              "id": "sh8ae2b679-471b-4ce5-91ae-360bb091303c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "pc",
              "textContent": "12:00-14:00\n00:00-2:00"
            },
            {
              "id": "sh03ff0abe-1374-47cc-8663-37ace5a00d97",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "pc",
              "textContent": "14:00-16:00\n2:00-4:00"
            },
            {
              "id": "sh732d12a8-1194-41fa-abfd-f7938ffc5aec",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "pc",
              "textContent": "16:00-18:00\n4:00-6:00"
            },
            {
              "id": "shfec17df7-e03a-409e-9620-2c82f9dcb209",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "pc",
              "textContent": "18:00-20:00\n6:00-8:00"
            },
            {
              "id": "sh3929a814-aed8-440d-93b6-5c32a2f964e2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            }
          ]
        },
        {
          "id": "shf9b62165-e98d-471f-9470-2dd4680a2fd2",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh563f83d4-631d-4984-b89e-fc6a6486eda2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": true,
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "投板",
              "colWidth": "56px"
            },
            {
              "id": "sh6156b5ca-1333-4f1e-b748-87d8c76b6927",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "确认物料料号和实物一致，并确认上料记录（根据生产计划执行稽查）；"
            },
            {
              "id": "shad18981c-0b83-47ad-9a87-359d383304c3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh2a37c262-78e7-4704-8281-bca78f0d0840",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shf8a759df-57c7-4710-adbe-91082fd00b6a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh6ca43c90-3739-48b7-a13c-3bd60895dc27",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh230e71b2-a7fe-4643-9a85-521160bf0060",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "每班2次",
              "colWidth": "76px"
            },
            {
              "id": "sh24814341-4e43-4812-8a5e-9c93944d4764",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh2e2a7b76-639f-4b3d-bd54-49fb2d8d7a55",
                  "preps": {
                    "id": "Idsh2e2a7b76-639f-4b3d-bd54-49fb2d8d7a55",
                    "label": "8:00-12:00 20:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ],
                    "appCompVisible": false,
                    "appLabelVisible": false
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shb340b365-3fdc-416e-a021-0114ff301d7c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh709dcac1-6485-4215-94db-7325030f0e11",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh8151352f-96b9-452b-a17d-e7db6718b483",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "shf6b81b98-0587-4508-99bb-866ba4ac5658",
                  "preps": {
                    "id": "shf6b81b98-0587-4508-99bb-866ba4ac5658",
                    "label": "14:00-20:00 2:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a154",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a154",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh75c8015b-15ff-4248-9672-729901d23190",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh8ec5499a-6aff-4e57-9727-1f54945a109f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh49ace8f2-5b65-4e2e-a3c5-6ce6d4b20249",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idshdcb5dcae-791f-4cc4-bb9e-4f60b5b9d473",
                  "preps": {
                    "id": "Idshdcb5dcae-791f-4cc4-bb9e-4f60b5b9d473",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb5",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb5",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh1bf1e174-c005-40f2-9077-412dd38c844b",
          "colIndex": 1,
          "columns": [
            {
              "id": "shfecfb47b-9a9a-4bd2-9985-842c26670387",
              "colIndex": 1,
              "rowspan": 4,
              "colspan": 1,
              "items": [],
              "cellVisible": true,
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "插件",
              "colWidth": "56px"
            },
            {
              "id": "sh0a6a2121-99f2-48fa-ad31-5871666ed965",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "上线的物料符合SOP或BOM表要求; "
            },
            {
              "id": "shaa3a4705-15bb-4a35-bb56-7c14bf8931ed",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shad72319d-583d-4a3b-9ef2-6230bf0d440a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shf144a465-009f-4150-b1f2-303ab6ad670d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh4113faae-8b35-4e78-8da3-0a6099a3717d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh59ef6878-32e3-4a74-a812-c47b05c481bf",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "2H/次",
              "colWidth": "76px"
            },
            {
              "id": "shf8f0d43a-0567-4558-b4da-1e4ac2056092",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh2294e4bb-5147-4864-ae73-dd94e985bfda",
                  "preps": {
                    "id": "sh2294e4bb-5147-4864-ae73-dd94e985bfda",
                    "label": "8:00-10:00 20:00-22:00\t",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a155",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a155",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shc9c261a2-a779-4258-aac1-5d8796eb222a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh36d9ec35-1f19-45cd-93fb-78a524cbd216",
                  "preps": {
                    "id": "sh36d9ec35-1f19-45cd-93fb-78a524cbd216",
                    "label": "10:00-12:00 22:00-00:00\t",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a156",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a156",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shb23bbeae-3f42-4789-97b3-272b471cda03",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh8693ae94-5ccc-436e-b99d-dfe5ef6cd062",
                  "preps": {
                    "id": "sh8693ae94-5ccc-436e-b99d-dfe5ef6cd062",
                    "label": "12:00-14:00 00:00-2:00\t",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a157",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a157",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh339a5a49-9dfc-4295-82d2-6fe1413a3a10",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh7e95a08b-1671-46cb-bac2-f867b36eaa39",
                  "preps": {
                    "id": "sh7e95a08b-1671-46cb-bac2-f867b36eaa39",
                    "label": "14:00-16:00 2:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a158",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a158",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shaae7e13b-7c54-4e4d-aaa0-fb3529f274c0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh3156d9e6-6ed1-4800-8cb9-c7564e9281d6",
                  "preps": {
                    "id": "sh3156d9e6-6ed1-4800-8cb9-c7564e9281d6",
                    "label": "16:00-18:00 4:00-6:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a159",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a159",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh99f795c4-43cd-46c1-a0ce-718fb0cd0bcc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh01dc539f-b335-4a85-b76b-7002edceda91",
                  "preps": {
                    "id": "sh01dc539f-b335-4a85-b76b-7002edceda91",
                    "label": "18:00-20:00 6:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a160",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a160",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sheb5b1c17-004c-4a53-a084-a773eb1bf6b2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "she52a46ce-f7b7-424f-8743-722296fa1749",
                  "preps": {
                    "id": "she52a46ce-f7b7-424f-8743-722296fa1749",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb321",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb321",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh33458f5a-56d3-4d76-88a6-20071fb189b3",
          "colIndex": 1,
          "columns": [
            {
              "id": "shae00f5ac-2562-4217-90a6-85f099857ad5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh15ffb307-83dd-4f51-a55f-ca05105423fc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "员工按SOP作业，物料摆放标识正确合理; "
            },
            {
              "id": "sh98f932fa-2ffd-480a-833f-930f1b4da00f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh07aa321a-852b-4f7b-b41f-39ff91e4a744",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh80e81741-77ac-4c75-a573-bbf06c8cbe4b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "she2157f54-128a-45c4-938c-13a46d2ef427",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "she32637df-47c3-411e-9b5b-2ecbf46abfc6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "2H/次",
              "colWidth": "76px"
            },
            {
              "id": "shfd868396-a740-4b4b-a284-85da93b90bb8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh73390920-91df-435e-9275-8d127a1c9608",
                  "preps": {
                    "id": "sh73390920-91df-435e-9275-8d127a1c9608",
                    "label": "8:00-10:00 20:00-22:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a161",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a161",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh4fb4e778-4234-41a7-8b6a-a9454b723383",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "she426418c-e2b2-45d0-83db-b3e05ac17acc",
                  "preps": {
                    "id": "she426418c-e2b2-45d0-83db-b3e05ac17acc",
                    "label": "10:00-12:00 22:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a162",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a162",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh9559fe0e-a2c0-4c3f-92c8-d0286d5211d8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh315dc76c-30a2-449f-b54a-ba1cf335fe41",
                  "preps": {
                    "id": "sh315dc76c-30a2-449f-b54a-ba1cf335fe41",
                    "label": "12:00-14:00 00:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a163",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a163",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh85431200-0edc-460c-b4d1-174dda5cf3f0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh337ed951-fd1b-49cc-980b-9fd6fff683e6",
                  "preps": {
                    "id": "sh337ed951-fd1b-49cc-980b-9fd6fff683e6",
                    "label": "14:00-16:00 2:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a165",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a165",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh62ed6a8d-55cf-4183-bb28-458e7c2020be",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shf03dc4dd-3720-4826-903a-4f73a5169499",
                  "preps": {
                    "id": "shf03dc4dd-3720-4826-903a-4f73a5169499",
                    "label": "16:00-18:00 4:00-6:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a166",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a166",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shd403b3f1-1d65-4ea7-9367-55e07ead4667",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shcf82383f-8539-4f6b-81ff-2739aac664cb",
                  "preps": {
                    "id": "shcf82383f-8539-4f6b-81ff-2739aac664cb",
                    "label": "18:00-20:00 6:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a167",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a167",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh4d4bd1c8-c9ce-4edc-aa19-b38afa856191",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh6a6eb8a0-5d54-4e76-85e7-ddbbd4a0b0b0",
                  "preps": {
                    "id": "sh6a6eb8a0-5d54-4e76-85e7-ddbbd4a0b0b0",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb322",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb322",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "shc5c8ccf8-02e3-4b30-9ca4-2a9a5e7d6195",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh74100525-ed6c-41ca-ae81-ce510e194de7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh732f327b-dca4-4610-9ce8-d557ef7a817d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "是否剪脚，剪脚高度是否符合SOP；"
            },
            {
              "id": "sh3e8cf78b-1ffb-4ac4-b59f-ea9c59d33347",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "she3cf2dc9-bae5-414a-8e29-7db557a64c32",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh6438a6d8-8ef3-43f1-a771-2b5613685da8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shadfeed12-a8a3-4eb1-bb10-de8956689cad",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh22ac6dfe-c40f-49b3-83bd-d76453d03168",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "2H/次",
              "colWidth": "76px"
            },
            {
              "id": "shab34b28b-5768-4f51-ab6d-102ee4975f15",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shd739c86d-4621-4af7-a792-e02307cb1955",
                  "preps": {
                    "id": "shd739c86d-4621-4af7-a792-e02307cb1955",
                    "label": "8:00-10:00 20:00-22:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a168",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a168",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shcb38902c-c92d-4d05-9fe2-0eb52c2b6368",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shefcf19f1-0742-4ac3-b042-799b2f881b0c",
                  "preps": {
                    "id": "shefcf19f1-0742-4ac3-b042-799b2f881b0c",
                    "label": "10:00-12:00 22:00-00:00\t",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a169",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a169",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh8a9e4009-31c8-4c96-8218-4c2c614977e6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh3516fdf8-7a92-4612-b430-101990d30d33",
                  "preps": {
                    "id": "sh3516fdf8-7a92-4612-b430-101990d30d33",
                    "label": "12:00-14:00 00:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a170",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a170",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh62027a81-589d-446c-aa78-f5027de8a5af",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh0d29c307-88b5-492c-8c14-86535da4053d",
                  "preps": {
                    "id": "sh0d29c307-88b5-492c-8c14-86535da4053d",
                    "label": "14:00-16:00 2:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a171",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a171",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh922261bb-298d-41ce-b420-72fec8621ce6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shcf01f1a6-0ec6-4253-8892-96cea596291c",
                  "preps": {
                    "id": "shcf01f1a6-0ec6-4253-8892-96cea596291c",
                    "label": "16:00-18:00 4:00-6:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a172",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a172",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh20a99313-2796-4ff4-9cc9-7db909d378d2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shd7360889-21bf-4725-8556-6d433a72a060",
                  "preps": {
                    "id": "shd7360889-21bf-4725-8556-6d433a72a060",
                    "label": "18:00-20:00 6:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a173",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a173",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh3c5ae538-e31c-4ad5-aed5-fb47ff8d7f69",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "she85c89e2-a69e-4676-9553-28f6e21ac575",
                  "preps": {
                    "id": "she85c89e2-a69e-4676-9553-28f6e21ac575",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb323",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb323",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "she70b2f27-0c26-4c9b-a068-4b521bf5d06d",
          "colIndex": 1,
          "columns": [
            {
              "id": "shd3869d19-0cc2-42ad-88dc-e85ba795aa82",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "shedbb9377-cf64-4f78-91ae-dde30ed20680",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "元器件的插件位置方向正确，元件需要插到位，无漏插现象; "
            },
            {
              "id": "sh09237b71-276d-4a53-9f4b-3b06dcfce52f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh74fa6720-d7b2-4848-bc86-c488fe26266a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh21836359-1922-4930-bf76-e6825e618c0e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh42853511-8d13-450d-98b0-ae539cc60849",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh2654127a-ba9a-48b5-bf52-eb06768cc795",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "2H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh7d31a8f9-d01f-40ed-a260-bada8a77f8fb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shebe8e55a-d772-4754-8eed-d7cd6869e7c9",
                  "preps": {
                    "id": "shebe8e55a-d772-4754-8eed-d7cd6869e7c9",
                    "label": "8:00-10:00 20:00-22:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a174",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a174",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shce9a0d81-0209-4ed8-a15e-866e989169e7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh5ebf3f1b-cc79-4748-a180-38941384d34e",
                  "preps": {
                    "id": "sh5ebf3f1b-cc79-4748-a180-38941384d34e",
                    "label": "10:00-12:00 22:00-00:00\t",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a175",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a175",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh3bd7c10c-75ac-48eb-a783-c6e0287c8a32",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh0504ac79-4fca-46b0-b7ca-cf6d77bb9280",
                  "preps": {
                    "id": "sh0504ac79-4fca-46b0-b7ca-cf6d77bb9280",
                    "label": "12:00-14:00 00:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a176",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a176",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sha150f218-92c7-4d7b-9cc2-f280061b0427",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shc99ab114-a06f-4cc5-ba0a-6b201574ed7d",
                  "preps": {
                    "id": "shc99ab114-a06f-4cc5-ba0a-6b201574ed7d",
                    "label": "14:00-16:00 2:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a177",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a177",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh5888d749-51d0-4a06-bf9b-8f106d40e8bb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh07e7bed1-8bea-4d0a-8619-f48e739d7183",
                  "preps": {
                    "id": "sh07e7bed1-8bea-4d0a-8619-f48e739d7183",
                    "label": "16:00-18:00 4:00-6:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a178",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a178",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh4c890fee-4f94-47bf-9507-42c8d86800cc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh61053643-5227-4b0e-88f7-eeb0ecdd7b64",
                  "preps": {
                    "id": "sh61053643-5227-4b0e-88f7-eeb0ecdd7b64",
                    "label": "18:00-20:00 6:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a179",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a179",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shb40fb95a-5067-4960-8998-08b7c59a8eb5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shf68ab50b-5848-4112-8298-acc341ffe7ff",
                  "preps": {
                    "id": "shf68ab50b-5848-4112-8298-acc341ffe7ff",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb324",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb324",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sha40fe58d-e98b-402a-bba7-9a9058f18d1a",
          "colIndex": 1,
          "columns": [
            {
              "id": "shd59d46bc-42a6-4546-a9fc-e9ed606b0aab",
              "colIndex": 1,
              "rowspan": 7,
              "colspan": 1,
              "items": [],
              "cellVisible": true,
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "波峰焊",
              "colWidth": "56px"
            },
            {
              "id": "sh99807c97-a9b2-4869-9094-a9287272ff88",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "检查波峰焊有作业指导书，炉温按时测试；"
            },
            {
              "id": "sh109b3c0a-654c-451b-8c8e-08024e65b41e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh7c344e63-f3b3-4a1f-9dd1-b45534d6d9b9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shee238a35-2310-4601-9bed-c1391de53a24",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh94409563-7097-4d4a-8906-0f1decfd74db",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh7e0813d3-1a41-48a9-b3e3-3edff85c6983",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh54e22f40-3b05-4073-bbc5-9759a2e13247",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shf456ec3c-e0f7-4366-8643-f3350233aad1",
                  "preps": {
                    "id": "shf456ec3c-e0f7-4366-8643-f3350233aad1",
                    "label": "8:00-12:00 20:00-00:00\t",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a180",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a180",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh984a02ca-49dc-4722-bcb2-2f8ed102c8fe",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh057fc92b-5293-4f14-bd6a-baa9bfc86d22",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh56aaf4de-69a1-4479-9ad6-0b7e23000f20",
                  "preps": {
                    "id": "sh56aaf4de-69a1-4479-9ad6-0b7e23000f20",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a181",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a181",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh5d920518-0205-466a-a1ad-8969290b9f56",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh7e899845-b0a9-4ce8-8f8f-b3527bf8e26e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "she9fefab1-9371-49d9-9ebd-e278b69a28fd",
                  "preps": {
                    "id": "she9fefab1-9371-49d9-9ebd-e278b69a28fd",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a182",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a182",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh225d3b3a-2afe-4025-81b3-3cc199f13831",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shf8745beb-9eff-494c-adc5-996a500438a9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh744911ec-2c45-45a1-9ee1-2a4da185e9c8",
                  "preps": {
                    "id": "sh744911ec-2c45-45a1-9ee1-2a4da185e9c8",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb325",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
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
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb325",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh15f60a22-f0ba-4f9b-ba4c-de039553d1f4",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh180a8c38-b536-41a9-a196-f43422754012",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh7a98225c-fed5-4041-904b-6bdbfb4c94c9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "波峰焊温区参数、低温区参数、链条速度、浸锡时间、助焊剂喷雾速度和气压与炉温曲线图和SOP一致。"
            },
            {
              "id": "sh739a1dea-9871-48b9-b2d0-dc72cb89ff37",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh4e1a0b48-36ec-4e3d-9164-f94728ef162b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh9f933779-b21a-4c2a-a2d4-40c4dd030d8a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh97f163da-348f-439f-9558-22ad6bee6a02",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shfd0b89fe-5c27-430a-b49e-72d2b21628be",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "每班2次",
              "colWidth": "76px"
            },
            {
              "id": "sh93f3532f-915c-4cbd-8f5a-2c94bfee0cf0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh6b2f79c1-858d-4cf3-b942-be3fde16f3d6",
                  "preps": {
                    "id": "sh6b2f79c1-858d-4cf3-b942-be3fde16f3d6",
                    "label": "8:00-14:00 20:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a183",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a183",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shbdcc50bc-573d-4fdc-843d-fa9825a76e39",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "she7115c4d-d71f-4f20-a383-a4837614ca22",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh1ab00e3d-5cd3-4ee7-ae32-a52de28ccdd5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh4142fe2b-de2a-40ab-8313-ea20f353ddc2",
                  "preps": {
                    "id": "sh4142fe2b-de2a-40ab-8313-ea20f353ddc2",
                    "label": "14:00-20:00 2:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a184",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a184",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shce39e31d-a785-411d-9ddc-97a0bad1c0aa",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "she1737ba6-f8e0-4bc3-9d84-926f945c42ff",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shd4a0f3ff-7892-4303-bf1c-8d6f63626620",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh536c554c-ab76-4e75-9e9a-0be6cbca7af0",
                  "preps": {
                    "id": "sh536c554c-ab76-4e75-9e9a-0be6cbca7af0",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb326",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
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
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb326",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh3d00b5d1-cb49-48f4-8e2d-a258ff33df27",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh8ca1b3e7-a05b-4557-b318-1aaba445970e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "shcd530b44-fbea-45d7-9ba7-52c5be049d5b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "确认锡渣按时清理；"
            },
            {
              "id": "sh079c1d31-3dd5-4a1e-a223-4c4e9625cc17",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shd06b074a-2844-479f-be4f-18db12bea87d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sha7d86348-d9f1-4a6d-a8eb-ff699d40e674",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh0c7e2ddd-e47f-485b-91a7-fe393cfff56c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh66e0e0ef-f7dd-4db3-ab9d-bc4c2f8fa2ec",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "每班2次",
              "colWidth": "76px"
            },
            {
              "id": "sh27cb832a-9c17-4b77-820c-79ff0dc93db7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "she8a2b38d-d1c0-4796-9e17-7eb35ac9fc66",
                  "preps": {
                    "id": "she8a2b38d-d1c0-4796-9e17-7eb35ac9fc66",
                    "label": "8:00-14:00 20:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a185",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a185",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sha2009b21-b188-4098-a758-66a79d69276c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shc119ca24-8074-40d2-a707-712121fa4915",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shb877c96d-a71b-4fb5-bea3-ac63dbd5fea0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "shff7cfceb-6664-4e43-a296-921c1ad0b6cf",
                  "preps": {
                    "id": "shff7cfceb-6664-4e43-a296-921c1ad0b6cf",
                    "label": "14:00-20:00 2:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a186",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a186",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh7fb05be9-f589-4682-9c3c-bd03df901c86",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh55e4a7e1-1058-4ae2-a4f3-a5c3ec086681",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shb1762cf2-e81b-4299-8e86-60b6e66cc2c6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh2825389d-36b7-4d64-84d9-3fbf55ee4747",
                  "preps": {
                    "id": "sh2825389d-36b7-4d64-84d9-3fbf55ee4747",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb327",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb327",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh7c2f4ae7-c0cd-4a57-8655-cc09d10cb65d",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh500ef3f1-7601-4771-8666-a1a8b1666dd7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh564f971a-5dcc-4561-9b7d-3e4fe8f0b50a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "检查焊盘上锡饱满,无批量假焊、虚焊、空焊、冷焊、连锡、少锡现象；"
            },
            {
              "id": "shda85f115-32a6-4bcd-8dc8-b05eadfdf859",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh894a1f70-edcb-4303-83d0-c785c6b1a7a7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shce7a188b-c290-4ce0-a96f-3c90d150bcf9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh3a93cf93-28d4-409d-bf6e-dde9f3b0ab04",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh3be0f2b3-6cac-479b-9363-3f85503611cb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh9fc0ef93-9830-4e57-9955-969b9ed18b80",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shd832066c-7c73-4560-be2a-5399efc9522f",
                  "preps": {
                    "id": "shd832066c-7c73-4560-be2a-5399efc9522f",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a187",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a187",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shd279479b-3ef0-4314-90df-58efa02b747d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh88375d10-b48f-41a8-85e4-e0bab4ff9dc4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sha2416963-170b-4d6c-b258-12c14a7f40d4",
                  "preps": {
                    "id": "sha2416963-170b-4d6c-b258-12c14a7f40d4",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a188",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a188",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shb43ef7f7-b812-439c-ad81-13d4a3c64e2e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh62f8e5ea-9487-4d9b-b3ae-50d640ff6490",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh22623c99-a66b-444e-9a26-4e7ad579eb8d",
                  "preps": {
                    "id": "sh22623c99-a66b-444e-9a26-4e7ad579eb8d",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a189",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a189",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh23c11446-59d9-4b55-accb-a10dd512fc28",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh5f72bc42-d1f1-4de3-9863-5d6be59b9c79",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh931a8114-ce2f-4fbe-9d4f-13f13702f2c2",
                  "preps": {
                    "id": "sh931a8114-ce2f-4fbe-9d4f-13f13702f2c2",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb328",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb328",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "shcfe74989-1fb3-4445-97a2-5401b85f4254",
          "colIndex": 1,
          "columns": [
            {
              "id": "shaee06737-e555-4ef0-985d-aa44a46051ec",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh0dc95af3-40e8-4b1f-a26d-bb763952df32",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "检查电源插座和网口物料Pin角面是否存在异物，Pin脚变形现象。"
            },
            {
              "id": "shca6e7d49-fe4c-4dcd-8d0a-d2a1cf5de159",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shbdb957e9-0d1f-4663-8850-43a51c52539b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh041ef1bc-3b49-44ca-9539-12fc480edea6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh100dee17-69b3-40ce-8fbf-2a98f3b1b6ae",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shd20989d1-882c-4692-b755-ada67bd51ded",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "she1ddc748-7a3c-495b-91f2-87d99b077356",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh2148a85c-b513-4f60-bf90-e9cd0a9c70a4",
                  "preps": {
                    "id": "sh2148a85c-b513-4f60-bf90-e9cd0a9c70a4",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a190",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a190",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shfa217762-cb9c-4a2c-821c-7d2199975b78",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shacdc129a-ada3-42ce-a15f-90f4ffddf7ab",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh6b2fbfa7-5ce8-466a-8232-a64fbc14ecc9",
                  "preps": {
                    "id": "sh6b2fbfa7-5ce8-466a-8232-a64fbc14ecc9",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a191",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a191",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh5b71f295-a7f9-4dec-a0e6-af933cde2c3e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh3ee0eed8-6635-4174-a797-c1b87b1903ab",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh15ac9819-da56-40f1-9fc8-eafdefa7eb36",
                  "preps": {
                    "id": "sh15ac9819-da56-40f1-9fc8-eafdefa7eb36",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a193",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a193",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shde35522b-c14b-4e89-96e5-96a7c0094c13",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh05dab0fc-de58-4f6e-9b3f-34d4bbceee07",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh4f11764f-891b-4df5-9dff-afeb49640928",
                  "preps": {
                    "id": "sh4f11764f-891b-4df5-9dff-afeb49640928",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb329",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb329",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh63c32f27-db8d-4384-8060-3b33c44027cd",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh70ad1089-35e2-48e5-814b-b89ba790aa49",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh76c11aa7-c8ee-434f-ac95-b3b92f1854cd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "PCB板面CCD下确认每600mm²范围内允许≤5个合格尺寸（0.05mm≥D≤0.13mm）锡珠（单面），反之拒收预警分析"
            },
            {
              "id": "sh0ee70ac7-249e-4241-8647-9344ca4987b1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh1c10a7ae-836a-4cfe-aa09-c2837ffd0fbe",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shf22d435a-4ab1-4815-b86f-b451785266a9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shd5169bfe-7764-4193-a499-55a0b81457fd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh2af36c4a-d8df-435c-89d6-b7568803ed09",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh1b34d3f0-7abf-45c6-a1a3-d48a7c07bc8a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shae047599-c891-432a-8f9d-6d9376330280",
                  "preps": {
                    "id": "shae047599-c891-432a-8f9d-6d9376330280",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a198",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a198",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh3522485b-5d3a-4a50-9301-aa2160c3039d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "she8c7d5b8-9355-40c2-b8fa-aaa07142450a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh068cec11-efeb-476c-9c35-53b7e23edef4",
                  "preps": {
                    "id": "sh068cec11-efeb-476c-9c35-53b7e23edef4",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a199",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a199",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shf344839a-ab4f-48b7-85ca-127dc0917a6b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shf07b39db-31e8-4a47-9c9a-980098beb7c9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh587a09dd-6d00-45dc-b9e5-49e91a27d424",
                  "preps": {
                    "id": "sh587a09dd-6d00-45dc-b9e5-49e91a27d424",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a200",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a200",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh6ee09f65-971d-4c23-a686-8aef0a7535ef",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh67c3ca52-1829-4004-b779-76e649b044af",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh8ff908aa-6a46-4154-99f0-b8aa33e915e4",
                  "preps": {
                    "id": "sh8ff908aa-6a46-4154-99f0-b8aa33e915e4",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb330",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb330",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh4ac2b288-cafe-4a53-b048-cd856e312af3",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh39f9f7f8-5eb0-42b7-921d-668dbc850647",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "shed4fe2ce-03a8-462a-af71-cb8ebe94941c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "html",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "<p><span style=\"color: rgb(225, 60, 57);\">每季度确认测试工程是否有安排从锡池内取样锡送测第三方检测，并确认其报告存档结果记录是否OK（注意：稽核时间不晚于每季度结束前15天）</span></p>"
            },
            {
              "id": "shf67aee4b-ac05-4936-901e-eb408d08d53d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh51d3eede-b059-400b-a383-c8b3a0f8e8af",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shaeec65bb-caff-422f-953c-06e72e63f9d0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shdcba0125-3f73-480c-b1e0-9c73ac24fb21",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh2e9ac971-8445-4054-a16e-c2f38184380f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "每季度/次",
              "colWidth": "76px"
            },
            {
              "id": "shf9849ba6-2edb-4784-8af3-87e1deccf3f9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 6,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh2e35726b-11bb-4ee4-8a93-aaca4c5d513a",
                  "preps": {
                    "id": "sh2e35726b-11bb-4ee4-8a93-aaca4c5d513a",
                    "label": "8:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a201",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a201",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh2f9b16ad-a767-4a25-be39-af68da8fc461",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh84be0fa6-c1b0-4926-bc80-a1cb8a947054",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh2c5c1289-592a-40f7-83e1-049f9f128478",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sha0b3b7af-ca02-453e-81cf-75f639d98933",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "she68a6e22-ce0b-4269-8268-016ce6391a20",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh9e9bd106-7554-4da3-8ddc-211bec77672c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh7d925d8f-4d1d-462e-88fb-91a1b7bc839d",
                  "preps": {
                    "id": "sh7d925d8f-4d1d-462e-88fb-91a1b7bc839d",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb331",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb331",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh9e6f7ec4-4ce9-4357-a9ae-ec3d05ca3c42",
          "colIndex": 1,
          "columns": [
            {
              "id": "shc901ba04-d5c7-4e76-a06a-7f09d19fe300",
              "colIndex": 1,
              "rowspan": 4,
              "colspan": 1,
              "items": [],
              "cellVisible": true,
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "目检补焊",
              "colWidth": "56px"
            },
            {
              "id": "sh97ca3220-fc1d-461a-b678-92800ce4472a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "烙铁使用前有经量测（温度及漏电压）其结果确认符合规定并作记录；"
            },
            {
              "id": "sh74880881-f57d-4ea8-9f24-48bae74e9755",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shca03109b-4577-4f1a-a93d-58827b0a22c2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh528e89d2-3e8a-4763-8e55-b8bc7e7886bb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sha92a9f4d-5528-47cc-92f8-2487e918d649",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh8214c87a-532b-4595-80fa-87ffac8c585b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "每班2次",
              "colWidth": "76px"
            },
            {
              "id": "sh673c4aad-7bd4-4281-8c60-b021a2d30fd4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh057c3300-fffd-4571-b7ed-381077e7f1a3",
                  "preps": {
                    "id": "sh057c3300-fffd-4571-b7ed-381077e7f1a3",
                    "label": "8:00-14:00 20:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a202",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a202",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "she7c38e83-b50c-48e3-b286-a0e9fabe2bfe",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh4792fdbd-5bfd-4c97-abbb-68fc0fce2ee4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sha5bcd59f-6cf6-4c6c-98fc-110832469f3c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh01c22eb9-b55e-42ae-94ef-c018073ac72e",
                  "preps": {
                    "id": "sh01c22eb9-b55e-42ae-94ef-c018073ac72e",
                    "label": "14:00-20:00 2:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a203",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a203",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sha03298e1-65bd-47f0-817e-a9f8a4c132d8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shda5296a2-0d8d-4af5-80ba-781604783f90",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh95c63deb-4f72-4a9b-ad70-113690cc738b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shb46babed-98c8-424c-9064-a60907d231a3",
                  "preps": {
                    "id": "shb46babed-98c8-424c-9064-a60907d231a3",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb332",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb332",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh9a7a56fd-c32e-42f9-8a24-be13100199ad",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh54c578e2-2d32-4d2d-9e52-2d57819a3acd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "shb47cd120-11da-4104-81ca-62eaf9972be1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "补焊维修岗位洛铁温度设定正确，每天有做温度点检；"
            },
            {
              "id": "sh3f538f41-1cfd-4039-8864-4501f7959f00",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh2a13a25a-7fba-43ce-9c2e-12ca31b4bbde",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shfce73ff6-0355-4a8f-bcf5-6614db363a61",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shc11e9cf0-9aa9-4ec4-acfa-71193f0b4a1f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh537e1f67-41c7-43d6-88dd-1a2c18c8c556",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "每班2次",
              "colWidth": "76px"
            },
            {
              "id": "sh4db426ed-a118-4f4f-b1b4-b3aaad702d54",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh8ceebdd1-a607-4065-a260-70d539878410",
                  "preps": {
                    "id": "sh8ceebdd1-a607-4065-a260-70d539878410",
                    "label": "8:00-14:00 20:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a204",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a204",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh31ad50b4-8585-4a6c-843a-7ce6045d69b3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shaf79a65d-d498-4f7b-bc5a-6aca140dd223",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sha3ec5a59-c66a-413c-9e1d-26418c6e679c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh4d32df15-2fbc-4ce9-8acd-4a9d90aef424",
                  "preps": {
                    "id": "sh4d32df15-2fbc-4ce9-8acd-4a9d90aef424",
                    "label": "14:00-20:00 2:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a205",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a205",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shded58da9-31d3-4397-9c66-089b80e201a2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh8f4ee643-1641-43d4-b171-c2bcbdccafa4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh7964b9b8-f5b5-43dc-9bee-3eac9a81433e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh4882f84d-e04d-4f62-becc-568a10430ed5",
                  "preps": {
                    "id": "sh4882f84d-e04d-4f62-becc-568a10430ed5",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb333",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb333",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh1a4c84bc-a8d2-4d46-99dc-3e105b301023",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh338cd5a3-911e-4c4f-8834-a1feae211719",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "shc0cf8411-03fd-442c-a5d2-93c91d07388f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "colHeight": "49.79999923706055px",
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "补焊无伤及线路板；无连焊、虚焊、漏焊；"
            },
            {
              "id": "sh59f7cac4-3261-4db1-9e2b-726db52609ab",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh5f11a7a5-bc70-45fb-a86f-661a9fcd32cf",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh6ced0e13-c698-4848-a4d2-25ae6a8d7b75",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shc5f86b54-0433-42d5-933f-7213878611f3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shbab9c11a-ad44-46a4-9d5a-75c6dc8b5eca",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "2H/次",
              "colWidth": "76px"
            },
            {
              "id": "sha587ac14-90d0-4bc4-94c3-b524eac558fd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh15a1b520-afb7-48c9-aaa9-89550cde054a",
                  "preps": {
                    "id": "sh15a1b520-afb7-48c9-aaa9-89550cde054a",
                    "label": "8:00-10:00 20:00-22:00\t",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a206",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a206",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shdd4b492e-c605-45d5-b279-38781656a4ee",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shc5623b14-a33b-4125-8ead-a6830ebeae45",
                  "preps": {
                    "id": "shc5623b14-a33b-4125-8ead-a6830ebeae45",
                    "label": "10:00-12:00 22:00-00:00\t",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a207",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a207",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh3967a0de-afbd-48b6-a946-bfb1cb0716f5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh777a9939-8337-41c2-8daf-c2de04becaa4",
                  "preps": {
                    "id": "sh777a9939-8337-41c2-8daf-c2de04becaa4",
                    "label": "12:00-14:00 00:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a208",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a208",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh38c7b05e-32e6-47c1-b608-a30458c58bcc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh85b1e31b-6d6b-4220-83d0-1fd5dcf447a2",
                  "preps": {
                    "id": "sh85b1e31b-6d6b-4220-83d0-1fd5dcf447a2",
                    "label": "14:00-16:00 2:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a209",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a209",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shd36b7487-76c9-40c4-b88a-b5a03cdda6a0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shc3fac37b-420e-429e-8854-71f196a4ef41",
                  "preps": {
                    "id": "shc3fac37b-420e-429e-8854-71f196a4ef41",
                    "label": "16:00-18:00 4:00-6:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a210",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a210",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh09fd8604-8d54-40c7-9b04-c4e79b1766bb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shc939f5e7-ceb5-47c4-8e3d-f7dfeb6224e2",
                  "preps": {
                    "id": "shc939f5e7-ceb5-47c4-8e3d-f7dfeb6224e2",
                    "label": "18:00-20:00 6:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a211",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a211",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh46a16dcb-9f81-4c75-b503-3fcf487d1552",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shaa4f7fb4-6fa0-4c5b-8627-d751417604c7",
                  "preps": {
                    "id": "shaa4f7fb4-6fa0-4c5b-8627-d751417604c7",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb334",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb334",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh4c66063b-e4d4-4c04-ba50-94dbb292db29",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh655078e6-5899-482c-9d0a-f62b237f8796",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "shed37be93-07d3-4c0b-90ea-098d7af475a7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "补焊产品有做清洁，清洁后的产品无发白或残留物；"
            },
            {
              "id": "sh8cbffc52-ea29-42ec-9c8b-c8c12ef43a2f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shca10c133-0908-483a-81f2-06207305c6b5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh7773df39-fe64-47d3-bcb7-7b187ebc36bc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh2b9496a3-cda8-4f6c-8f8b-a05af3ad15e0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shf5630504-e585-4707-88af-f391027fa94b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "2H/次",
              "colWidth": "76px"
            },
            {
              "id": "she5c1f8af-0236-419f-b8d2-e6524fce6a2e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sha1578b71-4161-4c10-8136-5a59998aac5b",
                  "preps": {
                    "id": "sha1578b71-4161-4c10-8136-5a59998aac5b",
                    "label": "8:00-10:00 20:00-22:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a212",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a212",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shd63d059f-613c-4338-bc5f-429fd5c9d794",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh69d54312-632a-4454-b6c4-43c5e3c5c079",
                  "preps": {
                    "id": "sh69d54312-632a-4454-b6c4-43c5e3c5c079",
                    "label": "10:00-12:00 22:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a213",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a213",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh1d421210-8550-465a-a2be-4352273619fb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh576b1cfb-4427-406a-88d6-b7ac45929e9c",
                  "preps": {
                    "id": "sh576b1cfb-4427-406a-88d6-b7ac45929e9c",
                    "label": "12:00-14:00 00:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a214",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a214",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shcf6772db-6b3d-4d61-8127-788e6285959c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sha3bc4386-deac-4fea-b2a7-44e3d8f32721",
                  "preps": {
                    "id": "sha3bc4386-deac-4fea-b2a7-44e3d8f32721",
                    "label": "14:00-16:00 2:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a215",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a215",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shfd376a7f-2baa-41c0-920a-1dbf582603dc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shdc1f762c-2045-4904-815c-1136e39e46ec",
                  "preps": {
                    "id": "shdc1f762c-2045-4904-815c-1136e39e46ec",
                    "label": "16:00-18:00 4:00-6:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a216",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a216",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh59b4b909-4a6d-483a-90bb-902d64c7a67a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shdf977070-efd4-4442-b1d4-36a814169bb7",
                  "preps": {
                    "id": "shdf977070-efd4-4442-b1d4-36a814169bb7",
                    "label": "18:00-20:00 6:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a217",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a217",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shecfee7cd-e28e-4066-befd-9b4140f5db52",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh06b2933a-d7a3-41a4-a74b-285c05dfcfba",
                  "preps": {
                    "id": "sh06b2933a-d7a3-41a4-a74b-285c05dfcfba",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb335",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb335",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "shaf039303-56c7-4eac-ba1e-b2dd32629cd4",
          "colIndex": 1,
          "columns": [
            {
              "id": "sheb4991b4-3b3a-4a3e-9e30-55765711cd51",
              "colIndex": 1,
              "rowspan": 4,
              "colspan": 1,
              "items": [],
              "cellVisible": true,
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "开检测试",
              "colWidth": "56px"
            },
            {
              "id": "shaf8a0ac8-c6ea-4d9f-b814-b74694aded51",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "工具、工具版本、软件确认使用正确；"
            },
            {
              "id": "shaf8c9439-90d6-479a-b749-dd6089382020",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh92489dde-e4f8-417c-a69f-ba2a1f56093f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh30f95be0-7580-4ef3-951f-fb6ca66fb6b1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sha337c54c-63e8-469a-8872-7ce02a5b151b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh3c128872-1a27-4b2c-9da2-6b7b4cee72ad",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "每班2次",
              "colWidth": "76px"
            },
            {
              "id": "sh74f2c544-41ff-4d7b-8919-2da451e961d7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh2e4d214d-8fc5-4aa0-83bc-df1f888ce95b",
                  "preps": {
                    "id": "sh2e4d214d-8fc5-4aa0-83bc-df1f888ce95b",
                    "label": "8:00-14:00 20:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a218",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a218",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shc68aa120-bb4c-4062-b632-140720a6e44a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh2ce397d8-e949-48a4-b95a-40f0e7416189",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh4f121180-cf60-4f02-b4cb-b88dbb8cc175",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh1de08231-697d-4fcf-a02f-cd0bf3262372",
                  "preps": {
                    "id": "sh1de08231-697d-4fcf-a02f-cd0bf3262372",
                    "label": "14:00-20:00 2:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a219",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a219",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sha9653c6d-5781-469f-86a5-309d16d49e85",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh39656725-181f-461e-853f-a153f0258f40",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh481f74f8-6c91-4299-9b54-c97998530896",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh83508f56-83b7-4b2a-a533-18ea360c94a4",
                  "preps": {
                    "id": "sh83508f56-83b7-4b2a-a533-18ea360c94a4",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb336",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb336",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "shd10391ce-5f2a-4b63-969c-ab3773054722",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh117e25a2-45f1-4c06-80c1-3373506a61d5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "shc6b58baa-c54e-46e5-bc57-104cfe104c2f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "电源电压设置符合SOP要求；"
            },
            {
              "id": "sh048d6852-1e7e-4afc-8497-df7fd666182b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh69e5b724-9303-47fb-b3b4-42a78744634c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shdac900a5-133c-49af-84f4-3c4b387dc9d7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh623e04ee-61bd-4d03-8cfe-d9061372e54f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh2a464a11-335a-42b9-ad3c-9cd11976cbf1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "每班2次",
              "colWidth": "76px"
            },
            {
              "id": "sh5fbf7eb0-5966-4f96-80e6-742a119d4a23",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh81cd8976-5dd0-4720-a387-fc22b6b614ca",
                  "preps": {
                    "id": "sh81cd8976-5dd0-4720-a387-fc22b6b614ca",
                    "label": "8:00-14:00 20:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a220",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a220",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh2b166c39-3a01-439f-b913-712cd696a67a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh75ecdbe2-1705-4cfb-a5dd-7c9c0dcd6c45",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shc2064e4f-7ee3-4467-8a99-a01b1f4a2e30",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "she59dfb87-cbd8-4695-8632-ad2da507889c",
                  "preps": {
                    "id": "she59dfb87-cbd8-4695-8632-ad2da507889c",
                    "label": "14:00-20:00 2:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a221",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a221",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh9fac9b82-b756-4760-8f15-25749ddd890e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh4f981fd1-7696-4f4a-aeac-718c18923864",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh240481b0-2731-44b1-99fc-5b0b4ab1481f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh4e2bc63a-0700-4772-be53-b2425ab369be",
                  "preps": {
                    "id": "sh4e2bc63a-0700-4772-be53-b2425ab369be",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb337",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb337",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh00e8663d-bd2c-4c04-9d79-aa37aef9ed4e",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh3cdca3a1-d289-4d0b-b99b-ff27afbb2bd3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh2a56dc7b-6106-4a3c-839f-54716f8a09dd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "测试人员对测试不良品进行标识和记录，不良品放置在不良品区域内;"
            },
            {
              "id": "she75aeeef-ad8a-4cfc-b418-712b2d6f9bac",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh9bd4b986-c5b2-4dc9-a70f-b86a9917fa92",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shaea16101-ba1b-47eb-a2e6-70a238affe56",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh49479288-b5ed-4343-8166-9c0974a0af46",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh446f3d89-1830-4fd4-9fca-314086f1ae31",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "2H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh37b5ae66-6c59-4624-9e6e-5f26fb2ee611",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sheb46c4db-c4ac-42f4-9707-81a85ddca6fb",
                  "preps": {
                    "id": "sheb46c4db-c4ac-42f4-9707-81a85ddca6fb",
                    "label": "8:00-10:00 20:00-22:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a222",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a222",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh861afa67-4158-4ddf-85e8-34d6b92760c3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shec254e5b-a7ac-41ac-bedb-a5b9f9878537",
                  "preps": {
                    "id": "shec254e5b-a7ac-41ac-bedb-a5b9f9878537",
                    "label": "10:00-12:00 22:00-00:00\t",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a223",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a223",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shd9674bfc-4f02-41c1-821f-9dc0e6e29ac5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh39f1718f-31a5-4c6e-8cc3-033772ee8361",
                  "preps": {
                    "id": "sh39f1718f-31a5-4c6e-8cc3-033772ee8361",
                    "label": "12:00-14:00 00:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a224",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a224",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh41d25034-6a2a-47a9-83d9-b0c7744bb4ec",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shf451857e-0e28-4d60-9f85-eb1e2f8ef16d",
                  "preps": {
                    "id": "shf451857e-0e28-4d60-9f85-eb1e2f8ef16d",
                    "label": "14:00-16:00 2:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a225",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a225",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh61aefc79-c87a-45f9-93fe-50b0498f08a9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shbaab76ae-1653-4d98-bff4-bf19419b89fe",
                  "preps": {
                    "id": "shbaab76ae-1653-4d98-bff4-bf19419b89fe",
                    "label": "16:00-18:00 4:00-6:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a226",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a226",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh66140bc4-96db-4c24-a0b9-7996df67b80a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh3ec475bb-7034-4ed5-ac95-169d01c66e94",
                  "preps": {
                    "id": "sh3ec475bb-7034-4ed5-ac95-169d01c66e94",
                    "label": "18:00-20:00 6:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a227",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a227",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh10fa2e47-4d8c-40e8-ba47-39137e333738",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh03e2ece2-cac6-41e7-9811-9cd2f2bbd94e",
                  "preps": {
                    "id": "sh03e2ece2-cac6-41e7-9811-9cd2f2bbd94e",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb338",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb338",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh81cae6b7-dd40-4e32-a5bd-f9d8e431b837",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh82b28c68-b7e8-4be9-97dd-c9d8119121cf",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh43044d50-17d5-4016-8775-5dbbaffc1df3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "工程、品质、生产及时对不良品进行确认；"
            },
            {
              "id": "shb0b12932-2af1-45d2-8e07-16ecac376ff4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh3657e38c-e9ee-44a1-834d-74b030dcb083",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shd8a06960-28d7-430e-ad47-1cf13460ff29",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh19f833c9-6828-439a-9c61-1e3ea8461467",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh1e4c591d-2d88-43ce-a251-1e54ba80593c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "2H/次",
              "colWidth": "76px"
            },
            {
              "id": "sha8ade8af-a5da-4f1f-b964-fb150a2fc5b7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh9317269b-86c0-42eb-a728-d75b5d59eecf",
                  "preps": {
                    "id": "sh9317269b-86c0-42eb-a728-d75b5d59eecf",
                    "label": "8:00-10:00 20:00-22:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a228",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a228",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh91051001-370b-469f-855a-a70393197e84",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh86e7372c-2aee-4a5d-b132-1a6e0fa79828",
                  "preps": {
                    "id": "sh86e7372c-2aee-4a5d-b132-1a6e0fa79828",
                    "label": "10:00-12:00 22:00-00:00\t",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a229",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a229",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh8089b450-aedf-4814-a084-3dedbc3bd34e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh4b5422f8-6939-48d4-b824-be7d6094ec10",
                  "preps": {
                    "id": "sh4b5422f8-6939-48d4-b824-be7d6094ec10",
                    "label": "12:00-14:00 00:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a230",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a230",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shaa5a6933-8b85-43c2-b0cb-c85222406fc1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh0236e732-091e-4732-98f5-68775af4a354",
                  "preps": {
                    "id": "sh0236e732-091e-4732-98f5-68775af4a354",
                    "label": "14:00-16:00 2:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a231",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a231",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh2b544291-a75a-4a62-a5ef-6123214d66db",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh626b1cfb-d291-4235-9118-0c60d40b85fc",
                  "preps": {
                    "id": "sh626b1cfb-d291-4235-9118-0c60d40b85fc",
                    "label": "16:00-18:00 4:00-6:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a232",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a232",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh29d83312-8301-4583-bffd-3730dcb22d8e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh8dca90ba-cd18-4f08-a62b-e4027e916ca6",
                  "preps": {
                    "id": "sh8dca90ba-cd18-4f08-a62b-e4027e916ca6",
                    "label": "18:00-20:00 6:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a233",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a233",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shcfd90c42-299b-45fe-a9c0-f3035761b63e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh7022eb12-6c95-44b6-8515-9fadac7c4e38",
                  "preps": {
                    "id": "sh7022eb12-6c95-44b6-8515-9fadac7c4e38",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb339",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb339",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh529a286d-a32e-4009-bd04-7cd05a29fd3e",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh4c5bb889-845e-46e6-b357-f22672631eb6",
              "colIndex": 1,
              "rowspan": 5,
              "colspan": 1,
              "items": [],
              "cellVisible": true,
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "PFT测试",
              "colWidth": "56px"
            },
            {
              "id": "sh400cd2e1-4671-4f94-a5b7-714a9929cabe",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "工具、工具版本、软件确认使用正确；"
            },
            {
              "id": "sh863abca0-682c-4325-bf68-06fa35b300c4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh143dbe0b-d2c8-45db-9d6d-171ddb415157",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shd7e7357b-b5bb-4c58-9f93-e07058ff9031",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh02340917-1343-4805-93f8-b676d01c8121",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shc5485ca3-6d28-4109-a63c-fc7cb8730c8a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "每班2次",
              "colWidth": "76px"
            },
            {
              "id": "sh01c69049-dc4d-4029-8c19-a7a624c8d192",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "shdfbf1e0e-6786-4602-9fb0-0b0848829866",
                  "preps": {
                    "id": "shdfbf1e0e-6786-4602-9fb0-0b0848829866",
                    "label": "8:00-14:00 20:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a234",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a234",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh5529e5b9-9b51-45c0-8e71-3f749da3c95b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shacc2fdf6-65b9-4802-82dd-9ec2bf3f9c86",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh7c98c528-879e-414c-af91-99d4657668d9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "shf154dfac-1990-4d81-ad26-04ba78ae19e2",
                  "preps": {
                    "id": "shf154dfac-1990-4d81-ad26-04ba78ae19e2",
                    "label": "14:00-20:00 2:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a235",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a235",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh18fdc564-f7f3-4964-8ffb-db2c5be4eccb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shf5b92c4e-e375-4408-a977-aa97616342b6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh66b0d7e0-2f4d-4c90-aa6e-9764d045f2d2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "she9b389b6-2556-40c3-9f2b-b82ca0ca1e3f",
                  "preps": {
                    "id": "she9b389b6-2556-40c3-9f2b-b82ca0ca1e3f",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb340",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb340",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh8f1703a8-81e9-4195-a5f0-ed450fb25e56",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh4249e335-dfce-4578-8e90-c756b55da596",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh055cbd48-8f98-42dd-9c96-a184e4f611ef",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "电源电压设置符合SOP要求；"
            },
            {
              "id": "shd297fe74-78f3-49f1-9191-6c9874e694af",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shc9e4b429-12e1-4294-8e9e-920eb07f5f17",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh7f91234c-c230-4db8-8246-98a678ea4f20",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sheb5aaee5-af70-4293-a8a6-46d9d86b0da3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh6120794d-56f9-4fa4-b687-998afc8b4942",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "每班2次",
              "colWidth": "76px"
            },
            {
              "id": "she48f9d08-f7c9-488d-9ac4-74430db704ca",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh7c948c28-531e-47d1-8ee2-39da608acb60",
                  "preps": {
                    "id": "sh7c948c28-531e-47d1-8ee2-39da608acb60",
                    "label": "8:00-14:00 20:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a236",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a236",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh75004196-f223-4625-8202-6ee46f15cfa9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shc950bf88-f9db-4850-b220-f2babb4c3891",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh6d4008bd-2f3b-4584-8027-082d5c0a811e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "shc4bd0662-d325-4c58-ac82-bb8fbc4aa687",
                  "preps": {
                    "id": "shc4bd0662-d325-4c58-ac82-bb8fbc4aa687",
                    "label": "14:00-20:00 2:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a237",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a237",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh839566b0-b288-49c1-9c1c-949a4cc6d733",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh6c2af2af-c144-4d05-a100-acb07e5259ed",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh5397b0c1-7ff3-44fe-bf65-6f2d3412e9fe",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh2ac808ac-dbd3-477f-af74-e9cfb535d195",
                  "preps": {
                    "id": "sh2ac808ac-dbd3-477f-af74-e9cfb535d195",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb341",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb341",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh7685bdff-ab65-4721-b19a-b83b50ebc7c2",
          "colIndex": 1,
          "columns": [
            {
              "id": "shccfaeae7-e084-4557-8bd4-0c3fdd5bd5ad",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh3c5f3686-c9db-499a-94af-9a0010979bac",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "测试夹具使用正确，"
            },
            {
              "id": "sh8f1777d9-326d-4bb8-a58b-e9264f3c71a1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh33cbe68f-1978-4020-82ee-522bb7e2c19f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh500d0353-9675-445d-88ba-cbc6d3512a3b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "she4d186e7-d658-4474-8d4f-6c7edc1d86b9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh92781604-ded5-4ebf-b828-98a2eb924e0b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "每班2次",
              "colWidth": "76px"
            },
            {
              "id": "sh5f0d2139-8199-406b-a436-12fcd0ae25cd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "shb872325f-771e-49cd-a8c7-4000e57e2860",
                  "preps": {
                    "id": "shb872325f-771e-49cd-a8c7-4000e57e2860",
                    "label": "8:00-14:00 20:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a238",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a238",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh59c4d234-b157-42d0-b163-7d104ef63494",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh2ceba8a0-763f-4de1-a60f-3f90bb9f9b21",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh81e31751-a37b-4def-ba93-48a1ea4aa10a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh65b6e603-1ae3-4fe1-adbb-21447caf51c8",
                  "preps": {
                    "id": "sh65b6e603-1ae3-4fe1-adbb-21447caf51c8",
                    "label": "14:00-20:00 2:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a239",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a239",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh4a32a3e8-89ed-47b8-ac2a-db0ac47e5775",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh1293195c-0e63-407b-bca1-42790510450e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh5897b757-4ee2-42a0-a9cc-2aaf926227be",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shc423e630-5572-4cc4-afca-f508921d883f",
                  "preps": {
                    "id": "shc423e630-5572-4cc4-afca-f508921d883f",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb342",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb342",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh0d5b6f61-9532-402f-9861-1d907d205cff",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh5ebd0077-3054-48a4-b509-aa561a25fdae",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "shcda45275-202b-47d7-b079-7a6dc8a5bc5d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "测试步骤与SOP一致。"
            },
            {
              "id": "sh59cf7e6a-b5e2-44cf-9702-2e0c175e465e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh24e389db-4588-462e-a227-c94ca3459e94",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shb2bf9af6-2301-4ade-a647-103323f1dddd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shef94eb0f-66de-410d-89aa-d75617414926",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh3910a9a7-3d2e-493e-847a-96f8fc5caafe",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "每班2次",
              "colWidth": "76px"
            },
            {
              "id": "sh9ac41218-eaa7-438d-b284-f76b3c374c38",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "shb032d1f1-ad40-4702-965d-b5f1d0b99a6a",
                  "preps": {
                    "id": "shb032d1f1-ad40-4702-965d-b5f1d0b99a6a",
                    "label": "8:00-14:00 20:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a240",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a240",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh909baee8-d733-407a-b9fc-09c1e796f9a5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sheb2b40c0-61df-446d-84b5-beecb6ea5f70",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shb5955835-0018-43c8-b762-7931379fb09c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh7fbff53a-2fd1-4976-ae8a-1c93a0423c5e",
                  "preps": {
                    "id": "sh7fbff53a-2fd1-4976-ae8a-1c93a0423c5e",
                    "label": "14:00-20:00 2:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a241",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a241",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shea799a39-b827-4e26-a15b-b71c8839471e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh6226d94e-cdbf-4a22-be67-752479b2f892",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh1a939dcc-f8be-44fd-acca-9de4d44fc1cb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shf0de149c-d39b-495c-87ec-e1ac38b923db",
                  "preps": {
                    "id": "shf0de149c-d39b-495c-87ec-e1ac38b923db",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb343",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb343",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "shf4de04f8-4c62-46db-8960-74b4945728da",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh7ac52b80-bb75-4b0c-ba4c-507b459ba052",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "she36fe5b1-52a3-44c3-904a-69fa20531482",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "测试人员对测试不良品有进行标识和记录，不良品放置在不良品区域内;"
            },
            {
              "id": "she532fd7c-e6a0-4cba-9c51-637e6b661761",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh4b1d2dd6-7432-4137-9e97-a1a426c2f235",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shd1e0b299-93ab-481b-b615-b7f286cf136a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh7e582ad2-5b16-4de2-9b83-fbbbab975491",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shfe3f7fc2-d777-479a-a304-5e1e84573114",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "2H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh4e208a3c-232e-43ce-bc4a-3149969eec3a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sha3159789-1e83-4a6c-bb90-5879a62477e3",
                  "preps": {
                    "id": "sha3159789-1e83-4a6c-bb90-5879a62477e3",
                    "label": "8:00-10:00 20:00-22:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a242",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a242",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh3e4d3933-5de9-46f7-bea5-2f8935131134",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shf8742163-7219-49db-aaa2-7bf803178854",
                  "preps": {
                    "id": "shf8742163-7219-49db-aaa2-7bf803178854",
                    "label": "10:00-12:00 22:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a243",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a243",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shf1f5fd22-d61b-482e-8084-a8621e183bd7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shc89b4349-b4cb-429b-9592-535a3b2bad33",
                  "preps": {
                    "id": "shc89b4349-b4cb-429b-9592-535a3b2bad33",
                    "label": "12:00-14:00 00:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a244",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a244",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shaedf0195-6d8a-4f86-8d61-007046648be2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shd41a01bb-9c2c-4753-9b46-f3a233c7a175",
                  "preps": {
                    "id": "shd41a01bb-9c2c-4753-9b46-f3a233c7a175",
                    "label": "14:00-16:00 2:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a245",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a245",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh0d9a43dd-b43c-4ad0-84bd-1e41b705d5fa",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shc15dbd97-a8dc-4b16-9052-e91ad1edc38c",
                  "preps": {
                    "id": "shc15dbd97-a8dc-4b16-9052-e91ad1edc38c",
                    "label": "16:00-18:00 4:00-6:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a246",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a246",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh94f038c1-5c53-4ac7-8150-7db67ba5e40f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sheb3c870f-b652-4ed3-b56d-887f7a2ac982",
                  "preps": {
                    "id": "sheb3c870f-b652-4ed3-b56d-887f7a2ac982",
                    "label": "18:00-20:00 6:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a247",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a247",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "she9098d9c-e658-4607-b6e1-e50e0df4c4c9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh56b85ad2-1cee-4fe2-a416-0e041e1cfef2",
                  "preps": {
                    "id": "sh56b85ad2-1cee-4fe2-a416-0e041e1cfef2",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb344",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb344",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh621fd6fc-4b70-477b-909c-93939c0b71ba",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh204ac5b2-61ef-4870-a8df-e8ced11f489d",
              "colIndex": 1,
              "rowspan": 5,
              "colspan": 1,
              "items": [],
              "cellVisible": true,
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "目检",
              "colWidth": "56px"
            },
            {
              "id": "sh0689347f-db83-4977-a068-8e7f5726c99d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "检查焊接面无空焊、假焊、倒角、短路、虚焊、连锡、少锡、多锡、包锡等异常；"
            },
            {
              "id": "sh8403aac4-08c0-4aa6-836f-980b8882ebe9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shdb02de8e-ea11-4352-aa24-47aa96355b53",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh33a10d9a-c7c4-48d0-9ffe-73cd40fdbc0e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh32b43e6d-f9b2-4ec4-8dea-77ae5a414ddd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh9c583123-67de-4f1e-b5f0-78beff4391d0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh24789cbf-48c0-4acc-9f6b-ed34c1f9a5da",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh5c62578c-12b6-4aca-82c9-51f0cfc378f1",
                  "preps": {
                    "id": "sh5c62578c-12b6-4aca-82c9-51f0cfc378f1",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a248",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a248",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh200416ea-9b1b-4840-93ff-ab1ae1554927",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sha17be59d-37f0-443d-ade8-55ddb073240a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shb3127ad1-4b5d-4458-8319-a036fb4f8d9b",
                  "preps": {
                    "id": "shb3127ad1-4b5d-4458-8319-a036fb4f8d9b",
                    "label": "12:00-16:00 00:00-4:00\t",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a249",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a249",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shef94f25a-f7f9-4a6f-bb78-f8578b3d89cb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh9e1bfb0b-46c9-4414-95ee-c6f43e2bccd6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh7467a1c1-1b56-4bcb-8540-15e8d49896ba",
                  "preps": {
                    "id": "sh7467a1c1-1b56-4bcb-8540-15e8d49896ba",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a250",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a250",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh8dc8add9-be18-4852-b62e-fd2a3c63b304",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh0a257c19-fe22-474a-9ebe-edef74aa53cd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh5e147860-6c5b-46c5-8882-1cabea7a1321",
                  "preps": {
                    "id": "sh5e147860-6c5b-46c5-8882-1cabea7a1321",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb345",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
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
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb345",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh5b465948-d006-4f58-bf25-0a9375d015eb",
          "colIndex": 1,
          "columns": [
            {
              "id": "she2b7c254-71eb-43fd-b76b-499b1f7f52a3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh8c60c404-f573-4d86-b66c-474513a04962",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "清洁后的产品无发白或残留物；"
            },
            {
              "id": "shd99bb9f9-d81d-491f-856c-2985585ec63b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shaea2fcb6-2e4c-446e-a84e-bf85d88ffc31",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh3800f10a-269e-4884-b9a1-163b0d8ee003",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh6fc9d244-bd64-4173-848f-0b6ec7e93a22",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh8796c6a3-6114-41ef-9c8e-964d50445fb4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh924a8767-15ad-42b7-8475-4b84a464423b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shb0d135a1-439e-4869-b0f1-67cb00cbb461",
                  "preps": {
                    "id": "shb0d135a1-439e-4869-b0f1-67cb00cbb461",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a251",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a251",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shacdc2fa3-0146-4773-abbf-d4496b1cea28",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shf8a2d5fc-a98d-43ee-89c4-0509f2cb1754",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh1cb62552-1d4e-49a6-880c-f1390ccb37ba",
                  "preps": {
                    "id": "sh1cb62552-1d4e-49a6-880c-f1390ccb37ba",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a252",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a252",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh46b15234-a2de-4fc6-9adb-c17b9fe1c538",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh6a98f234-623b-4406-a214-a2cabb3f6d33",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh44aa558b-7532-4c28-a39f-bce28441229b",
                  "preps": {
                    "id": "sh44aa558b-7532-4c28-a39f-bce28441229b",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a253",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a253",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh55a8405a-469f-4757-b17a-397ad9937804",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh3352880b-3d3d-4615-84b4-51c65da356da",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh3c68e583-5d62-4af7-b91d-e8ba23a99e2d",
                  "preps": {
                    "id": "sh3c68e583-5d62-4af7-b91d-e8ba23a99e2d",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb346",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb346",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh96c050eb-b1d8-4206-851e-2ef0e2f424fc",
          "colIndex": 1,
          "columns": [
            {
              "id": "shd5e34261-7ba3-4068-8824-96b71d0e620e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "she910dbff-ace5-4970-b74d-b64ce027a973",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "稽查拿板时用手指托拿板边，禁止用手握捏卡槽、屏蔽盖等部件；"
            },
            {
              "id": "sh2f45cb59-ed46-48de-8e33-872e208b3c09",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh8fbb5573-b4be-4d8a-be4c-36c6fc22b6ef",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shfceacabc-6550-4c7f-b518-3b81801e8e0a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh71632f4a-6cbf-4400-871b-8c18697c79d1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh22b602fa-5e06-44e5-a51e-d4f42009b78e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh72f2517f-99a6-40f2-a025-60d4e7bf1ef2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh6a3017d0-4c24-4dc0-a8e4-812a0d9976f9",
                  "preps": {
                    "id": "sh6a3017d0-4c24-4dc0-a8e4-812a0d9976f9",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a254",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a254",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh50ea9a8b-7e5d-4fbf-9b8e-a950fc29ada3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh04645957-c09d-41b3-943e-0062bb41bea7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shfcd315c3-2bfc-4846-b661-8e3839dc66df",
                  "preps": {
                    "id": "shfcd315c3-2bfc-4846-b661-8e3839dc66df",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a255",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a255",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh7b5d5a9e-f51d-4566-9798-3bc4412458af",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh8d07ba52-4b56-4527-8bf2-b11770c34b8b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shebc58087-ca31-4f95-9ab5-355077aa4934",
                  "preps": {
                    "id": "shebc58087-ca31-4f95-9ab5-355077aa4934",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a256",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a256",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh15608a40-78cb-4558-b958-805515456a86",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shc7a33b4a-bee6-40e0-baed-fd7d18c2aa35",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh82233116-d82f-4900-bd1a-e649af1355db",
                  "preps": {
                    "id": "sh82233116-d82f-4900-bd1a-e649af1355db",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb347",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb347",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh271cd1db-5134-4180-b526-ea8d0f43434a",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh1d9c3138-2fd6-46a4-89bc-6f4714ea0378",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh988f088e-f396-46b5-8cc6-e3d1ca7deae4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "无集中性批量不良发生(相同不良≥3pcs/H 时，第一时间反馈管理人员)；"
            },
            {
              "id": "shcfe3b1ed-c587-49dc-8681-1168652e7773",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "she0496f95-384d-41e0-b417-b95a661115c4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh567aa190-99db-4441-b797-ea50eca36a5b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh3782c593-7a6e-4e20-a39c-fb8ea8490c02",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shfc0ecd21-b325-42a7-a735-104e29bf310e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "2H/次",
              "colWidth": "76px"
            },
            {
              "id": "sha988d7fe-2282-4e23-85ec-495ab1893235",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shbdd2b4f9-79c8-447c-ad30-db1ae7ec4d45",
                  "preps": {
                    "id": "shbdd2b4f9-79c8-447c-ad30-db1ae7ec4d45",
                    "label": "8:00-10:00 20:00-22:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a257",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a257",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shbe4a8c93-2b28-46a1-99cc-087cc1b5f661",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh4d11c1e2-e298-4c39-acca-4ee220f1d482",
                  "preps": {
                    "id": "sh4d11c1e2-e298-4c39-acca-4ee220f1d482",
                    "label": "10:00-12:00 22:00-00:00\t",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a258",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a258",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shbf5eaf3f-aa5a-47db-b37b-26a4cffeec41",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh09e2cc18-b6ac-4e4f-bf75-94a09cf98f1a",
                  "preps": {
                    "id": "sh09e2cc18-b6ac-4e4f-bf75-94a09cf98f1a",
                    "label": "12:00-14:00 00:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a261",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a261",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh4087f696-d56d-4e69-9c80-8b4539daa1bf",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shf839c4f4-1f80-49cd-a8b9-e1832141f7ff",
                  "preps": {
                    "id": "shf839c4f4-1f80-49cd-a8b9-e1832141f7ff",
                    "label": "14:00-16:00 2:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a263",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a263",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh1847cafd-dd4c-4c67-83ed-59bea63854ed",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh8b3615ff-e876-43bc-915d-e5bfb6fdc1e4",
                  "preps": {
                    "id": "sh8b3615ff-e876-43bc-915d-e5bfb6fdc1e4",
                    "label": "16:00-18:00 4:00-6:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a266",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a266",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh5a5000c6-d463-4c41-a812-265cb377d0d5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh18e070cb-bf2a-40e7-b966-cddcbe79d981",
                  "preps": {
                    "id": "sh18e070cb-bf2a-40e7-b966-cddcbe79d981",
                    "label": "18:00-20:00 6:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a268",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a268",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh1e597e4d-0eab-4c25-8c90-5f7305798510",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh2eb00a8e-9ca0-4ea1-8cb4-f0fe6eeba63b",
                  "preps": {
                    "id": "sh2eb00a8e-9ca0-4ea1-8cb4-f0fe6eeba63b",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb348",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb348",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh263b1217-7315-48f0-b8e5-b9e7e0efcafd",
          "colIndex": 1,
          "columns": [
            {
              "id": "shbc47d1d9-147b-4fd5-b363-f6772ba1a612",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh4a53675d-adda-4bc6-9422-20ff5688715d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "确认目检后PCBA放入托盘中的方向保持一致或符合SOP要求。"
            },
            {
              "id": "sh90255d3d-9711-4cc7-acc1-d76c0d46f22b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shc7f7a389-854a-4f10-a2e2-a1b422a8880b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh629d913a-158a-4ee6-8e9b-0a64e186abcd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shfad44145-6fcd-4009-b91f-cb314a5fef5e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh4d60cb08-fbe8-4808-abc6-560f64dbf20d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "2H/次",
              "colWidth": "76px"
            },
            {
              "id": "shf2687b79-0ab1-4df3-a4ab-8800dd74d8dd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh2e0818b4-13b7-4c41-ab54-982198796c70",
                  "preps": {
                    "id": "sh2e0818b4-13b7-4c41-ab54-982198796c70",
                    "label": "8:00-10:00 20:00-22:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a260",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a260",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh787b1454-25ac-406f-98e7-e76083d9f6ff",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh49a61259-5fb4-434b-a6ec-e1b3b1ff504a",
                  "preps": {
                    "id": "sh49a61259-5fb4-434b-a6ec-e1b3b1ff504a",
                    "label": "10:00-12:00 22:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a259",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a259",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh88542217-a5a1-411e-a301-6f6b1fc258e6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh32fd8cac-cc42-4028-9528-55885414c46e",
                  "preps": {
                    "id": "sh32fd8cac-cc42-4028-9528-55885414c46e",
                    "label": "12:00-14:00 00:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a262",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a262",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shc6bd3450-a8e8-48f9-b905-2a4c3b3a5fe0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shc1125120-826a-458a-942b-5bdbeae0cca4",
                  "preps": {
                    "id": "shc1125120-826a-458a-942b-5bdbeae0cca4",
                    "label": "14:00-16:00 2:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a264",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a264",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh0cb00aa9-2a0c-4ee0-bc98-3192a875adc3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh808c15e4-038f-46be-9d7f-7a1194890a6d",
                  "preps": {
                    "id": "sh808c15e4-038f-46be-9d7f-7a1194890a6d",
                    "label": "16:00-18:00 4:00-6:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a265",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a265",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh75c02a1e-a7af-40b0-bec9-a59fb6a3950f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shddd7f77b-3e5c-4fc2-a3a6-f41d0e224abb",
                  "preps": {
                    "id": "shddd7f77b-3e5c-4fc2-a3a6-f41d0e224abb",
                    "label": "18:00-20:00 6:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a267",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a267",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shb783a136-283d-4c22-a0ff-d3da07541b22",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh209d2224-fcb2-4899-a166-489e1ac81b20",
                  "preps": {
                    "id": "sh209d2224-fcb2-4899-a166-489e1ac81b20",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb349",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb349",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh62d8ddc6-c784-4a8c-9287-0b41772ed69e",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh6cf8bf4d-acc7-4970-9da3-93842e1454f4",
              "colIndex": 1,
              "rowspan": 2,
              "colspan": 1,
              "items": [],
              "cellVisible": true,
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "包装",
              "colWidth": "56px"
            },
            {
              "id": "shd0007c2c-f00a-4f35-adc0-f9545fd0ef72",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "确认MES系统扫描录入，单件流作业；"
            },
            {
              "id": "sh19ce7ca7-9ce6-45ac-b924-01f3defc05e5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh7fdbeda9-40f8-49a0-9588-e7423147b679",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh399ef9d9-3656-4fd0-b139-bbd3dbda669f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh4bb19e57-47fd-4344-b012-09bd0781553e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shca1c1669-d424-494e-985a-d54e40fcdc2d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "shf559cb5e-40ca-4c18-a744-3e2c92cefc65",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh602ba871-3ab8-456b-9b31-3da54eeaa55d",
                  "preps": {
                    "id": "sh602ba871-3ab8-456b-9b31-3da54eeaa55d",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a269",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a269",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh5cae6968-4efd-4a54-a985-bfddd456161b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shd3359f21-5abc-417d-a614-845108fe9fd1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shac8a453e-0c63-4e9c-a59a-ad6b11cf097b",
                  "preps": {
                    "id": "shac8a453e-0c63-4e9c-a59a-ad6b11cf097b",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a270",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a270",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh866d8929-e2ee-4302-b072-cc720eb4f6e1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shdb6a786a-b75c-4b6f-89a6-8a6ab3042e6b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh85e23278-3e1b-4e63-b6c3-a0d90e15f72f",
                  "preps": {
                    "id": "sh85e23278-3e1b-4e63-b6c3-a0d90e15f72f",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a271",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a271",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh2cefa301-cb73-48a6-a9da-231c83c5c725",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shed00a9ba-2775-47ba-acb6-96c0c353226f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh4301c4ef-1cb7-4fe7-aefd-657f8b6e1703",
                  "preps": {
                    "id": "sh4301c4ef-1cb7-4fe7-aefd-657f8b6e1703",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb350",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "label": "备注"
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb350",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "shaf183a8e-4745-49c0-88cf-dc752192a3d1",
          "colIndex": 1,
          "columns": [
            {
              "id": "sha232c02a-a2a9-43e8-99c7-eeb3750288d2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh76443f14-5db1-4630-b378-5d819bfb202a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "确认现场封箱依照标签工单、出货地划分，进行独立包装作业。"
            },
            {
              "id": "shbc5d65e5-5607-4f25-b605-227a277d1a17",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh87c6ebf5-08c0-40ef-b844-93c38f28617d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shaff8ec5d-6c0d-4a39-8b09-ba13e5ebf66a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh6ccc7bb2-1e14-4b3b-99c3-b93e186c944b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh2303242e-2e8c-4b6f-a80a-87a15c3fc3d3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh58c40731-15ca-4417-9b8a-24fb17701189",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh9bd902bd-5694-436d-b622-bfae7e991164",
                  "preps": {
                    "id": "sh9bd902bd-5694-436d-b622-bfae7e991164",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a272",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a272",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shac006c2a-06d8-4779-b31a-837942d69dcf",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sha345ff66-5778-4ccb-a108-5697049738b9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shb011b763-cc1d-4229-b7ed-efee35ce653d",
                  "preps": {
                    "id": "shb011b763-cc1d-4229-b7ed-efee35ce653d",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a273",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a273",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shf8cdee80-393e-403a-9d36-6a64a0eb02c0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh50883bee-244d-4538-934e-1b10c847163a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh8b8b2032-9d86-4be4-8bb0-6e9be7d8db28",
                  "preps": {
                    "id": "sh8b8b2032-9d86-4be4-8bb0-6e9be7d8db28",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a274",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a274",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh5226211d-98c6-4e0e-8f33-546975bfee3b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh3a8e5a97-db00-493c-be2a-dd2785e3c205",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shcbdca02f-33c8-49fe-919f-71d45f2fec94",
                  "preps": {
                    "id": "shcbdca02f-33c8-49fe-919f-71d45f2fec94",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb351",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb351",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh25432170-f31a-4b72-8f2a-74116c772832",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh7362406a-efd9-4013-ab04-e515b83b44c2",
              "colIndex": 1,
              "rowspan": 4,
              "colspan": 1,
              "items": [],
              "cellVisible": true,
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "线外维修",
              "colWidth": "56px"
            },
            {
              "id": "sh502591de-5525-4925-ab28-c67032faa9f0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "烙铁使用前有经量测（温度及漏电压）其结果确认符合规定并作记录；"
            },
            {
              "id": "sh60105f42-a50c-4b33-9333-d2d851b5bf30",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shb461842f-ccc4-46a5-bcff-a944b469e10a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "she6940905-cfdc-4f7a-b96f-ede2b0a70a58",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh361a02c2-f972-4fb3-90e0-71800c4ea154",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh0407bde5-cf5f-4475-abcb-fda205e8af85",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "每班2次",
              "colWidth": "76px"
            },
            {
              "id": "shc0caf2c1-b4d9-42e0-82ca-3916ef423d23",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "shff482056-ee19-4fb5-87e1-7b3236124f69",
                  "preps": {
                    "id": "shff482056-ee19-4fb5-87e1-7b3236124f69",
                    "label": "8:00-14:00 20:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a275",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a275",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ],
              "colHeight": "41px"
            },
            {
              "id": "shdbaf9d9d-3293-43b5-ba89-cdcc09278a02",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shfd22a3e9-04d5-4352-85f1-be4c1b982d2b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shd7640e72-720e-4513-9ca9-b9279698447b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 3,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh6762ac39-551f-46e0-80dc-c99d4aef9453",
                  "preps": {
                    "id": "sh6762ac39-551f-46e0-80dc-c99d4aef9453",
                    "label": "14:00-20:00 2:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a276",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a276",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh5b7db35b-ef52-4d4d-a337-9f6fb06e6fc2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh29d0e72a-9339-4a2e-8910-2ee7113f04f2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh356ef1f7-5536-4c2d-ba30-dd1ddd4c05d8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "she19fdd85-11f3-418d-8a2b-7629924b5380",
                  "preps": {
                    "id": "she19fdd85-11f3-418d-8a2b-7629924b5380",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb352",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb352",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "she40257a7-c326-45a0-945e-7c994e7809b9",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh2d5bb477-5660-464b-81c2-55f1a25411c9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh8f14d472-840e-4dfc-87c1-e3f6a49b00bd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "物料盒内的物料确认做区分（良品、不良品）并确认料号正确；"
            },
            {
              "id": "sh16f299a2-0a5e-4732-b331-779c80eaa2e0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "she93f8c8c-55db-4010-97d6-6abcb59a7772",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh925f74b9-a08b-4e35-ac9c-e50e9f6800d9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh77e644a3-3eec-4174-af22-f5bcbcfc194d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shf2ee3ec3-e11b-4159-9839-61bac5aaf288",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh28828538-d123-4cc3-8f56-44e84a698a3d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh9fbad37b-cfde-46d0-ae47-f3e114800c41",
                  "preps": {
                    "id": "sh9fbad37b-cfde-46d0-ae47-f3e114800c41",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a277",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a277",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh30e9f553-bde0-441e-8390-9f7d70b292e5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh86eb1fae-80a2-49b2-b668-985ed5afa2ef",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh71679e6e-3c1a-4cdf-9f64-5680f1569fa7",
                  "preps": {
                    "id": "sh71679e6e-3c1a-4cdf-9f64-5680f1569fa7",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a278",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a278",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shad457bcd-1362-4f5b-aae4-610988e6ae2b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh525dba7d-08b7-45ad-911a-1d1296e139cd",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shbbb36e4a-9fe1-42c8-ab39-a3726719e327",
                  "preps": {
                    "id": "shbbb36e4a-9fe1-42c8-ab39-a3726719e327",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a279",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a279",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shc7373b8d-5fc0-4909-b2bc-56edf86a2733",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh3f952990-0dbf-4b5a-843e-55c04f570312",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh2aba9856-d8a9-4c0b-a901-9723e92635a0",
                  "preps": {
                    "id": "sh2aba9856-d8a9-4c0b-a901-9723e92635a0",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb353",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb353",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh12ddc9c4-6442-44de-9970-dae7ec237885",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh6e6abf82-1e97-41ed-862c-9599081ee68b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh4152d2d2-0454-4b6d-a06b-cd0a12456fec",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "维修OK的产品及待维修产品确认有做区域划分并做状态区分；"
            },
            {
              "id": "sh6ff9ae44-521f-447b-9897-e1e6cec3d808",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh64bee047-ebc0-4bb7-9b7d-dfc8a0d6ca8a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh7e309537-7c55-4bfa-acfd-b1cc036aebfc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh1411de08-dbd6-425b-b226-67fac488ca79",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shf809ea08-b333-458f-958b-8ba9653e1de2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh6cc69f48-a533-4851-94a0-c30cb54a7950",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shc58def19-d8fe-4c6d-bfd1-ccb7844115d9",
                  "preps": {
                    "id": "shc58def19-d8fe-4c6d-bfd1-ccb7844115d9",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a280",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a280",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh193256c9-c720-4fa3-b486-79731eded9a4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh7062725e-7029-47c0-b205-9762ccca62e2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh7e3c9f3f-fe2b-45da-805f-d19c8a1ebdbd",
                  "preps": {
                    "id": "sh7e3c9f3f-fe2b-45da-805f-d19c8a1ebdbd",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a281",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a281",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh296c9e32-1c6c-41a2-bfc6-7cec1720fd7e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh01cf7e5a-8cad-4d19-b0d2-ecf7557052f2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh93d540fb-1ea9-4b88-b5f6-4fb243698187",
                  "preps": {
                    "id": "sh93d540fb-1ea9-4b88-b5f6-4fb243698187",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a282",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a282",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sha1953a76-02b5-4151-a100-68d848ea3eef",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh4c4d3bae-19c8-4972-9c71-c61512414e1d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shea5131e0-d785-47aa-a606-06294ca208c1",
                  "preps": {
                    "id": "shea5131e0-d785-47aa-a606-06294ca208c1",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb354",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb354",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh07ab78fb-8ff6-43d1-ad01-679e87f475cc",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh2d7adf6c-0bf1-439b-9410-f5a22fa6078e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh7a9b0792-a31d-4f9b-af90-5ee45ef13b32",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "针对维修外观不良及功能不良系统必须走返修流程。"
            },
            {
              "id": "sh29c7a7b5-18f8-41bb-af64-2f7d9f4ebf2f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shc22fc1bd-1426-415f-9439-9b2548da0f4c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh61a144bf-1c92-481a-bc68-a30470a86b05",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh302e881d-44fe-463b-a786-a72167c56e75",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shd7af87ed-6506-46df-ae0d-3c85b51a5ab2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh4cc8132e-03f8-46c5-80a6-c357a7b31efb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shb0a63491-800f-4a12-8a6d-4e49b0d9684d",
                  "preps": {
                    "id": "shb0a63491-800f-4a12-8a6d-4e49b0d9684d",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a283",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a283",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ],
              "colHeight": "49.66666793823242px"
            },
            {
              "id": "sh76b66b0c-d369-4e25-8817-1d46fbe0f5de",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh93dc2246-4016-40dc-aaf8-a202a60c7b2f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shec1f8955-89ab-43d2-8f7e-1eaf627ecea7",
                  "preps": {
                    "id": "shec1f8955-89ab-43d2-8f7e-1eaf627ecea7",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a284",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a284",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh23b10f86-c8a7-429d-9cfa-2fb4e86a893d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sha71606b7-9561-4c31-9ef2-5bd8b1bfd838",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shacf7452c-821a-4523-9cbc-3502add3b099",
                  "preps": {
                    "id": "shacf7452c-821a-4523-9cbc-3502add3b099",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a285",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a285",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh83d3b5fa-b894-4a00-99f7-ef236804be6a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh9ca4d171-237e-4432-bfa8-bc4f4e5f9dab",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shb1ba4e27-782c-472a-886e-bacde9d7200d",
                  "preps": {
                    "id": "shb1ba4e27-782c-472a-886e-bacde9d7200d",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb355",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb355",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh5be436be-c749-4d23-a467-f583e59c9c96",
          "colIndex": 1,
          "columns": [
            {
              "id": "shbc48148e-20fb-4da8-a491-0ac9af79a083",
              "colIndex": 1,
              "rowspan": 3,
              "colspan": 1,
              "items": [],
              "cellVisible": true,
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "设备\n管理",
              "colWidth": "56px"
            },
            {
              "id": "sh65f3bf56-77e4-4051-9e77-550410d99717",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "测试仪器确认进行校验并贴有校验标签，确认在校验合格有效期内使用；"
            },
            {
              "id": "shcbdf92bf-7639-4b4c-8a39-ef6535a70c56",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh86346cf7-4da1-40cb-b10e-8e81a53cf41d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh005ff46d-b04b-42e3-891b-069646425c96",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh5f13d98c-e472-4c51-a7af-d4d55a60dc4e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh327d0666-c481-4cfe-8b79-cfa3d6f30de0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "开班",
              "colWidth": "76px"
            },
            {
              "id": "sh227180db-dd43-4daf-a1dd-25b61dbb95c8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 6,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh9e06a820-c888-4a5e-8f97-8d85f429f47e",
                  "preps": {
                    "id": "sh9e06a820-c888-4a5e-8f97-8d85f429f47e",
                    "label": "8:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a286",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a286",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shc5b1cab2-cd72-4f7b-816f-6f8284fb695f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh2be0bf8e-d7e1-48ba-b8d0-94b7660762e8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh448c7fa3-6831-440c-9b81-3df5d7acc53f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shaeb5643e-dd8b-4f23-80e7-6d00b731dc6c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh71e56a14-b905-4d88-b633-ada5e9ec9241",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh8010fb51-d243-42c4-bf89-11d627608a8b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shd7101577-6f43-4b42-aad6-fabcc4dd5c3e",
                  "preps": {
                    "id": "shd7101577-6f43-4b42-aad6-fabcc4dd5c3e",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb356",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb356",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh2a45a4db-9392-476c-b347-f6d55966bfa8",
          "colIndex": 1,
          "columns": [
            {
              "id": "shebf163f4-5f7c-4851-a476-3a856429c1b4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh96b03d39-b15a-4e98-996e-eadbed9feb4b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "设备地线确认良好接地，维护及点检并记录；"
            },
            {
              "id": "sh2bbfc415-98cd-4326-82f0-b02290574ca7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh5bef6ddd-8078-4e0f-bd73-c044d8de8526",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "she44343b8-7037-4f76-9f4d-b5c7ceac9e9a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh7388fe40-ec5a-4cef-b9a1-5b52d3e0f015",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shfd917904-31cb-4868-b81b-0858e059037b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "开班",
              "colWidth": "76px"
            },
            {
              "id": "sha14b5b83-3f34-48e5-a3a2-0f2b0caa1303",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 6,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh7a9f66b3-0e61-426d-8e97-93ed4b4c4992",
                  "preps": {
                    "id": "sh7a9f66b3-0e61-426d-8e97-93ed4b4c4992",
                    "label": "8:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a287",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a287",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shf7430c55-4743-4f3e-8704-8dafa13c86b9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh4787f078-f82f-41db-b668-2e073047a49a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shc73cd662-531e-4e3f-a66c-51302cc83eb0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shbd735e14-6da0-4b86-a582-210f07587935",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "she628996e-8332-49dd-82c2-76bf606915ab",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colHeight": "40px"
            },
            {
              "id": "sh4930f62c-001c-4888-b4e5-2162a26ced5b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh6031e469-962e-41c4-b40d-7ffaae92fb29",
                  "preps": {
                    "id": "sh6031e469-962e-41c4-b40d-7ffaae92fb29",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb357",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb357",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "shf180dca8-e27c-4e45-a6f3-a8daf4cd6b85",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh7da963e8-28f4-497f-b5e1-03f9cd1268c2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh2918675e-5ca1-4599-b3bb-043028b9e8f1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "在线治具确认进行验收并粘贴验收合格标签；确认各工序测试夹具与夹具共用清单机型或者SOP机型一致；"
            },
            {
              "id": "sh6c6c6afe-405e-47a5-8c11-f74e0c50c31f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh537010cf-2f18-45bf-8dc3-bc077ed40d83",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh6e054531-3048-4ed8-aac1-0585424d0809",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh6e7bdb58-95a3-40b3-9e25-ecac49bfb175",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "she8ea5e33-ddaa-4be1-8ac8-8d73748261eb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "开班",
              "colWidth": "76px"
            },
            {
              "id": "shde794368-125e-4010-aec4-011e1f737d19",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 6,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh79c5297e-757d-4fa2-8283-9c64375ee9f0",
                  "preps": {
                    "id": "sh79c5297e-757d-4fa2-8283-9c64375ee9f0",
                    "label": "8:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a288",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a288",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh54af0416-de97-4a7c-8c45-de4e3395af89",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shc8d9a327-3a00-421e-9144-e2a6df9388c3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "she2fb9166-ac8b-44a7-9aea-e368c780df24",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh6d5a03c9-a200-4403-8ffd-5b38b4460baa",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shdc6c908c-db82-4c9a-bcac-d761e2fecb10",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh09b95842-7c06-4e03-8850-ea7a49a14217",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh05209483-37d8-457c-af9f-4e70f2b81bd4",
                  "preps": {
                    "id": "sh05209483-37d8-457c-af9f-4e70f2b81bd4",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb358",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb358",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "shabb5f24a-539d-4960-a53b-37e137a96f47",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh3716c434-1f79-4239-8064-4bb91918bf0c",
              "colIndex": 1,
              "rowspan": 2,
              "colspan": 1,
              "items": [],
              "cellVisible": true,
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "不良品\n  管理",
              "colWidth": "56px"
            },
            {
              "id": "sh51742a74-c567-4adb-8cd3-a9833912cf4c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "不良品有明显标识、区分、并按要求进行准确真实记录；"
            },
            {
              "id": "sh36252a65-8772-4a9d-8f1a-805bdab11c4f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shfe0d8058-ef7f-4b1f-bb65-17b58ddbf956",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh4559c0ce-4509-46ea-84ac-835b3a56388a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh1894c8ed-ea16-4ef1-82cc-10b9dc8db0c9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh714ff14a-d05a-4bf8-af72-50d35664f02c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh147ed1ed-0e32-4d4e-bc55-cdae4369b555",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh4a2a42b7-ba3b-4972-b8d7-21e71b282c02",
                  "preps": {
                    "id": "sh4a2a42b7-ba3b-4972-b8d7-21e71b282c02",
                    "label": "8:00-12:00 20:00-00:00\t",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a289",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a289",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh3bf2d8f0-d1e3-4f7c-b9ff-c0d5d08970ea",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shcec5e44c-8a03-44a0-b198-cf3926d96636",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh7e6ddc6b-5bbf-483e-b77a-f1439c93c130",
                  "preps": {
                    "id": "sh7e6ddc6b-5bbf-483e-b77a-f1439c93c130",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a290",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a290",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shd1fb6e00-dc8c-4c65-bf29-f65586534eeb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh888da567-e3e5-4ea1-9ab4-77bb91167cb8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh53ee78a9-cbdc-4dd7-94ce-aa013ab35828",
                  "preps": {
                    "id": "sh53ee78a9-cbdc-4dd7-94ce-aa013ab35828",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a291",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a291",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh00d541f3-4679-4dba-9613-84ee8d3bddfe",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh73b7672c-eea0-4cfb-b217-49cf0d5764f1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh3579227c-eaad-411a-aef2-4f0bafbe72cd",
                  "preps": {
                    "id": "sh3579227c-eaad-411a-aef2-4f0bafbe72cd",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb359",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb359",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh681a741d-7dd0-4aef-a420-954159b64688",
          "colIndex": 1,
          "columns": [
            {
              "id": "sha812b91f-cae9-4ddc-b758-6f37139b801b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sha4787d43-6449-44b0-b540-14454a17d9f9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "不良品需要在1H内处理完。"
            },
            {
              "id": "shc2849fc4-ae2a-4355-b9e4-39753f9d7ee3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh21cf0756-983c-476a-a992-a14c64283e2d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shd6a1ac60-5ebf-4773-872b-c3d6bd5fd6b0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh80864ed2-7b8c-42f7-80cf-17e8426c5e45",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh7a4feaed-9907-4fa3-acbc-cf87becbd67e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "shcb2fb526-faf9-4df7-93f8-a738299b207d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh8252e065-5e51-4316-bf19-a8bad0fa354e",
                  "preps": {
                    "id": "sh8252e065-5e51-4316-bf19-a8bad0fa354e",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a292",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a292",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh9706b76c-6189-4da7-9382-49d5fc31d6bc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh8000129b-6c7c-45bc-be83-579be260beb1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "she1c50a55-4bdb-4bc7-9ff3-e4dd92a29502",
                  "preps": {
                    "id": "she1c50a55-4bdb-4bc7-9ff3-e4dd92a29502",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a293",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a293",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh32720c83-73af-48b1-9e68-4d6ca6ff7101",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shd3a150ed-2550-4cdb-9525-44e7c561c478",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shffb40040-28c1-4a63-a5bd-4fea2a877c02",
                  "preps": {
                    "id": "shffb40040-28c1-4a63-a5bd-4fea2a877c02",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a294",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a294",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "she3de87ab-45d3-4d9d-8c04-2c36f7947e8b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shed5a7e88-1b80-431d-8edd-0e1d40798c60",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shcba42cd5-7db6-424a-9f41-56192005a54a",
                  "preps": {
                    "id": "shcba42cd5-7db6-424a-9f41-56192005a54a",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb360",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb360",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh094b00aa-8ab9-4c85-b6ac-00fb0de92271",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh7ce43f1a-3b04-41f5-909b-c1b2fd169e30",
              "colIndex": 1,
              "rowspan": 9,
              "colspan": 1,
              "items": [],
              "cellVisible": true,
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "其他",
              "colWidth": "56px"
            },
            {
              "id": "sha45e1f6e-742c-498a-a58e-39a36fa801d6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "各操作岗位作业指导书为最新版本；"
            },
            {
              "id": "sh8b0b13aa-d67b-46e0-8ca7-5c83312b79c9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh1569fc00-58de-490d-9232-308f6e6442ab",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh61673bb2-30ba-4ed7-bc14-daac8d33bc47",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh082fb73c-ca12-4c32-adea-560fbd1472f8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh0dea7995-3bff-4e9e-be06-d8f3fb947a01",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "开班",
              "colWidth": "76px"
            },
            {
              "id": "sh4bdb3525-19c1-446b-9087-d50be30334b7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 6,
              "cellVisible": true,
              "items": [
                {
                  "id": "shadf4c34b-1179-4b6f-83fa-48f48197fb72",
                  "preps": {
                    "id": "shadf4c34b-1179-4b6f-83fa-48f48197fb72",
                    "label": "8:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a295",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a295",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shc2013002-3bf1-4310-b511-c1eb28b616d4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shf866a53a-9c5f-496d-89fb-d2f1ee0e7ed2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh67c39329-182b-41ac-bf2b-523bd23be320",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh560cb967-246d-46c1-9818-ad059e3d8363",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh0fc7fe9b-b4a5-4bd0-a09c-6a6abbc836cb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sha234c408-8b1e-4717-84a7-60ff30319da3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shd4325eaa-ce31-438a-a941-2182662689d1",
                  "preps": {
                    "id": "shd4325eaa-ce31-438a-a941-2182662689d1",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb361",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb361",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh25521bd1-6047-4430-98e5-d526f6e53a29",
          "colIndex": 1,
          "columns": [
            {
              "id": "she3d242ed-ac59-4ad3-b0ec-404587bbf496",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh4d3a72e7-18a6-418a-8e7d-57d0d9d2cc40",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "按要求正确佩戴好防静电手环&静电指套等防护措施；"
            },
            {
              "id": "sh96e99081-72bf-47a1-a9c9-72aa7e669eb3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh46adf787-df91-488c-b1e0-3ffaa68293e0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shdc1c7963-95ea-46e2-9044-0efcbdffbd37",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh07081383-4a01-4bac-8fe9-3d47865755df",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh060104a4-3b34-433c-87dd-b210ed331e04",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "开班",
              "colWidth": "76px"
            },
            {
              "id": "shc211aad4-cb49-4360-bf50-d8342cbed5b3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 6,
              "cellVisible": true,
              "items": [
                {
                  "id": "shbffc4073-ee68-47ac-95f5-6b9df9fbf8ac",
                  "preps": {
                    "id": "shbffc4073-ee68-47ac-95f5-6b9df9fbf8ac",
                    "label": "8:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a296",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a296",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh0c3b6b17-3bc5-4fb5-9f7e-a8fe99099297",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sha8c42024-eb4f-4779-b800-d359634aa160",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shf406dcd5-f3b5-4a7b-bfd8-c93411a06edc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shbe943c2d-c03b-405e-8419-568ed2f68f40",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh9ac93166-e2db-4747-bd33-0e09b4189821",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sha4db66de-b15b-4d34-b401-17482be8e493",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shab28f88a-d74f-4419-90ca-4ac76d8c8306",
                  "preps": {
                    "id": "shab28f88a-d74f-4419-90ca-4ac76d8c8306",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb362",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb362",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "shd0dcc015-1994-4648-84cc-99b4481ccd1c",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh82b86736-c70a-4c63-82dd-69522602dab9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "shaa03e1e3-b79d-498a-8388-18c0b86e257e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "关键/特殊岗位员工有上岗证；"
            },
            {
              "id": "shc1c93b07-daa4-418f-8673-ac208efaa860",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh4c7eb755-01c0-44b7-90be-9296ed0c8a13",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh93cf6355-87b6-417b-8494-14d07f7126d7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh521a482a-3daf-4b66-9cda-05a24d21d434",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shd04ea953-e6a6-4085-aebd-b26617047602",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "开班",
              "colWidth": "76px"
            },
            {
              "id": "shd84800d8-90e7-4ed3-adb8-99cf66c21af4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 6,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh964cc660-8921-4346-8b2d-fe702c35545f",
                  "preps": {
                    "id": "sh964cc660-8921-4346-8b2d-fe702c35545f",
                    "label": "8:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a297",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a297",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shcc53c811-b3ae-46c3-802d-4cd33f9e5e3d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shd613c577-960e-41b7-9ca5-3f1668c05cec",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shbea9e8f9-f87e-462d-acb5-75ac9f522402",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh6d069af8-a01b-4884-adce-ca12931f5641",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh2ce8e7cb-b4ed-4abc-ac79-04c63e823839",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh22b5851a-0bb9-4c09-a696-aba37f51bf85",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh60efc6a4-0938-487a-ba1b-e6b8f8b80495",
                  "preps": {
                    "id": "sh60efc6a4-0938-487a-ba1b-e6b8f8b80495",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb363",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb363",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "shebda807f-ea9e-47ce-8ee7-d7f324cb59b7",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh25b29649-9617-4b3e-b14c-e098691c8735",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh1ef53242-df0b-49dd-a72e-d669dda155d2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "生产场所清洁、整齐、温/湿度点检，无异常；"
            },
            {
              "id": "sh885c7c71-3c84-4435-8130-bee94d7c99c5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh58f4a85d-7553-42d0-9255-4a3271b768c5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh53a964b3-3d61-44e1-815c-8c6396f3c957",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shd597df74-461b-4f6c-8224-f1c3d1d5ef31",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh3180f94b-2697-471c-b96b-43764b996bb5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "开班",
              "colWidth": "76px"
            },
            {
              "id": "shdbb31b10-b487-496b-aa9e-138329005877",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 6,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh392b6ca8-4c4e-4869-afc1-743b1cd683c7",
                  "preps": {
                    "id": "sh392b6ca8-4c4e-4869-afc1-743b1cd683c7",
                    "label": "8:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a298",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a298",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh0cf3508f-6381-43ae-a3af-ba2722f3de21",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh890f4768-bb35-4132-86e2-846cb8064121",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh22cc49c0-c271-43a1-8985-ace7da5953d9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh8e53fb86-c1be-418a-9951-a23833e902d6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh1873cb02-8c28-4a84-a4a1-867ae8685ccc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh2d0a43aa-f515-4fab-8465-9791a780120c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shd92c0835-0f41-45d5-87e1-c7147ba7ef63",
                  "preps": {
                    "id": "shd92c0835-0f41-45d5-87e1-c7147ba7ef63",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb364",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb364",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "shb91deb99-1f22-49d4-a41c-82daf2fac2c4",
          "colIndex": 1,
          "columns": [
            {
              "id": "shd838d2d3-9fef-4c26-8b13-ee2c2275537d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "shd97aa145-f252-4682-954d-7c51fbc60042",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "各工位报表记录及时、准确、真实填写，按要求审批；"
            },
            {
              "id": "sh1b95628d-f5f4-4981-85b0-352183ea8dd0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shdfffd27b-1534-4636-a453-9606da6997f8",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh3d50840c-85a4-47c7-b068-41e79951f0e5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shc005414c-c956-4df2-b190-5eec076c531d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shfc1564ab-aa02-49d8-82a4-63516e498cdc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "shbd895b76-ca9a-4ce0-ac35-7bdc0db849a1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh33e5c03a-703c-46dd-b7ab-0585c67bacab",
                  "preps": {
                    "id": "sh33e5c03a-703c-46dd-b7ab-0585c67bacab",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a299",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a299",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh22f8f3ea-7ad3-4d39-ba41-d8493145429c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shceb29ecf-f2a5-4c83-910d-4fa837828839",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh780e4d3b-76f8-49b7-a5e2-5bfa047b91fe",
                  "preps": {
                    "id": "sh780e4d3b-76f8-49b7-a5e2-5bfa047b91fe",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a300",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a300",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh4cbb82b8-8fce-4d82-ba1b-b1e6df752587",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh81a470e9-5f56-4b04-86a7-9d5d69b91216",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh32e10d0e-63a3-472b-aac0-5e6c156625bf",
                  "preps": {
                    "id": "sh32e10d0e-63a3-472b-aac0-5e6c156625bf",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a301",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a301",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh35fc78a8-0d18-4090-9242-7680b947a309",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh06a18e63-075b-4ffe-94fd-cd0fe3db5296",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh2466cabc-d4f2-447c-9882-269566ad814d",
                  "preps": {
                    "id": "sh2466cabc-d4f2-447c-9882-269566ad814d",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb365",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
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
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb365",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh410f742b-1296-41f1-90b6-816f973e24a3",
          "colIndex": 1,
          "columns": [
            {
              "id": "shc9babb26-c406-4d9f-8dec-b1f635cd05f7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh01a2e8d8-f7ac-4108-90ec-853045a086cb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "生产过程发现4M变更按流程提交确认；"
            },
            {
              "id": "shfc7ef78d-b3b8-486d-97dc-8f38d9e3ce11",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shc98fd977-7ff9-41f0-b506-becee0a47735",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh914c5bc7-4371-4f54-b075-2757bc6467a3",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh6e747542-c727-4ad8-ad02-fb8c15133d0d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shdbe8aa84-8ffc-4417-b254-1819b802dafc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh73651c62-8cce-44ff-b99b-d9ad07fe0382",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh032644d2-4f78-453d-a0cf-a4e12bf540ab",
                  "preps": {
                    "id": "sh032644d2-4f78-453d-a0cf-a4e12bf540ab",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a302",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a302",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shbc03860a-4fd7-4b2a-ba03-5a47277e7b4d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh8ae09042-a35a-42d1-9b6f-0abead03cc7f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh57dc7b2a-2e55-460f-b9c6-30392da51958",
                  "preps": {
                    "id": "sh57dc7b2a-2e55-460f-b9c6-30392da51958",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a303",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a303",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shbe160bdf-386a-4ed4-bc23-a9584d2544fe",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh33f4c71a-84b6-4fbe-a545-9c263bfe8f7c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shbc274d65-cafd-4053-9345-4ec4fd3576bd",
                  "preps": {
                    "id": "shbc274d65-cafd-4053-9345-4ec4fd3576bd",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a304",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a304",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shd008fcb2-d5f3-4887-9b8f-25cc2ddd8ad6",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh9600aecb-f5af-4d61-a2ee-4c20d42f0c26",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shb0ecfa32-3629-444a-8fff-c232d8c6c956",
                  "preps": {
                    "id": "shb0ecfa32-3629-444a-8fff-c232d8c6c956",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb366",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb366",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "shed1c54b2-c249-4970-849c-f1a0815c8aef",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh081da6f9-f5a6-4ccd-bf53-a796c85a5c0d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh510b741c-332d-4fc0-b13f-cfe8a7a74370",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "确认作业员操作手法与SOP一致；各工位生产叠板作业和存放的情况"
            },
            {
              "id": "shc98412d2-6daa-423b-a69a-fd816e962312",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "sh44c750dc-6133-4604-9975-27b27b8c31ca",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh0519b4a7-9175-456e-b62a-ceac61522e97",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh0b42a090-19ca-479b-a034-81b505db578e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shfe9d8cf6-406f-4661-bf6d-602cc5b07d76",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "2H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh68675a8c-3c15-4991-8317-f714c40f01b9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shbed38e77-feb8-43b4-856f-d02db44cd291",
                  "preps": {
                    "id": "shbed38e77-feb8-43b4-856f-d02db44cd291",
                    "label": "8:00-10:00 20:00-22:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a305",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a305",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh78aa35c9-b948-410d-be86-fdef6bcd9aeb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh216a1c88-a2bd-4c01-ada7-80a009c3b219",
                  "preps": {
                    "id": "sh216a1c88-a2bd-4c01-ada7-80a009c3b219",
                    "label": "10:00-12:00 22:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a306",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a306",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shef0b39cf-62f9-4f02-9a3f-70c37ce6083d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh9da7a1ad-a0ae-4764-ade9-a347b4c3a56d",
                  "preps": {
                    "id": "sh9da7a1ad-a0ae-4764-ade9-a347b4c3a56d",
                    "label": "12:00-14:00 00:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a307",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a307",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh19bc7c38-44bd-4b12-af97-d526863eb48c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "she9c79765-29b4-4ff4-a48d-b7a0e4251583",
                  "preps": {
                    "id": "she9c79765-29b4-4ff4-a48d-b7a0e4251583",
                    "label": "14:00-16:00 2:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a308",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a308",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shf1330e30-4a0f-4cb2-9145-7c1bda722364",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shdc536361-7974-46ea-9f26-3f7dd538b1e4",
                  "preps": {
                    "id": "shdc536361-7974-46ea-9f26-3f7dd538b1e4",
                    "label": "16:00-18:00 4:00-6:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a309",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a309",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh908cfe9a-1324-4056-81ca-02b87cd1faf2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh42daf165-5d44-470b-9f20-b98e29658db1",
                  "preps": {
                    "id": "sh42daf165-5d44-470b-9f20-b98e29658db1",
                    "label": "18:00-20:00 6:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a310",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a310",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh2aee1535-b3a4-474b-be61-de3f42ea5f3a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh0ab3f3b2-a63c-4f77-a6df-8f419ce1158b",
                  "preps": {
                    "id": "sh0ab3f3b2-a63c-4f77-a6df-8f419ce1158b",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb367",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb367",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "shd15cd108-6843-4b73-826d-35367da51b02",
          "colIndex": 1,
          "columns": [
            {
              "id": "shcd20b572-109f-4b9d-902c-38389af856db",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "shac417200-b159-4e05-a62f-7fa1ed9cd629",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "生产线辅料（酒精、洗板水、防潮油等）是否有做标识，标识是否清楚。"
            },
            {
              "id": "she13c318c-f0f5-4197-9698-e23673292846",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shbe09eb9d-23b9-4256-8e7c-e3016033f912",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh74948f62-23bd-4ab5-96e4-bb70ee72c4c7",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh1e9ca552-4601-4679-9c61-223a3934cd1b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shd9fdf092-233a-46c1-b4c8-3fce09a47912",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "2H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh03658320-1763-44c2-aa98-a3a6bdcbd505",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sheef350d8-5f9f-4836-a4dc-7f74bbd49f66",
                  "preps": {
                    "id": "sheef350d8-5f9f-4836-a4dc-7f74bbd49f66",
                    "label": "8:00-10:00 20:00-22:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a311",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a311",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh7b9de211-771b-41e7-a962-59693ae436c4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shae80889c-6acc-4fd4-a7cd-5ecf5d249f11",
                  "preps": {
                    "id": "shae80889c-6acc-4fd4-a7cd-5ecf5d249f11",
                    "label": "10:00-12:00 22:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a312",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a312",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh570ace94-f782-4d2f-8eb7-957040487283",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shc1251a3b-8415-45aa-a066-82b9057676db",
                  "preps": {
                    "id": "shc1251a3b-8415-45aa-a066-82b9057676db",
                    "label": "12:00-14:00 00:00-2:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a313",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a313",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh134e4a59-b022-4f1d-b8bf-b51551c72110",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh3ab888a7-a745-41aa-9db0-9b24e82d66f7",
                  "preps": {
                    "id": "sh3ab888a7-a745-41aa-9db0-9b24e82d66f7",
                    "label": "14:00-16:00 2:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a314",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a314",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shad714194-57f9-4226-94f0-be22a5a31101",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "shc82b723f-dae3-43a3-a200-09ee0ed37c53",
                  "preps": {
                    "id": "shc82b723f-dae3-43a3-a200-09ee0ed37c53",
                    "label": "16:00-18:00 4:00-6:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a315",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a315",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shf7af8a29-155d-44a0-afdf-4a0a09992020",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh132b08c2-95ac-42c7-a684-fb23de9a61de",
                  "preps": {
                    "id": "sh132b08c2-95ac-42c7-a684-fb23de9a61de",
                    "label": "18:00-20:00 6:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a316",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a316",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shfcf3833d-c1b4-403c-8b94-d37d334a8fdb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh17cc0c72-b6ce-492b-bc7f-0ea62727ed4f",
                  "preps": {
                    "id": "sh17cc0c72-b6ce-492b-bc7f-0ea62727ed4f",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb368",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb368",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh267b6f06-2f8b-4742-b215-2a6cbc4b86ea",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh8ffa85dc-9d98-4e72-a4be-c4a4f5dd2672",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "items": [],
              "cellVisible": false,
              "colWidth": "56px"
            },
            {
              "id": "sh85bfbf51-1e7e-443a-8bbd-569d256cd8a2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "已测试与未测试的产品作区分并贴有标示卡（备注清楚状态：机型、工单、数量、状态、日期）；"
            },
            {
              "id": "sh0337d286-5703-4f64-9287-8484cef5fe04",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shb011cfc4-abb7-4429-ae28-782b6eaf54a0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shd5f6719b-4744-4d34-8fd9-bf3a17a810ae",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh0320dad6-90f6-40c8-83b5-f04e5cc7145b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh4592c599-d089-4af8-96ee-1956a192aada",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [],
              "dataType": "text",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "4H/次",
              "colWidth": "76px"
            },
            {
              "id": "sh7257c5ed-f2d5-4595-a116-3fa232f8d26b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh3cfbc023-170f-4711-9d83-71726136848f",
                  "preps": {
                    "id": "sh3cfbc023-170f-4711-9d83-71726136848f",
                    "label": "8:00-12:00 20:00-00:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a317",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a317",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh2d70487e-f563-4fff-a67f-19f362f6afff",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh78b40d32-3628-4a89-9cce-9a8cffcf3a6b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "sh978fff9f-a9d0-4e37-bfbe-69df567257e9",
                  "preps": {
                    "id": "sh978fff9f-a9d0-4e37-bfbe-69df567257e9",
                    "label": "12:00-16:00 00:00-4:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a318",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a318",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "sh88d414cf-a847-4a3e-b00a-9b9a0e40d329",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh820cb37d-e6bd-4cea-a3f7-09e61ca9f00c",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "shf7977655-094c-4646-8567-fc90797d8f55",
                  "preps": {
                    "id": "shf7977655-094c-4646-8567-fc90797d8f55",
                    "label": "16:00-20:00 4:00-8:00",
                    "itemNameLabel": "单选框",
                    "name": "field_sh2e2a319",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "dataSource": "data",
                    "analysisType": "func",
                    "values": [
                      {
                        "name": "OK",
                        "value": "OK",
                        "xh": 1
                      },
                      {
                        "name": "NG",
                        "value": "NG",
                        "xh": 2
                      }
                    ],
                    "valuesDefaultValue": [
                      {}
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "field_sh2e2a319",
                  "itemType": "radio",
                  "label": "单选框",
                  "type": "radio"
                }
              ]
            },
            {
              "id": "shb65ce975-6813-478a-9219-e97903bbcab4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh30e99bae-008b-4985-a7b4-3887088513d5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": true,
              "items": [
                {
                  "id": "she6330fcd-e03e-47b8-9d0c-e8baf7757a96",
                  "preps": {
                    "id": "she6330fcd-e03e-47b8-9d0c-e8baf7757a96",
                    "label": "备注",
                    "itemNameLabel": "多行文本框",
                    "name": "field_shdcb369",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入备注",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "field_shdcb369",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            }
          ]
        },
        {
          "id": "sh4c22a4d4-7043-485c-a284-73acc5c786b3",
          "colIndex": 1,
          "columns": [
            {
              "id": "shac6fd71c-0d56-4931-8118-5230a4292160",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "items": [
                {
                  "id": "Idsh7debc4d9-58f3-4e4c-9647-f55f655c2e0e",
                  "preps": {
                    "id": "Idsh7debc4d9-58f3-4e4c-9647-f55f655c2e0e",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text145",
                    "clearable": true,
                    "readonly": false,
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
                    "appCompVisible": true,
                    "appLabelVisible": false,
                    "staticData": true,
                    "visiblePlatform": "all",
                    "textContent": "问题点",
                    "placeholder": "",
                    "labelFor": [
                      "wentidian"
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "text145",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "cellVisible": true,
              "colWidth": "56px"
            },
            {
              "id": "sh10a5635d-d6a9-4669-a0f6-580c01bdbc32",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh4bcec5b5-f281-4fd6-af24-8957407ad45b",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shb22b651a-8ded-4004-bd2b-b5ed47a69218",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh6fd0c7e4-8955-4af1-98c7-0fa557c0d14d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shb092951f-19af-404c-8189-1a05f2ff120a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh81953c76-4d32-4bc5-b704-80b525d26940",
                  "preps": {
                    "id": "Idsh81953c76-4d32-4bc5-b704-80b525d26940",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text146",
                    "clearable": true,
                    "readonly": false,
                    "rules": [],
                    "maxLength": 50,
                    "formVisible": true,
                    "listVisible": false,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "appCompVisible": true,
                    "appLabelVisible": false,
                    "staticData": true,
                    "visiblePlatform": "all",
                    "textContent": "改善措施",
                    "placeholder": "",
                    "labelFor": [
                      "gaishancuosi"
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "text146",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ],
              "colWidth": "48px"
            },
            {
              "id": "sh8cc049d1-f97a-4c63-9241-b2c60ffcc5ab",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "76px"
            },
            {
              "id": "sh6dba571e-ebb4-4ad3-ab91-ba87609a61c5",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh50edfa1e-373f-427c-bb92-d8cc008db9aa",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh5d3d2329-96d7-47ee-9b44-eacec60792bc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh226ec6bf-4d20-490f-90f4-3300b2acb02f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idshf6bd9e5b-16ce-40a5-9755-b1609c0fbeaf",
                  "preps": {
                    "id": "Idshf6bd9e5b-16ce-40a5-9755-b1609c0fbeaf",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text147",
                    "clearable": true,
                    "readonly": false,
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
                    "appCompVisible": true,
                    "appLabelVisible": false,
                    "staticData": true,
                    "visiblePlatform": "all",
                    "textContent": "责任人",
                    "labelFor": [
                      "zerenren"
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "text147",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ]
            },
            {
              "id": "sha20235ad-f0c4-4e4a-b06e-12d1617b120a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh37d391a5-f9ef-493a-bc73-af39c24235ea",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh9fc74fa8-cb86-49db-9ca4-af84880c6d98",
                  "preps": {
                    "id": "Idsh9fc74fa8-cb86-49db-9ca4-af84880c6d98",
                    "label": "静态文本",
                    "itemNameLabel": "静态文本",
                    "name": "text148",
                    "clearable": true,
                    "readonly": false,
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
                    "appCompVisible": true,
                    "appLabelVisible": false,
                    "staticData": true,
                    "visiblePlatform": "all",
                    "textContent": "效果验证",
                    "placeholder": "",
                    "labelFor": [
                      "xiaoguoyanzheng"
                    ]
                  },
                  "compType": "formItem",
                  "fieldName": "text148",
                  "itemType": "text",
                  "label": "静态文本",
                  "type": "text"
                }
              ]
            },
            {
              "id": "shc7cc809f-c1d7-4784-9ebe-28238e5ce13e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            }
          ]
        },
        {
          "id": "sh6cf160df-5b8f-4cac-9b8d-f468f23929e3",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh7a756e13-30a2-41fb-91bf-edcda4bc7a66",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "items": [
                {
                  "id": "Idshf2266f66-f23b-4149-92f6-a7de118fd85c",
                  "preps": {
                    "id": "Idshf2266f66-f23b-4149-92f6-a7de118fd85c",
                    "label": "多行文本框",
                    "itemNameLabel": "多行文本框",
                    "name": "wentidian",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入多行文本框",
                    "rules": [],
                    "maxLength": 2000,
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
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "wentidian",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "cellVisible": true,
              "colWidth": "56px"
            },
            {
              "id": "sh0c55362f-eeed-4e91-8d89-2075e31b00d4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh41c3a0a6-9406-4f08-907c-c1b1eca97e51",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shd401e319-957b-420d-ba02-1ffca9bd9ff0",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh8cc3f854-e8b7-404c-b720-9f58e1004a65",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh26c7367d-184b-426d-a7dd-b0766f90af83",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 5,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idshcb562361-6d08-4b46-8f82-00a4178efe6c",
                  "preps": {
                    "id": "Idshcb562361-6d08-4b46-8f82-00a4178efe6c",
                    "label": "多行文本框",
                    "itemNameLabel": "多行文本框",
                    "name": "gaishancuosi",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入多行文本框",
                    "rules": [],
                    "maxLength": 2000,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "appCompVisible": false,
                    "appLabelVisible": false
                  },
                  "compType": "formItem",
                  "fieldName": "gaishancuosi",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ],
              "colWidth": "48px"
            },
            {
              "id": "sh7c6293ea-e351-4454-8ff6-9fda02c8ef93",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "76px"
            },
            {
              "id": "sha6d537a7-a90a-4d1f-bd0d-76007666cec1",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh83009170-af8e-4492-9a15-c557089a70cb",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh38d84ec5-0642-4e03-aeb4-d0734eaa3487",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh67d6769f-8bda-439c-8a84-3477e1a29640",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idsh221b7b8c-31ac-4330-83d1-c2f783429b92",
                  "preps": {
                    "id": "Idsh221b7b8c-31ac-4330-83d1-c2f783429b92",
                    "label": "多行文本框",
                    "itemNameLabel": "多行文本框",
                    "name": "zerenren",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入多行文本框",
                    "rules": [],
                    "maxLength": 500,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true
                  },
                  "compType": "formItem",
                  "fieldName": "zerenren",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            },
            {
              "id": "shb3b6857a-e9af-42e3-ac1d-97249d934681",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh7c183b73-e928-47dc-958e-a925f20271f2",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 2,
              "cellVisible": true,
              "items": [
                {
                  "id": "Idshe51e2184-4159-4680-969a-763ef776a878",
                  "preps": {
                    "id": "Idshe51e2184-4159-4680-969a-763ef776a878",
                    "label": "多行文本框",
                    "itemNameLabel": "多行文本框",
                    "name": "xiaoguoyanzheng",
                    "clearable": true,
                    "readonly": false,
                    "placeholder": "请输入多行文本框",
                    "rules": [],
                    "maxLength": 2000,
                    "formVisible": true,
                    "listVisible": true,
                    "viewVisible": true,
                    "formula": {
                      "enable": false,
                      "type": "calc",
                      "sourceFields": [],
                      "expression": ""
                    },
                    "hideLabel": true,
                    "appCompVisible": false,
                    "appLabelVisible": false
                  },
                  "compType": "formItem",
                  "fieldName": "xiaoguoyanzheng",
                  "itemType": "textarea",
                  "label": "多行文本框",
                  "type": "textarea"
                }
              ]
            },
            {
              "id": "sha90ea57c-a61b-4510-9014-30ed307eb429",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            }
          ]
        },
        {
          "id": "sh3dd55087-5a9e-4fec-909f-3adf8ab9e2b0",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh4d9480a4-9823-4d31-a38b-0275b87be16e",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 14,
              "items": [],
              "cellVisible": true,
              "dataType": "html",
              "staticData": true,
              "visiblePlatform": "all",
              "textContent": "<p>1、缺点定义：</p><p>一般：对品质未造成直接或间接的伤害或隐患（稽核问题再次确认时还未改善则转为主要缺点）</p><p>异常：直接或间接对品质生产隐患或造成重工（具体依照停线与停线标准进行判定）</p><p>停线：稽核与检查时发现单个或批量性错料、反向、错位、ECN未导入等（具体依照停线与异常标准进行判定）</p><p>2、如附表内容不适用，需填写NA。</p><p><br></p>",
              "colWidth": "56px"
            },
            {
              "id": "sh75ee5062-ab50-4f02-9b38-280a15bef3fc",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shd13c30c0-5dea-4c98-ae3d-7a5a58aec177",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "39px"
            },
            {
              "id": "shc6fb8eca-cf80-46ac-9a76-7399368dbba4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "sh66983585-2323-4050-a21d-5f5a6eca7c9a",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shbf161ae3-fc15-4bd0-b561-879bbc3bed7d",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "48px"
            },
            {
              "id": "shdbe59db2-c54a-4a99-b121-f5f37030794f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": [],
              "colWidth": "76px"
            },
            {
              "id": "shf418eb73-bf2e-4f82-9f82-f256450e6c58",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sha187a940-03fd-45b5-bff3-af22b29b8597",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shc5255fa4-74f5-4716-adbb-d4524f5d83c4",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "shc74ad4d9-b0d5-4cd3-b326-3f3b6167f013",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh4c20f753-f93d-44e0-8159-742bedbc0ac9",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh65157387-2721-4dfa-8ddb-2f4489848b56",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            },
            {
              "id": "sh59768e80-4d69-48e9-a119-9bfa5dcfdf9f",
              "colIndex": 1,
              "rowspan": 1,
              "colspan": 1,
              "cellVisible": false,
              "items": []
            }
          ]
        }
      ],
      "appCompVisible": false,
      "appLabelVisible": false,
      "rules": [],
      "maxLength": 255,
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true,
      "rowNums": 58,
      "columnNums": 14
    },
    "compType": "container",
    "fieldName": "dytable1",
    "itemType": "dytable",
    "rowNums": 1,
    "columnNums": 1,
    "type": "dytable"
  }
];


;
onMounted(() => {
  const result = analysisCompDatas(fields);
  //
  console.log(JSON.stringify(result.fieldList));
  dataItem.value["fieldList"] = result.fieldList;
  starHorseFormRef.value?.setFormData({
    "time": "1970-01-01 10:12:01+08",
    "timerange": [
      "1970-01-01 17:20:01+08",
      "1970-01-01 21:15:01+08"
    ],
    "year": "2025-12-31T16:00:00.000Z",
    "years": ["2024-12-31T16:00:00.000Z", "2026-12-31T16:00:00.000Z"],
    "month": "2026-05-31T16:00:00.000Z",
    "months": ["2026-06-30T16:00:00.000Z", "2026-10-31T16:00:00.000Z"],
    "date": "2026-06-08T16:00:00.000Z",
    "dates": ["2026-06-17T16:00:00.000Z", "2026-06-24T16:00:00.000Z", "2026-06-23T16:00:00.000Z"],
    "week": "2026-06-13T16:00:00.000Z",
    closetime:["2026-06-05", "2026-07-14"],
    "daterange": ["2026-06-17T16:00:00.000Z", "2026-07-22T16:00:00.000Z"],
    "monthrange": ["2026-05-31T16:00:00.000Z", "2027-06-30T16:00:00.000Z"],
    "yearrange": ["2026-06-03T03:51:32.804Z", "2036-06-03T03:51:33.779Z"]
  });
});
</script>

<style lang="scss" scoped></style>
