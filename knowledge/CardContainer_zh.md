# CardContainer 组件

## 概述
CardContainer 是一个卡片容器组件，用于创建带有标题和内容区域的卡片式布局。它基于 Element Plus 的 el-card 组件实现，支持拖拽添加组件和设计器模式。

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

1. **卡片布局**：基于 Element Plus 的 el-card 组件实现卡片布局
2. **拖拽支持**：支持在卡片头部和内容区域拖拽添加组件
3. **设计器集成**：与表单设计器无缝集成
4. **滚动支持**：内容区域支持滚动条
5. **帮助信息**：支持在卡片标题旁显示帮助信息

## 数据结构

### elements 配置项
```javascript
{
  label: "Card",           // 卡片标签
  tabName: "card",         // 标签名称
  objectName: "card",      // 对象名称
  subFormFlag: "Y",        // 子表单标识
  headerFieldList: [],     // 头部字段列表
  items: [],              // 内容区域组件列表
  title: "卡片标题",        // 卡片标题
  helpMsg: "帮助信息"      // 帮助信息
}
```

## 方法

### isContainer(data)
判断组件是否为容器类型（tab, box, table, card, dytable, collapse）。

### checkItem(adata, type)
检查并初始化卡片的头部字段列表或内容区域组件列表。

### onDragAdd(evt, dataList)
处理拖拽添加组件到卡片中的事件。

## 依赖组件

- group-container: 组容器组件
- draggable: 拖拽组件
- help: 帮助信息组件
- itemCheck: 组件类型检查工具函数

## 使用示例

```vue
<template>
  <card-container
    :field="cardContainerConfig"
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

const cardContainerConfig = {
  preps: {
    shadow: 'hover', // 卡片阴影效果
    elements: [
      {
        title: '用户信息卡片',
        tabName: 'userInfo',
        objectName: 'userInfo',
        subFormFlag: 'Y',
        helpMsg: '请填写用户基本信息',
        headerFieldList: [], // 头部组件
        items: [] // 内容区域组件
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

1. 卡片容器支持在头部和内容区域分别添加组件
2. 头部区域适合放置标题相关的组件
3. 内容区域适合放置表单组件
4. 支持滚动条以适应内容较多的情况
5. 在设计模式下会显示拖拽区域