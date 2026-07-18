<script setup lang="ts" name="EmailVariablePanel">
import { i18n } from "@/lang";
import type { EmailTemplateDesigner } from "../composables/useEmailTemplateDesigner";
import {DocumentAdd} from "@element-plus/icons-vue";

const props = defineProps<{
    designer: EmailTemplateDesigner;
    readonly?: boolean;
}>();

const emit = defineEmits<{
    (e: "insert", varName: string): void;
    (e: "edit", varId: string): void;
    (e: "add"): void;
}>();
</script>

<template>
    <div class="email-variable-panel">
        <div class="panel-header">
            <span>{{ i18n("emailtemplate.variable.title") }}</span>
            <el-button  text :disabled="readonly" @click="emit('add')">
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
                    <el-tag >${{ v.name }}</el-tag>
                </div>
                <div class="var-actions" v-if="!readonly">
                    <el-button  text @click.stop="emit('insert', v.name)">
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
                {{ i18n("emailtemplate.variable.empty") }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Plus, DocumentAdd, Edit, Delete } from "@element-plus/icons-vue";
export default { components: { Plus, DocumentAdd, Edit, Delete } };
</script>

<style lang="scss" scoped>
.email-variable-panel {
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

            .var-label {
                font-size: 12px;
                font-weight: 500;
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
