import {JoinSearchParams, SearchInfo, SearchParams,} from "@/components/types/Params";
import {reactive, Reactive, unref} from "vue";
import {ElLoading} from "element-plus";
import JSON5 from "json5";
import {
    deleteByIds,
    dictData,
    download,
    loadById,
    loadData,
    loadGetData,
    postRequest,
    uploadRequest,
} from "@/api/star_horse_apis";
import {error, success} from "@/utils/message";
import {SelectOption} from "@/components/types/SearchProps";
import {BatchFieldInfo, FieldInfo, OrderByInfo, PageFieldInfo, TabFieldInfo,} from "@/components/types/PageFieldInfo";
import {ApiUrls} from "@/components/types/ApiUrls";
import {DialogProps} from "@/components/types/DialogProps";
import {createDatetime} from "@/api/date_utils";
import {i18n} from "@/lang";

let loading: any = null;

/**
 * 构建菜单树
 * @param data
 * @param valField 字符串值
 * @param name
 * @param val 数字值
 */
export function createTree(
    data: any,
    valField: string,
    name: string,
    val: string,
) {
    const list: SelectOption[] = [];
    data.forEach((item: any) => {
        const temp: any = {};
        temp["value"] = valField ? item[valField] : parseInt(item[val]);
        temp["name"] = item[name];
        if (item.children && item.children.length > 0) {
            temp["children"] = createTree(item.children, valField, name, val);
        }
        list.push(temp);
    });
    return list;
}

/**
 * 加载框
 * @param msg
 * @param defaultTarget
 */
export function load(msg: string, defaultTarget?: string) {
    closeLoad();
    loading = ElLoading.service({
        lock: true,
        target: defaultTarget ?? "#app",
        text: msg || i18n("utils.loading"),
        customClass: "star-horse-loading",
        background: "rgba(0,0,0,0.3)",
    });
}

/**
 * 关闭加载框
 */
export function closeLoad() {
    if (loading) {
        loading.close();
        loading = null;
        document.querySelectorAll(".el-loading-mask").forEach((el) => el.remove());
    }
}

/**
 * 下划线转驼峰
 * @param str
 */
export function convertToCamelCase(str: string) {
    if (!str) {
        return undefined;
    }
    str = str.toLowerCase();
    return str.replace(/_(\w)/g, (_match, p1) => {
        return p1.toUpperCase();
    });
}

/**
 * 驼峰转下划线
 * @param str
 */
export function camelCaseToUnderline(str: string) {
    if (!str) {
        return undefined;
    }
    return str.replace(/[A-Z]/g, (match, _p1) => {
        return "_" + match.toLowerCase();
    });
}

/**
 * 数据格式化
 * @param name
 * @param cellValue
 */
export function commonParseCodeToName(name: string, cellValue: any) {
    if (!cellValue && cellValue != 0) {
        return "-";
    }
    if (name == "isDel" || name.includes("&isDel")) {
        return cellValue == 1 ? i18n("api.yes") : i18n("api.no");
    }
    if (name == "state" || name.includes("&state")) {
        return cellValue == 1 ? i18n("api.normal") : i18n("api.abnormal");
    }
    const preps: Array<string> = [
        "createTime",
        "updateTime",
        "createdTime",
        "updatedTime",
        "editTime",
    ];
    const result = preps.find(
        (item) =>
            name?.includes("&" + item) ||
            convertToCamelCase(name)?.toLowerCase() === item.toLowerCase(),
    );
    if (result) {
        return createDatetime(cellValue);
    } else {
        return cellValue;
    }
}

/**
 * 数据匹配方式
 */
export function searchMatchList(): SelectOption[] {
    const data: SelectOption[] = [];
    data.push({name: i18n("utils.searchMatch.equal"), value: "eq"});
    data.push({name: i18n("utils.searchMatch.notEqual"), value: "neq"});
    data.push({name: i18n("utils.searchMatch.fuzzy"), value: "lk"});
    data.push({name: i18n("utils.searchMatch.empty"), value: "isnull"});
    data.push({name: i18n("utils.searchMatch.notEmpty"), value: "notnull"});
    data.push({name: i18n("utils.searchMatch.leftFuzzy"), value: "llk"});
    data.push({name: i18n("utils.searchMatch.rightFuzzy"), value: "rlk"});
    data.push({name: i18n("utils.searchMatch.notMatch"), value: "nlk"});
    data.push({name: i18n("utils.searchMatch.lessThan"), value: "lt"});
    data.push({name: i18n("utils.searchMatch.lessThanOrEqual"), value: "lte"});
    data.push({name: i18n("utils.searchMatch.greaterThan"), value: "gt"});
    data.push({
        name: i18n("utils.searchMatch.greaterThanOrEqual"),
        value: "gte",
    });
    data.push({name: i18n("utils.searchMatch.range"), value: "bt"});
    data.push({
        name: i18n("utils.searchMatch.in_digit"),
        value: "ini",
        helpMsg: i18n("utils.searchMatch.helpMsg.digit"),
    });
    data.push({
        name: i18n("utils.searchMatch.in_character"),
        value: "ins",
        helpMsg: i18n("utils.searchMatch.helpMsg.character"),
    });
    return data;
}

/**
 * 排序方式
 */
export function orderBy(): SelectOption[] {
    const options: SelectOption[] = [];
    options.push({name: i18n("utils.asc"), value: "asc"});
    options.push({name: i18n("utils.desc"), value: "desc"});
    return options;
}

/**
 * 请求方式
 */
export function httpMethod(): SelectOption[] {
    const options: SelectOption[] = [];
    options.push({name: "POST", value: "POST"});
    options.push({name: "GET", value: "GET"});
    options.push({name: "HEAD", value: "HEAD"});
    options.push({name: "PUT", value: "PUT"});
    options.push({name: "PATCH", value: "PATCH"});
    options.push({name: "DELETE", value: "DELETE"});
    options.push({name: "OPTIONS", value: "OPTIONS"});
    options.push({name: "TRACE", value: "TRACE"});
    return options;
}

/**
 * 辅助函数 创建属性对象
 * @param label 字段标签
 * @param fieldName 字段名称
 * @param type 字段类型
 * @param defaultVisible 默认可见
 * @param matchType 匹配方式
 */
export function createSearchField(
    label: string,
    fieldName: string,
    defaultVisible?: boolean,
    matchType?: string,
    type: string = "input",
) {
    return {
        label,
        fieldName,
        type,
        defaultVisible,
        matchType,
    };
}

/**
 * 辅助函数 创建属性对象
 * @param label 字段标签
 * @param fieldName 字段名称
 * @param type 字段类型
 * @param formVisible 表单可见
 * @param listVisible 表格可见
 */
export function createField(
    label: string,
    fieldName: string,
    type: string = "input",
    formVisible?: boolean,
    listVisible?: boolean,
) {
    return {
        label,
        fieldName,
        type,
        formVisible,
        listVisible,
    };
}

/**
 * 公共字段
 * @param formVisibleFields 表单可见字段
 * @param tableVisibleFields 表格可见字段
 */
export function commonField(
    formVisibleFields?: Array<string>,
    tableVisibleFields?: Array<string>,
) {
    const fields: FieldInfo[] = [];
    fields.push({
        label: i18n("utils.field.createdBy"),
        fieldName: "createdBy",
        formVisible: false,
        listVisible: false,
    });
    fields.push({
        label: i18n("utils.field.createdDate"),
        fieldName: "createdTime",
        type: "date",
        formVisible: false,
        listVisible: false,
    });
    fields.push({
        label: i18n("utils.field.updatedBy"),
        fieldName: "updatedBy",
        formVisible: false,
        listVisible: false,
    });
    fields.push({
        label: i18n("utils.field.updatedDate"),
        fieldName: "updatedTime",
        type: "date",
        formVisible: false,
        listVisible: false,
    });
    fields.push({
        label: i18n("utils.field.remark"),
        fieldName: "remark",
        type: "textarea",
        formVisible: false,
        listVisible: false,
    });
    fields.push({
        label: i18n("utils.field.dataNo"),
        fieldName: "dataNo",
        formVisible: false,
        listVisible: false,
    });
    fields.push({
        label: i18n("utils.field.version"),
        fieldName: "version",
        type: "number",
        formVisible: false,
        listVisible: false,
    });
    fields.push({
        label: i18n("utils.field.tenantId"),
        fieldName: "tenantId",
        formVisible: false,
        listVisible: false,
    });
    fields.push({
        label: i18n("utils.field.roleId"),
        fieldName: "createdRoleId",
        formVisible: false,
        listVisible: false,
    });

    fields.push({
        label: i18n("utils.field.statusName"),
        fieldName: "statusName",
        formVisible: false,
        listVisible: false,
    });
    fields.push({
        label: i18n("utils.field.statusCode"),
        fieldName: "statusCode",
        formVisible: false,
        listVisible: false,
    });

    fields.push({
        label: i18n("utils.field.local"),
        fieldName: "local",
        formVisible: false,
        listVisible: false,
    });
    fields.push({
        label: i18n("utils.field.isDel"),
        fieldName: "isDel",
        type: "number",
        formVisible: false,
        listVisible: false,
    });
    fields.forEach((item) => {
        if (formVisibleFields?.includes(item.fieldName)) {
            item.formVisible = true;
        }
        if (tableVisibleFields?.includes(item.fieldName)) {
            item.listVisible = true;
        }
    });
    return fields;
}

/**
 * 数据格式
 */
export function dataType(): SelectOption[] {
    const options: SelectOption[] = [];
    options.push({name: "FORM", value: "FORM"});
    options.push({name: "JSON", value: "JSON"});
    options.push({name: "BINARY", value: "BINARY"});
    return options;
}

/**
 * 复制数据
 * @param msg
 */
export function copyTxt(msg: string) {
    navigator.clipboard
        .writeText(msg)
        .then(() => {
            success(i18n("utils.copied"));
        })
        .catch(() => {
            error(i18n("utils.copyFailed"));
        });
}

/**
 * 表格序号
 * @param row
 * @param rowIndex
 */
export function rowClassName({row, rowIndex}: any) {
    if (row) {
        row.xh = rowIndex + 1;
    }
}

/**
 * 创建条件
 */
export function createCondition(
    name: string,
    val: any,
    matchType: string = "eq",
): SearchParams {
    return {propertyName: name, value: val, operation: matchType};
}

/**
 * 创建关联条件
 * @param leftFieldName 左表字段名称
 * @param rightFieldName 右表字段名称
 * @param matchType 匹配方式
 */
export function createJoinCondition(
    leftFieldName: string,
    rightFieldName: string,
    matchType: string = "eq",
): JoinSearchParams {
    return {leftFieldName, rightFieldName, operation: matchType};
}

/**
 * 解析已组装的条件
 * @param conditions
 * @param name
 */
export function analysisField(conditions: SearchParams[], name: string) {
    return conditions.find((item) => item.propertyName?.endsWith(name)) || {};
}

/**
 * 判断是不是Json
 * @param v
 */
export function isJson(v: any) {
    if (!v) {
        return false;
    }
    if (
        v &&
        typeof v === "string" &&
        (/^\{[\s\S]*\}$/.test(v) || /^\[[\s\S]*\]$/.test(v))
    ) {
        try {
            JSON5.parse(v);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
    if (
        typeof v === "object" &&
        Object.prototype.toString.call(v).toLowerCase() === "[object object]" &&
        !v.length
    ) {
        return true;
    }
    return false;
}

/**
 * 解析表单字段映射
 * @param fieldList
 */
export function formFieldMapping(fieldList: PageFieldInfo) {
    // Early exit for invalid data
    if (!fieldList) {
        return {
            defaultDatas: {},
            mappingFields: [],
            batchDefaultValues: {},
            actions: [],
            formFields: [],
        };
    }
    let defaultDatas: any = {};
    const actions: Array<any> = [];
    const formFields: Array<FieldInfo> = [];
    //解析出字段之间的映射关系
    const mappingFields: Array<any> = [];
    const tempList = fieldList.fieldList || [];
    const batchDefaultValues: any = {};
    const brotherNodes = (fields: Array<FieldInfo>) => {
        fields?.forEach((field: FieldInfo) => {
            formFields.push(field);
        });
    };
    const tabOperation = (data: TabFieldInfo) => {
        const fieldList: Array<FieldInfo> = data.fieldList || [];
        if ("Y" == data.subFormFlag) {
            defaultDatas[data.tabName] = {};
            //如果是子表
            fieldsOperation(fieldList, defaultDatas[data.tabName]);
        } else {
            fieldsOperation(fieldList, defaultDatas);
        }
    };

    const tableOperation = (batchTempList: Array<BatchFieldInfo>) => {
        if (!batchTempList || batchTempList.length === 0) return;

        for (const element of batchTempList) {
            const temp = element;
            if (!defaultDatas[temp.batchName]) {
                defaultDatas[temp.batchName] = [];
            }
            if (!batchDefaultValues[temp.batchName + "DefaultValue"]) {
                batchDefaultValues[temp.batchName + "DefaultValue"] = [];
            }
            const fieldList: Array<FieldInfo> = temp.fieldList || [];
            let tempData: any = {};

            for (const element of fieldList) {
                const item = element;
                if (item.defaultValue) {
                    if (isJson(item.defaultValue)) {
                        Object.assign(tempData, item.defaultValue);
                    } else {
                        tempData[item.fieldName] = item.defaultValue;
                    }
                }
                if (item.aliasName) {
                    mappingFields.push({name: item.fieldName, alias: item.aliasName});
                }
                if (item.actions) {
                    actions.push({
                        batchName: temp.batchName,
                        actions: item.actions,
                        fieldName: item.fieldName,
                    });
                }
                formFields.push(item);
                brotherNodes(item.brotherNodes);
            }
            batchDefaultValues[temp.batchName + "DefaultValue"].push(tempData);
        }
    };

    const fieldsOperation = (dataList: any, defaultData: any) => {
        if (!dataList || dataList.length === 0) return;

        for (const element of dataList) {
            const temp = element;
            if (Array.isArray(temp)) {
                for (const element of temp) {
                    const item = element;
                    if (item.defaultValue) {
                        if (isJson(item.defaultValue)) {
                            Object.assign(defaultData, item.defaultValue);
                        } else {
                            defaultData[item.fieldName] = item.defaultValue;
                        }
                    }
                    if (item.aliasName) {
                        mappingFields.push({name: item.fieldName, alias: item.aliasName});
                    }
                    if (item.actions) {
                        actions.push({
                            actions: item.actions,
                            fieldName: item.fieldName,
                        });
                    }
                    formFields.push(item);
                    brotherNodes(item.brotherNodes);
                }
            } else if (
                temp &&
                (temp["tabList"] || temp["collapseList"] || temp["cardList"])
            ) {
                //如果是tabList
                const tabList: Array<TabFieldInfo> =
                    temp["tabList"] || temp["collapseList"] || temp["cardList"] || [];
                for (const element of tabList) {
                    tabOperation(element);
                }
            } else if (temp?.batchFieldList) {
                //如果是tableList
                const tableList: Array<BatchFieldInfo> = temp["batchFieldList"];
                tableOperation(tableList);
            } else if (temp) {
                if (temp.defaultValue) {
                    if (isJson(temp.defaultValue)) {
                        Object.assign(defaultData, temp.defaultValue);
                    } else {
                        defaultData[temp.fieldName] = temp.defaultValue;
                    }
                }
                if (temp.aliasName) {
                    mappingFields.push({name: temp.fieldName, alias: temp.aliasName});
                }
                if (temp.actions) {
                    actions.push({
                        actions: temp.actions,
                        fieldName: temp.fieldName,
                    });
                }
                formFields.push(temp);
                brotherNodes(temp.brotherNodes);
                // 递归处理 children
                if (temp.children && Array.isArray(temp.children) && temp.children.length > 0) {
                    fieldsOperation(temp.children, defaultData);
                }
            }
        }
    };

    fieldsOperation(tempList, defaultDatas);
    const batchTempList = fieldList.batchFieldList || [];
    tableOperation(batchTempList);
    Object.assign(defaultDatas, batchDefaultValues);

    return {
        defaultDatas,
        mappingFields,
        batchDefaultValues,
        actions,
        formFields,
    };
}

/**
 * 批量列表数据默认值
 * @param datas
 * @param dataForm
 */
export function batchFieldDefaultValues(datas: BatchFieldInfo, dataForm: any) {
    let defaultValues: any = {};
    if (datas["batchDefaultData"]) {
        defaultValues = {...datas["batchDefaultData"]};
    }
    const fieldList = datas["fieldList"];
    for (const inde in fieldList) {
        const temp = fieldList[inde];
        if (temp.defaultValue) {
            if (isJson(temp.defaultValue)) {
                for (const key in temp.defaultValue) {
                    defaultValues[key] = temp.defaultValue[key];
                }
            } else {
                defaultValues[temp.fieldName] = temp.defaultValue;
            }
        }
    }
    if (dataForm) {
        let temp = unref(dataForm)?.[datas.batchName];
        if (temp) {
            defaultValues = {...temp, ...defaultValues};
        }
    }
    return defaultValues;
}

/**
 * 动态组件数据
 * @param field 组件参数信息
 * @param analysisUrl 是否解析Url
 */
export async function compDynamicData(field: any, analysisUrl?: false) {
    const temp = field;
    let reDataList: SelectOption[] = [];
    const dataSource = temp.preps?.dataSource;
    const urlOrDictName = temp.preps?.urlOrDictName;
    if (dataSource == "url" && !analysisUrl) {
        reDataList = await dynamicUrlOperation(field);
    } else if (dataSource == "dict") {
        const dicts = await dictData(urlOrDictName);
        if (Object.keys(dicts).length == 0) {
            error(i18n("utils.dictNotConfigured") + `【${urlOrDictName}】`);
        } else {
            reDataList = dicts;
        }
    } else if (dataSource == "api") {
        // 第三方接口数据源
        reDataList = await loadApiDataSource(temp.preps);
    } else {
        reDataList = [];
    }
    //前面没有满足条件的数据，则判断静态数据是否存在
    if (unref(field.preps?.values)?.length > 0) {
        return unref(field.preps?.values);
    }
    if (unref(field.preps?.data)?.length > 0) {
        return unref(field.preps?.data);
    }
    if (unref(field?.optionList)?.length > 0) {
        return unref(field.optionList);
    }
    return reDataList;
}

/**
 * 加载第三方接口数据源，将接口返回数据转换为SelectOption[]
 */
async function loadApiDataSource(preps: any): Promise<SelectOption[]> {
    const temp = preps || {};
    const requestParams: Record<string, any> = {
        url: temp.apiUrl,
        httpMethod: temp.apiHttpMethod || "POST",
        dataType: temp.apiDataType || "JSON",
        responseTemplate: temp.apiResponseTemplate || "result_data",
        successCode: temp.apiSuccessCode ?? 0,
        codePath: temp.apiCodePath || "code",
        dataPath: temp.apiDataPath || "data",
    };

    // 请求参数
    if (temp.apiRequestParams && Array.isArray(temp.apiRequestParams)) {
        const params: Record<string, any> = {};
        temp.apiRequestParams.forEach((p: any) => {
            if (p.paramName) {
                params[p.paramName] = p.paramValue || "";
            }
        });
        requestParams.requestParams = params;
    }

    // 自定义请求头
    if (temp.apiHeaders) {
        requestParams.headers = typeof temp.apiHeaders === "string" ? JSON.parse(temp.apiHeaders) : temp.apiHeaders;
    }

    // 登录配置
    if (temp.apiNeedLogin === "Y") {
        requestParams.authType = "login";
        requestParams.loginUrl = temp.apiLoginUrl;
        requestParams.loginMethod = temp.apiLoginMethod || "POST";
        requestParams.loginAccount = temp.apiLoginAccount || "";
        requestParams.loginPassword = temp.apiLoginPassword || "";
        requestParams.loginTokenPath = temp.apiLoginTokenPath || "data.token";
        requestParams.loginHeaderName = temp.apiLoginHeaderName || "Authorization";
    }

    try {
        const result = await loadData(temp.preps.apiLinkageRedirectUrl ?? "/system-config/redirect/apiLinkage", requestParams);
        if (result.error) {
            error(i18n("api.apiLinkageError") || "第三方接口请求失败: " + result.error);
            return [];
        }
        const data = result.data;
        if (!data) return [];

        // 将返回数据转换为SelectOption[]
        const labelField = temp.apiLabelField || "name";
        const valueField = temp.apiValueField || "value";
        let list: any[] = [];
        if (Array.isArray(data)) {
            list = data;
        } else if (typeof data === "object") {
            list = [data];
        }
        return list.map((item: any) => ({
            name: typeof item === "object" ? item[labelField] : String(item),
            value: typeof item === "object" ? item[valueField] : item,
        })).filter((item: SelectOption) => item.name !== undefined && item.value !== undefined);
    } catch (err: any) {
        error(i18n("api.apiLinkageError") || "第三方接口请求异常: " + (err.message || err));
        return [];
    }
}

/**
 *
 * @param preps 组件参数信息
 * @param queryInfo 查询条件
 * @param proxyUrl 代理接口,为空时，默认使用/system-config/redirect/execute
 */
export async function dynamicUrlOperation(
    preps: any,
    queryInfo?: SearchParams[],
    proxyUrl?: string,
) {
    const temp = preps.preps || preps;
    const redirect = temp.redirect ?? true;
    const reDataList: SelectOption[] = [];
    const requestParams: SearchParams[] = [];
    const queryParams = temp?.queryParams;
    queryParams?.forEach((item: any) => {
        if (!item.name && !item.propertyName) {
            return;
        }
        requestParams.push({
            propertyName: item.name ?? item.propertyName,
            value: item.value || "",
            operation: item.matchType,
        });
    });
    //自定义查询
    if (queryInfo) {
        requestParams.push(...queryInfo);
    }
    let url = temp.url;
    if (!url) {
        console.error(i18n("api.noUrlProvided"));
        return;
    }
    let params: any = {
        fieldList: requestParams,
    };
    // eslint-disable-next-line no-useless-assignment
    let validResult: any = {};
    //是否重定向
    if (redirect) {
        params = {
            url: temp["url"] ?? temp["interfaceUrl"],
            host: temp["host"],
            port: temp["port"],
            protocol: temp["protocol"],
            env: temp["env"],
            httpMethod: temp.httpMethod || "POST",
            dataType: temp.dataType || "JSON",
            searchInfo: {
                fieldList: requestParams,
            },
        };
        url = proxyUrl ?? "/system-config/redirect/execute";
        validResult = await loadData(url, params);
    } else {
        if (temp?.httpMethod && temp.httpMethod.toUpperCase() === "GET") {
            validResult = await loadGetData(url);
        } else {
            validResult = await loadData(url, params);
        }
    }
    if (validResult.error) {
        error(validResult.error);
    } else {
        const labelName = temp["selectLabel"] ?? temp["labelName"] ?? "name";
        const valueName = temp["selectValue"] ?? temp["valueName"] ?? "value";
        const childrenOperation = (list: Array<any>) => {
            const options: SelectOption[] = [];
            list?.forEach((item: any) => {
                const option: SelectOption = {
                    name: item[labelName],
                    value: item[valueName],
                };
                if (item.children?.length > 0) {
                    option.children = childrenOperation(item.children);
                }
                options.push(option);
            });
            return options;
        };
        validResult?.data?.forEach((item: any) => {
            const option: SelectOption = {
                name: item?.[labelName],
                value: item?.[valueName],
            };
            if (item?.children?.length > 0) {
                option.children = childrenOperation(item.children);
            }
            reDataList.push(option);
        });
    }
    return reDataList;
}

/**
 * 创建过滤器
 * @param queryString 查询参数
 */
export async function createFilter(queryString: string) {
    return (data: SelectOption) => {
        return (
            data?.name?.toLowerCase().search(queryString?.toLowerCase()) ||
            data?.value?.toString()?.toLowerCase().search(queryString?.toLowerCase())
        );
    };
}

/**
 * 规范化路径，移除多余的斜杠，确保路径格式正确
 * @param path 需要规范化的路径
 * @returns 规范化后的路径（不以斜杠开头和结尾，除非是根路径）
 */
function normalizePath(path: string): string {
    if (!path) return "";

    // 如果是 http/https 开头，直接返回
    if (path.startsWith("http:") || path.startsWith("https:")) {
        return path;
    }

    // 移除开头和结尾的所有斜杠（包括正斜杠和反斜杠）
    let normalized = path.replace(/^[\/\\]+|[\/\\]+$/g, "");

    // 将中间的反斜杠替换为正斜杠
    normalized = normalized.replace(/\\/g, "/");

    return normalized;
}

/**
 * 拼接路径，确保路径分隔符正确
 * @param segments 路径片段
 * @returns 拼接后的路径
 */
function joinPath(...segments: string[]): string {
    // 过滤空字符串并规范化每个片段
    const normalizedSegments = segments
        .filter(segment => segment !== undefined && segment !== null && segment !== "")
        .map(normalizePath);

    // 用正斜杠连接所有片段
    return normalizedSegments.join("/");
}

/**
 * 公共 Api 接口
 * @param appName 应用名称或者接口前缀
 * @param urlPrefix api 接口前缀
 * @param condition 条件
 */
export function apiInstance(
    appName: string,
    urlPrefix: string,
    condition: Array<any> = [],
): ApiUrls {

    // 规范化路径参数
    const normalizedAppName = normalizePath(appName);
    const normalizedUrlPrefix = normalizePath(urlPrefix);

    let prefix: string = joinPath(normalizedAppName, normalizedUrlPrefix);

    // 如果是完整的 URL（http/https），则特殊处理
    if (appName.startsWith("https:") || appName.startsWith("http:")) {
        prefix = `${normalizedAppName}/${normalizedUrlPrefix}`;
    }

    const apiUrls: ApiUrls = {
        basePrefix: prefix,
        appName: appName,
        subPrefix: normalizedUrlPrefix,
        pageListUrl: `${prefix}/pageList`,
        mergeUrl: `${prefix}/merge`,
        mergeDraftUrl: `${prefix}/mergeDraft`,
        batchMergeUrl: `${prefix}/mergeBatch`,
        batchMergeDraftUrl: `${prefix}/mergeBatchDraft`,
        loadByIdUrl: `${prefix}/getById`,
        loadByIdForViewUrl: `${prefix}/getByIdForView`,
        deleteUrl: `${prefix}/batchDeleteById`,
        deleteByConditionUrl: `${prefix}/deleteByCondition`,
        exportAllUrl: `${prefix}/exportData`,
        downloadTemplateUrl: `${prefix}/downloadTemplate`,
        listConditionUrl: `${prefix}/getAllByCondition`,
        oneConditionUrl: `${prefix}/getOneByCondition`,
        importUrl: `${prefix}/importData`,
        uploadUrl: `${normalizedAppName}/annex/upload/common`,
        modifyColumnsUrl: `${prefix}/modifyColumns`,
        exportSingleDataUrl: `${prefix}/exportSingleData`,
        condition: condition,
    };
    apiUrls.pageAction = (params: SearchInfo) => {
        return postRequest(apiUrls.pageListUrl!, params);
    };
    apiUrls.mergeAction = (param: any) => {
        return postRequest(apiUrls.mergeUrl!, param);
    };
    apiUrls.mergeDraftAction = (param: any) => {
        return postRequest(apiUrls.mergeDraftUrl!, param);
    };
    apiUrls.batchMergeAction = (param: any) => {
        return postRequest(apiUrls.batchMergeUrl!, param);
    };
    apiUrls.batchMergeDraftAction = (param: any) => {
        return postRequest(apiUrls.batchMergeDraftUrl!, param);
    };
    apiUrls.loadByIdAction = (id: any, isView: boolean, params: any = {}) => {
        return loadById(
            isView ? apiUrls.loadByIdForViewUrl! : apiUrls.loadByIdUrl!,
            id,
            params,
        );
    };
    apiUrls.deleteAction = (params: any) => {
        return deleteByIds(apiUrls.deleteUrl!, params);
    };
    apiUrls.deleteByConditionAction = (params: any) => {
        return postRequest(apiUrls.deleteByConditionUrl!, params);
    };
    apiUrls.exportDataAction = async (param: any) => {
        return await download(apiUrls.exportAllUrl!, param);
    };
    apiUrls.downloadTemplateAction = async (param: any) => {
        return await download(apiUrls.downloadTemplateUrl!, param || {});
    };
    apiUrls.queryConditionAction = (
        params: SearchParams[] | any,
        orderBy: OrderByInfo[] = [],
    ) => {
        return loadData(apiUrls.listConditionUrl!, params, orderBy);
    };
    apiUrls.queryOneByConditionAction = (
        params: SearchParams[] | any,
        orderBy: OrderByInfo[] = [],
    ) => {
        return loadData(apiUrls.oneConditionUrl!, params, orderBy);
    };
    apiUrls.importAction = (param: any) => {
        return uploadRequest(apiUrls.importUrl!, param);
    };
    apiUrls.uploadAction = (param: any) => {
        return uploadRequest(apiUrls.uploadUrl!, param);
    };
    apiUrls.executeAction = (param: any) => {
        return postRequest(apiUrls.executeUrl!, param);
    };
    apiUrls.modifyColumnsAction = (param: any) => {
        return postRequest(apiUrls.modifyColumnsUrl!, param);
    };
    apiUrls.exportSingleDataAction = async (param: any) => {
        return await download(apiUrls.exportSingleDataUrl!, param);
    };
    return apiUrls;
}

/**
 * 模态窗口相关属性
 */
export function dialogPreps(
    title: string = i18n("dialog.editTitle"),
    batchTitle: string = i18n("dialog.batchAddTitle"),
): Reactive<DialogProps> {
    return reactive<DialogProps>({
        bakeVisible1: false,
        bakeVisible2: false,
        bakeVisible3: false,
        ids: 0,
        batchDialogTitle: batchTitle,
        dialogTitle: title,
        batchEditVisible: false,
        editVisible: false,
        uploadVisible: false,
        viewVisible: false,
    });
}

/**
 * 参数编码
 * @param param
 */
export function uriEncode(param: string | number | boolean) {
    return encodeURIComponent(param);
}

/**
 * 参数解码
 * @param param
 */
export function uriDecode(param: string) {
    return decodeURIComponent(param);
}

/**
 * 字符串转base64
 * @param param
 */
export function base64Encode(param: string) {
    return btoa(param);
}

/**
 * 对象转base64
 * @param object
 */
export function objectToBase64(object: any) {
    return base64Encode(JSON.stringify(object));
}

/**
 * base64转字符串
 * @param param
 */
export function base64Decode(param: string) {
    return atob(param);
}

/**
 * 预览图片（纯JS实现，无第三方依赖）
 * @param images 图片URL数组或单个URL
 */
export {ImagePreview, imagesPreview} from "@/utils/ImagePreview";
export type {ImagePreviewOptions, ImageTransition} from "@/utils/ImagePreview";

/**
 * 设置css 全局变量
 * @param name 变量名称
 * @param val 变量值
 * @param dom
 */
export function setCssVar(
    name: string,
    val: any,
    dom = document.documentElement,
) {
    dom.style.setProperty(name, val);
}

/**
 * 去除空格
 * @param data
 */
export function trim(data: string) {
    if (!data) {
        return data;
    }
    return data.replace(/(^\s*)|(\s*$)/g, "");
}
