import {getValidType} from "@/api/valid_utils";
import {reactive, unref} from "vue";
import {i18n} from "@/lang";
import {FieldInfo, PageFieldInfo, SearchProps} from "@/components/types";
import {compKey, uuid} from "@/api/system";
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
    "elements",
];
const commonFields: FieldInfo[] = commonField();
const createContainer = (item: any, children: any) => {
    return {
        name: item.label ?? item.preps?.label ?? item.preps?.itemNameLabel,
        value: item.preps?.name ?? item.subTablePrimaryKey ?? item.subTableName,
        id: item.id ?? item.preps?.id ?? uuid(),
        type: item.itemType,
        compType: "container",
        children: children,
    };
};
const mergeObjects = (
    target: Record<string, any>,
    source: Record<string, any>,
) => {
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
    for (const [key, value] of Object.entries(preps || {})) {
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
    const elements = item?.preps?.elements;
    const boxItems: Record<string, any> = {};
    const children: Array<any> = [];
    const fieldList: FieldInfo[] | any = [];
    const searchItemList: SearchProps[] | any = [];
    const selectList: Array<any> = [];
    elements?.forEach((row) => {
        const columnItems: FieldInfo[] | any = [];
        row.columns?.forEach((column) => {
            const colHeight = column.colHeight;
            const colWidth = column.colWidth;
            const colspan = column.colspan;
            const rowspan = column.rowspan;
            const cellVisible = column.cellVisible;
            const currentColumnItems: FieldInfo[] | any = [];
            if (column.staticData === true) {
                columnItems.push({
                    staticData: column.staticData,
                    visiblePlatform: column.visiblePlatform,
                    viewVisible: true,
                    formVisible: false,
                    preps: {
                        colspan: colspan,
                        rowspan: rowspan,
                        colHeight: colHeight,
                        colWidth: colWidth,
                        cellVisible: cellVisible,
                        textContent: column.textContent,
                    },
                });
            } else {
                column?.items?.forEach((temp: any) => {
                    const {item, fieldInfo, layerItem, searchItem} = itemAnalysis(temp);
                    mergeObjects(boxItems, item);
                    children.push(layerItem);
                    selectList.push({
                        name: `${fieldInfo.label}(${fieldInfo.fieldName})`,
                        value: fieldInfo.fieldName,
                    });
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
            }
        });
        fieldList.push(columnItems);
    });
    const currentLayerContainer = createContainer(item, children);
    boxItems[currentLayerContainer.id] = item;
    return {currentLayerContainer, boxItems, fieldList, searchItemList, selectList};
};

/**
 * 解析table 容器
 * @param item
 */
const tableAnalysis = (item: any) => {
    const elements = item?.preps?.elements;
    const boxItems: Record<string, any> = {};
    const children: Array<any> = [];
    const batchFieldInfos: any[] = [];
    const columnsList: FieldInfo[] | any = [];
    const searchItemList: SearchProps[] | any = [];
    const selectList: Array<any> = [];
    for (const element of elements) {
        element?.items?.forEach((temp: any) => {
            const {item, fieldInfo, layerItem, searchItem} = itemAnalysis(temp);
            mergeObjects(boxItems, item);
            children.push(layerItem);
            selectList.push({
                name: fieldInfo.label,
                value: fieldInfo.fieldName,
            });
            columnsList.push(fieldInfo);
            if (hasKeys(searchItem)) {
                searchItemList.push(searchItem);
            }
        });
    }
    batchFieldInfos.push({
        containerType: "table",
        subTablePrimaryKey: item.preps?.subTablePrimaryKey ?? item.subTableName,
        subTableName: item.preps?.subTableName,
        subFormFlag: item.preps?.subFormFlag,
        disabled: item.disabled,
        title: item.preps?.label ?? item.preps?.itemNameLabel,
        fieldList: columnsList,
        preps: getPreps(item),
    });

    const fieldList: FieldInfo | any = {
        containerType: "table",
        containerFields: batchFieldInfos,
        preps: getPreps(item),
    };
    const currentLayerContainer = createContainer(item, children);
    boxItems[currentLayerContainer.id] = item;
    return {currentLayerContainer, boxItems, fieldList, searchItemList, selectList};
};
const getPreps = (item: any) => {
    const preps: Record<string, any> = {};
    const keys = Object.keys(item.preps || {});
    if (!keys.length) {
        return preps;
    }
    for (const key of keys) {
        if (key != "elements" && item.preps[key]) {
            preps[key] = item.preps[key];
        }
    }
    return preps;
};
/**
 * 提取容器子项(column/element)的非结构性属性,对齐后端 getColumnPreps
 * 容器子项的个性化属性(disVisible/helpMsg/icon/closable/addable 等)下沉到 preps
 */
const getColumnPreps = (column: any) => {
    if (!column) return {};
    const structuralKeys = [
        "items",
        "subTablePrimaryKey",
        "subTableName",
        "subFormFlag",
        "label",
        "disabled",
        "formVisible",
        "tableFlag",
        "mapping",
        "primaryKey",
        "id",
        "height",
        "rowIndex",
        "colIndex",
    ];
    const preps: Record<string, any> = {};
    for (const [key, value] of Object.entries(column)) {
        if (!structuralKeys.includes(key) && value) {
            preps[key] = value;
        }
    }
    return preps;
};
/**
 * 解析tab,collapse,card,splitter?
 * @param item
 */
const tabColapseCardAnalysis = (item: any) => {
    const elements = item?.preps?.elements;
    const currentLayerContainerList: Array<any> = [];
    const boxItems: Record<string, any> = {};
    let fieldInfo: FieldInfo | any = {};
    const searchItemList2: SearchProps[] | any = [];
    const dataList: Array<any> = [];
    const selectList: Array<any> = [];
    for (const element of elements) {
        const {
            selectList: innerSelectList,
            compListResult,
            fieldList,
            searchItemList,
        } = analysisCompDatas(element.items);
        mergeObjects(boxItems, compListResult);
        const innerLayer = createContainer(element, innerSelectList);
        boxItems[innerLayer.id] = element;
        currentLayerContainerList.push(innerLayer);
        if (element.subFormFlag !== "Y") {
            selectList.push(...(innerSelectList || []));
        }
        dataList.push({
            subTablePrimaryKey: element.subTablePrimaryKey,
            subTableName: element.subTableName,
            subFormFlag: element.subFormFlag,
            mapping: element.mapping,
            title: element.label || element.title,
            id: element.id,
            height: element.height,
            disabled: element.disabled,
            formVisible: element.formVisible,
            tableFlag: element.tableFlag,
            primaryKey: element.primaryKey,
            fieldList: fieldList,
            preps: getColumnPreps(element),
        });
        if (searchItemList?.length > 0) {
            searchItemList2.push(...searchItemList);
        }
    }
    if (dataList?.length > 0) {
        fieldInfo.fieldName = dataList[0].subTablePrimaryKey;
    }
    // 第三类容器统一:containerType 标识类型,containerFields 承载数据
    // 后续新增容器类型无需修改此处
    if (item.itemType) {
        fieldInfo.containerType = item.itemType;
        fieldInfo.containerFields = dataList;
    } else {
        console.error("Unknown itemType: ", item.itemType);
    }
    fieldInfo.preps = getPreps(item);
    const currentLayerContainer = createContainer(
        item,
        currentLayerContainerList,
    );
    boxItems[currentLayerContainer.id] = item;
    return {
        currentLayerContainer,
        boxItems,
        fieldList: [fieldInfo],
        searchItemList: searchItemList2,
        selectList,
    };
};
/**
 * 直接解析字段
 * @param item
 */
const itemAnalysis = (item: any) => {
    const preps = item.preps || {};
    const remainingPreps = filterPreps(preps);
    const fieldInfo: FieldInfo = {
        label: preps.label ?? item.label,
        fieldName: preps.name ?? item.fieldName,
        type: item.itemType ?? item.type,
        formVisible: preps.formVisible ?? item.formVisible,
        listVisible: preps.listVisible ?? item.listVisible,
        viewVisible: preps.viewVisible ?? item.viewVisible,
        required: preps.required ?? item.required,
        actions: preps.actions ?? item.actions,
        helpMsg: preps.helpMsg ?? item.helpMsg,
        listPrototypeDisplay:
            preps.listPrototypeDisplay ?? item.listPrototypeDisplay,
        defaultValue: preps.defaultValue ?? item.defaultValue,
        prefix: preps.prefix ?? item.prefix,
        disabled: preps.disabled ?? item.disabled,
        editDisabled: preps.editDisabled ?? item.editDisabled,
        id: preps.id ?? item.id,
        preps: remainingPreps,
        staticData: preps.staticData ?? item.staticData,
        visiblePlatform: preps.visiblePlatform ?? item.visiblePlatform,
    };
    const layerItem: any = {
        name: item.preps?.label ?? item.label,
        id: item.preps?.id ?? item.id,
        compType: "formItem",
        type: item.preps?.itemType ?? item.itemType,
        value: item.preps?.name ?? item.name,
    };
    let searchItem: SearchProps = {};
    if (preps.searchVisible) {
        searchItem = {
            fieldName: preps.name ?? item.fieldName,
            label: preps.label ?? item.label,
            defaultValue: preps.defaultValue ?? item.defaultValue ?? "",
            defaultVisible: preps.defaultVisible ?? item.defaultVisible ?? false,
            preps: remainingPreps,
        };
    }
    const record: Record<string, any> = {};
    record[fieldInfo.id] = item;
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
        return {
            selectList,
            compListResult,
            compFieldList,
            fieldList: [],
            searchFieldList,
        };
    }

    for (let i = 0; i < compList.length; i++) {
        const comp = compList[i];
        if (comp.compType == "container") {
            const result = getContainerResult(comp);
            if (null == result) {
                console.warn("[analysisCompDatas]:container content is null");
                continue;
            }
            const {boxItems, fieldList, searchItemList, selectList: innerSelectList} =
                result;

            mergeObjects(compListResult, boxItems);

            const containerType = comp.itemType;
            const subFormFlag = comp.preps?.subFormFlag ?? comp.subFormFlag;
            if (containerType === "table" || subFormFlag === "Y") {
                const title = comp.preps?.label ?? comp.preps?.itemNameLabel;
                const subTablePrimaryKey =
                    comp.preps?.subTablePrimaryKey ?? comp.subTableName;
                const subTableName = comp.preps?.subTableName;
                selectList.push({
                    name: title || containerType,
                    value: subTablePrimaryKey || subTableName || uuid(),
                    children: innerSelectList || [],
                });
            } else {
                selectList.push(...(innerSelectList || []));
            }

            if (comp.itemType === "dytable" || comp.itemType === "gridtable") {
                compFieldList.push({
                    fieldName: "",
                    containerType: comp.itemType,
                    containerFields: [
                        {
                            fieldList: fieldList,
                        },
                    ],
                    preps: getPreps(comp),
                });
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
            const {item, fieldInfo, searchItem} = itemAnalysis(comp);
            compFieldList.push(fieldInfo);
            selectList.push({name: `${fieldInfo.label}(${fieldInfo.fieldName})`, value: fieldInfo.fieldName});
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

/**
 * 解析 condition 条件组
 * 结构：condition 有 children（子条件组，递归）和 items（当前层级叶子字段）
 * @param comp
 */
const conditionAnalysis = (comp: any) => {
    const boxItems: Record<string, any> = {};
    const searchItemList: SearchProps[] = [];
    const childrenContainers: any[] = [];
    const childrenFieldList: any[] = [];
    const selectList: Array<any> = [];
    // 递归处理 children（子条件组）
    if (comp.children?.length > 0) {
        for (const child of comp.children) {
            const childResult = analysisCompDatas([child]);
            mergeObjects(boxItems, childResult.compListResult);
            if (Array.isArray(childResult.fieldList)) {
                childrenFieldList.push(...childResult.fieldList);
            } else {
                childrenFieldList.push(childResult.fieldList);
            }
            if (Array.isArray(childResult.selectList)) {
                childrenContainers.push(...childResult.selectList);
                selectList.push(...childResult.selectList);
            } else {
                childrenContainers.push(childResult.selectList);
                selectList.push(childResult.selectList);
            }
            if (childResult.searchItemList?.length > 0) {
                searchItemList.push(...childResult.searchItemList);
            }
        }
    }
    // 构建 fieldList：children 作为 children 属性，items 作为当前层叶子
    const fieldInfo: any = {
        fieldName: comp.fieldName || comp.preps?.name,
        label: comp.label || comp.preps?.label,
        type: comp.type || "group",
        compType: "container",
        itemType: "condition",
        children: childrenFieldList ?? [],
    };

    const currentLayerContainer = createContainer(comp, childrenContainers);
    boxItems[currentLayerContainer.id] = comp;

    return {
        currentLayerContainer,
        boxItems,
        fieldList: fieldInfo,
        searchItemList,
        selectList,
    };
};

function getContainerResult(comp: any) {
    if (["box", "dytable", "gridtable"].includes(comp.itemType)) {
        return boxDytableAnalysis(comp);
    } else if (comp.itemType === "table") {
        return tableAnalysis(comp);
    } else if (comp.itemType === "condition") {
        return conditionAnalysis(comp);
    } else {
        //其它相同类的容器
        return tabColapseCardAnalysis(comp);
    }
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
    // 第三类容器统一通过 containerType + containerFields 识别
    if (data.containerType && Array.isArray(data.containerFields)) {
        return {type: data.containerType, dataList: data.containerFields};
    }
    return null;
}

/**
 * App 端拆解上下文
 * containerRelationNames: 配了容器联动(controlTarget=container)的 subTablePrimaryKey 集合
 *   这些容器在 App 端拆解时需保留"影子"对象,供 findContainerItems 定位实现显隐控制
 */
interface AppConvertCtx {
    containerRelationNames: Set<string>;
}

/**
 * 扫描 fieldList,收集所有 dataRelation 中 controlTarget=container 的 relationFields(subTablePrimaryKey)
 * 用于判断哪些容器在 App 端拆解后仍需保留以支持容器级联动控制
 */
const collectContainerRelationNames = (fieldList: any): Set<string> => {
    const names = new Set<string>();
    if (!Array.isArray(fieldList)) return names;
    const scan = (fields: any[]) => {
        if (!Array.isArray(fields)) return;
        for (const field of fields) {
            if (Array.isArray(field)) {
                scan(field);
                continue;
            }
            if (field == null || typeof field !== "object") continue;
            const relation = field?.preps?.dataRelation;
            if (
                relation?.relationDetails &&
                Array.isArray(relation.relationDetails)
            ) {
                for (const detail of relation.relationDetails) {
                    if (detail?.controlTarget === "container") {
                        const rf = detail.relationFields;
                        const arr = Array.isArray(rf) ? rf : rf ? [rf] : [];
                        arr.forEach((n: string) => names.add(n));
                    }
                }
            }
            if (Array.isArray(field.children)) scan(field.children);
            for (const key of formContainerListKeys) {
                const list = (field as any)[key];
                if (Array.isArray(list)) {
                    for (const item of list) {
                        if (item?.fieldList) scan(item.fieldList);
                    }
                }
            }
        }
    };
    scan(fieldList);
    return names;
};

function analysisComps(fieldList: any, ctx?: AppConvertCtx) {
    if (!fieldList?.length) {
        return [];
    }
    const _ctx = ctx || {
        containerRelationNames: collectContainerRelationNames(fieldList),
    };
    const tempFieldList: any[] = [];
    if (!Array.isArray(fieldList)) {
        return fieldList ? [fieldList] : [];
    }

    for (let i = 0; i < fieldList.length; i++) {
        const filed = fieldList[i];
        const commonContainer = checkContainerType(filed);

        if (commonContainer) {
            // 统一容器:数据均来自 containerFields,按 containerType 分发保持各容器处理语义
            if (
                commonContainer.type === "dytable" ||
                commonContainer.type == "gridtable"
            ) {
                const dyData =
                    commonContainer.dataList[0]?.fieldList || commonContainer.dataList;
                processDytableFieldList(dyData, tempFieldList);
            } else if (commonContainer.type === "table") {
                processBatchFieldContainer(commonContainer.dataList, tempFieldList);
            } else {
                processContainer(filed, commonContainer, tempFieldList, _ctx);
            }
        } else if (filed.appList) {
            tempFieldList.push(...filed.appList);
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

function processDytableFieldList(dytableFieldList: any[], result: any[]) {
    for (let j = 0; j < dytableFieldList.length; j++) {
        const row = dytableFieldList[j];
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

function processContainer(
    filed: any,
    commonContainer: any,
    result: any[],
    ctx: AppConvertCtx,
) {
    // APP 端保留 step 容器分段结构，仅扁平化每段内部字段，避免各段字段被展开到同级
    // 导致分段审批逻辑(segments 权限/当前阶段/只读隐藏)丢失；保留后由 stepItem.vue 渲染，
    // 每段内部字段按 appItem.vue 显示
    if (commonContainer.type === "step") {
        if (filed.__appStepReserved) {
            result.push(filed);
            return;
        }
        const stepContainer = {
            ...filed,
            containerFields: commonContainer.dataList.map((step: any) => ({
                ...step,
                fieldList: analysisComps(step.fieldList, ctx),
            })),
            __appStepReserved: true,
        };
        result.push(stepContainer);
        return;
    }
    const dataList = commonContainer.dataList;
    for (let j = 0; j < dataList.length; j++) {
        const container = dataList[j];
        const subForm = container.subFormFlag == "Y";
        const title = container.title;
        const commonFieldList = analysisComps(container.fieldList, ctx);
        if (title && !subForm) {
            //子表单容器的标题由 appItem.vue 通过 appItem.title 渲染,不重复添加
            //使用 reactive 包裹:容器联动通过 __containerHidden 控制显隐,需响应式才能触发重渲染
            commonFieldList.splice(
                0,
                0,
                reactive({
                    type: "text",
                    staticData: true,
                    formVisible: container.formVisible,
                    visiblePlatform: "app",
                    preps: {
                        textContent: title,
                    },
                }),
            );
        }
        if (subForm) {
            const newItem = {
                ...container,
                fieldList: commonFieldList,
                oldType: commonContainer.type,
            };
            result.push({appList: [newItem]});
        } else {
            // 非子表单容器:内部字段展开到同级
            result.push(...commonFieldList);
            // 如果该容器被配了容器联动(controlTarget=container),
            // 保留一个"影子"容器对象(只保留控制必要属性 + 字段引用),供 findContainerItems 定位
            // fieldList 引用 commonFieldList(共享同一组字段对象,不复制),供 syncContainerVisibility 同步 __containerHidden
            // 不用 ...container 全量浅拷贝,避免持有不必要的属性占用内存
            if (
                container.subTablePrimaryKey &&
                ctx.containerRelationNames.has(container.subTablePrimaryKey)
            ) {
                result.push({
                    subTablePrimaryKey: container.subTablePrimaryKey,
                    title: container.title,
                    formVisible: container.formVisible,
                    disabled: container.disabled,
                    fieldList: commonFieldList,
                    __appContainer: true,
                    //引用原始容器:syncContainerVisibility 通过此引用设置 formVisible,
                    //触发 platformFields 重算后,新 title 文本项读取到最新的 formVisible 值
                    __originContainer: container,
                });
            }
        }
    }
}

/**
 * 统一容器版批量表格处理:数据来自 containerFields(containerType='table')
 * 与 processBatchField 等价,但 item 为 ContainerFieldInfo(subTablePrimaryKey/preps 结构)
 */
function processBatchFieldContainer(containers: any[], result: any[]) {
    for (let j = 0; j < containers.length; j++) {
        const item = containers[j];
        const fieldListItems = analysisComps(item.fieldList);
        const newItem = {...item, fieldList: fieldListItems};
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
    const {selectList, compListResult, fieldList, searchItemList} =
        analysisCompDatas(dataList);
    const tempFieldList = analysisComps(fieldList);
    const result = convertPcCompToFitPlatformComps({fieldList: tempFieldList});
    return {
        selectList,
        compListResult,
        fieldList: result.fieldList,
        searchItemList,
    };
}

/**
 * 递归为字段补充稳定 id（在字段进入渲染前调用）
 * id 参与组件 key 计算（compKey 取 item.id || item.fieldName），若首次渲染后才补 id
 * （如 StarHorseItem 挂载时），会导致 key 变化、子树重新挂载、字段组件重复初始化
 * （如 select 的选项接口被请求两次）。优先取 preps.id，其次 fieldName
 * （与 compKey 的回退值一致，赋值前后 key 不变），最后 uuid
 * @param pageInfo 页面字段结构（{ fieldList, containerFields }，兼容查询字段结构）
 */
export function ensureFieldIds(pageInfo: any) {
    if (!pageInfo) {
        return;
    }
    const assignIds = (node: any) => {
        if (!node) {
            return;
        }
        if (Array.isArray(node)) {
            node.forEach(assignIds);
            return;
        }
        if (typeof node != "object") {
            return;
        }
        if (!node.id) {
            node.id = node.preps?.id ?? node.fieldName ?? uuid();
        }
        // 递归处理子级结构：分组/级联子节点、APP 端列表、兄弟节点、容器及其内部字段
        assignIds(node.children);
        assignIds(node.appList);
        assignIds(node.brotherNodes);
        assignIds(node.containerFields);
        assignIds(node.fieldList);
    };
    assignIds(pageInfo.fieldList);
    assignIds(pageInfo.containerFields);
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
 * APP 端 label 规则：
 * 1) labelFor: 静态文本组件(html/text)配 preps.labelFor 指向的字段，APP 端把 hideLabel 置 false
 *    并回填 label/placeholder(用文本内容)
 * 2) hideLabel: PC 端 hideLabel=true 的字段，APP 端默认显示 label(hideLabel=false)，
 *    除非显式配 appLabelVisible
 * 作用于扁平化后的字段数组；step 容器保留分段结构时，各段内部字段需收集后一并传入
 */
const applyAppLabelRules = (comps: any[]) => {
    if (!Array.isArray(comps)) return;
    const staticComps = comps.filter((item) => {
        return item && (item?.type == "html" || item?.type == "text");
    });
    const labelForComps = staticComps.filter((item) => item?.preps?.labelFor);
    labelForComps.forEach((staticData) => {
        const labelFors: string[] = staticData.preps?.labelFor;
        comps
            ?.filter((item) => labelFors.includes(item.fieldName))
            ?.forEach((item) => {
                if (!item.preps) {
                    item.preps = {};
                }
                item.preps.hideLabel = false;
                item.label = staticData?.preps?.textContent;
                item.preps.placeholder = i18n("api.pleaseInput2") + item?.label;
            });
    });
    comps
        ?.filter((item) => {
            return (
                !["html", "text"].includes(item?.type) &&
                item?.preps?.hideLabel &&
                !item?.preps?.appCompVisible &&
                !item?.preps?.appLabelVisible
            );
        })
        ?.forEach((item) => {
            item.preps.hideLabel = false;
        });
};

/**
 * 将pc模型转为app模型
 * @param pageInfo
 */
export function convertCompToAppComps(pageInfo: PageFieldInfo) {
    //如果不是手机端，则直接返回
    const tempFieldList = analysisComps(pageInfo.fieldList);
    let appVisibleComps = tempFieldList?.filter(
        (item) => !item?.preps?.appCompVisible,
    );
    // step 容器保留分段结构后，各段内部字段未在顶层；收集后与顶层字段统一应用 APP label 规则
    // 字段对象引用共享，applyAppLabelRules 直接修改属性即生效于各段 fieldList
    const stepInnerFields: any[] = [];
    appVisibleComps?.forEach((item) => {
        if (item?.containerType === "step" && Array.isArray(item.containerFields)) {
            item.containerFields.forEach((step: any) => {
                if (Array.isArray(step?.fieldList)) {
                    stepInnerFields.push(...step.fieldList);
                }
            });
        }
    });
    applyAppLabelRules([...(appVisibleComps || []), ...stepInnerFields]);
    //将数据进行排序显示
    appVisibleComps = appVisibleComps?.sort((a, b) => {
        const indexA = a.preps?.dataIndex ?? 0;
        const indexB = b.preps?.dataIndex ?? 0;
        return indexA - indexB;
    });
    // 顶层 containerFields（仅 table 类型）：对每个子容器的 fieldList 做 APP 扁平化后保留
    let appContainerFields: any[] | undefined;
    if (Array.isArray(pageInfo.containerFields)) {
        appContainerFields = pageInfo.containerFields.map((container: any) => ({
            ...container,
            fieldList: analysisComps(container.fieldList),
        }));
    }
    return {
        fieldList: appVisibleComps?.length>0 ? [{appList: appVisibleComps}] : [],
        containerFields: appContainerFields,
    };
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
    // 兼容 preps 下的属性，优先取 preps 中的值
    const preps = item.preps || {};
    const required = preps.required ?? item.required;
    const disabled = preps.disabled ?? item.disabled;
    const label = preps.label ?? item.label;
    if (required && (required === true || required == "true") && !disabled) {
        rules.push({
            required: true,
            message: `${label}${i18n("api.cannotBeEmpty")}`,
            trigger: "blur",
        });
    }
    if (item?.type == "number-range") {
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
                const formData = unref(dataForm) || {};
                const minValue = formData[`${minName}`];
                const maxValue = formData[`${maxName}`];
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
        if (item && item.subTableName) {
            if (!Object.keys(dataForm).includes(item.subTableName)) {
                dataForm[item.subTableName] =
                    !item.mapping || item.mapping == "1" ? {} : [{}];
            }
        }
        //如果映射关系是1对多
        if (item.mapping == "n") {
            let dataIndex = getDataIndex(item, prefix, parentIndex, index);
            let len = dataForm[item.subTableName].length;
            if (dataIndex >= len) {
                dataForm[item.subTableName].push({});
                dataIndex = len - 1;
            }
            return dataForm[item.subTableName][dataIndex];
        } else {
            return dataForm[item.subTableName];
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
            pronPrefix = prefix + "." + data.subTableName;
            if (data.mapping == "n") {
                pronPrefix = +"." + (parentIndex > -1 ? 0 : index);
            }
        } else {
            pronPrefix = prefix;
        }
    } else if (data.subFormFlag == "Y") {
        //如果父表大于0,说明当前是父表的子表，应该用父表的索引
        pronPrefix = data.subTableName;
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

/**
 * 处理属性
 * @param fieldList
 * @param parentKey
 * @param result
 */
export const processFieldList = (
    fieldList: any[],
    parentKey: string = "",
    result: any[],
) => {
    if (!fieldList) return;
    for (const [index, item] of fieldList.entries()) {
        const key = `${parentKey}_${index}`;

        if (Array.isArray(item)) {
            processFieldList(item, `${key}_array`, result);
        } else if (item.containerFields?.length > 0) {
            // 第三类容器统一处理:tab/card/collapse/splitter/step/descriptions/dialog/drawer/fieldset 等
            item.containerFields.forEach(
                (containerItems: any, containerIndex: number) => {
                    processFieldList(
                        containerItems.fieldList,
                        `${key}_${item.containerType}_${containerIndex}`,
                        result,
                    );
                },
            );
        } else {
            result.push({
                item,
                key: compKey(item, key),
            });
        }
    }
};

// 统一容器列表属性(批量表格/动态表格由组件自行校验,App端扁平化结构 appList 单独处理)
const formContainerListKeys = ["containerFields"];

/**
 * 递归收集容器内字段的 prop 路径（与 otherItem 渲染时的 loadProp 逻辑一致）
 * - 叶子字段: loadProp(currentPrefix, fieldName, -1, -1)
 * - group 容器: children 直接为字段数组，同前缀递归
 * - 嵌套容器: 通过 getPrefix 计算子级前缀后递归
 * - appList（移动端扁平化）: 逐项处理
 * - containerFields: 跳过，由表格组件自行校验
 * @param items 字段列表
 * @param currentPrefix 当前层级前缀
 * @param result 累积结果数组
 */
export const collectFieldProps = (
    items: any,
    currentPrefix: string,
    result: string[] = [],
): string[] => {
    if (!Array.isArray(items) || !items.length) return result;
    items.forEach((item: any) => {
        if (!item) return;
        // fieldList 中混入的数组（同行多字段布局）
        if (Array.isArray(item)) {
            collectFieldProps(item, currentPrefix, result);
            return;
        }
        // group 容器：children 直接为字段数组
        if (Array.isArray(item.children) && item.children.length > 0) {
            collectFieldProps(item.children, currentPrefix, result);
            return;
        }
        // 嵌套容器：按列表属性识别，递归进入子项 fieldList
        const childKey = formContainerListKeys.find(
            (k) => Array.isArray(item[k]) && item[k].length > 0,
        );
        if (childKey) {
            item[childKey].forEach((child: any, childIdx: number) => {
                if (!child) return;
                const childPrefix = getPrefix(child, currentPrefix, -1, childIdx);
                collectFieldProps(
                    child.fieldList || child.children || [],
                    childPrefix,
                    result,
                );
            });
            return;
        }
        // appList（移动端扁平化结构）
        if (Array.isArray(item.appList) && item.appList.length > 0) {
            item.appList.forEach((child: any) => {
                if (!child || child.__appContainer || child.__containerHidden) return;
                if (Array.isArray(child.fieldList) && child.fieldList.length) {
                    const childPrefix = getPrefix(child, currentPrefix, -1, 0);
                    collectFieldProps(child.fieldList, childPrefix, result);
                } else if (child.fieldName) {
                    const preps = child.preps || {};
                    if (child.formVisible === false || (preps.disabled ?? child.disabled))
                        return;
                    result.push(loadProp(currentPrefix, child.fieldName, -1, -1));
                }
            });
            return;
        }
        // 容器跳过（containerFields 由容器组件自行处理，非叶子字段）
        if (Array.isArray(item.containerFields)) return;
        // 叶子字段
        const preps = item.preps || {};
        const disabled = preps.disabled ?? item.disabled;
        if (item.formVisible === false || disabled) return;
        if (item.fieldName) {
            result.push(loadProp(currentPrefix, item.fieldName, -1, -1));
        }
    });
    return result;
};
