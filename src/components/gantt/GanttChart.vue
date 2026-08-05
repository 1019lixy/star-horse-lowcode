<script setup lang="ts" name="GanttChart">
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useGanttDesigner} from "./composables/useGanttDesigner";
import GanttToolbar from "./panels/GanttToolbar.vue";
import GanttTaskListPanel from "./panels/GanttTaskListPanel.vue";
import GanttCanvas from "./panels/GanttCanvas.vue";
import GanttPropertyPanel from "./panels/GanttPropertyPanel.vue";
import GanttTaskDialog from "./dialogs/GanttTaskDialog.vue";
import {DesignerMobileShell} from "@/components/shared";
import type {GanttData} from "./types";

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

const taskListRef = ref<InstanceType<typeof GanttTaskListPanel> | null>(null);
const canvasRef = ref<InstanceType<typeof GanttCanvas> | null>(null);
const selectedTaskId = computed(() => designer.selectedTaskId.value);

const handleAddTask = () => {
  const selectedId = designer.selectedTaskId.value;
  if (selectedId) {
    const task = designer.insertAfter(selectedId);
    if (task) designer.selectTask(task.id);
  } else {
    const task = designer.addTask();
    designer.selectTask(task.id);
  }
};

const handleInsertBefore = () => {
  const id = designer.selectedTaskId.value;
  if (!id) return;
  const task = designer.insertBefore(id);
  if (task) designer.selectTask(task.id);
};

const handleInsertAfter = () => {
  const id = designer.selectedTaskId.value;
  if (!id) return;
  const task = designer.insertAfter(id);
  if (task) designer.selectTask(task.id);
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
  // 预览即直接展示当前甘特图
};

// ======================== 滚动同步 ========================
let isSyncingScroll = false;

const syncListScroll = (e: Event) => {
  if (isSyncingScroll) return;
  isSyncingScroll = true;
  const listEl = (e.target as HTMLElement);
  const canvasEl = canvasRef.value?.canvasScrollRef;
  if (canvasEl) {
    canvasEl.scrollTop = listEl.scrollTop;
  }
  requestAnimationFrame(() => {
    isSyncingScroll = false;
  });
};

const syncCanvasScroll = (e: Event) => {
  if (isSyncingScroll) return;
  isSyncingScroll = true;
  const canvasEl = (e.target as HTMLElement);
  const listEl = taskListRef.value?.listScrollRef;
  if (listEl) {
    listEl.scrollTop = canvasEl.scrollTop;
  }
  requestAnimationFrame(() => {
    isSyncingScroll = false;
  });
};

onMounted(() => {
  // 延迟绑定滚动同步事件
  setTimeout(() => {
    const listEl = taskListRef.value?.listScrollRef;
    const canvasEl = canvasRef.value?.canvasScrollRef;
    if (listEl) {
      listEl.addEventListener("scroll", syncListScroll);
    }
    if (canvasEl) {
      canvasEl.addEventListener("scroll", syncCanvasScroll);
    }
  }, 100);
});

onBeforeUnmount(() => {
  const listEl = taskListRef.value?.listScrollRef;
  const canvasEl = canvasRef.value?.canvasScrollRef;
  if (listEl) {
    listEl.removeEventListener("scroll", syncListScroll);
  }
  if (canvasEl) {
    canvasEl.removeEventListener("scroll", syncCanvasScroll);
  }
});
</script>

<template>
  <div class="gantt-chart">
    <DesignerMobileShell
      :panels="[
        { key: 'taskList', label: '任务', side: 'left', width: 350, min: 200 },
        { key: 'props', label: '属性', side: 'right', width: 280, min: 220 },
      ]"
    >
      <template #toolbar>
        <gantt-toolbar
            :designer="designer"
            :readonly="readonly"
            :title="initialGantt.name"
            @save="handleSave"
            @preview="handlePreview"
            @add-task="handleAddTask"
            @insert-before="handleInsertBefore"
            @insert-after="handleInsertAfter"
        />
      </template>
      <template #canvas>
        <gantt-canvas
            ref="canvasRef"
            :designer="designer"
            :readonly="readonly"
            @edit="handleEditTask"
        />
      </template>
      <template #panel-taskList>
        <gantt-task-list-panel
            ref="taskListRef"
            :designer="designer"
            :readonly="readonly"
            @edit="handleEditTask"
        />
      </template>
      <template #panel-props>
        <gantt-property-panel
            :designer="designer"
            :readonly="readonly"
        />
      </template>
    </DesignerMobileShell>

    <gantt-task-dialog
        v-model:visible="taskDialogVisible"
        :designer="designer"
        :task-id="editingTaskId"
        :parent-id="selectedTaskId"
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
}
</style>
