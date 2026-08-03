<script setup lang="ts" name="StarHorseTableComp">
import {deleteByIds, download, loadData, postRequest,} from "@/api/star_horse_apis";
import {closeLoad, createCondition, formatCellValue, isJson, load,} from "@/api/star_horse_utils";
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
import {
  computed,
  inject,
  nextTick,
  onActivated,
  onMounted,
  onUnmounted,
  provide,
  reactive,
  ref,
  unref,
  watch,
} from "vue";
import {isMobile} from "@/api/device";
import {convertCompToAppComps} from "@/api/form_utils";
import type {PreValid} from "@/components/types";
import {Sort} from "@element-plus/icons-vue";

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
  pageBarLayout: "total, sizes, prev, pager, next, jumper,slot",
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
// 当前正在编辑的行引用（编辑互斥：仅允许一行处于编辑状态）
const editingRow = ref<any>(null);
// 取消当前编辑行的编辑状态（O(1)，不遍历 dataList）
const cancelAllEdit = () => {
  const row = editingRow.value;
  if (!row) return;
  const originalValue =
      row.starHorseBakeValue === "_" ? null : row.starHorseBakeValue;
  if (row.selectName) row[row.selectName] = originalValue;
  delete row.isSelected;
  delete row.selectName;
  delete row.starHorseBakeValue;
  editingRow.value = null;
};
// 提供给列组件：激活新单元格编辑前，先取消其他编辑状态
provide("starHorseCancelAllEdit", cancelAllEdit);
provide("starHorseSetEditingRow", (row: any) => {
  editingRow.value = row;
});
let searchFields = ref<Array<SearchParams>>([]);
let orderBys = ref<Array<OrderByInfo>>([]);
let fieldVisible = ref<boolean>(false);
let dialogProps = inject("dialogProps") as DialogProps;
let toolFields = ref<Array<any>>([]);
const exportOperationVisible = ref<boolean>(false);
// APP端：搜索组件引用 + 列显隐弹窗
const mobileSearchRef = ref<any>(null);
const mobileFieldVisible = ref(false);
const openMobileSearch = () => {
  mobileSearchRef.value?.handleMobileSearch();
};
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
    // 执行按钮：由外部通过 overrideOperation 处理
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
        for (const id of ids) {
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
  for (const temp of selectDatas) {
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
  // PC/APP 端均初始化字段缓存：
  // PC 端卡片模式列表及设置弹窗均依赖 cacheAppCompList 响应式更新
  loadField();
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
watch(
    () => cardSelection.value,
    (val) => {
      multipleSelection.value = Array.isArray(val) ? val : [val];
    },
    {immediate: false},
);
const assignData = (dataList: Array<any>) => {
  for (const temp of dataList) {
    if (Array.isArray(temp)) {
      toolFields.value.push(...temp);
    } else if (temp.tabList?.length > 0) {
      for (const stemp of temp.tabList) {
        if (stemp?.fieldList) {
          toolFields.value.push(...stemp.fieldList);
        }
      }
    } else if (temp.dytableList?.length > 0) {
      for (const stemp of temp.dytableList) {
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
// 字段配置表（.sh-columns）的 ref，用于替代 document.querySelector 全局查询
const shColumnsTableRef = ref<any>(null);
const moveColumn = () => {
  // 优先通过 ref 定位表格实例，避免全局 querySelector 误匹配多实例
  const tableEl: HTMLElement | null =
      shColumnsTableRef.value?.$el ??
      (document.querySelector(".sh-columns") as HTMLElement | null);
  const tbody = tableEl?.querySelector(
      ".el-table__body-wrapper tbody",
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
        if (oldIndex === newIndex) {
          return;
        }
        // 同步排序到原 fieldList
        if (props.fieldList?.fieldList) {
          let oitem = props.fieldList.fieldList[oldIndex];
          let nitem = props.fieldList.fieldList[newIndex];
          if (oitem && nitem) {
            props.fieldList.fieldList[newIndex] = oitem;
            props.fieldList.fieldList[oldIndex] = nitem;
          }
        }
        // 同步排序到 cacheAppCompList（卡片模式及设置弹窗数据源）
        if (cacheAppCompList.value?.length) {
          let oApp = cacheAppCompList.value[oldIndex];
          let nApp = cacheAppCompList.value[newIndex];
          if (oApp && nApp) {
            cacheAppCompList.value[newIndex] = oApp;
            cacheAppCompList.value[oldIndex] = nApp;
          }
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
  for (const item of val) {
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
        for (const temp of multipleSelection.value) {
          let temp1: any = {};
          for (let key of keys) {
            temp1[key] = temp?.[key];
          }
          arr.push(temp1);
        }
        let filters: Array<any> = [];
        for (const temp of val) {
          for (const stemp of arr) {
            let bflag: number = 0;
            for (const skey in stemp) {
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
    warning(i18n("comp.undefinedFunction") + name);
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
    for (const k of arr) {
      temp = temp?.[k];
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
  action &&
  action({
    id,
    type,
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
    url =
        props.compUrl?.redirectPageListUrl ?? "/system-config/redirect/pageList";
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
            pageInfo.value.dataList.splice(
                0,
                pageInfo.value.dataList.length - maxCacheSize,
            );
          }
        } else {
          pageInfo.value.dataList = newData;
        }
        searchFlag.value = false;

        if (props.dialogInput) {
          nextTick(() => {
            filterData();
          });
        }
        pageInfo.value.totalPage = redata?.totalPages;
        pageInfo.value.totalData = redata?.totalDatas;
      })
      .catch((err: any) => {
        console.error(err);
      })
      .finally(() => {
        closeLoad();
      });
};
const filterData = () => {
  let name = unref(inputFieldName) as string;
  if (pageInfo.value.dataList && name && inputFieldVal.value) {
    const values = Array.isArray(inputFieldVal.value)
        ? inputFieldVal.value
        : [inputFieldVal.value];
    for (const val of values) {
      const exists = multipleSelection.value.some(
          (item: any) => item?.[name] == val,
      );
      if (exists) continue;
      let row = pageInfo.value.dataList.find(
          (item: any) => item?.[name] == val,
      );
      if (row) {
        multipleSelection.value.push(row);
        starHorseTableCompRef.value?.toggleRowSelection(row, true);
      }
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
    let exportForm = arr.filter(
        (item) => item.authority == "exportForm",
    )?.length;
    if (!exportForm) {
      arr.push({
        authority: "exportForm",
        btnName: i18n("common.exportForm"),
        priority: 40,
        icon: "form",
        funcName: (row: any) => tbCommonFun("exportForm", row),
      });
    }
    let exportPdf = arr.filter(
        (item) => item.authority == "exportPdf",
    )?.length;
    if (!exportPdf) {
      arr.push({
        authority: "exportPdf",
        btnName: i18n("common.exportPdf"),
        priority: 50,
        icon: "pdf",
        funcName: (row: any) => tbCommonFun("exportPdf", row),
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
const cacheAppCompList = ref<FieldInfo[]>([]);
// APP端系统公共字段名（默认隐藏）
const SYSTEM_FIELD_NAMES = [
  "createdBy",
  "createdTime",
  "updatedBy",
  "updatedTime",
  "remark",
  "createTime",
  "updateTime",
  "editTime",
  "isDel",
];
/**
 * 初始化 APP 端 appListVisible 默认值：
 * - 系统公共字段（创建人/创建时间等）默认隐藏
 * - 其余字段按 PC 端 listVisible 决定
 */
const initAppListVisible = (fields: FieldInfo[]) => {
  fields.forEach((f: any) => {
    if (!f.preps) f.preps = {};
    if (f.preps.appListVisible === undefined) {
      const isSystem = SYSTEM_FIELD_NAMES.some((s) =>
          f.fieldName?.toLowerCase().includes(s.toLowerCase()),
      );
      f.preps.appListVisible = isSystem ? false : !!f.listVisible;
    }
  });
};
const loadField = (): FieldInfo[] => {
  //同一个页面将数据缓存，而不是每次都去解析一遍
  if (!cacheAppCompList.value.length) {
    const result = convertCompToAppComps(props.fieldList);
    // convertCompToAppComps 返回 { fieldList: [{ appList: [...] }] }
    // 扁平化提取真实字段，并做深拷贝 + reactive 包装：
    // 原字段来自 props.fieldList 的引用，直接新增 preps.appListVisible 属性
    // 在 Vue3 中不会被 ref 追踪，导致 el-switch 切换后卡片不更新
    const rawList: any[] = result.fieldList || [];
    const fields: FieldInfo[] = [];
    for (const item of rawList) {
      if (item?.appList && Array.isArray(item.appList)) {
        for (const sub of item.appList) {
          fields.push(reactive(JSON.parse(JSON.stringify(sub))));
        }
      } else if (Array.isArray(item)) {
        for (const sub of item) {
          fields.push(reactive(JSON.parse(JSON.stringify(sub))));
        }
      } else if (item) {
        fields.push(reactive(JSON.parse(JSON.stringify(item))));
      }
    }
    initAppListVisible(fields);
    cacheAppCompList.value = fields;
  }
  if (!cacheAppCompList.value?.length) {
    return [];
  }
  return cacheAppCompList.value
      .filter((item: FieldInfo) => item.preps?.appListVisible)
      .sort(
          (a: FieldInfo, b: FieldInfo) =>
              (a.preps?.dataIndex || 100) - (b.preps?.dataIndex || 100),
      );
};
/**
 * 卡片展示字段：
 * - PC 端：按 listVisible 过滤（字段顶层属性，设置弹窗绑定此属性）
 * - APP 端：按 appListVisible 过滤（preps 内属性，设置弹窗绑定此属性）
 * 均按 dataIndex 排序
 */
const cardFieldList = computed<FieldInfo[]>(() => {
  if (!cacheAppCompList.value?.length) return [];
  return cacheAppCompList.value
      .filter((item: any) => {
        // listVisible 在字段顶层，appListVisible 在 preps 内
        return isMobile
            ? item.preps?.appListVisible
            : item.listVisible;
      })
      .sort(
          (a: FieldInfo, b: FieldInfo) =>
              (a.preps?.dataIndex || 100) - (b.preps?.dataIndex || 100),
      );
});
let typeTitle = ref<string>(i18n("table.switchToCardMode"));
let typeIcon = ref<string>("card1");

/**
 * Data display style
 * @param type
 */
const showType = (type: string) => {
  type = type == "card" ? "list" : "card";
  dataShowType.value = type;
  // cardFieldList 已为 computed，仅确保缓存已初始化
  if (type == "card" && !cacheAppCompList.value.length) {
    loadField();
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
 * 从已选数据中移除指定行（用于弹窗多选模式下"已选"tab 的删除操作）
 * 同步取消 el-table 的 checkbox 选中状态，并从 multipleSelection 中过滤
 */
const removeSelection = (row: any) => {
  starHorseTableCompRef.value?.toggleRowSelection(row, false);
  let keys: any = props.primaryKey;
  if (Array.isArray(keys)) {
    multipleSelection.value = multipleSelection.value.filter((item: any) =>
        keys.some((k: string) => item?.[k] !== row?.[k]),
    );
  } else {
    multipleSelection.value = multipleSelection.value.filter(
        (item: any) => item?.[keys] !== row?.[keys],
    );
  }
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
  removeSelection,
  multipleSelection,
  setDataInfo,
  deleteById,
  editById,
  // Button event
  tableCompFunc,
  getDatas,
  permissionList,
  clearData,
});
</script>
<template>
  <star-horse-dialog
      :isShowBtnContinue="false"
      :selfFunc="true"
      @merge="selectedFields"
      v-model="exportOperationVisible"
      @closeAction="exportOperationVisible = false"
  >
    {{ i18n("comp.underDevelopment") }}
  </star-horse-dialog>
  <div class="star-horse-table">
    <!-- APP端顶部工具栏：查询 / 刷新 / 设置 -->
    <div class="app-toolbar" v-if="!dialogInput && isMobile">
      <span v-if="title" class="app-toolbar__title">{{ title }}</span>
      <div class="app-toolbar__icons">
        <star-horse-icon
            v-if="searchFormData"
            :title="i18n('search.query')"
            icon-class="search"
            @click="openMobileSearch"
            class="app-toolbar__icon"
        />
        <star-horse-icon
            :title="i18n('comp.refresh')"
            icon-class="refresh"
            @click="tableCompFunc('refresh')"
            class="app-toolbar__icon"
        />
        <el-popover
            v-model:visible="mobileFieldVisible"
            trigger="click"
            placement="bottom-end"
            :width="220"
        >
          <template #reference>
            <star-horse-icon
                :title="i18n('comp.showHideColumns')"
                icon-class="setting"
                class="app-toolbar__icon"
            />
          </template>
          <div class="app-field-list">
            <div
                v-for="(item, idx) in cacheAppCompList"
                :key="idx"
                class="app-field-item"
            >
              <el-switch
                  v-model="item.preps.appListVisible"
                  :active-value="true"
                  :inactive-value="false"
                  size="small"
              />
              <span class="app-field-item__label">{{ item.label }}</span>
            </div>
            <div v-if="!cacheAppCompList.length" class="app-field-empty">
              {{ i18n("pivot.empty.noData") }}
            </div>
          </div>
        </el-popover>
      </div>
    </div>
    <!-- APP端搜索组件（隐藏触发器，仅提供弹窗） -->
    <star-horse-search-comp
        v-if="isMobile && searchFormData"
        ref="mobileSearchRef"
        :formData="searchFormData"
        :compUrl="compUrl"
        @searchData="(data: any) => createSearchParams(data)"
    />
    <div
        class="flex w-full justify-between"
        style="border-bottom: var(--star-horse-style) 1px solid"
        v-if="!dialogInput && !isMobile"
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
            v-if="!hideButtonList && !isMobile"
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
              ref="shColumnsTableRef"
              :data="cacheAppCompList"
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
    <div class="data-list-area" v-if="dataShowType == 'list' && !isMobile">
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
                    expandTable?.showButton &&
                    expandTable?.extendFuncs?.length > 0
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
          v-if="!hideButtonList && isMobile"
      />
      <el-scrollbar height="100%" style="width: 99%" @endReached="endReached">
        <el-space
            :style="{ width: `${isMobile ? '100%' : 'auto'}` }"
            :fill="isMobile"
            wrap
        >
          <el-card
              v-for="(data, key) in pageInfo.dataList"
              :key="compKey(data, key)"
              class="box-card"
              :class="{ 'box-card--mobile': isMobile }"
              :style="{width:isMobile ? '100%' : '390px'}"
              shadow="hover"
          >
            <template #header>
              <div
                  class="card-header justify-start gap-3"
                  style="margin: 0 !important;"
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
                    formatCellValue(cardFieldList?.[0], data, dataFormat)
                  }}</span
                >
              </div>
            </template>
            <!-- 卡片内容统一使用 el-descriptions 展示，PC/APP 显示一致 -->
            <el-descriptions
                :column="1"
                :colon="true"
                border
                label-width="120px"
                :size="compSize"
                class="card-descriptions"
            >
              <el-descriptions-item
                  v-for="(item, key) in cardFieldList?.slice(1)"
                  :key="compKey(item, key)"
                  label-align="right"
                  :label="item?.label"
              >
                <el-tooltip
                    :content="formatCellValue(item, data, dataFormat)"
                >
                  <span class="desc-value" @click="selectRow(data)" @dblclick="editData(data)">
                    {{ formatCellValue(item, data, dataFormat) }}
                  </span>
                </el-tooltip>
              </el-descriptions-item>
            </el-descriptions>
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
        v-if="showPageBar && !isMobile"
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

/* PC端卡片固定宽度，高度自适应内容 */
.box-card {
  height: auto !important;
  min-height: 120px;
  margin-bottom: 8px;
}

/* APP端卡片占满宽度 */
.box-card--mobile {
  width: 100% !important;
  margin-bottom: 8px;

  :deep(.el-card__body) {
    padding: 8px 12px;
  }
}

/*!* el-descriptions 卡片内容样式 *!*/
.card-descriptions {
  :deep(.el-descriptions__body) {
    background: transparent;
  }

  :deep(.el-descriptions__label) {
    width: 120px;
    max-width: 120px;
    min-width: 120px;
    font-weight: 500;
    color: var(--el-text-color-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :deep(.el-descriptions__content) {
    color: var(--el-text-color-primary);
  }

  .desc-value {
    cursor: pointer;
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
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

/* APP端顶部工具栏 */
.app-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--star-horse-white);

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: var(--star-horse-style);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__icons {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-shrink: 0;
  }

  &__icon {
    cursor: pointer;
    color: var(--star-horse-style);
    font-size: 20px;
  }
}

.app-field-list {
  max-height: 300px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  .app-field-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 4px;

    &__label {
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .app-field-empty {
    text-align: center;
    color: var(--el-text-color-placeholder);
    font-size: 13px;
    padding: 12px 0;
  }
}
</style>
