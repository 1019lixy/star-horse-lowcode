import {getValidType} from "@/api/valid_utils";
import {unref} from "vue";
import {i18n} from "@/lang";
import {BatchFieldInfo, FieldInfo, PageFieldInfo, SearchProps} from "@/components/types";
import {uuid} from "@/api/system";
import {commonField} from "@/api/star_horse_utils";
import {isMobile} from "@/api/device";
// 定义已显式列出的属性
const listedFields: string[] = [
    "label",
    "name",
    "itemType",
    "formVisible",
    "listVisible",
    "viewVisible",
    "searchVisible",
    "required",
    "actions",
    "helpMsg",
    "listPrototypeDisplay",
    "defaultVisible",
    "defaultValue",
    "prefix",
    "disabled",
    "editDisabled",
    "id",
    "itemNameLabel",
    "elements"
];
const commonFields: FieldInfo[] = commonField();
const createContainer = (item: any, children: any) => {
    return {
        name: item.label ?? item.preps?.label ?? item.preps?.itemNameLabel,
        value: item.preps?.name ?? item.tabName ?? item.objectName,
        id: item.id ?? item.preps?.id ?? uuid(),
        type: item.itemType,
        compType: "container",
        children: children,
    };
};
const mergeObjects = (target: Record<string, any>, source: Record<string, any>) => {
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
    return target;
};
const hasKeys = (obj: Record<string, any>) => {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return true;
        }
    }
    return false;
};
const filterPreps = (preps: Record<string, any>) => {
    const remainingPreps: Record<string, any> = {};
    for (const [key, value] of Object.entries(preps)) {
        if (!listedFields.includes(key) && value) {
            remainingPreps[key] = value;
        }
    }
    return remainingPreps;
};
/**
 * 解析box和dytable 容器
 * @param item
 */
const boxDytableAnalysis = (item: any) => {
    const elements = item.preps.elements;
    const boxItems: Record<string, any> = {};
    const children: Array<any> = [];
    const fieldList: FieldInfo[] | any = [];
    const searchItemList: SearchProps[] | any = [];
    elements?.forEach(row => {
        const columnItems: FieldInfo[] | any = [];
        row.columns?.forEach(column => {
            const colHeight = column.colHeight;
            const colWidth = column.colWidth;
            const colspan = column.colspan;
            const rowspan = column.rowspan;
            const cellVisible = column.cellVisible;
            const currentColumnItems: FieldInfo[] | any = [];
            column?.items?.forEach((temp: any) => {
                const {item, fieldInfo, layerItem, searchItem} = itemAnalysis(temp);
                mergeObjects(boxItems, item);
                children.push(layerItem);
                if (!fieldInfo.preps) {
                    fieldInfo.preps = {};
                }
                fieldInfo.preps["colHeight"] = colHeight;
                fieldInfo.preps["colWidth"] = colWidth;
                fieldInfo.preps["colspan"] = colspan;
                fieldInfo.preps["rowspan"] = rowspan;
                fieldInfo.preps["cellVisible"] = cellVisible;
                currentColumnItems.push(fieldInfo);
                if (hasKeys(searchItem)) {
                    searchItemList.push(searchItem);
                }
            });
            const len = column?.items?.length;
            if (len > 1) {
                columnItems.push(currentColumnItems);
            } else if (len == 1) {
                columnItems.push(currentColumnItems[0]);
            } else {
                columnItems.push({
                    type: "empty",
                    viewVisible: true,
                    formVisible: false,
                    preps: {
                        colspan: colspan,
                        rowspan: rowspan,
                        colHeight: colHeight,
                        colWidth: colWidth,
                        cellVisible: cellVisible,
                    },
                });
            }
        });
        fieldList.push(columnItems);
    });
    const currentLayerContainer = createContainer(item, children);
    boxItems[currentLayerContainer.id] = item;
    return {currentLayerContainer, boxItems, fieldList, searchItemList};
};
/**
 * 解析table 容器
 * @param item
 */
const tableAnalysis = (item: any) => {
    const elements = item.preps.elements;
    const boxItems: Record<string, any> = {};
    const children: Array<any> = [];
    const batchFieldInfos: BatchFieldInfo[] = [];
    const columnsList: FieldInfo[] | any = [];
    const searchItemList: SearchProps[] | any = [];
    for (const index in elements) {
        const element = elements[index];
        element?.items?.forEach((temp: any) => {
            const {item, fieldInfo, layerItem, searchItem} = itemAnalysis(temp);
            mergeObjects(boxItems, item);
            children.push(layerItem);
            columnsList.push(fieldInfo);
            if (hasKeys(searchItem)) {
                searchItemList.push(searchItem);
            }
        });
    }
    batchFieldInfos.push({
        batchName: item.batchName,
        disabled: item.disabled,
        disVisible: item.disVisible,
        title: item.preps?.label ?? item.preps?.itemNameLabel,
        helpMsg: item.preps?.helpMsg,
        fieldList: columnsList,
    });
    const fieldList: FieldInfo | any = {
        batchFieldList: batchFieldInfos,
    };
    const currentLayerContainer = createContainer(item, children);
    boxItems[currentLayerContainer.id] = item;
    return {currentLayerContainer, boxItems, fieldList, searchItemList};
};
/**
 * 解析tab,collapse,card,splitter?
 * @param item
 */
const tabColapseCardAnalysis = (item: any) => {
    const elements = item.preps.elements;
    const currentLayerContainerList: Array<any> = [];
    const boxItems: Record<string, any> = {};
    let fieldInfo: FieldInfo | any = {};
    const searchItemList2: SearchProps[] | any = [];
    const dataList: Array<any> = [];
    for (const index in elements) {
        const element = elements[index];
        const {selectList, compListResult, fieldList, searchItemList} =
            analysisCompDatas(element.items);
        mergeObjects(boxItems, compListResult);
        const innerLayer = createContainer(element, selectList);
        boxItems[innerLayer.id] = element;
        currentLayerContainerList.push(innerLayer);
        dataList.push({
            tabName: element.tabName,
            objectName: element.objectName,
            subFormFlag: element.subFormFlag,
            mapping: element.mapping,
            title: element.label || element.title,
            id: element.id,
            height: element.height,
            fieldList: fieldList,
        });
        if (searchItemList?.length > 0) {
            searchItemList2.push(...searchItemList);
        }
    }
    if (dataList?.length > 0) {
        fieldInfo.fieldName = dataList[0].tabName;
    }
    if (item.itemType == "tab") {
        fieldInfo.tabList = dataList;
    } else if (item.itemType == "card") {
        fieldInfo.cardList = dataList;
    } else if (item.itemType == "collapse") {
        fieldInfo.collapseList = dataList;
    } else if (item.itemType == "splitter") {
        fieldInfo.splitterList = dataList;
    } else {
        console.error("Unknown itemType: ", item.itemType);
    }
    const currentLayerContainer = createContainer(
        item,
        currentLayerContainerList,
    );
    boxItems[currentLayerContainer.id] = item;
    return {
        currentLayerContainer,
        boxItems,
        fieldList: fieldInfo,
        searchItemList: searchItemList2,
    };
};
/**
 * 直接解析字段
 * @param item
 */
const itemAnalysis = (item: any) => {
    const preps = item.preps;
    const remainingPreps = filterPreps(preps);
    const fieldInfo: FieldInfo = {
        label: preps.label,
        fieldName: preps.name,
        type: item.itemType,
        formVisible: preps.formVisible,
        listVisible: preps.listVisible,
        viewVisible: preps.viewVisible,
        required: preps.required,
        actions: preps.actions,
        helpMsg: preps.helpMsg,
        listPrototypeDisplay: preps.listPrototypeDisplay,
        defaultValue: preps.defaultValue,
        prefix: preps.prefix,
        disabled: preps.disabled,
        editDisabled: preps.editDisabled,
        id: preps.id,
        preps: remainingPreps,
    };
    const layerItem: any = {
        name: item.preps?.label,
        id: item.preps?.id,
        compType: "item",
        type: item.preps?.itemType,
        value: item.preps?.name,
    };
    let searchItem: SearchProps = {};
    if (preps.searchVisible) {
        searchItem = {
            fieldName: preps.name,
            label: preps.label,
            defaultValue: preps.defaultValue || "",
            defaultVisible: preps.defaultVisible || false,
            preps: remainingPreps,
        };
    }
    const record: Record<string, any> = {};
    record[item.preps?.id] = item;
    return {item: record, fieldInfo, layerItem, searchItem};
};
/**
 * 解析表单字段信息及层级
 */
export const analysisCompDatas = (dataList: any) => {
    const selectList: Array<any> = [];
    const compListResult: Record<string, any> = {};
    const compList = unref(dataList);
    const compFieldList: FieldInfo[] = [];
    const searchFieldList: SearchProps[] = [];

    if (!compList?.length) {
        return {selectList, compListResult, compFieldList, fieldList: [], searchFieldList};
    }

    for (let i = 0; i < compList.length; i++) {
        const comp = compList[i];

        if (comp.compType == "container") {
            const result = getContainerResult(comp);
            const {currentLayerContainer, boxItems, fieldList, searchItemList} = result;

            if (Array.isArray(currentLayerContainer)) {
                selectList.push(...currentLayerContainer);
            } else {
                selectList.push(currentLayerContainer);
            }

            mergeObjects(compListResult, boxItems);

            if (comp.itemType === "dytable") {
                compFieldList.push({fieldName: "", dytableList: fieldList});
            } else {
                if (Array.isArray(fieldList)) {
                    compFieldList.push(...fieldList);
                } else {
                    compFieldList.push(fieldList);
                }
            }

            if (searchItemList?.length > 0) {
                searchFieldList.push(...searchItemList);
            }
        } else {
            const {item, fieldInfo, layerItem, searchItem} = itemAnalysis(comp);
            compFieldList.push(fieldInfo);
            selectList.push(layerItem);
            mergeObjects(compListResult, item);
            if (hasKeys(searchItem)) {
                searchFieldList.push(searchItem);
            }
        }
    }

    return {
        selectList,
        compListResult,
        fieldList: compFieldList,
        searchItemList: searchFieldList,
    };
};

function getContainerResult(comp: any) {
    if (comp.itemType === "box" || comp.itemType === "dytable") {
        return boxDytableAnalysis(comp);
    } else if (comp.itemType === "table") {
        return tableAnalysis(comp);
    } else if (["tab", "collapse", "card", "splitter"].includes(comp.itemType)) {
        return tabColapseCardAnalysis(comp);
    }
    return null;
}

/**
 * 解析自动匹配平台格式的数据
 * @param fieldList
 */
export const analysisAutoFitOsCompDatas = (fieldList: any) => {
    if (isMobile) {
        return analysisAppComps(fieldList);
    } else {
        return analysisCompDatas(fieldList);
    }
};

function checkContainerType(data: FieldInfo) {

    if (data.tabList) {
        return {type: "tab", dataList: data.tabList};
    } else if (data.cardList) {
        return {type: "card", dataList: data.cardList};
    } else if (data.collapseList) {
        return {type: "collapse", dataList: data.collapseList};
    } else if (data.splitterList) {
        return {type: "splitter", dataList: data.splitterList};
    } else {
        return null;
    }
}

function analysisComps(fieldList: any) {
    const tempFieldList: any[] = [];
    if (!Array.isArray(fieldList)) {
        return fieldList ? [fieldList] : [];
    }

    for (let i = 0; i < fieldList.length; i++) {
        const filed = fieldList[i];
        const commonContainer = checkContainerType(filed);

        if (filed.dytableList) {
            processDytable(filed.dytableList, tempFieldList);
        } else if (commonContainer) {
            processContainer(filed, commonContainer, tempFieldList);
        } else if (filed.batchFieldList) {
            processBatchField(filed, tempFieldList);
        } else {
            if (Array.isArray(filed)) {
                tempFieldList.push(...filed);
            } else {
                tempFieldList.push(filed);
            }
        }
    }
    return tempFieldList;
}

function processDytable(dytableList: any[], result: any[]) {
    for (let j = 0; j < dytableList.length; j++) {
        const row = dytableList[j];
        if (Array.isArray(row)) {
            for (let k = 0; k < row.length; k++) {
                const item = row[k];
                if (Array.isArray(item)) {
                    result.push(...item);
                } else if (item?.preps?.cellVisible) {
                    result.push(item);
                }
            }
        }
    }
}

function processContainer(filed: any, commonContainer: any, result: any[]) {
    const dataList = commonContainer.dataList;
    for (let j = 0; j < dataList.length; j++) {
        const container = dataList[j];
        const subForm = container.subFormFlag == "Y";
        const commonFieldList = analysisComps(container.fieldList);

        if (subForm) {
            const newItem = {...container, fieldList: commonFieldList, oldType: commonContainer.type};
            result.push({appList: [newItem]});
        } else {
            result.push(...commonFieldList);
        }
    }
}

function processBatchField(filed: any, result: any[]) {
    const batchFieldList = filed.batchFieldList;
    for (let j = 0; j < batchFieldList.length; j++) {
        const item = batchFieldList[j];
        const batchFieldListItems = analysisComps(item.fieldList);
        const newItem = {...item, fieldList: batchFieldListItems};
        result.push({appList: [newItem]});
    }
}

/**
 * 解析所有组件按顺序排列，去掉所有容器布局，
 * 需考虑如果是主子表单的情况需要怎么操作，
 * 除了box,dytable，其它的是否只需要解析容器内部的子容器，
 * 第一步，先将dytable容器的数据解析完成
 * @param dataList
 */
export function analysisAppComps(dataList: any) {
    const {selectList, compListResult, fieldList, searchItemList} = analysisCompDatas(dataList);
    const tempFieldList = analysisComps(fieldList);
    const result = convertPcCompToFitPlatformComps({fieldList: tempFieldList});
    return {selectList, compListResult, fieldList: result.fieldList, searchItemList};
}

/**
 * 将pc模型转为app模型
 * @param pageInfo
 */
export function convertPcCompToFitPlatformComps(pageInfo: PageFieldInfo) {
    //如果不是手机端，则直接返回
    if (!isMobile) {
        return pageInfo;
    }
    return convertCompToAppComps(pageInfo);
}

/**
 * 将pc模型转为app模型
 * @param pageInfo
 */
export function convertCompToAppComps(pageInfo: PageFieldInfo) {
    //如果不是手机端，则直接返回
    const tempFieldList = analysisComps(pageInfo.fieldList);
    const staticComps = tempFieldList.filter((item) => {
        return item && (item.type == "html" || item.type == "text");
    });
    const labelForComps = staticComps.filter((item) => item?.preps?.labelFor);
    let appVisibleComps = tempFieldList?.filter((item) => !item?.preps?.appCompVisible);
    labelForComps.forEach((staticData) => {
        const labelFors: string[] = staticData.preps?.labelFor;
        appVisibleComps?.filter((item) => labelFors.includes(item.fieldName))?.forEach((item) => {
            if (!item.preps) {
                item.preps = {};
            }
            item.preps.hideLabel = false;
            item.label = staticData.preps?.textContent;
            item.preps.placeholder = "请输入" + item.label;
        });
    });
    appVisibleComps?.filter((item) => {
        return !["html", "text"].includes(item.type) && item.preps?.hideLabel && !item.preps.appCompVisible && !item.preps.appLabelVisible;
    })?.forEach((item) => {
        item.preps.hideLabel = false;
    });
    //将数据进行排序显示
    appVisibleComps = appVisibleComps?.sort((a, b) => {
        const indexA = a.preps?.dataIndex ?? 0;
        const indexB = b.preps?.dataIndex ?? 0;
        return indexA - indexB;
    });
    return {fieldList: appVisibleComps};
}

/**
 * 解析动态表单中的子节点数据是否需要合并到父节点中
 * @param props
 * @param dataForm
 */
export function dynamicFormAnalysis(props: any, dataForm: any) {
    const globalCondition = props.globalCondition;
    let dataList: any = {};
    if (!globalCondition || globalCondition.length == 0) {
        return dataList;
    }
    for (const key in globalCondition) {
        const temp = globalCondition[key];
        if ("Y" != temp.subFormFlag) {
            const data = dataForm[temp.tableName];
            delete dataForm[temp.tableName];
            if (Array.isArray(data)) {
                dataList = [];
                for (let i = 0; i < data.length; i++) {
                    const item: any = {};
                    for (const k in data[i]) {
                        if (Object.prototype.hasOwnProperty.call(data[i], k)) {
                            item[k] = data[i][k];
                        }
                    }
                    for (const k in dataForm) {
                        if (Object.prototype.hasOwnProperty.call(dataForm, k)) {
                            item[k] = dataForm[k];
                        }
                    }
                    dataList.push(item);
                }
            } else {
                dataList = {};
                for (const k in data) {
                    if (Object.prototype.hasOwnProperty.call(data, k)) {
                        dataList[k] = data[k];
                    }
                }
                for (const k in dataForm) {
                    if (Object.prototype.hasOwnProperty.call(dataForm, k)) {
                        dataList[k] = dataForm[k];
                    }
                }
            }
        }
    }
    return dataList;
}

/**
 * 创建验证规则
 * @param item
 * @param dataForm
 */
export function validMsg(item: any, dataForm: any) {
    const rules = [];
    if (
        item.required &&
        (item.required === true || item.required == "true") &&
        !item.disabled
    ) {
        rules.push({
            required: true,
            message: `${item.label}${i18n("api.cannotBeEmpty")}`,
            trigger: "blur",
        });
    }
    if (item.type == "number-range") {
        const splitName = item.preps?.splitName ?? "-";
        const escapedSplit = splitName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        rules.push({
            pattern: new RegExp(`^\\d+${escapedSplit}\\d+$`),
            message: i18n("api.numberRangeFormat"),
            trigger: "blur",
        });
        rules.push({
            validator: (rule: any, value: string, callback: any) => {
                const minName = item.preps?.minName ?? item.fieldName + "Min";
                const maxName = item.preps?.maxName ?? item.fieldName + "Max";
                // 从formData中获取min和max的实际数值（通过fieldName+Min/Max）
                const minValue = unref(dataForm)[`${minName}`];
                const maxValue = unref(dataForm)[`${maxName}`];
                if (minValue === undefined || maxValue === undefined) {
                    callback(); // 由required规则处理空值
                    return;
                }
                if (maxValue < minValue) {
                    callback(new Error(i18n("api.maxValueCannotBeLessThanMinValue")));
                } else {
                    callback();
                }
            },
            trigger: "blur", // 输入变化时触发验证
        });
    }

    const itemRules: any = item.rules || item.preps?.rules;
    const innerFun = (itemRules: any) => {
        if (itemRules?.length > 0) {
            if (Array.isArray(itemRules)) {
                itemRules?.forEach((rule: any) => {
                    if (rule?.name?.length > 0) {
                        rules.push(getValidType(rule.name, rule.options));
                    } else {
                        if (typeof rule == "string") {
                            rules.push(getValidType(rule));
                        } else {
                            rules.push(rule);
                        }
                    }
                });
            } else {
                if (itemRules?.name?.length > 0) {
                    rules.push(getValidType(itemRules.name, itemRules.options));
                } else {
                    if (typeof itemRules == "string") {
                        rules.push(getValidType(itemRules));
                    } else {
                        rules.push(itemRules);
                    }
                }
            }
        }
    };
    //解决某些非标准的规则
    innerFun(itemRules);
    return rules;
}

/**
 * 检查对象是否需要创建
 * @param dataForm 数据对象
 * @param item 表单属性
 * @param index 索引
 * @param parentIndex 父索引
 * @param prefix 前缀
 */
export function checkObject(
    dataForm: any,
    item: any,
    index: number,
    parentIndex: number,
    prefix: string,
) {
    return index + 1;
}

/**
 * 存在映射关系时的校验函数
 * @param item
 * @param dataForm
 * @param prefix
 * @param parentIndex
 * @param index
 */
export function getFormData(
    item: any,
    dataForm: any,
    prefix: string,
    parentIndex: any,
    index: any,
) {
    if (item.subFormFlag == "Y") {
        if (item && item.objectName) {
            if (!Object.keys(dataForm).includes(item.objectName)) {
                dataForm[item.objectName] = (!item.mapping || item.mapping == "1") ? {} : [{}];
            }
        }
        //如果映射关系是1对多
        if (item.mapping == "n") {
            let dataIndex = getDataIndex(item, prefix, parentIndex, index);
            let len = dataForm[item.objectName].length;
            if (dataIndex >= len) {
                dataForm[item.objectName].push({});
                dataIndex = len - 1;
            }
            return dataForm[item.objectName][dataIndex];
        } else {
            return dataForm[item.objectName];
        }
    }
    return dataForm;
}

/**
 * 获取表单数据索引
 * @param data
 * @param prefix
 * @param parentIndex
 * @param index
 */
export function getDataIndex(
    data: any,
    prefix: string,
    parentIndex: any,
    index: any,
) {
    // eslint-disable-next-line no-useless-assignment
    let pronPrefix: number = 0;
    if (prefix?.length > 0) {
        if (data.subFormFlag == "Y") {
            pronPrefix = parentIndex > -1 ? 0 : index;
        } else {
            pronPrefix = parentIndex;
        }
    } else if (data.subFormFlag == "Y") {
        //如果父表大于0,说明当前是父表的子表，应该用父表的索引
        pronPrefix = parentIndex > 0 ? parentIndex : index;
    } else {
        pronPrefix = -1;
    }
    return pronPrefix;
}

/**
 * 生成验证属性
 * @param prefix 父表标识
 * @param fieldName 字段名称
 * @param parentIndex 父索引
 * @param currentIndex 当前索引
 */
export function loadProp(
    prefix: string,
    fieldName: string,
    parentIndex: number,
    currentIndex: number,
) {
    if (prefix && prefix.length > 0) {
        return (
            prefix +
            "." +
            fieldName +
            (currentIndex > -1
                ? "." + currentIndex
                : parentIndex > -1
                    ? "." + parentIndex
                    : "")
        );
    } else if (parentIndex >= 0) {
        return fieldName + "." + parentIndex;
    } else if (currentIndex >= 0) {
        return fieldName + "." + currentIndex;
    } else {
        return fieldName;
    }
}

/**
 * 计算表单Pron
 * @param data
 * @param prefix
 * @param parentIndex
 * @param index
 */
export function getPrefix(
    data: any,
    prefix: string,
    parentIndex: any,
    index: any,
) {
    // eslint-disable-next-line no-useless-assignment
    let pronPrefix: string = "";
    if (prefix && prefix.length > 0) {
        if (data.subFormFlag == "Y") {
            pronPrefix =
                prefix + "." + data.objectName;
            if (data.mapping == "n") {
                pronPrefix = +"." + (parentIndex > -1 ? 0 : index);
            }

        } else {
            pronPrefix = prefix;
        }
    } else if (data.subFormFlag == "Y") {
        //如果父表大于0,说明当前是父表的子表，应该用父表的索引
        pronPrefix = data.objectName;
        if (data.mapping == "n") {
            pronPrefix = +"." + (parentIndex > 0 ? parentIndex : index);
        }
    } else {
        pronPrefix = "";
    }
    return pronPrefix;
}

/**
 * 检查是否可见
 * @param item
 * @param dataForm
 */
export function checkVisible(item: any, dataForm: any) {
    if (!commonFields.find((temp: any) => temp.fieldName == item.fieldName)) {
        //如果没有配置此属性，则默认显示
        item["formVisible"] = item.formVisible ?? true;
    }
    return item.formVisible || dataForm["_" + item.fieldName + "Visible"];
}

/**
 * 解析列表数据
 * @param item
 * @param val
 */
export function parseListData(item: any, val: any) {
    return (
        unref(item.preps?.values)?.find((temp: any) => temp.value == val)?.name ||
        unref(item.preps?.data)?.find((temp: any) => temp.value == val)?.name ||
        unref(item.optionList)?.find((temp: any) => temp.value == val)?.name ||
        val
    );
}

/**
 * 过滤对象属性
 * @param obj 要过滤的对象
 * @param keysToRemove 要移除的属性键数组
 */
export function filterProperties(obj: any, keysToRemove: string[]) {
    Object.keys(obj).forEach((key) => {
        if (keysToRemove.includes(key)) {
            delete obj[key];
        }
    });
}

/**
 * 判断标签是否需要显示
 * @param item
 */
export function labelVisibleCheck(item: any) {
    if (item.preps?.hideLabel || item.preps?.staticData) {
        return "";
    }
    return item.preps?.label || item.label;
}
