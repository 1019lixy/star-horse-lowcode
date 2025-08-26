# CheckboxItem Checkbox Component

## Overview
CheckboxItem component is a checkbox component encapsulated based on Element Plus's el-checkbox-group and el-checkbox components. It supports dynamic data loading, event binding, and other features, suitable for multi-selection scenarios.

## Props
| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| field | FieldInfo | required | Field configuration information |
| formData | Object | required | Form data object |
| parentField | FieldInfo | undefined | Parent field information |
| isDesign | Boolean | false | Whether it is design mode |
| disabled | Boolean | false | Whether it is disabled |
| bareFlag | Boolean | false | Whether it is bare mode |
| showFormItem | Boolean | false | Whether to show form item wrapper |
| isSearch | Boolean | false | Whether it is search mode |

## Events
| Event Name | Parameters | Description |
|------------|------------|-------------|
| selfFunc | function | Custom function event |
| selectItem | item | Select item event |

## Slots
This component does not directly expose slots.

## Methods
| Method Name | Parameters | Return Type | Description |
|-------------|------------|-------------|-------------|
| itemAction | none | void | Handle item action |
| initData | none | Promise<void> | Initialize data |

## Data Structures

### FieldInfo
```typescript
interface FieldInfo {
  label?: string;
  fieldName: string;
  hideFieldName?: string;
  aliasName?: string;
  helpMsg?: string;
  type?: string;
  listPrototypeDisplay?: boolean;
  required?: boolean | Ref<boolean>;
  formVisible?: boolean | Ref<boolean>;
  listVisible?: boolean | Ref<boolean>;
  viewVisible?: boolean | Ref<boolean>;
  minWidth?: number;
  disabled?: boolean | Ref<boolean>;
  editDisabled?: boolean | Ref<boolean>;
  tabList?: TabFieldInfo[];
  cardList?: CardFieldInfo[];
  collapseList?: CollapseList[];
  dytableList?: FieldInfo[];
  batchFieldList?: BatchFieldInfo[];
  defaultValue?: any;
  actions?: Function | Record<string, Function>;
  precision?: number;
  preps?: Record<string, any | CompParams>;
  prefix?: string;
  matchType?: string;
  displayStyle?: string;
  brotherNodes?: FieldInfo[];
  priority?: number;
  searchVisible?: boolean;
  rules?: RuleType[] | any;
  addActions?: Function | string;
  editActions?: Function | string;
  removeActions?: Function | string;
}
```

### ItemPreps
```typescript
interface ItemPreps {
  field: FieldInfo;
  formData: any;
  parentField?: FieldInfo;
  isDesign?: boolean;
  disabled?: boolean;
  bareFlag?: boolean;
  showFormItem?: boolean;
  isSearch?: boolean;
}
```

### Checkbox Component preps Configuration
```typescript
interface CheckboxPreps {
  values?: Array<any>; // Option values
  props?: {
    label?: string; // Label field name, default is 'name'
    value?: string; // Value field name, default is 'value'
  };
}
```

## Usage Example
```vue
<template>
  <checkbox-item
    v-model:form-data="formData"
    :field="fieldConfig"
    @self-func="handleSelfFunc"
    @select-item="handleSelectItem"
  />
</template>

<script setup>
import { ref } from 'vue'
import CheckboxItem from '@/components/formcomp/items/checkbox-item.vue'

const formData = ref({
  hobbies: []
})

const fieldConfig = {
  fieldName: 'hobbies',
  label: 'Hobbies',
  type: 'checkbox',
  preps: {
    values: [
      { name: 'Reading', value: 'reading' },
      { name: 'Swimming', value: 'swimming' },
      { name: 'Running', value: 'running' }
    ]
  }
}

const handleSelfFunc = (func) => {
  console.log('Custom function:', func)
}

const handleSelectItem = (item) => {
  console.log('Selected item:', item)
}
</script>
```