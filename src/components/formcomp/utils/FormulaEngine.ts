/**
 * 公式计算引擎
 *
 * 统一字段引用语法：${fieldName}
 * 支持 8 种公式类型：
 * - calc:       数学运算          expression = '${price} * ${quantity}'
 * - concat:     字符串拼接        expression = '${lastName}${firstName}'
 * - condition:  多分支条件判断     branches = [{ when, then }]
 * - lookup:     联动回填          lookupMappings = [{ key, values }]
 * - aggregate:  聚合运算          expression = 'sum' / 'avg' / 'count' / 'min' / 'max'
 * - dateCalc:   日期计算          expression = '${start} ~ ${end}', dateUnit = 'day'
 * - format:     格式化            expression = 'thousands' / 'padStart' / 'toFixed' / 'regex'
 * - ternary:    三元表达式        expression = '${score} >= 60 ? ${score} : 0'
 *
 * 配置示例：
 * field: {
 *   fieldName: 'totalPrice',
 *   preps: {
 *     formula: {
 *       enable: true,
 *       type: 'calc',
 *       sourceFields: ['price', 'quantity'],
 *       expression: '${price} * ${quantity}',
 *       precision: 2,
 *       suffix: '元',
 *     }
 *   }
 * }
 */

// ==================== 类型定义 ====================

/** 公式类型 */
export type FormulaType =
  | "calc"        // 数学运算
  | "concat"      // 字符串拼接
  | "condition"   // 多分支条件判断
  | "lookup"      // 联动回填
  | "aggregate"   // 聚合运算（sum/avg/count/min/max）
  | "dateCalc"    // 日期计算
  | "format"      // 格式化
  | "ternary";    // 三元表达式

/** 条件分支配置 */
export interface ConditionBranch {
  /** 匹配表达式，如 '${score} >= 90' */
  when: string;
  /** 匹配时返回的值，支持常量或 ${fieldName} 引用 */
  then: any;
}

/** 联动回填映射配置 */
export interface LookupMapping {
  /** 匹配的源字段值 */
  key: string;
  /** 回填目标字段名 -> 回填值的映射 */
  values: Record<string, any>;
}

/** 公式配置 */
export interface FormulaConfig {
  /** 是否启用 */
  enable: boolean;
  /** 公式类型 */
  type: FormulaType;
  /** 依赖字段列表 */
  sourceFields: string[];
  /** 公式表达式，统一使用 ${fieldName} 引用字段 */
  expression?: string;
  /** 条件分支（type=condition 时使用） */
  branches?: ConditionBranch[];
  /** 联动回填映射（type=lookup 时使用） */
  lookupMappings?: LookupMapping[];
  /** 精度，type=calc/format(toFixed) 时使用 */
  precision?: number;
  /** 前缀，type=calc 时使用，如 '¥' */
  prefix?: string;
  /** 后缀，type=calc 时使用，如 '%'、'元' */
  suffix?: string;
  /** 日期单位，type=dateCalc 时使用：'year'|'month'|'day'|'hour'|'minute'|'second' */
  dateUnit?: "year" | "month" | "day" | "hour" | "minute" | "second";
  /** 日期偏移量，type=dateCalc 且 mode=offset 时使用，正数向后，负数向前 */
  dateOffset?: number;
  /** 日期计算模式：diff(差值) | offset(偏移) | format(格式化) */
  dateMode?: "diff" | "offset" | "format";
  /** 日期输出格式，type=dateCalc 且 mode=format 时使用，如 'YYYY-MM-DD' */
  dateFormat?: string;
  /** 格式化子类型，type=format 时使用 */
  formatType?: "thousands" | "padStart" | "toFixed" | "regex";
  /** 格式化参数：padStart 的目标长度 / regex 的替换模式 */
  formatArg?: string | number;
  /** 格式化参数2：padStart 的填充字符 / regex 的替换值 */
  formatArg2?: string;
  /** 聚合子字段，type=aggregate 时使用，指定子表单中要聚合的字段名 */
  aggregateField?: string;
  /** 条件不匹配时的默认值，type=condition/ternary 时使用 */
  defaultValue?: any;
}

/** 字段定义（最小集） */
export interface FormulaField {
  fieldName: string;
  type?: string;
  formula?: FormulaConfig;
  preps?: Record<string, any>;
}

// ==================== 工具函数 ====================

const safeNumber = (val: any): number => {
  const num = Number(val);
  return Number.isNaN(num) ? 0 : num;
};

/**
 * 将 ${fieldName} 替换为实际值（字符串形式）
 * @param emptyAsZero true 时空值替换为 '0'（用于 calc），false 时替换为 ''（用于 concat）
 */
const resolveFieldRefs = (expression: string, formData: Record<string, any>, emptyAsZero = true): string => {
  return expression.replace(/\$\{(\w+)\}/g, (_, fieldName) => {
    const val = formData[fieldName];
    if (val === undefined || val === null || val === "") return emptyAsZero ? "0" : "";
    return String(val);
  });
};

/** 将 ${fieldName} 替换为实际值（保留原始类型，用于条件判断的 then） */
const resolveFieldValue = (ref: string, formData: Record<string, any>): any => {
  const fieldName = ref.replace(/^\$\{(\w+)\}$/, "$1");
  return formData[fieldName];
};

/** 解析 then 值：${fieldName} 引用取字段值，否则返回常量 */
const resolveThen = (then: any, formData: Record<string, any>): any => {
  if (typeof then === "string" && /^\$\{(\w+)\}$/.test(then.trim())) {
    return resolveFieldValue(then.trim(), formData);
  }
  // 支持字符串中包含 ${fieldName} 的拼接
  if (typeof then === "string" && /\$\{(\w+)\}/.test(then)) {
    return resolveFieldRefs(then, formData, false);
  }
  return then;
};

/** 安全执行数学表达式 */
const safeEval = (expression: string): any => {
  return new Function("Math", `"use strict"; return (${expression})`)(Math);
};

// ==================== 8 种公式处理器 ====================

/**
 * calc - 数学运算
 * expression 示例:
 *   '${price} * ${quantity}'                    → 乘法
 *   '${field1} + ${field2} - ${field3}'         → 混合运算
 *   'Math.round(${a} / ${b} * 100) / 100'      → 除法保留2位
 *   '${a} / ${b} * 100' + suffix: '%'          → 百分比
 *   '${amount}' + prefix: '¥'                   → 金额前缀
 */
const executeCalc = (
  expression: string,
  formData: Record<string, any>,
  precision?: number,
  prefix?: string,
  suffix?: string,
): any => {
  try {
    const resolved = resolveFieldRefs(expression, formData);
    const result = safeEval(resolved);
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
 * concat - 字符串拼接
 * expression 示例:
 *   '${lastName}${firstName}'                   → 简单拼接
 *   '订单号：${orderNo}'                         → 带固定文本
 *   '${province}${city}${district}'             → 多字段拼接
 *   '联系人：${name}，电话：${phone}'             → 混合拼接
 */
const executeConcat = (expression: string, formData: Record<string, any>): string => {
  try {
    return resolveFieldRefs(expression, formData, false);
  } catch (e) {
    console.warn(`[FormulaEngine] concat 执行失败: ${expression}`, e);
    return "";
  }
};

/**
 * condition - 多分支条件判断
 * branches 示例: [
 *   { when: '${score} >= 90', then: '优秀' },
 *   { when: '${score} >= 60', then: '及格' },
 * ]
 * then 支持：常量值、${fieldName} 字段引用、含 ${fieldName} 的拼接字符串
 * 无匹配时返回 defaultValue 或 undefined
 */
const executeCondition = (
  branches: ConditionBranch[],
  formData: Record<string, any>,
  defaultValue?: any,
): any => {
  for (const branch of branches) {
    try {
      const resolved = resolveFieldRefs(branch.when, formData);
      const matched = safeEval(resolved);
      if (matched) {
        return resolveThen(branch.then, formData);
      }
    } catch (e) {
      console.warn(`[FormulaEngine] condition 分支执行失败: ${branch.when}`, e);
    }
  }
  return defaultValue ?? undefined;
};

/**
 * lookup - 联动回填
 * lookupMappings 示例: [
 *   { key: 'P001', values: { productName: '商品A', price: 99.9 } },
 *   { key: 'P002', values: { productName: '商品B', price: 199.9 } },
 * ]
 * 根据 sourceFields[0] 的值匹配 key，回填 values 中的字段
 * 返回回填结果对象，找不到返回 null
 */
const executeLookup = (
  lookupMappings: LookupMapping[],
  sourceFields: string[],
  formData: Record<string, any>,
): Record<string, any> | null => {
  if (!sourceFields?.length || !lookupMappings?.length) return null;

  try {
    const keyValue = formData[sourceFields[0]];
    if (keyValue === undefined || keyValue === null) return null;

    const matched = lookupMappings.find(m => String(m.key) === String(keyValue));
    return matched ? { ...matched.values } : null;
  } catch (e) {
    console.warn("[FormulaEngine] lookup 执行失败", e);
    return null;
  }
};

/**
 * aggregate - 聚合运算
 * 对子表单/批量数据中的某个字段进行聚合
 * expression 支持: 'sum' | 'avg' | 'count' | 'min' | 'max'
 *
 * 配置示例:
 * { type: 'aggregate', sourceFields: ['items'], aggregateField: 'amount', expression: 'sum' }
 * 其中 items 是子表单数据（数组），amount 是子表单中要聚合的字段
 */
const executeAggregate = (
  expression: string,
  sourceFields: string[],
  aggregateField: string | undefined,
  formData: Record<string, any>,
  precision?: number,
): number => {
  try {
    if (!sourceFields?.length || !aggregateField) return 0;

    // 取第一个依赖字段作为数组数据源
    const arr = formData[sourceFields[0]];
    if (!Array.isArray(arr) || arr.length === 0) return 0;

    const values = arr
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

/**
 * dateCalc - 日期计算
 * 三种模式:
 * 1. diff: 计算两个日期的差值
 *    expression = '${startDate} ~ ${endDate}', dateUnit = 'day'
 *    结果: 两个日期之间相差的天/月/年数
 *
 * 2. offset: 日期偏移
 *    expression = '${baseDate}', dateOffset = 7, dateUnit = 'day'
 *    结果: 基准日期 + 偏移量后的日期字符串
 *
 * 3. format: 日期格式化
 *    expression = '${rawDate}', dateFormat = 'YYYY-MM-DD'
 *    结果: 格式化后的日期字符串
 */
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
      // 格式化模式
      const date = new Date(resolved);
      if (Number.isNaN(date.getTime())) return "";
      return formatDate(date, dateFormat || "YYYY-MM-DD");
    }

    if (dateMode === "offset") {
      // 偏移模式
      const baseDate = new Date(resolved);
      if (Number.isNaN(baseDate.getTime())) return "";
      const offset = dateOffset ?? 0;
      const result = addDateOffset(baseDate, offset, dateUnit);
      return formatDate(result, dateFormat || "YYYY-MM-DD");
    }

    // diff 模式（默认）
    const parts = resolved.split("~").map((s: string) => s.trim());
    if (parts.length < 2) {
      console.warn("[FormulaEngine] dateCalc diff 模式需要两个日期，用 ~ 分隔");
      return 0;
    }
    const start = new Date(parts[0]);
    const end = new Date(parts[1]);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

    return dateDiff(start, end, dateUnit);
  } catch (e) {
    console.warn(`[FormulaEngine] dateCalc 执行失败: ${expression}`, e);
    return 0;
  }
};

/** 日期差值计算 */
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

/** 日期偏移 */
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

/** 简易日期格式化（不依赖第三方库） */
const formatDate = (date: Date, format: string): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const tokens: Record<string, string> = {
    "YYYY": String(date.getFullYear()),
    "MM": pad(date.getMonth() + 1),
    "DD": pad(date.getDate()),
    "HH": pad(date.getHours()),
    "mm": pad(date.getMinutes()),
    "ss": pad(date.getSeconds()),
  };
  let result = format;
  // 按长度降序替换，避免 YYYY 被 YY 先匹配
  const keys = Object.keys(tokens).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    result = result.replace(key, tokens[key]);
  }
  return result;
};

/**
 * format - 格式化
 * formatType 支持:
 * - thousands:   千分位分隔  1234567 → '1,234,567'
 * - padStart:    左填充      5 → '005'  (formatArg=3, formatArg2='0')
 * - toFixed:     固定小数位  3.1 → '3.10'  (precision=2)
 * - regex:       正则替换    'abc123' → '123'  (formatArg='[^0-9]', formatArg2='')
 *
 * 配置示例:
 * { type: 'format', sourceFields: ['amount'], formatType: 'thousands' }
 * { type: 'format', sourceFields: ['code'], formatType: 'padStart', formatArg: 6, formatArg2: '0' }
 * { type: 'format', sourceFields: ['price'], formatType: 'toFixed', precision: 2 }
 * { type: 'format', sourceFields: ['rawText'], formatType: 'regex', formatArg: '[^0-9]', formatArg2: '' }
 */
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
        // eslint-disable-next-line no-constant-binary-expression
        const p = precision ?? Number(formatArg) ?? 2;
        return num.toFixed(p);
      }
      case "regex": {
        const pattern = String(formatArg || "");
        const replacement = formatArg2 ?? "";
        if (!pattern) return resolved;
        return String(resolved).replace(new RegExp(pattern, "g"), replacement);
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
 * ternary - 三元表达式
 * expression 示例:
 *   '${score} >= 60 ? ${score} : 0'
 *   '${status} == 1 ? "启用" : "禁用"'
 *   '${amount} > 1000 ? ${amount} * 0.9 : ${amount}'
 *
 * 条件为真时返回 ? 后的值，为假时返回 : 后的值
 * 支持 defaultValue 作为条件不满足时的兜底
 */
const executeTernary = (
  expression: string,
  formData: Record<string, any>,
  defaultValue?: any,
): any => {
  try {
    // 分割条件、真值、假值
    const questionIdx = expression.indexOf("?");
    const colonIdx = expression.lastIndexOf(":");

    if (questionIdx === -1 || colonIdx === -1 || colonIdx <= questionIdx) {
      console.warn("[FormulaEngine] ternary 表达式格式错误，需要: 条件 ? 真值 : 假值");
      return defaultValue ?? undefined;
    }

    const conditionExpr = expression.substring(0, questionIdx).trim();
    const trueExpr = expression.substring(questionIdx + 1, colonIdx).trim();
    const falseExpr = expression.substring(colonIdx + 1).trim();

    // 解析条件
    const resolvedCondition = resolveFieldRefs(conditionExpr, formData);
    const conditionResult = safeEval(resolvedCondition);

    // 根据条件结果选择表达式
    const chosenExpr = conditionResult ? trueExpr : falseExpr;

    // 解析选中表达式中的字段引用
    const resolvedExpr = resolveFieldRefs(chosenExpr, formData);

    // 尝试作为数学表达式执行，失败则作为字符串返回
    try {
      const result = safeEval(resolvedExpr);
      // 如果结果是 NaN 则返回原始解析字符串
      if (typeof result === "number" && Number.isNaN(result)) {
        return resolveFieldRefs(chosenExpr, formData, false);
      }
      return result;
    } catch {
      // 不是数学表达式，直接返回字符串
      return resolveFieldRefs(chosenExpr, formData, false);
    }
  } catch (e) {
    console.warn(`[FormulaEngine] ternary 执行失败: ${expression}`, e);
    return defaultValue ?? undefined;
  }
};

// ==================== 公共 API ====================

/**
 * 执行公式计算，返回计算结果
 * @param formula 公式配置
 * @param formData 表单数据
 * @returns 计算结果
 */
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
    case 'aggregate':
      return executeAggregate(
        formula.expression || 'sum', formula.sourceFields,
        formula.aggregateField, formData, formula.precision,
      );
    case "dateCalc":
      return executeDateCalc(
        formula.expression || "", formData, formula.dateUnit,
        formula.dateMode, formula.dateOffset, formula.dateFormat,
      );
    case "format":
      return executeFormat(
        formula.expression || "", formData, formula.formatType,
        formula.formatArg, formula.formatArg2, formula.precision,
      );
    case "ternary":
      return executeTernary(formula.expression || "", formData, formula.defaultValue);
    default:
      console.warn(`[FormulaEngine] 未知公式类型: ${formula.type}`);
      return undefined;
  }
};

/**
 * 执行公式并回填表单数据
 * - lookup: 回填多个目标字段
 * - 其他类型: 结果赋值给当前字段
 *
 * @param field 当前字段
 * @param formInfo 所有字段列表
 * @param formData 表单数据（会被直接修改）
 */
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
        const targetField = formInfo?.find(f => f.fieldName === key);
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

/**
 * 构建字段级别的 watch 监听器
 * 当依赖字段变化时，自动触发公式计算并回填
 *
 * @param field 当前字段
 * @param formInfo 所有字段列表
 * @param formData 响应式表单数据
 * @param watchFn Vue watch 函数
 * @returns stop 函数数组，用于在 onBeforeUnmount 中清理
 */
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
    );
    stops.push(stop);
  });

  return stops;
};

/**
 * 批量初始化表单中所有带 formula 配置的字段
 * 适合在表单容器组件 onMounted 时调用
 *
 * @param formInfo 所有字段列表
 * @param formData 响应式表单数据
 * @param watchFn Vue watch 函数
 * @returns stop 函数数组，用于在 onBeforeUnmount 中清理
 */
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
      executeFormulaWithFill(field, formInfo, formData.value);
    }
  });

  return allStops;
};
