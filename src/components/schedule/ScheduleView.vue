<script setup lang="ts" name="ScheduleView">
import { ref } from "vue";
import { useScheduleDesigner } from "./composables/useScheduleDesigner";
import ScheduleToolbar from "./panels/ScheduleToolbar.vue";
import ScheduleResourcePanel from "./panels/ScheduleResourcePanel.vue";
import ScheduleCanvas from "./panels/ScheduleCanvas.vue";
import ScheduleEventDialog from "./dialogs/ScheduleEventDialog.vue";
import ScheduleResourceDialog from "./dialogs/ScheduleResourceDialog.vue";
import type { ScheduleData } from "./types";

const props = defineProps<{
    schedule?: ScheduleData;
    initialSchedule?: Partial<ScheduleData>;
    readonly?: boolean;
}>();

const emits = defineEmits<{
    (e: "update:schedule", v: ScheduleData): void;
    (e: "save", v: ScheduleData): void;
}>();

const designer = useScheduleDesigner(props.initialSchedule || props.schedule);
if (props.schedule) designer.loadData(props.schedule);

const eventDialogVisible = ref(false);
const editingEventId = ref<string | null>(null);
const defaultStartTime = ref<string>("");
const defaultResourceId = ref<string>("");

const resourceDialogVisible = ref(false);
const editingResourceId = ref<string | null>(null);

const handleEditEvent = (id: string) => {
    editingEventId.value = id;
    eventDialogVisible.value = true;
};

const handleCreateEvent = (startTime: string, resourceId: string) => {
    editingEventId.value = null;
    defaultStartTime.value = startTime;
    defaultResourceId.value = resourceId;
    eventDialogVisible.value = true;
};

const handleAddEvent = () => {
    editingEventId.value = null;
    defaultStartTime.value = "";
    defaultResourceId.value = designer.sortedResources.value[0]?.id ?? "";
    eventDialogVisible.value = true;
};

const handleEditResource = (id: string) => {
    editingResourceId.value = id;
    resourceDialogVisible.value = true;
};

const handleSave = () => {
    const data = designer.getData();
    emits("update:schedule", data);
    emits("save", data);
};
</script>

<template>
    <div class="schedule-view">
        <schedule-toolbar
            :designer="designer"
            :readonly="readonly"
            @save="handleSave"
            @preview="handleAddEvent"
            @add-event="handleAddEvent"
        />
        <div class="view-body">
            <schedule-resource-panel
                :designer="designer"
                :readonly="readonly"
                @edit-resource="handleEditResource"
            />
            <schedule-canvas
                :designer="designer"
                :readonly="readonly"
                @edit="handleEditEvent"
                @create="handleCreateEvent"
            />
        </div>

        <schedule-event-dialog
            v-model:visible="eventDialogVisible"
            :designer="designer"
            :event-id="editingEventId"
            :default-start-time="defaultStartTime"
            :default-resource-id="defaultResourceId"
        />
        <schedule-resource-dialog
            v-model:visible="resourceDialogVisible"
            :designer="designer"
            :resource-id="editingResourceId"
        />
    </div>
</template>

<style lang="scss" scoped>
.schedule-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--el-bg-color-page);
    overflow: hidden;

    .view-body {
        flex: 1;
        display: flex;
        overflow: hidden;
    }
}
</style>
