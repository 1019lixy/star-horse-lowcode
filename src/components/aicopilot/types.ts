/**
 * AI Copilot 模块 - 类型定义
 *
 * 角色 / 消息 / 会话 / 上下文 / 动作 / 指令模板 / Provider
 */

/** 角色类型 */
export type AiRole = "user" | "assistant" | "system";

/** 消息状态 */
export type AiMessageStatus = "pending" | "streaming" | "done" | "error" | "stopped";

/** 上下文类型 */
export type AiContextType = "form" | "page" | "component" | "field" | "unknown";

/** 动作类型 */
export type AiActionType =
    | "addField"
    | "modifyProperty"
    | "generateCode"
    | "suggestLayout"
    | "removeField"
    | "custom";

/** Provider 名称 */
export type AiProviderName = "mock" | "custom";

/** AI 消息 */
export interface AiMessage {
    id: string;
    role: AiRole;
    content: string;
    /** 创建时间戳 */
    createdAt: number;
    /** 消息状态 */
    status: AiMessageStatus;
    /** 关联的动作建议 */
    actions?: AiAction[];
    /** 是否正在流式输出 */
    streaming?: boolean;
}

/** 上下文字段 */
export interface AiContextField {
    name: string;
    label?: string;
    type?: string;
    required?: boolean;
}

/** 设计器上下文 */
export interface AiContext {
    type: AiContextType;
    name: string;
    /** 字段列表（表单/组件上下文使用） */
    fields?: AiContextField[];
    /** 选中元素 ID */
    selectedId?: string;
    /** 选中元素名称 */
    selectedName?: string;
    /** 附加描述 */
    description?: string;
    /** 原始数据（业务层可读取） */
    raw?: Record<string, any>;
}

/** 动作建议 */
export interface AiAction {
    id: string;
    type: AiActionType;
    /** i18n 描述 key 或纯文本 */
    description: string;
    /** 动作负载数据 */
    payload?: Record<string, any>;
    /** 是否已应用 */
    applied?: boolean;
}

/** 会话 */
export interface AiConversation {
    id: string;
    name: string;
    messages: AiMessage[];
    createdAt: number;
    updatedAt: number;
}

/** 指令模板 */
export interface AiCommandTemplate {
    id: string;
    /** i18n 标签 key */
    labelKey: string;
    /** 指令文本（发送给 AI） */
    command: string;
    /** 图标名称 */
    icon?: string;
}

/** 上下文类型预设 */
export interface AiContextTypePreset {
    type: AiContextType;
    /** i18n 标签 key */
    labelKey: string;
}

/** 动作类型预设 */
export interface AiActionTypePreset {
    type: AiActionType;
    /** i18n 标签 key */
    labelKey: string;
}

/** Provider 请求 */
export interface AiProviderRequest {
    /** 用户消息 */
    message: string;
    /** 历史消息（不含当前消息） */
    history: AiMessage[];
    /** 上下文 */
    context?: AiContext;
    /** 系统提示词 */
    systemPrompt?: string;
    /** 模型名称 */
    model?: string;
    /** 温度 */
    temperature?: number;
    /** 最大 tokens */
    maxTokens?: number;
}

/** Provider 响应 */
export interface AiProviderResponse {
    /** 文本内容（Markdown） */
    content: string;
    /** 解析出的动作建议 */
    actions?: AiAction[];
    /** 原始数据 */
    raw?: Record<string, any>;
}

/** AI Provider 接口 */
export interface AiProvider {
    name: string;
    /** 生成响应 */
    generate(request: AiProviderRequest): Promise<AiProviderResponse>;
}

/** Provider 设置 */
export interface AiProviderSettings {
    /** 当前 Provider 名称 */
    provider: AiProviderName;
    /** 模型名称 */
    model: string;
    /** 温度 */
    temperature: number;
    /** 最大 tokens */
    maxTokens: number;
    /** 系统提示词 */
    systemPrompt: string;
}

/** 设计器状态 */
export interface AiCopilotState {
    conversations: AiConversation[];
    currentConversationId: string | null;
    isGenerating: boolean;
    context: AiContext | null;
    settings: AiProviderSettings;
}

/** 流式响应回调 */
export interface AiStreamCallbacks {
    onChunk?: (chunk: string, full: string) => void;
    onDone?: (full: string) => void;
    onError?: (err: Error) => void;
    /** 用于检查是否请求中断 */
    shouldStop?: () => boolean;
}
