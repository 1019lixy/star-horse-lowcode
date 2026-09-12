/**
 * 工单号生成引擎 - 统一导出
 *
 * 纯 TS 模块，无 Vue 依赖，任意前端程序可 import 使用。
 *
 * 快速上手：
 *   import { generateWorkorder, parseTemplateSegments } from "@/utils/workorder";
 *   const result = generateWorkorder({
 *     segments: [
 *       { type: "static", value: "GD" },
 *       { type: "date", format: "YYYYMMDD" },
 *       { type: "sequence", length: 5, radix: 10, fillChar: "0", fillSide: "left" },
 *     ],
 *   });
 *   // result.value → "GD2026091200001"
 */

export type {
  WorkorderConfig,
  WorkorderContext,
  WorkorderDateSegment,
  WorkorderFieldSegment,
  WorkorderFieldTransform,
  WorkorderFillSide,
  WorkorderGenerateResult,
  WorkorderLengthMismatchStrategy,
  WorkorderOverflowStrategy,
  WorkorderRandomSegment,
  WorkorderSegment,
  WorkorderSegmentBase,
  WorkorderSegmentResult,
  WorkorderSegmentType,
  WorkorderSeqStorage,
  WorkorderSequenceSegment,
  WorkorderStaticSegment,
  WorkorderValidationError,
} from "./WorkorderTypes";

export {
  formatWorkorderDate,
  validateDateSegment,
} from "./dateFormatter";

export {
  MAX_RADIX,
  MIN_RADIX,
  RADIX_CHARSET,
  formatSequence,
  isSeqOverflow,
  maxSeqValue,
  padSeqValue,
  toRadixString,
  validateSequenceSegment,
} from "./seqFormatter";
export type { FormatSequenceOptions, FormatSequenceResult } from "./seqFormatter";

export {
  LocalSeqStorage,
  MemorySeqStorage,
  createDefaultSeqStorage,
} from "./seqStorage";

export {
  adjustLength,
  validateWorkorderConfig,
} from "./validator";
export type { LengthAdjustResult } from "./validator";

export {
  WorkorderGenerator,
  generateWorkorder,
  parseTemplateSegments,
} from "./generator";
export {
  generateByCategory,
  getCategoryPreset,
  listCategoryPresets,
  registerCategoryPreset,
  registerCategoryPresets,
} from "./categoryPresets";