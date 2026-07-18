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
    const card = props.designer.addCard(props.column.id);
    emit("edit", card.id);
};
</script>

<template>
    <div class="kanban-column-panel" :style="{ width: `${designer.state.config.columnWidth}px` }">
        <div class="column-header" :style="{ borderTopColor: column.color }">
            <div class="column-title">
                <span class="title-text">{{ column.name }}</span>
                <el-tag  :type="wipStatus.exceeded ? 'danger' : 'info'">
                    {{ wipStatus.current }}{{ wipStatus.max ? `/${wipStatus.max}` : "" }}
                </el-tag>
            </div>
            <div class="column-actions" v-if="!readonly">
                <el-button  text @click="handleAddCard">
                    <el-icon><Plus/></el-icon>
                </el-button>
                <el-button
                    v-if="column.removable"

                    text
                    @click="designer.removeColumn(column.id)"
                >
                    <el-icon><Delete/></el-icon>
                </el-button>
                <el-button  text @click="emit('editColumn', column.id)">
                    <el-icon><Setting/></el-icon>
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
                                        <el-icon><Calendar/></el-icon>
                                        {{ element.dueDate }}
                                    </span>
                                    <span v-if="designer.state.config.showEstimate && element.estimate" class="meta-item">
                                        <el-icon><Clock/></el-icon>
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
        </div>
    </div>
</template>

<script lang="ts">
import { Plus, Delete, Setting, Calendar, Clock } from "@element-plus/icons-vue";
export default { components: { Plus, Delete, Setting, Calendar, Clock } };
</script>

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
    }
}
</style>
