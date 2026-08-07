<script setup lang="ts" name="DtDesigner">
/**
 * 数字孪生设计器 - 主壳（TresJS 重构版）
 *
 * 架构：
 *   DtToolbar（顶部工具栏）
 *   el-splitter 三栏：
 *     左：DtSceneTree（场景树）
 *     中：DtViewport（3D 视口，TresJS 声明式）
 *     右：DtPropertyPanel（属性面板）
 *   弹窗：DtEntityDialog（实体编辑）
 *   右键菜单：DtContextMenu
 *   全局快捷键：Ctrl+Z/Y/S/D + Delete + Escape
 *
 * 数据流：
 *   dtApp.entities → DtViewport（声明式渲染）
 *   用户点击 → dtApp.select() → 信号 → DtPropertyPanel/DtSceneTree 自动更新
 *   属性面板修改 → dtApp.findEntity() → 信号 → DtViewport 自动同步
 */
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import DtViewport from "./panels/DtViewport.vue";
import DtSceneTree from "./panels/DtSceneTree.vue";
import DtPropertyPanel from "./panels/DtPropertyPanel.vue";
import type {DtContextMenuItem} from "./panels/DtContextMenu.vue";
import DtContextMenu from "./panels/DtContextMenu.vue";
import DtEntityDialog from "./dialogs/DtEntityDialog.vue";
import {ShSvgIcon} from "@/components/shared";
import {dtApp, SIGNAL_NAMES, useAddSignal, useDispatchSignal} from "./core/DtApp";
import {createDtEntity} from "./constants";
import type {DtEntity, DtPoint3D, DtScene, DtSize3D, DtViewportMode} from "./types";

const props = defineProps<{
  scene?: DtScene;
}>();

const emit = defineEmits<{
  (e: "save-scene", scene: DtScene): void;
  (e: "select-entity", id: string | null): void;
}>();

/* ----------------------- 视口模式（单一状态源） ----------------------- */
const viewportMode = ref<DtViewportMode>("view");
const transformMode = ref<"translate" | "rotate" | "scale">("translate");
const previewMode = ref(false);

// 监听视口模式信号
useAddSignal(SIGNAL_NAMES.viewportModeChanged, (mode: DtViewportMode) => {
  viewportMode.value = mode;
});

/* ----------------------- 实体数据（响应式） ----------------------- */
const entities = ref<DtEntity[]>([]);

// 监听场景图变化信号 → 同步到响应式数组
useAddSignal(SIGNAL_NAMES.sceneGraphChanged, () => {
  entities.value = [...dtApp.entities];
});

useAddSignal(SIGNAL_NAMES.objectChanged, () => {
  entities.value = [...dtApp.entities];
});

/* ----------------------- 初始化 ----------------------- */
onMounted(() => {
  if (props.scene?.entities) {
    dtApp.loadScene(props.scene.entities);
    entities.value = [...dtApp.entities];
  } else {
    // 创建默认场景
    const defaultEntities: DtEntity[] = [
      createDtEntity("plane", "地面", {x: 0, y: 0, z: 0}, {
        width: 1000,
        height: 0,
        depth: 1000,
        radius: 0
      }, "#1a2030", "normal"),
      createDtEntity("cube", "设备A", {x: -100, y: 50, z: 0}, {
        width: 80,
        height: 100,
        depth: 80,
        radius: 0
      }, "#1890ff", "normal"),
      createDtEntity("cube", "设备B", {x: 100, y: 50, z: 0}, {
        width: 80,
        height: 100,
        depth: 80,
        radius: 0
      }, "#52c41a", "normal"),
      createDtEntity("cylinder", "储罐", {x: 0, y: 60, z: -150}, {
        width: 0,
        height: 120,
        depth: 0,
        radius: 50
      }, "#722ed1", "normal"),
      createDtEntity("sphere", "传感器", {x: 0, y: 180, z: -150}, {
        width: 0,
        height: 0,
        depth: 0,
        radius: 20
      }, "#13c2c2", "normal"),
    ];
    dtApp.loadScene(defaultEntities);
    entities.value = [...dtApp.entities];
  }
});

/* ----------------------- 实体操作 ----------------------- */
const handleAddEntity = (): void => {
  editingEntityId.value = null;
  dialogVisible.value = true;
};

const handleEditEntity = (id: string): void => {
  const entity = dtApp.findEntity(id);
  if (!entity) return;
  editingEntityId.value = id;
  dialogVisible.value = true;
};

const handleDialogSubmit = (entity: DtEntity, isNew: boolean): void => {
  if (isNew) {
    dtApp.entities.push(entity);
    useDispatchSignal(SIGNAL_NAMES.objectAdded, entity);
    useDispatchSignal(SIGNAL_NAMES.sceneGraphChanged);
    ElMessage.success("添加成功");
  } else {
    const existing = dtApp.findEntity(entity.id);
    if (existing) {
      Object.assign(existing, entity);
      useDispatchSignal(SIGNAL_NAMES.objectChanged, existing);
      ElMessage.success("更新成功");
    }
  }
};

/* ----------------------- 视口事件 ----------------------- */
const handleSelectEntity = (id: string | null): void => {
  dtApp.select(id);
  emit("select-entity", id);
};

const handleEntityTransform = (entityId: string, position: DtPoint3D, size: DtSize3D): void => {
  const entity = dtApp.findEntity(entityId);
  if (entity) {
    entity.position = {...position};
    entity.size = {...size};
  }
};

const handleEntityTransformEnd = (entityId: string): void => {
  // 触发历史提交（暂用 sceneGraphChanged）
  useDispatchSignal(SIGNAL_NAMES.historyChanged);
};

/* ----------------------- 工具栏操作 ----------------------- */
const handleSetTransformMode = (mode: "translate" | "rotate" | "scale"): void => {
  transformMode.value = mode;
  useDispatchSignal(SIGNAL_NAMES.transformModeChanged, mode);
};

const handleUndo = (): void => {
  dtApp.undo();
};

const handleRedo = (): void => {
  dtApp.redo();
};

const handleTogglePreview = (): void => {
  previewMode.value = !previewMode.value;
};

const handleSaveScene = (): void => {
  const scene: DtScene = {
    id: "scene_" + Date.now(),
    name: "数字孪生场景",
    entities: dtApp.getScene(),
  };
  emit("save-scene", scene);
  ElMessage.success("保存成功");
};

const handleExportScene = (): void => {
  const data = JSON.stringify(dtApp.getScene(), null, 2);
  const blob = new Blob([data], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `scene_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  ElMessage.success("导出成功");
};

const handleImportScene = (): void => {
  fileInputRef.value?.click();
};

const fileInputRef = ref<HTMLInputElement | null>(null);
const handleFileSelected = (e: Event): void => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target?.result as string);
      if (Array.isArray(data)) {
        dtApp.loadScene(data);
        entities.value = [...dtApp.entities];
        ElMessage.success("导入成功");
      }
    } catch {
      ElMessage.error("导入失败：文件格式错误");
    }
  };
  reader.readAsText(file);
  input.value = "";
};

/* ----------------------- 右键菜单 ----------------------- */
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({x: 0, y: 0});
const contextMenuEntityId = ref<string | null>(null);

const handleContextMenu = (x: number, y: number, entityId: string | null): void => {
  contextMenuPosition.value = {x, y};
  contextMenuEntityId.value = entityId;
  contextMenuVisible.value = true;
};

const handleContextMenuClose = (): void => {
  contextMenuVisible.value = false;
};

const contextMenuItems = computed<DtContextMenuItem[]>(() => {
  if (contextMenuEntityId.value) {
    return [
      {label: "复制", action: "duplicate", icon: "plus", shortcut: "Ctrl+D"} as DtContextMenuItem,
      {label: "删除", action: "delete", icon: "delete", shortcut: "Delete", danger: true} as DtContextMenuItem,
      {divider: true} as DtContextMenuItem,
      {label: "编辑", action: "edit", icon: "edit"} as DtContextMenuItem,
    ];
  }
  return [
    {label: "新建实体", action: "new", icon: "plus", shortcut: "Ctrl+N"} as DtContextMenuItem,
    {divider: true} as DtContextMenuItem,
    {
      label: "撤销",
      action: "undo",
      icon: "backward",
      shortcut: "Ctrl+Z",
      disabled: !dtApp.history.canUndo
    } as DtContextMenuItem,
    {
      label: "重做",
      action: "redo",
      icon: "forward",
      shortcut: "Ctrl+Y",
      disabled: !dtApp.history.canRedo
    } as DtContextMenuItem,
    {divider: true} as DtContextMenuItem,
    {label: "导入", action: "import", icon: "import"} as DtContextMenuItem,
    {label: "导出", action: "export", icon: "export"} as DtContextMenuItem,
    {divider: true} as DtContextMenuItem,
    {label: "保存", action: "save", icon: "save", shortcut: "Ctrl+S"} as DtContextMenuItem,
  ];
});

const handleContextMenuAction = (action: string): void => {
  contextMenuVisible.value = false;
  const entityId = contextMenuEntityId.value;
  switch (action) {
    case "new":
      handleAddEntity();
      break;
    case "edit":
      if (entityId) handleEditEntity(entityId);
      break;
    case "duplicate":
      if (entityId) {
        const entity = dtApp.findEntity(entityId);
        if (entity) {
          const copy: DtEntity = {
            ...JSON.parse(JSON.stringify(entity)),
            id: "dt_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
            name: entity.name + "_copy",
            position: {x: entity.position.x + 50, y: entity.position.y, z: entity.position.z + 50},
          };
          dtApp.entities.push(copy);
          useDispatchSignal(SIGNAL_NAMES.objectAdded, copy);
          useDispatchSignal(SIGNAL_NAMES.sceneGraphChanged);
          ElMessage.success("复制成功");
        }
      }
      break;
    case "delete":
      if (entityId) {
        const entity = dtApp.findEntity(entityId);
        if (entity) {
          dtApp.entities = dtApp.entities.filter((e) => e.id !== entityId);
          if (dtApp.selectedId === entityId) dtApp.select(null);
          useDispatchSignal(SIGNAL_NAMES.objectRemoved, entity);
          useDispatchSignal(SIGNAL_NAMES.sceneGraphChanged);
          ElMessage.success("删除成功");
        }
      }
      break;
    case "undo":
      handleUndo();
      break;
    case "redo":
      handleRedo();
      break;
    case "import":
      handleImportScene();
      break;
    case "export":
      handleExportScene();
      break;
    case "save":
      handleSaveScene();
      break;
  }
};

/* ----------------------- 弹窗 ----------------------- */
const dialogVisible = ref(false);
const editingEntityId = ref<string | null>(null);

/* ----------------------- 快捷键 ----------------------- */
const handleKeydown = (e: KeyboardEvent): void => {
  if (dialogVisible.value) return;
  const ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && e.key === "z" && !e.shiftKey) {
    e.preventDefault();
    handleUndo();
  } else if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
    e.preventDefault();
    handleRedo();
  } else if (ctrl && e.key === "s") {
    e.preventDefault();
    handleSaveScene();
  } else if (ctrl && e.key === "d" && dtApp.selectedId) {
    e.preventDefault();
    handleContextMenuAction("duplicate");
  } else if (e.key === "Delete" && dtApp.selectedId) {
    e.preventDefault();
    handleContextMenuAction("delete");
  } else if (e.key === "Escape") {
    dtApp.deselect();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div class="dt-designer" :class="{ preview: previewMode }">
    <!-- 顶部工具栏 -->
    <div class="dt-toolbar" v-if="!previewMode">
      <div class="toolbar-left">
        <el-button size="small" @click="handleAddEntity">
          <ShSvgIcon name="plus" size="14px"/>
          <span>新建</span>
        </el-button>
        <el-button size="small" :disabled="!dtApp.history.canUndo" @click="handleUndo">
          <ShSvgIcon name="backward" size="14px"/>
          <span>撤销</span>
        </el-button>
        <el-button size="small" :disabled="!dtApp.history.canRedo" @click="handleRedo">
          <ShSvgIcon name="forward" size="14px"/>
          <span>重做</span>
        </el-button>
      </div>
      <div class="toolbar-center">
        <el-button-group>
          <el-button
              size="small"
              :type="viewportMode === 'view' ? 'primary' : 'default'"
              @click="useDispatchSignal(SIGNAL_NAMES.viewportModeChanged, 'view')"
          >
            <ShSvgIcon name="eye" size="14px"/>
            <span>查看</span>
          </el-button>
          <el-button
              size="small"
              :type="viewportMode === 'edit' ? 'primary' : 'default'"
              @click="useDispatchSignal(SIGNAL_NAMES.viewportModeChanged, 'edit')"
          >
            <ShSvgIcon name="edit" size="14px"/>
            <span>编辑</span>
          </el-button>
        </el-button-group>
        <el-button-group v-if="viewportMode === 'edit'" class="transform-group">
          <el-button
              size="small"
              :type="transformMode === 'translate' ? 'primary' : 'default'"
              @click="handleSetTransformMode('translate')"
              title="移动 (W)"
          >
            <ShSvgIcon name="move" size="14px"/>
          </el-button>
          <el-button
              size="small"
              :type="transformMode === 'rotate' ? 'primary' : 'default'"
              @click="handleSetTransformMode('rotate')"
              title="旋转 (E)"
          >
            <ShSvgIcon name="refresh" size="14px"/>
          </el-button>
          <el-button
              size="small"
              :type="transformMode === 'scale' ? 'primary' : 'default'"
              @click="handleSetTransformMode('scale')"
              title="缩放 (R)"
          >
            <ShSvgIcon name="scale" size="14px"/>
          </el-button>
        </el-button-group>
      </div>
      <div class="toolbar-right">
        <el-button size="small" @click="handleImportScene">
          <ShSvgIcon name="import" size="14px"/>
          <span>导入</span>
        </el-button>
        <el-button size="small" @click="handleExportScene">
          <ShSvgIcon name="export" size="14px"/>
          <span>导出</span>
        </el-button>
        <el-button size="small" type="primary" @click="handleSaveScene">
          <ShSvgIcon name="save" size="14px"/>
          <span>保存</span>
        </el-button>
        <el-button size="small" @click="handleTogglePreview">
          <ShSvgIcon name="eye" size="14px"/>
          <span>预览</span>
        </el-button>
      </div>
    </div>

    <!-- 三栏布局 -->
    <div class="dt-content">
      <el-splitter class="dt-splitter" layout="horizontal">
        <!-- 左：场景树 -->
        <el-splitter-panel size="280px" v-if="!previewMode">
          <DtSceneTree
              @add-entity="handleAddEntity"
              @edit-entity="handleEditEntity"
          />
        </el-splitter-panel>

        <!-- 中：3D 视口 -->
        <el-splitter-panel size="auto" min="200px">
          <DtViewport
              :entities="entities"
              :mode="viewportMode"
              :transform-mode="transformMode"
              @select-entity="handleSelectEntity"
              @entity-transform="handleEntityTransform"
              @entity-transform-end="handleEntityTransformEnd"
              @context-menu="handleContextMenu"
          />
        </el-splitter-panel>

        <!-- 右：属性面板 -->
        <el-splitter-panel size="300px" v-if="!previewMode">
          <DtPropertyPanel/>
        </el-splitter-panel>
      </el-splitter>
    </div>

    <!-- 实体编辑弹窗 -->
    <DtEntityDialog
        v-model:visible="dialogVisible"
        :editing-entity-id="editingEntityId"
        @submit="handleDialogSubmit"
    />

    <!-- 右键菜单 -->
    <DtContextMenu
        v-if="contextMenuVisible"
        :items="contextMenuItems"
        :position="contextMenuPosition"
        @action="handleContextMenuAction"
        @close="handleContextMenuClose"
    />

    <!-- 文件导入 -->
    <input
        ref="fileInputRef"
        type="file"
        accept=".json"
        style="display: none"
        @change="handleFileSelected"
    />
  </div>
</template>

<style lang="scss" scoped>
.dt-designer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #0a0e17;
  overflow: hidden;

  &.preview {
    .dt-content {
      .el-splitter-panel:not(:nth-child(2)) {
        display: none;
      }
    }
  }

  .dt-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: #141821;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    gap: 12px;

    .toolbar-left,
    .toolbar-right,
    .toolbar-center {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toolbar-center {
      flex: 1;
      justify-content: center;

      .transform-group {
        margin-left: 8px;
      }
    }

    :deep(.el-button) {
      --el-button-bg-color: rgba(255, 255, 255, 0.06);
      --el-button-border-color: rgba(255, 255, 255, 0.12);
      --el-button-text-color: rgba(255, 255, 255, 0.85);
      --el-button-hover-bg-color: rgba(255, 255, 255, 0.12);
      --el-button-hover-border-color: rgba(255, 255, 255, 0.2);

      span {
        font-size: 12px;
      }
    }
  }

  .dt-content {
    flex: 1;
    overflow: hidden;
    position: relative;

    .el-splitter {
      width: 100%;
      height: 100%;
    }

    :deep(.el-splitter-panel) {
      overflow: hidden;
    }
  }
}
</style>
