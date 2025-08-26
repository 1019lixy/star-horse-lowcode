# ContentMenu 右键菜单组件

## 概述
ContentMenu 是一个右键菜单组件，用于在页面中显示上下文菜单。支持子菜单、自动定位和多种菜单项类型。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| menuData | Array | [] | 菜单项数据 |
| isSubMenu | Boolean | false | 是否为子菜单 |
| autoHide | Boolean | true | 是否自动隐藏 |
| active | String/Number | "" | 激活项的标识 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| hide | - | 菜单隐藏时触发 |
| show | - | 菜单显示时触发 |
| mouseenter | - | 鼠标进入菜单时触发 |

## Expose 方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| hide | - | 隐藏菜单 |
| show | MouseEvent (可选) | 显示菜单 |
| setPosition | MouseEvent | 设置菜单位置 |
| contains | HTMLElement | 检查元素是否在菜单内 |

## 数据结构

### MenuItem 菜单项结构
```typescript
{
  type: string; // 项类型 ('divider' 分隔线, 'button' 按钮)
  direction: string; // 分隔线方向
  display: boolean; // 是否显示
  id: string/number; // 项标识
  icon: string; // 图标类名
  text: string; // 显示文本
  handler: Function; // 点击处理函数
  items: Array; // 子菜单项数组
}
```

## 使用示例

```vue
<template>
  <content-menu
    ref="contextMenu"
    :menu-data="menuData"
    @show="onMenuShow"
    @hide="onMenuHide"
  >
    <template #title>
      <div>菜单标题</div>
    </template>
  </content-menu>
</template>

<script setup>
import { ref } from 'vue'
import ContentMenu from '@/components/system/ContentMenu.vue'

const contextMenu = ref()
const menuData = ref([
  {
    type: 'button',
    display: true,
    id: 'copy',
    icon: 'copy',
    text: '复制',
    handler: () => console.log('复制操作')
  },
  {
    type: 'divider',
    direction: 'horizontal'
  },
  {
    type: 'button',
    display: true,
    id: 'paste',
    icon: 'paste',
    text: '粘贴',
    handler: () => console.log('粘贴操作')
  }
])

const onMenuShow = () => {
  console.log('菜单显示')
}

const onMenuHide = () => {
  console.log('菜单隐藏')
}
</script>
```