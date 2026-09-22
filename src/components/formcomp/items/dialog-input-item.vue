<script setup lang="ts">
import {computed, nextTick, onMounted, ref, shallowRef, watch} from "vue";
import {warning} from "@/utils/message";
import {FieldInfo, FieldMapping} from "@/components/types/PageFieldInfo";
import {isJson, loadSelectedData, loadPageData, createCondition} from "@/api/star_horse_utils";
import {SearchParams} from "@/components/types/Params";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
  relationEventDispatcher,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {type ApiUrls, SearchFields} from "@/components/types";
import {getDynamicEvents} from "@/api/system";

import {ItemPreps} from "@/components/types/ItemPreps";
import {i18n} from "@/lang";
import {Search} from "@element-plus/icons-vue";
import {StarHorseIcon, StarHorsePanel} from "@/components/comp";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";
import {isMobile} from "@/api/device";
import {useMobilePicker} from "@/components/formcomp/utils/useMobilePicker";
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
const dialogInputTableRef = ref();
const tagList = ref<string[]>([]);
const selectedRows = ref<any[]>([]);
let dialogInputVisible = shallowRef(false);
// 是否多选模式
const multipleSelect = computed(() => !!props.field.preps?.multiple);
// 当前激活的 tab：data=数据选择，selected=已选数据
const activeTab = ref<"data" | "selected">("data");
// 已选数据搜索关键字
const selectedSearchKey = ref("");
// 已选数据（来自表格组件的 multipleSelection）
const selectedData = computed<any[]>(
    () => dialogInputTableRef.value?.multipleSelection ?? [],
);
// 已选列表展示的列（取 fieldList 中 listVisible 的字段）
const selectedColumns = computed(() => {
  const list = props.field.preps?.["fieldList"] || [];
  return list.filter(
      (f: FieldInfo) => f.listVisible !== false && !f.preps?.staticData,
  );
});
// 按关键字过滤后的已选数据（匹配所有展示列）
const filteredSelectedData = computed(() => {
  const key = selectedSearchKey.value.trim().toLowerCase();
  if (!key) return selectedData.value;
  const cols = selectedColumns.value;
  return selectedData.value.filter((row) =>
      cols.some((col: FieldInfo) => {
        const v = row[col.fieldName];
        return v != null && String(v).toLowerCase().includes(key);
      }),
  );
});
// 从已选列表移除指定行（同步取消表格选中）
const removeSelected = (row: any) => {
  dialogInputTableRef.value?.removeSelection(row);
};
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const selectItem = (row: any) => {
  // 选择只暂存 selectedRows + tagList，不写 formData，不关闭弹窗
  if (multipleSelect.value) {
    const selectDatas = dialogInputTableRef.value?.multipleSelection || [];
    if (displayField.value) {
      selectedRows.value = selectDatas;
      tagList.value = selectDatas.map((item: any) => item[displayField.value]);
      skipNextResolve = true;
    }
    return;
  }
  // 单选模式
  let data: any;
  if (!row || !isJson(row)) {
    let selectDatas = dialogInputTableRef.value?.multipleSelection;
    if (!selectDatas || selectDatas.length === 0) return;
    data = selectDatas[0];
  } else {
    data = row;
  }
  if (displayField.value) {
    selectedRows.value = [data];
    tagList.value = [data[displayField.value]];
    skipNextResolve = true;
  }
};
const closeAction = () => {
  dialogInputVisible.value = false;
};
const showVisible = () => {
  dialogInputVisible.value = true;
  activeTab.value = "data";
  selectedSearchKey.value = "";
  nextTick(() => {
    let fields = props.field.preps?.needField;
    let name = props.field.fieldName;
    let realName = name;
    if (props.field.aliasName) {
      realName = props.field?.aliasName;
    }
    if (fields) {
      name = fields.map((item: FieldMapping) => item.sourceField)[0];
    }
    dialogInputTableRef.value?.setDataInfo(name, formData.value[realName]);
  });
};
const submitData = (type: string) => {
  let needField = props.field.preps?.needField;
  let name = props.field.fieldName;
  if (multipleSelect.value) {
    const selectDatas = dialogInputTableRef.value?.multipleSelection || [];
    if (selectDatas.length === 0) {
      warning(i18n("item.pleaseSetValue"));
      return;
    }
    if (!needField) {
      formData.value[name] = selectDatas.map((item: any) => item[name]);
    } else {
      needField.forEach((item: FieldMapping) => {
        const value = selectDatas.map((r: any) => r[item.sourceField]);
        if (needField.length == 1) {
          formData.value[name] = value;
        } else {
          formData.value[item.distField] = value;
        }
      });
    }
    if (displayField.value) {
      selectedRows.value = selectDatas;
      tagList.value = selectDatas.map((item: any) => item[displayField.value]);
      skipNextResolve = true;
    }
    if (props.field.preps?.recall) {
      props.field.preps?.["recall"](selectDatas);
    }
  } else {
    let selectDatas = dialogInputTableRef.value?.multipleSelection;
    if (!selectDatas || selectDatas.length === 0) {
      warning(i18n("item.pleaseSetValue"));
      return;
    }
    let data = selectDatas[0];
    if (!needField) {
      formData.value[name] = data[name];
    } else {
      needField.forEach((item: FieldMapping) => {
        if (needField.length == 1) {
          formData.value[name] = data[item.sourceField];
        } else {
          formData.value[item.distField] = data[item.sourceField];
        }
      });
    }
    if (displayField.value) {
      selectedRows.value = [data];
      tagList.value = [data[displayField.value]];
      skipNextResolve = true;
    }
    if (props.field.preps?.recall) {
      props.field.preps?.["recall"](data);
    }
  }
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
  closeAction();
};
onMounted(async () => {
  await nextTick();
  let inputPreps = props.field?.preps;
  if (!inputPreps) {
    warning(
        i18n("item.propertyNeedsParams") +
        props.field?.label +
        i18n("item.propertyNeedsParamsSuffix"),
    );
    return;
  }
  if (!inputPreps.searchFieldList || inputPreps.searchFieldList?.length == 0) {
    let searchFieldList: Array<SearchFields> = [];
    inputPreps.fieldList?.forEach((item: FieldInfo) => {
      if (item.searchVisible) {
        let temp: any = {...item};
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
    inputPreps.searchFieldList = {fieldList: searchFieldList};
  }
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
const displayField = computed(() => (props.field.preps?.["displayField"] as string) || "");
let skipNextResolve = false;
watch(() => formData.value[props.field.fieldName], async (val) => {
  if (skipNextResolve) {
    skipNextResolve = false;
    return;
  }
  if (displayField.value && val != null) {
    const apiEndpoints = props.field.preps?.["apiEndpoints"] as ApiUrls;
    if (apiEndpoints) {
      const needField = props.field.preps?.needField;
      const sourceField = needField?.[0]?.sourceField || props.field.fieldName;
      const nodes = await loadSelectedData(
          apiEndpoints.pageListUrl,
          val,
          sourceField,
          undefined,
          props.field.preps?.["proxy"],
          props.field.preps?.["proxyUrl"],
      );
      const names = nodes
          .map((n: any) => n[displayField.value])
          .filter((n: any) => n != null);
      if (names.length > 0) {
        tagList.value = props.field.preps?.multiple ? names : [names[0]];
        return;
      }
    }
  }
  if (props.field.preps?.multiple) {
    tagList.value = val || [];
  } else {
    tagList.value = val ? [val] : [];
  }
}, {immediate: true});
watch(tagList, (val) => {
  if (!displayField.value) return;
  if (!val || val.length === 0) {
    selectedRows.value = [];
    if (formData.value) {
      skipNextResolve = true;
      formData.value[props.field.fieldName] = props.field.preps?.multiple ? [] : "";
    }
    return;
  }
  if (selectedRows.value.length === 0) return;
  const remaining = selectedRows.value.filter(
    (r: any) => val.includes(r[displayField.value]),
  );
  if (remaining.length !== selectedRows.value.length) {
    selectedRows.value = remaining;
    const needField = props.field.preps?.needField;
    const codeField = needField?.[0]?.sourceField || props.field.fieldName;
    const codes = remaining.map((r: any) => r[codeField]);
    if (formData.value) {
      skipNextResolve = true;
      formData.value[props.field.fieldName] = props.field.preps?.multiple ? codes : (codes[0] ?? "");
    }
  }
});

const {
  isSeparate,
  pickerVisible: mobilePickerVisible,
  placement,
  size,
  title: pickerTitle,
  openPicker,
  closePicker,
} = useMobilePicker(() => props.field);

const mobilePageInfo = ref({
  dataList: [] as any[],
  currentPage: 1,
  pageSize: 20,
  totalData: 0,
  totalPage: 0,
});
const mobileSearchData = shallowRef<SearchParams[]>([]);
const mobileSelection = ref<any[]>([]);
const mobileLoading = ref(false);
const mobileScrollbarRef = ref();
const loadMobilePage = async (isAppend: boolean = false) => {
  const apiEndpoints = props.field.preps?.["apiEndpoints"] as ApiUrls;
  if (!apiEndpoints?.pageListUrl) return;
  const {list, totalData, totalPage} = await loadPageData({
    apiEndpoints: apiEndpoints.pageListUrl,
    conditions: mobileSearchData.value,
    currentPage: mobilePageInfo.value.currentPage,
    pageSize: mobilePageInfo.value.pageSize,
    proxy: props.field.preps?.["proxy"],
    proxyUrl: props.field.preps?.["proxyUrl"],
  });
  if (isAppend) {
    mobilePageInfo.value.dataList = [...mobilePageInfo.value.dataList, ...list];
  } else {
    mobilePageInfo.value.dataList = list;
  }
  mobilePageInfo.value.totalData = totalData;
  mobilePageInfo.value.totalPage = totalPage;
};
const mobileSearchFun = (data: any) => {
  mobileSearchData.value = data;
  mobilePageInfo.value.currentPage = 1;
  mobileScrollbarRef.value?.setScrollTop(0);
  loadMobilePage();
};
const mobileKeyword = ref("");
const onMobileSearch = () => {
  const keyword = mobileKeyword.value.trim();
  if (!keyword) {
    mobileSearchData.value = [];
  } else {
    const fields = listColumns.value.map((col: FieldInfo) => col.fieldName);
    if (fields.length === 0) {
      mobileSearchData.value = [];
    } else {
      const condition = createCondition(fields[0], keyword, "lk");
      if (fields.length > 1) {
        condition.orOperList = fields
          .slice(1)
          .map((f) => createCondition(f, keyword, "lk"));
      }
      mobileSearchData.value = [condition];
    }
  }
  mobilePageInfo.value.currentPage = 1;
  mobileScrollbarRef.value?.setScrollTop(0);
  loadMobilePage();
};
const onMobileScroll = ({ scrollTop, scrollHeight, clientHeight }: any) => {
  if (scrollTop + clientHeight < scrollHeight - 20) return;
  if (mobileLoading.value) return;
  if (mobilePageInfo.value.currentPage >= mobilePageInfo.value.totalPage) return;
  mobilePageInfo.value.currentPage++;
  mobileLoading.value = true;
  loadMobilePage(true).finally(() => {
    mobileLoading.value = false;
  });
};
const listColumns = computed(() => {
  const list = props.field.preps?.["fieldList"] || [];
  return list.filter(
    (f: FieldInfo) => f.listVisible !== false && !f.preps?.staticData,
  );
});
const isRowSelected = (row: any) => {
  const pk = props.field.preps?.primaryKey || props.field.fieldName;
  return mobileSelection.value.some((item: any) => item[pk] === row[pk]);
};
const applyMobileSelection = () => {
  const needField = props.field.preps?.needField;
  const name = props.field.fieldName;
  const selectDatas = mobileSelection.value;
  if (multipleSelect.value) {
    if (!needField) {
      formData.value[name] = selectDatas.map((item: any) => item[name]);
    } else {
      needField.forEach((item: FieldMapping) => {
        const value = selectDatas.map((r: any) => r[item.sourceField]);
        if (needField.length == 1) {
          formData.value[name] = value;
        } else {
          formData.value[item.distField] = value;
        }
      });
    }
    if (displayField.value) {
      selectedRows.value = selectDatas;
      tagList.value = selectDatas.map((item: any) => item[displayField.value]);
      skipNextResolve = true;
    }
  } else {
    if (selectDatas.length === 0) return;
    const data = selectDatas[0];
    if (!needField) {
      formData.value[name] = data[name];
    } else {
      needField.forEach((item: FieldMapping) => {
        if (needField.length == 1) {
          formData.value[name] = data[item.sourceField];
        } else {
          formData.value[item.distField] = data[item.sourceField];
        }
      });
    }
    if (displayField.value) {
      selectedRows.value = [data];
      tagList.value = [data[displayField.value]];
      skipNextResolve = true;
    }
  }
  if (props.field.preps?.recall) {
    props.field.preps?.["recall"](selectDatas);
  }
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
};
const onMobileRowClick = (row: any) => {
  if (multipleSelect.value) {
    const pk = props.field.preps?.primaryKey || props.field.fieldName;
    if (mobileSelection.value.some((r: any) => r[pk] === row[pk])) {
      mobileSelection.value = mobileSelection.value.filter((r: any) => r[pk] !== row[pk]);
    } else {
      mobileSelection.value = [...mobileSelection.value, row];
    }
  } else {
    mobileSelection.value = [row];
  }
};
const submitMobilePicker = () => {
  applyMobileSelection();
  closePicker();
};
watch(mobilePickerVisible, async (val) => {
  if (val) {
    await nextTick();
    mobilePageInfo.value.currentPage = 1;
    mobileSelection.value = [...selectedRows.value];
    await loadMobilePage();
  }
});
</script>
<template>
  <star-horse-panel
      v-if="!isSeparate"
      :type="dialogType"
      :title="field.label + i18n('item.dataSelect')"
      :userAction="true"
      boxHeight="80%"
      v-model="dialogInputVisible"
      @merge="submitData"
      @closeAction="closeAction"
  >
    <div class="flex flex-col h-full overflow-hidden">
      <el-card class="inner_content">
        <el-tabs v-model="activeTab" class="dialog-input-tabs">
          <el-tab-pane :label="i18n('item.dataSelect')" name="data">
            <div class="flex flex-col h-full overflow-hidden">
              <div class="search-content">
                <div class="search_btn">
                  <star-horse-search-comp
                      @searchData="
                    (data: any) => dialogInputTableRef.createSearchParams(data)
                  "
                      :formData="field.preps?.['searchFieldList']"
                      :apiEndpoints="field.preps?.['apiEndpoints']"
                  />
                </div>
              </div>
              <div class="tab-content">
                <star-horse-table-comp
                    :fieldList="{
                  cellEditable: false,
                  fieldList: field.preps?.['fieldList'],
                }"
                    :primaryKey="field.preps?.['primaryKey']"
                    :apiEndpoints="field.preps?.['apiEndpoints']"
                    ref="dialogInputTableRef"
                    :dialogInput="true"
                    :multipleSelect="multipleSelect"
                    :filterCondition="field.preps?.['filterCondition']"
                    :orderBy="field.preps?.['orderBy']"
                    @selectItem="selectItem"
                    :dataFormat="field.preps?.['dataFormat']"
                    :disableAction="true"
                />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane
              v-if="multipleSelect"
              :label="`${i18n('item.selectedData')}(${selectedData.length})`"
              name="selected"
          >
            <div class="tab-content selected-pane">
              <el-input
                  v-model="selectedSearchKey"
                  :placeholder="i18n('item.searchSelected')"
                  clearable
                  class="selected-search"
              >
                <template #prefix>
                  <el-icon>
                    <Search/>
                  </el-icon>
                </template>
              </el-input>
              <el-table
                  :data="filteredSelectedData"
                  :height="isMobile ? '50vh' : '400px'"
                  border
                  class="selected-table"
              >
                <el-table-column
                    v-for="col in selectedColumns"
                    :key="col.fieldName"
                    :prop="col.fieldName"
                    :label="col.label"
                    :min-width="(col.minWidth || 120) + 'px'"
                    show-overflow-tooltip
                />
                <el-table-column
                    :label="i18n('table.operation')"
                    width="100"
                    fixed="right"
                >
                  <template #default="{ row }">
                    <el-button type="danger" link @click="removeSelected(row)">
                      <el-tooltip
                          :content="i18n('item.removeSelected')"
                          :trigger="isMobile ? 'click' : 'hover'"
                      >
                        <star-horse-icon
                            icon-class="delete"
                            color="var(--el-primary-danger)"
                        />
                      </el-tooltip>
                    </el-button>
                  </template>
                </el-table-column>
                <template #empty>
                  <span>{{ i18n("item.noSelectedData") }}</span>
                </template>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </star-horse-panel>
  <ShMobilePicker
      v-if="isSeparate"
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
            v-for="row in mobilePageInfo.dataList"
            :key="row[field.preps?.primaryKey || field.fieldName]"
            class="mobile-select-item"
            :class="{ 'is-selected': isRowSelected(row) }"
            @click="onMobileRowClick(row)"
        >
          <el-checkbox
              v-if="multipleSelect"
              :model-value="isRowSelected(row)"
              @click.stop
              @change="onMobileRowClick(row)"
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
            v-if="!mobilePageInfo.dataList.length"
            :description="i18n('table.noData')"
        />
        <div v-if="mobileLoading" class="mobile-select-panel__loading">
          {{ i18n("item.dataLoading") }}
        </div>
      </el-scrollbar>
    </div>
  </ShMobilePicker>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <el-input-tag
        :disabled="checkIsDisabled(props)"
        type="text"
        v-bind="prepsFilter(field.preps)"
        :fid="field.fieldName"
        v-on="getDynamicEvents(props, itemAction, formData)"
        v-model="tagList"
    >
      <template #suffix>
        <div
            class="data-selector-suffix"
            :class="{ 'is-disabled': disabled }"
            @click="isSeparate ? openPicker() : showVisible()"
        >
          <star-horse-icon
              cursor="pointer"
              icon-class="add"
              size="18px"
              :color="
              !disabled
                ? 'var(--star-horse-style)'
                : 'var(--star-horse-disabled)'
            "
          />
        </div>
      </template>
    </el-input-tag>
  </starhorse-form-item>
</template>
<style lang="scss" scoped>
.cell.el-tooltip {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-input-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 8px;
  }
}

.tab-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  width: 100%;
}

.selected-pane {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-search {
  flex-shrink: 0;
}

.selected-table {
  flex: 1;
  min-height: 0;
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
