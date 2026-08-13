<template>
  <div
    ref="diffRoot"
    class="sh-diff-editor"
    :class="{ 'sh-diff-editor--dark': isDark }"
    :style="{ height: height }"
  >
    <!-- 工具栏 -->
    <div class="sh-diff-toolbar">
      <div class="sh-diff-toolbar__left">
        <span class="sh-diff-toolbar__title">
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="currentColor"
            class="sh-diff-icon"
          >
            <path
              d="M1.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V8a.5.5 0 0 0-1 0v5.5H2V2h5.5a.5.5 0 0 0 0-1h-6zm9 0a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .354-.854l-4-4A.5.5 0 0 0 10.5 1zM11 2.707 13.293 5H11V2.707z"
            />
            <path
              d="M4 6.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
          {{ title || i18n("diff.title") }}
        </span>
        <span v-if="conflictCount > 0" class="sh-diff-toolbar__conflict-badge">
          {{ conflictCount }} {{ i18n("diff.conflicts") }}
        </span>
        <!-- 文件上传按钮（enableFileInput 模式下） -->
        <template v-if="enableFileInput">
          <span class="sh-diff-toolbar__sep" />
          <button
            class="sh-diff-toolbar__btn sh-diff-toolbar__btn--file"
            :title="i18n('diff.uploadOriginal')"
            @click="handleOriginalFilePick"
          >
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
              <path
                d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
              />
              <path
                d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"
              />
            </svg>
            {{ originalFileName || i18n("diff.uploadOriginal") }}
          </button>
          <button
            class="sh-diff-toolbar__btn sh-diff-toolbar__btn--file"
            :title="i18n('diff.uploadModified')"
            @click="handleModifiedFilePick"
          >
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
              <path
                d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
              />
              <path
                d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"
              />
            </svg>
            {{ modifiedFileName || i18n("diff.uploadModified") }}
          </button>
        </template>
      </div>
      <div class="sh-diff-toolbar__center">
        <button
          class="sh-diff-toolbar__btn"
          :class="{ active: renderSideBySide }"
          :title="i18n('diff.sideBySide')"
          @click="renderSideBySide = true"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path
              d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 0v12H14a.5.5 0 0 0 .5-.5V2.5a.5.5 0 0 0-.5-.5H8.5zm-1 0H2.5a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h5V2z"
            />
          </svg>
        </button>
        <button
          class="sh-diff-toolbar__btn"
          :class="{ active: !renderSideBySide }"
          :title="i18n('diff.inline')"
          @click="renderSideBySide = false"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path
              d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm1 0v12a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-.5-.5h-13A.5.5 0 0 0 1 2z"
            />
            <path d="M2 5h12v1H2V5zm0 3h12v1H2V8zm0 3h12v1H2v-1z" />
          </svg>
        </button>
        <span class="sh-diff-toolbar__sep" />
        <button
          v-if="conflictMode"
          class="sh-diff-toolbar__btn sh-diff-toolbar__btn--accept-all"
          :title="i18n('diff.acceptAllCurrent')"
          :disabled="conflictCount === 0"
          @click="acceptAllCurrent"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path
              d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"
            />
          </svg>
          {{ i18n("diff.acceptAllCurrent") }}
        </button>
        <button
          v-if="conflictMode"
          class="sh-diff-toolbar__btn sh-diff-toolbar__btn--accept-all"
          :title="i18n('diff.acceptAllIncoming')"
          :disabled="conflictCount === 0"
          @click="acceptAllIncoming"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path
              d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"
            />
          </svg>
          {{ i18n("diff.acceptAllIncoming") }}
        </button>
      </div>
      <div class="sh-diff-toolbar__right">
        <span v-if="diffStats" class="sh-diff-toolbar__stats">
          <span class="stat-add">+{{ diffStats.added }}</span>
          <span class="stat-del">-{{ diffStats.removed }}</span>
          <span class="stat-chg">~{{ diffStats.changed }}</span>
        </span>
        <button
          class="sh-diff-toolbar__btn"
          :title="i18n('diff.close')"
          @click="handleClose"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 冲突操作栏（冲突模式下显示） -->
    <div
      v-if="conflictMode && currentConflictIndex >= 0"
      class="sh-diff-conflict-bar"
    >
      <span class="sh-diff-conflict-bar__info">
        <svg
          viewBox="0 0 16 16"
          width="14"
          height="14"
          fill="currentColor"
          class="conflict-info-icon"
        >
          <path
            d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
          />
        </svg>
        {{ i18n("diff.conflictOf", currentConflictIndex + 1, conflictCount) }}
      </span>
      <div class="sh-diff-conflict-bar__actions">
        <button
          class="conflict-btn conflict-btn--current"
          @click="acceptCurrentConflict"
        >
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
            <path
              d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"
            />
          </svg>
          {{ i18n("diff.acceptCurrent") }}
        </button>
        <button
          class="conflict-btn conflict-btn--incoming"
          @click="acceptIncomingConflict"
        >
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
            <path
              d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
            />
          </svg>
          {{ i18n("diff.acceptIncoming") }}
        </button>
        <button
          class="conflict-btn conflict-btn--both"
          @click="acceptBothConflict"
        >
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
            <path
              d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
            />
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
            />
          </svg>
          {{ i18n("diff.acceptBoth") }}
        </button>
        <span class="sh-diff-conflict-bar__nav">
          <button
            class="conflict-nav-btn"
            :disabled="currentConflictIndex <= 0"
            @click="prevConflict"
            :title="i18n('diff.prevConflict')"
          >
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
              />
            </svg>
          </button>
          <button
            class="conflict-nav-btn"
            :disabled="currentConflictIndex >= conflictCount - 1"
            @click="nextConflict"
            :title="i18n('diff.nextConflict')"
          >
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
        </span>
      </div>
    </div>

    <!-- Monaco DiffEditor 容器 -->
    <div ref="editorContainer" class="sh-diff-monaco" />

    <!-- 底部操作栏 -->
    <div class="sh-diff-footer">
      <div class="sh-diff-footer__left">
        <span
          class="sh-diff-footer__label original-label"
          :class="{
            'drop-active': originalDropActive,
            'file-input-active': enableFileInput,
          }"
          @dragover="handleOriginalDragOver"
          @dragleave="handleOriginalDragLeave"
          @drop="handleOriginalDrop"
          @click="enableFileInput && handleOriginalFilePick()"
        >
          {{ originalLabel || i18n("diff.original") }}
          <template v-if="originalFileName"> - {{ originalFileName }}</template>
          <template v-if="enableFileInput && !originalFileName">
            <span class="drop-hint">{{ i18n("diff.dragFileHint") }}</span>
          </template>
        </span>
      </div>
      <div class="sh-diff-footer__center">
        <button
          class="sh-diff-footer__btn sh-diff-footer__btn--primary"
          @click="handleSave"
        >
          {{ i18n("diff.save") }}
        </button>
        <button class="sh-diff-footer__btn" @click="handleClose">
          {{ i18n("diff.cancel") }}
        </button>
      </div>
      <div class="sh-diff-footer__right">
        <span
          class="sh-diff-footer__label modified-label"
          :class="{
            'drop-active': modifiedDropActive,
            'file-input-active': enableFileInput,
          }"
          @dragover="handleModifiedDragOver"
          @dragleave="handleModifiedDragLeave"
          @drop="handleModifiedDrop"
          @click="enableFileInput && handleModifiedFilePick()"
        >
          {{ modifiedLabel || i18n("diff.modified") }}
          <template v-if="modifiedFileName"> - {{ modifiedFileName }}</template>
          <template v-if="enableFileInput && !modifiedFileName">
            <span class="drop-hint">{{ i18n("diff.dragFileHint") }}</span>
          </template>
        </span>
      </div>
    </div>

    <!-- 隐藏的文件输入框 -->
    <input
      ref="originalFileInputRef"
      type="file"
      style="display: none"
      @change="handleOriginalFileInput"
    />
    <input
      ref="modifiedFileInputRef"
      type="file"
      style="display: none"
      @change="handleModifiedFileInput"
    />
  </div>
</template>

<script setup lang="ts" name="StarHorseDiffEditor">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from "vue";
import * as monaco from "monaco-editor";
import { i18n } from "@/lang/index";

// ==================== Props & Emits ====================
const props = defineProps({
  /** 原始内容（服务器版本/基线版本） */
  original: { type: String, default: "" },
  /** 修改后内容（当前版本/冲突版本） */
  modified: { type: String, default: "" },
  /** 文件语言，用于语法高亮 */
  language: { type: String, default: "plaintext" },
  /** 原始侧标签 */
  originalLabel: { type: String, default: "" },
  /** 修改侧标签 */
  modifiedLabel: { type: String, default: "" },
  /** 标题 */
  title: { type: String, default: "" },
  /** 编辑器高度 */
  height: { type: String, default: "600px" },
  /** 主题 */
  theme: { type: String, default: "vs" },
  /** 是否只读（原始侧始终只读） */
  readOnly: { type: Boolean, default: false },
  /** 是否为冲突解决模式 */
  conflictMode: { type: Boolean, default: false },
  /** 是否默认并排显示 */
  sideBySide: { type: Boolean, default: true },
  /** 冲突标记（用于自动检测冲突的区域） */
  conflictMarkers: { type: Array as () => ConflictMarker[], default: () => [] },
  /** 是否启用文件上传/拖拽功能（独立使用时开启） */
  enableFileInput: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (e: "save", result: string): void;
  (e: "close"): void;
  (e: "resolve", result: string): void;
  (e: "conflictChange", remaining: number, total: number): void;
  (e: "fileLoaded", side: "original" | "modified", fileName: string): void;
}>();

// ==================== Types ====================
interface ConflictMarker {
  startLine: number;
  separatorLine: number;
  endLine: number;
  currentContent: string;
  incomingContent: string;
}

// ==================== State ====================
const diffRoot = ref<HTMLElement>();
const editorContainer = ref<HTMLElement>();
const editorInstance = shallowRef<monaco.editor.IStandaloneDiffEditor>();
const renderSideBySide = ref(props.sideBySide);
const currentConflictIndex = ref(0);
const diffStats = ref<{
  added: number;
  removed: number;
  changed: number;
} | null>(null);
const detectedConflicts = ref<ConflictMarker[]>([]);
const conflictCount = ref(0);
const lineChanges = ref<monaco.editor.ILineChange[]>([]);
const currentChangeIndex = ref(0);
const changeCount = ref(0);

const isDark = computed(
  () => props.theme === "vs-dark" || props.theme === "hc-black",
);

// ==================== 文件上传/拖拽 ====================
const originalFileName = ref("");
const modifiedFileName = ref("");
const originalFileInputRef = ref<HTMLInputElement>();
const modifiedFileInputRef = ref<HTMLInputElement>();
const originalDropActive = ref(false);
const modifiedDropActive = ref(false);

/** 根据文件扩展名推断 Monaco 语言 */
const detectLangFromExt = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    java: "java",
    py: "python",
    rb: "ruby",
    go: "go",
    rs: "rust",
    c: "c",
    cpp: "cpp",
    h: "c",
    hpp: "cpp",
    cs: "csharp",
    php: "php",
    swift: "swift",
    kt: "kotlin",
    scala: "scala",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "scss",
    less: "less",
    json: "json",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    toml: "ini",
    md: "markdown",
    sql: "sql",
    sh: "shell",
    bash: "shell",
    ps1: "powershell",
    vue: "html",
    svelte: "html",
    txt: "plaintext",
    log: "plaintext",
    cfg: "ini",
    ini: "ini",
  };
  return map[ext] || "plaintext";
};

/** 读取文件并更新到对应编辑器侧 */
const loadFileToSide = (file: File, side: "original" | "modified") => {
  const reader = new FileReader();
  reader.onload = () => {
    const content = reader.result as string;
    const lang = detectLangFromExt(file.name);

    if (side === "original") {
      originalFileName.value = file.name;
      const editor = editorInstance.value;
      if (editor) {
        const model = editor.getModel();
        if (model) {
          model.original.setValue(content);
          monaco.editor.setModelLanguage(model.original, lang);
        }
      }
    } else {
      modifiedFileName.value = file.name;
      const editor = editorInstance.value;
      if (editor) {
        const model = editor.getModel();
        if (model) {
          model.modified.setValue(content);
          monaco.editor.setModelLanguage(model.modified, lang);
        }
      }
    }
    emit("fileLoaded", side, file.name);
  };
  reader.readAsText(file);
};

const handleOriginalFilePick = () => originalFileInputRef.value?.click();
const handleModifiedFilePick = () => modifiedFileInputRef.value?.click();

const handleOriginalFileInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files?.[0]) loadFileToSide(input.files[0], "original");
  input.value = "";
};

const handleModifiedFileInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files?.[0]) loadFileToSide(input.files[0], "modified");
  input.value = "";
};

const handleOriginalDragOver = (e: DragEvent) => {
  if (!props.enableFileInput) return;
  if (e.dataTransfer?.types?.includes("Files")) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    originalDropActive.value = true;
  }
};

const handleOriginalDragLeave = () => {
  originalDropActive.value = false;
};

const handleOriginalDrop = (e: DragEvent) => {
  e.preventDefault();
  originalDropActive.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file) loadFileToSide(file, "original");
};

const handleModifiedDragOver = (e: DragEvent) => {
  if (!props.enableFileInput) return;
  if (e.dataTransfer?.types?.includes("Files")) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    modifiedDropActive.value = true;
  }
};

const handleModifiedDragLeave = () => {
  modifiedDropActive.value = false;
};

const handleModifiedDrop = (e: DragEvent) => {
  e.preventDefault();
  modifiedDropActive.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file) loadFileToSide(file, "modified");
};

// ==================== 冲突检测（git conflict markers） ====================
const detectConflicts = (text: string): ConflictMarker[] => {
  const markers: ConflictMarker[] = [];
  const lines = text.split("\n");
  let i = 0;
  while (i < lines.length) {
    if (lines[i].startsWith("<<<<<<<")) {
      const startLine = i;
      let separatorLine = -1;
      let endLine = -1;
      let j = i + 1;
      while (j < lines.length) {
        if (lines[j].startsWith("=======") && separatorLine === -1) {
          separatorLine = j;
        } else if (lines[j].startsWith(">>>>>>>")) {
          endLine = j;
          break;
        }
        j++;
      }
      if (separatorLine >= 0 && endLine >= 0) {
        markers.push({
          startLine,
          separatorLine,
          endLine,
          currentContent: lines.slice(startLine + 1, separatorLine).join("\n"),
          incomingContent: lines.slice(separatorLine + 1, endLine).join("\n"),
        });
      }
      i = endLine >= 0 ? endLine + 1 : lines.length;
    } else {
      i++;
    }
  }
  return markers;
};

const refreshConflicts = () => {
  const editor = getModifiedEditor();
  if (!editor) return;
  const text = editor.getValue();
  const markers = detectConflicts(text);
  detectedConflicts.value = markers;
  conflictCount.value = markers.length;
  if (currentConflictIndex.value >= markers.length) {
    currentConflictIndex.value = Math.max(0, markers.length - 1);
  }
  emit(
    "conflictChange",
    markers.length,
    props.conflictMarkers.length || markers.length,
  );
};

// ==================== Diff 变更追踪 ====================
const refreshLineChanges = () => {
  const editor = editorInstance.value;
  if (!editor) return;
  const changes = editor.getLineChanges() || [];
  lineChanges.value = changes;
  changeCount.value = changes.length;
  if (currentChangeIndex.value >= changes.length) {
    currentChangeIndex.value = Math.max(0, changes.length - 1);
  }
  // 同时更新冲突状态
  const gitConflicts = conflictCount.value;
  const total = changes.length + gitConflicts;
  emit("conflictChange", total, total);
};

// 获取原始侧指定行范围的内容
const getOriginalLines = (startLine: number, endLine: number): string => {
  const editor = editorInstance.value;
  if (!editor) return "";
  const model = editor.getModel();
  if (!model) return "";
  const start = Math.max(1, startLine);
  const end = Math.max(1, endLine);
  if (startLine === 0 && endLine === 0) return "";
  const range = new monaco.Range(
    start,
    1,
    end,
    model.original.getLineMaxColumn(end),
  );
  return model.original.getValueInRange(range);
};

// 获取修改侧指定行范围的内容
const getModifiedLines = (startLine: number, endLine: number): string => {
  const editor = editorInstance.value;
  if (!editor) return "";
  const model = editor.getModel();
  if (!model) return "";
  const start = Math.max(1, startLine);
  const end = Math.max(1, endLine);
  if (startLine === 0 && endLine === 0) return "";
  const range = new monaco.Range(
    start,
    1,
    end,
    model.modified.getLineMaxColumn(end),
  );
  return model.modified.getValueInRange(range);
};

// ==================== Diff 统计 ====================
const computeDiffStats = () => {
  const editor = editorInstance.value;
  if (!editor) return;
  const changes = editor.getLineChanges();
  if (!changes) {
    diffStats.value = null;
    return;
  }
  let added = 0,
    removed = 0,
    changed = 0;
  changes.forEach((c) => {
    if (c.originalEndLineNumber === 0) {
      added += c.modifiedEndLineNumber - c.modifiedStartLineNumber + 1;
    } else if (c.modifiedEndLineNumber === 0) {
      removed += c.originalEndLineNumber - c.originalStartLineNumber + 1;
    } else {
      changed += Math.max(
        c.originalEndLineNumber - c.originalStartLineNumber + 1,
        c.modifiedEndLineNumber - c.modifiedStartLineNumber + 1,
      );
    }
  });
  diffStats.value = { added, removed, changed };
};

// ==================== 编辑器初始化 ====================
const initEditor = () => {
  if (!editorContainer.value) return;

  const originalModel = monaco.editor.createModel(
    props.original,
    props.language,
  );
  const modifiedModel = monaco.editor.createModel(
    props.modified,
    props.language,
  );

  const editor = monaco.editor.createDiffEditor(editorContainer.value, {
    theme: props.theme,
    renderSideBySide: renderSideBySide.value,
    readOnly: props.readOnly,
    originalEditable: false,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontSize: 14,
    minimap: { enabled: false },
    renderOverviewRuler: true,
    diffAlgorithm: "advanced",
    enableSplitViewResizing: true,
    ignoreTrimWhitespace: false,
    renderMarginRevertIcon: true,
    useInlineViewWhenSpaceIsLimited: true,
  });

  editor.setModel({ original: originalModel, modified: modifiedModel });
  editorInstance.value = editor;

  // 监听diff变化计算统计
  editor.onDidUpdateDiff(() => {
    computeDiffStats();
    refreshLineChanges();
  });

  // 监听modified编辑器内容变化，自动检测冲突
  const modifiedEd = editor.getModifiedEditor();
  modifiedEd.onDidChangeModelContent(() => {
    refreshConflicts();
  });

  // 初始检测冲突和diff变更
  if (props.conflictMode) {
    const text = modifiedEd.getValue();
    const markers = detectConflicts(text);
    detectedConflicts.value = markers;
    conflictCount.value = markers.length;
    currentConflictIndex.value = 0;
  }
  // 初始获取lineChanges
  nextTick(() => {
    refreshLineChanges();
  });
};

// ==================== 冲突解决 ====================
const getModifiedEditor = (): monaco.editor.ICodeEditor | null => {
  return editorInstance.value?.getModifiedEditor() ?? null;
};

// 优先处理 git conflict markers，否则处理 diff line changes
const getCurrentChange = (): monaco.editor.ILineChange | null => {
  if (lineChanges.value.length === 0) return null;
  return lineChanges.value[currentChangeIndex.value] || null;
};

const navigateToCurrentChange = () => {
  const change = getCurrentChange();
  if (!change) return;
  const editor = getModifiedEditor();
  if (!editor) return;
  const line = change.modifiedStartLineNumber || 1;
  editor.revealLineInCenter(line);
  const endLine =
    change.modifiedEndLineNumber || change.modifiedStartLineNumber || 1;
  editor.setSelection(new monaco.Range(line, 1, endLine, 1));
};

// 用我的 - 保留修改侧内容（对于diff变更就是保持现状，对于git冲突保留current部分）
const acceptCurrentConflict = () => {
  // 优先处理 git conflict markers
  if (conflictCount.value > 0) {
    const marker = detectedConflicts.value[currentConflictIndex.value];
    if (marker) {
      const editor = getModifiedEditor();
      if (!editor) return;
      const range = new monaco.Range(
        marker.startLine + 1,
        1,
        marker.endLine + 1,
        1,
      );
      editor.executeEdits("conflict-resolve", [
        { range, text: marker.currentContent + "\n" },
      ]);
      return;
    }
  }
  // 对于 diff line changes，"用我的" = 保持修改侧不变，跳到下一个
  if (changeCount.value > 0) {
    if (currentChangeIndex.value < changeCount.value - 1) {
      currentChangeIndex.value++;
      navigateToCurrentChange();
    }
  }
};

// 用别人的 - 用原始侧内容替换修改侧
const acceptIncomingConflict = () => {
  // 优先处理 git conflict markers
  if (conflictCount.value > 0) {
    const marker = detectedConflicts.value[currentConflictIndex.value];
    if (marker) {
      const editor = getModifiedEditor();
      if (!editor) return;
      const range = new monaco.Range(
        marker.startLine + 1,
        1,
        marker.endLine + 1,
        1,
      );
      editor.executeEdits("conflict-resolve", [
        { range, text: marker.incomingContent + "\n" },
      ]);
      return;
    }
  }
  // 对于 diff line changes，用原始侧内容替换修改侧
  const change = getCurrentChange();
  if (!change) return;
  const editor = getModifiedEditor();
  if (!editor) return;

  const originalText = getOriginalLines(
    change.originalStartLineNumber,
    change.originalEndLineNumber,
  );

  if (change.modifiedEndLineNumber === 0) {
    // 纯新增行（modified侧没有对应行），在modifiedStartLineNumber处插入original内容
    const range = new monaco.Range(
      change.modifiedStartLineNumber,
      1,
      change.modifiedStartLineNumber,
      1,
    );
    editor.executeEdits("diff-resolve", [{ range, text: originalText + "\n" }]);
  } else if (change.originalEndLineNumber === 0) {
    // 纯删除行（original侧没有对应行），删除modified侧的行
    const range = new monaco.Range(
      change.modifiedStartLineNumber,
      1,
      change.modifiedEndLineNumber,
      editor.getModel()!.getLineMaxColumn(change.modifiedEndLineNumber),
    );
    editor.executeEdits("diff-resolve", [{ range, text: "" }]);
  } else {
    // 修改行，用original替换modified
    const range = new monaco.Range(
      change.modifiedStartLineNumber,
      1,
      change.modifiedEndLineNumber,
      editor.getModel()!.getLineMaxColumn(change.modifiedEndLineNumber),
    );
    editor.executeEdits("diff-resolve", [{ range, text: originalText }]);
  }
};

// 合并 - 保留双方内容
const acceptBothConflict = () => {
  // 优先处理 git conflict markers
  if (conflictCount.value > 0) {
    const marker = detectedConflicts.value[currentConflictIndex.value];
    if (marker) {
      const editor = getModifiedEditor();
      if (!editor) return;
      const range = new monaco.Range(
        marker.startLine + 1,
        1,
        marker.endLine + 1,
        1,
      );
      editor.executeEdits("conflict-resolve", [
        {
          range,
          text: marker.currentContent + "\n" + marker.incomingContent + "\n",
        },
      ]);
      return;
    }
  }
  // 对于 diff line changes，在修改侧内容后追加原始侧内容
  const change = getCurrentChange();
  if (!change) return;
  const editor = getModifiedEditor();
  if (!editor) return;

  const originalText = getOriginalLines(
    change.originalStartLineNumber,
    change.originalEndLineNumber,
  );
  const modifiedText = getModifiedLines(
    change.modifiedStartLineNumber,
    change.modifiedEndLineNumber,
  );

  if (change.modifiedEndLineNumber === 0) {
    // 纯新增行，在modifiedStartLineNumber处追加original
    const range = new monaco.Range(
      change.modifiedStartLineNumber,
      1,
      change.modifiedStartLineNumber,
      1,
    );
    editor.executeEdits("diff-resolve", [{ range, text: originalText + "\n" }]);
  } else if (change.originalEndLineNumber === 0) {
    // 纯删除行，保持modified侧内容（即已删除的内容被恢复）
    // 不做操作，因为"合并"意味着两边都保留，但original侧没有内容
  } else {
    // 修改行，保留modified内容 + 追加original内容
    const range = new monaco.Range(
      change.modifiedStartLineNumber,
      1,
      change.modifiedEndLineNumber,
      editor.getModel()!.getLineMaxColumn(change.modifiedEndLineNumber),
    );
    editor.executeEdits("diff-resolve", [
      { range, text: modifiedText + "\n" + originalText },
    ]);
  }
};

const acceptAllCurrent = () => {
  // git conflict: 全部保留当前
  if (conflictCount.value > 0) {
    const editor = getModifiedEditor();
    if (!editor) return;
    const markers = [...detectedConflicts.value].reverse();
    markers.forEach((marker) => {
      const range = new monaco.Range(
        marker.startLine + 1,
        1,
        marker.endLine + 1,
        1,
      );
      editor.executeEdits("conflict-resolve-all", [
        { range, text: marker.currentContent + "\n" },
      ]);
    });
  }
  // diff changes: 全部保留修改侧 = 不做任何修改
};

const acceptAllIncoming = () => {
  // git conflict: 全部采用传入
  if (conflictCount.value > 0) {
    const editor = getModifiedEditor();
    if (!editor) return;
    const markers = [...detectedConflicts.value].reverse();
    markers.forEach((marker) => {
      const range = new monaco.Range(
        marker.startLine + 1,
        1,
        marker.endLine + 1,
        1,
      );
      editor.executeEdits("conflict-resolve-all", [
        { range, text: marker.incomingContent + "\n" },
      ]);
    });
  }
  // diff changes: 全部用原始侧替换修改侧 = 恢复原始内容
  if (changeCount.value > 0) {
    const editor = getModifiedEditor();
    if (!editor) return;
    const model = editorInstance.value?.getModel();
    if (!model) return;
    // 直接用original内容替换整个modified
    editor.setValue(model.original.getValue());
  }
};

const moveToNextConflict = () => {
  if (currentConflictIndex.value < conflictCount.value - 1) {
    currentConflictIndex.value++;
  }
};

const prevConflict = () => {
  if (currentConflictIndex.value > 0) {
    currentConflictIndex.value--;
    navigateToConflict();
  }
};

const nextConflict = () => {
  if (currentConflictIndex.value < conflictCount.value - 1) {
    currentConflictIndex.value++;
    navigateToConflict();
  }
};

const navigateToConflict = () => {
  const marker = detectedConflicts.value[currentConflictIndex.value];
  if (!marker) return;
  const editor = getModifiedEditor();
  if (!editor) return;
  editor.revealLineInCenter(marker.startLine + 1);
  editor.setSelection(
    new monaco.Range(marker.startLine + 1, 1, marker.endLine + 1, 1),
  );
};

// ==================== 事件处理 ====================
const handleSave = () => {
  const editor = getModifiedEditor();
  if (!editor) return;
  const result = editor.getValue();
  emit("save", result);
  emit("resolve", result);
};

const handleClose = () => {
  emit("close");
};

// ==================== Watchers ====================
watch(renderSideBySide, (val) => {
  const editor = editorInstance.value;
  if (!editor) return;
  editor.updateOptions({ renderSideBySide: val });
});

watch(
  () => props.original,
  (val) => {
    const editor = editorInstance.value;
    if (!editor) return;
    const model = editor.getModel();
    if (model) model.original.setValue(val);
  },
);

watch(
  () => props.modified,
  (val) => {
    const editor = editorInstance.value;
    if (!editor) return;
    const model = editor.getModel();
    if (model) model.modified.setValue(val);
  },
);

watch(
  () => props.language,
  (val) => {
    const editor = editorInstance.value;
    if (!editor) return;
    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model.original, val);
      monaco.editor.setModelLanguage(model.modified, val);
    }
  },
);

watch(
  () => props.theme,
  (val) => {
    monaco.editor.setTheme(val);
  },
);

// ==================== 生命周期 ====================
onMounted(() => {
  nextTick(() => initEditor());
});

onBeforeUnmount(() => {
  const editor = editorInstance.value;
  if (editor) {
    const model = editor.getModel();
    model?.original.dispose();
    model?.modified.dispose();
    editor.dispose();
  }
});

// ==================== 暴露方法 ====================
const getResult = (): string => {
  const editor = getModifiedEditor();
  return editor?.getValue() ?? "";
};

const getDiffEditor = () => editorInstance.value;

defineExpose({
  getResult,
  getDiffEditor,
  acceptCurrentConflict,
  acceptIncomingConflict,
  acceptBothConflict,
  acceptAllCurrent,
  acceptAllIncoming,
  prevConflict,
  nextConflict,
  refreshConflicts,
  refreshLineChanges,
  conflictCount,
  detectedConflicts,
  lineChanges,
  changeCount,
  currentChangeIndex,
  navigateToCurrentChange,
});
</script>

<style lang="scss" scoped>
/* ==================== 变量 ==================== */
$diff-bg: #1e1e1e;
$diff-bg-light: #ffffff;
$diff-toolbar-bg: #252526;
$diff-toolbar-bg-light: #f3f3f3;
$diff-border: #3c3c3c;
$diff-border-light: #e0e0e0;
$diff-fg: #cccccc;
$diff-fg-light: #333333;
$diff-fg-dim: #858585;
$diff-fg-dim-light: #888888;
$diff-accent: #007acc;
$diff-accent-hover: #1a8ad4;
$diff-danger: #f14c4c;
$diff-success: #73c991;
$diff-warning: #cca700;
$diff-conflict-bg: rgba(241, 76, 76, 0.12);
$diff-conflict-border: #f14c4c;

/* ==================== 主容器 ==================== */
.sh-diff-editor {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid $diff-border-light;
  border-radius: 6px;
  overflow: hidden;
  background: $diff-bg-light;
  color: $diff-fg-light;
  font-family:
    "Segoe UI",
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 13px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  &--dark {
    border-color: $diff-border;
    background: $diff-bg;
    color: $diff-fg;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }
}

/* ==================== 工具栏 ==================== */
.sh-diff-toolbar {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 40px;
  background: $diff-toolbar-bg-light;
  border-bottom: 1px solid $diff-border-light;
  gap: 8px;
  flex-shrink: 0;

  .sh-diff-editor--dark & {
    background: $diff-toolbar-bg;
    border-bottom-color: $diff-border;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__center {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: flex-end;
  }

  &__conflict-badge {
    display: inline-flex;
    align-items: center;
    padding: 1px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    background: $diff-conflict-bg;
    color: $diff-conflict-border;
    border: 1px solid rgba(241, 76, 76, 0.3);
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: 1px solid transparent;
    color: $diff-fg-dim-light;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    transition: all 0.15s ease;

    .sh-diff-editor--dark & {
      color: $diff-fg-dim;
    }

    &:hover {
      background: rgba(0, 122, 204, 0.1);
      color: $diff-accent;
    }

    &.active {
      background: rgba(0, 122, 204, 0.15);
      color: $diff-accent;
      border-color: rgba(0, 122, 204, 0.3);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &--accept-all-current,
    &--accept-all-incoming {
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 3px;
    }

    &--accept-all-current {
      background: rgba(115, 201, 145, 0.1);
      color: $diff-success;
      border-color: rgba(115, 201, 145, 0.3);

      &:hover {
        background: rgba(115, 201, 145, 0.2);
      }
    }

    &--accept-all-incoming {
      background: rgba(0, 122, 204, 0.1);
      color: $diff-accent;
      border-color: rgba(0, 122, 204, 0.3);

      &:hover {
        background: rgba(0, 122, 204, 0.2);
      }
    }
  }

  &__sep {
    width: 1px;
    height: 16px;
    background: $diff-border-light;
    margin: 0 4px;

    .sh-diff-editor--dark & {
      background: $diff-border;
    }
  }

  &__stats {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;

    .stat-add {
      color: $diff-success;
    }

    .stat-del {
      color: $diff-danger;
    }

    .stat-chg {
      color: $diff-warning;
    }
  }
}

/* ==================== 冲突操作栏 ==================== */
.sh-diff-conflict-bar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: $diff-conflict-bg;
  border-bottom: 1px solid rgba(241, 76, 76, 0.2);
  gap: 12px;
  flex-shrink: 0;

  &__info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: $diff-conflict-border;
    font-weight: 600;
    white-space: nowrap;

    .conflict-info-icon {
      color: $diff-warning;
      flex-shrink: 0;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
  }

  &__nav {
    display: flex;
    gap: 2px;
    margin-left: auto;
  }
}

.conflict-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.15s ease;
  white-space: nowrap;

  &--current {
    background: rgba(115, 201, 145, 0.1);
    color: $diff-success;
    border-color: rgba(115, 201, 145, 0.4);

    &:hover {
      background: rgba(115, 201, 145, 0.2);
    }
  }

  &--incoming {
    background: rgba(0, 122, 204, 0.1);
    color: $diff-accent;
    border-color: rgba(0, 122, 204, 0.4);

    &:hover {
      background: rgba(0, 122, 204, 0.2);
    }
  }

  &--both {
    background: rgba(204, 167, 0, 0.1);
    color: $diff-warning;
    border-color: rgba(204, 167, 0, 0.4);

    &:hover {
      background: rgba(204, 167, 0, 0.2);
    }
  }
}

.conflict-nav-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $diff-border-light;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  color: $diff-fg-light;
  transition: all 0.15s ease;

  .sh-diff-editor--dark & {
    border-color: $diff-border;
    background: rgba(255, 255, 255, 0.05);
    color: $diff-fg;
  }

  &:hover:not(:disabled) {
    background: rgba(0, 122, 204, 0.1);
    color: $diff-accent;
    border-color: rgba(0, 122, 204, 0.3);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

/* ==================== Monaco 容器 ==================== */
.sh-diff-monaco {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ==================== 底部操作栏 ==================== */
.sh-diff-footer {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 42px;
  background: $diff-toolbar-bg-light;
  border-top: 1px solid $diff-border-light;
  flex-shrink: 0;

  .sh-diff-editor--dark & {
    background: $diff-toolbar-bg;
    border-top-color: $diff-border;
  }

  &__left,
  &__right {
    flex: 1;
    display: flex;
    align-items: center;
  }

  &__right {
    justify-content: flex-end;
  }

  &__center {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__label {
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 3px;
    letter-spacing: 0.3px;

    &.original-label {
      background: rgba(241, 76, 76, 0.08);
      color: $diff-danger;
      border: 1px solid rgba(241, 76, 76, 0.2);
    }

    &.modified-label {
      background: rgba(115, 201, 145, 0.08);
      color: $diff-success;
      border: 1px solid rgba(115, 201, 145, 0.2);
    }
  }

  &__btn {
    padding: 5px 16px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid $diff-border-light;
    background: rgba(255, 255, 255, 0.9);
    color: $diff-fg-light;
    transition: all 0.15s ease;

    .sh-diff-editor--dark & {
      border-color: $diff-border;
      background: rgba(255, 255, 255, 0.06);
      color: $diff-fg;
    }

    &:hover {
      border-color: $diff-accent;
      color: $diff-accent;
    }

    &--primary {
      background: $diff-accent;
      color: #fff;
      border-color: $diff-accent;

      &:hover {
        background: $diff-accent-hover;
        border-color: $diff-accent-hover;
        color: #fff;
      }
    }
  }
}

/* ==================== 图标 ==================== */
.sh-diff-icon {
  opacity: 0.7;
  flex-shrink: 0;
}

/* ==================== 文件上传按钮 ==================== */
.sh-diff-toolbar__btn--file {
  font-size: 11px !important;
  padding: 3px 10px !important;
  border-radius: 3px !important;
  background: rgba(0, 122, 204, 0.06) !important;
  border-color: rgba(0, 122, 204, 0.2) !important;
  color: $diff-accent !important;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: rgba(0, 122, 204, 0.15) !important;
    border-color: rgba(0, 122, 204, 0.4) !important;
  }

  svg {
    flex-shrink: 0;
  }
}

/* ==================== 拖拽区域 ==================== */
.sh-diff-footer__label {
  &.drop-active {
    border: 2px dashed $diff-accent !important;
    background: rgba(0, 122, 204, 0.1) !important;
    color: $diff-accent !important;
  }

  .drop-hint {
    display: block;
    font-size: 10px;
    opacity: 0.5;
    font-weight: 400;
    margin-top: 2px;
    font-style: italic;
  }
}

.sh-diff-editor--dark {
  .sh-diff-footer__label.drop-active {
    background: rgba(0, 122, 204, 0.15) !important;
  }
}

.sh-diff-footer__label.file-input-active {
  cursor: pointer;
}
</style>
