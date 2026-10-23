import type {PageFieldInfo} from "@/components/types";
import type {CheckTemplateGroup} from "./inspectionCommon";
import {
    buildCheckMatrixElements,
    buildInspectionHeaderFields,
    buildIssueTableFields,
    defectNoteText,
    ipqcTimeSlots,
} from "./inspectionCommon";
import {dipCheckGroups} from "./dipCheckTemplate";
import {smtCheckGroups} from "./smtCheckTemplate";
import {testCheckGroups} from "./testCheckTemplate";

export interface InspectionFormDef {
    key: string;
    title: string;
    kind: "matrix" | "rowEdit";
    /** checkmatrix 字段名(值/统计/校验均以它为入口) */
    matrixFieldName: string;
    fieldList: PageFieldInfo;
    dataForm: Record<string, any>;
}

/**
 * 组装一张 IPQC 巡查表模型:
 * descriptions 头部 + checkmatrix 字段(组数据配置于 preps.checkGroups) + table 问题子表
 */
export function buildInspectionForm(
    key: string,
    title: string,
    groups: CheckTemplateGroup[],
): InspectionFormDef {
    const headerFields = buildInspectionHeaderFields(key);
    const issueFields = buildIssueTableFields(key);
    const matrixFieldName = `${key}CheckMatrix`;
    return {
        key,
        title,
        kind: "matrix",
        matrixFieldName,
        fieldList: {
            fieldList: [
                {
                    fieldName: `${key}Header`,
                    label: "基础信息",
                    containerType: "descriptions",
                    formVisible: true,
                    containerFields: [
                        {
                            subTablePrimaryKey: "header",
                            subTableName: "qm_inspection_header",
                            subFormFlag: "N",
                            title: "基础信息",
                            formVisible: true,
                            fieldList: headerFields,
                            preps: {},
                        },
                    ],
                    preps: {
                        dataIndex: 1,
                        direction: "vertical",
                        column: 3,
                        border: true,
                        descItemLabelWidth: "90px",
                    },
                },
                {
                    label: "稽核结果",
                    fieldName: `checkmatrix_${key}`,
                    containerType: "checkmatrix",
                    formVisible: true,
                    containerFields: [
                        {
                            fieldList: buildCheckMatrixElements(
                                groups,
                                "triState",
                                `checkmatrix_${key}`,
                                ipqcTimeSlots,
                            ),
                        },
                    ],
                    preps: {
                        dataIndex: 10,
                        hideLabel: true,
                        appLabelVisible: true,
                        matrixTitle: `${title} · 稽核结果`,
                        columnModel: "triState",
                        showRemark: true,
                        allowKeyboard: true,
                        showLineNumber: true,
                        showHeader: false,
                        itemColumnWidth: 320,
                        slotColumnWidth: 84,
                        fillColumnOnHeaderClick: true,
                        fillRowOnIndexClick: true,
                    },
                },
                {
                    fieldName: `${key}IssueTable`,
                    label: "问题点 & 改善记录",
                    containerType: "table",
                    formVisible: true,
                    containerFields: [
                        {
                            subTablePrimaryKey: "issues",
                            subTableName: `${key}Issues`,
                            subFormFlag: "Y",
                            title: "问题点 & 改善记录",
                            formVisible: true,
                            fieldList: issueFields,
                            preps: {},
                        },
                    ],
                    preps: {dataIndex: 20},
                },
                {
                    label: "缺点定义",
                    fieldName: `${key}DefectNote`,
                    type: "html",
                    formVisible: true,
                    listVisible: false,
                    preps: {
                        dataIndex: 30,
                        staticData: true,
                        textContent:
                            `<div style="border:1px solid #e3e6eb;border-radius:4px;padding:12px 14px;background:#fff;margin-top:8px;width:100%;">`
                            + `<div style="font-weight:600;font-size:13px;color:#1f2329;margin-bottom:6px;">缺点定义</div>`
                            + `<div style="font-size:12px;color:#57606a;line-height:1.8;">${defectNoteText}</div>`
                            + `</div>`,
                    },
                },
            ],
        },
        dataForm: {

            [`${key}Issues`]: [
                {
                    [`${key}IssueNo`]: 1,
                    [`${key}ProblemPoint`]: "物料摆放标识缺失",
                    [`${key}ImproveAction`]: "重新张贴标识并班前宣导",
                    [`${key}RespUser`]: "张工",
                    [`${key}VerifyResult`]: "待验证",
                },
            ],
        },
    };
}

export const dipIpqcForm = buildInspectionForm(
    "dip",
    "DIP IPQC巡查表",
    dipCheckGroups,
);
export const smtIpqcForm = buildInspectionForm(
    "smt",
    "SMT IPQC巡查表",
    smtCheckGroups,
);
export const testIpqcForm = buildInspectionForm(
    "test",
    "TEST IPQC巡查表",
    testCheckGroups,
);

export const inspectionForms: InspectionFormDef[] = [
    dipIpqcForm,
    smtIpqcForm,
    testIpqcForm,
];
