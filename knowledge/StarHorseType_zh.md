# StarHorseType 标签类型

## 概述
StarHorseType 是一个 TypeScript 接口类型，用于定义标签页的属性信息。

## 类型定义

```typescript
export declare interface Tags {
  name: string;             // 中文名字
  path: string;             // 路由地址
  componentName: string;    // 组件名称
  menuIcon: string;         // 菜单图标
}
```

## 使用示例

```typescript
import { Tags } from '@/components/types/StarHorseType'

// 标签页示例
const tag: Tags = {
  name: '用户管理',
  path: '/system/user',
  componentName: 'UserManagement',
  menuIcon: 'user-icon'
}

// 标签页数组示例
const tags: Tags[] = [
  {
    name: '首页',
    path: '/dashboard',
    componentName: 'Dashboard',
    menuIcon: 'home-icon'
  },
  {
    name: '用户管理',
    path: '/system/user',
    componentName: 'UserManagement',
    menuIcon: 'user-icon'
  },
  {
    name: '角色管理',
    path: '/system/role',
    componentName: 'RoleManagement',
    menuIcon: 'role-icon'
  }
]

// 在标签页组件中使用
const openTag = (tag: Tags) => {
  // 路由跳转
  router.push(tag.path)
  // 设置当前激活的标签
  activeTag.value = tag
}
```

## 特性

1. 完整的标签页信息定义
2. 支持中文名称显示
3. 支持路由地址配置
4. 支持组件名称标识
5. 支持菜单图标配置
6. 适用于标签页导航系统