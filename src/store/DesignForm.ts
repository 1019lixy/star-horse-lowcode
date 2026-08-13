import { defineStore } from "pinia";
import { computed, nextTick, ref, shallowRef, triggerRef, unref } from "vue";
import JSON5 from "json5";
import { CompType } from "@/components/types/FormType";
import { analysisCompDatas } from "@/api/form_utils";
import { UserInfo } from "@/components/types";

export const useDesignFormStore = defineStore("designForm", () => {
  const containerFields = ref<CompType[]>([]);
  const formDataList = ref<CompType[]>([]);
  const selfFormDataList = ref<CompType[]>([]);
  const allFormDataList = ref<Array<any>>([]);
  const formInfo = ref<any>({});
  const compList = ref<Array<any>>([]);
  const compListNoLayer = shallowRef<Record<string, any>>({});
  const editUserList = shallowRef<Record<string, UserInfo>>({});
  const formData = ref<any>({});
  const currentComp = ref<Array<any> | any>();
  // 添加缓存状态标记和缓存结果
  const isCompListUpdated = ref<boolean>(true);
  const cachedCompListNoLayer = shallowRef<Record<string, any>>({});
  const cachedSelectList = shallowRef<any>([]);
  const parentContainer = ref<Record<string, any>>({});
  const currentItemType = ref<string>("");
  const currentCompCategory = ref<string>("");
  const parentCompType = ref<string>("");
  const currentItemId = ref<string>("");
  const currentSubItemId = ref<string>("");
  const currentSubItem = ref<Record<string, any>>({});
  const currentSubTabName = ref<string>("");
  const isEdit = ref<boolean>(false);
  const componentVisible = ref<boolean>(false);
  const batchEditFieldVisible = ref<boolean>(false);
  const previewVisible = ref<boolean>(false);
  const refresh = ref<number>(0);
  // currentFormPreps 改为 computed，始终从 currentComp 读取最新的 preps
  // 这样当组件类型改变导致 preps 被替换时，currentFormPreps 会自动更新
  const currentFormPreps = computed(() => {
    const comp = currentComp.value;
    return comp?.preps || comp || {};
  });
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
      currentItemType.value = "";
      currentComp.value = {};
      currentItemId.value = "";
      parentCompType.value = "";
      currentCompCategory.value = "";
      compList.value = [];
      isCompListUpdated.value = true;
    } else {
      const data = JSON5.parse(record.datas[record.index]);
      setCompList(data.complist);
      currentCompCategory.value = data.currentCompCategory;
      currentItemId.value = data.currentItemId;
      parentCompType.value = data.parentCompType;
      currentItemType.value = data.currentItemType;
      // currentFormPreps 现在是 computed，会自动从 currentComp 读取
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
   * 激活组件的
   * @param data 数据
   * @param itemType 数据类型
   * @param parentType 父组件类型
   */
  const selectItem = (data: any, itemType: string, parentType: string) => {
    const itemId = data?.id || data?.preps?.id;
    currentItemId.value = itemId;
    currentCompCategory.value = data?.compType || "";
    parentCompType.value = parentType;
    currentComp.value = null;
    triggerRef(currentComp);
    nextTick(() => {
      currentComp.value = data;
      currentItemType.value = itemType || data?.itemType || "";
      setIsDragging(false);
      setRefresh();
      triggerRef(currentComp);
    });
  };
  //设置父容器
  const setParentContainer = (item: any) => {
    parentContainer.value = item;
  };
  //获取容器
  const getParentContainer = () => {
    return parentContainer.value;
  };
  /**
   * 刷新页面
   */
  const setRefresh = () => {
    refresh.value++;
  };
  /**
   * 选中子组件
   * @param subItem
   */
  const setSubItem = (subItem: any) => {
    currentSubItemId.value = subItem.id;
    currentSubItem.value = subItem;
  };
  const setCurrentSubTabName = (tabName: string) => {
    currentSubTabName.value = tabName;
  };
  /**
   * 获取父级组件类型
   */
  const getParentCompType = () => {
    return parentCompType.value;
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
    if (
      isCompListUpdated.value ||
      Object.keys(compListNoLayer.value).length == 0
    ) {
      loadCompNames();
    }

    // 直接从对象中获取，无需再进行find操作
    return compListNoLayer.value?.[itemId] || null;
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
    let { compListResult, selectList } = analysisCompDatas(compList);
    compListNoLayer.value = compListResult;
    cachedCompListNoLayer.value = compListResult;
    cachedSelectList.value = selectList;
    isCompListUpdated.value = false;
    return selectList;
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
    isCompListUpdated.value = true;
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
    // currentFormPreps 现在是 computed，需要更新 currentComp 的 preps
    if (currentComp.value) {
      currentComp.value.preps = currFormPreps["preps"] || currFormPreps;
    }
  };
  const setContainerList = (list: CompType[]) => {
    containerFields.value = list;
  };
  const addContainerList = (list: CompType[]) => {
    //如果已存在，则要过滤掉,不能重复添加
    if (Array.isArray(list)) {
      containerFields.value = [...containerFields.value, ...list];
    } else {
      containerFields.value.push(list);
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
    currentItemType.value = "";
    currentComp.value = {};
    currentItemId.value = "";
    currentItemType.value = "";
    parentCompType.value = "";
    currentCompCategory.value = "";
    // currentFormPreps 现在是 computed，会自动从 currentComp 读取
    editUserList.value = {};
    parentContainer.value = {};
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
      size: "default",
      disabled: "N",
      dataIndex: 1,
      scrollToError: "N",
      formId: "id" + ms,
      tbName: "tb" + ms,
    };
    compList.value = [];
    isCompListUpdated.value = true;
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
  /**
   * 获取当前组件编辑用户的信息
   * @param compId 组件Id
   */
  const getCurrentCompEditUserInfo = (compId: string): UserInfo => {
    return editUserList.value && editUserList.value[compId];
  };
  /**
   * 添加当前编辑组件的用户
   * @param compId 组件Id
   * @param userinfo 用户信息
   */
  const addCurrentCompEditUserInfo = (compId: string, userinfo: UserInfo) => {
    // if (editUserList.value && editUserList.value[compId]) {
    //     warning("其它人正在编辑该组件");
    //     return;
    // }
    Object.entries(editUserList.value).forEach(([key, value]) => {
      if (value.userId == userinfo.userId) {
        delete editUserList.value[key];
      }
    });
    editUserList.value[compId] = userinfo;
  };
  /**
   * 删除当前编辑的组件
   * @param compId
   */
  const removeCurrentCompEditUserInfo = (compId: string) => {
    editUserList.value && delete editUserList.value[compId];
  };
  return {
    formData,
    formInfo,
    compList,
    containerFields,
    formDataList,
    selfFormDataList,
    allFormDataList,
    currentCompCategory,
    currentItemId,
    parentCompType,
    currentItemType,
    currentFormPreps,
    currentSubItemId,
    currentSubItem,
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
    setParentContainer,
    getParentContainer,
    getParentCompType,
    addSelfFormDataList,
    addContainerList,
    addFormDataList,
    addHistoryRecord,
    redo,
    undo,
    selectItem,
    setRefresh,
    setSubItem,
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
    getFieldDataIndex,
    getCurrentCompEditUserInfo,
    addCurrentCompEditUserInfo,
    removeCurrentCompEditUserInfo,
  };
});
