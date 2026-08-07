<script setup lang="ts" name="GraphQueryResultsPanel">
import {computed, ref} from "vue";
import {i18n} from "@/lang";
import {KG_NODE_TYPE_PRESETS, kgGetNodeColor, kgGetNodeRadius,} from "../constants";
import type {KgNode} from "../types";
import type {UseGraphQueryBuilderReturn} from "../composables/useGraphQueryBuilder";

const props = defineProps<{
  builder: UseGraphQueryBuilderReturn;
}>();

const builder = props.builder;

const viewMode = ref<"table" | "graph">("table");

const results = computed(() => builder.state.results);
const executed = computed(() => builder.state.executed);

/** 表格行：合并所有结果中的节点（去重） */
const tableRows = computed(() => {
  const map = new Map<string, KgNode>();
  results.value.forEach((r) => r.nodes.forEach((n) => map.set(n.id, n)));
  return Array.from(map.values());
});

/** 子图节点和边（合并所有结果路径涉及的节点和边） */
const subNodes = computed(() => tableRows.value);
const subEdges = computed(() => {
  const map = new Map<string, any>();
  results.value.forEach((r) => r.edges.forEach((e) => map.set(e.id, e)));
  return Array.from(map.values());
});

const nodeTypeLabel = (type: string): string => {
  const preset = KG_NODE_TYPE_PRESETS.find((p) => p.type === type);
  return preset ? i18n(preset.labelKey) : type;
};

const emit = defineEmits<{
  (e: "select-node", id: string): void;
}>();

const handleRowClick = (row: KgNode) => {
  emit("select-node", row.id);
};

// 子图小型预览的视口
const previewZoom = ref(0.6);
const previewPan = ref({x: 50, y: 30});

const propertySummary = (node: KgNode): string => {
  if (!node.properties) return "";
  return Object.entries(node.properties)
      .slice(0, 3)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
};
</script>

<template>
  <div class="kg-results-panel">
    <div class="panel-header">
      <span>{{ i18n("knowledgegraph.query.results") }}</span>
      <div class="header-actions">
                <span class="count">
                    {{ i18n("knowledgegraph.query.results.count") }}: {{ results.length }}
                </span>
        <el-radio-group v-model="viewMode">
          <el-radio-button value="table">Table</el-radio-button>
          <el-radio-button value="graph">Graph</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="panel-body">
      <div v-if="!executed" class="empty">
        {{ i18n("knowledgegraph.query.results.empty") }}
      </div>
      <div v-else-if="results.length === 0" class="empty">
        {{ i18n("knowledgegraph.message.noResults") }}
      </div>

      <template v-else>
        <!-- 表格视图 -->
        <div v-if="viewMode === 'table'" class="table-view">
          <el-table
              :data="tableRows"

              border
              highlight-current-row
              @row-click="handleRowClick"
          >
            <el-table-column prop="id" label="ID" width="120" show-overflow-tooltip/>
            <el-table-column prop="label" :label="i18n('knowledgegraph.viewer.detail.label')" width="120"/>
            <el-table-column :label="i18n('knowledgegraph.viewer.detail.type')" width="90">
              <template #default="{ row }">
                <el-tag

                    :style="{ background: kgGetNodeColor(row), color: '#FFF', border: 'none' }"
                >
                  {{ nodeTypeLabel(row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="i18n('knowledgegraph.viewer.detail.properties')" min-width="200">
              <template #default="{ row }">
                <span class="props">{{ propertySummary(row) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 子图视图 -->
        <div v-else class="graph-view">
          <svg
              width="100%"
              height="100%"
              :viewBox="`0 0 800 500`"
              preserveAspectRatio="xMidYMid meet"
              style="background: #FAFAFA"
          >
            <g :transform="`translate(${previewPan.x},${previewPan.y}) scale(${previewZoom})`">
              <!-- 边 -->
              <line
                  v-for="edge in subEdges"
                  :key="edge.id"
                  :x1="subNodes.find(n => n.id === edge.source)?.x ?? 0"
                  :y1="subNodes.find(n => n.id === edge.source)?.y ?? 0"
                  :x2="subNodes.find(n => n.id === edge.target)?.x ?? 0"
                  :y2="subNodes.find(n => n.id === edge.target)?.y ?? 0"
                  stroke="#8C8C8C"
                  stroke-width="1"
              />
              <!-- 节点 -->
              <g
                  v-for="node in subNodes"
                  :key="node.id"
                  :transform="`translate(${node.x},${node.y})`"
                  style="cursor: pointer"
                  @click="handleRowClick(node)"
              >
                <circle
                    :r="kgGetNodeRadius(node)"
                    :fill="kgGetNodeColor(node)"
                    stroke="#FFFFFF"
                    stroke-width="1.5"
                />
                <text
                    :y="kgGetNodeRadius(node) + 12"
                    font-size="10"
                    fill="#333"
                    text-anchor="middle"
                    style="paint-order: stroke; stroke: #FFFFFF; stroke-width: 2px"
                >{{ node.label }}
                </text>
              </g>
            </g>
          </svg>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.kg-results-panel {
  flex: 1;
  height: 100%;
  background: var(--el-bg-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .panel-header {
    padding: 8px 12px;
    font-weight: 600;
    border-bottom: 1px solid var(--el-border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-shrink: 0;

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;

      .count {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        font-weight: normal;
      }
    }
  }

  .panel-body {
    flex: 1;
    overflow: auto;
    padding: 8px;
  }

  .empty {
    color: var(--el-text-color-placeholder);
    text-align: center;
    padding: 32px 0;
  }

  .table-view {
    height: 100%;
  }

  .graph-view {
    height: 100%;
    min-height: 400px;
  }

  .props {
    font-size: 11px;
    color: var(--el-text-color-secondary);
  }
}
</style>
