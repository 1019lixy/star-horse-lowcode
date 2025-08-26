# CardContainer Component

## Overview
CardContainer is a card container component used to create card-style layouts with title and content areas. It is implemented based on Element Plus's el-card component and supports drag-and-drop addition of components and designer mode.

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

1. **Card Layout**: Implemented based on Element Plus's el-card component for card layout
2. **Drag Support**: Supports drag-and-drop addition of components in the card header and content area
3. **Designer Integration**: Seamless integration with form designer
4. **Scroll Support**: Content area supports scrollbars
5. **Help Information**: Supports displaying help information next to the card title

## Data Structure

### elements Configuration
```javascript
{
  label: "Card",           // Card label
  tabName: "card",         // Tab name
  objectName: "card",      // Object name
  subFormFlag: "Y",        // Sub-form flag
  headerFieldList: [],     // Header field list
  items: [],              // Content area component list
  title: "Card Title",        // Card title
  helpMsg: "Help Information"      // Help information
}
```

## Methods

### isContainer(data)
Determine if the component is a container type (tab, box, table, card, dytable, collapse).

### checkItem(adata, type)
Check and initialize the card's header field list or content area component list.

### onDragAdd(evt, dataList)
Handle drag-and-drop events for adding components to the card.

## Dependencies

- group-container: Group container component
- draggable: Drag component
- help: Help information component
- itemCheck: Component type checking utility function

## Usage Example

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
  // Form data
})

const cardContainerConfig = {
  preps: {
    shadow: 'hover', // Card shadow effect
    elements: [
      {
        title: 'User Information Card',
        tabName: 'userInfo',
        objectName: 'userInfo',
        subFormFlag: 'Y',
        helpMsg: 'Please fill in basic user information',
        headerFieldList: [], // Header components
        items: [] // Content area components
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

1. Card containers support adding components to both the header and content areas
2. The header area is suitable for placing title-related components
3. The content area is suitable for placing form components
4. Supports scrollbars to accommodate content-heavy situations
5. Drag areas are displayed in design mode