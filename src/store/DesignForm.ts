import { Config } from "@/api/settings";
import { SelectOption } from "@/components/types/SearchProps";
import { defineStore } from "pinia";
import { ref, shallowRef, unref } from "vue";
import JSON5 from "json5";

export const useDesignFormStore = defineStore("designForm", () => {
  const containerList = ref<Array<any>>([]);
  const formDataList = ref<Array<any>>([]);
  const selfFormDataList = ref<Array<any>>([]);
  const allFormDataList = ref<Array<any>>([]);
  const formInfo = ref<any>({});
  const compList = ref<Array<any>>([]);
  const compListNoLayer = shallowRef<any>([]);
  const formData = ref<any>({});
  const currentComp = shallowRef<Array<any> | any>();
  // 添加缓存状态标记和缓存结果
  const isCompListUpdated = ref<boolean>(true);
  const cachedCompListNoLayer = shallowRef<any>([]);
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
    if (isCompListUpdated.value || compListNoLayer.value?.length == 0) {
      loadCompNames();
    }
    return compListNoLayer.value?.find((item: any) => item.id == itemId);
  };
  /**
   * 强制刷新组件列表
   */
  const forceLoadCompNames = () => {
    const selectList: Array<any> = [];
    const compListResult: Array<any> = [];
    const stack: Array<{ datas: Array<any>; tabName?: string }> = [];

    // 使用栈代替递归，初始化栈
    stack.push({ datas: compList.value, tabName: undefined });
    while (stack.length > 0) {
      const { datas, tabName } = stack.pop()!;
      const currentSelectList: Array<any> = [];
      const currentCompList: Array<any> = [];

      for (const index in datas) {
        const temp = datas[index];
        if (temp.itemType === "box" || temp.itemType === "dytable") {
          const elements = temp.preps.elements;
          const children: SelectOption[] = [];
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
          for (const index in elements) {
            const element = elements[index];
            const tempTabName = tabName
              ? `${tabName}__${element.tabName}`
              : element.tabName;
            // 将子元素推入栈中处理
            stack.push({
              datas: element.items || [],
              tabName: tempTabName,
            });

            currentSelectList.push({
              name: element.label,
              value: element.objectName,
              tabName: tempTabName,
              id: temp.id,
              type: temp.itemType,
              compType: "container",
              children: [], // 后续会被栈处理结果填充
            });
          }
          currentCompList.push(temp);
        } else {
          currentSelectList.push({
            name: temp.preps?.label,
            value: temp.preps?.name,
            tabName,
            compType: "item",
            id: temp.preps?.id,
            type: temp.itemType ?? temp.preps?.itemType,
          });
          currentCompList.push(temp);
        }
      }

      // 批量添加结果，减少数组操作次数
      selectList.push(...currentSelectList);
      compListResult.push(...currentCompList);
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
    formData.value = { index: 1 };
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
