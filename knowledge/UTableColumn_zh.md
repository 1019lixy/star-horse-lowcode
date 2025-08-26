# UTableColumn 表格列组件

## 概述
UTableColumn 是一个表格列组件，基于 Element Plus 的 el-table-column 实现，支持批量数据处理和自定义列内容。

## Props

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| item | Object | 是 | - | 列配置项 |
| rules | Object | 否 | - | 表单验证规则 |
| staticColumn | String | 否 | "Y" | 是否为静态列 |
| size | String | 否 | Config.compSize | 组件大小 |
| batchName | String | 否 | "batchDataList" | 批量数据名称 |
| primaryKey | String/Object | 否 | - | 主键字段 |
| source | Number | 否 | 1 | 数据源标识 |

## 使用示例

```vue
<template>
  <u-table-column
    :item="columnConfig"
    :rules="formRules"
    :size="componentSize"
    :batch-name="batchDataName"
    :primary-key="primaryKeyField"
    :source="dataSourceId"
  />
</template>

<script setup>
import UTableColumn from '@/components/comp/items/UTableColumn.vue'

const columnConfig = {
  fieldName: 'name',
  label: '姓名',
  minWidth: 120,
  formVisible: true,
  type: 'input'
}

const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
}

const componentSize = 'small'
const batchDataName = 'batchDataList'
const primaryKeyField = 'id'
const dataSourceId = 1
</script>
```

## 特性

1. 支持批量数据处理
2. 自动过滤不需要显示的字段类型（divider, button, usercomp）
3. 支持自定义列内容渲染
4. 集成表单验证规则
5. 支持不同的数据源标识