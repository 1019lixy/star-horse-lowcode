<script setup lang="ts" name="AiToolbar">
/**
 * AI Copilot - 顶部工具栏
 *
 * 新会话 / 历史 / 清空 / 设置
 */
import { i18n } from "@/lang";

defineEmits<{
    (e: "new-conversation"): void;
    (e: "toggle-history"): void;
    (e: "clear"): void;
    (e: "open-settings"): void;
}>();

defineProps<{
    /** 历史面板是否展开 */
    historyVisible?: boolean;
}>();
</script>

<template>
    <div class="ai-toolbar">
        <span class="ai-title">{{ i18n("aicopilot.title") }}</span>

        <el-divider direction="vertical" />

        <el-button  type="primary" @click="$emit('new-conversation')">
            <el-icon><Plus /></el-icon>
            {{ i18n("aicopilot.toolbar.new") }}
        </el-button>

        <el-button

            :type="historyVisible ? 'info' : 'default'"
            @click="$emit('toggle-history')"
        >
            <el-icon><Clock /></el-icon>
            {{ i18n("aicopilot.toolbar.history") }}
        </el-button>

        <el-button  @click="$emit('clear')">
            <el-icon><Delete /></el-icon>
            {{ i18n("aicopilot.toolbar.clear") }}
        </el-button>

        <div class="ai-spacer" />

        <el-button  @click="$emit('open-settings')" :title="i18n('aicopilot.toolbar.settings')">
            <el-icon><Setting /></el-icon>
            {{ i18n("aicopilot.toolbar.settings") }}
        </el-button>
    </div>
</template>

<script lang="ts">
import { Clock, Delete, Plus, Setting } from "@element-plus/icons-vue";
export default { components: { Clock, Delete, Plus, Setting } };
</script>

<style lang="scss" scoped>
.ai-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;

    .ai-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
    }

    .ai-spacer {
        flex: 1;
    }
}
</style>
