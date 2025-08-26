# UserItem 组件

## 概述
UserItem 是一个用户选择组件，结合了 Element Plus 的 el-mention 组件和自定义对话框。它允许用户通过@方式提及用户，并通过弹窗选择用户数据。

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

1. **用户提及功能**：支持通过@方式提及用户
2. **弹窗选择**：点击图标可打开用户选择对话框
3. **数据映射**：支持自定义字段映射关系
4. **回调处理**：支持选择后的回调处理

## 配置参数

通过 preps 属性配置组件参数：
- compName: 用户选择组件名称
- needField: 需要映射的字段列表
- aliasName: 别名字段
- recall: 选择后的回调函数

## 数据结构

### FieldMapping
```typescript
interface FieldMapping {
  sourceField: string; // 源字段
  distField: string;   // 目标字段
}
```

## 方法

### itemAction(prep)
处理提及组件的各种事件，调用 allAction 方法执行相关操作。

### selectItem(row)
处理用户选择事件，将选中的用户数据映射到表单字段。

### closeAction()
关闭用户选择对话框。

### showVisible()
显示用户选择对话框，并初始化数据。

## 依赖组件

- star-horse-dialog: 用户选择对话框
- el-mention: Element Plus 的提及组件
- star-horse-icon: 图标组件

## 使用示例

```vue
<template>
  <user-item
    :field="userFieldConfig"
    v-model:form-data="formData"
    @selfFunc="handleSelfFunc"
    @selectItem="handleSelectItem"
  />
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  participants: '',
  participantIds: ''
})

const userFieldConfig = {
  fieldName: 'participants',
  label: '参与人',
  preps: {
    compName: 'UserSelectTable', // 用户选择组件名称
    aliasName: 'participantIds', // 别名字段，存储用户ID
    needField: [
      {
        sourceField: 'name',    // 源字段（用户表中的字段）
        distField: 'participants' // 目标字段（表单中的字段）
      },
      {
        sourceField: 'employeeNo', // 源字段（用户表中的字段）
        distField: 'participantIds' // 目标字段（表单中的字段）
      }
    ],
    placeholder: '请输入并@选择用户'
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