# JsonArrayItem JSON数组编辑组件

## 概述
JsonArrayItem 是一个专门用于编辑JSON数组数据的组件，基于 BaseJsonItem 实现。提供设计模式和开发模式两种编辑方式，支持数组数据的增删改查操作。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| isDesign | Boolean | 否 | false | 是否为设计模式 |
| disabled | Boolean | 否 | false | 是否禁用 |
| showFormItem | Boolean | 否 | false | 是否显示表单项 |
| bareFlag | Boolean | 否 | false | 是否为简洁模式 |
| isSearch | Boolean | 否 | false | 是否为搜索模式 |
| field | Object | 是 | - | 字段配置 |
| formInfo | Object | 否 | - | 表单信息 |
| parentField | Object | 否 | - | 父级字段配置 |

## Events

| 事件名 | 参数 | 说明 |
|-------|------|------|
| selfFunc | prep | 自定义函数事件 |
| selectItem | - | 选择项事件 |

## 方法

### itemAction
处理组件事件
```typescript
itemAction(prep: any): void
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;      // 字段名
  preps?: object;         // 配置参数
  // 其他字段属性...
}
```

## 使用示例

```vue
<template>
  <json-array-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  jsonArray: '[{"id": 1, "name": "项目1"}, {"id": 2, "name": "项目2"}]'
})

const fieldConfig = ref({
  fieldName: 'jsonArray',
  label: 'JSON数组',
  type: 'json-array',
  preps: {
    // JSON数组编辑器配置
  }
})
</script>
```

## 注意事项

1. 组件基于 BaseJsonItem 实现，专门用于处理JSON数组数据
2. 数据以JSON字符串形式存储在表单数据中
3. 提供两种编辑模式：
   - 设计模式：通过表单界面编辑数组元素
   - 开发模式：通过JSON编辑器直接编辑原始JSON数据
4. 组件会自动处理JSON数据的序列化和反序列化
5. 支持通过表单验证确保数据格式正确
6. 编辑完成后会自动更新表单数据
7. 组件继承了 BaseJsonItem 的所有功能特性