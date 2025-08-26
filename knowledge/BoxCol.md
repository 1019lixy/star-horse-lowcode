# BoxCol Component

## Overview
BoxCol is a grid layout column component used to create grid layout columns in the form designer. It is implemented based on Element Plus's el-col component and supports drag-and-drop addition of components and container operations.

## Props

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| parentField | Object | - | Parent field configuration |
| formInfo | Object | - | Form information |
| parentComp | Object | - | Parent component |
| isDesign | Boolean | false | Whether it is design mode |
| showFormItem | Boolean | false | Whether to show form item |
| disabled | Object | - | Disabled state |
| field | Object | - | Current column field configuration |
| isFirstRow | Boolean | false | Whether it is the first row |
| isLastRow | Boolean | false | Whether it is the last row |
| isFirstCol | Boolean | false | Whether it is the first column |
| isLastCol | Boolean | false | Whether it is the last column |
| rowIndex | Number | -1 | Row index |
| colIndex | Number | -1 | Column index |

## Features

1. **Grid Layout**: Implemented based on Element Plus's el-col component for grid layout
2. **Drag Support**: Supports drag-and-drop addition of components to columns
3. **Container Operations**: Supports various container operations on columns
4. **Designer Support**: Provides visual operation interface in design mode

## Methods

### onDragAdd(evt, dataList)
Handle drag-and-drop events for adding components to columns:
- Check if nested container types are allowed
- Prevent grid containers from nesting other containers
- Select newly added component items

### handleTableCellCommand(command)
Handle table cell operation commands, calling the tableCellOperation method to execute corresponding operations.

### selectCurrentTd()
Select the current column and set the current child item ID.

### checkItem(items)
Check and initialize the component item array in the column.

## Dependencies

- draggable: Drag component
- ContainerDropDown: Container dropdown operation component
- itemCheck: Component type checking utility function

## Usage Example

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
  // Form data
})

const boxColConfig = {
  colspan: 12, // Column width
  _uuid: 'unique-id', // Unique identifier
  items: [] // Component items in the column
}

const parentFieldConfig = {
  // Parent field configuration
}

const formInfo = {
  // Form information
}
</script>
```

## Notes

1. Grid containers do not allow nesting of other container types (box, tab, table, dytable, collapse, card)
2. Container operation buttons are displayed in design mode
3. Supports responsive grid layout, with column width controlled by the colspan property