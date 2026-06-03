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
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

/**
 * 创建年月日时分秒
 * @param val 日期值
 * @param type 组件大类：date / datetime / time-picker / time
 * @param subType 具体日期格式，取自 dateTypes（year/month/daterange 等）
 * @param needSecond 是否显示秒
 * @param split 日期分隔符
 */
import {i18n} from "@/lang";

// 已格式化日期字符串的正则
const YEAR_RE = /^\d{4}$/;
const MONTH_RE = /^\d{4}[-/]\d{2}$/;
const DATE_RE = /^\d{4}[-/]\d{2}[-/]\d{2}$/;
const DATETIME_RE = /^\d{4}[-/]\d{2}[-/]\d{2}\s+\d{1,2}:\d{2}(:\d{2})?$/;
const TIME_RE = /^\d{1,2}:\d{2}(:\d{2})?$/;

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
    switch (effectiveType) {
        case "year":
        case "years":
            if (YEAR_RE.test(val)) return val;
            // "2026-12-13" → "2026"
            if (DATE_RE.test(val)) return val.substring(0, 4);
            // "2026-12-13T16:00:00.000Z" 等带时间的 ISO 不匹配，走 Date 转换
            break;
        case "month":
        case "months":
            if (MONTH_RE.test(val)) return val.replace(/[-/]/g, split);
            // "2026-12-13" → "2026-12"
            if (DATE_RE.test(val)) {
                const parts = val.split(/[-/]/);
                return parts[0] + split + parts[1];
            }
            break;
        case "date":
        case "dates":
        case "daterange":
            if (DATE_RE.test(val)) return val.replace(/[-/]/g, split);
            break;
        case "datetime":
        case "datetimerange":
            if (DATETIME_RE.test(val)) {
                let result = val.replace(/[-/]/g, split);
                if (!needSecond) {
                    // 截掉秒 "2026-12-13 16:00:00" → "2026-12-13 16:00"
                    result = result.replace(/( \d{1,2}:\d{2}):\d{2}$/, "$1");
                }
                return result;
            }
            break;
        case "monthrange":
            if (MONTH_RE.test(val)) return val.replace(/[-/]/g, split);
            // "2026-12-13" → "2026-12"
            if (DATE_RE.test(val)) {
                const parts = val.split(/[-/]/);
                return parts[0] + split + parts[1];
            }
            break;
        case "yearrange":
            if (YEAR_RE.test(val)) return val;
            if (DATE_RE.test(val)) return val.substring(0, 4);
            break;
    }
    return null;
}

/**
 * 格式化时间值（time / time-picker 类型专用）
 * 支持：单值字符串、数组范围、JSON 字符串数组
 */
function formatTimeValue(val: any): string {
    if (Array.isArray(val)) {
        return val.join(` ${i18n("api.to")} `);
    }
    if (typeof val === "string") {
        // JSON 字符串数组，如 '[ "08:00", "18:00" ]'
        if (val.startsWith("[") && val.endsWith("]")) {
            try {
                const parsed = JSON.parse(val);
                if (Array.isArray(parsed)) {
                    return parsed.join(` ${i18n("api.to")} `);
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
                    .map((v: any) => {
                        if (typeof v === "string" && /^\d{1,2}$/.test(v)) {
                            return v.padStart(2, "0");
                        }
                        return v;
                    })
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
            const formatted = tryAlreadyFormatted(val, effectiveType, split, needSecond);
            if (formatted !== null) return formatted;
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

        // ── 根据 effectiveType 格式化 ──
        switch (effectiveType) {
            case "year":
                return date.getFullYear().toString();
            case "years":
                return date.getFullYear().toString();
            case "month":
                return (
                    date.getFullYear() +
                    split +
                    (date.getMonth() + 1).toString().padStart(2, "0")
                );
            case "months":
                return (
                    date.getFullYear() +
                    split +
                    (date.getMonth() + 1).toString().padStart(2, "0")
                );
            case "date":
                return dateParse(date, false, split);
            case "dates":
                return dateParse(date, false, split);
            case "datetime":
                return dateParse(date, true, split, needSecond);
            case "week":
                return `${date.getFullYear()}${i18n("api.weekPrefix")}${getWeek(date)}${i18n("api.weekSuffix")}`;
            case "datetimerange":
                return dateParse(date, true, split, needSecond);
            case "daterange":
            case "monthrange":
            case "yearrange":
                return dateParse(date, false, split);
            default:
                return dateParse(date, effectiveType?.includes("time"), split, needSecond);
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
        week: "YYYY-MM-DD",
    };
    return map[subType] || "YYYY-MM-DD";
}

/**
 * 将 Date 对象按 dayjs 风格模式格式化
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
        return isNaN(val.getTime()) ? val : formatDateByPattern(val, format);
    }

    if (typeof val !== "string") return val;

    // 已匹配目标格式 → 直接返回
    if (matchesValueFormat(val, format)) return val;

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
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
        return formatDateByPattern(d, format);
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
