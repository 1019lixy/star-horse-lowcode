import type {
  WorkorderFillSide,
  WorkorderOverflowStrategy,
  WorkorderSequenceSegment,
} from "./WorkorderTypes";

/**
 * 流水号格式化（企业级）
 *
 * - 支持任意进制 2-62，字符集 0-9a-zA-Z
 * - 左/右填充
 * - 溢出精确判断（BigInt，避免大进制大位数超 Number.MAX_SAFE_INTEGER 误判）
 */

/** 62 进制字符集 */
export const RADIX_CHARSET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const MIN_RADIX = 2;
export const MAX_RADIX = 62;

/** 将非负整数转为指定进制字符串 */
export const toRadixString = (num: number, radix: number): string => {
  if (!Number.isFinite(num) || num < 0) return "";
  const n = Math.floor(num);
  if (n === 0) return RADIX_CHARSET[0];
  const chars: string[] = [];
  let cur = n;
  while (cur > 0) {
    chars.unshift(RADIX_CHARSET[cur % radix]);
    cur = Math.floor(cur / radix);
  }
  return chars.join("");
};

/** 计算指定位数/进制下的最大值（BigInt 精确） */
export const maxSeqValue = (radix: number, length: number): bigint => {
  if (length <= 0) return 0n;
  return BigInt(radix) ** BigInt(length) - 1n;
};

/** 判断是否溢出（BigInt 精确比较） */
export const isSeqOverflow = (seq: number, radix: number, length: number): boolean => {
  if (length <= 0) return true;
  return BigInt(seq) > maxSeqValue(radix, length);
};

/** 填充至指定位数 */
export const padSeqValue = (
  value: string,
  length: number,
  fillChar: string,
  fillSide: WorkorderFillSide,
): string => {
  if (value.length >= length) return value;
  const pad = fillChar.repeat(length - value.length);
  return fillSide === "left" ? pad + value : value + pad;
};

/** 流水号格式化选项 */
export interface FormatSequenceOptions {
  length: number;
  radix: number;
  fillChar: string;
  fillSide: WorkorderFillSide;
  overflowStrategy: WorkorderOverflowStrategy;
  /** 数值下限，默认取 start */
  minValue?: number;
  /** 数值上限，默认取 radix^length - 1 */
  maxValue?: number;
}

/** 流水号格式化结果 */
export interface FormatSequenceResult {
  value: string;
  overflow: boolean;
  /** 溢出后实际使用的数值（reset 后为 start，expand 后为原值） */
  usedSeq: number;
  warning?: string;
};

/**
 * 格式化流水号
 * @param seq 本次发放的十进制数值
 * @param start 起始值（溢出 reset 时回到 start）
 */
export const formatSequence = (
  seq: number,
  start: number,
  opts: FormatSequenceOptions,
): FormatSequenceResult => {
  const { length, radix, fillChar, fillSide, overflowStrategy } = opts;
  const upperBound =
    opts.maxValue != null && Number.isFinite(opts.maxValue)
      ? opts.maxValue
      : Number(maxSeqValue(radix, length));
  const lowerBound =
    opts.minValue != null && Number.isFinite(opts.minValue) ? opts.minValue : start;
  const overflow = seq > upperBound || seq < lowerBound;
  if (overflow) {
    if (overflowStrategy === "error") {
      return {
        value: "",
        overflow: true,
        usedSeq: seq,
        warning: `流水号 ${seq} 超出范围 [${lowerBound}, ${upperBound}]，策略 error`,
      };
    }
    if (overflowStrategy === "reset") {
      const resetSeq = start;
      const str = toRadixString(resetSeq, radix);
      return {
        value: padSeqValue(str, length, fillChar, fillSide),
        overflow: true,
        usedSeq: resetSeq,
        warning: `流水号 ${seq} 超出范围 [${lowerBound}, ${upperBound}]，已重置为起始值 ${start}`,
      };
    }
    // expand：原样输出，不填充
    return {
      value: toRadixString(seq, radix),
      overflow: true,
      usedSeq: seq,
      warning: `流水号 ${seq} 超出范围 [${lowerBound}, ${upperBound}]，按 expand 原样输出`,
    };
  }
  const str = toRadixString(seq, radix);
  return {
    value: padSeqValue(str, length, fillChar, fillSide),
    overflow: false,
    usedSeq: seq,
  };
};

/** 校验流水号段配置，返回错误信息或 null */
export const validateSequenceSegment = (
  seg: WorkorderSequenceSegment,
): string | null => {
  if (!Number.isFinite(seg.length) || seg.length <= 0) {
    return "sequence 段 length 必须为正整数";
  }
  const radix = seg.radix ?? 10;
  if (!Number.isFinite(radix) || radix < MIN_RADIX || radix > MAX_RADIX) {
    return `sequence 段 radix 必须在 ${MIN_RADIX}-${MAX_RADIX} 之间`;
  }
  const fillChar = seg.fillChar ?? "0";
  if (!fillChar || String(fillChar).length === 0) {
    return "sequence 段 fillChar 不能为空";
  }
  const start = seg.start ?? 1;
  if (!Number.isFinite(start) || start < 0) {
    return "sequence 段 start 必须为非负数字";
  }
  if (seg.minValue != null && (!Number.isFinite(seg.minValue) || seg.minValue < 0)) {
    return "sequence 段 minValue 必须为非负数字";
  }
  if (seg.maxValue != null && !Number.isFinite(seg.maxValue)) {
    return "sequence 段 maxValue 必须为数字";
  }
  if (
    seg.minValue != null &&
    seg.maxValue != null &&
    seg.minValue > seg.maxValue
  ) {
    return "sequence 段 minValue 不能大于 maxValue";
  }
  return null;
};