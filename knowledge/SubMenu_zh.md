# SubMenu 组件

## 概述
SubMenu 是一个子菜单组件，用于构建多级菜单结构。它基于 Element Plus 的 el-menu-item 和 el-sub-menu 组件实现，支持递归渲染子菜单项，并集成了 Vue Router 路由功能。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| level | Number | 1 | 菜单层级 |

## 功能特性

1. **多级菜单**：支持无限层级的菜单结构
2. **递归渲染**：自动递归渲染子菜单项
3. **路由集成**：集成 Vue Router，支持路由跳转
4. **图标支持**：支持菜单项图标显示
5. **层级样式**：不同层级有不同的背景色
6. **分隔线**：二级及以上菜单项之间有分隔线

## 数据结构

### dataList 数据结构
```javascript
[
  {
    path: "/path",         // 路由路径
    meta: {
      menuId: "menu1",     // 菜单项唯一标识
      menuIcon: "document", // 菜单项图标
      title: "菜单项1"      // 菜单项标题
    },
    children: [...]        // 子菜单项数组（可选）
  }
]
```

## 计算属性

### menuColor
根据菜单层级计算背景色：
- 一级菜单：var(--star-horse-background)
- 二级及以上菜单：var(--star-horse-shadow)

## 依赖组件

- el-sub-menu: Element Plus 子菜单组件
- el-menu-item: Element Plus 菜单项组件
- el-icon: Element Plus 图标组件
- router-link: Vue Router 链接组件
- compKey: 组件唯一标识生成工具函数

## 使用示例

```vue
<template>
  <el-menu>
    <SubMenu v-model:dataList="menuData" :level="1" />
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'

const menuData = ref([
  {
    path: '/documents',
    meta: {
      menuId: 'menu1',
      menuIcon: 'document',
      title: '文档管理'
    },
    children: [
      {
        path: '/documents/folder1',
        meta: {
          menuId: 'submenu1',
          menuIcon: 'folder',
          title: '文件夹1'
        }
      },
      {
        path: '/documents/folder2',
        meta: {
          menuId: 'submenu2',
          menuIcon: 'folder',
          title: '文件夹2'
        }
      }
    ]
  }
])
</script>
```

## 样式说明

1. **图标样式**：图标大小为 22px
2. **菜单项高度**：子菜单标题高度为 40px
3. **背景色**：不同层级有不同的背景色
4. **分隔线**：二级及以上菜单项之间有 2px 的白色分隔线
5. **弹出层样式**：弹出层背景色为 var(--star-horse-style)

## 注意事项

1. 菜单项通过 children 属性判断是否有子菜单
2. 图标默认为 'document'，可通过 meta.menuIcon 自定义
3. 支持无限层级递归渲染
4. 通过 compKey 函数生成唯一的 key 值
5. 叶子节点使用 router-link 实现路由跳转