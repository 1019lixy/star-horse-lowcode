import {getValidType} from "@/api/valid_utils";
import {unref} from "vue";
import {i18n} from "@/lang";
import {FieldInfo, SelectOption} from "@/components/types";

/**
 * 强制刷新组件列表
 */
export const analysisCompNames = (dataList: any) => {
    const selectList: Array<any> = [];
    const compListResult: Record<string, any> = {};
    const compList = unref(dataList);
    const fieldList: FieldInfo[] = [];
    const stack: Array<{ datas: Array<any>; tabName?: string }> = [];
    const allChildItems: Array<any> = [];
    // 使用栈代替递归，初始化栈
    stack.push({datas: compList, tabName: undefined});
    while (stack.length > 0) {
        const {datas, tabName} = stack.pop()!;
        const currentSelectList: Array<any> = [];
        const currentCompList: Array<any> = [];
        for (const index in datas) {
            const temp = datas[index];
            if (temp.itemType === "box" || temp.itemType === "dytable") {
                const elements = temp.preps.elements;
                const children: Array<any> = [];
                const childItems: Array<any> = [];
                for (const sindex in elements) {
                    const columns = elements[sindex].columns;
                    for (const ssindex in columns) {
                        const column = columns[ssindex];
                        if (column?.items?.length > 0) {
                            // 收集子项
                            const items = column.items.filter(
                                (item: any) => item.preps?.label,
                            );
                            children.push(
                                ...items.map((item: any) => ({
                                    name: item.preps?.label,
                                    id: item.preps?.id,
                                    compType: "item",
                                    tabName,
                                    type: item.preps?.itemType,
                                    value: item.preps?.name,
                                })),
                            );
                            childItems.push(...column.items);
                            allChildItems.push(...items);
                        }
                    }
                }
                currentSelectList.push({
                    name: temp.preps?.label ?? temp.preps?.itemNameLabel,
                    value: temp.preps?.name,
                    id: temp.preps?.id,
                    tabName,
                    type: temp.itemType,
                    compType: "container",
                    children: children,
                });
                currentCompList.push(temp, ...childItems);
            } else if (temp.itemType === "table") {
                const elements = temp.preps.elements;
                const children: SelectOption[] = [];
                const childItems: Array<any> = [];

                for (const index in elements) {
                    const element = elements[index];
                    if (element.items?.length > 0) {
                        const items = element.items.filter(
                            (item: any) => item.preps?.label,
                        );
                        children.push(
                            ...items.map((item: any) => ({
                                name: item.preps?.label,
                                id: item.preps?.id,
                                compType: "item",
                                tabName,
                                type: item.itemType ?? item.preps?.itemType,
                                value: item.preps?.name,
                            })),
                        );
                        childItems.push(...element.items);
                        allChildItems.push(...items);
                    }
                }
                currentSelectList.push({
                    name: temp.preps?.label,
                    value: temp.preps?.batchFieldName,
                    tabName,
                    id: temp.id,
                    type: temp.itemType,
                    compType: "container",
                    children: children,
                });
                currentCompList.push(temp, ...childItems);
            } else if (["tab", "collapse", "card"].includes(temp.itemType)) {
                const elements = temp.preps?.elements || [];
                const childItems: Array<any> = [];
                for (const index in elements) {
                    const element = elements[index];
                    const tempTabName = tabName
                        ? `${tabName}__${element.tabName}`
                        : element.tabName;
                    // 收集当前标签页/折叠面板/卡片的子元素
                    const children: any[] = [];
                    // 递归处理子元素，支持嵌套容器
                    if (element.items?.length > 0) {
                        // 对每个子项进行处理
                        for (const itemIndex in element.items) {
                            const item = element.items[itemIndex];
                            childItems.push(item);
                            // 如果是容器类型，递归处理其children
                            if (["box", "table", "dytable", "tab", "collapse", "card"].includes(item.itemType)) {
                                // 创建容器节点
                                const containerNode: any = {
                                    name: item.preps?.label ?? item.preps?.itemNameLabel,
                                    value: item.preps?.name || item.preps?.batchFieldName,
                                    id: item.id || item.preps?.id,
                                    tabName: tempTabName,
                                    type: item.itemType,
                                    compType: "container",
                                    children: [] // 初始化空children数组
                                };
                                // 处理容器的子元素
                                if (item.preps?.elements) {
                                    // 根据不同容器类型处理子元素
                                    if (item.itemType === "box" || item.itemType === "dytable") {
                                        // box和dytable的子元素在elements.columns中
                                        for (const eIndex in item.preps.elements) {
                                            const elementItem = item.preps.elements[eIndex];
                                            if (elementItem?.columns) {
                                                for (const colIndex in elementItem.columns) {
                                                    const column = elementItem.columns[colIndex];
                                                    if (column?.items?.length > 0) {
                                                        const items = column.items.filter((subItem: any) => subItem.preps?.label);
                                                        containerNode.children?.push(
                                                            ...items.map((subItem: any) => ({
                                                                name: subItem.preps?.label,
                                                                id: subItem.id || subItem.preps?.id,
                                                                compType: "item",
                                                                tabName: tempTabName,
                                                                type: subItem.preps?.itemType,
                                                                value: subItem.preps?.name,
                                                            }))
                                                        );
                                                        allChildItems.push(...items);
                                                    }
                                                }
                                            }
                                        }
                                    } else if (item.itemType === "table") {
                                        // table的子元素直接在elements中
                                        for (const eIndex in item.preps.elements) {
                                            const elementItem = item.preps.elements[eIndex];
                                            if (elementItem?.items?.length > 0) {
                                                const items = elementItem.items.filter((subItem: any) => subItem.preps?.label);
                                                containerNode.children?.push(
                                                    ...items.map((subItem: any) => ({
                                                        name: subItem.preps?.label,
                                                        id: subItem.id || subItem.preps?.id,
                                                        compType: "item",
                                                        tabName: tempTabName,
                                                        type: subItem.itemType ?? subItem.preps?.itemType,
                                                        value: subItem.preps?.name,
                                                    }))
                                                );
                                                allChildItems.push(...items);
                                            }
                                        }
                                    } else if (["tab", "collapse", "card"].includes(item.itemType)) {
                                        // 嵌套的tab/collapse/card
                                        for (const eIndex in item.preps.elements) {
                                            const elementItem = item.preps.elements[eIndex];
                                            // 创建子容器节点
                                            const subContainerNode: any = {
                                                name: elementItem.label,
                                                value: elementItem.objectName,
                                                tabName: tempTabName,
                                                id: item.id,
                                                type: item.itemType,
                                                compType: "container",
                                                children: []
                                            };
                                            // 处理子容器的items
                                            if (elementItem?.items?.length > 0) {
                                                const items = elementItem.items.filter((subItem: any) => subItem.preps?.label);
                                                subContainerNode.children?.push(
                                                    ...items.map((subItem: any) => ({
                                                        name: subItem.preps?.label,
                                                        id: subItem.id || subItem.preps?.id,
                                                        compType: "item",
                                                        tabName: tempTabName,
                                                        type: subItem.itemType ?? subItem.preps?.itemType,
                                                        value: subItem.preps?.name,
                                                    }))
                                                );
                                                allChildItems.push(...items);
                                            }
                                            containerNode.children?.push(subContainerNode);
                                        }
                                    }
                                }
                                // 将容器节点添加到父容器的children中
                                children.push(containerNode);
                            } else {
                                // 普通组件，直接添加到children中
                                if (item.preps?.label) {
                                    children.push({
                                        name: item.preps?.label,
                                        id: item.id || item.preps?.id,
                                        compType: "item",
                                        tabName: tempTabName,
                                        type: item.itemType ?? item.preps?.itemType,
                                        value: item.preps?.name,
                                    });
                                    allChildItems.push(item);
                                }
                            }
                        }
                    }
                    currentSelectList.push({
                        name: element.label,
                        value: element.objectName,
                        tabName: tempTabName,
                        id: temp.id,
                        type: temp.itemType,
                        compType: "container",
                        children: children, // 包含了所有子元素，包括嵌套容器
                    });
                }
                // 将容器和所有子元素都添加到compListResult中
                currentCompList.push(temp, ...childItems);
            } else {
                currentSelectList.push({
                    name: temp.preps?.label,
                    value: temp.preps?.name,
                    tabName,
                    compType: "item",
                    id: temp.id || temp.preps?.id,
                    type: temp.itemType ?? temp.preps?.itemType,
                });
                currentCompList.push(temp);
                allChildItems.push(temp);
            }
        }
        // 批量添加结果
        selectList.push(...currentSelectList);
        // 递归处理组件函数
        const processComponent = (component: any) => {
            // 存储当前组件
            if (component.id || (component.preps && component.preps.id)) {
                const compId = component.id || component.preps.id;
                compListResult[compId] = component;
            }
            // 检查是否为容器类型
            const isContainer = component.preps?.isContainer ||
                ["box", "dytable", "table", "tab", "collapse", "card"].includes(component.itemType);

            if (isContainer && component.preps?.elements) {
                // 处理容器的子元素
                component.preps.elements.forEach((element: any) => {
                    // 对于box/dytable/table类型容器，处理columns
                    if (["box", "dytable", "table"].includes(component.itemType)) {
                        if (element?.columns) {
                            element.columns.forEach((column: any) => {
                                if (column?.items) {
                                    column.items.forEach(processComponent);
                                }
                            });
                        }
                    }
                    // 对于tab/collapse/card类型容器，处理items
                    else if (["tab", "collapse", "card"].includes(component.itemType)) {
                        if (element?.items) {
                            element.items.forEach(processComponent);
                        }
                    }
                });
            }
        };
        // 处理所有当前组件及其子组件
        allChildItems.forEach(processComponent);
    }
    return {compListResult, fieldList, selectList};
};

/**
 * 解析动态表单中的子节点数据是否需要合并到父节点中
 * @param props
 * @param dataForm
 */
export function dynamicFormAnalysis(props: any, dataForm: any) {
    //props.globalCondition 有属性不是子表，需要额外封装
    const globalCondition = props.globalCondition;
    let dataList: any = {};
    if (!globalCondition || globalCondition.length == 0) {
        return dataList;
    }
    for (const key in globalCondition) {
        const temp = globalCondition[key];
        //如果非子表
        if ("N" == temp.subFormFlag) {
            const data = dataForm[temp.tableName];
            delete dataForm[temp.tableName];
            if (Array.isArray(data)) {
                dataList = [];
                data.forEach((item) => {
                    dataList.push(Object.assign({}, item, dataForm));
                });
            } else {
                Object.assign(dataList, data, dataForm);
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
                dataForm[item.objectName] = [{}];
            }
        }
        let dataIndex = getDataIndex(item, prefix, parentIndex, index);
        let len = dataForm[item.objectName].length;
        if (dataIndex >= len) {
            dataForm[item.objectName].push({});
            dataIndex = len - 1;
        }
        return dataForm[item.objectName][dataIndex];
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
    let pronPrefix = "";
    if (prefix && prefix.length > 0) {
        if (data.subFormFlag == "Y") {
            pronPrefix =
                prefix + "." + data.objectName + "." + (parentIndex > -1 ? 0 : index);
        } else {
            pronPrefix = prefix;
        }
    } else if (data.subFormFlag == "Y") {
        //如果父表大于0,说明当前是父表的子表，应该用父表的索引
        pronPrefix =
            data.objectName + "." + (parentIndex > 0 ? parentIndex : index);
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
