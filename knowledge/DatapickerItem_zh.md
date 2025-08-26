# DatapickerItem 数据选择器组件

## 概述
DatapickerItem 是一个数据选择器组件，基于 StarHorseDataSelector 实现。用于从树形结构数据中选择单个或多个数据项，支持远程数据加载和本地数据两种模式。

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

无特定公开方法。

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
  dataUrl?: string;       // 数据接口地址
  datas?: Array<any>;     // 本地数据
  multiple?: boolean;     // 是否多选
  displayName?: string;   // 显示名称字段
  displayValue?: string;  // 显示值字段
  // 其他 StarHorseDataSelector 支持的属性
}
```

## 使用示例

### 使用远程数据
```vue
<template>
  <datapicker-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  selectedData: ''  // 单选模式下存储选中值
  // 或者
  // selectedData: []  // 多选模式下存储选中值数组
})

const fieldConfig = ref({
  fieldName: 'selectedData',
  label: '数据选择',
  type: 'datapicker',
  preps: {
    dataUrl: '/api/data/tree',     // 数据接口地址
    multiple: false,               // 单选模式
    displayName: 'name',           // 显示名称字段
    displayValue: 'value'          // 显示值字段
  }
})
</script>
```

### 使用本地数据
```vue
<template>
  <datapicker-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  selectedData: []
})

const fieldConfig = ref({
  fieldName: 'selectedData',
  label: '数据选择',
  type: 'datapicker',
  preps: {
    multiple: true,                // 多选模式
    datas: [                       // 本地数据
      {
        name: '选项1',
        value: '1',
        children: [
          {
            name: '子选项1-1',
            value: '1-1'
          }
        ]
      },
      {
        name: '选项2',
        value: '2'
      }
    ]
  }
})
</script>
```

## 注意事项

1. 组件基于 StarHorseDataSelector 实现，具有数据选择功能
2. 支持单选和多选模式，通过 [preps.multiple] 配置
3. 可以通过 [preps.dataUrl] 加载远程数据或通过 [preps.datas] 使用本地数据
4. 选中数据存储在 [formData[fieldName]] 中，单选时为值，多选时为数组
5. 组件会自动处理数据的双向绑定
6. 支持通过 [preps.displayName] 和 [preps.displayValue] 配置显示字段
7. 当数据发生变化时会触发 change 事件