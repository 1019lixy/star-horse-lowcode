# ContainerDropDown 容器下拉菜单组件

## 概述
ContainerDropDown 是一个容器下拉菜单组件，提供表格单元格的各种操作选项，如插入行列、合并单元格、移动行列等。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| parentField | Object | - | 父级字段配置 |
| disabled | Boolean/String | - | 是否禁用 |
| field | Object | - | 当前字段配置 |
| isFirstRow | Boolean | false | 是否为第一行 |
| isLastRow | Boolean | false | 是否为最后一行 |
| isFirstCol | Boolean | false | 是否为第一列 |
| isLastCol | Boolean | false | 是否为最后一列 |
| size | String | "small" | 组件大小 |
| rowIndex | Number | -1 | 行索引 |
| colIndex | Number | -1 | 列索引 |
| type | String | - | 容器类型 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| command | command | 执行命令时触发 |

## 方法

### checkMenuStatus
检查菜单项的可用状态

返回对象包含以下属性：
- mergeLeftColDisabled: 是否禁用合并左单元格
- mergeRightColDisabled: 是否禁用合并右单元格
- mergeWholeRowDisabled: 是否禁用合并整行
- mergeWholeColDisabled: 是否禁用合并整列
- mergeAboveRowDisabled: 是否禁用合并上单元格
- mergeBelowRowDisabled: 是否禁用合并下单元格
- undoMergeRowDisabled: 是否禁用撤销行合并
- undoMergeColDisabled: 是否禁用撤销列合并
- moveRowUpDisabled: 是否禁用上移一行
- moveRowDownDisabled: 是否禁用下移一行
- moveColLeftDisabled: 是否禁用左移一列
- moveColRightDisabled: 是否禁用右移一列

## 使用示例

```vue
<template>
  <container-drop-down
    :parent-field="parentField"
    :field="currentField"
    :is-first-row="isFirstRow"
    :is-last-row="isLastRow"
    :is-first-col="isFirstCol"
    :is-last-col="isLastCol"
    :row-index="rowIndex"
    :col-index="colIndex"
    :type="containerType"
    @command="handleCommand"
  />
</template>

<script setup>
import { ref } from 'vue'
import ContainerDropDown from '@/components/formcomp/utils/ContainerDropDown.vue'

const parentField = ref({})
const currentField = ref({})
const isFirstRow = ref(false)
const isLastRow = ref(false)
const isFirstCol = ref(false)
const isLastCol = ref(false)
const rowIndex = ref(0)
const colIndex = ref(0)
const containerType = ref('dytable')

const handleCommand = (command) => {
  console.log('执行命令:', command)
  // 处理各种表格操作命令
}
</script>
```