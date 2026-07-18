/**
 * 调度视图状态管理
 */
import { computed, reactive, ref } from "vue";
import {
    createEvent,
    createResource,
    DEFAULT_SCHEDULE_CONFIG,
} from "../constants";
import {
    isTimeOverlap,
    parseTime,
} from "../utils/ScheduleDateUtils";
import type {
    ScheduleConfig,
    ScheduleData,
    ScheduleEvent,
    ScheduleResource,
    ScheduleViewMode,
} from "../types";

export const useScheduleDesigner = (initial?: Partial<ScheduleData>) => {
    const state = reactive<ScheduleData>({
        events: initial?.events ?? [],
        resources: initial?.resources ?? [],
        config: { ...DEFAULT_SCHEDULE_CONFIG, ...(initial?.config ?? {}) },
        name: initial?.name ?? "",
    });

    const selectedEventId = ref<string | null>(null);
    /** 视图锚点日期 */
    const anchorDate = ref(new Date());
    const history: ScheduleData[] = [];
    const historyIndex = ref(-1);

    const selectedEvent = computed<ScheduleEvent | null>(() => {
        if (!selectedEventId.value) return null;
        return state.events.find((e) => e.id === selectedEventId.value) ?? null;
    });

    const sortedResources = computed(() =>
        [...state.resources].sort((a, b) => a.order - b.order),
    );

    const pushHistory = () => {
        if (historyIndex.value < history.length - 1) {
            history.splice(historyIndex.value + 1);
        }
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

    /** 检查事件时间冲突 */
    const checkConflict = (event: ScheduleEvent, excludeId?: string): ScheduleEvent | null => {
        if (state.config.allowOverlap) return null;
        const start = parseTime(event.startTime);
        const end = parseTime(event.endTime);
        for (const e of state.events) {
            if (e.id === excludeId || e.id === event.id) continue;
            if (e.resourceId !== event.resourceId) continue;
            const es = parseTime(e.startTime);
            const ee = parseTime(e.endTime);
            if (isTimeOverlap(start, end, es, ee)) return e;
        }
        return null;
    };

    /** 添加事件 */
    const addEvent = (overrides: Partial<ScheduleEvent> = {}): ScheduleEvent | null => {
        const event = createEvent(overrides);
        const conflict = checkConflict(event);
        if (conflict) return null;
        pushHistory();
        state.events.push(event);
        return event;
    };

    /** 更新事件 */
    const updateEvent = (id: string, updates: Partial<ScheduleEvent>) => {
        const event = state.events.find((e) => e.id === id);
        if (!event) return;
        const merged = { ...event, ...updates };
        const conflict = checkConflict(merged, id);
        if (conflict) return;
        pushHistory();
        Object.assign(event, updates);
    };

    /** 删除事件 */
    const removeEvent = (id: string) => {
        pushHistory();
        state.events = state.events.filter((e) => e.id !== id);
        if (selectedEventId.value === id) selectedEventId.value = null;
    };

    /** 移动事件 */
    const moveEvent = (id: string, newStart: string, newResourceId?: string) => {
        const event = state.events.find((e) => e.id === id);
        if (!event) return;
        const originalStart = parseTime(event.startTime);
        const originalEnd = parseTime(event.endTime);
        const newStartDate = parseTime(newStart);
        const durationMs = originalEnd.getTime() - originalStart.getTime();
        const newEndDate = new Date(newStartDate.getTime() + durationMs);

        const merged: ScheduleEvent = {
            ...event,
            startTime: newStart,
            endTime: newEndDate.toISOString(),
            resourceId: newResourceId ?? event.resourceId,
        };
        const conflict = checkConflict(merged, id);
        if (conflict) return;
        pushHistory();
        event.startTime = merged.startTime;
        event.endTime = merged.endTime;
        if (newResourceId) event.resourceId = newResourceId;
    };

    /** 调整事件时长 */
    const resizeEvent = (id: string, newEnd: string) => {
        const event = state.events.find((e) => e.id === id);
        if (!event) return;
        const start = parseTime(event.startTime);
        const end = parseTime(newEnd);
        if (end <= start) return;
        const merged: ScheduleEvent = { ...event, endTime: newEnd };
        const conflict = checkConflict(merged, id);
        if (conflict) return;
        pushHistory();
        event.endTime = newEnd;
    };

    /** 选中事件 */
    const selectEvent = (id: string | null) => {
        selectedEventId.value = id;
    };

    /** 添加资源 */
    const addResource = (overrides: Partial<ScheduleResource> = {}): ScheduleResource => {
        pushHistory();
        const order = state.resources.length;
        const resource = createResource({ ...overrides, order });
        state.resources.push(resource);
        return resource;
    };

    /** 更新资源 */
    const updateResource = (id: string, updates: Partial<ScheduleResource>) => {
        const r = state.resources.find((res) => res.id === id);
        if (!r) return;
        pushHistory();
        Object.assign(r, updates);
    };

    /** 删除资源（连同事件） */
    const removeResource = (id: string) => {
        pushHistory();
        state.events = state.events.filter((e) => e.resourceId !== id);
        state.resources = state.resources.filter((r) => r.id !== id);
    };

    /** 更新配置 */
    const updateConfig = (updates: Partial<ScheduleConfig>) => {
        Object.assign(state.config, updates);
    };

    /** 切换视图模式 */
    const setViewMode = (mode: ScheduleViewMode) => {
        state.config.viewMode = mode;
    };

    /** 锚点日期跳转 */
    const setAnchorDate = (date: Date) => {
        anchorDate.value = date;
    };

    /** 加载数据 */
    const loadData = (data: ScheduleData) => {
        Object.assign(state, JSON.parse(JSON.stringify(data)));
        selectedEventId.value = null;
        history.length = 0;
        historyIndex.value = -1;
    };

    const getData = (): ScheduleData => JSON.parse(JSON.stringify(state));

    return {
        state,
        selectedEventId,
        selectedEvent,
        sortedResources,
        anchorDate,
        checkConflict,
        addEvent,
        updateEvent,
        removeEvent,
        moveEvent,
        resizeEvent,
        selectEvent,
        addResource,
        updateResource,
        removeResource,
        updateConfig,
        setViewMode,
        setAnchorDate,
        loadData,
        getData,
        undo,
        redo,
    };
};

export type ScheduleDesigner = ReturnType<typeof useScheduleDesigner>;
