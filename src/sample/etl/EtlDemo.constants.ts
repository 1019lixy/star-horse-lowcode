import {
    Check,
    Delete,
    Download,
    FolderOpened,
    VideoPlay,
    Select,
    Grid,
    QuestionFilled,
} from "@element-plus/icons-vue";
import { createEtlNode, createEdge } from "@/components/etl";
import type { EtlPipeline } from "@/components/etl";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * 构造示例 ETL 管道：数据库源 → 过滤 → 字段映射 → 数据库目标 + 统计 → CSV
 *
 * 每次调用返回全新对象，避免污染常量。
 */
export const createSampleEtlPipeline = (): Partial<EtlPipeline> => {
    const source = createEtlNode("source.database", 80, 120);
    source.name = "用户表";
    source.config.connection = "mysql://root:pass@localhost:3306/demo";
    source.config.sql = "SELECT id, name, age, status FROM users";

    const filter = createEtlNode("transform.filter", 320, 120);
    filter.name = "活跃用户";
    filter.config.condition = "status === 'active' && age >= 18";

    const map = createEtlNode("transform.map", 560, 120);
    map.name = "字段映射";
    map.config.mappings = [
        { source: "id", target: "userId", expression: "" },
        { source: "name", target: "userName", expression: "" },
        { source: "age", target: "userAge", expression: "" },
    ];

    const aggregate = createEtlNode("transform.aggregate", 320, 280);
    aggregate.name = "年龄段统计";
    aggregate.config.groupBy = ["userAge"];
    aggregate.config.aggregations = [
        { field: "userId", func: "count", alias: "userCount" },
    ];

    const dest = createEtlNode("destination.database", 800, 120);
    dest.name = "目标表";
    dest.config.connection = "mysql://root:pass@localhost:3306/analytics";
    dest.config.table = "active_users";
    dest.config.mode = "upsert";

    const dest2 = createEtlNode("destination.file", 560, 440);
    dest2.name = "导出 CSV";
    dest2.config.path = "/data/export/age_stats.csv";
    dest2.config.format = "csv";

    const nodes = [source, filter, map, aggregate, dest, dest2];
    const edges = [
        createEdge(source.id, filter.id),
        createEdge(filter.id, map.id),
        createEdge(map.id, dest.id),
        createEdge(map.id, aggregate.id),
        createEdge(aggregate.id, dest2.id),
    ];

    return {
        name: "用户数据处理管道",
        description: "从用户表读取 → 过滤活跃用户 → 字段映射 → 写入分析库 / 导出统计 CSV",
        nodes,
        edges,
    };
};

/**
 * EtlDemo 主操作（左侧）
 *
 * demo 级操作，不重复底层 EtlToolbar 的节点拖拽/连线功能。
 */
export const ETL_ACTIONS: ShDemoAction[] = [
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.etl.toolbar.loadSample", group: "data" },
    { key: "clear", icon: Delete, labelKey: "advanced.etl.toolbar.clear", type: "danger", group: "data" },
    { key: "exportJson", icon: Download, tooltipKey: "advanced.etl.toolbar.exportJson", iconOnly: true, group: "data" },
    { key: "save", icon: Check, labelKey: "advanced.etl.toolbar.save", type: "primary" },
    { key: "validate", icon: Select, labelKey: "advanced.etl.toolbar.validate", group: "exec" },
    { key: "run", icon: VideoPlay, labelKey: "advanced.etl.toolbar.run", type: "success", group: "exec" },
];

/**
 * EtlDemo 次要操作（右侧）
 */
export const ETL_SECONDARY: ShDemoAction[] = [
    { key: "toggleGrid", icon: Grid, tooltipKey: "advanced.etl.toolbar.toggleGrid", iconOnly: true, active: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.etl.toolbar.help", iconOnly: true },
];
