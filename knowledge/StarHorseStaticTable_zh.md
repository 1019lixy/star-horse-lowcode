# StarHorseStaticTable 静态表格组件

## 概述
StarHorseStaticTable组件是一个静态数据表格组件，基于Element Plus的el-table构建。它支持数据选择、列显示/隐藏、列排序、行展开等功能，适用于展示静态表格数据的场景。

## 属性(Props)
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| primaryKey | String/Object | required | 主键字段（必需） |
| fieldList | Object | required | 字段列表配置（必需） |
| dataFormat | Function | null | 数据格式化函数 |
| compSize | String | Config.compSize | 组件大小 |
| dialogInput | Boolean | false | 是否为对话框输入模式 |
| height | String | "100%" | 表格高度 |
| expand | Boolean | false | 是否默认展开所有子节点 |
| showBatchField | Boolean | false | 是否显示批量字段 |
| allowSelectParent | Boolean | true | 是否允许选择父级节点 |
| title | String | undefined | 表格标题 |
| dataList | Array | undefined | 表格数据列表 |

## 事件(Events)
该组件不直接暴露事件。

## 插槽(Slots)
该组件不使用插槽。

## 方法(Methods) (通过defineExpose暴露)
| 方法名 | 参数 | 返回类型 | 描述 |
|--------|------|----------|------|
| getIds | none | Array<any> | 获取选中行的ID数组 |
| setData | data: any | void | 设置表格数据 |

## 数据结构

### 字段列表配置(fieldList)
```typescript
interface FieldList {
  fieldList: Array<FieldInfo>;      // 字段信息数组
  batchFieldList?: Array<BatchFieldInfo>;  // 批量字段信息数组（可选）
  tableCellEditabled?: boolean;     // 是否允许单元格编辑（可选）
}
```

### FieldInfo字段信息
```typescript
interface FieldInfo {
  label?: string;          // 标签名称
  fieldName: string;       // 字段名称
  type?: string;           // 字段类型
  listVisible?: boolean;   // 列表是否可见
  // 更多字段属性...
}
```

### 批量字段信息(BatchFieldInfo)
```typescript
interface BatchFieldInfo {
  batchName: string;       // 批量字段名称
  fieldList: Array<FieldInfo>;  // 字段信息数组
  // 更多批量字段属性...
}
```

## 使用示例
```vue
<template>
  <div>
    <star-horse-static-table
      ref="tableRef"
      :primary-key="'id'"
      :field-list="fieldList"
      :data-list="tableData"
      :title="'用户列表'"
      @selection-change="handleSelectionChange"
    />
    
    <el-button @click="getSelectedIds">获取选中ID</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StarHorseStaticTable from '@/components/comp/StarHorseStaticTable.vue'

const tableRef = ref(null)
const fieldList = {
  fieldList: [
    {
      fieldName: 'name',
      label: '姓名',
      listVisible: true
    },
    {
      fieldName: 'age',
      label: '年龄',
      listVisible: true
    },
    {
      fieldName: 'email',
      label: '邮箱',
      listVisible: true
    }
  ]
}

const tableData = [
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com' }
]

const handleSelectionChange = (selection) => {
  console.log('选中的行:', selection)
}

const getSelectedIds = () => {
  const ids = tableRef.value.getIds()
  console.log('选中的ID:', ids)
}
</script>
```

## 功能特性
1. **数据选择**：支持单选和多选模式
2. **列管理**：支持显示/隐藏列和列排序
3. **行操作**：支持行点击选择和行展开
4. **数据格式化**：支持自定义数据格式化函数
5. **静态数据**：适用于静态数据展示
6. **父子节点**：支持树形数据结构的父子节点处理
7. **对话框模式**：支持对话框输入模式（限制单选）
8. **自定义样式**：支持自定义表格样式和高度