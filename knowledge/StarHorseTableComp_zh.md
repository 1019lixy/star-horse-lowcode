# StarHorseTableComp 表格组件

## 概述
StarHorseTableComp组件是基于Element Plus的el-table构建的高级数据表格组件。它提供了显示、过滤、排序和操作表格数据的全面功能，内置分页、选择和CRUD操作。支持列表和卡片视图模式。

## 属性(Props)
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| compUrl | ApiUrls | required | 表格操作的API URLs配置 |
| primaryKey | String/Object | required | 数据操作的主键 |
| fieldList | PageFieldInfo | required | 表格的字段配置 |
| hideBtnCondition | BtnHideCondition[] | [] | 隐藏按钮的条件 |
| showBatchField | Boolean | false | 是否显示批量字段 |
| dataFormat | Function | null | 数据格式化函数 |
| disableAction | Boolean | false | 是否禁用操作 |
| dialogInput | Boolean | false | 是否为对话框输入模式 |
| height | String | "400" | 表格高度 |
| filterCondition | SearchParams[] | undefined | 过滤条件 |
| orderBy | OrderByInfo[] | undefined | 排序配置 |
| showPageBar | Boolean | true | 是否显示分页栏 |
| tableDataList | Array | undefined | 表格的数据列表 |
| reverseDataList | Array | undefined | 反向数据列表 |
| allowSelectParent | Boolean | true | 是否允许选择父节点 |
| expand | Boolean | false | 是否默认展开所有节点 |
| needLoad | Boolean | true | 是否显示加载指示器 |
| title | String | undefined | 表格标题 |
| extendBtns | UserFuncInfo[] | undefined | 扩展按钮 |
| preValidFunc | PreValid[] | {} | 预验证函数 |
| multipleSelect | Boolean | false | 是否允许多选 |
| lineHeight | String | "30px" | 表格行高 |
| showSelection | Boolean | true | 是否显示选择列 |
| expandTable | ExpandTable | undefined | 可展开表格的配置 |
| helpMsg | String | undefined | 帮助信息 |
| globalConfig | Object | undefined | 全局配置 |
| isDynamic | Boolean | false | 是否为动态页面 |
| hideButtonList | Boolean | false | 是否隐藏按钮列表 |
| commonPersons | Array | [] | 数据共享人员 |
| btnPermissions | Object | undefined | 按钮权限 |

## 事件(Events)
| 事件名 | 参数 | 描述 |
|--------|------|------|
| selectItem | item | 选择项目时触发 |

## 插槽(Slots)
该组件不直接暴露任何插槽，内部使用el-table组件。

## 方法(Methods) (通过defineExpose暴露)
| 方法名 | 参数 | 返回类型 | 描述 |
|--------|------|----------|------|
| loadByPage | none | void | 按页加载数据 |
| createSearchParams | formData: SearchParams[], orderBy: OrderByInfo[] | void | 创建搜索参数 |
| permissionList | none | Object | 获取权限列表 |
| assignData | dataList: Array<any> | void | 为表格分配数据 |
| getIds | none | Array | 获取选中的ID |
| batchDelete | none | Promise<void> | 删除选中的项目 |
| exportData | none | void | 导出数据 |
| selectedFields | none | void | 处理导出的选中字段 |
| tableCompFunc | authority: any | void | 处理表格组件功能 |
| init | none | Promise<void> | 初始化组件 |
| pageChangeClick | currentPage: number | void | 处理页面变化 |
| pageSizeClick | pageSize: number | void | 处理页面大小变化 |
| deleteById | ids: Array<any> | Promise<void> | 根据ID删除项目 |
| editData | row: any | void | 编辑数据行 |
| viewData | row: any | void | 查看数据行 |
| selectRow | row: any | void | 选择行 |
| handleSelectionChange | val: Array<any> | void | 处理选择变化 |
| showType | type: string | void | 显示表格类型（列表/卡片） |
| moveColumn | none | void | 移动列 |
| reCreateData | none | void | 重新创建数据 |
| analysisPrimaryKeys | keys: any, data: any | any | 分析主键 |

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

### ExpandTable
```typescript
interface ExpandTable {
  dataField: string;
  title?: string;
  showButton?: boolean;
  primaryKey?: string | Array<any>;
  extendFuncs?: UserFuncInfo[];
  expandUrls?: ApiUrls;
  fieldList: FieldInfo[];
}
```

## 使用示例
```vue
<template>
  <star-horse-table-comp
    :comp-url="compUrl"
    :primary-key="primaryKey"
    :field-list="fieldList"
    @select-item="handleSelectItem"
  />
</template>

<script setup>
import { ref } from 'vue'
import StarHorseTableComp from '@/components/comp/StarHorseTableComp.vue'

const compUrl = {
  pageListUrl: '/api/data/pageList',
  deleteUrl: '/api/data/delete'
}

const primaryKey = 'id'

const fieldList = {
  fieldList: [
    {
      fieldName: 'name',
      label: '姓名',
      type: 'input'
    },
    {
      fieldName: 'email',
      label: '邮箱',
      type: 'input'
    }
  ]
}

const handleSelectItem = (item) => {
  console.log('选中的项目:', item)
}
</script>
```