# BtnAction Button Event Types

## Overview
BtnAction is a set of TypeScript interface types used to define button event and dynamic parameter field configuration information.

## Main Types

### DynamicParamField Dynamic Parameter Field
```typescript
export declare interface DynamicParamField {
  paramName: string;        // Parameter name
  matchType: string;        // Match type
  defaultValue?: any;       // Default value
}
```

### BtnAction Button Event
```typescript
export declare interface BtnAction {
  viewType: "inter" | "comp" | "code" | "method"; // View type
  idDynamicForm?: string;   // Dynamic form parameter
  componentName?: string;   // Dynamic component name
  isDynamicParam?: string;  // Whether it is a dynamic parameter
  params?: SearchParams[] | DynamicParamField[]; // Dynamic parameters
  url?: string;             // API URL
  method?: string;          // Request method
  needConfirm?: string;     // Whether confirmation is needed
  confirmMsg?: string;      // Confirmation message
  needRefresh?: string;     // Whether refresh is needed
  afterAction?: string;     // Action after API execution
  actions?: Function;        // Execution function
  code?: string;            // JavaScript code block
}
```

## View Type Description

- `inter`: API call
- `comp`: Component call
- `code`: Code execution
- `method`: Method call

## afterAction Types

- `assignCurrentName`: Assign current name
- `assignForm`: Assign to form

## Usage Example

```typescript
import { BtnAction, DynamicParamField } from '@/components/types/BtnAction'

// Dynamic parameter field example
const dynamicParam: DynamicParamField = {
  paramName: 'userId',
  matchType: 'eq',
  defaultValue: 1
}

// Button event example - API call
const apiBtnAction: BtnAction = {
  viewType: 'inter',
  url: '/api/user/delete',
  method: 'POST',
  needConfirm: 'Y',
  confirmMsg: 'Are you sure you want to delete this user?',
  needRefresh: 'Y',
  afterAction: 'assignForm',
  params: [dynamicParam]
}

// Button event example - Code execution
const codeBtnAction: BtnAction = {
  viewType: 'code',
  code: `
    console.log('Execute custom code');
    this.formData.status = 'active';
  `
}

// Button event example - Method call
const methodBtnAction: BtnAction = {
  viewType: 'method',
  actions: function() {
    console.log('Execute custom method');
    this.refreshData();
  }
}
```

## Features

1. Support for multiple view types
2. Support for dynamic parameter configuration
3. Support for API call configuration
4. Support for confirmation prompt mechanism
5. Support for refresh control
6. Support for post-execution actions
7. Support for custom functions and code blocks
8. Support for dynamic forms and components