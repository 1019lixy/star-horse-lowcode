# 模块企业级整改计划（续）

## 概要

用户对 README.md 650-663 行的 14 个模块提出 6 类问题：图标缺失/错误、节点图标不对、PDF设计器选中乱跳及缺少企业级功能、图标需统一用 SVG、文档模版变量不应手扣、API编排布局丑且无实用性。本计划聚焦**尚未完成的工作**，5 个后台 agent 正在处理 Phase 1 的部分图标迁移。

## 当前状态分析

### 已完成
- ✅ ShSvgIcon.vue + svgIconRegistry.ts + index.ts 创建
- ✅ demoTypes.ts icon 类型改为 string
- ✅ ShDemoToolbar.vue 已使用 ShSvgIcon
- ✅ PdfToolbar.vue 已替换为 ShSvgIcon
- ✅ usePdfDesigner.ts 重构（多选、对齐、剪贴板、自动布局）
- ✅ PdfCanvas.vue 重写（修复乱跳、右键菜单、快捷键、框选、多选）
- ✅ DocumentTemplateDesigner.vue / EmailTemplateDesigner.vue 工具栏图标已替换

### 后台 Agent 进行中（需验证/补全）
- 🔄 API orchestrator 图标替换（7f488cba）- ApiChainSequence.vue 已完成，ApiOrchestrator.vue 进行中
- 🔄 API orchestrator 可用性增强（d27fef83）- 添加右键菜单和 i18n
- 🔄 PDF 设计器 i18n（b2aa13f0）- 添加 pdf.ctx.* 键
- 🔄 文档/邮件模版变量下拉菜单（df0ce040）- 创建 variableMenu.ts，有文件写入问题
- 🔄 ETL canvas ShSvgIcon 迁移（7bedd78e）- EtlCanvas.vue 进行中，有权限问题

### 待完成
- ❌ API orchestrator 视觉流程重设计（核心问题：布局丑、无实用性）
- ❌ DiagramToolbar.vue 内联 SVG → ShSvgIcon
- ❌ Whiteboard WbToolbar.vue 字体图标 → ShSvgIcon
- ❌ DocVariablePanel / EmailVariablePanel Element Plus 图标 → ShSvgIcon
- ❌ ApiEndpointPanel / ApiMockConfig / ApiTestResults 内联 SVG → ShSvgIcon
- ❌ PDF 工具栏添加对齐按钮组
- ❌ 纸张大小变更自动布局集成到 PdfTemplateDesigner
- ❌ 共享 composables 提取（useContextMenu / useCanvasShortcuts / useBoxSelect）
- ❌ ETL / Whiteboard 添加右键菜单、快捷键、框选等
- ❌ 完整 i18n 更新

---

## 实施计划

### Phase 1：完成 SVG 图标统一（验证 + 补全）

**1.1 验证后台 agent 结果**
- 检查 5 个后台 agent 的最终输出
- 确认所有文件编译无误

**1.2 补全剩余图标迁移**

| 文件 | 当前方案 | 目标 |
|------|---------|------|
| `apiorchestrator/panels/ApiEndpointPanel.vue` | 内联 SVG + v-html | ShSvgIcon |
| `apiorchestrator/panels/ApiToolbar.vue` | 内联 SVG + v-html | ShSvgIcon |
| `apiorchestrator/panels/ApiMockConfig.vue` | 内联 SVG + v-html | ShSvgIcon |
| `apiorchestrator/panels/ApiTestResults.vue` | 内联 SVG + v-html | ShSvgIcon |
| `diagram/panels/DiagramToolbar.vue` | 模板内联 `<svg>` | ShSvgIcon |
| `doctemplate/panels/DocVariablePanel.vue` | Element Plus 图标组件 | ShSvgIcon |
| `emailtemplate/panels/EmailVariablePanel.vue` | Element Plus 图标组件 | ShSvgIcon |

**1.3 ETL constants.ts 节点图标名称**
- 确认 `ETL_NODE_PRESETS` 中 `icon` 字段已改为 svgIconRegistry 中的语义化名称（database/api/file/json/csv/filter/operation/connection/dataAnalysis/sort/merge/share/promotion/magicStick）
- 验证后台 agent 已完成此修改

**1.4 Whiteboard WbToolbar.vue**
- 当前使用 `<star-horse-icon icon-class="...">` 字体图标
- 需评估是否在本次迁移范围内（字体图标系统仍在广泛使用，白板模块是独立模块）
- **决策：暂不迁移 Whiteboard 字体图标**，避免破坏现有功能，但新增组件统一用 ShSvgIcon

---

### Phase 2：API 编排器视觉流程重设计（核心）

这是用户最强烈的需求："布局不仅丑，还毫无实用性"。

**2.1 当前问题分析**
- `ApiChainSequence.vue` 使用扁平卡片列表，步骤间无视觉连接
- 缺少流程感，不像真正的 API 编排工具
- 没有分支/条件判断的可视化

**2.2 重设计方案：垂直流程图**

将 `ApiChainSequence.vue` 从扁平卡片改为垂直流程图布局：

```
  ┌─────────────┐
  │  Step 1     │ ← 可拖拽排序
  │  POST /login│
  └──────┬──────┘
         │ ← 连接线（带箭头）
         ▼
  ┌─────────────┐
  │  Step 2     │ ← 右键菜单（插入/删除/条件分支）
  │  GET /users │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │  Step 3     │
  │  GET /user/1│
  └─────────────┘
```

具体改动：
- **布局**：从 `flex-direction: column; gap: 8px` 改为步骤卡片 + SVG 连接线
- **连接线**：步骤间用 SVG 三次贝塞尔曲线（参考 EtlCanvas 的 edgePath 计算）
- **步骤卡片**：保留当前的 `step-header`（序号/名称/端点选择/方法徽章），但简化操作按钮到右键菜单
- **右键菜单**：添加步骤右键（插入前/插入后/删除/上移/下移）
- **拖拽排序**：使用 sortablejs 替代手动上移/下移按钮
- **条件分支**：步骤间可选添加条件判断节点（菱形，显示 condition 文本）

**2.3 修改文件列表**

| 文件 | 改动 |
|------|------|
| `apiorchestrator/panels/ApiChainSequence.vue` | **重写** - 垂直流程图布局 + SVG 连线 + 右键菜单 + sortablejs 拖拽排序 |
| `apiorchestrator/panels/ApiToolbar.vue` | 图标迁移 ShSvgIcon |
| `apiorchestrator/composables/useApiOrchestrator.ts` | 可能需要添加 `insertStepBefore`/`insertStepAfter` 方法 |
| `apiorchestrator/constants.ts` | 无需改动 |
| `lang/zh_CN.ts` | 添加 `api.chain.insertBefore/insertAfter/deleteStep` 等 i18n key |
| `lang/en_US.ts` | 对应英文 key |

---

### Phase 3：PDF 设计器完善

**3.1 工具栏添加对齐按钮组**

在 `PdfToolbar.vue` 添加对齐按钮组（仅选中 ≥2 个元素时启用）：

```vue
<el-button-group v-if="designer.selectedCount >= 2">
  <el-tooltip content="左对齐"><el-button @click="designer.alignElements('left')"><ShSvgIcon name="align-left" /></el-button></el-tooltip>
  <el-tooltip content="水平居中"><el-button @click="designer.alignElements('center')"><ShSvgIcon name="align-center" /></el-button></el-tooltip>
  <el-tooltip content="右对齐"><el-button @click="designer.alignElements('right')"><ShSvgIcon name="align-right" /></el-button></el-tooltip>
  <!-- 类似 top/middle/bottom -->
</el-button-group>
```

**3.2 纸张大小变更自动布局**

在 `PdfTemplateDesigner.vue` 中 watch `state.page` 的变更，调用 `autoLayoutOnResize`：

```typescript
watch(
  () => ({ ...state.page }),
  (newPage, oldPage) => {
    if (oldPage && (newPage.width !== oldPage.width || newPage.height !== oldPage.height)) {
      designer.autoLayoutOnResize(oldPage, newPage);
    }
  },
  { deep: true }
);
```

**3.3 PDF 右键菜单 i18n 补全**

确认 `pdf.context.*` 键已在 zh_CN.ts / en_US.ts 中存在（后台 agent 正在处理）。

---

### Phase 4：文档/邮件模版变量下拉插入

**4.1 当前问题**
- 用户需要手动输入 `${varName}`，容易出错
- 变量名不一致，无法保证正确性

**4.2 解决方案：wangeditor 自定义下拉菜单**

创建 `src/components/shared/variableMenu.ts`：

```typescript
// wangeditor v5 自定义下拉菜单：insertVariableMenu
// 注册后出现在工具栏，点击展开变量列表，选择后插入变量标记

export function registerVariableMenu(
  getVariables: () => { name: string; label: string; type: string }[],
  getVarType: (name: string) => string | undefined,
): void;

export function insertVariableBadge(editor: IDomEditor, varName: string): void;
```

关键设计：
- 变量以带样式的 badge 形式插入（`<span class="tpl-variable-badge" data-var="userName">${userName}</span>`）
- 用户点击 badge 时高亮显示变量名
- 变量名从变量面板自动获取，不依赖手动输入
- 保留原有 `handleInsertVariable` 的 click 插入方式作为备用

**4.3 修改文件**

| 文件 | 改动 |
|------|------|
| `src/components/shared/variableMenu.ts` | **新建** - wangeditor 自定义菜单 + badge 插入 |
| `src/components/shared/index.ts` | 导出 variableMenu |
| `doctemplate/DocumentTemplateDesigner.vue` | 集成 registerVariableMenu + insertVariableBadge |
| `emailtemplate/EmailTemplateDesigner.vue` | 同上 |
| `doctemplate/constants.ts` | toolbarKeys 添加 `insertVariable` 菜单 key |
| `emailtemplate/constants.ts` | 同上 |

---

### Phase 5：共享 composables + 编辑器增强

**5.1 提取共享 composable**

从 DiagramCanvas.vue 和 PdfCanvas.vue 中提取通用功能：

| Composable | 功能 | 提取自 |
|-----------|------|--------|
| `useContextMenu.ts` | 右键菜单状态管理 + 显示/隐藏/定位 | DiagramCanvas + PdfCanvas |
| `useCanvasShortcuts.ts` | 键盘快捷键（Delete/Ctrl+Z/Y/C/X/V/A/D/方向键/Escape） | PdfCanvas |
| `useBoxSelect.ts` | 框选状态管理 + 矩形计算 + 命中测试 | DiagramCanvas + PdfCanvas |

放置于 `src/components/shared/composables/` 目录。

**5.2 ETL 画布增强**

为 `EtlCanvas.vue` 添加：
- 右键上下文菜单（复制/删除/上移/下移/查看属性）
- 键盘快捷键（Delete 删除节点/边，Ctrl+Z/Y 撤销重做）
- 框选支持

**5.3 Whiteboard 画布增强**

`WbCanvas.vue` 已有框选和快捷键，无需大改。考虑添加右键菜单。

---

### Phase 6：i18n 完整更新

添加所有新功能的 i18n 键：

| 前缀 | 数量 | 用途 |
|------|------|------|
| `api.chain.insertBefore/insertAfter/deleteStep/moveUp/moveDown` | ~10 | API 编排右键菜单 |
| `pdf.context.*` / `pdf.ctx.*` | ~11 | PDF 右键菜单 |
| `doctemplate.variable.insertVariable` | ~3 | 变量插入菜单 |
| `emailtemplate.variable.insertVariable` | ~3 | 变量插入菜单 |
| `etl.context.*` | ~6 | ETL 右键菜单 |

---

## 执行优先级

1. **Phase 2**（API 编排器重设计）- 用户最强烈的需求，影响最大
2. **Phase 1**（图标统一补全）- 基础工作，影响所有模块的视觉一致性
3. **Phase 3**（PDF 完善工具栏 + 自动布局）- 功能完善
4. **Phase 4**（变量下拉插入）- 用户体验改善
5. **Phase 5**（共享 composables）- 架构改善，可延后
6. **Phase 6**（i18n）- 随各 Phase 同步更新

## 验证步骤

每个 Phase 完成后：
1. 检查 TypeScript 编译无错误
2. 验证 ShSvgIcon 在暗色主题下正确显示
3. 验证右键菜单在画布空白处和元素上分别正确显示
4. 验证快捷键在输入框聚焦时不触发
5. 验证框选矩形在缩放状态下正确计算坐标
6. 验证 API 编排器流程图连接线正确渲染
7. 验证变量 badge 在 wangeditor 中正确插入和显示
