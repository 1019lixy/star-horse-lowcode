<script setup lang="ts" name="Areainfo">
import { onMounted, provide, ref } from "vue";
import { PageFieldInfo } from "@/components/types/PageFieldInfo";
import { StarHorseForm, StarHorseTableComp } from "@/components/comp";
import {
  apiInstance,
  closeLoad,
  dialogPreps,
  load,
} from "@/api/star_horse_utils";
import { download } from "@/api/star_horse_apis";
import { warning } from "@/utils/message";
import { ApiUrls, SearchInfo } from "@/components/types";

const dataUrl: ApiUrls = apiInstance(
  "userdb-manage",
  "userdb/formInstance/tbValidDatesNew/idValidDateNew/381167130139165693",
);
console.log(dataUrl);
const testFormValidRef = ref();
const outerData: any = {
  backgroundSize: "http你好%",
  qrcode: "http://www.baidu.com",
  barcode: "22222223333",
};
const searchFormData = ref<SearchInfo>({
  fieldList: [
    {
      defaultVisible: true,
      fieldName: "fieldYear",
      label: "年",
      matchType: "eq",
      preps: {
        type: "year",
      },
      type: "date",
    },
    {
      defaultVisible: true,
      fieldName: "fieldMonth",
      label: "月",
      matchType: "eq",
      preps: {
        type: "month",
      },
      type: "date",
    },
    {
      defaultVisible: true,
      fieldName: "fieldDate",
      label: "日期",
      matchType: "eq",
      preps: {
        type: "date",
      },
      type: "date",
    },
    {
      defaultVisible: true,
      fieldName: "fieldWeek",
      label: "周",
      matchType: "eq",
      preps: {
        type: "week",
      },
      type: "date",
    },
  ],
});
const fieldList = ref<PageFieldInfo>({
  fieldList: [
    {
      label: "年",
      fieldName: "fieldYear",
      type: "date",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        searchVisible: true,
        label: "年",
        type: "year",
        viewVisible: true,
        itemNameLabel: "日期选择器",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        defaultVisible: true,
        name: "field_year",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        subType: "year",
        id: "Idsh558a4f0c-03bd-42f4-b58d-75f992fdffb9",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "年多选",
      fieldName: "fieldYears",
      type: "date",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        label: "年多选",
        type: "years",
        viewVisible: true,
        itemNameLabel: "日期选择器",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        name: "field_years",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        subType: "years",
        id: "Idsh555e66be-82a9-4f47-b4c2-539c55244a36",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "月",
      fieldName: "fieldMonth",
      type: "date",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        searchVisible: true,
        label: "月",
        type: "month",
        viewVisible: true,
        itemNameLabel: "日期选择器",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        defaultVisible: true,
        name: "field_month",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        subType: "month",
        id: "sh2957db9e-529b-4ddd-bb30-1edcda8bc067",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "月多选",
      fieldName: "fieldMonths",
      type: "date",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        label: "月多选",
        type: "months",
        viewVisible: true,
        itemNameLabel: "日期选择器",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        name: "field_months",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        subType: "months",
        id: "sh29a63a32-a661-495b-84ac-2adee23f7583",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "日期",
      fieldName: "fieldDate",
      type: "date",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        searchVisible: true,
        label: "日期",
        type: "date",
        viewVisible: true,
        itemNameLabel: "日期选择器",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        defaultVisible: true,
        name: "field_date",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        subType: "date",
        id: "sh06253fc6-acb5-4a7b-bad9-cd7e3045531e",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "日期多选",
      fieldName: "fieldDates",
      type: "date",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        label: "日期多选",
        type: "dates",
        viewVisible: true,
        itemNameLabel: "日期选择器",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        name: "field_dates",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        subType: "dates",
        id: "sh9f87b6bc-06a5-4e77-a6f9-77ffe9be2345",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "周",
      fieldName: "fieldWeek",
      type: "date",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        searchVisible: true,
        label: "周",
        type: "week",
        viewVisible: true,
        itemNameLabel: "日期选择器",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        defaultVisible: true,
        name: "field_week",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        subType: "week",
        id: "she4d316d5-91af-409f-82d0-83a1581941c3",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "日期范围",
      fieldName: "fieldDaterange",
      type: "date",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        label: "日期范围",
        type: "daterange",
        viewVisible: true,
        itemNameLabel: "日期选择器",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        name: "field_daterange",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        subType: "daterange",
        id: "shf199b931-2c7c-4acb-ae97-3cc51a64fc98",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "月份范围",
      fieldName: "fieldMonthrange",
      type: "date",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        label: "月份范围",
        type: "monthrange",
        viewVisible: true,
        itemNameLabel: "日期选择器",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        name: "field_monthrange",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        subType: "monthrange",
        id: "sh7657b44f-662f-4389-8cb0-6aa6c72e9e8d",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "年范围",
      fieldName: "fieldYearrange",
      type: "date",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        label: "年范围",
        type: "yearrange",
        viewVisible: true,
        itemNameLabel: "日期选择器",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        name: "field_yearrange",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        subType: "yearrange",
        id: "sh1141aa32-24f7-4430-bee1-65cf31baa883",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "日期时间",
      fieldName: "fieldDatetime",
      type: "datetime",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        label: "日期时间",
        type: "datetime",
        viewVisible: true,
        itemNameLabel: "日期时间选择",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        name: "field_datetime",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        subType: "datetime",
        id: "Idsh43140b9f-7de3-4aaf-b1a9-6733843067bb",
        placeholder: "请选择日期时间",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "日期时间范围",
      fieldName: "fieldDatetimerange",
      type: "datetime",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        format: "YYYY-MM-DD HH:mm:ss",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        label: "日期时间范围",
        type: "datetimerange",
        viewVisible: true,
        itemNameLabel: "日期时间选择",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        startPlaceholder: "请选择开始日期",
        name: "field_datetimerange",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        subType: "datetimerange",
        id: "sh3f1da619-3408-4db3-ba29-07134ea45813",
        placeholder: "请选择日期时间范围",
        endPlaceholder: "请选择结束日期",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "时间选择",
      fieldName: "fieldTime",
      type: "time",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        label: "时间选择",
        viewVisible: true,
        itemNameLabel: "时间选择",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        name: "field_time",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        id: "Idshae4eeb44-c837-40da-ac18-dabe0c5d74c4",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "时间选择器",
      fieldName: "fieldTimepicker",
      type: "time-picker",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        label: "时间选择器",
        viewVisible: true,
        itemNameLabel: "时间选择器",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        name: "field_timepicker",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        id: "Idsh7a174647-9e49-4434-bc01-286f480b5c3b",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "时间选择器范围",
      fieldName: "fieldTimerange",
      type: "time-picker",
      required: false,
      formVisible: true,
      listVisible: true,
      defaultValue: false,
      preps: {
        clearable: true,
        label: "时间选择器范围",
        type: "timerange",
        isRange: true,
        viewVisible: true,
        itemNameLabel: "时间选择器",
        readonly: false,
        formVisible: true,
        appLabelVisible: false,
        name: "fieldTimerange",
        formula: {
          enable: false,
          type: "calc",
          sourceFields: [],
          expression: "",
        },
        appCompVisible: false,
        id: "sh49951813-8fa8-4638-b2e9-af9f0090ab5c",
        maxLength: 255,
        listVisible: true,
      },
    },
    {
      label: "角色Id",
      fieldName: "createdRoleId",
      type: "input",
      formVisible: false,
      listVisible: false,
      preps: {},
      commonFlag: "Y",
    },
    {
      label: "创建人",
      fieldName: "createdBy",
      type: "input",
      formVisible: false,
      listVisible: false,
      preps: {},
      commonFlag: "Y",
    },
    {
      label: "修改人",
      fieldName: "updatedBy",
      type: "input",
      formVisible: false,
      listVisible: false,
      preps: {},
      commonFlag: "Y",
    },
    {
      label: "版本号",
      fieldName: "version",
      type: "number",
      formVisible: false,
      listVisible: false,
      preps: {},
      commonFlag: "Y",
    },
    {
      label: "是否删除",
      fieldName: "isDel",
      type: "number",
      formVisible: false,
      listVisible: false,
      preps: {},
      commonFlag: "Y",
    },
    {
      label: "数据编号",
      fieldName: "dataNo",
      type: "input",
      formVisible: false,
      listVisible: false,
      preps: {},
      commonFlag: "Y",
    },
    {
      label: "状态",
      fieldName: "statusCode",
      type: "select",
      formVisible: false,
      listVisible: false,
      preps: {
        urlOrDictName: "common",
        name: "statusCode",
        dataSource: "dict",
      },
      commonFlag: "Y",
    },
    {
      label: "状态名称",
      fieldName: "statusName",
      type: "input",
      formVisible: false,
      listVisible: false,
      preps: {},
      commonFlag: "Y",
    },
    {
      label: "国际编码",
      fieldName: "local",
      type: "input",
      formVisible: false,
      listVisible: false,
      preps: {},
      commonFlag: "Y",
    },
    {
      label: "备注",
      fieldName: "remark",
      type: "textarea",
      formVisible: false,
      listVisible: false,
      preps: {},
      commonFlag: "Y",
    },
    {
      label: "租户",
      fieldName: "tenantId",
      type: "select",
      formVisible: false,
      listVisible: false,
      preps: {},
      commonFlag: "Y",
    },
  ],
});
const initData = async () => {};
const primaryKey = "idValidDateNew";
const codeGeneratorRef = ref();
const rules = {};
const dialogProps = dialogPreps();
provide("dialogProps", dialogProps);
const generateFormRef = ref();
const generateMerge = (type: string) => {
  console.log(generateFormRef.value.getFormData()?.value);
  generateFormRef.value.$refs.starHorseFormRef.validate((res: boolean) => {
    let dataForm: any = generateFormRef.value.getFormData()?.value;
    if (res) {
      load("代码生成中,请稍后...");
      if (dataForm["prefixesStr"]) {
        dataForm["prefixesList"] = dataForm["prefixesStr"].split(";");
      }
      let isError = false;
      download("/userdb-manage/generator/code/convertToCode", dataForm)
        .catch((err) => {
          isError = true;
          warning(err);
        })
        .finally(() => {
          closeLoad();
          if (type != "continue" && !isError) {
            closeAction();
          }
        });
    }
  });
};
const closeAction = () => {
  dialogProps.editVisible = false;
};
onMounted(() => {
  initData();
});
</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <star-horse-dialog
      :isShowBtnContinue="true"
      :dialogVisible="dialogProps.editVisible"
      :dialogProps="dialogProps"
      :selfFunc="false"
      @merge="generateMerge"
      @closeAction="closeAction"
      boxHeight="85%"
    >
      <star-horse-form
        ref="generateFormRef"
        @refresh="
          (formData, result) => codeGeneratorRef?.assignStaticData(formData)
        "
        :compUrl="dataUrl"
        :preview="true"
        formSize="default"
        :fieldList="fieldList"
        :rules="rules"
      />
    </star-horse-dialog>
    <star-horse-dialog
      :dialog-visible="dialogProps.viewVisible"
      :dialogProps="dialogProps"
      :source="3"
    >
      <star-horse-data-view
        :preview="true"
        :field-list="fieldList"
        :compUrl="dataUrl"
      />
    </star-horse-dialog>
    <div class="search-content">
      <div class="search_btn">
        <star-horse-search-comp
          @searchData="
            (data: any) => codeGeneratorRef?.createSearchParams(data)
          "
          :formData="searchFormData"
          :compUrl="dataUrl"
        />
      </div>
    </div>
    <el-card class="inner_content">
      <star-horse-table-comp
        ref="codeGeneratorRef"
        :fieldList="fieldList"
        :primaryKey="primaryKey"
        :compUrl="dataUrl"
        :preview="true"
        :btn-permissions="{
          edit: 'edit',
          view: 'view',
          delete: 'delete',
          add: 'add',
        }"
      />
    </el-card>
  </div>
</template>
<style lang="scss" scoped></style>
