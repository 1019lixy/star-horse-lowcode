import { ref, type Ref } from "vue";
import type { FileNode } from "./types";
import { detectLanguage } from "./constants";
import { i18n } from "@/lang/index";

let _idCounter = 0;
const genId = () => `node-${Date.now()}-${++_idCounter}`;

export function useFileTree(initialFiles?: FileNode[]) {
  const tree: Ref<FileNode[]> = ref(
    initialFiles ? JSON.parse(JSON.stringify(initialFiles)) : [],
  );

  // ========== 查找 ==========

  const findNode = (
    id: string,
    nodes: FileNode[] = tree.value,
  ): FileNode | null => {
    for (const n of nodes) {
      if (n.idCodeFile === id) return n;
      if (n.children) {
        const f = findNode(id, n.children);
        if (f) return f;
      }
    }
    return null;
  };

  const findParent = (
    id: string,
    nodes: FileNode[] = tree.value,
  ): FileNode | null => {
    for (const n of nodes) {
      if (n.children?.some((c) => c.idCodeFile === id)) return n;
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

  // ========== 重名检测 ==========

  /** 检查同级目录下是否存在同名节点（排除指定id） */
  const hasDuplicateName = (
    parentId: string | null,
    name: string,
    excludeId?: string,
  ): boolean => {
    const container = getContainer(parentId);
    return container.some((n) => n.name === name && n.idCodeFile !== excludeId);
  };

  /** 获取同级目录下已有名称集合（排除指定id） */
  const getSiblingNames = (
    parentId: string | null,
    excludeId?: string,
  ): Set<string> => {
    const container = getContainer(parentId);
    return new Set(
      container.filter((n) => n.idCodeFile !== excludeId).map((n) => n.name),
    );
  };

  /** 在指定目录下生成唯一名称 */
  const generateUniqueName = (
    container: FileNode[],
    baseName: string,
    ext: string,
  ): string => {
    const existing = new Set(container.map((n) => n.name));
    let name = baseName + ext;
    let i = 1;
    while (existing.has(name)) {
      name = `${baseName}-${++i}${ext}`;
    }
    return name;
  };

  /** 对外暴露：在指定父目录下生成唯一名称 */
  const generateUniqueNameIn = (
    parentId: string | null,
    baseName: string,
    ext: string,
  ): string => {
    const container = getContainer(parentId);
    return generateUniqueName(container, baseName, ext);
  };

  // ========== 路径获取 ==========

  /** 获取节点从根到自身的完整路径（目录名数组） */
  const getNodePath = (id: string): string[] => {
    const path: string[] = [];
    const collectPath = (
      targetId: string,
      nodes: FileNode[],
      current: string[],
    ): boolean => {
      for (const n of nodes) {
        if (n.idCodeFile === targetId) {
          path.push(...current, n.name);
          return true;
        }
        if (
          n.children &&
          collectPath(targetId, n.children, [...current, n.name])
        ) {
          return true;
        }
      }
      return false;
    };
    collectPath(id, tree.value, []);
    return path;
  };

  /** 获取节点的父目录路径（用于标签页区分同名文件） */
  const getParentPath = (id: string): string => {
    const path = getNodePath(id);
    if (path.length <= 1) return "";
    return path.slice(0, -1).join("/");
  };

  /** 检测树中是否存在同名文件（不同目录下） */
  const hasSameNameElsewhere = (id: string, name: string): boolean => {
    const findByName = (nodes: FileNode[]): boolean => {
      for (const n of nodes) {
        if (n.type === "file" && n.name === name && n.idCodeFile !== id)
          return true;
        if (n.children && findByName(n.children)) return true;
      }
      return false;
    };
    return findByName(tree.value);
  };

  // ========== 创建 ==========

  const createFile = (parentId: string | null = null, name = ""): string => {
    const id = genId();
    const container = getContainer(parentId);
    const fileName = name || generateUniqueName(container, "untitled", ".txt");
    // 如果指定的名称已存在，生成唯一名称
    const finalName = hasDuplicateName(parentId, fileName)
      ? generateUniqueName(
          container,
          fileName.replace(/\.[^.]+$/, ""),
          fileName.match(/\.[^.]+$/)?.[0] || "",
        )
      : fileName;
    container.push({
      idCodeFile: id,
      name: finalName,
      type: "file",
      language: detectLanguage(finalName),
      content: "",
    });
    if (parentId) {
      const parent = findNode(parentId);
      if (parent) parent.type = "folder";
    }
    return id;
  };

  const createFolder = (parentId: string | null = null, name = ""): string => {
    const id = genId();
    const container = getContainer(parentId);
    const folderName =
      name || generateUniqueName(container, i18n("ide.newFolder"), "");
    const finalName = hasDuplicateName(parentId, folderName)
      ? generateUniqueName(container, folderName, "")
      : folderName;
    container.push({
      idCodeFile: id,
      name: finalName,
      type: "folder",
      children: [],
    });
    return id;
  };

  // ========== 删除 ==========

  const deleteNode = (id: string): boolean => {
    const removeFrom = (nodes: FileNode[]): boolean => {
      const idx = nodes.findIndex((n) => n.idCodeFile === id);
      if (idx !== -1) {
        nodes.splice(idx, 1);
        return true;
      }
      for (const n of nodes) {
        if (n.children && removeFrom(n.children)) return true;
      }
      return false;
    };
    return removeFrom(tree.value);
  };

  // ========== 重命名（带重名检测） ==========

  /** 重命名节点。返回 true 成功，false 表示重名或无效名称 */
  const renameNode = (id: string, newName: string): boolean => {
    const node = findNode(id);
    if (!node || !newName.trim()) return false;
    const trimmed = newName.trim();
    if (trimmed === node.name) return true; // 名称没变，视为成功

    const parent = findParent(id);
    const parentId = parent?.idCodeFile || null;
    if (hasDuplicateName(parentId, trimmed, id)) return false;

    node.name = trimmed;
    if (node.type === "file") node.language = detectLanguage(node.name);
    return true;
  };

  // ========== 确认新建（从 pending 状态，带重名检测） ==========

  /** 确认新建。返回 true 成功，false 表示重名或无效名称 */
  const confirmCreate = (id: string, name: string): boolean => {
    const node = findNode(id);
    if (!node || !name.trim()) return false;
    const trimmed = name.trim();

    const parent = findParent(id);
    const parentId = parent?.idCodeFile || null;
    if (hasDuplicateName(parentId, trimmed, id)) return false;

    node.name = trimmed;
    if (node.type === "file") node.language = detectLanguage(node.name);
    return true;
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

  const addNodes = (
    newNodes: FileNode[],
    parentId: string | null = null,
  ): void => {
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
      nodes.some(
        (n) =>
          n.idCodeFile === targetId || (n.children ? check(n.children) : false),
      );
    return check(ancestor.children);
  };

  /** 获取从根到指定节点的所有祖先ID（不含自身） */
  const getAncestorIds = (id: string): string[] => {
    const ids: string[] = [];
    const collect = (targetId: string, nodes: FileNode[]): boolean => {
      for (const n of nodes) {
        if (n.idCodeFile === targetId) return true;
        if (n.children && collect(targetId, n.children)) {
          ids.push(n.idCodeFile);
          return true;
        }
      }
      return false;
    };
    collect(id, tree.value);
    return ids;
  };

  // ========== 移动节点（拖拽，带重名检测） ==========

  /** 移动节点。返回 true 成功，false 表示循环、重名或无效 */
  const moveNode = (
    sourceId: string,
    targetFolderId: string | null,
  ): boolean => {
    if (sourceId === targetFolderId) return false;
    if (targetFolderId && isDescendant(sourceId, targetFolderId)) return false;

    const node = findNode(sourceId);
    if (!node) return false;

    // 检查目标目录下是否有同名节点
    if (hasDuplicateName(targetFolderId, node.name, sourceId)) return false;

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

  /**
   * 根据文件路径查找节点（路径格式：folder1/folder2/file.txt）
   */
  const findNodeByPath = (
    path: string,
    nodes: FileNode[] = tree.value,
  ): FileNode | null => {
    if (!path) return null;
    const parts = path.split("/").filter(Boolean);
    let currentNodes = nodes;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const found = currentNodes.find((n) => n.name === part);
      if (!found) return null;

      // 如果是最后一个部分，返回该节点
      if (i === parts.length - 1) return found;

      // 否则继续往下找
      if (found.type !== "folder" || !found.children) return null;
      currentNodes = found.children;
    }
    return null;
  };

  // ========== 递归收集所有文件（路径 + 内容） ==========

  const collectAllFiles = (
    nodes: FileNode[] = tree.value,
    prefix: string = "",
  ): { path: string; content: string; language: string; id: string }[] => {
    const result: {
      path: string;
      content: string;
      language: string;
      id: string;
    }[] = [];
    for (const node of nodes) {
      const currentPath = prefix ? `${prefix}/${node.name}` : node.name;
      if (node.type === "file") {
        result.push({
          path: currentPath,
          content: node.content || "",
          language: node.language || "plaintext",
          id: node.idCodeFile,
        });
      } else if (node.children) {
        result.push(...collectAllFiles(node.children, currentPath));
      }
    }
    return result;
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
    getAncestorIds,
    moveNode,
    hasDuplicateName,
    getSiblingNames,
    getNodePath,
    getParentPath,
    hasSameNameElsewhere,
    generateUniqueNameIn,
    findNodeByPath,
    collectAllFiles,
  };
}
