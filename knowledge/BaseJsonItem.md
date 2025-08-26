# BaseJsonItem Basic JSON Editing Component

## Overview
BaseJsonItem is a basic JSON data editing component that supports editing two data types: objects and arrays. The component provides two editing modes: design mode and development mode. In design mode, editing is done through a form interface, while in development mode, editing is done directly through a JSON editor.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| isDesign | Boolean | No | false | Whether it is design mode |
| disabled | Boolean | No | false | Whether it is disabled |
| showFormItem | Boolean | No | false | Whether to show form item |
| bareFlag | Boolean | No | false | Whether it is bare mode |
| isSearch | Boolean | No | false | Whether it is search mode |
| field | Object | Yes | - | Field configuration |
| parentField | Object | No | - | Parent field configuration |
| formInfo | Object | No | - | Form information |
| dataType | String | No | "object" | Data type ("object" or "array") |

## Events

| Event Name | Parameters | Description |
|------------|------------|-------------|
| selfFunc | - | Custom function event |
| selectItem | - | Select item event |

## Methods

### editJsonData
Open JSON data editing dialog
```typescript
editJsonData(devType: boolean): Promise<void>
```

### selectItem
Save edited JSON data
```typescript
selectItem(): Promise<void>
```

### resetForm
Reset form data
```typescript
resetForm(): void
```

### closeAction
Close editing dialog
```typescript
closeAction(): void
```

## Data Structures

### Field Configuration (field)
```typescript
interface FieldConfig {
  fieldName: string;      // Field name
  label: string;          // Label
  preps?: object;         // Configuration parameters
  // Other field properties...
}
```

### Configuration Parameters (preps)
```typescript
interface Preps {
  devType?: boolean;      // Whether it is development mode
  rows?: number;          // Number of textarea rows
}
```

### Form Field Information (PageFieldInfo)
```typescript
interface PageFieldInfo {
  batchFieldList: Array<{
    batchName: string;
    fieldList: Array<{
      label: string;
      fieldName: string;
      required: boolean;
      formVisible: boolean;
    }>;
  }>;
}
```

## Usage Example

### Editing Object Type JSON Data
```vue
<template>
  <base-json-item
    v-model:formData="formData"
    :field="fieldConfig"
    dataType="object"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  jsonData: '{"name": "张三", "age": 25}'
})

const fieldConfig = ref({
  fieldName: 'jsonData',
  label: 'JSON Data',
  type: 'base-json',
  preps: {
    rows: 5
  }
})
</script>
```

### Editing Array Type JSON Data
```vue
<template>
  <base-json-item
    v-model:formData="formData"
    :field="fieldConfig"
    dataType="array"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  jsonArray: '[{"id": 1, "name": "Item 1"}, {"id": 2, "name": "Item 2"}]'
})

const fieldConfig = ref({
  fieldName: 'jsonArray',
  label: 'JSON Array',
  type: 'base-json',
  preps: {
    rows: 5
  }
})
</script>
```

## Notes

1. The component supports two data types: object ("object") and array ("array"), specified through the [dataType] property
2. Two editing modes are provided:
   - Design mode: Edit key-value pairs through a form interface
   - Development mode: Edit raw JSON data directly through a JSON editor
3. Data is stored in form data as JSON strings
4. Uses the JSON5 library for parsing and serialization, supporting more flexible JSON formats
5. In design mode, form data is validated before saving
6. The component automatically handles object and array conversion logic based on [dataType]