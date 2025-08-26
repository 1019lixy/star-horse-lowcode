# Config Styles 样式配置

## 概述
Config Styles 是一个 TypeScript 文件，用于集中管理项目的样式导入和配置。

## 核心功能

### 样式导入
```typescript
import "tailwindcss/index.css";
import "@/assets/css/index.scss";
import "element-plus/theme-chalk/index.css";
import "@/assets/icons.css";
```

## 样式文件说明

### 1. Tailwind CSS
```typescript
import "tailwindcss/index.css";
```
- 导入 Tailwind CSS 样式库
- 提供实用优先的 CSS 框架
- 支持响应式设计和组件化样式

### 2. 自定义 SCSS 样式
```typescript
import "@/assets/css/index.scss";
```
- 导入项目自定义的 SCSS 样式文件
- 包含项目特定的样式变量和样式规则
- 支持 SCSS 预处理器功能

### 3. Element Plus 主题
```typescript
import "element-plus/theme-chalk/index.css";
```
- 导入 Element Plus 官方主题样式
- 提供组件库的默认外观和样式
- 支持主题定制和样式覆盖

### 4. 自定义图标样式
```typescript
import "@/assets/icons.css";
```
- 导入项目自定义图标样式
- 包含项目特定的图标字体和样式
- 支持自定义图标集合

## 使用示例

在项目的入口文件中导入样式配置：
```typescript
// main.ts 或 index.ts
import './config/styles'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
```

## 特性

1. **集中管理** - 统一管理所有样式文件的导入
2. **模块化设计** - 将样式配置独立为单独模块
3. **完整覆盖** - 包含所有必要的样式文件
4. **易于维护** - 便于添加、删除或修改样式文件
5. **顺序控制** - 确保样式文件按正确顺序导入
6. **类型安全** - TypeScript 支持