<script setup lang="ts" name="DiagramDesigner">
import { ref } from "vue";
import { useDiagramDesigner } from "./composables/useDiagramDesigner";
import DiagramToolbar from "./panels/DiagramToolbar.vue";
import DiagramNodePanel from "./panels/DiagramNodePanel.vue";
import DiagramCanvas from "./panels/DiagramCanvas.vue";
import DiagramPropertyPanel from "./panels/DiagramPropertyPanel.vue";
import DiagramPreviewDialog from "./dialogs/DiagramPreviewDialog.vue";
import type { DiagramData, NodeTypePreset } from "./types";

const props = defineProps<{
    diagram?: DiagramData;
    initialDiagram?: Partial<DiagramData>;
    readonly?: boolean;
}>();

const emits = defineEmits<{
    (e: "update:diagram", v: DiagramData): void;
    (e: "save", v: DiagramData): void;
}>();

const designer = useDiagramDesigner(props.initialDiagram || props.diagram);
if (props.diagram) designer.loadDiagram(props.diagram);

const previewVisible = ref(false);

const handleAddNode = (preset: NodeTypePreset) => {
    designer.addNode(preset, 100, 100);
};

const handleDragStart = (preset: NodeTypePreset) => {
    (window as any).__diagramDragPreset = preset;
};

const handleSave = () => {
    const dg = designer.getDiagram();
    emits("update:diagram", dg);
    emits("save", dg);
};
</script>

<template>
    <div class="diagram-designer">
        <diagram-toolbar
            :designer="designer"
            :readonly="readonly"
            @save="handleSave"
            @preview="previewVisible = true"
        />
        <div class="designer-body">
            <diagram-node-panel
                :readonly="readonly"
                @add="handleAddNode"
                @drag-start="handleDragStart"
            />
            <diagram-canvas :designer="designer"/>
            <diagram-property-panel :designer="designer"/>
        </div>

        <diagram-preview-dialog
            v-model:visible="previewVisible"
            :diagram="designer.state.diagram"
        />
    </div>
</template>

<style lang="scss" scoped>
.diagram-designer {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--el-bg-color-page);
    overflow: hidden;

    .designer-body {
        flex: 1;
        display: flex;
        overflow: hidden;
    }
}
</style>
