<script setup lang="ts" name="GraphQueryBuilder">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import GraphQueryBuilderPanel from "./panels/GraphQueryBuilderPanel.vue";
import GraphQueryResultsPanel from "./panels/GraphQueryResultsPanel.vue";
import KgTemplateDialog from "./dialogs/KgTemplateDialog.vue";
import { useGraphQueryBuilder } from "./composables/useGraphQueryBuilder";
import { kgCircleLayout } from "./utils/KgGraphLayout";
import type { KgGraph, KgQuery, KgQueryTemplate } from "./types";

const props = defineProps<{
    graph?: KgGraph;
    initialQuery?: KgQuery;
    templates?: KgQueryTemplate[];
}>();

const emit = defineEmits<{
    (e: "select-node", id: string): void;
}>();

const builder = useGraphQueryBuilder(props.initialQuery);

if (props.templates && props.templates.length > 0) {
    builder.setTemplates(props.templates);
}

const templateDialogVisible = ref(false);

const handleRun = () => {
    if (!props.graph) {
        ElMessage.warning(i18n("knowledgegraph.message.invalidQuery"));
        return;
    }
    // 给结果节点应用一个圆形布局以便子图预览
    const results = builder.runQuery(props.graph);
    if (results.length === 0) {
        ElMessage.info(i18n("knowledgegraph.message.noResults"));
        return;
    }
    // 给结果中所有节点重新布局位置（仅影响子图视图展示，不影响原图）
    const allNodes = new Map<string, any>();
    results.forEach((r) => r.nodes.forEach((n) => allNodes.set(n.id, n)));
    const positions = kgCircleLayout(Array.from(allNodes.values()), {
        centerX: 400,
        centerY: 250,
        radius: 180,
    });
    allNodes.forEach((n) => {
        const p = positions.get(n.id);
        if (p) {
            n.x = p.x;
            n.y = p.y;
        }
    });
};

const handleOpenTemplate = () => {
    templateDialogVisible.value = true;
};

const handleSelectNode = (id: string) => {
    emit("select-node", id);
};

defineExpose({ builder });
</script>

<template>
    <div class="kg-query-builder">
        <div class="builder-body">
            <graph-query-builder-panel
                :builder="builder"
                @run="handleRun"
                @open-template="handleOpenTemplate"
            />
            <graph-query-results-panel
                :builder="builder"
                @select-node="handleSelectNode"
            />
        </div>

        <kg-template-dialog
            v-model:visible="templateDialogVisible"
            :builder="builder"
        />
    </div>
</template>

<style lang="scss" scoped>
.kg-query-builder {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--el-bg-color-page);
    overflow: hidden;

    .builder-body {
        flex: 1;
        display: flex;
        overflow: hidden;
    }
}
</style>
