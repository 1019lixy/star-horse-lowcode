# DialogInputItem 对话框输入组件

## 概述
DialogInputItem 是一个对话框输入组件，结合了输入框和数据选择对话框。用户可以通过输入框输入数据，也可以通过点击搜索按钮打开对话框从表格中选择数据。

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
| selfFunc | - | 自定义函数事件 |
| selectItem | - | 选择项事件 |

## 方法

### showVisible
显示数据选择对话框
```typescript
showVisible(): void
```

### closeAction
关闭数据选择对话框
```typescript
closeAction(): void
```

### selectItem
选择数据项
```typescript
selectItem(row: any): void
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;      // 字段名
  aliasName?: string;     // 别名
  preps?: object;         // 配置参数
  // 其他字段属性...
}
```

### 配置参数 (preps)
```typescript
interface Preps {
  needField?: Array<FieldMapping>;  // 需要的字段映射
  recall?: Function;                 // 回调函数
  dataUrl?: object;                 // 数据接口配置
  fieldList?: Array<FieldInfo>;     // 字段列表
  primaryKey?: string;              // 主键字段
  filterCondition?: object;         // 过滤条件
  orderBy?: object;                 // 排序条件
  dataFormat?: Function;            // 数据格式化函数
  searchFieldList?: object;         // 搜索字段列表
}
```

### 字段映射 (FieldMapping)
```typescript
interface FieldMapping {
  sourceField: string;    // 源字段
  distField: string;      // 目标字段
}
```

### 搜索字段 (SearchFields)
```typescript
interface SearchFields {
  fieldName: string;      // 字段名
  searchVisible: boolean; // 是否可见于搜索
  matchType?: string;     // 匹配类型
  prefix?: string;        // 前缀
  defaultVisible?: boolean;// 默认可见
}
```

## 使用示例

```vue
<template>
  <dialog-input-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  userName: ''  // 存储用户输入或选择的数据
})

const fieldConfig = ref({
  fieldName: 'userName',
  label: '用户选择',
  type: 'dialog-input',
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
    needField: [       // 需要的字段映射
      {
        sourceField: 'name',   // 源字段（表格中的字段）
        distField: 'userName'  // 目标字段（表单中的字段）
      }
    ]
  }
})
</script>
```

## 注意事项

1. 组件结合了输入框和数据选择对话框两种交互方式
2. 用户可以直接在输入框中输入数据，也可以通过点击搜索按钮打开对话框选择数据
3. 通过 [preps.needField] 配置需要从表格中获取的字段映射关系
4. 支持通过 [preps.recall] 设置选择数据后的回调函数
5. 对话框中使用表格组件展示数据，支持搜索和分页功能
6. 组件会自动处理数据的双向绑定
7. 支持通过 [preps.dataUrl] 配置数据接口
8. 支持通过 [preps.filterCondition] 和 [preps.orderBy] 配置数据过滤和排序