# 14 模块企业级整改计划

## Context

用户反馈 README.md 第 650-663 行所列模块存在 6 类严重问题：图标缺失/错误、节点图标不对、PDF 设计器选中乱跳且缺少右键/快捷键/框选/对齐、图标未统一为 SVG、文档模板变量需手动扣取、API 编排布局丑且无实用性。需要从企业级视角全面整改。

---

## Phase 1：统一 SVG 图标系统（解决问题 1、4）

### 1.1 创建共享 SVG 图标组件

**新建文件** `src/components/shared/ShSvgIcon.vue`
- Props: `name: string`, `size?: string`（默认 "1em"）
- 从注册表查找 SVG path，渲染 `<svg>` 标签（非 v-html）
- 支持 `currentColor` 继承，兼容暗色主题

**新建文件** `src/components/shared/svgIconRegistry.ts`
- 汇聚所有散落在 EtlCanvas、ApiChainSequence、PdfElementPanel 等文件中的 `svgIconMap` / `icons` 对象
- 约 80+ 图标定义，按分类组织（toolbar / alignment / etl-node / pdf-element / api / whiteboard / context-menu）
- 包含所有 ETL 节点类型图标（database/api/file/json/csv/filter/operation/connection/data-analysis/sort/merge/share 等）

**新建文件** `src/components/shared/index.ts`
- 导出 ShSvgIcon 和 svgIconRegistry

### 1.2 更新 ShDemoToolbar 图标类型

**修改** `src/sample/components/demoTypes.ts`
- `icon` 字段类型从 `Component` 改为 `string`

**修改** `src/sample/components/ShDemoToolbar.vue`
- 替换 `<el-icon><component :is="action.icon" /></el-icon>` → `<ShSvgIcon :name="action.icon" />`
- 移除 `@element-plus/icons-vue` 依赖

### 1.3 更新所有使用 Element Plus 图标的组件

统一替换 `<el-icon><XxxIcon/></el-icon>` → `<ShSvgIcon name="xxx" />`：

| 文件 | 当前图标 | 替换为 |
|------|---------|--------|
| `pdf/panels/PdfToolbar.vue` | Back/Right/CopyDocument/Delete/View/Check | undo/redo/copy/delete/preview/save |
| `doctemplate/DocumentTemplateDesigner.vue` | View/Check | preview/save |
| `emailtemplate/EmailTemplateDesigner.vue` | View/Check | preview/save |
| `doctemplate/panels/DocVariablePanel.vue` | Plus/DocumentAdd/Edit/Delete | plus/file-add/edit/delete |
| `emailtemplate/panels/EmailVariablePanel.vue` | Plus/Edit/Delete | plus/edit/delete |

### 1.4 替换所有 v-html 内联 SVG

将所有 `<span class="svg-icon" v-html="icons.xxx">` 替换为 `<ShSvgIcon name="xxx" />`：

涉及文件：
- `etl/panels/EtlCanvas.vue` — 移除 `svgIconMap`，节点图标使用 `<ShSvgIcon :name="findPreset(node.type)?.icon || 'file'" />`
- `etl/panels/EtlToolbar.vue` — 同上
- `apiorchestrator/ApiOrchestrator.vue` — 移除 `icons` 对象
- `apiorchestrator/panels/ApiChainSequence.vue` — 移除 `icons` 对象
- `pdf/panels/PdfElementPanel.vue` — 移除 `getElementIcon` 函数
- 所有 digitaltwin/iot/office/knowledgegraph 面板文件

### 1.5 修正 ETL 节点图标名称

**修改** `src/components/etl/constants.ts`
- 节点预设 `icon` 字段从 Element Plus 组件名（Coin/Link/Document 等）改为语义化名称（database/api/file/json/csv 等）

---

## Phase 2：PDF 设计器企业级功能（解决问题 3）

### 2.1 修复选中元素乱跳 Bug

**根因**：`PdfCanvas.vue` 中 `@click` 和 `@mousedown` 同时触发，`handleMouseUp` 无条件调用 `designer.moveElement(id, 0, 0)` 导致位置被重置。

**修改** `src/components/pdf/panels/PdfCanvas.vue`：
1. 从 `handleElementMouseDown` 中移除 `selectElement` 调用（选中仅由 click 处理）
2. `handleMouseUp` 中判断元素是否实际移动，未移动则不调用 `moveElement`
3. 添加 `moved` 标志位，参考 DiagramCanvas 的 `dragging.moved` 模式

**修改** `src/components/pdf/composables/usePdfDesigner.ts`：
1. 暴露 `pushHistory` 方法
2. `moveElement` 不再自动 `pushHistory`（由 canvas 在 mouseup 后判断是否需要）

### 2.2 添加右键上下文菜单

**修改** `src/components/pdf/panels/PdfCanvas.vue`：
- 添加 `contextMenu` ref `{ visible, x, y, items }`
- 元素右键菜单项：复制/剪切/删除/克隆/上移一层/下移一层 | 左对齐/水平居中/右对齐/顶部对齐/垂直居中/底部对齐
- 画布右键菜单项：粘贴/全选
- `@contextmenu.prevent` 处理
- 点击其他区域自动隐藏

### 2.3 添加键盘快捷键

**修改** `src/components/pdf/panels/PdfCanvas.vue`：
- `onMounted` 注册 `keydown` 监听
- Delete/Backspace：删除选中
- Ctrl+Z：撤销，Ctrl+Y/Ctrl+Shift+Z：重做
- Ctrl+C/X/V：复制/剪切/粘贴
- Ctrl+A：全选
- Ctrl+D：克隆
- Escape：取消选中
- 方向键：微调位置（Shift 加速 10px）
- `isInputFocused()` 辅助函数跳过输入框

### 2.4 添加框选功能

**修改** `src/components/pdf/panels/PdfCanvas.vue`：
- `boxSelect` ref `{ startX, startY, endX, endY } | null`
- 画布空白处 mousedown 启动框选
- mousemove 更新选择框，渲染虚线矩形
- mouseup 计算框内元素，添加到选中列表

### 2.5 添加对齐工具

**修改** `src/components/pdf/panels/PdfToolbar.vue`：
- 在复制/删除按钮组与纸张选择器之间添加对齐按钮组
- 6 个按钮：左对齐/水平居中/右对齐/顶部对齐/垂直居中/底部对齐
- 至少选中 2 个元素时可用

**修改** `src/components/pdf/composables/usePdfDesigner.ts`：
- 添加 `alignElements(type: 'left'|'center'|'right'|'top'|'middle'|'bottom')` 方法
- 实现逻辑：计算目标位置，批量更新选中元素坐标

### 2.6 纸张大小变更时自动布局

**修改** `src/components/pdf/composables/usePdfDesigner.ts`：
- 添加 `autoLayoutOnResize(oldPage, newPage)` 方法
- 按比例缩放元素位置和尺寸，确保不超出新内容区域

**修改** `src/components/pdf/panels/PdfToolbar.vue`：
- 纸张大小变更时捕获旧尺寸，调用 `autoLayoutOnResize`

### 2.7 多选支持

**修改** `src/components/pdf/composables/usePdfDesigner.ts`：
- 添加 `selectedElementIds: ref<string[]>`（多选）
- `selectedElementId` 改为 computed，返回 `selectedElementIds[0] ?? null`（向后兼容）
- 添加 `copySelected()`、`pasteElements()`、`selectAll()`、`deleteSelected()`、`bringToFront()`、`sendToBack()`

**修改** `src/components/pdf/panels/PdfCanvas.vue`：
- 选中元素渲染蓝色边框（`selectedElementIds` 包含即高亮）
- 支持 Ctrl+点击多选

---

## Phase 3：文档/邮件模板变量下拉插入（解决问题 5）

### 3.1 创建 wangeditor 自定义下拉菜单

**新建** `src/components/doctemplate/plugins/insertVariableMenu.ts`
- 继承 wangeditor v5 的 `DropMenu` 类
- 下拉列表展示所有已定义变量
- 点击后调用 `editor.insertText('${varName}')`

**修改** `src/components/doctemplate/DocumentTemplateDesigner.vue`：
- 在 `setup` 阶段通过 `Boot.registerMenu` 注册自定义菜单
- 在 `DOC_TOOLBAR_BUTTONS` 中添加 `"insertVariable"`
- 通过 `MENU_CONF.insertVariable` 传入变量列表

### 3.2 邮件模板同理

**新建** `src/components/emailtemplate/plugins/insertVariableMenu.ts`

**修改** `src/components/emailtemplate/EmailTemplateDesigner.vue`：
- 同 3.1 处理

**修改** `src/components/emailtemplate/constants.ts`：
- `EMAIL_TOOLBAR_BUTTONS` 中添加 `"insertVariable"`

---

## Phase 4：API 编排器可视化流程重设计（解决问题 6）

### 4.1 重设计 ApiChainSequence 为流程图

**修改** `src/components/apiorchestrator/panels/ApiChainSequence.vue`：

当前：扁平卡片堆叠 → 目标：垂直流程图

新布局：
```
  ┌──────────────────┐
  │ 1 · 登录接口      │ ← 步骤卡片（居中，固定宽度）
  │ POST /api/login   │
  └────────┬─────────┘
           │
    token → ${authToken}  ← 变量流标签
           │
  ┌────────┴─────────┐
  │ 2 · 查询用户列表  │
  │ GET /api/users    │
  └────────┬─────────┘
           │
    userId → ${userId}
           │
  ┌────────┴─────────┐
  │ 3 · 查询用户详情  │
  │ GET /api/user/:id │
  └──────────────────┘
       [+ 添加步骤]
```

实现要点：
1. 垂直居中布局，SVG 连接线（贝塞尔曲线，参考 EtlCanvas 边路径）
2. 步骤卡片显示：序号徽标 + 步骤名 + 方法徽标 + 端点名 + 状态指示
3. 变量提取在连接线上以小标签形式展示
4. 拖拽排序（使用 sortablejs 或原生拖拽）
5. 双击步骤名编辑，而非始终内联输入框
6. 选中步骤时高亮并展开变量提取/条件编辑区

### 4.2 优化整体布局

**修改** `src/components/apiorchestrator/ApiOrchestrator.vue`：
- 中心面板给流程图更多横向空间
- 选中步骤时在右侧面板显示请求/响应预览
- Mock 配置合并到端点编辑器中

---

## Phase 5：共享画布功能提取 + ETL/白板增强

### 5.1 提取共享 composables

**新建** `src/components/shared/useContextMenu.ts`
- `contextMenu` ref + `showContextMenu()` + `hideContextMenu()`
- 自动 document click 隐藏

**新建** `src/components/shared/useCanvasShortcuts.ts`
- 注册/注销 keydown 监听
- 标准快捷键：Delete/Ctrl+Z/Y/C/X/V/A/Escape/方向键
- 回调模式，由各画布提供具体实现

**新建** `src/components/shared/useBoxSelect.ts`
- 框选状态管理 + 虚线矩形渲染
- `startBoxSelect` / `onBoxSelectMove` / `onBoxSelectUp`

### 5.2 ETL 画布增强

**修改** `src/components/etl/panels/EtlCanvas.vue`：
- 使用 `useContextMenu` 添加右键菜单
- 使用 `useCanvasShortcuts` 添加快捷键
- 使用 `useBoxSelect` 添加框选

**修改** `src/components/etl/composables/useEtlDesigner.ts`：
- 添加多选 `selectedNodeIds`
- 添加剪贴板 `copySelected()` / `pasteNodes()`

### 5.3 白板增强

**修改** `src/components/whiteboard/panels/WbCanvas.vue`：
- 使用 `useContextMenu` 添加右键菜单
- 使用 `useCanvasShortcuts` 添加快捷键

**修改** `src/components/whiteboard/composables/useWhiteboardDesigner.ts`：
- 添加剪贴板支持

---

## Phase 6：i18n 更新

**修改** `src/lang/zh_CN.ts` 和 `src/lang/en_US.ts`：

新增 key（约 40+ 个）：
- PDF 右键菜单：copy/cut/paste/delete/duplicate/selectAll/bringToFront/sendToBack/alignLeft~Bottom
- PDF 工具栏对齐：toolbar.alignLeft~Bottom
- ETL 右键菜单：copy/paste/delete/selectAll/bringToFront/sendToBack
- 白板右键菜单：copy/paste/delete/duplicate/bringForward/sendBackward
- API 编排：chain.dragToReorder/chain.variableFlow
- 变量插入：toolbar.insertVariable

---

## 执行顺序

1. **Phase 1** — SVG 图标系统（所有后续工作依赖此阶段）
2. **Phase 2** — PDF 设计器修复（选中乱跳为最高优先 Bug）
3. **Phase 3** — 变量下拉（可与 Phase 2 并行）
4. **Phase 4** — API 编排器重设计
5. **Phase 5** — 共享 composables + ETL/白板增强
6. **Phase 6** — i18n（随各阶段同步更新）

## 验证方式

1. 启动 dev server，逐个打开 14 个 Demo tab
2. 确认所有图标正常显示（无空白/错误图标）
3. PDF 设计器：拖拽元素不跳动，右键弹出菜单，快捷键响应，框选多元素，对齐工具工作
4. 文档/邮件模板：编辑器工具栏出现"插入变量"下拉，点击变量自动插入
5. API 编排器：步骤以流程图形式展示，拖拽排序，变量流可视化
6. ETL/白板：右键菜单和快捷键正常工作
