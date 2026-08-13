<script setup lang="ts" name="Whiteboard">
import { ref, watch } from "vue";
import { useWhiteboardDesigner } from "./composables/useWhiteboardDesigner";
import WbToolbar from "./panels/WbToolbar.vue";
import WbCanvas from "./panels/WbCanvas.vue";
import WbLayerPanel from "./panels/WbLayerPanel.vue";
import WbPropertyPanel from "./panels/WbPropertyPanel.vue";
import WbExportDialog from "./dialogs/WbExportDialog.vue";
import { DesignerMobileShell } from "@/components/shared";
import type { WhiteboardElement } from "./types";

const props = defineProps<{
  /** 初始元素列表 */
  elements?: WhiteboardElement[];
  /** 是否只读 */
  readonly?: boolean;
}>();

const emits = defineEmits<{
  (e: "update:elements", v: WhiteboardElement[]): void;
  (e: "change", v: WhiteboardElement[]): void;
}>();

const designer = useWhiteboardDesigner({
  elements: props.elements,
  readonly: props.readonly,
});

// 初始元素加载（只执行一次）
if (props.elements && props.elements.length > 0) {
  designer.loadElements(props.elements);
}

// 元素变化通知
watch(
  () => designer.state.elements,
  (els) => {
    emits("update:elements", els);
    emits("change", els);
  },
  { deep: true },
);

const exportVisible = ref(false);

const handleExport = () => {
  exportVisible.value = true;
};
</script>

<template>
  <div class="whiteboard-container">
    <DesignerMobileShell
      :panels="[
        { key: 'layers', label: '图层', side: 'left', width: 220, min: 180 },
        { key: 'props', label: '属性', side: 'right', width: 260, min: 200 },
      ]"
    >
      <template #toolbar>
        <wb-toolbar
          :designer="designer"
          :readonly="readonly"
          @export="handleExport"
        />
      </template>
      <template #canvas>
        <wb-canvas :designer="designer" />
      </template>
      <template #panel-layers>
        <wb-layer-panel :designer="designer" :readonly="readonly" />
      </template>
      <template #panel-props>
        <wb-property-panel :designer="designer" :readonly="readonly" />
      </template>
    </DesignerMobileShell>

    <wb-export-dialog
      v-model:visible="exportVisible"
      :elements="designer.state.elements"
    />
  </div>
</template>

<style lang="scss" scoped>
.whiteboard-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--el-bg-color-page);
  overflow: hidden;
}
</style>
