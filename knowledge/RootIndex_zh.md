# Root Index 项目入口文件

## 概述
Root Index 是项目的主入口文件，负责插件安装、全局配置、组件注册和模块导出。

## 核心功能

### 1. 插件安装
```typescript
const install = (
  app: App<Element>,
  options?: {
    router?: Router;
    axiosInstance?: AxiosInstance;
    elementPlusOptions?: any;
  },
) => {
  // 注入宿主应用的 router 实例
  if (options?.router) {
    window.__hostRouter__ = options.router;
  }
  // 注入axios实例
  if (options?.axiosInstance) {
    window.__hostAxios__ = options.axiosInstance;
  }
  // Element Plus 配置
  if (!options?.elementPlusOptions?.locale) {
    app.use(ElementPlus, {
      locale: zhCn,
    });
  } else {
    app.use(ElementPlus, options.elementPlusOptions);
  }
  // 存储应用实例
  window.__starHorseHostApp__ = app;
  // 全局组件注册
  registerComponents(app);
};
```

### 2. 全局样式导入
```typescript
import "tailwindcss/index.css";
import "@/assets/css/index.scss";
import "@/assets/icons.css";
```

### 3. 全局变量声明
```typescript
declare global {
  var __hostRouter__: Router | undefined;
  var __hostAxios__: AxiosInstance | undefined;
  var __starHorseHostApp__: App<Element> | undefined;
}
```

### 4. 组件自动注册
```typescript
const items = import.meta.glob([
  "@/components/comp/*.vue",
  "@/components/comp/items/*.vue",
  "@/components/system/*.vue",
  "@/components/formcomp/items/*.vue",
  "@/components/formcomp/container/*.vue",
]);

Object.entries(items).forEach(([path, component]) => {
  const name = path
    .split("/")
    .pop()
    ?.replace(/\.vue$/, "");

  if (name) {
    app.component(name, defineAsyncComponent(component as any));
  }
});
```

### 5. 模块导出
```typescript
// API 模块
export * from "@/api/star_horse_apis";
export * from "@/api/star_horse_utils";
export * from "@/api/date_utils";
export * from "@/api/system";
export * from "@/api/user_func";
export * from "@/utils/message";
export * from "@/api/finger_utils";

// 组件模块
export * from "@/components/comp";
export * from "@/components/formcomp/container";
export * from "@/components/formcomp/items";
export * from "@/components/system";
export * from "@/components/types";

// Store 模块
export * from "@/store/ButtonPermission";
export * from "@/store/ConsumerView";
export * from "@/store/ContinusConfig";
export * from "@/store/CopyerOperation";
export * from "@/store/DesignForm";
export * from "@/store/DesignPage";
export * from "@/store/DynamicForm";
export * from "@/store/GlobalConfig";
export * from "@/store/SelfOperation";
export * from "@/store/UserInfo";

// 实例导出
export { piniaInstance, starHorseAxios };
```

## 使用示例

### 作为插件安装
```typescript
import { createApp } from 'vue'
import StarHorse from 'star-horse-lowcode'
import App from './App.vue'

const app = createApp(App)

app.use(StarHorse, {
  router: router,
  axiosInstance: axios,
  elementPlusOptions: {
    locale: zhCn
  }
})

app.mount('#app')
```

### 按需导入组件
```typescript
import { StarHorseForm, StarHorseTableComp } from 'star-horse-lowcode'
```

### 使用API工具
```typescript
import { postRequest, getRequest } from 'star-horse-lowcode'
```

## 特性

1. **插件化设计** - 支持 Vue 插件安装方式
2. **全局配置** - 自动配置 Element Plus 和样式
3. **组件自动注册** - 自动注册所有组件为全局组件
4. **按需导入** - 支持按需导入特定模块
5. **宿主应用集成** - 支持注入宿主应用的 router 和 axios
6. **国际化支持** - 默认配置中文语言包
7. **模块化导出** - 完整导出所有功能模块
8. **类型安全** - 完整的 TypeScript 类型支持