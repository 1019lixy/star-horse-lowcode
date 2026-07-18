/**
 * AI Copilot - 状态管理
 *
 * conversations / currentConversation / messages /
 * sendMessage / newConversation / loadConversation / clearHistory / applyAction
 */

import { computed, reactive, ref } from "vue";
import { AI_DEFAULT_SETTINGS, createAiConversation, createAiMessage } from "../constants";
import { useAiProvider } from "./useAiProvider";
import type {
    AiAction,
    AiContext,
    AiConversation,
    AiMessage,
    AiProviderSettings,
} from "../types";

export function useAiCopilot(initial?: {
    conversations?: AiConversation[];
    context?: AiContext | null;
    settings?: AiProviderSettings;
}) {
    const providerManager = useAiProvider();

    const conversations = ref<AiConversation[]>(
        initial?.conversations ? initial.conversations.map((c) => ({ ...c })) : [],
    );
    const currentConversationId = ref<string | null>(
        conversations.value[0]?.id ?? null,
    );
    const isGenerating = ref(false);
    const context = ref<AiContext | null>(initial?.context ?? null);
    const settings = ref<AiProviderSettings>({
        ...AI_DEFAULT_SETTINGS,
        ...(initial?.settings ?? {}),
    });

    /** 当前会话 */
    const currentConversation = computed<AiConversation | null>(() => {
        if (!currentConversationId.value) return null;
        return (
            conversations.value.find((c) => c.id === currentConversationId.value) ?? null
        );
    });

    /** 当前会话消息 */
    const messages = computed<AiMessage[]>(() => {
        return currentConversation.value?.messages ?? [];
    });

    /** 当前会话的动作建议（汇总所有 AI 消息中的动作） */
    const pendingActions = computed<AiAction[]>(() => {
        const result: AiAction[] = [];
        for (const m of messages.value) {
            if (m.role === "assistant" && m.actions?.length) {
                for (const a of m.actions) {
                    if (!a.applied) result.push(a);
                }
            }
        }
        return result;
    });

    /** 找到会话 */
    const findConversation = (id: string): AiConversation | undefined =>
        conversations.value.find((c) => c.id === id);

    /** 新建会话 */
    const newConversation = (name?: string): AiConversation => {
        const conv = createAiConversation(name || "", []);
        conversations.value.unshift(conv);
        currentConversationId.value = conv.id;
        return conv;
    };

    /** 加载会话 */
    const loadConversation = (id: string): void => {
        if (findConversation(id)) {
            currentConversationId.value = id;
        }
    };

    /** 删除会话 */
    const deleteConversation = (id: string): void => {
        const idx = conversations.value.findIndex((c) => c.id === id);
        if (idx < 0) return;
        conversations.value.splice(idx, 1);
        if (currentConversationId.value === id) {
            currentConversationId.value = conversations.value[0]?.id ?? null;
        }
    };

    /** 重命名会话 */
    const renameConversation = (id: string, name: string): void => {
        const conv = findConversation(id);
        if (conv) {
            conv.name = name;
            conv.updatedAt = Date.now();
        }
    };

    /** 清空历史 */
    const clearHistory = (): void => {
        conversations.value = [];
        currentConversationId.value = null;
    };

    /** 设置上下文 */
    const setContext = (ctx: AiContext | null): void => {
        context.value = ctx;
    };

    /** 更新设置 */
    const updateSettings = (patch: Partial<AiProviderSettings>): void => {
        settings.value = { ...settings.value, ...patch };
    };

    /** 停止生成的控制器 */
    let stopStreamFn: (() => void) | null = null;

    /** 停止生成 */
    const stopGeneration = (): void => {
        if (stopStreamFn) {
            stopStreamFn();
            stopStreamFn = null;
        }
        isGenerating.value = false;
        // 将当前流式消息标记为 stopped
        const conv = currentConversation.value;
        if (conv) {
            const last = conv.messages[conv.messages.length - 1];
            if (last && last.streaming) {
                last.streaming = false;
                last.status = "stopped";
            }
        }
    };

    /**
     * 发送消息
     *
     * @param text 消息文本
     * @param onDone 完成回调（可选）
     */
    const sendMessage = (text: string, onDone?: () => void): void => {
        const trimmed = text.trim();
        if (!trimmed) return;

        // 确保有当前会话
        if (!currentConversation.value) {
            newConversation(trimmed.slice(0, 20));
        }
        const conv = currentConversation.value!;
        const now = Date.now();

        // 添加用户消息
        conv.messages.push(createAiMessage("user", trimmed));
        conv.updatedAt = now;

        // 准备 AI 流式消息
        const aiMsg = reactive<AiMessage>({
            id: `ai_msg_${now}_${Math.random().toString(36).slice(2, 8)}`,
            role: "assistant",
            content: "",
            createdAt: now,
            status: "streaming",
            actions: [],
            streaming: true,
        });
        conv.messages.push(aiMsg);
        isGenerating.value = true;

        const provider = providerManager.resolveProvider(settings.value.provider);
        const history = conv.messages.slice(0, -2);

        provider
            .generate({
                message: trimmed,
                history,
                context: context.value ?? undefined,
                systemPrompt: settings.value.systemPrompt,
                model: settings.value.model,
                temperature: settings.value.temperature,
                maxTokens: settings.value.maxTokens,
            })
            .then((resp) => {
                const fullText = resp.content || "";
                // 流式输出
                stopStreamFn = providerManager.aiStreamResponse(fullText, {
                    onChunk: (_chunk, full) => {
                        aiMsg.content = full;
                    },
                    onDone: (full) => {
                        aiMsg.content = full;
                        aiMsg.streaming = false;
                        aiMsg.status = "done";
                        if (resp.actions?.length) {
                            aiMsg.actions = resp.actions;
                        }
                        isGenerating.value = false;
                        stopStreamFn = null;
                        onDone?.();
                    },
                    shouldStop: () => !isGenerating.value,
                });
            })
            .catch((err: Error) => {
                aiMsg.content = `**生成失败**：${err.message || "未知错误"}`;
                aiMsg.streaming = false;
                aiMsg.status = "error";
                isGenerating.value = false;
                stopStreamFn = null;
            });
    };

    /** 应用动作 */
    const applyAction = (action: AiAction): void => {
        action.applied = true;
    };

    /** 忽略动作 */
    const rejectAction = (action: AiAction): void => {
        action.applied = true;
    };

    return {
        conversations,
        currentConversationId,
        currentConversation,
        messages,
        isGenerating,
        context,
        settings,
        pendingActions,
        newConversation,
        loadConversation,
        deleteConversation,
        renameConversation,
        clearHistory,
        setContext,
        updateSettings,
        sendMessage,
        stopGeneration,
        applyAction,
        rejectAction,
    };
}

export type UseAiCopilotReturn = ReturnType<typeof useAiCopilot>;
