/**
 * 日期类型
 * @type {string[]}
 */
export const dateTypes = [
  "year",
  "years",
  "month",
  "months",
  "date",
  "dates",
  "datetime",
  "week",
  "datetimerange",
  "daterange",
  "monthrange",
  "yearrange",
];

/**
 * 创建日期
 * @param val
 * @returns {string}
 */
export function createDate(val: any) {
  if (!val) {
    return "--";
  }
  return dateParse(val, false);
}

/**
 * 当前日期
 * @param split
 */
export function currentDate(split: string = "-") {
  const date = new Date();
  return dateParse(date, false, split);
}

/**
 * 获取当月的开始和结束时间
 */
export function currentMonthRange() {
  // 获取当前日期
  return monthRange(new Date());
}

export function monthRange(date: Date) {
  if (!date) {
    return {};
  }
  // 获取当前月份
  const currentMonth = date.getMonth();
  // 获取当前月份的第一天
  date.setDate(1);
  const firstDay = new Date(date.getTime());
  // 获取当前月份的最后一天
  date.setMonth(currentMonth + 1, 0);
  const lastDay = new Date(date.getTime());
  const year = date.getFullYear();
  let month: number | string = currentMonth + 1;
  month = month < 10 ? "0" + month : month;
  return {
    startDate: firstDay,
    starDateStr: year + "-" + month + "-01",
    lastDate: lastDay,
    lastDateStr: year + "-" + month + "-" + lastDay.getDate(),
  };
}

/**
 * 将日期解析为字符串
 * @param date
 * @param needTime
 * @param split
 * @param needSecond
 */
export function dateParse(
  date: Date,
  needTime: boolean = true,
  split: string = "-",
  needSecond: boolean = false,
) {
  if (!date) {
    return "";
  }
  const m = date.getMonth() + 1;
  const m1 = m < 10 ? "0" + m : m;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minute =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const second =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  let restr = date.getFullYear() + split + m1 + split + day;
  const tm = hour + ":" + minute;
  if (needTime) {
    restr += " " + tm;
  }
  if (needSecond) {
    restr += ":" + second;
  }
  return restr;
}

/**
 * 创建年月日时分秒
 * @param val
 * @param isDateTime
 * @param needSecond
 * @param split
 */
export function createDatetime(
  val: any,
  isDateTime: boolean = true,
  needSecond: boolean = false,
  split: string = "-",
) {
  if (!val || val == "undefined" || val == "-") {
    return "--";
  }
  try {
    const date = new Date(val);
    return dateParse(date, isDateTime, split, needSecond);
  } catch (e) {
    return val;
  }
}

// 新增周数计算函数
function getWeek(date: Date) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

/**
 * 创建年月日时分秒
 * @param val
 * @param type
 * @param needSecond
 * @param split
 */
import { i18n } from "@/lang";

export function parseDateByType(
  val: any,
  type: string,
  needSecond: boolean = false,
  split: string = "-",
) {
  if (!val || val == "undefined" || val == "-") {
    return "--";
  }
  try {
    // 处理日期范围数组
    if (Array.isArray(val) && type.includes("range")) {
      const start = val[0];
      const end = val[1];
      const formatStart = parseDateByType(
        start,
        type.replace("range", ""),
        needSecond,
        split,
      );
      const formatEnd = parseDateByType(
        end,
        type.replace("range", ""),
        needSecond,
        split,
      );
      return `${formatStart} ${i18n("api.to")} ${formatEnd}`;
    }
    // 统一转换日期对象
    let date = val;
    if (!(val instanceof Date)) {
      if (typeof val === "string" && /^\d+$/.test(val)) {
        date = new Date(Number(val));
      } else {
        date = new Date(val);
      }
    }
    // 根据不同类型设置不同格式
    switch (type) {
      case "year":
      case "years":
        return date.getFullYear().toString(); // 返回纯年份
      case "month":
      case "months":
        return (
          date.getFullYear() +
          split +
          (date.getMonth() + 1).toString().padStart(2, "0")
        ); // 年月
      case "date":
      case "dates":
        return dateParse(date, false, split); // 年月日
      case "datetime":
        return dateParse(date, true, split, needSecond); // 日期+时间
      case "week":
        return `${date.getFullYear()}${i18n("api.weekPrefix")}${getWeek(date)}${i18n("api.weekSuffix")}`; // 年份和周数
      case "datetimerange":
        return dateParse(date, true, split, needSecond); // 时间范围返回完整时间
      case "daterange":
      case "monthrange":
      case "yearrange":
        return dateParse(date, false, split); // 日期范围返回基础日期
      default:
        return dateParse(date, type.includes("time"), split, needSecond);
    }
  } catch (e) {
    return val;
  }
}
