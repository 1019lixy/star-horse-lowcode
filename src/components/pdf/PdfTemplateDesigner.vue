<script setup lang="ts" name="PdfTemplateDesigner">
import { ref } from "vue";
import { usePdfDesigner } from "./composables/usePdfDesigner";
import PdfToolbar from "./panels/PdfToolbar.vue";
import PdfElementPanel from "./panels/PdfElementPanel.vue";
import PdfCanvas from "./panels/PdfCanvas.vue";
import PdfPropertyPanel from "./panels/PdfPropertyPanel.vue";
import PdfPreviewDialog from "./dialogs/PdfPreviewDialog.vue";
import type { PdfTemplate } from "./types";

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
        <pdf-toolbar
            :designer="designer"
            :readonly="readonly"
            @save="handleSave"
            @preview="previewVisible = true"
        />
        <el-splitter class="designer-body" direction="horizontal">
            <el-splitter-panel size="220px" min="160px" max="360px">
                <pdf-element-panel :designer="designer" :readonly="readonly"/>
            </el-splitter-panel>
            <el-splitter-panel>
                <pdf-canvas :designer="designer" :readonly="readonly"/>
            </el-splitter-panel>
            <el-splitter-panel size="280px" min="220px" max="480px">
                <pdf-property-panel :designer="designer" :readonly="readonly"/>
            </el-splitter-panel>
        </el-splitter>

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

    .designer-body {
        flex: 1;
        overflow: hidden;
    }
}
</style>
