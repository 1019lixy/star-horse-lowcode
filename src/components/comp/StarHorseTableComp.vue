<script setup lang="ts" name="StarHorseTableComp">
import {deleteByIds, download, loadData, postRequest,} from "@/api/star_horse_apis";
import {closeLoad, createCondition, isJson, load,} from "@/api/star_horse_utils";
import {compKey, removeEmptyCondition, uuid} from "@/api/system";
import Tablebtn from "@/components/comp/items/tablebtn.vue";
import TableColumnItem from "@/components/comp/items/tableColumnItem.vue";
import Help from "@/components/help.vue";
import {DialogProps} from "@/components/types/DialogProps";
import {FieldInfo, OrderByInfo, UserFuncInfo,} from "@/components/types/PageFieldInfo";
import {DataListProps, PageProps} from "@/components/types/PageProps";
import {BtnHideCondition, SearchParams} from "@/components/types/Params";
import piniaInstance from "@/store";
import {useButtonPermissionStore} from "@/store/ButtonPermission";
import {useDynamicFormStore} from "@/store/DynamicForm";
import {useGlobalConfigStore} from "@/store/GlobalConfig";
import {isSystemManage} from "@/utils/auth";
import {error, warning} from "@/utils/message";
import Sortable from "sortablejs";
import {i18n} from "@/lang";
import {computed, inject, onActivated, onMounted, onUnmounted, ref, unref, watch,} from "vue";
import {isMobile} from "@/api/device";
import {convertCompToAppComps} from "@/api/form_utils";
import type {PreValid} from "@/components/types";

const dynamicForm = useDynamicFormStore(piniaInstance);
const props = withDefaults(defineProps<DataListProps>(), {
  hideBtnCondition: (): BtnHideCondition[] => [],
  height: "400",
  showPageBar: true,
  allowSelectParent: true,
  needLoad: true,
  preValidFunc: (): PreValid[] => [],
  lineHeight: "30px",
  showSelection: true,
  commonPersons: (): Array<any> => [],
  reverseDataList: (): Array<any> => [],
  userColumnName: "a.createdBy",
  btnPermissions: (): Record<string, string> => ({}),
  pageCombList: (): number[] => [20, 50, 100, 200, 300, 400],
  pageBarLayout: "total, sizes, prev, pager, next, jumper,slot"
});
const emits = defineEmits(["selectItem", "permission"]);
let pagePermission = useButtonPermissionStore(piniaInstance);
let configStore = useGlobalConfigStore(piniaInstance);
let permissions = ref<Record<string, string>>({});
const configInfo = computed(() => configStore.configFormInfo);
let compSize = computed(
    () => configStore.configFormInfo?.inputSize || "default",
);
const multipleSelection = ref<any>([]);
const cardSelection = ref<any>([]);
const starHorseTableCompRef = ref();
const baseInfo: PageProps = {
  pageSize: 20,
  currentPage: 1,
  totalData: 0,
  totalPage: 0,
  dataList: [],
};
let pageInfo = ref<PageProps>({});
let searchFields = ref<Array<SearchParams>>([]);
let orderBys = ref<Array<OrderByInfo>>([]);
let fieldVisible = ref<boolean>(false);
let dialogProps = inject("dialogProps") as DialogProps;
let toolFields = ref<Array<any>>([]);
const exportOperationVisible = ref<boolean>(false);
/**
 * Button area event
 * @param authority Permission code
 */
const tableCompFunc = (authority: any) => {
  if (authority == "refresh") {
    if (isMobile) {
      pageInfo.value.currentPage = 1;
      searchFlag.value = true;
    }
    loadByPage();
  } else if (authority == "batchDelete") {
    batchDelete();
  } else if (authority == "export") {
    exportOperationVisible.value = true;
  } else if (authority == "execution") {
    console.log(i18n("comp.youClickedExecuteButton"));
  }
};

const selectedFields = () => {
  exportData();
  exportOperationVisible.value = false;
};
/**
 * 检查是否有操作权限和自定函数需要覆盖原有的逻辑
 * @param authCode 权限码
 * @param params 参数
 */
const overrideOperation = (authCode: string, params: any) => {
  if (!permissions?.value[authCode]) return true;
  const viewBtn = props.extendBtns?.find((item) => item.authority == authCode);
  if (viewBtn && viewBtn.funcName && viewBtn.override) {
    if (typeof viewBtn.funcName === "function") {
      viewBtn.funcName(params);
    } else {
      console.log("overrideOperation:", viewBtn.funcName);
    }
    return true;
  }
  return false;
};
const exportData = () => {
  let ids: any = getIds();
  if (overrideOperation("export", ids)) {
    return;
  }
  load(i18n("comp.dataProcessing"));
  let params = [];
  let keys: any = props.primaryKey;
  if (ids.length > 0) {
    if (Array.isArray(keys)) {
      for (let key of keys) {
        let temp: Array<any> = [];
        for (let id in ids) {
          if (id[key]) {
            temp.push(id[key]);
          }
        }
        if (temp.length > 0) {
          params.push(createCondition(key, temp, "in"));
        }
      }
    } else {
      params.push(createCondition(keys, ids, "in"));
    }
  } else {
    params = searchFields.value;
  }
  if (params.length == 0) {
    params = searchFields.value;
  }
  let defaultCond: any = removeEmptyCondition(props.compUrl?.condition!);
  if (defaultCond?.length > 0) {
    params.push(...defaultCond);
  }
  let condition: any = {
    fieldList: params,
  };
  if (props.fieldList?.orderBy) {
    condition["orderBy"] = props.fieldList?.orderBy;
  }
  download(props.compUrl!.exportAllUrl!, condition)
      .catch((err: any) => {
        error(i18n("comp.interfaceNotFoundOrNetworkError") + err);
      })
      .finally(() => {
        closeLoad();
      });
};
const getIds = () => {
  let selectDatas = unref(multipleSelection);
  let ids: any = [];
  for (let key in selectDatas) {
    let temp = selectDatas[key];
    if (temp) {
      ids.push(analysisPrimaryKeys(props.primaryKey, temp));
    }
  }
  return ids;
};
/**
 * Batch delete
 */
const batchDelete = async () => {
  const ids: any = getIds();
  // if (overrideOperation("batchDelete", ids)) {
  //   return;
  // }
  await deleteById(ids);
};
/**
 * Create search conditions
 * @param formData
 * @param orderBy Sorting
 */
const searchFlag = ref<boolean>(false);
const createSearchParams = (
    formData: SearchParams[],
    orderBy: OrderByInfo[] = [],
) => {
  searchFields.value = formData;
  orderBys.value = orderBy;
  searchFlag.value = true;
  loadByPage();
};
/**
 * Export permissions
 */
const permissionList = () => {
  return permissions.value;
};
const init = async () => {
  Object.assign(pageInfo.value, baseInfo);
  // if (props.btnPermissions && Object.keys(props.btnPermissions).length > 0) {
  //
  // } else {
  pagePermission.setPermissionUrl(props.compUrl?.permissionsUrl);
  permissions.value = await pagePermission.addRoute(
      window.__hostRouter__?.currentRoute.value,
  );
  // }
  permissions.value = {...permissions.value, ...props.btnPermissions};
  emits("permission", permissions.value);
  if (!props.fieldList?.stopAutoLoad) {
    loadByPage();
  } else {
    pageInfo.value.dataList = props.tableDataList || [];
    starHorseTableCompRef.value?.clearSelection();
    props.reverseDataList?.forEach((item: any) => {
      starHorseTableCompRef.value?.toggleRowSelection(item, true);
    });
  }
  moveColumn();
  reCreateData();
  if (isMobile) {
    cardFieldList.value = loadField();
    console.log("cardFieldList", cardFieldList.value);
  }
};
// Listen for changes in data passed in from outside
watch(
    () => props.tableDataList?.length,
    (val) => {
      if (props.fieldList?.stopAutoLoad) {
        pageInfo.value.dataList = props.tableDataList;
      }
    },
    {immediate: false},
);
watch(() => cardSelection.value, (val) => {
  multipleSelection.value = Array.isArray(val) ? val : [val];
}, {immediate: false});
const assignData = (dataList: Array<any>) => {
  for (let key in dataList) {
    let temp: any = dataList[key];
    if (Array.isArray(temp)) {
      toolFields.value.push(...temp);
    } else if (temp.tabList?.length > 0) {
      for (let skey in temp.tabList) {
        let stemp = temp.tabList[skey];
        if (stemp?.fieldList) {
          toolFields.value.push(...stemp.fieldList);
        }
      }
    } else if (temp.dytableList?.length > 0) {
      for (let skey in temp.dytableList) {
        let stemp = temp.dytableList[skey];
        if (stemp) {
          toolFields.value.push(...stemp);
        }
      }
    } else {
      toolFields.value.push(temp);
    }
  }
};
const reCreateData = () => {
  toolFields.value = [];
  let tempList = props.fieldList?.fieldList;
  if (tempList) {
    assignData(tempList);
  }
};
let sortableInstance: Sortable | null = null;
const moveColumn = () => {
  const tbody = document.querySelector(
      ".sh-columns .el-table__body-wrapper tbody",
  ) as HTMLElement | null;
  if (tbody) {
    if (sortableInstance) {
      sortableInstance.destroy();
    }
    sortableInstance = Sortable.create(tbody, {
      handle: ".move",
      animation: 200,
      ghostClass: "ghost",
      onEnd(event: any) {
        const {oldIndex, newIndex} = event;
        if (oldIndex === newIndex || !props.fieldList?.fieldList) {
          return;
        }
        let oitem = props.fieldList.fieldList[oldIndex];
        let nitem = props.fieldList.fieldList[newIndex];
        if (oitem && nitem) {
          props.fieldList.fieldList[newIndex] = oitem;
          props.fieldList.fieldList[oldIndex] = nitem;
        }
      },
    });
  }
};

const editData = (row: any, _column?: any, evt?: Event) => {
  if (evt) {
    evt.stopPropagation();
  }
  let id = getRowIdentity(row);
  dynamicForm.setDataId(id);
  dynamicForm.setSelectData(row);
  if (!props.dialogInput) {
    viewById(id);
  } else {
    emits("selectItem", row);
  }
};
/**
 * Check if parent node can be selected
 * @param val
 */
const checkParent = (val: any) => {
  if (props.allowSelectParent) {
    return true;
  }
  let flag = false;
  for (let i in val) {
    let item = val[i];
    if (item?.["children"]?.length > 0) {
      flag = true;
      starHorseTableCompRef.value?.toggleRowSelection(item, false);
    }
  }
  if (flag) {
    warning(i18n("comp.nonLeafNodeCannotBeSelected"));
    return false;
  }
  return true;
};
const handleSelectionChange = (val: any) => {
  if (!checkParent(val)) {
    return;
  }
  if (props.dialogInput && !props.multipleSelect) {
    if (val.length <= 1) {
      multipleSelection.value = val;
    } else {
      let keys: any = props.primaryKey;
      if (Array.isArray(keys)) {
        let arr: any = [];
        for (let index in multipleSelection.value) {
          let temp = multipleSelection.value[index];
          let temp1: any = {};
          for (let key of keys) {
            temp1[key] = temp?.[key];
          }
          arr.push(temp1);
        }
        let filters: Array<any> = [];
        for (let index in val) {
          let temp = val[index];
          for (let sindex in arr) {
            let stemp = arr[sindex];
            let bflag: number = 0;
            for (let skey in stemp) {
              if (
                  Object.prototype.hasOwnProperty.call(temp, skey) &&
                  stemp[skey] == temp[skey]
              ) {
                bflag++;
              }
            }
            if (bflag != Object.keys(stemp).length) {
              filters.push(temp);
            }
          }
        }
        multipleSelection.value = filters;
      } else {
        let ids = multipleSelection.value.map(
            (item: any) => item?.[keys],
        ) as Array<any>;
        multipleSelection.value = val.filter(
            (item: any) => !ids.includes(item?.[keys]),
        );
      }
      let data = multipleSelection.value[0];
      starHorseTableCompRef.value?.toggleRowSelection(data, true);
    }
  } else {
    multipleSelection.value = val;
  }
};
const getRowIdentity = (row: any) => {
  return analysisPrimaryKeys(props.primaryKey, row) || "";
};

const tbCommonFun = (name: string | undefined, row: any) => {
  let id = analysisPrimaryKeys(props.primaryKey, row);
  if (name == "view") {
    viewById(props.preview ? row : id);
  } else if (name == "edit") {
    editById(props.preview ? row : id);
  } else if (["delete", "batchDelete"].includes(name)) {
    deleteById(id);
  } else if (["exportForm", "exportPdf"].includes(name)) {
    exportSingleFile(id, name);
  } else {
    console.log(i18n("comp.undefinedFunction"), name);
  }
  return false;
};
/**
 * Parse primary key
 * @param keys Primary key
 * @param row
 */
const analysisPrimaryKeys = (keys: any, row: any) => {
  if (Array.isArray(keys)) {
    let obj: any = {};
    for (let key of keys) {
      if (isJson(key)) {
        obj[key.dist] = splitKey(key.source, row);
      } else {
        obj[key] = splitKey(key, row);
      }
    }
    return obj;
  } else {
    return splitKey(keys, row);
  }
};
const splitKey = (key: string, row: any) => {
  let arr = key?.split(".");
  if (arr?.length > 1) {
    let temp = row;
    for (let i in arr) {
      temp = temp?.[arr[i]];
    }
    return temp;
  } else {
    return row?.[key] ?? uuid();
  }
};
const viewById = (id: any, isExpand: boolean = false) => {
  if (overrideOperation("view", id)) {
    return;
  }
  if (dialogProps) {
    dialogProps.viewVisible = true;
    dialogProps.ids = id;
  }
  if (isExpand) {
    dialogProps.isExpand = isExpand;
    dialogProps.expandUrl = props.expandTable?.expandUrls;
  }
};
/**
 * Edit data
 * @param id
 * @param isExpand
 */
const editById = (id: any, isExpand: boolean = false) => {
  if (overrideOperation("edit", id)) {
    return;
  }
  if (dialogProps) {
    dialogProps.editVisible = true;
    dialogProps.ids = id;
  }
  if (isExpand) {
    dialogProps.isExpand = isExpand;
    dialogProps.expandUrl = props.expandTable?.expandUrls;
  }
};
/**
 * Delete data
 * @param id
 * @param isExpand
 */
const deleteById = async (id: any, isExpand: boolean = false) => {
  if (overrideOperation("delete", id)) {
    return;
  }
  let deleteUrl = props.compUrl?.deleteUrl!;
  if (isExpand) {
    deleteUrl = props.expandTable?.expandUrls?.deleteUrl!;
  }
  let flag = await deleteByIds(deleteUrl, Array.isArray(id) ? id : [id]);
  if (flag) {
    searchFlag.value = true;
    loadByPage();
  }
};
/**
 * 导出单条数据
 * @param id
 * @param type pdf,form
 */
const exportSingleFile = async (id: any, type: string) => {
  if (overrideOperation(type, id)) {
    return;
  }
  let action = props.compUrl?.exportSingleDataAction;
  action && action({
    id, type
  });
};
const pageSizeClick = (pageSize: number) => {
  pageInfo.value.pageSize = pageSize;
  loadByPage();
};
const pageChangeClick = (currentPage: number) => {
  pageInfo.value.currentPage = currentPage;
  loadByPage();
};
const inputFieldName = ref<string>("");
const inputFieldVal = ref<any>();
const createParams = () => {
  let searchTemp = [];
  let orderByTemp = orderBys.value.slice();
  if (props.filterCondition) {
    searchTemp.push(...props.filterCondition);
  }
  if (props.orderBy) {
    orderByTemp.push(...props.orderBy);
  }
  if (props.fieldList?.orderBy) {
    orderByTemp.push(...(props.fieldList?.orderBy || []));
  }
  if (searchFields.value?.length > 0) {
    searchTemp.push(...searchFields.value);
  }
  let condition: any = removeEmptyCondition(props.compUrl?.condition!);
  if (condition && condition.length > 0) {
    searchTemp.push(...condition);
  }
  // Add shared person information
  if (props.commonPersons?.length && !isSystemManage()) {
    searchTemp.push(
        createCondition(props.userColumnName, props.commonPersons, "in"),
    );
  }
  if (!props.compUrl?.pageListUrl) {
    return;
  }
  let params: any = {
    currentPage: pageInfo.value.currentPage,
    pageSize: pageInfo.value.pageSize,
    fieldList: searchTemp,
    orderBy: orderByTemp,
  };
  return params;
};
/**
 * Display data by pagination
 * @param initPageInfo Whether to initialize pagination information
 */
const loadByPage = (initPageInfo?: boolean) => {
  if (initPageInfo) {
    Object.assign(pageInfo.value, baseInfo);
    pageInfo.value.dataList = [];
  }
  let url: string = props.compUrl?.pageListUrl as string;
  let params: any = createParams();
  if (props.compUrl?.redirect) {
    params = {
      url,
      host: props.compUrl?.host,
      port: props.compUrl?.port,
      protocol: props.compUrl?.protocol,
      env: props.compUrl?.env,
      httpMethod: props.compUrl?.httpMethod || "POST",
      dataType: props.compUrl?.dataType || "JSON",
      searchInfo: params,
    };
    url = props.compUrl?.redirectPageListUrl ?? "/system-config/redirect/pageList";
  }
  if (props.needLoad) {
    load(i18n("comp.dataLoading"));
  }
  postRequest(url, params)
      .then((res: any) => {
        if (res?.data?.code != 0) {
          res && console.error(res?.data?.cnMessage || res?.data?.enMessage);
          return;
        }
        let redata = res?.data?.data;
        const newData = redata?.dataList || redata;
        if ((props.pageKeepOldData || isMobile) && !searchFlag.value) {
          if (!pageInfo.value.dataList) {
            pageInfo.value.dataList = [];
          }
          const maxCachePages = 10;
          const maxCacheSize = pageInfo.value.pageSize * maxCachePages;
          pageInfo.value.dataList.push(...newData);
          if (pageInfo.value.dataList.length > maxCacheSize) {
            pageInfo.value.dataList.splice(0, pageInfo.value.dataList.length - maxCacheSize);
          }
        } else {
          pageInfo.value.dataList = newData;
        }
        searchFlag.value = false;

        if (props.dialogInput) {
          filterData();
        }
        pageInfo.value.totalPage = redata?.totalPages;
        pageInfo.value.totalData = redata?.totalDatas;
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        closeLoad();
      });
};
const filterData = () => {
  let name = unref(inputFieldName) as string;
  if (pageInfo.value.dataList && name && inputFieldVal.value) {
    let row = pageInfo.value.dataList.find(
        (item: any) => item?.[name] == inputFieldVal.value,
    );
    if (row) {
      multipleSelection.value.push(row);
      starHorseTableCompRef.value?.toggleRowSelection(row, true);
    }
  }
};
const setDataInfo = (fieldName: string, val: any) => {
  multipleSelection.value = [];
  inputFieldName.value = fieldName;
  inputFieldVal.value = val;
  filterData();
};
/**
 * Select row
 * @param row
 * @param column
 * @param evt
 */
const selectRow = (row: any, _column?: any, evt?: Event) => {
  if (!evt) {
    dynamicForm.setSelectData(row);
    emits("selectItem", row);
    return;
  }
  evt.stopPropagation();
  if (!checkParent(row)) {
    return;
  }
  // Expand/Collapse
  if (props.expandTable) {
    starHorseTableCompRef.value?.toggleRowExpansion(row);
  }
  if (multipleSelection.value?.length > 0) {
    for (let valueElement of multipleSelection.value) {
      starHorseTableCompRef.value?.toggleRowSelection(valueElement);
    }
  }
  const selected = multipleSelection.value?.some(
      (item: any) => item?.[props.primaryKey] === row?.[props.primaryKey],
  );
  if (!selected) {
    multipleSelection.value.push(row);
    starHorseTableCompRef.value?.toggleRowSelection(row, true);
  } else {
    multipleSelection.value = multipleSelection.value?.filter((item: any) => {
      return item?.[props.primaryKey] !== row?.[props.primaryKey];
    });
    starHorseTableCompRef.value?.toggleRowSelection(row, false);
  }
  dynamicForm.setSelectData(row);
  emits("selectItem", row);
};

/**
 * Extend button
 */
const extendBtnFunction = (): Array<UserFuncInfo> => {
  let arr: Array<UserFuncInfo> = [];
  const extendBtnsCopy: UserFuncInfo[] = props.extendBtns ?? [];

  extendBtnsCopy?.forEach((item: UserFuncInfo) => {
    if (item.position != "toolbar") {
      if (!item.funcName) {
        const auth = item.authority;
        item.funcName = (row: any) => tbCommonFun(auth, row);
      }
      arr.push(item);
    }
  });
  props.fieldList?.["userTableFuncs"]?.forEach((item: UserFuncInfo) => {
    if (item.position != "toolbar") {
      if (!item.funcName) {
        const auth = item.authority;
        item.funcName = (row: any) => tbCommonFun(auth, row);
      }
      arr.push(item);
    }
  });
  if (!props.disableAction) {
    let edit = arr.filter((item) => item.authority == "edit")?.length;
    if (!edit) {
      arr.push({
        authority: "edit",
        btnName: i18n("common.edit"),
        icon: "edit",
        priority: 10,
        funcName: (row: any) => tbCommonFun("edit", row),
      });
    }
    let view = arr.filter((item) => item.authority == "view")?.length;
    if (!view) {
      arr.push({
        authority: "view",
        btnName: i18n("common.view"),
        priority: 20,
        icon: "data-view",
        funcName: (row: any) => tbCommonFun("view", row),
      });
    }
    let del = arr.filter((item) => item.authority == "delete")?.length;
    if (!del) {
      arr.push({
        authority: "delete",
        btnName: i18n("common.delete"),
        priority: 30,
        icon: "delete",
        funcName: (row: any) => tbCommonFun("delete", row),
      });
    }
    let exportForm = arr.filter((item) => item.authority == "export-form")?.length;
    if (!exportForm) {
      arr.push({
        authority: "export-form",
        btnName: i18n("common.exportForm"),
        priority: 40,
        icon: "form",
        funcName: (row: any) => tbCommonFun("export-form", row),
      });
    }
    let exportPdf = arr.filter((item) => item.authority == "export-pdf")?.length;
    if (!exportPdf) {
      arr.push({
        authority: "export-pdf",
        btnName: i18n("common.exportPdf"),
        priority: 50,
        icon: "pdf",
        funcName: (row: any) => tbCommonFun("export-pdf", row),
      });
    }

  }
  arr.sort(
      (a: UserFuncInfo, b: UserFuncInfo) =>
          (a.priority || 60) - (b.priority || 60),
  );
  return arr;
};
const buttonList = computed(() => extendBtnFunction());
/**
 * Expand table operation
 * @param name Event condition
 * @param row Current node data
 * @param parentRow Parent node data
 */
const expandCommonFun = (name: string, row: any, parentRow: any) => {
  let id = analysisPrimaryKeys(props.expandTable?.primaryKey, row);
  for (let key in id) {
    if (!id[key]) {
      id[key] = parentRow[key];
    }
  }
  if (name == "view") {
    viewById(id, true);
  } else if (name == "edit") {
    editById(id, true);
  } else if (name == "delete") {
    deleteById(id, true);
  }
};
/**
 * Get required data with the help of list component
 * @param limitSize Data to load
 * @param url Request URL, if empty, use getAllByCondition interface
 * @param usePageCondition Whether to use pagination query conditions
 * @param params Query parameters
 * @param orderBys Sorting
 */
const getDatas = async (
    limitSize: number = 0,
    params: SearchParams[] = [],
    orderBys: OrderByInfo[] = [],
    url: string = "",
    usePageCondition: boolean = true,
) => {
  let tempSearchParams: SearchParams[] = [];
  if (usePageCondition) {
    let temp = createParams();
    tempSearchParams.push(...temp.fieldList);
    orderBys.push(...temp.orderBy);
  }
  if (params && params.length > 0) {
    tempSearchParams.push(...params);
  }
  let result = await loadData(url || props.compUrl?.listConditionUrl!, {
    limits: limitSize,
    fieldList: tempSearchParams,
    orderBy: orderBys,
  });
  if (result.error) {
    warning(i18n("comp.dataLoadingException") + result.error);
  }
  return result.data;
};

let dataShowType = ref<string>("list");
let cardFieldList = ref<FieldInfo[]>([]);
const cacheAppCompList = ref<FieldInfo[]>([]);
const loadField = (): FieldInfo[] => {
  //同一个页面将数据缓存，而不是每次都去解析一遍
  if (!cacheAppCompList.value.length) {
    let {fieldList} = convertCompToAppComps(props.fieldList);
    cacheAppCompList.value = fieldList;
  }
  if (!cacheAppCompList.value?.length) {
    return [];
  }
  if (isMobile) {
    const appFields = cacheAppCompList.value.filter((item: FieldInfo) => item.preps?.appListVisible);
    if (appFields && appFields.length) {
      return appFields.sort(
          (a: FieldInfo, b: FieldInfo) => (a.preps?.dataIndex || 100) - (b.preps?.dataIndex || 100),
      );
    }
  }
  return cacheAppCompList.value.filter(item => item.listVisible).slice(0, 3);
};
let typeTitle = ref<string>(i18n("table.switchToCardMode"));
let typeIcon = ref<string>("card1");

/**
 * Data display style
 * @param type
 */
const showType = (type: string) => {
  type = type == "card" ? "list" : "card";
  dataShowType.value = type;
  if (type == "card" && cardFieldList.value.length == 0) {
    cardFieldList.value = loadField();
  }
  if (type == "card") {
    typeTitle.value = i18n("table.switchToListMode");
    typeIcon.value = "list";
  } else {
    typeTitle.value = i18n("table.switchToCardMode");
    typeIcon.value = "card1";
  }
};

const getSelectedDatas = () => {
  return multipleSelection.value;
};
/**
 * 列表滚动到底部时自动翻译
 * @param direction
 */
const endReached = (direction: string) => {
  if (direction == "bottom" && isMobile) {
    //滚动翻页需要自动累加
    pageInfo.value.currentPage += 1;
    //当前也大于总页数，就不再向后端发起请求了
    if (pageInfo.value.currentPage > pageInfo.value.totalPage) {
      return;
    }
    loadByPage();
  }
};
/**
 * 动态从外面绑定数据
 * @param data
 */
const assignStaticData = (data: any) => {
  if (!pageInfo.value.dataList) {
    pageInfo.value.dataList = [];
  }
  pageInfo.value.dataList.splice(0, 0, Array.isArray(data) ? [...data] : data);
};
const clearData = () => {
  pageInfo.value.dataList = [];
};
onActivated(() => {

});
onMounted(() => {
  const data = configStore.configFormInfo;
  if (data?.tableType == "card") {
    showType("list");
  }
  init();
});
onUnmounted(() => {
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }
  if (starHorseTableCompRef.value) {
    starHorseTableCompRef.value.clearSelection();
  }
  multipleSelection.value = [];
  cardSelection.value = [];
  pageInfo.value = {};
  searchFields.value = [];
  orderBys.value = [];
  toolFields.value = [];
});
// Export methods and variables
defineExpose({
  init,
  // Query
  createSearchParams,
  loadByPage,
  getIds,
  assignStaticData,
  getSelectedDatas,
  multipleSelection,
  setDataInfo,
  deleteById,
  editById,
  // Button event
  tableCompFunc,
  getDatas,
  permissionList,
  clearData
});
</script>
<template>
  <star-horse-dialog
      :isShowBtnContinue="false"
      :selfFunc="true"
      @merge="selectedFields"
      :dialogVisible="exportOperationVisible"
      @closeAction="exportOperationVisible = false"
  >
    {{ i18n("comp.underDevelopment") }}
  </star-horse-dialog>
  <div class="star-horse-table">
    <div
        class="flex w-full justify-between"
        style="border-bottom: var(--star-horse-style) 1px solid"
        v-if="!dialogInput&&!isMobile"
    >
      <div class="tb_title">
        <div v-if="title || helpMsg">
          <help :message="helpMsg" v-if="helpMsg"/>
          <star-horse-icon
              icon-class="info"
              v-else
              size="14px"
              style="font-weight: bold; color: var(--star-horse-style)"
          />
          {{ title }}
        </div>
        <star-horse-button-list
            @tableCompFunc="(fun: any) => tableCompFunc(fun)"
            :compUrl="compUrl"
            :btnPermissions="permissions"
            :extendBtns="extendBtns"
            :dialogProps="dialogProps"
            :preValidFunc="preValidFunc"
            v-if="!hideButtonList&&!isMobile"
        />
      </div>
      <div class="flex items-center flex-row-reverse">
        <star-horse-icon
            :title="i18n('comp.refresh')"
            @click="loadByPage"
            icon-class="refresh"
            style="cursor: pointer; color: var(--star-horse-style)"
        />
        <el-popover
            v-if="dataShowType == 'list'"
            trigger="click"
            :title="i18n('comp.showHideColumns')"
            :popper-style="{ width: 'unset !important' }"
            placement="left-end"
        >
          <template #reference>
            <star-horse-icon
                @click="fieldVisible = !fieldVisible"
                :title="i18n('comp.showHideColumns')"
                icon-class="setting"
                style="color: var(--star-horse-style); cursor: pointer"
            />
          </template>
          <el-table
              class="sh-columns"
              ref="table"
              :data="toolFields"
              :strip="true"
              :fit="true"
              :highlight-current-row="true"
              max-height="400px"
              row-key="prop"
              style="width: 100%"
              :size="compSize"
              :border="true"
          >
            <el-table-column prop="" :label="i18n('comp.sort')" width="60">
              <el-tag class="move" style="cursor: move">
                <el-icon style="cursor: move">
                  <Sort/>
                </el-icon>
              </el-tag>
            </el-table-column>
            <el-table-column
                prop="label"
                :label="i18n('comp.columnName')"
                :show-overflow-tooltip="true"
            >
              <template #default="scope">
                <el-tag
                    round
                    :effect="scope.row.listVisible ? 'dark' : 'light'"
                    :size="compSize"
                >
                  {{ scope.row.label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
                prop="listVisible"
                :label="i18n('comp.showHide')"
                width="100"
            >
              <template #default="scope">
                <el-switch
                    v-model="scope.row.listVisible"
                    :size="compSize"
                    :active-value="true"
                    :inactive-value="false"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-popover>
        <star-horse-icon
            @click="showType(dataShowType)"
            :title="typeTitle"
            :icon-class="typeIcon"
            style="cursor: pointer; color: var(--star-horse-style)"
        />
      </div>
    </div>
    <div class="data-list-area" v-if="dataShowType == 'list'&&!isMobile">
      <el-table
          ref="starHorseTableCompRef"
          :data="pageInfo.dataList"
          @selection-change="handleSelectionChange"
          @row-click="selectRow"
          @row-dblclick="editData"
          :row-key="getRowIdentity"
          :stripe="true"
          :fit="true"
          :size="compSize"
          :min-height="height"
          :highlight-current-row="true"
          :default-expand-all="expand"
          :row-style="{ height: lineHeight }"
          :cell-style="{ height: lineHeight, 'font-size': '12px' }"
          :header-cell-style="{
          background: '#f2f2f2',
          color: '#707070',
          'font-size': '13px',
          'background-image':
            '-webkit-gradient(linear,left 0,left 100%,from(#f8f8f8),to(#ececec))',
        }"
          :border="true"
      >
        <el-table-column
            type="selection"
            :align="'center'"
            fixed="left"
            :reserve-selection="true"
            v-if="showSelection"
        />
        <el-table-column type="expand" v-if="expandTable">
          <template #default="scope">
            <div class="expand-table">
              <h4>{{ expandTable?.title }}</h4>
              <el-table
                  :data="scope.row?.[expandTable?.dataField]"
                  :row-key="getRowIdentity"
                  :stripe="true"
                  :fit="true"
                  :size="compSize"
                  :highlight-current-row="true"
                  :max-height="'400px'"
                  :row-style="{ height: '30px' }"
                  :cell-style="{ height: '30px', 'font-size': '12px' }"
                  :border="true"
              >
                <el-table-column
                    fixed="left"
                    :label="i18n('table.operation')"
                    :width="160"
                    v-if="
                    expandTable?.showButton && expandTable?.extendFuncs?.length > 0
                  "
                >
                  <template #default="innerScope">
                    <template
                        v-for="epd in expandTable?.extendFuncs"
                        :key="compKey(epd, epd?.authority)"
                    >
                      <el-tooltip :content="epd?.btnName">
                        <star-horse-icon
                            v-if="permissions?.[epd?.authority!]"
                            @click="
                            expandCommonFun(
                              epd?.authority!,
                              innerScope.row,
                              scope.row,
                            )
                          "
                            :icon-class="epd?.icon || 'edit'"
                            style="cursor: pointer"
                            :color="
                            epd?.authority == 'delete'
                              ? 'var(--el-color-danger)'
                              : 'var(--star-horse-style)'
                          "
                        />
                      </el-tooltip>
                    </template>
                  </template>
                </el-table-column>
                <table-column
                    :fieldList="expandTable"
                    :compSize="configInfo?.inputSize"
                    :compUrl="compUrl"
                    :dataFormat="dataFormat"
                    :sortable="false"
                    :globalConfig="globalConfig"
                    :isDynamic="isDynamic"
                    :showBatchField="showBatchField"
                />
              </el-table>
            </div>
          </template>
        </el-table-column>
        <table-column-item
            :fieldList="fieldList"
            :compSize="configInfo?.inputSize"
            :compUrl="compUrl"
            :dataFormat="dataFormat"
            :globalConfig="globalConfig"
            :isDynamic="isDynamic"
            :showBatchField="showBatchField"
        />
        <el-table-column
            v-if="
            buttonList.length > 0 && Object.keys(permissions || {}).length > 0
          "
            fixed="right"
            :label="i18n('table.operation')"
            :width="buttonList.length > 3 ? 160 : 110"
        >
          <template #default="scope">
            <tablebtn
                :row="scope.row"
                :permissions="permissions"
                :buttonList="buttonList"
                :hideBtnCondition="hideBtnCondition"
                :compSize="compSize"
                class="flex"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="data-card-area" v-else>
      <star-horse-button-list
          @tableCompFunc="(fun: any) => tableCompFunc(fun)"
          :compUrl="compUrl"
          :btnPermissions="permissions"
          :extendBtns="extendBtns"
          :dialogProps="dialogProps"
          :preValidFunc="preValidFunc"
          v-if="!hideButtonList&&isMobile"
      />
      <el-scrollbar height="100%" style="width:99%" @endReached="endReached">
        <el-space
            :style="{width:`${isMobile?'100%':'auto'}`}"
            :fill="isMobile"
            wrap>
          <el-card
              v-for="(data, key) in pageInfo.dataList"
              :key="compKey(data, key)"
              class="box-card"
              :style="{
                  width: `${isMobile?'100%':'250px'} !important`,
                  height: '180px !important'}"
              shadow="hover"
          >
            <template #header>
              <div
                  class="card-header justify-start gap-3"
                  @click="selectRow(data)"
                  @dblclick="editData(data)"
              >
                <template v-if="multipleSelect">
                  <el-checkbox v-model="cardSelection" :value="data"/>
                </template>
                <template v-else>
                  <el-radio v-model="cardSelection" :value="data"/>
                </template>

                <span>
                  {{
                    dataFormat?.(
                        cardFieldList?.[0]?.fieldName,
                        data?.[cardFieldList?.[0]?.fieldName],
                        data
                    )
                  }}</span>
              </div>
            </template>
            <div
                class="card-item item"
                style="width: 99%; margin: 1px auto"
                :Key="compKey(item, key)"
                v-for="(item, key) in cardFieldList?.slice(1)"
            >
              <label>{{ item?.label }} :</label>
              <div
                  class="content"
                  @click="selectRow(data)"
                  @dblclick="editData(data)"
              >
                <el-tooltip
                    :content="
                    dataFormat?.(item?.fieldName, data?.[item?.fieldName], data)
                  "
                >
                  {{ dataFormat?.(item?.fieldName, data?.[item?.fieldName], data) }}
                </el-tooltip>
              </div>
            </div>
            <template #footer>
              <tablebtn
                  :row="data"
                  :permissions="permissions"
                  :buttonList="buttonList"
                  :showLimit="6"
                  :hideBtnCondition="hideBtnCondition"
                  :compSize="compSize"
              />
            </template>
          </el-card>
        </el-space>
      </el-scrollbar>
    </div>

    <el-pagination
        v-if="showPageBar&&!isMobile"
        :total="pageInfo.totalData"
        @current-change="pageChangeClick"
        @size-change="pageSizeClick"
        :size="compSize"
        :page-sizes="pageCombList"
        :layout="pageBarLayout"
        v-model:currentPage="pageInfo.currentPage"
        v-model:page-size="pageInfo.pageSize"
        v-model:pageCount="pageInfo.totalPage"
    >
      <el-button
          text
          icon="refresh"
          :size="compSize"
          @click="loadByPage"
          :title="i18n('table.refresh')"
      />
    </el-pagination>

  </div>
</template>
<style lang="scss" scoped>
.star-horse-table {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;

  .data-list-area,
  .data-card-area {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    flex: 1;
  }

  .data-card-area {
    margin: 5px;
    width: 99%;
  }
}

.expand-table {
  width: 100%;
  margin: 10px auto;

  h4 {
    display: block;
    margin: 10px;
  }
}

.warning-row {
  background: var(--star-horse-shadow);
}

:deep(.el-table__cell) {
  padding: 0;
}

:deep(th.el-table__cell:first-child) {
  padding: 5px 0;
}

:deep(.cell) {
  display: flex;
}

.tb_title {
  display: flex;
  align-items: center;
  flex-direction: row;
  flex: 1;
  color: var(--star-horse-style);
}

:deep(.el-card__footer) {
  padding: 5px 20px;
  display: flex;
}
</style>
