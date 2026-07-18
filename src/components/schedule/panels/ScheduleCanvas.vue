<script setup lang="ts" name="ScheduleCanvas">
import { computed, ref } from "vue";
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

/** 时间轴小时列表 */
const hourSlots = computed(() =>
    getHourSlots(
        props.designer.state.config.dayStartHour,
        props.designer.state.config.dayEndHour,
    ),
);

/** 视图日期范围 */
const viewDates = computed(() =>
    getViewDateRange(props.designer.state.config.viewMode, props.designer.anchorDate.value),
);

/** 单元格高度 */
const cellHeight = computed(() => props.designer.state.config.cellHeight);

/** 每小时像素高度 */
const hourHeight = computed(() => cellHeight.value * (60 / props.designer.state.config.timeSlot));

/** 资源列宽度 */
const resourceColWidth = 120;

/** 时间列宽度 */
const timeColWidth = 60;

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
const getEventsForResource = (resourceId: string, date: Date): ScheduleEvent[] => {
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
    originalStart: string;
    originalEnd: string;
    originalResourceId: string;
} | null>(null);

/** 处理事件鼠标按下 */
const handleEventMouseDown = (e: MouseEvent, event: ScheduleEvent) => {
    if (props.readonly) return;
    e.stopPropagation();
    e.preventDefault();
    props.designer.selectEvent(event.id);
    dragState.value = {
        eventId: event.id,
        startY: e.clientY,
        originalStart: event.startTime,
        originalEnd: event.endTime,
        originalResourceId: event.resourceId,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
};

const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.value) return;
    const dy = e.clientY - dragState.value.startY;
    const minOffset = Math.round(dy / hourHeight.value * 60 / props.designer.state.config.timeSlot) * props.designer.state.config.timeSlot;
    if (minOffset === 0) return;
    const event = props.designer.state.events.find((ev) => ev.id === dragState.value!.eventId);
    if (!event) return;
    const original = dragState.value;
    const newStart = new Date(parseTime(original.originalStart));
    newStart.setMinutes(newStart.getMinutes() + minOffset);
    const newEnd = new Date(parseTime(original.originalEnd));
    newEnd.setMinutes(newEnd.getMinutes() + minOffset);
    event.startTime = newStart.toISOString();
    event.endTime = newEnd.toISOString();
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

/** 表体总高度 */
const bodyHeight = computed(() => hourSlots.value.length * hourHeight.value);
</script>

<template>
    <div class="schedule-canvas">
        <div class="canvas-container">
            <!-- 表头 -->
            <div class="schedule-header">
                <div class="header-cell header-corner" :style="{ width: `${timeColWidth}px` }">
                    {{ i18n("schedule.label.resource") }}
                </div>
                <template v-if="designer.state.config.viewMode === 'month'">
                    <div class="header-cell month-header">
                        {{ designer.anchorDate.value.getFullYear() }}-{{ designer.anchorDate.value.getMonth() + 1 }}
                    </div>
                </template>
                <template v-else>
                    <div
                        v-for="date in viewDates"
                        :key="date.toISOString()"
                        class="header-cell date-header"
                        :class="{ weekend: designer.state.config.showWeekend && isWeekend(date), today: isToday(date) }"
                    >
                        <div class="date-label">{{ formatDayLabel(date) }}</div>
                        <div class="weekday-label">{{ i18n('schedule.label.weekday') }}{{ formatWeekday(date) }}</div>
                    </div>
                </template>
            </div>

            <!-- 月视图（简化的网格） -->
            <div v-if="designer.state.config.viewMode === 'month'" class="month-view">
                <div
                    v-for="date in viewDates"
                    :key="date.toISOString()"
                    class="month-cell"
                    :class="{ weekend: designer.state.config.showWeekend && isWeekend(date), today: isToday(date) }"
                >
                    <div class="month-day-label">{{ formatDayLabel(date) }}</div>
                    <div class="month-events">
                        <div
                            v-for="event in designer.state.events.filter(e => isSameDay(parseTime(e.startTime), date))"
                            :key="event.id"
                            class="month-event"
                            :style="{ backgroundColor: getEventColor(event.type) }"
                            @click="designer.selectEvent(event.id)"
                            @dblclick="handleDblClick(event)"
                        >
                            {{ formatHourMinute(parseTime(event.startTime)) }} {{ event.title }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 日/周视图（时间网格） -->
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
                        v-for="resource in designer.sortedResources.value"
                        :key="resource.id"
                        class="resource-row"
                    >
                        <!-- 资源名 -->
                        <div class="resource-name" :style="{ width: `${resourceColWidth}px` }">
                            <el-avatar :size="24" :src="resource.avatar">
                                {{ resource.name.charAt(0) }}
                            </el-avatar>
                            <span>{{ resource.name }}</span>
                        </div>

                        <!-- 资源的时间网格 -->
                        <div class="resource-grid" :style="{ height: `${bodyHeight}px` }">
                            <div
                                v-for="date in viewDates"
                                :key="date.toISOString()"
                                class="date-column"
                                :class="{ weekend: designer.state.config.showWeekend && isWeekend(date), today: isToday(date) }"
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
                                    :style="{
                                        backgroundColor: getEventColor(event.type),
                                        top: `${getEventPosition(event, date).top}px`,
                                        height: `${getEventPosition(event, date).height}px`
                                    }"
                                    @mousedown="(e) => handleEventMouseDown(e, event)"
                                    @dblclick="handleDblClick(event)"
                                >
                                    <div class="event-title">{{ event.title }}</div>
                                    <div class="event-time">
                                        {{ formatHourMinute(parseTime(event.startTime)) }} - {{ formatHourMinute(parseTime(event.endTime)) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.schedule-canvas {
    flex: 1;
    overflow: auto;
    background: var(--el-bg-color);

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
                    color: #FFFFFF;
                    padding: 2px 4px;
                    border-radius: 2px;
                    cursor: pointer;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

    .time-grid-view {
        display: flex;

        .time-column {
            flex-shrink: 0;

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

                .resource-name {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px;
                    border-right: 1px solid var(--el-border-color);
                    font-size: 13px;
                    flex-shrink: 0;
                }

                .resource-grid {
                    display: flex;
                    position: relative;

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
                            color: #FFFFFF;
                            font-size: 11px;
                            padding: 2px 4px;
                            cursor: move;
                            overflow: hidden;
                            z-index: 2;

                            &:hover {
                                z-index: 3;
                                box-shadow: 0 2px 6px rgba(0,0,0,0.15);
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
                        }
                    }
                }
            }
        }
    }
}
</style>
