/**
 * 台账统计类表单(Excel 一览表):用 shplugin 列表组件 star-horse-table-comp 渲染。
 * - 公共部分:列定义(fieldList)即台账主表结构(日期/工单/线别/检查项/问题...)
 * - 数据行:每条台账记录一行(dataList);demo 无后端时经 stopAutoLoad + tableDataList 提供
 */
export interface LedgerColumnDef {
    label: string;
    prop: string;
    width?: number;
    type?: string;
    values?: Array<{ name: string; value: string }>;
}

export interface LedgerDef {
    key: string;
    title: string;
    columns: LedgerColumnDef[];
    dataList: Array<Record<string, any>>;
}

export const ipqcIssueLedger: LedgerDef = {
    key: "ipqcIssue",
    title: "IPQC稽核问题一览表",
    columns: [
        {label: "日期", prop: "date", width: 110, type: "date"},
        {label: "工单", prop: "workOrder", width: 140},
        {label: "线别", prop: "line", width: 90},
        {label: "检查项", prop: "checkItem", width: 220},
        {label: "问题描述", prop: "problem", width: 220},
        {
            label: "缺点等级",
            prop: "level",
            width: 100,
            type: "select",
            values: [
                {name: "一般", value: "一般"},
                {name: "异常", value: "异常"},
                {name: "停线", value: "停线"},
            ],
        },
        {label: "责任人", prop: "owner", width: 100},
        {label: "改善措施", prop: "action", width: 220},
        {label: "验证结果", prop: "verify", width: 100},
        {
            label: "状态",
            prop: "status",
            width: 100,
            type: "select",
            values: [
                {name: "已闭环", value: "已闭环"},
                {name: "改善中", value: "改善中"},
            ],
        },
    ],
    dataList: [
        {
            date: "2026-10-20",
            workOrder: "WO-20261020-01",
            line: "DIP-1",
            checkItem: "插件/上料核对",
            problem: "物料摆放标识缺失",
            level: "一般",
            owner: "张工",
            action: "重新张贴标识并培训",
            verify: "OK",
            status: "已闭环",
        },
        {
            date: "2026-10-20",
            workOrder: "WO-20261020-01",
            line: "DIP-1",
            checkItem: "波峰焊/参数",
            problem: "链条速度偏快0.02m/min",
            level: "异常",
            owner: "李工",
            action: "回调参数并首件确认",
            verify: "OK",
            status: "已闭环",
        },
        {
            date: "2026-10-21",
            workOrder: "WO-20261021-03",
            line: "SMT-2",
            checkItem: "印刷/锡膏",
            problem: "锡膏回温时间不足",
            level: "一般",
            owner: "王工",
            action: "严格执行回温记录",
            verify: "待验证",
            status: "改善中",
        },
        {
            date: "2026-10-21",
            workOrder: "WO-20261021-05",
            line: "TEST-1",
            checkItem: "校准/金板点检",
            problem: "金板点检记录未保存",
            level: "一般",
            owner: "赵工",
            action: "补记录并宣导",
            verify: "NG",
            status: "改善中",
        },
    ],
};

export const processFirstLedger: LedgerDef = {
    key: "processFirst",
    title: "过程首件确认一览表",
    columns: [
        {label: "日期", prop: "date", width: 110, type: "date"},
        {label: "工单", prop: "workOrder", width: 140},
        {label: "机型", prop: "model", width: 140},
        {label: "线别", prop: "line", width: 90},
        {
            label: "首件类型",
            prop: "firstType",
            width: 120,
            type: "select",
            values: [
                {name: "正常首件", value: "正常首件"},
                {name: "转产首件", value: "转产首件"},
                {name: "4M变更首件", value: "4M变更首件"},
                {name: "批次重启首件", value: "批次重启首件"},
            ],
        },
        {label: "判定", prop: "judge", width: 80},
        {label: "确认人", prop: "confirmer", width: 100},
        {label: "备注", prop: "remark", width: 220},
    ],
    dataList: [
        {date: "2026-10-20", workOrder: "WO-20261020-01", model: "HP-5200", line: "SMT-1", firstType: "转产首件", judge: "OK", confirmer: "陈检", remark: ""},
        {date: "2026-10-20", workOrder: "WO-20261020-02", model: "HP-6100", line: "SMT-2", firstType: "正常首件", judge: "OK", confirmer: "陈检", remark: ""},
        {date: "2026-10-21", workOrder: "WO-20261021-03", model: "HP-5200", line: "DIP-1", firstType: "4M变更首件", judge: "NG", confirmer: "周检", remark: "首件插件反向,已返工重检"},
        {date: "2026-10-21", workOrder: "WO-20261021-05", model: "HP-7200", line: "TEST-1", firstType: "批次重启首件", judge: "OK", confirmer: "吴检", remark: ""},
    ],
};

export const glueCheckLedger: LedgerDef = {
    key: "glueCheck",
    title: "点胶抽查记录表",
    columns: [
        {label: "日期", prop: "date", width: 110, type: "date"},
        {label: "班次", prop: "shift", width: 90},
        {label: "工单", prop: "workOrder", width: 140},
        {label: "机型", prop: "model", width: 140},
        {label: "抽查数量", prop: "sampleQty", width: 100, type: "number"},
        {label: "胶量OK数", prop: "okQty", width: 100, type: "number"},
        {label: "不良描述", prop: "defect", width: 220},
        {label: "判定", prop: "judge", width: 80},
        {label: "记录人", prop: "recorder", width: 100},
    ],
    dataList: [
        {date: "2026-10-20", shift: "白班", workOrder: "WO-20261020-01", model: "HP-7200", sampleQty: 20, okQty: 20, defect: "", judge: "OK", recorder: "刘检"},
        {date: "2026-10-20", shift: "夜班", workOrder: "WO-20261020-01", model: "HP-7200", sampleQty: 20, okQty: 19, defect: "1pcs 点胶量偏少", judge: "NG", recorder: "孙检"},
        {date: "2026-10-21", shift: "白班", workOrder: "WO-20261021-05", model: "HP-7200", sampleQty: 15, okQty: 15, defect: "", judge: "OK", recorder: "刘检"},
    ],
};

export const detectionRateLedger: LedgerDef = {
    key: "detectionRate",
    title: "检出率考核状况表",
    columns: [
        {label: "月份", prop: "month", width: 90},
        {label: "检验员", prop: "inspector", width: 100},
        {label: "检验数量", prop: "checkQty", width: 100, type: "number"},
        {label: "检出数量", prop: "detectQty", width: 100, type: "number"},
        {label: "检出率", prop: "rate", width: 90},
        {label: "漏检数", prop: "missQty", width: 90, type: "number"},
        {label: "考核得分", prop: "score", width: 90, type: "number"},
    ],
    dataList: [
        {month: "2026-07", inspector: "陈检", checkQty: 12800, detectQty: 356, rate: "97.8%", missQty: 8, score: 92},
        {month: "2026-07", inspector: "周检", checkQty: 11500, detectQty: 310, rate: "97.2%", missQty: 9, score: 90},
        {month: "2026-08", inspector: "陈检", checkQty: 13200, detectQty: 371, rate: "98.1%", missQty: 7, score: 94},
        {month: "2026-08", inspector: "吴检", checkQty: 10800, detectQty: 288, rate: "96.9%", missQty: 9, score: 89},
        {month: "2026-09", inspector: "周检", checkQty: 12100, detectQty: 335, rate: "97.6%", missQty: 8, score: 91},
    ],
};

export const ledgerDefs: LedgerDef[] = [
    ipqcIssueLedger,
    processFirstLedger,
    glueCheckLedger,
    detectionRateLedger,
];

/**
 * 台账列定义转 star-horse-table-comp 的 fieldList 结构:
 * stopAutoLoad=true 表示用外部 tableDataList 作为数据源(无后端接口场景)
 */
export function buildLedgerFieldList(ledger: LedgerDef) {
    return {
        stopAutoLoad: true,
        fieldList: ledger.columns.map((column, index) => ({
            label: column.label,
            fieldName: column.prop,
            type: column.type || "input",
            listVisible: true,
            formVisible: true,
            minWidth: column.width || 120,
            preps: {
                dataIndex: index + 1,
                values: column.values || [],
            },
        })),
    };
}

/**
 * 台账表单模型(Excel 一览表 -> 表单形态,非列表展示组件):
 * 公共部分 -> 主表字段(descriptions 容器:统计期间/部门/制表人等)
 * 非公共部分 -> 子表字段(table 容器,subFormFlag:"Y",支持行增删编辑)
 * 渲染链路 table 容器 -> StarHorseFormTable -> StarHorseFormList
 */
export interface LedgerFormModel {
    key: string;
    title: string;
    /** 主表(公共)字段 */
    headerFields: Array<Record<string, any>>;
    /** 子表(明细)列 */
    rowColumns: Array<Record<string, any>>;
    /** 子表数据 key(dataForm 中的数组) */
    subTableName: string;
    /** 子表初始示例行 */
    initRows: Array<Record<string, any>>;
}

function ledgerField(
    label: string,
    fieldName: string,
    type: string,
    dataIndex: number,
    extra: Record<string, any> = {},
): Record<string, any> {
    return {
        label,
        fieldName,
        type,
        required: extra.required ?? false,
        formVisible: true,
        preps: {dataIndex, ...extra},
    };
}

/** 台账列定义转子表列字段 */
function columnsToRows(ledger: LedgerDef): Array<Record<string, any>> {
    return ledger.columns.map((column, index) =>
        ledgerField(column.label, column.prop, column.type || "input", index + 1, {
            minWidth: column.width || 120,
            values: column.values || [],
        }),
    );
}

export const ledgerFormModels: LedgerFormModel[] = ledgerDefs.map(
    (ledger, idx) => ({
        key: ledger.key,
        title: ledger.title,
        subTableName: `${ledger.key}Rows`,
        headerFields: [
            ledgerField("统计期间", `${ledger.key}Period`, "input", 1, {required: true, placeholder: "如 2026-10"}),
            ledgerField("统计部门", `${ledger.key}Dept`, "input", 2, {placeholder: "质量部"}),
            ledgerField("制表人", `${ledger.key}Reporter`, "input", 3),
            ledgerField("审批人", `${ledger.key}Approver`, "input", 4),
            ledgerField("制表日期", `${ledger.key}ReportDate`, "date", 5),
        ],
        rowColumns: [
            ledgerField("序号", "detailNo", "number", 1, {minWidth: 60}),
            ...columnsToRows(ledger),
        ],
        initRows: ledger.dataList.map((row, index) => ({
            ...row,
            detailNo: index + 1,
        })),
    }),
);

/** 组装一张台账表单:descriptions 主表(公共) + table 子表(明细) */
export function buildLedgerForm(model: LedgerFormModel) {
    return {
        key: model.key,
        title: model.title,
        kind: "rowEdit" as const,
        matrixFieldName: "",
        fieldList: {
            fieldList: [
                {
                    fieldName: `${model.key}Header`,
                    label: "公共信息",
                    containerType: "descriptions",
                    formVisible: true,
                    containerFields: [
                        {
                            subTablePrimaryKey: `ledger_${model.key}`,
                            subTableName: "qm_ledger_header",
                            subFormFlag: "N",
                            title: "公共信息",
                            formVisible: true,
                            fieldList: model.headerFields,
                            preps: {},
                        },
                    ],
                    preps: {
                        dataIndex: 1,
                        direction: "vertical",
                        column: 2,
                        border: true,
                        descItemLabelWidth: "100px",
                    },
                },
                {
                    fieldName: `${model.key}RowTable`,
                    label: "记录明细",
                    containerType: "table",
                    formVisible: true,
                    containerFields: [
                        {
                            subTablePrimaryKey: model.subTableName,
                            subTableName: model.subTableName,
                            subFormFlag: "Y",
                            title: "记录明细",
                            formVisible: true,
                            fieldList: model.rowColumns,
                            preps: {},
                        },
                    ],
                    preps: {dataIndex: 20},
                },
            ],
        },
        dataForm: {
            [model.subTableName]: model.initRows,
        },
    };
}

export const ledgerForms = ledgerFormModels.map((model) =>
    buildLedgerForm(model),
);
