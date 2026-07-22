<script setup lang="ts" name="EmailVariablePanel">
import { i18n } from "@/lang";
import { ShSvgIcon } from "@/components/shared";
import type { EmailTemplateDesigner } from "../composables/useEmailTemplateDesigner";
import { EMAIL_VARIABLE_TYPE_PRESETS } from "../constants";

const props = defineProps<{
    designer: EmailTemplateDesigner;
    readonly?: boolean;
}>();

const emit = defineEmits<{
    (e: "insert", varName: string): void;
    (e: "edit", varId: string): void;
    (e: "add"): void;
}>();

const getTypeLabel = (type: string) =>
    EMAIL_VARIABLE_TYPE_PRESETS.find((t) => t.value === type)?.label ?? type;
</script>

<template>
    <div class="email-variable-panel">
        <div class="panel-header">
            <span>{{ i18n("emailtemplate.variable.title") }}</span>
            <el-button text :disabled="readonly" @click="emit('add')">
                <ShSvgIcon name="plus" size="14px" />
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
                    <div class="var-label">{{ v.label || v.name }}</div>
                    <div class="var-meta">
                        <el-tag size="small">${{ v.name }}</el-tag>
                        <el-tag size="small" type="info">{{ getTypeLabel(v.type) }}</el-tag>
                    </div>
                </div>
                <div class="var-actions" v-if="!readonly">
                    <el-button text size="small" @click.stop="emit('insert', v.name)">
                        <ShSvgIcon name="plus" size="12px" />
                    </el-button>
                    <el-button text size="small" @click.stop="emit('edit', v.id)">
                        <ShSvgIcon name="edit" size="12px" />
                    </el-button>
                    <el-button text size="small" type="danger" @click.stop="designer.removeVariable(v.id)">
                        <ShSvgIcon name="delete" size="12px" />
                    </el-button>
                </div>
            </div>
            <div class="empty-tip" v-if="designer.state.variables.length === 0">
                {{ i18n("emailtemplate.variable.empty") }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.email-variable-panel {
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
        padding: 6px 8px;
        margin-bottom: 4px;
        background: var(--el-fill-color-light);
        border-radius: 4px;
        cursor: pointer;

        &.selected {
            background: var(--el-color-primary-light-9);
        }

        .var-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
            flex: 1;

            .var-label {
                font-size: 12px;
                font-weight: 500;
            }

            .var-meta {
                display: flex;
                gap: 4px;
            }
        }

        .var-actions {
            display: flex;
            gap: 2px;
        }
    }

    .empty-tip {
        text-align: center;
        color: var(--el-text-color-placeholder);
        padding: 16px 0;
        font-size: 12px;
    }
}
</style>
