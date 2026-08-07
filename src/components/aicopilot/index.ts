/**
 * AI Copilot 模块 - 主导出
 */
export {default as AiCopilot} from "./AiCopilot.vue";
export {default as AiToolbar} from "./panels/AiToolbar.vue";
export {default as AiConversationList} from "./panels/AiConversationList.vue";
export {default as AiChatPanel} from "./panels/AiChatPanel.vue";
export {default as AiContextPanel} from "./panels/AiContextPanel.vue";
export {default as AiSettingsDialog} from "./dialogs/AiSettingsDialog.vue";

export {useAiCopilot} from "./composables/useAiCopilot";
export {
    useAiProvider, aiMockProvider, aiStreamResponse, registerProvider, getProvider
} from "./composables/useAiProvider";

export {
    AI_COMMAND_TEMPLATE_PRESETS,
    AI_CONTEXT_TYPE_PRESETS,
    AI_ACTION_TYPE_PRESETS,
    AI_DEFAULT_SYSTEM_PROMPT,
    AI_DEFAULT_SETTINGS,
    AI_STREAM_INTERVAL,
    AI_STREAM_CHUNK_SIZE,
    AI_CONVERSATION_NAME_MAX,
    aiGenId,
    aiGetContextTypePreset,
    aiGetActionTypePreset,
    createAiMessage,
    createAiStreamingMessage,
    createAiConversation,
    createAiAction,
} from "./constants";

export {
    aiGenerateMockResponse,
    aiParseActions,
} from "./utils/AiMockEngine";

export {
    aiRenderMarkdown,
    aiExtractCodeText,
} from "./utils/AiMarkdownRenderer";

export type * from "./types";
