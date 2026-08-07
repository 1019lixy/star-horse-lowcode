<script setup lang="ts" name="DiagramDesigner">
import {ref} from "vue";
import {useDiagramDesigner} from "./composables/useDiagramDesigner";
import DiagramToolbar from "./panels/DiagramToolbar.vue";
import DiagramNodePanel from "./panels/DiagramNodePanel.vue";
import DiagramCanvas from "./panels/DiagramCanvas.vue";
import DiagramPropertyPanel from "./panels/DiagramPropertyPanel.vue";
import DiagramPreviewDialog from "./dialogs/DiagramPreviewDialog.vue";
import {DesignerMobileShell} from "@/components/shared";
import type {DiagramData, NodeTypePreset} from "./types";

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
    <DesignerMobileShell
        :panels="[
                { key: 'nodes', label: '节点', side: 'left', width: 200, min: 160 },
                { key: 'props', label: '属性', side: 'right', width: 280, min: 220 },
            ]"
    >
      <template #toolbar>
        <diagram-toolbar
            :designer="designer"
            :readonly="readonly"
            @save="handleSave"
            @preview="previewVisible = true"
        />
      </template>
      <template #canvas>
        <diagram-canvas ref="canvasRef" :designer="designer"/>
      </template>
      <template #panel-nodes>
        <diagram-node-panel
            :readonly="readonly"
            @add="handleAddNode"
            @drag-start="handleDragStart"
        />
      </template>
      <template #panel-props>
        <diagram-property-panel :designer="designer"/>
      </template>
    </DesignerMobileShell>

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
}
</style>
