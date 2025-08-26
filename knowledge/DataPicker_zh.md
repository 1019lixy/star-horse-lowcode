# DataPicker 数据选择器组件

## 概述
DataPicker 是一个数据选择器组件，支持树形结构数据选择、多选、搜索等功能，基于 Element Plus 的对话框和树形组件实现。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| modelValue | any | - | 模型值（v-model） |
| dataUrl | string | - | 数据接口地址 |
| proxy | boolean | - | 是否使用代理 |
| proxyUrl | string | - | 代理地址 |
| params | SearchParams[] | - | 接口参数 |
| pageSize | number | 0 | 分页大小 |
| datas | Array<any> | - | 静态数据 |
| title | string | - | 对话框标题 |
| compSize | string | "small" | 组件大小 |
| displayName | string | "name" | 显示名称字段 |
| displayValue | string | "value" | 显示值字段 |
| multiple | boolean | false | 是否多选 |
| checkStrictly | boolean | true | 是否严格选择 |
| selectLeaf | boolean | false | 是否只选叶子节点 |
| autoClose | boolean | true | 是否自动关闭弹窗 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | ModelValueType | 更新模型值时触发 |
| dataSubmit | Array<any> | 数据提交时触发 |

## 方法

### treeProps
树形组件属性配置：
- label: 显示名称字段
- children: 子节点字段
- value: 值字段
- isLeaf: 叶子节点标识字段
- class: 节点样式类函数

### handleCheckAll
全选/取消全选处理函数

### onNodeClick
节点点击处理函数

### dataSearch
数据搜索函数

### filterNode
节点过滤函数

## 使用示例

```vue
<template>
  <data-picker
    v-model="selectedData"
    :data-url="apiUrl"
    :params="searchParams"
    :multiple="true"
    :check-strictly="false"
    display-name="label"
    display-value="id"
    title="选择数据"
    @data-submit="handleDataSubmit"
  />
</template>

<script setup>
import { ref } from 'vue'
import DataPicker from '@/components/comp/utils/DataPicker.vue'

const selectedData = ref([])
const apiUrl = ref('/api/data/list')
const searchParams = ref([])

const handleDataSubmit = (data) => {
  console.log('选中的数据:', data)
}
</script>
```

## 特性

1. 支持树形结构数据展示
2. 支持单选和多选模式
3. 支持搜索过滤功能
4. 支持严格选择和非严格选择模式
5. 支持只选择叶子节点
6. 支持静态数据和接口数据
7. 支持分页加载数据