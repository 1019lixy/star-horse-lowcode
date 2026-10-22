# checkmatrix 点检矩阵组件

`field.type = "checkmatrix"` 的**字段组件**（非容器），用于巡查表/首件确认表等点检类表单的高效录入。检查分组（一组/两组/三组…）作为数据配置于 `preps.checkGroups`，值存于单一 `dataForm[fieldName]`。

- **PC 端**：三态表格（sticky 表头/冻结列、分组 rowspan、OK/NG/NA 单击循环、键盘 1/2/3/0、点列头整列填 OK、点行号整行循环切换 空→OK→NG→NA、NG 行红底）
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
  label: "稽核结果",
  fieldName: "dipCheckMatrix",        // 单一字段承载全部检查结果
  type: "checkmatrix",
  preps: {
    matrixTitle: "DIP IPQC巡查表 · 稽核结果",
    columnModel: "triState",           // triState | rowEdit
    timeSlots: [ {label: "8:00-10:00", sub: "20:00-22:00"}, ... ],
    checkGroups: [                     // 配置进来的一组/两组/三组...
      {
        id: "g1",
        title: "插件",
        items: [
          {
            id: "g1_i1",               // 稳定标识(值行key),缺省 g序号_i序号 生成
            content: "上线的物料符合 SOP 或 BOM 表要求",
            freq: "2H/次",             // 稽核频率(展示)
            mergeRule: "every2h",      // 时段合并规则
          },
        ],
      },
    ],
    editColumns: [ ... ],              // rowEdit 模式列定义
    showRemark: true,
    allowKeyboard: true,
  },
}
```

值结构（存于 `dataForm[fieldName]`，key 与 checkGroups 展开项一一对应，模板增删项不影响已有数据回填）：

```ts
// triState 模式
{ rows: { "g1_i1": { results: ["OK","NG","","OK","",""], remark: "" } } }
// rowEdit 模式
{ rows: { "g1_i1": { values: { checkTime: "...", judge: "OK" }, remark: "" } } }
```

`preps.checkGroups` 支持数组或 JSON 字符串（设计器 textarea 配置自动解析）。

## 容器参数（CheckMatrixPreps，存于字段 preps）

| 参数 | 类型 | 默认 | 说明 |
|---|---|---|---|
| checkGroups | CheckMatrixGroup[] \| string | [] | 检查分组配置（一组/两组/三组由数组长度决定） |
| matrixTitle | string | "" | 矩阵标题条（蓝竖线样式），空则不渲染 |
| columnModel | "triState" \| "rowEdit" | "triState" | 三态矩阵模式 / 行式录入模式（首件表） |
| timeSlots | CheckTimeSlot[] | 无(必配) | 时段列定义，label=白班时段，sub=夜班时段（表头第二行小字） |
| editColumns | CheckEditColumn[] | 无 | rowEdit 模式列定义：key(值键)/label/type(input\|number\|date\|select)/width/values(select选项) |
| showRemark | boolean | true | 是否显示备注尾列 |
| allowKeyboard | boolean | true | PC 键盘快捷键（1=OK 2=NG 3=NA 0=清空 空格=循环） |
| fillColumnOnHeaderClick | boolean | true | 点列头时段整列填 OK |
| fillRowOnIndexClick | boolean | true | 点行号整行循环切换(空→OK→NG→NA),行内所有格一致时序号格显示聚合状态色 |
| maxHeight | string | "calc(100vh - 300px)" | 表格滚动区最大高度 |
| noteText | string | "" | 说明文字（缺点定义等）:PC 端渲染为表格最后一行跨全列,APP 端渲染为末尾说明卡片 |
| remarkPlaceholder | string | "备注" | 备注输入占位符 |
| itemColumnWidth | number | 320 | 检查内容列显式宽度(px)。table-layout:fixed 下未显式设宽的列会被其余固定列挤压、长文本折行过多导致行高过高；表格本身不设 width 仅设 min-width:100%，容器较窄时按列宽总和撑开横向滚动，容器较宽时拉伸至 100% |
| slotColumnWidth | number | 84 | 时段列/三态结果列宽度(px) |

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
| buildRenderRows(groups) | checkGroups 展开为渲染行（生成稳定 key） |
| ensureCheckValue(value, rows, preps) | 初始化值对象与各行值行 |
| setSlotResult / setBlockResult | 写单格/单块 |
| fillAllResults / fillColumnResults / fillRowResults | 批量填充 |
| getCheckStats / rowHasNg | 统计/NG标记 |
| validateCoverage | 未填格数校验 |
| expandCheckRows | 提交明细展开 |
| snapshotCheckData / restoreCheckData | 复制上次记录 |
| getMergeBlocks / nextCycleState / KEY_MAP / getBlockLabel | 合并块/三态循环/键盘映射/块标签 |

## 设计器（dynamicform）配置

- 物料区：`formItems.ts` checkmatrix **字段组件**条目（矩阵标题/列模型/时段列数/备注列/键盘/说明文字 + 高级区 checkGroups JSON）
- checkGroups 为 JSON 数组文本：`[{title, items:[{content, freq, mergeRule}]}]`，一组/两组/三组由数组长度决定
- 运行时：字段组件，走通用字段链路（PC 与 APP 均自动渲染），无容器特殊分支

## sample 验证

`npm run serve` → 左侧菜单"质量系统表单"：
- `/quality/inspection` 点检矩阵（DIP/SMT/TEST IPQC巡查表 + SMT/DIP/TEST点胶首件确认表，6 表切换）
- `/quality/document` 单据审批（异常反馈单/停线整改通知单/返工通知书，descriptions 容器）
- `/quality/ledger` 台账统计（IPQC问题一览/过程首件一览/点胶抽查/检出率考核，StaticTable）