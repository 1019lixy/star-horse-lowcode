<script setup lang="ts" name="ScheduleCanvas">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { i18n } from "@/lang";
import type { ScheduleDesigner } from "../composables/useScheduleDesigner";
import { getEventColor } from "../constants";
import {
  formatDayLabel,
  formatHourMinute,
  formatWeekday,
  getHourSlots,
  getViewDateRange,
  isSameDay,
  isToday,
  isWeekend,
  minutesBetween,
  parseTime,
} from "../utils/ScheduleDateUtils";
import type { ScheduleEvent } from "../types";

const props = defineProps<{
  designer: ScheduleDesigner;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", eventId: string): void;
  (e: "create", startTime: string, resourceId: string): void;
}>();

const canvasScrollRef = ref<HTMLElement>();
const canvasContainerRef = ref<HTMLElement>();

/** 暴露滚动元素供 ScheduleView 同步 */
defineExpose({ canvasScrollRef });

/** 时间轴小时列表 */
const hourSlots = computed(() =>
  getHourSlots(
    props.designer.state.config.dayStartHour,
    props.designer.state.config.dayEndHour,
  ),
);

/** 视图日期范围 */
const viewDates = computed(() =>
  getViewDateRange(
    props.designer.state.config.viewMode,
    props.designer.anchorDate.value,
  ),
);

/** 单元格高度 */
const cellHeight = computed(() => props.designer.state.config.cellHeight);

/** 每小时像素高度 */
const hourHeight = computed(
  () => cellHeight.value * (60 / props.designer.state.config.timeSlot),
);

/** 时间列宽度 */
const timeColWidth = 60;

/** 选中状态 */
const selectedEventId = computed(() => props.designer.selectedEventId.value);
const selectedResourceId = computed(
  () => props.designer.selectedResourceId.value,
);

/** 计算事件位置 */
const getEventPosition = (event: ScheduleEvent, date: Date) => {
  const start = parseTime(event.startTime);
  const end = parseTime(event.endTime);
  const dayStart = new Date(date);
  dayStart.setHours(props.designer.state.config.dayStartHour, 0, 0, 0);

  const startOffsetMin = Math.max(0, minutesBetween(dayStart, start));
  const durationMin = minutesBetween(start, end);
  const top = (startOffsetMin / 60) * hourHeight.value;
  const height = Math.max((durationMin / 60) * hourHeight.value, 18);
  return { top, height };
};

/** 获取指定资源在某日的事件 */
const getEventsForResource = (
  resourceId: string,
  date: Date,
): ScheduleEvent[] => {
  return props.designer.state.events.filter((e) => {
    if (e.resourceId !== resourceId) return false;
    const start = parseTime(e.startTime);
    return isSameDay(start, date);
  });
};

/** 拖拽状态 */
const dragState = ref<{
  eventId: string;
  startY: number;
  mode: "move" | "resize";
  originalStart: string;
  originalEnd: string;
} | null>(null);

/** 处理事件鼠标按下 */
const handleEventMouseDown = (
  e: MouseEvent,
  event: ScheduleEvent,
  mode: "move" | "resize",
) => {
  if (props.readonly) return;
  e.stopPropagation();
  e.preventDefault();
  props.designer.selectEvent(event.id);
  dragState.value = {
    eventId: event.id,
    startY: e.clientY,
    mode,
    originalStart: event.startTime,
    originalEnd: event.endTime,
  };
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

const handleMouseMove = (e: MouseEvent) => {
  if (!dragState.value) return;
  const dy = e.clientY - dragState.value.startY;
  const minOffset =
    Math.round(
      ((dy / hourHeight.value) * 60) / props.designer.state.config.timeSlot,
    ) * props.designer.state.config.timeSlot;
  if (minOffset === 0) return;
  const event = props.designer.state.events.find(
    (ev) => ev.id === dragState.value!.eventId,
  );
  if (!event) return;
  const original = dragState.value;

  if (original.mode === "move") {
    const newStart = new Date(parseTime(original.originalStart));
    newStart.setMinutes(newStart.getMinutes() + minOffset);
    const newEnd = new Date(parseTime(original.originalEnd));
    newEnd.setMinutes(newEnd.getMinutes() + minOffset);
    event.startTime = newStart.toISOString();
    event.endTime = newEnd.toISOString();
  } else if (original.mode === "resize") {
    const newEnd = new Date(parseTime(original.originalEnd));
    newEnd.setMinutes(newEnd.getMinutes() + minOffset);
    const start = parseTime(event.startTime);
    if (newEnd > start) {
      event.endTime = newEnd.toISOString();
    }
  }
};

const handleMouseUp = () => {
  dragState.value = null;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};

/** 处理空白格子点击创建事件 */
const handleCellClick = (date: Date, hour: number, resourceId: string) => {
  if (props.readonly) return;
  const start = new Date(date);
  start.setHours(hour, 0, 0, 0);
  emit("create", start.toISOString(), resourceId);
};

/** 双击编辑 */
const handleDblClick = (event: ScheduleEvent) => {
  emit("edit", event.id);
};

/** 右键菜单 */
const contextMenu = ref<{
  visible: boolean;
  x: number;
  y: number;
  eventId: string | null;
  resourceId: string;
}>({
  visible: false,
  x: 0,
  y: 0,
  eventId: null,
  resourceId: "",
});

const handleContextMenu = (
  e: MouseEvent,
  event: ScheduleEvent | null,
  resourceId: string,
) => {
  if (props.readonly) return;
  e.preventDefault();
  e.stopPropagation();
  if (event) {
    props.designer.selectEvent(event.id);
    contextMenu.value = {
      visible: true,
      x: e.clientX,
      y: e.clientY,
      eventId: event.id,
      resourceId,
    };
  } else {
    props.designer.selectResource(resourceId);
    contextMenu.value = {
      visible: true,
      x: e.clientX,
      y: e.clientY,
      eventId: null,
      resourceId,
    };
  }
};

const closeContextMenu = () => {
  contextMenu.value.visible = false;
};

const handleCtxAddEvent = () => {
  const rId = contextMenu.value.resourceId;
  if (!rId) return;
  const now = new Date();
  now.setMinutes(0, 0, 0);
  emit("create", now.toISOString(), rId);
  closeContextMenu();
};

const handleCtxDeleteEvent = () => {
  const eId = contextMenu.value.eventId;
  if (eId) props.designer.removeEvent(eId);
  closeContextMenu();
};

const handleCtxEditEvent = () => {
  const eId = contextMenu.value.eventId;
  if (eId) emit("edit", eId);
  closeContextMenu();
};

const handleCtxCopyEvent = () => {
  const eId = contextMenu.value.eventId;
  if (!eId) return;
  const source = props.designer.state.events.find((e) => e.id === eId);
  if (!source) return;
  props.designer.addEvent({
    ...source,
    title: source.title + " (copy)",
  });
  closeContextMenu();
};

/** 全局点击关闭右键菜单 */
const handleGlobalClick = () => {
  closeContextMenu();
};

/** 表体总高度 */
const bodyHeight = computed(() => hourSlots.value.length * hourHeight.value);

/** ResizeObserver */
const containerWidth = ref(800);
const containerHeight = ref(400);
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  document.addEventListener("click", handleGlobalClick);
  if (canvasContainerRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth.value = entry.contentRect.width;
        containerHeight.value = entry.contentRect.height;
      }
    });
    resizeObserver.observe(canvasContainerRef.value);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleGlobalClick);
  if (resizeObserver) resizeObserver.disconnect();
});

/** 监听选中事件/资源，自动滚动到可见区域 */
watch(
  () =>
    [
      props.designer.selectedEventId.value,
      props.designer.selectedResourceId.value,
    ] as const,
  () => {
    const id = props.designer.selectedResourceId.value;
    if (!id) return;
    const idx = props.designer.sortedResources.value.findIndex(
      (r) => r.id === id,
    );
    if (idx < 0) return;
    const container = canvasScrollRef.value;
    if (!container) return;
    const rowY = idx * bodyHeight.value;
    const scrollTop = container.scrollTop;
    const headerHeight = 52;
    const viewHeight = container.clientHeight - headerHeight;
    if (
      rowY < scrollTop - headerHeight ||
      rowY > scrollTop - headerHeight + viewHeight
    ) {
      container.scrollTop = rowY - viewHeight / 2 + headerHeight;
    }
  },
);
</script>

<template>
  <div class="schedule-canvas" ref="canvasContainerRef">
    <div class="canvas-scroll" ref="canvasScrollRef">
      <div class="canvas-container">
        <!-- 表头 -->
        <div class="schedule-header">
          <div
            class="header-cell header-corner"
            :style="{ width: `${timeColWidth}px` }"
          >
            {{ i18n("schedule.label.resource") }}
          </div>
          <template v-if="designer.state.config.viewMode === 'month'">
            <div class="header-cell month-header">
              {{ designer.anchorDate.value.getFullYear() }}-{{
                designer.anchorDate.value.getMonth() + 1
              }}
            </div>
          </template>
          <template v-else>
            <div
              v-for="date in viewDates"
              :key="date.toISOString()"
              class="header-cell date-header"
              :class="{
                weekend: designer.state.config.showWeekend && isWeekend(date),
                today: isToday(date),
              }"
            >
              <div class="date-label">{{ formatDayLabel(date) }}</div>
              <div class="weekday-label">
                {{ i18n("schedule.label.weekday") }}{{ formatWeekday(date) }}
              </div>
            </div>
          </template>
        </div>

        <!-- 月视图 -->
        <div
          v-if="designer.state.config.viewMode === 'month'"
          class="month-view"
        >
          <div
            v-for="date in viewDates"
            :key="date.toISOString()"
            class="month-cell"
            :class="{
              weekend: designer.state.config.showWeekend && isWeekend(date),
              today: isToday(date),
            }"
          >
            <div class="month-day-label">{{ formatDayLabel(date) }}</div>
            <div class="month-events">
              <div
                v-for="event in designer.state.events.filter((e) =>
                  isSameDay(parseTime(e.startTime), date),
                )"
                :key="event.id"
                class="month-event"
                :class="{ selected: event.id === selectedEventId }"
                :style="{ backgroundColor: getEventColor(event.type) }"
                @click="designer.selectEvent(event.id)"
                @dblclick="handleDblClick(event)"
                @contextmenu="
                  (e) => handleContextMenu(e, event, event.resourceId)
                "
              >
                {{ formatHourMinute(parseTime(event.startTime)) }}
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>

        <!-- 日/周视图 -->
        <div v-else class="time-grid-view">
          <!-- 时间列 -->
          <div class="time-column" :style="{ width: `${timeColWidth}px` }">
            <div
              v-for="hour in hourSlots"
              :key="hour"
              class="time-slot"
              :style="{ height: `${hourHeight}px` }"
            >
              {{ String(hour).padStart(2, "0") }}:00
            </div>
          </div>

          <!-- 主体 -->
          <div class="grid-body">
            <div
              v-for="(resource, rIdx) in designer.sortedResources.value"
              :key="resource.id"
              class="resource-row"
              :class="{
                selected: resource.id === selectedResourceId,
                'row-even': rIdx % 2 === 0,
                'row-odd': rIdx % 2 !== 0,
              }"
              :style="{ height: `${bodyHeight}px` }"
              @contextmenu="(e) => handleContextMenu(e, null, resource.id)"
            >
              <!-- 资源的时间网格 -->
              <div class="resource-grid">
                <div
                  v-for="date in viewDates"
                  :key="date.toISOString()"
                  class="date-column"
                  :class="{
                    weekend:
                      designer.state.config.showWeekend && isWeekend(date),
                    today: isToday(date),
                  }"
                >
                  <div
                    v-for="hour in hourSlots"
                    :key="hour"
                    class="grid-cell"
                    :style="{ height: `${hourHeight}px` }"
                    @click="handleCellClick(date, hour, resource.id)"
                  />
                  <!-- 事件块 -->
                  <div
                    v-for="event in getEventsForResource(resource.id, date)"
                    :key="event.id"
                    class="event-block"
                    :class="{ selected: event.id === selectedEventId }"
                    :style="{
                      backgroundColor: getEventColor(event.type),
                      top: `${getEventPosition(event, date).top}px`,
                      height: `${getEventPosition(event, date).height}px`,
                    }"
                    @mousedown="(e) => handleEventMouseDown(e, event, 'move')"
                    @dblclick="handleDblClick(event)"
                    @contextmenu.stop="
                      (e) => handleContextMenu(e, event, resource.id)
                    "
                  >
                    <div class="event-title">{{ event.title }}</div>
                    <div class="event-time">
                      {{ formatHourMinute(parseTime(event.startTime)) }} -
                      {{ formatHourMinute(parseTime(event.endTime)) }}
                    </div>
                    <!-- resize 右边缘手柄 -->
                    <div
                      v-if="!readonly"
                      class="resize-handle"
                      @mousedown.stop="
                        (e) => handleEventMouseDown(e, event, 'resize')
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
      @click.stop
    >
      <div class="ctx-item" @click="handleCtxAddEvent">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
          />
        </svg>
        {{ i18n("schedule.btn.addEvent") }}
      </div>
      <template v-if="contextMenu.eventId">
        <div class="ctx-item" @click="handleCtxEditEvent">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path
              d="M11 4H4a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1v-7"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
            />
            <path
              d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
            />
          </svg>
          {{ i18n("schedule.btn.editEvent") }}
        </div>
        <div class="ctx-item" @click="handleCtxCopyEvent">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <rect
              x="9"
              y="9"
              width="13"
              height="13"
              rx="2"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
            />
            <path
              d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
            />
          </svg>
          {{ i18n("schedule.btn.copyEvent") }}
        </div>
        <div class="ctx-item danger" @click="handleCtxDeleteEvent">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path
              d="M6 7h12M9 7V5h6v2M8 7v12h8V7M10 11v5M14 11v5"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ i18n("schedule.btn.removeEvent") }}
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.schedule-canvas {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--el-bg-color);
  position: relative;

  .canvas-scroll {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .canvas-container {
    min-width: max-content;
  }

  .schedule-header {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color);

    .header-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4px;
      border-right: 1px solid var(--el-border-color-lighter);
      font-size: 12px;
      flex-shrink: 0;

      &.header-corner {
        width: 60px;
        border-right: 2px solid var(--el-border-color);
      }

      &.date-header {
        min-width: 120px;

        &.weekend {
          background: var(--el-fill-color-lighter);
        }

        &.today {
          background: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
        }
      }

      &.month-header {
        flex: 1;
        min-width: 600px;
        font-weight: 600;
        font-size: 14px;
      }

      .date-label {
        font-weight: 600;
      }

      .weekday-label {
        font-size: 11px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .month-view {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    min-width: 700px;

    .month-cell {
      min-height: 100px;
      border-right: 1px solid var(--el-border-color-lighter);
      border-bottom: 1px solid var(--el-border-color-lighter);
      padding: 4px;

      &.weekend {
        background: var(--el-fill-color-lighter);
      }

      &.today {
        background: var(--el-color-primary-light-9);
      }

      .month-day-label {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        margin-bottom: 4px;
      }

      .month-events {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .month-event {
          font-size: 11px;
          color: #ffffff;
          padding: 2px 4px;
          border-radius: 2px;
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          &.selected {
            border: 2px solid #096dd9;
            box-shadow: 0 0 8px rgba(64, 158, 255, 0.4);
          }
        }
      }
    }
  }

  .time-grid-view {
    display: flex;

    .time-column {
      flex-shrink: 0;
      position: sticky;
      left: 0;
      z-index: 5;
      background: var(--el-bg-color);

      .time-slot {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        padding: 2px 4px;
        font-size: 11px;
        color: var(--el-text-color-secondary);
        border-right: 1px solid var(--el-border-color);
        border-bottom: 1px dashed var(--el-border-color-lighter);
      }
    }

    .grid-body {
      flex: 1;
      overflow-x: auto;

      .resource-row {
        display: flex;
        border-bottom: 2px solid var(--el-border-color);

        &.row-even {
          background: var(--el-bg-color);
        }

        &.row-odd {
          background: var(--el-fill-color-lighter);
        }

        &.selected {
          background: var(--el-color-primary-light-9) !important;
        }

        .resource-grid {
          display: flex;
          position: relative;
          width: 100%;

          .date-column {
            position: relative;
            min-width: 120px;
            border-right: 1px solid var(--el-border-color-lighter);

            &.weekend {
              background: var(--el-fill-color-lighter);
            }

            &.today {
              background: var(--el-color-primary-light-9);
            }

            .grid-cell {
              border-bottom: 1px dashed var(--el-border-color-lighter);
              cursor: pointer;

              &:hover {
                background: var(--el-color-primary-light-9);
              }
            }

            .event-block {
              position: absolute;
              left: 2px;
              right: 2px;
              border-radius: 3px;
              color: #ffffff;
              font-size: 11px;
              padding: 2px 4px;
              cursor: move;
              overflow: hidden;
              z-index: 2;

              &:hover {
                z-index: 3;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
              }

              &.selected {
                border: 2px solid #096dd9;
                box-shadow: 0 0 8px rgba(64, 158, 255, 0.4);
                z-index: 4;
              }

              .event-title {
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .event-time {
                opacity: 0.8;
              }

              .resize-handle {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 6px;
                cursor: s-resize;
                background: rgba(0, 0, 0, 0.15);
                border-radius: 0 0 3px 3px;
                opacity: 0;
                transition: opacity 0.15s;

                &:hover {
                  opacity: 1;
                }
              }

              &:hover .resize-handle {
                opacity: 0.6;
              }
            }
          }
        }
      }
    }
  }

  .context-menu {
    position: fixed;
    z-index: 100;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    padding: 4px 0;
    min-width: 140px;

    .ctx-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 13px;
      color: var(--el-text-color-regular);

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
</style>
