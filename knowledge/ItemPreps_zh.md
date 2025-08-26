# ItemPreps 组件属性类型

## 概述
ItemPreps 是一组 TypeScript 接口类型，用于定义组件属性、容器属性和关联关系的配置信息。

## 主要类型

### ItemPreps 组件属性
```typescript
export interface ItemPreps {
  isDesign?: boolean;          // 是否是设计模式
  disabled?: boolean;          // 是否禁用
  showFormItem?: boolean;      // 是否显示在表单中
  bareFlag?: boolean;          // 是否是基础组件
  isSearch?: boolean;          // 是否是搜索组件
  field: FieldInfo | any;      // 组件属性
  parentField?: any;           // 父组件属性
  formInfo?: any;              // 表单信息
  parentId?: string;           // 父组件ID
  callBack?: Function;         // 回调函数
  source?: number;             // 组件来源
}
```

### ContainerPreps 容器属性
```typescript
export interface ContainerPreps {
  compUrl: ApiUrls;            // 组件url
  fieldList?: PageFieldInfo | any; // 组件属性
  item?: any;                  // 组件属性
  objectName?: string;         // 组件名称
  dataIndex?: number;          // 数据索引
  propPrefix?: string;         // 父节点名称
  parentPreps?: any;           // 父组件属性
  subFormFlag?: string;        // 子表单标识
  batchName?: string;          // 批量操作名称
  batchFieldName?: string;     // 批量操作字段名称
  primaryKey: string | any;    // 主键
  rules?: any;                 // 校验规则
  compSize: string;            // 组件大小
  source: number;              // 组件来源
}
```

### RelationDetail 关联关系详情
```typescript
export interface RelationDetail {
  controlCondition:            // 控制条件
    | "eqConditionDataLinkage"   // 条件数据联动
    | "asParamDataLinkage"       // 参数数据联动
    | "eqDisable"                // 值相等时禁用
    | "eqEditable"               // 值相等时可编辑
    | "eqHide"                   // 值相等时隐藏
    | "eqVisible"                // 值相等时显示
    | "eqRequired"               // 值相等时必填
    | "assignValue"              // 赋值
    | "changeType"               // 改变类型
    | string;
  relationFields: string | Array<string>; // 关联字段
  matchType: string;           // 匹配类型
  matchFieldName: string;      // 匹配字段名称
  matchFieldValue: Array<string> | string; // 匹配字段值
  params: RedirectParams;      // 关联参数
  staticDatas: SelectOption[] | any; // 关联静态数据
  isWorking: boolean;          // 多次事件是否 working
}
```

### ItemRelation 组件关联
```typescript
export interface ItemRelation {
  actionName: string;          // 关联事件名称
  relationDetails: RelationDetail[]; // 关联关系详情
}
```

## 使用示例

```typescript
import { ItemPreps, ContainerPreps, RelationDetail } from '@/components/types/ItemPreps'

// 组件属性示例
const itemProps: ItemPreps = {
  isDesign: false,
  disabled: false,
  showFormItem: true,
  field: {
    fieldName: 'name',
    label: '姓名',
    type: 'input'
  },
  source: 1
}

// 容器属性示例
const containerProps: ContainerPreps = {
  compUrl: apiUrls,
  objectName: 'userForm',
  primaryKey: 'id',
  compSize: 'small',
  source: 1
}

// 关联关系示例
const relationDetail: RelationDetail = {
  controlCondition: 'eqConditionDataLinkage',
  relationFields: ['city'],
  matchType: 'eq',
  matchFieldName: 'province',
  matchFieldValue: ['广东省'],
  params: redirectParams,
  staticDatas: [],
  isWorking: false
}
```

## 特性

1. 完整的组件属性配置
2. 支持容器组件属性定义
3. 支持复杂的组件关联关系
4. 支持设计模式和运行模式切换
5. 支持禁用状态和可见性控制
6. 支持表单和搜索模式区分
7. 支持回调函数和数据源标识
8. 支持多种控制条件类型