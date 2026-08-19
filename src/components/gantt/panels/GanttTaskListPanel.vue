<script setup lang="ts" name="GanttTaskListPanel">
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import type { GanttDesigner } from "../composables/useGanttDesigner";
import { daysBetween } from "../utils/GanttDateUtils";

const props = defineProps<{
  designer: GanttDesigner;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", id: string): void;
}>();

const listScrollRef = ref<HTMLElement>();

const rowHeight = computed(() => props.designer.state.config.rowHeight);
const selectedTaskId = computed(() => props.designer.selectedTaskId.value);

/** 扁平化任务列表（与甘特图排序一致） */
const flatTasks = computed(() => props.designer.sortedTasks.value);

/** 计算工期天数 */
const getDuration = (task: { startDate: string; endDate: string }) => {
  return daysBetween(task.startDate, task.endDate) - 1;
};

/** 短日期格式 MM-DD */
const shortDate = (dateStr: string) => {
  if (!dateStr || dateStr.length < 10) return dateStr;
  return dateStr.slice(5);
};

/** 行点击 */
const handleRowClick = (id: string) => {
  props.designer.selectTask(id);
};

/** 双击编辑 */
const handleRowDblClick = (id: string) => {
  emit("edit", id);
};

/** 拖拽排序 */
const dragTaskId = ref<string | null>(null);
const dragOverTaskId = ref<string | null>(null);

const handleDragStart = (e: DragEvent, id: string) => {
  dragTaskId.value = id;
  e.dataTransfer?.setData("text/plain", id);
  if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
};

const handleDragOver = (e: DragEvent, targetId: string) => {
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  dragOverTaskId.value = targetId;
};

const handleDragLeave = () => {
  dragOverTaskId.value = null;
};

const handleDrop = (e: DragEvent, targetId: string) => {
  e.preventDefault();
  const sourceId = dragTaskId.value;
  if (!sourceId || sourceId === targetId) return;
  const source = props.designer.state.tasks.find((t) => t.id === sourceId);
  const target = props.designer.state.tasks.find((t) => t.id === targetId);
  if (!source || !target) return;
  if (source.parentId !== target.parentId) return; // 只允许同级拖拽
  const tempOrder = source.order;
  source.order = target.order;
  target.order = tempOrder;
  dragTaskId.value = null;
  dragOverTaskId.value = null;
};

const handleDragEnd = () => {
  dragTaskId.value = null;
  dragOverTaskId.value = null;
};

/** 暴露滚动元素供 GanttChart 同步 */
defineExpose({ listScrollRef });

/** 监听选中任务，自动滚动到可见区域 */
watch(
  () => props.designer.selectedTaskId.value,
  (id) => {
    if (!id) return;
    const idx = flatTasks.value.findIndex((t) => t.id === id);
    if (idx < 0) return;
    const container = listScrollRef.value;
    if (!container) return;
    const rowY = idx * rowHeight.value;
    const headerHeight = 56; // 表头高度
    const scrollTop = container.scrollTop;
    const viewHeight = container.clientHeight - headerHeight;
    const relativeY = rowY - (scrollTop - headerHeight);
    if (relativeY < 0 || relativeY > viewHeight - rowHeight.value) {
      container.scrollTop =
        rowY - viewHeight / 2 + rowHeight.value / 2 + headerHeight;
    }
  },
);
</script>

<template>
  <div class="gantt-task-list-panel">
    <!-- 表头 -->
    <div class="list-header">
      <div class="header-cell cell-index">#</div>
      <div class="header-cell cell-name">{{ i18n("gantt.task.name") }}</div>
      <div class="header-cell cell-assignee">
        {{ i18n("gantt.task.assignee") }}
      </div>
      <div class="header-cell cell-date">{{ i18n("print.field.date") }}</div>
      <div class="header-cell cell-duration">
        {{ i18n("gantt.task.workHours") }}
      </div>
    </div>
    <!-- 行列表 -->
    <div class="list-scroll" ref="listScrollRef">
      <div
        v-for="(task, idx) in flatTasks"
        :key="task.id"
        class="list-row"
        :class="{
          selected: task.id === selectedTaskId,
          'row-even': idx % 2 === 0,
          'row-odd': idx % 2 !== 0,
          dragging: task.id === dragTaskId,
          'drag-over': task.id === dragOverTaskId,
        }"
        :style="{ height: `${rowHeight}px` }"
        draggable="true"
        @click="handleRowClick(task.id)"
        @dblclick="handleRowDblClick(task.id)"
        @dragstart="(e) => handleDragStart(e, task.id)"
        @dragover="(e) => handleDragOver(e, task.id)"
        @dragleave="handleDragLeave"
        @drop="(e) => handleDrop(e, task.id)"
        @dragend="handleDragEnd"
      >
        <div class="row-cell cell-index">{{ idx + 1 }}</div>
        <div
          class="row-cell cell-name"
          :style="{ paddingLeft: `${task.level * 16 + 8}px` }"
        >
          <span class="tree-indent" v-if="task.level > 0">└ </span>
          <svg
            v-if="task.isMilestone"
            class="milestone-icon"
            viewBox="0 0 16 16"
            width="14"
            height="14"
          >
            <path
              d="M8 1L15 8L8 15L1 8Z"
              fill="#E6A23C"
              stroke="#C88520"
              stroke-width="1"
            />
          </svg>
          <span class="task-name-text">{{ task.name }}</span>
        </div>
        <div class="row-cell cell-assignee">{{ task.assignee }}</div>
        <div class="row-cell cell-date">
          {{ shortDate(task.startDate) + " To " + shortDate(task.endDate) }}
        </div>
        <div class="row-cell cell-duration">{{ getDuration(task) }}天</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gantt-task-list-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  overflow: hidden;
  user-select: none;

  .list-header {
    display: flex;
    align-items: center;
    height: 56px;
    min-height: 56px;
    border-bottom: 2px solid var(--el-border-color);
    background: var(--el-fill-color-light);
    font-weight: 600;
    font-size: 12px;
    color: var(--el-text-color-secondary);

    .header-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      border-right: 1px solid var(--el-border-color-lighter);
      height: 100%;

      &.cell-index {
        width: 32px;
        min-width: 32px;
      }

      &.cell-name {
        flex: 1;
        min-width: 100px;
        justify-content: flex-start;
        padding-left: 8px;
      }

      &.cell-assignee {
        width: 72px;
        min-width: 72px;
      }

      &.cell-date {
        width: 100px;
        min-width: 100px;
      }

      &.cell-duration {
        width: 50px;
        min-width: 50px;
        border-right: none;
      }
    }
  }

  .list-scroll {
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

  .list-row {
    display: flex;
    align-items: center;
    cursor: pointer;
    border-bottom: 1px solid var(--el-border-color-lighter);
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

    .row-cell {
      display: flex;
      align-items: center;
      font-size: 12px;
      padding: 0 4px;
      height: 100%;
      border-right: 1px solid var(--el-border-color-lighter);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &.cell-index {
        width: 32px;
        min-width: 32px;
        justify-content: center;
        color: var(--el-text-color-secondary);
        font-size: 11px;
      }

      &.cell-name {
        flex: 1;
        min-width: 100px;
        gap: 2px;

        .tree-indent {
          color: var(--el-text-color-placeholder);
          font-size: 11px;
          flex-shrink: 0;
        }

        .milestone-icon {
          flex-shrink: 0;
          margin-right: 2px;
        }

        .task-name-text {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      &.cell-assignee {
        width: 72px;
        min-width: 72px;
        justify-content: center;
        color: var(--el-text-color-regular);
        font-size: 11px;
      }

      &.cell-date {
        width: 100px;
        min-width: 100px;
        justify-content: center;
        color: var(--el-text-color-regular);
        font-size: 11px;
      }

      &.cell-duration {
        width: 50px;
        min-width: 50px;
        justify-content: center;
        color: var(--el-text-color-secondary);
        font-size: 11px;
        border-right: none;
      }
    }
  }

  .list-row {
    &.dragging {
      opacity: 0.5;
      background: var(--el-color-primary-light-9);
    }

    &.drag-over {
      border-top: 2px solid var(--el-color-primary);
    }
  }
}
</style>
