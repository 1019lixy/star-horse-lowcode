/**
 * 公共 API 接口配置组件 —— star-horse-form schema 生成器
 *
 * 严格照搬 dynamicform/ApiSharedConfig.ts createApiConfig 结构：
 * 顶层 proxy 开关 + proxyUrl + conditionFields + pageSize + responseMode
 * + apiInfo（border-card tab 容器，containerFields=[请求 tab, 响应 tab, 认证 tab, 隔离 tab]）
 * 请求 tab 内含 apiType radio + 一个 tab 容器（apiInfo / inputConfig / outputConfig 三段）
 * 认证 tab 直接复用请求 tab 结构（同参考）
 * 响应 tab 依 mode 分：dataSource → labelField/valueField/hasChildren/childrenField/onlyParseConfigured
 *                     linkage → fieldMappings 子表
 * 隔离 tab = isolationType + isolationDetails 子表
 *
 * 与参考的差异只在 i18n 命名空间（改为 shplugin 自有的 apiConfig.*）
 * 和依赖注入（appEndpoints 通过 options 传入）。
 */
import { i18n } from "@/lang";
import type { SelectOption } from "@/components/types/SearchProps";
import {
  apiTypeList,
  dataType,
  httpMethod,
  isolationTypeList,
  responseModeList,
  responseTemplateList,
  searchMatchList,
  typeConvertList,
  valueTypeList,
} from "./options";
import type {
  ApiConfigInterfaceUtils,
  ApiConfigMode,
  ApiConfigSchemaOptions,
} from "./types";

const API_VALID_DEFAULT = "/userdb-manage/redirect/apiValid";
const PROXY_URL_DEFAULT = "/userdb-manage/redirect/api";

/** 请求 tab（apiType + 三个 section 的内嵌 tab）—— 参考 createRequestTab */
function createRequestTab(
  title: string,
  subTableName: string,
  defaultMethod: string,
  dataRequired: boolean,
  interfaceUtils: ApiConfigInterfaceUtils | undefined,
  formFields: SelectOption[],
  serviceListUrl?: string,
) {
  const utils = interfaceUtils ?? {};
  const methodList = utils.methodList ?? [];
  const interfaceList = utils.interfaceList ?? [];
  const loadInterface = utils.loadInterface ?? (() => {});
  const loadMethods = utils.loadMethods ?? (() => {});

  return {
    title,
    subTablePrimaryKey: subTableName,
    subTableName,
    subFormFlag: "Y",
    fieldList: [
      // 第一行：apiType radio（systemApi 联动 serviceName/interfaceName/method/redirect）
      [
        {
          label: i18n("apiConfig.apiType"),
          fieldName: "apiType",
          type: "radio",
          defaultValue: "systemApi",
          formVisible: true,
          required: dataRequired,
          helpMsg: i18n("apiConfig.apiType.help"),
          preps: {
            values: apiTypeList,
            dataRelation: {
              actionName: "change",
              relationDetails: [
                {
                  matchType: "eq",
                  controlCondition: "eqVisible",
                  relationFields: [
                    "serviceName",
                    "interfaceName",
                    "method",
                    "redirect",
                  ],
                  matchFieldValue: "systemApi",
                },
              ],
            },
          },
        },
      ],
      // 内嵌 tab：apiInfo / inputConfig / outputConfig
      {
        fieldName: "a",
        containerType: "tab",
        containerFields: [
          // ── apiInfo ──
          {
            title: i18n("apiConfig.section.apiInfo"),
            subTablePrimaryKey: "a",
            subTableName: "a",
            fieldList: [
              // serviceName + interfaceName
              [
                {
                  label: i18n("apiConfig.serviceName"),
                  fieldName: "serviceName",
                  type: "select",
                  helpMsg: i18n("apiConfig.serviceName.help"),
                  formVisible: false,
                  listVisible: true,
                  actions: {
                    change: (val: Record<string, unknown>) => {
                      loadInterface(String(val["serviceName"] ?? ""));
                    },
                  },
                  preps: serviceListUrl
                    ? {
                        dataSource: "url",
                        redirect: false,
                        httpMethod: "GET",
                        url: serviceListUrl,
                      }
                    : {},
                },
                {
                  label: i18n("apiConfig.interfaceName"),
                  fieldName: "interfaceName",
                  type: "select",
                  helpMsg: i18n("apiConfig.interfaceName.help"),
                  formVisible: false,
                  listVisible: true,
                  actions: {
                    change: (val: Record<string, unknown>) => {
                      loadMethods(String(val["interfaceName"] ?? ""));
                    },
                  },
                  preps: { values: interfaceList },
                },
              ],
              // method + redirect
              [
                {
                  label: i18n("apiConfig.method"),
                  fieldName: "method",
                  type: "select",
                  helpMsg: i18n("apiConfig.method.help"),
                  formVisible: false,
                  listVisible: true,
                  actions: {
                    change: (val: Record<string, unknown>) => {
                      const temp = val["method"];
                      const list: any[] = Array.isArray(methodList)
                        ? methodList
                        : ((methodList as any)?.value ?? []);
                      const result = list.find(
                        (item: any) => item?.methodName == temp,
                      );
                      if (result) {
                        val["httpMethod"] = result.method;
                        val["url"] = result.serviceUrl;
                      }
                    },
                  },
                  preps: {
                    values: methodList as any,
                    props: { label: "summary", value: "methodName" },
                  },
                },
                {
                  label: i18n("apiConfig.redirect"),
                  fieldName: "redirect",
                  type: "switch",
                  helpMsg: i18n("apiConfig.redirect.help"),
                  defaultValue: true,
                  formVisible: false,
                  listVisible: true,
                },
              ],
              // httpMethod + protocol
              [
                {
                  label: i18n("apiConfig.httpMethod"),
                  fieldName: "httpMethod",
                  type: "select",
                  defaultValue: defaultMethod,
                  required: dataRequired,
                  helpMsg: i18n("apiConfig.httpMethod.help"),
                  formVisible: true,
                  listVisible: true,
                  preps: { values: httpMethod(), colspan: 12 },
                },
                {
                  label: i18n("apiConfig.protocol"),
                  fieldName: "protocol",
                  type: "select",
                  required: dataRequired,
                  helpMsg: i18n("apiConfig.protocol.help"),
                  defaultValue: "http",
                  formVisible: true,
                  listVisible: true,
                  preps: {
                    allowCreate: true,
                    values: [
                      { name: "HTTP", value: "http" },
                      { name: "HTTPS", value: "https" },
                    ],
                  },
                },
              ],
              // url（colspan 24 独占一行）
              {
                label: i18n("apiConfig.url"),
                fieldName: "url",
                required: dataRequired,
                helpMsg: i18n("apiConfig.url.help"),
                formVisible: true,
                listVisible: true,
                preps: { colspan: 24 },
              },
            ],
          },
          // ── inputConfig ──
          {
            title: i18n("apiConfig.section.inputConfig"),
            subTablePrimaryKey: "b",
            subTableName: "b",
            fieldList: [
              {
                label: i18n("apiConfig.dataType"),
                fieldName: "dataType",
                type: "select",
                defaultValue: "JSON",
                required: dataRequired,
                helpMsg: i18n("apiConfig.dataType.help"),
                formVisible: true,
                listVisible: true,
                preps: {
                  allowCreate: true,
                  values: dataType(),
                  colspan: 12,
                },
              },
              // headers 子表
              {
                containerType: "table",
                containerFields: [
                  {
                    title: i18n("apiConfig.headers"),
                    subTableName: "headers",
                    helpMsg: i18n("apiConfig.headers.help"),
                    initRows: 0,
                    subFormFlag: "Y",
                    fieldList: [
                      {
                        label: i18n("apiConfig.headerName"),
                        fieldName: "paramName",
                        required: dataRequired,
                        helpMsg: i18n("apiConfig.headerName.help"),
                        formVisible: true,
                        listVisible: true,
                        preps: { colspan: 8 },
                      },
                      {
                        label: i18n("apiConfig.headerValue"),
                        fieldName: "paramValue",
                        helpMsg: i18n("apiConfig.headerValue.help"),
                        formVisible: true,
                        listVisible: true,
                        preps: { colspan: 10 },
                      },
                      {
                        label: i18n("apiConfig.valueType"),
                        fieldName: "valueType",
                        type: "select",
                        defaultValue: "static",
                        helpMsg: i18n("apiConfig.valueType.help"),
                        formVisible: true,
                        listVisible: true,
                        preps: { values: valueTypeList, colspan: 6 },
                      },
                    ],
                  },
                ],
              },
              // requestParams 子表
              {
                containerType: "table",
                containerFields: [
                  {
                    title: i18n("apiConfig.requestParams"),
                    subTableName: "requestParams",
                    helpMsg: i18n("apiConfig.requestParams.help"),
                    initRows: 0,
                    fieldList: [
                      {
                        label: i18n("apiConfig.paramName"),
                        fieldName: "paramName",
                        required: true,
                        helpMsg: i18n("apiConfig.paramName.help"),
                        formVisible: true,
                        listVisible: true,
                        preps: { colspan: 8 },
                      },
                      {
                        label: i18n("apiConfig.paramValue"),
                        fieldName: "paramValue",
                        helpMsg: i18n("apiConfig.paramValue.help"),
                        formVisible: true,
                        listVisible: true,
                        preps: { colspan: 10 },
                      },
                      {
                        label: i18n("apiConfig.paramValueField"),
                        fieldName: "paramValueField",
                        type: "select",
                        helpMsg: i18n("apiConfig.paramValueField.help"),
                        formVisible: false,
                        listVisible: false,
                        actions: {
                          change: (val: Record<string, unknown>) => {
                            if (val["paramValueField"]) {
                              val["paramValue"] =
                                "${" + val["paramValueField"] + "}";
                            }
                          },
                        },
                        preps: {
                          values: formFields,
                          filterable: true,
                          allowCreate: true,
                          colspan: 10,
                        },
                      },
                      {
                        label: i18n("apiConfig.matchType"),
                        fieldName: "matchType",
                        type: "select",
                        defaultValue: "eq",
                        helpMsg: i18n("apiConfig.matchType.help"),
                        formVisible: true,
                        listVisible: true,
                        preps: { values: searchMatchList(), colspan: 6 },
                      },
                      {
                        label: i18n("apiConfig.valueType"),
                        fieldName: "valueType",
                        type: "select",
                        defaultValue: "static",
                        helpMsg: i18n("apiConfig.valueType.help"),
                        formVisible: true,
                        listVisible: true,
                        actions: {
                          change: (val: Record<string, unknown>) => {
                            if (val["valueType"] === "dynamic") {
                              const pv = val["paramValue"];
                              if (pv && typeof pv === "string") {
                                const match = pv.match(/^\$\{(\w+)\}$/);
                                if (match) val["paramValueField"] = match[1];
                              }
                            }
                          },
                        },
                        preps: {
                          values: valueTypeList,
                          colspan: 6,
                          dataRelation: {
                            actionName: "change",
                            relationDetails: [
                              {
                                matchType: "eq",
                                controlCondition: "eqVisible",
                                relationFields: ["paramValue"],
                                matchFieldValue: ["static", "isolation"],
                              },
                              {
                                matchType: "eq",
                                controlCondition: "eqVisible",
                                relationFields: ["paramValueField"],
                                matchFieldValue: "dynamic",
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // ── outputConfig ──
          {
            title: i18n("apiConfig.section.outputConfig"),
            subTablePrimaryKey: "c",
            subTableName: "c",
            fieldList: [
              {
                label: i18n("apiConfig.responseTemplate"),
                fieldName: "responseTemplate",
                type: "select",
                defaultValue: "result_data_list",
                required: dataRequired,
                helpMsg: i18n("apiConfig.responseTemplate.help"),
                formVisible: true,
                listVisible: true,
                preps: { values: responseTemplateList, colspan: 24 },
              },
              [
                {
                  label: i18n("apiConfig.successCode"),
                  fieldName: "successCode",
                  helpMsg: i18n("apiConfig.successCode.help"),
                  formVisible: true,
                  listVisible: true,
                  preps: { colspan: 8 },
                },
                {
                  label: i18n("apiConfig.codePath"),
                  fieldName: "codePath",
                  defaultValue: "code",
                  helpMsg: i18n("apiConfig.codePath.help"),
                  formVisible: true,
                  listVisible: true,
                  preps: { colspan: 8 },
                },
                {
                  label: i18n("apiConfig.dataPath"),
                  fieldName: "dataPath",
                  defaultValue: "data",
                  helpMsg: i18n("apiConfig.dataPath.help"),
                  formVisible: true,
                  listVisible: true,
                  preps: { colspan: 8 },
                },
              ],
            ],
          },
        ],
      },
    ],
  };
}

/** dataSource 响应 tab（对齐参考 createDataSourceResponseTab） */
function createDataSourceResponseTab() {
  return {
    title: i18n("apiConfig.tab.response"),
    subTablePrimaryKey: "optionField",
    subTableName: "optionField",
    subFormFlag: "Y",
    fieldList: [
      [
        {
          label: i18n("apiConfig.labelField"),
          fieldName: "labelField",
          required: true,
          helpMsg: i18n("apiConfig.labelField.help"),
          formVisible: true,
          listVisible: true,
          preps: { colspan: 12 },
        },
        {
          label: i18n("apiConfig.valueField"),
          fieldName: "valueField",
          required: true,
          helpMsg: i18n("apiConfig.valueField.help"),
          formVisible: true,
          listVisible: true,
          preps: { colspan: 12 },
        },
      ],
      [
        {
          label: i18n("apiConfig.hasChildren"),
          fieldName: "hasChildren",
          type: "switch",
          defaultValue: false,
          helpMsg: i18n("apiConfig.hasChildren.help"),
          formVisible: true,
          listVisible: true,
          preps: {
            colspan: 12,
            dataRelation: {
              actionName: "change",
              relationDetails: [
                {
                  matchType: "eq",
                  controlCondition: "eqVisible",
                  relationFields: ["childrenField"],
                  matchFieldValue: true,
                },
              ],
            },
          },
        },
        {
          label: i18n("apiConfig.childrenField"),
          fieldName: "childrenField",
          defaultValue: "children",
          helpMsg: i18n("apiConfig.childrenField.help"),
          formVisible: false,
          listVisible: true,
          preps: { colspan: 12 },
        },
      ],
      [
        {
          label: i18n("apiConfig.onlyParseConfigured"),
          fieldName: "onlyParseConfigured",
          type: "switch",
          defaultValue: true,
          helpMsg: i18n("apiConfig.onlyParseConfigured.help"),
          formVisible: true,
          listVisible: true,
          preps: { colspan: 12 },
        },
      ],
    ],
  };
}

/** linkage 响应 tab（对齐参考 createLinkageResponseTab） */
function createLinkageResponseTab(formFields: SelectOption[]) {
  return {
    title: i18n("apiConfig.tab.response"),
    subTablePrimaryKey: "response",
    subTableName: "response",
    fieldList: [
      {
        containerType: "table",
        containerFields: [
          {
            subTableName: "fieldMappings",
            title: i18n("apiConfig.fieldMapping"),
            initRows: 0,
            fieldList: [
              {
                label: i18n("apiConfig.fieldMapping.sourceField"),
                fieldName: "sourceField",
                required: true,
                helpMsg: i18n("apiConfig.fieldMapping.sourceField.help"),
                formVisible: true,
                listVisible: true,
                preps: { colspan: 6 },
              },
              {
                label: i18n("apiConfig.fieldMapping.targetField"),
                fieldName: "distField",
                type: "select",
                required: true,
                helpMsg: i18n("apiConfig.fieldMapping.targetField.help"),
                formVisible: true,
                listVisible: true,
                preps: {
                  values: formFields,
                  allowCreate: true,
                  filterable: true,
                  colspan: 6,
                },
              },
              {
                label: i18n("apiConfig.fieldMapping.typeConvert"),
                fieldName: "typeConvert",
                type: "select",
                helpMsg: i18n("apiConfig.fieldMapping.typeConvert.help"),
                formVisible: true,
                listVisible: true,
                preps: {
                  values: typeConvertList,
                  allowCreate: true,
                  colspan: 6,
                },
              },
              {
                label: i18n("apiConfig.fieldMapping.transform"),
                fieldName: "transform",
                helpMsg: i18n("apiConfig.fieldMapping.transform.help"),
                formVisible: true,
                listVisible: true,
                preps: { colspan: 6 },
              },
            ],
          },
        ],
      },
    ],
  };
}

/** 隔离配置 tab（对齐参考 createAreaIsolation） */
function createAreaIsolation() {
  return {
    title: i18n("apiConfig.section.isolationConfig"),
    subTablePrimaryKey: "isolationConfig",
    subTableName: "isolationConfig",
    subFormFlag: "Y",
    fieldList: [
      {
        label: i18n("apiConfig.isolationType"),
        fieldName: "isolationType",
        type: "select",
        formVisible: true,
        helpMsg: i18n("apiConfig.isolationType.help"),
        preps: { values: isolationTypeList },
      },
      {
        containerType: "table",
        containerFields: [
          {
            subTableName: "isolationDetails",
            title: i18n("apiConfig.section.isolationDetails"),
            initRows: 0,
            fieldList: [
              {
                label: i18n("apiConfig.isolationName"),
                fieldName: "isolationName",
                required: true,
                helpMsg: i18n("apiConfig.isolationName.help"),
                formVisible: true,
              },
              {
                label: i18n("apiConfig.isolationParamName"),
                fieldName: "paramName",
                required: true,
                helpMsg: i18n("apiConfig.isolationParamName.help"),
                formVisible: true,
              },
              {
                label: i18n("apiConfig.isolationCode"),
                fieldName: "isolationCode",
                required: true,
                helpMsg: i18n("apiConfig.isolationCode.help"),
                formVisible: true,
              },
            ],
          },
        ],
      },
    ],
  };
}

/** apiInfo 段顶部加一行 name/description（宿主想省掉外层手写表单时打开） */
function prependMetaRow(requestTab: any) {
  // 在 requestTab.fieldList 第一行（apiType）之前插入 meta 行
  requestTab.fieldList.unshift([
    {
      label: i18n("apiConfig.field.name"),
      fieldName: "name",
      required: true,
      helpMsg: i18n("apiConfig.field.name.help"),
      formVisible: true,
      listVisible: true,
      preps: { colspan: 12 },
    },
    {
      label: i18n("apiConfig.field.description"),
      fieldName: "description",
      helpMsg: i18n("apiConfig.field.description.help"),
      formVisible: true,
      listVisible: true,
      preps: { colspan: 12 },
    },
  ]);
}

/**
 * 生成一份可直接交给 <star-horse-form :fieldList> 使用的 schema。
 * 与参考 createApiConfig 结构一一对应。
 */
export function createApiConfigSchema(options: ApiConfigSchemaOptions = {}) {
  const {
    mode = "linkage" as ApiConfigMode,
    formFields = [],
    currentField,
    interfaceUtils,
    serviceListUrl,
    proxyUrlDefault = PROXY_URL_DEFAULT,
    defaultMethod = mode === "dataSource" ? "GET" : "POST",
    showMeta = false,
  } = options;

  const requestTab = createRequestTab(
    i18n("apiConfig.tab.apiConfig"),
    "apiInfo",
    defaultMethod,
    true,
    interfaceUtils,
    formFields,
    serviceListUrl,
  );
  if (showMeta) prependMetaRow(requestTab);

  const responseTab: any =
    mode === "dataSource"
      ? createDataSourceResponseTab()
      : createLinkageResponseTab(formFields);

  const authTab: any = createRequestTab(
    i18n("apiConfig.tab.authConfig"),
    "authInfo",
    defaultMethod,
    false,
    interfaceUtils,
    formFields,
    serviceListUrl,
  );

  const isolationTab: any = createAreaIsolation();

  // 直连模式(proxy=false)下隐藏仅代理后端才用到的配置：
  // 响应 tab / 认证 tab / 隔离 tab 与 proxyUrl 由 proxy switch 通过容器级 dataRelation 控制。
  const conditionalTabs = [responseTab, authTab, isolationTab];
  responseTab.formVisible = false;
  authTab.formVisible = false;
  isolationTab.formVisible = false;

  const buildProxyContainerRelation = () => ({
    actionName: "change",
    relationDetails: [
      {
        matchType: "eq",
        controlCondition: "eqVisible",
        relationFields: ["proxyUrl"],
        matchFieldValue: true,
      },
      {
        matchType: "eq",
        controlCondition: "eqVisible",
        controlTarget: "container" as const,
        relationFields: conditionalTabs.map((t) => t.subTablePrimaryKey),
        matchFieldValue: true,
      },
    ],
  });

  return {
    /** SFC 内部 apiValid 使用 */
    apiValidUrl: options.apiValidUrl ?? API_VALID_DEFAULT,
    fieldList: [
      {
        label: i18n("apiConfig.proxy"),
        fieldName: "proxy",
        type: "switch",
        defaultValue: true,
        helpMsg: i18n("apiConfig.proxy.help"),
        formVisible: true,
        preps: {
          colspan: 24,
          dataRelation: buildProxyContainerRelation(),
        },
      },
      {
        label: i18n("apiConfig.proxyUrl"),
        fieldName: "proxyUrl",
        helpMsg:
          i18n("apiConfig.proxyUrl.help") +
          "\n\n" +
          i18n("apiConfig.configGuide"),
        defaultValue: proxyUrlDefault,
        formVisible: false,
        required: true,
      },
      {
        label: i18n("apiConfig.conditionFields"),
        fieldName: "conditionFields",
        type: "select",
        helpMsg: i18n("apiConfig.conditionFields.help"),
        defaultValue: currentField ? [currentField] : [],
        formVisible: true,
        required: true,
        preps: { multiple: true, values: formFields },
      },
      {
        label: i18n("apiConfig.pageSize"),
        fieldName: "pageSize",
        type: "number",
        helpMsg: i18n("apiConfig.pageSize.help"),
        defaultValue: 0,
        formVisible: true,
      },
      {
        label: i18n("apiConfig.responseMode"),
        fieldName: "responseMode",
        type: "radio",
        defaultValue: "options",
        helpMsg: i18n("apiConfig.responseMode.help"),
        formVisible: true,
        preps: { colspan: 24, values: responseModeList },
      },
      {
        fieldName: "apiInfo",
        formVisible: true,
        preps: { type: "border-card" },
        containerType: "tab",
        containerFields: [
          requestTab,
          responseTab,
          authTab,
          isolationTab,
        ],
      },
    ],
  };
}
