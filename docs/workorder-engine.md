# 工单号生成引擎（Workorder Engine）

一套**纯 TypeScript、无 Vue 依赖**的企业级单号生成方案，可被任意前端程序独立引用。支持可插拔段模型、任意进制流水号、灵活日期位数、左/右填充、长度校验、可注入存储、溢出策略等。

## 设计目标

| 目标 | 实现 |
| --- | --- |
| 可独立引用 | 纯 TS 模块，位于 `src/utils/workorder/`，不依赖 Vue/Element Plus |
| 配置驱动 | 单号 = 多段拼接，每段按类型独立产出，配置可序列化、可由后端下发 |
| 可插拔段 | 5 种段类型：static / date / sequence / field / random |
| 任意进制 | 流水号支持 2-62 进制，字符集 `0-9a-zA-Z` |
| 灵活日期 | `YYYY/YY/MM/M/DD/D/HH/H/mm/m/ss/s`，年两位或四位、月日不补零或补零 |
| 填充方向 | 左填充 / 右填充 |
| 长度校验 | 期望长度 + 不一致策略（报错/截断/填充） |
| 存储可注入 | localStorage / 内存 / 自定义实现，序列键带命名空间 |
| 溢出策略 | 重置 / 报错 / 扩位，BigInt 精确判断 |
| 类型严谨 | 全量具体类型定义，非泛型 Map |

## 模块结构

```
src/utils/workorder/
  WorkorderTypes.ts   类型定义
  dateFormatter.ts    日期格式化
  seqFormatter.ts     流水号格式化（进制 + 填充 + 溢出）
  seqStorage.ts       序列存储（Local/Memory/可注入）
  validator.ts        配置校验 + 长度校验
  generator.ts        生成引擎（编排 + 模板解析）
  index.ts            统一导出
```

## 快速上手

```ts
import { generateWorkorder } from "@/utils/workorder";

const result = generateWorkorder({
  segments: [
    { type: "static", value: "GD" },
    { type: "date", format: "YYYYMMDD" },
    { type: "sequence", length: 5, radix: 10, fillChar: "0", fillSide: "left" },
  ],
});
// result.value → "GD2026091200001"
// result.success → true
```

类式 API（多次生成共享配置）：

```ts
import { WorkorderGenerator } from "@/utils/workorder";

const gen = new WorkorderGenerator({ segments: [/* ... */] });
if (!gen.isValid()) console.error(gen.validate());
const r = gen.generate({ fields: { deptCode: "A01" } });
```

## 段类型详解

每段共享基础属性：`type`、`name?`（诊断用）、`optional?`（产出为空时跳过）。

### static — 静态文本

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `string` | 固定文本，如前缀 `"GD"`、连接符 `"-"` |

### date — 日期段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `format` | `string` | 格式串，见下方 token 表 |

**日期 token（大小写敏感）**

| token | 含义 | 示例产出 |
| --- | --- | --- |
| `YYYY` | 4 位年 | `2026` |
| `YY` | 2 位年 | `26` |
| `MM` | 2 位月（补零） | `09` |
| `M` | 月不补零 | `9` |
| `DD` | 2 位日（补零） | `12` |
| `D` | 日不补零 | `5` |
| `HH` | 2 位时 24h（补零） | `08` |
| `H` | 时不补零 | `8` |
| `mm` | 2 位分（补零） | `05` |
| `m` | 分不补零 | `5` |
| `ss` | 2 位秒（补零） | `09` |
| `s` | 秒不补零 | `9` |

例：`"YY-M-D"` → `26-9-5`；`"YYYYMMDD"` → `20260912`。

### sequence — 流水号段

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `length` | `number` | — | 位数（必填，正整数） |
| `radix` | `number` | `10` | 进制 2-62，字符集 `0-9a-zA-Z` |
| `fillChar` | `string` | `"0"` | 填充字符 |
| `fillSide` | `"left"\|"right"` | `"left"` | 填充方向 |
| `start` | `number` | `1` | 起始值（十进制） |
| `minValue` | `number` | `start` | 数值下限，低于则拒绝生成 |
| `maxValue` | `number` | `radix^length - 1` | 数值上限，超过则触发溢出策略 |
| `overflowStrategy` | `"reset"\|"error"\|"expand"` | `"reset"` | 溢出策略 |
| `seqKey` | `string` | 命名空间 | 序列键，区分不同流水号空间 |

**进制字符集**：`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`（62 个）。`radix=16` 取前 16 个即 `0-9a-f`；`radix=36` 取 `0-9a-z`。

**溢出策略**：
- `reset`：回到 `start` 重新计数，提示告警。
- `error`：生成失败（`success=false`）。
- `expand`：不填充，原样输出突破位数。

溢出判断用 **BigInt** 精确计算 `radix^length - 1`，避免大进制大位数超 `Number.MAX_SAFE_INTEGER` 误判。

### field — 字段引用段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `fieldName` | `string` | 从运行时 `context.fields` 取值的键 |
| `transform` | `"upper"\|"lower"\|"none"` | 大小写转换 |
| `maxLength` | `number` | 超长截断长度 |
| `truncateSide` | `"left"\|"right"` | 截断方向，默认 `right`（保留左侧） |

### random — 随机段

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `length` | `number` | — | 长度（必填） |
| `charset` | `string` | 按 radix | 自定义字符集，覆盖 radix |
| `radix` | `number` | `36` | charset 未配时取字符集前 radix 个 |

使用 `crypto.getRandomValues`（不可用时回退 `Math.random`），用于防猜测/补熵。

## 引擎配置（WorkorderConfig）

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `segments` | `WorkorderSegment[]` | — | 段序列（必填） |
| `separator` | `string` | `""` | 段间连接符 |
| `expectedLength` | `number` | — | 期望总长度，配置后启用长度校验 |
| `lengthMismatchStrategy` | `"error"\|"truncate"\|"pad"` | `"error"` | 长度不一致策略 |
| `lengthAdjustSide` | `"left"\|"right"` | `"right"` | 对齐方向（截断保留左侧/填充补到右侧） |
| `lengthAdjustChar` | `string` | `"0"` | 对齐填充字符 |
| `seqNamespace` | `string` | `"default"` | 默认序列命名空间 |
| `category` | `string` | — | 类别预设名，配置后可从预设库加载默认规则 |

## 运行时上下文（WorkorderContext）

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `fields` | `Record<string, any>` | 业务字段值，供 field 段引用 |
| `storage` | `WorkorderSeqStorage` | 序列存储，不配用默认 localStorage |
| `now` | `Date` | 注入时间，不配用 `new Date()`，便于测试/服务端同源 |

## 生成结果（WorkorderGenerateResult）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `success` | `boolean` | 是否成功 |
| `value` | `string` | 单号 |
| `segments` | `SegmentResult[]` | 各段产出诊断 |
| `sequenceValues` | `Record<string, number>` | 各序列键本次发放的十进制数值 |
| `warnings` | `string[]` | 告警（溢出、长度调整等） |
| `error` | `string?` | 失败原因 |

## 序列存储（WorkorderSeqStorage）

```ts
interface WorkorderSeqStorage {
  get(key: string): number | null;
  set(key: string, value: number): void;
  next(key: string, start: number): number;  // 原子递增
  reset(key: string): void;
}
```

内置实现：
- `LocalSeqStorage`：localStorage，浏览器多标签共享，同步原子递增（JS 单线程 + localStorage 同步）。
- `MemorySeqStorage`：内存 Map，测试/非浏览器环境。
- `createDefaultSeqStorage()`：自动选择，localStorage 不可用回退内存。

**自定义存储**：实现 `WorkorderSeqStorage` 接口即可注入（如 IndexedDB、SQLite WASM、后端同步存储）。

```ts
import { generateWorkorder, MemorySeqStorage } from "@/utils/workorder";

const storage = new MemorySeqStorage();
const r = generateWorkorder(config, { storage });
```

## 模板解析（parseTemplateSegments）

把格式化字符串快速转为段数组：

| 占位符 | 段类型 |
| --- | --- |
| `{{date:格式}}` | date |
| `{{field:字段名}}` / `{{form:字段名}}` | field |
| 其余文本 | static |

```ts
import { parseTemplateSegments } from "@/utils/workorder";

parseTemplateSegments("GD-{{date:YYYYMMDD}}-{{field:deptCode}}");
// → [static("GD-"), date(YYYYMMDD), static("-"), field(deptCode)]
```

## 校验 API

```ts
import { validateWorkorderConfig, WorkorderGenerator } from "@/utils/workorder";

const errors = validateWorkorderConfig(config);  // 空数组表示通过
// 或
const gen = new WorkorderGenerator(config);
gen.isValid();   // boolean
gen.validate();  // string[]
```

校验内容：segments 非空、各段参数合法（sequence.length>0、radix 2-62、fillChar 非空、date.format 非空、field.fieldName 非空、random.length>0）、expectedLength 正整数、pad 策略下 lengthAdjustChar 非空。

## 企业级完整示例

### 36 进制流水号 + 右填充 + 字段引用 + 长度校验

```ts
import { generateWorkorder } from "@/utils/workorder";

const result = generateWorkorder(
  {
    segments: [
      { type: "static", value: "WO" },
      { type: "date", format: "YYMM" },           // 2609
      { type: "field", fieldName: "deptCode", transform: "upper", maxLength: 3 },
      { type: "sequence", length: 4, radix: 36, fillChar: "0", fillSide: "right", seqKey: "wo-repair" },
      { type: "random", length: 2, radix: 36 },
    ],
    separator: "-",
    expectedLength: 20,
    lengthMismatchStrategy: "pad",
    lengthAdjustSide: "right",
    lengthAdjustChar: "0",
  },
  { fields: { deptCode: "a01" } },
);
// result.value 形如 "WO-2609-A01-0001-zk" 经长度对齐
// result.sequenceValues["wo-repair"] → 1
```

### 16 进制流水号、溢出报错

```ts
generateWorkorder({
  segments: [
    { type: "static", value: "HEX" },
    { type: "sequence", length: 3, radix: 16, overflowStrategy: "error", seqKey: "hex-seq" },
  ],
});
// 流水号 0~FFF(4095)，超出即 success=false
```

### 在任意前端程序中独立使用（无 Vue）

```ts
// 任意 .ts 文件
import { generateWorkorder, MemorySeqStorage } from "@/utils/workorder";

export function makeOrderNo(bizKey: string, storage = new MemorySeqStorage()) {
  return generateWorkorder(
    {
      segments: [
        { type: "static", value: "ORD" },
        { type: "date", format: "YYYYMMDD" },
        { type: "sequence", length: 6, radix: 10, seqKey: bizKey },
      ],
    },
    { storage },
  ).value;
}
```

## 单人不重复说明

- 序列存储键 = `seqKey`（段配置）或 `seqNamespace`。
- `LocalSeqStorage` 的完整 localStorage 键 = `shplugin:workorder:seq:{seqKey}`。
- 调用方应把业务键 + 用户标识拼入 `seqKey`（如 `repair:u1001`），即可保证同一浏览器内单人单业务流水号严格递增不重复。
- 跨设备/跨浏览器不共享本地存储；需全局唯一请接入后端存储或自定义同步存储实现。

## 与 workorder-item 组件的关系

`workorder-item.vue` 组件内部调用本引擎：把简化 preps 映射为 `WorkorderConfig`，`fixedPart` 经 `parseTemplateSegments` 拆段，`cacheKey + 用户ID` 作为 `seqKey`。组件仅做配置映射与 Tag 展示，生成逻辑全部由引擎承担，可被其它程序直接复用。

### 组件配置项（formExtendItems.ts）

**基础属性（category 1）**：

| fieldName | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `prefix` | input | `"WO"` | 前缀 |
| `fixedPart` | input | `"{{date:YYYYMMDD}}"` | 固定部分模板，支持 `{{date:格式}}` / `{{field:字段名}}` 占位符 |
| `fixedPartPosition` | select | `"between"` | 固定部分位置：`start`（最前）/ `between`（前缀后）/ `end`（末尾） |
| `seqLength` | number | `4` | 流水号位数 |
| `copyable` | switch | `true` | 是否可点击复制 |

**高级属性（category 2）**：

| fieldName | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `seqRadix` | number | `10` | 进制 2-62 |
| `overflowStrategy` | select | `"reset"` | 溢出策略：reset / error / expand |

### 前端 / 后端生成模式

组件通过 `preps.dataSource` 判断生成模式（与 select-item.vue 等组件使用相同的数据源体系）：

- **前端模式**（默认）：`dataSource` 未配置或为 `"data"` → 调用前端引擎 `generateWorkorder` 生成，流水号存 localStorage。
- **后端模式**：`dataSource` 为 `"url"` / `"thirdParty"` 或存在 `preps.apiDataSource` → 调用 `dynamicUrlOperation`（复用 `@/api/star_horse_utils` 既有基础设施），经 `/system-config/redirect/apiLinkage` 代理请求后端接口，从响应中提取单号。
- **后端失败回退**：后端调用失败时自动回退到前端生成并告警提示。

后端接口配置通过设计器的**数据源配置面板**（DataSourceConfigPanel）完成，与 select 等组件配置方式完全一致，无需单独的后端 URL 输入框。
## 类别预设（Category Presets）

按类别生成单号：传入类别名即可使用内置规则，无需手写段配置。未知类别回退通用 `serial` 规则并告警。

### 内置类别

| 类别 | 命名空间 | 规则 | 示例产出 |
| --- | --- | --- | --- |
| `serial` | serial | 6 位十进制流水号 | `000001` |
| `student` | student | S + 2 位年 + 4 位流水号 | `S260001` |
| `workorder` | workorder | WO + YYYYMMDD + 4 位流水号 | `WO202609120001` |
| `order` | order | ORD + YYYYMMDD + 6 位 36 进制流水号 | `ORD20260912000001` |
| `contract` | contract | HT + YYYYMMDD + 4 位流水号 | `HT202609120001` |
| `invoice` | invoice | FP + YYYYMM + 6 位流水号 | `FP202609000001` |

### API

```ts
import { generateByCategory, registerCategoryPreset, listCategoryPresets } from "@/utils/workorder";

// 按类别生成
const result = generateByCategory("student", { fields: { deptCode: "CS" } });
// result.value → "S260001"

// 覆盖预设规则
const result2 = generateByCategory("workorder", {
  config: { separator: "-", expectedLength: 20, lengthMismatchStrategy: "pad" },
});
// 在预设基础上追加 separator 和长度校验

// 注册自定义类别
registerCategoryPreset("device", {
  segments: [
    { type: "static", value: "DEV" },
    { type: "date", format: "YYYYMMDD" },
    { type: "sequence", length: 5, radix: 10, fillChar: "0", fillSide: "left" },
  ],
  seqNamespace: "device",
});

// 列出所有已注册类别
listCategoryPresets(); // ["serial", "student", "workorder", "order", "contract", "invoice", "device"]
```

### 覆盖规则

`generateByCategory(category, overrides)` 中 `overrides.config` 的字段会覆盖预设：
- `segments` 非空则整体替换预设段。
- 其余字段（`separator`/`expectedLength`/`seqNamespace` 等）非空则覆盖。

## 后端对接

前端引擎与后端 Java 实现（`id-generator` + `devops-utils`）规则完全一致，支持前后端同源生成。

### 后端接口

| 接口 | 方法 | 说明 |
| --- | --- | --- |
| `/idGenerate/generate` | POST | 按配置生成单号 |
| `/idGenerate/generateByCategory` | POST | 按类别生成单号 |
| `/idGenerate/categories` | GET | 列出所有已注册类别预设 |
| `/idGenerate/registerCategory` | POST | 注册自定义类别预设 |

请求体（`WorkorderGenerateRequest`）：

```json
{
  "category": "student",
  "config": { "segments": [...], "separator": "-" },
  "fields": { "deptCode": "A01" },
  "useRedis": true
}
```

- `useRedis = true`（默认）：使用 Redis 存储保证多实例下流水号连续性（Lua 原子 INCR）。
- `useRedis = false`：使用内存存储，仅单实例有效。

后端返回 `Result<WorkorderGenerateResult>`，其中 `data` 结构与前端 `WorkorderGenerateResult` 一致。