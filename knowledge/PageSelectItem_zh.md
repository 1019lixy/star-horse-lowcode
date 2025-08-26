# PageSelectItem 分页选择组件

## 概述
PageSelectItem 是一个分页选择组件，基于 Element Plus 的 el-select 实现。该组件结合了下拉选择和分页表格选择两种交互方式，支持单选和多选模式，适用于从大量数据中选择记录的场景。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| isDesign | Boolean | 否 | false | 是否为设计模式 |
| disabled | Boolean | 否 | false | 是否禁用 |
| showFormItem | Boolean | 否 | false | 是否显示表单项 |
| bareFlag | Boolean | 否 | false | 是否为简洁模式 |
| isSearch | Boolean | 否 | false | 是否为搜索模式 |

## Events

| 事件名 | 参数 | 说明 |
|-------|------|------|
| selfFunc | prep | 自定义函数事件 |
| selectItem | - | 选择项事件 |

## 方法

### loadByPage
加载分页数据
```typescript
loadByPage(isInit: boolean = false): void
```

### itemAction
处理组件事件
```typescript
itemAction(prep: any): void
```

### searchDataFun
处理搜索数据
```typescript
searchDataFun(data: any): void
```

### handleSelectionChange
处理选择项变化
```typescript
handleSelectionChange(val: any): void
```

### selectRow
处理行选择
```typescript
selectRow(row: any, _column: any, _evt: any): void
```

### assignVal
分配选中值
```typescript
assignVal(): void
```

### loadSourceField
加载源字段
```typescript
loadSourceField(aliasFirst: boolean = true): string
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;         // 字段名
  aliasName?: string;        // 别名
  preps?: PageSelectPreps;   // 分页选择配置参数
  // 其他字段属性...
}
```

### 分页选择配置参数 (PageSelectPreps)
```typescript
interface PageSelectPreps {
  dataUrl?: object;          // 数据接口配置
  fieldList?: Array<any>;    // 字段列表
  primaryKey?: string;       // 主键字段
  multiple?: boolean;        // 是否多选
  needField?: Array<FieldMapping>; // 需要的字段映射
  recall?: Function;          // 回调函数
  displayField?: string;     // 显示字段
  searchFieldList?: object;  // 搜索字段列表
  // 其他 el-select 支持的属性
}
```

### 分页属性 (PageProps)
```typescript
interface PageProps {
  pageSize: number;          // 每页条数
  currentPage: number;       // 当前页码
  totalData: number;         // 总数据条数
  totalPage: number;         // 总页数
  dataList: Array<any>;      // 数据列表
}
```

### 字段映射 (FieldMapping)
```typescript
interface FieldMapping {
  sourceField: string;       // 源字段
  distField: string;         // 目标字段
}
```

## 使用示例

### 单选模式
```vue
<template>
  <page-select-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  userId: ''  // 存储选中的用户ID
})

const fieldConfig = ref({
  fieldName: 'userId',
  label: '用户选择',
  type: 'page-select',
  preps: {
    dataUrl: {
      pageListUrl: '/api/user/list'  // 用户列表接口
    },
    fieldList: [  // 表格字段配置
      {
        fieldName: 'name',
        label: '姓名',
        type: 'input',
        listVisible: true
      },
      {
        fieldName: 'email',
        label: '邮箱',
        type: 'input',
        listVisible: true
      }
    ],
    primaryKey: 'id',  // 主键字段
    displayField: 'name',  // 显示字段
    needField: [  // 需要的字段映射
      {
        sourceField: 'id',    // 源字段（表格中的字段）
        distField: 'userId'   // 目标字段（表单中的字段）
      }
    ]
  }
})
</script>
```

### 多选模式
```vue
<template>
  <page-select-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  userIds: []  // 存储选中的用户ID数组
})

const fieldConfig = ref({
  fieldName: 'userIds',
  label: '用户选择',
  type: 'page-select',
  preps: {
    multiple: true,  // 启用多选
    dataUrl: {
      pageListUrl: '/api/user/list'
    },
    fieldList: [
      {
        fieldName: 'name',
        label: '姓名',
        type: 'input',
        listVisible: true
      },
      {
        fieldName: 'email',
        label: '邮箱',
        type: 'input',
        listVisible: true
      }
    ],
    primaryKey: 'id',
    displayField: 'name'
  }
})
</script>
```

## 注意事项

1. 组件结合了下拉选择和分页表格选择两种交互方式
2. 支持单选和多选模式，通过 [preps.multiple] 配置
3. 通过下拉框的空状态展示分页表格选择界面
4. 支持搜索功能，可通过 [preps.searchFieldList] 配置搜索字段
5. 选中数据存储在表单数据中，单选时为值，多选时为数组
6. 支持通过 [preps.displayField] 配置选中项的显示字段
7. 组件会自动处理分页加载和数据绑定
8. 支持通过 [preps.recall] 设置选择完成后的回调函数
9. 表格列通过 [preps.fieldList] 配置
10. 主键字段通过 [preps.primaryKey] 配置，用于行选择标识