<script setup lang="ts" name="GanttTaskListPanel">
import { computed } from "vue";
import { i18n } from "@/lang";
import type { GanttDesigner } from "../composables/useGanttDesigner";
import { GANTT_PRIORITY_PRESETS, GANTT_STATUS_PRESETS } from "../constants";

const props = defineProps<{
    designer: GanttDesigner;
    readonly?: boolean;
}>();

const emit = defineEmits<{
    (e: "edit", id: string): void;
}>();

/** 构建树形结构 */
const treeTasks = computed(() => {
    const tasks = props.designer.sortedTasks.value;
    const map = new Map<string, any>();
    const roots: any[] = [];
    tasks.forEach((t) => {
        map.set(t.id, { ...t, children: [] });
    });
    tasks.forEach((t) => {
        const node = map.get(t.id);
        if (t.parentId && map.has(t.parentId)) {
            map.get(t.parentId).children.push(node);
        } else {
            roots.push(node);
        }
    });
    return roots;
});

const getStatusLabel = (status: string) =>
    GANTT_STATUS_PRESETS.find((s) => s.value === status)?.label ?? status;

const getPriorityColor = (priority: string) =>
    GANTT_PRIORITY_PRESETS.find((p) => p.value === priority)?.color ?? "#909399";

const handleRowClick = (id: string) => {
    props.designer.selectTask(id);
};

const handleEdit = (id: string) => {
    emit("edit", id);
};

const handleAddChild = (parentId: string) => {
    props.designer.addChildTask(parentId);
};
</script>

<template>
    <div class="gantt-task-list-panel">
        <div class="panel-header">
            <span>{{ i18n("gantt.taskList.title") }}</span>
            <el-button

                text
                :disabled="readonly"
                @click="designer.addTask()"
            >
                <el-icon><Plus/></el-icon>
            </el-button>
        </div>
        <div class="tree-container">
            <el-tree
                :data="treeTasks"
                node-key="id"
                :props="{ label: 'name', children: 'children' }"
                default-expand-all
                :highlight-current="true"
                :current-node-key="designer.selectedTaskId"
                @node-click="(node: any) => handleRowClick(node.id)"
            >
                <template #default="{ data }">
                    <div class="task-row" :class="{ selected: data.id === designer.selectedTaskId }">
                        <span class="task-name" :style="{ paddingLeft: `${data.level * 12}px` }">
                            <el-icon v-if="data.isMilestone" class="milestone-icon">
                                <Flag/>
                            </el-icon>
                            {{ data.name }}
                        </span>
                        <span class="task-status">{{ getStatusLabel(data.status) }}</span>
                        <span class="task-actions" v-if="!readonly">
                            <el-tag :color="getPriorityColor(data.priority)"  effect="dark">
                                {{ data.progress }}%
                            </el-tag>
                            <el-button  text @click.stop="handleEdit(data.id)">
                                <el-icon><Edit/></el-icon>
                            </el-button>
                            <el-button  text @click.stop="handleAddChild(data.id)">
                                <el-icon><Plus/></el-icon>
                            </el-button>
                        </span>
                    </div>
                </template>
            </el-tree>
        </div>
    </div>
</template>

<script lang="ts">
import { Plus, Edit, Flag } from "@element-plus/icons-vue";
export default { components: { Plus, Edit, Flag } };
</script>

<style lang="scss" scoped>
.gantt-task-list-panel {
    width: 280px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--el-border-color);
    background: var(--el-bg-color);
    overflow: hidden;

    .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        font-weight: 600;
        border-bottom: 1px solid var(--el-border-color);
    }

    .tree-container {
        flex: 1;
        overflow: auto;
        padding: 4px;
    }

    .task-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        padding-right: 8px;
        gap: 8px;

        &.selected {
            background: var(--el-color-primary-light-9);
        }

        .task-name {
            display: flex;
            align-items: center;
            gap: 4px;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            .milestone-icon {
                color: var(--el-color-warning);
            }
        }

        .task-status {
            font-size: 12px;
            color: var(--el-text-color-secondary);
        }

        .task-actions {
            display: flex;
            align-items: center;
            gap: 4px;
        }
    }
}
</style>
