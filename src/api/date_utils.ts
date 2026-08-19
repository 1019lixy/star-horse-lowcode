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
  "time",
  "time-picker",
  "timerange",
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
  //同element-plus 组件相差1,这里加上1
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000) + 1;
}

/**
 * 创建年月日时分秒
 * @param val 日期值
 * @param type 组件大类：date / datetime / time-picker / time
 * @param subType 具体日期格式，取自 dateTypes（year/month/daterange 等）
 * @param needSecond 是否显示秒
 * @param split 日期分隔符
 */
import { i18n } from "@/lang";

// 已格式化日期字符串的正则（支持长/短年份 + 长/短月日混合）
const YEAR_RE = /^\d{2,4}$/;
const MONTH_RE = /^\d{2,4}[-/]\d{1,2}$/;

// ISO 字符串正则（如 "2026-09-30T16:00:00.000Z"），提取 UTC 日期部分
const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})T/;

// 本地日期/日期时间字符串（支持 2 位短年份 + 长/短月日 + 可选时间）
// "2026-06-30" / "26-6-3" / "2026/6/30 00:00:00" / "26-6-3 8:5:9"
const LOCAL_DATETIME_RE =
  /^(\d{2,4})[-/](\d{1,2})[-/](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/;

/**
 * 从 ISO 字符串中直接提取 UTC 日期部分，避免 new Date() 时区偏移
 * "2026-09-30T16:00:00.000Z" → { year: "2026", month: "09", day: "30" }
 * 非 ISO 字符串返回 null
 */
function extractISODateParts(
  val: string,
): { year: string; month: string; day: string } | null {
  const m = val.match(ISO_DATE_RE);
  if (!m) return null;
  return { year: m[1], month: m[2], day: m[3] };
}

/**
 * 将 2 位短年份补全为 4 位（00-68 → 20xx，69-99 → 19xx，POSIX 风格）
 */
function normalizeYear(year: string): string {
  if (year.length === 4) return year;
  const y = parseInt(year, 10);
  return (y >= 69 ? 1900 : 2000) + y + "";
}

/**
 * 解析本地日期/日期时间字符串，支持 2 位短年份 + 长/短月日混合
 * 对溢出字段自动进位（如 26-6-32 → 2026-07-01，26-6-3 24:00:00 → 2026-06-04 00:00:00）
 * 通过 new Date(y, m-1, d, h, mi, s) 本地构造让 JS 自动进位，再用本地方法取值避免时区偏移
 * 非本地日期格式返回 null
 */
function parseLocalDateTimeParts(val: string): {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
} | null {
  const m = val.match(LOCAL_DATETIME_RE);
  if (!m) return null;
  const yearNum = parseInt(normalizeYear(m[1]), 10);
  const monthNum = parseInt(m[2], 10);
  const dayNum = parseInt(m[3], 10);
  const hourNum = parseInt(m[4] || "0", 10);
  const minuteNum = parseInt(m[5] || "0", 10);
  const secondNum = parseInt(m[6] || "0", 10);
  // 本地构造，让 JS Date 自动处理所有溢出/负数进位换算
  // 6-32 → 7-2，6-0 → 5-31，13-1 → 次年1-1，0-1 → 上年12-1，6-3 24:00 → 6-4 0:00
  const d = new Date(
    yearNum,
    monthNum - 1,
    dayNum,
    hourNum,
    minuteNum,
    secondNum,
  );
  if (isNaN(d.getTime())) return null;
  return {
    year: d.getFullYear().toString(),
    month: (d.getMonth() + 1).toString().padStart(2, "0"),
    day: d.getDate().toString().padStart(2, "0"),
    hour: d.getHours().toString().padStart(2, "0"),
    minute: d.getMinutes().toString().padStart(2, "0"),
    second: d.getSeconds().toString().padStart(2, "0"),
  };
}

/**
 * 尝试识别已格式化的日期字符串，避免 new Date() 时区偏移
 * @returns 格式化后的字符串，或 null 表示未匹配需要走 Date 转换
 */
function tryAlreadyFormatted(
  val: string,
  effectiveType: string,
  split: string,
  needSecond: boolean = false,
): string | null {
  // 先尝试从 ISO 字符串直接提取 UTC 日期部分（避免时区偏移）
  const iso = extractISODateParts(val);
  // 本地日期/日期时间字符串解析（支持长/短日期混合，输出标准化补零）
  const local = parseLocalDateTimeParts(val);

  switch (effectiveType) {
    case "year":
    case "years":
      if (YEAR_RE.test(val)) return normalizeYear(val);
      // ISO → 直接取 UTC 年份
      if (iso) return iso.year;
      // 本地日期/日期时间字符串 → 取年份
      if (local) return local.year;
      break;
    case "month":
    case "months":
      if (MONTH_RE.test(val)) {
        const parts = val.split(/[-/]/);
        const yearNum = parseInt(normalizeYear(parts[0]), 10);
        const monthNum = parseInt(parts[1], 10);
        // 本地构造处理月份溢出（13 → 次年1月，0 → 上年12月）
        const d = new Date(yearNum, monthNum - 1, 1);
        if (!isNaN(d.getTime())) {
          return (
            d.getFullYear().toString() +
            split +
            (d.getMonth() + 1).toString().padStart(2, "0")
          );
        }
      }
      // ISO → 直接取 UTC 年月
      if (iso) return iso.year + split + iso.month;
      // 本地日期/日期时间字符串 → 取年月
      if (local) return local.year + split + local.month;
      break;
    case "date":
    case "dates":
    case "daterange":
      // ISO → 直接取 UTC 年月日
      if (iso) return iso.year + split + iso.month + split + iso.day;
      // 本地日期/日期时间字符串 → 取年月日（标准化补零）
      if (local) return local.year + split + local.month + split + local.day;
      break;
    case "datetime":
    case "datetimerange":
      // 本地日期时间字符串 → 标准化补零输出（支持长/短日期混合）
      if (local) {
        const timePart = needSecond
          ? `${local.hour}:${local.minute}:${local.second}`
          : `${local.hour}:${local.minute}`;
        return (
          local.year + split + local.month + split + local.day + " " + timePart
        );
      }
      // ISO → 用 Date 转换保留时间部分（datetime 需要本地时间显示）
      break;
    case "week":
      // ISO → 从 UTC 日期计算周数
      if (iso) {
        const d = new Date(
          Date.UTC(
            parseInt(iso.year),
            parseInt(iso.month) - 1,
            parseInt(iso.day),
          ),
        );
        return `${d.getUTCFullYear()}${i18n("api.weekPrefix")}${getWeek(d)}${i18n("api.weekSuffix")}`;
      }
      // 本地日期/日期时间字符串 → 用日期部分计算周数
      if (local) {
        const d = new Date(
          Date.UTC(
            parseInt(local.year),
            parseInt(local.month) - 1,
            parseInt(local.day),
          ),
        );
        return `${d.getUTCFullYear()}${i18n("api.weekPrefix")}${getWeek(d)}${i18n("api.weekSuffix")}`;
      }
      break;
    case "monthrange":
      if (MONTH_RE.test(val)) {
        const parts = val.split(/[-/]/);
        const yearNum = parseInt(normalizeYear(parts[0]), 10);
        const monthNum = parseInt(parts[1], 10);
        // 本地构造处理月份溢出
        const d = new Date(yearNum, monthNum - 1, 1);
        if (!isNaN(d.getTime())) {
          return (
            d.getFullYear().toString() +
            split +
            (d.getMonth() + 1).toString().padStart(2, "0")
          );
        }
      }
      if (iso) return iso.year + split + iso.month;
      if (local) return local.year + split + local.month;
      break;
    case "yearrange":
      if (YEAR_RE.test(val)) return normalizeYear(val);
      if (iso) return iso.year;
      if (local) return local.year;
      break;
  }
  return null;
}

/**
 * 从带日期的时间字符串中提取时间部分
 * "1970-01-01 08:11:01+08" → "08:11:01"
 * "1970-01-01T16:00:00.000Z" → "16:00:00"
 * "08:11:01" → "08:11:01"（纯时间直接返回）
 * @returns 时间字符串 "HH:mm" 或 "HH:mm:ss"，或 null 表示不匹配
 */
function extractTimePart(val: string): string | null {
  // 纯时间字符串 "HH:mm:ss" / "HH:mm"
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(val)) return val;

  // 带时区偏移的日期时间 "1970-01-01 08:11:01+08" / "1970-01-01 08:11:01+08:00"
  const tzMatch = val.match(/^\d{4}-\d{2}-\d{2}\s+(\d{1,2}:\d{2}(?::\d{2})?)/);
  if (tzMatch) return tzMatch[1];

  // ISO 格式 "2026-06-09T16:00:00.000Z"
  const isoMatch = val.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/,
  );
  if (isoMatch) return isoMatch[4] + ":" + isoMatch[5] + ":" + isoMatch[6];

  return null;
}

/**
 * 格式化时间值（time / time-picker 类型专用）
 * 支持：单值字符串、数组范围、JSON 字符串数组、带日期的时间字符串
 */
function formatTimeValue(val: any): string {
  if (Array.isArray(val)) {
    return val
      .map((v: any) => {
        if (typeof v === "string") {
          const t = extractTimePart(v);
          return t !== null ? t : v;
        }
        return v;
      })
      .join(` ${i18n("api.to")} `);
  }
  if (typeof val === "string") {
    // JSON 字符串数组，如 '[ "08:00", "18:00" ]'
    if (val.startsWith("[") && val.endsWith("]")) {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          return parsed
            .map((v: any) => {
              if (typeof v === "string") {
                const t = extractTimePart(v);
                return t !== null ? t : v;
              }
              return v;
            })
            .join(` ${i18n("api.to")} `);
        }
      } catch {
        /* 不是有效 JSON，继续 */
      }
    }
    // 范围分隔符格式，如 "08:00 - 18:00" / "08:00~18:00" / "08:00至18:00"
    const rangeMatch = val.match(
      /^(\d{1,2}:\d{2}(:\d{2})?)\s*[-~至到]\s*(\d{1,2}:\d{2}(:\d{2})?)$/,
    );
    if (rangeMatch) {
      return `${rangeMatch[1]} ${i18n("api.to")} ${rangeMatch[3]}`;
    }
    // 带日期的时间字符串 → 提取时间部分
    const t = extractTimePart(val);
    if (t !== null) return t;
  }
  return val;
}

export function parseDateByType(
  val: any,
  type: string,
  subType?: string,
  needSecond: boolean = false,
  split: string = "-",
) {
  if (!val || val == "undefined" || val == "-") {
    return "--";
  }
  try {
    // 确定有效的格式化类型：subType 优先于 type
    const effectiveType =
      subType && dateTypes.includes(subType) ? subType : type;

    // ── 处理时间类型：直接返回时间字符串，无需 Date 转换 ──
    // time-picker 可能是单值或范围（subType=timerange 或值为数组）
    if (type === "time" || type === "time-picker") {
      return formatTimeValue(val);
    }
    // timerange 类型（作为 type 或 subType 传入）
    if (effectiveType === "timerange") {
      return formatTimeValue(val);
    }

    // ── 处理日期范围数组 ──
    if (Array.isArray(val) && effectiveType?.includes("range")) {
      const baseType = effectiveType.replace("range", "");
      const formatStart = parseDateByType(
        val[0],
        type,
        baseType || undefined,
        needSecond,
        split,
      );
      const formatEnd = parseDateByType(
        val[1],
        type,
        baseType || undefined,
        needSecond,
        split,
      );
      return `${formatStart} ${i18n("api.to")} ${formatEnd}`;
    }

    // ── 处理日期多选数组（dates / years / months） ──
    if (Array.isArray(val)) {
      if (effectiveType === "dates") {
        return val
          .map((v: any) => parseDateByType(v, type, "date", needSecond, split))
          .join(", ");
      }
      if (effectiveType === "years") {
        return val
          .map((v: any) => parseDateByType(v, type, "year", needSecond, split))
          .join(", ");
      }
      if (effectiveType === "months") {
        return val
          .map((v: any) => parseDateByType(v, type, "month", needSecond, split))
          .join(", ");
      }
      // 通用数组兜底
      return val.join(", ");
    }

    // ── 解析 JSON 字符串数组（如 fieldMonths: '[ "06", "11" ]'） ──
    if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          return parseDateByType(parsed, type, subType, needSecond, split);
        }
      } catch {
        /* 不是有效 JSON，继续 */
      }
    }

    // ── month 类型值为纯月份数字字符串如 "06" ──
    if (
      effectiveType === "month" &&
      typeof val === "string" &&
      /^\d{1,2}$/.test(val)
    ) {
      return val.padStart(2, "0");
    }

    // ── 尝试识别已格式化的日期字符串，避免 new Date() 时区偏移 ──
    if (typeof val === "string") {
      const formatted = tryAlreadyFormatted(
        val,
        effectiveType,
        split,
        needSecond,
      );
      if (formatted !== null) return formatted;
      // 匹配日期格式但字段非法（如 26-6-32、26-13-1、26-13）→ 返回 "--"
      if (LOCAL_DATETIME_RE.test(val) || MONTH_RE.test(val)) {
        return "--";
      }
    }

    // ── 统一转换日期对象 ──
    let date = val;
    if (!(val instanceof Date)) {
      if (typeof val === "string" && /^\d+$/.test(val)) {
        date = new Date(Number(val));
      } else {
        date = new Date(val);
      }
    }

    // 验证日期有效性
    if (isNaN(date.getTime())) {
      return val;
    }

    // 判断是否只关心日期部分（不含时间），用 UTC 方式格式化避免时区偏移
    const isDateOnly = isDateOnlyType(effectiveType);

    // ── 根据 effectiveType 格式化 ──
    switch (effectiveType) {
      case "year":
        return isDateOnly
          ? date.getUTCFullYear().toString()
          : date.getFullYear().toString();
      case "years":
        return isDateOnly
          ? date.getUTCFullYear().toString()
          : date.getFullYear().toString();
      case "month":
        if (isDateOnly) {
          return (
            date.getUTCFullYear() +
            split +
            (date.getUTCMonth() + 1).toString().padStart(2, "0")
          );
        }
        return (
          date.getFullYear() +
          split +
          (date.getMonth() + 1).toString().padStart(2, "0")
        );
      case "months":
        if (isDateOnly) {
          return (
            date.getUTCFullYear() +
            split +
            (date.getUTCMonth() + 1).toString().padStart(2, "0")
          );
        }
        return (
          date.getFullYear() +
          split +
          (date.getMonth() + 1).toString().padStart(2, "0")
        );
      case "date":
        if (isDateOnly) {
          return (
            date.getUTCFullYear() +
            split +
            (date.getUTCMonth() + 1).toString().padStart(2, "0") +
            split +
            date.getUTCDate().toString().padStart(2, "0")
          );
        }
        return dateParse(date, false, split);
      case "dates":
        if (isDateOnly) {
          return (
            date.getUTCFullYear() +
            split +
            (date.getUTCMonth() + 1).toString().padStart(2, "0") +
            split +
            date.getUTCDate().toString().padStart(2, "0")
          );
        }
        return dateParse(date, false, split);
      case "datetime":
        return dateParse(date, true, split, needSecond);
      case "week":
        // week 用 UTC 日期计算周数
        if (isDateOnly) {
          const utcDate = new Date(
            Date.UTC(
              date.getUTCFullYear(),
              date.getUTCMonth(),
              date.getUTCDate(),
            ),
          );
          return `${utcDate.getUTCFullYear()}${i18n("api.weekPrefix")}${getWeek(utcDate)}${i18n("api.weekSuffix")}`;
        }
        return `${date.getFullYear()}${i18n("api.weekPrefix")}${getWeek(date)}${i18n("api.weekSuffix")}`;
      case "datetimerange":
        return dateParse(date, true, split, needSecond);
      case "daterange":
        if (isDateOnly) {
          return (
            date.getUTCFullYear() +
            split +
            (date.getUTCMonth() + 1).toString().padStart(2, "0") +
            split +
            date.getUTCDate().toString().padStart(2, "0")
          );
        }
        return dateParse(date, false, split);
      case "monthrange":
        if (isDateOnly) {
          return (
            date.getUTCFullYear() +
            split +
            (date.getUTCMonth() + 1).toString().padStart(2, "0")
          );
        }
        return dateParse(date, false, split);
      case "yearrange":
        if (isDateOnly) {
          return date.getUTCFullYear().toString();
        }
        return dateParse(date, false, split);
      default:
        return dateParse(
          date,
          effectiveType?.includes("time"),
          split,
          needSecond,
        );
    }
  } catch (e) {
    return val;
  }
}

// ==================== 组件数据规范化工具 ====================

/**
 * 获取 el-date-picker 的默认 value-format（dayjs 格式）
 * value-format 决定了 v-model 绑定值的字符串格式
 */
export function getDateValueFormat(subType: string): string {
  const map: Record<string, string> = {
    year: "YYYY",
    years: "YYYY",
    month: "YYYY-MM",
    months: "YYYY-MM",
    date: "YYYY-MM-DD",
    dates: "YYYY-MM-DD",
    datetime: "YYYY-MM-DD HH:mm:ss",
    datetimerange: "YYYY-MM-DD HH:mm:ss",
    daterange: "YYYY-MM-DD",
    monthrange: "YYYY-MM",
    yearrange: "YYYY",
    week: "YYYY-MM-DD",
    time: "HH:mm",
    "time-picker": "HH:mm:ss",
    timerange: "HH:mm:ss",
  };
  return map[subType] || "YYYY-MM-DD";
}

/**
 * 获取 el-date-picker 的默认显示 format（dayjs 格式）
 * format 决定了输入框中显示的文本格式
 */
export function getDateDisplayFormat(subType: string): string {
  const map: Record<string, string> = {
    year: "YYYY",
    years: "YYYY",
    month: "YYYY-MM",
    months: "YYYY-MM",
    date: "YYYY-MM-DD",
    dates: "YYYY-MM-DD",
    datetime: "YYYY-MM-DD HH:mm:ss",
    datetimerange: "YYYY-MM-DD HH:mm:ss",
    daterange: "YYYY-MM-DD",
    monthrange: "YYYY-MM",
    yearrange: "YYYY",
    week: `YYYY${i18n("api.weekPrefix")}ww${i18n("api.weekSuffix")}`,
    time: "HH:mm",
    "time-picker": "HH:mm:ss",
    timerange: "HH:mm:ss",
  };
  return map[subType] || "YYYY-MM-DD";
}

/**
 * 使用 UTC 方法按 dayjs 风格模式格式化（避免本地时区偏移）
 * 用于 year/month/date/week 等只关心日期部分的类型
 */
function formatDateByPatternUTC(date: Date, pattern: string): string {
  return pattern
    .replace("YYYY", date.getUTCFullYear().toString())
    .replace("MM", (date.getUTCMonth() + 1).toString().padStart(2, "0"))
    .replace("DD", date.getUTCDate().toString().padStart(2, "0"))
    .replace("HH", date.getUTCHours().toString().padStart(2, "0"))
    .replace("mm", date.getUTCMinutes().toString().padStart(2, "0"))
    .replace("ss", date.getUTCSeconds().toString().padStart(2, "0"));
}

/**
 * 判断 subType 是否只关心日期部分（不需要本地时区转换）
 */
function isDateOnlyType(subType: string): boolean {
  return [
    "year",
    "years",
    "month",
    "months",
    "date",
    "dates",
    "week",
    "daterange",
    "monthrange",
    "yearrange",
  ].includes(subType);
}

/**
 * 将 Date 对象按 dayjs 风格模式格式化（本地时区）
 * 支持: YYYY, MM, DD, HH, mm, ss
 */
function formatDateByPattern(date: Date, pattern: string): string {
  return pattern
    .replace("YYYY", date.getFullYear().toString())
    .replace("MM", (date.getMonth() + 1).toString().padStart(2, "0"))
    .replace("DD", date.getDate().toString().padStart(2, "0"))
    .replace("HH", date.getHours().toString().padStart(2, "0"))
    .replace("mm", date.getMinutes().toString().padStart(2, "0"))
    .replace("ss", date.getSeconds().toString().padStart(2, "0"));
}

/**
 * 检查字符串是否已匹配目标 value-format 模式
 */
function matchesValueFormat(val: string, format: string): boolean {
  const reStr = format
    .replace("YYYY", "\\d{4}")
    .replace("MM", "\\d{2}")
    .replace("DD", "\\d{2}")
    .replace("HH", "\\d{2}")
    .replace("mm", "\\d{2}")
    .replace("ss", "\\d{2}")
    // 转义分隔符 - : 空格
    .replace(/[-\s:]/g, (m) => "\\" + m);
  return new RegExp("^" + reStr + "$").test(val);
}

/**
 * 规范化单个日期/时间值，转换为 el-date-picker / el-time-picker 期望的格式
 * @param val   原始值
 * @param subType  日期子类型
 * @param format   目标 value-format
 */
function normalizeSingleValue(val: any, subType: string, format: string): any {
  if (!val || val === "undefined" || val === "-") return val;

  // Date 对象 → 格式化
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return val;
    // 时间类型用本地时间格式化
    if (
      subType === "time" ||
      subType === "time-picker" ||
      subType === "timerange"
    ) {
      return formatDateByPattern(val, format);
    }
    return isDateOnlyType(subType)
      ? formatDateByPatternUTC(val, format)
      : formatDateByPattern(val, format);
  }

  if (typeof val !== "string") return val;

  // 已匹配目标格式 → 直接返回
  if (matchesValueFormat(val, format)) return val;

  // ── 时间类型子类型：提取时间部分 ──
  if (
    subType === "time" ||
    subType === "time-picker" ||
    subType === "timerange"
  ) {
    const t = extractTimePart(val);
    if (t !== null) {
      // 确保匹配目标 format
      if (format === "HH:mm" && /^\d{1,2}:\d{2}:\d{2}$/.test(t)) {
        return t.substring(0, 5);
      }
      return t;
    }
  }

  // ISO 字符串 → 优先从字符串直接提取 UTC 日期部分（避免时区偏移）
  const iso = extractISODateParts(val);
  if (iso && isDateOnlyType(subType)) {
    // year/years → "2026"
    if (subType === "year" || subType === "years") return iso.year;
    // month/months → "2026-09"
    if (subType === "month" || subType === "months")
      return iso.year + "-" + iso.month;
    // date/dates/daterange → "2026-09-30"
    if (subType === "date" || subType === "dates" || subType === "daterange") {
      return iso.year + "-" + iso.month + "-" + iso.day;
    }
    // week → "2026-09-30" (后续由组件计算周数)
    if (subType === "week") return iso.year + "-" + iso.month + "-" + iso.day;
    // monthrange → "2026-09"
    if (subType === "monthrange") return iso.year + "-" + iso.month;
    // yearrange → "2026"
    if (subType === "yearrange") return iso.year;
  }

  // months/month 纯月份数字 "06" → 构造完整日期
  if ((subType === "months" || subType === "month") && /^\d{1,2}$/.test(val)) {
    const d = new Date(new Date().getFullYear(), parseInt(val) - 1, 1);
    return formatDateByPattern(d, format);
  }

  // year/years 纯年份 "2026"
  if ((subType === "year" || subType === "years") && /^\d{4}$/.test(val)) {
    return val;
  }

  // 纯时间字符串 "17:24:43" / "17:24" → 构造 Date 再格式化
  const timeMatch = val.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (timeMatch) {
    const d = new Date();
    d.setHours(
      parseInt(timeMatch[1]),
      parseInt(timeMatch[2]),
      timeMatch[3] ? parseInt(timeMatch[3]) : 0,
      0,
    );
    return formatDateByPattern(d, format);
  }

  // ISO 字符串或其他可解析格式 → 转 Date 再格式化
  // datetime 类型使用本地时间，date-only 类型使用 UTC
  const d = new Date(val);
  if (!isNaN(d.getTime())) {
    return isDateOnlyType(subType)
      ? formatDateByPatternUTC(d, format)
      : formatDateByPattern(d, format);
  }

  return val;
}

/**
 * 规范化日期/时间模型值，确保 el-date-picker / el-time-picker 能正确显示
 *
 * 处理场景：
 * - ISO 字符串 "2026-06-09T16:00:00.000Z"
 * - 已格式化字符串 "2026-06-09"、"2026/06/09"
 * - 纯月份数字 "06"
 * - 纯时间字符串 "17:24:43"
 * - Date 对象
 * - 范围数组 ["2026-06-09T16:00:00.000Z", "2026-07-08T16:00:00.000Z"]
 * - JSON 字符串数组 '[ "06", "11" ]'
 *
 * @param val     原始值
 * @param subType 日期子类型（year/month/date/datetime/daterange 等）
 * @param valueFormat 目标 value-format（不传则根据 subType 自动推断）
 */
export function normalizeDateModel(
  val: any,
  subType: string,
  valueFormat?: string,
): any {
  if (!val || val === "undefined" || val === "-") return val;

  const format = valueFormat || getDateValueFormat(subType);

  // 范围/多选数组 → 逐项规范化
  if (Array.isArray(val)) {
    return val.map((v: any) => normalizeSingleValue(v, subType, format));
  }

  // JSON 字符串数组
  if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.map((v: any) => normalizeSingleValue(v, subType, format));
      }
    } catch {
      /* 不是有效 JSON，继续 */
    }
  }

  return normalizeSingleValue(val, subType, format);
}
