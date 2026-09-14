# StarHorseSearchForm 搜索表单

配置化的搜索表单组件，支持多种查询条件的自动渲染和搜索参数组装。

## 基础用法

```vue
<template>
  <StarHorseSearchForm
    :formData="searchFields"
    @searchData="onSearch"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| formData | `SearchFields` | **是** | — | 查询字段配置，详见 [SearchProps 类型](../types/search-props.md) |
| defaultCondition | `SearchParams[]` | 否 | — | 默认查询条件 |
| dialogInput | `boolean` | 否 | `false` | 是否弹窗输入模式 |
| mutComp | `boolean` | 否 | `false` | 是否多组件模式 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| searchData | `(searchDatas: SearchParams[])` | 点击查询或重置时触发 |
| initComplete | — | 初始化完成时触发 |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| searchForm | — | `Ref<any>` | 搜索表单数据（响应式引用） |
| setData | `(data: any)` | `void` | 合并设置搜索表单数据 |
| createSearchParams | `(formData: any)` | `SearchParams[]` | 根据表单数据创建搜索参数 |

## 插槽 (Slots)

| 插槽名 | 说明 |
|---|---|
| action-append | 搜索操作按钮区域后追加内容（如高级查询按钮） |

## 计算属性 (Computed)

| 属性名 | 类型 | 说明 |
|---|---|---|
| compSize | `string` | 从全局配置 store 读取 `configFormInfo.inputSize`，默认 `"default"` |

## 搜索匹配类型联动

`matchTypeChange(type, item)` 方法根据匹配类型动态修改字段配置：

| 匹配类型 | 行为 |
|---|---|
| `isnull` / `notnull` | 设 `item.preps.readonly = true`（空/非空判断不需要输入值） |
| `llk`（左模糊） | 设 `prefix = "%"`，删除 `suffix` |
| `rlk`（右模糊） | 删除 `prefix`，设 `suffix = "%"` |
| `lk`（全模糊） | 设 `prefix = "%"`、`suffix = "%"` |
| `ini` / `ins` / `in` | 将字段类型切换为 `textarea`，保存原始类型到 `item.oldType` |
| 其他 | 清除 prefix / suffix，恢复原始字段类型 |

## 关键内部方法说明

| 方法名 | 功能说明 |
|---|---|
| createSearchParams(formData) | 调用 `analysisSearchData` 将 searchForm 的值与 fieldList 转换为 `SearchParams[]` |
| analysisDefaultValue() | 遍历 formData.fieldList，提取每个字段的 defaultValue（JSON 类型展开为多个键值对） |
| dataSearch(val?) | 核心搜索方法——若 val === "reset" 则重置为默认值后搜索；否则直接构建搜索参数，追加 defaultCondition 后 emit searchData |
| matchTypeChange(type, item) | 根据匹配类型动态修改字段的 readonly / prefix / suffix / type 属性 |
| searchArea() | 切换默认搜索区域和展开搜索区域，同时切换提示文字和图标 |
| init() | 初始化：加载匹配类型列表、解析默认值、检测是否有隐藏字段以决定是否显示展开按钮 |

## source 值

此组件自身不接受 `source` prop，但传给子组件 `<star-horse-item>` 时硬编码 `source=4`，表示搜索模式。

## 使用示例

### 基本搜索

```vue
<template>
  <StarHorseSearchForm
    :formData="searchFields"
    @searchData="onSearch"
  />
</template>

<script setup lang="ts">
import type { SearchFields } from 'star-horse-lowcode'

const searchFields: SearchFields = {
  fieldList: [
    { label: '名称', fieldName: 'name', type: 'input' },
    { label: '状态', fieldName: 'status', type: 'select', preps: { values: [{ name: '启用', value: '1' }] } },
    { label: '日期', fieldName: 'createDate', type: 'date', preps: { type: 'daterange' } },
  ]
}

function onSearch(params: SearchParams[]) {
  // 将参数传给 StarHorseTableComp
  tableRef.value?.createSearchParams(params)
}
</script>
```

### 带默认条件

```vue
<StarHorseSearchForm
  :formData="searchFields"
  :defaultCondition="[{ propertyName: 'status', operation: 'eq', value: '1' }]"
  @searchData="onSearch"
/>
```

---

# StarHorseSearchComp 搜索组件

组合搜索组件，集成了简单搜索表单和高级查询构建器。

## 基础用法

```vue
<template>
  <StarHorseSearchComp
    :apiEndpoints="apiUrls"
    :formData="searchFields"
    @searchData="onSearch"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| dialogInput | `boolean` | 否 | `false` | 是否弹窗输入模式 |
| mutComp | `boolean` | 否 | `false` | 是否多组件模式 |
| apiEndpoints | `object` | 否 | — | 接口地址配置 |
| formData | `SearchFields` | **是** | — | 查询字段配置 |
| defaultCondition | `SearchParams[]` | 否 | — | 默认查询条件 |
| showAdvanced | `boolean` | 否 | `true` | 是否显示"高级查询"入口 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| searchData | `(searchDatas: SearchParams[])` | 简单查询和高级查询均触发 |
| searchOrderBy | `(orderBy: OrderByInfo[])` | 高级查询排序事件 |

## 计算属性与内部方法

StarHorseSearchComp 是 StarHorseSearchForm 与高级查询构建器的组合封装，核心逻辑委托给 StarHorseSearchForm，额外提供 `showAdvanced` 控制高级查询入口显示。
