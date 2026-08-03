<script setup lang="ts" name="PivotFieldPanel">
import { computed } from "vue";
import { i18n } from "@/lang";
import draggable from "vuedraggable-es";
import type { PivotDesigner } from "../composables/usePivotDesigner";
import type { PivotField } from "../types";
import { ShSvgIcon } from "@/components/shared";

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
/** 字段类型 → svgIconRegistry key 映射 */
const fieldTypeIcon = (type: string): string => {
    if (type === "number") return "total";
    if (type === "date") return "date";
    return "text";
};

/** 字段类型 i18n label key */
const fieldTypeLabelKey = (type: string): string => {
    if (type === "number") return "pivot.fieldType.number";
    if (type === "date") return "pivot.fieldType.date";
    return "pivot.fieldType.string";
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
                <!-- @vue-ignore vuedraggable-es 未声明 #item slot 类型 -->
                <template #item="{ element }: { element: PivotField }">
                    <div class="field-chip" @dblclick="emit('editField', element.name)">
                        <ShSvgIcon :name="fieldTypeIcon(element.type)" size="12px"/>
                        <span class="chip-text">{{ element.label }}</span>
                        <el-button text size="small" @click.stop="emit('editField', element.name)" :title="i18n('pivot.btn.configField')">
                            <ShSvgIcon name="settings" size="12px"/>
                        </el-button>
                    </div>
                </template>
            </draggable>
        </div>

        <div class="drop-zones">
            <!-- 行区域 -->
            <div class="drop-zone">
                <div class="zone-title">
                    <ShSvgIcon name="total" size="12px"/>
                    {{ i18n("pivot.section.rows") }}
                </div>
                <draggable
                    v-model="rowFields"
                    v-bind="dragOptions"
                    :item-key="(f: PivotField) => f.name"
                    class="zone-content"
                >
                    <!-- @vue-ignore vuedraggable-es 未声明 #item slot 类型 -->
                    <template #item="{ element }: { element: PivotField }">
                        <div class="field-chip row-chip">
                            <span class="chip-label">{{ element.label }}</span>
                            <el-tag size="small" effect="plain">{{ i18n(fieldTypeLabelKey(element.type)) }}</el-tag>
                            <el-button text size="small" @click.stop="emit('editField', element.name)" :title="i18n('pivot.btn.configField')">
                                <ShSvgIcon name="settings" size="12px"/>
                            </el-button>
                            <el-button text size="small" @click.stop="designer.removeFromRow(element.name)" :title="i18n('pivot.btn.removeField')">
                                <ShSvgIcon name="close" size="12px"/>
                            </el-button>
                        </div>
                    </template>
                </draggable>
            </div>

            <!-- 列区域 -->
            <div class="drop-zone">
                <div class="zone-title">
                    <ShSvgIcon name="total" size="12px"/>
                    {{ i18n("pivot.section.columns") }}
                </div>
                <draggable
                    v-model="colFields"
                    v-bind="dragOptions"
                    :item-key="(f: PivotField) => f.name"
                    class="zone-content"
                >
                    <!-- @vue-ignore vuedraggable-es 未声明 #item slot 类型 -->
                    <template #item="{ element }: { element: PivotField }">
                        <div class="field-chip col-chip">
                            <span class="chip-label">{{ element.label }}</span>
                            <el-tag size="small" effect="plain">{{ i18n(fieldTypeLabelKey(element.type)) }}</el-tag>
                            <el-button text size="small" @click.stop="emit('editField', element.name)" :title="i18n('pivot.btn.configField')">
                                <ShSvgIcon name="settings" size="12px"/>
                            </el-button>
                            <el-button text size="small" @click.stop="designer.removeFromColumn(element.name)" :title="i18n('pivot.btn.removeField')">
                                <ShSvgIcon name="close" size="12px"/>
                            </el-button>
                        </div>
                    </template>
                </draggable>
            </div>

            <!-- 值区域 -->
            <div class="drop-zone">
                <div class="zone-title">
                    <ShSvgIcon name="chart" size="12px"/>
                    {{ i18n("pivot.section.values") }}
                </div>
                <draggable
                    v-model="valFields"
                    v-bind="dragOptions"
                    :item-key="(f: PivotField) => f.name"
                    class="zone-content"
                >
                    <!-- @vue-ignore vuedraggable-es 未声明 #item slot 类型 -->
                    <template #item="{ element }: { element: PivotField }">
                        <div class="field-chip value-chip">
                            <span class="chip-label">{{ element.label }}</span>
                            <el-tag size="small" effect="plain" type="warning">{{ element.aggregation }}</el-tag>
                            <el-button text size="small" @click.stop="emit('editField', element.name)" :title="i18n('pivot.btn.configField')">
                                <ShSvgIcon name="settings" size="12px"/>
                            </el-button>
                            <el-button text size="small" @click.stop="designer.removeFromValue(element.name)" :title="i18n('pivot.btn.removeField')">
                                <ShSvgIcon name="close" size="12px"/>
                            </el-button>
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default { components: {} };
</script>

<style lang="scss" scoped>
.pivot-field-panel {
    width: 100%;
    height: 100%;
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
        max-width: 100%;

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

        .chip-label {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 120px;
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
