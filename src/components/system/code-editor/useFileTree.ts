import { ref, type Ref } from "vue";
import type { FileNode } from "./types";
import { detectLanguage } from "./constants";

let _idCounter = 0;
const genId = () => `node-${Date.now()}-${++_idCounter}`;

export function useFileTree(initialFiles?: FileNode[]) {
  const tree: Ref<FileNode[]> = ref(initialFiles ? JSON.parse(JSON.stringify(initialFiles)) : []);

  // ========== 查找 ==========

  const findNode = (id: string, nodes: FileNode[] = tree.value): FileNode | null => {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) {
        const f = findNode(id, n.children);
        if (f) return f;
      }
    }
    return null;
  };

  const findParent = (id: string, nodes: FileNode[] = tree.value): FileNode | null => {
    for (const n of nodes) {
      if (n.children?.some(c => c.id === id)) return n;
      if (n.children) {
        const f = findParent(id, n.children);
        if (f) return f;
      }
    }
    return null;
  };

  const getContainer = (parentId: string | null): FileNode[] => {
    if (!parentId) return tree.value;
    const parent = findNode(parentId);
    if (!parent || parent.type !== "folder") return tree.value;
    if (!parent.children) parent.children = [];
    return parent.children;
  };

  // ========== 创建 ==========

  const createFile = (parentId: string | null = null, name = ""): string => {
    const id = genId();
    const container = getContainer(parentId);
    const fileName = name || generateUniqueName(container, "untitled", ".txt");
    container.push({ id, name: fileName, type: "file", language: detectLanguage(fileName), content: "" });
    if (parentId) {
      const parent = findNode(parentId);
      if (parent) parent.type = "folder";
    }
    return id;
  };

  const createFolder = (parentId: string | null = null, name = ""): string => {
    const id = genId();
    const container = getContainer(parentId);
    const folderName = name || generateUniqueName(container, "新建文件夹", "");
    container.push({ id, name: folderName, type: "folder", children: [] });
    return id;
  };

  const generateUniqueName = (container: FileNode[], baseName: string, ext: string): string => {
    const existing = new Set(container.map(n => n.name));
    let name = baseName + ext;
    let i = 1;
    while (existing.has(name)) {
      name = `${baseName}-${++i}${ext}`;
    }
    return name;
  };

  // ========== 删除 ==========

  const deleteNode = (id: string): boolean => {
    const removeFrom = (nodes: FileNode[]): boolean => {
      const idx = nodes.findIndex(n => n.id === id);
      if (idx !== -1) { nodes.splice(idx, 1); return true; }
      for (const n of nodes) {
        if (n.children && removeFrom(n.children)) return true;
      }
      return false;
    };
    return removeFrom(tree.value);
  };

  // ========== 重命名 ==========

  const renameNode = (id: string, newName: string): void => {
    const node = findNode(id);
    if (!node || !newName.trim()) return;
    node.name = newName.trim();
    if (node.type === "file") node.language = detectLanguage(node.name);
  };

  // ========== 确认新建（从 pending 状态） ==========

  const confirmCreate = (id: string, name: string): void => {
    const node = findNode(id);
    if (!node || !name.trim()) return;
    node.name = name.trim();
    if (node.type === "file") node.language = detectLanguage(node.name);
  };

  // ========== 取消（删除 pending 节点） ==========

  const cancelCreate = (id: string): void => {
    deleteNode(id);
  };

  // ========== 更新文件内容 ==========

  const updateFileContent = (id: string, content: string): void => {
    const node = findNode(id);
    if (node && node.type === "file") node.content = content;
  };

  // ========== 获取文件内容 ==========

  const getFileContent = (id: string): string => {
    return findNode(id)?.content || "";
  };

  // ========== 查找第一个文件 ==========

  const findFirstFile = (nodes: FileNode[] = tree.value): FileNode | null => {
    for (const n of nodes) {
      if (n.type === "file") return n;
      if (n.children) {
        const f = findFirstFile(n.children);
        if (f) return f;
      }
    }
    return null;
  };

  // ========== 批量添加节点 ==========

  const addNodes = (newNodes: FileNode[], parentId: string | null = null): void => {
    const container = getContainer(parentId);
    container.push(...newNodes);
  };

  // ========== 替换整棵树（从后端加载） ==========

  const replaceTree = (newTree: FileNode[]): void => {
    tree.value = newTree;
  };

  // ========== 祖先检测（拖拽防循环） ==========

  const isDescendant = (ancestorId: string, targetId: string): boolean => {
    const ancestor = findNode(ancestorId);
    if (!ancestor || !ancestor.children) return false;
    const check = (nodes: FileNode[]): boolean =>
      nodes.some(n => n.id === targetId || (n.children ? check(n.children) : false));
    return check(ancestor.children);
  };

  // ========== 移动节点（拖拽） ==========

  const moveNode = (sourceId: string, targetFolderId: string | null): boolean => {
    if (sourceId === targetFolderId) return false;
    if (targetFolderId && isDescendant(sourceId, targetFolderId)) return false;

    const node = findNode(sourceId);
    if (!node) return false;
    const clone: FileNode = JSON.parse(JSON.stringify(node));

    // 先从原位置删除
    deleteNode(sourceId);

    // 再插入目标位置
    if (targetFolderId) {
      const target = findNode(targetFolderId);
      if (!target || target.type !== "folder") return false;
      if (!target.children) target.children = [];
      target.children.push(clone);
    } else {
      tree.value.push(clone);
    }
    return true;
  };

  return {
    tree,
    findNode,
    findParent,
    createFile,
    createFolder,
    deleteNode,
    renameNode,
    confirmCreate,
    cancelCreate,
    updateFileContent,
    getFileContent,
    findFirstFile,
    addNodes,
    replaceTree,
    isDescendant,
    moveNode,
  };
}
