import type {PageFieldInfo} from "@/components/types";
import type {CheckTemplateGroup} from "./inspectionCommon";
import {
    buildCheckGroups,
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
                        direction: "horizontal",
                        column: 3,
                        border: true,
                        descItemLabelWidth: "90px",
                    },
                },
                {
                    label: "稽核结果",
                    fieldName: matrixFieldName,
                    type: "checkmatrix",
                    formVisible: true,
                    preps: {
                        hideLabel: true,
                        appLabelVisible: true,
                        matrixTitle: `${title} · 稽核结果`,
                        columnModel: "triState",
                        timeSlots: ipqcTimeSlots,
                        checkGroups: buildCheckGroups(groups),
                        showRemark: true,
                        allowKeyboard: true,
                        fillColumnOnHeaderClick: true,
                        fillRowOnIndexClick: true,
                        noteText: defectNoteText,
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
                    preps: {},
                },
            ],
        },
        dataForm: {
            [matrixFieldName]: {rows: {}},
            [`${key}Issues`]: [],
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