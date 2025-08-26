# Crontab-Month 组件

## 概述
Crontab-Month 是 Cron 表达式生成器中的月份字段配置组件，用于配置 Cron 表达式中的月份字段。它提供了多种月份字段配置选项，包括每月、周期、循环、指定等。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| check | Function | - | 数字校验函数 |
| cron | Object | - | Cron 表达式对象 |

## 功能特性

1. **多种配置选项**：支持每月、周期、循环、指定等多种配置方式
2. **数值校验**：对输入的数值进行范围校验（1-12）
3. **实时更新**：配置变化时实时更新 Cron 表达式
4. **可视化界面**：提供友好的可视化配置界面

## 配置选项

### 1. 每月
- 值：`*`
- 说明：每月执行

### 2. 周期
- 值：`start-end`
- 说明：指定月份范围，例如 `1-6` 表示每年1月到6月每月执行

### 3. 循环
- 值：`start/interval`
- 说明：从指定月份开始，每隔指定月数执行，例如 `1/3` 表示从1月开始每3个月执行一次

### 4. 指定
- 值：`month1,month2,...`
- 说明：指定具体月份，例如 `1,4,7,10` 表示每年1月、4月、7月、10月执行

## 数据属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| radioValue | Number | 1 | 当前选中的配置选项 |
| cycle01 | Number | 1 | 周期起始月份 |
| cycle02 | Number | 2 | 周期结束月份 |
| average01 | Number | 1 | 循环起始月份 |
| average02 | Number | 1 | 循环间隔月数 |
| checkboxList | Array | [] | 指定月份列表 |

## 方法

### cycleTotalFun()
计算周期配置的值，格式为 "起始月份-结束月份"。

### averageTotalFun()
计算循环配置的值，格式为 "起始月份/间隔月数"。

### checkboxStringFun()
计算指定月份配置的值，格式为 "月份1,月份2,..."。

### radioChange()
单选按钮值变化时的处理函数，根据选中选项更新 Cron 表达式。

### cycleChange()
周期配置变化时的处理函数。

### averageChange()
循环配置变化时的处理函数。

### checkboxChange()
指定月份配置变化时的处理函数。

## 事件

### update
当配置发生变化时触发，传递字段名、值和来源信息。

## 使用示例

```vue
<template>
  <CrontabMonth 
    :check="checkNumber" 
    :cron="cronObject" 
    @update="handleMonthUpdate" 
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

const handleMonthUpdate = (field, value, from) => {
  console.log(`月份字段更新: ${field} = ${value} (来自: ${from})`);
};
</script>
```

## 注意事项

1. 月份范围为 1-12（1月-12月）
2. 循环间隔最小为1个月
3. 指定月份时可以多选
4. 配置变化时会实时更新 Cron 表达式