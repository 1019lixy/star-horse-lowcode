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
const canvasRef = ref<InstanceType<typeof DiagramCanvas>>();

const handleAddNode = (preset: NodeTypePreset) => {
    // 在画布可见区域中心添加节点
    const c = designer.state.diagram.canvas;
    const svgEl = document.querySelector(".diagram-canvas-wrapper svg") as SVGSVGElement | null;
    if (svgEl) {
        const rect = svgEl.getBoundingClientRect();
        const centerX = (rect.width / 2 - c.panX) / c.zoom;
        const centerY = (rect.height / 2 - c.panY) / c.zoom;
        designer.addNode(preset, designer.snapValue(centerX - preset.width / 2), designer.snapValue(centerY - preset.height / 2));
    } else {
        designer.addNode(preset, 100, 100);
    }
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
        <el-splitter class="designer-body" direction="horizontal">
            <el-splitter-panel size="200px" min="160px" max="360px">
                <diagram-node-panel
                    :readonly="readonly"
                    @add="handleAddNode"
                    @drag-start="handleDragStart"
                />
            </el-splitter-panel>
            <el-splitter-panel>
                <diagram-canvas :designer="designer"/>
            </el-splitter-panel>
            <el-splitter-panel size="280px" min="220px" max="480px">
                <diagram-property-panel :designer="designer"/>
            </el-splitter-panel>
        </el-splitter>

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
        overflow: hidden;
    }
}
</style>
