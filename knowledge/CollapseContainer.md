# CollapseContainer Component

## Overview
CollapseContainer is a collapsible panel container component used to create content areas that can be collapsed and expanded. It is implemented based on Element Plus's el-collapse and el-collapse-item components and supports management of multiple panels.

## Props

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| parentField | String | - | Parent field configuration |
| isDesign | Boolean | false | Whether it is design mode |
| showFormItem | Boolean | false | Whether to show form item |
| disabled | Object | - | Disabled state |
| formInfo | Object | - | Form information |
| field | Object | - | Container field configuration |

## Features

1. **Collapsible Panel**: Implemented based on Element Plus's el-collapse component for collapsible panels
2. **Multi-panel Support**: Supports creating and managing multiple collapsible panels
3. **Drag Support**: Supports drag-and-drop addition of components in panel content areas
4. **Designer Integration**: Seamless integration with form designer
5. **Accordion Mode**: Supports accordion mode, expanding only one panel at a time

## Data Structure

### elements Configuration
```javascript
{
  label: "Collapse1",      // Panel label
  tabName: "collapse1",    // Panel name (unique identifier)
  objectName: "collapse1", // Object name
  subFormFlag: "Y",        // Sub-form flag
  items: []               // Panel content area component list
}
```

## Configuration Parameters

Configure collapsible panel parameters through the field.preps property:
- elements: Panel elements array
- accordion: Whether to enable accordion mode, default is false

## Methods

### checkItem(adata)
Check and initialize the panel's content area component list.

### onDragAdd(evt, dataList)
Handle drag-and-drop events for adding components to panels.

## Event Listeners

### activeTabName Listener
Listen for changes in the currently active panel and synchronize updates to field.activeItemName.

## Dependencies

- group-container: Group container component
- draggable: Drag component
- itemCheck: Component type checking utility function

## Usage Example

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
  // Form data
})

const collapseContainerConfig = {
  preps: {
    accordion: true, // Enable accordion mode
    elements: [
      {
        label: 'Basic Information',
        tabName: 'basicInfo',
        objectName: 'basicInfo',
        subFormFlag: 'Y',
        items: [] // Panel content components
      },
      {
        label: 'Detailed Information',
        tabName: 'detailInfo',
        objectName: 'detailInfo',
        subFormFlag: 'Y',
        items: [] // Panel content components
      }
    ]
  },
  activeItemName: 'basicInfo' // Currently active panel
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

1. Each panel is uniquely identified by the tabName property
2. Supports accordion mode, controlled by the accordion property
3. Panel content areas support scrollbars to accommodate content-heavy situations
4. Drag areas are displayed in design mode
5. Panel titles display the label or objectName property