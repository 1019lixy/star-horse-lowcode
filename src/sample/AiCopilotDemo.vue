<script setup lang="ts">
/**
 * AI Copilot Demo
 *
 * 模拟一个设计器上下文：当前表单包含 3 个字段（用户名/邮箱/手机号）
 * 预置 2 个历史会话
 * 上下文面板显示当前表单信息
 * 动作建议面板显示 2 个建议（建议添加密码字段、建议给邮箱字段加格式校验）
 */
import { ref } from "vue";
import { AiCopilot } from "@/components/aicopilot";
import { createAiAction, createAiConversation, createAiMessage } from "@/components/aicopilot";
import type { AiAction, AiContext, AiConversation } from "@/components/aicopilot";

/** 模拟当前表单上下文 */
const context = ref<AiContext>({
    type: "form",
    name: "用户注册表单",
    selectedName: "邮箱输入框",
    description: "用户注册场景的表单",
    fields: [
        { name: "username", label: "用户名", type: "input", required: true },
        { name: "email", label: "邮箱", type: "input", required: true },
        { name: "phone", label: "手机号", type: "input", required: true },
    ],
});

/** 预置 2 个动作建议（绑定到第一个会话的最后一条 AI 消息） */
const presetActions: AiAction[] = [
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

/** 预置 2 个历史会话 */
const conversations = ref<AiConversation[]>([
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
]);

const handleApplyAction = (action: AiAction): void => {
    // eslint-disable-next-line no-console
    console.log("[Demo] apply action:", action);
};

const handleSend = (text: string): void => {
    // eslint-disable-next-line no-console
    console.log("[Demo] user sent:", text);
};
</script>

<template>
    <div class="demo-container">
        <AiCopilot
            :conversations="conversations"
            :context="context"
            @apply-action="handleApplyAction"
            @send="handleSend"
        />
    </div>
</template>

<style scoped>
.demo-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
}
</style>
