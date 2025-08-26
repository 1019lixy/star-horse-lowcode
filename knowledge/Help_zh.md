# Help 帮助组件

## 概述
Help 是一个基于 Element Plus 的帮助提示组件，通过悬停触发显示帮助信息。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| width | Number | 340 | 弹出框宽度 |
| message | String | "帮助" | 帮助信息内容（必填） |

## 使用示例

```vue
<template>
  <help message="这是帮助信息内容" :width="400" />
</template>

<script setup>
import Help from '@/components/help.vue'
</script>
```

## 特性

1. 基于 Element Plus 的 el-popover 实现
2. 悬停触发显示帮助信息
3. 支持自定义弹出框宽度
4. 使用 StarHorseIcon 图标组件
5. 支持多行帮助信息显示
6. 小巧的帮助图标（12px）
7. 鼠标悬停时显示手指光标