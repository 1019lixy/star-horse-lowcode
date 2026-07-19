import { Check, Delete, Download, FolderOpened, QuestionFilled } from "@element-plus/icons-vue";
import type { KgGraph, KgQueryTemplate } from "@/components/knowledgegraph";
import { createKgCondition, createKgStep } from "@/components/knowledgegraph";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * 示例图谱：马斯克商业关系网络
 *
 * 14 节点（3 人物 + 6 公司 + 2 项目 + 3 地点），18 边（创立/员工/投资/合作/地点/参与）
 */
export const SAMPLE_GRAPH: KgGraph = {
    id: "kg_demo",
    name: "马斯克商业关系网络",
    nodes: [
        { id: "p1", type: "person", label: "Elon Musk", x: 0, y: 0, properties: { age: 52, nationality: "美国", role: "CEO" } },
        { id: "p2", type: "person", label: "JB Straubel", x: 0, y: 0, properties: { age: 48, role: "CTO" } },
        { id: "p3", type: "person", label: "Gwynne Shotwell", x: 0, y: 0, properties: { age: 60, role: "COO" } },
        { id: "c1", type: "company", label: "Tesla", x: 0, y: 0, properties: { founded: 2003, industry: "汽车" } },
        { id: "c2", type: "company", label: "SpaceX", x: 0, y: 0, properties: { founded: 2002, industry: "航天" } },
        { id: "c3", type: "company", label: "SolarCity", x: 0, y: 0, properties: { founded: 2006, industry: "能源" } },
        { id: "c4", type: "company", label: "Neuralink", x: 0, y: 0, properties: { founded: 2016, industry: "脑机接口" } },
        { id: "c5", type: "company", label: "The Boring Company", x: 0, y: 0, properties: { founded: 2016, industry: "隧道" } },
        { id: "c6", type: "company", label: "Twitter/X", x: 0, y: 0, properties: { founded: 2006, industry: "社交" } },
        { id: "pr1", type: "project", label: "Starship", x: 0, y: 0, properties: { status: "研发中" } },
        { id: "pr2", type: "project", label: "Falcon 9", x: 0, y: 0, properties: { status: "运营中" } },
        { id: "l1", type: "location", label: "Palo Alto", x: 0, y: 0, properties: { country: "美国", state: "CA" } },
        { id: "l2", type: "location", label: "Hawthorne", x: 0, y: 0, properties: { country: "美国", state: "CA" } },
        { id: "l3", type: "location", label: "Boca Chica", x: 0, y: 0, properties: { country: "美国", state: "TX" } },
    ],
    edges: [
        { id: "e1", source: "p1", target: "c1", type: "founder", label: "创立" },
        { id: "e2", source: "p1", target: "c2", type: "founder", label: "创立" },
        { id: "e3", source: "p1", target: "c3", type: "founder", label: "创立" },
        { id: "e4", source: "p1", target: "c4", type: "founder", label: "创立" },
        { id: "e5", source: "p1", target: "c5", type: "founder", label: "创立" },
        { id: "e6", source: "p1", target: "c1", type: "employee", label: "CEO" },
        { id: "e7", source: "p1", target: "c2", type: "employee", label: "CEO" },
        { id: "e8", source: "p2", target: "c1", type: "employee", label: "前CTO" },
        { id: "e9", source: "p3", target: "c2", type: "employee", label: "COO" },
        { id: "e10", source: "c1", target: "c3", type: "investor", label: "投资" },
        { id: "e11", source: "p1", target: "c6", type: "investor", label: "收购" },
        { id: "e12", source: "c1", target: "c3", type: "partner", label: "合作" },
        { id: "e13", source: "c2", target: "c4", type: "partner", label: "技术合作" },
        { id: "e14", source: "c1", target: "l1", type: "location", label: "总部" },
        { id: "e15", source: "c2", target: "l2", type: "location", label: "总部" },
        { id: "e16", source: "pr1", target: "l3", type: "location", label: "研发基地" },
        { id: "e17", source: "c2", target: "pr1", type: "participant", label: "开发" },
        { id: "e18", source: "c2", target: "pr2", type: "participant", label: "开发" },
    ],
};

/**
 * 创建示例查询模板
 *
 * 用函数：createKgCondition/createKgStep 每次返回新对象
 */
export function createSampleTemplates(): KgQueryTemplate[] {
    return [
        {
            id: "tpl_demo_1",
            name: "查找特斯拉相关人员",
            createdAt: Date.now(),
            query: {
                startNodeType: "company",
                startConditions: [
                    createKgCondition("label", "contains", "Tesla"),
                ],
                steps: [
                    {
                        ...createKgStep("person", "in", "employee"),
                        id: "step_demo_1",
                        conditions: [],
                    },
                ],
            },
        },
    ];
}

/** 空图谱 */
export const EMPTY_GRAPH: KgGraph = { id: "kg_empty", name: "空图谱", nodes: [], edges: [] };

/**
 * KnowledgeGraphDemo 主操作（左侧）
 */
export const KG_ACTIONS: ShDemoAction[] = [
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.kg.toolbar.loadSample", group: "data" },
    { key: "clear", icon: Delete, labelKey: "advanced.kg.toolbar.clear", type: "danger", group: "data" },
    { key: "exportJson", icon: Download, tooltipKey: "advanced.kg.toolbar.exportJson", iconOnly: true, group: "data" },
    { key: "save", icon: Check, labelKey: "advanced.kg.toolbar.save", type: "primary" },
];

/**
 * KnowledgeGraphDemo 次要操作（右侧）
 */
export const KG_SECONDARY: ShDemoAction[] = [
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.kg.toolbar.help", iconOnly: true },
];
