<template>
  <div class="cron-content">
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :value="1" :label="1" border>
        分钟，允许的通配符[, - * /]</el-radio
      >
    </div>
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :label="2" border
        >周期</el-radio
      >
      <span style="margin-left: 10px; margin-right: 5px">从</span>
      <el-input-number
        size="small"
        v-model="cycle01"
        :min="0"
        :max="60"
        controls-position="right"
      />
      <span style="margin-left: 5px; margin-right: 5px">至</span>
      <el-input-number
        size="small"
        v-model="cycle02"
        :min="0"
        :max="60"
        controls-position="right"
      />
      <span style="margin-left: 5px; margin-right: 5px">分钟</span>
    </div>
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :label="3" border>
        循环</el-radio
      >
      <span style="margin-left: 10px; margin-right: 5px">从</span>
      <el-input-number
        size="small"
        v-model="average01"
        :min="0"
        :max="60"
        controls-position="right"
      />
      <span style="margin-left: 10px; margin-right: 5px"> 分钟开始，每</span>
      <el-input-number
        size="small"
        v-model="average02"
        :min="0"
        :max="60"
        controls-position="right"
      />
      <span style="margin-left: 10px; margin-right: 5px"> 分钟执行一次</span>
    </div>
    <div class="cron-item">
      <el-radio size="small" v-model="radioValue" :label="4" border>
        指定</el-radio
      >
      <el-checkbox-group size="small" v-model="checkboxList">
        <el-checkbox
          class="my-[5px]"
          :border="true"
          v-for="item in 24"
          :key="item"
          :value="item - 1"
          :label="item < 11 ? '0' + (item - 1) : item - 1"
        />
      </el-checkbox-group>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
<script setup lang="ts" name="crontab-min">
import { computed, ref, watch } from "vue";

let radioValue = ref(1);
let cycle01 = ref(1);
let cycle02 = ref(2);
let average01 = ref(1);
let average02 = ref(1);

let checkboxList = ref([]);
const props = defineProps({
  check: { type: Function },
  cron: { type: Object },
});

const emits = defineEmits(["update"]);
// 计算两个周期值
const cycleTotalFun = () => {
  cycle01.value = props.check?.(cycle01.value, 0, 59);
  cycle02.value = props.check?.(cycle02.value, 0, 59);
  return cycle01.value + "-" + cycle02.value;
};
// 计算平均用到的值
const averageTotalFun = () => {
  average01.value = props.check?.(average01.value, 0, 59);
  average02.value = props.check?.(average02.value, 1, 59);
  return average01.value + "/" + average02.value;
};
// 计算勾选的checkbox值合集
const checkboxStringFun = () => {
  let str = checkboxList.value.join();
  return str == "" ? "?" : str;
};
let cycleTotal = computed(() => cycleTotalFun());
let averageTotal = computed(() => averageTotalFun());
let checkboxString = computed(() => checkboxStringFun());
// 单选按钮值变化时
const radioChange = () => {
  switch (radioValue.value) {
    case 1:
      emits("update", "min", "*", "min");
      break;
    case 2:
      emits("update", "min", cycle01.value + "-" + cycle02.value, "min");
      break;
    case 3:
      emits("update", "min", average01.value + "/" + average02.value, "min");
      break;
    case 4:
      emits("update", "min", checkboxString.value, "min");
      break;
  }
};
// 周期两个值变化时
const cycleChange = () => {
  if (radioValue.value == 2) {
    emits("update", "min", cycleTotal.value, "min");
  }
};
// 平均两个值变化时
const averageChange = () => {
  if (radioValue.value == 3) {
    emits("update", "min", averageTotal.value, "min");
  }
};
// checkbox值变化时
const checkboxChange = () => {
  if (radioValue.value == 4) {
    emits("update", "min", checkboxString.value, "min");
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
  radioValue,
});
</script>
