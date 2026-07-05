# StarHorseTableComp 数据列表

基于 el-table 的增强数据列表组件，支持分页、行编辑、批量操作、嵌套表等功能，是组件库的核心列表组件。

## 基础用法

```vue
<template>
  <StarHorseTableComp
    ref="tableRef"
    :compUrl="apiUrls"
    :primaryKey="'id'"
    :fieldList="pageFieldInfo"
    :showBatchField="false"
    :dataFormat="dataFormat"
    :disableAction="false"
    :dialogInput="false"
    :filterCondition="searchParams"
    :orderBy="orderBy"
    :tableDataList="[]"
    :expand="false"
    :title="'数据列表'"
    :extendBtns="[]"
    :multipleSelect="false"
    :expandTable="{}"
    :helpMsg="''"
    :globalConfig="{}"
    :isDynamic="false"
    :hideButtonList="false"
    :editCondition="[]"
    :pageKeepOldData="false"
    :preview="false"
    @selectItem="onSelectItem"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| compUrl | `ApiUrls \| any` | **是** | — | 接口地址配置 |
| primaryKey | `string \| any` | **是** | — | 主键字段名 |
| fieldList | `PageFieldInfo` | **是** | — | 页面字段配置 |
| hideBtnCondition | `BtnHideCondition[]` | 否 | `[]` | 隐藏按钮条件 |
| showBatchField | `boolean` | **是** | — | 是否显示批量属性列 |
| dataFormat | `Function` | **是** | — | 单元格格式化函数 `(row, column, cellValue) => any` |
| disableAction | `boolean` | **是** | — | 是否禁用操作按钮 |
| dialogInput | `boolean` | **是** | — | 是否弹窗输入模式 |
| height | `string` | 否 | `'400'` | 列表高度 |
| filterCondition | `SearchParams[]` | **是** | — | 搜索过滤条件 |
| orderBy | `OrderByInfo[]` | **是** | — | 默认排序 |
| showPageBar | `boolean` | 否 | `true` | 是否显示分页条 |
| tableDataList | `Array<any>` | **是** | — | 列表数据 |
| reverseDataList | `Array<any>` | 否 | `[]` | 回显数据列表 |
| allowSelectParent | `boolean` | 否 | `true` | 是否允许选择父节点 |
| expand | `boolean` | **是** | — | 是否默认展开所有行 |
| needLoad | `boolean` | 否 | `true` | 是否需要加载遮罩 |
| title | `string` | **是** | — | 列表标题 |
| extendBtns | `UserFuncInfo[]` | **是** | — | 自定义扩展按钮 |
| preValidFunc | `PreValid[]` | 否 | `[]` | 按钮前置校验 |
| multipleSelect | `boolean` | **是** | — | 是否允许多选 |
| lineHeight | `string` | 否 | `'30px'` | 行高 |
| showSelection | `boolean` | 否 | `true` | 是否显示复选框列 |
| expandTable | `ExpandTable` | **是** | — | 嵌套表配置 |
| helpMsg | `string` | **是** | — | 帮助提示 |
| globalConfig | `Record<string, any>` | **是** | — | 全局配置 |
| isDynamic | `boolean` | **是** | — | 是否动态表 |
| hideButtonList | `boolean` | **是** | — | 是否隐藏按钮栏 |
| commonPersons | `Array<any>` | 否 | `[]` | 数据共享人 |
| userColumnName | `string` | 否 | `'a.createdBy'` | 数据提权关联字段 |
| btnPermissions | `Record<string, string>` | 否 | `{}` | 按钮自定义权限 |
| pageCombList | `number[]` | 否 | `[20,50,100,200,300,400]` | 每页条数选项 |
| pageBarLayout | `string` | 否 | `'total, sizes, prev, pager, next, jumper,slot'` | 分页条布局 |
| editCondition | `EditCondition[]` | **是** | — | 编辑条件 |
| pageKeepOldData | `boolean` | **是** | — | 翻页是否保留历史数据 |
| preview | `boolean` | **是** | — | 是否预览模式 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| selectItem | `(row: any)` | 选中行时触发 |
| permission | `(permissions: Record<string, string>)` | 权限加载完成时触发 |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| init | — | `Promise<void>` | 初始化（加载权限+数据） |
| createSearchParams | `(formData: SearchParams[], orderBy?: OrderByInfo[])` | `void` | 创建搜索参数并加载数据 |
| loadByPage | `(initPageInfo?: boolean)` | `void` | 分页加载数据 |
| getIds | — | `any[]` | 获取选中行的主键数组 |
| assignStaticData | `(data: any)` | `void` | 从外部动态绑定数据（插入到列表头部） |
| getSelectedDatas | — | `any[]` | 获取已选中的数据数组 |
| removeSelection | `(row: any)` | `void` | 从已选数据中移除指定行 |
| setDataInfo | `(fieldName: string, val: any)` | `void` | 设置选中数据的字段名和值 |
| deleteById | `(id: any, isExpand?: boolean)` | `Promise<void>` | 根据 ID 删除数据 |
| editById | `(id: any, isExpand?: boolean)` | `void` | 根据 ID 编辑数据 |
| tableCompFunc | `(authority: any)` | `void` | 按钮区域事件分发 |
| getDatas | `(limitSize?, params?, orderBys?, url?, usePageCondition?)` | `Promise<any>` | 借助列表组件获取指定数据 |
| permissionList | — | `Record<string, string>` | 获取权限列表 |
| clearData | — | `void` | 清空列表数据 |

> 注：`multipleSelection` 也通过 expose 暴露，是当前选中数据的响应式引用。

## 计算属性 (Computed)

| 属性名 | 类型 | 说明 |
|---|---|---|
| configInfo | `ComputedRef` | 从 `useGlobalConfigStore` 获取全局配置表单信息 `configFormInfo`，包含 `inputSize` 等配置 |
| compSize | `ComputedRef<string>` | 从全局配置获取 `inputSize`，默认 `'default'`，控制表格和按钮的尺寸 |
| buttonList | `ComputedRef<Array<UserFuncInfo>>` | 调用 `extendBtnFunction()` 计算行操作按钮列表。合并 `extendBtns`、`fieldList.userTableFuncs` 和默认按钮（编辑/查看/删除/导出表单/导出PDF），按 `priority` 排序后返回。只包含 `position != "toolbar"` 的按钮 |

## Provide / Inject

### Provide（向子组件提供）

| key | 类型 | 说明 |
|---|---|---|
| `"starHorseCancelAllEdit"` | `Function` | 提供取消所有行编辑状态的函数，列组件在激活新单元格编辑前调用此函数先取消其他编辑 |
| `"starHorseSetEditingRow"` | `Function(row)` | 提供设置当前编辑行引用的函数，列组件在开始编辑时调用 |

### Inject（从父组件注入）

| key | 类型 | 来源 | 说明 |
|---|---|---|---|
| `"dialogProps"` | `DialogProps` | StarHorseDialog | 弹窗属性对象，用于控制查看/编辑弹窗的打开 |

## Watch 监听

| 监听目标 | 配置 | 触发逻辑 |
|---|---|---|
| `props.tableDataList?.length` | `{ immediate: false }` | 当 `stopAutoLoad` 为 true 时（即数据由外部提供），将外部数据同步到 `pageInfo.dataList` |
| `cardSelection.value` | `{ immediate: false }` | 卡片视图选中变化时，将选中值同步到 `multipleSelection`（兼容数组和单值，单值包装为数组） |

## 联动机制

StarHorseTableComp 不直接包含 dataRelation/apiLinkage/formula 逻辑，但通过以下方式间接参与联动：

### 行编辑互斥机制

通过 `provide("starHorseCancelAllEdit")` 和 `provide("starHorseSetEditingRow")` 实现行内编辑互斥，确保同时只有一行/一单元格处于编辑状态。当用户开始编辑新单元格时，之前的编辑会自动取消并恢复原始值。

### 按钮覆盖联动

`overrideOperation(authCode, params)` 方法检查扩展按钮是否配置了 `override=true` 和自定义函数，若有则调用自定义函数替代默认行为，这是外部覆盖操作联动的入口。

### 动态表单联动

`editData(row)` 双击行时通过 `dynamicForm` store 设置数据 ID 和选中数据，触发动态表单联动。

## source 值与关键配置对行为的影响

StarHorseTableComp 本身不直接使用 `source` prop，但通过以下配置间接影响行为：

| 配置值 | 影响 |
|---|---|
| `preview=true` | 预览模式：双击行时 `editData` 调用 `viewById(row)` 而非编辑操作 |
| `dialogInput=true` | 弹窗输入模式：单击行触发 `selectItem` 事件而非展开/选中，双击行触发 `selectItem` 而非编辑 |
| `multipleSelect=true/false` | 多选/单选模式控制 |
| `stopAutoLoad` | 为 true 时不自动加载数据，使用外部传入的 `tableDataList` |
| `isDynamic` | 动态表标志，传递给列组件影响渲染 |
| `pageKeepOldData` | 翻页时是否保留历史数据（累加模式） |

## 关键内部方法说明

| 方法名 | 功能说明 |
|---|---|
| init() | 初始化：合并默认分页配置、加载按钮权限、触发 permission 事件、根据 stopAutoLoad 决定加载或使用外部数据、初始化列拖拽排序、重建字段数据、移动端加载卡片字段 |
| loadByPage(initPageInfo?) | 分页加载数据：构建查询参数，处理 redirect 代理 URL，调用 postRequest，支持 pageKeepOldData 累加模式和移动端缓存上限（10页），加载完成后对弹窗模式做 filterData 回显 |
| createSearchParams(formData, orderBy) | 创建搜索条件并加载数据：保存搜索字段和排序，设置搜索标志，调用 loadByPage() |
| createParams() | 构建查询参数对象：合并 filterCondition、orderBy、searchFields、compUrl.condition、commonPersons，返回包含分页和搜索条件的完整参数 |
| filterData() | 弹窗模式数据回显：根据 inputFieldName 和 inputFieldVal 在当前数据中查找匹配行，自动勾选 |
| handleSelectionChange(val) | 处理选中变化：1. 检查是否选中父节点（非叶子节点限制）；2. 弹窗单选模式下只保留最新选中项；3. 多选模式直接赋值 |
| editData(row) | 双击行编辑：设置 dynamicForm 的数据 ID 和选中数据，根据 dialogInput 决定弹窗编辑或触发 selectItem 事件 |
| viewById(id, isExpand) | 查看数据：设置 dialogProps.viewVisible=true 和 ids |
| editById(id, isExpand) | 编辑数据：设置 dialogProps.editVisible=true 和 ids |
| deleteById(id, isExpand) | 删除数据：根据是否展开表选择不同 URL，调用 deleteByIds API，成功后刷新列表 |
| exportData() | 导出数据：获取选中行 ID 构建查询条件，调用 download API 导出 |
| overrideOperation(authCode, params) | 检查扩展按钮是否配置覆盖，若有则执行自定义函数并返回 true |
| extendBtnFunction() | 构建行操作按钮列表：合并扩展按钮、用户自定义按钮和默认按钮，按优先级排序 |
| moveColumn() | 列拖拽排序：使用 Sortable.js 初始化拖拽，通过 ref 优先定位表格避免多实例冲突 |
| reCreateData() | 重建字段工具数据：遍历 fieldList 提取所有字段到 toolFields（支持 tab/dytable/数组等嵌套结构） |
| cancelAllEdit() | 取消所有编辑状态：恢复编辑行的原始值，清除编辑标记 |
| getDatas(limitSize, params, orderBys, url, usePageCondition) | 借助列表组件获取指定数据：调用 loadData API，支持自定义参数、URL、是否使用页面条件 |

## 使用示例

### 配合搜索表单

```vue
<template>
  <StarHorseSearchForm :formData="searchFields" @searchData="onSearch" />
  <StarHorseTableComp ref="tableRef" v-bind="tableProps" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableRef = ref()
const searchParams = ref([])

function onSearch(data: SearchParams[]) {
  searchParams.value = data
  tableRef.value?.createSearchParams(data)
}
</script>
```

### 获取选中数据

```ts
// 获取选中行 ID
const ids = tableRef.value.getIds()

// 获取选中行完整数据
const selected = tableRef.value.getSelectedDatas()
```

### 手动加载数据

```ts
// 初始化加载
await tableRef.value.init()

// 刷新当前页
tableRef.value.loadByPage()

// 重新搜索
tableRef.value.createSearchParams([{ propertyName: 'name', operation: 'lk', value: 'test' }])
```
