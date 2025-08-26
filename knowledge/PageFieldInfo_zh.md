# PageFieldInfo 页面字段信息类型

## 概述
PageFieldInfo 是一组 TypeScript 接口类型，用于定义页面表单、字段、容器等的配置信息。

## 主要类型

### PageFieldInfo 页面字段信息
```typescript
export declare interface PageFieldInfo {
  fieldList?: Array<FieldInfo> | any;           // 表单属性
  batchFieldList?: Array<BatchFieldInfo>;       // 批量表单属性
  userTableFuncs?: Array<UserFuncInfo>;         // 表格自定义方法
  stopAutoLoad?: boolean;                       // 是否阻止自动加载列表数据
  cellEditable?: boolean;                       // 是否允许列表单元格可以编辑
  orderBy?: Array<OrderByInfo>;                 // 列表数据排序
  conditions?: Array<SearchParams>;             // 默认查询条件
  batchName?: string;                           // 表单有列表数据时的批量数据Key名称
  sameTable?: boolean;                          // batchFieldList和fieldList是否同一个表
  primaryKey?: string | Array<any>;             // 主键
  priority?: number;                            // 优先级
}
```

### FieldInfo 字段信息
```typescript
export declare interface FieldInfo {
  label?: string;                               // 标签名称
  fieldName: string;                            // 属性名称
  hideFieldName?: string;                       // 隐藏属性名称
  aliasName?: string;                           // 属性别名
  helpMsg?: string;                             // 帮助信息
  type?: string;                                // 类型名称
  listPrototypeDisplay?: boolean;               // 以组件形式展示
  required?: boolean | Ref<boolean>;            // 是否必须项
  formVisible?: boolean | Ref<boolean>;         // 表单是否显示该属性
  listVisible?: boolean | Ref<boolean>;         // 列表是否显示该属性
  viewVisible?: boolean | Ref<boolean>;         // 查看页面是否显示该属性
  minWidth?: number;                            // 列表所在列最小宽度
  disabled?: boolean | Ref<boolean>;            // 是否禁用
  editDisabled?: boolean | Ref<boolean>;        // 编辑时禁用
  tabList?: TabFieldInfo[];                     // Tab容器数据
  cardList?: CardFieldInfo[];                   // Card容器数据
  collapseList?: CollapseList[];                // 折叠容器数据
  dytableList?: FieldInfo[];                    // 动态表格容器数据
  batchFieldList?: BatchFieldInfo[];            // 批量表单属性
  defaultValue?: any;                           // 默认值
  actions?: Function | Record<string, Function>; // 事件内容
  precision?: number;                           // 小数点精度
  preps?: Record<string, any | CompParams>;     // 组件个性化属性
  prefix?: string;                              // 查询表前缀
  matchType?: string;                           // 默认值匹配类型
  displayStyle?: string;                        // 多数据显示风格
  brotherNodes?: FieldInfo[];                   // 相邻的兄弟节点
  priority?: number;                            // 优先级
  searchVisible?: boolean;                      // 列表搜索时是否显示该属性
  rules?: RuleType[] | any;                     // 校验规则
  addActions?: Function | string;               // 添加事件
  editActions?: Function | string;              // 编辑事件
  removeActions?: Function | string;            // 删除事件
}
```

### TabFieldInfo Tab表单数据
```typescript
export declare interface TabFieldInfo {
  title: string;                                // 标题,显示名称
  tabName: string;                              // TabName定义每个Tab的名字
  disabled: string;                             // 是否默认禁用
  subFormFlag: string;                          // 是否是子表单
  tableFlag: string;                            // 如果要列表显示则该属性需要设置为Y
  objectName?: string;                          // 子集合Key名称
  primaryKey: string | Array<any>;              // 主键
  fieldList: Array<FieldInfo>;                  // 属性名
  batchFieldList?: Array<BatchFieldInfo>;       // 批量表单属性
}
```

### CardFieldInfo Card容器信息
```typescript
export declare interface CardFieldInfo extends TabFieldInfo {
  headerFieldList?: FieldInfo[];                // 头部右侧组件信息
}
```

### BatchFieldInfo 批量表单
```typescript
export declare interface BatchFieldInfo {
  batchName: string;                            // 对应后端dto里的List属性名称
  disabled?: string;                            // 是否禁用
  disVisible?: boolean;                         // 禁止显示
  title?: string;                               // 列表标题
  helpMsg?: string;                             // 帮助提示
  initRows?: number;                            // 默认初始化行数
  primaryKey?: string;                          // 主键名称
  batchDefaultData?: any;                       // 新增行时默认添加的属性
  fieldList: Array<FieldInfo> | any;            // 字段属性
  compUrl?: ApiUrls;                            // 当前组件接口
  importInfo?: ImportInfo;                      // 导入数据
  staticData?: string;                          // 是否静态数据
  subFormFlag?: string | boolean;               // batchFieldList和fieldList是否同一个表
  formFlag?: string;                            // 表单标识
}
```

### UserFuncInfo 用户自定义方法信息
```typescript
export declare interface UserFuncInfo {
  authority?: string;                           // 权限编码
  funcName?: string | Function;                 // 方法名称
  btnName?: string;                             // 按钮显示文字名称
  icon?: string;                                // 图标
  priority?: number;                            // 优先级
  helpMsg?: string;                             // 帮助提示
  disabled?: string;                            // 是否禁用
  position?: "table" | "toolbar";               // 按钮显示位置
  children?: UserFuncInfo[];                    // 子节点
}
```

## 使用示例

```typescript
import { PageFieldInfo, FieldInfo } from '@/components/types/PageFieldInfo'

const pageConfig: PageFieldInfo = {
  fieldList: [
    {
      label: '姓名',
      fieldName: 'name',
      type: 'input',
      required: true,
      formVisible: true,
      listVisible: true
    },
    {
      label: '邮箱',
      fieldName: 'email',
      type: 'input',
      required: true,
      formVisible: true,
      listVisible: true
    }
  ],
  primaryKey: 'id',
  batchFieldList: [
    {
      batchName: 'orders',
      title: '订单信息',
      primaryKey: 'id',
      fieldList: [
        {
          label: '订单号',
          fieldName: 'orderNo',
          type: 'input',
          formVisible: true
        }
      ]
    }
  ]
}
```

## 特性

1. 完整的表单字段配置
2. 支持多种容器类型（Tab、Card、Collapse、动态表格等）
3. 支持批量表单处理
4. 支持字段可见性控制
5. 支持默认值和校验规则
6. 支持自定义事件和方法
7. 支持帮助信息和优先级设置
8. 支持搜索和排序配置