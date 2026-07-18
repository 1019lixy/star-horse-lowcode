/**
 * Excel 公式解析与求值工具
 * 支持：
 *   - 函数：SUM / AVG / MIN / MAX / COUNT
 *   - 区域引用：A1:A3, B1:B2
 *   - 单元格引用：A1, B2
 *   - 简单算术：A1+B1, A1*2-B2
 *   - 字面量数字
 */
import { officeColLetterToIndex } from "../constants";
import type { ExcelCell } from "../types";

/** 单元格查找索引（row_col -> cell） */
type CellMap = Map<string, ExcelCell>;

const makeKey = (row: number, col: number): string => `${row}_${col}`;

/** 构建单元格映射 */
export const buildCellMap = (cells: ExcelCell[]): CellMap => {
    const map: CellMap = new Map();
    for (const c of cells) {
        map.set(makeKey(c.row, c.col), c);
    }
    return map;
};

/** 获取单元格数值（非数字返回 0） */
export const cellNumericValue = (cell: ExcelCell | undefined): number => {
    if (!cell) return 0;
    // 公式单元格：取 display 值
    const raw = cell.isFormula ? (cell.display ?? "") : cell.value;
    if (raw === "" || raw === undefined || raw === null) return 0;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
};

/** 单元格引用是否合法（如 A1, B2, AA10） */
const CELL_REF_REGEX = /^([A-Z]+)(\d+)$/;

/** 解析单元格引用为 {row, col} */
export const parseCellRef = (ref: string): { row: number; col: number } | null => {
    const m = CELL_REF_REGEX.test(ref) ? ref.match(CELL_REF_REGEX) : null;
    if (!m) return null;
    const col = officeColLetterToIndex(m[1]);
    const row = Number(m[2]) - 1; // 行号从 1 开始
    return { row, col };
};

/** 解析区域引用 "A1:A3" 返回包含的所有单元格坐标 */
export const parseRange = (range: string): Array<{ row: number; col: number }> | null => {
    const parts = range.split(":");
    if (parts.length !== 2) return null;
    const start = parseCellRef(parts[0]);
    const end = parseCellRef(parts[1]);
    if (!start || !end) return null;
    const rMin = Math.min(start.row, end.row);
    const rMax = Math.max(start.row, end.row);
    const cMin = Math.min(start.col, end.col);
    const cMax = Math.max(start.col, end.col);
    const list: Array<{ row: number; col: number }> = [];
    for (let r = rMin; r <= rMax; r++) {
        for (let c = cMin; c <= cMax; c++) {
            list.push({ row: r, col: c });
        }
    }
    return list;
};

/** 公式函数实现 */
const FORMULA_FUNCS: Record<string, (nums: number[]) => number> = {
    SUM: (arr) => arr.reduce((a, b) => a + b, 0),
    AVG: (arr) => (arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length),
    MIN: (arr) => (arr.length === 0 ? 0 : Math.min(...arr)),
    MAX: (arr) => (arr.length === 0 ? 0 : Math.max(...arr)),
    COUNT: (arr) => arr.length,
};

/**
 * 求值函数表达式：支持单个函数调用或区域引用
 * 例如：SUM(A1:A3), AVG(B1:B2), MIN(A1,B2,C3), MAX(A1:A5)
 * @returns 求值结果；解析失败返回 null
 */
const evalFunction = (expr: string, cellMap: CellMap): number | null => {
    const m = expr.match(/^(SUM|AVG|MIN|MAX|COUNT)\((.*)\)$/i);
    if (!m) return null;
    const fn = m[1].toUpperCase();
    const argsStr = m[2].trim();
    if (!argsStr) return null;
    const nums: number[] = [];
    // 按逗号拆分参数
    const args = argsStr.split(",").map((s) => s.trim()).filter(Boolean);
    for (const arg of args) {
        // 区域引用
        if (arg.includes(":")) {
            const range = parseRange(arg);
            if (!range) return null;
            for (const pos of range) {
                nums.push(cellNumericValue(cellMap.get(makeKey(pos.row, pos.col))));
            }
        } else if (CELL_REF_REGEX.test(arg)) {
            // 单元格引用
            const pos = parseCellRef(arg);
            if (!pos) return null;
            nums.push(cellNumericValue(cellMap.get(makeKey(pos.row, pos.col))));
        } else {
            // 字面量数字
            const n = Number(arg);
            if (!Number.isFinite(n)) return null;
            nums.push(n);
        }
    }
    const impl = FORMULA_FUNCS[fn];
    return impl ? impl(nums) : null;
};

/**
 * 简易算术求值：将单元格引用替换为数值后用 Function 计算
 * 仅支持 + - * / 和括号、数字、单元格引用
 */
const evalArithmetic = (expr: string, cellMap: CellMap): number | null => {
    // 安全检查：仅允许字母、数字、+、-、*、/、(、)、.、空格
    if (!/^[A-Z0-9+\-*/().\s]+$/i.test(expr)) return null;
    // 替换单元格引用
    const replaced = expr.replace(/[A-Za-z]+\d+/g, (ref) => {
        const pos = parseCellRef(ref.toUpperCase());
        if (!pos) return "0";
        const v = cellNumericValue(cellMap.get(makeKey(pos.row, pos.col)));
        return String(v);
    });
    try {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`return (${replaced});`);
        const result = fn();
        return Number.isFinite(result) ? Number(result) : null;
    } catch {
        return null;
    }
};

/**
 * 主求值入口：传入公式字符串（以 = 开头）与单元格列表
 * @returns 求值结果字符串（数字转字符串）或 null 表示无效
 */
export const evaluateFormula = (formula: string, cells: ExcelCell[]): string | null => {
    if (!formula || !formula.startsWith("=")) return null;
    const body = formula.slice(1).trim();
    if (!body) return null;
    const cellMap = buildCellMap(cells);
    // 优先尝试函数式
    if (/^(SUM|AVG|MIN|MAX|COUNT)\s*\(/i.test(body)) {
        const r = evalFunction(body, cellMap);
        return r === null ? null : String(r);
    }
    // 退化为算术
    const r = evalArithmetic(body, cellMap);
    return r === null ? null : String(r);
};

/** 是否为公式（以 = 开头） */
export const isFormula = (value: string): boolean => value.startsWith("=");

/** 重新计算所有公式单元格的 display 值 */
export const recalcSheet = (cells: ExcelCell[]): ExcelCell[] => {
    const result = cells.map((c) => ({ ...c }));
    for (const c of result) {
        if (c.isFormula) {
            const v = evaluateFormula(c.value, result);
            c.display = v ?? "#ERROR";
        } else {
            c.display = c.value;
        }
    }
    return result;
};
