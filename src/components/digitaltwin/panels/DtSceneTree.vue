<script setup lang="ts" name="DtSceneTree">
/**
 * 数字孪生 - 场景树（对标 Astral3D SceneTree）
 *
 * el-tree 拖拽层级 + 信号驱动刷新
 */
import { computed, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ShSvgIcon } from "@/components/shared";
import {
  dtApp,
  SIGNAL_NAMES,
  useAddSignal,
  useDispatchSignal,
} from "../core/DtApp";
import { dtGetStatusPreset } from "../constants";
import type { DtEntity, DtEntityStatus } from "../types";

const emit = defineEmits<{
  (e: "edit-entity", id: string): void;
  (e: "add-entity"): void;
}>();

/* ----------------------- 树数据 ----------------------- */
interface TreeNode {
  id: string;
  entity: DtEntity;
  children: TreeNode[];
}

const treeData = computed<TreeNode[]>(() => buildTree(dtApp.entities));

function buildTree(entities: DtEntity[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];
  entities.forEach((e) =>
    nodeMap.set(e.id, { id: e.id, entity: e, children: [] }),
  );
  entities.forEach((e) => {
    const node = nodeMap.get(e.id)!;
    if (e.parentId && nodeMap.has(e.parentId)) {
      nodeMap.get(e.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

/* ----------------------- 选中同步 ----------------------- */
const currentSelected = ref<string | null>(dtApp.selectedId);

useAddSignal(SIGNAL_NAMES.objectSelected, (entity: DtEntity | null) => {
  currentSelected.value = entity?.id ?? null;
});

useAddSignal(SIGNAL_NAMES.objectDeselected, () => {
  currentSelected.value = null;
});

const handleNodeClick = (data: TreeNode): void => {
  dtApp.select(data.id);
};

/* ----------------------- 展开状态 ----------------------- */
const expandedKeys = ref<string[]>([]);

// 默认展开所有根节点
watch(
  treeData,
  (nodes) => {
    if (expandedKeys.value.length === 0) {
      expandedKeys.value = nodes.map((n) => n.id);
    }
  },
  { immediate: true },
);

/* ----------------------- 操作 ----------------------- */
const handleEdit = (id: string): void => {
  emit("edit-entity", id);
};

const handleDelete = (id: string): void => {
  ElMessageBox.confirm("确认删除该实体？", "删除", { type: "warning" })
    .then(() => {
      const entity = dtApp.findEntity(id);
      if (entity) {
        dtApp.entities = dtApp.entities.filter((e) => e.id !== id);
        if (dtApp.selectedId === id) dtApp.select(null);
        useDispatchSignal(SIGNAL_NAMES.objectRemoved, entity);
        useDispatchSignal(SIGNAL_NAMES.sceneGraphChanged);
        ElMessage.success("删除成功");
      }
    })
    .catch(() => {});
};

const handleToggleVisible = (entity: DtEntity): void => {
  entity.visible = entity.visible === false;
  useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
};

const handleToggleLock = (entity: DtEntity): void => {
  if (entity.locked) {
    dtApp.unlock(entity.id);
  } else {
    dtApp.lock(entity.id);
  }
};

/* ----------------------- 重命名 ----------------------- */
const renamingId = ref<string | null>(null);
const renamingValue = ref("");

const handleStartRename = (entity: DtEntity): void => {
  renamingId.value = entity.id;
  renamingValue.value = entity.name;
};

const handleConfirmRename = (): void => {
  if (!renamingId.value) return;
  const name = renamingValue.value.trim();
  if (!name) {
    ElMessage.warning("名称不能为空");
    return;
  }
  const entity = dtApp.findEntity(renamingId.value);
  if (entity) {
    entity.name = name;
    useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
  }
  renamingId.value = null;
};

const handleCancelRename = (): void => {
  renamingId.value = null;
  renamingValue.value = "";
};

/* ----------------------- 拖拽 ----------------------- */
const handleDrop = (dragNode: any, dropNode: any, dropType: string): void => {
  const dragEntity = dtApp.findEntity(dragNode.data.id);
  if (!dragEntity) return;
  if (dropType === "inside") {
    dragEntity.parentId = dropNode.data.id;
  } else {
    dragEntity.parentId = dropNode.data.entity?.parentId || null;
  }
  useDispatchSignal(SIGNAL_NAMES.sceneGraphChanged);
};

const allowDrop = (
  _dragNode: any,
  _dropNode: any,
  _dropType: string,
): boolean => true;
const allowDrag = (node: any): boolean => !node.data.entity?.locked;

/* ----------------------- 工具 ----------------------- */
const statusColor = (status: DtEntityStatus): string =>
  dtGetStatusPreset(status)?.color ?? "#8C8C8C";
</script>

<template>
  <div class="dt-scene-tree">
    <div class="panel-header">
      <span class="panel-title">场景树</span>
      <el-button type="primary" size="small" @click="emit('add-entity')">
        <ShSvgIcon name="plus" size="12px" />
        添加
      </el-button>
    </div>

    <div class="tree-body">
      <template v-if="treeData.length === 0">
        <div class="empty-text">暂无实体</div>
      </template>
      <el-tree
        v-else
        :data="treeData"
        :props="{ children: 'children', label: 'entity.name' }"
        node-key="id"
        :expand-on-click-node="false"
        :current-node-key="currentSelected"
        :default-expanded-keys="expandedKeys"
        @node-click="handleNodeClick"
        @node-drop="handleDrop"
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        draggable
      >
        <template #default="{ data }">
          <div
            class="tree-node"
            :class="{
              hidden: data.entity.visible === false,
              locked: data.entity.locked,
            }"
          >
            <span
              class="status-dot"
              :style="{ background: statusColor(data.entity.status) }"
            />
            <el-input
              v-if="renamingId === data.id"
              v-model="renamingValue"
              size="small"
              class="rename-input"
              @keyup.enter="handleConfirmRename"
              @keyup.esc="handleCancelRename"
              @blur="handleConfirmRename"
            />
            <span
              v-else
              class="entity-name"
              @dblclick.stop="handleStartRename(data.entity)"
            >
              {{ data.entity.name }}
            </span>
            <span class="entity-actions" v-if="renamingId !== data.id">
              <el-tooltip
                :content="data.entity.visible === false ? '显示' : '隐藏'"
                :show-after="500"
              >
                <el-button
                  link
                  size="small"
                  @click.stop="handleToggleVisible(data.entity)"
                >
                  <ShSvgIcon
                    :name="data.entity.visible === false ? 'eyeOff' : 'eye'"
                    size="12px"
                  />
                </el-button>
              </el-tooltip>
              <el-tooltip
                :content="data.entity.locked ? '解锁' : '锁定'"
                :show-after="500"
              >
                <el-button
                  link
                  size="small"
                  @click.stop="handleToggleLock(data.entity)"
                >
                  <ShSvgIcon
                    :name="data.entity.locked ? 'lock' : 'unlock'"
                    size="12px"
                  />
                </el-button>
              </el-tooltip>
              <el-tooltip content="重命名" :show-after="500">
                <el-button
                  link
                  size="small"
                  @click.stop="handleStartRename(data.entity)"
                >
                  <ShSvgIcon name="editPen" size="12px" />
                </el-button>
              </el-tooltip>
              <el-tooltip content="编辑" :show-after="500">
                <el-button link size="small" @click.stop="handleEdit(data.id)">
                  <ShSvgIcon name="edit" size="12px" />
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" :show-after="500">
                <el-button
                  link
                  size="small"
                  type="danger"
                  @click.stop="handleDelete(data.id)"
                >
                  <ShSvgIcon name="delete" size="12px" />
                </el-button>
              </el-tooltip>
            </span>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dt-scene-tree {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
  overflow: hidden;

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .panel-title {
      font-size: 13px;
      font-weight: 600;
    }
  }

  .tree-body {
    flex: 1;
    overflow: auto;
    padding: 4px 0;

    :deep(.el-tree) {
      background: transparent;

      .el-tree-node__content {
        height: 32px;
        padding-left: 8px !important;

        &:hover {
          background: var(--el-fill-color-light);
        }
      }

      .el-tree-node.is-current > .el-tree-node__content {
        background: var(--el-color-primary-light-9);
      }
    }
  }

  .empty-text {
    padding: 24px 12px;
    text-align: center;
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }

  .tree-node {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    width: 100%;

    &.hidden .entity-name {
      opacity: 0.5;
      text-decoration: line-through;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .entity-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .rename-input {
      flex: 1;
    }

    .entity-actions {
      display: flex;
      gap: 2px;
      opacity: 0;
      transition: opacity 0.15s;
      flex-shrink: 0;
    }

    &:hover .entity-actions {
      opacity: 1;
    }
  }
}
</style>
