# BoxContainer 组件

## 概述
BoxContainer 是一个栅格布局容器组件，用于创建基于行和列的栅格布局表单。它基于 Element Plus 的 el-row 和 el-col 组件实现，支持灵活的布局配置。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| parentField | Object | - | 父级字段配置 |
| isDesign | Boolean | false | 是否为设计模式 |
| showFormItem | Boolean | false | 是否显示表单项 |
| disabled | Boolean | false | 是否禁用 |
| formInfo | Object | - | 表单信息 |
| field | Object | - | 容器字段配置 |

## 功能特性

1. **栅格布局**：基于 Element Plus 的 el-row 和 el-col 组件实现栅格布局
2. **灵活配置**：支持 gutter、justify、align 等布局属性配置
3. **嵌套支持**：支持多行多列的复杂布局
4. **设计器集成**：与表单设计器无缝集成

## 布局配置

通过 field.preps 属性配置布局参数：
- elements: 布局元素数组，包含行和列的配置
- gutter: 栅格间隔，默认为 10
- justify: 水平排列方式，默认为 'start'
- align: 垂直对齐方式，默认为 'top'
- tag: 渲染标签，默认为 'div'

## 依赖组件

- group-container: 组容器组件
- box-col: 栅格列组件
- el-row: Element Plus 行组件

## 使用示例

```vue
<template>
  <box-container
    :field="boxContainerConfig"
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

const boxContainerConfig = {
  preps: {
    gutter: 20, // 栅格间隔
    justify: 'center', // 水平排列方式
    align: 'middle', // 垂直对齐方式
    elements: [
      {
        columns: [
          {
            colspan: 12, // 列宽度
            items: [] // 列中的组件项
          },
          {
            colspan: 12,
            items: []
          }
        ]
      },
      {
        columns: [
          {
            colspan: 24,
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

## 注意事项

1. elements 配置决定了栅格布局的结构
2. 每个 element 代表一行，包含多个列
3. 每个列通过 colspan 属性控制宽度（1-24）
4. 支持多行布局，每行可以有不同的列配置