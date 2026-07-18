/**
 * Office 文档设计器状态管理：文档列表 + 当前文档
 */
import { computed, reactive, ref } from "vue";
import { createOfficeDoc, genOfficeId } from "../constants";
import type { OfficeDocType, OfficeDocument } from "../types";

export interface OfficeDesignerState {
    documents: OfficeDocument[];
    currentDocId: string | null;
}

export const useOfficeDesigner = (initialDocs: OfficeDocument[] = []) => {
    const state = reactive<OfficeDesignerState>({
        documents: initialDocs ? JSON.parse(JSON.stringify(initialDocs)) : [],
        currentDocId: initialDocs.length > 0 ? initialDocs[0].id : null,
    });

    /** 是否展示新建对话框 */
    const createDialogVisible = ref(false);
    /** 新建表单 */
    const createForm = reactive<{ name: string; type: OfficeDocType }>({
        name: "",
        type: "word",
    });

    /** 当前选中文档 */
    const currentDoc = computed<OfficeDocument | null>(
        () => state.documents.find((d) => d.id === state.currentDocId) ?? null,
    );

    /** 选中文档 */
    const selectDoc = (id: string | null) => {
        state.currentDocId = id;
    };

    /** 打开新建对话框 */
    const openCreateDialog = (type: OfficeDocType = "word") => {
        createForm.name = "";
        createForm.type = type;
        createDialogVisible.value = true;
    };

    /** 确认新建文档 */
    const confirmCreate = (): OfficeDocument | null => {
        if (!createForm.name.trim()) return null;
        const doc = createOfficeDoc({ name: createForm.name.trim(), type: createForm.type });
        state.documents.push(doc);
        state.currentDocId = doc.id;
        createDialogVisible.value = false;
        return doc;
    };

    /** 直接新建文档（不弹窗） */
    const createDoc = (name: string, type: OfficeDocType): OfficeDocument => {
        const doc = createOfficeDoc({ name, type });
        state.documents.push(doc);
        state.currentDocId = doc.id;
        return doc;
    };

    /** 打开文档 */
    const openDoc = (id: string) => {
        if (state.documents.some((d) => d.id === id)) {
            state.currentDocId = id;
        }
    };

    /** 删除文档 */
    const deleteDoc = (id: string) => {
        const idx = state.documents.findIndex((d) => d.id === id);
        if (idx < 0) return;
        state.documents.splice(idx, 1);
        if (state.currentDocId === id) {
            state.currentDocId = state.documents.length > 0 ? state.documents[0].id : null;
        }
    };

    /** 重命名文档 */
    const renameDoc = (id: string, name: string) => {
        const doc = state.documents.find((d) => d.id === id);
        if (!doc) return;
        doc.name = name;
        doc.updatedAt = new Date().toISOString();
    };

    /** 保存当前文档（更新时间戳并触发上层持久化） */
    const saveCurrentDoc = (): OfficeDocument | null => {
        if (!currentDoc.value) return null;
        currentDoc.value.updatedAt = new Date().toISOString();
        return currentDoc.value;
    };

    /** 更新当前文档内容（标记 updatedAt） */
    const touchCurrentDoc = () => {
        if (currentDoc.value) currentDoc.value.updatedAt = new Date().toISOString();
    };

    /** 复制一个新 ID（用于深拷贝场景） */
    const cloneDocWithNewId = (doc: OfficeDocument): OfficeDocument => {
        const cloned: OfficeDocument = JSON.parse(JSON.stringify(doc));
        cloned.id = genOfficeId("doc");
        cloned.createdAt = new Date().toISOString();
        cloned.updatedAt = cloned.createdAt;
        return cloned;
    };

    return {
        state,
        createDialogVisible,
        createForm,
        currentDoc,
        selectDoc,
        openCreateDialog,
        confirmCreate,
        createDoc,
        openDoc,
        deleteDoc,
        renameDoc,
        saveCurrentDoc,
        touchCurrentDoc,
        cloneDocWithNewId,
    };
};
