# Comp Index Component Export Index

## Overview
Comp Index is a TypeScript file used to uniformly export all components in the [components/comp](file:///e:/lixycode/testcode/src/components/comp) directory, making it convenient for other modules to import on demand.

## Exported Components

```typescript
export { default as ShDynamicForm } from "./ShDynamicForm.vue";
export { default as ShTableListColumn } from "./ShTableListColumn.vue";
export { default as StarHorseDataSelector } from "./StarHorseDataSelector.vue";
export { default as StarHorseDataView } from "./StarHorseDataView.vue";
export { default as StarHorseDataViewItems } from "./StarHorseDataViewItems.vue";
export { default as StarHorseDataViewTable } from "./StarHorseDataViewTable.vue";
export { default as StarHorseDialog } from "./StarHorseDialog.vue";
export { default as StarHorseDraggable } from "./StarHorseDraggable.vue";
export { default as StarHorseForm } from "./StarHorseForm.vue";
export { default as StarHorseFormItem } from "./StarHorseFormItem.vue";
export { default as StarHorseFormList } from "./StarHorseFormList.vue";
export { default as StarHorseFormTable } from "./StarHorseFormTable.vue";
export { default as StarHorseIcon } from "./StarHorseIcon.vue";
export { default as StarHorseJsonEditor } from "./StarHorseJsonEditor.vue";
export { default as StarHorsePopover } from "./StarHorsePopover.vue";
export { default as StarHorseSearchComp } from "./StarHorseSearchComp.vue";
export { default as StarHorseStaticTable } from "./StarHorseStaticTable.vue";
export { default as StarHorseTableColumn } from "./StarHorseTableColumn.vue";
export { default as StarHorseTableComp } from "./StarHorseTableComp.vue";
export { default as StarHorseTableViewColumn } from "./StarHorseTableViewColumn.vue";
export { default as StarHorseTree } from "./StarHorseTree.vue";
export { default as ShForm } from "./ShForm.vue";
export { default as DataPicker } from "./utils/DataPicker.vue";
```

## Usage Example

```typescript
// Import components on demand
import { StarHorseForm, StarHorseDialog, StarHorseTableComp } from '@/components/comp'

// Import all components
import * as CompComponents from '@/components/comp'
```

## Features

1. **Unified Export** - Centralized management of all component exports in the [components/comp](file:///e:/lixycode/testcode/src/components/comp) directory
2. **On-demand Import** - Supports importing individual components on demand
3. **Naming Convention** - Uses PascalCase naming convention
4. **Modularity** - Easy to maintain and extend
5. **Type Safety** - TypeScript support