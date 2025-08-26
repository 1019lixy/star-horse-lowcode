# ShTableListColumn 组件

## 概述
ShTableListColumn 是一个用于表格列表列显示的组件，支持静态列和动态表单列的显示。它可以处理不同类型的数据格式化，如日期、开关、选择框等。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| dataForm | Object | - | 必需。数据表单对象 |
| index | Object | - | 必需。索引信息 |
| item | Object | - | 必需。列配置项 |
| staticColumn | String | "Y" | 是否为静态列 |
| primaryKey | String/Object | - | 主键字段 |
| batchName | String | "batchDataList" | 批量数据名称 |
| rules | Object | - | 验证规则 |
| size | String | Config.compSize | 组件大小 |
| source | Number | 1 | 数据源 |

## 数据格式化

组件内部实现了多种数据类型的格式化显示：
- 日期/时间类型：使用 createDatetime 进行格式化
- 开关类型：将 true/false 或 "1"/"Y" 转换为 "是"/"否"
- 选择框类型：包括 select, radio, checkbox, cascader, tselect，使用 parseListData 进行格式化

## 使用示例

```vue
<template>
  <el-table :data="tableData">
    <el-table-column label="姓名">
      <template #default="{ row, $index }">
        <sh-table-list-column 
          :data-form="row" 
          :index="$index" 
          :item="nameColumnConfig" 
          static-column="Y" />
      </template>
    </el-table-column>
    
    <el-table-column label="状态">
      <template #default="{ row, $index }">
        <sh-table-list-column 
          :data-form="row" 
          :index="$index" 
          :item="statusColumnConfig" 
          static-column="Y" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
const nameColumnConfig = {
  fieldName: 'name',
  label: '姓名'
}

const statusColumnConfig = {
  fieldName: 'status',
  label: '状态',
  type: 'switch'
}

const tableData = [
  { name: '张三', status: '1' },
  { name: '李四', status: '0' }
]
</script>
```