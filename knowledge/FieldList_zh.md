# FieldList 字段列表组件

## 概述
FieldList 是一个字段列表组件，用于展示可拖拽的组件列表，支持按类型分类显示容器、基础组件和自定义组件。

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| selectData | item | 选择数据项时触发 |

## Store

该组件使用 `useDesignFormStore` Pinia store，访问以下数据：

- formDataList: 基础组件列表
- containerList: 容器组件列表
- selfFormDataList: 自定义组件列表

## 使用示例

```vue
<template>
  <field-list @select-data="handleSelectData" />
</template>

<script setup>
import FieldList from '@/components/formcomp/utils/FieldList.vue'

const handleSelectData = (item) => {
  console.log('选中的组件项:', item)
  // 处理组件项选择逻辑
  // 例如：添加到设计区域
}
</script>
```

## 组件结构

组件包含三个主要部分：
1. 容器组件列表
2. 基础组件列表
3. 自定义组件列表

每个列表项都显示组件图标和名称，点击后会触发 [selectData](file:///e:/lixycode/testcode/src/components/formcomp/utils/FieldList.vue#L17-L19) 事件。