import { Delete, Download, FolderOpened, QuestionFilled } from "@element-plus/icons-vue";
import { createAiAction, createAiConversation, createAiMessage } from "@/components/aicopilot";
import type { AiAction, AiContext, AiConversation } from "@/components/aicopilot";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * 模拟当前表单上下文
 */
export const SAMPLE_CONTEXT: AiContext = {
    type: "form",
    name: "用户注册表单",
    selectedName: "邮箱输入框",
    description: "用户注册场景的表单",
    fields: [
        { name: "username", label: "用户名", type: "input", required: true },
        { name: "email", label: "邮箱", type: "input", required: true },
        { name: "phone", label: "手机号", type: "input", required: true },
    ],
};

/** 空上下文 */
export const EMPTY_CONTEXT: AiContext = {
    type: "form",
    name: "",
    selectedName: "",
    description: "",
    fields: [],
};

/**
 * 创建预置动作建议
 */
function createPresetActions(): AiAction[] {
    return [
        createAiAction(
            "addField",
            "建议添加密码字段",
            { field: "password", type: "password", label: "密码", required: true },
        ),
        createAiAction(
            "modifyProperty",
            "建议给邮箱字段加格式校验",
            { field: "email", rule: "email", message: "请输入正确的邮箱格式" },
        ),
    ];
}

/**
 * 创建预置 2 个历史会话
 *
 * 用函数：createAiConversation/createAiMessage/createAiAction 每次返回新对象
 */
export function createSampleConversations(): AiConversation[] {
    const presetActions = createPresetActions();
    return [
        createAiConversation("表单生成咨询", [
            createAiMessage("user", "帮我生成一个用户注册表单"),
            createAiMessage(
                "assistant",
                "## 用户注册表单建议\n\n已为您生成如下表单方案：\n\n" +
                    "- **用户名**：input，必填，3-20 字符\n" +
                    "- **邮箱**：input，必填，需邮箱格式\n" +
                    "- **手机号**：input，必填，需手机号格式\n\n" +
                    "可以点击下方动作建议快速应用：",
                presetActions,
            ),
        ]),
        createAiConversation("布局优化讨论", [
            createAiMessage("user", "如何优化当前表单布局？"),
            createAiMessage(
                "assistant",
                "## 布局优化建议\n\n建议采用 **两列栅格布局**：\n\n" +
                    "1. 用户名、邮箱放左列\n" +
                    "2. 手机号、密码放右列\n" +
                    "3. 提交按钮居中\n\n" +
                    "`el-row :gutter=\"20\"` + `el-col :span=\"12\"` 即可实现。",
            ),
        ]),
    ];
}

/**
 * AiCopilotDemo 主操作（左侧）
 *
 * 底层 AiCopilot 已有 AiToolbar（新会话/清空/设置等），demo 工具栏管"数据生命周期"
 */
export const AI_ACTIONS: ShDemoAction[] = [
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.aicopilot.toolbar.loadSample", group: "data" },
    { key: "clear", icon: Delete, labelKey: "advanced.aicopilot.toolbar.clear", type: "danger", group: "data" },
    { key: "exportJson", icon: Download, tooltipKey: "advanced.aicopilot.toolbar.exportJson", iconOnly: true, group: "data" },
];

/**
 * AiCopilotDemo 次要操作（右侧）
 */
export const AI_SECONDARY: ShDemoAction[] = [
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.aicopilot.toolbar.help", iconOnly: true },
];
