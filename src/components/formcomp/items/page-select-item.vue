<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef, watch } from "vue";
import { PageProps } from "@/components/types/PageProps";
import { closeLoad, createCondition, load } from "@/api/star_horse_utils";
import { postRequest } from "@/api/star_horse_apis";
import {
  FieldInfo,
  FieldMapping,
  OrderByInfo,
} from "@/components/types/PageFieldInfo";
import { SearchParams } from "@/components/types/Params";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
  relationEventDispatcher,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { compKey, getDynamicEvents } from "@/api/system";
import { warning } from "@/utils/message";
import { SearchFields } from "@/components/types";

import { ItemPreps } from "@/components/types/ItemPreps";
import { i18n } from "@/lang";
import { StarHorseIcon } from "@/components/comp";
import { Search } from "@element-plus/icons-vue";
import { useMobilePicker } from "@/components/formcomp/utils/useMobilePicker";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["userAction", "selectItem"]);
const formData = defineModel("formData");
const starHorseTableCompRef = ref();
const filterCondition = ref<Array<SearchParams>>([]);

const orderBy = ref<Array<OrderByInfo>>([]);

let multipleSelection = shallowRef<Array<any>>([]);
let pageInfo = ref<PageProps>({
  pageSize: 20,
  currentPage: 1,
  totalData: 0,
  totalPage: 0,
  dataList: [],
});

let searchData = shallowRef<Array<SearchParams>>([]);
const pageSizeClick = (pageSize: number) => {
  pageInfo.value.pageSize = pageSize;
  loadByPage();
};
const pageChangeClick = (currentPage: number) => {
  pageInfo.value.currentPage = currentPage;
  loadByPage();
};

const mobileLoading = ref(false);
const mobileScrollbarRef = ref();
const loadByPage = (isAppend: boolean = false) => {
  let fieldList = [...searchData.value];
  if (filterCondition.value?.length > 0) {
    fieldList.push(...filterCondition.value);
  }
  let orderByTemp = [] as Array<OrderByInfo>;
  if (orderBy.value?.length > 0) {
    orderByTemp = orderBy.value;
  }
  if (!props.field.preps?.["apiEndpoints"]?.pageListUrl) {
    return Promise.resolve();
  }
  let params: any = {
    currentPage: pageInfo.value.currentPage,
    pageSize: pageInfo.value.pageSize,
    fieldList,
    orderBy: orderByTemp,
  };
  let url: string = props.field.preps?.apiEndpoints?.pageListUrl;
  if (props.field.preps?.apiEndpoints.redirect) {
    params = {
      url,
      host: props.field.preps?.apiEndpoints?.host,
      port: props.field.preps?.apiEndpoints?.port,
      protocol: props.field.preps?.apiEndpoints?.protocol,
      env: props.field.preps?.apiEndpoints?.env,
      httpMethod: props.field.preps?.apiEndpoints?.httpMethod || "POST",
      dataType: props.field.preps?.apiEndpoints?.dataType || "JSON",
      searchInfo: params,
    };
    url =
      props.field.preps?.apiEndpoints?.redirectPageListUrl ??
      "/system-config/redirect/pageList";
  }
  load(i18n("item.dataLoading"));
  return postRequest(url, params)
    .then((res) => {
      let redata = res.data?.data;
      if (isAppend) {
        pageInfo.value.dataList = [
          ...pageInfo.value.dataList,
          ...(redata?.dataList || []),
        ];
      } else {
        pageInfo.value.dataList = redata?.dataList;
        resolveDefaultFields(pageInfo.value.dataList?.[0]);
      }
      pageInfo.value.totalPage = redata?.totalPages;
      pageInfo.value.totalData = redata?.totalDatas;

    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      closeLoad();
    });
};
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const searchDataFun = (data: any) => {
  searchData.value = data;
  pageInfo.value.currentPage = 1;
  mobileScrollbarRef.value?.setScrollTop(0);
  loadByPage();
};
const mobileKeyword = ref("");
const onMobileSearch = () => {
  const keyword = mobileKeyword.value.trim();
  if (!keyword) {
    searchData.value = [];
  } else {
    const fields = listColumns.value.map((col: FieldInfo) => col.fieldName);
    if (fields.length === 0) {
      searchData.value = [];
    } else {
      const condition = createCondition(fields[0], keyword, "lk");
      if (fields.length > 1) {
        condition.orOperList = fields
          .slice(1)
          .map((f) => createCondition(f, keyword, "lk"));
      }
      searchData.value = [condition];
    }
  }
  pageInfo.value.currentPage = 1;
  mobileScrollbarRef.value?.setScrollTop(0);
  loadByPage();
};
const getRowIdentity = (row: any) => {
  return row[resolvePrimaryKey()];
};
const handleSelectionChange = (val: any) => {
  if (!props.field.preps?.multiple) {
    if (val.length <= 1) {
      multipleSelection.value = val;
    } else {
      let keys: any = props.field.preps?.primaryKey || defaultFields.value?.codeField || props.field.fieldName;
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
const selectRow = (row: any, _column: any, _evt: any) => {
  if (multipleSelection.value?.length > 0) {
    for (let valueElement of multipleSelection.value) {
      starHorseTableCompRef.value.toggleRowSelection(valueElement);
    }
  }
  const selected = multipleSelection.value.some(
    (item: any) =>
      item[resolvePrimaryKey()] ===
      row[resolvePrimaryKey()],
  );
  if (!selected) {
    if (!props.field.preps?.multiple) {
      multipleSelection.value = [row];
    } else {
      multipleSelection.value.push(row);
    }
    starHorseTableCompRef.value.toggleRowSelection(row);
  } else {
    multipleSelection.value = multipleSelection.value.filter(
      (item: any) =>
        item[props.field.preps?.primaryKey] !==
        row[props.field.preps?.primaryKey],
    );
    starHorseTableCompRef.value.toggleRowSelection(row, false);
  }

};
const loadSourceField = (aliasFirst: boolean = true) => {
  let fields: any = props.field.preps?.["needField"];
  let name = aliasFirst
    ? props.field.preps?.["aliasName"] || props.field.fieldName
    : props.field.fieldName;
  const mapped = fields?.find((temp: FieldMapping) => temp.distField == name)?.sourceField;
  if (mapped) return mapped;
  // 无 needField 映射时用接口行数据解析的默认值字段兜底
  return defaultFields.value?.codeField || "";
};
// 接口行数据解析的默认字段缓存：codeField 为存表单的值字段（fieldName 在行数据中存在则用之，否则取 ID 开头字段，再无则第一个字段），displayField 为显示字段（第一个非 ID 开头字段）
const defaultFields = ref<{codeField: string, displayField: string} | null>(null);
const resolveDefaultFields = (row: any) => {
  if (defaultFields.value || !row || typeof row !== "object") return;
  const keys = Object.keys(row);
  if (!keys.length) return;
  const idField = keys.find((k) => /^id/i.test(k));
  const labelKey = keys.find((k) => !/^id/i.test(k));
  const name = props.field.fieldName;
  defaultFields.value = {
    codeField: name in row ? name : (idField || keys[0]),
    displayField: labelKey || keys[0],
  };
};
// 行数据的值字段：fieldName 存在于行数据则用之，否则用默认解析的值字段，兜底 fieldName
const resolveCodeField = (row: any): string => {
  const name = props.field.fieldName;
  if (row && typeof row === "object") {
    resolveDefaultFields(row);
    if (name in row) return name;
  }
  return defaultFields.value?.codeField || name;
};
// 显示字段：优先 displayField 配置，否则默认解析的显示字段（第一个非 ID 业务字段），兜底 fieldName
const resolveDisplayField = (): string =>
    props.field.preps?.displayField || defaultFields.value?.displayField || props.field.fieldName;
// 主键字段：优先 primaryKey 配置，否则默认解析的值字段，兜底 fieldName
const resolvePrimaryKey = (): string =>
    props.field.preps?.primaryKey || defaultFields.value?.codeField || props.field.fieldName;
const echoSelection = () => {
  let realName = props.field.aliasName || props.field.fieldName;
  let value: any = formData.value[realName];
  if (!value) return;
  let sourceField = loadSourceField();
  if (!sourceField) {
    sourceField = realName;
  }
  const values = Array.isArray(value) ? value : [value];
  for (const row of pageInfo.value.dataList) {
    if (values.includes(row[sourceField])) {
      starHorseTableCompRef.value?.toggleRowSelection(row, true);
    }
  }
};
const loadSelectedRows = () => {
  let fieldName = loadSourceField();
  let value: any =
    formData.value[props.field.aliasName || props.field.fieldName];
  if (!fieldName || !value) return;
  const values = Array.isArray(value) ? value : value.split(";");
  if (!values.length) return;
  if (!props.field.preps?.["apiEndpoints"]?.pageListUrl) return;
  let conditions: SearchParams[] = [createCondition(fieldName, values, "in")];
  let params: any = {
    currentPage: 1,
    pageSize: values.length,
    fieldList: conditions,
    orderBy: [],
  };
  let url: string = props.field.preps?.apiEndpoints?.pageListUrl;
  if (props.field.preps?.apiEndpoints.redirect) {
    params = {
      url,
      host: props.field.preps?.apiEndpoints?.host,
      port: props.field.preps?.apiEndpoints?.port,
      protocol: props.field.preps?.apiEndpoints?.protocol,
      env: props.field.preps?.apiEndpoints?.env,
      httpMethod: props.field.preps?.apiEndpoints?.httpMethod || "POST",
      dataType: props.field.preps?.apiEndpoints?.dataType || "JSON",
      searchInfo: params,
    };
    url =
      props.field.preps?.apiEndpoints?.redirectPageListUrl ??
      "/system-config/redirect/pageList";
  }
  postRequest(url, params)
    .then((res) => {
      let redata = res.data?.data;
      multipleSelection.value = redata?.dataList || [];
    })
    .catch((err) => {
      console.error(err);
    });
};
const assignVal = () => {
  let fields: any = props.field.preps?.["needField"];
  let name = props.field.fieldName;
  if (fields) {
    fields.forEach((temp: FieldMapping) => {
      let value = multipleSelection.value.map(
        (item: any) => item[temp.sourceField],
      );
      if (!props.field.preps?.multiple) {
        value = value[0];
      }
      if (fields.length == 1) {
        formData.value[name] = value;
      } else {
        formData.value[temp.distField] = value;
      }
    });
  } else {
    formData.value[name] = multipleSelection.value.map((item) => item[resolveCodeField(item)]);
  }
  if (props.field.preps?.["recall"]) {
    props.field.preps?.["recall"](multipleSelection.value);
  }
};

const multiple = computed(() => !!props.field.preps?.multiple);

const {
  isSeparate,
  pickerVisible: mobilePickerVisible,
  placement,
  size,
  title: pickerTitle,
  openPicker,
  closePicker,
} = useMobilePicker(() => props.field);

const listColumns = computed(() => {
  const list = props.field.preps?.["fieldList"] || [];
  return list.filter(
    (f: FieldInfo) => f.listVisible !== false && !f.preps?.staticData,
  );
});
const isRowSelected = (row: any) => {
  const pk = resolvePrimaryKey();
  return multipleSelection.value.some(
    (item: any) => item[pk] === row[pk],
  );
};
const onMobileRowClick = (row: any) => {
  if (multiple.value) {
    toggleMobileRow(row);
  } else {
    multipleSelection.value = [row];
  }
};
const toggleMobileRow = (row: any) => {
  if (isRowSelected(row)) {
    const pk = resolvePrimaryKey();
    multipleSelection.value = multipleSelection.value.filter(
      (item: any) => item[pk] !== row[pk],
    );
  } else {
    multipleSelection.value = [...multipleSelection.value, row];
  }
};
const submitMobilePicker = () => {
  assignVal();
  itemAction("change");
  const dataRelation = props.field.preps?.dataRelation;
  if (dataRelation?.actionName) {
    relationEventDispatcher(
      props,
      dataRelation,
      formData.value[props.field.fieldName],
      formData,
      dataRelation.actionName,
    );
  }
  closePicker();
};
const onMobileScroll = ({ scrollTop, scrollHeight, clientHeight }: any) => {
  if (scrollTop + clientHeight < scrollHeight - 20) return;
  if (mobileLoading.value) return;
  if (pageInfo.value.currentPage >= pageInfo.value.totalPage) return;
  pageInfo.value.currentPage++;
  mobileLoading.value = true;
  loadByPage(true).finally(() => {
    mobileLoading.value = false;
  });
};

const tagList = computed<string[]>({
  get: () => {
    const sel = multipleSelection.value || [];
    if (!sel.length) {
      const val = formData.value?.[props.field.fieldName];
      if (val == null) return [];
      return Array.isArray(val) ? val : [val];
    }
    return sel.map((r: any) => r[resolveDisplayField()]);
  },
  set: (val) => {
    if (!val || val.length === 0) {
      multipleSelection.value = [];
    } else {
      const displayField = resolveDisplayField();
      multipleSelection.value = multipleSelection.value.filter(
        (r: any) => val.includes(r[displayField]),
      );
    }
    assignVal();
  },
});

const popoverVisible = ref(false);
const inputTagRef = ref();
const popoverWidth = ref(600);
const submitSelection = () => {
  assignVal();
  itemAction("change");
  const dataRelation = props.field.preps?.dataRelation;
  if (dataRelation?.actionName) {
    relationEventDispatcher(
      props,
      dataRelation,
      formData.value[props.field.fieldName],
      formData,
      dataRelation.actionName,
    );
  }
  popoverVisible.value = false;
};

watch(
  () => props.field.preps?.["apiEndpoints"],
  () => {
    loadByPage();
  },
);
watch(popoverVisible, async (val) => {
  if (val) {
    await nextTick();
    const el = inputTagRef.value?.$el ?? inputTagRef.value;
    if (el?.offsetWidth) {
      popoverWidth.value = el.offsetWidth;
    }
    echoSelection();
  }
});
onMounted(async () => {
  await nextTick();
  let inputPreps = props.field?.preps;
  if (!inputPreps) {
    warning(i18n("item.propertyNeedsParams") + props.field?.label);
    return;
  }
  if (!inputPreps.searchFieldList || inputPreps.searchFieldList?.length == 0) {
    let searchFieldList: Array<SearchFields> = [];
    inputPreps.fieldList?.forEach((item: FieldInfo) => {
      if (item.searchVisible) {
        let temp: any = { ...item };
        if (item.prefix) {
          temp["fieldName"] = item.prefix + "." + temp["fieldName"];
        }
        temp["defaultVisible"] = true;
        if ((!item?.type || item?.type == "input") && !item["matchType"]) {
          temp["matchType"] = "lk";
        }
        searchFieldList.push(temp);
      }
    });
    inputPreps.searchFieldList = { fieldList: searchFieldList };
  }
  await loadByPage();
  loadSelectedRows();
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});</script>
<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-popover
      v-if="!isSeparate"
      v-model:visible="popoverVisible"
      trigger="click"
      placement="bottom-start"
      :width="popoverWidth"
      popper-class="page-select-popper"
      :disabled="checkIsDisabled(props)"
      :show-arrow="false"
      :offset="4"
    >
      <template #reference>
        <el-input-tag
          ref="inputTagRef"
          v-bind="prepsFilter(field.preps)"
          :fid="field.fieldName"
          v-on="getDynamicEvents(props, itemAction, formData)"
          v-model="tagList"

          :disabled="checkIsDisabled(props)"
          :placeholder="field.preps?.placeholder || i18n('api.pleaseSelectData2')"
        >
          <template #suffix>
            <star-horse-icon
              cursor="pointer"
              icon-class="arrow-down"
              size="18px"
              :color="
                !disabled
                  ? 'var(--star-horse-style)'
                  : 'var(--el-disabled)'
              "
            />
          </template>
        </el-input-tag>
      </template>
      <div class="page-select-panel">
        <div class="page-select-panel__search">
          <star-horse-search-comp
            :formData="field.preps?.['searchFieldList']"
            @searchData="(data: any) => searchDataFun(data)"
            :mutComp="true"
            :apiEndpoints="field.preps?.['apiEndpoints']"
          />
        </div>
        <el-table
          ref="starHorseTableCompRef"
          :data="pageInfo.dataList"
          @selection-change="handleSelectionChange"
          @row-click="selectRow"
          :stripe="true"
          :row-key="getRowIdentity"
          :fit="true"
          max-height="300px"
          :highlight-current-row="true"
          :header-cell-style="{
            background: '#f2f2f2',
            color: '#707070',
            'font-size': '13px',
          }"
          :cell-style="{ 'font-size': '12px' }"
          border
          size="small"
        >
          <el-table-column
            type="selection"
            align="center"
            fixed="left"
            :reserve-selection="true"
            width="42"
          />
          <template
            v-for="(item, key) in field.preps?.fieldList"
            :key="compKey(item, key)"
          >
            <template v-if="Array.isArray(item)">
              <star-horse-table-column
                v-for="(sitem, skey) in item"
                :key="compKey(sitem, skey)"
                :apiEndpoints="field.preps?.['apiEndpoints']"
                :cellEditable="false"
                :data-format="field.preps?.['dataFormat']"
                :item="sitem"
              />
            </template>
            <star-horse-table-column
              v-else
              :apiEndpoints="field.preps?.['apiEndpoints']"
              :cellEditable="false"
              :data-format="field.preps?.['dataFormat']"
              :item="item"
            />
          </template>
        </el-table>
        <div class="page-select-panel__footer">
          <el-pagination
            :total="pageInfo.totalData"
            @current-change="pageChangeClick"
            @size-change="pageSizeClick"
            layout="total, sizes, prev, pager, next"
            v-model:currentPage="pageInfo.currentPage"
            v-model:page-size="pageInfo.pageSize"
            v-model:page-count="pageInfo.totalPage"
            :small="true"
          />
          <el-button

            type="primary"
            size="small"
            @click="submitSelection"
          >
            {{ i18n("item.confirm") }}
          </el-button>
        </div>
      </div>
    </el-popover>
    <template v-if="isSeparate">
      <el-input-tag
        v-bind="prepsFilter(field.preps)"
        :fid="field.fieldName"
        v-on="getDynamicEvents(props, itemAction, formData)"
        v-model="tagList"
        :disabled="checkIsDisabled(props)"
        :placeholder="field.preps?.placeholder || i18n('api.pleaseSelectData2')"
        @click="openPicker"
      >
        <template #suffix>
          <star-horse-icon
            cursor="pointer"
            icon-class="arrow-down"
            size="18px"
            :color="
              !disabled
                ? 'var(--star-horse-style)'
                : 'var(--el-disabled)'
            "
          />
        </template>
      </el-input-tag>
      <ShMobilePicker
        v-model="mobilePickerVisible"
        :title="pickerTitle"
        :placement="placement"
        :size="size"
        :show-footer="true"
        @confirm="submitMobilePicker"
        @cancel="closePicker"
      >
        <div class="mobile-select-panel">
          <div class="mobile-select-panel__search">
            <el-input
              v-model="mobileKeyword"
              :placeholder="i18n('ui.pleaseInputKeyword')"
              clearable
              @keyup.enter="onMobileSearch"
              @clear="onMobileSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          <el-scrollbar ref="mobileScrollbarRef" class="mobile-select-panel__list" @scroll="onMobileScroll">
            <div
              v-for="row in pageInfo.dataList"
              :key="getRowIdentity(row)"
              class="mobile-select-item"
              :class="{ 'is-selected': isRowSelected(row) }"
              @click="onMobileRowClick(row)"
            >
              <el-checkbox
                v-if="multiple"
                :model-value="isRowSelected(row)"
                @click.stop
                @change="toggleMobileRow(row)"
              />
              <div class="mobile-select-item__content">
                <div
                  v-for="col in listColumns"
                  :key="col.fieldName"
                  class="mobile-select-item__field"
                >
                  <span class="mobile-select-item__label">{{ col.label }}:</span>
                  <span class="mobile-select-item__value">{{ row[col.fieldName] }}</span>
                </div>
              </div>
            </div>
            <el-empty
              v-if="!pageInfo.dataList.length"
              :description="i18n('table.noData')"
            />
            <div v-if="mobileLoading" class="mobile-select-panel__loading">
              {{ i18n("item.dataLoading") }}
            </div>
          </el-scrollbar>
        </div>
      </ShMobilePicker>
    </template>
  </starhorse-form-item>
</template>
<style lang="scss" scoped>
:deep(.el-table__cell) {
  padding: 0;
}

:deep(th.el-table__cell:first-child) {
  padding: 5px 0;
}

.page-select-panel {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &__search {
    flex-shrink: 0;
  }

  &__footer {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 6px;
    border-top: 1px solid var(--el-border-color-lighter);

    :deep(.el-pagination) {
      flex: 1;
    }
  }
}

.mobile-select-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 6px;

  &__search {
    flex-shrink: 0;
  }

  &__list {
    flex: 1;
    min-height: 0;
  }

  &__footer {
    flex-shrink: 0;
    padding-top: 6px;
    border-top: 1px solid var(--el-border-color-lighter);

    :deep(.el-pagination) {
      justify-content: center;
    }
  }
}

.mobile-select-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 8px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  cursor: pointer;
  transition: background 0.15s;

  &:active {
    background: var(--el-fill-color-light);
  }

  &.is-selected {
    background: var(--el-primary-color-light-9);
  }

  &__content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__field {
    display: flex;
    gap: 4px;
    font-size: 13px;
    line-height: 1.4;
  }

  &__label {
    color: var(--el-text-color-secondary);
    flex-shrink: 0;
  }

  &__value {
    color: var(--el-text-color-primary);
    word-break: break-all;
  }
}
</style>
