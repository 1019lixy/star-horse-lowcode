# BoxCol 组件

## 概述
BoxCol 是一个栅格布局列组件，用于在表单设计器中创建栅格布局的列。它是基于 Element Plus 的 el-col 组件实现的，支持拖拽添加组件和容器操作。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| parentField | Object | - | 父级字段配置 |
| formInfo | Object | - | 表单信息 |
| parentComp | Object | - | 父级组件 |
| isDesign | Boolean | false | 是否为设计模式 |
| showFormItem | Boolean | false | 是否显示表单项 |
| disabled | Object | - | 禁用状态 |
| field | Object | - | 当前列的字段配置 |
| isFirstRow | Boolean | false | 是否为第一行 |
| isLastRow | Boolean | false | 是否为最后一行 |
| isFirstCol | Boolean | false | 是否为第一列 |
| isLastCol | Boolean | false | 是否为最后一列 |
| rowIndex | Number | -1 | 行索引 |
| colIndex | Number | -1 | 列索引 |

## 功能特性

1. **栅格布局**：基于 Element Plus 的 el-col 组件实现栅格布局
2. **拖拽支持**：支持拖拽添加组件到列中
3. **容器操作**：支持对列进行各种容器操作
4. **设计器支持**：在设计模式下提供可视化操作界面

## 方法

### onDragAdd(evt, dataList)
处理拖拽添加组件到列中的事件：
- 检查是否允许嵌套容器类型
- 防止栅格容器嵌套其他容器
- 选择新添加的组件项

### handleTableCellCommand(command)
处理表格单元格操作命令，调用 tableCellOperation 方法执行相应操作。

### selectCurrentTd()
选择当前列，设置当前子项 ID。

### checkItem(items)
检查并初始化列中的组件项数组。

## 依赖组件

- draggable: 拖拽组件
- ContainerDropDown: 容器下拉操作组件
- itemCheck: 组件类型检查工具函数

## 使用示例

```vue
<template>
  <box-col
    :field="boxColConfig"
    :parent-field="parentFieldConfig"
    :form-info="formInfo"
    :is-design="true"
    :show-form-item="false"
    :disabled="false"
    :is-first-row="true"
    :is-last-row="false"
    :is-first-col="true"
    :is-last-col="false"
    :row-index="0"
    :col-index="0"
    v-model:form-data="formData"
  />
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  // 表单数据
})

const boxColConfig = {
  colspan: 12, // 列宽度
  _uuid: 'unique-id', // 唯一标识
  items: [] // 列中的组件项
}

const parentFieldConfig = {
  // 父级字段配置
}

const formInfo = {
  // 表单信息
}
</script>
```

## 注意事项

1. 栅格容器不允许嵌套其他容器类型（box, tab, table, dytable, collapse, card）
2. 在设计模式下会显示容器操作按钮
3. 支持响应式栅格布局，通过 colspan 属性控制列宽度