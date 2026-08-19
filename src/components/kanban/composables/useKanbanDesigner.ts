/**
 * 看板状态管理
 * 单一职责：状态管理 + 操作逻辑
 */
import { computed, reactive, ref } from "vue";
import {
  createCard,
  createColumn,
  DEFAULT_KANBAN_COLUMNS,
  DEFAULT_KANBAN_CONFIG,
} from "../constants";
import type {
  KanbanCard,
  KanbanColumn,
  KanbanConfig,
  KanbanData,
} from "../types";

export const useKanbanDesigner = (initial?: Partial<KanbanData>) => {
  const state = reactive<KanbanData>({
    columns: initial?.columns ?? [...DEFAULT_KANBAN_COLUMNS],
    cards: initial?.cards ?? [],
    config: { ...DEFAULT_KANBAN_CONFIG, ...(initial?.config ?? {}) },
    name: initial?.name ?? "",
  });

  const selectedCardId = ref<string | null>(null);
  const history: KanbanData[] = [];
  const historyIndex = ref(-1);

  /** 选中卡片 */
  const selectedCard = computed<KanbanCard | null>(() => {
    if (!selectedCardId.value) return null;
    return state.cards.find((c) => c.id === selectedCardId.value) ?? null;
  });

  /** 排序后的列 */
  const sortedColumns = computed(() =>
    [...state.columns].sort((a, b) => a.order - b.order),
  );

  /** 推入历史 */
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
    Object.assign(
      state,
      JSON.parse(JSON.stringify(history[historyIndex.value])),
    );
  };

  const redo = () => {
    if (historyIndex.value >= history.length - 1) return;
    historyIndex.value++;
    Object.assign(
      state,
      JSON.parse(JSON.stringify(history[historyIndex.value])),
    );
  };

  /** 获取列内卡片（已排序） */
  const getCardsByColumn = (columnId: string): KanbanCard[] => {
    return state.cards
      .filter((c) => c.columnId === columnId)
      .sort((a, b) => a.order - b.order);
  };

  /** 检查 WIP 限制 */
  const checkWipLimit = (
    columnId: string,
  ): { exceeded: boolean; max: number; current: number } => {
    const col = state.columns.find((c) => c.id === columnId);
    if (!col?.wipLimit?.enabled) return { exceeded: false, max: 0, current: 0 };
    const current = state.cards.filter((c) => c.columnId === columnId).length;
    return {
      exceeded: current >= col.wipLimit.max,
      max: col.wipLimit.max,
      current,
    };
  };

  /** 添加卡片 */
  const addCard = (
    columnId: string,
    overrides: Partial<KanbanCard> = {},
  ): KanbanCard => {
    pushHistory();
    const order = state.cards.filter((c) => c.columnId === columnId).length;
    const card = createCard({ ...overrides, columnId, order });
    state.cards.push(card);
    return card;
  };

  /** 更新卡片 */
  const updateCard = (id: string, updates: Partial<KanbanCard>) => {
    const card = state.cards.find((c) => c.id === id);
    if (!card) return;
    pushHistory();
    Object.assign(card, updates, { updatedAt: new Date().toISOString() });
  };

  /** 删除卡片 */
  const removeCard = (id: string) => {
    pushHistory();
    state.cards = state.cards.filter((c) => c.id !== id);
    if (selectedCardId.value === id) selectedCardId.value = null;
  };

  /** 移动卡片到列 */
  const moveCard = (
    cardId: string,
    targetColumnId: string,
    targetIndex: number,
  ) => {
    const card = state.cards.find((c) => c.id === cardId);
    if (!card) return;
    const targetCol = state.columns.find((c) => c.id === targetColumnId);
    if (!targetCol) return;
    // WIP 限制
    if (
      targetCol.wipLimit?.enabled &&
      targetCol.wipLimit.strategy === "block"
    ) {
      const current = state.cards.filter(
        (c) => c.columnId === targetColumnId,
      ).length;
      if (card.columnId !== targetColumnId && current >= targetCol.wipLimit.max)
        return;
    }
    pushHistory();
    // 移出原列后重排
    const oldColumnId = card.columnId;
    if (oldColumnId === targetColumnId) {
      // 同列内重排
      const siblings = state.cards
        .filter((c) => c.columnId === targetColumnId && c.id !== cardId)
        .sort((a, b) => a.order - b.order);
      siblings.splice(targetIndex, 0, card);
      siblings.forEach((c, idx) => {
        const target = state.cards.find((cc) => cc.id === c.id);
        if (target) target.order = idx;
      });
    } else {
      // 跨列移动
      card.columnId = targetColumnId;
      if (targetCol.isDone) {
        card.completedDate = new Date().toISOString().slice(0, 10);
      }
      // 重排目标列
      const targetSiblings = state.cards
        .filter((c) => c.columnId === targetColumnId && c.id !== cardId)
        .sort((a, b) => a.order - b.order);
      targetSiblings.splice(targetIndex, 0, card);
      targetSiblings.forEach((c, idx) => {
        const target = state.cards.find((cc) => cc.id === c.id);
        if (target) target.order = idx;
      });
      // 重排原列
      const oldSiblings = state.cards
        .filter((c) => c.columnId === oldColumnId)
        .sort((a, b) => a.order - b.order);
      oldSiblings.forEach((c, idx) => {
        const target = state.cards.find((cc) => cc.id === c.id);
        if (target) target.order = idx;
      });
    }
  };

  /** 选中卡片 */
  const selectCard = (id: string | null) => {
    selectedCardId.value = id;
  };

  /** 添加列 */
  const addColumn = (overrides: Partial<KanbanColumn> = {}): KanbanColumn => {
    pushHistory();
    const order = state.columns.length;
    const col = createColumn({ ...overrides, order });
    state.columns.push(col);
    return col;
  };

  /** 更新列 */
  const updateColumn = (id: string, updates: Partial<KanbanColumn>) => {
    const col = state.columns.find((c) => c.id === id);
    if (!col) return;
    pushHistory();
    Object.assign(col, updates);
  };

  /** 删除列（连同卡片） */
  const removeColumn = (id: string) => {
    const col = state.columns.find((c) => c.id === id);
    if (!col || !col.removable) return;
    pushHistory();
    state.cards = state.cards.filter((c) => c.columnId !== id);
    state.columns = state.columns.filter((c) => c.id !== id);
  };

  /** 移动列 */
  const moveColumn = (columnId: string, targetIndex: number) => {
    pushHistory();
    const sorted = [...state.columns].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((c) => c.id === columnId);
    if (idx < 0 || idx === targetIndex) return;
    const [moved] = sorted.splice(idx, 1);
    sorted.splice(targetIndex, 0, moved);
    sorted.forEach((c, i) => {
      const target = state.columns.find((cc) => cc.id === c.id);
      if (target) target.order = i;
    });
  };

  /** 更新配置 */
  const updateConfig = (updates: Partial<KanbanConfig>) => {
    Object.assign(state.config, updates);
  };

  /** 加载数据 */
  const loadData = (data: KanbanData) => {
    Object.assign(state, JSON.parse(JSON.stringify(data)));
    selectedCardId.value = null;
    history.length = 0;
    historyIndex.value = -1;
  };

  /** 获取数据 */
  const getData = (): KanbanData => JSON.parse(JSON.stringify(state));

  return {
    state,
    selectedCardId,
    selectedCard,
    sortedColumns,
    getCardsByColumn,
    checkWipLimit,
    addCard,
    updateCard,
    removeCard,
    moveCard,
    selectCard,
    addColumn,
    updateColumn,
    removeColumn,
    moveColumn,
    updateConfig,
    loadData,
    getData,
    undo,
    redo,
  };
};

export type KanbanDesigner = ReturnType<typeof useKanbanDesigner>;
