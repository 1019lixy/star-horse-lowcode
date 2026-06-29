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
      label: i18n("system.add.time"),
      fieldName: "createdTime",
      formVisible: false,
      type: "daterange",
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
      label: i18n("system.created.by"),
      preps: {
        disabled: true,
      },
      fieldName: "createdBy",
      formVisible: false,
    },
    {
      label: i18n("system.updated.by"),
      preps: {
        disabled: true,
      },
      fieldName: "updatedBy",
      formVisible: false,
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
