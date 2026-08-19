# 类型定义

组件库导出的所有 TypeScript 类型定义。

---

## ApiUrls — 接口地址

组件使用的接口地址与动作属性集合。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| pageListUrl | `string` | 是 | 分页接口 |
| mergeUrl | `string` | 是 | merge 接口 |
| mergeDraftUrl | `string` | 是 | merge 暂存接口 |
| batchMergeUrl | `string` | 是 | 批量 Merge 接口 |
| batchMergeDraftUrl | `string` | 是 | 批量暂存接口 |
| loadByIdUrl | `string` | 是 | 根据 Id 获取数据接口 |
| loadByIdForViewUrl | `string` | 是 | 根据 Id 获取数据接口（查看用） |
| deleteUrl | `string` | 是 | 删除数据接口 |
| deleteByConditionUrl | `string` | 否 | 根据条件删除数据 |
| exportAllUrl | `string` | 否 | 导出数据接口 |
| downloadTemplateUrl | `string` | 否 | 下载模板接口 |
| listConditionUrl | `string` | 否 | 自定义查询接口，返回所有数据 |
| oneConditionUrl | `string` | 否 | 自定义查询接口，返回一条数据 |
| uploadUrl | `string` | 否 | 上载接口 |
| importUrl | `string` | 否 | 导入数据接口 |
| executeUrl | `string` | 否 | 执行接口 |
| modifyColumnsUrl | `string` | 否 | 修改字段接口 |
| customerUrl1 ~ customerUrl5 | `string` | 否 | 用户自定义接口 1~5 |
| basePrefix | `string` | 否 | 接口路径前缀 |
| permissionsUrl | `string` | 否 | 权限接口 |
| redirectExecutionUrl | `string` | 否 | 重定向执行接口 |
| redirectPageListUrl | `string` | 否 | 重定向分页接口 |
| exportSingleDataUrl | `string` | 否 | 导出单条数据接口 |
| appName | `string` | 否 | 应用名称或接口前缀路径 |
| subPrefix | `string` | 否 | 子路径 |
| condition | `SearchParams[]` | 否 | 权限隔离属性字段，所有 Post 请求都会带上 |
| redirect | `boolean` | 否 | 是否接口转发 |
| httpMethod | `string` | 否 | 接口请求方式 |
| dataType | `string` | 否 | 数据请求方式 |
| pageAction | `Function` | 否 | 分页接口（函数形式） |
| mergeAction | `Function` | 否 | 编辑接口（函数形式） |
| mergeDraftAction | `Function` | 否 | 编辑暂存接口（函数形式） |
| batchMergeAction | `Function` | 否 | 批量编辑接口（函数形式） |
| batchMergeDraftAction | `Function` | 否 | 批量编辑暂存接口（函数形式） |
| loadByIdAction | `Function` | 否 | 根据 Id 获取数据接口（函数形式） |
| deleteAction | `Function` | 否 | 删除数据接口（函数形式） |
| deleteByConditionAction | `Function` | 否 | 根据条件删除数据（函数形式） |
| exportDataAction | `Function` | 否 | 导出数据接口（函数形式） |
| downloadTemplateAction | `Function` | 否 | 下载模板接口（函数形式） |
| queryConditionAction | `Function` | 否 | 自定义查询接口（函数形式） |
| queryOneByConditionAction | `Function` | 否 | 自定义查询接口（函数形式，查一条） |
| uploadAction | `Function` | 否 | 上载接口（函数形式） |
| importAction | `Function` | 否 | 导入数据接口（函数形式） |
| executeAction | `Function` | 否 | 执行接口（函数形式） |
| modifyColumnsAction | `Function` | 否 | 修改字段接口（函数形式） |
| exportSingleDataAction | `Function` | 否 | 导出单条数据（函数形式） |

---

## SearchParams — 查询条件

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| propertyName | `string` | 否 | 属性名称 |
| operation | `string \| null` | 否 | 匹配方式：`eq`/`lk`/`gt`/`gte`/`lt`/`lte`/`llk`/`rlk`/`in`/`nin`/`exits` |
| value | `any` | 否 | 查询值 |
| orOperList | `SearchParams[]` | 否 | 或查询 |

---

## SearchFields — 查询属性集合

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| fieldList | `SearchProps[]` | 是 | 查询字段列表 |

---

## SearchProps — 查询组件属性

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| label | `string` | 否 | 标签 |
| fieldName | `string` | 否 | 字段名 |
| type | `string` | 否 | 类型 |
| matchType | `string` | 否 | 匹配类型 |
| disabled | `boolean \| string` | 否 | 是否禁用 |
| defaultValue | `any \| null` | 否 | 默认值 |
| defaultVisible | `boolean` | 否 | 默认是否可见 |
| helpMsg | `string` | 否 | 帮助提示 |
| minWidth | `string` | 否 | 最小宽度 |
| prefix | `string` | 否 | 表的别名 |
| params | `CompParams` | 否 | 弹窗数据配置 |
| preps | `any` | 否 | 属性 |
| dataType | `string` | 否 | 数据类型 |
| optionList | `SelectOption[]` | 否 | 选项列表 |

---

## SelectOption — 下拉选项

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| name | `string` | 否 | 名称 |
| value | `string \| number` | 否 | 值 |
| disabled | `string` | 否 | 是否禁用 |
| helpMsg | `string` | 否 | 帮助提示 |
| children | `SelectOption[]` | 否 | 子选项 |

---

## FieldInfo — 表单字段属性

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| label | `string` | 否 | 标签名称 |
| fieldName | `string` | 是 | 属性名称 |
| hideFieldName | `string` | 否 | 隐藏属性名称 |
| aliasName | `string` | 否 | 属性别名 |
| helpMsg | `string` | 否 | 帮助信息 |
| id | `string` | 否 | ID |
| type | `string` | 否 | 类型名称（date/select/number/textarea/password 等） |
| listPrototypeDisplay | `boolean` | 否 | 是否以组件形式展示 |
| required | `boolean` | 否 | 是否必须项 |
| formVisible | `boolean` | 否 | 表单是否显示 |
| listVisible | `boolean` | 否 | 列表是否显示 |
| viewVisible | `boolean` | 否 | 查看页面是否显示 |
| visiblePlatform | `string` | 否 | app 端是否可见 |
| minWidth | `number` | 否 | 列表所在列最小宽度 |
| disabled | `boolean` | 否 | 是否禁用 |
| editDisabled | `boolean` | 否 | 编辑时禁用 |
| tabList | `TabFieldInfo[]` | 否 | Tab 容器数据 |
| appList | `AppFieldInfo[]` | 否 | App 容器数据 |
| cardList | `CardFieldInfo[]` | 否 | Card 容器数据 |
| collapseList | `CollapseFieldInfo[]` | 否 | 折叠容器数据 |
| splitterList | `SplitterFieldInfo[]` | 否 | 分栏容器数据 |
| dytableList | `FieldInfo[]` | 否 | 动态表格容器数据 |
| batchFieldList | `BatchFieldInfo[]` | 否 | 动态列表容器数据 |
| defaultValue | `any` | 否 | 默认值 |
| actions | `Function \| Record<string, Function>` | 否 | 事件内容 |
| precision | `number` | 否 | 小数点精度 |
| preps | `Record<string, any \| CompParams>` | 否 | 组件个性化属性（核心配置入口） |
| prefix | `string` | 否 | 查询表前缀 |
| matchType | `string` | 否 | 默认值匹配类型 |
| displayStyle | `string` | 否 | 多数据显示风格（tab/list） |
| brotherNodes | `FieldInfo[]` | 否 | 相邻的兄弟节点 |
| priority | `number` | 否 | 优先级 |
| searchVisible | `boolean` | 否 | 列表搜索时是否显示 |
| addActions | `Function \| string` | 否 | 添加事件 |
| editActions | `Function \| string` | 否 | 编辑事件 |
| removeActions | `Function \| string` | 否 | 删除事件 |
| children | `FieldInfo[]` | 否 | 子节点（多级表头） |
| staticData | `boolean` | 否 | 是否静态文本数据 |

---

## PageFieldInfo — 页面字段信息

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| fieldList | `FieldInfo[] \| any` | 否 | 表单属性 |
| batchFieldList | `BatchFieldInfo[]` | 否 | 批量表单属性 |
| userTableFuncs | `UserFuncInfo[]` | 否 | 表格自定义方法 |
| stopAutoLoad | `boolean` | 否 | 是否阻止自动加载列表数据 |
| cellEditable | `boolean` | 否 | 是否允许列表单元格可编辑 |
| orderBy | `OrderByInfo[]` | 否 | 列表数据排序 |
| conditions | `SearchParams[]` | 否 | 默认查询条件 |
| subTableName | `string` | 否 | 提交后端批量数据的 Key 名称 |
| sameTable | `boolean` | 否 | batchFieldList 和 fieldList 是否同一个表 |
| primaryKey | `string \| Array<any>` | 否 | 主键 |
| priority | `number` | 否 | 优先级 |

---

## BatchFieldInfo — 批量表单

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| subTableName | `string` | 是 | 对应后端 dto 里的 List 属性名称 |
| disabled | `string` | 否 | 是否禁用 |
| disVisible | `boolean` | 否 | 禁止显示 |
| title | `string` | 否 | 列表标题 |
| helpMsg | `string` | 否 | 帮助提示 |
| initRows | `number` | 否 | 默认初始化行数 |
| primaryKey | `string` | 否 | 主键名称 |
| batchDefaultData | `any` | 否 | 新增行时默认添加的属性 |
| fieldList | `FieldInfo[] \| any` | 是 | 字段属性 |
| compUrl | `ApiUrls` | 否 | 当前组件接口 |
| importInfo | `ImportInfo` | 否 | 导入数据 |
| staticData | `string` | 否 | 是否静态数据 |
| subFormFlag | `string \| boolean` | 否 | 是否同表 |
| formFlag | `string` | 否 | 表单标识 |

---

## UserFuncInfo — 用户自定义方法

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| authority | `string` | 否 | 权限编码 |
| funcName | `string \| Function` | 否 | 方法名称 |
| btnName | `string` | 否 | 按钮显示文字名称 |
| icon | `string` | 否 | 图标 |
| priority | `number` | 否 | 优先级 |
| helpMsg | `string` | 否 | 帮助提示 |
| disabled | `string` | 否 | 是否禁用（Y/N） |
| position | `'table' \| 'toolbar'` | 否 | 按钮显示位置 |
| override | `boolean` | 否 | 是否覆盖原来的方法 |
| children | `UserFuncInfo[]` | 否 | 子节点 |

---

## OrderByInfo — 排序条件

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| fieldName | `string` | 是 | 排序属性名称 |
| orderBy | `string` | 是 | 升降序（`asc`/`desc`） |

---

## DialogProps — 弹窗属性

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| batchDialogTitle | `string` | 否 | 批量编辑标题 |
| dialogTitle | `string` | 否 | 编辑标题 |
| batchEditVisible | `boolean` | 否 | 批量编辑弹窗控制变量 |
| editVisible | `boolean` | 否 | 编辑弹窗控制变量 |
| uploadVisible | `boolean` | 否 | 上传组件控制变量 |
| viewVisible | `boolean` | 否 | 查看数据控制变量 |
| bakeVisible1 | `boolean` | 否 | 弹窗显示/隐藏备用 1 |
| bakeVisible2 | `boolean` | 否 | 弹窗显示/隐藏备用 2 |
| bakeVisible3 | `boolean` | 否 | 弹窗显示/隐藏备用 3 |
| ids | `any` | 否 | 数据 id |
| isExpand | `boolean` | 否 | 是否扩展表 |
| expandUrl | `ApiUrls` | 否 | 扩展表的接口 API |

---

## DynamicNode — 动态节点

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | `string` | 是 | 节点 ID |
| label | `string` | 是 | 节点标签 |
| name | `string` | 是 | 节点名称 |
| icon | `string` | 否 | 节点图标 |
| type | `string` | 否 | 节点类型 |
| preps | `Record<string, any>` | 否 | 节点属性 |
| styles | `Record<string, any>` | 否 | 节点样式 |
| children | `DynamicNode[]` | 否 | 子节点 |

---

## BtnAction — 按钮事件

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| viewType | `'inter' \| 'comp' \| 'code' \| 'method'` | 是 | 视图类型 |
| idDynamicForm | `string` | 否 | 动态表单参数 |
| componentName | `string` | 否 | 动态组件名称 |
| isDynamicParam | `string` | 否 | 是否动态参数 |
| params | `SearchParams[] \| DynamicParamField[]` | 否 | 动态参数 |
| url | `string` | 否 | 接口地址 |
| method | `string` | 否 | 请求方式 |
| needConfirm | `string` | 否 | 是否需要确认 |
| confirmMsg | `string` | 否 | 确认提示信息 |
| needRefresh | `string` | 否 | 是否需要刷新 |
| afterAction | `string` | 否 | 执行完成后的动作 |
| actions | `Function` | 否 | 执行函数 |
| code | `string` | 否 | JS 代码块 |

---

## BtnAuth — 按钮权限

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| btnName | `string` | 是 | 按钮名字 |
| icon | `string` | 否 | 图标 |
| labelName | `string` | 是 | 标签名字 |
| exec | `Function` | 否 | 自定义调用方法 |
| disabled | `string` | 否 | 是否禁用（Y/N） |
| children | `BtnAuth[]` | 否 | 子节点 |

---

## CompParams — 动态组件参数

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| needField | `FieldMapping[]` | 是 | 选中数据时需要的字段 |
| recall | `Function` | 否 | 回调函数 |
| primaryKey | `string \| Array<any>` | 是 | 主键名称 |
| dataUrl | `ApiUrls` | 是 | 接口地址 |
| fieldList | `FieldInfo[]` | 是 | 字段信息 |
| condition | `SearchParams[]` | 否 | 接口过滤条件 |
| orderBy | `OrderByInfo[]` | 否 | 列表数据排序 |
| dataFormat | `Function` | 否 | 格式化方法 |
| searchFieldList | `SearchFields[]` | 否 | 查询字段 |
| readonly | `string` | 否 | 是否只读 |

---

## ExpandTable — 嵌套表结构

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| dataField | `string` | 是 | 列表数据字段 |
| title | `string` | 否 | 列表标题 |
| showButton | `boolean` | 否 | 是否显示操作按钮 |
| primaryKey | `string \| Array<any>` | 否 | 扩展表主键 |
| extendFuncs | `UserFuncInfo[]` | 否 | 扩展按钮方法 |
| expandUrls | `ApiUrls` | 否 | 扩展方法 API 接口 |
| fieldList | `FieldInfo[]` | 是 | 列表字段 |

---

## 其他类型

| 类型名 | 说明 |
|---|---|
| `DynamicParamField` | 动态参数字段定义 |
| `PreValid` | 按钮响应事件前置校验 |
| `CustomerItem` | 折叠面板数据格式 |
| `NodeInfo` | 节点信息 |
| `EdgeInfo` | 边构建信息 |
| `DyCompField` | 动态组件字段定义 |
| `ItemType` | 组件属性 |
| `CompAction` | 组件操作 |
| `CompType` | 组件类型 |
| `ItemPreps` | 组件通用属性集合 |
| `ContainerPreps` | 容器组件属性 |
| `RelationDetail` | 联动关系详情 |
| `ApiInfo` | 接口信息 |
| `OptionField` | 数据源字段映射配置 |
| `ApiLinkageDetail` | 第三方接口联动详情 |
| `ItemRelation` | 联动对象 |
| `MenusInfo` | 菜单信息 |
| `PageProps` | 页面数据信息（分页相关） |
| `DataListProps` | 数据列表属性 |
| `JoinSearchParams` | 连接查询条件 |
| `SearchInfo` | 查询对象 |
| `BtnHideCondition` | 列表按钮隐藏条件 |
| `RedirectParams` | 接口重定向参数 |
| `PreOrPendEventType` | 前后缀事件类型 |
| `PreOrPendEventConfig` | 前后缀元素事件配置 |
| `RuleType` | 校验规则类型 |
| `EditCondition` | 编辑条件 |
| `ShortKey` | 快捷键定义 |
| `Tags` | 标签信息 |
| `RoleInfo` | 角色信息 |
| `UserInfo` | 用户信息 |
| `FieldMapping` | 属性映射 |
| `ImportInfo` | 导入信息 |
| `SubFieldInfo` | 子表单信息 |
