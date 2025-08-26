# MarkdownItem Markdown编辑器组件

## 概述
MarkdownItem 是一个Markdown编辑器组件，基于 md-editor-v3 实现。提供实时预览功能，支持多种主题和语言设置，适用于编写和编辑Markdown格式的内容。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| isDesign | Boolean | 否 | false | 是否为设计模式 |
| disabled | Boolean | 否 | false | 是否禁用 |
| showFormItem | Boolean | 否 | false | 是否显示表单项 |
| bareFlag | Boolean | 否 | false | 是否为简洁模式 |
| isSearch | Boolean | 否 | false | 是否为搜索模式 |

## Events

| 事件名 | 参数 | 说明 |
|-------|------|------|
| selfFunc | - | 自定义函数事件 |
| selectItem | - | 选择项事件 |

## 方法

### init
初始化组件
```typescript
init(): Promise<void>
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;      // 字段名
  preps?: object;         // 配置参数
  // 其他字段属性...
}
```

### 配置参数 (preps)
```typescript
interface Preps {
  theme?: string;         // 主题('light'/'dark')，默认'light'
  language?: string;      // 语言('zh-CN'/'en-US')，默认'zh-CN'
  previewTheme?: string;   // 预览主题('default'/'github'等)，默认'default'
  codeTheme?: string;     // 代码主题('github'/'atom'等)，默认'github'
  // 其他 md-editor-v3 支持的属性
}
```

## 使用示例

```vue
<template>
  <markdown-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  markdownContent: '# 标题\n\n这是**Markdown**内容。\n\n- 列表项1\n- 列表项2'  // 存储Markdown内容
})

const fieldConfig = ref({
  fieldName: 'markdownContent',
  label: 'Markdown编辑',
  type: 'markdown',
  preps: {
    theme: 'light',        // 主题
    language: 'zh-CN',     // 语言
    previewTheme: 'github' // 预览主题
  }
})
</script>
```

## 注意事项

1. 组件基于 md-editor-v3 实现，提供完整的Markdown编辑功能
2. 支持实时预览，编辑器分为编辑区域和预览区域
3. 默认最小高度为400px，宽度为100%
4. 支持多种主题配置，包括编辑器主题、预览主题和代码主题
5. 组件会自动处理内容的双向绑定
6. 支持中文界面，默认语言为'zh-CN'
7. 在 mounted 和 updated 生命周期钩子中都会调用初始化方法
8. 组件会自动导入所需的CSS样式文件
9. 可通过 [preps] 配置项自定义编辑器的各种属性