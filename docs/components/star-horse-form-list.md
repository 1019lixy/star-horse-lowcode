# StarHorseFormList 表单列表

可编辑的表单列表组件，支持行内编辑、批量添加、删除、导入等功能。

## Inject（从父组件注入）

| key | 类型 | 来源 | 说明 |
|---|---|---|---|
| `"formFields"` | `ShallowReactive<any>` | StarHorseForm | 注入表单字段配置（默认空数组），用于删除行时同步移除对应字段的验证状态；键为 batchName，值为数组 |

## Watch 监听

| 监听目标 | 配置 | 触发逻辑 |
|---|---|---|
| `dataForm.value[batchName]` | `{ immediate: false, deep: true }` | 列表数据变化时，若 showCheckBox 且 selectAll 为 true，则自动调用 toggleAllSelection(true) 全选 |

## 联动机制

- **字段 actions 联动**：在 `dynamicHandleAddRow` 中增删行后，遍历 fieldList，若某字段有 `actions` 函数则调用 `actions(dataForm, "oper")`，实现行增删时的联动逻辑（如自动计算、条件更新等）
- **行拖拽排序联动**：`moveColumn()` 使用 Sortable.js 实现行拖拽，`onEnd` 回调中同步数据数组顺序和 `xh` 序号，同时同步 formFields 中的序号

## source 值对行为的影响

| source 值 | 影响 |
|---|---|
| 1（默认） | 编辑模式——显示操作按钮（导入、清空、添加行、编辑、删除），操作列可见 |
| 3 | 查看模式——隐藏所有操作按钮（`v-if="source != 3"` 控制工具栏、操作列、添加行区域），列表只读 |

## 关键内部方法说明

| 方法名 | 功能说明 |
|---|---|
| handleAddDetails(row, type) | 增删行入口——staticColumn == "Y" 且非删除时走弹窗表单编辑模式（dynamicHandleAddForm），否则走行内编辑模式（dynamicHandleAddRow） |
| dynamicHandleAddForm(row, type) | 弹窗式行编辑——打开行编辑 Dialog，设置 starHorseEditing 标记，加载行数据到表单 |
| mergeData(type) | 行编辑保存——校验表单后，若为编辑（starHorseEditing == "yes"）则替换对应行数据，否则新增；type == "close" 关闭弹窗，否则重置表单继续添加 |
| closeAction() | 关闭行编辑弹窗，移除键盘事件监听 |
| dynamicHandleAddRow(row, type) | 行内增删——type=1 新增行（深拷贝 defaultValues，生成 uuid）；type=2 删除行（从 dataForm 和 formFields 中移除）。增删后触发字段 actions 联动，新增时自动滚动到底部 |
| getRowIdentity(row) | 返回行标识 (row.xh \|\| 0) + 1，用于 el-table 的 row-key |
| excelOperation() | 打开 Excel 导入弹窗 |
| downloadTemplate() | 下载导入模板 |
| moveColumn() | 初始化 Sortable.js 拖拽排序——拖拽结束后同步数据顺序和序号 |
| clearAll() | 清空列表数据（带确认对话框） |
| init() | 初始化——确保 batchName 键存在，若 staticColumn == "N" 且列表为空则按 initRows 添加空行，初始化拖拽排序，emit inited |

## 基础用法

```vue
<template>
  <StarHorseFormList
    v-model:dataForm="formData"
    :fieldList="fieldList"
    :compUrl="apiUrls"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| compUrl | `ApiUrls` | 否 | — | 接口地址配置 |
| fieldList | `FieldInfo[]` | **是** | — | 字段配置列表 |
| defaultValues | `object` | 否 | `{}` | 新增行默认值 |
| batchName | `string` | 否 | `'batchDataList'` | 批量数据 Key |
| primaryKey | `string \| object` | 否 | — | 主键字段名 |
| initRows | `number` | 否 | `0` | 初始行数 |
| importInfo | `object` | 否 | — | 导入信息配置 |
| title | `string` | 否 | `''` | 列表标题 |
| helpMsg | `string` | 否 | `''` | 帮助提示 |
| rules | `object` | 否 | — | 校验规则 |
| staticColumn | `string` | 否 | `'Y'` | 是否静态列模式 |
| size | `string` | 否 | `'default'` | 组件尺寸 |
| source | `number` | 否 | `1` | 数据来源标识 |
| showCheckBox | `boolean` | 否 | `false` | 是否显示复选框 |
| selectAll | `boolean` | 否 | `false` | 是否默认全选 |
| subFlag | `boolean` | 否 | `false` | 是否子表单 |
| commonFormat | `Function` | 否 | `() => {}` | 格式化函数 |

## v-model

| 名称 | 类型 | 说明 |
|---|---|---|
| dataForm | `any` | 双向绑定的表单列表数据 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| addRow | `(row: any)` | 添加行时触发 |
| removeRow | `(row: any)` | 删除行时触发 |
| inited | — | 列表初始化完成时触发 |

---

# StarHorseFormTable 表单表格

批量表格的包装组件，嵌套在 StarHorseForm 中用于展示可编辑的批量数据。

## 基础用法

```vue
<template>
  <StarHorseFormTable
    v-model:dataForm="formData"
    :item="tableConfig"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| item | `object` | **是** | — | 表格配置项 |
| rules | `object` | 否 | — | 校验规则 |
| initRows | `number` | 否 | `0` | 初始行数 |
| size | `string` | 否 | `'default'` | 组件尺寸 |
| source | `number` | 否 | `1` | 数据来源标识 |
| commonFormat | `Function` | 否 | `() => {}` | 格式化函数 |

## v-model

| 名称 | 类型 | 说明 |
|---|---|---|
| dataForm | `any` | 双向绑定的表单数据 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| addRow | `(row: any)` | 添加行时触发 |
| removeRow | `(row: any)` | 删除行时触发 |

---

# StarHorseFormItem 表单项容器

表单项的容器组件，负责渲染单个表单字段的标签和内容。

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| compUrl | `ApiUrls` | 否 | — | 接口地址配置 |
| fieldList | `PageFieldInfo \| any` | 否 | — | 字段配置 |
| item | `any` | 否 | — | 组件配置项 |
| objectName | `string` | 否 | — | 子集合 Key |
| dataIndex | `number` | 否 | `-1` | 数据索引 |
| propPrefix | `string` | 否 | `''` | 属性前缀 |
| parentPreps | `any` | 否 | `{}` | 父组件属性 |
| subFormFlag | `string` | 否 | `'N'` | 是否子表单 |
| batchName | `string` | 否 | `'batchDataList'` | 批量数据 Key |
| batchFieldName | `string` | 否 | `'batchFieldList'` | 批量字段 Key |
| primaryKey | `string \| any` | 否 | — | 主键字段名 |
| rules | `any` | 否 | — | 校验规则 |
| compSize | `string` | **是** | `'default'` | 组件尺寸 |
| source | `number` | **是** | `1` | 数据来源标识 |
| level | `number` | 否 | — | 层级深度 |
| commonFormat | `Function` | 否 | — | 格式化函数 |

## v-model

| 名称 | 类型 | 说明 |
|---|---|---|
| dataForm | `any` | 双向绑定的表单数据 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| addRow | `(row: any)` | 添加行事件 |
| removeRow | `(row: any)` | 删除行事件 |
