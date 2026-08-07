<script setup lang="ts" name="Areainfo">
import {onMounted, provide, ref} from "vue";
import {PageFieldInfo} from "@/components/types/PageFieldInfo";
import {StarHorseForm, StarHorseTableComp} from "@/components/comp";
import {apiInstance, dialogPreps} from "@/api/star_horse_utils";
import {ApiUrls, SearchInfo} from "@/components/types";

const dataUrl: ApiUrls = apiInstance(
    "userdb-manage",
    "userdb/formInstance/tbValidDatesNew/idValidDateNew/381167130139165693",
);
console.log(dataUrl);

const searchFormData = ref<SearchInfo>({
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
    {
      actions: {},
      defaultValue: "change",
      fieldName: "actionName",
      formVisible: true,
      id: "shfc7df0f6-4e6a-4a95-94a1-26817b730300",
      label: "触发事件",
      listVisible: true,
      preps: {
        allowCreate: true,
        clearable: true,
        collapseTags: true,
        collapseTagsTooltip: true,
        filterable: true,
        placeholder: "请选择触发事件",
        readonly: false,
        remote: false,
        starHorseFieldSource: 1,
        values: [
          {
            name: "值变化",
            value: "change",
          },
          {
            name: "输入时",
            value: "input",
          },
          {
            name: "获得焦点",
            value: "focus",
          },
          {
            name: "失去焦点",
            value: "blur",
          },
          {
            name: "回车确认",
            value: "enter",
          },
        ],
      },
      required: true,
      type: "select",
    },
    {
      fieldName: "apiInfo",
      formVisible: true,
      stepList: [
        {
          fieldList: [
            {
              fieldName: "a",
              tabList: [
                {
                  fieldList: [
                    {
                      actions: {},
                      fieldName: "url",
                      formVisible: true,
                      helpMsg: "完整的API接口地址",
                      id: "sha33ea3fc-8e40-49ff-a53a-9768fcb35c93",
                      label: "接口地址",
                      listVisible: true,
                      preps: {
                        clearable: true,
                        colspan: 24,
                        placeholder: "请输入接口地址",
                        readonly: false,
                        starHorseFieldSource: 1,
                      },
                      required: true,
                    },
                    [
                      {
                        actions: {},
                        defaultValue: "POST",
                        fieldName: "httpMethod",
                        formVisible: true,
                        id: "sh76ef4ce2-1c88-411f-91e0-9cb7ce94732f",
                        label: "请求方式",
                        listVisible: true,
                        preps: {
                          clearable: true,
                          collapseTags: true,
                          collapseTagsTooltip: true,
                          colspan: 12,
                          filterable: true,
                          placeholder: "请选择请求方式",
                          readonly: false,
                          remote: false,
                          starHorseFieldSource: 1,
                          values: [
                            {
                              name: "POST",
                              value: "POST",
                            },
                            {
                              name: "GET",
                              value: "GET",
                            },
                            {
                              name: "HEAD",
                              value: "HEAD",
                            },
                            {
                              name: "PUT",
                              value: "PUT",
                            },
                            {
                              name: "PATCH",
                              value: "PATCH",
                            },
                            {
                              name: "DELETE",
                              value: "DELETE",
                            },
                            {
                              name: "OPTIONS",
                              value: "OPTIONS",
                            },
                            {
                              name: "TRACE",
                              value: "TRACE",
                            },
                          ],
                        },
                        required: true,
                        type: "select",
                      },
                      {
                        actions: {},
                        defaultValue: "JSON",
                        fieldName: "dataType",
                        formVisible: true,
                        id: "sh713b2cf9-7adc-4d93-88ca-d166e5ebfda4",
                        label: "入参格式",
                        listVisible: true,
                        preps: {
                          clearable: true,
                          collapseTags: true,
                          collapseTagsTooltip: true,
                          colspan: 12,
                          filterable: true,
                          placeholder: "请选择入参格式",
                          readonly: false,
                          remote: false,
                          starHorseFieldSource: 1,
                          values: [
                            {
                              name: "FORM",
                              value: "FORM",
                            },
                            {
                              name: "JSON",
                              value: "JSON",
                            },
                            {
                              name: "BINARY",
                              value: "BINARY",
                            },
                          ],
                        },
                        required: true,
                        type: "select",
                      },
                    ],
                  ],
                  objectName: "a",
                  tabName: "a",
                  title: "接口信息",
                },
                {
                  fieldList: [
                    {
                      batchFieldList: [
                        {
                          batchName: "headers",
                          fieldList: [
                            {
                              fieldName: "name",
                              formVisible: true,
                              label: "头部名称",
                              listVisible: true,
                              preps: {
                                colspan: 8,
                              },
                              required: true,
                            },
                            {
                              fieldName: "value",
                              formVisible: true,
                              label: "头部值",
                              listVisible: true,
                              preps: {
                                colspan: 10,
                              },
                            },
                            {
                              defaultValue: "static",
                              fieldName: "valueType",
                              formVisible: true,
                              label: "值类型",
                              listVisible: true,
                              preps: {
                                colspan: 6,
                                values: [
                                  {
                                    name: "固定值",
                                    value: "static",
                                  },
                                  {
                                    name: "动态值",
                                    value: "dynamic",
                                  },
                                ],
                              },
                              type: "select",
                            },
                          ],
                          helpMsg:
                              "配置自定义请求头，支持静态值和动态值（从表单数据获取）",
                          initRows: 0,
                          title: "请求头",
                        },
                      ],
                    },
                    {
                      batchFieldList: [
                        {
                          batchName: "requestParams",
                          fieldList: [
                            {
                              fieldName: "paramName",
                              formVisible: true,
                              label: "参数名",
                              listVisible: true,
                              preps: {
                                colspan: 8,
                              },
                              required: true,
                            },
                            {
                              fieldName: "paramValue",
                              formVisible: true,
                              label: "参数值",
                              listVisible: true,
                              preps: {
                                colspan: 10,
                              },
                            },
                            {
                              defaultValue: "static",
                              fieldName: "valueType",
                              formVisible: true,
                              label: "值类型",
                              listVisible: true,
                              preps: {
                                colspan: 6,
                                values: [
                                  {
                                    name: "固定值",
                                    value: "static",
                                  },
                                  {
                                    name: "动态值",
                                    value: "dynamic",
                                  },
                                ],
                              },
                              type: "select",
                            },
                          ],
                          helpMsg:
                              "配置接口请求参数，动态值将从表单当前数据中获取",
                          initRows: 0,
                          title: "请求参数",
                        },
                      ],
                    },
                  ],
                  objectName: "b",
                  tabName: "b",
                  title: "入参配置",
                },
                {
                  fieldList: [
                    {
                      actions: {},
                      defaultValue: "result_data_list",
                      fieldName: "responseTemplate",
                      formVisible: true,
                      helpMsg:
                          "选择接口返回的数据结构模板，用于正确解析响应数据",
                      id: "shfa903305-624e-4f42-aba7-e243c909ed89",
                      label: "响应模板",
                      listVisible: true,
                      preps: {
                        clearable: true,
                        collapseTags: true,
                        collapseTagsTooltip: true,
                        colspan: 24,
                        filterable: true,
                        placeholder: "请选择响应模板",
                        readonly: false,
                        remote: false,
                        starHorseFieldSource: 1,
                        values: [
                          {
                            name: "{code, message, data:对象}",
                            value: "result_data",
                          },
                          {
                            name: "{code, message, data:列表}",
                            value: "result_data_list",
                          },
                          {
                            name: "{code, message, data:键值对}",
                            value: "result_data_map",
                          },
                          {
                            name: "键值对 {key:value}",
                            value: "map",
                          },
                          {
                            name: "列表 [{key:value}]",
                            value: "list",
                          },
                        ],
                      },
                      required: true,
                      type: "select",
                    },
                    [
                      {
                        actions: {},
                        fieldName: "successCode",
                        formVisible: true,
                        helpMsg:
                            "接口返回成功的状态码值，如：200、0、success等",
                        id: "shbd3b9f0c-d735-43e8-b9ea-179ae2ac109b",
                        label: "成功状态码",
                        listVisible: true,
                        preps: {
                          clearable: true,
                          colspan: 8,
                          placeholder: "请输入成功状态码",
                          readonly: false,
                          starHorseFieldSource: 1,
                        },
                      },
                      {
                        actions: {},
                        defaultValue: "code",
                        fieldName: "codePath",
                        formVisible: true,
                        helpMsg: "响应JSON中状态码字段的路径，如：code",
                        id: "sh456622e7-979b-4f81-acd4-f39d8d81a7ff",
                        label: "状态码路径",
                        listVisible: true,
                        preps: {
                          clearable: true,
                          colspan: 8,
                          placeholder: "请输入状态码路径",
                          readonly: false,
                          starHorseFieldSource: 1,
                        },
                      },
                      {
                        actions: {},
                        defaultValue: "data",
                        fieldName: "dataPath",
                        formVisible: true,
                        helpMsg: "响应JSON中业务数据的路径，如：data",
                        id: "sh310bb4c4-9f2d-4959-8a91-05c88b3d6f37",
                        label: "数据路径",
                        listVisible: true,
                        preps: {
                          clearable: true,
                          colspan: 8,
                          placeholder: "请输入数据路径",
                          readonly: false,
                          starHorseFieldSource: 1,
                        },
                      },
                    ],
                  ],
                  objectName: "c",
                  tabName: "c",
                  title: "出参配置",
                },
              ],
            },
          ],
          objectName: "apiInfo",
          subFormFlag: "Y",
          tabName: "apiInfo",
          title: "接口配置",
        },
        {
          fieldList: [
            {
              batchFieldList: [
                {
                  batchName: "fieldMappings",
                  fieldList: [
                    {
                      fieldName: "sourceField",
                      formVisible: true,
                      helpMsg: "接口返回数据中的字段名",
                      label: "接口字段",
                      listVisible: true,
                      preps: {
                        colspan: 6,
                      },
                      required: true,
                    },
                    {
                      fieldName: "distField",
                      formVisible: true,
                      helpMsg: "映射到表单中的目标字段",
                      label: "表单字段",
                      listVisible: true,
                      preps: {
                        allowCreate: true,
                        colspan: 6,
                        filterable: true,
                        values: [
                          {
                            label: "选择器 (field_shb76f)",
                            name: "选择器 (field_shb76f)",
                            value: "field_shb76f",
                          },
                          {
                            label: "单行文本框 (field_shef60)",
                            name: "单行文本框 (field_shef60)",
                            value: "field_shef60",
                          },
                          {
                            label: "单行文本框 (field_sh7211)",
                            name: "单行文本框 (field_sh7211)",
                            value: "field_sh7211",
                          },
                        ],
                      },
                      required: true,
                      type: "select",
                    },
                    {
                      fieldName: "typeConvert",
                      formVisible: true,
                      helpMsg: "可选，将接口字段值转换为指定类型",
                      label: "类型转换",
                      listVisible: true,
                      preps: {
                        allowCreate: true,
                        colspan: 6,
                        values: [
                          {
                            name: "字符串",
                            value: "string",
                          },
                          {
                            name: "数字",
                            value: "number",
                          },
                          {
                            name: "布尔",
                            value: "boolean",
                          },
                          {
                            name: "数组",
                            value: "array",
                          },
                        ],
                      },
                      type: "select",
                    },
                    {
                      fieldName: "transform",
                      formVisible: true,
                      helpMsg: "可选，如：dateFormat:yyyy-MM-dd",
                      label: "转换表达式",
                      listVisible: true,
                      preps: {
                        colspan: 6,
                      },
                    },
                  ],
                  initRows: 0,
                  title: "字段映射",
                },
              ],
            },
          ],
          objectName: "response",
          tabName: "response",
          title: "响应与映射",
        },
        {
          fieldList: [
            {
              fieldName: "a",
              tabList: [
                {
                  fieldList: [
                    {
                      actions: {},
                      fieldName: "url",
                      formVisible: true,
                      helpMsg: "完整的API接口地址",
                      id: "shf847fac1-9cb9-43df-b44b-80dbec71d2d9",
                      label: "接口地址",
                      listVisible: true,
                      preps: {
                        clearable: true,
                        colspan: 24,
                        placeholder: "请输入接口地址",
                        readonly: false,
                        starHorseFieldSource: 1,
                      },
                      required: true,
                    },
                    [
                      {
                        actions: {},
                        defaultValue: "POST",
                        fieldName: "httpMethod",
                        formVisible: true,
                        id: "shd0569a7e-f4c4-4440-adb3-7dc9c00911c0",
                        label: "请求方式",
                        listVisible: true,
                        preps: {
                          clearable: true,
                          collapseTags: true,
                          collapseTagsTooltip: true,
                          colspan: 12,
                          filterable: true,
                          placeholder: "请选择请求方式",
                          readonly: false,
                          remote: false,
                          starHorseFieldSource: 1,
                          values: [
                            {
                              name: "POST",
                              value: "POST",
                            },
                            {
                              name: "GET",
                              value: "GET",
                            },
                            {
                              name: "HEAD",
                              value: "HEAD",
                            },
                            {
                              name: "PUT",
                              value: "PUT",
                            },
                            {
                              name: "PATCH",
                              value: "PATCH",
                            },
                            {
                              name: "DELETE",
                              value: "DELETE",
                            },
                            {
                              name: "OPTIONS",
                              value: "OPTIONS",
                            },
                            {
                              name: "TRACE",
                              value: "TRACE",
                            },
                          ],
                        },
                        required: true,
                        type: "select",
                      },
                      {
                        actions: {},
                        defaultValue: "JSON",
                        fieldName: "dataType",
                        formVisible: true,
                        id: "shfd59cebe-e46d-4e98-9c64-15e16fc747d2",
                        label: "入参格式",
                        listVisible: true,
                        preps: {
                          clearable: true,
                          collapseTags: true,
                          collapseTagsTooltip: true,
                          colspan: 12,
                          filterable: true,
                          placeholder: "请选择入参格式",
                          readonly: false,
                          remote: false,
                          starHorseFieldSource: 1,
                          values: [
                            {
                              name: "FORM",
                              value: "FORM",
                            },
                            {
                              name: "JSON",
                              value: "JSON",
                            },
                            {
                              name: "BINARY",
                              value: "BINARY",
                            },
                          ],
                        },
                        required: true,
                        type: "select",
                      },
                    ],
                  ],
                  objectName: "a",
                  tabName: "a",
                  title: "接口信息",
                },
                {
                  fieldList: [
                    {
                      batchFieldList: [
                        {
                          batchName: "headers",
                          fieldList: [
                            {
                              fieldName: "name",
                              formVisible: true,
                              label: "头部名称",
                              listVisible: true,
                              preps: {
                                colspan: 8,
                              },
                              required: true,
                            },
                            {
                              fieldName: "value",
                              formVisible: true,
                              label: "头部值",
                              listVisible: true,
                              preps: {
                                colspan: 10,
                              },
                            },
                            {
                              defaultValue: "static",
                              fieldName: "valueType",
                              formVisible: true,
                              label: "值类型",
                              listVisible: true,
                              preps: {
                                colspan: 6,
                                values: [
                                  {
                                    name: "固定值",
                                    value: "static",
                                  },
                                  {
                                    name: "动态值",
                                    value: "dynamic",
                                  },
                                ],
                              },
                              type: "select",
                            },
                          ],
                          helpMsg:
                              "配置自定义请求头，支持静态值和动态值（从表单数据获取）",
                          initRows: 0,
                          title: "请求头",
                        },
                      ],
                    },
                    {
                      batchFieldList: [
                        {
                          batchName: "requestParams",
                          fieldList: [
                            {
                              fieldName: "paramName",
                              formVisible: true,
                              label: "参数名",
                              listVisible: true,
                              preps: {
                                colspan: 8,
                              },
                              required: true,
                            },
                            {
                              fieldName: "paramValue",
                              formVisible: true,
                              label: "参数值",
                              listVisible: true,
                              preps: {
                                colspan: 10,
                              },
                            },
                            {
                              defaultValue: "static",
                              fieldName: "valueType",
                              formVisible: true,
                              label: "值类型",
                              listVisible: true,
                              preps: {
                                colspan: 6,
                                values: [
                                  {
                                    name: "固定值",
                                    value: "static",
                                  },
                                  {
                                    name: "动态值",
                                    value: "dynamic",
                                  },
                                ],
                              },
                              type: "select",
                            },
                          ],
                          helpMsg:
                              "配置接口请求参数，动态值将从表单当前数据中获取",
                          initRows: 0,
                          title: "请求参数",
                        },
                      ],
                    },
                  ],
                  objectName: "b",
                  tabName: "b",
                  title: "入参配置",
                },
                {
                  fieldList: [
                    {
                      actions: {},
                      defaultValue: "result_data_list",
                      fieldName: "responseTemplate",
                      formVisible: true,
                      helpMsg:
                          "选择接口返回的数据结构模板，用于正确解析响应数据",
                      id: "sh39e3b966-ffc6-4f43-afdb-e9c1247c0ce9",
                      label: "响应模板",
                      listVisible: true,
                      preps: {
                        clearable: true,
                        collapseTags: true,
                        collapseTagsTooltip: true,
                        colspan: 24,
                        filterable: true,
                        placeholder: "请选择响应模板",
                        readonly: false,
                        remote: false,
                        starHorseFieldSource: 1,
                        values: [
                          {
                            name: "{code, message, data:对象}",
                            value: "result_data",
                          },
                          {
                            name: "{code, message, data:列表}",
                            value: "result_data_list",
                          },
                          {
                            name: "{code, message, data:键值对}",
                            value: "result_data_map",
                          },
                          {
                            name: "键值对 {key:value}",
                            value: "map",
                          },
                          {
                            name: "列表 [{key:value}]",
                            value: "list",
                          },
                        ],
                      },
                      required: true,
                      type: "select",
                    },
                    [
                      {
                        actions: {},
                        fieldName: "successCode",
                        formVisible: true,
                        helpMsg:
                            "接口返回成功的状态码值，如：200、0、success等",
                        id: "sh4bddcfa3-ee91-4124-8c6f-ce1d44088c15",
                        label: "成功状态码",
                        listVisible: true,
                        preps: {
                          clearable: true,
                          colspan: 8,
                          placeholder: "请输入成功状态码",
                          readonly: false,
                          starHorseFieldSource: 1,
                        },
                      },
                      {
                        actions: {},
                        defaultValue: "code",
                        fieldName: "codePath",
                        formVisible: true,
                        helpMsg: "响应JSON中状态码字段的路径，如：code",
                        id: "sh13c7feef-4d0c-45bd-a0ea-da7707cecadb",
                        label: "状态码路径",
                        listVisible: true,
                        preps: {
                          clearable: true,
                          colspan: 8,
                          placeholder: "请输入状态码路径",
                          readonly: false,
                          starHorseFieldSource: 1,
                        },
                      },
                      {
                        actions: {},
                        defaultValue: "data",
                        fieldName: "dataPath",
                        formVisible: true,
                        helpMsg: "响应JSON中业务数据的路径，如：data",
                        id: "sh5781b3c3-79a3-4724-886e-041f36e1192c",
                        label: "数据路径",
                        listVisible: true,
                        preps: {
                          clearable: true,
                          colspan: 8,
                          placeholder: "请输入数据路径",
                          readonly: false,
                          starHorseFieldSource: 1,
                        },
                      },
                    ],
                  ],
                  objectName: "c",
                  tabName: "c",
                  title: "出参配置",
                },
              ],
            },
          ],
          objectName: "authInfo",
          subFormFlag: "Y",
          tabName: "authInfo",
          title: "认证配置",
        },
      ],
    },
  ],
});
const initData = async () => {
};
const primaryKey = "idValidDateNew";
const codeGeneratorRef = ref();
const rules = {};
const dialogProps = dialogPreps();
provide("dialogProps", dialogProps);
const generateFormRef = ref();

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
        :dialogProps="dialogProps"
        :source="3"
    >
      <star-horse-data-view
          :preview="true"
          :field-list="fieldList"
          :compUrl="dataUrl"
      />
    </star-horse-dialog>
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
          :fieldList="fieldList"
          :primaryKey="primaryKey"
          :compUrl="dataUrl"
          :preview="true"
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
