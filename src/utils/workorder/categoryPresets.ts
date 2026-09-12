import type { WorkorderConfig, WorkorderContext, WorkorderGenerateResult } from "./WorkorderTypes";
import { generateWorkorder } from "./generator";

/**
 * 类别预设库
 *
 * 让"给我生成学生编号"这类按类别生成成为可能：每个类别对应一套默认规则，
 * 调用方只需 `generateByCategory("student")` 即可，未配置规则时按预设默认生成。
 *
 * 内置常见类别，并支持 `registerCategoryPreset` 注册自定义类别（可插拔，不硬编码到生成逻辑）。
 * 未知类别回退 serial 预设 + 告警，保证兼容能力。
 */

/** 通用流水号预设（兜底） */
const serialPreset = (): WorkorderConfig => ({
  segments: [
    { type: "sequence", length: 6, radix: 10, fillChar: "0", fillSide: "left", start: 1 },
  ],
  seqNamespace: "serial",
});

/** 内置类别预设 */
const buildBuiltinPresets = (): Record<string, WorkorderConfig> => ({
  serial: serialPreset(),
  student: {
    segments: [
      { type: "static", value: "S", name: "prefix" },
      { type: "date", format: "YY", name: "year" },
      { type: "sequence", length: 4, radix: 10, fillChar: "0", fillSide: "left", start: 1, name: "seq" },
    ],
    seqNamespace: "student",
  },
  workorder: {
    segments: [
      { type: "static", value: "WO", name: "prefix" },
      { type: "date", format: "YYYYMMDD", name: "date" },
      { type: "sequence", length: 4, radix: 10, fillChar: "0", fillSide: "left", start: 1, name: "seq" },
    ],
    seqNamespace: "workorder",
  },
  order: {
    segments: [
      { type: "static", value: "ORD", name: "prefix" },
      { type: "date", format: "YYYYMMDD", name: "date" },
      { type: "sequence", length: 6, radix: 36, fillChar: "0", fillSide: "left", start: 1, name: "seq" },
    ],
    seqNamespace: "order",
  },
  contract: {
    segments: [
      { type: "static", value: "HT", name: "prefix" },
      { type: "date", format: "YYYYMMDD", name: "date" },
      { type: "sequence", length: 4, radix: 10, fillChar: "0", fillSide: "left", start: 1, name: "seq" },
    ],
    seqNamespace: "contract",
  },
  invoice: {
    segments: [
      { type: "static", value: "FP", name: "prefix" },
      { type: "date", format: "YYYYMM", name: "month" },
      { type: "sequence", length: 6, radix: 10, fillChar: "0", fillSide: "left", start: 1, name: "seq" },
    ],
    seqNamespace: "invoice",
  },
});

const categoryPresets: Record<string, WorkorderConfig> = buildBuiltinPresets();

/** 注册自定义类别预设（可插拔） */
export const registerCategoryPreset = (
  name: string,
  config: WorkorderConfig,
): void => {
  categoryPresets[name] = config;
};

/** 批量注册 */
export const registerCategoryPresets = (
  presets: Record<string, WorkorderConfig>,
): void => {
  Object.assign(categoryPresets, presets);
};

/** 获取类别预设（返回副本，避免被修改） */
export const getCategoryPreset = (
  name: string,
): WorkorderConfig | undefined => {
  const preset = categoryPresets[name];
  if (!preset) return undefined;
  return JSON.parse(JSON.stringify(preset));
};

/** 列出所有已注册类别 */
export const listCategoryPresets = (): string[] => Object.keys(categoryPresets);

/** 合并预设与覆盖（覆盖优先，segments 提供则替换） */
const mergeConfig = (
  preset: WorkorderConfig,
  overrides?: Partial<WorkorderConfig>,
): WorkorderConfig => {
  if (!overrides) return preset;
  return {
    segments: overrides.segments ?? preset.segments,
    separator: overrides.separator ?? preset.separator,
    expectedLength: overrides.expectedLength ?? preset.expectedLength,
    lengthMismatchStrategy:
      overrides.lengthMismatchStrategy ?? preset.lengthMismatchStrategy,
    lengthAdjustSide: overrides.lengthAdjustSide ?? preset.lengthAdjustSide,
    lengthAdjustChar: overrides.lengthAdjustChar ?? preset.lengthAdjustChar,
    seqNamespace: overrides.seqNamespace ?? preset.seqNamespace,
    category: overrides.category ?? preset.category,
  };
};

/**
 * 按类别生成单号
 * @param category 类别名（如 "student"、"workorder"），未注册则回退 serial + 告警
 * @param overrides 覆盖预设的字段（segments 提供则整体替换）
 * @param context 运行时上下文
 */
export const generateByCategory = (
  category: string,
  overrides?: Partial<WorkorderConfig>,
  context?: WorkorderContext,
): WorkorderGenerateResult => {
  let preset = categoryPresets[category];
  const extraWarnings: string[] = [];
  if (!preset) {
    preset = categoryPresets["serial"];
    extraWarnings.push(`类别 "${category}" 未找到预设，已回退通用 serial 规则`);
  }
  const config = mergeConfig(JSON.parse(JSON.stringify(preset)), overrides);
  const result = generateWorkorder(config, context);
  if (extraWarnings.length > 0) {
    result.warnings.unshift(...extraWarnings);
  }
  return result;
};
