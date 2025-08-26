# ButtonItem Button Component

## Overview
ButtonItem is a feature-rich button component implemented based on Element Plus's el-button. It supports multiple operation types, including calling APIs, executing code, opening dialogs, and more, with configurable confirmation prompts and parameter passing.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| isDesign | Boolean | No | false | Whether it is design mode |
| disabled | Boolean | No | false | Whether it is disabled |
| showFormItem | Boolean | No | false | Whether to show form item |
| bareFlag | Boolean | No | false | Whether it is bare mode |
| isSearch | Boolean | No | false | Whether it is search mode |
| field | Object | Yes | - | Field configuration |

## Events

| Event Name | Parameters | Description |
|------------|------------|-------------|
| selfFunc | - | Custom function event |
| selectItem | - | Select item event |

## Methods

### openDialog
Open button operation dialog
```typescript
openDialog(): Promise<void>
```

### close
Close dialog
```typescript
close(): void
```

### dynamicFunc
Execute button function
```typescript
dynamicFunc(code: any): void
```

### operResultAction
Handle dialog confirmation operation
```typescript
operResultAction(): Promise<void>
```

## Data Structures

### Field Configuration (field)
```typescript
interface FieldConfig {
  fieldName: string;      // Field name
  label: string;          // Button text
  preps?: BtnAction;      // Button action configuration
}
```

### Button Action Configuration (BtnAction)
```typescript
interface BtnAction {
  viewType?: string;      // View type ("form"/"usercomp"/"code"/"inter"/"method")
  icon?: string;          // Button icon
  code?: string;          // Execution code
  needConfirm?: boolean;  // Whether confirmation is needed
  confirmMsg?: string;    // Confirmation message
  fieldList?: Array<any>; // Form field list
  componentName?: string; // Component name
  params?: any;           // Parameters
  url?: string;           // API URL
  method?: string;        // HTTP method
  isDynamicParam?: string;// Whether it is dynamic parameter ("Y"/"N")
  actions?: Function;     // Execution function
  afterAction?: string;   // Action after execution
  dialogTitle?: string;   // Dialog title
  boxWidth?: string;      // Dialog width
  isShowReset?: boolean;  // Whether to show reset button
  dialogBtn?: string;     // Dialog button text
}
```

### Dynamic Parameter Field (DynamicParamField)
```typescript
interface DynamicParamField {
  paramName: string;      // Parameter name
  defaultValue: any;      // Default value
  matchType: string;      // Match type
}
```

## Usage Example

### Basic Button
```vue
<template>
  <button-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({})

const fieldConfig = ref({
  fieldName: 'button',
  label: 'Click Button',
  type: 'button',
  preps: {
    icon: 'edit'  // Button icon
  }
})
</script>
```

### API Call Button
```vue
<template>
  <button-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  id: 123
})

const fieldConfig = ref({
  fieldName: 'apiButton',
  label: 'Call API',
  type: 'button',
  preps: {
    viewType: 'inter',           // API call mode
    url: '/api/data/process',    // API URL
    method: 'POST',              // HTTP method
    isDynamicParam: 'Y',         // Use dynamic parameters
    params: [                    // Parameter configuration
      {
        paramName: 'id',
        defaultValue: '',
        matchType: 'eq'
      }
    ],
    needConfirm: true,           // Need confirmation
    confirmMsg: 'Are you sure you want to execute this operation?'  // Confirmation message
  }
})
</script>
```

### Code Execution Button
```vue
<template>
  <button-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({})

const fieldConfig = ref({
  fieldName: 'codeButton',
  label: 'Execute Code',
  type: 'button',
  preps: {
    viewType: 'code',            // Code execution mode
    code: 'console.log("Executed custom code")'  // Code to execute
  }
})
</script>
```

### Open Form Dialog Button
```vue
<template>
  <button-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({})

const fieldConfig = ref({
  fieldName: 'formButton',
  label: 'Open Form',
  type: 'button',
  preps: {
    viewType: 'form',            // Form mode
    dialogTitle: 'Fill Information',  // Dialog title
    boxWidth: '50%',             // Dialog width
    fieldList: [                 // Form fields
      {
        fieldName: 'name',
        label: 'Name',
        type: 'input'
      },
      {
        fieldName: 'email',
        label: 'Email',
        type: 'input'
      }
    ]
  }
})
</script>
```

## Notes

1. The component supports multiple operation types, specified through [preps.viewType]
2. Supports confirmation prompt functionality, configured through [preps.needConfirm] and [preps.confirmMsg]
3. Can call remote APIs, configured through [preps.url] and [preps.method]
4. Supports dynamic parameter passing, configured through [preps.isDynamicParam] and [preps.params]
5. Can execute custom code, configured through [preps.code]
6. Supports opening dialogs to display forms or custom components
7. Buttons can be configured with icons, specified through [preps.icon]