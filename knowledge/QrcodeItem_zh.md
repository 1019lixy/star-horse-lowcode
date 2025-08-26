# QrcodeItem 二维码组件

## 概述
QrcodeItem 是一个二维码生成组件，基于 qrcode.vue 实现。用于将文本数据转换为二维码图像显示，支持自定义尺寸和中心图片。

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
创建二维码配置
```typescript
createCode(): void
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;      // 字段名
  preps?: QrcodePreps;    // 二维码配置参数
  // 其他字段属性...
}
```

### 二维码配置参数 (QrcodePreps)
```typescript
interface QrcodePreps {
  src?: string;           // 中心图片URL
  width?: number;         // 二维码宽度，默认100
  height?: number;        // 二维码高度，默认100
  size?: number;          // 二维码尺寸
  level?: string;         // 容错级别('L'/'M'/'Q'/'H')
  background?: string;    // 背景色，默认'#fff'
  foreground?: string;    // 前景色，默认'#000'
  // 其他 qrcode.vue 支持的属性
}
```

### 图片设置 (ImageSettings)
```typescript
interface ImageSettings {
  src: string;            // 图片URL
  width: number;          // 图片宽度
  height: number;         // 图片高度
  excavate?: boolean;     // 是否挖空，默认true
}
```

## 使用示例

### 基础二维码
```vue
<template>
  <qrcode-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  qrData: 'https://example.com'  // 存储二维码数据
})

const fieldConfig = ref({
  fieldName: 'qrData',
  label: '二维码',
  type: 'qrcode',
  preps: {
    size: 200,      // 二维码尺寸
    level: 'M'      // 容错级别
  }
})
</script>
```

### 带中心图片的二维码
```vue
<template>
  <qrcode-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  qrData: 'https://example.com'
})

const fieldConfig = ref({
  fieldName: 'qrData',
  label: '二维码',
  type: 'qrcode',
  preps: {
    size: 200,
    src: '/logo.png',    // 中心图片URL
    width: 40,           // 中心图片宽度
    height: 40           // 中心图片高度
  }
})
</script>
```

## 注意事项

1. 组件基于 qrcode.vue 实现，提供二维码生成功能
2. 二维码数据来自表单数据中对应字段的值
3. 支持自定义二维码尺寸、颜色、容错级别等属性
4. 可通过 [preps.src] 设置中心图片，显示品牌Logo等
5. 组件会自动监听数据变化并重新生成二维码
6. 在 mounted 和数据变化时会调用 createCode 方法生成配置
7. 支持通过 [preps] 配置项自定义二维码的各种属性
8. 二维码尺寸默认为100x100，可通过 [preps.size] 或 [preps.width]/[preps.height] 设置
9. 容错级别默认为 'L'，可设置为 'M'、'Q'、'H'