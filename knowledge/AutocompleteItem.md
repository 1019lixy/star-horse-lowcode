# AutocompleteItem Autocomplete Component

## Overview
AutocompleteItem is an autocomplete component implemented based on Element Plus's el-autocomplete, used to provide input suggestions and autocomplete functionality. The component supports local data filtering and remote data fetching.

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

### querySearch
Query search suggestion data
```typescript
querySearch(queryString: string, cb: (arg: any) => void): Promise<void>
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
  dataSource?: string;    // Data source type ("url" for remote data)
  selectLabel?: string;   // Select label field
  values?: Array<any>;    // Option data
}
```

### Search Parameters (SearchParams)
```typescript
interface SearchParams {
  propertyName: string;   // Property name
  value: any;             // Value
  operation: string;      // Operator
}
```

## Usage Example

### Using Local Data
```vue
<template>
  <autocomplete-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  autoComplete: ''
})

const fieldConfig = ref({
  fieldName: 'autoComplete',
  label: 'Autocomplete',
  type: 'autocomplete',
  preps: {
    values: [
      { value: 'vue', label: 'Vue.js' },
      { value: 'element', label: 'Element UI' },
      { value: 'react', label: 'React' }
    ]
  }
})
</script>
```

### Using Remote Data
```vue
<template>
  <autocomplete-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  autoComplete: ''
})

const fieldConfig = ref({
  fieldName: 'autoComplete',
  label: 'Autocomplete',
  type: 'autocomplete',
  preps: {
    dataSource: 'url',           // Use remote data
    selectLabel: 'name',         // Search field name
    dataUrl: '/api/search',      // Data API URL
    httpMethod: 'GET'            // HTTP method
  }
})
</script>
```

## Notes

1. The component supports both local data filtering and remote data fetching modes
2. In local data mode, option data is provided through [preps.values]
3. In remote data mode, set [preps.dataSource] to "url" and configure related API information
4. The [querySearch] method is automatically triggered when typing to get suggestion data
5. Supports dynamic updating of option data through [formData[fieldName]OptionList]
6. The component automatically handles data initialization and updates