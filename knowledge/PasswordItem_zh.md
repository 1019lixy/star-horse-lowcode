# PasswordItem 密码输入组件

## 概述
PasswordItem 是一个密码输入组件，基于 Element Plus 的 el-input 实现。用于安全地输入和处理密码数据，输入内容会被掩码显示。

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
| selfFunc | prep | 自定义函数事件 |
| selectItem | - | 选择项事件 |

## 方法

### itemAction
处理组件事件
```typescript
itemAction(prep: string): void
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
  <password-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  password: ''  // 存储密码值
})

const fieldConfig = ref({
  fieldName: 'password',
  label: '密码',
  type: 'password',
  preps: {
    placeholder: '请输入密码',
    showPassword: true  // 显示密码切换按钮
  }
})
</script>
```

## 注意事项

1. 组件基于 Element Plus 的 el-input 实现，type 设置为 "password"
2. 输入的密码内容会以掩码形式显示（通常是圆点或星号）
3. 组件会自动处理密码数据的双向绑定
4. 可通过 [preps] 配置项自定义输入框的各种属性
5. 支持 Element Plus el-input 的所有属性和事件
6. 组件会在 mounted 时初始化事件处理
7. 密码数据以明文形式存储在表单数据中，需要注意数据安全
8. 建议在表单提交时对密码进行加密处理