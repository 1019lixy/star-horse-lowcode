<script setup lang="ts">
import {computed, nextTick, onUnmounted, reactive, ref, watch} from "vue";
import {i18n} from "@/lang";
import {createCondition} from "@/api/star_horse_utils";
import {PageProps} from "@/components/types/PageProps";
import {SearchParams} from "@/components/types";
import {isMobile} from "@/api/device";
import {dataPickerBaseDefaults, loadPageData, toggleNodeSelection, type DataPickerBaseProps, type ModelValueType} from "@/api/star_horse_utils";
import {StarHorseIcon} from "@/components/comp";
import {Bottom, Check, Delete, Download, QuestionFilled, Sort, Top, Upload,} from "@element-plus/icons-vue";
import Sortable from "sortablejs";

/**
 * 远端非分页数据的内存缓存（跨打开复用）。
 * 已加载过的数据源再打开时直接读缓存，避免 close/重开反复调后端；
 * key 为数据源标识（apiEndpoints/apiDataSource/proxy/params），无关分页。
 * 换数据源或需要最新数据（如点击搜索）时强制绕过缓存。
 */
const remoteOptionsCache = new Map<string, any[]>();

/** DataPicker 私有扩展：继承公共 DataPickerBaseProps */
export interface DataDropdownProps extends DataPickerBaseProps {
  autoClose?: boolean;
  dialogType?: "dialog" | "drawer";
}

const props = withDefaults(defineProps<DataDropdownProps>(), {
  ...dataPickerBaseDefaults,
  autoClose: true,
});

/**
 * 数据流说明（单向，无 useVModel）：
 * 1. 打开弹窗时从 props.modelValue 读取已选，初始化内部 dataOptions
 * 2. 弹窗内所有选择/排序/删除操作只修改 dataOptions
 * 3. 点击确认时通过 update:modelValue 一次性回传父组件
 */
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValueType): void;
}>();
const treeProps = {
  label: props.displayName,
  children: "children",
  value: props.displayValue,
  isLeaf: "leaf",
  class: (data: any, node: any) => renderClass(data, node),
};
/** 弹窗内已选列表（工作状态，确认时回传） */
const dataOptions = ref<Array<any>>([]);
/** 待选数据列表（静态 data 或远程分页结果；APP 本地分页时为当前页扁平数据） */
const dataOrgOptions = ref<Array<any>>([]);
const orgTreeRef = ref<InstanceType<any>>();
const expandedKeys = ref<string[]>([]);
const checkAll = ref<boolean>(false);
/** APP 端本地分页：是否启用（静态数据 + 移动端 + 叶子数 >= 500） */
const localPageEnabled = ref(false);
/** APP 端本地分页：所有扁平化叶子 */
const localFlatLeaves = ref<any[]>([]);

/** 层级筛选是否展开（下拉式，默认收起） */
const hierarchyExpanded = ref(false);
const selectedHierarchyKey = ref<string>("");
/** 层级筛选面板模式：true=级联标签式（每级一列），false=树形 */
const hierarchyPanelMode = ref(false);
/** 级联模式：当前各列选中的节点 key */
const cascadeSelectedKeys = ref<string[]>([]);
/** 级联模式：各列展示的节点 */
const cascadeColumns = ref<any[][]>([[]]);
/** 树最大层级数，用于自动切换面板模式 */
const treeMaxLevel = ref(0);
/** APP 端底部已选栏是否展开 */
const selectedBarExpanded = ref(false);
/** APP 端已选栏高度（可拖拽调整） */
const selectedBarHeight = ref(260);
/** APP 端已选栏拖拽中 */
const isDraggingSelectedBar = ref(false);
/** APP 端已选数据搜索关键字 */
const selectedQuery = ref("");
/** 完整原始树（不复制，直接引用 props.data） */
const fullTreeData = ref<any[]>([]);
/** 树形模式层级筛选树：仅保留分类节点（有 children） */
const hierarchyTreeData = ref<any[]>([]);
/** APP 端过滤后的已选数据 */
const filteredSelectedItems = computed(() => {
  if (!selectedQuery.value) return dataOptions.value;
  const kw = selectedQuery.value.toLowerCase();
  return dataOptions.value.filter((item: any) => {
    const name = String(item[props.displayName] ?? "").toLowerCase();
    const code = String(item[props.displayCode] ?? "").toLowerCase();
    return name.includes(kw) || code.includes(kw);
  });
});
const filteredDataOrgOptions = computed(() => {
  // 本地分页模式下 dataOrgOptions 已经是 paged/flat 结果，直接展示
  if (localPageEnabled.value) return dataOrgOptions.value;
  if (!selectedHierarchyKey.value) return dataOrgOptions.value;
  const node = findNodeByKey(fullTreeData.value, selectedHierarchyKey.value);
  if (!node) return dataOrgOptions.value;
  return node.children || [node];
});

/** 只保留有 children 的分类节点（不复制节点，仅引用） */
const filterCategoryNodes = (nodes: any[] | undefined): any[] => {
  if (!nodes?.length) return [];
  return nodes.filter((n: any) => n.children?.length > 0);
};

/** 构建层级筛选树：仅保留分类节点（有 children），叶子只在下方面板展示 */
const buildHierarchyData = (nodes: any[]): any[] => {
  const walk = (arr: any[]): any[] => {
    if (!arr?.length) return [];
    return arr
      .filter((n: any) => n.children?.length > 0)
      .map((n: any) => ({
        ...n,
        children: walk(n.children),
      }));
  };
  return walk(nodes || []);
};

/** 初始化级联模式第一列（仅分类节点） */
const initCascadeColumns = () => {
  fullTreeData.value =
    props.data?.length > 0 ? props.data : dataOrgOptions.value;
  treeMaxLevel.value = getTreeMaxLevel(fullTreeData.value);
  // 树形模式的层级树：只保留分类节点
  hierarchyTreeData.value = buildHierarchyData(fullTreeData.value);
  // 3 级以上（如省/市/区/街道4级）使用级联面板模式，展示更完整
  hierarchyPanelMode.value = treeMaxLevel.value >= 3;
  if (hierarchyPanelMode.value) {
    cascadeSelectedKeys.value = [];
    // 第一列：只展示有 children 的分类节点（省），街道等叶子不展示
    cascadeColumns.value = [filterCategoryNodes(fullTreeData.value)];
  }
};

/** 级联模式：点击某列节点 */
const onCascadeNodeClick = (node: any, level: number) => {
  // 更新选中
  cascadeSelectedKeys.value = cascadeSelectedKeys.value.slice(0, level);
  cascadeSelectedKeys.value[level] = node[props.displayValue];
  // 裁剪列
  cascadeColumns.value = cascadeColumns.value.slice(0, level + 1);
  // 选择该节点作为筛选条件
  selectedHierarchyKey.value = node[props.displayValue];

  // 本地分页模式下：筛选完整树后扁平化 + 分页
  if (localPageEnabled.value && props.data?.length > 0) {
    const subtreeRoot = findNodeByKey(props.data, node[props.displayValue]);
    if (subtreeRoot) {
      localFlatLeaves.value = flattenLeafNodes(
        subtreeRoot.children?.length > 0 ? subtreeRoot.children : [subtreeRoot],
      );
    } else {
      localFlatLeaves.value = flattenLeafNodes(props.data);
    }
    pageInfo.currentPage = 1;
    pageInfo.totalData = localFlatLeaves.value.length;
    dataOrgOptions.value = getLocalPagedData();
  }

  // 如果有子分类节点（过滤叶子），追加下一列
  const nextCol = filterCategoryNodes(node.children);
  if (nextCol.length > 0) {
    cascadeColumns.value.push(nextCol);
  } else {
    // 已到最后一级分类节点：自动收起层级筛选面板
    hierarchyExpanded.value = false;
  }
};

/** 取消级联筛选 */
const clearCascadeFilter = () => {
  const fullTree = props.data?.length > 0 ? props.data : dataOrgOptions.value;
  cascadeSelectedKeys.value = [];
  // 仅展示分类节点（第一级）
  cascadeColumns.value = [filterCategoryNodes(fullTree || [])];
  selectedHierarchyKey.value = "";
  // 本地分页模式重置
  if (localPageEnabled.value && props.data?.length > 0) {
    localFlatLeaves.value = flattenLeafNodes(props.data);
    pageInfo.currentPage = 1;
    pageInfo.totalData = localFlatLeaves.value.length;
    dataOrgOptions.value = getLocalPagedData();
  }
};

/** 根据 key 在树中递归查找节点 */
const findNodeByKey = (nodes: any[], key: string): any => {
  for (const node of nodes) {
    if (node[props.displayValue] === key) return node;
    if (node.children) {
      const found = findNodeByKey(node.children, key);
      if (found) return found;
    }
  }
  return null;
};

/** 计算树深度，决定层级筛选默认展开到哪一层 */
const getTreeMaxLevel = (nodes: any[], level = 0): number => {
  if (!nodes?.length) return level;
  return Math.max(
    level,
    ...nodes.map((n) =>
      n.children?.length > 0 ? getTreeMaxLevel(n.children, level + 1) : level,
    ),
  );
};

/** 切换层级筛选（树形模式） */
const onHierarchyClick = (node: any) => {
  const newKey =
    selectedHierarchyKey.value === node[props.displayValue]
      ? ""
      : node[props.displayValue];
  selectedHierarchyKey.value = newKey;

  // 本地分页模式下：同步筛选 props.data 中对应 subtree 并扁平化
  if (localPageEnabled.value && props.data?.length > 0) {
    if (!newKey) {
      localFlatLeaves.value = flattenLeafNodes(props.data);
    } else {
      const subtreeRoot = findNodeByKey(props.data, newKey);
      if (subtreeRoot) {
        localFlatLeaves.value = flattenLeafNodes(
          subtreeRoot.children?.length > 0
            ? subtreeRoot.children
            : [subtreeRoot],
        );
      } else {
        localFlatLeaves.value = flattenLeafNodes(props.data);
      }
    }
    pageInfo.currentPage = 1;
    pageInfo.totalData = localFlatLeaves.value.length;
    dataOrgOptions.value = getLocalPagedData();
  }

  // 树形模式：如果该分类节点已无子分类（叶子分类），自动收起面板
  if (!node.children?.length) {
    hierarchyExpanded.value = false;
  }
};

/** 显示文本（支持 label+code 模式） */
const displayText = (item: any): string => {
  const name = item[props.displayName];
  if (props.displayMode === "label+code") {
    const code = item[props.displayCode];
    if (code) return `${name}（${code}）`;
  }
  return name;
};

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
    return;
  }
  const processAllNodes = (nodes: any[]) => {
    nodes.forEach((node) => {
      // 仅选中未选中的节点，避免 toggle 语义把已选项反选掉
      const exists = dataOptions.value.some(
        (e) => e[props.displayValue] === node[props.displayValue],
      );
      if (!exists) onNodeClick(node);
      if (node.children) {
        processAllNodes(node.children);
      }
    });
  };
  processAllNodes(dataOrgOptions.value);
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
const removeItem = (item: any) => {
  const list = [...dataOptions.value];
  // 根据传入item查找下标（根据唯一标识匹配，不要直接 ===，对象引用会失效！）
  const index = list.findIndex(
    (row) => row[props.displayValue] === item[props.displayValue],
  );
  if (index === -1) return; // 没找到直接退出，防止splice异常
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

/** 拖拽已选栏上边框调整高度 */
const onDragStart = (e: PointerEvent) => {
  e.preventDefault();
  // 捕获 pointer，确保后续 move/up 都能收到，不被浏览器拦截
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  isDraggingSelectedBar.value = true;
  const startY = e.clientY;
  const startHeight = selectedBarHeight.value;

  const onMove = (ev: PointerEvent) => {
    ev.preventDefault();
    const delta = startY - ev.clientY;
    const newH = Math.max(
      120,
      Math.min(startHeight + delta, window.innerHeight - 200),
    );
    selectedBarHeight.value = newH;
  };
  const onUp = (ev: PointerEvent) => {
    isDraggingSelectedBar.value = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(ev.pointerId);
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onUp);
    document.body.style.userSelect = "";
  };
  document.body.style.userSelect = "none";
  document.addEventListener("pointermove", onMove, { passive: false });
  document.addEventListener("pointerup", onUp);
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
const queryName = ref("");
let pageInfo = reactive<PageProps>({
  pageSize: 20,
  currentPage: 1,
  totalData: 0,
  totalPage: 0,
  dataList: [],
});

/** 远端数据源标识（跨打开缓存 key，不含分页页码） */
const remoteSourceKey = () =>
  JSON.stringify({
    apiEndpoints: props.apiEndpoints,
    apiDataSource: props.apiDataSource,
    proxy: props.proxy,
    proxyUrl: props.proxyUrl,
    params: props.params,
  });

/** 每页条数：优先取数据源配置(apiDataSource.pageSize)，回退到组件 pageSize prop；0=整树/非分页 */
const effectivePageSize = computed(
  () => Number(props.apiDataSource?.pageSize ?? props.pageSize ?? 0) || 0,
);

/** 远程模式：分页加载待选列表（统一走 loadPageData）；非分页已缓存则复用，不重复调后端 */
const loadData = async (condition?: SearchParams[], fresh: boolean = false) => {
  if (!props.apiEndpoints && !props.apiDataSource) return;
  const cacheKey = remoteSourceKey();
  // 非分页 && 有缓存 && 非强制刷新 → 直接复用内存，不再请求后端
  if (!effectivePageSize.value && !fresh) {
    const cached = remoteOptionsCache.get(cacheKey);
    if (cached && cached.length > 0) {
      dataOrgOptions.value = cached;
      pageInfo.totalData = cached.length;
      pageInfo.totalPage = 1;
      pageInfo.currentPage = pageInfo.currentPage || 1;
      return;
    }
  }
  const result = await loadPageData({
    apiEndpoints: props.apiEndpoints,
    conditions: condition,
    extraParams: props.params,
    currentPage: pageInfo.currentPage,
    pageSize: effectivePageSize.value || 0,
    proxy: props.proxy,
    proxyUrl: props.proxyUrl,
    apiDataSource: props.apiDataSource,
  });
  dataOrgOptions.value = result.list;
  pageInfo.totalPage = result.totalPage;
  pageInfo.totalData = result.totalData;
  if (!effectivePageSize.value) {
    remoteOptionsCache.set(cacheKey, result.list);
  }
};

/** 关键字搜索防抖定时器（避免每次输入都触发请求/重复过滤） */
let searchDebounceTimer: any = null;
const onSearchInput = () => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => dataSearch(), 400);
};

/** 关键字搜索：非分页树（整树已本地加载）用 el-tree 本地过滤、不打后端；分页源走后端条件查询；静态树用 el-tree 过滤 */
const dataSearch = () => {
  // APP 端本地分页模式：走 applyLocalPageOrSearch 实现（搜索 + 分页 + 层级筛选）
  if (localPageEnabled.value) {
    pageInfo.currentPage = 1;
    applyLocalPageOrSearch();
    return;
  }
  if (props.apiEndpoints || props.apiDataSource) {
    if (!effectivePageSize.value) {
      // 非分页远程（整树）：整树已本地加载，直接 el-tree 过滤（保留命中节点祖先），不再请求后端
      orgTreeRef.value?.filter(queryName.value || "");
    } else {
      // 分页远程：携带条件走后端查询
      loadData(
        queryName.value
          ? [createCondition(props.displayName, queryName.value, "lk")]
          : [],
        !!queryName.value,
      );
    }
  } else {
    orgTreeRef.value?.filter(queryName.value || "");
  }
};
const filterNode = (value: string, data: any): boolean => {
  if (!value) return true;
  return data[props.displayName].includes(value);
};
const open = () => {
  dialogVisible.value = true;
};
const close = () => {
  dialogVisible.value = false;
};
const onOpen = async () => {
  // 重置上次打开的残留状态
  queryName.value = "";
  checkAll.value = false;
  selectedHierarchyKey.value = "";
  await initOptions();
  initSelection();
  // 初始化层级筛选（不复制树，直接引用）
  initCascadeColumns();
  nextTick(() => {
    destroySortable();
    if (props.multiple) initSortable();
  });
};

/** 待选列表初始化：静态 data 直接使用（APP 端大数据启用本地分页），远程模式请求接口 */
const initOptions = async () => {
  dataOrgOptions.value = [];
  if (props.data?.length > 0) {
    // APP 端大数据（>= 500 叶子）时，启用客户端分页 + 延迟渲染
    const leafCount = countLeafNodes(props.data);
    localPageEnabled.value =
      isMobile && !props.apiEndpoints && !props.apiDataSource && leafCount >= 500;
    if (localPageEnabled.value) {
      // 扁平化叶子，做分页
      localFlatLeaves.value = flattenLeafNodes(props.data);
      pageInfo.totalData = localFlatLeaves.value.length;
      pageInfo.pageSize = props.pageSize || 50;
      dataOrgOptions.value = getLocalPagedData();
    } else {
      dataOrgOptions.value = props.data;
      pageInfo.totalData = leafCount;
    }
  } else {
    await loadData();
  }
};

/** 已选初始化：从 props.modelValue 读取（浅拷贝，弹窗内操作不影响父组件状态） */
const initSelection = () => {
  const mv = props.modelValue;
  dataOptions.value = Array.isArray(mv) ? [...mv] : mv ? [mv] : [];
  activeIndex.value = -1;
};

/** 计算树中叶子节点总数 */
const countLeafNodes = (nodes: any[]): number => {
  let count = 0;
  const walk = (arr: any[]) => {
    for (const n of arr) {
      if (n.children?.length > 0) walk(n.children);
      else count++;
    }
  };
  walk(nodes || []);
  return count;
};

/** 扁平化所有叶子节点 */
const flattenLeafNodes = (nodes: any[]): any[] => {
  const leaves: any[] = [];
  const walk = (arr: any[]) => {
    for (const n of arr) {
      if (n.children?.length > 0) walk(n.children);
      else leaves.push(n);
    }
  };
  walk(nodes || []);
  return leaves;
};

/** 获取本地当前分页数据（返回扁平列表直接展示） */
const getLocalPagedData = (): any[] => {
  const start = (pageInfo.currentPage - 1) * (pageInfo.pageSize || 50);
  return localFlatLeaves.value.slice(start, start + (pageInfo.pageSize || 50));
};

/** 确认选择：多选回传全部已选，单选回传首项（统一数组形态），autoClose 时自动关闭 */
const handleConfirm = () => {
  const result = props.multiple
    ? [...dataOptions.value]
    : dataOptions.value.slice(0, 1);
  emits("update:modelValue", result);
  if (props.autoClose) {
    dialogVisible.value = false;
  }
};

/** 重置已选（弹窗重置按钮） */
const resetData = () => {
  dataOptions.value = [];
  activeIndex.value = -1;
};

/** 翻页/改页大小后刷新待选列表：本地分页走本地切片，远程走接口查询 */
const refreshList = () => {
  if (localPageEnabled.value) {
    applyLocalPageOrSearch();
  } else {
    dataSearch();
  }
};
const pageChangeClick = (val: number) => {
  pageInfo.currentPage = val;
  refreshList();
};
const pageSizeClick = (val: number) => {
  pageInfo.pageSize = val;
  pageInfo.currentPage = 1;
  refreshList();
};

/** APP 端本地搜索/分页：对已扁平化叶子过滤后再分页 */
const applyLocalPageOrSearch = () => {
  if (!localPageEnabled.value) return;
  let source = localFlatLeaves.value;
  if (queryName.value) {
    const kw = String(queryName.value).toLowerCase();
    source = localFlatLeaves.value.filter((it: any) => {
      const name = String(it[props.displayName] ?? "").toLowerCase();
      const code = String(it[props.displayCode] ?? "").toLowerCase();
      return name.includes(kw) || code.includes(kw);
    });
  }
  pageInfo.totalData = source.length;
  const start = (pageInfo.currentPage - 1) * (pageInfo.pageSize || 50);
  dataOrgOptions.value = source.slice(start, start + (pageInfo.pageSize || 50));
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
  <star-horse-panel
    :type="dialogType"
    :self-func="true"
    v-model="dialogVisible"
    @open="onOpen"
    @merge="handleConfirm"
    @resetForm="resetData"
    :full-screen="isMobile"
    @closeAction="dialogVisible = false"
    :draggable="true"
    :title="title || i18n('datapicker.selectData')"
    boxWidth="60%"
    boxHeight="70%"
  >
    <!-- ===== PC 端多选：左右 splitter 布局 ===== -->
    <el-splitter v-if="!isMobile && multiple" layout="horizontal">
      <el-splitter-panel collapsible min="50%">
        <el-card shadow="never" class="org-card dialog-body">
          <template #header>
            <div class="flex flex-row items-center w-full justify-between">
              <el-checkbox
                v-model="checkAll"
                class="!w-[30%]"
                v-if="multiple"
                @change="handleCheckAll"
              >
                {{ i18n("datapicker.selectAll") }}
              </el-checkbox>
              <div class="flex flex-row flex-1 items-center justify-center">
                {{ i18n("datapicker.pendingDataArea") }}
              </div>
            </div>
          </template>
          <div class="dp-search-bar">
            <el-input
              v-model="queryName"
              :placeholder="i18n('datapicker.enterKeywords')"
              clearable
              @keyup.enter="dataSearch"
              @clear="dataSearch"
              @input="onSearchInput"
            >
              <template #suffix>
                <div class="dp-search-btn" @click="dataSearch">
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
                      &nbsp;{{ displayText(data) }}
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
                    displayText(item)
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
                    @click.stop="removeItem(item)"
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

    <!-- ===== PC 端非多选：仅显示待选数据 ===== -->
    <el-card v-else-if="!isMobile" shadow="never" class="org-card dialog-body">
      <template #header>
        <div class="flex flex-row items-center w-full justify-center">
          {{ i18n("datapicker.pendingDataArea") }}
        </div>
      </template>
      <div class="dp-search-bar">
        <el-input
          v-model="queryName"
          :placeholder="i18n('datapicker.enterKeywords')"
          clearable
          @keyup.enter="dataSearch"
          @clear="dataSearch"
          @input="onSearchInput"
        >
          <template #suffix>
            <div class="dp-search-btn" @click="dataSearch">
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
                  &nbsp;{{ displayText(data) }}
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
        v-model:page-count="pageInfo.totalPage"
      />
    </el-card>

    <!-- ===== APP 端：头部搜索+层级下拉 + 数据列表 + 底部选择栏 ===== -->
    <div v-else class="dp-mobile">
      <!-- 头部：搜索框 + 层级筛选按钮（Popover 承载筛选面板） -->
      <div class="dp-mobile-header">
        <div class="dp-search-bar dp-mobile-header__search">
          <el-input
            v-model="queryName"
            :placeholder="i18n('datapicker.enterKeywords')"
            clearable
            @keyup.enter="dataSearch"
            @clear="dataSearch"
            @input="onSearchInput"
          >
            <template #suffix>
              <div class="dp-search-btn" @click="dataSearch">
                <star-horse-icon iconClass="search" />
              </div>
            </template>
          </el-input>
        </div>
        <el-popover
          v-if="enableHierarchy && fullTreeData.length > 0"
          v-model:visible="hierarchyExpanded"
          placement="bottom-start"
          trigger="click"
          popper-class="dp-hierarchy-popover"
          :offset="4"
          width="100%"
          :show-arrow="false"
          :close-on-click-modal="true"
        >
          <!-- Popover 内容：层级筛选面板 -->
          <div class="dp-hierarchy-popover__content">
            <!-- 级联面板模式（≥3 级树，如省/市/区/街道） -->
            <div v-if="hierarchyPanelMode" class="dp-mobile-hierarchy__panel">
              <div class="dp-mobile-hierarchy__panel-cols">
                <el-scrollbar
                  v-for="(colNodes, colIdx) in cascadeColumns"
                  :key="colIdx"
                  class="dp-mobile-hierarchy__panel-col"
                  tag="div"
                >
                  <div
                    v-for="n in colNodes"
                    :key="n[displayValue]"
                    class="dp-cascade-item"
                    :class="{
                      'is-active':
                        cascadeSelectedKeys[colIdx] === n[displayValue],
                    }"
                    @click="onCascadeNodeClick(n, colIdx)"
                  >
                    <span class="dp-cascade-item__label">{{
                      n[displayName]
                    }}</span>
                    <star-horse-icon
                      v-if="n.children?.length > 0"
                      icon-class="arrow-right"
                      size="12px"
                    />
                  </div>
                </el-scrollbar>
              </div>
            </div>
            <!-- 树形模式（<3 级树，用 el-tree，只展示分类节点） -->
            <el-scrollbar v-else class="dp-mobile-hierarchy__tree">
              <el-tree
                :node-key="displayValue"
                :data="hierarchyTreeData"
                :props="{
                  label: displayName ?? 'name',
                  value: displayValue ?? 'value',
                  children: 'children',
                }"
                :default-expanded-keys="expandedKeys"
                :current-node-key="selectedHierarchyKey"
                highlight-current
                @node-click="onHierarchyClick"
              >
                <template #default="{ data }">
                  <div
                    class="dp-hierarchy-node"
                    :class="{
                      'is-active': selectedHierarchyKey === data[displayValue],
                    }"
                  >
                    <star-horse-icon
                      :icon-class="
                        data.children?.length > 0 ? 'folder' : 'document'
                      "
                      size="14px"
                    />
                    <span class="dp-hierarchy-node__label">{{
                      data[displayName]
                    }}</span>
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>

            <!-- 底部操作栏：重置 + 完成 -->
            <div class="dp-mobile-hierarchy__actions">
              <button
                v-if="selectedHierarchyKey"
                class="dp-mobile-hierarchy__btn dp-mobile-hierarchy__btn--reset"
                @click="
                  hierarchyPanelMode
                    ? clearCascadeFilter()
                    : (selectedHierarchyKey = '')
                "
              >
                {{ i18n("common.reset") }}
              </button>
              <button
                class="dp-mobile-hierarchy__btn dp-mobile-hierarchy__btn--confirm"
                @click="hierarchyExpanded = false"
              >
                {{ i18n("common.yes") }}
              </button>
            </div>
          </div>

          <!-- Popover 触发锚点：筛选按钮 -->
          <template #reference>
            <div
              class="dp-mobile-header__filter"
              :class="{
                'is-active': hierarchyExpanded || selectedHierarchyKey,
              }"
            >
              <star-horse-icon iconClass="filter" size="16px" />
              <span
                v-if="selectedHierarchyKey"
                class="dp-mobile-header__filter-label"
              >
                {{
                  findNodeByKey(fullTreeData, selectedHierarchyKey)?.[
                    displayName
                  ]
                }}
              </span>
              <span v-else class="dp-mobile-header__filter-label">{{
                i18n("datapicker.hierarchyFilter")
              }}</span>
              <star-horse-icon
                :icon-class="hierarchyExpanded ? 'arrow-up' : 'arrow-down'"
                size="12px"
              />
            </div>
          </template>
        </el-popover>
      </div>

      <!-- 主体：数据列表（全宽） -->
      <div class="dp-mobile-content">
        <!-- 全选 + 筛选标签 -->
        <div v-if="multiple" class="dp-mobile-checkall">
          <el-checkbox
            v-model="checkAll"
            @change="handleCheckAll"
          >
            {{ i18n("datapicker.selectAll") }}
          </el-checkbox>
          <el-tag
            v-if="selectedHierarchyKey"
            size="small"
            type="info"
            effect="plain"
            closable
            @close="
              hierarchyPanelMode
                ? clearCascadeFilter()
                : (selectedHierarchyKey = '')
            "
          >
            {{
              findNodeByKey(fullTreeData, selectedHierarchyKey)?.[displayName]
            }}
          </el-tag>
        </div>

        <el-scrollbar tag="div" class="dp-mobile-tree">
          <el-tree
            ref="orgTreeRef"
            :node-key="displayValue"
            :data="filteredDataOrgOptions"
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
                    &nbsp;{{ displayText(data) }}
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
          v-if="pageSize > 0 || localPageEnabled"
          :total="pageInfo.totalData"
          @current-change="pageChangeClick"
          @size-change="pageSizeClick"
          :size="compSize"
          layout="total, prev, pager, next"
          v-model:currentPage="pageInfo.currentPage"
          v-model:page-size="pageInfo.pageSize"
          v-model:page-count="pageInfo.totalPage"
          :small="true"
        />
      </div>

      <!-- 底部已选数据栏（浮动覆盖待选区，不压缩高度） -->
      <div
        v-if="multiple"
        class="dp-mobile-selected-bar"
        :class="{ 'is-expanded': selectedBarExpanded }"
        :style="selectedBarExpanded ? { height: selectedBarHeight + 'px' } : {}"
      >
        <!-- 拖拽手柄：展开时显示，拖动改变高度 -->
        <div
          v-if="selectedBarExpanded"
          class="dp-mobile-selected-bar__drag"
          @pointerdown="onDragStart"
        >
          <span class="dp-mobile-selected-bar__drag-icon"></span>
        </div>
        <div class="dp-mobile-selected-bar__header">
          <span class="dp-mobile-selected-bar__count">
            {{ i18n("datapicker.selectedCount") }}（{{ dataOptions.length }}）
          </span>

          <div class="dp-mobile-selected-bar__toggle">
            <div
              class="dp-mobile-selected-bar__search"
              v-if="selectedBarExpanded"
            >
              <el-input
                v-model="selectedQuery"
                :placeholder="i18n('datapicker.enterKeywords')"
                clearable
                size="small"
              >
                <template #suffix>
                  <div class="dp-search-btn">
                    <star-horse-icon iconClass="search" />
                  </div>
                </template>
              </el-input>
            </div>
            <div
              class="flex flex-row items-center"
              @click="selectedBarExpanded = !selectedBarExpanded"
            >
              <span v-if="!selectedBarExpanded">{{
                i18n("datapicker.expand")
              }}</span>
              <span v-else>{{ i18n("datapicker.collapse") }}</span>
              <star-horse-icon
                :icon-class="selectedBarExpanded ? 'arrow-down' : 'arrow-up'"
                size="14px"
              />
            </div>
          </div>
        </div>
        <div v-show="selectedBarExpanded" class="dp-mobile-selected-bar__body">
          <el-scrollbar tag="div" class="dp-mobile-selected-list">
            <div
              v-for="item in filteredSelectedItems"
              :key="item[displayValue]"
              class="dp-mobile-selected-item"
              @click="onSelectedItemClick(item)"
            >
              <span class="dp-mobile-selected-item__label">{{
                displayText(item)
              }}</span>
              <star-horse-icon
                icon-class="close"
                class="dp-mobile-selected-item__remove"
                @click.stop="removeItem(item)"
              />
            </div>
            <div
              v-if="filteredSelectedItems.length === 0"
              class="dp-mobile-selected-bar__empty"
            >
              {{ i18n("datapicker.noData") }}
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </star-horse-panel>
</template>

<style scoped lang="scss">
:deep {
  .el-tree {
    --el-tree-node-content-height: 36px;

    .el-tree-node__content {
      border-radius: 8px;
      margin: 1px 0;
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
    padding: 8px 10px !important;
  }

  :deep(.el-card__body) {
    padding: 0 !important;
  }
}

.org-tree {
  height: 100%;
  padding: 4px;
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

/* ===== 搜索框 ===== */
.dp-search-bar {
  padding: 4px 10px 6px;

  :deep(.el-input__wrapper) {
    border-radius: 8px;
  }

  :deep(.el-input__suffix) {
    cursor: pointer;
  }

  :deep(.el-input__suffix-inner) {
    color: var(--el-text-color-placeholder, #c0c4cc);
    font-size: 16px;
  }
}

/* 搜索按钮 */
.dp-search-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--el-text-color-placeholder, #c0c4cc);
  transition: color 0.2s;

  &:active {
    color: var(--el-color-primary);
  }
}

/* ===== 已选数据列表 ===== */
.selected-list {
  outline: none;
  min-height: 100%;
}

.selected-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  margin: 1px 0;
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
  gap: 6px;
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
  gap: 1px;
  flex-shrink: 0;
  margin-left: 2px;
  color: var(--el-text-color-regular);
  opacity: 0;
  transition: opacity 0.2s;

  .el-icon {
    cursor: pointer;
    border-radius: 4px;
    padding: 2px;

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

/* Sortable 样式 */
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

/* ===== 移动端布局 ===== */
.dp-mobile {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* 头部：搜索框 + 层级筛选按钮 */
.dp-mobile-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px 4px;
  flex-shrink: 0;
}

.dp-mobile-header__search {
  flex: 1;
  padding: 0;
}

.dp-mobile-header__filter {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  background: var(--el-fill-color-lighter);
  cursor: pointer;
  font-size: 12px;
  color: var(--el-text-color-regular);
  transition: all 0.15s;
  max-width: 120px;

  &:active,
  &.is-active {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
  }
}

.dp-mobile-header__filter-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70px;
}

/* 级联面板样式 */
.dp-mobile-hierarchy__panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.dp-mobile-hierarchy__panel-cols {
  flex: 1;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  min-height: 200px;
}

.dp-mobile-hierarchy__panel-col {
  flex: 0 0 100px;
  min-width: 150px;
  border-right: 1px solid var(--el-border-color-lighter);
  overflow: hidden;
  height: 500px;

  &:last-child {
    border-right: none;
    flex: 1 1 120px;
    width: auto;
  }
}

.dp-cascade-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 8px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  margin: 1px 3px;
  transition:
    background 0.15s,
    color 0.15s;
  white-space: nowrap;
  overflow: hidden;

  &:hover,
  &:active {
    background: var(--el-fill-color);
  }

  &.is-active {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    font-weight: 500;
  }
}

.dp-cascade-item__label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 2px;
}

.dp-mobile-hierarchy__panel-clear {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 5px 0;
  font-size: 11px;
  color: var(--el-text-color-placeholder);
  border-top: 1px solid var(--el-border-color-lighter);
  cursor: pointer;

  &:hover,
  &:active {
    color: var(--el-color-danger);
  }
}

.dp-mobile-hierarchy__tree {
  flex: 1;
  overflow: hidden;
  min-height: 200px;
  max-height: 500px;
}

/* 底部操作栏 */
.dp-mobile-hierarchy__actions {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  padding: 6px 10px 8px;
  border-top: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-lighter);
  justify-content: flex-end;
}

.dp-mobile-hierarchy__btn {
  padding: 6px 14px;
  font-size: 12px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s;

  &--reset {
    background: var(--el-bg-color);
    border-color: var(--el-border-color);
    color: var(--el-text-color-regular);

    &:active {
      color: var(--el-color-danger);
      border-color: var(--el-color-danger);
    }
  }

  &--confirm {
    background: var(--el-color-primary);
    border-color: var(--el-color-primary);
    color: #fff;
    font-weight: 500;

    &:active {
      opacity: 0.85;
    }
  }
}

.dp-hierarchy-node {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;

  &.is-active,
  &:active {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }

  &:hover {
    background: var(--el-fill-color);
  }
}

.dp-hierarchy-node__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 数据列表区 */
.dp-mobile-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.dp-mobile-checkall {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 5px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  flex-shrink: 0;
  flex-wrap: nowrap;
  overflow: hidden;

  .el-tag {
    flex-shrink: 0;
    max-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.dp-filter-clear {
  cursor: pointer;
  margin-left: 2px;
  flex-shrink: 0;
}

.dp-mobile-tree {
  flex: 1;
  overflow: hidden;
}

/* 底部已选栏（浮动覆盖待选区，不压缩待选区高度） */
.dp-mobile-selected-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 80;
  border-top: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  display: flex;
  flex-direction: column;
  /* 收起时只显示 header 高度 */
  height: auto;
  /* 展开时由 inline style 设置 height */
  &.is-expanded {
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 12px 12px 0 0;
  }
}

/* 拖拽手柄 */
.dp-mobile-selected-bar__drag {
  flex-shrink: 0;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ns-resize;
  border-bottom: 1px solid var(--el-border-color-lighter);
  /* 禁止浏览器默认触摸行为（滚动/长按），保证触屏拖拽顺畅 */
  touch-action: none;

  &:active {
    background: var(--el-fill-color);
  }
}

.dp-mobile-selected-bar__drag-icon {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--el-text-color-disabled);
}

.dp-mobile-selected-bar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 6px;
  cursor: pointer;
  gap: 5px;
  flex-shrink: 0;
}

.dp-mobile-selected-bar__count {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.dp-mobile-selected-bar__toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--el-color-primary);
}

.dp-mobile-selected-bar__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 120px;
}

.dp-mobile-selected-bar__search {
  padding: 6px 10px 4px;
  min-width: 100px;
  max-width: 180px;

  :deep(.el-input__wrapper) {
    border-radius: 6px;
  }
}

.dp-mobile-selected-list {
  flex: 1;
  overflow: hidden;
  padding: 0 8px;
}

.dp-mobile-selected-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  margin: 2px 0;
  border-radius: 6px;
  background: var(--el-fill-color-lighter);
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: var(--el-fill-color);
  }
}

.dp-mobile-selected-item__label {
  flex: 1;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dp-mobile-selected-item__remove {
  cursor: pointer;
  color: var(--el-text-color-placeholder);
  flex-shrink: 0;

  &:hover {
    color: var(--el-color-danger);
  }
}

.dp-mobile-selected-bar__empty {
  text-align: center;
  padding: 20px 0;
  color: var(--el-text-color-placeholder);
  font-size: 13px;
}

.dp-mobile-selected-bar__confirm {
  flex-shrink: 0;
  margin: 8px 14px 12px;
  padding: 10px 16px;
  background: var(--el-color-primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  &:active {
    opacity: 0.85;
  }
}

/* ===== 移动端紧凑适配 ===== */
@media (max-width: 768px) {
  :deep {
    .el-tree {
      --el-tree-node-content-height: 32px;

      .el-tree-node__content {
        margin: 0;
      }
    }
  }

  .dp-search-bar {
    padding: 2px 6px 4px;
    flex-shrink: 0;

    :deep(.el-input__wrapper) {
      height: 34px;
    }
  }

  .dp-mobile-header__filter {
    padding: 4px 8px;
    max-width: 100px;
  }

  .dp-mobile-selected-bar__header {
    padding: 8px 12px;
  }

  .dp-mobile-selected-bar__search {
    padding: 4px 8px 2px;
  }

  .dp-mobile-selected-bar__confirm {
    margin: 6px 12px 10px;
    padding: 8px 14px;
    font-size: 14px;
  }

  .dp-mobile-selected-item {
    padding: 6px 8px;
  }

  .dp-mobile-selected-item__label {
    font-size: 12px;
  }

  .org-tree {
    padding: 2px;
  }
}
</style>

<style lang="scss">
/* el-popover 通过 popper-class 挂到 body 下，需要全局样式（非 scoped） */
.dp-hierarchy-popover.el-popover {
  --el-popover-padding: 0;
  padding: 0 !important;
  border-radius: 8px !important;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.06);
  /* 宽高由内容撑开，仅设上限防止超出视口 */
  max-width: calc(100vw - 16px) !important;
  max-height: calc(100vh - 120px) !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dp-hierarchy-popover .dp-hierarchy-popover__content {
  /* 不设固定宽度，让级联列自然撑开 */
  width: auto;
  max-width: calc(100vw - 16px);
  /* 高度由内容决定，仅设上限 */
  max-height: calc(100vh - 120px);
  min-width: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--el-bg-color);
  border-radius: 8px;
}
</style>
