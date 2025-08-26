# DividerItem 分割线组件

## 概述
DividerItem 是一个分割线组件，基于 Element Plus 的 el-divider 实现。用于在表单中创建分隔线，可设置方向、内容位置和显示文本。

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
  fieldName: string;           // 字段名
  preps?: DividerPreps;        // 分割线配置参数
  // 其他字段属性...
}
```

### 分割线配置参数 (DividerPreps)
```typescript
interface DividerPreps {
  direction?: string;          // 分割线方向('horizontal'/'vertical')，默认'horizontal'
  contentPosition?: string;    // 内容位置('left'/'center'/'right')，默认'center'
  content?: string;            // 分割线显示文本
}
```

## 使用示例

### 水平分割线
```vue
<template>
  <divider-item
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const fieldConfig = ref({
  fieldName: 'divider',
  label: '分割线',
  type: 'divider',
  preps: {
    direction: 'horizontal',     // 水平方向
    contentPosition: 'center',   // 内容居中
    content: '基本信息'          // 显示文本
  }
})
</script>
```

### 垂直分割线
```vue
<template>
  <divider-item
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const fieldConfig = ref({
  fieldName: 'divider',
  label: '分割线',
  type: 'divider',
  preps: {
    direction: 'vertical',       // 垂直方向
    content: ''                  // 垂直分割线通常不显示文本
  }
})
</script>
```

### 左对齐文本的分割线
```vue
<template>
  <divider-item
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const fieldConfig = ref({
  fieldName: 'divider',
  label: '分割线',
  type: 'divider',
  preps: {
    direction: 'horizontal',
    contentPosition: 'left',     // 内容左对齐
    content: '详细信息'          // 显示文本
  }
})
</script>
```

## 注意事项

1. 组件基于 Element Plus 的 el-divider 实现
2. 分割线方向通过 [preps.direction] 配置，支持 'horizontal' 和 'vertical'
3. 显示文本通过 [preps.content] 配置
4. 文本位置通过 [preps.contentPosition] 配置，支持 'left'、'center' 和 'right'
5. 组件会自动将 [preps.content] 的值存储到表单数据中对应字段
6. 垂直分割线通常不显示文本内容
7. 分割线组件通常不参与表单数据提交，主要用于界面布局