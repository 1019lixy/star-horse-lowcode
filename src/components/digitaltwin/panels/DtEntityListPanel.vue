<script setup lang="ts" name="DtEntityListPanel">
/**
 * 数字孪生 - 左侧实体列表
 *
 * 按类型分组 + 状态筛选 + 层级管理（上移/下移/显示隐藏/锁定/重命名/编辑/删除）
 */
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import { ElMessage, ElMessageBox } from "element-plus";
import { DT_ENTITY_TYPE_PRESETS, DT_STATUS_PRESETS, dtGetStatusPreset } from "../constants";
import { ShSvgIcon } from "@/components/shared";
import type { DtEntity, DtEntityStatus } from "../types";
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

/** 内联重命名状态 */
const renamingId = ref<string | null>(null);
const renamingValue = ref("");

/** 按类型分组的实体 */
const groupedEntities = computed(() => {
    const groups: { type: string; labelKey: string; items: DtEntity[] }[] = [];
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
    if (renamingId.value === id) return; // 重命名中不触发选中
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

const handleMoveUp = (id: string): void => {
    designer.moveEntityUp(id);
};

const handleMoveDown = (id: string): void => {
    designer.moveEntityDown(id);
};

const handleToggleVisible = (item: DtEntity): void => {
    designer.updateEntityWithHistory(item.id, { visible: item.visible === false });
};

const handleToggleLock = (item: DtEntity): void => {
    designer.updateEntityWithHistory(item.id, { locked: !item.locked });
};

const handleStartRename = (item: DtEntity): void => {
    renamingId.value = item.id;
    renamingValue.value = item.name;
};

const handleConfirmRename = (): void => {
    if (!renamingId.value) return;
    const name = renamingValue.value.trim();
    if (!name) {
        ElMessage.warning(i18n("digitaltwin.message.nameRequired"));
        return;
    }
    designer.updateEntityWithHistory(renamingId.value, { name });
    renamingId.value = null;
    renamingValue.value = "";
};

const handleCancelRename = (): void => {
    renamingId.value = null;
    renamingValue.value = "";
};

const statusColor = (status: DtEntityStatus): string => dtGetStatusPreset(status)?.color ?? "#8C8C8C";
</script>

<template>
    <div class="dt-entity-list">
        <div class="panel-header">
            <span class="panel-title">{{ i18n("digitaltwin.entity.title") }}</span>
            <el-button type="primary" size="small" @click="emit('add-entity')">
                <ShSvgIcon name="plus" size="12px"/>
                {{ i18n("digitaltwin.entity.add") }}
            </el-button>
        </div>

        <div class="filter-bar">
            <el-select v-model="statusFilter" size="small" style="width: 100%">
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
                        :class="{
                            active: designer.state.selectedEntityId === item.id,
                            hidden: item.visible === false,
                            locked: item.locked,
                        }"
                        @click="handleSelect(item.id)"
                    >
                        <span class="status-dot" :style="{ background: statusColor(item.status as DtEntityStatus) }" />
                        <!-- 重命名输入框 / 名称显示 -->
                        <el-input
                            v-if="renamingId === item.id"
                            v-model="renamingValue"
                            size="small"
                            class="rename-input"
                            @keyup.enter="handleConfirmRename"
                            @keyup.esc="handleCancelRename"
                            @blur="handleConfirmRename"
                        />
                        <span v-else class="entity-name" @dblclick.stop="handleStartRename(item)">
                            {{ item.name }}
                        </span>
                        <span class="entity-actions" v-if="renamingId !== item.id">
                            <el-tooltip :content="i18n('digitaltwin.entity.moveUp')" :show-after="500">
                                <el-button link size="small" @click.stop="handleMoveUp(item.id)">
                                    <ShSvgIcon name="moveUp" size="12px"/>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="i18n('digitaltwin.entity.moveDown')" :show-after="500">
                                <el-button link size="small" @click.stop="handleMoveDown(item.id)">
                                    <ShSvgIcon name="moveDown" size="12px"/>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="i18n(item.visible === false ? 'digitaltwin.entity.show' : 'digitaltwin.entity.hide')" :show-after="500">
                                <el-button link size="small" @click.stop="handleToggleVisible(item)">
                                    <ShSvgIcon :name="item.visible === false ? 'eyeOff' : 'eye'" size="12px"/>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="i18n(item.locked ? 'digitaltwin.entity.unlock' : 'digitaltwin.entity.lock')" :show-after="500">
                                <el-button link size="small" @click.stop="handleToggleLock(item)">
                                    <ShSvgIcon :name="item.locked ? 'lock' : 'unlock'" size="12px"/>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="i18n('digitaltwin.entity.rename')" :show-after="500">
                                <el-button link size="small" @click.stop="handleStartRename(item)">
                                    <ShSvgIcon name="editPen" size="12px"/>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="i18n('digitaltwin.entity.edit')" :show-after="500">
                                <el-button link size="small" @click.stop="handleEdit(item.id)">
                                    <ShSvgIcon name="edit" size="12px"/>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="i18n('digitaltwin.entity.delete')" :show-after="500">
                                <el-button link size="small" type="danger" @click.stop="handleDelete(item.id)">
                                    <ShSvgIcon name="delete" size="12px"/>
                                </el-button>
                            </el-tooltip>
                        </span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.dt-entity-list {
    width: 100%;
    height: 100%;
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
        position: relative;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 12px;

        &:hover {
            background: var(--el-fill-color-light);

            .entity-actions {
                opacity: 1;
                width: auto;
                margin-left: 4px;
            }

            .entity-name {
                // hover 时让出空间给 actions
                max-width: calc(100% - 110px);
            }
        }

        &.active {
            background: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
        }

        &.hidden {
            .entity-name {
                opacity: 0.5;
                text-decoration: line-through;
            }
        }

        &.locked .status-dot {
            box-shadow: 0 0 0 2px var(--el-color-warning);
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
            max-width: 100%;
            transition: max-width 0.15s;
        }

        .rename-input {
            flex: 1;
            :deep(.el-input__wrapper) {
                padding: 0 8px;
            }
        }

        .entity-actions {
            display: flex;
            gap: 2px;
            opacity: 0;
            width: 0;
            overflow: hidden;
            transition: opacity 0.15s, width 0.15s;
            flex-shrink: 0;
        }
    }
}
</style>
