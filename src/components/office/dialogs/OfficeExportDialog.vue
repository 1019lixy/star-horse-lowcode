<script setup lang="ts" name="OfficeExportDialog">
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import { officeColIndexToLetter } from "../constants";
import { recalcSheet } from "../utils/OfficeFormulaUtils";
import type { OfficeDocument, OfficeExportFormat } from "../types";
import { StarHorsePanel } from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  doc: OfficeDocument | null;
  dialogType?: "dialog" | "drawer";
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

const format = ref<OfficeExportFormat>("html");

const formatOptions = computed(() => [
  { value: "html", label: i18n("office.export.html") },
  { value: "json", label: i18n("office.export.json") },
  { value: "markdown", label: i18n("office.export.markdown") },
]);

/** 导出 HTML */
const buildHtml = (doc: OfficeDocument): string => {
  let body = "";
  if (doc.type === "word") body = doc.wordContent?.html ?? "";
  else if (doc.type === "excel") {
    const sheet = doc.excelContent?.sheets[0];
    if (sheet) {
      const cells = recalcSheet(sheet.cells);
      body = '<table style="border-collapse:collapse;">';
      for (let r = 0; r < sheet.rows; r++) {
        body += "<tr>";
        for (let c = 0; c < sheet.cols; c++) {
          const cell = cells.find((x) => x.row === r && x.col === c);
          if (cell?.covered) continue;
          const cs = cell?.colspan ? ` colspan="${cell.colspan}"` : "";
          const rs = cell?.rowspan ? ` rowspan="${cell.rowspan}"` : "";
          const val = cell?.isFormula
            ? (cell.display ?? "")
            : (cell?.value ?? "");
          body += `<td style="border:1px solid #ddd;padding:6px;"${cs}${rs}>${val}</td>`;
        }
        body += "</tr>";
      }
      body += "</table>";
    }
  } else if (doc.type === "slide" && doc.slideContent) {
    const sc = doc.slideContent;
    body = sc.slides
      .map((s) => {
        const els = s.elements
          .map((e) => {
            if (e.type === "text") {
              return `<div style="position:absolute;left:${e.x}px;top:${e.y}px;font-size:${e.fontSize ?? 18}px;color:${e.color ?? "#333"};">${e.text ?? ""}</div>`;
            }
            if (e.type === "image") {
              return `<img src="${e.src ?? ""}" style="position:absolute;left:${e.x}px;top:${e.y}px;width:${e.width}px;height:${e.height}px;"/>`;
            }
            return `<div style="position:absolute;left:${e.x}px;top:${e.y}px;width:${e.width}px;height:${e.height}px;background:${e.fill ?? "#409EFF"};"></div>`;
          })
          .join("");
        return `<div style="position:relative;width:${sc.canvasWidth}px;height:${sc.canvasHeight}px;background:${s.bg ?? "#fff"};margin:0 auto 16px;">${els}</div>`;
      })
      .join("");
  }
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${doc.name}</title></head><body>${body}</body></html>`;
};

/** 导出 JSON */
const buildJson = (doc: OfficeDocument): string => JSON.stringify(doc, null, 2);

/** 导出 Markdown */
const buildMarkdown = (doc: OfficeDocument): string => {
  if (doc.type === "word") {
    // 简易 HTML 转 Markdown：剥离标签
    const html = doc.wordContent?.html ?? "";
    return `# ${doc.name}\n\n${html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
      .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")}`;
  }
  if (doc.type === "excel") {
    const sheet = doc.excelContent?.sheets[0];
    if (!sheet) return `# ${doc.name}`;
    const cells = recalcSheet(sheet.cells);
    let md = `# ${doc.name}\n\n`;
    md += `| |${Array.from({ length: sheet.cols }, (_, c) => ` ${officeColIndexToLetter(c)} |`).join("")}\n`;
    md += `|---|${Array.from({ length: sheet.cols }, () => "---|").join("")}\n`;
    for (let r = 0; r < sheet.rows; r++) {
      md += `| ${r + 1} |`;
      for (let c = 0; c < sheet.cols; c++) {
        const cell = cells.find((x) => x.row === r && x.col === c);
        const val = cell?.isFormula
          ? (cell.display ?? "")
          : (cell?.value ?? "");
        md += ` ${val} |`;
      }
      md += "\n";
    }
    return md;
  }
  if (doc.type === "slide" && doc.slideContent) {
    let md = `# ${doc.name}\n\n`;
    doc.slideContent.slides.forEach((s, i) => {
      md += `## ${i18n("office.slide.slideNum")} ${i + 1}\n\n`;
      s.elements.forEach((e) => {
        if (e.type === "text") md += `- ${e.text ?? ""}\n`;
        else if (e.type === "image") md += `- ![image](${e.src ?? ""})\n`;
        else md += `- [${e.shape ?? "shape"}]\n`;
      });
      md += "\n";
    });
    return md;
  }
  return `# ${doc.name}`;
};

/** 执行导出 */
const handleExport = () => {
  if (!props.doc) return;
  let content = "";
  let ext = format.value;
  let mime = "text/plain;charset=utf-8";
  if (format.value === "html") {
    content = buildHtml(props.doc);
    mime = "text/html;charset=utf-8";
  } else if (format.value === "json") {
    content = buildJson(props.doc);
    mime = "application/json;charset=utf-8";
  } else {
    content = buildMarkdown(props.doc);
    mime = "text/markdown;charset=utf-8";
  }
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${props.doc.name}.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
  ElMessage.success(i18n("office.message.exported"));
  innerVisible.value = false;
};

/** 预览内容 */
const previewContent = computed(() => {
  if (!props.doc) return "";
  if (format.value === "html") return buildHtml(props.doc);
  if (format.value === "json") return buildJson(props.doc);
  return buildMarkdown(props.doc);
});
</script>

<template>
  <star-horse-panel
    :type="dialogType"
    v-model="innerVisible"
    :title="i18n('office.export.title')"
    box-width="800px"
    :userAction="true"
  >
    <div class="office-export-dialog">
      <el-form label-width="100px">
        <el-form-item :label="i18n('office.export.format')">
          <el-radio-group v-model="format">
            <el-radio-button
              v-for="o in formatOptions"
              :key="o.value"
              :value="o.value"
            >
              {{ o.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="preview-box">
        <pre>{{ previewContent }}</pre>
      </div>
    </div>
    <template #footer>
      <el-button @click="innerVisible = false">{{
        i18n("dialog.close")
      }}</el-button>
      <el-button type="primary" @click="handleExport">
        {{ i18n("office.export.confirm") }}
      </el-button>
    </template>
  </star-horse-panel>
</template>

<style lang="scss" scoped>
.office-export-dialog {
  .preview-box {
    max-height: 60vh;
    overflow: auto;
    background: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 4px;
    padding: 12px;
    margin-top: 8px;

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
      font-family: "Courier New", monospace;
      font-size: 12px;
      line-height: 1.5;
    }
  }
}
</style>
