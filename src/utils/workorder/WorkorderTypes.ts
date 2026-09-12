/**
 * 工单号生成引擎 - 类型定义
 *
 * 设计目标：配置驱动、可插拔段、无 Vue 依赖，可被任意前端程序引用。
 * 单号 = separator 拼接的多段序列，每段按类型独立产出。
 */

/** 段类型 */
export type WorkorderSegmentType =
  | "static"
  | "date"
  | "sequence"
  | "field"
  | "random";

/** 填充方向 */
export type WorkorderFillSide = "left" | "right";

/** 流水号溢出策略
 * - reset: 回到 start 重新计数
 * - error: 抛错，生成失败
 * - expand: 不填充，原样输出（突破位数）
 */
export type WorkorderOverflowStrategy = "reset" | "error" | "expand";

/** 长度不一致策略
 * - error: 生成失败
 * - truncate: 截断到 expectedLength
 * - pad: 用 lengthAdjustChar 填充到 expectedLength
 */
export type WorkorderLengthMismatchStrategy = "error" | "truncate" | "pad";

/** 字段段大小写转换 */
export type WorkorderFieldTransform = "upper" | "lower" | "none";

/** 段基础属性 */
export interface WorkorderSegmentBase {
  type: WorkorderSegmentType;
  /** 段名，用于诊断与校验定位 */
  name?: string;
  /** 段产出为空时是否跳过（不拼接、不占位），默认 false */
  optional?: boolean;
}

/** 静态段：固定文本（前缀、连接符、固定位常量等） */
export interface WorkorderStaticSegment extends WorkorderSegmentBase {
  type: "static";
  value: string;
}

/** 日期段：按格式串产出日期
 * 格式 token（大小写敏感）：
 *   YYYY 4 位年 / YY 2 位年
 *   MM 2 位月 / M 月不补零
 *   DD 2 位日 / D 日不补零
 *   HH 2 位时(24) / H 时不补零
 *   mm 2 位分 / m 分不补零
 *   ss 2 位秒 / s 秒不补零
 */
export interface WorkorderDateSegment extends WorkorderSegmentBase {
  type: "date";
  format: string;
}

/** 流水号段：按进制 + 位数 + 填充产出 */
export interface WorkorderSequenceSegment extends WorkorderSegmentBase {
  type: "sequence";
  /** 位数 */
  length: number;
  /** 进制，2-62，默认 10。字符集 0-9a-zA-Z */
  radix?: number;
  /** 填充字符，默认 "0" */
  fillChar?: string;
  /** 填充方向，默认 left */
  fillSide?: WorkorderFillSide;
  /** 起始值（十进制数字），默认 1。流水号从该值开始递增 */
  start?: number;
  /** 数值下限，默认取 start。低于下限按溢出策略处理 */
  minValue?: number;
  /** 数值上限，默认取 radix^length - 1。超出上限按溢出策略处理 */
  maxValue?: number;
  /** 溢出策略，默认 reset */
  overflowStrategy?: WorkorderOverflowStrategy;
  /** 序列键，区分不同流水号空间；不配则用 config.seqNamespace 或 "default" */
  seqKey?: string;
}

/** 字段段：引用运行时 fields 中的值 */
export interface WorkorderFieldSegment extends WorkorderSegmentBase {
  type: "field";
  fieldName: string;
  transform?: WorkorderFieldTransform;
  /** 最大长度，超出按 fillSide 截断 */
  maxLength?: number;
  /** 截断方向，默认 right（保留左侧） */
  truncateSide?: WorkorderFillSide;
}

/** 随机段：用 crypto.getRandomValues 产出，防猜测/补熵 */
export interface WorkorderRandomSegment extends WorkorderSegmentBase {
  type: "random";
  length: number;
  /** 自定义字符集；不配则按 radix 取 0-9a-zA-Z 前 radix 个，默认 radix=36 */
  charset?: string;
  radix?: number;
}

export type WorkorderSegment =
  | WorkorderStaticSegment
  | WorkorderDateSegment
  | WorkorderSequenceSegment
  | WorkorderFieldSegment
  | WorkorderRandomSegment;

/** 引擎配置 */
export interface WorkorderConfig {
  /** 段序列，按顺序拼接 */
  segments: WorkorderSegment[];
  /** 段间连接符，默认 "" */
  separator?: string;
  /** 期望总长度，配置后启用长度校验 */
  expectedLength?: number;
  /** 长度不一致策略，默认 error */
  lengthMismatchStrategy?: WorkorderLengthMismatchStrategy;
  /** 长度对齐方向（截断/填充），默认 right（截断保留左侧、填充补到右侧） */
  lengthAdjustSide?: WorkorderFillSide;
  /** 长度对齐填充字符，默认 "0" */
  lengthAdjustChar?: string;
  /** 默认序列命名空间（sequence 段未配 seqKey 时使用） */
  seqNamespace?: string;
  /** 类别预设名，配置后从预设库加载默认规则，可与 segments 合并/覆盖 */
  category?: string;
}

/** 序列存储抽象：流水号递增的持久化 */
export interface WorkorderSeqStorage {
  /** 读取当前已发放的最大值（十进制），不存在返回 null */
  get(key: string): number | null;
  /** 设置当前值 */
  set(key: string, value: number): void;
  /** 原子递增：返回本次应发放的值。start 为首个发放值。 */
  next(key: string, start: number): number;
  /** 重置 */
  reset(key: string): void;
}

/** 运行时上下文 */
export interface WorkorderContext {
  /** 业务字段值，供 field 段引用 */
  fields?: Record<string, any>;
  /** 序列存储，不配则用默认 localStorage 存储 */
  storage?: WorkorderSeqStorage;
  /** 注入当前时间，不配则 new Date()；便于测试与服务端同源 */
  now?: Date;
}

/** 单段产出诊断 */
export interface WorkorderSegmentResult {
  name?: string;
  type: WorkorderSegmentType;
  value: string;
  skipped: boolean;
}

/** 生成结果 */
export interface WorkorderGenerateResult {
  success: boolean;
  value: string;
  segments: WorkorderSegmentResult[];
  /** 各序列键本次发放的十进制数值 */
  sequenceValues: Record<string, number>;
  warnings: string[];
  error?: string;
}

/** 配置校验错误 */
export interface WorkorderValidationError {
  segment?: string;
  field: string;
  message: string;
}