<script setup lang="ts" name="DocPreviewDialog">
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import type { DocTemplateDesigner } from "../composables/useDocTemplateDesigner";
import { renderTemplateContent } from "../constants";
import { StarHorsePanel } from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  designer: DocTemplateDesigner;
  dialogType?: "dialog" | "drawer";
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

/** 表单值 */
const formValues = ref<Record<string, any>>({});

/** 初始化表单值 */
const initFormValues = () => {
  const values: Record<string, any> = {};
  for (const v of props.designer.state.variables) {
    values[v.name] = v.defaultValue ?? "";
  }
  formValues.value = values;
};

/** 渲染后的内容 */
const renderedContent = computed(() =>
  renderTemplateContent(props.designer.state.content, formValues.value),
);

const handleOpened = () => {
  initFormValues();
};

const handleExport = () => {
  const blob = new Blob([renderedContent.value], {
    type: "text/html;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${props.designer.state.name || "document"}.html`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<template>
  <star-horse-panel
    :type="dialogType"
    v-model="innerVisible"
    :title="i18n('doctemplate.preview.title')"
    box-width="900px"
    :userAction="true"
    @open="handleOpened"
  >
    <div class="doc-preview-dialog">
      <div class="preview-layout">
        <!-- 左侧：变量填写 -->
        <div class="var-form">
          <div class="form-title">
            {{ i18n("doctemplate.preview.fillVars") }}
          </div>
          <el-form label-width="100px">
            <el-form-item
              v-for="v in designer.state.variables"
              :key="v.id"
              :label="v.label"
              :required="v.required"
            >
              <el-input
                v-if="v.type === 'string'"
                v-model="formValues[v.name]"
              />
              <el-input-number
                v-else-if="v.type === 'number'"
                v-model="formValues[v.name]"
                style="width: 100%"
              />
              <el-date-picker
                v-else-if="v.type === 'date'"
                v-model="formValues[v.name]"
                type="date"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
              <el-switch
                v-else-if="v.type === 'boolean'"
                v-model="formValues[v.name]"
              />
              <el-select
                v-else-if="v.type === 'select'"
                v-model="formValues[v.name]"
                style="width: 100%"
              >
                <el-option
                  v-for="opt in v.options"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
              <el-input v-else v-model="formValues[v.name]" />
            </el-form-item>
            <el-form-item v-if="designer.state.variables.length === 0">
              <span class="empty-tip">{{
                i18n("doctemplate.preview.noVars")
              }}</span>
            </el-form-item>
          </el-form>
        </div>
        <!-- 右侧：预览 -->
        <div class="preview-content">
          <div class="content-toolbar">
            <el-button @click="handleExport">
              <el-icon>
                <Download />
              </el-icon>
              {{ i18n("doctemplate.preview.export") }}
            </el-button>
          </div>
          <div class="content-body" v-html="renderedContent" />
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="innerVisible = false">{{
        i18n("dialog.close")
      }}</el-button>
    </template>
  </star-horse-panel>
</template>

<script lang="ts">
import { Download } from "@element-plus/icons-vue";

export default { components: { Download } };
</script>

<style lang="scss" scoped>
.doc-preview-dialog {
  height: 70vh;

  .preview-layout {
    display: flex;
    gap: 12px;
    height: 100%;

    .var-form {
      width: 320px;
      border-right: 1px solid var(--el-border-color);
      padding-right: 12px;
      overflow: auto;

      .form-title {
        font-weight: 600;
        margin-bottom: 8px;
      }

      .empty-tip {
        color: var(--el-text-color-placeholder);
        font-size: 12px;
      }
    }

    .preview-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .content-toolbar {
        padding: 4px 0 8px;
      }

      .content-body {
        flex: 1;
        overflow: auto;
        padding: 16px;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        background: #ffffff;
      }
    }
  }
}
</style>
