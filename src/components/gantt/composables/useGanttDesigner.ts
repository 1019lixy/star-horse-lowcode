/**
 * 甘特图状态管理
 * 单一职责：仅管理状态和操作逻辑，不含 UI 渲染
 */
import { computed, reactive, ref } from "vue";
import { createTask, DEFAULT_GANTT_CONFIG } from "../constants";
import { addDays, daysBetween, parseDate } from "../utils/GanttDateUtils";
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

  /** 在指定任务前插入同级任务 */
  const insertBefore = (
    targetId: string,
    overrides: Partial<GanttTask> = {},
  ): GanttTask | null => {
    const target = state.tasks.find((t) => t.id === targetId);
    if (!target) return null;
    pushHistory();
    const siblings = state.tasks.filter(
      (t) => t.parentId === target.parentId && t.order >= target.order,
    );
    for (const s of siblings) s.order += 1;
    const task = createTask({
      ...overrides,
      parentId: target.parentId,
      level: target.level,
      order: target.order,
    });
    state.tasks.push(task);
    return task;
  };

  /** 在指定任务后插入同级任务 */
  const insertAfter = (
    targetId: string,
    overrides: Partial<GanttTask> = {},
  ): GanttTask | null => {
    const target = state.tasks.find((t) => t.id === targetId);
    if (!target) return null;
    pushHistory();
    const siblings = state.tasks.filter(
      (t) => t.parentId === target.parentId && t.order > target.order,
    );
    for (const s of siblings) s.order += 1;
    const task = createTask({
      ...overrides,
      parentId: target.parentId,
      level: target.level,
      order: target.order + 1,
    });
    state.tasks.push(task);
    return task;
  };

  /** 上移任务（与上一个同级兄弟交换 order） */
  const moveUp = (id: string) => {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;
    const siblings = state.tasks
      .filter((t) => t.parentId === task.parentId)
      .sort((a, b) => a.order - b.order);
    const idx = siblings.findIndex((s) => s.id === id);
    if (idx <= 0) return;
    pushHistory();
    const prev = siblings[idx - 1];
    const tempOrder = task.order;
    task.order = prev.order;
    prev.order = tempOrder;
  };

  /** 下移任务 */
  const moveDown = (id: string) => {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;
    const siblings = state.tasks
      .filter((t) => t.parentId === task.parentId)
      .sort((a, b) => a.order - b.order);
    const idx = siblings.findIndex((s) => s.id === id);
    if (idx < 0 || idx >= siblings.length - 1) return;
    pushHistory();
    const next = siblings[idx + 1];
    const tempOrder = task.order;
    task.order = next.order;
    next.order = tempOrder;
  };

  /** 置顶 */
  const moveToTop = (id: string) => {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;
    const siblings = state.tasks
      .filter((t) => t.parentId === task.parentId && t.order < task.order)
      .sort((a, b) => a.order - b.order);
    if (siblings.length === 0) return;
    pushHistory();
    for (const s of siblings) s.order += 1;
    task.order = siblings[0].order;
  };

  /** 置底 */
  const moveToBottom = (id: string) => {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;
    const siblings = state.tasks
      .filter((t) => t.parentId === task.parentId && t.order > task.order)
      .sort((a, b) => a.order - b.order);
    if (siblings.length === 0) return;
    pushHistory();
    for (const s of siblings) s.order -= 1;
    task.order = siblings[siblings.length - 1].order;
  };

  /** 缩进（变为上一个兄弟的子任务） */
  const indent = (id: string) => {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;
    const siblings = state.tasks
      .filter((t) => t.parentId === task.parentId)
      .sort((a, b) => a.order - b.order);
    const idx = siblings.findIndex((s) => s.id === id);
    if (idx <= 0) return;
    const prevSibling = siblings[idx - 1];
    pushHistory();
    task.parentId = prevSibling.id;
    task.level = prevSibling.level + 1;
    const children = state.tasks.filter((t) => t.parentId === prevSibling.id);
    task.order =
      children.length > 0 ? Math.max(...children.map((c) => c.order)) + 1 : 0;
  };

  /** 反缩进（变为父级兄弟） */
  const outdent = (id: string) => {
    const task = state.tasks.find((t) => t.id === id);
    if (!task || !task.parentId) return;
    const parent = state.tasks.find((t) => t.id === task.parentId);
    if (!parent) return;
    if (!parent.parentId && parent.level === 0) {
      pushHistory();
      task.parentId = undefined;
      task.level = 0;
      task.order =
        Math.max(
          ...state.tasks.filter((t) => !t.parentId).map((t) => t.order),
        ) + 1;
      return;
    }
    pushHistory();
    task.parentId = parent.parentId;
    task.level = parent.level;
    task.order = parent.order + 1;
    const siblings = state.tasks.filter(
      (t) =>
        t.parentId === task.parentId &&
        t.order >= task.order &&
        t.id !== task.id,
    );
    for (const s of siblings) s.order += 1;
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
    state.links = state.links.filter(
      (l) => !toRemove.has(l.source) && !toRemove.has(l.target),
    );
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
  const addLink = (
    source: string,
    target: string,
    type: GanttLinkType = "finishToStart",
  ): GanttLink | null => {
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
    insertBefore,
    insertAfter,
    moveUp,
    moveDown,
    moveToTop,
    moveToBottom,
    indent,
    outdent,
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
