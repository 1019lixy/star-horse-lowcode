# StarHorseStaticTable 静态表格

静态数据表格组件，不接受接口配置，仅展示传入的数据列表。

## 基础用法

```vue
<template>
  <StarHorseStaticTable
    primaryKey="id"
    :fieldList="pageFieldInfo"
    :dataList="tableData"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| primaryKey | `string \| object` | **是** | — | 主键字段名 |
| fieldList | `object` | **是** | — | 字段配置 |
| dataFormat | `Function` | 否 | `null` | 单元格格式化函数 |
| compSize | `string` | 否 | `'default'` | 组件尺寸 |
| dialogInput | `boolean` | 否 | `false` | 是否弹窗输入模式 |
| height | `string` | 否 | `'100%'` | 表格高度 |
| expand | `boolean` | 否 | `false` | 是否默认展开 |
| showBatchField | `boolean` | 否 | `false` | 是否显示批量属性列 |
| allowSelectParent | `boolean` | 否 | `true` | 是否允许选择父节点 |
| title | `string` | 否 | — | 表格标题 |
| dataList | `Array` | 否 | — | 表格数据 |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| getIds | — | `any[]` | 获取选中行的主键数组 |
| setData | `(data: any)` | `void` | 设置表格数据 |

---

# StarHorseTableColumn 表格列

表格列组件，用于自定义列表中的列渲染。

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| apiEndpoints | `ApiUrls` | 否 | — | 接口地址配置 |
| subTableName | `string` | 否 | `''` | 批量数据 Key |
| item | `FieldInfo` | **是** | — | 字段配置 |
| dataFormat | `Function` | **是** | — | 格式化函数 |
| cellEditable | `boolean` | 否 | `true` | 是否可编辑单元格 |
| globalConfig | `object` | 否 | — | 全局配置 |
| isDynamic | `boolean` | 否 | `false` | 是否动态页面 |
| showBatchField | `boolean` | 否 | `false` | 是否显示批量属性 |
| sortable | `boolean` | 否 | `true` | 是否可排序 |
| compSize | `string` | 否 | `'default'` | 组件尺寸 |
| source | `number` | 否 | `5` | 数据来源标识 |
| commonFormat | `Function` | 否 | `() => {}` | 格式化函数 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| focusEvent | `(_column: any)` | 单元格获取焦点时触发 |
| blurEvent | `(column: any, params: any)` | 单元格失去焦点时触发 |

---

# ShTableListColumn 列表表格列

静态列表中的表格列组件。

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| dataForm | `object` | **是** | — | 行数据 |
| index | `object` | **是** | — | 行索引 |
| item | `object` | **是** | — | 字段配置 |
| staticColumn | `string` | 否 | `'Y'` | 是否静态列 |
| primaryKey | `string \| object` | 否 | — | 主键字段名 |
| subTableName | `string` | 否 | `'subDataList'` | 批量数据 Key |
| rules | `object` | 否 | — | 校验规则 |
| size | `string` | 否 | `'default'` | 组件尺寸 |
| source | `number` | 否 | `1` | 数据来源标识 |
