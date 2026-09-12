import type {
  WorkorderConfig,
  WorkorderContext,
  WorkorderFieldSegment,
  WorkorderGenerateResult,
  WorkorderRandomSegment,
  WorkorderSegment,
  WorkorderSegmentResult,
  WorkorderSeqStorage,
  WorkorderStaticSegment,
} from "./WorkorderTypes";
import { formatWorkorderDate } from "./dateFormatter";
import {
  RADIX_CHARSET,
  formatSequence,
  validateSequenceSegment,
} from "./seqFormatter";
import { createDefaultSeqStorage } from "./seqStorage";
import { adjustLength, validateWorkorderConfig } from "./validator";

/**
 * 工单号生成引擎
 *
 * 配置驱动、可插拔段、纯函数式 + 类式双 API。
 * 无 Vue 依赖，任意前端程序可直接 import 使用。
 */

/** 字段段取值与转换 */
const resolveFieldValue = (
  seg: WorkorderFieldSegment,
  fields: Record<string, any>,
): string => {
  const raw = fields?.[seg.fieldName];
  if (raw == null) return "";
  let val = String(raw);
  if (seg.transform === "upper") val = val.toUpperCase();
  else if (seg.transform === "lower") val = val.toLowerCase();
  if (seg.maxLength != null && Number.isFinite(seg.maxLength) && val.length > seg.maxLength) {
    const side = seg.truncateSide || "right";
    val = side === "left" ? val.slice(val.length - seg.maxLength) : val.slice(0, seg.maxLength);
  }
  return val;
};

/** 随机段产出 */
const resolveRandomValue = (seg: WorkorderRandomSegment): string => {
  const length = Math.floor(seg.length);
  if (length <= 0) return "";
  let charset = seg.charset;
  if (!charset || charset.length === 0) {
    const radix = seg.radix ?? 36;
    charset = RADIX_CHARSET.slice(0, Math.max(2, Math.min(62, radix)));
  }
  const result: string[] = [];
  let remaining = length;
  let useCrypto = false;
  try {
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      useCrypto = true;
    }
  } catch {
    useCrypto = false;
  }
  while (remaining > 0) {
    const batch = Math.min(remaining, 256);
    if (useCrypto) {
      const buf = new Uint32Array(batch);
      crypto.getRandomValues(buf);
      for (let i = 0; i < batch; i++) result.push(charset[buf[i] % charset.length]);
    } else {
      for (let i = 0; i < batch; i++) {
        result.push(charset[Math.floor(Math.random() * charset.length)]);
      }
    }
    remaining -= batch;
  }
  return result.join("");
};

/** 解析单段 */
const resolveSegment = (
  seg: WorkorderSegment,
  ctx: WorkorderContext,
  storage: WorkorderSeqStorage,
  seqNamespace: string,
  sequenceValues: Record<string, number>,
  warnings: string[],
): WorkorderSegmentResult => {
  let value = "";
  switch (seg.type) {
    case "static":
      value = String((seg as WorkorderStaticSegment).value ?? "");
      break;
    case "date":
      value = formatWorkorderDate(ctx.now ?? new Date(), seg.format);
      break;
    case "sequence": {
      const err = validateSequenceSegment(seg);
      if (err) {
        warnings.push(err);
        value = "";
        break;
      }
      const seqKey = seg.seqKey || seqNamespace || "default";
      const start = seg.start ?? 1;
      const seq = storage.next(seqKey, start);
      const fmt = formatSequence(seq, start, {
        length: seg.length,
        radix: seg.radix ?? 10,
        fillChar: seg.fillChar ?? "0",
        fillSide: seg.fillSide ?? "left",
        overflowStrategy: seg.overflowStrategy ?? "reset",
        minValue: seg.minValue,
        maxValue: seg.maxValue,
      });
      if (fmt.warning) warnings.push(fmt.warning);
      const strategy = seg.overflowStrategy ?? "reset";
      if (fmt.overflow) {
        if (strategy === "error") {
          storage.set(seqKey, seq - 1);
          value = "";
        } else if (strategy === "reset") {
          storage.set(seqKey, fmt.usedSeq);
          value = fmt.value;
        } else {
          value = fmt.value;
        }
      } else {
        value = fmt.value;
      }
      sequenceValues[seqKey] = fmt.usedSeq;
      break;
    }
    case "field":
      value = resolveFieldValue(seg, ctx.fields || {});
      break;
    case "random":
      value = resolveRandomValue(seg);
      break;
  }
  const skipped = !!seg.optional && value.length === 0;
  return { name: seg.name, type: seg.type, value, skipped };
};

/**
 * 生成工单号（函数式 API）
 * @param config 引擎配置
 * @param context 运行时上下文
 */
export const generateWorkorder = (
  config: WorkorderConfig,
  context?: WorkorderContext,
): WorkorderGenerateResult => {
  const warnings: string[] = [];
  const sequenceValues: Record<string, number> = {};
  const empty: WorkorderGenerateResult = {
    success: false,
    value: "",
    segments: [],
    sequenceValues,
    warnings,
  };

  const configErrors = validateWorkorderConfig(config);
  if (configErrors.length > 0) {
    empty.error = configErrors.map((e) => `[${e.segment || e.field}] ${e.message}`).join("; ");
    empty.warnings.push(empty.error);
    return empty;
  }

  const ctx = context || {};
  const storage = ctx.storage || createDefaultSeqStorage();
  const seqNamespace = config.seqNamespace || "default";
  const separator = config.separator ?? "";

  const segmentResults: WorkorderSegmentResult[] = [];
  const parts: string[] = [];
  for (const seg of config.segments) {
    const res = resolveSegment(
      seg,
      ctx,
      storage,
      seqNamespace,
      sequenceValues,
      warnings,
    );
    segmentResults.push(res);
    if (!res.skipped) parts.push(res.value);
  }

  const joined = parts.join(separator);
  const lengthResult = adjustLength(joined, config);
  if (lengthResult.warning) warnings.push(lengthResult.warning);

  return {
    success: lengthResult.ok,
    value: lengthResult.value,
    segments: segmentResults,
    sequenceValues,
    warnings,
    error: lengthResult.ok ? undefined : lengthResult.warning,
  };
};

/**
 * 引擎类（带配置绑定，便于多次生成）
 */
export class WorkorderGenerator {
  private readonly config: WorkorderConfig;
  private readonly configErrors: string[];

  constructor(config: WorkorderConfig) {
    this.config = config;
    this.configErrors = validateWorkorderConfig(config).map(
      (e) => `[${e.segment || e.field}] ${e.message}`,
    );
  }

  /** 配置是否合法 */
  isValid(): boolean {
    return this.configErrors.length === 0;
  }

  /** 返回配置错误 */
  validate(): string[] {
    return this.configErrors.slice();
  }

  /** 生成 */
  generate(context?: WorkorderContext): WorkorderGenerateResult {
    return generateWorkorder(this.config, context);
  }
};

/**
 * 解析模板字符串为段数组（便于从格式化字符串快速构建配置）
 *
 * 支持：
 *   {{date:格式}}    → date 段
 *   {{field:字段名}} → field 段（{{form:字段名}} 为兼容别名）
 *   其余文本         → static 段
 *
 * 例：parseTemplateSegments("GD-{{date:YYYYMMDD}}-{{field:deptCode}}")
 *   → [static("GD-"), date(YYYYMMDD), static("-"), field(deptCode)]
 */
export const parseTemplateSegments = (
  template: string,
): WorkorderSegment[] => {
  if (!template) return [];
  const segments: WorkorderSegment[] = [];
  const regex = /\{\{(date|field|form):([^}]+)\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "static",
        value: template.slice(lastIndex, match.index),
      });
    }
    const kind = match[1];
    const arg = match[2].trim();
    if (kind === "date") {
      segments.push({ type: "date", format: arg });
    } else {
      segments.push({ type: "field", fieldName: arg });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < template.length) {
    segments.push({ type: "static", value: template.slice(lastIndex) });
  }
  return segments;
};