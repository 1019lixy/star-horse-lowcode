# StarHorseDataSelector 数据选择器

数据选择器组件，支持从远程数据源或本地数据中选择数据，支持多选、标签展示等功能。

## 基础用法

```vue
<template>
  <StarHorseDataSelector
    v-model="selectedValue"
    :dataUrl="'/api/user/list'"
    :displayName="'name'"
    :displayValue="'id'"
    @change="onChange"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| modelValue | `any` | **是** | — | 绑定值，支持 `v-model` |
| selectedData | `any` | 否 | — | 已选中的数据 |
| placeholder | `string` | 否 | `i18n("api.pleaseSelectData2")` | 占位文字 |
| dataUrl | `string` | 否 | — | 远程数据接口地址 |
| proxy | `boolean` | 否 | — | 是否使用代理 |
| proxyUrl | `string` | 否 | — | 代理地址 |
| params | `SearchParams[]` | 否 | — | 查询参数 |
| data | `Array<any>` | 否 | — | 本地数据 |
| pageSize | `number` | 否 | `0` | 分页大小（0=不分页） |
| title | `string` | 否 | — | 选择器标题 |
| compSize | `string` | 否 | `'default'` | 组件尺寸 |
| displayName | `string` | 否 | `'name'` | 显示名称字段 |
| displayValue | `string` | 否 | `'value'` | 值字段 |
| multiple | `boolean` | 否 | `false` | 是否多选 |
| disabled | `boolean` | 否 | `false` | 是否禁用 |
| checkStrictly | `boolean` | 否 | `true` | 父子是否不关联 |
| selectLeaf | `boolean` | 否 | `false` | 是否只选叶子节点 |
| showTagLength | `number` | 否 | `3` | 多选时标签最大显示数量 |
| style | `CSSProperties` | 否 | — | 自定义样式 |
| tagType | `"" \| "primary" \| "secondary" \| "success" \| "info" \| "warning"` | 否 | — | 标签类型 |
| tagEffect | `"" \| "light" \| "dark" \| "plain"` | 否 | — | 标签效果 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| update:modelValue | `(modelValue: any)` | 值变化时触发 |
| update:selectedData | `(selectData: any)` | 选中数据变化时触发 |
| selectedData | `(selectData: any)` | 选中数据时触发 |
| change | `(selectData: any)` | 选择变化时触发 |

## 计算属性 (Computed)

| 属性名 | 类型 | 说明 |
|---|---|---|
| valueArr | `string[]` | 将 selectData（可能是数组或单个对象）映射为 displayValue 属性值组成的数组，用于 el-input-tag 的 v-model |

## Watch 监听

| 监听目标 | 配置 | 触发逻辑 |
|---|---|---|
| `selectData.value` | `{ deep: true }` | 深度监听选中数据变化：将 selectData 中的每个对象提取 displayValue 映射为 value（多选取数组，单选取首元素），同步到 selectedData (v-model) 并 emit change |

## 数据源联动

组件通过 `DataPicker` 子组件实现数据源联动——`dataUrl` / `proxy` / `proxyUrl` / `params` 等配置影响数据加载来源。

## 关键内部方法说明

| 方法名 | 功能说明 |
|---|---|
| openDataPicker() | 打开数据选择器弹窗（若非 disabled） |
| onClose(data) | 标签关闭回调——多选时从 selectData 和 value 中移除对应项；单选时清空全部。emit change 和 selectedData |
| init() | 初始化选中数据——若有 props.data（静态数据），使用 findNodesInTree 在树中查找已选节点；若有 dataUrl 且 value 非空，则通过 loadSelectedData 从远程加载 |
| addTag(val) | 手动添加标签——构造 `{ [displayName]: val, [displayValue]: val }` 对象，多选追加，单选替换 |
| tagVisible(val) | 查找标签的显示名称——在 selectData 中按 displayValue 匹配并返回 displayName，找不到则返回原始值 |

## 使用示例

### 单选

```vue
<StarHorseDataSelector
  v-model="userId"
  :dataUrl="'/api/user/list'"
  displayName="name"
  displayValue="id"
  @change="onUserChange"
/>
```

### 多选

```vue
<StarHorseDataSelector
  v-model="userIds"
  :dataUrl="'/api/user/list'"
  :multiple="true"
  :showTagLength="5"
  displayName="name"
  displayValue="id"
/>
```

### 使用本地数据

```vue
<StarHorseDataSelector
  v-model="selected"
  :data="localData"
  displayName="label"
  displayValue="code"
/>

<script setup>
const localData = [
  { label: '选项1', code: 'opt1' },
  { label: '选项2', code: 'opt2' },
]
</script>
```

---

# DataPicker 数据拾取器

数据拾取器弹窗组件，支持从树形/列表数据中选择数据，支持拖拽排序。

## 基础用法

```vue
<template>
  <DataPicker
    v-model="selectedValue"
    :dataUrl="'/api/data/list'"
    :title="'选择数据'"
    @dataSubmit="onSubmit"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| modelValue | `any` | **是** | — | 绑定值 |
| dataUrl | `string` | 否 | — | 远程数据地址 |
| proxy | `boolean` | 否 | — | 是否使用代理 |
| proxyUrl | `string` | 否 | — | 代理地址 |
| params | `SearchParams[]` | 否 | — | 查询参数 |
| pageSize | `number` | 否 | `0` | 分页大小 |
| data | `Array<any>` | 否 | — | 本地数据 |
| title | `string` | 否 | — | 弹窗标题 |
| compSize | `string` | 否 | `'default'` | 组件尺寸 |
| displayName | `string` | 否 | `'name'` | 显示名称字段 |
| displayValue | `string` | 否 | `'value'` | 值字段 |
| multiple | `boolean` | 否 | `false` | 是否多选 |
| checkStrictly | `boolean` | 否 | `true` | 父子是否不关联 |
| selectLeaf | `boolean` | 否 | `false` | 是否只选叶子节点 |
| autoClose | `boolean` | 否 | `true` | 选择后是否自动关闭弹窗 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| update:modelValue | `(modelValue: any)` | 值变化时触发 |
| dataSubmit | `(data: Array<any>)` | 确认选择时触发 |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| open | — | `void` | 打开选择弹窗 |
| close | — | `void` | 关闭选择弹窗 |

---

# DataTag 数据标签

数据标签展示组件。

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| data | `any` | **是** | — | 标签数据对象 |
| displayName | `string` | 否 | `'name'` | 显示名称字段 |
| displayValue | `string` | 否 | `'value'` | 值字段 |
| type | `'success' \| 'info' \| 'warning' \| 'danger'` | 否 | `'info'` | 标签类型 |
| closable | `boolean` | 否 | `false` | 是否可关闭 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| close | `(id: string)` | 关闭标签时触发 |
