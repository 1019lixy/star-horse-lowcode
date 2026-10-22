/**
 * 台账统计型表单的列定义与模拟数据(IPQC稽核问题一览表/过程首件确认一览表/
 * 点胶抽查记录表/检出率考核状况表),供 StarHorseStaticTable 渲染验证
 */
export interface LedgerDef {
    key: string;
    title: string;
    columns: Array<{label: string; prop: string; width?: number}>;
    dataList: Array<Record<string, any>>;
}

export const ipqcIssueLedger: LedgerDef = {
    key: "ipqcIssue",
    title: "IPQC稽核问题一览表",
    columns: [
        {label: "日期", prop: "date", width: 100},
        {label: "工单", prop: "workOrder", width: 130},
        {label: "线别", prop: "line", width: 90},
        {label: "检查项", prop: "checkItem", width: 220},
        {label: "问题描述", prop: "problem", width: 220},
        {label: "缺点等级", prop: "level", width: 90},
        {label: "责任人", prop: "owner", width: 90},
        {label: "改善措施", prop: "action", width: 220},
        {label: "验证结果", prop: "verify", width: 90},
        {label: "状态", prop: "status", width: 90},
    ],
    dataList: [
        {date: "2026-10-20", workOrder: "WO-20261020-01", line: "DIP-1", checkItem: "插件/上料核对", problem: "物料摆放标识缺失", level: "一般", owner: "张工", action: "重新张贴标识并培训", verify: "OK", status: "已闭环"},
        {date: "2026-10-20", workOrder: "WO-20261020-01", line: "DIP-1", checkItem: "波峰焊/参数", problem: "链条速度偏快0.02m/min", level: "异常", owner: "李工", action: "回调参数并首件确认", verify: "OK", status: "已闭环"},
        {date: "2026-10-21", workOrder: "WO-20261021-03", line: "SMT-2", checkItem: "印刷/锡膏", problem: "锡膏回温时间不足", level: "一般", owner: "王工", action: "严格执行回温记录", verify: "待验证", status: "改善中"},
        {date: "2026-10-21", workOrder: "WO-20261021-05", line: "TEST-1", checkItem: "校准/金板点检", problem: "金板点检记录未保存", level: "一般", owner: "赵工", action: "补记录并宣导", verify: "NG", status: "改善中"},
    ],
};

export const processFirstLedger: LedgerDef = {
    key: "processFirst",
    title: "过程首件确认一览表",
    columns: [
        {label: "日期", prop: "date", width: 100},
        {label: "工单", prop: "workOrder", width: 130},
        {label: "机型", prop: "model", width: 140},
        {label: "线别", prop: "line", width: 90},
        {label: "首件类型", prop: "firstType", width: 110},
        {label: "判定", prop: "judge", width: 80},
        {label: "确认人", prop: "confirmer", width: 90},
        {label: "备注", prop: "remark", width: 200},
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
        {label: "日期", prop: "date", width: 100},
        {label: "班次", prop: "shift", width: 80},
        {label: "工单", prop: "workOrder", width: 130},
        {label: "机型", prop: "model", width: 140},
        {label: "抽查数量", prop: "sampleQty", width: 90},
        {label: "胶量OK数", prop: "okQty", width: 90},
        {label: "不良描述", prop: "defect", width: 220},
        {label: "判定", prop: "judge", width: 80},
        {label: "记录人", prop: "recorder", width: 90},
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
        {label: "检验数量", prop: "checkQty", width: 100},
        {label: "检出数量", prop: "detectQty", width: 100},
        {label: "检出率", prop: "rate", width: 90},
        {label: "漏检数", prop: "missQty", width: 90},
        {label: "考核得分", prop: "score", width: 90},
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