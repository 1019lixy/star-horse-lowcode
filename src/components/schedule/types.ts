/**
 * 调度视图类型定义
 */

/** 调度视图模式 */
export type ScheduleViewMode = "day" | "week" | "month";

/** 调度事件类型 */
export type ScheduleEventType =
  | "meeting"
  | "task"
  | "appointment"
  | "leave"
  | "training"
  | "maintenance"
  | "custom";

/** 调度资源类型 */
export type ScheduleResourceType = "person" | "equipment" | "room" | "vehicle";

/** 调度事件 */
export interface ScheduleEvent {
  id: string;
  /** 事件标题 */
  title: string;
  /** 描述 */
  description?: string;
  /** 关联资源ID */
  resourceId: string;
  /** 开始时间 */
  startTime: string;
  /** 结束时间 */
  endTime: string;
  /** 事件类型 */
  type: ScheduleEventType;
  /** 颜色 */
  color?: string;
  /** 是否全天 */
  allDay?: boolean;
  /** 重复规则（iCal RRULE） */
  rrule?: string;
  /** 地点 */
  location?: string;
  /** 参与者 */
  attendees?: string[];
  /** 备注 */
  remark?: string;
  /** 自定义字段 */
  extra?: Record<string, any>;
}

/** 调度资源 */
export interface ScheduleResource {
  id: string;
  /** 资源名称 */
  name: string;
  /** 资源类型 */
  type: ScheduleResourceType;
  /** 颜色 */
  color?: string;
  /** 头像 */
  avatar?: string;
  /** 排序 */
  order: number;
  /** 工作时间（每天时段，如 ["09:00-12:00", "13:00-18:00"]） */
  workingHours?: string[];
  /** 是否启用 */
  enabled?: boolean;
}

/** 调度配置 */
export interface ScheduleConfig {
  /** 视图模式 */
  viewMode: ScheduleViewMode;
  /** 行高（资源列表与画布对齐用） */
  rowHeight: number;
  /** 单元格高度 */
  cellHeight: number;
  /** 单元格宽度（分钟单位） */
  cellWidth: number;
  /** 一天开始小时 */
  dayStartHour: number;
  /** 一天结束小时 */
  dayEndHour: number;
  /** 是否显示周末 */
  showWeekend: boolean;
  /** 是否显示网格 */
  showGrid: boolean;
  /** 是否显示工作时间 */
  showWorkingHours: boolean;
  /** 是否允许重叠事件 */
  allowOverlap: boolean;
  /** 时间槽（分钟） */
  timeSlot: number;
}

/** 调度数据 */
export interface ScheduleData {
  events: ScheduleEvent[];
  resources: ScheduleResource[];
  config: ScheduleConfig;
  name: string;
}

/** 事件类型预设 */
export interface ScheduleEventTypePreset {
  value: ScheduleEventType;
  label: string;
  color: string;
}

/** 资源类型预设 */
export interface ScheduleResourceTypePreset {
  value: ScheduleResourceType;
  label: string;
  icon: string;
}
