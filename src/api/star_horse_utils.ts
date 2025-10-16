import {SearchInfo, SearchParams,} from "@/components/types/Params";
import {reactive, Reactive, unref} from "vue";
import {ElLoading} from "element-plus";
import JSON5 from "json5";
import {download, getRequest, postRequest, uploadRequest,} from "@/api/star_horse_apis";
import {error, operationConfirm, success, warning} from "@/utils/message";
import {SelectOption} from "@/components/types/SearchProps";
import {BatchFieldInfo, FieldInfo, OrderByInfo, PageFieldInfo, TabFieldInfo,} from "@/components/types/PageFieldInfo";
import {ApiUrls} from "@/components/types/ApiUrls";
import {DialogProps} from "@/components/types/DialogProps";
import {createDatetime} from "@/api/date_utils";
import {ServiceEnums} from "@/components/enums/ServiceEnums";
import {i18n} from "@/lang";

let loading: any = null;

/**
 * 字典接口
 */
const dictUrl: string = `${ServiceEnums.SYSTEM_PREFIX}dictinfo/getAllByCondition`;

/**
 * 加载Post 数据
 * @param url 接口地址
 * @param params 参数
 * @param orderBy 排序
 */
export async function loadData(
    url: string,
    params: SearchParams[] | any,
    orderBy: OrderByInfo[] = [],
) {
    let data: any = null;
    let error = "";
    let cond = params;
    if (Array.isArray(params)) {
        cond = {
            fieldList: params,
            orderBy: orderBy,
        };
    }
    await postRequest(url, cond)
        .then((res: any) => {
            const redata = res.data;
            if (redata.code) {
                error = redata.cnMessage;
            } else {
                //先去分页数据，没有再去非分页数据
                data = redata.data.dataList || redata.data;
            }
        })
        .catch((err) => {
            error = err;
        });
    return {
        data,
        error,
    };
}

/**
 * 加载Get 数据
 * @param url 接口地址
 * @param params 参数
 */
export async function loadGetData(url: string) {
    let data = reactive<any>([]);
    let error: string = "";
    await getRequest(url)
        .then((res) => {
            const redata = res.data;
            if (redata.code != 0) {
                error = redata.cnMessage;
            } else {
                data = redata.data;
            }
        })
        .catch((err) => {
            error = err;
        });
    return {
        data,
        error,
    };
}

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
        text: msg || "Loading...",
        customClass: "star-horse-loading",
        background: "rgba(0, 0, 0, 0.7)",
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
        "createdTime",
        "updatedTime",
        "createdTime",
        "updatedTime",
        "createTime",
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
 * 加载Id数据
 * @param url
 * @param id
 * @param params
 */
export async function loadById(url: string, id: any, params: any = {}) {
    if (!url || "undefined" == id) {
        warning(i18n("utils.provideCorrectData"));
        return;
    }
    let objData: any = {};
    const suffix: string = id ? "/" + id : "";
    await postRequest(url + suffix, params).then((res) => {
        const redata = res.data.data;
        if (!redata) {
            warning(i18n("utils.dataNotFound"));
        } else {
            objData = redata;
        }
    });
    return objData;
}

/**
 * 根据Id删除数据
 * @param url
 * @param ids
 * @param msg 删除提示
 */
export async function deleteByIds(
    url: string,
    ids: any,
    msg: string = i18n("utils.confirmDelete"),
) {
    if (!url) {
        warning(i18n("utils.provideCorrectData"));
        return;
    }
    if (!ids || ids.length == 0) {
        warning(i18n("utils.selectDataToDelete"));
        return;
    }
    let objData: boolean = false;
    const confirmFlag: boolean = await operationConfirm(msg);
    if (!confirmFlag) {
        return;
    }
    await postRequest(url, ids)
        .then((res) => {
            if (res.data.code == 0) {
                success(res.data.cnMessage);
            } else {
                warning(res.data.cnMessage);
            }
            closeLoad();
            objData = true;
        })
        .catch((err) => {
            error(i18n("dialog.interfaceError") + err);
            objData = false;
        })
        .finally(() => {
            closeLoad();
        });
    return objData;
}

/**
 * 根据字典类别获取字典数据
 * @param dictType 字典类别
 * @param exclusion 排除字典项
 * @param userUrl 用户自定义接口
 */
export async function dictData(
    dictType: string,
    exclusion: Array<string> = [],
    userUrl?: string,
) {
    const query = [];
    query.push({
        propertyName: "dictType",
        value: dictType,
    });
    const dicts: SelectOption[] = [];
    await postRequest(userUrl ?? dictUrl, {fieldList: query})
        .then((res) => {
            const redata = res.data;
            if (redata.code == 0) {
                redata.data?.forEach((item: any) => {
                    if (exclusion?.includes(item.dictCode)) {
                        return;
                    }
                    dicts.push({name: item.dictName, value: item.dictCode});
                });
            }
        })
        .catch((err: any) => {
            console.log("接口不存在或网络异常", err);
        });
    return dicts;
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
    return data;
}

/**
 * 复制数据
 * @param msg
 */
export function copy(msg: string) {
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
        })
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
 */
export async function compDynamicData(field: any) {
    const temp = field;
    let reDataList: SelectOption[] = [];
    const dataSource = temp.preps?.dataSource;
    const urlOrDictName = temp.preps?.urlOrDictName;
    if (dataSource == "url") {
        reDataList = await dynamicUrlOperation(field);
    } else if (dataSource == "dict") {
        const dicts = await dictData(urlOrDictName);
        if (Object.keys(dicts).length == 0) {
            error(`数据字典:【${urlOrDictName}】可能未配置`);
        } else {
            reDataList = dicts;
        }
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
            value: item.value||"",
            operation: item.matchType,
        });
    });
    //自定义查询
    if (queryInfo) {
        requestParams.push(...queryInfo);
    }
    let url = temp.url;
    let params: any = {
        fieldList: requestParams
    };
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
        if (temp.httpMethod && temp.httpMethod.toUpperCase() === "GET") {
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
        validResult.data.forEach((item: any) => {
            const option: SelectOption = {
                name: item[labelName],
                value: item[valueName],
            };
            if (item.children?.length > 0) {
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
 * 公共Api接口
 * @param appName 应用名称
 * @param urlPrefix api接口前缀
 * @param condition 条件
 */
export function apiInstance(
    appName: string,
    urlPrefix: string,
    condition: Array<any> = [],
): ApiUrls {
    const prefix: string = `/${appName}/${urlPrefix}`;
    const apiUrls: ApiUrls = {
        basePrefix: prefix,
        appName: appName,
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
        uploadUrl: `${appName}/annex/upload/common`,
        modifyColumnsUrl: `${prefix}/modifyColumns`,
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
    return apiUrls;
}

/**
 * 模态窗口相关属性
 */
export function dialogPreps(
    title: string = "编辑",
    batchTitle: string = "批量编辑",
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
