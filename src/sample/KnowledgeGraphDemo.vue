<script setup lang="ts">
import {ref} from "vue";
import type {KgGraph, KgQueryTemplate} from "@/components/knowledgegraph";
import {createKgCondition, createKgStep, GraphQueryBuilder, GraphViewer} from "@/components/knowledgegraph";

const activeTab = ref("viewer");

/** 示例图谱：马斯克商业关系网络 */
const graph = ref<KgGraph>({
  id: "kg_demo",
  name: "马斯克商业关系网络",
  nodes: [
    // 人物
    {id: "p1", type: "person", label: "Elon Musk", x: 0, y: 0, properties: {age: 52, nationality: "美国", role: "CEO"}},
    {id: "p2", type: "person", label: "JB Straubel", x: 0, y: 0, properties: {age: 48, role: "CTO"}},
    {id: "p3", type: "person", label: "Gwynne Shotwell", x: 0, y: 0, properties: {age: 60, role: "COO"}},
    // 公司
    {id: "c1", type: "company", label: "Tesla", x: 0, y: 0, properties: {founded: 2003, industry: "汽车"}},
    {id: "c2", type: "company", label: "SpaceX", x: 0, y: 0, properties: {founded: 2002, industry: "航天"}},
    {id: "c3", type: "company", label: "SolarCity", x: 0, y: 0, properties: {founded: 2006, industry: "能源"}},
    {id: "c4", type: "company", label: "Neuralink", x: 0, y: 0, properties: {founded: 2016, industry: "脑机接口"}},
    {id: "c5", type: "company", label: "The Boring Company", x: 0, y: 0, properties: {founded: 2016, industry: "隧道"}},
    {id: "c6", type: "company", label: "Twitter/X", x: 0, y: 0, properties: {founded: 2006, industry: "社交"}},
    // 项目
    {id: "pr1", type: "project", label: "Starship", x: 0, y: 0, properties: {status: "研发中"}},
    {id: "pr2", type: "project", label: "Falcon 9", x: 0, y: 0, properties: {status: "运营中"}},
    // 地点
    {id: "l1", type: "location", label: "Palo Alto", x: 0, y: 0, properties: {country: "美国", state: "CA"}},
    {id: "l2", type: "location", label: "Hawthorne", x: 0, y: 0, properties: {country: "美国", state: "CA"}},
    {id: "l3", type: "location", label: "Boca Chica", x: 0, y: 0, properties: {country: "美国", state: "TX"}},
  ],
  edges: [
    // 创立关系
    {id: "e1", source: "p1", target: "c1", type: "founder", label: "创立"},
    {id: "e2", source: "p1", target: "c2", type: "founder", label: "创立"},
    {id: "e3", source: "p1", target: "c3", type: "founder", label: "创立"},
    {id: "e4", source: "p1", target: "c4", type: "founder", label: "创立"},
    {id: "e5", source: "p1", target: "c5", type: "founder", label: "创立"},
    // 员工关系
    {id: "e6", source: "p1", target: "c1", type: "employee", label: "CEO"},
    {id: "e7", source: "p1", target: "c2", type: "employee", label: "CEO"},
    {id: "e8", source: "p2", target: "c1", type: "employee", label: "前CTO"},
    {id: "e9", source: "p3", target: "c2", type: "employee", label: "COO"},
    // 投资关系
    {id: "e10", source: "c1", target: "c3", type: "investor", label: "投资"},
    {id: "e11", source: "p1", target: "c6", type: "investor", label: "收购"},
    // 合作关系
    {id: "e12", source: "c1", target: "c3", type: "partner", label: "合作"},
    {id: "e13", source: "c2", target: "c4", type: "partner", label: "技术合作"},
    // 地点关系
    {id: "e14", source: "c1", target: "l1", type: "location", label: "总部"},
    {id: "e15", source: "c2", target: "l2", type: "location", label: "总部"},
    {id: "e16", source: "pr1", target: "l3", type: "location", label: "研发基地"},
    // 参与关系
    {id: "e17", source: "c2", target: "pr1", type: "participant", label: "开发"},
    {id: "e18", source: "c2", target: "pr2", type: "participant", label: "开发"},
  ],
});

/** 预置查询模板 */
const templates = ref<KgQueryTemplate[]>([
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
]);

const handleSelectNode = (id: string | null) => {
  // 示例：可在控制台观察选中变化
  // eslint-disable-next-line no-console
  console.log("selected node:", id);
};
</script>

<template>
  <div class="demo-container">
    <el-tabs v-model="activeTab" type="border-card" class="demo-tabs">
      <el-tab-pane label="图谱查看器" name="viewer">
        <div class="tab-content">
          <GraphViewer
              :graph="graph"
              :auto-layout="true"
              @select-node="handleSelectNode"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="查询构建器" name="query">
        <div class="tab-content">
          <GraphQueryBuilder
              :graph="graph"
              :templates="templates"
              @select-node="handleSelectNode"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.demo-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.demo-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.demo-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
}

.tab-content {
  height: 100%;
  overflow: hidden;
}
</style>
