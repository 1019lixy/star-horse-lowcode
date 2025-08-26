# DataTag 数据标签组件

## 概述
DataTag 是一个数据标签组件，基于 Element Plus 的 el-tag 实现，用于显示带有关闭功能的数据标签。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| data | any | - | 标签数据 |
| displayName | string | "name" | 显示名称字段 |
| displayValue | string | "value" | 显示值字段 |
| type | string | "info" | 标签类型（success/info/warning/danger） |
| closable | boolean | false | 是否可关闭 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| close | id | 关闭标签时触发 |

## 使用示例

```vue
<template>
  <data-tag
    v-for="item in tagDataList"
    :key="item.id"
    :data="item"
    display-name="label"
    display-value="id"
    type="success"
    closable
    @close="handleTagClose"
  />
</template>

<script setup>
import DataTag from '@/components/comp/utils/DataTag.vue'

const tagDataList = ref([
  { id: 1, label: '标签1' },
  { id: 2, label: '标签2' },
  { id: 3, label: '标签3' }
])

const handleTagClose = (data) => {
  console.log('关闭标签:', data)
  // 从列表中移除该标签
  const index = tagDataList.value.findIndex(item => item.id === data.id)
  if (index !== -1) {
    tagDataList.value.splice(index, 1)
  }
}
</script>
```

## 特性

1. 支持自定义显示字段
2. 支持多种标签样式类型
3. 支持关闭功能
4. 支持圆角样式
5. 支持浅色效果