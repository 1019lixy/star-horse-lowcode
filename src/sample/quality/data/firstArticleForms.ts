import type {CheckTemplateGroup} from "./inspectionCommon";
import {buildCheckValues} from "./inspectionCommon";
import type {InspectionFormDef} from "./inspectionForms";

/**
 * 首件确认表行式点检列(源自 SMT/DIP/TEST 首件确认表:
 * 时间/数据记录/异常原因对策/确认人 + 判定)
 */
const firstArticleEditColumns = [
    {key: "checkTime", label: "时间", type: "date", width: 150},
    {key: "dataRecord", label: "数据记录", type: "input", width: 190},
    {key: "abnormalCause", label: "异常原因/对策", type: "input", width: 210},
    {key: "confirmer", label: "确认人", type: "input", width: 110},
    {
        key: "judge",
        label: "判定",
        type: "select",
        width: 100,
        values: [
            {name: "OK", value: "OK"},
            {name: "NG", value: "NG"},
            {name: "NA", value: "NA"},
        ],
    },
] as const;

const smtFirstGroups: CheckTemplateGroup[] = [
    {
        title: "钢网",
        items: [
            {content: "钢网张力测试符合标准(≥35N/cm²)并记录", freq: "每班", mergeRule: "onceAll"},
            {content: "钢网清洗按 SOP 执行,无堵塞、破损", freq: "每班", mergeRule: "onceAll"},
        ],
    },
    {
        title: "锡膏印刷",
        items: [
            {content: "锡膏型号符合 BOM 要求并在有效期内,回温搅拌记录 OK", freq: "每班", mergeRule: "onceAll"},
            {content: "印刷参数(刮刀速度/压力/脱模速度)与 SOP 一致", freq: "每班", mergeRule: "onceAll"},
            {content: "首件印刷效果确认:无少锡、连锡、偏移、塌陷", freq: "每班", mergeRule: "onceAll"},
        ],
    },
    {
        title: "贴片",
        items: [
            {content: "上料站位与上料表一致,料号与 BOM 核对 OK", freq: "每班", mergeRule: "onceAll"},
            {content: "贴片首件坐标/极性/方向确认 OK,无偏移、侧立、翻件", freq: "每班", mergeRule: "onceAll"},
            {content: " feeder 安装正确,无报警异常", freq: "每班", mergeRule: "onceAll"},
        ],
    },
    {
        title: "回流焊",
        items: [
            {content: "炉温曲线与 SOP 一致,首件炉温测试记录 OK", freq: "每班", mergeRule: "onceAll"},
            {content: "回流后焊点光泽饱满,无立碑、虚焊、锡珠超标", freq: "每班", mergeRule: "onceAll"},
        ],
    },
    {
        title: "炉后AOI",
        items: [
            {content: "AOI 程序版本与机型一致,首件 AOI 检测无漏报误报", freq: "每班", mergeRule: "onceAll"},
        ],
    },
    {
        title: "目检",
        items: [
            {content: "首件外观确认:无偏移、少件、错件、极性反、污染", freq: "每班", mergeRule: "onceAll"},
        ],
    },
];

const dipFirstGroups: CheckTemplateGroup[] = [
    {
        title: "投板",
        items: [
            {content: "首件物料料号与实物一致,与 BOM 核对 OK", freq: "每班", mergeRule: "onceAll"},
        ],
    },
    {
        title: "插件",
        items: [
            {content: "首件插件位置/方向/型号与 BOM 及 SOP 一致,无漏插、错插", freq: "每班", mergeRule: "onceAll"},
            {content: "剪脚高度符合 SOP 要求", freq: "每班", mergeRule: "onceAll"},
        ],
    },
    {
        title: "波峰焊",
        items: [
            {content: "波峰焊参数与炉温曲线 SOP 一致,首件焊接效果 OK", freq: "每班", mergeRule: "onceAll"},
            {content: "首件焊点饱满,无连锡、假焊、漏焊、锡珠超标", freq: "每班", mergeRule: "onceAll"},
        ],
    },
    {
        title: "目检补焊",
        items: [
            {content: "首件补焊无伤板,清洁后无残留", freq: "每班", mergeRule: "onceAll"},
        ],
    },
];

const testGlueFirstGroups: CheckTemplateGroup[] = [
    {
        title: "点胶",
        items: [
            {content: "胶水型号符合 SOP 并在有效期内", freq: "每班", mergeRule: "onceAll"},
            {content: "点胶位置/胶量/胶高符合 SOP 首件确认 OK,无污染、溢胶", freq: "每班", mergeRule: "onceAll"},
        ],
    },
    {
        title: "功能测试",
        items: [
            {content: "测试工具/软件版本与生产任务书一致", freq: "每班", mergeRule: "onceAll"},
            {content: "首件测试项目全覆盖通过,测试记录归档", freq: "每班", mergeRule: "onceAll"},
        ],
    },
    {
        title: "外观",
        items: [
            {content: "首件外观无胶污、划伤、崩边,标识清晰", freq: "每班", mergeRule: "onceAll"},
        ],
    },
];

/**
 * 首件确认表头部字段(线别/日期班别/工单/产品/版本/BOM/批量/首件类型)
 */
function buildFirstHeaderFields(prefix: string): Array<Record<string, any>> {
    return [
        {label: "线别", fieldName: `${prefix}Line`, type: "input", required: true, formVisible: true, preps: {dataIndex: 1}},
        {label: "日期/班别", fieldName: `${prefix}DateShift`, type: "input", required: true, formVisible: true, preps: {dataIndex: 2}},
        {label: "生产工单号", fieldName: `${prefix}WorkOrder`, type: "input", required: true, formVisible: true, preps: {dataIndex: 3}},
        {label: "产品名称", fieldName: `${prefix}Product`, type: "input", required: true, formVisible: true, preps: {dataIndex: 4}},
        {label: "软件版本", fieldName: `${prefix}SoftVersion`, type: "input", formVisible: true, preps: {dataIndex: 5}},
        {label: "BOM", fieldName: `${prefix}Bom`, type: "input", formVisible: true, preps: {dataIndex: 6}},
        {label: "批量/样本数", fieldName: `${prefix}BatchQty`, type: "number", formVisible: true, preps: {dataIndex: 7}},
        {label: "PCB版本/周期", fieldName: `${prefix}PcbVersion`, type: "input", formVisible: true, preps: {dataIndex: 8}},
        {
            label: "首件类型",
            fieldName: `${prefix}FirstType`,
            type: "select",
            formVisible: true,
            preps: {
                dataIndex: 9,
                values: [
                    {name: "正常首件", value: "normal"},
                    {name: "转产首件", value: "changeover"},
                    {name: "4M变更首件", value: "change4m"},
                    {name: "批次重启首件", value: "restart"},
                ],
            },
        },
    ];
}

/**
 * 组装一张首件确认表模型: descriptions 头部 + checkmatrix 字段(rowEdit 行式点检)
 */
function buildFirstArticleForm(
    key: string,
    title: string,
    groups: CheckTemplateGroup[],
): InspectionFormDef {
    const matrixFieldName = `${key}CheckMatrix`;
    return {
        key,
        title,
        kind: "rowEdit",
        matrixFieldName,
        fieldList: {
            fieldList: [
                {
                    fieldName: `${key}Header`,
                    label: "首件信息",
                    containerType: "descriptions",
                    formVisible: true,
                    containerFields: [
                        {
                            subTablePrimaryKey: "header",
                            subTableName: "qm_first_header",
                            subFormFlag: "N",
                            title: "首件信息",
                            formVisible: true,
                            fieldList: buildFirstHeaderFields(key),
                            preps: {},
                        },
                    ],
                    preps: {
                        direction: "horizontal",
                        column: 3,
                        border: true,
                        descItemLabelWidth: "100px",
                    },
                },
                {
                    label: "首件确认项目",
                    fieldName: matrixFieldName,
                    type: "checkmatrix",
                    formVisible: true,
                    preps: {
                        dataIndex: 10,
                        hideLabel: true,
                        appLabelVisible: true,
                        matrixTitle: `${title} · 确认项目`,
                        columnModel: "rowEdit",
                        values: buildCheckValues(groups),
                        editColumns: firstArticleEditColumns.map((column) => ({
                            ...column,
                        })),
                        showRemark: true,
                        noteText: "首件确认:检查项逐行确认,填写时间/数据记录/异常对策与确认人,判定选 OK/NG/NA。",
                    },
                },
            ],
        },
        dataForm: {
            [matrixFieldName]: {rows: {}},
        },
    };
}

export const smtFirstForm = buildFirstArticleForm(
    "smtFirst",
    "SMT首件确认表",
    smtFirstGroups,
);
export const dipFirstForm = buildFirstArticleForm(
    "dipFirst",
    "DIP首件确认表",
    dipFirstGroups,
);
export const testGlueFirstForm = buildFirstArticleForm(
    "testGlueFirst",
    "TEST点胶首件确认表",
    testGlueFirstGroups,
);

export const firstArticleForms: InspectionFormDef[] = [
    smtFirstForm,
    dipFirstForm,
    testGlueFirstForm,
];