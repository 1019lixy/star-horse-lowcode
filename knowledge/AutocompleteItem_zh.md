# AutocompleteItem 自动完成组件

## 概述
AutocompleteItem 是一个自动完成组件，基于 Element Plus 的 el-autocomplete 实现，用于提供输入建议和自动完成功能。组件支持本地数据过滤和远程数据获取。

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

### querySearch
查询搜索建议数据
```typescript
querySearch(queryString: string, cb: (arg: any) => void): Promise<void>
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
  dataSource?: string;    // 数据源类型("url"表示远程数据)
  selectLabel?: string;   // 选择标签字段
  values?: Array<any>;    // 选项数据
}
```

### 搜索参数 (SearchParams)
```typescript
interface SearchParams {
  propertyName: string;   // 属性名
  value: any;             // 值
  operation: string;      // 操作符
}
```

## 使用示例

### 使用本地数据
```vue
<template>
  <autocomplete-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  autoComplete: ''
})

const fieldConfig = ref({
  fieldName: 'autoComplete',
  label: '自动完成',
  type: 'autocomplete',
  preps: {
    values: [
      { value: 'vue', label: 'Vue.js' },
      { value: 'element', label: 'Element UI' },
      { value: 'react', label: 'React' }
    ]
  }
})
</script>
```

### 使用远程数据
```vue
<template>
  <autocomplete-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  autoComplete: ''
})

const fieldConfig = ref({
  fieldName: 'autoComplete',
  label: '自动完成',
  type: 'autocomplete',
  preps: {
    dataSource: 'url',           // 使用远程数据
    selectLabel: 'name',         // 搜索字段名
    dataUrl: '/api/search',      // 数据接口地址
    httpMethod: 'GET'            // HTTP方法
  }
})
</script>
```

## 注意事项

1. 组件支持本地数据过滤和远程数据获取两种模式
2. 本地数据模式下，通过 [preps.values] 提供选项数据
3. 远程数据模式下，通过 [preps.dataSource] 设置为 "url" 并配置相关接口信息
4. 输入时会自动触发 [querySearch] 方法获取建议数据
5. 支持通过 [formData[fieldName]OptionList] 动态更新选项数据
6. 组件会自动处理数据的初始化和更新