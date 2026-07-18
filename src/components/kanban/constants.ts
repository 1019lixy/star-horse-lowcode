/**
 * 看板常量定义
 */
import { i18n } from "@/lang";
import type { KanbanCard, KanbanColumn, KanbanConfig, KanbanPriorityPreset } from "./types";

/** 默认看板列 */
export const DEFAULT_KANBAN_COLUMNS: KanbanColumn[] = [
    {
        id: "col_todo",
        name: i18n("kanban.column.todo"),
        color: "#909399",
        order: 0,
        wipLimit: { enabled: false, max: 10, strategy: "warn" },
        removable: true,
    },
    {
        id: "col_doing",
        name: i18n("kanban.column.doing"),
        color: "#409EFF",
        order: 1,
        wipLimit: { enabled: true, max: 5, strategy: "warn" },
        removable: true,
    },
    {
        id: "col_testing",
        name: i18n("kanban.column.testing"),
        color: "#E6A23C",
        order: 2,
        wipLimit: { enabled: false, max: 5, strategy: "warn" },
        removable: true,
    },
    {
        id: "col_done",
        name: i18n("kanban.column.done"),
        color: "#67C23A",
        order: 3,
        isDone: true,
        removable: false,
    },
];

/** 优先级预设 */
export const KANBAN_PRIORITY_PRESETS: KanbanPriorityPreset[] = [
    { value: "low", label: i18n("kanban.priority.low"), color: "#909399" },
    { value: "medium", label: i18n("kanban.priority.medium"), color: "#409EFF" },
    { value: "high", label: i18n("kanban.priority.high"), color: "#E6A23C" },
    { value: "urgent", label: i18n("kanban.priority.urgent"), color: "#F56C6C" },
];

/** 默认配置 */
export const DEFAULT_KANBAN_CONFIG: KanbanConfig = {
    cardStyle: "default",
    showAvatar: true,
    showLabels: true,
    showPriority: true,
    showDueDate: true,
    showEstimate: false,
    draggable: true,
    columnWidth: 280,
};

/** 创建新卡片 */
export const createCard = (overrides: Partial<KanbanCard> = {}): KanbanCard => ({
    id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: i18n("kanban.card.newCard"),
    description: "",
    columnId: "col_todo",
    order: 0,
    priority: "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
});

/** 创建新列 */
export const createColumn = (overrides: Partial<KanbanColumn> = {}): KanbanColumn => ({
    id: `col_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: i18n("kanban.column.newColumn"),
    color: "#909399",
    order: 0,
    wipLimit: { enabled: false, max: 5, strategy: "warn" },
    removable: true,
    ...overrides,
});
