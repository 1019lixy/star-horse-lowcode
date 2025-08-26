# MenusInfo 菜单信息类型

## 概述
MenusInfo 是一组 TypeScript 接口类型，用于定义菜单信息和元信息。

## 主要类型

### Meta 元信息
```typescript
interface Meta {
  title: string;        // 标题
  menuId: string;       // 菜单Id
  keepAlive: boolean;   // 是否缓存页面
  menuIcon: string;     // 菜单图标
}
```

### MenusInfo 菜单信息
```typescript
export declare interface MenusInfo {
  path: string;         // 菜单路径
  component: object;    // 组件对象
  name: string;         // 菜单名称
  children: Array<MenusInfo>; // 子菜单
  meta: Meta;           // 菜单meta信息
}
```

## 使用示例

```typescript
import { MenusInfo } from '@/components/types/MenusInfo'

// 菜单信息示例
const menuInfo: MenusInfo = {
  path: '/dashboard',
  component: () => import('@/views/Dashboard.vue'),
  name: 'Dashboard',
  children: [],
  meta: {
    title: '仪表板',
    menuId: 'dashboard',
    keepAlive: true,
    menuIcon: 'dashboard-icon'
  }
}

// 嵌套菜单示例
const nestedMenu: MenusInfo = {
  path: '/system',
  component: () => import('@/views/System.vue'),
  name: 'System',
  children: [
    {
      path: '/system/user',
      component: () => import('@/views/system/User.vue'),
      name: 'User',
      children: [],
      meta: {
        title: '用户管理',
        menuId: 'user',
        keepAlive: true,
        menuIcon: 'user-icon'
      }
    }
  ],
  meta: {
    title: '系统管理',
    menuId: 'system',
    keepAlive: false,
    menuIcon: 'system-icon'
  }
}
```

## 特性

1. 完整的菜单信息定义
2. 支持嵌套子菜单结构
3. 支持页面缓存控制
4. 支持菜单图标配置
5. 支持菜单ID标识
6. 支持动态组件导入
7. 支持菜单标题配置