<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import type { FileNode } from "./types";
import { getFileIcon, FOLDER_ICONS } from "./constants";

const props = defineProps<{
  node: FileNode;
  depth: number;
  expanded: Set<string>;
  activeId: string;
  editingNodeId: string | null;
  draggingId: string | null;
  dropTargetId: string | null;
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
}>();

const isFolder = props.node.type === "folder";
const isExpanded = () => props.expanded.has(props.node.id);
const isActive = () => props.node.id === props.activeId;
const isDragging = computed(() => props.draggingId === props.node.id);
const isDropTarget = computed(() => isFolder && props.dropTargetId === props.node.id);

const isEditing = computed(() => props.editingNodeId === props.node.id);
const isPendingNew = computed(
  () => isEditing.value && (props.node.name === "untitled.txt" || props.node.name === "新建文件夹" || props.node.name.startsWith("untitled-") || props.node.name.startsWith("新建文件夹-")),
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
    if (val === props.node.id) {
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
    emit("toggle", props.node.id);
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
  e.dataTransfer!.setData("text/plain", props.node.id);
  e.dataTransfer!.effectAllowed = "move";
  emit("drag-start", props.node.id);
};

const handleDragEnd = () => {
  emit("drag-end");
};

const handleDragOver = (e: DragEvent) => {
  if (!isFolder) return;
  // 不能拖到自己或自己的子节点
  if (props.draggingId === props.node.id) return;
  e.preventDefault();
  e.dataTransfer!.dropEffect = "move";
  // 高亮当前拖放目标（通过父组件的 dropTargetId 控制）
  // 这里通过 emit 通知父组件更新 dropTargetId
  if (props.dropTargetId !== props.node.id) {
    // 使用自定义事件通知，避免频繁 emit
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
  if (!sourceId || sourceId === props.node.id) return;
  emit("drop", sourceId, props.node.id);
};

const handleEditKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
    emit("edit-confirm", props.node.id, editValue.value);
  } else if (e.key === "Escape") {
    e.preventDefault();
    emit("edit-cancel", props.node.id);
  }
  e.stopPropagation();
};

const handleEditBlur = () => {
  emit("edit-cancel", props.node.id);
};
</script>

<template>
  <div>
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
      <span class="tree-name">{{ node.name }}</span>
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
        :placeholder="isPendingNew ? '输入名称...' : '重命名...'"
        @keydown="handleEditKeydown"
        @blur="handleEditBlur"
        @click.stop
      />
    </div>

    <!-- 子节点 -->
    <template v-if="isFolder && isExpanded() && node.children">
      <FileTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :expanded="expanded"
        :active-id="activeId"
        :editing-node-id="editingNodeId"
        :dragging-id="draggingId"
        :drop-target-id="dropTargetId"
        @toggle="(id) => emit('toggle', id)"
        @select="(f) => emit('select', f)"
        @contextmenu="(n, e) => emit('contextmenu', n, e)"
        @edit-confirm="(id, name) => emit('edit-confirm', id, name)"
        @edit-cancel="(id) => emit('edit-cancel', id)"
        @drag-start="(id) => emit('drag-start', id)"
        @drag-end="emit('drag-end')"
        @drop="(s, t) => emit('drop', s, t)"
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
