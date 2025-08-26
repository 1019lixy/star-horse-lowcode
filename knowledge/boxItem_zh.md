# boxItem 盒子容器项组件

## 概述
boxItem 是一个盒子容器项组件，用于在表单中布局多个子项，支持栅格布局和条件显示。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| item | Array/Object | - | 容器内的子项列表 |
| dataIndex | Number | -1 | 数据索引 |
| propPrefix | String | "" | 属性前缀 |
| parentPreps | Object | {} | 父级配置 |
| subFormFlag | String | "N" | 子表单标识 |
| batchName | String | "batchDataList" | 批量数据名称 |
| batchFieldName | String | "batchFieldList" | 批量字段名称 |
| compSize | String | Config.compSize | 组件大小 |
| source | Number | 1 | 数据源标识 |

## Model

| 名称 | 类型 | 说明 |
|------|------|------|
| dataForm | Object | 数据表单对象 |

## 使用示例

```vue
<template>
  <box-item
    v-model:dataForm="formData"
    :item="boxItems"
    :data-index="currentIndex"
    :prop-prefix="propPrefix"
    :parent-preps="parentConfig"
    :comp-size="componentSize"
    :source="dataSourceId"
  />
</template>

<script setup>
import BoxItem from '@/components/comp/items/boxItem.vue'
import { ref } from 'vue'

const formData = ref({})
const boxItems = ref([
  {
    fieldName: 'name',
    label: '姓名',
    type: 'input',
    formVisible: true,
    required: true
  },
  {
    fieldName: 'email',
    label: '邮箱',
    type: 'input',
    formVisible: true,
    required: true
  }
])

const currentIndex = ref(0)
const propPrefix = ref('')
const parentConfig = ref({})
const componentSize = ref('small')
const dataSourceId = ref(1)
</script>
```

## 特性

1. 支持栅格布局（el-row 和 el-col）
2. 自动计算列宽
3. 支持条件显示（formVisible 和 viewVisible）
4. 集成表单验证
5. 支持不同类型的子项（普通表单项、按钮、自定义组件等）