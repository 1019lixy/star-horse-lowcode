<script setup lang="ts">
/**
 * ShDemoToolbar - 声明式工具栏（16 个高级组件 Demo 通用）
 *
 * 统一 el-icon + el-tooltip + i18n + 暗色变量。
 * 通过 ShDemoAction[] 声明按钮，自动按 group 字段归入 el-button-group，
 * iconOnly 按钮强制 el-tooltip 包裹。
 */
import { computed } from "vue";
import { i18n } from "@/lang";
import { groupActions } from "./demoTypes";
import type { ShDemoAction, ShDemoToolbarProps } from "./demoTypes";

const props = withDefaults(defineProps<ShDemoToolbarProps>(), {
    actions: () => [],
    secondaryActions: () => [],
});

const emit = defineEmits<{
    (e: "action", key: string, payload: MouseEvent): void;
}>();

/** i18n 翻译（key 已在 zh_CN 中声明，运行时由 langSet 提供） */
const t = (key?: string): string => {
    if (!key) return "";
    // i18n 函数签名要求 keyof typeof zh_CN，运行时 langSet 是 Record<string, string>
    // 此处用 as any 绕过编译期检查，缺失 key 会返回 undefined → 降级为空串
    const val = (i18n as unknown as (k: string) => string | undefined)(key);
    return val ?? key;
};

const groupedActions = computed(() => groupActions(props.actions));
const groupedSecondary = computed(() => groupActions(props.secondaryActions));

const onClick = (action: ShDemoAction, e: MouseEvent): void => {
    if (action.disabled) return;
    emit("action", action.key, e);
};
</script>

<template>
    <div class="sh-demo-toolbar">
        <div v-if="titleKey" class="toolbar-title">{{ t(titleKey) }}</div>

        <div v-if="actions.length" class="toolbar-actions">
            <template v-for="(grp, idx) in groupedActions" :key="`a-${idx}`">
                <el-divider
                    v-if="grp.items[0]?.dividerBefore && idx > 0"
                    direction="vertical"
                />
                <el-button-group v-if="grp.group">
                    <el-tooltip
                        v-for="action in grp.items"
                        :key="action.key"
                        :content="t(action.tooltipKey || action.labelKey)"
                        :disabled="!action.iconOnly && !!action.labelKey"
                        placement="bottom"
                    >
                        <el-button
                            :type="action.type || 'default'"
                            :disabled="action.disabled"
                            :class="{ 'is-active': action.active }"
                            size="small"
                            @click="onClick(action, $event)"
                        >
                            <el-icon v-if="action.icon">
                                <component :is="action.icon" />
                            </el-icon>
                            <span
                                v-if="!action.iconOnly && action.labelKey"
                                class="btn-label"
                            >{{ t(action.labelKey) }}</span>
                        </el-button>
                    </el-tooltip>
                </el-button-group>
                <template v-else>
                    <el-tooltip
                        v-for="action in grp.items"
                        :key="action.key"
                        :content="t(action.tooltipKey || action.labelKey)"
                        :disabled="!action.iconOnly && !!action.labelKey"
                        placement="bottom"
                    >
                        <el-button
                            :type="action.type || 'default'"
                            :disabled="action.disabled"
                            :class="{ 'is-active': action.active }"
                            size="small"
                            @click="onClick(action, $event)"
                        >
                            <el-icon v-if="action.icon">
                                <component :is="action.icon" />
                            </el-icon>
                            <span
                                v-if="!action.iconOnly && action.labelKey"
                                class="btn-label"
                            >{{ t(action.labelKey) }}</span>
                        </el-button>
                    </el-tooltip>
                </template>
            </template>
        </div>

        <div v-if="secondaryActions.length" class="toolbar-secondary">
            <template v-for="(grp, idx) in groupedSecondary" :key="`s-${idx}`">
                <el-divider
                    v-if="grp.items[0]?.dividerBefore && idx > 0"
                    direction="vertical"
                />
                <el-button-group v-if="grp.group">
                    <el-tooltip
                        v-for="action in grp.items"
                        :key="action.key"
                        :content="t(action.tooltipKey || action.labelKey)"
                        :disabled="!action.iconOnly && !!action.labelKey"
                        placement="bottom"
                    >
                        <el-button
                            :type="action.type || 'default'"
                            :disabled="action.disabled"
                            :class="{ 'is-active': action.active }"
                            size="small"
                            @click="onClick(action, $event)"
                        >
                            <el-icon v-if="action.icon">
                                <component :is="action.icon" />
                            </el-icon>
                            <span
                                v-if="!action.iconOnly && action.labelKey"
                                class="btn-label"
                            >{{ t(action.labelKey) }}</span>
                        </el-button>
                    </el-tooltip>
                </el-button-group>
                <template v-else>
                    <el-tooltip
                        v-for="action in grp.items"
                        :key="action.key"
                        :content="t(action.tooltipKey || action.labelKey)"
                        :disabled="!action.iconOnly && !!action.labelKey"
                        placement="bottom"
                    >
                        <el-button
                            :type="action.type || 'default'"
                            :disabled="action.disabled"
                            :class="{ 'is-active': action.active }"
                            size="small"
                            @click="onClick(action, $event)"
                        >
                            <el-icon v-if="action.icon">
                                <component :is="action.icon" />
                            </el-icon>
                            <span
                                v-if="!action.iconOnly && action.labelKey"
                                class="btn-label"
                            >{{ t(action.labelKey) }}</span>
                        </el-button>
                    </el-tooltip>
                </template>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.sh-demo-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;
    min-height: 40px;
    box-sizing: border-box;

    .toolbar-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-right: 4px;
        white-space: nowrap;
    }

    .toolbar-actions,
    .toolbar-secondary {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
    }

    .toolbar-secondary {
        margin-left: auto;
    }

    .btn-label {
        margin-left: 4px;
    }

    :deep(.is-active) {
        background: var(--el-color-primary-light-8);
        color: var(--el-color-primary);
        border-color: var(--el-color-primary-light-5);
    }

    :deep(.is-active:hover) {
        background: var(--el-color-primary-light-7);
        color: var(--el-color-primary);
    }

    :deep(.el-divider--vertical) {
        height: 16px;
        margin: 0 4px;
    }

    :deep(.el-button-group) {
        display: inline-flex;
        align-items: center;
    }

    :deep(.el-button) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
