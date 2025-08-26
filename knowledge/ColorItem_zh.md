# ColorItem 颜色选择器组件

## 概述
ColorItem 是一个颜色选择器组件，基于 Element Plus 的 el-color-picker 实现。用于选择和显示颜色值，支持多种颜色格式。

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

### 配置参数 (preps)
```typescript
interface Preps {
  // Element Plus el-color-picker 的所有支持属性
  // 例如：
  // showAlpha?: boolean;    // 是否支持透明度
  // colorFormat?: string;   // 颜色格式('hex'/'rgb'/'hsl'/'hsv')
  // size?: string;          // 尺寸
  // disabled?: boolean;     // 是否禁用
  // popperClass?: string;   // 下拉面板类名
}
```

## 使用示例

### 基础用法
```vue
<template>
  <color-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  color: '#409EFF'
})

const fieldConfig = ref({
  fieldName: 'color',
  label: '颜色选择',
  type: 'color',
  preps: {
    // 使用默认配置
  }
})
</script>
```

### 支持透明度
```vue
<template>
  <color-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  color: 'rgba(19, 206, 102, 0.8)'
})

const fieldConfig = ref({
  fieldName: 'color',
  label: '颜色选择(含透明度)',
  type: 'color',
  preps: {
    showAlpha: true  // 支持透明度选择
  }
})
</script>
```

### 指定颜色格式
```vue
<template>
  <color-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  color: 'rgb(64, 158, 255)'
})

const fieldConfig = ref({
  fieldName: 'color',
  label: '颜色选择(RGB格式)',
  type: 'color',
  preps: {
    colorFormat: 'rgb'  // 指定颜色格式
  }
})
</script>
```

## 注意事项

1. 组件基于 Element Plus 的 el-color-picker 实现
2. 颜色值以字符串形式存储在表单数据中
3. 支持多种颜色格式：hex、rgb、hsl、hsv
4. 可通过 [preps.showAlpha] 支持透明度选择
5. 支持通过 [preps] 配置 Element Plus 颜色选择器的所有属性
6. 组件会自动处理颜色值的绑定和更新