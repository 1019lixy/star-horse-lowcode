import type {
  WorkorderConfig,
  WorkorderLengthMismatchStrategy,
  WorkorderSegment,
  WorkorderValidationError,
} from "./WorkorderTypes";
import { validateDateSegment } from "./dateFormatter";
import { validateSequenceSegment } from "./seqFormatter";

/**
 * 配置与长度校验
 */

/** 校验单个段 */
const validateSegment = (
  seg: WorkorderSegment,
  index: number,
): WorkorderValidationError[] => {
  const errors: WorkorderValidationError[] = [];
  const name = seg.name || `segments[${index}]`;
  const push = (field: string, message: string) =>
    errors.push({ segment: name, field, message });

  switch (seg.type) {
    case "static":
      if (seg.value == null) push("value", "static 段 value 不能为 null");
      break;
    case "date": {
      const err = validateDateSegment(seg);
      if (err) push("format", err);
      break;
    }
    case "sequence": {
      const err = validateSequenceSegment(seg);
      if (err) push("sequence", err);
      break;
    }
    case "field":
      if (!seg.fieldName || seg.fieldName.length === 0) {
        push("fieldName", "field 段 fieldName 不能为空");
      }
      break;
    case "random":
      if (!Number.isFinite(seg.length) || seg.length <= 0) {
        push("length", "random 段 length 必须为正整数");
      }
      if (seg.charset != null && seg.charset.length === 0) {
        push("charset", "random 段 charset 不能为空字符串");
      }
      break;
  }
  return errors;
};

/** 校验整体配置，返回错误列表（空表示通过） */
export const validateWorkorderConfig = (
  config: WorkorderConfig,
): WorkorderValidationError[] => {
  const errors: WorkorderValidationError[] = [];
  if (!config || !Array.isArray(config.segments)) {
    errors.push({ field: "segments", message: "segments 必须为数组" });
    return errors;
  }
  if (config.segments.length === 0) {
    errors.push({ field: "segments", message: "segments 不能为空" });
    return errors;
  }
  config.segments.forEach((seg, i) => errors.push(...validateSegment(seg, i)));

  if (config.expectedLength != null) {
    if (!Number.isFinite(config.expectedLength) || config.expectedLength <= 0) {
      errors.push({
        field: "expectedLength",
        message: "expectedLength 必须为正整数",
      });
    }
    const strategy: WorkorderLengthMismatchStrategy =
      config.lengthMismatchStrategy || "error";
    if (strategy === "pad") {
      const ch = config.lengthAdjustChar ?? "0";
      if (!ch || String(ch).length === 0) {
        errors.push({
          field: "lengthAdjustChar",
          message: "pad 策略下 lengthAdjustChar 不能为空",
        });
      }
    }
  }
  return errors;
};

/** 长度对齐结果 */
export interface LengthAdjustResult {
  ok: boolean;
  value: string;
  warning?: string;
}

/** 按 expectedLength 校验并对齐 */
export const adjustLength = (
  value: string,
  config: WorkorderConfig,
): LengthAdjustResult => {
  const expected = config.expectedLength;
  if (expected == null || !Number.isFinite(expected)) {
    return { ok: true, value };
  }
  if (value.length === expected) return { ok: true, value };

  const strategy: WorkorderLengthMismatchStrategy =
    config.lengthMismatchStrategy || "error";
  const side = config.lengthAdjustSide || "right";
  const char = config.lengthAdjustChar ?? "0";

  if (value.length > expected) {
    if (strategy === "error") {
      return {
        ok: false,
        value,
        warning: `生成长度 ${value.length} 超出期望 ${expected}，策略 error`,
      };
    }
    if (strategy === "truncate") {
      const truncated =
        side === "left" ? value.slice(value.length - expected) : value.slice(0, expected);
      return {
        ok: true,
        value: truncated,
        warning: `生成长度 ${value.length} 超出期望 ${expected}，已截断`,
      };
    }
    // pad 对超长无意义，按截断处理
    const truncated =
      side === "left" ? value.slice(value.length - expected) : value.slice(0, expected);
    return {
      ok: true,
      value: truncated,
      warning: `生成长度 ${value.length} 超出期望 ${expected}，已截断`,
    };
  }

  // value.length < expected
  if (strategy === "error") {
    return {
      ok: false,
      value,
      warning: `生成长度 ${value.length} 不足期望 ${expected}，策略 error`,
    };
  }
  if (strategy === "pad") {
    const pad = char.repeat(expected - value.length);
    const padded = side === "left" ? pad + value : value + pad;
    return {
      ok: true,
      value: padded,
      warning: `生成长度 ${value.length} 不足期望 ${expected}，已填充`,
    };
  }
  // truncate 对不足无意义，按 pad 处理
  const pad = char.repeat(expected - value.length);
  const padded = side === "left" ? pad + value : value + pad;
  return {
    ok: true,
    value: padded,
    warning: `生成长度 ${value.length} 不足期望 ${expected}，已填充`,
  };
};