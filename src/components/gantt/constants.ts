/**
 * 甘特图常量定义
 * 单一职责：仅导出常量与工厂函数
 */
import {i18n} from "@/lang";
import type {GanttConfig, GanttPriorityPreset, GanttStatusPreset, GanttTask, GanttTimeUnit,} from "./types";

/** 默认每日像素宽度 */
export const DEFAULT_DAY_WIDTH = 40;

/** 默认行高 */
export const DEFAULT_ROW_HEIGHT = 36;

/** 默认甘特图配置 */
export const DEFAULT_GANTT_CONFIG: GanttConfig = {
    timeUnit: "day",
    projectStart: new Date().toISOString().slice(0, 10),
    projectEnd: (() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 3);
        return d.toISOString().slice(0, 10);
    })(),
    dayWidth: DEFAULT_DAY_WIDTH,
    rowHeight: DEFAULT_ROW_HEIGHT,
    showWeekend: true,
    showToday: true,
    showGrid: true,
    showProgress: true,
    showLinks: true,
    showCritical: false,
    weekStart: 1,
};

/** 任务状态预设 */
export const GANTT_STATUS_PRESETS: GanttStatusPreset[] = [
    {value: "pending", label: i18n("gantt.status.pending"), color: "#909399"},
    {value: "inProgress", label: i18n("gantt.status.inProgress"), color: "#409EFF"},
    {value: "completed", label: i18n("gantt.status.completed"), color: "#67C23A"},
    {value: "delayed", label: i18n("gantt.status.delayed"), color: "#F56C6C"},
    {value: "paused", label: i18n("gantt.status.paused"), color: "#E6A23C"},
];

/** 任务优先级预设 */
export const GANTT_PRIORITY_PRESETS: GanttPriorityPreset[] = [
    {value: "low", label: i18n("gantt.priority.low"), color: "#909399"},
    {value: "medium", label: i18n("gantt.priority.medium"), color: "#409EFF"},
    {value: "high", label: i18n("gantt.priority.high"), color: "#E6A23C"},
    {value: "urgent", label: i18n("gantt.priority.urgent"), color: "#F56C6C"},
];

/** 时间单位选项 */
export const GANTT_TIME_UNIT_OPTIONS: { value: GanttTimeUnit; label: string }[] = [
    {value: "day", label: i18n("gantt.unit.day")},
    {value: "week", label: i18n("gantt.unit.week")},
    {value: "month", label: i18n("gantt.unit.month")},
    {value: "quarter", label: i18n("gantt.unit.quarter")},
    {value: "year", label: i18n("gantt.unit.year")},
];

/** 创建新任务工厂函数 */
export const createTask = (overrides: Partial<GanttTask> = {}): GanttTask => ({
    id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: i18n("gantt.task.newTask"),
    parentId: null,
    order: 0,
    level: 0,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d.toISOString().slice(0, 10);
    })(),
    progress: 0,
    status: "pending",
    priority: "medium",
    isMilestone: false,
    isCritical: false,
    ...overrides,
});

/** 里程碑形状大小 */
export const MILESTONE_SIZE = 16;

/** 周末颜色 */
export const WEEKEND_COLOR = "#FAFAFA";

/** 今日线颜色 */
export const TODAY_LINE_COLOR = "#F56C6C";

/** 关键路径颜色 */
export const CRITICAL_COLOR = "#F56C6C";
