import {Config} from "@/api/settings";
import {SelectOption} from "@/components/types/SearchProps";
import {defineStore} from "pinia";
import {ref, shallowRef, unref} from "vue";
import JSON5 from "json5";
import {CompType} from "@/components/types/FormType";

export const useDesignFormStore = defineStore("designForm", () => {
    const containerList = ref<CompType[]>([]);
    const formDataList = ref<CompType[]>([]);
    const selfFormDataList = ref<CompType[]>([]);
    const allFormDataList = ref<Array<any>>([]);
    const formInfo = ref<any>({});
    const compList = ref<Array<any>>([]);
    const compListNoLayer = shallowRef<Record<string, any>>({});
    const formData = ref<any>({});
    const currentComp = shallowRef<Array<any> | any>();
    // 添加缓存状态标记和缓存结果
    const isCompListUpdated = ref<boolean>(true);
    const cachedCompListNoLayer = shallowRef<Record<string, any>>({});
    const cachedSelectList = shallowRef<any>([]);

    const currentItemType = ref<string>("");
    const currentCompCategory = ref<string>("");
    const parentCompType = ref<string>("");
    const currentItemId = ref<string>("");
    const currentSubItemId = ref<string>("");
    const currentSubTabName = ref<string>("");
    const isEdit = ref<boolean>(false);
    const componentVisible = ref<boolean>(false);
    const batchEditFieldVisible = ref<boolean>(false);
    const previewVisible = ref<boolean>(false);
    const refresh = ref<number>(0);
    const currentFormPreps = ref<any>({});
    const draggingItem = ref<any>({});
    const isDragging = ref<boolean>(false);
    const shortKeyDisabled = ref<boolean>(false);
    const historyRecord = ref<any>({
        index: -1,
        maxStep: 20,
        datas: [],
    });

    /**
     * 添加历史记录
     * @param reOrUnDoFlag 是否点击按钮时触发
     */
    const addHistoryRecord = (reOrUnDoFlag: boolean) => {
        //不需要添加历史记录
        if (reOrUnDoFlag || compList.value.length == 0) {
            return;
        }
        const record = historyRecord;
        const recordData: any = {
            complist: unref(compList),
            currentCompCategory: unref(currentCompCategory),
            currentItemId: unref(currentItemId),
            parentCompType: unref(parentCompType),
            currentItemType: unref(currentItemType),
            currentFormPreps: unref(currentFormPreps),
        };
        record.value.index = -1;
        record.value.datas.splice(0, 0, JSON5.stringify(recordData));
        //数据只存20条，当大于20条时，删除最旧的一条
        if (record.value.datas.length > record.value.maxStep) {
            record.value.datas.splice(record.value.datas.length - 1, 1);
        }
    };
    /**
     * 下一步
     */
    const redo = () => {
        //数据本身就是最新的
        if (historyRecord.value.index < 0) {
            return;
        }
        historyRecord.value.index = historyRecord.value.index - 1;
        reAndUnDo();
    };

    const reAndUnDo = () => {
        const record = unref(historyRecord);
        if (!record.datas[record.index]) {
            currentFormPreps.value = {};
            currentItemType.value = "";
            currentComp.value = {};
            currentItemId.value = "";
            parentCompType.value = "";
            currentCompCategory.value = "";
            compList.value = [];
        } else {
            const data = JSON5.parse(record.datas[record.index]);
            setCompList(data.complist);
            currentCompCategory.value = data.currentCompCategory;
            currentItemId.value = data.currentItemId;
            parentCompType.value = data.parentCompType;
            currentItemType.value = data.currentItemType;
            currentFormPreps.value = data.currentFormPreps;
        }
    };

    /**
     * 上一步
     */
    const undo = () => {
        const record = unref(historyRecord);
        historyRecord.value.index = record.index < 0 ? 1 : record.index + 1;
        //上一步大于已存在的数据量
        if (historyRecord.value.index > record.datas.length) {
            historyRecord.value.index = record.datas.length - 1;
        }
        //达到最大步骤，取允许的最大数据
        if (historyRecord.value.index > record.maxStep) {
            historyRecord.value.index = record.maxStep;
        }
        reAndUnDo();
    };
    /**
     * 激活组件的数下
     * @param data 数据
     * @param itemType 数据类型
     * @param parentType 父组件类型
     */
    const selectItem = (data: any, itemType: string, parentType: string) => {
        // Check for duplicate selection to avoid unnecessary updates
        if (currentItemId.value === data?.id) {
            return;
        }

        currentCompCategory.value = data.compType;
        currentItemId.value = data?.id;
        parentCompType.value = parentType;
        currentComp.value = data;
        currentItemType.value = itemType || data.itemType;
        currentFormPreps.value = data.preps || data;
        setIsDragging(false);
    };
    /**
     * 刷新页面
     */
    const setRefresh = () => {
        refresh.value++;
    };
    /**
     * 选中子组件
     * @param subItemId
     */
    const setSubItemId = (subItemId: string) => {
        currentSubItemId.value = subItemId;
    };
    const setCurrentSubTabName = (tabName: string) => {
        currentSubTabName.value = tabName;
    };
    /**
     * 设置表单信息
     * @param formData
     */
    const setFormInfo = (formData: any) => {
        Object.assign(formInfo.value, formData);
    };
    const setCompList = (comps: Array<any>) => {
        compList.value = comps;
        // 标记数据已更新，需要重新计算
        isCompListUpdated.value = true;
    };
    /**
     * 通过组件Id查找数据
     * @param itemId 组件Id
     * @returns
     */
    const selectItemById = (itemId: string) => {
        if (isCompListUpdated.value || Object.keys(compListNoLayer.value).length == 0) {
            loadCompNames();
        }

        // 直接从对象中获取，无需再进行find操作
        console.log(compListNoLayer.value);
        return compListNoLayer.value?.[itemId] || null;
    };
    /**
     * 强制刷新组件列表
     */
    const forceLoadCompNames = () => {
        const selectList: Array<any> = [];
        const compListResult: Record<string, any> = {};
        const stack: Array<{ datas: Array<any>; tabName?: string }> = [];
        const allChildItems: Array<any> = [];
        // 使用栈代替递归，初始化栈
        stack.push({datas: compList.value, tabName: undefined});
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

        // 更新缓存
        compListNoLayer.value = compListResult;
        cachedCompListNoLayer.value = compListResult;
        cachedSelectList.value = selectList;
        isCompListUpdated.value = false;

        return selectList;
    };
    /**
     * 获取属性列表，
     * 如果要使用compListNoLayer 必须先调用loadCompNames 方法
     */
    const loadCompNames = () => {
        // 如果数据未更新且有缓存结果，直接返回缓存
        if (!isCompListUpdated.value && cachedSelectList.value.length > 0) {
            compListNoLayer.value = cachedCompListNoLayer.value;
            return cachedSelectList.value;
        }
        return forceLoadCompNames();
    };

    /**
     * 手动添加组件
     * @param comp
     */
    const addComp = (comp: any) => {
        //如果已存在，则要过滤掉,不能重复添加
        if (Array.isArray(comp)) {
            compList.value = [...compList.value, ...comp];
        } else {
            compList.value.push(comp);
        }
    };
    const setFormData = (data: any) => {
        formData.value = data;
    };
    const setIsEdit = (editFlag: boolean) => {
        isEdit.value = editFlag;
    };
    const setCurrentComp = (currComp: object) => {
        currentComp.value = currComp;
    };
    const setCurrentItemType = (currItemType: string) => {
        currentItemType.value = currItemType;
    };
    const setParentCompType = (parentType: string) => {
        parentCompType.value = parentType;
    };
    const setCurrentItemId = (currItemId: string) => {
        currentItemId.value = currItemId;
    };
    const setCurrentFormPreps = (currFormPreps: any) => {
        currentFormPreps.value = currFormPreps["preps"] || currFormPreps;
    };
    const setContainerList = (list: CompType[]) => {
        containerList.value = list;
    };
    const addContainerList = (list: CompType[]) => {
        //如果已存在，则要过滤掉,不能重复添加
        if (Array.isArray(list)) {
            containerList.value = [...containerList.value, ...list];
        } else {
            containerList.value.push(list);
        }
    };
    const setFormDataList = (list: CompType[]) => {
        formDataList.value = list;
    };
    const addFormDataList = (list: CompType[]) => {
        //如果已存在，则要过滤掉,不能重复添加
        if (Array.isArray(list)) {
            formDataList.value = [...formDataList.value, ...list];
        } else {
            formDataList.value.push(list);
        }
    };
    const setSelfFormDataList = (list: CompType[]) => {
        selfFormDataList.value = list;
    };
    const addSelfFormDataList = (list: CompType[]) => {
        //如果已存在，则要过滤掉,不能重复添加
        if (Array.isArray(list)) {
            selfFormDataList.value = [...selfFormDataList.value, ...list];
        } else {
            selfFormDataList.value.push(list);
        }
    };
    const setAllFormDataList = (list: CompType[]) => {
        allFormDataList.value = list;
    };
    /**
     * 正在拖动中的组件
     * @param dragItem
     */
    const setDraggingItem = (dragItem: any) => {
        draggingItem.value = dragItem;
        setIsDragging(true);
    };
    /**
     * 设置是否正在拖动
     */
    const setIsDragging = (flag: boolean) => {
        isDragging.value = flag;
    };
    /**
     * 删除数据
     */
    const removePromise = () => {
        const comps = unref(compList);
        for (let i = 0; i < comps.length; i++) {
            const temp = comps[i];
            if (temp instanceof Promise) {
                temp.then((res) => {
                    if (Array.isArray(res)) {
                        comps.splice(i, 1, ...res);
                    } else {
                        comps.splice(i, 1, res);
                    }
                });
            }
        }
    };
    /**
     * 清除所有数据
     */
    const clearAll = (_initComp: boolean = true) => {
        const ms = new Date().getTime();
        isEdit.value = true;
        isDragging.value = false;
        currentFormPreps.value = {};
        currentItemType.value = "";
        currentComp.value = {};
        currentItemId.value = "";
        currentItemType.value = "";
        parentCompType.value = "";
        currentCompCategory.value = "";
        formInfo.value = {
            rules: "",
            inline: "N",
            labelPosition: "left",
            labelWidth: "",
            labelSuffix: "",
            hideRequiredAsterisk: "N",
            requireAsteriskPosition: "left",
            showMessage: "Y",
            inlineMessage: "N",
            statusIcon: "N",
            primaryKeyPolicy: "manual",
            createTable: "Y",
            validateOnRuleChange: "Y",
            size: Config.compSize,
            disabled: "N",
            dataIndex: 1,
            scrollToError: "N",
            formId: "id" + ms,
            tbName: "tb" + ms,
        };
        compList.value = [];
        formData.value = {index: 1};
        historyRecord.value = {
            index: -1,
            maxStep: 20,
            datas: [],
        };
    };
    const setComponentVisible = (visible: boolean) => {
        componentVisible.value = visible;
    };
    const setBatchEditFieldVisible = (visible: boolean) => {
        batchEditFieldVisible.value = visible;
    };
    const setPreviewVisible = (visible: boolean) => {
        previewVisible.value = visible;
    };
    const setShortKeyDisabled = (disabled: boolean) => {
        shortKeyDisabled.value = disabled;
    };
    /**
     * 获取字段索引
     */
    const getFieldDataIndex = () => {
        if (!formInfo.value["dataIndex"]) {
            formInfo.value["dataIndex"] = 1;
        }
        return formInfo.value["dataIndex"]++;
    };
    return {
        formData,
        formInfo,
        compList,
        containerList,
        formDataList,
        selfFormDataList,
        allFormDataList,
        currentCompCategory,
        currentItemId,
        parentCompType,
        currentItemType,
        currentFormPreps,
        currentSubItemId,
        isEdit,
        isDragging,
        currentComp,
        draggingItem,
        refresh,
        historyRecord,
        componentVisible,
        batchEditFieldVisible,
        previewVisible,
        shortKeyDisabled,
        setCurrentSubTabName,
        selectItemById,
        setAllFormDataList,
        setSelfFormDataList,
        setFormDataList,
        setContainerList,
        addSelfFormDataList,
        addContainerList,
        addFormDataList,
        addHistoryRecord,
        redo,
        undo,
        selectItem,
        setRefresh,
        setSubItemId,
        setFormInfo,
        setCompList,
        forceLoadCompNames,
        loadCompNames,
        addComp,
        setIsDragging,
        setFormData,
        setIsEdit,
        setCurrentComp,
        setCurrentItemType,
        setParentCompType,
        setCurrentItemId,
        setCurrentFormPreps,
        setDraggingItem,
        removePromise,
        clearAll,
        setComponentVisible,
        setBatchEditFieldVisible,
        setPreviewVisible,
        setShortKeyDisabled,
        getFieldDataIndex,
    };
});
