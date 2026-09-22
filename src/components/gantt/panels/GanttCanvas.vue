<script setup lang="ts" name="GanttCanvas">
import { computed, ref, watch } from "vue";
import type { GanttDesigner } from "../composables/useGanttDesigner";
import {
  CRITICAL_COLOR,
  GANTT_STATUS_PRESETS,
  MILESTONE_SIZE,
  TODAY_LINE_COLOR
} from "../constants";
import type { GanttTimelineCell } from "../utils/GanttDateUtils";
import {
  formatDate,
  getTimelineCells,
  getUnitDuration,
  getUnitOffset,
  isToday,
  parseDate,
} from "../utils/GanttDateUtils";
import type { GanttLinkType, GanttTask } from "../types";

const props = defineProps<{
  designer: GanttDesigner;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", id: string): void;
}>();

const canvasScrollRef = ref<HTMLElement>();

/** 暴露滚动元素供 GanttChart 同步 */
defineExpose({ canvasScrollRef });

/** 拖拽状态 */
const dragState = ref<{
  taskId: string;
  startX: number;
  mode: "move" | "resize-start" | "resize-end";
  originalStart: string;
  originalEnd: string;
} | null>(null);

/** 连线创建状态 */
const linkState = ref<{
  sourceId: string;
} | null>(null);

/** 时间单位（从配置读取） */
const timeUnit = computed(() => props.designer.state.config.timeUnit);

/** 时间轴单元格列表（按时间单位聚合，非每日） */
const timelineCells = computed<GanttTimelineCell[]>(() => {
  const { projectStart, projectEnd } = props.designer.state.config;
  return getTimelineCells(projectStart, projectEnd, timeUnit.value);
});

/** 顶层时间轴分组（按 topLabel 聚合） */
const timelineGroups = computed(() => {
  const cells = timelineCells.value;
  if (cells.length === 0) return [];
  const groups: { label: string; count: number }[] = [];
  let prevKey = "";
  let count = 0;
  for (const c of cells) {
    if (c.topLabel !== prevKey) {
      if (prevKey) groups.push({ label: prevKey, count });
      prevKey = c.topLabel;
      count = 1;
    } else {
      count++;
    }
  }
  if (prevKey) groups.push({ label: prevKey, count });
  return groups;
});

/** 单元格宽度（按时间单位，每个单位有合理固定宽度） */
const cellWidth = computed<number>(() => {
  const widths: Record<string, number> = {
    day: 40,
    week: 80,
    month: 120,
    quarter: 200,
    year: 360,
  };
  return widths[timeUnit.value] ?? 40;
});

const rowHeight = computed(() => props.designer.state.config.rowHeight);
const selectedTaskId = computed(() => props.designer.selectedTaskId.value);
const sortedTaskList = computed(() => props.designer.sortedTasks.value);
/** 计算任务条位置（基于时间单位聚合，不再按天计算） */
const getTaskPosition = (task: GanttTask) => {
  const unit = timeUnit.value;
  const { projectStart } = props.designer.state.config;
  const offsetUnits = getUnitOffset(projectStart, task.startDate, unit);
  const durationUnits = getUnitDuration(task.startDate, task.endDate, unit);
  return {
    left: offsetUnits * cellWidth.value,
    width: Math.max(durationUnits * cellWidth.value, cellWidth.value),
  };
};

/** 获取任务颜色 */
const getTaskColor = (task: GanttTask) => {
  if (task.isCritical && props.designer.state.config.showCritical)
    return CRITICAL_COLOR;
  const today = new Date();
  const endDate = new Date(task.endDate);
  if (today > endDate && task.status !== "completed") {
    return "#F56C6C";
  }
  return (
    GANTT_STATUS_PRESETS.find((s) => s.value === task.status)?.color ??
    "#409EFF"
  );
};

/** 今日线位置（基于时间单位计算） */
const todayLeft = computed(() => {
  const today = formatDate(new Date());
  const { projectStart } = props.designer.state.config;
  const offsetUnits = getUnitOffset(projectStart, today, timeUnit.value);
  return offsetUnits * cellWidth.value + cellWidth.value / 2;
});

/** 处理任务条鼠标按下 */
const handleTaskMouseDown = (
  e: MouseEvent,
  task: GanttTask,
  mode: "move" | "resize-start" | "resize-end",
) => {
  if (props.readonly) return;
  e.stopPropagation();
  e.preventDefault();
  props.designer.selectTask(task.id);
  dragState.value = {
    taskId: task.id,
    startX: e.clientX,
    mode,
    originalStart: task.startDate,
    originalEnd: task.endDate,
  };
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

/** 处理鼠标移动（按时间单位拖动） */
const handleMouseMove = (e: MouseEvent) => {
  if (!dragState.value) return;
  const dx = e.clientX - dragState.value.startX;
  const unitOffset = Math.round(dx / cellWidth.value);
  if (unitOffset === 0) return;
  const task = props.designer.state.tasks.find(
    (t) => t.id === dragState.value!.taskId,
  );
  if (!task) return;

  const unit = timeUnit.value;
  const original = dragState.value;
  /** 按时间单位计算日期偏移 */
  const shiftDate = (dateStr: string, offset: number): string => {
    const d = parseDate(dateStr);
    if (unit === "day") d.setDate(d.getDate() + offset);
    else if (unit === "week") d.setDate(d.getDate() + offset * 7);
    else if (unit === "month") d.setMonth(d.getMonth() + offset);
    else if (unit === "quarter") d.setMonth(d.getMonth() + offset * 3);
    else d.setFullYear(d.getFullYear() + offset);
    return formatDate(d);
  };

  if (original.mode === "move") {
    task.startDate = shiftDate(original.originalStart, unitOffset);
    task.endDate = shiftDate(original.originalEnd, unitOffset);
  } else if (original.mode === "resize-end") {
    const newEnd = shiftDate(original.originalEnd, unitOffset);
    if (parseDate(newEnd) >= parseDate(task.startDate)) {
      task.endDate = newEnd;
    }
  } else if (original.mode === "resize-start") {
    const newStart = shiftDate(original.originalStart, unitOffset);
    if (parseDate(newStart) <= parseDate(task.endDate)) {
      task.startDate = newStart;
    }
  }
};

/** 处理鼠标松开 */
const handleMouseUp = () => {
  dragState.value = null;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};

/** 处理连线起点 */
const handleLinkStart = (e: MouseEvent, task: GanttTask) => {
  if (props.readonly) return;
  e.stopPropagation();
  linkState.value = { sourceId: task.id };
};

/** 处理连线终点 */
const handleLinkEnd = (task: GanttTask) => {
  if (!linkState.value || linkState.value.sourceId === task.id) return;
  props.designer.addLink(
    linkState.value.sourceId,
    task.id,
    "finishToStart" as GanttLinkType,
  );
  linkState.value = null;
};

/** 双击编辑 */
const handleDblClick = (task: GanttTask) => {
  emit("edit", task.id);
};

/** 计算连线路径 */
const getLinkPath = (link: { source: string; target: string }) => {
  const source = props.designer.state.tasks.find((t) => t.id === link.source);
  const target = props.designer.state.tasks.find((t) => t.id === link.target);
  if (!source || !target) return "";
  const sp = getTaskPosition(source);
  const tp = getTaskPosition(target);
  const sourceIndex = props.designer.sortedTasks.value.findIndex(
    (t) => t.id === source.id,
  );
  const targetIndex = props.designer.sortedTasks.value.findIndex(
    (t) => t.id === target.id,
  );
  const sx = sp.left + sp.width;
  const sy = sourceIndex * rowHeight.value + rowHeight.value / 2;
  const tx = tp.left;
  const ty = targetIndex * rowHeight.value + rowHeight.value / 2;
  const midX = (sx + tx) / 2;
  return `M ${sx},${sy} C ${midX},${sy} ${midX},${ty} ${tx},${ty}`;
};

/** 时间轴单元格类名（基于单元格起始日期） */
const getCellClass = (cell: GanttTimelineCell) => ({
  weekend: props.designer.state.config.showWeekend && cell.hasWeekend,
  today: props.designer.state.config.showToday && isToday(cell.date),
});

const timelineWidth = computed(
  () => timelineCells.value.length * cellWidth.value,
);
const bodyHeight = computed(
  () => props.designer.sortedTasks.value.length * rowHeight.value,
);

/** 监听选中任务，自动滚动到可见区域 */
watch(
  () => props.designer.selectedTaskId.value,
  (id) => {
    if (!id) return;
    const idx = props.designer.sortedTasks.value.findIndex((t) => t.id === id);
    if (idx < 0) return;
    const container = canvasScrollRef.value;
    if (!container) return;
    const headerHeight = 52; // 时间轴头高度
    const rowY = idx * rowHeight.value;
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
  <div class="gantt-canvas" ref="canvasScrollRef">
    <!-- 时间轴头 -->
    <div class="timeline-header" :style="{ width: `${timelineWidth}px` }">
      <div class="timeline-row top-row">
        <template v-for="(group, idx) in timelineGroups" :key="idx">
          <div
            class="timeline-cell top-cell"
            :style="{ width: `${group.count * cellWidth}px` }"
          >
            {{ group.label }}
          </div>
        </template>
      </div>
      <div class="timeline-row bottom-row">
        <div
          v-for="cell in timelineCells"
          :key="cell.date"
          class="timeline-cell bottom-cell"
          :class="getCellClass(cell)"
          :style="{ width: `${cellWidth}px` }"
        >
          {{ cell.label }}
        </div>
      </div>
    </div>

    <!-- 主体（网格 + 任务条 + 连线） -->
    <div class="gantt-body-wrapper">
      <div
        class="gantt-body"
        :style="{ width: `${timelineWidth}px`, height: `${bodyHeight}px` }"
      >
        <!-- 网格列 -->
        <div class="grid-layer">
          <div
            v-for="cell in timelineCells"
            :key="cell.date"
            class="grid-col"
            :class="getCellClass(cell)"
            :style="{ width: `${cellWidth}px` }"
          />
        </div>

        <!-- 网格行 -->
        <div class="grid-row-layer">
          <div
            v-for="(task, idx) in sortedTaskList"
            :key="task.id"
            class="grid-row"
            :class="{ selected: task.id === selectedTaskId }"
            :style="{ height: `${rowHeight}px`, top: `${idx * rowHeight}px` }"
            @click="designer.selectTask(task.id)"
          />
        </div>

        <!-- 今日线 -->
        <div
          v-if="designer.state.config.showToday"
          class="today-line"
          :style="{ left: `${todayLeft}px` }"
        />

        <!-- 任务条 -->
        <div class="task-layer">
          <div
            v-for="(task, idx) in sortedTaskList"
            :key="task.id"
            class="task-bar-wrapper"
            :style="{
              left: `${getTaskPosition(task).left}px`,
              width: `${getTaskPosition(task).width}px`,
              top: `${idx * rowHeight + 4}px`,
              height: `${rowHeight - 8}px`,
            }"
          >
            <!-- 里程碑 -->
            <div
              v-if="task.isMilestone"
              class="milestone-marker"
              :style="{
                borderColor: getTaskColor(task),
                width: `${MILESTONE_SIZE}px`,
                height: `${MILESTONE_SIZE}px`,
              }"
              @mousedown="(e) => handleTaskMouseDown(e, task, 'move')"
              @dblclick="handleDblClick(task)"
            >
              <span class="milestone-text">{{ task.name }}</span>
            </div>

            <!-- 普通任务条 -->
            <template v-else>
              <div
                class="task-bar"
                :class="{
                  critical:
                    task.isCritical && designer.state.config.showCritical,
                  selected: task.id === selectedTaskId,
                }"
                :style="{
                  backgroundColor: getTaskColor(task),
                  opacity: task.status === 'paused' ? 0.5 : 1,
                }"
                @mousedown="(e) => handleTaskMouseDown(e, task, 'move')"
                @dblclick="handleDblClick(task)"
              >
                <!-- 进度条 -->
                <div
                  v-if="designer.state.config.showProgress"
                  class="progress-bar"
                  :style="{ width: `${task.progress}%` }"
                />
                <span class="task-label"
                  >{{ task.name }} {{ task.progress }}%</span
                >
              </div>

              <!-- 调整手柄 -->
              <div
                v-if="!readonly"
                class="resize-handle resize-left"
                @mousedown="(e) => handleTaskMouseDown(e, task, 'resize-start')"
              />
              <div
                v-if="!readonly"
                class="resize-handle resize-right"
                @mousedown="(e) => handleTaskMouseDown(e, task, 'resize-end')"
              />
              <div
                v-if="!readonly"
                class="link-handle"
                @mousedown="(e) => handleLinkStart(e, task)"
                @mouseup="handleLinkEnd(task)"
              />
            </template>
          </div>
        </div>

        <!-- 依赖连线 -->
        <svg
          v-if="designer.state.config.showLinks"
          class="link-layer"
          :width="timelineWidth"
          :height="bodyHeight"
        >
          <path
            v-for="link in designer.state.links"
            :key="link.id"
            :d="getLinkPath(link)"
            class="link-path"
            :class="{ critical: false }"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gantt-canvas {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: var(--el-bg-color);
  position: relative;

  .timeline-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color);

    .timeline-row {
      display: flex;
      height: 24px;

      &.top-row {
        background: var(--el-fill-color-light);
        border-bottom: 1px solid var(--el-border-color);
      }

      &.bottom-row {
        height: 28px;
      }

      .timeline-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        border-right: 1px solid var(--el-border-color-lighter);
        flex-shrink: 0;

        &.weekend {
          background: var(--el-fill-color-lighter);
        }

        &.today {
          background: var(--el-color-danger-light-9);
          color: var(--el-color-danger);
          font-weight: 600;
        }
      }
    }
  }

  .gantt-body-wrapper {
    position: relative;
  }

  .gantt-body {
    position: relative;

    .grid-layer {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;

      .grid-col {
        height: 100%;
        border-right: 1px solid var(--el-border-color-lighter);
        flex-shrink: 0;

        &.weekend {
          background: var(--el-fill-color-lighter);
        }

        &.today {
          background: var(--el-color-danger-light-9);
        }
      }
    }

    .grid-row-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      .grid-row {
        position: absolute;
        left: 0;
        width: 100%;
        border-bottom: 1px dashed var(--el-border-color-lighter);
        cursor: pointer;

        &.selected {
          background: var(--el-color-primary-light-9);
        }
      }
    }

    .today-line {
      position: absolute;
      top: 0;
      width: 2px;
      height: 100%;
      background: v-bind(TODAY_LINE_COLOR);
      z-index: 5;
      pointer-events: none;
    }

    .task-layer {
      position: absolute;
      top: 0;
      left: 0;

      .task-bar-wrapper {
        position: absolute;
        display: flex;
        align-items: center;

        .task-bar {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          color: #ffffff;
          font-size: 12px;
          cursor: move;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 0 6px;

          &.critical {
            border: 2px solid v-bind(CRITICAL_COLOR);
          }

          &.selected {
            border: 2px solid #096dd9;
            box-shadow: 0 0 8px rgba(64, 158, 255, 0.4);
          }

          .progress-bar {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background: rgba(0, 0, 0, 0.25);
          }

          .task-label {
            position: relative;
            z-index: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .resize-handle {
          position: absolute;
          top: 0;
          width: 6px;
          height: 100%;
          cursor: ew-resize;
          background: rgba(0, 0, 0, 0.2);

          &.resize-left {
            left: 0;
          }

          &.resize-right {
            right: 0;
          }
        }

        .link-handle {
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid var(--el-color-primary);
          cursor: crosshair;
          z-index: 2;
        }

        .milestone-marker {
          position: relative;
          transform: rotate(45deg);
          background: #ffffff;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: move;

          .milestone-text {
            transform: rotate(-45deg);
            position: absolute;
            white-space: nowrap;
            left: 24px;
            font-size: 12px;
            color: var(--el-text-color-primary);
          }
        }
      }
    }

    .link-layer {
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 4;

      .link-path {
        fill: none;
        stroke: #666;
        stroke-width: 1.5;
        marker-end: url(#arrow);

        &.critical {
          stroke: v-bind(CRITICAL_COLOR);
        }
      }
    }
  }
}
</style>
