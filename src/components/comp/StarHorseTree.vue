<script setup lang="ts">
import {computed, ModelRef, nextTick, onMounted, PropType, reactive, ref, unref} from 'vue';
import {TreeNode, TreeNodeData} from 'element-plus/es/components/tree-v2/src/types';
import SubSystemMenu from '@/components/menu/SubSystemMenu.vue';
import StarHorseIcon from '@/components/comp/StarHorseIcon.vue';
import {useGlobalConfigStore} from '@/store/GlobalConfig';
import piniaInstance from '@/store';
import {PageProps} from '@/components/types/PageProps';
import {ApiUrls} from '@/components/types/ApiUrls';
import {warning} from '@/utils/message';
import {SearchParams} from '@/components/types/Params';
import {OrderByInfo} from '@/components/types/PageFieldInfo';
import {postRequest} from '@/api/star_horse_apis';
import {closeLoad, createCondition, loadData} from '@/api/star_horse_utils';
import {isSystemManage} from '@/utils/auth';
import {Config} from '@/api/settings';
import Help from '@/components/help.vue';

const props = defineProps({
  preps: {
    type: Object,
    default: () => {
      return {
        value: 'value',
        label: 'name',
        children: 'children'
      };
    }
  },
  helpMsg: {type: String},
  showCollapse: {type: Boolean, default: false},
  treeTitle: {type: String, default: '树形菜单'},
  expand: {type: Boolean, default: false},
  height: {type: Number, default: 600},
  //是否显示复选框
  showCheckBox: {type: Boolean, default: false},
  //是否显示已选中的数据
  showSelectData: {type: Boolean, default: false},
  checkStrictly: {type: Boolean, default: true},
  //是否显示搜索框
  showSearch: {type: Boolean, default: true},
  checkOnClickNode: {type: Boolean, default: true},
  treeType: {type: String, default: 'tree'},
  //在标签上显示值
  showCode: {type: Boolean, default: false},
  //是否显示分页
  showPageBar: {type: Boolean, default: false},
  //是否动态数据
  isDynamicData: {type: Boolean, default: false},
  //是否自动加载数据
  autoLoad: {type: Boolean, default: true},
  //接口地址
  compUrl: {type: Object as PropType<ApiUrls>},
  //按钮名称
  btnTitle: {type: String, default: '添加数据'},
  //按钮是否可见
  btnVisible: {type: Boolean, default: false},
  rmvTitle: {type: String, default: '删除数据'},
  rmvVisible: {type: Boolean, default: false},
  //是否显示下拉按钮
  showDropdown: {type: Boolean, default: true}
});
const emits = defineEmits(['selectData', 'changeCollapse', 'addData', 'removeData']);
let configStore = useGlobalConfigStore(piniaInstance);
let compSize = computed(() => configStore.configFormInfo?.inputSize || Config.compSize);
const treeRef = ref<any>();
const menuTreeRef = ref<any>();
const searchData = ref('');
const treeDatas: ModelRef<any> = defineModel('treeDatas');
let menuIcon = ref<string>('expand');
let collapse = ref<boolean>(false);
let pageInfo = reactive<PageProps>({
  pageSize: 100,
  currentPage: 1,
  totalData: 0,
  totalPage: 0,
  dataList: []
});
const onQueryChanged = (query: string) => {
  treeRef.value!.filter(query);
};
const filterMethod = (query: string, node: TreeNode) => {
  return node[props.preps?.label]!.toLowerCase().includes(query?.toLowerCase());
};
const changeArrow = (evt: MouseEvent) => {
  if (evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
  collapse.value = !collapse.value;
  menuIcon.value = unref(menuIcon) == 'expand' ? 'collapse' : 'expand';
  emits('changeCollapse', collapse.value);
};
const treeOperation = (cmd: string) => {
  if (props.treeType == 'tree') {
    if (cmd == 'collapse') {
      Object.values(treeRef.value!.store.nodesMap).forEach((v: any) => v.collapse());
    } else {
      Object.values(treeRef.value!.store.nodesMap).forEach((v: any) => v.expand());
    }
  } else {
    const getAllSubNodeIndex = (datas: any) => {
      datas.forEach((item: any) => {
        if (item.children && item.children.length > 0) {
          if (cmd == 'collapse') {
            menuTreeRef.value.close(item[props.preps.value]);
          } else {
            menuTreeRef.value!.open(item[props.preps.value]);
          }
          getAllSubNodeIndex(item.children);
        }
      });
    };
    getAllSubNodeIndex(treeDatas.value);
  }
};
let selectedDataList = ref<Array<any>>([]);
const operSelectData = (data: TreeNodeData, checked: boolean) => {
  if (checked) {
    let hasData = selectedDataList.value.find((item) => item[props.preps.value] == data[props.preps.value]);
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
    treeRef.value!.setChecked(data, checked);
  }
};
const setSelectData = (datas: Array<any>) => {
  //设置数据选中自动会再次赋值
  selectedDataList.value = datas;
  datas.forEach((item) => {
    treeRef.value!.setChecked(item, true);
  });
};
const getSelectData = () => {
  return selectedDataList.value;
};
/**
 * 根据条件重新渲染视图
 * @param _h
 * @param data
 */
const renderContent = (_h: any, data: any) => {
  let labelName = props.preps.label || 'label';
  if (props.showCode) {
    let codeName = props.preps.code || props.preps.value || 'value';
    return `${data.data[labelName]}(${data.data['code'] || data.data[codeName] || ''})`;
  }
  return data.data[labelName];
};
/**
 * 点击事件
 * @param data
 * @param checked
 */
const treeChange = (data: any, checked: boolean) => {
  operSelectData(data, checked);
  emits('selectData', data, checked);
};
const menuChange = (data: any) => {
  emits('selectData', data);
};
const addData = (item: any) => {
  emits('addData', item);
};
const removeData = (item: any) => {
  emits('removeData', item);
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
const createSearchParams = (params: SearchParams[] = [], orderBy: OrderByInfo[] = []) => {
  searchParams = params;
  orderBys = orderBy;
  loadByPage();
};
const expandData = () => {
  if (props.expand) {
    setTimeout(() => {
      treeOperation('expand');
    }, 800);
  }
};
let commonPersons = ref<Array<string>>([]);
const loadByPage = async () => {
  //加入共享人的信息
  if (commonPersons.value && commonPersons.value.length && !isSystemManage()) {
    searchParams.push(createCondition('a.createdBy', commonPersons.value, 'in'));
  }
  let params: any = {
    currentPage: pageInfo.currentPage,
    pageSize: pageInfo.pageSize,
    fieldList: searchParams,
    orderBy: orderBys
  };
  postRequest(props.compUrl?.pageListUrl!, params)
      .then((res: any) => {
        if (!res || res.data.code != 0) {
          console.error(res?.data?.cnMessage || '接口异常');
          return;
        }
        let redata = res.data.data;
        //如果不是分页之间显示返回的所有数据
        treeDatas.value = redata?.dataList || redata;
        pageInfo.totalPage = redata.totalPages;
        pageInfo.totalData = redata.totalDatas;
      })
      .catch((err: any) => {
        console.log(err);
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
      warning('动态数据须配置数据获取接口');
      return;
    }
    //拿到别人共享的信息
    let resultData = await loadData('/system-config/system/dataPermission/currentMenuPermissionPerson', {});
    commonPersons.value = resultData.data;
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
  createSearchParams
});
</script>

<template>
  <el-card class="inner_content" :style="{ width: collapse ? '60px' : 'unset',
                                           height: '100%',
                                           padding: 'unset' }">
    <div class="selected-data gap-2" v-if="showSelectData && selectedDataList.length > 0">
      <template v-for="item in selectedDataList">
        <el-tag closable @close="operSelectData(item, false)">{{ item[preps.label] }}</el-tag>
      </template>
    </div>
    <div class="tree-title">
      <div class="title flex items-center">{{ treeTitle }}&nbsp;<help v-if="helpMsg" :message="helpMsg"/>
      </div>
      <div class="btn" v-if="showCollapse">
        <star-horse-icon :icon-class="menuIcon" @click="changeArrow"/>
      </div>
    </div>
    <div class="search-input" v-if="showSearch">
      <el-input
          v-model="searchData"
          :size="compSize"
          clearable
          :style="{ 'margin-right': showDropdown ? 'unset' : '10px' }"
          placeholder="请输入关键字"
          @input="onQueryChanged"
      >
        <template #append>
          <star-horse-icon @click="onQueryChanged" icon-class="search" color="var(--star-horse-style)" size="18px"/>
        </template>
      </el-input>
      <el-dropdown placement="bottom" @command="treeOperation" v-if="showDropdown">
        <star-horse-icon icon-class="v-dot" color="var(--star-horse-style)" size="20px"/>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="expand">展开全部</el-dropdown-item>
            <el-dropdown-item command="collapse">折叠全部</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-divider v-if="showSearch"/>
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
              <div class="name"
              >{{ node.label }}
                <template v-if="showCode">
                  ({{ data["code"] || data[preps.code || preps.value || "value"] || "" }})
                </template>
              </div>
              <div v-if="btnVisible || rmvVisible" class="btn">
                <el-tooltip :content="btnTitle">
                  <star-horse-icon cursor="pointer" v-if="btnVisible" @click.stop="addData(data)" icon-class="plus"/>
                </el-tooltip>
                <el-tooltip :content="rmvTitle">
                  <star-horse-icon
                      cursor="pointer"
                      v-if="rmvVisible"
                      @click.stop="removeData(data)"
                      color="var(--el-color-danger)"
                      icon-class="minus"
                  />
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-tree>
        <el-menu v-if="treeType == 'menu'" ref="menuTreeRef" :unique-opened="false">
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
          layout="prev, pager, next"
          v-model:currentPage="pageInfo.currentPage"
          v-model:page-size="pageInfo.pageSize"
          v-model:pageCount="pageInfo.totalPage"
      />
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
  justify-content: start;
  margin: 5px;
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
  width: 100%;
  align-items: center;
  display: flex;
  margin: 5px;
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
</style>
