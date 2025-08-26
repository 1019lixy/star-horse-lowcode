# CollapseContainer 组件

## 概述
CollapseContainer 是一个折叠面板容器组件，用于创建可折叠和展开的内容区域。它基于 Element Plus 的 el-collapse 和 el-collapse-item 组件实现，支持多个面板的管理。

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

1. **折叠面板**：基于 Element Plus 的 el-collapse 组件实现折叠面板
2. **多面板支持**：支持创建和管理多个折叠面板
3. **拖拽支持**：支持在面板内容区域拖拽添加组件
4. **设计器集成**：与表单设计器无缝集成
5. **手风琴模式**：支持 accordion 模式，一次只展开一个面板

## 数据结构

### elements 配置项
```javascript
{
  label: "Collapse1",      // 面板标签
  tabName: "collapse1",    // 面板名称（唯一标识）
  objectName: "collapse1", // 对象名称
  subFormFlag: "Y",        // 子表单标识
  items: []               // 面板内容区域组件列表
}
```

## 配置参数

通过 field.preps 属性配置折叠面板参数：
- elements: 面板元素数组
- accordion: 是否启用手风琴模式，默认为 false

## 方法

### checkItem(adata)
检查并初始化面板的内容区域组件列表。

### onDragAdd(evt, dataList)
处理拖拽添加组件到面板中的事件。

## 事件监听

### activeTabName 监听
监听当前激活面板的变化，并同步更新 field.activeItemName。

## 依赖组件

- group-container: 组容器组件
- draggable: 拖拽组件
- itemCheck: 组件类型检查工具函数

## 使用示例

```vue
<template>
  <collapse-container
    :field="collapseContainerConfig"
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

const collapseContainerConfig = {
  preps: {
    accordion: true, // 启用手风琴模式
    elements: [
      {
        label: '基本信息',
        tabName: 'basicInfo',
        objectName: 'basicInfo',
        subFormFlag: 'Y',
        items: [] // 面板内容组件
      },
      {
        label: '详细信息',
        tabName: 'detailInfo',
        objectName: 'detailInfo',
        subFormFlag: 'Y',
        items: [] // 面板内容组件
      }
    ]
  },
  activeItemName: 'basicInfo' // 当前激活的面板
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

1. 每个面板通过 tabName 属性唯一标识
2. 支持手风琴模式，通过 accordion 属性控制
3. 面板内容区域支持滚动条以适应内容较多的情况
4. 在设计模式下会显示拖拽区域
5. 面板标题显示 label 或 objectName 属性