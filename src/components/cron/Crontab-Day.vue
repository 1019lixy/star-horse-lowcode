<template>
  <el-form>
    <el-form-item>
      <el-radio v-model="radioValue" :label="1" border> 日，允许的通配符[, - * / L M]</el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="radioValue" :label="2" border> 不指定</el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="radioValue" :label="3" border> 周期</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">从</span>
      <el-input-number v-model="cycle01" :min="0" :max="31"/>
      <span style="margin-left: 10px; margin-right: 5px">至</span>
      <el-input-number v-model="cycle02" :min="0" :max="31"/>
      <span style="margin-left: 10px; margin-right: 5px">日</span>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="radioValue" :label="4" border>循环</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">从</span>
      <el-input-number v-model="average01" :min="0" :max="31"/>
      <span style="margin-left: 10px; margin-right: 5px">号开始，每</span>
      <el-input-number v-model="average02" :min="0" :max="31"/>
      <span style="margin-left: 10px; margin-right: 5px">日执行一次</span>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="radioValue" :label="5" border>工作日</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">每月</span>
      <el-input-number v-model="workday" :min="0" :max="31"/>
      <span style="margin-left: 10px; margin-right: 5px">号最近的那个工作日</span>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="radioValue" :label="6" border> 本月最后一天</el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="radioValue" :label="7" border> 指定</el-radio>
      <el-select clearable filterable collapse-tags v-model="checkboxList" placeholder="请选择日期" multiple>
        <el-option v-for="item in 31" :key="item" :value="item" :label="item"/>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<style lang="scss" scoped>
.el-select {
  width: 250px;
}

.el-input-number {
  width: 150px;
}
</style>
<script setup lang="ts" name="crontab-day">
import {computed, ref, watch} from 'vue';

let radioValue = ref(1);
let workday = ref(1);
let cycle01 = ref(1);
let cycle02 = ref(2);
let average01 = ref(1);
let average02 = ref(1);

let checkboxList = ref([]);
const props = defineProps({
  check: {type: Function},
  cron: {type: Object}
});
let checkNum = ref(props.check);
const emits = defineEmits(['update']);
// 计算两个周期值
const cycleTotalFun = () => {
  cycle01.value = checkNum.value?.(cycle01.value, 1, 31);
  cycle02.value = checkNum.value?.(cycle02.value, 1, 31);
  return cycle01.value + '-' + cycle02.value;
};
// 计算平均用到的值
const averageTotalFun = () => {
  average01.value = checkNum.value?.(average01.value, 1, 31);
  average02.value = checkNum.value?.(average02.value, 1, 31);
  return average01.value + '/' + average02.value;
};
// 计算工作日格式
const workdayCheckFun = () => {
  workday.value = checkNum.value?.(workday.value, 1, 31);
  return workday.value;
};
// 计算勾选的checkbox值合集
const checkboxStringFun = () => {
  let str = checkboxList.value.join();
  return str == '' ? '*' : str;
};
let cycleTotal = computed(() => cycleTotalFun());
let averageTotal = computed(() => averageTotalFun());
let workdayCheck = computed(() => workdayCheckFun());
let checkboxString = computed(() => checkboxStringFun());
// 单选按钮值变化时
const radioChange = () => {
  if (radioValue.value === 1) {
    emits('update', 'day', '*', 'day');
    emits('update', 'week', '?', 'day');
    emits('update', 'month', '*', 'day');
  } else {
    if (props.cron?.hour === '*') {
      emits('update', 'hour', '0', 'day');
    }
    if (props.cron?.min === '*') {
      emits('update', 'min', '0', 'day');
    }
    if (props.cron?.second === '*') {
      emits('update', 'second', '0', 'day');
    }
  }
  switch (radioValue.value) {
    case 2:
      emits('update', 'day', '?');
      break;
    case 3:
      emits('update', 'day', cycle01.value + '-' + cycle02.value);
      break;
    case 4:
      emits('update', 'day', average01.value + '/' + average02.value);
      break;
    case 5:
      emits('update', 'day', workday.value + 'W');
      break;
    case 6:
      emits('update', 'day', 'L');
      break;
    case 7:
      emits('update', 'day', checkboxString.value);
      break;
  }
};
// 周期两个值变化时
const cycleChange = () => {
  if (radioValue.value == 3) {
    emits('update', 'day', cycleTotal.value);
  }
};
// 平均两个值变化时
const averageChange = () => {
  if (radioValue.value == 4) {
    emits('update', 'day', averageTotal.value);
  }
};
// 最近工作日值变化时
const workdayChange = () => {
  if (radioValue.value == 5) {
    emits('update', 'day', workday.value + 'W');
  }
};
// checkbox值变化时
const checkboxChange = () => {
  if (radioValue.value == 7) {
    emits('update', 'day', checkboxString.value);
  }
};
// 父组件传递的week发生变化触发
const weekChange = () => {
  //判断week值与day不能同时为“?”
  if (props.cron?.week == '?' && radioValue.value == 2) {
    radioValue.value = 1;
  } else if (props.cron?.week !== '?' && radioValue.value != 2) {
    radioValue.value = 2;
  }
};
watch(
    () => radioValue.value,
    (_val) => radioChange(),
    {
      immediate: true,
      deep: true
    }
);
watch(
    () => cycleTotal.value,
    (_val) => cycleChange(),
    {
      immediate: true,
      deep: true
    }
);
watch(
    () => averageTotal.value,
    (_val) => averageChange(),
    {
      immediate: true,
      deep: true
    }
);
watch(
    () => workdayCheck.value,
    (_val) => workdayChange(),
    {
      immediate: true,
      deep: true
    }
);
watch(
    () => checkboxString.value,
    (_val) => checkboxChange(),
    {
      immediate: true,
      deep: true
    }
);
defineExpose({
  cycle01,
  cycle02,
  average01,
  average02,
  checkboxList,
  workday,
  radioValue
});
</script>
