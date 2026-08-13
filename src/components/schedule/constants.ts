/**
 * 调度视图常量定义
 */
import { i18n } from "@/lang";
import type {
  ScheduleConfig,
  ScheduleEvent,
  ScheduleEventType,
  ScheduleEventTypePreset,
  ScheduleResource,
  ScheduleResourceTypePreset,
  ScheduleViewMode,
} from "./types";

/** 默认配置 */
export const DEFAULT_SCHEDULE_CONFIG: ScheduleConfig = {
  viewMode: "week",
  rowHeight: 40,
  cellHeight: 30,
  cellWidth: 50,
  dayStartHour: 8,
  dayEndHour: 22,
  showWeekend: true,
  showGrid: true,
  showWorkingHours: true,
  allowOverlap: false,
  timeSlot: 30,
};

/** 事件类型预设 */
export const SCHEDULE_EVENT_TYPE_PRESETS: ScheduleEventTypePreset[] = [
  { value: "meeting", label: i18n("schedule.event.meeting"), color: "#409EFF" },
  { value: "task", label: i18n("schedule.event.task"), color: "#67C23A" },
  {
    value: "appointment",
    label: i18n("schedule.event.appointment"),
    color: "#E6A23C",
  },
  { value: "leave", label: i18n("schedule.event.leave"), color: "#909399" },
  {
    value: "training",
    label: i18n("schedule.event.training"),
    color: "#9C27B0",
  },
  {
    value: "maintenance",
    label: i18n("schedule.event.maintenance"),
    color: "#F56C6C",
  },
  { value: "custom", label: i18n("schedule.event.custom"), color: "#00BCD4" },
];

/** 资源类型预设 */
export const SCHEDULE_RESOURCE_TYPE_PRESETS: ScheduleResourceTypePreset[] = [
  { value: "person", label: i18n("schedule.resource.person"), icon: "User" },
  {
    value: "equipment",
    label: i18n("schedule.resource.equipment"),
    icon: "Box",
  },
  { value: "room", label: i18n("schedule.resource.room"), icon: "House" },
  { value: "vehicle", label: i18n("schedule.resource.vehicle"), icon: "Van" },
];

/** 视图模式选项 */
export const SCHEDULE_VIEW_MODE_OPTIONS: {
  value: ScheduleViewMode;
  label: string;
}[] = [
  { value: "day", label: i18n("schedule.view.day") },
  { value: "week", label: i18n("schedule.view.week") },
  { value: "month", label: i18n("schedule.view.month") },
];

/** 创建事件 */
export const createEvent = (
  overrides: Partial<ScheduleEvent> = {},
): ScheduleEvent => {
  const now = new Date();
  const start = new Date(now);
  start.setMinutes(0, 0, 0);
  const end = new Date(start);
  end.setHours(end.getHours() + 1);
  return {
    id: `event_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: i18n("schedule.event.newEvent"),
    resourceId: "",
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    type: "task",
    allDay: false,
    ...overrides,
  };
};

/** 创建资源 */
export const createResource = (
  overrides: Partial<ScheduleResource> = {},
): ScheduleResource => ({
  id: `res_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  name: i18n("schedule.resource.newResource"),
  type: "person",
  color: "#409EFF",
  order: 0,
  enabled: true,
  workingHours: ["09:00-18:00"],
  ...overrides,
});

/** 获取事件颜色 */
export const getEventColor = (type: ScheduleEventType): string =>
  SCHEDULE_EVENT_TYPE_PRESETS.find((t) => t.value === type)?.color ?? "#409EFF";

/** 时间槽选项 */
export const TIME_SLOT_OPTIONS = [15, 30, 60, 120];
