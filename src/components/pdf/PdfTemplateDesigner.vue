<script setup lang="ts" name="PdfTemplateDesigner">
import {ref} from "vue";
import {DesignerMobileShell} from "@/components/shared";
import {usePdfDesigner} from "./composables/usePdfDesigner";
import PdfToolbar from "./panels/PdfToolbar.vue";
import PdfElementPanel from "./panels/PdfElementPanel.vue";
import PdfCanvas from "./panels/PdfCanvas.vue";
import PdfPropertyPanel from "./panels/PdfPropertyPanel.vue";
import PdfPreviewDialog from "./dialogs/PdfPreviewDialog.vue";
import type {PdfTemplate} from "./types";

const props = defineProps<{
  template?: PdfTemplate;
  initialTemplate?: Partial<PdfTemplate>;
  readonly?: boolean;
}>();

const emits = defineEmits<{
  (e: "update:template", v: PdfTemplate): void;
  (e: "save", v: PdfTemplate): void;
}>();

const designer = usePdfDesigner(props.initialTemplate || props.template);
if (props.template) designer.loadData(props.template);

const previewVisible = ref(false);

const handleSave = () => {
  const data = designer.getData();
  emits("update:template", data);
  emits("save", data);
};
</script>

<template>
  <div class="pdf-template-designer">
    <DesignerMobileShell
        :panels="[
                { key: 'elements', label: '元素', side: 'left', width: 220, min: 180 },
                { key: 'props', label: '属性', side: 'right', width: 280, min: 220 },
            ]"
    >
      <template #toolbar>
        <pdf-toolbar
            :designer="designer"
            :readonly="readonly"
            @save="handleSave"
            @preview="previewVisible = true"
        />
      </template>
      <template #canvas>
        <pdf-canvas :designer="designer" :readonly="readonly"/>
      </template>
      <template #panel-elements>
        <pdf-element-panel :designer="designer" :readonly="readonly"/>
      </template>
      <template #panel-props>
        <pdf-property-panel :designer="designer" :readonly="readonly"/>
      </template>
    </DesignerMobileShell>

    <pdf-preview-dialog
        v-model:visible="previewVisible"
        :designer="designer"
    />
  </div>
</template>

<style lang="scss" scoped>
.pdf-template-designer {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--el-bg-color-page);
  overflow: hidden;
}
</style>
