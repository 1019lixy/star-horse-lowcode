/**
 * AI Copilot 模块 - 常量定义
 *
 * 指令模板 / 上下文类型 / 动作类型 / 默认系统提示词 / 工厂函数
 */

import type {
  AiAction,
  AiActionTypePreset,
  AiCommandTemplate,
  AiContextTypePreset,
  AiConversation,
  AiMessage,
  AiProviderSettings,
  AiRole,
} from "./types";

/** 默认系统提示词 */
export const AI_DEFAULT_SYSTEM_PROMPT =
  "You are a helpful AI Copilot for a low-code platform. " +
  "Answer user questions about form/page design and suggest actions. " +
  'Respond in Markdown. To suggest an action, embed it as: <!-- ACTION: {"type":"addField","description":"...","payload":{...}} -->';

/** 默认 Provider 设置 */
export const AI_DEFAULT_SETTINGS: AiProviderSettings = {
  provider: "mock",
  model: "mock-1",
  temperature: 0.7,
  maxTokens: 1024,
  systemPrompt: AI_DEFAULT_SYSTEM_PROMPT,
};

/** 流式打字机间隔（ms） */
export const AI_STREAM_INTERVAL = 20;

/** 流式分块大小（每次输出字符数） */
export const AI_STREAM_CHUNK_SIZE = 2;

/** 会话名称最大长度 */
export const AI_CONVERSATION_NAME_MAX = 40;

/** 快捷指令模板预设 */
export const AI_COMMAND_TEMPLATE_PRESETS: AiCommandTemplate[] = [
  {
    id: "ai_cmd_generate_form",
    labelKey: "aicopilot.command.generateForm",
    command: "请帮我生成一个表单，包含常用字段。",
    icon: "Document",
  },
  {
    id: "ai_cmd_generate_list",
    labelKey: "aicopilot.command.generateList",
    command: "请帮我生成一个列表，包含分页和搜索。",
    icon: "List",
  },
  {
    id: "ai_cmd_optimize_layout",
    labelKey: "aicopilot.command.optimizeLayout",
    command: "请分析并优化当前布局。",
    icon: "Grid",
  },
  {
    id: "ai_cmd_check_validation",
    labelKey: "aicopilot.command.checkValidation",
    command: "请检查当前字段的校验规则是否完善。",
    icon: "CircleCheck",
  },
  {
    id: "ai_cmd_generate_code",
    labelKey: "aicopilot.command.generateCode",
    command: "请生成当前组件的代码片段。",
    icon: "Promotion",
  },
  {
    id: "ai_cmd_explain_selection",
    labelKey: "aicopilot.command.explainSelection",
    command: "请解释当前选中的元素。",
    icon: "InfoFilled",
  },
  {
    id: "ai_cmd_refactor",
    labelKey: "aicopilot.command.refactor",
    command: "请给出当前结构的重构建议。",
    icon: "Refresh",
  },
  {
    id: "ai_cmd_add_field",
    labelKey: "aicopilot.command.addField",
    command: "请建议添加一个字段。",
    icon: "Plus",
  },
];

/** 上下文类型预设 */
export const AI_CONTEXT_TYPE_PRESETS: AiContextTypePreset[] = [
  { type: "form", labelKey: "aicopilot.context.form" },
  { type: "page", labelKey: "aicopilot.context.page" },
  { type: "component", labelKey: "aicopilot.context.component" },
  { type: "field", labelKey: "aicopilot.context.field" },
  { type: "unknown", labelKey: "aicopilot.context.empty" },
];

/** 动作类型预设 */
export const AI_ACTION_TYPE_PRESETS: AiActionTypePreset[] = [
  { type: "addField", labelKey: "aicopilot.action.type.addField" },
  { type: "modifyProperty", labelKey: "aicopilot.action.type.modifyProperty" },
  { type: "generateCode", labelKey: "aicopilot.action.type.generateCode" },
  { type: "suggestLayout", labelKey: "aicopilot.action.type.suggestLayout" },
  { type: "removeField", labelKey: "aicopilot.action.type.addField" },
  { type: "custom", labelKey: "aicopilot.action.type.modifyProperty" },
];

/** 工具：生成唯一 ID */
export const aiGenId = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

/** 工具：取得上下文类型预设 */
export const aiGetContextTypePreset = (
  type: string,
): AiContextTypePreset | undefined =>
  AI_CONTEXT_TYPE_PRESETS.find((p) => p.type === type);

/** 工具：取得动作类型预设 */
export const aiGetActionTypePreset = (
  type: string,
): AiActionTypePreset | undefined =>
  AI_ACTION_TYPE_PRESETS.find((p) => p.type === type);

/** 工厂：创建消息 */
export const createAiMessage = (
  role: AiRole,
  content: string,
  actions?: AiAction[],
): AiMessage => ({
  id: aiGenId("ai_msg"),
  role,
  content,
  createdAt: Date.now(),
  status: "done",
  actions: actions?.length ? actions : undefined,
  streaming: false,
});

/** 工厂：创建空消息（用于流式输出） */
export const createAiStreamingMessage = (role: AiRole): AiMessage => ({
  id: aiGenId("ai_msg"),
  role,
  content: "",
  createdAt: Date.now(),
  status: "streaming",
  actions: [],
  streaming: true,
});

/** 工厂：创建会话 */
export const createAiConversation = (
  name: string,
  messages: AiMessage[] = [],
): AiConversation => {
  const now = Date.now();
  return {
    id: aiGenId("ai_conv"),
    name: name || "新会话",
    messages,
    createdAt: now,
    updatedAt: now,
  };
};

/** 工厂：创建动作建议 */
export const createAiAction = (
  type: AiAction["type"],
  description: string,
  payload?: Record<string, any>,
): AiAction => ({
  id: aiGenId("ai_act"),
  type,
  description,
  payload,
  applied: false,
});
