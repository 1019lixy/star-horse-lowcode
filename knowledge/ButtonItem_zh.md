# ButtonItem 按钮组件

## 概述
ButtonItem 是一个功能丰富的按钮组件，基于 Element Plus 的 el-button 实现。支持多种操作类型，包括调用接口、执行代码、打开对话框等，并可配置确认提示、参数传递等功能。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| isDesign | Boolean | 否 | false | 是否为设计模式 |
| disabled | Boolean | 否 | false | 是否禁用 |
| showFormItem | Boolean | 否 | false | 是否显示表单项 |
| bareFlag | Boolean | 否 | false | 是否为简洁模式 |
| isSearch | Boolean | 否 | false | 是否为搜索模式 |
| field | Object | 是 | - | 字段配置 |

## Events

| 事件名 | 参数 | 说明 |
|-------|------|------|
| selfFunc | - | 自定义函数事件 |
| selectItem | - | 选择项事件 |

## 方法

### openDialog
打开按钮操作对话框
```typescript
openDialog(): Promise<void>
```

### close
关闭对话框
```typescript
close(): void
```

### dynamicFunc
执行按钮功能
```typescript
dynamicFunc(code: any): void
```

### operResultAction
处理对话框确认操作
```typescript
operResultAction(): Promise<void>
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;      // 字段名
  label: string;          // 按钮文本
  preps?: BtnAction;      // 按钮操作配置
}
```

### 按钮操作配置 (BtnAction)
```typescript
interface BtnAction {
  viewType?: string;      // 视图类型("form"/"usercomp"/"code"/"inter"/"method")
  icon?: string;          // 按钮图标
  code?: string;          // 执行代码
  needConfirm?: boolean;  // 是否需要确认
  confirmMsg?: string;    // 确认消息
  fieldList?: Array<any>; // 表单字段列表
  componentName?: string; // 组件名称
  params?: any;           // 参数
  url?: string;           // 接口地址
  method?: string;        // HTTP方法
  isDynamicParam?: string;// 是否动态参数("Y"/"N")
  actions?: Function;     // 执行函数
  afterAction?: string;   // 执行后操作
  dialogTitle?: string;   // 对话框标题
  boxWidth?: string;      // 对话框宽度
  isShowReset?: boolean;  // 是否显示重置按钮
  dialogBtn?: string;     // 对话框按钮文本
}
```

### 动态参数字段 (DynamicParamField)
```typescript
interface DynamicParamField {
  paramName: string;      // 参数名
  defaultValue: any;      // 默认值
  matchType: string;      // 匹配类型
}
```

## 使用示例

### 基础按钮
```vue
<template>
  <button-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({})

const fieldConfig = ref({
  fieldName: 'button',
  label: '点击按钮',
  type: 'button',
  preps: {
    icon: 'edit'  // 按钮图标
  }
})
</script>
```

### 调用接口按钮
```vue
<template>
  <button-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  id: 123
})

const fieldConfig = ref({
  fieldName: 'apiButton',
  label: '调用接口',
  type: 'button',
  preps: {
    viewType: 'inter',           // 接口调用模式
    url: '/api/data/process',    // 接口地址
    method: 'POST',              // HTTP方法
    isDynamicParam: 'Y',         // 使用动态参数
    params: [                    // 参数配置
      {
        paramName: 'id',
        defaultValue: '',
        matchType: 'eq'
      }
    ],
    needConfirm: true,           // 需要确认
    confirmMsg: '确定要执行此操作吗？'  // 确认消息
  }
})
</script>
```

### 执行代码按钮
```vue
<template>
  <button-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({})

const fieldConfig = ref({
  fieldName: 'codeButton',
  label: '执行代码',
  type: 'button',
  preps: {
    viewType: 'code',            // 代码执行模式
    code: 'console.log("执行了自定义代码")'  // 要执行的代码
  }
})
</script>
```

### 打开表单对话框按钮
```vue
<template>
  <button-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({})

const fieldConfig = ref({
  fieldName: 'formButton',
  label: '打开表单',
  type: 'button',
  preps: {
    viewType: 'form',            // 表单模式
    dialogTitle: '填写信息',      // 对话框标题
    boxWidth: '50%',             // 对话框宽度
    fieldList: [                 // 表单字段
      {
        fieldName: 'name',
        label: '姓名',
        type: 'input'
      },
      {
        fieldName: 'email',
        label: '邮箱',
        type: 'input'
      }
    ]
  }
})
</script>
```

## 注意事项

1. 组件支持多种操作类型，通过 [preps.viewType] 指定
2. 支持确认提示功能，通过 [preps.needConfirm] 和 [preps.confirmMsg] 配置
3. 可以调用远程接口，通过 [preps.url] 和 [preps.method] 配置
4. 支持动态参数传递，通过 [preps.isDynamicParam] 和 [preps.params] 配置
5. 可以执行自定义代码，通过 [preps.code] 配置
6. 支持打开对话框显示表单或自定义组件
7. 按钮可以配置图标，通过 [preps.icon] 指定