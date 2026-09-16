<script setup lang="ts" name="KgTemplateDialog">
import { computed, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { i18n } from "@/lang";
import type { UseGraphQueryBuilderReturn } from "../composables/useGraphQueryBuilder";
import { StarHorsePanel } from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  builder: UseGraphQueryBuilderReturn;
  dialogType?: "dialog" | "drawer";
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

const builder = props.builder;

const newTemplateName = ref("");
const selectedTemplateId = ref<string | null>(null);

const templates = computed(() => builder.state.templates);

const selectedTemplate = computed(
  () => templates.value.find((t) => t.id === selectedTemplateId.value) ?? null,
);

const handleSave = () => {
  if (!newTemplateName.value.trim()) {
    ElMessage.warning(i18n("knowledgegraph.query.template.namePlaceholder"));
    return;
  }
  builder.saveTemplate(newTemplateName.value.trim());
  ElMessage.success(i18n("knowledgegraph.query.template.saved"));
  newTemplateName.value = "";
};

const handleLoad = () => {
  if (!selectedTemplateId.value) return;
  const ok = builder.loadTemplate(selectedTemplateId.value);
  if (ok) {
    ElMessage.success(i18n("knowledgegraph.query.template.loaded"));
    innerVisible.value = false;
  }
};

const handleDelete = async () => {
  if (!selectedTemplateId.value) return;
  try {
    await ElMessageBox.confirm(
      i18n("knowledgegraph.query.template.confirmDelete"),
      i18n("knowledgegraph.query.template.delete"),
      { type: "warning" },
    );
    builder.deleteTemplate(selectedTemplateId.value);
    selectedTemplateId.value = null;
    ElMessage.success(i18n("knowledgegraph.query.template.deleted"));
  } catch {
    // 用户取消
  }
};

const handleOpen = () => {
  newTemplateName.value = "";
  selectedTemplateId.value = templates.value[0]?.id ?? null;
};
</script>

<template>
  <star-horse-panel
    :type="dialogType"
    v-model="innerVisible"
    :title="i18n('knowledgegraph.query.template.title')"
    box-width="720px"
    :userAction="true"
    @open="handleOpen"
  >
    <div class="kg-template-dialog">
      <div class="template-layout">
        <!-- 左侧：模板列表 -->
        <div class="template-list">
          <div class="list-title">
            {{ i18n("knowledgegraph.query.template.title") }}
            <span class="count">({{ templates.length }})</span>
          </div>
          <div class="list-body">
            <div
              v-for="tpl in templates"
              :key="tpl.id"
              class="list-item"
              :class="{ active: tpl.id === selectedTemplateId }"
              @click="selectedTemplateId = tpl.id"
            >
              <div class="item-name">{{ tpl.name }}</div>
              <div class="item-time">
                {{ new Date(tpl.createdAt).toLocaleString() }}
              </div>
            </div>
            <div v-if="templates.length === 0" class="empty">
              {{ i18n("knowledgegraph.query.template.empty") }}
            </div>
          </div>
        </div>

        <!-- 右侧：保存 + 详情 -->
        <div class="template-detail">
          <div class="save-section">
            <div class="section-title">
              {{ i18n("knowledgegraph.query.template.save") }}
            </div>
            <el-input
              v-model="newTemplateName"
              :placeholder="
                i18n('knowledgegraph.query.template.namePlaceholder')
              "
            >
              <template #append>
                <el-button @click="handleSave">
                  {{ i18n("knowledgegraph.query.template.save") }}
                </el-button>
              </template>
            </el-input>
          </div>

          <div class="detail-section">
            <div class="section-title">
              {{ i18n("knowledgegraph.query.template.name") }}
            </div>
            <div v-if="selectedTemplate" class="detail-content">
              <div class="detail-row">
                <span class="label"
                  >{{ i18n("knowledgegraph.query.template.name") }}:</span
                >
                <span class="value">{{ selectedTemplate.name }}</span>
              </div>
              <div class="detail-row">
                <span class="label"
                  >{{ i18n("knowledgegraph.query.startNode") }}:</span
                >
                <span class="value">{{
                  selectedTemplate.query.startNodeType
                }}</span>
              </div>
              <div class="detail-row">
                <span class="label"
                  >{{ i18n("knowledgegraph.query.step") }}:</span
                >
                <span class="value">{{
                  selectedTemplate.query.steps.length
                }}</span>
              </div>
              <pre class="detail-json">{{
                JSON.stringify(selectedTemplate.query, null, 2)
              }}</pre>
              <div class="detail-actions">
                <el-button type="primary" @click="handleLoad">
                  {{ i18n("knowledgegraph.query.template.load") }}
                </el-button>
                <el-button type="danger" @click="handleDelete">
                  {{ i18n("knowledgegraph.query.template.delete") }}
                </el-button>
              </div>
            </div>
            <div v-else class="empty">
              {{ i18n("knowledgegraph.query.template.empty") }}
            </div>
          </div>
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

<style lang="scss" scoped>
.kg-template-dialog {
  height: 60vh;

  .template-layout {
    display: flex;
    gap: 12px;
    height: 100%;

    .template-list {
      width: 280px;
      border-right: 1px solid var(--el-border-color);
      padding-right: 12px;
      display: flex;
      flex-direction: column;

      .list-title {
        font-weight: 600;
        margin-bottom: 8px;

        .count {
          color: var(--el-text-color-secondary);
          font-weight: normal;
        }
      }

      .list-body {
        flex: 1;
        overflow: auto;

        .list-item {
          padding: 8px 10px;
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid transparent;

          &:hover {
            background: var(--el-fill-color-light);
          }

          &.active {
            background: var(--el-color-primary-light-9);
            border-color: var(--el-color-primary);
          }

          .item-name {
            font-weight: 500;
            font-size: 13px;
          }

          .item-time {
            font-size: 11px;
            color: var(--el-text-color-secondary);
            margin-top: 2px;
          }
        }

        .empty {
          text-align: center;
          color: var(--el-text-color-placeholder);
          padding: 24px 0;
          font-size: 12px;
        }
      }
    }

    .template-detail {
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .save-section,
      .detail-section {
        .section-title {
          font-weight: 600;
          margin-bottom: 6px;
          font-size: 13px;
        }
      }

      .detail-content {
        .detail-row {
          display: flex;
          gap: 8px;
          font-size: 12px;
          padding: 4px 0;

          .label {
            color: var(--el-text-color-secondary);
            min-width: 80px;
          }
        }

        .detail-json {
          background: var(--el-fill-color-light);
          padding: 8px;
          border-radius: 4px;
          font-size: 11px;
          max-height: 200px;
          overflow: auto;
          margin: 8px 0;
        }

        .detail-actions {
          display: flex;
          gap: 8px;
        }
      }

      .empty {
        text-align: center;
        color: var(--el-text-color-placeholder);
        padding: 24px 0;
        font-size: 12px;
      }
    }
  }
}
</style>
