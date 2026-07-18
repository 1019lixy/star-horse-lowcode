<script setup lang="ts" name="OfficeDocumentList">
import { computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { i18n } from "@/lang";
import { findOfficeDocPreset } from "../constants";
import type { OfficeDocument } from "../types";

const props = defineProps<{
    documents: OfficeDocument[];
    currentDocId: string | null;
}>();

const emit = defineEmits<{
    (e: "select", id: string): void;
    (e: "create"): void;
    (e: "delete", id: string): void;
    (e: "rename", id: string, name: string): void;
}>();

const docs = computed(() => props.documents);

const docTypeLabel = (doc: OfficeDocument): string =>
    findOfficeDocPreset(doc.type)?.label ?? doc.type;

const docTypeColor = (doc: OfficeDocument): string =>
    findOfficeDocPreset(doc.type)?.color ?? "#409EFF";

const formatDate = (iso: string): string => {
    try {
        const d = new Date(iso);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    } catch {
        return iso;
    }
};

const handleSelect = (id: string) => {
    emit("select", id);
};

const handleDelete = (doc: OfficeDocument) => {
    ElMessageBox.confirm(i18n("office.message.confirmDelete"), i18n("office.docList.delete"), {
        type: "warning",
    })
        .then(() => {
            emit("delete", doc.id);
            ElMessage.success(i18n("office.message.deleted"));
        })
        .catch(() => {
            /* 取消 */
        });
};

const handleRename = (doc: OfficeDocument) => {
    ElMessageBox.prompt(i18n("office.docList.inputName"), i18n("office.docList.rename"), {
        inputValue: doc.name,
        inputPattern: /.+/,
        inputErrorMessage: i18n("office.message.inputName"),
    })
        .then(({ value }) => {
            emit("rename", doc.id, value.trim());
        })
        .catch(() => {
            /* 取消 */
        });
};
</script>

<template>
    <div class="office-doc-list">
        <div class="doc-list-header">
            <span class="title">{{ i18n("office.docList.title") }}</span>
            <el-button  type="primary" @click="emit('create')">
                <el-icon><Plus/></el-icon>
                {{ i18n("office.docList.create") }}
            </el-button>
        </div>
        <div class="doc-list-body">
            <div v-if="docs.length === 0" class="empty">
                {{ i18n("office.docList.empty") }}
            </div>
            <div
                v-for="doc in docs"
                :key="doc.id"
                class="doc-item"
                :class="{ active: doc.id === currentDocId }"
                @click="handleSelect(doc.id)"
            >
                <div class="doc-main">
                    <div class="doc-name-row">
                        <span class="type-tag" :style="{ background: docTypeColor(doc) }">
                            {{ docTypeLabel(doc) }}
                        </span>
                        <span class="doc-name" :title="doc.name">{{ doc.name }}</span>
                    </div>
                    <div class="doc-time">{{ formatDate(doc.updatedAt) }}</div>
                </div>
                <div class="doc-actions" @click.stop>
                    <el-button  link @click="handleRename(doc)">
                        <el-icon><EditPen/></el-icon>
                    </el-button>
                    <el-button  link type="danger" @click="handleDelete(doc)">
                        <el-icon><Delete/></el-icon>
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Delete, EditPen, Plus } from "@element-plus/icons-vue";
export default { components: { Plus, EditPen, Delete } };
</script>

<style lang="scss" scoped>
.office-doc-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--el-border-color-lighter);

    .doc-list-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 10px;
        background: var(--el-fill-color-light);
        border-bottom: 1px solid var(--el-border-color-lighter);

        .title {
            font-weight: 600;
            font-size: 13px;
        }
    }

    .doc-list-body {
        flex: 1;
        overflow: auto;
        padding: 4px;

        .empty {
            text-align: center;
            color: var(--el-text-color-placeholder);
            font-size: 12px;
            padding: 24px 8px;
        }

        .doc-item {
            display: flex;
            align-items: center;
            padding: 6px 8px;
            border-radius: 4px;
            cursor: pointer;
            gap: 4px;
            transition: background 0.15s;

            &:hover {
                background: var(--el-fill-color-light);
            }

            &.active {
                background: var(--el-color-primary-light-9);
                border-left: 3px solid var(--el-color-primary);
                padding-left: 5px;
            }

            .doc-main {
                flex: 1;
                min-width: 0;

                .doc-name-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;

                    .type-tag {
                        color: #fff;
                        font-size: 10px;
                        padding: 1px 6px;
                        border-radius: 8px;
                        white-space: nowrap;
                    }

                    .doc-name {
                        font-size: 13px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }

                .doc-time {
                    font-size: 11px;
                    color: var(--el-text-color-placeholder);
                    margin-top: 2px;
                    margin-left: 2px;
                }
            }

            .doc-actions {
                display: flex;
                gap: 2px;
                opacity: 0.6;

                &:hover {
                    opacity: 1;
                }
            }
        }
    }
}
</style>
