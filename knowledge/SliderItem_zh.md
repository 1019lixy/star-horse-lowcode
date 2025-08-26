# SliderItem 滑块组件

## 概述
SliderItem 是一个滑块组件，基于 Element Plus 的 el-slider 实现。允许用户通过拖拽滑块来选择数值，支持自定义范围、步长、显示标记等属性。

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
处理滑块值变化事件
```typescript
itemAction(): void
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;      // 字段名
  preps?: SliderPreps;    // 滑块配置参数
  // 其他字段属性...
}
```

### 滑块配置参数 (SliderPreps)
```typescript
interface SliderPreps {
  min?: number;           // 最小值，默认0
  max?: number;           // 最大值，默认100
  step?: number;          // 步长，默认1
  showInput?: boolean;    // 是否显示输入框，默认false
  showInputControls?: boolean; // 是否显示输入框的控制按钮，默认true
  showStops?: boolean;    // 是否显示间断点，默认false
  showTooltip?: boolean;  // 是否显示提示信息，默认true
  range?: boolean;        // 是否为范围选择，默认false
  vertical?: boolean;     // 是否竖向模式，默认false
  height?: string;        // 滑块高度，竖向模式时必填
  label?: string;         // 屏幕阅读器标签
  debounce?: number;      // 输入时的去抖延迟，毫秒
  tooltipClass?: string;  // tooltip 的自定义类名
  marks?: object;         // 标记，key 的类型必须为 number 且取值在闭区间 [min, max] 内
  // 其他 el-slider 支持的属性
}
```

## 使用示例

### 基础滑块
```vue
<template>
  <slider-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  volume: 50  // 存储滑块值
})

const fieldConfig = ref({
  fieldName: 'volume',
  label: '音量',
  type: 'slider',
  preps: {
    min: 0,     // 最小值
    max: 100,   // 最大值
    step: 1     // 步长
  }
})
</script>
```

### 带输入框的滑块
```vue
<template>
  <slider-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  price: 1000  // 存储滑块值
})

const fieldConfig = ref({
  fieldName: 'price',
  label: '价格',
  type: 'slider',
  preps: {
    min: 0,              // 最小值
    max: 5000,           // 最大值
    step: 100,           // 步长
    showInput: true,     // 显示输入框
    showInputControls: false  // 不显示输入框控制按钮
  }
})
</script>
```

### 范围选择滑块
```vue
<template>
  <slider-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  priceRange: [1000, 3000]  // 存储范围值数组
})

const fieldConfig = ref({
  fieldName: 'priceRange',
  label: '价格范围',
  type: 'slider',
  preps: {
    min: 0,        // 最小值
    max: 5000,     // 最大值
    step: 100,     // 步长
    range: true    // 启用范围选择
  }
})
</script>
```

## 注意事项

1. 组件基于 Element Plus 的 el-slider 实现
2. 滑块值以数字或数字数组形式存储在表单数据中
3. 默认步长为1，可通过 [preps.step] 配置
4. 支持范围选择模式，通过 [preps.range] 配置
5. 可显示输入框，通过 [preps.showInput] 配置
6. 支持竖向模式，通过 [preps.vertical] 和 [preps.height] 配置
7. 组件会在值变化时触发 change 事件
8. 可通过 [preps] 配置项自定义滑块组件的各种属性
9. 组件在 mounted 时会初始化一次事件处理
10. 支持标记显示，通过 [preps.marks] 配置