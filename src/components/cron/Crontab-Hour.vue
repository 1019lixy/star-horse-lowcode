<template>
  <el-form>
    <el-form-item>
      <el-radio v-model="radioValue" :label="1" border> 小时，允许的通配符[, - * /]</el-radio>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="radioValue" :label="2" border> 周期</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">从</span>
      <el-input-number v-model="cycle01" :min="0" :max="60"/>
      <span style="margin-left: 10px; margin-right: 5px">至</span>
      <el-input-number v-model="cycle02" :min="0" :max="60"/>
      <span style="margin-left: 10px; margin-right: 5px">小时</span>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="radioValue" :label="3" border>循环</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">从</span>
      <el-input-number v-model="average01" :min="0" :max="60"/>
      <span style="margin-left: 10px; margin-right: 5px">小时开始，每</span>
      <el-input-number v-model="average02" :min="0" :max="60"/>
      <span style="margin-left: 10px; margin-right: 5px">小时执行一次</span>
    </el-form-item>
    <el-form-item>
      <el-radio v-model="radioValue" :label="4" border> 指定</el-radio>
      <el-select clearable filterable collapse-tags v-model="checkboxList" placeholder="请选择小时" multiple>
        <el-option v-for="item in 24" :key="item" :value="item - 1" :label="item - 1"/>
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
<script lang="ts" setup name="crontab-hour">
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
let checkNum = ref(props.check);
const emits = defineEmits(['update']);
// 计算两个周期值
const cycleTotalFun = () => {
  cycle01.value = checkNum.value?.(cycle01.value, 0, 23);
  cycle02.value = checkNum.value?.(cycle02.value, 0, 23);
  return cycle01.value + '-' + cycle02.value;
};
// 计算平均用到的值
const averageTotalFun = () => {
  average01.value = checkNum.value?.(average01.value, 0, 23);
  average02.value = checkNum.value?.(average02.value, 1, 23);
  return average01.value + '/' + average02.value;
};
// 计算勾选的checkbox值合集
const checkboxStringFun = () => {
  let str = checkboxList.value.join();
  return str == '' ? '*' : str;
};
let cycleTotal = computed(() => cycleTotalFun());
let averageTotal = computed(() => averageTotalFun());
let checkboxString = computed(() => checkboxStringFun());
// 单选按钮值变化时
const radioChange = () => {
  if (radioValue.value === 1) {
    emits('update', 'hour', '*', 'hour');
    emits('update', 'day', '*', 'hour');
  } else {
    if (props.cron?.min === '*') {
      emits('update', 'min', '0', 'hour');
    }
    if (props.cron?.second === '*') {
      emits('update', 'second', '0', 'hour');
    }
  }
  switch (radioValue.value) {
    case 2:
      emits('update', 'hour', cycle01.value + '-' + cycle02.value);
      break;
    case 3:
      emits('update', 'hour', average01.value + '/' + average02.value);
      break;
    case 4:
      emits('update', 'hour', checkboxString.value);
      break;
  }
};
// 周期两个值变化时
const cycleChange = () => {
  if (radioValue.value == 2) {
    emits('update', 'hour', cycleTotal.value);
  }
};
// 平均两个值变化时
const averageChange = () => {
  if (radioValue.value == 3) {
    emits('update', 'hour', averageTotal.value);
  }
};
// checkbox值变化时
const checkboxChange = () => {
  if (radioValue.value == 4) {
    emits('update', 'hour', checkboxString.value);
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
  radioValue
});
</script>
