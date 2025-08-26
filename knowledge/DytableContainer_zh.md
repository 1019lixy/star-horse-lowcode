# DytableContainer 组件

## 概述
DytableContainer 是一个动态表格容器组件，用于创建可自定义行列结构的表格布局。它基于原生 HTML 表格元素实现，支持复杂的表格布局设计。

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

1. **动态表格布局**：支持自定义行列结构的表格布局
2. **单元格合并**：支持 colspan 和 rowspan 单元格合并
3. **设计器集成**：与表单设计器无缝集成
4. **响应式设计**：支持不同尺寸的单元格

## 数据结构

### elements 配置项
```javascript
{
  elements: [
    {
      columns: [
        {
          colspan: 1,          // 列合并数
          rowspan: 1,          // 行合并数
          colWidth: '100%',    // 列宽度
          colHeight: '40px',   // 行高度
          wordBreak: false,    // 是否换行
          items: []           // 单元格中的组件列表
        }
      ]
    }
  ]
}
```

## 依赖组件

- group-container: 组容器组件
- dytable-col: 动态表格列组件

## 使用示例

```vue
<template>
  <dytable-container
    :field="dytableContainerConfig"
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

const dytableContainerConfig = {
  preps: {
    elements: [
      {
        columns: [
          {
            colspan: 1,
            rowspan: 1,
            colWidth: '200px',
            colHeight: '50px',
            items: []
          },
          {
            colspan: 1,
            rowspan: 1,
            colWidth: '300px',
            colHeight: '50px',
            items: []
          }
        ]
      },
      {
        columns: [
          {
            colspan: 2,
            rowspan: 1,
            colWidth: '500px',
            colHeight: '60px',
            items: []
          }
        ]
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

## 样式说明

1. **表格样式**：设置了表格宽度为 100%，边框合并
2. **单元格样式**：通过 dytable-col 组件控制单元格样式
3. **响应式布局**：支持不同尺寸的单元格布局

## 注意事项

1. elements 配置决定了表格的行列结构
2. 每个 element 代表一行，包含多个列
3. 每个列通过 colspan 和 rowspan 属性控制合并
4. 单元格尺寸通过 colWidth 和 colHeight 属性控制
5. 支持复杂的表格布局，如合并单元格等