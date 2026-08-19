# StarHorseDataView 数据查看视图

数据查看视图组件，以表单形式展示数据详情，支持子表单和动态表单。

## 基础用法

```vue
<template>
  <StarHorseDataView
    :compUrl="apiUrls"
    :fieldList="pageFieldInfo"
    :subTableName="'subData'"
    @dataLoaded="onDataLoaded"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| compUrl | `ApiUrls` | 否 | — | 接口地址配置 |
| subTableName | `string` | 否 | — | 子集合 Key 名称 |
| subFormFlag | `string` | 否 | `'N'` | 是否子表单标识 |
| formSize | `string` | 否 | `'default'` | 表单尺寸 |
| labelPosition | `string` | 否 | `'left'` | 标签位置 |
| subTableName | `string` | 否 | `'subDataList'` | 批量数据 Key |
| batchFieldName | `string` | 否 | `'batchFieldList'` | 批量字段 Key |
| fieldList | `object` | **是** | — | 表单字段配置 |
| globalCondition | `object` | 否 | — | 全局过滤条件 |
| outerData | `object` | 否 | — | 外部传入数据 |
| dynamicForm | `boolean` | 否 | `false` | 是否动态表单 |
| preview | `boolean` | 否 | `false` | 是否预览模式 |
| primaryKey | `string \| object` | 否 | `'id'` | 主键字段名 |
| dataFormat | `Function` | 否 | `null` | 数据格式化函数 |
| useViewUrl | `boolean` | 否 | `false` | 是否使用查看专用接口 |
| slotType | `string` | 否 | `'normal'` | 插槽类型（`'normal'` / `'user'`） |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| dataLoaded | `(objData: any, flag: boolean)` | 数据加载完成时触发 |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| setData | `(data: any)` | `void` | 设置视图数据 |

## 插槽 (Slots)

| 插槽名 | 作用域参数 | 说明 |
|---|---|---|
| ext | `{ dataForm }` | 扩展插槽，在表单内部渲染自定义内容 |
| user | `{ dataForm }` | 用户自定义插槽，当 `slotType === 'user'` 时替代整个表单 |

## 计算属性 (Computed)

| 属性名 | 类型 | 说明 |
|---|---|---|
| platformFields | `any` | 调用 `convertPcCompToFitPlatformComps(props.fieldList)` 将 PC 端字段配置适配为当前平台（移动端/PC 端）的组件类型 |
| mappingFields | `any` | 对 platformFields 调用 `formFieldMapping()`，生成字段映射关系（别名 → 字段名的映射），用于后续数据字段别名转换 |

## Inject（从父组件注入）

| key | 类型 | 来源 | 说明 |
|---|---|---|---|
| `"dialogProps"` | `DialogProps` | StarHorseDialog | 从父级对话框注入，获取 `ids` 用于数据加载；ids 变化时触发重新加载 |

## Watch 监听

| 监听目标 | 配置 | 触发逻辑 |
|---|---|---|
| `props.outerData` | `{ immediate: true, deep: false }` | 外部数据变化时，`Object.assign` 合并到 `dataForm` |
| `dialogProps?.ids` | `{ deep: true }` | ID 变化时：若值为 -2 则忽略；若为空或 -1 则清空 `dataForm`；否则设置 `source=3` 并调用 `loadData()` |

## 联动机制

- **字段映射联动**：`mappingFields` 计算属性产生的映射关系，在 `loadData` 中被消费——遍历 mapping，将数据中 alias 字段的值赋给 name 字段，实现别名到正式字段名的转换
- **动态表单联动**：当 `dynamicForm` 为 true 时，`loadData` 中遍历参数中的非 subTabFlag 项，将整条数据包装为数组赋给对应 tableName，以支持动态子表单数据填充
- **外部数据注入**：`outerData` 的变化通过 watch 实时合并到表单数据中

## source 值

组件内部 `source` 固定为 `3`（查看模式），传递给 `<star-horse-form-item>`，子组件据此显示只读态。

## 关键内部方法说明

| 方法名 | 功能说明 |
|---|---|
| loadData() | 核心数据加载方法——根据 dialogProps.ids 和 compUrl 调用 loadById 获取数据；支持 JSON 类型 ID（合并为 params）；支持 useViewUrl 切换查看专用接口；加载后执行字段映射和动态表单填充，最后 emit dataLoaded |
| setData(data) | 直接设置 dataForm 的值，用于预览模式或外部赋值 |

## 使用示例

### 基本数据查看

```vue
<StarHorseDataView
  :compUrl="apiUrls"
  :fieldList="pageFieldInfo"
  :primaryKey="'id'"
/>
```

### 使用自定义插槽

```vue
<StarHorseDataView
  :compUrl="apiUrls"
  :fieldList="pageFieldInfo"
  slotType="user"
>
  <template #user="{ dataForm }">
    <div>自定义内容: {{ dataForm.name }}</div>
  </template>
</StarHorseDataView>
```
