<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { nextTick, onUnmounted, reactive, ref, watch } from "vue";
import { i18n } from "@/lang";
import { postRequest } from "@/api/star_horse_apis";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import { closeLoad, createCondition } from "@/api/star_horse_utils";
import { PageProps } from "@/components/types/PageProps";
import { SearchParams } from "@/components/types";
import { isMobile } from "@/api/device";
import {
  buildPageParams,
  buildRequestParams,
  toggleNodeSelection,
} from "@/components/comp/utils/DataSelectorUtils";
import { StarHorseIcon } from "@/components/comp";
import {
  Bottom,
  Check,
  Delete,
  Download,
  QuestionFilled,
  Sort,
  Top,
  Upload,
} from "@element-plus/icons-vue";
import Sortable from "sortablejs";

export type ModelValueType = any;

export interface DataDropdownProps {
  modelValue: ModelValueType;
  dataUrl?: string;
  proxy?: boolean;
  proxyUrl?: string;
  params?: SearchParams[];
  pageSize?: number;
  data?: Array<any>;
  title?: string;
  compSize?: string;
  displayName?: string;
  displayValue?: string;
  multiple?: boolean;
  checkStrictly?: boolean;
  selectLeaf?: boolean;
  autoClose?: boolean;
}

const props = withDefaults(defineProps<DataDropdownProps>(), {
  displayName: "name",
  displayValue: "value",
  compSize: "default",
  pageSize: 0,
  multiple: false,
  autoClose: true,
  checkStrictly: true,
  selectLeaf: false,
});

const emits = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValueType): void;
  (e: "dataSubmit", data: Array<any>): void;
}>();
const treeProps = {
  label: props.displayName,
  children: "children",
  value: props.displayValue,
  isLeaf: "leaf",
  class: (data: any, node: any) => renderClass(data, node),
};
const value: any = useVModel(props, "modelValue", emits);
const dataOptions = ref<Array<any>>([]);
const dataOrgOptions = ref<Array<any>>([]);
const orgTreeRef = ref<InstanceType<any>>();
const expandedKeys = ref<string[]>([]);
const checkAll = ref<boolean>(false);
const indeterminate = ref<boolean>(false);

// ===== 已选数据排序相关 =====
const activeIndex = ref<number>(-1);
const selectedListRef = ref<HTMLElement>();
let sortableInstance: Sortable | null = null;

const initSortable = () => {
  if (!selectedListRef.value || !props.multiple) return;
  sortableInstance = Sortable.create(selectedListRef.value, {
    animation: 200,
    handle: ".drag-handle",
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    onEnd: (evt) => {
      const { oldIndex, newIndex } = evt;
      if (
        oldIndex === undefined ||
        newIndex === undefined ||
        oldIndex === newIndex
      )
        return;
      const list = [...dataOptions.value];
      const [item] = list.splice(oldIndex, 1);
      list.splice(newIndex, 0, item);
      dataOptions.value = list;
      activeIndex.value = newIndex;
    },
  });
};

const destroySortable = () => {
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }
};

watch(
  () => props.multiple,
  (val) => {
    destroySortable();
    if (val) nextTick(initSortable);
  },
);

const handleCheckAll = () => {
  if (!checkAll.value) {
    dataOptions.value = [];
  } else {
    const processAllNodes = (nodes: any[]) => {
      nodes.forEach((node) => {
        onNodeClick(node);
        if (node.children) {
          processAllNodes(node.children);
        }
      });
    };
    processAllNodes(dataOrgOptions.value);
  }
};
const renderClass = (data: any, node: any): string => {
  let value = props.displayValue || "value";
  const isSelected = dataOptions.value?.find((e) => e[value] === data[value]);
  return isSelected ? "is-active" : "";
};

const onNodeClick = (treeNode: any) => {
  dataOptions.value = toggleNodeSelection(treeNode, dataOptions.value, {
    multiple: props.multiple,
    checkStrictly: props.checkStrictly,
    selectLeaf: props.selectLeaf,
    displayValue: props.displayValue || "value",
  });
};

// ===== 排序方法 =====
const removeItem = (index: number) => {
  const list = [...dataOptions.value];
  list.splice(index, 1);
  dataOptions.value = list;
  if (activeIndex.value === index) activeIndex.value = -1;
  else if (activeIndex.value > index) activeIndex.value--;
};

const moveTop = (index: number) => {
  if (index <= 0) return;
  // 拷贝数组
  const list = [...dataOptions.value];
  // 先删除当前索引元素
  const targetItem = list.splice(index, 1)[0];
  // 追加到数组第一个
  list.splice(0, 0, targetItem);
  dataOptions.value = list;
  activeIndex.value = 0;
  scrollToActive();
};
const moveUp = (index: number) => {
  if (index <= 0) return;
  const list = [...dataOptions.value];
  [list[index - 1], list[index]] = [list[index], list[index - 1]];
  dataOptions.value = list;
  activeIndex.value = index - 1;
  scrollToActive();
};

const moveDown = (index: number) => {
  if (index >= dataOptions.value.length - 1) return;
  const list = [...dataOptions.value];
  [list[index], list[index + 1]] = [list[index + 1], list[index]];
  dataOptions.value = list;
  activeIndex.value = index + 1;
  scrollToActive();
};
const moveEnd = (index: number) => {
  const total = dataOptions.value.length - 1;
  // 已经是最后一项，直接返回
  if (index >= total) return;
  // 拷贝数组
  const list = [...dataOptions.value];
  // 先删除当前索引元素
  const targetItem = list.splice(index, 1)[0];
  // 追加到数组末尾
  list.push(targetItem);
  dataOptions.value = list;
  activeIndex.value = total;
  scrollToActive();
};

const scrollToActive = () => {
  nextTick(() => {
    const el = selectedListRef.value?.querySelector(
      `.selected-item[data-index="${activeIndex.value}"]`,
    ) as HTMLElement;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
};

const onSelectedItemClick = (index: number) => {
  if (!props.multiple) {
    dataOptions.value = toggleNodeSelection(
      dataOptions.value[index],
      dataOptions.value,
      {
        multiple: false,
        checkStrictly: true,
        selectLeaf: false,
        displayValue: props.displayValue || "value",
      },
    );
    activeIndex.value = -1;
    return;
  }
  activeIndex.value = activeIndex.value === index ? -1 : index;
};

// ===== 键盘操作 =====
const onSelectedKeydown = (e: KeyboardEvent) => {
  if (activeIndex.value < 0 || !props.multiple) return;
  if (e.key === "ArrowUp") {
    e.preventDefault();
    moveUp(activeIndex.value);
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    moveDown(activeIndex.value);
  }
};

const dialogVisible = ref(false);
const queryName = ref(null);

const dataSearch = () => {
  if (props.dataUrl) {
    loadData(
      queryName.value
        ? [createCondition(props.displayName, queryName.value, "lk")]
        : [],
    );
  } else {
    if (!queryName.value) return;
    orgTreeRef.value?.filter(queryName.value);
  }
};
const filterNode = (value: string, data: any): boolean => {
  if (!value) return true;
  return data[props.displayName].includes(value);
};
let pageInfo = reactive<PageProps>({
  pageSize: 20,
  currentPage: 1,
  totalData: 0,
  totalPage: 0,
  dataList: [],
});
const loadData = async (condition?: SearchParams[]) => {
  if (!props.dataUrl) return;
  const queryParams: SearchParams[] = [];
  if (condition?.length > 0) {
    queryParams.push(...condition);
  }
  const baseParams = buildPageParams(
    queryParams,
    props.params,
    pageInfo.currentPage,
    props.pageSize || 0,
  );
  const { url, params } = buildRequestParams(
    props.dataUrl,
    baseParams,
    props.proxy,
    props.proxyUrl,
  );
  await postRequest(url, params)
    .then((res) => {
      if (res?.data?.code) {
        console.error(res?.data?.cnMessage);
        return;
      }
      let redata = res?.data?.data;
      dataOrgOptions.value = redata?.dataList || redata;
      pageInfo.totalPage = redata?.totalPages;
      pageInfo.totalData = redata?.totalDatas;
    })
    .catch((err: any) => {
      console.log(err);
    })
    .finally(() => {
      closeLoad();
    });
};
const open = () => {
  dialogVisible.value = true;
};
const close = () => {
  dialogVisible.value = false;
};
const onOpen = async () => {
  dataOrgOptions.value = [];
  if (props.data?.length > 0) {
    dataOrgOptions.value = props.data;
  } else {
    await loadData();
  }
  dataOptions.value = Array.isArray(value.value)
    ? value.value
    : value.value
      ? [value.value]
      : [];
  activeIndex.value = -1;
  nextTick(() => {
    destroySortable();
    if (props.multiple) initSortable();
  });
};
const handelConfirm = () => {
  if (props.multiple) {
    value.value = dataOptions.value;
  } else {
    if (dataOptions.value?.length > 0) {
      value.value = [dataOptions.value[0]];
    } else {
      value.value = [];
    }
  }
  if (props.autoClose) {
    dialogVisible.value = false;
  }
  emits("dataSubmit", value.value);
};
const resetData = () => {
  dataOptions.value = [];
  activeIndex.value = -1;
};
const pageChangeClick = (val: number) => {
  pageInfo.currentPage = val;
  dataSearch();
};
const pageSizeClick = (val: number) => {
  pageInfo.pageSize = val;
  pageInfo.currentPage = 1;
  dataSearch();
};

onUnmounted(() => {
  destroySortable();
});

defineExpose({
  open,
  close,
});
</script>

<template>
  <star-horse-dialog
    :self-func="true"
    :dialog-visible="dialogVisible"
    @open="onOpen"
    @merge="handelConfirm"
    @resetForm="resetData"
    :full-screen="isMobile"
    @closeAction="dialogVisible = false"
    draggable
    :title="title || i18n('datapicker.selectData')"
    boxWidth="60%"
    boxHeight="70%"
  >
    <el-splitter>
      <el-splitter-panel collapsible min="50%">
        <el-card shadow="never" class="org-card dialog-body">
          <template #header>
            <div class="flex flex-row items-center w-full justify-between">
              <el-checkbox
                v-model="checkAll"
                class="!w-[30%]"
                v-if="multiple"
                :indeterminate="indeterminate"
                @change="handleCheckAll"
              >
                {{ i18n("datapicker.selectAll") }}
              </el-checkbox>
              <div class="flex flex-row flex-1 items-center justify-center">
                {{ i18n("datapicker.pendingDataArea") }}
              </div>
            </div>
          </template>
          <div class="my-[5px] w-[95%] mx-auto">
            <el-input
              v-model="queryName"
              :placeholder="i18n('datapicker.enterKeywords')"
              :style="{ width: '100%' }"
              clearable
              @keyup.enter="dataSearch"
            >
              <template #append>
                <div class="cursor-pointer" @click="dataSearch">
                  <star-horse-icon iconClass="search" />
                </div>
              </template>
            </el-input>
          </div>
          <el-scrollbar tag="div" class="org-tree">
            <el-tree
              ref="orgTreeRef"
              :node-key="displayValue"
              :data="dataOrgOptions"
              :default-expanded-keys="expandedKeys"
              :props="treeProps"
              :check-strictly="checkStrictly"
              :filter-node-method="filterNode"
              @node-click="onNodeClick"
            >
              <template #default="{ data }">
                <div class="data-line">
                  <div class="menu-title">
                    <div class="flex flex-row items-center">
                      <star-horse-icon
                        :icon-class="
                          data.children?.length > 0 ? 'folder' : 'document'
                        "
                      />
                      &nbsp;{{ data[displayName] }}
                    </div>
                  </div>
                  <el-icon class="is-selected">
                    <Check />
                  </el-icon>
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
          <el-pagination
            v-if="pageSize > 0"
            :total="pageInfo.totalData"
            @current-change="pageChangeClick"
            @size-change="pageSizeClick"
            :size="compSize"
            layout="total, sizes, prev, pager, next, jumper"
            v-model:currentPage="pageInfo.currentPage"
            v-model:page-size="pageInfo.pageSize"
            v-model:pageCount="pageInfo.totalPage"
          />
        </el-card>
      </el-splitter-panel>
      <el-splitter-panel size="40%" min="20%" collapsible>
        <el-card shadow="never" class="org-card dialog-body">
          <template #header>
            <div
              class="flex flex-row items-center justify-between w-full h-[32px]"
            >
              <div class="flex-1 text-center">
                {{ i18n("datapicker.selectedDataArea") }}[{{
                  dataOptions?.length
                }}]
              </div>
              <el-tooltip
                :content="i18n('datapicker.helpContent')"
                placement="left"
                effect="dark"
              >
                <el-icon class="help-icon" :size="16">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-scrollbar tag="div" class="org-tree">
            <div
              ref="selectedListRef"
              class="selected-list"
              tabindex="0"
              @keydown="onSelectedKeydown"
            >
              <div
                v-for="(item, index) in dataOptions"
                :key="item[displayValue]"
                class="selected-item"
                :class="{ 'is-active-item': activeIndex === index }"
                :data-index="index"
                :data-id="item[displayValue]"
                @click="onSelectedItemClick(index)"
              >
                <div class="selected-item-content">
                  <el-icon
                    title="拖拽排序"
                    v-if="multiple"
                    class="drag-handle"
                    :size="20"
                  >
                    <Sort />
                  </el-icon>
                  <star-horse-icon
                    :icon-class="
                      item.children?.length > 0 ? 'folder' : 'document'
                    "
                    size="18px"
                  />
                  <span class="selected-item-label">{{
                    item[displayName]
                  }}</span>
                </div>
                <div class="selected-item-actions">
                  <el-icon
                    :title="i18n('datapicker.moveToFirst')"
                    v-if="multiple"
                    :size="22"
                    :class="{ 'is-disabled-action': index === 0 }"
                    @click.stop="moveTop(index)"
                  >
                    <Upload />
                  </el-icon>
                  <el-icon
                    :title="i18n('datapicker.moveUp')"
                    v-if="multiple"
                    :size="22"
                    :class="{ 'is-disabled-action': index === 0 }"
                    @click.stop="moveUp(index)"
                  >
                    <Top />
                  </el-icon>
                  <el-icon
                    :title="i18n('datapicker.moveToEnd')"
                    v-if="multiple"
                    :size="22"
                    :class="{
                      'is-disabled-action': index === dataOptions.length - 1,
                    }"
                    @click.stop="moveEnd(index)"
                  >
                    <Download />
                  </el-icon>
                  <el-icon
                    :title="i18n('datapicker.moveDown')"
                    v-if="multiple"
                    :size="22"
                    :class="{
                      'is-disabled-action': index === dataOptions.length - 1,
                    }"
                    @click.stop="moveDown(index)"
                  >
                    <Bottom />
                  </el-icon>
                  <el-icon
                    :title="i18n('common.delete')"
                    :size="22"
                    class="remove-action"
                    @click.stop="removeItem(index)"
                  >
                    <Delete style="color: var(--el-color-danger)" />
                  </el-icon>
                </div>
              </div>
              <div v-if="dataOptions.length === 0" class="empty-tip">
                {{ i18n("datapicker.enterKeywords") }}
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-splitter-panel>
    </el-splitter>
  </star-horse-dialog>
</template>

<style scoped lang="scss">
:deep {
  .el-tree {
    --el-tree-node-content-height: 40px;

    .el-tree-node__content {
      border-radius: 8px;
      margin: 2px 0 2px 0;
    }

    .is-active {
      color: var(--el-color-primary);

      .is-selected {
        display: block;
      }
    }
  }
}

.el-card {
  background-color: transparent;

  :deep(.el-card__header) {
    padding: 10px !important;
  }

  :deep(.el-card__body) {
    padding: 0 !important;
  }
}

.org-tree {
  height: 100%;
  padding: 5px;
}

.data-line {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
}

.is-selected {
  display: none;
  padding-right: 15px;
}

// ===== 已选数据列表 =====
.selected-list {
  outline: none;
  min-height: 100%;
}

.selected-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  margin: 2px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  border: 1px solid transparent;
  user-select: none;

  &:hover {
    background: var(--el-fill-color-light);
  }

  &.is-active-item {
    background: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary-light-5);
  }
}

.selected-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.drag-handle {
  cursor: grab;
  color: var(--el-text-color-placeholder);
  flex-shrink: 0;
  transition: color 0.2s;

  &:hover {
    color: var(--el-color-primary);
  }

  &:active {
    cursor: grabbing;
  }
}

.selected-item-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.selected-item-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  margin-left: 4px;
  color: var(--el-text-color-regular);
  opacity: 0;
  transition: opacity 0.2s;

  .el-icon {
    cursor: pointer;
    border-radius: 4px;
    padding: 3px;

    &:hover {
      background: var(--el-fill-color);
      color: var(--el-color-primary);
    }
  }

  .is-disabled-action {
    opacity: 0.3;
    cursor: not-allowed;

    &:hover {
      background: transparent;
      color: inherit;
    }
  }

  .remove-action {
    &:hover {
      color: var(--el-color-danger);
    }
  }
}

.selected-item:hover .selected-item-actions,
.selected-item.is-active-item .selected-item-actions {
  opacity: 1;
}

// Sortable 样式
:deep(.sortable-ghost) {
  opacity: 0.4;
  background: var(--el-color-primary-light-9);
  border: 1px dashed var(--el-color-primary);
}

:deep(.sortable-chosen) {
  background: var(--el-color-primary-light-8);
}

:deep(.sortable-drag) {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.help-icon {
  cursor: pointer;
  color: var(--el-text-color-placeholder);
  flex-shrink: 0;

  &:hover {
    color: var(--el-color-primary);
  }
}

.empty-tip {
  text-align: center;
  padding: 40px 0;
  color: var(--el-text-color-placeholder);
  font-size: 13px;
}
</style>
