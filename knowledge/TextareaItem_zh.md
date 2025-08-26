# TextareaItem 组件

## 概述
TextareaItem 是一个文本域输入组件，基于 Element Plus 的 el-input 组件实现。它支持双击打开大文本编辑对话框，适用于需要输入大量文本的场景。

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

1. **文本输入**：基础的多行文本输入功能
2. **双击编辑**：双击文本域可打开大文本编辑对话框
3. **事件处理**：支持完整的事件处理机制
4. **禁用状态**：支持禁用状态控制

## 方法

### itemAction(prep)
处理文本域的各种事件，调用 allAction 方法执行相关操作。

### maxEdit()
处理双击事件，显示大文本编辑对话框。

### handleContentConfirm(newContent)
处理大文本编辑对话框的确认事件，更新表单数据。

## 依赖组件

- EditDataDialog：大文本编辑对话框组件
- starhorse-form-item：表单项容器组件

## 使用示例

```vue
<template>
  <textarea-item
    :field="textareaFieldConfig"
    v-model:form-data="formData"
    @selfFunc="handleSelfFunc"
    @selectItem="handleSelectItem"
  />
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  description: ''
})

const textareaFieldConfig = {
  fieldName: 'description',
  label: '描述',
  preps: {
    placeholder: '请输入描述信息',
    rows: 4
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