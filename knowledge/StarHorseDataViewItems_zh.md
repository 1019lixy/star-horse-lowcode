# StarHorseDataViewItems 数据查看项组件

## 概述
StarHorseDataViewItems 是一个数据查看项容器组件，用于根据字段配置动态渲染不同类型的查看组件。它支持多种容器类型，包括基础项、卡片项、折叠项、标签页项和动态表格项。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| fieldList | PageFieldInfo | 是 | - | 字段列表配置 |
| objectName | String | 否 | - | 对象名称 |
| subFormFlag | String | 否 | "N" | 子表单标识 |
| batchName | String | 否 | "batchDataList" | 批量数据名称 |
| batchFieldName | String | 否 | "batchFieldList" | 批量字段名称 |
| primaryKey | String/Object | 否 | - | 主键字段 |
| commonFormat | Function | 是 | - | 通用数据格式化函数 |

## Events

无特定事件。

## 方法

无公开方法。

## 数据结构

### PageFieldInfo
```typescript
interface PageFieldInfo {
  fieldList: Array<any>;  // 字段列表
  preps?: object;         // 配置信息
}
```

### 字段配置项 (item)
```typescript
interface FieldItem {
  fieldName: string;        // 字段名
  label: string;            // 标签
  type: string;             // 类型
  cardList?: Array<any>;    // 卡片列表
  collapseList?: Array<any>;// 折叠列表
  tabList?: Array<any>;     // 标签页列表
  batchFieldList?: Array<any>; // 批量字段列表
  dytableList?: Array<any>; // 动态表格列表
}
```

## 使用示例

```vue
<template>
  <star-horse-data-view-items
    :field-list="fieldList"
    :commonFormat="commonFormat"
    v-model:dataForm="dataForm"
  />
</template>

<script setup>
import { ref } from 'vue'

const dataForm = ref({
  name: '张三',
  age: 25,
  gender: '1'
})

const fieldList = ref({
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
    },
    {
      fieldName: 'gender',
      label: '性别',
      type: 'select'
    }
  ]
})

const commonFormat = (name, value, row) => {
  // 通用数据格式化处理
  if (name === 'gender') {
    return value === '1' ? '男' : '女'
  }
  return value
}
</script>
```

## 注意事项

1. 组件通过 [dataForm] 双向绑定查看数据
2. 根据字段配置自动识别并渲染相应的查看组件类型
3. 支持多种容器类型：基础项、卡片项、折叠项、标签页项和动态表格项
4. 通过 [commonFormat] 函数对显示数据进行统一格式化处理
5. 组件会根据 [fieldList] 中的配置动态生成查看项