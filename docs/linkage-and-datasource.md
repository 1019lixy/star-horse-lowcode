# 联动策略与数据源

本文档详细说明组件库的联动策略（ItemRelation）和数据源（ApiLinkageDetail）机制，这是框架的核心能力之一。

## 概述

联动策略允许一个字段的变化自动影响其他字段的显隐、禁用、必填、选项数据等。配置在 `field.preps.dataRelation` 中。

```ts
// 联动配置示例
{
  fieldName: 'type',
  preps: {
    dataRelation: {
      actionName: 'change',
      relationDetails: [
        {
          controlCondition: 'eqHide',
          relationFields: ['detailField'],
          matchType: 'eq',
          matchFieldName: 'type',
          matchFieldValue: ['1'],
          params: {},
          staticDatas: [],
          isWorking: false,
        }
      ]
    }
  }
}
```

## 联动配置结构

### ItemRelation 联动对象

配置在 `field.preps.dataRelation` 中。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| actionName | `string` | 是 | 触发联动的事件名称，常用值：`'change'`、`'input'`、`'blur'` |
| relationDetails | `RelationDetail[]` | 否 | 简单联动策略详情（与 apiLinkage 二选一） |
| apiLinkage | `ApiLinkageDetail` | 否 | 第三方接口联动（与 relationDetails 二选一） |

> **注意**：`relationDetails` 和 `apiLinkage` 二选一。如果 `relationDetails` 存在且非空，优先使用；否则走 `apiLinkage`。当 `source === 3`（查看模式）时，`apiLinkage` 不执行。

---

## 简单联动 — RelationDetail

### controlCondition 联动类型

| 值 | 说明 | 目标属性 | 取反 | 属性位置 |
|---|---|---|---|---|
| `eqHide` | 匹配时**隐藏**目标字段 | `formVisible = false` | 否 | field |
| `eqVisible` | 匹配时**显示**目标字段 | `formVisible = true` | 否 | field |
| `eqDisable` | 匹配时**禁用**目标字段 | `disabled = true` | 否 | field.preps |
| `eqEditable` | 匹配时**可编辑**目标字段 | `disabled = false` | 是 | field.preps |
| `eqRequired` | 匹配时**必填**目标字段 | `required = true` | 否 | field |
| `eqUnRequired` | 匹配时**非必填**目标字段 | `required = false` | 是 | field |
| `eqConditionDataLinkage` | 条件数据联动（用匹配值过滤） | 赋值选项数据 | — | — |
| `asParamDataLinkage` | 参数数据联动（将值作为查询参数） | 赋值选项数据 | — | — |
| `assignValue` | 静态赋值 | 赋值到字段 | — | — |
| `changeType` | 改变字段类型 | 修改 field.type | — | — |

### RelationDetail 字段说明

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| controlCondition | `string` | 是 | 联动类型，见上表 |
| relationFields | `string \| string[]` | 是 | 受影响的目标字段名（可以是数组） |
| matchType | `string` | 是 | 匹配方式，见下表 |
| matchFieldName | `string` | 是 | 用于 `asParamDataLinkage` 时的参数属性名 |
| matchFieldValue | `string[] \| string` | 是 | 触发联动的字段值（数组形式） |
| params | `RedirectParams` | 是 | 数据联动时的接口参数 |
| staticDatas | `SelectOption[] \| any` | 是 | `assignValue` 时的静态数据 / `changeType` 时的新类型名 |
| isWorking | `boolean` | 是 | 防止重入标记，通常设为 `false` |

### matchType 匹配方式

| 值 | 说明 |
|---|---|
| `eq` / 默认 | 当前字段值包含在 matchFieldValue 中（`includes`） |
| `llk` | 当前字段值以 matchFieldValue 开头（`startsWith`） |
| `rlk` | 当前字段值以 matchFieldValue 结尾（`endsWith`） |
| `neq` / `nlk` | 当前字段值不包含 matchFieldValue |
| `lt` | 当前字段值 < matchFieldValue |
| `lte` | 当前字段值 <= matchFieldValue |
| `gt` | 当前字段值 > matchFieldValue |
| `gte` | 当前字段值 >= matchFieldValue |
| `isnull` | 当前字段值为空 |
| `notnull` | 当前字段值非空 |
| `bt` | 当前字段值在 matchFieldValue[0] ~ matchFieldValue[1] 之间 |

> **重要**：匹配判断是基于**当前触发联动字段的值**（即 `formData[fieldName]`）与 `matchFieldValue` 的比较。当字段值为数组时（如多选），只要数组中任意一个值被 matchFieldValue 包含即匹配。

### 数据联动赋值规则

`eqConditionDataLinkage` 和 `asParamDataLinkage` 获取到的数据会自动赋值到目标字段，赋值规则如下：

| 目标字段类型 | 赋值方式 |
|---|---|
| select / autocomplete / radio / checkbox | 赋值到 `field.preps.values`（选项列表） |
| tselect / transfer | 赋值到 `field.preps.data` |
| cascade | 赋值到 `field.preps.options` |
| 其他类型（对象数据） | 遍历对象 key-value，逐个赋值到 `field.preps[key]` |
| 其他类型（非对象、非数组） | 赋值到 `field.defaultValue` |

---

## 联动配置示例

### 示例1：字段显隐联动

当 `type` 为 `'1'` 时隐藏 `detailField`：

```ts
{
  fieldName: 'type',
  type: 'select',
  preps: {
    values: [{ name: '类型1', value: '1' }, { name: '类型2', value: '2' }],
    dataRelation: {
      actionName: 'change',
      relationDetails: [{
        controlCondition: 'eqHide',
        relationFields: ['detailField'],
        matchType: 'eq',
        matchFieldName: 'type',
        matchFieldValue: ['1'],
        params: {},
        staticDatas: [],
        isWorking: false,
      }]
    }
  }
}
```

### 示例2：字段禁用联动

当 `status` 为 `'approved'` 时禁用 `amount` 字段：

```ts
{
  fieldName: 'status',
  preps: {
    dataRelation: {
      actionName: 'change',
      relationDetails: [{
        controlCondition: 'eqDisable',
        relationFields: ['amount'],
        matchType: 'eq',
        matchFieldName: 'status',
        matchFieldValue: ['approved'],
        params: {},
        staticDatas: [],
        isWorking: false,
      }]
    }
  }
}
```

### 示例3：数据联动（条件过滤）

当 `category` 变化时，从接口获取 `subCategory` 的选项数据：

```ts
{
  fieldName: 'category',
  preps: {
    dataRelation: {
      actionName: 'change',
      relationDetails: [{
        controlCondition: 'eqConditionDataLinkage',
        relationFields: ['subCategory'],
        matchType: 'eq',
        matchFieldName: 'category',
        matchFieldValue: [],  // 空数组 = 任何值变化都触发
        params: {
          url: '/api/sub-category/list',
          httpMethod: 'POST',
          queryParams: [{ propertyName: 'categoryId', operation: 'eq', value: '' }],
        },
        staticDatas: [],
        isWorking: false,
      }]
    }
  }
}
```

### 示例4：数据联动（作为参数）

将当前字段值作为查询参数传递：

```ts
{
  fieldName: 'userId',
  preps: {
    dataRelation: {
      actionName: 'change',
      relationDetails: [{
        controlCondition: 'asParamDataLinkage',
        relationFields: ['orderId'],
        matchType: 'eq',
        matchFieldName: 'userId',  // 作为查询参数的属性名
        matchFieldValue: [],       // 空数组 = 任何值都触发
        params: {
          url: '/api/order/list',
          httpMethod: 'POST',
        },
        staticDatas: [],
        isWorking: false,
      }]
    }
  }
}
```

### 示例5：静态赋值

当 `level` 为 `'A'` 时，给 `score` 字段赋默认值 `100`：

```ts
{
  fieldName: 'level',
  preps: {
    dataRelation: {
      actionName: 'change',
      relationDetails: [{
        controlCondition: 'assignValue',
        relationFields: ['score'],
        matchType: 'eq',
        matchFieldName: 'level',
        matchFieldValue: ['A'],
        params: {},
        staticDatas: 100,  // 赋值内容
        isWorking: false,
      }]
    }
  }
}
```

### 示例6：改变字段类型

当 `inputType` 为 `'textarea'` 时，将 `content` 字段类型改为 `textarea`：

```ts
{
  fieldName: 'inputType',
  preps: {
    dataRelation: {
      actionName: 'change',
      relationDetails: [{
        controlCondition: 'changeType',
        relationFields: ['content'],
        matchType: 'eq',
        matchFieldName: 'inputType',
        matchFieldValue: ['textarea'],
        params: {},
        staticDatas: 'textarea',  // 新的字段类型
        isWorking: false,
      }]
    }
  }
}
```

---

## 第三方接口联动 — ApiLinkageDetail

当简单联动无法满足需求时，可通过 `apiLinkage` 配置调用第三方接口，并将返回数据自动回填到表单字段。

### ApiLinkageDetail 字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| apiMode | `'system' \| 'custom'` | 是 | 接口来源模式 |
| apiInfo | `ApiInfo` | 是 | 业务接口配置 |
| authInfo | `ApiInfo` | 否 | 认证接口配置（需要鉴权时使用） |
| fieldMappings | `FieldMapping[]` | 否 | 字段映射配置 |
| optionField | `OptionField` | 否 | 数据源显示属性配置 |
| proxyUrl | `string` | 否 | 代理接口地址（默认 `'/system-config/redirect/apiLinkage'`） |
| assignValueType | `'form' \| 'datasource'` | 否 | 赋值方式 |
| dataRelation | `ItemRelation` | 否 | 嵌套联动（用于 eventType='linkage' 或 'dataSource' 时） |

### ApiInfo 接口信息

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| url | `string` | 否 | 接口地址 |
| httpMethod | `string` | 否 | 请求方式（GET/POST/PUT/DELETE） |
| headers | `ApiParam[]` | 否 | 请求头 |
| requestParams | `ApiParam[]` | 否 | 请求参数 |
| requestDataType | `'form' \| 'json' \| 'binary'` | 否 | 请求数据类型 |
| responseTemplate | `string` | 否 | 数据返回模板 |
| messagePath | `string` | 否 | 消息路径（如 `data.msg`） |
| codePath | `string` | 否 | 编码路径 |
| dataPath | `string` | 否 | 业务数据路径 |
| successCode | `string` | 否 | 成功码 |
| protocol | `string` | 否 | 请求协议 |
| timeout | `number` | 否 | 超时时间(ms) |
| apiType | `'systemApi' \| 'thirdApi'` | 是 | 接口类型 |
| redirect | `boolean` | 否 | 是否代理（systemApi 专属） |
| method | `string` | 否 | 接口调用方法名（systemApi 专属） |
| interfaceName | `string` | 否 | 接口名称（systemApi 专属） |
| serviceName | `string` | 否 | 服务名（systemApi 专属） |

### apiMode 说明

- **`'system'`**：系统内部接口，通过 `serviceName` + `interfaceName` + `method` 调用，可配置 `redirect` 是否走代理
- **`'custom'`**：自定义接口，直接使用 `url` + `httpMethod` 调用

### 接口联动配置示例

```ts
{
  fieldName: 'productCode',
  preps: {
    dataRelation: {
      actionName: 'change',
      apiLinkage: {
        apiMode: 'custom',
        apiInfo: {
          url: 'https://api.example.com/product/detail',
          httpMethod: 'POST',
          requestDataType: 'json',
          requestParams: [
            { valueType: 'dynamic', paramName: 'code', paramValue: '${productCode}' }
          ],
          dataPath: 'data',
          successCode: '200',
          apiType: 'thirdApi',
        },
        fieldMappings: [
          { sourceField: 'name', distField: 'productName' },
          { sourceField: 'price', distField: 'unitPrice' },
        ],
        proxyUrl: '/system-config/redirect/apiLinkage',
        assignValueType: 'form',
      }
    }
  }
}
```

### 接口返回数据回填规则

接口返回的 `data` 对象，其 key-value 会直接赋值到 `formData` 中对应的字段名上。例如返回 `{ productName: '商品A', unitPrice: 99.9 }`，会自动设置 `formData.productName = '商品A'` 和 `formData.unitPrice = 99.9`。

如果配置了 `fieldMappings`，则接口返回数据中的 `sourceField` 会被映射到表单中的 `distField`。

---

## 前后缀按钮事件 — PreOrPendEventConfig

input-item 等组件支持前后缀按钮（`prependAction` / `appendAction`），每个按钮的 `actions` 字段类型为 `PreOrPendEventConfig`。

### PreOrPendEventConfig 字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| eventType | `PreOrPendEventType` | 是 | 事件类别 |
| dataRelation | `ItemRelation` | 否 | 联动策略配置（eventType = `'linkage'` 或 `'dataSource'`） |
| dataSourceConfig | `any` | 否 | 数据源配置（eventType = `'dataSource'`） |
| customCode | `string` | 否 | 自定义 JS 代码（eventType = `'custom'`） |
| funcInfo | `Function` | 否 | 自定义函数（eventType = `'function'`），参数：`(props, formData, formInfo)` |

### PreOrPendEventType 事件类型

| 值 | 说明 |
|---|---|
| `'none'` | 无事件 |
| `'linkage'` | 调用联动策略配置（触发 apiLinkageOperation） |
| `'dataSource'` | 调用数据源配置（触发 apiLinkageOperation） |
| `'custom'` | 自定义 JS 代码执行（通过 userFunction 执行） |
| `'function'` | 自定义函数，参数为 `(props, formData, formInfo)` |

### 前后缀按钮配置示例

```ts
{
  fieldName: 'phone',
  preps: {
    appendAction: [{
      actionTitle: '拨打电话',
      icon: 'phone',
      actions: {
        eventType: 'function',
        funcInfo: (props, formData, formInfo) => {
          window.open(`tel:${formData[props.field.fieldName]}`)
        }
      }
    }]
  }
}
```

---

## 联动触发时机

联动的触发有以下时机：

1. **字段值变化时**：当用户操作导致 `formData[fieldName]` 值变化时，如果该字段配置了 `field.preps.dataRelation`，联动自动触发
2. **表单初始化时**：`onMounted` 中调用 `initCompCallEvent`，如果字段有初始值，会自动触发联动
3. **初始化延迟触发**：如果字段没有初始值，会 watch 该字段，等有值后自动触发一次联动然后停止 watch
4. **source === 3 时**：查看模式下 `apiLinkage` 不执行，但 `relationDetails` 仍然执行

### 联动执行流程

```
字段值变化
    │
    ▼
relationEventDispatcher()
    │
    ├─ relationDetails 存在？
    │   │
    │   ├─ 是 → relationEvent()
    │   │         │
    │   │         ├─ eqHide / eqVisible / eqDisable / eqEditable / eqRequired / eqUnRequired
    │   │         │   → controlFieldProps() 修改目标字段属性
    │   │         │
    │   │         ├─ eqConditionDataLinkage / asParamDataLinkage
    │   │         │   → dataLinkage() 异步获取数据并赋值
    │   │         │
    │   │         ├─ assignValue
    │   │         │   → assignValue() 静态赋值
    │   │         │
    │   │         └─ changeType
    │   │             → changeType() 修改字段类型
    │   │
    │   └─ 否 → apiLinkage 存在且 source !== 3？
    │             │
    │             └─ 是 → apiLinkageOperation() 调用第三方接口回填
```
