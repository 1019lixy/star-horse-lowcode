/**
 * 打印模板设计器 - 状态管理 composable
 *
 * 职责：管理选中、复制、历史、缩放、吸附等纯 UI 状态
 * 不涉及渲染细节，渲染逻辑由 renderers/* 负责
 */

import { computed, reactive, ref } from "vue";
import {
    DEFAULT_PAPER,
    DEFAULT_SNAP_THRESHOLD,
    ELEMENT_FACTORIES,
    MAX_HISTORY_SIZE,
} from "../constants";
import type {
    PrintDesignerState,
    PrintElement,
    PrintPaper,
    PrintTemplate,
} from "../types";

/** 创建初始模板 */
const createInitialTemplate = (): PrintTemplate => ({
    id: `tpl_${Date.now()}`,
    name: "",
    code: "",
    paper: { ...DEFAULT_PAPER },
    elements: [],
    dataSources: [],
    version: 1,
});

/** 创建初始状态 */
const createInitialState = (template?: Partial<PrintTemplate>): PrintDesignerState => {
    const tpl = { ...createInitialTemplate(), ...template };
    return {
        template: tpl,
        selectedIds: [],
        clipboard: [],
        history: [JSON.parse(JSON.stringify(tpl))],
        historyIndex: 0,
        zoom: 1,
        showRuler: true,
        showGrid: true,
        snap: true,
        snapThreshold: DEFAULT_SNAP_THRESHOLD,
        readonly: false,
    };
};

/** 设计器 composable */
export function usePrintDesigner(initialTemplate?: Partial<PrintTemplate>) {
    const state = reactive<PrintDesignerState>(createInitialState(initialTemplate));

    // ==================== 选中相关 ====================
    const selectedElements = computed<PrintElement[]>(() =>
        state.template.elements.filter((el) => state.selectedIds.includes(el.id)),
    );

    const selectedElement = computed<PrintElement | null>(() =>
        selectedElements.value.length === 1 ? selectedElements.value[0] : null,
    );

    const selectElement = (id: string, multi = false) => {
        if (state.readonly) return;
        if (multi) {
            const idx = state.selectedIds.indexOf(id);
            if (idx >= 0) {
                state.selectedIds.splice(idx, 1);
            } else {
                state.selectedIds.push(id);
            }
        } else {
            state.selectedIds = [id];
        }
    };

    const clearSelection = () => {
        state.selectedIds = [];
    };

    const selectAll = () => {
        state.selectedIds = state.template.elements.map((el) => el.id);
    };

    // ==================== 元素操作 ====================
    const addElement = (type: string, overrides: Partial<PrintElement> = {}) => {
        if (state.readonly) return null;
        const factory = ELEMENT_FACTORIES[type];
        if (!factory) return null;
        const el = factory(overrides);
        state.template.elements.push(el);
        state.selectedIds = [el.id];
        pushHistory();
        return el;
    };

    const updateElement = (id: string, patch: Partial<PrintElement>) => {
        if (state.readonly) return;
        const el = state.template.elements.find((e) => e.id === id);
        if (!el) return;
        Object.assign(el, patch);
    };

    const updateElementStyle = (id: string, stylePatch: Record<string, any>) => {
        if (state.readonly) return;
        const el = state.template.elements.find((e) => e.id === id);
        if (!el) return;
        el.style = { ...(el.style || {}), ...stylePatch };
    };

    const deleteElements = (ids: string[] = state.selectedIds) => {
        if (state.readonly || !ids.length) return;
        state.template.elements = state.template.elements.filter(
            (el) => !ids.includes(el.id),
        );
        state.selectedIds = state.selectedIds.filter((id) => !ids.includes(id));
        pushHistory();
    };

    const duplicateElements = (ids: string[] = state.selectedIds) => {
        if (state.readonly || !ids.length) return;
        const newIds: string[] = [];
        ids.forEach((id) => {
            const el = state.template.elements.find((e) => e.id === id);
            if (!el) return;
            const cloned = JSON.parse(JSON.stringify(el));
            cloned.id = `${el.type}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            cloned.x = (el.x || 0) + 5;
            cloned.y = (el.y || 0) + 5;
            cloned.name = `${el.name}_copy`;
            state.template.elements.push(cloned);
            newIds.push(cloned.id);
        });
        state.selectedIds = newIds;
        pushHistory();
    };

    /** 调整层级 */
    const bringToFront = (ids: string[] = state.selectedIds) => {
        if (state.readonly || !ids.length) return;
        const selected = state.template.elements.filter((el) => ids.includes(el.id));
        const others = state.template.elements.filter((el) => !ids.includes(el.id));
        state.template.elements = [...others, ...selected];
        pushHistory();
    };

    const sendToBack = (ids: string[] = state.selectedIds) => {
        if (state.readonly || !ids.length) return;
        const selected = state.template.elements.filter((el) => ids.includes(el.id));
        const others = state.template.elements.filter((el) => !ids.includes(el.id));
        state.template.elements = [...selected, ...others];
        pushHistory();
    };

    // ==================== 复制粘贴 ====================
    const copyElements = (ids: string[] = state.selectedIds) => {
        if (!ids.length) return;
        state.clipboard = state.template.elements
            .filter((el) => ids.includes(el.id))
            .map((el) => JSON.parse(JSON.stringify(el)));
    };

    const cutElements = (ids: string[] = state.selectedIds) => {
        if (state.readonly) return;
        copyElements(ids);
        deleteElements(ids);
    };

    const pasteElements = () => {
        if (state.readonly || !state.clipboard.length) return;
        const newIds: string[] = [];
        state.clipboard.forEach((el) => {
            const cloned = JSON.parse(JSON.stringify(el));
            cloned.id = `${el.type}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            cloned.x = (el.x || 0) + 5;
            cloned.y = (el.y || 0) + 5;
            state.template.elements.push(cloned);
            newIds.push(cloned.id);
        });
        state.selectedIds = newIds;
        pushHistory();
    };

    // ==================== 历史记录 ====================
    const pushHistory = () => {
        // 截断后续历史
        state.history = state.history.slice(0, state.historyIndex + 1);
        // 推入新状态
        state.history.push(JSON.parse(JSON.stringify(state.template)));
        // 限制长度
        if (state.history.length > MAX_HISTORY_SIZE) {
            state.history.shift();
        } else {
            state.historyIndex++;
        }
    };

    const undo = () => {
        if (state.historyIndex <= 0) return;
        state.historyIndex--;
        state.template = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        state.selectedIds = [];
    };

    const redo = () => {
        if (state.historyIndex >= state.history.length - 1) return;
        state.historyIndex++;
        state.template = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        state.selectedIds = [];
    };

    const canUndo = computed(() => state.historyIndex > 0);
    const canRedo = computed(() => state.historyIndex < state.history.length - 1);

    // ==================== 缩放 ====================
    const setZoom = (zoom: number) => {
        state.zoom = Math.max(0.25, Math.min(4, zoom));
    };

    const zoomIn = () => setZoom(state.zoom + 0.1);
    const zoomOut = () => setZoom(state.zoom - 0.1);
    const zoomReset = () => setZoom(1);

    // ==================== 视图切换 ====================
    const toggleRuler = () => {
        state.showRuler = !state.showRuler;
    };
    const toggleGrid = () => {
        state.showGrid = !state.showGrid;
    };
    const toggleSnap = () => {
        state.snap = !state.snap;
    };

    // ==================== 纸张操作 ====================
    const updatePaper = (paper: Partial<PrintPaper>) => {
        if (state.readonly) return;
        Object.assign(state.template.paper, paper);
        pushHistory();
    };

    // ==================== 模板操作 ====================
    const loadTemplate = (template: PrintTemplate) => {
        state.template = JSON.parse(JSON.stringify(template));
        state.selectedIds = [];
        state.history = [JSON.parse(JSON.stringify(state.template))];
        state.historyIndex = 0;
    };

    const getTemplate = (): PrintTemplate => {
        return JSON.parse(JSON.stringify(state.template));
    };

    const clearTemplate = () => {
        if (state.readonly) return;
        state.template = createInitialTemplate();
        state.selectedIds = [];
        pushHistory();
    };

    // ==================== 吸附辅助 ====================
    const snapValue = (val: number): number => {
        if (!state.snap) return val;
        return Math.round(val / state.snapThreshold) * state.snapThreshold;
    };

    return {
        state,
        // 选中
        selectedElements,
        selectedElement,
        selectElement,
        clearSelection,
        selectAll,
        // 元素
        addElement,
        updateElement,
        updateElementStyle,
        deleteElements,
        duplicateElements,
        bringToFront,
        sendToBack,
        // 复制
        copyElements,
        cutElements,
        pasteElements,
        // 历史
        undo,
        redo,
        canUndo,
        canRedo,
        // 缩放
        setZoom,
        zoomIn,
        zoomOut,
        zoomReset,
        // 视图
        toggleRuler,
        toggleGrid,
        toggleSnap,
        // 纸张
        updatePaper,
        // 模板
        loadTemplate,
        getTemplate,
        clearTemplate,
        pushHistory,
        // 吸附
        snapValue,
    };
}

/** 设计器类型 */
export type UsePrintDesignerReturn = ReturnType<typeof usePrintDesigner>;
