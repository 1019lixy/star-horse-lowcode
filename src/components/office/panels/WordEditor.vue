<script setup lang="ts" name="WordEditor">
import {onMounted, ref, shallowRef, watch} from "vue";
import {ElMessage} from "element-plus";
import {i18n} from "@/lang";
import {ShSvgIcon} from "@/components/shared";
import {OFFICE_FONT_FAMILY_PRESETS, OFFICE_FONT_SIZE_PRESETS, OFFICE_TEXT_ALIGN_PRESETS,} from "../constants";
import type {OfficeTextAlign, WordContent} from "../types";

const props = defineProps<{
  content: WordContent;
}>();

const emit = defineEmits<{
  (e: "update", content: WordContent): void;
}>();

const editorRef = shallowRef<HTMLDivElement | null>(null);
/** 当前字体 */
const fontFamily = ref<string>("Microsoft YaHei");
/** 当前字号 */
const fontSize = ref<number>(14);
/** 当前文字颜色 */
const color = ref<string>("#333333");
/** 当前背景色 */
const bgColor = ref<string>("#FFFFFF");
/** 当前对齐方式 */
const textAlign = ref<OfficeTextAlign>("left");

/** 表格对话框 */
const tableDialogVisible = ref(false);
const tableRows = ref(3);
const tableCols = ref(3);
/** 图片对话框 */
const imageDialogVisible = ref(false);
const imageUrl = ref("");

/** 防止 oninput 回环 */
let suppressUpdate = false;

/** 应用富文本命令（execCommand） */
const execCmd = (cmd: string, value?: string) => {
  document.execCommand(cmd, false, value);
  editorRef.value?.focus();
  handleInput();
};

/** 应用段落格式（H1/H2/H3/P） */
const applyBlock = (tag: "H1" | "H2" | "H3" | "P" | "BLOCKQUOTE") => {
  if (tag === "BLOCKQUOTE") {
    execCmd("formatBlock", "blockquote");
  } else {
    execCmd("formatBlock", tag.toLowerCase());
  }
};

/** 应用列表 */
const applyList = (ordered: boolean) => {
  execCmd(ordered ? "insertOrderedList" : "insertUnorderedList");
};

/** 应用对齐 */
const applyAlign = (align: OfficeTextAlign) => {
  textAlign.value = align;
  const cmdMap: Record<OfficeTextAlign, string> = {
    left: "justifyLeft",
    center: "justifyCenter",
    right: "justifyRight",
    justify: "justifyFull",
  };
  execCmd(cmdMap[align]);
};

/** 应用字体 */
const applyFontFamily = (v: string) => {
  fontFamily.value = v;
  execCmd("fontName", v);
};

/** 应用字号（execCommand fontSize 接收 1-7，这里直接用 CSS） */
const applyFontSize = (v: number) => {
  fontSize.value = v;
  // 使用 formatBlock + 内联样式不可行，用 span 包裹
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  if (range.collapsed) return;
  const span = document.createElement("span");
  span.style.fontSize = `${v}px`;
  try {
    range.surroundContents(span);
  } catch {
    // 跨多节点时回退到 execCommand
    document.execCommand("fontSize", false, "4");
  }
  handleInput();
};

/** 应用文字颜色 */
const applyColor = (v: string) => {
  color.value = v;
  execCmd("foreColor", v);
};

/** 应用背景色 */
const applyBgColor = (v: string) => {
  bgColor.value = v;
  execCmd("hiliteColor", v);
};

/** 清除格式 */
const clearFormat = () => {
  execCmd("removeFormat");
  execCmd("formatBlock", "p");
};

/** 插入表格 */
const handleInsertTable = () => {
  const rows = tableRows.value;
  const cols = tableCols.value;
  let html = '<table style="border-collapse:collapse;width:100%;margin:8px 0;">';
  for (let r = 0; r < rows; r++) {
    html += "<tr>";
    for (let c = 0; c < cols; c++) {
      html += '<td style="border:1px solid #ddd;padding:6px;min-width:60px;">&nbsp;</td>';
    }
    html += "</tr>";
  }
  html += "</table>";
  document.execCommand("insertHTML", false, html);
  tableDialogVisible.value = false;
  handleInput();
};

/** 插入图片 */
const handleInsertImage = () => {
  const url = imageUrl.value.trim();
  if (!url) {
    ElMessage.warning(i18n("office.word.image.placeholder"));
    return;
  }
  document.execCommand("insertHTML", false, `<img src="${url}" style="max-width:100%;"/>`);
  imageDialogVisible.value = false;
  imageUrl.value = "";
  handleInput();
};

/** 输入事件：同步到父组件 */
const handleInput = () => {
  if (suppressUpdate) return;
  const html = editorRef.value?.innerHTML ?? "";
  emit("update", {html});
};

/** 外部 content 变化时同步到编辑器 */
watch(
    () => props.content,
    (next) => {
      if (!editorRef.value) return;
      if (next?.html === editorRef.value.innerHTML) return;
      suppressUpdate = true;
      editorRef.value.innerHTML = next?.html ?? "";
      suppressUpdate = false;
    },
);

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = props.content?.html ?? "<p><br></p>";
  }
});

/** 对齐方式图标映射 */
const alignIconMap: Record<OfficeTextAlign, string> = {
  left: "align-left",
  center: "align-center",
  right: "align-right",
  justify: "alignJustify",
};
</script>

<template>
  <div class="word-editor">
    <div class="word-toolbar">
      <div class="tb-group">
        <el-select
            :model-value="fontFamily"
            style="width: 130px !important;"
            @change="(v: string | number | boolean | object | undefined) => applyFontFamily(String(v))"
        >
          <el-option
              v-for="f in OFFICE_FONT_FAMILY_PRESETS"
              :key="f.value"
              :label="f.label"
              :value="f.value"
          />
        </el-select>
        <el-select
            :model-value="fontSize"
            style="width: 80px"
            @change="(v: string | number | boolean | object | undefined) => applyFontSize(Number(v))"
        >
          <el-option
              v-for="s in OFFICE_FONT_SIZE_PRESETS"
              :key="s.value"
              :label="s.label"
              :value="s.value"
          />
        </el-select>
      </div>
      <div class="tb-divider"></div>
      <div class="tb-group">
        <el-tooltip :content="i18n('office.word.bold')" :show-after="500">
          <el-button class="fmt-btn" @click="execCmd('bold')">
            <span class="fmt-text" style="font-weight: 700;">B</span>
          </el-button>
        </el-tooltip>
        <el-tooltip :content="i18n('office.word.italic')" :show-after="500">
          <el-button class="fmt-btn" @click="execCmd('italic')">
            <span class="fmt-text" style="font-style: italic;">I</span>
          </el-button>
        </el-tooltip>
        <el-tooltip :content="i18n('office.word.underline')" :show-after="500">
          <el-button class="fmt-btn" @click="execCmd('underline')">
            <span class="fmt-text" style="text-decoration: underline;">U</span>
          </el-button>
        </el-tooltip>
        <el-tooltip :content="i18n('office.word.strikethrough')" :show-after="500">
          <el-button class="fmt-btn" @click="execCmd('strikeThrough')">
            <span class="fmt-text" style="text-decoration: line-through;">S</span>
          </el-button>
        </el-tooltip>
      </div>
      <div class="tb-divider"></div>
      <div class="tb-group">
        <el-color-picker :model-value="color" @change="applyColor"/>
        <el-color-picker :model-value="bgColor" @change="applyBgColor"/>
      </div>
      <div class="tb-divider"></div>
      <div class="tb-group">
        <el-tooltip :content="i18n('office.word.h1')" :show-after="500">
          <el-button @click="applyBlock('H1')">H1</el-button>
        </el-tooltip>
        <el-tooltip :content="i18n('office.word.h2')" :show-after="500">
          <el-button @click="applyBlock('H2')">H2</el-button>
        </el-tooltip>
        <el-tooltip :content="i18n('office.word.h3')" :show-after="500">
          <el-button @click="applyBlock('H3')">H3</el-button>
        </el-tooltip>
        <el-tooltip :content="i18n('office.word.paragraph')" :show-after="500">
          <el-button @click="applyBlock('P')">P</el-button>
        </el-tooltip>
        <el-tooltip :content="i18n('office.word.quote')" :show-after="500">
          <el-button @click="applyBlock('BLOCKQUOTE')">
            <ShSvgIcon name="quote" size="14px"/>
          </el-button>
        </el-tooltip>
      </div>
      <div class="tb-divider"></div>
      <div class="tb-group">
        <el-tooltip
            v-for="a in OFFICE_TEXT_ALIGN_PRESETS"
            :key="a.value"
            :content="a.label"
            :show-after="500"
        >
          <el-button
              :type="textAlign === a.value ? 'primary' : 'default'"
              @click="applyAlign(a.value)"
          >
            <ShSvgIcon :name="alignIconMap[a.value]" size="14px"/>
          </el-button>
        </el-tooltip>
      </div>
      <div class="tb-divider"></div>
      <div class="tb-group">
        <el-tooltip :content="i18n('office.word.ul')" :show-after="500">
          <el-button @click="applyList(false)">
            <ShSvgIcon name="ul" size="14px"/>
          </el-button>
        </el-tooltip>
        <el-tooltip :content="i18n('office.word.ol')" :show-after="500">
          <el-button @click="applyList(true)">
            <ShSvgIcon name="ol" size="14px"/>
          </el-button>
        </el-tooltip>
        <el-tooltip :content="i18n('office.word.insertTable')" :show-after="500">
          <el-button @click="tableDialogVisible = true">
            <ShSvgIcon name="table" size="14px"/>
          </el-button>
        </el-tooltip>
        <el-tooltip :content="i18n('office.word.insertImage')" :show-after="500">
          <el-button @click="imageDialogVisible = true">
            <ShSvgIcon name="image" size="14px"/>
          </el-button>
        </el-tooltip>
        <el-tooltip :content="i18n('office.word.clearFormat')" :show-after="500">
          <el-button @click="clearFormat">
            <ShSvgIcon name="clearFormat" size="14px"/>
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="word-body">
      <div
          ref="editorRef"
          class="word-content"
          contenteditable="true"
          @input="handleInput"
      ></div>
    </div>
    <!-- 表格插入弹窗 -->
    <el-dialog
        v-model="tableDialogVisible"
        :title="i18n('office.word.insertTable')"
        width="320px"
        append-to-body
    >
      <el-form label-width="80px">
        <el-form-item :label="i18n('office.word.table.rows')">
          <el-input-number v-model="tableRows" :min="1" :max="20"/>
        </el-form-item>
        <el-form-item :label="i18n('office.word.table.cols')">
          <el-input-number v-model="tableCols" :min="1" :max="20"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="tableDialogVisible = false">{{ i18n("dialog.close") }}</el-button>
        <el-button type="primary" @click="handleInsertTable">
          {{ i18n("office.word.table.confirm") }}
        </el-button>
      </template>
    </el-dialog>
    <!-- 图片插入弹窗 -->
    <el-dialog
        v-model="imageDialogVisible"
        :title="i18n('office.word.insertImage')"
        width="420px"
        append-to-body
    >
      <el-form>
        <el-form-item :label="i18n('office.word.image.url')">
          <el-input v-model="imageUrl" :placeholder="i18n('office.word.image.placeholder')"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="imageDialogVisible = false">{{ i18n("dialog.close") }}</el-button>
        <el-button type="primary" @click="handleInsertImage">
          {{ i18n("office.word.table.confirm") }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>


<style lang="scss" scoped>
.word-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;

  .word-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    padding: 6px 8px;
    background: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color-lighter);

    .tb-group {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .tb-divider {
      width: 1px;
      height: 18px;
      background: var(--el-border-color);
      margin: 0 2px;
    }

    .fmt-btn {
      padding: 0 8px;

      .fmt-text {
        font-size: 14px;
        font-family: "Times New Roman", serif;
        display: inline-block;
        min-width: 14px;
        text-align: center;
      }
    }
  }

  .word-body {
    flex: 1;
    overflow: auto;
    padding: 16px;
    background: #f5f5f5;

    .word-content {
      min-height: 600px;
      background: #fff;
      padding: 24px 32px;
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      outline: none;
      font-size: 14px;
      line-height: 1.7;

      :deep(h1) {
        font-size: 28px;
        margin: 12px 0 8px;
      }

      :deep(h2) {
        font-size: 22px;
        margin: 10px 0 6px;
      }

      :deep(h3) {
        font-size: 18px;
        margin: 8px 0 4px;
      }

      :deep(blockquote) {
        border-left: 4px solid #409eff;
        padding-left: 12px;
        margin: 8px 0;
        color: #666;
      }

      :deep(table) {
        width: 100%;
        border-collapse: collapse;
      }

      :deep(td) {
        border: 1px solid #ddd;
        padding: 6px;
        min-width: 60px;
      }

      :deep(img) {
        max-width: 100%;
      }
    }
  }
}
</style>
