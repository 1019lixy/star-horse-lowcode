# StarHorsePopover 弹出框组件

## 概述
StarHorsePopover 是一个基于 Element Plus 的弹出框组件，用于显示图标选择器。它可以加载远程图标数据或使用本地图标数组，并支持图标选择功能。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| menuIcon | String | 否 | - | 当前选中的菜单图标 |
| iconUrl | String | 否 | - | 图标数据的远程加载地址 |
| iconSize | Number | 否 | 48 | 图标大小 |
| icons | Array | 否 | [] | 本地图标数组 |

## Events

| 事件名 | 参数 | 说明 |
|-------|------|------|
| selectIcon | icon: string | 当图标被选中时触发 |

## 方法

无公开方法。

## 数据结构

### 图标对象
```typescript
interface IconItem {
  menuIcon: string;  // 图标类名
  label: string;     // 图标标签/描述
}
```

## 使用示例

### 使用远程图标数据
```vue
<template>
  <star-horse-popover
    :menu-icon="currentIcon"
    icon-url="/api/icons"
    @selectIcon="handleIconSelect"
  >
    <star-horse-icon :icon-class="currentIcon" />
  </star-horse-popover>
</template>

<script setup>
import { ref } from 'vue'

const currentIcon = ref('home')

const handleIconSelect = (icon) => {
  currentIcon.value = icon
}
</script>
```

### 使用本地图标数组
```vue
<template>
  <star-horse-popover
    :menu-icon="currentIcon"
    :icons="localIcons"
    @selectIcon="handleIconSelect"
  >
    <star-horse-icon :icon-class="currentIcon" />
  </star-horse-popover>
</template>

<script setup>
import { ref } from 'vue'

const currentIcon = ref('home')

const localIcons = ref([
  { menuIcon: 'home', label: '首页' },
  { menuIcon: 'setting', label: '设置' },
  { menuIcon: 'user', label: '用户' }
])

const handleIconSelect = (icon) => {
  currentIcon.value = icon
}
</script>
```

## 注意事项

1. 组件需要通过插槽(slot)来显示触发元素
2. 可以通过 iconUrl 属性加载远程图标数据，或通过 icons 属性使用本地图标数组
3. 选中图标时会触发 selectIcon 事件，返回选中的图标类名