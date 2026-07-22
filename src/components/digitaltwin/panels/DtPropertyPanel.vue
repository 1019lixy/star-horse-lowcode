<script setup lang="ts" name="DtPropertyPanel">
/**
 * 数字孪生 - 属性面板
 *
 * 信号驱动：监听 objectSelected/objectChanged 自动更新表单
 * 表单变化 → 实时更新 DtEntity → 派发 objectChanged 信号 → 视口自动同步
 */
import { ref } from "vue";
import { ShSvgIcon } from "@/components/shared";
import { dtApp, useAddSignal, useDispatchSignal, SIGNAL_NAMES } from "../core/DtApp";
import { DT_ENTITY_TYPE_PRESETS, DT_STATUS_PRESETS } from "../constants";
import type { DtEntity, DtEntityStatus, DtPoint3D, DtSize3D } from "../types";

const emit = defineEmits<{
    (e: "edit-entity", id: string): void;
}>();

/* ----------------------- 当前实体 ----------------------- */
const currentEntity = ref<DtEntity | null>(null);

useAddSignal(SIGNAL_NAMES.objectSelected, (entity: DtEntity | null) => {
    currentEntity.value = entity ? { ...entity } : null;
});

useAddSignal(SIGNAL_NAMES.objectChanged, (entity: DtEntity) => {
    if (currentEntity.value?.id === entity.id) {
        currentEntity.value = { ...entity };
    }
});

useAddSignal(SIGNAL_NAMES.objectDeselected, () => {
    currentEntity.value = null;
});

/* ----------------------- 表单双向绑定（直接写回 DtEntity） ----------------------- */
const updatePosition = (key: keyof DtPoint3D, value: number): void => {
    if (!currentEntity.value) return;
    const entity = dtApp.findEntity(currentEntity.value.id);
    if (!entity) return;
    entity.position[key] = value;
    currentEntity.value.position[key] = value;
    useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
};

const updateSize = (key: keyof DtSize3D, value: number): void => {
    if (!currentEntity.value) return;
    const entity = dtApp.findEntity(currentEntity.value.id);
    if (!entity) return;
    entity.size[key] = value;
    currentEntity.value.size[key] = value;
    useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
};

const updateName = (value: string): void => {
    if (!currentEntity.value) return;
    const entity = dtApp.findEntity(currentEntity.value.id);
    if (!entity) return;
    entity.name = value;
    currentEntity.value.name = value;
    useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
};

const updateColor = (value: string): void => {
    if (!currentEntity.value) return;
    const entity = dtApp.findEntity(currentEntity.value.id);
    if (!entity) return;
    entity.color = value;
    currentEntity.value.color = value;
    useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
};

const updateStatus = (value: DtEntityStatus): void => {
    if (!currentEntity.value) return;
    const entity = dtApp.findEntity(currentEntity.value.id);
    if (!entity) return;
    entity.status = value;
    currentEntity.value.status = value;
    useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
};

const updateVisible = (value: boolean): void => {
    if (!currentEntity.value) return;
    const entity = dtApp.findEntity(currentEntity.value.id);
    if (!entity) return;
    entity.visible = value;
    currentEntity.value.visible = value;
    useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
};

const updateLocked = (value: boolean): void => {
    if (!currentEntity.value) return;
    if (value) {
        dtApp.lock(currentEntity.value.id);
    } else {
        dtApp.unlock(currentEntity.value.id);
    }
};

/* ----------------------- 类型选项 ----------------------- */
const typeOptions = DT_ENTITY_TYPE_PRESETS.map((p) => ({
    label: p.type,
    value: p.type,
}));

const statusOptions = DT_STATUS_PRESETS.map((s) => ({
    label: s.status,
    value: s.status,
    color: s.color,
}));
</script>

<template>
    <div class="dt-property-panel">
        <div class="panel-header">
            <span class="panel-title">属性面板</span>
        </div>

        <div class="panel-body" v-if="currentEntity">
            <!-- 基本信息 -->
            <div class="section">
                <div class="section-title">基本信息</div>
                <div class="form-row">
                    <label>名称</label>
                    <el-input
                        :model-value="currentEntity.name"
                        size="small"
                        @update:model-value="updateName"
                    />
                </div>
                <div class="form-row">
                    <label>类型</label>
                    <el-select :model-value="currentEntity.type" size="small" disabled>
                        <el-option
                            v-for="t in typeOptions"
                            :key="t.value"
                            :label="t.label"
                            :value="t.value"
                        />
                    </el-select>
                </div>
                <div class="form-row">
                    <label>状态</label>
                    <el-select
                        :model-value="currentEntity.status"
                        size="small"
                        @update:model-value="updateStatus"
                    >
                        <el-option
                            v-for="s in statusOptions"
                            :key="s.value"
                            :label="s.label"
                            :value="s.value"
                        >
                            <span class="status-option">
                                <span class="status-dot" :style="{ background: s.color }" />
                                {{ s.label }}
                            </span>
                        </el-option>
                    </el-select>
                </div>
                <div class="form-row">
                    <label>颜色</label>
                    <el-color-picker
                        :model-value="currentEntity.color"
                        size="small"
                        @update:model-value="updateColor"
                    />
                </div>
            </div>

            <!-- 位置 -->
            <div class="section">
                <div class="section-title">位置</div>
                <div class="form-row">
                    <label>X</label>
                    <el-input-number
                        :model-value="currentEntity.position.x"
                        size="small"
                        :step="10"
                        @update:model-value="(v: number) => updatePosition('x', v)"
                    />
                </div>
                <div class="form-row">
                    <label>Y</label>
                    <el-input-number
                        :model-value="currentEntity.position.y"
                        size="small"
                        :step="10"
                        @update:model-value="(v: number) => updatePosition('y', v)"
                    />
                </div>
                <div class="form-row">
                    <label>Z</label>
                    <el-input-number
                        :model-value="currentEntity.position.z"
                        size="small"
                        :step="10"
                        @update:model-value="(v: number) => updatePosition('z', v)"
                    />
                </div>
            </div>

            <!-- 尺寸 -->
            <div class="section">
                <div class="section-title">尺寸</div>
                <div class="form-row" v-if="currentEntity.type === 'cube' || currentEntity.type === 'plane'">
                    <label>宽度</label>
                    <el-input-number
                        :model-value="currentEntity.size.width"
                        size="small"
                        :step="10"
                        :min="0"
                        @update:model-value="(v: number) => updateSize('width', v)"
                    />
                </div>
                <div class="form-row" v-if="currentEntity.type === 'cube' || currentEntity.type === 'cylinder'">
                    <label>高度</label>
                    <el-input-number
                        :model-value="currentEntity.size.height"
                        size="small"
                        :step="10"
                        :min="0"
                        @update:model-value="(v: number) => updateSize('height', v)"
                    />
                </div>
                <div class="form-row" v-if="currentEntity.type === 'cube' || currentEntity.type === 'plane'">
                    <label>深度</label>
                    <el-input-number
                        :model-value="currentEntity.size.depth"
                        size="small"
                        :step="10"
                        :min="0"
                        @update:model-value="(v: number) => updateSize('depth', v)"
                    />
                </div>
                <div class="form-row" v-if="currentEntity.type === 'cylinder' || currentEntity.type === 'sphere'">
                    <label>半径</label>
                    <el-input-number
                        :model-value="currentEntity.size.radius"
                        size="small"
                        :step="5"
                        :min="0"
                        @update:model-value="(v: number) => updateSize('radius', v)"
                    />
                </div>
            </div>

            <!-- 显示控制 -->
            <div class="section">
                <div class="section-title">显示控制</div>
                <div class="form-row">
                    <label>可见</label>
                    <el-switch
                        :model-value="currentEntity.visible !== false"
                        @update:model-value="updateVisible"
                    />
                </div>
                <div class="form-row">
                    <label>锁定</label>
                    <el-switch
                        :model-value="!!currentEntity.locked"
                        @update:model-value="updateLocked"
                    />
                </div>
            </div>

            <!-- 传感器数据 -->
            <div class="section" v-if="currentEntity.sensorData && Object.keys(currentEntity.sensorData).length > 0">
                <div class="section-title">传感器数据</div>
                <div class="form-row" v-for="(metric, key) in currentEntity.sensorData" :key="key">
                    <label>{{ key }}</label>
                    <span class="metric-value">{{ metric.value }} {{ metric.unitKey }}</span>
                </div>
            </div>
        </div>

        <!-- 空状态 -->
        <div class="empty-state" v-else>
            <ShSvgIcon name="info" size="32px" />
            <p>未选中实体</p>
            <p class="hint">在场景中点击实体查看属性</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dt-property-panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
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
        padding: 8px 12px;
    }

    .section {
        margin-bottom: 16px;

        .section-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--el-text-color-secondary);
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid var(--el-border-color-lighter);
        }
    }

    .form-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;

        label {
            width: 48px;
            font-size: 12px;
            color: var(--el-text-color-regular);
            flex-shrink: 0;
        }

        .el-input,
        .el-select,
        .el-input-number {
            flex: 1;
        }

        .metric-value {
            font-size: 12px;
            color: var(--el-text-color-secondary);
        }
    }

    .empty-state {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: var(--el-text-color-secondary);

        p {
            font-size: 13px;
            margin: 0;
        }

        .hint {
            font-size: 11px;
            opacity: 0.6;
        }
    }

    .status-option {
        display: flex;
        align-items: center;
        gap: 6px;

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }
    }
}
</style>
