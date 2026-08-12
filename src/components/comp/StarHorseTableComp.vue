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
import piniaInstance from "@/store";
import {useButtonPermissionStore} from "@/store/ButtonPermission";
import {useDynamicFormStore} from "@/store/DynamicForm";
import {useGlobalConfigStore} from "@/store/GlobalConfig";
import {isSystemManage} from "@/utils/auth";
import {warning} from "@/utils/message";
import {i18n} from "@/lang";
import {computed, inject, nextTick, onActivated, onMounted, onUnmounted, provide, ref, watch,} from "vue";
import {isMobile} from "@/api/device";
import type {PreValid} from "@/components/types";
import FieldVisibleControl from "@/components/comp/utils/FieldVisibleControl.vue";
import {useTableExport} from "@/components/comp/utils/useTableExport";
import {useTableFields} from "@/components/comp/utils/useTableFields";
import {useTableSelection} from "@/components/comp/utils/useTableSelection";
import {useTableCrud} from "@/components/comp/utils/useTableCrud";
import StarHorsePanel from "@/components/comp/StarHorsePanel.vue";

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
const openMobileSearch = () => {
  mobileSearchRef.value?.handleMobileSearch();
};
// ===== composable: 字段管理（字段解析/APP卡片/列拖拽/模式切换） =====
const {
  toolFields, cacheAppCompList, mobileFieldVisible,
  dataShowType, typeTitle, typeIcon, reCreateData, moveColumn,
  loadField, cardFieldList, showType,
} = useTableFields({props});
// ===== composable: 选择管理（多选/单选/父子校验/选中同步） =====
const {
  multipleSelection, cardSelection, handleSelectionChange,
  getRowIdentity, filterData, setDataInfo, selectRow, getSelectedDatas,
  removeSelection,
} = useTableSelection({props, starHorseTableCompRef, pageInfo, dynamicForm, emits});
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
  pagePermission.setPermissionUrl(props.compUrl?.permissionsUrl);
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
  dynamicForm.setDataId(id);
  dynamicForm.setSelectData(row);
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
        if (res?.data?.code != 200) {
          res && console.error(res?.data?.cnMessage || res?.data?.enMessage);
          return;
        }
        let redata = res?.data?.data;
        const newData = redata?.dataList || redata;
        if ((props.pageKeepOldData || isMobile) && !searchFlag.value) {
          if (!pageInfo.value.dataList) {
            pageInfo.value.dataList = [];
          }
          const maxCachePages = isMobile ? 3 : 10;
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
const {
  viewById, editById, deleteById,
  expandCommonFun, buttonList,
} = useTableCrud({props, dialogProps, overrideOperation, searchFlag, loadByPage});
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
/** 列表滚动到底部时自动翻页 */
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
      :selfFunc="true"
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
          {{ exportFieldAllChecked ? i18n("comp.exportClearAll") : i18n("comp.exportSelectAll") }}
        </el-checkbox>
        <div class="export-field-panel__header-right">
          <el-button
              type="text"
              size="small"
              @click="resetExportFieldOptions"
          >
            {{ i18n("comp.exportResetDefault") }}
          </el-button>
          <span class="export-field-panel__tip">
            {{ i18n("comp.exportFieldTip")
                .replace("{n}", String(exportFieldSelectedCount))
                .replace("{total}", String(exportFieldOptions.length)) }}
          </span>
        </div>
      </div>
      <el-checkbox-group v-model="exportFieldCheckedModel" class="export-field-panel__body">
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
                    v-if="!isMobile"
                    :content="formatCellValue(item, data, dataFormat)"
                >
                  <span class="desc-value" @click="selectRow(data)" @dblclick="editData(data)">
                    {{ formatCellValue(item, data, dataFormat) }}
                  </span>
                </el-tooltip>
                <span
                    v-else
                    class="desc-value"
                    :title="formatCellValue(item, data, dataFormat)"
                    @click="selectRow(data)"
                    @dblclick="editData(data)"
                >
                  {{ formatCellValue(item, data, dataFormat) }}
                </span>
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
