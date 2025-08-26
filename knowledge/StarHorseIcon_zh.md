# StarHorseIcon 图标组件

## 概述
StarHorseIcon组件是一个基于SVG图标的组件，支持自定义样式、大小、颜色等属性。它提供了多种显示样式，包括普通图标、带边框图标和背景色图标。

## 属性(Props)
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| iconClass | String | required | 图标类名（必需） |
| className | String | undefined | 自定义CSS类名 |
| title | String | "" | 图标标题 |
| size | String | "20px" | 图标大小 |
| marginLeft | String | "0.1em" | 左边距 |
| marginRight | String | "0.2em" | 右边距 |
| borderRadius | String | "5px" | 边框圆角 |
| borderPadding | String | "3px" | 边框内边距 |
| boxShow | Boolean | false | 是否显示背景框 |
| border | Boolean | false | 是否显示边框 |
| color | String | "var(--star-horse-style)" | 图标颜色 |
| cursor | String | "default" | 鼠标指针样式 |

## 事件(Events)
该组件不直接暴露事件。

## 插槽(Slots)
该组件不使用插槽。

## 方法(Methods)
该组件不暴露方法。

## 数据结构
无复杂数据结构。

## 使用示例
```vue
<template>
  <div>
    <!-- 普通图标 -->
    <star-horse-icon icon-class="save" />
    
    <!-- 带标题的图标 -->
    <star-horse-icon 
      icon-class="edit" 
      title="编辑" 
    />
    
    <!-- 自定义大小和颜色的图标 -->
    <star-horse-icon 
      icon-class="delete" 
      size="24px" 
      color="red" 
    />
    
    <!-- 带边框的图标 -->
    <star-horse-icon 
      icon-class="search" 
      :border="true" 
    />
    
    <!-- 带背景色的图标 -->
    <star-horse-icon 
      icon-class="add" 
      :box-show="true" 
      color="white" 
    />
    
    <!-- 可点击的图标 -->
    <star-horse-icon 
      icon-class="close" 
      cursor="pointer" 
      @click="handleClose"
    />
  </div>
</template>

<script setup>
import StarHorseIcon from '@/components/comp/StarHorseIcon.vue'

const handleClose = () => {
  console.log('关闭图标被点击')
}
</script>
```