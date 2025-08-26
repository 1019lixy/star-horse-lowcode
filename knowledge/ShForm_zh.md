# ShForm 组件

## 概述
ShForm 是一个基于 Element Plus 的表单组件，提供了表单验证和字段管理功能。它支持滚动条显示和自定义插槽。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| needScroller | Boolean | true | 是否需要滚动条 |

## 插槽 (Slots)

| 插槽名 | 说明 |
|--------|------|
| header | 表单头部内容 |
| default | 表单主体内容 |
| empty | 表单主体空内容 |
| button | 表单按钮区域 |

## 方法 (Methods)

| 方法名 | 参数 | 说明 |
|--------|------|------|
| getFields | - | 获取表单字段 |
| validate | - | 验证表单并返回验证结果 |

## 使用示例

```vue
<template>
  <sh-form v-model:dataForm="formData" ref="shFormRef">
    <template #header>
      <h2>表单标题</h2>
    </template>
    
    <el-form-item label="用户名">
      <el-input v-model="formData.username"></el-input>
    </el-form-item>
    
    <template #button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </template>
  </sh-form>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formData = reactive({
  username: ''
})

const shFormRef = ref()

const submitForm = async () => {
  const valid = await shFormRef.value.validate()
  if (valid) {
    console.log('表单验证通过', formData)
  }
}
</script>
```