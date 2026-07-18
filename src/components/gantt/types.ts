/**
 * 甘特图类型定义
 * 单一职责：仅定义类型，不含业务逻辑
 */

/** 甘特图时间单位 */
export type GanttTimeUnit = "day" | "week" | "month" | "quarter" | "year";

/** 任务状态 */
export type GanttTaskStatus =
    | "pending"
    | "inProgress"
    | "completed"
    | "delayed"
    | "paused";

/** 任务优先级 */
export type GanttTaskPriority = "low" | "medium" | "high" | "urgent";

/** 任务依赖类型 */
export type GanttLinkType = "finishToStart" | "startToStart" | "finishToFinish" | "startToFinish";

/** 任务条样式 */
export interface GanttTaskStyle {
    fill?: string;
    stroke?: string;
    textColor?: string;
    progressFill?: string;
}

/** 甘特图任务 */
export interface GanttTask {
    /** 任务唯一ID */
    id: string;
    /** 任务名称 */
    name: string;
    /** 父任务ID（用于WBS树形结构） */
    parentId?: string | null;
    /** 排序序号 */
    order: number;
    /** 层级 */
    level: number;
    /** 计划开始时间 */
    startDate: string;
    /** 计划结束时间 */
    endDate: string;
    /** 实际开始时间 */
    actualStartDate?: string;
    /** 实际结束时间 */
    actualEndDate?: string;
    /** 进度（0-100） */
    progress: number;
    /** 负责人 */
    assignee?: string;
    /** 状态 */
    status: GanttTaskStatus;
    /** 优先级 */
    priority: GanttTaskPriority;
    /** 工时（小时） */
    workHours?: number;
    /** 备注 */
    remark?: string;
    /** 任务条样式 */
    style?: GanttTaskStyle;
    /** 是否为里程碑 */
    isMilestone?: boolean;
    /** 是否关键路径 */
    isCritical?: boolean;
    /** 自定义扩展字段 */
    extra?: Record<string, any>;
}

/** 任务依赖关系 */
export interface GanttLink {
    id: string;
    /** 前置任务ID */
    source: string;
    /** 后置任务ID */
    target: string;
    /** 依赖类型 */
    type: GanttLinkType;
    /** 延迟天数 */
    lag?: number;
}

/** 甘特图配置 */
export interface GanttConfig {
    /** 时间单位 */
    timeUnit: GanttTimeUnit;
    /** 项目开始时间 */
    projectStart: string;
    /** 项目结束时间 */
    projectEnd: string;
    /** 每日像素宽度 */
    dayWidth: number;
    /** 行高 */
    rowHeight: number;
    /** 是否显示周末 */
    showWeekend: boolean;
    /** 是否显示今日线 */
    showToday: boolean;
    /** 是否显示网格 */
    showGrid: boolean;
    /** 是否显示进度 */
    showProgress: boolean;
    /** 是否显示依赖关系 */
    showLinks: boolean;
    /** 是否显示关键路径 */
    showCritical: boolean;
    /** 周起始日（0=周日，1=周一） */
    weekStart: number;
}

/** 甘特图数据 */
export interface GanttData {
    /** 任务列表 */
    tasks: GanttTask[];
    /** 依赖关系 */
    links: GanttLink[];
    /** 配置 */
    config: GanttConfig;
    /** 项目名称 */
    name: string;
}

/** 任务状态预设 */
export interface GanttStatusPreset {
    value: GanttTaskStatus;
    label: string;
    color: string;
}

/** 任务优先级预设 */
export interface GanttPriorityPreset {
    value: GanttTaskPriority;
    label: string;
    color: string;
}
