# StarHorseTableColumn 表格列组件

## 概述
StarHorseTableColumn 是一个功能丰富的表格列组件，基于 Element Plus 的 el-table-column 实现。它支持单元格编辑、数据格式化、组件显示等多种功能，适用于复杂的数据表格场景。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| compUrl | Object | 否 | - | 组件URL配置 |
| batchName | String | 否 | "" | 批量数据名称 |
| item | Object | 是 | - | 列配置项 |
| dataFormat | Function | 是 | - | 数据格式化函数 |
| cellEditable | Boolean | 否 | true | 是否可编辑 |
| globalConfig | Object | 否 | - | 全局配置（动态页面使用） |
| isDynamic | Boolean | 否 | false | 是否为动态页面 |
| sortable | Boolean | 否 | true | 是否可排序 |
| compSize | String | 否 | Config.compSize | 组件大小 |
| source | Number | 否 | 5 | 数据来源 |

## Events

| 事件名 | 参数 | 说明 |
|-------|------|------|
| focusEvent | column: any | 单元格获得焦点时触发 |
| blurEvent | column: any, params: any | 单元格失去焦点时触发 |

## 方法

无公开方法。

## 数据结构

### 列配置项 (item)
```typescript
interface ColumnItem {
  fieldName: string;           // 字段名
  hideName?: string;           // 隐藏字段名
  label: string;               // 列标题
  type: string;                // 字段类型
  listVisible: boolean;        // 列表中是否可见
  minWidth?: number;           // 最小宽度
  preps?: object;              // 配置参数
}
```

### 组件URL配置 (compUrl)
```typescript
interface CompUrl {
  mergeUrl?: string;           // 数据合并URL
}
```

## 使用示例

```vue
<template>
  <el-table :data="tableData">
    <star-horse-table-column
      v-for="column in columns"
      :key="column.fieldName"
      :item="column"
      :dataFormat="dataFormat"
      :compUrl="compUrl"
      @focusEvent="handleFocus"
      @blurEvent="handleBlur"
    />
  </el-table>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 }
])

const columns = ref([
  {
    fieldName: 'name',
    label: '姓名',
    type: 'input',
    listVisible: true
  },
  {
    fieldName: 'age',
    label: '年龄',
    type: 'number',
    listVisible: true
  }
])

const compUrl = ref({
  mergeUrl: '/api/data/merge'
})

const dataFormat = (name, value, row) => {
  // 数据格式化处理
  return value
}

const handleFocus = (column) => {
  console.log('单元格获得焦点:', column)
}

const handleBlur = (column, params) => {
  console.log('单元格失去焦点:', column, params)
}
</script>
```

## 注意事项

1. 组件支持单元格编辑功能，通过 [cellEditable] 属性控制
2. 数据格式化通过 [dataFormat] 函数处理
3. 支持动态页面配置，通过 [isDynamic] 和 [globalConfig] 属性控制
4. 可通过 [item.preps] 配置列的显示方式和行为
5. 支持组件显示模式，通过 [item.preps.showComp] 控制