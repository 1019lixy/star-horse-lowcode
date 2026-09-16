<script setup lang="ts" name="PrintPreviewDialog">
/**
 * 打印模板设计器 - 预览弹窗
 * 职责：展示渲染结果，支持 HTML/PDF/ZPL/TSPL 多目标切换 + 调用浏览器打印
 * 强制使用 star-horse-dialog
 */
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import { renderPrintHtml } from "../renderers/HtmlRenderer";
import { renderZpl } from "../renderers/ZplRenderer";
import { renderTspl } from "../renderers/TsplRenderer";
import type {
  PrintRenderContext,
  PrintRenderTarget,
  PrintTemplate,
} from "../types";
import { StarHorsePanel } from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  template: PrintTemplate;
  /** 渲染数据（必填，预览前需先准备） */
  data?: Record<string, any>;
  /** 操作员名 */
  operator?: string;
  /** 打印机名 */
  printerName?: string;
  /** 默认页数 */
  pageCount?: number;
  dialogType?: "dialog" | "drawer";
}>();

const emits = defineEmits<{
  (e: "update:visible", v: boolean): void;
  (e: "print", target: PrintRenderTarget, content: string): void;
  (e: "copy-zpl", content: string): void;
}>();

const activeTarget = ref<PrintRenderTarget>("html");
const iframeRef = ref<HTMLIFrameElement>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emits("update:visible", v),
});

const renderContext = computed<PrintRenderContext>(() => ({
  pageNumber: 1,
  pageCount: props.pageCount || 1,
  operator: props.operator || "",
  printerName: props.printerName || "",
  tenantName: "",
  data: props.data || {},
  renderTime: Date.now(),
}));

const htmlContent = computed(() =>
  renderPrintHtml(props.template, renderContext.value),
);
const zplContent = computed(() =>
  renderZpl(props.template, renderContext.value),
);
const tsplContent = computed(() =>
  renderTspl(props.template, renderContext.value),
);

const currentContent = computed(() => {
  switch (activeTarget.value) {
    case "zpl":
      return zplContent.value;
    case "tspl":
      return tsplContent.value;
    default:
      return htmlContent.value;
  }
});

const isCodeTarget = computed(
  () => activeTarget.value === "zpl" || activeTarget.value === "tspl",
);

const refreshIframe = () => {
  if (activeTarget.value !== "html" || !iframeRef.value) return;
  const doc = iframeRef.value.contentDocument;
  if (!doc) return;
  doc.open();
  doc.write(htmlContent.value);
  doc.close();
};

watch(
  () => [props.visible, activeTarget.value, htmlContent.value],
  () => {
    if (props.visible && activeTarget.value === "html") {
      setTimeout(refreshIframe, 50);
    }
  },
);

const handleBrowserPrint = () => {
  if (activeTarget.value !== "html" || !iframeRef.value?.contentWindow) return;
  iframeRef.value.contentWindow.focus();
  iframeRef.value.contentWindow.print();
};

const handleCopyCode = async () => {
  try {
    await navigator.clipboard.writeText(currentContent.value);
    if (activeTarget.value === "zpl") {
      emits("copy-zpl", currentContent.value);
    }
  } catch (e) {
    console.error("Copy failed:", e);
  }
};

const handlePrint = () => {
  emits("print", activeTarget.value, currentContent.value);
};
</script>

<template>
  <star-horse-panel
    :type="dialogType"
    v-model="innerVisible"
    :title="i18n('print.preview.title')"
    box-width="80%"
    box-height="80%"
    :is-show-reset="false"
    :is-show-save="false"
    :userAction="true"
    @merge="handlePrint"
  >
    <div class="print-preview-dialog">
      <div class="preview-toolbar">
        <el-radio-group v-model="activeTarget">
          <el-radio-button value="html">HTML/PDF</el-radio-button>
          <el-radio-button value="zpl">ZPL</el-radio-button>
          <el-radio-button value="tspl">TSPL</el-radio-button>
        </el-radio-group>
        <div class="spacer"></div>
        <el-button
          v-if="activeTarget === 'html'"
          type="primary"
          @click="handleBrowserPrint"
        >
          <star-horse-icon icon-class="dayin" cursor="pointer" />
          {{ i18n("print.preview.browserPrint") }}
        </el-button>
        <el-button v-if="isCodeTarget" @click="handleCopyCode">
          <star-horse-icon icon-class="copy" cursor="pointer" />
          {{ i18n("print.preview.copyCode") }}
        </el-button>
      </div>
      <div class="preview-content">
        <iframe
          v-if="activeTarget === 'html'"
          ref="iframeRef"
          class="preview-iframe"
        ></iframe>
        <pre v-else class="preview-code">{{ currentContent }}</pre>
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
.print-preview-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;

  .preview-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;

    .spacer {
      flex: 1;
    }
  }

  .preview-content {
    flex: 1;
    overflow: hidden;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    background: #ffffff;
  }

  .preview-iframe {
    width: 100%;
    height: 100%;
    border: none;
    background: #ffffff;
  }

  .preview-code {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 12px;
    overflow: auto;
    font-family: "Consolas", "Monaco", monospace;
    font-size: 12px;
    background: #1e1e1e;
    color: #d4d4d4;
    box-sizing: border-box;
  }
}
</style>
