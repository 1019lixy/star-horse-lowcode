# Crontab-Second 组件

## 概述
Crontab-Second 是 Cron 表达式生成器中的秒字段配置组件，用于配置 Cron 表达式中的秒字段。它提供了多种秒字段配置选项，包括每秒、周期、循环、指定等。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| check | Function | - | 数字校验函数 |
| cron | Object | - | Cron 表达式对象 |
| radioParent | Any | - | 父级单选按钮值 |

## 功能特性

1. **多种配置选项**：支持每秒、周期、循环、指定等多种配置方式
2. **数值校验**：对输入的数值进行范围校验（0-59）
3. **实时更新**：配置变化时实时更新 Cron 表达式
4. **可视化界面**：提供友好的可视化配置界面

## 配置选项

### 1. 每秒
- 值：`*`
- 说明：每秒执行

### 2. 周期
- 值：`start-end`
- 说明：指定秒范围，例如 `0-30` 表示每分钟0秒到30秒每秒执行

### 3. 循环
- 值：`start/interval`
- 说明：从指定秒开始，每隔指定秒数执行，例如 `0/5` 表示从0秒开始每5秒执行一次

### 4. 指定
- 值：`sec1,sec2,...`
- 说明：指定具体秒数，例如 `0,15,30,45` 表示每分钟0秒、15秒、30秒、45秒执行

## 数据属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| radioValue | Number | 1 | 当前选中的配置选项 |
| cycle01 | Number | 1 | 周期起始秒 |
| cycle02 | Number | 2 | 周期结束秒 |
| average01 | Number | 1 | 循环起始秒 |
| average02 | Number | 1 | 循环间隔秒数 |
| checkboxList | Array | [] | 指定秒数列表 |

## 方法

### cycleTotalFun()
计算周期配置的值，格式为 "起始秒-结束秒"。

### averageTotalFun()
计算循环配置的值，格式为 "起始秒/间隔秒数"。

### checkboxStringFun()
计算指定秒数配置的值，格式为 "秒数1,秒数2,..."。

### radioChange()
单选按钮值变化时的处理函数，根据选中选项更新 Cron 表达式。

### cycleChange()
周期配置变化时的处理函数。

### averageChange()
循环配置变化时的处理函数。

### checkboxChange()
指定秒数配置变化时的处理函数。

## 事件

### update
当配置发生变化时触发，传递字段名、值和来源信息。

## 使用示例

```vue
<template>
  <CrontabSecond 
    :check="checkNumber" 
    :cron="cronObject" 
    @update="handleSecondUpdate" 
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

const handleSecondUpdate = (field, value, from) => {
  console.log(`秒字段更新: ${field} = ${value} (来自: ${from})`);
};
</script>
```

## 注意事项

1. 秒范围为 0-59
2. 循环间隔最小为1秒
3. 指定秒数时可以多选
4. 配置变化时会实时更新 Cron 表达式