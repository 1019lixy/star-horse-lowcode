<template>
  <el-scrollbar>
    <!--    <dytable-item :dataForm="formData" :item="dataItem"  :formInfo="{}" />-->
    <!--    {{starHorseFormRef?.getFormData()}}
        <star-horse-form :fieldList="dataItem" ref="starHorseFormRef"/>-->
    <template v-for="data in formData">
      ---------------------------------------------------------<br>
      <template v-for="item in Object.entries(data)">
       {{item[0]}}: {{ testDateFormat(item) }}<br/>
      </template>
    </template>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {analysisComps} from "@/api/form_utils";
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
    "fieldTimepicker": "1970-01-01 08:11:01+08",
    "fieldDate": "2026-06-07T16:00:00.000Z",
    "fieldMonths": [
      "2026-07-31T16:00:00.000Z",
      "2026-08-31T16:00:00.000Z",
      "2026-09-30T16:00:00.000Z"
    ],
    "version": 3,
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
        isRange: true,
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
    "id": "Idsh2ed168e4-36bf-4b8d-b057-1c20f4bd35ab",
    "label": "字段1",
    "fieldName": "zhoubie",
    "compType": "formItem",
    "itemType": "input",
    "preps": {
      "id": "Idsh2ed168e4-36bf-4b8d-b057-1c20f4bd35ab",
      "listVisible": true,
      "formVisible": true,
      "name": "zhoubie",
      "label": "周别",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入周别",
      "maxLength": 100,
      "rules": [],
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "searchVisible": true,
      "defaultVisible": true,
      "elements": [
        {
          "id": "shbe7e31cd-4c97-4ae9-88d4-f73ebadcca52",
          "colIndex": 1,
          "columns": [
            {
              "id": "sh426ae93c-e384-47a6-82c7-8455c785f723",
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
      "appLabelVisible": false
    },
    "type": "input",
    "priority": 1
  },
  {
    "id": "Idsh09f2565f-0feb-4dce-bd82-987cec5789c2",
    "label": "字段2",
    "fieldName": "xianbie",
    "compType": "formItem",
    "itemType": "input",
    "preps": {
      "id": "Idsh09f2565f-0feb-4dce-bd82-987cec5789c2",
      "listVisible": true,
      "formVisible": true,
      "name": "xianbie",
      "label": "线别",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入线别",
      "maxLength": 100,
      "rules": [],
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "searchVisible": true,
      "defaultVisible": true
    },
    "type": "input",
    "priority": 2
  },
  {
    "id": "Idsh395d127f-791e-47bc-b42f-284f1d986902",
    "label": "字段3",
    "fieldName": "riqi",
    "compType": "formItem",
    "itemType": "datetime",
    "preps": {
      "id": "Idsh395d127f-791e-47bc-b42f-284f1d986902",
      "listVisible": true,
      "formVisible": true,
      "name": "riqi",
      "label": "日期",
      "clearable": true,
      "readonly": false,
      "placeholder": "请选择日期",
      "maxLength": 100,
      "rules": [],
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "searchVisible": true,
      "appCompVisible": false,
      "appLabelVisible": false,
      "itemNameLabel": "日期选择器",
      "type": "date",
      "disabledDate": "(e) => c.value.includes(e.getDate().toString())"
    },
    "type": "datetime",
    "priority": 3
  },
  {
    "id": "Idsh3b2c1c2b-1efc-457a-8838-ea31312fa085",
    "label": "字段4",
    "fieldName": "banbie",
    "compType": "formItem",
    "itemType": "input",
    "preps": {
      "id": "Idsh3b2c1c2b-1efc-457a-8838-ea31312fa085",
      "listVisible": true,
      "formVisible": true,
      "name": "banbie",
      "label": "班别",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入班别",
      "maxLength": 100,
      "rules": [],
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "searchVisible": true,
      "appCompVisible": false,
      "appLabelVisible": false
    },
    "type": "input",
    "priority": 4
  },
  {
    "id": "Idsh43dc83c7-6bdc-4cad-99db-deaafd4800c0",
    "label": "字段5",
    "fieldName": "jixing",
    "compType": "formItem",
    "itemType": "input",
    "preps": {
      "id": "Idsh43dc83c7-6bdc-4cad-99db-deaafd4800c0",
      "listVisible": true,
      "formVisible": true,
      "name": "jixing",
      "label": "机型",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入机型",
      "maxLength": 100,
      "rules": [],
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "searchVisible": true
    },
    "type": "input",
    "priority": 5
  },
  {
    "id": "Idshf0fd4653-3e36-4855-ac78-b957d7c4d007",
    "label": "字段6",
    "fieldName": "zhanbie",
    "compType": "formItem",
    "itemType": "input",
    "preps": {
      "id": "Idshf0fd4653-3e36-4855-ac78-b957d7c4d007",
      "listVisible": true,
      "formVisible": true,
      "name": "zhanbie",
      "label": "站别",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入站别",
      "maxLength": 100,
      "rules": [],
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "searchVisible": true
    },
    "type": "input",
    "priority": 6
  },
  {
    "id": "Idshc4e95110-549a-4139-9acf-0c83d75f26ea",
    "label": "字段7",
    "fieldName": "xmhuogh",
    "compType": "formItem",
    "itemType": "input",
    "preps": {
      "id": "Idshc4e95110-549a-4139-9acf-0c83d75f26ea",
      "listVisible": true,
      "formVisible": true,
      "label": "姓名/工号",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入姓名/工号",
      "maxLength": 100,
      "name": "xmhuogh",
      "rules": [],
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "searchVisible": true
    },
    "type": "input",
    "priority": 7
  },
  {
    "id": "Idshedca8d63-aed8-473a-9811-661adfedf720",
    "label": "字段8",
    "fieldName": "khfs",
    "compType": "formItem",
    "itemType": "radio",
    "preps": {
      "id": "Idshedca8d63-aed8-473a-9811-661adfedf720",
      "listVisible": true,
      "formVisible": true,
      "name": "khfs",
      "label": "考核方式",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入考核方式",
      "maxLength": 100,
      "rules": [],
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "itemNameLabel": "单选框",
      "dataSource": "data",
      "analysisType": "func",
      "values": [
        {
          "name": "流线",
          "value": "liuxian",
          "xh": 1
        },
        {
          "name": "非流线",
          "value": "feiliuxian",
          "xh": 2
        }
      ],
      "valuesDefaultValue": [
        {}
      ],
      "searchVisible": true,
      "appCompVisible": false,
      "appLabelVisible": false
    },
    "type": "radio",
    "priority": 8
  },
  {
    "id": "Idsh4788030c-cd7c-4f2c-88d3-e9bf26af47a3",
    "label": "字段9",
    "fieldName": "khsysj",
    "compType": "formItem",
    "itemType": "number",
    "preps": {
      "id": "Idsh4788030c-cd7c-4f2c-88d3-e9bf26af47a3",
      "listVisible": true,
      "formVisible": true,
      "name": "khsysj",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入考核所用时间",
      "maxLength": 100,
      "label": "考核所用时间",
      "rules": [],
      "formula": {
        "enable": true,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "itemNameLabel": "数字输入框",
      "step": 1,
      "min": 0,
      "precision": 2,
      "suffix": "分",
      "appCompVisible": false,
      "appLabelVisible": false
    },
    "type": "number",
    "priority": 9
  },
  {
    "id": "Idsh39b8d3fd-557a-425a-a3ec-9951d6871196",
    "label": "字段10",
    "fieldName": "khnr",
    "compType": "formItem",
    "itemType": "textarea",
    "preps": {
      "id": "Idsh39b8d3fd-557a-425a-a3ec-9951d6871196",
      "listVisible": true,
      "formVisible": true,
      "name": "khnr",
      "label": "考核内容",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入考核内容",
      "maxLength": 3000,
      "rules": [],
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "itemNameLabel": "多行文本框"
    },
    "type": "textarea",
    "priority": 10
  },
  {
    "id": "Idsh19d26549-cf4c-4679-88de-bcbef51534b4",
    "preps": {
      "id": "Idsh19d26549-cf4c-4679-88de-bcbef51534b4",
      "label": "考核状况",
      "itemNameLabel": "条件组",
      "name": "condition2",
      "children": [],
      "items": [],
      "maxLength": 100
    },
    "compType": "container",
    "fieldName": "condition2",
    "itemType": "condition",
    "children": [
      {
        "id": "Idsh3549aaf4-6c49-4cd8-9514-b0d59af3d874",
        "label": "字段1",
        "fieldName": "jieguo",
        "compType": "formItem",
        "itemType": "input",
        "preps": {
          "id": "Idsh3549aaf4-6c49-4cd8-9514-b0d59af3d874",
          "listVisible": true,
          "formVisible": true,
          "name": "jieguo",
          "label": "结果",
          "clearable": true,
          "readonly": false,
          "placeholder": "请输入结果",
          "maxLength": 100
        },
        "type": "input"
      },
      {
        "id": "Idsh2bbfbb66-cf0f-4be3-80ba-5e391232ce09",
        "label": "字段2",
        "fieldName": "ngxiangmu",
        "compType": "formItem",
        "itemType": "input",
        "preps": {
          "id": "Idsh2bbfbb66-cf0f-4be3-80ba-5e391232ce09",
          "listVisible": true,
          "formVisible": true,
          "name": "ngxiangmu",
          "label": "NG项目",
          "clearable": true,
          "readonly": false,
          "placeholder": "请输入NG项目",
          "maxLength": 100
        },
        "type": "input"
      }
    ],
    "type": "condition",
    "label": "考核状况",
    "priority": 11
  },
  {
    "id": "Idshb7e0267e-bd3b-4d4c-9b40-64d57d0b5b0d",
    "label": "字段12",
    "fieldName": "ngzcpxksxm",
    "compType": "formItem",
    "itemType": "input",
    "preps": {
      "id": "Idshb7e0267e-bd3b-4d4c-9b40-64d57d0b5b0d",
      "listVisible": true,
      "formVisible": true,
      "name": "ngzcpxksxm",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入针对NG项目培训 后再次考核项目",
      "maxLength": 100,
      "label": "针对NG项目培训 后再次考核项目"
    },
    "type": "input",
    "priority": 12
  },
  {
    "id": "Idshf2c06c36-8278-4484-8cce-e48ddac9b09b",
    "label": "字段13",
    "fieldName": "zckhjg",
    "compType": "formItem",
    "itemType": "input",
    "preps": {
      "id": "Idshf2c06c36-8278-4484-8cce-e48ddac9b09b",
      "listVisible": true,
      "formVisible": true,
      "name": "zckhjg",
      "label": "再次考核结果",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入再次考核结果",
      "maxLength": 100
    },
    "type": "input",
    "priority": 13
  },
  {
    "id": "Idsh592957d8-c5ab-4fb6-93b4-e8d7b505af04",
    "label": "字段14",
    "fieldName": "ipqc",
    "compType": "formItem",
    "itemType": "input",
    "preps": {
      "id": "Idsh592957d8-c5ab-4fb6-93b4-e8d7b505af04",
      "listVisible": true,
      "formVisible": true,
      "name": "ipqc",
      "label": "IPQC",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入IPQC",
      "maxLength": 100
    },
    "type": "input",
    "priority": 14
  },
  {
    "id": "Idsh64b00d4e-5f02-4ac8-8803-60928859d609",
    "label": "字段15",
    "fieldName": "dbbzqr",
    "compType": "formItem",
    "itemType": "input",
    "preps": {
      "id": "Idsh64b00d4e-5f02-4ac8-8803-60928859d609",
      "listVisible": true,
      "formVisible": true,
      "name": "dbbzqr",
      "label": "当班班长确认",
      "clearable": true,
      "readonly": false,
      "placeholder": "请输入当班班长确认",
      "maxLength": 100
    },
    "type": "input",
    "priority": 15
  },
  {
    "id": "Idsh1cf1423f-1ad7-4a68-b0b4-3f0f0ec8275f",
    "preps": {
      "id": "Idsh1cf1423f-1ad7-4a68-b0b4-3f0f0ec8275f",
      "label": "Html组件",
      "itemNameLabel": "Html组件",
      "name": "html3",
      "clearable": true,
      "readonly": false,
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
      "placeholder": "",
      "appCompVisible": false,
      "appLabelVisible": false,
      "staticData": true,
      "textContent": "<p style=\"text-align: left;\">作业要求:</p><p style=\"text-align: left;\">1、IPQC每周对各制程段SPI、AOI设备敏感度不定时考核、对目检、测试外观、OQC考核检出率，对未检出人员作重点监控及对其负责，针对客诉不良或厂内OQC发现不良进行考核，样本选取数3-5PCS.</p><p style=\"text-align: left;\">2、每周IPQC不定时考核3-5次</p>"
    },
    "compType": "formItem",
    "fieldName": "html3",
    "itemType": "html",
    "label": "Html组件",
    "type": "html",
    "priority": 16
  }
];


;
onMounted(() => {
  /*const result = analysisCompDatas(fields);
  //
  console.log(JSON.stringify(result.fieldList));
  dataItem.value["fieldList"] = result.fieldList;*/
  starHorseFormRef.value?.setFormData({
    "year": "2025-12-31T16:00:00.000Z",
    "years": ["2024-12-31T16:00:00.000Z", "2026-12-31T16:00:00.000Z"],
    "month": "2026-05-31T16:00:00.000Z",
    "months": ["2026-06-30T16:00:00.000Z", "2026-10-31T16:00:00.000Z"],
    "date": "2026-06-08T16:00:00.000Z",
    "dates": ["2026-06-17T16:00:00.000Z", "2026-06-24T16:00:00.000Z", "2026-06-23T16:00:00.000Z"],
    "week": "2026-06-13T16:00:00.000Z",
    "daterange": ["2026-06-17T16:00:00.000Z", "2026-07-22T16:00:00.000Z"],
    "monthrange": ["2026-05-31T16:00:00.000Z", "2027-06-30T16:00:00.000Z"],
    "yearrange": ["2026-06-03T03:51:32.804Z", "2036-06-03T03:51:33.779Z"]
  });
});
</script>

<style lang="scss" scoped></style>
