/**
 * 巡查表/首件表 checkmatrix demo 共用模板类型与常量
 */
export interface CheckTemplateItem {
    content: string;
    freq: string;
    mergeRule: "twoPerShift" | "every2h" | "every4h" | "onceAll";
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
 * 检查项模板即 checkmatrix 组件 preps.checkGroups 配置:
 * 一组/两组/三组均由该数组长度决定,直接透传给字段 preps
 */
export function buildCheckGroups(
    groups: CheckTemplateGroup[],
): CheckTemplateGroup[] {
    return groups.map((group, gi) => ({
        title: group.title,
        items: group.items.map((item, ii) => ({
            ...item,
            id: `g${gi + 1}_i${ii + 1}`,
        })),
    }));
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