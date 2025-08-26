# StarHorseFormTable 表单表格组件

## 概述
StarHorseFormTable 是一个表单表格组件，基于 StarHorseFormList 实现，用于在表单中显示和编辑表格数据。支持添加行、删除行、导入数据等功能。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| item | Object | 是 | - | 表格配置项 |
| rules | Object | 否 | - | 表单验证规则 |
| initRows | Number | 否 | 0 | 初始化行数 |
| size | String | 否 | Config.compSize | 组件大小 |
| source | Number | 否 | 1 | 数据来源 |

## Events

| 事件名 | 参数 | 说明 |
|-------|------|------|
| addRow | row: any | 添加行时触发 |
| removeRow | row: any | 删除行时触发 |

## 方法

无公开方法。

## 数据结构

### 表格配置项 (item)
```typescript
interface TableItem {
  compUrl?: object;              // 组件URL配置
  primaryKey?: string;           // 主键字段名
  batchName: string;             // 批量数据名称
  initRows?: number;             // 初始化行数
  batchUrl?: object;             // 批量操作URL
  title?: string;                // 表格标题
  helpMsg?: string;              // 帮助信息
  staticColumn?: string;         // 静态列标识('Y'/'N')
  downloadTemplateUrl?: string;  // 下载模板URL
  importInfo?: object;           // 导入信息配置
  fieldList: Array<any>;         // 字段列表
  rules?: object;                // 验证规则
  disVisible?: boolean;          // 是否可见
}
```

## 使用示例

```vue
<template>
  <star-horse-form-table
    v-model:dataForm="formData"
    :item="tableConfig"
    :rules="rules"
    @addRow="handleAddRow"
    @removeRow="handleRemoveRow"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  // 表格数据
  userList: []
})

const tableConfig = ref({
  batchName: 'userList',
  title: '用户列表',
  initRows: 1,
  staticColumn: 'Y',
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

const rules = ref({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
})

const handleAddRow = (row) => {
  console.log('添加行:', row)
}

const handleRemoveRow = (row) => {
  console.log('删除行:', row)
}
</script>
```

## 注意事项

1. 组件通过 [dataForm] 双向绑定表格数据
2. 表格数据存储在 [dataForm.value[batchName]] 中
3. 支持初始化行数设置，通过 [initRows] 属性配置
4. 支持导入Excel数据功能，需要配置 [importInfo] 和 [downloadTemplateUrl]
5. 支持静态列和动态列两种模式，通过 [staticColumn] 属性控制