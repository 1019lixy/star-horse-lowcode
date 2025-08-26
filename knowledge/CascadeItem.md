# CascadeItem Cascader Component

## Overview
CascadeItem is a cascader component implemented based on Element Plus's el-cascader. It supports both single and multiple selection modes, dynamic data loading, select-all functionality, and dynamic option addition.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| isDesign | Boolean | No | false | Whether it is design mode |
| disabled | Boolean | No | false | Whether it is disabled |
| showFormItem | Boolean | No | false | Whether to show form item |
| bareFlag | Boolean | No | false | Whether it is bare mode |
| isSearch | Boolean | No | false | Whether it is search mode |

## Events

| Event Name | Parameters | Description |
|------------|------------|-------------|
| selfFunc | - | Custom function event |
| selectItem | - | Select item event |

## Methods

### handleCheckAll
Handle select-all operation
```typescript
handleCheckAll(val: any): void
```

### onAddOption
Show add option interface
```typescript
onAddOption(): void
```

### onConfirm
Confirm add option
```typescript
onConfirm(): void
```

### clear
Cancel add option
```typescript
clear(): void
```

### initData
Initialize data
```typescript
initData(): Promise<void>
```

## Data Structures

### Field Configuration (field)
```typescript
interface FieldConfig {
  fieldName: string;      // Field name
  preps?: object;         // Configuration parameters
  // Other field properties...
}
```

### Configuration Parameters (preps)
```typescript
interface Preps {
  options?: Array<any>;   // Option data
  props?: object;         // Property configuration
  multiple?: boolean;     // Whether it is multiple selection
  showFooter?: boolean;   // Whether to show footer
}
```

### Property Configuration (props)
```typescript
interface Props {
  label?: string;         // Label field name, default "name"
  value?: string;         // Value field name, default "value"
  code?: string;          // Code field name
  multiple?: boolean;     // Whether it is multiple selection
  checkStrictly?: boolean;// Whether it is strict mode, default true
}
```

## Usage Example

### Basic Usage
```vue
<template>
  <cascade-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  cascade: []
})

const fieldConfig = ref({
  fieldName: 'cascade',
  label: 'Cascader',
  type: 'cascade',
  preps: {
    options: [
      {
        value: 'guide',
        label: 'Guide',
        children: [
          {
            value: 'disciplines',
            label: 'Disciplines',
            children: [
              {
                value: 'consistency',
                label: 'Consistency'
              }
            ]
          }
        ]
      }
    ]
  }
})
</script>
```

### Multiple Selection Mode
```vue
<template>
  <cascade-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  cascade: []
})

const fieldConfig = ref({
  fieldName: 'cascade',
  label: 'Cascader',
  type: 'cascade',
  preps: {
    multiple: true,         // Enable multiple selection
    showFooter: true,       // Show footer for adding options
    options: [
      {
        value: 'guide',
        label: 'Guide',
        children: [
          {
            value: 'disciplines',
            label: 'Disciplines'
          }
        ]
      }
    ]
  }
})
</script>
```

### Dynamic Data Loading
```vue
<template>
  <cascade-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  cascade: []
})

const fieldConfig = ref({
  fieldName: 'cascade',
  label: 'Cascader',
  type: 'cascade',
  preps: {
    dataUrl: '/api/cascade/data',  // Data API URL
    httpMethod: 'GET'              // HTTP method
  }
})
</script>
```

## Notes

1. The component supports both single and multiple selection modes, configured through [preps.multiple]
2. Supports dynamic option addition functionality, enabled through [preps.showFooter]
3. Select-all functionality is supported in multiple selection mode
4. Static option data can be provided through [preps.options] or dynamically loaded via API
5. Option data can be dynamically updated through [formData[fieldName]OptionList]
6. The component automatically handles JSON data serialization and deserialization
7. Strict mode selection is supported, configured through [preps.props.checkStrictly]