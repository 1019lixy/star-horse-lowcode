<script setup lang="ts" name="Areainfo">
import {apiInstance, dialogPreps} from "@/api/star_horse_utils";
import {ApiUrls} from "@/components/types/ApiUrls";
import {PageFieldInfo} from "@/components/types/PageFieldInfo";
import {SearchFields} from "@/components/types/SearchProps";
import {onMounted, provide, reactive, ref} from "vue";

const dataUrl: ApiUrls = apiInstance("system-config", "system/areainfo");
const searchFormData = reactive<SearchFields>({
  fieldList: [
    {
      label: "区域名称",
      defaultVisible: true,
      matchType: "lk",
      fieldName: "areaName",
    },
    {
      label: "区域编码",
      defaultVisible: true,
      matchType: "lk",
      fieldName: "areaCode",
    },
  ],
});
const tableFieldList = reactive<PageFieldInfo>({
  fieldList: [
    {
      label: "区域主键",
      fieldName: "idAreainfo",
      type: "long",
    },
    {
      label: "父节点编号",
      fieldName: "parentNo",
      type: "select",
      formVisible: true,
      listVisible: true,
    },
    {
      label: "区域名称",
      fieldName: "areaName",

      formVisible: true,
      listVisible: true,
    },
    {
      label: "区域编码",
      fieldName: "areaCode",

      formVisible: true,
      listVisible: true,
    },
    {

      "id": "Idshb884094c-00b8-4c96-8c73-d483a7cde78c", "preps": {
        "showArrow": true,
        "placeholder": "请选择选择器",
        "multipleLimit": null,
        "filterable": true,
        "collapseTags": true,
        "collapseTagsTooltip": true,
        "id": "Idshb884094c-00b8-4c96-8c73-d483a7cde78c",
        "label": "选择器",
        "itemNameLabel": "选择器",
        "name": "select1",
        "clearable": true,
        "readonly": false,
        "maxLength": 255,
        "rules": [],

        "viewVisible": true,
        "remote": false,
        "dataSource": "data",
        "analysisType": "func",
        "values": [{"name": "abc", "value": "abc", "xh": 1}],
        "httpMethod": "POST",
        "protocol": "http",
        "queryParams": [],
        "dataRelation": {
          "actionName": "change",
          "relationDetails": [{
            "matchType": "eq",
            "matchFieldName": "select1",
            "controlCondition": "eqHide",
            "relationFields": ["input2"],
            "matchFieldValue": ["abc"],
            "xh": 1,
            "starHorseEditing": "no",
            "isWorking": false
          }],
          "relationDetailsDefaultValue": [{}],
          "showArrow": true,
          "placeholder": "请选择选择器",
          "multipleLimit": null,
          "filterable": true,
          "collapseTags": true,
          "collapseTagsTooltip": true,
          "id": "Idshb884094c-00b8-4c96-8c73-d483a7cde78c",
          "label": "选择器",
          "itemNameLabel": "选择器",
          "name": "select1",
          "clearable": true,
          "readonly": false,
          "maxLength": 255,
          "rules": [],
          "formVisible": true,
          "listVisible": true,
          "viewVisible": true,
          "remote": false,
          "dataSource": "data",
          "analysisType": "func",
          "values": [{"name": "abc", "value": "abc", "xh": 1}],
          "httpMethod": "POST",
          "protocol": "http",
          "queryParams": []
        }
      }, "compType": "formItem", "fieldName": "select1", "itemType": "select", "label": "选择器", "type": "select",
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true,
    }, {

      "id": "Idshcef5cda5-0545-494b-9574-24a33da941dc",
      "preps": {
        "placeholder": "请输入单行文本框",
        "minlength": null,
        "rows": null,
        "min": null,
        "max": null,
        "resize": "none",
        "id": "Idshcef5cda5-0545-494b-9574-24a33da941dc",
        "label": "单行文本框",
        "itemNameLabel": "单行文本框",
        "name": "input2",
        "clearable": true,
        "readonly": false,
        "maxLength": 255,
        "rules": [],
        "formVisible": true,
        "listVisible": true,
        "viewVisible": true
      },
      "compType": "formItem",
      "fieldName": "input2",
      "itemType": "input",
      "label": "单行文本框",
      "type": "input",
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true,
    }
  ],
  batchFieldList: [],
});
const primaryKey = "idAreainfo";
const areainfoRef = ref();
const areaFormRef = ref();
const rules = {};
const dialogProps = dialogPreps();
provide("dialogProps", dialogProps);
//手动赋值权限
const btnPermissions = {
  add: true,
  edit: true,
  delete: true,
  view: true,
};
const dataFormat = (_name: string, cellValue: object): any => {
  return cellValue;
};
const initData = async () => {
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
    >
      <star-horse-form
          ref="areaFormRef"
          @refresh="areainfoRef?.loadByPage()"
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
          :dataFormat="dataFormat"
          :field-list="tableFieldList"
          :compUrl="dataUrl"
      />
    </star-horse-dialog>
    <div class="search-content">
      <div class="search_btn">
        <star-horse-search-comp
            @searchData="(data: any) => areainfoRef?.createSearchParams(data)"
            :formData="searchFormData"
            :compUrl="dataUrl"
        />
      </div>
    </div>
    <el-card class="inner_content">
      <star-horse-table-comp
          ref="areainfoRef"
          :fieldList="tableFieldList"
          :btnPermissions="btnPermissions"
          :primaryKey="primaryKey"
          :compUrl="dataUrl"
          :dataFormat="dataFormat"
          :showPageBar="false"
      />
    </el-card>
  </div>
</template>
<style lang="scss" scoped></style>
