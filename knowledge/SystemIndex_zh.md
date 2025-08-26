# System Index 系统组件导出索引

## 概述
System Index 是一个 TypeScript 文件，用于统一导出 [system](file:///e:/lixycode/testcode/src/components/system) 目录下的所有系统组件，方便其他模块按需导入。

## 导出的组件

```typescript
export { default as StarHorseButtonList } from "./StarHorseButtonList.vue";
export { default as StarHorseMenu } from "./StarHorseMenu.vue";
export { default as StarHorseSvg } from "./StarHorseSvg.vue";
export { default as ContentMenu } from "./ContentMenu.vue";
```

## 组件说明

1. **StarHorseButtonList** - 按钮列表组件，用于显示操作按钮集合
2. **StarHorseMenu** - 菜单组件，用于导航菜单显示
3. **StarHorseSvg** - SVG 图标组件，用于显示矢量图标
4. **ContentMenu** - 内容菜单组件，用于右键上下文菜单

## 使用示例

```typescript
// 按需导入系统组件
import { StarHorseMenu, StarHorseButtonList } from '@/components/system'

// 在页面中使用
<template>
  <div>
    <star-horse-menu />
    <star-horse-button-list />
  </div>
</template>
```

## 特性

1. **统一导出** - 集中管理系统组件的导出
2. **按需导入** - 支持按需导入单个系统组件
3. **命名规范** - 使用 PascalCase 命名规范
4. **模块化** - 便于维护和扩展
5. **类型安全** - TypeScript 支持