# StarHorseDataViewTable 数据查看表格组件

## 概述
StarHorseDataViewTable 是一个数据查看表格组件，用于展示批量数据的只读表格视图。它基于 Element Plus 的 el-table 实现，支持序号列、数据格式化等功能。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| item | Array/FieldInfo | 是 | - | 表格字段配置 |
| batchName | String | 是 | - | 批量数据名称 |
| compSize | String | 否 | Config.compSize | 组件大小 |
| commonFormat | Function | 是 | - | 通用数据格式化函数 |

## Events

无特定事件。

## 方法

无公开方法。

## 数据结构

### 表格字段配置 (item)
```typescript
interface TableItem {
  title: string;              // 表格标题
  fieldList: Array<any>;      // 字段列表
}
```

### 字段信息 (FieldInfo)
```typescript
interface FieldInfo {
  fieldName: string;          // 字段名
  label: string;              // 标签
  type: string;               // 类型
  // 其他字段属性...
}
```

## 使用示例

```vue
<template>
  <star-horse-data-view-table
    :item="tableConfig"
    :batch-name="batchName"
    :commonFormat="commonFormat"
    v-model:dataForm="dataForm"
  />
</template>

<script setup>
import { ref } from 'vue'

const dataForm = ref({
  userList: [
    { xh: 1, name: '张三', age: 25 },
    { xh: 2, name: '李四', age: 30 }
  ]
})

const batchName = ref('userList')

const tableConfig = ref({
  title: '用户列表',
  fieldList: [
    {
      fieldName: 'name',
      label: '姓名',
      type: 'input'
    },
    {
      fieldName: 'age',
      label: '年龄',
      type: 'number'
    }
  ]
})

const commonFormat = (name, value, row) => {
  // 通用数据格式化处理
  if (name === 'age') {
    return `${value}岁`
  }
  return value
}
</script>
```

## 注意事项

1. 组件通过 [dataForm] 双向绑定表格数据
2. 表格数据存储在 [dataForm.value[batchName]] 中
3. 自动显示序号列，字段名为 "xh"
4. 通过 [commonFormat] 函数对显示数据进行统一格式化处理
5. 支持嵌套的标签页和批量字段列表配置
6. 表格样式已预设，包括行高、字体大小、表头背景等