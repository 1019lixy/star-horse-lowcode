# checkmatrix 点检矩阵组件

`field.type = "checkmatrix"` 的**字段组件**（非容器），用于巡查表/首件确认表等点检类表单的高效录入。检查分组（一组/两组/三组…）由**通用数据源**（preps.values 静态 / preps.apiDataSource 动态，与 select 完全对齐）提供，值存于单一 `dataForm[fieldName]`。

- **独立成块渲染**：checkmatrix 注册于 INDEPENDENT_FIELD_TYPES（form_utils.ts，registerIndependentFieldType 可扩展），wrapDefaultContainer 不将其包进 descriptions——整表字段需完整宽度与自然高度，descriptions 内容单元格约束会导致表格塌陷；dynamicform addComponentWithShell 同步对齐（拖入即独立块）
- **PC 端**：三态表格（sticky 表头/冻结列、分组 rowspan、OK/NG/NA 单击循环、键盘 1/2/3/0、点列头整列填 OK、点行号整行循环切换 空→OK→NG→NA、NG 行红底、noteText 缺点定义渲染为表格最后一行跨全列）
- **APP 端**：分组卡片 + 底部抽屉按块填写（暂存模式，确认才写回表单），支持整组批量 OK；字段组件天然走 APP 扁平化渲染链路（appItem→StarHorseItem→checkmatrix-item），无需容器保留分支

## 文件结构

| 文件 | 职责 |
|---|---|
| `src/components/formcomp/items/checkmatrix-item.vue` | 字段组件壳（formcomp/items 自动注册，`type=checkmatrix` 由 StarHorseItem 约定派发；按 isMobile 切换 PC/APP 渲染；值初始化） |
| `src/components/comp/checkmatrix/useCheckMatrixState.ts` | 纯 TS 状态机（mergeRule/三态/批量/统计/校验/明细展开/快照），可独立 import |
| `src/components/comp/checkmatrix/CheckMatrixTable.vue` | PC 三态表格 |
| `src/components/comp/checkmatrix/CheckMatrixMobile.vue` | APP 分组卡片 |
| `src/components/comp/checkmatrix/CheckMatrixDrawer.vue` | APP 底部抽屉（暂存+确认写回） |

## 数据结构

```ts
{
  label: "稽核结果",                  // FieldInfo 标准 label,配 preps.hideLabel 隐藏
  fieldName: "dipCheckMatrix",        // 单一字段承载全部检查结果
  type: "checkmatrix",
  preps: {
    // ===== 数据源(与 select 等组件完全对齐,不自造配置) =====
    // 静态: values = [{name: 分组标题, value: 检查项数组|JSON字符串}]
    values: [
      {name: "插件", value: JSON.stringify([
        {content: "上线的物料符合 SOP 或 BOM 表要求", freq: "2H/次", mergeRule: "every2h"},
      ])},
    ],
    // 动态: apiDataSource(设计器 DataSourceConfigPanel 配置,proxy/dataPath/dataCode 等通用规则)
    // ===== 渲染参数 =====
    matrixTitle: "DIP IPQC巡查表 · 稽核结果",
    columnModel: "triState",           // triState | rowEdit
    timeSlots: [ {label: "8:00-10:00", sub: "20:00-22:00"}, ... ],
    editColumns: [ ... ],              // rowEdit 模式列定义
    showRemark: true,
    allowKeyboard: true,
    hideLabel: true,                   // 通用 label 隐藏(PC+APP)
  },
}
```

加载链路: `compDynamicData(field)`(star_horse_utils 统一数据源) → `parseCheckGroups`(useCheckMatrixState 导出):
- name → 分组标题;value → 检查项,适配数组对象/JSON 字符串/单对象三种形态
- 单项字段适配 content(兼容 name/label/text 别名)、freq、mergeRule、id
- 一组/两组/三组由数据源条目数量决定

值结构(存于 `dataForm[fieldName]`,key 与解析后检查项一一对应,模板增删项不影响已有数据回填):

```ts
// triState 模式
{ rows: { "g1_i1": { results: ["OK","NG","","OK","",""], remark: "" } } }
// rowEdit 模式
{ rows: { "g1_i1": { values: { checkTime: "...", judge: "OK" }, remark: "" } } }
```

## 容器参数（CheckMatrixPreps，存于字段 preps）

| 参数 | 类型 | 默认 | 说明 |
|---|---|---|---|
| matrixTitle | string | "" | 矩阵标题条（蓝竖线样式），空则不渲染 |
| columnModel | "triState" \| "rowEdit" | "triState" | 三态矩阵模式 / 行式录入模式（首件表） |
| timeSlots | CheckTimeSlot[] | 无(必配) | 时段列定义，label=白班时段，sub=夜班时段（表头第二行小字） |
| editColumns | CheckEditColumn[] | 无 | rowEdit 模式列定义：key(值键)/label/type(input\|number\|date\|select)/width/values(select选项) |
| showRemark | boolean | true | 是否显示备注尾列 |
| allowKeyboard | boolean | true | PC 键盘快捷键（1=OK 2=NG 3=NA 0=清空 空格=循环） |
| fillColumnOnHeaderClick | boolean | true | 点列头时段整列填 OK |
| fillRowOnIndexClick | boolean | true | 点行号整行按本项备选项循环,行内所有格一致时序号格显示聚合状态色 |
| maxHeight | string | "calc(100vh - 300px)" | 表格滚动区最大高度 |
| options | CheckOption[] \| string | 内置默认 | 容器级默认备选项;检查项 options 优先 |
| noteText | string | "" | 说明文字（缺点定义等）:PC 端渲染为表格最后一行跨全列,APP 端渲染为末尾说明卡片 |
| remarkPlaceholder | string | "备注" | 备注输入占位符 |
| itemColumnWidth | number | 320 | 检查内容列显式宽度(px)。table-layout:fixed 下未显式设宽的列会被其余固定列挤压、长文本折行过多导致行高过高；表格本身不设 width 仅设 min-width:100%，容器较窄时按列宽总和撑开横向滚动，容器较宽时拉伸至 100% |
| slotColumnWidth | number | 84 | 时段列/三态结果列宽度(px) |

## 快捷键（按配置动态生成，非固定 1/2/3/0）

快捷键映射完全由当前检查项的备选项决定：**键数 = 非空选项数 + 1（0 固定为“空”）**
- 默认 空/OK/NG/NA → `0` 空、`1` OK、`2` NG、`3` NA（4 键）
- 配 `T:对,F:错` → `0` 空、`1` 对、`2` 错（3 键）
- 配 3 项（空/合格/不合格/不适用）→ `0` 空、`1` 合格、`2` 不合格、`3` 不适用（4 键）

两种作用粒度（更高效地设置行或单元格）：
- **选中单元格**（单击稽核格）→ 数字键设置**该格**
- **选中行号**（单击行号）→ 数字键设置**整行**（行号格高亮为选中态）
- `空格`：按目标粒度循环切换选项

表格上方有**实时提示条**（`allowKeyboard !== false` 时显示），按配置列出按键映射与名称；未选中时提示“单击稽核格选中后,按数字键直接设置”，选中后显示“当前: 检查内容 · 时段 = 值”（行模式显示“整行 · 内容 = 值”）。

## 备选项配置（不硬编码，每项可不同）

每个检查项的单元格取值完全由配置驱动：**不同检查项语义可不同**（A 项可配 OK/NG，B 项可配 T/F）。

- **检查项级**：数据源 item 上加 
  - 数组：（或 name/value 顺序互换）
  - 字符串：（逗号/分号分隔，；单段无冒号则 value=name）
  - 不含"空"项时，选项按钮/批量按钮就只有配置的类别（如只有对/错 → 只有 全对/全错）
- **容器级**： 作为缺省（检查项未配 options 时生效），设计器"默认备选项"字段可填
- **内置兜底**：双双缺省时使用 空/OK/NG/NA（显示同名）

行为：单元格显示配置的 ；单击按本项备选项顺序循环；抽屉选项与"全X"批量按钮按当前行配置渲染；键盘 1/2/3 对应第 1/2/3 个非空项；颜色按选项序号（opt-1 绿/opt-2 红/opt-3 橙/opt-4 蓝/opt-5 紫）。

## 国际化（i18n）

组件内全部界面文案走 `i18n("checkmatrix.*")`（zh_CN / en_US 双语），不在组件内硬编码中文：

| key | 说明 |
|---|---|
| checkmatrix.project / item / freq / remark | 表头：项目 / 检查内容 / 稽核频率 / 备注 |
| checkmatrix.empty | 默认"空"选项文案 |
| checkmatrix.rowCycleTip / fillColumnTip | 行号、列头操作提示 |
| checkmatrix.noGroups | 数据源无有效分组时的占位提示 |
| checkmatrix.cancel / confirm | 抽屉按钮 |
| checkmatrix.fillAllPrefix / groupBatchPrefix | "全X" / "整组X" 批量按钮前缀（X 取配置的选项名） |
| checkmatrix.tapToFill | 卡片"点击填写" |
| checkmatrix.blockWhole / blockFirstHalf / blockSecondHalf / blockSlot / blockGroup | 抽屉块标签；带参 key 为**函数型**（i18n 字符串型不支持占位符，`i18n(key, ...args)` 会执行函数） |

## 参数对齐（与 dynamicform 设计器一一对应）

| shplugin preps | 设计器配置项 | 说明 |
|---|---|---|
| matrixTitle | 矩阵标题 | 直接对应 |
| columnModel | 列模型 | triState / rowEdit |
| timeSlotCount | 时段列数 | **设计器配数字**，shplugin 经 `resolveTimeSlots(preps)` 按标准 2H 模板生成完整 timeSlots（白班 8:00 起 + 夜班 20:00 起）；亦可直接配 `timeSlots` 数组覆盖 |
| options | 默认备选项 | 字符串 `"OK:OK,NG:NG,NA:NA"` 或留空 |
| showRemark / allowKeyboard | 显示备注列 / 键盘快捷键 | 开关 |
| fillColumnOnHeaderClick / fillRowOnIndexClick | 点列头整列填充 / 点行号整行循环 | 开关 |
| itemColumnWidth / slotColumnWidth | 检查内容列宽 / 时段列宽 | 数字(px) |
| maxHeight / remarkPlaceholder | 表格最大高度 / 备注占位提示 | 输入 |
| noteText | 底部说明文字 | 输入 |
| editColumns | 行式录入列配置 | **设计器以 JSON 字符串配置**，shplugin 经 `resolveEditColumns(preps)` 解析为数组 |
| — | 数据源(values/dict/第三方) | 复用 DataSourceConfigPanel，产出 `preps.values` / `preps.apiDataSource`（检查项级 options 写在数据源条目 value 内） |

## 表单区块顺序（与 Excel 排版一致）

巡查表/首件表的推荐顺序（`preps.dataIndex` 控制 APP 端拍平排序）：

```
descriptions 基础信息(1) → checkmatrix 稽核矩阵(10) → table 问题点&改善记录(20) → html 缺点定义说明(30，最末)
```

缺点定义/填写说明**不内嵌在矩阵里**，而是用既有 `html` 类型字段独立成块排最后：`{type:"html", preps:{staticData:true, textContent:"..."}}`（组件内的 `noteText` 仍可用作矩阵内说明，按需选择其一，避免重复）。

## 检查项合并规则（CheckGroupItem.mergeRule）

| mergeRule | 语义 | 合并块（6 时段） |
|---|---|---|
| twoPerShift | 每班2次 | [0-2] [3-5] 两块 |
| every2h | 2H/次 | 6 独立格 |
| every4h | 4H/次 | [0-1] [2-3] [4-5] 三块 |
| onceAll | 开班/每季度 | 整行 1 块 |

未识别规则按每格独立处理。`freq` 仅展示用，实际合并由 `mergeRule` 决定。

## 提交存储（主表+明细子表）

用 `expandCheckRows(value, rows, preps)` 展开为明细行数组，每检查项一行：

```ts
[{ itemId, groupTitle, content, freq, mergeRule, results, values, remark }]
```

主表只存头部字段（工单/客户/机型等）+ 单个矩阵字段，明细走 relationTables。

## 状态机 API（useCheckMatrixState.ts 独立导出）

| 函数 | 用途 |
|---|---|
| buildRenderRows(groups) / parseCheckGroups(values) | 数据源解析为分组 / 分组展开为渲染行 |
| ensureCheckValue(value, rows, preps) | 初始化值对象与各行值行 |
| setSlotResult / setBlockResult | 写单格/单块 |
| fillAllResults / fillColumnResults / fillRowResults | 批量填充 |
| getCheckStats / rowHasNg | 统计/NG标记 |
| validateCoverage | 未填格数校验 |
| expandCheckRows | 提交明细展开 |
| snapshotCheckData / restoreCheckData | 复制上次记录 |
| getMergeBlocks / nextCycleState / KEY_MAP / getBlockLabel | 合并块/三态循环/键盘映射/块标签 |

## 设计器（dynamicform）配置

- 物料区：`formItems.ts` checkmatrix **字段组件**条目（矩阵标题/列模型/时段列数/备注列/键盘/说明文字）
- 数据源：**复用既有 DataSourceConfigPanel**（白名单已加 checkmatrix），配置体验与 select 完全一致——静态 values / 字典 / 第三方接口
- 静态配置格式：选项 name=分组标题，value=检查项 JSON 字符串 `[{content,freq,mergeRule}]`
- 运行时：字段组件，走通用字段链路（PC 与 APP 均自动渲染），数据源走 compDynamicData 统一加载

## sample 验证

`npm run serve` → 左侧菜单"质量系统表单"：
- `/quality/inspection` 点检矩阵（DIP/SMT/TEST IPQC巡查表 + SMT/DIP/TEST点胶首件确认表，6 表切换）
- `/quality/document` 单据审批（异常反馈单/停线整改通知单/返工通知书，descriptions 容器）
- `/quality/ledger` 台账统计（IPQC问题一览/过程首件一览/点胶抽查/检出率考核，StaticTable）