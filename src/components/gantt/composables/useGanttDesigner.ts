/**
 * 甘特图状态管理
 * 单一职责：仅管理状态和操作逻辑，不含 UI 渲染
 */
import { computed, reactive, ref } from "vue";
import { createTask, DEFAULT_GANTT_CONFIG } from "../constants";
import {
    addDays,
    daysBetween,
    parseDate,
} from "../utils/GanttDateUtils";
import type {
    GanttConfig,
    GanttData,
    GanttLink,
    GanttLinkType,
    GanttTask,
} from "../types";

export const useGanttDesigner = (initial?: Partial<GanttData>) => {
    const state = reactive<GanttData>({
        tasks: initial?.tasks ?? [],
        links: initial?.links ?? [],
        config: { ...DEFAULT_GANTT_CONFIG, ...(initial?.config ?? {}) },
        name: initial?.name ?? "",
    });

    const selectedTaskId = ref<string | null>(null);
    const history: GanttData[] = [];
    const historyIndex = ref(-1);

    /** 当前选中的任务 */
    const selectedTask = computed<GanttTask | null>(() => {
        if (!selectedTaskId.value) return null;
        return state.tasks.find((t) => t.id === selectedTaskId.value) ?? null;
    });

    /** 按 order 排序的任务列表 */
    const sortedTasks = computed(() => {
        return [...state.tasks].sort((a, b) => a.order - b.order);
    });

    /** 推入历史记录 */
    const pushHistory = () => {
        if (historyIndex.value < history.length - 1) {
            history.splice(historyIndex.value + 1);
        }
        history.push(JSON.parse(JSON.stringify(state)));
        if (history.length > 50) history.shift();
        historyIndex.value = history.length - 1;
    };

    /** 撤销 */
    const undo = () => {
        if (historyIndex.value <= 0) return;
        historyIndex.value--;
        const snap = history[historyIndex.value];
        Object.assign(state, JSON.parse(JSON.stringify(snap)));
    };

    /** 重做 */
    const redo = () => {
        if (historyIndex.value >= history.length - 1) return;
        historyIndex.value++;
        const snap = history[historyIndex.value];
        Object.assign(state, JSON.parse(JSON.stringify(snap)));
    };

    /** 添加任务 */
    const addTask = (overrides: Partial<GanttTask> = {}): GanttTask => {
        pushHistory();
        const order = state.tasks.length;
        const task = createTask({ ...overrides, order });
        state.tasks.push(task);
        return task;
    };

    /** 添加子任务 */
    const addChildTask = (parentId: string): GanttTask => {
        const parent = state.tasks.find((t) => t.id === parentId);
        if (!parent) return addTask();
        pushHistory();
        const order = state.tasks.length;
        const child = createTask({
            parentId,
            level: parent.level + 1,
            startDate: parent.startDate,
            endDate: parent.endDate,
            order,
        });
        state.tasks.push(child);
        return child;
    };

    /** 更新任务（in-place） */
    const updateTask = (id: string, updates: Partial<GanttTask>) => {
        const task = state.tasks.find((t) => t.id === id);
        if (!task) return;
        pushHistory();
        Object.assign(task, updates);
    };

    /** 删除任务（含子孙） */
    const removeTask = (id: string) => {
        pushHistory();
        const toRemove = new Set<string>([id]);
        let changed = true;
        while (changed) {
            changed = false;
            for (const t of state.tasks) {
                if (t.parentId && toRemove.has(t.parentId) && !toRemove.has(t.id)) {
                    toRemove.add(t.id);
                    changed = true;
                }
            }
        }
        state.tasks = state.tasks.filter((t) => !toRemove.has(t.id));
        state.links = state.links.filter((l) => !toRemove.has(l.source) && !toRemove.has(l.target));
        if (selectedTaskId.value && toRemove.has(selectedTaskId.value)) {
            selectedTaskId.value = null;
        }
    };

    /** 选中任务 */
    const selectTask = (id: string | null) => {
        selectedTaskId.value = id;
    };

    /** 移动任务（拖拽调整日期） */
    const moveTask = (id: string, newStart: string) => {
        const task = state.tasks.find((t) => t.id === id);
        if (!task) return;
        pushHistory();
        const duration = daysBetween(task.startDate, task.endDate) - 1;
        task.startDate = newStart;
        task.endDate = addDays(newStart, duration);
    };

    /** 调整任务时长 */
    const resizeTask = (id: string, newEnd: string) => {
        const task = state.tasks.find((t) => t.id === id);
        if (!task) return;
        const start = parseDate(task.startDate);
        const end = parseDate(newEnd);
        if (end < start) return;
        pushHistory();
        task.endDate = newEnd;
    };

    /** 更新进度 */
    const setProgress = (id: string, progress: number) => {
        const task = state.tasks.find((t) => t.id === id);
        if (!task) return;
        pushHistory();
        task.progress = Math.max(0, Math.min(100, progress));
    };

    /** 添加依赖 */
    const addLink = (source: string, target: string, type: GanttLinkType = "finishToStart"): GanttLink | null => {
        if (source === target) return null;
        const exists = state.links.find(
            (l) => l.source === source && l.target === target && l.type === type,
        );
        if (exists) return null;
        pushHistory();
        const link: GanttLink = {
            id: `link_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            source,
            target,
            type,
            lag: 0,
        };
        state.links.push(link);
        return link;
    };

    /** 删除依赖 */
    const removeLink = (id: string) => {
        pushHistory();
        state.links = state.links.filter((l) => l.id !== id);
    };

    /** 更新配置 */
    const updateConfig = (updates: Partial<GanttConfig>) => {
        Object.assign(state.config, updates);
    };

    /** 加载数据 */
    const loadData = (data: GanttData) => {
        Object.assign(state, JSON.parse(JSON.stringify(data)));
        selectedTaskId.value = null;
        history.length = 0;
        historyIndex.value = -1;
    };

    /** 获取数据快照 */
    const getData = (): GanttData => JSON.parse(JSON.stringify(state));

    return {
        state,
        selectedTaskId,
        selectedTask,
        sortedTasks,
        addTask,
        addChildTask,
        updateTask,
        removeTask,
        selectTask,
        moveTask,
        resizeTask,
        setProgress,
        addLink,
        removeLink,
        updateConfig,
        loadData,
        getData,
        undo,
        redo,
    };
};

export type GanttDesigner = ReturnType<typeof useGanttDesigner>;
