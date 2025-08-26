# AreaItem Region Selection Component

## Overview
AreaItem is a region selection component based on Element Plus's el-cascader, used for selecting region information such as provinces, cities, and districts. The component supports using local region data or remote dynamic data.

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

No public methods.

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
  user?: boolean;         // Whether to use user data
  options?: Array<any>;   // Option data
  props?: object;         // Property configuration
}
```

## Usage Example

### Basic Usage
```vue
<template>
  <area-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  area: []
})

const fieldConfig = ref({
  fieldName: 'area',
  label: 'Region',
  type: 'area',
  preps: {
    // Use default province-city-district data
  }
})
</script>
```

### Using Remote Data
```vue
<template>
  <area-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  area: []
})

const fieldConfig = ref({
  fieldName: 'area',
  label: 'Region',
  type: 'area',
  preps: {
    user: true,  // Use remote data
    // Remote data will be obtained through compDynamicData method
  }
})
</script>
```

## Notes

1. The component uses local province-city-district data by default (pcas-code.json)
2. Can be set to use remote dynamic data by setting [preps.user] to true
3. Component data is stored in JSON string format, automatically serialized and deserialized
4. Supports dynamic updating of option data through [formData[fieldName]OptionList]
5. The component automatically handles data initialization and updates