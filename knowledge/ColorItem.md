# ColorItem Color Picker Component

## Overview
ColorItem is a color picker component implemented based on Element Plus's el-color-picker. It is used to select and display color values, supporting multiple color formats.

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

No specific public methods.

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
  // All supported properties of Element Plus el-color-picker
  // For example:
  // showAlpha?: boolean;    // Whether to support transparency
  // colorFormat?: string;   // Color format ('hex'/'rgb'/'hsl'/'hsv')
  // size?: string;          // Size
  // disabled?: boolean;     // Whether it is disabled
  // popperClass?: string;   // Dropdown panel class name
}
```

## Usage Example

### Basic Usage
```vue
<template>
  <color-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  color: '#409EFF'
})

const fieldConfig = ref({
  fieldName: 'color',
  label: 'Color Picker',
  type: 'color',
  preps: {
    // Use default configuration
  }
})
</script>
```

### Support Transparency
```vue
<template>
  <color-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  color: 'rgba(19, 206, 102, 0.8)'
})

const fieldConfig = ref({
  fieldName: 'color',
  label: 'Color Picker (with transparency)',
  type: 'color',
  preps: {
    showAlpha: true  // Support transparency selection
  }
})
</script>
```

### Specify Color Format
```vue
<template>
  <color-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  color: 'rgb(64, 158, 255)'
})

const fieldConfig = ref({
  fieldName: 'color',
  label: 'Color Picker (RGB format)',
  type: 'color',
  preps: {
    colorFormat: 'rgb'  // Specify color format
  }
})
</script>
```

## Notes

1. The component is implemented based on Element Plus's el-color-picker
2. Color values are stored as strings in form data
3. Supports multiple color formats: hex, rgb, hsl, hsv
4. Transparency selection can be supported through [preps.showAlpha]
5. All properties of Element Plus color picker can be configured through [preps]
6. The component automatically handles color value binding and updates