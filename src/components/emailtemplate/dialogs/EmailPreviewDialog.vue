<script setup lang="ts" name="EmailPreviewDialog">
import {computed, ref} from "vue";
import {ElMessage} from "element-plus";
import {i18n} from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import type {EmailTemplateDesigner} from "../composables/useEmailTemplateDesigner";
import {renderEmailContent} from "../constants";
import {StarHorsePanel} from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  designer: EmailTemplateDesigner;
  dialogType?:"dialog"|"drawer";
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
  (e: "send-test", to: string, subject: string, html: string): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

/** 变量表单值 */
const formValues = ref<Record<string, any>>({});
/** 测试收件人 */
const testTo = ref("");

const initFormValues = () => {
  const values: Record<string, any> = {};
  for (const v of props.designer.state.variables) {
    values[v.name] = v.defaultValue ?? "";
  }
  formValues.value = values;
  testTo.value = "";
};

/** 渲染后的主题 */
const renderedSubject = computed(() =>
    renderEmailContent(props.designer.state.subject, formValues.value),
);

/** 渲染后的内容 */
const renderedContent = computed(() =>
    renderEmailContent(props.designer.state.content, formValues.value),
);

const handleOpened = () => {
  initFormValues();
};

const handleExport = () => {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${renderedSubject.value}</title></head><body>${renderedContent.value}</body></html>`;
  const blob = new Blob([html], {type: "text/html;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${props.designer.state.name || "email"}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

const handleSendTest = () => {
  if (!testTo.value) {
    ElMessage.warning(i18n("emailtemplate.preview.inputTo"));
    return;
  }
  emit("send-test", testTo.value, renderedSubject.value, renderedContent.value);
  ElMessage.success(i18n("emailtemplate.preview.sendTestOk"));
  innerVisible.value = false;
};
</script>

<template>
  <star-horse-panel
      :type="dialogType"
      v-model="innerVisible"
      :title="i18n('emailtemplate.preview.title')"
      box-width="960px"
      :self-func="true"
      @open="handleOpened"
  >
    <div class="email-preview-dialog">
      <div class="preview-layout">
        <!-- 左侧：变量填写 + 测试收件人 -->
        <div class="var-form">
          <div class="form-title">{{ i18n("emailtemplate.preview.fillVars") }}</div>
          <el-form label-width="100px">
            <el-form-item :label="i18n('emailtemplate.preview.testTo')">
              <el-input v-model="testTo" :placeholder="i18n('emailtemplate.preview.testToPlaceholder')"/>
            </el-form-item>
            <el-form-item
                v-for="v in designer.state.variables"
                :key="v.id"
                :label="v.label"
            >
              <el-input v-model="formValues[v.name]"/>
            </el-form-item>
            <el-form-item v-if="designer.state.variables.length === 0">
              <span class="empty-tip">{{ i18n("emailtemplate.preview.noVars") }}</span>
            </el-form-item>
          </el-form>
        </div>
        <!-- 右侧：邮件预览 -->
        <div class="preview-content">
          <div class="content-toolbar">
            <el-button @click="handleExport">
              <el-icon>
                <Download/>
              </el-icon>
              {{ i18n("emailtemplate.preview.export") }}
            </el-button>
            <el-button type="primary" @click="handleSendTest">
              <el-icon>
                <Promotion/>
              </el-icon>
              {{ i18n("emailtemplate.preview.sendTest") }}
            </el-button>
          </div>
          <div class="email-header">
            <div class="header-row">
              <span class="header-label">{{ i18n("emailtemplate.template.subject") }}:</span>
              <span class="header-value">{{ renderedSubject }}</span>
            </div>
          </div>
          <div class="content-body" v-html="renderedContent"/>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="innerVisible = false">{{ i18n("dialog.close") }}</el-button>
    </template>
  </star-horse-panel>
</template>

<script lang="ts">
import {Download, Promotion} from "@element-plus/icons-vue";

export default {components: {Download, Promotion}};
</script>

<style lang="scss" scoped>
.email-preview-dialog {
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
        display: flex;
        gap: 8px;
        padding: 4px 0 8px;
      }

      .email-header {
        padding: 8px 12px;
        background: var(--el-fill-color-light);
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 4px;
        margin-bottom: 8px;

        .header-row {
          display: flex;
          gap: 8px;
          font-size: 13px;

          .header-label {
            color: var(--el-text-color-secondary);
            white-space: nowrap;
          }

          .header-value {
            font-weight: 600;
          }
        }
      }

      .content-body {
        flex: 1;
        overflow: auto;
        padding: 16px;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        background: #FFFFFF;
      }
    }
  }
}
</style>
