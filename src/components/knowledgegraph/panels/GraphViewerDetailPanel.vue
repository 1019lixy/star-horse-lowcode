<script setup lang="ts" name="GraphViewerDetailPanel">
import { computed } from "vue";
import { i18n } from "@/lang";
import {
    KG_EDGE_TYPE_PRESETS,
    KG_NODE_TYPE_PRESETS,
    kgGetEdgeColor,
    kgGetNodeColor,
    kgGetNodeRadius,
} from "../constants";
import type { KgEdge, KgNode } from "../types";
import type { UseGraphViewerReturn } from "../composables/useGraphViewer";

const props = defineProps<{
    viewer: UseGraphViewerReturn;
}>();

const viewer = props.viewer;

const selectedNode = computed(() => viewer.selectedNode.value);

const selectedEdge = computed<KgEdge | null>(() => {
    if (!viewer.state.selectedEdgeId) return null;
    return viewer.state.graph.edges.find((e) => e.id === viewer.state.selectedEdgeId) ?? null;
});

const neighbors = computed(() => {
    if (!selectedNode.value) return [];
    return viewer.getNeighbors(selectedNode.value.id);
});

const neighborEdges = computed(() => {
    if (!selectedNode.value) return [];
    return viewer.getNeighborEdges(selectedNode.value.id);
});

const nodeTypeLabel = (type: string): string => {
    const preset = KG_NODE_TYPE_PRESETS.find((p) => p.type === type);
    return preset ? i18n(preset.labelKey) : type;
};

const edgeTypeLabel = (type: string): string => {
    const preset = KG_EDGE_TYPE_PRESETS.find((p) => p.type === type);
    return preset ? i18n(preset.labelKey) : type;
};

const propertyEntries = computed<Array<[string, any]>>(() => {
    if (!selectedNode.value?.properties) return [];
    return Object.entries(selectedNode.value.properties);
});

const emit = defineEmits<{
    (e: "select-node", id: string): void;
}>();

const handleNeighborClick = (id: string) => {
    viewer.selectNode(id);
    emit("select-node", id);
};

const handleExpand = () => {
    if (selectedNode.value) viewer.expandNeighbors(selectedNode.value.id);
};

const handleCollapse = () => {
    if (selectedNode.value) viewer.collapseNeighbors(selectedNode.value.id);
};

const isCollapsed = computed(() =>
    selectedNode.value ? viewer.state.collapsedNodeIds.includes(selectedNode.value.id) : false,
);
</script>

<template>
    <div class="kg-detail-panel">
        <div class="panel-header">
            <span>{{ i18n("knowledgegraph.viewer.detail.title") }}</span>
        </div>
        <div class="panel-body">
            <div v-if="!selectedNode && !selectedEdge" class="empty">
                {{ i18n("knowledgegraph.viewer.detail.empty") }}
            </div>

            <!-- 节点详情 -->
            <template v-else-if="selectedNode">
                <div class="detail-section">
                    <div class="section-row">
                        <span class="label">{{ i18n("knowledgegraph.viewer.detail.id") }}</span>
                        <span class="value mono">{{ selectedNode.id }}</span>
                    </div>
                    <div class="section-row">
                        <span class="label">{{ i18n("knowledgegraph.viewer.detail.label") }}</span>
                        <span class="value">{{ selectedNode.label }}</span>
                    </div>
                    <div class="section-row">
                        <span class="label">{{ i18n("knowledgegraph.viewer.detail.type") }}</span>
                        <el-tag  :style="{ background: kgGetNodeColor(selectedNode), color: '#FFF', border: 'none' }">
                            {{ nodeTypeLabel(selectedNode.type) }}
                        </el-tag>
                    </div>
                    <div class="section-row">
                        <span class="label">X / Y</span>
                        <span class="value mono">{{ Math.round(selectedNode.x) }}, {{ Math.round(selectedNode.y) }}</span>
                    </div>
                    <div class="section-row">
                        <span class="label">R</span>
                        <span class="value">{{ kgGetNodeRadius(selectedNode) }}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <div class="section-title">{{ i18n("knowledgegraph.viewer.detail.properties") }}</div>
                    <el-table v-if="propertyEntries.length" :data="propertyEntries"  border>
                        <el-table-column prop="0" label="Key" width="100" />
                        <el-table-column prop="1" label="Value" />
                    </el-table>
                    <div v-else class="empty-inline">—</div>
                </div>

                <div class="detail-section">
                    <div class="section-title">
                        {{ i18n("knowledgegraph.viewer.neighbors") }} ({{ neighbors.length }})
                        <el-button-group style="float: right">
                            <el-button

                                :disabled="isCollapsed"
                                @click="handleCollapse"
                            >{{ i18n("knowledgegraph.viewer.collapse") }}</el-button>
                            <el-button

                                :disabled="!isCollapsed"
                                @click="handleExpand"
                            >{{ i18n("knowledgegraph.viewer.expand") }}</el-button>
                        </el-button-group>
                    </div>
                    <div class="neighbor-list">
                        <div
                            v-for="nb in neighbors"
                            :key="nb.id"
                            class="neighbor-item"
                            @click="handleNeighborClick(nb.id)"
                        >
                            <span class="dot" :style="{ background: kgGetNodeColor(nb) }" />
                            <span class="nb-label">{{ nb.label }}</span>
                            <span class="nb-type">{{ nodeTypeLabel(nb.type) }}</span>
                        </div>
                        <div v-if="neighbors.length === 0" class="empty-inline">—</div>
                    </div>
                </div>

                <div class="detail-section">
                    <div class="section-title">{{ i18n("knowledgegraph.viewer.edges") }} ({{ neighborEdges.length }})</div>
                    <div class="edge-list">
                        <div v-for="e in neighborEdges" :key="e.id" class="edge-item">
                            <span class="dot" :style="{ background: kgGetEdgeColor(e) }" />
                            <span class="edge-label">{{ edgeTypeLabel(e.type) }}</span>
                            <span class="edge-from">{{ e.source === selectedNode.id ? "→ " + e.target : e.target === selectedNode.id ? "← " + e.source : e.source + " ↔ " + e.target }}</span>
                        </div>
                        <div v-if="neighborEdges.length === 0" class="empty-inline">—</div>
                    </div>
                </div>
            </template>

            <!-- 边详情 -->
            <template v-else-if="selectedEdge">
                <div class="detail-section">
                    <div class="section-row">
                        <span class="label">ID</span>
                        <span class="value mono">{{ selectedEdge.id }}</span>
                    </div>
                    <div class="section-row">
                        <span class="label">{{ i18n("knowledgegraph.query.edgeType") }}</span>
                        <el-tag  :style="{ background: kgGetEdgeColor(selectedEdge), color: '#FFF', border: 'none' }">
                            {{ edgeTypeLabel(selectedEdge.type) }}
                        </el-tag>
                    </div>
                    <div class="section-row">
                        <span class="label">Source</span>
                        <span class="value mono">{{ selectedEdge.source }}</span>
                    </div>
                    <div class="section-row">
                        <span class="label">Target</span>
                        <span class="value mono">{{ selectedEdge.target }}</span>
                    </div>
                    <div class="section-row" v-if="selectedEdge.label">
                        <span class="label">Label</span>
                        <span class="value">{{ selectedEdge.label }}</span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.kg-detail-panel {
    width: 100%;
    height: 100%;
    background: var(--el-bg-color);
    border-left: 1px solid var(--el-border-color);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;

    .panel-header {
        padding: 8px 12px;
        font-weight: 600;
        border-bottom: 1px solid var(--el-border-color);
        flex-shrink: 0;
    }

    .panel-body {
        flex: 1;
        overflow: auto;
        padding: 8px 12px;
    }

    .empty {
        color: var(--el-text-color-placeholder);
        text-align: center;
        padding: 32px 0;
    }

    .detail-section {
        margin-bottom: 14px;

        .section-title {
            font-weight: 600;
            font-size: 13px;
            margin-bottom: 6px;
            color: var(--el-text-color-primary);
        }

        .section-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 0;
            font-size: 12px;

            .label {
                color: var(--el-text-color-secondary);
                min-width: 60px;
            }

            .value {
                color: var(--el-text-color-primary);
                text-align: right;
                word-break: break-all;
            }

            .mono {
                font-family: "Courier New", monospace;
                font-size: 11px;
            }
        }
    }

    .empty-inline {
        color: var(--el-text-color-placeholder);
        font-size: 12px;
    }

    .neighbor-list, .edge-list {
        .neighbor-item, .edge-item {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 4px 6px;
            cursor: pointer;
            border-radius: 4px;
            font-size: 12px;

            &:hover {
                background: var(--el-fill-color-light);
            }

            .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                flex-shrink: 0;
            }

            .nb-label, .edge-label {
                flex: 1;
                color: var(--el-text-color-primary);
            }

            .nb-type, .edge-from {
                color: var(--el-text-color-secondary);
                font-size: 11px;
            }
        }
    }
}
</style>
