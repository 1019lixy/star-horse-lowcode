# Crontab-Day 组件

## 概述
Crontab-Day 是 Cron 表达式生成器中的日字段配置组件，用于配置 Cron 表达式中的日字段。它提供了多种日字段配置选项，包括每日、周期、循环、工作日、月末等。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| check | Function | - | 数字校验函数 |
| cron | Object | - | Cron 表达式对象 |

## 功能特性

1. **多种配置选项**：支持每日、不指定、周期、循环、工作日、月末、指定等多种配置方式
2. **数值校验**：对输入的数值进行范围校验（1-31）
3. **实时更新**：配置变化时实时更新 Cron 表达式
4. **可视化界面**：提供友好的可视化配置界面

## 配置选项

### 1. 每日
- 值：`*`
- 说明：每天执行

### 2. 不指定
- 值：`?`
- 说明：不指定具体日期（与周字段互斥）

### 3. 周期
- 值：`start-end`
- 说明：指定日期范围，例如 `1-10` 表示每月1号到10号

### 4. 循环
- 值：`start/interval`
- 说明：从指定日期开始，每隔指定天数执行，例如 `1/5` 表示从1号开始每5天执行一次

### 5. 工作日
- 值：`dayW`
- 说明：指定日期最近的工作日，例如 `15W` 表示15号最近的工作日

### 6. 本月最后一天
- 值：`L`
- 说明：每月最后一天执行

### 7. 指定
- 值：`day1,day2,...`
- 说明：指定具体日期，例如 `1,15,30` 表示每月1号、15号、30号

## 数据属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| radioValue | Number | 1 | 当前选中的配置选项 |
| workday | Number | 1 | 工作日指定的日期 |
| cycle01 | Number | 1 | 周期起始日期 |
| cycle02 | Number | 2 | 周期结束日期 |
| average01 | Number | 1 | 循环起始日期 |
| average02 | Number | 1 | 循环间隔天数 |
| checkboxList | Array | [] | 指定日期列表 |

## 方法

### cycleTotalFun()
计算周期配置的值，格式为 "起始日期-结束日期"。

### averageTotalFun()
计算循环配置的值，格式为 "起始日期/间隔天数"。

### workdayCheckFun()
计算工作日配置的值，格式为 "日期W"。

### checkboxStringFun()
计算指定日期配置的值，格式为 "日期1,日期2,..."。

### radioChange()
单选按钮值变化时的处理函数，根据选中选项更新 Cron 表达式。

### cycleChange()
周期配置变化时的处理函数。

### averageChange()
循环配置变化时的处理函数。

### workdayChange()
工作日配置变化时的处理函数。

### checkboxChange()
指定日期配置变化时的处理函数。

## 事件

### update
当配置发生变化时触发，传递字段名、值和来源信息。

## 使用示例

```vue
<template>
  <CrontabDay 
    :check="checkNumber" 
    :cron="cronObject" 
    @update="handleDayUpdate" 
  />
</template>

<script setup>
const checkNumber = (value, min, max) => {
  // 数字校验逻辑
  value = Math.floor(value);
  if (value < min) value = min;
  if (value > max) value = max;
  return value;
};

const cronObject = {
  second: "*",
  min: "*",
  hour: "*",
  day: "*",
  month: "*",
  week: "?",
  year: ""
};

const handleDayUpdate = (field, value, from) => {
  console.log(`日字段更新: ${field} = ${value} (来自: ${from})`);
};
</script>
```

## 注意事项

1. 日字段和周字段不能同时指定具体值，其中一个必须为 "?"
2. 日期范围为 1-31
3. 工作日配置会自动调整到最近的工作日
4. 月末配置使用 "L" 表示
5. 指定日期时可以多选