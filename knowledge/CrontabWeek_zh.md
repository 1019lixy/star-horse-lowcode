# Crontab-Week 组件

## 概述
Crontab-Week 是 Cron 表达式生成器中的星期字段配置组件，用于配置 Cron 表达式中的星期字段。它提供了多种星期字段配置选项，包括每日、不指定、周期、循环、月末、指定等。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| check | Function | - | 数字校验函数 |
| cron | Object | - | Cron 表达式对象 |

## 功能特性

1. **多种配置选项**：支持每日、不指定、周期、循环、月末、指定等多种配置方式
2. **数值校验**：对输入的数值进行范围校验（1-7，表示星期一到星期日）
3. **实时更新**：配置变化时实时更新 Cron 表达式
4. **可视化界面**：提供友好的可视化配置界面
5. **中文显示**：星期显示为中文（周一到周日）

## 配置选项

### 1. 每日
- 值：`*`
- 说明：每天执行

### 2. 不指定
- 值：`?`
- 说明：不指定具体星期（与日字段互斥）

### 3. 周期
- 值：`start-end`
- 说明：指定星期范围，例如 `1-5` 表示星期一到星期五执行

### 4. 循环
- 值：`week#day`
- 说明：指定第几周的星期几，例如 `2#1` 表示每月第2周的星期一执行

### 5. 本月最后一个
- 值：`dayL`
- 说明：指定本月最后一个星期几，例如 `5L` 表示本月最后一个星期五执行

### 6. 指定
- 值：`day1,day2,...`
- 说明：指定具体星期几，例如 `1,3,5` 表示星期一、三、五执行

## 数据属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| radioValue | Number | 1 | 当前选中的配置选项 |
| cycle01 | Number | 0 | 周期起始星期 |
| cycle02 | Number | 0 | 周期结束星期 |
| average01 | Number | 0 | 循环指定周数 |
| average02 | Number | 1 | 循环指定星期 |
| weekday | Number | 0 | 本月最后一个星期几 |
| checkboxList | Array | [] | 指定星期几列表 |
| weekList | Array | ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] | 星期显示列表 |

## 方法

### cycleTotalFun()
计算周期配置的值，格式为 "起始星期-结束星期"。

### averageTotalFun()
计算循环配置的值，格式为 "周数#星期"。

### weekdayCheckFun()
计算本月最后一个星期几的配置值，格式为 "星期L"。

### checkboxStringFun()
计算指定星期几配置的值，格式为 "星期1,星期2,..."。

### radioChange()
单选按钮值变化时的处理函数，根据选中选项更新 Cron 表达式。

### cycleChange()
周期配置变化时的处理函数。

### averageChange()
循环配置变化时的处理函数。

### weekdayChange()
本月最后一个星期几配置变化时的处理函数。

### checkboxChange()
指定星期几配置变化时的处理函数。

## 事件

### update
当配置发生变化时触发，传递字段名、值和来源信息。

## 使用示例

```vue
<template>
  <CrontabWeek 
    :check="checkNumber" 
    :cron="cronObject" 
    @update="handleWeekUpdate" 
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

const handleWeekUpdate = (field, value, from) => {
  console.log(`星期字段更新: ${field} = ${value} (来自: ${from})`);
};
</script>
```

## 注意事项

1. 星期范围为 1-7（1表示星期日，2表示星期一，依此类推）
2. 星期字段和日字段不能同时指定具体值，其中一个必须为 "?"
3. 循环配置中周数范围为 1-4，星期范围为 1-7
4. 指定星期几时可以多选
5. 配置变化时会实时更新 Cron 表达式