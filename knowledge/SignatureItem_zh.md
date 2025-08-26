# SignatureItem 签名组件

## 概述
SignatureItem 是一个手写签名组件，基于 smooth-signature 实现。提供画布供用户手写签名，支持清除、撤销、颜色修改、预览等功能。

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

### init
初始化签名组件
```typescript
init(): Promise<void>
```

### clear
清除签名
```typescript
clear(evt: MouseEvent): void
```

### undo
撤销上一步操作
```typescript
undo(evt: MouseEvent): void
```

### handleColor
修改画笔颜色
```typescript
handleColor(evt: MouseEvent): void
```

### handlePreview
预览签名
```typescript
handlePreview(evt: MouseEvent): void
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

### 签名配置选项 (options)
```typescript
interface SignatureOptions {
  width: number;          // 画布宽度
  height: number;         // 画布高度
  minWidth: number;       // 最小线宽，默认4
  maxWidth: number;       // 最大线宽，默认12
  bgColor: string;        // 背景色，默认"#f6f6f6"
}
```

## 使用示例

```vue
<template>
  <signature-item
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const fieldConfig = ref({
  fieldName: 'signature',
  label: '签名',
  type: 'signature',
  preps: {
    // 签名组件配置
  }
})
</script>
```

## 注意事项

1. 组件基于 smooth-signature 实现手写签名功能
2. 提供工具栏按钮支持清除、撤销、颜色修改、预览等操作
3. 签名数据可以通过 [signature.getPNG()] 方法获取PNG格式的Base64数据
4. 画布尺寸默认宽度为窗口宽度和1000px的较小值，高度为600px
5. 画笔宽度可调节，最小4px，最大12px
6. 背景色默认为浅灰色 "#f6f6f6"
7. 支持撤销操作，可逐步撤销之前的绘制内容
8. 可以随机更改画笔颜色
9. 提供预览功能，在对话框中显示签名结果
10. 组件在 mounted 和 updated 生命周期钩子中都会调用初始化方法
11. 如果签名画布为空时尝试预览，会提示"请先签名"