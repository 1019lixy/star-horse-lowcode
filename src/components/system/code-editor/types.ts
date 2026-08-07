/** 文件节点 */
export interface FileNode {
    idCodeFile: string;
    name: string;
    type: "file" | "folder";
    language?: string;
    content?: string;
    children?: FileNode[];
    icon?: string;
}

/** 标签页信息 */
export interface TabInfo {
    id: string;
    name: string;
    language: string;
    modified: boolean;
    /** 父目录路径，用于区分不同目录下的同名文件 */
    path?: string;
    /** 原始内容（用于 diff 对比） */
    originalContent?: string;
    /** 服务器版本内容（用于冲突解决） */
    serverContent?: string;
}

/** 菜单项定义 */
export interface MenuItemDef {
    label: string;
    action?: string;
    shortcut?: string;
    divider?: boolean;
    children?: MenuItemDef[];
}

/** 主题定义 */
export interface IdeTheme {
    name: string;
    value: string;
    /** CSS变量 */
    vars: Record<string, string>;
}

/** 编辑器主题上下文，传递给子组件 */
export interface ThemeContext {
    currentTheme: string;
    switchTheme: (theme: string) => void;
}

/** 编辑器组（一个分屏面板的标签页集合） */
export interface EditorGroup {
    /** 组唯一ID */
    id: string;
    /** 组内的标签页列表 */
    tabs: TabInfo[];
    /** 组内当前激活的标签页ID */
    activeTabId: string;
}

/** 分屏方向：horizontal=左右分屏，vertical=上下分屏 */
export type SplitDirection = "horizontal" | "vertical";

/** 分屏侧：相对于源组，新组放置在哪个方向 */
export type SplitSide = "left" | "right" | "up" | "down";

/** 分屏树节点（递归结构，支持任意嵌套分屏） */
export interface SplitNode {
    /** 节点唯一ID */
    id: string;
    /** 叶子节点：所属编辑器组ID */
    groupId?: string;
    /** 容器节点：子节点的排列方向 */
    direction?: SplitDirection;
    /** 容器节点：两个子节点（左/上 与 右/下） */
    children?: [SplitNode, SplitNode];
    /** 在父容器中所占比例 (0-1)，仅第一个子节点使用 */
    size?: number;
}

/** Tab 拖拽时放置区域 */
export type DropZone =
    | "center" // 移动到目标组
    | "left" // 在左侧新建分屏
    | "right" // 在右侧新建分屏
    | "top" // 在上方新建分屏
    | "bottom"; // 在下方新建分屏

/** Tab 拖拽数据载荷 */
export interface TabDragPayload {
    type: "tab";
    /** 源组ID */
    fromGroupId: string;
    /** 拖拽的标签页ID */
    tabId: string;
}
