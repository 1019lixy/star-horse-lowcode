/**
 * 调度视图模块导出
 */
export { default as ScheduleView } from "./ScheduleView.vue";
export { useScheduleDesigner } from "./composables/useScheduleDesigner";
export type { ScheduleDesigner } from "./composables/useScheduleDesigner";
export * from "./types";
export * from "./constants";
// 注意：ScheduleDateUtils 中的 formatDate/addDays/isWeekend/isToday 与 gantt 模块重名，
// 不通过 barrel 导出，外部如需使用请从 utils/ScheduleDateUtils 直接导入
export {
  parseTime,
  formatDateTime,
  formatHourMinute,
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
  hoursBetween,
  minutesBetween,
  getViewDateRange,
  isTimeOverlap,
  isSameDay,
  formatDayLabel,
  formatWeekday,
  getHourSlots,
} from "./utils/ScheduleDateUtils";
