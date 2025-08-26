# StarHorseDataView 数据查看组件

## 概述
StarHorseDataView 是一个数据查看组件，用于展示表单数据的只读视图。它支持从远程加载数据、动态表单配置以及数据格式化等功能。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| compUrl | ApiUrls | 否 | - | API接口配置 |
| objectName | String | 否 | - | 对象名称 |
| subFormFlag | String | 否 | "N" | 子表单标识 |
| fieldList | Object | 是 | - | 字段列表配置 |
| globalCondition | Object | 否 | - | 全局条件 |
| outerData | Object | 否 | - | 外部传入数据 |
| dynamicForm | Boolean | 否 | false | 是否为动态表单 |
| primaryKey | String/Object | 否 | "id" | 主键字段 |
| batchFieldName | String | 否 | "batchFieldList" | 批量字段名称 |
| dataFormat | Function | 否 | null | 数据格式化函数 |

## Events

| 事件名 | 参数 | 说明 |
|-------|------|------|
| dataLoaded | objData: any, success: boolean | 数据加载完成时触发 |

## 方法

### setData
设置组件数据
```typescript
setData(data: any): void
```

## 数据结构

### ApiUrls
```typescript
interface ApiUrls {
  loadByIdForViewUrl?: string;  // 根据ID加载数据用于查看的URL
  // 其他API URL...
}
```

### DialogProps
```typescript
interface DialogProps {
  ids?: any;  // 数据ID
  // 其他对话框属性...
}
```

### 字段列表配置 (fieldList)
```typescript
interface FieldList {
  fieldList: Array<any>;  // 字段列表
  preps?: object;         // 配置信息
}
```

## 使用示例

```vue
<template>
  <star-horse-data-view
    :comp-url="compUrl"
    :field-list="fieldList"
    :data-format="dataFormat"
    @dataLoaded="handleDataLoaded"
  />
</template>

<script setup>
import { ref } from 'vue'

const compUrl = ref({
  loadByIdForViewUrl: '/api/data/view'
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
    }
  ]
})

const dataFormat = (name, value, row) => {
  // 数据格式化处理
  if (name === 'age') {
    return `${value}岁`
  }
  return value
}

const handleDataLoaded = (objData, success) => {
  console.log('数据加载完成:', objData, success)
}
</script>
```

## 注意事项

1. 组件通过 [compUrl.loadByIdForViewUrl] 接口加载查看数据
2. 支持外部传入数据，通过 [outerData] 属性设置
3. 支持动态表单配置，通过 [dynamicForm] 属性控制
4. 数据加载完成后会触发 [dataLoaded] 事件
5. 可通过 [dataFormat] 函数对显示数据进行格式化处理