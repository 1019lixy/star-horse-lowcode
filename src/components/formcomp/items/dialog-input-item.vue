<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef } from "vue";
import { warning } from "@/utils/message";
import { FieldInfo, FieldMapping } from "@/components/types/PageFieldInfo";
import { isJson, buildListDataSource } from "@/api/star_horse_utils";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { SearchFields } from "@/components/types";
import { getDynamicEvents } from "@/api/system";

import { ItemPreps } from "@/components/types/ItemPreps";
import { i18n } from "@/lang";
import { Search } from "@element-plus/icons-vue";
import { StarHorseIcon, StarHorsePanel } from "@/components/comp";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";
import { isMobile } from "@/api/device";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const dialogInputTableRef = ref();
// 由统一接口配置(apiDataSource)构造被委派表格/搜索组件需要的 apiEndpoints(不改动被委派组件)
const apiEndpoints = computed(() =>
  buildListDataSource(props.field.preps?.apiDataSource),
);
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
  let needField = props.field.preps?.needField;
  // 多选模式：回填所有已选数据
  if (multipleSelect.value) {
    const selectDatas = dialogInputTableRef.value?.multipleSelection || [];
    if (selectDatas.length === 0) {
      warning(i18n("item.pleaseSetValue"));
      return;
    }
    const name = props.field.fieldName;
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
    if (props.field.preps?.recall) {
      props.field.preps?.["recall"](selectDatas);
    }
    // closeAction();
    return;
  }
  // 单选模式
  let data = "";
  if (!row || !isJson(row)) {
    let selectDatas = dialogInputTableRef.value.multipleSelection;
    if (!selectDatas) {
      warning(i18n("item.pleaseSetValue"));
      return;
    }
    data = selectDatas[0];
  } else {
    data = row;
  }
  //如果没有指定属性，则默认取相同的属性
  let name = props.field.fieldName;
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
  if (props.field.preps?.recall) {
    props.field.preps?.["recall"](row);
  }
  closeAction();
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
  selectItem(null);
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
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<template>
  <star-horse-panel
    :type="dialogType"
    :title="field.label + i18n('item.dataSelect')"
    :self-func="true"
    boxHeight="80%"
    v-model="dialogInputVisible"
    @merge="submitData"
    @closeAction="closeAction"
  >
    <div class="flex flex-col h-full overflow-hidden">
      <el-card class="inner_content">
        <el-tabs v-model="activeTab" class="dialog-input-tabs">
          <el-tab-pane :label="i18n('item.dataSelect')" name="data">
            <div class="search-content">
                <div class="search_btn">
                  <star-horse-search-comp
                    @searchData="
                      (data: any) => dialogInputTableRef.createSearchParams(data)
                    "
                    :formData="field.preps?.['searchFieldList']"
                    :apiEndpoints="apiEndpoints"
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
                :apiEndpoints="apiEndpoints"
                ref="dialogInputTableRef"
                :dialogInput="true"
                :multipleSelect="multipleSelect"
                :height="isMobile ? '50vh' : '400px'"
                :filterCondition="field.preps?.['filterCondition']"
                :orderBy="field.preps?.['orderBy']"
                @selectItem="selectItem"
                :dataFormat="field.preps?.['dataFormat']"
                :disableAction="true"
              />
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
                    <Search />
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
      v-model="formData[field.fieldName]"
    >
      <template #suffix>
        <div
          class="data-selector-suffix"
          :class="{ 'is-disabled': disabled }"
          @click="showVisible"
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
  width: 100%;
  height: 100%;
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
</style>
