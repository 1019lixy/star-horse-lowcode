<script setup lang="ts" name="ScheduleView">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useScheduleDesigner } from "./composables/useScheduleDesigner";
import ScheduleToolbar from "./panels/ScheduleToolbar.vue";
import ScheduleResourcePanel from "./panels/ScheduleResourcePanel.vue";
import ScheduleCanvas from "./panels/ScheduleCanvas.vue";
import SchedulePropertyPanel from "./panels/SchedulePropertyPanel.vue";
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

const resourcePanelRef = ref<InstanceType<typeof ScheduleResourcePanel> | null>(null);
const canvasRef = ref<InstanceType<typeof ScheduleCanvas> | null>(null);

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

const handleInsertBefore = () => {
    const id = designer.selectedEventId.value;
    if (!id) return;
    const event = designer.state.events.find(e => e.id === id);
    if (!event) return;
    const newEvent = designer.addEvent({
        resourceId: event.resourceId,
        startTime: event.startTime,
        endTime: event.endTime,
    });
    if (newEvent) designer.selectEvent(newEvent.id);
};

const handleInsertAfter = () => {
    const id = designer.selectedEventId.value;
    if (!id) return;
    const event = designer.state.events.find(e => e.id === id);
    if (!event) return;
    const newEvent = designer.addEvent({
        resourceId: event.resourceId,
        startTime: event.startTime,
        endTime: event.endTime,
        title: designer.selectedEvent.value?.title ?? "",
    });
    if (newEvent) designer.selectEvent(newEvent.id);
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
    requestAnimationFrame(() => { isSyncingScroll = false; });
};

const syncCanvasScroll = (e: Event) => {
    if (isSyncingScroll) return;
    isSyncingScroll = true;
    const canvasEl = (e.target as HTMLElement);
    const listEl = resourcePanelRef.value?.listScrollRef;
    if (listEl) {
        listEl.scrollTop = canvasEl.scrollTop;
    }
    requestAnimationFrame(() => { isSyncingScroll = false; });
};

onMounted(() => {
    setTimeout(() => {
        const listEl = resourcePanelRef.value?.listScrollRef;
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
    const listEl = resourcePanelRef.value?.listScrollRef;
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
    <div class="schedule-view">
        <schedule-toolbar
            :designer="designer"
            :readonly="readonly"
            @save="handleSave"
            @preview="handleAddEvent"
            @add-event="handleAddEvent"
            @insert-before="handleInsertBefore"
            @insert-after="handleInsertAfter"
        />
        <el-splitter class="view-body" direction="horizontal">
            <el-splitter-panel size="220px" min="160px" max="360px">
                <schedule-resource-panel
                    ref="resourcePanelRef"
                    :designer="designer"
                    :readonly="readonly"
                    @edit-resource="handleEditResource"
                />
            </el-splitter-panel>
            <el-splitter-panel>
                <schedule-canvas
                    ref="canvasRef"
                    :designer="designer"
                    :readonly="readonly"
                    @edit="handleEditEvent"
                    @create="handleCreateEvent"
                />
            </el-splitter-panel>
            <el-splitter-panel size="260px" min="200px" max="400px">
                <schedule-property-panel
                    :designer="designer"
                    :readonly="readonly"
                />
            </el-splitter-panel>
        </el-splitter>

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
        overflow: hidden;
    }
}
</style>
