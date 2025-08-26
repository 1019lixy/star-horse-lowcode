# DepartItem 部门选择组件

## 概述
DepartItem 是一个部门选择组件。根据源码显示，该组件目前尚未实现具体功能，仅包含基础的模板结构。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| isDesign | Boolean | 否 | false | 是否为设计模式 |
| disabled | Boolean | 否 | false | 是否禁用 |
| showFormItem | Boolean | 否 | false | 是否显示表单项 |
| bareFlag | Boolean | 否 | false | 是否为简洁模式 |
| isSearch | Boolean | 否 | false | 是否为搜索模式 |

## Events

| 事件名 | 参数 | 说明 |
|-------|------|------|
| selfFunc | - | 自定义函数事件 |
| selectItem | - | 选择项事件 |

## 方法

无特定公开方法。

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
  <depart-item
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const fieldConfig = ref({
  fieldName: 'depart',
  label: '部门选择',
  type: 'depart',
  preps: {
    // 配置参数（当前未实现）
  }
})
</script>
```

## 注意事项

1. 该组件目前尚未实现具体功能，仅包含基础的模板结构
2. 组件继承自 StarHorseFormItem，具有表单项的基础结构
3. 如需使用部门选择功能，建议使用其他已实现的数据选择组件
4. 后续版本可能会完善该组件的具体实现