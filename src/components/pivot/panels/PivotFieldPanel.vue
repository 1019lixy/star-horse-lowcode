<script setup lang="ts" name="PivotFieldPanel">
import { computed } from "vue";
import { i18n } from "@/lang";
import draggable from "vuedraggable-es";
import type { PivotDesigner } from "../composables/usePivotDesigner";
import type { PivotField } from "../types";

const props = defineProps<{
    designer: PivotDesigner;
    readonly?: boolean;
}>();

const emit = defineEmits<{
    (e: "editField", fieldName: string): void;
}>();

const dragOptions = {
    group: "pivot-fields",
    disabled: false,
    ghostClass: "field-ghost",
    animation: 150,
};

/** 行字段列表（draggable v-model，必须用 computed 包装为可写响应式引用） */
const rowFields = computed<PivotField[]>({
    get: () => props.designer.state.config.rows
        .map((name) => props.designer.state.fields.find((f) => f.name === name))
        .filter(Boolean) as PivotField[],
    set: (val) => {
        props.designer.state.config.rows = val.map((f) => f.name);
    },
});

const colFields = computed<PivotField[]>({
    get: () => props.designer.state.config.columns
        .map((name) => props.designer.state.fields.find((f) => f.name === name))
        .filter(Boolean) as PivotField[],
    set: (val) => {
        props.designer.state.config.columns = val.map((f) => f.name);
    },
});

const valFields = computed<PivotField[]>({
    get: () => props.designer.state.config.values
        .map((name) => props.designer.state.fields.find((f) => f.name === name))
        .filter(Boolean) as PivotField[],
    set: (val) => {
        props.designer.state.config.values = val.map((f) => f.name);
    },
});

const unusedFieldList = computed<PivotField[]>({
    get: () => props.designer.unusedFields.value,
    set: () => {
        // unused fields 不需要排序
    },
});

const handleDropToUnused = (item: PivotField) => {
    props.designer.removeFromRow(item.name);
    props.designer.removeFromColumn(item.name);
    props.designer.removeFromValue(item.name);
};
</script>

<template>
    <div class="pivot-field-panel">
        <!-- 未使用字段 -->
        <div class="section">
            <div class="section-title">{{ i18n("pivot.section.fields") }}</div>
            <draggable
                v-model="unusedFieldList"
                v-bind="dragOptions"
                :item-key="(f: PivotField) => f.name"
                class="field-list"
                @add="(e) => e.element && handleDropToUnused(e.element)"
            >
                <template #item="{ element }">
                    <div class="field-chip" @dblclick="emit('editField', element.name)">
                        <el-icon class="type-icon">
                            <component :is="element.type === 'number' ? 'Histogram' : element.type === 'date' ? 'Calendar' : 'Document'"/>
                        </el-icon>
                        <span class="chip-text">{{ element.label }}</span>
                        <el-button  text @click.stop="emit('editField', element.name)">
                            <el-icon><Edit/></el-icon>
                        </el-button>
                    </div>
                </template>
            </draggable>
        </div>

        <div class="drop-zones">
            <!-- 行区域 -->
            <div class="drop-zone">
                <div class="zone-title">
                    <el-icon><Operation/></el-icon>
                    {{ i18n("pivot.section.rows") }}
                </div>
                <draggable
                    v-model="rowFields"
                    v-bind="dragOptions"
                    :item-key="(f: PivotField) => f.name"
                    class="zone-content"
                >
                    <template #item="{ element }">
                        <div class="field-chip row-chip">
                            <span>{{ element.label }}</span>
                            <el-button  text @click.stop="designer.removeFromRow(element.name)">
                                <el-icon><Close/></el-icon>
                            </el-button>
                        </div>
                    </template>
                </draggable>
            </div>

            <!-- 列区域 -->
            <div class="drop-zone">
                <div class="zone-title">
                    <el-icon><Operation/></el-icon>
                    {{ i18n("pivot.section.columns") }}
                </div>
                <draggable
                    v-model="colFields"
                    v-bind="dragOptions"
                    :item-key="(f: PivotField) => f.name"
                    class="zone-content"
                >
                    <template #item="{ element }">
                        <div class="field-chip col-chip">
                            <span>{{ element.label }}</span>
                            <el-button  text @click.stop="designer.removeFromColumn(element.name)">
                                <el-icon><Close/></el-icon>
                            </el-button>
                        </div>
                    </template>
                </draggable>
            </div>

            <!-- 值区域 -->
            <div class="drop-zone">
                <div class="zone-title">
                    <el-icon><DataLine/></el-icon>
                    {{ i18n("pivot.section.values") }}
                </div>
                <draggable
                    v-model="valFields"
                    v-bind="dragOptions"
                    :item-key="(f: PivotField) => f.name"
                    class="zone-content"
                >
                    <template #item="{ element }">
                        <div class="field-chip value-chip">
                            <span>{{ element.label }}</span>
                            <el-tag >{{ element.aggregation }}</el-tag>
                            <el-button  text @click.stop="designer.removeFromValue(element.name)">
                                <el-icon><Close/></el-icon>
                            </el-button>
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Edit, Close, Operation, DataLine } from "@element-plus/icons-vue";
export default { components: { Edit, Close, Operation, DataLine } };
</script>

<style lang="scss" scoped>
.pivot-field-panel {
    width: 260px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--el-border-color);
    background: var(--el-bg-color);
    overflow: hidden;
    padding: 8px;
    gap: 8px;

    .section {
        .section-title {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            margin-bottom: 4px;
            font-weight: 600;
        }

        .field-list {
            min-height: 60px;
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            padding: 6px;
            background: var(--el-fill-color-light);
            border-radius: 4px;
        }
    }

    .drop-zones {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow: auto;

        .drop-zone {
            background: var(--el-fill-color-light);
            border-radius: 4px;
            padding: 6px;

            .zone-title {
                font-size: 12px;
                color: var(--el-text-color-secondary);
                margin-bottom: 4px;
                display: flex;
                align-items: center;
                gap: 4px;
                font-weight: 600;
            }

            .zone-content {
                min-height: 36px;
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
            }
        }
    }

    .field-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: var(--el-bg-color);
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 12px;
        cursor: move;
        user-select: none;

        &.row-chip {
            border-color: var(--el-color-primary);
            color: var(--el-color-primary);
        }

        &.col-chip {
            border-color: var(--el-color-success);
            color: var(--el-color-success);
        }

        &.value-chip {
            border-color: var(--el-color-warning);
            color: var(--el-color-warning);
        }

        .type-icon {
            font-size: 12px;
        }

        .chip-text {
            white-space: nowrap;
        }

        &.field-ghost {
            opacity: 0.5;
        }
    }
}
</style>
