<script setup lang="ts" name="GanttCanvas">
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import type { GanttDesigner } from "../composables/useGanttDesigner";
import {
    CRITICAL_COLOR,
    GANTT_STATUS_PRESETS,
    MILESTONE_SIZE,
    TODAY_LINE_COLOR,
    WEEKEND_COLOR,
} from "../constants";
import {
    daysBetween,
    formatDate,
    formatMonth,
    formatQuarter,
    formatShortDate,
    formatYear,
    getDateRange,
    getMondayOfWeek,
    isToday,
    isWeekend,
    parseDate,
} from "../utils/GanttDateUtils";
import type { GanttLinkType, GanttTask, GanttTimeUnit } from "../types";

const props = defineProps<{
    designer: GanttDesigner;
    readonly?: boolean;
}>();

const emit = defineEmits<{
    (e: "edit", id: string): void;
}>();

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

/** 时间轴日期列表 */
const timelineDates = computed(() => {
    const { projectStart, projectEnd } = props.designer.state.config;
    return getDateRange(projectStart, projectEnd);
});

/** 顶层时间轴分组（按时间单位） */
const timelineGroups = computed(() => {
    const unit: GanttTimeUnit = props.designer.state.config.timeUnit;
    const dates = timelineDates.value;
    if (dates.length === 0) return [];

    const groups: { label: string; count: number }[] = [];
    let prevKey = "";
    let count = 0;

    for (const d of dates) {
        let key = "";
        if (unit === "day") key = formatMonth(d);
        else if (unit === "week") key = formatMonth(d);
        else if (unit === "month") key = formatYear(d);
        else if (unit === "quarter") key = formatYear(d);
        else key = formatYear(d);

        if (key !== prevKey) {
            if (prevKey) groups.push({ label: prevKey, count });
            prevKey = key;
            count = 1;
        } else {
            count++;
        }
    }
    if (prevKey) groups.push({ label: prevKey, count });
    return groups;
});

/** 单元格宽度（按时间单位） */
const cellWidth = computed(() => {
    const unit = props.designer.state.config.timeUnit;
    const widths: Record<GanttTimeUnit, number> = {
        day: props.designer.state.config.dayWidth,
        week: props.designer.state.config.dayWidth,
        month: props.designer.state.config.dayWidth,
        quarter: props.designer.state.config.dayWidth,
        year: props.designer.state.config.dayWidth,
    };
    return widths[unit];
});

const rowHeight = computed(() => props.designer.state.config.rowHeight);

/** 计算任务条位置 */
const getTaskPosition = (task: GanttTask) => {
    const start = parseDate(task.startDate);
    const projectStart = parseDate(props.designer.state.config.projectStart);
    const offsetDays = Math.floor((start.getTime() - projectStart.getTime()) / (24 * 60 * 60 * 1000));
    const duration = daysBetween(task.startDate, task.endDate);
    return {
        left: offsetDays * cellWidth.value,
        width: Math.max(duration * cellWidth.value, cellWidth.value),
    };
};

/** 获取任务颜色 */
const getTaskColor = (task: GanttTask) => {
    if (task.isCritical && props.designer.state.config.showCritical) return CRITICAL_COLOR;
    return GANTT_STATUS_PRESETS.find((s) => s.value === task.status)?.color ?? "#409EFF";
};

/** 今日线位置 */
const todayLeft = computed(() => {
    const today = formatDate(new Date());
    const projectStart = parseDate(props.designer.state.config.projectStart);
    const t = parseDate(today);
    const offset = Math.floor((t.getTime() - projectStart.getTime()) / (24 * 60 * 60 * 1000));
    return offset * cellWidth.value;
});

/** 处理任务条鼠标按下 */
const handleTaskMouseDown = (e: MouseEvent, task: GanttTask, mode: "move" | "resize-start" | "resize-end") => {
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

/** 处理鼠标移动 */
const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.value) return;
    const dx = e.clientX - dragState.value.startX;
    const dayOffset = Math.round(dx / cellWidth.value);
    if (dayOffset === 0) return;
    const task = props.designer.state.tasks.find((t) => t.id === dragState.value!.taskId);
    if (!task) return;

    const original = dragState.value;
    if (original.mode === "move") {
        const newStart = new Date(parseDate(original.originalStart));
        newStart.setDate(newStart.getDate() + dayOffset);
        const newEnd = new Date(parseDate(original.originalEnd));
        newEnd.setDate(newEnd.getDate() + dayOffset);
        task.startDate = formatDate(newStart);
        task.endDate = formatDate(newEnd);
    } else if (original.mode === "resize-end") {
        const newEnd = new Date(parseDate(original.originalEnd));
        newEnd.setDate(newEnd.getDate() + dayOffset);
        if (newEnd >= parseDate(task.startDate)) {
            task.endDate = formatDate(newEnd);
        }
    } else if (original.mode === "resize-start") {
        const newStart = new Date(parseDate(original.originalStart));
        newStart.setDate(newStart.getDate() + dayOffset);
        if (newStart <= parseDate(task.endDate)) {
            task.startDate = formatDate(newStart);
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
    props.designer.addLink(linkState.value.sourceId, task.id, "finishToStart" as GanttLinkType);
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
    const sourceIndex = props.designer.sortedTasks.value.findIndex((t) => t.id === source.id);
    const targetIndex = props.designer.sortedTasks.value.findIndex((t) => t.id === target.id);
    const sx = sp.left + sp.width;
    const sy = sourceIndex * rowHeight.value + rowHeight.value / 2;
    const tx = tp.left;
    const ty = targetIndex * rowHeight.value + rowHeight.value / 2;
    const midX = (sx + tx) / 2;
    return `M ${sx},${sy} C ${midX},${sy} ${midX},${ty} ${tx},${ty}`;
};

/** 时间轴单元格类名 */
const getCellClass = (date: string) => ({
    weekend: props.designer.state.config.showWeekend && isWeekend(date),
    today: props.designer.state.config.showToday && isToday(date),
});

/** 顶层时间轴显示 */
const getTopLabel = (date: string) => {
    const unit = props.designer.state.config.timeUnit;
    if (unit === "day" || unit === "week") return formatMonth(date);
    if (unit === "month") return formatYear(date);
    if (unit === "quarter") return formatYear(date);
    return formatYear(date);
};

/** 底层时间轴显示 */
const getBottomLabel = (date: string) => {
    const unit = props.designer.state.config.timeUnit;
    if (unit === "day") return formatShortDate(date);
    if (unit === "week") return `W${getWeekLabel(date)}`;
    if (unit === "month") return formatMonth(date).split("-")[1];
    if (unit === "quarter") return `Q${Math.floor(parseDate(date).getMonth() / 3) + 1}`;
    return formatMonth(date).split("-")[1];
};

const getWeekLabel = (date: string) => {
    const monday = getMondayOfWeek(date);
    const yearStart = new Date(parseDate(monday).getFullYear(), 0, 1);
    const diff = Math.floor((parseDate(monday).getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((diff + 1) / 7);
};

const timelineWidth = computed(() => timelineDates.value.length * cellWidth.value);
const bodyHeight = computed(() => props.designer.sortedTasks.value.length * rowHeight.value);
</script>

<template>
    <div class="gantt-canvas">
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
                    v-for="date in timelineDates"
                    :key="date"
                    class="timeline-cell bottom-cell"
                    :class="getCellClass(date)"
                    :style="{ width: `${cellWidth}px` }"
                >
                    {{ getBottomLabel(date) }}
                </div>
            </div>
        </div>

        <!-- 主体（网格 + 任务条 + 连线） -->
        <div class="gantt-body-wrapper">
            <div class="gantt-body" :style="{ width: `${timelineWidth}px`, height: `${bodyHeight}px` }">
                <!-- 网格列 -->
                <div class="grid-layer">
                    <div
                        v-for="date in timelineDates"
                        :key="date"
                        class="grid-col"
                        :class="getCellClass(date)"
                        :style="{ width: `${cellWidth}px` }"
                    />
                </div>

                <!-- 网格行 -->
                <div class="grid-row-layer">
                    <div
                        v-for="(task, idx) in designer.sortedTasks.value"
                        :key="task.id"
                        class="grid-row"
                        :class="{ selected: task.id === designer.selectedTaskId }"
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
                        v-for="(task, idx) in designer.sortedTasks.value"
                        :key="task.id"
                        class="task-bar-wrapper"
                        :style="{
                            left: `${getTaskPosition(task).left}px`,
                            width: `${getTaskPosition(task).width}px`,
                            top: `${idx * rowHeight + 4}px`,
                            height: `${rowHeight - 8}px`
                        }"
                    >
                        <!-- 里程碑 -->
                        <div
                            v-if="task.isMilestone"
                            class="milestone-marker"
                            :style="{
                                borderColor: getTaskColor(task),
                                width: `${MILESTONE_SIZE}px`,
                                height: `${MILESTONE_SIZE}px`
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
                                :class="{ critical: task.isCritical && designer.state.config.showCritical }"
                                :style="{
                                    backgroundColor: getTaskColor(task),
                                    opacity: task.status === 'paused' ? 0.5 : 1
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
                                <span class="task-label">{{ task.name }}</span>
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
    flex: 1;
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
                    color: #FFFFFF;
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
                    background: #FFFFFF;
                    border: 2px solid var(--el-color-primary);
                    cursor: crosshair;
                    z-index: 2;
                }

                .milestone-marker {
                    position: relative;
                    transform: rotate(45deg);
                    background: #FFFFFF;
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
