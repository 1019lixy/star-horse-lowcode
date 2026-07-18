/**
 * PDF 模板设计器状态管理
 */
import { computed, reactive, ref } from "vue";
import { createElement, createTemplate } from "../constants";
import type { PdfElement, PdfElementType, PdfTemplate } from "../types";

export const usePdfDesigner = (initial?: Partial<PdfTemplate>) => {
    const state = reactive<PdfTemplate>(
        createTemplate(initial ?? {}),
    );

    const selectedElementId = ref<string | null>(null);
    const history: PdfTemplate[] = [];
    const historyIndex = ref(-1);

    const selectedElement = computed<PdfElement | null>(() => {
        if (!selectedElementId.value) return null;
        return state.elements.find((e) => e.id === selectedElementId.value) ?? null;
    });

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
    };

    const redo = () => {
        if (historyIndex.value >= history.length - 1) return;
        historyIndex.value++;
        Object.assign(state, JSON.parse(JSON.stringify(history[historyIndex.value])));
    };

    /** 添加元素 */
    const addElement = (type: PdfElementType, overrides: Partial<any> = {}): PdfElement => {
        pushHistory();
        const el = createElement(type, {
            ...overrides,
            zIndex: state.elements.length,
        });
        state.elements.push(el);
        selectedElementId.value = el.id;
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
        if (selectedElementId.value === id) selectedElementId.value = null;
    };

    /** 选中元素 */
    const selectElement = (id: string | null) => {
        selectedElementId.value = id;
    };

    /** 移动元素 */
    const moveElement = (id: string, x: number, y: number) => {
        const el = state.elements.find((e) => e.id === id);
        if (!el) return;
        pushHistory();
        el.x = x;
        el.y = y;
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
        selectedElementId.value = copy.id;
    };

    /** 更新页面配置 */
    const updatePage = (updates: Partial<PdfTemplate["page"]>) => {
        pushHistory();
        Object.assign(state.page, updates);
    };

    /** 加载数据 */
    const loadData = (data: PdfTemplate) => {
        Object.assign(state, JSON.parse(JSON.stringify(data)));
        selectedElementId.value = null;
        history.length = 0;
        historyIndex.value = -1;
    };

    const getData = (): PdfTemplate => JSON.parse(JSON.stringify(state));

    return {
        state,
        selectedElementId,
        selectedElement,
        addElement,
        updateElement,
        removeElement,
        selectElement,
        moveElement,
        resizeElement,
        duplicateElement,
        updatePage,
        loadData,
        getData,
        undo,
        redo,
    };
};

export type PdfDesigner = ReturnType<typeof usePdfDesigner>;
