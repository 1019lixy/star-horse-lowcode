<script setup lang="ts" name="KanbanBoard">
import { ref, reactive } from "vue";
import { i18n } from "@/lang";
import { useKanbanDesigner } from "./composables/useKanbanDesigner";
import KanbanToolbar from "./panels/KanbanToolbar.vue";
import KanbanColumnPanel from "./panels/KanbanColumnPanel.vue";
import KanbanCardDialog from "./dialogs/KanbanCardDialog.vue";
import KanbanColumnDialog from "./dialogs/KanbanColumnDialog.vue";
import type { KanbanData } from "./types";

const props = withDefaults(defineProps<{
    kanban?: KanbanData;
    initialKanban?: Partial<KanbanData>;
    readonly?: boolean;
    /** 是否允许添加卡片 */
    canAddCard?: boolean;
    /** 是否允许删除卡片 */
    canDeleteCard?: boolean;
    /** 是否允许拖拽卡片 */
    canDragCard?: boolean;
}>(), {
    readonly: false,
    canAddCard: true,
    canDeleteCard: true,
    canDragCard: true,
});

const emits = defineEmits<{
    (e: "update:kanban", v: KanbanData): void;
    (e: "save", v: KanbanData): void;
}>();

const designer = useKanbanDesigner(props.initialKanban || props.kanban);
if (props.kanban) designer.loadData(props.kanban);

const cardDialogVisible = ref(false);
const editingCardId = ref<string | null>(null);
const presetColumnId = ref<string | undefined>(undefined);
const editingColumnId = ref<string | null>(null);
const columnDialogVisible = ref(false);

/** 列收起状态 */
const collapsedIds = reactive<Set<string>>(new Set());

const toggleCollapse = (columnId: string) => {
    if (collapsedIds.has(columnId)) {
        collapsedIds.delete(columnId);
    } else {
        collapsedIds.add(columnId);
    }
};

const expandAll = () => { collapsedIds.clear(); };
const hasCollapsed = () => collapsedIds.size > 0;

/** 列拖拽排序 */
const handleReorderColumn = (sourceId: string, targetId: string) => {
    const sorted = designer.sortedColumns.value;
    const targetIndex = sorted.findIndex((c) => c.id === targetId);
    if (targetIndex >= 0) {
        designer.moveColumn(sourceId, targetIndex);
    }
};

const handleEditCard = (id: string) => {
    editingCardId.value = id;
    presetColumnId.value = undefined;
    cardDialogVisible.value = true;
};

const handleAddCard = (columnId?: string) => {
    editingCardId.value = null;
    presetColumnId.value = columnId;
    cardDialogVisible.value = true;
};

const handleDeleteCard = (cardId: string) => {
    designer.removeCard(cardId);
};

const handleEditColumn = (id: string) => {
    editingColumnId.value = id;
    columnDialogVisible.value = true;
};

const handleSave = () => {
    const data = designer.getData();
    emits("update:kanban", data);
    emits("save", data);
};

/** 内联 SVG 图标 */
const icons: Record<string, string> = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
};
</script>

<template>
    <div class="kanban-board">
        <kanban-toolbar
            :designer="designer"
            :readonly="readonly"
            :can-add-card="canAddCard"
            :has-collapsed="hasCollapsed()"
            :title="initialKanban.name"
            @save="handleSave"
            @add-card="handleAddCard()"
            @expand-all="expandAll"
        />
        <div class="board-body">
            <el-splitter direction="horizontal">
                <el-splitter-panel
                    v-for="col in designer.sortedColumns.value"
                    :key="col.id"
                    :size="collapsedIds.has(col.id) ? '48px' : '280px'"
                    :min="collapsedIds.has(col.id) ? '48px' : '180px'"
                    :max="collapsedIds.has(col.id) ? '48px' : '500px'"
                >
                    <kanban-column-panel
                        :column="col"
                        :designer="designer"
                        :readonly="readonly"
                        :collapsed="collapsedIds.has(col.id)"
                        :can-add-card="canAddCard"
                        :can-delete-card="canDeleteCard"
                        :can-drag-card="canDragCard"
                        @edit="handleEditCard"
                        @edit-column="handleEditColumn"
                        @add-card="handleAddCard"
                        @delete-card="handleDeleteCard"
                        @toggle-collapse="toggleCollapse"
                        @reorder-column="handleReorderColumn"
                    />
                </el-splitter-panel>
                <el-splitter-panel size="auto" min="60px" v-if="!readonly">
                    <div class="add-column-btn">
                        <el-button @click="designer.addColumn()">
                            <span class="svg-icon" v-html="icons.plus"></span>
                            {{ i18n("kanban.btn.addColumn") }}
                        </el-button>
                    </div>
                </el-splitter-panel>
            </el-splitter>
        </div>

        <kanban-card-dialog
            v-model:visible="cardDialogVisible"
            :designer="designer"
            :card-id="editingCardId"
            :column-id="presetColumnId"
        />
        <kanban-column-dialog
            v-model:visible="columnDialogVisible"
            :designer="designer"
            :column-id="editingColumnId"
        />
    </div>
</template>

<style lang="scss" scoped>
.kanban-board {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--el-bg-color-page);
    overflow: hidden;

    .board-body {
        flex: 1;
        overflow: hidden;
        padding: 0;

        .add-column-btn {
            display: flex;
            align-items: flex-start;
            padding: 12px;
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
.svg-icon :deep(svg) {
    width: 100%;
    height: 100%;
}
</style>
