<script setup lang="ts" name="Areainfo">
import {nextTick, onMounted, provide, ref} from "vue";
import {PageFieldInfo} from "@/components/types/PageFieldInfo";
import {StarHorseForm, StarHorseTableComp} from "@/components/comp";
import {apiInstance, closeLoad, dialogPreps, load,} from "@/api/star_horse_utils";
import {download} from "@/api/star_horse_apis";
import {warning} from "@/utils/message";
import {ApiUrls, SearchFields} from "@/components/types";
import {isMobile} from "@/api/device";
import StarHorseDrawer from "@/components/comp/StarHorseDrawer.vue";
import {StarHorseEditor} from "@/components/system";

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
  "fieldList" : [ {
    "fieldName" : "descriptions",
    "containerType" : "descriptions",
    "containerFields" : [ {
      "containerType" : "descriptions",
      "title" : "描述列表",
      "disabled" : false,
      "formVisible" : true,
      "subFormFlag" : false,
      "subTablePrimaryKey" : "descriptions",
      "subTableName" : "descriptions",
      "fieldList" : [ {
        "label" : "字段1",
        "fieldName" : "fieldSh5C96",
        "type" : "input",
        "required" : false,
        "formVisible" : true,
        "listVisible" : true,
        "defaultValue" : false,
        "preps" : {
          "clearable" : true,
          "readonly" : false,
          "formVisible" : true,
          "name" : "fieldSh5C96",
          "id" : "Idsh5c966c5c-37f2-4b8b-96a9-360c571c6a5b",
          "label" : "字段1",
          "placeholder" : "请输入字段1",
          "listVisible" : true,
          "hideLabel" : true
        }
      }, {
        "label" : "字段2",
        "fieldName" : "fieldShe861",
        "type" : "input",
        "required" : false,
        "formVisible" : true,
        "listVisible" : true,
        "defaultValue" : false,
        "preps" : {
          "clearable" : true,
          "readonly" : false,
          "formVisible" : true,
          "name" : "fieldShe861",
          "id" : "Idshe861ccb6-d11d-4950-8745-4dfbc2e91acb",
          "label" : "字段2",
          "placeholder" : "请输入字段2",
          "listVisible" : true,
          "hideLabel" : true
        }
      }, {
        "label" : "字段3",
        "fieldName" : "fieldSh752D",
        "type" : "input",
        "required" : false,
        "formVisible" : true,
        "listVisible" : true,
        "defaultValue" : false,
        "preps" : {
          "clearable" : true,
          "readonly" : false,
          "formVisible" : true,
          "name" : "fieldSh752D",
          "id" : "Idsh752d7fa5-2942-4ec5-8eef-cc7a7daeeea2",
          "label" : "字段3",
          "placeholder" : "请输入字段3",
          "listVisible" : true,
          "hideLabel" : true
        }
      }, {
        "label" : "字段4",
        "fieldName" : "fieldShc565",
        "type" : "input",
        "required" : false,
        "formVisible" : true,
        "listVisible" : true,
        "defaultValue" : false,
        "preps" : {
          "clearable" : true,
          "readonly" : false,
          "formVisible" : true,
          "name" : "fieldShc565",
          "id" : "Idshc5654ef9-162d-462e-9fe5-bf7f09bca4f4",
          "label" : "字段4",
          "placeholder" : "请输入字段4",
          "listVisible" : true,
          "hideLabel" : true
        }
      }, {
        "label" : "字段5",
        "fieldName" : "fieldShf525",
        "type" : "input",
        "required" : false,
        "formVisible" : true,
        "listVisible" : true,
        "defaultValue" : false,
        "preps" : {
          "clearable" : true,
          "readonly" : false,
          "formVisible" : true,
          "name" : "fieldShf525",
          "id" : "Idshf5252720-ca9c-4470-8ee0-0391b31f9763",
          "label" : "字段5",
          "placeholder" : "请输入字段5",
          "listVisible" : true,
          "hideLabel" : true
        }
      } ],
      "preps" : { }
    } ],
    "preps" : {
      "label" : "描述列表",
      "subFormFlag" : "Y",
      "mapping" : "1",
      "span" : "1",
      "width" : null,
      "align" : "",
      "labelAlign" : "",
      "id" : "Idshe7c19552-8706-4681-9223-0d5463e9c947",
      "itemNameLabel" : "描述列表",
      "name" : "fieldShe7C1",
      "direction" : "horizontal",
      "column" : 2,
      "border" : true,
      "size" : "default",
      "descItemLabelWidth" : "80px",
      "descItemAlign" : "left",
      "rules" : [ ],
      "maxLength" : 255,
      "formVisible" : true,
      "listVisible" : true,
      "viewVisible" : true,
      "descTitle" : "",
      "descItemLabelAlign" : "",
      "descItemClassName" : "",
      "descItemLabelClassName" : "",
      "descExtra" : ""
    }
  }, {
    "label" : "角色Id",
    "fieldName" : "createdRoleId",
    "type" : "input",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "创建人",
    "fieldName" : "createdBy",
    "type" : "input",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "修改人",
    "fieldName" : "updatedBy",
    "type" : "input",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "版本号",
    "fieldName" : "version",
    "type" : "number",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "是否删除",
    "fieldName" : "isDel",
    "type" : "number",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "数据编号",
    "fieldName" : "dataNo",
    "type" : "input",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "状态",
    "fieldName" : "statusCode",
    "type" : "select",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : {
      "urlOrDictName" : "common",
      "name" : "statusCode",
      "dataSource" : "dict"
    },
    "commonFlag" : "Y"
  }, {
    "label" : "状态名称",
    "fieldName" : "statusName",
    "type" : "input",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "国际编码",
    "fieldName" : "local",
    "type" : "input",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "备注",
    "fieldName" : "remark",
    "type" : "textarea",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  }, {
    "label" : "租户",
    "fieldName" : "tenantId",
    "type" : "select",
    "formVisible" : false,
    "listVisible" : false,
    "preps" : { },
    "commonFlag" : "Y"
  } ],
  "containerFields" : [ ],
  "userTableFuncs" : [ ],

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
      <StarHorseEditor/>
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
