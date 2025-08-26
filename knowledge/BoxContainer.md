# BoxContainer Component

## Overview
BoxContainer is a grid layout container component used to create grid layout forms based on rows and columns. It is implemented based on Element Plus's el-row and el-col components and supports flexible layout configuration.

## Props

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| parentField | Object | - | Parent field configuration |
| isDesign | Boolean | false | Whether it is design mode |
| showFormItem | Boolean | false | Whether to show form item |
| disabled | Boolean | false | Whether it is disabled |
| formInfo | Object | - | Form information |
| field | Object | - | Container field configuration |

## Features

1. **Grid Layout**: Implemented based on Element Plus's el-row and el-col components for grid layout
2. **Flexible Configuration**: Supports configuration of layout properties such as gutter, justify, and align
3. **Nesting Support**: Supports complex layouts with multiple rows and columns
4. **Designer Integration**: Seamless integration with form designer

## Layout Configuration

Layout parameters are configured through the field.preps property:
- elements: Array of layout elements, including configurations for rows and columns
- gutter: Grid spacing, default is 10
- justify: Horizontal arrangement, default is 'start'
- align: Vertical alignment, default is 'top'
- tag: Rendering tag, default is 'div'

## Dependencies

- group-container: Group container component
- box-col: Grid column component
- el-row: Element Plus row component

## Usage Example

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
  // Form data
})

const boxContainerConfig = {
  preps: {
    gutter: 20, // Grid spacing
    justify: 'center', // Horizontal arrangement
    align: 'middle', // Vertical alignment
    elements: [
      {
        columns: [
          {
            colspan: 12, // Column width
            items: [] // Component items in the column
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
  // Parent field configuration
}

const formInfo = {
  // Form information
}
</script>
```

## Notes

1. The elements configuration determines the structure of the grid layout
2. Each element represents a row containing multiple columns
3. Each column controls its width through the colspan property (1-24)
4. Supports multi-row layouts, with each row having different column configurations