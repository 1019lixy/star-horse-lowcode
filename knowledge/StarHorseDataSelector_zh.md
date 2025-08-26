# StarHorseDataSelector 数据选择器组件

## 概述
StarHorseDataSelector 是一个数据选择器组件，基于 DataPicker 实现，支持从树形数据中选择单个或多个数据项。它提供了输入框标签显示和弹窗选择两种交互方式。

## Props

| 属性名 | 类型 | 是否必填 | 默认值 | 说明 |
|-------|------|---------|-------|------|
| modelValue | ModelValueType | 否 | - | 选中数据的值 |
| selectedData | any | 否 | - | 选中数据对象 |
| placeholder | String | 否 | "请选择" | 占位符 |
| dataUrl | String | 否 | - | 数据接口地址 |
| proxy | Boolean | 否 | false | 是否使用代理 |
| proxyUrl | String | 否 | - | 代理地址 |
| params | SearchParams[] | 否 | [] | 接口参数 |
| datas | Array<any> | 否 | [] | 本地数据 |
| pageSize | Number | 否 | 0 | 分页大小 |
| title | String | 否 | - | 标题 |
| compSize | String | 否 | "small" | 组件大小 |
| displayName | String | 否 | "name" | 显示名称字段 |
| displayValue | String | 否 | "value" | 显示值字段 |
| multiple | Boolean | 否 | false | 是否多选 |
| disabled | Boolean | 否 | false | 是否禁用 |
| checkStrictly | Boolean | 否 | true | 是否严格模式 |
| selectLeaf | Boolean | 否 | false | 是否只选择叶子节点 |
| showTagLength | Number | 否 | 3 | 显示标签长度 |

## Events

| 事件名 | 参数 | 说明 |
|-------|------|------|
| update:modelValue | modelValue: ModelValueType | 更新选中值时触发 |
| update:selectedData | selectData: any | 更新选中数据时触发 |
| selectedData | selectData: any | 选中数据变化时触发 |

## 方法

### openDataPicker
打开数据选择弹窗
```typescript
openDataPicker(): void
```

## 数据结构

### ModelValueType
```typescript
type ModelValueType = string | number | Array<string | number>;
```

### SearchParams
```typescript
interface SearchParams {
  fieldName: string;   // 字段名
  value: any;          // 值
  condition: string;   // 条件
}
```

## 使用示例

### 基础用法
```vue
<template>
  <star-horse-data-selector
    v-model="selectedValue"
    :data-url="dataUrl"
    placeholder="请选择数据"
    @selectedData="handleSelectedData"
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedValue = ref('')

const dataUrl = '/api/data/tree'

const handleSelectedData = (data) => {
  console.log('选中的数据:', data)
}
</script>
```

### 多选模式
```vue
<template>
  <star-horse-data-selector
    v-model="selectedValues"
    :data-url="dataUrl"
    :multiple="true"
    placeholder="请选择数据"
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedValues = ref([])

const dataUrl = '/api/data/tree'
</script>
```

### 使用本地数据
```vue
<template>
  <star-horse-data-selector
    v-model="selectedValue"
    :datas="localData"
    placeholder="请选择数据"
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedValue = ref('')

const localData = ref([
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
])
</script>
```

## 注意事项

1. 组件支持单选和多选模式，通过 [multiple] 属性控制
2. 可以通过 [dataUrl] 加载远程数据或通过 [datas] 使用本地数据
3. 选中数据通过 [modelValue] 双向绑定值，通过 [selectedData] 获取完整数据对象
4. 支持代理模式，通过 [proxy] 和 [proxyUrl] 属性配置
5. 可通过 [checkStrictly] 控制树节点选择的严格模式
6. 组件会自动处理数据的显示和值的同步