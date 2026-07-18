<script setup lang="ts" name="GanttChart">
import { ref } from "vue";
import { i18n } from "@/lang";
import { useGanttDesigner } from "./composables/useGanttDesigner";
import GanttToolbar from "./panels/GanttToolbar.vue";
import GanttTaskListPanel from "./panels/GanttTaskListPanel.vue";
import GanttCanvas from "./panels/GanttCanvas.vue";
import GanttPropertyPanel from "./panels/GanttPropertyPanel.vue";
import GanttTaskDialog from "./dialogs/GanttTaskDialog.vue";
import type { GanttData } from "./types";

const props = defineProps<{
    gantt?: GanttData;
    initialGantt?: Partial<GanttData>;
    readonly?: boolean;
}>();

const emits = defineEmits<{
    (e: "update:gantt", v: GanttData): void;
    (e: "save", v: GanttData): void;
}>();

const designer = useGanttDesigner(props.initialGantt || props.gantt);
if (props.gantt) designer.loadData(props.gantt);

const taskDialogVisible = ref(false);
const editingTaskId = ref<string | null>(null);

const handleAddTask = () => {
    editingTaskId.value = null;
    taskDialogVisible.value = true;
};

const handleEditTask = (id: string) => {
    editingTaskId.value = id;
    taskDialogVisible.value = true;
};

const handleSave = () => {
    const data = designer.getData();
    emits("update:gantt", data);
    emits("save", data);
};

const handlePreview = () => {
    // 预览即直接展示当前甘特图（用户可通过 canvas 查看实际效果）
    // 复杂预览场景可后续扩展预览弹窗
};
</script>

<template>
    <div class="gantt-chart">
        <gantt-toolbar
            :designer="designer"
            :readonly="readonly"
            @save="handleSave"
            @preview="handlePreview"
            @add-task="handleAddTask"
        />
        <div class="designer-body">
            <gantt-task-list-panel
                :designer="designer"
                :readonly="readonly"
                @edit="handleEditTask"
            />
            <gantt-canvas
                :designer="designer"
                :readonly="readonly"
                @edit="handleEditTask"
            />
            <gantt-property-panel
                :designer="designer"
                :readonly="readonly"
            />
        </div>

        <gantt-task-dialog
            v-model:visible="taskDialogVisible"
            :designer="designer"
            :task-id="editingTaskId"
            :parent-id="designer.selectedTaskId"
        />
    </div>
</template>

<style lang="scss" scoped>
.gantt-chart {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--el-bg-color-page);
    overflow: hidden;

    .designer-body {
        flex: 1;
        display: flex;
        overflow: hidden;
    }
}
</style>
