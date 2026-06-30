<script lang="ts" setup>
import { onActivated, onMounted, provide, reactive, ref } from "vue";
import { i18n } from "@/lang";
import { apiInstance, dialogPreps } from "@/api/star_horse_utils";
import {
  ApiUrls,
  PageFieldInfo,
  SearchFields,
  SelectOption,
} from "@/components/types";
import { postRequest } from "@/api/star_horse_apis";
import { StarHorseTableComp } from "@/components/comp";

let informationsList = ref<any>([]);
const dataUrl: ApiUrls = apiInstance("system-config", "system/informations");
dataUrl.loadByIdUrl = dataUrl.basePrefix + "/getInformationById";
let systemIconList = ref<SelectOption[]>([]);
let customerList = ref<SelectOption[]>([]);
const searchFormData = reactive<SearchFields>({
  fieldList: [
    /*  {
      label: i18n("system.belonging.entity"), fieldName: "idCustomer", type: "select",
      preps: {
        values: customerList
      }
    }, */
    {
      label: i18n("system.application.name"),
      defaultVisible: true,
      fieldName: "sysName",

      matchType: "lk",
    },
    {
      label: "Number",
      fieldName: "num",
      formVisible: false,
      type: "number",
      matchType: "bt",
    },
     {
      label: "Select",
      fieldName: "select",
      formVisible: false,
      type: "select",
      matchType: "bt",
    },
    {
      label: i18n("system.add.time"),
      fieldName: "createdTime",
      formVisible: false,
      type: "datetime",
      matchType: "bt",
    },
  ],
});
const testFun = (formData: any) => {
  if (!formData["parentId"]) {
    return;
  }
  postRequest(dataUrl.loadByIdUrl + "/" + formData["parentId"], {}).then(
    (res) => {
      let redata = res.data.data;
      formData["idCustomer"] = redata["idCustomer"];
    },
  );
};
const tableFieldList = reactive<PageFieldInfo>({
  fieldList: [
    {
      label: i18n("system.primary.key"),
      fieldName: "idInformations",
      formVisible: false,
    },
    [
      {
        label: i18n("system.parent.application"),
        fieldName: "parentId",
        type: "select",
        formVisible: true,
        actions: { change: testFun },
        preps: {
          values: informationsList,
        },
      },

      {
        label: i18n("system.application.name"),
        fieldName: "sysName",
        required: true,
        listVisible: true,
      },
      /* {
        label: i18n("system.belonging.entity"),
        fieldName: "idCustomer",
        type: "select",
        required: true,
        formVisible: true,
        listVisible: true,
        preps: {
          values: customerList,
        }
      } */
    ],
    /* {
     label: i18n("system.belonging.entity"), fieldName: "customer['customerName']", type: "select",
     required: true,
     listVisible: true
   },*/
    {
      label: i18n("system.system.code"),
      fieldName: "sysCode",
      required: true,
      formVisible: false,
      listVisible: true,
      preps: {
        disabled: true,
      },
    },
    [
      {
        label: i18n("system.system.logo"),
        fieldName: "sysLogo",
        type: "icon",
        formVisible: true,
        listVisible: true,
        preps: {
          iconType: "system",
          values: [],
        },
      },
      {
        label: i18n("system.data.sort"),
        fieldName: "dataSort",
        type: "number",
        formVisible: true,
        listVisible: true,
      },
    ],
    {
      label: i18n("system.system.description"),
      fieldName: "sysDesc",
      type: "textarea",
      formVisible: true,
      listVisible: true,
      actions: { input: testFun },
    },
    {
      label: "绑定表单",
      fieldName: "bindFormName",
      aliasName: "formId",
      type: "dialog-input",
      preps: {
        multiple: true,
        primaryKey: "idDynamicForm",
        dataUrl: {
          pageListUrl: "/userdb-manage/userdb/dynamicForm/pageList",
        },
        needField: [
          { sourceField: "formName", distField: "bindFormName" },
          { sourceField: "dataNo", distField: "formId" },
        ],
        searchFieldList: [],
        fieldList: [
          {
            label: "表单名称",
            fieldName: "formName",
            searchVisible: true,
            listVisible: true,
          },
          {
            label: "表单图标",
            type: "icon",
            fieldName: "formIcon",
            listVisible: true,
            preps: {
              iconType: "user",
              values:[],
            },
          },
          {
            label: "创建人",

            fieldName: "createdBy",
            formVisible: false,
            listVisible: true,
          },
        ],
      },

      formVisible: true,
      listVisible: true,
      actions: {
        change: (val: any) => {
        },
      },
    },
    {
      label: i18n("system.updated.by"),
      preps: {
        appendAction:[
          {
            title:"xxx",
            icon:"edit",
            actions:{
              eventType:"custom",
              customCode:"const params={\n" +
                      "    \"apiInfo\": {\n" +
                  "        \"apiType\": \"thirdApi\",\n" +
                  "        \"codePath\": \"code\",\n" +
                  "        \"dataPath\": \"data\",\n" +
                  "        \"dataType\": \"JSON\",\n" +
                  "        \"headers\": [\n" +
                  "            {\n" +
                  "                \"paramName\": \"P-Auth\",\n" +
                  "                \"paramValue\": \"u_Mjc2MWI1ZXZqYmI1azJhN3Y4bF4WNzU5ODEWMZ9ONTE5MzIxMTU4MjkyMjg20831\",\n" +
                  "                \"valueType\": \"static\",\n" +
                  "            }\n" +
                  "        ],\n" +
                  "        \"httpMethod\": \"POST\",\n" +
                  "        \"protocol\": \"http\",\n" +
                  "        \"requestParams\": [\n" +
                  "            {\n" +
                  "                \"paramName\": \"DataType\",\n" +
                  "                \"paramValue\": \"${DataType}\",\n" +
                  "                \"valueType\": \"isolation\",\n" +
                  "            },\n" +
                  "            {\n" +
                  "                \"matchType\": \"eq\",\n" +
                  "                \"paramName\": \"Id\",\n" +
                  "                \"paramValue\": \"${fieldSh6Cd03}\",\n" +
                  "                \"starHorseEditing\": \"no\",\n" +
                  "                \"valueType\": \"dynamic\",\n" +
                  "            },\n" +
                  "            {\n" +
                  "                \"paramName\": \"typeid\",\n" +
                  "                \"paramValue\": \"1\",\n" +
                  "                \"valueType\": \"static\",\n" +
                  "            },\n" +
                  "            {\n" +
                  "                \"paramName\": \"wo\",\n" +
                  "                \"paramValue\": \"\",\n" +
                  "                \"valueType\": \"static\",\n" +
                  "            }\n" +
                  "        ],\n" +
                  "        \"responseTemplate\": \"result_data_list\",\n" +
                  "        \"successCode\": \"200\",\n" +
                  "        \"url\": \"http://192.168.20.102:8092/tims\"\n" +
                  "    },\n" +
                  "    \"authInfo\": {\n" +
                  "        \"apiType\": \"systemApi\",\n" +
                  "        \"codePath\": \"code\",\n" +
                  "        \"dataPath\": \"data\",\n" +
                  "        \"dataType\": \"JSON\",\n" +
                  "        \"headers\": [],\n" +
                  "        \"httpMethod\": \"POST\",\n" +
                  "        \"protocol\": \"http\",\n" +
                  "        \"requestParams\": [],\n" +
                  "        \"responseTemplate\": \"result_data_list\"\n" +
                  "    },\n" +
                  "    \"codePath\": \"code\",\n" +
                  "    \"conditionFields\": [\n" +
                  "        \"userInfo\",\n" +
                  "        \"fieldShcad6\"\n" +
                  "    ],\n" +
                  "    \"dataPath\": \"data\",\n" +
                  "    \"dataType\": \"JSON\",\n" +
                  "    \"fieldMappings\": [\n" +
                  "        {\n" +
                  "            \"distField\": \"fieldShf0E11\",\n" +
                  "            \"sourceField\": \"line\",\n" +
                  "            \"starHorseEditing\": \"no\",\n" +
                  "        },\n" +
                  "        {\n" +
                  "            \"distField\": \"fieldShb7C14\",\n" +
                  "            \"sourceField\": \"partdesc\",\n" +
                  "            \"starHorseEditing\": \"no\",\n" +
                  "        },\n" +
                  "        {\n" +
                  "            \"distField\": \"fieldSh38Bc5\",\n" +
                  "            \"sourceField\": \"partno\",\n" +
                  "\n" +
                  "        }\n" +
                  "    ],\n" +
                  "\n" +
                  "    \"headers\": [],\n" +
                  "    \"httpMethod\": \"POST\",\n" +
                  "    \"isolationConfig\": {\n" +
                  "        \"isolationDetails\": [\n" +
                  "            {\n" +
                  "                \"isolationCode\": \"1\",\n" +
                  "                \"isolationName\": \"385623805101343740\",\n" +
                  "                \"paramName\": \"DataType\",\n" +
                  "                \"starHorseEditing\": \"no\",\n" +
                  "                \"xh\": 1\n" +
                  "            },\n" +
                  "            {\n" +
                  "                \"isolationCode\": \"2\",\n" +
                  "                \"isolationName\": \"388963577039422460\",\n" +
                  "                \"paramName\": \"DataType\",\n" +
                  "                \"starHorseEditing\": \"no\",\n" +
                  "                \"xh\": 2\n" +
                  "            },\n" +
                  "            {\n" +
                  "                \"isolationCode\": \"1\",\n" +
                  "                \"isolationName\": \"default\",\n" +
                  "                \"paramName\": \"DataType\",\n" +
                  "                \"xh\": 3\n" +
                  "            }\n" +
                  "        ],\n" +
                  "        \"isolationType\": \"role\"\n" +
                  "    },\n" +
                  "    \"protocol\": \"http\",\n" +
                  "    \"proxyUrl\": \"/system-config/redirect/apiLinkage\",\n" +
                  "    \"redirect\": true,\n" +
                  "    \"requestParams\": [],\n" +
                  "    \"requestParamsDefaultValue\": [\n" +
                  "        {\n" +
                  "            \"valueType\": \"static\"\n" +
                  "        },\n" +
                  "        {\n" +
                  "            \"valueType\": \"static\"\n" +
                  "        }\n" +
                  "    ],\n" +
                  "    \"responseTemplate\": \"result_data_list\"\n" +
                  "};\n" +
                  " params[\"formData\"]=formData;\n" +
                  "postRequest(\"/system-config/redirect/apiLinkage\",params).then((response)=>{\n" +
                  "    const result = response?.data;\n" +
                  "            if (result?.code) {\n" +
                  "                warning(result.cnMessage);\n" +
                  "                return;\n" +
                  "            }\n" +
                  "            const data = result?.data;\n" +
                  "            if (data) {\n" +
                  "                for (let key in data) {\n" +
                  "                    if (\"_value\" != key) {\n" +
                  "                        formData[key] = data[key];\n" +
                  "                    }\n" +
                  "                }\n" +
                  "            }\n" +
                  "});"
            }

          }
        ]
      },
      fieldName: "fieldSh6Cd03",
      formVisible: true,
    },
    {
      label: i18n("system.created.date"),
      preps: {
        disabled: true,
      },
      fieldName: "createdTime",
      formVisible: false,
      type: "datetime",
    },
    {
      label: i18n("system.updated.date"),
      preps: {
        disabled: true,
      },
      fieldName: "updatedTime",
      formVisible: false,
      type: "datetime",
    },
    {
      label: i18n("system.data.version"),
      fieldName: "version",
      formVisible: false,
      type: "number",
    },
    {
      label: i18n("system.is.deleted"),
      fieldName: "isDel",
      formVisible: false,
      type: "number",
    },
    {
      label: i18n("system.data.number"),
      fieldName: "dataNo",
      formVisible: false,
    },
    {
      label: i18n("system.status.code"),
      fieldName: "statusCode",
      formVisible: false,
    },
    {
      label: i18n("system.status.name"),
      fieldName: "statusName",
      formVisible: false,
    },
    {
      label: i18n("system.international.code"),
      fieldName: "local",
      formVisible: false,
    },
  ],
});
const primaryKey = "idInformations";
const informationsRef = ref();
const rules = {};
const dialogProps = dialogPreps();
provide("dialogProps", dialogProps);

const dataFormat = (name: string, cellValue: object): any => {
  if (name == "parentId") {
    return (
      informationsList.value.find(
        (item: SelectOption) => item.value == cellValue,
      )?.name || cellValue
    );
  } else if (name == "idCustomer") {
    return (
      customerList.value.find((item: SelectOption) => item.value == cellValue)
        ?.name || cellValue
    );
  }
  return cellValue;
};
const initData = async () => {
  let params = [{ propertyName: "statusCode", value: "1" }];
  // const datas = await loadSystemInfo(params);
  // const customs = await loadCustomInfo(params);
  // informationsList.value = datas;
  // customerList.value = customs;
  // systemIconList.value = loadElementPlusIcon();
};
onMounted(async () => {
  await initData();
});
onActivated(() => {});
</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <star-horse-dialog
      :isShowBtnContinue="true"
      :dialogVisible="dialogProps.editVisible"
      :dialogProps="dialogProps"
    >
      <star-horse-form
        @refresh="informationsRef?.loadByPage()"
        :compUrl="dataUrl"
        :fieldList="tableFieldList"
        :rules="rules"
      />
    </star-horse-dialog>
    <star-horse-dialog
      :dialog-visible="dialogProps.viewVisible"
      :dialogProps="dialogProps"
      :source="3"
    >
      <star-horse-data-view
        :data-format="dataFormat"
        :field-list="tableFieldList"
        :compUrl="dataUrl"
      />
    </star-horse-dialog>
    <div class="search-content">
      <div class="search_btn">
        <star-horse-search-comp
          @searchData="(data: any) => informationsRef?.createSearchParams(data)"
          :formData="searchFormData"
          :compUrl="dataUrl"
        />
      </div>
    </div>
    <el-card class="inner_content">
      <star-horse-table-comp
        ref="informationsRef"
        :fieldList="tableFieldList"
        :primaryKey="primaryKey"
        :btn-permissions="{
          view: 'view',
          add: 'add',
          edit: 'edit',
        }"
        :compUrl="dataUrl"
        :dataFormat="dataFormat"
      />
    </el-card>
  </div>
</template>
