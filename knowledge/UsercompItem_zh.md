# UsercompItem 组件

## 概述
UsercompItem 是一个自定义组件容器，用于动态加载和渲染用户自定义的 Vue 组件。它通过 component 标签的 is 属性实现动态组件渲染。

## Props

继承自 ItemPreps：
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| isDesign | Boolean | false | 是否为设计模式 |
| disabled | Boolean | false | 是否禁用 |
| showFormItem | Boolean | false | 是否显示表单项 |
| bareFlag | Boolean | false | 是否需要css修饰 |
| isSearch | Boolean | false | 是否为搜索模式 |
| source | Number | 0 | 数据源标识 |

## 功能特性

1. **动态组件渲染**：根据配置动态加载并渲染用户自定义组件
2. **属性透传**：将 field.preps 中的配置作为属性传递给自定义组件
3. **数据双向绑定**：支持与父组件的数据双向绑定

## 计算属性

### currentComponent
计算属性，返回需要渲染的组件名称，从 props.field.preps.compName 中获取。

## 方法

### loadComponent()
组件挂载时调用的异步方法，用于加载自定义组件。

## 使用示例

```vue
<template>
  <usercomp-item
    :field="usercompFieldConfig"
    v-model:form-data="formData"
    :source="1"
    @selfFunc="handleSelfFunc"
    @selectItem="handleSelectItem"
  />
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  customData: {}
})

const usercompFieldConfig = {
  fieldName: 'customComponent',
  label: '自定义组件',
  preps: {
    compName: 'MyCustomComponent', // 自定义组件名称
    // 其他传递给自定义组件的属性
    placeholder: '请输入内容',
    readonly: false
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

1. 确保自定义组件已在项目中正确注册
2. 自定义组件需要支持 v-model:dataForm 进行数据绑定
3. 自定义组件应支持 showFormItem、isDesign、disabled、bareFlag 等属性