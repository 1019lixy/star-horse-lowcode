# AreaItem 地区选择组件

## 概述
AreaItem 是一个地区选择组件，基于 Element Plus 的 el-cascader 实现，用于选择省市区等地区信息。组件支持使用本地地区数据或远程动态数据。

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

无公开方法。

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
  user?: boolean;         // 是否使用用户数据
  options?: Array<any>;   // 选项数据
  props?: object;         // 属性配置
}
```

## 使用示例

### 基础用法
```vue
<template>
  <area-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  area: []
})

const fieldConfig = ref({
  fieldName: 'area',
  label: '地区',
  type: 'area',
  preps: {
    // 使用默认的省市区数据
  }
})
</script>
```

### 使用远程数据
```vue
<template>
  <area-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  area: []
})

const fieldConfig = ref({
  fieldName: 'area',
  label: '地区',
  type: 'area',
  preps: {
    user: true,  // 使用远程数据
    // 远程数据会通过 compDynamicData 方法获取
  }
})
</script>
```

## 注意事项

1. 组件默认使用本地的省市区数据（pcas-code.json）
2. 可通过 [preps.user] 设置为 true 来使用远程动态数据
3. 组件数据存储为 JSON 字符串格式，会自动进行序列化和反序列化
4. 支持通过 [formData[fieldName]OptionList] 动态更新选项数据
5. 组件会自动处理数据的初始化和更新