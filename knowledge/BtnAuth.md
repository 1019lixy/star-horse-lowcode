# BtnAuth Button Permission Types

## Overview
BtnAuth is a set of TypeScript interface types used to define button permissions and pre-validation rules.

## Main Types

### BtnAuth Button Permission
```typescript
export declare interface BtnAuth {
  btnName: string;        // Button name
  icon?: string;          // Icon
  labelName: string;      // Label name
  exec?: Function;        // Custom execution method
  disabled?: string;      // Whether it is disabled (Y for yes, N for no)
  children?: BtnAuth[];   // Child nodes
}
```

### PreValid Pre-validation
```typescript
export declare interface PreValid {
  authority: string;      // Permission identifier
  valid: Function;        // Validation method
  msg?: string;           // Validation failure message
}
```

## Usage Example

```typescript
import { BtnAuth, PreValid } from '@/components/types/BtnAuth'

// Button permission example
const btnAuth: BtnAuth = {
  btnName: 'Delete',
  icon: 'delete',
  labelName: 'deleteBtn',
  exec: () => {
    console.log('Execute delete operation')
  },
  disabled: 'N'
}

// Pre-validation example
const preValid: PreValid = {
  authority: 'delete',
  valid: () => {
    return confirm('Are you sure you want to delete?')
  },
  msg: 'Delete operation cancelled'
}
```

## Features

1. Complete button permission definition
2. Support for icon and label configuration
3. Support for custom execution methods
4. Support for disabled state control
5. Support for tree-structured child nodes
6. Support for pre-validation rules
7. Support for validation failure messages