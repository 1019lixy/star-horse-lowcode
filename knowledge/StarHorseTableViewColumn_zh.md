# StarHorseTableViewColumn 表格列组件

## 概述
StarHorseTableViewColumn 是一个表格列组件，用于在表格中显示格式化的数据。它支持多种数据类型（如选择框、复选框、单选框、日期等）的自动格式化显示。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| batchName | String | 否 | "" | 批量数据名称 |
| item | Object | 是 | - | 列配置项 |
| commonFormat | Function | 是 | - | 通用格式化函数 |

## Events

无特定事件。

## 方法

无公开方法。

## 数据结构

### 列配置项 (item)
```typescript
interface ColumnItem {
  fieldName: string;        // 字段名
  hideName?: string;        // 隐藏字段名
  label: string;            // 列标题
  type: string;             // 字段类型(select/checkbox/radio/date/datetime等)
  formVisible?: boolean;    // 表单中是否可见
  listVisible?: boolean;    // 列表中是否可见
  viewVisible?: boolean;    // 查看时是否可见
  minWidth?: number;        // 最小宽度
}
```

## 使用示例

```vue
<template>
  <el-table :data="tableData">
    <star-horse-table-view-column
      v-for="column in columns"
      :key="column.fieldName"
      :item="column"
      :commonFormat="commonFormat"
    />
  </el-table>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', gender: '1', birthday: '1990-01-01' },
  { id: 2, name: '李四', gender: '2', birthday: '1992-05-15' }
])

const columns = ref([
  {
    fieldName: 'name',
    label: '姓名',
    type: 'input',
    listVisible: true
  },
  {
    fieldName: 'gender',
    label: '性别',
    type: 'select',
    listVisible: true
  },
  {
    fieldName: 'birthday',
    label: '出生日期',
    type: 'date',
    listVisible: true
  }
])

const commonFormat = (property, value, row) => {
  // 通用格式化处理
  if (property === 'gender') {
    return value === '1' ? '男' : '女'
  }
  return value
}
</script>
```

## 注意事项

1. 组件会根据 [item.type] 自动格式化显示数据
2. 支持选择框、复选框、单选框类型的数据自动转换为标签显示
3. 支持日期和日期时间类型的自动格式化
4. 可通过 [commonFormat] 属性提供自定义格式化函数
5. 列的可见性通过 [formVisible]、[listVisible]、[viewVisible] 控制