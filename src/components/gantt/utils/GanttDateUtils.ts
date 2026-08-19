/**
 * 甘特图日期工具
 * 单一职责：纯函数，无副作用
 */

/** 日期字符串转 Date 对象 */
export const parseDate = (dateStr: string): Date => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/** Date 对象转 YYYY-MM-DD 字符串 */
export const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** 计算两个日期间的天数差（包含起止） */
export const daysBetween = (start: string, end: string): number => {
  const s = parseDate(start);
  const e = parseDate(end);
  const diff = e.getTime() - s.getTime();
  return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
};

/** 日期加天数 */
export const addDays = (dateStr: string, days: number): string => {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

/** 日期加月数 */
export const addMonths = (dateStr: string, months: number): string => {
  const d = parseDate(dateStr);
  d.setMonth(d.getMonth() + months);
  return formatDate(d);
};

/** 判断是否为周末 */
export const isWeekend = (dateStr: string): boolean => {
  const d = parseDate(dateStr);
  const day = d.getDay();
  return day === 0 || day === 6;
};

/** 判断是否为今日 */
export const isToday = (dateStr: string): boolean => {
  return dateStr === formatDate(new Date());
};

/** 获取日期范围内的所有日期 */
export const getDateRange = (start: string, end: string): string[] => {
  const dates: string[] = [];
  const s = parseDate(start);
  const e = parseDate(end);
  const cur = new Date(s);
  while (cur <= e) {
    dates.push(formatDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};

/** 获取周一 */
export const getMondayOfWeek = (dateStr: string): string => {
  const d = parseDate(dateStr);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return formatDate(d);
};

/** 获取月初 */
export const getFirstDayOfMonth = (dateStr: string): string => {
  const d = parseDate(dateStr);
  d.setDate(1);
  return formatDate(d);
};

/** 获取季初 */
export const getFirstDayOfQuarter = (dateStr: string): string => {
  const d = parseDate(dateStr);
  const month = d.getMonth();
  const quarterStartMonth = Math.floor(month / 3) * 3;
  d.setMonth(quarterStartMonth, 1);
  return formatDate(d);
};

/** 获取年初 */
export const getFirstDayOfYear = (dateStr: string): string => {
  const d = parseDate(dateStr);
  d.setMonth(0, 1);
  return formatDate(d);
};

/** 获取日期所在的周次 */
export const getWeekNumber = (dateStr: string): number => {
  const d = parseDate(dateStr);
  const oneJan = new Date(d.getFullYear(), 0, 1);
  const numberOfDays = Math.floor(
    (d.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000),
  );
  return Math.ceil((d.getDay() + 1 + numberOfDays) / 7);
};

/** 计算工作日数（排除周末） */
export const workDaysBetween = (start: string, end: string): number => {
  const dates = getDateRange(start, end);
  return dates.filter((d) => !isWeekend(d)).length;
};

/** 格式化日期显示（短格式） */
export const formatShortDate = (dateStr: string): string => {
  const d = parseDate(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

/** 格式化月份显示 */
export const formatMonth = (dateStr: string): string => {
  const d = parseDate(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

/** 格式化季度 */
export const formatQuarter = (dateStr: string): string => {
  const d = parseDate(dateStr);
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `${d.getFullYear()} Q${q}`;
};

/** 格式化年份 */
export const formatYear = (dateStr: string): string => {
  const d = parseDate(dateStr);
  return `${d.getFullYear()}`;
};

import type { GanttTimeUnit } from "../types";

/** 时间轴单元格（按时间单位聚合） */
export interface GanttTimelineCell {
  /** 单元格起始日期 */
  date: string;
  /** 底层标签（如 "1/15" / "W3" / "01" / "Q1" / "2024"） */
  label: string;
  /** 顶层分组标签（如 "2024-01" / "2024"） */
  topLabel: string;
  /** 是否包含周末（用于周末背景渲染） */
  hasWeekend?: boolean;
}

/** 按时间单位生成时间轴单元格 */
export const getTimelineCells = (
  start: string,
  end: string,
  unit: GanttTimeUnit,
): GanttTimelineCell[] => {
  const cells: GanttTimelineCell[] = [];
  const s = parseDate(start);
  const e = parseDate(end);

  if (unit === "day") {
    const cur = new Date(s);
    while (cur <= e) {
      const ds = formatDate(cur);
      cells.push({
        date: ds,
        label: `${cur.getMonth() + 1}/${cur.getDate()}`,
        topLabel: formatMonth(ds),
        hasWeekend: isWeekend(ds),
      });
      cur.setDate(cur.getDate() + 1);
    }
  } else if (unit === "week") {
    const monday = getMondayOfWeek(formatDate(s));
    const cur = parseDate(monday);
    while (cur <= e) {
      const ds = formatDate(cur);
      cells.push({
        date: ds,
        label: `W${getWeekNumber(ds)}`,
        topLabel: formatMonth(ds),
      });
      cur.setDate(cur.getDate() + 7);
    }
  } else if (unit === "month") {
    const cur = new Date(s.getFullYear(), s.getMonth(), 1);
    while (cur <= e) {
      const ds = formatDate(cur);
      cells.push({
        date: ds,
        label: String(cur.getMonth() + 1).padStart(2, "0"),
        topLabel: formatYear(ds),
      });
      cur.setMonth(cur.getMonth() + 1);
    }
  } else if (unit === "quarter") {
    const qStartMonth = Math.floor(s.getMonth() / 3) * 3;
    const cur = new Date(s.getFullYear(), qStartMonth, 1);
    while (cur <= e) {
      const ds = formatDate(cur);
      cells.push({
        date: ds,
        label: `Q${Math.floor(cur.getMonth() / 3) + 1}`,
        topLabel: formatYear(ds),
      });
      cur.setMonth(cur.getMonth() + 3);
    }
  } else {
    const cur = new Date(s.getFullYear(), 0, 1);
    while (cur <= e) {
      const ds = formatDate(cur);
      cells.push({
        date: ds,
        label: String(cur.getFullYear()),
        topLabel: String(cur.getFullYear()),
      });
      cur.setFullYear(cur.getFullYear() + 1);
    }
  }
  return cells;
};

/** 计算任务在指定时间单位下的偏移量（单元格数） */
export const getUnitOffset = (
  projectStart: string,
  date: string,
  unit: GanttTimeUnit,
): number => {
  const ps = parseDate(projectStart);
  const d = parseDate(date);
  if (unit === "day") {
    return Math.floor((d.getTime() - ps.getTime()) / 86400000);
  }
  if (unit === "week") {
    const psm = parseDate(getMondayOfWeek(projectStart));
    const dm = parseDate(getMondayOfWeek(date));
    return Math.floor((dm.getTime() - psm.getTime()) / (86400000 * 7));
  }
  if (unit === "month") {
    return (
      (d.getFullYear() - ps.getFullYear()) * 12 + (d.getMonth() - ps.getMonth())
    );
  }
  if (unit === "quarter") {
    const psq = Math.floor(ps.getMonth() / 3);
    const dq = Math.floor(d.getMonth() / 3);
    return (d.getFullYear() - ps.getFullYear()) * 4 + (dq - psq);
  }
  return d.getFullYear() - ps.getFullYear();
};

/** 计算任务在指定时间单位下的持续单元格数 */
export const getUnitDuration = (
  start: string,
  end: string,
  unit: GanttTimeUnit,
): number => {
  const s = parseDate(start);
  const e = parseDate(end);
  if (unit === "day") {
    return Math.floor((e.getTime() - s.getTime()) / 86400000) + 1;
  }
  if (unit === "week") {
    return Math.max(
      1,
      Math.ceil(((e.getTime() - s.getTime()) / 86400000 + 1) / 7),
    );
  }
  if (unit === "month") {
    return Math.max(
      1,
      (e.getFullYear() - s.getFullYear()) * 12 +
        (e.getMonth() - s.getMonth()) +
        1,
    );
  }
  if (unit === "quarter") {
    const sq = Math.floor(s.getMonth() / 3);
    const eq = Math.floor(e.getMonth() / 3);
    return Math.max(1, (e.getFullYear() - s.getFullYear()) * 4 + (eq - sq) + 1);
  }
  return Math.max(1, e.getFullYear() - s.getFullYear() + 1);
};
