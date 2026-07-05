# 内部机制

本文档说明组件库的核心内部机制，理解这些机制对于正确配置和使用组件至关重要。

## 1. prepsFilter — 属性透传机制

### 核心原理

所有表单项组件通过 `v-bind="prepsFilter(field.preps)"` 将 `field.preps` 中的属性透传给底层的 Element Plus 组件。这意味着 **`field.preps` 中除了框架内部使用的属性外，其余属性会直接传递给对应的 el-xxx 组件**。

```vue
<!-- input-item.vue 中 -->
<el-input v-bind="prepsFilter(field.preps)" v-model="normalData" />

<!-- select-item.vue 中 -->
<el-select v-bind="prepsFilter(field.preps)" v-model="formData[field.fieldName]" />
```

### prepsFilter 处理逻辑

`prepsFilter` 函数会做以下处理：

1. **移除空值属性**：值为 `undefined`、`null`、`""`、`NaN` 的属性会被删除（只读属性除外）
2. **字符串布尔值转换**：`"true"` → `true`，`"false"` → `false`
3. **返回处理后的对象**，供 `v-bind` 使用

### 框架内部使用的 preps 属性（不会透传给 Element Plus）

以下属性被框架内部消费，虽然也会出现在 preps 对象中，但它们**不会**被 Element Plus 识别为有效 prop：

| 属性名 | 使用组件 | 说明 |
|---|---|---|
| `values` | select/radio/checkbox/autocomplete | 选项数据，由组件内部渲染为 el-option |
| `data` | tselect/transfer/tree-select | 数据源 |
| `options` | cascade | 级联选项数据 |
| `dataSource` | select/datapicker | 数据源类型标识 |
| `dataRelation` | 所有表单项 | 联动策略配置 |
| `formula` | input/number/textarea | 公式计算配置 |
| `prefixIcon` / `prefix` | input | 前缀图标/文字，由组件内部渲染到 #prefix 插槽 |
| `suffixIcon` / `suffix` | input | 后缀图标/文字，由组件内部渲染到 #suffix 插槽 |
| `prependText` / `prependAction` | input | 前置内容，由组件内部渲染到 #prepend 插槽 |
| `appendText` / `appendAction` | input | 后置内容，由组件内部渲染到 #append 插槽 |
| `appendList` / `prependList` | input | 前后缀下拉选项列表 |
| `mergePrefix` / `mergeAppend` | input | 是否合并前后缀到字段值 |
| `preName` / `appName` | input | 前后缀字段名 |
| `prependDefaultValue` / `appendDefaultValue` | input | 前后缀默认值 |
| `showFooter` | select/cascade/tselect | 是否显示底部添加选项区 |
| `needSplitName` | date | 范围选择时是否拆分到 Start/End 字段 |
| `disableDate` | date | 禁用日期配置 |
| `multipleSelect` | datapicker | 是否多选 |
| `urlOrDictName` | datapicker | URL 或字典名 |
| `queryParams` | datapicker | 查询参数 |
| `prop.label` / `prop.value` | datapicker | 显示/值属性名 |
| `iconType` / `placement` / `listView` | icon | 图标选择器配置 |
| `compName` | dialog/drawer/usercomp | 动态组件名 |
| `fieldList` | dialog/drawer/page-select/dialog-input | 弹窗内字段列表 |
| `viewType` | button | 操作类型 |
| `selectLabel` | autocomplete | 远程搜索标签属性名 |
| `radioType` | radio | 样式类型 |
| `tagType` / `tagMap` / `placeholder` | tag/input-tag | 标签配置 |
| `assignType` | image | 赋值方式 |
| `context` | upload/image | 上下文路径 |
| `minName` / `maxName` / `splitName` | number-range | 范围字段名 |
| `descItems` | description | 描述项数组 |
| `stopInitCallAction` | 所有表单项 | 阻止初始化时调用 actions |
| `starHorseFieldSource` | 所有表单项 | 字段来源标识 |

### 如何使用 Element Plus 原生属性

由于 `v-bind="prepsFilter(field.preps)"` 的透传机制，你只需在 `field.preps` 中添加 Element Plus 组件支持的任何属性即可：

```ts
// input-item 支持 el-input 的所有属性
{
  fieldName: 'name',
  type: 'input',
  preps: {
    placeholder: '请输入姓名',     // el-input 的 placeholder
    maxlength: 50,                  // el-input 的 maxlength
    clearable: true,                // el-input 的 clearable
    showWordLimit: true,            // el-input 的 showWordLimit
    size: 'large',                  // el-input 的 size
    validateEvent: true,            // el-input 的 validateEvent
  }
}

// select-item 支持 el-select 的所有属性
{
  fieldName: 'status',
  type: 'select',
  preps: {
    values: [{ name: '启用', value: '1' }],
    placeholder: '请选择状态',     // el-select 的 placeholder
    clearable: true,                // el-select 的 clearable
    multiple: true,                 // el-select 的 multiple
    collapseTags: true,             // el-select 的 collapseTags
    collapseTagsTooltip: true,      // el-select 的 collapseTagsTooltip
    filterable: true,               // el-select 的 filterable
    allowCreate: true,              // el-select 的 allowCreate
    defaultFirstOption: true,       // el-select 的 defaultFirstOption
  }
}
```

> **重要提示**：框架内部使用的属性（如 `values`、`dataRelation`）即使写在 preps 中也不会冲突，因为它们要么被组件内部消费，要么 Element Plus 不识别会自动忽略。

---

## 2. FormulaEngine — 公式计算引擎

公式引擎支持在字段值变化时自动计算并回填结果。配置在 `field.preps.formula` 或 `field.formula` 中。

### FormulaConfig 配置

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| enable | `boolean` | 是 | — | 是否启用 |
| type | `FormulaType` | 是 | — | 公式类型 |
| sourceFields | `string[]` | 是 | — | 依赖字段列表，值变化时触发计算 |
| expression | `string` | 否 | — | 公式表达式，使用 `${fieldName}` 引用字段值 |
| branches | `ConditionBranch[]` | 否 | — | 条件分支（type=condition） |
| lookupMappings | `LookupMapping[]` | 否 | — | 联动回填映射（type=lookup） |
| precision | `number` | 否 | — | 精度 |
| prefix | `string` | 否 | — | 前缀（如 '¥'） |
| suffix | `string` | 否 | — | 后缀（如 '元'、'%'） |
| dateUnit | `'year'\|'month'\|'day'\|'hour'\|'minute'\|'second'` | 否 | — | 日期单位 |
| dateMode | `'diff'\|'offset'\|'format'` | 否 | — | 日期计算模式 |
| dateOffset | `number` | 否 | — | 日期偏移量 |
| dateFormat | `string` | 否 | — | 日期输出格式 |
| formatType | `'thousands'\|'padStart'\|'toFixed'\|'regex'` | 否 | — | 格式化子类型 |
| formatArg | `string \| number` | 否 | — | 格式化参数 |
| formatArg2 | `string` | 否 | — | 格式化参数2 |
| aggregateField | `string` | 否 | — | 聚合子字段名 |
| defaultValue | `any` | 否 | — | 条件不匹配时的默认值 |

### 8 种公式类型

#### 1. calc — 数学运算

```ts
{
  fieldName: 'totalPrice',
  preps: {
    formula: {
      enable: true,
      type: 'calc',
      sourceFields: ['price', 'quantity'],
      expression: '${price} * ${quantity}',
      precision: 2,
      suffix: '元',
    }
  }
}
// 支持所有 JS 数学运算：+ - * / %，以及 Math 对象方法
// '${field1} + ${field2} - ${field3}'     → 混合运算
// 'Math.round(${a} / ${b} * 100) / 100'   → 除法保留2位
// '${amount}' + prefix: '¥'                → 金额前缀
```

#### 2. concat — 字符串拼接

```ts
{
  fieldName: 'fullName',
  preps: {
    formula: {
      enable: true,
      type: 'concat',
      sourceFields: ['lastName', 'firstName'],
      expression: '${lastName}${firstName}',
    }
  }
}
// '订单号：${orderNo}'                      → 带固定文本
// '联系人：${name}，电话：${phone}'          → 混合拼接
```

#### 3. condition — 多分支条件判断

```ts
{
  fieldName: 'level',
  preps: {
    formula: {
      enable: true,
      type: 'condition',
      sourceFields: ['score'],
      branches: [
        { when: '${score} >= 90', then: '优秀' },
        { when: '${score} >= 60', then: '及格' },
      ],
      defaultValue: '不及格',
    }
  }
}
// then 支持：常量值、${fieldName} 字段引用、含 ${fieldName} 的拼接字符串
```

#### 4. lookup — 联动回填

```ts
{
  fieldName: 'productCode',
  preps: {
    formula: {
      enable: true,
      type: 'lookup',
      sourceFields: ['productCode'],
      lookupMappings: [
        { key: 'P001', values: { productName: '商品A', price: 99.9 } },
        { key: 'P002', values: { productName: '商品B', price: 199.9 } },
      ],
    }
  }
}
// 根据 sourceFields[0] 的值匹配 key，将 values 中的字段回填到 formData
```

#### 5. aggregate — 聚合运算

```ts
{
  fieldName: 'totalAmount',
  preps: {
    formula: {
      enable: true,
      type: 'aggregate',
      sourceFields: ['items'],       // 子表单数据字段（数组）
      aggregateField: 'amount',       // 子表单中要聚合的字段
      expression: 'sum',              // sum/avg/count/min/max
      precision: 2,
    }
  }
}
```

#### 6. dateCalc — 日期计算

```ts
// diff 模式：计算两个日期差值
{
  fieldName: 'days',
  preps: {
    formula: {
      enable: true,
      type: 'dateCalc',
      sourceFields: ['startDate', 'endDate'],
      expression: '${startDate} ~ ${endDate}',
      dateUnit: 'day',
      dateMode: 'diff',
    }
  }
}

// offset 模式：日期偏移
{
  fieldName: 'deadline',
  preps: {
    formula: {
      enable: true,
      type: 'dateCalc',
      sourceFields: ['createDate'],
      expression: '${createDate}',
      dateMode: 'offset',
      dateOffset: 7,
      dateUnit: 'day',
      dateFormat: 'YYYY-MM-DD',
    }
  }
}

// format 模式：日期格式化
{
  fieldName: 'formattedDate',
  preps: {
    formula: {
      enable: true,
      type: 'dateCalc',
      sourceFields: ['rawDate'],
      expression: '${rawDate}',
      dateMode: 'format',
      dateFormat: 'YYYY-MM-DD',
    }
  }
}
```

#### 7. format — 格式化

```ts
// 千分位
{ type: 'format', sourceFields: ['amount'], formatType: 'thousands' }
// 1234567 → '1,234,567'

// 左填充
{ type: 'format', sourceFields: ['code'], formatType: 'padStart', formatArg: 6, formatArg2: '0' }
// 5 → '000005'

// 固定小数位
{ type: 'format', sourceFields: ['price'], formatType: 'toFixed', precision: 2 }
// 3.1 → '3.10'

// 正则替换
{ type: 'format', sourceFields: ['rawText'], formatType: 'regex', formatArg: '[^0-9]', formatArg2: '' }
// 'abc123' → '123'
```

#### 8. ternary — 三元表达式

```ts
{
  fieldName: 'result',
  preps: {
    formula: {
      enable: true,
      type: 'ternary',
      sourceFields: ['score'],
      expression: '${score} >= 60 ? ${score} : 0',
    }
  }
}
// '${status} == 1 ? "启用" : "禁用"'
// '${amount} > 1000 ? ${amount} * 0.9 : ${amount}'
```

---

## 3. usePrefixSuffix — 前后缀机制

input-item / password-item / autocomplete-item 等组件使用 `usePrefixSuffix` composable 处理前后缀数据与主字段值的合并和拆分。

### 工作原理

当配置了 `mergePrefix: true` 或 `mergeAppend: true` 时，输入框的实际值会由**主字段值 + 前缀字段值 + 后缀字段值**合并而成：

```
formData[field.fieldName] = 前缀值 + 主值 + 后缀值
```

- 前缀字段名：`field.preps.preName`，默认 `'pre' + field.fieldName`
- 后缀字段名：`field.preps.appName`，默认 `'app' + field.fieldName`

### field.preps 配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| mergePrefix | `boolean` | `false` | 是否启用前缀合并 |
| mergeAppend | `boolean` | `false` | 是否启用后缀合并 |
| preName | `string` | `'pre' + fieldName` | 前缀字段名 |
| appName | `string` | `'app' + fieldName` | 后缀字段名 |
| prependList | `SelectOption[]` | — | 前缀下拉选项 |
| appendList | `SelectOption[]` | — | 后缀下拉选项 |
| prependDefaultValue | `string` | — | 前缀默认值 |
| appendDefaultValue | `string` | — | 后缀默认值 |

### 使用示例

#### 前后缀下拉选择

```ts
{
  fieldName: 'phone',
  type: 'input',
  preps: {
    mergePrefix: true,
    mergeAppend: false,
    prependList: [
      { name: '+86', value: '+86' },
      { name: '+1', value: '+1' },
    ],
  }
}
// formData: { phone: '+8613800138000', prePhone: '+86' }
// 用户输入 13800138000，自动合并为 +8613800138000
```

#### 前后缀文字/图标

```ts
{
  fieldName: 'website',
  type: 'input',
  preps: {
    prependText: 'https://',
    appendText: '.com',
  }
}
// 注意：prependText/appendText 不会合并到字段值中，仅作为显示
```

---

## 4. source 数据来源的影响

`source` 参数不仅是一个标识，还会影响组件的实际行为：

| source 值 | 含义 | 行为影响 |
|---|---|---|
| 0 | 表单项组件内部 | — |
| 1 | 表单新增 | 日期格式化 watch 在 source===1 时会自动关闭（不格式化用户输入） |
| 2 | 表单编辑 | — |
| 3 | 查看视图（只读） | ① 所有字段变为禁用状态；② apiLinkage 联动不执行；③ 初始化时 actions 不调用 |
| 4 | 查询 | — |
| 5 | 列表 | 列表中的表单项不触发初始化 actions |
| 6 | 表单设计 | — |
| 7 | 页面设计 | — |

### 禁用判断逻辑

```ts
// checkIsDisabled 函数判断逻辑：
const isDisabled = 
  editDisabled === true ||                           // 编辑时禁用且非新增
  field.disabled === true ||                          // 字段显式禁用
  field.preps?.disabled === true ||                   // preps 中禁用
  (!formData['_fieldNameEditable'] && preps.disabled) || // 隐式禁用
  source === 3                                        // 查看模式全部禁用
```

---

## 5. 动态事件 — getDynamicEvents

所有表单项组件通过 `v-on="getDynamicEvents(props, itemAction, formData)"` 绑定动态事件。这意味着你在 `field.actions` 中配置的事件会自动绑定到 Element Plus 组件上。

```ts
{
  fieldName: 'name',
  type: 'input',
  actions: {
    blur: (formData) => { console.log('失焦', formData) },
    input: (formData) => { console.log('输入', formData) },
  }
}
```

> 同时，组件也会自动触发 `selfFunc` 事件（通过 `allAction`），参数为 `(actionName, currentData)`。

---

## 6. 字段禁用状态详细说明

字段的禁用状态由多个因素综合判断，优先级从高到低：

1. **source === 3**：查看模式，所有字段强制禁用
2. **field.disabled / props.disabled / field.preps.disabled**：显式禁用
3. **field.editDisabled / props.editDisabled / field.preps.editDisabled**：编辑时禁用（仅当 `starHorseFieldSource !== 1` 即非新增时生效）
4. **隐式禁用**：当 `formData['_fieldNameEditable']` 为 falsy 且 `field.preps.disabled` 为 truthy 时

可以通过在 `formData` 中设置 `_fieldNameEditable = true` 来解锁被隐式禁用的字段。
