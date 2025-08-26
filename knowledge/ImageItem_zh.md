# ImageItem 图片上传组件

## 概述
ImageItem 是一个图片上传和显示组件，基于 Element Plus 的 el-image 和 el-upload 实现。支持图片上传、预览、删除等功能，提供两种显示模式：输入框模式和图片区域模式。

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
| selfFunc | prep, uploadFile, uploadFiles, param | 自定义函数事件 |

## 方法

### removeImage
删除已上传的图片
```typescript
removeImage(): void
```

### selfAction
处理上传相关事件
```typescript
selfAction(prep: any, uploadFile: any, uploadFiles: any = [], param: any = {}): void
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;      // 字段名
  action?: string;        // 上传接口地址
  preps?: ImagePreps;     // 图片配置参数
  // 其他字段属性...
}
```

### 图片配置参数 (ImagePreps)
```typescript
interface ImagePreps {
  assignType?: string;    // 分配类型('url'为输入框模式)
  placeholder?: string;   // 输入框占位符
  width?: string;         // 图片宽度
  height?: string;        // 图片高度
  zoomRate?: number;       // 缩放比率，默认1.2
  maxScale?: number;      // 最大缩放比例，默认2
  minScale?: number;      // 最小缩放比例，默认0.2
  previewSrcList?: Array<string>; // 预览图片列表
  initialIndex?: number;   // 初始索引
  fit?: string;           // 图片适应方式，默认'contain'
  context?: string;       // 上下文路径
}
```

## 使用示例

### 图片区域模式（默认）
```vue
<template>
  <image-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  imageUrl: ''  // 存储图片URL
})

const fieldConfig = ref({
  fieldName: 'imageUrl',
  label: '图片上传',
  type: 'image',
  preps: {
    width: '150px',      // 图片宽度
    height: '150px'      // 图片高度
  }
})
</script>
```

### 输入框模式
```vue
<template>
  <image-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  imageUrl: ''  // 存储图片URL
})

const fieldConfig = ref({
  fieldName: 'imageUrl',
  label: '图片上传',
  type: 'image',
  preps: {
    assignType: 'url'     // 使用输入框模式
  }
})
</script>
```

## 注意事项

1. 组件支持两种显示模式：
   - 图片区域模式（默认）：直接显示图片，支持预览
   - 输入框模式：通过 [preps.assignType] 设置为 'url'
2. 支持图片格式：jpg、jpeg、png、gif、bmp、webp
3. 上传成功后会自动将图片URL存储到表单数据中
4. 默认上传接口为 "/system-config/annex/upload/common"
5. 支持图片预览功能，可通过 [preps.previewSrcList] 配置预览列表
6. 在设计模式下显示删除按钮，可删除已上传的图片
7. 组件会自动处理上传事件，包括成功、失败、进度等
8. 上传成功后会将返回的数据属性自动添加到表单数据中
9. 支持通过 [preps.context] 配置图片URL的上下文路径