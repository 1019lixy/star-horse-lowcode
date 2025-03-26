import {nextTick, reactive, Ref, ref} from "vue";
import {FieldInfo, PageFieldInfo} from "@/components/types/PageFieldInfo";
import {SelectOption} from "@/components/types/SearchProps";
import {dictData, loadData, searchMatchList} from "@/api/star_horse_utils.ts";
import {ascOrDesc, dataType, httpMethod, validDataUrl} from "@/api/system.ts";
import {error, success, warning} from "@/utils/message.ts";
import {useDesignFormStore} from "@/store/DesignForm.ts";
import piniaInstance from "@/store";
import {validRulesList} from "@/api/valid_utils.ts";
import {matchesType} from "react-dnd-html5-backend/dist/matchesType";

const designForm = useDesignFormStore(piniaInstance);

const helpMsg = `
    接口返回的数据格式必须是：
        {
        "data": {
            "pageSize": 0,
            "currentPage": 0,
            "totalDatas": 34,
            "totalPages": 4,
            "dataList": [ {} ]
        },
        "code": 0, //0 表示数据正常 
        "message": "success",
        "cnMessage": "操作成功"
    }或者：
    {
        "data":  [ {} ],
        "code": 0, //0 表示数据正常 
        "message": "success",
        "cnMessage": "操作成功"
    }
    `;

/**
 * 验证接口
 * @param formProps
 * @param dataSourceRef
 * @param recall
 * @param validForm
 */
export async function validInterface(
    formProps: Ref<any>,
    dataSourceRef: Ref<any>,
    recall: Function,
    validForm: boolean = true
) {
    let flag = false;
    let dataList: SelectOption[] = [];
    const refName = dataSourceRef?.value || dataSourceRef;
    if (!refName) {
        return false;
    }
    const temp = refName.getFormData().value;
    if (validForm) {
        await nextTick();
        await dataSourceRef?.value?.$refs.starHorseFormRef.validate((res: boolean) => {
            flag = res;
        });
        if (!flag) {
            return flag;
        }
        for (const key in temp) {
            formProps.value[key] = temp[key];
        }
    }
    const dataSource = temp["dataSource"];
    const urlOrDictName = temp["urlOrDictName"];
    const queryParams = temp["queryParams"];
    let validErrorMsg: string = "";
    let validSuccessMsg: string = "";
    if (dataSource == "url") {
        const requestParams = [] as any;
        queryParams?.forEach((item: any) => {
            if (!item.name) {
                return;
            }
            requestParams.push({
                propertyName: item.name,
                value: item.value,
                operation: item.matchType
            });
        });
        let url = temp["preinterfaceUrl"] + temp["interfaceUrl"];
        const params = {
            url: temp["interfaceUrl"],
            protocol: temp["protocol"],
            host: temp["host"],
            port: temp["port"],
            httpMethod: temp.httpMethod || "POST",
            dataType: temp.dataType || "JSON",
            env: temp["env"] || "",
            searchInfo: {
                fieldList: requestParams
            }
        };
        url = "/system-config/redirect/execute";
        const validResult = await loadData(url, params);
        if (validResult.error) {
            flag = false;
            validErrorMsg = validResult.error;
        } else {
            validSuccessMsg = "验证成功";
            dataList = validResult.data;
        }
    } else if (dataSource == "dict") {
        const dicts = await dictData(urlOrDictName);
        if (Object.keys(dicts).length == 0) {
            flag = false;
            validErrorMsg = "验证失败\n数据字典可能未配置";
        } else {
            dataList = dicts;
            validSuccessMsg = "验证成功";
        }
    } else {
        //静态数据
        const datas = temp["values"] as SelectOption[];
        if (Object.keys(datas).length == 0) {
            flag = false;
            validErrorMsg = "验证失败\n请设置数据";
        } else {
            dataList = datas;
            validSuccessMsg = "验证成功";
        }
    }
    if (recall) {
        recall(dataList, validSuccessMsg, validErrorMsg);
    }
    return flag;
}

/**
 * 创建数据
 * @param dataSourceRef
 * @param dataList
 * @param needDynamicData
 */
export function createData(dataSourceRef: any, dataList: any, needDynamicData: boolean = false) {
    const refName = dataSourceRef.value || dataSourceRef;
    const temp = refName.getFormData().value;
    let reDataList: SelectOption[] = [];
    const dataSource = temp["dataSource"];
    let errorMsg = "";
    if (dataSource == "data") {
        reDataList = dataList;
    } else {
        if (dataSource == "url") {
            const element = dataList[0];
            const keys = Object.keys(element);
            if (!keys.find((item) => item == temp["selectLabel"])) {
                errorMsg = "验证失败\n【标签名字段】错误：" + JSON.stringify(keys);
            } else if (!keys.find((item) => item == temp["selectValue"])) {
                errorMsg = "验证失败\n【标签值字段】错误：" + JSON.stringify(keys);
            } else {
                dataList.forEach((item: any) => {
                    reDataList.push({name: item[temp["selectLabel"]], value: item[temp["selectValue"]]});
                });
            }
        } else {
            reDataList = dataList;
        }
        if (!needDynamicData) {
            reDataList = [];
        }
    }
    return {
        reDataList,
        errorMsg
    };
}

const validOperation = async (val: any, dataSourceRef: Ref<any>, fieldList: Ref<any>, disableUrl: Ref<any>) => {
    await validInterface(
        val,
        dataSourceRef,
        (dataList: any, successMsg: string, errorMsg: string) => {
            if (dataList && !disableUrl.value) {
                const temp = dataList[0];
                const keys = Object.keys(temp);
                console.log(temp, keys);
                fieldList.value = [];
                for (const ind in keys) {
                    fieldList.value.push({name: keys[ind], value: keys[ind]});
                }
            }
            if (successMsg) {
                success(successMsg);
            }
            if (errorMsg) {
                error(errorMsg);
            }
            // if (recall) {
            //     recall(dataList, successMsg, errorMsg);
            // }
        },
        false
    );
};

/**
 * 数据源属性配置
 */
export function dataSourceFields(dataSourceRef: Ref<any>, envList: Array<SelectOption>, _recall: Function) {
    const dataSourceList: Array<SelectOption> = [
        {value: "url", name: "动态接口"},
        {value: "dict", name: "数据字典"},
        {value: "data", name: "静态数据"}
    ];

    const matchTypeList = searchMatchList();
    const disableData = ref<boolean>(false);
    const disableUrl = ref<boolean>(true);
    const disableDict = ref<boolean>(true);
    const dataRequired = ref<boolean>(true);
    const urlRequired = ref<boolean>(false);
    const dictRequired = ref<boolean>(false);
    const currentTabName = ref<string>("data");
    const fieldList = ref<SelectOption[]>([]);
    return reactive<PageFieldInfo | any>({
        fieldList: [
            [
                {
                    label: "表单属性",
                    fieldName: "label",
                    type: "tag",
                    formVisible: true,
                    listVisible: true,
                    preps: {
                        colspan: 8
                    }
                },
                {
                    label: "数据源类型",
                    fieldName: "dataSource",
                    type: "radio",
                    required: true,
                    formVisible: true,
                    listVisible: true,
                    defaultValue: "data",
                    optionList: dataSourceList,
                    actionName: "change",
                    actions: (val: any) => {
                        console.log(val);
                        const type = val["dataSource"];
                        disableData.value = true;
                        disableUrl.value = true;
                        disableDict.value = true;
                        dataRequired.value = false;
                        urlRequired.value = false;
                        dictRequired.value = false;
                        currentTabName.value = type;
                        if (type == "url") {
                            disableUrl.value = false;
                            urlRequired.value = true;
                        } else if (type == "data") {
                            disableData.value = false;
                            dataRequired.value = true;
                        } else if (type == "dict") {
                            disableDict.value = false;
                            dictRequired.value = true;
                        }
                    }
                }
            ],
            {
                fieldName: currentTabName,
                tabList: [
                    {
                        title: "静态数据",
                        tabName: "data",
                        disabled: disableData,
                        batchFieldList: [
                            {
                                batchName: "values",
                                fieldList: [
                                    {
                                        label: "属性名",
                                        fieldName: "name",
                                        type: "input",
                                        required: dataRequired,
                                        formVisible: true,
                                        listVisible: true
                                    },
                                    {
                                        label: "属性值",
                                        fieldName: "value",
                                        type: "input",
                                        required: dataRequired,
                                        formVisible: true,
                                        listVisible: true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: "动态接口参数",
                        tabName: "url",
                        disabled: disableUrl,
                        fieldList: [
                            [
                                {
                                    label: "系统环境",
                                    fieldName: "env",
                                    type: "select",
                                    required: urlRequired,
                                    defaultValue: "",
                                    formVisible: true,
                                    listVisible: true,
                                    optionList: envList
                                },
                                {
                                    label: "请求方式",
                                    fieldName: "httpMethod",
                                    type: "select",
                                    required: urlRequired,
                                    defaultValue: "POST",
                                    formVisible: true,
                                    listVisible: true,
                                    optionList: httpMethod()
                                },
                                {
                                    label: "协议",
                                    fieldName: "protocol",
                                    type: "select",
                                    required: urlRequired,
                                    defaultValue: "http",
                                    formVisible: true,
                                    listVisible: true,
                                    optionList: [
                                        {name: "HTTP", value: "http"},
                                        {name: "HTTPS", value: "https"}
                                    ]
                                }
                            ],
                            [
                                {
                                    label: "IP/域名/服务名",
                                    fieldName: "host",
                                    type: "input",
                                    required: urlRequired,
                                    formVisible: true,
                                    listVisible: true,
                                    preps: {
                                        colspan: 16
                                    }
                                },
                                {
                                    label: "端口",
                                    fieldName: "port",
                                    type: "number",
                                    min: 1,
                                    max: 65535,
                                    formVisible: true,
                                    listVisible: true,
                                    preps: {
                                        colspan: 8
                                    }
                                }
                            ],
                            {
                                label: "接口地址",
                                fieldName: "interfaceUrl",
                                type: "input",
                                required: urlRequired,
                                helpMsg: helpMsg,
                                formVisible: true,
                                preps: {
                                    appendAction: {
                                        icon: "valid",
                                        actions: async (val: any) => {
                                            await validOperation(val, dataSourceRef, fieldList, disableUrl);
                                        }
                                    }
                                }
                            },
                            [
                                {
                                    label: "标签名字段",
                                    fieldName: "selectLabel",
                                    type: "select",
                                    optionList: fieldList,
                                    required: urlRequired,
                                    formVisible: true,
                                    listVisible: true
                                },
                                {
                                    label: "标签值字段",
                                    fieldName: "selectValue",
                                    type: "select",
                                    optionList: fieldList,
                                    required: urlRequired,
                                    formVisible: true,
                                    listVisible: true
                                }
                            ]
                        ],
                        batchFieldList: [
                            {
                                batchName: "queryParams",
                                title: "参数",
                                fieldList: [
                                    {
                                        label: "参数名",
                                        fieldName: "name",
                                        type: "select",
                                        optionList: fieldList,
                                        required: urlRequired,
                                        formVisible: true,
                                        listVisible: true
                                    },
                                    {
                                        label: "参数值",
                                        fieldName: "value",
                                        type: "input",
                                        required: urlRequired,
                                        formVisible: true,
                                        listVisible: true
                                    },
                                    {
                                        label: "匹配方式",
                                        fieldName: "matchType",
                                        type: "select",
                                        defaultValue: "eq",
                                        required: urlRequired,
                                        formVisible: true,
                                        listVisible: true,
                                        optionList: matchTypeList
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: "数据字典",
                        tabName: "dict",
                        disabled: disableDict,
                        fieldList: [
                            {
                                label: "字典名称",
                                fieldName: "urlOrDictName",
                                type: "input",
                                required: dictRequired,
                                formVisible: true,
                                listVisible: true,
                                preps: {
                                    appendAction: {
                                        icon: "valid",
                                        actionTitle: "验证",
                                        actions: async (val: any) => {
                                            await validOperation(val, dataSourceRef, fieldList, disableUrl);
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    });
}

const urlBaseInfo: FieldInfo[] = [
    {
        fieldName: "preinterfaceUrl",
        type: "input",
        formVisible: false,
        defaultValue: "http://",
        preps: {
            colspan: -1
        }
    },
    {
        label: "接口地址",
        fieldName: "interfaceUrl",
        type: "input",
        required: true,
        helpMsg: helpMsg,
        formVisible: true,
        preps: {
            colspan: 24,
            prependList: [
                {name: "HTTP://", value: "http://"},
                {name: "HTTPS://", value: "https://"}
            ]
        }
    }
];

/**
 * 组件参数属性配置
 * @param fieldName
 * @param item
 */
export function urlFields() {
    const fields: Array<any> = [];
    const fieldList = ref<SelectOption[]>([]);

    const dataUrls: FieldInfo[] = [
        {
            label: "请求方式",
            fieldName: "httpMethod",
            type: "select",
            defaultValue: "POST",
            required: true,
            optionList: httpMethod(),
            formVisible: true,
            preps: {
                colspan: 10
            }
        },
        {
            label: "请求数据格式",
            fieldName: "dataType",
            type: "select",
            defaultValue: "JSON",
            formVisible: true,
            required: true,
            optionList: dataType(),
            preps: {
                colspan: 10
            }
        },
        {
            label: "验证",
            fieldName: "urlValid",
            type: "button",
            preps: {
                icon: "valid",
                actionTitle: "验证",
                colspan: 4
            },
            actions: async (val: any) => {
                if (!val["interfaceUrl"]) {
                    return;
                }
                const url = val["preinterfaceUrl"] + val["interfaceUrl"];
                const result = await validDataUrl(url, {});
                const datas: any = result.data;
                const error = result.error;
                if (error) {
                    warning(error);
                    return;
                }
                const data = datas[0];
                const keys = Object.keys(data);
                fieldList.value = [];
                for (const ind in keys) {
                    fieldList.value.push({name: keys[ind], value: keys[ind]});
                }
            },
            required: true,
            formVisible: true,
        }
    ];
    const orderBys: FieldInfo[] = [
        {
            label: "列名",
            fieldName: "fieldName",
            type: "input",
            formVisible: true
        },
        {
            label: "排序",
            fieldName: "ascOrDesc",
            type: "select",
            formVisible: true,
            optionList: ascOrDesc()
        }
    ];

    const needFields: FieldInfo[] = [
        {
            label: "原属性名",
            fieldName: "sourceField",
            type: "select",
            optionList: fieldList,
            formVisible: true
        },
        {
            label: "目标属性名",
            fieldName: "distField",
            type: "input",
            formVisible: true
        }
    ];
    //需考虑或查询
    const paramFields: FieldInfo[] = [
        {
            batchFieldList: [{
                batchName: "queryParams",
                fieldList: [{
                    label: "动态参数",
                    helpMsg: "设置为动态参数后，参数值将从当前表单数据中获取",
                    fieldName: "isDynamicParam",
                    type: "switch",
                    defaultValue: "N",
                    formVisible: true
                },
                    {
                        label: "参数名",
                        fieldName: "paramName",
                        required: true,
                        type: "input",
                        formVisible: true
                    },
                    {
                        label: "匹配方式",
                        fieldName: "matchType",
                        type: "select",
                        defaultValue: "eq",
                        formVisible: true,
                        optionList: searchMatchList()
                    },
                    {
                        label: "参数值",
                        fieldName: "paramValue",
                        type: "textarea",
                        formVisible: true
                    },]
            }]
        }
    ];

    fields.push(urlBaseInfo);
    fields.push(dataUrls);

    const tabInfo = {
        fieldName: "params",
        tabList: [
            {
                title: "接口参数",
                tabName: "params",
                objectName: "params",
                fieldList: paramFields
            },
            {
                title: "返回字段映射",
                tabName: "needField",
                objectName: "needField",
                fieldList: needFields
            },
            {
                title: "返回数据排序",
                tabName: "orderBy",
                objectName: "orderBy",
                fieldList: orderBys
            }
        ]
    };
    fields.push(tabInfo);
    return fields;


}

/**
 * 组件参数属性配置
 * @param fieldName
 * @param item
 */
export function paramsFields(paramsConfigRef: Ref<any>, fieldName: string, item: any, returnField: boolean = false) {
    let datas: any = [];
    if (Object.entries(item).length > 0) {
        datas = [...item["advancedFields"], ...item["fields"]];
    }
    const disableUrl = ref<boolean>(false);
    let currentData: Array<any> = [];
    datas?.forEach((item) => {
        if (item.fieldName == fieldName) {
            currentData = item.configParams;
            return false;
        }
    });
    const fields: Array<any> = [];
    const fieldList = ref<SelectOption[]>([]);
    const dataUrls: FieldInfo[] = [
        [
            {
                label: "系统环境",
                fieldName: "env",
                type: "select",
                required: true,
                defaultValue: "",
                formVisible: true,
                listVisible: true,
                preps: {
                    dataSource: "dict",
                    urlOrDictName: "system_environment"
                }
            },
            {
                label: "请求方式",
                fieldName: "httpMethod",
                type: "select",
                required: true,
                defaultValue: "POST",
                formVisible: true,
                listVisible: true,
                optionList: httpMethod()
            },
            {
                label: "协议",
                fieldName: "protocol",
                type: "select",
                required: true,
                defaultValue: "http",
                formVisible: true,
                listVisible: true,
                optionList: [
                    {name: "HTTP", value: "http"},
                    {name: "HTTPS", value: "https"}
                ]
            }
        ],
        [
            {
                label: "IP/域名/服务名",
                fieldName: "host",
                type: "input",
                required: true,
                formVisible: true,
                listVisible: true,
                preps: {
                    colspan: 16
                }
            },
            {
                label: "端口",
                fieldName: "port",
                type: "number",
                min: 1,
                max: 65535,
                formVisible: true,
                listVisible: true,
                preps: {
                    colspan: 8
                }
            }
        ],
        [{
            label: "接口地址",
            fieldName: "interfaceUrl",
            type: "input",
            required: true,
            helpMsg: helpMsg,
            formVisible: true,
            preps: {
                appendAction: {
                    icon: "valid",
                    actions: async (val: any) => {
                        val["dataSource"] = "url";
                        await validOperation(val, paramsConfigRef, fieldList, disableUrl);
                        console.log(fieldList.value)
                    }
                },
                colspan: 16,
            }
        }, {
            label: "主键",
            fieldName: "primaryKey",
            type: "select",
            required: true,
            optionList: fieldList,
            formVisible: true,
            preps: {
                colspan: 8
            }
        },]
    ];
    const orderBys: FieldInfo[] = [
        {
            label: "列名",
            fieldName: "fieldName",
            type: "input",
            formVisible: true
        },
        {
            label: "排序",
            fieldName: "ascOrDesc",
            type: "select",
            formVisible: true,
            optionList: ascOrDesc()
        }
    ];
    const fieldLists: FieldInfo[] = [
        {
            label: "列名",
            fieldName: "label",
            type: "input",
            formVisible: true
        },
        {
            label: "属性名称",
            fieldName: "fieldName",
            type: "select",
            allowCreate: true,
            optionList: fieldList,
            formVisible: true
        },
        {
            label: "搜索显示",
            fieldName: "searchFlag",
            type: "switch",
            defaultValue: "Y",
            formVisible: true
        }
    ];
    const needFields: FieldInfo[] = [
        {
            label: "原属性名",
            fieldName: "sourceField",
            type: "select",
            optionList: fieldList,
            formVisible: true
        },
        {
            label: "目标属性名",
            fieldName: "distField",
            type: "input",
            formVisible: true
        }
    ];
    const otherField: FieldInfo[] = [];
    const fieldInfos: string[] = ["dataUrl", "orderby", "fieldList", "needField"];
    for (const index in currentData) {
        const temp = currentData[index];
        if (!fieldInfos.includes(temp.fieldName)) {
            otherField.push({
                label: temp.label,
                fieldName: temp.fieldName,
                type: "input",
                listVisible: true
            });
        }
    }
    // fields.push(urlBaseInfo);
    fields.push(...dataUrls);
    if (otherField) {
        fields.push(...otherField);
    }
    const tabInfo = {
        fieldName: "fieldLists",
        batchFieldList: [
            {
                title: "显示属性",
                tabName: "fieldLists",
                batchName: "fieldLists",
                fieldList: fieldLists
            },
            {
                title: "回调字段",
                tabName: "needField",
                batchName: "needField",
                fieldList: needFields
            },
            {
                title: "数据排序",
                tabName: "orderBy",
                batchName: "orderBy",
                fieldList: orderBys
            }
        ]
    };
    fields.push(tabInfo);
    if (returnField) {
        return fields;
    } else {
        return reactive<PageFieldInfo | any>({
            fieldList: fields
        });
    }
}

/**
 * 容器属性
 */
export function containerField(fieldName: string) {
    const tabFields = {
        title: "Tab属性",
        tabName: "tab",
        batchFieldList: [
            {
                batchName: "elements",
                fieldList: [
                    {
                        label: "Tab名字",
                        fieldName: "label",
                        type: "input",
                        required: true,
                        formVisible: true,
                        listVisible: true
                    },
                    {
                        label: "主键",
                        fieldName: "tabName",
                        helpMsg: `默认作为tab组件的名称，
                当设置对应关系时,系统作为表的主键`,
                        type: "input",
                        required: true,
                        formVisible: true,
                        listVisible: true
                    },
                    {
                        label: "对象名字",
                        fieldName: "objectName",
                        type: "input",
                        required: true,
                        formVisible: true,
                        listVisible: true
                    },
                    {
                        label: "是否子表",
                        fieldName: "subFormFlag",
                        type: "switch",
                        defaultValue: "Y",
                        required: true,
                        formVisible: true,
                        listVisible: true
                    }
                ]
            }
        ]
    };
    const collapseFields = {
        title: "Collapse属性",
        tabName: "collapse",
        batchFieldList: [
            {
                batchName: "elements",
                fieldList: [
                    {
                        label: "Collapse名字",
                        fieldName: "label",
                        type: "input",
                        required: true,
                        formVisible: true,
                        listVisible: true
                    },
                    {
                        label: "主键",
                        fieldName: "tabName",
                        helpMsg: `默认作为Collapse组件的名称，
                当设置对应关系时,系统作为表的主键`,
                        type: "input",
                        required: true,
                        formVisible: true,
                        listVisible: true
                    },
                    {
                        label: "对象名字",
                        fieldName: "objectName",
                        type: "input",
                        required: true,
                        formVisible: true,
                        listVisible: true
                    },
                    {
                        label: "是否子表",
                        fieldName: "subFormFlag",
                        type: "switch",
                        defaultValue: "Y",
                        required: true,
                        formVisible: true,
                        listVisible: true
                    }
                ]
            }
        ]
    };
    const cardFields = {
        title: "Card属性",
        tabName: "card",
        batchFieldList: [
            {
                batchName: "elements",
                fieldList: [
                    {
                        label: "Card名字",
                        fieldName: "title",
                        type: "input",
                        required: true,
                        formVisible: true,
                        listVisible: true
                    },
                    {
                        label: "主键",
                        fieldName: "tabName",
                        helpMsg: `默认作为Card组件的名称，
                当设置对应关系时,系统作为表的主键`,
                        type: "input",
                        required: true,
                        formVisible: true,
                        listVisible: true
                    },
                    {
                        label: "对象名字",
                        fieldName: "objectName",
                        type: "input",
                        required: true,
                        formVisible: true,
                        listVisible: true
                    },
                    {
                        label: "是否子表",
                        fieldName: "subFormFlag",
                        type: "switch",
                        defaultValue: "Y",
                        required: true,
                        formVisible: true,
                        listVisible: true
                    }
                ]
            }
        ]
    };

    const boxFields = {
        title: "栅格属性",
        tabName: "box",
        batchFieldList: [
            {
                batchName: "elements",
                fieldList: [
                    {
                        label: "列",
                        fieldName: "colIndex",
                        type: "input",
                        required: true,
                        formVisible: true,
                        listVisible: true,
                        batchFieldList: [
                            {
                                batchName: "columns",
                                batchDefaultData: {items: []},
                                fieldList: [
                                    {
                                        label: "列宽",
                                        fieldName: "colspan",
                                        type: "number",
                                        defaultValue: 24,
                                        required: true,
                                        formVisible: true,
                                        listVisible: true,
                                        actionName: "change",
                                        preps: {
                                            min: 1,
                                            max: 24,
                                            step: 4
                                        },
                                        actions: (val: any, type: string) => {
                                            const obj = val.value || val;
                                            const cols = obj.columns;
                                            if (type == "oper") {
                                                const len = 24 / cols.length;
                                                cols.forEach((item: any) => {
                                                    item.colspan = len;
                                                });
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
    const dyTableFields = {
        title: "动态表格属性",
        tabName: "dytable",
        batchFieldList: [
            {
                batchName: "elements",
                fieldList: [
                    {
                        label: "列",
                        fieldName: "colIndex",
                        type: "input",
                        required: true,
                        formVisible: true,
                        listVisible: true,
                        batchFieldList: [
                            {
                                batchName: "columns",
                                batchDefaultData: {items: []},
                                fieldList: [
                                    {
                                        label: "列宽",
                                        fieldName: "colWidth",
                                        type: "number",
                                        defaultValue: 100,
                                        required: true,
                                        formVisible: true,
                                        listVisible: true,
                                        actionName: "change",
                                        preps: {
                                            min: 10,
                                            max: 100,
                                            step: 2
                                        },
                                        actions: (val: any, type: string) => {
                                            const obj = val.value || val;
                                            const cols = obj.columns;
                                            if (type == "oper") {
                                                const len = 100 / cols.length;
                                                cols.forEach((item: any) => {
                                                    item.colWidth = len;
                                                });
                                            }
                                        }
                                    },
                                    {
                                        label: "行高",
                                        fieldName: "colHeight",
                                        type: "number",
                                        defaultValue: 30,
                                        required: true,
                                        formVisible: true,
                                        listVisible: true,
                                        actionName: "change",
                                        preps: {
                                            min: 30,
                                            max: 100,
                                            step: 1
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
    const fields: any = {
        tab: tabFields,
        collapse: collapseFields,
        card: cardFields,
        box: boxFields,
        dytable: dyTableFields
    };
    return reactive<PageFieldInfo | any>({
        fieldList: [
            {
                fieldName: fieldName,
                tabList: [fields[fieldName]]
            }
        ]
    });
}

const fieldMap: any = reactive({
    form: {
        title: "动态表单",
        tabName: "form",
        fieldList: [
            {
                label: "表单名称",
                fieldName: "formName",
                aliasName: "idDynamicForm",
                type: "dialog-input",
                required: true,
                formVisible: true,
                listVisible: true,
                params: {
                    primaryKey: "idDynamicForm",
                    dataUrl: {
                        pageListUrl: "userdb-manage/userdb/dynamicForm/pageList",
                    },
                    needField: [
                        {sourceField: "formName", distField: "formName"},
                        {sourceField: "dataNo", distField: "idDynamicForm"}
                    ],

                    fieldList: [{
                        label: "表单名称",
                        fieldName: "formName",
                        searchVisible: true,
                        formVisible: true,
                        listVisible: true
                    },
                        {
                            label: "表名",
                            fieldName: "tbName",
                            searchVisible: true,
                            formVisible: true,
                            listVisible: true
                        },
                        {
                            label: "主键",
                            fieldName: "formId",
                            formVisible: true,
                            listVisible: true
                        },
                        {
                            label: "数据源",
                            fieldName: "datasourceConfigId",
                            type: "select",
                            formVisible: true,
                            listVisible: true
                        }]
                },
            }
        ]
    },
    comp: {
        title: "组件",
        tabName: "comp",
        fieldList: [
            {
                label: "组件名称",
                fieldName: "componentName",
                type: "input",
                required: true,
                formVisible: true,
                listVisible: true
            }
        ]
    },
    inter: {
        title: "接口信息",
        tabName: "interface",
        fieldList: urlFields()
    },
    method: {
        title: "函数",
        tabName: "method",
        fieldList: [
            {
                label: "函数名称",
                fieldName: "method",
                type: "input",
                required: true,
                formVisible: true,
                listVisible: true
            }
        ]
    },
    code: {
        title: "代码块",
        tabName: "code",
        fieldList: [
            {
                label: "函数名称",
                fieldName: "StarHorseEditor",
                type: "usercomp",
                required: true,
                formVisible: true,
                listVisible: true
            }
        ]
    }
});
let currentField = ref<FieldInfo[]>([fieldMap["form"]]);

export function buttonClickDataField() {
    const eventList: SelectOption[] = [
        {name: "动态表单", value: "form"},
        {name: "调用组件", value: "comp"},
        {name: "调用接口", value: "inter"},
        {name: "执行函数", value: "method"},
        {name: "执行代码块", value: "code"},
    ];
    return reactive<PageFieldInfo>({
        fieldList: [
            {
                label: "响应内容",
                fieldName: "viewType",
                type: "radio",
                optionList: eventList,
                required: true,
                defaultValue: "form",
                formVisible: true,
                listVisible: true,
                actionName: "change",
                actions: (val: any) => {
                    const viewType = val.viewType;
                    if (viewType) {
                        currentField.value = [fieldMap[viewType]];
                    }
                }
            },
            {
                cardList: currentField
            }
        ]
    });
}

/**
 * 关联
 */
export function relationDataField() {
    const fields: SelectOption[] = designForm.loadCompNames();
    const eventList: SelectOption[] = [
        {name: "Change", value: "change"},
        {name: "Input", value: "input"}
    ];
    const controlConditionList: SelectOption[] = [
        {name: "选中/输入的值作为查询条件", value: "query"},
        {name: "选中/输入的值等于指定值禁用", value: "eqDisable"},
        {name: "选中/输入的值等于指定值禁用否则可编辑", value: "eqDisableOrEditable"},
        {name: "选中/输入的值等于指定值可编辑", value: "eqEditable"},
        {name: "选中/输入的值等于指定值可编辑否则禁用", value: "eqEditableOrDisable"},
        {name: "选中/输入的值等于指定值时赋予新值", value: "assignValue"},
        {name: "选中/输入的值等于指定值时改变字段类型", value: "changeType"}
    ];
    const fieldType = ref<string>("input");
    // let matchType = ref<boolean>(false);
    return reactive<PageFieldInfo | any>({
        fieldList: [
            {
                label: "触发事件",
                fieldName: "actionName",
                type: "select",
                optionList: eventList,
                defaultValue: "change",
                required: true,
                formVisible: true,
                listVisible: true
            },
            {
                batchFieldList: [
                    {
                        staticData: "Y",
                        batchName: "relationDetails",
                        fieldList: [
                            {
                                label: "控制条件",
                                fieldName: "controlCondition",
                                type: "select",
                                optionList: controlConditionList,
                                required: true,
                                changeName: "change",
                                actions: (val: any) => {
                                    // matchType.value = false;
                                    val["_matchTypeEditable"] = false;
                                    delete val["_paramsType"];
                                    const temp = val["controlCondition"];
                                    if (temp == "assignValue") {
                                        val["_paramsType"] = "json";
                                    } else if (temp == "query") {
                                        val["_matchTypeEditable"] = true;
                                    }
                                },
                                formVisible: true,
                                listVisible: true
                            },
                            {
                                label: "被控制属性",
                                fieldName: "relationFields",
                                type: "tselect",
                                optionList: fields,
                                required: true,
                                formVisible: true,
                                listVisible: true,
                                preps: {
                                    checkStrictly: "Y"
                                }
                            },
                            {
                                label: "匹配条件",
                                fieldName: "matchType",
                                type: "select",
                                optionList: searchMatchList(),
                                defaultValue: "eq",
                                required: false,
                                disabled: "Y",
                                formVisible: true,
                                listVisible: true
                            },
                            {
                                label: "参数",
                                fieldName: "params",
                                type: fieldType,
                                required: false,
                                helpMsg: "1、如果是作为查询条件，则填写参数名称；\n2、如果是等于某个值，则填写具体的值；",
                                formVisible: true,
                                listVisible: true
                            }
                        ]
                    }
                ]
            }
        ]
    });
}

const listPrototypeVisible = ref<boolean>(false);

/**
 * 定义所有组件的公共属性
 */
export function compCommonFields(customerValid: Function): FieldInfo[] {
    return reactive<FieldInfo[]>([
        {
            label: "标签名称",
            fieldName: "label",
            type: "input",
            required: true,
            formVisible: true
        },
        {
            label: "属性名称",
            fieldName: "name",
            required: true,
            type: "input",
            formVisible: true
        },

        {
            label: "数据长度",
            fieldName: "maxLength",
            required: true,
            defaultValue: 100,
            type: "number",
            formVisible: true
        },
        {
            label: "校验规则",
            fieldName: "rules",
            defaultValue: [],
            type: "select",
            optionList: validRulesList,
            formVisible: true,
            actionName: "change",
            actions: (val: any) => {
                if (val?.rules?.includes("custom")) {
                    customerValid(val);
                }
            },
            preps: {
                multiple: "Y"
            }
        },
        {
            label: "表单显示",
            fieldName: "formVisible",
            type: "switch",
            defaultValue: "Y",
            formVisible: true
        },
        {
            label: "查询显示",
            fieldName: "searchVisible",
            type: "switch",
            defaultValue: "N",
            formVisible: true
        },
        {
            label: "列表显示",
            fieldName: "listVisible",
            type: "switch",
            defaultValue: "Y",
            formVisible: true
        },
        {
            label: "查看显示",
            fieldName: "viewVisible",
            type: "switch",
            defaultValue: "Y",
            formVisible: true
        },
        {
            label: "隐藏标签",
            fieldName: "hideLabel",
            type: "switch",
            defaultValue: "N",
            formVisible: true
        },
        {
            label: "是否必须",
            fieldName: "required",
            type: "switch",
            defaultValue: "N",
            formVisible: true
        },
        {
            label: "全局禁用",
            fieldName: "disabled",
            type: "switch",
            defaultValue: "N",
            formVisible: true
        },
        {
            label: "修改禁用",
            fieldName: "editDisabled",
            type: "switch",
            defaultValue: "N",
            formVisible: true
        },
        {
            label: "可清除",
            fieldName: "clearable",
            type: "switch",
            defaultValue: "Y",
            formVisible: true
        },
        {
            label: "只读",
            fieldName: "readonly",
            type: "switch",
            defaultValue: "N",
            formVisible: true
        },
        {
            label: "组件原样显示",
            helpMsg: "在列表上原样显示组件,\n此属性开启可能会导致列表数据加载缓慢",
            fieldName: "prototypeDisplay",
            type: "switch",
            defaultValue: "N",
            actionName: "change",
            actions: (val: any) => {
                if (val.prototypeDisplay == "Y") {
                    val["listPrototypeDisplay"] = "Y";
                    listPrototypeVisible.value = true;
                } else {
                    listPrototypeVisible.value = false;
                    val["listPrototypeDisplay"] = "N";
                }
            },
            formVisible: true
        },
        {
            label: "组件值",
            helpMsg: "可指定显示为什么组件",
            fieldName: "listPrototypeDisplay",
            type: "input",
            defaultValue: "N",
            formVisible: listPrototypeVisible
        },
        {
            label: "唯一性校验",
            fieldName: "uniqueValid",
            type: "switch",
            helpMsg: "如果开启此功能，\n在新增数据时系统对数据进行唯一性校验。",
            defaultValue: "N",
            formVisible: true
        },
        {
            label: "提示信息",
            fieldName: "helpMsg",
            type: "textarea",
            formVisible: true
        }
    ]);
}
