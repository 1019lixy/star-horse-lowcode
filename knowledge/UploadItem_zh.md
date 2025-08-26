# UploadItem 组件

## 概述
UploadItem 是一个文件上传组件，基于 Element Plus 的 el-upload 组件实现。它支持普通上传和拖拽上传两种模式，并提供了完整的上传事件处理机制。

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

1. **多种上传模式**：支持普通点击上传和拖拽上传
2. **文件大小限制**：可配置最大文件大小限制
3. **完整的事件处理**：支持上传过程中的各种事件处理
4. **文件列表管理**：自动管理已上传文件列表
5. **Token认证**：自动添加认证Token到请求头

## 配置参数

通过 preps 属性配置上传参数：
- drag: 是否启用拖拽上传模式
- maxSize: 最大文件大小限制
- action: 上传接口地址，默认为 "/system-config/annex/upload/commonFiles"
- context: 上下文路径，默认为 "/system-config"
- headers: 自定义请求头

## 方法

### selfAction(prep, uploadFile, uploadFiles, param)
处理上传过程中的各种事件：
- change: 文件状态改变时触发
- error: 上传失败时触发
- exceed: 文件超出限制时触发
- preview: 点击文件链接时触发
- progress: 上传过程中触发
- remove: 文件移除时触发
- success: 上传成功时触发

## 样式

组件包含了一些自定义样式，确保上传组件在不同场景下的显示效果。

## 使用示例

```vue
<template>
  <upload-item
    :field="uploadFieldConfig"
    v-model:form-data="formData"
    @selfFunc="handleSelfFunc"
    @selectItem="handleSelectItem"
  />
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  attachment: ''
})

const uploadFieldConfig = {
  fieldName: 'attachment',
  label: '附件',
  preps: {
    drag: true, // 启用拖拽上传
    maxSize: '10MB', // 最大文件大小
    accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx', // 允许的文件类型
    multiple: false, // 是否允许多选
    limit: 1 // 最大上传文件数
  }
}

const handleSelfFunc = (prep, uploadFile, uploadFiles, param) => {
  // 处理上传事件
  console.log('上传事件:', prep, uploadFile, uploadFiles, param)
  
  if (prep === 'success') {
    console.log('上传成功，文件路径:', param.data.path)
  }
}

const handleSelectItem = (item) => {
  // 处理选择项事件
  console.log('选择项:', item)
}
</script>
```