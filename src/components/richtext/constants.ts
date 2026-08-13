/**
 * 协同富文本常量定义
 */
import { i18n } from "@/lang";
import type { RichTextConfig, ToolbarPreset } from "./types";

/** 默认配置 */
export const DEFAULT_RICHTEXT_CONFIG: RichTextConfig = {
  placeholder: i18n("richtext.placeholder"),
  readonly: false,
  showToolbar: true,
  toolbarMode: "default",
  enableCollaboration: false,
  enableMention: true,
  maxLength: 100000,
};

/** 工具栏预设 */
export const TOOLBAR_PRESETS: ToolbarPreset[] = [
  {
    mode: "simple",
    label: i18n("richtext.toolbar.simple"),
    buttons: ["bold", "italic", "underline", "|", "undo", "redo"],
  },
  {
    mode: "default",
    label: i18n("richtext.toolbar.default"),
    buttons: [
      "headerSelect",
      "|",
      "bold",
      "italic",
      "underline",
      "through",
      "|",
      "color",
      "bgColor",
      "|",
      "bulletedList",
      "numberedList",
      "todo",
      "|",
      "insertLink",
      "insertImage",
      "insertTable",
      "|",
      "undo",
      "redo",
    ],
  },
  {
    mode: "full",
    label: i18n("richtext.toolbar.full"),
    buttons: [
      "headerSelect",
      "fontSize",
      "fontFamily",
      "|",
      "bold",
      "italic",
      "underline",
      "through",
      "code",
      "sub",
      "sup",
      "|",
      "color",
      "bgColor",
      "|",
      "bulletedList",
      "numberedList",
      "todo",
      "group-justify",
      "group-indent",
      "|",
      "emotion",
      "insertLink",
      "insertImage",
      "insertVideo",
      "insertTable",
      "codeBlock",
      "divider",
      "|",
      "undo",
      "redo",
      "|",
      "fullScreen",
    ],
  },
];

/** 协同用户颜色调色板 */
export const COLLAB_USER_COLORS = [
  "#F56C6C",
  "#E6A23C",
  "#67C23A",
  "#409EFF",
  "#9C27B0",
  "#00BCD4",
  "#FF9800",
  "#795548",
];

/** 创建协同用户 */
export const createCollabUser = (
  overrides: Partial<{
    id: string;
    name: string;
    avatar: string;
    color: string;
  }> = {},
) => {
  const idx = Math.floor(Math.random() * COLLAB_USER_COLORS.length);
  return {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: i18n("richtext.user.anonymous"),
    color: COLLAB_USER_COLORS[idx],
    ...overrides,
  };
};
