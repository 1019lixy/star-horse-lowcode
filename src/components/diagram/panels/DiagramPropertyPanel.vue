<script setup lang="ts" name="DiagramPropertyPanel">
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import type { UseDiagramDesignerReturn } from "../composables/useDiagramDesigner";

const props = defineProps<{
    designer: UseDiagramDesignerReturn;
}>();

const selected = computed(() => props.designer.selectedNode.value);
const selectedEdge = computed(() => props.designer.selectedEdges.value[0] || null);

// 当前 tab 自动跟随选中
const activeTab = ref("node");

watch(
    () => [props.designer.state.selectedNodeIds.length, props.designer.state.selectedEdgeIds.length],
    ([nodeCount, edgeCount]) => {
        if ((edgeCount as number) > 0) {
            activeTab.value = "edge";
        } else {
            activeTab.value = "node";
        }
    },
);

const updateNode = (patch: Record<string, any>) => {
    if (!selected.value) return;
    props.designer.updateNode(selected.value.id, patch);
};

const updateStyle = (patch: Record<string, any>) => {
    if (!selected.value) return;
    props.designer.updateNodeStyle(selected.value.id, patch);
};

const updateEdge = (patch: Partial<Record<string, any>>) => {
    if (!selectedEdge.value) return;
    props.designer.updateEdge(selectedEdge.value.id, patch);
};

const updateEdgeStyle = (patch: Record<string, any>) => {
    if (!selectedEdge.value) return;
    props.designer.updateEdge(selectedEdge.value.id, {
        style: { ...(selectedEdge.value.style || {}), ...patch },
    });
};

// 获取源/目标节点名
const sourceNode = computed(() => {
    if (!selectedEdge.value) return "";
    const n = props.designer.state.diagram.nodes.find((nd) => nd.id === selectedEdge.value!.source);
    return n ? n.text || n.id : selectedEdge.value.source;
});
const targetNode = computed(() => {
    if (!selectedEdge.value) return "";
    const n = props.designer.state.diagram.nodes.find((nd) => nd.id === selectedEdge.value!.target);
    return n ? n.text || n.id : selectedEdge.value.target;
});
</script>

<template>
    <div class="diagram-property-panel">
        <el-tabs v-model="activeTab" class="prop-tabs">
            <el-tab-pane :label="i18n('diagram.property.node')" name="node">
                <div v-if="!selected" class="empty-tip">
                    {{ i18n('diagram.property.selectFirst') }}
                </div>
                <el-form v-else label-width="80px" class="prop-form">
                    <el-divider content-position="left">{{ i18n('diagram.property.basic') }}</el-divider>
                    <el-form-item :label="i18n('diagram.property.id')">
                        <el-input :model-value="selected.id" disabled />
                    </el-form-item>
                    <el-form-item :label="i18n('diagram.property.type')">
                        <el-input :model-value="selected.type" disabled />
                    </el-form-item>
                    <el-form-item :label="i18n('diagram.property.text')">
                        <el-input :model-value="selected.text" @change="(v) => updateNode({ text: v })"/>
                    </el-form-item>
                    <el-form-item :label="i18n('diagram.property.position')">
                        <div class="pos-row">
                            <el-input-number :model-value="selected.x" :step="1" @change="(v) => updateNode({ x: v })"/>
                            <el-input-number :model-value="selected.y" :step="1" @change="(v) => updateNode({ y: v })"/>
                        </div>
                    </el-form-item>
                    <el-form-item :label="i18n('diagram.property.size')">
                        <div class="pos-row">
                            <el-input-number :model-value="selected.width" :min="10" :step="1" @change="(v) => updateNode({ width: v })"/>
                            <el-input-number :model-value="selected.height" :min="10" :step="1" @change="(v) => updateNode({ height: v })"/>
                        </div>
                    </el-form-item>

                    <el-divider content-position="left">{{ i18n('diagram.property.style') }}</el-divider>
                    <el-form-item :label="i18n('diagram.property.fill')">
                        <el-color-picker :model-value="selected.style?.fill" @change="(v) => updateStyle({ fill: v })"/>
                    </el-form-item>
                    <el-form-item :label="i18n('diagram.property.stroke')">
                        <el-color-picker :model-value="selected.style?.stroke" @change="(v) => updateStyle({ stroke: v })"/>
                    </el-form-item>
                    <el-form-item :label="i18n('diagram.property.textColor')">
                        <el-color-picker :model-value="selected.style?.textColor" @change="(v) => updateStyle({ textColor: v })"/>
                    </el-form-item>
                    <el-form-item :label="i18n('diagram.property.fontSize')">
                        <el-input-number :model-value="selected.style?.fontSize" :min="6" :max="72" @change="(v) => updateStyle({ fontSize: v })"/>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <el-tab-pane :label="i18n('diagram.property.edge')" name="edge">
                <div v-if="!selectedEdge" class="empty-tip">
                    {{ i18n('diagram.property.selectEdgeFirst') }}
                </div>
                <el-form v-else label-width="80px" class="prop-form">
                    <el-divider content-position="left">{{ i18n('diagram.property.basic') }}</el-divider>
                    <el-form-item :label="i18n('diagram.property.id')">
                        <el-input :model-value="selectedEdge.id" disabled />
                    </el-form-item>
                    <el-form-item :label="i18n('diagram.property.source')">
                        <el-input :model-value="sourceNode" disabled />
                    </el-form-item>
                    <el-form-item :label="i18n('diagram.property.target')">
                        <el-input :model-value="targetNode" disabled />
                    </el-form-item>
                    <el-form-item :label="i18n('diagram.property.label')">
                        <el-input :model-value="selectedEdge.label" @change="(v) => updateEdge({ label: v })"/>
                    </el-form-item>

                    <el-divider content-position="left">{{ i18n('diagram.property.style') }}</el-divider>
                    <el-form-item :label="i18n('diagram.property.edgeType')">
                        <el-select :model-value="selectedEdge.type" @change="(v) => updateEdge({ type: v })">
                            <el-option :label="i18n('diagram.edge.straight')" value="straight"/>
                            <el-option :label="i18n('diagram.edge.polyline')" value="polyline"/>
                            <el-option :label="i18n('diagram.edge.curve')" value="curve"/>
                            <el-option :label="i18n('diagram.edge.orthogonal')" value="orthogonal"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="i18n('diagram.property.lineStyle')">
                        <el-select :model-value="selectedEdge.style?.lineStyle || 'solid'" @change="(v) => updateEdgeStyle({ lineStyle: v })">
                            <el-option :label="i18n('diagram.edge.solid')" value="solid"/>
                            <el-option :label="i18n('diagram.edge.dashed')" value="dashed"/>
                            <el-option :label="i18n('diagram.edge.dotted')" value="dotted"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="i18n('diagram.property.stroke')">
                        <el-color-picker :model-value="selectedEdge.style?.stroke" @change="(v) => updateEdgeStyle({ stroke: v })"/>
                    </el-form-item>
                    <el-form-item :label="i18n('diagram.property.strokeWidth')">
                        <el-input-number :model-value="selectedEdge.style?.strokeWidth" :min="1" :max="10" @change="(v) => updateEdgeStyle({ strokeWidth: v })"/>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style lang="scss" scoped>
.diagram-property-panel {
    width: 100%;
    height: 100%;
    background: var(--el-bg-color);
    border-left: 1px solid var(--el-border-color-lighter);

    .prop-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;

        :deep(.el-tabs__content) {
            flex: 1;
            overflow-y: auto;
            padding: 8px;
        }
    }

    .empty-tip {
        padding: 40px 12px;
        text-align: center;
        color: var(--el-text-color-secondary);
        font-size: 13px;
    }

    .pos-row {
        display: flex;
        gap: 4px;

        :deep(.el-input-number) {
            flex: 1;
        }
    }
}
</style>
