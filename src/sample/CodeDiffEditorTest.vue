<script setup lang="ts" name="CodeDiffEditorTest">
import { computed, ref } from "vue";
import { StarHorseDiffEditor } from "@/components/system/code-editor/index";
import { i18n } from "@/lang/index";
import { ElMessage } from "element-plus";

const diffVisible = ref(false);
const originalContent = ref("");
const modifiedContent = ref("");
const originalFileName = ref("");
const modifiedFileName = ref("");
const diffLanguage = ref("plaintext");
const conflictMode = ref(true);
const remainingChanges = ref(0);
const totalChanges = ref(0);
const resolvedContent = ref("");

const originalInputRef = ref<HTMLInputElement>();
const modifiedInputRef = ref<HTMLInputElement>();
const diffEditorRef = ref<InstanceType<typeof StarHorseDiffEditor>>();

const hasChanges = computed(() => remainingChanges.value > 0);
const allResolved = computed(
  () =>
    diffVisible.value && totalChanges.value > 0 && remainingChanges.value === 0,
);

const detectLang = (name: string): string => {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    jsx: "javascript",
    tsx: "typescript",
    vue: "html",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    less: "less",
    json: "json",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    md: "markdown",
    py: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    go: "go",
    rs: "rust",
    sql: "sql",
    sh: "shell",
    bash: "shell",
    txt: "plaintext",
    log: "plaintext",
  };
  return map[ext] || "plaintext";
};

const handleOriginalFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  originalFileName.value = file.name;
  diffLanguage.value = detectLang(file.name);
  const reader = new FileReader();
  reader.onload = () => {
    originalContent.value = reader.result as string;
  };
  reader.readAsText(file);
};

const handleModifiedFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  modifiedFileName.value = file.name;
  diffLanguage.value = detectLang(file.name);
  const reader = new FileReader();
  reader.onload = () => {
    modifiedContent.value = reader.result as string;
  };
  reader.readAsText(file);
};

const startDiff = () => {
  if (!originalContent.value && !modifiedContent.value) return;
  diffVisible.value = true;
  remainingChanges.value = 0;
  totalChanges.value = 0;
};

// 差异状态变化
const handleConflictChange = (remaining: number, total: number) => {
  remainingChanges.value = remaining;
  totalChanges.value = total;
};

// 用我的 - 保留修改侧内容
const handleUseMine = () => {
  diffEditorRef.value?.acceptCurrentConflict();
};

// 用别人的 - 用原始侧内容替换
const handleUseTheirs = () => {
  diffEditorRef.value?.acceptIncomingConflict();
};

// 合并 - 保留双方内容
const handleMerge = () => {
  diffEditorRef.value?.acceptBothConflict();
};

// 上一个差异
const handlePrevChange = () => {
  diffEditorRef.value?.prevConflict();
};

// 下一个差异
const handleNextChange = () => {
  diffEditorRef.value?.nextConflict();
};

// 提交 - 解决差异后提交文件
const handleSubmit = () => {
  const editor = diffEditorRef.value;
  if (!editor) return;

  // 刷新差异状态
  editor.refreshLineChanges();
  editor.refreshConflicts();

  const text = editor.getResult();
  const stillHasConflicts = detectConflictMarkers(text);

  // 检查是否还有diff变更
  const changes = editor.lineChanges || [];
  const stillHasChanges = changes.length > 0;

  if (stillHasConflicts) {
    ElMessage.warning(i18n("diff.hasUnresolved") as string);
    return;
  }

  if (stillHasChanges) {
    ElMessage.warning(i18n("diff.hasUnresolved") as string);
    return;
  }

  resolvedContent.value = text;
  modifiedContent.value = text;
  diffVisible.value = false;
  ElMessage.success(i18n("diff.conflictResolvedSuccess") as string);
};

const detectConflictMarkers = (text: string): boolean => {
  return (
    text.includes("<<<<<<<") &&
    text.includes(">>>>>>>") &&
    text.includes("=======")
  );
};

const handleDiffSave = (result: string) => {
  modifiedContent.value = result;
  resolvedContent.value = result;
  diffVisible.value = false;
};

const handleDiffClose = () => {
  diffVisible.value = false;
};
</script>

<template>
  <div class="flex flex-col h-full p-4 gap-4">
    <h3 class="text-lg font-semibold mb-2">{{ i18n("diff.title") }}</h3>

    <!-- 文件上传区域 -->
    <div class="flex gap-4">
      <!-- 原始文件 -->
      <div class="flex-1 border rounded p-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="font-medium">{{ i18n("diff.original") }}</span>
          <span v-if="originalFileName" class="text-sm text-gray-500">{{
            originalFileName
          }}</span>
        </div>
        <input
          ref="originalInputRef"
          type="file"
          class="hidden"
          @change="handleOriginalFile"
        />
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          @click="originalInputRef?.click()"
        >
          选择文件
        </button>
        <div v-if="originalContent" class="text-xs text-gray-400 mt-1">
          {{ originalContent.length }} 字符
        </div>
      </div>

      <!-- 修改文件 -->
      <div class="flex-1 border rounded p-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="font-medium">{{ i18n("diff.modified") }}</span>
          <span v-if="modifiedFileName" class="text-sm text-gray-500">{{
            modifiedFileName
          }}</span>
        </div>
        <input
          ref="modifiedInputRef"
          type="file"
          class="hidden"
          @change="handleModifiedFile"
        />
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          @click="modifiedInputRef?.click()"
        >
          选择文件
        </button>
        <div v-if="modifiedContent" class="text-xs text-gray-400 mt-1">
          {{ modifiedContent.length }} 字符
        </div>
      </div>
    </div>

    <!-- 开始对比按钮 -->
    <div class="flex justify-center">
      <button
        class="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!originalContent && !modifiedContent"
        @click="startDiff"
      >
        开始对比
      </button>
    </div>

    <!-- Diff 编辑器 -->
    <div v-if="diffVisible" class="flex-1 min-h-0 relative flex flex-col gap-2">
      <!-- 冲突解决操作栏 -->
      <div class="flex items-center gap-3 p-3 bg-gray-50 border rounded">
        <span class="text-sm font-medium text-gray-700">差异解决：</span>
        <button
          class="px-4 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!hasChanges"
          @click="handleUseMine"
          title="保留修改侧（右侧）的内容"
        >
          {{ i18n("diff.useMine") }}
        </button>
        <button
          class="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!hasChanges"
          @click="handleUseTheirs"
          title="用原始侧（左侧）的内容替换"
        >
          {{ i18n("diff.useTheirs") }}
        </button>
        <button
          class="px-4 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!hasChanges"
          @click="handleMerge"
          title="保留双方内容"
        >
          {{ i18n("diff.merge") }}
        </button>

        <span class="text-gray-300 mx-1">|</span>

        <!-- 导航按钮 -->
        <button
          class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!hasChanges"
          @click="handlePrevChange"
          title="上一个差异"
        >
          ↑
        </button>
        <button
          class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!hasChanges"
          @click="handleNextChange"
          title="下一个差异"
        >
          ↓
        </button>

        <div class="flex-1" />

        <!-- 差异状态 -->
        <span
          v-if="totalChanges > 0"
          class="text-sm"
          :class="hasChanges ? 'text-red-500' : 'text-green-500'"
        >
          <template v-if="hasChanges">
            剩余 {{ remainingChanges }} 处差异
          </template>
          <template v-else>
            {{ i18n("diff.allResolved") }}
          </template>
        </span>

        <!-- 提交按钮 -->
        <button
          class="px-4 py-1.5 rounded text-sm transition"
          :class="
            allResolved
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          "
          :disabled="!allResolved"
          @click="handleSubmit"
        >
          {{ i18n("diff.submit") }}
        </button>
      </div>

      <!-- Diff编辑器 -->
      <div class="flex-1 min-h-0">
        <StarHorseDiffEditor
          ref="diffEditorRef"
          :original="originalContent"
          :modified="modifiedContent"
          :language="diffLanguage"
          :title="i18n('diff.title')"
          :original-label="originalFileName || i18n('diff.original')"
          :modified-label="modifiedFileName || i18n('diff.modified')"
          :conflict-mode="conflictMode"
          theme="vs-dark"
          height="100%"
          @save="handleDiffSave"
          @close="handleDiffClose"
          @conflict-change="handleConflictChange"
        />
      </div>
    </div>

    <!-- 已解决的内容预览 -->
    <div v-if="resolvedContent && !diffVisible" class="border rounded p-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-green-600">{{
          i18n("diff.resolved")
        }}</span>
        <span class="text-xs text-gray-400"
          >{{ resolvedContent.length }} 字符</span
        >
      </div>
      <pre
        class="text-xs bg-gray-50 p-2 rounded max-h-40 overflow-auto whitespace-pre-wrap"
        >{{ resolvedContent }}</pre>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
