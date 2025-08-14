<script setup lang="ts" name="Areainfo">

import { apiInstance, dialogPreps } from "@/api/star_horse_utils";
import { ApiUrls } from "@/components/types/ApiUrls";
import { PageFieldInfo } from "@/components/types/PageFieldInfo";
import { SearchFields } from "@/components/types/SearchProps";
import { onMounted, provide, reactive, ref } from "vue";

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
      label: "数据字典类型",
      fieldName: "dictType",
      type: "select",
      defaultValue:"white_name_filter_type",
      formVisible: true,
      listVisible: true,
      preps: {
        "values": [{ "name": "按钮权限", "value": "button_authority", "xh": 1 }, { "name": "白名单过滤类型", "value": "white_name_filter_type", "xh": 2 }],
        "queryParams": [],
        "dataRelation": {
          "actionName": "change",
          "relationDetails": [{
            "matchType": "eq", "controlCondition": "eqEditableOrDisable", "relationFields": "areaCode",
            "params": "button_authority",
            "xh": 1
          },{
            "matchType": "eq", "controlCondition": "dataLinkage", "relationFields": "dictName",
            "matchFieldName": "dictType",
            "params": {
              url: "http://127.0.0.1:8749/system-config-dev/system/dictinfo/getAllByCondition",
              httpMethod: "POST",
              primaryKey: "idDictType",
              labelName: "dictName",
              valueName: "dictType"
            },
            "xh": 1
          }],
          "relationDetailsDefaultValue": [{}]
        }
      }
    },
    {
      label: "数据字典",
      fieldName: "dictName",
      type: "select",
      formVisible: true,
      listVisible: true,

    },
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
const initData = async () => { };
onMounted(() => {
  initData();
});
</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <star-horse-dialog :isShowBtnContinue="true" :dialogVisible="dialogProps.editVisible" :dialogProps="dialogProps">
      <star-horse-form ref="areaFormRef" @refresh="areainfoRef?.loadByPage()" :compUrl="dataUrl"
        :fieldList="tableFieldList" :rules="rules" />
    </star-horse-dialog>
    <star-horse-dialog :dialog-visible="dialogProps.viewVisible" :dialogProps="dialogProps" :source="3">
      <star-horse-data-view :dataFormat="dataFormat" :field-list="tableFieldList" :compUrl="dataUrl" />
    </star-horse-dialog>
    <div class="search-content">
      <div class="search_btn">
        <star-horse-search-comp @searchData="(data: any) => areainfoRef?.createSearchParams(data)"
          :formData="searchFormData" :compUrl="dataUrl" />
      </div>
    </div>
    <el-card class="inner_content">
      <star-horse-table-comp ref="areainfoRef" :fieldList="tableFieldList" :btnPermissions="btnPermissions"
        :primaryKey="primaryKey" :compUrl="dataUrl" :dataFormat="dataFormat" :showPageBar="false" />
    </el-card>
  </div>
</template>
<style lang="scss" scoped></style>
