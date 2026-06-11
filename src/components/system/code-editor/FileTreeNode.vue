<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import type { FileNode } from "./types";
import { getFileIcon, FOLDER_ICONS } from "./constants";
import { i18n } from "@/lang/index";

const props = defineProps<{
  node: FileNode;
  depth: number;
  expanded: Set<string>;
  activeId: string;
  editingNodeId: string | null;
  draggingId: string | null;
  dropTargetId: string | null;
  /** 紧凑目录：被隐藏的节点ID */
  compactHidden?: Set<string>;
  /** 紧凑目录：节点ID -> 合并显示路径 */
  compactLabels?: Map<string, string>;
  /** 已修改文件ID集合 */
  modifiedFiles?: Set<string>;
  /** 紧凑目录：节点ID -> 合并的目录链 */
  compactChains?: Map<string, { id: string; name: string }[]>;
}>();

const emit = defineEmits<{
  toggle: [id: string];
  select: [file: FileNode];
  contextmenu: [node: FileNode, event: MouseEvent];
  "edit-confirm": [id: string, name: string];
  "edit-cancel": [id: string];
  "drag-start": [id: string];
  "drag-end": [];
  drop: [sourceId: string, targetFolderId: string];
  /** 紧凑目录拖拽选择：需要用户选择放到哪个中间目录 */
  "compact-drop-select": [sourceId: string, targetNodeId: string, chain: { id: string; name: string }[], position: { x: number; y: number }];
}>();

const isFolder = props.node.type === "folder";
const isExpanded = () => props.expanded.has(props.node.idCodeFile);
const isActive = () => props.node.idCodeFile === props.activeId;
const isDragging = computed(() => props.draggingId === props.node.idCodeFile);
const isDropTarget = computed(() => isFolder && props.dropTargetId === props.node.idCodeFile);
const isModified = computed(() => !isFolder && props.modifiedFiles?.has(props.node.idCodeFile));
const isCompactHidden = computed(() => props.compactHidden?.has(props.node.idCodeFile));

/** 紧凑路径显示名：如果有合并路径则显示合并路径，否则显示原名 */
const displayName = computed(() => props.compactLabels?.get(props.node.idCodeFile) || props.node.name);

const isEditing = computed(() => props.editingNodeId === props.node.idCodeFile);
const isPendingNew = computed(
  () => isEditing.value && (props.node.name === "untitled.txt" || props.node.name === i18n("ide.newFolder") || props.node.name.startsWith("untitled-") || props.node.name.startsWith(i18n("ide.newFolder") + "-")),
);

const editInputRef = ref<HTMLInputElement>();
const editValue = ref("");

const selectNameWithoutExt = () => {
  if (!editInputRef.value) return;
  const name = props.node.name;
  const dotIdx = name.lastIndexOf(".");
  if (dotIdx > 0) {
    editInputRef.value.setSelectionRange(0, dotIdx);
  } else {
    editInputRef.value.select();
  }
};

watch(
  () => props.editingNodeId,
  async (val) => {
    if (val === props.node.idCodeFile) {
      editValue.value = props.node.name;
      await nextTick();
      editInputRef.value?.focus();
      selectNameWithoutExt();
    }
  },
  { immediate: true },
);

const handleClick = () => {
  if (isEditing.value) return;
  if (isFolder) {
    emit("toggle", props.node.idCodeFile);
  } else {
    emit("select", props.node);
  }
};

const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  emit("contextmenu", props.node, e);
};

// ========== 拖拽 ==========
const handleDragStart = (e: DragEvent) => {
  if (isEditing.value) { e.preventDefault(); return; }
  e.dataTransfer!.setData("text/plain", props.node.idCodeFile);
  e.dataTransfer!.effectAllowed = "move";
  emit("drag-start", props.node.idCodeFile);
};

const handleDragEnd = () => {
  emit("drag-end");
};

const handleDragOver = (e: DragEvent) => {
  if (!isFolder) return;
  if (props.draggingId === props.node.idCodeFile) return;
  e.preventDefault();
  e.dataTransfer!.dropEffect = "move";
  if (props.dropTargetId !== props.node.idCodeFile) {
    (e.currentTarget as HTMLElement).classList.add("tree-drop-target");
  }
};

const handleDragLeave = (e: DragEvent) => {
  (e.currentTarget as HTMLElement).classList.remove("tree-drop-target");
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  (e.currentTarget as HTMLElement).classList.remove("tree-drop-target");
  if (!isFolder) return;
  const sourceId = e.dataTransfer!.getData("text/plain");
  if (!sourceId || sourceId === props.node.idCodeFile) return;
  // 紧凑目录：如果有中间层级，弹出选择菜单
  const chain = props.compactChains?.get(props.node.idCodeFile);
  if (chain && chain.length > 0) {
    emit("compact-drop-select", sourceId, props.node.idCodeFile, chain, { x: e.clientX, y: e.clientY });
  } else {
    emit("drop", sourceId, props.node.idCodeFile);
  }
};

const handleEditKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
    emit("edit-confirm", props.node.idCodeFile, editValue.value);
  } else if (e.key === "Escape") {
    e.preventDefault();
    emit("edit-cancel", props.node.idCodeFile);
  }
  e.stopPropagation();
};

const handleEditBlur = () => {
  emit("edit-cancel", props.node.idCodeFile);
};
</script>

<template>
  <!-- 紧凑目录：被合并的父目录不显示 -->
  <div v-if="!isCompactHidden">
    <!-- 正常显示行 -->
    <div
      v-if="!isEditing"
      class="tree-node"
      :class="{
        'tree-folder': isFolder,
        'tree-file': !isFolder,
        'tree-active': isActive(),
        'tree-dragging': isDragging,
        'tree-drop-target': isDropTarget,
      }"
      :style="{ paddingLeft: depth * 16 + 8 + 'px' }"
      :draggable="!isEditing"
      @click.stop="handleClick"
      @contextmenu="handleContextMenu"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <span v-if="isFolder" class="tree-arrow" :class="{ expanded: isExpanded() }">&#9654;</span>
      <span v-if="isFolder" class="tree-icon">{{ isExpanded() ? FOLDER_ICONS.open : FOLDER_ICONS.closed }}</span>
      <span v-else class="tree-icon">{{ getFileIcon(node.name) }}</span>
      <span class="tree-name" :class="{ 'compact-name': displayName !== node.name }">{{ displayName }}</span>
      <!-- 修改标记 -->
      <span v-if="isModified" class="tree-modified-badge">M</span>
    </div>

    <!-- 内联编辑输入框 -->
    <div
      v-else
      class="tree-node tree-editing"
      :style="{ paddingLeft: depth * 16 + 8 + 'px' }"
    >
      <span v-if="isFolder" class="tree-icon">{{ FOLDER_ICONS.open }}</span>
      <span v-else class="tree-icon">{{ getFileIcon(editValue) }}</span>
      <input
        ref="editInputRef"
        v-model="editValue"
        class="tree-input"
        :placeholder="isPendingNew ? i18n('ide.inputName') : i18n('ide.renameHint')"
        @keydown="handleEditKeydown"
        @blur="handleEditBlur"
        @click.stop
      />
    </div>

    <!-- 子节点 -->
    <template v-if="isFolder && isExpanded() && node.children">
      <FileTreeNode
        v-for="child in node.children"
        :key="child.idCodeFile"
        :node="child"
        :depth="depth + 1"
        :expanded="expanded"
        :active-id="activeId"
        :editing-node-id="editingNodeId"
        :dragging-id="draggingId"
        :drop-target-id="dropTargetId"
        :compact-hidden="compactHidden"
        :compact-labels="compactLabels"
        :compact-chains="compactChains"
        :modified-files="modifiedFiles"
        @toggle="(id) => emit('toggle', id)"
        @select="(f) => emit('select', f)"
        @contextmenu="(n, e) => emit('contextmenu', n, e)"
        @edit-confirm="(id, name) => emit('edit-confirm', id, name)"
        @edit-cancel="(id) => emit('edit-cancel', id)"
        @drag-start="(id) => emit('drag-start', id)"
        @drag-end="emit('drag-end')"
        @drop="(s, t) => emit('drop', s, t)"
        @compact-drop-select="(s, t, c, p) => emit('compact-drop-select', s, t, c, p)"
      />
    </template>
  </div>
</template>

<script lang="ts">
export default { name: "FileTreeNode" };
</script>

<style lang="scss" scoped>
.tree-node {
  display: flex;
  align-items: center;
  padding: 3px 8px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 13px;
  user-select: none;
  transition: background 0.1s;
  &:hover { background: var(--ide-bg-hover); }
  &.tree-active { background: color-mix(in srgb, var(--ide-accent) 25%, transparent); }
  &.tree-editing { padding-top: 1px; padding-bottom: 1px; cursor: text; }
  &.tree-dragging { opacity: 0.4; }
  &.tree-drop-target {
    background: color-mix(in srgb, var(--ide-accent) 20%, transparent) !important;
    outline: 1px dashed var(--ide-accent);
    outline-offset: -1px;
  }
}
.tree-arrow {
  display: inline-block;
  width: 16px;
  font-size: 9px;
  text-align: center;
  transition: transform 0.15s;
  color: var(--ide-fg-dim);
  flex-shrink: 0;
  &.expanded { transform: rotate(90deg); }
}
.tree-icon {
  margin-right: 4px;
  font-size: 14px;
  flex-shrink: 0;
}
.tree-name {
  margin-left: 4px;
  overflow: hidden;
  text-overflow: ellipsis;

  &.compact-name {
    color: var(--ide-fg-dim, #858585);
    font-size: 12px;
  }
}

/* 修改标记 M/U */
.tree-modified-badge {
  margin-left: auto;
  padding: 0 4px;
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  color: #e2c08d;
  background: color-mix(in srgb, #e2c08d 15%, transparent);
  border-radius: 3px;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

.tree-input {
  flex: 1;
  min-width: 0;
  height: 22px;
  padding: 0 4px;
  font-size: 13px;
  background: var(--ide-bg-input);
  color: var(--ide-fg);
  border: 1px solid var(--ide-accent);
  border-radius: 2px;
  outline: none;
  &::placeholder { color: var(--ide-fg-dim); }
}
</style>
