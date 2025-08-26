# StarHorseForm 表单组件

## 概述
StarHorseForm组件是Element Plus中el-form组件的封装。它提供了增强的表单处理功能，包括数据加载、验证和提交功能。该组件专为star-horse-lowcode系统的字段映射和API集成功能而设计。

## 属性(Props)
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| compUrl | ApiUrls | undefined | 表单操作的API URLs配置 |
| fieldList | PageFieldInfo | required | 表单的字段配置 |
| batchName | String | "batchDataList" | 批量数据操作的名称 |
| batchFieldName | String | "batchFieldList" | 批量操作的字段名 |
| outerFormData | Object | undefined | 要与内部数据合并的外部表单数据 |
| primaryKey | String/Object | undefined | 数据操作的主键 |
| globalCondition | Object | undefined | API调用的全局条件 |
| rules | Object | undefined | 表单字段的验证规则 |
| formSize | String | Config.compSize | 表单元素的大小 |
| labelPosition | String | "left" | 表单中标签的位置 |
| typeModel | String | undefined | 表单的类型模型 |
| dynamicForm | Boolean | false | 是否为动态表单 |
| selectData | Array<SelectOption> | [{name:"正常",value:"1"},{name:"禁用",value:"2"}] | 状态字段的选择数据 |

## 事件(Events)
| 事件名 | 参数 | 描述 |
|--------|------|------|
| refresh | formData, responseData | 表单提交成功后触发 |
| dataLoaded | loadedData | 表单数据加载完成后触发 |
| exportData | formData | 导出当前表单数据时触发 |
| removeRow | row | 从表格中删除行时触发 |
| addRow | row | 向表格中添加行时触发 |
| inited | none | 表单初始化完成后触发 |

## 插槽(Slots)
该组件不直接暴露任何插槽，内部使用el-form组件。

## 方法(Methods) (通过defineExpose暴露)
| 方法名 | 参数 | 返回类型 | 描述 |
|--------|------|----------|------|
| merge | type: string | void | 验证并提交表单数据 |
| mergeDraft | type: string | void | 将表单数据作为草稿提交 |
| resetForm | none | void | 将表单重置为默认值 |
| setFormData | data: any | void | 设置表单数据 |
| getFormData | none | Ref<Object> | 获取当前表单数据 |
| updateFormData | data: any | void | 使用新值更新表单数据 |
| getFields | none | Array<FieldInfo> | 获取表单字段 |
| getFormFields | none | Array<any> | 从el-form获取表单字段 |
| validate | none | Promise<boolean> | 验证表单 |
| setSource | dataSource: number | void | 设置数据源类型 |

## 数据结构

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

## 使用示例
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
      label: '姓名',
      type: 'input',
      required: true
    },
    {
      fieldName: 'email',
      label: '邮箱',
      type: 'input'
    }
  ]
}

const handleRefresh = (formData, responseData) => {
  console.log('表单提交成功')
}

const handleDataLoaded = (loadedData) => {
  console.log('表单数据加载完成', loadedData)
}
</script>
```