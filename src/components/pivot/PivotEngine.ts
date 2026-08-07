/**
 * 透视分析引擎
 * 单一职责：纯函数,负责数据聚合、过滤、排序
 */
import {AGGREGATORS} from "./constants";
import type {
    PivotAggregation,
    PivotCell,
    PivotChartResult,
    PivotChartSeries,
    PivotConfig,
    PivotField,
    PivotFilter,
    PivotRecord,
    PivotTableResult,
} from "./types";

/** 过滤记录 */
export const filterRecords = (records: PivotRecord[], filters: PivotFilter[]): PivotRecord[] => {
    if (!filters.length) return records;
    return records.filter((rec) =>
        filters.every((f) => {
            const val = rec[f.field];
            switch (f.operator) {
                case "eq":
                    return val === f.value;
                case "neq":
                    return val !== f.value;
                case "in":
                    return Array.isArray(f.value) && f.value.includes(val);
                case "notIn":
                    return Array.isArray(f.value) && !f.value.includes(val);
                case "gt":
                    return val > f.value;
                case "gte":
                    return val >= f.value;
                case "lt":
                    return val < f.value;
                case "lte":
                    return val <= f.value;
                case "between":
                    return Array.isArray(f.value) && val >= f.value[0] && val <= f.value[1];
                case "contains":
                    return String(val).includes(String(f.value));
                default:
                    return true;
            }
        }),
    );
};

/** 排序记录 */
export const sortRecords = (records: PivotRecord[], sorts: PivotConfig["sorts"]): PivotRecord[] => {
    if (!sorts.length) return records;
    return [...records].sort((a, b) => {
        for (const s of sorts) {
            const av = a[s.field];
            const bv = b[s.field];
            if (av === bv) continue;
            const cmp = av > bv ? 1 : -1;
            return s.direction === "asc" ? cmp : -cmp;
        }
        return 0;
    });
};

/** 提取字段唯一值 */
export const getUniqueValues = (records: PivotRecord[], field: string): any[] => {
    const set = new Set<any>();
    for (const r of records) set.add(r[field]);
    return Array.from(set);
};

/** 生成行/列组合键 */
export const buildKeys = (records: PivotRecord[], fields: string[]): string[][] => {
    if (!fields.length) return [[]];
    const uniqueValuesList = fields.map((f) => getUniqueValues(records, f));
    const result: string[][] = [];
    const recurse = (idx: number, prefix: string[]) => {
        if (idx === fields.length) {
            result.push([...prefix]);
            return;
        }
        for (const v of uniqueValuesList[idx]) {
            prefix.push(String(v));
            recurse(idx + 1, prefix);
            prefix.pop();
        }
    };
    recurse(0, []);
    return result;
};

/** 聚合 */
export const aggregate = (records: PivotRecord[], field: string, agg: PivotAggregation): number => {
    const values = records
        .map((r) => Number(r[field]))
        .filter((v) => !isNaN(v));
    return AGGREGATORS[agg](values);
};

/** 计算透视表 */
export const computePivotTable = (
    records: PivotRecord[],
    fields: PivotField[],
    config: PivotConfig,
): PivotTableResult => {
    // 1. 过滤
    const filtered = filterRecords(records, config.filters);
    // 2. 排序
    const sorted = sortRecords(filtered, config.sorts);

    // 3. 行/列头
    const rowKeys = buildKeys(sorted, config.rows);
    const colKeys = buildKeys(sorted, config.columns);

    // 4. 聚合单元格
    const cells: PivotCell[][] = [];
    const rowTotals: (number | string | null)[] = [];
    const colTotals: (number | string | null)[] = [];

    for (let r = 0; r < rowKeys.length; r++) {
        const row = rowKeys[r];
        const rowCells: PivotCell[] = [];
        let rowTotal = 0;
        let rowHasValue = false;

        for (let c = 0; c < colKeys.length; c++) {
            const col = colKeys[c];
            // 筛选匹配记录
            const matched = sorted.filter((rec) => {
                for (let i = 0; i < config.rows.length; i++) {
                    if (String(rec[config.rows[i]]) !== row[i]) return false;
                }
                for (let i = 0; i < config.columns.length; i++) {
                    if (String(rec[config.columns[i]]) !== col[i]) return false;
                }
                return true;
            });

            // 多值字段聚合
            let cellValue: number | string | null = null;
            if (config.values.length === 0) {
                cellValue = matched.length;
            } else if (config.values.length === 1) {
                const field = fields.find((f) => f.name === config.values[0]);
                const agg = field?.aggregation ?? "sum";
                cellValue = aggregate(matched, config.values[0], agg);
                if (typeof cellValue === "number") rowTotal += cellValue;
                rowHasValue = true;
            } else {
                // 多值合并显示
                cellValue = config.values
                    .map((v) => {
                        const field = fields.find((f) => f.name === v);
                        const agg = field?.aggregation ?? "sum";
                        const val = aggregate(matched, v, agg);
                        if (typeof val === "number") rowTotal += val;
                        return `${field?.label ?? v}: ${val}`;
                    })
                    .join("\n");
                rowHasValue = true;
            }

            rowCells.push({
                rowKey: row.join("|"),
                colKey: col.join("|"),
                value: cellValue,
                raw: matched,
            });
        }
        cells.push(rowCells);
        rowTotals.push(rowHasValue ? rowTotal : null);
    }

    // 5. 列合计
    for (let c = 0; c < colKeys.length; c++) {
        let total = 0;
        for (let r = 0; r < rowKeys.length; r++) {
            const v = cells[r][c]?.value;
            if (typeof v === "number") total += v;
        }
        colTotals.push(total);
    }

    // 6. 总计
    let grandTotal = 0;
    for (const t of colTotals) {
        if (typeof t === "number") grandTotal += t;
    }

    return {
        rowHeaders: rowKeys,
        colHeaders: colKeys,
        cells,
        rowTotals,
        colTotals,
        grandTotal,
    };
};

/** 计算图表数据 */
export const computePivotChart = (
    records: PivotRecord[],
    fields: PivotField[],
    config: PivotConfig,
    chartType: PivotChartResult["chartType"],
): PivotChartResult => {
    const result = computePivotTable(records, fields, config);
    // 类别 = 行头组合
    const categories = result.rowHeaders.map((h) => h.join("/"));
    // 系列 = 每个列头一个系列
    const series: PivotChartSeries[] = result.colHeaders.map((col, cIdx) => ({
        name: col.join("/"),
        data: result.cells.map((row) => {
            const v = row[cIdx]?.value;
            return typeof v === "number" ? v : null;
        }),
    }));
    return {categories, series, chartType};
};

/** 格式化数字 */
export const formatNumber = (value: number | string | null, format: string): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (isNaN(value)) return "";
    // 简单实现：根据 format 决定小数位
    if (format.includes(".00%")) {
        return (value * 100).toFixed(2) + "%";
    }
    if (format.includes(".0000")) {
        return value.toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4});
    }
    if (format.includes(".00")) {
        return value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    if (format.includes("¥")) {
        return "¥" + value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    if (format.includes(",,", 4)) {
        return (value / 1000000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    return Math.round(value).toLocaleString();
};
