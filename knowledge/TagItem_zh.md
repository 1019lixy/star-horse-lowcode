# TagItem 组件

## 概述
TagItem 是一个基于 Element Plus 的标签组件，用于显示带有样式的标签。它支持自定义标签类型和点击事件处理。

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

### tagType(val)
根据传入的值和预设的 tagMap 来确定标签的类型：
- 如果配置了 tagMap 且不为空，则从 tagMap 中查找对应的标签类型
- 如果未找到匹配项或未配置 tagMap，则使用预设的 tagType 或默认的 "primary" 类型

### itemAction(prep)
处理标签的点击事件，调用 allAction 方法执行相关操作。

## 使用示例

```vue
<template>
  <tag-item
    :field="tagFieldConfig"
    v-model:form-data="formData"
    @selfFunc="handleSelfFunc"
    @selectItem="handleSelectItem"
  />
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  status: 'active'
})

const tagFieldConfig = {
  fieldName: 'status',
  label: '状态',
  preps: {
    tagMap: {
      active: 'success',
      inactive: 'danger'
    },
    placeholder: '请选择状态'
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