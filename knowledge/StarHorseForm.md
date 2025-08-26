# StarHorseForm

## Overview
The StarHorseForm component is a wrapper around the Element Plus el-form component. It provides enhanced form handling capabilities including data loading, validation, and submission functionality. It's designed to work with the star-horse-lowcode system's field mapping and API integration features.

## Props
| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| compUrl | ApiUrls | undefined | API URLs configuration for form operations |
| fieldList | PageFieldInfo | required | Field configuration for the form |
| batchName | String | "batchDataList" | Name for batch data operations |
| batchFieldName | String | "batchFieldList" | Field name for batch operations |
| outerFormData | Object | undefined | External form data to merge with internal data |
| primaryKey | String/Object | undefined | Primary key for data operations |
| globalCondition | Object | undefined | Global conditions for API calls |
| rules | Object | undefined | Validation rules for form fields |
| formSize | String | Config.compSize | Size of form elements |
| labelPosition | String | "left" | Position of labels in the form |
| typeModel | String | undefined | Type model for the form |
| dynamicForm | Boolean | false | Whether this is a dynamic form |
| selectData | Array<SelectOption> | [{name:"正常",value:"1"},{name:"禁用",value:"2"}] | Selection data for status fields |

## Events
| Event Name | Parameters | Description |
|------------|------------|-------------|
| refresh | formData, responseData | Emitted after successful form submission |
| dataLoaded | loadedData | Emitted when form data is loaded |
| exportData | formData | Emitted to export current form data |
| removeRow | row | Emitted when a row is removed from a table |
| addRow | row | Emitted when a row is added to a table |
| inited | none | Emitted when the form is initialized |

## Slots
This component doesn't expose any slots directly. It uses the el-form component internally.

## Methods (Exposed via defineExpose)
| Method Name | Parameters | Return Type | Description |
|-------------|------------|-------------|-------------|
| merge | type: string | void | Validate and submit form data |
| mergeDraft | type: string | void | Submit form data as draft |
| resetForm | none | void | Reset form to default values |
| setFormData | data: any | void | Set form data |
| getFormData | none | Ref<Object> | Get current form data |
| updateFormData | data: any | void | Update form data with new values |
| getFields | none | Array<FieldInfo> | Get form fields |
| getFormFields | none | Array<any> | Get form fields from el-form |
| validate | none | Promise<boolean> | Validate the form |
| setSource | dataSource: number | void | Set data source type |

## Data Structures

### PageFieldInfo
```typescript
interface PageFieldInfo {
  fieldList?: Array<FieldInfo>;
  batchFieldList?: Array<BatchFieldInfo>;
  userTableFuncs?: Array<UserFuncInfo>;
  stopAutoLoad?: boolean;
  cellEditable?: boolean;
  orderBy?: Array<OrderByInfo>;
  conditions?: Array<SearchParams>;
  batchName?: string;
  sameTable?: boolean;
  primaryKey?: string | Array<any>;
  priority?: number;
}
```

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

### ApiUrls
```typescript
type ApiUrls = {
  pageListUrl: string;
  mergeUrl: string;
  mergeDraftUrl: string;
  batchMergeUrl: string;
  batchMergeDraftUrl: string;
  loadByIdUrl: string;
  loadByIdForViewUrl: string;
  deleteUrl: string;
  deleteByConditionUrl?: string;
  exportAllUrl?: string;
  downloadTemplateUrl?: string;
  listConditionUrl?: string;
  oneConditionUrl?: string;
  uploadUrl?: string;
  importUrl?: string;
  executeUrl?: string;
  modifyColumnsUrl?: string;
  basePrefix?: string;
  permissionsUrl?: string;
  appName?: string;
  condition?: Array<SearchParams>;
  redirect?: boolean;
  httpMethod?: string;
  dataType?: string;
  pageAction?: Function;
  mergeAction?: Function;
  mergeDraftAction?: Function;
  batchMergeAction?: Function;
  batchMergeDraftAction?: Function;
  loadByIdAction?: Function;
  deleteAction?: Function;
  deleteByConditionAction?: Function;
  exportDataAction?: Function;
  downloadTemplateAction?: Function;
  queryConditionAction?: Function;
  queryOneByConditionAction?: Function;
  uploadAction?: Function;
  importAction?: Function;
  executeAction?: Function;
  modifyColumnsAction?: Function;
}
```

## Usage Example
```vue
<template>
  <star-horse-form
    :comp-url="compUrl"
    :field-list="fieldList"
    @refresh="handleRefresh"
    @data-loaded="handleDataLoaded"
  />
</template>

<script setup>
import { ref } from 'vue'
import StarHorseForm from '@/components/comp/StarHorseForm.vue'

const compUrl = {
  mergeUrl: '/api/data/merge',
  loadByIdUrl: '/api/data/loadById'
}

const fieldList = {
  fieldList: [
    {
      fieldName: 'name',
      label: 'Name',
      type: 'input',
      required: true
    },
    {
      fieldName: 'email',
      label: 'Email',
      type: 'input'
    }
  ]
}

const handleRefresh = (formData, responseData) => {
  console.log('Form submitted successfully')
}

const handleDataLoaded = (loadedData) => {
  console.log('Form data loaded', loadedData)
}
</script>
```