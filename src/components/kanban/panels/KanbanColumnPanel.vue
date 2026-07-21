<script setup lang="ts" name="KanbanColumnPanel">
import {computed} from "vue";
import {i18n} from "@/lang";
import draggable from "vuedraggable-es";
import type {KanbanDesigner} from "../composables/useKanbanDesigner";
import {KANBAN_PRIORITY_PRESETS} from "../constants";
import type {KanbanCard, KanbanColumn} from "../types";
import {StarHorseIcon} from "@/components/comp";

const props = withDefaults(defineProps<{
  column: KanbanColumn;
  designer: KanbanDesigner;
  readonly?: boolean;
  collapsed?: boolean;
  /** 是否允许添加卡片 */
  canAddCard?: boolean;
  /** 是否允许删除卡片 */
  canDeleteCard?: boolean;
  /** 是否允许拖拽卡片（跨列/列内排序） */
  canDragCard?: boolean;
}>(), {
  readonly: false,
  collapsed: false,
  canAddCard: true,
  canDeleteCard: true,
  canDragCard: true,
});

const emit = defineEmits<{
  (e: "edit", cardId: string): void;
  (e: "editColumn", columnId: string): void;
  (e: "addCard", columnId: string): void;
  (e: "toggleCollapse", columnId: string): void;
  (e: "reorderColumn", sourceId: string, targetId: string): void;
  (e: "deleteCard", cardId: string): void;
}>();

/* ── 列拖拽排序（HTML5 Drag & Drop） ── */
const onDragStart = (e: DragEvent) => {
  if (props.readonly) return;
  e.dataTransfer!.setData("text/plain", props.column.id);
  e.dataTransfer!.effectAllowed = "move";
  (e.currentTarget as HTMLElement).classList.add("column-dragging");
};

const onDragEnd = (e: DragEvent) => {
  (e.currentTarget as HTMLElement).classList.remove("column-dragging");
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  e.dataTransfer!.dropEffect = "move";
};

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  const sourceId = e.dataTransfer!.getData("text/plain");
  if (sourceId && sourceId !== props.column.id) {
    emit("reorderColumn", sourceId, props.column.id);
  }
};

/** 列内卡片（双向绑定的 list，draggable 需要） */
const cards = computed({
  get: () => props.designer.getCardsByColumn(props.column.id),
  set: (val: KanbanCard[]) => {
    val.forEach((c, idx) => {
      const target = props.designer.state.cards.find((cc) => cc.id === c.id);
      if (target) {
        if (target.columnId !== props.column.id) {
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
  disabled: props.readonly || !props.canDragCard || !props.designer.state.config.draggable,
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

const handleDeleteCard = (card: KanbanCard, e: MouseEvent) => {
  e.stopPropagation();
  emit("deleteCard", card.id);
};

/** 截止日期是否过期 */
const isOverdue = (dueDate?: string): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

/** 内联 SVG 图标 */
const icons: Record<string, string> = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  delete: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6M10 11v6M14 11v6"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  setting: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  collapseLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 19l-7-7 7-7M22 19l-7-7 7-7"/></svg>',
  collapseRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 5l7 7-7 7M2 5l7 7-7 7"/></svg>',
  dragHandle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="6" r="1.5" fill="currentColor"/><circle cx="15" cy="6" r="1.5" fill="currentColor"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><circle cx="9" cy="18" r="1.5" fill="currentColor"/><circle cx="15" cy="18" r="1.5" fill="currentColor"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>',
};
</script>

<template>
  <!-- 收起状态 -->
  <div
      v-if="collapsed"
      class="kanban-column-panel collapsed"
      :style="{ borderLeftColor: column.color }"
      draggable="true"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      @dragover="onDragOver"
      @drop="onDrop"
  >
    <div class="collapsed-header" @click="emit('toggleCollapse', column.id)">
      <span class="collapse-icon" v-html="icons.collapseRight"></span>
    </div>
    <div class="collapsed-body">
      <span class="collapsed-name">{{ column.name }}</span>
      <el-tag size="small" :type="wipStatus.exceeded ? 'danger' : 'info'">
        {{ wipStatus.current }}
      </el-tag>
    </div>
  </div>

  <!-- 展开状态 -->
  <div v-else class="kanban-column-panel">
    <div
        class="column-header"
        :style="{ borderTopColor: column.color }"
        draggable="true"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
        @dragover="onDragOver"
        @drop="onDrop"
    >
      <div class="column-title">
        <span class="drag-handle" v-if="!readonly" v-html="icons.dragHandle"></span>
        <span class="title-text">{{ column.name }}</span>
        <el-tag size="small" :type="wipStatus.exceeded ? 'danger' : 'info'">
          {{ wipStatus.current }}{{ wipStatus.max ? `/${wipStatus.max}` : "" }}
        </el-tag>
      </div>
      <div class="column-actions" v-if="!readonly">
        <el-button size="small" text @click="handleAddCard" v-if="canAddCard">
          <span class="svg-icon" v-html="icons.plus"></span>
        </el-button>
        <el-button size="small" text @click="emit('toggleCollapse', column.id)" :title="i18n('kanban.btn.collapse')">
          <span class="svg-icon" v-html="icons.collapseLeft"></span>
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
      <div class="card-scroll">
        <draggable
            v-model="cards"
            v-bind="dragOptions"
            :item-key="(card: KanbanCard) => card.id"
            class="card-list"
        >
          <template #item="{ element }">
            <div
                class="kanban-card"
                :class="{
                                selected: element.id === designer.selectedCardId,
                                'priority-urgent': element.priority === 'urgent',
                                'priority-high': element.priority === 'high',
                                overdue: isOverdue(element.dueDate),
                            }"
                @click="handleCardClick(element)"
                @dblclick="handleCardDblClick(element)"
            >
              <div class="card-priority-bar" :style="{ backgroundColor: getPriorityColor(element.priority) }"/>

              <div class="card-content">
                <!-- 标题行 + 操作按钮 -->
                <div class="card-header-row">
                  <div class="card-title">{{ element.title }}</div>
                  <div class="card-actions" v-if="!readonly">
                    <star-horse-icon @click.stop="handleCardDblClick(element)"
                                     cursor="pointer"
                                     :title="i18n('kanban.btn.editCard')" iconClass="edit"/>
                    &nbsp;&nbsp;
                    <star-horse-icon @click.stop="handleDeleteCard(element, $event)"
                                     cursor="pointer"
                                     :title="i18n('kanban.btn.deleteCard')" v-if="canDeleteCard" iconClass="delete"
                                     color="var(--el-color-danger)"/>
                  </div>
                </div>

                <div class="card-description" v-if="element.description">
                  {{ element.description }}
                </div>

                <div class="card-labels" v-if="designer.state.config.showLabels && element.labels?.length">
                  <el-tag
                      v-for="(label, idx) in element.labels"
                      :key="idx"
                      :color="label.color"
                      effect="dark"
                      size="small"
                  >
                    {{ label.text }}
                  </el-tag>
                </div>

                <div class="card-footer">
                  <el-tag
                      v-if="designer.state.config.showPriority"
                      :color="getPriorityColor(element.priority)"
                      effect="dark"
                      size="small"
                  >
                    {{ getPriorityLabel(element.priority) }}
                  </el-tag>
                  <div class="card-meta">
                                        <span
                                            v-if="designer.state.config.showDueDate && element.dueDate"
                                            class="meta-item"
                                            :class="{ overdue: isOverdue(element.dueDate) }"
                                        >
                                            <span class="svg-icon small" v-html="icons.calendar"></span>
                                            {{ element.dueDate }}
                                        </span>
                    <span v-if="designer.state.config.showEstimate && element.estimate" class="meta-item">
                                            <span class="svg-icon small" v-html="icons.clock"></span>
                                            {{ element.estimate }}h
                                        </span>
                    <el-tooltip
                        v-if="designer.state.config.showAvatar && element.assignee"
                        :content="`${i18n('kanban.card.assignee')}: ${element.assignee}`"
                        placement="top"
                    >
                      <el-avatar :size="20" :src="element.avatar">
                        {{ element.assignee.charAt(0).toUpperCase() }}
                      </el-avatar>
                    </el-tooltip>
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

      <!-- 底部添加卡片：始终固定在底部 -->
      <div class="column-bottom-add" v-if="!readonly && canAddCard">
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
  overflow: hidden;
  border-top: 3px solid var(--el-color-primary);

  &.column-dragging {
    opacity: 0.5;
  }

  /* ── 收起状态 ── */
  &.collapsed {
    background: var(--el-bg-color);
    border-top: none;
    border-left: 3px solid var(--el-color-primary);
    border-radius: 4px;
    cursor: pointer;
    align-items: center;

    .collapsed-header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px 2px;
      border-bottom: 1px solid var(--el-border-color-lighter);
      width: 100%;

      .collapse-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;

        :deep(svg) {
          width: 100%;
          height: 100%;
        }
      }
    }

    .collapsed-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 0;
      writing-mode: vertical-rl;
      gap: 8px;

      .collapsed-name {
        font-weight: 600;
        font-size: 13px;
        color: var(--el-text-color-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &:hover {
      background: var(--el-fill-color-light);
    }
  }

  /* ── 展开状态 ── */
  .column-header {
    padding: 8px 12px;
    background: var(--el-bg-color);
    border-top: 3px solid var(--el-color-primary);
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    .column-title {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;

      .drag-handle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
        flex-shrink: 0;
        opacity: 0.4;
        cursor: grab;

        :deep(svg) {
          width: 100%;
          height: 100%;
        }

        &:hover {
          opacity: 0.8;
        }
      }

      .title-text {
        font-weight: 600;
        font-size: 14px;
        flex: 1;
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
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;

    .card-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      min-height: 0;

      .card-list {
        min-height: 100%;
      }

      .kanban-card {
        background: var(--el-bg-color);
        border-radius: 6px;
        margin-bottom: 8px;
        cursor: pointer;
        border: 1px solid var(--el-border-color-lighter);
        transition: box-shadow 0.2s, border-color 0.2s;
        position: relative;

        &:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }


        &.selected {
          border-color: var(--el-color-primary);
          box-shadow: 0 0 0 1px var(--el-color-primary);
        }

        &.card-ghost {
          opacity: 0.4;
          border-style: dashed;
        }

        &.overdue .card-footer .meta-item.overdue {
          color: var(--el-color-danger);
          font-weight: 500;
        }

        .card-priority-bar {
          height: 3px;
          border-radius: 6px 6px 0 0;
        }

        .card-content {
          padding: 8px 10px;

          .card-header-row {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 4px;
            margin-bottom: 4px;

            .card-title {
              font-size: 13px;
              font-weight: 500;
              color: var(--el-text-color-primary);
              flex: 1;
              line-height: 1.4;
            }

            .card-actions {
              display: flex;
              align-items: center;
              gap: 0;
              opacity: 0;
              transition: opacity 0.15s;
              flex-shrink: 0;

              &:hover {
                opacity: 1;
              }
            }
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
            line-height: 1.5;
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
        padding: 24px 0;
        font-size: 13px;
      }
    }

    .column-bottom-add {
      flex-shrink: 0;
      padding: 6px 8px;
      text-align: center;
      color: var(--el-text-color-secondary);
      background: var(--el-fill-color-light);
      border-top: 1px solid var(--el-border-color-lighter);
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

.svg-icon.tiny {
  width: 0.75em;
  height: 0.75em;
  margin-right: 2px;
}

.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
