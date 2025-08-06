<script setup lang="ts">
import {useVModel} from "@vueuse/core";
import {reactive, ref, watch} from "vue";
import {postRequest} from "@/api/star_horse_apis";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import {closeLoad} from "@/api/star_horse_utils";
import {PageProps} from "@/components/types/PageProps";

export type ModelValueType = any;

export interface DataDropdownProps {
  /**
   * 模型值
   */
  modelValue: ModelValueType;
  /**
   * 接口地址
   */
  dataUrl?: string;
  /**
   * 页码
   */
  pageSize?: number;
  /**
   * 数据
   */
  datas?: Array<any>;
  /**
   * 标题
   */
  title?: string;
  /**
   * 组件大小
   */
  compSize?: string;
  /**
   * 显示名称
   */
  displayName?: string;
  /**
   * 显示值
   */
  displayValue?: string;
  /**
   * 是否多选
   */
  multiple?: boolean;
  /**
   * 是否严格选择
   */
  checkStrictly?: boolean;
  /**
   * 是否只选叶子节点
   */
  selectLeaf?: boolean;
}

const props = withDefaults(defineProps<DataDropdownProps>(), {
  displayName: "name",
  displayValue: "value",
  compSize: "small",
  pageSize: 0,
  multiple: false,
  checkStrictly: true,
  selectLeaf: false,
});

const emits = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValueType): void;
}>();
const treeProps = {
  label: props.displayName,
  children: "children",
  value: props.displayValue,
  isLeaf: "leaf",
  class: (data: any,node:any) => renderClass(data,node),
};
const value: any = useVModel(props, "modelValue", emits);

const dataOptions = ref<Array<any>>([]);
const dataOrgOptions = ref<Array<any>>([]);
const orgTreeRef = ref<InstanceType<any>>();
const expandedKeys = ref<string[]>([]);
const checkAll = ref<boolean>(false);
const indeterminate = ref<boolean>(false);
const handleCheckAll = () => {
  if (!checkAll.value) {
    dataOptions.value = [];
  } else {
    // 递归处理所有节点
    const processAllNodes = (nodes: any[]) => {
      nodes.forEach(node => {
        onNodeClick(node); // 触发节点点击事件
        if (node.children) {
          processAllNodes(node.children);
        }
      });
    };
    processAllNodes(dataOrgOptions.value);
  }
}
const renderClass = (data: any,node:any): string => {
  // 获取当前节点的选中状态（独立于父子关联）
  const isSelected = node.checked && !node.indeterminate
  let value = props.displayValue || "value";
  const isCustomSelected  = dataOptions.value.find((e) => e[value] === data[value]);
  return [
    isSelected ? 'is-selected' : '',
    isCustomSelected ? 'is-active' : ''
  ].join(' ').trim()
};

const onNodeClick = (treeNode: any) => {
  let value = props.displayValue || "value";
  const data = JSON.parse(JSON.stringify(treeNode));
  // 新增处理父子节点逻辑
  const processChildren = (node: any, add: boolean) => {
    if (node.children) {
      //非叶子节点也需要选中
      if (!props.selectLeaf) {
        const temp = {...node};
        delete temp["children"];
        dataOptions.value.push(temp);
      }
      //只选所有叶子节点
      node.children.forEach((child: any) => {
        const childIndex = dataOptions.value.findIndex((e) => e[value] === child[value]);
        if (add && childIndex === -1) {
          const temp = {...child}
          delete temp["children"];
          dataOptions.value.push(temp);
        } else if (!add && childIndex !== -1) {
          dataOptions.value.splice(childIndex, 1);
        }
        processChildren(child, add); // 递归处理子节点
      });
    } else {
      dataOptions.value.push(node);
    }
  };
  if (props.multiple) {
    const index = dataOptions.value.findIndex((e) => e[value] === data[value]);
    if (index === -1) {
      if (props.checkStrictly) {
        const tempNode = {...data};
        delete tempNode.children;
        dataOptions.value.push(tempNode);
      } else {
        processChildren(data, false);
      }
      // 当非严格模式时处理子节点
      // console.log(data);
    } else {
      dataOptions.value.splice(index, 1);
    }
    dataOptions.value.sort((a, b) => a[value].localeCompare(b[value]));
  } else {
    const index = dataOptions.value.findIndex((e) => e[value] === data[value]);
    if (index === -1) {
      delete data.children;
      dataOptions.value = [data];
    } else {
      dataOptions.value.splice(index, 1);
    }
  }
  // console.log("onNodeClick", dataOptions.value);
};
const dialogVisible = ref(false);
const queryForm = reactive({
  name: null,
});

watch(
    () => queryForm.name,
    (val) => {
      orgTreeRef.value?.filter(val);
    },
);
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
const loadData = () => {
  if (!props.dataUrl) return;
  let params: any = {
    currentPage: pageInfo.currentPage,
    pageSize: props.pageSize || 0,
    fieldList: [],
    orderBy: [],
  };
  postRequest(props.dataUrl!, params)
      .then((res) => {
        if (res?.data?.code) {
          res && console.error(res?.data?.cnMessage);
          return;
        }
        let redata = res?.data?.data;
        //如果不是分页之间显示返回的所有数据
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
const onOpen = () => {
  dataOrgOptions.value = [];
  if (props.datas?.length > 0) {
    dataOrgOptions.value = props.datas;
  } else {
    loadData();
  }
  dataOptions.value = value.value;
};
const handelConfirm = () => {
  if (props.multiple) {
    value.value = dataOptions.value;
  } else {
    if (dataOptions.value.length > 0) {
      value.value = dataOptions.value[0];
    } else {
      value.value = null;
    }
  }
  dialogVisible.value = false;
};
const resetData = () => {
  dataOptions.value = [];
};
const pageChangeClick = (val: number) => {
  pageInfo.currentPage = val;
  loadData();
};
const pageSizeClick = (val: number) => {
  pageInfo.pageSize = val;
  pageInfo.currentPage = 1;
  loadData();
};
defineExpose({
  open,
});
</script>

<template>
  <star-horse-dialog
      :self-func="true"
      :dialog-visible="dialogVisible"
      @open="onOpen"
      @merge="handelConfirm"
      @resetForm="resetData"
      @closeAction="dialogVisible = false"
      draggable
      :title="title || '选择数据'"
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
                全部
              </el-checkbox>
              <div class="flex flex-row flex-1 items-center justify-center">待选数据区</div>
            </div>
          </template>
          <div class="my-[5px] w-[95%] mx-auto">
            <el-input
                v-model="queryForm.name"
                placeholder="输入关键字进行查询"
                :style="{ width: '100%' }"
                suffix-icon="search"
                clearable
            />
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
                    <div class=" flex flex-row items-center">
                      <star-horse-icon
                          :icon-class="
                    data.children?.length > 0 ? 'folder' : 'document'
                  "/>
                      &nbsp;{{ data[displayName] }}
                    </div>
                  </div>
                  <el-icon class="is-selected">
                    <Check/>
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
            <div class="flex flex-row flex-1 items-center justify-center h-[32px]">
              已选数据区[{{ dataOptions.length }}]
            </div>
          </template>
          <el-scrollbar tag="div" class="org-tree">
            <el-tree
                ref="orgTreeRef"
                :node-key="displayValue"
                :data="dataOptions"
                :default-expanded-keys="expandedKeys"
                :props="treeProps"
                :check-strictly="checkStrictly"
                :filter-node-method="filterNode"
                @node-click="onNodeClick"
            >
              <template #default="{ data }">
                <div class="data-line">
                  <div class="menu-title">
                    <div class=" flex flex-row items-center">
                      <star-horse-icon
                          :icon-class="
                    data.children?.length > 0 ? 'folder' : 'document'
                  "
                      />
                      &nbsp;{{ data[displayName] }}
                    </div>
                    <el-icon class="is-selected">
                      <Check/>
                    </el-icon>
                  </div>
                </div>
              </template>
            </el-tree>
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
</style>
