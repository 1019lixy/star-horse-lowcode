# CascadeItem 级联选择组件

## 概述
CascadeItem 是一个级联选择组件，基于 Element Plus 的 el-cascader 实现。支持单选和多选模式，可以动态加载数据，支持全选功能和动态添加选项。

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

### handleCheckAll
处理全选操作
```typescript
handleCheckAll(val: any): void
```

### onAddOption
显示添加选项界面
```typescript
onAddOption(): void
```

### onConfirm
确认添加选项
```typescript
onConfirm(): void
```

### clear
取消添加选项
```typescript
clear(): void
```

### initData
初始化数据
```typescript
initData(): Promise<void>
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;      // 字段名
  preps?: object;         // 配置参数
  // 其他字段属性...
}
```

### 配置参数 (preps)
```typescript
interface Preps {
  options?: Array<any>;   // 选项数据
  props?: object;         // 属性配置
  multiple?: boolean;     // 是否多选
  showFooter?: boolean;   // 是否显示底部
}
```

### 属性配置 (props)
```typescript
interface Props {
  label?: string;         // 标签字段名，默认"name"
  value?: string;         // 值字段名，默认"value"
  code?: string;          // 编码字段名
  multiple?: boolean;     // 是否多选
  checkStrictly?: boolean;// 是否严格模式，默认true
}
```

## 使用示例

### 基础用法
```vue
<template>
  <cascade-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  cascade: []
})

const fieldConfig = ref({
  fieldName: 'cascade',
  label: '级联选择',
  type: 'cascade',
  preps: {
    options: [
      {
        value: 'guide',
        label: 'Guide',
        children: [
          {
            value: 'disciplines',
            label: 'Disciplines',
            children: [
              {
                value: 'consistency',
                label: 'Consistency'
              }
            ]
          }
        ]
      }
    ]
  }
})
</script>
```

### 多选模式
```vue
<template>
  <cascade-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  cascade: []
})

const fieldConfig = ref({
  fieldName: 'cascade',
  label: '级联选择',
  type: 'cascade',
  preps: {
    multiple: true,         // 启用多选
    showFooter: true,       // 显示底部添加选项
    options: [
      {
        value: 'guide',
        label: 'Guide',
        children: [
          {
            value: 'disciplines',
            label: 'Disciplines'
          }
        ]
      }
    ]
  }
})
</script>
```

### 动态数据加载
```vue
<template>
  <cascade-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  cascade: []
})

const fieldConfig = ref({
  fieldName: 'cascade',
  label: '级联选择',
  type: 'cascade',
  preps: {
    dataUrl: '/api/cascade/data',  // 数据接口地址
    httpMethod: 'GET'              // HTTP方法
  }
})
</script>
```

## 注意事项

1. 组件支持单选和多选模式，通过 [preps.multiple] 配置
2. 支持动态添加选项功能，通过 [preps.showFooter] 启用
3. 多选模式下支持全选功能
4. 可以通过 [preps.options] 提供静态选项数据或通过接口动态加载
5. 支持通过 [formData[fieldName]OptionList] 动态更新选项数据
6. 组件会自动处理JSON数据的序列化和反序列化
7. 支持严格模式选择，通过 [preps.props.checkStrictly] 配置