# StarHorseForm 表单

基于 el-form 的增强表单组件，支持配置化字段渲染、校验、提交等功能，是组件库的核心表单组件。

## 基础用法

```vue
<template>
  <StarHorseForm
    ref="formRef"
    :compUrl="apiUrls"
    :fieldList="pageFieldInfo"
    @refresh="onRefresh"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| compUrl | `ApiUrls` | 否 | — | 接口地址配置，详见 [ApiUrls 类型](../types/api-urls.md) |
| fieldList | `PageFieldInfo` | **是** | — | 表单字段配置，详见 [PageFieldInfo 类型](../types/page-field-info.md) |
| subTableName | `string` | 否 | `'subDataList'` | 提交后端批量数据的 Key 名称 |
| batchFieldName | `string` | 否 | `'batchFieldList'` | 批量字段列表的 Key 名称 |
| outerFormData | `object` | 否 | — | 外部传入的表单数据 |
| primaryKey | `string \| object` | 否 | — | 主键字段名 |
| globalCondition | `object` | 否 | — | 全局过滤条件 |
| rules | `object` | 否 | — | 自定义校验规则 |
| formSize | `string` | 否 | `'default'` | 表单尺寸（large/default/small） |
| labelPosition | `string` | 否 | `'left'` | 标签位置（left/right/top） |
| typeModel | `string` | 否 | — | 类型模型 |
| dynamicForm | `boolean` | 否 | `false` | 是否动态表单 |
| preview | `boolean` | 否 | `false` | 是否预览模式（只读） |
| selectData | `SelectOption[]` | 否 | `[{name:'正常',value:'1'},{name:'禁用',value:'2'}]` | 选择数据选项 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| refresh | `(formData: any, resData: any)` | 数据提交成功后触发 |
| dataLoaded | `(objData: any)` | 表单数据加载完成时触发 |
| exportData | `(dataForm: any)` | 表单数据变化时实时触发 |
| removeRow | `(row: any)` | 列表中删除行时触发 |
| addRow | `(row: any)` | 列表中添加行时触发 |
| inited | — | 表单初始化完成时触发 |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| merge | `(type: string)` | `void` | 提交表单（含校验） |
| mergeDraft | `(type: string)` | `void` | 暂存草稿（不含校验） |
| resetForm | — | `void` | 重置表单 |
| setFormData | `(data: any)` | `void` | 设置表单数据 |
| getFormData | — | `Ref<any>` | 获取表单数据引用 |
| updateFormData | `(data: any)` | `void` | 更新表单数据（Object.assign 合并） |
| getFields | — | `FieldInfo[]` | 获取表单字段信息 |
| getFormFields | — | `any` | 获取 el-form 内部字段 |
| validate | — | `Promise<boolean>` | 校验表单，返回校验结果 |
| setSource | `(dataSource: number)` | `void` | 设置数据来源（1=新增, 2=编辑, 3=查看） |

## 计算属性 (Computed)

| 属性名 | 类型 | 说明 |
|---|---|---|
| platformFields | `ComputedRef` | 调用 `convertPcCompToFitPlatformComps(props.fieldList)` 将 PC 端字段配置转换为适配当前平台（PC/移动端）的字段配置，实现多端适配 |
| mappingFields | `ComputedRef<any>` | 调用 `formFieldMapping(platformFields)` 对平台字段做映射处理，返回包含 `formFields`（字段信息表）、`defaultDatas`（字段默认值映射）、`mappingFields`（字段别名映射）、`actions`（字段初始化动作列表）等子属性的对象 |

## Provide / Inject

### Provide（向子组件提供）

| key | 类型 | 说明 |
|---|---|---|
| `"formFields"` | `ShallowRef<Array<FieldInfo>>` | 向子组件（StarHorseFormItem、StarHorseFormList 等）提供表单字段信息表，子组件通过 `inject("formFields")` 获取后可读写字段配置（如 `formFields[fieldName] = item`） |

### Inject（从父组件注入）

| key | 类型 | 来源 | 说明 |
|---|---|---|---|
| `"closeDialog"` | `Function` | StarHorseDialog | 关闭弹窗方法，可在表单内部调用直接关闭对话框 |
| `"dialogOperation"` | `Reactive<Record<any, any>>` | StarHorseDialog | 弹窗操作分发对象，包含 `funcName` 和 `type` 字段，用于监听弹窗按钮操作 |
| `"dialogProps"` | `DialogProps` | StarHorseDialog | 弹窗属性对象，包含 `ids`、`editVisible`、`viewVisible` 等 |

## Watch 监听

| 监听目标 | 配置 | 触发逻辑 |
|---|---|---|
| `dataForm.value` | `{ immediate: false }` | 表单数据变化时调用 `exportData()`，向外触发 `exportData` 事件，实现表单数据的实时导出 |
| `props.outerFormData` | `{ immediate: true, deep: true }` | 外部传入数据变化时调用 `resetForm()` 重新初始化表单，将外部数据与默认值合并 |
| `dialogOperation` | `{ immediate: false, deep: true }` | 监听弹窗操作对象变化，根据 `funcName` 分发到 `merge`（提交+校验）、`mergeDraft`（暂存不校验）、`resetForm`（重置）三种操作，执行后清空 `funcName` 和 `type` |
| `dialogProps.ids` | `{ immediate: true, deep: false }` | **核心 watch**：监听弹窗传入的 ID 变化。`-1` 表示新建，设置 `source=1` 并调用 `setFormData`；有效 ID 表示编辑，设置 `source=2` 并调用 `loadData()` 加载数据 |

## 联动与公式机制

StarHorseForm 本身不直接包含 dataRelation/apiLinkage/formula 的实现，但通过以下方式间接支持联动：

### 数据加载后自动联动

`loadData()` 加载数据完成后调用 `checkActionRelation()`，遍历所有 `formFields`，如果字段的 `preps.actions` 是函数则立即调用 `actions(dataForm.value)`，实现"数据加载后自动触发字段联动"。

如果字段映射配置中有 `change` 动作，加载完数据后自动执行 `actions["change"](objData)`。

### source 透传

`source` 作为 prop 传递给 `StarHorseFormItem`，最终传递到每个具体表单字段组件，字段组件根据 source 决定是否只读、是否触发联动等。

### 配置联动和公式

在 `field.preps.dataRelation` 中配置联动策略，在 `field.preps.formula` 中配置公式计算。具体配置方式详见：
- [联动策略与数据源](../linkage-and-datasource.md)
- [内部机制 - 公式引擎](../internal-mechanisms.md#2-formulaengine--公式计算引擎)

## source 值对行为的影响

| source 值 | 含义 | 对 StarHorseForm 的影响 | 对子组件的影响 |
|---|---|---|---|
| 1 | 新增模式 | `dialogProps.ids` 为 -1 时设置，使用默认值初始化 | 字段可编辑；日期/时间组件默认赋当前时间；usercomp 组件执行初始化逻辑 |
| 2 | 编辑模式 | `dialogProps.ids` 有值时设置，触发 `loadData()` | 字段可编辑；部分组件根据编辑模式做特殊处理 |
| 3 | 查看模式 | 通过 `setSource(3)` 手动设置 | **所有字段变为只读**：`preps.readonly=true`，`checkIsDisabled` 返回 true，禁用所有交互；弹窗不显示操作按钮；JSON 编辑按钮隐藏 |
| 4 | 搜索模式 | 本组件不直接使用 | 搜索表单场景：组件事件绑定搜索行为而非提交行为；不记录到 formFields；不触发联动 |
| 5 | 列表模式 | 本组件不直接使用 | 列表中的表单项不触发初始化 actions |

## 关键内部方法说明

| 方法名 | 功能说明 |
|---|---|
| loadData() | 异步加载数据：根据 dialogProps.ids 判断是 JSON 对象还是普通 ID，调用 loadById API 获取数据并赋值给 dataForm；支持动态表单数据封装；加载完成后触发 dataLoaded 事件和 checkActionRelation() |
| checkActionRelation() | 遍历所有表单字段，对有 preps.actions 的字段执行联动函数，实现数据加载后的自动联动 |
| merge(type) | 提交表单：先调用 el-form.validate 校验，通过后调用 doMerge(type) |
| mergeDraft(type) | 暂存草稿：不校验直接调用 doMerge(type) |
| doMerge(type) | 实际提交逻辑：1. 赋值状态名称；2. 分析批量字段是否与主表平级；3. 根据是否批量选择 URL 和数据结构；4. 动态表单额外封装 relationTables；5. 调用 API 提交；6. 成功后调用 mergeResult |
| assignStatusName() | 根据 statusCode 从 selectData 中查找对应的中文名称并赋值 statusName，批量数据同理 |
| analysisSameToParentField() | 分析哪些批量字段需要与主表平级（subFormFlag 为 false/n），返回这些批量名称数组 |
| mergeResult(type, formData, res) | 提交结果处理：触发 refresh 事件、重置表单、如果是 close 类型则关闭弹窗、重置 dialogProps.ids |
| resetForm() | 重置表单：清空 dataForm，用 mappingFields.defaultDatas 恢复默认值，再与 outerFormData 合并 |
| setFormData(data) | 设置表单数据：用 Object.assign 将默认值和传入数据合并到 dataForm |
| updateFormData(data) | 更新表单数据：直接 Object.assign 合并，不重置已有值 |
| setSource(dataSource) | 设置数据来源（source），影响表单字段的可编辑性 |
| getFormData() | 返回 dataForm 的 ref 引用 |
| recordFieldInfo() | 记录当前表单字段信息到 formFields，触发 inited 事件 |

## 使用示例

### 基本表单

```vue
<template>
  <StarHorseForm
    ref="formRef"
    :compUrl="apiUrls"
    :fieldList="pageFieldInfo"
    @refresh="onRefresh"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ApiUrls, PageFieldInfo } from 'star-horse-lowcode'

const formRef = ref()

const apiUrls: ApiUrls = {
  pageListUrl: '/api/data/page',
  mergeUrl: '/api/data/save',
  mergeDraftUrl: '/api/data/draft',
  batchMergeUrl: '/api/data/batch',
  batchMergeDraftUrl: '/api/data/batch-draft',
  loadByIdUrl: '/api/data/detail',
  loadByIdForViewUrl: '/api/data/view',
  deleteUrl: '/api/data/delete',
}

const pageFieldInfo: PageFieldInfo = {
  fieldList: [
    { label: '姓名', fieldName: 'name', required: true, formVisible: true, listVisible: true, viewVisible: true },
    { label: '年龄', fieldName: 'age', type: 'number', formVisible: true, preps: { min: 0, max: 150 } },
    { label: '状态', fieldName: 'status', type: 'select', preps: { values: [{ name: '启用', value: '1' }, { name: '禁用', value: '0' }] } },
  ]
}

function onRefresh(formData: any, resData: any) {
  console.log('提交成功', formData, resData)
}
</script>
```

### 手动提交

```ts
// 校验并提交
await formRef.value.merge('add')

// 暂存草稿（不校验）
formRef.value.mergeDraft('draft')

// 获取表单数据
const formData = formRef.value.getFormData()

// 校验表单
const valid = await formRef.value.validate()
```

### 切换编辑/查看模式

```ts
// 切换为查看模式
formRef.value.setSource(3)

// 切换为编辑模式
formRef.value.setSource(2)
```
