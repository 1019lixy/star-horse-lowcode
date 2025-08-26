# FormComp Container Index 表单容器组件导出索引

## 概述
FormComp Container Index 是一个 TypeScript 文件，用于统一导出 [formcomp/container](file:///e:/lixycode/testcode/src/components/formcomp/container) 目录下的所有表单容器组件，方便其他模块按需导入。

## 导出的组件

```typescript
export { default as boxContainer } from "./box-container.vue";
export { default as cardContainer } from "./card-container.vue";
export { default as collapseContainer } from "./collapse-container.vue";
export { default as dytableContainer } from "./dytable-container.vue";
export { default as tabContainer } from "./tab-container.vue";
export { default as tableContainer } from "./table-container.vue";
```

## 组件说明

1. **boxContainer** - 盒子容器组件，用于基础布局
2. **cardContainer** - 卡片容器组件，用于卡片式布局
3. **collapseContainer** - 折叠容器组件，支持折叠展开功能
4. **dytableContainer** - 动态表格容器组件，用于复杂表格布局
5. **tabContainer** - 标签页容器组件，支持多标签页切换
6. **tableContainer** - 表格容器组件，用于表格布局

## 使用示例

```typescript
// 按需导入容器组件
import { tabContainer, cardContainer } from '@/components/formcomp/container'

// 在模板中使用
<template>
  <tab-container>
    <card-container>
      <!-- 内容 -->
    </card-container>
  </tab-container>
</template>
```

## 特性

1. **统一导出** - 集中管理表单容器组件的导出
2. **按需导入** - 支持按需导入单个容器组件
3. **命名规范** - 使用 camelCase 命名规范
4. **模块化** - 便于维护和扩展
5. **类型安全** - TypeScript 支持