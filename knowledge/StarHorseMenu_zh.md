# StarHorseMenu 菜单组件

## 概述
StarHorseMenu 是一个水平菜单组件，基于 Element Plus 的 el-menu 实现，支持多级菜单和自定义菜单项。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| preps | Object | 见下方 | 菜单配置属性 |

### preps 默认值
```javascript
{
  id: "id",        // ID字段名
  value: "value",  // 值字段名
  icon: "icon",    // 图标字段名
  label: "name",   // 标签字段名
  children: "children" // 子项字段名
}
```

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| selectItem | item | 选择菜单项时触发 |

## Model

| 名称 | 类型 | 说明 |
|------|------|------|
| dataList | Array | 菜单数据列表 |

## 使用示例

```vue
<template>
  <star-horse-menu
    v-model:dataList="menuData"
    @select-item="handleSelectItem"
  />
</template>

<script setup>
import { ref } from 'vue'
import StarHorseMenu from '@/components/system/StarHorseMenu.vue'

const menuData = ref([
  {
    id: 1,
    name: '首页',
    icon: 'home',
    value: '/home'
  },
  {
    id: 2,
    name: '系统管理',
    icon: 'setting',
    children: [
      {
        id: 21,
        name: '用户管理',
        value: '/system/user'
      },
      {
        id: 22,
        name: '角色管理',
        value: '/system/role'
      }
    ]
  }
])

const handleSelectItem = (item) => {
  console.log('选中菜单项:', item)
  // 路由跳转等操作
  // router.push(item.value)
}
</script>
```