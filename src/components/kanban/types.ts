/**
 * 看板类型定义
 * 单一职责：仅定义类型
 */

/** 卡片优先级 */
export type KanbanCardPriority = "low" | "medium" | "high" | "urgent";

/** 卡片标签 */
export interface KanbanCardLabel {
    text: string;
    color?: string;
}

/** 看板卡片 */
export interface KanbanCard {
    id: string;
    /** 卡片标题 */
    title: string;
    /** 描述 */
    description?: string;
    /** 所属列ID */
    columnId: string;
    /** 排序序号 */
    order: number;
    /** 标签列表 */
    labels?: KanbanCardLabel[];
    /** 负责人 */
    assignee?: string;
    /** 头像URL */
    avatar?: string;
    /** 优先级 */
    priority: KanbanCardPriority;
    /** 截止日期 */
    dueDate?: string;
    /** 估算工时 */
    estimate?: number;
    /** 完成日期 */
    completedDate?: string;
    /** 自定义字段 */
    customFields?: Record<string, any>;
    /** 创建时间 */
    createdAt?: string;
    /** 更新时间 */
    updatedAt?: string;
}

/** WIP 限制策略 */
export interface KanbanWipLimit {
    /** 启用 */
    enabled: boolean;
    /** 最大卡片数 */
    max: number;
    /** 超出策略：block / warn */
    strategy: "block" | "warn";
}

/** 看板列 */
export interface KanbanColumn {
    id: string;
    /** 列名称 */
    name: string;
    /** 颜色 */
    color?: string;
    /** 排序序号 */
    order: number;
    /** WIP 限制 */
    wipLimit?: KanbanWipLimit;
    /** 是否为完成列 */
    isDone?: boolean;
    /** 是否可删除 */
    removable?: boolean;
}

/** 看板配置 */
export interface KanbanConfig {
    /** 卡片样式 */
    cardStyle?: "compact" | "default" | "detailed";
    /** 是否显示头像 */
    showAvatar: boolean;
    /** 是否显示标签 */
    showLabels: boolean;
    /** 是否显示优先级 */
    showPriority: boolean;
    /** 是否显示截止日期 */
    showDueDate: boolean;
    /** 是否显示工时 */
    showEstimate: boolean;
    /** 是否启用拖拽 */
    draggable: boolean;
    /** 列宽 */
    columnWidth: number;
}

/** 看板数据 */
export interface KanbanData {
    /** 列 */
    columns: KanbanColumn[];
    /** 卡片 */
    cards: KanbanCard[];
    /** 配置 */
    config: KanbanConfig;
    /** 看板名称 */
    name: string;
}

/** 优先级预设 */
export interface KanbanPriorityPreset {
    value: KanbanCardPriority;
    label: string;
    color: string;
}
