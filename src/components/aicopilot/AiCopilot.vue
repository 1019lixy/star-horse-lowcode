<script setup lang="ts" name="AiCopilot">
/**
 * AI Copilot - 主组件
 *
 * 工具栏 + 会话列表 + 对话面板 + 上下文面板 + 设置弹窗
 */
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import { ElMessage, ElMessageBox } from "element-plus";
import { DesignerMobileShell } from "@/components/shared";
import AiToolbar from "./panels/AiToolbar.vue";
import AiConversationList from "./panels/AiConversationList.vue";
import AiChatPanel from "./panels/AiChatPanel.vue";
import AiContextPanel from "./panels/AiContextPanel.vue";
import AiSettingsDialog from "./dialogs/AiSettingsDialog.vue";
import { useAiCopilot } from "./composables/useAiCopilot";
import type { AiAction, AiContext, AiConversation, AiProviderSettings } from "./types";

const props = defineProps<{
    /** 初始会话列表 */
    conversations?: AiConversation[];
    /** 初始上下文 */
    context?: AiContext | null;
    /** 初始设置 */
    settings?: AiProviderSettings;
}>();

const emit = defineEmits<{
    (e: "apply-action", action: AiAction): void;
    (e: "send", text: string): void;
}>();

const copilot = useAiCopilot({
    conversations: props.conversations,
    context: props.context ?? null,
    settings: props.settings,
});

const historyVisible = ref(true);
const settingsVisible = ref(false);

const handleNewConversation = (): void => {
    copilot.newConversation();
    ElMessage.success(i18n("aicopilot.message.conversationCreated"));
};

const handleToggleHistory = (): void => {
    historyVisible.value = !historyVisible.value;
};

const handleClear = (): void => {
    ElMessageBox.confirm(i18n("aicopilot.toolbar.clear"), i18n("aicopilot.toolbar.clear"), {
        type: "warning",
    })
        .then(() => {
            copilot.clearHistory();
            ElMessage.success(i18n("aicopilot.message.historyCleared"));
        })
        .catch(() => {});
};

const handleSend = (text: string): void => {
    copilot.sendMessage(text);
    emit("send", text);
};

const handleStop = (): void => {
    copilot.stopGeneration();
};

/** 根据 actionId 查找动作 */
const findAction = (actionId: string): AiAction | null => {
    for (const conv of copilot.conversations.value) {
        for (const msg of conv.messages) {
            const found = msg.actions?.find((a) => a.id === actionId);
            if (found) return found;
        }
    }
    return null;
};

const handleApplyActionById = (actionId: string): void => {
    const action = findAction(actionId);
    if (action && !action.applied) {
        copilot.applyAction(action);
        emit("apply-action", action);
    }
};

const handleRejectActionById = (actionId: string): void => {
    const action = findAction(actionId);
    if (action) {
        copilot.rejectAction(action);
    }
};

/** 从消息内应用动作 */
const handleApplyMessageAction = (messageId: string, actionId: string): void => {
    void messageId;
    handleApplyActionById(actionId);
};

const handleSaveSettings = (settings: AiProviderSettings): void => {
    copilot.updateSettings(settings);
};

// 暴露给父组件
defineExpose({
    copilot,
    setContext: copilot.setContext,
});

// 抑制未使用告警
void computed;
</script>

<template>
    <div class="ai-copilot">
        <DesignerMobileShell
            :panels="[
                { key: 'conversations', label: '会话', side: 'left', width: 240, min: 200 },
                { key: 'context', label: '上下文', side: 'right', width: 280, min: 220 },
            ]"
            canvas-label="聊天"
        >
            <template #toolbar>
                <ai-toolbar
                    :history-visible="historyVisible"
                    @new-conversation="handleNewConversation"
                    @toggle-history="handleToggleHistory"
                    @clear="handleClear"
                    @open-settings="settingsVisible = true"
                />
            </template>
            <template #canvas>
                <ai-chat-panel
                    :messages="copilot.messages.value"
                    :is-generating="copilot.isGenerating.value"
                    @send="handleSend"
                    @stop="handleStop"
                    @apply-action="handleApplyMessageAction"
                />
            </template>
            <template #panel-conversations>
                <ai-conversation-list
                    v-if="historyVisible"
                    :conversations="copilot.conversations.value"
                    :current-id="copilot.currentConversationId.value"
                    @new="handleNewConversation"
                    @select="copilot.loadConversation"
                    @delete="copilot.deleteConversation"
                    @rename="copilot.renameConversation"
                />
            </template>
            <template #panel-context>
                <ai-context-panel
                    :context="copilot.context.value"
                    :actions="copilot.pendingActions.value"
                    @apply-action="handleApplyActionById"
                    @reject-action="handleRejectActionById"
                />
            </template>
        </DesignerMobileShell>

        <ai-settings-dialog
            v-model:visible="settingsVisible"
            :settings="copilot.settings.value"
            @save="handleSaveSettings"
        />
    </div>
</template>

<style lang="scss" scoped>
.ai-copilot {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--el-bg-color-page);
    overflow: hidden;
}
</style>
