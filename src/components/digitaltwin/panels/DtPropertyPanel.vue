<script setup lang="ts" name="DtPropertyPanel">
/**
 * 数字孪生 - 右侧属性面板
 *
 * 实体属性 + 传感器数据 + 状态切换
 */
import { computed } from "vue";
import { i18n } from "@/lang";
import { DT_STATUS_PRESETS, dtGetEntityTypePreset, dtGetStatusPreset } from "../constants";
import type { DtEntityStatus } from "../types";
import type { UseDigitalTwinDesignerReturn } from "../composables/useDigitalTwinDesigner";
import type { UseDigitalTwinTelemetryReturn } from "../composables/useDigitalTwinTelemetry";

const props = defineProps<{
    designer: UseDigitalTwinDesignerReturn;
    telemetry: UseDigitalTwinTelemetryReturn;
}>();

const designer = props.designer;
const telemetry = props.telemetry;

const entity = computed(() => designer.selectedEntity.value);

const entityMetrics = computed(() => {
    if (!entity.value) return [];
    return telemetry.getEntityMetrics(entity.value);
});

const entityTypeLabel = (type: string): string => {
    const preset = dtGetEntityTypePreset(type);
    return preset ? i18n(preset.labelKey as any) : type;
};

const handleStatusChange = (status: DtEntityStatus): void => {
    if (!entity.value) return;
    designer.updateEntity(entity.value.id, { status });
};

const statusColor = (status: DtEntityStatus): string => dtGetStatusPreset(status)?.color ?? "#8C8C8C";
</script>

<template>
    <div class="dt-property-panel">
        <div class="panel-header">
            <span class="panel-title">{{ i18n("digitaltwin.property.title") }}</span>
        </div>

        <div class="panel-body">
            <template v-if="!entity">
                <div class="empty-text">{{ i18n("digitaltwin.property.empty") }}</div>
            </template>
            <template v-else>
                <!-- 基本信息 -->
                <div class="section">
                    <div class="section-title">{{ i18n("digitaltwin.dialog.basic") }}</div>
                    <div class="prop-row">
                        <span class="prop-label">{{ i18n("digitaltwin.entity.name") }}</span>
                        <span class="prop-value">{{ entity.name }}</span>
                    </div>
                    <div class="prop-row">
                        <span class="prop-label">{{ i18n("digitaltwin.entity.type") }}</span>
                        <span class="prop-value">{{ entityTypeLabel(entity.type) }}</span>
                    </div>
                    <div class="prop-row">
                        <span class="prop-label">{{ i18n("digitaltwin.entity.status") }}</span>
                        <span class="prop-value">
                            <el-select
                                :model-value="entity.status"
                                size="small"
                                style="width: 120px"
                                @update:model-value="(v) => handleStatusChange(v as DtEntityStatus)"
                            >
                                <el-option
                                    v-for="s in DT_STATUS_PRESETS"
                                    :key="s.status"
                                    :label="i18n(s.labelKey as any)"
                                    :value="s.status"
                                />
                            </el-select>
                        </span>
                    </div>
                    <div class="prop-row">
                        <span class="prop-label">{{ i18n("digitaltwin.entity.color") }}</span>
                        <span class="prop-value">
                            <span class="color-dot" :style="{ background: entity.color }" />
                            {{ entity.color }}
                        </span>
                    </div>
                </div>

                <!-- 位置 -->
                <div class="section">
                    <div class="section-title">{{ i18n("digitaltwin.entity.position") }}</div>
                    <div class="prop-row">
                        <span class="prop-label">{{ i18n("digitaltwin.entity.x") }}</span>
                        <span class="prop-value">{{ entity.position.x }}</span>
                    </div>
                    <div class="prop-row">
                        <span class="prop-label">{{ i18n("digitaltwin.entity.y") }}</span>
                        <span class="prop-value">{{ entity.position.y }}</span>
                    </div>
                    <div class="prop-row">
                        <span class="prop-label">{{ i18n("digitaltwin.entity.z") }}</span>
                        <span class="prop-value">{{ entity.position.z }}</span>
                    </div>
                </div>

                <!-- 尺寸 -->
                <div class="section">
                    <div class="section-title">{{ i18n("digitaltwin.entity.size") }}</div>
                    <template v-if="entity.type === 'cube' || entity.type === 'plane'">
                        <div class="prop-row">
                            <span class="prop-label">{{ i18n("digitaltwin.entity.width") }}</span>
                            <span class="prop-value">{{ entity.size.width }}</span>
                        </div>
                        <div class="prop-row" v-if="entity.type === 'cube'">
                            <span class="prop-label">{{ i18n("digitaltwin.entity.height") }}</span>
                            <span class="prop-value">{{ entity.size.height }}</span>
                        </div>
                        <div class="prop-row">
                            <span class="prop-label">{{ i18n("digitaltwin.entity.depth") }}</span>
                            <span class="prop-value">{{ entity.size.depth }}</span>
                        </div>
                    </template>
                    <template v-else-if="entity.type === 'cylinder'">
                        <div class="prop-row">
                            <span class="prop-label">{{ i18n("digitaltwin.entity.radius") }}</span>
                            <span class="prop-value">{{ entity.size.radius }}</span>
                        </div>
                        <div class="prop-row">
                            <span class="prop-label">{{ i18n("digitaltwin.entity.height") }}</span>
                            <span class="prop-value">{{ entity.size.height }}</span>
                        </div>
                    </template>
                    <template v-else-if="entity.type === 'sphere'">
                        <div class="prop-row">
                            <span class="prop-label">{{ i18n("digitaltwin.entity.radius") }}</span>
                            <span class="prop-value">{{ entity.size.radius }}</span>
                        </div>
                    </template>
                </div>

                <!-- 传感器数据 -->
                <div class="section">
                    <div class="section-title">{{ i18n("digitaltwin.property.metrics") }}</div>
                    <template v-if="entityMetrics.length === 0">
                        <div class="empty-text small">-</div>
                    </template>
                    <div v-for="m in entityMetrics" :key="m.key" class="prop-row">
                        <span class="prop-label">{{ i18n(m.labelKey as any) }}</span>
                        <span class="prop-value">
                            {{ m.value.toFixed(2) }} {{ i18n(m.unitKey as any) }}
                        </span>
                    </div>
                </div>

                <!-- 状态指示 -->
                <div class="section">
                    <div class="section-title">{{ i18n("digitaltwin.entity.status") }}</div>
                    <div class="status-indicator">
                        <span class="status-dot" :style="{ background: statusColor(entity.status as DtEntityStatus) }" />
                        {{ i18n(dtGetStatusPreset(entity.status as DtEntityStatus)?.labelKey as any) }}
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dt-property-panel {
    width: 260px;
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--el-border-color-lighter);
    background: var(--el-bg-color);
    overflow: hidden;

    .panel-header {
        padding: 8px 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        .panel-title {
            font-size: 13px;
            font-weight: 600;
        }
    }

    .panel-body {
        flex: 1;
        overflow: auto;
        padding: 8px 0;
    }

    .empty-text {
        padding: 24px 12px;
        text-align: center;
        color: var(--el-text-color-secondary);
        font-size: 12px;

        &.small {
            padding: 4px 12px;
        }
    }

    .section {
        padding: 0 12px 8px;
        border-bottom: 1px dashed var(--el-border-color-lighter);
        margin-bottom: 8px;

        .section-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 6px;
        }
    }

    .prop-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 3px 0;
        font-size: 12px;

        .prop-label {
            color: var(--el-text-color-secondary);
        }

        .prop-value {
            color: var(--el-text-color-primary);
            display: flex;
            align-items: center;
            gap: 4px;
        }
    }

    .color-dot {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 2px;
        border: 1px solid var(--el-border-color);
    }

    .status-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;

        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }
    }
}
</style>
