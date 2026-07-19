import { Check, Delete, Document, DocumentCopy, Download, FolderOpened, FullScreen, Lock, QuestionFilled } from "@element-plus/icons-vue";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * 协同富文本 Demo 示例内容
 */
export const SAMPLE_HTML: string =
    `<h2>协同富文本编辑器示例</h2>` +
    `<p>这是一个基于 <strong>wangEditor</strong> 的富文本编辑器组件，支持 <em>简单</em>、<u>默认</u>、完整三种工具栏模式切换。</p>` +
    `<h3>核心特性</h3>` +
    `<ul>` +
    `<li>多种工具栏模式（simple / default / full）</li>` +
    `<li>协同编辑用户列表展示</li>` +
    `<li>字数统计与最大长度限制</li>` +
    `<li>@提及功能支持</li>` +
    `<li>只读模式切换</li>` +
    `</ul>` +
    `<blockquote>提示：可通过上方工具栏按钮切换工具栏模式，编辑内容会自动保留。</blockquote>` +
    `<p>更多内容请参考官方文档。</p>`;

/**
 * RichTextCollab 配置
 */
export const RICHTEXT_CONFIG = {
    enableCollaboration: true,
    maxLength: 100000,
    showToolbar: true,
} as const;

/**
 * RichTextDemo 主操作（左侧）
 */
export const RICHTEXT_ACTIONS: ShDemoAction[] = [
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.richtext.toolbar.loadSample", group: "data" },
    { key: "clear", icon: Delete, labelKey: "advanced.richtext.toolbar.clear", type: "danger", group: "data" },
    { key: "exportHtml", icon: Download, tooltipKey: "advanced.richtext.toolbar.exportHtml", iconOnly: true, group: "data" },
    { key: "save", icon: Check, labelKey: "advanced.richtext.toolbar.save", type: "primary" },
];

/**
 * RichTextDemo 次要操作（右侧）
 *
 * 三个模式按钮（modeSimple/modeDefault/modeFull）互斥 active，点击切换 toolbarMode 并 :key 重挂载。
 * toggleReadonly 不需重挂载（RichTextCollab 监听 readonly）。
 */
export const RICHTEXT_SECONDARY: ShDemoAction[] = [
    { key: "modeSimple", icon: Document, tooltipKey: "advanced.richtext.toolbar.modeSimple", iconOnly: true, group: "mode" },
    { key: "modeDefault", icon: DocumentCopy, tooltipKey: "advanced.richtext.toolbar.modeDefault", iconOnly: true, group: "mode", active: true },
    { key: "modeFull", icon: FullScreen, tooltipKey: "advanced.richtext.toolbar.modeFull", iconOnly: true, group: "mode" },
    { key: "toggleReadonly", icon: Lock, tooltipKey: "advanced.richtext.toolbar.toggleReadonly", iconOnly: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.richtext.toolbar.help", iconOnly: true },
];
