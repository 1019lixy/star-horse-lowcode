# cardItem 卡片容器项组件

## 概述
cardItem 是一个卡片容器项组件，用于在表单中显示卡片布局，支持卡片标题、头部字段和子表单。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| item | Object | - | 卡片配置项 |
| dataIndex | Number | -1 | 数据索引 |
| propPrefix | String | "" | 属性前缀 |
| parentPreps | Object | {} | 父级配置 |
| subFormFlag | String | "N" | 子表单标识 |
| batchName | String | "batchDataList" | 批量数据名称 |
| batchFieldName | String | "batchFieldList" | 批量字段名称 |
| compSize | String | Config.compSize | 组件大小 |
| source | Number | 1 | 数据源标识 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| addRow | row | 添加行数据时触发 |
| removeRow | row | 删除行数据时触发 |

## Model

| 名称 | 类型 | 说明 |
|------|------|------|
| dataForm | Object | 数据表单对象 |

## 使用示例

```vue
<template>
  <card-item
    v-model:dataForm="formData"
    :item="cardConfig"
    :data-index="currentIndex"
    :prop-prefix="propPrefix"
    :parent-preps="parentConfig"
    :comp-size="componentSize"
    :source="dataSourceId"
    @add-row="handleAddRow"
    @remove-row="handleRemoveRow"
  />
</template>

<script setup>
import CardItem from '@/components/comp/items/cardItem.vue'
import { ref } from 'vue'

const formData = ref({})
const cardConfig = ref({
  cardList: [
    {
      title: '基本信息',
      headerFieldList: [
        {
          fieldName: 'title',
          label: '标题',
          type: 'input',
          formVisible: true
        }
      ],
      fieldList: [
        {
          fieldName: 'content',
          label: '内容',
          type: 'textarea',
          formVisible: true
        }
      ]
    }
  ]
})

const currentIndex = ref(0)
const propPrefix = ref('')
const parentConfig = ref({})
const componentSize = ref('small')
const dataSourceId = ref(1)

const handleAddRow = (row) => {
  console.log('添加行数据:', row)
}

const handleRemoveRow = (row) => {
  console.log('删除行数据:', row)
}
</script>
```

## 特性

1. 支持 Element Plus 卡片组件（el-card）
2. 可自定义卡片标题
3. 支持头部字段列表
4. 集成子表单功能
5. 支持帮助信息提示
6. 支持动态添加和删除行数据