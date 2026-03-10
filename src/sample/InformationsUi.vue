<script setup lang="ts" name="Rolesinfo">

import { onMounted, provide, reactive, ref } from "vue";
import { isSystemManage } from "@/utils/auth";
import { i18n } from "@/lang";
import {StarHorseTableComp} from "@/components/comp";
import {ApiUrls, PageFieldInfo, SearchFields, SelectOption, UserFuncInfo} from "@/components/types";
import {apiInstance, dialogPreps} from "@/api/star_horse_utils";

const dataUrl: ApiUrls = apiInstance("system-config", "system/rolesinfo");
let departmentList = ref<SelectOption[]>([]);
let systemList = ref<SelectOption[]>([]);
let menusList = ref([]);
let selfBtnFunc = ref<UserFuncInfo[]>([]);
const starHorseTableCompRef = ref();
// 0 普通角色 1高级角色 2普通管理员 3 超级管理员 默认 0
const roleTypes = ref<SelectOption[]>([
  { name: i18n("system.normal.user.group"), value: 0 },
  { name: i18n("system.advanced.user.group"), value: 1 },
  { name: i18n("system.super.user.group"), value: 2 },
]);
const sessionTimeOut = [
  { name: i18n("system.15.minutes"), value: 15 },
  { name: i18n("system.30.minutes"), value: 30 },
  { name: i18n("system.60.minutes"), value: 60 },
  { name: i18n("system.180.minutes"), value: 180 },
  { name: i18n("system.unlimited"), value: 0 },
];
const searchFormData = reactive<SearchFields>({
  fieldList: [
    {
      label: i18n("system.user.group.name"),
      fieldName: "roleName",
      defaultVisible: true,
      matchType: "lk",
    },
    /* {label: i18n("system.role.code"), fieldName: "roleCode",  matchType: "lk"},*/
    {
      label: i18n("system.user.group.type"),
      fieldName: "roleType",
      defaultVisible: true,
      type: "select",
      preps: {
        values: roleTypes,
      },
    },
  ],
});
const tableFieldList = reactive<PageFieldInfo | any>({
  fieldList: [
    {
      label: i18n("system.primary.key"),
      fieldName: "idRolesinfo",
      formVisible: false,
    },
    {
      label: i18n("system.user.group.name"),
      fieldName: "roleName",

      required: true,
      formVisible: true,
      listVisible: true,
    },

    {
      label: i18n("system.user.group.code"),
      fieldName: "roleCode",
      listVisible: true,
      required: true,
      preps: {
        editDisabled: true,
      },
    },
    {
      label: i18n("system.user.group.type"),
      fieldName: "roleType",
      type: "select",
      required: true,
      formVisible: true,
      listVisible: true,
      preps: {
        editDisabled: true,
        values: roleTypes,
      },
    },
    {
      label: i18n("system.session.timeout"),
      fieldName: "sessionTimeOut",
      type: "select",
      required: true,
      formVisible: true,
      defaultValue: 30,
      listVisible: true,
      preps: {
        values: sessionTimeOut,
      },
    },
    [
      {
        label: i18n("system.system.permissions"),
        fieldName: "appsList",
        type: "select",
        required: true,
        preps: {
          multiple: true,
          values: systemList,
        },
      },
      {
        label: i18n("system.menu.permissions"),
        fieldName: "menusList",
        type: "tselect",
        required: true,
        preps: {
          multiple: true,
          data: menusList,
        },
      },
    ],
    {
      label: i18n("system.user.group.responsibility"),
      fieldName: "roleDesc",
      type: "textarea",
      formVisible: true,
      listVisible: true,
    },
    {
      label: i18n("system.created.by"),
      disabled: true,
      fieldName: "createdBy",
      formVisible: false,

      listVisible: true,
    },
    {
      label: i18n("system.updated.by"),
      disabled: true,
      fieldName: "updatedBy",
      formVisible: false,
    },
    {
      label: i18n("system.created.date"),
      disabled: true,
      fieldName: "createdTime",
      formVisible: false,
      type: "datetime",
      listVisible: true,
    },
    {
      label: i18n("system.updated.date"),
      disabled: true,
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
const primaryKey = "idRolesinfo";
const rules = {};
const dialogProps = dialogPreps();
provide("dialogProps", dialogProps);

const dataFormat = (name: string, cellValue: any, row: any): any => {
  let data = [] as Array<any>;
  if (name == "roleType") {
    let fdata = roleTypes.value.find(
        (item) => item.value == parseInt(cellValue),
    );
    return fdata?.name || cellValue;
  } else if (name == "departments" && row) {
    row["departments"]?.forEach((item: any) => {
      data.push(item.deptName);
      row["idDepartment"] = item.idDepartment;
    });
    return data.join(";");
  } else if (name == "appsList" && row) {
    row["appsList"]?.forEach((item: any) => {
      data.push(item.sysName);
    });
    return data.join(";");
  } else if (name == "menusList" && row) {
    row["menusList"]?.forEach((item: any) => {
      data.push(item.menuName);
    });
    return data.join(";");
  }
  return cellValue;
};
/**
 * 递归函数，查找已设置为快捷菜单的数据
 *
 * @param path
 * @param datas
 */
const recallFun = (id: string, datas: any): any => {
  let reitem: any = {};
  for (let key in datas) {
    let item = datas[key];
    if (item.idMenusinfo == id) {
      reitem = item;
      break;
    }
    if (Object.keys(item.children).length > 0) {
      reitem = recallFun(id, item.children);
      if (Object.keys(reitem).length > 0) {
        break;
      }
    }
  }
  return reitem;
};

const initData = async () => {
  let params: any = [
    { propertyName: "isDel", value: 0 },
    { propertyName: "statusCode", value: "1" },
  ];
  // departmentList.value = await loadDepartmentInfo(params);
  // systemList.value = await loadSystemInfo(params);
  //只有系统管理员可以看到系统管理员
  if (isSystemManage()) {
    roleTypes.value.push({ name: "系统用户组", value: 3 });
  }
};
onMounted(async () => {
  await initData();
});
</script>
<style lang="scss" scoped></style>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <star-horse-dialog
        :isShowBtnContinue="true"
        :dialogVisible="dialogProps.editVisible"
        :dialogProps="dialogProps"
    >
      <star-horse-form
          :compUrl="dataUrl"
          @refresh="starHorseTableCompRef?.loadByPage()"
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
            @searchData="
            (data: any) => starHorseTableCompRef?.createSearchParams(data)
          "
            :formData="searchFormData"
            :compUrl="dataUrl"
        />
      </div>
    </div>
    <el-card class="inner_content">
      <star-horse-table-comp
          ref="starHorseTableCompRef"
          :fieldList="tableFieldList"
          :primaryKey="primaryKey"
          :btn-permissions="{
            view:'view',
            edit:'edit'
          }"
          :compUrl="dataUrl"
          :dataFormat="dataFormat"
      />
    </el-card>
  </div>
</template>
