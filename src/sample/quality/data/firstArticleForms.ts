import type {CheckTemplateGroup} from "./inspectionCommon";
import {buildCheckMatrixElements} from "./inspectionCommon";
import type {InspectionFormDef} from "./inspectionForms";


const smtFirstGroups: CheckTemplateGroup[] = [
    {
        title: "贴片段首件确认",
        items: [
            {content: "根据生产计划核对机型配置信息（生产/工程/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "PCB检查（PCB外观、丝印、版本等）（生产/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "物料核对（物料编码、描述、规格与BOM是否一致及阻容件相关参数等）（生产/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "贴片程序及版本核对（工程/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "极性方向确认，注意结构件位置和方向（生产/工程/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "印刷参数确认（需记载数据由工程/品质填写）", freq: "首件", mergeRule: "onceAll"},
            {content: "锡膏厚度测试（需记数据由品质填写）", freq: "首件", mergeRule: "onceAll"},
            {content: "贴片程序及版本核对（工程/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "物料核对（物料编码、描述、规格与BOM是否一致及阻容件相关参数等）（生产/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "极性方向确认，注意结构件位置和方向（生产/工程/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "参照样板确认（品质/工程确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "炉前X-Ray/AOI检查（工程确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "回流曲线测试（需记录回流程序，工程确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "炉后X-Ray/AOI检查（生产/工程/品质）", freq: "首件", mergeRule: "onceAll"},
            {content: "USB和耳机的插孔底部锡凸出高度≤0.4mm（品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "分板尺寸和外观检查（生产/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "条码贴纸/镭雕SN确认（品质确认）", freq: "首件", mergeRule: "onceAll"},
        ],
    },
    {
        title: "测试段首件确认",
        items: [
            {content: "下载（烧录）测试软件版本确认（工程/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "开检测试脚本及工具（工程/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "校准测试配置文件、脚本及工具（工程/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "综测测试脚本（工程/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "传导测试脚本（工程/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "功能测试脚本（工程/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "暗电流测试脚本（工程/品质确认）", freq: "首件", mergeRule: "onceAll"},
            {content: "外观检查：检查弹片、屏蔽盖、BTB、LED、光感、SIM卡盖子是否有焊接不良，BTB、LED、光感等目视无法看清焊接情况的器件需要CCD检验；板边小料是否有损伤", freq: "首件", mergeRule: "onceAll"},
        ],
    },
];

const dipFirstGroups: CheckTemplateGroup[] = [
    {
        title: "事前资料确认",
        items: [
            {content: "生产通知单", freq: "首件", mergeRule: "onceAll"},
            {content: "转线通知单", freq: "首件", mergeRule: "onceAll"},
            {content: "是否有ECN", freq: "首件", mergeRule: "onceAll"},
            {content: "SOP生产作业指导书准备", freq: "首件", mergeRule: "onceAll"},
        ],
    },
    {
        title: "通用生产条件",
        items: [
            {content: "工程更改（ECN/PCN）- 更改点是否有效执行（更改事项记入确认记录）", freq: "首件", mergeRule: "onceAll"},
        ],
    },
    {
        title: "生产作业指导书及版本",
        items: [
            {content: "为最新有效版本且当前操作员有上岗证（版本记入确认记录）", freq: "首件", mergeRule: "onceAll"},
        ],
    },
    {
        title: "辅料",
        items: [
            {content: "辅料加工 - 辅料加工是否有SOP或工艺现场指导作业，加工元件是否符合SOP要求（加工物料记入确认记录）", freq: "首件", mergeRule: "onceAll"},
        ],
    },
    {
        title: "插件",
        items: [
            {content: "波峰焊治具（装板治具）- 使用的治具编号与工艺要求一致（治具编码记入确认记录）", freq: "首件", mergeRule: "onceAll"},
            {content: "插件物料 - 各工序所用的物料与作业指导书及BOM描述一致", freq: "首件", mergeRule: "onceAll"},
            {content: "插件外观 - 位置、方向、与SOP、图纸规定一致", freq: "首件", mergeRule: "onceAll"},
            {content: "按压治具 - 按压治具是否与物料贴合且重合（无偏移，定位柱未按压到位）", freq: "首件", mergeRule: "onceAll"},
        ],
    },
    {
        title: "波峰焊接",
        items: [
            {content: "波峰焊接参数设定值 - 各温区温度设定与炉温曲线一致", freq: "首件", mergeRule: "onceAll"},
            {content: "链速设定参数与炉温曲线一致（链速记入确认记录）", freq: "首件", mergeRule: "onceAll"},
            {content: "锡缸设定参数与炉温曲线一致（温度记入确认记录）", freq: "首件", mergeRule: "onceAll"},
            {content: "波峰焊接首件 - 焊点饱满，焊接高度满足作业指导书要求", freq: "首件", mergeRule: "onceAll"},
            {content: "剪脚首件外观 - 与作业指导书文件规定一致", freq: "首件", mergeRule: "onceAll"},
            {content: "波峰焊助焊剂 - 与作业指导书文件规定一致", freq: "首件", mergeRule: "onceAll"},
            {content: "锡条 - 与作业指导书文件规定一致", freq: "首件", mergeRule: "onceAll"},
            {content: "执锡 - 烙铁温度 - 与作业指导书文件规定一致（烙铁工位1温度记入确认记录）", freq: "首件", mergeRule: "onceAll"},
        ],
    },
    {
        title: "手工清洗",
        items: [
            {content: "清洗防护 - 作业指导书中要求防护的位置均被防护", freq: "首件", mergeRule: "onceAll"},
            {content: "清洗治具 - 治具编码与生产工艺要求一致治具有效性确认", freq: "首件", mergeRule: "onceAll"},
            {content: "清洗首件外观 - 无发白，无可见残留物", freq: "首件", mergeRule: "onceAll"},
        ],
    },
    {
        title: "测试",
        items: [
            {content: "测试软件 - 与生产通知单软件版本一致，测试工具（软件版本记入确认记录）", freq: "首件", mergeRule: "onceAll"},
        ],
    },
    {
        title: "目检",
        items: [
            {content: "外观检查 - 检查元件是否有连锡、空洞、包锡、浮高等不良", freq: "首件", mergeRule: "onceAll"},
        ],
    },
];

const testGlueFirstGroups: CheckTemplateGroup[] = [
    {
        title: "检验及分析内容",
        items: [
            {content: "产线有对应SOP受控悬挂（生产/品质）", freq: "首件", mergeRule: "onceAll"},
            {content: "按SOP确认胶水型号，胶水储存及使用方法符合《胶水管理规范》要求，胶水回温和使用寿命管控（生产/品质）", freq: "首件", mergeRule: "onceAll"},
            {content: "转机型点胶必须有转线通知单，并按要求检查点胶程序及点胶治具确认（生产/工程/品质）", freq: "首件", mergeRule: "onceAll"},
            {content: "确认点胶设备的参数，点胶路径及位号（生产/工程/品质）", freq: "首件", mergeRule: "onceAll"},
            {content: "针对首件板需要记录SN（品质）", freq: "首件", mergeRule: "onceAll"},
            {content: "依据机型SOP对点胶效果进行质量管控(称重、外观检查)并做好记录，签字确认（生产/工程/品质）", freq: "首件", mergeRule: "onceAll"},
            {content: "检查底部填充胶完全渗入芯片内，完全固化（生产/工程/品质）", freq: "首件", mergeRule: "onceAll"},
            {content: "保证导热凝胶的填充量在扣合屏蔽盖后能够达到需求（芯片）面积的80%左右（生产/工程/品质）", freq: "首件", mergeRule: "onceAll"},
            {content: "点胶完成检查点胶路径必须完整，不允许有拉丝，不能溢出规定区域（生产/工程/品质）", freq: "首件", mergeRule: "onceAll"},
            {content: "确认炉温程序参数与SOP一致（生产/工程/品质）", freq: "首件", mergeRule: "onceAll"},
            {content: "点胶后的产品必须静放5分钟以上再烘烤；回流炉及时间必须符合SOP（生产/工程/品质）", freq: "首件", mergeRule: "onceAll"},
            {content: "检查铜箔型号与BOM要求一致；贴完后无翘起，偏移、溢胶、破损等不良；针对异形铜箔，需同步确认贴装方向（生产/工程/品质）", freq: "首件", mergeRule: "onceAll"},
            {content: "检查周边物料不能有撞件不良（生产/品质）", freq: "首件", mergeRule: "onceAll"},
        ],
    },
];

/**
 * 首件类型/类别通用备选项(正常首件/转产首件/4M变更首件/批次重启首件)
 */
const firstArticleTypeOptions = [
    {name: "正常首件", value: "normal"},
    {name: "转产首件", value: "changeover"},
    {name: "4M变更首件", value: "change4m"},
    {name: "批次重启首件", value: "restart"},
];

/**
 * SMT 首件确认表头部字段(线别/日期班别/工单/产品/软件版本/BOM/批量/PCB版本/类别/首件类型)
 */
function buildSmtFirstHeaderFields(prefix: string): Array<Record<string, any>> {
    return [
        {label: "线别", fieldName: `${prefix}Line`, type: "input", required: true, formVisible: true, preps: {dataIndex: 1}},
        {label: "日期/班别", fieldName: `${prefix}DateShift`, type: "input", required: true, formVisible: true, preps: {dataIndex: 2}},
        {label: "生产工单号", fieldName: `${prefix}WorkOrder`, type: "input", required: true, formVisible: true, preps: {dataIndex: 3}},
        {label: "产品名称", fieldName: `${prefix}Product`, type: "input", required: true, formVisible: true, preps: {dataIndex: 4}},
        {label: "软件版本", fieldName: `${prefix}SoftVersion`, type: "input", formVisible: true, preps: {dataIndex: 5}},
        {label: "BOM", fieldName: `${prefix}Bom`, type: "input", formVisible: true, preps: {dataIndex: 6}},
        {label: "批量/样本数", fieldName: `${prefix}BatchQty`, type: "number", formVisible: true, preps: {dataIndex: 7}},
        {label: "PCB版本/周期", fieldName: `${prefix}PcbVersion`, type: "input", formVisible: true, preps: {dataIndex: 8}},
        {label: "类别", fieldName: `${prefix}Category`, type: "select", formVisible: true, preps: {dataIndex: 9, values: firstArticleTypeOptions}},
        {label: "首件类型", fieldName: `${prefix}FirstType`, type: "select", formVisible: true, preps: {dataIndex: 10, values: firstArticleTypeOptions}},
    ];
}

/**
 * DIP 首件确认表头部字段(线别/日期班别/工单/产品/BOM/首检类别)
 */
function buildDipFirstHeaderFields(prefix: string): Array<Record<string, any>> {
    return [
        {label: "线别", fieldName: `${prefix}Line`, type: "input", required: true, formVisible: true, preps: {dataIndex: 1}},
        {label: "日期/班别", fieldName: `${prefix}DateShift`, type: "input", required: true, formVisible: true, preps: {dataIndex: 2}},
        {label: "生产工单号", fieldName: `${prefix}WorkOrder`, type: "input", required: true, formVisible: true, preps: {dataIndex: 3}},
        {label: "产品名称", fieldName: `${prefix}Product`, type: "input", required: true, formVisible: true, preps: {dataIndex: 4}},
        {label: "BOM", fieldName: `${prefix}Bom`, type: "input", formVisible: true, preps: {dataIndex: 5}},
        {label: "首检类别", fieldName: `${prefix}FirstType`, type: "select", formVisible: true, preps: {dataIndex: 6, values: firstArticleTypeOptions}},
    ];
}

/**
 * TEST 点胶首件确认表头部字段(线别/日期/工单/产品/班别/点胶设备编号/批量/胶水品牌型号/首检类型)
 */
function buildTestGlueFirstHeaderFields(prefix: string): Array<Record<string, any>> {
    return [
        {label: "线别", fieldName: `${prefix}Line`, type: "input", required: true, formVisible: true, preps: {dataIndex: 1}},
        {label: "日期", fieldName: `${prefix}Date`, type: "date", required: true, formVisible: true, preps: {dataIndex: 2}},
        {label: "生产工单号", fieldName: `${prefix}WorkOrder`, type: "input", required: true, formVisible: true, preps: {dataIndex: 3}},
        {label: "产品名称", fieldName: `${prefix}Product`, type: "input", required: true, formVisible: true, preps: {dataIndex: 4}},
        {label: "班别", fieldName: `${prefix}Shift`, type: "input", formVisible: true, preps: {dataIndex: 5}},
        {label: "点胶设备编号", fieldName: `${prefix}GlueEquipNo`, type: "input", formVisible: true, preps: {dataIndex: 6}},
        {label: "批量/样本数", fieldName: `${prefix}BatchQty`, type: "number", formVisible: true, preps: {dataIndex: 7}},
        {label: "胶水品牌/型号", fieldName: `${prefix}GlueModel`, type: "input", formVisible: true, preps: {dataIndex: 8}},
        {label: "首检类型", fieldName: `${prefix}FirstType`, type: "select", formVisible: true, preps: {dataIndex: 9, values: firstArticleTypeOptions}},
    ];
}

/**
 * 首件确认表按 key 注入差异化配置(头部字段构建器),
 * 避免在组装函数内用分支硬编码,保持 buildFirstArticleForm 签名不变。
 */
const firstArticleConfigs: Record<string, {
    buildHeaderFields: (prefix: string) => Array<Record<string, any>>;
}> = {
    smtFirst: {buildHeaderFields: buildSmtFirstHeaderFields},
    dipFirst: {buildHeaderFields: buildDipFirstHeaderFields},
    testGlueFirst: {buildHeaderFields: buildTestGlueFirstHeaderFields},
};

/**
 * 组装一张首件确认表模型: descriptions 头部 + checkmatrix 字段(rowEdit 行式点检)
 */
function buildFirstArticleForm(
    key: string,
    title: string,
    groups: CheckTemplateGroup[],
): InspectionFormDef {
    const matrixFieldName = `${key}CheckMatrix`;
    const config = firstArticleConfigs[key];
    const headerFields = config.buildHeaderFields(key);
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
                            fieldList: headerFields,
                            preps: {},
                        },
                    ],
                    preps: {
                        dataIndex: 1,
                        direction: "vertical",
                        column: 3,
                        border: true,
                        descItemLabelWidth: "100px",
                    },
                },
                {
                    label: "首件确认项目",
                    fieldName: `checkmatrix_${key}`,
                    containerType: "checkmatrix",
                    formVisible: true,
                    containerFields: [
                        {
                            fieldList: buildCheckMatrixElements(
                                groups,
                                "rowEdit",
                                `checkmatrix_${key}`,
                            ),
                        },
                    ],
                    preps: {
                        dataIndex: 10,
                        hideLabel: true,
                        appLabelVisible: true,
                        matrixTitle: `${title} · 确认项目`,
                        columnModel: "rowEdit",
                        showLineNumber: true,
                        showHeader: false,
                        showRemark: true,
                    },
                },
                {
                    label: "确认说明",
                    fieldName: `${key}FirstNote`,
                    type: "html",
                    formVisible: true,
                    listVisible: false,
                    preps: {
                        dataIndex: 30,
                        staticData: true,
                        textContent:
                            `<div style="border:1px solid #e3e6eb;border-radius:4px;padding:12px 14px;background:#fff;margin-top:8px;">`
                            + `<div style="font-weight:600;font-size:13px;color:#1f2329;margin-bottom:6px;">确认说明</div>`
                            + `<div style="font-size:12px;color:#57606a;line-height:1.8;">首件确认:检查项逐行确认,填写时间/数据记录/异常对策与确认人,判定选 OK/NG/NA;确认无误后由线长/品质签字。</div>`
                            + `</div>`,
                    },
                },
            ],
        },
        dataForm: {

            [`${key}Details`]: [],
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