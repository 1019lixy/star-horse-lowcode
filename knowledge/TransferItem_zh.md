# TransferItem 组件

## 概述
TransferItem 是一个穿梭框组件，基于 Element Plus 的 el-transfer 组件实现。它允许用户在两个列表之间移动数据项，常用于选择多个选项的场景。

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

1. **数据穿梭**：支持在两个列表之间移动数据项
2. **动态数据加载**：支持从远程加载数据选项
3. **数据监听**：监听表单数据变化并更新选项列表

## 方法

### itemAction(prep)
处理穿梭框的各种事件，调用 allAction 方法执行相关操作。

### initData()
初始化组件数据，从远程加载选项数据。

## 数据结构

### SelectOption
```typescript
interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}
```

## 使用示例

```vue
<template>
  <transfer-item
    :field="transferFieldConfig"
    v-model:form-data="formData"
    @selfFunc="handleSelfFunc"
    @selectItem="handleSelectItem"
  />
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  selectedUsers: []
})

const transferFieldConfig = {
  fieldName: 'selectedUsers',
  label: '选择用户',
  preps: {
    data: [
      { label: '用户1', value: 1 },
      { label: '用户2', value: 2 },
      { label: '用户3', value: 3 }
    ],
    titles: ['待选择', '已选择'],
    buttonTexts: ['移除', '添加']
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