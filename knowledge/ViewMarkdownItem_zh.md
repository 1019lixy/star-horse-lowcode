# ViewMarkdownItem 组件

## 概述
ViewMarkdownItem 是一个 Markdown 内容展示组件，用于将 Markdown 格式的文本渲染为 HTML 内容显示。它基于 markdown-it 库实现 Markdown 解析和渲染。

## Props

继承自 ItemPreps：
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| isDesign | Boolean | false | 是否为设计模式 |
| disabled | Boolean | false | 是否禁用 |
| showFormItem | Boolean | false | 是否显示表单项 |
| bareFlag | Boolean | false | 是否需要css修饰 |
| isSearch | Boolean | false | 是否为搜索模式 |

## 功能特性

1. **Markdown 渲染**：将 Markdown 格式文本渲染为 HTML 内容
2. **响应式更新**：支持组件更新时重新渲染 Markdown 内容
3. **样式定制**：提供基础样式支持

## 依赖库

- markdown-it: Markdown 解析和渲染库

## 方法

### init()
初始化 Markdown 解析器，在组件挂载和更新时调用。

## 样式

组件包含基础样式，设置了最小高度为 400px，宽度为 100%。

## 使用示例

```vue
<template>
  <view-markdown-item
    :field="markdownFieldConfig"
    v-model:form-data="formData"
    @selfFunc="handleSelfFunc"
    @selectItem="handleSelectItem"
  />
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  content: '# 标题\n\n这是**Markdown**格式的内容。\n\n- 列表项1\n- 列表项2\n\n[链接](https://example.com)'
})

const markdownFieldConfig = {
  fieldName: 'content',
  label: '内容',
  preps: {
    placeholder: '请输入Markdown格式的内容'
  }
}

const handleSelfFunc = (prep, ...args) => {
  // 处理自定义事件
  console.log('自定义事件:', prep, args)
}

const handleSelectItem = (item) => {
  // 处理选择项事件
  console.log('选择项:', item)
}
</script>
```

## 注意事项

1. 组件仅用于展示 Markdown 内容，不支持编辑功能
2. 确保传入的 Markdown 内容是安全的，避免 XSS 攻击
3. 组件会在挂载和更新时重新初始化 Markdown 解析器