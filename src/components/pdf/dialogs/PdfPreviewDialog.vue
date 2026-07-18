<script setup lang="ts" name="PdfPreviewDialog">
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import type { PdfDesigner } from "../composables/usePdfDesigner";
import { renderPrintableHtml } from "../renderers/PdfHtmlRenderer";

const props = defineProps<{
    visible: boolean;
    designer: PdfDesigner;
    data?: Record<string, any>;
}>();

const emit = defineEmits<{
    (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
    get: () => props.visible,
    set: (v) => emit("update:visible", v),
});

const iframeRef = ref<HTMLIFrameElement | null>(null);

const previewHtml = computed(() => renderPrintableHtml(props.designer.state, props.data));

/** 渲染 iframe */
const renderPreview = () => {
    setTimeout(() => {
        const iframe = iframeRef.value;
        if (!iframe) return;
        const doc = iframe.contentDocument;
        if (!doc) return;
        doc.open();
        doc.write(previewHtml.value);
        doc.close();
    }, 50);
};

const handlePrint = () => {
    const iframe = iframeRef.value;
    if (!iframe?.contentWindow) {
        ElMessage.warning(i18n("pdf.message.previewNotReady"));
        return;
    }
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
};

const handleExportHtml = () => {
    const blob = new Blob([previewHtml.value], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${props.designer.state.name || "pdf-template"}.html`;
    a.click();
    URL.revokeObjectURL(url);
};

const handleOpened = () => {
    renderPreview();
};
</script>

<template>
    <star-horse-dialog
        v-model="innerVisible"
        :title="i18n('pdf.preview.title')"
        box-width="80%"
        box-height="80%"
        :is-show-reset="false"
        :is-show-save="false"
        :self-func="true"
        @open="handleOpened"
    >
        <div class="pdf-preview-dialog">
            <div class="preview-toolbar">
                <el-button  @click="handlePrint">
                    <el-icon><Printer/></el-icon>
                    {{ i18n("pdf.btn.print") }}
                </el-button>
                <el-button  @click="handleExportHtml">
                    <el-icon><Download/></el-icon>
                    {{ i18n("pdf.btn.exportHtml") }}
                </el-button>
            </div>
            <iframe ref="iframeRef" class="preview-iframe"/>
        </div>
        <template #footer>
            <el-button @click="innerVisible = false">{{ i18n("dialog.close") }}</el-button>
        </template>
    </star-horse-dialog>
</template>

<script lang="ts">
import { Printer, Download } from "@element-plus/icons-vue";
export default { components: { Printer, Download } };
</script>

<style lang="scss" scoped>
.pdf-preview-dialog {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 8px;

    .preview-toolbar {
        display: flex;
        gap: 8px;
    }

    .preview-iframe {
        flex: 1;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        width: 100%;
    }
}
</style>
