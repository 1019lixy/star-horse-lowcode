# Comp Index 组件导出索引

## 概述
Comp Index 是一个 TypeScript 文件，用于统一导出 [components/comp](file:///e:/lixycode/testcode/src/components/comp) 目录下的所有组件，方便其他模块按需导入。

## 导出的组件

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

## 使用示例

```typescript
// 按需导入组件
import { StarHorseForm, StarHorseDialog, StarHorseTableComp } from '@/components/comp'

// 导入所有组件
import * as CompComponents from '@/components/comp'
```

## 特性

1. **统一导出** - 集中管理 [components/comp](file:///e:/lixycode/testcode/src/components/comp) 目录下所有组件的导出
2. **按需导入** - 支持按需导入单个组件
3. **命名规范** - 使用 PascalCase 命名规范
4. **模块化** - 便于维护和扩展
5. **类型安全** - TypeScript 支持