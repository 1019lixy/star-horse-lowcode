<script setup lang="ts" name="AiChatPanel">
/**
 * AI Copilot - 中央对话面板
 *
 * 消息列表 + 输入框 + 发送按钮 + 快捷指令 + 打字机效果 + 代码块复制
 */
import { computed, nextTick, ref, watch } from "vue";
import { i18n } from "@/lang";
import { ElMessage } from "element-plus";
import { AI_COMMAND_TEMPLATE_PRESETS } from "../constants";
import { aiRenderMarkdown } from "../utils/AiMarkdownRenderer";
import type { AiMessage } from "../types";

const props = defineProps<{
  messages: AiMessage[];
  isGenerating: boolean;
}>();

const emit = defineEmits<{
  (e: "send", text: string): void;
  (e: "stop"): void;
  (e: "apply-action", messageId: string, actionId: string): void;
}>();

const inputText = ref("");
const listRef = ref<HTMLDivElement | null>(null);

/** 渲染后的消息 HTML */
const renderedMessages = computed(() =>
  props.messages.map((m) => ({
    ...m,
    html: aiRenderMarkdown(m.content),
  })),
);

const handleSend = (): void => {
  const text = inputText.value.trim();
  if (!text) {
    ElMessage.warning(i18n("aicopilot.message.cannotSendEmpty"));
    return;
  }
  if (props.isGenerating) return;
  emit("send", text);
  inputText.value = "";
};

const handleStop = (): void => {
  emit("stop");
  ElMessage.info(i18n("aicopilot.message.stopped"));
};

const handleQuickCommand = (command: string): void => {
  if (props.isGenerating) return;
  emit("send", command);
};

const handleKeyDown = (ev: KeyboardEvent): void => {
  if (ev.key === "Enter" && !ev.shiftKey) {
    ev.preventDefault();
    handleSend();
  }
};

const handleCopy = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success(i18n("aicopilot.chat.copied"));
  } catch {
    ElMessage.error(i18n("aicopilot.error.generateFailed"));
  }
};

const handleApplyAction = (messageId: string, actionId: string): void => {
  emit("apply-action", messageId, actionId);
  ElMessage.success(i18n("aicopilot.chat.actionApplied"));
};

/** 自动滚动到底部 */
const scrollToBottom = (): void => {
  nextTick(() => {
    if (listRef.value) {
      listRef.value.scrollTop = listRef.value.scrollHeight;
    }
  });
};

watch(
  () => props.messages.map((m) => m.content).join(""),
  () => scrollToBottom(),
);

watch(
  () => props.messages.length,
  () => scrollToBottom(),
);

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
  chatDotRound:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  avatar:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>',
  copyDocument:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="2" width="12" height="16" rx="2"/><path d="M4 6h12v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"/></svg>',
  videoPause:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
  promotion:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
};
</script>

<template>
  <div class="ai-chat-panel">
    <!-- 消息列表 -->
    <div class="message-list" ref="listRef">
      <div v-if="messages.length === 0" class="empty-state">
        <span class="svg-icon" v-html="icons.chatDotRound"></span>
        <div class="empty-text">{{ i18n("aicopilot.chat.empty") }}</div>
        <div class="empty-welcome">{{ i18n("aicopilot.chat.welcome") }}</div>
      </div>

      <div
        v-for="m in renderedMessages"
        :key="m.id"
        class="message-item"
        :class="m.role"
      >
        <div class="message-avatar">
          <span class="svg-icon" v-html="icons.user"></span>
          <span class="svg-icon" v-html="icons.avatar"></span>
          <span class="svg-icon" v-html="icons.cpu"></span>
        </div>
        <div class="message-body">
          <div class="message-role">
            {{
              m.role === "user"
                ? i18n("aicopilot.role.user")
                : i18n("aicopilot.role.assistant")
            }}
            <span v-if="m.streaming" class="typing-indicator">
              {{ i18n("aicopilot.chat.typing") }}<span class="dots">...</span>
            </span>
          </div>
          <div class="message-content" v-html="m.html"></div>

          <!-- 消息动作建议 -->
          <div v-if="m.actions && m.actions.length" class="message-actions">
            <div
              v-for="action in m.actions"
              :key="action.id"
              class="action-chip"
              :class="{ applied: action.applied }"
            >
              <span class="action-desc">{{ action.description }}</span>
              <el-button
                v-if="!action.applied"
                type="primary"
                link
                @click="handleApplyAction(m.id, action.id)"
              >
                {{ i18n("aicopilot.chat.applyAction") }}
              </el-button>
              <span v-else class="applied-tag">
                {{ i18n("aicopilot.chat.actionApplied") }}
              </span>
            </div>
          </div>

          <!-- 消息工具栏 -->
          <div v-if="!m.streaming && m.content" class="message-toolbar">
            <el-button link @click="handleCopy(m.content)">
              <span class="svg-icon" v-html="icons.copyDocument"></span>
              {{ i18n("aicopilot.chat.copy") }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷指令 -->
    <div class="quick-commands">
      <span class="qc-label">{{ i18n("aicopilot.chat.quickCommands") }}：</span>
      <div class="qc-list">
        <el-button
          v-for="cmd in AI_COMMAND_TEMPLATE_PRESETS"
          :key="cmd.id"
          :disabled="isGenerating"
          @click="handleQuickCommand(cmd.command)"
        >
          {{ i18n(cmd.labelKey as any) }}
        </el-button>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="input-area">
      <el-input
        v-model="inputText"
        type="textarea"
        :rows="3"
        :placeholder="i18n('aicopilot.chat.placeholder')"
        :disabled="isGenerating"
        @keydown="handleKeyDown"
        resize="none"
      />
      <div class="input-actions">
        <el-button v-if="isGenerating" type="danger" @click="handleStop">
          <span class="svg-icon" v-html="icons.videoPause"></span>
          {{ i18n("aicopilot.chat.stop") }}
        </el-button>
        <el-button
          v-else
          type="primary"
          :disabled="!inputText.trim()"
          @click="handleSend"
        >
          <span class="svg-icon" v-html="icons.promotion"></span>
          {{ i18n("aicopilot.chat.send") }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--el-bg-color-page);

  .message-list {
    flex: 1;
    overflow: auto;
    padding: 16px;

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--el-text-color-placeholder);

      .empty-icon {
        font-size: 48px;
        margin-bottom: 12px;
      }

      .empty-text {
        font-size: 14px;
        margin-bottom: 4px;
      }

      .empty-welcome {
        font-size: 13px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .message-item {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;

    &.user {
      flex-direction: row-reverse;

      .message-body {
        align-items: flex-end;
      }

      .message-content {
        background: var(--el-color-primary);
        color: #ffffff;
      }

      .message-role {
        text-align: right;
      }
    }

    &.assistant .message-content {
      background: var(--el-fill-color);
      color: var(--el-text-color-primary);
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--el-color-primary-light-7);
      color: var(--el-color-primary);
      flex-shrink: 0;
      font-size: 16px;
    }

    &.user .message-avatar {
      background: var(--el-color-primary);
      color: #ffffff;
    }

    .message-body {
      display: flex;
      flex-direction: column;
      max-width: 75%;
      gap: 4px;
    }

    .message-role {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }

    .typing-indicator {
      color: var(--el-color-primary);
      margin-left: 6px;

      .dots {
        display: inline-block;
        animation: blink 1.2s infinite;
      }
    }

    .message-content {
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px;
      line-height: 1.6;
      word-break: break-word;

      :deep(h1),
      :deep(h2),
      :deep(h3) {
        margin: 8px 0 4px;
        font-weight: 600;
      }

      :deep(h1) {
        font-size: 16px;
      }

      :deep(h2) {
        font-size: 15px;
      }

      :deep(h3) {
        font-size: 14px;
      }

      :deep(p) {
        margin: 4px 0;
      }

      :deep(ul),
      :deep(ol) {
        margin: 4px 0;
        padding-left: 20px;
      }

      :deep(.md-code-block) {
        background: #1e1e1e;
        color: #d4d4d4;
        padding: 10px;
        border-radius: 4px;
        overflow: auto;
        margin: 6px 0;
        font-size: 12px;

        code {
          background: transparent;
          padding: 0;
        }
      }

      :deep(.md-inline-code) {
        background: rgba(0, 0, 0, 0.08);
        padding: 1px 4px;
        border-radius: 3px;
        font-family: Consolas, Monaco, monospace;
        font-size: 12px;
      }

      :deep(.md-blockquote) {
        border-left: 3px solid var(--el-color-primary);
        padding-left: 8px;
        margin: 4px 0;
        color: var(--el-text-color-secondary);
      }

      :deep(a) {
        color: var(--el-color-primary);
        text-decoration: underline;
      }
    }

    .message-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;

      .action-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 4px;
        background: var(--el-color-warning-light-9);
        border: 1px solid var(--el-color-warning-light-5);
        font-size: 12px;

        &.applied {
          background: var(--el-color-success-light-9);
          border-color: var(--el-color-success-light-5);
        }

        .action-desc {
          color: var(--el-text-color-primary);
        }

        .applied-tag {
          color: var(--el-color-success);
          font-size: 11px;
        }
      }
    }

    .message-toolbar {
      display: flex;
      gap: 8px;
      font-size: 12px;
    }
  }

  .quick-commands {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-top: 1px solid var(--el-border-color-lighter);
    background: var(--el-bg-color);
    flex-shrink: 0;

    .qc-label {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      white-space: nowrap;
    }

    .qc-list {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
  }

  .input-area {
    display: flex;
    gap: 8px;
    padding: 10px 12px;
    border-top: 1px solid var(--el-border-color-lighter);
    background: var(--el-bg-color);
    flex-shrink: 0;

    .input-actions {
      display: flex;
      align-items: flex-end;
    }
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
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
