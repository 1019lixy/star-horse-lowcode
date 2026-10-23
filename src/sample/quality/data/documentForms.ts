import type {PageFieldInfo} from "@/components/types";
import type {InspectionFormDef} from "./inspectionForms";

/**
 * 单据审批类表单建模(Excel 公共/非公共拆分):
 * - 公共部分(表头:单号/日期/线别/工单/等级/签核等) -> 主表字段,放 descriptions 容器
 * - 非公共部分(逐行明细:不良现象/对策/责任等) -> 子表字段,放 table 容器(containerType:"table")
 * 对应 Excel 中"表头固定区 + 下方明细列表"的排版
 */

export interface DocumentFieldGroup {
    title: string;
    fields: Array<Record<string, any>>;
}

function docField(
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

interface DocumentModel {
    key: string;
    title: string;
    /** 公共部分(主表)字段分组 */
    headerGroups: DocumentFieldGroup[];
    /** 非公共部分(子表)明细列 */
    detailColumns: Array<Record<string, any>>;
    detailTitle: string;
}

const abnormalModel: DocumentModel = {
    key: "abnormal",
    title: "异常反馈单",
    headerGroups: [
        {
            title: "审批签核",
            fields: [
                docField("批准", "abApprove", "input", 1),
                docField("审核时间", "abAuditTime", "datetime", 2),
                docField("作成", "abCreator", "input", 3),
                docField("作成时间", "abCreateTime", "datetime", 4),
            ],
        },
        {
            title: "基本信息",
            fields: [
                docField("TO", "abTo", "input", 5),
                docField("CC", "abCc", "input", 6),
                docField("编号", "abNo", "input", 7),
                docField("机型", "abModel", "input", 8),
                docField("生产批号", "abBatchNo", "input", 9),
                docField("批量", "abBatchQty", "number", 10),
                docField("发生时间", "abOccurTime", "datetime", 11),
                docField("投入数", "abInputQty", "number", 12),
                docField("不良数", "abDefectQty", "number", 13),
                docField("不良率", "abDefectRate", "input", 14),
                docField("反馈时间", "abFeedbackTime", "datetime", 15),
            ],
        },
        {
            title: "异常描述",
            fields: [
                docField("异常内容描述", "abContentDesc", "textarea", 16, {fullRow: true}),
                docField("开出部门", "abIssueDept", "input", 17),
            ],
        },
        {
            title: "原因分析与措施",
            fields: [
                docField("根本原因分析", "abRootCause", "textarea", 18, {fullRow: true}),
                docField("分析人", "abAnalyst", "input", 19),
                docField("QE确认", "abQeConfirm", "input", 20),
                docField("责任判定", "abDutyJudge", "input", 21),
                docField("工程经理", "abEngManager", "input", 22),
                docField("临时措施", "abTempAction", "textarea", 23, {fullRow: true}),
                docField("制订人", "abTempActionMaker", "input", 24),
                docField("指定时间", "abSpecifyTime", "date", 25),
            ],
        },
        {
            title: "排查范围",
            fields: [
                docField("1.原材料", "abCheckMaterial", "input", 26),
                docField("2.在制半成品", "abCheckWip", "input", 27),
                docField("3.成品库存", "abCheckFinished", "input", 28),
                docField("4.已出货品", "abCheckShipped", "input", 29),
                docField("排查人员", "abChecker", "input", 30),
            ],
        },
        {
            title: "长期措施",
            fields: [
                docField("长期预防措施", "abLongAction", "textarea", 31, {fullRow: true}),
                docField("制定人", "abLongActionMaker", "input", 32),
                docField("制定时间", "abLongActionTime", "date", 33),
                docField("标准化", "abStandardization", "textarea", 34, {fullRow: true}),
                docField("部门经理", "abDeptManager", "input", 35),
            ],
        },
        {
            title: "跟踪验证",
            fields: [
                docField("跟踪时段", "abTrackPeriod", "input", 36),
                docField("投入数", "abTrackInputQty", "number", 37),
                docField("不良数", "abTrackDefectQty", "number", 38),
                docField("不良率", "abTrackDefectRate", "input", 39),
                docField("判定", "abJudge", "input", 40),
                docField("确认时间", "abConfirmTime", "datetime", 41),
            ],
        },
        {
            title: "备注",
            fields: [
                docField("备注", "abRemark", "textarea", 42, {fullRow: true}),
            ],
        },
    ],
    detailTitle: "",
    detailColumns: [],
};

const stoplineModel: DocumentModel = {
    key: "stopline",
    title: "停线整改通知单",
    headerGroups: [
        {
            title: "通知信息",
            fields: [
                docField("编号", "slNo", "input", 1),
                docField("TO", "slTo", "input", 2),
                docField("CC", "slCc", "input", 3),
                docField("机型", "slModel", "input", 4),
                docField("工单号", "slWorkOrder", "input", 5),
                docField("批量", "slBatchQty", "number", 6),
                docField("发生时间", "slOccurTime", "datetime", 7),
                docField("投入数", "slInputQty", "number", 8),
                docField("不良数", "slDefectQty", "number", 9),
                docField("不良率", "slDefectRate", "input", 10),
                docField("班线", "slLine", "input", 11),
            ],
        },
        {
            title: "停线描述",
            fields: [
                docField("停线事实描述", "slStopDesc", "textarea", 12, {fullRow: true}),
            ],
        },
        {
            title: "审批",
            fields: [
                docField("批准", "slApprove", "input", 13),
                docField("批准时间", "slApproveTime", "datetime", 14),
                docField("QE确认", "slQeConfirm", "input", 15),
                docField("提出人", "slProposer", "input", 16),
                docField("提出时间", "slProposeTime", "datetime", 17),
                docField("提出部门", "slProposeDept", "input", 18),
            ],
        },
        {
            title: "原因与措施",
            fields: [
                docField("不良原因及临时措施实施情况", "slCauseActionDesc", "textarea", 19, {fullRow: true}),
                docField("工程确认", "slEngConfirm", "input", 20),
                docField("QE确认2", "slQeConfirm2", "input", 21),
            ],
        },
        {
            title: "会签",
            fields: [
                docField("资材部签名", "slMaterialSign", "input", 22),
                docField("资材部时间", "slMaterialTime", "datetime", 23),
                docField("质量管理中心签名", "slQualitySign", "input", 24),
                docField("质量管理时间", "slQualityTime", "datetime", 25),
                docField("生产总监签名", "slDirectorSign", "input", 26),
                docField("生产总监时间", "slDirectorTime", "datetime", 27),
                docField("客户意见", "slCustomerOpinion", "input", 28),
                docField("客户时间", "slCustomerTime", "datetime", 29),
            ],
        },
        {
            title: "整改确认",
            fields: [
                docField("整改措施及效果确认", "slRectifyConfirm", "textarea", 30, {fullRow: true}),
                docField("生产总监批准", "slDirectorApprove", "input", 31),
                docField("批准时间", "slApproveTime2", "datetime", 32),
                docField("品质主管审核", "slQualityAudit", "input", 33),
                docField("审核时间", "slAuditTime", "datetime", 34),
                docField("QE作成", "slQeCreator", "input", 35),
                docField("作成时间", "slCreateTime", "datetime", 36),
            ],
        },
    ],
    detailTitle: "",
    detailColumns: [],
};

const reworkModel: DocumentModel = {
    key: "rework",
    title: "返工通知书",
    headerGroups: [
        {
            title: "基本信息",
            fields: [
                docField("类别", "rwCategory", "select", 1, {
                    values: [
                        {name: "返工", value: "rework"},
                        {name: "重检", value: "reinspect"},
                        {name: "特采", value: "special"},
                        {name: "其他", value: "other"},
                    ],
                }),
                docField("编号", "rwNo", "input", 2),
                docField("机型", "rwModel", "input", 3),
                docField("线别", "rwLine", "input", 4),
                docField("LOT NO.", "rwLotNo", "input", 5),
                docField("数量", "rwQty", "number", 6),
                docField("物料编码", "rwMaterialCode", "input", 7),
                docField("抽样数", "rwSampleQty", "number", 8),
                docField("不良数", "rwDefectQty", "number", 9),
                docField("不良率", "rwDefectRate", "input", 10),
            ],
        },
        {
            title: "不良内容",
            fields: [
                docField("不良内容", "rwDefectContent", "textarea", 11, {fullRow: true}),
                docField("开出人", "rwIssuer", "input", 12),
                docField("审核", "rwAudit", "input", 13),
                docField("批准", "rwApprove", "input", 14),
            ],
        },
        {
            title: "原因与对策",
            fields: [
                docField("发生原因", "rwCause", "textarea", 15, {fullRow: true}),
                docField("临时对策", "rwTempAction", "textarea", 16, {fullRow: true}),
                docField("确认", "rwConfirm", "input", 17),
                docField("作成", "rwCreator", "input", 18),
            ],
        },
        {
            title: "处置流程",
            fields: [
                docField("返工/处置流程及注意事项", "rwProcessDesc", "textarea", 19, {fullRow: true}),
                docField("工程审批", "rwEngApprove", "input", 20),
                docField("品质确认", "rwQualityConfirm", "input", 21),
                docField("作成2", "rwCreator2", "input", 22),
                docField("处置时间", "rwHandleTime", "date", 23),
                docField("处置部门", "rwHandleDept", "input", 24),
            ],
        },
    ],
    detailTitle: "返工产品明细",
    detailColumns: [
        docField("序号", "detailNo", "number", 1, {minWidth: 60}),
        docField("项目", "rwItem", "input", 2, {minWidth: 140}),
        docField("返工数量", "rwReworkQty", "number", 3, {minWidth: 90}),
        docField("处置方式", "rwHandleType", "select", 4, {
            minWidth: 100,
            values: [
                {name: "修理", value: "repair"},
                {name: "换件", value: "replace"},
                {name: "报废", value: "scrap"},
                {name: "清洗", value: "clean"},
            ],
        }),
        docField("确认人", "rwConfirmer", "input", 5, {minWidth: 90}),
        docField("检验日期", "rwInspectDate", "date", 6, {minWidth: 120}),
        docField("检验结果", "rwInspectResult", "select", 7, {
            minWidth: 80,
            values: [
                {name: "OK", value: "ok"},
                {name: "NG", value: "ng"},
                {name: "NA", value: "na"},
            ],
        }),
    ],
};

/**
 * 组装一张单据表单:
 * descriptions 公共信息(主表) + table 明细列表(子表, subFormFlag:"Y")
 * 当 detailColumns 为空时,仅生成 descriptions 容器,不生成 table 容器与示例数据
 */
function buildDocumentForm(model: DocumentModel): InspectionFormDef {
    const detailSubTableName = `${model.key}Details`;
    const hasDetail = model.detailColumns.length > 0;
    const containers: Array<Record<string, any>> = [
        {
            fieldName: `${model.key}Header`,
            label: "公共信息",
            containerType: "descriptions",
            formVisible: true,
            containerFields: [
                {
                    subTablePrimaryKey: "doc_header",
                    subTableName: "qm_doc_header",
                    subFormFlag: "N",
                    title: "公共信息",
                    formVisible: true,
                    fieldList: model.headerGroups.flatMap((group) => group.fields),
                    preps: {},
                },
            ],
            preps: {
                dataIndex: 1,
                direction: "vertical",
                column: 3,
                border: true,
                descItemLabelWidth: "110px",
            },
        },
    ];
    if (hasDetail) {
        containers.push({
            fieldName: `${model.key}DetailTable`,
            label: model.detailTitle,
            containerType: "table",
            formVisible: true,
            containerFields: [
                {
                    subTablePrimaryKey: detailSubTableName,
                    subTableName: detailSubTableName,
                    subFormFlag: "Y",
                    title: model.detailTitle,
                    formVisible: true,
                    fieldList: model.detailColumns,
                    preps: {},
                },
            ],
            preps: {dataIndex: 20},
        });
    }
    const form: InspectionFormDef = {
        key: model.key,
        title: model.title,
        kind: "rowEdit",
        matrixFieldName: "",
        fieldList: {fieldList: containers},
        dataForm: {},
    };
    if (hasDetail) {
        form.dataForm = {
            [detailSubTableName]: [
                model.detailColumns.reduce((row: Record<string, any>, column: any) => {
                    row[column.fieldName] = "";
                    return row;
                }, {detailNo: 1}),
            ],
        };
    }
    return form;
}

export const abnormalFeedbackForm = buildDocumentForm(abnormalModel);
export const stoplineNoticeForm = buildDocumentForm(stoplineModel);
export const reworkNoticeForm = buildDocumentForm(reworkModel);

export const documentForms: InspectionFormDef[] = [
    abnormalFeedbackForm,
    stoplineNoticeForm,
    reworkNoticeForm,
];

export type {PageFieldInfo};