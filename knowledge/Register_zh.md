# Register 全局组件注册

## 概述
Register 是一个 TypeScript 文件，用于动态注册全局 Vue 组件。

## 功能说明

该文件实现了自动化的全局组件注册功能，通过 Vite 的 [import.meta.glob](file:///e:/lixycode/testcode/src/components/formcomp/utils/ItemRelationEventUtils.ts#L263-L263) API 动态导入指定目录下的所有 Vue 组件，并将它们注册为全局组件。

## 核心代码

```typescript
import { App, defineAsyncComponent } from "vue";

// 动态导入组件路径
const items = import.meta.glob([
  "@/components/comp/*.vue",
  "@/components/comp/items/*.vue",
  "@/components/system/*.vue",
  "@/components/formcomp/items/*.vue",
  "@/components/formcomp/container/*.vue",
]);

// 全局组件注册函数
export const registerGlobalComponents = (app: App<Element>) => {
  Object.entries(items).forEach(([path, component]) => {
    const name = path
      .split("/")
      .pop() // 获取文件名
      ?.replace(/\.vue$/, ""); // 移除扩展名

    if (name) {
      app.component(name, defineAsyncComponent(component as any));
    }
  });
};
```

## 注册的组件目录

1. `@/components/comp/*.vue` - 基础组件
2. `@/components/comp/items/*.vue` - 基础组件项
3. `@/components/system/*.vue` - 系统组件
4. `@/components/formcomp/items/*.vue` - 表单组件项
5. `@/components/formcomp/container/*.vue` - 表单容器组件

## 使用示例

```typescript
// 在 main.ts 或入口文件中使用
import { createApp } from 'vue'
import App from './App.vue'
import { registerGlobalComponents } from '@/components/register'

const app = createApp(App)

// 注册全局组件
registerGlobalComponents(app)

app.mount('#app')
```

## 特性

1. **自动化注册** - 自动扫描指定目录下的所有 Vue 组件
2. **异步加载** - 使用 `defineAsyncComponent` 实现组件的异步加载
3. **命名规则** - 自动从文件名提取组件名称（移除 .vue 扩展名）
4. **模块化管理** - 支持多个组件目录的统一注册
5. **性能优化** - 异步组件加载提升应用启动性能
6. **易于维护** - 新增组件无需手动注册