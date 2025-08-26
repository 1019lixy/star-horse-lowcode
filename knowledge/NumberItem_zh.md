# NumberItem 数字输入组件

## 概述
NumberItem 是一个数字输入组件，基于 Element Plus 的 el-input-number 实现。支持设置前缀、后缀、步长、最小值、精度等属性，适用于需要输入数字的场景。

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

### initEvent
初始化事件
```typescript
initEvent(): Promise<void>
```

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
  preps?: NumberPreps;    // 数字输入配置参数
  // 其他字段属性...
}
```

### 数字输入配置参数 (NumberPreps)
```typescript
interface NumberPreps {
  prefix?: string;        // 前缀文本
  suffix?: string;        // 后缀文本
  step?: number;          // 步长，默认1
  min?: number;           // 最小值，默认0
  precision?: number;      // 数值精度，默认0
  max?: number;           // 最大值
  stepStrictly?: boolean; // 是否严格步长
  // 其他 el-input-number 支持的属性
}
```

## 使用示例

### 基础数字输入
```vue
<template>
  <number-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  age: 25  // 存储数字值
})

const fieldConfig = ref({
  fieldName: 'age',
  label: '年龄',
  type: 'number',
  preps: {
    min: 0,        // 最小值
    max: 150,      // 最大值
    step: 1        // 步长
  }
})
</script>
```

### 带前缀和后缀的数字输入
```vue
<template>
  <number-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  price: 99.99  // 存储价格数值
})

const fieldConfig = ref({
  fieldName: 'price',
  label: '价格',
  type: 'number',
  preps: {
    prefix: '￥',      // 前缀符号
    suffix: '元',      // 后缀单位
    precision: 2,     // 保留两位小数
    step: 0.01        // 步长为分
  }
})
</script>
```

### 严格步长的数字输入
```vue
<template>
  <number-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  score: 0  // 存储分数值
})

const fieldConfig = ref({
  fieldName: 'score',
  label: '分数',
  type: 'number',
  preps: {
    min: 0,              // 最小值
    max: 100,            // 最大值
    step: 5,             // 步长为5
    stepStrictly: true,  // 严格步长
    precision: 0         // 整数
  }
})
</script>
```

## 注意事项

1. 组件基于 Element Plus 的 el-input-number 实现
2. 默认步长为1，最小值为0，精度为0（整数）
3. 支持前缀和后缀文本显示
4. 可通过 [preps.precision] 设置数值精度（小数位数）
5. 支持 [preps.stepStrictly] 严格步长模式
6. 组件会自动处理数值的双向绑定
7. 宽度默认设置为100%
8. 可通过 [preps] 配置项自定义数字输入框的各种属性
9. 组件会在 mounted 时初始化默认配置