<script setup lang="ts" name="ScheduleResourcePanel">
import { i18n } from "@/lang";
import type { ScheduleDesigner } from "../composables/useScheduleDesigner";
import { SCHEDULE_RESOURCE_TYPE_PRESETS } from "../constants";

const props = defineProps<{
    designer: ScheduleDesigner;
    readonly?: boolean;
}>();

const emit = defineEmits<{
    (e: "editResource", resourceId: string): void;
}>();

const getResTypeLabel = (type: string) =>
    SCHEDULE_RESOURCE_TYPE_PRESETS.find((t) => t.value === type)?.label ?? type;
</script>

<template>
    <div class="schedule-resource-panel">
        <div class="panel-header">
            <span>{{ i18n("schedule.resource.title") }}</span>
            <el-button

                text
                :disabled="readonly"
                @click="designer.addResource()"
            >
                <el-icon><Plus/></el-icon>
            </el-button>
        </div>
        <div class="panel-body">
            <div
                v-for="resource in designer.sortedResources.value"
                :key="resource.id"
                class="resource-item"
                :style="{ borderLeftColor: resource.color }"
            >
                <el-avatar :size="28" :src="resource.avatar">
                    {{ resource.name.charAt(0) }}
                </el-avatar>
                <div class="resource-info">
                    <div class="resource-name">{{ resource.name }}</div>
                    <el-tag  type="info">
                        {{ getResTypeLabel(resource.type) }}
                    </el-tag>
                </div>
                <div class="resource-actions" v-if="!readonly">
                    <el-button  text @click="emit('editResource', resource.id)">
                        <el-icon><Edit/></el-icon>
                    </el-button>
                    <el-button  text @click="designer.removeResource(resource.id)">
                        <el-icon><Delete/></el-icon>
                    </el-button>
                </div>
            </div>
            <div class="empty-tip" v-if="designer.sortedResources.value.length === 0">
                {{ i18n("schedule.resource.empty") }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
export default { components: { Plus, Edit, Delete } };
</script>

<style lang="scss" scoped>
.schedule-resource-panel {
    width: 220px;
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

    .panel-body {
        flex: 1;
        overflow: auto;
        padding: 8px;
    }

    .resource-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 8px;
        margin-bottom: 6px;
        background: var(--el-fill-color-light);
        border-radius: 4px;
        border-left: 3px solid var(--el-color-primary);

        .resource-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;

            .resource-name {
                font-size: 13px;
                font-weight: 500;
            }
        }

        .resource-actions {
            display: flex;
            gap: 2px;
        }
    }

    .empty-tip {
        text-align: center;
        color: var(--el-text-color-placeholder);
        padding: 24px 0;
        font-size: 12px;
    }
}
</style>
