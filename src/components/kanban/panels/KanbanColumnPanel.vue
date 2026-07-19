<script setup lang="ts" name="KanbanColumnPanel">
import { computed } from "vue";
import { i18n } from "@/lang";
import draggable from "vuedraggable-es";
import type { KanbanDesigner } from "../composables/useKanbanDesigner";
import { KANBAN_PRIORITY_PRESETS } from "../constants";
import type { KanbanCard, KanbanColumn } from "../types";

const props = defineProps<{
    column: KanbanColumn;
    designer: KanbanDesigner;
    readonly?: boolean;
}>();

const emit = defineEmits<{
    (e: "edit", cardId: string): void;
    (e: "editColumn", columnId: string): void;
    (e: "addCard", columnId: string): void;
}>();

/** 列内卡片（双向绑定的 list，draggable 需要） */
const cards = computed({
    get: () => props.designer.getCardsByColumn(props.column.id),
    set: (val: KanbanCard[]) => {
        // draggable 完成拖拽后，按新顺序更新 order
        val.forEach((c, idx) => {
            const target = props.designer.state.cards.find((cc) => cc.id === c.id);
            if (target) {
                if (target.columnId !== props.column.id) {
                    // 跨列移动
                    props.designer.moveCard(c.id, props.column.id, idx);
                } else {
                    target.order = idx;
                }
            }
        });
    },
});

/** WIP 限制状态 */
const wipStatus = computed(() => props.designer.checkWipLimit(props.column.id));

/** 优先级颜色 */
const getPriorityColor = (priority: string) =>
    KANBAN_PRIORITY_PRESETS.find((p) => p.value === priority)?.color ?? "#909399";

/** 优先级标签 */
const getPriorityLabel = (priority: string) =>
    KANBAN_PRIORITY_PRESETS.find((p) => p.value === priority)?.label ?? priority;

/** 拖拽配置 */
const dragOptions = computed(() => ({
    group: "kanban-cards",
    disabled: props.readonly || !props.designer.state.config.draggable,
    ghostClass: "card-ghost",
    animation: 150,
}));

const handleCardClick = (card: KanbanCard) => {
    props.designer.selectCard(card.id);
};

const handleCardDblClick = (card: KanbanCard) => {
    emit("edit", card.id);
};

const handleAddCard = () => {
    emit("addCard", props.column.id);
};

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    delete: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6M10 11v6M14 11v6"/></svg>',
    setting: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
};
</script>

<template>
    <div class="kanban-column-panel" :style="{ width: `${designer.state.config.columnWidth}px` }">
        <div class="column-header" :style="{ borderTopColor: column.color }">
            <div class="column-title">
                <span class="title-text">{{ column.name }}</span>
                <el-tag :type="wipStatus.exceeded ? 'danger' : 'info'">
                    {{ wipStatus.current }}{{ wipStatus.max ? `/${wipStatus.max}` : "" }}
                </el-tag>
            </div>
            <div class="column-actions" v-if="!readonly">
                <el-button size="small" text @click="handleAddCard">
                    <span class="svg-icon" v-html="icons.plus"></span>
                    {{ i18n("kanban.btn.addCard") }}
                </el-button>
                <el-button
                    v-if="column.removable"
                    size="small"
                    text
                    type="danger"
                    @click="designer.removeColumn(column.id)"
                >
                    <span class="svg-icon" v-html="icons.delete"></span>
                </el-button>
                <el-button size="small" text @click="emit('editColumn', column.id)">
                    <span class="svg-icon" v-html="icons.setting"></span>
                </el-button>
            </div>
        </div>

        <div class="column-body">
            <draggable
                v-model="cards"
                v-bind="dragOptions"
                :item-key="(card: KanbanCard) => card.id"
                class="card-list"
            >
                <template #item="{ element }">
                    <div
                        class="kanban-card"
                        :class="{ selected: element.id === designer.selectedCardId }"
                        @click="handleCardClick(element)"
                        @dblclick="handleCardDblClick(element)"
                    >
                        <div class="card-priority-bar" :style="{ backgroundColor: getPriorityColor(element.priority) }"/>

                        <div class="card-content">
                            <div class="card-title">{{ element.title }}</div>
                            <div class="card-description" v-if="element.description">
                                {{ element.description }}
                            </div>

                            <div class="card-labels" v-if="designer.state.config.showLabels && element.labels?.length">
                                <el-tag
                                    v-for="(label, idx) in element.labels"
                                    :key="idx"
                                    :color="label.color"
                                    effect="dark"
                                >
                                    {{ label.text }}
                                </el-tag>
                            </div>

                            <div class="card-footer">
                                <el-tag
                                    v-if="designer.state.config.showPriority"
                                    :color="getPriorityColor(element.priority)"
                                    effect="dark"
                                >
                                    {{ getPriorityLabel(element.priority) }}
                                </el-tag>
                                <div class="card-meta">
                                    <span v-if="designer.state.config.showDueDate && element.dueDate" class="meta-item">
                                        <span class="svg-icon small" v-html="icons.calendar"></span>
                                        {{ element.dueDate }}
                                    </span>
                                    <span v-if="designer.state.config.showEstimate && element.estimate" class="meta-item">
                                        <span class="svg-icon small" v-html="icons.clock"></span>
                                        {{ element.estimate }}h
                                    </span>
                                    <el-avatar
                                        v-if="designer.state.config.showAvatar && element.assignee"
                                        :size="20"
                                        :src="element.avatar"
                                    >
                                        {{ element.assignee.charAt(0).toUpperCase() }}
                                    </el-avatar>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </draggable>

            <div class="empty-tip" v-if="cards.length === 0">
                {{ i18n("kanban.column.empty") }}
            </div>

            <div class="column-bottom-add" v-if="!readonly">
                <el-button size="small" text @click="handleAddCard">
                    <span class="svg-icon" v-html="icons.plus"></span>
                    {{ i18n("kanban.btn.addCard") }}
                </el-button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.kanban-column-panel {
    display: flex;
    flex-direction: column;
    background: var(--el-fill-color-light);
    border-radius: 6px;
    height: 100%;
    margin-right: 12px;
    overflow: hidden;

    .column-header {
        padding: 8px 12px;
        background: var(--el-bg-color);
        border-top: 3px solid var(--el-color-primary);
        border-bottom: 1px solid var(--el-border-color-lighter);

        .column-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 4px;

            .title-text {
                font-weight: 600;
                font-size: 14px;
            }
        }

        .column-actions {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 2px;
        }
    }

    .column-body {
        flex: 1;
        overflow-y: auto;
        padding: 8px;

        .card-list {
            min-height: 100%;
        }

        .kanban-card {
            background: var(--el-bg-color);
            border-radius: 4px;
            margin-bottom: 8px;
            cursor: pointer;
            border: 1px solid var(--el-border-color-lighter);
            transition: box-shadow 0.2s;

            &:hover {
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }

            &.selected {
                border-color: var(--el-color-primary);
            }

            &.card-ghost {
                opacity: 0.5;
            }

            .card-priority-bar {
                height: 3px;
                border-radius: 4px 4px 0 0;
            }

            .card-content {
                padding: 8px 10px;

                .card-title {
                    font-size: 13px;
                    font-weight: 500;
                    margin-bottom: 4px;
                    color: var(--el-text-color-primary);
                }

                .card-description {
                    font-size: 12px;
                    color: var(--el-text-color-secondary);
                    margin-bottom: 6px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }

                .card-labels {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    margin-bottom: 6px;
                }

                .card-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .card-meta {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 12px;
                        color: var(--el-text-color-secondary);

                        .meta-item {
                            display: flex;
                            align-items: center;
                            gap: 2px;
                        }
                    }
                }
            }
        }

        .empty-tip {
            text-align: center;
            color: var(--el-text-color-placeholder);
            padding: 12px 0;
            font-size: 12px;
        }

        .column-bottom-add {
            padding: 4px 0;
            text-align: center;
            color: var(--el-text-color-secondary);
        }
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
.svg-icon.small {
    width: 0.85em;
    height: 0.85em;
    margin-right: 2px;
}
.svg-icon :deep(svg) {
    width: 100%;
    height: 100%;
}
</style>
