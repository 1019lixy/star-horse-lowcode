<script setup lang="ts" name="EnvInfo">
import {i18n} from "@/lang";
import {onMounted, provide, reactive, ref} from "vue";
import {StarHorseDataView, StarHorseTableComp} from "@/components/comp";
import {ApiUrls, OrderByInfo, PageFieldInfo, SearchFields, SelectOption, UserFuncInfo} from "@/components/types";
import {apiInstance, closeLoad, dialogPreps, load} from "@/api/star_horse_utils";
import {dictData, download} from "@/api/star_horse_apis";
import {warning} from "@/utils/message";
import {createDatetime} from "@/api/date_utils";

const dataUrl: ApiUrls = apiInstance("userdb-manage", "generator/code");

let dbInfoList = ref<Array<SelectOption>>([]);
let tableInfoList = ref<Array<SelectOption>>([]);
let templateVersionList = ref<Array<SelectOption>>([]);
let languageList = ref<Array<SelectOption>>([]);
let fileTypeList = ref<Array<SelectOption>>([]);
const codeGener = ref<string>("form");
//,可用值:VUE_3,VUE_3_TS,REACT,REACT_TS
let uiTypeList = ref<Array<SelectOption>>([]);
let packagingList = ref<Array<SelectOption>>([]);
//注册中心类型
let registryTypeList = ref<Array<SelectOption>>([]);
//缓存类型
let cacheTypeList = ref<Array<SelectOption>>([]);
//模块列表
let moduleNameList = ref<Array<SelectOption>>([]);
//操作系统类型
let osTypeList = ref<Array<SelectOption>>([]);
//部署类型
let deployTypeList = ref<Array<SelectOption>>([]);
const loadTabInfo = async (val: any) => {
  let dataId = val["datasourceConfigId"];
  if (!dataId || dataId == "undefined") {
    return;
  }
  tableInfoList.value = [];
};
const searchFormData = reactive<SearchFields>({
  fieldList: [
    {
      label: "数据源",
      fieldName: "datasourceConfigId",
      type: "select",
      defaultVisible: true,
      preps: {
        values: dbInfoList,
      },
    },
    {
      label: "项目名称",
      fieldName: "projectName",
      matchType: "lk",
      defaultVisible: true,
    },
    {
      label: "项目名称x",
      fieldName: "projectNamex",
      matchType: "lk",
      defaultVisible: true,
    },
    {
      label: "项目名称y",
      fieldName: "projectNamey",
      matchType: "lk",
      defaultVisible: true,
    },
    {
      label: "项目名称z",
      fieldName: "projectNamez",
      matchType: "lk",
      defaultVisible: false,
    },
    {
      label: "项目名称a",
      fieldName: "projectNamea",
      matchType: "lk",
      defaultVisible: true,
    },
    {
      label: "项目名称b",
      fieldName: "projectNameb",
      matchType: "lk",
      defaultVisible: false,
    },
    {
      label: "应用名称",
      fieldName: "applicationName",
      matchType: "lk",
      defaultVisible: true,
    },
  ],
});
const appFieldList = reactive<PageFieldInfo>({
  fieldList: []
});
const tableFieldList = reactive<PageFieldInfo>({
  fieldList: [
    {
      label: "主键",
      fieldName: "idCodeGenerator",
      formVisible: false,
    },
    [
      {
        label: "数据源",
        fieldName: "datasourceConfigId",
        type: "select",
        required: true,
        formVisible: true,
        actions: {change: loadTabInfo},
        listVisible: true,
        preps: {
          values: dbInfoList,
          stopInitCallAction: true,
        },
      },
      {
        label: "表名",
        fieldName: "tablesList",
        type: "select",
        helpMsg: `${i18n("codegen.this.property.empty")}`,
        formVisible: true,
        listVisible: true,
        preps: {
          multiple: true,
          values: tableInfoList,
        },
      },
    ],
    [
      {
        label: "排除表名",
        fieldName: "excludesList",
        type: "select",
        formVisible: true,
        listVisible: true,
        preps: {
          multiple: true,
          values: tableInfoList,
        },
      },
      {
        label: "前缀",
        fieldName: "prefixesStr",
        aliasName: "prefixes",
        formVisible: true,
        helpMsg: `${i18n("codegen.if.this.property.empty")}`,
        listVisible: true,
      },
    ],
    [
      {
        label: "后端模板",
        fieldName: "backendTemplateVersion",
        type: "select",
        formVisible: true,
        defaultValue: "2_6",

        listVisible: true,
        preps: {
          values: templateVersionList,
        },
      },
      {
        label: "前端模板",
        fieldName: "frontTemplateVersion",
        type: "select",
        formVisible: true,
        defaultValue: "2_6",
        listVisible: true,
        preps: {
          values: templateVersionList,
        },
      },
    ],

    {
      fieldName: "tab2",
      preps: {
        type: "border-card",
      },
      tabList: [
        {
          title: "项目配置",
          tabName: "tab2",
          fieldList: [
            {
              label: "生成模块",
              fieldName: "createModules",
              type: "checkbox",
              helpMsg: `选择了前端/后端项目后,选择的前端或者后端代码自动失效`,
              preps: {
                values: [
                  {name: "后端代码", value: "backendCode"},
                  {name: "前端代码", value: "frontendCode"},
                  {name: "后端项目", value: "backendProject"},
                  {name: "前端项目", value: "frontendProject"},
                  {name: "权限系统", value: "auth"},
                ],
              },
              actions: {
                change: (val: any) => {
                  const modules = val["createModules"] ?? [];
                  if (modules.includes("backendProject")) {
                    val.createModules = modules.filter(
                        (item: any) => item !== "backendCode",
                    );
                  }
                  if (modules.includes("frontendProject")) {
                    val.createModules = modules.filter(
                        (item: any) => item !== "frontendCode",
                    );
                  }
                  console.log(val);
                },
              },
            },
            {
              fieldName: "backendConfig",
              tabList: [
                {
                  title: "后端配置",
                  tabName: "backendConfig",
                  objectName: "backendConfig",
                  subFormFlag: "Y",
                  fieldList: [
                    [
                      {
                        label: i18n("codegen.backend.language"),
                        fieldName: "language",
                        type: "select",
                        formVisible: true,
                        defaultValue: "java",
                        helpMsg: i18n("codegen.currently.only.support.java"),
                        listVisible: true,
                        preps: {
                          values: languageList,
                        },
                      },
                      {
                        label: i18n("codegen.package.name"),
                        fieldName: "packageName",
                        required: true,
                        formVisible: true,
                        defaultValue: "com.starhorse.devops",
                        helpMsg: "eg: com.starhorse.test",
                        listVisible: true,
                      },
                    ],
                    [
                      {
                        label: i18n("codegen.project.name"),
                        fieldName: "projectName",
                        formVisible: true,
                        helpMsg: i18n("codegen.code.belong.project"),
                      },
                      {
                        label: i18n("codegen.category.name"),
                        fieldName: "categoryName",
                        required: true,
                        formVisible: true,
                        helpMsg: i18n("codegen.maven.project.module.name"),
                        listVisible: true,
                      },
                    ],
                    [
                      {
                        label: i18n("codegen.application.name"),
                        fieldName: "applicationName",
                        required: true,
                        formVisible: true,
                        helpMsg: i18n("codegen.config.file.application.name"),
                        listVisible: true,
                      },
                      {
                        label: i18n("codegen.application.port"),
                        fieldName: "port",
                        type: "number",
                        formVisible: true,
                        helpMsg: i18n("codegen.config.file.server.port"),
                      },
                    ],
                    [
                      {
                        label: i18n("codegen.target.directory"),
                        fieldName: "targetDir",
                        formVisible: true,
                        helpMsg: i18n("codegen.files.deploy.server.directory"),
                      },
                      {
                        label: i18n("codegen.restful.api"),
                        fieldName: "restFul",
                        type: "switch",
                        formVisible: true,
                        defaultValue: "Y",
                        preps: {
                          activeValue: "Y",
                          inactiveValue: "N",
                        },
                      },
                    ],
                    [
                      {
                        label: i18n("codegen.packaging.type"),
                        fieldName: "war",
                        type: "select",
                        formVisible: true,
                        defaultValue: "jar",
                        helpMsg: i18n("codegen.pom.xml.packaging"),
                        preps: {
                          values: packagingList,
                        },
                      },

                      {
                        label: i18n("codegen.separate.dto"),
                        fieldName: "needSplitDto",
                        type: "switch",
                        formVisible: true,
                        helpMsg: i18n("codegen.dto.files.business.files"),
                        defaultValue: "N",
                        preps: {
                          activeValue: "Y",
                          inactiveValue: "N",
                        },
                      },
                    ],
                    {
                      label: i18n("codegen.code.version"),
                      fieldName: "version",
                      formVisible: false,
                      helpMsg: i18n("codegen.pom.xml.version"),
                    },
                  ],
                },
                {
                  title: "前端配置",
                  tabName: "frontendConfig",
                  objectName: "frontendConfig",
                  subFormFlag: "Y",
                  fieldList: [
                    {
                      label: i18n("codegen.group.condition"),
                      fieldName: "visibleColumns",
                      type: "number",
                      formVisible: true,
                      helpMsg: i18n("codegen.field.visible.columns"),
                      listVisible: true,
                      defaultValue: -1,
                      preps: {
                        colspan: 6,
                        min: -1,
                        max: 10,
                      },
                    },
                    {
                      label: i18n("codegen.group.columns"),
                      fieldName: "groupColumns",
                      type: "number",
                      formVisible: true,
                      helpMsg: i18n("codegen.form.page.group.columns"),
                      listVisible: true,
                      defaultValue: 2,
                      preps: {
                        colspan: 6,
                        min: 2,
                        max: 6,
                      },
                    },
                    {
                      label: i18n("codegen.generate.ui"),
                      fieldName: "needUi",
                      type: "switch",
                      formVisible: true,
                      defaultValue: "Y",
                      preps: {
                        activeValue: "Y",
                        inactiveValue: "N",
                      },
                    },
                    {
                      label: "端口",
                      fieldName: "port",
                      type: "number",
                      formVisible: true,
                      helpMsg: "",
                    },
                    {
                      label: i18n("codegen.ui.suffix"),
                      fieldName: "uiSuffix",
                      formVisible: true,
                      defaultValue: ".vue",
                    },
                    {
                      label: i18n("codegen.ui.type"),
                      fieldName: "uiType",
                      type: "select",
                      formVisible: true,
                      defaultValue: "VUE_3_TS",
                      preps: {
                        values: uiTypeList,
                      },
                    },
                  ],
                },
                {
                  title: "权限系统配置",
                  tabName: "authConfig",
                  objectName: "authConfig",
                  subFormFlag: "Y",
                  fieldList: [
                    {
                      label: "模块名称",
                      fieldName: "moduleNames",
                      type: "select",
                      preps: {
                        multiple: true,
                        values: moduleNameList,
                      },
                    },
                    {
                      label: "是否初始化权限脚本",
                      fieldName: "initAuthScripts",
                      type: "switch",
                    },
                    {
                      label: "初始化用户组权限",
                      fieldName: "initUserGroupAuth",
                      type: "switch",
                    },
                  ],
                },
                {
                  title: "应用注册中心配置",
                  tabName: "registryConfig",
                  objectName: "registryConfig",
                  subFormFlag: "Y",
                  fieldList: [
                    {
                      label: "注册中心类型",
                      fieldName: "registryType",
                      type: "select",
                      formVisible: true,
                      preps: {
                        values: registryTypeList,
                      },
                    },
                  ],
                },
                {
                  title: "后端缓存配置",
                  tabName: "cacheConfig",
                  objectName: "cacheConfig",
                  subFormFlag: "Y",
                  fieldList: [
                    {
                      label: "缓存类型",
                      fieldName: "cacheType",
                      type: "select",
                      formVisible: true,
                      preps: {
                        values: cacheTypeList,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          title: i18n("codegen.comment.related"),
          tabName: "tab1",
          fieldList: [
            {
              label: i18n("codegen.developer"),
              fieldName: "author",

              formVisible: true,
            },
            {
              label: i18n("codegen.email"),
              fieldName: "email",

              formVisible: true,
            },
            {
              label: i18n("codegen.need.copyright"),
              fieldName: "needCopyright",
              type: "switch",
              formVisible: true,
              preps: {
                activeValue: "Y",
                inactiveValue: "N",
              },
            },
          ],
        },
        {
          title: "自动部署配置",
          tabName: "tab5",
          batchFieldList: [
            {
              batchName: "deployList",
              fieldList: [
                [
                  {
                    label: "部署类型",
                    type: "select",
                    required: true,
                    fieldName: "deployType",
                    formVisible: true,
                    preps: {
                      values: deployTypeList,
                    },
                  },
                  {
                    label: "Os类型",
                    fieldName: "osType",
                    formVisible: true,
                    required: true,
                    type: "select",
                    preps: {
                      values: osTypeList,
                    },
                  },
                ],

                [
                  {
                    label: "主机地址",
                    formVisible: true,
                    fieldName: "host",
                  },
                  {
                    label: "端口",
                    type: "number",
                    formVisible: true,
                    fieldName: "port",
                  },
                ],
                [
                  {
                    label: "资源目录",
                    formVisible: true,
                    fieldName: "sourceDir",
                  },
                  {
                    label: "部署目录",
                    formVisible: true,
                    fieldName: "distDir",
                  },
                ],
                [
                  {
                    label: "是否集群",
                    type: "switch",
                    fieldName: "isCluster",
                    formVisible: true,
                    defaultValue: "N",
                    preps: {
                      activeValue: "Y",
                      inactiveValue: "N",
                    },
                  },
                  {
                    label: "部署超时时间",
                    formVisible: true,
                    type: "number",
                    fieldName: "timeout",
                    helpMsg: "默认-1不超时",
                    defaultValue: -1,
                    preps: {
                      min: -1,
                      suffix: "分",
                    },
                  },
                ],
                {
                  label: "服务器认证方式",
                  fieldName: "loginType",
                  type: "select",
                  required: true,
                  formVisible: true,
                  preps: {
                    values: [
                      {name: "账号", value: "username"},
                      {name: "证书", value: "authentication"},
                    ],
                    dataRelation: {
                      actionName: "change",
                      relationDetails: [
                        {
                          matchType: "eq",
                          controlCondition: "eqVisible",
                          relationFields: ["username", "password"],
                          matchFieldValue: "username",
                        },
                        {
                          matchType: "eq",
                          controlCondition: "eqVisible",
                          relationFields: ["certificationContent"],
                          matchFieldValue: "authentication",
                        },
                      ],
                      relationDetailsDefaultValue: [{}],
                    },
                  },
                },
                [
                  {
                    label: "用户名",
                    fieldName: "username",
                    formVisible: false,
                  },
                  {
                    label: "密码",
                    fieldName: "password",
                    type: "password",
                    formVisible: false,
                  },
                ],
                {
                  label: "证书内容",
                  fieldName: "certificationContent",
                  type: "textarea",
                  formVisible: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: i18n("codegen.created.by"),
      disabled: true,
      fieldName: "createdBy",
      formVisible: false,

      listVisible: true,
    },
    {
      label: i18n("codegen.created.date"),
      disabled: true,
      fieldName: "createdTime",
      formVisible: false,
      type: "datetime",
      listVisible: true,
    },
    {
      label: i18n("codegen.updated.by"),
      disabled: true,
      fieldName: "updatedBy",
      formVisible: false,

      listVisible: true,
    },

    {
      label: i18n("codegen.updated.date"),
      disabled: true,
      fieldName: "updatedTime",
      formVisible: false,
      type: "datetime",
      listVisible: true,
    },
    {
      label: i18n("codegen.is.deleted"),
      fieldName: "isDel",
      formVisible: false,
      type: "number",
    },
    {
      label: i18n("codegen.data.number"),
      fieldName: "dataNo",
      formVisible: false,
    },
    {
      label: i18n("codegen.status.code"),
      fieldName: "statusCode",
      formVisible: false,
    },
    {
      label: i18n("codegen.status.name"),
      fieldName: "statusName",
      formVisible: false,
    },
    {
      label: i18n("codegen.international.code"),
      fieldName: "local",
      formVisible: false,
    },
  ],
  batchFieldList: [],
});
const primaryKey = "idCodeGenerator";
const codeGeneratorRef = ref();
const rules = {};
const dialogProps = dialogPreps();
provide("dialogProps", dialogProps);
const orderBy = ref<OrderByInfo[]>([
  {
    fieldName: "updatedTime",
    orderBy: "desc",
  },
]);

const selectItemFun = (_data: any) => {
};
const dataFormat = (name: string, cellValue: any): any => {
  if (name == "datasourceConfigId") {
    return (
        dbInfoList.value.find((item: any) => item.value == cellValue)?.name ||
        cellValue
    );
  }
  if (name == "createdTime" || name == "updatedTime") {
    return createDatetime(cellValue);
  }
  return cellValue ?? "--";
};
const init = async () => {
  dbInfoList.value = [];
  dictData("program_file_type").then(res => {
    fileTypeList.value = res;
  });
  dictData("template_version").then(res => {
    templateVersionList.value = res;
  });
  dictData("program_language").then(res => {
    languageList.value = res;
  });
  dictData("ui_type").then(res => {
    uiTypeList.value = res;
  });
  dictData("packaging_type").then(res => {
    packagingList.value = res;
  });
  dictData("REGISTRY_TYPE").then(res => {
    registryTypeList.value = res;
  });
  dictData("CACHE_TYPE").then(res => {
    cacheTypeList.value = res;
  });
  dictData("AUTH_MODULE_TYPE").then(res => {
    moduleNameList.value = res;
  });
  dictData("OS_TYPE").then(res => {
    osTypeList.value = res;
  });
  dictData("DEPLOY_TYPE").then(res => {
    deployTypeList.value = res;
  });
  // appFieldList.fieldList = convertPcCompToAppComps(tableFieldList).fieldList;
};
onMounted(async () => {
  await init();
});
let extendBtns = ref<UserFuncInfo[]>([
  {
    btnName: "重新生成代码",
    authority: "add",
    icon: "code",
    priority: 1,
    funcName: (row: any) => {
      load("代码生成中，请稍后");
      download(
          `/userdb-manage/generator/code/convertToCodeById/${row[primaryKey]}`,
          {},
      )
          .catch((err) => {
            warning(err);
          })
          .finally(() => {
            closeLoad();
          });
    },
  },
]);
const generateFormRef = ref();
const generateMerge = (type: string) => {
  console.log(generateFormRef.value.getFormData()?.value)
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
</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <star-horse-dialog
        :isShowBtnContinue="true"
        :dialogVisible="dialogProps.editVisible"
        :dialogProps="dialogProps"
        :selfFunc="true"
        @merge="generateMerge"
        @closeAction="closeAction"
        boxHeight="85%"
    >
      <star-horse-form
          ref="generateFormRef"
          @refresh="codeGeneratorRef?.loadByPage()"
          :compUrl="dataUrl"
          formSize="default"
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
    <el-tabs v-model="codeGener" type="border-card">
      <el-tab-pane label="代码配置单" name="form">
        <div class="flex flex-col h-full overflow-hidden">
          <div class="flex items-center justify-end">
            <el-button type="primary" @click="generateMerge">
              <star-horse-icon
                  iconClass="export"
                  color="var(--star-horse-white)"
              />
              导出代码
            </el-button>
            <el-button type="warning">
              <star-horse-icon
                  iconClass="publish"
                  color="var(--star-horse-white)"
              />
              发起部署
            </el-button>
          </div>
          <el-divider/>
          <div class="flex-1 overflow-hidden">
            <star-horse-form
                ref="generateFormRef"
                @refresh="codeGeneratorRef?.loadByPage()"
                :compUrl="dataUrl"
                formSize="default"
                :fieldList="tableFieldList"
                :rules="rules"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="操作记录" name="list">
        <div class="flex flex-col h-full overflow-hidden">
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
                :fieldList="tableFieldList"
                :primaryKey="primaryKey"
                :compUrl="dataUrl"
                :orderBy="orderBy"
                :btn-permissions="{
                  edit: 'edit',
                  view: 'view',
                  delete: 'delete',
                  add:'add'
                }"
                :extendBtns="extendBtns"
                :dataFormat="dataFormat"
                @selectItem="selectItemFun"
            />
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>

</style>
