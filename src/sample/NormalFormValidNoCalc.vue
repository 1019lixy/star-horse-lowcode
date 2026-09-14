<script setup lang="ts" name="Areainfo">
import {nextTick, onMounted, provide, reactive, ref} from "vue";
import {PageFieldInfo} from "@/components/types/PageFieldInfo";
import {StarHorseForm, StarHorseTableComp} from "@/components/comp";
import {apiInstance, closeLoad, commonField, dialogPreps, httpMethod, load,} from "@/api/star_horse_utils";
import {download} from "@/api/star_horse_apis";
import {warning} from "@/utils/message";
import {ApiUrls, SearchFields} from "@/components/types";
import {isMobile} from "@/api/device";
import StarHorseDrawer from "@/components/comp/StarHorseDrawer.vue";
import {StarHorseEditor} from "@/components/system";
import {i18n} from "@/lang";

const apiEndpoints: ApiUrls = apiInstance(
    "userdb-manage",
    "userdb/formInstance/tbValidDatesNew/idValidDateNew/381167130139165693",
);
console.log(apiEndpoints);
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

// ==================== 表单属性字段定义（按业务分组提取） ====================
/**
 * 通用基础属性字段（与业务解耦，仅保留表单自身通用属性）。
 * 菜单/权限/建表策略等强业务字段已从 lib 中移除，
 * 接入方通过 FormConfig.formBasicProps 注入自定义字段（见 basicPropsFields）。
 */
const genericBasicPropsFields = [
  {
    label: i18n("dyform.formProp.tableName"),
    fieldName: "tbName",
    required: true,
    formVisible: true,
    preps: {editDisabled: true, colspan:  12},
  },
  {
    label: i18n("dyform.formProp.primaryKey"),
    fieldName: "formId",
    required: true,
    formVisible: true,
    preps: {editDisabled: true, colspan: 12},
  },
  {
    label: i18n("dyform.formProp.formIcon"),
    fieldName: "formIcon",
    type: "icon",
    defaultValue: "document",
    formVisible: true,
    preps: {colspan:  12, iconType: "user", values: []},
  },
  {
    label: "数据选择",
    fieldName: "datapicker",
    type: "datapicker",
    formVisible: true,
    preps: {
      "id": "Idsh4b409811-93c9-4a00-a08a-1a97c665fcef",
      "label": "数据选择器",
      "itemNameLabel": "数据选择器",
      "name": "fieldSh4B40",
      "clearable": true,
      "readonly": false,
      "rules": [],
      "maxLength": 255,
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true,
      "formula": {
        "enable": false,
        "type": "calc",
        "sourceFields": [],
        "expression": ""
      },
      "filterable": true,
      "collapseTags": true,
      "displayMode": "label",
      "enableHierarchy": true,
      "apiDataSource": {
        proxy:true,
        "proxyUrl": "/system-config/redirect/apiLinkage",
        "conditionFields": [
          "fieldSh4B40"
        ],
        "apiInfo": {
          "apiType": "thirdApi",
          "httpMethod": "POST",
          "protocol": "http",
          "redirect": true,
          "url": "http://localhost:8749/system-config/system/contact/list",
          "dataType": "JSON",
          "headers": [],
          "requestParams": [
            {
              "matchType": "eq",
              "valueType": "static",
              "paramName": "platform",
              "paramValue": "WECOM",
              "xh": 1
            },
            {
              "matchType": "eq",
              "valueType": "static",
              "paramName": "appId",
              "paramValue": "ww9f8004e2bac1f2f5",
              "xh": 2
            },
            {
              "matchType": "eq",
              "valueType": "static",
              "paramName": "appSecret",
              "paramValue": "GifTP8o7umxPEHV0_goIn33L62GjuUIlPi_MGSkJXSY",
              "xh": 3
            },
            {
              "matchType": "eq",
              "valueType": "static",
              "paramName": "agentId",
              "paramValue": "1000020",
              "xh": 4
            },
            {
              "matchType": "eq",
              "valueType": "static",
              "paramName": "refresh",
              "paramValue": "true",
              "xh": 5
            }
          ],
          "responseTemplate": "result_data_list",
          "codePath": "code",
          "dataPath": "data.roots",
          "successCode": "200"
        },
        "redirect": true,
        "httpMethod": "GET",
        "protocol": "http",
        "dataType": "JSON",
        "responseTemplate": "result_data_list",
        "codePath": "code",
        "dataPath": "data",
        "optionField": {
          "labelField": "name",
          "valueField": "value",
          "onlyParseConfigured": true,
          "hasChildren": true,
          "childrenField": "children"
        },
        "authInfo": {
          "apiType": "systemApi",
          "httpMethod": "GET",
          "protocol": "http"
        },
        "isolationConfig": {
          "isolationDetails": []
        }
      }
    }
  }
];
/**
 * 基础配置字段 = lib 通用字段 + 外部注入字段（FormConfig.formBasicProps）。
 * 外部字段需自包含（options 数据、actions 均由外部提供），
 * 支持 label/fieldName/type/defaultValue/required/formVisible/preps/actions 等标准结构。
 */
const basicPropsFields = [
  ...genericBasicPropsFields,
];
/** 表单样式字段 */
const otherPropsFields = [
  {
    label: i18n("dyform.formProp.labelPosition2"),
    fieldName: "labelPosition",
    defaultValue: "left",
    type:"input",
    formVisible: true,
    preps: {values: []}
  },
  {
    label: i18n("dyform.formProp.labelWidth"),
    fieldName: "labelWidth",
    helpMsg: i18n("dyform.formProp.labelWidth.helpMsg"),
    formVisible: true
  },
  {label: i18n("dyform.formProp.validRuleName"), fieldName: "rules", defaultValue: "rules", formVisible: true},
  {
    label: i18n("dyform.formProp.formStyle"),
    fieldName: "size",
    type:"input",
    formVisible: true,
    preps: {values: []}
  },
  {label: i18n("dyform.formProp.labelSuffix"), fieldName: "labelSuffix", formVisible: true},
  {
    label: i18n("dyform.formProp.disableAll"),
    fieldName: "disabled",
    defaultValue: false,
    type: "switch",
    formVisible: true
  },
  {
    label: i18n("dyform.formProp.hideRequiredAsterisk"),
    fieldName: "hideRequiredAsterisk",
    defaultValue: false,
    type: "switch",
    formVisible: true
  },
  {
    label: i18n("dyform.formProp.scrollToError"),
    fieldName: "scrollToError",
    defaultValue: true,
    type: "switch",
    formVisible: true
  },
  {
    label: i18n("dyform.formProp.asteriskPosition"),
    fieldName: "requireAsteriskPosition",
    defaultValue: "right",
    type: "radio",
    formVisible: true,
    preps: {values: []}
  },
  {
    label: i18n("dyform.formProp.showValidateIcon"),
    fieldName: "statusIcon",
    defaultValue: false,
    type: "switch",
    formVisible: true
  },
  {
    label: i18n("dyform.formProp.showErrorMessage"),
    fieldName: "showMessage",
    defaultValue: true,
    type: "switch",
    formVisible: true
  },
  {
    label: i18n("dyform.formProp.inlineMessage"),
    fieldName: "inlineMessage",
    defaultValue: true,
    type: "switch",
    formVisible: true
  },
  {
    label: i18n("dyform.formProp.validateOnRuleChange"),
    fieldName: "validateOnRuleChange",
    defaultValue: false,
    type: "switch",
    formVisible: true
  },
  {
    label: i18n("dyform.formProp.inlineForm"),
    fieldName: "inline",
    defaultValue: true,
    type: "switch",
    formVisible: true
  },
];
/** 关系配置表格 */
const relationConfigTable = {
  containerType: "table",
  containerFields: [
    {
      subTableName: "relations",
      initRows: 0,
      fieldList: [
        {
          label: i18n("dyform.formProp.relationTable"),
          fieldName: "tableId",
          type:"input",
          required: true,
          formVisible: true,
          preps: {values: []}
        },
        {
          label: i18n("dyform.formProp.relationType"),
          fieldName: "relationType",
          type:"input",
          defaultValue: "1n",
          required: true,
          formVisible: true,
          preps: {values: []}
        },
      ],
    },
  ],
};
/** 公共属性字段 */
const publicPropsFields = [
  [
    {
      label: i18n("dyform.formProp.needPublicFields"),
      fieldName: "needCommonFields",
      type: "switch",
      defaultValue: "Y",
      formVisible: true,
      actions: {
        change: (val: any) => {

        },
      },
      preps: {activeValue: "Y", inactiveValue: "N"},
    },
    {
      label: i18n("dyform.formProp.statusDict"),
      helpMsg: i18n("dyform.formProp.statusDict.helpMsg"),
      fieldName: "statusDictName",
      defaultValue: "common",
      formVisible: true
    },
  ],
  {
    containerType: "table",
    containerFields: [
      {
        subTableName: "commonFieldControllers",
        subTablePrimaryKey: "commonFieldControllers",
        initRows: 0,
        subFormFlag: "Y",
        fieldList: [
          {
            label: i18n("dyform.formProp.fieldInfo"),
            fieldName: "fieldName",
            type:"input",
            required: true,
            formVisible: true,
            preps: {values: commonField(), props: {label: "label", value: "fieldName"}}
          },
          {
            label: i18n("dyform.formProp.searchDisplay"),
            fieldName: "searchVisible",
            type: "switch",
            defaultValue: false,
            formVisible: true
          },
          {
            label: i18n("dyform.formProp.formDisplay"),
            fieldName: "formVisible",
            type: "switch",
            defaultValue: false,
            formVisible: true
          },
          {
            label: i18n("dyform.formProp.listDisplay"),
            fieldName: "listVisible",
            type: "switch",
            defaultValue: true,
            formVisible: true
          },
        ],
      },
    ],
  },
];
/** 列表字段映射表格 */
const listConfigTable = {
  containerType: "table",
  containerFields: [
    {
      subTableName: "fieldMappingList",
      subTablePrimaryKey: "fieldMappingList",
      subFormFlag: "Y",
      initRows: 0,
      fieldList: [
        {
          label: i18n("dyform.formProp.fieldInfo"),
          fieldName: "fieldName",
          type:"input",
          formVisible: true,
          required: true,
          preps: {values: []}
        },
        {
          label: i18n("dyform.formProp.mappingTable"),
          fieldName: "mappingTable",
          type:"input",
          formVisible: true,
          required: true,
          preps: {values: [], props: {label: "formName", value: "tbName"}},
          actions: {
            change: (val: any) => {
            }
          }
        },
        {
          label: i18n("dyform.formProp.relationField2"),
          fieldName: "mappingField",
          type:"input",
          required: true,
          formVisible: true,
          preps: {values: []}
        },
        {
          label: i18n("dyform.formProp.displayField"),
          fieldName: "mappingDisplayField",
          type:"input",
          required: true,
          formVisible: true,
          preps: {values: []}
        },
        {
          label: i18n("dyform.formProp.displayAlias"),
          fieldName: "displayAliasField",
          helpMsg: i18n("dyform.formProp.displayAlias.helpMsg"),
          formVisible: true,
          rules: [{
            pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
            message: i18n("dyform.formProp.displayAlias.validate"),
            trigger: "blur"
          }]
        },
      ],
    },
  ],
};
/** 列表自定义事件表格 */
const listCustomEventTable = {
  containerType: "table",
  containerFields: [
    {
      subTableName: "listActions",
      subTablePrimaryKey: "listActions",
      subFormFlag: "Y",
      staticData: "Y",
      initRows: 0,
      fieldList: [
        [
          {label: i18n("dyform.formProp.eventName"), fieldName: "eventName", formVisible: true, required: true},
          {
            label: i18n("dyform.formProp.eventIcon"),
            fieldName: "icon",
            type: "icon",
            formVisible: true,
            required: true,
            preps: {iconType: "user", values: []}
          },
        ],
        [
          {

            label: i18n("dyform.formProp.eventCategory"),
            fieldName: "eventType",
            type:"input",
            required: true,
            formVisible: true,
            actions: {
              change: (val: any) => {
              }
            },
            preps: {
              dataRelation: {
                actionName: "change",
                relationDetails: [{
                  matchType: "eq",
                  controlCondition: "eqVisible",
                  relationFields: ["httpMethod"],
                  matchFieldValue: "interface"
                }]
              },
              values: [],
            },
          },
        ],
        [
          {
            label: i18n("dyform.formProp.requestUrl"),
            fieldName: "content",
            helpMsg: i18n("dyform.formProp.requestUrl.helpMsg"),
            required: true,
            formVisible: true,
            preps: {colspan: 18}
          },
          {
            label: i18n("dyform.formProp.requestMethod"),
            fieldName: "httpMethod",
            defaultValue: "POST",
            type:"input",
            formVisible: false,
            preps: {values: httpMethod(), colspan: 5}
          },
        ],
        {label: i18n("dyform.formProp.params"), fieldName: "parameters", type: "json", formVisible: true},
      ],
    },
  ],
};
/** 列表排序字段表格 */
const listSortFieldTable = {
  containerType: "table",
  containerFields: [
    {
      subTableName: "orderBy",
      subTablePrimaryKey: "orderBy",
      subFormFlag: "Y",
      initRows: 0,
      fieldList: [
        {
          label: i18n("dyform.formProp.sortField"),
          fieldName: "fieldName",
          type:"input",
          required: true,
          formVisible: true,
          preps: {values: []}
        },
        {
          label: i18n("dyform.formProp.sortOrder"),
          fieldName: "orderBy",
          type:"input",
          formVisible: true,
          preps: {values: []}
        },
        {
          label: i18n("dyform.formProp.priority"),
          fieldName: "priority",
          type: "number",
          defaultValue: 1,
          formVisible: true
        },
      ],
    },
  ],
};
/**
 * 流程绑定字段（表单级绑定）。
 *
 * 两种绑定方式：
 * - reuse：从后台流程定义列表中选择已有流程（flowDefineId）；
 * - design：打开可视化流程设计器在线设计，节点树保存到 flowConfigures.process。
 *
 * 绑定结果统一写入 formInfo.flowConfigures = { mode, flowDefineId?, process? }，
 * flowConfigures 随表单一并提交后台。
 */
const bindModeField = {
  label: i18n("dyform.step.flowBindMode"),
  fieldName: "flowBindMode",
  type: "radio",
  defaultValue: "reuse",
  helpMsg: i18n("dyform.step.flowBindMode.helpMsg"),
  formVisible: false,
  actions: {
    change: (val: any) => {
      // StarHorseForm 的 outerFormData 是单向拷贝，字段值需同步回 formInfo，
      // 否则面板底部的流程在线设计入口（v-show 依赖 formInfo.flowBindMode）无法联动显示

    },
  },
  preps: {
    values: [
      {name: i18n("dyform.step.flowBindMode.reuse"), value: "reuse"},
      {name: i18n("dyform.step.flowBindMode.design"), value: "design"},
    ],
    dataRelation: {
      actionName: "change",
      relationDetails: [
        {matchType: "eq", controlCondition: "eqVisible", relationFields: ["flowDefineId"], matchFieldValue: "reuse"},
        {
          matchType: "eq",
          controlCondition: "eqExecution",
          relationFields: ["abc"],
          func: (val) => {
           console.log(val);
          },
          matchFieldValue: "design"
        },
      ],
    },
  },
};
const flowDefineIdField = {
  label: i18n("dyform.step.formFlowDefine"),
  fieldName: "flowDefineIdList",
  type:"input",
  formVisible: false,

  preps: {values: [], multiple: true},
};

const flowBindingFields = [
  {
    label: i18n("dyform.step.flowFlag"),
    fieldName: "flowFlag",
    type: "switch",
    defaultValue: "N",
    formVisible: true,

    preps: {
      activeValue: "Y", inactiveValue: "N",
      dataRelation: {
        actionName: "change",
        relationDetails: [
          {
            matchType: "eq",
            controlCondition: "eqVisible",
            relationFields: ["flowBindMode", "flowDefineId", "starterField"],
            matchFieldValue: "Y"
          },
        ],
      },
    },
  },
  bindModeField,
  flowDefineIdField,

  //starterFieldField,
];

const fieldList = reactive<PageFieldInfo | any>({
  fieldList: [
    [
      {
        label: i18n("dyform.formProp.formName"),
        fieldName: "formName",
        required: true,
        formVisible: true,
      },
      {
        label: i18n("dyform.formProp.dataSource"),
        fieldName: "datasourceConfigId",
        helpMsg: "",
        type:"input",

        required: true,
        formVisible: true,
        preps: {
          values: [],
        },
      },
    ],
    {
      fieldName: "tab1",
      containerType: "tab",
      preps: {
        mustCompleteTab: false
      },
      containerFields: [
        {
          title: i18n("dyform.formProp.tabBasic"),
          subTablePrimaryKey: "tab1",
          fieldList: [
            {
              containerType: "fieldset",
              containerFields: [
                {
                  title: i18n("dyform.formProp.basicProps"), fieldList: [{
                    preps: {
                      border: true,
                      column: 3,
                    },
                    containerType: "descriptions", containerFields: [{
                      fieldList: basicPropsFields,
                    }]
                  }], preps: {collapsible: true, innerCollapsed: false}
                },
                {
                  title: i18n("dyform.formProp.otherProps"),
                  fieldList: [{
                    preps: {
                      border: true,
                      column: 3,
                    },
                    containerType: "descriptions",
                    containerFields: [{
                      fieldList: otherPropsFields,
                    }]
                  }],
                  formVisible: true,
                  preps: {collapsible: true, innerCollapsed: true}
                },
              ],
            },
          ],
        },
        {
          title: i18n("dyform.formProp.tabData"),
          subTablePrimaryKey: "tab2",
          fieldList: [
            {
              containerType: "fieldset",
              containerFields: [
                {
                  title: i18n("dyform.formProp.publicProps"),
                  helpMsg: "",
                  fieldList: publicPropsFields,
                  formVisible: true,
                  preps: {collapsible: true, innerCollapsed: false}
                },
                {
                  title: i18n("dyform.formProp.listSortField"),
                  fieldList: [listSortFieldTable],
                  formVisible: true,
                  preps: {collapsible: true, innerCollapsed: false}
                },
              ],
            },
          ],
        },
        {
          title: i18n("dyform.step.formFlowBind"),
          subTablePrimaryKey: "tab3",
          fieldList: flowBindingFields,
        },
        {
          title: i18n("dyform.formProp.tabList"),
          subTablePrimaryKey: "tab4",
          fieldList: [
            {
              containerType: "fieldset",
              containerFields: [
                {
                  title: i18n("dyform.formProp.relationConfig"),
                  fieldList: [relationConfigTable],
                  formVisible: true,
                  preps: {collapsible: true, innerCollapsed: false}
                },
                {
                  title: i18n("dyform.formProp.listConfig"),
                  fieldList: [listConfigTable],
                  formVisible: true,
                  preps: {collapsible: true, innerCollapsed: false}
                },
                {
                  title: i18n("dyform.formProp.listCustomEvent"),
                  fieldList: [listCustomEventTable],
                  formVisible: true,
                  preps: {collapsible: true, innerCollapsed: false}
                },

              ],
            },
          ],
        },

      ],
    },
  ],
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
      <el-button @click="dialogProps.viewVisible = true">Click</el-button>
      <star-horse-form
          ref="generateFormRef"
          @refresh="
          (formData, result) => codeGeneratorRef?.assignStaticData(formData)
        "
          :apiEndpoints="apiEndpoints"
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
          :apiEndpoints="apiEndpoints"
      />
    </star-horse-dialog>
    <div class="search-content" v-if="!isMobile">
      <div class="search_btn">
        <star-horse-search-comp
            @searchData="
            (data: any) => codeGeneratorRef?.createSearchParams(data)
          "
            :formData="searchFormData"
            :apiEndpoints="apiEndpoints"
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
          :apiEndpoints="apiEndpoints"
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
