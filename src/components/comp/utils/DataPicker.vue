<script setup lang="ts">
  import { useVModel } from '@vueuse/core';
  import type { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type';
  import { type ElTree } from 'element-plus';
  import { reactive, ref, watch } from 'vue';
  import { postRequest } from '@/api/star_horse_apis';
  import StarHorseDialog from '@/components/comp/StarHorseDialog.vue';
  import { closeLoad } from '@/api/star_horse_utils';
  import { PageProps } from '@/components/types/PageProps';

  export type ModelValueType = any;

  export interface DataDropdownProps {
    modelValue: ModelValueType;
    dataUrl?: string;
    pageSize?: number;
    datas?: Array<any>;
    title?: string;
    compSize?: string;
    displayName?: string;
    displayValue?: string;
    multiple?: boolean;
    checkStrictly?: boolean;
  }

  const props = withDefaults(defineProps<DataDropdownProps>(), {
    displayName: 'name',
    displayValue: 'value',
    compSize: 'small',
    pageSize: 0,
    multiple: false,
    checkStrictly: true
  });

  const emits = defineEmits<{
    (e: 'update:modelValue', modelValue: ModelValueType): void;
  }>();
  const treeProps = {
    label: props.displayName,
    children: 'children',
    value: props.displayValue,
    isLeaf: 'leaf',
    class: (data: TreeNodeData) => renderClass(data)
  };
  const value: any = useVModel(props, 'modelValue', emits);

  const dataOptions = ref<Array<any>>([]);
  const dataOrgOptions = ref<Array<any>>([]);
  const orgTreeRef = ref<InstanceType<typeof ElTree>>();
  const expandedKeys = ref<string[]>([]);

  const renderClass = (
    data: TreeNodeData
  ):
    | string
    | {
        [key: string]: boolean;
      } => {
    let value = props.displayValue || 'value';
    const val = dataOptions.value.find((e) => e[value] === data[value]);
    if (val) {
      return 'is-active';
    } else {
      return '';
    }
  };

  const onNodeClick = (data: any) => {
    let value = props.displayValue || 'value';
    if (props.multiple) {
      const index = dataOptions.value.findIndex((e) => e[value] === data[value]);
      if (index === -1) {
        dataOptions.value.push(data);
        dataOptions.value.sort((a, b) => a[value].localeCompare(b[value]));
      } else {
        dataOptions.value.splice(index, 1);
      }
    } else {
      const index = dataOptions.value.findIndex((e) => e[value] === data[value]);
      if (index === -1) {
        dataOptions.value = [data];
      } else {
        dataOptions.value.splice(index, 1);
      }
    }
    // console.log("onNodeClick", dataOptions.value);
  };
  const dialogVisible = ref(false);
  const queryForm = reactive({
    name: null
  });

  watch(
    () => queryForm.name,
    (val) => {
      orgTreeRef.value?.filter(val);
    }
  );
  const filterNode = (value: string, data: TreeNodeData): boolean => {
    if (!value) return true;
    // if (props.pageSize > 0) {
    //
    // } else {
    return data[props.displayName].includes(value);
    // }
  };
  let pageInfo = reactive<PageProps>({
    pageSize: 20,
    currentPage: 1,
    totalData: 0,
    totalPage: 0,
    dataList: []
  });
  const loadData = () => {
    let params: any = {
      currentPage: pageInfo.currentPage,
      pageSize: props.pageSize || 0,
      fieldList: [],
      orderBy: []
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
    if (props.datas && props.datas.length > 0) {
      dataOrgOptions.value = props.datas;
    } else {
      loadData();
    }
    let dataIds: string[] = [];
    if (Array.isArray(value.value)) {
      dataIds.push(...value.value);
    } else if (value.value) {
      dataIds.push(value.value);
    }
    if (dataIds.length > 0) {
    } else {
      dataOptions.value = [];
    }
    console.log('onOpen', dataOrgOptions);
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
    open
  });
</script>

<template>
  <star-horse-dialog
    :self-func="true"
    :dialog-visible="dialogVisible"
    :hideFullScreenIcon="true"
    @open="onOpen"
    @merge="handelConfirm"
    @resetForm="resetData"
    @closeAction="dialogVisible = false"
    draggable
    :title="title || '选择数据'"
    boxWidth="30%"
  >
    <el-card shadow="never" class="org-card dialog-body">
      <template #header>
        <el-input
          v-model="queryForm.name"
          placeholder="输入关键字进行查询"
          :style="{ width: '100%' }"
          suffix-icon="search"
          clearable
        >
        </el-input>
      </template>

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
              <div class="flex-center">
                <el-icon :size="16">
                  <School />
                </el-icon>
                &nbsp;{{ data[displayName] }}
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
    height: 270px;
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
