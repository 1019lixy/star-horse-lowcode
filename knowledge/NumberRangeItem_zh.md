# NumberRangeItem 数字范围输入组件

## 概述
NumberRangeItem 是一个数字范围输入组件，允许用户输入最小值和最大值来定义一个数字范围。组件支持前缀、后缀、分隔符等配置，并提供数据验证功能。

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
处理组件事件和数据验证
```typescript
itemAction(prep: string): void
```

### handleFocus
处理输入框获得焦点事件
```typescript
handleFocus(): void
```

### handleBlur
处理输入框失去焦点事件
```typescript
handleBlur(): void
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;         // 字段名
  preps?: NumberRangePreps;  // 数字范围配置参数
  // 其他字段属性...
}
```

### 数字范围配置参数 (NumberRangePreps)
```typescript
interface NumberRangePreps {
  prefix?: string;           // 前缀文本
  suffix?: string;           // 后缀文本
  splitName?: string;        // 分隔符，默认"-"
  minName?: string;          // 最小值字段名，默认[fieldName] + "Min"
  maxName?: string;          // 最大值字段名，默认[fieldName] + "Max"
  minPlaceholder?: string;   // 最小值输入框占位符
  maxPlaceholder?: string;   // 最大值输入框占位符
  stepStrictly?: boolean;    // 是否严格步长
  // 其他 el-input-number 支持的属性
}
```

## 使用示例

### 基础数字范围输入
```vue
<template>
  <number-range-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  price: '100-500',     // 存储范围值字符串
  priceMin: 100,        // 最小值
  priceMax: 500         // 最大值
})

const fieldConfig = ref({
  fieldName: 'price',
  label: '价格范围',
  type: 'number-range',
  preps: {
    minPlaceholder: '最低价',
    maxPlaceholder: '最高价'
  }
})
</script>
```

### 带前缀和后缀的数字范围输入
```vue
<template>
  <number-range-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  age: '18~60',         // 存储范围值字符串
  ageMin: 18,           // 最小值
  ageMax: 60            // 最大值
})

const fieldConfig = ref({
  fieldName: 'age',
  label: '年龄范围',
  type: 'number-range',
  preps: {
    prefix: '年龄:',      // 前缀
    suffix: '岁',         // 后缀
    splitName: '~',      // 分隔符
    minPlaceholder: '最小年龄',
    maxPlaceholder: '最大年龄'
  }
})
</script>
```

## 注意事项

1. 组件包含两个数字输入框，分别用于输入最小值和最大值
2. 范围值以字符串形式存储在主字段中，格式为"[最小值][分隔符][最大值]"
3. 最小值和最大值分别存储在 [fieldName] + "Min" 和 [fieldName] + "Max" 字段中
4. 支持数据验证，确保最大值不小于最小值
5. 可通过 [preps.splitName] 配置分隔符，默认为"-"
6. 支持前缀和后缀文本显示
7. 组件会自动处理焦点状态样式
8. 可通过 [preps.minPlaceholder] 和 [preps.maxPlaceholder] 设置输入框占位符
9. 组件在 mounted 时会解析主字段的范围值并初始化最小值和最大值字段
10. 当输入值发生变化时会触发 change 事件