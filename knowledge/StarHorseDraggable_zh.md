# StarHorseDraggable 拖拽组件

## 概述
StarHorseDraggable 是一个可拖拽的组件，用于在页面设计中创建可移动和调整大小的节点元素。该组件支持拖拽移动、边缘调整大小以及右键菜单功能。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| msg | String | 是 | - | 消息内容 |
| node | DynamicNode | 是 | - | 动态节点对象 |
| isActive | Boolean | 否 | false | 是否激活状态 |

## Events

| 事件名 | 参数 | 说明 |
|-------|------|------|
| selectNode | node: DynamicNode | 当节点被选中时触发 |

## 方法

无公开方法。

## 数据结构

### DynamicNode
```typescript
interface DynamicNode {
  name: string;        // 节点名称
  width?: number;      // 节点宽度
  height?: number;     // 节点高度
  left?: number;       // 节点左侧位置
  top?: number;        // 节点顶部位置
  zIndex?: number;     // 节点层级
  // 其他自定义属性...
}
```

## 使用示例

```vue
<template>
  <star-horse-draggable
    :msg="message"
    :node="dynamicNode"
    :is-active="isActive"
    @selectNode="handleSelectNode"
  />
</template>

<script setup>
import { ref } from 'vue'

const message = ref('拖拽组件')
const isActive = ref(true)

const dynamicNode = ref({
  name: '可拖拽节点',
  width: 200,
  height: 150,
  left: 100,
  top: 100,
  zIndex: 10
})

const handleSelectNode = (node) => {
  console.log('选中的节点:', node)
}
</script>
```

## 注意事项

1. 组件需要在激活状态下才能进行拖拽和调整大小操作
2. 调整大小时，可以通过拖拽组件边缘的控制点来改变组件尺寸
3. 组件支持右键菜单功能，可通过 contextmenu 事件自定义菜单内容