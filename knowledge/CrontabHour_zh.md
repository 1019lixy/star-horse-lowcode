# Crontab-Hour 组件

## 概述
Crontab-Hour 是 Cron 表达式生成器中的小时字段配置组件，用于配置 Cron 表达式中的小时字段。它提供了多种小时字段配置选项，包括每小时、周期、循环、指定等。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| check | Function | - | 数字校验函数 |
| cron | Object | - | Cron 表达式对象 |

## 功能特性

1. **多种配置选项**：支持每小时、周期、循环、指定等多种配置方式
2. **数值校验**：对输入的数值进行范围校验（0-23）
3. **实时更新**：配置变化时实时更新 Cron 表达式
4. **可视化界面**：提供友好的可视化配置界面

## 配置选项

### 1. 每小时
- 值：`*`
- 说明：每小时执行

### 2. 周期
- 值：`start-end`
- 说明：指定小时范围，例如 `9-17` 表示每天9点到17点每小时执行

### 3. 循环
- 值：`start/interval`
- 说明：从指定小时开始，每隔指定小时执行，例如 `0/2` 表示从0点开始每2小时执行一次

### 4. 指定
- 值：`hour1,hour2,...`
- 说明：指定具体小时，例如 `0,6,12,18` 表示每天0点、6点、12点、18点执行

## 数据属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| radioValue | Number | 1 | 当前选中的配置选项 |
| cycle01 | Number | 1 | 周期起始小时 |
| cycle02 | Number | 2 | 周期结束小时 |
| average01 | Number | 1 | 循环起始小时 |
| average02 | Number | 1 | 循环间隔小时 |
| checkboxList | Array | [] | 指定小时列表 |

## 方法

### cycleTotalFun()
计算周期配置的值，格式为 "起始小时-结束小时"。

### averageTotalFun()
计算循环配置的值，格式为 "起始小时/间隔小时"。

### checkboxStringFun()
计算指定小时配置的值，格式为 "小时1,小时2,..."。

### radioChange()
单选按钮值变化时的处理函数，根据选中选项更新 Cron 表达式。

### cycleChange()
周期配置变化时的处理函数。

### averageChange()
循环配置变化时的处理函数。

### checkboxChange()
指定小时配置变化时的处理函数。

## 事件

### update
当配置发生变化时触发，传递字段名、值和来源信息。

## 使用示例

```vue
<template>
  <CrontabHour 
    :check="checkNumber" 
    :cron="cronObject" 
    @update="handleHourUpdate" 
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

const handleHourUpdate = (field, value, from) => {
  console.log(`小时字段更新: ${field} = ${value} (来自: ${from})`);
};
</script>
```

## 注意事项

1. 小时范围为 0-23（24小时制）
2. 循环间隔最小为1小时
3. 指定小时时可以多选
4. 配置变化时会实时更新 Cron 表达式