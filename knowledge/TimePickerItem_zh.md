# TimePickerItem 组件

## 概述
TimePickerItem 是一个时间选择器组件，基于 Element Plus 的 el-time-picker 组件实现。它允许用户选择具体的时间点或时间范围。

## Props

继承自 ItemPreps：
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| isDesign | Boolean | false | 是否为设计模式 |
| disabled | Boolean | false | 是否禁用 |
| showFormItem | Boolean | false | 是否显示表单项 |
| bareFlag | Boolean | false | 是否需要css修饰 |
| isSearch | Boolean | false | 是否为搜索模式 |

## 方法

### itemAction(prep)
处理时间选择器的各种事件，调用 allAction 方法执行相关操作。

## 样式

组件设置了默认样式，使时间选择器的宽度自适应内容。

## 使用示例

```vue
<template>
  <time-picker-item
    :field="timePickerFieldConfig"
    v-model:form-data="formData"
    @selfFunc="handleSelfFunc"
    @selectItem="handleSelectItem"
  />
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  startTime: ''
})

const timePickerFieldConfig = {
  fieldName: 'startTime',
  label: '开始时间',
  preps: {
    placeholder: '请选择开始时间',
    format: 'HH:mm:ss'
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