<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import type { EtlPipeline } from "@/components/etl";
import { createEdge, createEtlNode, EtlDesigner } from "@/components/etl";

/** 构造一个示例管道：数据库源 → 过滤 → 字段映射 → 数据库目标 */
const buildSamplePipeline = (): Partial<EtlPipeline> => {
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
    description:
      "从用户表读取 → 过滤活跃用户 → 字段映射 → 写入分析库 / 导出统计 CSV",
    nodes,
    edges,
  };
};

const initialPipeline = ref<Partial<EtlPipeline>>(buildSamplePipeline());

const handleSave = (data: EtlPipeline) => {
  console.log("ETL pipeline saved:", data);
  ElMessage.success(
    `管道已保存：${data.name}（${data.nodes.length} 节点 / ${data.edges.length} 连线）`,
  );
};
</script>

<template>
  <div class="demo-container">
    <h3>ETL 数据管道设计器 EtlDesigner</h3>
    <p>
      可视化 ETL 数据管道设计器，支持 18
      种节点类型（数据源/转换/目标/控制），拖拽连线、属性配置、拓扑排序执行模拟、数据预览、执行日志。预置了一个"用户数据处理管道"示例，包含
      6 个节点和 5 条连线。
    </p>
    <div class="designer-wrapper">
      <EtlDesigner :pipeline="initialPipeline" @save="handleSave" />
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 16px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.demo-container h3 {
  margin: 0 0 4px;
}

.demo-container p {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.designer-wrapper {
  flex: 1;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}
</style>
