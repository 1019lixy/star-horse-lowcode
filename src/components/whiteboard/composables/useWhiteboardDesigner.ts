/**
 * 白板组件 - 状态管理
 *
 * 管理 elements / 当前工具 / 颜色 / 线宽 / 透明度 / 选择 / 历史栈
 */

import { computed, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { i18n } from "@/lang";
import {
    WB_DEFAULT_CANVAS,
    WB_DEFAULT_FILL,
    WB_DEFAULT_FONT_SIZE,
    WB_DEFAULT_OPACITY,
    WB_DEFAULT_STROKE,
    WB_DEFAULT_STROKE_WIDTH,
    WB_MAX_HISTORY,
    createWbInitialState,
    wbGenId,
} from "../constants";
import type {
    WbCanvasConfig,
    WhiteboardElement,
    WhiteboardState,
    WhiteboardTool,
} from "../types";
import { useWhiteboardHistory } from "./useWhiteboardHistory";

const snapshotElements = (state: WhiteboardState): WhiteboardElement[] =>
    JSON.parse(JSON.stringify(state.elements));

export function useWhiteboardDesigner(initial?: Partial<WhiteboardState>) {
    const state = reactive<WhiteboardState>(createWbInitialState(initial?.elements));

    // 应用初始覆盖
    if (initial) {
        Object.assign(state, {
            tool: initial.tool ?? state.tool,
            stroke: initial.stroke ?? state.stroke,
            fill: initial.fill ?? state.fill,
            strokeWidth: initial.strokeWidth ?? state.strokeWidth,
            opacity: initial.opacity ?? state.opacity,
            fontSize: initial.fontSize ?? state.fontSize,
            readonly: initial.readonly ?? state.readonly,
        });
        if (initial.canvas) {
            Object.assign(state.canvas, initial.canvas);
        }
    }

    /** 元素快照历史（只跟踪 elements） */
    const history = useWhiteboardHistory<WhiteboardElement[]>(
        snapshotElements(state),
        WB_MAX_HISTORY,
    );

    /** 临时绘制中的元素（用于实时预览，不入栈） */
    const drafting = ref<WhiteboardElement | null>(null);

    /** 选中的元素列表 */
    const selectedElements = computed<WhiteboardElement[]>(() =>
        state.elements.filter((e) => state.selectedIds.includes(e.id)),
    );

    /** 选中的单个元素（仅一个选中时） */
    const selectedElement = computed<WhiteboardElement | null>(() =>
        selectedElements.value.length === 1 ? selectedElements.value[0] : null,
    );

    /** 元素数量 */
    const elementCount = computed(() => state.elements.length);

    /** 倒序元素列表（z-order 高的在前，用于图层显示） */
    const reversedElements = computed<WhiteboardElement[]>(() =>
        [...state.elements].reverse(),
    );

    /** 生成工具栏样式状态 */
    const tool = computed<WhiteboardTool>(() => state.tool);
    const canvas = computed<WbCanvasConfig>(() => state.canvas);

    // ============== 工具切换 ==============
    const setTool = (t: WhiteboardTool) => {
        state.tool = t;
        if (t !== "select") clearSelection();
    };

    // ============== 样式配置 ==============
    const setStroke = (color: string) => {
        state.stroke = color;
    };
    const setFill = (color: string) => {
        state.fill = color;
    };
    const setStrokeWidth = (w: number) => {
        state.strokeWidth = w;
    };
    const setOpacity = (o: number) => {
        state.opacity = o;
    };
    const setFontSize = (s: number) => {
        state.fontSize = s;
    };

    // ============== 选择 ==============
    const selectElement = (id: string, multi = false) => {
        if (multi) {
            const idx = state.selectedIds.indexOf(id);
            if (idx >= 0) state.selectedIds.splice(idx, 1);
            else state.selectedIds.push(id);
        } else {
            state.selectedIds = [id];
        }
    };

    const selectMany = (ids: string[]) => {
        state.selectedIds = [...ids];
    };

    const clearSelection = () => {
        state.selectedIds = [];
    };

    const isSelected = (id: string): boolean => state.selectedIds.includes(id);

    // ============== 元素增删改 ==============
    /** 添加元素（自动选中并推入历史） */
    const addElement = (el: WhiteboardElement, pushHist = true) => {
        state.elements.push(el);
        state.selectedIds = [el.id];
        if (pushHist) history.push(snapshotElements(state));
    };

    /** 仅设置 drafting（用于绘制中预览，不入栈） */
    const setDrafting = (el: WhiteboardElement | null) => {
        drafting.value = el;
    };

    /** 完成 drafting：从 drafting 提交为正式元素 */
    const commitDrafting = () => {
        if (drafting.value) {
            const el = drafting.value;
            drafting.value = null;
            state.elements.push(el);
            state.selectedIds = [el.id];
            history.push(snapshotElements(state));
        }
    };

    /** 取消 drafting */
    const cancelDrafting = () => {
        drafting.value = null;
    };

    /** 更新元素属性 */
    const updateElement = (id: string, patch: Partial<WhiteboardElement>) => {
        const el = state.elements.find((e) => e.id === id);
        if (!el) return;
        Object.assign(el, patch);
    };

    /** 移动元素 */
    const moveElement = (id: string, dx: number, dy: number) => {
        const el = state.elements.find((e) => e.id === id);
        if (!el) return;
        switch (el.type) {
            case "pen":
                (el as any).points = (el as any).points.map((p: any) => ({ x: p.x + dx, y: p.y + dy }));
                break;
            case "shape":
            case "text":
                (el as any).x += dx;
                (el as any).y += dy;
                break;
            case "line":
                (el as any).x1 += dx;
                (el as any).y1 += dy;
                (el as any).x2 += dx;
                (el as any).y2 += dy;
                break;
        }
    };

    /** 删除选中元素 */
    const deleteElements = (ids: string[] = state.selectedIds) => {
        if (ids.length === 0) return;
        state.elements = state.elements.filter((e) => !ids.includes(e.id));
        state.selectedIds = state.selectedIds.filter((id) => !ids.includes(id));
        history.push(snapshotElements(state));
        ElMessage.success(i18n("whiteboard.message.deleted"));
    };

    /** 复制选中元素 */
    const duplicateElement = (id: string) => {
        const el = state.elements.find((e) => e.id === id);
        if (!el) return;
        const cloned = JSON.parse(JSON.stringify(el)) as WhiteboardElement;
        (cloned as any).id = wbGenId((cloned as any).type);
        // 偏移 20px 避免重叠
        const offset = 20;
        if (cloned.type === "pen") {
            (cloned as any).points = (cloned as any).points.map((p: any) => ({
                x: p.x + offset,
                y: p.y + offset,
            }));
        } else if (cloned.type === "line") {
            (cloned as any).x1 += offset;
            (cloned as any).y1 += offset;
            (cloned as any).x2 += offset;
            (cloned as any).y2 += offset;
        } else {
            (cloned as any).x += offset;
            (cloned as any).y += offset;
        }
        state.elements.push(cloned);
        state.selectedIds = [cloned.id];
        history.push(snapshotElements(state));
        ElMessage.success(i18n("whiteboard.message.duplicated"));
    };

    // ============== 图层（z-order） ==============
    /** 置顶 */
    const bringToFront = (id: string) => {
        const idx = state.elements.findIndex((e) => e.id === id);
        if (idx < 0 || idx === state.elements.length - 1) return;
        const [el] = state.elements.splice(idx, 1);
        state.elements.push(el);
        history.push(snapshotElements(state));
    };

    /** 上移一层 */
    const bringForward = (id: string) => {
        const idx = state.elements.findIndex((e) => e.id === id);
        if (idx < 0 || idx === state.elements.length - 1) return;
        const [el] = state.elements.splice(idx, 1);
        state.elements.splice(idx + 1, 0, el);
        history.push(snapshotElements(state));
    };

    /** 下移一层 */
    const sendBackward = (id: string) => {
        const idx = state.elements.findIndex((e) => e.id === id);
        if (idx <= 0) return;
        const [el] = state.elements.splice(idx, 1);
        state.elements.splice(idx - 1, 0, el);
        history.push(snapshotElements(state));
    };

    /** 置底 */
    const sendToBack = (id: string) => {
        const idx = state.elements.findIndex((e) => e.id === id);
        if (idx <= 0) return;
        const [el] = state.elements.splice(idx, 1);
        state.elements.unshift(el);
        history.push(snapshotElements(state));
    };

    /** 切换可见 */
    const toggleVisible = (id: string) => {
        const el = state.elements.find((e) => e.id === id);
        if (!el) return;
        el.visible = el.visible === false ? true : false;
    };

    // ============== 撤销/重做 ==============
    const undo = () => {
        const prev = history.undo();
        if (prev) {
            state.elements = JSON.parse(JSON.stringify(prev));
            clearSelection();
            ElMessage.success(i18n("whiteboard.message.undone"));
        }
    };

    const redo = () => {
        const next = history.redo();
        if (next) {
            state.elements = JSON.parse(JSON.stringify(next));
            clearSelection();
            ElMessage.success(i18n("whiteboard.message.redone"));
        }
    };

    const canUndo = computed(() => history.canUndo.value);
    const canRedo = computed(() => history.canRedo.value);

    /** 推入历史（手动调用，如拖拽完成后） */
    const pushHistory = () => {
        history.push(snapshotElements(state));
    };

    // ============== 画布 ==============
    const setZoom = (zoom: number) => {
        state.canvas.zoom = Math.max(0.2, Math.min(4, zoom));
    };
    const zoomIn = () => setZoom(state.canvas.zoom + 0.1);
    const zoomOut = () => setZoom(state.canvas.zoom - 0.1);
    const zoomReset = () => {
        setZoom(1);
        state.canvas.panX = 0;
        state.canvas.panY = 0;
    };
    const setPan = (x: number, y: number) => {
        state.canvas.panX = x;
        state.canvas.panY = y;
    };
    const toggleGrid = () => {
        state.canvas.showGrid = !state.canvas.showGrid;
    };

    // ============== 全局操作 ==============
    /** 清空画板 */
    const clearBoard = async () => {
        try {
            await ElMessageBox.confirm(i18n("whiteboard.message.confirmClear"), i18n("whiteboard.clear"), {
                type: "warning",
            });
        } catch {
            return;
        }
        state.elements = [];
        state.selectedIds = [];
        history.push(snapshotElements(state));
        ElMessage.success(i18n("whiteboard.message.cleared"));
    };

    /** 加载元素列表（替换全部） */
    const loadElements = (elements: WhiteboardElement[]) => {
        state.elements = JSON.parse(JSON.stringify(elements));
        state.selectedIds = [];
        history.reset(snapshotElements(state));
    };

    /** 获取元素列表（深拷贝） */
    const getElements = (): WhiteboardElement[] => JSON.parse(JSON.stringify(state.elements));

    /** 重置为默认 */
    const resetAll = () => {
        state.elements = [];
        state.selectedIds = [];
        state.tool = "select";
        state.stroke = WB_DEFAULT_STROKE;
        state.fill = WB_DEFAULT_FILL;
        state.strokeWidth = WB_DEFAULT_STROKE_WIDTH;
        state.opacity = WB_DEFAULT_OPACITY;
        state.fontSize = WB_DEFAULT_FONT_SIZE;
        state.canvas = { ...WB_DEFAULT_CANVAS };
        history.reset([]);
    };

    return {
        state,
        drafting,
        tool,
        canvas,
        selectedElements,
        selectedElement,
        elementCount,
        reversedElements,
        canUndo,
        canRedo,
        // 工具
        setTool,
        // 样式
        setStroke,
        setFill,
        setStrokeWidth,
        setOpacity,
        setFontSize,
        // 选择
        selectElement,
        selectMany,
        clearSelection,
        isSelected,
        // 元素
        addElement,
        updateElement,
        moveElement,
        deleteElements,
        duplicateElement,
        setDrafting,
        commitDrafting,
        cancelDrafting,
        // 图层
        bringToFront,
        bringForward,
        sendBackward,
        sendToBack,
        toggleVisible,
        // 历史
        undo,
        redo,
        pushHistory,
        // 画布
        setZoom,
        zoomIn,
        zoomOut,
        zoomReset,
        setPan,
        toggleGrid,
        // 全局
        clearBoard,
        loadElements,
        getElements,
        resetAll,
    };
}

export type UseWhiteboardDesignerReturn = ReturnType<typeof useWhiteboardDesigner>;
