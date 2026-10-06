/**
 * 第三方接口配置组件 —— star-horse-form schema 生成器
 *
 * 基于 dynamicform/ApiSharedConfig 的第三方接口配置，精简掉编排器不消费的字段：
 * - 删除 conditionFields / pageSize / responseMode / 隔离 tab（编排执行管线不用）
 * - 保留 proxy / proxyUrl（代理开关，apiDataSource 须判代理）
 * - 保留 apiType / serviceName / interfaceName / method / redirect（系统接口选择）
 * - 保留 httpMethod / protocol / url / dataType / headers / requestParams（请求配置）
 * - 保留 responseTemplate / successCode / codePath / dataPath（返回解析）
 * - 保留 fieldMappings（linkage 出参映射：响应字段 → 运行时变量，后续步骤可见）
 * - 保留 labelField / valueField 等（dataSource 选项数据源）
 * - 认证 tab 可选（仅 proxy=true 才显示）
 *
 * 增强参数传递：requestParams 的 valueType=dynamic 时通过 paramValueField
 * 从 formFields（入口参数+全局变量+上游提取变量）选择绑定，自动生成 ${field} 占位符。
 */
import {i18n} from "@/lang";
import type {SelectOption} from "@/components/types/SearchProps";
import {
    apiTypeList,
    dataType,
    httpMethod,
    responseTemplateList,
    searchMatchList,
    sourceValueTypeList,
    typeConvertList,
} from "./options";
import type {ApiSourceInterfaceUtils, ApiSourceMode, ApiSourceSchemaOptions,} from "./types";
import {PageFieldInfo} from "@/components/types";
import {reactive} from "vue";

const API_VALID_DEFAULT = "/userdb-manage/redirect/apiValid";
const PROXY_URL_DEFAULT = "/userdb-manage/redirect/api";

/** 请求 tab（apiType + 接口信息/入参配置/出参配置 三段） */
function createRequestTab(
    title: string,
    subTableName: string,
    defaultMethod: string,
    dataRequired: boolean,
    interfaceUtils: ApiSourceInterfaceUtils | undefined,
    formFields: SelectOption[],
    serviceListUrl?: string,
) {
    const utils = interfaceUtils ?? {};
    const methodList = utils.methodList ?? [];
    const interfaceList = utils.interfaceList ?? [];
    const loadInterface = utils.loadInterface ?? (() => {
    });
    const loadMethods = utils.loadMethods ?? (() => {
    });

    return {
        title,
        subTablePrimaryKey: subTableName,
        subTableName,
        subFormFlag: "Y",
        fieldList: [
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
                                    relationFields: ["serviceName", "interfaceName", "method", "redirect"],
                                    matchFieldValue: "systemApi",
                                },
                            ],
                        },
                    },
                },
            ],
            {
                fieldName: "a",
                containerType: "tab",
                containerFields: [
                    // ── 接口信息 ──
                    {
                        title: i18n("apiConfig.section.apiInfo"),
                        subTablePrimaryKey: "a",
                        subTableName: "a",
                        fieldList: [
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
                                        ? {dataSource: "url", redirect: false, httpMethod: "GET", url: serviceListUrl}
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
                                    preps: {values: interfaceList},
                                },
                            ],
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
                                            const result = list.find((item: any) => item?.methodName == temp);
                                            if (result) {
                                                val["httpMethod"] = result.method;
                                                val["url"] = result.serviceUrl;
                                            }
                                        },
                                    },
                                    preps: {
                                        values: methodList as any,
                                        props: {label: "summary", value: "methodName"},
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
                                    preps: {values: httpMethod(), colspan: 12},
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
                                            {name: "HTTP", value: "http"},
                                            {name: "HTTPS", value: "https"},
                                        ],
                                    },
                                },
                            ],
                            {
                                label: i18n("apiConfig.url"),
                                fieldName: "url",
                                required: dataRequired,
                                helpMsg: i18n("apiConfig.url.help"),
                                formVisible: true,
                                listVisible: true,
                                preps: {colspan: 24},
                            },
                        ],
                    },
                    // ── 入参配置 ──
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
                                preps: {allowCreate: true, values: dataType(), colspan: 12},
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
                                                preps: {colspan: 8},
                                            },
                                            {
                                                label: i18n("apiConfig.headerValue"),
                                                fieldName: "paramValue",
                                                helpMsg: i18n("apiConfig.headerValue.help"),
                                                formVisible: true,
                                                listVisible: true,
                                                preps: {colspan: 10},
                                            },
                                            {
                                                label: i18n("apiConfig.valueType"),
                                                fieldName: "valueType",
                                                type: "select",
                                                defaultValue: "static",
                                                helpMsg: i18n("apiConfig.valueType.help"),
                                                formVisible: true,
                                                listVisible: true,
                                                preps: {values: sourceValueTypeList, colspan: 6},
                                            },
                                        ],
                                    },
                                ],
                            },
                            // requestParams 子表（增强：dynamic 绑定运行时变量）
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
                                                preps: {colspan: 8},
                                            },
                                            {
                                                label: i18n("apiConfig.paramValue"),
                                                fieldName: "paramValue",
                                                helpMsg: i18n("apiConfig.paramValue.help"),
                                                formVisible: true,
                                                listVisible: true,
                                                preps: {colspan: 10},
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
                                                            val["paramValue"] = "${" + val["paramValueField"] + "}";
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
                                                preps: {values: searchMatchList(), colspan: 6},
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
                                                    values: sourceValueTypeList,
                                                    colspan: 6,
                                                    dataRelation: {
                                                        actionName: "change",
                                                        relationDetails: [
                                                            {
                                                                matchType: "eq",
                                                                controlCondition: "eqVisible",
                                                                relationFields: ["paramValue"],
                                                                matchFieldValue: "static",
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
                    // ── 出参配置（返回数据解析） ──
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
                                preps: {values: responseTemplateList, colspan: 24},
                            },
                            [
                                {
                                    label: i18n("apiConfig.successCode"),
                                    fieldName: "successCode",
                                    helpMsg: i18n("apiConfig.successCode.help"),
                                    formVisible: true,
                                    listVisible: true,
                                    preps: {colspan: 8},
                                },
                                {
                                    label: i18n("apiConfig.codePath"),
                                    fieldName: "codePath",
                                    defaultValue: "code",
                                    helpMsg: i18n("apiConfig.codePath.help"),
                                    formVisible: true,
                                    listVisible: true,
                                    preps: {colspan: 8},
                                },
                                {
                                    label: i18n("apiConfig.dataPath"),
                                    fieldName: "dataPath",
                                    defaultValue: "data",
                                    helpMsg: i18n("apiConfig.dataPath.help"),
                                    formVisible: true,
                                    listVisible: true,
                                    preps: {colspan: 8},
                                },
                            ],
                        ],
                    },
                ],
            },
        ],
    };
}

/** dataSource 响应 tab（选项数据源：labelField/valueField/树形） */
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
                    preps: {colspan: 12},
                },
                {
                    label: i18n("apiConfig.valueField"),
                    fieldName: "valueField",
                    required: true,
                    helpMsg: i18n("apiConfig.valueField.help"),
                    formVisible: true,
                    listVisible: true,
                    preps: {colspan: 12},
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
                    preps: {colspan: 12},
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
                    preps: {colspan: 12},
                },
            ],
        ],
    };
}

/**
 * linkage 响应 tab（出参映射：响应字段 → 运行时变量）。
 * 映射后的变量对编排内后续所有步骤可见，实现上游结果作为下游入参。
 */
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
                        helpMsg: i18n("apiConfig.fieldMapping.help"),
                        initRows: 0,
                        fieldList: [
                            {
                                label: i18n("apiConfig.fieldMapping.sourceField"),
                                fieldName: "sourceField",
                                required: true,
                                helpMsg: i18n("apiConfig.fieldMapping.sourceField.help"),
                                formVisible: true,
                                listVisible: true,
                                preps: {colspan: 6},
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
                                preps: {values: typeConvertList, allowCreate: true, colspan: 6},
                            },
                            {
                                label: i18n("apiConfig.fieldMapping.transform"),
                                fieldName: "transform",
                                helpMsg: i18n("apiConfig.fieldMapping.transform.help"),
                                formVisible: true,
                                listVisible: true,
                                preps: {colspan: 6},
                            },
                        ],
                    },
                ],
            },
        ],
    };
}

/** apiInfo 段顶部加 name/description 行 */
export function prependMetaRow() {
    return [
        {
            label: i18n("apiConfig.field.name"),
            fieldName: "name",
            required: true,
            helpMsg: i18n("apiConfig.field.name.help"),
            formVisible: true,
            listVisible: true,
            preps: {colspan: 12},
        },
        {
            label: i18n("apiConfig.field.description"),
            fieldName: "description",
            helpMsg: i18n("apiConfig.field.description.help"),
            formVisible: true,
            listVisible: true,
            preps: {colspan: 12},
        },
    ];
}

/** 完整版 schema 生成（proxy/proxyUrl/apiInfo tab/responseTab/authTab） */
function buildFullSchema(options: ApiSourceSchemaOptions): any {
    const {
        mode = "linkage" as ApiSourceMode,
        formFields = [],
        interfaceUtils,
        serviceListUrl,
        proxyUrlDefault = PROXY_URL_DEFAULT,
        defaultMethod = mode === "dataSource" ? "GET" : "POST",
        showMeta = false,
        showAuth = true,
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

    const responseTab: any =
        mode === "dataSource" ? createDataSourceResponseTab() : createLinkageResponseTab(formFields);

    const authTab: any = createRequestTab(
        i18n("apiConfig.tab.authConfig"),
        "authInfo",
        defaultMethod,
        false,
        interfaceUtils,
        formFields,
        serviceListUrl,
    );

    const conditionalTabs = [responseTab];
    if (showAuth) conditionalTabs.push(authTab);
    responseTab.formVisible = false;
    if (showAuth) authTab.formVisible = false;

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

    const containerFields = [requestTab, responseTab];
    if (showAuth) containerFields.push(authTab);

    return reactive<PageFieldInfo | any>({
        apiValidUrl: options.apiValidUrl ?? API_VALID_DEFAULT,
        fieldList: [
            prependMetaRow(),
            {
                label: i18n("apiConfig.proxy"),
                fieldName: "proxy",
                type: "switch",
                defaultValue: true,
                helpMsg: i18n("apiConfig.proxy.help"),
                formVisible: true,
                preps: {colspan: 24, dataRelation: buildProxyContainerRelation()},
            },
            {
                label: i18n("apiConfig.proxyUrl"),
                fieldName: "proxyUrl",
                helpMsg: i18n("apiConfig.proxyUrl.help") + "\n\n" + i18n("apiConfig.configGuide"),
                defaultValue: proxyUrlDefault,
                formVisible: false,
                required: true,
            },
            {
                fieldName: "apiInfo",
                formVisible: true,
                preps: {type: "border-card"},
                containerType: "tab",
                containerFields,
            },
        ],
    });
}

/**
 * 生成可直接交给 <star-horse-form :fieldList> 使用的 schema。
 * 精简版：无 conditionFields / pageSize / responseMode / 隔离 tab。
 */
export function createApiSourceSchema(options: ApiSourceSchemaOptions = {}) {
    const {
        mode = "linkage" as ApiSourceMode,
        formFields = [],
        interfaceUtils,
        serviceListUrl,
        proxyUrlDefault = PROXY_URL_DEFAULT,
        defaultMethod = mode === "dataSource" ? "GET" : "POST",
        showMeta = false,
        showAuth = true,
        simple = false,
    } = options;

    // 简版：复用完整版 schema（数据结构完全一致），仅通过 formVisible 隐藏非必要字段，
    // 只显示 name/description/httpMethod/url。提交保存的 ApiSourceConfigModel 与完整版对齐。
    if (simple) {
        const full = buildFullSchema({...options, simple: false});
        const SIMPLE_KEEP = new Set(["name", "description", "httpMethod", "url"]);
        const hideNonSimple = (list: any[]) => {
            for (const f of list) {
                if (Array.isArray(f)) {
                    hideNonSimple(f);
                    continue;
                }
                if (f && typeof f === "object") {
                    if (f.fieldName && !SIMPLE_KEEP.has(f.fieldName) && !f.containerType) {
                        f.formVisible = false;
                    }
                    if (Array.isArray(f.fieldList)) hideNonSimple(f.fieldList);
                    if (Array.isArray(f.containerFields)) {
                        for (const c of f.containerFields) {
                            if (c && Array.isArray(c.fieldList)) hideNonSimple(c.fieldList);
                        }
                    }
                }
            }
        };
        hideNonSimple(full.fieldList);
        return full;
    }

    return buildFullSchema(options);
}
