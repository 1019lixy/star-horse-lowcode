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
