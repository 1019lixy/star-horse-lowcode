/**
 * 协同富文本类型定义
 */

/** 协同用户 */
export interface CollabUser {
    id: string;
    name: string;
    avatar?: string;
    color: string;
    cursor?: {
        line: number;
        column: number;
    };
    selection?: {
        start: number;
        end: number;
    };
}

/** 协同操作类型 */
export type CollabOperationType =
    | "insert"
    | "delete"
    | "format"
    | "cursor"
    | "selection";

/** 协同操作 */
export interface CollabOperation {
    type: CollabOperationType;
    userId: string;
    timestamp: number;
    position?: number;
    content?: string;
    format?: {
        type: string;
        value?: any;
    };
}

/** 富文本配置 */
export interface RichTextConfig {
    /** 占位提示 */
    placeholder: string;
    /** 是否只读 */
    readonly: boolean;
    /** 是否显示工具栏 */
    showToolbar: boolean;
    /** 工具栏模式 */
    toolbarMode: "default" | "simple" | "full";
    /** 是否启用协同 */
    enableCollaboration: boolean;
    /** 是否启用 @ 提及 */
    enableMention: boolean;
    /** 字数限制 */
    maxLength?: number;
}

/** 富文本数据 */
export interface RichTextData {
    /** HTML 内容 */
    html: string;
    /** 纯文本 */
    text: string;
    /** 在线用户 */
    onlineUsers: CollabUser[];
    /** 操作历史 */
    operations: CollabOperation[];
    config: RichTextConfig;
}

/** 工具栏配置预设 */
export interface ToolbarPreset {
    mode: RichTextConfig["toolbarMode"];
    label: string;
    buttons: string[];
}
