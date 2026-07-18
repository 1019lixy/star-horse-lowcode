/**
 * 单元格报表公式引擎
 *
 * 职责：解析并求值单元格表达式
 * 支持：
 *   - 单元格引用 =A1+B2
 *   - 区域引用 =SUM(A1:A10)
 *   - 聚合函数 SUM/AVG/COUNT/MAX/MIN/COUNT_DISTINCT
 *   - 通用函数 IF/CONCAT/ROUND/ABS/LEN/UPPER/LOWER/DATE/NOW
 *   - 数据集字段 ${ds.field}
 *
 * 单一职责：只做公式求值，不处理 UI
 */

import { fromAddress, parseRange } from "./CellUtils";
import type { ReportCell, ReportRenderContext } from "./types";

/** 求值上下文 */
export interface FormulaEvalContext {
    /** 已渲染单元格值（地址 → 值） */
    cellValues: Map<string, any>;
    /** 报表单元格定义 */
    cells: Record<string, ReportCell>;
    /** 渲染上下文 */
    renderCtx: ReportRenderContext;
}

/** 函数实现映射 */
type FuncImpl = (args: any[], ctx: FormulaEvalContext) => any;

const FUNCS: Record<string, FuncImpl> = {
    SUM: (args) => {
        const nums = flattenNumbers(args);
        return nums.reduce((a, b) => a + b, 0);
    },
    AVG: (args) => {
        const nums = flattenNumbers(args);
        return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
    },
    COUNT: (args) => flattenNumbers(args).length,
    MAX: (args) => Math.max(...flattenNumbers(args)),
    MIN: (args) => Math.min(...flattenNumbers(args)),
    COUNT_DISTINCT: (args) => new Set(flattenValues(args).map(String)).size,
    IF: (args) => {
        const [cond, t, f] = args;
        return cond ? t : f;
    },
    CONCAT: (args) => args.map(String).join(""),
    ROUND: (args) => {
        const [v, d = 0] = args;
        return Number(Number(v).toFixed(d));
    },
    ABS: (args) => Math.abs(Number(args[0])),
    LEN: (args) => String(args[0]).length,
    UPPER: (args) => String(args[0]).toUpperCase(),
    LOWER: (args) => String(args[0]).toLowerCase(),
    DATE: (args) => new Date(args[0]).getTime(),
    NOW: () => Date.now(),
    YEAR: (args) => new Date(args[0]).getFullYear(),
    MONTH: (args) => new Date(args[0]).getMonth() + 1,
    DAY: (args) => new Date(args[0]).getDate(),
    AND: (args) => args.every(Boolean),
    OR: (args) => args.some(Boolean),
    NOT: (args) => !args[0],
};

/** 扁平化为数字数组 */
const flattenNumbers = (args: any[]): number[] => {
    return flattenValues(args)
        .map((v) => Number(v))
        .filter((v) => !isNaN(v));
};

/** 扁平化值数组（处理区域引用） */
const flattenValues = (args: any[]): any[] => {
    const result: any[] = [];
    for (const arg of args) {
        if (Array.isArray(arg)) {
            result.push(...arg);
        } else {
            result.push(arg);
        }
    }
    return result;
};

/** 解析数据集字段引用 ${ds.field} */
const evalDatasetRef = (expr: string, ctx: FormulaEvalContext): any => {
    const match = expr.match(/^\$\{([^}]+)\}$/);
    if (!match) return null;
    const parts = match[1].split(".");
    if (parts.length !== 2) return null;
    const [dsName, fieldName] = parts;
    const rows = ctx.renderCtx.datasets[dsName] || [];
    if (!rows.length) return null;
    return rows.map((r) => r[fieldName]);
};

/** 解析单元格引用 A1 */
const evalCellRef = (expr: string, ctx: FormulaEvalContext): any => {
    const match = expr.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) return null;
    const address = expr.toUpperCase();
    return ctx.cellValues.get(address) ?? 0;
};

/** 解析区域引用 A1:A10 → 数组 */
const evalRangeRef = (expr: string, ctx: FormulaEvalContext): any[] => {
    if (!expr.includes(":")) return null;
    try {
        const addresses = (() => {
            const { startRow, startCol, endRow, endCol } = parseRange(expr);
            const list: string[] = [];
            for (let r = startRow; r <= endRow; r++) {
                for (let c = startCol; c <= endCol; c++) {
                    list.push(`${String.fromCharCode(64 + c)}${r}`);
                }
            }
            return list;
        })();
        return addresses
            .map((a) => ctx.cellValues.get(a))
            .filter((v) => v !== undefined && v !== null && v !== "");
    } catch {
        return null;
    }
};

/** 词法分析：拆解表达式为 token */
const tokenize = (expr: string): string[] => {
    const tokens: string[] = [];
    let i = 0;
    while (i < expr.length) {
        const ch = expr[i];
        if (/\s/.test(ch)) {
            i++;
            continue;
        }
        if (/[0-9.]/.test(ch)) {
            let num = "";
            while (i < expr.length && /[0-9.]/.test(expr[i])) {
                num += expr[i++];
            }
            tokens.push(num);
            continue;
        }
        if (/[A-Za-z_$]/.test(ch)) {
            let id = "";
            while (i < expr.length && /[A-Za-z0-9_$.]/.test(expr[i])) {
                id += expr[i++];
            }
            // 区域引用：A1:B10
            if (expr[i] === ":") {
                while (i < expr.length && /[A-Za-z0-9:]/.test(expr[i])) {
                    id += expr[i++];
                }
            }
            tokens.push(id);
            continue;
        }
        if (ch === '"') {
            let str = '"';
            i++;
            while (i < expr.length && expr[i] !== '"') {
                str += expr[i++];
            }
            str += '"';
            i++;
            tokens.push(str);
            continue;
        }
        if (ch === "(" || ch === ")" || ch === "," || ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === ">" || ch === "<" || ch === "=") {
            tokens.push(ch);
            i++;
            continue;
        }
        i++;
    }
    return tokens;
};

/** 简单表达式求值（递归下降） */
const evaluateTokens = (tokens: string[], ctx: FormulaEvalContext): any => {
    let pos = 0;

    const peek = (): string => tokens[pos];
    const next = (): string => tokens[pos++];

    const parsePrimary = (): any => {
        const tok = next();
        if (tok === "(") {
            const v = parseExpression();
            if (peek() === ")") next();
            return v;
        }
        if (tok.startsWith('"') && tok.endsWith('"')) {
            return tok.slice(1, -1);
        }
        if (/^[0-9.]+$/.test(tok)) {
            return Number(tok);
        }
        // 函数调用 FUNC(arg1, arg2, ...)
        if (peek() === "(") {
            next(); // 消费 (
            const args: any[] = [];
            while (peek() !== ")" && pos < tokens.length) {
                args.push(parseExpression());
                if (peek() === ",") next();
            }
            if (peek() === ")") next();
            const func = FUNCS[tok.toUpperCase()];
            return func ? func(args, ctx) : null;
        }
        // 数据集引用 ${ds.field}
        if (tok.startsWith("${")) {
            return evalDatasetRef(tok, ctx);
        }
        // 区域引用 A1:B10
        if (tok.includes(":")) {
            return evalRangeRef(tok, ctx);
        }
        // 单元格引用 A1
        if (/^[A-Za-z]+\d+$/.test(tok)) {
            return evalCellRef(tok, ctx);
        }
        return tok;
    };

    const parseTerm = (): any => {
        let v = parsePrimary();
        while (pos < tokens.length && (peek() === "*" || peek() === "/")) {
            const op = next();
            const r = parsePrimary();
            v = op === "*" ? Number(v) * Number(r) : Number(v) / Number(r);
        }
        return v;
    };

    const parseExpression = (): any => {
        let v = parseTerm();
        while (pos < tokens.length && ["+", "-", ">", "<", "="].includes(peek())) {
            const op = next();
            const r = parseTerm();
            switch (op) {
                case "+":
                    v = Number(v) + Number(r);
                    break;
                case "-":
                    v = Number(v) - Number(r);
                    break;
                case ">":
                    v = Number(v) > Number(r);
                    break;
                case "<":
                    v = Number(v) < Number(r);
                    break;
                case "=":
                    v = v === r;
                    break;
            }
        }
        return v;
    };

    return parseExpression();
};

/** 求值入口 */
export const evalFormula = (expression: string, ctx: FormulaEvalContext): any => {
    if (!expression) return "";
    const expr = expression.trim();
    // 纯文本直接返回
    if (!expr.startsWith("=") && !expr.startsWith("${")) {
        return expr;
    }
    // 数据集引用
    if (expr.startsWith("${")) {
        return evalDatasetRef(expr, ctx);
    }
    // 公式
    const formula = expr.slice(1);
    const tokens = tokenize(formula);
    return evaluateTokens(tokens, ctx);
};

/** 提取公式中所有单元格引用 */
export const extractCellRefs = (expression: string): string[] => {
    if (!expression) return [];
    const refs = new Set<string>();
    const regex = /\b([A-Za-z]+)(\d+)\b/g;
    let match;
    while ((match = regex.exec(expression)) !== null) {
        refs.add(`${match[1].toUpperCase()}${match[2]}`);
    }
    return Array.from(refs);
};

/** 提取公式中所有数据集字段引用 */
export const extractDatasetRefs = (expression: string): string[] => {
    if (!expression) return [];
    const refs = new Set<string>();
    const regex = /\$\{([^}]+)\}/g;
    let match;
    while ((match = regex.exec(expression)) !== null) {
        refs.add(match[1]);
    }
    return Array.from(refs);
};
