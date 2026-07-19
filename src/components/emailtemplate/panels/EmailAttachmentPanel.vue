<script setup lang="ts" name="EmailAttachmentPanel">
import { i18n } from "@/lang";
import type { EmailTemplateDesigner } from "../composables/useEmailTemplateDesigner";

const props = defineProps<{
    designer: EmailTemplateDesigner;
    readonly?: boolean;
}>();

const emit = defineEmits<{
    (e: "add"): void;
}>();

const formatSize = (size?: number) => {
    if (!size) return "";
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / 1024 / 1024).toFixed(1)}MB`;
};
</script>

<template>
    <div class="email-attachment-panel">
        <div class="panel-header">
            <span>{{ i18n("emailtemplate.attachment.title") }}</span>
            <el-button  text :disabled="readonly" @click="emit('add')">
                <el-icon><Plus/></el-icon>
            </el-button>
        </div>
        <div class="panel-body">
            <div
                v-for="att in designer.state.attachments"
                :key="att.id"
                class="att-item"
            >
                <div class="att-info">
                    <el-icon class="att-icon"><Document/></el-icon>
                    <div class="att-meta">
                        <div class="att-name">{{ att.name }}</div>
                        <div class="att-size" v-if="att.size">{{ formatSize(att.size) }}</div>
                    </div>
                </div>
                <div class="att-actions" v-if="!readonly">
                    <el-button  text @click="designer.removeAttachment(att.id)">
                        <el-icon><Delete/></el-icon>
                    </el-button>
                </div>
            </div>
            <div class="empty-tip" v-if="designer.state.attachments.length === 0">
                {{ i18n("emailtemplate.attachment.empty") }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Plus, Delete, Document } from "@element-plus/icons-vue";
export default { components: { Plus, Delete, Document } };
</script>

<style lang="scss" scoped>
.email-attachment-panel {
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

    .att-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 8px;
        margin-bottom: 4px;
        background: var(--el-fill-color-light);
        border-radius: 4px;

        .att-info {
            display: flex;
            align-items: center;
            gap: 6px;
            flex: 1;
            overflow: hidden;

            .att-icon {
                color: var(--el-color-primary);
            }

            .att-meta {
                display: flex;
                flex-direction: column;
                gap: 2px;
                overflow: hidden;

                .att-name {
                    font-size: 12px;
                    font-weight: 500;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .att-size {
                    font-size: 11px;
                    color: var(--el-text-color-placeholder);
                }
            }
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
