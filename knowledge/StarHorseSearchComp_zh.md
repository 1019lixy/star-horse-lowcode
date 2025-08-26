# StarHorseSearchComp 搜索组件

## 概述
StarHorseSearchComp组件是一个功能丰富的搜索组件，支持多种搜索字段类型、默认条件设置、展开/收起功能等。它基于Element Plus的表单组件构建，提供了灵活的搜索配置选项。

## 属性(Props)
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| dialogInput | Boolean | false | 是否为对话框输入模式 |
| mutComp | Boolean | false | 是否为多组件模式 |
| compUrl | ApiUrls | undefined | API URLs配置 |
| formData | SearchFields | required | 搜索表单数据配置（必需） |
| defaultCondition | Array<SearchParams> | undefined | 默认搜索条件 |

## 事件(Events)
| 事件名 | 参数 | 描述 |
|--------|------|------|
| searchData | searchDatas: Array<SearchParams> | 搜索数据事件，返回搜索参数数组 |

## 插槽(Slots)
该组件不使用插槽。

## 方法(Methods) (通过defineExpose暴露)
| 方法名 | 参数 | 返回类型 | 描述 |
|--------|------|----------|------|
| searchForm | none | Ref<Object> | 获取搜索表单数据 |
| setData | data: any | void | 设置搜索表单数据 |
| createSearchParams | formData: any | Array<SearchParams> | 创建搜索参数 |

## 数据结构

### SearchFields
```typescript
interface SearchFields {
  fieldList?: Array<SearchFieldInfo>;
}
```

### SearchFieldInfo
```typescript
interface SearchFieldInfo {
  label?: string;
  fieldName: string;
  type?: string;
  defaultVisible?: boolean;
  disabled?: boolean;
  defaultValue?: any;
  matchType?: string;
  // 其他字段属性与FieldInfo类似
}
```

### SearchParams
```typescript
interface SearchParams {
  propertyName: string;
  value: any;
  operation: string;
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

## 使用示例
```vue
<template>
  <star-horse-search-comp
    :form-data="searchConfig"
    :default-condition="defaultCondition"
    @search-data="handleSearch"
  />
  
  <star-horse-table-comp
    ref="tableRef"
    :comp-url="compUrl"
    :primary-key="primaryKey"
    :field-list="fieldList"
  />
</template>

<script setup>
import { ref } from 'vue'
import StarHorseSearchComp from '@/components/comp/StarHorseSearchComp.vue'
import StarHorseTableComp from '@/components/comp/StarHorseTableComp.vue'

const tableRef = ref(null)

const searchConfig = {
  fieldList: [
    {
      fieldName: 'name',
      label: '姓名',
      type: 'input',
      defaultVisible: true
    },
    {
      fieldName: 'status',
      label: '状态',
      type: 'select',
      defaultVisible: false,
      preps: {
        values: [
          { name: '正常', value: '1' },
          { name: '禁用', value: '2' }
        ]
      }
    }
  ]
}

const defaultCondition = [
  {
    propertyName: 'deleted',
    value: 0,
    operation: 'eq'
  }
]

const compUrl = {
  pageListUrl: '/api/data/pageList'
}

const primaryKey = 'id'

const fieldList = {
  fieldList: [
    {
      fieldName: 'name',
      label: '姓名'
    },
    {
      fieldName: 'status',
      label: '状态'
    }
  ]
}

const handleSearch = (searchParams) => {
  console.log('搜索参数:', searchParams)
  // 调用表格组件的搜索方法
  tableRef.value.createSearchParams(searchParams)
}
</script>
```