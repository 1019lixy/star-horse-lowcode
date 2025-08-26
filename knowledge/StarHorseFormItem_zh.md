# StarHorseFormItem 组件

## 概述
StarHorseFormItem 是一个表单项容器组件，用于根据字段配置动态渲染不同类型的表单组件。它支持多种布局类型，包括卡片、折叠面板、标签页等。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| dataIndex | Number | -1 | 数据索引 |
| propPrefix | String | "" | 父节点名称前缀 |
| parentPreps | Object | {} | 父级配置 |
| subFormFlag | String | "N" | 子表单标识 |
| batchName | String | "batchDataList" | 批量数据名称 |
| batchFieldName | String | "batchFieldList" | 批量字段名称 |
| compSize | String | Config.compSize | 组件大小 |
| source | Number | 1 | 数据源 |

## 方法

### checkItemType(item)
根据传入的 item 配置判断应该使用的组件类型：
- 如果 item 是数组，返回 "box-item"
- 如果 item 有 cardList 属性且长度大于 0，返回 "card-item"
- 如果 item 有 collapseList 属性且长度大于 0，返回 "collapse-item"
- 如果 item 有 dytableList 属性且长度大于 0，返回 "dytable-item"
- 如果 item 有 tabList 或 batchFieldList 属性且长度大于 0，返回 "tab-item"
- 其他情况返回 "other-item"

## 使用示例

```vue
<template>
  <star-horse-form-item
    :data-index="0"
    prop-prefix="user"
    :parent-preps="parentConfig"
    :sub-form-flag="'Y'"
    :batch-name="'userList'"
    :comp-size="'default'"
    :source="1"
    v-model:data-form="formData"
  />
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  // 表单数据
})

const parentConfig = {
  // 父级配置
}
</script>
```