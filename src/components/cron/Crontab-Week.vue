<template>
  <div class="cron-content">
    <div class="cron-item">
      <el-radio v-model="radioValue" :label="1" border> 周，允许的通配符[, - * / L #]</el-radio>
    </div>
    <div class="cron-item">
      <el-radio v-model="radioValue" :label="2" border> 不指定</el-radio>
    </div>
    <div class="cron-item">
      <el-radio v-model="radioValue" :label="3" border> 周期</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">从星期</span>
      <el-input-number v-model="cycle01" :min="1" :max="7" controls-position="right"/>
      <span style="margin-left: 10px; margin-right: 5px">至</span>
      <el-input-number v-model="cycle02" :min="1" :max="7" controls-position="right"/>
    </div>
    <div class="cron-item">
      <el-radio v-model="radioValue" :label="4" border> 循环</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">第</span>
      <el-input-number v-model="average01" :min="1" :max="4" controls-position="right"/>
      <span style="margin-left: 10px; margin-right: 5px">周的星期</span>
      <el-input-number v-model="average02" :min="1" :max="7" controls-position="right"/>
    </div>
    <div class="cron-item">
      <el-radio v-model="radioValue" :label="5" border>本月最后一个</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">星期</span>
      <el-input-number v-model="weekday" :min="1" :max="7" controls-position="right"/>
    </div>
    <div class="cron-item">
      <el-radio v-model="radioValue" :label="6" border> 指定</el-radio>
      <el-select clearable filterable collapse-tags v-model="checkboxList" placeholder="请选择星期几" multiple>
        <el-option v-for="(item, index) of weekList" :key="index" :value="index + 1" :label="item"/>
      </el-select>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script setup lang="ts" name="crontab-week">
import {computed, ref, watch} from 'vue';

const props = defineProps({
  check: {type: Function},
  cron: {type: Object}
});
const emits = defineEmits(['update']);
let weekday = ref(0);
let radioValue = ref(1);
let cycle01 = ref(0);
let cycle02 = ref(0);
let average01 = ref(0);
let average02 = ref(1);

let checkboxList = ref([]);
let weekList = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日']);

// 计算两个周期值
const cycleTotalFun = () => {
  cycle01.value = props.check?.(cycle01.value, 1, 7);
  cycle02.value = props.check?.(cycle02.value, 1, 7);
  return cycle01.value + '-' + cycle02.value;
};
// 计算平均用到的值
const averageTotalFun = () => {
  average01.value = props.check?.(average01.value, 1, 4);
  average02.value = props.check?.(average02.value, 1, 7);
  return average01.value + '#' + average02.value;
};
// 最近的工作日（格式）
const weekdayCheckFun = () => {
  weekday.value = props.check?.(weekday.value, 1, 7);
  return weekday.value;
};
// 计算勾选的checkbox值合集
const checkboxStringFun = () => {
  let str = checkboxList.value.join();
  return str == '' ? '*' : str;
};
let cycleTotal = computed(() => cycleTotalFun());
let averageTotal = computed(() => averageTotalFun());
let weekdayCheck = computed(() => weekdayCheckFun());
let checkboxString = computed(() => checkboxStringFun());
// 单选按钮值变化时
const radioChange = () => {
  if (radioValue.value === 1) {
    emits('update', 'week', '*');
    emits('update', 'year', '*');
  } else {
    if (props.cron?.month === '*') {
      emits('update', 'month', '0', 'week');
    }
    if (props.cron?.day === '*') {
      emits('update', 'day', '0', 'week');
    }
    if (props.cron?.hour === '*') {
      emits('update', 'hour', '0', 'week');
    }
    if (props.cron?.min === '*') {
      emits('update', 'min', '0', 'week');
    }
    if (props.cron?.second === '*') {
      emits('update', 'second', '0', 'week');
    }
  }
  switch (radioValue.value) {
    case 2:
      emits('update', 'week', '?');
      break;
    case 3:
      emits('update', 'week', cycle01.value + '-' + cycle02.value);
      break;
    case 4:
      emits('update', 'week', average01.value + '#' + average02.value);
      break;
    case 5:
      emits('update', 'week', weekday.value + 'L');
      break;
    case 6:
      emits('update', 'week', checkboxString.value);
      break;
  }
};
// 根据互斥事件，更改radio的值
// 周期两个值变化时
const cycleChange = () => {
  if (radioValue.value == 3) {
    emits('update', 'week', cycleTotal.value);
  }
};
// 平均两个值变化时
const averageChange = () => {
  if (radioValue.value == 4) {
    emits('update', 'week', averageTotal.value);
  }
};
// 最近工作日值变化时
const weekdayChange = () => {
  if (radioValue.value == 5) {
    emits('update', 'week', weekday.value + 'L');
  }
};
// checkbox值变化时
const checkboxChange = () => {
  if (radioValue.value == 6) {
    emits('update', 'week', checkboxString.value);
  }
};
watch(
    () => radioValue.value,
    (_val) => radioChange(),

);
watch(
    () => cycleTotal.value,
    (_val) => cycleChange(),

);
watch(
    () => averageTotal.value,
    (_val) => averageChange(),

);
watch(
    () => weekdayCheck.value,
    (_val) => weekdayChange(),

);
watch(
    () => checkboxString.value,
    (_val) => checkboxChange(),

);

defineExpose({
  cycle01,
  cycle02,
  average01,
  average02,
  checkboxList,
  weekday,
  radioValue
});
</script>
