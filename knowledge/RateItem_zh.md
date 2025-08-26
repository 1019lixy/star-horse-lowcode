# RateItem 评分组件

## 概述
RateItem 是一个评分组件，基于 Element Plus 的 el-rate 实现。用于让用户对某项内容进行星级评分，支持自定义评分图标、颜色、最大值等属性。

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

### itemAction
处理评分变化事件
```typescript
itemAction(): void
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;      // 字段名
  preps?: RatePreps;      // 评分配置参数
  // 其他字段属性...
}
```

### 评分配置参数 (RatePreps)
```typescript
interface RatePreps {
  max?: number;           // 最大分值，默认5
  allowHalf?: boolean;    // 是否允许半星，默认false
  lowThreshold?: number;   // 低分和中等分数的界限值，默认2
  highThreshold?: number;  // 高分和中等分数的界限值，默认4
  colors?: Array<string>; // icon 的颜色数组，长度为3
  voidColor?: string;     // 未选中 icon 的颜色
  disabledVoidColor?: string; // 只读时未选中 icon 的颜色
  icons?: Array<any>;     // icon 的类名数组，长度为3
  voidIcon?: any;         // 未选中 icon 的类名
  disabledVoidIcon?: any; // 只读时未选中 icon 的类名
  showText?: boolean;     // 是否显示辅助文字，默认false
  showScore?: boolean;    // 是否显示当前分数，默认false
  textColor?: string;     // 辅助文字的颜色
  texts?: Array<string>;  // 辅助文字数组
  scoreTemplate?: string; // 分数显示模板
  // 其他 el-rate 支持的属性
}
```

## 使用示例

### 基础评分
```vue
<template>
  <rate-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  score: 3  // 存储评分值
})

const fieldConfig = ref({
  fieldName: 'score',
  label: '评分',
  type: 'rate',
  preps: {
    max: 5  // 最大分值
  }
})
</script>
```

### 带辅助文字的评分
```vue
<template>
  <rate-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  score: 3
})

const fieldConfig = ref({
  fieldName: 'score',
  label: '评分',
  type: 'rate',
  preps: {
    max: 5,
    showText: true,  // 显示辅助文字
    texts: ['极差', '失望', '一般', '满意', '惊喜']  // 辅助文字数组
  }
})
</script>
```

### 允许半星评分
```vue
<template>
  <rate-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  score: 3.5
})

const fieldConfig = ref({
  fieldName: 'score',
  label: '评分',
  type: 'rate',
  preps: {
    max: 5,
    allowHalf: true,     // 允许半星
    showScore: true      // 显示当前分数
  }
})
</script>
```

## 注意事项

1. 组件基于 Element Plus 的 el-rate 实现
2. 评分值以数字形式存储在表单数据中
3. 默认最大分值为5分，可通过 [preps.max] 配置
4. 支持半星评分，通过 [preps.allowHalf] 配置
5. 可显示辅助文字或当前分数，分别通过 [preps.showText] 和 [preps.showScore] 配置
6. 支持自定义评分图标、颜色等样式属性
7. 组件会在评分变化时触发 change 事件
8. 可通过 [preps] 配置项自定义评分组件的各种属性
9. 组件在 mounted 时会初始化一次事件处理