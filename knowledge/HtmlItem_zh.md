# HtmlItem HTML内容组件

## 概述
HtmlItem 是一个HTML内容显示组件，用于在表单中显示HTML格式的内容。组件支持从表单数据或配置参数中获取HTML内容并渲染显示。

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

无特定公开方法。

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
  content?: string;       // HTML内容
}
```

## 使用示例

### 从配置参数显示HTML内容
```vue
<template>
  <html-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({})

const fieldConfig = ref({
  fieldName: 'htmlContent',
  label: 'HTML内容',
  type: 'html',
  preps: {
    content: '<p>这是一段<strong>HTML</strong>内容</p><ul><li>列表项1</li><li>列表项2</li></ul>'
  }
})
</script>
```

### 从表单数据显示HTML内容
```vue
<template>
  <html-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  htmlContent: '<h3>动态HTML内容</h3><p>这是从表单数据中获取的内容</p>'
})

const fieldConfig = ref({
  fieldName: 'htmlContent',
  label: 'HTML内容',
  type: 'html'
})
</script>
```

## 注意事项

1. 组件通过 [v-html] 指令渲染HTML内容，需要注意XSS安全问题
2. HTML内容优先从表单数据 [formData[fieldName]] 获取，如果不存在则从配置参数 [preps.content] 获取
3. 组件会在 mounted 时将配置的HTML内容初始化到表单数据中
4. 组件具有最小高度30px，宽度100%的默认样式
5. 该组件主要用于显示静态HTML内容，不支持用户编辑
6. 由于使用 [v-html]，应确保内容来源可信，避免注入恶意代码