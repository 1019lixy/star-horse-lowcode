<script setup lang="ts" name="AiConversationList">
/**
 * AI Copilot - 左侧会话列表
 *
 * 新建 / 选择 / 删除 / 重命名（双击重命名）
 */
import {ref} from "vue";
import {i18n} from "@/lang";
import {ElMessage, ElMessageBox} from "element-plus";
import type {AiConversation} from "../types";

const props = defineProps<{
  conversations: AiConversation[];
  currentId: string | null;
}>();

const emit = defineEmits<{
  (e: "new"): void;
  (e: "select", id: string): void;
  (e: "delete", id: string): void;
  (e: "rename", id: string, name: string): void;
}>();

const editingId = ref<string | null>(null);
const editingName = ref("");

const handleSelect = (id: string): void => {
  if (editingId.value) return;
  emit("select", id);
};

const handleStartRename = (conv: AiConversation): void => {
  editingId.value = conv.id;
  editingName.value = conv.name;
};

const handleConfirmRename = (): void => {
  if (!editingId.value) return;
  const name = editingName.value.trim();
  if (!name) {
    editingId.value = null;
    return;
  }
  emit("rename", editingId.value, name);
  editingId.value = null;
};

const handleCancelRename = (): void => {
  editingId.value = null;
};

const handleDelete = (conv: AiConversation, ev: Event): void => {
  ev.stopPropagation();
  ElMessageBox.confirm(
      i18n("aicopilot.conversation.confirmDelete"),
      i18n("aicopilot.conversation.delete"),
      {type: "warning"},
  )
      .then(() => {
        emit("delete", conv.id);
        ElMessage.success(i18n("aicopilot.message.conversationDeleted"));
      })
      .catch(() => {
      });
};

const formatTime = (ts: number): string => {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${m}-${day} ${h}:${min}`;
};

// 抑制未使用告警
void props;

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  delete: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6M10 11v6M14 11v6"/></svg>'
};
</script>

<template>
  <div class="ai-conversation-list">
    <div class="list-header">
      <span class="header-title">{{ i18n("aicopilot.conversation.title") }}</span>
      <el-button type="primary" @click="emit('new')">
        <span class="svg-icon" v-html="icons.plus"></span>
        {{ i18n("aicopilot.conversation.new") }}
      </el-button>
    </div>

    <div class="list-body">
      <div v-if="conversations.length === 0" class="empty-tip">
        {{ i18n("aicopilot.conversation.empty") }}
      </div>
      <div
          v-for="conv in conversations"
          :key="conv.id"
          class="conv-item"
          :class="{ active: conv.id === currentId }"
          @click="handleSelect(conv.id)"
          @dblclick="handleStartRename(conv)"
      >
        <template v-if="editingId === conv.id">
          <el-input
              v-model="editingName"

              autofocus
              @keyup.enter="handleConfirmRename"
              @keyup.esc="handleCancelRename"
              @blur="handleConfirmRename"
          />
        </template>
        <template v-else>
          <div class="conv-name">
            {{ conv.name || i18n("aicopilot.conversation.defaultName") }}
          </div>
          <div class="conv-meta">
            <span class="meta-time">{{ formatTime(conv.updatedAt) }}</span>
            <span class="meta-count">{{ conv.messages.length }} {{ i18n("aicopilot.conversation.title") }}</span>
          </div>
          <el-button
              class="conv-delete"

              link
              @click="handleDelete(conv, $event)"
          >
            <span class="svg-icon" v-html="icons.delete"></span>
          </el-button>
        </template>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.ai-conversation-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--el-bg-color);

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .header-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .list-body {
    flex: 1;
    overflow: auto;
    padding: 6px;
  }

  .empty-tip {
    padding: 24px 8px;
    text-align: center;
    color: var(--el-text-color-placeholder);
    font-size: 12px;
  }

  .conv-item {
    position: relative;
    padding: 8px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 4px;
    border: 1px solid transparent;

    &:hover {
      background: var(--el-fill-color-light);
    }

    &.active {
      background: var(--el-color-primary-light-9);
      border-color: var(--el-color-primary-light-5);
    }

    .conv-name {
      font-size: 13px;
      color: var(--el-text-color-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-right: 24px;
    }

    .conv-meta {
      display: flex;
      justify-content: space-between;
      margin-top: 4px;
      font-size: 11px;
      color: var(--el-text-color-secondary);
    }

    .conv-delete {
      position: absolute;
      top: 6px;
      right: 4px;
      opacity: 0;
      transition: opacity 0.15s;
    }

    &:hover .conv-delete {
      opacity: 1;
    }
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
