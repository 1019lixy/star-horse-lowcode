# AudioItem 音频播放组件

## 概述
AudioItem 是一个音频播放组件，基于 HTML5 的 audio 元素实现，用于播放音频文件。组件支持从远程地址加载音频数据并进行播放。

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

### bufferToWave
将 AudioBuffer 转换为 WAV 格式的 Blob 对象
```typescript
bufferToWave(abuffer: any, len: number): Blob
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;      // 字段名
  audioUrl: string;       // 音频文件地址
  // 其他字段属性...
}
```

## 使用示例

```vue
<template>
  <audio-item
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const fieldConfig = ref({
  fieldName: 'audio',
  label: '音频',
  type: 'audio',
  audioUrl: '/api/audio/file.mp3'  // 音频文件地址
})
</script>
```

## 注意事项

1. 组件通过 [field.audioUrl] 属性获取音频文件地址
2. 组件使用 XMLHttpRequest 加载音频数据并转换为 Blob 对象
3. 支持将音频数据解码为 AudioBuffer 并进行处理
4. 可以将 AudioBuffer 转换为 WAV 格式的 Blob 对象进行播放
5. 组件基于 HTML5 的 audio 元素，支持基本的播放控制
6. 音频数据加载完成后会自动设置到 audio 元素的 src 属性