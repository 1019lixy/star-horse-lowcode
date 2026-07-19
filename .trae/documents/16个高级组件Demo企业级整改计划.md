# 16 个高级组件 Demo 企业级整改实施计划

## Context（背景与动机）

用户对 `e:\lixycode\shplugin\src\sample\` 下 16 个高级组件 Demo 模块极为不满，明确指出：

> "这些新增功能的布局，图标，特别是功能，这些和企业级根本不搭嘎...好多按钮没有图标，也没提示，布局乱成一团...面板，舞台，属性 要协调吧，该占满整个页面，你给我在下面空一大部分，好多地方死死挤一起，我要的是企业级落地的东西，不是你给我搞个过家家的demo忽悠我"

**Phase 1 探索确认的代码事实**（6 个典型模块审计）：
- 16 个 Demo 根容器虽 `height: 100%`，但内部 canvas 固定 `600px/620px/560px/640px` → 大面积下方留白
- 全部无三栏设计器结构（除已重做的 DigitalTwinDesigner）
- 全部无顶部工具栏、无 el-empty 空状态、无显式暗色适配
- 按钮无 el-icon、无 title/tooltip
- 全部 mock 数据硬编码在组件内，代码行数 74-231 行，demo 级

**项目已有可复用基础**：
- `DigitalTwinDesigner.vue` 三栏设计器金标准（DtToolbar + 左面板 + 中舞台 + 右面板 + 底状态条）
- `KanbanToolbar.vue` 的 `el-icon + el-tooltip + i18n` 规范
- `src/theme/index.scss` 主题系统（`--el-bg-color` / `--el-bg-color-page` / `--el-border-color-lighter` 等）
- StarHorse* 系列企业级组件
- i18n 框架（`src/lang/zh_CN.ts` + `en_US.ts`），已有 `common.*` 与各模块 `<module>.*` 命名空间

**目标**：一次性覆盖全部 16 模块，达到"企业级可落地"最低标准（布局占满 + 工具栏 + 图标 + tooltip + 空状态 + 暗色变量 + loadData 预留）。深度功能（真实 API/复杂交互）不在本次范围，但 mock 数据结构化、接入点预留。

---

## 整体策略

**3 个新增基础文件兜底 16 模块**，不重写已有底层组件：

| 文件 | 职责 | 位置 |
|---|---|---|
| `AdvancedDemoShell.vue` | 三栏壳（工具栏插槽 + 左面板 + 中舞台 + 右面板 + 底状态条），全屏 flex 占满 | `src/sample/components/` |
| `ShDemoToolbar.vue` | 声明式工具栏，统一 el-icon + el-tooltip + i18n + 暗色 | `src/sample/components/` |
| `demoTypes.ts` | 共享类型（`ShDemoAction` 等）+ 共享样式片段 | `src/sample/components/` |

**16 模块按底层组件类型分两类处理**：

- **A 类：底层已自带三栏**（6 个）→ 不套壳，只换 `<h3>+<p>+固定高度` 为 `ShDemoToolbar + flex:1 demo-stage`
  - DiagramDemo / KanbanDemo / EtlDemo / ApiOrchestratorDemo / OfficeDemo / DigitalTwinDemo（已做）
- **B 类：单画布/单组件**（10 个）→ 套 `AdvancedDemoShell`，左面板+右面板填 demo 级内容
  - PdfDemo / WhiteboardDemo / KnowledgeGraphDemo / GanttDemo / ScheduleDemo / PivotDemo / IotDemo / RichTextDemo / DocTemplateDemo / EmailTemplateDemo / MapDemo

> 注：MapDemo 因底层有 3 个子组件（MapField/MapTrackPlayer/MapHeatmap），用 el-tabs 切换，shell 中舞台区放 el-tabs。

---

## 新增基础组件设计

### 1. `AdvancedDemoShell.vue`

**Props**：
```ts
interface AdvancedDemoShellProps {
  module: string;                    // 模块 key，用于 i18n 与调试
  showLeftPanel?: boolean;           // 默认 true
  showRightPanel?: boolean;          // 默认 true
  leftPanelWidth?: number;           // 默认 240
  rightPanelWidth?: number;          // 默认 280
  showStatusBar?: boolean;           // 默认 true
  leftPanelCollapsible?: boolean;    // 默认 true
  rightPanelCollapsible?: boolean;   // 默认 true
  emptyKey?: string;                 // 舞台空状态 i18n key
}
```

**Slots**：
- `toolbar`（顶部工具栏，建议放 ShDemoToolbar）
- `leftHeader` / `left`（左面板标题与内容）
- `default`（中舞台，flex:1 占满）
- `rightHeader` / `right`（右面板标题与内容）
- `status`（底部状态条）

**布局核心**：
```vue
<div class="sh-demo-shell">
  <div v-if="$slots.toolbar" class="shell-toolbar"><slot name="toolbar" /></div>
  <div class="shell-body">
    <aside v-if="showLeftPanel && $slots.left && !leftCollapsed" class="shell-left" :style="{ width: leftPanelWidth + 'px' }">
      <div v-if="$slots.leftHeader" class="panel-header"><slot name="leftHeader" />
        <el-button link @click="leftCollapsed = true"><el-icon><DArrowLeft /></el-icon></el-button>
      </div>
      <div class="panel-body"><slot name="left" /></div>
    </aside>
    <main class="shell-stage">
      <slot><el-empty v-if="emptyKey" :description="i18n(emptyKey)" /></slot>
    </main>
    <aside v-if="showRightPanel && $slots.right && !rightCollapsed" class="shell-right" :style="{ width: rightPanelWidth + 'px' }">
      <div v-if="$slots.rightHeader" class="panel-header"><slot name="rightHeader" />
        <el-button link @click="rightCollapsed = true"><el-icon><DArrowRight /></el-icon></el-button>
      </div>
      <div class="panel-body"><slot name="right" /></div>
    </aside>
  </div>
  <div v-if="showStatusBar && $slots.status" class="shell-status"><slot name="status" /></div>
  <!-- 折叠后的浮动恢复按钮 -->
</div>
```

**样式核心约束**（必须用 `var(--el-*)`，禁 hex）：
```scss
.sh-demo-shell { display: flex; flex-direction: column; height: 100%; width: 100%; overflow: hidden; background: var(--el-bg-color-page); }
.shell-toolbar { flex-shrink: 0; border-bottom: 1px solid var(--el-border-color-lighter); }
.shell-body { flex: 1; display: flex; overflow: hidden; min-height: 0; }  /* min-height:0 是画布占满的核心 */
.shell-left, .shell-right { flex-shrink: 0; display: flex; flex-direction: column; background: var(--el-bg-color); overflow: hidden; }
.shell-left { border-right: 1px solid var(--el-border-color-lighter); }
.shell-right { border-left: 1px solid var(--el-border-color-lighter); }
.panel-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-bottom: 1px solid var(--el-border-color-lighter); font-size: 13px; font-weight: 600; color: var(--el-text-color-primary); }
.panel-body { flex: 1; overflow: auto; padding: 8px 12px; }
.shell-stage { flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column; background: var(--el-bg-color-page); overflow: hidden; }
.shell-stage > :deep(*) { flex: 1; min-height: 0; }  /* 让子组件 height:100% 生效 */
.shell-status { flex-shrink: 0; padding: 4px 12px; border-top: 1px solid var(--el-border-color-lighter); background: var(--el-fill-color-light); font-size: 12px; color: var(--el-text-color-secondary); display: flex; gap: 12px; }
```

### 2. `ShDemoToolbar.vue`

**Props**：
```ts
interface ShDemoAction {
  key: string;                       // 唯一 key，触发 action 事件回传
  icon?: Component;                  // Element Plus 图标组件
  labelKey?: string;                 // 主标签 i18n key
  tooltipKey?: string;               // tooltip i18n key（iconOnly 时必填）
  type?: "default" | "primary" | "success" | "warning" | "danger";
  disabled?: boolean;
  active?: boolean;                  // toggle 类按钮激活态
  iconOnly?: boolean;                // 纯图标按钮（强制要求 tooltipKey）
  dividerBefore?: boolean;           // 该按钮前插入分隔线
  group?: string;                    // 同组 el-button-group 包裹
}

interface ShDemoToolbarProps {
  titleKey?: string;
  actions?: ShDemoAction[];
  secondaryActions?: ShDemoAction[];
  module?: string;
}
```

**事件**：`emit('action', key: string, payload?: MouseEvent)`

**渲染规范**（强制）：
- 图标+文字按钮：`<el-icon>` + `{{ i18n(labelKey) }}`
- 纯图标按钮：必须 `<el-tooltip :content="i18n(tooltipKey)">` 包裹
- 同 `group` 字符串归入同一 `el-button-group`
- `dividerBefore: true` 前插入 `<el-divider direction="vertical" />`

### 3. `demoTypes.ts`

导出 `ShDemoAction` 接口（供各 Demo constants.ts 引用）+ 共享样式常量。

---

## 16 模块改造清单

### 批次 1：基础组件 + 4 个示范模块

**新增基础组件**（3 个文件）：
1. `src/sample/components/AdvancedDemoShell.vue`
2. `src/sample/components/ShDemoToolbar.vue`
3. `src/sample/components/demoTypes.ts`

**改造 4 个最严重模块**（A 类 2 个 + B 类 2 个，覆盖两种处理路径）：

#### 1.1 DiagramDemo（A 类，不套壳）

- **新增**：`src/sample/diagram/DiagramDemo.constants.ts`（mock + actions 常量）
- **改写**：`src/sample/DiagramDemo.vue`
- **模板**：
  ```vue
  <template>
    <div class="demo-root">
      <ShDemoToolbar :title-key="'advanced.diagram.title'" :actions="actions" :secondary-actions="secondaryActions" module="diagram" @action="onAction" />
      <div class="demo-stage"><DiagramDesigner :initial-diagram="diagramData" /></div>
    </div>
  </template>
  ```
- **工具栏 actions**：`save`(Check,primary) / `undo`+`redo`(group="history",Back/Right) / `preview`(View) / `clear`(Delete,danger) / `exportSvg`(Download,iconOnly) / 右侧:`toggleGrid`(Grid,active)+`fitView`(FullScreen,iconOnly)+`help`(QuestionFilled,iconOnly)
- **样式**：`.demo-root { display: flex; flex-direction: column; height: 100%; overflow: hidden; } .demo-stage { flex: 1; min-height: 0; overflow: hidden; }`
- **loadData 预留**：`async function loadData(data?) { diagramData.value = structuredClone(data ?? SAMPLE_DIAGRAM); } defineExpose({ loadData });`

#### 1.2 KanbanDemo（A 类，不套壳）

- **新增**：`src/sample/kanban/KanbanDemo.constants.ts`
- **改写**：`src/sample/KanbanDemo.vue`
- **工具栏 actions**（demo 级，不重复底层 KanbanToolbar）：`loadSample`(FolderOpened) / `clear`(Delete,danger) / `exportJson`(Download,iconOnly) / `toggleWipLimit`(Warning,active,iconOnly) / `toggleReadonly`(Lock,active,iconOnly) / 右侧:`stats`(DataAnalysis,iconOnly)+`help`(QuestionFilled,iconOnly)
- **模板**：同 DiagramDemo 的 `.demo-root` + `.demo-stage` 结构，内放 `<KanbanBoard :initial-kanban="kanbanData" :readonly="readonly" @save="onSave" />`

#### 1.3 PdfDemo（B 类，套壳）

- **新增**：`src/sample/pdf/PdfDemo.constants.ts` + `src/sample/pdf/PdfElementPalette.vue`（左面板）+ `src/sample/pdf/PdfPropertySummary.vue`（右面板）
- **改写**：`src/sample/PdfDemo.vue`
- **模板**：
  ```vue
  <AdvancedDemoShell module="pdf" :left-panel-width="220" :right-panel-width="280">
    <template #toolbar><ShDemoToolbar ... /></template>
    <template #leftHeader>{{ i18n('advanced.pdf.panel.elements') }}</template>
    <template #left><PdfElementPalette /></template>
    <template #default>
      <div class="pdf-stage-split">
        <div class="designer-area"><PdfTemplateDesigner :initial-template="pdfTemplate" /></div>
        <div v-if="showSigner" class="signer-area"><PdfSigner :signatures="signatures" /></div>
      </div>
    </template>
    <template #rightHeader>{{ i18n('advanced.pdf.panel.properties') }}</template>
    <template #right><PdfPropertySummary :template="pdfTemplate" /></template>
    <template #status>{{ i18n('advanced.pdf.status.elements') }}: {{ pdfTemplate.elements.length }}</template>
  </AdvancedDemoShell>
  ```
- **工具栏 actions**：`newTemplate`(Plus,primary) / `saveTemplate`(Check) / `loadTemplate`(FolderOpened) / `exportPdf`(Download,iconOnly) / `preview`(View,iconOnly) / 右侧:`toggleSigner`(active,iconOnly)+`help`
- **上下分栏样式**：`.pdf-stage-split { display: flex; flex-direction: column; height: 100%; } .designer-area { flex: 1; min-height: 0; } .signer-area { flex-shrink: 0; height: 200px; border-top: 1px solid var(--el-border-color-lighter); }`

#### 1.4 WhiteboardDemo（B 类，套壳）

- **新增**：`src/sample/whiteboard/WhiteboardDemo.constants.ts` + `src/sample/whiteboard/WhiteboardToolPalette.vue`（左）+ `src/sample/whiteboard/WhiteboardLayerList.vue`（右）
- **改写**：`src/sample/WhiteboardDemo.vue`
- **工具栏 actions**：group="tool":`select`/`pen`/`eraser`/`shape`/`line`/`text`（iconOnly+tooltip） / dividerBefore / group="history":`undo`+`redo` / `clear`(danger) / 右侧:`toggleGrid`(active)+`fitView`+`exportPng`(iconOnly)+`help`
- **模板**：`AdvancedDemoShell` + 左工具面板 + 中`<Whiteboard>` + 右图层列表 + 底状态条（元素数/缩放）

### 批次 2：A 类剩余设计器（4 个，不套壳）

**模块**：EtlDemo / ApiOrchestratorDemo / KnowledgeGraphDemo / GanttDemo / ScheduleDemo（5 个；DigitalTwinDemo 已做）

**统一 5 步法**：
1. 抽 `<module>/<Module>Demo.constants.ts`（mock + actions）
2. 模板：`ShDemoToolbar` + `.demo-root` + `.demo-stage`（flex:1, min-height:0）包底层组件
3. demo 工具栏通用 actions：`loadSample`(FolderOpened) / `clear`(Delete,danger) / `exportJson`(Download,iconOnly) / `validate`(CircleCheck,iconOnly) / 右侧:`toggleReadonly`(Lock,active,iconOnly)+`help`
4. 模块专属 actions：
   - **EtlDemo**：`runPipeline`(VideoPlay,primary) / `stopPipeline`(VideoPause,warning)
   - **ApiOrchestratorDemo**：`runRequest`(VideoPlay,primary) / `formatJson`(Document)
   - **KnowledgeGraphDemo**：`runQuery`(Search,primary) / `clearQuery`(Delete)（保留内层 el-tabs 但去掉外层 `<h3>+<p>`，el-tabs 直接 flex:1）
   - **GanttDemo**：`today`(Calendar) / `zoomIn`+`zoomOut`(group="zoom",ZoomIn/ZoomOut) / `toggleCritical`(active,iconOnly)
   - **ScheduleDemo**：`today`(Calendar) / `prevDay`+`nextDay`(group="day",ArrowLeft/ArrowRight) / `viewMode` group(day/week/month)
5. `loadData` 预留 + `defineExpose({ loadData })`

### 批次 3：B 类表格/数据（4 个，套壳或不套壳）

**模块**：PivotDemo / IotDemo / OfficeDemo / RichTextDemo

- **PivotDemo**（不套壳，底层 PivotTable 已有拖拽区）：`loadSample` / `clearData` / `exportExcel`(Download,iconOnly) / `toggleChart`(active,iconOnly) / `transpose`(Sort,iconOnly)
- **IotDemo**（保留内层 el-tabs，去 `<h3>+<p>`，每个子组件 height:420 改 flex:1）：`refresh`(Refresh,primary) / `autoRefresh`(active,iconOnly) / `filterSeverity`(dropdown button) / `exportAlarm`(Download,iconOnly)
- **OfficeDemo**（不套壳，底层 OfficeEditor 已自带工具栏）：`newWord`+`newExcel`+`newPpt`(group="new",Document/Files/Ppt) / `save`(Check,primary) / `export`(Download,iconOnly) / `toggleReadonly`(Lock,active,iconOnly)
- **RichTextDemo**（套壳，showLeftPanel=false, showRightPanel=false）：group="mode":`simple`+`default`+`full` / `clear`(Delete,danger) / `exportHtml`(Download,iconOnly) / `toggleCollab`(active,iconOnly) / 底状态条显示字数

### 批次 4：B 类模板/可视化（3 个，套壳）

**模块**：DocTemplateDemo / EmailTemplateDemo / MapDemo

- **DocTemplateDemo**：左=变量类型列表，中=`<DocumentTemplateDesigner>`，右=变量摘要+校验结果；toolbar=`newTemplate`/`loadSample`/`save`/`preview`/`validate`/`exportHtml`
- **EmailTemplateDemo**：左=变量+附件列表，中=`<EmailTemplateDesigner>`，右=变量摘要+收件人测试输入；toolbar=`newTemplate`/`loadSample`/`save`/`sendTest`/`preview`/`exportHtml`
- **MapDemo**（保留内层 el-tabs 切换 3 个地图子组件，shell 中舞台区放 el-tabs）：左=图层列表，中=el-tabs(MapField/MapTrackPlayer/MapHeatmap)，右=属性(bounds/center/zoom)；toolbar=`pickPoint`(Aim)/`playTrack`+`stopTrack`(group="track",VideoPlay/VideoPause)/`speed` group(1x/2x/4x)/`toggleHeatmap`(active,iconOnly)/`exportImage`(Download,iconOnly)

---

## i18n key 命名规范

**约定**：`advanced.<module>.<area>.<item>`，与底层组件已有的 `<module>.*` 区分。

**area 编码**：
| area | 用途 |
|---|---|
| `title` | Demo 顶部标题 |
| `toolbar.<action>` | 工具栏按钮 label/tooltip |
| `panel.<name>` | 左/右面板标题 |
| `status.<field>` | 底部状态条字段 |
| `empty.<scene>` | 空状态文案 |
| `message.<event>` | ElMessage 提示文案 |
| `help.<section>` | 帮助弹层内容 |

**复用规则**：
- 通用动作（保存/删除/清空/导出/取消/确认）直接复用 `common.*` 已有 key，不重复定义
- 底层组件已有的 key（如 `diagram.toolbar.select`）demo 工具栏直接引用，不重复

**新增位置**：`src/lang/zh_CN.ts` 与 `en_US.ts` 末尾追加 `// ===== advanced demos =====` 分组，每个 module 一个块。预计 16 模块共约 400-600 个 key。

---

## 验证标准（每个模块必须满足 7 条）

1. **占满整页**：Demo 在 `el-tab-pane` 内 `height: 100%`，DevTools 选中根元素 `offsetHeight` 等于 `el-tab-pane` 高度，误差 ≤ 1px，无下方留白
2. **三栏协调**（套壳类）：左/中/右三栏总宽 = Demo 宽；面板可折叠，折叠后舞台 flex:1 自动撑开；无水平滚动条
3. **图标完整**：每个 `<el-button>` 要么 `<el-icon>` + 文字，要么纯图标 + `<el-tooltip>`；不存在"无图标无 tooltip 的纯文字按钮"和"无 tooltip 的纯图标按钮"
4. **暗色变量**：样式块零 hex（`grep -E "#[0-9A-Fa-f]{3,6}"` 仅允许出现在 mock 数据的 `color` 字段）；全部用 `var(--el-*)`；切换暗色主题无对比度问题
5. **空状态**：数组为空时显示 `<el-empty :description="i18n('advanced.<module>.empty.<scene>')" />`，而非空白或报错
6. **i18n 完整**：切换 `en_US` 后无 `[advanced.xxx]` 占位符；Console 无 i18n 缺 key 警告
7. **数据预留**：组件 `defineExpose({ loadData })`，`loadData(data?)` 无参加载默认 SAMPLE，有参 `structuredClone` 后加载；不引入新依赖

---

## 风险与应对

| 风险 | 应对 |
|---|---|
| 底层组件 `height:100%` 不生效（PdfTemplateDesigner/OfficeEditor 内部固定 px） | `.demo-stage` 加 `position: relative` + 子组件 `position: absolute; inset: 0`，或 `:deep(.xxx) { height: 100%; }`；不改底层源码 |
| demo 工具栏与底层工具栏重复（KanbanBoard/OfficeEditor 内部已有 toolbar） | demo 工具栏只放"demo 级"操作（loadSample/clear/export/toggleReadonly/help），底层 toolbar 保留"组件级"操作；明确分工表 |
| el-tabs 嵌套 height 链断裂（KnowledgeGraph/Map/Iot 内层 el-tabs 不占满） | 复用 `AdvancedComponentsDemo.vue` 已验证的 `:deep(.el-tabs__content) { flex: 1; overflow: hidden; }` + `:deep(.el-tab-pane) { height: 100%; }` |
| 暗色主题漏网（mock 数据 color 渗到样式） | 样式块零 hex 强制 PR review；mock 数据色值仅在 SVG/Canvas 数据层使用 |
| i18n key 爆炸难维护（16 模块 × 30 key ≈ 480 key） | 严格按 `advanced.<module>.<area>.<item>` 模式；通用动作复用 `common.*` |
| 16 模块工作量大，单次 PR 过巨 | 分 4 批次提交，每批独立可验证；批次 1（基础+4 示范）作为"金标准"固化后再推进 |
| mock 数据漂移 | constants.ts 内 `as const` + 导出 `SampleXxx` 类型 |

---

## 实施顺序与文件清单

### 批次 1（基础 + 4 示范，本次实施）

**新增文件**（7 个）：
1. `src/sample/components/AdvancedDemoShell.vue`
2. `src/sample/components/ShDemoToolbar.vue`
3. `src/sample/components/demoTypes.ts`
4. `src/sample/diagram/DiagramDemo.constants.ts`
5. `src/sample/kanban/KanbanDemo.constants.ts`
6. `src/sample/pdf/PdfDemo.constants.ts` + `src/sample/pdf/PdfElementPalette.vue` + `src/sample/pdf/PdfPropertySummary.vue`
7. `src/sample/whiteboard/WhiteboardDemo.constants.ts` + `src/sample/whiteboard/WhiteboardToolPalette.vue` + `src/sample/whiteboard/WhiteboardLayerList.vue`

**改写文件**（4 个）：
1. `src/sample/DiagramDemo.vue`
2. `src/sample/KanbanDemo.vue`
3. `src/sample/PdfDemo.vue`
4. `src/sample/WhiteboardDemo.vue`

**i18n 追加**：`src/lang/zh_CN.ts` + `en_US.ts` 追加 `advanced.diagram.*` / `advanced.kanban.*` / `advanced.pdf.*` / `advanced.whiteboard.*` 共约 120 个 key

### 批次 2（A 类设计器 5 个）
- EtlDemo / ApiOrchestratorDemo / KnowledgeGraphDemo / GanttDemo / ScheduleDemo
- 每个新增 `<module>/<Module>Demo.constants.ts` + 改写 `<Module>Demo.vue`
- i18n 追加 `advanced.etl.*` / `advanced.api.*` / `advanced.knowledgegraph.*` / `advanced.gantt.*` / `advanced.schedule.*` 约 150 个 key

### 批次 3（B 类表格数据 4 个）
- PivotDemo / IotDemo / OfficeDemo / RichTextDemo
- 每个新增 constants + 改写 Demo + 部分新增左右面板小组件
- i18n 追加 `advanced.pivot.*` / `advanced.iot.*` / `advanced.office.*` / `advanced.richtext.*` 约 120 个 key

### 批次 4（B 类模板可视化 3 个）
- DocTemplateDemo / EmailTemplateDemo / MapDemo
- 每个新增 constants + 改写 Demo + 左右面板小组件
- i18n 追加 `advanced.doctemplate.*` / `advanced.emailtemplate.*` / `advanced.map.*` 约 90 个 key

---

## 不在本次范围（明确排除）

- ❌ 真实后端 API 接入（保留 mock，仅预留 `loadData()` 接入点）
- ❌ 底层组件（DiagramDesigner/KanbanBoard/EtlDesigner 等）的功能重写
- ❌ 数字孪生批次 2-6（独立推进）
- ❌ 新增第三方依赖（vue-fabric-editor/GGEditor 等）
- ❌ 5 语言 i18n（仅 zh_CN + en_US）
- ❌ 单元测试与 e2e 测试（后续单独推进）

---

## 验证步骤（批次 1 完成后）

1. `npm run serve` 启动 dev server
2. 浏览器打开 `http://localhost:4000/#/advanced`
3. 逐个点击 4 个 tab（流程图/看板/PDF模板/白板），验证：
   - 无下方留白，Demo 占满 el-tab-pane
   - 顶部工具栏按钮均有图标 + tooltip（hover 显示）
   - 暗色主题统一，无白底黑字
   - 空状态有 el-empty 提示
   - 切换 en_US 无 `[advanced.xxx]` 占位符
4. DevTools 检查：
   - 根元素 `offsetHeight` === `el-tab-pane` 高度
   - Console 无 Three.js / import / i18n 缺 key 错误
   - 样式块 `grep "#[0-9A-Fa-f]{3,6}"` 仅在 mock 数据 color 字段
5. 切换暗色/亮色主题，验证对比度
6. 折叠左/右面板（套壳类），验证舞台自动撑开
