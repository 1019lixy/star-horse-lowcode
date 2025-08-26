# DytableCol 组件

## 概述
DytableCol 是一个动态表格列组件，用于在动态表格容器中创建可调整大小的表格单元格。它支持拖拽添加组件、单元格大小调整和设计器操作。

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

1. **动态表格单元格**：创建可调整大小的表格单元格
2. **拖拽支持**：支持在单元格内拖拽添加组件
3. **大小调整**：支持通过拖拽调整单元格的宽度和高度
4. **设计器集成**：与表单设计器无缝集成
5. **容器操作**：支持对单元格进行各种容器操作

## 数据结构

### field 配置项
```javascript
{
  colspan: 1,          // 列合并数
  rowspan: 1,          // 行合并数
  colWidth: '100%',    // 列宽度
  colHeight: '40px',   // 行高度
  wordBreak: false,    // 是否换行
  items: []           // 单元格中的组件列表
}
```

## 方法

### onDragAdd(evt, dataList)
处理拖拽添加组件到单元格中的事件：
- 检查是否允许嵌套容器类型
- 防止动态表格容器嵌套其他容器
- 选择新添加的组件项

### handleTableCellCommand(command)
处理表格单元格操作命令，调用 tableCellOperation 方法执行相应操作。

### selectCurrentTd()
选择当前单元格，设置当前子项 ID。

### handleResizeStart(e)
处理单元格大小调整开始事件，记录初始位置和尺寸。

### handleResizeMove(e)
处理单元格大小调整移动事件，实时更新单元格尺寸。

### handleResizeEnd()
处理单元格大小调整结束事件，清理事件监听器。

## 样式特性

1. **调整手柄**：在单元格右侧和底部显示调整手柄
2. **悬停效果**：鼠标悬停时显示调整手柄
3. **调整状态**：调整大小时显示背景色变化
4. **禁用状态**：非编辑模式下隐藏调整手柄

## 依赖组件

- draggable: 拖拽组件
- ContainerDropDown: 容器下拉操作组件
- itemCheck: 组件类型检查工具函数

## 使用示例

```vue
<template>
  <dytable-col
    :field="dytableColConfig"
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

const dytableColConfig = {
  colspan: 1,
  rowspan: 1,
  colWidth: '200px',
  colHeight: '50px',
  wordBreak: true,
  _uuid: 'unique-id',
  items: [] // 单元格中的组件项
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

1. 动态表格容器不允许嵌套其他容器类型（box, tab, table, dytable, collapse, card）
2. 调整列宽时会同步更新所有行中相同列索引的宽度
3. 最小宽度和高度限制为 20px
4. 在设计模式下会显示容器操作按钮和调整手柄