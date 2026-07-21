<script setup lang="ts" name="KanbanToolbar">
import { i18n } from "@/lang";
import type { KanbanDesigner } from "../composables/useKanbanDesigner";

defineProps<{
    designer: KanbanDesigner;
    readonly?: boolean;
    hasCollapsed?: boolean;
    canAddCard?: boolean;
}>();

const emit = defineEmits<{
    (e: "save"): void;
    (e: "add-card"): void;
    (e: "expand-all"): void;
}>();

/** 内联 SVG 图标 */
const icons: Record<string, string> = {
    undo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4"/></svg>',
    redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10H11a5 5 0 00-5 5v2M21 10l-4-4M21 10l-4 4"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    column: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="6" height="18" rx="1"/><rect x="9" y="3" width="6" height="18" rx="1"/><rect x="16" y="3" width="6" height="18" rx="1"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1" fill="currentColor"/></svg>',
    priority: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>',
    save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
    expandAll: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 19l-7-7 7-7"/><path d="M22 19l-7-7 7-7"/></svg>',
};
</script>

<template>
    <div class="kanban-toolbar">
        <div class="left-group">
            <el-button size="small" :disabled="readonly" @click="designer.undo()">
                <span class="svg-icon" v-html="icons.undo"></span>
                {{ i18n("kanban.btn.undo") }}
            </el-button>
            <el-button size="small" :disabled="readonly" @click="designer.redo()">
                <span class="svg-icon" v-html="icons.redo"></span>
                {{ i18n("kanban.btn.redo") }}
            </el-button>
            <el-button size="small" :disabled="readonly" @click="emit('add-card')" v-if="canAddCard">
                <span class="svg-icon" v-html="icons.plus"></span>
                {{ i18n("kanban.btn.addCard") }}
            </el-button>
            <el-button size="small" :disabled="readonly" @click="designer.addColumn()">
                <span class="svg-icon" v-html="icons.column"></span>
                {{ i18n("kanban.btn.addColumn") }}
            </el-button>
            <el-button
                v-if="hasCollapsed"
                size="small"
                @click="emit('expand-all')"
                :title="i18n('kanban.btn.expandAll')"
            >
                <span class="svg-icon" v-html="icons.expandAll"></span>
                {{ i18n("kanban.btn.expandAll") }}
            </el-button>
        </div>

        <div class="right-group">
            <el-tooltip :content="i18n('kanban.btn.showAvatar')">
                <el-button size="small"
                    :type="designer.state.config.showAvatar ? 'primary' : 'default'"
                    @click="designer.updateConfig({ showAvatar: !designer.state.config.showAvatar })"
                >
                    <span class="svg-icon" v-html="icons.user"></span>
                </el-button>
            </el-tooltip>
            <el-tooltip :content="i18n('kanban.btn.showLabels')">
                <el-button size="small"
                    :type="designer.state.config.showLabels ? 'primary' : 'default'"
                    @click="designer.updateConfig({ showLabels: !designer.state.config.showLabels })"
                >
                    <span class="svg-icon" v-html="icons.tag"></span>
                </el-button>
            </el-tooltip>
            <el-tooltip :content="i18n('kanban.btn.showPriority')">
                <el-button size="small"
                    :type="designer.state.config.showPriority ? 'primary' : 'default'"
                    @click="designer.updateConfig({ showPriority: !designer.state.config.showPriority })"
                >
                    <span class="svg-icon" v-html="icons.priority"></span>
                </el-button>
            </el-tooltip>
            <el-button size="small" type="primary" :disabled="readonly" @click="emit('save')">
                <span class="svg-icon" v-html="icons.save"></span>
                {{ i18n("dialog.save") }}
            </el-button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.kanban-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color);
    flex-wrap: wrap;
    gap: 8px;

    .left-group,
    .right-group {
        display: flex;
        align-items: center;
        gap: 8px;
    }
}
.svg-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    margin-right: 4px;
}
.svg-icon :deep(svg) {
    width: 100%;
    height: 100%;
}
</style>
