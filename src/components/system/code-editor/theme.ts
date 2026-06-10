import type { IdeTheme } from "./types";

/**
 * IDE 主题定义 - 通过 CSS 变量控制整个编辑器外观
 * 切换主题时会同时切换 Monaco 主题 + CSS 变量
 */
export const IDE_THEMES: IdeTheme[] = [
  {
    name: "深色主题",
    value: "vs-dark",
    vars: {
      "--ide-bg": "#1e1e1e",
      "--ide-bg-secondary": "#252526",
      "--ide-bg-tertiary": "#2d2d2d",
      "--ide-bg-hover": "#2a2d2e",
      "--ide-bg-active": "#37373d",
      "--ide-bg-input": "#3c3c3c",
      "--ide-fg": "#cccccc",
      "--ide-fg-dim": "#858585",
      "--ide-fg-bright": "#ffffff",
      "--ide-border": "#3c3c3c",
      "--ide-border-active": "#007acc",
      "--ide-accent": "#007acc",
      "--ide-accent-hover": "#1c97ea",
      "--ide-scrollbar": "#424242",
      "--ide-tab-active-bg": "#1e1e1e",
      "--ide-tab-inactive-bg": "#2d2d2d",
      "--ide-statusbar-bg": "#007acc",
      "--ide-statusbar-fg": "#ffffff",
      "--ide-activitybar-bg": "#333333",
      "--ide-sidebar-bg": "#252526",
      "--ide-menubar-bg": "#3c3c3c",
      "--ide-dropdown-bg": "#252526",
      "--ide-dropdown-shadow": "rgba(0,0,0,0.4)",
      "--ide-welcome-fg": "#858585",
      "--ide-modified-dot": "#e8ab53",
      "--ide-error": "#ff4d4f",
      "--ide-success": "#52c41a",
    },
  },
  {
    name: "浅色主题",
    value: "vs",
    vars: {
      "--ide-bg": "#ffffff",
      "--ide-bg-secondary": "#f3f3f3",
      "--ide-bg-tertiary": "#ececec",
      "--ide-bg-hover": "#e8e8e8",
      "--ide-bg-active": "#d6d6d6",
      "--ide-bg-input": "#ffffff",
      "--ide-fg": "#333333",
      "--ide-fg-dim": "#6e6e6e",
      "--ide-fg-bright": "#000000",
      "--ide-border": "#d4d4d4",
      "--ide-border-active": "#007acc",
      "--ide-accent": "#007acc",
      "--ide-accent-hover": "#1c97ea",
      "--ide-scrollbar": "#b0b0b0",
      "--ide-tab-active-bg": "#ffffff",
      "--ide-tab-inactive-bg": "#ececec",
      "--ide-statusbar-bg": "#007acc",
      "--ide-statusbar-fg": "#ffffff",
      "--ide-activitybar-bg": "#e0e0e0",
      "--ide-sidebar-bg": "#f3f3f3",
      "--ide-menubar-bg": "#dddddd",
      "--ide-dropdown-bg": "#ffffff",
      "--ide-dropdown-shadow": "rgba(0,0,0,0.15)",
      "--ide-welcome-fg": "#6e6e6e",
      "--ide-modified-dot": "#d4a020",
      "--ide-error": "#e51400",
      "--ide-success": "#388a34",
    },
  },
  {
    name: "高对比度主题",
    value: "hc-black",
    vars: {
      "--ide-bg": "#000000",
      "--ide-bg-secondary": "#000000",
      "--ide-bg-tertiary": "#000000",
      "--ide-bg-hover": "#1a1a1a",
      "--ide-bg-active": "#2a2a2a",
      "--ide-bg-input": "#000000",
      "--ide-fg": "#ffffff",
      "--ide-fg-dim": "#aaaaaa",
      "--ide-fg-bright": "#ffffff",
      "--ide-border": "#6fc3df",
      "--ide-border-active": "#6fc3df",
      "--ide-accent": "#6fc3df",
      "--ide-accent-hover": "#8fd4e8",
      "--ide-scrollbar": "#555555",
      "--ide-tab-active-bg": "#000000",
      "--ide-tab-inactive-bg": "#000000",
      "--ide-statusbar-bg": "#6fc3df",
      "--ide-statusbar-fg": "#000000",
      "--ide-activitybar-bg": "#000000",
      "--ide-sidebar-bg": "#000000",
      "--ide-menubar-bg": "#000000",
      "--ide-dropdown-bg": "#000000",
      "--ide-dropdown-shadow": "rgba(0,0,0,0.8)",
      "--ide-welcome-fg": "#aaaaaa",
      "--ide-modified-dot": "#ffcc00",
      "--ide-error": "#ff0000",
      "--ide-success": "#00ff00",
    },
  },
];

/** 根据主题值获取主题对象 */
export const getThemeByValue = (value: string): IdeTheme =>
  IDE_THEMES.find(t => t.value === value) || IDE_THEMES[0];

/** 将主题CSS变量应用到DOM元素 */
export const applyThemeVars = (el: HTMLElement, themeValue: string) => {
  const theme = getThemeByValue(themeValue);
  for (const [key, val] of Object.entries(theme.vars)) {
    el.style.setProperty(key, val);
  }
};
