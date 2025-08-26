# TabContainer 组件

## 概述
TabContainer 是一个标签页容器组件，用于创建多标签页的布局结构。它基于 Element Plus 的 el-tabs 和 el-tab-pane 组件实现，支持拖拽添加组件和丰富的标签页配置。

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

1. **标签页布局**：基于 Element Plus 的 el-tabs 组件实现标签页布局
2. **拖拽支持**：支持在标签页内容区域拖拽添加组件
3. **设计器集成**：与表单设计器无缝集成
4. **多种标签页类型**：支持卡片式、边框式等不同标签页样式
5. **动态标签页**：支持添加、删除、编辑标签页
6. **事件回调**：支持标签页切换、点击等事件回调

## 数据结构

### elements 配置项
```javascript
{
  label: "Tab1",           // 标签页标题
  tabName: "tab1",         // 标签页名称（唯一标识）
  objectName: "tab1",      // 对象名称
  subFormFlag: "Y",        // 子表单标识
  items: []               // 标签页内容区域组件列表
}
```

## 配置参数

通过 field.preps 属性配置标签页参数：
- elements: 标签页元素数组
- tablePosition: 标签页位置（top, right, bottom, left），默认为 'top'
- type: 标签页类型（card, border-card），默认为空
- closable: 标签页是否可关闭，默认为 false
- addable: 标签页是否可添加，默认为 false
- editable: 标签页是否可编辑，默认为 false
- stretch: 标签页是否拉伸，默认为 false

## 方法

### isContainer(data)
判断组件是否为容器类型（tab, box, table, card, dytable, collapse）。

### checkItem(adata)
检查并初始化标签页的内容区域组件列表。

### onDragAdd(evt, dataList)
处理拖拽添加组件到标签页中的事件。

### dynamicFunc(funcType, funcCode)
动态执行标签页相关事件回调函数。

### addTab()
添加新标签页的方法。

## 事件监听

### activeTabName 监听
监听当前激活标签页的变化，并同步更新 field.activeItemName。

## 依赖组件

- group-container: 组容器组件
- draggable: 拖拽组件
- itemCheck: 组件类型检查工具函数
- compKey: 组件唯一标识生成工具函数

## 使用示例

```vue
<template>
  <tab-container
    :field="tabContainerConfig"
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

const tabContainerConfig = {
  preps: {
    tablePosition: 'top', // 标签页位置
    type: 'card', // 标签页类型
    closable: true, // 可关闭
    addable: true, // 可添加
    editable: true, // 可编辑
    stretch: false, // 不拉伸
    elements: [
      {
        label: '基本信息',
        tabName: 'basicInfo',
        objectName: 'basicInfo',
        subFormFlag: 'Y',
        items: [] // 标签页内容组件
      },
      {
        label: '详细信息',
        tabName: 'detailInfo',
        objectName: 'detailInfo',
        subFormFlag: 'Y',
        items: [] // 标签页内容组件
      }
    ]
  },
  activeItemName: 'basicInfo', // 当前激活的标签页
  tabClick: 'console.log("标签页被点击")', // 标签页点击回调
  tabChange: 'console.log("标签页切换")', // 标签页切换回调
  tabRemove: 'console.log("标签页被移除")' // 标签页移除回调
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

1. 每个标签页通过 tabName 属性唯一标识
2. 标签页内容区域支持滚动条以适应内容较多的情况
3. 在设计模式下会显示拖拽区域
4. 支持多种标签页样式和位置配置
5. 可通过回调函数处理标签页相关事件