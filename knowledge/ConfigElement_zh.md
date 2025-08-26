# Config Element Element Plus 配置

## 概述
Config Element 是一个 TypeScript 文件，专门用于配置 Element Plus UI 组件库。

## 核心功能

### Element Plus 配置函数
```typescript
import { App } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

// Element Plus 配置函数
export const configureElementPlus = (app: App<Element>, options?: any) => {
  // 只在没有配置时才设置中文
  if (!options?.locale) {
    app.use(ElementPlus, {
      locale: zhCn,
    });
  } else {
    app.use(ElementPlus, options);
  }
};
```

## 功能说明

### 国际化配置
- 默认使用中文语言包 (`zhCn`)
- 当未提供 `locale` 配置时自动设置为中文
- 支持自定义语言包配置

### 自定义选项支持
- 支持传入自定义 Element Plus 配置选项
- 保持与 Element Plus 官方配置选项一致
- 灵活的配置扩展性

### 按需配置
- 只在需要时才进行 Element Plus 配置
- 避免重复配置和冲突
- 提供默认配置以简化使用

## 使用示例

```typescript
import { createApp } from 'vue'
import { configureElementPlus } from './config/element'
import App from './App.vue'

const app = createApp(App)

// 使用默认配置（中文）
configureElementPlus(app)

// 使用自定义配置
configureElementPlus(app, {
  locale: en, // 英文语言包
  size: 'small',
  zIndex: 3000
})

app.mount('#app')
```

## 特性

1. **国际化支持** - 默认配置中文语言包
2. **灵活配置** - 支持自定义 Element Plus 选项
3. **按需加载** - 只在需要时进行配置
4. **避免冲突** - 检查现有配置避免重复设置
5. **类型安全** - 完整的 TypeScript 类型支持
6. **模块化设计** - 独立的配置模块便于维护