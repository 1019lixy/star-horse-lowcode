# 表单项组件

所有表单项组件共享以下核心机制：

1. **Props 类型**：`ItemPreps`（见下方公共接口）
2. **属性透传**：通过 `v-bind="prepsFilter(field.preps)"` 将 `field.preps` 中的属性透传给底层 Element Plus 组件，因此 **每个表单项组件支持其包装的 Element Plus 组件的所有 Props/Events**
3. **联动策略**：通过 `field.preps.dataRelation` 配置，详见 [联动策略与数据源](../linkage-and-datasource.md)
4. **公式计算**：通过 `field.preps.formula` 配置，详见 [内部机制](../internal-mechanisms.md)
5. **动态事件**：通过 `v-on="getDynamicEvents()"` 绑定 `field.actions` 中配置的事件

---

## 公共接口 ItemPreps

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| isDesign | `boolean` | 否 | `false` | 是否设计模式（设计模式下可选中、拖拽、右键菜单） |
| disabled | `boolean` | 否 | `false` | 是否禁用 |
| showFormItem | `boolean` | 否 | `false` | 是否显示在表单中 |
| bareFlag | `boolean` | 否 | `false` | 是否基础组件（无 CSS 标签修饰） |
| isSearch | `boolean` | 否 | `false` | 是否搜索组件 |
| field | `FieldInfo \| any` | **是** | — | 组件属性配置，核心配置入口 |
| parentField | `any` | 否 | — | 父组件属性 |
| formInfo | `any` | 否 | — | 所有字段列表（联动查找用） |
| parentId | `string` | 否 | — | 父节点 ID |
| callBack | `Function` | 否 | — | 回调函数 |
| source | `number` | 否 | — | 数据来源标识，影响禁用/联动/初始化行为（详见 [内部机制](../internal-mechanisms.md#4-source-数据来源的影响)） |

## 公共 v-model

| 名称 | 类型 | 说明 |
|---|---|---|
| formData | `any` | 双向绑定的表单数据对象 |

## 公共事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| selfFunc | `(actionName: string, currentData: any)` | 自定义函数/事件回调，`actionName` 为触发的事件名（如 'change'/'blur'/'click'），`currentData` 为当前表单数据 |
| selectItem | `(field: any)` | 选中组件事件（设计模式使用） |

## 公共计算属性

每个表单项组件内部都使用以下计算属性/逻辑：

| 名称 | 说明 |
|---|---|
| `checkIsDisabled(props)` | 综合判断字段是否禁用（考虑 source/disabled/editDisabled/联动等） |
| `prepsFilter(field.preps)` | 过滤并转换 preps 属性，透传给 Element Plus 组件 |
| `initCompCallEvent` | 表单初始化时自动调用 `field.actions` 中的事件 |
| `field.preps.dataRelation` | 联动策略，值变化时自动触发 |

---

## input-item 输入框

**包装组件**：`el-input`

> **支持 el-input 的所有 Props / Events / Slots**，通过 `field.preps` 透传。

### 额外能力

- **前后缀图标/文字**：通过 `preps.prefixIcon` / `preps.prefix` / `preps.suffixIcon` / `preps.suffix`
- **前后置内容**：文字（`prependText` / `appendText`）、操作按钮（`prependAction` / `appendAction`）、下拉选择（`prependList` / `appendList`）
- **前后缀数据合并**：通过 `mergePrefix` / `mergeAppend` 将前后缀值合并到字段值中
- **大文本编辑**：双击打开 EditDataDialog 弹窗
- **公式计算**：支持 `field.preps.formula` 配置

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| prefixIcon | `string` | — | 前缀图标类名（渲染到 #prefix 插槽） |
| prefix | `string` | — | 前缀文字（渲染到 #prefix 插槽） |
| suffixIcon | `string` | — | 后缀图标类名（渲染到 #suffix 插槽） |
| suffix | `string` | — | 后缀文字（渲染到 #suffix 插槽） |
| prependText | `string` | — | 前置文字（渲染到 #prepend 插槽） |
| prependAction | `Array<{actionTitle, icon, actions: PreOrPendEventConfig}>` | — | 前置操作按钮 |
| appendText | `string` | — | 后置文字（渲染到 #append 插槽） |
| appendAction | `Array<{actionTitle, icon, actions: PreOrPendEventConfig}>` | — | 后置操作按钮 |
| prependList | `SelectOption[]` | — | 前置下拉选项（渲染为 el-select） |
| appendList | `SelectOption[]` | — | 后置下拉选项（渲染为 el-select） |
| mergePrefix | `boolean` | `false` | 是否将前缀值合并到字段值 |
| mergeAppend | `boolean` | `false` | 是否将后缀值合并到字段值 |
| preName | `string` | `'pre'+fieldName` | 前缀字段名 |
| appName | `string` | `'app'+fieldName` | 后缀字段名 |
| prependDefaultValue | `string` | — | 前缀默认值 |
| appendDefaultValue | `string` | — | 后缀默认值 |
| readonly | `boolean` | `false` | 只读时双击不打开大文本编辑 |

### 常用 el-input 透传属性

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| placeholder | `string` | — | 占位文字 |
| maxlength | `number` | — | 最大长度 |
| minlength | `number` | — | 最小长度 |
| clearable | `boolean` | `false` | 是否可清空 |
| showWordLimit | `boolean` | `false` | 是否显示字数统计 |
| showPassword | `boolean` | `false` | 是否显示切换密码图标 |
| size | `'large'\|'default'\|'small'` | — | 尺寸 |
| formatter | `Function` | — | 格式化函数 |
| parser | `Function` | — | 解析函数 |

### 使用示例

```ts
// 基础输入框
{ fieldName: 'name', type: 'input', preps: { placeholder: '请输入姓名', clearable: true, maxlength: 50 } }

// 带前后缀的金额输入
{ fieldName: 'amount', type: 'input', preps: { prefix: '¥', placeholder: '请输入金额' } }

// 带后置单位
{ fieldName: 'weight', type: 'input', preps: { appendText: 'kg' } }

// 带前置下拉选择（区号）
{ fieldName: 'phone', type: 'input', preps: {
  mergePrefix: true,
  prependList: [{ name: '+86', value: '+86' }, { name: '+1', value: '+1' }],
}}

// 带公式计算
{ fieldName: 'totalPrice', type: 'input', preps: {
  formula: { enable: true, type: 'calc', sourceFields: ['price', 'qty'], expression: '${price} * ${qty}', precision: 2 }
}}

// 带联动
{ fieldName: 'type', type: 'input', preps: {
  dataRelation: { actionName: 'change', relationDetails: [{ controlCondition: 'eqHide', relationFields: ['detail'], matchType: 'eq', matchFieldName: 'type', matchFieldValue: ['1'], params: {}, staticDatas: [], isWorking: false }] }
}}
```

---

## textarea-item 文本域

**包装组件**：`el-input`（type="textarea"）

> **支持 el-input textarea 模式的所有 Props / Events**。

### 额外能力
- 双击打开大文本编辑弹窗（EditDataDialog）
- 支持公式计算

### 常用 el-input 透传属性

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| placeholder | `string` | — | 占位文字 |
| rows | `number` | `2` | 行数 |
| autosize | `boolean \| { minRows, maxRows }` | `false` | 自适应高度 |
| maxlength | `number` | — | 最大长度 |
| showWordLimit | `boolean` | `false` | 显示字数统计 |
| resize | `'none'\|'both'\|'horizontal'\|'vertical'` | — | 缩放方向 |

---

## number-item 数字输入

**包装组件**：`el-input-number`

> **支持 el-input-number 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| step | `number` | `1` | 步长 |
| min | `number` | `0` | 最小值 |
| max | `number` | — | 最大值 |
| precision | `number` | `0` | 小数精度 |
| formula | `FormulaConfig` | — | 公式计算配置 |

### 常用 el-input-number 透传属性

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| controls | `boolean` | `true` | 是否显示增减按钮 |
| controlsPosition | `'right'` | — | 按钮位置 |
| size | `'large'\|'default'\|'small'` | — | 尺寸 |
| disabled | `boolean` | `false` | 禁用 |

---

## select-item 下拉选择

**包装组件**：`el-select`

> **支持 el-select 的所有 Props / Events / Slots**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|---|
| values | `SelectOption[]` | — | **选项数据**，渲染为 el-option |
| multiple | `boolean` | `false` | 是否多选 |
| remote | `boolean \| string` | `false` | 是否远程搜索 |
| dataSource | `string` | — | 数据源类型（`'url'` 时远程加载数据） |
| selectLabel | `string` | — | 远程搜索标签属性名 |
| showFooter | `boolean` | `false` | 是否显示底部动态添加选项区 |
| props.label | `string` | `'name'` | 选项显示属性名 |
| props.value | `string` | `'value'` | 选项值属性名 |

> **注意**：组件 onMounted 时会自动设置 `filterable=true` 和 `collapseTags=true`。

### 常用 el-select 透传属性

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| placeholder | `string` | — | 占位文字 |
| clearable | `boolean` | `false` | 是否可清空 |
| filterable | `boolean` | `true`(自动) | 是否可搜索 |
| collapseTags | `boolean` | `true`(自动) | 是否折叠标签 |
| collapseTagsTooltip | `boolean` | `false` | 折叠标签是否显示 tooltip |
| allowCreate | `boolean` | `false` | 是否允许创建新选项 |
| defaultFirstOption | `boolean` | `false` | 是否默认选中第一个 |
| size | `'large'\|'default'\|'small'` | — | 尺寸 |

### 使用示例

```ts
// 简单选择
{ fieldName: 'status', type: 'select', preps: {
  values: [{ name: '启用', value: '1' }, { name: '禁用', value: '0' }],
  placeholder: '请选择状态', clearable: true,
}}

// 多选
{ fieldName: 'tags', type: 'select', preps: {
  values: tagList, multiple: true, placeholder: '请选择标签',
}}

// 远程搜索
{ fieldName: 'user', type: 'select', preps: {
  dataSource: 'url', selectLabel: 'name',
  // url 和参数通过 dataSource 配置
}}

// 可添加选项
{ fieldName: 'category', type: 'select', preps: {
  values: [], showFooter: true, allowCreate: true,
}}
```

---

## radio-item 单选框

**包装组件**：`el-radio-group` / `el-radio-button`

> **支持 el-radio-group 和 el-radio 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| values | `SelectOption[]` | — | 选项数据 |
| radioType | `string` | — | `'button'` 时使用按钮样式 |
| readonly | `boolean` | `false` | 是否只读（双击可取消选中） |
| textColor | `string` | — | 选中时文字颜色 |

---

## checkbox-item 复选框

**包装组件**：`el-checkbox-group`

> **支持 el-checkbox-group 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| values | `SelectOption[]` | — | 选项数据 |
| props.label | `string` | `'name'` | 选项显示属性名 |
| props.value | `string` | `'value'` | 选项值属性名 |

---

## switch-item 开关

**包装组件**：`el-switch`

> **支持 el-switch 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| activeText | `string` | `i18n("common.yes")` | 开启文字 |
| inactiveText | `string` | `i18n("common.no")` | 关闭文字 |
| activeValue | `any` | `true` | 开启值 |
| inactiveValue | `any` | `false` | 关闭值 |

---

## date-item 日期选择

**包装组件**：`el-date-picker`

> **支持 el-date-picker 的所有 Props / Events**。

### 内部计算属性

| 名称 | 类型 | 说明 |
|---|---|---|
| effectiveType | `computed<string>` | 最终日期类型，优先级：`preps.type` > `field.type` > `'date'` |
| valueFormat | `computed<string>` | 值格式，根据 effectiveType 自动推导 |
| displayFormat | `computed<string>` | 显示格式，根据 effectiveType 自动推导 |

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `'date'` | 日期类型（date/daterange/datetime/datetimerange/month/year 等），优先级高于 field.type |
| format | `string` | 自动推导 | 显示格式（如 `'YYYY-MM-DD'`） |
| valueFormat | `string` | 自动推导 | 值格式 |
| needSplitName | `boolean` | `false` | 范围选择时是否拆分到 `fieldNameStart` / `fieldNameEnd` 字段 |
| disableDate | `Function \| string` | — | 禁用日期配置（函数返回日期数组，字符串用分号分隔） |

### 常用 el-date-picker 透传属性

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| placeholder | `string` | — | 占位文字 |
| startPlaceholder | `string` | — | 范围选择开始占位 |
| endPlaceholder | `string` | — | 范围选择结束占位 |
| rangeSeparator | `string` | `'-'` | 范围分隔符 |
| clearable | `boolean` | `true` | 是否可清空 |
| size | `'large'\|'default'\|'small'` | — | 尺寸 |
| editable | `boolean` | `true` | 是否可输入 |
| disabledDate | `Function` | — | 禁用日期函数 |

### 使用示例

```ts
// 日期选择
{ fieldName: 'birthDate', type: 'date', preps: { placeholder: '请选择日期' } }

// 日期范围 + 拆分字段
{ fieldName: 'dateRange', type: 'date', preps: { type: 'daterange', needSplitName: true } }
// formData: { dateRange: ['2024-01-01', '2024-12-31'], dateRangeStart: '2024-01-01', dateRangeEnd: '2024-12-31' }

// 日期时间选择
{ fieldName: 'createTime', type: 'date', preps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' } }
```

---

## datetime-item 日期时间选择

与 date-item 完全一致，仅默认 effectiveType 为 `'datetime'`。

---

## time-item 时间选择

**包装组件**：`el-time-select`

> **支持 el-time-select 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| start | `string` | `'00:00'` | 开始时间 |
| end | `string` | `'24:00'` | 结束时间 |
| step | `string` | `'00:05'` | 步长 |

---

## time-picker-item 时间选择器

**包装组件**：`el-time-picker`

> **支持 el-time-picker 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| isRange | `boolean` | — | 是否范围选择 |
| type | `string` | — | `'timerange'` 时也为范围 |
| format | `string` | `'HH:mm:ss'` | 显示格式 |
| valueFormat | `string` | `'HH:mm:ss'` | 值格式 |
| rangeSeparator | `string` | — | 范围分隔符 |

---

## tree-select-item 树选择

**包装组件**：`el-tree-select`

> **支持 el-tree-select 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| multiple | `boolean` | `false` | 是否多选 |
| checkStrictly | `boolean` | `true` | 父子是否不关联 |
| url | `string` | — | 远程数据 URL |
| values / data | `Array` | — | 本地数据 |
| props.label | `string` | `'name'` | 显示属性名 |
| props.value | `string` | `'value'` | 值属性名 |
| props.children | `string` | `'children'` | 子节点属性名 |

---

## cascade-item 级联选择

**包装组件**：`el-cascader`

> **支持 el-cascader 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| options | `Array` | — | 级联选项数据 |
| multiple | `boolean` | `false` | 是否多选 |
| showFooter | `boolean` | `false` | 是否显示底部添加选项区 |
| props | `object` | `{label:'name',value:'value',expandTrigger:'hover'}` | 属性映射 |

---

## datapicker-item 数据拾取选择

**包装组件**：`el-select`（增强版）

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| dataSource | `string` | — | 数据源类型（`'url'` 时从 urlOrDictName 获取） |
| urlOrDictName | `string` | — | URL 或字典名称 |
| queryParams | `Array` | — | 查询参数列表 |
| multiple | `boolean` | `false` | 是否多选 |
| prop.label | `string` | — | 显示属性名 |
| prop.value | `string` | — | 值属性名 |
| filterable | `boolean` | `true` | 是否可搜索（自动设置） |
| collapseTags | `boolean` | `true` | 是否折叠标签（自动设置） |

---

## page-select-item 分页选择

**包装组件**：`el-select`（弹窗模式，内嵌表格+分页）

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| dataUrl | `ApiUrls` | — | 数据接口配置 |
| fieldList | `Array` | — | 列表字段配置 |
| primaryKey | `string` | — | 主键字段名 |
| multiple | `boolean` | `false` | 是否多选 |
| needField | `FieldMapping[]` | — | 字段映射配置 |
| displayField | `string` | — | 显示字段名 |
| searchFieldList | `Array` | — | 搜索字段配置 |
| filterCondition | `SearchParams[]` | — | 过滤条件 |
| orderBy | `OrderByInfo[]` | — | 排序配置 |
| recall | `Function` | — | 回调函数 |

---

## dialog-input-item 弹窗输入

弹窗式输入选择组件。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| multiple | `boolean` | `false` | 是否多选 |
| needField | `FieldMapping[]` | — | 字段映射配置 |
| aliasName | `string` | — | 别名字段名 |
| primaryKey | `string` | — | 主键 |
| dataUrl | `ApiUrls` | — | 数据接口配置 |
| fieldList | `Array` | — | 列表字段 |
| searchFieldList | `Array` | — | 搜索字段 |
| filterCondition | `SearchParams[]` | — | 过滤条件 |
| orderBy | `OrderByInfo[]` | — | 排序 |
| dataFormat | `Function` | — | 数据格式化 |
| recall | `Function` | — | 回调函数 |

---

## dialog-item 弹窗容器

弹窗容器表单项。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| compName | `string` | — | 弹窗内动态组件名 |
| fieldList | `Array` | — | 弹窗内表单字段列表 |
| params | `object` | — | 传递给弹窗内容的参数 |
| compSize | `string` | `'default'` | 组件大小 |
| boxHeight | `string` | `'60%'` | 弹窗高度 |
| boxWidth | `string` | `'50%'` | 弹窗宽度 |

---

## drawer-item 抽屉容器

抽屉容器表单项。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| compName | `string` | — | 动态组件名 |
| fieldList | `Array` | — | 表单字段列表 |
| params | `object` | — | 传递给内容的参数 |
| compSize | `string` | `'default'` | 组件大小 |
| direction | `string` | `'rtl'` | 抽屉方向（rtl/ltr/ttb/btt） |
| modal | `boolean` | `true` | 是否显示遮罩 |
| resizable | `boolean` | `true` | 是否可调整大小 |

---

## button-item 按钮

**包装组件**：`el-button`

> **支持 el-button 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| viewType | `'inter'\|'code'\|'method'\|'form'\|'usercomp'` | — | 操作类型 |
| code | `string` | — | JS 代码块 |
| icon | `string` | — | 按钮图标 |
| url | `string` | — | 接口地址 |
| method | `string` | — | 请求方法 |
| needConfirm | `string` | — | 是否需要确认（'Y'/'N'） |
| confirmMsg | `string` | — | 确认消息 |
| isDynamicParam | `string` | — | 是否动态参数 |
| params | `Array` | — | 请求参数 |
| afterAction | `string` | — | 执行后动作（`'assignCurrentName'` 赋值当前名称 / `'assignForm'` 赋值给表单） |
| actions | `Function` | — | 自定义函数 |
| dialogTitle | `string` | — | 弹窗标题 |
| dialogBtn | `string` | — | 弹窗确认按钮文字 |
| isShowReset | `boolean` | — | 是否显示重置按钮 |
| componentName | `string` | — | 自定义组件名 |
| fieldList | `Array` | — | 弹窗表单字段列表 |

---

## upload-item 文件上传

**包装组件**：`el-upload`

> **支持 el-upload 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| action | `string` | `'/system-config/annex/upload/commonFiles'` | 上传地址 |
| multiple | `boolean` | `false` | 是否多文件 |
| drag | `boolean` | `false` | 是否拖拽上传 |
| maxSize | `number` | — | 文件大小限制（MB） |
| headers | `object \| string` | — | 自定义请求头（支持 JSON 字符串） |
| context | `string` | `'/system-config'` | 文件上下文路径 |

> `selfFunc` emit 的 actionName 值为：`change` / `error` / `exceed` / `preview` / `progress` / `remove` / `success`

---

## image-item 图片

**包装组件**：`el-image`

> **支持 el-image 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| assignType | `string` | — | 赋值方式（`'url'` 时使用输入框+上传按钮） |
| action | `string` | `'/system-config/annex/upload/common'` | 上传地址 |
| context | `string` | `'/system-config'` | 上下文路径 |
| width | `number` | — | 图片宽度 |
| height | `number` | — | 图片高度 |
| fit | `string` | `'contain'` | 填充方式（contain/cover/fill/none/scale-down） |
| zoomRate | `number` | — | 缩放比例 |
| maxScale | `number` | — | 最大缩放 |
| minScale | `number` | — | 最小缩放 |
| previewSrcList | `Array` | — | 预览图片列表 |

---

## password-item 密码输入

**包装组件**：`el-input`（type="password"）

> **支持 el-input 的所有 Props / Events**。与 input-item 类似，支持前后缀和前后置。

---

## signature-item 签名

手写签名组件（基于 SmoothSignature）。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| imageType | `string` | — | 图片类型（`'jpg'` 或默认 PNG） |
| width | `number` | — | 画布宽度 |
| height | `number` | — | 画布高度 |

---

## autocomplete-item 自动补全

**包装组件**：`el-autocomplete`

> **支持 el-autocomplete 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| values | `Array` | — | 建议数据列表 |
| dataSource | `string` | — | 数据源类型（`'url'` 时远程搜索） |
| selectLabel | `string` | — | 远程搜索标签属性名 |
| appendAction | `Array` | — | 后置操作按钮（仅支持单个） |

> 也支持 usePrefixSuffix 前后缀机制，以及双击大文本编辑。

---

## input-tag-item 标签输入

**包装组件**：`el-input-tag`（Element Plus 扩展）

> **支持 el-input-tag 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| tagType | `string` | `'info'` | 标签类型 |
| tagMap | `object` | — | 值到标签类型的映射 |

---

## number-range-item 数字范围

双数字输入组件，用于输入范围值。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| minName | `string` | `fieldName + 'Min'` | 最小值字段名 |
| maxName | `string` | `fieldName + 'Max'` | 最大值字段名 |
| splitName | `string` | `'-'` | 分隔符 |
| minPlaceholder | `string` | — | 最小值占位文字 |
| maxPlaceholder | `string` | — | 最大值占位文字 |
| prefix | `string` | — | 前缀内容 |
| suffix | `string` | — | 后缀内容 |

---

## icon-item 图标选择

图标选择器组件。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| iconType | `string` | `'system'` | 图标类型（`'system'` 系统图标） |
| placement | `string` | `'bottom-start'` | 弹出位置 |
| listView | `boolean` | — | 列表视图模式 |

> 双击清空图标值。

---

## color-item 颜色选择

**包装组件**：`el-color-picker`

> **支持 el-color-picker 的所有 Props / Events**。

---

## rate-item 评分

**包装组件**：`el-rate`

> **支持 el-rate 的所有 Props / Events**。

> 挂载时自动触发一次 `change` 事件。

---

## slider-item 滑块

**包装组件**：`el-slider`

> **支持 el-slider 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| step | `number` | `1` | 步长 |

---

## tag-item 标签

标签展示组件。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| tagType | `string` | `'primary'` | 标签类型 |
| tagMap | `object` | — | 值到标签类型的映射对象，如 `{ '1': 'success', '0': 'danger' }` |
| placeholder | `string` | — | 空值时占位文字 |

---

## link-item 链接

**包装组件**：`el-link`

> **支持 el-link 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| linkType | `string` | `'primary'` | 链接类型 |
| underline | `boolean` | `false` | 是否下划线 |
| href | `string` | — | 链接地址 |
| target | `string` | `'_blank'` | 打开方式 |
| linkText | `string` | — | 链接显示文字 |

---

## text-item 文本展示

纯文本展示组件。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| staticData | `boolean` | — | 是否静态数据 |
| textContent | `string` | — | 静态数据时显示的文本 |
| styles | `object \| string` | — | 自定义样式（支持 JSON 字符串或对象） |

---

## html-item HTML 内容

HTML 内容渲染组件。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| content | `string` | — | 默认 HTML 内容 |
| textContent | `string` | — | 静态数据时显示的文本 |
| staticData | `boolean` | — | 是否静态数据 |
| styles | `object \| string` | — | 自定义样式 |

---

## htmleditor-item 富文本编辑器

富文本编辑器组件。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| hideToolbar | `boolean` | — | 是否隐藏工具栏 |
| mode | `string` | `'default'` | 编辑器模式 |
| width | `string` | — | 编辑器宽度 |
| height | `string` | — | 编辑器高度 |
| overflow | `string` | — | 溢出处理 |
| uploadUrl | `string` | — | 图片/视频上传地址 |

---

## json-item / json-array-item JSON 编辑

**包装组件**：委托给 `base-json-item`，`dataType` 分别为 `'object'` 和 `'array'`。

### base-json-item 额外 Prop

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| dataType | `string` | `'object'` | JSON 数据类型验证（`'object'` 或 `'array'`） |

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| devType | `string` | — | 开发/设计模式编辑 |
| boxHeight | `string` | — | 弹窗高度 |
| boxWidth | `string` | — | 弹窗宽度 |
| rows | `number` | `3` | textarea 行数 |

---

## markdown-item / view-markdown-item Markdown

编辑使用 MarkdownIt 编辑器，查看使用 MarkdownIt 只读渲染。

---

## description-item 描述列表

**包装组件**：`el-descriptions`

> **支持 el-descriptions 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| column | `number` | `2` | 列数 |
| border | `boolean` | `true` | 是否边框 |
| direction | `string` | — | 方向 |
| size | `string` | `'default'` | 尺寸 |
| descItems | `Array<{label, fieldName, value, span}>` | — | 描述项数组 |

---

## divider-item 分割线

**包装组件**：`el-divider`

> **支持 el-divider 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| direction | `string` | `'horizontal'` | 方向 |
| contentPosition | `string` | `'center'` | 内容位置 |
| content | `string` | — | 分割线文字内容 |

---

## progress-item 进度条

**包装组件**：`el-progress`

> **支持 el-progress 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| percentage | `number` | `0` | 百分比 |
| status | `string` | — | 状态（success/exception/warning） |
| strokeWidth | `number` | `6` | 宽度 |
| textInside | `boolean` | — | 文字是否内显 |
| color | `string` | — | 颜色 |

---

## cron-item Cron 表达式

点击按钮打开 Crontab 弹窗，确认后将表达式写回 formData。

---

## user-item 用户选择

**包装组件**：`el-mention` + 弹窗选择

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| compName | `string` | — | 弹窗中用户选择组件名 |
| needField | `FieldMapping[]` | — | 字段映射配置 |
| aliasName | `string` | — | 别名字段名 |
| recall | `Function` | — | 选择后回调函数 |

---

## org-item 组织选择

**包装组件**：`el-tree-select`

> 与 tree-select-item 基本一致，默认 value 属性名为 `'id'`。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| url | `string` | — | 远程数据 URL |
| values / data | `Array` | — | 本地数据 |
| props.label | `string` | `'name'` | 显示属性名 |
| props.value | `string` | `'id'` | 值属性名 |

---

## area-item 地区选择

**包装组件**：`el-cascader`

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| options | `Array` | 内置省市区数据 | 级联选项数据 |
| user | `boolean` | — | 是否使用自定义数据 |
| props | `object` | `{label:'name',value:'code'}` | 属性映射 |

---

## location-item 位置选择

位置选择组件。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| mapClick | `Function` | — | 地图选点回调 `(currentValue, callback) => void` |
| placeholder | `string` | — | 占位文字 |

---

## qrcode-item 二维码

二维码生成组件。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| src | `string` | — | 中心图片地址 |
| width | `number` | `30` | 中心图片宽度 |
| height | `number` | `30` | 中心图片高度 |

---

## barcode-item 条形码

条形码生成组件。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| value | `string` | — | 条形码值 |
| format | `string` | `'CODE39'` | 条形码类型 |
| width | `number` | `1` | 宽度 |
| height | `number` | `20` | 高度 |
| displayValue | `boolean` | `true` | 是否显示文字 |
| fontSize | `number` | — | 字体大小 |
| font | `string` | — | 字体 |
| fontOptions | `string` | — | 字体选项 |
| textAlign | `string` | — | 文字对齐 |
| textPosition | `string` | — | 文字位置 |
| textMargin | `number` | — | 文字边距 |
| margin | `number` | `10` | 边距 |

---

## audio-item 音频播放

音频播放组件，使用 `field.audioUrl`（非 preps 内属性）获取音频文件 URL。

---

## transfer-item 穿梭框

**包装组件**：`el-transfer`

> **支持 el-transfer 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| data | `Array` | — | 穿梭框数据 |
| props | `object` | `{key:'value',label:'name'}` | 属性映射 |

---

## tselect-item 树形下拉选择

**包装组件**：`el-tree-select`

> **支持 el-tree-select 的所有 Props / Events**。

### field.preps 专属配置

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| data | `Array` | — | 树形数据 |
| multiple | `boolean` | `false` | 是否多选 |
| showFooter | `boolean` | `false` | 是否显示底部添加区 |
| showCode | `boolean` | — | 是否显示编码 |
| props | `object` | `{label:'name',value:'value'}` | 属性映射 |

> 当 `dataSource === 'url'` 时自动设置 `remote=true`、`filterable=true`、`collapseTags=true`。

---

## usercomp-item 自定义组件容器

动态组件容器，通过 `field.preps.compName` 渲染指定组件，将 `field.preps` 全部传递给子组件。`source` 默认为 `0`。

---

## empty-item 空占位

不渲染任何内容的占位组件。

---

## unknown-item 未知组件占位

未知组件类型的占位显示组件，模板显示"未知组件"。
