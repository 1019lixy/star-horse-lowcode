import { computed, ref } from "vue";
import type {
  DropZone,
  EditorGroup,
  FileNode,
  SplitNode,
  SplitSide,
  TabInfo,
} from "./types";
import { detectLanguage } from "./constants";

let groupIdCounter = 0;
let nodeIdCounter = 0;

const genGroupId = () => `eg-${++groupIdCounter}`;
const genNodeId = () => `sn-${++nodeIdCounter}`;

/**
 * 编辑器分组管理：维护分屏树（SplitNode）与组列表（EditorGroup）。
 * 一个组对应一个 Monaco 编辑器实例，组之间通过共享 fileId 实现模型复用。
 */
export function useEditorGroups(opts?: {
  /** 由父级提供的：根据 id 获取文件节点 */
  findNode?: (id: string) => FileNode | undefined;
  /** 由父级提供的：获取父目录路径 */
  getParentPath?: (id: string) => string;
}) {
  const findNode = (id: string) => opts?.findNode?.(id);
  const getParentPath = (id: string) => opts?.getParentPath?.(id) || "";

  // 初始化：单个根节点 + 单个组
  const rootGroupId = genGroupId();
  const groups = ref<Record<string, EditorGroup>>({
    [rootGroupId]: { id: rootGroupId, tabs: [], activeTabId: "" },
  });
  const splitRoot = ref<SplitNode>({
    id: genNodeId(),
    groupId: rootGroupId,
  });
  const activeGroupId = ref(rootGroupId);
  /** 当前聚焦的 tabId（用于跨组高亮、状态展示） */
  const activeTabId = ref("");

  // ============== 工具方法 ==============
  const getGroup = (gid: string) => groups.value[gid];

  /** 深拷贝分屏树（用于触发响应式更新） */
  const cloneTree = (node: SplitNode): SplitNode => ({
    ...node,
    children: node.children
      ? [cloneTree(node.children[0]), cloneTree(node.children[1])]
      : undefined,
  });

  /** 收集树中所有叶子节点（组ID） */
  const collectLeafGroupIds = (
    node: SplitNode,
    out: string[] = [],
  ): string[] => {
    if (node.groupId) {
      out.push(node.groupId);
    } else if (node.children) {
      collectLeafGroupIds(node.children[0], out);
      collectLeafGroupIds(node.children[1], out);
    }
    return out;
  };

  /** 在树中查找包含目标组的节点及其父节点 */
  const findNodeByGroupId = (
    node: SplitNode,
    gid: string,
    parent: SplitNode | null = null,
  ): { node: SplitNode; parent: SplitNode | null } | null => {
    if (node.groupId === gid) return { node, parent };
    if (node.children) {
      const l = findNodeByGroupId(node.children[0], gid, node);
      if (l) return l;
      const r = findNodeByGroupId(node.children[1], gid, node);
      if (r) return r;
    }
    return null;
  };

  /** 获取所有组的扁平列表（按树中顺序） */
  const allGroups = computed(() => collectLeafGroupIds(splitRoot.value));

  /** 获取当前活动组的对象 */
  const activeGroup = computed(() => groups.value[activeGroupId.value]);

  // ============== 标签页管理 ==============

  /** 在指定组中打开文件（若已存在则切换，否则添加） */
  const openFileInGroup = (gid: string, file: FileNode) => {
    const group = groups.value[gid];
    if (!group) return;
    let tab = group.tabs.find((t) => t.id === file.idCodeFile);
    if (!tab) {
      tab = {
        id: file.idCodeFile,
        name: file.name,
        language: file.language || detectLanguage(file.name),
        modified: false,
        path: getParentPath(file.idCodeFile),
      };
      group.tabs.push(tab);
    }
    group.activeTabId = file.idCodeFile;
    activeGroupId.value = gid;
    activeTabId.value = file.idCodeFile;
  };

  /** 在活动组中打开文件 */
  const openFile = (file: FileNode) => {
    openFileInGroup(activeGroupId.value, file);
  };

  /** 关闭组内指定标签页 */
  const closeTabInGroup = (gid: string, tabId: string) => {
    const group = groups.value[gid];
    if (!group) return;
    const idx = group.tabs.findIndex((t) => t.id === tabId);
    if (idx === -1) return;
    group.tabs.splice(idx, 1);
    if (group.activeTabId === tabId) {
      group.activeTabId =
        group.tabs.length > 0
          ? group.tabs[Math.min(idx, group.tabs.length - 1)].id
          : "";
    }
    if (activeTabId.value === tabId) {
      activeTabId.value = group.activeTabId;
    }
  };

  /** 关闭组内其他标签页 */
  const closeOthersInGroup = (gid: string, keepTabId: string) => {
    const group = groups.value[gid];
    if (!group) return;
    group.tabs = group.tabs.filter((t) => t.id === keepTabId);
    group.activeTabId = keepTabId;
    if (activeTabId.value !== keepTabId) activeTabId.value = keepTabId;
  };

  /** 切换组内激活的标签页 */
  const switchTabInGroup = (gid: string, tabId: string) => {
    const group = groups.value[gid];
    if (!group) return;
    group.activeTabId = tabId;
    activeGroupId.value = gid;
    activeTabId.value = tabId;
  };

  /** 设置活动组 */
  const setActiveGroup = (gid: string) => {
    if (groups.value[gid]) {
      activeGroupId.value = gid;
      const g = groups.value[gid];
      activeTabId.value = g.activeTabId;
    }
  };

  /** 标记指定 tab 为已修改/未修改（同步所有组中相同 tabId） */
  const setTabModified = (gid: string, tabId: string, modified: boolean) => {
    for (const g of Object.values(groups.value)) {
      const tab = g.tabs.find((t) => t.id === tabId);
      if (tab) tab.modified = modified;
    }
  };

  /** 刷新所有组中标签页的父路径信息（用于同名文件区分） */
  const refreshAllTabPaths = () => {
    for (const gid of Object.keys(groups.value)) {
      const g = groups.value[gid];
      for (const tab of g.tabs) {
        tab.path = getParentPath(tab.id);
      }
    }
  };

  /** 重命名 tab */
  const renameTab = (tabId: string, newName: string, language?: string) => {
    for (const gid of Object.keys(groups.value)) {
      const g = groups.value[gid];
      const tab = g.tabs.find((t) => t.id === tabId);
      if (tab) {
        tab.name = newName;
        if (language) tab.language = language;
      }
    }
    refreshAllTabPaths();
  };

  /** 收集所有打开的标签页（去重，按 fileId） */
  const getAllOpenTabs = (): TabInfo[] => {
    const seen = new Set<string>();
    const out: TabInfo[] = [];
    for (const gid of Object.keys(groups.value)) {
      for (const t of groups.value[gid].tabs) {
        if (!seen.has(t.id)) {
          seen.add(t.id);
          out.push(t);
        }
      }
    }
    return out;
  };

  /** 关闭所有组中匹配的标签页（用于文件删除时） */
  const closeTabsByFileId = (fileId: string) => {
    for (const gid of Object.keys(groups.value)) {
      const g = groups.value[gid];
      while (true) {
        const idx = g.tabs.findIndex((t) => t.id === fileId);
        if (idx === -1) break;
        closeTabInGroup(gid, fileId);
      }
    }
  };

  // ============== 分屏操作 ==============

  /**
   * 在指定组旁边拆分出新组。
   * @param fromGid 源组
   * @param side 拆分方向（相对源组）
   * @param copyTabId 若提供，则将该 tab 复制到新组（源组保留，两组共享同一 Monaco model）
   * @returns 新组ID
   */
  const splitGroup = (
    fromGid: string,
    side: SplitSide,
    copyTabId?: string,
  ): string => {
    const found = findNodeByGroupId(splitRoot.value, fromGid);
    if (!found) return "";

    const newGid = genGroupId();
    groups.value[newGid] = { id: newGid, tabs: [], activeTabId: "" };

    // splitRight/splitDown: 新组在后；splitLeft/splitUp: 新组在前
    const isAfter = side === "right" || side === "down";
    const dir: "horizontal" | "vertical" =
      side === "left" || side === "right" ? "horizontal" : "vertical";

    // 将源叶子节点替换为容器节点
    const oldLeaf: SplitNode = { ...found.node };
    const newLeaf: SplitNode = { id: genNodeId(), groupId: newGid };
    const firstChild = isAfter ? oldLeaf : newLeaf;
    const secondChild = isAfter ? newLeaf : oldLeaf;

    found.node.direction = dir;
    found.node.groupId = undefined;
    found.node.children = [firstChild, secondChild];
    found.node.size = 0.5;

    // 复制 tab 到新组（源组保留，两组共享同一 Monaco model）
    if (copyTabId) {
      const srcGroup = groups.value[fromGid];
      const dstGroup = groups.value[newGid];
      const tab = srcGroup?.tabs.find((t) => t.id === copyTabId);
      if (tab) {
        dstGroup.tabs.push({ ...tab });
        dstGroup.activeTabId = copyTabId;
      }
    }

    // 触发响应式更新
    splitRoot.value = cloneTree(splitRoot.value);
    activeGroupId.value = newGid;
    if (groups.value[newGid].activeTabId) {
      activeTabId.value = groups.value[newGid].activeTabId;
    }
    return newGid;
  };

  /**
   * 将 tab 从源组移动到目标组。
   * @param fromGid 源组
   * @param tabId 标签页ID
   * @param toGid 目标组
   * @param toIndex 插入位置（末尾则省略）
   */
  const moveTab = (
    fromGid: string,
    tabId: string,
    toGid: string,
    toIndex?: number,
  ) => {
    if (fromGid === toGid) return;
    const src = groups.value[fromGid];
    const dst = groups.value[toGid];
    if (!src || !dst) return;
    const idx = src.tabs.findIndex((t) => t.id === tabId);
    if (idx === -1) return;
    const [tab] = src.tabs.splice(idx, 1);
    if (typeof toIndex === "number") {
      dst.tabs.splice(toIndex, 0, tab);
    } else {
      dst.tabs.push(tab);
    }
    dst.activeTabId = tab.id;
    if (src.activeTabId === tabId) {
      src.activeTabId =
        src.tabs.length > 0
          ? src.tabs[Math.min(idx, src.tabs.length - 1)].id
          : "";
    }
    activeGroupId.value = toGid;
    activeTabId.value = tab.id;
  };

  /** 检查组是否可关闭（至少保留一个根组） */
  const canCloseGroup = (gid: string): boolean => {
    return Object.keys(groups.value).length > 1 && !!groups.value[gid];
  };

  /**
   * 关闭一个组：将其从树中移除，并把兄弟节点提升到父级位置。
   * 至少保留一个根组。
   */
  const closeGroup = (gid: string): boolean => {
    if (Object.keys(groups.value).length <= 1) return false;
    const found = findNodeByGroupId(splitRoot.value, gid);
    if (!found || !found.parent) return false;

    // 找到兄弟节点
    const parent = found.parent;
    if (!parent.children) return false;
    const sibling =
      parent.children[0].groupId === gid
        ? parent.children[1]
        : parent.children[0];

    // 把兄弟节点的内容提升到父节点位置
    parent.groupId = sibling.groupId;
    parent.direction = sibling.direction;
    parent.children = sibling.children;
    parent.size = sibling.size;

    // 删除组及其所有 tab
    delete groups.value[gid];

    // 触发响应式更新
    splitRoot.value = cloneTree(splitRoot.value);

    // 如果活动组被关闭，切换到第一个组
    if (activeGroupId.value === gid) {
      const first = collectLeafGroupIds(splitRoot.value)[0];
      if (first) {
        activeGroupId.value = first;
        activeTabId.value = groups.value[first]?.activeTabId || "";
      }
    }
    return true;
  };

  /**
   * 拖拽放置：根据 dropZone 决定移动 tab 或拆分新组。
   * @returns 操作是否成功
   */
  const handleDrop = (
    fromGid: string,
    tabId: string,
    toGid: string,
    zone: DropZone,
  ): boolean => {
    if (zone === "center") {
      moveTab(fromGid, tabId, toGid);
      return true;
    }
    // top->up, bottom->down
    const side: SplitSide =
      zone === "left"
        ? "left"
        : zone === "right"
          ? "right"
          : zone === "top"
            ? "up"
            : "down";
    // 先在 toGid 旁边拆分出新组（不携带 tab），再手动移动 tab 到新组
    const newGid = splitGroup(toGid, side);
    if (newGid) {
      moveTab(fromGid, tabId, newGid);
    }
    return true;
  };

  /** 获取下一个/上一个组（按树顺序） */
  const getAdjacentGroup = (gid: string, dir: "next" | "prev"): string => {
    const list = collectLeafGroupIds(splitRoot.value);
    const idx = list.indexOf(gid);
    if (idx === -1) return gid;
    if (dir === "next") return list[(idx + 1) % list.length];
    return list[(idx - 1 + list.length) % list.length];
  };

  /** 重置：清空所有组并恢复单个空组 */
  const reset = () => {
    const newGid = genGroupId();
    groups.value = { [newGid]: { id: newGid, tabs: [], activeTabId: "" } };
    splitRoot.value = { id: genNodeId(), groupId: newGid };
    activeGroupId.value = newGid;
    activeTabId.value = "";
  };

  return {
    // 状态
    splitRoot,
    groups,
    activeGroupId,
    activeTabId,
    activeGroup,
    allGroups,
    // 工具
    getGroup,
    findNode: (id: string) => findNode(id),
    // 标签页操作
    openFile,
    openFileInGroup,
    closeTabInGroup,
    closeOthersInGroup,
    switchTabInGroup,
    setActiveGroup,
    setTabModified,
    refreshAllTabPaths,
    renameTab,
    getAllOpenTabs,
    closeTabsByFileId,
    // 分屏操作
    splitGroup,
    moveTab,
    canCloseGroup,
    closeGroup,
    handleDrop,
    getAdjacentGroup,
    reset,
  };
}
