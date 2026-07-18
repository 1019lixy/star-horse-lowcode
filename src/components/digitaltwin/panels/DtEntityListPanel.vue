<script setup lang="ts" name="DtEntityListPanel">
/**
 * 数字孪生 - 左侧实体列表
 *
 * 按类型分组 + 状态筛选
 */
import { computed } from "vue";
import { i18n } from "@/lang";
import { ElMessage, ElMessageBox } from "element-plus";
import { DT_ENTITY_TYPE_PRESETS, DT_STATUS_PRESETS, dtGetStatusPreset } from "../constants";
import type { DtEntityStatus, DtEntityType } from "../types";
import type { UseDigitalTwinDesignerReturn } from "../composables/useDigitalTwinDesigner";

const props = defineProps<{
    designer: UseDigitalTwinDesignerReturn;
}>();

const emit = defineEmits<{
    (e: "add-entity"): void;
    (e: "edit-entity", id: string): void;
}>();

const designer = props.designer;

const statusFilter = computed({
    get: () => designer.state.statusFilter,
    set: (v: DtEntityStatus | "all") => designer.setStatusFilter(v),
});

/** 按类型分组的实体 */
const groupedEntities = computed(() => {
    const groups: { type: string; labelKey: string; items: typeof designer.filteredEntities.value }[] = [];
    DT_ENTITY_TYPE_PRESETS.forEach((preset) => {
        const items = designer.filteredEntities.value.filter((e) => e.type === preset.type);
        if (items.length > 0) {
            groups.push({ type: preset.type, labelKey: preset.labelKey, items });
        }
    });
    // 其他类型
    const others = designer.filteredEntities.value.filter(
        (e) => !DT_ENTITY_TYPE_PRESETS.some((p) => p.type === e.type),
    );
    if (others.length > 0) {
        groups.push({ type: "other", labelKey: "digitaltwin.type.cube", items: others });
    }
    return groups;
});

const handleSelect = (id: string): void => {
    designer.selectEntity(id);
};

const handleEdit = (id: string): void => {
    emit("edit-entity", id);
};

const handleDelete = (id: string): void => {
    ElMessageBox.confirm(i18n("digitaltwin.entity.confirmDelete"), i18n("digitaltwin.entity.delete"), {
        type: "warning",
    })
        .then(() => {
            designer.removeEntity(id);
            ElMessage.success(i18n("digitaltwin.message.deleted"));
        })
        .catch(() => {});
};

const statusColor = (status: DtEntityStatus): string => dtGetStatusPreset(status)?.color ?? "#8C8C8C";

// 阻止未使用变量告警
void DT_STATUS_PRESETS;
</script>

<template>
    <div class="dt-entity-list">
        <div class="panel-header">
            <span class="panel-title">{{ i18n("digitaltwin.entity.title") }}</span>
            <el-button  type="primary" @click="emit('add-entity')">
                <el-icon><Plus /></el-icon>
                {{ i18n("digitaltwin.entity.add") }}
            </el-button>
        </div>

        <div class="filter-bar">
            <el-select v-model="statusFilter"  style="width: 100%">
                <el-option :label="i18n('digitaltwin.status.normal')" value="all" />
                <el-option
                    v-for="s in DT_STATUS_PRESETS"
                    :key="s.status"
                    :label="i18n(s.labelKey as any)"
                    :value="s.status"
                />
            </el-select>
        </div>

        <div class="list-body">
            <template v-if="designer.state.scene.entities.length === 0">
                <div class="empty-text">{{ i18n("digitaltwin.entity.empty") }}</div>
            </template>
            <template v-else>
                <div v-for="group in groupedEntities" :key="group.type" class="entity-group">
                    <div class="group-title">{{ i18n(group.labelKey as any) }} ({{ group.items.length }})</div>
                    <div
                        v-for="item in group.items"
                        :key="item.id"
                        class="entity-item"
                        :class="{ active: designer.state.selectedEntityId === item.id }"
                        @click="handleSelect(item.id)"
                    >
                        <span class="status-dot" :style="{ background: statusColor(item.status as DtEntityStatus) }" />
                        <span class="entity-name">{{ item.name }}</span>
                        <span class="entity-actions">
                            <el-button  link @click.stop="handleEdit(item.id)">
                                {{ i18n("digitaltwin.entity.edit") }}
                            </el-button>
                            <el-button  link type="danger" @click.stop="handleDelete(item.id)">
                                {{ i18n("digitaltwin.entity.delete") }}
                            </el-button>
                        </span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Plus } from "@element-plus/icons-vue";
export default { components: { Plus } };
</script>

<style lang="scss" scoped>
.dt-entity-list {
    width: 240px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--el-border-color-lighter);
    background: var(--el-bg-color);
    overflow: hidden;

    .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        .panel-title {
            font-size: 13px;
            font-weight: 600;
        }
    }

    .filter-bar {
        padding: 8px 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);
    }

    .list-body {
        flex: 1;
        overflow: auto;
        padding: 4px 0;
    }

    .empty-text {
        padding: 24px 12px;
        text-align: center;
        color: var(--el-text-color-secondary);
        font-size: 12px;
    }

    .entity-group {
        margin-bottom: 4px;

        .group-title {
            padding: 4px 12px;
            font-size: 11px;
            color: var(--el-text-color-secondary);
            background: var(--el-fill-color-lighter);
        }
    }

    .entity-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 12px;

        &:hover {
            background: var(--el-fill-color-light);
        }

        &.active {
            background: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .entity-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .entity-actions {
            display: flex;
            gap: 4px;
        }
    }
}
</style>
