/**
 * AI Copilot - Mock AI 响应引擎
 *
 * aiGenerateMockResponse: 基于关键词匹配 + 模板生成
 * 响应格式为 Markdown 字符串，可包含结构化动作建议（<!-- ACTION: {...} --> 注释）
 */

import { createAiAction } from "../constants";
import type { AiAction, AiContext, AiProviderResponse } from "../types";

/** 动作嵌入正则（注释形式） */
const AI_ACTION_REGEX = /<!--\s*ACTION:\s*(\{[\s\S]*?\})\s*-->/g;

/**
 * 解析响应文本中的动作建议
 *
 * @param text Markdown 文本
 * @returns 动作列表 + 清理后的文本
 */
export const aiParseActions = (
    text: string,
): { actions: AiAction[]; cleanedText: string } => {
    const actions: AiAction[] = [];
    const cleaned = text.replace(AI_ACTION_REGEX, (_m, jsonStr: string) => {
        try {
            const obj = JSON.parse(jsonStr);
            actions.push(
                createAiAction(
                    obj.type ?? "custom",
                    obj.description ?? "",
                    obj.payload,
                ),
            );
            return "";
        } catch {
            return _m;
        }
    });
    return { actions, cleanedText: cleaned.trim() };
};

/** 生成"添加字段"动作嵌入注释 */
const aiEmbedAction = (action: {
    type: AiAction["type"];
    description: string;
    payload?: Record<string, any>;
}): string => {
    const json = JSON.stringify(action);
    return `<!-- ACTION: ${json} -->`;
};

/** 拼接上下文描述 */
const aiDescribeContext = (context?: AiContext | null): string => {
    if (!context) return "";
    const parts: string[] = [`类型: ${context.type}`, `名称: ${context.name}`];
    if (context.fields?.length) {
        const fields = context.fields
            .map((f) => `${f.name}${f.label ? `(${f.label})` : ""}`)
            .join(", ");
        parts.push(`字段: ${fields}`);
    }
    if (context.selectedName) {
        parts.push(`选中: ${context.selectedName}`);
    }
    return parts.join(" / ");
};

/**
 * 生成 Mock 响应
 *
 * @param message 用户消息
 * @param context 上下文
 */
export const aiGenerateMockResponse = (
    message: string,
    context?: AiContext | null,
): AiProviderResponse => {
    const lower = (message || "").toLowerCase();
    const ctxDesc = aiDescribeContext(context);
    const ctxPrefix = ctxDesc ? `\n\n> **当前上下文**：${ctxDesc}\n` : "";

    // 关键词匹配
    if (lower.includes("表单") || lower.includes("form")) {
        const action = aiEmbedAction({
            type: "addField",
            description: "建议添加邮箱字段",
            payload: { field: "email", type: "input", label: "邮箱" },
        });
        const text =
            `## 生成表单建议\n` +
            ctxPrefix +
            `\n基于您的需求，建议生成如下表单：\n\n` +
            `- **用户名**：input 类型，必填\n` +
            `- **邮箱**：input 类型，必填，需邮箱格式校验\n` +
            `- **手机号**：input 类型，必填，需手机号格式校验\n` +
            `- **备注**：textarea 类型，选填\n\n` +
            `示例代码：\n\n` +
            "```json\n" +
            `{\n  "fields": [\n    { "name": "username", "type": "input", "required": true },\n    { "name": "email", "type": "input", "required": true }\n  ]\n}\n` +
            "```\n\n" +
            `我还可以为您添加邮箱字段：\n${action}\n`;
        const { actions, cleanedText } = aiParseActions(text);
        return { content: cleanedText, actions };
    }

    if (lower.includes("列表") || lower.includes("list") || lower.includes("table")) {
        const action = aiEmbedAction({
            type: "suggestLayout",
            description: "建议采用分页列表布局",
            payload: { layout: "paginated-table", pageSize: 20 },
        });
        const text =
            `## 生成列表建议\n` +
            ctxPrefix +
            `\n建议生成一个带分页和搜索的列表：\n\n` +
            `1. 顶部搜索栏（关键词、状态筛选）\n` +
            `2. 数据表格（列：名称、状态、创建时间、操作）\n` +
            `3. 底部分页器（每页 20 条）\n\n` +
            `*优化建议*：移动端可改用卡片列表展示。\n\n${action}\n`;
        const { actions, cleanedText } = aiParseActions(text);
        return { content: cleanedText, actions };
    }

    if (lower.includes("校验") || lower.includes("validation") || lower.includes("validate")) {
        const action = aiEmbedAction({
            type: "modifyProperty",
            description: "建议给邮箱字段添加格式校验",
            payload: { field: "email", rule: "email", message: "请输入正确的邮箱格式" },
        });
        const text =
            `## 校验检查结果\n` +
            ctxPrefix +
            `\n当前字段校验情况：\n\n` +
            `- 用户名：仅必填，建议增加长度限制（3-20）\n` +
            `- 邮箱：缺少格式校验 ⚠️\n` +
            `- 手机号：缺少格式校验 ⚠️\n\n` +
            `建议修正：\n${action}\n`;
        const { actions, cleanedText } = aiParseActions(text);
        return { content: cleanedText, actions };
    }

    if (lower.includes("代码") || lower.includes("code") || lower.includes("片段")) {
        const text =
            `## 代码片段\n` +
            ctxPrefix +
            `\n以下是基于当前上下文生成的 Vue 3 片段：\n\n` +
            "```vue\n" +
            `<template>\n  <el-form :model="form" label-width="80px">\n` +
            `    <el-form-item label="用户名">\n      <el-input v-model="form.username" />\n    </el-form-item>\n` +
            `    <el-form-item label="邮箱">\n      <el-input v-model="form.email" />\n    </el-form-item>\n` +
            `  </el-form>\n</template>\n\n` +
            `<script setup lang="ts">\n` +
            `import { reactive } from "vue";\n` +
            `const form = reactive({ username: "", email: "" });\n` +
            `</script>\n` +
            "```\n";
        return { content: text, actions: [] };
    }

    if (lower.includes("字段") || lower.includes("field") || lower.includes("添加")) {
        const action = aiEmbedAction({
            type: "addField",
            description: "建议添加密码字段",
            payload: { field: "password", type: "password", label: "密码", required: true },
        });
        const text =
            `## 添加字段建议\n` +
            ctxPrefix +
            `\n建议添加以下字段：\n\n` +
            `- **密码**：password 类型，必填，最少 8 位\n` +
            `- **确认密码**：password 类型，必填，需与密码一致\n\n` +
            `${action}\n`;
        const { actions, cleanedText } = aiParseActions(text);
        return { content: cleanedText, actions };
    }

    if (lower.includes("布局") || lower.includes("layout") || lower.includes("优化")) {
        const action = aiEmbedAction({
            type: "suggestLayout",
            description: "建议采用两列栅格布局",
            payload: { layout: "grid", cols: 2 },
        });
        const text =
            `## 布局优化建议\n` +
            ctxPrefix +
            `\n分析当前结构后，建议：\n\n` +
            `1. 采用 **两列栅格布局**（el-row + el-col）\n` +
            `2. 主字段在左，辅助字段在右\n` +
            `3. 操作按钮区域固定在底部\n\n` +
            `${action}\n`;
        const { actions, cleanedText } = aiParseActions(text);
        return { content: cleanedText, actions };
    }

    if (lower.includes("重构") || lower.includes("refactor")) {
        const text =
            `## 重构建议\n` +
            ctxPrefix +
            `\n针对当前结构，建议：\n\n` +
            `- 将重复字段封装为子表单组件\n` +
            `- 抽离校验规则到独立文件\n` +
            `- 使用 Composition API 管理状态\n\n` +
            `*重构后可维护性将显著提升。*\n`;
        return { content: text, actions: [] };
    }

    if (lower.includes("解释") || lower.includes("explain") || lower.includes("选中")) {
        const text =
            `## 元素解释\n` +
            ctxPrefix +
            `\n您选中的元素是一个 *表单字段*，它的作用是：\n\n` +
            `- 收集用户输入\n` +
            `- 提供数据校验\n` +
            `- 与后端进行数据交互\n\n` +
            `如需进一步了解，请告诉我具体字段名。\n`;
        return { content: text, actions: [] };
    }

    // 默认响应
    const text =
        `您好！我已收到您的消息：\n\n` +
        `> ${message || "(空)"}\n` +
        ctxPrefix +
        `\n我可以帮您：\n\n` +
        `- 生成表单 / 列表\n` +
        `- 检查校验规则\n` +
        `- 生成代码片段\n` +
        `- 优化布局\n` +
        `- 添加字段\n\n` +
        `请告诉我您想做什么。 🙂\n`;
    return { content: text, actions: [] };
};
