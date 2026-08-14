<script setup lang="ts" name="Areainfo">
import {
  apiInstance,
  createSearchField,
  dialogPreps,
} from "@/api/star_horse_utils";
import { ApiUrls } from "@/components/types/ApiUrls";
import { PageFieldInfo } from "@/components/types/PageFieldInfo";
import { SearchFields } from "@/components/types/SearchProps";
import { onMounted, provide, reactive, ref } from "vue";

const dataUrl: ApiUrls = apiInstance("system-config", "system/areainfo");
const searchFormData = reactive<SearchFields>({
  fieldList: [
    createSearchField("区域名称", "areaName", true, "lk"),
    createSearchField("区域编码", "areaCode", true, "lk"),
  ],
});
const imageFieldList = reactive<PageFieldInfo>({
  containerFields: [
    {
      containerType: "table",
      subTablePrimaryKey: "imageInfo",
      fieldList: [
        {
          fieldName: "imageType",
          label: "获取图片方式",
          type: "select",
          formVisible: true,
          defaultValue: "upload",
          preps: {
            values: [
              { name: "上传", value: "upload" },
              { name: "手动输入", value: "manual" },
              { name: "图库选择", value: "select" },
            ],
            dataRelation: {
              actionName: "change",
              relationDetails: [
                {
                  matchType: "eq",
                  controlCondition: "eqVisible",
                  relationFields: "path",
                  matchFieldValue: "upload",
                },
                {
                  matchType: "eq",
                  controlCondition: "eqVisible",
                  relationFields: "picUrl",
                  matchFieldValue: "manual",
                },
                {
                  matchType: "eq",
                  controlCondition: "eqVisible",
                  relationFields: "pic",
                  matchFieldValue: "select",
                },
              ],
              relationDetailsDefaultValue: [{}],
            },
          },
        },
        {
          fieldName: "picUrl2",
          label: "图片地址",
          type: "input",
          formVisible: false,
          defaultValue: "/system-config",
          helpMsg: "例如: http://localhost:8080/system-config",
        },
        {
          fieldName: "pic",
          label: "图片地址",
          type: "dialog-input",
          formVisible: false,
          defaultValue: "/system-config",
          helpMsg: "从图库选择图片",
        },
        {
          label: "图片地址",
          type: "upload",
          fieldName: "path",
          formVisible: true,
        },
        { label: "标题", type: "input", fieldName: "title", formVisible: true },
        {
          label: "描述",
          type: "input",
          fieldName: "description",
          formVisible: true,
        },
        {
          label: "连接地址",
          type: "input",
          fieldName: "linkUrl",
          formVisible: true,
        },
      ],
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
      defaultValue: "white_name_filter_type",
      formVisible: true,
      listVisible: true,
      preps: {
        values: [
          { name: "按钮权限", value: "button_authority", xh: 1 },
          { name: "白名单过滤类型", value: "white_name_filter_type", xh: 2 },
        ],
        queryParams: [],
        dataRelation: {
          actionName: "change",
          relationDetails: [
            {
              matchType: "eq",
              controlCondition: "eqDisable",
              relationFields: "areaCode",
              matchFieldValue: "button_authority",
              xh: 1,
            },
            {
              matchType: "eq",
              controlCondition: "asParamDataLinkage",
              relationFields: "dictName",
              matchFieldName: "dictType",
              params: {
                url: "http://127.0.0.1:8749/system-config-dev/system/dictinfo/getAllByCondition",
                httpMethod: "POST",
                primaryKey: "idDictType",
                labelName: "dictName",
                valueName: "dictType",
              },
              xh: 1,
            },
          ],
          relationDetailsDefaultValue: [{}],
        },
      },
    },
    {
      label: "数据字典",
      fieldName: "dictName",
      type: "select",
      formVisible: true,
      listVisible: true,
    },
  ],
  containerFields: [],
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
const initData = async () => {};
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
        :fieldList="imageFieldList"
        :rules="rules"
      />
    </star-horse-dialog>
    <star-horse-dialog
      v-model="dialogProps.viewVisible"
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
        :fieldList="imageFieldList"
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
