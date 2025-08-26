# EditDataDialog 数据编辑对话框组件

## 概述
EditDataDialog 是一个数据编辑对话框组件，提供文本内容的编辑功能，支持多行文本输入和字数统计。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| modelValue | Boolean | - | 对话框显示状态（v-model） |
| title | String | "编辑数据" | 对话框标题 |
| boxWidth | String | "50%" | 对话框宽度 |
| disabled | Boolean | false | 是否禁用编辑 |
| showFormItem | Boolean | false | 是否显示表单项 |
| placeholder | String | - | 输入框占位符 |
| initialContent | String | - | 初始内容 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | Boolean | 更新对话框显示状态 |
| confirm | String | 确认编辑内容时触发 |

## 使用示例

```vue
<template>
  <edit-data-dialog
    v-model="dialogVisible"
    title="编辑描述"
    :initial-content="content"
    placeholder="请输入描述内容..."
    @confirm="handleConfirm"
  />
</template>

<script setup>
import { ref } from 'vue'
import EditDataDialog from '@/components/formcomp/utils/EditDataDialog.vue'

const dialogVisible = ref(false)
const content = ref('初始内容')

const handleConfirm = (value) => {
  console.log('编辑后的内容:', value)
  content.value = value
  // 保存到数据库等操作
}
</script>
```