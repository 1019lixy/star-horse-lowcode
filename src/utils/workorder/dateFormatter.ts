import type { WorkorderDateSegment } from "./WorkorderTypes";

/**
 * 日期格式化（企业级，灵活位数）
 *
 * 支持 token（大小写敏感）：
 *   YYYY 4 位年 / YY 2 位年
 *   MM 2 位月 / M 月不补零
 *   DD 2 位日 / D 日不补零
 *   HH 2 位时(24h) / H 时不补零
 *   mm 2 位分 / m 分不补零
 *   ss 2 位秒 / s 秒不补零
 *
 * 实现采用从长到短 split/join 替换：因所有 token 的产出值均为纯数字，
 * 不会引入新的字母 token，故无链式替换风险。
 */

const TWO = (n: number): string => String(n).padStart(2, "0");

/** token -> 取值函数 */
const DATE_TOKEN_RESOLVERS: Record<string, (d: Date) => string> = {
  YYYY: (d) => String(d.getFullYear()),
  YY: (d) => TWO(d.getFullYear() % 100),
  MM: (d) => TWO(d.getMonth() + 1),
  M: (d) => String(d.getMonth() + 1),
  DD: (d) => TWO(d.getDate()),
  D: (d) => String(d.getDate()),
  HH: (d) => TWO(d.getHours()),
  H: (d) => String(d.getHours()),
  mm: (d) => TWO(d.getMinutes()),
  m: (d) => String(d.getMinutes()),
  ss: (d) => TWO(d.getSeconds()),
  s: (d) => String(d.getSeconds()),
};

/** 从长到短排序，保证 YYYY 先于 YY、MM 先于 M */
const DATE_TOKEN_ORDER = Object.keys(DATE_TOKEN_RESOLVERS).sort(
  (a, b) => b.length - a.length,
);

/**
 * 按格式串格式化日期
 * @param date 日期对象
 * @param format 格式串，如 "YYYYMMDD"、"YY-M-D HH:mm:ss"
 */
export const formatWorkorderDate = (date: Date, format: string): string => {
  if (!format) return "";
  let result = format;
  for (const token of DATE_TOKEN_ORDER) {
    if (result.indexOf(token) === -1) continue;
    const val = DATE_TOKEN_RESOLVERS[token](date);
    result = result.split(token).join(val);
  }
  return result;
};

/** 校验日期段格式串非空 */
export const validateDateSegment = (seg: WorkorderDateSegment): string | null => {
  if (!seg.format || seg.format.length === 0) {
    return "date 段 format 不能为空";
  }
  return null;
};