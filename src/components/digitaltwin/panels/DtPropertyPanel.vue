<script setup lang="ts" name="DtPropertyPanel">
/**
 * 数字孪生 - 右侧属性面板
 *
 * 实体属性 + 传感器数据 + 状态切换 + 模型实例参数化编辑 + 动画 + 数据绑定
 */
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import { ElMessage, ElMessageBox } from "element-plus";
import { DT_STATUS_PRESETS, dtGetEntityTypePreset, dtGetStatusPreset } from "../constants";
import { dtFindModelPreset } from "../modelLibrary";
import type { DtAnimationType, DtBindingSourceType, DtDataBinding, DtEntityStatus, DtModelInstance } from "../types";
import type { UseDigitalTwinDesignerReturn } from "../composables/useDigitalTwinDesigner";
import type { UseDigitalTwinTelemetryReturn } from "../composables/useDigitalTwinTelemetry";

const props = defineProps<{
    designer: UseDigitalTwinDesignerReturn;
    telemetry: UseDigitalTwinTelemetryReturn;
}>();

const emit = defineEmits<{
    (e: "edit-binding", entityId: string, binding: DtDataBinding | null): void;
}>();

const designer = props.designer;
const telemetry = props.telemetry;

const entity = computed(() => designer.selectedEntity.value);
const modelInstance = computed<DtModelInstance | null>(() => {
    const e = entity.value;
    if (!e) return null;
    return (e as DtModelInstance).modelType ? (e as DtModelInstance) : null;
});
const modelPreset = computed(() => (modelInstance.value ? dtFindModelPreset(modelInstance.value.modelType) : null));
const bindings = ref<DtDataBinding[]>([]);

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

/** 模型实例参数变更 */
const handleParamChange = (name: string, value: any): void => {
    if (!modelInstance.value) return;
    const newValues = { ...modelInstance.value.parameterValues, [name]: value };
    designer.updateEntity(modelInstance.value.id, { parameterValues: newValues } as any);
};

/** 动画类型变更 */
const handleAnimationTypeChange = (type: DtAnimationType | ""): void => {
    if (!modelInstance.value || !modelPreset.value) return;
    if (type === "") {
        designer.updateEntity(modelInstance.value.id, { animation: undefined } as any);
        return;
    }
    const baseAnim = modelPreset.value.defaultAnimation ?? { type, speed: 180 };
    designer.updateEntity(modelInstance.value.id, { animation: { ...baseAnim, type } } as any);
};

/** 动画速度变更 */
const handleAnimationSpeedChange = (speed: number): void => {
    if (!modelInstance.value) return;
    const current = modelInstance.value.animation ?? modelPreset.value?.defaultAnimation;
    if (!current) return;
    designer.updateEntity(modelInstance.value.id, { animation: { ...current, speed } } as any);
};

/** 新增绑定 */
const handleAddBinding = (): void => {
    if (!entity.value) return;
    emit("edit-binding", entity.value.id, null);
};

/** 编辑绑定 */
const handleEditBinding = (binding: DtDataBinding): void => {
    if (!entity.value) return;
    emit("edit-binding", entity.value.id, binding);
};

/** 删除绑定 */
const handleDeleteBinding = (binding: DtDataBinding): void => {
    ElMessageBox.confirm(i18n("digitaltwin.binding.confirmDelete"), i18n("digitaltwin.binding.delete"), {
        type: "warning",
    })
        .then(() => {
            bindings.value = bindings.value.filter((b) => b.id !== binding.id);
            if (modelInstance.value) {
                designer.updateEntity(modelInstance.value.id, {
                    bindings: bindings.value,
                } as any);
            }
            ElMessage.success(i18n("digitaltwin.message.bindingDeleted"));
        })
        .catch(() => {});
};

const animationTypeOptions: { value: DtAnimationType | ""; labelKey: string }[] = [
    { value: "", labelKey: "digitaltwin.animation.disabled" },
    { value: "rotation", labelKey: "digitaltwin.animation.rotation" },
    { value: "translation", labelKey: "digitaltwin.animation.translation" },
    { value: "blink", labelKey: "digitaltwin.animation.blink" },
    { value: "color", labelKey: "digitaltwin.animation.color" },
];

const sourceTypeLabel = (s: DtBindingSourceType): string =>
    i18n(`digitaltwin.binding.sourceType.${s}` as any);

// 同步外部传入的绑定（当 dialog 保存后回传时由父组件更新 entity.bindings，这里同步刷新本地视图）
const syncBindings = (): void => {
    if (modelInstance.value?.bindings) {
        bindings.value = [...modelInstance.value.bindings];
    } else {
        bindings.value = [];
    }
};
// 监听 entity 变化时同步绑定列表（用 computed 触发即可）
const _bindingTrigger = computed(() => {
    void modelInstance.value?.bindings;
    syncBindings();
    return entity.value;
});
void _bindingTrigger;

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    delete: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6M10 11v6M14 11v6"/></svg>'
};
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

                <!-- 模型实例专属：参数化编辑 -->
                <template v-if="modelInstance && modelPreset">
                    <div class="section">
                        <div class="section-title">{{ i18n("digitaltwin.library.title") }}</div>
                        <div class="prop-row">
                            <span class="prop-label">{{ i18n("digitaltwin.entity.type") }}</span>
                            <span class="prop-value">{{ i18n(modelPreset.labelKey as any) }}</span>
                        </div>
                        <div
                            v-for="param in modelPreset.parameters"
                            :key="param.name"
                            class="prop-row"
                        >
                            <span class="prop-label">{{ i18n(param.labelKey as any) }}</span>
                            <span class="prop-value">
                                <el-input-number
                                    v-if="param.type === 'number'"
                                    :model-value="modelInstance.parameterValues[param.name] ?? param.default"
                                    size="small"
                                    style="width: 120px"
                                    @update:model-value="(v) => handleParamChange(param.name, v)"
                                />
                                <el-select
                                    v-else-if="param.type === 'select'"
                                    :model-value="modelInstance.parameterValues[param.name] ?? param.default"
                                    size="small"
                                    style="width: 120px"
                                    @update:model-value="(v) => handleParamChange(param.name, v)"
                                >
                                    <el-option
                                        v-for="opt in param.options ?? []"
                                        :key="opt.value"
                                        :label="opt.label"
                                        :value="opt.value"
                                    />
                                </el-select>
                                <el-input
                                    v-else
                                    :model-value="modelInstance.parameterValues[param.name] ?? param.default"
                                    size="small"
                                    style="width: 120px"
                                    @update:model-value="(v) => handleParamChange(param.name, v)"
                                />
                                <span v-if="param.unitKey" class="unit-text">{{ i18n(param.unitKey as any) }}</span>
                            </span>
                        </div>
                    </div>

                    <!-- 动画配置 -->
                    <div class="section">
                        <div class="section-title">{{ i18n("digitaltwin.animation.title") }}</div>
                        <div class="prop-row">
                            <span class="prop-label">{{ i18n("digitaltwin.animation.type") }}</span>
                            <span class="prop-value">
                                <el-select
                                    :model-value="modelInstance.animation?.type ?? (modelPreset.defaultAnimation?.type ?? '')"
                                    size="small"
                                    style="width: 120px"
                                    @update:model-value="(v) => handleAnimationTypeChange(v as DtAnimationType | '')"
                                >
                                    <el-option
                                        v-for="opt in animationTypeOptions"
                                        :key="opt.value"
                                        :label="i18n(opt.labelKey as any)"
                                        :value="opt.value"
                                    />
                                </el-select>
                            </span>
                        </div>
                        <div v-if="(modelInstance.animation ?? modelPreset.defaultAnimation)" class="prop-row">
                            <span class="prop-label">{{ i18n("digitaltwin.animation.speed") }}</span>
                            <span class="prop-value">
                                <el-input-number
                                    :model-value="(modelInstance.animation ?? modelPreset.defaultAnimation)?.speed ?? 180"
                                    :min="0"
                                    :step="30"
                                    size="small"
                                    style="width: 120px"
                                    @update:model-value="(v) => handleAnimationSpeedChange(v)"
                                />
                            </span>
                        </div>
                    </div>

                    <!-- 数据绑定 -->
                    <div class="section">
                        <div class="section-title">
                            {{ i18n("digitaltwin.binding.title") }}
                            <el-button size="small" type="primary" link @click="handleAddBinding">
                                <span class="svg-icon" v-html="icons.plus"></span>
                                {{ i18n("digitaltwin.binding.add") }}
                            </el-button>
                        </div>
                        <template v-if="bindings.length === 0">
                            <div class="empty-text small">{{ i18n("digitaltwin.binding.empty") }}</div>
                        </template>
                        <div
                            v-for="b in bindings"
                            :key="b.id"
                            class="binding-item"
                        >
                            <div class="binding-name">{{ b.name }}</div>
                            <div class="binding-meta">{{ sourceTypeLabel(b.source) }} · {{ b.targetProperty }}</div>
                            <div class="binding-actions">
                                <el-button size="small" link @click="handleEditBinding(b)">
                                    <span class="svg-icon" v-html="icons.edit"></span>
                                    {{ i18n("digitaltwin.binding.edit") }}
                                </el-button>
                                <el-button size="small" link type="danger" @click="handleDeleteBinding(b)">
                                    <span class="svg-icon" v-html="icons.delete"></span>
                                    {{ i18n("digitaltwin.binding.delete") }}
                                </el-button>
                            </div>
                        </div>
                    </div>
                </template>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dt-property-panel {
    width: 100%;
    height: 100%;
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

    .unit-text {
        font-size: 11px;
        color: var(--el-text-color-secondary);
        margin-left: 2px;
    }

    .binding-item {
        padding: 6px 8px;
        margin-bottom: 4px;
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 4px;

        .binding-name {
            font-size: 12px;
            font-weight: 600;
            color: var(--el-text-color-primary);
        }

        .binding-meta {
            font-size: 11px;
            color: var(--el-text-color-secondary);
            margin-top: 2px;
        }

        .binding-actions {
            display: flex;
            gap: 4px;
            margin-top: 4px;
        }
    }
}

.svg-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    margin-right: 4px;
}
.svg-icon :deep(svg) {
    width: 100%;
    height: 100%;
}
</style>
