# TSelectItem 组件

## 概述
TSelectItem 是一个树形选择器组件，基于 Element Plus 的 el-tree-select 组件实现。它支持树形结构数据的选择，适用于组织架构、分类选择等场景。

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

1. **树形选择**：支持树形结构数据的选择
2. **多选支持**：支持多选模式，包含全选功能
3. **动态数据加载**：支持从远程加载树形数据
4. **节点过滤**：支持根据输入内容过滤树节点
5. **自定义渲染**：支持自定义节点内容渲染
6. **选项管理**：支持动态添加选项

## 方法

### itemAction(prep)
处理树形选择器的各种事件，调用 allAction 方法执行相关操作。

### onAddOption()
显示添加选项的输入框。

### onConfirm()
确认添加新选项，进行重复性校验。

### clear()
清空添加选项的输入内容。

### handleCheckAll(val)
处理全选/取消全选操作。

### filterNodeMethod(value, data)
过滤树节点的方法，根据输入内容筛选匹配的节点。

### renderContent(h, data)
自定义渲染树节点内容，支持显示代码信息。

### initData()
初始化组件数据，从远程加载树形数据。

## 插槽

### header
在多选模式下显示全选复选框。

### footer
显示添加选项的按钮和输入框。

## 使用示例

```vue
<template>
  <tselect-item
    :field="tselectFieldConfig"
    v-model:form-data="formData"
    @selfFunc="handleSelfFunc"
    @selectItem="handleSelectItem"
  />
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  department: ''
})

const tselectFieldConfig = {
  fieldName: 'department',
  label: '部门',
  preps: {
    multiple: false,
    showFooter: true,
    data: [
      {
        label: '技术部',
        value: 1,
        children: [
          { label: '前端组', value: 11 },
          { label: '后端组', value: 12 }
        ]
      },
      {
        label: '产品部',
        value: 2,
        children: [
          { label: '产品组', value: 21 },
          { label: '设计组', value: 22 }
        ]
      }
    ],
    props: {
      label: 'label',
      value: 'value',
      children: 'children'
    }
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