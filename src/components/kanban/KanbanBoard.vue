<script setup lang="ts" name="KanbanBoard">
import { ref } from "vue";
import { i18n } from "@/lang";
import { useKanbanDesigner } from "./composables/useKanbanDesigner";
import KanbanToolbar from "./panels/KanbanToolbar.vue";
import KanbanColumnPanel from "./panels/KanbanColumnPanel.vue";
import KanbanCardDialog from "./dialogs/KanbanCardDialog.vue";
import KanbanColumnDialog from "./dialogs/KanbanColumnDialog.vue";
import type { KanbanData } from "./types";

const props = defineProps<{
    kanban?: KanbanData;
    initialKanban?: Partial<KanbanData>;
    readonly?: boolean;
}>();

const emits = defineEmits<{
    (e: "update:kanban", v: KanbanData): void;
    (e: "save", v: KanbanData): void;
}>();

const designer = useKanbanDesigner(props.initialKanban || props.kanban);
if (props.kanban) designer.loadData(props.kanban);

const cardDialogVisible = ref(false);
const editingCardId = ref<string | null>(null);
const editingColumnId = ref<string | null>(null);
const columnDialogVisible = ref(false);

const handleEditCard = (id: string) => {
    editingCardId.value = id;
    cardDialogVisible.value = true;
};

const handleAddCardToFirstColumn = () => {
    editingCardId.value = null;
    cardDialogVisible.value = true;
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
</script>

<template>
    <div class="kanban-board">
        <kanban-toolbar
            :designer="designer"
            :readonly="readonly"
            @save="handleSave"
            @preview="handleAddCardToFirstColumn"
        />
        <div class="board-body">
            <div class="columns-container">
                <kanban-column-panel
                    v-for="col in designer.sortedColumns.value"
                    :key="col.id"
                    :column="col"
                    :designer="designer"
                    :readonly="readonly"
                    @edit="handleEditCard"
                    @edit-column="handleEditColumn"
                />
                <div class="add-column-btn" v-if="!readonly">
                    <el-button @click="designer.addColumn()">
                        <el-icon><Plus/></el-icon>
                        {{ i18n("kanban.btn.addColumn") }}
                    </el-button>
                </div>
            </div>
        </div>

        <kanban-card-dialog
            v-model:visible="cardDialogVisible"
            :designer="designer"
            :card-id="editingCardId"
        />
        <kanban-column-dialog
            v-model:visible="columnDialogVisible"
            :designer="designer"
            :column-id="editingColumnId"
        />
    </div>
</template>

<script lang="ts">
import { Plus } from "@element-plus/icons-vue";
export default { components: { Plus } };
</script>

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
        overflow-x: auto;
        overflow-y: hidden;
        padding: 12px;

        .columns-container {
            display: flex;
            height: 100%;
            align-items: stretch;

            .add-column-btn {
                display: flex;
                align-items: flex-start;
            }
        }
    }
}
</style>
