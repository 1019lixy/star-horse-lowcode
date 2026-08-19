<script setup lang="ts" name="GraphViewer">
import { onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import { DesignerMobileShell } from "@/components/shared";
import GraphViewerToolbar from "./panels/GraphViewerToolbar.vue";
import GraphViewerCanvas from "./panels/GraphViewerCanvas.vue";
import GraphViewerDetailPanel from "./panels/GraphViewerDetailPanel.vue";
import { useGraphViewer } from "./composables/useGraphViewer";
import { useForceLayout } from "./composables/useForceLayout";
import type { KgGraph } from "./types";

const props = defineProps<{
  graph?: KgGraph;
  autoLayout?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:graph", v: KgGraph): void;
  (e: "select-node", id: string | null): void;
}>();

const viewer = useGraphViewer(props.graph ? { ...props.graph } : undefined);

// 力布局需要响应式节点/边引用
const nodesRef = viewer.state.graph.nodes;
const edgesRef = viewer.state.graph.edges;
const force = useForceLayout(
  { value: nodesRef } as any,
  { value: edgesRef } as any,
);

const canvasRef = ref<InstanceType<typeof GraphViewerCanvas>>();

// 选中变化时通知父组件
watch(
  () => viewer.state.selectedNodeId,
  (id) => emit("select-node", id),
);

watch(
  () => props.graph,
  (g) => {
    if (g) viewer.loadGraph(g);
  },
  { deep: false },
);

onMounted(() => {
  if (props.autoLayout !== false && viewer.state.graph.nodes.length > 0) {
    viewer.applyLayout();
  }
});

const handleSelectFromDetail = (id: string) => {
  // 详情面板点击邻居时已经调用了 viewer.selectNode
  emit("select-node", id);
};

// 路径查询面板嵌入主组件时的入口
const pathFromId = ref<string | null>(null);
const pathToId = ref<string | null>(null);

const setPathFrom = (id: string | null) => {
  pathFromId.value = id;
  viewer.setPathEndpoints(id, viewer.state.pathToId);
};
const setPathTo = (id: string | null) => {
  pathToId.value = id;
  viewer.setPathEndpoints(viewer.state.pathFromId, id);
};

const runPathQuery = () => {
  if (!pathFromId.value || !pathToId.value) {
    ElMessage.warning(i18n("knowledgegraph.message.invalidQuery"));
    return;
  }
  const path = viewer.findPath(pathFromId.value, pathToId.value);
  if (path.length === 0) {
    ElMessage.info(i18n("knowledgegraph.viewer.noPath"));
  }
};

defineExpose({
  viewer,
  force,
  setPathFrom,
  setPathTo,
  runPathQuery,
});

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
  right:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
};
</script>

<template>
  <div class="kg-viewer">
    <DesignerMobileShell
      :panels="[
        { key: 'detail', label: '详情', side: 'right', width: 320, min: 240 },
      ]"
      canvas-label="图谱"
    >
      <template #toolbar>
        <graph-viewer-toolbar :viewer="viewer" />
      </template>
      <template #canvas>
        <div class="viewer-body">
          <!-- 路径查询条 -->
          <div class="path-bar">
            <span class="path-label">{{
              i18n("knowledgegraph.viewer.pathQuery")
            }}</span>
            <el-select
              :model-value="pathFromId"
              @update:model-value="setPathFrom"
              :placeholder="i18n('knowledgegraph.viewer.pathFrom')"
              filterable
              clearable
              style="width: 180px !important"
            >
              <el-option
                v-for="n in viewer.state.graph.nodes"
                :key="n.id"
                :label="n.label"
                :value="n.id"
              />
            </el-select>
            <span class="svg-icon" v-html="icons.right"></span>
            <el-select
              :model-value="pathToId"
              @update:model-value="setPathTo"
              :placeholder="i18n('knowledgegraph.viewer.pathTo')"
              filterable
              clearable
              style="width: 180px !important"
            >
              <el-option
                v-for="n in viewer.state.graph.nodes"
                :key="n.id"
                :label="n.label"
                :value="n.id"
              />
            </el-select>
            <el-button type="primary" @click="runPathQuery">
              {{ i18n("knowledgegraph.viewer.findPath") }}
            </el-button>
            <div v-if="viewer.state.pathNodeIds.length > 0" class="path-result">
              {{ i18n("knowledgegraph.viewer.pathResult") }}:
              <span
                v-for="(id, idx) in viewer.state.pathNodeIds"
                :key="id"
                class="path-node"
              >
                {{ idx > 0 ? " → " : ""
                }}{{
                  viewer.state.graph.nodes.find((n) => n.id === id)?.label ?? id
                }}
              </span>
              <span class="path-length">
                ({{ viewer.state.pathNodeIds.length - 1 }})</span
              >
            </div>
          </div>
          <div class="canvas-area">
            <graph-viewer-canvas
              ref="canvasRef"
              :viewer="viewer"
              :force="force"
            />
          </div>
        </div>
      </template>
      <template #panel-detail>
        <graph-viewer-detail-panel
          :viewer="viewer"
          @select-node="handleSelectFromDetail"
        />
      </template>
    </DesignerMobileShell>
  </div>
</template>

<style lang="scss" scoped>
.kg-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--el-bg-color-page);
  overflow: hidden;

  .viewer-body {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .path-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;
    flex-wrap: wrap;

    .path-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--el-text-color-secondary);
    }

    .arrow {
      color: var(--el-text-color-secondary);
    }

    .path-result {
      font-size: 12px;
      color: var(--el-text-color-primary);
      margin-left: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;

      .path-node {
        color: var(--el-color-primary);
      }

      .path-length {
        color: var(--el-text-color-secondary);
      }
    }
  }

  .canvas-area {
    flex: 1;
    overflow: hidden;
  }
}

.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  margin-right: 4px;
}

.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
