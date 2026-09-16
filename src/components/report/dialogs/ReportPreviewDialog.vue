<script setup lang="ts" name="ReportPreviewDialog">
/**
 * 报表预览弹窗
 * 强制使用 star-horse-dialog
 */
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import { renderReportPrintHtml } from "../renderers/ReportHtmlRenderer";
import type { ReportRenderContext, ReportTemplate } from "../types";
import { StarHorsePanel } from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  template: ReportTemplate;
  data?: Record<string, any[]>;
  params?: Record<string, any>;
  operator?: string;
  dialogType?: "dialog" | "drawer";
}>();

const emits = defineEmits<{
  (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emits("update:visible", v),
});

const iframeRef = ref<HTMLIFrameElement>();

const renderCtx = computed<ReportRenderContext>(() => ({
  params: props.params || {},
  datasets: props.data || {},
  pageNumber: 1,
  pageCount: 1,
  operator: props.operator || "",
  renderTime: Date.now(),
}));

const htmlContent = computed(() =>
  renderReportPrintHtml(props.template, renderCtx.value),
);

const refreshIframe = () => {
  if (!iframeRef.value) return;
  const doc = iframeRef.value.contentDocument;
  if (!doc) return;
  doc.open();
  doc.write(htmlContent.value);
  doc.close();
};

watch(
  () => [props.visible, htmlContent.value],
  () => {
    if (props.visible) {
      setTimeout(refreshIframe, 50);
    }
  },
);

const handleBrowserPrint = () => {
  if (!iframeRef.value?.contentWindow) return;
  iframeRef.value.contentWindow.focus();
  iframeRef.value.contentWindow.print();
};

const handleExportHtml = () => {
  const blob = new Blob([htmlContent.value], {
    type: "text/html;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${props.template.name || "report"}.html`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<template>
  <star-horse-panel
    :type="dialogType"
    v-model="innerVisible"
    :title="i18n('report.preview.title')"
    box-width="80%"
    box-height="80%"
    :is-show-reset="false"
    :is-show-save="false"
    :userAction="true"
  >
    <div class="report-preview-dialog">
      <div class="preview-toolbar">
        <el-button type="primary" @click="handleBrowserPrint">
          {{ i18n("report.preview.print") }}
        </el-button>
        <el-button @click="handleExportHtml">
          {{ i18n("report.preview.exportHtml") }}
        </el-button>
      </div>
      <div class="preview-content">
        <iframe ref="iframeRef" class="preview-iframe"></iframe>
      </div>
    </div>
    <template #footer>
      <el-button @click="innerVisible = false">{{
        i18n("dialog.close")
      }}</el-button>
    </template>
  </star-horse-panel>
</template>

<style lang="scss" scoped>
.report-preview-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;

  .preview-toolbar {
    display: flex;
    gap: 8px;
  }

  .preview-content {
    flex: 1;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: hidden;
  }

  .preview-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>
