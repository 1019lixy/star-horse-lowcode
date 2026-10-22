import type {PageFieldInfo} from "@/components/types";
import type {InspectionFormDef} from "./inspectionForms";

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

const abnormalGroups: DocumentFieldGroup[] = [
    {
        title: "异常信息",
        fields: [
            docField("异常单号", "abNo", "input", 1),
            docField("发生日期", "abDate", "date", 2, {required: true}),
            docField("班别", "abShift", "select", 3, {
                values: [
                    {name: "白班", value: "day"},
                    {name: "夜班", value: "night"},
                ],
            }),
            docField("线别", "abLine", "input", 4, {required: true}),
            docField("生产工单", "abWorkOrder", "input", 5, {required: true}),
            docField("机型", "abModel", "input", 6),
            docField("物料料号", "abMaterial", "input", 7),
            docField("发生时间", "abTime", "datetime", 8),
            docField(
                "异常类别",
                "abCategory",
                "select",
                9,
                {
                    values: [
                        {name: "来料异常", value: "incoming"},
                        {name: "制程异常", value: "process"},
                        {name: "设备异常", value: "equipment"},
                        {name: "设计异常", value: "design"},
                        {name: "其他", value: "other"},
                    ],
                },
            ),
            docField("异常等级", "abLevel", "select", 10, {
                required: true,
                values: [
                    {name: "一般", value: "minor"},
                    {name: "主要", value: "major"},
                    {name: "停线", value: "stop"},
                ],
            }),
        ],
    },
    {
        title: "异常描述与处理",
        fields: [
            docField("异常描述", "abDescription", "textarea", 11, {required: true}),
            docField("临时对策", "abTempAction", "textarea", 12),
            docField("处理结果", "abResult", "textarea", 13),
            docField("责任判定", "abDuty", "input", 14),
        ],
    },
    {
        title: "审批签核",
        fields: [
            docField("发起人", "abCreator", "input", 15),
            docField("生产部确认", "abProductConfirm", "input", 16),
            docField("工程部确认", "abEngineerConfirm", "input", 17),
            docField("质量部确认", "abQualityConfirm", "input", 18),
        ],
    },
];

const stoplineGroups: DocumentFieldGroup[] = [
    {
        title: "通知信息",
        fields: [
            docField("通知单号", "slNo", "input", 1),
            docField("通知日期", "slDate", "date", 2, {required: true}),
            docField("线别", "slLine", "input", 3, {required: true}),
            docField("停线时间", "slStopTime", "datetime", 4, {required: true}),
            docField("恢复时间", "slResumeTime", "datetime", 5),
            docField("责任人", "slOwner", "input", 6, {required: true}),
        ],
    },
    {
        title: "停线原因与整改",
        fields: [
            docField("停线原因", "slReason", "textarea", 7, {required: true}),
            docField("影响范围", "slImpact", "textarea", 8),
            docField("整改要求", "slAction", "textarea", 9, {required: true}),
            docField("验收标准", "slAccept", "textarea", 10),
        ],
    },
    {
        title: "审批签核",
        fields: [
            docField("发起人", "slCreator", "input", 11),
            docField("生产部签核", "slProductSign", "input", 12),
            docField("质量部签核", "slQualitySign", "input", 13),
        ],
    },
];

const reworkGroups: DocumentFieldGroup[] = [
    {
        title: "返工信息",
        fields: [
            docField("返工单号", "rwNo", "input", 1),
            docField("返工日期", "rwDate", "date", 2, {required: true}),
            docField("生产工单", "rwWorkOrder", "input", 3, {required: true}),
            docField("机型", "rwModel", "input", 4),
            docField("返工数量", "rwQty", "number", 5, {required: true}),
            docField(
                "返工类型",
                "rwType",
                "select",
                6,
                {
                    required: true,
                    values: [
                        {name: "外观返工", value: "appearance"},
                        {name: "功能返工", value: "function"},
                        {name: "焊接返工", value: "solder"},
                        {name: "清洗返工", value: "clean"},
                        {name: "重贴标签", value: "relabel"},
                    ],
                },
            ),
            docField("返工工序", "rwProcess", "input", 7, {required: true}),
            docField("发起人", "rwCreator", "input", 8),
        ],
    },
    {
        title: "返工原因与要求",
        fields: [
            docField("返工原因", "rwReason", "textarea", 9, {required: true}),
            docField("返工作业要求", "rwRequire", "textarea", 10),
            docField("质量确认要求", "rwQualityRequire", "textarea", 11),
        ],
    },
];

function buildDocumentForm(
    key: string,
    title: string,
    groups: DocumentFieldGroup[],
): InspectionFormDef {
    return {
        key,
        title,
        kind: "rowEdit",
        matrixFieldName: "",
        fieldList: {
            fieldList: [
                {
                    fieldName: `${key}Doc`,
                    label: title,
                    containerType: "descriptions",
                    formVisible: true,
                    containerFields: groups.map((group, gi) => ({
                        subTablePrimaryKey: `doc_${gi + 1}`,
                        subTableName: `qm_${key}_doc`,
                        subFormFlag: "N",
                        title: group.title,
                        formVisible: true,
                        fieldList: group.fields,
                        preps: {},
                    })),
                    preps: {
                        direction: "horizontal",
                        column: 2,
                        border: true,
                        descItemLabelWidth: "110px",
                    },
                },
            ],
        },
        dataForm: {},
    };
}

export const abnormalFeedbackForm = buildDocumentForm(
    "abnormal",
    "异常反馈单",
    abnormalGroups,
);
export const stoplineNoticeForm = buildDocumentForm(
    "stopline",
    "停线整改通知单",
    stoplineGroups,
);
export const reworkNoticeForm = buildDocumentForm(
    "rework",
    "返工通知书",
    reworkGroups,
);

export const documentForms: InspectionFormDef[] = [
    abnormalFeedbackForm,
    stoplineNoticeForm,
    reworkNoticeForm,
];

export type {PageFieldInfo};