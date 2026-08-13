/**
 * 调度视图日期工具
 * 单一职责：纯函数
 */
import type { ScheduleViewMode } from "../types";

/** 时间字符串转 Date */
export const parseTime = (timeStr: string): Date => {
  const d = new Date(timeStr);
  if (isNaN(d.getTime())) return new Date();
  return d;
};

/** Date 转字符串 */
export const formatDateTime = (date: Date): string => date.toISOString();

/** 格式化为 HH:mm */
export const formatHourMinute = (date: Date): string => {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

/** 格式化为 YYYY-MM-DD */
export const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** 获取日期的开始时刻 */
export const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/** 获取日期的结束时刻 */
export const endOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/** 获取周一 */
export const startOfWeek = (date: Date): Date => {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

/** 获取月初 */
export const startOfMonth = (date: Date): Date => {
  const d = startOfDay(date);
  d.setDate(1);
  return d;
};

/** 加天数 */
export const addDays = (date: Date, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/** 计算两个日期的小时差 */
export const hoursBetween = (start: Date, end: Date): number => {
  return (end.getTime() - start.getTime()) / (60 * 60 * 1000);
};

/** 计算两个日期的分钟差 */
export const minutesBetween = (start: Date, end: Date): number => {
  return (end.getTime() - start.getTime()) / (60 * 1000);
};

/** 根据视图模式获取日期范围 */
export const getViewDateRange = (
  mode: ScheduleViewMode,
  anchor: Date,
): Date[] => {
  const dates: Date[] = [];
  if (mode === "day") {
    dates.push(startOfDay(anchor));
  } else if (mode === "week") {
    const start = startOfWeek(anchor);
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(start, i));
    }
  } else if (mode === "month") {
    const start = startOfMonth(anchor);
    // 月视图通常显示 6 周（42 天）从月初所在周的周一开始
    const weekStart = startOfWeek(start);
    for (let i = 0; i < 42; i++) {
      dates.push(addDays(weekStart, i));
    }
  }
  return dates;
};

/** 检查时间范围是否重叠 */
export const isTimeOverlap = (
  s1: Date,
  e1: Date,
  s2: Date,
  e2: Date,
): boolean => {
  return s1 < e2 && s2 < e1;
};

/** 检查是否同一天 */
export const isSameDay = (d1: Date, d2: Date): boolean => {
  return formatDate(d1) === formatDate(d2);
};

/** 检查是否周末 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

/** 检查是否今日 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/** 格式化日期标签 */
export const formatDayLabel = (date: Date): string => {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

/** 格式化周几 */
export const formatWeekday = (date: Date): string => {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return weekdays[date.getDay()];
};

/** 获取小时槽列表 */
export const getHourSlots = (startHour: number, endHour: number): number[] => {
  const slots: number[] = [];
  for (let h = startHour; h <= endHour; h++) slots.push(h);
  return slots;
};
