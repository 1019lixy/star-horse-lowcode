# HtmleditorItem HTML编辑器组件

## 概述
HtmleditorItem 是一个HTML编辑器组件，基于 Vue Quill 实现。提供富文本编辑功能，支持文本格式化、图片上传等特性。

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

### handleCreated
处理编辑器创建完成事件
```typescript
handleCreated(editor: any): void
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
  height?: string;        // 编辑器高度，默认'300px'
  // 其他 Quill Editor 支持的属性
}
```

### 模块配置 (modules)
```typescript
interface Modules {
  name: string;           // 模块名称
  module: any;            // 模块实现
  options: object;        // 模块选项
}
```

## 使用示例

```vue
<template>
  <htmleditor-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  content: '<p>初始内容</p>'  // 存储编辑器内容
})

const fieldConfig = ref({
  fieldName: 'content',
  label: '内容编辑',
  type: 'htmleditor',
  preps: {
    height: '400px'  // 设置编辑器高度
  }
})
</script>
```

## 注意事项

1. 组件基于 Vue Quill 实现，提供完整的富文本编辑功能
2. 支持图片上传功能，通过配置的上传接口处理图片上传
3. 编辑器高度通过 [preps.height] 配置，默认为300px
4. 组件会自动处理内容的双向绑定
5. 图片上传接口为 "/upload-image"，可根据实际需求修改
6. 使用了 snow 主题，提供现代化的编辑器界面
7. 支持完整的工具栏功能，包括文本格式化、列表、链接等
8. 组件会记录编辑器实例，便于后续操作