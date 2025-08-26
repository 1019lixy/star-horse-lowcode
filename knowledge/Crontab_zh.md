# Crontab 组件

## 概述
Crontab 是一个完整的 Cron 表达式生成器组件，基于 Element Plus 的标签页组件实现。它提供了可视化界面来配置 Cron 表达式的各个时间字段，包括秒、分、时、日、月、周、年。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| expression | String | - | Cron 表达式 |
| modelValue | String | - | 双向绑定的 Cron 表达式值 |
| hideComponent | Array | - | 需要隐藏的组件列表 |

## 功能特性

1. **可视化配置**：通过标签页界面配置 Cron 表达式的各个字段
2. **多语言支持**：支持国际化显示
3. **表达式生成**：自动生成完整的 Cron 表达式
4. **表达式解析**：支持反解析已有的 Cron 表达式
5. **组件隐藏**：支持隐藏特定的时间字段组件
6. **表达式复制**：支持一键复制生成的表达式

## 数据结构

### contabValueObj
```javascript
{
  second: "*",   // 秒字段
  min: "*",      // 分字段
  hour: "*",     // 时字段
  day: "*",      // 日字段
  month: "*",    // 月字段
  week: "?",     // 周字段
  year: ""       // 年字段
}
```

## 方法

### contabValueStringFun()
生成完整的 Cron 表达式字符串，格式为："秒 分 时 日 月 周 年"

### shouldHide(key)
判断指定的时间字段组件是否应该隐藏。

### resolveExp()
反解析传入的 Cron 表达式，将其分解到各个字段组件中。

### updateContabValue(name, value, from)
更新指定字段的值，并触发表达式重新生成。

### getRefObj(name)
获取指定字段组件的引用对象。

### parseCheckList(refObj, value)
解析复选框列表的值。

### changeRadio(name, value)
根据字段值更改对应组件的单选按钮选项。

### checkNumber(value, minLimit, maxLimit)
校验数字格式，确保数值在指定范围内。

### clearCron()
清空 Cron 表达式，还原为默认值。

## 事件

### update:modelValue
当 Cron 表达式发生变化时触发，用于双向绑定。

## 依赖组件

- CrontabSecond: 秒字段配置组件
- CrontabMin: 分字段配置组件
- CrontabHour: 时字段配置组件
- CrontabDay: 日字段配置组件
- CrontabMonth: 月字段配置组件
- CrontabWeek: 周字段配置组件
- CrontabYear: 年字段配置组件
- CrontabResult: Cron 表达式结果展示组件

## 使用示例

```vue
<template>
  <div>
    <Crontab 
      v-model="cronExpression" 
      :hide-component="['second', 'year']"
      @update:modelValue="handleCronChange"
    />
    <p>生成的表达式: {{ cronExpression }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const cronExpression = ref('0 0 12 * * ?')

const handleCronChange = (value) => {
  console.log('Cron 表达式已更新:', value)
}
</script>
```

## 样式说明

1. **标签页布局**：使用 Element Plus 的 border-card 样式
2. **结果展示区**：显示生成的完整表达式和各字段值
3. **响应式设计**：支持自适应高度的布局

## 注意事项

1. 表达式格式为："秒 分 时 日 月 周 年"
2. 支持隐藏不需要的时间字段组件
3. 提供了表达式反解析功能，可以加载已有的表达式
4. 支持一键复制生成的表达式
5. 各字段组件提供了多种配置选项，如范围、间隔、指定值等