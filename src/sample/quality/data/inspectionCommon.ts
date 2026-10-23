/**
 * 巡查表/首件表 checkmatrix demo 共用模板类型与常量
 */
import {getMergeBlocks} from "@/components/comp/checkmatrix/useCheckMatrixState";

export interface CheckTemplateItem {
    content: string;
    freq: string;
    mergeRule: "twoPerShift" | "every2h" | "every4h" | "onceAll";
    /**
     * 该检查项自身备选项(可选):不同检查项语义可不同,
     * 数组 [{value,name}] 或字符串 "T:对,F:错";缺省用内置默认(空/OK/NG/NA)
     */
    options?: Array<{ value: string; name: string }> | string;
}

export interface CheckTemplateGroup {
    title: string;
    items: CheckTemplateItem[];
}

/**
 * IPQC 巡查表标准 6 时段(白班/夜班双行表头)
 */
export const ipqcTimeSlots = [
    {label: "8:00-10:00", sub: "20:00-22:00"},
    {label: "10:00-12:00", sub: "22:00-00:00"},
    {label: "12:00-14:00", sub: "00:00-2:00"},
    {label: "14:00-16:00", sub: "2:00-4:00"},
    {label: "16:00-18:00", sub: "4:00-6:00"},
    {label: "18:00-20:00", sub: "6:00-8:00"},
];

/**
 * 缺点定义说明(IPQC 巡查表底部)
 */
export const defectNoteText = `1、缺点定义:一般=对品质未造成直接或间接伤害或隐患(稽核问题再次确认时未改善转为主要缺点);异常=直接或间接对品质造成隐患或重工;停线=单个或批量错料、反向、错位、ECN未导入等。
2、如内容不适用,请填 NA。`;

/**
 * checkitem 默认备选项(空/OK/NG/NA)
 */
const defaultCheckItemOptions = [
    {name: "空", value: ""},
    {name: "OK", value: "OK"},
    {name: "NG", value: "NG"},
    {name: "NA", value: "NA"},
];

/**
 * checkmatrix 单元格字段名递增序号(保证全局唯一)
 */
let checkMatrixFieldSeq = 0;

function nextCheckMatrixFieldName(prefix: string): string {
    checkMatrixFieldSeq += 1;
    return `${prefix}_f${checkMatrixFieldSeq}`;
}

/**
 * 解析检查项备选项:支持 [{value,name}] 数组或 "T:对,F:错" 字符串,缺省用默认
 */
function resolveCheckItemOptions(
    item: CheckTemplateItem,
): Array<{ name: string; value: string }> {
    if (!item.options) return defaultCheckItemOptions;
    if (typeof item.options === "string") {
        return item.options.split(",").map((pair) => {
            const [value, name] = pair.split(":");
            return {name: name ?? value, value};
        });
    }
    return item.options;
}

/**
 * 构造静态文本格(用于表头/分组名/检查内容等不可编辑文本)
 */
function buildStaticCell(
    text: string,
    rowspan = 1,
    colspan = 1,
): Record<string, any> {
    return {
        staticData: true,
        preps: {
            textContent: text,
            rowspan,
            colspan,
            cellVisible: true,
        },
    };
}

/**
 * 构造字段格(每格一个独立字段,绑定 dataForm[fieldName])
 * 与 boxDytableAnalysis 产物一致: items.length==1 时直接放字段本身(不包 items 层)
 */
function buildFieldCell(
    field: Record<string, any>,
    rowspan = 1,
    colspan = 1,
): Record<string, any> {
    return {
        ...field,
        preps: {
            ...(field.preps || {}),
            rowspan,
            colspan,
            cellVisible: true,
        },
    };
}

/**
 * 构造 checkitem 字段(巡查表时段点检格)
 */
function buildCheckItemField(
    item: CheckTemplateItem,
    fieldPrefix: string,
): Record<string, any> {
    return {
        type: "checkitem",
        fieldName: nextCheckMatrixFieldName(fieldPrefix),
        preps: {
            mergeRule: item.mergeRule,
            options: resolveCheckItemOptions(item),
        },
    };
}

/**
 * 构造 input 字段(备注/数据记录等文本输入格)
 */
function buildInputField(
    fieldPrefix: string,
    label?: string,
): Record<string, any> {
    const field: Record<string, any> = {
        type: "input",
        fieldName: nextCheckMatrixFieldName(fieldPrefix),
        preps: {
            // 矩阵格内的 label 不显示:表头(时段/列名)已说明含义,格内重复显示会污染业务内容
            hideLabel: true,
        },
    };
    if (label) field.label = label;
    return field;
}

/**
 * 首件表行式点检列(各表按 Excel 传入,含类型):
 * type: date(默认当前时间) | select(下拉) | checkitem(点检是/否/OK等) | input | number
 * 高效作业:能选择/自动带出的绝不手输
 */
export interface FirstArticleColumn {
    label: string;
    /** date 默认当前时间;autoUser 默认当前登录人 */
    type?: "date" | "time" | "datetime" | "select" | "checkitem" | "input" | "number";
    values?: Array<{ name: string; value: string }>;
    autoCurrent?: boolean;
}

/**
 * 检查项模板转 checkmatrix 容器 elements 二维数组(与 dytable 同构):
 * 每个外层元素 = 一行,内层数组 = 该行 columns[]。
 * - columnModel "triState": 表头(项目/检查内容/稽核频率/时段1..N/备注) + 检查项行,
 *   时段列为 checkitem 字段格,备注为 input 字段格,分组名用 rowspan 合并。
 * - columnModel "rowEdit": 表头(项目/检查内容/时间/数据记录/异常对策/确认人/备注)
 *   + 检查项行,字段列均为 input 字段格,分组名用 rowspan 合并。
 */
export function buildCheckMatrixElements(
    groups: CheckTemplateGroup[],
    columnModel: "triState" | "rowEdit",
    fieldPrefix: string,
    timeSlots?: ReadonlyArray<{ label: string; sub: string }>,
    editColumns?: FirstArticleColumn[],
): Array<Array<Record<string, any>>> {
    const rows: Array<Array<Record<string, any>>> = [];
    const slotCount = timeSlots?.length ?? 0;

    if (columnModel === "triState") {
        rows.push([
            buildStaticCell("项目"),
            buildStaticCell("检查内容"),
            buildStaticCell("稽核频率"),
            ...(timeSlots ?? []).map((slot) =>
                buildStaticCell(slot.sub ? `${slot.label}\n${slot.sub}` : slot.label),
            ),
            buildStaticCell("备注"),
        ]);
        for (const group of groups) {
            const groupSize = group.items.length;
            group.items.forEach((item, idx) => {
                const row: Array<Record<string, any>> = [];
                // 视觉列索引:分组首行从0开始(含分组名),同组后续行从1开始(跳过分组名 rowspan)
                let vc = idx === 0 ? 0 : 1;
                if (idx === 0) {
                    row.push(
                        withVisualCol(
                            buildStaticCell(group.title, groupSize, 1),
                            vc++,
                        ),
                    );
                }
                row.push(withVisualCol(buildStaticCell(item.content), vc++));
                row.push(withVisualCol(buildStaticCell(item.freq), vc++));
                // 按 mergeRule 合并时段格(与重构前 getMergeBlocks 逻辑一致)
                const blocks = getMergeBlocks(item.mergeRule, slotCount);
                for (const block of blocks) {
                    row.push(
                        withVisualCol(
                            buildFieldCell(
                                buildCheckItemField(item, fieldPrefix),
                                1,
                                block.span,
                            ),
                            vc,
                        ),
                    );
                    vc += block.span;
                }
                row.push(
                    withVisualCol(
                        buildFieldCell(buildInputField(fieldPrefix)),
                        vc,
                    ),
                );
                rows.push(row);
            });
        }
    } else {
        const columns = editColumns || [];
        rows.push([
            buildStaticCell("项目"),
            buildStaticCell("检查内容"),
            ...columns.map((col) => buildStaticCell(col.label)),
            buildStaticCell("备注"),
        ]);
        for (const group of groups) {
            const groupSize = group.items.length;
            group.items.forEach((item, idx) => {
                const row: Array<Record<string, any>> = [];
                let vc = idx === 0 ? 0 : 1;
                if (idx === 0) {
                    row.push(
                        withVisualCol(
                            buildStaticCell(group.title, groupSize, 1),
                            vc++,
                        ),
                    );
                }
                row.push(withVisualCol(buildStaticCell(item.content), vc++));
                // 按列语义生成字段:选择/点检/自动带出优先,减少手输
                for (const col of columns) {
                    row.push(
                        withVisualCol(
                            buildFieldCell(
                                buildFirstArticleField(fieldPrefix, col),
                            ),
                            vc++,
                        ),
                    );
                }
                row.push(
                    withVisualCol(
                        buildFieldCell(buildInputField(fieldPrefix)),
                        vc,
                    ),
                );
                rows.push(row);
            });
        }
    }
    return rows;
}

/**
 * 按首件表列定义生成单元格字段(高效:能选择/自动带出的绝不手输):
 * - date: 日期/时间控件,autoCurrent 时默认当前时间
 * - checkitem: 点检格(是/否/OK等,点击循环选择)
 * - select: 下拉选择
 * - number/input: 输入(数字/文本)
 */
function buildFirstArticleField(
    fieldPrefix: string,
    col: FirstArticleColumn,
): Record<string, any> {
    const fieldName = nextCheckMatrixFieldName(fieldPrefix);
    const type = col.type || "input";
    if (type === "checkitem") {
        return {
            type: "checkitem",
            fieldName,
            label: col.label,
            preps: {
                hideLabel: true,
                mergeRule: "onceAll",
                options:
                    col.values ||
                    [
                        {name: "是", value: "Y"},
                        {name: "否", value: "N"},
                    ],
            },
        };
    }
    return {
        type,
        fieldName,
        label: col.label,
        preps: {
            hideLabel: true,
            values: col.values || [],
            // 日期/时间默认当前值,确认人等默认当前登录人(免手输)
            defaultCurrent: col.autoCurrent === true,
        },
    };
}

/**
 * 给单元格标注视觉列索引(行内累计 colspan 得到,用于列头点击整列循环时定位)
 */
function withVisualCol(
    cell: Record<string, any>,
    visualColIndex: number,
): Record<string, any> {
    cell.preps = cell.preps || {};
    cell.preps.visualColIndex = visualColIndex;
    return cell;
}

/**
 * 头部元信息字段(工单/客户/机型/生产日期/班线别)
 */
export function buildInspectionHeaderFields(
    prefix: string,
): Array<Record<string, any>> {
    return [
        {
            label: "工单",
            fieldName: `${prefix}WorkOrder`,
            type: "input",
            required: true,
            formVisible: true,
            preps: {dataIndex: 1, placeholder: "输入或选择工单"},
        },
        {
            label: "客户",
            fieldName: `${prefix}Customer`,
            type: "input",
            required: true,
            formVisible: true,
            preps: {dataIndex: 2, placeholder: "自动带出"},
        },
        {
            label: "机型",
            fieldName: `${prefix}Model`,
            type: "input",
            required: true,
            formVisible: true,
            preps: {dataIndex: 3, placeholder: "自动带出"},
        },
        {
            label: "生产日期",
            fieldName: `${prefix}ProduceDate`,
            type: "date",
            required: true,
            formVisible: true,
            preps: {dataIndex: 4},
        },
        {
            label: "班/线别",
            fieldName: `${prefix}Shift`,
            type: "select",
            formVisible: true,
            preps: {
                dataIndex: 5,
                values: [
                    {name: "白班 · 线1", value: "白班 · 线1"},
                    {name: "白班 · 线2", value: "白班 · 线2"},
                    {name: "夜班 · 线1", value: "夜班 · 线1"},
                    {name: "夜班 · 线2", value: "夜班 · 线2"},
                ],
            },
        },
        {
            label: "稽核员",
            fieldName: `${prefix}Inspector`,
            type: "input",
            formVisible: true,
            preps: {dataIndex: 6, placeholder: "巡查人"},
        },
        {
            label: "批准",
            fieldName: `${prefix}Approve`,
            type: "input",
            formVisible: true,
            preps: {dataIndex: 7},
        },
        {
            label: "审核",
            fieldName: `${prefix}Audit`,
            type: "input",
            formVisible: true,
            preps: {dataIndex: 8},
        },
        {
            label: "作成",
            fieldName: `${prefix}Create`,
            type: "input",
            formVisible: true,
            preps: {dataIndex: 9},
        },
    ];
}

/**
 * 问题点 & 改善记录子表字段(table 容器行编辑)
 */
export function buildIssueTableFields(
    prefix: string,
): Array<Record<string, any>> {
    return [
        {
            label: "NO.",
            fieldName: "issueNo",
            type: "number",
            formVisible: true,
            preps: {minWidth: 60},
        },
        {
            label: "问题点",
            fieldName: "problemPoint",
            type: "input",
            required: true,
            formVisible: true,
            preps: {minWidth: 200},
        },
        {
            label: "改善措施",
            fieldName: "improveAction",
            type: "input",
            formVisible: true,
            preps: {minWidth: 200},
        },
        {
            label: "责任人",
            fieldName: "respUser",
            type: "input",
            formVisible: true,
            preps: {minWidth: 100},
        },
        {
            label: "效果验证",
            fieldName: "verifyResult",
            type: "input",
            formVisible: true,
            preps: {minWidth: 100},
        },
    ].map((field) => ({
        ...field,
        fieldName:
            field.fieldName === "issueNo"
                ? `${prefix}IssueNo`
                : `${prefix}${field.fieldName
                    .charAt(0)
                    .toUpperCase()}${field.fieldName.slice(1)}`,
    }));
}