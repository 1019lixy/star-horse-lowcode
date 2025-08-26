# ApiUrls API Interface Configuration Type

## Overview
ApiUrls is a TypeScript interface type used to define various API interface addresses and configuration information required by components.

## Type Definition

```typescript
export type ApiUrls = {
  // Pagination interface
  pageListUrl: string;
  
  // Merge interface
  mergeUrl: string;
  
  // Merge draft interface
  mergeDraftUrl: string;
  
  // Batch merge interface
  batchMergeUrl: string;
  
  // Batch draft merge interface
  batchMergeDraftUrl: string;
  
  // Get data by ID interface
  loadByIdUrl: string;
  
  // Get data by ID interface (view mode)
  loadByIdForViewUrl: string;
  
  // Delete data interface
  deleteUrl: string;
  
  // Delete data by condition
  deleteByConditionUrl?: string;
  
  // Export data interface
  exportAllUrl?: string;
  
  // Download template interface
  downloadTemplateUrl?: string;
  
  // Custom query interface (returns all data that meets the conditions)
  listConditionUrl?: string;
  
  // Custom query interface (returns one data that meets the conditions)
  oneConditionUrl?: string;
  
  // Upload interface
  uploadUrl?: string;
  
  // Import data interface
  importUrl?: string;
  
  // Execute interface
  executeUrl?: string;
  
  // Modify columns interface
  modifyColumnsUrl?: string;
  
  // Interface path prefix
  basePrefix?: string;
  
  // Permission interface
  permissionsUrl?: string;
  
  // Application name
  appName?: string;
  
  // Interface filter conditions
  condition?: Array<SearchParams>;
  
  // Whether to redirect interface
  redirect?: boolean;
  
  // Interface request method
  httpMethod?: string;
  
  // Data request method
  dataType?: string;
  
  // Pagination interface function
  pageAction?: Function;
  
  // Edit interface function
  mergeAction?: Function;
  
  // Edit draft interface function
  mergeDraftAction?: Function;
  
  // Batch edit interface function
  batchMergeAction?: Function;
  
  // Batch edit draft interface function
  batchMergeDraftAction?: Function;
  
  // Get data by ID interface function
  loadByIdAction?: Function;
  
  // Delete data interface function
  deleteAction?: Function;
  
  // Delete data by condition function
  deleteByConditionAction?: Function;
  
  // Export data interface function
  exportDataAction?: Function;
  
  // Download template interface function
  downloadTemplateAction?: Function;
  
  // Custom query interface function
  queryConditionAction?: Function;
  
  // Custom query interface function
  queryOneByConditionAction?: Function;
  
  // Upload interface function
  uploadAction?: Function;
  
  // Import data interface function
  importAction?: Function;
  
  // Execute interface function
  executeAction?: Function;
  
  // Modify columns interface function
  modifyColumnsAction?: Function;
};
```

## Usage Example

```typescript
import { ApiUrls } from '@/components/types/ApiUrls'

const apiConfig: ApiUrls = {
  pageListUrl: '/api/user/page',
  mergeUrl: '/api/user/save',
  deleteUrl: '/api/user/delete',
  loadByIdUrl: '/api/user/detail',
  // Other interface configurations...
}

// Using in components
const fetchData = async () => {
  const response = await fetch(apiConfig.pageListUrl)
  // Process response data
}
```

## Features

1. Complete CRUD interface configuration
2. Support for batch operation interfaces
3. Support for draft operation interfaces
4. Support for custom query interfaces
5. Support for file upload/download interfaces
6. Support for permission control interfaces
7. Support for function-based interface calls
8. Support for interface prefix and redirection configuration