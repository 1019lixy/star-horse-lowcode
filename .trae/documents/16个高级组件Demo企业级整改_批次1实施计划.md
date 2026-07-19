# 16 个高级组件 Demo 企业级整改 — 批次 1 实施计划

## Summary

承接已批准的《16 个高级组件 Demo 企业级整改计划.md》，本文件聚焦**批次 1**（基础组件 + 4 个示范模块）的可执行实施步骤。

**批次 1 目标**：
- 创建 2 个基础组件（`ShDemoToolbar.vue` + `demoTypes.ts`）作为 16 模块通用兜底
- 改造 4 个最严重模块（DiagramDemo / KanbanDemo / PdfDemo / WhiteboardDemo）达到企业级最低标准
- 追加 i18n keys（zh_CN + en_US）覆盖 4 模块的工具栏/消息/空状态

**Phase 2 用户决策**（已确认）：
1. **全部不套壳**：底层 4 组件已是一体化三栏设计器，4 个 Demo 统一用 `ShDemoToolbar + .demo-stage` 包裹，不创建 `AdvancedDemoShell`（推迟到批次 3 真正需要时）
2. **constants.ts 集中管理**：每个模块新建 `<module>/<Module>Demo.constants.ts`，导出 `SAMPLE_XXX` mock 数据 + `ACTIONS` / `SECONDARY_ACTIONS` 常量数组

---

## Current State Analysis

### 4 个目标 Demo 现状（Phase 1 探索确认）

| Demo | 行数 | 根容器 | 内部 canvas 固定高度 | 工具栏 | 图标 | tooltip | 暗色变量 | 空状态 |
|---|---|---|---|---|---|---|---|---|
| DiagramDemo.vue | 168 | `padding:16px; height:100%; overflow:auto` | 600px | ❌ 只有 `<h3>+<p>` | ❌ | ❌ | 部分 | ❌ |
| KanbanDemo.vue | 185 | 同上 | 620px | ❌ | ❌ | ❌ | 部分 | ❌ |
| PdfDemo.vue | 224 | 同上 | 620px + 360px 两块 | ❌ | ❌ | ❌ | 部分 | ❌ |
| WhiteboardDemo.vue | 231 | 同上 | 600px | ❌ | ❌ | ❌ | 部分 | ❌ |

**共性问题**：
- 内部 canvas 固定高度 → 大面积下方留白（用户原话："你给我在下面空一大部分"）
- 无顶部工具栏（用户原话："好多按钮没有图标，也没提示"）
- 无 el-empty 空状态
- mock 数据硬编码在组件内（demo 级，非企业级）

### 底层组件确认（Phase 1 探索确认）

**4 个底层组件全部是一体化三栏设计器**，自带工具栏+左面板+画布+右面板+弹窗：

| 组件 | 根 class | 根样式 | Props | Events |
|---|---|---|---|---|
| DiagramDesigner | `.diagram-designer` | `height:100%; width:100%; display:flex; flex-direction:column` | `diagram?` / `initialDiagram?` / `readonly?` | `update:diagram`, `save` |
| KanbanBoard | `.kanban-board`（含 `.columns-container`） | 同上 | `kanban?` / `initialKanban?` / `readonly?` | `update:kanban`, `save` |
| PdfTemplateDesigner | `.pdf-template-designer` | 同上 | `template?` / `initialTemplate?` / `readonly?` | `update:template`, `save` |
| PdfSigner | （StarHorseDialog 内） | - | `sourceUrl?` / `signatures?` / `readonly?` | `save` |
| Whiteboard | `.whiteboard-container` | 同上 | `elements?` / `readonly?` | `update:elements`, `change` |

**关键结论**：底层组件根样式都是 `height: 100%`，外层 `.demo-stage { flex: 1; min-height: 0; }` 即可让其撑满，无需 `:deep()` hack。

### i18n 文件结构

- `src/lang/zh_CN.ts`（2583 行）+ `en_US.ts`（2574 行）
- **扁平 key 结构**（非嵌套对象）：`"aicopilot.settings.title": "..."`
- 末尾结构：最后几行是 `aicopilot.error.*`，以 `};` 结尾
- i18n 函数签名：`i18n(key: keyof typeof zh_CN, ...args: any[])` — 新增 key 自动被类型系统识别
- **追加位置**：在 `};` 之前插入 `// ===== advanced demos =====` 分组

### 目录现状

5 个目标目录全部不存在，需创建：
- `src/sample/components/`（基础组件）
- `src/sample/diagram/` / `src/sample/kanban/` / `src/sample/pdf/` / `src/sample/whiteboard/`（constants）

---

## Proposed Changes

### 新增文件清单（6 个）

#### 文件 1：`src/sample/components/demoTypes.ts`

**职责**：导出 `ShDemoAction` / `ShDemoToolbarProps` 接口，供各 constants.ts 与 ShDemoToolbar.vue 引用。

**关键内容**：
```typescript
import type { Component } from "vue";

/** ShDemoToolbar 声明式按钮定义 */
export interface ShDemoAction {
    /** 唯一 key，触发 action 事件回传 */
    key: string;
    /** Element Plus 图标组件（@element-plus/icons-vue） */
    icon?: Component;
    /** 主标签 i18n key（iconOnly 时可省略） */
    labelKey?: string;
    /** tooltip i18n key（iconOnly 时必填） */
    tooltipKey?: string;
    type?: "default" | "primary" | "success" | "warning" | "danger";
    disabled?: boolean;
    /** toggle 类按钮激活态 */
    active?: boolean;
    /** 纯图标按钮（强制要求 tooltipKey） */
    iconOnly?: boolean;
    /** 该按钮前插入 el-divider direction="vertical" */
    dividerBefore?: boolean;
    /** 同 group 字符串归入同一 el-button-group */
    group?: string;
}

/** ShDemoToolbar Props */
export interface ShDemoToolbarProps {
    /** 标题 i18n key */
    titleKey?: string;
    /** 主操作按钮组（左侧） */
    actions?: ShDemoAction[];
    /** 次要操作按钮组（右侧 margin-left:auto） */
    secondaryActions?: ShDemoAction[];
    /** 模块 key，用于调试 */
    module?: string;
}
```

#### 文件 2：`src/sample/components/ShDemoToolbar.vue`

**职责**：声明式工具栏，统一 `el-icon + el-tooltip + i18n + 暗色变量`。

**Props**：见 `ShDemoToolbarProps`

**Events**：`(e: "action", key: string, payload: MouseEvent): void`

**渲染规范**（强制）：
- 图标+文字按钮：`<el-icon>` + `<span>{{ t(labelKey) }}</span>`
- 纯图标按钮（`iconOnly: true`）：**必须** `<el-tooltip :content="t(tooltipKey)">` 包裹，tooltipKey 必填
- 同 `group` 字符串归入同一 `<el-button-group>`
- `dividerBefore: true` 前插入 `<el-divider direction="vertical" />`
- `active: true` 时添加 `.is-active` class（`background: var(--el-color-primary-light-8); color: var(--el-color-primary)`）
- 所有按钮 `size="small"`

**分组算法**（按 group 字段）：
```typescript
const groupedActions = computed(() => {
    const groups: { group?: string; items: ShDemoAction[] }[] = [];
    let current: { group?: string; items: ShDemoAction[] } | null = null;
    for (const action of props.actions) {
        const needNewGroup = !current || current.group !== action.group || action.dividerBefore;
        if (needNewGroup) {
            current = { group: action.group, items: [] };
            groups.push(current);
        }
        current.items.push(action);
    }
    return groups;
});
```

**模板骨架**：
```vue
<template>
    <div class="sh-demo-toolbar">
        <div v-if="titleKey" class="toolbar-title">{{ t(titleKey) }}</div>
        <div class="toolbar-actions">
            <template v-for="(grp, idx) in groupedActions" :key="idx">
                <el-divider v-if="grp.items[0]?.dividerBefore && idx > 0" direction="vertical" />
                <el-button-group v-if="grp.group">
                    <el-tooltip
                        v-for="action in grp.items"
                        :key="action.key"
                        :content="t(action.tooltipKey || action.labelKey)"
                        :disabled="!action.iconOnly && !!action.labelKey"
                        placement="bottom"
                    >
                        <el-button
                            :type="action.type || 'default'"
                            :disabled="action.disabled"
                            :class="{ 'is-active': action.active }"
                            size="small"
                            @click="onClick(action, $event)"
                        >
                            <el-icon v-if="action.icon"><component :is="action.icon" /></el-icon>
                            <span v-if="!action.iconOnly && action.labelKey">{{ t(action.labelKey) }}</span>
                        </el-button>
                    </el-tooltip>
                </el-button-group>
                <el-tooltip
                    v-else
                    v-for="action in grp.items"
                    :key="action.key"
                    :content="t(action.tooltipKey || action.labelKey)"
                    :disabled="!action.iconOnly && !!action.labelKey"
                    placement="bottom"
                >
                    <el-button
                        :type="action.type || 'default'"
                        :disabled="action.disabled"
                        :class="{ 'is-active': action.active }"
                        size="small"
                        @click="onClick(action, $event)"
                    >
                        <el-icon v-if="action.icon"><component :is="action.icon" /></el-icon>
                        <span v-if="!action.iconOnly && action.labelKey">{{ t(action.labelKey) }}</span>
                    </el-button>
                </el-tooltip>
            </template>
        </div>
        <div v-if="secondaryActions.length" class="toolbar-secondary">
            <!-- 同 toolbar-actions 逻辑，复用 groupedSecondary -->
        </div>
    </div>
</template>
```

**样式核心**（全部 `var(--el-*)`，禁 hex）：
```scss
.sh-demo-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;
}
.toolbar-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-right: 8px;
    white-space: nowrap;
}
.toolbar-actions, .toolbar-secondary {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
}
.toolbar-secondary {
    margin-left: auto;
}
.is-active {
    background: var(--el-color-primary-light-8);
    color: var(--el-color-primary);
}
```

#### 文件 3：`src/sample/diagram/DiagramDemo.constants.ts`

**职责**：从原 DiagramDemo.vue 抽出 mock 数据 + 定义工具栏 actions。

**导出**：
- `SAMPLE_DIAGRAM: DiagramData`（从原 DiagramDemo.vue 第 6-143 行的 `diagramData` 字面量原样移入，`as const` 不加，保持 `DiagramData` 类型）
- `DIAGRAM_ACTIONS: ShDemoAction[]` — 主操作
- `DIAGRAM_SECONDARY: ShDemoAction[]` — 右侧次要操作

**Actions 定义**（demo 级操作，不重复底层 DiagramToolbar）：
```typescript
import {
    Check, Back, Right, View, Delete, Download, Grid, FullScreen, QuestionFilled,
} from "@element-plus/icons-vue";
import type { ShDemoAction } from "../components/demoTypes";

export const DIAGRAM_ACTIONS: ShDemoAction[] = [
    { key: "save", icon: Check, labelKey: "advanced.diagram.toolbar.save", type: "primary" },
    { key: "undo", icon: Back, tooltipKey: "advanced.diagram.toolbar.undo", iconOnly: true, group: "history" },
    { key: "redo", icon: Right, tooltipKey: "advanced.diagram.toolbar.redo", iconOnly: true, group: "history" },
    { key: "preview", icon: View, labelKey: "advanced.diagram.toolbar.preview" },
    { key: "clear", icon: Delete, labelKey: "advanced.diagram.toolbar.clear", type: "danger" },
    { key: "exportSvg", icon: Download, tooltipKey: "advanced.diagram.toolbar.exportSvg", iconOnly: true },
];

export const DIAGRAM_SECONDARY: ShDemoAction[] = [
    { key: "toggleGrid", icon: Grid, tooltipKey: "advanced.diagram.toolbar.toggleGrid", iconOnly: true, active: true },
    { key: "fitView", icon: FullScreen, tooltipKey: "advanced.diagram.toolbar.fitView", iconOnly: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.diagram.toolbar.help", iconOnly: true },
];
```

#### 文件 4：`src/sample/kanban/KanbanDemo.constants.ts`

**导出**：`SAMPLE_KANBAN: KanbanData` + `KANBAN_ACTIONS` + `KANBAN_SECONDARY`

**Actions**（demo 级，不重复底层 KanbanToolbar）：
```typescript
import {
    FolderOpened, Delete, Download, Warning, Lock, DataAnalysis, QuestionFilled,
} from "@element-plus/icons-vue";

export const KANBAN_ACTIONS: ShDemoAction[] = [
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.kanban.toolbar.loadSample" },
    { key: "clear", icon: Delete, labelKey: "advanced.kanban.toolbar.clear", type: "danger" },
    { key: "exportJson", icon: Download, tooltipKey: "advanced.kanban.toolbar.exportJson", iconOnly: true },
    { key: "toggleWipLimit", icon: Warning, tooltipKey: "advanced.kanban.toolbar.toggleWipLimit", iconOnly: true, active: true },
    { key: "toggleReadonly", icon: Lock, tooltipKey: "advanced.kanban.toolbar.toggleReadonly", iconOnly: true },
];

export const KANBAN_SECONDARY: ShDemoAction[] = [
    { key: "stats", icon: DataAnalysis, tooltipKey: "advanced.kanban.toolbar.stats", iconOnly: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.kanban.toolbar.help", iconOnly: true },
];
```

#### 文件 5：`src/sample/pdf/PdfDemo.constants.ts`

**导出**：`SAMPLE_PDF_TEMPLATE: PdfTemplate` + `SAMPLE_PDF_SIGNATURES: PdfSignatureInfo[]` + `PDF_ACTIONS` + `PDF_SECONDARY`

**Actions**：
```typescript
import {
    Plus, Check, FolderOpened, Download, View, Switch, QuestionFilled,
} from "@element-plus/icons-vue";

export const PDF_ACTIONS: ShDemoAction[] = [
    { key: "newTemplate", icon: Plus, labelKey: "advanced.pdf.toolbar.newTemplate", type: "primary" },
    { key: "saveTemplate", icon: Check, labelKey: "advanced.pdf.toolbar.saveTemplate" },
    { key: "loadTemplate", icon: FolderOpened, labelKey: "advanced.pdf.toolbar.loadTemplate" },
    { key: "exportPdf", icon: Download, tooltipKey: "advanced.pdf.toolbar.exportPdf", iconOnly: true },
    { key: "preview", icon: View, tooltipKey: "advanced.pdf.toolbar.preview", iconOnly: true },
];

export const PDF_SECONDARY: ShDemoAction[] = [
    { key: "toggleSigner", icon: Switch, tooltipKey: "advanced.pdf.toolbar.toggleSigner", iconOnly: true, active: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.pdf.toolbar.help", iconOnly: true },
];
```

#### 文件 6：`src/sample/whiteboard/WhiteboardDemo.constants.ts`

**导出**：`SAMPLE_WB_ELEMENTS: WhiteboardElement[]` + `WB_ACTIONS` + `WB_SECONDARY`

**Actions**（工具组用 group="tool"，历史组用 group="history"）：
```typescript
import {
    Select, EditPen, Delete as EraseIcon, Pointer, ScaleToOriginal, Edit,
    Back, Right, Delete, Grid, FullScreen, Download, QuestionFilled,
} from "@element-plus/icons-vue";

export const WB_ACTIONS: ShDemoAction[] = [
    { key: "select", icon: Select, tooltipKey: "advanced.whiteboard.toolbar.select", iconOnly: true, group: "tool", active: true },
    { key: "pen", icon: EditPen, tooltipKey: "advanced.whiteboard.toolbar.pen", iconOnly: true, group: "tool" },
    { key: "eraser", icon: EraseIcon, tooltipKey: "advanced.whiteboard.toolbar.eraser", iconOnly: true, group: "tool" },
    { key: "shape", icon: Pointer, tooltipKey: "advanced.whiteboard.toolbar.shape", iconOnly: true, group: "tool" },
    { key: "line", icon: ScaleToOriginal, tooltipKey: "advanced.whiteboard.toolbar.line", iconOnly: true, group: "tool" },
    { key: "text", icon: Edit, tooltipKey: "advanced.whiteboard.toolbar.text", iconOnly: true, group: "tool" },
    { key: "undo", icon: Back, tooltipKey: "advanced.whiteboard.toolbar.undo", iconOnly: true, group: "history", dividerBefore: true },
    { key: "redo", icon: Right, tooltipKey: "advanced.whiteboard.toolbar.redo", iconOnly: true, group: "history" },
    { key: "clear", icon: Delete, labelKey: "advanced.whiteboard.toolbar.clear", type: "danger", dividerBefore: true },
];

export const WB_SECONDARY: ShDemoAction[] = [
    { key: "toggleGrid", icon: Grid, tooltipKey: "advanced.whiteboard.toolbar.toggleGrid", iconOnly: true, active: true },
    { key: "fitView", icon: FullScreen, tooltipKey: "advanced.whiteboard.toolbar.fitView", iconOnly: true },
    { key: "exportPng", icon: Download, tooltipKey: "advanced.whiteboard.toolbar.exportPng", iconOnly: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.whiteboard.toolbar.help", iconOnly: true },
];
```

> 注：实际图标名以 `@element-plus/icons-vue` 实际导出为准，实施时如遇不存在的图标用近似图标替代（如 `Pointer` / `ScaleToOriginal` / `Edit` 等），需验证。

### 改写文件清单（4 个）

4 个 Demo.vue 统一采用以下模板结构：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import { XxxDesigner } from "@/components/xxx";
import type { XxxData } from "@/components/xxx";
import ShDemoToolbar from "./components/ShDemoToolbar.vue";
import { SAMPLE_XXX, XXX_ACTIONS, XXX_SECONDARY } from "./xxx/XxxDemo.constants";

const xxxData = ref<XxxData>(structuredClone(SAMPLE_XXX));

const onAction = (key: string) => {
    switch (key) {
        case "loadSample":
        case "newTemplate":
            xxxData.value = structuredClone(SAMPLE_XXX);
            ElMessage.success(i18n("advanced.xxx.message.loadedSample" as any));
            break;
        case "clear":
            // 清空逻辑（具体见各 Demo 细节）
            break;
        case "exportJson":
        case "exportSvg":
        case "exportPdf":
        case "exportPng":
            // 导出逻辑（demo 级：下载 JSON 字符串）
            break;
        case "help":
            ElMessage.info(i18n("advanced.xxx.message.helpHint" as any));
            break;
        default:
            // toggle 类按钮：active 状态由 constants 控制，需响应式
            break;
    }
};

/** loadData 预留接入点 */
const loadData = (data?: XxxData) => {
    xxxData.value = structuredClone(data ?? SAMPLE_XXX);
};

defineExpose({ loadData });
</script>

<template>
    <div class="demo-root">
        <ShDemoToolbar
            :title-key="'advanced.xxx.title'"
            :actions="XXX_ACTIONS"
            :secondary-actions="XXX_SECONDARY"
            module="xxx"
            @action="onAction"
        />
        <div class="demo-stage">
            <XxxDesigner :initial-xxx="xxxData" />
        </div>
    </div>
</template>

<style scoped>
.demo-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: var(--el-bg-color-page);
}
.demo-stage {
    flex: 1;
    min-height: 0;
    overflow: hidden;
}
</style>
```

#### 改写 1：`src/sample/DiagramDemo.vue`

- 引入 `DiagramDesigner` + `SAMPLE_DIAGRAM` + `DIAGRAM_ACTIONS` + `DIAGRAM_SECONDARY`
- `onAction` 处理：`save`/`undo`/`redo`/`preview`/`clear`/`exportSvg`/`toggleGrid`/`fitView`/`help`
- `clear`：重置为空 diagram（保留 layers 骨架，清空 nodes/edges）
- `exportSvg`：demo 级，ElMessage.info 提示"导出 SVG（demo）"
- `toggleGrid`/`fitView`：demo 级，仅 ElMessage 提示（底层 DiagramToolbar 已有真实功能）

#### 改写 2：`src/sample/KanbanDemo.vue`

- 引入 `KanbanBoard` + `SAMPLE_KANBAN` + `KANBAN_ACTIONS` + `KANBAN_SECONDARY`
- 额外 ref：`readonly = ref(false)` / `wipLimitEnabled = ref(true)`
- `onAction` 处理：`loadSample`/`clear`/`exportJson`/`toggleWipLimit`/`toggleReadonly`/`stats`/`help`
- `clear`：重置 kanbanData 为空 columns + 空 cards
- `toggleReadonly`：切换 readonly ref，传给 `<KanbanBoard :readonly="readonly">`
- `toggleWipLimit`：切换 wipLimitEnabled ref，ElMessage 提示
- `exportJson`：下载 JSON 字符串（`Blob` + `URL.createObjectURL` + `<a download>`）

#### 改写 3：`src/sample/PdfDemo.vue`

- 引入 `PdfTemplateDesigner` + `PdfSigner` + `SAMPLE_PDF_TEMPLATE` + `SAMPLE_PDF_SIGNATURES` + `PDF_ACTIONS` + `PDF_SECONDARY`
- 额外 ref：`showSigner = ref(true)`
- 模板特殊性：中舞台上下分栏（PdfTemplateDesigner 上方 flex:1 + PdfSigner 下方 200px）
- 模板：
  ```vue
  <div class="demo-stage">
      <div class="pdf-stage-split">
          <div class="designer-area">
              <PdfTemplateDesigner :initial-template="pdfTemplate" />
          </div>
          <div v-if="showSigner" class="signer-area">
              <PdfSigner :signatures="signatures" />
          </div>
      </div>
  </div>
  ```
- 样式：
  ```scss
  .pdf-stage-split { display: flex; flex-direction: column; height: 100%; }
  .designer-area { flex: 1; min-height: 0; overflow: hidden; }
  .signer-area { flex-shrink: 0; height: 220px; border-top: 1px solid var(--el-border-color-lighter); overflow: hidden; }
  ```
- `onAction` 处理：`newTemplate`/`saveTemplate`/`loadTemplate`/`exportPdf`/`preview`/`toggleSigner`/`help`
- `toggleSigner`：切换 showSigner ref

#### 改写 4：`src/sample/WhiteboardDemo.vue`

- 引入 `Whiteboard` + `SAMPLE_WB_ELEMENTS` + `WB_ACTIONS` + `WB_SECONDARY`
- 额外 ref：`elements = ref<WhiteboardElement[]>(structuredClone(SAMPLE_WB_ELEMENTS))`
- `onAction` 处理：`select`/`pen`/`eraser`/`shape`/`line`/`text`/`undo`/`redo`/`clear`/`toggleGrid`/`fitView`/`exportPng`/`help`
- 工具组（`select`/`pen`/`eraser`/`shape`/`line`/`text`）：demo 级，仅 ElMessage 提示当前工具（底层 WbToolbar 已有真实功能）
- `clear`：`elements.value = []`
- `exportPng`：demo 级，ElMessage.info 提示
- `@change="handleChange"` 保留，更新 elements ref

### i18n Keys 追加

**位置**：`src/lang/zh_CN.ts` 与 `en_US.ts` 末尾 `};` 之前

**格式**：
```typescript
// ===== advanced demos =====
"advanced.diagram.title": "流程图设计器",
"advanced.diagram.toolbar.save": "保存",
// ... 约 20-25 keys/模块
```

**4 模块共约 80-100 keys**，命名规范 `advanced.<module>.<area>.<item>`：

| area | 用途 | 每模块数量 |
|---|---|---|
| `title` | Demo 顶部标题 | 1 |
| `toolbar.<action>` | 工具栏按钮 label/tooltip | 6-12 |
| `message.<event>` | ElMessage 提示文案 | 3-5 |
| `empty.<scene>` | 空状态文案 | 1-2 |

**详细 keys 清单**（以 diagram 为例，其他模块同构）：
```typescript
"advanced.diagram.title": "流程图设计器",
"advanced.diagram.toolbar.save": "保存",
"advanced.diagram.toolbar.undo": "撤销",
"advanced.diagram.toolbar.redo": "重做",
"advanced.diagram.toolbar.preview": "预览",
"advanced.diagram.toolbar.clear": "清空",
"advanced.diagram.toolbar.exportSvg": "导出 SVG",
"advanced.diagram.toolbar.toggleGrid": "切换网格",
"advanced.diagram.toolbar.fitView": "适应窗口",
"advanced.diagram.toolbar.help": "帮助",
"advanced.diagram.message.loadedSample": "已加载示例流程图",
"advanced.diagram.message.cleared": "已清空画布",
"advanced.diagram.message.exported": "已导出（demo）",
"advanced.diagram.message.helpHint": "拖拽左侧节点到画布，点击端口连线",
"advanced.diagram.empty.canvas": "画布为空，从左侧面板拖入节点",
```

kanban / pdf / whiteboard 模块按相同结构生成对应 keys，toolbar action 名见各 constants.ts。

---

## Assumptions & Decisions

### 决策 1：全部不套壳（Phase 2 用户确认）

**理由**：底层 4 组件已是一体化三栏设计器，套 AdvancedDemoShell 会导致双工具栏+双面板重复，违反用户"协调、不重复"要求。

**影响**：
- 批次 1 不创建 `AdvancedDemoShell.vue`
- 不创建 `PdfElementPalette.vue` / `PdfPropertySummary.vue` / `WhiteboardToolPalette.vue` / `WhiteboardLayerList.vue`（4 个左右面板小组件，底层已有同名功能）
- `AdvancedDemoShell` 推迟到批次 3 真正需要时（如 RichTextDemo 单组件场景）再创建

### 决策 2：constants.ts 集中管理（Phase 2 用户确认）

**理由**：mock 数据 + actions 集中在 `<module>/<Module>Demo.constants.ts`，Demo.vue 只负责引入和绑定，便于批量维护、i18n key 集中。

### 决策 3：demo 工具栏与底层工具栏分工

**约定**：
- **demo 工具栏**（ShDemoToolbar）：只放"demo 级"操作 — `loadSample` / `newTemplate` / `clear` / `exportJson` / `exportSvg` / `exportPdf` / `exportPng` / `toggleReadonly` / `toggleGrid` / `fitView` / `help` / `stats` / `toggleSigner`
- **底层工具栏**（DiagramToolbar / KanbanToolbar / PdfToolbar / WbToolbar）：保留"组件级"操作 — 节点拖拽/连线/属性编辑/工具切换/撤销重做等
- 两者并存，不冲突：demo 工具栏管"数据生命周期"，底层工具栏管"画布交互"

### 决策 4：toggle 类按钮的 active 状态

**问题**：constants.ts 是静态导出，`active` 字段无法响应式切换。

**方案**：constants.ts 中 `active` 字段作为"初始态"，Demo.vue 内用 ref 维护实际状态，通过 computed 动态生成 actions 数组传入 ShDemoToolbar。

**实现**（以 KanbanDemo 的 toggleReadonly 为例）：
```typescript
const readonly = ref(false);
const actions = computed<ShDemoAction[]>(() =>
    KANBAN_ACTIONS.map((a) =>
        a.key === "toggleReadonly" ? { ...a, active: readonly.value } : a,
    ),
);
```
模板用 `:actions="actions"` 而非 `:actions="KANBAN_ACTIONS"`。

> 批次 1 的 4 个 Demo 中，KanbanDemo（toggleReadonly/toggleWipLimit）、PdfDemo（toggleSigner）、WhiteboardDemo（toggleGrid + 工具组）需要此模式；DiagramDemo（toggleGrid）也需要。

### 决策 5：导出操作用 Blob + a 标签

**约定**（遵循用户 profile 反对 Base64 大文件，但 demo 级 JSON/SVG 体积小，可用 Blob）：
- `exportJson`：`const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })` + `URL.createObjectURL` + `<a download="xxx.json">`
- `exportSvg`/`exportPng`：demo 级仅 ElMessage.info 提示（底层组件已有真实导出功能）

### 决策 6：不引入新依赖

- 图标全部来自 `@element-plus/icons-vue`（项目已用）
- 工具栏组件用 `el-button` / `el-button-group` / `el-tooltip` / `el-divider` / `el-icon`（Element Plus 已有）
- 深拷贝用 `structuredClone`（项目硬约束）

---

## Verification Steps

### 验证标准（7 条，每模块必须满足）

1. **占满整页**：Demo 在 `el-tab-pane` 内 `height: 100%`，DevTools 选中 `.demo-root` 的 `offsetHeight` === `el-tab-pane` 高度，误差 ≤ 1px，无下方留白
2. **三栏协调**：底层组件三栏（工具栏+左面板+画布+右面板）正常显示，无水平滚动条
3. **图标完整**：每个 `<el-button>` 要么 `<el-icon>` + 文字，要么纯图标 + `<el-tooltip>`；不存在"无图标无 tooltip 的纯文字按钮"和"无 tooltip 的纯图标按钮"
4. **暗色变量**：样式块零 hex（`rg "#[0-9A-Fa-f]{3,6}"` 仅允许出现在 mock 数据的 `color` 字段）；全部用 `var(--el-*)`；切换暗色主题无对比度问题
5. **空状态**：数组为空时显示 `<el-empty>`（底层组件已实现，Demo 不重复实现）
6. **i18n 完整**：切换 `en_US` 后无 `[advanced.xxx]` 占位符；Console 无 i18n 缺 key 警告
7. **数据预留**：组件 `defineExpose({ loadData })`，`loadData(data?)` 无参加载默认 SAMPLE，有参 `structuredClone` 后加载

### 验证步骤

1. `npm run serve` 启动 dev server（如已在运行，等待 HMR 同步）
2. 浏览器打开 `http://localhost:4000/#/advanced`
3. 逐个点击 4 个 tab（流程图/看板/PDF模板/白板），验证：
   - 无下方留白，Demo 占满 el-tab-pane
   - 顶部 ShDemoToolbar 按钮均有图标 + tooltip（hover 显示）
   - 底层组件三栏正常显示，无重叠
   - 暗色主题统一，无白底黑字
   - 切换 en_US 无 `[advanced.xxx]` 占位符
4. DevTools 检查：
   - `.demo-root` 的 `offsetHeight` === `el-tab-pane` 高度
   - Console 无 import / i18n 缺 key 错误
   - 样式块 `rg "#[0-9A-Fa-f]{3,6}"` 仅在 mock 数据 color 字段
5. 切换暗色/亮色主题，验证对比度
6. 点击 ShDemoToolbar 各按钮，验证 ElMessage 提示正确
7. 测试 toggle 类按钮（toggleReadonly/toggleSigner/toggleGrid），验证 active 状态切换

---

## Out of Scope（明确排除）

- ❌ 真实后端 API 接入（保留 mock，仅预留 `loadData()` 接入点）
- ❌ 底层组件（DiagramDesigner/KanbanBoard/PdfTemplateDesigner/Whiteboard）的功能重写
- ❌ AdvancedDemoShell 创建（推迟到批次 3）
- ❌ 批次 2-4 的 12 个模块（独立推进）
- ❌ 数字孪生批次 2-6（独立推进）
- ❌ 新增第三方依赖
- ❌ 5 语言 i18n（仅 zh_CN + en_US）
- ❌ 单元测试与 e2e 测试

---

## 实施顺序（TodoWrite）

1. ✅ Phase 1 探索（已完成）
2. ✅ Phase 2 用户决策（已完成）
3. ✅ Phase 3 生成计划文件（本文件）
4. ⏭ Phase 4 NotifyUser → 用户批准后执行
5. 创建 `src/sample/components/demoTypes.ts`
6. 创建 `src/sample/components/ShDemoToolbar.vue`
7. 创建 4 个 constants.ts（diagram/kanban/pdf/whiteboard）
8. 改写 4 个 Demo.vue
9. 追加 i18n keys（zh_CN + en_US）
10. 验证：npm run serve + 4 tab 浏览器验证

---

## 参考文件

- 已批准总计划：`e:\lixycode\shplugin\.trae\documents\16个高级组件Demo企业级整改计划.md`
- 容器组件：`e:\lixycode\shplugin\src\sample\AdvancedComponentsDemo.vue`（el-tabs + flex 占满，已验证）
- 底层组件入口：
  - `e:\lixycode\shplugin\src\components\diagram\index.ts`（导出 DiagramDesigner）
  - `e:\lixycode\shplugin\src\components\kanban\index.ts`（导出 KanbanBoard）
  - `e:\lixycode\shplugin\src\components\pdf\index.ts`（导出 PdfTemplateDesigner + PdfSigner）
  - `e:\lixycode\shplugin\src\components\whiteboard\index.ts`（导出 Whiteboard）
- i18n 入口：`e:\lixycode\shplugin\src\lang\index.ts`（`i18n(key: keyof typeof zh_CN, ...args)`）
- 项目硬约束：`c:\Users\MES\.trae-cn\memory\projects\-e-lixycode-shplugin\project_memory.md`
