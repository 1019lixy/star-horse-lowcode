# TableContainer 组件

## 概述
TableContainer 是一个表格容器组件，用于创建简单的列式表格布局。它基于原生 HTML 表格元素实现，支持拖拽添加组件和列管理功能。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| parentField | String | - | 父级字段配置 |
| isDesign | Boolean | false | 是否为设计模式 |
| showFormItem | Boolean | false | 是否显示表单项 |
| disabled | Object | - | 禁用状态 |
| formInfo | Object | - | 表单信息 |
| field | Object | - | 容器字段配置 |

## 功能特性

1. **表格布局**：基于原生 HTML 表格元素实现简单的列式表格布局
2. **拖拽支持**：支持在表格单元格中拖拽添加组件
3. **设计器集成**：与表单设计器无缝集成
4. **列管理**：支持动态添加和删除表格列
5. **列标题**：自动生成列标题，支持自定义标题

## 数据结构

### field 配置项
```javascript
{
  preps: {
    columns: 3, // 表格列数
    elements: [
      {
        colIndex: 1, // 列索引
        items: []   // 列中的组件列表
      },
      {
        colIndex: 2,
        items: []
      },
      {
        colIndex: 3,
        items: []
      }
    ]
  }
}
```

## 方法

### onDragAdd(evt, dataList)
处理拖拽添加组件到表格单元格中的事件：
- 检查是否允许嵌套容器类型
- 防止容器嵌套其他容器
- 选择新添加的组件项

### analysisData(index)
分析并获取指定列的标题：
- 根据列索引查找对应的元素
- 如果未找到则创建新的列元素
- 返回列标题，如果未设置则返回默认标题

### tdOver(evt, index)
处理鼠标进入表格单元格的事件，用于显示列操作按钮。

### tdOut(evt, index)
处理鼠标离开表格单元格的事件，用于隐藏列操作按钮。

### deleteCol(index)
删除指定列，会弹出确认对话框，确认后删除列及其包含的所有组件。

## 样式特性

1. **表格样式**：设置了表格边框、间距等样式
2. **表头样式**：表头具有特殊的背景色和高度
3. **单元格样式**：单元格具有边框和内边距
4. **设计器样式**：在设计模式下显示特殊边框和操作按钮

## 依赖组件

- group-container: 组容器组件
- draggable: 拖拽组件
- star-horse-icon: 图标组件
- itemCheck: 组件类型检查工具函数

## 使用示例

```vue
<template>
  <table-container
    :field="tableContainerConfig"
    :parent-field="parentFieldConfig"
    :form-info="formInfo"
    :is-design="true"
    :show-form-item="false"
    :disabled="false"
    v-model:form-data="formData"
  />
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  // 表单数据
})

const tableContainerConfig = {
  preps: {
    columns: 3, // 3列表格
    elements: [
      {
        colIndex: 1,
        items: [] // 第一列组件
      },
      {
        colIndex: 2,
        items: [] // 第二列组件
      },
      {
        colIndex: 3,
        items: [] // 第三列组件
      }
    ]
  }
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

1. 表格容器不允许嵌套其他容器类型（box, tab, table, dytable, collapse, card）
2. 表格列数通过 field.preps.columns 属性控制
3. 每一列通过 colIndex 属性标识
4. 在设计模式下，鼠标悬停在列标题上会显示删除按钮
5. 删除列时会弹出确认对话框，确认后会同时删除列中的所有组件
6. 表格宽度自动分配，每列宽度相等