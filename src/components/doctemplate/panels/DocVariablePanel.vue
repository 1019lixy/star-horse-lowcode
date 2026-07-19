<script setup lang="ts" name="DocVariablePanel">
import { i18n } from "@/lang";
import type { DocTemplateDesigner } from "../composables/useDocTemplateDesigner";
import { DOC_VARIABLE_TYPE_PRESETS } from "../constants";

const props = defineProps<{
    designer: DocTemplateDesigner;
    readonly?: boolean;
}>();

const emit = defineEmits<{
    (e: "insert", varName: string): void;
    (e: "edit", varId: string): void;
}>();

const getTypeLabel = (type: string) =>
    DOC_VARIABLE_TYPE_PRESETS.find((t) => t.value === type)?.label ?? type;

const handleInsert = (varName: string) => {
    emit("insert", varName);
};
</script>

<template>
    <div class="doc-variable-panel">
        <div class="panel-header">
            <span>{{ i18n("doctemplate.variable.title") }}</span>
            <el-button  text :disabled="readonly" @click="designer.addVariable()">
                <el-icon><Plus/></el-icon>
            </el-button>
        </div>
        <div class="panel-body">
            <div
                v-for="v in designer.state.variables"
                :key="v.id"
                class="var-item"
                :class="{ selected: v.id === designer.selectedVariableId }"
                @click="designer.selectVariable(v.id)"
            >
                <div class="var-info">
                    <div class="var-label">{{ v.label }}</div>
                    <div class="var-meta">
                        <el-tag >${{ v.name }}</el-tag>
                        <el-tag  type="info">{{ getTypeLabel(v.type) }}</el-tag>
                    </div>
                </div>
                <div class="var-actions" v-if="!readonly">
                    <el-button  text @click.stop="handleInsert(v.name)">
                        <el-icon><DocumentAdd/></el-icon>
                    </el-button>
                    <el-button  text @click.stop="emit('edit', v.id)">
                        <el-icon><Edit/></el-icon>
                    </el-button>
                    <el-button  text @click.stop="designer.removeVariable(v.id)">
                        <el-icon><Delete/></el-icon>
                    </el-button>
                </div>
            </div>
            <div class="empty-tip" v-if="designer.state.variables.length === 0">
                {{ i18n("doctemplate.variable.empty") }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Plus, DocumentAdd, Edit, Delete } from "@element-plus/icons-vue";
export default { components: { Plus, DocumentAdd, Edit, Delete } };
</script>

<style lang="scss" scoped>
.doc-variable-panel {
    width: 100%;
    height: 100%;
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

    .var-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        margin-bottom: 6px;
        background: var(--el-fill-color-light);
        border-radius: 4px;
        cursor: pointer;
        border: 1px solid transparent;

        &:hover {
            border-color: var(--el-color-primary-light-5);
        }

        &.selected {
            background: var(--el-color-primary-light-9);
            border-color: var(--el-color-primary);
        }

        .var-info {
            flex: 1;

            .var-label {
                font-size: 13px;
                font-weight: 500;
                margin-bottom: 4px;
            }

            .var-meta {
                display: flex;
                gap: 4px;
                flex-wrap: wrap;
            }
        }

        .var-actions {
            display: flex;
            flex-direction: column;
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
