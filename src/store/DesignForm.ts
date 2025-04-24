import {defineStore} from 'pinia';
import {SelectOption} from '@/components/types/SearchProps';
import {Config} from '@/api/settings.ts';
import {ref, unref} from 'vue';

export const useDesignFormStore = defineStore('designForm', () => {
    const containerList = ref<Array<any>>([]);
    const formDataList = ref<Array<any>>([]);
    const selfFormDataList = ref<Array<any>>([]);
    const allFormDataList = ref<Array<any>>([]);
    const formInfo = ref<any>({});
    const compList = ref<any>([]);
    const formData = ref<any>({});
    const currentComp = ref<Array<any> | any>();
    const currentItemType = ref<string>('');
    const currentCompCategory = ref<string>('');
    const parentCompType = ref<string>('');
    const currentItemId = ref<string>('');
    const currentSubItemId = ref<string>('');
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
        datas: []
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
            currentFormPreps: unref(currentFormPreps)
        };
        record.value.index = -1;
        record.value.datas.splice(0, 0, JSON.stringify(recordData));
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
            currentItemType.value = '';
            currentComp.value = {};
            currentItemId.value = '';
            parentCompType.value = '';
            currentCompCategory.value = '';
            compList.value = [];
        } else {
            const data = JSON.parse(record.datas[record.index]);
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
    /**
     * 设置表单信息
     * @param formData
     */
    const setFormInfo = (formData: any) => {
        formInfo.value = {
            ...unref(formInfo),
            ...formData
        };
    };
    const setCompList = (comps: Array<any>) => {
        compList.value = comps;
    };
    /**
     * 获取属性列表
     */
    const loadCompNames = () => {
        const innerFunc = (datas: Array<any>) => {
            const selectList: Array<any> = [];
            for (const index in datas) {
                const temp: any = datas[index];
                if (temp.itemType == 'box' || temp.itemType == 'dytable') {
                    const elements = temp.preps.elements;
                    for (const sindex in elements) {
                        const columns = elements[sindex].columns;
                        for (const ssindex in columns) {
                            const column = columns[ssindex];
                            if (column.items && column.items.length > 0) {
                                selectList.push(
                                    ...column.items
                                        ?.map((item: any) => ({name: item.preps?.label, type: 'item', value: item.preps?.name}))
                                        .filter((item: SelectOption) => item.name)
                                );
                            }
                        }
                    }
                } else if (temp.itemType == 'table') {
                    const elements = temp.preps.elements;
                    const children: SelectOption[] = [];
                    for (const index in elements) {
                        const element = elements[index];
                        if (element.items && element.items.length > 0) {
                            children.push(
                                ...element.items
                                    ?.map((item: any) => ({name: item.preps?.label, value: item.preps?.name}))
                                    .filter((item: SelectOption) => item.name)
                            );
                        }
                    }
                    selectList.push({
                        name: temp.preps?.label,
                        value: temp.preps?.batchFieldName,
                        type: 'container',
                        children: children
                    });
                } else if (temp.itemType == 'tab' || temp.itemType == 'collapse' || temp.itemType == 'card') {
                    const elements = temp.preps?.elements;
                    for (const index in elements) {
                        const element = elements[index];
                        selectList.push({
                            name: element.label,
                            value: element.objectName,
                            type: 'container',
                            children: innerFunc(element.items)
                        });
                    }
                } else {
                    selectList.push({
                        name: temp.preps?.label,
                        value: temp.preps?.name,
                        type: 'item'
                    });
                }
            }
            return selectList;
        };
        return innerFunc(compList.value);
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
        currentFormPreps.value = currFormPreps['preps'] || currFormPreps;
    };
    const setContainerList = (list: any) => {
        containerList.value = list;
    };
    const setFormDataList = (list: any) => {
        formDataList.value = list;
    };
    const setSelfFormDataList = (list: any) => {
        selfFormDataList.value = list;
    };
    const setAllFormDataList = (list: any) => {
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
        // compList = [...JSON.parse(JSON.stringify(comps))];
    };
    /**
     * 清除所有数据
     */
    const clearAll = (_initComp: boolean = true) => {
        const ms = new Date().getTime();
        isEdit.value = true;
        isDragging.value = false;
        currentFormPreps.value = {};
        currentItemType.value = '';
        currentComp.value = {};
        currentItemId.value = '';
        currentItemType.value = '';
        parentCompType.value = '';
        currentCompCategory.value = '';
        formInfo.value = {
            rules: '',
            inline: 'N',
            labelPosition: 'left',
            labelWidth: '',
            labelSuffix: '',
            hideRequiredAsterisk: 'N',
            requireAsteriskPosition: 'left',
            showMessage: 'Y',
            inlineMessage: 'N',
            statusIcon: 'N',
            primaryKeyPolicy: 'manual',
            createTable: 'Y',
            validateOnRuleChange: 'Y',
            size: Config.compSize,
            disabled: 'N',
            dataIndex: 1,
            scrollToError: 'N',
            formId: 'id' + ms,
            tbName: 'tb' + ms
        };
        compList.value = [];
        formData.value = {index: 1};
        historyRecord.value = {
            index: -1,
            maxStep: 20,
            datas: []
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
        if (!formInfo.value['dataIndex']) {
            formInfo.value['dataIndex'] = 1;
        }
        return formInfo.value['dataIndex']++;
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
        setAllFormDataList,
        setSelfFormDataList,
        setFormDataList,
        setContainerList,
        addHistoryRecord,
        redo,
        undo,
        selectItem,
        setRefresh,
        setSubItemId,
        setFormInfo,
        setCompList,
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
        getFieldDataIndex
    };
});
