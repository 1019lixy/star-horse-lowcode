# TimeItem 组件

## 概述
TimeItem 是一个时间选择组件，基于 Element Plus 的 el-time-select 组件实现。它允许用户从预定义的时间范围中选择时间。

## Props

继承自 ItemPreps：
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| isDesign | Boolean | false | 是否为设计模式 |
| disabled | Boolean | false | 是否禁用 |
| showFormItem | Boolean | false | 是否显示表单项 |
| bareFlag | Boolean | false | 是否需要css修饰 |
| isSearch | Boolean | false | 是否为搜索模式 |

## 时间配置

组件支持通过 preps 属性配置时间选择器的参数：
- start: 开始时间，默认为 '00:00'
- end: 结束时间，默认为 '24:00'
- step: 时间间隔，默认为 '00:05'

## 方法

### itemAction(prep)
处理时间选择器的各种事件，调用 allAction 方法执行相关操作。

## 样式

组件设置了默认样式，使时间选择器的宽度自适应内容。

## 使用示例

```vue
<template>
  <time-item
    :field="timeFieldConfig"
    v-model:form-data="formData"
    @selfFunc="handleSelfFunc"
    @selectItem="handleSelectItem"
  />
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  meetingTime: ''
})

const timeFieldConfig = {
  fieldName: 'meetingTime',
  label: '会议时间',
  preps: {
    start: '09:00',
    end: '18:00',
    step: '00:30',
    placeholder: '请选择会议时间'
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