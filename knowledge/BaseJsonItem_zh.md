# BaseJsonItem 基础JSON编辑组件

## 概述
BaseJsonItem 是一个基础的JSON数据编辑组件，支持对象和数组两种数据类型的编辑。组件提供设计模式和开发模式两种编辑方式，设计模式通过表单界面编辑，开发模式通过JSON编辑器直接编辑。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| isDesign | Boolean | 否 | false | 是否为设计模式 |
| disabled | Boolean | 否 | false | 是否禁用 |
| showFormItem | Boolean | 否 | false | 是否显示表单项 |
| bareFlag | Boolean | 否 | false | 是否为简洁模式 |
| isSearch | Boolean | 否 | false | 是否为搜索模式 |
| field | Object | 是 | - | 字段配置 |
| parentField | Object | 否 | - | 父级字段配置 |
| formInfo | Object | 否 | - | 表单信息 |
| dataType | String | 否 | "object" | 数据类型("object"或"array") |

## Events

| 事件名 | 参数 | 说明 |
|-------|------|------|
| selfFunc | - | 自定义函数事件 |
| selectItem | - | 选择项事件 |

## 方法

### editJsonData
打开JSON数据编辑对话框
```typescript
editJsonData(devType: boolean): Promise<void>
```

### selectItem
保存编辑的JSON数据
```typescript
selectItem(): Promise<void>
```

### resetForm
重置表单数据
```typescript
resetForm(): void
```

### closeAction
关闭编辑对话框
```typescript
closeAction(): void
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;      // 字段名
  label: string;          // 标签
  preps?: object;         // 配置参数
  // 其他字段属性...
}
```

### 配置参数 (preps)
```typescript
interface Preps {
  devType?: boolean;      // 是否为开发模式
  rows?: number;          // 文本域行数
}
```

### 表单字段信息 (PageFieldInfo)
```typescript
interface PageFieldInfo {
  batchFieldList: Array<{
    batchName: string;
    fieldList: Array<{
      label: string;
      fieldName: string;
      required: boolean;
      formVisible: boolean;
    }>;
  }>;
}
```

## 使用示例

### 编辑对象类型JSON数据
```vue
<template>
  <base-json-item
    v-model:formData="formData"
    :field="fieldConfig"
    dataType="object"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  jsonData: '{"name": "张三", "age": 25}'
})

const fieldConfig = ref({
  fieldName: 'jsonData',
  label: 'JSON数据',
  type: 'base-json',
  preps: {
    rows: 5
  }
})
</script>
```

### 编辑数组类型JSON数据
```vue
<template>
  <base-json-item
    v-model:formData="formData"
    :field="fieldConfig"
    dataType="array"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  jsonArray: '[{"id": 1, "name": "项目1"}, {"id": 2, "name": "项目2"}]'
})

const fieldConfig = ref({
  fieldName: 'jsonArray',
  label: 'JSON数组',
  type: 'base-json',
  preps: {
    rows: 5
  }
})
</script>
```

## 注意事项

1. 组件支持两种数据类型：对象("object")和数组("array")，通过 [dataType] 属性指定
2. 提供两种编辑模式：
   - 设计模式：通过表单界面编辑键值对
   - 开发模式：通过JSON编辑器直接编辑原始JSON数据
3. 数据以JSON字符串形式存储在表单数据中
4. 使用JSON5库进行解析和序列化，支持更宽松的JSON格式
5. 设计模式下会验证表单数据后再保存
6. 组件会根据 [dataType] 自动处理对象和数组的转换逻辑