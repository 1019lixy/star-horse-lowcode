<script setup lang="ts" name="StarHorseTree">
import { postRequest } from "@/api/star_horse_apis";
import { closeLoad, createCondition } from "@/api/star_horse_utils";
import { compKey } from "@/api/system";
import { ApiUrls } from "@/components/types/ApiUrls";
import { SearchParams } from "@/components/types/Params";
import { PageProps } from "@/components/types/PageProps";
import { OrderByInfo } from "@/components/types/PageFieldInfo";
import { i18n } from "@/lang";
import { isSystemManage } from "@/utils/auth";
import { warning } from "@/utils/message";
import {
  computed,
  ModelRef,
  nextTick,
  onMounted,
  PropType,
  reactive,
  ref,
  unref,
} from "vue";
import { getGlobalConfigStore } from "@/store/StoreManager";
import { isMobile } from "@/api/device";
import { useMobilePicker } from "@/components/formcomp/utils/useMobilePicker";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";

const props = defineProps({
  preps: {
    type: Object as PropType<any>,
    default: () => {
      return {
        value: "value",
        label: "name",
        children: "children",
      };
    },
  },
  helpMsg: { type: String },
  showCollapse: { type: Boolean, default: false },
  treeTitle: { type: String, default: () => i18n("comp.treeMenu") },
  expand: { type: Boolean, default: false },
  height: { type: Number, default: 600 },
  //是否显示复选框
  showCheckBox: { type: Boolean, default: false },
  //是否显示已选中的数据
  showSelectData: { type: Boolean, default: false },
  checkStrictly: { type: Boolean, default: true },
  //是否显示搜索框
  showSearch: { type: Boolean, default: true },
  checkOnClickNode: { type: Boolean, default: true },
  treeType: { type: String, default: "tree" },
  //在标签上显示值
  showCode: { type: Boolean, default: false },
  //是否显示分页
  showPageBar: { type: Boolean, default: false },
  //是否动态数据
  isDynamicData: { type: Boolean, default: false },
  //是否自动加载数据
  autoLoad: { type: Boolean, default: true },
  //接口地址
  compUrl: { type: Object as PropType<ApiUrls> },
  //默认排序
  orderBy: { type: Array as PropType<OrderByInfo[]>, default: () => [] },
  //按钮名称
  btnTitle: { type: String, default: () => i18n("comp.addData") },
  //按钮是否可见
  btnVisible: { type: Boolean, default: false },
  rmvTitle: { type: String, default: () => i18n("comp.deleteData") },
  rmvVisible: { type: Boolean, default: false },
  //是否显示下拉按钮
  showDropdown: { type: Boolean, default: true },
  /**
   * 数据共享人
   *   拿到别人共享的信息
   *   let resultData = await loadData('/system-config/system/dataPermission/currentMenuPermissionPerson', {});
   *   上面接口主要返回共享人的账号
   *   commonPersons.value = resultData?.data;
   */
  commonPersons: { type: Array as PropType<any>, default: [] },
});
const emits = defineEmits([
  "selectData",
  "changeCollapse",
  "addData",
  "removeData",
]);
let compSize = computed(
  () => getGlobalConfigStore().configFormInfo?.inputSize || "default",
);
const treeRef = ref<any>();
const menuTreeRef = ref<any>();
const searchData = ref("");
const treeDatas: ModelRef<any> = defineModel("treeDatas");
let menuIcon = ref<string>("expand");
let collapse = ref<boolean>(false);
const _compKey = compKey;
let pageInfo = reactive<PageProps>({
  pageSize: 20,
  currentPage: 1,
  totalData: 0,
  totalPage: 0,
  dataList: [],
});
const onQueryChanged = (query: string) => {
  treeRef.value?.filter(query);
};
const filterMethod = (query: string, node: any) => {
  return node?.[props.preps?.label]
    ?.toLowerCase()
    ?.includes(query?.toLowerCase());
};
const changeArrow = (evt: MouseEvent) => {
  if (evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
  collapse.value = !collapse.value;
  menuIcon.value = unref(menuIcon) == "expand" ? "collapse" : "expand";
  emits("changeCollapse", collapse.value);
};
// APP 端抽屉
const {
  pickerVisible: treePickerVisible,
  placement: treePlacement,
  size: treeSize,
  openPicker: openTreePicker,
  closePicker: closeTreePicker,
} = useMobilePicker(() => ({ preps: {} } as any));

const treeOperation = (cmd: string) => {
  if (props.treeType == "tree") {
    if (cmd == "add") {
      emits("addData", {});
    } else if (cmd == "collapse") {
      Object.values(treeRef.value?.store?.nodesMap || {}).forEach((v: any) =>
        v.collapse(),
      );
    } else {
      Object.values(treeRef.value?.store?.nodesMap || {}).forEach((v: any) =>
        v.expand(),
      );
    }
  } else {
    const getAllSubNodeIndex = (datas: any) => {
      datas.forEach((item: any) => {
        if (item.children && item.children.length > 0) {
          if (cmd == "add") {
            emits("addData", {});
          } else if (cmd == "collapse") {
            menuTreeRef.value?.close(item?.[props.preps?.value]);
          } else {
            menuTreeRef.value?.open(item?.[props.preps?.value]);
          }
          getAllSubNodeIndex(item.children);
        }
      });
    };
    getAllSubNodeIndex(treeDatas.value);
  }
};
let selectedDataList = ref<Array<any>>([]);
const operSelectData = (data: any, checked: boolean) => {
  if (checked) {
    let hasData = selectedDataList.value.find(
      (item) => item[props.preps?.value] == data[props.preps?.value],
    );
    if (!hasData) {
      selectedDataList.value.push(data);
    }
  } else {
    for (let index in selectedDataList.value) {
      let temp = selectedDataList.value[index];
      if (temp[props.preps?.value] == data[props.preps?.value]) {
        selectedDataList.value.splice(Number(index), 1);
        break;
      }
    }
    treeRef.value?.setChecked(data, checked);
  }
};
const setSelectData = (datas: Array<any>) => {
  selectedDataList.value = datas;
  datas?.forEach((item) => {
    treeRef.value?.setChecked(item, true);
  });
};
const getSelectData = () => {
  return selectedDataList.value;
};

/**
 * 点击事件
 * @param data
 * @param checked
 */
const treeChange = (data: any, checked: boolean) => {
  operSelectData(data, checked);
  emits("selectData", data, checked);
};
const menuChange = (data: any) => {
  emits("selectData", data);
};
const addData = (item: any) => {
  emits("addData", item);
};
const removeData = (item: any) => {
  emits("removeData", item);
};
const pageSizeClick = (pageSize: number) => {
  pageInfo.pageSize = pageSize;
  loadByPage();
};
const pageChangeClick = (currentPage: number) => {
  pageInfo.currentPage = currentPage;
  loadByPage();
};
let searchParams: SearchParams[] = [];
let orderBys: OrderByInfo[] = [];
const createSearchParams = (
  params: SearchParams[] = [],
  orderBy: OrderByInfo[] = [],
) => {
  searchParams = params;
  orderBys = orderBy;
  loadByPage();
};
const expandData = () => {
  if (props.expand) {
    setTimeout(() => {
      treeOperation("expand");
    }, 800);
  }
};
const loadByPage = async () => {
  //加入共享人的信息
  if (props.commonPersons?.length && !isSystemManage()) {
    searchParams.push(
      createCondition("a.createdBy", props.commonPersons, "in"),
    );
  }
  let temp = orderBys.concat(props.orderBy);
  let params: any = {
    currentPage: pageInfo.currentPage,
    pageSize: pageInfo.pageSize,
    fieldList: searchParams,
    orderBy: temp,
  };
  postRequest(props.compUrl?.pageListUrl!, params)
    .then((res: any) => {
      if (!res || res?.data?.code != 0) {
        console.error(res?.data?.cnMessage || i18n("api.interfaceError"));
        return;
      }
      let redata = res?.data?.data;
      //如果不是分页之间显示返回的所有数据
      treeDatas.value = redata?.dataList || redata;
      pageInfo.totalPage = redata?.totalPages;
      pageInfo.totalData = redata?.totalDatas;
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      closeLoad();
    });
  await nextTick();
  expandData();
};

const init = async () => {
  if (props.isDynamicData) {
    if (!props.compUrl) {
      warning(i18n("ui.dynamicInterfaceError"));
      return;
    }
    if (props.autoLoad) {
      loadByPage();
    }
  } else {
    await nextTick();
    expandData();
  }
};

onMounted(() => {
  init();
});
defineExpose({
  getSelectData,
  setSelectData,
  createSearchParams,
});
</script>

<template>
  <el-card
    class="inner_content h-full"
    :style="{
      width: collapse ? '60px' : 'unset',
      padding: 'unset',
    }"
  >
    <div
      class="selected-data gap-2"
      v-if="showSelectData && selectedDataList?.length > 0"
    >
      <el-tag
        closable
        @close="operSelectData(item, false)"
        v-for="item in selectedDataList"
        :key="_compKey(item, item[preps.value])"
        >{{ item[preps.label] }}
      </el-tag>
    </div>
    <div class="tree-title">
      <div class="title flex items-center">
        {{ treeTitle }}&nbsp;
        <help v-if="helpMsg" :message="helpMsg" />
      </div>
      <div class="btn" v-if="showCollapse">
        <star-horse-icon :icon-class="menuIcon" @click="changeArrow" />
      </div>
    </div>
    <div class="search-input" v-if="showSearch">
      <el-input
        v-model="searchData"
        :size="compSize"
        clearable
        :style="{ 'margin-right': showDropdown ? 'unset' : '10px' }"
        :placeholder="i18n('ui.pleaseInputKeyword')"
        @input="onQueryChanged"
      >
        <template #append>
          <star-horse-icon
            @click="onQueryChanged"
            icon-class="search"
            color="var(--star-horse-style)"
            size="18px"
          />
        </template>
      </el-input>
      <!-- PC 端：el-dropdown -->
      <el-dropdown
        v-if="showDropdown && !isMobile"
        placement="bottom"
        @command="treeOperation"
      >
        <star-horse-icon
          icon-class="v-dot"
          color="var(--star-horse-style)"
          size="20px"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-if="btnVisible" command="add"
              >{{ i18n("ui.addData") }}
            </el-dropdown-item>
            <el-dropdown-item command="expand"
              >{{ i18n("ui.expandAll") }}
            </el-dropdown-item>
            <el-dropdown-item command="collapse"
              >{{ i18n("ui.collapseAll") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- APP 端：触发器 + 抽屉动作面板 -->
      <star-horse-icon
        v-if="showDropdown && isMobile"
        icon-class="v-dot"
        color="var(--star-horse-style)"
        size="20px"
        style="cursor: pointer"
        @click="openTreePicker"
      />
      <ShMobilePicker
        v-if="isMobile && treePickerVisible"
        v-model="treePickerVisible"
        title="操作"
        :placement="treePlacement"
        :size="treeSize"
        :show-footer="false"
      >
        <div class="tree-action-panel">
          <div class="tree-action-panel__item" @click="treeOperation('add'); closeTreePicker();" v-if="btnVisible">
            <star-horse-icon icon-class="plus" />
            <span>{{ i18n("ui.addData") }}</span>
          </div>
          <div class="tree-action-panel__item" @click="treeOperation('expand'); closeTreePicker();">
            <star-horse-icon icon-class="folder" />
            <span>{{ i18n("ui.expandAll") }}</span>
          </div>
          <div class="tree-action-panel__item" @click="treeOperation('collapse'); closeTreePicker();">
            <star-horse-icon icon-class="document" />
            <span>{{ i18n("ui.collapseAll") }}</span>
          </div>
        </div>
      </ShMobilePicker>
    </div>
    <el-divider v-if="showSearch" />
    <div class="tree-content">
      <el-scrollbar height="100%">
        <el-tree
          ref="treeRef"
          :data="treeDatas"
          :props="preps"
          :node-key="preps.value"
          v-if="treeType == 'tree'"
          :filter-node-method="filterMethod"
          :check-strictly="checkStrictly"
          :show-checkbox="showCheckBox"
          highlight-current
          @nodeClick="treeChange"
          @checkChange="treeChange"
        >
          <template #default="{ node, data }">
            <div class="menu-title">
              <div class="name flex items-center">
                <star-horse-icon
                  :icon-class="
                    data.children?.length > 0 ? 'folder' : 'document'
                  "
                />
                {{ node.label }}
                <template v-if="showCode">
                  ({{
                    data["code"] ||
                    data[preps.code || preps.value || "value"] ||
                    ""
                  }})
                </template>
              </div>
              <div v-if="btnVisible || rmvVisible" class="btn">
                <el-tooltip v-if="!isMobile" :content="btnTitle">
                  <star-horse-icon
                    cursor="pointer"
                    v-if="btnVisible"
                    @click.stop="addData(data)"
                    icon-class="plus"
                  />
                </el-tooltip>
                <star-horse-icon
                  v-else-if="btnVisible"
                  cursor="pointer"
                  @click.stop="addData(data)"
                  icon-class="plus"
                />
                <el-tooltip v-if="!isMobile" :content="rmvTitle">
                  <star-horse-icon
                    cursor="pointer"
                    v-if="rmvVisible"
                    @click.stop="removeData(data)"
                    color="var(--el-color-danger)"
                    icon-class="minus"
                  />
                </el-tooltip>
                <star-horse-icon
                  v-else-if="rmvVisible"
                  cursor="pointer"
                  @click.stop="removeData(data)"
                  color="var(--el-color-danger)"
                  icon-class="minus"
                />
              </div>
            </div>
          </template>
        </el-tree>
        <el-menu
          v-if="treeType == 'menu'"
          ref="menuTreeRef"
          :unique-opened="false"
        >
          <SubSystemMenu
            :dataList="treeDatas"
            :preps="preps"
            @addData="addData"
            @removeData="removeData"
            @selectData="menuChange"
          />
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="tree-footer" v-if="showPageBar">
      <el-pagination
        :total="pageInfo.totalData"
        @current-change="pageChangeClick"
        @size-change="pageSizeClick"
        :size="compSize"
        :page-sizes="[10, 20, 30, 50]"
        layout=" prev, pager, next,slot,sizes"
        v-model:currentPage="pageInfo.currentPage"
        v-model:page-size="pageInfo.pageSize"
        v-model:pageCount="pageInfo.totalPage"
        style="overflow: auto"
      >
        <el-button
          text
          icon="refresh"
          :size="compSize"
          @click="loadByPage"
          :title="i18n('ui.refresh')"
        />
      </el-pagination>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
:deep(.el-tag) {
  margin-left: 5px;
}

.selected-data {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;
  margin: 8px 5px;
  border: 1px dashed var(--star-horse-shadow);
}

.tree-title {
  width: 100%;
  height: 35px;
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 800;
  background: rgb(229, 230, 235);
  border: 1px solid #ebeef5;
  justify-content: space-between;

  .title {
    margin-left: 15px;
  }

  .btn,
  svg {
    cursor: pointer;
  }
}

.search-input {
  width: 98%;
  align-items: center;
  display: flex;
  margin: 5px auto;
}

.tree-content {
  margin: 5px;
  flex: 1;
  overflow: hidden;
}

:deep(.el-sub-menu__icon-arrow) {
  width: 20px !important;
  right: 5px;
}

:deep(.el-menu-item) {
  height: 30px;
  line-height: 30px;
}

:deep(.el-divider--horizontal) {
  margin: 5px 0 !important;
}

/* APP 端动作面板 */
.tree-action-panel {
  display: flex;
  flex-direction: column;
  padding: 8px 0;

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    cursor: pointer;
    border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);

    &:active {
      background: var(--el-fill-color, #f5f7fa);
    }

    &:last-child {
      border-bottom: none;
    }

    span {
      font-size: 15px;
      color: var(--el-text-color-primary, #303133);
    }
  }
}
</style>
