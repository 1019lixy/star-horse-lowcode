# Install 插件安装配置

## 概述
Install 是一个 TypeScript 文件，负责 Vue 插件的安装配置，包括路由注入、Element Plus 配置和全局组件注册。

## 核心功能

### 1. 插件安装方法
```typescript
export const install = (
  app: App<Element>,
  options?: {
    router?: Router;
    elementPlusOptions?: any;
  },
) => {
  // 注入宿主应用的 router 实例
  if (options?.router) {
    app.provide("starHorseRouter", options.router);
    window.__hostRouter__ = options.router;
  }

  // Element Plus 配置
  configureElementPlus(app, options?.elementPlusOptions);

  // 全局组件注册
  registerGlobalComponents(app);

  window.__starHorseHostApp__ = app;
};
```

### 2. 全局变量声明
```typescript
declare global {
  var __hostRouter__: Router | undefined;
  var __starHorseHostApp__: App<Element> | undefined;
}
```

### 3. 依赖模块导入
```typescript
import { App } from "vue";
import type { Router } from "vue-router";
import { registerGlobalComponents } from "./components/register";
import { configureElementPlus } from "./config/element";
```

## 功能说明

### 路由注入
- 通过 `app.provide` 向应用提供路由实例
- 通过全局变量 `__hostRouter__` 存储路由实例

### Element Plus 配置
- 调用 `configureElementPlus` 函数配置 Element Plus
- 支持自定义 Element Plus 选项

### 全局组件注册
- 调用 `registerGlobalComponents` 函数注册全局组件
- 自动扫描并注册指定目录下的所有 Vue 组件

### 应用实例存储
- 通过全局变量 `__starHorseHostApp__` 存储应用实例

## 使用示例

```typescript
import { createApp } from 'vue'
import { install } from './install'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 安装插件
install(app, {
  router: router,
  elementPlusOptions: {
    locale: zhCn,
    size: 'small'
  }
})

app.mount('#app')
```

## 特性

1. **模块化设计** - 将配置功能拆分为独立模块
2. **路由集成** - 支持注入宿主应用的路由实例
3. **Element Plus 配置** - 支持 Element Plus 自定义配置
4. **组件自动注册** - 自动注册所有全局组件
5. **类型安全** - 完整的 TypeScript 类型支持
6. **灵活配置** - 支持可选配置参数