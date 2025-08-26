# TextItem 组件

## 概述
TextItem 是一个文本显示组件，用于在表单中显示静态文本内容。它支持丰富的样式配置，可以用于显示标题、说明文字等。

## Props

继承自 ItemPreps：
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| isDesign | Boolean | false | 是否为设计模式 |
| disabled | Boolean | false | 是否禁用 |
| showFormItem | Boolean | false | 是否显示表单项 |
| bareFlag | Boolean | false | 是否需要css修饰 |
| isSearch | Boolean | false | 是否为搜索模式 |

## 样式配置

组件支持通过 preps 属性配置丰富的样式：
- verticalAlign: 垂直对齐方式，默认为 'middle'
- justifyContent: 水平排列方式，默认为 'left'
- alignItems: 垂直排列方式，默认为 'left'
- wordBreak: 单词换行方式，默认为 'normal'
- width: 宽度，默认为 '100%'
- height: 高度，默认为 '100%'
- fontWeight: 字体粗细，默认为 '600'
- color: 文字颜色，默认为 'inherit'
- backgroundColor: 背景颜色，默认为 'none'
- borderRadius: 边框圆角，默认为 'none'
- border: 边框样式，默认为 'none'
- margin: 外边距，默认为 '0 5px'

## 方法

### itemAction(prep)
处理文本区域的点击事件，调用 allAction 方法执行相关操作。

## 使用示例

```vue
<template>
  <text-item
    :field="textFieldConfig"
    v-model:form-data="formData"
    @selfFunc="handleSelfFunc"
    @selectItem="handleSelectItem"
  />
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  // 文本组件通常不需要数据绑定
})

const textFieldConfig = {
  fieldName: 'title',
  label: '标题',
  preps: {
    textContent: '这是标题文字',
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    padding: '10px',
    textAlign: 'center'
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