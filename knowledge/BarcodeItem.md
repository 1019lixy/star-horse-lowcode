# BarcodeItem Barcode Component

## Overview
BarcodeItem is a barcode generation component implemented based on vue3-barcode, used to generate and display barcodes. The component supports multiple barcode formats and custom style configurations.

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

### createCode
Create barcode configuration
```typescript
createCode(): void
```

## Data Structures

### Field Configuration (field)
```typescript
interface FieldConfig {
  fieldName: string;      // Field name
  preps?: object;         // Barcode configuration parameters
  // Other field properties...
}
```

### Barcode Configuration Parameters (preps)
```typescript
interface BarcodePreps {
  name?: string;          // Data field name
  format?: string;        // Barcode format, default "CODE39"
  width?: number;         // Barcode width, default 1
  height?: number;        // Barcode height, default 40
  displayValue?: boolean; // Whether to display text value, default true
  fontOptions?: string;   // Font options
  font?: string;          // Font
  textAlign?: string;     // Text alignment, default "center"
  textPosition?: string;  // Text position, default "bottom"
  textMargin?: number;    // Text margin, default 5
  fontSize?: number;      // Font size, default 15
  background?: string;    // Background color, default "#fff"
  lineColor?: string;     // Line color, default "#000"
  margin?: number;        // Margin, default 15
}
```

## Usage Example

```vue
<template>
  <barcode-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  barcodeData: '123456789'
})

const fieldConfig = ref({
  fieldName: 'barcode',
  label: 'Barcode',
  type: 'barcode',
  preps: {
    name: 'barcodeData',     // Associated data field
    format: 'CODE128',       // Barcode format
    width: 2,                // Barcode width
    height: 50,              // Barcode height
    displayValue: true,      // Display text value
    fontSize: 16,            // Font size
    lineColor: '#000000',    // Line color
    background: '#ffffff'    // Background color
  }
})
</script>
```

## Notes

1. The component associates with the field in form data through [preps.name]
2. Supports multiple barcode formats such as CODE39, CODE128, EAN, UPC, etc.
3. The barcode is automatically regenerated when the value of the associated data field changes
4. The appearance and style of the barcode can be customized through [preps] configuration items
5. The component automatically calls the [createCode] method to generate configuration when mounted and when data changes
6. The barcode value comes from the [formData[preps.name]] field