# MenuItem 组件

## 概述
MenuItem 是一个菜单项组件，用于构建多级菜单结构。它基于 Element Plus 的 el-menu-item 和 el-sub-menu 组件实现，支持递归渲染子菜单项。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| item | Object | required | 菜单项数据对象 |
| preps | Object | { id: "id", icon: "icon", value: "value", label: "name", children: "children" } | 菜单项属性映射配置 |
| level | Number | 1 | 菜单层级 |

## 功能特性

1. **多级菜单**：支持无限层级的菜单结构
2. **递归渲染**：自动递归渲染子菜单项
3. **图标支持**：支持菜单项图标显示
4. **自定义映射**：支持自定义属性名映射
5. **层级样式**：不同层级有不同的背景色

## 数据结构

### item 数据结构
```javascript
{
  id: "menu1",           // 菜单项唯一标识
  icon: "document",      // 菜单项图标
  name: "菜单项1",        // 菜单项名称
  children: [...]       // 子菜单项数组（可选）
}
```

### preps 配置项
```javascript
{
  id: "id",              // 映射到 item 的 id 属性
  icon: "icon",          // 映射到 item 的 icon 属性
  value: "value",        // 映射到 item 的 value 属性
  label: "name",         // 映射到 item 的 label 属性
  children: "children"   // 映射到 item 的 children 属性
}
```

## 方法

### selectItem(item)
处理菜单项点击事件，向上级组件传递选中的菜单项数据。

## 计算属性

### menuColor
根据菜单层级计算背景色：
- 一级菜单：var(--star-horse-background)
- 二级及以上菜单：var(--star-horse-shadow)

## 事件

### selectItem
当菜单项被点击时触发，传递选中的菜单项数据。

## 依赖组件

- el-sub-menu: Element Plus 子菜单组件
- el-menu-item: Element Plus 菜单项组件
- el-icon: Element Plus 图标组件
- compKey: 组件唯一标识生成工具函数

## 使用示例

```vue
<template>
  <el-menu>
    <MenuItem 
      :item="menuData" 
      :preps="menuPreps" 
      :level="1" 
      @selectItem="handleSelectItem" 
    />
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'

const menuData = ref({
  id: 'menu1',
  icon: 'document',
  name: '文档管理',
  children: [
    {
      id: 'submenu1',
      icon: 'folder',
      name: '文件夹1'
    },
    {
      id: 'submenu2',
      icon: 'folder',
      name: '文件夹2'
    }
  ]
})

const menuPreps = ref({
  id: 'id',
  icon: 'icon',
  value: 'value',
  label: 'name',
  children: 'children'
})

const handleSelectItem = (item) => {
  console.log('选中菜单项:', item)
}
</script>
```

## 样式说明

1. **图标样式**：图标大小为 22px
2. **菜单项高度**：子菜单标题高度为 40px
3. **背景色**：不同层级有不同的背景色
4. **弹出层样式**：弹出层背景色为白色

## 注意事项

1. 菜单项通过 children 属性判断是否有子菜单
2. 图标默认为 'document'，可通过 item.icon 自定义
3. 支持无限层级递归渲染
4. 通过 compKey 函数生成唯一的 key 值