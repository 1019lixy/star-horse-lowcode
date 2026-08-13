<script setup lang="ts" name="AiToolbar">
/**
 * AI Copilot - 顶部工具栏
 *
 * 新会话 / 历史 / 清空 / 设置
 */
import { i18n } from "@/lang";

defineEmits<{
  (e: "new-conversation"): void;
  (e: "toggle-history"): void;
  (e: "clear"): void;
  (e: "open-settings"): void;
}>();

defineProps<{
  /** 历史面板是否展开 */
  historyVisible?: boolean;
}>();

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  clock:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  delete:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6M10 11v6M14 11v6"/></svg>',
  setting:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
};
</script>

<template>
  <div class="ai-toolbar">
    <span class="ai-title">{{ i18n("aicopilot.title") }}</span>

    <el-divider direction="vertical" />

    <el-button type="primary" @click="$emit('new-conversation')">
      <span class="svg-icon" v-html="icons.plus"></span>
      {{ i18n("aicopilot.toolbar.new") }}
    </el-button>

    <el-button
      :type="historyVisible ? 'info' : 'default'"
      @click="$emit('toggle-history')"
    >
      <span class="svg-icon" v-html="icons.clock"></span>
      {{ i18n("aicopilot.toolbar.history") }}
    </el-button>

    <el-button @click="$emit('clear')">
      <span class="svg-icon" v-html="icons.delete"></span>
      {{ i18n("aicopilot.toolbar.clear") }}
    </el-button>

    <div class="ai-spacer" />

    <el-button
      @click="$emit('open-settings')"
      :title="i18n('aicopilot.toolbar.settings')"
    >
      <span class="svg-icon" v-html="icons.setting"></span>
      {{ i18n("aicopilot.toolbar.settings") }}
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.ai-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-lighter);
  flex-shrink: 0;

  .ai-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .ai-spacer {
    flex: 1;
  }
}

.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  margin-right: 4px;
}

.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
