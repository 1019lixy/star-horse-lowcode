<script setup lang="ts" name="ScheduleResourcePanel">
import {computed, ref, watch} from "vue";
import {i18n} from "@/lang";
import type {ScheduleDesigner} from "../composables/useScheduleDesigner";
import {SCHEDULE_RESOURCE_TYPE_PRESETS} from "../constants";

const props = defineProps<{
  designer: ScheduleDesigner;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: "editResource", resourceId: string): void;
}>();

const listScrollRef = ref<HTMLElement>();
const rowHeight = computed(() => props.designer.state.config.rowHeight);
const selectedResourceId = computed(() => props.designer.selectedResourceId.value);
const resources = computed(() => props.designer.sortedResources.value);

const getResTypeLabel = (type: string) =>
    SCHEDULE_RESOURCE_TYPE_PRESETS.find((t) => t.value === type)?.label ?? type;

/** 行点击 → 选中资源 */
const handleRowClick = (id: string) => {
  props.designer.selectResource(id);
};

/** 双击编辑 */
const handleRowDblClick = (id: string) => {
  emit("editResource", id);
};

/** 双击名称 → 内联编辑 */
const editingId = ref<string | null>(null);
const editingName = ref("");
const handleNameDblClick = (e: MouseEvent, id: string, name: string) => {
  if (props.readonly) return;
  e.stopPropagation();
  editingId.value = id;
  editingName.value = name;
};
const handleNameBlur = () => {
  if (editingId.value && editingName.value.trim()) {
    props.designer.updateResource(editingId.value, {name: editingName.value.trim()});
  }
  editingId.value = null;
};
const handleNameKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") handleNameBlur();
  if (e.key === "Escape") {
    editingId.value = null;
  }
};

/** 拖拽排序 */
const dragResourceId = ref<string | null>(null);
const dragOverResourceId = ref<string | null>(null);

const handleDragStart = (e: DragEvent, id: string) => {
  dragResourceId.value = id;
  e.dataTransfer?.setData("text/plain", id);
  if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
};

const handleDragOver = (e: DragEvent, targetId: string) => {
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  dragOverResourceId.value = targetId;
};

const handleDragLeave = () => {
  dragOverResourceId.value = null;
};

const handleDrop = (e: DragEvent, targetId: string) => {
  e.preventDefault();
  const sourceId = dragResourceId.value;
  if (!sourceId || sourceId === targetId) return;
  const source = props.designer.state.resources.find(r => r.id === sourceId);
  const target = props.designer.state.resources.find(r => r.id === targetId);
  if (!source || !target) return;
  const tempOrder = source.order;
  source.order = target.order;
  target.order = tempOrder;
  dragResourceId.value = null;
  dragOverResourceId.value = null;
};

const handleDragEnd = () => {
  dragResourceId.value = null;
  dragOverResourceId.value = null;
};

/** 暴露滚动元素供 ScheduleView 同步 */
defineExpose({listScrollRef});

/** 监听选中资源，自动滚动到可见区域 */
watch(() => props.designer.selectedResourceId.value, (id) => {
  if (!id) return;
  const idx = resources.value.findIndex(r => r.id === id);
  if (idx < 0) return;
  const container = listScrollRef.value;
  if (!container) return;
  const rowY = idx * rowHeight.value;
  const headerHeight = 40;
  const scrollTop = container.scrollTop;
  const viewHeight = container.clientHeight - headerHeight;
  const relativeY = rowY - (scrollTop - headerHeight);
  if (relativeY < 0 || relativeY > viewHeight - rowHeight.value) {
    container.scrollTop = rowY - viewHeight / 2 + rowHeight.value / 2 + headerHeight;
  }
});
</script>

<template>
  <div class="schedule-resource-panel">
    <!-- 表头 -->
    <div class="panel-header">
      <span class="header-title">{{ i18n("schedule.resource.title") }}</span>
      <div class="header-actions">
        <button
            v-if="!readonly"
            class="svg-btn"
            :title="i18n('schedule.btn.addResource')"
            @click="designer.addResource()"
        >
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          </svg>
        </button>
        <button
            v-if="!readonly && selectedResourceId"
            class="svg-btn"
            :title="i18n('schedule.btn.moveToTop')"
            @click="selectedResourceId && designer.moveResourceToTop(selectedResourceId)"
        >
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path d="M6 4h12M12 20V8M7 12l5-5 5 5" stroke="currentColor" stroke-width="2" fill="none"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button
            v-if="!readonly && selectedResourceId"
            class="svg-btn"
            :title="i18n('schedule.btn.moveUp')"
            @click="selectedResourceId && designer.moveResourceUp(selectedResourceId)"
        >
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path d="M12 20V8M7 12l5-5 5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
        </button>
        <button
            v-if="!readonly && selectedResourceId"
            class="svg-btn"
            :title="i18n('schedule.btn.moveDown')"
            @click="selectedResourceId && designer.moveResourceDown(selectedResourceId)"
        >
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path d="M12 4v12M7 12l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
        </button>
        <button
            v-if="!readonly && selectedResourceId"
            class="svg-btn"
            :title="i18n('schedule.btn.moveToBottom')"
            @click="selectedResourceId && designer.moveResourceToBottom(selectedResourceId)"
        >
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path d="M6 20h12M12 4v12M7 12l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button
            v-if="!readonly && selectedResourceId"
            class="svg-btn danger"
            :title="i18n('schedule.btn.removeResource')"
            @click="selectedResourceId && designer.removeResource(selectedResourceId)"
        >
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path d="M6 7h12M9 7V5h6v2M8 7v12h8V7M10 11v5M14 11v5" stroke="currentColor" stroke-width="1.5" fill="none"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 行列表 -->
    <div class="panel-body" ref="listScrollRef">
      <div
          v-for="(resource, idx) in resources"
          :key="resource.id"
          class="resource-row"
          :class="{
                    selected: resource.id === selectedResourceId,
                    'row-even': idx % 2 === 0,
                    'row-odd': idx % 2 !== 0,
                    dragging: resource.id === dragResourceId,
                    'drag-over': resource.id === dragOverResourceId
                }"
          :style="{ height: `${rowHeight}px`, borderLeftColor: resource.color || 'var(--el-color-primary)' }"
          draggable="true"
          @click="handleRowClick(resource.id)"
          @dblclick="handleRowDblClick(resource.id)"
          @dragstart="(e) => handleDragStart(e, resource.id)"
          @dragover="(e) => handleDragOver(e, resource.id)"
          @dragleave="handleDragLeave"
          @drop="(e) => handleDrop(e, resource.id)"
          @dragend="handleDragEnd"
      >
        <div class="row-index">{{ idx + 1 }}</div>
        <div class="row-avatar">
          <el-avatar :size="24" :src="resource.avatar">
            {{ resource.name.charAt(0) }}
          </el-avatar>
        </div>
        <div class="row-info">
          <input
              v-if="editingId === resource.id"
              class="name-input"
              v-model="editingName"
              @blur="handleNameBlur"
              @keydown="handleNameKeydown"
              autofocus
          />
          <span
              v-else
              class="resource-name"
              @dblclick="(e) => handleNameDblClick(e, resource.id, resource.name)"
          >{{ resource.name }}</span>
          <span class="resource-type">{{ getResTypeLabel(resource.type) }}</span>
        </div>
      </div>
      <div class="empty-tip" v-if="resources.length === 0">
        {{ i18n("schedule.resource.empty") }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.schedule-resource-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  overflow: hidden;
  user-select: none;

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 8px;
    font-weight: 600;
    font-size: 13px;
    border-bottom: 1px solid var(--el-border-color);
    background: var(--el-fill-color-light);
    min-height: 40px;

    .header-title {
      flex-shrink: 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 2px;

      .svg-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--el-text-color-regular);
        border-radius: 4px;
        padding: 0;

        &:hover {
          background: var(--el-fill-color);
          color: var(--el-color-primary);
        }

        &.danger:hover {
          color: var(--el-color-danger);
        }
      }
    }
  }

  .panel-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--el-border-color);
      border-radius: 3px;
    }
  }

  .resource-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 6px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    border-left: 3px solid var(--el-color-primary);
    cursor: pointer;
    transition: background 0.15s;

    &.row-even {
      background: var(--el-bg-color);
    }

    &.row-odd {
      background: var(--el-fill-color-lighter);
    }

    &:hover {
      background: var(--el-fill-color);
    }

    &.selected {
      background: var(--el-color-primary-light-8) !important;
    }

    &.dragging {
      opacity: 0.5;
      background: var(--el-color-primary-light-9);
    }

    &.drag-over {
      border-top: 2px solid var(--el-color-primary);
    }

    .row-index {
      width: 20px;
      min-width: 20px;
      text-align: center;
      font-size: 11px;
      color: var(--el-text-color-secondary);
    }

    .row-avatar {
      flex-shrink: 0;
    }

    .row-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;

      .name-input {
        font-size: 13px;
        font-weight: 500;
        border: 1px solid var(--el-color-primary);
        border-radius: 2px;
        padding: 0 4px;
        outline: none;
        width: 100%;
        background: var(--el-bg-color);
      }

      .resource-name {
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .resource-type {
        font-size: 11px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .empty-tip {
    text-align: center;
    color: var(--el-text-color-placeholder);
    padding: 24px 0;
    font-size: 12px;
  }
}
</style>
