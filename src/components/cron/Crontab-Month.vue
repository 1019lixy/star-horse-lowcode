<template>
  <div class="cron-content">
    <div class="cron-item">
      <el-radio v-model="radioValue" :label="1" border> 月，允许的通配符[, - * /]</el-radio>
    </div>
    <div class="cron-item">
      <el-radio v-model="radioValue" :label="2"> 周期</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">从</span>
      <el-input-number v-model="cycle01" :min="1" :max="12" controls-position="right"/>
      <span style="margin-left: 10px; margin-right: 5px">至</span>
      <el-input-number v-model="cycle02" :min="1" :max="12" controls-position="right"/>
      <span style="margin-left: 10px; margin-right: 5px">月</span>
    </div>
    <div class="cron-item">
      <el-radio v-model="radioValue" :label="3" border>循环</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">从</span>
      <el-input-number v-model="average01" :min="1" :max="12" controls-position="right"/>
      <span style="margin-left: 10px; margin-right: 5px">月开始，每</span>
      <el-input-number v-model="average02" :min="1" :max="12" controls-position="right"/>
      <span style="margin-left: 10px; margin-right: 5px">月执行一次</span>
    </div>
    <div class="cron-item">
      <el-radio v-model="radioValue" :label="4" border> 指定</el-radio>
      <el-select clearable collapse-tags filterable v-model="checkboxList" placeholder="请选择月份" multiple>
        <el-option v-for="item in 12" :key="item" :value="item" :label="item"/>
      </el-select>
    </div>
  </div>
</template>
<style lang="scss" scoped>

</style>
<script setup lang="ts" name="crontab-month">
import {computed, ref, watch} from 'vue';

let radioValue = ref(1);
let cycle01 = ref(1);
let cycle02 = ref(2);
let average01 = ref(1);
let average02 = ref(1);

let checkboxList = ref([]);
const props = defineProps({
  check: {type: Function},
  cron: {type: Object}
});

const emits = defineEmits(['update']);
// 计算两个周期值
const cycleTotalFun = () => {
  cycle01.value = props.check?.(cycle01.value, 1, 12);
  cycle02.value = props.check?.(cycle02.value, 1, 12);
  return cycle01.value + '-' + cycle02.value;
};
// 计算平均用到的值
const averageTotalFun = () => {
  average01.value = props.check?.(average01.value, 1, 12);
  average02.value = props.check?.(average02.value, 1, 12);
  return average01.value + '/' + average02.value;
};
// 计算勾选的checkbox值合集
const checkboxStringFun = () => {
  let str = checkboxList.value.join();
  return str == '' || str == '0' ? '*' : str;
};
let cycleTotal = computed(() => cycleTotalFun());
let averageTotal = computed(() => averageTotalFun());
let checkboxString = computed(() => checkboxStringFun());
// 单选按钮值变化时
const radioChange = () => {
  if (radioValue.value === 1) {
    emits('update', 'month', '*');
    emits('update', 'year', '*');
  } else {
    if (props.cron?.day === '*') {
      emits('update', 'day', '0', 'month');
    }
    if (props.cron?.hour === '*') {
      emits('update', 'hour', '0', 'month');
    }
    if (props.cron?.min === '*') {
      emits('update', 'min', '0', 'month');
    }
    if (props.cron?.second === '*') {
      emits('update', 'second', '0', 'month');
    }
  }
  switch (radioValue.value) {
    case 2:
      emits('update', 'month', cycle01.value + '-' + cycle02.value);
      break;
    case 3:
      emits('update', 'month', average01.value + '/' + average02.value);
      break;
    case 4:
      emits('update', 'month', checkboxString.value);
      break;
  }
};
// 周期两个值变化时
const cycleChange = () => {
  if (radioValue.value == 2) {
    emits('update', 'month', cycleTotal.value);
  }
};
// 平均两个值变化时
const averageChange = () => {
  if (radioValue.value == 3) {
    emits('update', 'month', averageTotal.value);
  }
};
// checkbox值变化时
const checkboxChange = () => {
  if (radioValue.value == 4) {
    emits('update', 'month', checkboxString.value);
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
    () => checkboxString.value,
    (_val) => checkboxChange(),

);

defineExpose({
  cycle01,
  cycle02,
  average01,
  average02,
  checkboxList,
  radioValue
});
</script>
