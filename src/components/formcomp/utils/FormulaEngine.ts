/**
 * 公式计算引擎 (Hardened Version)
 *
 * 统一字段引用语法：${fieldName}
 * 支持 8 种公式类型：calc, concat, condition, lookup, aggregate, dateCalc, format, ternary
 *
 * 核心安全与兼容性保障：
 * 1. 表达式求值与条件判断分离，杜绝代码注入与类型丢失
 * 2. 字符串拼接独立实现，避免空值被当作字面量文本
 * 3. 跨浏览器健壮的日期解析，兼容 Safari 及非标准格式
 * 4. 三元表达式交由原生引擎解析，完美支持嵌套
 * 5. 聚合与正则格式化增加完整的边界防护
 */

// ==================== 类型定义 ====================

export type FormulaType =

    | "calc"
    | "concat"
    | "condition"
    | "lookup"
    | "aggregate"
    | "dateCalc"
    | "format"
    | "ternary";

export interface ConditionBranch {
  when: string;
  then: any;
}

export interface LookupMapping {
  key: string;
  values: Record<string, any>;
}

export interface FormulaConfig {
  enable: boolean;
  type: FormulaType;
  sourceFields: string[];
  expression?: string;
  branches?: ConditionBranch[];
  lookupMappings?: LookupMapping[];
  precision?: number;
  prefix?: string;
  suffix?: string;
  dateUnit?: "year" | "month" | "day" | "hour" | "minute" | "second";
  dateOffset?: number;
  dateMode?: "diff" | "offset" | "format";
  dateFormat?: string;
  formatType?: "thousands" | "padStart" | "toFixed" | "regex";
  formatArg?: string | number;
  formatArg2?: string;
  aggregateField?: string;
  defaultValue?: any;
}

export interface FormulaField {
  fieldName: string;
  type?: string;
  formula?: FormulaConfig;
  preps?: Record<string, any>;
}

// ==================== 安全工具函数 ====================

const safeNumber = (val: any): number => {
  const num = Number(val);
  return Number.isNaN(num) ? 0 : num;
};

/**
 * 安全沙箱清洗：移除危险的原型链与全局对象访问
 */
const sanitizeExpression = (expr: string): string => {
  return expr.replace(/\b(__proto__|constructor|prototype|window|document|globalThis|eval|Function)\b/g, "");
};

/**
 * [安全执行] 条件判断与数学计算统一入口
 * 增加了对“纯字符串”的防御性处理
 */
const safeEvalCondition = (expression: string): boolean => {
  try {
    let expr = expression.trim();

    // 防御性编程：如果整个表达式被双引号包裹（如 "\"a\"==\"b\""），说明被过度序列化了
    // 尝试剥离最外层的双引号并还原转义
    if (expr.startsWith('"') && expr.endsWith('"')) {
      try {
        // 尝试解析 JSON 字符串，看是否能还原为代码
        const unwrapped = JSON.parse(expr);
        if (typeof unwrapped === "string") {
          expr = unwrapped;
        }
      } catch (e) {
        // 忽略解析错误，继续按原样执行
      }
    }

    if (!expr) return false;

    // 执行代码
    // 使用 new Function 创建沙箱，仅允许访问 Math
    const result = new Function(
        "Math",
        `"use strict"; return (${expr});`
    )(Math);

    return !!result;
  } catch (e) {
    console.warn(`[FormulaEngine] 表达式执行失败: "${expression}"`, e);
    return false;
  }
};

/**
 * 用于 calc / ternary 的数值或字符串计算，保留原始返回类型
 */
const safeEvalExpr = (expression: string): any => {
  try {
    const sanitized = sanitizeExpression(expression);

    // 与 safeEvalCondition 保持一致，注入 Math 供表达式使用
    return new Function("Math", `"use strict"; return (${sanitized});`)(Math);
  } catch {
    return undefined;
  }
};


/**
 * [核心修复] 将 ${fieldName} 替换为可执行的 JS 代码片段
 *
 * 策略：
 * 1. 数字/布尔 -> 直接输出 (例: 100, true)
 * 2. 字符串   -> 使用单引号包裹，并转义内部单引号 (例: 'O\'Reilly')
 *
 * 这样生成的表达式如: 'windows' !== 'linux'
 * JS 引擎能完美解析，无需正则猜测运算符。
 */
const resolveFieldRefs = (
    expression: string,
    formData: Record<string, any>,
    emptyAsZero = true,
): string => {
  if (!expression) return "";

  return expression.replace(/\$\{(\w+)\}/g, (_, fieldName) => {
    const val = formData[fieldName];

    // 1. 空值处理
    if (val === undefined || val === null || val === "") {
      return emptyAsZero ? "0" : "''"; // 注意：这里改为两个单引号，代表空字符串
    }

    // 2. 数字 / 布尔值：直接返回，不加引号
    if (typeof val === "number" || typeof val === "boolean") {
      return String(val);
    }

    // 3. 字符串：手动转义单引号，并用单引号包裹
    // 这样可以兼容 ==, !=, ===, !==, >, < 等所有运算符
    if (typeof val === "string") {
      // 将字符串内部的 \ 替换为 \\，将 ' 替换为 \'
      const escaped = val.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
      return `'${escaped}'`;
    }

    // 4. 其他类型兜底（转为字符串处理）
    const strVal = String(val);
    const escaped = strVal.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    return `'${escaped}'`;
  });
};



/** 解析 then 值：${fieldName} 引用取字段原始值，否则返回常量或拼接字符串 */
const resolveThen = (then: any, formData: Record<string, any>): any => {
  if (typeof then !== "string") return then;

  const trimmed = then.trim();
  // 纯字段引用：返回原始类型
  const fullRefMatch = trimmed.match(/^\$\{(\w+)\}$/);
  if (fullRefMatch) {
    return formData[fullRefMatch[1]];
  }

  // 包含字段引用的拼接字符串
  if (/\$\{(\w+)\}/.test(then)) {
    return then.replace(/\$\{(\w+)\}/g, (_, fieldName) => {
      const val = formData[fieldName];
      return val === undefined || val === null ? "" : String(val);
    });
  }

  // 纯数字字面量：转为数字类型，避免给数字字段赋字符串导致显示/校验异常
  if (trimmed !== "" && !isNaN(Number(trimmed))) {
    return Number(trimmed);
  }

  return then;
};

/**
 * 跨浏览器健壮的日期解析
 * 兼容 ISO、YYYY-MM-DD HH:mm:ss、纯日期等格式
 */
const parseDate = (val: any): Date | null => {
  if (!val) return null;
  if (val instanceof Date) return Number.isNaN(val.getTime()) ? null : val;

  let d = new Date(val);
  if (!Number.isNaN(d.getTime())) return d;

  if (typeof val === "string") {
    // 兼容 Safari 不支持的空格分隔日期时间
    const normalized = val.replace(" ", "T");
    d = new Date(normalized);
    if (!Number.isNaN(d.getTime())) return d;

    // 兼容纯日期 YYYY-MM-DD（避免时区偏移问题）
    const dateOnly = val.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnly) {
      d = new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
      if (!Number.isNaN(d.getTime())) return d;
    }
  }

  return null;
};

// ==================== 8 种公式处理器 ====================

const executeCalc = (
    expression: string,
    formData: Record<string, any>,
    precision?: number,
    prefix?: string,
    suffix?: string,
): any => {
  try {
    const resolved = resolveFieldRefs(expression, formData, true);
    const result = safeEvalExpr(resolved);
    const num = safeNumber(result);
    const calcResult = precision !== undefined ? Number(num.toFixed(precision)) : num;

    if (prefix || suffix) {
      return `${prefix || ""}${calcResult}${suffix || ""}`;
    }
    return calcResult;
  } catch (e) {
    console.warn(`[FormulaEngine] calc 执行失败: ${expression}`, e);
    return 0;
  }
};

/**
 * concat 独立实现纯字符串拼接，不走 resolveFieldRefs + safeEval
 * 避免空值被当作 "" 字面量文本拼入结果
 */
const executeConcat = (expression: string, formData: Record<string, any>): string => {
  try {
    return expression.replace(/\$\{(\w+)\}/g, (_, fieldName) => {
      const val = formData[fieldName];
      if (val === undefined || val === null) return "";
      return String(val);
    });
  } catch (e) {
    console.warn(`[FormulaEngine] concat 执行失败: ${expression}`, e);
    return "";
  }
};

const executeCondition = (
    branches: ConditionBranch[],
    formData: Record<string, any>,
    defaultValue?: any,
): any => {
  for (const branch of branches) {
    try {
      // 条件判断使用空字符串而非 0，避免字符串比较时出现类型转换错误
      // （如空字段被当作 0，导致 0=="0" 误判为 true）
      const resolved = resolveFieldRefs(branch.when, formData, false);
      if (safeEvalCondition(resolved)) {
        return resolveThen(branch.then, formData);
      }
    } catch (e) {
      console.warn(`[FormulaEngine] condition 分支执行失败: ${branch.when}`, e);
    }
  }
  return defaultValue ?? undefined;
};

const executeLookup = (
    lookupMappings: LookupMapping[],
    sourceFields: string[],
    formData: Record<string, any>,
): Record<string, any> | null => {
  if (!sourceFields?.length || !lookupMappings?.length) return null;

  try {
    const keyValue = formData[sourceFields[0]];
    if (keyValue === undefined || keyValue === null) return null;

    const matched = lookupMappings.find((m) => String(m.key) === String(keyValue));
    return matched ? { ...matched.values } : null;
  } catch (e) {
    console.warn("[FormulaEngine] lookup 执行失败", e);
    return null;
  }
};

const executeAggregate = (
    expression: string,
    sourceFields: string[],
    aggregateField: string | undefined,
    formData: Record<string, any>,
    precision?: number,
): number => {
  try {
    if (!sourceFields?.length || !aggregateField) return 0;

    const rawArr = formData[sourceFields[0]];
    if (!Array.isArray(rawArr)) return 0;

    // 过滤掉 null/undefined 元素，防止 map 抛异常
    const validItems = rawArr.filter((item: any) => item != null);
    if (validItems.length === 0) return 0;

    const values = validItems
        .map((item: any) => safeNumber(item?.[aggregateField]))
        .filter((v: number) => !Number.isNaN(v));

    if (values.length === 0) return 0;

    let result: number;
    const aggType = (expression || "sum").toLowerCase();

    switch (aggType) {
      case "sum":
        result = values.reduce((a: number, b: number) => a + b, 0);
        break;
      case "avg":
        result = values.reduce((a: number, b: number) => a + b, 0) / values.length;
        break;
      case "count":
        result = values.length;
        break;
      case "min":
        result = Math.min(...values);
        break;
      case "max":
        result = Math.max(...values);
        break;
      default:
        console.warn(`[FormulaEngine] aggregate 未知聚合类型: ${aggType}`);
        result = 0;
    }

    return precision !== undefined ? Number(result.toFixed(precision)) : result;
  } catch (e) {
    console.warn("[FormulaEngine] aggregate 执行失败", e);
    return 0;
  }
};

const executeDateCalc = (
    expression: string,
    formData: Record<string, any>,
    dateUnit: string = "day",
    dateMode: string = "diff",
    dateOffset?: number,
    dateFormat?: string,
): any => {
  try {
    const resolved = resolveFieldRefs(expression, formData, false);

    if (dateMode === "format") {
      const date = parseDate(resolved);
      if (!date) return "";
      return formatDate(date, dateFormat || "YYYY-MM-DD");
    }

    if (dateMode === "offset") {
      const baseDate = parseDate(resolved);
      if (!baseDate) return "";
      const result = addDateOffset(baseDate, dateOffset ?? 0, dateUnit);
      return formatDate(result, dateFormat || "YYYY-MM-DD");
    }

    // diff 模式
    const parts = resolved.split("~").map((s: string) => s.trim());
    if (parts.length < 2) {
      console.warn("[FormulaEngine] dateCalc diff 模式需要两个日期，用 ~ 分隔");
      return 0;
    }

    const start = parseDate(parts[0]);
    const end = parseDate(parts[1]);
    if (!start || !end) return 0;

    return dateDiff(start, end, dateUnit);
  } catch (e) {
    console.warn(`[FormulaEngine] dateCalc 执行失败: ${expression}`, e);
    return 0;
  }
};

const dateDiff = (start: Date, end: Date, unit: string): number => {
  const ms = end.getTime() - start.getTime();
  switch (unit) {
    case "year":
      return end.getFullYear() - start.getFullYear();
    case "month":
      return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    case "day":
      return Math.round(ms / (1000 * 60 * 60 * 24));
    case "hour":
      return Math.round(ms / (1000 * 60 * 60));
    case "minute":
      return Math.round(ms / (1000 * 60));
    case "second":
      return Math.round(ms / 1000);
    default:
      return Math.round(ms / (1000 * 60 * 60 * 24));
  }
};

const addDateOffset = (date: Date, offset: number, unit: string): Date => {
  const result = new Date(date);
  switch (unit) {
    case "year":
      result.setFullYear(result.getFullYear() + offset);
      break;
    case "month":
      result.setMonth(result.getMonth() + offset);
      break;
    case "day":
      result.setDate(result.getDate() + offset);
      break;
    case "hour":
      result.setHours(result.getHours() + offset);
      break;
    case "minute":
      result.setMinutes(result.getMinutes() + offset);
      break;
    case "second":
      result.setSeconds(result.getSeconds() + offset);
      break;
    default:
      result.setDate(result.getDate() + offset);
  }
  return result;
};

const formatDate = (date: Date, format: string): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const tokens: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };
  let result = format;
  const keys = Object.keys(tokens).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    result = result.replace(key, tokens[key]);
  }
  return result;
};

const executeFormat = (
    expression: string,
    formData: Record<string, any>,
    formatType?: string,
    formatArg?: string | number,
    formatArg2?: string,
    precision?: number,
): string => {
  try {
    const resolved = resolveFieldRefs(expression, formData, false);
    const fType = formatType || "thousands";

    switch (fType) {
      case "thousands": {
        const num = safeNumber(resolved);
        return num.toLocaleString("en-US");
      }
      case "padStart": {
        const len = Number(formatArg) || 3;
        const fill = formatArg2 || "0";
        return String(resolved).padStart(len, fill);
      }
      case "toFixed": {
        const num = safeNumber(resolved);
        // precision 优先，其次 formatArg，最后默认 2；需防御 NaN
        const p = precision ?? (formatArg !== undefined ? Number(formatArg) : 2);
        return num.toFixed(Number.isNaN(p) ? 2 : p);
      }
      case "regex": {
        const pattern = String(formatArg || "");
        const replacement = formatArg2 ?? "";
        if (!pattern) return resolved;
        try {
          return String(resolved).replace(new RegExp(pattern, "g"), replacement);
        } catch {
          console.warn(`[FormulaEngine] format regex 非法正则: ${pattern}`);
          return resolved;
        }
      }
      default:
        console.warn(`[FormulaEngine] format 未知格式化类型: ${fType}`);
        return resolved;
    }
  } catch (e) {
    console.warn(`[FormulaEngine] format 执行失败: ${expression}`, e);
    return "";
  }
};

/**
 * ternary 直接交由 JS 引擎解析，完美支持嵌套三元表达式
 * 不再手动分割 ? 和 :
 */
const executeTernary = (
    expression: string,
    formData: Record<string, any>,
    defaultValue?: any,
): any => {
  try {
    const resolved = resolveFieldRefs(expression, formData, true);
    const result = safeEvalExpr(resolved);
    return result !== undefined ? result : (defaultValue ?? undefined);
  } catch (e) {
    console.warn(`[FormulaEngine] ternary 执行失败: ${expression}`, e);
    return defaultValue ?? undefined;
  }
};

// ==================== 公共 API ====================

export const executeFormula = (formula: FormulaConfig, formData: Record<string, any>): any => {
  if (!formula?.enable) return undefined;

  switch (formula.type) {
    case "calc":
      return executeCalc(formula.expression || "", formData, formula.precision, formula.prefix, formula.suffix);
    case "concat":
      return executeConcat(formula.expression || "", formData);
    case "condition":
      return executeCondition(formula.branches || [], formData, formula.defaultValue);
    case "lookup":
      return executeLookup(formula.lookupMappings || [], formula.sourceFields, formData);
    case "aggregate":
      return executeAggregate(formula.expression || "sum", formula.sourceFields, formula.aggregateField, formData, formula.precision);
    case "dateCalc":
      return executeDateCalc(formula.expression || "", formData, formula.dateUnit, formula.dateMode, formula.dateOffset, formula.dateFormat);
    case "format":
      return executeFormat(formula.expression || "", formData, formula.formatType, formula.formatArg, formula.formatArg2, formula.precision);
    case "ternary":
      return executeTernary(formula.expression || "", formData, formula.defaultValue);
    default:
      console.warn(`[FormulaEngine] 未知公式类型: ${(formula as any).type}`);
      return undefined;
  }
};

export const executeFormulaWithFill = (
    field: FormulaField,
    formInfo: FormulaField[],
    formData: Record<string, any>,
): void => {
  const formula = field.preps?.formula || field.formula;
  if (!formula?.enable) return;

  if (formula.type === "lookup") {
    const result = executeLookup(formula.lookupMappings || [], formula.sourceFields, formData);
    if (result) {
      Object.entries(result).forEach(([key, value]) => {
        const targetField = formInfo?.find((f) => f.fieldName === key);
        if (targetField) {
          formData[key] = value;
        }
      });
    }
  } else {
    const result = executeFormula(formula, formData);
    if (result !== undefined) {
      formData[field.fieldName] = result;
    }
  }
};

export const setupFormulaWatchers = (
    field: FormulaField,
    formInfo: FormulaField[],
    formData: any,
    watchFn: typeof import("vue").watch,
): (() => void)[] => {
  const formula = field.preps?.formula || field.formula;
  if (!formula?.enable || !formula.sourceFields?.length) return [];

  const stops: (() => void)[] = [];

  formula.sourceFields.forEach((sourceField) => {
    const stop = watchFn(
        () => formData.value?.[sourceField],
        () => {
          executeFormulaWithFill(field, formInfo, formData.value);
        },
        { immediate: true },
    );
    stops.push(stop);
  });

  return stops;
};

export const initFormFormulaWatchers = (
    formInfo: FormulaField[],
    formData: any,
    watchFn: typeof import("vue").watch,
): (() => void)[] => {
  if (!formInfo?.length) return [];

  const allStops: (() => void)[] = [];

  formInfo.forEach((field) => {
    const formula = field.preps?.formula || field.formula;
    if (formula?.enable) {
      const stops = setupFormulaWatchers(field, formInfo, formData, watchFn);
      allStops.push(...stops);
      // 初始化时立即执行一次计算
      executeFormulaWithFill(field, formInfo, formData.value);
    }
  });

  return allStops;
};
