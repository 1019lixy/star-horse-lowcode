<script setup lang="ts" name="StarHorseTableComp">
import {loadData, postRequest} from "@/api/star_horse_apis";
import {closeLoad, createCondition, formatCellValue, load,} from "@/api/star_horse_utils";
import {compKey, removeEmptyCondition} from "@/api/system";
import Tablebtn from "@/components/comp/items/tablebtn.vue";
import TableColumnItem from "@/components/comp/items/tableColumnItem.vue";
import Help from "@/components/help.vue";
import {DialogProps} from "@/components/types/DialogProps";
import {OrderByInfo} from "@/components/types/PageFieldInfo";
import {DataListProps, PageProps} from "@/components/types/PageProps";
import {BtnHideCondition, SearchParams} from "@/components/types/Params";
import {isSystemManage} from "@/utils/auth";
import {warning} from "@/utils/message";
import {i18n} from "@/lang";
import {computed, inject, nextTick, onActivated, onMounted, onUnmounted, provide, ref, watch,} from "vue";
import {isMobile} from "@/api/device";
import {ensureFieldIds} from "@/api/form_utils";
import type {PreValid} from "@/components/types";
import FieldVisibleControl from "@/components/comp/utils/FieldVisibleControl.vue";
import {useTableExport} from "@/components/comp/utils/useTableExport";
import {useTableFields} from "@/components/comp/utils/useTableFields";
import {useTableSelection} from "@/components/comp/utils/useTableSelection";
import {useTableCrud} from "@/components/comp/utils/useTableCrud";
import StarHorsePanel from "@/components/comp/StarHorsePanel.vue";
import {getButtonPermissionStore, getGlobalConfigStore} from "@/store/StoreManager";

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
// 渲染前为字段补充稳定 id，避免 key 变化导致列/单元格组件重复挂载/重复初始化
watch(
    () => props.fieldList,
    (val) => ensureFieldIds(val),
    {immediate: true},
);
let pagePermission = getButtonPermissionStore();
let configStore = getGlobalConfigStore();
let permissions = ref<Record<string, string>>({});
const configInfo = computed(() => configStore.configFormInfo);
let compSize = computed(
    () => configStore.configFormInfo?.inputSize || "default",
);
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
let dialogProps = inject("dialogProps") as DialogProps;
// APP端：搜索组件引用
const mobileSearchRef = ref<any>(null);
// APP端：搜索框右侧筛选图标 → 直接打开「高级筛选」面板
const openMobileAdvancedSearch = () => {
  mobileSearchRef.value?.handleMobileAdvanced();
};
// APP端：关键字查询防抖计时器（输入停止 500ms 后自动发一次请求，避免每次按键都打接口）
let mobileKeywordTimer: ReturnType<typeof setTimeout> | undefined;
const scheduleMobileKeywordSearch = () => {
  if (mobileKeywordTimer) clearTimeout(mobileKeywordTimer);
  mobileKeywordTimer = setTimeout(() => {
    mobileKeywordTimer = undefined;
    runMobileKeywordSearch();
  }, 500);
};
// APP端：内联搜索框关键字 → 仅对组件类型为 input 的可查询字段，构建「模糊匹配(lk)」的「或(orOperList)」查询
const runMobileKeywordSearch = () => {
  // 立即触发时取消待执行的防抖，避免重复请求
  if (mobileKeywordTimer) {
    clearTimeout(mobileKeywordTimer);
    mobileKeywordTimer = undefined;
  }
  const kw = (mobileSearchKeyword.value || "").trim();
  const inputFields = kw
    ? (props.searchFormData?.fieldList as any[] || []).filter(
        (f: any) => (f?.preps?.type || f?.type) === "input" && f?.fieldName,
      )
    : [];
  // 空关键字或无可用的 input 字段 → 清空条件重新加载
  if (!inputFields.length) {
    createSearchParams([]);
    return;
  }
  const toCond = (f: any): SearchParams => ({
    propertyName: f.fieldName,
    operation: "lk",
    value: kw,
  });
  const [first, ...rest] = inputFields;
  const cond: SearchParams = {
    ...toCond(first),
    orOperList: rest.map(toCond),
  };
  createSearchParams([cond]);
};
// ===== APP 端企业级列表改造状态 =====
// APP 端选择模式：头部勾选进入/退出，进入后卡片出现可勾选的 checkbox 且底栏常驻
const mobileBatchMode = ref<boolean>(false);
// 当前选中的卡片对象引用（选中才显示数据级操作按钮；对象标识避免主键缺失时误判）
const selectedCard = ref<any>(null);
// APP 端头部标题：优先 props.title，其次当前路由/菜单名，最后回落「数据列表」
const displayTitle = computed(() => {
  if (props.title) return props.title;
  const route = (window as any).__hostRouter__?.currentRoute?.value;
  return (
    route?.meta?.title ||
    route?.meta?.name ||
    route?.name ||
    i18n("comp.dataList")
  );
});
// APP 端内联搜索关键字（本地过滤 + 防抖服务端搜索）
const mobileSearchKeyword = ref<string>("");
// APP 端：关键字变化 → 防抖触发查询
watch(mobileSearchKeyword, () => scheduleMobileKeywordSearch());
// APP 端是否存在可查询字段：宿主传入 searchFormData 且含 fieldList 时才显示查询图标/面板
const hasMobileSearch = computed(
    () => (props.searchFormData?.fieldList?.length ?? 0) > 0,
);
// APP 端更多操作 popover 显隐
const mobileMoreVisible = ref<boolean>(false);
// APP 端工具栏按钮列表（直接构建，不依赖 StarHorseButtonList ref 时序）
const mobileToolbarBtnList = computed(() => {
  if (props.hideButtonList) return [];
  const arr: Array<any> = [
    { btnName: i18n("btn.add"), authority: "add", priority: 100 },
    { btnName: i18n("btn.batchAdd"), authority: "batchAdd", priority: 110 },
    { btnName: i18n("btn.download"), authority: "download", priority: 120 },
    { btnName: i18n("btn.execution"), authority: "execution", priority: 130 },
    { btnName: i18n("btn.importData"), authority: "upload", priority: 140 },
    { btnName: i18n("btn.exportData"), authority: "export", priority: 150 },
    { btnName: i18n("btn.batchDelete"), authority: "batchDelete", priority: 160 },
  ];
  if (props.extendBtns?.length > 0) {
    const extBtns =
      props.extendBtns.filter((item: any) => item.position == "toolbar") || [];
    if (extBtns.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        const temp = arr[i];
        if (
          extBtns.find(
            (item: any) =>
              item.btnName == temp.btnName && item.authority == temp.authority,
          )
        ) {
          arr.splice(i, 1);
        }
      }
      arr.push(...extBtns);
    }
  }
  arr.sort((a: any, b: any) => (a.priority || 100) - (b.priority || 100));
  return arr;
});
// APP 端「更多」菜单按钮：add 走 FAB、export/batchDelete 移到批量底栏，其余保留
const MOBILE_MENU_EXCLUDE = ["add", "export", "batchDelete"];
const mobileToolbarBtns = computed(() =>
  mobileToolbarBtnList.value.filter(
    (item: any) => !MOBILE_MENU_EXCLUDE.includes(item.authority),
  ),
);
// APP 端「更多操作」菜单项图标：authority → iconfont 图标类
const mobileMenuIconMap: Record<string, string> = {
  add: "add",
  batchAdd: "plus",
  download: "download",
  execution: "operation",
  upload: "upload",
  import: "upload",
  export: "data-view",
  batchDelete: "delete",
  refresh: "refresh",
  showHideColumns: "grid",
};
const mobileMenuIcon = (authority: string) =>
  mobileMenuIconMap[authority] || "operation";
// APP 端处理工具栏按钮点击（复制 btnOperation 核心逻辑）
const handleMobileToolbarBtn = (authority: string) => {
  mobileMoreVisible.value = false;
  if (authority === "refresh") {
    tableCompFunc("refresh");
    return;
  }
  if (authority === "showHideColumns") {
    mobileFieldVisible.value = true;
    return;
  }
  if (authority === "add") {
    if (dialogProps) {
      dialogProps.ids = -1;
      dialogProps.editVisible = true;
      dialogProps.dialogTitle = i18n("dialog.addTitle");
    }
    return;
  }
  if (authority === "batchAdd") {
    if (dialogProps) {
      dialogProps.batchEditVisible = true;
      dialogProps.batchDialogTitle = i18n("dialog.batchAddTitle");
    }
    return;
  }
  if (authority === "upload" || authority === "import") {
    warning(i18n("item.notSupportedOnApp"));
    return;
  }
  tableCompFunc(authority);
};
// APP 端 FAB 添加按钮
const handleMobileAdd = () => {
  handleMobileToolbarBtn("add");
};
// APP 端是否还有更多数据（滚动分页）
const hasMoreMobileData = computed(
  () =>
    !!pageInfo.value.totalPage &&
    pageInfo.value.currentPage < pageInfo.value.totalPage,
);
// APP 端批量选中数量
const mobileSelectedCount = computed(() =>
  Array.isArray(cardSelection.value) ? cardSelection.value.length : 0,
);
// APP 端全选/取消全选
const mobileAllSelected = computed({
  get: () => {
    const list = pageInfo.value.dataList || [];
    return (
      list.length > 0 &&
      list.every(
        (item: any) =>
          Array.isArray(cardSelection.value) &&
          cardSelection.value.includes(item),
      )
    );
  },
  set: (val: boolean) => {
    if (val) {
      cardSelection.value = [...(pageInfo.value.dataList || [])];
    } else {
      cardSelection.value = [];
    }
  },
});
// APP 端卡片是否被勾选（cardSelection 存行对象引用，避免主键缺失时误判）
const isCardChecked = (data: any): boolean =>
  Array.isArray(cardSelection.value) && cardSelection.value.includes(data);
// APP 端切换单张卡片勾选：直接更新 cardSelection（新数组触发 → multipleSelection 同步）
const toggleMobileSelect = (data: any) => {
  const cur = Array.isArray(cardSelection.value) ? cardSelection.value : [];
  cardSelection.value = cur.includes(data)
    ? cur.filter((item: any) => item !== data)
    : [...cur, data];
};
// APP 端全选 / 取消全选（仅切换勾选，不退出选择模式，底栏保持显示）
const toggleMobileSelectAll = () => {
  mobileAllSelected.value = !mobileAllSelected.value;
};
// APP 端进入 / 退出选择模式（头部 checkbox 触发；退出时清空勾选）
const toggleBatchMode = () => {
  mobileBatchMode.value = !mobileBatchMode.value;
  if (!mobileBatchMode.value) {
    cardSelection.value = [];
    selectedCard.value = null;
  }
};
// APP 端退出选择模式（底栏 ✕）：清空勾选并关闭底部面板
const exitBatchMode = () => {
  mobileBatchMode.value = false;
  cardSelection.value = [];
  selectedCard.value = null;
};
// APP 端点击卡片：选择模式下切换该卡片勾选；非选择模式下单选高亮并展开数据级操作按钮
const handleCardClick = (data: any) => {
  if (mobileBatchMode.value) {
    toggleMobileSelect(data);
    return;
  }
  selectedCard.value = selectedCard.value === data ? null : data;
  if (selectedCard.value) emits("selectItem", data);
};
// APP 端单选态判定（用于展示数据级操作按钮）
const isCardSelected = (data: any): boolean => selectedCard.value === data;
// APP 端清空内联搜索（keyword watcher 会防抖触发一次重载）
const clearMobileSearch = () => {
  mobileSearchKeyword.value = "";
};
// APP 端批量删除（复用现有 batchDelete）
const handleMobileBatchDelete = () => {
  batchDelete();
};
// APP 端批量编辑（复用批量编辑弹窗，与工具栏 batchAdd 同一入口）
const handleMobileBatchEdit = () => {
  if (mobileSelectedCount.value === 0) {
    warning(i18n("comp.selectedCount").replace("{n}", "0"));
    return;
  }
  if (dialogProps) {
    dialogProps.batchEditVisible = true;
    dialogProps.batchDialogTitle = i18n("btn.batchEdit");
  }
};
// APP 端批量导出（复用工具栏 export 流程，需先勾选数据）
const handleMobileBatchExport = () => {
  if (mobileSelectedCount.value === 0) {
    warning(i18n("comp.selectedCount").replace("{n}", "0"));
    return;
  }
  tableCompFunc("export");
};
// APP 端点击卡片任意区域即选中；批量模式下切换勾选。仅移动端生效（PC 走各自行处理器）
const onCardRootClick = (data: any) => {
  if (!isMobile.value) return;
  handleCardClick(data);
};
// APP 端卡片显示字段：直接取按 appListVisible 过滤的全部字段（默认 3 个）
const mobileCardFields = computed(() => cardFieldList.value || []);
// ===== composable: 字段管理（字段解析/APP卡片/列拖拽/模式切换） =====
const {
  toolFields,
  mobileFieldVisible,
  dataShowType,
  typeTitle,
  typeIcon,
  reCreateData,
  moveColumn,
  loadField,
  cardFieldList,
  mobileAllFields,
  showType,
} = useTableFields({props});
// ===== composable: 选择管理（多选/单选/父子校验/选中同步） =====
const {
  multipleSelection,
  cardSelection,
  handleSelectionChange,
  getRowIdentity,
  filterData,
  setDataInfo,
  selectRow,
  getSelectedDatas,
  removeSelection,
} = useTableSelection({
  props,
  starHorseTableCompRef,
  pageInfo,
  emits,
});
/**
 * Button area event
 * @param authority Permission code
 */
const tableCompFunc = (authority: any) => {
  if (authority == "refresh") {
    if (isMobile.value) {
      pageInfo.value.currentPage = 1;
      searchFlag.value = true;
    }
    loadByPage();
  } else if (authority == "batchDelete") {
    batchDelete();
  } else if (authority == "export") {
    initExportFieldOptions();
    exportOperationVisible.value = true;
  } else if (authority == "execution") {
    // 执行按钮：由外部通过 overrideOperation 处理
  }
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
// ===== composable: 导出逻辑（字段选择状态 + 导出请求） =====
const {
  exportOperationVisible,
  exportFieldOptions,
  exportFieldAllChecked,
  exportFieldIsIndeterminate,
  exportFieldCheckedModel,
  exportFieldSelectedCount,
  initExportFieldOptions,
  resetExportFieldOptions,
  getIds,
  selectedFields,
} = useTableExport({
  props,
  multipleSelection,
  searchFields,
  overrideOperation,
});
/** 批量删除 */
const batchDelete = async () => {
  const ids: any = getIds();
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
  pagePermission.setPermissionUrl(props.apiEndpoints?.permissionsUrl);
  permissions.value = await pagePermission.addRoute(
      window.__hostRouter__?.currentRoute.value,
  );
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
  // 初始化 APP 端字段缓存（卡片模式 + APP popover 数据源）
  // PC 端设置弹窗直接绑定 props.fieldList.fieldList 原数据，listVisible 改动即时生效
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
/** 双击行编辑 */
const editData = (row: any, _column?: any, evt?: Event) => {
  if (evt) {
    evt.stopPropagation();
  }
  let id = getRowIdentity(row);
  if (!props.dialogInput) {
    viewById(id);
  } else {
    emits("selectItem", row);
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
/** 构建搜索条件参数 */
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
  let condition: any = removeEmptyCondition(props.apiEndpoints?.condition!);
  if (condition && condition.length > 0) {
    searchTemp.push(...condition);
  }
  // Add shared person information
  if (props.commonPersons?.length && !isSystemManage()) {
    searchTemp.push(
        createCondition(props.userColumnName, props.commonPersons, "in"),
    );
  }
  if (!props.apiEndpoints?.pageListUrl) {
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
  let url: string = props.apiEndpoints?.pageListUrl as string;
  let params: any = createParams();
  if (props.apiEndpoints?.redirect) {
    params = {
      url,
      host: props.apiEndpoints?.host,
      port: props.apiEndpoints?.port,
      protocol: props.apiEndpoints?.protocol,
      env: props.apiEndpoints?.env,
      httpMethod: props.apiEndpoints?.httpMethod || "POST",
      dataType: props.apiEndpoints?.dataType || "JSON",
      searchInfo: params,
    };
    url =
        props.apiEndpoints?.redirectPageListUrl ?? "/system-config/redirect/pageList";
  }
  if (props.needLoad) {
    load(i18n("comp.dataLoading"));
  }
  postRequest(url, params)
      .then((res: any) => {
        if (res?.data?.code != 200) {
          res && console.error(res?.data?.cnMessage || res?.data?.enMessage);
          return;
        }
        let redata = res?.data?.data;
        const newData = redata?.dataList || redata;
        if ((props.pageKeepOldData || isMobile.value) && !searchFlag.value) {
          if (!pageInfo.value.dataList) {
            pageInfo.value.dataList = [];
          }
          const maxCachePages = isMobile.value ? 3 : 10;
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
// ===== composable: CRUD + 按钮列表（查看/编辑/删除/导出单条/行操作分发/按钮构建） =====
const {viewById, editById, deleteById, expandCommonFun, buttonList} =
    useTableCrud({
      props,
      dialogProps,
      overrideOperation,
      searchFlag,
      loadByPage,
    });
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
  let result = await loadData(url || props.apiEndpoints?.listConditionUrl!, {
    limits: limitSize,
    fieldList: tempSearchParams,
    orderBy: orderBys,
  });
  if (result.error) {
    warning(i18n("comp.dataLoadingException") + result.error);
  }
  return result.data;
};
/** 列表滚动到底部时自动翻页 */
const endReached = (direction: string) => {
  if (direction == "bottom" && isMobile.value) {
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
defineExpose({
  init,
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
  tableCompFunc,
  getDatas,
  permissionList,
  clearData,
});
</script>
<template>
  <star-horse-panel
      :type="dialogType"
      :isShowBtnContinue="false"
      :userAction="true"
      :title="i18n('comp.exportSelectFields')"
      :boxWidth="isMobile ? '90%' : '50%'"
      @merge="selectedFields"
      v-model="exportOperationVisible"
      @closeAction="exportOperationVisible = false"
  >
    <div class="export-field-panel">
      <div class="export-field-panel__header">
        <el-checkbox
            v-model="exportFieldAllChecked"
            :indeterminate="exportFieldIsIndeterminate"
        >
          {{
            exportFieldAllChecked
                ? i18n("comp.exportClearAll")
                : i18n("comp.exportSelectAll")
          }}
        </el-checkbox>
        <div class="export-field-panel__header-right">
          <el-button type="text" size="small" @click="resetExportFieldOptions">
            {{ i18n("comp.exportResetDefault") }}
          </el-button>
          <span class="export-field-panel__tip">
            {{
              i18n("comp.exportFieldTip")
                  .replace("{n}", String(exportFieldSelectedCount))
                  .replace("{total}", String(exportFieldOptions.length))
            }}
          </span>
        </div>
      </div>
      <el-checkbox-group
          v-model="exportFieldCheckedModel"
          class="export-field-panel__body"
      >
        <el-checkbox
            v-for="opt in exportFieldOptions"
            :key="opt.fieldName"
            :label="opt.fieldName"
            class="export-field-panel__item"
        >
          {{ opt.label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </star-horse-panel>
  <div class="star-horse-table">
    <!-- APP端企业级列表头部：标题 + 操作按钮 + 搜索 -->
    <div class="app-header" v-if="!dialogInput && isMobile">
      <div class="app-header__inner">
        <!-- 标题行 + 右上角操作按钮 -->
        <div class="app-header__top">
          <h1 class="app-header__title">{{ displayTitle }}</h1>
          <div class="app-header__actions">
            <!-- 批量选择（进入/退出选择模式） -->
            <button
                v-if="pageInfo.dataList?.length"
                class="app-header__btn"
                :class="{ 'is-active': mobileBatchMode }"
                :style="{
                  color: 'var(--star-horse-style)',
                }"
                @click="toggleBatchMode"
                :aria-label="i18n('comp.batchSelect')"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 12l2 2 4-4" v-if="mobileBatchMode"/>
              </svg>
            </button>
            <!-- 更多操作 popover -->
            <el-popover
                v-model:visible="mobileMoreVisible"
                trigger="click"
                placement="bottom-end"
                :width="180"
                popper-class="app-more-popover"
            >
              <template #reference>
                <button
                    class="app-header__btn"
                    style="color: var(--star-horse-style)"
                    :aria-label="i18n('btn.operation')"
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                  >
                    <circle cx="12" cy="5" r="2"/>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="12" cy="19" r="2"/>
                  </svg>
                </button>
              </template>
              <div class="app-more-menu">
                <div
                    v-for="btn in mobileToolbarBtns"
                    :key="btn.authority"
                    class="app-more-menu__item"
                    @click="handleMobileToolbarBtn(btn.authority)"
                >
                  <star-horse-icon
                      :icon-class="mobileMenuIcon(btn.authority)"
                      class="app-more-menu__item-icon"
                      size="16px"
                      :margin-left="'0'"
                      :margin-right="'0'"
                  />
                  <span class="app-more-menu__item-label">{{ btn.btnName }}</span>
                </div>
                <div class="app-more-menu__divider"></div>
                <div class="app-more-menu__item" @click="handleMobileToolbarBtn('refresh')">
                  <star-horse-icon
                      icon-class="refresh"
                      class="app-more-menu__item-icon"
                      size="16px"
                      :margin-left="'0'"
                      :margin-right="'0'"
                  />
                  <span class="app-more-menu__item-label">{{ i18n("comp.refresh") }}</span>
                </div>
                <div class="app-more-menu__item" @click="handleMobileToolbarBtn('showHideColumns')">
                  <star-horse-icon
                      icon-class="grid"
                      class="app-more-menu__item-icon"
                      size="16px"
                      :margin-left="'0'"
                      :margin-right="'0'"
                  />
                  <span class="app-more-menu__item-label">{{ i18n("comp.showHideColumns") }}</span>
                </div>
              </div>
            </el-popover>
          </div>
        </div>
        <!-- 内联搜索框（APP 端始终显示） -->
        <div class="app-search">
          <button
              type="button"
              class="app-search__icon-btn"
              :aria-label="i18n('comp.searchPlaceholder')"
              @click="runMobileKeywordSearch"
          >
            <star-horse-icon
                icon-class="search"
                class="app-search__icon"
                size="16px"
                cursor="pointer"
                :margin-left="'0'"
                :margin-right="'0'"
            />
          </button>
          <input
              v-model="mobileSearchKeyword"
              type="text"
              class="app-search__input"
              :placeholder="i18n('comp.searchPlaceholder')"
              @keyup.enter="runMobileKeywordSearch"
          />
          <button
              v-if="mobileSearchKeyword"
              class="app-search__clear"
              @click="clearMobileSearch"
          >✕</button>
          <!-- 搜索/高级筛选图标（对应模板 fa-sliders）→ 直接打开搜索面板 -->
          <button
              v-if="hasMobileSearch"
              class="app-search__filter-btn"
              style="color: var(--star-horse-style)"
              :aria-label="i18n('comp.advancedFilter')"
              @click="openMobileAdvancedSearch"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
              <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
              <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <!-- APP端显示/隐藏列弹窗 -->
    <star-horse-panel
        v-model="mobileFieldVisible"
        :title="i18n('comp.showHideColumns')"
        width="90%"
        class="app-field-dialog"
        v-if="isMobile"
    >
      <div class="app-field-list">
        <div
            v-for="(item, idx) in mobileAllFields"
            :key="item.id ?? idx"
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
        <div v-if="!mobileAllFields.length" class="app-field-empty">
          {{ i18n("pivot.empty.noData") }}
        </div>
      </div>
    </star-horse-panel>
    <!-- APP端搜索组件（隐藏触发器，仅提供弹窗；由宿主传入 searchFormData 才能填充「简单查询」字段） -->
    <star-horse-search-comp
        v-if="isMobile && hasMobileSearch"
        ref="mobileSearchRef"
        :formData="searchFormData"
        :apiEndpoints="apiEndpoints"
        @searchData="(data: any) => createSearchParams(data)"
    />
    <div
        class="flex w-full justify-between"
        style="border-bottom: var(--star-horse-style) 1px solid"
        v-if="!dialogInput && !isMobile"
    >
      <div class="tb_title">
        <div class="flex items-center" v-if="title || helpMsg">
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
            :apiEndpoints="apiEndpoints"
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
        <field-visible-control :fields="fieldList?.fieldList"/>
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
                    :apiEndpoints="apiEndpoints"
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
            :apiEndpoints="apiEndpoints"
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
          :apiEndpoints="apiEndpoints"
          :btnPermissions="permissions"
          :extendBtns="extendBtns"
          :dialogProps="dialogProps"
          :preValidFunc="preValidFunc"
          v-if="!hideButtonList && isMobile"
      />
      <!-- APP 端结果计数行 -->
      <div class="app-result-bar" v-if="isMobile">
        <span class="app-result-bar__count">{{
          i18n("comp.resultCount").replace(
            "{n}",
            String(pageInfo.totalData || 0),
          )
        }}</span>
      </div>
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
              :class="{
                'box-card--mobile': isMobile,
                'box-card--selected': isMobile && (isCardChecked(data) || isCardSelected(data)),
              }"
              :style="{ width: isMobile ? '100%' : '390px' }"
              shadow="hover"
              @click="onCardRootClick(data)"
          >
            <template #header>
              <!-- APP 端企业级卡片头部 -->
              <div
                  v-if="isMobile"
                  class="card-header--app"
                  @dblclick="editData(data)"
              >
                <div
                    v-if="mobileBatchMode"
                    class="card-checkbox"
                    :class="{ 'is-checked': isCardChecked(data) }"
                    @click.stop="toggleMobileSelect(data)"
                >
                  <svg v-if="isCardChecked(data)" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div class="card-header__main">
                  <h3 class="card-header__title">{{
                    formatCellValue(mobileCardFields?.[0], data, dataFormat)
                  }}</h3>
                </div>
              </div>
              <!-- PC 端原有卡片头部 -->
              <div
                  v-else
                  class="card-header justify-start gap-3"
                  style="margin: 0 !important"
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
                  v-for="(item, key) in (isMobile ? mobileCardFields : cardFieldList)?.slice(1)"
                  :key="compKey(item, key)"
                  label-align="right"
                  :label="item?.label"
              >
                <el-tooltip
                    v-if="!isMobile"
                    :content="formatCellValue(item, data, dataFormat)"
                >
                  <span
                      class="desc-value"
                      @click="selectRow(data)"
                      @dblclick="editData(data)"
                  >
                    {{ formatCellValue(item, data, dataFormat) }}
                  </span>
                </el-tooltip>
                <span
                    v-else
                    class="desc-value"
                    :title="formatCellValue(item, data, dataFormat)"
                    @dblclick="editData(data)"
                >
                  {{ formatCellValue(item, data, dataFormat) }}
                </span>
              </el-descriptions-item>
            </el-descriptions>
            <!-- APP 端：非选择模式下单选高亮的卡片才出现数据级操作按钮（放主体内，避免 el-card footer 空条） -->
            <div
                v-if="isMobile && isCardSelected(data) && !mobileBatchMode"
                class="card-actions--app"
                @click.stop
            >
              <tablebtn
                  :row="data"
                  :permissions="permissions"
                  :buttonList="buttonList"
                  :showLimit="3"
                  :hideBtnCondition="hideBtnCondition"
                  :compSize="compSize"
              />
            </div>
            <template #footer>
              <!-- PC 端：始终显示操作按钮 -->
              <tablebtn
                  v-if="!isMobile"
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
        <!-- APP 端滚动分页底部提示 -->
        <div class="app-scroll-tip" v-if="isMobile">
          <span v-if="hasMoreMobileData">{{ i18n("comp.loadingMore") }}</span>
          <span v-else-if="pageInfo.dataList?.length">{{
            i18n("comp.noMoreData")
          }}</span>
        </div>
      </el-scrollbar>
      <!-- APP 端批量操作底栏（选择模式下常驻，取消全部勾选也不关闭） -->
      <div
          class="app-batch-bar"
          v-if="isMobile && mobileBatchMode"
      >
        <div class="app-batch-bar__info">
          <span>{{
            i18n("comp.selectedCount").replace(
              "{n}",
              String(mobileSelectedCount),
            )
          }}</span>
          <button class="app-batch-bar__select-all" @click="toggleMobileSelectAll">
            {{ mobileAllSelected ? i18n("comp.cancelBatch") : i18n("comp.selectAll") }}
          </button>
        </div>
        <div class="app-batch-bar__actions">
          <button
              class="app-batch-bar__btn app-batch-bar__btn--secondary"
              @click="handleMobileBatchEdit"
              v-if="permissions['batchAdd']"
          >
            <star-horse-icon
                icon-class="edit"
                class="app-batch-bar__btn-icon"
                size="15px"
                :color="'currentColor'"
                :margin-left="'0'"
                :margin-right="'0'"
            />
            <span>{{ i18n("btn.batchEdit") }}</span>
          </button>
          <button
              class="app-batch-bar__btn app-batch-bar__btn--secondary"
              @click="handleMobileBatchExport"
              v-if="permissions['export']"
          >
            <star-horse-icon
                icon-class="data-view"
                class="app-batch-bar__btn-icon"
                size="15px"
                :color="'currentColor'"
                :margin-left="'0'"
                :margin-right="'0'"
            />
            <span>{{ i18n("btn.exportData") }}</span>
          </button>
          <button
              class="app-batch-bar__btn app-batch-bar__btn--danger"
              @click="handleMobileBatchDelete"
              v-if="permissions['batchDelete']"
          >
            <star-horse-icon
                icon-class="delete"
                class="app-batch-bar__btn-icon"
                size="15px"
                :color="'currentColor'"
                :margin-left="'0'"
                :margin-right="'0'"
            />
            <span>{{ i18n("btn.batchDelete") }}</span>
          </button>
          <button
              class="app-batch-bar__btn app-batch-bar__btn--icon"
              @click="exitBatchMode"
              :aria-label="i18n('comp.cancelBatch')"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
    <!-- APP 端 FAB 添加按钮（选择模式下隐藏，让位给批量底栏） -->
    <button
        class="app-fab"
        @click="handleMobileAdd"
        v-if="isMobile && !mobileBatchMode && !dialogInput && !hideButtonList && permissions['add']"
        :aria-label="i18n('btn.add')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </button>

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

/* APP端卡片占满宽度，企业级圆角16px；overflow:hidden 保证内部 header/body 被裁剪出圆角 */
.box-card--mobile {
  width: 100% !important;
  margin-bottom: 10px;
  border-radius: 8px !important;
  overflow: hidden;
  transition: all 0.2s ease;

  :deep(.el-card__body) {
    padding: 12px 16px;
  }

  :deep(.el-card__header) {
    padding: 12px 16px;
    border-bottom: none;
  }

  /* APP 端操作按钮已移入 body，footer 常空 → 去掉内边距避免空白条 */
  :deep(.el-card__footer) {
    padding: 0;
    border-top: none;
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

/* ===== APP 端企业级列表头部 ===== */
.app-header {
  position: sticky;
  top: 0;
  z-index: 60;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--el-border-color-lighter);

  &__inner {
    padding: 10px 16px;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    margin-left: auto;
  }

  &__btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #4b5563;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:active,
    &:hover {
      background: #f3f4f6;
    }

    &.is-active {
      color: var(--star-horse-style);
      background: rgba(37, 99, 235, 0.08);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__btn-icon {
    cursor: pointer;
    color: #4b5563;
  }
}

/* APP 端内联搜索框 */
.app-search {
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 12px;
  padding: 8px 14px;
  margin-bottom: 10px;
  transition: all 0.2s ease;

  &:focus-within {
    background: white;
    box-shadow: 0 0 0 2px var(--star-horse-style);
  }

  &__icon-btn {
    border: none;
    background: transparent;
    padding: 0;
    margin: 0 8px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    line-height: 0;
  }

  &__icon {
    color: var(--star-horse-style);
    flex-shrink: 0;
  }

  &__input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 15px;
    color: #1f2937;
    min-width: 0;

    &::placeholder {
      color: #9ca3af;
    }
  }

  &__clear {
    border: none;
    background: transparent;
    color: #9ca3af;
    cursor: pointer;
    font-size: 14px;
    padding: 0 4px;
    flex-shrink: 0;
  }

  &__filter-btn {
    border: none;
    background: transparent;
    color: #6b7280;
    cursor: pointer;
    padding: 0 4px 0 10px;
    margin-left: 8px;
    border-left: 1px solid #e5e7eb;
    flex-shrink: 0;
    display: flex;
    align-items: center;

    svg {
      width: 18px;
      height: 18px;
      display: block;
    }
  }
}


/* APP 端结果计数行 */
.app-result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  font-size: 14px;
  color: #6b7280;

  &__count {
    flex-shrink: 0;
  }
}

/* APP 端卡片选中态 */
.box-card--selected {
  border: 2px solid var(--star-horse-style) !important;
  background: rgba(37, 99, 235, 0.04) !important;
}

/* APP 端企业级卡片头部 */
.card-header--app {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;

  &__main {
    flex: 1;
    min-width: 0;
  }
}

/* APP 端自定义 checkbox（按模板 22x22 圆角6px） */
.card-checkbox {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  cursor: pointer;

  svg {
    width: 14px;
    height: 14px;
  }

  &.is-checked {
    background: var(--star-horse-style);
    border-color: var(--star-horse-style);
  }
}

/* APP 端更多操作菜单 */
.app-more-menu {
  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    font-size: 14px;
    color: #374151;
    cursor: pointer;
    transition: all 0.15s ease;

    &:active,
    &:hover {
      background: #f3f4f6;
    }
  }

  &__item-icon {
    color: var(--star-horse-style);
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__item-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__divider {
    height: 1px;
    background: #f3f4f6;
    margin: 4px 0;
  }
}

.card-header__title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

/* APP 端卡片选中后的数据级操作区（位于卡片主体内） */
.card-actions--app {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f3f4f6;
}

/* APP 端滚动分页提示 */
.app-scroll-tip {
  text-align: center;
  padding: 16px 0;
  font-size: 14px;
  color: #9ca3af;
}

/* APP 端批量操作底栏 */
.app-batch-bar {
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #f3f4f6;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  z-index: 40;

  &__info {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #4b5563;
  }

  &__select-all {
    border: none;
    background: transparent;
    color: var(--star-horse-style);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  &__actions {
    display: flex;
    gap: 8px;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 8px 16px;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;

    &-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      line-height: 0;

      svg {
        width: 15px;
        height: 15px;
      }
    }

    &--secondary {
      background: #f3f4f6;
      color: var(--star-horse-style);
    }

    &--danger {
      background: #ef4444;
      color: white;
    }

    &--icon {
      background: #f3f4f6;
      color: #6b7280;
      padding: 8px 14px;
      font-size: 15px;
      line-height: 1;
    }
  }
}

/* APP 端 FAB 添加按钮（缩小至 48x48，圆角 12px，更贴合内容区） */
.app-fab {
  position: fixed;
  bottom: calc(80px + env(safe-area-inset-bottom, 0px));
  right: 48px;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--star-horse-style) 0%, #3b82f6 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.32);
  z-index: 45;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 22px;
    height: 22px;
  }

  &:active {
    transform: scale(0.95);
  }
}

/* APP 端显示/隐藏列弹窗 */
.app-field-dialog {
  :deep(.el-dialog__body) {
    padding: 16px;
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

/* 导出字段选择面板 */
.export-field-panel {
  width: 100%;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    margin-bottom: 8px;
  }

  &__header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__tip {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  &__body {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px 12px;
    max-height: 50vh;
    overflow-y: auto;
    padding: 4px 12px 12px;
  }

  &__item {
    margin-right: 0;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* APP端单列布局 */
@media screen and (max-width: 768px) {
  .export-field-panel__body {
    grid-template-columns: 1fr;
  }
}
</style>
