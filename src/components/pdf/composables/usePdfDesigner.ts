/**
 * PDF 模板设计器状态管理
 *
 * 支持多选、对齐、剪贴板、自动布局、右键菜单等企业级功能
 */
import { computed, reactive, ref } from "vue";
import { createElement, createTemplate } from "../constants";
import type { PdfElement, PdfElementType, PdfPage, PdfTemplate } from "../types";

export const usePdfDesigner = (initial?: Partial<PdfTemplate>) => {
    const state = reactive<PdfTemplate>(
        createTemplate(initial ?? {}),
    );

    /** 多选 ID 列表 */
    const selectedElementIds = ref<string[]>([]);

    /** 单选 ID（向后兼容，取多选列表第一个） */
    const selectedElementId = computed<string | null>(() => selectedElementIds.value[0] ?? null);

    const selectedElement = computed<PdfElement | null>(() => {
        if (!selectedElementIds.value.length) return null;
        return state.elements.find((e) => e.id === selectedElementIds.value[0]) ?? null;
    });

    /** 选中数量 */
    const selectedCount = computed(() => selectedElementIds.value.length);

    const history: PdfTemplate[] = [];
    const historyIndex = ref(-1);

    /** 剪贴板 */
    const clipboard = ref<PdfElement[]>([]);

    const pushHistory = () => {
        if (historyIndex.value < history.length - 1) history.splice(historyIndex.value + 1);
        history.push(JSON.parse(JSON.stringify(state)));
        if (history.length > 50) history.shift();
        historyIndex.value = history.length - 1;
    };

    const undo = () => {
        if (historyIndex.value <= 0) return;
        historyIndex.value--;
        Object.assign(state, JSON.parse(JSON.stringify(history[historyIndex.value])));
        selectedElementIds.value = [];
    };

    const redo = () => {
        if (historyIndex.value >= history.length - 1) return;
        historyIndex.value++;
        Object.assign(state, JSON.parse(JSON.stringify(history[historyIndex.value])));
        selectedElementIds.value = [];
    };

    /** 添加元素 */
    const addElement = (type: PdfElementType, overrides: Partial<any> = {}): PdfElement => {
        pushHistory();
        const el = createElement(type, {
            ...overrides,
            zIndex: state.elements.length,
        });
        state.elements.push(el);
        selectedElementIds.value = [el.id];
        return el;
    };

    /** 更新元素（in-place） */
    const updateElement = (id: string, updates: Partial<any>) => {
        const el = state.elements.find((e) => e.id === id);
        if (!el) return;
        pushHistory();
        Object.assign(el, updates);
    };

    /** 删除元素 */
    const removeElement = (id: string) => {
        pushHistory();
        state.elements = state.elements.filter((e) => e.id !== id);
        selectedElementIds.value = selectedElementIds.value.filter((sid) => sid !== id);
    };

    /** 删除所有选中元素 */
    const deleteSelected = () => {
        if (selectedElementIds.value.length === 0) return;
        pushHistory();
        state.elements = state.elements.filter((e) => !selectedElementIds.value.includes(e.id));
        selectedElementIds.value = [];
    };

    /** 选中元素（支持 Ctrl 多选） */
    const selectElement = (id: string | null, multiSelect: boolean = false) => {
        if (id === null) {
            selectedElementIds.value = [];
            return;
        }
        if (multiSelect) {
            const idx = selectedElementIds.value.indexOf(id);
            if (idx >= 0) {
                selectedElementIds.value.splice(idx, 1);
            } else {
                selectedElementIds.value.push(id);
            }
        } else {
            selectedElementIds.value = [id];
        }
    };

    /** 全选 */
    const selectAll = () => {
        selectedElementIds.value = state.elements.map((e) => e.id);
    };

    /** 清除选中 */
    const clearSelection = () => {
        selectedElementIds.value = [];
    };

    /** 移动元素（不自动 pushHistory，由 canvas 在 mouseup 时调用） */
    const moveElement = (id: string, x: number, y: number) => {
        const el = state.elements.find((e) => e.id === id);
        if (!el) return;
        el.x = x;
        el.y = y;
    };

    /** 批量移动选中元素（方向键微调） */
    const moveSelectedBy = (dx: number, dy: number) => {
        if (selectedElementIds.value.length === 0) return;
        pushHistory();
        for (const id of selectedElementIds.value) {
            const el = state.elements.find((e) => e.id === id);
            if (el) {
                el.x = Math.max(0, el.x + dx);
                el.y = Math.max(0, el.y + dy);
            }
        }
    };

    /** 调整尺寸 */
    const resizeElement = (id: string, width: number, height: number) => {
        const el = state.elements.find((e) => e.id === id);
        if (!el) return;
        pushHistory();
        el.width = width;
        el.height = height;
    };

    /** 复制元素 */
    const duplicateElement = (id: string) => {
        const el = state.elements.find((e) => e.id === id);
        if (!el) return;
        pushHistory();
        const copy = JSON.parse(JSON.stringify(el));
        copy.id = `pdf_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        copy.x += 10;
        copy.y += 10;
        state.elements.push(copy);
        selectedElementIds.value = [copy.id];
    };

    /** 复制选中到剪贴板 */
    const copySelected = () => {
        const selected = state.elements.filter((e) => selectedElementIds.value.includes(e.id));
        if (selected.length === 0) return;
        clipboard.value = JSON.parse(JSON.stringify(selected));
    };

    /** 剪切选中 */
    const cutSelected = () => {
        copySelected();
        deleteSelected();
    };

    /** 粘贴剪贴板内容 */
    const pasteElements = () => {
        if (clipboard.value.length === 0) return;
        pushHistory();
        const newIds: string[] = [];
        for (const item of clipboard.value) {
            const copy = JSON.parse(JSON.stringify(item));
            copy.id = `pdf_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
            copy.x += 10;
            copy.y += 10;
            state.elements.push(copy);
            newIds.push(copy.id);
        }
        selectedElementIds.value = newIds;
    };

    /** 对齐选中元素 */
    const alignElements = (type: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
        const selected = state.elements.filter((e) => selectedElementIds.value.includes(e.id));
        if (selected.length < 2) return;
        pushHistory();
        switch (type) {
            case "left": {
                const minX = Math.min(...selected.map((e) => e.x));
                selected.forEach((e) => { e.x = minX; });
                break;
            }
            case "center": {
                const avgCenterX = selected.reduce((s, e) => s + e.x + e.width / 2, 0) / selected.length;
                selected.forEach((e) => { e.x = avgCenterX - e.width / 2; });
                break;
            }
            case "right": {
                const maxRight = Math.max(...selected.map((e) => e.x + e.width));
                selected.forEach((e) => { e.x = maxRight - e.width; });
                break;
            }
            case "top": {
                const minY = Math.min(...selected.map((e) => e.y));
                selected.forEach((e) => { e.y = minY; });
                break;
            }
            case "middle": {
                const avgCenterY = selected.reduce((s, e) => s + e.y + e.height / 2, 0) / selected.length;
                selected.forEach((e) => { e.y = avgCenterY - e.height / 2; });
                break;
            }
            case "bottom": {
                const maxBottom = Math.max(...selected.map((e) => e.y + e.height));
                selected.forEach((e) => { e.y = maxBottom - e.height; });
                break;
            }
        }
    };

    /** 上移一层 */
    const bringToFront = (id: string) => {
        const el = state.elements.find((e) => e.id === id);
        if (!el) return;
        pushHistory();
        const maxZ = Math.max(...state.elements.map((e) => e.zIndex ?? 0));
        el.zIndex = maxZ + 1;
    };

    /** 下移一层 */
    const sendToBack = (id: string) => {
        const el = state.elements.find((e) => e.id === id);
        if (!el) return;
        pushHistory();
        el.zIndex = 0;
    };

    /** 纸张大小变更时自动布局 */
    const autoLayoutOnResize = (oldPage: PdfPage, newPage: PdfPage) => {
        if (state.elements.length === 0) return;
        const oldContentW = oldPage.width - oldPage.marginLeft - oldPage.marginRight;
        const oldContentH = oldPage.height - oldPage.marginTop - oldPage.marginBottom;
        const newContentW = newPage.width - newPage.marginLeft - newPage.marginRight;
        const newContentH = newPage.height - newPage.marginTop - newPage.marginBottom;
        if (oldContentW <= 0 || oldContentH <= 0) return;
        const scaleX = newContentW / oldContentW;
        const scaleY = newContentH / oldContentH;
        pushHistory();
        for (const el of state.elements) {
            el.x = newPage.marginLeft + (el.x - oldPage.marginLeft) * scaleX;
            el.y = newPage.marginTop + (el.y - oldPage.marginTop) * scaleY;
            el.width = Math.min(el.width * scaleX, newContentW);
            el.height = Math.min(el.height * scaleY, newContentH);
            el.x = Math.max(newPage.marginLeft, Math.min(el.x, newPage.width - newPage.marginRight - el.width));
            el.y = Math.max(newPage.marginTop, Math.min(el.y, newPage.height - newPage.marginBottom - el.height));
        }
    };

    /** 更新页面配置 */
    const updatePage = (updates: Partial<PdfTemplate["page"]>) => {
        pushHistory();
        Object.assign(state.page, updates);
    };

    /** 加载数据 */
    const loadData = (data: PdfTemplate) => {
        Object.assign(state, JSON.parse(JSON.stringify(data)));
        selectedElementIds.value = [];
        history.length = 0;
        historyIndex.value = -1;
    };

    const getData = (): PdfTemplate => JSON.parse(JSON.stringify(state));

    return {
        state,
        selectedElementId,
        selectedElementIds,
        selectedElement,
        selectedCount,
        clipboard,
        addElement,
        updateElement,
        removeElement,
        deleteSelected,
        selectElement,
        selectAll,
        clearSelection,
        moveElement,
        moveSelectedBy,
        resizeElement,
        duplicateElement,
        copySelected,
        cutSelected,
        pasteElements,
        alignElements,
        bringToFront,
        sendToBack,
        autoLayoutOnResize,
        updatePage,
        loadData,
        getData,
        undo,
        redo,
        pushHistory,
    };
};

export type PdfDesigner = ReturnType<typeof usePdfDesigner>;
