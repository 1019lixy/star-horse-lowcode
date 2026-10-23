# StarHorseFormList 的 APP 端卡片渲染

表单内子表（`containerType: "table"` → `tableItem` → `StarHorseFormTable` → `StarHorseFormList`）在 APP 端不再使用 PC 的 `el-table` 表格风格，改为**移动端卡片列表**。

## 结构

> APP 端卡片 = 一行数据 + **可直接录入的全部字段控件**；PC 端保持表格（行内编辑）。

| 文件 | 职责 |
|---|---|
| `src/components/comp/StarHorseFormList.vue` | 子表宿主：`isMobile` 分流（PC → el-table；APP → 卡片组件），持有全部增删改逻辑 |
| `src/components/comp/StarHorseFormListApp.vue` | **APP 端卡片列表**（纯渲染 + 交互分发，不含业务逻辑） |
| `src/components/comp/ShTableListColumn.vue` | 字段渲染：`staticColumn="N"` 可编辑（el-form-item + 控件）、`"Y"` 只读展示 |

## APP 端交互（卡片列表）

- **卡片**：头部（主色序号圆标 + 首个字段值作概览 + 常驻操作按钮，浅底分隔）+ 属性区（该行全部字段的 label/value 网格）
- **卡片内直接渲染输入控件（可编辑录入，非只读展示）**：属性区把该行全部字段渲染为 `el-form-item` + 字段控件（走 `ShTableListColumn` 的 `staticColumn="N"` 分支，与 PC 行内编辑同一代码路径），校验/联动一致；label 由表单 label-position 决定（APP 端纵向）
- **操作按钮常驻**：卡片头部右侧固定显示 编辑 / 删除 / 添加子项（`enableSubNode` 时）——表单录入需高频增删改；点击卡片仅高亮选中，不影响按钮显隐
- **新增**：底部虚线"添加数据 / 加一行"按钮（`source != 3` 时显示）
- **无限级子节点**：`children` 缩进递归渲染（左侧竖线 + 虚线子卡片，序号 `N.M`）
- **空数据**：显示"暂无数据"
- **字段值格式化完全共用** `ShTableListColumn`（不重复实现编码转名字/日期/开关文案）

## 增删改逻辑复用（不重复实现）

| 交互 | 处理（`StarHorseFormList.vue`） |
|---|---|
| 新增 | `appHandleAdd` → `dynamicHandleAddForm(null, "add")`（移动端统一弹窗新增，不做行内编辑） |
| 编辑 | `appHandleEdit` → `dynamicHandleAddForm(row, "edit")` → `mergeData` 校验后写回 |
| 删除 | `appHandleRemove` → **按行对象引用定位**（`indexOf`）删除 + 重排 `xh`；PC 端仍用原 `dynamicHandleAddRow`（依赖 `xh`）不变 |
| 子节点增删改 | 复用 `addSubData` / `editSubData` / `removeSubData` |

PC 端逻辑完全未改动（`el-table` 分支 + 原处理函数），仅新增 APP 分支。

## 说明

- 桌面端 `isMobile` 判定见 `src/api/device.ts`（UA 定设备 + 窗口宽度定布局，断点 768）；PC 浏览器可用 demo 页的 `?layout=mobile` 调试入口验证 APP 端。
- i18n：复用既有 key（`ui.edit` / `ui.deleteRow` / `ui.addData` / `ui.addRow` / `table.noData` / `ui.serialNumber`），未新增文案。