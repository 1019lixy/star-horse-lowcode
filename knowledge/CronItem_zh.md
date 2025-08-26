# CronItem 定时任务组件

## 概述
CronItem 是一个定时任务配置组件，集成了 Cron 表达式生成器。用户可以通过图形化界面配置定时任务表达式，并将生成的 Cron 表达式存储在表单数据中。

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

### open
打开 Cron 表达式配置对话框
```typescript
open(): void
```

### close
关闭 Cron 表达式配置对话框
```typescript
close(): void
```

### submit
提交 Cron 表达式配置
```typescript
submit(): void
```

### resetForm
重置 Cron 表达式配置
```typescript
resetForm(): void
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

## 使用示例

```vue
<template>
  <cron-item
    v-model:formData="formData"
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  cronExpression: ''  // 存储生成的 Cron 表达式
})

const fieldConfig = ref({
  fieldName: 'cronExpression',
  label: '定时任务',
  type: 'cron',
  preps: {
    // Cron 组件配置
  }
})
</script>
```

## 注意事项

1. 组件通过输入框显示当前的 Cron 表达式
2. 点击输入框后的时钟图标按钮打开图形化配置界面
3. 配置完成后点击对话框的确定按钮保存表达式
4. 支持重置功能，可清除当前配置
5. Cron 表达式以字符串形式存储在表单数据中
6. 组件基于自定义的 Crontab 组件实现图形化配置
7. 组件会自动处理表达式的绑定和更新