<script setup lang="ts" name="StarHorseTableComp">
import { Config } from "@/api/settings";
import { download, postRequest } from "@/api/star_horse_apis";
import {
  closeLoad,
  createCondition,
  deleteByIds,
  isJson,
  load,
  loadData,
} from "@/api/star_horse_utils";
import { compKey, removeEmptyCondition, uuid } from "@/api/system";
import Tablebtn from "@/components/comp/items/tablebtn.vue";
import TableColumn from "@/components/comp/items/tableColumn.vue";
import Help from "@/components/help.vue";
import { ApiUrls } from "@/components/types/ApiUrls";
import { PreValid } from "@/components/types/BtnAuth";
import { DialogProps } from "@/components/types/DialogProps";
import {
  ExpandTable,
  FieldInfo,
  OrderByInfo,
  PageFieldInfo,
  UserFuncInfo,
} from "@/components/types/PageFieldInfo";
import { PageProps } from "@/components/types/PageProps";
import { BtnHideCondition, SearchParams } from "@/components/types/Params";
import piniaInstance from "@/store";
import { useButtonPermissionStore } from "@/store/ButtonPermission";
import { useDynamicFormStore } from "@/store/DynamicForm";
import { useGlobalConfigStore } from "@/store/GlobalConfig";
import { isSystemManage } from "@/utils/auth";
import { error, warning } from "@/utils/message";
import { analysisFields } from "@/utils/preview";
import Sortable from "sortablejs";
import { i18n } from "@/lang";
import {
  computed,
  inject,
  onMounted,
  PropType,
  reactive,
  ref,
  unref,
  watch,
} from "vue";

const dynamicForm = useDynamicFormStore(piniaInstance);
const props = defineProps({
  // URL address
  compUrl: { type: Object as PropType<ApiUrls | any>, required: true },
  // Primary key
  primaryKey: {
    type: [String, Object] as PropType<string | any>,
    required: true,
  },
  // Column name
  fieldList: { type: Object as PropType<PageFieldInfo>, required: true },
  // Button hidden condition
  hideBtnCondition: {
    type: Array as PropType<BtnHideCondition[]>,
    default: [],
  },
  // Whether to show batch properties
  showBatchField: { type: Boolean, default: false },
  // Format method
  dataFormat: { type: Function, default: null },
  // Disable event
  disableAction: { type: Boolean, default: false },
  // Dialog mode
  dialogInput: { type: Boolean, default: false },
  // Default table height
  height: { type: String, default: "400" },
  // Filter condition
  filterCondition: { type: Array as PropType<SearchParams[]> },
  orderBy: { type: Array as PropType<OrderByInfo[]> },
  // Whether to show pagination
  showPageBar: { type: Boolean, default: true },
  // Data list
  tableDataList: { type: Array },
  // Echo data list
  reverseDataList: { type: Array },
  // Whether to allow selecting parent node
  allowSelectParent: { type: Boolean, default: true },
  // Default whether to expand all child nodes
  expand: { type: Boolean, default: false },
  // Whether loading box is needed
  needLoad: { type: Boolean, default: true },
  // Title
  title: { type: String },
  // Custom button
  extendBtns: { type: Array as PropType<UserFuncInfo[]> },
  // Pre-check method. If a pre-check method is set, the button event can only continue after passing the check.
  preValidFunc: { type: Object as PropType<Array<PreValid>>, default: {} },
  // Multiple selection
  multipleSelect: { type: Boolean, default: false },
  // Row height
  lineHeight: { type: String, default: "30px" },
  // Show checkbox
  showSelection: { type: Boolean, default: true },
  // Expand table properties
  expandTable: { type: Object as PropType<ExpandTable> },
  // Help tooltip
  helpMsg: { type: String },
  // Global config, used by dynamic page
  globalConfig: { type: Object as PropType<any>, required: false },
  // Is dynamic page
  isDynamic: { type: Boolean, default: false },
  // Hide button list
  hideButtonList: { type: Boolean, default: false },
  /**
   * Data sharer
   *   Get information shared by others
   *   let resultData = await loadData('/system-config/system/dataPermission/currentMenuPermissionPerson', {});
   *   The above interface mainly returns the account of the sharer
   *   commonPersons.value = resultData?.data;
   */
  commonPersons: { type: Array as PropType<any>, default: [] },
  // Button permission
  btnPermissions: { type: Object as PropType<any>, required: false },
});
const emits = defineEmits(["selectItem"]);
let pagePermission = useButtonPermissionStore(piniaInstance);
let configStore = useGlobalConfigStore(piniaInstance);
let permissions = ref<any>({});
const configInfo = computed(() => {
  let data = configStore.configFormInfo;
  showType(data.tableType == "card" ? "list" : "card");
  return data;
});
let compSize = computed(
  () => configStore.configFormInfo?.inputSize || Config.compSize,
);
const multipleSelection = ref<any>([]);
const starHorseTableCompRef = ref();
const baseInfo: PageProps = {
  pageSize: 20,
  currentPage: 1,
  totalData: 0,
  totalPage: 0,
  dataList: [],
};
let pageInfo = ref<PageProps>({});
let searchFields = reactive<Array<SearchParams>>([]);
let orderBys = reactive<Array<OrderByInfo>>([]);
let fieldVisible = ref<boolean>(false);
let dialogProps = inject("dialogProps") as DialogProps;
let toolFields = reactive<Array<any>>([]);
const exportOperationVisible = ref<boolean>(false);
/**
 * Button area event
 * @param authority Permission code
 */
const tableCompFunc = (authority: any) => {
  if (authority == "refresh") {
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
const exportData = () => {
  load(i18n("comp.dataProcessing"));
  let ids: any = getIds();
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
    params = searchFields;
  }
  if (params.length == 0) {
    params = searchFields;
  }
  let defaultcond: any = removeEmptyCondition(props.compUrl?.condition!);
  if (defaultcond?.length > 0) {
    params.push(...defaultcond);
  }
  let condition: any = {
    fieldList: params,
  };
  if (props.fieldList?.orderBy) {
    condition["orderBy"] = props.fieldList.orderBy;
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
    ids.push(analysisPrimaryKeys(props.primaryKey, temp));
  }
  return ids;
};
/**
 * Batch delete
 */
const batchDelete = async () => {
  await deleteById(getIds());
};
/**
 * Create search conditions
 * @param formData
 * @param orderBy Sorting
 */
const createSearchParams = (
  formData: SearchParams[],
  orderBy: OrderByInfo[] = [],
) => {
  searchFields = formData;
  orderBys = orderBy;
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
  if (props.btnPermissions && Object.keys(props.btnPermissions).length > 0) {
    permissions.value = props.btnPermissions;
  } else {
    pagePermission.setPermissionUrl(props.compUrl?.permissionsUrl);
    permissions.value = await pagePermission.addRoute(
      window.__hostRouter__?.currentRoute.value,
    );
  }
  // Whether to automatically load list data when initializing
  if (!props.fieldList?.stopAutoLoad) {
    loadByPage();
  } else {
    pageInfo.value.dataList = props.tableDataList || [];
    starHorseTableCompRef.value!.clearSelection();
    // If there is data that needs to be echoed, it needs to be selected
    // Before manually setting the selection, you must first clear the selection, otherwise there will be many duplicate selections
    props.reverseDataList?.forEach((item: any) => {
      starHorseTableCompRef.value!.toggleRowSelection(item, true);
    });
  }
  moveColumn();
  reCreateData();
};
// Listen for changes in data passed in from outside
watch(
  () => props.tableDataList,
  (val) => {
    if (props.fieldList?.stopAutoLoad) {
      pageInfo.value.dataList = val;
    }
  },
  { deep: true, immediate: false },
);
const assignData = (dataList: Array<any>) => {
  for (let key in dataList) {
    let temp: any = dataList[key];
    if (temp instanceof Array) {
      toolFields.push(...temp);
    } else if (temp.tabList?.length > 0) {
      for (let skey in temp.tabList) {
        let stemp = temp.tabList[skey];
        if (stemp?.fieldList) {
          toolFields.push(...stemp.fieldList);
        }
      }
    } else if (temp.dytableList?.length > 0) {
      for (let skey in temp.dytableList) {
        let stemp = temp.dytableList[skey];
        if (stemp) {
          toolFields.push(...stemp);
        }
      }
    } else {
      toolFields.push(temp);
    }
  }
};
const reCreateData = () => {
  toolFields = [];
  let tempList = props.fieldList?.fieldList;
  if (tempList) {
    assignData(tempList);
  }
};
const moveColumn = () => {
  const tbody = document.querySelector(
    ".sh-columns .el-table__body-wrapper tbody",
  ) as HTMLElement | null;
  if (tbody) {
    Sortable.create(tbody, {
      handle: ".move",
      animation: 200,
      ghostClass: "ghost",
      onEnd(event: any) {
        const { oldIndex, newIndex } = event;
        if (oldIndex === newIndex) {
          return;
        }
        // Insert current row at drag end position
        //  props.fieldList?.fieldList.splice(newIndex, 0, currRow);
        let oitem = props.fieldList?.fieldList[oldIndex];
        let nitem = props.fieldList?.fieldList[newIndex];
        props.fieldList.fieldList[newIndex] = oitem;
        props.fieldList.fieldList[oldIndex] = nitem;
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
    if (item["children"]?.length > 0) {
      flag = true;
      starHorseTableCompRef.value.toggleRowSelection(item, false);
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
  // If it is a popup selection, without specifying multiple selection, only one data can be selected
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
            temp1[key] = temp[key];
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
              if (temp.hasOwnProperty(skey) && stemp[skey] == temp[skey]) {
                bflag++;
              }
            }
            // If not equal, it means there is no same data
            if (bflag != Object.keys(stemp).length) {
              filters.push(temp);
            }
          }
        }
        multipleSelection.value = filters;
      } else {
        let ids = multipleSelection.value.map(
          (item: any) => item[keys],
        ) as Array<any>;
        multipleSelection.value = val.filter(
          (item: any) => !ids.includes(item[keys]),
        );
      }
      let data = multipleSelection.value[0];
      starHorseTableCompRef.value.toggleRowSelection(data, true);
    }
  } else {
    multipleSelection.value = val;
  }
};
const getRowIdentity = (row: any) => {
  return analysisPrimaryKeys(props.primaryKey, row) || "";
};

const tbCommonFun = (name: string | undefined, param: any) => {
  let id = analysisPrimaryKeys(props.primaryKey, param);
  if (name == "view") {
    viewById(id);
  } else if (name == "edit") {
    editById(id);
  } else if (name == "delete" || name == "batchDelete") {
    deleteById(id);
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
      temp = temp[arr[i]];
    }
    return temp;
  } else {
    return row[key] ?? uuid();
  }
};
const viewById = (id: any, isExpand: boolean = false) => {
  dialogProps!.viewVisible = true;
  dialogProps!.ids = id;
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
  dialogProps!.editVisible = true;
  dialogProps!.ids = id;
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
  let deleteUrl = props.compUrl?.deleteUrl!;
  if (isExpand) {
    deleteUrl = props.expandTable?.expandUrls?.deleteUrl!;
  }
  let flag = await deleteByIds(deleteUrl, Array.isArray(id) ? id : [id]);
  if (flag) {
    loadByPage();
  }
};
const pageSizeClick = (pageSize: number) => {
  pageInfo.value.pageSize = pageSize;
  loadByPage();
};
const pageChangeClick = (currentPage: number) => {
  pageInfo.value.currentPage = currentPage;
  loadByPage();
};
// Popup selector property name
const inputFieldName = ref<string>("");
// Popup selector property value
const inputFieldVal = ref<any>();
const createParams = () => {
  let searchTemp = [];
  let orderByTemp = JSON.parse(JSON.stringify(orderBys)) || [];
  if (props.filterCondition) {
    searchTemp.push(...props.filterCondition);
  }
  if (props.orderBy) {
    orderByTemp.push(...props.orderBy);
  }
  if (props.fieldList?.orderBy) {
    orderByTemp.push(...props.fieldList.orderBy);
  }
  if (searchFields.length > 0) {
    searchTemp.push(...searchFields);
  }
  let condition: any = removeEmptyCondition(props.compUrl?.condition!);
  if (condition && condition.length > 0) {
    searchTemp.push(...condition);
  }
  // Add shared person information
  if (props.commonPersons?.length && !isSystemManage()) {
    searchTemp.push(createCondition("a.createdBy", props.commonPersons, "in"));
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
    url = "/system-config/redirect/pageList";
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
      // If not paginated, display all returned data
      pageInfo.value.dataList = redata?.dataList || redata;
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
      (item: any) => item[name] == inputFieldVal.value,
    );
    if (row) {
      multipleSelection.value.push(row);
      starHorseTableCompRef.value.toggleRowSelection(row, true);
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
    starHorseTableCompRef.value.toggleRowExpansion(row);
  }
  if (multipleSelection.value?.length > 0) {
    for (let valueElement of multipleSelection.value) {
      starHorseTableCompRef.value.toggleRowSelection(valueElement);
    }
  }
  const selected = multipleSelection.value?.some(
    (item: any) => item[props.primaryKey] === row[props.primaryKey],
  );
  if (!selected) {
    multipleSelection.value.push(row);
    starHorseTableCompRef.value.toggleRowSelection(row, true);
  } else {
    multipleSelection.value = multipleSelection.value?.filter((item: any) => {
      return item[props.primaryKey] !== row[props.primaryKey];
    });
    starHorseTableCompRef.value.toggleRowSelection(row, false);
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

  // Separately defined buttons
  extendBtnsCopy?.forEach((item: UserFuncInfo) => {
    if (item.position != "toolbar") {
      if (!item.funcName) {
        item.funcName = (row: any) => tbCommonFun(item.authority, row);
      }
      arr.push(item);
    }
  });
  // Buttons defined when defining fields
  props.fieldList["userTableFuncs"]?.forEach((item: UserFuncInfo) => {
    if (item.position != "toolbar") {
      if (!item.funcName) {
        item.funcName = (row: any) => tbCommonFun(item.authority, row);
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
  }
  // If no priority is specified, sort by default addition method
  arr.sort(
    (a: UserFuncInfo, b: UserFuncInfo) =>
      (a.priority || 40) - (b.priority || 40),
  );
  return arr;
};
// After modification
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
  // If the corresponding field is not found in the current row data, search from the parent level
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
const loadField = (): FieldInfo[] => {
  let { fieldList } = analysisFields(props.fieldList?.fieldList);
  if (fieldList) {
    fieldList.sort(
      (a: FieldInfo, b: FieldInfo) => (a.priority || 100) - (b.priority || 100),
    );
    return fieldList.filter((item) => item.listVisible)?.slice(0, 3);
  }
  return [];
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
onMounted(() => {
  init();
});
// Export methods and variables
defineExpose({
  init,
  // Query
  createSearchParams,
  loadByPage,
  getIds,
  getSelectedDatas,
  multipleSelection,
  setDataInfo,

  // Button event
  tableCompFunc,
  getDatas,
  permissionList,
});
</script>
<template>
  <!-- Export data specified fields -->
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
      v-if="!dialogInput"
    >
      <div class="tb_title">
        <div v-if="title || helpMsg">
          <help :message="helpMsg" v-if="helpMsg" />
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
          v-if="!hideButtonList"
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
            border
          >
            <el-table-column prop="" :label="i18n('comp.sort')" width="60">
              <el-tag class="move" style="cursor: move">
                <el-icon style="cursor: move">
                  <Sort />
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
    <div class="data-list-area" v-if="dataShowType == 'list'">
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
        border
      >
        <el-table-column
          type="selection"
          align="center"
          fixed="left"
          :reserve-selection="true"
          v-if="showSelection"
        />
        <el-table-column type="expand" v-if="expandTable">
          <template #default="scope">
            <div class="expand-table">
              <h4>{{ expandTable.title }}</h4>
              <el-table
                :data="scope.row[expandTable.dataField]"
                :row-key="getRowIdentity"
                :stripe="true"
                :fit="true"
                :size="compSize"
                :highlight-current-row="true"
                :max-height="'400px'"
                :row-style="{ height: '30px' }"
                :cell-style="{ height: '30px', 'font-size': '12px' }"
                border
              >
                <el-table-column
                  fixed="left"
                  :label="i18n('table.operation')"
                  :width="160"
                  v-if="
                    expandTable.showButton && expandTable.extendFuncs.length > 0
                  "
                >
                  <template #default="innerScope">
                    <template
                      v-for="epd in expandTable.extendFuncs"
                      :key="compKey(epd, epd.authority)"
                    >
                      <el-tooltip :content="epd.btnName">
                        <star-horse-icon
                          v-if="permissions[epd.authority!]"
                          @click="
                            expandCommonFun(
                              epd.authority!,
                              innerScope.row,
                              scope.row,
                            )
                          "
                          :icon-class="epd.icon || 'edit'"
                          style="cursor: pointer"
                          :color="
                            epd.authority == 'delete'
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
                  :compSize="configInfo.inputSize"
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
        <table-column
          :fieldList="fieldList"
          :compSize="configInfo.inputSize"
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
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="data-card-area" v-else>
      <el-scrollbar height="100%">
        <el-space wrap>
          <el-card
            v-for="(data, key) in pageInfo.dataList"
            :key="compKey(data, key)"
            class="box-card"
            style="width: 250px !important; height: 180px !important"
            shadow="hover"
          >
            <template #header>
              <div
                class="card-header"
                @click="selectRow(data)"
                @dblclick="editData(data)"
              >
                <span>{{
                  dataFormat(
                    cardFieldList[0]?.fieldName,
                    data[cardFieldList[0]?.fieldName],
                    data,
                  )
                }}</span>
              </div>
            </template>

            <div
              class="card-item item"
              style="width: 99%; margin: 1px auto"
              :Key="compKey(item, key)"
              v-for="(item, key) in cardFieldList?.slice(1, 3)"
            >
              <label>{{ item.label }} :</label>
              <div
                class="content"
                @click="selectRow(data)"
                @dblclick="editData(data)"
              >
                <el-tooltip
                  :content="
                    dataFormat(item.fieldName, data[item.fieldName], data)
                  "
                >
                  {{ dataFormat(item.fieldName, data[item.fieldName], data) }}
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
      v-if="showPageBar"
      :total="pageInfo.totalData"
      @current-change="pageChangeClick"
      @size-change="pageSizeClick"
      :size="compSize"
      :page-sizes="[20, 50, 100, 200, 300, 400]"
      layout="total, sizes, prev, pager, next, jumper,slot"
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
