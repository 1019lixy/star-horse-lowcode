# WorkorderItem 工单号生成组件

## 组件用途

`workorder-item`（组件名 `WorkorderItem`）用于在表单中**自动生成并展示工单号**，以 `el-tag` 形式呈现，点击可复制。支持两种生成模式：

- **前端生成**：调用 [`@/utils/workorder`](../../workorder-engine.md) 引擎，按可插拔段规则在本地拼接，流水号经 `localStorage` 缓存递增，保证同一业务键下单人单号不重复。
- **后端获取**：按可配置请求条件调用后端接口取号（后端驱动优先）。

组件位于 `src/components/formcomp/items/workorder-item.vue`，经表单渲染器以 `itemType: "workorder"` 自动映射（`<component :is="itemType + '-item'" />`）。**生成逻辑全部由引擎承担**，组件仅做配置映射与 Tag 展示，引擎可被其它前端程序独立复用。

## 渲染结构

```
<starhorse-form-item>          ← 表单项容器（标签/校验/帮助）
  <el-tag>工单号</el-tag>       ← Tag 展示，点击复制
</starhorse-form-item>
```

## 配置参数（field.preps）

所有参数**可选**，未配置时使用默认值（兜底）。

### 生成模式与展示

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `generateMode` | `"frontend" \| "backend"` | `"frontend"` | 生成模式。 |
| `copyable` | `boolean` | `true` | 点击 Tag 是否可复制。 |
| `tagType` | `string` | `"primary"` | Tag 类型：`primary`/`success`/`info`/`warning`/`danger`。 |
| `tagEffect` | `string` | `"light"` | Tag 效果：`light`/`dark`/`plain`。 |
| `tagSize` | `string` | `"default"` | Tag 尺寸：`large`/`default`/`small`。 |
| `tagMap` | `Record<string, string>` | `{}` | 值 → Tag 类型映射，优先于 `tagType`。 |
| `placeholder` | `string` | `""` | 未生成时占位文案。 |

### 前端生成规则（映射为引擎段）

| 参数 | 类型 | 默认值 | 引擎段 | 说明 |
| --- | --- | --- | --- | --- |
| `prefix` | `string` | `"WO"` | static | 前缀。 |
| `fixedPart` | `string` | `"{{date:YYYYMMDD}}"` | 解析为多段 | 固定位，支持模板（见下）。 |
| `fillChar` | `string` | `"0"` | sequence.fillChar | 流水号填充字符（取首字符）。 |
| `fillSide` | `"left" \| "right"` | `"left"` | sequence.fillSide | 填充方向。 |
| `seqLength` | `number` | `4` | sequence.length | 流水号位数。 |
| `seqRadix` | `number` | `10` | sequence.radix | 流水号进制 2-62，字符集 `0-9a-zA-Z`。 |
| `seqStart` | `number` | `1` | sequence.start | 流水号起始值。 |
| `overflowStrategy` | `"reset" \| "error" \| "expand"` | `"reset"` | sequence.overflowStrategy | 溢出策略。 |
| `cacheKey` | `string` | `field.fieldName` | sequence.seqKey | 缓存业务键（组件自动拼接用户 ID）。 |

### 长度校验

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `expectedLength` | `number` | — | 期望总长度，配置后启用校验。 |
| `lengthMismatchStrategy` | `"error" \| "truncate" \| "pad"` | `"error"` | 长度不一致策略。 |
| `lengthAdjustSide` | `"left" \| "right"` | `"right"` | 对齐方向。 |
| `lengthAdjustChar` | `string` | `"0"` | 对齐填充字符。 |

### 后端获取

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `backendUrl` | `string` | `""` | 后端地址（`generateMode="backend"` 时必填）。 |
| `backendParams` | `BackendParam[]` | `[]` | 后端请求条件参数。 |
| `backendDataPath` | `string` | `"data"` | 返回数据取值路径，支持点路径如 `data.workorderNo`。 |
| `fallbackToFrontend` | `boolean` | `true` | 后端失败是否回退前端生成。 |

### BackendParam 结构

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `paramName` | `string` | 请求参数名。 |
| `paramValue` | `string` | 值。`valueType="form"` 时为表单字段名（运行时从 `formData` 取）；`"static"` 时为静态值。 |
| `valueType` | `"static" \| "form"` | 值来源。 |

### fixedPart 模板占位符

| 占位符 | 含义 | 示例 |
| --- | --- | --- |
| `{{date:格式}}` | 当前日期按格式化 | `{{date:YYYYMMDD}}` → `20260912`；`{{date:YY-M-D}}` → `26-9-5` |
| `{{form:字段名}}` / `{{field:字段名}}` | 取 `formData` 字段值 | `{{form:deptCode}}` → 表单 deptCode 值 |
| 其它文本 | 原样输出 | `FX` → `FX` |

日期格式 token 详见 [引擎文档](../../workorder-engine.md#日期-token大小写敏感)。

## 工单号拼接规则

组件把 preps 映射为引擎 `WorkorderConfig`：

```
segments = [ static(prefix), ...parseTemplateSegments(fixedPart), sequence(...) ]
工单号 = 各段以 separator(默认空) 拼接 → 长度校验/对齐
```

- 流水号按 `seqRadix` 进制生成，`fillSide` 方向用 `fillChar` 填充至 `seqLength` 位。
- 溢出按 `overflowStrategy` 处理（`reset` 重置/`error` 失败/`expand` 原样）。
- 生成后若配 `expectedLength`，按 `lengthMismatchStrategy` 校验/对齐。

示例：`prefix=GD`、`fixedPart={{date:YYYYMMDD}}`、`seqRadix=36`、`seqLength=4`、`fillSide=left`、`fillChar=0`、首次 → `GD202609120001`（36 进制 1 = "1"）。

## 前端缓存策略（单人不重复）

- 序列存储：`LocalSeqStorage`（localStorage）。
- seqKey = `${cacheKey}:${userId}`（`userId` 取 `getUserInfo().idUsersinfo`，未登录回退 `anonymous`）。
- 完整 localStorage 键 = `shplugin:workorder:seq:${cacheKey}:${userId}`。
- 同步原子递增，单人在同一浏览器内严格递增不重复。
- 溢出按 `overflowStrategy` 处理。

> 跨设备/跨浏览器不共享本地存储；需全局唯一请用后端模式。

## 后端获取策略

1. 按 `backendParams` 构造参数（`valueType="form"` 从 `formData` 取值）。
2. `postRequest(backendUrl, params)` 请求。
3. 按 `backendDataPath` 点路径提取工单号。
4. 失败按 `fallbackToFrontend` 决定是否回退前端生成。

## 生成时机与回显

- `onMounted` 触发生成。
- **回显优先**：`formData[fieldName]` 已有值则直接展示，不重新生成。
- 设计模式（`isDesign`）不生成；`generating` 标记防重复触发。

## 点击复制

点击 Tag 触发 `copyText`（`navigator.clipboard`），成功/失败自带提示。`copyable=false` 禁用。点击同时触发 `change` 联动。

## 兜底方案汇总

| 场景 | 兜底 |
| --- | --- |
| 未配 `prefix` | `"WO"` |
| 未配 `fixedPart` | `"{{date:YYYYMMDD}}"` |
| 未配 `fillChar` | `"0"` |
| 未配 `fillSide` | `"left"` |
| 未配 `seqLength` | `4` |
| 未配 `seqRadix` | `10` |
| 未配 `seqStart` | `1` |
| 未配 `overflowStrategy` | `"reset"` |
| 未配 `cacheKey` | `field.fieldName` |
| 未配 `generateMode` | `"frontend"` |
| `seqRadix` 越界 | 回退 `10` |
| 后端失败 | 按 `fallbackToFrontend` 决定 |
| 流水号溢出 | 按 `overflowStrategy` |
| 未登录用户 | seqKey 用户段回退 `anonymous` |

## 设计器接入

`dynamicform` 项目 `src/components/system/items/form/composables/formExtendItems.ts` 已注册 `itemType: "workorder"`，`category: 3`。

- **基本配置（category=1）**：生成模式、前缀、固定位、填充字符、流水号位数、流水号起始值、缓存业务键、**进制、填充方向、溢出策略**。
- **高级配置（category=2）**：后端地址/条件参数/数据路径/失败回退、是否可复制、Tag 类型/效果/尺寸/映射、**期望长度/长度不一致策略/对齐方向/对齐字符**、占位提示。

## 国际化

- 组件内文案：`item.workorder*`（`shplugin/src/lang`）。
- 设计器配置文案：`dyform.extend.402~435`（`dynamicform/src/lang`）。

## 使用示例

### 36 进制流水号 + 右填充

```json
{
  "fieldName": "workOrderNo",
  "itemType": "workorder",
  "label": "工单号",
  "preps": {
    "prefix": "GD",
    "fixedPart": "{{date:YYYYMMDD}}",
    "seqLength": 4,
    "seqRadix": 36,
    "fillChar": "0",
    "fillSide": "right",
    "cacheKey": "gd-repair"
  }
}
```

### 后端获取 + 长度校验

```json
{
  "fieldName": "workOrderNo",
  "itemType": "workorder",
  "label": "工单号",
  "preps": {
    "generateMode": "backend",
    "backendUrl": "/workorder/generate",
    "backendParams": [
      { "paramName": "bizType", "paramValue": "repair", "valueType": "static" },
      { "paramName": "projectId", "paramValue": "projectId", "valueType": "form" }
    ],
    "backendDataPath": "data.workorderNo",
    "fallbackToFrontend": true,
    "expectedLength": 20,
    "lengthMismatchStrategy": "pad",
    "lengthAdjustSide": "right",
    "lengthAdjustChar": "0",
    "prefix": "GD",
    "fixedPart": "{{date:YYYYMMDD}}",
    "seqLength": 5,
    "cacheKey": "gd-repair"
  }
}
```

## 相关文档

- [工单号生成引擎](../../workorder-engine.md) — 纯 TS 引擎，可被任意前端程序独立引用。
