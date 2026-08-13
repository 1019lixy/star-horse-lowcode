<script setup lang="ts" name="AiContextPanel">
/**
 * AI Copilot - 右侧上下文面板
 *
 * 当前上下文（类型 + 名称 + 字段列表）+ 动作建议列表
 */
import { computed } from "vue";
import { i18n } from "@/lang";
import { aiGetActionTypePreset, aiGetContextTypePreset } from "../constants";
import type { AiAction, AiContext } from "../types";

const props = defineProps<{
  context: AiContext | null;
  actions: AiAction[];
}>();

const emit = defineEmits<{
  (e: "apply-action", actionId: string): void;
  (e: "reject-action", actionId: string): void;
}>();

const contextTypeLabel = computed(() => {
  if (!props.context) return i18n("aicopilot.context.empty");
  const preset = aiGetContextTypePreset(props.context.type);
  return preset ? i18n(preset.labelKey as any) : props.context.type;
});

const handleApply = (action: AiAction): void => {
  if (action.applied) return;
  emit("apply-action", action.id);
};

const handleReject = (action: AiAction): void => {
  if (action.applied) return;
  emit("reject-action", action.id);
};

const actionTypeLabel = (action: AiAction): string => {
  const preset = aiGetActionTypePreset(action.type);
  return preset ? i18n(preset.labelKey as any) : action.type;
};
</script>

<template>
  <div class="ai-context-panel">
    <!-- 当前上下文 -->
    <div class="panel-section">
      <div class="section-title">{{ i18n("aicopilot.context.current") }}</div>
      <div v-if="context" class="context-info">
        <div class="info-row">
          <span class="info-label">{{ i18n("aicopilot.context.type") }}：</span>
          <el-tag>{{ contextTypeLabel }}</el-tag>
        </div>
        <div class="info-row">
          <span class="info-label">{{ i18n("aicopilot.context.name") }}：</span>
          <span class="info-value">{{ context.name || "-" }}</span>
        </div>
        <div v-if="context.selectedName" class="info-row">
          <span class="info-label"
            >{{ i18n("aicopilot.context.component") }}：</span
          >
          <span class="info-value">{{ context.selectedName }}</span>
        </div>
        <div v-if="context.fields && context.fields.length" class="info-fields">
          <div class="info-label">{{ i18n("aicopilot.context.fields") }}：</div>
          <div class="field-list">
            <el-tag v-for="f in context.fields" :key="f.name" class="field-tag">
              {{ f.label || f.name }}
              <span v-if="f.required" class="required">*</span>
            </el-tag>
          </div>
        </div>
      </div>
      <div v-else class="empty-tip">{{ i18n("aicopilot.context.empty") }}</div>
    </div>

    <el-divider />

    <!-- 动作建议 -->
    <div class="panel-section action-section">
      <div class="section-title">{{ i18n("aicopilot.action.title") }}</div>
      <div v-if="actions.length === 0" class="empty-tip">
        {{ i18n("aicopilot.action.empty") }}
      </div>
      <div v-else class="action-list">
        <div
          v-for="action in actions"
          :key="action.id"
          class="action-item"
          :class="{ applied: action.applied }"
        >
          <div class="action-header">
            <el-tag type="warning">{{ actionTypeLabel(action) }}</el-tag>
            <span v-if="action.applied" class="applied-mark">✓</span>
          </div>
          <div class="action-desc">{{ action.description }}</div>
          <div v-if="!action.applied" class="action-buttons">
            <el-button type="primary" @click="handleApply(action)">
              {{ i18n("aicopilot.action.apply") }}
            </el-button>
            <el-button @click="handleReject(action)">
              {{ i18n("aicopilot.action.reject") }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-context-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--el-bg-color);
  overflow: auto;
  padding: 12px;

  .panel-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .action-section {
    flex: 1;
  }

  .section-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    padding-bottom: 6px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .empty-tip {
    padding: 16px 8px;
    text-align: center;
    color: var(--el-text-color-placeholder);
    font-size: 12px;
  }

  .context-info {
    .info-row {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 6px;
      font-size: 12px;

      .info-label {
        color: var(--el-text-color-secondary);
        white-space: nowrap;
      }

      .info-value {
        color: var(--el-text-color-primary);
        word-break: break-all;
      }
    }

    .info-fields {
      margin-top: 4px;

      .field-list {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 4px;

        .field-tag {
          font-size: 11px;

          .required {
            color: var(--el-color-danger);
            margin-left: 2px;
          }
        }
      }
    }
  }

  .action-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .action-item {
    padding: 8px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 4px;
    background: var(--el-fill-color-blank);

    &.applied {
      opacity: 0.6;
      background: var(--el-color-success-light-9);
      border-color: var(--el-color-success-light-5);
    }

    .action-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;

      .applied-mark {
        color: var(--el-color-success);
        font-weight: 600;
      }
    }

    .action-desc {
      font-size: 12px;
      color: var(--el-text-color-primary);
      margin-bottom: 6px;
      line-height: 1.5;
    }

    .action-buttons {
      display: flex;
      gap: 6px;
    }
  }
}
</style>
