# BarcodeItem 条形码组件

## 概述
BarcodeItem 是一个条形码生成组件，基于 vue3-barcode 实现，用于生成和显示条形码。组件支持多种条形码格式和自定义样式配置。

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

### createCode
创建条形码配置
```typescript
createCode(): void
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;      // 字段名
  preps?: object;         // 条形码配置参数
  // 其他字段属性...
}
```

### 条形码配置参数 (preps)
```typescript
interface BarcodePreps {
  name?: string;          // 数据字段名
  format?: string;        // 条形码格式，默认"CODE39"
  width?: number;         // 条形码宽度，默认1
  height?: number;        // 条形码高度，默认40
  displayValue?: boolean; // 是否显示文本值，默认true
  fontOptions?: string;   // 字体选项
  font?: string;          // 字体
  textAlign?: string;     // 文本对齐方式，默认"center"
  textPosition?: string;  // 文本位置，默认"bottom"
  textMargin?: number;    // 文本边距，默认5
  fontSize?: number;      // 字体大小，默认15
  background?: string;    // 背景色，默认"#fff"
  lineColor?: string;     // 线条颜色，默认"#000"
  margin?: number;        // 边距，默认15
}
```

## 使用示例

```vue
<template>
  <barcode-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  barcodeData: '123456789'
})

const fieldConfig = ref({
  fieldName: 'barcode',
  label: '条形码',
  type: 'barcode',
  preps: {
    name: 'barcodeData',     // 关联的数据字段
    format: 'CODE128',       // 条形码格式
    width: 2,                // 条形码宽度
    height: 50,              // 条形码高度
    displayValue: true,      // 显示文本值
    fontSize: 16,            // 字体大小
    lineColor: '#000000',    // 线条颜色
    background: '#ffffff'    // 背景色
  }
})
</script>
```

## 注意事项

1. 组件通过 [preps.name] 关联表单数据中的字段
2. 支持多种条形码格式，如 CODE39、CODE128、EAN、UPC 等
3. 当关联的数据字段值发生变化时，条形码会自动重新生成
4. 可通过 [preps] 配置项自定义条形码的外观和样式
5. 组件会在 mounted 和数据变化时自动调用 [createCode] 方法生成配置
6. 条形码的值来自 [formData[preps.name]] 字段