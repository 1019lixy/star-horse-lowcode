/**
 * ETL 常量与预设（i18n 化）
 */
import {i18n} from "@/lang";
import type {EtlNode, EtlNodeTypePreset, EtlPipeline} from "./types";

/** 节点类型预设表 */
export const ETL_NODE_PRESETS: EtlNodeTypePreset[] = [
    // 数据源
    {
        type: "source.database",
        category: "source",
        label: i18n("etl.node.source.database"),
        icon: "Coin",
        color: "#409EFF",
        description: i18n("etl.nodeDesc.source.database"),
        defaultConfig: {connection: "", sql: ""},
        inputs: 0,
        outputs: 1
    },
    {
        type: "source.api",
        category: "source",
        label: i18n("etl.node.source.api"),
        icon: "Link",
        color: "#409EFF",
        description: i18n("etl.nodeDesc.source.api"),
        defaultConfig: {url: "", method: "GET", headers: {}},
        inputs: 0,
        outputs: 1
    },
    {
        type: "source.file",
        category: "source",
        label: i18n("etl.node.source.file"),
        icon: "Document",
        color: "#409EFF",
        description: i18n("etl.nodeDesc.source.file"),
        defaultConfig: {path: "", format: "json"},
        inputs: 0,
        outputs: 1
    },
    {
        type: "source.json",
        category: "source",
        label: i18n("etl.node.source.json"),
        icon: "Files",
        color: "#409EFF",
        description: i18n("etl.nodeDesc.source.json"),
        defaultConfig: {data: "[]"},
        inputs: 0,
        outputs: 1
    },
    {
        type: "source.csv",
        category: "source",
        label: i18n("etl.node.source.csv"),
        icon: "Tickets",
        color: "#409EFF",
        description: i18n("etl.nodeDesc.source.csv"),
        defaultConfig: {content: "", delimiter: ","},
        inputs: 0,
        outputs: 1
    },
    // 转换
    {
        type: "transform.filter",
        category: "transform",
        label: i18n("etl.node.transform.filter"),
        icon: "Filter",
        color: "#E6A23C",
        description: i18n("etl.nodeDesc.transform.filter"),
        defaultConfig: {condition: ""},
        inputs: 1,
        outputs: 1
    },
    {
        type: "transform.map",
        category: "transform",
        label: i18n("etl.node.transform.map"),
        icon: "Operation",
        color: "#E6A23C",
        description: i18n("etl.nodeDesc.transform.map"),
        defaultConfig: {mappings: []},
        inputs: 1,
        outputs: 1
    },
    {
        type: "transform.join",
        category: "transform",
        label: i18n("etl.node.transform.join"),
        icon: "Connection",
        color: "#E6A23C",
        description: i18n("etl.nodeDesc.transform.join"),
        defaultConfig: {joinType: "inner", leftKey: "", rightKey: ""},
        inputs: 2,
        outputs: 1
    },
    {
        type: "transform.aggregate",
        category: "transform",
        label: i18n("etl.node.transform.aggregate"),
        icon: "DataAnalysis",
        color: "#E6A23C",
        description: i18n("etl.nodeDesc.transform.aggregate"),
        defaultConfig: {groupBy: [], aggregations: []},
        inputs: 1,
        outputs: 1
    },
    {
        type: "transform.sort",
        category: "transform",
        label: i18n("etl.node.transform.sort"),
        icon: "Sort",
        color: "#E6A23C",
        description: i18n("etl.nodeDesc.transform.sort"),
        defaultConfig: {sortFields: []},
        inputs: 1,
        outputs: 1
    },
    {
        type: "transform.deduplicate",
        category: "transform",
        label: i18n("etl.node.transform.deduplicate"),
        icon: "CopyDocument",
        color: "#E6A23C",
        description: i18n("etl.nodeDesc.transform.deduplicate"),
        defaultConfig: {keys: []},
        inputs: 1,
        outputs: 1
    },
    {
        type: "transform.formula",
        category: "transform",
        label: i18n("etl.node.transform.formula"),
        icon: "MagicStick",
        color: "#E6A23C",
        description: i18n("etl.nodeDesc.transform.formula"),
        defaultConfig: {field: "", formula: ""},
        inputs: 1,
        outputs: 1
    },
    // 目标
    {
        type: "destination.database",
        category: "destination",
        label: i18n("etl.node.destination.database"),
        icon: "Coin",
        color: "#67C23A",
        description: i18n("etl.nodeDesc.destination.database"),
        defaultConfig: {connection: "", table: "", mode: "insert"},
        inputs: 1,
        outputs: 0
    },
    {
        type: "destination.api",
        category: "destination",
        label: i18n("etl.node.destination.api"),
        icon: "Link",
        color: "#67C23A",
        description: i18n("etl.nodeDesc.destination.api"),
        defaultConfig: {url: "", method: "POST"},
        inputs: 1,
        outputs: 0
    },
    {
        type: "destination.file",
        category: "destination",
        label: i18n("etl.node.destination.file"),
        icon: "Document",
        color: "#67C23A",
        description: i18n("etl.nodeDesc.destination.file"),
        defaultConfig: {path: "", format: "json"},
        inputs: 1,
        outputs: 0
    },
    {
        type: "destination.webhook",
        category: "destination",
        label: i18n("etl.node.destination.webhook"),
        icon: "Promotion",
        color: "#67C23A",
        description: i18n("etl.nodeDesc.destination.webhook"),
        defaultConfig: {url: ""},
        inputs: 1,
        outputs: 0
    },
    // 控制
    {
        type: "control.merge",
        category: "control",
        label: i18n("etl.node.control.merge"),
        icon: "Merge",
        color: "#909399",
        description: i18n("etl.nodeDesc.control.merge"),
        defaultConfig: {},
        inputs: -1,
        outputs: 1
    },
    {
        type: "control.branch",
        category: "control",
        label: i18n("etl.node.control.branch"),
        icon: "Share",
        color: "#909399",
        description: i18n("etl.nodeDesc.control.branch"),
        defaultConfig: {branches: []},
        inputs: 1,
        outputs: -1
    },
];

/** 按类型查找预设 */
export const findPreset = (type: string): EtlNodeTypePreset | undefined =>
    ETL_NODE_PRESETS.find((p) => p.type === type);

/** 按分类分组 */
export const ETL_NODE_GROUPS: { category: string; label: string; presets: EtlNodeTypePreset[] }[] = [
    {
        category: "source",
        label: i18n("etl.group.source"),
        presets: ETL_NODE_PRESETS.filter((p) => p.category === "source")
    },
    {
        category: "transform",
        label: i18n("etl.group.transform"),
        presets: ETL_NODE_PRESETS.filter((p) => p.category === "transform")
    },
    {
        category: "destination",
        label: i18n("etl.group.destination"),
        presets: ETL_NODE_PRESETS.filter((p) => p.category === "destination")
    },
    {
        category: "control",
        label: i18n("etl.group.control"),
        presets: ETL_NODE_PRESETS.filter((p) => p.category === "control")
    },
];

/** 节点尺寸 */
export const NODE_WIDTH = 140;
export const NODE_HEIGHT = 56;

/** 状态颜色 */
export const STATUS_COLORS: Record<string, string> = {
    idle: "#909399",
    running: "#409EFF",
    success: "#67C23A",
    error: "#F56C6C",
    skipped: "#E6A23C",
};

/** 创建节点 */
export const createEtlNode = (type: string, x = 100, y = 100): EtlNode => {
    const preset = findPreset(type);
    if (!preset) throw new Error(`Unknown node type: ${type}`);
    return {
        id: `node_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type: preset.type,
        category: preset.category,
        name: preset.label,
        x,
        y,
        config: JSON.parse(JSON.stringify(preset.defaultConfig)),
        status: "idle",
    };
};

/** 创建管道 */
export const createPipeline = (overrides: Partial<EtlPipeline> = {}): EtlPipeline => ({
    id: `pipe_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: i18n("etl.pipeline.new"),
    description: "",
    nodes: [],
    edges: [],
    schedule: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
});

/** 创建连线 */
export const createEdge = (source: string, target: string, sourcePort?: string, targetPort?: string) => ({
    id: `edge_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    source,
    target,
    sourcePort,
    targetPort,
    label: "",
});

/** 聚合函数预设 */
export const AGGREGATION_FUNCTIONS = [
    {value: "sum", label: i18n("etl.agg.sum")},
    {value: "avg", label: i18n("etl.agg.avg")},
    {value: "count", label: i18n("etl.agg.count")},
    {value: "min", label: i18n("etl.agg.min")},
    {value: "max", label: i18n("etl.agg.max")},
    {value: "first", label: i18n("etl.agg.first")},
    {value: "last", label: i18n("etl.agg.last")},
];

/** 关联类型预设 */
export const JOIN_TYPES = [
    {value: "inner", label: i18n("etl.join.inner")},
    {value: "left", label: i18n("etl.join.left")},
    {value: "right", label: i18n("etl.join.right")},
    {value: "full", label: i18n("etl.join.full")},
];

/** 排序方向预设 */
export const SORT_DIRECTIONS = [
    {value: "asc", label: i18n("etl.sort.asc")},
    {value: "desc", label: i18n("etl.sort.desc")},
];

/** 写入模式预设 */
export const WRITE_MODES = [
    {value: "insert", label: i18n("etl.writeMode.insert")},
    {value: "upsert", label: i18n("etl.writeMode.upsert")},
    {value: "overwrite", label: i18n("etl.writeMode.overwrite")},
];

/** 文件格式预设 */
export const FILE_FORMATS = [
    {value: "json", label: i18n("etl.format.json")},
    {value: "csv", label: i18n("etl.format.csv")},
    {value: "text", label: i18n("etl.format.text")},
];

/** HTTP 方法预设 */
export const HTTP_METHODS = [
    {value: "GET", label: i18n("etl.method.GET")},
    {value: "POST", label: i18n("etl.method.POST")},
    {value: "PUT", label: i18n("etl.method.PUT")},
    {value: "DELETE", label: i18n("etl.method.DELETE")},
];
