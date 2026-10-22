import {i18n} from "@/lang";
import type {
    CheckGroupItem,
    CheckTimeSlot,
    CheckMatrixGroup,
    CheckMatrixPreps,
    CheckMatrixValue,
    CheckOption,
} from "@/components/types";

/**
 * checkmatrix 点检矩阵纯逻辑状态机(无 UI 依赖,可独立 import 复用)
 * 组件值存于 dataForm[fieldName](CheckMatrixValue),本模块仅操作该 value 对象:
 * 时段合并规则 / 选项循环 / 批量填充 / 统计 / 覆盖校验 / 明细行展开 / 快照恢复
 *
 * 备选项不做硬编码:每个检查项可配 options(如 "T:对,F:错"),缺省回退
 * 容器级 preps.options,再回退内置默认(空/OK/NG/NA 显示同名)
 */

/**
 * 标准 IPQC 时段(2H/格,白班 8:00 起 + 夜班 20:00 起):
 * 设计器只配 preps.timeSlotCount 时按此模板生成,保证时段表头不空
 */
export function defaultTimeSlots(count = 6): CheckTimeSlot[] {
    const pad = (n: number) => String(n).padStart(2, "0");
    const fmt = (h: number) => `${pad(((h % 24) + 24) % 24)}:00`;
    const list: CheckTimeSlot[] = [];
    for (let i = 0; i < count; i++) {
        const dayStart = 8 + i * 2;
        const nightStart = 20 + i * 2;
        list.push({
            label: `${fmt(dayStart)}-${fmt(dayStart + 2)}`,
            sub: `${fmt(nightStart)}-${fmt(nightStart + 2)}`,
        });
    }
    return list;
}

/**
 * 解析 rowEdit 模式可编辑列(参数对齐:设计器以 JSON 字符串配置,
 * 引用方亦可直接配 editColumns 数组)
 */
export function resolveEditColumns(preps?: CheckMatrixPreps): any[] {
    const cols = (preps as any)?.editColumns;
    if (Array.isArray(cols)) return cols;
    if (typeof cols === "string" && cols.trim()) {
        try {
            const parsed = JSON.parse(cols);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }
    return [];
}

/**
 * 解析时段列(参数对齐:设计器配 timeSlotCount,引用方亦可直接配 timeSlots 完整数组)
 */
export function resolveTimeSlots(preps?: CheckMatrixPreps): CheckTimeSlot[] {
    const slots = preps?.timeSlots;
    if (Array.isArray(slots) && slots.length > 0) return slots;
    const count = Number((preps as any)?.timeSlotCount) || 6;
    return defaultTimeSlots(count > 0 ? count : 6);
}

/**
 * 内置默认备选项(仅作为未配置时的兜底,配置存在时不生效)
 * 函数形式返回,保证文案随当前语言刷新
 */
export function defaultCheckOptions(): CheckOption[] {
    return [
        {value: "", name: i18n("checkmatrix.empty")},
        {value: "OK", name: "OK"},
        {value: "NG", name: "NG"},
        {value: "NA", name: "NA"},
    ];
}

export interface MergeBlock {
    start: number;
    span: number;
}

/** 组件内部渲染行:分组信息 + 检查项配置(含稳定 key) + 已解析选项 */
export interface CheckRenderRow {
    key: string;
    groupTitle: string;
    isGroupFirst: boolean;
    groupSize: number;
    item: CheckGroupItem;
    /** 本行已解析的备选项(行配置 > 容器配置 > 内置默认) */
    options: CheckOption[];
}

/**
 * 解析备选项配置(灵活适配,不硬编码字段名):
 * - 数组 [{value,name}] 或 [{name,value}]
 * - 字符串 "T:对,F:错"(逗号/中文逗号/分号分隔;单段无冒号时 value=name;
 *   首段为空串表示"空"项);字符串 "空,对,错" 亦支持
 * - 空/未配置返回 []
 */
export function normalizeOptions(raw: any): CheckOption[] {
    if (!raw) return [];
    if (Array.isArray(raw)) {
        return raw
            .filter((one: any) => one != null)
            .map((one: any) => {
                if (typeof one === "string") {
                    return {value: one, name: one};
                }
                const value = String(one.value ?? one.name ?? "");
                const name = String(one.name ?? one.label ?? one.value ?? "");
                return {value, name};
            });
    }
    if (typeof raw === "string" && raw.trim()) {
        return raw
            .split(/[,，;；]/)
            .map((seg: string) => seg.trim())
            .filter((seg: string, idx: number) => seg !== "" || idx === 0)
            .map((seg: string) => {
                const parts = seg.split(/[:：]/);
                if (parts.length >= 2) {
                    return {value: parts[0].trim(), name: parts[1].trim()};
                }
                return {value: seg, name: seg};
            });
    }
    return [];
}

/**
 * 取渲染行的备选项:行 options > 容器 options > 内置默认
 */
export function resolveRowOptions(
    item: CheckGroupItem,
    preps?: CheckMatrixPreps,
): CheckOption[] {
    const rowOptions = normalizeOptions(item?.options);
    if (rowOptions.length > 0) return rowOptions;
    const containerOptions = normalizeOptions(preps?.options);
    if (containerOptions.length > 0) return containerOptions;
    return defaultCheckOptions();
}

/**
 * 该选项集的第一个非空选项的 value(列头/行号/组级批量填充目标;
 * 默认配置即 OK,配置 T/F 即 T)
 */
export function firstOptionOf(options: CheckOption[]): string {
    return options.find((opt) => opt.value !== "")?.value ?? "";
}

/**
 * 值 -> 显示文案(按选项 name;无匹配时回退原值)
 */
export function optionName(
    options: CheckOption[],
    value?: string,
): string {
    if (value === undefined || value === null || value === "") return "";
    const hit = options.find((opt) => opt.value === value);
    return hit ? hit.name : String(value);
}

/**
 * 值 -> 选项序号(用于颜色分组;未匹配返回 -1)
 */
export function optionIndex(
    options: CheckOption[],
    value?: string,
): number {
    return options.findIndex((opt) => opt.value === (value ?? ""));
}

/**
 * 选项循环:按本行配置顺序 空->opt1->opt2->...->optN->空
 * (默认配置即 空->OK->NG->NA->空,配置 T/F 即 空->T->F->空)
 */
export function nextOptionValue(
    options: CheckOption[],
    current?: string,
): string {
    const list = options.length > 0 ? options : defaultCheckOptions();
    const idx = list.findIndex((opt) => opt.value === (current ?? ""));
    if (idx < 0) return list[0].value;
    return list[(idx + 1) % list.length].value;
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
 * 键盘快捷值映射:数字键 -> 按当前行选项顺序取值(1=第1项,2=第2项...,0=空)
 * 返回 null 表示该键未映射
 */
export function keyToOptionValue(
    options: CheckOption[],
    key: string,
): string | null {
    if (key === "0") return "";
    const idx = Number(key);
    if (!Number.isInteger(idx) || idx < 1) return null;
    const list = options.length > 0 ? options : defaultCheckOptions();
    // 跳过第0项(空),数字键对应非空选项的第 idx 个
    const nonEmpty = list.filter((opt) => opt.value !== "");
    return nonEmpty[idx - 1] ? nonEmpty[idx - 1].value : null;
}

/** 按键提示项(key 为按键字符,name 为对应选项显示名) */
export interface KeyHint {
    key: string;
    name: string;
}

/**
 * 按键提示映射(完全按配置生成,与 keyToOptionValue 一致):
 * 固定 0=空(用配置中空项的 name,缺省"空"),
 * 其余数字键 1..N 依次对应 N 个非空选项(配置 3 项 → 共 4 个键 0/1/2/3)
 */
export function buildKeyMapHints(options: CheckOption[]): KeyHint[] {
    const list = options.length > 0 ? options : defaultCheckOptions();
    const emptyOpt = list.find((opt) => opt.value === "");
    const hints: KeyHint[] = [
        {key: "0", name: emptyOpt?.name || i18n("checkmatrix.empty")},
    ];
    list
        .filter((opt) => opt.value !== "")
        .forEach((opt, idx) => hints.push({key: String(idx + 1), name: opt.name}));
    return hints;
}

/**
 * checkGroups 展开为渲染行(生成稳定 key: item.id 或 组序号_项序号;
 * 每行解析出自身备选项:行配置 > 容器配置 > 内置默认)
 */
export function buildRenderRows(
    groups: CheckMatrixGroup[],
    containerPreps?: CheckMatrixPreps,
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
                options: resolveRowOptions(item, containerPreps),
            });
        });
    });
    return rows;
}

/**
 * 通用数据源选项解析为检查分组(与 select 等组件数据结构对齐):
 * compDynamicData 返回 [{name, value}]:
 * - name -> 分组标题
 * - value -> 该组检查项,适配三种形态(灵活适配,不硬编码字段名):
 *   1) CheckGroupItem 数组(动态接口返回对象数组)
 *   2) JSON 字符串(静态 values 手工配置/接口返回字符串)
 *   3) 单个对象 -> 视为仅一项的数组
 * 单项字段适配:content(检查内容)必填,freq/mergeRule/id 可选,
 * 兼容 name/label/text 作为 content 别名(后端 name/value 体系的灵活适配)
 */
export function parseCheckGroups(source: any[]): CheckMatrixGroup[] {
    if (!Array.isArray(source)) return [];
    const groups: CheckMatrixGroup[] = [];
    source.forEach((entry) => {
        if (!entry) return;
        const title = entry.name ?? entry.label ?? entry.title ?? "";
        let items: any[] = [];
        const raw = entry.value ?? entry.items;
        if (Array.isArray(raw)) {
            items = raw;
        } else if (typeof raw === "string" && raw.trim()) {
            try {
                const parsed = JSON.parse(raw);
                items = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                items = [];
            }
        } else if (raw && typeof raw === "object") {
            items = [raw];
        }
        const checkItems = items
            .filter((item) => item && typeof item === "object")
            .map((item) => ({
                id: item.id,
                content: item.content ?? item.name ?? item.label ?? item.text ?? "",
                freq: item.freq,
                mergeRule: item.mergeRule,
            }));
        if (checkItems.length === 0) return;
        groups.push({
            id: entry.id,
            title: String(title),
            items: checkItems,
        });
    });
    return groups;
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
 * 全局按选项序号填充:各检查项按其自身选项集的第 optIndex 项(跳过空项)填充
 * (optIndex=0 即全部填第一个非空项,默认配置即全 OK)
 */
export function fillAllByOptionIndex(
    value: CheckMatrixValue,
    rows: CheckRenderRow[],
    optIndex: number,
    containerPreps?: CheckMatrixPreps,
): void {
    ensureCheckValue(value, rows, containerPreps);
    for (const row of rows) {
        const nonEmpty = row.options.filter((opt) => opt.value !== "");
        const target = nonEmpty[optIndex];
        if (!target) continue;
        const rowValue = value.rows[row.key];
        if (Array.isArray(rowValue.results)) {
            rowValue.results = rowValue.results.map(() => target.value);
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

export interface CheckOptionStat {
    value: string;
    name: string;
    count: number;
}

export interface CheckStats {
    /** 各备选项计数(按 value 归并,含空项;不硬编码 OK/NG/NA) */
    byOption: CheckOptionStat[];
    empty: number;
    total: number;
}

/**
 * 统计全部检查项的备选项计数与未填数量(按每行配置的选项动态归并)
 */
export function getCheckStats(
    value: CheckMatrixValue | null | undefined,
    rows: CheckRenderRow[],
    containerPreps?: CheckMatrixPreps,
): CheckStats {
    const stats: CheckStats = {byOption: [], empty: 0, total: 0};
    if (!value) return stats;
    ensureCheckValue(value, rows, containerPreps);
    // 按 value 累加,显示名取首次出现的选项 name
    const buckets = new Map<string, CheckOptionStat>();
    const order: string[] = [];
    for (const row of rows) {
        for (const result of value.rows[row.key]?.results || []) {
            stats.total++;
            const key = result ?? "";
            if (key === "") {
                stats.empty++;
                continue;
            }
            if (!buckets.has(key)) {
                buckets.set(key, {
                    value: key,
                    name: optionName(row.options, key) || key,
                    count: 0,
                });
                order.push(key);
            }
            buckets.get(key)!.count++;
        }
    }
    stats.byOption = order.map((key) => buckets.get(key)!);
    return stats;
}

/**
 * 单个检查项是否存在"异常值"(行级红色标记):
 * 取该行选项集的第 2 个非空选项作为异常语义(默认配置即 NG/错),
 * 不硬编码具体值
 */
export function rowHasAbnormal(
    value: CheckMatrixValue | null | undefined,
    row: CheckRenderRow,
): boolean {
    const nonEmpty = (row.options || []).filter((opt) => opt.value !== "");
    const abnormalValue = nonEmpty[1]?.value;
    if (abnormalValue === undefined) return false;
    return (value?.rows?.[row.key]?.results || []).some(
        (result) => result === abnormalValue,
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
    if (mergeRule === "onceAll") return i18n("checkmatrix.blockWhole");
    if (mergeRule === "twoPerShift") {
        return blockIndex === 0
            ? i18n("checkmatrix.blockFirstHalf")
            : i18n("checkmatrix.blockSecondHalf");
    }
    if (block.span === 1) return i18n("checkmatrix.blockSlot", block.start + 1);
    return i18n(
        "checkmatrix.blockGroup",
        blockIndex + 1,
        block.start + 1,
        end + 1,
    );
}