# Crontab-Year 组件

## 概述
Crontab-Year 是 Cron 表达式生成器中的年字段配置组件，用于配置 Cron 表达式中的年字段。它提供了多种年字段配置选项，包括不指定、每年、周期、循环、指定等。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| check | Function | - | 数字校验函数 |
| month | Any | - | 月份信息 |
| cron | Object | - | Cron 表达式对象 |

## 功能特性

1. **多种配置选项**：支持不指定、每年、周期、循环、指定等多种配置方式
2. **年份范围**：支持从当前年份开始的100年内配置
3. **实时更新**：配置变化时实时更新 Cron 表达式
4. **可视化界面**：提供友好的可视化配置界面

## 配置选项

### 1. 不指定
- 值：`""`（空字符串）
- 说明：不指定具体年份

### 2. 每年
- 值：`*`
- 说明：每年执行

### 3. 周期
- 值：`start-end`
- 说明：指定年份范围，例如 `2023-2030` 表示2023年到2030年每年执行

### 4. 循环
- 值：`start/interval`
- 说明：从指定年份开始，每隔指定年数执行，例如 `2023/2` 表示从2023年开始每2年执行一次

### 5. 指定
- 值：`year1,year2,...`
- 说明：指定具体年份，例如 `2023,2025,2027` 表示2023年、2025年、2027年执行

## 数据属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| fullYear | Number | 当前年份 | 当前年份值 |
| radioValue | Number | 1 | 当前选中的配置选项 |
| cycle01 | Number | 0 | 周期起始年份 |
| cycle02 | Number | 0 | 周期结束年份 |
| average01 | Number | 0 | 循环起始年份 |
| average02 | Number | 1 | 循环间隔年数 |
| checkboxList | Array | [] | 指定年份列表 |

## 方法

### cycleTotalFun()
计算周期配置的值，格式为 "起始年份-结束年份"。

### averageTotalFun()
计算循环配置的值，格式为 "起始年份/间隔年数"。

### checkboxStringFun()
计算指定年份配置的值，格式为 "年份1,年份2,..."。

### radioChange()
单选按钮值变化时的处理函数，根据选中选项更新 Cron 表达式。

### cycleChange()
周期配置变化时的处理函数。

### averageChange()
循环配置变化时的处理函数。

### checkboxChange()
指定年份配置变化时的处理函数。

## 事件

### update
当配置发生变化时触发，传递字段名、值和来源信息。

## 使用示例

```vue
<template>
  <CrontabYear 
    :check="checkNumber" 
    :cron="cronObject" 
    @update="handleYearUpdate" 
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

const handleYearUpdate = (field, value, from) => {
  console.log(`年份字段更新: ${field} = ${value} (来自: ${from})`);
};
</script>
```

## 注意事项

1. 年份范围为当前年份到100年后的年份
2. 循环间隔最小为1年
3. 指定年份时可以多选
4. 配置变化时会实时更新 Cron 表达式
5. 不指定年份时值为空字符串