# StarHorseSvg SVG 图标组件

## 概述
StarHorseSvg 是一个 SVG 图标组件，支持自定义颜色、大小和样式，可以显示矢量图标。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| className | String | - | 自定义 CSS 类名 |
| title | String | "" | 图标标题 |
| size | String | "20px" | 图标大小 |
| width | Number | 200 | 图标宽度 |
| height | Number | 200 | 图标高度 |
| data | Object | {} | SVG 路径数据 |
| borderOffset | Number | 0 | 边框偏移量 |
| color | String | "var(--star-horse-style)" | 图标颜色 |
| backgroundColor | String | "#fff" | 背景颜色 |
| borderColor | String | "#ebebeb" | 边框颜色 |
| borderWidth | Number | 0 | 边框宽度 |
| cursor | String | "default" | 鼠标光标样式 |

## 数据结构

### SVG 数据结构
```typescript
{
  path: string;      // SVG 路径数据
  viewBox: number[]; // 视图框尺寸 [width, height]
  outlined: boolean; // 是否为轮廓样式
}
```

## 使用示例

```vue
<template>
  <star-horse-svg
    :data="iconData"
    size="24px"
    color="#409eff"
    cursor="pointer"
    @click="handleIconClick"
  />
</template>

<script setup>
import { ref } from 'vue'
import StarHorseSvg from '@/components/system/StarHorseSvg.vue'

const iconData = ref({
  path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  viewBox: [24, 24],
  outlined: false
})

const handleIconClick = () => {
  console.log('图标被点击')
}
</script>
```