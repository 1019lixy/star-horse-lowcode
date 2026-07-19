<script setup lang="ts" name="OfficeEditor">
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import { useOfficeDesigner } from "./composables/useOfficeDesigner";
import { useOfficeHistory } from "./composables/useOfficeHistory";
import { createOfficeDoc } from "./constants";
import OfficeToolbar from "./panels/OfficeToolbar.vue";
import OfficeDocumentList from "./panels/OfficeDocumentList.vue";
import WordEditor from "./panels/WordEditor.vue";
import ExcelEditor from "./panels/ExcelEditor.vue";
import SlideEditor from "./panels/SlideEditor.vue";
import OfficeExportDialog from "./dialogs/OfficeExportDialog.vue";
import type { OfficeDocType, OfficeDocument } from "./types";

const props = defineProps<{
    /** 初始文档列表 */
    documents?: OfficeDocument[];
    /** 高度 */
    height?: number;
}>();

const designer = useOfficeDesigner(props.documents ?? []);
const exportVisible = ref(false);

/** 历史栈：基于当前文档深拷贝快照 */
const history = useOfficeHistory<OfficeDocument | null>(designer.currentDoc.value, 50);

/** 同步 designer.currentDoc -> history.current（切换文档时重置历史） */
watch(
    () => designer.currentDoc.value,
    (doc) => {
        history.reset(doc);
    },
);

const currentDoc = computed<OfficeDocument | null>(() => designer.currentDoc.value);
const activeType = computed<OfficeDocType | null>(() => currentDoc.value?.type ?? null);
const containerHeight = computed(() => `${props.height ?? 600}px`);

/** 新建文档（打开对话框） */
const handleNew = () => {
    designer.openCreateDialog("word");
};

/** 切换文档类型：基于当前文档复制为新类型 */
const handleSwitchType = (type: OfficeDocType) => {
    if (!currentDoc.value) {
        // 无当前文档：直接新建一个目标类型
        designer.createDoc(i18n("office.docList.create"), type);
        ElMessage.success(i18n("office.message.created"));
        return;
    }
    if (currentDoc.value.type === type) return;
    // 保留名称与 ID，重置内容
    const doc = createOfficeDoc({ name: currentDoc.value.name, type });
    doc.id = currentDoc.value.id;
    doc.createdAt = currentDoc.value.createdAt;
    // 替换 designer 中的文档
    const idx = designer.state.documents.findIndex((d) => d.id === doc.id);
    if (idx >= 0) designer.state.documents.splice(idx, 1, doc);
    ElMessage.success(i18n("office.message.created"));
};

/** 保存当前文档 */
const handleSave = () => {
    const saved = designer.saveCurrentDoc();
    if (saved) {
        ElMessage.success(i18n("office.message.saved"));
    } else {
        ElMessage.warning(i18n("office.message.noDocSelected"));
    }
};

/** 导出 */
const handleExport = () => {
    if (!currentDoc.value) {
        ElMessage.warning(i18n("office.message.noDocSelected"));
        return;
    }
    exportVisible.value = true;
};

/** 撤销 */
const handleUndo = () => {
    const v = history.undo();
    if (v === null) {
        ElMessage.info(i18n("office.message.undoEmpty"));
        return;
    }
    applyHistoryToDesigner(v);
    ElMessage.success(i18n("office.message.undone"));
};

/** 重做 */
const handleRedo = () => {
    const v = history.redo();
    if (v === null) {
        ElMessage.info(i18n("office.message.redoEmpty"));
        return;
    }
    applyHistoryToDesigner(v);
    ElMessage.success(i18n("office.message.redone"));
};

/** 将历史快照应用回 designer */
const applyHistoryToDesigner = (snap: OfficeDocument | null) => {
    if (!snap) return;
    const idx = designer.state.documents.findIndex((d) => d.id === snap.id);
    if (idx >= 0) designer.state.documents.splice(idx, 1, JSON.parse(JSON.stringify(snap)));
    designer.state.currentDocId = snap.id;
};

/** Word 内容更新 */
const handleWordUpdate = (html: { html: string }) => {
    if (!currentDoc.value) return;
    if (!currentDoc.value.wordContent) currentDoc.value.wordContent = { html: "" };
    if (currentDoc.value.wordContent.html === html.html) return;
    // 推入历史（推入"旧状态" -> current 更新为新值）
    history.push({ ...currentDoc.value, wordContent: { html: html.html } });
    currentDoc.value.wordContent.html = html.html;
    designer.touchCurrentDoc();
};

/** Excel 内容更新 */
const handleExcelUpdate = (content: OfficeDocument["excelContent"]) => {
    if (!currentDoc.value || !content) return;
    history.push({ ...currentDoc.value, excelContent: content });
    currentDoc.value.excelContent = content;
    designer.touchCurrentDoc();
};

/** Slide 内容更新 */
const handleSlideUpdate = (content: OfficeDocument["slideContent"]) => {
    if (!currentDoc.value || !content) return;
    history.push({ ...currentDoc.value, slideContent: content });
    currentDoc.value.slideContent = content;
    designer.touchCurrentDoc();
};

/** 新建文档对话框确认 */
const handleCreateConfirm = () => {
    const doc = designer.confirmCreate();
    if (doc) ElMessage.success(i18n("office.message.created"));
};

/** 文档列表操作 */
const handleSelect = (id: string) => designer.selectDoc(id);
const handleCreate = () => designer.openCreateDialog("word");
const handleDelete = (id: string) => designer.deleteDoc(id);
const handleRename = (id: string, name: string) => designer.renameDoc(id, name);
</script>

<template>
    <div class="office-editor" :style="{ height: containerHeight }">
        <office-toolbar
            :can-undo="history.canUndo.value"
            :can-redo="history.canRedo.value"
            :active-type="activeType"
            @new="handleNew"
            @save="handleSave"
            @export="handleExport"
            @undo="handleUndo"
            @redo="handleRedo"
            @switch-type="handleSwitchType"
        />
        <el-splitter class="office-main" direction="horizontal">
            <el-splitter-panel size="240px" min="180px" max="380px">
                <div class="office-left">
                    <office-document-list
                        :documents="designer.state.documents"
                        :current-doc-id="designer.state.currentDocId"
                        @select="handleSelect"
                        @create="handleCreate"
                        @delete="handleDelete"
                        @rename="handleRename"
                    />
                </div>
            </el-splitter-panel>
            <el-splitter-panel>
                <div class="office-right">
                    <div v-if="!currentDoc" class="no-doc">
                        {{ i18n("office.message.noDocSelected") }}
                    </div>
                    <word-editor
                        v-else-if="currentDoc.type === 'word'"
                        :key="currentDoc.id"
                        :content="currentDoc.wordContent ?? { html: '' }"
                        @update="handleWordUpdate"
                    />
                    <excel-editor
                        v-else-if="currentDoc.type === 'excel'"
                        :key="currentDoc.id"
                        :content="currentDoc.excelContent ?? { sheets: [] }"
                        @update="handleExcelUpdate"
                    />
                    <slide-editor
                        v-else-if="currentDoc.type === 'slide'"
                        :key="currentDoc.id"
                        :content="currentDoc.slideContent ?? { slides: [], canvasWidth: 960, canvasHeight: 540 }"
                        @update="handleSlideUpdate"
                    />
                </div>
            </el-splitter-panel>
        </el-splitter>
        <!-- 新建文档对话框 -->
        <el-dialog
            v-model="designer.createDialogVisible.value"
            :title="i18n('office.docList.create')"
            width="420px"
            append-to-body
        >
            <el-form label-width="80px" >
                <el-form-item :label="i18n('office.property.name')">
                    <el-input v-model="designer.createForm.name" :placeholder="i18n('office.docList.inputName')"/>
                </el-form-item>
                <el-form-item :label="i18n('office.property.type')">
                    <el-radio-group v-model="designer.createForm.type">
                        <el-radio value="word">{{ i18n("office.docType.word") }}</el-radio>
                        <el-radio value="excel">{{ i18n("office.docType.excel") }}</el-radio>
                        <el-radio value="slide">{{ i18n("office.docType.slide") }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="designer.createDialogVisible.value = false">{{ i18n("dialog.close") }}</el-button>
                <el-button type="primary" @click="handleCreateConfirm">{{ i18n("office.toolbar.new") }}</el-button>
            </template>
        </el-dialog>
        <!-- 导出对话框 -->
        <office-export-dialog
            v-model:visible="exportVisible"
            :doc="currentDoc"
        />
    </div>
</template>

<script lang="ts">
export default { name: "OfficeEditor" };
</script>

<style lang="scss" scoped>
.office-editor {
    width: 100%;
    display: flex;
    flex-direction: column;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: hidden;

    .office-main {
        flex: 1;
        overflow: hidden;

        .office-left {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        .office-right {
            width: 100%;
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;

            .no-doc {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--el-text-color-placeholder);
                font-size: 14px;
            }
        }
    }
}
</style>
