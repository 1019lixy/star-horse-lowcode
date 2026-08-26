<script setup lang="ts" name="Areainfo">
import { nextTick, onMounted, provide, ref } from "vue";
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
import { ApiUrls, SearchFields } from "@/components/types";
import { isMobile } from "@/api/device";
import StarHorseDrawer from "@/components/comp/StarHorseDrawer.vue";
import { StarHorseEditor } from "@/components/system";

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
const searchFormData = ref<SearchFields>({
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
    {label:"输入框1",fieldName: "input1"},
    {label:"输入框2",fieldName: "input2"},
    {label:"输入框3",fieldName: "input3"},
    {
      label:"下拉框",
      fieldName:"fieldShbf30",
      type:"select",
      preps:{
        "formula": {
          "enable": false,
          "type": "calc",
          "sourceFields": [],
          "expression": ""
        },
        "dataSource": "data",
        "apiDataSource": {
          "apiInfo": {
            "apiType": "systemApi",
            "httpMethod": "POST",
            "protocol": "http",
            "redirect": true,
            "serviceName": "system-config-dev",
            "interfaceName": "DictinfoTypeController",
            "method": "getAllByCondition",
            "url": "http://192.168.120.149:8749/system-config/system/dictinfoType/getAllByCondition"
          },
          "proxyUrl": "/system-config/redirect/apiLinkage",
          "conditionFields": [
            "fieldShbf30"
          ],
          "optionField": {
            "labelField": "dictTypeName",
            "valueField": "dictTypeCode"
          }
        }
      }
    }
  ],
  containerFields: [],
  userTableFuncs: [],
});

const initData = async () => {
  nextTick(() => {
    // codeGeneratorRef.value?.initData([{}, {}]);
  });
};
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
const drawerVisible = ref(false);
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
      v-model="dialogProps.editVisible"
      :dialogProps="dialogProps"
      :selfFunc="false"
      @merge="generateMerge"
      @closeAction="closeAction"
      boxHeight="85%"
    >
      {{ dialogProps.viewVisible }}
      <el-button @click="dialogProps.viewVisible = true">Click</el-button>
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
      v-model="dialogProps.viewVisible"
      :source="3"
      boxHeight="85%"
    >
      <star-horse-data-view
        :preview="true"
        :field-list="fieldList"
        :compUrl="dataUrl"
      />
    </star-horse-dialog>
    <div class="search-content" v-if="!isMobile">
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
    <star-horse-drawer v-model="drawerVisible">
      <el-button @click="dialogProps.editVisible = true">Click</el-button>
    </star-horse-drawer>
    <el-button @click="drawerVisible = true">Click</el-button>
    <el-card class="inner_content">
      <StarHorseEditor />
      <star-horse-table-comp
        ref="codeGeneratorRef"
        :fieldList="fieldList"
        :primaryKey="primaryKey"
        :compUrl="dataUrl"
        :preview="true"
        :searchFormData="searchFormData"
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
