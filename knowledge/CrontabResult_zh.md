# Crontab-Result 组件

## 概述
Crontab-Result 是 Cron 表达式生成器中的结果展示组件，用于计算并展示给定 Cron 表达式最近5次的执行时间。它通过解析 Cron 表达式的各个字段，计算出未来可能的执行时间点。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| ex | String | - | Cron 表达式字符串 |

## 功能特性

1. **执行时间计算**：计算给定 Cron 表达式最近5次的执行时间
2. **多字段解析**：解析秒、分、时、日、月、周、年等所有字段
3. **复杂规则支持**：支持各种复杂的 Cron 表达式规则
4. **结果展示**：以标签形式展示计算出的执行时间
5. **日期合法性校验**：自动校验日期的合法性

## 数据属性

| 属性名 | 类型 | 说明 |
|--------|------|------|
| dayRule | String | 日期规则类型 |
| dayRuleSup | Any/Array | 日期规则补充信息 |
| dateArr | Array | 各时间字段的可能值数组 |
| resultList | Array | 计算出的执行时间结果列表 |
| isShow | Boolean | 是否显示计算结果 |

## 核心方法

### expressionChange()
表达式值变化时的主处理函数，负责计算最近5次执行时间：
1. 解析 Cron 表达式的各个字段
2. 根据规则生成各时间字段的可能值数组
3. 通过多层循环计算出最近5次的执行时间
4. 处理各种特殊情况（月末、工作日、星期等）

### getIndex(arr, value)
计算指定值在数组中的索引位置，用于定位当前时间在可能值数组中的位置。

### getYearArr(rule, year)
获取年份字段的可能值数组。

### getMonthArr(rule)
获取月份字段的可能值数组。

### getWeekArr(rule)
获取星期字段的可能值数组，并设置相应的日期规则。

### getDayArr(rule)
获取日期字段的可能值数组，并设置相应的日期规则。

### getHourArr(rule)
获取小时字段的可能值数组。

### getMinArr(rule)
获取分钟字段的可能值数组。

### getSecondArr(rule)
获取秒字段的可能值数组。

### getOrderArr(min, max)
根据传入的最小值和最大值返回一个顺序数组。

### getAssignArr(rule)
根据规则中指定的零散值返回一个数组。

### getAverageArr(rule, limit)
根据算术规则计算返回一个数组。

### getCycleArr(rule, limit, status)
根据规则返回一个具有周期性的数组。

### compare(value1, value2)
比较数字大小，用于数组排序。

### formatDate(value, type)
格式化日期，支持返回完整日期或星期几。

### checkDate(value)
检查日期是否存在，校验日期的合法性。

## 特殊规则处理

### 月末处理
- lastDay: 本月最后一天
- lastWeek: 本月最后一个星期几

### 工作日处理
- workDay: 指定日期最近的工作日

### 星期处理
- weekDay: 指定星期几
- assWeek: 指定第几周的星期几

## 使用示例

```vue
<template>
  <CrontabResult :ex="cronExpression" />
</template>

<script setup>
import { ref } from 'vue'

const cronExpression = ref('0 0 12 * * ?')
</script>
```

## 注意事项

1. 最多计算最近100年内的执行时间
2. 最多展示最近5次的执行时间
3. 自动处理月末、闰年等特殊情况
4. 支持复杂的工作日和星期规则
5. 当无法计算出符合条件的时间时会显示提示信息