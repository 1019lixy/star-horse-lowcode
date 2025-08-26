# GroupContainer 组件

## 概述
GroupContainer 是一个组容器组件，用于包装其他容器组件并提供统一的操作接口。它支持设计器模式下的右键菜单、拖拽操作和容器管理功能。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| isDesign | Boolean | false | 是否为设计模式 |
| disabled | Boolean | false | 是否禁用 |
| parentField | Object | - | 父级字段配置 |
| formItem | Object | required | 容器字段配置（必需） |

## 功能特性

1. **容器包装**：为其他容器组件提供统一的包装层
2. **设计器集成**：在设计模式下提供丰富的操作功能
3. **右键菜单**：支持右键菜单操作
4. **拖拽支持**：提供拖拽手柄
5. **容器管理**：支持选中、删除、复制等容器操作

## 方法

### selectData()
选中当前容器，更新设计表单的状态。

### removeData()
删除当前容器，会弹出确认对话框，确认后从父级容器或组件列表中移除。

### containerContextMenu(evt)
处理容器的右键菜单事件，显示上下文菜单。

### close()
关闭组件选择对话框。

### addItem(item)
向容器中添加新组件，根据组件类型和容器类型进行相应的添加逻辑处理。

### tableOperation(actionName, preps)
处理表格相关的操作：
- insertRow: 插入新行
- insertCol: 插入新列
- copy: 复制容器

## 依赖组件

- star-horse-dialog: 对话框组件
- field-list: 字段列表组件
- ContentMenu: 右键菜单组件
- star-horse-icon: 图标组件

## 插槽

- default: 默认插槽，用于放置容器内容

## 操作按钮

在设计模式下，当容器被选中时会显示以下操作按钮：
1. **拖动**：用于拖拽容器
2. **选中容器**：选中当前容器
3. **删除容器**：删除当前容器
4. **插入行**：仅对 dytable 和 box 容器可用
5. **插入列**：仅对 dytable、box 和 table 容器可用
6. **复制容器**：复制当前容器

## 使用示例

```vue
<template>
  <group-container
    :form-item="containerConfig"
    :parent-field="parentFieldConfig"
    :is-design="true"
    :disabled="false"
  >
    <!-- 容器内容 -->
    <box-container
      :field="boxContainerConfig"
      v-model:form-data="formData"
    />
  </group-container>
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  // 表单数据
})

const containerConfig = {
  id: 'container-1',
  itemType: 'box',
  preps: {
    // 容器配置
  }
}

const parentFieldConfig = {
  // 父级字段配置
}

const boxContainerConfig = {
  // box 容器配置
}
</script>
```

## 样式说明

1. **容器边框**：在设计器模式下显示橙色虚线边框
2. **选中状态**：选中时显示蓝色实线轮廓
3. **表单项样式**：提供标签对齐等样式支持
4. **静态内容**：为静态内容项提供最小高度和垂直居中

## 注意事项

1. formItem 属性是必需的，用于标识容器配置
2. 仅在设计模式下显示操作按钮和右键菜单
3. 删除容器时会弹出确认对话框
4. 支持多种容器类型的操作，如表格的行列插入