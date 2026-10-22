import type {
    CheckGroupItem,
    CheckMatrixGroup,
    CheckMatrixPreps,
    CheckMatrixValue,
} from "@/components/types";

/**
 * checkmatrix 点检矩阵纯逻辑状态机(无 UI 依赖,可独立 import 复用)
 * 组件值存于 dataForm[fieldName](CheckMatrixValue),本模块仅操作该 value 对象:
 * 时段合并规则 / 三态循环 / 批量填充 / 统计 / 覆盖校验 / 明细行展开 / 快照恢复
 */

export const TRI_STATE_CYCLE = ["", "OK", "NG", "NA"] as const;

export type TriState = (typeof TRI_STATE_CYCLE)[number];

export interface MergeBlock {
    start: number;
    span: number;
}

/** 组件内部渲染行:分组信息 + 检查项配置(含稳定 key) */
export interface CheckRenderRow {
    key: string;
    groupTitle: string;
    isGroupFirst: boolean;
    groupSize: number;
    item: CheckGroupItem;
}

function buildTwoPerShiftBlocks(slotCount: number): MergeBlock[] {
    if (slotCount <= 3) {
        return [{start: 0, span: slotCount}];
    }
    return [
        {start: 0, span: 3},
        {start: 3, span: slotCount - 3},
    ];
}

const MERGE_RULE_BLOCKS: Record<string, (slotCount: number) => MergeBlock[]> = {
    twoPerShift: buildTwoPerShiftBlocks,
    every2h: (slotCount: number) =>
        Array.from({length: slotCount}, (_, i) => ({start: i, span: 1})),
    every4h: (slotCount: number) => {
        const blocks: MergeBlock[] = [];
        for (let i = 0; i < slotCount; i += 2) {
            blocks.push({start: i, span: Math.min(2, slotCount - i)});
        }
        return blocks;
    },
    onceAll: (slotCount: number) => [{start: 0, span: slotCount}],
};

/**
 * 按合并规则计算时段块划分
 * twoPerShift 每班2次: [0-2]/[3-5] 两块; every2h: 每格独立;
 * every4h: 两格一块; onceAll: 整行一格; 未识别规则按每格独立处理
 */
export function getMergeBlocks(
    mergeRule?: string,
    slotCount = 6,
): MergeBlock[] {
    const builder = MERGE_RULE_BLOCKS[mergeRule || ""];
    if (!builder || slotCount <= 0) {
        return Array.from({length: Math.max(slotCount, 0)}, (_, i) => ({
            start: i,
            span: 1,
        }));
    }
    return builder(slotCount);
}

/**
 * 三态循环: 空->OK->NG->NA->空
 */
export function nextCycleState(current?: string): TriState {
    const idx = TRI_STATE_CYCLE.indexOf((current || "") as TriState);
    const next = (idx + 1) % TRI_STATE_CYCLE.length;
    return TRI_STATE_CYCLE[next];
}

/**
 * 键盘映射: 1=OK 2=NG 3=NA 0=清空
 */
export const KEY_MAP: Record<string, TriState> = {
    "1": "OK",
    "2": "NG",
    "3": "NA",
    "0": "",
};

/**
 * checkGroups 展开为渲染行(生成稳定 key: item.id 或 组序号_项序号)
 */
export function buildRenderRows(
    groups: CheckMatrixGroup[],
): CheckRenderRow[] {
    const rows: CheckRenderRow[] = [];
    (groups || []).forEach((group, gi) => {
        const items = group?.items || [];
        items.forEach((item, ii) => {
            rows.push({
                key: item.id || `g${gi + 1}_i${ii + 1}`,
                groupTitle: group?.title || "",
                isGroupFirst: ii === 0,
                groupSize: items.length,
                item,
            });
        });
    });
    return rows;
}

/**
 * 确保值对象与各行值行存在并初始化
 * (triState 初始化 results,rowEdit 初始化 values;已有数据按 key 回填不动)
 */
export function ensureCheckValue(
    value: CheckMatrixValue | undefined | null,
    rows: CheckRenderRow[],
    containerPreps?: CheckMatrixPreps,
): CheckMatrixValue {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return {rows: {}};
    }
    if (!value.rows || typeof value.rows !== "object") {
        value.rows = {};
    }
    const columnModel = containerPreps?.columnModel || "triState";
    const slotCount = containerPreps?.timeSlots?.length || 6;
    for (const row of rows) {
        if (!value.rows[row.key] || typeof value.rows[row.key] !== "object") {
            value.rows[row.key] = {};
        }
        const rowValue = value.rows[row.key];
        if (columnModel === "triState") {
            if (!Array.isArray(rowValue.results)) {
                rowValue.results = new Array(slotCount).fill("");
            } else if (rowValue.results.length < slotCount) {
                rowValue.results = [
                    ...rowValue.results,
                    ...new Array(slotCount - rowValue.results.length).fill(""),
                ];
            }
        } else {
            if (!rowValue.values || typeof rowValue.values !== "object") {
                rowValue.values = {};
            }
        }
        if (typeof rowValue.remark !== "string") {
            rowValue.remark = "";
        }
    }
    return value;
}

/**
 * 设置某个时段的稽核结果(写入该时段所在合并块的全部格)
 */
export function setSlotResult(
    value: CheckMatrixValue,
    row: CheckRenderRow,
    slotIndex: number,
    result: string,
    containerPreps?: CheckMatrixPreps,
): void {
    const rowValue = value?.rows?.[row.key];
    if (!rowValue || !Array.isArray(rowValue.results)) return;
    const slotCount =
        containerPreps?.timeSlots?.length || rowValue.results.length;
    const blocks = getMergeBlocks(row.item.mergeRule, slotCount);
    for (const block of blocks) {
        if (slotIndex >= block.start && slotIndex < block.start + block.span) {
            for (let k = 0; k < block.span; k++) {
                rowValue.results[block.start + k] = result;
            }
            return;
        }
    }
}

/**
 * 设置整个合并块的结果(抽屉内按块填写)
 */
export function setBlockResult(
    value: CheckMatrixValue,
    row: CheckRenderRow,
    blockIndex: number,
    result: string,
    containerPreps?: CheckMatrixPreps,
): void {
    const rowValue = value?.rows?.[row.key];
    if (!rowValue || !Array.isArray(rowValue.results)) return;
    const slotCount =
        containerPreps?.timeSlots?.length || rowValue.results.length;
    const blocks = getMergeBlocks(row.item.mergeRule, slotCount);
    const block = blocks[blockIndex];
    if (!block) return;
    for (let k = 0; k < block.span; k++) {
        rowValue.results[block.start + k] = result;
    }
}

/**
 * 批量填充: 全部检查项的所有块填指定结果('' 即清空)
 */
export function fillAllResults(
    value: CheckMatrixValue,
    rows: CheckRenderRow[],
    result: string,
    containerPreps?: CheckMatrixPreps,
): void {
    ensureCheckValue(value, rows, containerPreps);
    for (const row of rows) {
        const rowValue = value.rows[row.key];
        if (Array.isArray(rowValue.results)) {
            rowValue.results = rowValue.results.map(() => result);
        }
    }
}

/**
 * 整列填充: 某时段列所有检查项填指定结果
 */
export function fillColumnResults(
    value: CheckMatrixValue,
    rows: CheckRenderRow[],
    slotIndex: number,
    result: string,
    containerPreps?: CheckMatrixPreps,
): void {
    ensureCheckValue(value, rows, containerPreps);
    for (const row of rows) {
        setSlotResult(value, row, slotIndex, result, containerPreps);
    }
}

/**
 * 整行填充: 单个检查项所有块填指定结果
 */
export function fillRowResults(
    value: CheckMatrixValue,
    row: CheckRenderRow,
    result: string,
    containerPreps?: CheckMatrixPreps,
): void {
    ensureCheckValue(value, [row], containerPreps);
    const rowValue = value.rows[row.key];
    if (Array.isArray(rowValue.results)) {
        rowValue.results = rowValue.results.map(() => result);
    }
}

export interface CheckStats {
    ok: number;
    ng: number;
    na: number;
    empty: number;
    total: number;
}

/**
 * 统计全部检查项的 OK/NG/NA/未填数量
 */
export function getCheckStats(
    value: CheckMatrixValue | null | undefined,
    rows: CheckRenderRow[],
    containerPreps?: CheckMatrixPreps,
): CheckStats {
    const stats: CheckStats = {ok: 0, ng: 0, na: 0, empty: 0, total: 0};
    if (!value) return stats;
    ensureCheckValue(value, rows, containerPreps);
    for (const row of rows) {
        for (const result of value.rows[row.key]?.results || []) {
            stats.total++;
            if (result === "OK") stats.ok++;
            else if (result === "NG") stats.ng++;
            else if (result === "NA") stats.na++;
            else stats.empty++;
        }
    }
    return stats;
}

/**
 * 单个检查项是否存在 NG(行级红色标记)
 */
export function rowHasNg(
    value: CheckMatrixValue | null | undefined,
    row: CheckRenderRow,
): boolean {
    return (value?.rows?.[row.key]?.results || []).some(
        (result) => result === "NG",
    );
}

/**
 * 校验覆盖度: 返回未填稽核格数量(triState 模式)
 */
export function validateCoverage(
    value: CheckMatrixValue | null | undefined,
    rows: CheckRenderRow[],
    containerPreps?: CheckMatrixPreps,
): number {
    return getCheckStats(value, rows, containerPreps).empty;
}

/**
 * 展开为提交用明细行数组(主表+明细子表存储结构)
 * 每检查项一行: {itemId, groupTitle, content, freq, mergeRule, results, remark, values}
 */
export function expandCheckRows(
    value: CheckMatrixValue | null | undefined,
    rows: CheckRenderRow[],
    containerPreps?: CheckMatrixPreps,
): Array<Record<string, any>> {
    if (!value) return [];
    ensureCheckValue(value, rows, containerPreps);
    return rows.map((row) => {
        const rowValue = value.rows[row.key] || {};
        return {
            itemId: row.key,
            groupTitle: row.groupTitle,
            content: row.item.content,
            freq: row.item.freq || "",
            mergeRule: row.item.mergeRule || "every2h",
            results: [...(rowValue.results || [])],
            values: {...(rowValue.values || {})},
            remark: rowValue.remark || "",
        };
    });
}

/**
 * 快照: 提取全部检查项的值(复制上次记录用)
 */
export function snapshotCheckData(
    value: CheckMatrixValue | null | undefined,
    rows: CheckRenderRow[],
    containerPreps?: CheckMatrixPreps,
): CheckMatrixValue {
    if (!value) return {rows: {}};
    ensureCheckValue(value, rows, containerPreps);
    const snapshot: CheckMatrixValue = {rows: {}};
    for (const row of rows) {
        const rowValue = value.rows[row.key];
        snapshot.rows[row.key] = {
            results: [...(rowValue.results || [])],
            values: {...(rowValue.values || {})},
            remark: rowValue.remark || "",
        };
    }
    return snapshot;
}

/**
 * 恢复快照到值对象(深拷贝,避免快照被后续编辑污染)
 */
export function restoreCheckData(
    value: CheckMatrixValue,
    snapshot: CheckMatrixValue,
    rows: CheckRenderRow[],
    containerPreps?: CheckMatrixPreps,
): void {
    if (!value) return;
    ensureCheckValue(value, rows, containerPreps);
    for (const row of rows) {
        const snap = snapshot?.rows?.[row.key];
        if (!snap) continue;
        value.rows[row.key] = {
            results: [...(snap.results || [])],
            values: {...(snap.values || {})},
            remark: snap.remark || "",
        };
    }
}

/**
 * 块标签(抽屉内展示): twoPerShift -> 前半班/后半班, every4h -> 第N组
 */
export function getBlockLabel(
    mergeRule: string,
    blockIndex: number,
    slotCount: number,
): string {
    const blocks = getMergeBlocks(mergeRule, slotCount);
    const block = blocks[blockIndex];
    if (!block) return "";
    const end = block.start + block.span - 1;
    if (mergeRule === "onceAll") return "整体稽核";
    if (mergeRule === "twoPerShift") {
        return blockIndex === 0 ? "前半班时段" : "后半班时段";
    }
    if (block.span === 1) return `时段 ${block.start + 1}`;
    return `第 ${blockIndex + 1} 组(时段 ${block.start + 1}-${end + 1})`;
}