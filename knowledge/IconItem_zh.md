# IconItem 图标选择组件

## 概述
IconItem 是一个图标选择组件，支持系统图标和自定义图标两种类型。用户可以通过弹出的图标列表选择需要的图标，支持搜索功能。

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

### assignIcon
选择并分配图标
```typescript
assignIcon(iconName: string): void
```

### dataSearch
搜索图标
```typescript
dataSearch(): void
```

### itemAction
处理图标选择事件
```typescript
itemAction(prep: any): void
```

### init
初始化组件
```typescript
init(): Promise<void>
```

## 数据结构

### 字段配置 (field)
```typescript
interface FieldConfig {
  fieldName: string;      // 字段名
  preps?: IconPreps;      // 图标配置参数
  actions?: object;       // 事件配置
  // 其他字段属性...
}
```

### 图标配置参数 (IconPreps)
```typescript
interface IconPreps {
  placement?: string;     // 弹出位置，默认'bottom-start'
  listView?: boolean;     // 是否为列表视图
  iconType?: string;      // 图标类型('system'/'custom')，默认'system'
}
```

### 图标数据结构
```typescript
interface IconData {
  value: string;          // 图标值
  name: string;           // 图标名称
}
```

## 使用示例

### 系统图标选择
```vue
<template>
  <icon-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  icon: 'Edit'  // 存储选中的图标名称
})

const fieldConfig = ref({
  fieldName: 'icon',
  label: '图标选择',
  type: 'icon',
  preps: {
    iconType: 'system'  // 使用系统图标
  }
})
</script>
```

### 自定义图标选择
```vue
<template>
  <icon-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  icon: 'home'  // 存储选中的图标类名
})

const fieldConfig = ref({
  fieldName: 'icon',
  label: '图标选择',
  type: 'icon',
  preps: {
    iconType: 'custom'  // 使用自定义图标
  }
})
</script>
```

## 注意事项

1. 组件支持系统图标和自定义图标两种类型，通过 [preps.iconType] 配置
2. 系统图标使用 Element Plus 的图标组件，自定义图标使用 StarHorseIcon 组件
3. 支持通过搜索框搜索图标，搜索区分大小写
4. 图标数据可以通过接口动态加载或使用本地数据
5. 组件会自动处理图标的双向绑定
6. 选中图标后会触发 change 事件
7. 弹出框的位置通过 [preps.placement] 配置
8. 支持列表视图模式，通过 [preps.listView] 配置